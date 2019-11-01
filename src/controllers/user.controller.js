import express from 'express';
import bcrypt from 'bcrypt';
import uuidv4 from 'uuid';
import { VerificationEmail } from '../models/verification';
import { User } from '../models/user';
import { jwtValidator } from '../middlewares/jwt-validator';
import aws from '../config/aws-config';

const UserController = express.Router();
const saltRounds = 10;

UserController.get('/', jwtValidator, (req, res) => {
  console.log(req.decoded.username);
  res.status(200).send(req.decoded.username);
});

UserController.post('/', async (req, res) => {
  bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
    const { password, ...rest } = req.body;
    const user = new User({ password: hash, ...rest });
    user
      .save()
      .then(() => {
        res.sendStatus(204);
      })
      .catch((error) => {
        res.status(500).send(error.message);
      });
  });
});

UserController.post('/verification', (req, res) => {
  let ses = new aws.SES({ apiVersion: 'latest' });
  const token = uuidv4();
  let param = {
    Source: 'j2081499@gmail.com',
    Destination: {
      ToAddresses: [req.body.email]
    },
    Message: {
      Body: {
        Text: {
          Data: `please go to this url to verify your account: localhost:8080/verification/${token}`
        }
      },
      Subject: {
        Data: 'Welcome to smallTalk'
      }
    },
    Tags: [
      {
        Name: 'smallTalk',
        Value: 'registration'
      }
    ]
  };

  const verification = new VerificationEmail({
    username: req.body.username,
    password: req.body.password,
    uuid: token,
    email: req.body.email,
    expireAt: new Date(Date.now() + 60 * 60 * 24 * 1000) // expire at one day
  });
  verification
    .save()
    .then(() => {
      res.status(200).send('Email is sent, please check your mailbox');
      /*  ses.sendEmail(param, function(err, data) {
                if(err) res.status(500).send(`mail sent fails with error: ${err}`);
                else res.status(200).send('Email is sent, please check your mailbox');
            }); */
    })
    .catch(e => res.status(500).send(`error is ${e}`));
  // to-do
  // should pop up a btn for resending the mail
});

UserController.post('/verification/:token', (req, res) => {
  VerificationEmail.findOne(
    {
      uuid: req.params.token,
      expireAt: { $gt: new Date(Date.now()) }
    },
    (err, result) => {
      if (err) res.status(500).send('error during querying the uuid token');
      if (!result) {
        res.status(500).send('no correct uuid token is found');
      } else {
        // delete the token
        VerificationEmail.deleteOne(result, (error) => {
          if (error) res.status(500).send('Something went wrong when deleting the token');
          // return object of deletion:
          // { n: 1, ok: true, deletedCount: 1}
          res.status(200).send('validating completed');
        });
      }
    }
  );
});

// UserController.patch(jwtValidator, '/:id', () => {
//   return null;
// });

// UserController.delete(jwtValidator, '/:id', () => {
//   return null;
// });

export default UserController;
