import React from "react";
import './EditButton.css';

function EditButton({icon, onClickFunction, text, isDisabled}) {
  return(
    <button 
    className='edit-button'
    onClick={onClickFunction}
    disabled={isDisabled}
    >
      {icon}
    </button>
  )
}

// EditButton.defaultProps = {
//   isDisabled: false
// }
// EditButton.propTypes = {
//   icon: PropTypes.object.isRequired,
//   text: PropTypes.string.isRequired,
//   onClickFunction: PropTypes.func.isRequired,
//   isDisabled: PropTypes.bool.isRequired
// }

export default EditButton