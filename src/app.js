import bodyParser from 'body-parser';
import express from 'express';
import timeout from 'connect-timeout';
import path from 'path';
import cors from 'cors';

import { connectToDatabase } from './config/database';
import { appVariables } from './config/app-variables';
import {
  globalErrorHandler,
  jwtValidator
} from './middlewares/index';

import {
  AuthenticationController,
  UserController,
  TeamController
} from './controllers/index';
import { corsOptions } from './config/cors-config';
import userChecking from './middlewares/user-checking';
// Create connection to database
connectToDatabase();

// Create Express server
const app = express();

// enable in all routes
app.use(cors(corsOptions));

app.set('port', process.env.PORT || appVariables.applicationPort);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(timeout(appVariables.timeoutLimit));
app.use('/authentication', AuthenticationController);
app.use('/users', UserController);

// Endpoint for uploaded pictures
// must before jwt token
app.use('/public', express.static(path.join(__dirname, '../public')));


// Check for token
app.use(jwtValidator);
// Check if query string and username are matched
// app.use(userChecking);
app.use('*', userChecking);
app.use('/teams', TeamController);

app.use(globalErrorHandler);

export default app;
