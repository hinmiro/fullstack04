import express from 'express';
import cors from 'cors';
import usersRouter from './controllers/users.js';
import blogRouter from './controllers/blogs.js';
import mongoose from 'mongoose';
import 'dotenv/config';
import loginRouter from './controllers/login.js';
import { tokenExtractor } from './middleware.js';

const app = express();

const url =
  process.env.NODE_ENV === 'test'
    ? process.env.TEST_MONGO_URI
    : process.env.MONGO_URI;

mongoose.set('strictQuery', false);

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
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(tokenExtractor);

app.use('/api/users', usersRouter);
app.use('/api/blogs', blogRouter);
app.use('/api/login', loginRouter);

export default app;
