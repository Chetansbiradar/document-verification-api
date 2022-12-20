const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const createToken = require("../utils/createToken");
const { verifyToken } = require("../utils/verifyToken");

//Register
router.post("/register", async (req, res) => {
  try {
    //destruture req.body
    const { name, email, password } = req.body;

    //check if all fields are filled
    if (!name || !email || !password) throw new Error("Please fill all fields");

    //check if email exits in db
    const emailExits = await User.findOne({ email });
    if (emailExits) throw new Error("Email already exists");

    const salt = await bcrypt.genSalt(10); //salting password
    if (!salt) throw new Error("Something went wrong while salting password");

    const hashedPassword = await bcrypt.hash(req.body.password, salt); //hashing password
    if (!hashedPassword)
      throw new Error("Something went wrong while hashing password");

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();
    if (!savedUser) throw Error("Something went wrong while saving the user");

    const accessToken = await createToken(savedUser, process.env.JWT_SECRET, "3d");

    res
      .cookie("token", accessToken, {
        httpOnly: true,
      })
      .status(200)
      .json({
        success: true,
        accessToken,
        message: "User registered successfully",
      });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
});

//Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) throw new Error("Please fill all fields");

    const user = await User.findOne({ email });
    if (!user) throw new Error("User does not exist");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid Credentials");

    const accessToken = await createToken(user, process.env.JWT_SECRET, "3d");
    if (!accessToken) throw new Error("Something went wrong while creating token");
    res
      .cookie("token", accessToken, {
        httpOnly: true,
      })
      .status(200)
      .json({
        success: true,
        message: "User logged in successfully",
      });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
});

//Logout
router.get("/logout", (req, res) => {
  res
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
    })
    .status(200)
    .json({
      success: true,
      message: "User logged out successfully",
    });
});

//refresh token
router.get("/refresh-token", verifyToken, async (req, res) => {
  try {  
    const user = await User.findById(req.user._id);
    if (!user) throw new Error("User not found");
  
    const newToken = await createToken(user, process.env.JWT_SECRET, "3d");
    if (!newToken) throw new Error("Something went wrong while creating token");
  
    res
    .cookie("token", newToken, {
      httpOnly: true,
    })
    .status(200)
    .json({
      success: true,
      accessLevel: user.accessLevel,
      message: "Token refreshed successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }

});

//reset password
router.post("/reset-password", verifyToken, async (req, res) => {
  try {

    const user = await User.findById(req.user._id);
    if (!user) throw new Error("User not found");

    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) throw new Error("Please fill all fields");

    const oldPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
    if (!oldPasswordCorrect) throw new Error("Invalid credentials");

    const salt = await bcrypt.genSalt(10); //salting password
    if (!salt) throw new Error("Something went wrong while salting password");

    const hashedPassword = await bcrypt.hash(newPassword, salt); //hashing password
    if (!hashedPassword)
      throw new Error("Something went wrong while hashing password");

    user.password = hashedPassword;
    const savedUser = await user.save();
    if (!savedUser) throw Error("Something went wrong while saving the user");

    res.status(200).json({
      success: true,
      accessLevel: user.accessLevel,
      message: "Password reset successfully",
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;