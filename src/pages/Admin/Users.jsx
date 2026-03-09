import { useEffect, useState } from "react";
import api from "../../api/api";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/admin/users");
        setUsers(res.data);
      } catch (err) {
        console.error("Error fetching users:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const deleteUser = async (userId) => {
    if (!window.confirm("Kyan aap is user ko delete karna chahte hain?")) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers(users.filter(u => u.user_id !== userId));
    } catch (err) {
      alert("Failed to delete user");
    }
  };

  if (loading) return <p>Loading users...</p>;

  return (
    <div className="admin-page">
      <h2>All Users</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map(u => (
              <tr key={u.user_id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>
                  <button className="delete-btn" onClick={() => deleteUser(u.user_id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No users found in database.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}