import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Code2, LogOut, User, LayoutDashboard, ShoppingCart, Heart } from "lucide-react";
import { CartContext } from "../../context/CartContext";
import { WishlistContext } from "../../context/WishlistContext";
import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {
  const { cartItems } = useContext(CartContext);
  const { wishlistItems } = useContext(WishlistContext);
  const { user, isAuthenticated, isAdmin, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const wishlistCount = wishlistItems.length;

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate("/");
  };

  const navLinks = [
    { name: "Home", path: "/home" },
    { name: "About", path: "/#about" },
    { name: "FAQ", path: "/#faq" },
  ];

  return (
    <nav className="w-full border-b border-white/10 bg-[#0B0D11]/95 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 cursor-pointer">
          <div className="border-2 border-[#5FE3CF] rounded-xl p-2 bg-white/5">
            <Code2 size={22} className="text-[#F5B544]" />
          </div>
          <h1 className="text-2xl font-bold">
            <span className="text-[#F5B544]">Shop</span>
            <span className="text-[#5FE3CF]">Tech</span>
          </h1>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex gap-8 text-gray-300 items-center font-medium">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link to={link.path} className="hover:text-[#5FE3CF] transition duration-200">
                  {link.name}
                </Link>
              </li>
            ))}
            
            {/* Show Admin Link if Admin */}
            {isAuthenticated && isAdmin && (
              <li>
                <Link
                  to="/admin/dashboard"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#F5B544]/30 text-[#F5B544] bg-[#F5B544]/5 hover:bg-[#F5B544]/10 transition duration-200"
                >
                  <LayoutDashboard size={16} />
                  Admin Panel
                </Link>
              </li>
            )}
          </ul>

          <div className="h-6 w-px bg-white/10"></div>

          {/* Action Icons & Auth */}
          <div className="flex items-center gap-6">
            {/* Wishlist */}
            <Link to="/wishlist" className="relative text-gray-300 hover:text-red-400 transition duration-200">
              <Heart size={24} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative text-gray-300 hover:text-[#5FE3CF] transition duration-200">
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-[#F5A623] text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Account / Login */}
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link to="/orders" className="flex items-center gap-1.5 text-sm text-gray-300 hover:text-[#5FE3CF] transition duration-200">
                  <User size={16} className="text-cyan-300" />
                  <span className="max-w-[100px] truncate">{user.name.split(" ")[0]}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-white/5 transition duration-200"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-5 py-2 rounded-xl bg-[#F5A623] text-black font-bold hover:scale-105 hover:shadow-[0_0_15px_rgba(245,166,35,0.4)] transition duration-200"
              >
                Login
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#0B0D11] px-6 py-6 absolute w-full left-0 shadow-xl transition-all duration-300">
          <ul className="flex flex-col gap-5 text-gray-300 font-medium text-lg mb-6">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.path}
                  className="hover:text-[#5FE3CF] block py-1 transition"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              </li>
            ))}
            
            {isAuthenticated && isAdmin && (
              <li>
                <Link
                  to="/admin/dashboard"
                  className="flex items-center gap-2 py-2 text-[#F5B544] hover:text-white transition"
                  onClick={() => setIsOpen(false)}
                >
                  <LayoutDashboard size={18} />
                  Admin Panel
                </Link>
              </li>
            )}
          </ul>

          <div className="border-t border-white/10 pt-5 flex flex-col gap-4">
            <Link
              to="/wishlist"
              className="flex items-center justify-between text-gray-300 py-1"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center gap-2">
                <Heart size={20} className="text-red-400" />
                <span>Wishlist</span>
              </div>
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{wishlistCount}</span>
            </Link>

            <Link
              to="/cart"
              className="flex items-center justify-between text-gray-300 py-1"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center gap-2">
                <ShoppingCart size={20} className="text-cyan-300" />
                <span>Shopping Cart</span>
              </div>
              <span className="bg-[#F5A623] text-black text-xs px-2 py-0.5 rounded-full">{cartCount}</span>
            </Link>

            {isAuthenticated ? (
              <div className="flex flex-col gap-3 pt-2">
                <Link
                  to="/orders"
                  className="flex items-center gap-2 text-gray-300 py-1"
                  onClick={() => setIsOpen(false)}
                >
                  <User size={18} className="text-cyan-300" />
                  <span>My Orders ({user.name})</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full text-left text-red-400 py-2 border-t border-white/5 mt-1"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="w-full text-center py-3 rounded-xl bg-[#F5A623] text-black font-bold hover:bg-[#F5A623]/90 transition"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
