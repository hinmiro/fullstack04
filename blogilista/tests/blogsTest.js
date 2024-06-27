import { test, after } from 'node:test';
import assert from 'node:assert';
import mongoose from 'mongoose';
import supertest from 'supertest';

process.env.NODE_ENV = 'test';

import app from '../app.js';

const api = supertest(app);

test('get all blogs from server', async () => {
  const res = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-type', /application\/json/);

  assert.strictEqual(res.body.length, 0, 'Test failed, numbers dont match');
  console.log('\n*** TEST COMPLETE ***');
});

after(async () => {
  await mongoose.connection.close();
});
