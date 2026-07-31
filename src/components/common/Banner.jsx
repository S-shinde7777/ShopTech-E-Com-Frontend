import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Banner = () => {
  return (
    <section className="px-6 md:px-12 mt-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#171B26] to-[#10131A] p-8 md:p-14 flex flex-col md:flex-row items-center justify-between border border-white/5 shadow-xl">
        
        {/* Glow backdrop decorative item */}
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#5FE3CF] blur-[120px] opacity-10 rounded-full -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-[#F5B544] blur-[100px] opacity-5 rounded-full -ml-10 -mb-10"></div>

        {/* Left Content */}
        <div className="max-w-xl relative z-10">
          <span className="text-[#4ECDC4] text-sm font-bold uppercase tracking-wider bg-[#4ECDC4]/5 border border-[#4ECDC4]/20 px-3 py-1.5 rounded-full mb-6 inline-block">
            🛠️ Developer Setup Deals
          </span>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight mt-3 text-white">
            Find Everything
            <br />
            <span className="text-[#F5A623]">You Love</span>
          </h1>

          <p className="text-gray-400 mt-5 text-base md:text-lg leading-relaxed max-w-md">
            Explore latest developer grade keyboards, audio wear, and premium workspace gear with exclusive limited-time discounts.
          </p>

          <Link to="/home" className="inline-block mt-8">
            <button className="bg-[#F5A623] text-black px-8 py-3.5 rounded-xl font-bold hover:scale-105 hover:shadow-[0_0_20px_rgba(245,166,35,0.4)] transition flex items-center gap-2 cursor-pointer">
              <span>Shop All Products</span>
              <ArrowRight size={18} />
            </button>
          </Link>
        </div>

        {/* Right Image */}
        <div className="mt-8 md:mt-0 relative z-10 hover:scale-102 transition duration-500 flex-shrink-0">
          <div className="absolute inset-0 bg-[#F5A623]/10 blur-[40px] rounded-2xl"></div>
          <img
            src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600"
            alt="shopping"
            className="w-[280px] md:w-[380px] lg:w-[440px] rounded-2xl object-cover border border-white/10 shadow-2xl relative"
          />
        </div>

      </div>
    </section>
  );
};

export default Banner;
