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

    // Map over posts to add likeCount and isLikedByUser
    const postsWithDetails = posts.map((post) => {
      const postObject = post.toObject(); // Convert Mongoose document to plain JS object
      postObject.likeCount = postObject.likes.length;

      // Check if the current authenticated user has liked this post
      if (req.user) {
        // Assuming req.user is populated by auth middleware if available
        postObject.isLikedByUser = postObject.likes.some(
          (likeId) => likeId.toString() === req.user._id.toString()
        );
      }
      return postObject;
    });
    res.status(200).json(postsWithDetails);
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

    // Map over posts to add likeCount and isLikedByUser
    const postsWithDetails = posts.map((post) => {
      const postObject = post.toObject(); // Convert Mongoose document to plain JS object
      postObject.likeCount = postObject.likes.length;

      // Check if the current authenticated user has liked this post
      if (req.user) {
        // Assuming req.user is populated by auth middleware if available
        postObject.isLikedByUser = postObject.likes.some(
          (likeId) => likeId.toString() === req.user._id.toString()
        );
      }
      return postObject;
    });
    res.status(200).json(postsWithDetails);
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

const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Ensure req.user._id is used for comparison and modification
    const userId = req.user._id;

    // Check if the user has already liked the post
    const hasLiked = post.likes.some(
      (likeId) => likeId.toString() === userId.toString()
    );

    if (hasLiked) {
      // If already liked, unlike it (remove user ID)
      post.likes = post.likes.filter(
        (likeId) => likeId.toString() !== userId.toString()
      );
      await post.save();
      return res
        .status(200)
        .json({
          message: "Post unliked successfully",
          likeCount: post.likes.length,
          isLiked: false,
        });
    } else {
      // If not liked, like it (add user ID)
      post.likes.push(userId);
      await post.save();
      return res
        .status(200)
        .json({
          message: "Post liked successfully",
          likeCount: post.likes.length,
          isLiked: true,
        });
    }
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
  likePost,
};
