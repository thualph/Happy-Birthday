(()=>{
const UNLOCK=1000; /* <<< SKOR MINIMAL untuk membuka Chapter 5, ubah angka ini */
const START={accio:2,reparo:2,evanesco:1,wingardium:3}; /* <<< jatah mantra di awal permainan */
const IDLE=8000; /* <<< ms tanpa aktivitas sebelum petunjuk langkah muncul */
const cv=document.getElementById('game'),cx=cv.getContext('2d'),W=520,H=660,C=58,BX=28,BY=16,TY=572,TC=24,N=8;
cv.width=W;cv.height=H;
const COL=['#E28FAD','#7FA88C','#E9DCC4','#4A2030'],WORDS=['Wingardium!','Brilliant!','Expecto!','Lumos Maxima!'];
const LABEL={accio:'Accio',reparo:'Reparo',evanesco:'Evanesco',wingardium:'Wingardium'};
const MODETXT={accio:'Pilih balok yang ingin ditukar.',wingardium:'Pilih balok yang ingin diputar.',evanesco:'Pilih area 3×3 di papan yang ingin dihapus.'};
const rot=m=>m[0].map((_,c)=>m.map(r=>r[c]).reverse()),SH=[];
const add=(m,w,n=1)=>{let x=m;for(let i=0;i<n;i++){SH.push([x,w]);x=rot(x)}};
/* add(bentuk, bobot kemunculan, jumlah rotasi). Bobot kecil = jarang muncul */
add([[1]],.3);add([[1,1]],1.5,2);add([[1,1,1]],3.5,2);add([[1,1,1,1]],2.2,2);add([[1,1,1,1,1]],1,2);
add([[1,1],[1,1]],4);add([[1,1,1],[1,1,1]],2.5,2);add([[1,1,1],[1,1,1],[1,1,1]],1.8);
add([[1,1,1],[0,1,0]],3.2,4);
add([[1,0],[1,0],[1,1]],2.5,4);add([[1,1,1],[1,0,0],[1,0,0]],2,4);add([[1,1],[1,0]],1.5,4);
add([[1,1,0],[0,1,1]],2,2);add([[0,1,1],[1,1,0]],2,2);
const cnt=m=>m.flat().filter(Boolean).length;
const $=id=>document.getElementById(id),$$=s=>[...document.querySelectorAll(s)];
let g,pcs,score,best=+localStorage.getItem('bb_best')||0,drag,over,anim,parts,texts,streak=0,poolHit=false,rips=[];
let charges={...START},mode=null,hov=null,snap=null,lastAct=0,hintMv=null,danger=false;
$('best').textContent=best;
const hint=$('unote');if(hint)hint.textContent=`Tombol terbuka otomatis di skor ${UNLOCK}.`;
const rnd=a=>a[Math.random()*a.length|0],clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const fillRatio=()=>g.flat().filter(Boolean).length/(N*N);

/* ---------- Pembagian balok yang adil ---------- */
/* bobot menyesuaikan kepadatan papan: papan padat -> bentuk kecil lebih sering, papan lega -> bentuk besar */
function pick(f){let tw=0;const ws=SH.map(s=>{const n=cnt(s[0]);let w=s[1];if(f>.55){if(n<=4)w*=2;if(n>=7)w*=.35}else if(f<.3&&n>=6)w*=1.4;tw+=w;return w});
 let r=Math.random()*tw;for(let i=0;i<SH.length;i++)if((r-=ws[i])<0)return SH[i][0];return SH[0][0]}
const fitsOn=(G,m,gx,gy)=>{for(let r=0;r<m.length;r++)for(let c=0;c<m[0].length;c++)if(m[r][c]){const y=gy+r,x=gx+c;if(y<0||x<0||y>=N||x>=N||G[y][x])return false}return true};
function dropOn(G,m,gx,gy){const T=G.map(r=>r.slice());m.forEach((row,r)=>row.forEach((v,c)=>{if(v)T[gy+r][gx+c]=1}));
 const[R,K]=full(T);R.forEach(r=>{for(let c=0;c<N;c++)T[r][c]=0});K.forEach(c=>{for(let r=0;r<N;r++)T[r][c]=0});return[T,R.length+K.length]}
/* ketiga balok harus bisa ditaruh berurutan (urutan bebas), dengan memperhitungkan baris yang hancur */
function solvable(set,G){let budget=6000;const ms=set.map(p=>p.m);
 function rec(G,left){if(!left.length||budget<=0)return true;
  for(let i=0;i<left.length;i++){const m=ms[left[i]];
   for(let y=0;y<N;y++)for(let x=0;x<N;x++){if(!fitsOn(G,m,x,y))continue;if(--budget<=0)return true;
    if(rec(dropOn(G,m,x,y)[0],left.filter((_,j)=>j!==i)))return true}}
  return false}
 return rec(G,[0,1,2])}
function canClear(set,G){for(const p of set)for(let y=0;y<N;y++)for(let x=0;x<N;x++)if(fitsOn(G,p.m,x,y)&&dropOn(G,p.m,x,y)[1])return true;return false}
function anyFit(m){for(let y=0;y<N;y++)for(let x=0;x<N;x++)if(fits(m,x,y))return true;return false}
const mk=m=>({m,id:JSON.stringify(m),c:rnd(COL),used:false,k:TC});
function newSet(){const f=fillRatio();let bestSet=null,bs=-1;
 for(let t=0;t<40;t++){const set=[];
  for(let n=0;set.length<3&&n<80;n++){const m=pick(f),k=JSON.stringify(m);
   if(cnt(m)<=2&&set.some(q=>cnt(q.m)<=2))continue; /* maks 1 piece kecil per set */
   if(set.some(q=>q.id===k))continue;set.push(mk(m))}
  while(set.length<3)set.push(mk(pick(f)));
  const s=(set.some(p=>anyFit(p.m))?1:0)+(solvable(set,g)?2:0)+(canClear(set,g)?1:0);
  if(s>bs){bs=s;bestSet=set}if(s===4)break}
 pcs=bestSet}
function freshPiece(avoid){const f=fillRatio();let b=null,bs=-1;
 for(let t=0;t<30;t++){const m=pick(f);if(JSON.stringify(m)===avoid)continue;const p=mk(m),s=(anyFit(m)?1:0)+(canClear([p],g)?1:0);if(s>bs){bs=s;b=p}if(s===2)break}
 return b||mk(pick(f))}

/* ---------- Status permainan ---------- */
const poke=()=>{lastAct=performance.now();hintMv=null};
function takeSnap(){snap={g:g.map(r=>r.slice()),pcs:pcs.map(p=>({...p})),score,streak,poolHit,aw:[]}}
function reset(){g=Array.from({length:N},()=>Array(N).fill(null));score=0;drag=null;over=false;anim={};parts=[];texts=[];streak=0;poolHit=false;rips=[];
 charges={...START};mode=null;snap=null;poke();cv.style.cursor='grab';newSet();ui()}
function moveCount(){let n=0;pcs.forEach(p=>{if(p.used)return;for(let y=0;y<N;y++)for(let x=0;x<N;x++)if(fits(p.m,x,y))n++});return n}
function renderSpells(){$$('.spell').forEach(b=>{const s=b.dataset.s;b.querySelector('i').textContent=charges[s];b.disabled=charges[s]<1||(s==='reparo'&&!snap);b.classList.toggle('on',mode===s)});
 $('spells').classList.toggle('alert',danger);$('smode').textContent=mode?MODETXT[mode]:''}
function ui(){$('score').textContent=score;const cb=$('combo');if(cb)cb.textContent='x'+streak;if(score>best){best=score;localStorage.setItem('bb_best',best);$('best').textContent=best}
 if(score>=UNLOCK){const u=$('unlock');u.disabled=false;u.classList.add('ready')}
 danger=!over&&moveCount()<=4;renderSpells()}
function fits(m,gx,gy){return fitsOn(g,m,gx,gy)}
function canAny(){return pcs.some(p=>!p.used&&anyFit(p.m))}
function full(grid){const R=[],K=[];for(let i=0;i<N;i++){if(grid[i].every(v=>v))R.push(i);if(grid.every(r=>r[i]))K.push(i)}return[R,K]}
const slotX=i=>BX+C*N*(i+.5)/3;
function pt(e){const r=cv.getBoundingClientRect();return[(e.clientX-r.left)*W/r.width,(e.clientY-r.top)*H/r.height]}
function ghost(){const p=pcs[drag.i],h=p.m.length,w=p.m[0].length;return[Math.round((drag.x-w*C/2-BX)/C),Math.round((drag.y-95-h*C/2-BY)/C)]}
const trayAt=(x,y)=>{let b=-1,bd=95;pcs.forEach((p,i)=>{const d=Math.hypot(x-slotX(i),y-TY);if(!p.used&&d<bd){bd=d;b=i}});return b};
const evaBox=()=>{if(!hov)return null;const hx=Math.floor((hov[0]-BX)/C),hy=Math.floor((hov[1]-BY)/C);if(hx<0||hy<0||hx>=N||hy>=N)return null;return[clamp(hx-1,0,N-3),clamp(hy-1,0,N-3)]};

/* ---------- Mantra ---------- */
function setMode(s){mode=(mode===s)?null:s;drag=null;cv.style.cursor=mode?'crosshair':'grab';renderSpells()}
function award(s){charges[s]++;if(snap)snap.aw.push(s);texts.push({t:'+1 '+LABEL[s]+'!',x:W/2,y:BY+N*C/2+120,l:110,s:30,c:'#5E8F6E'});renderSpells()}
function applyMode(x,y){
 if(mode==='evanesco'){const b=evaBox();if(!b)return;takeSnap();
  for(let r=0;r<3;r++)for(let c=0;c<3;c++){const gy=b[1]+r,gx=b[0]+c;if(g[gy][gx]){burst(BX+gx*C+C/2,BY+gy*C+C/2,g[gy][gx]);g[gy][gx]=null}}
  texts.push({t:'Evanesco!',x:W/2,y:BY+N*C/2,l:80,s:36,c:'#B8862B'})}
 else{const i=trayAt(x,y);if(i<0)return;takeSnap();const p=pcs[i];
  if(mode==='accio'){pcs[i]=freshPiece(p.id);texts.push({t:'Accio!',x:slotX(i),y:TY-90,l:70,s:30,c:'#B8862B'})}
  else{p.m=rot(p.m);p.id=JSON.stringify(p.m);texts.push({t:'Wingardium!',x:slotX(i),y:TY-90,l:70,s:28,c:'#B8862B'})}}
 charges[mode]--;mode=null;cv.style.cursor='grab';poke();over=!canAny();ui()}
function undo(){if(!snap||charges.reparo<1)return;charges.reparo--;snap.aw.forEach(s=>charges[s]=Math.max(0,charges[s]-1)); /* hadiah dari langkah yang diurungkan ikut dibatalkan */
 ({g,score,streak,poolHit}=snap);pcs=snap.pcs.map(p=>({...p,k:TC}));snap=null;over=false;drag=null;mode=null;
 anim={};texts.push({t:'Reparo!',x:W/2,y:BY+N*C/2,l:80,s:36,c:'#B8862B'});poke();cv.style.cursor='grab';ui()}
$$('.spell').forEach(b=>b.onclick=()=>{const s=b.dataset.s;if(s==='reparo')return undo();if(charges[s]>0)setMode(s)});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&mode)setMode(mode)});

/* ---------- Input ---------- */
cv.onpointerdown=e=>{poke();const[x,y]=pt(e);if(mode){applyMode(x,y);return}if(over)return;
 const b=trayAt(x,y);if(b<0)return;cv.setPointerCapture(e.pointerId);drag={i:b,x,y,tx:x,ty:y};cv.style.cursor='grabbing'};
cv.onpointermove=e=>{poke();const p=pt(e);hov=p;if(drag){[drag.tx,drag.ty]=p}};
cv.onpointerleave=()=>{hov=null};
cv.onpointerup=()=>{if(!drag)return;const p=pcs[drag.i],[gx,gy]=ghost();cv.style.cursor='grab';
 if(fits(p.m,gx,gy))place(p,gx,gy);drag=null};
function ripple(x,y,pw){rips.push({x,y,t:performance.now(),pw});cv.classList.remove('pulse');void cv.offsetWidth;cv.classList.add('pulse')}
function wave(x,y,now){let s=0;for(const q of rips){const e=now-q.t,d=Math.hypot(x+.5-q.x,y+.5-q.y),f=Math.max(0,1-e/(900+q.pw*250));s+=Math.exp(-Math.pow(d-e/70,2)/1.6)*f*(.5+q.pw*.2)}return Math.min(1,s)}
function place(p,gx,gy){const now=performance.now();let n=0;takeSnap();
 p.m.forEach((row,r)=>row.forEach((v,c)=>{if(v){g[gy+r][gx+c]=p.c;anim[(gy+r)*N+gx+c]=now;n++}}));
 p.used=true;score+=n;const[R,K]=full(g),lines=R.length+K.length,ox=gx+p.m[0].length/2,oy=gy+p.m.length/2;
 if(lines){streak++;poolHit=true;const set=new Set();R.forEach(r=>{for(let c=0;c<N;c++)set.add(r*N+c)});K.forEach(c=>{for(let r=0;r<N;r++)set.add(r*N+c)});
  set.forEach(i=>{const y=i/N|0,x=i%N;burst(BX+x*C+C/2,BY+y*C+C/2,g[y][x]);g[y][x]=null});
  const pts=Math.round(lines*10*lines*(1+(streak-1)*.5));score+=pts;
  texts.push({t:streak>1?'Combo x'+streak+'!':rnd(WORDS),x:W/2,y:BY+N*C/2-20,l:90,s:streak>1?44:34,c:streak>1?'#B8862B':null},{t:'+'+pts+' Points!',x:W/2,y:BY+N*C/2+30,l:90});
  if(streak>1||lines>1)ripple(ox,oy,Math.min(3,streak+lines-2));
  if(streak===3)award('accio'); /* hadiah: combo x3 -> +1 Accio */
  if(streak>=3&&window.confetti){const b=cv.getBoundingClientRect();confetti(70,b.left+b.width/2,b.top+b.height/2)}
  if(g.every(r=>r.every(v=>!v))){score+=100;texts.push({t:'Perfect Clear! +100',x:W/2,y:BY+N*C/2+80,l:110,s:38,c:'#B8862B'});ripple(ox,oy,3);setTimeout(()=>ripple(4,4,3),250);award('evanesco')} /* hadiah: Perfect Clear -> +1 Evanesco */
 }
 if(pcs.every(q=>q.used)){if(!poolHit)streak=0;poolHit=false;newSet()} /* combo lanjut ke pool berikutnya hanya jika pool ini ada yang menghancurkan */
 poke();over=!canAny();ui()}
function burst(x,y,c){const P=['#F4C2D7','#B8D8C2','#C5A059','#FDF9F6',c];for(let i=0;i<9;i++){const a=Math.random()*6.28,v=1+Math.random()*4;parts.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,l:40+Math.random()*20,c:P[i%5]})}}

/* ---------- Petunjuk ---------- */
function bestMove(){let b=null,bs=-1e9;pcs.forEach((p,i)=>{if(p.used)return;
 for(let y=0;y<N;y++)for(let x=0;x<N;x++){if(!fits(p.m,x,y))continue;const[T,l]=dropOn(g,p.m,x,y);let ct=0;
  p.m.forEach((row,r)=>row.forEach((v,c)=>{if(!v)return;[[1,0],[-1,0],[0,1],[0,-1]].forEach(([dy,dx])=>{const yy=y+r+dy,xx=x+c+dx;if(yy<0||xx<0||yy>=N||xx>=N||g[yy][xx])ct++})}));
  const s=l*100+ct-T.flat().filter(Boolean).length*.3;if(s>bs){bs=s;b={i,x,y}}}});return b}

/* ---------- Gambar ---------- */
function rr(x,y,w,h,r,f,s){cx.beginPath();cx.roundRect(x,y,w,h,r);if(f){cx.fillStyle=f;cx.fill()}if(s){cx.strokeStyle=s;cx.stroke()}}
function blk(x,y,s,c,a=1){cx.globalAlpha=a;rr(x,y,s,s,s*.18,c);cx.fillStyle='rgba(255,255,255,.35)';cx.fillRect(x+s*.15,y+s*.1,s*.7,s*.12);cx.globalAlpha=1}
function piece(p,cx0,cy0,k,a=1){const h=p.m.length,w=p.m[0].length;p.m.forEach((row,r)=>row.forEach((v,c)=>{if(v)blk(cx0-w*k/2+c*k+1,cy0-h*k/2+r*k+1,k-2,p.c,a)}))}
function draw(now){cx.clearRect(0,0,W,H);
 rips=rips.filter(q=>now-q.t<1600);const bg=rips.reduce((m,q)=>Math.max(m,1-(now-q.t)/(900+q.pw*250)),0);cx.shadowColor='#E6CD94';cx.shadowBlur=Math.max(0,bg)*34;rr(BX-8,BY-8,C*N+16,C*N+16,12,'#F6EFE6','#C5A059');cx.shadowBlur=0;cx.lineWidth=2;
 const rowN=g.map(r=>r.filter(Boolean).length),colN=[...Array(N).keys()].map(c=>g.filter(r=>r[c]).length);
 for(let y=0;y<N;y++)for(let x=0;x<N;x++){rr(BX+x*C+2,BY+y*C+2,C-4,C-4,8,'rgba(184,216,194,.35)');const w=wave(x,y,now);if(w>.02)rr(BX+x*C+2,BY+y*C+2,C-4,C-4,8,`rgba(255,244,210,${w*.9})`);
  if(!g[y][x]&&((rowN[y]>=6)||(colN[x]>=6))){cx.globalAlpha=.55+.25*Math.sin(now/400);cx.fillStyle='#C5A059';cx.beginPath();cx.arc(BX+x*C+C/2,BY+y*C+C/2,4,0,6.28);cx.fill();cx.globalAlpha=1}} /* tanda tipis: baris/kolom hampir penuh */
 let gh=null,hl=[[],[]];
 if(drag&&!over){const p=pcs[drag.i],[gx,gy]=ghost();if(fits(p.m,gx,gy)){gh=[p,gx,gy];const t=g.map(r=>[...r]);p.m.forEach((row,r)=>row.forEach((v,c)=>{if(v)t[gy+r][gx+c]=1}));hl=full(t)}}
 hl[0].forEach(r=>{cx.fillStyle='rgba(197,160,89,.35)';cx.shadowColor='#C5A059';cx.shadowBlur=18;cx.fillRect(BX,BY+r*C,N*C,C);cx.shadowBlur=0});
 hl[1].forEach(c=>{cx.fillStyle='rgba(197,160,89,.35)';cx.shadowColor='#C5A059';cx.shadowBlur=18;cx.fillRect(BX+c*C,BY,C,N*C);cx.shadowBlur=0});
 for(let y=0;y<N;y++)for(let x=0;x<N;x++)if(g[y][x]){const t=(now-(anim[y*N+x]||0))/280,w=wave(x,y,now),s=(t<1?1+.22*Math.sin(Math.PI*t):1)+w*.16,sz=(C-4)*s;blk(BX+x*C+C/2-sz/2,BY+y*C+C/2-sz/2,sz,g[y][x]);if(w>.05){cx.globalAlpha=w*.65;rr(BX+x*C+C/2-sz/2,BY+y*C+C/2-sz/2,sz,sz,sz*.18,'#fff');cx.globalAlpha=1}}
 if(gh)gh[0].m.forEach((row,r)=>row.forEach((v,c)=>{if(v)blk(BX+(gh[1]+c)*C+2,BY+(gh[2]+r)*C+2,C-4,gh[0].c,.4)}));
 if(mode==='evanesco'){const b=evaBox();if(b){cx.setLineDash([6,5]);rr(BX+b[0]*C+1,BY+b[1]*C+1,3*C-2,3*C-2,10,'rgba(226,143,173,.35)','#B5475B');cx.setLineDash([])}}
 /* petunjuk langkah setelah diam beberapa detik */
 const idle=!drag&&!mode&&!over&&now-lastAct>IDLE;
 if(idle){if(!hintMv)hintMv=bestMove();if(hintMv){const p=pcs[hintMv.i],a=.3+.25*Math.sin(now/260);
  p.m.forEach((row,r)=>row.forEach((v,c)=>{if(v){cx.shadowColor='#C5A059';cx.shadowBlur=14;blk(BX+(hintMv.x+c)*C+2,BY+(hintMv.y+r)*C+2,C-4,'#E6CD94',a+.2);cx.shadowBlur=0}}));
  cx.globalAlpha=.5+.4*Math.sin(now/260);rr(slotX(hintMv.i)-72,TY-62,144,124,10,null,'#C5A059');cx.globalAlpha=1}}
 rr(BX-8,TY-70,C*N+16,140,12,'rgba(244,194,215,.3)','#C5A059');
 if(mode==='accio'||mode==='wingardium')pcs.forEach((p,i)=>{if(!p.used){cx.globalAlpha=.5+.4*Math.sin(now/200);rr(slotX(i)-72,TY-62,144,124,10,'rgba(230,205,148,.25)','#C5A059');cx.globalAlpha=1}});
 let chip=null;if(!over&&danger)chip=['Hampir buntu! Pakai mantra?','#B5475B'];
 if(chip){cx.font='700 12px "Plus Jakarta Sans",sans-serif';cx.textAlign='left';cx.fillStyle=chip[1];cx.globalAlpha=danger?.65+.35*Math.sin(now/220):1;cx.fillText(chip[0],BX+6,TY-56);cx.globalAlpha=1}
 pcs.forEach((p,i)=>{if(p.used)return;const d=drag&&drag.i===i;p.k+=((d?C:TC)-p.k)*.25;
  if(d){drag.x+=(drag.tx-drag.x)*.35;drag.y+=(drag.ty-drag.y)*.35;cx.shadowColor='rgba(74,32,48,.45)';cx.shadowBlur=26;cx.shadowOffsetY=14;piece(p,drag.x,drag.y-95,p.k*1.05);cx.shadowColor='transparent';cx.shadowBlur=0;cx.shadowOffsetY=0}
  else piece(p,slotX(i),TY,p.k)});
 parts=parts.filter(q=>q.l-->0);parts.forEach(q=>{q.x+=q.vx;q.y+=q.vy;q.vy+=.12;cx.globalAlpha=Math.min(1,q.l/20);cx.fillStyle=q.c;cx.beginPath();cx.arc(q.x,q.y,3,0,6.28);cx.fill();cx.globalAlpha=1});
 texts=texts.filter(q=>q.l-->0);texts.forEach(q=>{q.y-=.7;cx.globalAlpha=Math.min(1,q.l/25);cx.font=`700 ${q.s||34}px "Playfair Display",serif`;cx.textAlign='center';cx.lineWidth=5;cx.strokeStyle='#FDF9F6';cx.strokeText(q.t,q.x,q.y);cx.fillStyle=q.c||'#4A2030';cx.fillText(q.t,q.x,q.y);cx.globalAlpha=1});
 if(over){const rescue=snap&&charges.reparo>0||charges.evanesco>0||charges.accio>0||charges.wingardium>0;
  cx.fillStyle='rgba(253,249,246,.85)';cx.fillRect(BX-8,BY-8,C*N+16,C*N+16);cx.fillStyle='#4A2030';cx.textAlign='center';cx.font='700 40px "Cormorant Garamond",serif';cx.fillText('Kelas Selesai!',W/2,BY+N*C/2-6);
  cx.font='16px "Plus Jakarta Sans",sans-serif';cx.fillText(rescue?'Masih ada mantra! Coba Reparo, Evanesco, atau Accio.':'Tidak ada ruang lagi. Tekan Main Ulang.',W/2,BY+N*C/2+26)}
 requestAnimationFrame(draw)}
$('restart').onclick=reset;reset();requestAnimationFrame(draw);
})();
