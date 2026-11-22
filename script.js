/* ===== KONFIGURASI (edit di sini) ===== */
const CFG={nama:'Ais',umur:'21',tanggal:'23 November 2005'};
const REASONS=['Ais adalah pendengar terbaik yang pernah Abby kenal.','You deserve the love of the world.','Suara my baby selalu bikin Abby luluh dan tenang','Ais adalah orang paling berani sama paling kuat di dunia ini.','Senyum my baby sangat manis seperti yupi plus karamel.','You are just never giving up, even when all things goes bad.','Ide dan saran-saran my baby selalu yang Abby nantikan.'];
const PHOTOS=[/* [skor, judul, review, rasio placeholder untuk lightbox, ukuran tile bento: 'big' | 'tall' | 'wide' | ''] - 16 foto, foto asli dipotong (cover) di tile, lightbox menampilkan utuh */
['∞∞/10','Foto Pertama Ais','Ini foto pertama yang Ais kirim ke Abby','4/3','big'],
['∞∞/10','Pandang Pertama','Foto di telegram yang bikin Abby so crazy.','1/1',''],
['∞/10','Motong Rambut','Abby suka banget liat foto ini, Ais seperti bidadari.','4/5',''],
['👅/10','Like Sugar On My Tongue','Foto ini yang paling banyak ngabisin cairan George.','3/4','tall'],
['∞/10','Bibir Manyun','Sayang, Abby suka banget sama bibir seksi my baby.','4/3',''],
['∞/10','Selalu Cantik','Bahkan sebelum ketemu Abbypun my baby so cantik aaaa.','1/1',''],
['∞/10','Brand Ambassador','JKT48? Apa itu, ini dia Brand Ambassador Pocari Abby.','3/4','tall'],
['∞∞/10','Anniversary Day','Ini my baby di hari anniversary kita yang pertama.','4/3','big'],
['∞∞∞/10','Candid VC','Melihat my baby dari layar HP, gak ada yang lebih membuat Abby bahagia.','1/1',''],
['∞∞∞/10','Master Tiktok','Mana ada orang lain bikin Tiktok semahir cewekku?.','1/1',''],
['∞∞∞/10','Ms. Kacamata','Intinya kacamata, mama udahlah.','4/3',''],
['∞/10','Outfit of the Day','My baby racikan outfitnya so great, Abby sangat bangga lah my baby is selalu so good mau main kemanapun.','3/4','tall'],
['∞∞∞/10','Melet','Mau dibilang fetish Abby melet pun Abby 100% setuju.','1/1',''],
['∞∞/10','Cat-like Person','Kucing manisku yang Abby sayang.','1/1',''],
['∞/10','Rambut','Rambut lurus pacarku, yang akan Abby selalu mainin kalau nanti udah ketemu.','1/1','']];
const PROPHECIES=['Proses skripsian Ais akan berjalan selalu lancar sampai wisuda.','Abby dan Ais tahun depan akan ketemu dan semakin dekat bersama','Abby dan Ais mendapatkan rezeki yang banyak dan kesehatan yang berlimpah'];
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
function placeTrain(n){train.style.opacity=n?1:0;train.style.transform=`translateX(${innerWidth*(.04+.96*n/9)-train.offsetWidth}px)`}
function go(n){if(busy||n===cur)return;const from=$('#p'+cur),to=$('#p'+n);busy=true;
 document.documentElement.style.setProperty('--d',n>cur?1:-1);
 from.classList.remove('on');from.classList.add('out');to.classList.add('on','in');
 const w=$('#whoosh');w.classList.remove('go');void w.offsetWidth;w.classList.add('go');
 train.classList.add('run');placeTrain(n);cur=n;$('#chap').textContent=`Chapter ${n} / 9`;syncBack();
 setTimeout(()=>{from.classList.remove('out');to.classList.remove('in');train.classList.remove('run');busy=false},1150)}
placeTrain(0);addEventListener('resize',()=>placeTrain(cur));
function syncBack(){const b=$('#back');b.hidden=cur<2;b.textContent='‹ Chapter '+(cur-1)}
$('#back').onclick=()=>go(cur-1);
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
