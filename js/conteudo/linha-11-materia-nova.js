/* Matéria da nova matriz: complemento de Hamilton, coloração, árvores mínimas,
   caminhos críticos e crescimento linear. Mantém as linhas antigas intactas. */
Object.assign(G, {
  tspOrdenacao:{v:{A:[55,45],B:[150,25],C:[245,55],D:[235,165]},e:[['A','B',5],['A','C',8],['A','D',6],['B','C',4],['B','D',9],['C','D',7]],h:220},
  coloracao:{v:{M:[50,55],P:[150,10],F:[250,55],H:[230,180],I:[70,180]},e:[['M','P'],['M','F'],['P','F'],['F','H'],['H','I']],h:235},
  kruskal:{v:{A:[45,45],B:[145,25],C:[95,130],D:[220,65],E:[245,175]},e:[['A','B',3],['A','C',1],['B','C',4],['B','D',2],['C','D',5],['C','E',6],['D','E',7]],h:225}
});

const LINHA_CAIXEIRO_EXTRA={id:'w12',c:'--l12',name:'Linha Coral',title:'Caixeiro-viajante: ordenação',steps:[
 {t:'learn',title:'O método da ordenação, passo a passo',g:'tspOrdenacao',body:`<p>Já conheces os <b>mínimos sucessivos</b>. A matriz também pede o algoritmo por <b>ordenação dos pesos</b>: ordenamos todas as arestas e construímos o circuito mais leve sem fechar cedo demais.</p>
 <p>Neste exemplo, as distâncias entre quatro cidades são os números nas arestas. Um peso representa, por exemplo, quilómetros, minutos ou euros.</p>
 <ol><li>Ordenar: <b>BC 4, AB 5, AD 6, CD 7, AC 8, BD 9</b>.</li><li>Escolher BC, AB e AD: nenhuma cidade fica com mais de duas arestas.</li><li>Escolher CD: fecha um circuito e já inclui as quatro cidades. Parar.</li></ol>
 <div class="big">A → B → C → D → A<br>5 + 4 + 7 + 6 = 22 km</div>
 <p>As outras arestas não entram no circuito. Neste exemplo, os outros dois circuitos pesam 27 km e 29 km, por isso 22 km é também o melhor.</p>`,
 tip:'Rejeita uma aresta se deixar um vértice com grau 3 ou se fechar um circuito antes de incluir todas as cidades. A última aresta pode fechar o circuito quando já lá estão todas.'},
 {t:'mc',lv:2,g:'tspOrdenacao',q:'Na ordenação, depois de escolher BC (4), AB (5) e AD (6), o que fazes com CD (7)?',opts:['Escolho: fecha o circuito só depois de incluir as quatro cidades','Rejeito: qualquer circuito é proibido','Rejeito: D já tem duas arestas'],a:0,hint:'A, B, C e D já estão ligados. Confirma quantas arestas ficam em cada vértice.',why:'CD completa o circuito A–B–C–D–A. Cada vértice fica com grau 2 e o circuito inclui todas as cidades, portanto é a altura de parar.'},
 {t:'num',lv:2,g:'tspOrdenacao',q:'Qual é o peso total do circuito obtido pela ordenação?',a:22,hint:'Soma AB + BC + CD + DA: 5 + 4 + 7 + 6.',why:'5 + 4 + 7 + 6 = 22 km. Não te esqueças de contar a última aresta que fecha a volta.'}
]};

const LINHA_COLORACAO={id:'w13',c:'--l13',name:'Linha Verde-Clara',title:'Coloração de grafos',steps:[
 {t:'learn',title:'Cores para coisas incompatíveis',g:'coloracao',showDeg:true,body:`<p>Colorir um grafo é dar uma cor a cada vértice de modo que <b>vértices ligados tenham cores diferentes</b>. O objetivo é usar o menor número de cores. Esse número chama-se <b>número cromático</b>.</p>
 <p>Exemplo: cada vértice é uma disciplina e cada aresta liga disciplinas com alunos em comum. A cor pode representar o dia do exame.</p>
 <p>No grafo, a ordem dos graus é <b>F (3), M (2), P (2), H (2), I (1)</b>. Aplicando Welsh–Powell:</p>
 <ul><li>Cor 1: F; depois I, que não está ligado a F.</li><li>Cor 2: M; depois H, que não está ligado a M.</li><li>Cor 3: P.</li></ul>
 <div class="big">Dia 1: F e I<br>Dia 2: M e H<br>Dia 3: P</div>
 <p>São precisas pelo menos 3 cores porque M, P e F formam um triângulo: cada par está ligado.</p>`,
 tip:'Welsh–Powell: ordena do maior grau para o menor; numa cor, percorre a lista e junta os vértices que não estão ligados a nenhum vértice dessa cor. Repete com os que faltam.'},
 {t:'mc',lv:1,g:'coloracao',showDeg:true,q:'Na primeira cor, que vértices podes colorir juntos se começares por F?',opts:['F e I','F e M','F e H'],a:0,hint:'Procura na lista um vértice que não tenha aresta até F.',why:'F está ligado a M, P e H, mas não a I. Por isso a primeira cor é {F, I}.'},
 {t:'mc',lv:2,g:'coloracao',showDeg:true,q:'Qual é o menor número de cores para este grafo?',opts:['2','3','5'],a:1,hint:'O triângulo M–P–F obriga a usar três cores diferentes.',why:'O triângulo precisa de pelo menos 3 cores. Welsh–Powell encontra uma coloração com 3: {F,I}, {M,H}, {P}. Logo o número cromático é 3.'}
]};

const LINHA_ARVORES={id:'w14',c:'--l14',name:'Linha Pinhal',title:'Árvores abrangentes mínimas',steps:[
 {t:'learn',title:'Ligar tudo sem gastar a mais',g:'kruskal',body:`<p>Uma <b>árvore</b> é um grafo conexo sem circuitos. Uma árvore <b>abrangente</b> liga todos os vértices. A árvore abrangente <b>mínima</b> tem o menor peso total possível.</p>
 <p>É útil para ligar casas com cabo, criar uma rede de estradas ou instalar tubos com o menor custo.</p>
 <div class="big">Com n vértices, uma árvore tem n − 1 arestas.</div>
 <p><b>Kruskal:</b> ordena todas as arestas e escolhe as mais leves, saltando as que criam circuitos. <b>Prim:</b> começa num vértice e junta sempre a aresta mais leve que liga a árvore a um vértice ainda de fora.</p>
 <p>Para estas cinco casas, Kruskal escolhe AC (1), BD (2), AB (3) e CE (6). Rejeita BC e CD porque criariam circuitos. Total: <b>12 centenas de euros</b>.</p>`,
 tip:'Kruskal pode ter vários bocados ligados a meio. Prim cresce sempre a partir do bocado que já começou. Ambos param com n − 1 arestas.'},
 {t:'mc',lv:2,g:'kruskal',q:'No Kruskal, por que rejeitamos BC (peso 4) neste exemplo?',opts:['Criaria o circuito A–B–C–A','É mais pesada do que todas as outras','Deixa E isolado'],a:0,hint:'AC e AB já foram escolhidas. O que acontece ao juntar B a C?',why:'AC, AB e BC formariam o circuito A–B–C–A. Kruskal nunca escolhe uma aresta que fecha circuito.'},
 {t:'num',lv:1,q:'Uma árvore abrangente tem 7 vértices. Quantas arestas tem?',a:6,hint:'Usa n − 1.',why:'7 − 1 = 6 arestas. Assim fica tudo ligado sem circuitos.'},
 {t:'mc',lv:2,g:'kruskal',q:'Qual é o custo da árvore mínima deste exemplo?',opts:['12 centenas de euros','15 centenas de euros','21 centenas de euros'],a:0,hint:'Soma AC + BD + AB + CE: 1 + 2 + 3 + 6.',why:'1 + 2 + 3 + 6 = 12 centenas de euros, ou seja, 1200 €.'}
]};

const LINHA_CRITICO={id:'w15',c:'--l15',name:'Linha Azul-Clara',title:'Caminhos críticos',steps:[
 {t:'learn',title:'A tarefa mais demorada manda no prazo',body:`<p>Num projeto, algumas tarefas só podem começar quando outras terminam. O <b>caminho crítico</b> é o caminho mais longo do início ao fim. A sua duração é o tempo mínimo para concluir o projeto.</p>
 <p>Festa: A escolher tema (2 dias); B comprar decoração (3, depende de A); C enviar convites (1, depende de A); D encomendar bolo (4, depende de A); E decorar sala (2, depende de B); F confirmar presenças (3, depende de C); G preparação final (1, depende de D, E e F).</p>
 <div class="big">A → B → E → G<br>2 + 3 + 2 + 1 = 8 dias</div>
 <p><b>Ida:</b> calcula o início mais cedo; numa tarefa com várias predecessoras, usa o maior tempo de fim. <b>Volta:</b> calcula o início mais tarde sem atrasar o projeto; se houver tarefas seguintes, usa o menor limite. <b>Folga</b> = início mais tarde − início mais cedo. Folga zero significa tarefa crítica.</p>
 <table class="tab inteiro"><tr><th>Tarefa</th><th>Início cedo</th><th>Início tarde</th><th>Folga</th></tr><tr><td>A</td><td>0</td><td>0</td><td>0</td></tr><tr><td>B</td><td>2</td><td>2</td><td>0</td></tr><tr><td>C</td><td>2</td><td>3</td><td>1</td></tr><tr><td>D</td><td>2</td><td>3</td><td>1</td></tr><tr><td>E</td><td>5</td><td>5</td><td>0</td></tr><tr><td>F</td><td>3</td><td>4</td><td>1</td></tr><tr><td>G</td><td>7</td><td>7</td><td>0</td></tr></table>`,
 tip:'Em G, espera-se o maior dos fins de D (6), E (7) e F (6): G começa no dia 7. O caminho crítico é A–B–E–G; se uma tarefa dele atrasar, o projeto atrasa.'},
 {t:'num',lv:2,q:'Quanto tempo demora, no mínimo, o projeto da festa?',a:8,hint:'Compara os três caminhos: A-B-E-G; A-C-F-G; A-D-G.',why:'As durações são 8, 7 e 7 dias. O caminho crítico A–B–E–G é o mais longo, portanto o projeto demora pelo menos 8 dias.'},
 {t:'mc',lv:2,q:'Qual destas tarefas tem folga zero no exemplo?',opts:['C – enviar convites','D – encomendar o bolo','E – decorar a sala'],a:2,hint:'As tarefas críticas estão no caminho A–B–E–G.',why:'E está no caminho crítico, por isso a sua folga é zero. C, D e F têm uma folga de um dia.'},
 {t:'num',lv:3,q:'A tarefa G depende de D, E e F. D acaba no dia 6, E no dia 7 e F no dia 6. Qual é o início mais cedo de G?',a:7,hint:'G só começa depois de todas as predecessoras. Usa o maior dos tempos de fim.',why:'Tem de esperar por todas as tarefas. O maior tempo de fim é o de E: dia 7.'}
]};

const LINHA_LINEAR={id:'w16',c:'--l16',name:'Linha Laranja-Clara',title:'Crescimento linear',steps:[
 {t:'learn',title:'Sempre o mesmo aumento',body:`<p>Há crescimento linear quando uma quantidade aumenta (ou diminui) sempre o mesmo valor por período. Esse valor fixo é a <b>razão r</b>; os termos formam uma progressão aritmética.</p>
 <p>A Ana começa com 20 € e guarda mais 5 € por semana. Começa no termo de ordem zero:</p>
 <div class="big">u(0) = 20<br>u(n + 1) = u(n) + r<br>u(n) = u(0) + n × r<br>u(n) = 20 + 5n</div>
 <p>Ao fim de 10 semanas: u(10) = 20 + 5 × 10 = <b>70 €</b>. Para chegar aos 100 €: 20 + 5n = 100, logo n = <b>16 semanas</b>.</p>
 <p>Se o enunciado der u(1), usa u(n) = u(1) + (n − 1)r. Para somar n termos: <b>S(n) = (u(1) + u(n)) × n ÷ 2</b>. É a média do primeiro e do último, vezes o número de termos.</p>
 <div class="gwrap"><svg viewBox="0 0 300 165" role="img" aria-label="Pontos do mealheiro alinhados: 20 euros na semana zero, 45 na semana cinco e 70 na semana dez"><path d="M38 130H275M38 130V20" fill="none" stroke="var(--edge)" stroke-width="2"/><path d="M48 112L145 69L245 27" fill="none" stroke="var(--wc)" stroke-width="3"/><g fill="var(--wc)"><circle cx="48" cy="112" r="5"/><circle cx="145" cy="69" r="5"/><circle cx="245" cy="27" r="5"/></g><g fill="var(--ink)" font-size="12" font-family="system-ui"><text x="44" y="151">0 sem.</text><text x="132" y="151">5 sem.</text><text x="228" y="151">10 sem.</text><text x="50" y="104">20 €</text><text x="148" y="61">45 €</text><text x="248" y="23">70 €</text></g></svg></div>
 <p class="small">Os pontos ficam alinhados. Como n conta semanas inteiras, aparecem pontos, não todos os pontos da linha.</p>`,
 tip:'Pergunta ao enunciado: quer o valor num período (u(n)) ou o total acumulado até esse período (S(n))? São respostas diferentes.'},
 {t:'num',lv:1,q:'A Ana tem 20 € e guarda 5 € por semana. Quanto tem ao fim de 10 semanas?',a:70,hint:'u(10) = 20 + 5 × 10.',why:'u(10) = 20 + 50 = 70 €.'},
 {t:'num',lv:2,q:'A Ana começa com 20 € e guarda 5 € por semana. Ao fim de quantas semanas chega aos 100 €?',a:16,hint:'Resolve 20 + 5n = 100.',why:'5n = 80, logo n = 16 semanas.'},
 {t:'num',lv:2,q:'O João corre 10 minutos na primeira semana e aumenta 5 minutos por semana. Quantos minutos corre na semana 8?',a:45,hint:'u(8) = u(1) + (8 − 1) × 5.',why:'u(8) = 10 + 7 × 5 = 45 minutos. Isto é só a semana 8, não o total.'},
 {t:'num',lv:3,q:'Com os dados do João, quantos minutos corre ao todo nas primeiras 8 semanas?',a:220,hint:'Primeiro acha u(8) = 45. Depois S(8) = (10 + 45) × 8 ÷ 2.',why:'S(8) = 55 × 8 ÷ 2 = 220 minutos. 45 é o tempo da semana 8; 220 é o total acumulado.'}
]};
