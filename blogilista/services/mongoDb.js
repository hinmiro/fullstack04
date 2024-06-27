import 'dotenv/config';
import mongoose from 'mongoose';

mongoose.set('strictQuery', false);

const url =
  process.env.NODE_ENV === 'test'
    ? process.env.TEST_MONGO_URI
    : process.env.MONGO_URI;

const connectMongo = async () => {
  try {
    await mongoose.connect(url);
    console.log('Connected to Mongo database');
  } catch (err) {
    throw err;
  }
};

connectMongo().catch((err) => {
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
