// Used only when contours intersect, touch or double back. Clipper evaluates
// the source fill rule and emits disjoint filled regions with opposing holes.
const IconfontBoolean = (() => {
  function resolve(polygons, rule) {
    let left = Infinity, top = Infinity, right = -Infinity, bottom = -Infinity, count = 0;
    for (const polygon of polygons) {
      count += polygon.length;
      for (const {x, y} of polygon) {
        left = Math.min(left, x);
        top = Math.min(top, y);
        right = Math.max(right, x);
        bottom = Math.max(bottom, y);
      }
    }
    const span = Math.max(right - left, bottom - top);
    if (!count || span === 0) return '';
    if (!Number.isFinite(span) || count > 16000) {
      const error = new Error('轮廓过于复杂，请简化后重试。');
      error.code = 'geometry-complex';
      throw error;
    }

    // At least seven significant digits across the icon while keeping the
    // integer coordinates within Clipper's fast, exact-product range.
    const scale = Math.pow(10, Math.floor(Math.log10(40000000 / span)));
    const originX = Math.floor(left * scale);
    const originY = Math.floor(top * scale);
    if (![originX, originY, Math.ceil(right * scale), Math.ceil(bottom * scale)].every(Number.isSafeInteger)) {
      const error = new Error('路径坐标超过布尔运算的精度范围。');
      error.code = 'geometry-complex';
      throw error;
    }
    const integers = polygons.map(poly => poly.map(p => ({
      X: Math.round(p.x * scale) - originX,
      Y: Math.round(p.y * scale) - originY
    })));
    const clipper = new iconfontClipper.Clipper(iconfontClipper.Clipper.ioStrictlySimple);
    const fill = rule === 'EVENODD' ? iconfontClipper.PolyFillType.pftEvenOdd : iconfontClipper.PolyFillType.pftNonZero;
    if (!clipper.AddPaths(integers, iconfontClipper.PolyType.ptSubject, true)) return '';
    const result = [];
    if (!clipper.Execute(iconfontClipper.ClipType.ctUnion, result, fill, fill)) {
      const error = new Error('布尔运算未能解析自交轮廓。');
      error.code = 'geometry-ambiguous';
      throw error;
    }
    return result.map(contour => contour.map((p, i) => {
      const x = (p.X + originX) / scale, y = (p.Y + originY) / scale;
      return (i === 0 ? 'M ' : 'L ') + x + ' ' + y;
    }).join(' ') + ' Z').join(' ');
  }

  return {resolve};
})();
