import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import { catchAsync } from "../middlewares/globaleerorshandling.js";
import { AppError } from "../middlewares/globaleerorshandling.js";
import { User } from "../models/User.js";

dotenv.config()

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
})
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()

    if (users.length === 0) {
      res.status(404).json({ success: false, error: 'No users found' })
    } else {
      res.status(200).json({
        success: true,
        message: 'Users retrieved successfully',
        data: users
      })
    }
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal Server Error' })
  }
}
export const deleteUserById = async (req, res) => {
  const { id } = req.params
  try {
    const result = await User.findByIdAndDelete(id)
    if (!result) {
      res.status(404).json({ success: false, error: 'User not found' })
    } else {
      res
        .status(200)
        .json({ success: true, message: 'User deleted successfully' })
    }
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal Server Error' })
  }
}

// 

export const updateUserById = async (req, res) => {
  const { id } = req.params;
  let newObject = { ...req.body };

  if (req.files && req.files.image) {
    const file = req.files.image[0];

    // Check if the file is an image
    if (!file.mimetype.startsWith("image/")) {
      return res.status(400).json({ success: false, error: "Uploaded file is not an image" });
    }

    // Check if the file has content
    if (!file.size) {
      return res.status(400).json({ success: false, error: "Uploaded image is empty" });
    }

    // Upload the image to Cloudinary
    try {
      const uploadResult = await cloudinary.uploader.upload(file.path);
      newObject.image = uploadResult.secure_url;
    } catch (uploadError) {
      return res.status(500).json({ success: false, error: "Image upload failed" });
    }
  }

  try {
    const result = await User.findByIdAndUpdate(id, newObject, {
      new: true,
      runValidators: true,
    });

    if (!result) {
      res.status(404).json({ success: false, error: "User not found" });
    } else {
      res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: result,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

export const addAdmin= async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const result = await User.findById(id);
    result.role="admin";
await result.save();
    if (!result) {
      res.status(404).json({ success: false, error: 'User not found' });
    } else {
      res.status(200).json({ success: true, message: 'User updated successfully and is admin now', data: result });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};
  
export const removeAddimin= async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const result = await User.findById(id);
    result.role="user";
await result.save();
    if (!result) {
      res.status(404).json({ success: false, error: 'User not found' });
    } else {
      res.status(200).json({ success: true, message: 'User updated successfully and is user by role now', data: result });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};
  
export const updateDeliveryLocation = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const { delivelinglocation } = req.body;

  if (!delivelinglocation) {
    return next(new AppError('Delivery location is required', 400));
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { delivelinglocation },
    { new: true, runValidators: true }
  );

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'Delivery location updated successfully',
    data: user,
  });
});
