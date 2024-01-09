import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// Components
import ThemeSwitchButton from './Components/ThemeSwitchButton/ThemeSwitchButton.jsx';
import EditButton from './Components/EditButton/EditButton.jsx';
import ConfirmationDialog from './Components/ConfirmationDialog/ConfirmationDialog.jsx';

// Icons for Edit Buttons
import SwitchLeftIcon from '@mui/icons-material/SwitchLeft';
import SwitchRightIcon from '@mui/icons-material/SwitchRight';
import Rotate90DegreesCcwIcon from '@mui/icons-material/Rotate90DegreesCcw';
import Rotate90DegreesCwIcon from '@mui/icons-material/Rotate90DegreesCw';
import FilterBAndWIcon from '@mui/icons-material/FilterBAndW';
import CropIcon from '@mui/icons-material/Crop';
import RestoreIcon from '@mui/icons-material/Restore';

function EditButtons({ uploadImage, image, isEditDisabled }) {
  const confirmNewImageDialog = useRef(null);
  const handleNewImageButton = () => {
    if (image) {
      confirmNewImageDialog.current.showModal();
    }
    else {
      uploadNewImage()
    }
  }
  const uploadNewImage = () => { }
  const flipLeft = () => { }
  const flipRight = () => { }
  const rotateClockwise = () => { }
  const rotateAntiClockwise = () => { }
  const grayscale = () => { }
  const crop = () => { }
  const reset = () => { }
  const buttons = [
    { icon: <SwitchLeftIcon />, text: 'Flip left', onClickFunction: flipLeft },
    { icon: <SwitchRightIcon />, text: 'Flip right', onClickFunction: flipRight },
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
          referrer={confirmNewImageDialog}
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
    </section>
  )
}

function ImageSection({ uploadImage, image, imagePreview, isBordered, setIsBordered }) {
  const handleCheckboxChange = () => { setIsBordered(!isBordered); }
  const imageSizeHandle = () => { }

  return (
    <section className='section image-section'>
      <div className='topbar'>
        <button className='topbar-button topbar-selector' onClick={imageSizeHandle}>Size</button>
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
          image ?
            <img className='image-preview' src={imagePreview} alt='Uploaded image preview' />
            :
            // Drag and Drop feature here

            <input type='file' className='file-input-text-hidden' accept='image/*' onChange={uploadImage} />
        }
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
  // Required variables and constants
  let currentDPI = 300;
  const integerRoundingFactor = 2.54 / 2.5; /// Factor to round cm to px conversion, preserving aspect ratio.
  const cmToPx = (cm) => (((cm * currentDPI) / 2.54) * integerRoundingFactor);

  // Edit buttons and Generate button's state
  const [isGenerateDisabled, setIsGenerateDisabled] = useState(true);
  const [isEditDisabled, setIsEditDisabled] = useState(true);

  // Image
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isBordered, setIsBordered] = useState(false);
  const uploadImage = (e) => {
    if (e.target.files && (e.target.files.length > 0) && e.target.files[0].type.startsWith('image/')) {
      setImage(e.target.files[0])
    }
    else {
      alert('Please select an image file.')
    }
  }
  useEffect(() => {
    if (!image) return;
    const imageUrl = URL.createObjectURL(image);
    setImagePreview(imageUrl);
    setIsGenerateDisabled(false);
    setIsEditDisabled(false);
    // URL.revokeObjectURL(imageUrl) // Free memory
  }, [image])

  return (
    <div className='App'>
      <EditButtons
        uploadImage={uploadImage}
        image={image}
        isEditDisabled={isEditDisabled}
      />

      <ImageSection
        uploadImage={uploadImage}
        image={image}
        imagePreview={imagePreview}
        isBordered={isBordered}
        setIsBordered={setIsBordered}
      />

      <GenerateImage
        isGenerateDisabled={isGenerateDisabled}
      />

      <ThemeSwitchButton />
    </div>
  );
}

export default App;