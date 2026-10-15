// Verifica as contas dos grafos e das respostas da Grafolândia.
// Uso (na pasta do projeto):  node testes/verificar.mjs   (tem de acabar com «Tudo certo ✔»)
// Lê os ficheiros pela ordem do index.html, corre o jogo (sem browser) e confirma graus, contagens e respostas.
import { readFileSync, existsSync } from 'node:fs';
import vm from 'node:vm';

const raiz = new URL('../', import.meta.url);
const html = readFileSync(new URL('index.html', raiz), 'utf8');
const ficheiros = [...html.matchAll(/<script src="([^"]+)"/g)].map((m) => m[1]);
const code = ficheiros.map((f) => readFileSync(new URL(f, raiz), 'utf8')).join('\n');
const fake = { style: { setProperty() {}, removeProperty() {} }, addEventListener() {}, set innerHTML(_) {} };
const ctx = { document: { getElementById: () => fake }, localStorage: { getItem: () => null, setItem() {}, removeItem() {} }, window: { scrollTo() {} }, addEventListener() {}, history: { pushState() {}, replaceState() {}, back() {} }, Math, Date, JSON, String, Object, Array, Set };
vm.createContext(ctx);
vm.runInContext(code + ';globalThis.__G=G;globalThis.__W=W;globalThis.__deg=deg;globalThis.svgGraph=svgGraph;globalThis.__EUL=EULER_SOL;', ctx);
const G = ctx.__G, W = ctx.__W, deg = ctx.__deg;

let fails = 0;
const ok = (cond, msg) => { console.log(`${cond ? '✔' : '✘'} ${msg}`); if (!cond) fails++; };

console.log('— Ficheiros —');
{
  const usados = [...html.matchAll(/<(?:script src|link rel="stylesheet" href)="((?:js|css)\/[^"]+)"/g)].map((m) => m[1]);
  const sw = readFileSync(new URL('sw.js', raiz), 'utf8');
  const faltam = usados.filter((f) => !existsSync(new URL(f, raiz)));
  const semCache = usados.filter((f) => !sw.includes(`'./${f}'`));
  ok(!faltam.length, `todos os ${usados.length} ficheiros do index.html existem ${faltam.join(', ')}`);
  ok(!semCache.length, `todos estão na lista do sw.js (para funcionar offline) ${semCache.join(', ')}`);
}
const fmt = (d) => Object.entries(d).map(([k, v]) => `${k}=${v}`).join(' ');
const nb = (g, x) => g.e.filter(([a, b]) => a === x || b === x).map(([a, b]) => (a === x ? b : a));
const has = (g, x, y) => g.e.some(([a, b]) => (a === x && b === y) || (a === y && b === x));
const w = (g, x, y) => Math.min(...g.e.filter(([a, b]) => (a === x && b === y) || (a === y && b === x)).map((e) => e[2]));
const step = (q) => { for (const l of W) for (const s of l.steps) if ((s.q || s.title || '').includes(q)) return s; throw new Error('Passo não encontrado: ' + q); };

// Todos os caminhos de Hamilton a partir de `s` (lista de vértices)
function hamPaths(g, s) {
  const V = Object.keys(g.v), out = [];
  (function go(p) { if (p.length === V.length) return out.push(p); for (const n of new Set(nb(g, p.at(-1)))) if (!p.includes(n)) go([...p, n]); })([s]);
  return out;
}
// Distância mais curta (Dijkstra simples; sem pesos conta 1 por aresta)
function dist(g, s, t) {
  const D = { [s]: 0 }, todo = new Set(Object.keys(g.v));
  while (todo.size) {
    const u = [...todo].filter((x) => x in D).sort((a, b) => D[a] - D[b])[0]; if (u === undefined) break; todo.delete(u);
    for (const [a, b, p] of g.e) { const o = a === u ? b : b === u ? a : null; if (o && (D[o] ?? Infinity) > D[u] + (p ?? 1)) D[o] = D[u] + (p ?? 1); }
  }
  return D[t];
}
// Menor distância de um ponto a um segmento
function segDist([px, py], [ax, ay], [bx, by]) {
  const dx = bx - ax, dy = by - ay, t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(px - ax - t * dx, py - ay - t * dy);
}

console.log('\n— Desenhos: nenhuma aresta pode passar por cima de outro vértice —');
for (const k of ['fila3', 'tri3', 'dois', 'ilha', 'quad2', 'hp', 'arv', 'iso1', 'iso2', 'ex23', 'dom', 'cartas', 'cartasG', 'acores', 'edifSol', 'vila', 'dg1', 'pref', 'edgar', 'aviao']) {
  const g = G[k], clash = [];
  for (const [a, b] of g.e) for (const [v, P] of Object.entries(g.v)) if (v !== a && v !== b) { const d = segDist(P, g.v[a], g.v[b]); if (d < 24) clash.push(`${a}–${b} passa a ${d.toFixed(0)} de ${v}`); }
  ok(!clash.length, `${k}: desenho limpo ${clash.join('; ')}`);
}

console.log('\n— Conexo e completo —');
{
  const conexo = (g) => { const V = Object.keys(g.v), seen = new Set([V[0]]), st = [V[0]]; while (st.length) { const u = st.pop(); for (const x of nb(g, u)) if (!seen.has(x)) { seen.add(x); st.push(x); } } return seen.size === V.length; };
  const completo = (g) => { const V = Object.keys(g.v); return V.every((a, i) => V.slice(i + 1).every((b) => has(g, a, b))) && g.e.every(([a, b]) => a !== b) && new Set(g.e.map(([a, b]) => [a, b].sort().join())).size === g.e.length; };
  const esperado = { fila3: [true, false], tri3: [true, true], dois: [false, false], sqd: [true, false], ilha: [false, false] };
  for (const [k, [c, k2]] of Object.entries(esperado)) ok(conexo(G[k]) === c && completo(G[k]) === k2, `${k}: ${c ? 'conexo' : 'não conexo'}, ${k2 ? 'completo' : 'não completo'}`);
  const s1 = step('Este grafo é…'), s2 = step('E este grafo?');
  ok(s1.g === 'sqd' && s1.opts[s1.a].startsWith('Conexo, mas não completo') && s2.g === 'ilha' && s2.opts[s2.a] === 'Não é conexo', 'respostas das 2 perguntas novas certas');
}

console.log('\n— Grafo hp (percurso de Hamilton) —');
{
  const g = G.hp, d = deg(g); console.log('  graus:', fmt(d), '| arestas:', g.e.length);
  const p = hamPaths(g, 'F').filter((x) => x.at(-1) === 'G');
  console.log('  percursos de Hamilton de F a G:', p.map((x) => x.join('→')).join(' ; '));
  ok(p.length === 1 && p[0].join('') === 'FBAEDCG', 'há uma única solução: F → B → A → E → D → C → G');
}

console.log('\n— Grafo arv (esquema em árvore) —');
{
  const g = G.arv, d = deg(g); console.log('  graus:', fmt(d), '| soma:', Object.values(d).reduce((a, b) => a + b), '| arestas:', g.e.length);
  const all = hamPaths(g, 'A');
  const toD = all.filter((x) => x.at(-1) === 'D');
  console.log('  caminhos de A a D por todos os vértices:', toD.map((x) => x.join('–')).join(' ; '));
  ok(toD.length === step('Quantos caminhos diferentes há de A até D').a, `resposta ${toD.length}`);
  const circ = all.filter((x) => has(g, x.at(-1), 'A'));
  const und = new Set(circ.map((x) => { const r = [x[0], ...x.slice(1).reverse()]; return [x.join(''), r.join('')].sort()[0]; }));
  console.log(`  ramos da árvore que fecham em A: ${circ.length} → sem contar o sentido: ${und.size}`);
  console.log('   ', [...und].map((s) => s.split('').join('-') + '-A').join(' ; '));
  ok(circ.length === 8 && und.size === step('Quantos circuitos de Hamilton diferentes (sem contar o sentido) começam').a, `resposta ${und.size}`);
}

console.log('\n— Linha Azul —');
{
  const t = { v: { A: 0, B: 0, C: 0, D: 0 }, e: [['A', 'B'], ['A', 'C'], ['A', 'D'], ['B', 'C'], ['C', 'D']] };
  const d = deg(t); console.log('  tabela de ligações → graus:', fmt(d));
  ok(Object.values(d).reduce((a, b) => a + b) / 2 === step('Tabela de ligações').a, 'tabela: 10 ÷ 2 = 5 arestas');
  const s = step('torneio de xadrez'); ok(s.opts[s.a].includes('12') && 8 * 3 / 2 === 12, 'xadrez: 8 × 3 ÷ 2 = 12, regular de grau 3');
  const key = (g) => g.e.map(([a, b]) => [a, b].sort().join('')).sort().join(',');
  ok(key(G.iso1) === key(G.iso2), `iso1 e iso2 têm os mesmos pares: ${key(G.iso1)}`);
}

console.log('\n— Exercício 5 (caixeiro-viajante, tsp) —');
{
  const g = G.tsp, V = Object.keys(g.v);
  const nn = (s) => { const p = [s]; while (p.length < V.length) { const c = p.at(-1); p.push(V.filter((x) => !p.includes(x)).sort((a, b) => w(g, c, a) - w(g, c, b))[0]); } p.push(s); return p; };
  const cost = (p) => p.slice(1).reduce((t, x, i) => t + w(g, p[i], x), 0);
  for (const s of ['L', 'C']) { const p = nn(s); console.log(`  vizinho mais próximo a partir de ${s}: ${p.join('→')} = ${cost(p)} km`); }
  const best = Math.min(...hamPaths(g, 'L').map((p) => cost([...p, 'L'])));
  ok(cost(nn('L')) === 1156 && cost(nn('C')) === 1149 && best === 1149, 'L dá 1156; C dá 1149, que é o ótimo');
}

console.log('\n— Linha Rosa: K₁₀ —');
{ const f = (n) => (n <= 1 ? 1 : n * f(n - 1)); ok(f(9) / 2 === 181440, `9! ÷ 2 = ${f(9) / 2}`); }

console.log('\n— Linha Cinzenta (justificações) —');
{
  const odd = (g) => Object.entries(deg(g)).filter(([, x]) => x % 2).map(([k]) => k);
  console.log('  sqd:', fmt(deg(G.sqd))); ok(odd(G.sqd).join() === 'A,C', 'sqd: só A e C são ímpares → trajeto de A para C, sem circuito');
  ok((4 + 3 + 3 + 2 + 1) % 2 === 1, 'graus 4,3,3,2,1: soma 13, ímpar → não existe');
  console.log('  fich:', fmt(deg(G.fich)), '| ímpares:', odd(G.fich).join(', '));
  const dupIdx = [['B', 'F'], ['B', 'G'], ['C', 'D']].map(([x, y]) => G.fich.e.findIndex(([a, b]) => (a === x && b === y) || (a === y && b === x)));
  ok(!odd({ ...G.fich, e: [...G.fich.e, ...dupIdx.map((i) => G.fich.e[i])] }).length, 'fich: duplicar B–F, B–G e C–D deixa tudo par');
  const O = odd(G.fich), pairings = [[[O[0], O[1]], [O[2], O[3]]], [[O[0], O[2]], [O[1], O[3]]], [[O[0], O[3]], [O[1], O[2]]]];
  const mins = pairings.map((pp) => pp.reduce((t, [a, b]) => t + dist(G.fich, a, b), 0));
  ok(Math.min(...mins) === 3, `fich: mínimo de duplicações = ${Math.min(...mins)} (emparelhamentos: ${mins.join(', ')})`);
  const p2 = G.post2, tot = p2.e.reduce((t, e) => t + e[2], 0), bd = dist(p2, 'B', 'D');
  ok(odd(p2).join() === 'B,D' && tot === 16 && bd === 5 && tot + bd === 21, `post2: ímpares B e D; soma ${tot}; B→D mais curto ${bd}; total ${tot + bd}`);
  const fl = ['C', 'A', 'B', 'C', 'D', 'E', 'F', 'D'], used = new Set();
  const valid = fl.slice(1).every((x, i) => { const k = G.bridge.e.findIndex(([a, b], j) => !used.has(j) && ((a === fl[i] && b === x) || (b === fl[i] && a === x))); if (k < 0) return false; used.add(k); return true; });
  ok(valid && used.size === G.bridge.e.length, 'bridge: C–A, A–B, B–C, C–D, D–E, E–F, F–D usa todas as arestas uma vez');
  ok(['A', 'B', 'C'].every((k) => deg(G.star)[k] === 1), 'star: A, B e C têm grau 1 → sem circuito de Hamilton');
  const dk = deg(G.k4); ok(new Set(Object.values(dk)).size === 1 && dk.A === 3 && G.k4.e.length === 6 && 4 * 3 / 2 === 6, 'k4: regular de grau 3, completo, 6 arestas');
  const J = W.find((l) => l.id === 'wj');
  ok(J && J.steps.filter((s) => s.t === 'just').length >= 8, `Linha Cinzenta tem ${J ? J.steps.filter((s) => s.t === 'just').length : 0} exercícios 'just'`);
  for (const s of (J ? J.steps : []).filter((s) => s.t === 'just')) console.log(`    ${s.id}: ${s.crit.length} critérios, ${s.crit.reduce((t, c) => t + c[1], 0)} pts`);
}

console.log('\n— Linha Castanha: exames nacionais (comparados com as resoluções oficiais do IAVE) —');
{
  const odd = (g) => Object.entries(deg(g)).filter(([, x]) => x % 2).map(([k]) => k);
  // 2023 F2: mínimo de troços novos = nº de ímpares ÷ 2 (resposta oficial (B) 2)
  const o23 = odd(G.ex23); console.log('  2023 F2 graus:', fmt(deg(G.ex23)));
  const s23 = step('número mínimo de troços pedonais');
  ok(o23.length / 2 === 2 && s23.opts[s23.a] === '2', `2023 F2: ímpares ${o23.join(', ')} → ${o23.length / 2} troços (oficial: 2)`);
  // 2024 F1: peças → ímpares C e E; com CE fica tudo par (oficial: C e E)
  const pecas = 'AB AC AE AF BC BD BE CD EF'.split(' ').map((p) => [p[0], p[1]]);
  const key = (e) => e.map(([a, b]) => [a, b].sort().join('')).sort().join(',');
  ok(key(G.dom.e) === key(pecas), 'dom: o grafo tem exatamente as 9 peças do enunciado');
  ok(odd(G.dom).sort().join() === 'C,E' && !odd({ ...G.dom, e: [...G.dom.e, ['C', 'E']] }).length, `2024 F1: ímpares ${odd(G.dom).sort().join(' e ')}; com a peça CE todos ficam pares (oficial: C e E)`);
  // 2024 F2: cartas — arestas geradas a partir das figuras e algarismos
  const cartas = { A: ['o', 1], B: ['q', 1], C: ['t', 1], D: ['o', 2], E: ['t', 3], F: ['q', 4] };
  const build = (cs) => { const k = Object.keys(cs), e = []; for (let i = 0; i < k.length; i++) for (let j = i + 1; j < k.length; j++) if (cs[k[i]][0] === cs[k[j]][0] || cs[k[i]][1] === cs[k[j]][1]) e.push([k[i], k[j]]); return { v: Object.fromEntries(k.map((x) => [x, 0])), e }; };
  ok(key(G.cartas.e) === key(build(cartas).e), 'cartas: as arestas batem com as figuras e algarismos das cartas');
  ok(key(G.cartasG.e) === key(build({ ...cartas, G: ['q', 3] }).e), 'cartasG: G = quadrado 3 liga-se a B, F e E');
  const possiveis = [2, 3].filter((d) => hamPaths(build({ ...cartas, G: ['q', d] }), 'D').some((p) => p.slice(0, 3).join('') === 'DAB'));
  const p3 = hamPaths(build({ ...cartas, G: ['q', 3] }), 'D').filter((p) => p.slice(0, 3).join('') === 'DAB').map((p) => p.join('-'));
  ok(possiveis.join() === '3', `2024 F2: só o 3 dá empilhamento a começar por D, A, B → ${p3.join(' ou ')} (oficial: D-A-B-F-G-E-C ou D-A-B-C-E-G-F)`);
  // 2018 F2: vizinho mais próximo sem voltar (oficial: Faial, Terceira, São Jorge, São Miguel, Pico; 331 €)
  const hab = { 'Santa Maria': 5547, 'São Miguel': 137699, Terceira: 56062, Graciosa: 4393, 'São Jorge': 8998, Pico: 14144, Faial: 15038, Flores: 3791, Corvo: 430 };
  ok(Object.values(hab).filter((x) => x >= 6000).length === step('Em quantas ilhas').a, 'Açores: 5 ilhas com pelo menos 6000 habitantes');
  const g = G.acores, V = Object.keys(g.v), p = ['F'];
  while (p.length < V.length) { const c = p.at(-1); p.push(V.filter((x) => !p.includes(x) && has(g, c, x)).sort((a, b) => w(g, c, a) - w(g, c, b))[0]); }
  const custo = p.slice(1).reduce((t, x, i) => t + w(g, p[i], x), 0);
  ok(p.join('') === 'FTJMP' && custo === 331, `2018 F2: ${p.join(' → ')} = ${custo} € (oficial: 331 €)`);
  // Ordenação dos pesos (algoritmo genérico)
  function ordenacao(gr) {
    const E = [...gr.e].sort((a, b) => a[2] - b[2]), sel = [], rej = [], n = Object.keys(gr.v).length;
    const comp = Object.fromEntries(Object.keys(gr.v).map((k) => [k, k])), find = (x) => (comp[x] === x ? x : (comp[x] = find(comp[x])));
    const dg = Object.fromEntries(Object.keys(gr.v).map((k) => [k, 0]));
    for (const e of E) { const [a, b] = e; const fecha = find(a) === find(b); if (dg[a] >= 2 || dg[b] >= 2 || (fecha && sel.length < n - 1)) { rej.push(e); continue; } sel.push(e); dg[a]++; dg[b]++; comp[find(a)] = find(b); if (sel.length === n) break; }
    return { sel, rej, total: sel.reduce((t, e) => t + e[2], 0) };
  }
  // 2016 EE: tabela de distâncias (oficial: E3 – E5 – E4 – E1 – E2 – E3)
  const tab = { E1: { E2: 166, E3: 206, E4: 125, E5: 287 }, E2: { E3: 151, E4: 264, E5: 169 }, E3: { E4: 207, E5: 109 }, E4: { E5: 309 } };
  const ed = { v: { E1: 0, E2: 0, E3: 0, E4: 0, E5: 0 }, e: Object.entries(tab).flatMap(([a, r]) => Object.entries(r).map(([b, d]) => [a, b, d])) };
  const r16 = ordenacao(ed);
  ok(key(r16.sel) === key(G.edifSol.e) && r16.rej[0][2] === 169, `2016 EE: escolhidas ${r16.sel.map((e) => e[2]).join(', ')} (total ${r16.total} m); 1.ª rejeitada ${r16.rej[0][2]} (oficial: E3-E5-E4-E1-E2-E3)`);
  // 2025 F1: Vilamoura (oficial: C-M-P-V-E-Q-C; distâncias em falta 350, 550, 1100, 1250, 1260)
  const r25 = ordenacao(G.vila);
  ok(key(r25.sel) === key(G.vilaSol.e) && r25.rej[0].slice(0, 2).sort().join('') === 'CE' && r25.total === step('Quantos metros tem o percurso fechado').a, `2025 F1: escolhidas ${r25.sel.map((e) => e[2]).join(', ')} = ${r25.total} m; 1.ª rejeitada E–C`);
  const ciclo = ['C', 'M', 'P', 'V', 'E', 'Q', 'C'];
  ok(ciclo.slice(1).every((x, i) => G.vilaSol.e.some(([a, b]) => (a === ciclo[i] && b === x) || (b === ciclo[i] && a === x))), '2025 F1: o percurso oficial C-M-P-V-E-Q-C usa as arestas escolhidas');
}

console.log('\n— Linha Azul-Escura: digrafos —');
{
  const io = (g) => { const d = {}; for (const k of Object.keys(g.v)) d[k] = { in: 0, out: 0 }; for (const [a, b] of g.e) { d[a].out++; d[b].in++; } return d; };
  const d1 = io(G.dg1);
  console.log('  dg1 (saída/entrada):', Object.entries(d1).map(([k, x]) => `${k}=${x.out}/${x.in}`).join(' '));
  ok(G.dg1.e.length === step('Quantos arcos (setas)').a && d1.B.in === step('grau de entrada do vértice B').a && d1.A.out === step('grau de saída do vértice A').a, 'dg1: 5 arcos; entrada de B = 2; saída de A = 2');
  const reach = (g, s) => { const seen = new Set([s]), st = [s]; while (st.length) { const u = st.pop(); for (const [a, b] of g.e) if (a === u && !seen.has(b)) { seen.add(b); st.push(b); } } return seen; };
  ok(!reach(G.dg1, 'D').has('A'), 'dg1: seguindo as setas não se chega de D a A');
  const arc = (g, a, b) => g.e.some(([x, y]) => x === a && y === b);
  const isCirc = (g, p) => p.slice(1).every((x, i) => arc(g, p[i], x));
  ok(isCirc(G.dg1, ['B', 'C', 'D', 'B']) && !isCirc(G.dg1, ['A', 'B', 'C', 'A']) && !isCirc(G.dg1, ['B', 'D', 'C', 'B']), 'dg1: só B → C → D → B é circuito orientado');
  // Preferências: todas as atribuições possíveis (permutações)
  const E = ['E1', 'E2', 'E3', 'E4', 'E5'], P = ['P1', 'P2', 'P3', 'P4', 'P5'], sols = [];
  (function go(i, used, acc) { if (i === E.length) return sols.push(acc); for (const p of P) if (!used.has(p) && arc(G.pref, E[i], p)) go(i + 1, new Set([...used, p]), [...acc, `${E[i]}→${p}`]); })(0, new Set(), []);
  console.log('  atribuições possíveis:', sols.map((s) => s.join(' ')).join(' | '));
  const dp = io(G.pref);
  ok(E.filter((e) => dp[e].out === 1).join() === 'E2,E5' && dp.P4.in === 2, 'pref: E2 e E5 com grau de saída 1; P4 com grau de entrada 2');
  ok(sols.length === 1 && sols[0].includes('E3→P4') && G.prefSol.e.every(([a, b]) => sols[0].includes(`${a}→${b}`)), 'pref: solução única, com E3 → P4 (igual à resposta-modelo)');
  const usados = G.pref.e.map((e, i) => i).filter((i) => sols[0].includes(`${G.pref.e[i][0]}→${G.pref.e[i][1]}`));
  ok(step('atribui um projeto diferente a cada equipa').model.includes(ctx.svgGraph(G.pref, { used: usados })), `j14: a resposta-modelo mostra as 9 setas e destaca as da solução (arcos ${usados.join(', ')})`);
  // Tarefas: início mais cedo de cada tarefa = maior fim das que lhe chegam
  function agenda(dur, prec) { const fim = {}, ini = {}; const f = (t) => { if (t in fim) return fim[t]; ini[t] = Math.max(0, ...(prec[t] || []).map(f)); return (fim[t] = ini[t] + dur[t]); }; Object.keys(dur).forEach(f); return { ini, fim, total: Math.max(...Object.values(fim)) }; }
  const precOf = (g) => { const p = {}; for (const [a, b] of g.e) (p[b] = p[b] || []).push(a); return p; };
  const durE = { T1: 2, T2: 3, T3: 1, T4: 4, T5: 1, T6: 4 }, pe = precOf(G.edgar), ag = agenda(durE, pe);
  const antes = (t, s = new Set()) => { for (const x of pe[t] || []) { s.add(x); antes(x, s); } return s; };
  console.log('  Edgar:', Object.keys(durE).map((t) => `${t} ${ag.ini[t]}–${ag.fim[t]}`).join(', '));
  const simult = Object.keys(durE).filter((t) => ag.ini[t] === ag.ini.T2);
  ok(antes('T5').size === 4 && ag.fim.T3 === 5 && simult.sort().join() === 'T2,T6' && ag.total === 6, `Edgar: I = ${antes('T5').size} tarefas, II = ${ag.fim.T3} dias, III = ${simult.join(' e ')}, IV = ${ag.total} dias (oficial: 4, 5, T2 e T6, 6)`);
  const durA = { DB: 2, DP: 14, CB: 16, EP: 20, LC: 12, RA: 4, D: 0 }, aa = agenda(durA, precOf(G.aviao));
  ok(aa.fim.D === step('antes da descolagem').a && G.aviao.e.every(([a, , w]) => w === durA[a]), `avião 2015: tempo mínimo ${aa.fim.D} min (oficial: 34); pesos dos arcos = duração da tarefa de origem`);
  const durB = { T1: 3, T2: 10, T3: 15, T4: 12, T5: 15, T6: 5 }, pb = { T2: ['T1'], T3: ['T1'], T4: ['T2', 'T3'], T5: ['T2', 'T3'], T6: ['T4', 'T5'] };
  ok(agenda(durB, pb).total === step('para fazer todas as tarefas?').a, `banca 2019: tempo mínimo ${agenda(durB, pb).total} min`);
}

console.log('\n— Soluções de eulerização desenhadas (svgEuler) —');
for (const { g, pares, d } of ctx.__EUL) {
  const nome = Object.keys(G).find((k) => G[k] === g), dd = deg(g, d);
  ok(d.every((i) => i >= 0) && Object.values(dd).every((x) => x % 2 === 0), `${nome}: repetir ${pares.map((p) => p.join('–')).join(', ')} → graus ${fmt(dd)}`);
}

console.log('\n— Coerência geral —');
{
  const bad = []; const ids = new Set();
  for (const l of W) for (const s of l.steps) {
    if (s.g && !G[s.g]) bad.push(`grafo inexistente ${s.g}`);
    if (s.t === 'mc' && !(s.a >= 0 && s.a < s.opts.length)) bad.push(`mc sem resposta válida: ${s.q}`);
    if (s.t === 'trace' && s.mode === 'ham' && s.end) { const p = hamPaths(G[s.g], s.start).filter((x) => x.at(-1) === s.end); if (!p.length) bad.push(`percurso impossível: ${s.q}`); }
    if (s.t === 'just') { if (ids.has(s.id)) bad.push(`id repetido ${s.id}`); ids.add(s.id); }
    // A pergunta não pode mostrar o grafo que a resposta pede para desenhar
    if (s.t === 'just' && s.g && s.model.includes(ctx.svgGraph(G[s.g]))) bad.push(`${s.id}: o grafo da pergunta é igual ao da resposta-modelo`);
  }
  ok(!bad.length, `todos os passos apontam para grafos que existem e respostas válidas ${bad.join('; ')}`);
}

console.log(fails ? `\n${fails} PROBLEMA(S)` : '\nTudo certo ✔');
process.exit(fails ? 1 : 0);
