import React from 'react';

const LibraryIcon = ({color, size}) => {
    return (


    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0"
      y="0"
      height={size}
      width={size}
      fill={color}
      enableBackground="new 0 0 296.999 296.999"
      version="1.1"
      viewBox="0 0 296.999 296.999"
      xmlSpace="preserve"
    >
      <path d="M45.432 35.049h-.025a10.474 10.474 0 00-7.446 3.085 10.583 10.583 0 00-3.128 7.543v159.365c0 5.844 4.773 10.61 10.641 10.625 24.738.059 66.184 5.215 94.776 35.136V84.023c0-1.981-.506-3.842-1.461-5.382-23.467-37.792-68.563-43.534-93.357-43.592zM262.167 205.042V45.676c0-2.852-1.111-5.531-3.128-7.543a10.477 10.477 0 00-7.445-3.085h-.026c-24.793.059-69.889 5.801-93.357 43.593-.955 1.54-1.46 3.401-1.46 5.382v166.779c28.592-29.921 70.038-35.077 94.776-35.136 5.867-.015 10.64-4.781 10.64-10.624z"></path>
      <path d="M286.373 71.801h-7.706v133.241c0 14.921-12.157 27.088-27.101 27.125-20.983.05-55.581 4.153-80.084 27.344 42.378-10.376 87.052-3.631 112.512 2.171a10.606 10.606 0 009.011-2.054 10.567 10.567 0 003.994-8.301v-168.9c.001-5.859-4.767-10.626-10.626-10.626zM18.332 205.042V71.801h-7.706C4.768 71.801 0 76.568 0 82.427v168.897c0 3.25 1.456 6.276 3.994 8.301a10.598 10.598 0 009.011 2.054c25.46-5.803 70.135-12.547 112.511-2.171-24.502-23.19-59.1-27.292-80.083-27.342-14.943-.036-27.101-12.203-27.101-27.124z"></path>
    </svg>
    );
};

LibraryIcon.defaultProps = {
    color: "white",
    size: 20
};

export default LibraryIcon;