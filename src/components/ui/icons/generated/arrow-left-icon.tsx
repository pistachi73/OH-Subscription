import type { Icon } from "../icons.type";

export const ArrowLeftIcon: Icon = ({ className }) => {
  return (
    <svg
      className={className}
      width="26"
      height="28"
      viewBox="0 0 26 28"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Arrow Left Icon</title>
      <g filter="url(#filter0_d_1042_1016)">
        <path d="M11.2953 19.715C11.4851 19.8963 11.7386 19.9957 12.001 19.9918C12.2635 19.9878 12.5138 19.8809 12.6981 19.694C12.8824 19.5071 12.9858 19.2552 12.986 18.9928C12.9862 18.7303 12.8833 18.4783 12.6993 18.291L7.32932 12.999H20.9993C21.2645 12.999 21.5189 12.8937 21.7064 12.7061C21.894 12.5186 21.9993 12.2643 21.9993 11.999C21.9993 11.7338 21.894 11.4795 21.7064 11.2919C21.5189 11.1044 21.2645 10.999 20.9993 10.999H7.33632L12.7003 5.71404C12.8843 5.52682 12.9872 5.27478 12.987 5.01232C12.9868 4.74985 12.8834 4.498 12.6991 4.31109C12.5148 4.12419 12.2645 4.01724 12.002 4.0133C11.7396 4.00936 11.4861 4.10875 11.2963 4.29004L4.37032 11.112C4.25241 11.2283 4.15877 11.3669 4.09487 11.5197C4.03096 11.6725 3.99805 11.8364 3.99805 12.002C3.99805 12.1677 4.03096 12.3316 4.09487 12.4844C4.15877 12.6372 4.25241 12.7757 4.37032 12.892L11.2953 19.715Z" />
      </g>
      <defs>
        <filter
          id="filter0_d_1042_1016"
          x="-3"
          y="0"
          width="32"
          height="32"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_1042_1016"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_1042_1016"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
};
