import { Types } from "mongoose";
import { User } from "../models/user";
import { VerificationEmail } from '../models/verification';
import aws from "../config/aws-config";
import uuidv4 from 'uuid';

export const userController = (router) => {
    router.get("/", (req, res) => {
        User.find({}).then((userList) => {
            res.status(200).json(userList);
        })
        .catch((error) => {
            res.status(500).send(error);
        });
    });

    router.get("/:id", (req, res) => {
        if (!req.params.id) {
            throw new Error("No Id");
        }

        User.findById(req.params.id).then((user) => {
            res.status(200).json(user);
        })
        .catch((error) => {
            res.status(404).send(error);
        });
    });

    router.post("/create", (req, res) => {
            const user = new User(req.body);
            user._id = new Types.ObjectId();
            user.save().then(() => {
                res.status(200).send("Create user successfully!");
            })
            .catch((error) => {
                console.log("error right here" + error);
                res.status(500).send(error);
            });
    });

    router.post('/verification',(req,res)=>{
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

    router.post('/verification/:token', (req, res, next) => {
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

    router.patch("/update/:id", (req, res) => {
        return null;
    });

    router.delete("/delete/:id", () => {
        return null;
    });

    

    return router;
};
