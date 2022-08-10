import React from 'react';

const VerticalLineIcon = ({color, size}) => {
    return (
<svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" height={size}  fill={color} version="1.1" x="0px" y="0px" viewBox="0 0 100 100" enableBackground="new 0 0 100 100" xmlSpace="preserve"><g><line fill="none" stroke="#000000" strokeWidth="4" strokeLinecap="round" strokeMiterlimit="10" x1="50" y1="5" x2="50" y2="95"/></g></svg>
    );
};

VerticalLineIcon.defaultProps = {
    color: "white",
    size: 20
};

export default VerticalLineIcon;
