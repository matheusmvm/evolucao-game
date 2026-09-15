/* Upaon-Açu V15 — camada Deluxe: economia viva, painel histórico e pixel-art. */
(()=>{
  const G=window.UPAON_GAME;
  if(!G)return;
  const $=id=>document.getElementById(id);
  const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
  const fmt=n=>new Intl.NumberFormat('pt-BR',{maximumFractionDigits:0}).format(Math.max(0,n));
  const money=n=>'¤ '+new Intl.NumberFormat('pt-BR',{maximumFractionDigits:0}).format(Math.max(0,n));
  const oldRender=G.render;
  const V15KEY='upaon-acu-v15';
  const peopleIndex={upaonense:0,tupinamba:1,guarani:2,marajoara:3,macroje:4,guaicuru:5,africano:6,sahel:7,swahili:8,iberico:9,franca:10,inglesa:11,holandesa:12,norteamericano:13,asteca:14,maia:15,inca:16,caribenho:17,indico:18,sinico:19,japonesa:20,persa:21,polinesia:22,melanesia:23,australiano:24,custom:25};
  const resourceNames={food:'Alimentos',wood:'Madeira',iron:'Ferro',machines:'Máquinas',energyStock:'Energia'};
  const productFor=(id)=>({food:'Alimentos',wood:'Madeira',iron:'Metais',machines:'Manufaturas',energyStock:'Energia'}[id]||id);

  function ensure(){
    const S=G.getState();
    if(!S)return;
    S.v15=S.v15||{};
    const v=S.v15;
    v.market=v.market&&typeof v.market==='object'?v.market:{};
    v.market.prices=Object.assign({food:1,wood:1,iron:1,machines:4,energyStock:2},v.market.prices||{});
    v.market.flow=Object.assign({food:0,wood:0,iron:0,machines:0,energyStock:0,treasury:0},v.market.flow||{});
    v.market.shortages=Array.isArray(v.market.shortages)?v.market.shortages:[];
    v.market.surplus=Array.isArray(v.market.surplus)?v.market.surplus:[];
    v.market.history=Array.isArray(v.market.history)?v.market.history:[];
    v.geopolitics=Array.isArray(v.geopolitics)?v.geopolitics:[];
    v.lastYear=Number.isFinite(+v.lastYear)?+v.lastYear:null;
    v.season=v.season||'Tempo das chuvas';
    v.council=v.council||'Equilíbrio';
    v.integrity=Number.isFinite(+v.integrity)?+v.integrity:100;
    v.infrastructureLoad=Number.isFinite(+v.infrastructureLoad)?+v.infrastructureLoad:0;
    return S;
  }

  function calcMarket(S){
    const m=S.v15.market, em=S.economyModel||{};
    const stocks={food:S.food,wood:S.wood,iron:S.iron,machines:S.machines,energyStock:S.energyStock};
    const ideal={food:Math.max(25,S.population/450),wood:Math.max(20,S.industry*2),iron:Math.max(10,S.industry*1.2),machines:Math.max(3,S.industry/8),energyStock:Math.max(15,S.industry*1.5)};
    const base={food:1,wood:1,iron:1,machines:4,energyStock:2};
    const shortages=[],surplus=[];
    for(const k of Object.keys(base)){
      const ratio=stocks[k]/Math.max(ideal[k],1);
      const scarcity=clamp(1-ratio,-.6,.9);
      const volatility=k==='energyStock'?1.25:k==='iron'?1.15:1;
      m.prices[k]=clamp(base[k]*(1+scarcity*.75*volatility),base[k]*.55,base[k]*3.8);
      if(ratio<.65)shortages.push(productFor(k));
      if(ratio>1.5)surplus.push(productFor(k));
    }
    m.shortages=shortages;m.surplus=surplus;
    const core=S.economyModel?.lastFlow||{};
    for(const k of Object.keys(base))m.flow[k]=Number(core[k]||0);
    m.flow.treasury=Number(core.treasury||0);
    m.index=clamp(100+(shortages.length*8)-(surplus.length*4)+(S.economy-50)*.35,45,180);
    m.history.push({year:S.year,prices:{...m.prices},index:m.index,shortages:[...shortages],surplus:[...surplus]});
    m.history=m.history.slice(-18);
  }

  function seasonalEffect(S){
    const seasonNames=['Tempo das chuvas','Tempo de transição','Tempo seco','Tempo de transição'];
    const idx=(S.year+S.round)%4;S.v15.season=seasonNames[idx];
    let food=1,wood=1;
    if(idx===0){food=1.08;wood=1.03;} if(idx===2){food=.94;wood=.98;}
    return {food,wood};
  }

  function annualV15(){
    const S=ensure(); if(!S)return;
    if(S.v15.lastYear===S.year)return;
    const season=seasonalEffect(S), m=S.v15.market;
    // Não substitui a economia existente: acrescenta fricções e oportunidades pequenas.
    const popFactor=Math.max(.25,Math.min(2,S.population/30000));
    const consumptionFood=Math.max(1,popFactor*.9);
    S.food=Math.max(0,S.food-consumptionFood*(season.food<1?1.04:.96));
    const industrialLoad=(S.industry*.025+S.infrastructure*.012+S.military*.008);
    S.wood=Math.max(0,S.wood-industrialLoad*.35);
    S.iron=Math.max(0,S.iron-S.industry*.012);
    S.energyStock=Math.max(0,S.energyStock-Math.max(0,S.industry*.018));
    calcMarket(S);
    const tradeIncome=Object.values(S.tradeRoutes||{}).reduce((a,r)=>a+Math.max(0,Number(r.profit)||0),0);
    const pricePressure=m.index>125?-0.7:m.index<85?.45:0;
    S.treasury=Math.max(0,S.treasury+tradeIncome*.08+pricePressure);
    S.economy=clamp(S.economy+(tradeIncome*.015)+((m.surplus.length-m.shortages.length)*.12));
    if(m.shortages.length){S.stability=clamp(S.stability-.18*m.shortages.length);S.health=clamp(S.health-.08*m.shortages.length);}
    if(m.surplus.length){S.stability=clamp(S.stability+.08*m.surplus.length);}
    S.v15.infrastructureLoad=clamp((S.industry*.7+S.urban*.35)/(Math.max(10,S.infrastructure)),0,180);
    if(S.v15.infrastructureLoad>100)S.infrastructure=clamp(S.infrastructure-.08);
    // Pulso geopolítico pequeno e determinístico o bastante para não gerar spam.
    const entries=Object.entries(S.nations||{});
    if(entries.length){
      const hot=entries.filter(([id,n])=>Number(n.tension)>65 && S.warStatus?.[id]!=='war');
      if(hot.length && S.year%3===0){const [id,n]=hot[(S.year+S.round)%hot.length];S.v15.geopolitics.push({year:S.year,text:`${n.name} tornou-se um foco de tensão no equilíbrio internacional.`});S.history.push({year:S.year,text:`Pulso geopolítico: tensão elevada com ${n.name}.`});}
    }
    S.v15.lastYear=S.year;
  }

  function injectPanel(){
    const page=$('estado');if(!page||page.querySelector('#v15Deck'))return;
    const title=page.querySelector('.page-title');
    const wrap=document.createElement('section');wrap.id='v15Deck';wrap.className='v15-deck';
    wrap.innerHTML=`
      <div class="v15-deck-head"><div><span class="eyebrow">SALA DO CONSELHO • V15 DELUXE</span><h3>Economia viva & panorama histórico</h3><p>Produção, consumo, mercado, infraestrutura e pulsos geopolíticos agora se refletem em pequenos ciclos anuais.</p></div><div class="v15-season" id="v15Season">—</div></div>
      <div class="v15-grid">
        <article class="v15-card"><div class="v15-card-title">⚖️ Mercado interno</div><div id="v15Market"></div></article>
        <article class="v15-card"><div class="v15-card-title">📦 Fluxo anual</div><div id="v15Flow"></div></article>
        <article class="v15-card"><div class="v15-card-title">🌐 Pulso geopolítico</div><div id="v15Geo"></div></article>
      </div>
      <div class="v15-quick"><button data-v15="reserve">📦 Reserva estratégica <small>1 AP</small></button><button data-v15="fair">🏪 Feira local <small>1 AP</small></button><button data-v15="roads">🛣️ Manutenção logística <small>1 AP</small></button><span id="v15ActionHint">Decisões rápidas complementam as ações principais.</span></div>`;
    if(title)title.insertAdjacentElement('afterend',wrap);else page.prepend(wrap);
    wrap.querySelectorAll('[data-v15]').forEach(b=>b.addEventListener('click',()=>quickAction(b.dataset.v15)));
  }

  function quickAction(kind){
    const S=ensure();if(!S)return;
    if(S.actionsLeft<1)return toast('Sem AP para esta decisão.');
    if(kind==='reserve'){
      if(S.treasury<8)return toast('Tesouro insuficiente para a reserva.');
      S.actionsLeft--;S.treasury-=8;S.food+=12;S.wood+=5;S.stability=clamp(S.stability+1);S.history.push({year:S.year,text:'O conselho criou uma reserva estratégica de alimentos e madeira.'});
    } else if(kind==='fair'){
      if(S.treasury<4)return toast('Tesouro insuficiente para a feira.');
      S.actionsLeft--;S.treasury-=4;S.trade=clamp(S.trade+4);S.economy=clamp(S.economy+1);S.treasury+=Math.round(6*(S.v15.market?.prices?.food||1));S.history.push({year:S.year,text:'Uma feira regional ampliou a circulação de bens e o comércio interno.'});
    } else if(kind==='roads'){
      if(S.wood<5)return toast('Madeira insuficiente para manutenção logística.');
      S.actionsLeft--;S.wood-=5;S.infrastructure=clamp(S.infrastructure+2);S.economy=clamp(S.economy+.8);S.history.push({year:S.year,text:'Manutenção das vias reduziu perdas de transporte e melhorou a integração dos mercados.'});
    }
    G.render();
  }

  function idealFor(S,k){return {food:Math.max(25,S.population/450),wood:Math.max(20,S.industry*2),iron:Math.max(10,S.industry*1.2),machines:Math.max(3,S.industry/8),energyStock:Math.max(15,S.industry*1.5)}[k]||30;}

  function renderDeck(){
    const S=ensure();if(!S)return;injectPanel();
    const m=S.v15.market||{};
    const season=$('v15Season');if(season)season.textContent=`${S.v15.season} • Índice ${Math.round(m.index||100)}`;
    const market=$('v15Market');
    if(market)market.innerHTML=Object.keys(resourceNames).map(k=>`<div class="v15-market-row"><span>${resourceNames[k]}</span><b>${money(m.prices?.[k]||1)}</b><i class="v15-mini-bar"><em style="width:${clamp((Number(S[k]||0)/Math.max(1,idealFor(S,k)))*100,4,100)}%"></em></i></div>`).join('')+`<div class="v15-tags">${(m.shortages||[]).map(x=>`<span class="bad">⚠ ${x}</span>`).join('')}${(m.surplus||[]).map(x=>`<span class="good">◆ ${x}</span>`).join('')||'<span class="muted">Mercado equilibrado</span>'}</div>`;
    const flow=$('v15Flow');
    if(flow)flow.innerHTML=Object.keys(resourceNames).map(k=>{const v=Number(m.flow?.[k]||0);return `<div class="v15-flow-row"><span>${resourceNames[k]}</span><b class="${v<0?'neg':'pos'}">${v>=0?'+':''}${v.toFixed(1)}</b></div>`}).join('')+`<div class="v15-flow-row total"><span>Tesouro</span><b class="${Number(m.flow?.treasury||0)<0?'neg':'pos'}">${money(m.flow?.treasury||0)}</b></div><small class="muted">Carga da infraestrutura: ${Math.round(S.v15.infrastructureLoad||0)}%</small>`;
    const geo=$('v15Geo');
    if(geo)geo.innerHTML=(S.v15.geopolitics||[]).slice(-4).reverse().map(x=>`<div class="v15-geo-row"><span>${x.year}</span><p>${x.text}</p></div>`).join('')||'<span class="muted">Nenhum novo foco de tensão registrado.</span>';
    renderPortrait(S);
  }

  function renderPortrait(S){
    const bar=$('identityBar');if(!bar)return;
    let p=bar.querySelector('.v15-portrait');
    if(!p){p=document.createElement('div');p.className='v15-portrait';bar.prepend(p);}
    const idx=peopleIndex[S.startPeopleId]??25;p.style.setProperty('--portrait-x',`${-(idx%8)*100}%`);p.style.setProperty('--portrait-y',`${-Math.floor(idx/8)*100}%`);p.title=S.startPeople||'Civilização';
  }

  function toast(t){const x=$('toast');if(!x)return;x.textContent=t;x.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>x.classList.remove('show'),2300)}

  // Migração leve de versões e atualização anual sem tocar no núcleo anterior.
  const originalLoad=$('loadBtn')?.onclick;
  document.addEventListener('click',e=>{
    const b=e.target.closest('#nextRound,#freeRound');if(!b)return;
    const before=G.getState()?.year;
    setTimeout(()=>{const S=G.getState();if(S&&S.year!==before){annualV15();G.render();}},80);
  },true);
  document.addEventListener('click',e=>{if(e.target.closest('#loadBtn'))setTimeout(()=>{const S=ensure();if(S){S.v15=S.v15||{};G.render();}},100)},true);
  document.addEventListener('click',e=>{if(e.target.closest('#saveBtn')){const S=ensure();if(S){S.v15.savedAt=S.year;}}},true);

  // Render V15 sem substituir o render principal.
  G.render=function(){const S=ensure();if(S&&S.v15.lastYear===null)calcMarket(S);oldRender();renderDeck();};
  const S=ensure();if(S){if(S.v15.lastYear===null)calcMarket(S);}
  G.render();
  window.UPAON_V15={version:'15.0',market:()=>G.getState()?.v15?.market||null};
})();
