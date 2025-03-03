import { SVGProps } from 'react';

export function OmLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M50 90C72.0914 90 90 72.0914 90 50C90 27.9086 72.0914 10 50 10C27.9086 10 10 27.9086 10 50C10 72.0914 27.9086 90 50 90ZM50 85C69.33 85 85 69.33 85 50C85 30.67 69.33 15 50 15C30.67 15 15 30.67 15 50C15 69.33 30.67 85 50 85Z"
      />
      <path
        d="M40 65C40 57 45 50 50 50C45 50 40 43 40 35C40 27 45 20 55 20C65 20 70 27 70 35C70 43 65 50 60 50C65 50 70 57 70 65C70 73 65 80 55 80C45 80 40 73 40 65Z"
      />
      <path
        d="M48 50C48 53 45 56 42 56C39 56 36 53 36 50C36 47 39 44 42 44C45 44 48 47 48 50Z"
      />
      <path
        d="M55 25C52 25 50 27 50 30C50 33 52 35 55 35C58 35 60 33 60 30C60 27 58 25 55 25Z"
      />
      <path
        d="M55 65C52 65 50 67 50 70C50 73 52 75 55 75C58 75 60 73 60 70C60 67 58 65 55 65Z"
      />
    </svg>
  );
}