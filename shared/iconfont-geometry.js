// The host supplies filled vector geometry after outlining strokes. Keep the original
// Béziers for output. The polylines below are used only to establish containment.
const IconfontGeometry = (() => {
  const messages = {
    'geometry-invalid': '路径数据或填充规则不受支持。',
    'geometry-ambiguous': '轮廓相交、相切或间距过小，请先检查布尔运算和路径。',
    'geometry-complex': '路径过于复杂，请简化后重试。',
    'geometry-empty': '没有可生成字体图形的填充轮廓。'
  };

  function fail(code) {
    const error = new Error(messages[code]);
    error.code = code;
    throw error;
  }

  const same = (a, b) => a.x === b.x && a.y === b.y;
  const cross = (a, b, c) => (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
  const dot = (a, b, c) => (b.x - a.x) * (c.x - a.x) + (b.y - a.y) * (c.y - a.y);

  function parse(data) {
    if (typeof data !== 'string') fail('geometry-invalid');
    // Preserve all original digits. In particular, nearby anchors can bound a thin hole.
    const token = /[a-zA-Z]|[+-]?(?:\d*\.\d+|\d+\.?\d*)(?:[eE][+-]?\d+)?/g;
    const tokens = [];
    let match, offset = 0;
    while ((match = token.exec(data))) {
      if (!/^[\s,]*$/.test(data.slice(offset, match.index))) fail('geometry-invalid');
      tokens.push(match[0]);
      offset = token.lastIndex;
    }
    if (!/^[\s,]*$/.test(data.slice(offset))) fail('geometry-invalid');

    let i = 0, command, current = {x: 0, y: 0}, start, segments, previous;
    const contours = [];
    function number() {
      if (i >= tokens.length || /^[a-z]$/i.test(tokens[i])) fail('geometry-invalid');
      const value = Number(tokens[i++]);
      if (!Number.isFinite(value) || Math.abs(value) > 1e12) fail('geometry-invalid');
      return value;
    }
    function append(points) {
      const prior = segments[segments.length - 1];
      if (points.length === 2 && prior && prior.length === 2 &&
          cross(prior[0], prior[1], points[1]) === 0 && dot(prior[1], prior[0], points[1]) < 0) {
        // A straight continuation has identical geometry without its middle anchor.
        segments[segments.length - 1] = [prior[0], points[1]];
      } else {
        segments.push(points);
      }
    }
    function finish() {
      if (segments && segments.length) {
        // SVG implicitly draws this line when filling an open subpath.
        if (!same(start, current)) append([current, start]);
        contours.push(segments);
      }
      segments = null;
      previous = null;
    }
    while (i < tokens.length) {
      if (/^[a-z]$/i.test(tokens[i])) command = tokens[i++];
      if (!command) fail('geometry-invalid');
      const type = command.toUpperCase(), relative = command !== type;
      const point = () => ({x: number() + (relative ? current.x : 0), y: number() + (relative ? current.y : 0)});
      if (type === 'M') {
        const next = point();
        finish();
        start = current = next;
        segments = [];
        command = relative ? 'l' : 'L';
        continue;
      }
      if (!segments) fail('geometry-invalid');
      if (type === 'Z') {
        finish();
        current = start;
        command = null;
        continue;
      }
      const reflect = degree => {
        if (!previous || previous.length !== degree + 1) return current;
        const control = previous[previous.length - 2];
        return {x: 2 * current.x - control.x, y: 2 * current.y - control.y};
      };
      let points;
      switch (type) {
        case 'L': points = [current, point()]; break;
        case 'H': points = [current, {x: number() + (relative ? current.x : 0), y: current.y}]; break;
        case 'V': points = [current, {x: current.x, y: number() + (relative ? current.y : 0)}]; break;
        case 'Q': points = [current, point(), point()]; break;
        case 'T': points = [current, reflect(2), point()]; break;
        case 'C': points = [current, point(), point(), point()]; break;
        case 'S': points = [current, reflect(3), point(), point()]; break;
        default: fail('geometry-invalid');
      }
      if (!points.every(p => same(p, current))) append(points);
      previous = points;
      current = points[points.length - 1];
    }
    finish();
    return contours;
  }

  function distanceToSegment(p, a, b) {
    const length = dot(a, b, b);
    const t = length ? Math.max(0, Math.min(1, dot(a, b, p) / length)) : 0;
    return Math.hypot(p.x - a.x - t * (b.x - a.x), p.y - a.y - t * (b.y - a.y));
  }

  function bisect(points) {
    let level = points;
    const left = [points[0]], right = [points[points.length - 1]];
    while (level.length > 1) {
      level = level.slice(1).map((p, i) => ({x: (p.x + level[i].x) / 2, y: (p.y + level[i].y) / 2}));
      left.push(level[0]);
      right.push(level[level.length - 1]);
    }
    return [left, right.reverse()];
  }

  function flatten(points, tolerance, edges, budget, depth = 0) {
    const a = points[0], b = points[points.length - 1];
    // The convex hull bounds the curve's deviation from the chord. Require
    // monotone control projections as well so a fold along the chord is not lost.
    let projection = 0, error = 0, monotone = true;
    for (let i = 1; i < points.length - 1; i++) {
      const next = dot(a, b, points[i]);
      if (next < projection || next > dot(a, b, b)) monotone = false;
      projection = next;
      error = Math.max(error, distanceToSegment(points[i], a, b));
    }
    if (!same(a, b) && monotone && error <= tolerance) {
      if (++budget.edges > 24000) fail('geometry-complex');
      edges.push({a, b, error, left: Math.min(a.x, b.x) - error, right: Math.max(a.x, b.x) + error,
        top: Math.min(a.y, b.y) - error, bottom: Math.max(a.y, b.y) + error});
      return;
    }
    if (depth >= 22) fail('geometry-ambiguous');
    for (const half of bisect(points)) flatten(half, tolerance, edges, budget, depth + 1);
  }

  function contourInfo(segments, budget) {
    // An entirely collinear subpath, including a single unexpanded line, has no area.
    const a = segments[0][0];
    let b = a, left = a.x, right = a.x, top = a.y, bottom = a.y, collinear = true;
    for (const segment of segments) for (const p of segment) {
      if (same(a, b)) b = p;
      if (cross(a, b, p) !== 0) collinear = false;
      left = Math.min(left, p.x); right = Math.max(right, p.x);
      top = Math.min(top, p.y); bottom = Math.max(bottom, p.y);
    }
    if (collinear) return null;
    const edges = [];
    const tolerance = Math.max(right - left, bottom - top) * 0.00005;
    for (const segment of segments) flatten(segment, tolerance, edges, budget);
    const area = edges.reduce((sum, edge) => sum + cross(a, edge.a, edge.b), 0);
    if (!area) fail('geometry-ambiguous');
    const info = {segments, edges, sign: Math.sign(area), left, right, top, bottom};
    edges.forEach((edge, index) => { edge.contour = info; edge.index = index; });
    return info;
  }

  function checkBoundaries(contours, budget) {
    const edges = [];
    for (const contour of contours) for (const edge of contour.edges) edges.push(edge);
    edges.sort((one, two) => one.left - two.left);
    for (let i = 0; i < edges.length; i++) {
      const e = edges[i];
      for (let j = i + 1; j < edges.length && edges[j].left <= e.right; j++) {
        if (++budget.pairs > 1500000) fail('geometry-complex');
        const f = edges[j];
        if (e.bottom < f.top || f.bottom < e.top) continue;
        if (e.contour === f.contour) {
          const diff = Math.abs(e.index - f.index);
          if (diff === 1 || diff === e.contour.edges.length - 1) {
            // A doubled-back edge shares more than its common endpoint.
            const first = same(e.b, f.a) ? e : f;
            const second = first === e ? f : e;
            if (cross(first.a, first.b, second.b) === 0 && dot(first.b, first.a, second.b) > 0) {
              fail('geometry-ambiguous');
            }
            continue;
          }
        }
        const crosses = cross(e.a, e.b, f.a) * cross(e.a, e.b, f.b) < 0 &&
          cross(f.a, f.b, e.a) * cross(f.a, f.b, e.b) < 0;
        const gap = e.error + f.error;
        if (crosses || distanceToSegment(e.a, f.a, f.b) <= gap || distanceToSegment(e.b, f.a, f.b) <= gap ||
            distanceToSegment(f.a, e.a, e.b) <= gap || distanceToSegment(f.b, e.a, e.b) <= gap) fail('geometry-ambiguous');
      }
    }
  }

  function contains(contour, p) {
    if (p.x < contour.left || p.x > contour.right || p.y < contour.top || p.y > contour.bottom) return false;
    let inside = false;
    for (const {a, b} of contour.edges) {
      if ((a.y > p.y) !== (b.y > p.y) && p.x < a.x + (p.y - a.y) * (b.x - a.x) / (b.y - a.y)) inside = !inside;
    }
    return inside;
  }

  function serialize(segments, reverse, matrix) {
    const ordered = reverse ? segments.slice().reverse().map(points => points.slice().reverse()) : segments;
    const xy = p => {
      if (!matrix) return p.x + ' ' + p.y;
      const [[a,c,tx],[b,d,ty]] = matrix;
      const x = a * p.x + c * p.y + tx, y = b * p.x + d * p.y + ty;
      if (!Number.isFinite(x) || !Number.isFinite(y)) fail('geometry-invalid');
      return x + ' ' + y;
    };
    const parts = ['M ' + xy(ordered[0][0])];
    ordered.forEach((points, i) => {
      if (points.length === 2 && i === ordered.length - 1) return; // represented by Z
      parts.push(['', '', 'L', 'Q', 'C'][points.length] + ' ' + points.slice(1).map(xy).join(' '));
    });
    return parts.join(' ') + ' Z';
  }

  function polygonForBoolean(segments, budget) {
    const start = segments[0][0];
    let left = start.x, right = start.x, top = start.y, bottom = start.y;
    for (const segment of segments) for (const p of segment) {
      left = Math.min(left, p.x); right = Math.max(right, p.x);
      top = Math.min(top, p.y); bottom = Math.max(bottom, p.y);
    }
    // At 48 px this permits less than 0.005 px deviation from a source curve,
    // about a tenth of a unit in a typical 1024-unit glyph.
    const tolerance = Math.max(right - left, bottom - top) * 0.0001;
    const polygon = [];
    function sample(points, depth) {
      const a = points[0], n = points.length - 1, b = points[n];
      // Compare the Bézier's control polygon with the same-degree representation
      // of its chord. Bernstein weights sum to one, so this bounds pointwise
      // deviation even on a loop or a collinear segment that doubles back.
      const flat = points.slice(1, -1).every((p, i) => {
        const t = (i + 1) / n;
        return Math.hypot(p.x - a.x - t * (b.x - a.x), p.y - a.y - t * (b.y - a.y)) <= tolerance;
      });
      if (flat) {
        if (++budget.samples > 48000) fail('geometry-complex');
        if (!same(a, b)) polygon.push(a);
        return;
      }
      if (depth >= 22) fail('geometry-complex');
      for (const half of bisect(points)) sample(half, depth + 1);
    }
    for (const segment of segments) sample(segment, 0);
    return polygon;
  }

  function normalizeBoundaries(parsed, rule, budget) {
    const contours = parsed.map(segments => contourInfo(segments, budget)).filter(Boolean);
    checkBoundaries(contours, budget);
    const result = [];
    for (const contour of contours) {
      let outside = 0;
      for (const other of contours) {
        if (other !== contour && contains(other, contour.segments[0][0])) outside += other.sign;
      }
      const filled = winding => rule === 'EVENODD' ? winding % 2 !== 0 : winding !== 0;
      const wasFilled = filled(outside), nowFilled = filled(outside + contour.sign);
      if (wasFilled === nowFilled) continue; // e.g. two nested, same-direction NONZERO solids
      // In SVG's y-down coordinates a positive signed area runs clockwise.
      result.push(serialize(contour.segments, contour.sign !== (nowFilled ? 1 : -1)));
    }
    return result.join(' ');
  }

  function normalize(paths) {
    if (!Array.isArray(paths)) fail('geometry-invalid');
    const result = [], budget = {edges: 0, pairs: 0, samples: 0};
    let dataLength = 0;
    for (const path of paths) {
      const rule = String(path && path.windingRule).toUpperCase();
      if (rule === 'NONE') continue; // A centerline has no filled silhouette.
      if (!['NONZERO', 'EVENODD'].includes(rule) || typeof path.data !== 'string') fail('geometry-invalid');
      dataLength += path.data.length;
      if (dataLength > 600000) fail('geometry-complex');
      const parsed = parse(path.data);
      if (parsed.length > 512) fail('geometry-complex');
      let data;
      try {
        data = normalizeBoundaries(parsed, rule, budget);
      } catch (error) {
        if (error.code !== 'geometry-ambiguous' || typeof IconfontBoolean === 'undefined') throw error;
        const polygons = parsed.map(segments => polygonForBoolean(segments, budget)).filter(points => points.length >= 3);
        data = IconfontBoolean.resolve(polygons, rule);
      }
      if (data) result.push(data);
    }
    if (!result.length) fail('geometry-empty');
    return [{windingRule: 'NONZERO', data: result.join(' ')}];
  }

  function canonicalize(data, matrix) {
    if (typeof data === 'string' && data.length > 600000) fail('geometry-complex');
    return parse(data).map(segments => serialize(segments, false, matrix)).join(' ');
  }

  return {normalize, canonicalize};
})();
