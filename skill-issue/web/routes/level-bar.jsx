import React from 'react';
import PropTypes from 'prop-types';

const ProgressBar = ({ currentLevel, maxLevel, color }) => {
  const steps = Array.from({ length: maxLevel }, (_, index) => index + 1);

  return (
    <div className="progress-container">
      {steps.map((step) => (
        <div
          key={step}
          className={`progress-step ${
            step <= currentLevel ? 'active' : ''
          }`}
          style={{
            backgroundColor: step <= currentLevel ? color || '#4caf50' : '#e0e0e0',
          }}
        ></div>
      ))}
    </div>
  );
};

ProgressBar.propTypes = {
  currentLevel: PropTypes.number.isRequired, // Current level (e.g., 3)
  maxLevel: PropTypes.number.isRequired, // Maximum level (e.g., 10)
  color: PropTypes.string, // Optional: Custom color for the active steps
};

export default ProgressBar;
