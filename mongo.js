const mongoose = require('mongoose');

const url = "mongodb+srv://maimunaibrahim808:maimoon123@cluster0.xy9tq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.set('strictQuery', false);
mongoose.connect(url);

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
});

const Note = mongoose.model('Note', noteSchema);

Note.find({}).then((result) => {
  console.log(result);
  mongoose.connection.close();
});

const note = new Note({
  content: 'Browser can execute only JavaScript',
  important: true,
});

// note.save().then((result) => {
// 	console.log('note saved!', result);
// 	mongoose.connection.close();
// });