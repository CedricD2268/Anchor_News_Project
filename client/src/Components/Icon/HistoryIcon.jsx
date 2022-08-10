import React from 'react';

const HistoryIcon = ({color, size}) => {
    return (


    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill={color}
      viewBox="0 0 32 32"
    >
      <path d="M30 16a14 14 0 01-28 0 1 1 0 012 0A12.018 12.018 0 109.38 6H10a1 1 0 010 2H7a1 1 0 01-1-1V4a1 1 0 012 0v.514A13.997 13.997 0 0130 16zm-5 0a9 9 0 11-9-9 9.01 9.01 0 019 9zm-5.445 1.168L17 15.465V11a1 1 0 00-2 0v5a1 1 0 00.445.832l3 2a1 1 0 001.11-1.664z"></path>
    </svg>
    );
};

HistoryIcon.defaultProps = {
    color: "white",
    size: 20
};

export default HistoryIcon;