import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Label, TextInput, Checkbox } from "flowbite-react";
import { UserPlus, Code2, AlertCircle, CheckCircle2 } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { register, isAuthenticated } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [agree, setAgree] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Form validations
    if (!name.trim()) return setError("Full Name is required.");
    if (!email.trim()) return setError("Email is required.");
    if (!password) return setError("Password is required.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    if (password !== repeatPassword) return setError("Passwords do not match.");
    if (!agree) return setError("You must agree to the terms and conditions.");

    setLoading(true);

    try {
      await register({ name, email, password, role: "customer" });
      setSuccess(true);
      setName("");
      setEmail("");
      setPassword("");
      setRepeatPassword("");
      setAgree(false);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.message || "Failed to create account. Email might be already in use.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F1117] text-white flex flex-col justify-center items-center px-6 relative py-12">
      {/* Decorative blurs */}
      <div className="absolute top-1/4 left-1/3 w-[300px] h-[300px] bg-[#5FE3CF] blur-[150px] opacity-10 rounded-full"></div>
      <div className="absolute bottom-1/4 right-1/3 w-[300px] h-[300px] bg-[#F5B544] blur-[150px] opacity-10 rounded-full"></div>

      <div className="w-full max-w-md bg-[#171B26] p-8 md:p-10 rounded-3xl border border-gray-800 shadow-2xl relative z-10 space-y-6">
        
        {/* Brand Logo Header */}
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="border-2 border-[#5FE3CF] rounded-xl p-2.5 bg-white/5 inline-block">
            <Code2 size={24} className="text-[#F5B544]" />
          </div>
          <h2 className="text-2xl font-bold text-white mt-2">
            Create an Account
          </h2>
          <p className="text-gray-500 text-xs max-w-xs mt-1">
            Join ShopTech to track premium orders and curate wishlists.
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3.5 rounded-xl text-xs flex items-center gap-2 animate-fadeIn">
            <AlertCircle size={16} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl text-xs flex items-center gap-2.5 animate-fadeIn">
            <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0" />
            <div>
              <p className="font-bold text-white">Registration Successful!</p>
              <p className="text-[10px] text-emerald-400/80 mt-0.5">Redirecting you to login page shortly...</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-[11px] font-bold text-gray-400 uppercase">
              Full Name
            </Label>
            <input
              id="name"
              type="text"
              placeholder="Sagar Kumar"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-[#0F1117] border border-gray-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-[#F5A623] text-sm"
            />
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-[11px] font-bold text-gray-400 uppercase">
              Your Email Address
            </Label>
            <input
              id="email"
              type="email"
              placeholder="sagar@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[#0F1117] border border-gray-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-[#F5A623] text-sm"
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-[11px] font-bold text-gray-400 uppercase">
              Choose Password (min 6 chars)
            </Label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-[#0F1117] border border-gray-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-[#F5A623] text-sm"
            />
          </div>

          {/* Repeat Password */}
          <div className="space-y-1.5">
            <Label htmlFor="repeat-password" className="text-[11px] font-bold text-gray-400 uppercase">
              Confirm Password
            </Label>
            <input
              id="repeat-password"
              type="password"
              placeholder="••••••••"
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
              required
              className="w-full bg-[#0F1117] border border-gray-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-[#F5A623] text-sm"
            />
          </div>

          {/* Agree T&C checkbox */}
          <div className="flex items-center gap-2 pt-2">
            <Checkbox
              id="agree"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="rounded-sm border-gray-800 bg-[#0F1117] focus:ring-0 text-[#F5A623]"
            />
            <Label htmlFor="agree" className="text-xs text-gray-400 flex items-center cursor-pointer select-none">
              I agree with the&nbsp;
              <a href="#terms" className="text-cyan-400 hover:underline">
                terms and conditions
              </a>
            </Label>
          </div>

          {/* Submit register button */}
          <button
            type="submit"
            disabled={loading || success}
            className="w-full bg-[#F5A623] text-black font-extrabold py-3.5 rounded-xl hover:scale-102 hover:shadow-[0_0_15px_rgba(245,166,35,0.3)] transition duration-200 text-sm flex items-center justify-center gap-2 cursor-pointer mt-6 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                <span>Creating account...</span>
              </>
            ) : (
              <>
                <UserPlus size={16} />
                <span>Register account</span>
              </>
            )}
          </button>
        </form>

        {/* Redirect log in footer */}
        <div className="text-center text-xs text-gray-500 pt-2">
          Already have an account?{" "}
          <Link to="/login" className="text-[#5FE3CF] hover:underline font-semibold ml-1">
            Sign In here
          </Link>
        </div>

      </div>
    </div>
  );
}
