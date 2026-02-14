declare namespace JSX {
  interface ElementChildrenAttribute {
    children?: any;
  }
  interface IntrinsicElements {
    [elemName: string]: {
      children?: any;
      [key: string]: any;
    };
  }
}
