import React, { useState, useEffect } from 'react';
import './ThemeSwitchButton.css';

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
    }
    //? To check if user prefers dark theme apps on their device (Default to dark-theme right now)
    // else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
    //   // Check user's system preference if theme preference is not stored
    //   setIsDarkTheme(false);
    // }
  }, []);

  useEffect(() => {
    // Update the HTML attribute based on the current theme
    document.documentElement.setAttribute('data-theme', isDarkTheme ? 'dark' : 'light');
  }, [isDarkTheme]);

  return (
    <button className='theme-switch-button' onClick={toggleTheme}>
      <span className="material-symbols-outlined">{isDarkTheme ? "light_mode" : "dark_mode"}</span>
    </button>
  );
}

export default ThemeSwitchButton;