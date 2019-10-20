import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { appVariables } from '../config/app-variables';
import { User } from '../models/user';
import { HTTP_CODES, HTTP_RESPONSE_MSG } from '../constants/index';
import HttpError from '../http-error/http-error-class';

const AuthenticationController = express.Router();

AuthenticationController.post('/login', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  console.log('Who wants to log in? ', username);
  User.findOne({
    username
  }).then(async (user) => {
    if (!user) {
      next(new HttpError(HTTP_CODES.UNAUTHORIZED, HTTP_RESPONSE_MSG.UNAUTHORIZED));
    } else {
      const result = await bcrypt.compare(password, user.password);

      if (result) {
        const payload = {
          id: user._id,
          name: user.name,
          username: user.username
        };

        // Sign the token with secret
        const token = jwt.sign(payload, appVariables.secret, {
          expiresIn: 60 * 60 * 24
        });

        res.status(200).send({
          message: HTTP_RESPONSE_MSG.SUCCESS,
          user: {
            token,
          },
          id: user._id
        });
      } else {
        next(new HttpError(HTTP_CODES.FORBIDDEN, HTTP_RESPONSE_MSG.FORBIDDEN));
      }
    }
  }).catch((e) => {
    next(new HttpError(HTTP_CODES.INTERNAL_SERVER_ERROR, e.message));
  });
});

export default AuthenticationController;
