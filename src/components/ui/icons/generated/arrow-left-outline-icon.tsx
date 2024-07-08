import type { Icon } from "../icons.type";

export const ArrowLeftOutlineIcon: Icon = ({ className }) => {
  return (
    <svg
      className={className}
      width="26"
      height="28"
      viewBox="0 0 26 28"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Arrow Left Outline Icon</title>
      <g filter="url(#filter0_d_1042_1694)">
        <path d="M11.7327 19.79C11.8777 19.9213 12.0683 19.9907 12.2638 19.9834C12.4593 19.9761 12.6442 19.8927 12.7791 19.7511C12.9139 19.6094 12.9881 19.4206 12.9858 19.225C12.9835 19.0294 12.9049 18.8425 12.7667 18.704L6.51566 12.75H21.2497C21.4486 12.75 21.6393 12.671 21.78 12.5303C21.9206 12.3897 21.9997 12.1989 21.9997 12C21.9997 11.8011 21.9206 11.6103 21.78 11.4697C21.6393 11.329 21.4486 11.25 21.2497 11.25H6.51566L12.7667 5.29502C12.9049 5.15658 12.9835 4.96962 12.9858 4.77402C12.9881 4.57841 12.9139 4.38964 12.7791 4.24797C12.6442 4.1063 12.4593 4.02293 12.2638 4.01566C12.0683 4.00838 11.8777 4.07777 11.7327 4.20902L4.31266 11.276C4.15058 11.4303 4.04494 11.6346 4.01266 11.856C3.99545 11.9516 3.99579 12.0495 4.01366 12.145C4.04616 12.3661 4.15178 12.57 4.31366 12.724L11.7327 19.79Z" />
      </g>
      <defs>
        <filter
          id="filter0_d_1042_1694"
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
            result="effect1_dropShadow_1042_1694"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_1042_1694"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
};
