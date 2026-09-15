(() => {
"use strict";
const KEY="upaon-acu-v3";
const clamp=(n,a=0,b=100)=>Math.max(a,Math.min(b,Number(n)||0));
const fmt=n=>new Intl.NumberFormat("pt-BR",{maximumFractionDigits:0}).format(Math.max(0,n));
const money=n=>"¤ "+new Intl.NumberFormat("pt-BR",{maximumFractionDigits:0}).format(Math.max(0,n));

const initial={
 year:1460,round:1,actionsLeft:3,selectedActions:[],population:18000,urban:7,territory:1,stability:72,
 economy:38,science:8,industry:12,technology:5,military:7,diplomacy:18,education:9,health:8,energy:3,
 infrastructure:8,readiness:18,treasury:120,food:100,iron:22,wood:70,machines:4,energyStock:15,trade:20,
 lastReport:null,lastGlobal:null,censuses:[],history:[{year:1460,text:"Fundação e centralização de Upaon-Açu."}],
 tech:{mecanica:0,quimica:0,medicina:0,microbiologia:0,eletricidade:0,automacao:0,controle:0,naval:0,submersiveis:0,aeronautica:0,aerodinamica:0,navegacao:0,computacao:0,programacao:0,dados:0,semfio:0,sistemas:0,industria:0},
 workforce:{agro:48,pesca:12,construcao:8,minera:4,manufatura:15,industria:3,navegacao:3,servicos:4,ciencia:1,outros:2},
 cities:{saoLuis:{name:"São Luís",pop:12000,industry:8,infra:14,science:8,port:20,education:10,health:8}},
 nations:{
  portugal:{name:"Portugal",flag:"🇵🇹",military:28,economy:48,science:42,stability:68,attitude:18,trade:18,tension:15},
  espanha:{name:"Espanha",flag:"🇪🇸",military:32,economy:52,science:40,stability:64,attitude:12,trade:10,tension:20},
  franca:{name:"França",flag:"🇫🇷",military:36,economy:55,science:58,stability:65,attitude:24,trade:12,tension:8},
  holanda:{name:"Holanda",flag:"🇳🇱",military:25,economy:60,science:50,stability:70,attitude:22,trade:20,tension:10},
  inglaterra:{name:"Inglaterra",flag:"🇬🇧",military:42,economy:64,science:55,stability:67,attitude:18,trade:15,tension:12},
  china:{name:"China",flag:"🇨🇳",military:44,economy:70,science:48,stability:72,attitude:10,trade:5,tension:3},
  india:{name:"Índia",flag:"🇮🇳",military:30,economy:58,science:52,stability:62,attitude:14,trade:8,tension:4},
  magrebe:{name:"Magrebe",flag:"🌍",military:24,economy:38,science:35,stability:60,attitude:26,trade:11,tension:5}
 },
 diplomacy:{
  portugal:{name:"Portugal",trust:20,trade:18,tension:15,science:3},espanha:{name:"Espanha",trust:15,trade:10,tension:20,science:2},
  franca:{name:"França",trust:24,trade:12,tension:8,science:5},holanda:{name:"Holanda",trust:22,trade:20,tension:10,science:5},
  inglaterra:{name:"Inglaterra",trust:18,trade:15,tension:12,science:4},china:{name:"China",trust:10,trade:5,tension:3,science:4},
  india:{name:"Índia",trust:12,trade:8,tension:4,science:3},magrebe:{name:"Magrebe",trust:26,trade:11,tension:5,science:3}
 }
};

let S=structuredClone(initial);
const actions=[
{id:"admin",icon:"🏛️",cat:"Estado",name:"Reforma administrativa",desc:"Fortalece governança e infraestrutura pública.",cost:"Tesouro − 8",apply(){S.stability+=5;S.infrastructure+=2;S.treasury-=8}},
{id:"edu",icon:"🎓",cat:"Educação",name:"Expandir educação",desc:"Forma professores, técnicos e futuros pesquisadores.",cost:"Tesouro − 10",apply(){S.education+=6;S.science+=2;S.treasury-=10}},
{id:"science",icon:"🔬",cat:"Ciência",name:"Instituto científico",desc:"Financia química, física, medicina e engenharia.",cost:"Tesouro − 12",apply(){S.science+=6;S.technology+=2;S.treasury-=12;S.tech.mecanica+=.3}},
{id:"industry",icon:"🏭",cat:"Indústria",name:"Complexo industrial",desc:"Amplia máquinas, manufatura e produção nacional.",cost:"Ferro − 4 • Tesouro − 15",apply(){S.industry+=7;S.economy+=2;S.infrastructure+=2;S.iron-=4;S.machines+=1;S.treasury-=15;S.workforce.industria+=2;S.workforce.agro-=2}},
{id:"energy",icon:"⚡",cat:"Energia",name:"Programa energético",desc:"Aumenta geração e capacidade industrial.",cost:"Madeira − 6 • Tesouro − 10",apply(){S.energy+=7;S.industry+=2;S.infrastructure+=3;S.wood-=6;S.energyStock+=12;S.treasury-=10}},
{id:"health",icon:"🏥",cat:"Saúde",name:"Campanha sanitária",desc:"Saneamento e medicina melhoram sobrevivência.",cost:"Tesouro − 10",apply(){S.health+=7;S.stability+=2;S.population*=1.004;S.treasury-=10}},
{id:"transport",icon:"🚂",cat:"Transporte",name:"Rede de transporte",desc:"Estradas, portos e vias internas conectam mercados.",cost:"Madeira − 8 • Tesouro − 12",apply(){S.infrastructure+=8;S.economy+=4;S.urban+=1;S.wood-=8;S.treasury-=12}},
{id:"naval",icon:"⚓",cat:"Naval",name:"Programa naval",desc:"Estaleiros ampliam comércio e defesa marítima.",cost:"Madeira − 10 • Ferro − 3",apply(){S.military+=2;S.infrastructure+=3;S.diplomacy+=2;S.tech.naval+=1;S.economy+=2;S.wood-=10;S.iron-=3}},
{id:"aero",icon:"✈️",cat:"Aeronáutica",name:"Pesquisa aeronáutica",desc:"Desenvolve aerostatos, aerodinâmica e voo experimental.",cost:"Tesouro − 14",apply(){S.science+=3;S.technology+=4;S.tech.aeronautica+=1;S.tech.aerodinamica+=.5;S.industry+=2;S.treasury-=14}},
{id:"compute",icon:"💻",cat:"Computação",name:"Laboratório de informação",desc:"Cálculo, codificação, memória e processamento.",cost:"Tesouro − 15",apply(){S.science+=3;S.technology+=5;S.tech.computacao+=1;S.tech.dados+=1;S.tech.programacao+=.5;S.treasury-=15}},
{id:"mil",icon:"🪖",cat:"Militar",name:"Fortalecimento militar",desc:"Treinamento, logística e engenharia aumentam prontidão.",cost:"Tesouro − 12 • Alimento − 4",apply(){S.military+=5;S.readiness+=8;S.treasury-=12;S.food-=4}},
{id:"dip",icon:"🌎",cat:"Diplomacia",name:"Missão diplomática",desc:"Amplia confiança, comércio e cooperação científica.",cost:"Tesouro − 5",apply(){S.diplomacy+=7;S.economy+=3;S.treasury-=5;Object.values(S.diplomacy).forEach(x=>x.trust=clamp(x.trust+2))}},
{id:"trade",icon:"🤝",cat:"Economia",name:"Acordo comercial",desc:"Gera receita e aumenta rotas comerciais.",cost:"Tesouro − 3",apply(){S.economy+=4;S.trade+=7;S.diplomacy+=2;S.treasury-=3;Object.values(S.nations).forEach(n=>n.trade=clamp(n.trade+1))}},
{id:"census",icon:"📋",cat:"Estado",name:"Censo nacional",desc:"Registra população e melhora a capacidade administrativa.",cost:"Estabilidade − 1",apply(){doCensus(true);S.stability-=1}},
{id:"resources",icon:"⛏️",cat:"Recursos",name:"Expedição mineral",desc:"Procura ferro e matérias-primas para a indústria.",cost:"Tesouro − 7",apply(){S.iron+=7+Math.random()*4;S.wood+=8;S.treasury-=7;S.industry+=1}},
{id:"urban",icon:"🏙️",cat:"Cidades",name:"Plano urbano",desc:"Habitação e infraestrutura aceleram urbanização.",cost:"Tesouro − 9",apply(){S.infrastructure+=5;S.urban+=3;S.treasury-=9;S.cities.saoLuis.infra+=5}}
];

const tech=[
["mecanica","Mecânica","Máquinas e mecanismos",1460],["quimica","Química","Materiais e processos",1480],["medicina","Medicina","Saúde científica",1475],["microbiologia","Microbiologia","Doenças e microrganismos",1510],
["eletricidade","Eletricidade","Geração e motores",1540],["automacao","Automação","Máquinas automáticas",1580],["controle","Controle","Sistemas de controle",1600],["naval","Engenharia naval","Estaleiros e navegação",1460],
["submersiveis","Submersíveis","Exploração submarina",1530],["aeronautica","Aeronáutica","Aeronaves",1580],["aerodinamica","Aerodinâmica","Voo eficiente",1600],["navegacao","Navegação aérea","Instrumentação",1610],
["computacao","Computação","Máquinas de informação",1590],["programacao","Programação","Lógica computacional",1620],["dados","Processamento de dados","Informação em escala",1630],["semfio","Comunicação sem fio","Comunicação estratégica",1645],
["sistemas","Engenharia de sistemas","Integração tecnológica",1610],["industria","Indústria","Produção mecanizada",1500]
];
const milestones=[[1500,"Primeira fase industrial","Metalurgia, escrita e administração ganham escala."],[1530,"Era das máquinas térmicas","Engenharia e vapor experimental transformam a produção."],[1560,"Era da eletricidade","A pesquisa elétrica começa a alterar a infraestrutura."],[1590,"Era da automação","Precisão e controle passam a integrar a indústria."],[1620,"Era da aeronáutica","A engenharia de voo se torna um novo domínio."],[1650,"Era da informação","Comunicação e processamento de dados entram no Estado."],[1665,"Sociedade urbano-tecnológica","Indústria, ciência, informação e cidades estão integradas."]];

function era(){if(S.year<1500)return"Era da Fundação";if(S.year<1530)return"Era das Máquinas";if(S.year<1560)return"Era da Eletricidade";if(S.year<1590)return"Era da Automação";if(S.year<1620)return"Era da Aeronáutica";if(S.year<1650)return"Era da Engenharia";if(S.year<1665)return"Era da Informação";return"Sociedade Urbano-Tecnológica"}
function metric(l,v,s,sub){return`<div class="metric"><div class="label">${l}</div><div class="value">${v}${s||""}</div><div class="sub">${sub||""}</div></div>`}
function render(){
document.getElementById("year").textContent=S.year;document.getElementById("round").textContent=S.round;document.getElementById("eraName").textContent=era();
document.getElementById("headline").textContent=S.year<1500?"O nascimento de uma civilização":S.year<1600?"A transformação mecânica do Estado":S.year<1665?"A ascensão tecnológica de Upaon-Açu":"A sociedade urbano-tecnológica";
document.getElementById("statusText").textContent=`Tesouro ${money(S.treasury)} • influência ${Math.round(S.diplomacy)}/100 • ${S.actionsLeft} ações restantes`;
document.getElementById("actionDots").innerHTML=[0,1,2].map(i=>`<i class="dot ${i<S.actionsLeft?"on":""}"></i>`).join("");
document.getElementById("metrics").innerHTML=[
metric("POPULAÇÃO",fmt(S.population),"","habitantes"),metric("URBANIZAÇÃO",clamp(S.urban).toFixed(1),"%","população urbana"),metric("ESTABILIDADE",Math.round(S.stability),"/100","governança"),metric("ECONOMIA",Math.round(S.economy),"/100","produção"),
metric("CIÊNCIA",Math.round(S.science),"/100","conhecimento"),metric("INDÚSTRIA",Math.round(S.industry),"/100","capacidade"),metric("MILITAR",Math.round(S.military),"/100","poder nacional"),metric("INFLUÊNCIA",Math.round(S.diplomacy),"/100","diplomacia")
].join("");
renderActions();renderTech();renderEconomy();renderMap();renderPopulation();renderMilitary();renderDiplomacy();renderHistory();
document.getElementById("latestEvent").textContent=S.lastReport?`${S.lastReport.event} — ${S.lastReport.eventText}`:"A campanha começou.";
if(document.getElementById("populacao").classList.contains("active"))drawChart();
}
function renderActions(){
document.getElementById("actionGrid").innerHTML=actions.map(a=>`<button class="action" data-action="${a.id}" ${S.actionsLeft<=0?"disabled":""}><div class="icon">${a.icon}</div><div class="cat">${a.cat}</div><h3>${a.name}</h3><p>${a.desc}</p><div class="cost">${a.cost}</div></button>`).join("");
document.getElementById("actionCount").textContent=`${S.actionsLeft} ${S.actionsLeft===1?"ação":"ações"} disponíveis`;
document.querySelectorAll("[data-action]").forEach(b=>b.onclick=()=>{if(S.actionsLeft<=0)return;S.selectedActions.push(b.dataset.action);S.actionsLeft--;render();toast("Ação adicionada à fila.")});
}
function renderTech(){
document.getElementById("techTree").innerHTML=tech.map(([id,n,d,year])=>{let v=clamp(S.tech[id],0,10),un=S.year>=year,done=v>=10;return`<div class="tech ${done?"done":""} ${un?"":"locked"}"><h3>${done?"✓ ":""}${n}</h3><p>${d} • desbloqueio ${year}</p><div class="bar"><i style="width:${v*10}%"></i></div><small>${v.toFixed(1)}/10 ${un?"":"• bloqueada pela época"}</small></div>`}).join("");
}
function renderEconomy(){
const res=[["🌾","Alimentos",S.food,"estoque"],["⛏️","Ferro",S.iron,"estoque"],["🪵","Madeira",S.wood,"estoque"],["⚙️","Máquinas",S.machines,"unidades"],["⚡","Energia",S.energyStock,"reserva"],["💰","Tesouro",S.treasury,"unidades"]];
document.getElementById("resources").innerHTML=res.map(x=>`<div class="resource"><div class="r-icon">${x[0]}</div><div class="r-name">${x[1]}</div><b>${fmt(x[2])}</b><small>${x[3]}</small></div>`).join("");
const prod=[["Agricultura",S.workforce.agro],["Indústria",S.workforce.industria],["Manufatura",S.workforce.manufatura],["Mineração",S.workforce.minera],["Serviços",S.workforce.servicos],["Ciência e saúde",S.workforce.ciencia]];
document.getElementById("production").innerHTML=prod.map(x=>`<div class="bar-row"><div class="bar-head"><span>${x[0]}</span><b>${x[1].toFixed(1)}%</b></div><div class="bar"><i style="width:${clamp(x[1]*2)}%"></i></div></div>`).join("");
const bars=[["Receita",S.economy],["Comércio",S.trade],["Infraestrutura",S.infrastructure],["Energia",S.energy],["Produtividade",S.industry*.8+S.education*.2]];
document.getElementById("economyBars").innerHTML=bars.map(x=>`<div class="bar-row"><div class="bar-head"><span>${x[0]}</span><b>${Math.round(clamp(x[1]))}</b></div><div class="bar"><i style="width:${clamp(x[1])}%"></i></div></div>`).join("");
}
const regions={
upaon:["🌴","UPAON-AÇU","Núcleo civilizacional","Território sob controle direto. Indústria, ciência e portos são os motores do poder nacional."],
brasil:["🇧🇷","BRASIL","Espaço regional","Bahia, Pernambuco, Amazônia e Sudeste possuem comércio, população e recursos estratégicos."],
europa:["⚓","EUROPA","Potências marítimas","Portugal, Espanha, França, Holanda e Inglaterra competem por comércio e influência."],
africa:["🌍","ÁFRICA","Rotas atlânticas","África Ocidental e Magrebe são importantes para comércio, diplomacia e navegação."],
asia:["🏯","ÁSIA","Grandes civilizações","China e Índia possuem economias e centros de conhecimento de grande escala."]
};
function renderMap(){
document.querySelectorAll("[data-region]").forEach(b=>b.onclick=()=>{document.querySelectorAll("[data-region]").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");showRegion(b.dataset.region)});
showRegion(document.querySelector(".map-node.selected")?.dataset.region||"upaon");
}
function showRegion(id){
const r=regions[id];let extra=id==="upaon"?`<div class="row"><span>Influência</span><b>${Math.round(S.diplomacy)}/100</b></div><div class="row"><span>Indústria</span><b>${Math.round(S.industry)}/100</b></div><div class="row"><span>Ciência</span><b>${Math.round(S.science)}/100</b></div>`:`<div class="row"><span>Presença de Upaon-Açu</span><b>${Math.round((S.diplomacy+S.trade)/2)}/100</b></div><div class="row"><span>Interesse estratégico</span><b>${id==="europa"?"alto":id==="brasil"?"muito alto":"médio"}</b></div>`;
document.getElementById("regionInfo").innerHTML=`<div style="font-size:34px">${r[0]}</div><h3>${r[1]}</h3><div class="big">${r[2]}</div><p class="desc">${r[3]}</p>${extra}`;
}
function renderPopulation(){
const rural=100-S.urban;document.getElementById("demography").innerHTML=[["População",fmt(S.population)],["Urbana",`${fmt(S.population*S.urban/100)} (${S.urban.toFixed(1)}%)`],["Rural",`${fmt(S.population*rural/100)} (${rural.toFixed(1)}%)`],["Educação",Math.round(S.education)+"/100"],["Saúde",Math.round(S.health)+"/100"],["Infraestrutura",Math.round(S.infrastructure)+"/100"]].map(x=>`<div class="row"><span>${x[0]}</span><b>${x[1]}</b></div>`).join("");
const labels={agro:"Agricultura/pecuária",pesca:"Pesca/fluvial",construcao:"Construção",minera:"Mineração",manufatura:"Manufatura",industria:"Indústria",navegacao:"Navegação",servicos:"Serviços",ciencia:"Educação/ciência/saúde",outros:"Outros"};
document.getElementById("workforce").innerHTML=Object.entries(labels).map(([k,l])=>`<div class="row"><span>${l}</span><b>${Math.max(0,S.workforce[k]).toFixed(1)}%</b></div>`).join("");
document.getElementById("censusReport").innerHTML=S.censuses.length?formatCensus(S.censuses.at(-1)):"Nenhum censo.";
}
function renderMilitary(){
const vals=[["Exército",S.military*.78],["Marinha",S.military*.72],["Aviação",S.tech.aeronautica*7],["Submersíveis",S.tech.submersiveis*7],["Prontidão",S.readiness]];
document.getElementById("militaryStats").innerHTML=vals.map(x=>`<div class="stat"><span>${x[0]}</span><b>${Math.round(clamp(x[1]))}</b></div>`).join("");
const opts=Object.entries(S.nations).map(([id,n])=>`<option value="${id}">${n.flag} ${n.name}</option>`).join("");document.getElementById("attackTarget").innerHTML=opts;document.getElementById("spyTarget").innerHTML=opts;
document.getElementById("attackBtn").disabled=S.actionsLeft<=0;document.getElementById("spyBtn").disabled=S.actionsLeft<=0;
const ex=[["🏋️","Exercício terrestre",()=>{S.readiness+=5;S.military+=1}],["⚓","Exercício naval",()=>{S.readiness+=4;S.military+=1;S.tech.naval+=.3}],["✈️","Exercício aéreo",()=>{S.readiness+=3;S.military+=.5;S.tech.aeronautica+=.2}],["📡","Exercício de comunicação",()=>{S.readiness+=3;S.tech.semfio+=.3;S.tech.controle+=.2}]];
document.getElementById("exerciseGrid").innerHTML=ex.map((x,i)=>`<button class="action" data-ex="${i}" ${S.actionsLeft<=0?"disabled":""}><div class="icon">${x[0]}</div><h3>${x[1]}</h3><p>Treinamento sem iniciar guerra.</p></button>`).join("");
document.querySelectorAll("[data-ex]").forEach(b=>b.onclick=()=>{if(S.actionsLeft<=0)return;ex[+b.dataset.ex][2]();S.actionsLeft--;clampAll();render();toast("Exercício concluído.")});
}
function renderDiplomacy(){
document.getElementById("diplomacyGrid").innerHTML=Object.entries(S.nations).map(([id,n])=>{const d=S.diplomacy[id]||{};return`<div class="dip"><h3>${n.flag} ${n.name}</h3><div class="relation">Confiança ${Math.round(d.trust||n.attitude+40)}/100</div><div class="row"><span>Comércio</span><b>${Math.round(n.trade)}</b></div><div class="row"><span>Tensão</span><b>${Math.round(n.tension)}</b></div><div class="row"><span>Ciência</span><b>${Math.round(n.science)}</b></div><button class="secondary" data-dip="${id}">Enviar missão</button></div>`}).join("");
document.querySelectorAll("[data-dip]").forEach(b=>b.onclick=()=>{if(S.actionsLeft<=0){toast("Sem ações restantes.");return}let n=S.nations[b.dataset.dip],d=S.diplomacy[b.dataset.dip];S.actionsLeft--;d.trust=clamp((d.trust||40)+5);d.trade=clamp((d.trade||10)+2);n.tension=clamp(n.tension-2);S.diplomacy+=2;render();toast(`Missão enviada a ${n.name}.`)});
}
function renderHistory(){
const arr=[...S.history,...milestones.filter(m=>m[0]<=S.year).map(m=>({year:m[0],text:m[1]+" — "+m[2]}))].sort((a,b)=>a.year-b.year),seen=new Set(),u=[];arr.forEach(e=>{let k=e.year+"|"+e.text;if(!seen.has(k)){seen.add(k);u.push(e)}});
document.getElementById("timeline").innerHTML=u.slice(-100).reverse().map(e=>`<div class="event"><div class="date">${e.year}</div><div class="txt">${e.text}</div></div>`).join("");
}
function doCensus(silent=false){const c={year:S.year,population:S.population,urban:S.urban,science:S.science,industry:S.industry,infrastructure:S.infrastructure,education:S.education,health:S.health};S.censuses.push(c);S.history.push({year:S.year,text:`Censo nacional: ${fmt(S.population)} habitantes; ${S.urban.toFixed(1)}% urbanos.`});if(!silent){render();toast("Censo realizado.")}}
function formatCensus(c){return`<div class="report-grid">${Object.entries({Ano:c.year,População:fmt(c.population),Urbanização:c.urban.toFixed(1)+"%",Ciência:Math.round(c.science),Indústria:Math.round(c.industry),Infraestrutura:Math.round(c.infrastructure),Educação:Math.round(c.education),Saúde:Math.round(c.health)}).map(([k,v])=>`<div class="report-box"><small>${k}</small><b>${v}</b></div>`).join("")}</div>`}
function randomEvent(){
const pool=[
["Descoberta científica","Pesquisadores encontram uma solução inesperada.",()=>{S.science+=2;S.technology+=1;S.treasury+=4}],
["Tempestade atlântica","Infraestrutura costeira sofre danos.",()=>{S.infrastructure-=2;S.tech.naval+=.4;S.treasury-=3}],
["Descoberta mineral","Novas reservas ampliam a capacidade produtiva.",()=>{S.iron+=8;S.industry+=2}],
["Surto epidêmico","A saúde pública é pressionada.",()=>{S.health-=2;S.stability-=2;S.population*=.997}],
["Novo parceiro comercial","Uma rota comercial ganha força.",()=>{S.economy+=3;S.trade+=5;S.treasury+=8}],
["Avanço de engenharia","Uma solução técnica acelera a indústria.",()=>{S.industry+=2;S.tech.mecanica+=.4;S.tech.sistemas+=.3}],
["Crescimento urbano","São Luís recebe novos trabalhadores e investimentos.",()=>{S.urban+=1;S.cities.saoLuis.pop*=1.015;S.infrastructure+=1}],
["Crise fiscal","Uma despesa extraordinária pressiona o Tesouro.",()=>{S.treasury-=12;S.stability-=1}]
];return pool[Math.floor(Math.random()*pool.length)]}
function nextRound(){
if(!S.selectedActions.length){toast("Escolha pelo menos uma ação antes de avançar.");return}
const names=S.selectedActions.map(id=>actions.find(a=>a.id===id)?.name).filter(Boolean);S.selectedActions.forEach(id=>{const a=actions.find(x=>x.id===id);if(a)a.apply()});
const ev=randomEvent();ev[2]();
const growth=.007+(S.health*.00005)+(S.education*.000025);
S.population*=1+growth;S.urban=clamp(S.urban+Math.max(.08,S.industry*.011+S.infrastructure*.003),0,96);
S.economy=clamp(S.economy+S.industry*.015+S.education*.01-1.0);S.science=clamp(S.science+S.education*.018+S.technology*.006-.1);
S.industry=clamp(S.industry+S.energy*.008-.06);S.technology=clamp(S.technology+S.science*.008);
S.military=clamp(S.military-.04);S.readiness=clamp(S.readiness-1);S.infrastructure=clamp(S.infrastructure+S.industry*.004);
S.health=clamp(S.health+S.education*.004-.02);S.stability=clamp(S.stability+(S.health>25?.1:-.2));
S.food=clamp(S.food+S.workforce.agro*.25-S.population/70000,0,9999);S.wood=clamp(S.wood+S.workforce.agro*.08-S.infrastructure*.015,0,9999);
S.iron=clamp(S.iron+S.workforce.minera*.18-S.industry*.02,0,9999);S.energyStock=clamp(S.energyStock+S.energy*.35-S.industry*.04,0,9999);
S.treasury+=S.economy*.12+S.trade*.05-S.industry*.04;
S.workforce.industria=clamp(S.workforce.industria+.14,0,48);S.workforce.agro=clamp(S.workforce.agro-.12,8,60);S.workforce.ciencia=clamp(S.workforce.ciencia+(S.education>40?.05:.01),0,20);S.workforce.servicos=clamp(S.workforce.servicos+.04,0,25);
const c=S.cities.saoLuis;c.pop*=1+growth*1.2;c.industry=clamp(c.industry+S.industry*.01);c.infra=clamp(c.infra+S.infrastructure*.008);c.science=clamp(c.science+S.science*.005);c.education=clamp(c.education+S.education*.004);c.health=clamp(c.health+S.health*.004);
Object.values(S.nations).forEach(n=>{n.economy=clamp(n.economy+(Math.random()-.35)*1.5);n.science=clamp(n.science+(Math.random()-.2)*1.2);n.stability=clamp(n.stability+(Math.random()-.5));n.military=clamp(n.military+(Math.random()-.35));n.attitude=clamp(n.attitude+(Math.random()-.5)*1.4,-100,100)});
S.year++;S.round++;S.actionsLeft=3;S.selectedActions=[];S.history.push({year:S.year,text:`${ev[0]} — ${ev[1]}`});
S.lastGlobal=globalSnapshot();S.lastReport={actions:names,event:ev[0],eventText:ev[1],population:S.population,economy:S.economy,science:S.science,industry:S.industry,military:S.military,technology:S.technology};
for(const m of milestones)if(m[0]===S.year)S.history.push({year:S.year,text:`${m[1]} — ${m[2]}`});
clampAll();render();showReport();
}
function globalSnapshot(){return{year:S.year,powers:Object.values(S.nations).map(n=>({name:n.name,flag:n.flag,military:Math.round(n.military),economy:Math.round(n.economy),science:Math.round(n.science),stability:Math.round(n.stability),attitude:Math.round(n.attitude)}))}}
function strategicAttack(){
if(S.actionsLeft<=0)return toast("Sem ações restantes.");
const n=S.nations[document.getElementById("attackTarget").value];S.actionsLeft--;
const ours=S.military+S.tech.sistemas*2+S.tech.controle*1.5+S.readiness*.25,theirs=n.military+n.stability*.25+Math.random()*18;
if(ours>theirs*1.2){n.military-=6;n.stability-=4;S.military-=2;S.economy-=2;S.diplomacy-=5;S.history.push({year:S.year,text:`Conflito com ${n.name}: vantagem estratégica de Upaon-Açu.`});toast(`Ataque: vantagem contra ${n.name}.`)}
else{n.military-=2;S.military-=4;S.stability-=5;S.economy-=4;S.diplomacy-=8;n.attitude-=15;S.history.push({year:S.year,text:`Conflito com ${n.name}: ofensiva sem alcançar o objetivo.`});toast(`Ataque: resultado desfavorável contra ${n.name}.`)}
clampAll();render();
}
function espionage(){
if(S.actionsLeft<=0)return toast("Sem ações restantes.");
const n=S.nations[document.getElementById("spyTarget").value];S.actionsLeft--;
const intel=clamp(S.science*.45+S.tech.dados*4+S.tech.semfio*3+Math.random()*25);
if(Math.random()*100<intel){S.science+=2;S.technology+=1;S.history.push({year:S.year,text:`Inteligência obtida sobre ${n.name}.`});toast(`Operação bem-sucedida: informações sobre ${n.name}.`)}
else{n.tension=clamp(n.tension+10);n.attitude-=6;S.diplomacy-=3;S.history.push({year:S.year,text:`Operação contra ${n.name} foi parcialmente detectada.`});toast(`Operação detectada por ${n.name}.`)}
clampAll();render();
}
function showReport(){
const r=S.lastReport,g=S.lastGlobal||globalSnapshot();document.getElementById("roundReport").innerHTML=`<h2>🌴 UPAON-AÇU — ROUND ${S.round}</h2><p class="muted">ANO ${S.year} • ${era()}</p>
<div class="card"><h3>Decisões executadas</h3><p>${r.actions.map(x=>"• "+x).join("<br>")}</p></div>
<div class="card"><h3>🎲 ${r.event}</h3><p class="muted">${r.eventText}</p></div>
<div class="report-grid">${Object.entries({População:fmt(r.population),Economia:Math.round(r.economy)+"/100",Ciência:Math.round(r.science)+"/100",Indústria:Math.round(r.industry)+"/100",Tecnologia:Math.round(r.technology)+"/100",Militar:Math.round(r.military)+"/100"}).map(([k,v])=>`<div class="report-box"><small>${k}</small><b>${v}</b></div>`).join("")}</div>
<div class="card"><h3>🌎 Panorama global após o round</h3>${g.powers.map(n=>`<div class="row"><span>${n.flag} ${n.name}</span><b>Mil ${n.military} • Econ ${n.economy} • Ciência ${n.science}</b></div>`).join("")}</div>
<p class="muted">Você recebeu 3 novas ações. O próximo ano só avança quando você decidir.</p>`;
document.getElementById("reportModal").classList.remove("hidden");
}
function drawChart(){
const c=document.getElementById("chart"),ctx=c.getContext("2d"),d=devicePixelRatio||1,w=c.clientWidth||800,h=260;c.width=w*d;c.height=h*d;ctx.setTransform(d,0,0,d,0,0);ctx.clearRect(0,0,w,h);
const pts=Math.max(2,Math.min(60,S.round)),vals=[];let p=initial.population;for(let i=0;i<pts;i++){if(i===pts-1)p=S.population;else p*=1+.006+S.health*.00004;vals.push(p)}
const min=Math.min(...vals),max=Math.max(...vals);ctx.strokeStyle="#214737";ctx.lineWidth=1;for(let i=0;i<4;i++){let y=25+i*70;ctx.beginPath();ctx.moveTo(20,y);ctx.lineTo(w-20,y);ctx.stroke()}ctx.strokeStyle="#67e09e";ctx.lineWidth=3;ctx.beginPath();vals.forEach((v,i)=>{let x=20+i*(w-40)/(vals.length-1),y=235-(v-min)/Math.max(1,max-min)*200;i?ctx.lineTo(x,y):ctx.moveTo(x,y)});ctx.stroke();ctx.fillStyle="#91b1a2";ctx.font="11px system-ui";ctx.fillText("População — trajetória estimada",20,18);ctx.fillText(fmt(min),20,250);ctx.fillText(fmt(max),20,32);
}
function clampAll(){["stability","economy","science","industry","technology","military","diplomacy","education","health","energy","infrastructure","readiness","urban","trade"].forEach(k=>S[k]=clamp(S[k]));S.population=Math.max(100,S.population);S.treasury=Math.max(0,S.treasury);S.food=Math.max(0,S.food);S.iron=Math.max(0,S.iron);S.wood=Math.max(0,S.wood);S.machines=Math.max(0,S.machines);S.energyStock=Math.max(0,S.energyStock);Object.values(S.nations).forEach(n=>{n.tension=clamp(n.tension);n.military=clamp(n.military);n.economy=clamp(n.economy);n.science=clamp(n.science);n.stability=clamp(n.stability);n.attitude=clamp(n.attitude,-100,100)})}
function save(){localStorage.setItem(KEY,JSON.stringify(S));document.getElementById("saveState").textContent="● salvo agora";toast("Campanha salva neste navegador.")}
function load(){try{const x=JSON.parse(localStorage.getItem(KEY)||"null");if(!x)return toast("Nenhum save encontrado.");S=Object.assign(structuredClone(initial),x);S.nations=S.nations||structuredClone(initial.nations);S.actionsLeft=Number.isFinite(+S.actionsLeft)?clamp(+S.actionsLeft,0,3):3;S.selectedActions=Array.isArray(S.selectedActions)?S.selectedActions:[];clampAll();render();toast("Campanha carregada.")}catch(e){toast("Save inválido.")}}
function newGame(){if(confirm("Começar uma nova campanha?")){S=structuredClone(initial);render();toast("Nova campanha iniciada.")}}
function toast(t){let x=document.getElementById("toast");x.textContent=t;x.classList.add("show");clearTimeout(toast.t);toast.t=setTimeout(()=>x.classList.remove("show"),2300)}
document.querySelectorAll(".tab").forEach(b=>b.onclick=()=>{document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));document.querySelectorAll(".panel-page").forEach(x=>x.classList.remove("active"));b.classList.add("active");document.getElementById(b.dataset.tab).classList.add("active");if(b.dataset.tab==="populacao")drawChart()});
document.getElementById("nextRound").onclick=nextRound;document.getElementById("attackBtn").onclick=strategicAttack;document.getElementById("spyBtn").onclick=espionage;
document.getElementById("censusBtn").onclick=()=>doCensus(false);document.getElementById("saveBtn").onclick=save;document.getElementById("loadBtn").onclick=load;document.getElementById("newBtn").onclick=newGame;
document.getElementById("reportBtn").onclick=()=>{if(S.lastReport)showReport();else toast("Ainda não há relatório.")};
document.getElementById("closeModal").onclick=()=>document.getElementById("reportModal").classList.add("hidden");document.getElementById("reportModal").onclick=e=>{if(e.target.id==="reportModal")e.currentTarget.classList.add("hidden")};
window.addEventListener("resize",()=>{if(document.getElementById("populacao").classList.contains("active"))drawChart()});
render();
})();