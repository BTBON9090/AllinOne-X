declare module 'preact' {
  export interface FunctionalComponent<P = {}> {
    (props: P & { children?: any }): any;
  }
  export function h(type: any, props: any, ...children: any[]): any;
  export function render(vnode: any, parent: Element | Document | ShadowRoot | DocumentFragment, replaceNode?: Element | Text): any;
}

declare module 'preact/hooks' {
  export function useState<T>(initial: T): [T, (value: T | ((prev: T) => T)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: any[]): void;
  export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: any[]): T;
  export function useMemo<T>(factory: () => T, deps: any[]): T;
  export function useRef<T>(initial: T): { current: T };
  export function useContext<T>(context: any): T;
}

declare module 'react/jsx-runtime' {
  export function jsx(type: any, props: any, key?: any): any;
  export function jsxs(type: any, props: any, key?: any): any;
  export const Fragment: any;
}
