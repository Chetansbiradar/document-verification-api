const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) throw new Error("Token not found");

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        throw new Error("Invalid token");
      } else {
        req.user = user;
        next();
      }
    });
  } catch (error) {
    console.log("verifyToken():", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.accessLevel === 1) {
      next();
    } else {
      res.status(403).json({ success: false, "message": "Your are not allowed to do this" });
    }
  });
};

const verifyTokenAndAdmin = (req, res, next) => {
  console.log(req);
  verifyToken(req, res, () => {
    console.log(req.user);
    if (req.user.accessLevel === 2) {
      const d = new Date();
      console.log("🔋Admin route accessed on: ", d, " 🕵️");
      next();
    } else {
      res
        .status(403)
        .json({
          error: {
            message:
              "Your are not allowed to do this, probably you shouldn't be on this route",
          },
        });
    }
  });
};

module.exports = {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
};
