import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";


export const updateAvatar = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: "No image uploaded" });

    const avatarUrl = req.file.path;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: avatarUrl },
      { new: true }
    );

    res.json({
      message: "Avatar updated",
      avatar: user.avatar
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const updateProfile = async (req, res) => {
  try {
    const updates = {};

    if (req.body.name) updates.name = req.body.name;
    if (req.body.email) updates.email = req.body.email;

    if (req.file) {
      updates.avatar = req.file.path;
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
    });

    res.json(user);

  } 
  catch (error) {
    res.status(500).json({ message: "Update failed", error });
  }
};
