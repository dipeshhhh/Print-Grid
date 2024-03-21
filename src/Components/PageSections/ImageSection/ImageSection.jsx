import React, { useRef, useState } from 'react';
import '../PageSections.css';
import './ImageSection.css';

// Components
import CustomSizeDialog from '../../Dialogs/CustomSizeDialog/CustomSizeDialog.jsx';
import ConfirmationDialog from '../../Dialogs/ConfirmationDialog/ConfirmationDialog.jsx';

function ImageSection({
  uploadImage,
  image,
  isBordered,
  setIsBordered,
  inputRef,
  imageSizes,
  setImageSizes,
  selectedImageSize,
  setSelectedImageSize,

  // Prop drilling
  cmToPx,
  inchToPx
}) {
  const [isUserDroppingImage, setIsUserDroppingImage] = useState(false);
  const newUploadFiles = useRef(null);
  const confirmNewUploadRef = useRef(null);
  const customImageSizeDialogRef = useRef(null);
  const imageSizeSelectorRef = useRef(null);

  const handleCheckboxChange = () => { setIsBordered(!isBordered); }
  const imageSizeHandle = (e) => {
    if (e.target.value !== 'custom') setSelectedImageSize(imageSizes.find(imageSize => imageSize.name === e.target.value));
    else customImageSizeDialogRef.current.showModal();
  }

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsUserDroppingImage(true);
  }
  const handleDrop = (e) => {
    e.preventDefault();
    // since upload image expects e.target.files
    const files = { target: { files: e.dataTransfer.files } };
    if (!image.imageUrl) {
      uploadImage(files);
    }
    else {
      newUploadFiles.current = files;
      confirmNewUploadRef.current.showModal();
    }
    setIsUserDroppingImage(false);
  }
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsUserDroppingImage(false)
  };

  // Hide the file input when an image is uploaded to show the preview.
  // Can't hide the input using 'display: none', 'visibility: hidden', or 'opacity: 0' because it will prevent the file input from working.
  // Need the fileInput for uploading new images after the first one, thus can't remove it after the first upload.
  const hiddenFileInputCss = {
    position: 'absolute',
    opacity: '0',
    height: '0.1px',
    width: '0.1px',
    overflow: 'hidden',
    zIndex: '-1',
  }

  return (
    <section className='section image-section'>
      <div className='topbar'>
        <select className='topbar-selector' onChange={imageSizeHandle} ref={imageSizeSelectorRef}>
          {
            imageSizes.map(imageSize => (
              <option value={`${imageSize.name}`} key={`${imageSize.name}`}>
                {imageSize.name}
              </option>
            ))
          }
          <option value='custom'>Custom Size</option>
        </select>
        <CustomSizeDialog
          referrer={customImageSizeDialogRef}
          selectorRef={imageSizeSelectorRef}
          title='Custom Image Size'
          sizes={imageSizes}
          setSizes={setImageSizes}
          selectedSize={selectedImageSize}
          setSelectedSize={setSelectedImageSize}
          cmToPx={cmToPx}
          inchToPx={inchToPx}
        />
        <span className='border-checkbox'>
          <input id='border-check' type='checkbox' checked={isBordered} onChange={handleCheckboxChange} />
          <label htmlFor='border-check'>Border</label>
        </span>
      </div>
      <div
        className='image-section-main'
        onDragOver={handleDragOver}
      >
        {isUserDroppingImage &&
          <div
            className='drop-image-overlay'
            onDrop={handleDrop}
            onDragLeave={handleDragLeave}
          >
            <h4>Drop the image here</h4>
          </div>
        }
        {image.imageUrl &&
          <img
            className='image-preview'
            src={image.imageUrl}
            alt='Upload preview'
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
          />
        }
        {
          (!image.imageUrl) && 
          <button className='upload-image-button' onClick={()=>{inputRef.current.click();}}>
          Click to Upload Image
          </button>
        }
        <input
          type='file'
          className='file-input-hidden'
          accept='image/*'
          ref={inputRef}
          style={image.imageUrl ? hiddenFileInputCss : {}}
          onChange={uploadImage}
        />
        <ConfirmationDialog
          referrer={confirmNewUploadRef}
          title='Open new image?'
          message='This will discard all changes made to the current image.'
          onConfirm={() => uploadImage(newUploadFiles.current)}
          onClose={() => {
            setIsUserDroppingImage(false);
            confirmNewUploadRef.current.close();
          }}
        />
      </div>
    </section>
  )
}

// ImageSection.prototype = {
//   uploadImage: PropTypes.func.isRequired,
//   image: PropTypes.object.isRequired,
//   isBordered: PropTypes.bool.isRequired,
//   setIsBordered: PropTypes.func.isRequired,
//   inputRef: PropTypes.object.isRequired,
//   imageSizes: PropTypes.array.isRequired,
//   setImageSizes: PropTypes.func.isRequired,
//   selectedImageSize: PropTypes.object.isRequired,
//   setSelectedImageSize: PropTypes.func.isRequired,
//   cmToPx: PropTypes.func.isRequired,
//   inchToPx: PropTypes.func.isRequired,
// }

export default ImageSection;