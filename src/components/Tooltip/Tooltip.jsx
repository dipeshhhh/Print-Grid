import React from 'react';
import './Tooltip.css';

function Tooltip({ text }) {
  return (
    <div className='tooltip'>
      {text}
    </div>
  )
}

export default Tooltip;