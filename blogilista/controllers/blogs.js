import { Router } from 'express';
import Blog from '../models/blogs.js';

const blogRouter = Router();

blogRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({});
  res.status(200).json(blogs);
});

blogRouter.post('/', async (req, res) => {
  const { title, author, url, likes } = req.body;

  if (!title || !url) {
    return res.sendStatus(400);
  }

  const blog = new Blog({
    title: title,
    author: author,
    url: url,
    likes: likes,
  });
  await blog.save().catch((err) => {
    console.log('Post error: ', err.message);
    return res.sendStatus(400);
  });
  return res.sendStatus(201);
});

blogRouter.delete('/:id', async (req, res) => {
  const id = req.params.id;

  await Blog.findByIdAndDelete(id).catch((err) => {
    console.log('Delete error: ', err.message);
    return res.sendStatus(400);
  });
  return res.sendStatus(200);
});

blogRouter.put('/:id', async (req, res) => {
  const id = req.params.id;
  const { likes } = req.body;

  await Blog.findByIdAndUpdate(id, { likes: likes }, { new: true }).catch(
    (err) => {
      console.log('Error has occured: ', err.message);
      return res.sendStatus(400);
    },
  );
  return res.sendStatus(200);
});

export default blogRouter;
