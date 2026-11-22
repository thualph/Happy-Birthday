/* ===== KONFIGURASI (edit di sini) ===== */
const CFG={nama:'Nama Kamu',umur:'17',tanggal:'1 Januari 2027'};
const REASONS=['Senyummu bisa menerangi ruangan lebih terang dari mantra Lumos.','Kamu pendengar terbaik yang pernah kukenal.','Tawamu membuat hari buruk terasa ringan.','Kamu berani tetap lembut di dunia yang sibuk.','Caramu peduli pada hal-hal kecil itu istimewa.','Kamu membuat orang lain merasa dilihat.','Ceritamu selalu membuatku ingin tinggal lebih lama.','Kamu kuat, bahkan saat tidak merasa begitu.','Ada keajaiban di caramu menjadi dirimu sendiri.','Dunia sedikit lebih hangat karena ada kamu.'];
const PHOTOS=[/* [skor, judul, review, rasio placeholder 'lebar/tinggi' - setelah foto dimasukkan, rasio otomatis mengikuti ukuran asli foto] */
['10/10','Hari Pertama Kita','Foto ini bukti kamu selalu tampil paling bersinar. Aku ingat betul tawanya.','4/5'],
['10/10','Senyum Favorit','Ekspresi ini langsung mengubah mood seisi ruangan. Tidak ada yang menandingi.','1/1'],
['9.9/10','Petualangan Seru','Kamu jelas ratu petualangan. Aku ikut saja ke mana pun kamu pergi.','4/3'],
['10/10','Momen Manis','Sederhana tapi hangat, seperti secangkir butterbeer di musim dingin.','3/4'],
['10/10','Gaya Tak Tertandingi','Ada yang tahu cara berpose sekeren ini tanpa usaha? Hanya kamu.','16/9'],
['11/10','Selalu Cantik','Skor ini sengaja melebihi batas karena kamu memang istimewa.','4/5']];
const PROPHECIES=['Tahun ini bintang akan menyusun jalan menuju kejutan yang sudah lama kamu tunggu.','Seseorang yang kamu sayangi akan membawa kabar baik sebelum bulan purnama berikutnya.','Keberanian kecilmu hari ini akan tumbuh menjadi cerita besar yang kamu banggakan.'];
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const slot=(src,label,st='')=>`<figure class="slot" style="${st}" data-label="${label}"><img src="${src}" alt="" onerror="this.remove()"></figure>`;
$$('[data-f]').forEach(e=>e.textContent=CFG[e.dataset.f]);

/* Confetti */
const fx=$('#fx'),fc=fx.getContext('2d');let bits=[];
function sizeFx(){fx.width=innerWidth;fx.height=innerHeight}sizeFx();addEventListener('resize',sizeFx);
window.confetti=(n=170,x=innerWidth/2,y=innerHeight/2)=>{const c=['#F4C2D7',getComputedStyle(document.documentElement).getPropertyValue('--acc').trim(),'#B8D8C2','#C5A059','#FDF9F6'];
 for(let i=0;i<n;i++){const a=Math.random()*6.28,v=4+Math.random()*10;bits.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-5,r:Math.random()*6,s:3+Math.random()*6,c:c[i%5],l:130+Math.random()*70})}};
(function loop(){fc.clearRect(0,0,fx.width,fx.height);bits=bits.filter(b=>b.l-->0);
 for(const b of bits){b.vy+=.22;b.vx*=.99;b.x+=b.vx;b.y+=b.vy;b.r+=.2;fc.save();fc.globalAlpha=Math.min(1,b.l/40);fc.translate(b.x,b.y);fc.rotate(b.r);fc.fillStyle=b.c;fc.fillRect(-b.s/2,-b.s/4,b.s,b.s/2);fc.restore()}
 requestAnimationFrame(loop)})();

/* Navigasi, fullscreen & musik */
const bgm=$('#bgm');let cur=0;
function go(n){$$('.page').forEach(p=>p.classList.remove('on'));$('#p'+n).classList.add('on');cur=n;$('#chap').textContent=`Chapter ${n} / 8`;}
document.addEventListener('click',e=>{const b=e.target.closest('[data-go]');if(b&&!b.disabled)go(+b.dataset.go)});
$('#enter').onclick=async()=>{
 try{if(!document.fullscreenElement)await document.documentElement.requestFullscreen()}catch(err){}
 bgm.volume=0;bgm.play().then(()=>{const t=setInterval(()=>{bgm.volume=Math.min(.7,bgm.volume+.05);if(bgm.volume>=.7)clearInterval(t)},180)}).catch(()=>{});
 $('#hud').hidden=false;go(1)};
$('#mute').onclick=e=>{bgm.muted=!bgm.muted;e.currentTarget.classList.toggle('off',bgm.muted)};
const HOUSES={g:['Gryffindor','Keberanian'],s:['Slytherin','Ambisi'],r:['Ravenclaw','Kebijaksanaan'],h:['Hufflepuff','Kesetiaan']};
function setHouse(k){const[n,m]=HOUSES[k],f='assets/house-'+n.toLowerCase(),im=u=>`<img src="${u}" alt="" onerror="this.remove()">`;
 document.documentElement.dataset.house=k;$$('#houses button').forEach(b=>b.classList.toggle('on',b.dataset.h===k));$$('.hdeco').forEach(e=>e.remove());
 $$('.page').forEach(p=>{if(p.id==='p0')return;p.insertAdjacentHTML('beforeend',`<div class="hdeco"><div class="hpen"><span class="hcr" data-l="${n[0]}">${im(f+'.svg')}</span><b>${n}</b><small>${m}</small></div><span class="hcr big" data-l="${n[0]}">${im(f+'.svg')}</span><span class="hor l" data-label="${f}-ornament.svg">${im(f+'-ornament.svg')}</span><span class="hor r" data-label="${f}-ornament.svg">${im(f+'-ornament.svg')}</span></div>`)});
 $('#kick').textContent='Special Birthday Edition · House of '+n;confetti(60,innerWidth-90,90)}
$$('#houses button').forEach(b=>b.onclick=()=>setHouse(b.dataset.h));

/* Galeri */
$('#grid').innerHTML=PHOTOS.map((p,i)=>`<div class="card" data-i="${i}">${slot(`assets/photo-${i+1}.webp`,`assets/photo-${i+1}.webp&#10;rasio ${p[3].replace('/',':')}`,`aspect-ratio:${p[3]}`)}<div class="rev"><span class="score">${p[0]}</span><h4>${p[1]}</h4>${p[2]}</div></div>`).join('');
const fit=im=>{const f=()=>{if(im.naturalWidth)im.parentElement.style.aspectRatio=im.naturalWidth+'/'+im.naturalHeight};im.complete?f():im.onload=f};
$$('#grid img').forEach(fit);
$('#grid').onclick=e=>{const c=e.target.closest('.card');if(!c)return;const i=+c.dataset.i,p=PHOTOS[i];
 $('#mph').innerHTML=`<img src="assets/photo-${i+1}.webp" alt="" onerror="this.remove()">`;$('#mph').dataset.label=`assets/photo-${i+1}.webp\nrasio ${p[3].replace('/',':')}`;$('#mph').style.aspectRatio=p[3];fit($('#mph img'));
 $('#msc').textContent=p[0];$('#mti').textContent=p[1];$('#mtx').textContent=p[2];$('#modal').hidden=false};
$('#mx').onclick=()=>$('#modal').hidden=true;$('#modal').onclick=e=>{if(e.target.id==='modal')$('#modal').hidden=true};

/* Cermin */
let mi=-1;function reflect(){mi=(mi+1)%REASONS.length;const m=$('#mirror');m.classList.remove('spark');void m.offsetWidth;m.classList.add('spark');$('#mtext').textContent=REASONS[mi]}
$('#mirror').onclick=reflect;$('#lumos').onclick=reflect;

/* Tarot */
(function(){const o=[...PROPHECIES].sort(()=>Math.random()-.5);let done=false;
 $('#tarot').innerHTML=o.map((t,i)=>`<div class="tc" data-i="${i}"><div class="ti"><div class="face tback">✦${`<img src="assets/tarot-back.svg" alt="" onerror="this.remove()">`}</div><div class="face tfront">${t}</div></div></div>`).join('');
 $$('.tc').forEach(c=>c.onclick=()=>{if(done)return;done=true;$$('.tc').forEach(x=>{x.classList.add('flip');x.classList.add(x===c?'pick':'dim')})})})();

/* Kue */
let blown=false;function blow(){if(blown)return;blown=true;$$('.candle').forEach(c=>c.classList.add('out'));
 setTimeout(()=>{confetti(220,innerWidth/2,innerHeight/2.4);$('#wishmsg').classList.add('show');$('#cakehint').textContent='Make a Wish... ✦'},500)}
$('#cake').onclick=blow;

/* Blind box */
let hits=0;$('#bb').onclick=()=>{if(hits>=5)return;hits++;const b=$('#bb');b.style.setProperty('--g',.2+hits*.18);b.style.setProperty('--s',1+hits*.04);b.style.transform=`scale(${1+hits*.04})`;
 b.classList.remove('shake');void b.offsetWidth;b.classList.add('shake');$('#bbhint').textContent=`Klik kotak 5 kali untuk membukanya (${hits} / 5)`;
 if(hits===5){b.classList.add('open');setTimeout(()=>{confetti(260);$('#reveal').hidden=false;$('#bbhint').textContent='Terbuka!'},450)}};
