import type { PPTSlide, PPTElement } from './types';

declare const PptxGenJS: any;
declare const JSZip: any;

export function generatePPT(
  slides: PPTSlide[], 
  doScale: boolean,
  zipInstance: any
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!slides || slides.length === 0) {
      reject(new Error('No slides data'));
      return;
    }
    
    const pptx = new PptxGenJS();
    const firstSlide = slides[0];
    const ratio = doScale ? 0.5 : 1;
    const layoutWidth = (firstSlide.width * ratio) / 96;
    const layoutHeight = (firstSlide.height * ratio) / 96;

    pptx.defineLayout({ name: 'FigmaFrame', width: layoutWidth, height: layoutHeight });
    pptx.layout = 'FigmaFrame';

    slides.forEach(slideData => {
      const slide = pptx.addSlide();
      
      slideData.elements.forEach(el => {
        const w = (el.w * ratio) / 96;
        const h = (el.h * ratio) / 96;
        const cx = (el.cx * ratio) / 96;
        const cy = (el.cy * ratio) / 96;
        const x = cx - (w / 2);
        const y = cy - (h / 2);

        const opts: any = { x, y, w, h };

        if (el.rotation) opts.rotate = -el.rotation;

        let pptTransparency = 0;
        if (el.opacity !== undefined && el.opacity < 1) {
          pptTransparency = (1 - el.opacity) * 100;
        }
        const fillTrans = (el.fillAlpha !== undefined && el.fillAlpha < 1) 
          ? (1 - el.fillAlpha) * 100 : 0;
        const strokeTrans = (el.strokeAlpha !== undefined && el.strokeAlpha < 1) 
          ? (1 - el.strokeAlpha) * 100 : 0;

        if (el.strokeColor) {
          opts.line = { 
            color: el.strokeColor, 
            width: (el.strokeWeight || 1) * ratio, 
            transparency: strokeTrans 
          };
        }

        if (el.shadow) {
          const dist = Math.sqrt(el.shadow.x ** 2 + el.shadow.y ** 2) * ratio;
          let angle = Math.atan2(el.shadow.y, el.shadow.x) * (180 / Math.PI);
          if (angle < 0) angle += 360;
          opts.shadow = { 
            type: 'outer', 
            color: el.shadow.color, 
            opacity: el.shadow.opacity, 
            blur: (el.shadow.blur * ratio * 0.75), 
            offset: dist / 0.75, 
            angle 
          };
        }

        if (el.type === 'line') {
          const arrowHead = el.headArrow ? 'triangle' : 'none';
          const arrowTail = el.tailArrow ? 'triangle' : 'none';

          const lineOpts = {
            x, y, w, h,
            rotate: opts.rotate || 0,
            line: {
              color: el.strokeColor || '000000',
              width: (el.strokeWeight || 1) * ratio,
              transparency: (el.strokeAlpha !== undefined) ? (1 - el.strokeAlpha) * 100 : 0,
              lineHead: arrowHead,
              lineTail: arrowTail,
              beginArrowType: arrowHead,
              endArrowType: arrowTail
            }
          };

          if (el.dashPattern) (lineOpts.line as any).dashType = 'dash';

          slide.addShape(pptx.ShapeType.line, lineOpts);
        }
        else if (el.type === 'text') {
          const ptSize = Math.round((el.fontSize || 12) * ratio * 0.75);
          opts.fontSize = ptSize;
          opts.margin = 0;

          if (el.lineHeightPx) {
            opts.lineSpacing = Math.round(el.lineHeightPx * ratio * 0.75);
          } else {
            opts.lineSpacing = Math.round(ptSize * 1.2);
          }

          if (el.fontFace) opts.fontFace = el.fontFace;
          if (el.isBold) opts.bold = true;
          opts.color = el.color || '000000';
          opts.transparency = fillTrans;
          opts.align = el.align || 'left';

          if (el.isMultiLine) {
            opts.fit = 'resize';
            opts.wrap = true;
            opts.valign = 'top';
          } else {
            opts.fit = 'resize';
            opts.wrap = false;
            opts.valign = 'middle';
          }

          delete opts.autoFit;
          slide.addText(el.text || '', opts);
        }
        else if (el.type === 'shape' || el.type === 'rect' || el.type === 'ellipse') {
          if (el.color) {
            opts.fill = { color: el.color, transparency: fillTrans };
          } else {
            opts.fill = { color: 'FFFFFF', transparency: 100 };
          }

          if (el.strokeColor) {
            opts.line = { 
              color: el.strokeColor, 
              width: (el.strokeWeight || 1) * ratio, 
              transparency: strokeTrans 
            };
          }

          let pptShapeType = pptx.ShapeType.rect;

          if (el.pptShape && pptx.ShapeType[el.pptShape]) {
            pptShapeType = pptx.ShapeType[el.pptShape];
          } else if (el.type === 'ellipse') {
            pptShapeType = pptx.ShapeType.ellipse;
          }

          if (pptShapeType === pptx.ShapeType.rect && el.cornerRadius && el.cornerRadius > 0) {
            pptShapeType = pptx.ShapeType.roundRect;
            const minSide = Math.min(el.w, el.h);
            if (minSide > 0) {
              opts.rectRadius = Math.min(el.cornerRadius / 2 / minSide, 0.5);
            }
          }

          slide.addShape(pptShapeType, opts);
        }
        else if (el.type === 'placeholder') {
          const boxOpts: any = { 
            x, y, w, h, 
            rotate: opts.rotate,
            fill: { color: 'F5F5F5', transparency: fillTrans }, 
            line: null 
          };
          let phShape = pptx.ShapeType.rect;
          if (el.cornerRadius && el.cornerRadius > 0) {
            phShape = pptx.ShapeType.roundRect;
            const minSide = Math.min(el.w, el.h);
            if (minSide > 0) {
              boxOpts.rectRadius = Math.min(el.cornerRadius / 2 / minSide, 0.5);
            }
          }
          slide.addShape(phShape, boxOpts);
          slide.addText(el.imageName || 'IMG', { 
            x, y, w, h, 
            rotate: opts.rotate,
            fontSize: 10, 
            color: '999999', 
            align: 'center', 
            valign: 'middle',
            fontFace: 'Arial', 
            wrap: false, 
            margin: 0, 
            transparency: fillTrans
          });
        }
      });
    });

    pptx.write('blob').then((blob: Blob) => {
      if (zipInstance) {
        zipInstance.file('Figma_Presentation.pptx', blob);
        console.log('PPT added to ZIP');
        resolve();
      } else {
        reject(new Error('ZIP instance not available'));
      }
    }).catch((err: Error) => {
      console.error('PPT generation failed', err);
      reject(err);
    });
  });
}

export function generateAssetsZip(zipInstance: any, isAuto: boolean = false): void {
  if (!zipInstance) {
    if (!isAuto) alert('Resource package is empty, please re-run the export.');
    return;
  }

  const doDownload = () => {
    zipInstance.generateAsync({ type: 'blob' }).then((content: Blob) => {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = 'Figma_Export_Package.zip';
      link.click();
    });
  };

  if (isAuto) {
    setTimeout(doDownload, 1000);
  } else {
    doDownload();
  }
}

export function createZipInstance(): any {
  return new JSZip();
}
