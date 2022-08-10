import React from 'react';

const FacebookIcon = ({color, size}) => {
    return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill={color}
      fillRule="evenodd"
      clipRule="evenodd"
      imageRendering="optimizeQuality"
      shapeRendering="geometricPrecision"
      textRendering="geometricPrecision"
      viewBox="0 0 512 512"
    >
      <path d="M256 0c141.39 0 256 114.61 256 256S397.39 512 256 512 0 397.39 0 256 114.61 0 256 0zm-33.14 380.34c0 1.77 1.44 3.21 3.21 3.21h45.8c1.78 0 3.21-1.44 3.21-3.21V254.99h33.21c1.67 0 3.06-1.27 3.2-2.94l3.19-37.76a3.208 3.208 0 00-3.2-3.49h-36.4v-26.79c0-6.28 5.09-11.37 11.37-11.37h25.6c1.77 0 3.21-1.44 3.21-3.22v-37.76c0-1.77-1.44-3.21-3.22-3.21h-43.23c-25.38 0-45.95 20.57-45.95 45.94v36.41h-22.9c-1.78 0-3.22 1.44-3.22 3.22v37.76a3.21 3.21 0 003.22 3.21h22.9z"></path>
    </svg>
    );
};

FacebookIcon.defaultProps = {
    color: 'black',
    size: 20
};

export default FacebookIcon;