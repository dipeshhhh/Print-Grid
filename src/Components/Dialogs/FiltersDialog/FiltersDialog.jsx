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
import RestoreIcon from '@mui/icons-material/Restore'

//! Known Bugs:
// On clicking the reset button, everything works fine but the contrast range input does not reset to 100 yet the contrast resets to 100.

function FilterRangeInput({ icon, label, min, max, value, onChange }) {
  return (
    <div className='filters-adjustment-item'>
      <span className='filter-adjustment-label'>{icon} {label}</span>
      {window.innerWidth < 375 ?
        <span className='responsive-adjustment-input'>
          <input className='filter-adjustment-input' type='range' min={min} max={max} value={value} onChange={onChange} />
          <input className='filter-adjustment-input filter-adjustment-number-input' type='number' min={min} max={max} value={value} onChange={onChange} />
        </span>
        :
        <>
          <input className='filter-adjustment-input' type='range' min={min} max={max} value={value} onChange={onChange} />
          <input className='filter-adjustment-input filter-adjustment-number-input' type='number' min={min} max={max} value={value} onChange={onChange} />
        </>
      }
    </div>
  )
}

function FilterCheckboxInput({ icon, label, checked, onChange }) {
  return (
    <div className='filters-adjustment-item'>
      {window.innerWidth < 375 ?
        <span className='responsive-adjustment-input'>
          <span className='filter-adjustment-label'>{icon} {label}</span>
          <input className='filter-adjustment-input' type='checkbox' checked={checked} onChange={onChange} />
        </span>
        :
        <>
          <span className='filter-adjustment-label'>{icon} {label}</span>
          <input className='filter-adjustment-input' type='checkbox' checked={checked} onChange={onChange} />
        </>
      }
    </div>
  )
}

function FiltersDialog({ referrer, isUserAddingFilters, setIsUserAddingFilters, image, setImage, areChangesBeingApplied }) {
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
  const resetFilters = () => { setPreviewImage({ ...image }) }

  const filterRangeAdjustments = [
    { icon: <BrightnessMediumIcon />, label: 'Brightness:', min: 0, max: 200, value: previewImage?.brightness, onChange: setBrightness },
    { icon: <ContrastIcon />, label: 'Contrast:', min: 0, max: 200, value: previewImage?.contrast, onChange: setContrast },
    { icon: <OpacityIcon />, label: 'Saturate:', min: 0, max: 200, value: previewImage?.saturate, onChange: setSaturate },
    { icon: <WhatshotIcon />, label: 'Sepia:', min: 0, max: 100, value: previewImage?.sepia, onChange: setSepia },
    { icon: <ColorLensIcon />, label: 'Hue:', min: 0, max: 360, value: previewImage?.hueRotate, onChange: setHueRotate },
  ]

  const filterChecboxAdjustments = [
    { icon: <FilterBAndWIcon />, label: 'Grayscale', checked: previewImage?.grayscale === 1, onChange: grayscale }
  ]

  return (
    <dialog className="dialog filter-dialog" ref={referrer} style={isUserAddingFilters ? { display: 'flex' } : {}} >
      {areChangesBeingApplied ? <div className='dialog-loading-overlay'>Loading...</div> : <></>}
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
                  scale(${image.horizontalScale}, ${image.verticalScale})
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
              {
                filterRangeAdjustments.map((filterRangeAdjustment) => (
                  <FilterRangeInput
                    key={filterRangeAdjustment.label}
                    icon={filterRangeAdjustment.icon}
                    label={filterRangeAdjustment.label}
                    min={filterRangeAdjustment.min}
                    max={filterRangeAdjustment.max}
                    value={filterRangeAdjustment.value}
                    onChange={filterRangeAdjustment.onChange}
                  />
                ))
              }
              {
                filterChecboxAdjustments.map((filterCheckboxAdjustment) => (
                  <FilterCheckboxInput
                    key={filterCheckboxAdjustment.label}
                    icon={filterCheckboxAdjustment.icon}
                    label={filterCheckboxAdjustment.label}
                    checked={filterCheckboxAdjustment.checked}
                    onChange={filterCheckboxAdjustment.onChange}
                  />
                ))
              }
              <div className='empty-gap'></div>
              <button className='dialog-button  filter-reset-button' onClick={resetFilters}><RestoreIcon />Reset</button>
            </section>
          </section>
        </main>
      }
      <section className='dialog-buttons filter-dialog-buttons'>
        <button className='dialog-button cancel-button' onClick={closeDialog} autoFocus disabled={areChangesBeingApplied}>Cancel</button>
        <button className='dialog-button confirm-button' onClick={confirmDialog} disabled={areChangesBeingApplied}>Apply</button>
      </section>
    </dialog>
  )
}

// FilterRangeInput.propTypes = {
//   icon: PropTypes.element.isRequired,
//   label: PropTypes.string.isRequired,
//   min: PropTypes.number.isRequired,
//   max: PropTypes.number.isRequired,
//   value: PropTypes.number.isRequired,
//   onChange: PropTypes.func.isRequired,
// }

// FilterCheckboxInput.propTypes = {
//   icon: PropTypes.element.isRequired,
//   label: PropTypes.string.isRequired,
//   checked: PropTypes.bool.isRequired,
//   onChange: PropTypes.func.isRequired,
// }

// FiltersDialog.propTypes = {
//   referrer: PropTypes.object.isRequired,
//   isUserAddingFilters: PropTypes.bool.isRequired,
//   setIsUserAddingFilters: PropTypes.func.isRequired,
//   image: PropTypes.object.isRequired,
//   setImage: PropTypes.func.isRequired,
//   areChangesBeingApplied: PropTypes.bool.isRequired,
// }

export default FiltersDialog;