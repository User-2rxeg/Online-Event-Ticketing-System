import React, { useState } from 'react';
import UpdateUserRoleModal from './UpdateUserRoleModal';
import ConfirmationDialog from '../common/ConfirmationDialog';

const UserRow = ({ user, onUpdateRole, onDelete }) => {
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const handleRoleUpdate = (newRole) => {
        onUpdateRole(user._id, newRole);
        setShowRoleModal(false);
    };

    const handleDelete = () => {
        onDelete(user._id);
        setShowDeleteDialog(false);
    };

    return (
        <>
            <tr>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                    <span className={`role-badge ${user.role.toLowerCase()}`}>
                        {user.role}
                    </span>
                </td>
                <td className="action-buttons">
                    <button
                        onClick={() => setShowRoleModal(true)}
                        className="edit-role-btn"
                    >
                        Update Role
                    </button>
                    <button
                        onClick={() => setShowDeleteDialog(true)}
                        className="delete-btn"
                    >
                        Delete
                    </button>
                </td>
            </tr>

            <UpdateUserRoleModal
                isOpen={showRoleModal}
                onClose={() => setShowRoleModal(false)}
                onUpdate={handleRoleUpdate}
                currentRole={user.role}
                userName={user.name}
            />

            <ConfirmationDialog
                isOpen={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                onConfirm={handleDelete}
                title="Delete User"
                message={`Are you sure you want to delete user ${user.name}? This action cannot be undone.`}
                confirmText="Delete"
                variant="danger"
            />
        </>
    );
};

export default UserRow;
