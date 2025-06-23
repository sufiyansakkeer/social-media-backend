const express = require("express");

const router = express.Router();

const { protect } = require("../middlewares/auth-middleware");

const {
  createPost,
  getAllPosts,
  getUserPost,
  updatePost,
  deletePost,
  likePost,
} = require("../controllers/post.controller");

router.post("/", protect, createPost);
router.get("/", protect, getAllPosts);
router.get("/user/:id", protect, getUserPost);
router.put("/:id", protect, updatePost);
router.delete("/:id", protect, deletePost);
router.put("/like/:id", protect, likePost);

module.exports = router;
