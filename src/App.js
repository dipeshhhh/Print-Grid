import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// Components
import ThemeSwitchButton from './Components/ThemeSwitchButton/ThemeSwitchButton.jsx';
import EditButton from './Components/EditButton/EditButton.jsx';
import ConfirmationDialog from './Components/Dialogs/ConfirmationDialog/ConfirmationDialog.jsx';
import CropImageDialog from './Components/Dialogs/CropImageDialog/CropImageDialog.jsx';

// Icons for Edit Buttons
import SwapVertIcon from '@mui/icons-material/SwapVert';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import Rotate90DegreesCcwIcon from '@mui/icons-material/Rotate90DegreesCcw';
import Rotate90DegreesCwIcon from '@mui/icons-material/Rotate90DegreesCw';
import FilterBAndWIcon from '@mui/icons-material/FilterBAndW';
import CropIcon from '@mui/icons-material/Crop';
import RestoreIcon from '@mui/icons-material/Restore';

function EditButtons({ image, setImage, isEditDisabled, inputRef, imageSizes }) {
  const cropImageDialogRef = useRef(null);
  const confirmNewImageDialogRef = useRef(null);
  const handleNewImageButton = () => {
    if (image.imageUrl) {
      confirmNewImageDialogRef.current.showModal();
    }
    else {
      uploadNewImage();
    }
  }
  const uploadNewImage = () => { inputRef.current.click(); }
  const flipHorizontal = () => { setImage({ ...image, verticalScale: image.verticalScale === 1 ? -1 : 1 }) }
  const flipVertical = () => { setImage({ ...image, horizontalScale: image.horizontalScale === 1 ? -1 : 1 }) }
  const rotateClockwise = () => { setImage({ ...image, rotate: image.rotate + 90 }) }
  const rotateAntiClockwise = () => { setImage({ ...image, rotate: image.rotate - 90 }) }
  const grayscale = () => { setImage({ ...image, grayscale: image.grayscale === 1 ? 0 : 1 }) }
  const crop = () => { cropImageDialogRef.current.showModal() }
  const reset = () => {
    setImage({
      imageUrl: image.imageUrl,
      brightness: 100,
      contrast: 100,
      saturate: 100,
      hueRotate: 0,
      grayscale: 0,
      sepia: 0,
      rotate: 0,
      verticalScale: 1,
      horizontalScale: 1,
    });
  }
  const buttons = [
    { icon: <SwapVertIcon />, text: 'Flip left', onClickFunction: flipVertical },
    { icon: <SwapHorizIcon />, text: 'Flip right', onClickFunction: flipHorizontal, },
    { icon: <Rotate90DegreesCwIcon />, text: 'Rotate Clockwise', onClickFunction: rotateClockwise },
    { icon: <Rotate90DegreesCcwIcon />, text: 'Rotate counter-clockwise', onClickFunction: rotateAntiClockwise },
    { icon: <FilterBAndWIcon />, text: 'Grayscale', onClickFunction: grayscale },
    { icon: <CropIcon />, text: 'Crop', onClickFunction: crop },
    { icon: <RestoreIcon />, text: 'Reset', onClickFunction: reset },
  ];
  return (
    <section className='section edit-buttons-section'>
      <div className='topbar'>
        <button className='topbar-button' onClick={handleNewImageButton}>New</button>
        <ConfirmationDialog
          title={'Open new image?'}
          message={'This will discard all changes made to the current image.'}
          referrer={confirmNewImageDialogRef}
          onConfirm={uploadNewImage}
        />
      </div>
      <div className='sidebar'>
        {buttons.map(button => (
          <EditButton
            key={button.text}
            icon={button.icon}
            text={button.text}
            onClickFunction={button.onClickFunction}
            isEditDisabled={isEditDisabled}
          />
        ))}
      </div>
      <CropImageDialog
        referrer={cropImageDialogRef}
        image={image}
        setImage={setImage}
      />
    </section>
  )
}

function ImageSection({ uploadImage, image, isBordered, setIsBordered, inputRef, imageSizes }) {
  const handleCheckboxChange = () => { setIsBordered(!isBordered); }
  const imageSizeHandle = (e) => {
    console.log(e.target.value);
  }
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
        <select className='topbar-selector' onChange={imageSizeHandle}>
          <option value={false}>Size</option>
          {
            imageSizes.map(imageSize => (
              <option value={`${imageSize.name}`} key={`${imageSize.name}`}>
                {imageSize.name}
              </option>
            ))
          }
        </select>
        {/* For future: adjust custom image size in the topbar itself */}
        <span className='checkbox'>
          <input id='border-check' type='checkbox' checked={isBordered} onChange={handleCheckboxChange} />
          <label htmlFor='border-check'>Border</label>
        </span>
      </div>
      <div className='image-section-main' onDrop={uploadImage}
        onDragOver={(e) => {
          e.preventDefault();
        }}
      >
        {
          image.imageUrl &&
          <img
            className='image-preview'
            src={image.imageUrl}
            alt='Upload preview'
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
          />
        }
        <input
          type='file'
          className='file-input-text-hidden'
          accept='image/*' onChange={uploadImage}
          style={image.imageUrl ? hiddenFileInputCss : {}}
          ref={inputRef}
        />

      </div>
    </section>
  )
}

function GenerateImage({ isGenerateDisabled }) {
  const [resultImage, setResultImage] = useState(null);
  const [isDownloadDisabled, setIsDownloadDisabled] = useState(true);

  const generateResultImage = () => {
    let imageGeneratedSuccessfully = true //! Currently set true for testing
    if (imageGeneratedSuccessfully) {
      // Handling download button state upon successful result image generation
      setIsDownloadDisabled(false);
    }
  }
  const downloadImage = () => {
  }
  const createCustomSize = () => {
  }
  const handleSizeChange = () => {
  }
  const sizeOptions = [
    {
      "name": "A4",
      "widthInCM": "",
      "heightInCM": ""
    },
    {
      "name": "A3",
      "widthInCM": "",
      "heightInCM": ""
    }
  ]
  return (
    <section className='section generate-image-section'>
      <div className='topbar'>
        <select className='topbar-selector'>
          <option onClick={createCustomSize}>Custom Size</option>
          {
            sizeOptions.map(sizeOption => (
              <option value={sizeOption} onClick={handleSizeChange} key={`${sizeOption.name}`}>{sizeOption.name}</option>
            ))
          }
        </select>
        <button className='primary-button' onClick={generateResultImage} disabled={isGenerateDisabled}>Generate</button>
        <button className='primary-button' onClick={downloadImage} disabled={isDownloadDisabled}>Download</button>
      </div>
      <div className='generate-image-section-main'>
        {
          resultImage ? resultImage :
            <div>
              Click 'Generate' to generate result
            </div>
        }
      </div>
    </section>
  )
}

function App() {
  // Input Referrer
  const inputRef = useRef(null);

  // Edit buttons and Generate button's state
  const [isGenerateDisabled, setIsGenerateDisabled] = useState(true);
  const [isEditDisabled, setIsEditDisabled] = useState(true);

  // Required variables and constants
  let currentDPI = 300;
  const INCH_TO_CM = 2.54;
  const INTEGER_ROUNDING_FACTOR = 2.54 / 2.5; /// Factor to round cm to px conversion, preserving aspect ratio.
  const inchToCm = (inch) => (inch * INCH_TO_CM);
  const cmToPx = (cm) => (((cm * currentDPI) / INCH_TO_CM) * INTEGER_ROUNDING_FACTOR);
  const inchToPx = (inch) => (cmToPx(inchToCm(inch)));

  const imageSizes = [ // In px
    {
      "name": '2x2 inch (Indian passport)',
      "width": inchToPx(2),
      "height": inchToPx(2)
    }
  ]

  // Image
  const [image, setImage] = useState({
    imageUrl: false,
    brightness: 100,
    contrast: 100,
    saturate: 100,
    hueRotate: 0,
    grayscale: 0,
    sepia: 0,
    rotate: 0,
    verticalScale: 1,
    horizontalScale: 1
  });
  const [isBordered, setIsBordered] = useState(false);
  const uploadImage = (e) => {
    if (e.target.files && (e.target.files.length > 0) && e.target.files[0].type.startsWith('image/')) {
      const imageUrl = URL.createObjectURL(e.target.files[0]);
      setImage({
        imageUrl: imageUrl,
        brightness: 100,
        contrast: 100,
        saturate: 100,
        hueRotate: 0,
        grayscale: 0,
        sepia: 0,
        rotate: 0,
        verticalScale: 1,
        horizontalScale: 1
      })
      // URL.revokeObjectURL(imageUrl) // Free memory
    }
    else {
      alert('Please select an image file.')
    }
  }
  useEffect(() => {
    if (!image.imageUrl) {
      setIsEditDisabled(true);
      setIsGenerateDisabled(true);
      return;
    };
    setIsEditDisabled(false);
    setIsGenerateDisabled(false);
  }, [image])

  return (
    <div className='App'>
      <EditButtons
        uploadImage={uploadImage}
        image={image}
        setImage={setImage}
        isEditDisabled={isEditDisabled}
        inputRef={inputRef}
        imageSizes={imageSizes}
      />

      <ImageSection
        uploadImage={uploadImage}
        image={image}
        isBordered={isBordered}
        setIsBordered={setIsBordered}
        inputRef={inputRef}
        imageSizes={imageSizes}
      />

      <GenerateImage
        isGenerateDisabled={isGenerateDisabled}
      />

      <ThemeSwitchButton />
    </div>
  );
}

export default App;