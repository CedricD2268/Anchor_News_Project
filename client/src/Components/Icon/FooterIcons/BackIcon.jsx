import React from 'react';

const BackIcon = ({color, size}) => {
    return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      enableBackground="new 0 0 512 512"
      viewBox="0 0 64 64"
    >
      <g transform="rotate(180 32.032 31.98)">
        <g xmlns="http://www.w3.org/2000/svg" data-name="Layer 7">
          <path
            fill="#ef233c"
            d="M4.11 44.92l.38 7.39 2.37 2.15 34.83-20.25 1.67-1.88-2.01-3.78L7.97 9.97l-3.29.44-.95 3.23.53 5.33 7.61 2.34 3.14 3.71 2.31 6.78-1.65 6.06-4.21 4.94-4.95 1.87z"
            data-original="#78b9eb"
          ></path>
          <path
            fill="#002329"
            d="M59 28.52l-33-19A4 4 0 0020 13v2.87L9 9.49A4 4 0 003 13v6a1 1 0 001 1 12 12 0 010 24 1 1 0 00-1 1v6a4 4 0 006 3.47l11-6.34V51a4 4 0 006 3.47l33-19a4 4 0 000-7zM8 52.77A2 2 0 015 51v-5a14 14 0 000-27.9V13a2 2 0 013-1.73l33 19a2 2 0 010 3.48zm50-19l-33 19A2 2 0 0122 51v-4l20-11.52a4 4 0 000-7L22 17v-4a2 2 0 013-1.73l33 19a2 2 0 010 3.48z"
            data-original="#006df0"
          ></path>
        </g>
      </g>
    </svg>
    );
};

BackIcon.defaultProps = {
    color: 'black',
    size: 20
};

export default BackIcon;