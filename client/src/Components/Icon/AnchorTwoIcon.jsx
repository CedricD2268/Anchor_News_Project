import React from 'react';

const AnchorTwoIcon = ({color, size}) => {
    return (

    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={size}
      width={size}
      fill={color}
      viewBox="0 0 68 68"
    >
      <path d="M49.965 2.61c-7.06 0-12.8 5.74-12.8 12.81 0 7.06 5.74 12.8 12.8 12.8 7.07 0 12.81-5.74 12.81-12.8 0-7.07-5.74-12.81-12.81-12.81zm6.13 12.56l-2.13 2.07.5 2.92c.18 1.06-.92 1.86-1.87 1.36l-2.63-1.38-2.62 1.38c-.95.5-2.06-.3-1.87-1.36l.5-2.92-2.13-2.07c-.76-.75-.34-2.05.72-2.21l2.93-.42 1.32-2.66c.47-.96 1.84-.96 2.31 0l1.32 2.66 2.93.42c1.06.16 1.48 1.46.72 2.21zM12.76 34V55.01c0 1.224.995 2.219 2.219 2.219H39.32c1.223 0 2.22-.995 2.22-2.219V34c0-1.223-.997-2.22-2.22-2.22H14.979A2.222 2.222 0 0012.76 34zm5.543 3.859h17.694a1 1 0 110 2H18.303a1 1 0 110-2zm0 5.646h17.694a1 1 0 110 2H18.303a1 1 0 110-2zm0 5.646h17.694a1 1 0 110 2H18.303a1 1 0 110-2z"></path>
      <path d="M35.165 15.42c0-2.27.51-4.41 1.42-6.33l-5.08-4.76a6.383 6.383 0 00-8.72.01l-4.874 4.563L7.666 4.93a1 1 0 00-.723 1.865l9.348 3.625-9.046 8.47a6.378 6.378 0 00-2.02 4.66v35.46c0 3.52 2.86 6.38 6.38 6.38h31.09c3.52 0 6.38-2.86 6.38-6.38V30.19c-7.75-.46-13.91-6.91-13.91-14.77zm-8.22-3.013l-3.024-1.173a4.176 4.176 0 013.234-1.544c2.31 0 4.19 1.87 4.19 4.19s-1.88 4.2-4.19 4.2a4.2 4.2 0 01-4.115-5.042l3.182 1.234a1 1 0 00.723-1.865zM43.545 34v21.01c0 2.33-1.9 4.22-4.22 4.22h-24.35c-2.32 0-4.21-1.89-4.21-4.22V34c0-2.33 1.89-4.22 4.21-4.22h24.35c2.32 0 4.22 1.89 4.22 4.22z"></path>
    </svg>
    );
};

AnchorTwoIcon.defaultProps = {
    color: 'black',
    size: 20
};

export default AnchorTwoIcon;