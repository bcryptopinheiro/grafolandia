/* Linha Cinzenta: justifica como no teste.
   Tipos de passo: learn (lição), mc (escolha múltipla), num (número), trace (traçar), eulerize,
   nn (vizinho mais próximo), just (justificação). lv = nível (1 Fácil, 2 Médio, 3 Nível teste);
   ctx = enunciado; hint = truque; why = explicação. */
const LINHA_JUSTIFICA={id:'wj',c:'--l8',name:'Linha Cinzenta',title:'Justifica como no teste',steps:[
 {t:'learn',title:'Como se justifica no teste',body:`<p>No teste, grande parte dos pontos vem do que <b>escreves</b>, não só do resultado.</p>
 <ul><li>1. Escreve a tua resposta na caixa, como farias no teste.</li><li>2. Toca em <b>Ver resposta-modelo</b>.</li><li>3. Marca os critérios que cumpriste e vê quantos pontos terias.</li></ul>
 <p>Esta linha <b>não tira vidas</b>. O que escreves fica guardado neste telemóvel.</p>`,
 tip:'Usa sempre o esquema: <b>dados</b> (graus, pesos) → <b>regra</b> (teorema ou algoritmo) → <b>conclusão</b>.'},
 {t:'just',id:'j1',lv:3,ctx:'Exercício A.',g:'sqd',q:'O grafo admite circuito de Euler? E trajeto de Euler? Justifica.',
  model:'<p>Graus: A = 3, B = 2, C = 3, D = 2.</p><p>O grafo é conexo e tem exatamente 2 vértices de grau ímpar (A e C).</p><p>Pelo teorema de Euler, <b>não admite circuito</b> de Euler, mas <b>admite trajeto</b> de Euler, que começa em A e acaba em C (ou ao contrário).</p>',
  crit:[['Indica os graus de todos os vértices',4],['Refere que o grafo é conexo',2],['Identifica os 2 vértices ímpares (A e C)',2],['Conclui corretamente: sem circuito, com trajeto de A para C',4]]},
 {t:'just',id:'j2',lv:3,ctx:'Exercício B.',q:'Pode existir um grafo cujos vértices tenham graus 4, 3, 3, 2 e 1? Justifica.',
  model:'<p>Soma dos graus: 4 + 3 + 3 + 2 + 1 = 13.</p><p>Em qualquer grafo, soma dos graus = 2 × nº de arestas, por isso a soma é <b>sempre par</b>.</p><p>Como 13 é ímpar, esse grafo <b>não pode existir</b>.</p><p class="small">Outra forma: há 3 vértices de grau ímpar, e esse número tem de ser par.</p>',
  crit:[['Calcula a soma dos graus (13)',3],['Refere que soma dos graus = 2 × arestas (logo, é par)',4],['Conclui que o grafo não existe',3]]},
 {t:'just',id:'j3',lv:3,ctx:'Exercício C. O grafo do Exercício 2 da Linha Turquesa.',g:'fich',q:'Euleriza o grafo duplicando o menor número possível de arestas. Justifica.',
  model:'<p>Graus: A = 2, B = 4, C = 3, D = 3, E = 4, F = 1, G = 1. Há 4 vértices ímpares: C, D, F e G.</p><p>F e G só estão ligados a B: duplico <b>B–F</b> e <b>B–G</b> (F e G ficam com 2, B fica com 6).</p><p>C e D são vizinhos: duplico <b>C–D</b> (ficam com 4).</p><p>Agora todos os graus são pares, com <b>3 arestas duplicadas</b>. Não dá com 2: cada cópia teria de ligar dois ímpares, e a única aresta entre ímpares é C–D.</p>',
  crit:[['Indica os graus de todos os vértices',3],['Identifica os 4 vértices ímpares (C, D, F, G)',2],['Duplica só arestas que já existem: B–F, B–G e C–D',3],['Confirma que todos os graus ficam pares',2],['Explica porque 3 é o mínimo',2]]},
 {t:'just',id:'j4',lv:3,ctx:'Exercício D. Carteiro chinês.',g:'post2',q:'O carteiro sai de A, percorre todas as ruas e volta a A. Calcula a distância mínima. Justifica.',
  model:'<p>Graus: A = 2, B = 3, C = 2, D = 3. B e D são ímpares, por isso é preciso eulerizar.</p><p>Caminhos de B a D: B–D = 6; B–A–D = 2 + 3 = 5; B–C–D = 3 + 2 = 5.</p><p>O mais barato pesa <b>5</b> (por exemplo B–A–D): duplico essas arestas.</p><p>Soma de todas as ruas: 2 + 3 + 2 + 3 + 6 = 16.</p><p>Distância mínima: 16 + 5 = <b>21</b>.</p>',
  crit:[['Indica os graus e os vértices ímpares (B e D)',3],['Compara os caminhos entre B e D (6, 5 e 5)',3],['Escolhe o caminho de menor peso (5)',2],['Soma todas as ruas (16)',2],['Conclui: 16 + 5 = 21',2]]},
 {t:'just',id:'j5',lv:3,ctx:'Exercício E. Algoritmo de Fleury.',g:'bridge',q:'Aplica o algoritmo de Fleury a partir de C. Indica a ordem das arestas e explica porque se deixa C–D para mais tarde.',
  model:'<p>C e D têm grau 3 (ímpares): há trajeto de Euler de C para D.</p><p>Ordem: 1. C–A, 2. A–B, 3. B–C, 4. C–D, 5. D–E, 6. E–F, 7. F–D.</p><p>No início, <b>C–D é uma ponte</b>. Se a atravessasse logo, não podia voltar ao triângulo ABC e ficavam arestas por usar.</p><p>Pelo algoritmo de Fleury, só se atravessa uma ponte quando não há alternativa.</p>',
  crit:[['Começa em C (vértice ímpar)',2],['Escreve a ordem certa das 7 arestas',4],['Explica que C–D é uma ponte',2],['Refere a regra de Fleury (ponte só sem alternativa)',2]]},
 {t:'just',id:'j6',lv:3,ctx:'Exercício F.',g:'star',q:'O grafo tem circuito de Hamilton? Justifica.',
  model:'<p><b>Não.</b> A, B e C têm grau 1: só estão ligados a D.</p><p>Num circuito, cada vértice precisa de 2 arestas: uma para chegar e outra para sair.</p><p>Entrava-se em A e não havia por onde sair. Logo, não há circuito de Hamilton.</p>',
  crit:[['Indica que A, B e C têm grau 1',3],['Refere que num circuito cada vértice precisa de 2 arestas',4],['Conclui que não há circuito de Hamilton',3]]},
 {t:'just',id:'j7',lv:3,ctx:'Exercício G. Um vendedor sai de Lisboa (L), visita Porto (P), Coimbra (C) e Faro (F) e volta a Lisboa.',g:'tsp',q:'Aplica os mínimos sucessivos (vizinho mais próximo) a partir de L e compara com o método de todas as hipóteses. O que concluis?',
  model:'<p><b>Mínimos sucessivos</b> a partir de L: L → C (205), C → P (120), P → F (553), F → L (278). Total: 205 + 120 + 553 + 278 = <b>1156 km</b>.</p><p><b>Todas as hipóteses</b> ((4 − 1)! ÷ 2 = 3 circuitos):</p><ul><li>L-P-C-F-L = 313 + 120 + 438 + 278 = 1149</li><li>L-P-F-C-L = 313 + 553 + 438 + 205 = 1509</li><li>L-C-P-F-L = 205 + 120 + 553 + 278 = 1156</li></ul><p>O melhor é L-P-C-F-L, com <b>1149 km</b>.</p><p>Conclusão: os mínimos sucessivos são rápidos, mas aqui <b>não deram o ótimo</b> (1156 &gt; 1149).</p>',
  crit:[['Escreve o percurso do vizinho mais próximo (L-C-P-F-L)',3],['Calcula o total: 1156 km',2],['Calcula os 3 circuitos possíveis',4],['Indica o melhor: L-P-C-F-L, 1149 km',2],['Conclui que o método rápido não deu o ótimo',2]]},
 {t:'just',id:'j8',lv:3,ctx:'Exercício H.',g:'k4',q:'O grafo é simples? É regular? É completo? Quantas arestas tem? Justifica.',
  model:'<p><b>Simples</b>: não tem lacetes nem arestas paralelas.</p><p><b>Regular</b>: todos os vértices têm grau 3.</p><p><b>Completo</b>: é simples e cada par de vértices está ligado (é o K₄).</p><p><b>Arestas</b>: 4 × 3 ÷ 2 = 6 (ou soma dos graus: 12 ÷ 2 = 6).</p>',
  crit:[['Simples, com a razão (sem lacetes nem arestas paralelas)',2],['Regular, com os graus (todos 3)',3],['Completo, com a razão (todos os pares ligados)',3],['6 arestas, com o cálculo',2]]},
]};
