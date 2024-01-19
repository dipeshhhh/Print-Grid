import React, { useRef } from 'react';
import '../Dialog.css';
import './CropImageDialog.css';

import ConfirmationDialog from '../ConfirmationDialog/ConfirmationDialog.jsx';

function CropImageDialog({ referrer, image, setImage }) {
  const cropImageRef = useRef(null);
  const cropImageParentRef = useRef(null);
  const canvasRef = useRef(null);
  const confirmCropDialogRef = useRef(null);
  const cancelCropDialogRef = useRef(null);
  function confirmCropOnConfirm() { referrer.current.close() }
  function confirmCropOnClose() { confirmCropDialogRef.current.close() }
  function cancelCropOnConfirm() { referrer.current.close() }
  function cancelCropOnClose() { cancelCropDialogRef.current.close() }

  const cropImage = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const newImage = new Image();
    newImage.src = image.imageUrl;
  }

  // Dragging the image
  let deviceType = '';
  let initialX = 0, initialY = 0;
  const events = {
    mouse: {
      down: 'mousedown',
      move: 'mousemove',
      up: 'mouseup',
      out: 'mouseout'
    },
    touch: {
      down: 'touchstart',
      move: 'touchmove',
      up: 'touchend',
      out: 'touchcancel'
    }
  }
  const isTouchDevice = () => {
    try {
      document.createEvent('TouchEvent');
      deviceType = 'touch';
      return true;
    }
    catch (e) {
      deviceType = 'mouse';
      return false;
    }
  }
  isTouchDevice();
  const onDragCropImage = (e) => {
    e.preventDefault();
    const newX = !isTouchDevice() ? e.clientX : e.touches[0].clientX;
    const newY = !isTouchDevice() ? e.clientY : e.touches[0].clientY;
    const newPosX = cropImageRef.current.offsetLeft - (initialX - newX);
    const newPosY = cropImageRef.current.offsetTop - (initialY - newY);
    if (Math.abs(newPosY) < parseInt(cropImageRef.current.height) - 50) {
      cropImageRef.current.style.top = `${newPosY}px`;
    }
    if (Math.abs(newPosX) < parseInt(cropImageRef.current.width) - 50) {
      cropImageRef.current.style.left = `${newPosX}px`;
    }
    initialX = newX;
    initialY = newY;
  }
  const removeDragEventListeners = () => {
    window.removeEventListener(events[deviceType].move, onDragCropImage);
    window.removeEventListener(events[deviceType].up, removeDragEventListeners);
  }
  if (cropImageRef.current) {
    cropImageRef.current.addEventListener(events[deviceType].down, (e) => {
      e.preventDefault();
      initialX = !isTouchDevice() ? e.clientX : e.touches[0].clientX;
      initialY = !isTouchDevice() ? e.clientY : e.touches[0].clientY;
      // Adding event listeners to the window so that the user can drag the image even if the mouse is not over the image
      window.addEventListener(events[deviceType].move, onDragCropImage);
      // Removing event listeners when the user stops dragging the image
      window.addEventListener(events[deviceType].up, removeDragEventListeners);
    });
    // cropImageRef.current.addEventListener(events[deviceType].) // Will do later
  }

  return (
    <dialog className='dialog crop-dialog' ref={referrer}>
      <div className='crop-dialog-body'>
        <div className='crop-image-container' ref={cropImageParentRef}>
          {image.imageUrl && <img ref={cropImageRef} className='crop-image-preview' src={image.imageUrl} alt='Image to be Cropped' draggable={false} />}
        </div>
      </div>
      <div className='dialog-buttons crop-dialog-buttons'>
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