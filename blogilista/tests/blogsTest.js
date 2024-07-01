import { test, after } from 'node:test';
import assert from 'node:assert';
import mongoose from 'mongoose';
import supertest from 'supertest';

process.env.NODE_ENV = 'test';

import app from '../app.js';
import Blog from '../services/mongoDb.js';

const api = supertest(app);

test('get all blogs from server', async () => {
  const res = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-type', /application\/json/);

  assert.strictEqual(res.body.length, 0, 'Test failed, numbers dont match');
  console.log('\n*** TEST COMPLETE ***');
});

test('blog identify field is id, not_id', async () => {
  const result = await api.get('/api/blogs').expect(200);

  assert.strictEqual(
    result._body[0].hasOwnProperty('id'),
    true,
    `Test failed object id is _id`,
  );
  console.log('\n*** TEST COMPLETE ***');
});

test('newly created blog is in database', async () => {
  const blog = new Blog({
    title: 'title',
    author: 'author',
    url: 'url',
    likes: 69,
  });

  const result = await blog.save();
  const response = await Blog.findById(result._id);
  console.log('Added blog: ', result._id.toString());
  console.log('Get that blog: ', response._id.toString());
  assert.strictEqual(
    response._id.toString(),
    result._id.toString(),
    'Test failed, blog is not in database',
  );
  console.log('\n*** TEST COMPLETE ***');
});

test('if blog has no likes it should be 0', async () => {
  const createBlog = (title, author, url, likes) => {
    return new Blog({
      title: title,
      author: author,
      url: url,
      likes: likes || 0,
    });
  };

  const blog = createBlog('Pitsapohja', 'Luigi', 'www.luigit.xxx');

  const result = await blog.save();
  const response = await Blog.findById(result._id);
  result.likes < 1
    ? assert.strictEqual(
        response.likes,
        0,
        `Likes supposed to be zero not ${response.likes}`,
      )
    : assert.strictEqual(blog.likes, response.likes, `Likes dont match!`);
  console.log('Test success!');
});

after(async () => {
  await mongoose.connection.close();
});
