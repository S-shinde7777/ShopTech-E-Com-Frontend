import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Trash2, ArrowLeft, ShoppingBag } from "lucide-react";
import { CartContext } from "../context/CartContext";

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity } = useContext(CartContext);

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  
  const shipping = subtotal > 5000 ? 0 : 150; // Free shipping above ₹5000
  const gstTax = Math.round(subtotal * 0.18); // Mock 18% GST tax
  const totalAmount = subtotal + shipping + gstTax;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[80vh] bg-[#0F1117] text-white flex flex-col items-center justify-center px-6">
        <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="text-gray-400" size={36} />
        </div>
        <h1 className="text-3xl font-extrabold text-white">Your Cart is Empty</h1>
        <p className="text-gray-400 text-center max-w-sm mt-3 text-sm leading-relaxed">
          Looks like you haven't added any gear to your cart yet. Head back to the store to explore our premium products.
        </p>
        <Link to="/home" className="mt-8">
          <button className="px-8 py-3.5 rounded-xl bg-[#F5A623] text-black font-bold hover:scale-105 hover:shadow-[0_0_20px_rgba(245,166,35,0.4)] transition cursor-pointer">
            Explore Storefront
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
          Shopping Cart ({cartItems.reduce((acc, c) => acc + c.quantity, 0)} items)
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left Column: Cart Items List */}
          <div className="lg:col-span-2 space-y-5">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-[#171B26] p-5 rounded-2xl flex flex-col sm:flex-row items-center gap-5 border border-gray-800 shadow-md relative"
              >
                {/* Item Image */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-28 h-28 rounded-xl object-cover border border-gray-800"
                />

                {/* Info Text */}
                <div className="flex-grow text-center sm:text-left">
                  <span className="text-[#4ECDC4] text-[10px] font-bold uppercase tracking-wider">
                    {item.category}
                  </span>
                  <Link to={`/product/${item.id}`}>
                    <h2 className="text-lg font-bold text-white hover:text-[#F5A623] transition truncate mt-1">
                      {item.name}
                    </h2>
                  </Link>

                  <div className="flex items-center justify-center sm:justify-start gap-4 mt-3">
                    <span className="text-[#F5A623] font-bold text-lg">
                      ₹{item.price.toLocaleString("en-IN")}
                    </span>
                    {item.oldPrice && (
                      <span className="text-gray-500 line-through text-xs">
                        ₹{item.oldPrice.toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>
                </div>

                {/* Quantity Controls & Delete button */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 border-white/5 pt-4 sm:pt-0">
                  {/* Quantity adjusts */}
                  <div className="flex items-center bg-[#0F1117] rounded-xl border border-gray-800 p-0.5">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-base font-bold hover:bg-white/5 transition disabled:opacity-30"
                    >
                      -
                    </button>
                    <span className="w-10 text-center font-bold text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= (item.stock || 10)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-base font-bold hover:bg-white/5 transition disabled:opacity-30"
                    >
                      +
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-black transition cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Checkout Pricing Summary Box */}
          <div className="bg-[#171B26] rounded-3xl p-6 h-fit border border-gray-800 shadow-md space-y-6">
            <h2 className="text-xl font-bold border-b border-white/5 pb-4">
              Order Summary
            </h2>

            {/* Calculations items */}
            <div className="space-y-4 text-sm text-gray-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-white font-medium">₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated GST (18%)</span>
                <span className="text-white font-medium">₹{gstTax.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Charges</span>
                <span className="text-white font-medium">
                  {shipping === 0 ? (
                    <span className="text-emerald-400 font-semibold">FREE</span>
                  ) : (
                    `₹${shipping}`
                  )}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-[10px] text-cyan-300">
                  💡 Add ₹{(5000 - subtotal).toLocaleString("en-IN")} more to qualify for Free Shipping!
                </p>
              )}
            </div>

            {/* Subtotal Total Row */}
            <div className="border-t border-white/5 pt-4 flex justify-between text-base">
              <span className="font-bold text-white">Grand Total</span>
              <span className="text-[#F5A623] font-black text-2xl">
                ₹{totalAmount.toLocaleString("en-IN")}
              </span>
            </div>

            {/* Checkout Action Button */}
            <Link to="/checkout" className="block w-full pt-2">
              <button className="w-full bg-[#4ECDC4] text-black py-4 rounded-xl font-extrabold hover:scale-102 hover:shadow-[0_0_20px_rgba(78,205,196,0.3)] transition text-center cursor-pointer">
                Proceed To Checkout
              </button>
            </Link>

            {/* Info Note */}
            <div className="text-[10px] text-gray-500 text-center leading-relaxed">
              By proceeding, you agree to our Terms of Sale and Privacy policy. All custom taxes are included.
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Cart;