import bodyParser from 'body-parser';
import express from 'express';
import timeout from 'connect-timeout';
import path from 'path';
import cors from 'cors';

import { connectToDatabase } from './config/database';
import { appVariables } from './config/app-variables';
import { jwtValidator } from './middlewares/index';
import httpErrorHandler from './http-error/http-error-handler';

import {
  AuthenticationController,
  UserController,
  TeamController,
  PostsController
} from './controllers/index';

import { corsOptions } from './config/cors-config';

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


app.use('/users', UserController);
app.use(jwtValidator);
app.use('/teams', TeamController);
app.use('/posts', PostsController);

app.use(httpErrorHandler);

export default app;
