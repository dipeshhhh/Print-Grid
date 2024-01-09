import React, { useRef } from 'react';
import './ConfirmationDialog.css';

function ConfirmationDialog({ referrer, title, message, onConfirm, onClose }) {
  const closeDialog = onClose ? onClose : () => {
    referrer.current.close();
  }
  return (
    <dialog className="confirmation-dialog" ref={referrer}>
      <form method='dialog'>
        <div className='dialog-text'>
          <h5>{title}</h5>
          <p>{message}</p>
        </div>
        <div className='dialog-buttons'>
          <button className='dialog-button cancel-button' onClick={onClose} autofocus>Cancel</button>
          <button className='dialog-button confirm-button' onClick={onConfirm}>Confirm</button>
        </div>
      </form>
    </dialog> 
  )
}

export default ConfirmationDialog;