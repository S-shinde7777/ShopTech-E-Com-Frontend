import React, { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Star, ShoppingCart, ArrowLeft, Heart, Check, Shield, Award, RotateCcw } from "lucide-react";
import { productService } from "../services/productService";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { isInWishlist, toggleWishlist } = useContext(WishlistContext);
  
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addedMessage, setAddedMessage] = useState(false);

  useEffect(() => {
    const data = productService.getProductById(id);
    setProduct(data);
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#0F1117] text-white flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold">Product Not Found</h2>
        <Link to="/home" className="mt-4 text-[#5FE3CF] hover:underline flex items-center gap-2">
          <ArrowLeft size={16} />
          <span>Back to shop</span>
        </Link>
      </div>
    );
  }

  const isFavorited = isInWishlist(product.id);
  const maxStock = product.stock !== undefined ? product.stock : 10;
  const isOutOfStock = maxStock <= 0;

  const handleIncrement = () => {
    if (quantity < maxStock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
    setAddedMessage(true);
    setTimeout(() => setAddedMessage(false), 2500);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen bg-[#0F1117] text-white px-6 md:px-12 py-10">
      
      {/* Breadcrumb back navigation */}
      <div className="max-w-6xl mx-auto mb-8">
        <Link to="/home" className="text-gray-400 hover:text-white flex items-center gap-2 font-medium transition duration-200">
          <ArrowLeft size={18} />
          <span>Back to Products</span>
        </Link>
      </div>

      <div className="max-w-6xl mx-auto bg-[#171B26] p-6 md:p-10 rounded-3xl border border-gray-800 shadow-xl">
        <div className="grid md:grid-cols-2 gap-10">
          
          {/* Left: Product Image Box */}
          <div className="flex justify-center items-center bg-[#0F1117] rounded-2xl p-6 relative overflow-hidden border border-gray-800/50">
            {isOutOfStock && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center backdrop-blur-xs rounded-2xl">
                <span className="bg-red-500 text-white font-extrabold text-sm px-4 py-2 rounded-full uppercase tracking-widest shadow-lg">
                  Out Of Stock
                </span>
              </div>
            )}
            <img
              src={product.image}
              alt={product.name}
              className="w-full max-w-md h-[400px] object-cover rounded-xl shadow-lg hover:scale-102 transition duration-300"
            />
          </div>

          {/* Right: Product Details Info */}
          <div className="flex flex-col justify-between">
            <div>
              {/* Category and Wishlist toggle header */}
              <div className="flex justify-between items-center mb-4">
                <span className="text-[#4ECDC4] text-xs font-bold uppercase tracking-wider bg-[#4ECDC4]/5 border border-[#4ECDC4]/20 px-3 py-1 rounded-full">
                  {product.category}
                </span>
                
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-2.5 rounded-full border transition duration-200 cursor-pointer ${
                    isFavorited
                      ? "bg-red-500/10 border-red-500/30 text-red-500"
                      : "bg-white/5 border-white/10 text-gray-400 hover:text-red-400 hover:border-red-400/30"
                  }`}
                  title={isFavorited ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <Heart size={20} fill={isFavorited ? "currentColor" : "none"} />
                </button>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-4">
                {product.name}
              </h1>

              {/* Ratings and Stock info */}
              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-1">
                  <Star size={16} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-sm font-semibold">{product.rating} Rating</span>
                </div>
                <div className="h-4 w-px bg-white/10"></div>
                <span className={`text-sm font-medium ${isOutOfStock ? "text-red-400" : "text-emerald-400"}`}>
                  {isOutOfStock ? "Unavailable" : `In Stock (Only ${maxStock} left)`}
                </span>
              </div>

              {/* Prices */}
              <div className="flex items-baseline gap-4 mb-6">
                <span className="text-4xl font-extrabold text-[#F5A623]">
                  ₹{product.price.toLocaleString("en-IN")}
                </span>
                {product.oldPrice && (
                  <span className="text-gray-500 text-lg line-through">
                    ₹{product.oldPrice.toLocaleString("en-IN")}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-400 leading-relaxed text-sm md:text-base mb-8">
                {product.description}
              </p>

              {/* Quantity Select Control */}
              {!isOutOfStock && (
                <div className="flex items-center gap-4 mb-8">
                  <span className="text-gray-400 font-medium text-sm">Select Quantity:</span>
                  <div className="flex items-center bg-[#0F1117] rounded-xl border border-gray-800 p-1">
                    <button
                      onClick={handleDecrement}
                      disabled={quantity <= 1}
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold hover:bg-white/5 transition select-none disabled:opacity-30 disabled:hover:bg-transparent"
                    >
                      -
                    </button>
                    <span className="w-12 text-center text-base font-bold">{quantity}</span>
                    <button
                      onClick={handleIncrement}
                      disabled={quantity >= maxStock}
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold hover:bg-white/5 transition select-none disabled:opacity-30 disabled:hover:bg-transparent"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Buying Action triggers */}
            <div>
              {addedMessage && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3.5 rounded-xl mb-4 flex items-center gap-2 animate-fadeIn text-sm">
                  <Check size={18} />
                  <span>Success! Added {quantity} item(s) to your cart.</span>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-bold transition select-none cursor-pointer ${
                    isOutOfStock
                      ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                      : "bg-[#F5A623] text-black hover:scale-102 hover:shadow-[0_0_20px_rgba(245,166,35,0.3)]"
                  }`}
                >
                  <ShoppingCart size={18} />
                  <span>Add To Cart</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  className={`flex-1 py-4 rounded-xl font-bold border transition select-none cursor-pointer ${
                    isOutOfStock
                      ? "border-gray-800 text-gray-600 cursor-not-allowed"
                      : "border-[#4ECDC4] text-[#4ECDC4] hover:bg-[#4ECDC4] hover:text-black hover:scale-102"
                  }`}
                >
                  Buy Now
                </button>
              </div>

              {/* Warranties Badges */}
              <div className="grid grid-cols-3 gap-4 mt-8 border-t border-white/5 pt-6 text-center text-[11px] text-gray-500">
                <div className="flex flex-col items-center gap-1.5">
                  <Shield size={16} className="text-[#5FE3CF]" />
                  <span>Secure Payments</span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <Award size={16} className="text-[#F5B544]" />
                  <span>1-Year Warranty</span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <RotateCcw size={16} className="text-cyan-300" />
                  <span>7-Day Return</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
