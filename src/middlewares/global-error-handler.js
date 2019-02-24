export function globalErrorHandler(error, req, res, next) {
  console.log(error);
  next();
}
