import React, { useEffect, useState } from "react";
import { useAppContext, Role } from "../controllers/AppContext";
import { Shield, Users } from "lucide-react";
import { ApiService } from "../services/api";

export default function RoleSwitcher() {
  const { role } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Only render for manager
  if (role !== "manager") return null;

  const loadUsers = async () => {
    setLoading(true);
    try {
      const fetchedUsers = await ApiService.getAllUsers();
      setUsers(fetchedUsers);
    } catch (e) {
      console.error("Failed to load users", e);
    }
    setLoading(false);
  };

  const toggleModal = () => {
    if (!isOpen) {
      loadUsers();
    }
    setIsOpen(!isOpen);
  };

  const handleRoleChange = async (uid: string, newRole: string) => {
    try {
      await ApiService.updateUserRole(uid, newRole);
      setUsers(users.map(u => u.id === uid ? { ...u, role: newRole } : u));
    } catch (e) {
      alert("Failed to update role");
    }
  };

  return (
    <>
      <button 
        onClick={toggleModal}
        className="fixed bottom-4 right-4 bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition-colors z-50 flex items-center justify-center"
        title="Manager Dashboard"
      >
        <Shield className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[80vh]">
            <div className="p-4 border-b flex items-center justify-between bg-gray-50">
              <h3 className="font-semibold flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-600" />
                User Management
              </h3>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-black">
                &times;
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto flex-1">
              {loading ? (
                <div className="text-center text-sm text-gray-500 py-4">Loading users...</div>
              ) : users.length === 0 ? (
                <div className="text-center text-sm text-gray-500 py-4">No users found.</div>
              ) : (
                <div className="space-y-3">
                  {users.map(u => (
                    <div key={u.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                      <div>
                        <p className="font-medium text-sm">{u.name || "Unknown"}</p>
                        <p className="text-xs text-gray-500">{u.email || u.id}</p>
                      </div>
                      <select 
                        value={u.role || "member"}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className="text-sm border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 py-1"
                      >
                        <option value="guest">Guest</option>
                        <option value="member">Member</option>
                        <option value="admin">Admin</option>
                        <option value="manager">Manager</option>
                      </select>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
