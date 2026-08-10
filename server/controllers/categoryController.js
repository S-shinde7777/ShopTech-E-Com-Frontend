const asyncHandler = require('express-async-handler');
const Category = require('../models/Category');
const Product = require('../models/Product');

// @desc    Get all categories with dynamic item count
// @route   GET /api/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ name: 1 });

  // Recalculate dynamic item counts for accuracy
  const categoriesWithCounts = await Promise.all(
    categories.map(async (cat) => {
      const count = await Product.countDocuments({
        category: { $regex: new RegExp(`^${cat.name}$`, 'i') },
      });
      return {
        id: cat._id,
        _id: cat._id,
        name: cat.name,
        image: cat.image,
        items: count,
      };
    })
  );

  res.json({
    success: true,
    categories: categoriesWithCounts,
  });
});

// @desc    Create category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = asyncHandler(async (req, res) => {
  const { name, image } = req.body;

  if (!name) {
    res.status(400);
    throw new Error('Category name is required');
  }

  const categoryExists = await Category.findOne({
    name: { $regex: new RegExp(`^${name}$`, 'i') },
  });

  if (categoryExists) {
    res.status(400);
    throw new Error('Category with this name already exists');
  }

  const category = await Category.create({
    name,
    image: image || 'https://cdn-icons-png.flaticon.com/512/3081/3081559.png',
  });

  res.status(201).json({
    success: true,
    message: 'Category created successfully',
    category,
  });
});

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  category.name = req.body.name || category.name;
  category.image = req.body.image || category.image;

  const updatedCategory = await category.save();

  res.json({
    success: true,
    message: 'Category updated successfully',
    category: updatedCategory,
  });
});

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  await category.deleteOne();

  res.json({
    success: true,
    message: 'Category deleted successfully',
  });
});

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
