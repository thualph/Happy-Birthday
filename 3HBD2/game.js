(()=>{
const cv=document.getElementById('game'),cx=cv.getContext('2d'),W=520,H=620,C=58,BX=28,BY=10,TY=565,TC=24,N=8;
cv.width=W;cv.height=H;
const COL=['#E28FAD','#7FA88C','#E9DCC4','#4A2030'],WORDS=['Wingardium!','Brilliant!','Expecto!','Lumos Maxima!'];
const SH=[[[1]],[[1,1]],[[1],[1]],[[1,1,1]],[[1],[1],[1]],[[1,1],[1,1]],[[1,1,1],[1,1,1],[1,1,1]],[[1,0],[1,0],[1,1]],[[1,1,1],[1,0,0],[1,0,0]],[[0,1],[1,1]],[[1,1,1,1]],[[1],[1],[1],[1]],[[1,1],[1,0]],[[1,1,0],[0,1,1]],[[0,1,1],[1,1,0]]];
const $=id=>document.getElementById(id);
let g,pcs,score,best=+localStorage.getItem('bb_best')||0,drag,over,anim,parts,texts;
$('best').textContent=best;
const rnd=a=>a[Math.random()*a.length|0];
function newSet(){pcs=[0,1,2].map(()=>({m:rnd(SH),c:rnd(COL),used:false,k:TC}))}
function reset(){g=Array.from({length:N},()=>Array(N).fill(null));score=0;drag=null;over=false;anim={};parts=[];texts=[];newSet();ui()}
function ui(){$('score').textContent=score;if(score>best){best=score;localStorage.setItem('bb_best',best);$('best').textContent=best}
 if(score>=250){const u=$('unlock');u.disabled=false;u.classList.add('ready')}}
function fits(m,gx,gy){for(let r=0;r<m.length;r++)for(let c=0;c<m[0].length;c++)if(m[r][c]){const y=gy+r,x=gx+c;if(y<0||x<0||y>=N||x>=N||g[y][x])return false}return true}
function canAny(){return pcs.some(p=>!p.used&&(()=>{for(let y=0;y<N;y++)for(let x=0;x<N;x++)if(fits(p.m,x,y))return true;return false})())}
function full(grid){const R=[],K=[];for(let i=0;i<N;i++){if(grid[i].every(v=>v))R.push(i);if(grid.every(r=>r[i]))K.push(i)}return[R,K]}
const slotX=i=>BX+C*N*(i+.5)/3;
function pt(e){const r=cv.getBoundingClientRect();return[(e.clientX-r.left)*W/r.width,(e.clientY-r.top)*H/r.height]}
function ghost(){const p=pcs[drag.i],h=p.m.length,w=p.m[0].length;return[Math.round((drag.x-w*C/2-BX)/C),Math.round((drag.y-95-h*C/2-BY)/C)]}
cv.onpointerdown=e=>{if(over)return;const[x,y]=pt(e);let b=-1,bd=95;pcs.forEach((p,i)=>{const d=Math.hypot(x-slotX(i),y-TY);if(!p.used&&d<bd){bd=d;b=i}});
 if(b<0)return;cv.setPointerCapture(e.pointerId);drag={i:b,x,y,tx:x,ty:y};cv.style.cursor='grabbing'};
cv.onpointermove=e=>{if(drag){[drag.tx,drag.ty]=pt(e)}};
cv.onpointerup=()=>{if(!drag)return;const p=pcs[drag.i],[gx,gy]=ghost();cv.style.cursor='grab';
 if(fits(p.m,gx,gy))place(p,gx,gy);drag=null};
function place(p,gx,gy){const now=performance.now();let n=0;
 p.m.forEach((row,r)=>row.forEach((v,c)=>{if(v){g[gy+r][gx+c]=p.c;anim[(gy+r)*N+gx+c]=now;n++}}));
 p.used=true;score+=n;const[R,K]=full(g),lines=R.length+K.length;
 if(lines){const set=new Set();R.forEach(r=>{for(let c=0;c<N;c++)set.add(r*N+c)});K.forEach(c=>{for(let r=0;r<N;r++)set.add(r*N+c)});
  set.forEach(i=>{const y=i/N|0,x=i%N;burst(BX+x*C+C/2,BY+y*C+C/2,g[y][x]);g[y][x]=null});
  const pts=lines*10*lines;score+=pts;texts.push({t:lines>1?'Brilliant! '+pts+' Points!':rnd(WORDS),x:W/2,y:BY+N*C/2,l:80},{t:'+'+pts+' Points!',x:W/2,y:BY+N*C/2+34,l:80})}
 if(pcs.every(q=>q.used))newSet();over=!canAny();ui()}
function burst(x,y,c){const P=['#F4C2D7','#B8D8C2','#C5A059','#FDF9F6',c];for(let i=0;i<9;i++){const a=Math.random()*6.28,v=1+Math.random()*4;parts.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,l:40+Math.random()*20,c:P[i%5]})}}
function rr(x,y,w,h,r,f,s){cx.beginPath();cx.roundRect(x,y,w,h,r);if(f){cx.fillStyle=f;cx.fill()}if(s){cx.strokeStyle=s;cx.stroke()}}
function blk(x,y,s,c,a=1){cx.globalAlpha=a;rr(x,y,s,s,s*.18,c);cx.fillStyle='rgba(255,255,255,.35)';cx.fillRect(x+s*.15,y+s*.1,s*.7,s*.12);cx.globalAlpha=1}
function piece(p,cx0,cy0,k,a=1){const h=p.m.length,w=p.m[0].length;p.m.forEach((row,r)=>row.forEach((v,c)=>{if(v)blk(cx0-w*k/2+c*k+1,cy0-h*k/2+r*k+1,k-2,p.c,a)}))}
function draw(now){cx.clearRect(0,0,W,H);
 rr(BX-8,BY-8,C*N+16,C*N+16,12,'#F6EFE6','#C5A059');cx.lineWidth=2;
 for(let y=0;y<N;y++)for(let x=0;x<N;x++){rr(BX+x*C+2,BY+y*C+2,C-4,C-4,8,'rgba(184,216,194,.35)')}
 let gh=null,hl=[[],[]];
 if(drag&&!over){const p=pcs[drag.i],[gx,gy]=ghost();if(fits(p.m,gx,gy)){gh=[p,gx,gy];const t=g.map(r=>[...r]);p.m.forEach((row,r)=>row.forEach((v,c)=>{if(v)t[gy+r][gx+c]=1}));hl=full(t)}}
 hl[0].forEach(r=>{cx.fillStyle='rgba(197,160,89,.35)';cx.shadowColor='#C5A059';cx.shadowBlur=18;cx.fillRect(BX,BY+r*C,N*C,C);cx.shadowBlur=0});
 hl[1].forEach(c=>{cx.fillStyle='rgba(197,160,89,.35)';cx.shadowColor='#C5A059';cx.shadowBlur=18;cx.fillRect(BX+c*C,BY,C,N*C);cx.shadowBlur=0});
 for(let y=0;y<N;y++)for(let x=0;x<N;x++)if(g[y][x]){const t=(now-(anim[y*N+x]||0))/280,s=t<1?1+.22*Math.sin(Math.PI*t):1,sz=(C-4)*s;blk(BX+x*C+C/2-sz/2,BY+y*C+C/2-sz/2,sz,g[y][x])}
 if(gh)gh[0].m.forEach((row,r)=>row.forEach((v,c)=>{if(v)blk(BX+(gh[1]+c)*C+2,BY+(gh[2]+r)*C+2,C-4,gh[0].c,.4)}));
 rr(BX-8,TY-70,C*N+16,140,12,'rgba(244,194,215,.3)','#C5A059');
 pcs.forEach((p,i)=>{if(p.used)return;const d=drag&&drag.i===i;p.k+=((d?C:TC)-p.k)*.25;
  if(d){drag.x+=(drag.tx-drag.x)*.35;drag.y+=(drag.ty-drag.y)*.35;cx.shadowColor='rgba(74,32,48,.45)';cx.shadowBlur=26;cx.shadowOffsetY=14;piece(p,drag.x,drag.y-95,p.k*1.05);cx.shadowColor='transparent';cx.shadowBlur=0;cx.shadowOffsetY=0}
  else piece(p,slotX(i),TY,p.k)});
 parts=parts.filter(q=>q.l-->0);parts.forEach(q=>{q.x+=q.vx;q.y+=q.vy;q.vy+=.12;cx.globalAlpha=Math.min(1,q.l/20);cx.fillStyle=q.c;cx.beginPath();cx.arc(q.x,q.y,3,0,6.28);cx.fill();cx.globalAlpha=1});
 texts=texts.filter(q=>q.l-->0);texts.forEach(q=>{q.y-=.7;cx.globalAlpha=Math.min(1,q.l/25);cx.font='italic 700 34px "Cormorant Garamond",serif';cx.textAlign='center';cx.lineWidth=5;cx.strokeStyle='#FDF9F6';cx.strokeText(q.t,q.x,q.y);cx.fillStyle='#4A2030';cx.fillText(q.t,q.x,q.y);cx.globalAlpha=1});
 if(over){cx.fillStyle='rgba(253,249,246,.85)';cx.fillRect(BX-8,BY-8,C*N+16,C*N+16);cx.fillStyle='#4A2030';cx.textAlign='center';cx.font='700 40px "Cormorant Garamond",serif';cx.fillText('Kelas Selesai!',W/2,BY+N*C/2-6);cx.font='16px "Plus Jakarta Sans",sans-serif';cx.fillText('Tidak ada ruang lagi. Tekan Main Ulang.',W/2,BY+N*C/2+26)}
 requestAnimationFrame(draw)}
$('restart').onclick=reset;reset();requestAnimationFrame(draw);
})();
