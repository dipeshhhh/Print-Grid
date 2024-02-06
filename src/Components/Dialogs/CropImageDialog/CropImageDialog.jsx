import React, { useState, useRef, useEffect } from 'react';
import '../Dialog.css';
import './CropImageDialog.css';

import ConfirmationDialog from '../ConfirmationDialog/ConfirmationDialog.jsx';

function CropImageDialog({ referrer, image, setImage }) {
  // ========== DOM references ==========
  // References to the image and canvas elements
  const cropImageRef = useRef(null);
  const cropImageParentRef = useRef(null);
  const canvasRef = useRef(null);
  const confirmCropDialogRef = useRef(null);
  const cancelCropDialogRef = useRef(null);
  // ====================================

  // ========== Crop Cancel/Confirm ==========
  // Functions to handle the cancel and confirm buttons
  function confirmCropOnConfirm() { referrer.current.close() }
  function confirmCropOnClose() { confirmCropDialogRef.current.close() }
  function cancelCropOnConfirm() { referrer.current.close() }
  function cancelCropOnClose() { cancelCropDialogRef.current.close() }
  // =========================================

  // ========== Crop Image ==========
  // Function to crop the image
  const cropImage = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const newImage = new Image();
    newImage.src = image.imageUrl;
  }
  // ================================

  // ========== Initial Values ==========
  let initialX = 0, initialY = 0; // Initial values for the pointer position

  // ========== Drag Image ==========
  const onDragCropImage = (e) => {
    e.preventDefault();
    if (!e.isPrimary) return;
    const checkBounds = (newValue, parentDimension, selfDimension) => {
      // Checking if the new value is within the bounds of the parent element
      // Bounds behave differently for positive and negative values
      return (newValue > 0 && newValue < parentDimension - 50) ||
        (newValue < 0 && Math.abs(newValue) < selfDimension - 50);
    };
    const newX = e.clientX;
    const newY = e.clientY;
    const newPosX = cropImageRef.current.offsetLeft - (initialX - newX);
    const newPosY = cropImageRef.current.offsetTop - (initialY - newY);
    if (checkBounds(newPosY, parseInt(cropImageParentRef.current.clientHeight), parseInt(cropImageRef.current.height))) {
      cropImageRef.current.style.top = `${newPosY}px`;
    }
    if (checkBounds(newPosX, parseInt(cropImageParentRef.current.clientWidth), parseInt(cropImageRef.current.width))) {
      cropImageRef.current.style.left = `${newPosX}px`;
    }
    initialX = newX;
    initialY = newY;
  }
  // ================================

  // ========== Zoom Image ==========
  const onScrollZoomCropImage = (e) => {
    e.preventDefault();
    const newWidth = cropImageRef.current.width + (-e.deltaY * 0.2);
    const newHeight = (cropImageRef.current.height / cropImageRef.current.width) * newWidth;
    // const newHeight = originalImageAspectRatio * newWidth;
    if (newWidth > 50 && newHeight > 50) {
      cropImageRef.current.style.width = `${newWidth}px`;
      cropImageRef.current.style.height = `${newHeight}px`;
    }
  }

  const removeDragEventListeners = () => {
    // pointersArray.length = 0;
    // initialDistance = 0;
    // window.removeEventListener('pointermove', onPinchZoomCropImage);
    window.removeEventListener('pointermove', onDragCropImage);
    window.removeEventListener('pointerup', removeDragEventListeners);
  }

  if (cropImageRef.current) {
    cropImageRef.current.addEventListener('pointerdown', (e) => {
      e.preventDefault();

      initialX = e.clientX;
      initialY = e.clientY;

      // Adding event listeners to the window so that the user can drag/zoom the image even if the mouse is not over the image
      window.addEventListener('pointermove', onDragCropImage);
      // Removing event listeners when the user stops dragging the image
      window.addEventListener('pointerup', removeDragEventListeners);
    });


    cropImageRef.current.addEventListener('pointerenter', () => {
      // Adding event listener to the image so that the user can zoom in and out
      cropImageRef.current.addEventListener('wheel', onScrollZoomCropImage);

      // Removing event listener when the pointer leaves the image
      cropImageRef.current.addEventListener('pointerleave', () => {
        cropImageRef.current.removeEventListener('wheel', onScrollZoomCropImage);
      });
    });
  }
  // ====================================

  return (
    <dialog className='dialog crop-dialog' ref={referrer}>
      <div className='crop-dialog-body'>
        <div className='crop-image-container' ref={cropImageParentRef}>
          {image.imageUrl &&
            <img
              ref={cropImageRef}
              className='crop-image-preview'
              src={image.imageUrl}
              alt='Image to be Cropped'
              draggable={false}
              style={{
                transform: `
                  rotate(${image.rotate}deg)
                  scale(${image.verticalScale}, ${image.horizontalScale})
                `,
                filter: `
                  brightness(${image.brightness}%)
                  contrast(${image.contrast}%)
                  saturate(${image.saturate}%)
                  grayscale(${image.grayscale})
                  sepia(${image.sepia}%)
                  hue-rotate(${image.hueRotate}deg)
                `,
              }}
              width='auto'
              height='100%'
            />}
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