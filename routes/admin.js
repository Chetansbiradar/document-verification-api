const router = require("express").Router();
const User = require("../models/User");
const { verifyTokenAndAdmin } = require("./verifyToken");

// getRegisteredUsers //accessLevel=0
router.get("/registeredusers", verifyTokenAndAdmin, async (req, res, next) => {
  const users = await User.find({ accessLevel: 0 });
  let destructeredUsers = new Array();
  if (users) {
    //remove password from users
    for (i = 0; i < users.length; i++) {
      const { password, ...other } = users[i]._doc;
      destructeredUsers.push(other);
    }
    return res.status(200).json(destructeredUsers);
  }
});

// giveAccessToUser //toMake accessLevel=0/1/2
router.get(
  "/upgradeuser/:id/:accessLevel",
  verifyTokenAndAdmin,
  async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user)
        return res.status(400).json({ error: { message: "Invalid User ID" } });
      if (req.params.accessLevel > 2 || req.params.accessLevel < 0)
        return res
          .status(400)
          .json({ error: { message: "Invalid Access Level" } });
      const updated = await User.updateOne(
        { _id: req.params.id },
        { accessLevel: req.params.accessLevel }
      );
      if (updated.modifiedCount === 1)
        return res.status(202).json({ message: "User Updated Successfully" });
    } catch (error) {
      return res
        .status(400)
        .json({
          error: {
            message: "No User found by that ID or Coudn't update the user",
          },
        });
    }
  }
);
// getRegisteredAuth //accessLevel=1
router.get(
  "/registeredauthuser",
  verifyTokenAndAdmin,
  async (req, res, next) => {
    try {
      const users = await User.find({
        $or: [{ accessLevel: 1 }, { accessLevel: 2 }],
      });
      let destructeredUsers = new Array();
      if (users) {
        //remove password from users

        for (i = 0; i < users.length; i++) {
          const { password, ...other } = users[i]._doc;
          destructeredUsers.push(other);
        }

        return res.status(200).json(destructeredUsers);
      }
      res.json({});
    } catch (error) {
      return res.status(400).json({ error: { message: error } });
    }
  }
);

module.exports = router;
