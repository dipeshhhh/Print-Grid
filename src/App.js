import React from 'react';
import './App.css';

import EditImage from './components/edit-image/edit-image';
import GenerateImage from './components/generate-image/generate-image';

function App() {
  return (
    <div className="App">
      <EditImage />
      <GenerateImage />
    </div>
  );
}

export default App;
