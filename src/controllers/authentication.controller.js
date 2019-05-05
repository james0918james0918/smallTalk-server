import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { appVariables } from '../config/app-variables';
import { User } from '../models/user';

const AuthenticationController = express.Router();

AuthenticationController.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({
    username
  }).then(async (user) => {
    if (!user) {
      res.status(401).send('Invalid Credentials');
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

        const userId = user._id;

        res.status(200).send({
          message: 'Authentication Succeeded.',
          id: userId,
          user: {
            token,
          },
          id: user._id
        });
      } else {
        res.status(401).send('Invalid Credentials, wrong password');
      }
    }
  }).catch(() => {
    res.status(500).send('System Error. Please try again later!');
  });
});

export default AuthenticationController;
