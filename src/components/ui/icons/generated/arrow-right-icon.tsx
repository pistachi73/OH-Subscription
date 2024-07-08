import type { Icon } from "../icons.type";

export const ArrowRightIcon: Icon = ({ className }) => {
  return (
    <svg
      className={className}
      width="26"
      height="28"
      viewBox="0 0 26 28"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Arrow Right Icon</title>
      <g filter="url(#filter0_d_1042_1690)">
        <path d="M14.705 4.28407C14.6115 4.19182 14.5007 4.11889 14.3791 4.06944C14.2574 4.01999 14.1271 3.99499 13.9958 3.99587C13.8644 3.99675 13.7345 4.0235 13.6135 4.07458C13.4925 4.12566 13.3828 4.20007 13.2905 4.29357C13.1982 4.38708 13.1253 4.49783 13.0759 4.61952C13.0264 4.74121 13.0014 4.87144 13.0023 5.00279C13.0032 5.13414 13.0299 5.26403 13.081 5.38504C13.1321 5.50605 13.2065 5.61582 13.3 5.70807L18.67 11.0001H5C4.73478 11.0001 4.48043 11.1054 4.29289 11.293C4.10536 11.4805 4 11.7349 4 12.0001C4 12.2653 4.10536 12.5196 4.29289 12.7072C4.48043 12.8947 4.73478 13.0001 5 13.0001H18.665L13.3 18.2851C13.1206 18.4731 13.0214 18.7236 13.0235 18.9834C13.0256 19.2433 13.1288 19.4921 13.3112 19.6772C13.4935 19.8623 13.7408 19.9692 14.0006 19.9751C14.2604 19.9811 14.5123 19.8857 14.703 19.7091L21.628 12.8871C21.7459 12.7708 21.8395 12.6322 21.9035 12.4794C21.9674 12.3267 22.0003 12.1627 22.0003 11.9971C22.0003 11.8315 21.9674 11.6675 21.9035 11.5147C21.8395 11.3619 21.7459 11.2234 21.628 11.1071L14.705 4.28407Z" />
      </g>
      <defs>
        <filter
          id="filter0_d_1042_1690"
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
            result="effect1_dropShadow_1042_1690"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_1042_1690"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
};
