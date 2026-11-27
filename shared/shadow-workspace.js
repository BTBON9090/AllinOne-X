(() => {
  const panel = document.createElement('section');
  panel.id = 'shadowPanel'; panel.className = 'media-panel'; panel.style.display = 'none';
  const presets = {
    ambient: { zh:'柔和悬浮', en:'Soft ambient', distance:14, blur:28, angle:90, spread:0, layers:5, kind:'DROP_SHADOW', curve:[.25,.12,.58,.78], palette:'ink' },
    crisp: { zh:'近距投影', en:'Close shadow', distance:5, blur:9, angle:90, spread:0, layers:3, kind:'DROP_SHADOW', curve:[.2,.05,.65,.72], palette:'ink' },
    inset: { zh:'内凹阴影', en:'Inset', distance:5, blur:12, angle:90, spread:0, layers:4, kind:'INNER_SHADOW', curve:[.18,.36,.58,.96], palette:'ink' },
    glow: { zh:'暮光投影', en:'Dusk glow', distance:24, blur:40, angle:62, spread:0, layers:6, kind:'DROP_SHADOW', curve:[.22,.38,.72,.94], palette:'dusk' },
    elevated: { zh:'高悬卡片', en:'High elevation', distance:32, blur:64, angle:90, spread:0, layers:8, kind:'DROP_SHADOW', curve:[.12,.55,.66,.96], palette:'ink' },
    sidelight: { zh:'侧向光', en:'Side light', distance:20, blur:16, angle:155, spread:0, layers:5, kind:'DROP_SHADOW', curve:[.34,.12,.82,.86], palette:'blue' },
    outline: { zh:'轻薄边缘', en:'Soft edge', distance:0, blur:2, angle:90, spread:1, layers:2, kind:'DROP_SHADOW', curve:[.25,.25,.75,.75], palette:'ink' },
    long: { zh:'长影', en:'Long shadow', distance:36, blur:6, angle:38, spread:0, layers:8, kind:'DROP_SHADOW', curve:[.35,.06,.86,.78], palette:'iris' },
    halo: { zh:'双色光晕', en:'Two-tone halo', distance:10, blur:34, angle:-60, spread:2, layers:7, kind:'DROP_SHADOW', curve:[.24,.5,.66,.91], palette:'coral' },
    bevel: { zh:'内侧刻边', en:'Carved edge', distance:3, blur:3, angle:52, spread:1, layers:3, kind:'INNER_SHADOW', curve:[.2,.22,.6,.94], palette:'ink' },
    resting: { zh:'轻触底面', en:'Resting', distance:2, blur:4, angle:90, spread:0, layers:2, kind:'DROP_SHADOW', curve:[.32,.23,.66,.78], palette:'ink' },
    card: { zh:'日常卡片', en:'Everyday card', distance:7, blur:15, angle:90, spread:-2, layers:4, kind:'DROP_SHADOW', curve:[.22,.34,.68,.9], palette:'ink' },
    popover: { zh:'浮动菜单', en:'Popover', distance:12, blur:22, angle:90, spread:1, layers:5, kind:'DROP_SHADOW', curve:[.18,.28,.62,.88], palette:'ink' },
    dialog: { zh:'对话框悬浮', en:'Floating dialog', distance:21, blur:40, angle:90, spread:2, layers:7, kind:'DROP_SHADOW', curve:[.16,.34,.56,.86], palette:'ink' },
    counter: { zh:'向上悬浮', en:'Lift upwards', distance:14, blur:22, angle:-90, spread:-1, layers:5, kind:'DROP_SHADOW', curve:[.32,.25,.62,.85], palette:'ink' },
    print: { zh:'硬边印刷', en:'Hard print', distance:10, blur:0, angle:46, spread:0, layers:1, kind:'DROP_SHADOW', curve:[.25,.25,.75,.75], palette:'ink' },
    stage: { zh:'偏轴长投影', en:'Directional cast', distance:39, blur:15, angle:145, spread:-3, layers:8, kind:'DROP_SHADOW', curve:[.4,.04,.78,.62], palette:'ink' },
    underlay: { zh:'四周柔影', en:'Soft surround', distance:0, blur:20, angle:90, spread:5, layers:4, kind:'DROP_SHADOW', curve:[.23,.48,.65,.88], palette:'ink' },
    ice: { zh:'冰蓝浮光', en:'Ice light', distance:11, blur:23, angle:108, spread:2, layers:5, kind:'DROP_SHADOW', curve:[.26,.16,.64,.83], palette:'blue' },
    lavender: { zh:'薰衣草光晕', en:'Lavender halo', distance:1, blur:32, angle:90, spread:6, layers:5, kind:'DROP_SHADOW', curve:[.17,.3,.72,.96], palette:'iris' },
    sunset: { zh:'日落长影', en:'Sunset cast', distance:31, blur:9, angle:28, spread:-1, layers:8, kind:'DROP_SHADOW', curve:[.2,.2,.75,.89], palette:'dusk' },
    neon: { zh:'霓虹偏光', en:'Off-axis neon', distance:16, blur:14, angle:-33, spread:4, layers:6, kind:'DROP_SHADOW', curve:[.22,.31,.66,.83], palette:'coral' },
    seam: { zh:'齐边细缝', en:'Fine inset seam', distance:0, blur:1, angle:90, spread:1, layers:1, kind:'INNER_SHADOW', curve:[.25,.25,.75,.75], palette:'ink' },
    pressed: { zh:'按下反馈', en:'Pressed', distance:3, blur:8, angle:90, spread:0, layers:3, kind:'INNER_SHADOW', curve:[.17,.28,.61,.82], palette:'ink' },
    channel: { zh:'顶部凹槽', en:'Top recess', distance:7, blur:13, angle:90, spread:1, layers:5, kind:'INNER_SHADOW', curve:[.21,.51,.68,.94], palette:'ink' },
    recess: { zh:'深凹面', en:'Deep recess', distance:11, blur:20, angle:80, spread:2, layers:6, kind:'INNER_SHADOW', curve:[.25,.5,.64,.92], palette:'ink' },
    lip: { zh:'底部倒角', en:'Bottom bevel', distance:4, blur:4, angle:-90, spread:1, layers:3, kind:'INNER_SHADOW', curve:[.2,.2,.58,.89], palette:'ink' },
    glass: { zh:'玻璃内光', en:'Glass edge', distance:8, blur:17, angle:136, spread:2, layers:4, kind:'INNER_SHADOW', curve:[.25,.18,.65,.8], palette:'blue' },
    duskInset: { zh:'暮色内光', en:'Dusk inset', distance:6, blur:18, angle:-38, spread:4, layers:5, kind:'INNER_SHADOW', curve:[.22,.38,.7,.84], palette:'dusk' },
    satin: { zh:'丝绒内影', en:'Satin inset', distance:0, blur:19, angle:90, spread:5, layers:4, kind:'INNER_SHADOW', curve:[.19,.32,.67,.94], palette:'iris' },
    rgbSplit: { zh:'红蓝错位', en:'Red / blue split', distance:4, blur:0, angle:0, spread:0, layers:2, kind:'DROP_SHADOW', split:true, curve:[.25,.25,.75,.75], stops:[[0,'#ff214b',96],[100,'#2563ff',96]] },
    signalShift: { zh:'红绿移位', en:'Red / green shift', distance:5, blur:0, angle:-16, spread:0, layers:2, kind:'DROP_SHADOW', split:true, curve:[.25,.25,.75,.75], stops:[[0,'#ff3246',94],[100,'#00c966',96]] },
    duotone: { zh:'紫黄重影', en:'Violet / yellow offset', distance:6, blur:1, angle:30, spread:0, layers:2, kind:'DROP_SHADOW', split:true, curve:[.25,.25,.75,.75], stops:[[0,'#8236ff',94],[100,'#ffcd16',98]] },
    echo: { zh:'青品红回声', en:'Cyan / magenta echo', distance:7, blur:1, angle:6, spread:0, layers:4, kind:'DROP_SHADOW', split:true, curve:[.25,.12,.75,.86], stops:[[0,'#00bada',82],[25,'#00e2ef',98],[75,'#f626d9',98],[100,'#d513bf',82]] }
  };
  const palettes = {
    ink: {zh:'石墨',en:'Graphite',stops:[[0,'#211c30',32],[100,'#211c30',12]]},
    iris: {zh:'鸢尾',en:'Iris',stops:[[0,'#4d23a5',42],[100,'#b58aec',18]]},
    dusk: {zh:'暮光',en:'Dusk',stops:[[0,'#4e2986',48],[52,'#aa4779',33],[100,'#ef9766',18]]},
    blue: {zh:'海蓝',en:'Ocean',stops:[[0,'#173975',42],[100,'#47b9c3',20]]},
    coral: {zh:'珊瑚与靛蓝',en:'Coral and indigo',stops:[[0,'#fc6c6f',64],[100,'#5756e0',45]]}
  };
  const t = (zh,en) => curLang === 'en' ? en : zh;
  const clamp = (value,min,max) => Math.min(max,Math.max(min,value));
  const round = (value,scale = 100) => Math.round(value * scale) / scale;
  const field = (id,zh,en) => '<label for="'+id+'" data-zh="'+zh+'" data-en="'+en+'"></label>';
  const counts = 8;
  const numeric = [
    {key:'Angle',zh:'角度',en:'Angle',unit:'°',min:-180,max:180},
    {key:'Distance',zh:'距离',en:'Distance',unit:'px',min:0,max:512},
    {key:'Blur',zh:'模糊',en:'Blur',unit:'px',min:0,max:512},
    {key:'Spread',zh:'扩展',en:'Spread',unit:'px',min:-256,max:256},
    {key:'Layers',zh:'效果层数',en:'Layers',unit:'',min:1,max:counts}
  ];
  const holdLabels = Object.fromEntries(numeric.map(item => [item.key,[item.zh,item.en]]));
  Object.assign(holdLabels,{Kind:['类型','Type'],Curve:['曲线','Curve'],Gradient:['渐变','Gradient']});
  const lockButton = key => '<button type="button" class="media-shadow-lock" data-lock="'+key+'" aria-pressed="false"></button>';
  const kindButtons = [
    ['DROP_SHADOW','外阴影','Outer'],
    ['INNER_SHADOW','内阴影','Inner']
  ];
  const categories = [...kindButtons,['GLITCH','故障','Glitch']];
  panel.innerHTML = `
    <div class="media-shadow-tabs" role="tablist">
      <button type="button" id="mediaShadowPresetsTab" role="tab" aria-controls="mediaShadowPresets" data-shadow-tab="presets" data-zh="预设" data-en="Presets"></button>
      <button type="button" id="mediaShadowCustomTab" role="tab" aria-controls="mediaShadowCustom" data-shadow-tab="custom" data-zh="自定义" data-en="Customize"></button>
    </div>
    <div class="media-scroll media-shadow-presets" id="mediaShadowPresets" role="tabpanel" aria-labelledby="mediaShadowPresetsTab">
      <div class="media-preset-current">
        <div class="media-preset-caption"><strong class="media-preset-name"></strong><span class="media-preset-detail"></span></div>
        <div class="media-preset-quick">
          ${['Distance','Blur'].map(key=>{
            const {zh,en}=numeric.find(item=>item.key===key);
            return '<div class="media-field">'+field('mediaQuick'+key,zh+' px',en+' px')+
              '<input id="mediaQuick'+key+'" type="number" step="any"></div>';
          }).join('')}
        </div>
      </div>
      <div class="media-preset-categories" role="tablist">
        ${categories.map(([key,zh,en])=>`<button type="button" id="mediaPresetTab-${key}" role="tab" aria-controls="mediaPresetGrid-${key}" data-preset-category="${key}" data-zh="${zh}" data-en="${en}"></button>`).join('')}
      </div>
      ${categories.map(([key])=>`<div class="media-preset-grid" role="tabpanel" id="mediaPresetGrid-${key}" aria-labelledby="mediaPresetTab-${key}" data-preset-group="${key}" hidden></div>`).join('')}
    </div>
    <div class="media-scroll" id="mediaShadowCustom" role="tabpanel" aria-labelledby="mediaShadowCustomTab" hidden>
      <div class="media-shadow-source">
          <span class="media-custom-source"></span>
          <button type="button" class="secondary-btn media-pick" id="mediaShadowPick" data-zh="拾取所选阴影" data-en="Pick shadow"></button>
      </div>
      <div class="media-shadow-kind-row">
        <div class="media-shadow-legend"><span id="mediaShadowKindLabel" data-zh="类型" data-en="Type"></span>${lockButton('Kind')}</div>
        <div id="mediaShadowKind" class="media-shadow-kind" role="group" aria-labelledby="mediaShadowKindLabel">
          ${kindButtons.map(([key,zh,en]) => '<button type="button" data-kind="'+key+'" data-zh="'+zh+'" data-en="'+en+'"></button>').join('')}
        </div>
      </div>
      <div class="media-shadow-preview" aria-hidden="true"><div></div></div>
      <div class="media-inputs media-shadow-inputs">
        ${numeric.map(({key,zh,en,unit,min,max}) =>
          '<div class="media-field media-shadow-control'+(key==='Angle'?' media-shadow-angle':'')+'">'+field('mediaShadow'+key,zh+(unit?' '+unit:''),en+(unit?' '+unit:''))+
          lockButton(key)+'<input id="mediaShadow'+key+'" type="number" step="'+(key==='Layers'?'1':'any')+'" min="'+min+'" max="'+max+'">'+
          '<input id="mediaShadow'+key+'Slider" type="range" step="1" min="'+min+'" max="'+max+'">'+
          (key==='Angle'?'<button type="button" class="media-shadow-reverse" id="mediaShadowReverse" data-zh="反向" data-en="Flip"></button>':'')+'</div>').join('')}
      </div>
      <section class="media-field media-depth" aria-labelledby="mediaShadowCurveLabel">
        <div class="media-shadow-legend"><h3 id="mediaShadowCurveLabel" data-zh="距离与深度曲线" data-en="Distance and depth"></h3>${lockButton('Curve')}</div>
        <div class="media-curve-viewport">
          <svg width="220" height="100" viewBox="0 0 220 100" preserveAspectRatio="xMidYMid meet">
            <path class="media-curve-grid" d="M10 10H210 M10 30H210 M10 50H210 M10 70H210 M10 90H210 M10 10V90 M60 10V90 M110 10V90 M160 10V90 M210 10V90"></path>
            <path class="media-curve-handles"></path><path class="media-curve-line"></path>
            <circle data-point="0" tabindex="0" role="button" r="6"></circle><circle data-point="1" tabindex="0" role="button" r="6"></circle>
          </svg>
        </div>
        <small data-zh="横轴是距离，纵轴控制模糊、扩展和浓度。支持拖动或使用方向键。" data-en="X is distance. Y controls blur, spread and intensity. Drag or use the arrow keys."></small>
      </section>
      <section class="media-field media-shadow-gradient" aria-labelledby="mediaShadowGradientLabel">
        <div class="media-shadow-legend"><h3 id="mediaShadowGradientLabel" data-zh="阴影渐变" data-en="Shadow gradient"></h3>${lockButton('Gradient')}</div>
        <div id="mediaShadowPalette" class="media-gradient-cards" role="group" aria-labelledby="mediaShadowGradientLabel"></div>
        <div class="media-gradient-ramp">
          <div class="media-gradient-strip" aria-hidden="true"></div>
          <div class="media-gradient-direction"><span></span><span></span></div>
        </div>
        <div class="media-stop-labels"><span data-zh="颜色" data-en="Color"></span><span data-zh="位置 %" data-en="Stop %"></span><span data-zh="不透明度 %" data-en="Opacity %"></span></div>
        <div class="media-stops"></div>
        <button type="button" class="secondary-btn media-add-stop" data-zh="添加色标" data-en="Add stop"></button>
      </section>
    </div>
    <div class="media-shadow-footer">
      <p class="media-shadow-status" role="status"></p>
      <div class="media-shadow-actions">
        <button type="button" class="secondary-btn media-clear" data-zh="清除阴影" data-en="Clear shadows"></button>
        <button type="button" class="primary-btn media-apply" data-zh="应用到所选图层" data-en="Apply to selection"></button>
      </div>
    </div>`;

  document.getElementById('contentScroll').append(panel);
  const $ = selector => panel.querySelector(selector);
  const number = key => $('#mediaShadow'+key);
  const slider = key => $('#mediaShadow'+key+'Slider');
  const tabs = [...panel.querySelectorAll('[data-shadow-tab]')];
  const categoryTabs = [...panel.querySelectorAll('[data-preset-category]')];
  const presetCards = new Map();
  const quickKeys = ['Distance','Blur'];
  const reverse = $('#mediaShadowReverse');
  const graph = $('.media-depth svg');
  const points = [...graph.querySelectorAll('circle')];
  const pick = $('#mediaShadowPick');
  const apply = $('.media-apply');
  const clear = $('.media-clear');
  const status = $('.media-shadow-status');
  const locks = new Set();
  const lockControls = [...panel.querySelectorAll('[data-lock]')];
  const typeControls = [...panel.querySelectorAll('[data-kind]')];
  const paletteControls = new Map();
  let chosen = 'ambient', basePreset = 'ambient', palette = 'ink', kind = 'DROP_SHADOW';
  let split = false;
  let curve = [], stops = [], sample = [], selection = [];
  let picked = null, reflected = false, serial = 0, pending = null, report = null, drag = null;

  const rgb = hex => [1,3,5].map(i => parseInt(hex.slice(i,i+2),16)/255);
  const toHex = ({r,g,b}) => '#'+[r,g,b].map(value => Math.round(clamp(value,0,1)*255).toString(16).padStart(2,'0')).join('');
  const cubic = (x,a,b) => 3*(1-x)*(1-x)*x*a+3*(1-x)*x*x*b+x*x*x;
  function depthAt(x, points = curve) {
    if (x <= 0 || x >= 1) return clamp(x,0,1);
    let lo = 0, hi = 1;
    for (let i=0;i<18;i++) {
      const mid = (lo+hi)/2;
      if (cubic(mid,points[0],points[2]) < x) lo = mid;
      else hi = mid;
    }
    return cubic((lo+hi)/2,points[1],points[3]);
  }
  const gradientStops = (values,alpha) => values.slice().sort((a,b)=>a[0]-b[0]).map(([at,hex,opacity]) =>
    (alpha ? hex+Math.round(clamp(opacity,0,100)*2.55).toString(16).padStart(2,'0') : hex)+' '+at+'%').join(',');
  const gradient = (values,alpha = false) => 'linear-gradient(to right,'+gradientStops(values,alpha)+')';
  function colorAt(position, colorStops = stops) {
    const sorted = colorStops.slice().sort((a,b) => a[0]-b[0]);
    const i = sorted.findIndex(stop => stop[0] >= position);
    const endIndex = i < 0 ? sorted.length-1 : Math.max(1,i);
    const a = sorted[endIndex-1], b = sorted[endIndex];
    const mix = clamp((position-a[0])/(b[0]-a[0]||1),0,1);
    const first = rgb(a[1]), last = rgb(b[1]);
    const [r,g,blue] = first.map((value,j) => value+(last[j]-value)*mix);
    return {r,g,b:blue,a:(a[2]+(b[2]-a[2])*mix)/100};
  }
  function density(alpha,weight) {
    return 1-Math.pow(1-alpha,Math.max(0,weight));
  }
  const copyStops = values => values.map(stop => [...stop]);
  const angleOf = effect => Math.atan2(effect.y,effect.x)*180/Math.PI;
  const distanceOf = effect => Math.hypot(effect.x,effect.y);
  const sameValues = (a,b) => JSON.stringify(a) === JSON.stringify(b);

  // A split stack alternates two opposite directions. Each side has its own
  // opacity budget and reaches the requested distance, including odd counts.
  function layerProfile(index, count, splitLayout) {
    if (!splitLayout) return {step:(index+1)/count,before:index/count,direction:1,at:count===1?0:100*index/(count-1)};
    const negative = index%2===0;
    const sideCount = negative ? Math.ceil(count/2) : Math.floor(count/2);
    const rank = Math.floor(index/2), step = (rank+1)/sideCount;
    const direction = negative ? -1 : 1;
    return {step,before:rank/sideCount,direction,at:50*(1+direction*step)};
  }

  function splitAxis(shadows) {
    if (shadows.length<2) return null;
    const axis = shadows[2*Math.floor(shadows.length/2)-1];
    if (distanceOf(axis)<.02) return null;
    const matches = shadows.every((shadow,index)=>{
      const {step,direction} = layerProfile(index,shadows.length,true);
      return Math.hypot(shadow.x-axis.x*step*direction,shadow.y-axis.y*step*direction)<.02;
    });
    return matches ? axis : null;
  }

  function fitCurve(effects, blur, spread, splitLayout) {
    // Linear X makes the two Y coefficients measurable. Fit both native
    // blur and spread profiles when present, otherwise start with a diagonal.
    if (effects.length < 2 || (!blur && !spread)) return [1/3,1/3,2/3,2/3];
    let p=0,q=0,r=0,s=0,w=0;
    effects.forEach((effect,index) => {
      const x = layerProfile(index,effects.length,splitLayout).step;
      const measures = [];
      if (blur) measures.push(effect.blur/blur);
      if (spread) measures.push(clamp(effect.spread/spread,0,1));
      const y = measures.reduce((sum,v)=>sum+v,0)/measures.length;
      const a = 3*(1-x)*(1-x)*x, b = 3*(1-x)*x*x, target = y-x*x*x;
      p+=a*a; q+=a*b; r+=b*b; s+=a*target; w+=b*target;
    });
    const determinant = p*r-q*q;
    // A two-effect stack has only one interior observation.
    if (Math.abs(determinant) < 1e-8) {
      if (p+r<1e-8) return [1/3,1/3,2/3,2/3];
      const middle = blur ? effects[0].blur/blur : effects[0].spread/spread;
      const shift = (middle-.5)/.75;
      return [1/3,clamp(1/3+shift,0,1),2/3,clamp(2/3+shift,0,1)];
    }
    return [1/3,clamp((r*s-q*w)/determinant,0,1),2/3,clamp((p*w-q*s)/determinant,0,1)];
  }

  function describeNative(shadows) {
    const axis = splitAxis(shadows);
    const greatest = axis || shadows.reduce((result,s) => distanceOf(s)>distanceOf(result)?s:result,shadows[0]);
    const spread = shadows.reduce((result,s) => Math.abs(s.spread)>Math.abs(result)?s.spread:result,0);
    const blur = Math.max(...shadows.map(s=>s.blur));
    const fit = fitCurve(shadows,blur,spread,!!axis);
    const ramp = shadows.map((effect,index) => {
      const {step,before,at} = layerProfile(index,shadows.length,!!axis);
      const weight = depthAt(step,fit)-depthAt(before,fit);
      const opacity = weight > 1e-5 ? 1-Math.pow(1-effect.color.a,1/weight) : effect.color.a;
      return [round(at),toHex(effect.color),round(100*opacity)];
    }).sort((a,b)=>a[0]-b[0]);
    if (ramp.length === 1) ramp.push([100,ramp[0][1],ramp[0][2]]);
    return {
      shadows,split:!!axis,
      values:{Angle:round(angleOf(greatest)),Distance:round(distanceOf(greatest)),Blur:round(blur),Spread:round(spread),Layers:shadows.length},
      curve:fit, stops:ramp
    };
  }

  function makeSamples(values, points = curve, colorStops = stops, splitLayout = split) {
    const {Angle,Distance,Blur,Spread,Layers} = values;
    const radians = Angle*Math.PI/180;
    // Sample from near (top of the composited stack) to far. The host
    // converts to the editor's native storage order.
    return Array.from({length:Layers},(_,index) => {
      const {step,before,direction,at} = layerProfile(index,Layers,splitLayout);
      const depth = depthAt(step,points);
      const color = colorAt(at,colorStops);
      color.a = density(color.a,depth-depthAt(before,points));
      return {x:round(Math.cos(radians)*Distance*step*direction),y:round(Math.sin(radians)*Distance*step*direction),
        blur:round(Blur*depth),spread:round(Spread*depth),color};
    });
  }
  function cssShadow(items,type,scale = 1) {
    return items.map(({x,y,blur,spread,color}) => {
      const {r,g,b,a} = color;
      return (type==='INNER_SHADOW'?'inset ':'')+[x,y,blur,spread].map(value=>round(value*scale)+'px').join(' ')+
        ' rgba('+[r,g,b].map(value=>Math.round(value*255)).join(',')+','+a+')';
    }).join(',');
  }

  function samplesFromPicked(values) {
    if (values.Layers !== picked.values.Layers) return makeSamples(values);
    const reference = picked.values;
    const curveChanged = !sameValues(curve,picked.curve);
    const paletteChanged = !sameValues(stops,picked.stops);
    const sourceAngle = reflected ? -reference.Angle : reference.Angle;
    const turn = (values.Angle-sourceAngle)*Math.PI/180;
    const angle = values.Angle*Math.PI/180;
    const moved = reflected || values.Angle !== reference.Angle || values.Distance !== reference.Distance;
    return picked.shadows.map((effect,index) => {
      const {step,before,direction,at} = layerProfile(index,values.Layers,split);
      const depth = depthAt(step);
      const originalDepth = depthAt(step,picked.curve);
      const weight = depth-depthAt(before);
      const adjusted = {...effect};
      if (moved) {
        const gain = reference.Distance ? values.Distance/reference.Distance : 0;
        const offsetY = reflected ? -effect.y : effect.y;
        if(!turn && values.Distance===reference.Distance){
          adjusted.x=effect.x;adjusted.y=offsetY;
        }else{
          adjusted.x = round(reference.Distance
            ? (effect.x*Math.cos(turn)-offsetY*Math.sin(turn))*gain : values.Distance*step*direction*Math.cos(angle));
          adjusted.y = round(reference.Distance
            ? (effect.x*Math.sin(turn)+offsetY*Math.cos(turn))*gain : values.Distance*step*direction*Math.sin(angle));
        }
      }
      if (curveChanged || values.Blur !== reference.Blur) {
        adjusted.blur = reference.Blur && !curveChanged ? round(effect.blur*values.Blur/reference.Blur) : round(values.Blur*depth);
      }
      if (curveChanged || values.Spread !== reference.Spread) {
        adjusted.spread = reference.Spread && !curveChanged ? round(effect.spread*values.Spread/reference.Spread) : round(values.Spread*depth);
      }
      if (paletteChanged) {
        const color = colorAt(at);
        color.a = density(color.a,weight);
        adjusted.color = color;
      } else if (curveChanged) {
        const oldWeight = originalDepth-depthAt(before,picked.curve);
        adjusted.color = {...effect.color,a:oldWeight>1e-5?density(effect.color.a,weight/oldWeight):effect.color.a};
      }
      return adjusted;
    });
  }

  function markCustom() {
    chosen = 'custom';
    report = null;
  }

  function syncRange(key) {
    const input = number(key), range = slider(key);
    if (!input.value || !input.validity.valid) return;
    const value = Number(input.value);
    range.min = key==='Spread' ? Math.min(-32,Math.floor(value)) : input.min;
    range.max = key==='Spread' ? Math.max(32,Math.ceil(value)) :
      ['Blur','Distance'].includes(key) ? Math.max(96,Math.ceil(value)) : input.max;
    range.value = value;
  }
  function setNumber(key,value) {
    const definition = numeric.find(item=>item.key===key);
    const input = number(key);
    input.min = Math.min(definition.min,Math.floor(value));
    input.max = Math.max(definition.max,Math.ceil(value));
    input.value = value;
    syncRange(key);
  }
  function setPalette(key) {
    palette = key;
    stops = copyStops(palettes[key].stops);
  }
  const presetValues = config => Object.fromEntries(numeric.map(({key})=>[key,config[key.toLowerCase()]]));
  const presetStops = config => config.stops || palettes[config.palette].stops;
  function matchSplitPreset(native,sourceKind) {
    // Native shadows do not store gradients or Bezier handles. Recover both
    // precisely when the samples still match a factory preset.
    for (const [key,config] of Object.entries(presets)) {
      if (!config.split || config.kind!==sourceKind || config.layers!==native.length) continue;
      const expected=makeSamples(presetValues(config),config.curve,presetStops(config),true);
      const close=(a,b)=>Math.abs(a-b)<0.00001;
      if (expected.every((s,i)=>['x','y','blur','spread'].every(k=>close(s[k],native[i][k])) &&
        ['r','g','b','a'].every(k=>close(s.color[k],native[i].color[k])))) return key;
    }
    return null;
  }
  function setPreset(key) {
    const config = presets[key];
    if (!config) return;
    // A preset replaces only the variables the user left unlocked.
    chosen = basePreset = key;
    picked = null;
    split = !!config.split;
    reflected = false;
    report = null;
    if (!locks.has('Kind')) kind = config.kind;
    for (const {key:name} of numeric) {
      if (!locks.has(name)) setNumber(name,config[name.toLowerCase()]);
    }
    if (!locks.has('Curve')) curve = [...config.curve];
    if (!locks.has('Gradient')) {
      palette=config.palette || 'custom';
      stops=copyStops(presetStops(config));
    }
    refreshEditing();
  }

  function selectTab(current,group) {
    for(const tab of group){
      const active=tab===current;
      tab.setAttribute('aria-selected',String(active));
      tab.tabIndex=active?0:-1;
      panel.querySelector('#'+tab.getAttribute('aria-controls')).hidden=!active;
    }
  }
  for(const group of [tabs,categoryTabs]){
    group.forEach((tab,index)=>{
      tab.onclick=()=>selectTab(tab,group);
      tab.onkeydown=event=>{
        if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
        const next=event.key==='Home'?group[0]:event.key==='End'?group.at(-1):
          group[(index+(event.key==='ArrowRight'?1:-1)+group.length)%group.length];
        next.click();next.focus();event.preventDefault();
      };
    });
  }
  function addPresetCards() {
    for(const [key,config] of Object.entries(presets)){
      const button=document.createElement('button');
      button.type='button';button.className='media-preset-card';button.dataset.shadowPreset=key;
      const stage=document.createElement('span'),example=document.createElement('span');
      stage.className='media-preset-stage';stage.setAttribute('aria-hidden','true');
      example.style.boxShadow=cssShadow(makeSamples(presetValues(config),config.curve,presetStops(config),!!config.split),config.kind,.65);
      stage.append(example);
      const label=document.createElement('span');label.className='media-preset-label';
      button.append(stage,label);
      button.onclick=()=>setPreset(key);
      presetCards.set(key,{button,label});
      $('[data-preset-group="'+(config.split?'GLITCH':config.kind)+'"]').append(button);
    }
  }
  function updatePresetControls() {
    for(const [key,{button}] of presetCards){
      const active=String(key===chosen);
      if(button.getAttribute('aria-pressed')!==active)button.setAttribute('aria-pressed',active);
    }
    const label=chosen==='custom'?t('自定义参数','Custom settings'):t(presets[chosen].zh,presets[chosen].en);
    const count=number('Layers').value;
    const type=kind==='INNER_SHADOW'?t('内阴影','Inner shadow'):t('外阴影','Outer shadow');
    $('.media-preset-name').textContent=label;
    $('.media-preset-detail').textContent=count?type+t(' · '+count+' 层',' · '+count+(count==='1'?' layer':' layers')):type;
    $('.media-custom-source').textContent=basePreset
      ? t('基于 '+presets[basePreset].zh,'Based on '+presets[basePreset].en) : label;
    for(const key of quickKeys){
      const input=number(key),mirror=$('#mediaQuick'+key);
      mirror.disabled=locks.has(key);
      mirror.min=input.min;mirror.max=input.max;
      if(mirror.value!==input.value)mirror.value=input.value;
    }
  }
  for(const key of quickKeys){
    const mirror=$('#mediaQuick'+key);
    mirror.oninput=()=>{
      number(key).value=mirror.value;
      syncRange(key);markCustom();update();
    };
  }

  function addPaletteCards() {
    for (const [key] of [...Object.entries(palettes),['custom']]) {
      const button = document.createElement('button');
      button.className = 'media-gradient-card';
      button.type = 'button';
      button.dataset.palette = key;
      const swatch = document.createElement('span');
      swatch.className = 'media-gradient-swatch';
      swatch.setAttribute('aria-hidden','true');
      const name = document.createElement('span');
      button.append(swatch,name);
      button.onclick = () => {
        if (locks.has('Gradient')) return;
        if (key==='custom') {
          palette = key;
          refreshPalette();
          $('.media-stops input[type=color]')?.focus();
          return;
        }
        setPalette(key);
        markCustom();
        buildStops();
        update();
      };
      paletteControls.set(key,{button,swatch,name});
      $('#mediaShadowPalette').append(button);
    }
  }
  function refreshPalette() {
    for (const [key,{button,swatch,name}] of paletteControls) {
      const meta = palettes[key];
      name.textContent = meta ? t(meta.zh,meta.en) : t('自定义','Custom');
      swatch.style.backgroundImage = gradient(meta ? meta.stops : stops);
      button.setAttribute('aria-pressed',String(key===palette));
      button.disabled = locks.has('Gradient');
    }
    $('.media-gradient-strip').style.setProperty('--shadow-ramp',gradient(stops,true));
    const labels=$('.media-gradient-direction').children;
    labels[0].textContent=split?t('反方向','Opposite'):t('近端','Near');
    labels[1].textContent=split?t('沿角度','Along angle'):t('远端','Far');
  }
  function buildStops() {
    const list = $('.media-stops');
    list.replaceChildren();
    const disabled = locks.has('Gradient');
    stops.forEach((stop,index) => {
      const row = document.createElement('div');
      row.className = 'media-stop-row';
      const color = document.createElement('input');
      color.type = 'color';
      color.value = stop[1];
      color.disabled = disabled;
      color.setAttribute('aria-label',t('色标颜色','Stop color')+' '+(index+1));
      const percentage = (value,label) => {
        const field = document.createElement('input');
        field.type = 'number'; field.min = '0'; field.max = '100'; field.step = 'any'; field.required = true;
        field.value = value; field.disabled = disabled;
        field.setAttribute('aria-label',label+' '+(index+1));
        return field;
      };
      const position = percentage(stop[0],t('色标位置','Stop position'));
      const opacity = percentage(stop[2],t('色标不透明度','Stop opacity'));
      const remove = document.createElement('button');
      remove.type = 'button'; remove.className = 'media-remove'; remove.textContent = '×';
      remove.setAttribute('aria-label',t('删除色标','Remove stop')+' '+(index+1));
      const endpoint = index===0 || index===stops.length-1;
      position.disabled = endpoint || disabled; remove.disabled = endpoint || disabled;
      row.append(color,position,opacity,remove);
      list.append(row);
      const modify = () => {
        palette = 'custom';
        markCustom();
        stop[1] = color.value;
        if (position.validity.valid) stop[0] = Number(position.value);
        if (opacity.validity.valid) stop[2] = Number(opacity.value);
        update();
      };
      for (const input of [color,position,opacity]) input.oninput = modify;
      remove.onclick = () => {
        stops.splice(index,1);
        palette = 'custom';
        markCustom();
        buildStops();
        update();
      };
    });
    $('.media-add-stop').disabled = disabled || stops.length>=counts;
  }

  function curveDrawing() {
    const px = x=>10+200*x, py = y=>90-80*y;
    const [x1,y1,x2,y2] = curve;
    const frozen = locks.has('Curve');
    graph.classList.toggle('is-locked',frozen);
    [[x1,y1],[x2,y2]].forEach(([x,y],i) => {
      points[i].setAttribute('cx',px(x));
      points[i].setAttribute('cy',py(y));
      points[i].setAttribute('aria-label',t('曲线控制点','Curve control point')+' '+(i+1)+', '+x.toFixed(2)+', '+y.toFixed(2));
      points[i].setAttribute('aria-disabled',String(frozen));
      points[i].setAttribute('tabindex',frozen?'-1':'0');
    });
    graph.querySelector('.media-curve-handles').setAttribute('d','M10 90L'+px(x1)+' '+py(y1)+' M210 10L'+px(x2)+' '+py(y2));
    graph.querySelector('.media-curve-line').setAttribute('d','M10 90C'+px(x1)+' '+py(y1)+' '+px(x2)+' '+py(y2)+' 210 10');
  }
  function refreshLocks() {
    for (const button of lockControls) {
      const key = button.dataset.lock;
      const frozen = locks.has(key);
      const [zh,en] = holdLabels[key];
      const label = frozen ? t('解锁'+zh,'Unlock '+en.toLowerCase()) : t('锁定'+zh,'Lock '+en.toLowerCase());
      button.setAttribute('aria-pressed',String(frozen));
      button.setAttribute('aria-label',label);
      button.title = label;
      window.PluginIcons.put(button,frozen?'lock':'lock-open');
    }
    for (const {key} of numeric) number(key).disabled = slider(key).disabled = locks.has(key);
    for (const button of typeControls) {
      button.disabled = locks.has('Kind');
      button.setAttribute('aria-pressed',String(button.dataset.kind===kind));
    }
  }

  function updateStatus() {
    const supported = selection.filter(item=>item.shadowable).length;
    const bad = panel.querySelector('input:invalid');
    pick.disabled = Boolean(pending) || selection.length!==1 || supported!==1;
    clear.disabled = Boolean(pending) || !supported;
    apply.disabled = Boolean(pending) || !supported || !sample.length || Boolean(bad);
    if (report?.action==='pick' && !report.error) {
      const {name,length,kind:sourceKind} = report;
      const effect = sourceKind==='INNER_SHADOW' ? t('内阴影','inner shadows') : t('外阴影','outer shadows');
      status.textContent = t('已拾取「'+name+'」的 '+length+' 层'+effect+'。','Picked '+length+' '+effect+' from “'+name+'”.')+
        (locks.size ? t(' 已保留锁定参数。',' Locked values retained.') : '');
      return;
    }
    if (report) {
      const issues = report.issues || [];
      let message = report.error || (report.action==='clear'
        ? t('已清除 '+report.applied+' 个图层的阴影。','Cleared shadows from '+report.applied+' layers.')
        : t('已应用到 '+report.applied+' 个图层。','Applied to '+report.applied+' layers.'));
      if(report.action==='clear' && report.unchanged)message += ' '+t(report.unchanged+' 个图层没有阴影。',report.unchanged+' layers had no shadows.');
      if (issues.length) message += ' '+t('跳过 '+issues.length+' 个：','Skipped '+issues.length+': ')+issues.map(i=>i.name+' · '+i.reason).join(' / ');
      status.textContent = message;
      return;
    }
    if (pending) {
      status.textContent = pending.action==='pick' ? t('正在拾取阴影…','Reading shadow…') : pending.action==='clear' ? t('正在清除阴影…','Clearing shadows…') : t('正在应用…','Applying…');
      return;
    }
    status.textContent = !selection.length ? t('选择图层即可应用阴影。选中一个图层可拾取。','Select layers to apply. Pick from a single layer.') :
      !supported ? t('所选图层不支持阴影。','The selected layers do not support shadows.') :
        t('已选 '+selection.length+' 个图层。应用会替换同类型阴影。',selection.length+' selected. Applying replaces the same shadow type.');
  }

  function update() {
    curveDrawing();
    refreshPalette();
    updatePresetControls();
    reverse.disabled=locks.has('Angle')||!number('Angle').value||!number('Angle').validity.valid;
    if (numeric.some(({key}) => !number(key).value || !number(key).validity.valid)) {
      sample = [];
      updateStatus();
      return;
    }
    const values = Object.fromEntries(numeric.map(({key}) => [key,Number(number(key).value)]));
    sample = picked ? samplesFromPicked(values) : makeSamples(values);
    $('.media-shadow-preview div').style.boxShadow = cssShadow(sample,kind);
    updateStatus();
  }
  function refreshEditing() {
    refreshLocks();
    buildStops();
    update();
  }
  function setPoint(index,x,y) {
    if (locks.has('Curve')) return;
    curve[index*2] = clamp(x,index===0?0:curve[0],index===0?curve[2]:1);
    curve[index*2+1] = clamp(y,0,1);
    markCustom();
    update();
  }
  function graphPoint(event) {
    const matrix = graph.getScreenCTM();
    if (!matrix) return null;
    const {x,y} = new DOMPoint(event.clientX,event.clientY).matrixTransform(matrix.inverse());
    return [(x-10)/200,(90-y)/80];
  }
  graph.addEventListener('pointerdown',event => {
    if (locks.has('Curve') || event.button!==0) return;
    const point = graphPoint(event);
    if (!point) return;
    const [x,y] = point;
    const distance = index=>Math.hypot((curve[index*2]-x)*200,(curve[index*2+1]-y)*80);
    const index = event.target.hasAttribute('data-point') ? Number(event.target.dataset.point) : distance(0)<distance(1)?0:1;
    drag = {pointer:event.pointerId,index};
    graph.setPointerCapture(event.pointerId);
    setPoint(index,x,y);
    event.preventDefault();
  });
  graph.addEventListener('pointermove',event => {
    if (!drag || drag.pointer!==event.pointerId) return;
    const point = graphPoint(event);
    if (point) setPoint(drag.index,...point);
  });
  graph.addEventListener('lostpointercapture',() => { drag=null; });
  graph.addEventListener('keydown',event => {
    if (locks.has('Curve') || !event.target.hasAttribute('data-point')) return;
    const directions = {ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,1],ArrowDown:[0,-1]};
    if (!directions[event.key]) return;
    const i = Number(event.target.dataset.point), step = event.shiftKey?.1:.02;
    const [dx,dy] = directions[event.key];
    setPoint(i,curve[i*2]+dx*step,curve[i*2+1]+dy*step);
    event.preventDefault();
  });
  $('.media-add-stop').onclick = () => {
    if (locks.has('Gradient') || stops.length>=counts) return;
    const ordered = stops.slice().sort((a,b)=>a[0]-b[0]);
    let gap = -1, at = 50;
    for (let i=1;i<ordered.length;i++) {
      const current = ordered[i][0]-ordered[i-1][0];
      if (current>gap) { gap=current; at=round((ordered[i-1][0]+ordered[i][0])/2); }
    }
    const color = colorAt(at);
    stops = [...ordered,[at,toHex(color),round(color.a*100)]].sort((a,b)=>a[0]-b[0]);
    palette = 'custom';
    markCustom();
    buildStops();
    update();
  };

  function send(action,data) {
    const requestId = 'shadow-'+(++serial);
    report = null;
    const timer = setTimeout(() => {
      if (pending?.requestId!==requestId) return;
      pending = null;
      report = {action,error:t('编辑器响应超时，请重试。','The editor timed out. Try again.')};
      updateStatus();
    },12000);
    pending = {requestId,action,timer};
    updateStatus();
    postMsg('media-shadow-'+(action==='pick'?'read':action),{requestId,...data});
  }
  reverse.onclick = () => {
    if(reverse.disabled)return;
    if(picked)reflected=!reflected;
    setNumber('Angle',-Number(number('Angle').value));
    markCustom();update();
  };
  pick.onclick = () => {
    if (pick.disabled) return;
    send('pick',{nodeId:selection[0].id,kind});
  };
  apply.onclick = () => {
    if (apply.disabled) return;
    send('apply',{nodeIds:selection.map(item=>item.id),kind,shadows:sample});
  };
  clear.onclick = () => {
    if (clear.disabled) return;
    send('clear',{nodeIds:selection.map(item=>item.id)});
  };
  for (const button of lockControls) {
    button.onclick = () => {
      const key = button.dataset.lock;
      if (locks.has(key)) locks.delete(key);
      else locks.add(key);
      refreshEditing();
    };
  }
  for (const button of typeControls) {
    button.onclick = () => {
      kind = button.dataset.kind;
      markCustom();
      refreshLocks();
      update();
    };
  }
  for (const {key} of numeric) {
    number(key).oninput = () => { syncRange(key); markCustom(); update(); };
    slider(key).oninput = () => { number(key).value = slider(key).value; markCustom(); update(); };
  }
  function refresh() {
    panel.querySelectorAll('[data-zh]').forEach(element => { element.textContent=t(element.dataset.zh,element.dataset.en); });
    for(const [key,{label}] of presetCards)label.textContent=t(presets[key].zh,presets[key].en);
    $('.media-shadow-tabs').setAttribute('aria-label',t('阴影制作方式','Shadow editor mode'));
    $('.media-preset-categories').setAttribute('aria-label',t('预设类别','Preset category'));
    reverse.title=t('沿水平轴反向，保留横向偏移','Flip across the horizontal axis, keeping the X offset');
    reverse.setAttribute('aria-label',reverse.title);
    graph.setAttribute('aria-label',t('距离与深度曲线','Distance and depth curve'));
    for (const {key,zh,en} of numeric) slider(key).setAttribute('aria-label',t(zh+'滑块',en+' slider'));
    refreshEditing();
  }
  window.addEventListener('message',event => {
    const message = event.data?.pluginMessage;
    if (message?.type==='media-selection') {
      const next = message.items || [];
      if (selection.map(item=>item.id).join('|')!==next.map(item=>item.id).join('|')) {
        report = null;
        if (pending?.action==='pick') {
          clearTimeout(pending.timer);
          pending = null;
        }
      }
      selection = next;
      updateStatus();
      return;
    }
    if (!pending || !['media-shadow-read-result','media-shadow-result','media-shadow-clear-result'].includes(message?.type) || message.requestId!==pending.requestId) return;
    const {action,timer} = pending;
    clearTimeout(timer);
    pending = null;
    if (action==='pick' && !message.error && Array.isArray(message.shadows) && message.shadows.length) {
      const native = message.shadows.slice(0,counts);
      picked = describeNative(native);
      reflected=false;
      basePreset=matchSplitPreset(native,message.kind);
      if (basePreset) {
        const config=presets[basePreset];
        Object.assign(picked,{split:true,values:presetValues(config),curve:[...config.curve],stops:copyStops(presetStops(config))});
      }
      split=picked.split;
      const category=categoryTabs.find(tab=>tab.dataset.presetCategory===(split?'GLITCH':message.kind));
      if (category) selectTab(category,categoryTabs);
      if (!locks.has('Kind')) kind = message.kind;
      for (const {key} of numeric) if (!locks.has(key)) setNumber(key,picked.values[key]);
      if (!locks.has('Curve')) curve = [...picked.curve];
      if (!locks.has('Gradient')) { stops=copyStops(picked.stops); palette='custom'; }
      markCustom();
      if (basePreset && !locks.size) chosen=basePreset;
      report = {action,name:message.name,length:native.length,kind:message.kind};
      refreshEditing();
    } else {
      report = {...message,action};
      updateStatus();
    }
  });

  window.ShadowWorkspace = {refresh,inspect:()=>postMsg('media-inspect')};
  addPaletteCards();
  addPresetCards();
  selectTab(tabs[0],tabs);
  selectTab(categoryTabs[0],categoryTabs);
  setPreset('ambient');
  refresh();
})();
