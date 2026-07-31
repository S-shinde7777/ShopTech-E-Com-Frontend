import initialProducts from "../data/products";
import initialCategories from "../data/categories";

const PRODUCTS_KEY = "shoptech_products";
const CATEGORIES_KEY = "shoptech_categories";

// Seed data helper
const seedData = () => {
  if (!localStorage.getItem(PRODUCTS_KEY)) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(initialProducts));
  }
  if (!localStorage.getItem(CATEGORIES_KEY)) {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(initialCategories));
  }
};

// Initialize
seedData();

export const productService = {
  // PRODUCTS
  getProducts: () => {
    seedData();
    return JSON.parse(localStorage.getItem(PRODUCTS_KEY)) || [];
  },

  getProductById: (id) => {
    const products = productService.getProducts();
    return products.find((p) => p.id === Number(id));
  },

  createProduct: (productData) => {
    const products = productService.getProducts();
    const newProduct = {
      ...productData,
      id: products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1,
      price: Number(productData.price),
      oldPrice: productData.oldPrice ? Number(productData.oldPrice) : null,
      rating: productData.rating ? Number(productData.rating) : 4.0,
      stock: productData.stock ? Number(productData.stock) : 10,
    };
    
    products.push(newProduct);
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    
    // Update items count in category
    productService.adjustCategoryCount(productData.category, 1);
    
    return newProduct;
  },

  updateProduct: (id, productData) => {
    const products = productService.getProducts();
    const index = products.findIndex((p) => p.id === Number(id));
    if (index === -1) return null;

    const oldCategory = products[index].category;
    const updatedProduct = {
      ...products[index],
      ...productData,
      id: Number(id),
      price: Number(productData.price),
      oldPrice: productData.oldPrice ? Number(productData.oldPrice) : null,
      rating: productData.rating ? Number(productData.rating) : products[index].rating,
      stock: productData.stock !== undefined ? Number(productData.stock) : products[index].stock,
    };

    products[index] = updatedProduct;
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));

    // If category changed, adjust counts
    if (oldCategory !== productData.category) {
      productService.adjustCategoryCount(oldCategory, -1);
      productService.adjustCategoryCount(productData.category, 1);
    }

    return updatedProduct;
  },

  deleteProduct: (id) => {
    const products = productService.getProducts();
    const product = products.find((p) => p.id === Number(id));
    if (!product) return false;

    const filtered = products.filter((p) => p.id !== Number(id));
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(filtered));

    // Decrement items count in category
    productService.adjustCategoryCount(product.category, -1);
    return true;
  },

  // CATEGORIES
  getCategories: () => {
    seedData();
    return JSON.parse(localStorage.getItem(CATEGORIES_KEY)) || [];
  },

  createCategory: (categoryData) => {
    const categories = productService.getCategories();
    
    // Check if category already exists
    const exists = categories.find((c) => c.name.toLowerCase() === categoryData.name.toLowerCase());
    if (exists) return exists;

    const newCategory = {
      ...categoryData,
      id: categories.length > 0 ? Math.max(...categories.map((c) => c.id)) + 1 : 1,
      items: 0,
      image: categoryData.image || "https://cdn-icons-png.flaticon.com/512/3081/3081559.png"
    };

    categories.push(newCategory);
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
    return newCategory;
  },

  updateCategory: (id, categoryData) => {
    const categories = productService.getCategories();
    const index = categories.findIndex((c) => c.id === Number(id));
    if (index === -1) return null;

    const updatedCategory = {
      ...categories[index],
      ...categoryData,
      id: Number(id)
    };

    categories[index] = updatedCategory;
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
    return updatedCategory;
  },

  deleteCategory: (id) => {
    const categories = productService.getCategories();
    const filtered = categories.filter((c) => c.id !== Number(id));
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(filtered));
    return true;
  },

  adjustCategoryCount: (categoryName, amount) => {
    if (!categoryName) return;
    const categories = productService.getCategories();
    const index = categories.findIndex((c) => c.name.toLowerCase() === categoryName.toLowerCase());
    if (index !== -1) {
      categories[index].items = Math.max(0, categories[index].items + amount);
      localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
    }
  }
};
