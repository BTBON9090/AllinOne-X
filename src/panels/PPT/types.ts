export interface PPTElement {
  type: 'text' | 'shape' | 'rect' | 'ellipse' | 'line' | 'placeholder';
  w: number;
  h: number;
  cx: number;
  cy: number;
  rotation?: number;
  opacity?: number;
  fillAlpha?: number;
  strokeAlpha?: number;
  strokeColor?: string;
  strokeWeight?: number;
  color?: string;
  shadow?: {
    x: number;
    y: number;
    color: string;
    opacity: number;
    blur: number;
  };
  text?: string;
  fontSize?: number;
  fontFace?: string;
  isBold?: boolean;
  align?: 'left' | 'center' | 'right';
  isMultiLine?: boolean;
  lineHeightPx?: number;
  cornerRadius?: number;
  pptShape?: string;
  imageName?: string;
  headArrow?: boolean;
  tailArrow?: boolean;
  dashPattern?: boolean;
}

export interface PPTSlide {
  width: number;
  height: number;
  elements: PPTElement[];
}

export interface PPTConfig {
  scale: boolean;
}

export type PPTStep = 1 | 2 | 3 | 4 | 5 | 6;

export type PPTState = 'idle' | 'processing' | 'done';

export interface PPTStatus {
  stepIndex: PPTStep;
  state: PPTState;
  isAutoRunning: boolean;
  slidesCache: PPTSlide[];
}
