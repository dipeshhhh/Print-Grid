import React, { useState, useEffect } from 'react';
import './ThemeSwitchButton.css';

// Icons
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

function ThemeSwitchButton() {
  const [isDarkTheme, setIsDarkTheme] = useState(true); // true: default to dark theme

  const toggleTheme = () => {
    const newTheme = !isDarkTheme;
    setIsDarkTheme(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light'); // Save theme preference to localStorage
  };

  useEffect(() => {
    // Check if theme preference exists in localStorage
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      setIsDarkTheme(storedTheme.toLowerCase() === 'dark');
    } else {
      // Check user's system preference if theme preference is not stored
      setIsDarkTheme(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  }, []);

  useEffect(() => {
    // Update the HTML attribute based on the current theme
    document.documentElement.setAttribute('data-theme', isDarkTheme ? 'dark' : 'light');
  }, [isDarkTheme]);

  return (
    <button className='theme-switch-button' onClick={toggleTheme}>
      {isDarkTheme ? <LightModeIcon /> : <DarkModeIcon />}
    </button>
  );
}

export default ThemeSwitchButton;