const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");

app.use(cors()); // To enable cors
app.use(express.json()); // To enable json parsing
app.use(morgan("dev")); // To log HTTP requests

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to social media" });
});

module.exports = app;
