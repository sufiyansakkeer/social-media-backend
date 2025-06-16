const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  let token = req.headers.authorization;

  if (token && token.startsWith("Bearer")) {
    try {
      token = token.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded.id;
      next();
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized : token failed" });
    }
  } else {
    return res.status(401).json({ message: "Unauthorized : no token" });
  }
};

module.exports = { protect };
