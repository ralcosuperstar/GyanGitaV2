import { ImgHTMLAttributes } from 'react';
import omLogo from '../../assets/om-logo.png';

export function OmLogo(props: ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img
      src={omLogo}
      alt="Om Symbol"
      {...props}
    />
  );
}