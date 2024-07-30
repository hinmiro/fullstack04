import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/user.js';

const loginRouter = Router();

loginRouter.post('/', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username: username });
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(user.password, password);

  if (!(user || passwordCorrect)) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  };

  const token = jwt.sign(userForToken, process.env.SECRET, {
    expiresIn: 60 * 60,
  });
  res.status(200).send({
    token,
    username: user.username,
    name: user.name,
    blogs: user.blogs,
  });
});

export default loginRouter;
