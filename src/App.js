import React, { useState, useEffect } from 'react';
import './App.css';

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
          <label htmlFor='border-check'>Border</label>
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

function GenerateImage() {
  const [resultImage, setResultImage] = useState(null);
  const [isGenerateDisabled, setIsGenerateDisabled] = useState(true);
  const [isDownloadDisabled, setIsDownloadDisabled] = useState(true);

  const generateResultImage = () => {
  }
  const downloadImage = () => {
  }
  const createCustomSize = () => {
  }
  const handleSizeChange = () => {
  }
  const sizeOptions = [
    {
      "name": "A4",
      "widthInCM": "",
      "heightInCM": ""
    },
    {
      "name": "A3",
      "widthInCM": "",
      "heightInCM": ""
    }
  ]
  return (
    <section className='section generate-image-section'>
      <div className='topbar'>
        <select>
          <option onClick={createCustomSize}>Custom Size</option>
          {
            sizeOptions.map(sizeOption => (
              <option value={sizeOption} onClick={handleSizeChange} key={`${sizeOption.name}`}>{sizeOption.name}</option>
            ))
          }
        </select>
        <button className='primary-button' onClick={generateResultImage} disabled={isGenerateDisabled}>Generate</button>
        <button className='primary-button' onClick={downloadImage} disabled={isDownloadDisabled}>Download</button>
      </div>
      <div className='generate-image-section-main'>
        {
          resultImage ? resultImage :
            <div>
              Click 'Generate' to generate result
            </div>
        }
      </div>
    </section>
  )
}

function App() {
  const [theme, setTheme] = useState('dark'); // default to dark
  // const [theme, setTheme] = useState('light'); // default to light

  const toggleTheme = () => {
    setTheme((prevTheme) => prevTheme === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', `${theme}`);
  }, [theme]);

  return (
    <div className={`App ${theme}`}>
      {/* <button onClick={toggleTheme}>Toggle theme</button> */}
      <EditButtons />
      <ImageSection />
      <GenerateImage />
    </div>
  );
}

export default App;
