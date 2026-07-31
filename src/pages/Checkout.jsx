import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingBag, CheckCircle, CreditCard, Landmark, Truck } from "lucide-react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { orderService } from "../services/orderService";

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  // Form states
  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    paymentMethod: "card"
  });

  const [error, setError] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  
  const shipping = subtotal > 5000 ? 0 : 150;
  const gstTax = Math.round(subtotal * 0.18);
  const totalAmount = subtotal + shipping + gstTax;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    setError("");

    // Form validations
    if (!formData.fullName.trim()) return setError("Full Name is required");
    if (!formData.phone.trim() || formData.phone.length < 10) return setError("Please enter a valid phone number");
    if (!formData.address.trim()) return setError("Shipping Address is required");
    if (!formData.city.trim()) return setError("City is required");
    if (!formData.zipCode.trim() || formData.zipCode.length < 5) return setError("Please enter a valid zip code");

    setLoading(true);

    // Simulate short network delay
    setTimeout(() => {
      try {
        const orderData = {
          userId: user?.id || 999,
          userEmail: user?.email || "guest@shoptech.com",
          shippingDetails: {
            fullName: formData.fullName,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            zipCode: formData.zipCode
          },
          items: cartItems.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
            category: item.category
          })),
          paymentMethod: formData.paymentMethod,
          totalAmount: totalAmount
        };

        const createdOrder = orderService.createOrder(orderData);
        setOrderSuccess(createdOrder);
        clearCart(); // Empty the cart upon successful order
      } catch (err) {
        setError("Failed to process order. Please try again.");
      } finally {
        setLoading(false);
      }
    }, 1500);
  };

  // If order was successfully placed, display receipt details
  if (orderSuccess) {
    return (
      <div className="min-h-[85vh] bg-[#0F1117] text-white flex items-center justify-center px-6 py-12">
        <div className="max-w-2xl w-full bg-[#171B26] border border-[#5FE3CF]/20 rounded-3xl p-8 md:p-10 shadow-2xl text-center space-y-6 relative overflow-hidden">
          
          {/* Subtle gradient border line */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#5FE3CF] to-[#F5A623]"></div>

          <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-400">
            <CheckCircle size={44} />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold text-white">Order Confirmed!</h1>
            <p className="text-gray-400 text-sm">
              Thank you for shopping with us. Your transaction was processed successfully.
            </p>
          </div>

          {/* Receipt card info */}
          <div className="bg-[#0F1117] border border-gray-800 rounded-2xl p-6 text-left space-y-4">
            <div className="flex justify-between border-b border-white/5 pb-3">
              <span className="text-gray-500 text-xs">Order ID</span>
              <span className="text-[#5FE3CF] font-bold text-sm">#{orderSuccess.id}</span>
            </div>
            
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Shipping To</span>
              <span className="text-white font-medium">{orderSuccess.shippingDetails.fullName}</span>
            </div>

            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Address</span>
              <span className="text-white font-medium max-w-[250px] text-right truncate">
                {orderSuccess.shippingDetails.address}, {orderSuccess.shippingDetails.city}
              </span>
            </div>

            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Payment Option</span>
              <span className="text-white font-medium uppercase">{orderSuccess.paymentMethod}</span>
            </div>

            <div className="flex justify-between border-t border-white/5 pt-3 text-sm">
              <span className="text-gray-400 font-bold">Total Paid</span>
              <span className="text-[#F5A623] font-black">₹{orderSuccess.totalAmount.toLocaleString("en-IN")}</span>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-4">
            <Link to="/orders" className="flex-1">
              <button className="w-full py-3.5 rounded-xl border border-[#5FE3CF] text-[#5FE3CF] hover:bg-[#5FE3CF] hover:text-black transition font-bold text-sm cursor-pointer">
                Track My Order
              </button>
            </Link>
            
            <Link to="/home" className="flex-1">
              <button className="w-full py-3.5 rounded-xl bg-[#F5A623] text-black hover:scale-102 transition font-bold text-sm cursor-pointer">
                Continue Shopping
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // If user navigated directly but cart is empty
  if (cartItems.length === 0) {
    return (
      <div className="min-h-[80vh] bg-[#0F1117] text-white flex flex-col items-center justify-center px-6">
        <h2 className="text-2xl font-bold">Checkout is Unavailable</h2>
        <p className="text-gray-400 mt-2 text-sm">Your cart must contain items to check out.</p>
        <Link to="/home" className="mt-6 text-[#5FE3CF] hover:underline flex items-center gap-2">
          <ArrowLeft size={16} />
          <span>Back to Products</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F1117] text-white px-6 md:px-12 py-10">
      <div className="max-w-6xl mx-auto">
        
        {/* Navigation back link */}
        <div className="mb-8">
          <Link to="/cart" className="text-gray-400 hover:text-white flex items-center gap-2 font-medium transition duration-200">
            <ArrowLeft size={18} />
            <span>Back to Shopping Cart</span>
          </Link>
        </div>

        <h1 className="text-3xl font-extrabold mb-8 text-white border-b border-white/5 pb-4">
          Order Checkout
        </h1>

        <div className="grid lg:grid-cols-3 gap-10">
          
          {/* Left Panel: Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handlePlaceOrder} className="bg-[#171B26] rounded-3xl p-6 md:p-8 border border-gray-800 shadow-md space-y-6">
              
              <h2 className="text-lg font-bold text-[#5FE3CF] uppercase tracking-wider border-b border-white/5 pb-3">
                1. Shipping Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Full name */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full bg-[#0F1117] border border-gray-800 rounded-xl px-4 py-3 text-white outline-none focus:border-[#F5A623] text-sm"
                  />
                </div>

                {/* Phone number */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="10-digit mobile number"
                    className="w-full bg-[#0F1117] border border-gray-800 rounded-xl px-4 py-3 text-white outline-none focus:border-[#F5A623] text-sm"
                  />
                </div>

                {/* Shipping address */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Street Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Apartment, building, street address"
                    className="w-full bg-[#0F1117] border border-gray-800 rounded-xl px-4 py-3 text-white outline-none focus:border-[#F5A623] text-sm"
                  />
                </div>

                {/* City */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City name"
                    className="w-full bg-[#0F1117] border border-gray-800 rounded-xl px-4 py-3 text-white outline-none focus:border-[#F5A623] text-sm"
                  />
                </div>

                {/* Zip */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Zip / Postal Code</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    placeholder="PIN Code"
                    className="w-full bg-[#0F1117] border border-gray-800 rounded-xl px-4 py-3 text-white outline-none focus:border-[#F5A623] text-sm"
                  />
                </div>
              </div>

              <h2 className="text-lg font-bold text-[#5FE3CF] uppercase tracking-wider border-b border-white/5 pt-4 pb-3">
                2. Select Payment Option
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Credit card */}
                <label className={`flex flex-col items-center justify-center p-4 rounded-xl border cursor-pointer transition select-none ${
                  formData.paymentMethod === "card"
                    ? "bg-[#F5A623]/10 border-[#F5A623] text-[#F5A623]"
                    : "bg-[#0F1117] border-gray-800 text-gray-400 hover:border-gray-700"
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === "card"}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <CreditCard className="mb-2" size={24} />
                  <span className="text-xs font-bold uppercase">Card Payment</span>
                </label>

                {/* UPI */}
                <label className={`flex flex-col items-center justify-center p-4 rounded-xl border cursor-pointer transition select-none ${
                  formData.paymentMethod === "upi"
                    ? "bg-[#F5A623]/10 border-[#F5A623] text-[#F5A623]"
                    : "bg-[#0F1117] border-gray-800 text-gray-400 hover:border-gray-700"
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="upi"
                    checked={formData.paymentMethod === "upi"}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <Landmark className="mb-2" size={24} />
                  <span className="text-xs font-bold uppercase">UPI Transfer</span>
                </label>

                {/* Cash on Delivery */}
                <label className={`flex flex-col items-center justify-center p-4 rounded-xl border cursor-pointer transition select-none ${
                  formData.paymentMethod === "cod"
                    ? "bg-[#F5A623]/10 border-[#F5A623] text-[#F5A623]"
                    : "bg-[#0F1117] border-gray-800 text-gray-400 hover:border-gray-700"
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === "cod"}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <Truck className="mb-2" size={24} />
                  <span className="text-xs font-bold uppercase">Pay on Delivery</span>
                </label>
              </div>

              {/* Action Trigger */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#F5A623] text-black font-extrabold py-4 rounded-xl hover:scale-102 hover:shadow-[0_0_20px_rgba(245,166,35,0.4)] transition text-base flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                      <span>Verifying Checkout...</span>
                    </>
                  ) : (
                    <span>Confirm & Place Order</span>
                  )}
                </button>
              </div>

            </form>
          </div>

          {/* Right Panel: Order items summary review */}
          <div className="bg-[#171B26] border border-gray-800 rounded-3xl p-6 h-fit shadow-md space-y-6">
            <h2 className="text-lg font-bold border-b border-white/5 pb-4">
              Review Items
            </h2>

            {/* Cart Items List */}
            <div className="divide-y divide-white/5 max-h-[300px] overflow-y-auto pr-1 space-y-3">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 pt-3 first:pt-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded-lg object-cover border border-gray-800 flex-shrink-0"
                  />
                  <div className="flex-grow min-w-0">
                    <h4 className="text-sm font-bold text-white truncate">{item.name}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Qty: {item.quantity} × ₹{item.price}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-gray-300">
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>

            {/* Total Math summary breakdown */}
            <div className="border-t border-white/5 pt-4 space-y-3 text-xs text-gray-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-white">₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated GST (18%)</span>
                <span className="text-white">₹{gstTax.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Charges</span>
                <span className="text-white">
                  {shipping === 0 ? "FREE" : `₹${shipping}`}
                </span>
              </div>
              <div className="flex justify-between border-t border-white/5 pt-3 text-sm font-bold">
                <span className="text-white">Grand Total</span>
                <span className="text-[#F5A623]">₹{totalAmount.toLocaleString("en-IN")}</span>
              </div>
            </div>

            {/* Shield and Guarantee Info */}
            <div className="bg-[#0F1117] border border-gray-800/80 p-4 rounded-xl text-[10px] text-gray-500 leading-relaxed text-center">
              🔒 Your connection is fully encrypted. We never store credit card numbers on our servers.
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;
