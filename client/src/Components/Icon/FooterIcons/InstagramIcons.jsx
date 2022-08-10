import React from 'react';

const InstagramIcon = ({color, size}) => {
    return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill={color}
      viewBox="0 0 49.652 49.652"
    >
      <path d="M24.825 29.796a4.978 4.978 0 004.972-4.97 4.954 4.954 0 00-.94-2.897 4.964 4.964 0 00-4.029-2.073c-1.659 0-3.126.82-4.031 2.072a4.947 4.947 0 00-.94 2.897 4.973 4.973 0 004.968 4.971zM35.678 18.746V13.96l-.623.002-4.164.013.016 4.787z"></path>
      <path d="M24.826 0C11.137 0 0 11.137 0 24.826c0 13.688 11.137 24.826 24.826 24.826 13.688 0 24.826-11.138 24.826-24.826C49.652 11.137 38.516 0 24.826 0zm14.119 21.929v11.56a5.463 5.463 0 01-5.457 5.458H16.164a5.462 5.462 0 01-5.457-5.458V16.165a5.462 5.462 0 015.457-5.457h17.323a5.463 5.463 0 015.458 5.457z"></path>
      <path d="M32.549 24.826c0 4.257-3.464 7.723-7.723 7.723s-7.722-3.466-7.722-7.723a7.67 7.67 0 01.568-2.897h-4.215v11.56a2.706 2.706 0 002.706 2.704h17.323a2.707 2.707 0 002.706-2.704v-11.56h-4.217c.367.894.574 1.873.574 2.897z"></path>
    </svg>
    );
};

InstagramIcon.defaultProps = {
    color: 'black',
    size: 20
};

export default InstagramIcon;