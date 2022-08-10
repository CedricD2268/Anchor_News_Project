import React from 'react';

const LatestIcon = ({color, size}) => {
    return (


    <svg
      xmlns="http://www.w3.org/2000/svg"
      fillRule="evenodd"
      strokeLinejoin="round"
      strokeMiterlimit="2"
      clipRule="evenodd"
      viewBox="0 0 6084 1423"
      height={size}
      width={size}
    >
      <path
        fill="#002329"
        d="M6083.83 0H714.02C319.68 0 .004 319.676.004 714.016v.615c0 390.823 316.825 707.649 707.649 707.649h5376.18V0z"
      ></path>
      <text
        x="574.585"
        y="998.588"
        fill="#fff"
        fontFamily="'Rye-Regular', 'Rye', sans-serif"
        fontSize="776.296"
        transform="matrix(.9777 0 0 1 -186.586 0)"
      >
        Latest Stories
      </text>
    </svg>
    );
};

LatestIcon.defaultProps = {
    color: "white",
    size: 20
};

export default LatestIcon;