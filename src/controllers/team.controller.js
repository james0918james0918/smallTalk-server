import express from 'express';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import uuidv4 from 'uuid/v4';
import { Team } from '../models/team';
import { User } from '../models/user';
import HttpError from '../http-error/http-error-class';
import { HTTP_CODES } from '../constants/index';

const TeamController = express.Router();
const upload = multer({
  dest: path.join(__dirname, '../../public/team-logos')
});


TeamController.get('/', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.decoded.username }).select('-_id teams').exec();
    const teamList = await Team.aggregate([
      { $match: { name: { $in: user.teams } } },
      {
        $project: {
          _id: 0,
          id: '$_id',
          name: 1,
          description: 1,
          owner: 1,
          created: 1,
          logoId: 1
        }
      }
    ]);
    console.log(teamList);
    res.status(200).send(teamList);
  } catch (err) {
    console.log(err);
    res.status(500).send('whoops, something is wrong with the server, please try again!');
  }
});


TeamController.post('/', async (req, res, next) => {
  try {
    // get owner's name
    req.body.owner = req.decoded.username;

    // query exec() returns a promise
    // $push: push the name of the newly created team into the array
    const owner = await User.findOneAndUpdate(
      { username: req.body.owner },
      { $push: { teams: req.body.name } }
    ).select('_id').exec();

    // create the team
    const team = new Team({
      ...req.body,
      members: [{ user: owner._id, role: ['owner'] }]
    });

    await team.save();

    res.sendStatus(204);
  } catch (err) {
    console.log(err);
    next(new HttpError(HTTP_CODES.INTERNAL_SERVER_ERROR, err.message));
  }
});

TeamController.put('/:id', async (req, res, next) => {
  try {
    await Team.replaceOne({ _id: req.params.id }, req.body);
    res.status(200).send('Update team successfully!');
  } catch (err) {
    res.status(500).json(err);
    next();
  }
});

TeamController.delete('/:id', (req, res) => {
  Team.findById(req.params.id, async (error, team) => {
    if (team) {
      await team.remove();
      res.status(200).send();
    } else {
      res.status(400).send('Team Cannot be found');
    }
  });
});

TeamController.delete('/:id/users/:userId', () => {});

TeamController.post('/team-logos', upload.single('logo'), (req, res) => {
  console.log(req.file);
  const imageId = uuidv4();
  if (!req.file) {
    res.status(200).send('');
    return; // end the flow here
  }
  const filePath = req.file.path;
  const targetPath = path.join(
    __dirname,
    '../../public/team-logos/',
    `${imageId.toString()}.png`
  );

  if (path.extname(req.file.originalname).toLowerCase() === '.png') {
    fs.rename(filePath, targetPath, (err) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send(imageId.toString());
      }
    });
  } else {
    fs.unlink(filePath, (err) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(403).send('Only .png files are allowed!');
      }
    });
  }
});

export default TeamController;
