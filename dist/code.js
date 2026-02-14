"use strict";
(() => {
  // code.ts
  var convertNameAdvanced = (str, format, sepMode, casing, keepEmoji, removeId, unmarkHidden) => {
    let s = str;
    if (removeId)
      s = s.replace(/#\d+:\d+$/, "").trim();
    let hiddenPrefix = "";
    const hiddenMatch = s.match(/^[\._]/);
    if (hiddenMatch) {
      hiddenPrefix = hiddenMatch[0];
      s = s.substring(1);
    }
    let emojiPrefix = "";
    if (keepEmoji) {
      const match = s.match(new RegExp("^(\\p{Emoji_Presentation}|\\p{Extended_Pictographic}|[\\u2000-\\u3300]|[\\uF000-\\uF0FF])+\\s*", "u"));
      if (match) {
        emojiPrefix = match[0].trim();
        s = s.replace(match[0], "");
      }
    }
    s = s.trim();
    const words = s.match(/[A-Z]?[a-z]+|[0-9]+|[A-Z]+|[\u4e00-\u9fa5]+/g);
    let newVal = s;
    if (words && words.length > 0) {
      let processedWords = words;
      if (format === "camelCase") {
        processedWords = words.map((w, i) => i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
        newVal = processedWords.join("");
      } else if (format === "PascalCase") {
        processedWords = words.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
        newVal = processedWords.join("");
      } else {
        if (casing === "upper")
          processedWords = words.map((w) => w.toUpperCase());
        else if (casing === "lower")
          processedWords = words.map((w) => w.toLowerCase());
        let separatorChar = " ";
        if (sepMode === "snake")
          separatorChar = "_";
        if (sepMode === "kebab")
          separatorChar = "-";
        newVal = processedWords.join(separatorChar);
      }
    }
    if (keepEmoji && emojiPrefix) {
      const joiner = format === "separator" && sepMode !== "space" ? sepMode === "snake" ? "_" : "-" : " ";
      newVal = emojiPrefix + joiner + newVal;
    }
    if (!unmarkHidden && hiddenPrefix) {
      newVal = hiddenPrefix + newVal;
    }
    return { changed: newVal !== str, val: newVal };
  };
  figma.showUI("<!DOCTYPE html>\n<html>\n<head>\n  <meta charset=\"UTF-8\">\n  <style>/* =========================================\n  1. 设计系统变量 (Design System Variables)\n  现代极简风格 - 支持明暗模式\n  ========================================= */\n:root {\n  --primary: #6366F1;\n  --primary-hover: #818CF8;\n  --primary-active: #4F46E5;\n  --primary-light: rgba(99, 102, 241, 0.1);\n  --primary-lighter: rgba(99, 102, 241, 0.05);\n  \n  --success: #10B981;\n  --success-light: rgba(16, 185, 129, 0.1);\n  --warning: #F59E0B;\n  --warning-light: rgba(245, 158, 11, 0.1);\n  --danger: #EF4444;\n  --danger-light: rgba(239, 68, 68, 0.1);\n  --info: #3B82F6;\n  --info-light: rgba(59, 130, 246, 0.1);\n  \n  --bg-body: #F8FAFC;\n  --bg-white: #FFFFFF;\n  --bg-elevated: #FFFFFF;\n  --bg-muted: #F1F5F9;\n  --bg-hover: #F1F5F9;\n  --bg-active: #E2E8F0;\n  \n  --text-primary: #1E293B;\n  --text-secondary: #64748B;\n  --text-tertiary: #94A3B8;\n  --text-disabled: #CBD5E1;\n  --text-inverse: #FFFFFF;\n  \n  --border: #E2E8F0;\n  --border-light: #F1F5F9;\n  --border-focus: var(--primary);\n  \n  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);\n  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);\n  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.03);\n  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02);\n  \n  --sidebar-w: 140px;\n  --sidebar-w-mini: 56px;\n  --radius-sm: 6px;\n  --radius-md: 8px;\n  --radius-lg: 12px;\n  --radius-xl: 16px;\n  --radius-full: 9999px;\n  \n  --transition-fast: 0.15s ease;\n  --transition-normal: 0.2s ease;\n  --transition-slow: 0.3s ease;\n  \n  --card-orange-bg: #FFF7ED;\n  --card-orange-text: #C2410C;\n  --card-orange-border: rgba(194, 65, 12, 0.1);\n  --card-blue-bg: #EFF6FF;\n  --card-blue-text: #1D4ED8;\n  --card-blue-border: rgba(29, 78, 216, 0.1);\n  --card-purple-bg: #F5F3FF;\n  --card-purple-text: #6D28D9;\n  --card-purple-border: rgba(109, 40, 217, 0.1);\n  --card-green-bg: #ECFDF5;\n  --card-green-text: #047857;\n  --card-green-border: rgba(4, 120, 87, 0.1);\n  --card-pink-bg: #FDF2F8;\n  --card-pink-text: #BE185D;\n  --card-pink-border: rgba(190, 24, 93, 0.1);\n}\n\n[data-theme=\"dark\"] {\n  --bg-body: #0F172A;\n  --bg-white: #1E293B;\n  --bg-elevated: #334155;\n  --bg-muted: #1E293B;\n  --bg-hover: #334155;\n  --bg-active: #475569;\n  \n  --text-primary: #F1F5F9;\n  --text-secondary: #94A3B8;\n  --text-tertiary: #64748B;\n  --text-disabled: #475569;\n  --text-inverse: #0F172A;\n  \n  --border: #334155;\n  --border-light: #1E293B;\n  \n  --card-orange-bg: rgba(194, 65, 12, 0.15);\n  --card-orange-text: #FDBA74;\n  --card-orange-border: rgba(194, 65, 12, 0.2);\n  --card-blue-bg: rgba(29, 78, 216, 0.15);\n  --card-blue-text: #93C5FD;\n  --card-blue-border: rgba(29, 78, 216, 0.2);\n  --card-purple-bg: rgba(109, 40, 217, 0.15);\n  --card-purple-text: #C4B5FD;\n  --card-purple-border: rgba(109, 40, 217, 0.2);\n  --card-green-bg: rgba(4, 120, 87, 0.15);\n  --card-green-text: #6EE7B7;\n  --card-green-border: rgba(4, 120, 87, 0.2);\n  --card-pink-bg: rgba(190, 24, 93, 0.15);\n  --card-pink-text: #F9A8D4;\n  --card-pink-border: rgba(190, 24, 93, 0.2);\n}\n\n* {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n}\n\nhtml, body {\n  width: 100%;\n  height: 100%;\n  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;\n  font-size: 13px;\n  color: var(--text-primary);\n  background: var(--bg-body);\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n\n#root {\n  width: 100%;\n  height: 100%;\n}\n\nbutton {\n  font-family: inherit;\n}\n\ninput {\n  font-family: inherit;\n}\n\nselect {\n  font-family: inherit;\n}\n\n::-webkit-scrollbar {\n  width: 6px;\n  height: 6px;\n}\n\n::-webkit-scrollbar-track {\n  background: var(--bg-muted);\n  border-radius: 3px;\n}\n\n::-webkit-scrollbar-thumb {\n  background: var(--text-tertiary);\n  border-radius: 3px;\n}\n\n::-webkit-scrollbar-thumb:hover {\n  background: var(--text-secondary);\n}\n</style>\n</head>\n<body>\n  <div id=\"root\"></div>\n  <script>(function(){\"use strict\";var se=document.createElement(\"style\");se.textContent=`._card_1dmxw_1{background:var(--bg-white);border:1px solid var(--border);border-radius:var(--radius-lg);padding:16px;transition:all var(--transition-fast)}._clickable_1dmxw_9{cursor:pointer}._clickable_1dmxw_9:hover{border-color:var(--primary);box-shadow:var(--shadow-md)}._clickable_1dmxw_9:active{transform:scale(.98)}._icon_1dmxw_22{font-size:24px;margin-bottom:8px;display:block}._title_1dmxw_28{font-size:14px;font-weight:600;color:var(--text-primary);margin:0 0 4px}._subtitle_1dmxw_35{font-size:12px;color:var(--text-secondary);margin:0}._orange_1dmxw_41{background:var(--card-orange-bg);border-color:var(--card-orange-border)}._orange_1dmxw_41 ._title_1dmxw_28{color:var(--card-orange-text)}._blue_1dmxw_50{background:var(--card-blue-bg);border-color:var(--card-blue-border)}._blue_1dmxw_50 ._title_1dmxw_28{color:var(--card-blue-text)}._purple_1dmxw_59{background:var(--card-purple-bg);border-color:var(--card-purple-border)}._purple_1dmxw_59 ._title_1dmxw_28{color:var(--card-purple-text)}._green_1dmxw_68{background:var(--card-green-bg);border-color:var(--card-green-border)}._green_1dmxw_68 ._title_1dmxw_28{color:var(--card-green-text)}._pink_1dmxw_77{background:var(--card-pink-bg);border-color:var(--card-pink-border)}._pink_1dmxw_77 ._title_1dmxw_28{color:var(--card-pink-text)}._panel_1vcsp_1{display:flex;flex-direction:column;height:100%;background:var(--bg-white);padding:16px}._header_1vcsp_9{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px}._title_1vcsp_16{font-size:16px;font-weight:600;color:var(--text-primary);margin:0}._count_1vcsp_23{font-size:12px;color:var(--text-secondary);background:var(--bg-muted);padding:4px 8px;border-radius:var(--radius-sm)}._grid_1vcsp_31{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}._app_8w68u_1{display:flex;width:100%;height:100%;background:var(--bg-body)}._sidebar_8w68u_8{width:var(--sidebar-w);background:var(--bg-white);border-right:1px solid var(--border);display:flex;flex-direction:column;flex-shrink:0}._nav_8w68u_17{flex:1;padding:8px;display:flex;flex-direction:column;gap:4px}._navItem_8w68u_25{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:12px 8px;border-radius:var(--radius-md);cursor:pointer;transition:all var(--transition-fast);background:transparent;border:none;color:var(--text-secondary)}._navItem_8w68u_25:hover{background:var(--bg-hover);color:var(--text-primary)}._navItem_8w68u_25._active_8w68u_44{background:var(--primary-light);color:var(--primary)}._navIcon_8w68u_49{font-size:20px;margin-bottom:4px}._navLabel_8w68u_54{font-size:11px;font-weight:500;text-align:center}._settings_8w68u_60{padding:8px;border-top:1px solid var(--border);display:flex;gap:8px}._settingBtn_8w68u_67{flex:1;padding:8px;border-radius:var(--radius-md);background:var(--bg-muted);border:none;cursor:pointer;font-size:12px;color:var(--text-secondary);transition:all var(--transition-fast)}._settingBtn_8w68u_67:hover{background:var(--bg-hover);color:var(--text-primary)}._content_8w68u_84{flex:1;overflow:hidden}._placeholder_8w68u_89{display:flex;align-items:center;justify-content:center;height:100%;color:var(--text-tertiary);font-size:14px}:root{--primary: #6366F1;--primary-hover: #818CF8;--primary-active: #4F46E5;--primary-light: rgba(99, 102, 241, .1);--primary-lighter: rgba(99, 102, 241, .05);--success: #10B981;--success-light: rgba(16, 185, 129, .1);--warning: #F59E0B;--warning-light: rgba(245, 158, 11, .1);--danger: #EF4444;--danger-light: rgba(239, 68, 68, .1);--info: #3B82F6;--info-light: rgba(59, 130, 246, .1);--bg-body: #F8FAFC;--bg-white: #FFFFFF;--bg-elevated: #FFFFFF;--bg-muted: #F1F5F9;--bg-hover: #F1F5F9;--bg-active: #E2E8F0;--text-primary: #1E293B;--text-secondary: #64748B;--text-tertiary: #94A3B8;--text-disabled: #CBD5E1;--text-inverse: #FFFFFF;--border: #E2E8F0;--border-light: #F1F5F9;--border-focus: var(--primary);--shadow-sm: 0 1px 2px rgba(0, 0, 0, .05);--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, .05), 0 2px 4px -1px rgba(0, 0, 0, .03);--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, .05), 0 4px 6px -2px rgba(0, 0, 0, .03);--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, .05), 0 10px 10px -5px rgba(0, 0, 0, .02);--sidebar-w: 140px;--sidebar-w-mini: 56px;--radius-sm: 6px;--radius-md: 8px;--radius-lg: 12px;--radius-xl: 16px;--radius-full: 9999px;--transition-fast: .15s ease;--transition-normal: .2s ease;--transition-slow: .3s ease;--card-orange-bg: #FFF7ED;--card-orange-text: #C2410C;--card-orange-border: rgba(194, 65, 12, .1);--card-blue-bg: #EFF6FF;--card-blue-text: #1D4ED8;--card-blue-border: rgba(29, 78, 216, .1);--card-purple-bg: #F5F3FF;--card-purple-text: #6D28D9;--card-purple-border: rgba(109, 40, 217, .1);--card-green-bg: #ECFDF5;--card-green-text: #047857;--card-green-border: rgba(4, 120, 87, .1);--card-pink-bg: #FDF2F8;--card-pink-text: #BE185D;--card-pink-border: rgba(190, 24, 93, .1)}[data-theme=dark]{--bg-body: #0F172A;--bg-white: #1E293B;--bg-elevated: #334155;--bg-muted: #1E293B;--bg-hover: #334155;--bg-active: #475569;--text-primary: #F1F5F9;--text-secondary: #94A3B8;--text-tertiary: #64748B;--text-disabled: #475569;--text-inverse: #0F172A;--border: #334155;--border-light: #1E293B;--card-orange-bg: rgba(194, 65, 12, .15);--card-orange-text: #FDBA74;--card-orange-border: rgba(194, 65, 12, .2);--card-blue-bg: rgba(29, 78, 216, .15);--card-blue-text: #93C5FD;--card-blue-border: rgba(29, 78, 216, .2);--card-purple-bg: rgba(109, 40, 217, .15);--card-purple-text: #C4B5FD;--card-purple-border: rgba(109, 40, 217, .2);--card-green-bg: rgba(4, 120, 87, .15);--card-green-text: #6EE7B7;--card-green-border: rgba(4, 120, 87, .2);--card-pink-bg: rgba(190, 24, 93, .15);--card-pink-text: #F9A8D4;--card-pink-border: rgba(190, 24, 93, .2)}*{margin:0;padding:0;box-sizing:border-box}html,body{width:100%;height:100%;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,PingFang SC,Hiragino Sans GB,Microsoft YaHei,sans-serif;font-size:13px;color:var(--text-primary);background:var(--bg-body);-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}#root{width:100%;height:100%}button,input,select{font-family:inherit}::-webkit-scrollbar{width:6px;height:6px}::-webkit-scrollbar-track{background:var(--bg-muted);border-radius:3px}::-webkit-scrollbar-thumb{background:var(--text-tertiary);border-radius:3px}::-webkit-scrollbar-thumb:hover{background:var(--text-secondary)}\n/*$vite$:1*/`,document.head.appendChild(se);var z,f,ce,C,de,pe,ue,fe,Z,Q,ee,I={},ge=[],Re=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i,R=Array.isArray;function S(e,t){for(var _ in t)e[_]=t[_];return e}function te(e){e&&e.parentNode&&e.parentNode.removeChild(e)}function Me(e,t,_){var n,a,r,l={};for(r in t)r==\"key\"?n=t[r]:r==\"ref\"?a=t[r]:l[r]=t[r];if(arguments.length>2&&(l.children=arguments.length>3?z.call(arguments,2):_),typeof e==\"function\"&&e.defaultProps!=null)for(r in e.defaultProps)l[r]===void 0&&(l[r]=e.defaultProps[r]);return M(e,l,n,a,null)}function M(e,t,_,n,a){var r={type:e,props:t,key:_,ref:n,__k:null,__:null,__b:0,__e:null,__c:null,constructor:void 0,__v:a??++ce,__i:-1,__u:0};return a==null&&f.vnode!=null&&f.vnode(r),r}function U(e){return e.children}function W(e,t){this.props=e,this.context=t}function A(e,t){if(t==null)return e.__?A(e.__,e.__i+1):null;for(var _;t<e.__k.length;t++)if((_=e.__k[t])!=null&&_.__e!=null)return _.__e;return typeof e.type==\"function\"?A(e):null}function he(e){var t,_;if((e=e.__)!=null&&e.__c!=null){for(e.__e=e.__c.base=null,t=0;t<e.__k.length;t++)if((_=e.__k[t])!=null&&_.__e!=null){e.__e=e.__c.base=_.__e;break}return he(e)}}function be(e){(!e.__d&&(e.__d=!0)&&C.push(e)&&!j.__r++||de!=f.debounceRendering)&&((de=f.debounceRendering)||pe)(j)}function j(){for(var e,t,_,n,a,r,l,s=1;C.length;)C.length>s&&C.sort(ue),e=C.shift(),s=C.length,e.__d&&(_=void 0,n=void 0,a=(n=(t=e).__v).__e,r=[],l=[],t.__P&&((_=S({},n)).__v=n.__v+1,f.vnode&&f.vnode(_),_e(t.__P,_,n,t.__n,t.__P.namespaceURI,32&n.__u?[a]:null,r,a??A(n),!!(32&n.__u),l),_.__v=n.__v,_.__.__k[_.__i]=_,ke(r,_,l),n.__e=n.__=null,_.__e!=a&&he(_)));j.__r=0}function me(e,t,_,n,a,r,l,s,c,i,p){var o,u,d,y,w,x,b,h=n&&n.__k||ge,E=t.length;for(c=Ue(_,t,h,c,E),o=0;o<E;o++)(d=_.__k[o])!=null&&(u=d.__i==-1?I:h[d.__i]||I,d.__i=o,x=_e(e,d,u,a,r,l,s,c,i,p),y=d.__e,d.ref&&u.ref!=d.ref&&(u.ref&&ne(u.ref,null,d),p.push(d.ref,d.__c||y,d)),w==null&&y!=null&&(w=y),(b=!!(4&d.__u))||u.__k===d.__k?c=ve(d,c,e,b):typeof d.type==\"function\"&&x!==void 0?c=x:y&&(c=y.nextSibling),d.__u&=-7);return _.__e=w,c}function Ue(e,t,_,n,a){var r,l,s,c,i,p=_.length,o=p,u=0;for(e.__k=new Array(a),r=0;r<a;r++)(l=t[r])!=null&&typeof l!=\"boolean\"&&typeof l!=\"function\"?(typeof l==\"string\"||typeof l==\"number\"||typeof l==\"bigint\"||l.constructor==String?l=e.__k[r]=M(null,l,null,null,null):R(l)?l=e.__k[r]=M(U,{children:l},null,null,null):l.constructor===void 0&&l.__b>0?l=e.__k[r]=M(l.type,l.props,l.key,l.ref?l.ref:null,l.__v):e.__k[r]=l,c=r+u,l.__=e,l.__b=e.__b+1,s=null,(i=l.__i=We(l,_,c,o))!=-1&&(o--,(s=_[i])&&(s.__u|=2)),s==null||s.__v==null?(i==-1&&(a>p?u--:a<p&&u++),typeof l.type!=\"function\"&&(l.__u|=4)):i!=c&&(i==c-1?u--:i==c+1?u++:(i>c?u--:u++,l.__u|=4))):e.__k[r]=null;if(o)for(r=0;r<p;r++)(s=_[r])!=null&&!(2&s.__u)&&(s.__e==n&&(n=A(s)),Fe(s,s));return n}function ve(e,t,_,n){var a,r;if(typeof e.type==\"function\"){for(a=e.__k,r=0;a&&r<a.length;r++)a[r]&&(a[r].__=e,t=ve(a[r],t,_,n));return t}e.__e!=t&&(n&&(t&&e.type&&!t.parentNode&&(t=A(e)),_.insertBefore(e.__e,t||null)),t=e.__e);do t=t&&t.nextSibling;while(t!=null&&t.nodeType==8);return t}function We(e,t,_,n){var a,r,l,s=e.key,c=e.type,i=t[_],p=i!=null&&(2&i.__u)==0;if(i===null&&s==null||p&&s==i.key&&c==i.type)return _;if(n>(p?1:0)){for(a=_-1,r=_+1;a>=0||r<t.length;)if((i=t[l=a>=0?a--:r++])!=null&&!(2&i.__u)&&s==i.key&&c==i.type)return l}return-1}function ye(e,t,_){t[0]==\"-\"?e.setProperty(t,_??\"\"):e[t]=_==null?\"\":typeof _!=\"number\"||Re.test(t)?_:_+\"px\"}function K(e,t,_,n,a){var r,l;e:if(t==\"style\")if(typeof _==\"string\")e.style.cssText=_;else{if(typeof n==\"string\"&&(e.style.cssText=n=\"\"),n)for(t in n)_&&t in _||ye(e.style,t,\"\");if(_)for(t in _)n&&_[t]==n[t]||ye(e.style,t,_[t])}else if(t[0]==\"o\"&&t[1]==\"n\")r=t!=(t=t.replace(fe,\"$1\")),l=t.toLowerCase(),t=l in e||t==\"onFocusOut\"||t==\"onFocusIn\"?l.slice(2):t.slice(2),e.l||(e.l={}),e.l[t+r]=_,_?n?_.u=n.u:(_.u=Z,e.addEventListener(t,r?ee:Q,r)):e.removeEventListener(t,r?ee:Q,r);else{if(a==\"http://www.w3.org/2000/svg\")t=t.replace(/xlink(H|:h)/,\"h\").replace(/sName$/,\"s\");else if(t!=\"width\"&&t!=\"height\"&&t!=\"href\"&&t!=\"list\"&&t!=\"form\"&&t!=\"tabIndex\"&&t!=\"download\"&&t!=\"rowSpan\"&&t!=\"colSpan\"&&t!=\"role\"&&t!=\"popover\"&&t in e)try{e[t]=_??\"\";break e}catch{}typeof _==\"function\"||(_==null||_===!1&&t[4]!=\"-\"?e.removeAttribute(t):e.setAttribute(t,t==\"popover\"&&_==1?\"\":_))}}function xe(e){return function(t){if(this.l){var _=this.l[t.type+e];if(t.t==null)t.t=Z++;else if(t.t<_.u)return;return _(f.event?f.event(t):t)}}}function _e(e,t,_,n,a,r,l,s,c,i){var p,o,u,d,y,w,x,b,h,E,P,Y,L,ze,X,N,ie,F=t.type;if(t.constructor!==void 0)return null;128&_.__u&&(c=!!(32&_.__u),r=[s=t.__e=_.__e]),(p=f.__b)&&p(t);e:if(typeof F==\"function\")try{if(b=t.props,h=\"prototype\"in F&&F.prototype.render,E=(p=F.contextType)&&n[p.__c],P=p?E?E.props.value:p.__:n,_.__c?x=(o=t.__c=_.__c).__=o.__E:(h?t.__c=o=new F(b,P):(t.__c=o=new W(b,P),o.constructor=F,o.render=Ke),E&&E.sub(o),o.state||(o.state={}),o.__n=n,u=o.__d=!0,o.__h=[],o._sb=[]),h&&o.__s==null&&(o.__s=o.state),h&&F.getDerivedStateFromProps!=null&&(o.__s==o.state&&(o.__s=S({},o.__s)),S(o.__s,F.getDerivedStateFromProps(b,o.__s))),d=o.props,y=o.state,o.__v=t,u)h&&F.getDerivedStateFromProps==null&&o.componentWillMount!=null&&o.componentWillMount(),h&&o.componentDidMount!=null&&o.__h.push(o.componentDidMount);else{if(h&&F.getDerivedStateFromProps==null&&b!==d&&o.componentWillReceiveProps!=null&&o.componentWillReceiveProps(b,P),t.__v==_.__v||!o.__e&&o.shouldComponentUpdate!=null&&o.shouldComponentUpdate(b,o.__s,P)===!1){for(t.__v!=_.__v&&(o.props=b,o.state=o.__s,o.__d=!1),t.__e=_.__e,t.__k=_.__k,t.__k.some(function(D){D&&(D.__=t)}),Y=0;Y<o._sb.length;Y++)o.__h.push(o._sb[Y]);o._sb=[],o.__h.length&&l.push(o);break e}o.componentWillUpdate!=null&&o.componentWillUpdate(b,o.__s,P),h&&o.componentDidUpdate!=null&&o.__h.push(function(){o.componentDidUpdate(d,y,w)})}if(o.context=P,o.props=b,o.__P=e,o.__e=!1,L=f.__r,ze=0,h){for(o.state=o.__s,o.__d=!1,L&&L(t),p=o.render(o.props,o.state,o.context),X=0;X<o._sb.length;X++)o.__h.push(o._sb[X]);o._sb=[]}else do o.__d=!1,L&&L(t),p=o.render(o.props,o.state,o.context),o.state=o.__s;while(o.__d&&++ze<25);o.state=o.__s,o.getChildContext!=null&&(n=S(S({},n),o.getChildContext())),h&&!u&&o.getSnapshotBeforeUpdate!=null&&(w=o.getSnapshotBeforeUpdate(d,y)),N=p,p!=null&&p.type===U&&p.key==null&&(N=we(p.props.children)),s=me(e,R(N)?N:[N],t,_,n,a,r,l,s,c,i),o.base=t.__e,t.__u&=-161,o.__h.length&&l.push(o),x&&(o.__E=o.__=null)}catch(D){if(t.__v=null,c||r!=null)if(D.then){for(t.__u|=c?160:128;s&&s.nodeType==8&&s.nextSibling;)s=s.nextSibling;r[r.indexOf(s)]=null,t.__e=s}else{for(ie=r.length;ie--;)te(r[ie]);re(t)}else t.__e=_.__e,t.__k=_.__k,D.then||re(t);f.__e(D,t,_)}else r==null&&t.__v==_.__v?(t.__k=_.__k,t.__e=_.__e):s=t.__e=je(_.__e,t,_,n,a,r,l,c,i);return(p=f.diffed)&&p(t),128&t.__u?void 0:s}function re(e){e&&e.__c&&(e.__c.__e=!0),e&&e.__k&&e.__k.forEach(re)}function ke(e,t,_){for(var n=0;n<_.length;n++)ne(_[n],_[++n],_[++n]);f.__c&&f.__c(t,e),e.some(function(a){try{e=a.__h,a.__h=[],e.some(function(r){r.call(a)})}catch(r){f.__e(r,a.__v)}})}function we(e){return typeof e!=\"object\"||e==null||e.__b&&e.__b>0?e:R(e)?e.map(we):S({},e)}function je(e,t,_,n,a,r,l,s,c){var i,p,o,u,d,y,w,x=_.props||I,b=t.props,h=t.type;if(h==\"svg\"?a=\"http://www.w3.org/2000/svg\":h==\"math\"?a=\"http://www.w3.org/1998/Math/MathML\":a||(a=\"http://www.w3.org/1999/xhtml\"),r!=null){for(i=0;i<r.length;i++)if((d=r[i])&&\"setAttribute\"in d==!!h&&(h?d.localName==h:d.nodeType==3)){e=d,r[i]=null;break}}if(e==null){if(h==null)return document.createTextNode(b);e=document.createElementNS(a,h,b.is&&b),s&&(f.__m&&f.__m(t,r),s=!1),r=null}if(h==null)x===b||s&&e.data==b||(e.data=b);else{if(r=r&&z.call(e.childNodes),!s&&r!=null)for(x={},i=0;i<e.attributes.length;i++)x[(d=e.attributes[i]).name]=d.value;for(i in x)if(d=x[i],i!=\"children\"){if(i==\"dangerouslySetInnerHTML\")o=d;else if(!(i in b)){if(i==\"value\"&&\"defaultValue\"in b||i==\"checked\"&&\"defaultChecked\"in b)continue;K(e,i,null,d,a)}}for(i in b)d=b[i],i==\"children\"?u=d:i==\"dangerouslySetInnerHTML\"?p=d:i==\"value\"?y=d:i==\"checked\"?w=d:s&&typeof d!=\"function\"||x[i]===d||K(e,i,d,x[i],a);if(p)s||o&&(p.__html==o.__html||p.__html==e.innerHTML)||(e.innerHTML=p.__html),t.__k=[];else if(o&&(e.innerHTML=\"\"),me(t.type==\"template\"?e.content:e,R(u)?u:[u],t,_,n,h==\"foreignObject\"?\"http://www.w3.org/1999/xhtml\":a,r,l,r?r[0]:_.__k&&A(_,0),s,c),r!=null)for(i=r.length;i--;)te(r[i]);s||(i=\"value\",h==\"progress\"&&y==null?e.removeAttribute(\"value\"):y!=null&&(y!==e[i]||h==\"progress\"&&!y||h==\"option\"&&y!=x[i])&&K(e,i,y,x[i],a),i=\"checked\",w!=null&&w!=e[i]&&K(e,i,w,x[i],a))}return e}function ne(e,t,_){try{if(typeof e==\"function\"){var n=typeof e.__u==\"function\";n&&e.__u(),n&&t==null||(e.__u=e(t))}else e.current=t}catch(a){f.__e(a,_)}}function Fe(e,t,_){var n,a;if(f.unmount&&f.unmount(e),(n=e.ref)&&(n.current&&n.current!=e.__e||ne(n,null,t)),(n=e.__c)!=null){if(n.componentWillUnmount)try{n.componentWillUnmount()}catch(r){f.__e(r,t)}n.base=n.__P=null}if(n=e.__k)for(a=0;a<n.length;a++)n[a]&&Fe(n[a],t,_||typeof e.type!=\"function\");_||te(e.__e),e.__c=e.__=e.__e=void 0}function Ke(e,t,_){return this.constructor(e,_)}function Oe(e,t,_){var n,a,r,l;t==document&&(t=document.documentElement),f.__&&f.__(e,t),a=(n=!1)?null:t.__k,r=[],l=[],_e(t,e=t.__k=Me(U,null,[e]),a||I,I,t.namespaceURI,a?null:t.firstChild?z.call(t.childNodes):null,r,a?a.__e:t.firstChild,n,l),ke(r,e,l)}z=ge.slice,f={__e:function(e,t,_,n){for(var a,r,l;t=t.__;)if((a=t.__c)&&!a.__)try{if((r=a.constructor)&&r.getDerivedStateFromError!=null&&(a.setState(r.getDerivedStateFromError(e)),l=a.__d),a.componentDidCatch!=null&&(a.componentDidCatch(e,n||{}),l=a.__d),l)return a.__E=a}catch(s){e=s}throw e}},ce=0,W.prototype.setState=function(e,t){var _;_=this.__s!=null&&this.__s!=this.state?this.__s:this.__s=S({},this.state),typeof e==\"function\"&&(e=e(S({},_),this.props)),e&&S(_,e),e!=null&&this.__v&&(t&&this._sb.push(t),be(this))},W.prototype.forceUpdate=function(e){this.__v&&(this.__e=!0,e&&this.__h.push(e),be(this))},W.prototype.render=U,C=[],pe=typeof Promise==\"function\"?Promise.prototype.then.bind(Promise.resolve()):setTimeout,ue=function(e,t){return e.__v.__b-t.__v.__b},j.__r=0,fe=/(PointerCapture)$|Capture$/i,Z=0,Q=xe(!1),ee=xe(!0);var qe=0;function g(e,t,_,n,a,r){t||(t={});var l,s,c=t;if(\"ref\"in c)for(s in c={},t)s==\"ref\"?l=t[s]:c[s]=t[s];var i={type:e,props:c,key:_,ref:l,__k:null,__:null,__b:0,__e:null,__c:null,constructor:void 0,__v:--qe,__i:-1,__u:0,__source:a,__self:r};if(typeof e==\"function\"&&(l=e.defaultProps))for(s in l)c[s]===void 0&&(c[s]=l[s]);return f.vnode&&f.vnode(i),i}var T,m,ae,Se,O=0,Ee=[],v=f,Ce=v.__b,Pe=v.__r,Ae=v.diffed,$e=v.__c,De=v.unmount,Ie=v.__;function oe(e,t){v.__h&&v.__h(m,e,O||t),O=0;var _=m.__H||(m.__H={__:[],__h:[]});return e>=_.__.length&&_.__.push({}),_.__[e]}function q(e){return O=1,Ge(He,e)}function Ge(e,t,_){var n=oe(T++,2);if(n.t=e,!n.__c&&(n.__=[He(void 0,t),function(s){var c=n.__N?n.__N[0]:n.__[0],i=n.t(c,s);c!==i&&(n.__N=[i,n.__[1]],n.__c.setState({}))}],n.__c=m,!m.__f)){var a=function(s,c,i){if(!n.__c.__H)return!0;var p=n.__c.__H.__.filter(function(u){return!!u.__c});if(p.every(function(u){return!u.__N}))return!r||r.call(this,s,c,i);var o=n.__c.props!==s;return p.forEach(function(u){if(u.__N){var d=u.__[0];u.__=u.__N,u.__N=void 0,d!==u.__[0]&&(o=!0)}}),r&&r.call(this,s,c,i)||o};m.__f=!0;var r=m.shouldComponentUpdate,l=m.componentWillUpdate;m.componentWillUpdate=function(s,c,i){if(this.__e){var p=r;r=void 0,a(s,c,i),r=p}l&&l.call(this,s,c,i)},m.shouldComponentUpdate=a}return n.__N||n.__}function Je(e,t){var _=oe(T++,3);!v.__s&&Be(_.__H,t)&&(_.__=e,_.u=t,m.__H.__h.push(_))}function Ve(e,t){var _=oe(T++,7);return Be(_.__H,t)&&(_.__=e(),_.__H=t,_.__h=e),_.__}function B(e,t){return O=8,Ve(function(){return e},t)}function Ye(){for(var e;e=Ee.shift();)if(e.__P&&e.__H)try{e.__H.__h.forEach(G),e.__H.__h.forEach(le),e.__H.__h=[]}catch(t){e.__H.__h=[],v.__e(t,e.__v)}}v.__b=function(e){m=null,Ce&&Ce(e)},v.__=function(e,t){e&&t.__k&&t.__k.__m&&(e.__m=t.__k.__m),Ie&&Ie(e,t)},v.__r=function(e){Pe&&Pe(e),T=0;var t=(m=e.__c).__H;t&&(ae===m?(t.__h=[],m.__h=[],t.__.forEach(function(_){_.__N&&(_.__=_.__N),_.u=_.__N=void 0})):(t.__h.forEach(G),t.__h.forEach(le),t.__h=[],T=0)),ae=m},v.diffed=function(e){Ae&&Ae(e);var t=e.__c;t&&t.__H&&(t.__H.__h.length&&(Ee.push(t)!==1&&Se===v.requestAnimationFrame||((Se=v.requestAnimationFrame)||Xe)(Ye)),t.__H.__.forEach(function(_){_.u&&(_.__H=_.u),_.u=void 0})),ae=m=null},v.__c=function(e,t){t.some(function(_){try{_.__h.forEach(G),_.__h=_.__h.filter(function(n){return!n.__||le(n)})}catch(n){t.some(function(a){a.__h&&(a.__h=[])}),t=[],v.__e(n,_.__v)}}),$e&&$e(e,t)},v.unmount=function(e){De&&De(e);var t,_=e.__c;_&&_.__H&&(_.__H.__.forEach(function(n){try{G(n)}catch(a){t=a}}),_.__H=void 0,t&&v.__e(t,_.__v))};var Te=typeof requestAnimationFrame==\"function\";function Xe(e){var t,_=function(){clearTimeout(n),Te&&cancelAnimationFrame(t),setTimeout(e)},n=setTimeout(_,35);Te&&(t=requestAnimationFrame(_))}function G(e){var t=m,_=e.__c;typeof _==\"function\"&&(e.__c=void 0,_()),m=t}function le(e){var t=m;e.__c=e.__(),m=t}function Be(e,t){return!e||e.length!==t.length||t.some(function(_,n){return _!==e[n]})}function He(e,t){return typeof t==\"function\"?t(e):t}const J=\"allinone_\",V={get(e){try{const t=localStorage.getItem(J+e);return t?JSON.parse(t):null}catch{return console.warn(\"[Cache] Read error:\",e),null}},set(e,t){try{return localStorage.setItem(J+e,JSON.stringify(t)),t}catch{return console.warn(\"[Cache] Write error:\",e),null}},remove(e){try{localStorage.removeItem(J+e)}catch{console.warn(\"[Cache] Remove error:\",e)}},clear(){try{Object.keys(localStorage).filter(e=>e.startsWith(J)).forEach(e=>localStorage.removeItem(e))}catch{console.warn(\"[Cache] Clear error\")}}};function Ze(){const[e,t]=q(()=>V.get(\"user_theme\")||\"light\"),_=B(a=>{t(a),V.set(\"user_theme\",a),document.documentElement.setAttribute(\"data-theme\",a)},[]),n=B(()=>{_(e===\"light\"?\"dark\":\"light\")},[e]);return Je(()=>{document.documentElement.setAttribute(\"data-theme\",e)},[e]),{theme:e,setTheme:_,toggleTheme:n}}const Le={zh:{nav_select:\"选择工具\",nav_smart:\"智能填充\",nav_text:\"文本查找\",nav_ppt:\"PPT生成\",nav_refiner:\"智能检查\",nav_theory:\"设计理论\",sf_tab_basic:\"基础填充\",sf_tab_ai:\"AI 生成\",sf_tab_custom:\"自定义字段\",sf_prefix:\"加为前缀\",sf_suffix:\"加为后缀\",sf_btn_add_custom:\"+ 自定义\",sf_ai_title:\"AI 对话生成\",sf_btn_gen:\"生成内容\",sf_btn_seq:\"⬇ 顺序录入\",sf_btn_rnd:\"🔀 随机录入\",sf_btn_save_list:\"💾 存为自定义列表\",sf_tag_cn:\"中文\",sf_tag_en:\"英文\",sf_tag_same:\"同地区\",sf_tag_zip:\"带邮编\",sf_tag_male:\"男\",sf_tag_female:\"女\",sf_tag_comma:\"千分号\",sf_tag_year:\"年\",sf_tag_month:\"月\",sf_tag_day:\"日\",sf_lbl_provider:\"服务商\",sf_lbl_baseurl:\"API 地址\",sf_lbl_model:\"模型名称\",sf_lbl_key:\"API Key\",sf_privacy_note:\"隐私说明：本插件没有后台服务器，API Key 仅保存在本地。\",sf_cfg_range:\"数值范围\",sf_cfg_time_range:\"时间范围\",sf_cfg_date_range:\"日期范围\",sf_cfg_time_help:\"* 仅支持设置时分，秒数随机\",sf_cfg_decimal:\"小数位数\",sf_cfg_thous:\"使用千分位分隔符\",sf_cfg_sort:\"排序方式\",sf_sort_rand:\"随机\",sf_sort_asc:\"升序\",sf_sort_desc:\"降序\",sf_cfg_date_fmt:\"日期格式\",sf_cfg_time_fmt:\"时间格式\",sf_dialog_title:\"保存列表\",sf_mode_new:\"列表标题\",sf_mode_append:\"选择目标列表\",sf_btn_cancel:\"取消\",sf_btn_confirm:\"确定\",txt_ph_find:\"请输入查找关键词\",txt_ph_replace:\"请输入替换内容\",txt_btn_find:\"开始查找\",txt_btn_finding:\"搜索中...\",txt_btn_replace:\"替换选中项\",txt_btn_replace_all:\"全部替换\",txt_btn_select_all:\"全选\",txt_err_no_input:\"请输入查找内容\",txt_scope_page:\"当前页\",txt_scope_sel:\"选中项\",ppt_title:\"PPT 生成器\",ppt_step_content:\"内容生成\",ppt_step_layout:\"布局设计\",ppt_step_style:\"样式调整\",ppt_btn_generate:\"生成 PPT\",ppt_btn_auto:\"自动执行\",ppt_btn_reset:\"重置\",refiner_title:\"智能检查\",refiner_tab_lint:\"设计规范\",refiner_tab_find:\"查找替换\",refiner_btn_start:\"开始检查\",refiner_btn_fix:\"一键修复\",refiner_btn_locate:\"定位\",theory_title:\"设计理论\",theory_search:\"搜索理论...\",theory_all:\"全部\",theme_light:\"浅色\",theme_dark:\"深色\",lang_zh:\"中文\",lang_en:\"English\",btn_close:\"关闭\",btn_save:\"保存\",btn_delete:\"删除\",btn_edit:\"编辑\",btn_copy:\"复制\",btn_clear:\"清空\",err_generic:\"发生错误，请重试\",err_no_selection:\"请先选择元素\",err_no_results:\"未找到结果\",success_saved:\"保存成功\",success_copied:\"已复制到剪贴板\"},en:{nav_select:\"Selection\",nav_smart:\"Smart Fill\",nav_text:\"Text Find\",nav_ppt:\"PPT Generator\",nav_refiner:\"Smart Check\",nav_theory:\"Design Theory\",sf_tab_basic:\"Basic Fill\",sf_tab_ai:\"AI Generate\",sf_tab_custom:\"Custom Fields\",sf_prefix:\"Add Prefix\",sf_suffix:\"Add Suffix\",sf_btn_add_custom:\"+ Custom\",sf_ai_title:\"AI Generation\",sf_btn_gen:\"Generate\",sf_btn_seq:\"⬇ Sequential\",sf_btn_rnd:\"🔀 Random\",sf_btn_save_list:\"💾 Save as List\",sf_tag_cn:\"Chinese\",sf_tag_en:\"English\",sf_tag_same:\"Same Region\",sf_tag_zip:\"With Zip\",sf_tag_male:\"Male\",sf_tag_female:\"Female\",sf_tag_comma:\"Thousands\",sf_tag_year:\"Year\",sf_tag_month:\"Month\",sf_tag_day:\"Day\",sf_lbl_provider:\"Provider\",sf_lbl_baseurl:\"API URL\",sf_lbl_model:\"Model Name\",sf_lbl_key:\"API Key\",sf_privacy_note:\"Privacy: No backend server. API Key is stored locally only.\",sf_cfg_range:\"Number Range\",sf_cfg_time_range:\"Time Range\",sf_cfg_date_range:\"Date Range\",sf_cfg_time_help:\"* Only hours and minutes, seconds are random\",sf_cfg_decimal:\"Decimal Places\",sf_cfg_thous:\"Use Thousands Separator\",sf_cfg_sort:\"Sort Order\",sf_sort_rand:\"Random\",sf_sort_asc:\"Ascending\",sf_sort_desc:\"Descending\",sf_cfg_date_fmt:\"Date Format\",sf_cfg_time_fmt:\"Time Format\",sf_dialog_title:\"Save List\",sf_mode_new:\"List Title\",sf_mode_append:\"Select Target List\",sf_btn_cancel:\"Cancel\",sf_btn_confirm:\"Confirm\",txt_ph_find:\"Enter search keyword\",txt_ph_replace:\"Enter replacement\",txt_btn_find:\"Find\",txt_btn_finding:\"Searching...\",txt_btn_replace:\"Replace Selected\",txt_btn_replace_all:\"Replace All\",txt_btn_select_all:\"Select All\",txt_err_no_input:\"Please enter search text\",txt_scope_page:\"Current Page\",txt_scope_sel:\"Selection\",ppt_title:\"PPT Generator\",ppt_step_content:\"Content\",ppt_step_layout:\"Layout\",ppt_step_style:\"Style\",ppt_btn_generate:\"Generate PPT\",ppt_btn_auto:\"Auto Run\",ppt_btn_reset:\"Reset\",refiner_title:\"Smart Check\",refiner_tab_lint:\"Design Rules\",refiner_tab_find:\"Find & Replace\",refiner_btn_start:\"Start Check\",refiner_btn_fix:\"Auto Fix\",refiner_btn_locate:\"Locate\",theory_title:\"Design Theory\",theory_search:\"Search theory...\",theory_all:\"All\",theme_light:\"Light\",theme_dark:\"Dark\",lang_zh:\"中文\",lang_en:\"English\",btn_close:\"Close\",btn_save:\"Save\",btn_delete:\"Delete\",btn_edit:\"Edit\",btn_copy:\"Copy\",btn_clear:\"Clear\",err_generic:\"An error occurred\",err_no_selection:\"Please select elements first\",err_no_results:\"No results found\",success_saved:\"Saved successfully\",success_copied:\"Copied to clipboard\"}};function Ne(){const[e,t]=q(()=>V.get(\"user_lang\")||\"zh\"),_=B(r=>{t(r),V.set(\"user_lang\",r)},[]),n=B(()=>{_(e===\"zh\"?\"en\":\"zh\")},[e]),a=B(r=>Le[e][r]||Le.zh[r]||r,[e]);return{lang:e,setLang:_,toggleLang:n,t:a}}const $={card:\"_card_1dmxw_1\",clickable:\"_clickable_1dmxw_9\",icon:\"_icon_1dmxw_22\",title:\"_title_1dmxw_28\",subtitle:\"_subtitle_1dmxw_35\",orange:\"_orange_1dmxw_41\",blue:\"_blue_1dmxw_50\",purple:\"_purple_1dmxw_59\",green:\"_green_1dmxw_68\",pink:\"_pink_1dmxw_77\"},Qe=({title:e,subtitle:t,icon:_,variant:n=\"default\",onClick:a,className:r=\"\",children:l})=>{const s=[$.card,$[n],a?$.clickable:\"\",r].filter(Boolean).join(\" \");return g(\"div\",{class:s,onClick:a,children:[_&&g(\"span\",{class:$.icon,children:_}),e&&g(\"h3\",{class:$.title,children:e}),t&&g(\"p\",{class:$.subtitle,children:t}),l]})},H={panel:\"_panel_1vcsp_1\",header:\"_header_1vcsp_9\",title:\"_title_1vcsp_16\",count:\"_count_1vcsp_23\",grid:\"_grid_1vcsp_31\"},et=()=>{const{t:e}=Ne(),[t,_]=q(0),n=[{key:\"selectAll\",icon:\"☑️\",label:\"全选\"},{key:\"deselectAll\",icon:\"⬜\",label:\"取消选择\"},{key:\"invertSelection\",icon:\"🔄\",label:\"反选\"},{key:\"selectSameFill\",icon:\"🎨\",label:\"相同填充\"},{key:\"selectSameStroke\",icon:\"✏️\",label:\"相同描边\"},{key:\"selectSameFont\",icon:\"🔤\",label:\"相同字体\"},{key:\"selectSameEffect\",icon:\"✨\",label:\"相同效果\"},{key:\"selectSameOpacity\",icon:\"👁️\",label:\"相同透明度\"}],a=r=>{parent.postMessage({pluginMessage:{type:r}},\"*\")};return g(\"div\",{class:H.panel,children:[g(\"div\",{class:H.header,children:[g(\"h2\",{class:H.title,children:e(\"nav_select\")}),g(\"span\",{class:H.count,children:[t,\" 选中\"]})]}),g(\"div\",{class:H.grid,children:n.map(r=>g(Qe,{icon:r.icon,title:r.label,variant:\"default\",onClick:()=>a(r.key)},r.key))})]})},k={app:\"_app_8w68u_1\",sidebar:\"_sidebar_8w68u_8\",nav:\"_nav_8w68u_17\",navItem:\"_navItem_8w68u_25\",active:\"_active_8w68u_44\",navIcon:\"_navIcon_8w68u_49\",navLabel:\"_navLabel_8w68u_54\",settings:\"_settings_8w68u_60\",settingBtn:\"_settingBtn_8w68u_67\",content:\"_content_8w68u_84\",placeholder:\"_placeholder_8w68u_89\"},tt=[{key:\"select\",icon:\"⬚\",labelKey:\"nav_select\"},{key:\"smartFill\",icon:\"✨\",labelKey:\"nav_smart\"},{key:\"text\",icon:\"🔍\",labelKey:\"nav_text\"},{key:\"ppt\",icon:\"📊\",labelKey:\"nav_ppt\"},{key:\"refiner\",icon:\"🔧\",labelKey:\"nav_refiner\"},{key:\"theory\",icon:\"📚\",labelKey:\"nav_theory\"}],_t=()=>{const[e,t]=q(\"select\"),{theme:_,toggleTheme:n}=Ze(),{lang:a,toggleLang:r,t:l}=Ne(),s=()=>{switch(e){case\"select\":return g(et,{});case\"smartFill\":return g(\"div\",{class:k.placeholder,children:\"智能填充面板 (开发中)\"});case\"text\":return g(\"div\",{class:k.placeholder,children:\"文本查找面板 (开发中)\"});case\"ppt\":return g(\"div\",{class:k.placeholder,children:\"PPT 生成面板 (开发中)\"});case\"refiner\":return g(\"div\",{class:k.placeholder,children:\"智能检查面板 (开发中)\"});case\"theory\":return g(\"div\",{class:k.placeholder,children:\"设计理论面板 (开发中)\"});default:return null}};return g(\"div\",{class:k.app,children:[g(\"aside\",{class:k.sidebar,children:[g(\"div\",{class:k.nav,children:tt.map(c=>g(\"button\",{class:`${k.navItem} ${e===c.key?k.active:\"\"}`,onClick:()=>t(c.key),children:[g(\"span\",{class:k.navIcon,children:c.icon}),g(\"span\",{class:k.navLabel,children:l(c.labelKey)})]},c.key))}),g(\"div\",{class:k.settings,children:[g(\"button\",{class:k.settingBtn,onClick:n,children:_===\"light\"?\"🌙\":\"☀️\"}),g(\"button\",{class:k.settingBtn,onClick:r,children:a===\"zh\"?\"EN\":\"中\"})]})]}),g(\"main\",{class:k.content,children:s()})]})};({errors:[],maxErrors:50,init(){window.onerror=(e,t,_,n,a)=>(this.handleError({type:\"sync\",message:String(e),source:t,line:_,col:n,stack:a==null?void 0:a.stack,time:Date.now()}),!1),window.addEventListener(\"unhandledrejection\",e=>{var t,_;this.handleError({type:\"promise\",message:((t=e.reason)==null?void 0:t.message)||String(e.reason),stack:(_=e.reason)==null?void 0:_.stack,time:Date.now()})}),window.addEventListener(\"error\",e=>{e.error&&this.handleError({type:\"resource\",message:e.message,source:e.filename,line:e.lineno,col:e.colno,time:Date.now()})},!0)},handleError(e){this.errors.push(e),this.errors.length>this.maxErrors&&this.errors.shift(),console.error(\"[ErrorHandler]\",e)},getErrors(){return this.errors},clearErrors(){this.errors=[]}}).init(),Oe(g(_t,{}),document.getElementById(\"root\"))})();\n</script>\n</body>\n</html>", { width: 460, height: 640, themeColors: true });
  var highlightCache = {};
  var layerSortDirection = "asc";
  figma.ui.onmessage = async (msg) => {
    console.log("\u30102\u3011\u540E\u7AEF\uFF1A\u6536\u5230\u4E86\u6D88\u606F ->", msg.type);
    const selection = figma.currentPage.selection;
    switch (msg.type) {
      case "get-selection-count": {
        const textNodes = [];
        const traverse = (n) => {
          if (n.type === "TEXT" && !n.removed && n.visible)
            textNodes.push(n);
          if ("children" in n)
            n.children.forEach(traverse);
        };
        const scope = figma.currentPage.selection.length > 0 ? figma.currentPage.selection : [figma.currentPage];
        scope.forEach(traverse);
        figma.ui.postMessage({ type: "selection-count-res", count: textNodes.length });
        break;
      }
      case "smart-fill-exec": {
        const { dataList, mode, distribution } = msg;
        const textNodes = [];
        const traverse = (n) => {
          if (n.type === "TEXT" && !n.removed && n.visible)
            textNodes.push(n);
          if ("children" in n)
            n.children.forEach(traverse);
        };
        if (figma.currentPage.selection.length > 0) {
          figma.currentPage.selection.forEach(traverse);
        } else {
          figma.notify("\u8BF7\u5148\u9009\u62E9\u5305\u542B\u6587\u672C\u7684\u56FE\u5C42");
          return;
        }
        if (textNodes.length === 0) {
          figma.notify("\u672A\u627E\u5230\u6587\u672C\u56FE\u5C42");
          return;
        }
        textNodes.sort((a, b) => {
          const aAbs = a.absoluteBoundingBox || { x: a.x, y: a.y };
          const bAbs = b.absoluteBoundingBox || { x: b.x, y: b.y };
          if (Math.abs(aAbs.y - bAbs.y) > 10)
            return aAbs.y - bAbs.y;
          return aAbs.x - bAbs.x;
        });
        let changeCount = 0;
        for (let i = 0; i < textNodes.length; i++) {
          const node = textNodes[i];
          try {
            await figma.loadFontAsync(node.fontName);
            let textToFill = "";
            if (distribution === "random") {
              textToFill = dataList[Math.floor(Math.random() * dataList.length)];
            } else {
              textToFill = dataList[i % dataList.length];
            }
            if (mode === "prefix") {
              node.characters = textToFill + node.characters;
            } else if (mode === "suffix") {
              node.characters = node.characters + textToFill;
            } else {
              node.characters = textToFill;
            }
            changeCount++;
          } catch (e) {
            console.error("Fill error", e);
          }
        }
        figma.notify(`\u5DF2\u586B\u5145 ${changeCount} \u4E2A\u6587\u672C`);
        break;
      }
      case "save-storage": {
        await figma.clientStorage.setAsync(msg.key, msg.value);
        if (msg.notify)
          figma.notify("\u914D\u7F6E\u5DF2\u4FDD\u5B58");
        figma.ui.postMessage({ type: "storage-saved", key: msg.key, value: msg.value });
        break;
      }
      case "load-storage": {
        const value = await figma.clientStorage.getAsync(msg.key);
        figma.ui.postMessage({ type: "storage-loaded", key: msg.key, value });
        break;
      }
      case "to-frame": {
        if (selection.length === 0) {
          figma.notify("\u8BF7\u9009\u62E9\u5F62\u72B6");
          return;
        }
        const newSelection = [];
        for (const node of selection) {
          if (node.removed)
            continue;
          const frame = figma.createFrame();
          frame.x = node.x;
          frame.y = node.y;
          frame.resize(node.width, node.height);
          frame.rotation = node.rotation;
          frame.name = node.name;
          if ("fills" in node)
            frame.fills = node.fills;
          if ("strokes" in node) {
            frame.strokes = node.strokes;
            frame.strokeWeight = node.strokeWeight;
          }
          if ("cornerRadius" in node && node.cornerRadius !== figma.mixed)
            frame.cornerRadius = node.cornerRadius;
          if ("cornerSmoothing" in node)
            frame.cornerSmoothing = node.cornerSmoothing;
          if (node.parent) {
            node.parent.appendChild(frame);
            const idx = node.parent.children.indexOf(node);
            if (idx > -1)
              frame.parent.insertChild(idx, frame);
          }
          if ("children" in node) {
            const children = [...node.children];
            for (const child of children) {
              if (!child.removed)
                frame.appendChild(child);
            }
          }
          if (!node.removed)
            node.remove();
          newSelection.push(frame);
        }
        figma.currentPage.selection = newSelection;
        figma.notify("\u5DF2\u8F6C\u6362\u4E3A Frame");
        break;
      }
      case "to-rect": {
        const newSelection = [];
        for (const node of selection) {
          if ((node.type === "FRAME" || node.type === "GROUP") && !node.removed) {
            const r = figma.createRectangle();
            r.x = node.x;
            r.y = node.y;
            r.resize(node.width, node.height);
            r.rotation = node.rotation;
            r.name = node.name;
            if ("fills" in node && node.fills !== figma.mixed)
              r.fills = node.fills;
            if ("strokes" in node) {
              r.strokes = node.strokes;
              r.strokeWeight = node.strokeWeight;
            }
            if ("cornerRadius" in node && node.cornerRadius !== figma.mixed)
              r.cornerRadius = node.cornerRadius;
            if ("cornerSmoothing" in node)
              r.cornerSmoothing = node.cornerSmoothing;
            if (node.parent) {
              node.parent.appendChild(r);
              const idx = node.parent.children.indexOf(node);
              if (idx > -1)
                node.parent.insertChild(idx, r);
            }
            node.remove();
            newSelection.push(r);
          }
        }
        if (newSelection.length > 0)
          figma.currentPage.selection = newSelection;
        break;
      }
      case "swap-fs": {
        let count = 0;
        for (const node of selection) {
          if ("fills" in node && "strokes" in node) {
            const temp = node.fills;
            node.fills = node.strokes;
            node.strokes = temp;
            if (node.strokes.length > 0 && node.strokeWeight === 0)
              node.strokeWeight = 1;
            count++;
          }
        }
        if (count > 0)
          figma.notify("\u5DF2\u4EA4\u6362\u586B\u5145/\u63CF\u8FB9");
        break;
      }
      case "reset-image": {
        for (const node of selection) {
          if ("fills" in node && Array.isArray(node.fills)) {
            const img = node.fills.find((f) => f.type === "IMAGE");
            if (img && img.imageHash) {
              const asyncImg = figma.getImageByHash(img.imageHash);
              const size = await asyncImg.getSizeAsync();
              if (size && size.width)
                node.resize(node.width, node.width * (size.height / size.width));
            }
          }
        }
        break;
      }
      case "select-text": {
        let t = [];
        const pool = selection.length > 0 ? selection : [figma.currentPage];
        for (const n of pool) {
          if (n.type === "TEXT")
            t.push(n);
          if ("findAll" in n)
            t = t.concat(n.findAll((x) => x.type === "TEXT"));
        }
        if (t.length > 0) {
          figma.currentPage.selection = t;
          figma.notify(`\u9009\u4E2D ${t.length} \u4E2A\u6587\u672C`);
        } else {
          figma.notify("\u672A\u627E\u5230\u6587\u672C");
        }
        break;
      }
      case "remove-al": {
        let rm2 = function(n) {
          if (n.layoutMode && n.layoutMode !== "NONE") {
            n.layoutMode = "NONE";
            count++;
          }
          if (n.children)
            n.children.forEach(rm2);
        };
        var rm = rm2;
        let count = 0;
        selection.forEach(rm2);
        figma.notify(`\u79FB\u9664 ${count} \u4E2A\u81EA\u52A8\u5E03\u5C40`);
        break;
      }
      case "add-al-wrapper": {
        const newSelection = [];
        if (selection.length === 0) {
          figma.notify("\u8BF7\u9009\u62E9\u56FE\u5C42");
          return;
        }
        for (const node of selection) {
          if (node.removed || !node.parent)
            continue;
          const frame = figma.createFrame();
          frame.name = "Auto Layout Wrapper";
          frame.layoutMode = "VERTICAL";
          frame.itemSpacing = 10;
          frame.paddingLeft = 0;
          frame.paddingRight = 0;
          frame.paddingTop = 0;
          frame.paddingBottom = 0;
          frame.primaryAxisSizingMode = "AUTO";
          frame.counterAxisSizingMode = "AUTO";
          frame.fills = [{ type: "SOLID", color: { r: 1, g: 0, b: 0 } }];
          frame.strokes = [];
          frame.x = node.x;
          frame.y = node.y;
          const parent = node.parent;
          const index = parent.children.indexOf(node);
          parent.insertChild(index, frame);
          frame.appendChild(node);
          newSelection.push(frame);
        }
        if (newSelection.length > 0) {
          figma.currentPage.selection = newSelection;
          figma.notify(msg.successMsg || "\u5DF2\u6DFB\u52A0\u81EA\u52A8\u5E03\u5C40\u5916\u5957");
        }
        break;
      }
      case "split-text": {
        const newSel = [];
        for (const node of selection) {
          if (node.type !== "TEXT")
            continue;
          const lines = node.characters.split(/\r\n|\r|\n/);
          if (lines.length <= 1)
            continue;
          let font = node.fontName;
          if (font === figma.mixed)
            font = node.getRangeFontName(0, 1);
          try {
            await figma.loadFontAsync(font);
          } catch (e) {
            figma.notify("\u5B57\u4F53\u52A0\u8F7D\u5931\u8D25");
            continue;
          }
          let cy = node.y;
          for (const l of lines) {
            if (!l.trim())
              continue;
            const t = node.clone();
            t.characters = l;
            t.textAutoResize = "WIDTH_AND_HEIGHT";
            t.y = cy;
            node.parent.appendChild(t);
            newSel.push(t);
            cy += t.height + 10;
          }
          node.remove();
        }
        if (newSel.length > 0)
          figma.currentPage.selection = newSel;
        break;
      }
      case "join-text": {
        const tNodes = selection.filter((n) => n.type === "TEXT").sort((a, b) => Math.abs(a.y - b.y) > 5 ? a.y - b.y : a.x - b.x);
        if (tNodes.length < 2) {
          figma.notify("\u8BF7\u90092\u4E2A\u4EE5\u4E0A\u6587\u672C");
          return;
        }
        let font = tNodes[0].fontName;
        if (font === figma.mixed)
          font = tNodes[0].getRangeFontName(0, 1);
        try {
          await figma.loadFontAsync(font);
        } catch (e) {
          figma.notify("\u5B57\u4F53\u52A0\u8F7D\u5931\u8D25");
          return;
        }
        const txt = tNodes.map((n) => n.characters).join("\n");
        const nt = tNodes[0].clone();
        nt.characters = txt;
        nt.textAutoResize = "HEIGHT";
        for (let i = 1; i < tNodes.length; i++)
          tNodes[i].remove();
        figma.currentPage.selection = [nt];
        break;
      }
      case "up-one": {
        const arr = [];
        selection.forEach((n) => {
          if (n.parent && n.parent.parent && n.parent !== figma.currentPage) {
            n.parent.parent.appendChild(n);
            arr.push(n);
          }
        });
        if (arr.length > 0)
          figma.currentPage.selection = arr;
        break;
      }
      case "up-all": {
        const arr = [];
        selection.forEach((n) => {
          figma.currentPage.appendChild(n);
          arr.push(n);
        });
        figma.currentPage.selection = arr;
        break;
      }
      case "rename-content": {
        selection.forEach((n) => {
          let name = "";
          if (n.type === "TEXT")
            name = n.characters;
          else if ("findOne" in n) {
            const t = n.findOne((x) => x.type === "TEXT");
            if (t)
              name = t.characters;
          }
          if (name)
            n.name = name.substring(0, 20);
        });
        figma.notify("\u5DF2\u91CD\u547D\u540D");
        break;
      }
      case "detach-all": {
        const sel = figma.currentPage.selection;
        if (sel.length === 0) {
          figma.notify("\u8BF7\u5148\u9009\u4E2D\u56FE\u5C42");
          return;
        }
        const targets = [];
        const scan = (n) => {
          if ("children" in n) {
            const children = n.children;
            for (const child of children) {
              scan(child);
            }
          }
          if (n.type === "INSTANCE") {
            targets.push(n);
          }
        };
        sel.forEach(scan);
        if (targets.length === 0) {
          figma.notify("\u672A\u627E\u5230\u53EF\u89E3\u7ED1\u7684\u5B9E\u4F8B");
          return;
        }
        let count = 0;
        for (const node of targets) {
          if (!node.removed) {
            try {
              node.detachInstance();
              count++;
            } catch (e) {
              console.error("\u89E3\u7ED1\u51FA\u9519:", e);
            }
          }
        }
        figma.notify(`\u5DF2\u5F7B\u5E95\u89E3\u7ED1 ${count} \u4E2A\u7EC4\u4EF6`);
        break;
      }
      case "remove-hidden": {
        let h = [];
        const pool = selection.length > 0 ? selection : [figma.currentPage];
        for (const n of pool) {
          if ("visible" in n && !n.visible)
            h.push(n);
          if ("findAll" in n)
            h = h.concat(n.findAll((x) => !x.visible));
        }
        let count = 0;
        h.reverse().forEach((n) => {
          if (!n.removed) {
            n.remove();
            count++;
          }
        });
        figma.notify(`\u5DF2\u5220\u9664 ${count} \u4E2A\u9690\u85CF\u56FE\u5C42`);
        break;
      }
      case "sort-layers": {
        if (selection.length > 1) {
          const p = selection[0].parent;
          if (selection.every((n) => n.parent === p)) {
            const isReverse = layerSortDirection === "desc";
            [...selection].sort((a, b) => {
              const diffY = a.y - b.y;
              const diffX = a.x - b.x;
              const result = Math.abs(diffY) > 2 ? diffY : diffX;
              return isReverse ? -result : result;
            }).forEach((n) => p.appendChild(n));
            figma.notify(isReverse ? "\u5DF2\u3010\u5012\u5E8F\u3011\u6392\u5217\u56FE\u5C42 (Z->A)" : "\u5DF2\u3010\u6B63\u5E8F\u3011\u6392\u5217\u56FE\u5C42 (A->Z)");
            layerSortDirection = isReverse ? "asc" : "desc";
          }
        } else {
          figma.notify("\u8BF7\u81F3\u5C11\u9009\u62E9\u4E24\u4E2A\u540C\u7EA7\u56FE\u5C42");
        }
        break;
      }
      case "ungroup-all": {
        let count = 0;
        selection.forEach((n) => {
          if ("findAll" in n) {
            let gs = n.findAll((x) => x.type === "GROUP");
            while (gs.length > 0) {
              gs.forEach((x) => {
                if (!x.removed) {
                  figma.ungroup(x);
                  count++;
                }
              });
              gs = n.findAll((x) => x.type === "GROUP");
            }
          }
        });
        figma.notify(`\u5DF2\u89E3\u6563 ${count} \u4E2A\u7EC4`);
        break;
      }
      case "unlock-all": {
        let ul2 = function(n) {
          if ("locked" in n && n.locked) {
            n.locked = false;
            count++;
          }
          if ("children" in n)
            n.children.forEach(ul2);
        };
        var ul = ul2;
        let count = 0;
        selection.forEach(ul2);
        figma.notify(`\u5DF2\u89E3\u9501 ${count} \u4E2A\u56FE\u5C42`);
        break;
      }
      case "pixel-perfect": {
        if (selection.length === 0) {
          figma.notify("\u8BF7\u9009\u62E9\u56FE\u5C42");
          return;
        }
        let count = 0;
        for (const node of selection) {
          if (!node.removed) {
            const newX = Math.round(node.x);
            const newY = Math.round(node.y);
            const newW = Math.round(node.width);
            const newH = Math.round(node.height);
            if (node.x !== newX || node.y !== newY)
              node.x = newX, node.y = newY;
            if (node.width !== newW || node.height !== newH)
              node.resize(newW, newH);
            count++;
          }
        }
        figma.notify(`\u5DF2\u5BF9\u9F50 ${count} \u4E2A\u56FE\u5C42`);
        break;
      }
      case "fetch-selection-name": {
        const sel = figma.currentPage.selection;
        if (sel.length > 0) {
          figma.ui.postMessage({ type: "update-name-input", name: sel[0].name });
        } else {
          figma.notify("\u8BF7\u5148\u9009\u62E9\u4E00\u4E2A\u56FE\u5C42\u4EE5\u83B7\u53D6\u540D\u79F0");
        }
        break;
      }
      case "find-and-select": {
        const f = msg.filters;
        const sel = figma.currentPage.selection;
        console.log(`=== \u5F00\u59CB\u67E5\u627E (v3\u4FEE\u590D\u7248) ===`);
        console.log(`Scope: ${f.scope} | \u9009\u4E2D\u56FE\u5C42: ${sel.length}`);
        let searchTargets = [];
        if (f.scope === "inside") {
          if (sel.length === 0) {
            figma.notify("\u26A0\uFE0F \u8BF7\u5148\u9009\u62E9\u4E00\u4E2A\u5BB9\u5668(Frame/Group)");
            return;
          }
          for (const node of sel) {
            if ("findAll" in node) {
              const children = node.findAll(() => true);
              searchTargets.push(...children);
            }
          }
        } else if (f.scope === "children") {
          if (sel.length === 0) {
            figma.notify("\u26A0\uFE0F \u8BF7\u5148\u9009\u62E9\u4E00\u4E2A\u5BB9\u5668(Frame/Group)");
            return;
          }
          for (const node of sel) {
            if ("children" in node) {
              searchTargets.push(...node.children);
            }
          }
        } else if (f.scope === "sibling") {
          if (sel.length > 0 && sel[0].parent) {
            const siblings = sel[0].parent.children.filter((n) => !sel.includes(n));
            searchTargets.push(...siblings);
          } else {
            figma.notify("\u26A0\uFE0F \u8BF7\u5148\u9009\u62E9\u4E00\u4E2A\u56FE\u5C42");
            return;
          }
        } else {
          if (sel.length > 0) {
            console.log(">> \u7B56\u7565: \u67E5\u627E\u9009\u4E2D\u9879\u53CA\u5176\u540E\u4EE3");
            for (const node of sel) {
              searchTargets.push(node);
              if ("findAll" in node) {
                const children = node.findAll(() => true);
                searchTargets.push(...children);
              }
            }
          } else {
            console.log(">> \u7B56\u7565: \u5168\u9875\u9762\u67E5\u627E");
            const allPageNodes = figma.currentPage.findAll(() => true);
            searchTargets.push(...allPageNodes);
          }
        }
        const uniqueMap = /* @__PURE__ */ new Map();
        searchTargets.forEach((node) => uniqueMap.set(node.id, node));
        const finalPool = Array.from(uniqueMap.values());
        console.log(`\u{1F50D} \u5F85\u7B5B\u9009\u6C60\u6700\u7EC8\u5927\u5C0F: ${finalPool.length}`);
        const results = [];
        for (const node of finalPool) {
          let match = true;
          if (f.name && f.name.val) {
            let n = node.name;
            let q = f.name.val;
            if (!f.name.caseSensitive) {
              n = n.toLowerCase();
              q = q.toLowerCase();
            }
            if (!n.includes(q))
              match = false;
          }
          if (match && f.types && f.types.vals.length > 0) {
            const t = node.type;
            const ts = f.types.vals;
            let isType = false;
            if (ts.includes(t))
              isType = true;
            if (ts.includes("AUTOLAYOUT") && t === "FRAME" && node.layoutMode !== "NONE")
              isType = true;
            if (ts.includes("IMAGE") && "fills" in node && node.fills !== figma.mixed && Array.isArray(node.fills)) {
              if (node.fills.some((p) => p.type === "IMAGE" && p.visible !== false))
                isType = true;
            }
            if (ts.includes("COMPONENT_SET") && t === "COMPONENT_SET")
              isType = true;
            if (ts.includes("SECTION") && t === "SECTION")
              isType = true;
            if (f.types.logic === "include") {
              if (!isType)
                match = false;
            } else {
              if (isType)
                match = false;
            }
          }
          if (match && f.states && f.states.vals.length > 0) {
            let isState = false;
            const s = f.states.vals;
            if (s.includes("hidden") && !node.visible)
              isState = true;
            if (s.includes("locked") && node.locked)
              isState = true;
            if (s.includes("mask") && node.isMask)
              isState = true;
            if (s.includes("export") && node.exportSettings && node.exportSettings.length > 0)
              isState = true;
            if (s.includes("no-fill") && "fills" in node && node.fills !== figma.mixed) {
              if (Array.isArray(node.fills) && node.fills.length === 0)
                isState = true;
            }
            if (s.includes("no-stroke") && "strokes" in node && node.strokes !== figma.mixed) {
              if (Array.isArray(node.strokes) && node.strokes.length === 0)
                isState = true;
            }
            if (s.includes("clip") && "clipsContent" in node && node.clipsContent)
              isState = true;
            if (s.includes("no-children") && "children" in node) {
              if (node.children.length === 0)
                isState = true;
            }
            if (f.states.logic === "include") {
              if (!isState)
                match = false;
            } else {
              if (isState)
                match = false;
            }
          }
          if (match && f.props && f.props.length > 0) {
            for (const p of f.props) {
              let val = void 0;
              try {
                if (p.key === "name")
                  val = node.name;
                else if (p.key === "fillCount" && "fills" in node && node.fills !== figma.mixed)
                  val = node.fills.length;
                else if (p.key === "strokeCount" && "strokes" in node && node.strokes !== figma.mixed)
                  val = node.strokes.length;
                else if (p.key in node) {
                  const v = node[p.key];
                  if (v !== figma.mixed)
                    val = v;
                }
              } catch (e) {
              }
              if (val === void 0) {
                match = false;
                break;
              }
              const tgt = p.val;
              if (p.op === "=") {
                if (val != tgt)
                  match = false;
              } else if (p.op === "!=") {
                if (val == tgt)
                  match = false;
              } else if (p.op === ">") {
                if (Number(val) <= Number(tgt))
                  match = false;
              } else if (p.op === "<") {
                if (Number(val) >= Number(tgt))
                  match = false;
              } else if (p.op === "has") {
                if (!String(val).toLowerCase().includes(String(tgt).toLowerCase()))
                  match = false;
              }
            }
          }
          if (match) {
            results.push(node);
          }
        }
        console.log(`\u2705 \u6700\u7EC8\u5339\u914D: ${results.length}`);
        if (results.length > 0) {
          figma.currentPage.selection = results;
          figma.viewport.scrollAndZoomIntoView(results);
          figma.notify(`\u2705 \u5DF2\u9009\u4E2D ${results.length} \u4E2A\u56FE\u5C42`);
          figma.ui.postMessage({
            type: "found-layers-result",
            count: results.length,
            layers: results.map((n) => ({ id: n.id, name: n.name, type: n.type }))
          });
        } else {
          figma.notify("\u26A0\uFE0F \u672A\u627E\u5230\u56FE\u5C42\uFF0C\u8BF7\u68C0\u67E5 Console\u7684\u7B5B\u9009\u6C60\u5927\u5C0F");
          figma.ui.postMessage({ type: "found-layers-result", count: 0, layers: [] });
        }
        break;
      }
      case "focus-layers": {
        const runFocus = async () => {
          try {
            const ids = msg.ids;
            if (!ids || ids.length === 0)
              return;
            const nodes = await Promise.all(ids.map((id) => figma.getNodeByIdAsync(id)));
            const targets = [];
            const selection2 = [];
            const currentPageId = figma.currentPage.id;
            for (const node of nodes) {
              if (!node || node.removed)
                continue;
              if (node.type === "DOCUMENT" || node.type === "PAGE")
                continue;
              let p = node.parent;
              let isCurrent = false;
              if (p && p.type === "PAGE") {
                isCurrent = p.id === currentPageId;
              } else {
                while (p) {
                  if (p.type === "PAGE") {
                    isCurrent = p.id === currentPageId;
                    break;
                  }
                  p = p.parent;
                }
              }
              if (isCurrent) {
                targets.push(node);
                if (!node.locked && node.visible) {
                  selection2.push(node);
                }
              }
            }
            if (targets.length > 0) {
              figma.currentPage.selection = selection2;
              figma.viewport.scrollAndZoomIntoView(targets);
              if (targets.length > 1) {
                figma.notify(`\u5DF2\u5B9A\u4F4D ${targets.length} \u9879`);
              }
            }
          } catch (e) {
            console.log("\u5B9A\u4F4D\u9519\u8BEF (\u5DF2\u5FFD\u7565):", e);
          }
        };
        runFocus();
        break;
      }
      case "create-styles": {
        console.log("=== \u5F00\u59CB\u6267\u884C\u521B\u5EFA\u6837\u5F0F (Async\u6A21\u5F0F) ===");
        if (selection.length === 0) {
          figma.notify("\u8BF7\u9009\u62E9\u56FE\u5C42");
          return;
        }
        let createdCount = 0;
        const conflicts = [];
        const errors = [];
        try {
          const localPaints = await figma.getLocalPaintStylesAsync();
          const localTexts = await figma.getLocalTextStylesAsync();
          const localEffects = await figma.getLocalEffectStylesAsync();
          for (const node of selection) {
            if (node.removed)
              continue;
            const name = node.name;
            console.log(`\u5904\u7406\u56FE\u5C42: ${name}`);
            if ("fills" in node && node.type !== "GROUP" && node.fills !== figma.mixed && Array.isArray(node.fills) && node.fills.length > 0) {
              if (node.fills[0].type !== "IMAGE") {
                const exist = localPaints.find((s) => s.name === name);
                if (exist) {
                  if (!conflicts.includes(name))
                    conflicts.push(name + " (\u989C\u8272)");
                } else {
                  try {
                    const style = figma.createPaintStyle();
                    style.name = name;
                    style.paints = JSON.parse(JSON.stringify(node.fills));
                    node.fillStyleId = style.id;
                    createdCount++;
                  } catch (err) {
                    errors.push(name);
                    console.error("\u989C\u8272\u521B\u5EFA\u5931\u8D25:", err);
                  }
                }
              }
            }
            if (node.type === "TEXT") {
              const exist = localTexts.find((s) => s.name === name);
              if (exist) {
                if (!conflicts.includes(name))
                  conflicts.push(name + " (\u6587\u672C)");
              } else {
                try {
                  const style = figma.createTextStyle();
                  style.name = name;
                  const font = node.fontName;
                  if (font !== figma.mixed) {
                    await figma.loadFontAsync(font);
                    style.fontName = font;
                    style.fontSize = node.fontSize !== figma.mixed ? node.fontSize : 12;
                    if (node.letterSpacing !== figma.mixed)
                      style.letterSpacing = node.letterSpacing;
                    if (node.lineHeight !== figma.mixed)
                      style.lineHeight = node.lineHeight;
                    if (node.textDecoration !== figma.mixed)
                      style.textDecoration = node.textDecoration;
                    node.textStyleId = style.id;
                    createdCount++;
                  }
                } catch (err) {
                  errors.push(name);
                  console.error("\u6587\u672C\u521B\u5EFA\u5931\u8D25:", err);
                }
              }
            }
            if ("effects" in node && node.effects !== figma.mixed && Array.isArray(node.effects) && node.effects.length > 0) {
              const exist = localEffects.find((s) => s.name === name);
              if (exist) {
                if (!conflicts.includes(name))
                  conflicts.push(name + " (\u6548\u679C)");
              } else {
                try {
                  const style = figma.createEffectStyle();
                  style.name = name;
                  style.effects = JSON.parse(JSON.stringify(node.effects));
                  node.effectStyleId = style.id;
                  createdCount++;
                } catch (err) {
                  errors.push(name);
                  console.error("\u6548\u679C\u521B\u5EFA\u5931\u8D25:", err);
                }
              }
            }
          }
        } catch (e) {
          console.error("\u5168\u5C40\u9519\u8BEF:", e);
          figma.notify("\u53D1\u751F\u9519\u8BEF\uFF0C\u8BF7\u67E5\u770B\u63A7\u5236\u53F0");
        }
        const parts = [];
        if (createdCount > 0)
          parts.push(`\u65B0\u5EFA ${createdCount} \u4E2A`);
        if (conflicts.length > 0)
          parts.push(`\u8DF3\u8FC7\u91CD\u590D ${conflicts.length} \u4E2A`);
        if (parts.length > 0) {
          figma.notify(parts.join("\uFF0C"));
        } else {
          figma.notify("\u672A\u6267\u884C\u64CD\u4F5C (\u53EF\u80FD\u662F\u65E0\u6837\u5F0F\u5C5E\u6027\u6216\u5DF2\u91CD\u590D)");
        }
        console.log("=== \u7ED3\u675F ===");
        break;
      }
      case "match-styles": {
        console.log("=== \u5F00\u59CB\u5339\u914D\u6837\u5F0F (Async\u4FEE\u590D\u7248) ===");
        const sel = figma.currentPage.selection;
        if (sel.length === 0) {
          figma.notify("\u8BF7\u5148\u9009\u62E9\u8303\u56F4 (\u652F\u6301\u5305\u542B\u5B50\u56FE\u5C42)");
          return;
        }
        let countFill = 0, countStroke = 0, countText = 0, countEffect = 0;
        try {
          const paints = await figma.getLocalPaintStylesAsync();
          const texts = await figma.getLocalTextStylesAsync();
          const effects = await figma.getLocalEffectStylesAsync();
          const paintMap = /* @__PURE__ */ new Map();
          paints.forEach((s) => paintMap.set(JSON.stringify(s.paints), s.id));
          const effectMap = /* @__PURE__ */ new Map();
          effects.forEach((s) => effectMap.set(JSON.stringify(s.effects), s.id));
          const textMap = /* @__PURE__ */ new Map();
          texts.forEach((s) => {
            const fingerprint = JSON.stringify({
              family: s.fontName.family,
              style: s.fontName.style,
              size: s.fontSize,
              lh: s.lineHeight,
              ls: s.letterSpacing,
              td: s.textDecoration,
              pi: s.paragraphIndent,
              ps: s.paragraphSpacing
            });
            textMap.set(fingerprint, s.id);
          });
          const traverse = async (node) => {
            if (node.removed)
              return;
            if ("fills" in node && node.fills !== figma.mixed && node.fills.length > 0 && node.fillStyleId === "") {
              const key = JSON.stringify(node.fills);
              if (paintMap.has(key)) {
                try {
                  await node.setFillStyleIdAsync(paintMap.get(key));
                  countFill++;
                } catch (e) {
                }
              }
            }
            if ("strokes" in node && node.strokes !== figma.mixed && node.strokes.length > 0 && node.strokeStyleId === "") {
              const key = JSON.stringify(node.strokes);
              if (paintMap.has(key)) {
                try {
                  await node.setStrokeStyleIdAsync(paintMap.get(key));
                  countStroke++;
                } catch (e) {
                }
              }
            }
            if ("effects" in node && node.effects !== figma.mixed && node.effects.length > 0 && node.effectStyleId === "") {
              const key = JSON.stringify(node.effects);
              if (effectMap.has(key)) {
                try {
                  await node.setEffectStyleIdAsync(effectMap.get(key));
                  countEffect++;
                } catch (e) {
                }
              }
            }
            if (node.type === "TEXT" && node.textStyleId === "" && node.fontName !== figma.mixed && node.fontSize !== figma.mixed) {
              const key = JSON.stringify({
                family: node.fontName.family,
                style: node.fontName.style,
                size: node.fontSize,
                lh: node.lineHeight,
                ls: node.letterSpacing,
                td: node.textDecoration,
                pi: node.paragraphIndent,
                ps: node.paragraphSpacing
              });
              if (textMap.has(key)) {
                try {
                  await node.setTextStyleIdAsync(textMap.get(key));
                  countText++;
                } catch (e) {
                }
              }
            }
            if ("children" in node) {
              for (const child of node.children) {
                await traverse(child);
              }
            }
          };
          for (const node of sel) {
            await traverse(node);
          }
        } catch (e) {
          console.error("\u5339\u914D\u8FC7\u7A0B\u51FA\u9519:", e);
          figma.notify("\u5339\u914D\u51FA\u9519\uFF0C\u8BF7\u68C0\u67E5\u63A7\u5236\u53F0");
          return;
        }
        const total = countFill + countStroke + countText + countEffect;
        if (total > 0) {
          figma.notify(`\u5339\u914D\u6210\u529F: \u586B\u5145${countFill} / \u63CF\u8FB9${countStroke} / \u6587\u672C${countText} / \u6548\u679C${countEffect}`);
        } else {
          figma.notify("\u672A\u53D1\u73B0\u53EF\u5339\u914D\u7684\u6837\u5F0F");
        }
        break;
      }
      case "swap-positions": {
        if (selection.length !== 2) {
          figma.notify("\u8BF7\u4E25\u683C\u9009\u62E9 2 \u4E2A\u56FE\u5C42\u8FDB\u884C\u4EA4\u6362");
          return;
        }
        const n1 = selection[0];
        const n2 = selection[1];
        const x1 = n1.x, y1 = n1.y;
        const x2 = n2.x, y2 = n2.y;
        n1.x = x2;
        n1.y = y2;
        n2.x = x1;
        n2.y = y1;
        figma.notify("\u4F4D\u7F6E\u5DF2\u4E92\u6362");
        break;
      }
      case "find-replace": {
        const { findText, replaceText } = msg;
        if (!findText) {
          figma.notify("\u8BF7\u8F93\u5165\u67E5\u627E\u5185\u5BB9\uFF0C\u6CE8\u610F\u533A\u5206\u5927\u5C0F\u5199");
          return;
        }
        const scope = selection.length > 0 ? selection : [figma.currentPage];
        let count = 0;
        const textNodes = [];
        const collect = (n) => {
          if (n.type === "TEXT")
            textNodes.push(n);
          if ("children" in n)
            n.children.forEach(collect);
        };
        scope.forEach(collect);
        if (textNodes.length === 0) {
          figma.notify("\u8303\u56F4\u5185\u6CA1\u6709\u6587\u672C");
          return;
        }
        for (const node of textNodes) {
          if (node.characters.includes(findText)) {
            try {
              const font = node.fontName;
              if (font === figma.mixed) {
                await figma.loadFontAsync(node.getRangeFontName(0, 1));
              } else {
                await figma.loadFontAsync(font);
              }
              node.characters = node.characters.split(findText).join(replaceText);
              count++;
            } catch (e) {
              console.error("\u5B57\u4F53\u52A0\u8F7D\u5931\u8D25\u6216\u66FF\u6362\u51FA\u9519", e);
            }
          }
        }
        if (count > 0)
          figma.notify(`\u5DF2\u66FF\u6362 ${count} \u5904\u6587\u672C`);
        else
          figma.notify("\u672A\u627E\u5230\u5339\u914D\u5185\u5BB9");
        break;
      }
      case "ppt-step-1": {
        const pageName = figma.currentPage.name.toLowerCase();
        if (!pageName.includes("copy") && !pageName.includes("\u526F\u672C")) {
          figma.notify("\u26A0\uFE0F \u8BF7\u5148\u5C06 Page \u91CD\u547D\u540D\u4E3A 'xxx \u526F\u672C' \u4EE5\u786E\u4FDD\u5B89\u5168\uFF01", { error: true });
          figma.ui.postMessage({ type: "step-error", step: 1 });
          return;
        }
        const slides = getSlides();
        if (slides.length === 0) {
          figma.notify("\u8BF7\u81F3\u5C11\u9009\u62E9\u4E00\u4E2A Frame \u753B\u677F");
          figma.ui.postMessage({ type: "step-error", step: 1 });
          return;
        }
        await pptStep1_Init(slides);
        break;
      }
      case "ppt-step-2": {
        const slides = getSlides();
        await pptStep2_Rasterize(slides);
        break;
      }
      case "ppt-step-3": {
        const slides = getSlides();
        await pptStep3_Flatten(slides);
        break;
      }
      case "ppt-step-4": {
        let slides = getSlides();
        slides = sortNodesByVisualPosition(slides);
        await pptStep4_Extract(slides);
        break;
      }
      case "ppt-step-5": {
        let slides = getSlides();
        slides = sortNodesByVisualPosition(slides);
        await pptStep5_ExportImages(slides);
        break;
      }
      case "lint-variants": {
        console.log("\u30103\u3011\u540E\u7AEF\uFF1A\u8FDB\u5165\u4E25\u683C\u5206\u7C7B\u903B\u8F91...");
        const cfg = msg.config || msg;
        const targets = [];
        let scopeNodes = [];
        if (cfg.scope === "page") {
          scopeNodes = figma.currentPage.children;
        } else {
          scopeNodes = figma.currentPage.selection;
        }
        const collectTargets = (nodes) => {
          for (const node of nodes) {
            if (node.type === "COMPONENT_SET" || node.type === "COMPONENT") {
              targets.push(node);
            }
            if ("children" in node)
              collectTargets(node.children);
          }
        };
        collectTargets(scopeNodes);
        let findRegex = null;
        if (cfg.mode === "find" && cfg.findText) {
          try {
            const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            let pat = escape(cfg.findText);
            if (cfg.wholeWord)
              pat = `\\b${pat}\\b`;
            findRegex = new RegExp(pat, cfg.caseSensitive ? "g" : "gi");
          } catch (e) {
          }
        }
        const results = [];
        const checkString = (text) => {
          let res = { changed: false, val: text };
          if (cfg.mode === "lint") {
            res = convertNameAdvanced(text, cfg.format, cfg.separator, cfg.casing, cfg.emoji, cfg.removeId, cfg.unmarkHidden);
          } else if (findRegex) {
            if (findRegex.test(text)) {
              res.val = text.replace(findRegex, cfg.replaceText || "");
              res.changed = true;
            }
            if (res.changed && cfg.markHidden) {
              if (!res.val.startsWith(".") && !res.val.startsWith("_"))
                res.val = "." + res.val;
            }
            if (cfg.unmarkHidden) {
              if (res.val.startsWith(".") || res.val.startsWith("_")) {
                res.val = res.val.substring(1);
                res.changed = true;
              }
            }
          }
          return res;
        };
        for (const node of targets) {
          try {
            if (node.type === "COMPONENT_SET") {
              const res = checkString(node.name);
              if (res.changed) {
                results.push({
                  id: node.id,
                  compId: node.id,
                  compName: node.name,
                  // 🔥 1. 明确标记类型
                  type: "COMPONENT_SET",
                  targetType: "CompName",
                  // 🏷️ 组件名
                  propName: "Name",
                  oldVal: node.name,
                  newVal: res.val
                });
              }
            } else if (node.type === "COMPONENT") {
              const isVariant = node.parent && node.parent.type === "COMPONENT_SET";
              const compId = isVariant ? node.parent.id : node.id;
              const CompName = isVariant ? node.parent.name : node.name;
              const groupType = isVariant ? "COMPONENT_SET" : "COMPONENT";
              if (!isVariant) {
                const res = checkString(node.name);
                if (res.changed) {
                  results.push({
                    id: node.id,
                    compId,
                    compName: CompName,
                    // 🔥 1. 明确标记类型
                    type: groupType,
                    targetType: "CompName",
                    // 🏷️ 组件名
                    propName: "Name",
                    oldVal: node.name,
                    newVal: res.val
                  });
                }
              } else {
                const rawProps = node.name.split(",").map((p) => p.trim());
                const newProps = [];
                let hasAnyChange = false;
                rawProps.forEach((pair) => {
                  const parts = pair.split("=");
                  if (parts.length < 2) {
                    newProps.push(pair);
                    return;
                  }
                  const key = parts[0].trim();
                  const val = parts[1].trim();
                  const resKey = checkString(key);
                  if (resKey.changed) {
                    results.push({
                      id: node.id,
                      compId,
                      compName: CompName,
                      // 🔥 1. 明确标记类型
                      type: groupType,
                      targetType: "PropName",
                      // 🏷️ 属性名
                      propName: "Property",
                      oldVal: key,
                      newVal: resKey.val
                    });
                    hasAnyChange = true;
                  }
                  const resVal = checkString(val);
                  if (resVal.changed) {
                    console.log("\u3010\u8C03\u8BD5\u3011\u51C6\u5907\u63A8\u5165\u5C5E\u6027\u503C\uFF0Ckey\u662F\uFF1A", key);
                    results.push({
                      id: node.id,
                      compId,
                      compName: CompName,
                      // 🔥 1. 明确标记类型
                      type: groupType,
                      targetType: "PropValue",
                      // 🏷️ 属性值
                      propName: key,
                      oldVal: val,
                      newVal: resVal.val
                    });
                    hasAnyChange = true;
                  }
                  const finalKey = resKey.changed ? resKey.val : key;
                  const finalVal = resVal.changed ? resVal.val : val;
                  newProps.push(`${finalKey}=${finalVal}`);
                });
                if (hasAnyChange) {
                  const fullNewName = newProps.join(", ");
                  for (let k = results.length - 1; k >= 0; k--) {
                    if (results[k].id === node.id) {
                      if (!results[k].fullResult)
                        results[k].fullResult = fullNewName;
                    } else {
                      break;
                    }
                  }
                }
              }
            }
          } catch (e) {
            console.error(e);
          }
        }
        figma.ui.postMessage({ type: "lint-results", data: results });
        break;
      }
      case "fix-variants": {
        const items = msg.items;
        let count = 0;
        for (const item of items) {
          try {
            const node = await figma.getNodeByIdAsync(item.id);
            if (node) {
              node.name = item.fullResult || item.newVal;
              count++;
            }
          } catch (err) {
          }
        }
        figma.notify(`\u2728 \u5DF2\u6210\u529F\u4FEE\u590D ${count} \u9879\u547D\u540D`);
        break;
      }
      case "text-find-matches": {
        const { scope, findText } = msg;
        console.log("\u3010\u540E\u7AEF\u3011\u6536\u5230\u6587\u672C\u67E5\u627E\u8BF7\u6C42:", scope, findText);
        const results = [];
        let searchPool = [];
        if (scope === "selection") {
          searchPool = figma.currentPage.selection;
        } else {
          searchPool = [figma.currentPage];
        }
        if (searchPool.length === 0 && scope === "selection") {
          figma.notify("\u8BF7\u5148\u9009\u62E9\u56FE\u5C42");
          figma.ui.postMessage({ type: "text-find-results", data: [] });
          return;
        }
        const traverse = (node) => {
          if (node.type === "TEXT" && node.visible) {
            const fullText = node.characters;
            const escapedFindText = findText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            const regex = new RegExp(escapedFindText, "gi");
            let match;
            while ((match = regex.exec(fullText)) !== null) {
              results.push({
                id: node.id,
                fullText,
                index: match.index,
                length: match[0].length,
                matchText: match[0]
              });
            }
          }
          if ("children" in node) {
            node.children.forEach(traverse);
          }
        };
        searchPool.forEach(traverse);
        console.log(`\u3010\u540E\u7AEF\u3011\u67E5\u627E\u5B8C\u6210\uFF0C\u627E\u5230 ${results.length} \u9879`);
        figma.ui.postMessage({ type: "text-find-results", data: results });
        if (results.length === 0) {
          figma.notify("\u672A\u627E\u5230\u5339\u914D\u6587\u672C");
        }
        break;
      }
      case "locate-node": {
        try {
          const node = await figma.getNodeByIdAsync(msg.id);
          if (node) {
            figma.currentPage.selection = [node];
            figma.viewport.scrollAndZoomIntoView([node]);
            if (node.type === "TEXT" && typeof msg.index === "number" && typeof msg.length === "number") {
              const cacheKey = `${msg.id}_${msg.index}`;
              const font = node.fontName === figma.mixed ? node.getRangeFontName(0, 1) : node.fontName;
              await figma.loadFontAsync(font);
              if (highlightCache[cacheKey]) {
                const cachedData = highlightCache[cacheKey];
                node.setRangeFills(msg.index, msg.index + cachedData.length, cachedData.fills);
                delete highlightCache[cacheKey];
                figma.notify("\u5DF2\u8FD8\u539F\u989C\u8272");
                figma.ui.postMessage({ type: "highlight-status", key: cacheKey, status: false });
              } else {
                const currentFills = node.getRangeFills(msg.index, msg.index + 1);
                highlightCache[cacheKey] = { fills: currentFills, length: msg.length };
                const highlightPaint = [{ type: "SOLID", color: { r: 1, g: 0, b: 0 } }];
                node.setRangeFills(msg.index, msg.index + msg.length, highlightPaint);
                figma.notify("\u5DF2\u6807\u8BB0 (\u518D\u6B21\u70B9\u51FB\u53EF\u8FD8\u539F)");
                figma.ui.postMessage({ type: "highlight-status", key: cacheKey, status: true });
              }
            }
          } else {
            figma.notify("\u56FE\u5C42\u4E0D\u5B58\u5728 (\u53EF\u80FD\u5DF2\u88AB\u5220\u9664)");
          }
        } catch (e) {
          console.error("\u5B9A\u4F4D\u5931\u8D25:", e);
        }
        break;
      }
      case "text-replace-batch": {
        const { tasks, replaceText } = msg;
        let successCount = 0;
        const processedIds = /* @__PURE__ */ new Set();
        const groups = {};
        tasks.forEach((task) => {
          if (!groups[task.id])
            groups[task.id] = [];
          groups[task.id].push(task);
        });
        for (const nodeId in groups) {
          const node = await figma.getNodeByIdAsync(nodeId);
          if (!node || node.type !== "TEXT")
            continue;
          const groupTasks = groups[nodeId];
          groupTasks.sort((a, b) => b.index - a.index);
          try {
            await figma.loadFontAsync(node.fontName === figma.mixed ? node.getRangeFontName(0, 1) : node.fontName);
            for (const task of groupTasks) {
              const currentStr = node.characters.substring(task.index, task.index + task.length);
              node.deleteCharacters(task.index, task.index + task.length);
              node.insertCharacters(task.index, replaceText);
              successCount++;
              if (task.uid)
                processedIds.add(task.uid);
            }
          } catch (err) {
            console.error(`\u66FF\u6362\u5931\u8D25 ${nodeId}:`, err);
          }
        }
        figma.ui.postMessage({
          type: "text-replace-success",
          count: successCount,
          processedUids: Array.from(processedIds)
        });
        figma.notify(`\u5DF2\u66FF\u6362 ${successCount} \u5904\u6587\u672C`);
        break;
      }
      case "clear-all-highlights": {
        let count = 0;
        for (const key in highlightCache) {
          const [nodeId, indexStr] = key.split("_");
          const index = parseInt(indexStr);
          const data = highlightCache[key];
          try {
            const node = await figma.getNodeByIdAsync(nodeId);
            if (node && node.type === "TEXT") {
              const font = node.fontName === figma.mixed ? node.getRangeFontName(0, 1) : node.fontName;
              await figma.loadFontAsync(font);
              node.setRangeFills(index, index + data.length, data.fills);
              count++;
            }
          } catch (e) {
            console.log("\u8FD8\u539F\u5931\u8D25", e);
          }
        }
        highlightCache = {};
        figma.notify(`\u5DF2\u8FD8\u539F ${count} \u5904\u9AD8\u4EAE`);
        figma.ui.postMessage({ type: "clear-all-highlights-ui" });
        break;
      }
      case "text-replace-batch": {
        const { ids, findText, replaceText } = msg;
        let count = 0;
        for (const id of ids) {
          const node = await figma.getNodeByIdAsync(id);
          if (node && node.type === "TEXT") {
            try {
              await figma.loadFontAsync(node.fontName === figma.mixed ? node.getRangeFontName(0, 1) : node.fontName);
              const regex = new RegExp(findText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
              if (regex.test(node.characters)) {
                node.characters = node.characters.replace(regex, replaceText);
                count++;
              }
            } catch (err) {
              console.error(`\u66FF\u6362\u6587\u672C\u5931\u8D25 (ID: ${id}):`, err);
            }
          }
        }
        figma.notify(`\u5DF2\u66FF\u6362 ${count} \u4E2A\u6587\u672C\u56FE\u5C42`);
        break;
      }
      case "resize-drag":
      case "resize-window":
        figma.ui.resize(msg.width, msg.height);
        break;
    }
  };
  function getSlides() {
    const selection = figma.currentPage.selection;
    const uniqueMap = /* @__PURE__ */ new Map();
    for (const node of selection) {
      if (node.type === "FRAME") {
        uniqueMap.set(node.id, node);
      }
    }
    const frames = Array.from(uniqueMap.values());
    const finalSlides = frames.filter((node) => {
      let parent = node.parent;
      while (parent && parent.type !== "PAGE" && parent.type !== "DOCUMENT") {
        if (uniqueMap.has(parent.id))
          return false;
        parent = parent.parent;
      }
      return true;
    });
    return finalSlides;
  }
  async function pptStep1_Init(slides) {
    for (const slide of slides) {
      let loopCount = 0;
      let instances = slide.findAll((n) => n.type === "INSTANCE");
      while (instances.length > 0) {
        loopCount++;
        if (loopCount > 5e3) {
          console.warn("\u89E3\u7ED1\u5C42\u7EA7\u8FC7\u6DF1\uFF0C\u5F3A\u5236\u8DF3\u51FA");
          break;
        }
        const target = instances[0];
        try {
          target.detachInstance();
        } catch (e) {
          console.warn("\u89E3\u7ED1\u5355\u4E2A\u8282\u70B9\u5931\u8D25:", e);
        }
        instances = slide.findAll((n) => n.type === "INSTANCE");
      }
    }
    const traverse = (node) => {
      if (node.removed)
        return;
      if (node.name.toLowerCase().startsWith("p_img")) {
        return;
      }
      if ("locked" in node && node.locked) {
        node.locked = false;
      }
      if ("visible" in node && !node.visible) {
        node.remove();
        return;
      }
      if (node.type === "FRAME" && node.layoutMode !== "NONE") {
        node.layoutMode = "NONE";
      }
      if ("children" in node) {
        [...node.children].forEach((child) => traverse(child));
      }
    };
    slides.forEach((slide) => traverse(slide));
    figma.ui.postMessage({ type: "step-done", step: 1 });
  }
  async function pptStep2_Rasterize(slides) {
    let count = 0;
    const generateHexId = () => "p_" + Math.random().toString(16).substring(2, 8);
    const isLineLike = (node) => {
      if (node.type === "LINE")
        return true;
      if (node.type === "VECTOR") {
        if (node.width < 2 || node.height < 2)
          return true;
        const ratio = node.width / node.height;
        if (ratio > 50 || ratio < 0.02)
          return true;
      }
      return false;
    };
    const traverse = async (node) => {
      var _a;
      if (node.removed || !node.visible)
        return;
      const name = node.name.toLowerCase();
      const isUserTarget = name.startsWith("p_img");
      let isTechTarget = false;
      if ("effects" in node && node.effects.some((e) => e.type === "LAYER_BLUR" && e.visible))
        isTechTarget = true;
      else if (node.type === "BOOLEAN_OPERATION")
        isTechTarget = true;
      else if (node.type === "VECTOR" && !isLineLike(node))
        isTechTarget = true;
      else if (node.type === "ELLIPSE" && "fills" in node && node.fills.some((p) => p.type === "IMAGE"))
        isTechTarget = true;
      if (isUserTarget || isTechTarget) {
        try {
          const bytes = await node.exportAsync({ format: "PNG", constraint: { type: "SCALE", value: 3 } });
          const image = figma.createImage(bytes);
          const rect = figma.createRectangle();
          rect.x = node.x;
          rect.y = node.y;
          rect.resize(node.width, node.height);
          rect.name = generateHexId();
          rect.fills = [{ type: "IMAGE", scaleMode: "FIT", imageHash: image.hash }];
          rect.rotation = node.rotation;
          (_a = node.parent) == null ? void 0 : _a.insertChild(node.parent.children.indexOf(node), rect);
          node.remove();
          count++;
          return;
        } catch (e) {
        }
      }
      if ("children" in node) {
        const children = [...node.children];
        for (const child of children)
          await traverse(child);
      }
    };
    for (const slide of slides)
      await traverse(slide);
    figma.ui.postMessage({ type: "step-done", step: 2 });
  }
  async function pptStep3_Flatten(slides) {
    for (const slide of slides) {
      let hasNested = true;
      let loopCount = 0;
      while (hasNested) {
        hasNested = false;
        loopCount++;
        if (loopCount % 100 === 0) {
          await new Promise((r) => setTimeout(r, 20));
        }
        const children = slide.children;
        for (let i = children.length - 1; i >= 0; i--) {
          const node = children[i];
          if (node.type !== "GROUP" && node.type !== "FRAME" && isNodeInvisible(node)) {
            node.remove();
            continue;
          }
          if (node.type === "GROUP") {
            figma.ungroup(node);
            hasNested = true;
          } else if (node.type === "FRAME") {
            try {
              if (!isNodeInvisible(node)) {
                const rect = figma.createRectangle();
                rect.x = node.x;
                rect.y = node.y;
                rect.resize(node.width, node.height);
                if (node.fills !== figma.mixed)
                  rect.fills = node.fills;
                if (node.strokes !== figma.mixed)
                  rect.strokes = node.strokes;
                if (node.strokeWeight !== figma.mixed)
                  rect.strokeWeight = node.strokeWeight;
                else
                  rect.strokeWeight = 0;
                if (node.cornerRadius !== figma.mixed)
                  rect.cornerRadius = node.cornerRadius;
                else
                  rect.cornerRadius = 0;
                if (node.effects !== figma.mixed)
                  rect.effects = node.effects;
                rect.opacity = node.opacity;
                rect.rotation = node.rotation;
                node.parent.insertChild(i, rect);
              }
              if (node.children.length > 0) {
                figma.ungroup(node);
                hasNested = true;
              } else {
                node.remove();
              }
            } catch (err) {
              console.error("Layer flatten error:", err);
              if (node.children.length > 0) {
                figma.ungroup(node);
                hasNested = true;
              } else {
                node.remove();
              }
            }
          }
        }
      }
      for (const node of slide.children) {
        if (node.type === "TEXT" && node.visible) {
          try {
            const font = node.fontName;
            if (font !== figma.mixed) {
              await figma.loadFontAsync(font);
              node.textAutoResize = "HEIGHT";
              node.resize(node.width + 10, node.height);
            }
          } catch (e) {
          }
        }
      }
    }
    figma.ui.postMessage({ type: "step-done", step: 3 });
  }
  async function pptStep4_Extract(slides) {
    const rgbToHex = (color) => {
      const toHex = (v) => {
        const hex = Math.round(v * 255).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      };
      return toHex(color.r) + toHex(color.g) + toHex(color.b);
    };
    figma.ui.postMessage({ type: "ppt-init-total", count: slides.length });
    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i];
      await new Promise((r) => setTimeout(r, 50));
      const slideAbs = slide.absoluteBoundingBox;
      const slideX = slideAbs ? slideAbs.x : slide.x;
      const slideY = slideAbs ? slideAbs.y : slide.y;
      figma.ui.postMessage({
        type: "ppt-start-slide",
        index: i,
        width: slide.width,
        height: slide.height
      });
      let chunkBuffer = [];
      const children = slide.children;
      for (let j = 0; j < children.length; j++) {
        const node = children[j];
        if (!node.visible)
          continue;
        const nodeAbs = node.absoluteBoundingBox;
        if (!nodeAbs)
          continue;
        const centerX = nodeAbs.x + nodeAbs.width / 2 - slideX;
        const centerY = nodeAbs.y + nodeAbs.height / 2 - slideY;
        const el = {
          cx: centerX,
          cy: centerY,
          w: node.width,
          h: node.height,
          rotation: node.rotation
        };
        if ("opacity" in node)
          el.opacity = node.opacity;
        if ("cornerRadius" in node && node.cornerRadius !== figma.mixed)
          el.cornerRadius = node.cornerRadius;
        try {
          if ("strokes" in node && node.strokes !== figma.mixed && node.strokes.length > 0) {
            const stroke = node.strokes.find((s) => s.type === "SOLID" && s.visible !== false && s.opacity > 0);
            if (stroke) {
              el.strokeColor = rgbToHex(stroke.color);
              el.strokeWeight = node.strokeWeight;
              el.strokeAlpha = (el.opacity || 1) * stroke.opacity;
            }
          }
          if ("effects" in node && node.effects.length > 0) {
            const shadow = node.effects.find((e) => e.type === "DROP_SHADOW" && e.visible);
            if (shadow) {
              el.shadow = {
                color: rgbToHex(shadow.color),
                opacity: shadow.color.a,
                blur: shadow.radius,
                x: shadow.offset.x,
                y: shadow.offset.y
              };
            }
          }
          let visibleFill = null;
          if ("fills" in node && node.fills !== figma.mixed && node.fills.length > 0) {
            visibleFill = node.fills.find((f) => f.type === "SOLID" && f.visible !== false && f.opacity > 0);
          }
          if (visibleFill) {
            el.color = rgbToHex(visibleFill.color);
            el.fillAlpha = (el.opacity || 1) * visibleFill.opacity;
          } else {
            el.color = null;
            el.fillAlpha = 0;
          }
          const isLineLike = node.type === "LINE" || node.type === "CONNECTOR";
          if (isLineLike) {
            el.type = "line";
            if ("dashPattern" in node && node.dashPattern.length > 0)
              el.dashPattern = node.dashPattern;
            const arrowCaps = ["ARROW_LINES", "ARROW_EQUILATERAL", "TRIANGLE_FILLED", "TRIANGLE_WIRED", "DIAMOND_FILLED", "CIRCLE_FILLED"];
            if ("lineStartCap" in node && arrowCaps.includes(node.lineStartCap))
              el.headArrow = "triangle";
            if ("lineEndCap" in node && arrowCaps.includes(node.lineEndCap))
              el.tailArrow = "triangle";
            if (!el.strokeColor)
              continue;
            chunkBuffer.push(el);
          } else if (node.type === "TEXT") {
            el.type = "text";
            el.text = node.characters.substring(0, 2e3);
            let baseSize = 12;
            if (node.fontSize !== figma.mixed) {
              baseSize = node.fontSize;
            } else {
              const firstCharFont = node.getRangeFontSize(0, 1);
              if (firstCharFont && firstCharFont !== figma.mixed)
                baseSize = firstCharFont;
            }
            el.fontSize = baseSize;
            let lh = node.lineHeight;
            if (lh === figma.mixed) {
              lh = node.getRangeLineHeight(0, 1);
            }
            if (!lh || lh === figma.mixed) {
              lh = { unit: "AUTO" };
            }
            let finalPx = baseSize * 1.3;
            if (lh.unit === "PIXELS") {
              finalPx = lh.value;
            } else if (lh.unit === "PERCENT") {
              finalPx = baseSize * (lh.value / 100);
            }
            el.lineHeightPx = finalPx;
            if (node.fontName !== figma.mixed) {
              el.fontFace = node.fontName.family;
              const style = node.fontName.style.toLowerCase();
              if (/bold|heavy|black|strong/.test(style))
                el.isBold = true;
            }
            let isMultiLine = node.characters.includes("\n");
            if (!isMultiLine && node.fontSize !== figma.mixed) {
              if (node.height > node.fontSize * 1.5)
                isMultiLine = true;
            }
            el.isMultiLine = isMultiLine;
            if (node.textAlignHorizontal === "CENTER")
              el.align = "center";
            else if (node.textAlignHorizontal === "RIGHT")
              el.align = "right";
            else if (node.textAlignHorizontal === "JUSTIFIED")
              el.align = "justify";
            else
              el.align = "left";
            if (node.textAlignVertical === "CENTER")
              el.vAlignFigma = "middle";
            else if (node.textAlignVertical === "BOTTOM")
              el.vAlignFigma = "bottom";
            else
              el.vAlignFigma = "top";
            if (!visibleFill)
              el.fillAlpha = el.opacity || 1;
            chunkBuffer.push(el);
          } else if (node.type === "RECTANGLE" && node.fills !== figma.mixed && node.fills.length > 0 && node.fills.some((p) => p.type === "IMAGE" && p.visible !== false)) {
            el.type = "placeholder";
            el.imageName = node.name;
            el.fillAlpha = el.opacity || 1;
            chunkBuffer.push(el);
          } else if (node.type === "RECTANGLE" || node.type === "ELLIPSE" || node.type === "VECTOR" || node.type === "STAR" || node.type === "POLYGON" || node.type === "BOOLEAN_OPERATION") {
            el.type = "shape";
            el.pptShape = "rect";
            if (node.type === "ELLIPSE")
              el.pptShape = "ellipse";
            else if (node.type === "STAR") {
              const c = node.pointCount;
              if (c >= 4 && c <= 32)
                el.pptShape = "star" + c;
              else
                el.pptShape = "star5";
            } else if (node.type === "POLYGON") {
              const c = node.pointCount;
              if (c === 3)
                el.pptShape = "triangle";
              else if (c === 5)
                el.pptShape = "pentagon";
              else if (c === 6)
                el.pptShape = "hexagon";
              else if (c === 8)
                el.pptShape = "octagon";
            }
            if (!el.color && !el.strokeColor)
              continue;
            chunkBuffer.push(el);
          }
          if (chunkBuffer.length >= 200) {
            figma.ui.postMessage({ type: "ppt-element-batch", data: chunkBuffer });
            chunkBuffer = [];
            await new Promise((r) => setTimeout(r, 15));
          }
        } catch (err) {
        }
      }
      if (chunkBuffer.length > 0) {
        figma.ui.postMessage({ type: "ppt-element-batch", data: chunkBuffer });
      }
      figma.ui.postMessage({ type: "ppt-end-slide" });
    }
    figma.ui.postMessage({ type: "step-done", step: 4, data: { done: true } });
  }
  async function pptStep5_ExportImages(slides) {
    figma.ui.postMessage({ type: "ppt-asset-start", totalSlides: slides.length });
    let imgCount = 0;
    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i];
      const children = slide.children;
      for (let j = 0; j < children.length; j++) {
        const node = children[j];
        if (!node.visible)
          continue;
        let isTarget = false;
        if ("effects" in node && node.effects.some((e) => e.type === "LAYER_BLUR" && e.visible))
          isTarget = true;
        if (!isTarget && node.type === "RECTANGLE" && node.fills !== figma.mixed && node.fills.some((p) => p.type === "IMAGE"))
          isTarget = true;
        if (isTarget) {
          await new Promise((r) => setTimeout(r, 50));
          try {
            const bytes = await node.exportAsync({ format: "PNG", constraint: { type: "SCALE", value: 1.5 } });
            const fileName = `${node.name}.png`;
            figma.ui.postMessage({ type: "ppt-asset-chunk", fileName, data: bytes });
            imgCount++;
          } catch (e) {
            console.error(e);
          }
        }
      }
    }
    figma.ui.postMessage({ type: "step-done", step: 5, data: { count: imgCount } });
  }
  function isNodeInvisible(node) {
    if ("visible" in node && !node.visible)
      return true;
    if ("opacity" in node && node.opacity === 0)
      return true;
    if (node.type === "TEXT" && node.characters.trim().length === 0)
      return true;
    if ("fills" in node && "strokes" in node) {
      const hasFill = node.fills !== figma.mixed && node.fills.length > 0 && node.fills.some((p) => p.visible !== false && p.opacity > 0);
      const hasStroke = node.strokes !== figma.mixed && node.strokes.length > 0 && node.strokeWeight > 0 && node.strokes.some((p) => p.visible !== false && p.opacity > 0);
      if (!hasFill && !hasStroke)
        return true;
    }
    return false;
  }
  function sortNodesByVisualPosition(nodes) {
    return nodes.sort((a, b) => {
      const aAbs = a.absoluteBoundingBox || { x: a.x, y: a.y };
      const bAbs = b.absoluteBoundingBox || { x: b.x, y: b.y };
      if (Math.abs(aAbs.y - bAbs.y) > 50) {
        return aAbs.y - bAbs.y;
      }
      return aAbs.x - bAbs.x;
    });
  }
})();
