import React from 'react';

const ShareIcon = ({color, size}) => {
    return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0"
      y="0"
      height={size}
      width={size}
      fill={color}
      enableBackground="new 0 0 512.001 512.001"
      version="1.1"
      viewBox="0 0 512.001 512.001"
      xmlSpace="preserve"
    >
      <path d="M9.47 192.489a15.065 15.065 0 00-.979 27.541l176.547 85.623L490.696.002 9.47 192.489zM206.344 326.96l85.624 176.548a15.065 15.065 0 0027.543-.979l192.49-481.223L206.344 326.96z"></path>
    </svg>
    );
};

ShareIcon.defaultProps = {
    color: "white",
    size: 20
};

export default ShareIcon;