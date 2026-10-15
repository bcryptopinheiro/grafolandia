/* Linha Laranja: treino infinito (perguntas geradas).
   Tipos de passo: learn (lição), mc (escolha múltipla), num (número), trace (traçar), eulerize,
   nn (vizinho mais próximo), just (justificação). lv = nível (1 Fácil, 2 Médio, 3 Nível teste);
   ctx = enunciado; hint = truque; why = explicação. */
const LINHA_TREINO={id:'wt',c:'--l7',name:'Linha Laranja',title:'Treino infinito (perguntas novas sempre)',hearts:3,gen:true,steps:[]};

/* Perguntas geradas ao acaso (10 novas em cada ronda) */
function ri(a,b){return a+Math.floor(Math.random()*(b-a+1))}
function fact(n){return n<=1?1:n*fact(n-1)}
function degList(even){let l;do{const n=ri(4,6);l=Array.from({length:n},()=>ri(1,5))}while(even&&l.reduce((a,b)=>a+b,0)%2);return l}
function makeTreino(){
 const sum=l=>l.reduce((a,b)=>a+b,0);
 const G=[
  ()=>{const n=ri(4,12),a=n*(n-1)/2;return{t:'num',lv:1,q:`Quantas arestas tem o grafo completo K<sub>${n}</sub>?`,a,hint:'n × (n − 1) ÷ 2',why:`${n} × ${n-1} ÷ 2 = ${a}.`}},
  ()=>{const n=ri(4,7),a=fact(n-1)/2;return{t:'num',lv:2,q:`Quantos circuitos hamiltonianos diferentes (sem contar o sentido) tem K<sub>${n}</sub>?`,a,hint:'(n − 1)! ÷ 2',why:`${n-1}! = ${fact(n-1)}, e ${fact(n-1)} ÷ 2 = ${a}.`}},
  ()=>{const n=ri(4,6),a=fact(n-1);return{t:'num',lv:2,q:`Fixado o vértice de partida, quantos circuitos hamiltonianos (contando os dois sentidos) tem K<sub>${n}</sub>?`,a,hint:'(n − 1)!, sem dividir por 2.',why:`${n-1}! = ${a}.`}},
  ()=>{const e=ri(5,20);return{t:'num',lv:1,q:`Um grafo tem ${e} arestas. Quanto dá a soma dos graus?`,a:2*e,hint:'Soma dos graus = 2 × arestas.',why:`2 × ${e} = ${2*e}.`}},
  ()=>{const l=degList(true);return{t:'num',lv:2,q:`Os vértices de um grafo têm graus ${l.join(', ')}. Quantas arestas tem?`,a:sum(l)/2,hint:'Soma os graus e divide por 2.',why:`${l.join(' + ')} = ${sum(l)}, e ${sum(l)} ÷ 2 = ${sum(l)/2}.`}},
  ()=>{const l=degList(true),k=l.filter(x=>x%2).length,a=k===0?0:k===2?1:2;return{t:'mc',lv:2,q:`Um grafo conexo tem graus ${l.join(', ')}. Admite…`,opts:['Circuito de Euler','Trajeto de Euler, mas não circuito','Nem trajeto nem circuito de Euler'],a,hint:'Conta os graus ímpares: 0, 2 ou mais?',why:`Há ${k} vértice${k===1?'':'s'} de grau ímpar → ${['circuito de Euler','trajeto de Euler','nem trajeto nem circuito'][a]}.`}},
  ()=>{const l=degList(false),a=sum(l)%2?1:0;return{t:'mc',lv:2,q:`Pode existir um grafo (com lacetes ou arestas paralelas, se for preciso) com graus ${l.join(', ')}?`,opts:['Sim','Não'],a,hint:'A soma dos graus tem de ser par.',why:`A soma é ${sum(l)}, ${a?'ímpar, por isso não pode existir':'par, por isso pode existir'}.`}},
  ()=>{const v=ri(4,12),e=ri(3,20);return{t:'num',lv:1,q:`Um grafo tem ${v} vértices e ${e} arestas. Qual é a ordem do grafo?`,a:v,hint:'A ordem conta os vértices.',why:`Ordem = ${v}.`}},
  ()=>{const k=ri(1,4),m=ri(1,2);return{t:'num',lv:1,q:`Um vértice tem ${k} aresta${k>1?'s':''} normal${k>1?'is':''} e ${m} lacete${m>1?'s':''}. Qual é o grau?`,a:k+2*m,hint:'Cada lacete conta 2.',why:`${k} + 2 × ${m} = ${k+2*m}.`}},
  ()=>{let n,g;do{n=ri(4,10);g=ri(2,5)}while(n*g%2||g>=n);return{t:'num',lv:2,q:`Um grafo regular tem ${n} vértices, todos de grau ${g}. Quantas arestas tem?`,a:n*g/2,hint:'Soma dos graus ÷ 2.',why:`${n} × ${g} = ${n*g}, e ${n*g} ÷ 2 = ${n*g/2}.`}},
  ()=>{const C=[['Um carteiro tem de passar por todas as ruas de uma aldeia.',0],['Um turista quer visitar 6 monumentos, uma vez cada, e voltar ao hotel.',1],['Um camião do lixo percorre todas as estradas de um bairro.',0],['Uma enfermeira visita 5 doentes e volta ao centro de saúde.',1],['Um técnico tem de inspecionar todos os cabos de uma rede.',0],['Uma banda dá concertos em 7 cidades e volta a casa pelo caminho mais curto.',1],['Um limpa-neves tem de limpar todas as estradas da serra.',0]];const[c,a]=C[ri(0,C.length-1)];return{t:'mc',lv:1,q:`${c} É um problema de…`,opts:['Euler (passar por todas as arestas)','Hamilton (passar por todos os vértices)'],a,hint:'Ruas, estradas, cabos → arestas. Locais, cidades, pessoas → vértices.',why:a?'Visita locais (vértices) uma vez cada → Hamilton / caixeiro-viajante.':'Percorre ligações (arestas) → Euler / carteiro chinês.'}}
 ];
 const idx=G.map((_,i)=>i).sort(()=>Math.random()-.5).slice(0,10);
 return idx.map(i=>G[i]());
}
