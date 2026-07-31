import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Heart, Mail } from "lucide-react";
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";

const Footer = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <footer className="bg-[#0B0D11] pt-16 pb-8 border-t border-white/5 mt-auto">
      {/* Student/Tech Motivation CTA */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-lg py-8 px-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-red-500/10 p-3 rounded-full border border-red-500/20">
              <Heart className="text-red-400 fill-red-400" size={28} />
            </div>
            <div>
              <h2 className="text-gray-200 text-lg md:text-xl font-semibold">
                Students who buy their coding items, feel it better.
              </h2>
              <p className="text-[#5FE3CF] text-sm md:text-base mt-1 font-medium">
                Start your technical journey today with premium developer gear.
              </p>
            </div>
          </div>
          <Link to="/home">
            <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#F5A623] to-[#F5B544] text-black font-bold hover:scale-105 transition duration-200 whitespace-nowrap">
              Start Shopping
            </button>
          </Link>
        </div>
      </div>

      {/* Main Footer Links & Branding */}
      <div className="max-w-7xl mx-auto mt-16 px-6 grid grid-cols-1 md:grid-cols-4 gap-10 border-b border-white/5 pb-12">
        {/* Brand */}
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold">
            <span className="text-[#F5B544]">Shop</span>
            <span className="text-[#5FE3CF]">Tech</span>
          </h1>
          <p className="text-gray-500 mt-4 max-w-sm leading-relaxed">
            ShopTech is a premium e-commerce platform offering state-of-the-art gaming setups, productivity tools, and hardware gadgets designed specifically for developers and creators.
          </p>
          {/* Social icons */}
          <div className="flex items-center gap-4 mt-6">
            <a href="#" className="p-2 rounded-lg bg-white/5 border border-white/5 text-gray-400 hover:text-[#5FE3CF] hover:border-[#5FE3CF]/30 transition duration-200">
              <FaGithub size={18} />
            </a>
            <a href="#" className="p-2 rounded-lg bg-white/5 border border-white/5 text-gray-400 hover:text-[#5FE3CF] hover:border-[#5FE3CF]/30 transition duration-200">
              <FaTwitter size={18} />
            </a>
            <a href="#" className="p-2 rounded-lg bg-white/5 border border-white/5 text-gray-400 hover:text-[#5FE3CF] hover:border-[#5FE3CF]/30 transition duration-200">
              <FaLinkedin size={18} />
            </a>
            <a href="#" className="p-2 rounded-lg bg-white/5 border border-white/5 text-gray-400 hover:text-[#5FE3CF] hover:border-[#5FE3CF]/30 transition duration-200">
              <Mail size={18} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
          <ul className="space-y-3 text-gray-400">
            <li>
              <Link to="/home" className="hover:text-[#5FE3CF] transition duration-150">
                Products
              </Link>
            </li>
            <li>
              <Link to="/wishlist" className="hover:text-[#5FE3CF] transition duration-150">
                Wishlist
              </Link>
            </li>
            <li>
              <Link to="/cart" className="hover:text-[#5FE3CF] transition duration-150">
                Shopping Cart
              </Link>
            </li>
            {isAuthenticated ? (
              <li>
                <Link to="/orders" className="hover:text-[#5FE3CF] transition duration-150">
                  Track Orders
                </Link>
              </li>
            ) : (
              <li>
                <Link to="/login" className="hover:text-[#5FE3CF] transition duration-150">
                  Account Sign In
                </Link>
              </li>
            )}
          </ul>
        </div>

        {/* Legal / Policy */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-4">Customer Care</h3>
          <ul className="space-y-3 text-gray-400">
            <li>
              <a href="#faq" className="hover:text-[#5FE3CF] transition duration-150">
                Help & FAQ
              </a>
            </li>
            <li>
              <a href="#shipping" className="hover:text-[#5FE3CF] transition duration-150">
                Shipping Policy
              </a>
            </li>
            <li>
              <a href="#returns" className="hover:text-[#5FE3CF] transition duration-150">
                Returns & Refunds
              </a>
            </li>
            <li>
              <a href="#terms" className="hover:text-[#5FE3CF] transition duration-150">
                Terms & Conditions
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto mt-8 px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-sm">
        <p>© 2026 ShopTech Inc. All rights reserved.</p>
        <p className="flex items-center gap-1.5">
          Crafted for developers with <Heart size={14} className="text-[#F5A623] fill-[#F5A623]" /> and caffeine.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
