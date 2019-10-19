import jwt from 'jsonwebtoken';
import { appVariables } from '../config/app-variables';
import HttpError from '../http-error/http-error-class';
import { HTTP_CODES, HTTP_RESPONSE_MSG } from '../constants/index';

export function jwtValidator(req, res, next) {
  const tokenString = req.body.token || req.query.token || req.headers['x-access-token'];
  if (tokenString) {
    // parse the json string to real token
    const token = JSON.parse(tokenString).token;

    jwt.verify(token, appVariables.secret, (error, decoded) => {
      if (error) {
        next(new HttpError(HTTP_CODES.FORBIDDEN, HTTP_RESPONSE_MSG.FORBIDDEN));
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    // if this falls out 2xx,
    // the preflight will be considered an error
    next(new HttpError(HTTP_CODES.UNAUTHORIZED, HTTP_RESPONSE_MSG.UNAUTHORIZED));
  }
}
