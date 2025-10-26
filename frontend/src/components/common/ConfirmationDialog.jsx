import React from 'react';
import './Dialog.css';

const ConfirmationDialog = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'danger'
}) => {
    if (!isOpen) return null;

    return (
        <div className="dialog-overlay">
            <div className="dialog-content">
                <h3>{title}</h3>
                <p>{message}</p>
                <div className="dialog-actions">
                    <button
                        onClick={onClose}
                        className="dialog-button cancel-button"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`dialog-button confirm-button ${variant}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationDialog;
