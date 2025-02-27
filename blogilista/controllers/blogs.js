import { request, Router } from 'express';
import jwt from 'jsonwebtoken';
import Blog from '../models/blogs.js';
import User from '../models/user.js';
import { userExtractor } from '../middleware.js';
import Blogs from '../models/blogs.js';
import * as http from 'node:http';

const blogRouter = Router();

const getTokenFrom = (request) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.startsWith('Bearer ', '')) {
    return authorization.replace('Bearer ', '');
  }
  return null;
};

blogRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  res.status(200).json(blogs);
});

blogRouter.get('/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  res.status(200).json(blog);
});

blogRouter.post('/', userExtractor, async (req, res, next) => {
  const { title, url } = req.body;

  const user = req.user;

  if (!title || !url) {
    return res.sendStatus(400);
  }

  const blog = new Blog({
    title: title,
    url: url,
    likes: 0,
    user: user.id
  });
  const savedBlog = await blog.save().catch((err) => {
    console.log('Post error: ', err.message);
    return res.sendStatus(400);
  });
  await Blog.find({}).populate('user', { username: 1, name: 1 });
  const updatedBlogs = user.blogs.concat(savedBlog);
  await User.findByIdAndUpdate(user.id, { blogs: updatedBlogs }, { new: true });
  return res.status(201).json(savedBlog);
});

blogRouter.delete('/:id', userExtractor, async (req, res) => {
  const id = req.params.id;

  let blogFound = false;
  const user = req.user;

  for (const blog of user.blogs) {
    if (blog.toString() === id) {
      await Blog.findByIdAndDelete(id);
      blogFound = true;
      break;
    }
  }

  if (!blogFound) {
    return res.status(400).json({ error: 'No such blog found from database' });
  } else {
    return res.status(200).json({ message: 'Delete success' });
  }
});

blogRouter.put('/:id', async (req, res) => {
  const id = req.params.id;

  const likes = req.body.likes !== undefined ? req.body.likes + 1 : 0;
  if (typeof likes !== 'number' || likes < 0) {
    return res.status(400).json({ error: 'Invalid likes value' });
  }

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { likes: likes },
      { new: true, runValidators: true }
    );

    if (!updatedBlog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    return res.status(200).json(updatedBlog);
  } catch (err) {
    console.log('Error occurred: ', err.message);
  }
});

blogRouter.post('/:id/comment', async (req, res) => {
  const { comment } = req.body;
  const id = req.params.id;

  try {
    const blog = await Blogs.findByIdAndUpdate(
      id,
      { $push: { comments: req.body.comment } },
      { new: true, runValidators: true }
    );

    return res.status(200).json(blog);
  } catch (err) {
    console.log('Error: ', err.message);
    return res.status(400).json('Error happened');
  }
});

export default blogRouter;
