const User = require("../models/user.js");

const getUser = async (req, res) => {
  const userId = req.params.id;

  User.findById(userId, (err, user) => {
    if (err) {
      return res.status(400).json({ success: false, err });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  });
};

const getAllUsers = async (req, res) => {
  User.find({}, (err, users) => {
    if (err) {
      return res.status(400).json({ success: false, err });
    }

    return res.status(200).json({
      success: true,
      usersList: users,
    });
  });
};

const getAllMembers = async (req, res) => {
  User.find({ isAdmin: false }, (err, members) => {
    if (err) {
      return res.status(400).json({ success: false, err });
    }

    return res.status(200).json({
      success: true,
      membersList: members,
    });
  });
};

const addUser = async (req, res) => {
  const newUserData = req.body; // Use a different name for clarity

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email: newUserData.email });
    if (existingUser) {
      return res.status(403).json({ success: false, message: "User already exists" });
    }

    const newUser = new User(newUserData);
    newUser.setPassword(newUserData.password);

    // Save the new user
    const savedUser = await newUser.save();
    return res.status(201).json({
      success: true,
      user: savedUser,
    });
  } catch (err) {
    console.error(err); // Log the error for debugging
    return res.status(400).json({ success: false, err });
  }
};


const updateUser = async (req, res) => {
  const userId = req.params.id;
  const updatedUser = new User(req.body);
  updatedUser.setPassword(req.body.password);

  User.findByIdAndUpdate(userId, updatedUser, (err, user) => {
    if (err) {
      return res.status(400).json({ success: false, err });
    }

    return res.status(200).json({
      success: true,
      updatedUser: user,
    });
  });
};

const deleteUser = async (req, res) => {
  const userId = req.params.id;

  User.findByIdAndDelete(userId, (err, user) => {
    if (err) {
      return res.status(400).json({ success: false, err });
    }

    return res.status(200).json({
      success: true,
      deletedUser: user,
    });
  });
};

module.exports = {
  getUser,
  getAllUsers,
  getAllMembers,
  addUser,
  updateUser,
  deleteUser,
};
