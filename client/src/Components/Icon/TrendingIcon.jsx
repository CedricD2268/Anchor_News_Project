import React from 'react';

const TrendingIcon = ({color, size}) => {
    return (


    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill={color}
      viewBox="0 0 32 32"
    >
      <path
        d="M27.26 18.87a11.13 11.13 0 01-22.26 0 11 11 0 012.27-6.72 10.2 10.2 0 012.22-2.27 1 1 0 011.15 0A1 1 0 0111 11a7.94 7.94 0 000 4 2.44 2.44 0 002.44 1.72 1.55 1.55 0 001.19-.53 2.25 2.25 0 000-1.89c-3-10.27.73-12 1.17-12.22a1 1 0 011.35 1c-.16 1.73-.29 3.1 2.65 4.93l.17.09c6.03 3.19 7.29 7.62 7.29 10.77z"
        data-name="Layer 19"
      ></path>
    </svg>
    );
};

TrendingIcon.defaultProps = {
    color: "white",
    size: 20
};

export default TrendingIcon;