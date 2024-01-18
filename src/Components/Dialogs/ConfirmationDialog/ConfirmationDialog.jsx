import React from 'react';
import '../Dialog.css';
import './ConfirmationDialog.css';

function ConfirmationDialog({ referrer, title, message, cancelButtonText, confirmButtonText, onConfirm, onClose }) {
  const closeDialog = onClose ? onClose : () => { referrer.current.close() }
  const confirmDialog = onConfirm ? onConfirm : () => { referrer.current.close() }
  const cancelBtnText = cancelButtonText ? cancelButtonText : 'Cancel';
  const confirmBtnText = confirmButtonText ? confirmButtonText : 'Confirm';
  return (
    <dialog className="dialog confirmation-dialog" ref={referrer}>
      <form method='dialog'>
        <div className='dialog-text'>
          <h5 className='dialog-title'>{title}</h5>
          <p className='dialog-message'>{message}</p>
        </div>
        <div className='dialog-buttons'>
          <button className='dialog-button cancel-button' onClick={closeDialog} autoFocus>{cancelBtnText}</button>
          <button className='dialog-button confirm-button' onClick={confirmDialog}>{confirmBtnText}</button>
        </div>
      </form>
    </dialog>
  )
}

export default ConfirmationDialog;