import React from "react";
import './EditButton.css';

function EditButton({icon, onClickFunction, text}) {
  return(
    <button 
    className='edit-button'
    onClick={onClickFunction}
    >
      {icon}
    </button>
  )
}

export default EditButton