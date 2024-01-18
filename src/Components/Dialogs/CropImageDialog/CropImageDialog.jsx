import React, { useRef } from 'react';
import '../Dialog.css';
import './CropImageDialog.css';

import ConfirmationDialog from '../ConfirmationDialog/ConfirmationDialog.jsx';

function CropImageDialog({ referrer, image, setImage }) {
  const confirmCropDialogRef = useRef(null);
  const cancelCropDialogRef = useRef(null);
  function confirmCropOnConfirm() { referrer.current.close() }
  function confirmCropOnClose() { confirmCropDialogRef.current.close() }
  function cancelCropOnConfirm() { referrer.current.close() }
  function cancelCropOnClose() { cancelCropDialogRef.current.close() }
  return (
    <dialog className='dialog crop-dialog' ref={referrer}>
      <div className='dialog-buttons'>
        <button className='dialog-button cancel-button' onClick={() => { cancelCropDialogRef.current.showModal() }} autoFocus>
          Cancel
        </button>
        <button className='dialog-button confirm-button' onClick={() => { confirmCropDialogRef.current.showModal() }}>
          Confirm
        </button>
      </div>
      <ConfirmationDialog
        referrer={cancelCropDialogRef}
        title='Cancel crop?'
        message='All progress made will be lost.'
        onConfirm={cancelCropOnConfirm}
        onClose={cancelCropOnClose}
        cancelButtonText="Don't cancel"
        confirmButtonText='Cancel'
      />
      <ConfirmationDialog
        referrer={confirmCropDialogRef}
        title='Confirm crop?'
        message='This will overwrite the current image.'
        onConfirm={confirmCropOnConfirm}
        onClose={confirmCropOnClose}
      />
    </dialog>
  )
}

export default CropImageDialog;