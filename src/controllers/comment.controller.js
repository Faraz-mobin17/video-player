import { Comment } from "../model/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../model/video.model.js";
import { User } from "../model/user.model.js";
const getVideoComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  const pageNum = Number(page);
  const limitNum = Number(limit);
  try {
    const comments = await Comment.find({
      videoold: videoId,
    })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);
    if (!comments) {
      throw new ApiError(404, "no Comments found for this video");
    }
    return res.status(200).json(new ApiResponse(200, comments, "Success"));
  } catch (error) {
    next(error);
  }
});

const addComment = asyncHandler(async (req, res, next) => {
  const { content, videoId, ownerId } = req.body; // Extract videoId and ownerId from the request body

  if (!content || !videoId || !ownerId) {
    throw new ApiError(400, "Content, videoId, and ownerId are required");
  }

  try {
    const video = await Video.findById(videoId);
    const user = await User.findById(ownerId);

    if (!video || !user) {
      throw new ApiError(404, "Video or User not found");
    }

    const comment = new Comment({
      content: content,
      video: videoId,
      owner: ownerId,
    });

    await comment.save();

    return res
      .status(201)
      .json(new ApiResponse(201, comment, "Comment created successfully"));
  } catch (error) {
    next(error);
  }
});
const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params; // Extract commentId from the request params
  const { content } = req.body; // Extract content from the request body

  if (!commentId || !content) {
    throw new ApiError(400, "CommentId and content are required");
  }

  try {
    const comment = await Comment.findById(commentId); // Find the comment by its ID

    if (!comment) {
      throw new ApiError(404, "Comment not found");
    }

    comment.content = content; // Update the content of the comment
    await comment.save(); // Save the updated comment to the database

    return res
      .status(200)
      .json(new ApiResponse(200, comment, "Comment updated successfully"));
  } catch (error) {
    next(error);
  }
});
const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params; // Extract commentId from the request params

  if (!commentId) {
    throw new ApiError(400, "CommentId is required");
  }

  try {
    const comment = await Comment.findById(commentId); // Find the comment by its ID

    if (!comment) {
      throw new ApiError(404, "Comment not found");
    }

    await comment.remove(); // Remove the comment from the database

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Comment deleted successfully"));
  } catch (error) {
    next(error);
  }
});

export { getVideoComments, addComment, updateComment, deleteComment };
