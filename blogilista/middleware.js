import jwt from 'jsonwebtoken';
import User from './models/user.js';

const unknownEndpoint = (req, res) => {
  return res.status(404).send({ error: 'Unknown endpoint' });
};

const errorHandler = (err, req, res, next) => {
  if (err.name === 'Cast error') {
    return res.status(400).send({ error: 'Bad id' });
  } else if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  } else if (
    err.name === 'MongoServerError' &&
    err.message.includes('E11000 duplicate key error')
  ) {
    return res.status(400).json({ error: 'expected `username` to be unique' });
  } else if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Token is missing or invalid' });
  }

  next(err);
};

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization');
  if (authorization && authorization.startsWith('Bearer ', '')) {
    req.token = authorization.replace('Bearer ', '');
  }
  next();
};

const userExtractor = async (req, res, next) => {
  let decodedToken;
  try {
    decodedToken = jwt.verify(req.token, process.env.SECRET);
  } catch (err) {
    return res.status(401).json({ error: 'Token is missing of malformed' });
  }

  const user = await User.findById(decodedToken.id);
  if (user) {
    req.user = user;
  }

  next();
};

export { unknownEndpoint, errorHandler, tokenExtractor, userExtractor };
