const router = require("express").Router();

const User = require("../models/User");
const { verifyTokenAndAdmin } = require("../utils/verifyToken");

//Get all users
router.get("/get-all-users", verifyTokenAndAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ name: 1 });
    if (!users) throw new Error("No users found");
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// getRegisteredUsers where accessLevel = 0
router.get("/get-users-0", verifyTokenAndAdmin, async (req, res, next) => {
  try {
    const users = await User.find({ accessLevel: 0 }).select("-password");
    if (!users) throw new Error("No users found");
    return res.status(200).json(users);
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
});

// getRegisteredAuth where accessLevel = 1 or 2
router.get(
  "/get-upgraded-users",
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

// upgrade or downgrade user accessLevel
router.get(
  "/update-access-level/:id/:accessLevel",
  verifyTokenAndAdmin,
  async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) throw new Error("User not found");

      if (req.params.accessLevel > 2 || req.params.accessLevel < 0)
        throw new Error("Invalid access level");

      const updated = await User.updateOne(
        { _id: req.params.id },
        { accessLevel: req.params.accessLevel }
      );

      if (updated.modifiedCount === 1)
        return res
          .status(202)
          .json({ success: true, message: "User Updated Successfully" });
      else throw new Error("User not updated");
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  }
);

// delete user
router.get("/delete-user/:id", verifyTokenAndAdmin, async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) throw new Error("User not found");

    const deleted = await User.deleteOne({ _id: user._id });
    if (!deleted) throw new Error("User not deleted");

    if (deleted.deletedCount === 1)
      return res
        .status(202)
        .json({ success: true, message: "User Deleted Successfully" });
    else throw new Error("User not deleted");
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;
