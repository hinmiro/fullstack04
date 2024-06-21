import express from 'express';
import cors from 'cors';
import { getBlogs, createBlog } from './models/blogs.js';

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Blog rest api');
});

app.get('/api/blogs', async (req, res) => {
  res.status(200).json(await getBlogs());
});

app.post('/api/blogs', async (request, response) => {
  const result = await createBlog(request.body);
  if (result === 201) {
    return response.status(201).json({ message: 'New blog added' });
  } else {
    return response.sendStatus(400);
  }
});

export default app;
