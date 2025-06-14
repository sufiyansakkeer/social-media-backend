const app = require("./app.js");
const connectDB = require("./config/db.js");

require("dotenv").config();

const port = process.env.PORT || 3000;

connectDB();
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
