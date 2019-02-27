import jwt from "jsonwebtoken";
import { appVariables } from "../config/app-variables";
import { User } from "../models/user";

export const authenticationController = (router) => {
    router.post('/login', (req, res) => {
        const username = req.body.username;
        const password = req.body.password;

        User.findOne({ username, password }).then((user) => {
            if (!user) {
                res.status(401).send('Invalid Credentials');
            } else {
                const payload = {
                    name: user.name
                };

                // Sign the token with secret
                const token = jwt.sign(payload, appVariables.secret, {
                    expiresIn: 60 * 60 * 24
                });

                res.status(200).send({
                    message: "Authentication Succeeded.",
                    user: { token }
                });
            }
        })
        .catch(() => {
            res.status(500).send('System Error. Please try again later!');
        });
    });

    return router;
};
