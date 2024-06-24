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

export { dummy, totalLikes, favoriteBlog };
