import express from 'express';
import { Announcement } from '../models/announcement';

const PostsController = express.Router();

PostsController.post('/announcement', async (req, res) => {
  try {
    const announcement = new Announcement({
      title: req.body.title,
      content: req.body.content,
      authorId: req.decoded.id,
      teamId: req.body.teamId
    });
    // Save the announcement
    await announcement.save();
    return res.status(200).send('Create an announcement successfully');
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

export default PostsController;
