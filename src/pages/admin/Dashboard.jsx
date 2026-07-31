import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DollarSign, ShoppingCart, Archive, Users, ChevronRight, Eye } from "lucide-react";
import { productService } from "../../services/productService";
import { orderService } from "../../services/orderService";
import { authService } from "../../services/authService";

const Dashboard = () => {
  const [stats, setStats] = useState({
    sales: 0,
    ordersCount: 0,
    productsCount: 0,
    usersCount: 0
  });
  
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const orders = orderService.getAllOrders();
    const products = productService.getProducts();
    const users = authService.getUsers();

    // Sales: sum up totals of non-cancelled orders
    const salesTotal = orders
      .filter((o) => o.status !== "Cancelled")
      .reduce((sum, o) => sum + o.totalAmount, 0);

    setStats({
      sales: salesTotal,
      ordersCount: orders.length,
      productsCount: products.length,
      usersCount: users.length
    });

    setRecentOrders(orders.slice(0, 5));
  }, []);

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

  const statCards = [
    {
      name: "Total Revenue",
      value: `₹${stats.sales.toLocaleString("en-IN")}`,
      icon: <DollarSign size={24} className="text-[#F5A623]" />,
      desc: "Excluding cancelled orders",
      color: "border-[#F5A623]/20"
    },
    {
      name: "Purchase Orders",
      value: stats.ordersCount,
      icon: <ShoppingCart size={24} className="text-[#5FE3CF]" />,
      desc: "Total storefront checkouts",
      color: "border-[#5FE3CF]/20"
    },
    {
      name: "Total Products",
      value: stats.productsCount,
      icon: <Archive size={24} className="text-[#4ECDC4]" />,
      desc: "Active items in stock catalog",
      color: "border-[#4ECDC4]/20"
    },
    {
      name: "Total Customers",
      value: stats.usersCount,
      icon: <Users size={24} className="text-purple-400" />,
      desc: "Registered user profiles",
      color: "border-purple-400/20"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-white">Dashboard Overview</h1>
        <p className="text-gray-400 text-sm mt-1">
          Store analytics and checkout metrics at a glance.
        </p>
      </div>

      {/* Stats cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <div
            key={card.name}
            className={`bg-[#171B26] p-6 rounded-2xl border ${card.color} shadow-md flex flex-col justify-between`}
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-gray-400 text-xs font-semibold uppercase">{card.name}</span>
                <h3 className="text-2xl font-black text-white mt-2">{card.value}</h3>
              </div>
              <div className="p-3 bg-white/5 border border-white/5 rounded-xl">
                {card.icon}
              </div>
            </div>
            <p className="text-[10px] text-gray-500 mt-4 leading-none">{card.desc}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders Panel */}
      <div className="bg-[#171B26] border border-gray-800 rounded-3xl p-6 shadow-md">
        <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
          <div>
            <h2 className="text-xl font-bold text-white">Recent Transactions</h2>
            <p className="text-xs text-gray-500 mt-0.5">Showing last 5 completed purchases</p>
          </div>
          <Link
            to="/admin/orders"
            className="text-[#5FE3CF] hover:text-white text-xs font-bold flex items-center gap-1 transition"
          >
            <span>Manage Orders</span>
            <ChevronRight size={14} />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="text-center py-10 text-gray-500 text-sm">
            No storefront transactions recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/5 text-xs text-gray-500 font-bold uppercase">
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">Customer Email</th>
                  <th className="pb-3">Placement Date</th>
                  <th className="pb-3">Grand Total</th>
                  <th className="pb-3">Order Status</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="text-gray-300">
                    <td className="py-4 font-bold text-[#5FE3CF]">#{order.id}</td>
                    <td className="py-4 font-medium max-w-[150px] truncate">{order.userEmail}</td>
                    <td className="py-4">
                      {new Date(order.date).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                      })}
                    </td>
                    <td className="py-4 text-[#F5A623] font-bold">
                      ₹{order.totalAmount.toLocaleString("en-IN")}
                    </td>
                    <td className="py-4">
                      <span className={`inline-block text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${getStatusBadge(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <Link to="/admin/orders">
                        <button className="p-2.5 rounded-lg bg-white/5 border border-white/5 text-gray-400 hover:text-[#5FE3CF] hover:border-[#5FE3CF]/20 transition cursor-pointer">
                          <Eye size={14} />
                        </button>
                      </Link>
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

export default Dashboard;
