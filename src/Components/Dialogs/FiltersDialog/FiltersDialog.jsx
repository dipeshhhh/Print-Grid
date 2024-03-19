import React, { useEffect, useRef, useState } from 'react';
import '../Dialog.css';
import './FiltersDialog.css';

// Icons
import FilterBAndWIcon from '@mui/icons-material/FilterBAndW';
import BrightnessMediumIcon from '@mui/icons-material/BrightnessMedium';
import ContrastIcon from '@mui/icons-material/Contrast';
import OpacityIcon from '@mui/icons-material/Opacity';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import ColorLensIcon from '@mui/icons-material/ColorLens';
// import RestoreIcon from '@mui/icons-material/Restore'

//! Known Bugs:
// On clicking the reset button, everything works fine but the contrast range input does not reset to 100 yet the contrast resets to 100.

// How to fix this bug:
// The bug is caused by the fact that the input range value is not being updated when the reset button is clicked. This is because the input range value is being set to the value of the image object and not the value of the input range. To fix this, the input range value should be set to the value of the input range and not the value of the image object.

function FiltersDialog({ referrer, isUserAddingFilters, setIsUserAddingFilters, image, setImage }) {
  const previewImageRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);
  const onClose = () => { setIsUserAddingFilters(false) };

  useEffect(() => {
    setPreviewImage({ ...image });
    referrer.current.onclose = onClose;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image, isUserAddingFilters]);

  const closeDialog = () => { referrer.current.close(); setIsUserAddingFilters(false); }
  const confirmDialog = () => {
    setImage({
      ...image,
      brightness: previewImage.brightness,
      contrast: previewImage.contrast,
      saturate: previewImage.saturate,
      grayscale: previewImage.grayscale,
      sepia: previewImage.sepia,
      hueRotate: previewImage.hueRotate,
    });
    referrer.current.close();
    setIsUserAddingFilters(false);
  }
  const grayscale = () => { setPreviewImage({ ...previewImage, grayscale: previewImage.grayscale === 1 ? 0 : 1 }) }
  const setBrightness = (e) => { setPreviewImage({ ...previewImage, brightness: e.target.value }) }
  const setContrast = (e) => { setPreviewImage({ ...previewImage, contrast: e.target.value }) }
  const setSaturate = (e) => { setPreviewImage({ ...previewImage, saturate: e.target.value }) }
  const setSepia = (e) => { setPreviewImage({ ...previewImage, sepia: e.target.value }) }
  const setHueRotate = (e) => { setPreviewImage({ ...previewImage, hueRotate: e.target.value }) }
  // const resetFilters = () => { setPreviewImage({ ...image }) }

  return (
    <dialog className="dialog filter-dialog" ref={referrer} style={isUserAddingFilters ? { display: 'flex' } : {}} >
      <section className='dialog-text'>
        <h5 className='dialog-title'>Filters</h5>
      </section>
      {isUserAddingFilters &&
        <main className="filters-main">
          <section className='filters-preview-section'>
            <img
              ref={previewImageRef}
              src={previewImage.imageUrl}
              alt='Preview'
              className='filters-preview-image'
              style={{
                transform: `
                  rotate(${previewImage.rotate}deg)
                  scale(${previewImage.verticalScale}, ${previewImage.horizontalScale})
                `,
                filter: `
                  brightness(${previewImage.brightness}%)
                  contrast(${previewImage.contrast}%)
                  saturate(${previewImage.saturate}%)
                  grayscale(${previewImage.grayscale})
                  sepia(${previewImage.sepia}%)
                  hue-rotate(${previewImage.hueRotate}deg)
                `,
              }}
            />
          </section>
          <section className='filters-adjustment-section'>

            <section className='filter-adjustment-items'>
              <div className='filters-adjustment-item'>
                <span className='filter-adjustment-label'><BrightnessMediumIcon />Brightness:</span>
                <input className='filter-adjustment-input' type='range' min="0" max="200" value={previewImage.brightness} onChange={setBrightness} />
                <input className='filter-adjustment-input filter-adjustment-number-input' type='number' min="1" max="200" value={previewImage.brightness} onChange={setBrightness} />
              </div>
              <div className='filters-adjustment-item'>
                <span className='filter-adjustment-label'><ContrastIcon />Contrast:</span>
                <input className='filter-adjustment-input' type='range' min="0" max="200" value={previewImage.constrast} onChange={setContrast} />
                <input className='filter-adjustment-input filter-adjustment-number-input' type='number' min="1" max="200" value={previewImage.contrast} onChange={setContrast} />
              </div>
              <div className='filters-adjustment-item'>
                <span className='filter-adjustment-label'><OpacityIcon />Saturate:</span>
                <input className='filter-adjustment-input' type='range' min="0" max="200" value={previewImage.saturate} onChange={setSaturate} />
                <input className='filter-adjustment-input filter-adjustment-number-input' type='number' min="0" max="200" value={previewImage.saturate} onChange={setSaturate} />
              </div>
              <div className='filters-adjustment-item'>
                <span className='filter-adjustment-label'><WhatshotIcon />Sepia:</span>
                <input className='filter-adjustment-input' type='range' min="0" max="100" value={previewImage.sepia} onChange={setSepia} />
                <input className='filter-adjustment-input filter-adjustment-number-input' type='number' min="0" max="100" value={previewImage.sepia} onChange={setSepia} />
              </div>
              <div className='filters-adjustment-item'>
                <span className='filter-adjustment-label'><ColorLensIcon />Hue:</span>
                <input className='filter-adjustment-input' type='range' min="0" max="360" value={previewImage.hueRotate} onChange={setHueRotate} />
                <input className='filter-adjustment-input filter-adjustment-number-input' type='number' min="0" max="360" value={previewImage.hueRotate} onChange={setHueRotate} />
              </div>
              <div className='filters-adjustment-item'>
                <span className='filter-adjustment-label'><FilterBAndWIcon />Grayscale:</span>
                <input className='filter-adjustment-input' type='checkbox' checked={previewImage.grayscale === 1} onChange={grayscale} />
              </div>
              <div className='empty-gap'></div>
              {/* Will implement this one later (doesn't look great on the layout so I removed it for now) */}
              {/* <button className='edit-button filter-reset-button' onClick={resetFilters}><RestoreIcon /> Reset</button> */}
            </section>
          </section>
        </main>
      }
      <section className='dialog-buttons filter-dialog-buttons'>
        <button className='dialog-button cancel-button' onClick={closeDialog} autoFocus>Cancel</button>
        <button className='dialog-button confirm-button' onClick={confirmDialog}>Apply</button>
      </section>
    </dialog>
  )
}

export default FiltersDialog;