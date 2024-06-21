import 'dotenv/config';
import mongoose from 'mongoose';

mongoose.set('strictQuery', false);

const url = process.env.MONGO_URI;

mongoose
  .connect(url)
  .then((result) => {
    console.log('Connected to Mongo database');
  })
  .catch((err) => {
    console.log('Error connecting to Mongo database: ', err.message);
  });

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
});

blogSchema.set('toJSON', {
  transform: (document, returnedObj) => {
    returnedObj.id = returnedObj._id.toString();
    delete returnedObj._id;
    delete returnedObj.__v;
  },
});

export default mongoose.model('Blog', blogSchema);
