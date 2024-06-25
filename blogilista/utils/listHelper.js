import _ from 'lodash';

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  if (blogs.length > 1) {
    return blogs.reduce((total, blog) => total + blog.likes, 0);
  } else if (blogs.length === 0) {
    return 0;
  } else {
    return blogs[0].likes;
  }
};

const favoriteBlog = (blogs) => {
  return blogs.reduce((highest, current) => {
    return current.likes > highest.likes ? current : highest;
  }, blogs[0]);
};

const mostBlogs = (blogs) => {
  const authors = _.countBy(blogs, 'author');
  const mostBlogsAuthor = _.maxBy(_.keys(authors), (author) => authors[author]);
  return {
    author: mostBlogsAuthor,
    blogs: authors[mostBlogsAuthor],
  };
};

const mostLikes = (blogs) => {
  const group = _.groupBy(blogs, 'author');
  const authorLikes = _.map(group, (blogs, author) => ({
    author,
    likes: _.sumBy(blogs, 'likes'),
  }));
  return _.maxBy(authorLikes, 'likes');
};

export { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes };
