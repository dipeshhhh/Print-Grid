import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// Components
import ThemeSwitchButton from './Components/ThemeSwitchButton/ThemeSwitchButton.jsx';

// Sections for the page
import EditButtons from './Components/PageSections/EditButtons/EditButtons.jsx';
import ImageSection from './Components/PageSections/ImageSection/ImageSection.jsx';
import GenerateImage from './Components/PageSections/GenerateImage/GenerateImage.jsx';

// Required variables/constants and helper functions
//? Maybe move these to a separate file
let currentDPI = 300;
const INCH_TO_CM = 2.54;
const INTEGER_ROUNDING_FACTOR = 2.54 / 2.5; /// Factor to round cm to px conversion, preserving aspect ratio.
const inchToCm = (inch) => (inch * INCH_TO_CM);
const cmToPx = (cm) => (((cm * currentDPI) / INCH_TO_CM) * INTEGER_ROUNDING_FACTOR);
const inchToPx = (inch) => (cmToPx(inchToCm(inch)));
const objectsAreEqual = (obj1, obj2) => {
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

function App() {
  // Input Referrer: for the file input element
  const inputRef = useRef(null);
  const originalImageBackup = useRef(null);

  // Edit History
  const editHistory = useRef([]);
  const editHistoryIndex = useRef(-1);
  const redoFlag = useRef(false); // Flag to prevent adding duplicate entries in the history when redo is clicked after undo
  const historyLimit = useRef(10);

  // Flags to prevent concurrent edits, multiple image generations on repeated clicks, and duplicate entries in the history while changes are being applied.
  const generatingResultFlag = useRef(false);
  const [areChangesBeingApplied, setAreChangesBeingApplied] = useState(false);

  // Edit states (Cropping, Filters) ensure the image section is re-rendered with the latest image when the user opens Crop or Filter dialog, preventing edits to an outdated image.
  const [isUserCropping, setIsUserCropping] = useState(false);
  const [isUserAddingFilters, setIsUserAddingFilters] = useState(false);

  // Button states: Disabled or not
  const [isGenerateDisabled, setIsGenerateDisabled] = useState(true);
  const [isEditDisabled, setIsEditDisabled] = useState(true);
  const [isUndoDisabled, setIsUndoDisabled] = useState(true);
  const [isRedoDisabled, setIsRedoDisabled] = useState(true);

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
  const [isBordered, setIsBordered] = useState(false);
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

  useEffect(() => {
    if (!image.imageUrl) {
      setIsEditDisabled(true);
      setIsGenerateDisabled(true);
      return;
    };
    setIsEditDisabled(false);
    setIsGenerateDisabled(false);

    // Add the current image to the edit history
    if ((!objectsAreEqual(editHistory.current[editHistoryIndex.current], image)) && (!areChangesBeingApplied)) {
      if (editHistoryIndex.current === (editHistory.current.length - 1)) {
        // Add the current image to history if no undo operation was performed before the new change and if it's not the last image in history.
        editHistory.current.push({ ...image });
        editHistoryIndex.current = editHistory.current.length - 1;
      }
      else if (!redoFlag.current) {
        // If a new change is made after undoing without redoing, remove forward history and add the current image to the history.
        editHistory.current.splice(editHistoryIndex.current + 1, editHistory.current.length - editHistoryIndex.current, { ...image });
        editHistoryIndex.current = editHistory.current.length - 1;
      }
      // Reset the redo flag
      redoFlag.current = false;
    }
    // Applying history limit
    if (editHistory.current.length > historyLimit.current) {
      editHistory.current.shift();
      editHistoryIndex.current--;
    }
    // Enable/Disable undo and redo buttons
    setIsUndoDisabled(editHistoryIndex.current === 0);
    setIsRedoDisabled(editHistoryIndex.current === (editHistory.current.length - 1));

    setAreChangesBeingApplied(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image]);

  async function applyChangesToImage() {
    if (!image.imageUrl) return;
    // If result image is not being generated and no change has happened, prevent doing all this again
    if ((!generatingResultFlag.current) && (image.rotate === 0) && (image.verticalScale === 1) && (image.horizontalScale === 1)) return;
    setAreChangesBeingApplied(true);

    let canvasDataUrl;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const img = new Image();
    img.src = image.imageUrl;

    // must use await here to wait for the image to load
    await new Promise((resolve, reject) => {
      img.onload = () => {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);

        if (image.rotate === 0 && image.verticalScale === 1 && image.horizontalScale === 1) {
          canvasDataUrl = canvas.toDataURL('image/png');
          resolve();
        }

        if (image.rotate !== 0) {
          if ((image.rotate / 90) % 2 !== 0) {
            canvas.width = img.naturalHeight;
            canvas.height = img.naturalWidth;
            ctx.translate(img.naturalHeight / 2, img.naturalWidth / 2);
            ctx.rotate(image.rotate * Math.PI / 180);
            ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2, img.naturalWidth, img.naturalHeight);
          }
          else {
            ctx.translate(img.naturalWidth / 2, img.naturalHeight / 2);
            ctx.rotate(image.rotate * Math.PI / 180);
            ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2, img.naturalWidth, img.naturalHeight);
          }
        }
        if (image.verticalScale !== 1) {
          ctx.translate(0, img.naturalHeight);
          ctx.scale(1, -1);
          ctx.drawImage(img,
            image.rotate !== 0 ? -img.naturalWidth / 2 : 0,
            image.rotate !== 0 ? img.naturalHeight / 2 : 0,
            img.naturalWidth,
            img.naturalHeight);
        }
        if (image.horizontalScale !== 1) {
          ctx.translate(img.naturalWidth, 0);
          ctx.scale(-1, 1);
          ctx.drawImage(img,
            image.rotate !== 0 ? img.naturalWidth / 2 : 0,
            image.rotate !== 0 ? -img.naturalHeight / 2 : 0,
            img.naturalWidth,
            img.naturalHeight);
        }
        canvasDataUrl = canvas.toDataURL('image/png');
        setImage({
          ...image,
          imageUrl: canvasDataUrl,
          rotate: image.rotate !== 0 ? 0 : image.rotate,
          verticalScale: image.verticalScale !== 1 ? 1 : image.verticalScale,
          horizontalScale: image.horizontalScale !== 1 ? 1 : image.horizontalScale,
        });
        resolve();
      }
      img.onerror = reject;
    });
    return canvasDataUrl;
  }

  const uploadImage = (e) => {
    if (e.target.files && (e.target.files.length > 0) && e.target.files[0].type.startsWith('image/')) {
      const imageUrl = URL.createObjectURL(e.target.files[0]);
      const img = new Image();
      img.src = imageUrl;
      img.onload = () => {
        const imageToSet = {
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
        }
        originalImageBackup.current = { ...imageToSet };
        setImage({ ...imageToSet });
      }
      // URL.revokeObjectURL(imageUrl) // Free memory
    }
    else {
      alert('Please select an image file.')
    }
  }

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
        redoFlag={redoFlag}
        isUndoDisabled={isUndoDisabled}
        isRedoDisabled={isRedoDisabled}
        applyChangesToImage={applyChangesToImage}
        areChangesBeingApplied={areChangesBeingApplied}
        originalImageBackup={originalImageBackup}
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
        applyChangesToImage={applyChangesToImage}
        generatingResultFlag={generatingResultFlag}
      />

      <ThemeSwitchButton />
    </div>
  );
}

export default App;