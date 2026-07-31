import React, { useEffect, useState } from "react";
import { ClipboardList, Calendar, MapPin, Eye, CheckCircle2 } from "lucide-react";
import { orderService } from "../../services/orderService";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    setOrders(orderService.getAllOrders());
  };

  const handleStatusChange = (orderId, newStatus) => {
    orderService.updateOrderStatus(orderId, newStatus);
    loadOrders(); // reload data
    
    // Update the expanded modal details if open
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({
        ...selectedOrder,
        status: newStatus
      });
    }

    setSuccessMsg(`Order #${orderId} status updated to ${newStatus}`);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
      case "processing":
        return "bg-cyan-500/10 text-cyan-300 border border-cyan-500/20";
      case "shipped":
        return "bg-blue-500/10 text-blue-400 border border-blue-500/20";
      case "delivered":
        return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
      case "cancelled":
        return "bg-red-500/10 text-red-400 border border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-400 border border-gray-500/20";
    }
  };

  const statusOptions = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

  return (
    <div className="space-y-8">
      {/* Title Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white">Orders Control</h1>
        <p className="text-gray-400 text-sm mt-1">
          Review checkout logs and update shipping/processing statuses.
        </p>
      </div>

      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl text-xs flex items-center gap-2 max-w-2xl animate-fadeIn">
          <CheckCircle2 size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Grid Layout: Main list (Left) + Detail Modal view (Right) if selected */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        
        {/* Orders Table list */}
        <div className={`xl:col-span-2 bg-[#171B26] border border-gray-800 rounded-3xl overflow-hidden shadow-md`}>
          {orders.length === 0 ? (
            <div className="text-center py-16 text-gray-500 text-sm">
              No orders have been placed in the store yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/5 text-xs text-gray-500 font-bold uppercase bg-[#1c2230]">
                    <th className="p-4 pl-6">ID</th>
                    <th className="p-4">Customer Email</th>
                    <th className="p-4">Grand Total</th>
                    <th className="p-4">Change Status</th>
                    <th className="p-4 pr-6 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {orders.map((order) => (
                    <tr key={order.id} className="text-gray-300 hover:bg-[#1a1f2c] transition duration-150">
                      
                      {/* ID */}
                      <td className="p-4 pl-6 font-bold text-[#5FE3CF]">#{order.id}</td>
                      
                      {/* Customer */}
                      <td className="p-4 truncate max-w-[150px]" title={order.userEmail}>
                        {order.userEmail}
                      </td>

                      {/* Total */}
                      <td className="p-4 font-bold text-[#F5A623]">
                        ₹{order.totalAmount.toLocaleString("en-IN")}
                      </td>

                      {/* Dropdown status update */}
                      <td className="p-4">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className={`
                            text-xs font-bold uppercase px-2.5 py-1.5 rounded-lg border outline-none cursor-pointer bg-[#0F1117]
                            ${getStatusBadge(order.status)}
                          `}
                        >
                          {statusOptions.map((status) => (
                            <option key={status} value={status} className="bg-[#0F1117] text-white uppercase text-xs">
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* View detail trigger button */}
                      <td className="p-4 pr-6 text-right">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className={`
                            p-2.5 rounded-lg border transition cursor-pointer
                            ${
                              selectedOrder?.id === order.id
                                ? "bg-[#5FE3CF] border-[#5FE3CF] text-black"
                                : "bg-white/5 border-white/5 text-gray-400 hover:text-white"
                            }
                          `}
                          title="View order summary details"
                        >
                          <Eye size={14} />
                        </button>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Selected Order Detailed Sidebar Frame (Right) */}
        {selectedOrder && (
          <div className="bg-[#171B26] border border-gray-800 rounded-3xl p-6 shadow-lg space-y-6 animate-fadeIn relative">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 text-xs text-gray-500 hover:text-white"
            >
              Close Details ×
            </button>

            <div className="space-y-1">
              <h2 className="text-lg font-bold text-white">Order Summary Details</h2>
              <p className="text-xs text-gray-500">Order Ref ID: #{selectedOrder.id}</p>
            </div>

            {/* Timelines and info */}
            <div className="space-y-4 text-xs text-gray-400 bg-[#0F1117] border border-gray-850 p-4 rounded-xl">
              <div className="flex justify-between">
                <span className="flex items-center gap-1"><Calendar size={14} /> Created At</span>
                <span className="text-white font-medium">
                  {new Date(selectedOrder.date).toLocaleString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Payment method</span>
                <span className="text-white font-bold uppercase">{selectedOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span>Current Status</span>
                <span className={`inline-block text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${getStatusBadge(selectedOrder.status)}`}>
                  {selectedOrder.status}
                </span>
              </div>
            </div>

            {/* Shipping address cards */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-[#5FE3CF] uppercase tracking-wider flex items-center gap-1">
                <MapPin size={14} />
                <span>Shipping Details</span>
              </h3>
              <div className="text-xs bg-[#0F1117] border border-gray-850 p-4 rounded-xl space-y-2 text-gray-400">
                <p><strong className="text-white">Customer Name:</strong> {selectedOrder.shippingDetails.fullName}</p>
                <p><strong className="text-white">Phone Contact:</strong> {selectedOrder.shippingDetails.phone}</p>
                <p>
                  <strong className="text-white">Deliver To:</strong> {selectedOrder.shippingDetails.address}, {selectedOrder.shippingDetails.city}, PIN {selectedOrder.shippingDetails.zipCode}
                </p>
              </div>
            </div>

            {/* List items */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-[#5FE3CF] uppercase tracking-wider flex items-center gap-1.5">
                <ClipboardList size={14} />
                <span>Cart Items Review</span>
              </h3>
              <div className="divide-y divide-white/5 max-h-[220px] overflow-y-auto pr-1">
                {selectedOrder.items.map((item, index) => (
                  <div key={`${selectedOrder.id}-item-${item.id}-${index}`} className="flex gap-3 py-3.5 first:pt-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-10 h-10 rounded-lg object-cover border border-gray-850 flex-shrink-0"
                    />
                    <div className="min-w-0 flex-grow">
                      <h4 className="text-xs font-bold text-white truncate">{item.name}</h4>
                      <p className="text-[10px] text-gray-500 mt-0.5">
                        Qty: {item.quantity} × ₹{item.price}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-white whitespace-nowrap">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Paid bottom line */}
            <div className="border-t border-white/5 pt-4 flex justify-between items-baseline text-sm">
              <span className="font-bold text-gray-400">Grand Total</span>
              <span className="text-[#F5A623] font-black text-xl">
                ₹{selectedOrder.totalAmount.toLocaleString("en-IN")}
              </span>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default Orders;
