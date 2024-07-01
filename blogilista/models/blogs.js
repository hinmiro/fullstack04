import Blog from '../services/mongoDb.js';

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

export { getBlogs, createBlog };
