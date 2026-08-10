const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');

// Load environment variables
dotenv.config({ path: '../.env' });
if (!process.env.MONGO_URI) {
  dotenv.config({ path: './.env' });
}

const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Order = require('../models/Order');

const connectDB = require('../config/db');

// Sample Seed Data
const sampleCategories = [
  {
    name: 'Electronics',
    items: 2,
    image: 'https://cdn-icons-png.flaticon.com/512/3659/3659898.png',
  },
  {
    name: 'Fashion',
    items: 1,
    image: 'https://cdn-icons-png.flaticon.com/512/3531/3531815.png',
  },
  {
    name: 'Gaming',
    items: 2,
    image: 'https://cdn-icons-png.flaticon.com/512/686/686589.png',
  },
  {
    name: 'Accessories',
    items: 1,
    image: 'https://cdn-icons-png.flaticon.com/512/3081/3081559.png',
  },
];

const sampleProducts = [
  {
    name: 'Wireless Headphone',
    category: 'Electronics',
    price: 2499,
    oldPrice: 3499,
    rating: 4.5,
    stock: 15,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
    description: 'Premium wireless headphone with noise cancellation and deep bass.',
  },
  {
    name: 'Smart Watch',
    category: 'Electronics',
    price: 3999,
    oldPrice: 4999,
    rating: 4.7,
    stock: 10,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
    description: 'Modern smartwatch with health tracking and notifications.',
  },
  {
    name: 'Gaming Keyboard',
    category: 'Gaming',
    price: 1999,
    oldPrice: 2799,
    rating: 4.6,
    stock: 20,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3',
    description: 'RGB mechanical gaming keyboard for professional gamers.',
  },
  {
    name: 'Running Shoes',
    category: 'Fashion',
    price: 2999,
    oldPrice: 3999,
    rating: 4.4,
    stock: 8,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
    description: 'Comfortable lightweight running shoes for daily use.',
  },
  {
    name: 'Backpack',
    category: 'Accessories',
    price: 1499,
    oldPrice: 1999,
    rating: 4.3,
    stock: 25,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62',
    description: 'Stylish backpack with multiple storage compartments.',
  },
  {
    name: 'Gaming Mouse',
    category: 'Gaming',
    price: 1299,
    oldPrice: 1799,
    rating: 4.5,
    stock: 12,
    image: 'https://images.unsplash.com/photo-1527814050087-3793815479db',
    description: 'High precision gaming mouse with adjustable DPI.',
  },
];

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    await Order.deleteMany();

    console.log('🗑️ Existing data cleared...'.yellow);

    // Create Default Users
    const adminUser = await User.create({
      name: 'Default Admin',
      email: 'admin@shoptech.com',
      password: 'admin123',
      role: 'admin',
    });

    const customerUser = await User.create({
      name: 'Default User',
      email: 'user@shoptech.com',
      password: 'user123',
      role: 'customer',
    });

    console.log('👤 Default accounts created: admin@shoptech.com & user@shoptech.com'.green);

    // Seed Categories
    await Category.insertMany(sampleCategories);
    console.log('📁 Sample categories imported!'.green);

    // Seed Products
    await Product.insertMany(sampleProducts);
    console.log('🛍️ Sample products imported!'.green);

    console.log('✅ Database Seed Completed Successfully!'.cyan.bold.underline);
    process.exit();
  } catch (error) {
    console.error(`❌ Seeder Error: ${error.message}`.red.bold);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();
    await User.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    await Order.deleteMany();

    console.log('🗑️ All Database Data Destroyed!'.red.bold);
    process.exit();
  } catch (error) {
    console.error(`❌ Error: ${error.message}`.red.bold);
    process.exit(1);
  }
};

if (process.argv[2] === '--destroy') {
  destroyData();
} else {
  seedData();
}
