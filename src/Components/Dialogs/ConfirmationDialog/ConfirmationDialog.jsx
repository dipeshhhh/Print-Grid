import React from 'react';
import '../Dialog.css';
import './ConfirmationDialog.css';

function ConfirmationDialog({ referrer, title, message, onConfirm, onClose }) {
  const closeDialog = onClose ? onClose : () => { referrer.current.close() }
  return (
    <dialog className="dialog confirmation-dialog" ref={referrer}>
      <form method='dialog'>
        <div className='dialog-text'>
          <h5 className='dialog-title'>{title}</h5>
          <p className='dialog-message'>{message}</p>
        </div>
        <div className='dialog-buttons'>
          <button className='dialog-button cancel-button' onClick={closeDialog} autoFocus>Cancel</button>
          <button className='dialog-button confirm-button' onClick={onConfirm}>Confirm</button>
        </div>
      </form>
    </dialog>
  )
}

export default ConfirmationDialog;