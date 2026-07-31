import React, { useEffect, useState, useContext } from "react";
import {
  Users2,
  Trash2,
  Shield,
  User,
  AlertCircle,
  CheckCircle2,
  Search,
  Crown,
  ShoppingBag,
} from "lucide-react";
import { authService } from "../../services/authService";
import { AuthContext } from "../../context/AuthContext";

const Users = () => {
  const { user: currentUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    setUsers(authService.getUsers());
  };

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleRoleChange = (userId, newRole) => {
    if (userId === currentUser.id) return; // Block self-edit
    authService.updateUserRole(userId, newRole);
    loadUsers();
    showSuccess(`User role updated to "${newRole}" successfully.`);
  };

  const handleDeleteConfirm = (user) => {
    if (user.id === currentUser.id) return; // Block self-delete
    setDeleteConfirm(user);
  };

  const handleDelete = () => {
    if (!deleteConfirm) return;
    authService.deleteUser(deleteConfirm.id);
    loadUsers();
    setDeleteConfirm(null);
    showSuccess(`User "${deleteConfirm.name}" has been deleted.`);
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalAdmins = users.filter((u) => u.role === "admin").length;
  const totalCustomers = users.filter((u) => u.role === "customer").length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white">Users Management</h1>
        <p className="text-gray-400 text-sm mt-1">
          View all registered accounts, change roles, or remove users.
        </p>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Total Users */}
        <div className="bg-[#171B26] border border-[#5FE3CF]/20 rounded-2xl p-5 flex items-center gap-4 shadow-md">
          <div className="p-3 bg-[#5FE3CF]/10 rounded-xl">
            <Users2 size={24} className="text-[#5FE3CF]" />
          </div>
          <div>
            <p className="text-gray-400 text-xs font-semibold uppercase">Total Users</p>
            <h3 className="text-3xl font-black text-white mt-0.5">{users.length}</h3>
          </div>
        </div>

        {/* Total Admins */}
        <div className="bg-[#171B26] border border-[#F5A623]/20 rounded-2xl p-5 flex items-center gap-4 shadow-md">
          <div className="p-3 bg-[#F5A623]/10 rounded-xl">
            <Crown size={24} className="text-[#F5A623]" />
          </div>
          <div>
            <p className="text-gray-400 text-xs font-semibold uppercase">Admin Accounts</p>
            <h3 className="text-3xl font-black text-white mt-0.5">{totalAdmins}</h3>
          </div>
        </div>

        {/* Total Customers */}
        <div className="bg-[#171B26] border border-purple-400/20 rounded-2xl p-5 flex items-center gap-4 shadow-md">
          <div className="p-3 bg-purple-400/10 rounded-xl">
            <ShoppingBag size={24} className="text-purple-400" />
          </div>
          <div>
            <p className="text-gray-400 text-xs font-semibold uppercase">Customers</p>
            <h3 className="text-3xl font-black text-white mt-0.5">{totalCustomers}</h3>
          </div>
        </div>
      </div>

      {/* Success message */}
      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl text-sm flex items-center gap-2 animate-pulse max-w-2xl">
          <CheckCircle2 size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#171B26] max-w-sm w-full rounded-2xl border border-red-500/30 p-6 space-y-5 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400">
              <AlertCircle size={26} />
              <h3 className="text-lg font-bold">Confirm Delete User</h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Are you sure you want to permanently delete{" "}
              <strong className="text-white">{deleteConfirm.name}</strong> (
              {deleteConfirm.email})? This action cannot be undone.
            </p>
            <div className="flex gap-3 pt-1">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-700 text-gray-400 hover:text-white transition font-bold text-sm cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white hover:bg-red-600 transition font-bold text-sm cursor-pointer"
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="flex items-center gap-3 bg-[#171B26] p-3 rounded-2xl border border-gray-800 shadow-md max-w-md">
        <Search className="text-gray-500 ml-2 flex-shrink-0" size={18} />
        <input
          type="text"
          placeholder="Search by name, email or role..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-transparent text-white outline-none w-full text-sm placeholder-gray-500"
        />
      </div>

      {/* Users Table */}
      <div className="bg-[#171B26] border border-gray-800 rounded-3xl overflow-hidden shadow-md">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-16 text-gray-500 text-sm">
            No users found matching your search.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/5 text-xs text-gray-500 font-bold uppercase bg-[#1c2230]">
                  <th className="p-4 pl-6">User</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Current Role</th>
                  <th className="p-4">Change Role</th>
                  <th className="p-4 pr-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredUsers.map((u) => {
                  const isSelf = u.id === currentUser.id;
                  const isAdmin = u.role === "admin";

                  return (
                    <tr
                      key={u.id}
                      className={`text-gray-300 transition duration-150 ${
                        isSelf ? "bg-[#F5A623]/5" : "hover:bg-[#1a1f2c]"
                      }`}
                    >
                      {/* User Avatar + Name */}
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-sm flex-shrink-0 ${
                              isAdmin
                                ? "bg-[#F5A623] text-black"
                                : "bg-[#5FE3CF]/20 text-[#5FE3CF] border border-[#5FE3CF]/30"
                            }`}
                          >
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-white flex items-center gap-1.5">
                              {u.name}
                              {isSelf && (
                                <span className="text-[9px] bg-[#F5A623]/20 border border-[#F5A623]/30 text-[#F5A623] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                                  You
                                </span>
                              )}
                            </p>
                            <p className="text-gray-500 text-xs">ID: #{u.id}</p>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="p-4 text-gray-400 text-xs max-w-[180px] truncate">
                        {u.email}
                      </td>

                      {/* Current Role Badge */}
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase px-2.5 py-1 rounded-full border ${
                            isAdmin
                              ? "bg-[#F5A623]/10 border-[#F5A623]/30 text-[#F5A623]"
                              : "bg-[#5FE3CF]/10 border-[#5FE3CF]/30 text-[#5FE3CF]"
                          }`}
                        >
                          {isAdmin ? (
                            <Crown size={11} />
                          ) : (
                            <User size={11} />
                          )}
                          {u.role}
                        </span>
                      </td>

                      {/* Role Change Dropdown */}
                      <td className="p-4">
                        {isSelf ? (
                          <span className="text-gray-600 text-xs italic">Cannot edit yourself</span>
                        ) : (
                          <select
                            value={u.role}
                            onChange={(e) => handleRoleChange(u.id, e.target.value)}
                            className="bg-[#0F1117] border border-gray-700 text-white text-xs font-semibold px-3 py-2 rounded-xl outline-none cursor-pointer hover:border-[#F5A623] transition"
                          >
                            <option value="customer">Customer</option>
                            <option value="admin">Admin</option>
                          </select>
                        )}
                      </td>

                      {/* Delete Action */}
                      <td className="p-4 pr-6 text-right">
                        {isSelf ? (
                          <button
                            disabled
                            className="p-2.5 rounded-lg bg-gray-800/50 border border-gray-700/50 text-gray-600 cursor-not-allowed"
                            title="Cannot delete yourself"
                          >
                            <Trash2 size={14} />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleDeleteConfirm(u)}
                            className="p-2.5 rounded-lg bg-red-500/5 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition cursor-pointer"
                            title="Delete User"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
