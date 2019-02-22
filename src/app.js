import bodyParser from 'body-parser';
import express from 'express';
import timeout from 'connect-timeout';
import path from 'path';

import { connectToDatabase } from './config/database';
import { appVariables } from './config/app-variables';
import {
  headerProcessor,
  jwtValidator
} from './middlewares/index';

import {
  AuthenticationController,
  UserController,
  TeamController
} from './controllers/index';

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

app.use(timeout(appVariables.timeoutLimit));
app.use('/authentication', AuthenticationController);
app.use('/users', UserController);

// Check for token
app.use(jwtValidator);
// Endpoint for uploaded pictures
// app.use('/public', express.static(path.resolve(__dirname, '../../public')));
app.use('/teams', TeamController);

export default app;
