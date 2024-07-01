import { test, after, before } from 'node:test';
import assert from 'node:assert';
import mongoose from 'mongoose';
import supertest from 'supertest';

process.env.NODE_ENV = 'test';

import app from '../app.js';
import Blog from '../services/mongoDb.js';

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
  const result = await api.get('/api/blogs').expect(200);

  assert.strictEqual(
    result._body[0].hasOwnProperty('id'),
    true,
    `Test failed object id is _id`,
  );
});

test('newly created blog is in database', async () => {
  const blog = {
    title: 'test',
    author: 'tester',
    url: 'www.testing.ww',
    likes: 69,
  };

  const blogsLen = await Blog.countDocuments();
  await api.post('/api/blogs').send(blog).expect(201);
  const newLen = await Blog.countDocuments();

  assert.strictEqual(
    newLen,
    blogsLen + 1,
    'Test failed, blog is not in database',
  );
});

test('if blog has no likes it should be 0', async () => {
  const blog = {
    title: 'Pallot',
    author: 'Käpytikka',
    url: 'www.ballllzlzz.xyz',
  };

  const result = await api.post('/api/blogs').send(blog).expect(201);
});

test('If new blog has no title or url, send 400 Bad request', async () => {
  const blog = new Blog({ author: 'Banaani', url: 'www.www.ww' });
  await api.post('/api/blogs').send(blog).expect(400);
});

after(async () => {
  await mongoose.connection.close();
  console.log('\n*** TESTING COMPLETE ***');
});
