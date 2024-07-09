import { test, after, before, describe, beforeEach } from 'node:test';
import assert from 'node:assert';
import mongoose from 'mongoose';
import supertest from 'supertest';

process.env.NODE_ENV = 'test';
import app from '../app.js';
import User from '../models/user.js';

const api = supertest(app);

before(() => {
  console.log('*** Starting test sequence ***\n');
});

describe('user creation', async () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  test('password not existing', async () => {
    const user = {
      username: 'Tester',
      name: 'test',
    };

    const res = await api.post('/api/users/').send(user);
    assert.strictEqual(res.status, 400, `Test failed`);
  });

  test('password is too short, under 3', async () => {
    const user = {
      username: 'Tester',
      name: 'test',
      password: 'ku',
    };

    const res = await api.post('/api/users/').send(user);
    assert.strictEqual(res.status, 400, 'Password length test failed');
  });

  test('normal user creation', async () => {
    const user = {
      username: 'Tester',
      name: 'test',
      password: 'Testing',
    };

    const res = await api.post('/api/users/').send(user);
    assert.strictEqual(res.status, 201, 'User creation test failed');
  });
});

after(async () => {
  await mongoose.connection.close();
  console.log('\n*** TESTING COMPLETE ***');
});
