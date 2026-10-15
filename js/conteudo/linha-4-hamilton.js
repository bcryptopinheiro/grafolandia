/* Linha Rosa: circuitos hamiltonianos e caixeiro-viajante.
   Tipos de passo: learn (lição), mc (escolha múltipla), num (número), trace (traçar), eulerize,
   nn (vizinho mais próximo), just (justificação). lv = nível (1 Fácil, 2 Médio, 3 Nível teste);
   ctx = enunciado; hint = truque; why = explicação. */
const LINHA_HAMILTON={id:'w4',c:'--l4',name:'Linha Rosa',title:'Circuitos hamiltonianos',steps:[
 {t:'learn',title:'Hamilton: visitar todas as casas',g:'ham',body:`<p>Um <b>circuito hamiltoniano</b> passa por <b>todos os vértices exatamente uma vez</b> e volta ao início. Não precisa de usar todas as arestas!</p>
 <p>Um grafo com um circuito destes chama-se <b>grafo hamiltoniano</b>.</p>`,
 tip:'<b>Euler = carteiro</b> (todas as RUAS). <b>Hamilton = turista</b> (todas as CIDADES, uma vez cada).'},
 {t:'trace',mode:'ham',g:'ham',q:'Encontra um circuito hamiltoniano: toca em cada vértice uma vez e volta ao primeiro.',hint:'O F tem de ficar "entre" dois dos vértices A, C ou D. Tenta A → B → C → F → D → E → A.',why:'Visitaste todos os vértices uma única vez e voltaste ao início.'},
 {t:'learn',title:'Percurso (caminho) de Hamilton',body:`<ul><li><b>Circuito (ou ciclo) de Hamilton</b>: passa por todos os vértices uma vez <b>e volta ao início</b>.</li>
 <li><b>Percurso (ou caminho) de Hamilton</b>: passa por todos os vértices uma vez, <b>sem voltar</b> ao início.</li></ul>
 <p>No percurso, o vértice onde começas e o vértice onde acabas são diferentes.</p>`,
 tip:'Começa pelos vértices com <b>poucas ligações</b>: são os que mais limitam. Num circuito, um vértice de <b>grau 2</b> tem de usar as suas duas arestas.'},
 {t:'trace',lv:3,mode:'ham',g:'hp',start:'F',end:'G',q:'Encontra um percurso de Hamilton que comece em F e termine em G.',hint:'Só há uma solução! Tenta F → B → A → …',why:'F → B → A → E → D → C → G. Passaste em todos os vértices uma só vez e acabaste em G.'},
 {t:'learn',title:'Contar com um esquema em árvore',g:'arv',body:`<p>Para contar caminhos ou circuitos sem te perderes, faz uma <b>árvore</b>:</p>
 <ul><li>Começa no vértice inicial.</li><li>Em cada ramo, escreve os vizinhos <b>ainda não visitados</b>.</li><li>Um ramo "morre" quando não há para onde ir.</li><li>Conta os ramos que chegam ao fim com <b>todos os vértices</b>.</li></ul>
 <p>Num grafo pesado, escreve a soma dos pesos no fim de cada ramo e escolhe a <b>menor</b>.</p>`,
 tip:'Para circuitos, no fim confirma se o último vértice está ligado ao inicial. Cada circuito aparece 2 vezes na árvore (um em cada sentido).'},
 {t:'num',lv:3,g:'arv',q:'Quantos caminhos diferentes há de A até D, passando por todos os vértices uma só vez?',a:2,hint:'Faz a árvore a partir de A e guarda só os ramos que acabam em D com os 5 vértices.',why:'São 2: A–B–C–E–D e A–E–C–B–D.'},
 {t:'num',lv:3,g:'arv',q:'Quantos circuitos de Hamilton diferentes (sem contar o sentido) começam e acabam em A?',a:4,hint:'Faz a árvore a partir de A. Conta os ramos com os 5 vértices que voltam a A e divide por 2.',why:'A árvore dá 8 percursos que voltam a A. Cada circuito aparece nos dois sentidos: 8 ÷ 2 = 4. São A-B-C-D-E-A, A-B-D-C-E-A, A-B-D-E-C-A e A-C-B-D-E-A.'},
 {t:'mc',q:'Este grafo (estrela) tem circuito hamiltoniano?',g:'star',opts:['Sim','Não: para sair de A, B ou C terias de voltar a passar no D'],a:1,hint:'A, B e C só estão ligados a D.',why:'Vértices de grau 1 nunca podem estar num circuito: entras e não tens por onde sair.'},
 {t:'learn',title:'Quantos circuitos há em Kₙ?',body:`<p>Num grafo completo há sempre circuitos hamiltonianos. Fixando o vértice de partida:</p>
 <div class="big">(n − 1)! circuitos<br><span class="small">ou (n − 1)! ÷ 2 se não contarmos o sentido</span></div>
 <p>Exemplo K₄: 3! = 6 percursos, que são 3 circuitos diferentes (cada um feito nos dois sentidos).</p>`,
 tip:'A-B-C-D-A e A-D-C-B-A são <b>o mesmo circuito</b>, ao contrário. Por isso se divide por 2. Lê bem o enunciado!'},
 {t:'num',q:'Quantos circuitos hamiltonianos diferentes (sem contar o sentido) tem K₅?',a:12,hint:'(n − 1)! ÷ 2 com n = 5. Lembra-te: 4! = 4×3×2×1.',why:'4! = 24, e 24 ÷ 2 = 12.'},
 {t:'learn',title:'O caixeiro-viajante e os algoritmos',g:'k5',body:`<p>Um grafo com números nas arestas chama-se <b>grafo pesado</b> (ou ponderado).</p>
 <p>Com pesos nas arestas, queremos o circuito hamiltoniano <b>mais barato</b>: é o <b>problema do caixeiro-viajante</b>.</p>
 <ul><li><b>Força bruta</b>: testa todos os circuitos. Dá sempre o ótimo, mas demora muito.</li>
 <li><b>Mínimos sucessivos</b> (vizinho mais próximo): em cada vértice vai para o mais perto ainda não visitado. No fim volta ao início. Rápido, mas <b>nem sempre ótimo</b>.</li>
 <li><b>Ordenação dos pesos</b> (ou ordenação do peso das arestas): escolhe as arestas da mais leve para a mais pesada, rejeitando as que deixam um vértice com grau 3 ou fecham um circuito antes de ter todos os vértices.</li></ul>`,
 tip:'Nos mínimos sucessivos (vizinho mais próximo), quando há empate escolhe-se ao acaso (ou como o enunciado disser).',
 exam:'<b>No teste:</b> escreve o percurso completo (ex.: A-D-B-C-E-A) e a soma dos pesos (3+6+5+2+9 = 25).'},
 {t:'nn',g:'k5',start:'A',q:'Aplica o algoritmo dos mínimos sucessivos (vizinho mais próximo) a partir de A. Toca nos vértices pela ordem certa.',hint:'Olha para os pesos que saem do vértice onde estás e escolhe o menor que leve a um vértice ainda não visitado.',why:'A → D → B → C → E → A, com peso total 3 + 6 + 5 + 2 + 9 = 25.'},
 {t:'mc',lv:2,q:'Um camião tem de visitar 10 lojas e voltar ao armazém (grafo K₁₀). Porque é que o método de todas as hipóteses não é viável?',opts:['Porque há 9! ÷ 2 = 181 440 circuitos para calcular','Porque não dá a solução ótima','Porque só funciona com 4 vértices'],a:0,hint:'Usa (n − 1)! ÷ 2 com n = 10.',why:'9! ÷ 2 = 181 440 circuitos. Dá o ótimo, mas demora demasiado: não tem <b>viabilidade económica</b> (custa muito tempo e dinheiro). Por isso usam-se métodos rápidos, como os mínimos sucessivos (vizinho mais próximo) ou a ordenação dos pesos, mesmo que nem sempre deem o ótimo.'},
 {t:'mc',q:'O algoritmo dos mínimos sucessivos (vizinho mais próximo)…',opts:['Dá sempre a solução ótima','É rápido mas pode não dar a solução ótima','Só funciona em grafos eulerianos'],a:1,hint:'Só pensa no passo seguinte, não no percurso todo.',why:'É um algoritmo "guloso": escolhe o melhor de cada vez, e isso nem sempre dá o melhor total.'},
 {t:'mc',q:'Algoritmo da ordenação dos pesos: qual destas escolhas é proibida?',opts:['Escolher a aresta mais leve disponível','Escolher uma aresta que deixe um vértice com grau 3','Escolher uma aresta que fecha o circuito no fim, com todos os vértices'],a:1,hint:'Num circuito, cada vértice tem exatamente 2 arestas.',why:'Num circuito hamiltoniano cada vértice tem grau 2. Grau 3 é proibido.'},
]};
