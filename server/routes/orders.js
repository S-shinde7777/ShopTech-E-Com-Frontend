const express = require('express');
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createOrder)
  .get(protect, adminOnly, getAllOrders);

router.get('/my', protect, getUserOrders);
router.put('/:id/status', protect, adminOnly, updateOrderStatus);

module.exports = router;
