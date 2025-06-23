const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");

const userRoutes = require("../src/routes/user.routes");
const postRoutes = require("../src/routes/post.routes");
const commentRoutes = require("../src/routes/comment.routes");

app.use(cors()); // To enable cors
app.use(express.json()); // To enable json parsing
app.use(morgan("dev")); // To log HTTP requests
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/post", postRoutes);
app.use("/api/v1/comment", commentRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to social media" });
});

module.exports = app;
