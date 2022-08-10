import React from "react";

const Icon10n = ({color, size}) => {
    return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 512 512"
    >
      <path
        fill="#daedf7"
        d="M455.945 231.727c-1.379 0-2.738.07-4.086.183a128.405 128.405 0 004.086-32.215c0-70.761-57.363-128.125-128.125-128.125-70.761 0-128.125 57.364-128.125 128.125-35.379 0-64.062 28.684-64.062 64.063 0 35.379 28.683 64.062 64.062 64.062h256.25c26.535 0 48.047-21.511 48.047-48.047 0-26.535-21.512-48.046-48.047-48.046zm0 0"
      ></path>
      <path
        fill="#8bb4d9"
        d="M455.945 231.727c-1.379 0-2.738.07-4.086.183a128.405 128.405 0 004.086-32.215c0-70.761-57.363-128.125-128.125-128.125-4.05 0-8.054.196-12.011.563 65.129 6.058 116.113 60.851 116.113 127.562 0 11.13-1.422 21.922-4.086 32.215a48.691 48.691 0 014.086-.183c26.535 0 48.047 21.511 48.047 48.046 0 26.536-21.512 48.047-48.047 48.047h24.023c26.535 0 48.047-21.511 48.047-48.047 0-26.535-21.512-48.046-48.047-48.046zm0 0"
      ></path>
      <g fill="#fff">
        <path d="M279.773 208.203h16.016v15.016h-16.016zm0 0M311.805 208.203h16.015v15.016h-16.015zm0 0M343.836 208.203h16.016v15.016h-16.016zm0 0"></path>
      </g>
      <path
        fill="#feef7f"
        d="M199.703 55.555C186.32 45.5 169.68 39.539 151.648 39.539c-44.226 0-80.078 35.852-80.078 80.078 0 44.227 35.852 80.078 80.078 80.078 18.032 0 34.668-5.96 48.055-16.015l8 8.007c-20.566 24.481-53.613 40.04-88.086 40.04-61.918 0-112.11-50.192-112.11-112.11S57.7 7.507 119.618 7.507c34.473 0 67.52 15.56 88.086 40.04zm0 0"
      ></path>
      <path d="M87.586 287.781h15.016v160.156H87.586zm0 0M127.625 335.828h15.016v144.14h-15.016zm0 0M167.664 495.984h15.016V512h-15.016zm0 0M167.664 351.844h15.016v128.125h-15.016zm0 0M207.703 351.844h15.016V512h-15.016zm0 0M247.742 351.844h15.016v112.11h-15.016zm0 0M287.781 351.844h15.016V512H287.78zm0 0M327.82 351.844h15.016v144.14H327.82zm0 0M367.86 463.953h15.015v16.016h-15.016zm0 0M367.86 351.844h15.015v96.094h-15.016zm0 0M407.898 351.844h15.016V512h-15.016zm0 0M461.148 224.469a134.961 134.961 0 002.305-24.774c0-74.789-60.844-135.632-135.633-135.632-58.754 0-110.543 37.472-128.879 93.25L213.207 162c16.3-49.598 62.363-82.922 114.613-82.922 66.508 0 120.618 54.11 120.618 120.617 0 27.73-9.149 53.797-26.454 75.383l11.715 9.39c10.778-13.44 18.836-28.835 23.828-45.195 21.621.836 38.957 18.93 38.957 40.75 0 22.356-18.183 40.79-40.539 40.79h-256.25c-31.183 0-56.554-25.622-56.554-56.805 0-2.367.148-4.875.437-7.203l-14.898-1.922a76.008 76.008 0 00-.555 9.156c0 39.465 32.105 71.79 71.57 71.79h256.25c30.633 0 55.555-25.173 55.555-55.806 0-28.878-22.148-52.918-50.352-55.554zm0 0"></path>
      <path d="M213.45 196.516l4.425-5.27-17.469-17.484-5.21 3.914c-12.637 9.492-27.696 14.512-43.548 14.512-40.015 0-72.57-32.555-72.57-72.57 0-40.016 32.555-72.571 72.57-72.571 15.852 0 30.91 5.016 43.547 14.512l5.215 3.918 17.465-17.493-4.426-5.265C190.98 15.969 155.902 0 119.617 0 53.66 0 0 53.66 0 119.617c0 65.957 53.66 119.617 119.617 119.617 36.285 0 71.363-15.968 93.832-42.718zm-93.833 27.703c-57.676 0-104.601-46.922-104.601-104.602 0-57.68 46.925-104.601 104.601-104.601 26.047 0 52.176 9.832 71.383 26.316-12.117-6.117-25.484-9.3-39.352-9.3-48.296 0-87.585 39.288-87.585 87.585 0 48.293 39.289 87.586 87.585 87.586 13.868 0 27.235-3.183 39.348-9.3-19.203 16.484-45.332 26.316-71.379 26.316zm0 0"></path>
    </svg>
    );
};

Icon10n.defaultProps = {
    color: 'black',
    size: 20
};

export default Icon10n;