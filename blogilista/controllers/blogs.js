import { request, Router } from 'express';
import jwt from 'jsonwebtoken';
import Blog from '../models/blogs.js';
import User from '../models/user.js';

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

blogRouter.post('/', async (req, res, next) => {
  const { title, author, url, likes } = req.body;
  let decodedToken;
  try {
    decodedToken = jwt.verify(req.token, process.env.SECRET);
  } catch (err) {
    return res.status(401).json({ error: 'Malformed or missing token' });
  }

  const user = await User.findById(decodedToken.id);

  if (!title || !url) {
    return res.sendStatus(400);
  }

  const blog = new Blog({
    title: title,
    author: author,
    url: url,
    likes: likes,
    user: user.id,
  });
  const savedBlog = await blog.save().catch((err) => {
    console.log('Post error: ', err.message);
    return res.sendStatus(400);
  });
  await Blog.find({}).populate('user', { username: 1, name: 1 });
  const updatedBlogs = user.blogs.concat(savedBlog);
  await User.findByIdAndUpdate(user.id, { blogs: updatedBlogs }, { new: true });
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
