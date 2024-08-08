// Cat_Mov_Arrows.js
import React from 'react';

export const CustomPrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <button
      className="cat_custom_prev"
      style={{ ...style }}
      onClick={onClick}
    >
      <i className="fas fa-chevron-left"></i>
      <span className="visually-hidden">Previous</span>
    </button>
  );
};

export const CustomNextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <button
      className="cat_custom_next"
      style={{ ...style }}
      onClick={onClick}
    >
      <i className="fas fa-chevron-right"></i>
      <span className="visually-hidden">Next</span>
    </button>
  );
};
