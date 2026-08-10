import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ShoppingBag, Truck, Calendar, CreditCard, ChevronRight } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { orderService } from "../services/orderService";

const Orders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (user) {
        try {
          const data = await orderService.getUserOrders(user.id);
          setOrders(data || []);
        } catch (err) {
          console.error("Failed to load user orders", err);
        }
      }
    };
    fetchOrders();
  }, [user]);

  // Helper for status badge styling
  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-amber-500/10 border-amber-500/30 text-amber-400";
      case "processing":
        return "bg-cyan-500/10 border-cyan-500/30 text-cyan-300";
      case "shipped":
        return "bg-blue-500/10 border-blue-500/30 text-blue-400";
      case "delivered":
        return "bg-emerald-500/10 border-emerald-500/30 text-emerald-400";
      case "cancelled":
        return "bg-red-500/10 border-red-500/30 text-red-400";
      default:
        return "bg-gray-500/10 border-gray-500/30 text-gray-400";
    }
  };

  const formatDate = (isoString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(isoString).toLocaleDateString(undefined, options);
  };

  if (orders.length === 0) {
    return (
      <div className="min-h-[80vh] bg-[#0F1117] text-white flex flex-col items-center justify-center px-6">
        <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mb-6">
          <Truck className="text-gray-500" size={36} />
        </div>
        <h1 className="text-3xl font-extrabold text-white">No Orders Found</h1>
        <p className="text-gray-400 text-center max-w-sm mt-3 text-sm leading-relaxed">
          You haven't placed any purchases yet. Your order history will show up here as soon as you complete checkout.
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
      <div className="max-w-5xl mx-auto">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <Link to="/home" className="text-gray-400 hover:text-white flex items-center gap-2 font-medium transition duration-200">
            <ArrowLeft size={18} />
            <span>Back to Shopping</span>
          </Link>
        </div>

        <h1 className="text-3xl md:text-4xl font-extrabold mb-8 text-white border-b border-white/5 pb-4">
          My Order History
        </h1>

        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-[#171B26] border border-gray-800 rounded-3xl overflow-hidden shadow-lg"
            >
              {/* Order Header Summary Bar */}
              <div className="bg-[#1c2230] p-6 border-b border-gray-800 flex flex-wrap justify-between items-center gap-4 text-sm">
                <div className="flex items-center gap-6">
                  <div>
                    <span className="text-gray-500 text-xs uppercase block">Order Placed</span>
                    <span className="text-white font-medium flex items-center gap-1.5 mt-1">
                      <Calendar size={14} className="text-cyan-300" />
                      {formatDate(order.date || order.createdAt)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs uppercase block">Total Amount</span>
                    <span className="text-[#F5A623] font-bold mt-1 block">
                      ₹{order.totalAmount.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs uppercase block">Order Status</span>
                    <span className={`inline-block text-[11px] font-extrabold uppercase px-2.5 py-1 rounded-full border mt-1.5 ${getStatusBadgeClass(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-gray-400 text-xs block text-left md:text-right">Order ID</span>
                  <span className="text-white font-bold text-base mt-1 block">#{order.id}</span>
                </div>
              </div>

              {/* Order Items List */}
              <div className="p-6 divide-y divide-white/5 space-y-4">
                {order.items.map((item, idx) => (
                  <div key={`${order.id}-${item.id}-${idx}`} className="flex gap-4 pt-4 first:pt-0 items-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-xl object-cover border border-gray-850"
                    />
                    <div className="flex-grow min-w-0">
                      <span className="text-[#4ECDC4] text-[10px] font-bold uppercase tracking-wider block">
                        {item.category}
                      </span>
                      <h3 className="text-sm font-bold text-white truncate mt-0.5">
                        {item.name}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        Quantity: <span className="text-gray-300 font-semibold">{item.quantity}</span> × ₹{item.price}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-white whitespace-nowrap">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>

              {/* Order Footer / Shipping Details */}
              <div className="bg-[#141822] p-5 border-t border-gray-850 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs text-gray-400">
                <div className="flex items-start gap-2">
                  <Truck size={16} className="text-cyan-300 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-bold text-white block mb-0.5">Delivery Address:</span>
                    <span>
                      {order.shippingDetails.fullName} — {order.shippingDetails.address}, {order.shippingDetails.city}, PIN {order.shippingDetails.zipCode} (Phone: {order.shippingDetails.phone})
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={14} className="text-[#F5B544]" />
                  <span>Payment option: <strong className="text-white uppercase">{order.paymentMethod}</strong></span>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;
