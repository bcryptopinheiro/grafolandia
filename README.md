# Grafolândia

Jogo de estudo de grafos de MACS (11.º ano): noções básicas, Euler, Fleury, carteiro chinês, Hamilton, caixeiro-viajante, digrafos e exames nacionais. HTML, CSS e JavaScript puro.
Funciona como app (PWA): pode ser adicionado ao ecrã principal e funciona sem internet.

Site: https://bcryptopinheiro.github.io/grafolandia/

## Onde está cada coisa

| Ficheiro | O que tem |
|---|---|
| `index.html` | A estrutura da página e a lista de ficheiros a carregar |
| `css/estilo.css` | Cores e aspeto (claro, escuro e telemóvel) |
| `js/conteudo/grafos.js` | Os desenhos dos grafos (vértices, arestas, pesos, setas) |
| `js/conteudo/linha-1-basico.js` | Linha Azul: noções básicas |
| `js/conteudo/linha-2-euler.js` | Linha Verde: trajetos e circuitos eulerianos |
| `js/conteudo/linha-3-fleury-carteiro.js` | Linha Amarela: Fleury, eulerização e carteiro chinês |
| `js/conteudo/linha-4-hamilton.js` | Linha Rosa: Hamilton e caixeiro-viajante |
| `js/conteudo/linha-5-digrafos.js` | Linha Azul-Escura: digrafos |
| `js/conteudo/linha-5b-fichas-professora.js` | Linha Verde-Escura: exercícios das fichas da professora |
| `js/conteudo/linha-6-tipo-teste.js` | Linha Turquesa: exercícios tipo teste |
| `js/conteudo/linha-7-teste-relampago.js` | Linha Roxa: teste-relâmpago |
| `js/conteudo/linha-8-justifica.js` | Linha Cinzenta: justifica como no teste |
| `js/conteudo/linha-9-exames-iave.js` | Linha Castanha: exames nacionais (IAVE) |
| `js/conteudo/linha-10-treino.js` | Linha Laranja: treino infinito (perguntas geradas) |
| `js/conteudo/mapa.js` | A ordem das linhas no mapa |
| `js/conteudo/cabula.js` | A cábula |
| `js/desenho.js` | Como se desenha um grafo (SVG) |
| `js/jogo.js` | A lógica do jogo (não é preciso mexer para acrescentar perguntas) |
| `sw.js` | Guarda o jogo no telemóvel para funcionar sem internet |
| `manifest.webmanifest`, `icons/` | Nome, cores e ícones da app |
| `testes/verificar.mjs` | Verificação automática das contas e das respostas |

## Antes de publicar uma alteração

1. Verificar o conteúdo: `node testes/verificar.mjs` (tem de acabar com «Tudo certo ✔»).
2. No `sw.js`, subir a versão: `const VERSION = 'v10';` → `'v11'` (depois `'v12'`, etc.).
   Se criaste um ficheiro novo em `js/` ou `css/`, acrescenta-o também à lista `FILES` do `sw.js` (o passo 1 avisa).
3. Commit e push:
   ```
   git add -A
   git commit -m "Descreve aqui a alteração"
   git push
   ```
4. O site atualiza em 1 a 2 minutos. No telemóvel, fecha a app e volta a abri-la com internet.
