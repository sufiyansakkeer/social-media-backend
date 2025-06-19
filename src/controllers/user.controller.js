const User = require("../models/user");

const jwt = require("jsonwebtoken");

const bcryptjs = require("bcryptjs");

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user || !user.password || !user.email) {
      if (!user) {
        console.log("user not found");
      }
      if (!user.password) {
        console.log("password not found");
      }
      if (!user.email) {
        console.log("email not found");
      }
      return res.status(400).json({ message: "Invalid email or Password" });
    }

    const isMatch = await bcryptjs.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or Password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(200).json({ message: "Login Successful", token: token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const registerUser = async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    if (!userName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { userName }],
    });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = new User({
      userName,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return res.status(201).json({ message: "User registered Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const followUser = async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);
    if (!userToFollow) {
      return res.status(404).json({ message: "User not found" });
    }
    if (currentUser.following.includes(userToFollow._id)) {
      return res
        .status(400)
        .json({ message: "You are already following this user" });
    }

    if (userToFollow._id.equals(currentUser._id)) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    if (userToFollow.followers.includes(currentUser._id)) {
      return res
        .status(400)
        .json({ message: "You are already following this user" });
    }

    userToFollow.followers.push(currentUser._id);

    currentUser.following.push(userToFollow._id);
    await userToFollow.save();
    await currentUser.save();
    return res.status(200).json({ message: "User followed successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const unfollowUser = async (req, res) => {
  try {
    userToUnfollow = await User.findById(req.params.id);
    currentUser = await User.findById(req.user.id);

    if (!userToUnfollow) {
      return res.status(404).json({ message: "User not found" });
    }
    if (currentUser._id.equals(userToUnfollow._id)) {
      return res.status(400).json({ message: "You cannot unfollow yourself" });
    }

    if (currentUser.following.includes(userToUnfollow._id)) {
      userToUnfollow.followers.pull(currentUser._id);
      currentUser.following.pull(userToUnfollow._id);
      await userToUnfollow.save();
      await currentUser.save();
      return res.status(200).json({ message: "User unfollowed successfully" });
    } else {
      return res
        .status(400)
        .json({ message: "You are not following this user" });
    }
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { registerUser, loginUser, followUser, unfollowUser };
