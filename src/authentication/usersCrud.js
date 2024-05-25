import { catchAsync } from "../middlewares/globaleerorshandling.js";
import { AppError } from "../middlewares/globaleerorshandling.js";
import { User } from "../models/User.js";

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

export const updateUserById = async (req, res) => {
  const { id } = req.params
  const updates = req.body

  try {
    const result = await User.findByIdAndUpdate(id, updates, {
      new: true
    })
    await result.save()
    if (!result) {
      res.status(404).json({ success: false, error: 'User not found' })
    } else {
      res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: result
      })
    }
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal Server Error' })
  }
}

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
