import React, { useRef, useState, useEffect } from 'react';
import '../PageSections.css';
import './GenerateImage.css';

// Utils
import { DOWNLOAD_RESULT_IMAGE_NAME, INPUT_IMAGE_BACKGROUND_COLOR, INPUT_IMAGE_BORDER_COLOR, INPUT_IMAGE_BORDER_WIDTH, RESULT_IMAGE_BACKGROUND_COLOR, RESULT_IMAGE_SHEET_SIZES_LOCAL_STORAGE_KEY } from '../../../utils/configs.js';
import { INITIAL_SHEET_SIZES } from '../../../utils/initialValues.js';

// Components
import CustomSizeDialog from '../../Dialogs/CustomSizeDialog/CustomSizeDialog.jsx';
import ConfirmationDialog from '../../Dialogs/ConfirmationDialog/ConfirmationDialog.jsx';

import { useImage } from '../../../contexts/imageContext.jsx';
import { useChangeManagement } from '../../../contexts/ChangeManagementContext.jsx';

function GenerateImage({}) {
  const {
    isGenerateDisabled,
    generatingResultFlag
  } = useChangeManagement();
  const {
    image,
    isBordered,
    applyChangesToImage,
    selectedImageSize,
    sheetSizes,
    setSheetSizes,
    selectedSheetSize,
    setSelectedSheetSize,
  } = useImage();
  const [resultImage, setResultImage] = useState(null);
  const [isDownloadDisabled, setIsDownloadDisabled] = useState(true);
  const [isResultLoading, setIsResultLoading] = useState(false);
  const customSheetSizeDialogRef = useRef(null);
  const sheetSizeSelectorRef = useRef(null);
  const confirmClearCustomSizesRef = useRef(null);

  useEffect(() => {
    confirmClearCustomSizesRef.current.onclose = function () {
      sheetSizeSelectorRef.current.value = selectedSheetSize.name;
    }
  }, [confirmClearCustomSizesRef, selectedSheetSize]);

  useEffect(() => { // update selector value, incase something else changes selectedSheetSize
    sheetSizeSelectorRef.current.value = selectedSheetSize.name;
  }, [selectedSheetSize]);

  const generateResultImage = async () => {
    if (!image.url) return; // Prevent generating result if no image is uploaded
    if (generatingResultFlag.current) return; // Prevent multiple result generation at the same time

    // Set the flag to prevent multiple result generation at the same time
    // Flag also allows generation of new canvas to apply changes to the input image in applyChangesToImage function.
    // Also set the loading state
    generatingResultFlag.current = true;
    setIsResultLoading(true);

    // Configurations for the result image
    const columnGap = 3; // Gap between images in a column (px)
    const rowGap = 30; // Gap between images in a row (px)
    const noOfColumns = Math.floor(selectedSheetSize.width / (selectedImageSize.width + (columnGap * 2)));
    const noOfRows = Math.floor(selectedSheetSize.height / (selectedImageSize.height + rowGap));

    // Canvas for the final sheet image
    const resultImageCanvas = document.createElement('canvas');
    const resultImageCtx = resultImageCanvas.getContext('2d');
    resultImageCanvas.width = selectedSheetSize.width;
    resultImageCanvas.height = selectedSheetSize.height;
    resultImageCtx.fillStyle = RESULT_IMAGE_BACKGROUND_COLOR;
    resultImageCtx.fillRect(0, 0, resultImageCanvas.width, resultImageCanvas.height);

    try {
      const url = await applyChangesToImage();

      const inputImage = new Image();
      inputImage.onload = () => {
        // Canvas for the input image
        const inputImageCanvas = document.createElement('canvas');
        const inputImageCtx = inputImageCanvas.getContext('2d');
        inputImageCanvas.width = selectedImageSize.width;
        inputImageCanvas.height = selectedImageSize.height;
        inputImageCtx.fillStyle = INPUT_IMAGE_BACKGROUND_COLOR;
        inputImageCtx.fillRect(0, 0, inputImageCanvas.width, inputImageCanvas.height);
        inputImageCtx.filter = `
          brightness(${image.brightness}%)
          contrast(${image.contrast}%)
          saturate(${image.saturate}%)
          grayscale(${image.grayscale})
          sepia(${image.sepia}%)
          hue-rotate(${image.hueRotate}deg)
        `;

        // Adjust and center the image to fit the selected image size
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
        inputImageCtx.drawImage(inputImage, x, y, newWidth, newHeight);

        if (isBordered) { // Add border to the image
          // Border configurations
          let borderWidth = INPUT_IMAGE_BORDER_WIDTH;
          // Adjust border width according to the size of the image
          if ((selectedImageSize.width < 10) || (selectedImageSize.height < 10)) borderWidth = 0;
          else if ((selectedImageSize.width < 30) || (selectedImageSize.height < 30)) borderWidth = 1;

          // Canvas for the bordered input image
          const borderedInputImageCanvas = document.createElement('canvas');
          const borderedInputImageCtx = borderedInputImageCanvas.getContext('2d');
          borderedInputImageCanvas.width = selectedImageSize.width;
          borderedInputImageCanvas.height = selectedImageSize.height;
          borderedInputImageCtx.fillStyle = INPUT_IMAGE_BORDER_COLOR;
          borderedInputImageCtx.fillRect(0, 0, borderedInputImageCanvas.width, borderedInputImageCanvas.height);

          borderedInputImageCtx.drawImage(
            inputImageCanvas,
            borderWidth,
            borderWidth,
            selectedImageSize.width - (borderWidth * 2),
            selectedImageSize.height - (borderWidth * 2)
          );

          // Draw the bordered input image on the input image canvas: overlapping the original input image without borders
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

        // Setting the result image and reset the flags and states
        setResultImage(resultImageCanvas.toDataURL('image/png'));
        generatingResultFlag.current = false;
        setIsDownloadDisabled(false);
        setIsResultLoading(false);
      }
      inputImage.src = url;
    } catch (error) {
      generateResultImage.current = false;
      setIsResultLoading(false);
    }

  }
  const downloadImage = () => {
    if (!resultImage) return;
    const link = document.createElement('a');
    link.href = resultImage;
    link.download = DOWNLOAD_RESULT_IMAGE_NAME;
    link.click();
  }

  const handleSizeChange = (e) => {
    if ((e.target.value !== 'custom') && (e.target.value !== 'clearCustoms')) setSelectedSheetSize(sheetSizes.find(sheetSize => sheetSize.name === e.target.value));
    else if (e.target.value === 'custom') customSheetSizeDialogRef.current.showModal();
    else if (e.target.value === 'clearCustoms') confirmClearCustomSizesRef.current.showModal();
  }

  const clearCustomSizes = () => {
    const initialSizes = [...INITIAL_SHEET_SIZES];
    setSheetSizes(initialSizes);
    setSelectedSheetSize(initialSizes[0]);
    localStorage.removeItem(RESULT_IMAGE_SHEET_SIZES_LOCAL_STORAGE_KEY);
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
          {localStorage.getItem(RESULT_IMAGE_SHEET_SIZES_LOCAL_STORAGE_KEY) && <option value='clearCustoms'>Remove/Clear Custom Sizes</option>}
        </select>
        <CustomSizeDialog
          referrer={customSheetSizeDialogRef}
          selectorRef={sheetSizeSelectorRef}
          title='Custom Sheet Size'
          sizes={sheetSizes}
          setSizes={setSheetSizes}
          selectedSize={selectedSheetSize}
          setSelectedSize={setSelectedSheetSize}
          localStorageKey={RESULT_IMAGE_SHEET_SIZES_LOCAL_STORAGE_KEY}
        />
        <ConfirmationDialog
          referrer={confirmClearCustomSizesRef}
          title='Clear custom image sizes?'
          message='This will remove all the saved custom image sizes on this site.'
          onConfirm={clearCustomSizes}
        />
        <button className='primary-button topbar-button' onClick={generateResultImage} disabled={isGenerateDisabled}>Generate</button>
        <button className='primary-button topbar-button' onClick={downloadImage} disabled={isDownloadDisabled}>Download</button>
      </div>
      <div className='generate-image-section-main'>
        {resultImage && !isResultLoading ?
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

// GenerateImage.propTypes = {
//   image: PropTypes.object.isRequired,
//   isBordered: PropTypes.bool.isRequired,
//   isGenerateDisabled: PropTypes.bool.isRequired,
//   generatingResultFlag: PropTypes.object.isRequired,
//   selectedImageSize: PropTypes.object.isRequired,
//   sheetSizes: PropTypes.array.isRequired,
//   setSheetSizes: PropTypes.func.isRequired,
//   selectedSheetSize: PropTypes.object.isRequired,
//   setSelectedSheetSize: PropTypes.func.isRequired,
//   applyChangesToImage: PropTypes.func.isRequired
// }

export default GenerateImage;