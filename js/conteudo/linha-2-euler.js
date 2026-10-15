/* Linha Verde: trajetos e circuitos eulerianos.
   Tipos de passo: learn (lição), mc (escolha múltipla), num (número), trace (traçar), eulerize,
   nn (vizinho mais próximo), just (justificação). lv = nível (1 Fácil, 2 Médio, 3 Nível teste);
   ctx = enunciado; hint = truque; why = explicação. */
const LINHA_EULER={id:'w2',c:'--l2',name:'Linha Verde',title:'Trajetos e circuitos eulerianos',steps:[
 {t:'learn',title:'As pontes de Königsberg',g:'kon',body:`<p>Em 1736, os habitantes de Königsberg perguntavam: dá para passear pela cidade passando <b>uma só vez</b> em cada uma das 7 pontes?</p>
 <p>Euler transformou a cidade num grafo: as zonas de terra são vértices e as pontes são arestas.</p>`,
 tip:'Euler = <b>carteiro</b>. Quer passar por <b>todas as ruas (arestas)</b> uma única vez.'},
 {t:'learn',title:'A regra de ouro de Euler',body:`<p>Primeiro confirma que o grafo é <b>conexo</b>. Depois conta os vértices de <b>grau ímpar</b>:</p>
 <ul><li><b>0 ímpares</b> → há <b>circuito euleriano</b> (volta ao início)</li>
 <li><b>2 ímpares</b> → há <b>trajeto euleriano</b>: começa num ímpar e acaba no outro</li>
 <li><b>4 ou mais</b> → não há nenhum dos dois</li></ul>`,
 tip:'Conta só os ímpares: <b>0 → circuito, 2 → trajeto, mais → nada</b>. Um grafo com circuito de Euler chama-se <b>grafo euleriano</b>; se só tiver trajeto, chama-se <b>semieuleriano</b>.',
 exam:'<b>Como justificar no teste:</b> "O grafo é conexo e todos os vértices têm grau par, logo, pelo teorema de Euler, admite um circuito euleriano." Escreve sempre os graus de todos os vértices.'},
 {t:'mc',q:'Königsberg: os graus são I=5, N=3, S=3, L=3. O passeio é possível?',g:'kon',opts:['Sim, é um circuito euleriano','Sim, é um trajeto euleriano','Não, há 4 vértices de grau ímpar'],a:2,hint:'Quantos vértices têm grau ímpar?',why:'Os 4 vértices têm grau ímpar. Com mais de 2 ímpares não existe trajeto nem circuito euleriano.'},
 {t:'mc',q:'Este grafo tem…',g:'sqd',showDeg:true,opts:['Circuito euleriano','Trajeto euleriano (mas não circuito)','Nenhum'],a:1,hint:'Conta as bolinhas vermelhas.',why:'Só A e C têm grau ímpar (3). Há trajeto euleriano a começar em A e acabar em C, ou ao contrário.'},
 {t:'mc',q:'E este (K₄)?',g:'k4',opts:['Circuito euleriano','Trajeto euleriano','Nenhum'],a:2,hint:'Em K₄ cada vértice liga-se aos outros 3.',why:'Os 4 vértices têm grau 3, ímpar. Com 4 ímpares não há nada.'},
 {t:'trace',mode:'euler',closed:true,g:'bowtie',q:'Desenha um circuito euleriano: toca nos vértices pela ordem do circuito. Usa todas as arestas uma vez e volta ao início.',hint:'Todos os graus são pares, podes começar onde quiseres. Passa pelo C duas vezes: ele tem grau 4.',why:'Boa! Um circuito possível é A → B → C → D → E → C → A.'},
 {t:'trace',mode:'euler',closed:false,g:'house',q:'A "casinha": desenha-a sem levantar o lápis e sem repetir linhas. Onde tens de começar?',hint:'C e D têm grau 3 (ímpar). Começa num deles e acabarás no outro.',why:'Exato. Só dá se começares num vértice ímpar (C ou D). Acabas sempre no outro ímpar.'},
 {t:'mc',q:'Um grafo conexo tem trajeto euleriano que começa em P. Onde acaba?',opts:['Em P','No outro vértice de grau ímpar','Num vértice de grau par qualquer'],a:1,hint:'Num trajeto euleriano, quantos vértices ímpares há?',why:'Há exatamente 2 vértices ímpares: o trajeto começa num e acaba no outro.'},
]};
