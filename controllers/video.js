import { createError } from "../error.js";
import Video from "../models/Video.js"
import User from "../models/User.js"

export const addVideo = async (req, res, next) => {
  const newVideo = new Video({ userId: req.user.id, ...req.body });
  try {
    const savedVideo = await newVideo.save();
    res.status(200).json(savedVideo);
  } catch (err) {
    console.log(err);
    next(err);
  }
}

export const updateVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return next(createError(404, "Video not found"));
    if (req.user.id === video.userId) {
      const updatedVideo = Video.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        {
          new: true,
        }
      );
    } else {
      return next(createError(403, "You can only update your video"));
    }
    res.status(200).json(updatedVideo);
  } catch (err) {
    next(err);
  }
}

export const deleteVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return next(createError(404, "Video not found"));
    if (req.user.id === video.userId) {
      Video.findByIdAndDelete(req.params.id);
    } else {
      return next(createError(403, "You can only delete your video"));
    }
    res.status(200).json("Successfully deleted the video.");
  } catch (err) {
    next(err);
  }
}

export const getVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return next(createError(404, "Video not found"));
    res.status(200).json(video);
  } catch (err) {
    next(err);
  }
}

export const addView = async (req, res, next) => {
  try {
    await Video.findByIdAndUpdate(
      req.params.id,
      {
        $inc: { views: 1 }
      });
    res.status(200).json("Number of views incremented.");
  } catch (err) {
    next(err);
    console.log(err);
  }
}

export const random = async (req, res, next) => {
  try {
    const videos = await Video.aggregate([{ $sample: { size: 40 } }]);
    res.status(200).json(videos);
  } catch (err) {
    next(err);
  }
}

export const trend = async (req, res, next) => {
  try {
    const videos = await Video.find().sort({ views: -1 });
    res.status(200).json(videos);
  } catch (err) {
    next(err);
  }
}

export const sub = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const subscribedUsers = user.subscribed;
    const list = await Promise.all(
      subscribedUsers.map((chanelId) => {
        return Video.find({ userId: chanelId });
      })
    )
    res.status(200).json(list.flat());
  } catch (err) {
    next(err);
  }
}

export const lib = async (req, res, next) => {
  try {
    const list = await Video.find({ userId: req.user.id });
    console.log(list);
    res.status(200).json(list);
  } catch (err) {
    next(err);
  }
}

export const getByTags = async (req, res, next) => {
  const tags = req.query.tags.split(',');
  try {
    let videos = await Video.find({ tags: { $in: tags } }).limit(20);
    if (videos.length < 7) {
      const chanelVideos = await Video.find({ userId: req.body.userId });
      chanelVideos.forEach((obj) => {
        if (!videos.find((item) => { item.title == obj.title }) && videos.length < 7) {
          videos = [...videos, obj];
        }
      })
    }
    if (videos.length < 7) {
      const randomVideos = await Video.aggregate([{ $sample: { size: 20 } }]);
      randomVideos.forEach((obj) => {
        if (!videos.find((item) => { item.title == obj.title }) && videos.length < 7) {
          videos = [...videos, obj];
        }
      })
    }
    res.status(200).json(videos);
  } catch (err) {
    next(err);
    console.log(err);
  }
}

export const getByCategories = async (req, res, next) => {
  const category = req.query.category;
  try {
    const videos = await Video.find({ categories: { $in: category } }).limit(20);
    res.status(200).json(videos);
  } catch (err) {
    next(err);
    console.log(err);
  }
}

export const search = async (req, res, next) => {
  const query = req.query.q;
  try {
    const videos = await Video.find({ title: { $regex: query, $options: "i" } }).limit(40);
    res.status(200).json(videos);
  } catch (err) {
    next(err);
  }
}