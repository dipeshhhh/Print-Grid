import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// Components
import ThemeSwitchButton from './Components/ThemeSwitchButton/ThemeSwitchButton.jsx';
import EditButton from './Components/EditButton/EditButton.jsx';
import ConfirmationDialog from './Components/Dialogs/ConfirmationDialog/ConfirmationDialog.jsx';
import FiltersDialog from './Components/Dialogs/FiltersDialog/FiltersDialog.jsx';
import CropImageDialog from './Components/Dialogs/CropImageDialog/CropImageDialog.jsx';
import CustomSizeDialog from './Components/Dialogs/CustomSizeDialog/CustomSizeDialog.jsx';

// Icons for Edit Buttons
import SwapVertIcon from '@mui/icons-material/SwapVert';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import Rotate90DegreesCcwIcon from '@mui/icons-material/Rotate90DegreesCcw';
import Rotate90DegreesCwIcon from '@mui/icons-material/Rotate90DegreesCw';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import CropIcon from '@mui/icons-material/Crop';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import RestoreIcon from '@mui/icons-material/Restore';

// function applyChangesToImage(){}

function EditButtons({ image, setImage, isEditDisabled, inputRef, imageSizes, selectedImageSize, setSelectedImageSize, isUserAddingFilters, setIsUserAddingFilters, isUserCropping, setIsUserCropping, editHistory, editHistoryIndex, didARedo }) {
  const cropImageDialogRef = useRef(null);
  const confirmNewImageDialogRef = useRef(null);
  const filterDialogRef = useRef(null);
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
  const filters = () => { filterDialogRef.current.showModal(); setIsUserAddingFilters(true); }
  const crop = () => { cropImageDialogRef.current.showModal(); setIsUserCropping(true); }
  const undo = () => {
    if (editHistoryIndex.current > 0) {
      setImage({ ...editHistory.current[--editHistoryIndex.current] });
    }
  }
  const redo = () => {
    if (editHistoryIndex.current < (editHistory.current.length - 1)) {
      didARedo.current = true;
      setImage({ ...editHistory.current[++editHistoryIndex.current] });
    }
  }
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
    { icon: <FilterAltIcon />, text: 'Filters', onClickFunction: filters },
    { icon: <CropIcon />, text: 'Crop', onClickFunction: crop },
    { icon: <UndoIcon />, text: 'Undo', onClickFunction: undo },
    { icon: <RedoIcon />, text: 'Redo', onClickFunction: redo },
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
      <FiltersDialog
        referrer={filterDialogRef}
        image={image}
        setImage={setImage}
        isUserAddingFilters={isUserAddingFilters}
        setIsUserAddingFilters={setIsUserAddingFilters}
      />
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

function ImageSection({ uploadImage, image, isBordered, setIsBordered, inputRef, imageSizes, setImageSizes, selectedImageSize, setSelectedImageSize, cmToPx, inchToPx }) {
  const customImageSizeDialogRef = useRef(null);
  const imageSizeSelectorRef = useRef(null);
  const handleCheckboxChange = () => { setIsBordered(!isBordered); }
  const imageSizeHandle = (e) => {
    if (e.target.value !== 'custom') {
      setSelectedImageSize(imageSizes.find(imageSize => imageSize.name === e.target.value));
    }
    else {
      customImageSizeDialogRef.current.showModal();
    }
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
        <select className='topbar-selector' onChange={imageSizeHandle} ref={imageSizeSelectorRef}>
          {/* <option value={selectedImageSize.name}>{selectedImageSize.name}</option> */}
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

function GenerateImage({ isGenerateDisabled, isBordered, setIsBordered, cmToPx, sheetSizes, setSheetSizes, selectedSheetSize, setSelectedSheetSize, image, selectedImageSize, inchToPx }) {
  const [resultImage, setResultImage] = useState(null);
  const [isDownloadDisabled, setIsDownloadDisabled] = useState(true);
  const [isResultLoading, setIsResultLoading] = useState(false);
  const customSheetSizeDialogRef = useRef(null);
  const sheetSizeSelectorRef = useRef(null);

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
      if (isBordered) { // Add border to the image
        let borderWidth = 5; // Border width (px)

        // Adjust border width according to the size of the image
        if ((selectedImageSize.width < 10) || (selectedImageSize.height < 10)) borderWidth = 0;
        else if ((selectedImageSize.width < 30) || (selectedImageSize.height < 30)) borderWidth = 1;

        const borderedInputImageCanvas = document.createElement('canvas');
        const borderedInputImageCtx = borderedInputImageCanvas.getContext('2d');
        borderedInputImageCanvas.width = selectedImageSize.width;
        borderedInputImageCanvas.height = selectedImageSize.height;
        borderedInputImageCtx.fillStyle = 'black';
        borderedInputImageCtx.fillRect(0, 0, borderedInputImageCanvas.width, borderedInputImageCanvas.height);

        borderedInputImageCtx.drawImage(
          inputImageCanvas,
          borderWidth,
          borderWidth,
          selectedImageSize.width - (borderWidth * 2),
          selectedImageSize.height - (borderWidth * 2)
        );

        inputImageCtx.drawImage(borderedInputImageCanvas, 0, 0, selectedImageSize.width, selectedImageSize.height);
      }

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
    if (e.target.value !== 'custom') setSelectedSheetSize(sheetSizes.find(sheetSize => sheetSize.name === e.target.value));
    else customSheetSizeDialogRef.current.showModal();
  }
  return (
    <section className='section generate-image-section'>
      <div className='topbar'>
        <select className='topbar-selector' onChange={handleSizeChange} ref={sheetSizeSelectorRef}>
          {
            sheetSizes.map(sheetSize => (
              <option value={`${sheetSize.name}`} key={`${sheetSize.name}`}>{sheetSize.name}</option>
            ))
          }
          <option value='custom'>Custom Size</option>
        </select>
        <CustomSizeDialog
          referrer={customSheetSizeDialogRef}
          selectorRef={sheetSizeSelectorRef}
          title='Custom Sheet Size'
          sizes={sheetSizes}
          setSizes={setSheetSizes}
          selectedSize={selectedSheetSize}
          setSelectedSize={setSelectedSheetSize}
          cmToPx={cmToPx}
          inchToPx={inchToPx}
        />
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
  const [isUserAddingFilters, setIsUserAddingFilters] = useState(false);

  // Required variables and constants
  //? Maybe move these to a separate file
  let currentDPI = 300;
  const INCH_TO_CM = 2.54;
  const INTEGER_ROUNDING_FACTOR = 2.54 / 2.5; /// Factor to round cm to px conversion, preserving aspect ratio.
  const inchToCm = (inch) => (inch * INCH_TO_CM);
  const cmToPx = (cm) => (((cm * currentDPI) / INCH_TO_CM) * INTEGER_ROUNDING_FACTOR);
  const inchToPx = (inch) => (cmToPx(inchToCm(inch)));

  const editHistory = useRef([]);
  const editHistoryIndex = useRef(-1);
  const didARedo = useRef(false);
  const historyLimit = 10;

  function objectsAreEqual(obj1, obj2) {
    if (!obj1 || !obj2) return false;
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    if (keys1.length !== keys2.length) {
      return false;
    }
    for (let key of keys1) {
      if (obj1[key] !== obj2[key]) {
        return false;
      }
    }
    return true;
  }

  // Image and Sheet sizes in px
  const [imageSizes, setImageSizes] = useState([
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
  ])
  const [sheetSizes, setSheetSizes] = useState([
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
  ]);
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

    // Add the current image to the edit history
    if (!objectsAreEqual(editHistory.current[editHistoryIndex.current], image)) {
      if (editHistoryIndex.current === (editHistory.current.length - 1)) {
        // If the current image is not the last image in the history, add it to the history
        editHistory.current.push({ ...image });
        editHistoryIndex.current = editHistory.current.length - 1;
      }
      else if (!didARedo.current) {
        // If the current image is not the last image in the history, remove all the images after the current image and add the current image to the history
        // This is done to remove the forward history when a new change is made after undoing some changes
        editHistory.current.splice(editHistoryIndex.current + 1, editHistory.current.length - editHistoryIndex.current, { ...image });
        editHistoryIndex.current = editHistory.current.length - 1;
      }
      // Reset the redo flag
      didARedo.current = false;

      //Limit the history to 10 images
      if (editHistory.current.length > historyLimit) {
        editHistory.current.shift();
        editHistoryIndex.current--;
      }
    }
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
        isUserAddingFilters={isUserAddingFilters}
        setIsUserAddingFilters={setIsUserAddingFilters}
        isUserCropping={isUserCropping}
        setIsUserCropping={setIsUserCropping}
        editHistory={editHistory}
        editHistoryIndex={editHistoryIndex}
        didARedo={didARedo}
      />

      <ImageSection
        uploadImage={uploadImage}
        image={image}
        isBordered={isBordered}
        setIsBordered={setIsBordered}
        inputRef={inputRef}
        imageSizes={imageSizes}
        setImageSizes={setImageSizes}
        selectedImageSize={selectedImageSize}
        setSelectedImageSize={setSelectedImageSize}
        cmToPx={cmToPx}
        inchToPx={inchToPx}
      />

      <GenerateImage
        isGenerateDisabled={isGenerateDisabled}
        isBordered={isBordered}
        setIsBordered={setIsBordered}
        sheetSizes={sheetSizes}
        setSheetSizes={setSheetSizes}
        selectedSheetSize={selectedSheetSize}
        setSelectedSheetSize={setSelectedSheetSize}
        image={image}
        selectedImageSize={selectedImageSize}
        cmToPx={cmToPx}
        inchToPx={inchToPx}
      />

      <ThemeSwitchButton />
    </div>
  );
}

export default App;