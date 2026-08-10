const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const Category = require('../models/Category');

// @desc    Fetch all products (with search, category filter, price range & sort)
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const { search, category, minPrice, maxPrice, sort } = req.query;

  let query = {};

  // Search filter
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { category: { $regex: search, $options: 'i' } },
    ];
  }

  // Category filter
  if (category) {
    query.category = { $regex: new RegExp(`^${category}$`, 'i') };
  }

  // Price range filter
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  // Sorting
  let sortOption = {};
  if (sort === 'price-low') {
    sortOption = { price: 1 };
  } else if (sort === 'price-high') {
    sortOption = { price: -1 };
  } else if (sort === 'rating') {
    sortOption = { rating: -1 };
  } else {
    sortOption = { createdAt: -1 };
  }

  const products = await Product.find(query).sort(sortOption);

  res.json({
    success: true,
    count: products.length,
    products,
  });
});

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json({
      success: true,
      product,
    });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, oldPrice, category, image, stock, rating } = req.body;

  if (!name || !description || !price || !category || !image) {
    res.status(400);
    throw new Error('Please provide all required product fields');
  }

  const product = await Product.create({
    name,
    description,
    price: Number(price),
    oldPrice: oldPrice ? Number(oldPrice) : null,
    category,
    image,
    stock: stock !== undefined ? Number(stock) : 10,
    rating: rating ? Number(rating) : 4.5,
  });

  // Update Category item count
  await Category.findOneAndUpdate(
    { name: { $regex: new RegExp(`^${category}$`, 'i') } },
    { $inc: { items: 1 } }
  );

  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    product,
  });
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const oldCategory = product.category;

  product.name = req.body.name || product.name;
  product.description = req.body.description || product.description;
  product.price = req.body.price !== undefined ? Number(req.body.price) : product.price;
  product.oldPrice = req.body.oldPrice !== undefined ? (req.body.oldPrice ? Number(req.body.oldPrice) : null) : product.oldPrice;
  product.category = req.body.category || product.category;
  product.image = req.body.image || product.image;
  product.stock = req.body.stock !== undefined ? Number(req.body.stock) : product.stock;
  product.rating = req.body.rating !== undefined ? Number(req.body.rating) : product.rating;

  const updatedProduct = await product.save();

  // If category changed, adjust category counts
  if (req.body.category && oldCategory !== req.body.category) {
    await Category.findOneAndUpdate(
      { name: { $regex: new RegExp(`^${oldCategory}$`, 'i') } },
      { $inc: { items: -1 } }
    );
    await Category.findOneAndUpdate(
      { name: { $regex: new RegExp(`^${req.body.category}$`, 'i') } },
      { $inc: { items: 1 } }
    );
  }

  res.json({
    success: true,
    message: 'Product updated successfully',
    product: updatedProduct,
  });
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const categoryName = product.category;
  await product.deleteOne();

  // Decrement Category item count
  await Category.findOneAndUpdate(
    { name: { $regex: new RegExp(`^${categoryName}$`, 'i') } },
    { $inc: { items: -1 } }
  );

  res.json({
    success: true,
    message: 'Product deleted successfully',
  });
});

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
