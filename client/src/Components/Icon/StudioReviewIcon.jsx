import React from 'react';

const StudioReviewIcon = ({color, size}) => {
    return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill = {color}
      fillRule="evenodd"
      clipRule="evenodd"
      imageRendering="optimizeQuality"
      shapeRendering="geometricPrecision"
      textRendering="geometricPrecision"
      viewBox="0 0 512 512"
    >
      <g>
        <path d="M337 484H33c-16 0-28-13-28-28V28C5 13 18 0 33 0h304c16 0 28 13 28 28v191c-44-30-104-24-143 15-43 43-42 116 2 159 38 37 97 42 141 13v50c0 15-12 28-28 28zm-140-50H60c-9 0-9-14 0-14h136c10 0 10 14 1 14zm-28-62H60c-9 0-9-14 0-14h109c10 0 10 14 0 14zm-15-61H60c-9 0-9-15 0-15h94c10 0 10 15 0 15zm20-62H60c-9 0-9-15 0-15h114c10 0 10 15 0 15zm135-62H60c-9 0-9-15 0-15h249c10 0 10 15 0 15zm-68-62H129c-10 0-10-15 0-15h112c10 0 10 15 0 15z"></path>
        <path d="M252 262c27-28 72-28 100-1 45 45 14 122-49 122-60 0-96-73-51-121zm-48 51c0-88 105-131 167-71 37 36 40 94 7 133l26 26-10 10-26-25c-61 55-163 13-164-73z"></path>
        <path d="M404 418c-2 0-4-1-5-2l-36-35c-7-7 3-17 10-11l36 36c5 4 1 12-5 12z"></path>
        <path d="M459 512c-1 0-3-1-5-2l-68-67c-7-7-6-18 0-24l26-27c6-6 18-7 25 0l68 67c2 2 3 7 0 10l-40 40c-2 2-4 3-6 3z"></path>
      </g>
    </svg>
    );
};

StudioReviewIcon.defaultProps = {
    color: "white",
    size: 20
};

export default StudioReviewIcon;