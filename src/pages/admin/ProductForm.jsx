import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Save, Sparkles, Image as ImageIcon } from "lucide-react";
import { productService } from "../../services/productService";

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    oldPrice: "",
    rating: "4.5",
    stock: "10",
    image: "",
    description: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initForm = async () => {
      try {
        const cats = await productService.getCategories();
        setCategories(cats || []);

        if (isEditMode) {
          const product = await productService.getProductById(id);
          if (product) {
            setFormData({
              name: product.name,
              category: product.category,
              price: product.price.toString(),
              oldPrice: product.oldPrice ? product.oldPrice.toString() : "",
              rating: product.rating ? product.rating.toString() : "4.5",
              stock: product.stock !== undefined ? product.stock.toString() : "10",
              image: product.image,
              description: product.description,
            });
          } else {
            setError("Product not found");
          }
        }
      } catch (err) {
        console.error("Failed to load form data", err);
      }
    };
    initForm();
  }, [id, isEditMode]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validations
    if (!formData.name.trim()) return setError("Product name is required.");
    if (!formData.category) return setError("Please select a category.");
    if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0) {
      return setError("Price must be a valid positive number.");
    }
    if (formData.oldPrice && (isNaN(formData.oldPrice) || Number(formData.oldPrice) <= 0)) {
      return setError("Old price must be a valid positive number if provided.");
    }
    if (!formData.image.trim()) return setError("Product image URL is required.");
    if (!formData.description.trim()) return setError("Description is required.");

    setLoading(true);

    try {
      const payload = {
        name: formData.name.trim(),
        category: formData.category,
        price: Number(formData.price),
        oldPrice: formData.oldPrice ? Number(formData.oldPrice) : null,
        rating: Number(formData.rating) || 4.5,
        stock: Number(formData.stock) || 10,
        image: formData.image.trim(),
        description: formData.description.trim(),
      };

      if (isEditMode) {
        await productService.updateProduct(id, payload);
      } else {
        await productService.createProduct(payload);
      }

      navigate("/admin/products");
    } catch (err) {
      setError("Failed to save product details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Navigation Header */}
      <div className="flex items-center gap-3">
        <Link to="/admin/products" className="text-gray-400 hover:text-white transition">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-extrabold text-white">
            {isEditMode ? "Edit Product Details" : "Add Catalog Product"}
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            {isEditMode 
              ? `Modify parameters for catalog ID #${id}`
              : "Register a brand new item in the storefront databases"
            }
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm max-w-3xl">
          ⚠️ {error}
        </div>
      )}

      {/* Forms box */}
      <form onSubmit={handleSubmit} className="bg-[#171B26] border border-gray-800 rounded-3xl p-6 md:p-8 shadow-md grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl">
        
        {/* Left Forms Inputs */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Title */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-gray-400 uppercase">Product Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Mechanical Gaming Keyboard"
                className="w-full bg-[#0F1117] border border-gray-800 rounded-xl px-4 py-3 text-white outline-none focus:border-[#F5A623] text-sm"
              />
            </div>

            {/* Category selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-[#0F1117] border border-gray-800 rounded-xl px-4 py-3 text-white outline-none focus:border-[#F5A623] text-sm cursor-pointer"
              >
                <option value="">Choose category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Stock units */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">Initial Stock Level</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="10"
                min="0"
                className="w-full bg-[#0F1117] border border-gray-800 rounded-xl px-4 py-3 text-white outline-none focus:border-[#F5A623] text-sm"
              />
            </div>

            {/* Price */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">Selling Price (₹)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="4999"
                className="w-full bg-[#0F1117] border border-gray-800 rounded-xl px-4 py-3 text-white outline-none focus:border-[#F5A623] text-sm"
              />
            </div>

            {/* Old Price */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">Old Price / MSRP (₹)</label>
              <input
                type="number"
                name="oldPrice"
                value={formData.oldPrice}
                onChange={handleChange}
                placeholder="5999"
                className="w-full bg-[#0F1117] border border-gray-800 rounded-xl px-4 py-3 text-white outline-none focus:border-[#F5A623] text-sm"
              />
            </div>

            {/* Rating */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">Mock User Rating (1-5)</label>
              <input
                type="number"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                placeholder="4.5"
                step="0.1"
                min="1"
                max="5"
                className="w-full bg-[#0F1117] border border-gray-800 rounded-xl px-4 py-3 text-white outline-none focus:border-[#F5A623] text-sm"
              />
            </div>

            {/* Image URL */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-gray-400 uppercase">Image URL Link</label>
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full bg-[#0F1117] border border-gray-800 rounded-xl px-4 py-3 text-white outline-none focus:border-[#F5A623] text-sm"
              />
            </div>

            {/* Description */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-gray-400 uppercase">Product Description</label>
              <textarea
                name="description"
                rows="5"
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide deep descriptions, features, configuration details..."
                className="w-full bg-[#0F1117] border border-gray-800 rounded-xl px-4 py-3 text-white outline-none focus:border-[#F5A623] text-sm resize-none"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Right Preview Side column */}
        <div className="border-t lg:border-t-0 lg:border-l border-white/5 pt-8 lg:pt-0 lg:pl-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#5FE3CF] uppercase tracking-wider flex items-center gap-2">
              <Sparkles size={16} />
              <span>Visual Preview</span>
            </h3>

            {/* Mock Card Preview */}
            <div className="bg-[#0F1117] border border-gray-850 rounded-2xl overflow-hidden shadow-inner p-4 flex flex-col items-center justify-center min-h-[220px]">
              {formData.image.trim() ? (
                <img
                  src={formData.image}
                  alt="preview"
                  onError={(e) => {
                    e.target.src = "https://placehold.co/400x300/171b26/ffffff?text=Invalid+Image+URL";
                  }}
                  className="max-h-48 w-full object-cover rounded-xl shadow-md"
                />
              ) : (
                <div className="text-center text-gray-600 text-xs">
                  <ImageIcon size={36} className="mx-auto mb-2 opacity-50" />
                  <span>Provide an image URL link to preview details</span>
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="space-y-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#F5A623] text-black font-extrabold py-3.5 rounded-xl hover:scale-102 hover:shadow-[0_0_15px_rgba(245,166,35,0.3)] transition text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <Save size={16} />
              <span>{loading ? "Saving catalog..." : "Save Product"}</span>
            </button>
            
            <Link to="/admin/products" className="block">
              <button
                type="button"
                className="w-full border border-gray-800 text-gray-400 hover:text-white py-3.5 rounded-xl font-bold text-sm transition text-center cursor-pointer"
              >
                Cancel Changes
              </button>
            </Link>
          </div>
        </div>

      </form>
    </div>
  );
};

export default ProductForm;
