import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// Utils
import { areObjectsDeepEqual } from './utils/helpers.js';
import { INITIAL_IMAGE_SIZES, INITIAL_SHEET_SIZES, INITIAL_IMAGE_STATE } from './utils/initialValues.js';
import {
  HISTORY_LIMIT,
  INPUT_IMAGE_SIZES_LOCAL_STORAGE_KEY,
  RESULT_IMAGE_SHEET_SIZES_LOCAL_STORAGE_KEY,
  LAST_SELECTED_IMAGE_SIZE_LOCAL_STORAGE_KEY,
  LAST_SELECTED_SHEET_SIZE_LOCAL_STORAGE_KEY
} from './utils/configs.js';

// Components
import ThemeSwitchButton from './components/ThemeSwitchButton/ThemeSwitchButton.jsx';

// Sections for the page
import EditButtons from './components/PageSections/EditButtons/EditButtons.jsx';
import ImageSection from './components/PageSections/ImageSection/ImageSection.jsx';
import GenerateImage from './components/PageSections/GenerateImage/GenerateImage.jsx';

function App() {
  // Input Referrer: for the file input element
  const inputRef = useRef(null);
  const originalImageBackup = useRef(null);

  // Edit History
  const editHistory = useRef([]);
  const editHistoryIndex = useRef(-1);
  const redoFlag = useRef(false); // Flag to prevent adding duplicate entries in the history when redo is clicked after undo

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
  // Checking existance in local storage
  const [imageSizes, setImageSizes] = useState(
    (localStorage.getItem(INPUT_IMAGE_SIZES_LOCAL_STORAGE_KEY))
      ?
      [...JSON.parse(localStorage.getItem(INPUT_IMAGE_SIZES_LOCAL_STORAGE_KEY))]
      :
      [...INITIAL_IMAGE_SIZES]
  );
  const [sheetSizes, setSheetSizes] = useState(
    (localStorage.getItem(RESULT_IMAGE_SHEET_SIZES_LOCAL_STORAGE_KEY))
      ?
      [...JSON.parse(localStorage.getItem(RESULT_IMAGE_SHEET_SIZES_LOCAL_STORAGE_KEY))]
      :
      [...INITIAL_SHEET_SIZES]
  );
  const [selectedImageSize, setSelectedImageSize] = useState(
    (localStorage.getItem(LAST_SELECTED_IMAGE_SIZE_LOCAL_STORAGE_KEY))
      ?
      JSON.parse(localStorage.getItem(LAST_SELECTED_IMAGE_SIZE_LOCAL_STORAGE_KEY))
      :
      imageSizes[0]
  );
  const [selectedSheetSize, setSelectedSheetSize] = useState(
    (localStorage.getItem(LAST_SELECTED_SHEET_SIZE_LOCAL_STORAGE_KEY))
    ?
    JSON.parse(localStorage.getItem(LAST_SELECTED_SHEET_SIZE_LOCAL_STORAGE_KEY))
    :
    sheetSizes[0]
    );

  // Image
  const [isBordered, setIsBordered] = useState(false);
  const [image, setImage] = useState({ ...INITIAL_IMAGE_STATE });

  useEffect(() => {
    localStorage.setItem(LAST_SELECTED_IMAGE_SIZE_LOCAL_STORAGE_KEY, JSON.stringify(selectedImageSize));
    localStorage.setItem(LAST_SELECTED_SHEET_SIZE_LOCAL_STORAGE_KEY, JSON.stringify(selectedSheetSize));
  }, [selectedImageSize, selectedSheetSize]);

  useEffect(() => {
    if (!image.url) {
      setIsEditDisabled(true);
      setIsGenerateDisabled(true);
      return;
    };
    setIsEditDisabled(false);
    setIsGenerateDisabled(false);

    // Add the current image to the edit history
    if ((!areObjectsDeepEqual(editHistory.current[editHistoryIndex.current], image)) && (!areChangesBeingApplied)) {
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
    if (editHistory.current.length > HISTORY_LIMIT) {
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
    if (!image.url) return;
    // If result image is not being generated and no change has happened, prevent doing all this again
    if ((!generatingResultFlag.current) && (image.rotate === 0) && (image.verticalScale === 1) && (image.horizontalScale === 1)) return;
    setAreChangesBeingApplied(true);

    let canvasDataUrl;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const img = new Image();
    img.src = image.url;

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
          url: canvasDataUrl,
          naturalHeight: image.rotate !== 0 ? img.naturalWidth : img.naturalHeight,
          naturalWidth: image.rotate !== 0 ? img.naturalHeight : img.naturalWidth,
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

  return (
    <div className='App'>
      <EditButtons
        image={image}
        setImage={setImage}
        inputRef={inputRef}
        editHistory={editHistory}
        editHistoryIndex={editHistoryIndex}
        redoFlag={redoFlag}
        isEditDisabled={isEditDisabled}
        isUndoDisabled={isUndoDisabled}
        isRedoDisabled={isRedoDisabled}
        applyChangesToImage={applyChangesToImage}
        originalImageBackup={originalImageBackup}
        selectedImageSize={selectedImageSize}
        isUserAddingFilters={isUserAddingFilters}
        setIsUserAddingFilters={setIsUserAddingFilters}
        isUserCropping={isUserCropping}
        setIsUserCropping={setIsUserCropping}
        areChangesBeingApplied={areChangesBeingApplied}
      />

      <ImageSection
        image={image}
        setImage={setImage}
        originalImageBackup={originalImageBackup}
        isBordered={isBordered}
        setIsBordered={setIsBordered}
        inputRef={inputRef}
        imageSizes={imageSizes}
        setImageSizes={setImageSizes}
        selectedImageSize={selectedImageSize}
        setSelectedImageSize={setSelectedImageSize}
      />

      <GenerateImage
        image={image}
        isBordered={isBordered}
        isGenerateDisabled={isGenerateDisabled}
        generatingResultFlag={generatingResultFlag}
        selectedImageSize={selectedImageSize}
        sheetSizes={sheetSizes}
        setSheetSizes={setSheetSizes}
        selectedSheetSize={selectedSheetSize}
        setSelectedSheetSize={setSelectedSheetSize}
        applyChangesToImage={applyChangesToImage}
        areChangesBeingApplied={areChangesBeingApplied}
      />

      <ThemeSwitchButton />
    </div>
  );
}

export default App;