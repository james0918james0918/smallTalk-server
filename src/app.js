<<<<<<< HEAD
import bodyParser from "body-parser";
import express from "express";
import jwt from "jsonwebtoken";

import { connectToDatabase } from "./config/database";
import { appVariables } from "./config/app-variables";
import { headerProcessor } from './middlewares/header-processor';
import loginMiddleware from './middlewares/authentication';
import { userController } from "./controllers/user.controller";
import { authenticationController } from "./controllers/authentication.controller";
import { teamController } from './controllers/team.controller';
=======
import bodyParser from 'body-parser';
import express from 'express';
import timeout from 'connect-timeout';
import path from 'path';

import { connectToDatabase } from './config/database';
import { appVariables } from './config/app-variables';
import {
  globalErrorHandler,
  headerProcessor,
  jwtValidator
} from './middlewares/index';

import {
  AuthenticationController,
  UserController,
  TeamController
} from './controllers/index';

>>>>>>> fcc2aa7a93feafbb771776807ee73766c9ab7b00
// Create connection to database
connectToDatabase();

// Create Express server
const app = express();

app.set('port', process.env.PORT || appVariables.applicationPort);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// app.use((req, res, next) => {
//   headerProcessor(req, res, next);
// });
app.use(headerProcessor);

<<<<<<< HEAD
// app.use('/authentication', authenticationController(router));
app.use('/users', userController(router));
app.use('/teams', teamController(router));

// given token when login / validating email successfully
app.use(['/users/verification/:token', '/authentication/login'], loginMiddleware);

=======
app.use(timeout(appVariables.timeoutLimit));
app.use('/authentication', AuthenticationController);
app.use('/users', UserController);
>>>>>>> fcc2aa7a93feafbb771776807ee73766c9ab7b00

// Check for token
app.use(jwtValidator);

// Endpoint for uploaded pictures
app.use('/public', express.static(path.join(__dirname, '../public')));
app.use('/teams', TeamController);

app.use(globalErrorHandler);

export default app;
