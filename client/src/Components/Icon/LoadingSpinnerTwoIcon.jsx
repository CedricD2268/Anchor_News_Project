import React from 'react';

const LoadingSpinnerTwoIcon = ({color, size}) => {
    return (

        <svg
      xmlns="http://www.w3.org/2000/svg"
      style={{ margin: "auto" }}
      width={size}
      height={size}
      display="block"
      preserveAspectRatio="xMidYMid"
      viewBox="0 0 100 100"
    >
      <circle
        cx="50"
        cy="50"
        r="32"
        fill="none"
        stroke="#182731"
        strokeDasharray="50.26548245743669 50.26548245743669"
        strokeLinecap="round"
        strokeWidth="8"
      >
        <animateTransform
          attributeName="transform"
          dur="1s"
          keyTimes="0;1"
          repeatCount="indefinite"
          type="rotate"
          values="0 50 50;360 50 50"
        ></animateTransform>
      </circle>
    </svg>
    );
};

LoadingSpinnerTwoIcon.defaultProps = {
    color: "white",
    size: 20
};

export default LoadingSpinnerTwoIcon;
