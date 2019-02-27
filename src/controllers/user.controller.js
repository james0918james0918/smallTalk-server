import express from 'express';
import bcrypt from 'bcrypt';
import { Types } from 'mongoose';
import { VerificationEmail } from '../models/verification';
import { User } from '../models/user';
import aws from '../config/awsConfig';
import uuidv4 from 'uuid';

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

UserController.post('/verification',(req,res)=>{
        let ses = new aws.SES({ apiVersion: 'latest' });
        let token = uuidv4();
        let param={
            Source: "j2081499@gmail.com",
            Destination:{
                ToAddresses: [req.body.email]
            },
            Message:{
                Body:{
                    Text:{
                        Data: `plz go to this url to verify ur account: localhost:8080/verification/${token}`,
                    }
                },
                Subject:{
                    Data: "Welcome to smallTalk"
                }
            },
            Tags:[{
                Name:"smallTalk",
                Value:"registration"
            }]
        }

        const verification = new VerificationEmail({
            username: req.body.username,
            password: req.body.password,
            uuid: token,
            email: req.body.email,
            expireAt: new Date(Date.now() + 60 * 60 * 24 * 1000) // expire at one day
        });
        verification.save()
        .then(() => {
            res.status(200).send('Email is sent, please check your mailbox');
            /*ses.sendEmail(param, function(err, data) {
                if(err) res.status(500).send(`mail sent fails with error: ${err}`);
                else res.status(200).send('Email is sent, please check your mailbox');
            });*/
        })
        .catch(e => res.status(500).send(`error is ${e}`));
        // to-do
        // should pop up a btn for resending the mail
})

UserController.post('/verification/:token', (req, res, next) => {
        const token = VerificationEmail.findOne({ 
            uuid: req.params.token, 
            expireAt: { $gt: new Date(Date.now()) }
        }, function(err, result) {
            if (err) res.status(500).send('error during querying the uuid token');
            else {
                if (!result) res.status(500).send('no correct uuid token is found');
                else {
                    // attach username and password to body to pass to middleware for login
                    req.body.username = result.username;
                    req.body.password = result.password;
                    // delete the token
                    VerificationEmail.deleteOne(result, function(err, result) {
                        if(err) console.log(err);
                        // return object of deletion:
                        // { n: 1, ok: true, deletedCount: 1}
                    });
                    // res.status(200).send();
                    next();
                }
            }
        });
    });

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
