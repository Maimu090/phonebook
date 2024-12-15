const express = require('express');
const morgan = require('morgan');
const app = express();
const cors = require('cors');
require('dotenv').config();

// models
const Person = require('./models/Person');

app.use(express.static('dist'));
app.use(express.json());
app.use(cors());

morgan.token('custom', (req) => {
  return 'POST' === req.method ? JSON.stringify(req.body) : ' ';
});

app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :custom'
  )
);

app.get('/info', (req, res, next) => {
  try {
    const persons = Person.estimatedDocumentCount({});
    const response = `
			<p>Phonebook has info for ${persons} people</p>
			<p>${new Date()}</p>
			`;
    res.send(response);
  } catch (err) {
    next(err);
  }
});

app.get('/api/persons/:id', (req, res, next) => {
  try {
    Person.findById(req.params.id)
      .then((person) => res.json(person))
      .catch((err) => next(err));
  } catch (err) {
    next(err);
  }
});

app.get('/api/persons', (req, res, next) => {
  try {
    Person.find({}).then((persons) => {
      res.json(persons);
    });
  } catch (err) {
    next(err);
  }
});

app.post('/api/persons', async (req, res, next) => {
  const person = req.body;

  if (!person.name || !person.number) {
    return res.status(404).json({
      error: 'Name and Number are required.',
    });
  }

  const alreadyExists = await Person.findOne({
    name: person.name,
  });

  if (alreadyExists) {
    return res.status(404).json({
      error: 'name must be unique',
    });
  }

  const newPerson = new Person(person);
  try {
    await newPerson.save();
    res.json(newPerson);
  } catch (error) {
    next(error);
  }
  res.json(person);
});

app.put('/api/persons/:id', async (req, res, next) => {
  const person = req.body;

  try {
    const personExists = await Person.findById(req.params.id);

    if (!personExists) {
      return res.status(400).send({
        error: 'Person with that id does not exists',
      });
    }

    const updatedPerson = {
      name: person.name,
      number: person.number,
    };

    const updated = await Person.findByIdAndUpdate(
      req.params.id,
      updatedPerson,
      {
        new: true,
      }
    );

    res.json(updated);
  } catch (err) {
    next(err);
  }
});

app.delete('/api/persons/:id', async (req, res, next) => {
  try {
    const personExists = await Person.findById(req.params.id);

    if (!personExists) {
      return res.status(400).send({
        error: 'Person with that id does not exists',
      });
    }
    Person.findByIdAndDelete(req.params.id).then(() => res.status(204).end());
  } catch (err) {
    next(err);
  }
});

const unknownEndpoint = (req, res) =>
  res.status(404).send({
    error: 'unknown endpoint',
  });

app.use(unknownEndpoint);
const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return res.status(400).send({
      error: 'malinformed id',
    });
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});