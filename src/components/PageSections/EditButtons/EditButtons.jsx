import React, { useRef } from "react";
import '../PageSections.css';
import './EditButtons.css';

// Components
import EditButton from "../../EditButton/EditButton";
import ConfirmationDialog from "../../Dialogs/ConfirmationDialog/ConfirmationDialog";
import FiltersDialog from "../../Dialogs/FiltersDialog/FiltersDialog";
import CropImageDialog from "../../Dialogs/CropImageDialog/CropImageDialog";

// Icons
import SwapVertIcon from '@mui/icons-material/SwapVert';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import Rotate90DegreesCcwIcon from '@mui/icons-material/Rotate90DegreesCcw';
import Rotate90DegreesCwIcon from '@mui/icons-material/Rotate90DegreesCw';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import CropIcon from '@mui/icons-material/Crop';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import RestoreIcon from '@mui/icons-material/Restore';

function EditButtons({
  image,
  setImage,
  inputRef,
  editHistory,
  editHistoryIndex,
  redoFlag,
  isEditDisabled,
  isUndoDisabled,
  isRedoDisabled,
  applyChangesToImage,
  originalImageBackup,

  // Prop drilling
  selectedImageSize,
  isUserAddingFilters,
  setIsUserAddingFilters,
  isUserCropping,
  setIsUserCropping,
  areChangesBeingApplied
}) {
  const cropImageDialogRef = useRef(null);
  const confirmNewImageDialogRef = useRef(null);
  const filterDialogRef = useRef(null);

  const handleNewImageButton = () => { if (image.url) confirmNewImageDialogRef.current?.showModal(); else uploadNewImage(); }
  const uploadNewImage = () => { inputRef.current.click(); }
  const flipHorizontal = () => { setImage({ ...image, horizontalScale: image.horizontalScale === 1 ? -1 : 1 }) }
  const flipVertical = () => { setImage({ ...image, verticalScale: image.verticalScale === 1 ? -1 : 1 }) }
  const rotateClockwise = () => { setImage({ ...image, rotate: image.rotate + 90 }) }
  const rotateAntiClockwise = () => { setImage({ ...image, rotate: image.rotate - 90 }) }
  const filters = () => { applyChangesToImage(); filterDialogRef.current.showModal(); setIsUserAddingFilters(true); }
  const crop = () => { applyChangesToImage(); cropImageDialogRef.current.showModal(); setIsUserCropping(true); }
  const undo = () => { if (editHistoryIndex.current > 0) setImage({ ...editHistory.current[--editHistoryIndex.current] }); }
  const redo = () => { if (editHistoryIndex.current < (editHistory.current.length - 1)) redoFlag.current = true; setImage({ ...editHistory.current[++editHistoryIndex.current] }); }
  const reset = () => { setImage({ ...originalImageBackup.current }); }

  // Edit buttons (to prevent repetition of code)
  const buttons = [
    { icon: <SwapVertIcon />, text: 'Flip vertical', onClickFunction: flipVertical, isDisabled: isEditDisabled },
    { icon: <SwapHorizIcon />, text: 'Flip horizontal', onClickFunction: flipHorizontal, isDisabled: isEditDisabled },
    { icon: <Rotate90DegreesCwIcon />, text: 'Rotate clockwise', onClickFunction: rotateClockwise, isDisabled: isEditDisabled },
    { icon: <Rotate90DegreesCcwIcon />, text: 'Rotate counter-clockwise', onClickFunction: rotateAntiClockwise, isDisabled: isEditDisabled },
    { icon: <FilterAltIcon />, text: 'Filters', onClickFunction: filters, isDisabled: isEditDisabled },
    { icon: <CropIcon />, text: 'Crop', onClickFunction: crop, isDisabled: isEditDisabled },
    { icon: <UndoIcon />, text: 'Undo', onClickFunction: undo, isDisabled: (isUndoDisabled || isEditDisabled) },
    { icon: <RedoIcon />, text: 'Redo', onClickFunction: redo, isDisabled: (isRedoDisabled || isEditDisabled) },
    { icon: <RestoreIcon />, text: 'Reset', onClickFunction: reset, isDisabled: isEditDisabled }
  ];

  return (
    <section className='section edit-buttons-section'>
      <div className='topbar edit-button-topbar'>
        <button className='topbar-button' onClick={handleNewImageButton}>New</button>
        <ConfirmationDialog
          title={'Open new image?'}
          message={'This will discard all changes made to the current image.'}
          referrer={confirmNewImageDialogRef}
          onConfirm={uploadNewImage}
        />
      </div>
      <div className='sidebar'>
        {buttons.map((button) => (
          <EditButton
            key={button.text}
            icon={button.icon}
            text={button.text}
            onClickFunction={button.onClickFunction}
            isDisabled={button.isDisabled}
          />
        ))
        }
      </div>
      <FiltersDialog
        referrer={filterDialogRef}
        image={image}
        setImage={setImage}
        isUserAddingFilters={isUserAddingFilters}
        setIsUserAddingFilters={setIsUserAddingFilters}
        areChangesBeingApplied={areChangesBeingApplied}
      />
      <CropImageDialog
        referrer={cropImageDialogRef}
        image={image}
        setImage={setImage}
        selectedImageSize={selectedImageSize}
        isUserCropping={isUserCropping}
        setIsUserCropping={setIsUserCropping}
        areChangesBeingApplied={areChangesBeingApplied}
      />
    </section>
  )
}

// EditButtons.propTypes = {
//   image: PropTypes.object.isRequired,
//   setImage: PropTypes.func.isRequired,
//   inputRef: PropTypes.object.isRequired,
//   editHistory: PropTypes.object.isRequired,
//   editHistoryIndex: PropTypes.object.isRequired,
//   redoFlag: PropTypes.object.isRequired,
//   isEditDisabled: PropTypes.bool.isRequired,
//   isUndoDisabled: PropTypes.bool.isRequired,
//   isRedoDisabled: PropTypes.bool.isRequired,
//   applyChangesToImage: PropTypes.func.isRequired,
//   originalImageBackup: PropTypes.object.isRequired,
//   selectedImageSize: PropTypes.object.isRequired,
//   isUserAddingFilters: PropTypes.bool.isRequired,
//   setIsUserAddingFilters: PropTypes.func.isRequired,
//   isUserCropping: PropTypes.bool.isRequired,
//   setIsUserCropping: PropTypes.func.isRequired,
//   areChangesBeingApplied: PropTypes.bool.isRequired
// }

export default EditButtons;