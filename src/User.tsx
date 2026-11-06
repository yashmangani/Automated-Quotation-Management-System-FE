import React, { useState, useEffect } from "react";
import { Users, Lock, Eye, EyeOff, AlertCircle, CheckCircle, Shield, Trash2, UserPlus, X } from "lucide-react";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Get current user info
  const userStr = localStorage.getItem("user");
  const currentUser = userStr ? JSON.parse(userStr) : null;
  const token = localStorage.getItem("token");
  const isAdmin = currentUser?.role === "admin";

  // Password change form state
  const [passwordForm, setPasswordForm] = useState({
    newPassword: "",
    confirmPassword: ""
  });

  // Add user form state
  const [addUserForm, setAddUserForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    role: "sales"
  });

  // Fetch all users - ONLY SALES USERS
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/users`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (response.ok && data.success) {
        // Filter to show ONLY sales users, exclude admin users
        const salesUsers = (data.users || []).filter((user:any) => 
          user && user.username && user.role === "sales"
        );
        setUsers(salesUsers);
      } else {
        setMessage({ type: "error", text: "Failed to fetch users" });
      }
    } catch (error) {
      console.error("Fetch users error:", error);
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, []);

  // Handle password change modal
  const openPasswordModal = (user:any) => {
    setSelectedUser(user);
    setPasswordForm({ newPassword: "", confirmPassword: "" });
    setShowPasswordModal(true);
    setMessage({ type: "", text: "" });
  };

  const closePasswordModal = () => {
    setShowPasswordModal(false);
    setSelectedUser(null);
    setPasswordForm({ newPassword: "", confirmPassword: "" });
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  // Handle password change
  const handleChangePassword = async () => {
    if (!passwordForm.newPassword || !passwordForm.confirmPassword) {
      setMessage({ type: "error", text: "All fields are required" });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters" });
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/users/password/change`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: selectedUser._id,
          newPassword: passwordForm.newPassword
        })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setMessage({ type: "success", text: "Password changed successfully!" });
        setTimeout(() => {
          closePasswordModal();
        }, 1500);
      } else {
        setMessage({ type: "error", text: data.message || "Failed to change password" });
      }
    } catch (error) {
      console.error("Password change error:", error);
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  // Handle add user
  const handleAddUser = async () => {
    if (!addUserForm.username || !addUserForm.password || !addUserForm.confirmPassword) {
      setMessage({ type: "error", text: "All fields are required" });
      return;
    }

    if (addUserForm.password.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters" });
      return;
    }

    if (addUserForm.password !== addUserForm.confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          username: addUserForm.username,
          password: addUserForm.password,
          role: "sales"
        })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setMessage({ type: "success", text: "User added successfully!" });
        fetchUsers();
        setTimeout(() => {
          setShowAddUserModal(false);
          setAddUserForm({ username: "", password: "", confirmPassword: "", role: "sales" });
        }, 1500);
      } else {
        setMessage({ type: "error", text: data.message || "Failed to add user" });
      }
    } catch (error) {
      console.error("Add user error:", error);
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  // Handle delete user
  const handleDeleteUser = async (userId:any) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/users/${userId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setMessage({ type: "success", text: "User deleted successfully!" });
        fetchUsers();
      } else {
        setMessage({ type: "error", text: data.message || "Failed to delete user" });
      }
    } catch (error) {
      console.error("Delete user error:", error);
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="   mx-auto space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Users className="text-red-600" size={28} />
              User Management
            </h1>
            <p className="text-gray-600 mt-1">Manage sales users and their passwords</p>
          </div>
          <button
            onClick={() => {
              setShowAddUserModal(true);
              setMessage({ type: "", text: "" });
            }}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center gap-2"
          >
            <UserPlus size={20} />
            Add User
          </button>
        </div>
      </div>

      {/* Alert Messages */}
      {message.text && !showPasswordModal && !showAddUserModal && (
        <div className={`p-4 rounded-lg flex items-start gap-3 ${
          message.type === "success" 
            ? "bg-green-50 border border-green-200" 
            : "bg-red-50 border border-red-200"
        }`}>
          {message.type === "success" ? (
            <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
          ) : (
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
          )}
          <p className={`font-medium ${
            message.type === "success" ? "text-green-800" : "text-red-800"
          }`}>
            {message.text}
          </p>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white mx-4 rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Username</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Role</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">User ID</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading && users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Loading users...
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    No sales users found
                  </td>
                </tr>
              ) : (
                users.map((user:any) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                          <span className="text-red-700 font-semibold text-sm">
                            {user.username && user.username.length > 0 ? user.username.charAt(0).toUpperCase() : 'U'}
                          </span>
                        </div>
                        <span className="font-medium text-gray-800">{user.username || 'Unknown User'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-sm font-semibold capitalize bg-blue-100 text-blue-700">
                        Sales User
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-500 text-sm font-mono">{user._id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openPasswordModal(user)}
                          className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium flex items-center gap-1"
                        >
                          <Lock size={16} />
                          Change Password
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="px-3 py-1.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium flex items-center gap-1"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Lock className="text-red-600" size={24} />
                Change Password
              </h2>
              <button
                onClick={closePasswordModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Changing password for:</p>
              <p className="font-semibold text-gray-800">{selectedUser?.username || 'Unknown User'}</p>
            </div>

            {message.text && (
              <div className={`mb-4 p-3 rounded-lg flex items-start gap-2 ${
                message.type === "success" 
                  ? "bg-green-50 border border-green-200" 
                  : "bg-red-50 border border-red-200"
              }`}>
                {message.type === "success" ? (
                  <CheckCircle className="text-green-600 flex-shrink-0" size={18} />
                ) : (
                  <AlertCircle className="text-red-600 flex-shrink-0" size={18} />
                )}
                <p className={`text-sm font-medium ${
                  message.type === "success" ? "text-green-800" : "text-red-800"
                }`}>
                  {message.text}
                </p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password *
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent pr-12"
                    placeholder="Enter new password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password *
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent pr-12"
                    placeholder="Confirm new password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleChangePassword}
                  disabled={loading}
                  className="flex-1 bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? "Changing..." : "Change Password"}
                </button>
                <button
                  onClick={closePasswordModal}
                  disabled={loading}
                  className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <UserPlus className="text-red-600" size={24} />
                Add New Sales User
              </h2>
              <button
                onClick={() => {
                  setShowAddUserModal(false);
                  setAddUserForm({ username: "", password: "", confirmPassword: "", role: "sales" });
                  setMessage({ type: "", text: "" });
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            {message.text && (
              <div className={`mb-4 p-3 rounded-lg flex items-start gap-2 ${
                message.type === "success" 
                  ? "bg-green-50 border border-green-200" 
                  : "bg-red-50 border border-red-200"
              }`}>
                {message.type === "success" ? (
                  <CheckCircle className="text-green-600 flex-shrink-0" size={18} />
                ) : (
                  <AlertCircle className="text-red-600 flex-shrink-0" size={18} />
                )}
                <p className={`text-sm font-medium ${
                  message.type === "success" ? "text-green-800" : "text-red-800"
                }`}>
                  {message.text}
                </p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username *
                </label>
                <input
                  type="text"
                  value={addUserForm.username}
                  onChange={(e) => setAddUserForm({ ...addUserForm, username: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Enter username"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password *
                </label>
                <input
                  type="password"
                  value={addUserForm.password}
                  onChange={(e) => setAddUserForm({ ...addUserForm, password: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Enter password"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  value={addUserForm.confirmPassword}
                  onChange={(e) => setAddUserForm({ ...addUserForm, confirmPassword: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Confirm password"
                  disabled={loading}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleAddUser}
                  disabled={loading}
                  className="flex-1 bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? "Adding..." : "Add User"}
                </button>
                <button
                  onClick={() => {
                    setShowAddUserModal(false);
                    setAddUserForm({ username: "", password: "", confirmPassword: "", role: "sales" });
                    setMessage({ type: "", text: "" });
                  }}
                  disabled={loading}
                  className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManagement;