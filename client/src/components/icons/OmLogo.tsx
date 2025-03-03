import { ImgHTMLAttributes } from 'react';

export function OmLogo(props: ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img
      src="/OM PNG.png"
      alt="Om Symbol"
      {...props}
    />
  );
}