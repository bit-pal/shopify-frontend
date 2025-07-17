import React, { useState, useEffect } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useAuth } from '../context/AuthContext';
import './UserManagement.css';

const UserManagement = () => {
  const { user, fetchUsers, updateUser, deleteUser, resetUserPassword } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    type: '',
    message: ''
  });

  useEffect(() => {
    const getUsers = async () => {
      try {
        const users = await fetchUsers();
        setUsers(users);
        setError('');
      } catch (err) {
        setError('Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };
    getUsers();
  }, [fetchUsers]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUser(userId, { role: newRole });
      setUsers(users.map(user => 
        user._id === userId ? { ...user, role: newRole } : user
      ));
      setSuccess('User role updated successfully');
    } catch (err) {
      setError('Failed to update user role');
    }
  };

  const handleResetPassword = async (userId) => {
    try {
      await resetUserPassword(userId);
      setSuccess('Password reset successfully');
    } catch (err) {
      setError('Failed to reset password');
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await deleteUser(userId);
      setUsers(users.filter(user => user._id !== userId));
      setSuccess('User deleted successfully');
    } catch (err) {
      setError('Failed to delete user');
    }
  };

  const openConfirmDialog = (user, type) => {
    setSelectedUser(user);
    setConfirmDialog({
      open: true,
      type,
      message: type === 'delete' 
        ? `Are you sure you want to delete ${user.firstName} ${user.lastName}?`
        : `Are you sure you want to reset ${user.firstName} ${user.lastName}'s password?`
    });
  };

  const handleConfirmAction = () => {
    if (confirmDialog.type === 'delete') {
      handleDeleteUser(selectedUser._id);
    } else if (confirmDialog.type === 'reset') {
      handleResetPassword(selectedUser._id);
    }
    setConfirmDialog({ ...confirmDialog, open: false });
  };

  if (loading) {
    return <div className="user-management-container">Loading...</div>;
  }

  return (
    <div className="user-management-container">
      <h1 className="user-management-title">User Management</h1>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}
      {success && (
        <div className="alert alert-success">
          {success}
        </div>
      )}

      <div className="table-container">
        <table className="user-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>State</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{`${user.firstName} ${user.lastName}`}</td>
                <td>{user.email}</td>
                <td>
                  <select
                    className="role-select"
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                  >
                    <option value="patient">Patient</option>
                    <option value="doctor">Doctor</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td>{user.state}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="icon-button primary"
                      onClick={() => openConfirmDialog(user, 'reset')}
                    >
                      <RefreshIcon />
                    </button>
                    <button
                      className="icon-button error"
                      onClick={() => openConfirmDialog(user, 'delete')}
                    >
                      <DeleteIcon />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {confirmDialog.open && (
        <div className="dialog">
          <div className="dialog-content">
            <h2 className="dialog-title">Confirm Action</h2>
            <p className="dialog-message">{confirmDialog.message}</p>
            <div className="dialog-actions">
              <button
                className="dialog-button cancel"
                onClick={() => setConfirmDialog({ ...confirmDialog, open: false })}
              >
                Cancel
              </button>
              <button
                className="dialog-button confirm"
                onClick={handleConfirmAction}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement; 