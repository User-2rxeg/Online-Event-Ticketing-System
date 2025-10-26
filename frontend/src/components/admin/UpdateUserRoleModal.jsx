import React, { useState } from 'react';
import './Dialog.css';

const UpdateUserRoleModal = ({ isOpen, onClose, onUpdate, currentRole, userName }) => {
    const [selectedRole, setSelectedRole] = useState(currentRole);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onUpdate(selectedRole);
    };

    return (
        <div className="dialog-overlay">
            <div className="dialog-content">
                <h3>Update User Role</h3>
                <p>Change role for user: {userName}</p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="role">Select Role</label>
                        <select
                            id="role"
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            className="role-select"
                        >
                            <option value="user">Standard User</option>
                            <option value="organizer">Event Organizer</option>
                            <option value="admin">Administrator</option>
                        </select>
                    </div>

                    <div className="dialog-actions">
                        <button
                            type="button"
                            onClick={onClose}
                            className="dialog-button cancel-button"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="dialog-button confirm-button primary"
                        >
                            Update Role
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateUserRoleModal;
