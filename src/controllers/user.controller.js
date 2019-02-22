import express from 'express';
import bcrypt from 'bcrypt';
import { Types } from 'mongoose';
import { User } from '../models/user';
import aws from '../config/awsConfig';

const UserController = express.Router();
const saltRounds = 10;

UserController.get('/', (req, res) => {
  User.find({}).then((userList) => {
    res.status(200).json(userList);
  }).catch((error) => {
    res.status(500).send(error);
  });
});

UserController.get('/:id', (req, res) => {
  if (!req.params.id) {
    throw new Error('No Id');
  }

  User.findById(req.params.id).then((user) => {
    res.status(200).json(user);
  }).catch((error) => {
    res.status(404).send(error);
  });
});

UserController.post('/', async (req, res) => {
  bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
    const { password, ...rest } = req.body;
    const user = new User({ password: hash, ...rest });
    user.save().then(() => {
      res.status(200).send('Create user successfully!');
    }).catch((error) => {
      res.status(500).send(error);
    });
  });
});

UserController.post('/verify', () => {
  const ses = new aws.SES({
    apiVersion: 'latest'
  });
  // let token=uuidv5('hello smallTalk','my namespace!!!!');
  const param = {
    Source: 'j2081499@gmail.com',
    Destination: {
      ToAddresses: ['f74056205@gs.ncku.edu.tw']
    },
    Message: {
      Body: {
        Text: {
          // what to do from here
          // go to front-end redux route
          Data: 'plz go to this url to verify ur account:',
        }
      },
      Subject: {
        Data: 'Welcome to smallTalk'
      }
    },
    Tags: [{
      Name: 'smallTalk',
      Value: 'registration'
    }]
  };

  ses.sendEmail(param, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      console.log(data);
    }
  });
});

UserController.get('/:id/teams', (req, res) => {

});

UserController.patch('/:id', () => {
  return null;
});

UserController.delete('/:id', () => {
  return null;
});

export default UserController;
