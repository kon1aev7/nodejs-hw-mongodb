import { HttpError } from 'http-errors';

export const errorHandler = (err, req, res, next) => {
  if (err instanceof HttpError) {
    res.status(err.status).send({
      status: err.status,
      data: err,
    });
    return;
  }

  res.status(500).send({
    status: 500,
    message: 'Something went wrong',
    error: err.message,
  });
};
