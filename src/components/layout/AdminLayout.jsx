import React, { useContext, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Tags, 
  ClipboardList, 
  Store, 
  LogOut, 
  Menu, 
  X,
  Code2,
  ChevronRight,
  Users2
} from "lucide-react";
import { AuthContext } from "../../context/AuthContext";

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const menuItems = [
    { 
      name: "Dashboard", 
      path: "/admin/dashboard", 
      icon: <LayoutDashboard size={20} /> 
    },
    { 
      name: "Products List", 
      path: "/admin/products", 
      icon: <ShoppingBag size={20} /> 
    },
    { 
      name: "Categories", 
      path: "/admin/categories", 
      icon: <Tags size={20} /> 
    },
    { 
      name: "Orders Control", 
      path: "/admin/orders", 
      icon: <ClipboardList size={20} /> 
    },
    { 
      name: "Users", 
      path: "/admin/users", 
      icon: <Users2 size={20} /> 
    },
  ];

  return (
    <div className="min-h-screen bg-[#0F1117] text-white flex flex-col md:flex-row">
      
      {/* Mobile Top Header Bar */}
      <header className="md:hidden bg-[#0B0D11] border-b border-white/10 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="border border-[#5FE3CF] rounded-lg p-1">
            <Code2 size={16} className="text-[#F5B544]" />
          </div>
          <span className="font-bold text-sm text-[#F5B544]">ShopTech <span className="text-xs text-[#5FE3CF] block">Admin Panel</span></span>
        </div>

        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-white hover:text-[#5FE3CF] p-1.5 rounded-lg"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Sidebar Navigation */}
      <aside 
        className={`
          w-64 bg-[#0B0D11] border-r border-white/5 flex flex-col justify-between
          fixed inset-y-0 left-0 z-30 pt-16 md:pt-0 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="px-6 py-8">
          {/* Logo brand (hidden in mobile mode since header already has it) */}
          <div className="hidden md:flex items-center gap-3 mb-10 pb-4 border-b border-white/5">
            <div className="border-2 border-[#5FE3CF] rounded-xl p-2">
              <Code2 size={20} className="text-[#F5B544]" />
            </div>
            <div>
              <h1 className="text-xl font-bold leading-none">
                <span className="text-[#F5B544]">Shop</span>Tech
              </h1>
              <span className="text-[10px] text-[#5FE3CF] font-bold uppercase tracking-wider block mt-1">Admin Console</span>
            </div>
          </div>

          {/* Active Admin Profile */}
          <div className="bg-[#171B26] p-4 rounded-2xl mb-8 flex items-center gap-3 border border-white/5">
            <div className="w-10 h-10 bg-amber-400 text-black font-extrabold rounded-full flex items-center justify-center text-sm">
              AD
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold truncate text-white">{user?.name || "System Admin"}</p>
              <span className="text-[10px] text-emerald-400 font-bold block">Online Context</span>
            </div>
          </div>

          {/* Links list */}
          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3.5 px-4.5 py-3.5 rounded-xl text-sm font-semibold transition duration-150 cursor-pointer
                    ${
                      active
                        ? "bg-[#F5A623] text-black shadow-lg shadow-[#F5A623]/10"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }
                  `}
                >
                  {item.icon}
                  <span>{item.name}</span>
                  {active && <ChevronRight size={14} className="ml-auto" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Controls */}
        <div className="px-6 py-6 border-t border-white/5 space-y-4">
          <Link
            to="/home"
            className="flex items-center gap-3 text-sm text-[#5FE3CF] hover:underline font-semibold"
          >
            <Store size={18} />
            <span>Go to Shopfront</span>
          </Link>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full text-left text-red-400 hover:text-red-500 font-semibold text-sm cursor-pointer"
          >
            <LogOut size={18} />
            <span>Logout Account</span>
          </button>
        </div>
      </aside>

      {/* Main Panel Content Window */}
      <main className="flex-1 min-w-0 overflow-y-auto px-6 md:px-10 py-8 relative">
        {/* Backdrop glassmorphic cover for mobile menu clickoff */}
        {sidebarOpen && (
          <div 
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-20 md:hidden"
          ></div>
        )}
        <Outlet />
      </main>

    </div>
  );
};

export default AdminLayout;
