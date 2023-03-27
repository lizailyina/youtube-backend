import Comment from '../models/Comment.js'
import Video from '../models/Video.js'
import { createError } from '../error.js'

export const addComment = async (req, res, next) => {
  const comment = new Comment({ ...req.body, userId: req.user.id });
  try {
    await comment.save();
    res.status(200).json(comment);
  } catch (err) {
    next(err);
  }
}

export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    const video = await Video.findById(req.params.id);
    if (comment.userId === req.user.id || video.userId === req.user.id) {
      await Comment.findByIdAndDelete(req.params.id);
      res.status(200).json("Deleted comment successfully");
    } else {
      next(createError(403, "You can only delete your comments"));
    }
  } catch (err) {
    next(err);
  }
}

export const getComments = async (req, res, next) => {
  try {
    const comments = await Comment.findById(req.params.id);
    res.status(200).json(comments);
  } catch (err) {
    next(err);
  }
}