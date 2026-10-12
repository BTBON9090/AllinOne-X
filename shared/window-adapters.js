// Public host APIs only. Native title bars are intentionally retained.
const handlePluginWindowMessage = createPluginWindowController(__PLUGIN_PLATFORM__ === 'figma' ? {
  canMove:() => typeof figma.ui.getPosition === 'function' && typeof figma.ui.reposition === 'function',
  metrics:() => {
    const b = figma.viewport.bounds, z = figma.viewport.zoom;
    const p = figma.ui.getPosition().canvasSpace;
    return { x:(p.x - b.x) * z, y:(p.y - b.y) * z, width:b.width * z, height:b.height * z, header:40 };
  },
  move:(x,y) => {
    const b = figma.viewport.bounds, z = figma.viewport.zoom;
    figma.ui.reposition(b.x + x / z, b.y + y / z);
  },
  resize:(w,h) => figma.ui.resize(w,h),
  send:msg => figma.ui.postMessage(msg)
} : {
  canMove:() => typeof mg.ui.moveTo === 'function' && Boolean(mg.ui.viewport),
  metrics:() => {
    const p = mg.ui.viewport, b = mg.viewport.bound, z = mg.viewport.zoom;
    return { x:p.x, y:p.y, width:b.width * z, height:b.height * z, header:p.headerHeight || 40 };
  },
  move:(x,y) => mg.ui.moveTo(x,y),
  resize:(w,h) => mg.ui.resize(w,h,true),
  send:msg => mg.ui.postMessage(msg)
});
