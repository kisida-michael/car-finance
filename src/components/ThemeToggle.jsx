import React from 'react';

const ThemeToggle = ({ darkMode, setDarkMode }) => {
  const handleToggle = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className="p-4">
      <label htmlFor="theme-toggle" className="flex items-center">
        <span className="mr-2">{darkMode ? 'Dark Mode' : 'Light Mode'}</span>
        <input
          type="checkbox"
          id="theme-toggle"
          checked={darkMode}
          onChange={handleToggle}
          className="w-5 h-5 cursor-pointer form-checkbox"
        />
      </label>
    </div>
  );
};

export default ThemeToggle;
