import bcrypt from 'bcrypt';
import { Router } from 'express';
import User from '../models/user.js';

const usersRouter = Router();

usersRouter.get('/', async (req, res) => {
  const users = await User.find({});
  return res.status(200).json(users);
});

usersRouter.post('/', async (req, res) => {
  const { username, name, password } = req.body;

  if (!password) {
    return res.status(400).json({ error: 'Missing password' });
  } else if (password.toString().length < 3) {
    return res
      .status(400)
      .json({ error: 'Password is too short, minimum is 3 characters' });
  }

  const salt = 10;
  const passHash = await bcrypt.hash(password, salt);

  const newUser = new User({
    username: username,
    name: name,
    password: passHash,
  });

  const savedUser = await newUser.save();

  res.status(201).json(newUser);
});

export default usersRouter;
