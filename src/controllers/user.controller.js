import { Types } from "mongoose";
import { User } from "../models/user";
import aws from "../config/awsConfig";
import uuidv5 from "uuid";

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
                res.status(500).send(error);
            });
    });

    router.post("/verify",(req,res)=>{
        let ses = new aws.SES({ apiVersion: 'latest' });
        //let token=uuidv5("hello smallTalk","my namespace!!!!");
        let param={
            Source: "j2081499@gmail.com",
            Destination:{
                ToAddresses: ["f74056205@gs.ncku.edu.tw"]
            },
            Message:{
                Body:{
                    Text:{
                        // what to do from here
                        // go to front-end redux route
                        Data: `plz go to this url to verify ur account:`,
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
        ses.sendEmail(param,function(err,data){
            if(err) console.log(err);
            else console.log(data);
        })
    })

    router.patch("/update/:id", (req, res) => {
        return null;
    });

    router.delete("/delete/:id", () => {
        return null;
    });

    

    return router;
};
