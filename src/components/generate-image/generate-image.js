import React, { useState } from 'react';
import './generate-image.css';

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
              <option value={sizeOption} onClick={handleSizeChange}>{sizeOption.name}</option>
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

export default GenerateImage;