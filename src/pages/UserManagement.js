import React, { useState, useEffect } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import SyncIcon from '@mui/icons-material/Sync';
import { useAuth } from '../context/AuthContext';
import './UserManagement.css';

const UserManagement = () => {
  const { user, fetchUsers, updateUser, deleteUser, resetUserPassword } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showTebraData, setShowTebraData] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    type: '',
    message: ''
  });

  // Check if mock flag is enabled
  const useMockTebra = process.env.REACT_APP_USE_TEBRA_MOCK === 'true';

  useEffect(() => {
    const getUsers = async () => {
      try {
        const users = await fetchUsers();
        
        // If mock flag is enabled, fetch Tebra data for each user
        if (useMockTebra) {
          const usersWithTebra = await Promise.all(
            users.map(async (user) => {
              try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${process.env.REACT_APP_BASE_URL}/tebra/users/${user._id}`, {
                  headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                  }
                });
                
                if (response.ok) {
                  const tebraData = await response.json();
                  return {
                    ...user,
                    tebraData: tebraData.tebraData
                  };
                } else {
                  return {
                    ...user,
                    tebraData: null
                  };
                }
              } catch (error) {
                console.log(`No Tebra data for user ${user._id}:`, error.message);
                return {
                  ...user,
                  tebraData: null
                };
              }
            })
          );
          setUsers(usersWithTebra);
        } else {
          setUsers(users);
        }
        
        setError('');
      } catch (err) {
        setError('Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };
    getUsers();
  }, [fetchUsers, useMockTebra]);

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

  const handleSyncToTebra = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/tebra/users/${userId}/sync`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        setUsers(users.map(user => 
          user._id === userId 
            ? { 
                ...user, 
                tebraData: result.tebraData,
                tebraPatientId: result.tebraId,
                tebraSyncStatus: 'synced'
              } 
            : user
        ));
        setSuccess('User synced to Tebra successfully');
      } else {
        setError('Failed to sync user to Tebra');
      }
    } catch (err) {
      setError('Failed to sync user to Tebra');
    }
  };

  const openConfirmDialog = (user, type) => {
    setSelectedUser(user);
    setConfirmDialog({
      open: true,
      type,
      message: type === 'delete' 
        ? `Are you sure you want to delete ${user.firstName} ${user.lastName}?`
        : type === 'reset'
        ? `Are you sure you want to reset ${user.firstName} ${user.lastName}'s password?`
        : `Are you sure you want to sync ${user.firstName} ${user.lastName} to Tebra?`
    });
  };

  const handleConfirmAction = () => {
    if (confirmDialog.type === 'delete') {
      handleDeleteUser(selectedUser._id);
    } else if (confirmDialog.type === 'reset') {
      handleResetPassword(selectedUser._id);
    } else if (confirmDialog.type === 'sync') {
      handleSyncToTebra(selectedUser._id);
    }
    setConfirmDialog({ ...confirmDialog, open: false });
  };

  if (loading) {
    return <div className="user-management-container">Loading...</div>;
  }

  return (
    <div className="user-management-container">
      <h1 className="user-management-title">User Management</h1>

      {/* Mock Tebra Toggle */}
      {useMockTebra && (
        <div className="tebra-toggle">
          <button 
            className="toggle-button"
            onClick={() => setShowTebraData(!showTebraData)}
          >
            {showTebraData ? 'Hide' : 'Show'} Tebra Data (Mock)
          </button>
        </div>
      )}

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
              {showTebraData && useMockTebra && <th>Tebra ID</th>}
              {showTebraData && useMockTebra && <th>Tebra Status</th>}
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
                {showTebraData && useMockTebra && (
                  <td>
                    {user.tebraData?.id || user.tebraPatientId || 'Not synced'}
                  </td>
                )}
                {showTebraData && useMockTebra && (
                  <td>
                    <span className={`status-badge ${user.tebraData || user.tebraPatientId ? 'synced' : 'not-synced'}`}>
                      {user.tebraData || user.tebraPatientId ? 'Synced' : 'Not Synced'}
                    </span>
                  </td>
                )}
                <td>
                  <div className="action-buttons">
                    {useMockTebra && !user.tebraData && !user.tebraPatientId && (
                      <button
                        className="icon-button sync"
                        onClick={() => openConfirmDialog(user, 'sync')}
                        title="Sync to Tebra"
                      >
                        <SyncIcon />
                      </button>
                    )}
                    <button
                      className="icon-button primary"
                      onClick={() => openConfirmDialog(user, 'reset')}
                      title="Reset Password"
                    >
                      <RefreshIcon />
                    </button>
                    <button
                      className="icon-button error"
                      onClick={() => openConfirmDialog(user, 'delete')}
                      title="Delete User"
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