const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRET = process.env.SECRET_TOKEN;

const isAuthorized = (req, res, next) => {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'] || req.headers['auth'];

  if (typeof authHeader === "string") {
    let token = authHeader;
    if (!token) {
      return res.status(401).json({
        error: "Nu sunteti autorizat pentru aceasta actiune",
      });
    }

    token = token.substr('Bearer '.length);
    let decoded = jwt.decode(token);
    if (!decoded) {
      return res.status(401).json({
        error: "Nu sunteti autorizat pentru aceasta actiune",
      });
    }

    jwt.verify(token, SECRET, (err, decodedToken) => {
      if (err) {
        return res.status(401).json({
          error: "Nu sunteti autorizat pentru aceasta actiune",
        });
      }

      Object.defineProperty(req, "user", {
        value: {
          _id: decodedToken._id,
        },
      });
      next();
    });
  } else {
    return res.status(401).json({
      error: "Nu sunteti autorizat pentru aceasta actiune",
    });
  }
};

module.exports = isAuthorized;