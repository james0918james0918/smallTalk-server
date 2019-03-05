export default (req, res, next) => {
  // check if the username parsed from jwt token matches the username query string in res.query
  // make sure the user is in his own url instead of others
  if (req.decoded.username !== req.query.username) {
    res.status(403).send('You are not allowed here!');
    return;
  }
  next();
};
