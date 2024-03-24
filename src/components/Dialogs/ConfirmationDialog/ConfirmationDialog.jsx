import React from 'react';
import '../Dialog.css';
import './ConfirmationDialog.css';

function ConfirmationDialog({
  referrer,
  title,
  message,
  cancelButtonText = 'Cancel',
  confirmButtonText = 'Confirm',
  onConfirm = () => { referrer.current.close() },
  onClose = () => { referrer.current.close() }
}) {
  return (
    <dialog className="dialog confirmation-dialog" ref={referrer}>
      <form method='dialog'>
        <div className='dialog-text'>
          <h5 className='dialog-title'>{title}</h5>
          <p className='dialog-message'>{message}</p>
        </div>
        <div className='dialog-buttons'>
          <button className='dialog-button cancel-button' onClick={onClose} autoFocus>{cancelButtonText}</button>
          <button className='dialog-button confirm-button' onClick={onConfirm}>{confirmButtonText}</button>
        </div>
      </form>
    </dialog>
  )
}

// ConfirmationDialog.propTypes = {
//   referrer: PropTypes.object.isRequired,
//   title: PropTypes.string.isRequired,
//   message: PropTypes.string.isRequired,
//   cancelButtonText: PropTypes.string,
//   confirmButtonText: PropTypes.string,
//   onConfirm: PropTypes.func,
//   onClose: PropTypes.func
// }

export default ConfirmationDialog;