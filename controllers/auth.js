import mongoose from "mongoose"
import User from "../models/User.js"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createError } from "../error.js";

export const signup = async (req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    const newUser = new User({ ...req.body, password: hash });

    const user = await newUser.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT);

    res.cookie("access_token", token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    }).status(200).send(user);
  } catch (err) {
    next(err);
  }
}

export const signin = async (req, res, next) => {
  try {
    const user = await User.findOne({ name: req.body.name }).lean();
    if (!user) return next(createError(404, "User not found"));

    const isCorrect = await bcrypt.compare(req.body.password, user.password);
    if (!isCorrect) return next(createError(400, "Wrong credentials"));

    const token = jwt.sign({ id: user._id }, process.env.JWT);
    const { password, ...others } = user;

    res.cookie("access_token", token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    }).status(200).json(others);
  } catch (err) {
    next(err);
  }
}

export const google = async (req, res, next) => {
  try {
    const previous = await User.findOne({ email: req.body.email }).lean();
    if (!previous) {
      const user = new User({ ...req.body, fromGoogle: true });
      const savedUser = await user.save();
      const token = jwt.sign({ id: savedUser._id }, process.env.JWT);
      res.cookie("access_token", token, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      }).status(200).json(savedUser);
    } else {
      const token = jwt.sign({ id: previous._id }, process.env.JWT);
      res.cookie("access_token", token, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      }).status(200).json(previous);
    }
  } catch (err) {
    next(err);
  }
}
