import React from 'react';
import './edit-image.css';

function EditButtons(){
  // Top-bar: UploadNewImage-button (opens a confirmation pop-up if an image is already loaded)
  // Buttons:-
  // Flip
  // Rotate
  // Grayscale
  // Crop (opens a pop-up)
  // Reset
  return(
    <></>
  )
}

function ImageSection() {
  // Top-bar: imageSize-button (opens a pop-up), border-checkbox
  // Main section:-
  // Drag and Drop
  // Upload button in center
  return(
    <></>
  )
}

function EditImage() {
  return(
    <>
      <EditButtons />
      <ImageSection />
    </>
  )
}

export default EditImage;