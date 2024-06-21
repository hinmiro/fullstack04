import Blog from '../services/mongoDb.js';

const getBlogs = () => {
  return Blog.find({}).then((res) => {
    return res;
  });
};

const createBlog = async ({ title, author, url, likes }) => {
  const blog = new Blog({
    title: title,
    author: author,
    url: url,
    likes: likes,
  });
  return blog
    .save()
    .then((res) => {
      console.log(`Added new blog ${title} from ${author}`);
      return 201;
    })
    .catch((err) => {
      console.log('Post error: ', err.message);
      return 400;
    });
};

export { getBlogs, createBlog };
