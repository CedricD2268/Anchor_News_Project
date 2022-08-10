import React from 'react';

const AddCollectionIcon = ({color, size}) => {
    return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill={color}
      viewBox="0 0 64 64"
    >
      <path d="M57 43.26h-3.53V18.2A11.739 11.739 0 0041.75 6.47H11.01A7.018 7.018 0 004 13.48v7.81a4.028 4.028 0 004.05 4l7.97-.09v25.07a7.264 7.264 0 007.25 7.26h29.6A7.142 7.142 0 0060 50.39v-4.13a3.009 3.009 0 00-3-3zM28.74 28.1h5v-5a1 1 0 012 0v5h5a1 1 0 010 2h-5v5a1 1 0 01-2 0v-5h-5a1 1 0 010-2zm-12.72-4.9l-8 .09a1.938 1.938 0 01-1.43-.58A1.989 1.989 0 016 21.29v-7.81c.212-6.618 9.807-6.621 10.02 0zM58 50.39a5.143 5.143 0 01-5.13 5.14h-24.6a7.255 7.255 0 002.26-5.26v-4.01a.996.996 0 011-1H57a1.003 1.003 0 011 1z"></path>
    </svg>
    );
};

AddCollectionIcon.defaultProps = {
    color: 'white',
    size: 20
};

export default AddCollectionIcon;