import React from 'react';

const LinkedinIcon = ({color, size}) => {
    return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill={color}
      viewBox="0 0 152 152"
    >
      <g data-name="Layer 2">
        <g>
          <path
            d="M76 0a76 76 0 1076 76A76 76 0 0076 0zM53.9 116H37.32V62.59H53.9zm-8.3-60.7a9.65 9.65 0 119.61-9.7 9.68 9.68 0 01-9.61 9.7zM116 116H99.43V90c0-6.2-.12-14.15-8.62-14.15s-10 6.74-10 13.7V116H64.3V62.59h15.91v7.28h.23c2.21-4.2 7.62-8.63 15.69-8.63 16.78 0 19.87 11.06 19.87 25.42z"
            data-name="10.Linkedin"
          ></path>
        </g>
      </g>
    </svg>
    );
};

LinkedinIcon.defaultProps = {
    color: 'black',
    size: 20
};

export default LinkedinIcon;