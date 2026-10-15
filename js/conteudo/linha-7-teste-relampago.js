/* Linha Roxa: teste-relâmpago.
   Tipos de passo: learn (lição), mc (escolha múltipla), num (número), trace (traçar), eulerize,
   nn (vizinho mais próximo), just (justificação). lv = nível (1 Fácil, 2 Médio, 3 Nível teste);
   ctx = enunciado; hint = truque; why = explicação. */
const LINHA_RELAMPAGO={id:'w5',c:'--l5',name:'Linha Roxa',title:'Teste-relâmpago (estilo teste a pares)',steps:[
 {t:'learn',title:'Modo teste',body:`<p>Perguntas misturadas de todas as linhas, como no teste de 16 de outubro. Tenta não usar o truque!</p>`,tip:'No teste tens 50 minutos e régua. Desenha os grafos com cuidado e marca os graus ao lado de cada vértice.'},
 {t:'mc',q:'Um grafo conexo tem graus 2, 4, 4, 6, 2. Admite…',opts:['Circuito euleriano','Trajeto euleriano mas não circuito','Nenhum dos dois'],a:0,hint:'Quantos ímpares?',why:'Todos pares → circuito euleriano.'},
 {t:'num',q:'Carteiro chinês: sai de A e volta a A. Qual é a distância mínima?',g:'post2',a:21,hint:'B e D são ímpares. Compara: B–D direto (6), B–A–D (2+3) e B–C–D (3+2). Soma todas as ruas e junta o caminho duplicado.',why:'Soma das ruas = 16. O caminho mais barato entre B e D é B–A–D (ou B–C–D) = 5, mais barato que o direto (6). Total = 16 + 5 = 21.'},
 {t:'num',q:'Um grafo tem 6 vértices, todos de grau 3. Quantas arestas tem?',a:9,hint:'Soma dos graus ÷ 2.',why:'6 × 3 = 18, e 18 ÷ 2 = 9.'},
 {t:'mc',q:'Uma câmara quer limpar todas as ruas de um bairro, sem repetir e voltando ao armazém. Que problema é?',opts:['Caixeiro-viajante (Hamilton)','Carteiro chinês (Euler)','Grafo completo'],a:1,hint:'Tem de passar em todas as RUAS ou em todas as CASAS?',why:'Todas as ruas → arestas → Euler / carteiro chinês.'},
 {t:'mc',q:'Um vendedor tem de visitar 5 lojas uma vez cada e voltar à sede. Que problema é?',opts:['Carteiro chinês','Caixeiro-viajante (circuito hamiltoniano)','Trajeto euleriano'],a:1,hint:'Visita LOCAIS (vértices).',why:'Visitar todos os vértices uma vez e voltar → circuito hamiltoniano.'},
 {t:'num',q:'Quantas arestas tem K₈?',a:28,hint:'8 × 7 ÷ 2',why:'56 ÷ 2 = 28.'},
 {t:'mc',q:'Um grafo conexo tem exatamente 2 vértices de grau ímpar, P e Q. Para ter um circuito euleriano basta…',opts:['Duplicar as arestas do caminho mais curto entre P e Q','Apagar o vértice P','Acrescentar uma aresta nova de P a Q, mesmo que não exista'],a:0,hint:'Lembra-te da regra da eulerização.',why:'Duplicando o caminho mais curto entre P e Q, ambos ficam pares sem inventar arestas.'},
 {t:'num',q:'Quantos circuitos hamiltonianos (contando os dois sentidos) tem K₆, fixado o vértice inicial?',a:120,hint:'(n − 1)! sem dividir por 2.',why:'5! = 120.'},
 {t:'mc',q:'Qual é a diferença principal entre circuito euleriano e hamiltoniano?',opts:['Euler usa todas as arestas uma vez; Hamilton visita todos os vértices uma vez','São a mesma coisa','Euler visita vértices; Hamilton usa arestas'],a:0,hint:'Carteiro vs turista.',why:'Euler → arestas. Hamilton → vértices.'},
]};
