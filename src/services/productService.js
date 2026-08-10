import { apiFetch } from './api';

export const productService = {
  // PRODUCTS
  getProducts: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.category) params.append('category', filters.category);
    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
    if (filters.sort) params.append('sort', filters.sort);

    const queryString = params.toString() ? `?${params.toString()}` : '';
    const data = await apiFetch(`/products${queryString}`);
    
    // Map _id to id for frontend compatibility
    return data.products.map(p => ({ ...p, id: p._id }));
  },

  getProductById: async (id) => {
    const data = await apiFetch(`/products/${id}`);
    if (data.product) {
      return { ...data.product, id: data.product._id };
    }
    return null;
  },

  createProduct: async (productData) => {
    const data = await apiFetch('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
    return { ...data.product, id: data.product._id };
  },

  updateProduct: async (id, productData) => {
    const data = await apiFetch(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
    return { ...data.product, id: data.product._id };
  },

  deleteProduct: async (id) => {
    const data = await apiFetch(`/products/${id}`, {
      method: 'DELETE',
    });
    return data.success;
  },

  // CATEGORIES
  getCategories: async () => {
    const data = await apiFetch('/categories');
    return data.categories.map(c => ({ ...c, id: c._id }));
  },

  createCategory: async (categoryData) => {
    const data = await apiFetch('/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
    return { ...data.category, id: data.category._id };
  },

  updateCategory: async (id, categoryData) => {
    const data = await apiFetch(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    });
    return { ...data.category, id: data.category._id };
  },

  deleteCategory: async (id) => {
    const data = await apiFetch(`/categories/${id}`, {
      method: 'DELETE',
    });
    return data.success;
  },
};
