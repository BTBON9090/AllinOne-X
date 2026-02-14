declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

declare module 'preact' {
  export interface FunctionalComponent<P = {}> {
    (props: P & { children?: any }): any;
  }
}

declare module 'preact/hooks' {
  export function useState<T>(initial: T): [T, (value: T | ((prev: T) => T)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: any[]): void;
  export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: any[]): T;
  export function useMemo<T>(factory: () => T, deps: any[]): T;
  export function useRef<T>(initial: T): { current: T };
  export function useContext<T>(context: any): T;
}
