import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Label, TextInput, Checkbox } from "flowbite-react";
import { LogIn, Code2, AlertCircle } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated, isAdmin } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // If already authenticated, redirect immediately
  useEffect(() => {
    if (isAuthenticated) {
      if (isAdmin) {
        navigate("/admin/dashboard");
      } else {
        navigate("/home");
      }
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      return setError("Please fill in all fields.");
    }

    setLoading(true);

    try {
      const loggedUser = await login(email, password);
      if (loggedUser.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/home");
      }
    } catch (err) {
      setError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F1117] text-white flex flex-col justify-center items-center px-6 relative py-12">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-1/4 left-1/3 w-[300px] h-[300px] bg-[#5FE3CF] blur-[150px] opacity-10 rounded-full"></div>
      <div className="absolute bottom-1/4 right-1/3 w-[300px] h-[300px] bg-[#F5B544] blur-[150px] opacity-10 rounded-full"></div>

      <div className="w-full max-w-md bg-[#171B26] p-8 md:p-10 rounded-3xl border border-gray-800 shadow-2xl relative z-10 space-y-6">
        
        {/* Brand Logo Header */}
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="border-2 border-[#5FE3CF] rounded-xl p-2.5 bg-white/5 inline-block">
            <Code2 size={24} className="text-[#F5B544]" />
          </div>
          <h2 className="text-2xl font-bold text-white mt-2">
            Sign In to <span className="text-[#F5B544]">Shop</span>Tech
          </h2>
          <p className="text-gray-500 text-xs max-w-xs mt-1">
            Access your order tracking, custom configurations, and wishlist bookmarks.
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3.5 rounded-xl text-xs flex items-center gap-2 animate-fadeIn">
            <AlertCircle size={16} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email input */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs font-bold text-gray-400 uppercase">
              Your Email Address
            </Label>
            <input
              id="email"
              type="email"
              placeholder="user@shoptech.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[#0F1117] border border-gray-800 rounded-xl px-4 py-3 text-white outline-none focus:border-[#F5A623] text-sm"
            />
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-xs font-bold text-gray-400 uppercase">
              Password
            </Label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-[#0F1117] border border-gray-800 rounded-xl px-4 py-3 text-white outline-none focus:border-[#F5A623] text-sm"
            />
          </div>

          {/* Remember & Options */}
          <div className="flex items-center justify-between text-xs pt-1 text-gray-400">
            <div className="flex items-center gap-2">
              <Checkbox id="remember" className="rounded-sm border-gray-800 bg-[#0F1117] focus:ring-0 text-[#F5A623]" />
              <Label htmlFor="remember" className="text-gray-400 cursor-pointer">Remember me</Label>
            </div>
            <a href="#forgot" className="text-cyan-400 hover:underline">Forgot password?</a>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#F5A623] text-black font-extrabold py-3.5 rounded-xl hover:scale-102 hover:shadow-[0_0_15px_rgba(245,166,35,0.3)] transition duration-200 text-sm flex items-center justify-center gap-2 cursor-pointer mt-6"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <LogIn size={16} />
                <span>Login</span>
              </>
            )}
          </button>
        </form>

        {/* Demo Credentials Alert Helper */}
        <div className="bg-[#0F1117] border border-gray-800 p-4 rounded-xl space-y-2 text-[10px] text-gray-400 leading-normal">
          <p className="font-bold text-white border-b border-white/5 pb-1">💡 Demo Test Accounts:</p>
          <p>• <strong>Admin:</strong> admin@shoptech.com / password: admin123</p>
          <p>• <strong>Customer:</strong> user@shoptech.com / password: user123</p>
        </div>

        {/* Redirect sign up footer */}
        <div className="text-center text-xs text-gray-500 pt-2">
          New to ShopTech?{" "}
          <Link to="/register" className="text-[#5FE3CF] hover:underline font-semibold ml-1">
            Create an account
          </Link>
        </div>

      </div>
    </div>
  );
}
