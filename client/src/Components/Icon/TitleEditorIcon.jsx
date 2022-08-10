import React from 'react';

const TitleEditorIcon = ({color, size}) => {
    return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 60 60"
    >
      <path
        fill="#cd596b"
        d="M21.71 38.74a1.618 1.618 0 01-.54.5L7.81 46.86a1.05 1.05 0 01-1.45-1.4l5.24-9.82L17 36z"
      ></path>
      <path
        fill="#a54759"
        d="M22 31v6.81a1.653 1.653 0 01-.29.93l-10.11-3.1L3 33z"
      ></path>
      <path
        fill="#cd596b"
        d="M49 13H3a2 2 0 00-2 2v16a2 2 0 002 2h46a2 2 0 001.414-.586l8-8a2 2 0 000-2.828l-8-8A2 2 0 0049 13z"
      ></path>
      <path
        fill="#373737"
        d="M0 31a2.993 2.993 0 002.777 2.977l7.367 2.261-4.663 8.746A2.05 2.05 0 007.282 48a2.087 2.087 0 001.018-.273l13.346-7.611a2.574 2.574 0 00.885-.809 2.661 2.661 0 00.466-1.5V34H49a2.978 2.978 0 002.121-.879l8-8a3 3 0 000-4.242l-8-8A2.982 2.982 0 0049 12H11a1 1 0 000 2h38a1 1 0 01.707.293l8 8a1 1 0 010 1.414l-8 8A1 1 0 0149 32H3a1 1 0 01-1-1V15a1 1 0 011-1h4a1 1 0 000-2H3a3 3 0 00-3 3zm7.245 14.929l4.848-9.093 7.318 2.245zM21 37.477L9.668 34H21z"
      ></path>
    </svg>
    );
};

TitleEditorIcon.defaultProps = {
    color: 'white',
    size: 20
};

export default TitleEditorIcon;