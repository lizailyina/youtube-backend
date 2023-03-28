import express from "express"
import { deleteUser, dislike, getUser, like, subscribe, undislike, unlike, unsubcscribe, update } from "../controllers/user.js";
import { verifyToken } from "../verifyToken.js";

const router = express.Router();

router.put("/:id", verifyToken, update);
router.delete("/:id", verifyToken, deleteUser);
router.get("/find/:id", getUser);
router.put("/sub/:id", verifyToken, subscribe);
router.put("/unsub/:id", verifyToken, unsubcscribe);
router.put("/like/:videoId", verifyToken, like);
router.put("/unlike/:videoId", verifyToken, unlike);
router.put("/dislike/:videoId", verifyToken, dislike);
router.put("/undislike/:videoId", verifyToken, undislike);



export default router;