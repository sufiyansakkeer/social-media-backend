const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/auth-middleware");

const {
  createPost,
  getAllPosts,
  getUserPost,
  updatePost,
  deletePost,
} = require("../controller/postController");

router.post("/", protect, createPost);
router.get("/", protect, getAllPosts);
router.get("/user/:id", protect, getUserPost);
router.put("/:id", protect, updatePost);
router.delete("/:id", protect, deletePost);

module.exports = router;
