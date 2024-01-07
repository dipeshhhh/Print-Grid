import React, { useState, useEffect } from 'react';
import './App.css';

// Components
import EditButton from './Components/EditButton/EditButton.jsx';

// Icons for Edit Buttons
import SwitchLeftIcon from '@mui/icons-material/SwitchLeft';
import SwitchRightIcon from '@mui/icons-material/SwitchRight';
import Rotate90DegreesCcwIcon from '@mui/icons-material/Rotate90DegreesCcw';
import Rotate90DegreesCwIcon from '@mui/icons-material/Rotate90DegreesCw';
import FilterBAndWIcon from '@mui/icons-material/FilterBAndW';
import CropIcon from '@mui/icons-material/Crop';
import RestoreIcon from '@mui/icons-material/Restore';

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
        <EditButton icon={<SwitchLeftIcon/>} text='Flip left' onClickFunction={flipLeft} />
        <EditButton icon={<SwitchRightIcon/>} text='Flip right' onClickFunction={flipRight} />
        <EditButton icon={<Rotate90DegreesCwIcon/>} text='Rotate Clockwise' onClickFunction={rotateClockwise} />
        <EditButton icon={<Rotate90DegreesCcwIcon/>} text='Rotate counter-clockwise' onClickFunction={rotateAntiClockwise} />
        <EditButton icon={<FilterBAndWIcon/>} text='Grayscale' onClickFunction={grayscale} />
        <EditButton icon={<CropIcon/>} text='Crop' onClickFunction={crop} />
        <EditButton icon={<RestoreIcon/>} text='Reset' onClickFunction={reset} />
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
      <div className='image-section-main' onDrop={(e)=>console.log(e)}>
        {
          image ? image :
            // Drag and Drop feature here
            // <button className='primary-button' onClick={uploadImage}>Upload</button>
            <input type='file' accept='image/*' />
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
    <div className='App'>
      <EditButtons />
      <ImageSection />
      <GenerateImage />
      <button className='theme-switch-button' onClick={toggleTheme}>Toggle theme</button>
    </div>
  );
}

export default App;
