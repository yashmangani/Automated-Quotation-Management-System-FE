import React, { useState, useEffect } from "react";
import {
  Home,
  FileText,
  Package,
  Settings,
  Menu,
  X,
  User,
  LogOut
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./authContext";
import logos from '../public/logo.jpg';

// ==================== LAYOUT COMPONENT ====================
function Layout({ children }:any) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const currentPage = window.location.pathname.slice(1); // Get current page from URL path
  
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Define menu items with role-based access
  const allMenuItems = [
    { 
      id: "dashboard", 
      label: "Dashboard", 
      icon: <Home size={20} />, 
      path: "dashboard",
      roles: ["sales"] // Both admin and sales can access dashboard
    },
    { 
      id: "quotation", 
      label: "New Quotation", 
      icon: <FileText size={20} />, 
      path: "quotation",
      roles: [ "sales"] // Both can create quotations
    },
    { 
      id: "items", 
      label: "Item Management", 
      icon: <Package size={20} />, 
      path: "items",
      roles: ["admin"] // Only admin can manage items
    },
    { 
      id: "user", 
      label: "User Management", 
      icon: <Package size={20} />, 
      path: "user",
      roles: ["admin"] // Only admin can manage items
    },
    { 
      id: "settings", 
      label: "Settings", 
      icon: <Settings size={20} />, 
      path: "settings",
      roles: ["admin"] // Both can access settings to change password
    },
  ];

  // Filter menu items based on user role
  const menuItems = allMenuItems.filter(item => 
    user && item.roles.includes(user.role)
  );

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-0"
        } bg-gradient-to-b from-red-900 to-red-800 text-white transition-all duration-300 overflow-hidden fixed md:relative h-full z-50 shadow-2xl`}
      >
        <div className="p-6 border-b border-red-700">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center border border-white/20 p-1">
              <img src="/logo.png" alt="Quotation Generator Logo" className="w-10 h-10 object-contain rounded-lg" />
            </div>
            <div>
              <h1 className="text-base font-bold leading-tight">Quotation Generator</h1>
              <p className="text-[10px] text-red-200 leading-tight">Automated Quotation System</p>
            </div>
          </div>
        </div>

        {/* User Info Section */}
        {user && (
          <div className="px-4 py-3 bg-red-950/50 border-b border-red-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-700 rounded-full flex items-center justify-center">
                <User size={18} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{user.username}</p>
                <p className="text-xs text-red-200 capitalize">
                  {user.role === "admin" ? "Administrator" : "Sales User"}
                </p>
              </div>
            </div>
          </div>
        )}

        <nav className="p-4 space-y-2">
          {menuItems.length > 0 ? (
            menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  navigate(`/${item.path}`);
                  if (isMobile) setSidebarOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                  currentPage === item.path
                    ? "bg-white text-red-800 shadow-lg"
                    : "hover:bg-red-700 text-white"
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </button>
            ))
          ) : (
            <div className="text-center text-red-200 text-sm py-4">
              No menu items available
            </div>
          )}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-red-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-700 transition-all text-white"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              
              {/* Current Page Title */}
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {menuItems.find(item => item.path === currentPage)?.label || "Dashboard"}
                </h2>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-800">
                  {user?.username || "User"}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {user?.role === "admin" ? "Administrator" : "Sales User"}
                </p>
              </div>
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <User size={20} className="text-red-700" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="h-[93vh] overflow-auto ">{children}</main>
      </div>

      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

export default Layout;