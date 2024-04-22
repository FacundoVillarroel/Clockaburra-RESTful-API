const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Failed to authenticate token" });
    }
    const newToken = jwt.sign(
      { userId: decoded.userId, userName: decoded.userName },
      process.env.JWT_SECRET,
      { expiresIn: "1w" }
    );

    res.setHeader("Authorization", "Bearer " + newToken);

    req.userId = decoded.userId;
    req.userName = decoded.userName;
    next();
  });
};

module.exports = verifyJWT;
