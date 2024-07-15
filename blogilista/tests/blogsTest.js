import { test, after, before, beforeEach } from 'node:test';
import assert from 'node:assert';
import mongoose from 'mongoose';
import supertest from 'supertest';

process.env.NODE_ENV = 'test';

import app from '../app.js';
import Blog from '../models/blogs.js';
import User from '../models/user.js';

const api = supertest(app);

before(() => {
  console.log('*** Starting test sequence ***\n');
});

test('get all blogs from server', async () => {
  const res = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-type', /application\/json/);

  const databaseLength = await Blog.countDocuments();

  assert.strictEqual(
    res._body.length,
    databaseLength,
    'Test failed, numbers dont match',
  );
});

test('blog identify field is id, not_id', async () => {
  const user = new User({
    username: 'USERI',
    name: 'USHERUi',
    password: 'ASDASDKJASFIWP#RJ',
  });
  const savedUser = await user.save();

  const blog = new Blog({
    title: 'Testeri',
    author: 'Testinki',
    url: 'www.teetetete.xyx',
    user: savedUser._id,
  });

  const savedBlog = await blog.save();

  const result = await api.get(`/api/blogs`).expect(200);

  assert.strictEqual(
    result._body[0].hasOwnProperty('id'),
    true,
    `Test failed object id is _id`,
  );
});

test('create new blog without token', async () => {
  const blog = {
    title: 'test',
    author: 'tester',
    url: 'www.testing.ww',
    likes: 69,
  };

  await api.post('/api/blogs').send(blog).expect(401);
});

test('newly created blog is in database', async () => {
  const newUser = {
    username: 'Testeri',
    name: 'TESTER',
    password: '666',
  };

  const log = await api.post('/api/users').send(newUser).expect(201);

  const login = await api
    .post('/api/login')
    .send({ username: 'Testeri', password: '666' })
    .expect(200);

  const token = login.body.token;

  const blog = {
    title: 'test',
    author: 'tester',
    url: 'www.testing.ww',
    likes: 69,
  };

  const blogsLen = await Blog.countDocuments();
  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(blog)
    .expect(201);
  const newLen = await Blog.countDocuments();

  assert.strictEqual(
    newLen,
    blogsLen + 1,
    'Test failed, blog is not in database',
  );

  after(async () => {
    await User.findByIdAndDelete(log._body.id);
  });
});

test('if blog has no likes it should be 0', async () => {
  const newUser = {
    username: 'Testeri',
    name: 'TESTER',
    password: '666',
  };

  const log = await api.post('/api/users').send(newUser).expect(201);

  const login = await api
    .post('/api/login')
    .send({ username: 'Testeri', password: '666' })
    .expect(200);

  const token = login.body.token;

  const blog = {
    title: 'Pallot',
    author: 'Käpytikka',
    url: 'www.ballllzlzz.xyz',
  };

  const result = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(blog)
    .expect(201);

  after(async () => {
    await User.findByIdAndDelete(log._body.id);
  });
});

test('If new blog has no title or url, send 400 Bad request', async () => {
  const newUser = {
    username: 'Testeri',
    name: 'TESTER',
    password: '666',
  };

  const log = await api.post('/api/users').send(newUser).expect(201);

  const login = await api
    .post('/api/login')
    .send({ username: 'Testeri', password: '666' })
    .expect(200);

  const token = login.body.token;
  const blog = new Blog({ author: 'Banaani', url: 'www.www.ww' });
  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(blog)
    .expect(400);

  after(async () => {
    await User.findByIdAndDelete(log._body.id);
  });
});

test('delete blog actually deletes blog', async () => {
  const newUser = {
    username: 'Testeri',
    name: 'TESTER',
    password: '666',
  };

  const log = await api.post('/api/users').send(newUser).expect(201);

  const login = await api
    .post('/api/login')
    .send({ username: 'Testeri', password: '666' })
    .expect(200);

  const token = login.body.token;

  const newBlog = {
    title: 'kokeilu',
    author: 'lija',
    url: 'www.kokkkokokoo.ww',
    likes: 6,
  };

  const blogsLen = await Blog.countDocuments();

  const blog = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201);

  const allBlogs = await api.get('/api/blogs').expect(200);

  await api
    .delete(`/api/blogs/${allBlogs._body[allBlogs._body.length - 1].id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(200);
  const newLen = await Blog.countDocuments();
  assert.strictEqual(newLen, blogsLen, 'Deleting blog is faulty');

  after(async () => {
    await User.findByIdAndDelete(log._body.id);
  });
});

test('adding likes to blog', async () => {
  const blogs = await api.get('/api/blogs').expect(200);
  const blogToUpdate = blogs._body[0];
  const updatedLikes = { likes: blogToUpdate.likes + 1 };

  const result = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedLikes)
    .expect(200);

  const updatedBlogFromDb = await Blog.findById(blogToUpdate.id);

  assert.strictEqual(
    updatedBlogFromDb.likes,
    blogToUpdate.likes + 1,
    'Likes did not update',
  );
});

after(async () => {
  await mongoose.connection.close();
  console.log('\n*** TESTING COMPLETE ***');
});
