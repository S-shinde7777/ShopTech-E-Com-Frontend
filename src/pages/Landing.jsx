import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Truck, Star, ShoppingBag } from "lucide-react";
import { productService } from "../services/productService";

const Landing = () => {
  const [bestSellers, setBestSellers] = useState([]);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const products = await productService.getProducts();
        const sorted = [...products].sort((a, b) => b.rating - a.rating).slice(0, 3);
        setBestSellers(sorted);
      } catch (err) {
        console.error("Failed to load best sellers", err);
      }
    };
    fetchBestSellers();
  }, []);

  return (
    <main className="bg-[#09090B] text-white overflow-hidden min-h-screen">
      
      {/* HERO SECTION */}
      <section className="min-h-[85vh] flex items-center relative py-12 md:py-20">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#5FE3CF] blur-[150px] opacity-10 rounded-full"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#F5B544] blur-[150px] opacity-10 rounded-full"></div>

        <div className="max-w-7xl mx-auto px-6 lg:px-16 grid lg:grid-cols-2 gap-14 items-center relative z-10">
          {/* Left Hero Text */}
          <div>
            <span className="px-4 py-2 rounded-full border border-cyan-400/30 text-cyan-300 bg-cyan-400/10 text-sm font-semibold inline-block">
              🚀 Premium Tech Collection 2026
            </span>

            <h1 className="text-5xl lg:text-7xl font-extrabold mt-8 leading-tight">
              Shop The
              <br />
              <span className="text-amber-400">Future</span> Of Tech
            </h1>

            <p className="text-gray-400 mt-6 text-lg max-w-xl leading-relaxed">
              Discover professional mechanical keyboards, wireless audiowear, and high-fidelity workspace setups crafted for software developers and creators.
            </p>

            <div className="flex flex-wrap gap-5 mt-10">
              <Link to="/home">
                <button className="px-8 py-4 rounded-xl bg-[#F5A623] text-black font-bold hover:scale-105 hover:shadow-[0_0_30px_rgba(245,158,11,.6)] transition cursor-pointer">
                  Shop Storefront
                </button>
              </Link>

              <a href="#featured">
                <button className="px-8 py-4 rounded-xl border border-cyan-400 text-cyan-300 hover:bg-cyan-400/10 transition flex items-center gap-2 cursor-pointer">
                  Explore Products
                  <ArrowRight size={18}/>
                </button>
              </a>
            </div>

            <div className="flex gap-10 mt-12 border-t border-white/5 pt-8">
              <div>
                <h2 className="text-3xl font-extrabold text-[#F5B544]">10K+</h2>
                <p className="text-gray-400 text-sm mt-1">Happy Developers</p>
              </div>
              <div>
                <h2 className="text-3xl font-extrabold text-[#5FE3CF]">500+</h2>
                <p className="text-gray-400 text-sm mt-1">Workspace Gear Items</p>
              </div>
            </div>
          </div>

          {/* Right Hero Image Overlay */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-400 blur-[120px] opacity-15 rounded-full"></div>
              <img
                src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=700"
                alt="headphone hero"
                className="relative w-[340px] md:w-[420px] rounded-3xl border border-cyan-400/20 shadow-[0_0_60px_rgba(34,211,238,.15)] hover:scale-102 transition duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CORE FEATURES SECTION */}
      <section className="max-w-7xl mx-auto px-6 lg:px-16 py-20 relative z-10">
        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Feature 1 */}
          <div className="rounded-3xl border border-cyan-400/10 bg-white/5 backdrop-blur-xl p-8 hover:border-cyan-400/40 transition group">
            <div className="w-12 h-12 bg-cyan-400/10 rounded-2xl flex items-center justify-center text-cyan-300 mb-6 group-hover:scale-110 transition">
              <Truck size={24}/>
            </div>
            <h3 className="text-xl font-bold text-white">Free Express Shipping</h3>
            <p className="text-gray-400 mt-3 text-sm leading-relaxed">
              Enjoy free, fully-insured international delivery for all premium hardware orders.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="rounded-3xl border border-amber-400/10 bg-white/5 backdrop-blur-xl p-8 hover:border-amber-400/40 transition group">
            <div className="w-12 h-12 bg-amber-400/10 rounded-2xl flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition">
              <ShieldCheck size={24}/>
            </div>
            <h3 className="text-xl font-bold text-white">Secured Payment Gateway</h3>
            <p className="text-gray-400 mt-3 text-sm leading-relaxed">
              Your credentials are safe. Secure 256-bit SSL encrypted checkout with multiple card and UPI support.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="rounded-3xl border border-cyan-400/10 bg-white/5 backdrop-blur-xl p-8 hover:border-cyan-400/40 transition group">
            <div className="w-12 h-12 bg-cyan-400/10 rounded-2xl flex items-center justify-center text-cyan-300 mb-6 group-hover:scale-110 transition">
              <ShoppingBag size={24}/>
            </div>
            <h3 className="text-xl font-bold text-white">Premium Quality Assured</h3>
            <p className="text-gray-400 mt-3 text-sm leading-relaxed">
              Every gadget is fully tested, verified, and comes with a 1-year product replacement warranty.
            </p>
          </div>

        </div>
      </section>

      {/* BEST SELLERS / HIGHLIGHTS */}
      <section id="featured" className="max-w-7xl mx-auto px-6 lg:px-16 pb-28">
        <div className="flex justify-between items-center mb-12 border-b border-white/5 pb-4">
          <div>
            <span className="text-[#4ECDC4] text-xs font-bold uppercase tracking-wider">Highly Rated</span>
            <h2 className="text-3xl md:text-4xl font-extrabold mt-1 text-white">Top Rated Gear</h2>
          </div>
          <Link to="/home" className="text-cyan-300 hover:text-white font-semibold flex items-center gap-1 transition">
            <span>View All</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {bestSellers.map((item) => (
            <div
              key={item.id}
              className="group rounded-3xl border border-white/10 bg-[#171B26] overflow-hidden hover:border-[#F5A623] hover:-translate-y-2 transition duration-300 flex flex-col"
            >
              {/* Product Image */}
              <div className="h-60 bg-[#0F1117] flex items-center justify-center p-4 relative overflow-hidden">
                <img
                  src={item.image}
                  className="h-full w-full object-cover rounded-2xl group-hover:scale-105 transition duration-500"
                  alt={item.name}
                />
              </div>

              {/* Product Info */}
              <div className="p-6 flex flex-col flex-grow">
                <span className="text-cyan-400 text-xs font-semibold uppercase">{item.category}</span>
                <h3 className="text-xl font-bold text-white mt-1 group-hover:text-[#F5A623] transition truncate">
                  {item.name}
                </h3>

                {/* Stars */}
                <div className="flex items-center gap-1 mt-2.5 mb-4">
                  <div className="flex text-amber-400">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star
                        key={idx}
                        size={15}
                        fill={idx < Math.floor(item.rating) ? "currentColor" : "none"}
                        className={idx < Math.floor(item.rating) ? "text-amber-400" : "text-gray-600"}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-400 ml-1">({item.rating})</span>
                </div>

                <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-2xl font-black text-white">
                    ₹{item.price.toLocaleString("en-IN")}
                  </span>
                  <Link to={`/product/${item.id}`}>
                    <button className="px-5 py-2.5 rounded-xl bg-amber-400 text-black font-bold hover:scale-105 hover:shadow-[0_0_15px_rgba(245,158,11,.4)] transition text-sm cursor-pointer">
                      View Details
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
};

export default Landing;