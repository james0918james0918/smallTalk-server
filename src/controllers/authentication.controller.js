import jwt from "jsonwebtoken";
import { appVariables } from "../config/app-variables";
import { User } from "../models/user";

export const authenticationController = (router) => {
    router.post('/login', (req, res) => {
        const username = req.body.username;
        const password = req.body.password;

        User.findOne({ username, password }).then((user) => {
            if (!user) {
                res.json({ success: false, message: "Authentication failed. User not found" });
            } else {
                const payload = {
                    name: user.name
                };

                // Sign the token with secret
                const token = jwt.sign(payload, appVariables.secret, {
                    expiresIn: 60 * 60 * 24
                });

                res.json({
                    success: true,
                    message: "Authentication Succeeded.",
                    token
                });
            }
        })
        .catch(() => {
            res.json({ success: false, message: "Authentication failed. User not found" });
        });
    });

    return router;
};
