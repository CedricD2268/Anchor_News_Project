import React from 'react';

const DropIcon = ({color, size}) => {
    return (


<svg
      xmlns="http://www.w3.org/2000/svg"
      x="0"
      y="0"
      height={size}
      width={size}
      fill={color}
      enableBackground="new 0 0 491.996 491.996"
      version="1.1"
      viewBox="0 0 491.996 491.996"
      xmlSpace="preserve"
    >
      <path d="M484.132 124.986l-16.116-16.228c-5.072-5.068-11.82-7.86-19.032-7.86-7.208 0-13.964 2.792-19.036 7.86l-183.84 183.848L62.056 108.554c-5.064-5.068-11.82-7.856-19.028-7.856s-13.968 2.788-19.036 7.856l-16.12 16.128c-10.496 10.488-10.496 27.572 0 38.06l219.136 219.924c5.064 5.064 11.812 8.632 19.084 8.632h.084c7.212 0 13.96-3.572 19.024-8.632l218.932-219.328c5.072-5.064 7.856-12.016 7.864-19.224 0-7.212-2.792-14.068-7.864-19.128z"></path>
    </svg>
    );
};

DropIcon.defaultProps = {
    color: "white",
    size: 18
};

export default DropIcon;