/* ===== KONFIGURASI (edit di sini) ===== */
const CFG={nama:'Nama Kamu',umur:'17',tanggal:'1 Januari 2027'};
const REASONS=['Senyummu bisa menerangi ruangan lebih terang dari mantra Lumos.','Kamu pendengar terbaik yang pernah kukenal.','Tawamu membuat hari buruk terasa ringan.','Kamu berani tetap lembut di dunia yang sibuk.','Caramu peduli pada hal-hal kecil itu istimewa.','Kamu membuat orang lain merasa dilihat.','Ceritamu selalu membuatku ingin tinggal lebih lama.','Kamu kuat, bahkan saat tidak merasa begitu.','Ada keajaiban di caramu menjadi dirimu sendiri.','Dunia sedikit lebih hangat karena ada kamu.'];
const PHOTOS=[/* [skor, judul, review, rasio placeholder untuk lightbox, ukuran tile bento: 'big' | 'tall' | 'wide' | ''] - 16 foto, foto asli dipotong (cover) di tile, lightbox menampilkan utuh */
['10/10','Hari Pertama Kita','Foto ini bukti kamu selalu tampil paling bersinar. Aku ingat betul tawanya.','4/3','big'],
['10/10','Senyum Favorit','Ekspresi ini langsung mengubah mood seisi ruangan.','1/1',''],
['9.9/10','Petualangan Seru','Ratu petualangan. Aku ikut ke mana pun kamu pergi.','4/5',''],
['10/10','Momen Manis','Sederhana tapi hangat, seperti secangkir butterbeer di musim dingin.','3/4','tall'],
['10/10','Gaya Tak Tertandingi','Ada yang bisa berpose sekeren ini tanpa usaha? Hanya kamu.','4/3',''],
['11/10','Selalu Cantik','Skor ini sengaja melebihi batas karena kamu memang istimewa.','1/1',''],
['10/10','Tawa Lepas','Tawamu bikin semua orang di sekitarmu ikut bahagia.','3/4','tall'],
['9.8/10','Hari Santai','Bahkan saat santai, kamu tetap yang paling bersinar.','4/3','big'],
['10/10','Candid Terbaik','Foto yang tidak direncanakan selalu paling jujur.','1/1',''],
['10/10','Tatapan Sihir','Satu tatapan dan mantranya langsung bekerja.','1/1',''],
['9.9/10','Si Penjelajah','Kamu selalu berani mencoba hal-hal baru.','4/3',''],
['10/10','Outfit of the Day','Penyihir paling modis di seluruh Hogwarts.','3/4','tall'],
['10/10','Pelukan Hangat','Bagian favoritku dari hari itu.','1/1',''],
['11/10','Momen Favoritku','Kalau bisa diulang, aku pilih yang satu ini.','1/1',''],
['10/10','Sampai Jumpa Lagi','Penutup manis untuk semua kenangan tahun ini.','1/1','']];
const PROPHECIES=['Tahun ini bintang akan menyusun jalan menuju kejutan yang sudah lama kamu tunggu.','Seseorang yang kamu sayangi akan membawa kabar baik sebelum bulan purnama berikutnya.','Keberanian kecilmu hari ini akan tumbuh menjadi cerita besar yang kamu banggakan.'];
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
/* Gambar fleksibel: tulis nama file TANPA ekstensi, script mencoba format ini secara berurutan */
const EXT=['webp','jpg','jpeg','png','gif','avif','JPG','JPEG','PNG'];
function loadAny(im,cb){let i=0;const b=im.dataset.base;im.onerror=()=>{if(++i<EXT.length)im.src=b+'.'+EXT[i];else im.remove()};if(cb)im.onload=cb;im.src=b+'.'+EXT[0]}
const slot=(base,label,st='')=>`<figure class="slot" style="${st}" data-label="${label}"><img data-base="${base}" alt=""></figure>`;
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
let busy=false;const train=$('#train');
function placeTrain(n){train.style.opacity=n?1:0;train.style.transform=`translateX(${innerWidth*(.04+.96*n/8)-train.offsetWidth}px)`}
function go(n){if(busy||n===cur)return;const from=$('#p'+cur),to=$('#p'+n);busy=true;
 document.documentElement.style.setProperty('--d',n>cur?1:-1);
 from.classList.remove('on');from.classList.add('out');to.classList.add('on','in');
 const w=$('#whoosh');w.classList.remove('go');void w.offsetWidth;w.classList.add('go');
 train.classList.add('run');placeTrain(n);cur=n;$('#chap').textContent=`Chapter ${n} / 8`;
 setTimeout(()=>{from.classList.remove('out');to.classList.remove('in');train.classList.remove('run');busy=false},1150)}
placeTrain(0);addEventListener('resize',()=>placeTrain(cur));
document.addEventListener('click',e=>{const b=e.target.closest('[data-go]');if(b&&!b.disabled)go(+b.dataset.go)});
$('#enter').onclick=async()=>{
 try{if(!document.fullscreenElement)await document.documentElement.requestFullscreen()}catch(err){}
 bgm.volume=0;bgm.play().then(()=>{const t=setInterval(()=>{bgm.volume=Math.min(.7,bgm.volume+.05);if(bgm.volume>=.7)clearInterval(t)},180)}).catch(()=>{});
 $('#hud').hidden=false;go(1)};
$('#mute').onclick=e=>{bgm.muted=!bgm.muted;e.currentTarget.classList.toggle('off',bgm.muted)};
const HOUSES={g:['Gryffindor','Keberanian'],s:['Slytherin','Ambisi'],r:['Ravenclaw','Kebijaksanaan'],h:['Hufflepuff','Kesetiaan']};
function setHouse(k){const[n,m]=HOUSES[k],f='assets/house-'+n.toLowerCase(),im=u=>`<img src="${u}" alt="" onerror="this.remove()">`;
 document.documentElement.dataset.house=k;$$('#houses button').forEach(b=>b.classList.toggle('on',b.dataset.h===k));$$('.hdeco').forEach(e=>e.remove());
 $$('.page').forEach(p=>{if(p.id==='p0')return;p.insertAdjacentHTML('beforeend',`<div class="hdeco"><div class="hpen"><span class="hcr" data-l="${n[0]}">${im(f+'.svg')}</span><b>${n}</b><small>${m}</small></div><span class="hcr big" data-l="${n[0]}">${im(f+'.svg')}</span><div class="hpole l"><i class="rod"></i><i class="post"></i><span class="hor" data-label="${f}-ornament.png">${im(f+'-ornament.png')}</span></div><div class="hpole r"><i class="rod"></i><i class="post"></i><span class="hor" data-label="${f}-ornament.png">${im(f+'-ornament.png')}</span></div></div>`)});
 $('#kick').textContent='Special Birthday Edition · House of '+n;confetti(60,innerWidth-90,90)}
$$('#houses button').forEach(b=>b.onclick=()=>setHouse(b.dataset.h));

/* Galeri */
$('#grid').innerHTML=PHOTOS.map((p,i)=>`<div class="tile ${p[4]}" data-i="${i}">${slot(`assets/photo-${i+1}`,`assets/photo-${i+1}&#10;(webp / jpg / png / gif)`)}<div class="cap"><span class="score">${p[0]}</span><h4>${p[1]}</h4><p>${p[2]}</p></div></div>`).join('');
$$('img[data-base]').forEach(im=>loadAny(im));
const fit=im=>{const f=()=>{if(im.naturalWidth)im.parentElement.style.aspectRatio=im.naturalWidth+'/'+im.naturalHeight};im.complete?f():im.onload=f};
$('#grid').onclick=e=>{const c=e.target.closest('.tile');if(!c)return;const i=+c.dataset.i,p=PHOTOS[i];
 $('#mph').innerHTML=`<img data-base="assets/photo-${i+1}" alt="">`;$('#mph').dataset.label=`assets/photo-${i+1}\nrasio ${p[3].replace('/',':')}`;$('#mph').style.aspectRatio=p[3];{const mi2=$('#mph img');loadAny(mi2,()=>fit(mi2))}
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
