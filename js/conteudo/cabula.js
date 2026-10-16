/* Cábula (resumo da matéria), uma secção por tema. Usa os mesmos termos das lições. */
const CABULA=`
 <section style="--c:var(--l1)"><h3>Noções básicas</h3><ul>
 <li><b>Grafo</b>: vértices (pontos) ligados por arestas (linhas)</li>
 <li><b>Ordem</b> = nº de vértices (as arestas não contam)</li>
 <li><b>Grau</b> de um vértice = nº de arestas que lhe tocam (o <b>lacete conta 2</b>)</li>
 <li><b>Adjacentes</b>: dois vértices ligados por uma aresta. <b>Isolado</b>: grau 0. <b>Terminal</b>: grau 1</li>
 <li><b>Lacete</b>: aresta que sai e volta ao mesmo vértice. <b>Arestas paralelas</b>: 2 ou mais arestas entre os mesmos dois vértices</li>
 <li><b>Grafo simples</b>: sem lacetes nem arestas paralelas. <b>Multigrafo</b>: não é simples (tem lacetes e/ou arestas paralelas)</li>
 <li><b>Grafo regular</b>: todos os vértices têm o mesmo grau</li>
 <li><b>Grafo completo (Kₙ)</b>: simples e cada vértice ligado a todos os outros. Tem n(n−1)/2 arestas e cada vértice tem grau n−1</li>
 <li><b>Conexo</b>: dá para ir de qualquer vértice a qualquer outro, mesmo passando por outros (tudo num só bocado). <b>Ponte</b>: aresta que, se a tirares, o grafo deixa de ser conexo (parte-se em dois bocados)</li>
 <li><b>Soma dos graus = 2 × nº de arestas</b> (é sempre par). Por isso, o <b>número de vértices de grau ímpar é sempre par</b> (0, 2, 4…)</li>
 <li><b>Plantas com portas</b>: cada espaço é um vértice (incluindo o exterior, se houver portas para fora); cada porta é uma aresta</li>
 <li><b>Passeio</b>: arestas seguidas. <b>Trajeto</b>: não repete arestas. <b>Caminho</b>: não repete vértices. <b>Circuito</b>: trajeto que acaba onde começou</li>
 <li><b>Graus a partir de um percurso escrito</b> (ex.: A → B → C → A): cada passo é uma aresta; cada vez que um vértice aparece no meio conta 2; o início e o fim de um trajeto contam 1 cada</li>
 </ul></section>
 <section style="--c:var(--l2)"><h3>Euler (todas as arestas)</h3><ul>
 <li><b>Euler ou Hamilton?</b> Portas, ruas, pontes, estradas → arestas → Euler. Salas, cidades, lojas, locais → vértices → Hamilton</li>
 <li><b>Trajeto de Euler</b>: passa por todas as arestas, uma só vez cada. <b>Circuito de Euler</b>: trajeto de Euler que acaba onde começou</li>
 <li><b>Grafo euleriano</b>: tem circuito de Euler. <b>Grafo semieuleriano</b>: tem trajeto de Euler, mas não circuito</li>
 <li><b>Regra (formulário do exame)</b>: um grafo conexo admite circuitos de Euler se e só se todos os seus vértices forem de grau par</li>
 <li>Conexo + <b>0 ímpares</b> → circuito de Euler (<b>grafo euleriano</b>)</li>
 <li>Conexo + <b>2 ímpares</b> → trajeto de Euler, de um ímpar ao outro (<b>grafo semieuleriano</b>)</li>
 <li><b>4 ou mais ímpares</b> → nem circuito nem trajeto</li>
 <li><b>Justifica sempre</b>: "o grafo é conexo" + os graus de todos os vértices + a regra de Euler</li>
 </ul></section>
 <section style="--c:var(--l3)"><h3>Fleury, eulerização, carteiro chinês</h3><ul>
 <li><b>Fleury</b>: se houver 2 ímpares, começa num deles; apaga as arestas usadas; só atravessas uma ponte se não houver alternativa</li>
 <li><b>Eulerizar</b>: duplicar arestas que já existem (nunca criar novas, a não ser que o enunciado o permita)</li>
 <li>Agrupa os vértices ímpares <b>dois a dois</b> e duplica o caminho de menor peso entre cada dupla</li>
 <li><b>Boa eulerização</b>: a que duplica o menor número de arestas (ou o menor peso)</li>
 <li>O nº mínimo de arestas a repetir <b>não depende do ponto de partida</b>: depende só dos vértices ímpares</li>
 <li><b>Carteiro chinês</b>: custo = soma de todos os pesos + pesos das arestas duplicadas</li>
 </ul></section>
 <section style="--c:var(--l4)"><h3>Hamilton (todos os vértices)</h3><ul>
 <li><b>Circuito de Hamilton</b>: passa uma vez em cada vértice e <b>volta ao início</b>. Se tiver um, é um <b>grafo hamiltoniano</b></li>
 <li><b>Percurso de Hamilton</b>: passa uma vez em cada vértice e <b>não volta</b> ao início</li>
 <li><b>Não há regra dos graus</b> para Hamilton: para dizer «há», mostra um circuito; para dizer «não há», dá uma razão</li>
 <li>Um vértice de <b>grau 1</b> não pode estar num circuito (entras e não sais). Um grafo completo (3 ou mais vértices) tem sempre circuito de Hamilton</li>
 <li><b>Esquema em árvore</b>: conta os circuitos a partir do vértice inicial</li>
 <li><b>Fatorial</b>: n! = n × (n−1) × … × 1 (ex.: 4! = 24)</li>
 <li><b>Circuitos em Kₙ</b>: (n−1)! contando o sentido; (n−1)! ÷ 2 sem contar o sentido</li>
 <li><b>Caixeiro-viajante</b>: o circuito de Hamilton com menor peso num <b>grafo pesado</b> (com números nas arestas)</li>
 <li><b>Força bruta</b> (todas as hipóteses): dá sempre o ótimo, mas é lenta</li>
 <li><b>Mínimos sucessivos (vizinho mais próximo)</b>: vai sempre para o mais perto ainda não visitado; rápido, nem sempre ótimo</li>
 <li><b>Ordenação dos pesos</b>: escolhe as arestas da mais leve para a mais pesada; rejeita as que deixam um vértice com grau 3 ou fecham um circuito antes de ter todos os vértices</li>
 </ul></section>
 <section style="--c:var(--l10)"><h3>Digrafos (grafos orientados)</h3><ul>
 <li><b>Digrafo</b>: as arestas têm sentido (setas) e chamam-se <b>arcos</b>; segue sempre as setas</li>
 <li><b>Grau de saída</b> = setas que saem; <b>grau de entrada</b> = setas que chegam</li>
 <li>Soma dos graus de saída = soma dos graus de entrada = nº de arcos</li>
 <li><b>Preferências</b>: começa pelas equipas com menos escolhas (grau de saída 1) e risca esse projeto das outras; pode haver várias atribuições certas</li>
 <li><b>Tarefas</b>: X → Y quer dizer que Y só começa depois de X; tempo mínimo = caminho mais demorado</li>
 </ul></section>
`;
