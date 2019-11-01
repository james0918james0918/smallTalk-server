import HttpError from './http-error-class';

export default (error, req, res, next) => {
  if (res.headersSent) {
    // Delegate to default handler
    return next(error);
  }
  if (error instanceof HttpError) {
    res.status(error.code).send(error.message);
  } else {
    res.status(500).send(error.message);
  }
};
