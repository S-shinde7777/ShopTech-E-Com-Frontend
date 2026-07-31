import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Heart, Trash2, ShoppingCart, ArrowLeft, Star } from "lucide-react";
import { WishlistContext } from "../context/WishlistContext";
import { CartContext } from "../context/CartContext";

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = (product) => {
    addToCart(product);
    // Optional: remove from wishlist once added to cart (or keep)
    // removeFromWishlist(product.id);
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-[80vh] bg-[#0F1117] text-white flex flex-col items-center justify-center px-6">
        <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mb-6">
          <Heart className="text-gray-500" size={36} />
        </div>
        <h1 className="text-3xl font-extrabold text-white">Your Wishlist is Empty</h1>
        <p className="text-gray-400 text-center max-w-sm mt-3 text-sm leading-relaxed">
          You haven't saved any items yet. Bookmark products you love by clicking the heart icon while browsing.
        </p>
        <Link to="/home" className="mt-8">
          <button className="px-8 py-3.5 rounded-xl bg-[#F5A623] text-black font-bold hover:scale-105 hover:shadow-[0_0_20px_rgba(245,166,35,0.4)] transition cursor-pointer">
            Explore Gear
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F1117] text-white px-6 md:px-12 py-10">
      <div className="max-w-6xl mx-auto">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <Link to="/home" className="text-gray-400 hover:text-white flex items-center gap-2 font-medium transition duration-200">
            <ArrowLeft size={18} />
            <span>Continue Shopping</span>
          </Link>
        </div>

        <h1 className="text-3xl md:text-4xl font-extrabold mb-8 text-white border-b border-white/5 pb-4">
          My Saved Wishlist ({wishlistItems.length} items)
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {wishlistItems.map((product) => (
            <div
              key={product.id}
              className="bg-[#171B26] rounded-2xl border border-gray-800 overflow-hidden hover:border-[#F5A623] hover:-translate-y-1 transition duration-300 flex flex-col justify-between shadow-lg"
            >
              
              {/* Image & rating badge overlays */}
              <div className="h-56 bg-[#0F1117] flex justify-center items-center p-4 relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover rounded-xl"
                />
                
                {/* Out of Stock Overlay */}
                {product.stock <= 0 && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center">
                    <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>

              {/* Text Info */}
              <div className="p-5 flex-grow">
                <p className="text-[#4ECDC4] text-xs font-semibold uppercase mb-1">{product.category}</p>
                <Link to={`/product/${product.id}`}>
                  <h3 className="text-lg font-bold text-white hover:text-[#F5A623] transition truncate">
                    {product.name}
                  </h3>
                </Link>

                <div className="flex items-center gap-1 mt-2 mb-4">
                  <Star size={14} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-xs text-gray-300">{product.rating} Rating</span>
                </div>

                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-xl font-bold text-white">₹{product.price.toLocaleString("en-IN")}</span>
                  {product.oldPrice && (
                    <span className="text-gray-500 text-xs line-through">₹{product.oldPrice.toLocaleString("en-IN")}</span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-5 pt-0 border-t border-white/5 flex items-center gap-3">
                
                {/* Add to Cart */}
                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock <= 0}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition cursor-pointer select-none ${
                    product.stock <= 0
                      ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                      : "bg-[#F5A623] text-black hover:scale-102 hover:shadow-[0_0_10px_rgba(245,166,35,0.3)]"
                  }`}
                >
                  <ShoppingCart size={16} />
                  <span>Add To Cart</span>
                </button>

                {/* Remove from Wishlist */}
                <button
                  onClick={() => removeFromWishlist(product.id)}
                  className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-black transition cursor-pointer"
                  title="Remove from saved items"
                >
                  <Trash2 size={16} />
                </button>

              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;