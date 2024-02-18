import React, { useState, useRef, useEffect } from 'react';
import '../Dialog.css';
import './CropImageDialog.css';

import ConfirmationDialog from '../ConfirmationDialog/ConfirmationDialog.jsx';
import { IceSkating } from '@mui/icons-material';

function CropImageDialog({ referrer, image, setImage, selectedImageSize, setSelectedImageSize, setIsUserCropping, isUserCropping }) {
  // ========== DOM references ==========
  // References to the image and canvas elements
  const cropImageRef = useRef(null);
  const cropImageContainerRef = useRef(null);
  const cropperRef = useRef(null);
  const canvasRef = useRef(null);
  const confirmCropDialogRef = useRef(null);
  const cancelCropDialogRef = useRef(null);
  // ====================================

  // ========== Constants/Variables and Initial Values ==========
  const isWindowHorizontal = (window.innerWidth / window.innerHeight) > 1;
  const dialogPadding = Number.parseInt(getComputedStyle(document.body).getPropertyValue('--dialog-padding').slice(0, -2));
  let initialPointerPositionX = 0, initialPointerPositionY = 0; // Initial values for the pointer position
  let isUserResizingCropper = false; // Variable to check if the user is resizing the cropper
  // ============================================

  // ========== Crop Cancel/Confirm ==========
  // Functions to handle the cancel and confirm buttons
  function confirmCropOnConfirm() { referrer.current.close(); setIsUserCropping(false); }
  function confirmCropOnClose() { confirmCropDialogRef.current.close() }
  function cancelCropOnConfirm() { referrer.current.close(); setIsUserCropping(false); }
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

  // ========== Drag Image ==========
  const onDragCropImage = (e) => {
    // Known bug: There is 2-3px gap inside between the cropper and the image on top-left sides, and outside on the bottom-right sides
    e.preventDefault();
    if (!e.isPrimary) return;
    const checkBounds = (newValue, parentDimension, selfDimension, anchoredElementOffset, anchoredElementClientDimension) => {
      // Checking if the new value is within the bounds of the parent element
      // Bounds behave differently for positive and negative values
      return (
        ((newValue > 0 && newValue < parentDimension - 50) || (newValue < 0 && Math.abs(newValue) < selfDimension - 50))
        // Checking if the new value is within the bounds of the anchored element
        // i.e checking if cropimage is within the bounds of the cropper
        &&
        (newValue < anchoredElementOffset)
        &&
        (newValue > (anchoredElementOffset + anchoredElementClientDimension) - selfDimension)
      );
    };
    const currentPointerPositionX = e.clientX;
    const currentPointerPositionY = e.clientY;
    // Change
    const dx = -(initialPointerPositionX - currentPointerPositionX);
    const dy = -(initialPointerPositionY - currentPointerPositionY);
    // Moving relative to mouse position on image's top left corner
    // const newPosX = (currentPointerPositionX - (window.innerWidth - (referrer.current.clientWidth - (dialogPadding*2)))/2);
    // const newPosY = (currentPointerPositionY - (window.innerHeight - (referrer.current.clientHeight - (dialogPadding*2)))/2);
    // Moving relative to mouse position on image's center
    // const newPosX = (currentPointerPositionX - (window.innerWidth - (referrer.current.clientWidth - (dialogPadding*2)))/2) - (cropImageRef.current.width/2);
    // const newPosY = (currentPointerPositionY - (window.innerHeight - (referrer.current.clientHeight - (dialogPadding*2)))/2) - (cropImageRef.current.height/2);
    // Moving relative to mouse position anywhere on the image
    const newPosX = cropImageRef.current.offsetLeft + dx;
    const newPosY = cropImageRef.current.offsetTop + dy;
    if (checkBounds(
      newPosY,
      parseInt(cropImageContainerRef.current.clientHeight),
      parseInt(cropImageRef.current.height),
      cropperRef.current.offsetTop,
      cropperRef.current.clientHeight
    )) {
      cropImageRef.current.style.top = `${newPosY}px`;
    }
    if (checkBounds(
      newPosX,
      parseInt(cropImageContainerRef.current.clientWidth),
      parseInt(cropImageRef.current.width),
      cropperRef.current.offsetLeft,
      cropperRef.current.clientWidth
    )) {
      cropImageRef.current.style.left = `${newPosX}px`;
    }
    initialPointerPositionX = currentPointerPositionX; // Else it will add 1+2+3+4+5+6, with this it will add 1+1+1+1+1+1
    initialPointerPositionY = currentPointerPositionY;
  }
  const onDragCropper = (e) => {
    // Known bug: There is 2-3px gap inside between the cropper and the image on top-left sides, and outside on the bottom-right sides
    e.preventDefault();
    if (!e.isPrimary) return;
    const checkBounds = (newValue, parentDimension, selfClientDimension, anchoredElementDimension, anchoredElementOffset) => {
      return (
        ((newValue > 0 && newValue < parentDimension - selfClientDimension) || (newValue < 0 && Math.abs(newValue) < selfClientDimension - selfClientDimension))
        // Checking if the new value is within the bounds of the anchored element
        // i.e checking if cropper is within the bounds of the cropImage
        &&
        (newValue > anchoredElementOffset)
        &&
        (newValue < ((anchoredElementOffset + anchoredElementDimension) - selfClientDimension))
      );
    };
    const currentPointerPositionX = e.clientX;
    const currentPointerPositionY = e.clientY;
    const dx = -(initialPointerPositionX - currentPointerPositionX);
    const dy = -(initialPointerPositionY - currentPointerPositionY);
    const newPosX = cropperRef.current.offsetLeft + (dx);
    const newPosY = cropperRef.current.offsetTop + (dy);
    if (checkBounds(
      newPosX,
      parseInt(cropImageContainerRef.current.clientWidth),
      parseInt(cropperRef.current.clientWidth),
      cropImageRef.current.width,
      cropImageRef.current.offsetLeft
    )) {
      cropperRef.current.style.left = `${newPosX}px`;
    }
    if (checkBounds(
      newPosY,
      parseInt(cropImageContainerRef.current.clientHeight),
      parseInt(cropperRef.current.clientHeight),
      cropImageRef.current.height,
      cropImageRef.current.offsetTop
    )) {
      cropperRef.current.style.top = `${newPosY}px`;
    }
    initialPointerPositionX = currentPointerPositionX;
    initialPointerPositionY = currentPointerPositionY;
  }
  // ================================

  // ========== Cropper Resizing ==========

  // =====================================

  // ========== Zoom Image ==========
  const pointersArray = [];
  let initialDistance = 0;
  const originalImageAspectRatio = cropImageRef.current ? cropImageRef.current.width / cropImageRef.current.height : 'auto';

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

  const onPinchZoomCropImage = (e) => {
    e.preventDefault();
    const distance = Math.hypot(
      pointersArray[0].clientX - pointersArray[1].clientX,
      pointersArray[0].clientY - pointersArray[1].clientY
    );
    // console.log(distance, initialDistance)
    if (initialDistance === 0) {
      initialDistance = distance;
    }
    const newWidth = cropImageRef.current.width + (distance - initialDistance);
    const newHeight = (cropImageRef.current.height / cropImageRef.current.width) * newWidth;
    if (newWidth > 50 && newHeight > 50) {
      cropImageRef.current.style.width = `${newWidth}px`;
      cropImageRef.current.style.height = `${newHeight}px`;
    }
    initialDistance = distance;
  }
  // ====================================

  // ========== Remove Event Listeners ==========
  const removeDragEventListeners = () => {
    pointersArray.length = 0;
    initialDistance = 0;
    isUserResizingCropper = false;
    window.removeEventListener('pointermove', onPinchZoomCropImage);
    window.removeEventListener('pointermove', onDragCropImage);
    window.removeEventListener('pointermove', onDragCropper);
    window.removeEventListener('pointermove', onResizeCropper)

    window.removeEventListener('pointerup', removeDragEventListeners);
  }
  // ===========================================

  // ========== Event Listeners ==========
  useEffect(() => {
    if (cropImageRef.current) {
      cropImageRef.current.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        initialPointerPositionX = e.clientX;
        initialPointerPositionY = e.clientY;
        pointersArray.push(e);
        // Adding event listeners to the window so that the user can drag/zoom the image even if the mouse is not over the image
        if (pointersArray.length <= 1) window.addEventListener('pointermove', onDragCropImage);
        else if (pointersArray.length > 1) {
          window.removeEventListener('pointermove', onDragCropImage);
          window.addEventListener('pointermove', onPinchZoomCropImage);
        }
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
    if (cropperRef.current) {
      cropperRef.current.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        if (e.target.classList.contains('cropper-resizer')) isUserResizingCropper = true;

        initialPointerPositionX = e.clientX;
        initialPointerPositionY = e.clientY;

        // window.addEventListener('pointermove', onDragCropper);
        if (!isUserResizingCropper) window.addEventListener('pointermove', onDragCropper);
        else window.addEventListener('pointermove', onResizeCropper);

        window.addEventListener('pointerup', removeDragEventListeners);
      })
    }
  }, [isUserCropping]);


  const onResizeCropper = (e) => {
    e.preventDefault();
    if (!e.isPrimary) return;

    const isImageHorizontal = (cropImageRef.current.clientWidth / cropImageRef.current.clientHeight) > (selectedImageSize.width / selectedImageSize.height);
    const checkBounds = () => {

    }

    const currentPointerPositionX = e.clientX;
    const currentPointerPositionY = e.clientY;
    const dx = -(initialPointerPositionX - currentPointerPositionX);
    const dy = -(initialPointerPositionY - currentPointerPositionY);
    // const hypothenuse = Math.hypot(dx, dy);

    //! Work In Progress
    if (e.target.classList.contains('se')) {
      if (isImageHorizontal) {

      }
    }
    initialPointerPositionX = currentPointerPositionX;
    initialPointerPositionY = currentPointerPositionY;
  }
  // ====================================

  return (
    <dialog className='dialog crop-dialog' ref={referrer}>
      <div className='crop-dialog-body'>
        <div className='crop-image-container' ref={cropImageContainerRef}>
          {(isUserCropping && image.imageUrl) &&
            <>
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
                width={(cropImageContainerRef.current.clientWidth / cropImageContainerRef.current.clientHeight) > (image.naturalWidth / image.naturalHeight) ? 'auto' : '100%'}
                height={(cropImageContainerRef.current.clientWidth / cropImageContainerRef.current.clientHeight) > (image.naturalWidth / image.naturalHeight) ? '100%' : 'auto'}
              />
              {/* {cropImageRef.current && */}
              <div
                ref={cropperRef}
                draggable={false}
                className='cropper'
                style={{
                  aspectRatio: `${selectedImageSize.width} / ${selectedImageSize.height}`,
                  // height: (cropImageRef.current.clientWidth / cropImageRef.current.clientHeight) > (selectedImageSize.width / selectedImageSize.height) ? `${cropImageRef.current.height}px` : 'auto',
                  // width: (cropImageRef.current.clientWidth / cropImageRef.current.clientHeight) > (selectedImageSize.width / selectedImageSize.height) ? 'auto' : `${cropImageRef.current.width}px`,
                  height: '50px',
                  width: '50px',
                }}
              >
                <div className='cropper-resizer ne' />
                <div className='cropper-resizer nw' />
                <div className='cropper-resizer se' />
                <div className='cropper-resizer sw' />
              </div>
              {/* } */}
            </>
          }
          {/* {cropImageRef.current &&
            <div
              ref={cropperRef}
              draggable={false}
              className='cropper'
              style={{
                height: isWindowHorizontal ? '50px' : 'auto',
                width: isWindowHorizontal ? 'auto' : '50px',
                aspectRatio: `${selectedImageSize.width} / ${selectedImageSize.height}`,
              }}
            >
              <div className='ne cropper-resizer' />
              <div className='nw cropper-resizer' />
              <div className='se cropper-resizer' />
              <div className='sw cropper-resizer' />
            </div>
          } */}
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