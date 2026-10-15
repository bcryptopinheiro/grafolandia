/* Linha Amarela: Fleury, eulerização e carteiro chinês.
   Tipos de passo: learn (lição), mc (escolha múltipla), num (número), trace (traçar), eulerize,
   nn (vizinho mais próximo), just (justificação). lv = nível (1 Fácil, 2 Médio, 3 Nível teste);
   ctx = enunciado; hint = truque; why = explicação. */
const LINHA_FLEURY={id:'w3',c:'--l3',name:'Linha Amarela',title:'Fleury, eulerização e carteiro chinês',steps:[
 {t:'learn',title:'Algoritmo de Fleury',g:'bridge',body:`<p>É uma receita para encontrar o circuito ou trajeto euleriano sem te perderes:</p>
 <ul><li>1. Se houver 2 vértices ímpares, começa num deles. Se não, começa onde quiseres.</li>
 <li>2. Cada aresta que percorres é "apagada".</li>
 <li>3. <b>Nunca atravesses uma ponte</b> do grafo que sobra, a não ser que não haja outra opção.</li></ul>`,
 tip:'A ponte é a última saída da ilha. Visita a ilha toda antes de a atravessar, senão ficas preso do outro lado.'},
 {t:'mc',q:'Começas em C (grau 3). Pelo algoritmo de Fleury, qual é a primeira aresta?',g:'bridge',opts:['C–D, porque leva ao outro ímpar','C–A ou C–B','Qualquer uma, tanto faz'],a:1,hint:'Qual das três arestas é uma ponte?',why:'C–D é ponte. Se a usares já, nunca mais voltas ao triângulo ABC. Primeiro dás a volta ao triângulo.'},
 {t:'trace',mode:'euler',closed:false,g:'bridge',q:'Agora faz o trajeto completo com Fleury, a começar em C.',start:'C',hint:'C → A → B → C → D (agora sim a ponte) → E → F → D.',why:'Perfeito. Atravessaste a ponte só quando já não havia alternativa.'},
 {t:'learn',title:'Eulerizar um grafo',g:'k4',showDeg:true,body:`<p>Se há vértices ímpares, não há circuito. A solução é <b>duplicar arestas que já existem</b> para tornar todos os graus pares.</p>
 <ul><li>Olha <b>só para os vértices ímpares</b> e agrupa-os <b>dois a dois</b>, em duplas (os de grau par ficam de fora).</li><li>Em cada dupla, duplica as arestas do caminho mais curto entre os dois vértices.</li><li>Tenta duplicar <b>o menor número possível</b> (ou o menor peso).</li></ul>
 <p>Aqui, no K₄, os 4 vértices são todos ímpares: fazes 2 duplas (por exemplo A com B e C com D) e duplicas A–B e C–D. Se o caminho passar por outro vértice, esse ganha 2 de grau e continua com a mesma paridade.</p>`,
 tip:'<b>Nunca inventes arestas novas!</b> Só podes copiar estradas que já existem. Duplicar uma aresta = passar duas vezes na mesma rua.'},
 {t:'eulerize',g:'k4',min:2,q:'Toca nas arestas para as duplicar até todos os graus ficarem pares (verdes). Usa o mínimo possível.',hint:'Os 4 vértices são ímpares. Agrupa-os em 2 duplas (por exemplo A com B e C com D) e duplica a aresta de cada dupla.',why:'Com 2 duplicações (A–B e C–D, ou A–D e B–C, ou as duas diagonais) todos os graus ficam 4.'},
 {t:'mc',lv:2,ctx:'Um grupo vai passear num jardim. Querem passar por todos os trilhos uma só vez e acabar onde começaram (um circuito de Euler). O grafo dos trilhos é conexo, mas tem 4 vértices de grau ímpar.',q:'Conseguem fazer o passeio assim? Se não, o que podem fazer?',opts:['Não conseguem. Podem eulerizar: repetir o menor número possível de trilhos, para todos os graus ficarem pares','Conseguem, se começarem num vértice ímpar','Não conseguem, e não há nada a fazer'],a:0,hint:'Com vértices ímpares não há circuito de Euler. Lembra-te do que fizeste na pergunta anterior.',why:'Com 4 vértices ímpares não há circuito de Euler (nem trajeto). A solução é <b>eulerizar</b>, como acabaste de fazer: agrupar os vértices ímpares dois a dois e repetir os trilhos do caminho mais curto entre cada dupla. Assim todos os graus ficam pares e o passeio fica possível, passando duas vezes nesses trilhos.'},
 {t:'learn',title:'O problema do carteiro chinês',g:'post',body:`<p>Um carteiro tem de passar por <b>todas as ruas</b> e voltar à estação, a andar o mínimo possível. Os números são os pesos (distâncias, tempos ou custos).</p>
 <ul><li>1. Se todos os graus são pares, o custo é a soma dos pesos.</li>
 <li>2. Se não, euleriza da forma <b>mais barata</b>.</li>
 <li>3. Custo total = soma de todos os pesos + pesos das arestas duplicadas.</li></ul>`,
 tip:'Para ligar dois ímpares, compara os caminhos possíveis e escolhe o de <b>menor peso</b>, mesmo que tenha mais arestas.'},
 {t:'mc',q:'Neste grafo, A e C são ímpares. Qual é a eulerização mais barata?',g:'post',opts:['Duplicar A–C (peso 5)','Duplicar A–B e B–C (peso 7)','Duplicar A–D e D–C (peso 7)'],a:0,hint:'Soma os pesos de cada opção.',why:`A–C direto custa 5, menos que 3+4 = 7 ou 4+3 = 7.${svgEuler(G.post,[['A','C']])}`},
 {t:'num',q:'Qual é o custo total do percurso ótimo do carteiro?',g:'post',a:24,hint:'Soma todos os pesos (3+4+3+4+5) e junta o peso da aresta duplicada.',why:`19 (todas as ruas) + 5 (A–C repetida) = 24.${svgEuler(G.post,[['A','C']])}`},
 {t:'mc',q:'Ao eulerizar um grafo, é permitido…',opts:['Acrescentar uma aresta entre dois vértices que não estavam ligados','Duplicar arestas já existentes','Apagar arestas'],a:1,hint:'O carteiro não pode construir estradas novas.',why:'Só duplicas arestas existentes: representam passar de novo numa rua que já existe. Só se o enunciado disser que se podem construir ligações novas (como num exame de 2023) é que se acrescentam arestas.'},
]};
