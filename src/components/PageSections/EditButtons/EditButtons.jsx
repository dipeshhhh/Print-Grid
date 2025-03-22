import React, { useRef, useState } from "react";
import '../PageSections.css';
import './EditButtons.css';

// Components
import EditButton from "../../EditButton/EditButton";
import ConfirmationDialog from "../../Dialogs/ConfirmationDialog/ConfirmationDialog";
import FiltersDialog from "../../Dialogs/FiltersDialog/FiltersDialog";
import CropImageDialog from "../../Dialogs/CropImageDialog/CropImageDialog";

import { useImage } from "../../../contexts/imageContext";
import { useChangeManagement } from "../../../contexts/ChangeManagementContext";
import { useHistory } from "../../../contexts/HistoryContext";

function EditButtons({}) {
  const {
    inputRef,
    image,
    setImage,
    originalImageBackup,
    applyChangesToImage
  } = useImage();
  const {
    setIsUserCropping,
    isEditDisabled,
    isUndoDisabled,
    isRedoDisabled
  } = useChangeManagement();
  const {
    editHistory,
    editHistoryIndex,
    redoFlag
  } = useHistory();
  const cropImageDialogRef = useRef(null);
  const confirmNewImageDialogRef = useRef(null);
  const filterDialogRef = useRef(null);
  const [isUserAddingFilters, setIsUserAddingFilters] = useState(false);

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
    { icon: 'swap_vert', text: 'Flip vertical', onClickFunction: flipVertical, isDisabled: isEditDisabled },
    { icon: 'swap_horiz', text: 'Flip horizontal', onClickFunction: flipHorizontal, isDisabled: isEditDisabled },
    { icon: 'rotate_90_degrees_cw', text: 'Rotate clockwise', onClickFunction: rotateClockwise, isDisabled: isEditDisabled },
    { icon: 'rotate_90_degrees_ccw', text: 'Rotate counter-clockwise', onClickFunction: rotateAntiClockwise, isDisabled: isEditDisabled },
    { icon: 'tune', text: 'Filters', onClickFunction: filters, isDisabled: isEditDisabled },
    { icon: 'crop', text: 'Crop', onClickFunction: crop, isDisabled: isEditDisabled },
    { icon: 'undo', text: 'Undo', onClickFunction: undo, isDisabled: (isUndoDisabled || isEditDisabled) },
    { icon: 'redo', text: 'Redo', onClickFunction: redo, isDisabled: (isRedoDisabled || isEditDisabled) },
    { icon: 'history', text: 'Reset', onClickFunction: reset, isDisabled: isEditDisabled }
  ];

  return (
    <section className='section edit-buttons-section'>
      <div className='topbar edit-button-topbar'>
        <button className='topbar-button edit-button-topbar-button' onClick={handleNewImageButton}>New</button>
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
        isUserAddingFilters={isUserAddingFilters}
        setIsUserAddingFilters={setIsUserAddingFilters}
      />
      <CropImageDialog
        referrer={cropImageDialogRef}
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