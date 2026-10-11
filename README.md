# Grafolândia

Jogo para estudar grafos de MACS (11.º ano). HTML, CSS e JavaScript puro, num só ficheiro (`index.html`).
Funciona como app (PWA): pode ser adicionado ao ecrã principal e funciona sem internet.

## Como atualizar o jogo

1. Altera o `index.html`.
2. Abre o `sw.js` e sobe a versão: `const VERSION = 'v1';` → `'v2'` (depois `'v3'`, etc.).
3. Publica:
   ```
   git add -A
   git commit -m "Descreve aqui a alteração"
   git push
   ```
4. Espera 1–2 minutos. No telemóvel, abre o jogo com internet: a nova versão fica ativa
   (às vezes é preciso fechar e voltar a abrir a app).

## Ficheiros

- `index.html` — o jogo
- `manifest.webmanifest` — nome, cores e ícones da app
- `sw.js` — service worker (guarda o jogo para funcionar offline)
- `icons/` — ícones da app
- `tools/verificar.mjs` — confirma as contas dos grafos e das respostas: `node tools/verificar.mjs`
