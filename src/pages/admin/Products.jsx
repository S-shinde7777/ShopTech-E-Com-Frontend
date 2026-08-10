import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Edit, Trash2, Plus, Search, AlertCircle } from "lucide-react";
import { productService } from "../../services/productService";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await productService.getProducts();
      setProducts(data || []);
    } catch (err) {
      console.error("Failed to load products", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const success = await productService.deleteProduct(id);
      if (success) {
        loadProducts();
        setDeleteConfirm(null);
      }
    } catch (err) {
      console.error("Failed to delete product", err);
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Catalog Products</h1>
          <p className="text-gray-400 text-sm mt-1">
            Create, edit or delete items in the storefront inventory.
          </p>
        </div>
        
        <Link to="/admin/product/new">
          <button className="px-5 py-3 rounded-xl bg-[#F5A623] text-black font-extrabold text-sm hover:scale-105 hover:shadow-[0_0_20px_rgba(245,166,35,0.3)] transition flex items-center gap-2 cursor-pointer">
            <Plus size={16} />
            <span>Add New Product</span>
          </button>
        </Link>
      </div>

      {/* Confirmation Modal overlay (custom) */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-[#171B26] max-w-sm w-full rounded-2xl border border-red-500/30 p-6 space-y-6 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400">
              <AlertCircle size={28} />
              <h3 className="text-lg font-bold">Confirm Deletion</h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Are you sure you want to delete <strong>{deleteConfirm.name}</strong>? This action will adjust category product counts and cannot be undone.
            </p>
            <div className="flex gap-4 pt-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-800 text-gray-400 hover:text-white transition font-bold text-sm cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm.id)}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-black hover:bg-red-600 transition font-bold text-sm cursor-pointer"
              >
                Delete Item
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex items-center gap-3 bg-[#171B26] p-3 rounded-2xl border border-gray-800 shadow-md max-w-md">
        <Search className="text-gray-500 ml-2" size={18} />
        <input
          type="text"
          placeholder="Filter products table..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-transparent text-white outline-none w-full text-sm placeholder-gray-500"
        />
      </div>

      {/* Catalog Table */}
      <div className="bg-[#171B26] border border-gray-800 rounded-3xl overflow-hidden shadow-md">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 text-gray-500 text-sm">
            No products found matching your filter description.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/5 text-xs text-gray-500 font-bold uppercase bg-[#1c2230]">
                  <th className="p-4 pl-6">Product Item</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Old Price</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="text-gray-300 hover:bg-[#1a1f2c] transition duration-150">
                    
                    {/* Item Info (Image + Name) */}
                    <td className="p-4 pl-6 flex items-center gap-4 min-w-[200px]">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover border border-gray-800"
                      />
                      <span className="font-bold text-white truncate max-w-[150px]">{product.name}</span>
                    </td>

                    {/* Category */}
                    <td className="p-4">
                      <span className="text-cyan-400 text-xs font-semibold bg-cyan-500/5 px-2.5 py-1 rounded-full border border-cyan-500/10">
                        {product.category}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="p-4 font-bold text-[#F5A623]">₹{product.price.toLocaleString("en-IN")}</td>

                    {/* Old Price */}
                    <td className="p-4 text-gray-500 line-through">
                      {product.oldPrice ? `₹${product.oldPrice.toLocaleString("en-IN")}` : "—"}
                    </td>

                    {/* Stock status */}
                    <td className="p-4">
                      <span className={`font-semibold text-xs ${
                        (product.stock || 10) <= 0 
                          ? "text-red-400" 
                          : (product.stock || 10) < 5 
                          ? "text-amber-400" 
                          : "text-emerald-400"
                      }`}>
                        {product.stock !== undefined ? product.stock : 10} units
                      </span>
                    </td>

                    {/* Rating */}
                    <td className="p-4 text-xs font-bold text-amber-400">⭐ {product.rating}</td>

                    {/* Action controls */}
                    <td className="p-4 pr-6 text-right space-x-2">
                      <Link to={`/admin/product/edit/${product.id}`}>
                        <button className="p-2 rounded-lg bg-white/5 border border-white/5 text-gray-400 hover:text-[#5FE3CF] hover:border-[#5FE3CF]/20 transition cursor-pointer" title="Edit Product">
                          <Edit size={14} />
                        </button>
                      </Link>

                      <button
                        onClick={() => setDeleteConfirm(product)}
                        className="p-2 rounded-lg bg-red-500/5 border border-red-500/10 text-red-400 hover:bg-red-500 hover:text-black transition cursor-pointer"
                        title="Delete Product"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default Products;
