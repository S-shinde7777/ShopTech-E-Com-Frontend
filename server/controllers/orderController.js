const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingDetails, paymentMethod, totalAmount } = req.body;

  if (!items || items.length === 0) {
    res.status(400);
    throw new Error('No order items provided');
  }

  if (!shippingDetails || !paymentMethod) {
    res.status(400);
    throw new Error('Please provide shipping details and payment method');
  }

  // Calculate prices
  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 5000 ? 0 : 150;
  const gstTax = Math.round(subtotal * 0.18);
  const calculatedTotal = subtotal + shipping + gstTax;

  // Format order items
  const orderItems = items.map((item) => ({
    productId: item.id || item._id,
    name: item.name,
    image: item.image,
    price: item.price,
    category: item.category,
    quantity: item.quantity,
  }));

  const order = await Order.create({
    user: req.user._id,
    userEmail: req.user.email,
    items: orderItems,
    shippingDetails,
    paymentMethod,
    subtotal,
    gstTax,
    shipping,
    totalAmount: calculatedTotal,
    status: 'Pending',
  });

  // Decrement stock for ordered products
  for (const item of items) {
    const prodId = item.id || item._id;
    await Product.findByIdAndUpdate(prodId, {
      $inc: { stock: -item.quantity },
    });
  }

  res.status(201).json({
    success: true,
    message: 'Order created successfully',
    order,
  });
});

// @desc    Get logged in user orders
// @route   GET /api/orders/my
// @access  Private
const getUserOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({
    createdAt: -1,
  });

  res.json({
    success: true,
    count: orders.length,
    orders,
  });
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate('user', 'id name email')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: orders.length,
    orders,
  });
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  if (!status || !validStatuses.includes(status)) {
    res.status(400);
    throw new Error('Please provide a valid status option');
  }

  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  order.status = status;

  if (status === 'Delivered') {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
  }

  const updatedOrder = await order.save();

  res.json({
    success: true,
    message: `Order status updated to ${status}`,
    order: updatedOrder,
  });
});

module.exports = {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
};
