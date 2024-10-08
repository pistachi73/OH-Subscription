import type { Icon } from "../icons.type";

export const FacebookIcon: Icon = ({ className }) => {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Facebook Icon</title>
      <path d="M12 2C6.477 2 2 6.477 2 12C2 17.013 5.693 21.153 10.505 21.876V14.65H8.031V12.021H10.505V10.272C10.505 7.376 11.916 6.105 14.323 6.105C15.476 6.105 16.085 6.19 16.374 6.229V8.523H14.732C13.71 8.523 13.353 9.492 13.353 10.584V12.021H16.348L15.942 14.65H13.354V21.897C18.235 21.236 22 17.062 22 12C22 6.477 17.523 2 12 2Z" />
    </svg>
  );
};
