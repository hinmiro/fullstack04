import Blog from '../services/mongoDb.js';

const getBlogs = async () => {
  return Blog.find({});
};

const createBlog = async ({ title, author, url, likes }) => {
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
  console.log(`Added new blog ${response.title} from ${response.author}`);
  return 201;
};

export { getBlogs, createBlog };
