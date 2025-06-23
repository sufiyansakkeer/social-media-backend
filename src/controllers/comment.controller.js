const Comment = require("../models/Comment");

const Post = require("../models/post");
const createComment = async (req, res) => {
  try {
    const { text } = req.body;

    const { id: postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = new Comment({
      user: req.user._id,
      post: postId,
      text,
    });

    await comment.save();

    post.comments.push(comment._id);
    await post.save();

    res.status(201).json({ message: "Comment created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.id })
      .populate("user", "username avatar")
      .sort({ createdAt: -1 });
    return res.status(200).json(comments);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await comment.deleteOne();
    return res.status(204).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { createComment, getComments, deleteComment };
