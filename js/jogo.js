/* Lógica do jogo: estado guardado, mapa, paragens, interação, navegação e progresso.
   Para acrescentar perguntas não é preciso mexer aqui: usa os ficheiros em js/conteudo/. */
const KEY='grafolandia-macs11-v1';
let save; try{save=JSON.parse(localStorage.getItem(KEY))}catch(e){} if(!save) save={stars:{},xp:0}; if(!save.prog) save.prog={}; // prog: paragem, vidas e respostas de cada linha a meio
function persist(){try{localStorage.setItem(KEY,JSON.stringify(save))}catch(e){}}

/* ---------- ESTADO ---------- */
let S={view:'home'};
const app=document.getElementById('app');
const esc=s=>s;
function daysLeft(){const t=new Date(2026,9,16),n=new Date();n.setHours(0,0,0,0);return Math.round((t-n)/864e5)}
function starsHTML(n){let s='';for(let i=0;i<3;i++)s+=i<n?'★':'<span class="off">★</span>';return s}

function render(){
 if(S.view==='step'&&S.subs)saveProg();
 if(S.view==='home')return home();
 if(S.view==='sheet')return sheet();
 if(S.view==='end')return endScr();
 if(S.view==='over')return overScr();
 return stepScr();
}
function home(){
 const dl=daysLeft();
 app.style.removeProperty('--wc');
 app.innerHTML=`<div class="hero"><h1>Grafo<span>lândia</span></h1>
 <p>Aprende a matéria e treina para o teste de MACS (11.º ano), estação a estação.</p>
 <div class="chips"><span class="chip">${dl>0?`Faltam ${dl} dias para o teste`:dl===0?'O teste é hoje!':'Teste: 16 out'}</span><span class="chip">${save.xp} XP</span><span class="chip">Manual pág. 6–48</span></div></div>
 <div class="metro">${W.map((w,i)=>`<div class="strow"><button class="station" data-w="${i}" style="--c:var(${w.c})"><span class="dot">${i+1}</span>
 <span><span class="st-name">${w.title}</span><span class="st-sub">${w.name} · ${save.prog[w.id]?`<b class="cont">continua na paragem ${save.prog[w.id].i+1} de ${save.prog[w.id].n}</b>`:w.gen?'10 perguntas novas de cada vez':w.steps.length+' paragens'}</span></span>
 <span class="stars">${starsHTML(save.stars[w.id]||0)}</span></button>${hasProgress(w)?`<button class="streset" data-reset="${i}" aria-label="Recomeçar a ${w.name}" title="Recomeçar esta linha">↺</button>`:'<span></span>'}</div>
 ${S.confirm===i?`<div class="stconfirm" style="--wc:var(${w.c})"><span>Recomeçar a <b>${w.name}</b>? Perdes as estrelas e a paragem onde ias${w.steps.some(s=>s.t==='just')?', e as respostas que escreveste':''}.</span><div class="row"><button class="btn" data-act="resetW" data-i="${i}">Sim, recomeçar</button><button class="btn ghost" data-act="cancelReset">Cancelar</button></div></div>`:''}`).join('')}</div>
 <div class="links"><button class="btn ghost" data-act="sheet">Ver a cábula</button><button class="btn ghost" data-act="reset">Recomeçar progresso</button></div>
 <p class="foot">Matéria: noções básicas de grafos, trajetos e circuitos eulerianos (carteiro chinês, Fleury, eulerização) e circuitos hamiltonianos.</p>`;
}
/* Recomeçar uma só linha: apaga as estrelas dela (e, na Linha Cinzenta, as respostas escritas) */
function hasProgress(w){return !!save.stars[w.id]||!!save.prog[w.id]||w.steps.some(s=>s.t==='just'&&justLoad(s.id))}
function resetWorld(w){delete save.stars[w.id];delete save.prog[w.id];persist();w.steps.forEach(s=>{if(s.t==='just')try{localStorage.removeItem(KEY+'-just-'+s.id)}catch(e){}})}
function sheet(){
 app.style.removeProperty('--wc');
 app.innerHTML=`<div class="top"><button class="back" data-act="home" aria-label="Voltar">←</button><h2>Cábula</h2><span></span></div>
 <div class="sheet">${CABULA}</div>`;
}
/* Progresso de cada linha: guardado no telemóvel, para continuar onde ficaste ao voltar do mapa */
function saveProg(){const w=W[S.w];save.prog[w.id]={i:S.i,hearts:S.hearts,subs:S.subs,ended:S.ended||0,n:w.steps.length,steps:w.gen?w.steps:undefined};persist()}
function startWorld(i){
 const w=W[i],p=save.prog[w.id];
 if(p&&p.hearts>0&&p.i<p.n&&p.n===(w.gen?(p.steps||[]).length:w.steps.length)){ // continua onde ficou
  if(w.gen)w.steps=p.steps;
  S={view:'step',w:i,i:p.i,hearts:p.hearts,subs:p.subs||[],ended:p.ended,sid:Date.now(),base:p.i};
 } else {
  if(w.gen)w.steps=makeTreino();
  S={view:'step',w:i,i:0,hearts:w.hearts||3,subs:[],sid:Date.now(),base:0};
 }
 S.sub=S.subs[S.i]||(S.subs[S.i]={});sess=S;nav({w:i,i:S.i,sid:S.sid});render();window.scrollTo(0,0)}

/* Navegação: botão "‹" (paragem anterior) e botão/gesto "voltar" do telemóvel.
   Cada paragem fica no histórico do navegador; as respostas dadas ficam guardadas em S.subs. */
let sess=null; // a linha que está a ser jogada (para poder voltar a ela)
function nav(st){try{history.pushState(st,'')}catch(e){}}
function prevStep(){
 if(S.view!=='step'||S.i<=0)return;
 const h=history.state;
 if(S.i>S.base&&h&&h.sid===S.sid&&h.i===S.i)return history.back(); // o popstate trata do resto
 S.base=S.i-1;try{history.replaceState({w:S.w,i:S.i-1,sid:S.sid},'')}catch(e){}
 showStep(S.i-1);
}
function showStep(i){S.i=i;S.view=i>=W[S.w].steps.length?'end':'step';S.sub=S.subs[i]||(S.subs[i]={});render();window.scrollTo(0,0)}
addEventListener('popstate',e=>{
 const st=e.state;
 if(st&&st.sid&&sess&&st.sid===sess.sid&&sess.hearts>0){S=sess;showStep(st.i);return}
 S={view:st&&st.v==='sheet'?'sheet':'home'};render();window.scrollTo(0,0);
});

function stepScr(){
 const w=W[S.w],st=w.steps[S.i],sub=S.sub;
 app.style.setProperty('--wc',`var(${w.c})`);
 const pct=Math.round(S.i/w.steps.length*100);
 let h=`<div class="top top-step"><button class="back" data-act="home" aria-label="Sair para o mapa" title="Sair para o mapa">✕</button><button class="back" data-act="prev" aria-label="Paragem anterior" title="Paragem anterior" ${S.i>0?'':'disabled'}>‹</button><div class="bar"><i style="width:${pct}%"></i></div><span class="hearts" aria-label="vidas">${'♥'.repeat(S.hearts)}<span style="opacity:.25">${'♥'.repeat((w.hearts||3)-S.hearts)}</span></span></div>
 <div class="wtag">${w.name} · paragem ${S.i+1}/${w.steps.length}${(()=>{const lv=st.lv||(st.t==='learn'?0:['trace','eulerize','nn'].includes(st.t)?2:1);return lv?`<span class="lv lv${lv}">${['','Fácil','Médio','Nível teste'][lv]}</span>`:''})()}</div><div class="card" id="card">`;
 if(st.ctx)h+=`<div class="enun"><b>Enunciado</b>${st.ctx}</div>`;
 const gfx=g=>`<div class="gwrap">${g}</div>`;
 const tipBtn=()=>st.hint&&!sub.done?(sub.showHint?`<div class="tip"><b>Truque</b>${st.hint}</div>`:`<button class="hintbtn" data-act="hint">Preciso de um truque</button>`):'';
 const fb=()=>sub.done?`<div class="fb ok"><b>Certo!</b>${st.why}</div><button class="btn next" data-act="next">Continuar</button>`:(sub.msg?`<div class="fb bad"><b>Ainda não…</b>${sub.msg}</div>`:'');
 if(st.t==='learn'){
  h+=`<h2>${st.title}</h2>${st.g?gfx(svgGraph(G[st.g],{showDeg:st.showDeg})):''}${st.body}${st.tip?`<div class="tip"><b>Truque</b>${st.tip}</div>`:''}${st.exam?`<div class="exam">${st.exam}</div>`:''}<button class="btn next" data-act="next">Percebi!</button>`;
 } else if(st.t==='mc'){
  sub.tried=sub.tried||[];
  h+=`<h2>${st.q}</h2>${st.g?gfx(svgGraph(G[st.g],{showDeg:st.showDeg})):''}<div class="opts">${st.opts.map((o,k)=>{const c=sub.done&&k===st.a?'ok':sub.tried.includes(k)?'bad':'';return`<button class="opt ${c}" data-opt="${k}" ${sub.done||sub.tried.includes(k)?'disabled':''}>${o}</button>`}).join('')}</div>${tipBtn()}${fb()}`;
 } else if(st.t==='num'){
  h+=`<h2>${st.q}</h2>${st.g?gfx(svgGraph(G[st.g],{showDeg:st.showDeg})):''}<form class="row" data-form="num"><input class="num" id="num-${S.w}-${S.i}" type="number" inputmode="numeric" placeholder="A tua resposta" ${sub.done?'disabled':''} value="${sub.val??''}"><button class="btn" ${sub.done?'disabled':''}>Verificar</button></form>${tipBtn()}${fb()}`;
 } else if(st.t==='trace'){
  sub.path=sub.path||[];sub.used=sub.used||[];
  const g=G[st.g];
  h+=`<h2>${st.q}</h2><div class="gwrap">${svgGraph(g,{tap:!sub.done,used:sub.used,cur:sub.path[sub.path.length-1],visited:sub.path,showDeg:st.mode==='euler'})}</div>
  <div class="pathline">${sub.path.length?sub.path.join(' → '):'<span class="small">Toca no vértice onde queres começar.</span>'}</div>
  <div class="small">${st.mode==='euler'?`Arestas usadas: ${sub.used.length} de ${g.e.length}`:`Vértices visitados: ${new Set(sub.path).size} de ${Object.keys(g.v).length}${st.end?` (termina em ${st.end})`:''}`}</div>
  ${sub.done?'':`<div class="row"><button class="btn ghost" data-act="undo">Desfazer</button><button class="btn ghost" data-act="clear">Recomeçar</button></div>`}${tipBtn()}${fb()}`;
 } else if(st.t==='eulerize'){
  sub.dups=sub.dups||[];
  h+=`<h2>${st.q}</h2><div class="gwrap">${svgGraph(G[st.g],{edgeTap:!sub.done,dups:sub.dups,showDeg:true})}</div>
  <div class="small">Arestas duplicadas: ${sub.dups.length}. Toca outra vez numa aresta para tirar a cópia.</div>
  ${sub.done?'':`<button class="btn" data-act="checkEul">Verificar</button>`}${tipBtn()}${fb()}`;
 } else if(st.t==='nn'){
  sub.path=sub.path||[st.start];sub.used=sub.used||[];
  const g=G[st.g];
  h+=`<h2>${st.q}</h2><div class="gwrap">${svgGraph(g,{tap:!sub.done,used:sub.used,cur:sub.path[sub.path.length-1],visited:sub.path})}</div>
  <div class="pathline">${sub.path.join(' → ')}</div>${sub.done?`<div class="big">Peso total: ${sub.total}</div>`:''}${tipBtn()}${fb()}`;
 } else if(st.t==='just'){
  // Justificação escrita: o aluno escreve, vê a resposta-modelo e conta os pontos (não tira vidas)
  sub.crit=sub.crit||[];
  h+=`<h2>${st.q}</h2>${st.g?gfx(svgGraph(G[st.g])):''}
  <label class="small" for="just-${st.id}">A tua resposta (escreve como no teste):</label>
  <textarea class="ans" id="just-${st.id}" data-just="${st.id}" rows="6" placeholder="Escreve aqui a tua justificação…">${escTxt(justLoad(st.id))}</textarea>
  ${sub.model?`<div class="model"><b>Resposta-modelo</b>${st.model}</div>
  <div class="crits"><b>Marca o que escreveste:</b>${st.crit.map(([c,p],k)=>`<label class="crit"><input type="checkbox" data-crit="${k}"${sub.crit[k]?' checked':''}><span>${c}</span><b>${p} pts</b></label>`).join('')}</div>
  <div class="big" id="score">${justScore(st)}</div>`:`<button class="btn ghost" data-act="model">Ver resposta-modelo</button>`}
  <button class="btn next" data-act="next">Continuar</button>`;
 }
 h+='</div>';
 app.innerHTML=h;
}
/* Modo justificação: texto guardado no localStorage, pontos dos critérios */
function justLoad(id){try{return localStorage.getItem(KEY+'-just-'+id)||''}catch(e){return ''}}
function justSave(id,txt){try{localStorage.setItem(KEY+'-just-'+id,txt)}catch(e){}}
function escTxt(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
function justScore(st){const tot=st.crit.reduce((s,c)=>s+c[1],0),got=st.crit.reduce((s,c,k)=>s+(S.sub.crit[k]?c[1]:0),0);return `Terias ${got} de ${tot} pontos`}
function bad(msg,cost){const sub=S.sub;sub.msg=msg;if(cost){S.hearts--;if(S.hearts<=0){S.view='over';delete save.prog[W[S.w].id];persist();return render()}}render();const c=document.getElementById('card');c&&c.classList.add('shake')}
function good(){S.sub.done=true;S.sub.msg='';save.xp+=10;persist();render()}
function stars3(){const m=W[S.w].hearts||3;return Math.max(1,Math.round(S.hearts/m*3))}
function next(){const w=W[S.w];S.i++;S.sub=S.subs[S.i]||(S.subs[S.i]={});nav({w:S.w,i:S.i,sid:S.sid});if(S.i>=w.steps.length){S.view='end';delete save.prog[w.id];persist();if(!S.ended){S.ended=1;const prev=save.stars[w.id]||0;save.stars[w.id]=Math.max(prev,stars3());save.xp+=stars3()*10;persist()}}render();window.scrollTo(0,0)}
function endScr(){
 const w=W[S.w];
 app.innerHTML=`<div class="end"><h1>${w.name} completa!</h1><div class="bigstars">${starsHTML(stars3())}</div><p>${S.hearts===(w.hearts||3)?'Sem erros. Estás pronto para esta parte!':stars3()>=2?'Muito bem! Revê o que falhaste e tenta as 3 estrelas.':'Conseguiste! Repete esta linha para fixar a matéria.'}</p>
 <div class="row" style="justify-content:center">${S.w<W.length-1?`<button class="btn" style="background:var(${W[S.w+1].c})" data-w="${S.w+1}">Próxima linha</button>`:''}<button class="btn ghost" data-w="${S.w}">Repetir</button><button class="btn ghost" data-act="home">Mapa</button></div></div>`;
}
function overScr(){
 app.innerHTML=`<div class="end"><h1>Ficaste sem vidas</h1><p>Não faz mal: errar faz parte de aprender. Lê com calma os truques e tenta outra vez.</p><div class="row" style="justify-content:center"><button class="btn" data-w="${S.w}">Tentar de novo</button><button class="btn ghost" data-act="sheet">Ver a cábula</button></div></div>`;
}

/* ---------- INTERAÇÃO ---------- */
function tapVertex(v){
 const st=W[S.w].steps[S.i],sub=S.sub,g=G[st.g];if(sub.done)return;
 const cur=sub.path[sub.path.length-1];
 if(st.t==='trace'&&st.mode==='euler'){
  if(!cur){if(st.start&&v!==st.start)return bad(`Neste exercício começa em ${st.start}.`);sub.path.push(v);sub.msg='';return render()}
  const idx=g.e.findIndex(([a,b],i)=>!sub.used.includes(i)&&((a===cur&&b===v)||(b===cur&&a===v)));
  if(idx<0){const any=g.e.some(([a,b])=>(a===cur&&b===v)||(b===cur&&a===v));return bad(any?`Já usaste a aresta ${cur}–${v}. Num trajeto não se repetem arestas.`:`Não há aresta entre ${cur} e ${v}.`)}
  sub.used.push(idx);sub.path.push(v);sub.msg='';
  if(sub.used.length===g.e.length){
   if(st.closed&&sub.path[0]!==v)return bad('Usaste todas as arestas, mas não voltaste ao início. Num circuito acabas onde começaste. Recomeça.');
   return good()}
  const left=g.e.some(([a,b],i)=>!sub.used.includes(i)&&(a===v||b===v));
  if(!left)return bad(`Ficaste preso em ${v}: já não há arestas livres a sair daqui. Desfaz ou recomeça.`);
  return render();
 }
 if(st.t==='trace'&&st.mode==='ham'){
  const n=Object.keys(g.v).length;
  if(!cur){if(st.start&&v!==st.start)return bad(`Neste exercício começa em ${st.start}.`);sub.path.push(v);sub.msg='';return render()}
  const idx=g.e.findIndex(([a,b])=>(a===cur&&b===v)||(b===cur&&a===v));
  if(idx<0)return bad(`${cur} e ${v} não estão ligados.`);
  // Percurso de Hamilton (com "end"): não volta ao início, tem de acabar no vértice end
  // "open": percurso sem fim fixo (acaba em qualquer vértice, depois de visitar todos)
  if(st.end||st.open){
   if(sub.path.includes(v))return bad(`Já passaste em ${v}. No percurso de Hamilton cada vértice é visitado uma só vez.`);
   if(st.end&&v===st.end&&sub.path.length<n-1)return bad(`Chegaste a ${v} cedo demais: ainda há vértices por visitar. Tenta outro caminho.`);
   sub.used.push(idx);sub.path.push(v);sub.msg='';
   if(sub.path.length===n)return !st.end||v===st.end?good():bad(`Visitaste todos, mas o percurso tem de acabar em ${st.end}. Desfaz e tenta outra ordem.`);
   return render();
  }
  if(v===sub.path[0]&&sub.path.length===n){sub.used.push(idx);sub.path.push(v);return good()}
  if(sub.path.includes(v))return bad(`Já passaste em ${v}. No circuito hamiltoniano cada vértice é visitado uma só vez${sub.path.length===n?'':' (exceto o regresso ao início, no fim)'}.`);
  sub.used.push(idx);sub.path.push(v);sub.msg='';
  if(sub.path.length===n&&!g.e.some(([a,b])=>(a===v&&b===sub.path[0])||(b===v&&a===sub.path[0])))return bad(`Visitaste todos, mas ${v} não está ligado a ${sub.path[0]}, por isso não consegues voltar. Desfaz e tenta outra ordem.`);
  if(sub.path.length===n)sub.msg='';
  return render();
 }
 if(st.t==='nn'){
  const verts=Object.keys(g.v),n=verts.length;
  const w=(a,b)=>{const e=g.e.find(([x,y])=>(x===a&&y===b)||(x===b&&y===a));return e?e[2]:Infinity};
  let exp;
  if(sub.path.length===n&&!st.open)exp=sub.path[0];else exp=verts.filter(x=>!sub.path.includes(x)).sort((a,b)=>w(cur,a)-w(cur,b))[0];
  if(v!==exp){if(v===cur)return;return bad(sub.path.length===n?'Já visitaste todos. Agora volta ao vértice inicial.':`De ${cur} para ${v} pesa ${w(cur,v)===Infinity?'—':w(cur,v)}${sub.path.includes(v)?' e esse vértice já foi visitado':''}. Há uma opção mais leve.`,true)}
  const idx=g.e.findIndex(([x,y])=>(x===cur&&y===v)||(y===cur&&x===v));
  sub.used.push(idx);sub.path.push(v);sub.msg='';
  if(sub.path.length===(st.open?n:n+1)){sub.total=sub.used.reduce((s,i)=>s+g.e[i][2],0);return good()}
  return render();
 }
}
app.addEventListener('click',e=>{
 const t=e.target;
 const vg=t.closest('[data-v]');if(vg&&S.view==='step'){return tapVertex(vg.dataset.v)}
 const ed=t.closest('[data-e]');if(ed&&S.view==='step'){const i=+ed.dataset.e,d=S.sub.dups;const k=d.indexOf(i);k<0?d.push(i):d.splice(k,1);S.sub.msg='';return render()}
 const rs=t.closest('[data-reset]');if(rs){S={view:'home',confirm:+rs.dataset.reset};return render()}
 const ws=t.closest('[data-w]');if(ws)return startWorld(+ws.dataset.w);
 const op=t.closest('[data-opt]');if(op){const st=W[S.w].steps[S.i],k=+op.dataset.opt;if(k===st.a)return good();S.sub.tried.push(k);return bad(st.hint,true)}
 const a=t.closest('[data-act]');if(!a)return;
 const act=a.dataset.act,sub=S.sub;
 if(act==='home'){if(S.view==='sheet'&&history.state&&history.state.v==='sheet')return history.back();S={view:'home'};nav({v:'home'});render();window.scrollTo(0,0)}
 else if(act==='sheet'){S={view:'sheet'};nav({v:'sheet'});render();window.scrollTo(0,0)}
 else if(act==='prev')prevStep();
 else if(act==='reset'){if(a.dataset.sure){save={stars:{},xp:0,prog:{}};W.forEach(resetWorld);render()}else{a.dataset.sure=1;a.textContent='Tens a certeza? Toca outra vez'}}
 else if(act==='resetW'){resetWorld(W[+a.dataset.i]);S={view:'home'};render()}
 else if(act==='cancelReset'){S={view:'home'};render()}
 else if(act==='next')next();
 else if(act==='hint'){sub.showHint=true;render()}
 else if(act==='model'){sub.model=true;render()}
 else if(act==='undo'){if(sub.path.length){sub.path.pop();while(sub.used.length>Math.max(0,sub.path.length-1))sub.used.pop()}sub.msg='';render()}
 else if(act==='clear'){sub.path=[];sub.used=[];sub.msg='';render()}
 else if(act==='checkEul'){const st=W[S.w].steps[S.i],d=deg(G[st.g],sub.dups);const odd=Object.keys(d).filter(k=>d[k]%2);
  if(odd.length)return bad(`Ainda há vértices de grau ímpar: ${odd.join(', ')}.`);
  if(sub.dups.length>st.min)return bad(`Funciona, mas usaste ${sub.dups.length} duplicações. Dá para fazer com ${st.min}.`);
  good()}
});
app.addEventListener('input',e=>{const t=e.target;if(t.dataset.just)justSave(t.dataset.just,t.value)});
app.addEventListener('change',e=>{const t=e.target;if(t.dataset.crit==null)return;S.sub.crit[+t.dataset.crit]=t.checked;const sc=document.getElementById('score');if(sc)sc.textContent=justScore(W[S.w].steps[S.i])});
app.addEventListener('submit',e=>{e.preventDefault();const st=W[S.w].steps[S.i];const inp=e.target.querySelector('input');const v=parseFloat(String(inp.value).replace(',','.'));S.sub.val=inp.value;if(isNaN(v))return bad('Escreve um número.');if(v===st.a)return good();bad(st.hint,true)});
try{history.replaceState({v:'home'},'')}catch(e){}
render();
