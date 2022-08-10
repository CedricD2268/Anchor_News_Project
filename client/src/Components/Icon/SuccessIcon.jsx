import React from 'react';

const SuccessIcon = ({color, size}) => {
    return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      enableBackground="new 0 0 512 512"
      viewBox="0 0 346.607 346.607"
    >
      <g xmlns="http://www.w3.org/2000/svg">
        <path
          fill="#243030"
          d="M346.607 173.299c0 17.145-30.717 29.224-35.74 44.695-5.21 16.035 12.361 43.829 2.645 57.171-9.807 13.481-41.734 5.31-55.215 15.122-13.347 9.711-15.385 42.648-31.415 47.838-15.471 5.023-36.414-20.264-53.579-20.264s-38.089 25.287-53.579 20.264c-16.035-5.21-18.073-38.146-31.42-47.838-13.476-9.807-45.403-1.636-55.215-15.117-9.711-13.347 7.855-41.141 2.65-57.171C30.717 202.528 0 190.449 0 173.304s30.717-29.224 35.74-44.695c5.205-16.031-12.361-43.825-2.65-57.171 9.812-13.481 41.739-5.31 55.22-15.117 13.342-9.711 15.38-42.653 31.415-47.838 15.471-5.023 36.414 20.264 53.579 20.264 17.164 0 38.089-25.287 53.579-20.264 16.031 5.205 18.073 38.146 31.415 47.838 13.481 9.812 45.408 1.641 55.22 15.117 9.711 13.347-7.86 41.141-2.65 57.171 5.022 15.465 35.739 27.544 35.739 44.69z"
          data-original="#2086a5"
        ></path>
        <path
          fill="#f7d6bf"
          d="M158.168 232.221a19.075 19.075 0 01-13.529-5.602l-42.662-42.662c-7.474-7.472-7.476-19.588-.005-27.062 7.472-7.474 19.588-7.476 27.062-.005l29.133 29.129 59.439-59.434c7.473-7.474 19.59-7.475 27.064-.002s7.475 19.59.002 27.064L171.7 226.619a19.072 19.072 0 01-13.532 5.602z"
          data-original="#f7d6bf"
        ></path>
      </g>
    </svg>
    );
};

SuccessIcon.defaultProps = {
    color: "black",
    size: 20
};

export default SuccessIcon;