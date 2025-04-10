import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ImageProvider } from './contexts/ImageContext.jsx'
import { ChangeManagementProvider } from './contexts/ChangeManagementContext.jsx'
import { HistoryProvider } from './contexts/HistoryContext.jsx'
import { loadMaterialDesignSymbols } from './utils/loadMaterialDesignSymbols.js'

loadMaterialDesignSymbols();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChangeManagementProvider>
      <ImageProvider>
        <HistoryProvider>
          <App />
        </HistoryProvider>
      </ImageProvider>
    </ChangeManagementProvider>
  </React.StrictMode>,
)
