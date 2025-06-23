const express = require("express");

const router = express.Router();

const { protect } = require("../middlewares/auth-middleware");

const {
  registerUser,
  loginUser,
  followUser,
  unfollowUser,
  searchUsers,
} = require("../controllers/user.controller");

router.post("/register", registerUser);
router.get("/search", protect, searchUsers);
router.post("/login", loginUser);
router.put("/follow/:id", protect, followUser);
router.put("/unfollow/:id", protect, unfollowUser);

module.exports = router;
