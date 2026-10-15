/* Linha Azul: noções básicas de grafos.
   Tipos de passo: learn (lição), mc (escolha múltipla), num (número), trace (traçar), eulerize,
   nn (vizinho mais próximo), just (justificação). lv = nível (1 Fácil, 2 Médio, 3 Nível teste);
   ctx = enunciado; hint = truque; why = explicação. */
const LINHA_BASICO={id:'w1',c:'--l1',name:'Linha Azul',title:'Noções básicas de grafos',steps:[
 {t:'learn',title:'O que é um grafo?',g:'basic',body:`<p>Imagina um mapa com <b>cidades</b> e <b>estradas</b>. Um grafo é só isso: pontinhos ligados por linhas.</p>
 <ul><li><b>Vértices</b> = os pontos (A, B, C…)</li><li><b>Arestas</b> = as linhas que os ligam</li><li><b>Ordem</b> do grafo = número de <b>vértices</b> (as arestas não contam!)</li><li><b>Adjacentes</b> = dois vértices ligados por uma aresta</li><li><b>Lacete</b> = aresta que sai e volta ao mesmo vértice (vê o E)</li><li><b>Arestas paralelas</b> = duas ou mais arestas entre os mesmos dois vértices</li><li><b>Vértice isolado</b> = grau 0; <b>vértice terminal</b> = grau 1</li></ul>`,
 tip:'Se duas linhas se cruzam no desenho, isso <b>não</b> é um vértice! Só contam as bolinhas.'},
 {t:'learn',title:'O grau de um vértice',g:'basic',showDeg:true,body:`<p>O <b>grau</b> é quantas pontas de arestas tocam no vértice. É como contar quantas estradas chegam a uma cidade.</p>
 <p>O número na bolinha colorida é o grau. <b style="color:var(--bad)">Vermelho = ímpar</b>, <b style="color:var(--ok)">verde = par</b>.</p>`,
 tip:'O <b>lacete conta 2</b> para o grau, porque toca duas vezes no vértice. O E tem grau 4: duas arestas normais + lacete (2).'},
 {t:'num',q:'Quantas arestas tem este grafo? (o lacete também é uma aresta)',g:'basic',a:7,hint:'Conta linha a linha: AB, BC, CD, DE, EA, BD e o lacete em E.',why:'São 7 arestas. Repara: a soma dos graus (2+3+2+3+4) dá 14, que é 2 × 7.'},
 {t:'num',q:'Um grafo tem 6 vértices e 8 arestas. Qual é a ordem do grafo?',a:6,hint:'A ordem conta os vértices, não as arestas.',why:'Ordem = número de vértices = 6.'},
 {t:'learn',title:'O truque do aperto de mão',body:`<p>Cada aresta tem <b>duas pontas</b>, logo conta 2 vezes na soma dos graus.</p>
 <div class="big">Soma dos graus = 2 × nº de arestas</div>
 <p>Consequência: a soma é sempre par, por isso <b>o número de vértices de grau ímpar é sempre par</b> (0, 2, 4…).</p>`,
 tip:'Se te pedem um grafo com graus 3, 3, 2, 1, soma: 9. É ímpar, logo esse grafo <b>não existe</b>.'},
 {t:'num',q:'Um grafo tem 9 arestas. Quanto dá a soma dos graus de todos os vértices?',a:18,hint:'Soma dos graus = 2 × arestas.',why:'2 × 9 = 18.'},
 {t:'mc',q:'É possível existir um grafo cujos vértices tenham graus 4, 3, 3, 2, 1?',opts:['Sim','Não, porque a soma dos graus é ímpar','Não, porque há um vértice de grau 1'],a:1,hint:'Soma os graus. O resultado tem de ser par.',why:'4+3+3+2+1 = 13, ímpar. Também se vê pelos ímpares: há três vértices de grau ímpar (3, 3, 1), e esse número tem de ser par.'},
 {t:'learn',title:'Tipos de grafos (como na Ficha 1)',g:'k4',body:`<ul><li><b>Simples</b>: não tem lacetes nem arestas paralelas.</li>
 <li><b>Multigrafo</b>: não é simples (tem lacetes e/ou arestas paralelas).</li>
 <li><b>Regular</b>: todos os vértices têm o <b>mesmo grau</b>.</li>
 <li><b>Completo</b>: é simples e cada par de vértices está ligado.</li></ul>
 <p>Este grafo (K₄) é simples, regular (todos com grau 3) e completo.</p>`,
 tip:'Para ver se é <b>regular</b>, escreve o grau de cada vértice: têm de ser todos iguais. Todo o grafo completo é regular, mas nem todo o regular é completo (um quadrado é regular de grau 2 e não é completo).'},
 {t:'mc',q:'O grafo do início (com o lacete em E) é…',g:'basic',opts:['Simples e regular','Não é simples, porque tem um lacete','Completo'],a:1,hint:'Procura lacetes ou arestas paralelas.',why:'Tem um lacete em E, por isso não é simples. Também não é regular: os graus são 2, 3, 2, 3 e 4.'},
 {t:'mc',q:'Um quadrado A–B–C–D–A (sem diagonais) é…',opts:['Regular, mas não completo','Completo','Nem regular nem completo'],a:0,hint:'Calcula os graus. Depois vê se A está ligado a C.',why:'Todos têm grau 2, por isso é regular. Não é completo: A e C não estão ligados.'},
 {t:'learn',title:'Conexo, completo e ponte',g:'bridge',body:`<ul><li><b>Conexo</b>: dá para ir de qualquer vértice a qualquer outro (está tudo "num só bocado").</li>
 <li><b>Completo</b>: todos os vértices estão ligados a todos. Com n vértices chama-se <b>Kₙ</b>.</li>
 <li><b>Ponte</b>: aresta que, se a apagares, o grafo parte-se em dois. Aqui é a <b>C–D</b>.</li></ul>
 <div class="big">Kₙ tem n × (n − 1) ÷ 2 arestas</div>`,
 tip:'Para K₅: 5 × 4 ÷ 2 = 10 arestas. Cada vértice tem grau n − 1.'},
 {t:'mc',q:'Neste grafo, qual destas arestas é uma ponte?',g:'bridge',opts:['A–B','C–D','D–E','B–C'],a:1,hint:'Imagina que tiras a aresta. O grafo fica separado em dois bocados?',why:'Sem C–D, o triângulo ABC fica separado do triângulo DEF.'},
 {t:'num',q:'Quantas arestas tem o grafo completo K₆?',a:15,hint:'n × (n − 1) ÷ 2, com n = 6.',why:'6 × 5 ÷ 2 = 15.'},
 {t:'learn',title:'Passeios no grafo',body:`<ul><li><b>Passeio</b>: sequência de arestas seguidas; pode repetir tudo.</li>
 <li><b>Trajeto</b>: passeio que <b>não repete arestas</b>.</li>
 <li><b>Caminho</b>: passeio que <b>não repete vértices</b>.</li>
 <li><b>Circuito</b>: trajeto que <b>começa e acaba no mesmo vértice</b>.</li></ul>`,
 tip:'Pensa num passeio de bicicleta: trajeto = nunca passas duas vezes na mesma rua. Circuito = e ainda chegas a casa.'},
 {t:'mc',q:'Um trajeto que começa e termina no mesmo vértice chama-se…',opts:['Caminho fechado com arestas repetidas','Circuito','Ponte','Lacete'],a:1,hint:'É a palavra para um passeio que volta a casa.',why:'Circuito = trajeto fechado.'},
 {t:'learn',title:'Da tabela (ou da história) para o grafo',body:`<p>Muitas perguntas do teste dão uma <b>tabela</b> ou uma <b>história</b> em vez do desenho. Tu fazes o grafo:</p>
 <ul><li>Cada cidade, pessoa ou sala é um <b>vértice</b>.</li><li>Cada ligação (estrada, jogo, porta) é uma <b>aresta</b>.</li><li>Confirma no fim: <b>soma dos graus = 2 × nº de arestas</b>.</li></ul>
 <p>Dois desenhos diferentes podem ser <b>o mesmo grafo</b>, se tiverem os mesmos pares ligados.</p>`,
 tip:'Num grafo só interessa <b>quem está ligado a quem</b>. A posição dos pontos e o tamanho das linhas não contam.'},
 {t:'num',lv:2,q:'Tabela de ligações: A liga a B, C e D. B liga a A e C. C liga a A, B e D. D liga a A e C. Quantas arestas tem o grafo?',a:5,hint:'Os graus são o número de ligações de cada um. Soma-os e divide por 2.',why:'Graus: 3 + 2 + 3 + 2 = 10, e 10 ÷ 2 = 5 arestas. Cada ligação aparece duas vezes na tabela (A–B e B–A).'},
 {t:'mc',lv:2,q:'Num torneio de xadrez há 8 jogadores. Cada um joga com outros 3. O grafo do torneio é…',opts:['Regular de grau 3, com 12 arestas','Completo, com 28 arestas','Regular de grau 8, com 24 arestas'],a:0,hint:'Jogadores = vértices, jogos = arestas. Soma dos graus ÷ 2.',why:'Todos têm grau 3, logo é regular. Arestas: 8 × 3 ÷ 2 = 12 jogos. Não é completo: cada um só joga com 3 dos outros 7.'},
 {t:'mc',lv:1,ctx:`Dois desenhos com os vértices L, M, N e P. Nos dois, as ligações são L–N, M–N, M–P e N–P.<div class="gpair"><div class="gwrap">${svgGraph(G.iso1)}</div><div class="gwrap">${svgGraph(G.iso2)}</div></div>`,q:'Estes dois desenhos são…',opts:['O mesmo grafo','Grafos diferentes','Depende do tamanho das linhas'],a:0,hint:'Compara só os pares ligados. A forma do desenho não conta.',why:'Têm exatamente os mesmos pares ligados, por isso são o mesmo grafo, só desenhado de outra maneira.'},
]};
