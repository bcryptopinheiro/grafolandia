// Verifica as contas dos grafos e das respostas da Grafolândia.
// Uso:  node tools/verificar.mjs
// Lê o index.html, corre o código do jogo (sem browser) e confirma graus, contagens e respostas.
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const code = html.match(/<script>([\s\S]*?)<\/script>/)[1];
const fake = { style: { setProperty() {}, removeProperty() {} }, addEventListener() {}, set innerHTML(_) {} };
const ctx = { document: { getElementById: () => fake }, localStorage: { getItem: () => null, setItem() {} }, window: { scrollTo() {} }, addEventListener() {}, history: { pushState() {}, replaceState() {}, back() {} }, Math, Date, JSON, String, Object, Array, Set };
vm.createContext(ctx);
vm.runInContext(code + ';globalThis.__G=G;globalThis.__W=W;globalThis.__deg=deg;', ctx);
const G = ctx.__G, W = ctx.__W, deg = ctx.__deg;

let fails = 0;
const ok = (cond, msg) => { console.log(`${cond ? '✔' : '✘'} ${msg}`); if (!cond) fails++; };
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
for (const k of ['hp', 'arv', 'iso1', 'iso2']) {
  const g = G[k], clash = [];
  for (const [a, b] of g.e) for (const [v, P] of Object.entries(g.v)) if (v !== a && v !== b) { const d = segDist(P, g.v[a], g.v[b]); if (d < 24) clash.push(`${a}–${b} passa a ${d.toFixed(0)} de ${v}`); }
  ok(!clash.length, `${k}: desenho limpo ${clash.join('; ')}`);
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

console.log('\n— Coerência geral —');
{
  const bad = []; const ids = new Set();
  for (const l of W) for (const s of l.steps) {
    if (s.g && !G[s.g]) bad.push(`grafo inexistente ${s.g}`);
    if (s.t === 'mc' && !(s.a >= 0 && s.a < s.opts.length)) bad.push(`mc sem resposta válida: ${s.q}`);
    if (s.t === 'trace' && s.mode === 'ham' && s.end) { const p = hamPaths(G[s.g], s.start).filter((x) => x.at(-1) === s.end); if (!p.length) bad.push(`percurso impossível: ${s.q}`); }
    if (s.t === 'just') { if (ids.has(s.id)) bad.push(`id repetido ${s.id}`); ids.add(s.id); }
  }
  ok(!bad.length, `todos os passos apontam para grafos que existem e respostas válidas ${bad.join('; ')}`);
}

console.log(fails ? `\n${fails} PROBLEMA(S)` : '\nTudo certo ✔');
process.exit(fails ? 1 : 0);
