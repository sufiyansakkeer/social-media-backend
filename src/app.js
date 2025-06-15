const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");

const userRoutes = require("../src/routes/user.routes");

app.use(cors()); // To enable cors
app.use(express.json()); // To enable json parsing
app.use(morgan("dev")); // To log HTTP requests
app.use("/api/v1/users", userRoutes);
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to social media" });
});

module.exports = app;
