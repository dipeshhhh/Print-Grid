import React, { useState, useEffect } from 'react';
import './ThemeSwitchButton.css';

// Icons
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

function ThemeSwitchButton() {
  const [isDarkTheme, setIsDarkTheme] = useState(true); // true: default to dark theme
  const toggleTheme = () => { setIsDarkTheme(!isDarkTheme) };
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', `${isDarkTheme ? 'dark' : 'light'}`)
  }, [isDarkTheme]);

  return (
    <button className='theme-switch-button' onClick={toggleTheme}>
      {isDarkTheme ? <LightModeIcon /> : <DarkModeIcon />}
    </button>
  )
}

export default ThemeSwitchButton;