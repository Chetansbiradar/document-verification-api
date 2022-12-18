const jwt = require("jsonwebtoken");

module.exports = async (user, secret, exp) => {
  const { _id, name,email, accessLevel } = user;
  return jwt.sign(
    {
      _id,
      name,
      email,
      accessLevel,
    },
    secret,
    { expiresIn: exp }
  );
};
