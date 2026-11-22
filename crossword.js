(()=>{
const NEED=7; /* <<< jumlah kata benar minimal untuk membuka Chapter 6, ubah angka ini */
/* [jawaban, petunjuk, baris, kolom, arah 'A'=mendatar 'D'=menurun] - jawaban ditulis dalam bahasa Inggris */
const WORDS=[
["TRELAWNEY", "Profesor Ramalan yang suka melihat masa depan (Chapter 6)", 4, 1, "A"],
["FLITWICK", "Profesor Mantra bertubuh mungil (guru Charms Class!)", 1, 1, "D"],
["PENSIEVE", "Baskom sihir untuk melihat ingatan (kamu mampir ke sini di Chapter 2)", 2, 7, "D"],
["ERISED", "Cermin yang menunjukkan keinginan terdalam: Mirror of ... (Chapter 3)", 0, 3, "D"],
["VOLDEMORT", "Penyihir jahat yang namanya tidak boleh disebut", 7, 3, "A"],
["SNITCH", "Bola emas kecil bersayap yang diburu sang Seeker", 4, 11, "D"],
["HEDWIG", "Burung hantu putih setia milik Harry", 0, 2, "A"],
["DOBBY", "Peri rumah yang bebas setelah diberi sebuah kaus kaki", 0, 9, "D"],
["LUMOS", "Mantra untuk menyalakan cahaya di ujung tongkat sihir", 7, 5, "D"],
["LEVIOSA", "Wingardium ... (mantra untuk melayangkan benda)", 11, 0, "A"]];
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],key=(r,c)=>r+','+c;
const board=$('#xboard'),cl=$('#xclues');
let cells={},cur=null,sel=0,dir='A',solved=0,toggle=false;
const H=Math.max(...WORDS.map(w=>w[2]+(w[4]=='D'?w[0].length:1))),Wd=Math.max(...WORDS.map(w=>w[3]+(w[4]=='A'?w[0].length:1)));
const words=WORDS.map(([a,clue,r,c,d],i)=>({a,clue,r,c,d,i,done:false,ks:[...a].map((_,j)=>key(r+(d=='D'?j:0),c+(d=='A'?j:0)))}));
const starts=[...new Set(words.map(w=>w.ks[0]))].sort((p,q)=>{const[a,b]=p.split(',').map(Number),[c,d]=q.split(',').map(Number);return a-c||b-d}),num={};
starts.forEach((k,i)=>num[k]=i+1);words.forEach(w=>w.n=num[w.ks[0]]);
board.style.gridTemplateColumns=`repeat(${Wd},42px)`;
for(let r=0;r<H;r++)for(let c=0;c<Wd;c++){const k=key(r,c),el=document.createElement('div'),ws=words.filter(w=>w.ks.includes(k));el.className='xc';
 if(ws.length){const inp=document.createElement('input');inp.maxLength=1;inp.autocomplete='off';inp.spellcheck=false;inp.dataset.k=k;el.appendChild(inp);
  if(num[k]){const n=document.createElement('span');n.className='xn';n.textContent=num[k];el.appendChild(n)}
  cells[k]={el,inp,ws:ws.map(w=>w.i),locked:false}}else el.classList.add('blk');
 board.appendChild(el)}
const lst=(d,t)=>`<h4>${t}</h4>`+words.filter(w=>w.d==d).sort((a,b)=>a.n-b.n).map(w=>`<div class="xk" data-i="${w.i}"><b>${w.n}</b><span>${w.clue} <small>(${w.a.length})</small></span></div>`).join('');
cl.innerHTML=lst('A','Mendatar')+lst('D','Menurun');
const base=`Buka Chapter 6 setelah ${NEED} kata benar.`;$('#xnote').textContent=base;
function pick(k){let wi=cells[k].ws.find(i=>words[i].d==dir);if(wi===undefined)wi=cells[k].ws[0];dir=words[wi].d;return wi}
function paint(){Object.values(cells).forEach(c=>c.el.classList.remove('w','cur'));words[sel].ks.forEach(k=>cells[k].el.classList.add('w'));if(cur)cells[cur].el.classList.add('cur');
 $$('.xk').forEach(e=>e.classList.toggle('on',+e.dataset.i===sel));const a=cl.querySelector('.xk.on');if(a)a.scrollIntoView({block:'nearest'})}
function select(k){cur=k;sel=pick(k);paint()}
function focus(k){cells[k].inp.focus()}
function step(k,s){const ks=words[sel].ks;let i=ks.indexOf(k)+s;while(ks[i]&&cells[ks[i]].locked&&s>0)i+=s;if(ks[i])focus(ks[i])}
function stats(){$('#xdone').textContent=`${solved} / ${words.length}`;
 if(solved>=NEED){const u=$('#xunlock');u.disabled=false;u.classList.add('ready')}
 if(solved==words.length){const hs=typeof HOUSES!=='undefined'&&HOUSES[document.documentElement.dataset.house];$('#xnote').textContent=`Brilliant! 10 points to ${hs?hs[0]:'Gryffindor'}! ✦`;board.classList.add('xwin')}}
function win(w){w.done=true;solved++;
 w.ks.forEach((k,i)=>{const c=cells[k];c.locked=true;c.inp.readOnly=true;c.el.style.setProperty('--dl',i*70+'ms');c.el.classList.remove('bad','ok');void c.el.offsetWidth;c.el.classList.add('ok')});
 const it=cl.querySelector(`.xk[data-i="${w.i}"]`);if(it)it.classList.add('ok');stats();
 const r=cells[w.ks[0]].el.getBoundingClientRect();if(window.confetti)confetti(solved==words.length?220:40,r.left+r.width/2,r.top+r.height/2);
 w.ks.forEach(k=>cells[k].ws.forEach(i=>i!==w.i&&checkWord(i)))}
function checkWord(i){const w=words[i];if(w.done||!w.ks.every(k=>cells[k].inp.value))return;
 if(w.ks.map(k=>cells[k].inp.value).join('')==w.a)win(w);
 else{w.ks.forEach(k=>{if(!cells[k].locked){const e=cells[k].el;e.classList.remove('bad');void e.offsetWidth;e.classList.add('bad')}});setTimeout(()=>w.ks.forEach(k=>cells[k].el.classList.remove('bad')),600)}}
const check=k=>cells[k].ws.forEach(checkWord);
board.addEventListener('focusin',e=>{const k=e.target.dataset&&e.target.dataset.k;if(k)select(k)});
board.addEventListener('mousedown',e=>{toggle=!!(e.target.dataset&&e.target.dataset.k===cur)});
board.addEventListener('click',e=>{const k=e.target.dataset&&e.target.dataset.k;if(k&&toggle&&cells[k].ws.length>1){dir=dir=='A'?'D':'A';select(k)}});
board.addEventListener('keydown',e=>{const k=e.target.dataset&&e.target.dataset.k;if(!k||e.ctrlKey||e.metaKey||e.altKey)return;const c=cells[k];
 if(/^[a-zA-Z]$/.test(e.key)){e.preventDefault();if(!c.locked){c.inp.value=e.key.toUpperCase();c.el.classList.remove('bad');check(k)}step(k,1);return}
 if(e.key=='Backspace'){e.preventDefault();if(!c.locked&&c.inp.value){c.inp.value='';return}const ks=words[sel].ks,p=ks[ks.indexOf(k)-1];if(p){if(!cells[p].locked)cells[p].inp.value='';focus(p)}return}
 const mv={ArrowLeft:[0,-1,'A'],ArrowRight:[0,1,'A'],ArrowUp:[-1,0,'D'],ArrowDown:[1,0,'D']}[e.key];
 if(mv){e.preventDefault();const[r,c0]=k.split(',').map(Number),nk=key(r+mv[0],c0+mv[1]);dir=mv[2];if(cells[nk])focus(nk);else select(k);return}
 if(e.key=='Enter'||e.key==' '){e.preventDefault();dir=dir=='A'?'D':'A';select(k)}});
cl.addEventListener('click',e=>{const it=e.target.closest('.xk');if(!it)return;const w=words[+it.dataset.i];dir=w.d;focus(w.ks.find((k,i)=>!cells[k].locked&&cells[k].inp.value!==w.a[i])||w.ks[0])});
$('#xhint').onclick=()=>{const w=words[sel];if(w.done)return;const i=w.ks.findIndex((k,j)=>cells[k].inp.value!==w.a[j]);if(i<0)return;const c=cells[w.ks[i]];if(!c.locked){c.inp.value=w.a[i];check(w.ks[i])}};
$('#xreset').onclick=()=>{Object.values(cells).forEach(c=>{c.inp.value='';c.inp.readOnly=false;c.locked=false;c.el.classList.remove('ok','bad')});
 words.forEach(w=>w.done=false);$$('.xk').forEach(e=>e.classList.remove('ok'));solved=0;board.classList.remove('xwin');$('#xnote').textContent=base;
 const u=$('#xunlock');u.disabled=true;u.classList.remove('ready');stats()};
dir=words[0].d;paint();stats();
})();
