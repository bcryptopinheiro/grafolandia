/* Desenho dos grafos em SVG (usado pelo conteúdo e pelo jogo). */
function deg(g,dups){const d={};Object.keys(g.v).forEach(k=>d[k]=0);g.e.forEach(([a,b])=>{d[a]++;d[b]++});(dups||[]).forEach(i=>{const[a,b]=g.e[i];d[a]++;d[b]++});return d}

function geom(g){
 const grp={};g.e.forEach((ed,i)=>{const k=[ed[0],ed[1]].sort().join('|');(grp[k]=grp[k]||[]).push(i)});
 return g.e.map((ed,i)=>{
  const[a,b,w,t]=ed,P=g.v[a],Q=g.v[b];
  if(a===b){const[x,y]=P;let[ux,uy]=(g.ld&&g.ld[a])||[0,g.loopDir||-1];const L0=Math.hypot(ux,uy);ux/=L0;uy/=L0;const px=-uy,py=ux;return{d:`M${x} ${y} C${x+ux*62+px*38} ${y+uy*62+py*38} ${x+ux*62-px*38} ${y+uy*62-py*38} ${x} ${y}`,lx:x+ux*46,ly:y+uy*46,mx:x+ux*46,my:y+uy*46,nx:ux,ny:uy,loop:1}}
  const k=[a,b].sort().join('|'),gr=grp[k],idx=gr.indexOf(i),off=(idx-(gr.length-1)/2)*34;
  const[p,q]=a<b?[P,Q]:[Q,P];const mx=(p[0]+q[0])/2,my=(p[1]+q[1])/2,dx=q[0]-p[0],dy=q[1]-p[1],L=Math.hypot(dx,dy),nx=-dy/L,ny=dx/L;
  if(!off){const tt=t??.5;return{d:`M${P[0]} ${P[1]} L${Q[0]} ${Q[1]}`,lx:P[0]+(Q[0]-P[0])*tt,ly:P[1]+(Q[1]-P[1])*tt,mx,my,nx,ny,p,q}}
  return{d:`M${p[0]} ${p[1]} Q${mx+nx*off*2} ${my+ny*off*2} ${q[0]} ${q[1]}`,lx:mx+nx*off,ly:my+ny*off,mx,my,nx,ny,p,q}
 })
}
function svgGraph(g,o={}){
 const gm=geom(g),h=g.h||225,used=o.used||[],dups=o.dups||[],d=o.showDeg?deg(g,dups):null;
 let s=`<svg class="g" viewBox="0 0 300 ${h}" role="img" aria-label="grafo">`;
 gm.forEach((x,i)=>{
  const cnt=used.filter(u=>u===i).length;
  s+=`<path d="${x.d}" fill="none" stroke="${cnt?'var(--wc)':'var(--edge)'}" stroke-width="${cnt?7:4}" stroke-linecap="round"/>`;
  // Digrafo (g.dir): seta na ponta do arco, junto ao vértice de chegada
  if(g.dir&&!x.loop){const[P,Q]=[g.v[g.e[i][0]],g.v[g.e[i][1]]],L=Math.hypot(Q[0]-P[0],Q[1]-P[1]),ux=(Q[0]-P[0])/L,uy=(Q[1]-P[1])/L,tx=Q[0]-ux*18,ty=Q[1]-uy*18,bx=tx-ux*13,by=ty-uy*13;
   s+=`<polygon points="${tx},${ty} ${bx-uy*7},${by+ux*7} ${bx+uy*7},${by-ux*7}" fill="${cnt?'var(--wc)':'var(--edge)'}"/>`}
  if(dups.includes(i)&&!x.loop){const c=`M${x.p[0]} ${x.p[1]} Q${x.mx+x.nx*26} ${x.my+x.ny*26} ${x.q[0]} ${x.q[1]}`;s+=`<path d="${c}" fill="none" stroke="var(--bad)" stroke-width="4" stroke-dasharray="7 6" stroke-linecap="round"/>`}
  if(o.edgeTap)s+=`<path d="${x.d}" fill="none" stroke="transparent" stroke-width="26" data-e="${i}" style="cursor:pointer"/>`;
 });
 gm.forEach((x,i)=>{const w=g.e[i][2];if(w!=null)s+=`<g pointer-events="none"><rect x="${x.lx-(5+String(w).length*4)}" y="${x.ly-11}" width="${10+String(w).length*8}" height="22" rx="7" fill="var(--surface)" stroke="var(--line)"/><text x="${x.lx}" y="${x.ly+5}" text-anchor="middle" font-size="14" font-weight="700" fill="var(--ink)" font-family="Figtree,sans-serif">${w}</text></g>`});
 for(const[k,[x,y]]of Object.entries(g.v)){
  const cur=o.cur===k,vis=(o.visited||[]).includes(k);
  s+=`<g data-v="${k}" style="cursor:${o.tap?'pointer':'default'}"${o.edgeTap?' pointer-events="none"':''}><circle cx="${x}" cy="${y}" r="${o.tap?30:24}" fill="transparent"/>`+
   `<circle cx="${x}" cy="${y}" r="16" fill="${cur?'var(--wc)':'var(--surface)'}" stroke="var(--wc)" stroke-width="${vis?5:3}"/>`+
   `<text x="${x}" y="${y+6}" text-anchor="middle" font-size="16" font-weight="700" fill="${cur?'#fff':'var(--ink)'}" font-family="Fredoka,sans-serif">${k}</text>`;
  if(d){const odd=d[k]%2;s+=`<circle cx="${x+17}" cy="${y-16}" r="10" fill="${odd?'var(--bad)':'var(--ok)'}"/><text x="${x+17}" y="${y-11.5}" text-anchor="middle" font-size="12" font-weight="700" fill="#fff" font-family="Figtree,sans-serif">${d[k]}</text>`}
  s+='</g>';
 }
 return s+'</svg>';
}
