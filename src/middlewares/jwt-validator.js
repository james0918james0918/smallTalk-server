import jwt from 'jsonwebtoken';
import { appVariables } from '../config/app-variables';

export function jwtValidator(req, res, next) {
  const tokenString = req.body.token || req.query.token || req.headers['x-access-token'];
  if (tokenString) {
    // parse the json string to real token
    const token = JSON.parse(tokenString).token;

    jwt.verify(token, appVariables.secret, (error, decoded) => {
      if (error) {
        return res.json({
          success: false,
          message: 'Failed to authenticate token'
        });
      }

      req.decoded = decoded;
      next();
    });
  } else {
    // if this falls out 2xx,
    // the preflight will be considered an error
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    });
  }
}
