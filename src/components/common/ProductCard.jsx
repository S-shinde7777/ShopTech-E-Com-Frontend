import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { CartContext } from "../../context/CartContext";
import { WishlistContext } from "../../context/WishlistContext";

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const { isInWishlist, toggleWishlist } = useContext(WishlistContext);

  const favorited = isInWishlist(product.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div className="group relative bg-[#171B26] rounded-2xl overflow-hidden border border-gray-800 hover:border-[#F5A623] hover:-translate-y-2 transition duration-300 flex flex-col h-full shadow-lg">
      
      {/* Wishlist Button Overlay */}
      <button
        onClick={handleToggleWishlist}
        className={`absolute top-4 right-4 z-10 p-2.5 rounded-full border backdrop-blur-md transition duration-200 cursor-pointer ${
          favorited
            ? "bg-red-500/10 border-red-500/30 text-red-500"
            : "bg-black/40 border-white/10 text-gray-400 hover:text-red-400 hover:border-red-400/30"
        }`}
      >
        <Heart size={18} fill={favorited ? "currentColor" : "none"} />
      </button>

      {/* Product Image Link */}
      <Link to={`/product/${product.id}`} className="block flex-shrink-0">
        <div className="h-56 bg-[#0F1117] flex justify-center items-center p-4 relative overflow-hidden">
          {product.stock <= 0 && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-10">
              <span className="bg-red-500/90 text-white font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                Out Of Stock
              </span>
            </div>
          )}
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover rounded-xl group-hover:scale-105 transition duration-500"
          />
        </div>
      </Link>

      {/* Card Info Content */}
      <div className="p-5 flex flex-col flex-grow">
        <p className="text-[#4ECDC4] text-xs font-semibold uppercase tracking-wider mb-1.5">
          {product.category}
        </p>

        <Link to={`/product/${product.id}`}>
          <h3 className="text-lg font-bold text-white group-hover:text-[#F5A623] transition truncate mb-2">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-4">
          <Star size={14} className="text-amber-400 fill-amber-400" />
          <span className="text-xs text-gray-300 font-medium">{product.rating}</span>
          <span className="text-[10px] text-gray-500">/ 5.0</span>
        </div>

        {/* Price & Buy controls */}
        <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[#F5A623] text-xl font-bold">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            {product.oldPrice && (
              <span className="text-gray-500 text-xs line-through">
                ₹{product.oldPrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-sm transition select-none cursor-pointer ${
              product.stock <= 0
                ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                : "bg-[#F5A623] text-black hover:scale-105 hover:shadow-[0_0_15px_rgba(245,166,35,0.4)]"
            }`}
          >
            <ShoppingCart size={16} />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
