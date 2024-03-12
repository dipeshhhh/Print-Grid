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

function EditButtons({ image, setImage, isEditDisabled, inputRef, imageSizes, selectedImageSize, setSelectedImageSize, isUserCropping, setIsUserCropping }) {
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
  const crop = () => { cropImageDialogRef.current.showModal(); setIsUserCropping(true); }
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
        imageSizes={imageSizes}
        selectedImageSize={selectedImageSize}
        setSelectedImageSize={setSelectedImageSize}
        isUserCropping={isUserCropping}
        setIsUserCropping={setIsUserCropping}
      />
    </section>
  )
}

function ImageSection({ uploadImage, image, isBordered, setIsBordered, inputRef, imageSizes, selectedImageSize, setSelectedImageSize }) {
  const handleCheckboxChange = () => { setIsBordered(!isBordered); }
  const imageSizeHandle = (e) => {
    setSelectedImageSize(imageSizes.find(imageSize => imageSize.name === e.target.value));
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
          <option value={selectedImageSize.name}>{selectedImageSize.name}</option>
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

function GenerateImage({ isGenerateDisabled, cmToPx, sheetSizes, selectedSheetSize, setSelectedSheetSize, image, selectedImageSize }) {
  const [resultImage, setResultImage] = useState(null);
  const [isDownloadDisabled, setIsDownloadDisabled] = useState(true);
  const [isResultLoading, setIsResultLoading] = useState(false);

  const generateResultImage = () => {
    if (!image.imageUrl) return;
    setIsResultLoading(true);
    const columnGap = 3; // Gap between images in a column (px)
    const rowGap = 30; // Gap between images in a row (px)
    const noOfColumns = Math.floor(selectedSheetSize.width / (selectedImageSize.width + (columnGap * 2)));
    const noOfRows = Math.floor(selectedSheetSize.height / (selectedImageSize.height + rowGap));

    const resultImageCanvas = document.createElement('canvas');
    const resultImageCtx = resultImageCanvas.getContext('2d');
    resultImageCanvas.width = selectedSheetSize.width;
    resultImageCanvas.height = selectedSheetSize.height;
    resultImageCtx.fillStyle = 'white';
    resultImageCtx.fillRect(0, 0, resultImageCanvas.width, resultImageCanvas.height);

    const inputImage = new Image();
    inputImage.onload = () => {
      // Adjust and center the image to fit the selected image size
      const inputImageCanvas = document.createElement('canvas');
      const inputImageCtx = inputImageCanvas.getContext('2d');
      let newWidth, newHeight, x, y;

      newWidth = selectedImageSize.width;
      newHeight = (inputImage.naturalHeight / inputImage.naturalWidth) * selectedImageSize.width;
      x = 0;
      y = -((newHeight / 2) - (selectedImageSize.height / 2));
      if (newHeight < selectedImageSize.height) {
        newWidth = (inputImage.naturalWidth / inputImage.naturalHeight) * selectedImageSize.height;
        newHeight = selectedImageSize.height;
        x = -((newWidth / 2) - (selectedImageSize.width / 2));
        y = 0;
      }

      inputImageCanvas.width = selectedImageSize.width;
      inputImageCanvas.height = selectedImageSize.height;
      inputImageCtx.drawImage(inputImage, x, y, newWidth, newHeight);
      
      // Draw the input image on the result canvas
      for (let i = 0; i < noOfColumns; i++) {
        for (let j = 0; j < noOfRows; j++) {
          resultImageCtx.drawImage(
            inputImageCanvas,
            (i * (selectedImageSize.width + columnGap)) + (columnGap * (i + 1)),
            (j * (selectedImageSize.height + rowGap)) + rowGap,
            selectedImageSize.width,
            selectedImageSize.height
          );
        }
      }
      setResultImage(resultImageCanvas.toDataURL('image/png'));
      setIsDownloadDisabled(false);
      setIsResultLoading(false);
    }
    inputImage.src = image.imageUrl;
  }  
  const downloadImage = () => {
    if (!resultImage) return;
    const link = document.createElement('a');
    link.href = resultImage;
    link.download = 'result.png';
    link.click();
  }
  const handleSizeChange = (e) => {
    setSelectedSheetSize(sheetSizes.find(sheetSize => sheetSize.name === e.target.value));
  }
  const createCustomSize = () => {
  }
  return (
    <section className='section generate-image-section'>
      <div className='topbar'>
        <select className='topbar-selector' onChange={handleSizeChange}>
          {
            sheetSizes.map(sheetSize => (
              <option value={`${sheetSize.name}`} key={`${sheetSize.name}`}>{sheetSize.name}</option>
            ))
          }
          <option onClick={createCustomSize}>Custom Size</option>
        </select>
        <button className='primary-button' onClick={generateResultImage} disabled={isGenerateDisabled}>Generate</button>
        <button className='primary-button' onClick={downloadImage} disabled={isDownloadDisabled}>Download</button>
      </div>
      <div className='generate-image-section-main'>
        { 
          resultImage && !isResultLoading ?
            <img className="result-image"
              src={resultImage}
              alt='Result'
            />
            :
            <div>
              {isResultLoading ? 'Generating...' : 'Click \'Generate\' to generate result'}
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
  const [isUserCropping, setIsUserCropping] = useState(false);


  // Required variables and constants
  let currentDPI = 300;
  const INCH_TO_CM = 2.54;
  const INTEGER_ROUNDING_FACTOR = 2.54 / 2.5; /// Factor to round cm to px conversion, preserving aspect ratio.
  const inchToCm = (inch) => (inch * INCH_TO_CM);
  const cmToPx = (cm) => (((cm * currentDPI) / INCH_TO_CM) * INTEGER_ROUNDING_FACTOR);
  const inchToPx = (inch) => (cmToPx(inchToCm(inch)));

  // Image and Sheet sizes in px
  const imageSizes = [
    {
      "name": '3cm x 4cm',
      "width": cmToPx(2.95), // 0.05cm less than said size to preserve gap between images
      "height": cmToPx(3.95), // same reason as above
    },
    {
      "name": '3.5cm x 4.5cm',
      "width": cmToPx(3.5),
      "height": cmToPx(4.5),
    },
    {
      "name": '2x2 inch (Indian passport)',
      "width": inchToPx(2),
      "height": inchToPx(2),
    }
  ]
  const sheetSizes = [
    {
      "name": "A4",
      "width": cmToPx(21),
      "height": cmToPx(29.7)
    },
    {
      "name": "A3",
      "width": cmToPx(29.7),
      "height": cmToPx(42)
    }
  ]
  const [selectedImageSize, setSelectedImageSize] = useState(imageSizes[0]);
  const [selectedSheetSize, setSelectedSheetSize] = useState(sheetSizes[0]);

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
    horizontalScale: 1,
    naturalHeight: false,
    naturalWidth: false
  });
  const [isBordered, setIsBordered] = useState(false);
  const uploadImage = (e) => {
    if (e.target.files && (e.target.files.length > 0) && e.target.files[0].type.startsWith('image/')) {
      const imageUrl = URL.createObjectURL(e.target.files[0]);
      const img = new Image();
      img.src = imageUrl;
      img.onload = () => {
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
          horizontalScale: 1,
          naturalHeight: img.naturalHeight,
          naturalWidth: img.naturalWidth
        })
      }
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
        selectedImageSize={selectedImageSize}
        setSelectedImageSize={setSelectedImageSize}
        isUserCropping={isUserCropping}
        setIsUserCropping={setIsUserCropping}
      />

      <ImageSection
        uploadImage={uploadImage}
        image={image}
        isBordered={isBordered}
        setIsBordered={setIsBordered}
        inputRef={inputRef}
        imageSizes={imageSizes}
        selectedImageSize={selectedImageSize}
        setSelectedImageSize={setSelectedImageSize}
      />

      <GenerateImage
        isGenerateDisabled={isGenerateDisabled}
        cmToPx={cmToPx}
        sheetSizes={sheetSizes}
        selectedSheetSize={selectedSheetSize}
        setSelectedSheetSize={setSelectedSheetSize}
        image={image}
        selectedImageSize={selectedImageSize}
      />

      <ThemeSwitchButton />
    </div>
  );
}

export default App;