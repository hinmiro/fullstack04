import express from 'express';
import cors from 'cors';
import { getBlogs, createBlog, deleteBlog } from './models/blogs.js';

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
    return response.sendStatus(201);
  } else if (result === 400) {
    return response.sendStatus(400);
  }
});

app.delete('/api/blogs/:id', async (req, res) => {
  const result = await deleteBlog(req.params.id);
  if (result === 200) {
    return res.sendStatus(200);
  } else {
    return res.sendStatus(400);
  }
});

export default app;
