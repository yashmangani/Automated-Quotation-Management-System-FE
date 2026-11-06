
import React, { useState, useEffect } from "react";
import {
  Home,
  FileText,
  Package,
  Settings,
  Menu,
  X,
  Search,
  PlusCircle,
  Trash2,
  Upload,
  Eye,
  Edit,
  Printer,
  Filter,
  AlertCircle,
  Lock,
  EyeOff,
  User,
  LogOut,
  BarChart3,
  ShoppingCart
} from "lucide-react";
import { useNavigate } from "react-router-dom";


function AdminPage() {
  const navigate = useNavigate();
  const options = [
    {
      id: 1,
      title: "User Password Change",
      description: "Change the password for login users",
      icon: <User size={32} className="text-red-700" />,
    },
    {
      id: 2,
      title: "Admin Password Change",
      description: "Update admin password for security",
      icon: <Lock size={32} className="text-red-700" />,
    },
    {
      id: 3,
      title: "Item Management",
      description: "Manage product catalog and items",
      icon: <Package size={32} className="text-red-700" />,
      onClick: () => {
       navigate("/items");
      }
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white p-8 rounded-xl shadow-sm">
        <h1 className="text-3xl font-bold text-center text-red-800 mb-8">
          Admin Dashboard
        </h1>

        <div className="grid md:grid-cols-3 gap-6">
          {options.map((opt) => (
            <div
              key={opt.id}
              onClick={opt.onClick}
              className={`${opt.onClick ? 'cursor-pointer' : ''} group bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all hover:bg-red-50`}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="bg-white p-4 rounded-full shadow-inner group-hover:scale-110 transition-transform">
                  {opt.icon}
                </div>
                <h2 className="text-xl font-semibold text-gray-800 group-hover:text-red-700">
                  {opt.title}
                </h2>
                <p className="text-gray-600 text-sm">{opt.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default AdminPage;