import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
  },
  img: {
    type: String,
  },
  subscribers: {
    type: Number,
    default: 0,
  },
  subscribed: {
    type: [String],
  },
  fromGoogle: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });

export default mongoose.model("User", UserSchema);