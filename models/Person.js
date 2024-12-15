const mongoose = require('mongoose');

mongoose
// eslint-disable-next-line no-undef
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB');
  })

  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message);
  });

const Schema = mongoose.Schema;

const personSchema = new Schema({
  name: {
    required: true,
    type: String,
    min: 3,
  },
  number: {
    required: true,
    validate: {
      validator: function (v) {
        const numberArray = v.split('-');

        if (numberArray.length !== 2) {
          return false;
        } else if (
          !numberArray[0] ||
					numberArray[0].length > 3 ||
					numberArray[0].length < 1 ||
					!numberArray[1]
        ) {
          return false;
        }
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
    type: String,
    min: 8,
  },
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Person', personSchema);

