/* Upaon-Açu V14 — pixel presentation layer.
   Runtime remains dependency-free: HTML/CSS/JS in the browser.
   TypeScript/JSON/SVG sources in src/data/assets document the extensible architecture. */
(()=>{
  const $=id=>document.getElementById(id);
  const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
  const board=()=>$('mapBoard');
  let raf=0;

  function ensurePixelLayer(){
    const b=board(); if(!b)return null;
    let c=$('mapPixelLayer');
    if(!c){
      c=document.createElement('canvas'); c.id='mapPixelLayer'; c.className='map-pixel-layer';
      c.setAttribute('aria-hidden','true'); b.appendChild(c);
    }
    const dpr=Math.min(2,window.devicePixelRatio||1), r=b.getBoundingClientRect();
    c.width=Math.max(1,Math.floor(r.width*dpr)); c.height=Math.max(1,Math.floor(r.height*dpr));
    c.style.width=r.width+'px'; c.style.height=r.height+'px';
    return {c,dpr,w:r.width,h:r.height};
  }

  function drawPixelMap(){
    const o=ensurePixelLayer(); if(!o)return;
    const {c,dpr,w,h}=o,ctx=c.getContext('2d'); ctx.setTransform(dpr,0,0,dpr,0,0); ctx.clearRect(0,0,w,h);
    // subtle pixel grid
    ctx.globalAlpha=.18; ctx.strokeStyle='#d7b45e'; ctx.lineWidth=1;
    for(let x=16;x<w;x+=16){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke()}
    for(let y=16;y<h;y+=16){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke()}
    ctx.globalAlpha=1;
    // compass-like corner ornaments
    [[20,24],[w-20,24],[20,h-24],[w-20,h-24]].forEach(([x,y])=>{
      ctx.fillStyle='#e6c56e';ctx.fillRect(x-3,y-1,7,2);ctx.fillRect(x-1,y-3,2,7);
    });
    // route glints, positioned relative to board rather than fixed pixels
    const routes=[[[.31,.57],[.48,.42]],[[.31,.57],[.56,.60]],[[.31,.57],[.72,.34]],[[.48,.42],[.72,.34]]];
    routes.forEach((r,i)=>{
      const [a,z]=r.map(([x,y])=>[x*w,y*h]);
      ctx.save();ctx.setLineDash([7,8]);ctx.strokeStyle=i===0?'#f2cf70':'#9fd1ad';ctx.globalAlpha=.42;ctx.lineWidth=1.5;
      ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.quadraticCurveTo((a[0]+z[0])/2,(a[1]+z[1])/2-18,z[0],z[1]);ctx.stroke();ctx.restore();
    });
    // animated pixel ships
    const t=performance.now()/1000;
    [[.42,.50,0],[.57,.49,1],[.68,.57,2]].forEach(([x,y,k])=>{
      const px=(x*w+Math.sin(t*.7+k)*7), py=(y*h+Math.cos(t*.55+k)*4);
      ctx.fillStyle='#f2d17a';ctx.fillRect(Math.round(px),Math.round(py),7,3);ctx.fillRect(Math.round(px+2),Math.round(py-3),3,3);ctx.fillRect(Math.round(px+7),Math.round(py+2),3,2);
    });
    raf=requestAnimationFrame(drawPixelMap);
  }

  function addPixelBadges(){
    document.querySelectorAll('.map-node.world').forEach((node,i)=>{
      if(node.querySelector('.v14-node-pixel'))return;
      const b=document.createElement('i'); b.className='v14-node-pixel'; b.textContent=['◆','●','▲','✦'][i%4]; b.setAttribute('aria-hidden','true'); node.prepend(b);
    });
  }

  function upgradeMapHeader(){
    const b=board(); if(!b)return;
    if(!b.querySelector('.v14-map-stamp')){
      const x=document.createElement('div');x.className='v14-map-stamp';x.innerHTML='<b>ATLAS MUNDI</b><span>ED. XIV • CARTA ESTRATÉGICA</span>';b.appendChild(x);
    }
  }

  function addSystemRibbon(){
    const main=document.querySelector('main'); if(!main||main.querySelector('.v14-ribbon'))return;
    const r=document.createElement('div');r.className='v14-ribbon';
    r.innerHTML='<span>✦ V14</span><b>ERA • POVO • TECNOLOGIA • GEOPOLÍTICA</b><small>Motor modular • Pixel Atlas • 5 AP</small>';
    main.prepend(r);
  }

  function responsiveDensity(){
    const root=document.documentElement;
    const w=window.innerWidth;
    root.style.setProperty('--v14-ui-scale', w<600?'.88':w<900?'.95':w<1300?'1':'1.04');
    document.body.dataset.v14Device=w<600?'mobile':w<1050?'tablet':'desktop';
  }

  function boot(){
    responsiveDensity(); addSystemRibbon(); upgradeMapHeader(); addPixelBadges(); drawPixelMap();
  }
  window.addEventListener('resize',()=>{responsiveDensity();clearTimeout(window.__v14r);window.__v14r=setTimeout(()=>{upgradeMapHeader();addPixelBadges();},120)});
  window.addEventListener('beforeunload',()=>cancelAnimationFrame(raf));
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
