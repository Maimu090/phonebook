const express = require('express')
const app = express()
const morgan = require('morgan')

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
];
const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(n => n.id))
    : 0
  return maxId + 1
}

app.use(morgan('tiny')); // 'tiny' is one of the predefined formats

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({
      error: 'name missing'
    })
  }
  const persons = {
    contenet: body.content,
    important: body.important || false,
    date: new Date(),
    id: generateId(),
  }
  persons = persons.concat(person)
  response.json(person)
})


app.get('/api/persons', (request, response) => {
  response.json(persons)
})
app.get('/info', (request, response) => {
  response.send(`<p>Phonebook has info for ${persons.length} people</p>
  <p>${new Date()}</p>`)
})

// Helper function to generate unique IDs

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})


