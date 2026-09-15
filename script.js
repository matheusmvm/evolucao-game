(() => {
"use strict";

const SAVE_KEY = "upaon-acu-save-v1";
const clamp = (n,a,b) => Math.max(a, Math.min(b,n));
const fmt = n => new Intl.NumberFormat("pt-BR",{maximumFractionDigits:0}).format(Math.max(0,n));
const pct = n => `${clamp(n,0,100).toFixed(1).replace(".",",")}%`;

const initial = {
  year:1460, round:1, population:18000, urban:7, territory:1, stability:72,
  economy:38, science:8, industry:12, technology:5, military:7, diplomacy:18,
  education:9, health:8, energy:3, infrastructure:8, readiness:18,
  actionUsed:false, actionsLeft:3, selectedActions:[], selectedAction:null, lastReport:null, lastGlobal:null, censuses:[],
  history:[{year:1460,text:"Fundação e centralização de Upaon-Açu."}],
  tech:{
    mecanica:0, eletricidade:0, automacao:0, controle:0, computacao:0, programacao:0,
    dados:0, semfio:0, aeronautica:0, aerodinamica:0, navegacao:0, naval:0,
    submersiveis:0, sistemas:0, industria:0, medicina:0, microbiologia:0, quimica:0
  },
  workforce:{agro:48,pesca:12,construcao:8,minera:4,manufatura:15,industria:3,navegacao:3,servicos:4,ciencia:1,outros:2},
  cities:{saoLuis:{name:"São Luís",pop:12000,industry:8,infra:14,science:8,port:20,education:10,health:8}},
  nations:{
    portugal:{name:"Portugal",military:28,economy:48,science:42,stability:68,attitude:18},
    espanha:{name:"Espanha",military:32,economy:52,science:40,stability:64,attitude:12},
    franca:{name:"França",military:36,economy:55,science:58,stability:65,attitude:24},
    holanda:{name:"Holanda",military:25,economy:60,science:50,stability:70,attitude:22},
    inglaterra:{name:"Inglaterra",military:42,economy:64,science:55,stability:67,attitude:18},
    china:{name:"China",military:44,economy:70,science:48,stability:72,attitude:10},
    india:{name:"Índia",military:30,economy:58,science:52,stability:62,attitude:14},
    magrebe:{name:"Magrebe",military:24,economy:38,science:35,stability:60,attitude:26}
  },
  diplomacy:{
    portugal:{name:"Portugal",trust:20,trade:18,tension:15,science:3},
    espanha:{name:"Espanha",trust:15,trade:10,tension:20,science:2},
    franca:{name:"França",trust:24,trade:12,tension:8,science:5},
    holanda:{name:"Holanda",trust:22,trade:20,tension:10,science:5},
    inglaterra:{name:"Inglaterra",trust:18,trade:15,tension:12,science:4},
    china:{name:"China",trust:10,trade:5,tension:3,science:4},
    india:{name:"Índia",trust:12,trade:8,tension:4,science:3},
    magrebe:{name:"Magrebe",trust:26,trade:11,tension:5,science:3},
    africa:{name:"África Ocidental",trust:31,trade:16,tension:6,science:2},
    caribe:{name:"Caribe",trust:14,trade:9,tension:13,science:2}
  }
};

let S = structuredClone(initial);

const actions = [
 {id:"admin",icon:"🏛️",cat:"Estado",name:"Reforma administrativa",desc:"Melhora a estabilidade, administração e eficiência do Estado.",cost:"Custo: economia −2",apply(){S.stability+=5;S.economy-=2;S.infrastructure+=2}},
 {id:"edu",icon:"🎓",cat:"Educação",name:"Expandir educação",desc:"Cria capacidade científica e técnica para as próximas décadas.",cost:"Custo: economia −3",apply(){S.education+=5;S.science+=2;S.economy-=3}},
 {id:"science",icon:"🔬",cat:"Ciência",name:"Instituto científico",desc:"Financia pesquisa em matemática, química, física e biologia.",cost:"Custo: economia −3",apply(){S.science+=5;S.technology+=2;S.economy-=3}},
 {id:"industry",icon:"🏭",cat:"Indústria",name:"Complexo industrial",desc:"Amplia manufatura, máquinas e capacidade produtiva.",cost:"Custo: economia −4",apply(){S.industry+=6;S.economy+=2;S.infrastructure+=2;S.workforce.industria+=2;S.workforce.agro-=2}},
 {id:"energy",icon:"⚡",cat:"Energia",name:"Programa energético",desc:"Desenvolve geração e distribuição de energia.",cost:"Custo: economia −3",apply(){S.energy+=7;S.industry+=2;S.infrastructure+=3}},
 {id:"health",icon:"🏥",cat:"Saúde",name:"Campanha sanitária",desc:"Saneamento e medicina reduzem mortalidade e aumentam produtividade.",cost:"Custo: economia −3",apply(){S.health+=6;S.stability+=2;S.population*=1.006;S.economy+=1}},
 {id:"transport",icon:"🚂",cat:"Transporte",name:"Infraestrutura de transporte",desc:"Estradas, portos e transporte interno conectam a economia.",cost:"Custo: economia −3",apply(){S.infrastructure+=7;S.economy+=4;S.urban+=1}},
 {id:"naval",icon:"⚓",cat:"Naval",name:"Programa naval",desc:"Estaleiros e navegação fortalecem comércio e defesa marítima.",cost:"Custo: economia −3",apply(){S.military+=2;S.infrastructure+=3;S.diplomacy+=2;S.tech.naval+=1;S.economy+=2}},
 {id:"aero",icon:"✈️",cat:"Aeronáutica",name:"Pesquisa aeronáutica",desc:"Pesquisa aerostática, aerodinâmica e controle de voo quando possível.",cost:"Custo: economia −4",apply(){S.science+=3;S.technology+=4;S.tech.aeronautica+=1;S.tech.aerodinamica+=.5;S.industry+=2;S.economy-=4}},
 {id:"compute",icon:"💻",cat:"Computação",name:"Laboratório de informação",desc:"Máquinas de cálculo, codificação e processamento de dados.",cost:"Custo: economia −4",apply(){S.science+=3;S.technology+=5;S.tech.computacao+=1;S.tech.dados+=1;S.tech.programacao+=.5;S.economy-=4}},
 {id:"mil",icon:"🪖",cat:"Militar",name:"Fortalecimento militar",desc:"Treinamento, logística e engenharia aumentam prontidão.",cost:"Custo: economia −3",apply(){S.military+=5;S.readiness+=8;S.economy-=3}},
 {id:"dip",icon:"🌎",cat:"Diplomacia",name:"Missão diplomática",desc:"Amplia relações comerciais, científicas e políticas.",cost:"Custo: economia −1",apply(){S.diplomacy+=7;S.economy+=3;Object.values(S.diplomacy).forEach(x=>x.trust=clamp(x.trust+2,0,100))}},
 {id:"trade",icon:"🤝",cat:"Economia",name:"Acordo comercial",desc:"Aumenta comércio e receita, com efeito gradual.",cost:"Custo: economia −1",apply(){S.economy+=4;S.diplomacy+=2}},
 {id:"census",icon:"📋",cat:"Estado",name:"Censo nacional",desc:"Registra a situação demográfica e melhora a qualidade administrativa.",cost:"Custo: estabilidade −1",apply(){doCensus(true);S.stability-=1}}
];

const tech = [
 ["mecanica","Mecânica","Máquinas e mecanismos",10],
 ["quimica","Química","Materiais, processos e indústria",10],
 ["medicina","Medicina","Saúde científica",10],
 ["microbiologia","Microbiologia","Doenças e microrganismos",10],
 ["eletricidade","Eletricidade","Geração e motores",10],
 ["automacao","Automação","Máquinas e controle",10],
 ["controle","Controle","Sistemas automáticos",10],
 ["naval","Naval","Estaleiros e engenharia marítima",10],
 ["submersiveis","Submersíveis","Exploração submarina",10],
 ["aeronautica","Aeronáutica","Aeronaves",10],
 ["aerodinamica","Aerodinâmica","Voo eficiente",10],
 ["navegacao","Navegação aérea","Instrumentação e orientação",10],
 ["computacao","Computação","Cálculo e máquinas de informação",10],
 ["programacao","Programação","Lógica e software primitivo",10],
 ["dados","Processamento de dados","Informação em escala",10],
 ["semfio","Comunicação sem fio","Comunicação estratégica",10],
 ["sistemas","Engenharia de sistemas","Integração de tecnologias",10],
 ["industria","Indústria","Produção mecanizada",10]
];

const milestones = [
 [1500,"Primeira fase industrial","Metalurgia, escrita, administração e primeiras pesquisas."],
 [1530,"Máquinas térmicas","Engenharia e vapor experimental entram na economia."],
 [1560,"Eletricidade","Experimentos elétricos e engenharia ganham escala."],
 [1590,"Automação","Precisão, controle e sistemas mecanizados avançam."],
 [1620,"Era da Aeronáutica","Aeronáutica experimental e engenharia de sistemas."],
 [1650,"Era da Informação","Comunicação sem fio, processamento e computação."],
 [1665,"Sociedade Urbano-Tecnológica","Integração de indústria, ciência, informação e cidades."]
];

function eraName(){
 if(S.year<1500)return "Era da Fundação";
 if(S.year<1530)return "Era da Engenharia Inicial";
 if(S.year<1560)return "Era das Máquinas Térmicas";
 if(S.year<1590)return "Era da Eletricidade";
 if(S.year<1620)return "Era da Automação";
 if(S.year<1650)return "Era da Aeronáutica";
 if(S.year<1665)return "Era da Informação";
 return "Sociedade Urbano-Tecnológica";
}
function metric(label,value,suffix="",sub=""){return `<div class="metric"><div class="l">${label}</div><div class="v">${value}${suffix}</div><div class="s">${sub}</div></div>`}

function render(){
 document.getElementById("year").textContent=S.year;
 document.getElementById("round").textContent=S.round;
 document.getElementById("eraName").textContent=eraName();
 document.getElementById("statusText").textContent=`População ${fmt(S.population)} • estabilidade ${pct(S.stability)} • tecnologia ${S.technology.toFixed(1)}/100`;
 document.getElementById("metrics").innerHTML=[
  metric("POPULAÇÃO",fmt(S.population),"","habitantes"),
  metric("URBANIZAÇÃO",pct(S.urban),"","urbana"),
  metric("TERRITÓRIO",S.territory.toFixed(1),"x","escala"),
  metric("ESTABILIDADE",Math.round(S.stability),"/100","governança"),
  metric("ECONOMIA",Math.round(S.economy),"/100","produção"),
  metric("CIÊNCIA",Math.round(S.science),"/100","pesquisa"),
  metric("INDÚSTRIA",Math.round(S.industry),"/100","capacidade"),
  metric("PODER MILITAR",Math.round(S.military),"/100","força")
 ].join("");
 renderActions();renderTech();renderPopulation();renderInfra();renderMilitary();renderDiplomacy();renderPanorama();renderHistory();drawChart();
}
function renderActions(){
 const grid=document.getElementById("actionGrid");
 const left=S.actionsLeft;
 grid.innerHTML=actions.map(a=>`<button type="button" class="action" data-action="${a.id}" ${left<=0?"disabled":""}>
 <div class="icon">${a.icon}</div><div class="muted">${a.cat}</div><h3>${a.name}</h3><p>${a.desc}</p><div class="cost">${a.cost}</div></button>`).join("");
 document.getElementById("actionCount").textContent=`${left} ${left===1?"ação":"ações"} disponíveis`;
 grid.querySelectorAll("[data-action]").forEach(b=>b.addEventListener("click",()=>{
   if(S.actionsLeft<=0)return;
   const a=actions.find(x=>x.id===b.dataset.action); if(!a)return;
   S.selectedActions.push(a.id);
   S.actionsLeft--;
   // Actions are committed when the round advances.
   render();
   toast(`${a.name} adicionada à fila (${S.actionsLeft} restantes).`);
 }));
}
function renderTech(){
 document.getElementById("techGrid").innerHTML=tech.map(([id,name,desc,max])=>{
   const v=clamp(S.tech[id],0,max), done=v>=max;
   const unlocked = S.year >= ({mecanica:1460,quimica:1480,medicina:1480,microbiologia:1510,eletricidade:1540,automacao:1580,controle:1600,naval:1460,submersiveis:1530,aeronautica:1580,aerodinamica:1600,navegacao:1610,computacao:1590,programacao:1620,dados:1630,semfio:1645,sistemas:1610,industria:1500}[id]||2000);
   return `<div class="tech ${done?"done":""} ${unlocked?"":"locked"}"><h3>${done?"✓ ":""}${name}</h3><p>${desc}</p><div class="bar"><i style="width:${v/max*100}%"></i></div><div class="level">${v.toFixed(1)}/${max} ${unlocked?"":"• bloqueada pela época"}</div></div>`;
 }).join("");
}
function renderPopulation(){
 const rural=100-S.urban;
 document.getElementById("demography").innerHTML=[
  ["População total",fmt(S.population)],["Urbana",`${fmt(S.population*S.urban/100)} (${pct(S.urban)})`],
  ["Rural",`${fmt(S.population*rural/100)} (${pct(rural)})`],["Natalidade efetiva","+"+(S.health+S.education/2).toFixed(1)+"%"],["Mortalidade relativa",Math.max(1,(20-S.health/3)).toFixed(1)+"%"]
 ].map(x=>`<div class="row"><span>${x[0]}</span><b>${x[1]}</b></div>`).join("");
 const labels={agro:"Agricultura/pecuária",pesca:"Pesca/fluvial",construcao:"Construção",minera:"Mineração",manufatura:"Manufatura/artesanato",industria:"Indústria mecanizada",navegacao:"Navegação/estaleiros",servicos:"Administração/serviços",ciencia:"Educação/ciência/saúde",outros:"Outros"};
 document.getElementById("workforce").innerHTML=Object.entries(labels).map(([k,l])=>`<div class="row"><span>${l}</span><b>${Math.max(0,S.workforce[k]).toFixed(1)}%</b></div>`).join("");
 document.getElementById("censusReport").innerHTML=S.censuses.length?formatCensus(S.censuses.at(-1)):"Nenhum censo realizado.";
}
function renderInfra(){
 const c=S.cities.saoLuis;
 document.getElementById("cities").innerHTML=`<div class="city"><h3>🏝️ São Luís</h3><div class="citypop">${fmt(c.pop)} habitantes</div>${[
 ["Indústria",c.industry],["Infraestrutura",c.infra],["Ciência",c.science],["Porto",c.port],["Educação",c.education],["Saúde",c.health]
 ].map(x=>`<div class="row"><span>${x[0]}</span><b>${Math.round(x[1])}/100</b></div>`).join("")}</div>`;
 const infra=[["Estradas",S.infrastructure*.9],["Portos",S.infrastructure*.75],["Eletricidade",S.energy],["Água e saneamento",S.health],["Hospitais",S.health*.8],["Escolas",S.education],["Comunicação",S.tech.semfio*8+S.infrastructure*.2]];
 document.getElementById("infraList").innerHTML=infra.map(x=>`<div><div class="bar-head"><span>${x[0]}</span><b>${Math.round(clamp(x[1],0,100))}</b></div><div class="bar"><i style="width:${clamp(x[1],0,100)}%"></i></div></div>`).join("");
}
function renderMilitary(){
 const vals=[["Exército",S.military*.75],["Marinha",S.military*.7],["Aviação",S.tech.aeronautica*7],["Submersíveis",S.tech.submersiveis*7],["Prontidão",S.readiness]];
 document.getElementById("militaryStats").innerHTML=vals.map(x=>`<div class="mil-card"><span>${x[0]}</span><b>${Math.round(clamp(x[1],0,100))}</b></div>`).join("");
 const nationEntries=Object.entries(S.nations);
 const opts=nationEntries.map(([id,n])=>`<option value="${id}">${n.name}</option>`).join("");
 document.getElementById("attackTarget").innerHTML=opts;
 document.getElementById("spyTarget").innerHTML=opts;
 document.getElementById("attackBtn").disabled=S.actionsLeft<=0;
 document.getElementById("spyBtn").disabled=S.actionsLeft<=0;
 const ex=[["🏋️","Exercício terrestre",()=>{S.readiness+=5;S.military+=1}],
 ["⚓","Exercício naval",()=>{S.readiness+=4;S.military+=1;S.tech.naval+=.3}],
 ["✈️","Exercício aéreo",()=>{S.readiness+=3;S.military+=.5;S.tech.aeronautica+=.2}],
 ["📡","Exercício de comunicação",()=>{S.readiness+=3;S.tech.semfio+=.3;S.tech.controle+=.2}]];
 document.getElementById("exerciseGrid").innerHTML=ex.map((x,i)=>`<button type="button" class="action" data-ex="${i}" ${S.actionsLeft<=0?"disabled":""}><div class="icon">${x[0]}</div><h3>${x[1]}</h3><p>Aumenta prontidão e experiência sem iniciar guerra.</p></button>`).join("");
 document.querySelectorAll("[data-ex]").forEach(b=>b.addEventListener("click",()=>{
   if(S.actionsLeft<=0)return;
   ex[+b.dataset.ex][2]();S.actionsLeft--;clampAll();render();toast("Exercício concluído e uma ação foi consumida.");
 }));
}
function strategicAttack(){
 if(S.actionsLeft<=0){toast("Não há ações restantes neste round.");return}
 const id=document.getElementById("attackTarget").value, n=S.nations[id];
 if(!n)return;
 const ours=S.military + S.tech.sistemas*2 + S.tech.controle*1.5;
 const theirs=n.military + n.stability*.25 + Math.random()*18;
 const ratio=ours/Math.max(1,theirs);
 S.actionsLeft--;
 if(ratio>1.25){
   S.military=clamp(S.military-2,0,100);S.economy=clamp(S.economy-2,0,100);
   n.military=clamp(n.military-5,0,100);n.stability=clamp(n.stability-4,0,100);
   S.diplomacy=clamp(S.diplomacy-5,0,100);
   n.attitude=clamp(n.attitude-12,-100,100);
   S.history.push({year:S.year,text:`Conflito com ${n.name}: Upaon-Açu obteve vantagem estratégica.`});
   toast(`Ataque contra ${n.name}: vantagem de Upaon-Açu.`);
 }else{
   S.military=clamp(S.military-4,0,100);S.economy=clamp(S.economy-4,0,100);
   n.military=clamp(n.military-2,0,100);n.attitude=clamp(n.attitude-18,-100,100);
   S.stability=clamp(S.stability-5,0,100);S.diplomacy=clamp(S.diplomacy-8,0,100);
   S.history.push({year:S.year,text:`Conflito com ${n.name}: a ofensiva não alcançou o objetivo esperado.`});
   toast(`Ataque contra ${n.name}: resultado desfavorável.`);
 }
 clampAll();render();
}
function espionage(){
 if(S.actionsLeft<=0){toast("Não há ações restantes neste round.");return}
 const id=document.getElementById("spyTarget").value,n=S.nations[id];
 if(!n)return;
 S.actionsLeft--;
 const intel=clamp(S.science*.45+S.tech.dados*4+S.tech.semfio*3+Math.random()*25,0,100);
 const detected=Math.random()*100 > intel;
 S.history.push({year:S.year,text:detected?`Espionagem contra ${n.name}: operação discreta sem detecção confirmada.`:`Espionagem contra ${n.name}: atividade detectada, causando tensão diplomática.`});
 if(detected){n.tension=clamp((n.tension||20)+10,0,100);n.attitude=clamp(n.attitude-5,-100,100);S.diplomacy=clamp(S.diplomacy-3,0,100);toast(`Informações obtidas sobre ${n.name}, mas houve sinais de detecção.`)}
 else{n.military=clamp(n.military,0,100);S.science+=2;S.technology+=1;toast(`Inteligência obtida sobre ${n.name}.`)}
 clampAll();render();
}
function renderDiplomacy(){
 document.getElementById("diplomacyGrid").innerHTML=Object.entries(S.diplomacy).map(([id,d])=>`<div class="dip"><h3>${d.name}</h3><div class="relation">Confiança ${Math.round(d.trust)}/100</div><div class="row"><span>Comércio</span><b>${Math.round(d.trade)}</b></div><div class="row"><span>Tensão</span><b>${Math.round(d.tension)}</b></div><div class="row"><span>Ciência</span><b>${Math.round(d.science)}</b></div><button type="button" data-dip="${id}" class="secondary">Enviar missão</button></div>`).join("");
 document.querySelectorAll("[data-dip]").forEach(b=>b.addEventListener("click",()=>{
   const d=S.diplomacy[b.dataset.dip];d.trust=clamp(d.trust+4,0,100);d.trade=clamp(d.trade+2,0,100);d.tension=clamp(d.tension-2,0,100);S.diplomacy+=1;render();toast(`Missão diplomática enviada a ${d.name}.`);
 }));
}
function renderPanorama(){
 const global=[
 `Europa: competição marítima, comercial e científica continua se intensificando.`,
 `África: redes comerciais e diplomáticas ganham importância no Atlântico.`,
 `Ásia: grandes centros econômicos e científicos seguem influentes.`,
 `Atlântico: Upaon-Açu amplia sua presença através de portos, ciência e diplomacia.`
 ];
 const brazil=[
 `Bahia: grande centro regional de comércio e população.`,
 `Pernambuco: eixo agrícola e marítimo estratégico.`,
 `Amazônia: rios e território oferecem oportunidades logísticas.`,
 `Nordeste: proximidade geográfica mantém a região central para a estratégia.`,
 `Sudeste: potencial econômico crescente no horizonte da campanha.`
 ];
 document.getElementById("global").innerHTML=global.map(x=>`<div class="row"><span>${x}</span></div>`).join("")+
 `<div class="row"><span><b>Potências monitoradas</b></span></div>`+
 Object.values(S.nations).map(n=>`<div class="row"><span>${n.name}</span><b>Mil ${Math.round(n.military)} • Econ ${Math.round(n.economy)}</b></div>`).join("");
 document.getElementById("brazil").innerHTML=brazil.map(x=>`<div class="row"><span>${x}</span></div>`).join("");
}
function renderHistory(){
 const known=milestones.filter(m=>m[0]<=S.year);
 const events=[...S.history,...known.map(m=>({year:m[0],text:m[1]+": "+m[2]}))].sort((a,b)=>a.year-b.year);
 const unique=[];const seen=new Set();for(const e of events){const k=e.year+"|"+e.text;if(!seen.has(k)){seen.add(k);unique.push(e)}}
 document.getElementById("timeline").innerHTML=unique.slice(-80).reverse().map(e=>`<div class="event"><div class="date">${e.year}</div><div class="txt">${e.text}</div></div>`).join("");
}
function formatCensus(c){
 return `<div class="report-grid">${[
 ["Ano",c.year],["População",fmt(c.population)],["Urbanização",pct(c.urban)],["Urbana",fmt(c.population*c.urban/100)],
 ["Rural",fmt(c.population*(1-c.urban/100))],["Ciência",Math.round(c.science)+"/100"],["Indústria",Math.round(c.industry)+"/100"],["Infraestrutura",Math.round(c.infrastructure)+"/100"]
 ].map(x=>`<div class="report-box"><small>${x[0]}</small><b>${x[1]}</b></div>`).join("")}</div>`;
}
function doCensus(silent=false){
 const c={year:S.year,population:S.population,urban:S.urban,science:S.science,industry:S.industry,infrastructure:S.infrastructure};
 S.censuses.push(c);S.history.push({year:S.year,text:`Censo nacional realizado: ${fmt(S.population)} habitantes e ${S.urban.toFixed(1)}% de urbanização.`});
 if(!silent){render();toast("Censo realizado e arquivado.");}
}
function chooseRandomEvent(){
 const pool=[
 ["Descoberta científica","Uma equipe obtém resultados inesperados. A capacidade científica aumenta.",()=>{S.science+=2;S.technology+=1}],
 ["Tempestade atlântica","Infraestrutura costeira sofre danos, mas a experiência naval aumenta.",()=>{S.infrastructure-=2;S.tech.naval+=.4}],
 ["Descoberta mineral","Novas reservas ampliam a capacidade industrial.",()=>{S.industry+=3;S.economy+=2}],
 ["Surto epidêmico","A saúde pública é pressionada.",()=>{S.health-=2;S.stability-=2;S.population*=.997}],
 ["Novo parceiro comercial","Uma rota comercial se fortalece.",()=>{S.economy+=3;S.diplomacy+=3}],
 ["Avanço de engenharia","Uma solução técnica acelera a industrialização.",()=>{S.industry+=2;S.tech.mecanica+=.4;S.tech.sistemas+=.3}]
 ];
 return pool[Math.floor(Math.random()*pool.length)];
}
function nextRound(){
 if(S.actionsLeft===3 && !S.selectedActions.length){
   toast("Escolha pelo menos uma ação antes de avançar.");
   return;
 }
 const executed=[...S.selectedActions];
 executed.forEach(id=>{const a=actions.find(x=>x.id===id);if(a)a.apply()});
 const event=chooseRandomEvent();event[2]();

 // Pequenas mudanças autônomas nas potências monitoradas.
 Object.values(S.nations).forEach(n=>{
   n.economy=clamp(n.economy+(Math.random()-.35)*1.8,0,100);
   n.science=clamp(n.science+(Math.random()-.2)*1.4,0,100);
   n.stability=clamp(n.stability+(Math.random()-.5)*1.2,0,100);
   n.military=clamp(n.military+(Math.random()-.35)*1.1,0,100);
   n.attitude=clamp(n.attitude+(Math.random()-.5)*1.5,-100,100);
 });

 const growth=0.008+(S.health*.00005)+(S.education*.000025);
 S.population*=1+growth;
 S.urban=clamp(S.urban+Math.max(.08,S.industry*.012+S.infrastructure*.003),0,95);
 S.economy=clamp(S.economy+(S.industry*.015)+(S.education*.01)-1.2,0,100);
 S.science=clamp(S.science+(S.education*.018)+(S.technology*.006)-.15,0,100);
 S.industry=clamp(S.industry+S.energy*.008-.08,0,100);
 S.technology=clamp(S.technology+S.science*.008,0,100);
 S.military=clamp(S.military-0.05,0,100);
 S.readiness=clamp(S.readiness-1,0,100);
 S.infrastructure=clamp(S.infrastructure+S.industry*.004,0,100);
 S.health=clamp(S.health+S.education*.004-0.03,0,100);
 S.stability=clamp(S.stability+(S.health>25?0.1:-0.2),0,100);

 S.workforce.industria=clamp(S.workforce.industria+0.12,0,45);
 S.workforce.agro=clamp(S.workforce.agro-0.10,8,60);
 S.workforce.ciencia=clamp(S.workforce.ciencia+(S.education>40?.04:.01),0,20);
 S.workforce.servicos=clamp(S.workforce.servicos+0.04,0,25);

 const c=S.cities.saoLuis;
 c.pop*=1+growth*1.2;c.industry=clamp(c.industry+S.industry*.01,0,100);
 c.infra=clamp(c.infra+S.infrastructure*.008,0,100);c.science=clamp(c.science+S.science*.005,0,100);
 c.education=clamp(c.education+S.education*.004,0,100);c.health=clamp(c.health+S.health*.004,0,100);

 S.year++;S.round++;S.actionsLeft=3;S.selectedActions=[];S.actionUsed=false;S.selectedAction=null;
 S.history.push({year:S.year,text:`${event[0]} — ${event[1]}`});
 S.lastGlobal=buildGlobalSnapshot();
 S.lastReport={event:event[0],eventText:event[1],population:S.population,economy:S.economy,science:S.science,industry:S.industry,military:S.military,technology:S.technology,actions:executed.map(id=>actions.find(a=>a.id===id)?.name).filter(Boolean)};
 checkMilestones();clampAll();render();showReport();
}
function buildGlobalSnapshot(){
 const powers=Object.values(S.nations).map(n=>({name:n.name,military:Math.round(n.military),economy:Math.round(n.economy),science:Math.round(n.science),stability:Math.round(n.stability),attitude:Math.round(n.attitude)}));
 return {
   year:S.year,atlantic:`Presença de Upaon-Açu: ${Math.round(S.diplomacy)}/100`,
   brazil:`Influência regional: ${Math.round((S.diplomacy+S.infrastructure+S.military)/3)}/100`,
   powers
 };
}
function checkMilestones(){
 for(const m of milestones){if(m[0]===S.year){S.history.push({year:S.year,text:`${m[1]} — ${m[2]}`})}}
}
function clampAll(){
 ["stability","economy","science","industry","technology","military","diplomacy","education","health","energy","infrastructure","readiness","urban"].forEach(k=>S[k]=clamp(Number(S[k])||0,0,100));
 S.population=Math.max(100,S.population);S.territory=Math.max(1,S.territory);
 for(const d of Object.values(S.diplomacy)){d.trust=clamp(d.trust,0,100);d.trade=clamp(d.trade,0,100);d.tension=clamp(d.tension,0,100);d.science=clamp(d.science,0,100)}
}
function showReport(){
 const r=S.lastReport;if(!r)return;
 const g=S.lastGlobal||buildGlobalSnapshot();
 document.getElementById("roundReport").innerHTML=`<h2>🌴 UPAON-AÇU — ROUND ${S.round}</h2><p class="muted">ANO ${S.year}</p>
 <div class="panel"><h3>Decisões executadas</h3><p>${r.actions?.length?r.actions.map(x=>`• ${x}`).join("<br>"):"Nenhuma"}</p></div>
 <div class="panel"><h3>Evento do ano</h3><p><b>${r.event}</b></p><p class="muted">${r.eventText}</p></div>
 <div class="report-grid">
 <div class="report-box"><small>População</small><b>${fmt(r.population)}</b></div>
 <div class="report-box"><small>Economia</small><b>${Math.round(r.economy)}/100</b></div>
 <div class="report-box"><small>Ciência</small><b>${Math.round(r.science)}/100</b></div>
 <div class="report-box"><small>Indústria</small><b>${Math.round(r.industry)}/100</b></div>
 <div class="report-box"><small>Tecnologia</small><b>${Math.round(r.technology)}/100</b></div>
 <div class="report-box"><small>Poder militar</small><b>${Math.round(r.military)}/100</b></div>
 </div>
 <div class="panel"><h3>🌎 Panorama global — ${g.year}</h3>
 <p class="muted">${g.atlantic} • ${g.brazil}</p>
 ${g.powers.map(n=>`<div class="row"><span><b>${n.name}</b> <span class="muted">atitude ${n.attitude}</span></span><b>Mil ${n.military} • Econ ${n.economy} • Ciência ${n.science}</b></div>`).join("")}
 </div>
 <p class="muted">Você recuperou 3 ações para o próximo round. Escolha até três antes de avançar novamente.</p>`;
 document.getElementById("reportModal").classList.remove("hidden");
 document.getElementById("reportModal").setAttribute("aria-hidden","false");
}
function toast(t){const x=document.getElementById("toast");x.textContent=t;x.classList.add("show");clearTimeout(toast.t);toast.t=setTimeout(()=>x.classList.remove("show"),2200)}
function save(){localStorage.setItem(SAVE_KEY,JSON.stringify(S));toast("Jogo salvo neste navegador.")}
function load(){try{const x=JSON.parse(localStorage.getItem(SAVE_KEY)||"null");if(!x){toast("Nenhum save encontrado.");return}S=Object.assign(structuredClone(initial),x);
 S.actionsLeft=Number.isFinite(Number(S.actionsLeft))?clamp(Number(S.actionsLeft),0,3):3;
 S.selectedActions=Array.isArray(S.selectedActions)?S.selectedActions:[];
 S.nations=S.nations||structuredClone(initial.nations);
 clampAll();render();toast("Jogo carregado.")}catch(e){toast("Não foi possível carregar o save.")}}
function newGame(){if(confirm("Começar uma nova campanha? O progresso atual será substituído na memória desta página.")){S=structuredClone(initial);render();toast("Nova campanha iniciada com 3 ações por round.")}}
function drawChart(){
 const c=document.getElementById("chart"),ctx=c.getContext("2d"),d=devicePixelRatio||1;
 const w=c.clientWidth||900,h=260;c.width=w*d;c.height=h*d;ctx.setTransform(d,0,0,d,0,0);ctx.clearRect(0,0,w,h);
 const hist=[...S.history].filter(x=>x.year>=1460).slice(-60);const vals=[];
 let pop=initial.population;
 for(let i=0;i<hist.length;i++){if(i===hist.length-1)pop=S.population;vals.push(pop)}
 if(vals.length<2){ctx.fillStyle="#94b3a5";ctx.font="13px system-ui";ctx.fillText("Avance alguns rounds para formar o gráfico.",20,35);return}
 const min=Math.min(...vals),max=Math.max(...vals),pad=25;
 ctx.strokeStyle="#24483a";ctx.lineWidth=1;for(let i=0;i<4;i++){const y=pad+i*(h-pad*2)/3;ctx.beginPath();ctx.moveTo(pad,y);ctx.lineTo(w-pad,y);ctx.stroke()}
 ctx.strokeStyle="#65d49a";ctx.lineWidth=3;ctx.beginPath();
 vals.forEach((v,i)=>{const x=pad+i*(w-pad*2)/(vals.length-1),y=h-pad-(v-min)/Math.max(1,max-min)*(h-pad*2);i?ctx.lineTo(x,y):ctx.moveTo(x,y)});ctx.stroke();
 ctx.fillStyle="#94b3a5";ctx.font="11px system-ui";ctx.fillText(fmt(min),pad, h-7);ctx.fillText(fmt(max),pad,17);ctx.fillText("População — últimos eventos",pad+130,17);
}
document.querySelectorAll(".tab").forEach(b=>b.addEventListener("click",()=>{
 document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));document.querySelectorAll(".tab-panel").forEach(x=>x.classList.remove("active"));
 b.classList.add("active");document.getElementById(b.dataset.tab).classList.add("active");if(b.dataset.tab==="populacao")drawChart();
}));
document.getElementById("nextRound").addEventListener("click",nextRound);
document.getElementById("attackBtn").addEventListener("click",strategicAttack);
document.getElementById("spyBtn").addEventListener("click",espionage);
document.getElementById("censusBtn").addEventListener("click",doCensus);
document.getElementById("saveBtn").addEventListener("click",save);
document.getElementById("loadBtn").addEventListener("click",load);
document.getElementById("newBtn").addEventListener("click",newGame);
document.getElementById("closeModal").addEventListener("click",()=>document.getElementById("reportModal").classList.add("hidden"));
document.getElementById("reportModal").addEventListener("click",e=>{if(e.target.id==="reportModal")e.currentTarget.classList.add("hidden")});
window.addEventListener("resize",()=>{if(document.getElementById("populacao").classList.contains("active"))drawChart()});
render();
})();