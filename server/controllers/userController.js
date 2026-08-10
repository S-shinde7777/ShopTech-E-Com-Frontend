const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// @desc    Get all registered users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });

  res.json({
    success: true,
    count: users.length,
    users,
  });
});

// @desc    Update user role
// @route   PUT /api/users/:id/role
// @access  Private/Admin
const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;

  if (!role || !['customer', 'admin'].includes(role)) {
    res.status(400);
    throw new Error('Please provide a valid role (customer or admin)');
  }

  // Prevent self-role editing
  if (req.params.id === req.user._id.toString()) {
    res.status(400);
    throw new Error('You cannot change your own admin role');
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.role = role;
  const updatedUser = await user.save();

  res.json({
    success: true,
    message: `User role updated to ${role}`,
    user: {
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
    },
  });
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  // Prevent self-deletion
  if (req.params.id === req.user._id.toString()) {
    res.status(400);
    throw new Error('You cannot delete your own admin account');
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  await user.deleteOne();

  res.json({
    success: true,
    message: 'User deleted successfully',
  });
});

module.exports = {
  getUsers,
  updateUserRole,
  deleteUser,
};
