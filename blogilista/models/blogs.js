import Blog from '../services/mongoDb.js';
import { json } from 'express';

const getBlogs = async () => {
  return Blog.find({});
};

const createBlog = async ({ title, author, url, likes = 0 }) => {
  if (!title || !url) {
    return 400;
  }

  const blog = new Blog({
    title: title,
    author: author,
    url: url,
    likes: likes,
  });
  const response = await blog.save().catch((err) => {
    console.log('Post error: ', err.message);
    return 400;
  });
  return 201;
};

const deleteBlog = async (id) => {
  const response = await Blog.findByIdAndDelete(id).catch((err) => {
    console.log('Delete error: ', err.message);
    return 400;
  });
  return 200;
};

const updateLikes = async (id, body) => {
  const response = await Blog.findByIdAndUpdate(
    id,
    { likes: body.likes },
    { new: true },
  ).catch((err) => {
    console.log('Error has occured: ', err.message);
    return 400;
  });
  return 200;
};

export { getBlogs, createBlog, deleteBlog, updateLikes };
