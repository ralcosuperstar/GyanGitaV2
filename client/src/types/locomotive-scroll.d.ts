declare module 'locomotive-scroll' {
  export interface LocomotiveScrollOptions {
    el?: HTMLElement;
    name?: string;
    offset?: [number, number];
    repeat?: boolean;
    smooth?: boolean;
    smoothMobile?: boolean;
    direction?: string;
    inertia?: number;
    class?: string;
    scrollbarClass?: string;
    scrollingClass?: string;
    draggingClass?: string;
    smoothClass?: string;
    initClass?: string;
    multiplier?: number;
    mobile?: {
      smooth?: boolean;
      multiplier?: number;
      breakpoint?: number;
    };
    tablet?: {
      smooth?: boolean;
      multiplier?: number;
      breakpoint?: number;
    };
  }

  export type Container = {
    destroy: () => void;
    update: () => void;
    scroll: {
      x: number;
      y: number;
    };
    delta: {
      x: number;
      y: number;
    };
  };

  export default class LocomotiveScroll {
    constructor(options?: LocomotiveScrollOptions);
    destroy(): void;
    update(): void;
    start(): void;
    stop(): void;
  }
}
