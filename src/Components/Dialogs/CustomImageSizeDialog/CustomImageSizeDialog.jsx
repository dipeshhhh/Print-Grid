import React from 'react';
import '../Dialog.css';
import './CustomImageSizeDialog.css';

function CustomImageSizeDialog({ referrer }) {
  return (
    <dialog className="dialog custom-image-size-dialog" ref={referrer}>
      <form method='dialog'>
        <div className='dialog-text'>
          <h5 className='dialog-title'>Custom Image Size</h5>
          <div className='custom-image-size-inputs'>
            <div className='custom-image-size-input'>
              <label className='custom-image-size-input-label'>Width: </label>
              <input type='number' className='custom-image-size-input-input custom-image-width' />
              <select className='custom-image-size-input-unit'>
                <option>cm</option>
                <option>inch</option>
                <option>px</option>
              </select>
            </div>
            <div className='custom-image-size-input'>
              <label className='custom-image-size-input-label'>Height: </label>
              <input type='number' className='custom-image-size-input-input custom-image-height' />
              <select className='custom-image-size-input-unit'>
                <option>cm</option>
                <option>inch</option>
                <option>px</option>
              </select>
            </div>
          </div>
        </div>
        <div className='dialog-buttons'>
          <button className='dialog-button cancel-button' onClick={() => { referrer.current.close() }} autoFocus>Cancel</button>
          <button className='dialog-button confirm-button' onClick={() => { referrer.current.close() }}>Confirm</button>
        </div>
      </form>
    </dialog>
  )
}

export default CustomImageSizeDialog;