import React, { useRef, useState, useEffect } from 'react';
import '../PageSections.css';
import './ImageSection.css';

// Utils
import { INPUT_IMAGE_SIZES_LOCAL_STORAGE_KEY } from '../../../utils/configs.js';
import { validateImageFile } from '../../../utils/helpers.js';
import { INITIAL_IMAGE_SIZES, INITIAL_IMAGE_STATE } from '../../../utils/initialValues.js';

// Components
import CustomSizeDialog from '../../Dialogs/CustomSizeDialog/CustomSizeDialog.jsx';
import ConfirmationDialog from '../../Dialogs/ConfirmationDialog/ConfirmationDialog.jsx';

function ImageSection({
  image,
  setImage,
  originalImageBackup,
  isBordered,
  setIsBordered,
  inputRef,
  imageSizes,
  setImageSizes,
  selectedImageSize,
  setSelectedImageSize
}) {
  const [isUserDroppingImage, setIsUserDroppingImage] = useState(false);
  const newUploadFiles = useRef(null);
  const confirmNewUploadRef = useRef(null);
  const customImageSizeDialogRef = useRef(null);
  const imageSizeSelectorRef = useRef(null);
  const confirmClearCustomSizesRef = useRef(null);

  useEffect(() => {
    confirmClearCustomSizesRef.current.onclose = function () {
      imageSizeSelectorRef.current.value = selectedImageSize.name
    }
  }, [confirmClearCustomSizesRef, selectedImageSize])

  useEffect(() => {
    imageSizeSelectorRef.current.value = selectedImageSize.name;
  }, [selectedImageSize]);

  const loadImageFromFile = (file) => {
    if (validateImageFile(file)) {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.src = url;
      img.onload = () => {
        const imageToSet = {
          ...INITIAL_IMAGE_STATE,
          url: url,
          naturalHeight: img.naturalHeight,
          naturalWidth: img.naturalWidth
        }
        originalImageBackup.current = { ...imageToSet };
        setImage({ ...imageToSet });
      }
    }
  }
  const loadImageFromFiles = (files) => {
    if (files && (files.length > 0)) {
      // Only load the first file
      loadImageFromFile(files[0]);
    }
  }
  const loadImageFromInputEvent = (e) => {
    loadImageFromFiles(e.target.files);
  }

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsUserDroppingImage(true);
  }
  const handleDrop = (e) => {
    e.preventDefault();
    if (!image.url) {
      loadImageFromFiles(e.dataTransfer.files);
    }
    else {
      newUploadFiles.current = e.dataTransfer.files;
      confirmNewUploadRef.current.showModal();
    }
    setIsUserDroppingImage(false);
  }
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsUserDroppingImage(false)
  };

  const clearCustomSizes = () => {
    const initialSizes = [...INITIAL_IMAGE_SIZES]
    setImageSizes(initialSizes);
    setSelectedImageSize(initialSizes[0]);
    localStorage.removeItem(INPUT_IMAGE_SIZES_LOCAL_STORAGE_KEY);
  }

  const handleCheckboxChange = () => { setIsBordered(!isBordered); }
  const imageSizeHandle = (e) => {
    if ((e.target.value !== 'custom') && (e.target.value !== 'clearCustoms')) setSelectedImageSize(imageSizes.find(imageSize => imageSize.name === e.target.value));
    else if (e.target.value === 'custom') customImageSizeDialogRef.current.showModal();
    else if (e.target.value === 'clearCustoms') confirmClearCustomSizesRef.current.showModal();
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
          {localStorage.getItem(INPUT_IMAGE_SIZES_LOCAL_STORAGE_KEY) && <option value='clearCustoms'>Remove/Clear Custom Sizes</option>}
        </select>
        <CustomSizeDialog
          referrer={customImageSizeDialogRef}
          selectorRef={imageSizeSelectorRef}
          title='Custom Image Size'
          sizes={imageSizes}
          setSizes={setImageSizes}
          selectedSize={selectedImageSize}
          setSelectedSize={setSelectedImageSize}
          localStorageKey={`${INPUT_IMAGE_SIZES_LOCAL_STORAGE_KEY}`}
        />
        <ConfirmationDialog
          referrer={confirmClearCustomSizesRef}
          title='Clear custom image sizes?'
          message='This will remove all the saved custom image sizes on this site.'
          onConfirm={clearCustomSizes}
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
        {image.url &&
          <img
            className='image-preview'
            src={image.url}
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
          (!image.url) &&
          <button className='upload-image-button' onClick={() => { inputRef.current.click(); }}>
            Click to Upload Image
          </button>
        }
        <input
          type='file'
          className='file-input-hidden'
          accept='image/*'
          ref={inputRef}
          onChange={loadImageFromInputEvent}
        />
        <ConfirmationDialog
          referrer={confirmNewUploadRef}
          title='Open new image?'
          message='This will discard all changes made to the current image.'
          onConfirm={() => loadImageFromFiles(newUploadFiles.current)}
          onClose={() => {
            setIsUserDroppingImage(false);
            confirmNewUploadRef.current.close();
          }}
        />
      </div>
    </section>
  )
}

// ImageSection.proptype = {
//   image: PropTypes.object.isRequired,
//   setImage: PropTypes.func.isRequired,
//   originalImageBackup: PropTypes.object.isRequired,
//   isBordered: PropTypes.bool.isRequired,
//   setIsBordered: PropTypes.func.isRequired,
//   inputRef: PropTypes.object.isRequired,
//   imageSizes: PropTypes.array.isRequired,
//   setImageSizes: PropTypes.func.isRequired,
//   selectedImageSize: PropTypes.object.isRequired,
//   setSelectedImageSize: PropTypes.func.isRequired
// }

export default ImageSection;