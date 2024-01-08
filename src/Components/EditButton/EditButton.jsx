import React from "react";
import './EditButton.css';

function EditButton({icon, onClickFunction, text, isEditDisabled}) {
  return(
    <button 
    className='edit-button'
    onClick={onClickFunction}
    disabled={isEditDisabled}
    >
      {icon}
    </button>
  )
}

export default EditButton