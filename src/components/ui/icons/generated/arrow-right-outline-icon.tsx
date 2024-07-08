import type { Icon } from "../icons.type";

export const ArrowRightOutlineIcon: Icon = ({ className }) => {
  return (
    <svg
      className={className}
      width="26"
      height="28"
      viewBox="0 0 26 28"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Arrow Right Outline Icon</title>
      <g filter="url(#filter0_d_1042_1692)">
        <path d="M14.267 4.20902C14.122 4.07777 13.9314 4.00838 13.7359 4.01566C13.5404 4.02293 13.3555 4.1063 13.2206 4.24797C13.0857 4.38964 13.0115 4.57841 13.0138 4.77402C13.0161 4.96962 13.0948 5.15658 13.233 5.29502L19.484 11.25H4.75C4.55109 11.25 4.36032 11.329 4.21967 11.4697C4.07902 11.6103 4 11.8011 4 12C4 12.1989 4.07902 12.3897 4.21967 12.5303C4.36032 12.671 4.55109 12.75 4.75 12.75H19.484L13.233 18.704C13.0889 18.8411 13.0051 19.0299 13.0001 19.2288C12.9951 19.4277 13.0694 19.6204 13.2065 19.7645C13.3436 19.9087 13.5324 19.9924 13.7313 19.9974C13.9301 20.0024 14.1229 19.9281 14.267 19.791L21.687 12.724C21.8491 12.5697 21.9547 12.3655 21.987 12.144C22.0043 12.0481 22.004 11.9498 21.986 11.854C21.9533 11.6333 21.8477 11.4298 21.686 11.276L14.267 4.20902Z" />
      </g>
      <defs>
        <filter
          id="filter0_d_1042_1692"
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
            result="effect1_dropShadow_1042_1692"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_1042_1692"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
};
