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

export { unknownEndpoint, errorHandler };
