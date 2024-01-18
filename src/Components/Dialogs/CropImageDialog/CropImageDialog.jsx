import React, { useRef } from 'react';
import '../Dialog.css';
import './CropImageDialog.css';

import ConfirmationDialog from '../ConfirmationDialog/ConfirmationDialog.jsx';

function CropImageDialog({ referrer, image, setImage }) {
  const confirmCropDialog = useRef(null);
  const cancelCropDialog = useRef(null);
  return (
    <dialog className='dialog crop-dialog' ref={referrer}>
      hello
      <ConfirmationDialog
        referrer={cancelCropDialog}
        title='Cancel crop?'
        message='All progress made will be lost.'
      />
      <ConfirmationDialog
        referrer={cancelCropDialog}
        title='Confirm crop?'
        message='This will overwrite the current image.'
      />
    </dialog>
  )
}

export default CropImageDialog;