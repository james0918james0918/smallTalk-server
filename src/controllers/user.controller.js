import { Types } from "mongoose";
import { User } from "../models/user";

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

    router.patch("/update/:id", (req, res) => {
        return null;
    });

    router.delete("/delete/:id", () => {
        return null;
    });

    return router;
};
