import React, { useState } from "react";
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle, User, Shield } from "lucide-react";

function Settings() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Get user info from localStorage (assuming it's stored during login)
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const token = localStorage.getItem("token");

  // Form state
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleInputChange = (e:any) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear message when user starts typing
    if (message.text) setMessage({ type: "", text: "" });
  };

  const validateForm = () => {
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setMessage({ type: "error", text: "All fields are required" });
      return false;
    }

    if (formData.newPassword.length < 6) {
      setMessage({ type: "error", text: "New password must be at least 6 characters" });
      return false;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: "error", text: "New password and confirm password do not match" });
      return false;
    }

    if (formData.currentPassword === formData.newPassword) {
      setMessage({ type: "error", text: "New password must be different from current password" });
      return false;
    }

    return true;
  };


  const handleChangePassword = async () => {
  if (!validateForm()) return;

  setLoading(true);
  setMessage({ type: "", text: "" });

  try {
    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/password/admin-change-own`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        adminId: user?.id,
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      })
    });

    const data = await response.json();

    if (response.ok && data.success) {
      setMessage({ type: "success", text: "Admin password changed successfully!" });

      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });

    } else {
      setMessage({
        type: "error",
        text: data.message || "Password update failed"
      });
    }

  } catch (error) {
    setMessage({
      type: "error",
      text: "Network error. Try again."
    });
  }

  setLoading(false);
};


  const handleClear = () => {
    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
    setMessage({ type: "", text: "" });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Shield className="text-red-600" size={28} />
          Settings
        </h1>
        <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
      </div>

      {/* User Information Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <User className="text-gray-600" size={20} />
          Account Information
        </h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <span className="text-gray-600 font-medium">Username</span>
            <span className="text-gray-800 font-semibold">{user?.username || "N/A"}</span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <span className="text-gray-600 font-medium">Role</span>
            <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold capitalize">
              {user?.role === "admin" ? "Administrator" : "Sales User"}
            </span>
          </div>
          <div className="flex items-center justify-between py-3">
            <span className="text-gray-600 font-medium">User ID</span>
            <span className="text-gray-500 text-sm font-mono">{user?.id || "N/A"}</span>
          </div>
        </div>
      </div>

      {/* Change Password Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Lock className="text-gray-600" size={20} />
          Change Password
        </h2>

        {/* Alert Messages */}
        {message.text && (
          <div className={`mb-4 p-4 rounded-lg flex items-start gap-3 ${
            message.type === "success" 
              ? "bg-green-50 border border-green-200" 
              : "bg-red-50 border border-red-200"
          }`}>
            {message.type === "success" ? (
              <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
            ) : (
              <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
            )}
            <div className="flex-1">
              <p className={`font-medium ${
                message.type === "success" ? "text-green-800" : "text-red-800"
              }`}>
                {message.text}
              </p>
            </div>
          </div>
        )}

        <div className="space-y-5">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Password *
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent pr-12"
                placeholder="Enter current password"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                disabled={loading}
              >
                {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password *
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent pr-12"
                placeholder="Enter new password (min 6 characters)"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                disabled={loading}
              >
                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password *
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent pr-12"
                placeholder="Confirm new password"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                disabled={loading}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Password Requirements */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Password Requirements:</p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li className="flex items-center gap-2">
                <span className="text-red-600">•</span>
                Minimum 6 characters long
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-600">•</span>
                Must be different from current password
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-600">•</span>
                New password and confirm password must match
              </li>
            </ul>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleChangePassword}
              disabled={loading}
              className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Changing Password...
                </span>
              ) : (
                "Change Password"
              )}
            </button>
            <button
              type="button"
              onClick={handleClear}
              disabled={loading}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Security Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
          <AlertCircle className="text-blue-600" size={18} />
          Security Tips
        </h3>
        <ul className="text-sm text-blue-800 space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-1">•</span>
            <span>Use a strong password with a mix of letters, numbers, and symbols</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-1">•</span>
            <span>Don't reuse passwords from other accounts</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-1">•</span>
            <span>Change your password regularly to maintain security</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-1">•</span>
            <span>Never share your password with anyone</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Settings;