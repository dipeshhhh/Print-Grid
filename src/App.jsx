import React from 'react';
import './App.css';

// Components
import ThemeSwitchButton from './components/ThemeSwitchButton/ThemeSwitchButton.jsx';

// Sections for the page
import EditButtons from './components/PageSections/EditButtons/EditButtons.jsx';
import ImageSection from './components/PageSections/ImageSection/ImageSection.jsx';
import GenerateImage from './components/PageSections/GenerateImage/GenerateImage.jsx';

function App() {

  return (
    <div className='App'>
      <EditButtons />

      <ImageSection />

      <GenerateImage />

      <ThemeSwitchButton />
    </div>
  );
}

export default App;