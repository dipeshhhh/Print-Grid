import React, { useState } from 'react';
import './edit-image.css';

function EditButtons() {
  const insertNewImage = () => {
  }
  const flipLeft = () => {
  }
  const flipRight = () => {
  }
  const rotateClockwise = () => {
  }
  const rotateAntiClockwise = () => {
  }
  const grayscale = () => {
  }
  const crop = () => {
  }
  const reset = () => {
  }
  return (
    <section className='section edit-buttons-section'>
      <div className='topbar'>
        <button className='topbar-button' onClick={insertNewImage}>New</button>
      </div>
      <div className='sidebar'>
        <button className='sidebar-button' onClick={flipLeft}>Flip left</button>
        <button className='sidebar-button' onClick={flipRight}>Flip right</button>
        <button className='sidebar-button' onClick={rotateClockwise}>Rotate anti clockwise</button>
        <button className='sidebar-button' onClick={rotateAntiClockwise}>Rotate clockwise</button>
        <button className='sidebar-button' onClick={grayscale}>Grayscale</button>
        <button className='sidebar-button' onClick={crop}>Crop</button>
        <button className='sidebar-button' onClick={reset}>Reset</button>
      </div>
    </section>
  )
}

function ImageSection() {
  const [image, setImage] = useState(null);
  const [isBordered, setIsBordered] = useState(false);

  const handleCheckboxChange = () => { setIsBordered(!isBordered); }
  const imageSizeHandle = () => {
  }
  const uploadImage = () => {
  }
  return (
    <section className='section image-section'>
      <div className='topbar'>
        <button className='topbar-button' onClick={imageSizeHandle}>Size</button>
        {/* For future: adjust custom image size in the topbar itself */}
        <span className='checkbox'>
          <input id='border-check' type='checkbox' checked={isBordered} onChange={handleCheckboxChange} />
          <label for='border-check'>Border</label>
        </span>
      </div>
      <div className='image-section-main'>
        {
          image ? image :
            // Drag and Drop feature here
            <button className='primary-button' onClick={uploadImage}>Upload</button>
        }
      </div>
    </section>
  )
}

function EditImage() {
  return (
    <section className='section edit-image-section'>
      <EditButtons />
      <ImageSection />
    </section>
  )
}

export default EditImage;