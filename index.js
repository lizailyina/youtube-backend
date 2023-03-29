import express from "express";
import mongoose from "mongoose"
import dotenv from "dotenv"
import userRouter from "./routes/users.js"
import videoRouter from "./routes/videos.js"
import commentRouter from "./routes/comments.js"
import authRouter from "./routes/auth.js"
import cookieParser from "cookie-parser";
import cors from "cors"

const app = express();

dotenv.config();

const connect = () => {
  mongoose.connect(process.env.MONGO)
    .then(() => console.log("DB OK"))
    .catch(err => console.log(err));
}

app.use(express.json());
app.use(cookieParser());
app.use(cors(app.use(cors({ credentials: true }))));

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/videos", videoRouter);
app.use("/api/comments", commentRouter);

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";
  return res.status(status).json({
    success: false,
    status,
    message,
  })
})

app.listen(process.env.PORT || 8800, () => {
  connect();
  console.log("Server OK");
})