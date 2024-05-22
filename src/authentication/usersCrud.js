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
    const result = awaitUser.findByIdAndDelete(id)
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
    const result = awaitUser.findByIdAndUpdate(id, updates, {
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
