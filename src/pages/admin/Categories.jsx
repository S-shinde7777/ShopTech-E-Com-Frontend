import React, { useEffect, useState } from "react";
import { Plus, Trash2, Tag, AlertCircle } from "lucide-react";
import { productService } from "../../services/productService";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  
  // Form states
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = () => {
    setCategories(productService.getCategories());
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!name.trim()) return setError("Category name is required.");

    try {
      const payload = {
        name: name.trim(),
        image: image.trim() || undefined // uses default in service if empty
      };

      productService.createCategory(payload);
      setSuccess(true);
      setName("");
      setImage("");
      loadCategories();

      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      setError("Failed to create category.");
    }
  };

  const handleDeleteCategory = (id) => {
    // Basic verification confirmation
    if (window.confirm("Are you sure you want to delete this category? This will not delete the products under it, but their category association might show as default.")) {
      productService.deleteCategory(id);
      loadCategories();
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white">Categories Management</h1>
        <p className="text-gray-400 text-sm mt-1">
          Add new filter categories or delete existing directories.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start max-w-6xl">
        
        {/* Form to Add Category (Left) */}
        <div className="bg-[#171B26] p-6 rounded-3xl border border-gray-800 shadow-md space-y-6">
          <h2 className="text-lg font-bold text-white border-b border-white/5 pb-3 flex items-center gap-2">
            <Plus size={18} className="text-[#F5A623]" />
            <span>Create Category</span>
          </h2>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle size={14} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-xl text-xs">
              🎉 Category successfully created!
            </div>
          )}

          <form onSubmit={handleAddCategory} className="space-y-4">
            {/* Category Name */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">Category Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Developer Wear"
                className="w-full bg-[#0F1117] border border-gray-800 rounded-xl px-4 py-3 text-white outline-none focus:border-[#F5A623] text-sm"
              />
            </div>

            {/* Icon URL */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">Icon Image URL (Optional)</label>
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://cdn-icons-png.flaticon.com/..."
                className="w-full bg-[#0F1117] border border-gray-800 rounded-xl px-4 py-3 text-white outline-none focus:border-[#F5A623] text-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#F5A623] text-black font-extrabold py-3.5 rounded-xl hover:scale-102 transition text-sm flex items-center justify-center gap-1 cursor-pointer"
            >
              <Plus size={16} />
              <span>Create Category</span>
            </button>
          </form>
        </div>

        {/* Categories List Table (Right) */}
        <div className="lg:col-span-2 bg-[#171B26] border border-gray-800 rounded-3xl overflow-hidden shadow-md">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/5 text-xs text-gray-500 font-bold uppercase bg-[#1c2230]">
                <th className="p-4 pl-6">Category Icon</th>
                <th className="p-4">Category Name</th>
                <th className="p-4">Linked Products</th>
                <th className="p-4 pr-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {categories.map((cat) => (
                <tr key={cat.id} className="text-gray-300 hover:bg-[#1a1f2c] transition duration-150">
                  
                  {/* Icon Image */}
                  <td className="p-4 pl-6">
                    <div className="w-12 h-12 bg-[#0F1117] rounded-xl flex items-center justify-center p-2 border border-gray-850">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="h-full w-full object-contain filter brightness-95"
                      />
                    </div>
                  </td>

                  {/* Name */}
                  <td className="p-4 font-bold text-white">{cat.name}</td>

                  {/* Product items count */}
                  <td className="p-4 text-cyan-400 font-semibold">{cat.items} items</td>

                  {/* Actions (Delete only) */}
                  <td className="p-4 pr-6 text-right">
                    <button
                      onClick={() => handleDeleteCategory(cat.id)}
                      className="p-2.5 rounded-lg bg-red-500/5 border border-red-500/10 text-red-400 hover:bg-red-500 hover:text-black transition cursor-pointer"
                      title="Delete Category"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default Categories;
