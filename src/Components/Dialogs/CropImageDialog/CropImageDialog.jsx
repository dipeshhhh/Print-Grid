import React, { useRef, useEffect } from 'react';
import '../Dialog.css';
import './CropImageDialog.css';

import ConfirmationDialog from '../ConfirmationDialog/ConfirmationDialog.jsx';

// ! Known Bugs
// 1. Cropper goes a little out of bounds on the bottom-right side
// 2. There is 2-3px gap inside between the cropper and the image on top-left sides, and outside on the bottom-right sides

// ! To-do
// 1. Fix hard-coded values (somewhere in the cropImageParent height element I think)
// 2. Fix the known bugs
// 3. Ability to change selected image size
// 4. Cropper eye level and face level guides
// ...
// n. Finally crop the image

function CropImageDialog({ referrer, image, setImage, selectedImageSize, setSelectedImageSize, setIsUserCropping, isUserCropping, imageSizes, areChangesBeingApplied }) {
  // const imageSizeHandle = (e) => {
  //   setSelectedImageSize(imageSizes.find(imageSize => imageSize.name === e.target.value));
  // }
  // ========== DOM references ==========
  // References to the image and canvas elements
  const cropImageRef = useRef(null);
  const cropImageContainerRef = useRef(null);
  const cropperRef = useRef(null);
  const confirmCropDialogRef = useRef(null);
  const cancelCropDialogRef = useRef(null);

  // ========== Constants/Variables and Initial Values ==========
  const pointersArray = [];
  const initialPointerPositionX = useRef(0);
  const initialPointerPositionY = useRef(0);
  const isUserResizingCropper = useRef(false);
  const cropperResizerPosition = useRef(null);
  let initialDistance = 0;

  // ========== Crop Cancel/Confirm ==========
  // Functions to handle the cancel and confirm buttons
  function confirmCropOnConfirm() { cropImage(); referrer.current.close(); setIsUserCropping(false); }
  function confirmCropOnClose() { confirmCropDialogRef.current.close() }
  function cancelCropOnConfirm() { referrer.current.close(); setIsUserCropping(false); }
  function cancelCropOnClose() { cancelCropDialogRef.current.close() }

  // ========== Crop Image ==========
  // Function to crop the image
  const cropImage = () => {
    const cropperInfo = {
      top: cropperRef.current.offsetTop,
      left: cropperRef.current.offsetLeft,
      width: cropperRef.current.clientWidth,
      height: cropperRef.current.clientHeight,
    };
    const imageInfo = {
      top: cropImageRef.current.offsetTop,
      left: cropImageRef.current.offsetLeft,
      width: cropImageRef.current.width,
      height: cropImageRef.current.height,
    };
    const newImage = new Image();
    newImage.src = image.imageUrl;
    newImage.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = selectedImageSize.width;
      canvas.height = selectedImageSize.height;
      ctx.drawImage(
        newImage,
        (cropperInfo.left - imageInfo.left) / (imageInfo.width / newImage.width),
        (cropperInfo.top - imageInfo.top) / (imageInfo.height / newImage.height),
        cropperInfo.width / (imageInfo.width / newImage.width),
        cropperInfo.height / (imageInfo.height / newImage.height),
        0,
        0,
        canvas.width,
        canvas.height
      );
      setImage({ ...image, imageUrl: canvas.toDataURL('image/png') });
      setIsUserCropping(false);
    }
  }

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
    const dx = -(initialPointerPositionX.current - currentPointerPositionX);
    const dy = -(initialPointerPositionY.current - currentPointerPositionY);
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
    initialPointerPositionX.current = currentPointerPositionX; // Else it will add 1+2+3+4+5+6, with this it will add 1+1+1+1+1+1
    initialPointerPositionY.current = currentPointerPositionY;
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
    const dx = -(initialPointerPositionX.current - currentPointerPositionX);
    const dy = -(initialPointerPositionY.current - currentPointerPositionY);
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
    initialPointerPositionX.current = currentPointerPositionX;
    initialPointerPositionY.current = currentPointerPositionY;
  }

  // ========== Cropper Resizing ==========
  const onResizeCropper = (e) => {
    e.preventDefault();
    if (!e.isPrimary) return;

    const rect = cropperRef.current.getBoundingClientRect();
    const checkBounds = (
      newPosX,
      newPosY,
      newHeight,
      newWidth,
      selfElement,
      parentElement,
      anchoredElement,
      selectedImageSize,
    ) => {
      // Known bug: cropper goes a little out of bounds on the bottom-right side
      return (
        (newHeight < parentElement.clientHeight)
        &&
        (newWidth < parentElement.clientWidth)
        &&
        (newWidth < anchoredElement.clientHeight)
        &&
        (newWidth < anchoredElement.clientWidth)
        &&
        (newHeight > 50)
        &&
        (newWidth > ((selectedImageSize.width / selectedImageSize.height) * 50))
        &&
        ((newPosX > 0 && newPosX < (parentElement.clientWidth - (selfElement.clientWidth))) || (newPosX < 0 && Math.abs(newPosX) < selfElement.clientWidth - selfElement.clientWidth))
        &&
        ((newPosY > 0 && newPosY < parentElement.clientHeight - selfElement.clientHeight) || (newPosY < 0 && Math.abs(newPosY) < selfElement.clientHeight - selfElement.clientHeight))
        &&
        (newPosX > anchoredElement.offsetLeft)
        &&
        (newPosY > anchoredElement.offsetTop)
        &&
        (newPosX < ((anchoredElement.offsetLeft + anchoredElement.clientWidth) - selfElement.clientWidth))
        &&
        (newPosY < ((anchoredElement.offsetTop + anchoredElement.clientHeight) - selfElement.clientHeight))
      );
    }

    const currentPointerPositionX = e.clientX;
    const currentPointerPositionY = e.clientY;
    const dx = -(initialPointerPositionX.current - currentPointerPositionX);
    const dy = -(initialPointerPositionY.current - currentPointerPositionY);
    const hypotenuse = Math.hypot(dx, dy);
    let newWidth, newHeight;
    let newPosX = cropperRef.current.offsetLeft;
    let newPosY = cropperRef.current.offsetTop;

    if (cropperResizerPosition.current === 'se') {
      newWidth = rect.width + (Math.sign(dx) * hypotenuse);
      newHeight = (rect.height / rect.width) * newWidth;
    }
    else if (cropperResizerPosition.current === 'ne') {
      newHeight = rect.height - (Math.sign(dy) * hypotenuse);
      newWidth = (rect.width / rect.height) * newHeight;
      newPosY = cropperRef.current.offsetTop + (Math.sign(dy) * hypotenuse);
    }
    else if (cropperResizerPosition.current === 'sw') {
      newWidth = rect.width - (Math.sign(dx) * hypotenuse);
      newHeight = (rect.height / rect.width) * newWidth;
      newPosX = cropperRef.current.offsetLeft + (Math.sign(dx) * hypotenuse);
    }
    else if (cropperResizerPosition.current === 'nw') {
      newWidth = rect.width - (Math.sign(dx) * hypotenuse);
      newHeight = (rect.height / rect.width) * newWidth;
      newPosX = cropperRef.current.offsetLeft + (Math.sign(dx) * hypotenuse);
      newPosY = cropperRef.current.offsetTop + (Math.sign(dy) * hypotenuse);
    }

    if (checkBounds(
      newPosX,
      newPosY,
      newHeight,
      newWidth,
      cropperRef.current,
      cropImageContainerRef.current,
      cropImageRef.current,
      selectedImageSize,
    )) {
      cropperRef.current.style.width = `${newWidth}px`;
      cropperRef.current.style.height = `${newHeight}px`;
      cropperRef.current.style.left = `${newPosX}px`;
      cropperRef.current.style.top = `${newPosY}px`;
    }

    initialPointerPositionX.current = currentPointerPositionX;
    initialPointerPositionY.current = currentPointerPositionY;
  }

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

  // ========== Remove Event Listeners ==========
  const removeDragEventListeners = () => {
    pointersArray.length = 0;
    initialDistance = 0;
    isUserResizingCropper.current = false;
    window.removeEventListener('pointermove', onPinchZoomCropImage);
    window.removeEventListener('pointermove', onDragCropImage);
    window.removeEventListener('pointermove', onDragCropper);
    window.removeEventListener('pointermove', onResizeCropper)

    window.removeEventListener('pointerup', removeDragEventListeners);
  }

  // ========== Event Listeners ==========
  useEffect(() => {
    if (cropImageRef.current) {
      cropImageRef.current.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        initialPointerPositionX.current = e.clientX;
        initialPointerPositionY.current = e.clientY;
        pointersArray.push(e);
        // Adding event listeners to the window so that the user can drag the image even if the mouse is not over the image
        if (pointersArray.length <= 1) window.addEventListener('pointermove', onDragCropImage);
        else if (pointersArray.length > 1) {
          window.removeEventListener('pointermove', onDragCropImage);
        }
        window.addEventListener('pointerup', removeDragEventListeners);
      });
      // Adding event listener to the image so that the user can zoom in and out using scroll
      cropImageRef.current.addEventListener('pointerenter', () => {
        cropImageRef.current.addEventListener('wheel', onScrollZoomCropImage);        
        cropImageRef.current.addEventListener('pointerleave', () => {
          cropImageRef.current.removeEventListener('wheel', onScrollZoomCropImage);
        });
      });
    }
    if (cropperRef.current) {
      cropperRef.current.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        if (e.target.classList.contains('cropper-resizer')) {
          isUserResizingCropper.current = true;
          cropperResizerPosition.current = [...e.target.classList].find((className) => ['ne', 'nw', 'se', 'sw'].includes(className));
        }

        initialPointerPositionX.current = e.clientX;
        initialPointerPositionY.current = e.clientY;

        if (!isUserResizingCropper.current) window.addEventListener('pointermove', onDragCropper);
        else window.addEventListener('pointermove', onResizeCropper);

        window.addEventListener('pointerup', removeDragEventListeners);
      })
    }
    // Since the event listeners are added and removed in this useEffect, eslint is giving a warning
    // And onPinchZoomCropImage, onResizeCropper, removeDragEventListeners are not changing throughout the component lifecycle so they are not added to the dependency array
    // But pointersArray might change yet it is not added to the dependency array because it is being emptied at the end of the event listener

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUserCropping]);

  return (
    <dialog className='dialog crop-dialog' ref={referrer}>
      {areChangesBeingApplied ? <div className='dialog-loading-overlay'>Loading...</div> : <></>}
      <div className='crop-dialog-body'>
        {/* <div className='crop-image-controls'>
          <div className='crop-image-control image-size-selector-container'>
            <label htmlFor='crop-dialog-image-size-selector' className='image-size-label'>Image Size:</label>
            <select className='image-size-selector' onChange={imageSizeHandle} id='crop-dialog-image-size-selector'>
              <option value={selectedImageSize.name}>{selectedImageSize.name}</option>
              {
                imageSizes.map(imageSize => (
                  <option value={`${imageSize.name}`} key={`${imageSize.name}`}>
                    {imageSize.name}
                  </option>
                ))
              }
            </select>
          </div>
        </div> */}
        <div className='crop-image-container' ref={cropImageContainerRef}>
          {(isUserCropping && image.imageUrl) &&
            <>
              <img
                ref={cropImageRef}
                className='crop-image-preview'
                src={image.imageUrl}
                alt='To be Cropped'
                draggable={false}
                style={{
                  transform: `
                  rotate(${image.rotate}deg)
                  scale(${image.horizontalScale}, ${image.verticalScale})
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
              <div
                ref={cropperRef}
                draggable={false}
                className='cropper'
                style={{
                  aspectRatio: `${selectedImageSize.width} / ${selectedImageSize.height}`,
                  height: '51px',
                  width: `${(selectedImageSize.width / selectedImageSize.height) * 51}px`,
                  minHeight: '50px',
                  minWidth: `${(selectedImageSize.width / selectedImageSize.height) * 50}px`,
                }}
              >
                <div className='cropper-resizer ne' />
                <div className='cropper-resizer nw' />
                <div className='cropper-resizer se' />
                <div className='cropper-resizer sw' />
              </div>
            </>
          }
        </div>
      </div>
      <div className='dialog-buttons crop-dialog-buttons'>
        <button className='dialog-button cancel-button' disabled={areChangesBeingApplied} onClick={cancelCropOnConfirm} autoFocus>
          Cancel
        </button>
        <button className='dialog-button confirm-button' disabled={areChangesBeingApplied} onClick={confirmCropOnConfirm}>
          Confirm
        </button>
      </div>
      {/* //! Keeping these here for now, will remove some time later */}
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

// CropImageDialog.propType = {
//   referrer: PropTypes.object.isRequired,
//   image: PropTypes.object.isRequired,
//   setImage: PropTypes.func.isRequired,
//   selectedImageSize: PropTypes.object.isRequired,
//   setSelectedImageSize: PropTypes.func.isRequired,
//   setIsUserCropping: PropTypes.func.isRequired,
//   isUserCropping: PropTypes.bool.isRequired,
//   imageSizes: PropTypes.array.isRequired,
//   areChangesBeingApplied: PropTypes.bool.isRequired,
// }

export default CropImageDialog;