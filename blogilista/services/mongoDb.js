import 'dotenv/config';
import mongoose from 'mongoose';

const connectMongo = async () => {
  try {
    console.log(url);
    await mongoose.connect(url);
    console.log('Connected to Mongo database');
  } catch (err) {
    throw err;
  }
};

connectMongo().catch((err) => {
  console.log('Error connecting to Mongo database: ', err.message);
});
