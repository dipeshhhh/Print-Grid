import React from "react";
import './EditButton.css';

function EditButton({ icon, onClickFunction, text, isDisabled }) {
  return (
    <div className='edit-button-container'>
      <button
        className='edit-button'
        data-tooltip={`${text}`}
        onClick={onClickFunction}
        disabled={isDisabled}
      >
        <span className="material-symbols-outlined">{icon}</span>
      </button>
    </div>
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