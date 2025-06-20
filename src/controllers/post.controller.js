const Post = require("../models/post");

const createPost = async (req, res) => {
  try {
    const { description, image } = req.body;
    if (!description || !image) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const newPost = new Post({
      user: req.user,
      description,
      image,
    });
    await newPost.save();

    res.status(200).json({ message: "Post created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("user", "username avatar").sort({
      createdAt: -1,
    });

    res.status(200).json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const getUserPost = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.id })
      .populate("user", "username avatar")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    post.description = req.body.description || post.description;
    post.image = req.body.image || post.image;

    await post.save();

    res.status(200).json({ message: "Post updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await post.remove();

    res.status(204).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getUserPost,
  updatePost,
  deletePost,
};
