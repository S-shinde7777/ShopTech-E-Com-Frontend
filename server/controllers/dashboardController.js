const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// @desc    Get Admin Dashboard Stats
// @route   GET /api/dashboard/stats
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
  // Aggregate sales total for non-cancelled orders
  const salesResult = await Order.aggregate([
    { $match: { status: { $ne: 'Cancelled' } } },
    { $group: { _id: null, totalSales: { $sum: '$totalAmount' } } },
  ]);

  const totalSales = salesResult.length > 0 ? salesResult[0].totalSales : 0;
  const ordersCount = await Order.countDocuments();
  const productsCount = await Product.countDocuments();
  const usersCount = await User.countDocuments();

  // Get recent 5 orders
  const recentOrders = await Order.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .select('id userEmail totalAmount status createdAt');

  res.json({
    success: true,
    stats: {
      sales: totalSales,
      ordersCount,
      productsCount,
      usersCount,
    },
    recentOrders,
  });
});

module.exports = {
  getDashboardStats,
};
