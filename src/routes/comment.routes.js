const express = require("express");

const router = express.Router();

const { protect } = require("../middlewares/auth-middleware");

const {
  createComment,
  getComments,
  deleteComment,
} = require("../controllers/comment.controller");

router.post("/:id", protect, createComment);

router.get("/:id", protect, getComments);

router.delete("/:id", protect, deleteComment);

module.exports = router;
