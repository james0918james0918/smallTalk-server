export function headerProcessor(req, res, next) {
  // Websites to allow
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');

  // Request Methods to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request Headers to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the
  // requests sent to the API (e.g. sessions)
  // res.setHeader("Access-Control-Allow-Credentials", true);

  next();
}
