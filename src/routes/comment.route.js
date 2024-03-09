import { Router } from "express";
import {
  getVideoComments,
  addComment,
  updateComment,
  deleteComment,
} from "../controllers/comment.controller.js";

const router = Router();

router.route("/getVideoComments").get(getVideoComments);
router.route("/add-comment").post(addComment);
export default router;
