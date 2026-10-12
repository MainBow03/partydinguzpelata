import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js';
import {
  getFirestore, collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc,
  onSnapshot, query, where, limit, serverTimestamp, increment, runTransaction
} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js';

// Configurazione web fornita nel messaggio dell'utente. La chiave API web non è una password:
// proteggi il progetto con Authentication, Firestore Rules e restrizioni appropriate in Google Cloud.
const firebaseConfig = {
  apiKey: 'AIzaSyBrXTAOKGL0X76GBQ8Sdj4sBcYiEoKdhB0',
  authDomain: 'mario-party-style-game.firebaseapp.com',
  projectId: 'mario-party-style-game',
  storageBucket: 'mario-party-style-game.firebasestorage.app',
  messagingSenderId: '443206292657',
  appId: '1:443206292657:web:ab633567201a700da4be90',
  measurementId: 'G-93MF2N98C1'
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const root = document.getElementById('app');
const connectionLabel = document.getElementById('connection-label');
const headerPlayer = document.getElementById('header-player');
const toastNode = document.getElementById('toast');

const ROSTER = [
  {id:'g1',cat:'Gumball',n:'Gumball',i:'https://i.pinimg.com/736x/af/61/0f/af610f55e819f4bd3f37e5001a2b19ee.jpg'},
  {id:'g2',cat:'Gumball',n:'Darwin',i:'https://i.pinimg.com/1200x/5a/cf/9c/5acf9c886678411963046b04051e610e.jpg'},
  {id:'g3',cat:'Gumball',n:'Anais',i:'https://i.pinimg.com/736x/68/6f/3c/686f3c8f998bf2d90e5e4c294e007788.jpg'},
  {id:'g4',cat:'Gumball',n:'Nicole',i:'https://i.pinimg.com/736x/81/24/e4/8124e43da43e1d06dcdbca15f22a0cd9.jpg'},
  {id:'g5',cat:'Gumball',n:'Sig.ra Robinson',i:'https://i.pinimg.com/736x/ac/31/60/ac3160d1a5a50d7e95147b228e76f75c.jpg'},
  {id:'g6',cat:'Gumball',n:'Barbara',i:'https://i.pinimg.com/736x/08/38/28/0838283d8d82e79706028350d500bd7a.jpg'},
  {id:'dc1',cat:'Disventure Camp',n:'Tom',i:'https://i.pinimg.com/736x/db/d4/2a/dbd42a105be5cd57fa6a0ed9a8ab7df8.jpg'},
  {id:'dc2',cat:'Disventure Camp',n:'Jake',i:'https://i.pinimg.com/736x/09/cb/93/09cb935d20ccac3df1d95df305e3ff75.jpg'},
  {id:'dc3',cat:'Disventure Camp',n:'Aiden',i:'https://i.pinimg.com/736x/5a/d2/c3/5ad2c35deb3dccf1b841c7ef0b90d20d.jpg'},
  {id:'dc6',cat:'Disventure Camp',n:'Spencer',i:'https://i.pinimg.com/736x/1a/a6/94/1aa69432bc0438f9a30f595ff4693afa.jpg'},
  {id:'dc9',cat:'Disventure Camp',n:'Fiore',i:'https://i.pinimg.com/736x/97/ed/43/97ed439990f0819b9441ea5503d36bf9.jpg'},
  {id:'dc10',cat:'Disventure Camp',n:'Ashley',i:'https://i.pinimg.com/736x/f4/12/54/f41254f60d4c222cf59e1abbb4b0ae99.jpg'},
  {id:'dc11',cat:'Disventure Camp',n:'Tess',i:'https://i.pinimg.com/736x/b4/0c/3a/b40c3ac96de25749753dee44ecb90196.jpg'},
  {id:'dc12',cat:'Disventure Camp',n:'Rosa Maria',i:'https://i.pinimg.com/736x/43/26/f6/4326f60c5e78b7f88d54fdb7baa60881.jpg'},
  {id:'s2',cat:'I Simpson',n:'Lisa',i:'https://i.pinimg.com/736x/81/68/de/8168de5a140ed669abfe5e2e4771b1b6.jpg'},
  {id:'s3',cat:'I Simpson',n:'Bart',i:'https://i.pinimg.com/1200x/03/11/09/031109591c66397c76e7489d42f3127d.jpg'},
  {id:'s4',cat:'I Simpson',n:'Marge',i:'https://i.pinimg.com/736x/77/6d/41/776d41748c4c9ae5940d8a9b10db881a.jpg'},
  {id:'s5',cat:'I Simpson',n:'Maggie',i:'https://i.pinimg.com/736x/12/f7/17/12f7172ecf515a362b967146399c883b.jpg'},
  {id:'sb1',cat:'Spongebob',n:'Spongebob',i:'https://i.pinimg.com/736x/08/9d/56/089d562f45d59b2f7e37e643a5ebf927.jpg'},
  {id:'sb2',cat:'Spongebob',n:'Patrick',i:'https://i.pinimg.com/736x/64/a3/f7/64a3f72a484c92329ba86e33263f2478.jpg'},
  {id:'sb5',cat:'Spongebob',n:'Squiddi',i:'https://i.pinimg.com/736x/f1/98/f3/f198f31f5a1d4f4e42c52a3026ca4137.jpg'},
  {id:'sb6',cat:'Spongebob',n:'Plankton',i:'https://i.pinimg.com/736x/af/f1/8b/aff18ba41f798ebe95ae1809410cbec9.jpg'},
  {id:'fop1',cat:'Duefantagenitori',n:'Timmy',i:'https://i.pinimg.com/1200x/d4/63/5d/d4635d14bb9b3759f41138ecd2eb1957.jpg'},
  {id:'fop2',cat:'Duefantagenitori',n:'Cosmo',i:'https://i.pinimg.com/736x/47/22/99/472299b4c669c052c662df1730403d83.jpg'},
  {id:'fop3',cat:'Duefantagenitori',n:'Wanda',i:'https://i.pinimg.com/736x/99/87/b79d555daf6e60f2c501064ac38f.jpg'},
  {id:'fop4',cat:'Duefantagenitori',n:'Vicky',i:'https://i.pinimg.com/736x/60/c4/17/60c4178a696ba9ce13dd9cc6c93c6e67.jpg'},
  {id:'prin1',cat:'Principesse',n:'Rosalinda',i:'https://i.pinimg.com/736x/da/87/05/da87056e17f0b24989898b059a1b0560.jpg'},
  {id:'prin2',cat:'Principesse',n:'Peach',i:'https://i.pinimg.com/736x/98/65/39/986539a9ccd1408d51eb061df724377f.jpg'},
  {id:'prin3',cat:'Principesse',n:'Elsa',i:'https://i.pinimg.com/1200x/2f/bb/8b/2fbb8ba8053726318534824cf1a455d8.jpg'},
  {id:'prin4',cat:'Principesse',n:'Biancaneve',i:'https://i.pinimg.com/1200x/c0/c9/37/c0c9370bb94279706e63c9a3b9b8bc91.jpg'},
  {id:'prin5',cat:'Principesse',n:'Vanellope',i:'https://i.pinimg.com/1200x/99/e6/d4/99e6d42b2285d52ce58b348517c21059.jpg'},
  {id:'prin6',cat:'Principesse',n:'Daisy',i:'https://i.pinimg.com/736x/b5/b4/4f/b5b44fc92e50bcd1805d1e7ea2d1e579.jpg'},
  {id:'prin7',cat:'Principesse',n:'Zelda',i:'https://i.pinimg.com/736x/ee/5c/20/ee5c2037b8606f710537ff9742e1b1e6.jpg'},
  {id:'ad2',cat:'American Dad',n:'Francine',i:'https://i.pinimg.com/736x/95/f1/5d/95f15df1ead09d7f486f597670339b99.jpg'},
  {id:'ad3',cat:'American Dad',n:'Hayley',i:'https://i.pinimg.com/736x/ff/0a/68/ff0a68de85d1bd98e29be7c05860b437.jpg'},
  {id:'ad4',cat:'American Dad',n:'Roger',i:'https://i.pinimg.com/1200x/26/68/1a/26681ade5ccae3524acf2a203e19b6ac.jpg'},
  {id:'sm1',cat:'Super Mario',n:'Mario',i:'https://i.pinimg.com/736x/be/2d/98/be2d98feb1899ffa3d713423b50cbb98.jpg'},
  {id:'sm2',cat:'Super Mario',n:'Luigi',i:'https://i.pinimg.com/736x/ed/f2/f6/edf2f6063d11ab84570572a42beba223.jpg'},
  {id:'sm3',cat:'Super Mario',n:'Wario',i:'https://i.pinimg.com/736x/d1/dc/2f/d1dc2f211895104743fce7407d5d90df.jpg'},
  {id:'sm4',cat:'Super Mario',n:'Waluigi',i:'https://i.pinimg.com/736x/68/2b/61/682b611cb8b1b9eca045cc801e5ed25f.jpg'},
  {id:'sm5',cat:'Super Mario',n:'Yoshi',i:'https://i.pinimg.com/736x/f3/05/7f/f3057f14de68b0afe682ffe93dcc479b.jpg'},
  {id:'sm9',cat:'Super Mario',n:'Goomba',i:'https://i.pinimg.com/736x/de/d4/cc/ded4ccf551346be050aa1822dfc1f890.jpg'},
  {id:'ig3',cat:'I Griffin',n:'Stewie',i:'https://i.pinimg.com/736x/f3/05/30/f30530fb1e9e118e7f66568d82c05bc5.jpg'},
  {id:'ig4',cat:'I Griffin',n:'Meg',i:'https://i.pinimg.com/1200x/fc/08/05/fc080502466c0c9a0d48433022fe507d.jpg'},
  {id:'ig5',cat:'I Griffin',n:'Quagmire',i:'https://i.pinimg.com/736x/9c/ab/ba/9cabba30d1f8cfbc11c8c9e7d1c0566f.jpg'},
  {id:'su1',cat:'Steven Universe',n:'Steven',i:'https://i.pinimg.com/736x/13/7e/1f/137e1fe49b450be5b1bd4785f4f19963.jpg'},
  {id:'su2',cat:'Steven Universe',n:'Perla',i:'https://i.pinimg.com/736x/72/72/8d/72728d693439a74022d978b5fdedc12e.jpg'},
  {id:'su3',cat:'Steven Universe',n:'Ametista',i:'https://i.pinimg.com/736x/b7/7c/24/b77c240460645834ca641472d91d24f6.jpg'},
  {id:'su4',cat:'Steven Universe',n:'Garnet',i:'https://i.pinimg.com/736x/c7/d6/04/c7d6048b710172958bb07056f870606a.jpg'},
  {id:'su5',cat:'Steven Universe',n:'Lapis',i:'https://i.pinimg.com/1200x/09/fb/12/09fb12467957da96913fc8f75e6f6356.jpg'},
  {id:'su6',cat:'Steven Universe',n:'Peridot',i:'https://i.pinimg.com/736x/2b/5d/13/2b5d132d544a18b864861d9026bf135d.jpg'},
  {id:'su7',cat:'Steven Universe',n:'Jasper',i:'https://i.pinimg.com/1200x/4c/6b/20/4c6b20ef533c1343eed1702288d17cf4.jpg'}
];

const GAMES = [
  {id:'memory',name:'Memory',icon:'🧠',tagline:'Memorizza le coppie prima degli altri.',desc:'Gira le carte della griglia 6×6 e trova tutte le 18 coppie. Se sbagli, aspetti due secondi prima di riprovare.',short:'18 coppie · memoria'},
  {id:'bombpass',name:'Passa la bomba',icon:'💣',tagline:'Passala in fretta: la miccia non si resetta!',desc:'La bomba passa da un personaggio all’altro mentre la miccia continua a scorrere per 7–20 secondi. Quando esplode, chi la tiene viene eliminato e il cerchio si restringe. Parte una nuova miccia per i sopravvissuti: si gioca finché resta un solo vincitore.',short:'Una miccia per round · ultimo sopravvissuto vince'},
  {id:'cutwire',name:'Taglia il filo',icon:'✂️',tagline:'Un incudine, dieci pistoni, tutti sul palco.',desc:'È una sola sfida condivisa: a turno ogni personaggio sceglie uno dei pistoni ancora accesi. Se è sicuro si spegne e tocca al prossimo. Se fa cadere l’incudine, quel personaggio è fuori; nel round successivo c’è un pistone in meno. Vince l’ultimo rimasto.',short:'Un solo palco · scegli a turno · non farti colpire'},
  {id:'safe',name:'Cassaforte infernale',icon:'🔐',tagline:'Il codice non si indovina da solo.',desc:'Trova le combinazioni da 3, 4, 5 e 6 cifre. Verde significa cifra e posizione corrette, giallo cifra presente ma fuori posto.',short:'4 codici · deduzione'},
  {id:'battle',name:'Battle Royale',icon:'🚪',tagline:'Scegli una porta. Fidati poco.',desc:'Scegli fra sei porte. Chi si ritrova sulla stessa porta deve affrontare il caos del dado; ogni tre round una porta viene rimossa.',short:'6 porte · 20 HP'},
  {id:'connect',name:'Collega i puntini',icon:'🎨',tagline:'Abbina il simbolo al colore.',desc:'Memorizza l’associazione simbolo-colore e rispondi velocemente in tre livelli: 6, 10 e 18 colori.',short:'6 / 10 / 18 colori'},
  {id:'tabelluno',name:'TabellUNO',icon:'🃏',tagline:'Pesca una carta e manda il tuo personaggio al traguardo!',desc:'Tutti corrono sullo stesso tabellone e ogni personaggio usa il proprio PNG come pedina. A turno si pesca una carta: il numero dice quanti passi fare. Alcune caselle fanno avanzare o arretrare, altre chiedono di scegliere un colore o un avversario da bloccare. Il primo al traguardo vince; gli altri continuano per la classifica.',short:'Il tuo PNG è la pedina · pesca e corri'},
  {id:'space',name:'Viaggio nello spazio',icon:'🚀',tagline:'Schiva gli asteroidi e sali.',desc:'Guida la navicella con mouse o dito. Hai tre vite; gli asteroidi diventano più rapidi man mano che sali.',short:'3 vite · resistenza'},
  {id:'catch',name:'Acchiappa tutto!',icon:'🎯',tagline:'Riflessi pronti, dita veloci.',desc:'Clicca i bersagli comuni per 1 punto, quelli rari per 3. Le trappole fanno perdere 2 punti. Attenzione: spariscono in fretta.',short:'40 secondi · riflessi'},
  {id:'cups',name:'Bomba sotto il bicchiere',icon:'🥤',tagline:'Segui i bicchieri, non la fortuna.',desc:'Due bombe si nascondono sotto i bicchieri prima che vengano mescolati. Scegli quello sicuro; hai tre vite e i round diventano più difficili.',short:'3 vite · attenzione'}
];
const EMOJIS = ['🍉','🍋','🍓','🍇','🍒','🥝','🍍','🥑','🍕','🍔','🍟','🌮','🍩','🍪','🍰','🍭','🍿','🥨','🐸','🐼','🦊','🐙','🦄','🐝','🦋','🐢','🐳','🦖','⚽','🎲','🎧','🎸','🚗','🚀','🌈','⭐'];
const COLORS = [
  {name:'rosso',hex:'#ff4f70'},{name:'blu',hex:'#4d8dff'},{name:'giallo',hex:'#ffd447'},
  {name:'verde',hex:'#4fe0a0'},{name:'viola',hex:'#b27aff'},{name:'arancione',hex:'#ff9e4a'},
  {name:'ciano',hex:'#45dff3'},{name:'rosa',hex:'#ff6fc8'},{name:'lime',hex:'#c8ff55'},
  {name:'indaco',hex:'#686cff'},{name:'corallo',hex:'#ff796c'},{name:'menta',hex:'#72ffcf'},
  {name:'oro',hex:'#bd9638'},{name:'fucsia',hex:'#ec45ff'},{name:'acqua',hex:'#258b99'},
  {name:'lilla',hex:'#d8a7ff'},{name:'ambra',hex:'#ffbd69'},{name:'smeraldo',hex:'#17885e'}
];
const SYMBOLS = ['◆','●','▲','✦','☂','♣','✿','☀','♫','☕','☯','♥','☘','✈','♠','⚡','✚','❖'];

const S = {
  uid:null, name:localStorage.getItem('caos_name')||'', screen:'home', roomCode:null, room:null,
  players:[], claims:[], results:[], progress:[], profile:{}, publicRooms:[], characterFilter:'Tutti',
  localGame:null, sharedGame:null, sharedGameKey:'', currentResultsKey:null, resolving:false, lastResultKey:null,
  unsubRoom:null,unsubPlayers:null,unsubClaims:null,unsubResults:null,unsubProgress:null,unsubSharedGame:null,
  sharedCpuTag:'', sharedCpuAt:0, sharedCpuBusy:false, sharedBombResolveBusy:false, sharedResultsTag:'',
  lastProgressKey:'', lastProgressSignature:'', lastProgressSentAt:0, progressSaving:false, cpuProgressSignatures:{},
  progressionLock:false, phaseKey:'', gameLoop:0, spaceRAF:0, lastHeartbeat:0,
  gameStatsMarked:new Set(), profileMarked:new Set(), notice:'', namePending:false
};
let toastTimer=0;

const $ = (sel, scope=document) => scope.querySelector(sel);
const $$ = (sel, scope=document) => [...scope.querySelectorAll(sel)];
const safe = (v='') => String(v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const shuffle = arr => { const a=[...arr]; for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; };
const choice = arr => arr[Math.floor(Math.random()*arr.length)];
const clamp = (v,min,max) => Math.max(min,Math.min(max,v));
const charById = id => ROSTER.find(c=>c.id===id) || null;
const gameById = id => GAMES.find(g=>g.id===id) || GAMES[0];
const playerMe = () => S.players.find(p=>p.uid===S.uid) || null;
const humans = () => S.players.filter(p=>!p.isCPU);
const playerCountLabel = () => `${S.players.length}/${S.room?.maxPlayers||0}`;
const codeText = code => String(code||'').toUpperCase();
function playerAvatar(p, size='') {
  const img = p?.characterImage || charById(p?.characterId)?.i || '';
  const name = p?.characterName || charById(p?.characterId)?.n || 'Personaggio da scegliere';
  return `<span class="portrait ${size}">${img?`<img src="${safe(img)}" alt="${safe(name)}" loading="lazy">`:''}<span class="fallback" style="${img?'':'display:grid'}">${p?.isCPU?'🤖':'👤'}</span></span>`;
}
function avatarImage(p, size=48) {
  const c=charById(p?.characterId);
  return c?.i || p?.characterImage || '';
}
function notify(message) {
  toastNode.textContent=message; toastNode.classList.add('show'); clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>toastNode.classList.remove('show'),3300);
}
function setConnection(text, good=true) {
  connectionLabel.textContent=text;
  const dot=$('.online-dot'); if(dot) dot.style.background=good?'var(--lime)':'var(--red)';
}
function stopSpaceLoop(){ if(S.spaceRAF) cancelAnimationFrame(S.spaceRAF); S.spaceRAF=0; }
function cleanupRoomListeners(){
  ['unsubRoom','unsubPlayers','unsubClaims','unsubResults','unsubProgress','unsubSharedGame'].forEach(k=>{if(S[k]){S[k]();S[k]=null;}});
  S.currentResultsKey=null; S.room=null;S.players=[];S.claims=[];S.results=[];S.progress=[];S.sharedGame=null;S.sharedGameKey='';S.sharedCpuTag='';S.sharedCpuAt=0;S.sharedCpuBusy=false;S.sharedBombResolveBusy=false;S.sharedResultsTag='';S.roomCode=null;S.localGame=null;S.phaseKey='';S.resolving=false;S.lastProgressKey='';S.lastProgressSignature='';S.lastProgressSentAt=0;S.cpuProgressSignatures={};
  stopSpaceLoop();
}
function syncHeader(){ headerPlayer.textContent=S.name?S.name.toUpperCase().slice(0,20):'GIOCATORE OSPITE'; }
function setScreen(screen){ S.screen=screen; render(); }
function home(){ if(S.roomCode){notify('Esci dalla stanza prima di tornare al menu.');return;} S.screen=S.name?'menu':'home';render(); }

function imgFallbackHandlers() {
  // Le immagini sono facoltative: se un link esterno non funziona resta visibile un'icona di fallback.
  root.querySelectorAll('img').forEach(img=>{
    img.addEventListener('error',()=>{img.style.display='none';const f=img.nextElementSibling;if(f&&f.classList.contains('fallback'))f.style.display='grid';},{once:true});
  });
}

function render() {
  syncHeader();
  if(!S.uid){root.innerHTML='<section class="loading-panel"><div class="loader"></div><p>Accesso ospite sicuro...</p></section>';return;}
  stopSpaceLoop();
  if(S.screen==='home') root.innerHTML=renderHome();
  else if(S.screen==='menu') root.innerHTML=renderMenu();
  else if(S.screen==='setup') root.innerHTML=renderSetup();
  else if(S.screen==='join') root.innerHTML=renderJoin();
  else if(S.screen==='browse') root.innerHTML=renderBrowse();
  else if(S.screen==='stats') root.innerHTML=renderStats();
  else if(S.screen==='room') root.innerHTML=renderRoom();
  else root.innerHTML=renderMenu();
  imgFallbackHandlers();
  if(S.roomCode && S.room?.phase==='active' && currentGame()?.id==='space') startSpaceLoop();
  updateTimerUI();
}

function renderHome(){
 return `<section class="hero"><div class="hero-copy"><div class="eyebrow">IL PARTY GAME DEI TUOI AMICI</div><h1>Più caos.<br><span class="accent">Meno dignità.</span></h1><p>Dieci minigiochi, personaggi assurdi e una classifica che non dimentica niente. Crea una stanza e scopri chi del gruppo merita davvero il trofeo.</p><div class="panel" style="max-width:460px;margin-top:24px;padding:22px"><div class="field" style="margin-top:0"><label for="player-name">Come ti chiamano?</label><input id="player-name" maxlength="18" autocomplete="nickname" placeholder="Il tuo nome da battaglia" value="${safe(S.name)}"></div><button class="btn btn-primary btn-block" data-action="set-name">ENTRA NEL CAOS <span>↗</span></button><p class="helper" style="margin:12px 0 0">Accesso ospite automatico. Nessuna password da creare.</p></div></div><div class="hero-art"><div class="orbit"></div><div class="hero-sticker"><span class="sticker-icon">🎲</span><span class="sticker-label">PARTY MODE: ON</span></div><div class="float-tag tag-left">10 MINIGIOCHI</div><div class="float-tag tag-right">∞ DRAMA</div></div></section><div class="footer-note">UN PROGETTO DI AMICI, PER AMICI · SCEGLI IL TUO PERSONAGGIO E FAI DEL TUO PEGGIO</div>`;
}
function renderMenu(){
 return `<div class="page-title"><div class="eyebrow">BENTORNATO, ${safe(S.name.toUpperCase())}</div><h1>Che il caos<br><span class="accent">abbia inizio.</span></h1><p>Scegli cosa fare. La tua prossima figuraccia è a un clic di distanza.</p></div><div class="section-head"><div><h2>Menu principale</h2><p>La lobby è online: chi inviti può entrare da un altro dispositivo.</p></div><span class="mono">PLAYER / ${safe(S.name.toUpperCase())}</span></div><div class="menu-grid"><button class="menu-card" data-action="go-setup"><span class="menu-arrow">↗</span><span class="menu-icon">🎮</span><h3>Crea stanza</h3><p>Scegli partecipanti, minigiochi e CPU.</p></button><button class="menu-card" data-action="go-join"><span class="menu-arrow">↗</span><span class="menu-icon">🔑</span><h3>Unisciti tramite codice</h3><p>Hai ricevuto un codice? Entra direttamente.</p></button><button class="menu-card" data-action="go-browse"><span class="menu-arrow">↗</span><span class="menu-icon">🛰️</span><h3>Lobby in attesa</h3><p>Scopri le stanze pubbliche che aspettano giocatori.</p></button><button class="menu-card" data-action="go-stats"><span class="menu-arrow">↗</span><span class="menu-icon">📊</span><h3>Le mie statistiche</h3><p>Personaggi più usati, vittorie e punti ottenuti.</p></button></div><div class="section-head"><div><h2>Nel menu del caos</h2><p>La selezione completa dei minigiochi previsti.</p></div><span class="mono">10 MODALITÀ</span></div><div class="menu-grid">${GAMES.map(g=>`<div class="menu-card" style="cursor:default;min-height:150px"><span class="menu-icon">${g.icon}</span><h3>${g.name}</h3><p>${g.short}</p></div>`).join('')}</div><div class="footer-note">I RISULTATI SI SALVANO SUL TUO PROFILO OSPITE DI QUESTO DISPOSITIVO/SESSIONE.</div>`;
}
function renderSetup(){
 return `<div class="page-title"><div class="eyebrow">SETUP PARTITA</div><h1>Fai le <span class="accent">regole.</span></h1><p>Prepara la lobby, poi manda il codice ai tuoi amici.</p></div><section class="panel narrow"><div class="form-row"><div class="field"><label for="max-players">Giocatori totali</label><select id="max-players">${[4,5,6,7,8,9,10].map(n=>`<option value="${n}" ${n===6?'selected':''}>${n} giocatori</option>`).join('')}</select></div><div class="field"><label for="game-count">Numero di minigiochi</label><select id="game-count">${Array.from({length:16},(_,i)=>i+1).map(n=>`<option value="${n}" ${n===8?'selected':''}>${n} ${n===1?'minigioco':'minigiochi'}</option>`).join('')}</select></div></div><div class="field"><label for="fill-cpu">Riempire gli slot vuoti con CPU?</label><select id="fill-cpu"><option value="yes">Sì, completa la lobby con NPC</option><option value="no">No, solo persone reali</option></select></div><div class="waiting-banner">La partita supporta da 4 a 10 partecipanti. Se attivi le CPU, gli slot non occupati da amici saranno completati automaticamente quando parte il match.</div><div class="actions-row"><button class="btn btn-primary" data-action="create-room">CREA LA STANZA ↗</button><button class="btn btn-secondary" data-action="go-menu">Indietro</button></div><p class="helper" style="margin-top:14px">Le modalità sono mescolate casualmente. Se selezioni più di 10 minigiochi, alcune modalità possono ricomparire.</p></section>`;
}
function renderJoin(){
 return `<div class="page-title"><div class="eyebrow">ENTRA NEL PARTY</div><h1>La stanza ti <span class="accent">aspetta.</span></h1><p>Inserisci il codice di sei caratteri condiviso dall'host.</p></div><section class="panel narrow"><div class="field"><label for="room-code-input">Codice stanza</label><input id="room-code-input" class="code-input" maxlength="6" placeholder="ABC123" autocomplete="off" spellcheck="false"></div><div class="actions-row"><button class="btn btn-primary" data-action="join-code">ENTRA NELLA STANZA ↗</button><button class="btn btn-secondary" data-action="go-menu">Indietro</button></div></section>`;
}
function renderBrowse(){
 return `<div class="page-title"><div class="eyebrow">RADAR LOBBY</div><h1>Chi sta <span class="accent">aspettando?</span></h1><p>Le stanze in attesa sono visibili a chi ha effettuato l'accesso.</p></div><div class="actions-row" style="margin:0 0 16px"><button class="btn btn-secondary btn-small" data-action="refresh-rooms">↻ Aggiorna</button><button class="btn btn-secondary btn-small" data-action="go-menu">Menu</button></div><section class="panel"><div class="room-list">${S.publicRooms.length?S.publicRooms.map(r=>`<div class="room-list-item"><div><h3>Stanza di ${safe(r.hostName||'Host')}</h3><p>${r.maxPlayers} posti · ${r.minigameCount} minigiochi · ${r.fillCPU?'CPU attive':'solo umani'}</p><p style="margin-top:7px">Codice <span class="room-code-small">${safe(r.code)}</span></p></div><button class="btn btn-primary btn-small" data-action="join-room" data-code="${safe(r.code)}">ENTRA ↗</button></div>`).join(''):'<div class="empty-state"><div style="font-size:30px">🫥</div><strong>Nessuna lobby in attesa</strong><span>Prova ad aggiornare o crea tu una stanza.</span></div>'}</div></section>`;
}
function renderStats(){
 const p=S.profile||{}; const charCounts=p.characterCounts||{}; const wins=p.miniGameWins||{};
 const topChar=Object.entries(charCounts).sort((a,b)=>b[1]-a[1])[0]; const topGame=Object.entries(wins).sort((a,b)=>b[1]-a[1])[0];
 const mostChar=topChar?charById(topChar[0]):null; const mostGame=topGame?gameById(topGame[0]):null;
 return `<div class="page-title"><div class="eyebrow">DOSSIER DEL GIOCATORE</div><h1>Il tuo <span class="accent">curriculum.</span></h1><p>Quello che succede in partita rimane nella classifica. Le statistiche sono associate al tuo accesso ospite.</p></div><div class="actions-row" style="margin-top:0"><button class="btn btn-secondary btn-small" data-action="go-menu">← Menu</button><button class="btn btn-secondary btn-small" data-action="refresh-stats">↻ Aggiorna</button></div><div class="stats-grid"><div class="stats-card"><strong>${Number(p.matchesPlayed||0)}</strong><span>Partite giocate</span></div><div class="stats-card"><strong>${Number(p.matchesWon||0)}</strong><span>Partite vinte</span></div><div class="stats-card"><strong>${Number(p.totalPoints||0)}</strong><span>Punti totali</span></div><div class="stats-card"><strong>${Number(p.gamesPlayed||0)}</strong><span>Minigiochi giocati</span></div></div><div class="lobby-columns"><section class="panel"><div class="subpanel-head"><h3>Il tuo personaggio preferito</h3><span class="counter">MOST PLAYED</span></div>${mostChar?`<div style="display:flex;gap:15px;align-items:center">${playerAvatar({characterId:mostChar.id})}<div><strong style="font-size:18px">${safe(mostChar.n)}</strong><p class="helper" style="margin:5px 0 0">Usato ${topChar[1]} ${topChar[1]===1?'volta':'volte'} nelle partite salvate.</p></div></div>`:'<p class="muted">Ancora nessun dato: gioca una partita per iniziare a riempire il profilo.</p>'}<div class="sep"></div><div class="subpanel-head"><h3>Minigioco più vinto</h3><span class="counter">TOP WINS</span></div>${mostGame?`<div style="display:flex;align-items:center;gap:14px"><div class="game-icon">${mostGame.icon}</div><div><strong>${mostGame.name}</strong><p class="helper" style="margin:5px 0 0">${topGame[1]} ${topGame[1]===1?'vittoria':'vittorie'}</p></div></div>`:'<p class="muted">Le vittorie dei minigiochi appariranno qui.</p>'}</section><section class="panel"><div class="subpanel-head"><h3>Altri record</h3><span class="counter">PERSONALE</span></div><div class="stat-flex"><span style="font-size:24px">🏆</span><div><strong>Percentuale di vittoria</strong><small>${p.matchesPlayed?Math.round((Number(p.matchesWon||0)/Number(p.matchesPlayed))*100):0}% delle partite</small></div></div><div class="stat-flex"><span style="font-size:24px">⚡</span><div><strong>Punti medi a minigioco</strong><small>${p.gamesPlayed?Math.round((Number(p.totalPoints||0)/Number(p.gamesPlayed))*10)/10:0} punti</small></div></div><div class="stat-flex"><span style="font-size:24px">🎭</span><div><strong>Personaggi provati</strong><small>${Object.keys(charCounts).length} personaggi diversi</small></div></div><div class="stat-flex"><span style="font-size:24px">🎲</span><div><strong>Modalità vinte</strong><small>${Object.keys(wins).length} minigiochi con almeno una vittoria</small></div></div></section></div><div class="footer-note">SE CANCELLI I DATI DEL PROFILO OSPITE POTRESTI PERDERE QUESTE STATISTICHE.</div>`;
}
function renderPlayerTiles(){
 return S.players.slice().sort((a,b)=>Number(b.isHost)-Number(a.isHost)||String(a.name).localeCompare(String(b.name))).map(p=>`<div class="player-tile">${playerAvatar(p)}<div class="player-info"><strong>${safe(p.name)} ${p.uid===S.uid?'(tu)':''}</strong><small>${p.isHost?'HOST':p.isCPU?'CPU / NPC':p.characterName||'Scegli un personaggio'}</small></div><span class="status-pill ${p.ready?'ready':''}">${p.isCPU?'CPU':p.ready?'PRONTO':'IN ATTESA'}</span></div>`).join('');
}
function renderCharacterPicker(){
 const me=playerMe(); const taken=new Map(S.claims.map(c=>[c.id,c.playerUid]));
 const cats=['Tutti',...new Set(ROSTER.map(c=>c.cat))];
 const roster=ROSTER.filter(c=>S.characterFilter==='Tutti'||c.cat===S.characterFilter);
 return `<div class="subpanel"><div class="subpanel-head"><h3>Scegli il tuo personaggio</h3><span class="counter">${S.claims.length} SCELTI</span></div><div class="character-filter">${cats.map(cat=>`<button class="filter-chip ${S.characterFilter===cat?'active':''}" data-action="filter-char" data-filter="${safe(cat)}">${safe(cat)}</button>`).join('')}</div><div class="character-grid">${roster.map(c=>{const holder=taken.get(c.id);const chosen=me?.characterId===c.id;const isTaken=holder&&holder!==S.uid;const locked=S.room?.phase!=='lobby';return `<button class="character-card ${chosen?'selected':''} ${(isTaken||locked)?'taken':''}" data-action="select-char" data-id="${c.id}" ${(isTaken||locked)?'disabled':''} title="${isTaken?'Già scelto':`Scegli ${safe(c.n)}`} "><img src="${safe(c.i)}" alt="${safe(c.n)}" loading="lazy"><strong>${safe(c.n)}</strong><small>${safe(c.cat)}${isTaken?' · scelto':''}</small></button>`;}).join('')}</div><p class="helper" style="margin:13px 0 0">Un personaggio per persona: i doppioni vengono bloccati anche nella lobby online.</p></div>`;
}
function renderLobby(){
 const me=playerMe(); const readyHuman=humans().filter(p=>p.ready).length;
 const canReady=!!me?.characterId;
 const currentCount=S.players.length, target=S.room.maxPlayers;
 const countdown=Math.max(0,Math.ceil(((S.room.countdownEndsAt||Date.now())-Date.now())/1000));
 return `<div class="lobby-top"><div><div class="eyebrow">LOBBY IN ATTESA</div><h1>Si parte <span class="accent">quando vuoi.</span></h1><p class="subhead">Scegli il personaggio, premi pronto e aspetta gli altri. La stanza si aggiorna in tempo reale.</p><div class="status-steps"><span class="step-chip active">01 · PERSONAGGIO</span><span class="step-chip ${me?.ready?'active':''}">02 · PRONTO</span><span class="step-chip">03 · 8 SECONDI</span></div></div><div><div class="mono">CODICE DA CONDIVIDERE</div><div class="room-code">${safe(S.roomCode)}</div><div class="actions-row"><button class="btn btn-secondary btn-small" data-action="copy-code">COPIA CODICE</button></div></div></div>${S.room.phase==='countdown'?`<div class="panel" style="margin-bottom:16px;text-align:center"><div class="eyebrow" style="justify-content:center">TUTTI PRONTI</div><div class="countdown-number countdown-pulse">${countdown}</div><p class="muted">La partita sta per cominciare...</p></div>`:''}<div class="lobby-columns"><section class="subpanel"><div class="subpanel-head"><h3>Partecipanti</h3><span class="counter">${currentCount} / ${target}</span></div><div class="players-grid">${renderPlayerTiles()}</div><div class="sep"></div><div class="waiting-banner">${S.room.fillCPU?`Le CPU completeranno gli slot rimasti liberi quando l'host avvia la partita.`:`Mancano ${Math.max(0,target-currentCount)} giocatori per riempire la lobby. I posti devono essere coperti da persone reali.`}<br>${readyHuman}/${humans().length} giocatori umani pronti.</div><div class="lobby-footer"><div class="helper">${S.room.hostUid===S.uid?'Sei l’host. La partenza è automatica quando tutti gli umani sono pronti.':'Aspetta l’host e gli altri giocatori.'}</div><button class="btn ${me?.ready?'btn-secondary':'btn-primary'}" data-action="toggle-ready" ${(!canReady||S.room.phase==='countdown')?'disabled':''}>${me?.ready?'ANNULLA PRONTO':'SONO PRONTO ✓'}</button></div></section><section>${renderCharacterPicker()}</section></div><div class="actions-row"><button class="btn btn-danger btn-small" data-action="leave-room">ESCI DALLA STANZA</button></div>`;
}
function renderIntro(){
 const g=currentGame(), me=playerMe(), readyCount=humans().filter(p=>p.ready).length;
 return `<div class="page-title"><div class="eyebrow">MINIGIOCO ${S.room.gameIndex+1} / ${S.room.selectedGames.length}</div><h1>Prossima sfida:<br><span class="accent">${g.name}</span></h1><p>${g.desc}</p></div><div class="lobby-columns"><section class="panel"><div class="game-center"><div style="font-size:68px;margin-bottom:14px">${g.icon}</div><h2>${g.tagline}</h2><p>${g.short}</p><div class="actions-row" style="justify-content:center"><button class="btn ${me?.ready?'btn-secondary':'btn-primary'}" data-action="ready-game" ${me?.ready?'disabled':''}>${me?.ready?'SEI PRONTO ✓':'PRONTO PER GIOCARE'}</button></div><p class="helper" style="margin-top:14px">Quando tutti gli umani sono pronti partono 3 secondi di conto alla rovescia.</p></div></section><section class="panel"><div class="subpanel-head"><h3>Chi è pronto?</h3><span class="counter">${readyCount}/${humans().length}</span></div><div class="players-grid">${renderPlayerTiles()}</div></section></div><div class="actions-row"><button class="btn btn-danger btn-small" data-action="leave-room">ESCI DALLA PARTITA</button></div>`;
}
function renderCountdown(){
 const g=currentGame(); const seconds=Math.max(0,Math.ceil(((S.room.countdownEndsAt||Date.now())-Date.now())/1000));
 return `<section class="panel narrow" style="text-align:center;margin-top:28px"><div class="eyebrow" style="justify-content:center">PREPARATI</div><div style="font-size:60px">${g.icon}</div><h1 style="font-size:40px;margin:15px auto">${g.name}</h1><p class="muted">Il minigioco comincia tra</p><div class="countdown-number countdown-pulse">${seconds}</div><p class="helper">Tieni la pagina aperta: la partita si sincronizza automaticamente.</p></section>`;
}
function currentGame(){ return gameById(S.room?.selectedGames?.[S.room?.gameIndex]||'memory'); }
function isSharedMinigame(id){ return ['bombpass','cutwire','tabelluno'].includes(id); }
function sharedGameDocumentId(){ return `m${S.room?.matchNumber||0}_g${S.room?.gameIndex??0}`; }
function sharedGameRef(){ return doc(db,'rooms',S.roomCode,'minigames',sharedGameDocumentId()); }
function renderRoom(){
 if(!S.room) return `<section class="loading-panel"><div class="loader"></div><p>Mi collego alla stanza...</p></section>`;
 if(S.room.status==='closed'||S.room.phase==='closed') return `<section class="panel narrow"><div class="result-hero"><div class="trophy">🪫</div><h1>Stanza <span class="accent">chiusa.</span></h1><p>L'host ha chiuso la lobby oppure la partita non è più disponibile.</p><button class="btn btn-primary" data-action="exit-closed">TORNA AL MENU</button></div></section>`;
 if(S.room.phase==='lobby'||S.room.phase==='countdown') return renderLobby();
 if(S.room.phase==='intro') return renderIntro();
 if(S.room.phase==='gameCountdown') return renderCountdown();
 if(S.room.phase==='active') return renderActiveGame();
 if(S.room.phase==='results') return renderGameResults();
 if(S.room.phase==='finalReveal') return renderFinalReveal();
 if(S.room.phase==='final') return renderFinal();
 return `<section class="panel narrow"><h2>Stanza in aggiornamento...</h2><p class="muted">Attendi un momento.</p></section>`;
}
function renderScoreboard(){
 const sorted=S.players.slice().sort((a,b)=>(b.totalPoints||0)-(a.totalPoints||0));
 return `<aside class="scoreboards-stack"><section class="side-score live-score"><div class="scoreboard-heading"><h3>🏁 CLASSIFICA MINIGIOCO</h3><span class="live-pill"><i></i> LIVE</span></div><p class="scoreboard-subtitle">${safe(currentGame().name)} · chi sta andando meglio in questa sfida</p><div class="live-score-list" id="live-score-list">${renderMiniLeaderboardRows()}</div><div id="live-score-note" class="live-score-note">Classifica aggiornata durante la partita</div></section><section class="side-score general-score"><div class="scoreboard-heading"><h3>🏆 CLASSIFICA GENERALE</h3><span class="counter">TUTTA LA PARTITA</span></div><div class="score-list">${sorted.map((p,i)=>`<div class="score-row"><span class="rank">${i+1}.</span>${avatarImgHtml(p,27)}<span class="score-name">${safe(p.name)}</span><b>${Number(p.totalPoints||0)}</b></div>`).join('')}</div></section></aside>`;
}
function avatarImgHtml(p,size=28){const src=avatarImage(p);return src?`<img src="${safe(src)}" alt="${safe(p.characterName||p.name||'Personaggio')}" style="width:${size}px;height:${size}px;object-fit:cover;border-radius:8px;background:#303248" onerror="this.style.visibility='hidden'">`:`<span style="font-size:19px">${p.isCPU?'🤖':'👤'}</span>`;}
function progressShape(ratio,sortValue,value,status='IN CORSO'){
 return {ratio:clamp(Number(ratio)||0,0,1),sortValue:Number(sortValue)||0,value:String(value||'In corso'),status:String(status||'IN CORSO')};
}
function localProgressFor(p,L=S.localGame){
 if(!L||p.uid!==S.uid)return null;
 const elapsed=Math.max(0,(Date.now()-L.startedAt)/1000);let ratio=0,sortValue=0,value='In corso',status='IN CORSO';
 switch(L.id){
  case 'memory': {const pairs=L.matched?.size/2||0;ratio=pairs/18;sortValue=pairs*1000-(L.moves||0);value=`${pairs}/18 coppie`;status=pairs===18?'COMPLETATO':'Coppie trovate';break;}
  case 'bombpass': {const survivors=L.alive?.length||0;ratio=clamp(((L.round||1)-1)/Math.max(3,S.players.length)+((L.alive?.includes(S.uid)?1:0)*.12),0,.96);sortValue=(L.round||1)*100+(L.passCount||0);value=`${L.round||1}° round · ${L.passCount||0} passaggi`;status=L.alive?.includes(S.uid)?'ANCORA IN GIOCO':'ELIMINATO';break;}
  case 'cutwire': ratio=(L.safeCount||0)/9;sortValue=(L.safeCount||0)*100;value=`${L.safeCount||0} pistoni sicuri`;status='SCELTA DOPO SCELTA';break;
  case 'safe': {const len=L.codes?.[L.safeRound]?.length||6;ratio=clamp(((L.safeRound||0)+(L.buffer?.length||0)/len*.12)/4,0,.98);sortValue=(L.safeRound||0)*100+(L.buffer?.length||0);value=`Codice ${Math.min(4,(L.safeRound||0)+1)}/4 · ${L.guesses?.length||0} tentativi`;status='DECIFRAZIONE';break;}
  case 'battle': {const hp=L.hp?.[S.uid]||0;ratio=clamp((((L.round||1)-1)*10+hp/2)/100,0,.98);sortValue=(L.round||1)*100+hp;value=`Round ${L.round||1} · ${hp} HP`;status=L.alive?.includes(S.uid)?'SOPRAVVISSUTO':'ELIMINATO';break;}
  case 'connect': {const completed=[0,6,16][L.level||0]+(L.done||0);ratio=completed/34;sortValue=completed*100-(L.errors||0);value=`Livello ${(L.level||0)+1}/3 · ${L.done||0}/${[6,10,18][L.level||0]} colori`;status='ABBINAMENTI';break;}
  case 'tabelluno': {const pos=L.positions?.[S.uid]||0;ratio=pos/43;sortValue=pos*100;value=`Casella ${pos}/43`;status='SUL TABELLONE';break;}
  case 'space': {ratio=clamp((L.distance||0)/1700,0,.98);sortValue=Math.round(L.distance||0);value=`${Math.floor(L.distance||0)} m · ${L.lives||0} vite`;status=(L.lives||0)>0?'IN VOLO':'NAVICELLA FERMA';break;}
  case 'catch': {ratio=clamp((L.points||0)/50,0,.98);sortValue=(L.points||0)*100+(L.hits||0);value=`${L.points||0} pt · ${L.hits||0} colpi`;status='RIFLESSI';break;}
  case 'cups': {ratio=clamp(((L.round||1)-1)/10+((L.lives||0)/3)*.08,0,.98);sortValue=(L.round||1)*100+(L.lives||0)*10;value=`Round ${L.round||1} · ${L.lives||0}/3 vite`;status=(L.lives||0)>0?'ANCORA IN GIOCO':'ELIMINATO';break;}
 }
 if(L.submitted){ratio=1;sortValue+=100000;status='FINITO';value='Risultato consegnato';}
 return progressShape(ratio,sortValue,value,status);
}
function cpuProgressFor(p){
 const g=currentGame(), elapsed=Math.max(0,(Date.now()-(S.room?.gameStartedAt||Date.now()))/1000);
 const target=Math.max(12,Number(p.cpuTargetMs||35000)/1000),skill=clamp(Number(p.cpuSkill??.5),0,1),speed=.72+skill*.58;
 let ratio=clamp(elapsed/target*speed,0,.97),sortValue=0,value='Sta studiando la sfida',status='CPU IN GARA';
 if(g.id==='memory'){const n=Math.min(17,Math.floor(elapsed/target*18*speed));ratio=n/18;sortValue=n*1000;value=`${n}/18 coppie`;status='MEMORIA NPC';}
 else if(g.id==='bombpass'){const pass=Math.floor(elapsed*(.25+skill*.42));sortValue=pass*10+elapsed;value=`Round ${1+Math.floor(elapsed/8)} · ${pass} passaggi`;status='PASSA LA BOMBA';}
 else if(g.id==='cutwire'){const n=Math.min(8,Math.floor(elapsed/target*9*speed));ratio=n/9;sortValue=n*100;value=`${n} pistoni sicuri`;status='PROVA LA FORTUNA';}
 else if(g.id==='safe'){const n=Math.min(3,Math.floor(elapsed/target*4*speed));ratio=n/4;sortValue=n*100;value=`Codici ${n}/4`;status='DECIFRAZIONE NPC';}
 else if(g.id==='battle'){const round=1+Math.floor(elapsed/8),hp=Math.max(1,20-Math.floor(elapsed/target*15));sortValue=round*100+hp;value=`Round ${round} · ${hp} HP`;status='NELLE PORTE';}
 else if(g.id==='connect'){const n=Math.min(33,Math.floor(elapsed/target*34*speed));ratio=n/34;sortValue=n*100;const level=n<6?1:n<16?2:3;value=`Livello ${level}/3 · ${n}/34`;status='ABBINAMENTI NPC';}
 else if(g.id==='tabelluno'){const pos=Math.min(42,Math.floor(43*elapsed/target*speed));ratio=pos/43;sortValue=pos*100;value=`Casella ${pos}/43`;status='CORSA SUL TABELLONE';}
 else if(g.id==='space'){const m=Math.floor(elapsed*(18+skill*9));ratio=clamp(m/1700,0,.97);sortValue=m;value=`${m} m · ${Math.max(1,3-Math.floor(elapsed/target*2))} vite`;status='IN VOLO';}
 else if(g.id==='catch'){const pts=Math.floor(elapsed*(.35+skill*.85));ratio=clamp(pts/50,0,.97);sortValue=pts*100;value=`${pts} pt`;status='RIFLESSI NPC';}
 else if(g.id==='cups'){const round=1+Math.floor(elapsed/(6.5/speed)),lives=Math.max(1,3-Math.floor(elapsed/target*2));ratio=clamp((round-1)/10+lives*.025,0,.97);sortValue=round*100+lives*10;value=`Round ${round} · ${lives}/3 vite`;status='SEGUE I BICCHIERI';}
 else {sortValue=elapsed*10;value=`${Math.floor(elapsed)}s in gara`;}
 return progressShape(ratio,sortValue,value,status);
}
function getPlayerProgress(p){
 const result=S.results.find(r=>r.uid===p.uid);
 if(result)return progressShape(result.timeout?0:1,(result.timeout?0:100000)+(Number(result.metric)||0),result.timeout?'Tempo scaduto':'Prova conclusa',result.timeout?'TIMEOUT':'FINITO');
 if(isSharedMinigame(currentGame()?.id)&&S.sharedGame?.type===currentGame().id){const live=sharedProgressFor(p,S.sharedGame);if(live)return live;}
 const stored=S.progress.find(x=>x.uid===p.uid&&x.matchNumber===(S.room?.matchNumber||0)&&x.gameIndex===S.room?.gameIndex&&x.gameId===currentGame().id);
 if(stored)return progressShape(stored.ratio,stored.sortValue,stored.value,stored.status);
 if(p.uid===S.uid)return localProgressFor(p)||progressShape(0,0,'Preparo la sfida','IN AVVIO');
 return progressShape(0,0,p.isCPU?'Sta entrando in gara':'In attesa del primo aggiornamento','IN CORSO');
}
function renderMiniLeaderboardRows(){
 if(!S.players.length)return '<div class="score-empty">In attesa dei partecipanti…</div>';
 const rows=S.players.map(p=>({p,v:getPlayerProgress(p)})).sort((a,b)=>b.v.ratio-a.v.ratio||b.v.sortValue-a.v.sortValue||String(a.p.name).localeCompare(String(b.p.name)));
 return rows.map(({p,v},i)=>`<div class="live-score-row ${p.uid===S.uid?'is-me':''}"><span class="live-rank ${i===0?'top-rank':''}">${i===0?'👑':i+1}</span><div class="live-avatar">${avatarImage(p)?`<img src="${safe(avatarImage(p))}" alt="${safe(p.characterName||p.name)}" loading="lazy">`:`<span>${p.isCPU?'🤖':'👤'}</span>`}</div><div class="live-player-main"><div class="live-player-line"><strong>${safe(p.name)}${p.uid===S.uid?' <em>(tu)</em>':''}</strong><span class="live-status">${safe(v.status)}</span></div><div class="live-progress-track"><i style="width:${Math.round(v.ratio*100)}%"></i></div><small>${safe(v.value)}</small></div></div>`).join('');
}
function ensureLocalGame(){
 if(!S.room||S.room.phase!=='active')return;
 const key=`${S.roomCode}_${S.room.gameIndex}_${S.uid}`;
 if(S.localGame?.key===key)return;
 const g=currentGame(), now=Date.now();
 S.localGame={key,id:g.id,startedAt:now,submitted:false,score:0,metric:0,stunUntil:0,history:[],round:1};
 const L=S.localGame;
 if(g.id==='memory'){
   L.deck=shuffle([...EMOJIS.slice(0,18),...EMOJIS.slice(0,18)]);L.deck=shuffle(L.deck.map((e,i)=>({id:i,emoji:e})));L.open=[];L.matched=new Set();L.lockUntil=0;L.moves=0;
 }
 if(g.id==='bombpass'){
   L.alive=S.players.map(p=>p.uid);L.holder=choice(L.alive);L.bombAt=now+randomBetween(7000,20000);L.botActionAt=now+randomBetween(500,1800);L.passCount=0;L.stunnedUntil=0;
 }
 if(g.id==='cutwire'){
   L.wires=shuffle(Array.from({length:10},(_,i)=>i));L.deadWire=L.wires[0];L.used=new Set();L.safeCount=0;
 }
 if(g.id==='safe'){
   L.codes=[3,4,5,6].map(n=>shuffle('0123456789'.split('')).slice(0,n).join(''));L.safeRound=0;L.buffer='';L.guesses=[];L.feedback=[];L.doneRounds=[];
 }
 if(g.id==='battle'){
   L.doorCount=6;L.round=1;L.hp={};S.players.forEach(p=>L.hp[p.uid]=20);L.alive=S.players.map(p=>p.uid);L.myDoor=null;L.log=[];L.dead=false;L.lastSurvival=0;L.battlePhase='choose';L.battlePicks={};L.battleEvents=[];L.battlePending=null;L.battleResultAt=0;L.battleRevealAt=0;L.rollFace=1;
 }
 if(g.id==='connect'){
   L.level=0;L.done=0;L.errors=0;makeConnectRound(L);
 }
 if(g.id==='tabelluno'){
   L.positions={};S.players.forEach(p=>L.positions[p.uid]=0);L.draws=0;L.lastCard=null;L.lastText='Pesca una carta per muoverti.';L.stuck={};
 }
 if(g.id==='space'){
   L.x=.5;L.distance=0;L.lives=3;L.meteors=[];L.stars=Array.from({length:55},()=>({x:Math.random(),y:Math.random(),s:Math.random()*2+0.4,v:Math.random()*0.3+0.1}));L.lastSpawn=now;L.lastFrame=now;L.invulnerableUntil=0;L.width=600;L.height=360;L.running=true;
 }
 if(g.id==='catch'){
   L.points=0;L.targetChangedAt=now;L.hits=0;makeCatchTarget(L);L.endsAt=now+40000;
 }
 if(g.id==='cups'){
   L.lives=3;L.round=1;L.cupCount=Math.max(4,S.players.length);L.selected=null;makeCups(L);
 }
}
async function publishCurrentProgress(force=false){
 if(isSharedMinigame(currentGame()?.id))return;
 if(!S.roomCode||S.room?.phase!=='active'||!S.localGame||!S.uid||S.progressSaving)return;
 const me=playerMe();if(!me||me.isCPU)return;
 const v=localProgressFor(me);if(!v)return;
 const key=`${S.roomCode}:${S.room.matchNumber||0}:${S.room.gameIndex}:${S.uid}`;
 const sig=[key,v.ratio.toFixed(2),Math.round(v.sortValue),v.value,v.status].join('|');
 if(!force&&S.lastProgressKey===key&&S.lastProgressSignature===sig&&Date.now()-S.lastProgressSentAt<2500)return;
 S.progressSaving=true;S.lastProgressKey=key;S.lastProgressSignature=sig;S.lastProgressSentAt=Date.now();
 try{await setDoc(doc(db,'rooms',S.roomCode,'progress',S.uid),{uid:S.uid,name:me.name,characterId:me.characterId||null,characterName:me.characterName||null,characterImage:me.characterImage||null,isCPU:false,matchNumber:S.room.matchNumber||0,gameIndex:S.room.gameIndex,gameId:currentGame().id,ratio:v.ratio,sortValue:v.sortValue,value:v.value,status:v.status,updatedAt:Date.now()},{merge:true});}
 catch(err){console.warn('progress write',err);S.lastProgressSignature='';}
 finally{S.progressSaving=false;}
}
async function publishCpuProgresses(){
 if(isSharedMinigame(currentGame()?.id))return;
 if(!S.roomCode||S.room?.phase!=='active'||S.room?.hostUid!==S.uid)return;
 for(const p of S.players.filter(x=>x.isCPU&&!S.results.some(r=>r.uid===x.uid))){
  const v=cpuProgressFor(p),key=`${S.roomCode}:${S.room.matchNumber||0}:${S.room.gameIndex}:${p.uid}`;
  const sig=[key,v.ratio.toFixed(2),Math.round(v.sortValue),v.value,v.status].join('|');
  if(S.cpuProgressSignatures[p.uid]===sig)continue;
  S.cpuProgressSignatures[p.uid]=sig;
  try{await setDoc(doc(db,'rooms',S.roomCode,'progress',p.uid),{uid:p.uid,name:p.name,characterId:p.characterId||null,characterName:p.characterName||null,characterImage:p.characterImage||null,isCPU:true,matchNumber:S.room.matchNumber||0,gameIndex:S.room.gameIndex,gameId:currentGame().id,ratio:v.ratio,sortValue:v.sortValue,value:v.value,status:v.status,updatedAt:Date.now()},{merge:true});}
  catch(err){console.warn('CPU progress write',err);delete S.cpuProgressSignatures[p.uid];}
 }
}
function tickBattle(){
 const L=S.localGame;if(!L||L.id!=='battle'||L.submitted||S.room?.phase!=='active')return;
 const now=Date.now();
 if(L.battlePhase==='reveal'&&now>=L.battleRevealAt&&L.battlePending){
  const pending=L.battlePending;L.hp=pending.hpAfter;L.alive=pending.aliveAfter;L.log.push(...pending.events.map(e=>e.text));
  if(pending.removedDoor)L.log.push(`🚨 La porta ${pending.removedDoor} è crollata! Restano ${pending.doorCountAfter} porte.`);
  L.battlePhase='result';L.battleResultAt=now+1750;render();return;
 }
 if(L.battlePhase==='result'&&now>=L.battleResultAt){
  const resolved=L.battlePending;if(resolved)L.doorCount=resolved.doorCountAfter;L.battlePending=null;
  if(!L.alive.includes(S.uid)){L.dead=true;submitResult(Math.max(1,(L.round-1)*100+(L.hp[S.uid]||0)),Math.max(0,L.round-1),{detail:{rounds:Math.max(0,L.round-1),hp:L.hp[S.uid]||0}});return;}
  if(L.alive.length<=1){submitResult(2200+L.round*100+(L.hp[S.uid]||0),L.round,{detail:{rounds:L.round,hp:L.hp[S.uid]||0,winner:true}});return;}
  L.round++;L.myDoor=null;L.battlePhase='choose';L.battlePicks={};L.battleEvents=[];L.battleRevealAt=0;L.battleResultAt=0;render();
 }
}
function randomBetween(a,b){return Math.floor(a+Math.random()*(b-a+1));}

// ---------- Stato multiplayer condiviso per Passa la bomba, Taglia il filo e TabellUNO ----------
async function initializeSharedMinigame(){
 const type=currentGame()?.id;
 if(!isSharedMinigame(type)||!S.roomCode)return;
 const now=Date.now(), ids=S.players.map(p=>p.uid), players=S.players;
 if(ids.length<2)return;
 let initial;
 if(type==='bombpass'){
   const holder=choice(ids), holderPlayer=players.find(p=>p.uid===holder);
   initial={type,matchNumber:S.room.matchNumber||0,gameIndex:S.room.gameIndex,status:'active',startedAt:now,roundStartedAt:now,round:1,
     alive:[...ids],eliminated:[],holder,bombAt:now+randomBetween(7000,20000),passCount:0,roundPassCount:0,
     passCounts:Object.fromEntries(ids.map(uid=>[uid,0])),passTrail:[],explosions:[],lastPassAt:0,
     nextCpuPassAt:holderPlayer?.isCPU?now+randomBetween(900,1800):0,explodedUid:null,winnerUid:null,ranking:[],updatedAt:now};
 }else if(type==='cutwire'){
   const turnOrder=shuffle([...ids]);
   initial={type,matchNumber:S.room.matchNumber||0,gameIndex:S.room.gameIndex,status:'active',round:1,pistonCount:10,
     available:Array.from({length:10},(_,i)=>i),used:[],deadPiston:randomBetween(0,9),alive:[...ids],turnOrder,turnIndex:0,
     eliminated:[],winnerUid:null,ranking:[],event:null,updatedAt:now};
 }else{
   const turnOrder=shuffle([...ids]);
   initial={type,matchNumber:S.room.matchNumber||0,gameIndex:S.room.gameIndex,status:'active',turnOrder,turnIndex:0,direction:1,
     positions:Object.fromEntries(ids.map(uid=>[uid,0])),stuck:Object.fromEntries(ids.map(uid=>[uid,0])),drawsByUid:Object.fromEntries(ids.map(uid=>[uid,0])),
     finishOrder:[],ranking:[],pending:null,lastCard:null,lastEvent:'La partita comincia! Pesca una carta quando arriva il tuo turno.',turnCount:0,totalPlayers:ids.length,updatedAt:now};
 }
 const ref=sharedGameRef();
 await runTransaction(db,async tx=>{const snap=await tx.get(ref);if(!snap.exists())tx.set(ref,initial);});
}
function sharedProgressFor(p,G){
 if(!G||!p)return null;
 const uid=p.uid, n=Math.max(1,S.players.length);
 if(G.status==='finished'){
   const ranking=G.ranking||[];const place=Math.max(1,ranking.indexOf(uid)+1);
   return progressShape(1,100000-place,`Classificato ${place}°`,place===1?'VINCITORE':`POSTO ${place}`);
 }
 if(G.type==='bombpass'){
   const passes=G.passCounts?.[uid]||0, hasBomb=G.holder===uid, alive=(G.alive||[]).includes(uid);
   if(!alive)return progressShape(.96, -1000+((G.eliminated||[]).indexOf(uid)||0), `💥 Eliminato al round ${G.explosions?.find(e=>e.uid===uid)?.round||'?'}`, 'FUORI GARA');
   return progressShape(clamp(passes/Math.max(8,n*2)+(hasBomb ? 0.12 : 0),0,.92),passes*100+(hasBomb?45:0),hasBomb?`💣 Ha la bomba · ${passes} passaggi`:`${passes} passaggi completati`,hasBomb?'BOMBA IN MANO':`ROUND ${G.round||1} · IN GARA`);
 }
 if(G.type==='cutwire'){
   const alive=G.alive?.includes(uid), activeUid=G.turnOrder?.[G.turnIndex], place=G.ranking?.indexOf(uid)??-1;
   const roundRatio=clamp(((G.round||1)-1)/Math.max(3,n),0,.9);
   if(!alive)return progressShape(Math.max(.03,roundRatio*.75),(G.eliminated?.indexOf(uid)??0)*-100,`Eliminato · round ${G.event?.round||G.round}`,`FUORI GARA`);
   return progressShape(.2+roundRatio,(G.round||1)*100+(activeUid===uid?50:0)+(G.used?.length||0),activeUid===uid?'È il tuo turno':`${G.used?.length||0} pistoni già provati`,activeUid===uid?'SUL PALCO':'IN ATTESA');
 }
 if(G.type==='tabelluno'){
   const pos=G.positions?.[uid]||0, current=G.pending?.actorUid||G.turnOrder?.[G.turnIndex], finishIndex=(G.finishOrder||[]).indexOf(uid);
   if(finishIndex>=0)return progressShape(1,1000-finishIndex,`Traguardo · ${finishIndex+1}° ad arrivare`,'AL TRAGUARDO');
   return progressShape(pos/43,pos*100+(current===uid?40:0),`Casella ${pos} di 43`,current===uid?'È il tuo turno':`${43-pos} caselle al traguardo`);
 }
 return null;
}
async function mutateSharedGame(mutator){
 if(!S.roomCode||!S.room)return null;
 const ref=sharedGameRef();
 return runTransaction(db,async tx=>{
   const snap=await tx.get(ref);if(!snap.exists())return null;
   const state=snap.data();if(state.status!=='active'||state.matchNumber!==(S.room.matchNumber||0)||state.gameIndex!==S.room.gameIndex)return null;
   const next=mutator(state);if(!next)return null;
   next.updatedAt=Date.now();tx.set(ref,next);return next;
 });
}
function sharedActorMayAct(uid,hostOverride=false){
 if(uid===S.uid)return true;
 return S.uid===S.room?.hostUid&&S.players.some(p=>p.uid===uid&&(p.isCPU||hostOverride));
}
function sharedCurrentActor(G){
 if(!G)return null;
 if(G.type==='bombpass')return G.holder;
 if(G.type==='cutwire')return G.turnOrder?.[G.turnIndex]||null;
 if(G.type==='tabelluno')return G.pending?.actorUid||G.turnOrder?.[G.turnIndex]||null;
 return null;
}
function finalizeCutwire(state){
 if((state.alive||[]).length<=1){
   state.status='finished';state.winnerUid=state.alive[0]||null;
   state.ranking=[...(state.winnerUid?[state.winnerUid]:[]),...(state.eliminated||[]).slice().reverse()];
 }
}
async function chooseSharedWire(wire,actorUid=S.uid,hostOverride=false){
 if(!sharedActorMayAct(actorUid,hostOverride))return;
 try{
  await mutateSharedGame(state=>{
   if(state.type!=='cutwire'||state.status!=='active'||state.pendingRoundAt||state.turnOrder?.[state.turnIndex]!==actorUid||!state.available?.includes(wire))return null;
   const colorNames=['ROSSO','BLU','GIALLO','VERDE','VIOLA','ARANCIO','CIANO','ROSA','BIANCO','GRIGIO'];
   const actor=displayPlayerName(actorUid),round=state.round;
   if(wire===state.deadPiston){
    state.alive=(state.alive||[]).filter(uid=>uid!==actorUid);
    state.eliminated=[...(state.eliminated||[]),actorUid];
    state.event={round,actorUid,wire,safe:false,text:`${actor} ha premuto ${colorNames[wire]||'un pistone'}: l’incudine è caduta! ${actor} è eliminato.`,colorName:colorNames[wire]||'PISTONE',at:Date.now()};
    finalizeCutwire(state);
    if(state.status!=='finished'){
      // Lascia in scena l'impatto per un momento. Poi parte il round successivo
      // con un pistone in meno e solo i personaggi ancora in gara.
      state.pendingRoundAt=Date.now()+1900;
      state.pendingRoundNumber=round+1;
      state.pendingPistonCount=Math.max(1,(state.pistonCount||10)-1);
    }
   }else{
    state.available=(state.available||[]).filter(w=>w!==wire);
    state.used=[...(state.used||[]),wire];
    state.event={round,actorUid,wire,safe:true,text:`${actor} ha scelto ${colorNames[wire]||'il pistone'}: salvo! Il pistone si spegne e tocca al prossimo personaggio.`,colorName:colorNames[wire]||'PISTONE',at:Date.now()};
    const order=state.turnOrder||[],current=order.indexOf(actorUid);
    if(order.length)state.turnIndex=(Math.max(0,current)+1)%order.length;
   }
   return state;
  });
 }catch(err){console.error(err);notify(friendlyError(err,'Non riesco a registrare il pistone.'));}
}
function unoCurrentUid(state){return state.pending?.actorUid||state.turnOrder?.[state.turnIndex]||null;}
function advanceUnoTurn(state){
 const n=state.turnOrder.length;if(!n)return;
 for(let tries=0;tries<n*3;tries++){
   state.turnIndex=(state.turnIndex+state.direction+n)%n;
   const uid=state.turnOrder[state.turnIndex];
   if((state.finishOrder||[]).includes(uid))continue;
   if((state.stuck?.[uid]||0)>0){state.stuck[uid]--;state.lastEvent=`${displayPlayerName(uid)} resta fermo e salta il turno.`;continue;}
   return;
 }
}
function finalizeTabelluno(state){
 if((state.finishOrder||[]).length>=Math.max(1,state.totalPlayers-1)){
   const remaining=state.turnOrder.filter(uid=>!state.finishOrder.includes(uid)).sort((a,b)=>(state.positions[b]||0)-(state.positions[a]||0));
   state.ranking=[...state.finishOrder,...remaining];state.status='finished';state.pending=null;
 }
}
function displayPlayerName(uid){const p=S.players.find(p=>p.uid===uid);return p?.characterName||p?.name||'Sfidante';}
function applyUnoLanding(state,uid,baseDesc=''){
 let pos=clamp(Number(state.positions[uid]||0),0,43),desc=baseDesc;
 if([7,22,37].includes(pos)){pos=clamp(pos+2,0,43);desc+=' Casella +2: fai altri due passi!';}
 else if([10,28,35].includes(pos)){pos=clamp(pos-2,0,43);desc+=' Casella -2: torni indietro di due.';}
 else if(pos===16){state.stuck[uid]=(state.stuck[uid]||0)+2;desc+=' TORNADO! Salterai i prossimi due turni.';}
 state.positions[uid]=pos;
 return {pos,desc,colorCell:[5,12,19,26,33,40].includes(pos)};
}
function resolveUnoEndOrAdvance(state,uid,landing){
 if(landing.pos>=43&&!state.finishOrder.includes(uid))state.finishOrder.push(uid);
 if(state.finishOrder.length>=Math.max(1,state.totalPlayers-1)){finalizeTabelluno(state);return;}
 if(landing.pos<43&&landing.colorCell){state.pending={type:'colorGuess',actorUid:uid};return;}
 state.pending=null;advanceUnoTurn(state);
}
async function drawUnoShared(actorUid=S.uid,hostOverride=false){
 if(!sharedActorMayAct(actorUid,hostOverride))return;
 try{
  await mutateSharedGame(state=>{
   if(state.type!=='tabelluno'||unoCurrentUid(state)!==actorUid||state.pending)return null;
   const n=randomBetween(0,9),color=choice(['🔴','🔵','🟡','🟢']);let move=n,kind='number',face=`${color} ${n}`,desc=`Carta ${color} ${n}: avanzi di ${n} caselle.`;
   const roll=Math.random();
   if(roll<.12){kind='reverse';move=1;face='🔄 CAMBIO GIRO';desc='CAMBIO GIRO! Avanzi di una casella e il giro si inverte.';state.direction*=-1;}
   else if(roll<.24){kind='block';move=1;face='⛔ BLOCCO';desc='BLOCCO! Avanzi di una casella e scegli chi salterà un turno.';}
   else if(roll<.39){kind='plus2';move=n+2;face=`${color} ${n} +2`;desc=`Carta +2! Il ${n} diventa ${move}: avanzi di ${move} caselle.`;}
   const before=state.positions[actorUid]||0;state.positions[actorUid]=clamp(before+move,0,43);
   state.drawsByUid[actorUid]=(state.drawsByUid[actorUid]||0)+1;state.turnCount=(state.turnCount||0)+1;
   const landing=applyUnoLanding(state,actorUid,desc);
   state.lastCard={actorUid,face,kind,color,number:n,desc:landing.desc};state.lastEvent=`${displayPlayerName(actorUid)}: ${landing.desc}`;
   if(landing.pos>=43){resolveUnoEndOrAdvance(state,actorUid,{...landing,colorCell:false});return state;}
   if(kind==='block'){state.pending={type:'blockTarget',actorUid,landedColor:landing.colorCell};return state;}
   resolveUnoEndOrAdvance(state,actorUid,landing);return state;
  });
 }catch(err){console.error(err);notify(friendlyError(err,'Non riesco a pescare la carta.'));}
}
async function unoBlockTargetShared(actorUid,targetUid,hostOverride=false){
 if(!sharedActorMayAct(actorUid,hostOverride))return;
 try{
  await mutateSharedGame(state=>{
   if(state.type!=='tabelluno'||state.pending?.type!=='blockTarget'||state.pending.actorUid!==actorUid||targetUid===actorUid||(state.finishOrder||[]).includes(targetUid))return null;
   state.stuck[targetUid]=(state.stuck[targetUid]||0)+1;
   const landedColor=!!state.pending.landedColor;
   state.lastCard={...(state.lastCard||{}),face:'⛔ BLOCCO',desc:`${displayPlayerName(actorUid)} blocca ${displayPlayerName(targetUid)}: salterà un turno.`};
   state.lastEvent=state.lastCard.desc;
   if(landedColor){state.pending={type:'colorGuess',actorUid};return state;}
   state.pending=null;
   if(state.finishOrder.length>=Math.max(1,state.totalPlayers-1))finalizeTabelluno(state);else advanceUnoTurn(state);
   return state;
  });
 }catch(err){console.error(err);notify(friendlyError(err,'Non riesco ad applicare il blocco.'));}
}
async function unoGuessColorShared(actorUid,color,hostOverride=false){
 if(!sharedActorMayAct(actorUid,hostOverride))return;
 try{
  await mutateSharedGame(state=>{
   if(state.type!=='tabelluno'||state.pending?.type!=='colorGuess'||state.pending.actorUid!==actorUid)return null;
   const actual=choice(['🔴','🔵','🟡','🟢']),number=randomBetween(0,9),wasCorrect=color===actual;
   const before=state.positions[actorUid]||0;
   state.positions[actorUid]=clamp(before+(wasCorrect?number:-3),0,43);
   const desc=wasCorrect?`Indovinato! La carta era ${actual} ${number}: avanzi di ${number}.`:`Colore sbagliato: la carta era ${actual} ${number}. Torni indietro di 3.`;
   const landing=applyUnoLanding(state,actorUid,desc);
   state.lastCard={actorUid,face:wasCorrect?`${actual} ${number}`:`❌ −3`,kind:'colorGuess',color:actual,number,desc:landing.desc};
   state.lastEvent=`${displayPlayerName(actorUid)}: ${landing.desc}`;
   resolveUnoEndOrAdvance(state,actorUid,landing);return state;
  });
 }catch(err){console.error(err);notify(friendlyError(err,'Non riesco a verificare il colore.'));}
}
function sharedRankingFor(G){
 if(Array.isArray(G?.ranking)&&G.ranking.length)return G.ranking;
 if(G?.type==='cutwire')return [...(G.winnerUid?[G.winnerUid]:[]),...(G.eliminated||[]).slice().reverse()];
 if(G?.type==='tabelluno')return [...(G.finishOrder||[]),...(G.turnOrder||[]).filter(uid=>!(G.finishOrder||[]).includes(uid)).sort((a,b)=>(G.positions?.[b]||0)-(G.positions?.[a]||0))];
 return [];
}
function submitSharedGameResult(){
 const G=S.sharedGame,L=S.localGame;
 if(!G||G.status!=='finished'||currentGame()?.id!==G.type)return;
 const ranking=sharedRankingFor(G),total=Math.max(1,S.players.length);
 const key=`${S.roomCode}_${S.room?.matchNumber||0}_${S.room?.gameIndex}_${G.type}`;
 if(S.room?.hostUid===S.uid&&S.sharedResultsTag!==key){
  S.sharedResultsTag=key;
  const npcWrites=S.players.filter(p=>p.isCPU).map(p=>{
   const place=Math.max(1,ranking.indexOf(p.uid)+1);let score=total-place+1,detail={shared:true,place,ranking};
   if(G.type==='bombpass'){score=G.passCounts?.[p.uid]||0;detail={...detail,passes:score,exploded:G.explodedUid===p.uid};}
   if(G.type==='cutwire')detail={...detail,roundsSurvived:Math.max(0,(G.eliminated||[]).indexOf(p.uid)===-1?G.round-1:(G.eliminated||[]).length-(G.eliminated||[]).indexOf(p.uid))};
   if(G.type==='tabelluno'){score=G.positions?.[p.uid]||0;detail={...detail,position:score,draws:G.drawsByUid?.[p.uid]||0};}
   return setDoc(doc(db,'rooms',S.roomCode,'results',String(S.room.gameIndex),'players',p.uid),{uid:p.uid,name:p.name,characterId:p.characterId||null,characterName:p.characterName||null,gameIndex:S.room.gameIndex,gameId:G.type,metric:10000-(place-1)*500,score,durationMs:Math.max(0,Date.now()-(G.startedAt||Date.now())),submittedAt:Date.now(),isCPU:true,detail});
  });
  Promise.all(npcWrites).catch(err=>{console.error('shared NPC results',err);S.sharedResultsTag='';});
 }
 if(!L||L.submitted)return;
 const place=Math.max(1,ranking.indexOf(S.uid)+1);
 let score=total-place+1,detail={shared:true,place,ranking};
 if(G.type==='bombpass'){score=G.passCounts?.[S.uid]||0;detail={...detail,passes:score,exploded:G.explodedUid===S.uid};}
 if(G.type==='cutwire'){detail={...detail,roundsSurvived:Math.max(0,(G.eliminated||[]).indexOf(S.uid)===-1?G.round-1:(G.eliminated||[]).length-(G.eliminated||[]).indexOf(S.uid))};}
 if(G.type==='tabelluno'){score=G.positions?.[S.uid]||0;detail={...detail,position:score,draws:G.drawsByUid?.[S.uid]||0};}
 submitResult(10000-(place-1)*500,score,{detail});
}
function tickSharedMinigame(){
 const G=S.sharedGame;if(!G||G.status!=='active'||S.room?.hostUid!==S.uid)return;
 // Dopo un impatto, tutti vedono l'incudine cadere prima che inizi il round nuovo.
 if(G.type==='cutwire'&&G.pendingRoundAt){
  if(Date.now()<G.pendingRoundAt)return;
  mutateSharedGame(state=>{
   if(state.type!=='cutwire'||state.status!=='active'||!state.pendingRoundAt||Date.now()<state.pendingRoundAt)return null;
   state.round=state.pendingRoundNumber||((state.round||1)+1);
   state.pistonCount=state.pendingPistonCount||Math.max(1,(state.pistonCount||10)-1);
   state.available=Array.from({length:state.pistonCount},(_,i)=>i);state.used=[];
   state.deadPiston=randomBetween(0,state.pistonCount-1);
   state.turnOrder=shuffle([...(state.alive||[])]);state.turnIndex=0;
   delete state.pendingRoundAt;delete state.pendingRoundNumber;delete state.pendingPistonCount;
   state.lastEvent=`ROUND ${state.round}! ${state.pistonCount} pistoni rimasti. Si riparte con i sopravvissuti.`;
   return state;
  }).catch(err=>console.error('cutwire next round',err));
  return;
 }
 const actorUid=sharedCurrentActor(G),p=S.players.find(p=>p.uid===actorUid);if(!p)return;
 const now=Date.now(),idleFor=now-(G.updatedAt||G.startedAt||now);
 // Le CPU giocano da sole. TabellUNO e Taglia il filo passano automaticamente
 // dopo 18 secondi se un umano si è disconnesso o non tocca più nulla.
 const timedOutHuman=!p.isCPU&&G.type!=='bombpass'&&idleFor>=18000;
 if(!p.isCPU&&!timedOutHuman)return;
 const task=G.type==='tabelluno'?(G.pending?.type||'draw'):'turn';
 const tag=`${G.type}:${G.updatedAt}:${actorUid}:${task}:${G.passCount||0}:${timedOutHuman?'timeout':''}`;
 if(S.sharedCpuTag!==tag){S.sharedCpuTag=tag;S.sharedCpuAt=timedOutHuman?now:now+randomBetween(700,1450);}
 if(Date.now()<S.sharedCpuAt||S.sharedCpuBusy)return;
 S.sharedCpuBusy=true;S.sharedCpuTag=`busy:${tag}`;
 (async()=>{
  try{
   if(G.type==='bombpass'){
    if(p.isCPU)await passBombShared(actorUid);
   }else if(G.type==='cutwire'){
    const skill=Number(p.cpuSkill??.5),safeChoices=(G.available||[]).filter(w=>w!==G.deadPiston);
    const wire=safeChoices.length&&Math.random()<(.55+skill*.35)?choice(safeChoices):choice(G.available||[]);
    if(wire!==undefined)await chooseSharedWire(wire,actorUid,timedOutHuman);
   }else if(G.type==='tabelluno'){
    if(G.pending?.type==='colorGuess')await unoGuessColorShared(actorUid,choice(['🔴','🔵','🟡','🟢']),timedOutHuman);
    else if(G.pending?.type==='blockTarget'){
     const targets=S.players.filter(x=>x.uid!==actorUid&&!(G.finishOrder||[]).includes(x.uid));
     if(targets.length)await unoBlockTargetShared(actorUid,choice(targets).uid,timedOutHuman);
     else{await mutateSharedGame(state=>{if(state.type!=='tabelluno'||state.pending?.actorUid!==actorUid)return null;state.pending=null;advanceUnoTurn(state);state.lastEvent=`${displayPlayerName(actorUid)} ha perso il tempo per scegliere un bersaglio.`;return state;});}
    }else await drawUnoShared(actorUid,timedOutHuman);
   }
  }catch(err){console.error('shared turn automation',err);}
  finally{S.sharedCpuBusy=false;}
 })();
}

function renderActiveGame(){
 ensureLocalGame();
 const g=currentGame(), L=S.localGame, me=playerMe();
 const result=S.results.find(r=>r.uid===S.uid);
 const done=!!result||!!L?.submitted;
 const elapsed=Math.max(0,Math.floor((Date.now()-(L?.startedAt||Date.now()))/1000));
 const keepSharedScene=done&&isSharedMinigame(g.id)&&S.sharedGame?.type===g.id&&S.sharedGame?.status==='finished';
 const board=done&&!keepSharedScene?`<div class="game-finished-card"><div class="finished-sparkle">${result?.timeout?'⌛':'🏁'}</div><div class="eyebrow">LA TUA PROVA È ${result?.timeout?'SCADUTA':'CONSEGNATA'}</div><h2>${safe(me?.characterName||me?.name||'Tu')} ${result?.timeout?'ha finito il tempo!':'ha tagliato il traguardo!'}</h2><p>La sfida continua per gli altri. Tieni d’occhio la classifica live: puoi vedere chi ti sta raggiungendo e chi ha già concluso.</p><div class="finished-avatar">${me&&avatarImage(me)?`<img src="${safe(avatarImage(me))}" alt="${safe(me.characterName||me.name)}">`:'🎮'}</div><div class="waiting-banner">${result?.timeout?'Il tempo è scaduto: il tuo risultato verrà conteggiato.':'Risultato registrato. Gli altri partecipanti sono ancora in gara.'}</div></div>`:renderGameBoard(g,L,me);
 return `<div class="game-banner"><div class="game-banner-left"><div class="game-icon">${g.icon}</div><div><div class="mono">MINIGIOCO ${S.room.gameIndex+1} / ${S.room.selectedGames.length}</div><h1>${g.name}</h1><p>${g.tagline}</p></div></div><div class="timer-box"><strong id="game-clock">${formatTime(elapsed)}</strong><span>TEMPO</span></div></div><div class="participant-strip" aria-label="Partecipanti alla sfida">${S.players.map(p=>`<div class="participant-chip ${p.uid===S.uid?'self':''} ${S.results.some(r=>r.uid===p.uid)?'finished':''}"><div class="participant-chip-avatar">${avatarImage(p)?`<img src="${safe(avatarImage(p))}" alt="${safe(p.characterName||p.name)}">`:`<span>${p.isCPU?'🤖':'👤'}</span>`}</div><span>${safe(p.characterName||p.name)}</span><small>${S.results.some(r=>r.uid===p.uid)?'FINITO':p.isCPU?'CPU':'IN GARA'}</small></div>`).join('')}</div><div class="game-layout"><section class="game-main"><div class="game-board" id="active-game-board">${board}</div><p class="game-footnote">Stai giocando come <strong>${safe(me?.characterName||me?.name||'Tu')}</strong> · ${g.short}. I ritratti identificano tutti gli sfidanti anche nella classifica live.</p></section>${renderScoreboard()}</div>`;
}
function renderGameBoard(g,L,me){
 if(g.id==='memory')return renderMemory(L);
 if(g.id==='bombpass')return renderBombpass(L);
 if(g.id==='cutwire')return renderCutwire(L);
 if(g.id==='safe')return renderSafe(L);
 if(g.id==='battle')return renderBattle(L);
 if(g.id==='connect')return renderConnect(L);
 if(g.id==='tabelluno')return renderTabelluno(L);
 if(g.id==='space')return `<div class="game-center"><div class="game-stats"><div class="mini-stat"><strong id="space-distance">0</strong><span>Metri</span></div><div class="mini-stat"><strong id="space-lives">❤️❤️❤️</strong><span>Vite</span></div></div><p>Sposta il mouse o trascina il dito per guidare la navicella.</p><canvas id="space-canvas" class="space-canvas" aria-label="Gioco navicella nello spazio"></canvas><p class="helper" style="margin-top:12px">Il tuo personaggio viaggia dentro la navicella. Un impatto consuma una vita e dà 3 secondi di invulnerabilità.</p></div>`;
 if(g.id==='catch')return renderCatch(L);
 if(g.id==='cups')return renderCups(L);
 return '<p>Minigioco in caricamento...</p>';
}
function renderMemory(L){
 return `<div class="game-center"><div class="game-stats"><div class="mini-stat"><strong>${L.matched.size/2}/18</strong><span>Coppie trovate</span></div><div class="mini-stat"><strong>${L.moves}</strong><span>Tentativi</span></div></div><p>Trova tutte le coppie. Se sbagli, aspetta 2 secondi.</p></div><div class="memory-grid">${L.deck.map((card,i)=>{const open=L.open.includes(i)||L.matched.has(i);return `<button class="memory-card ${open?'open':''} ${L.matched.has(i)?'matched':''}" data-action="memory-flip" data-index="${i}" ${open||Date.now()<L.lockUntil?'disabled':''} aria-label="Carta ${i+1}">${open?card.emoji:'?'}</button>`;}).join('')}</div><div class="game-center"><p class="helper">Le coppie trovate rimangono visibili.</p></div>`;
}
function renderBombpass(L){
 const G=S.sharedGame;
 if(!G||G.type!=='bombpass')return `<div class="shared-wait"><div class="loader"></div><h2>La bomba sta entrando in scena…</h2><p>Sto sincronizzando miccia e personaggi per tutti gli sfidanti.</p></div>`;
 const players=S.players, holder=players.find(p=>p.uid===G.holder), meHolding=G.holder===S.uid;
 const remaining=Math.max(0,Math.ceil(((G.bombAt||Date.now())-Date.now())/1000));
 const duration=Math.max(1,(G.bombAt||Date.now())-(G.roundStartedAt||G.startedAt||Date.now()));
 const fusePct=clamp(remaining*100/(duration/1000),0,100);
 const ringPlayers=players.filter(p=>(G.alive||[]).includes(p.uid));
 const ranking=(G.ranking||[]).map(uid=>players.find(p=>p.uid===uid)).filter(Boolean);
 const playerHtml=p=>avatarImage(p)?`<img src="${safe(avatarImage(p))}" alt="${safe(p.characterName||p.name)}">`:`<span>${p.isCPU?'🤖':'👤'}</span>`;
 if(G.status==='finished'){
   const exploded=players.find(p=>p.uid===G.explodedUid)||holder;
   const champion=players.find(p=>p.uid===G.winnerUid);
   return `<div class="bombpass-scene"><div class="bomb-explosion"><div class="explosion-burst">💥💣💥</div><div class="eyebrow" style="justify-content:center">ULTIMO BOTTO · FINE DELLA PARTITA</div><div class="bomb-exploded-portrait">${exploded?playerHtml(exploded):'💣'}</div><h2>${safe(exploded?.characterName||exploded?.name||'Uno sfidante')} è esploso!</h2><p>La bomba ha eliminato un personaggio a ogni round. Il cerchio si è ristretto fino a lasciare un solo sopravvissuto.</p>${champion?`<div class="bomb-winner-banner"><span>🏆</span><div><small>ULTIMO SOPRAVVISSUTO</small><strong>${safe(champion.characterName||champion.name)}</strong><em>${safe(champion.name)} vince Passa la bomba!</em></div>${playerHtml(champion)}</div>`:''}<div class="bomb-final-order">${ranking.map((p,i)=>`<div class="bomb-final-row ${p.uid===G.winnerUid?'bomb-champion-row':''}"><b>${i+1}</b>${playerHtml(p)}<span><strong>${safe(p.characterName||p.name)}</strong><small>${safe(p.name)}</small></span><em>${p.uid===G.winnerUid?'🏆 VINCITORE':p.uid===G.explodedUid?'💥 ELIMINATO':`${G.passCounts?.[p.uid]||0} passaggi`}</em></div>`).join('')}</div></div></div>`;
 }
 const n=Math.max(1,ringPlayers.length);
 const ring=ringPlayers.map((p,i)=>{
   const a=(Math.PI*2*i/n)-Math.PI/2,x=50+39*Math.cos(a),y=50+40*Math.sin(a),holding=p.uid===G.holder;
   return `<div class="bomb-ring-player ${holding?'holds-bomb':''} ${p.uid===S.uid?'me':''}" style="left:${x}%;top:${y}%"><div class="bomb-ring-portrait">${playerHtml(p)}${holding?'<span class="bomb-mini-icon">💣</span>':''}</div><strong>${safe(p.characterName||p.name)}</strong><small>${holding?'HA LA BOMBA':`${G.passCounts?.[p.uid]||0} passaggi`}</small></div>`;
 }).join('');
 const trail=(G.passTrail||[]).slice(-6).reverse();
 return `<div class="bombpass-scene"><div class="bombpass-rule"><span>⏱️</span><p><strong>PASSAGGI VELOCI, MICCIA FISSA.</strong> Ogni round ha una miccia di 7–20 secondi. Passarla non ferma né allunga il timer. Quando esplode, chi la tiene è eliminato: la bomba riparte con i sopravvissuti. Si continua fino a un solo vincitore.</p></div><div class="game-stats"><div class="mini-stat"><strong>${G.round||1}</strong><span>ROUND</span></div><div class="mini-stat"><strong>${(G.alive||[]).length}</strong><span>ANCORA IN GARA</span></div><div class="mini-stat"><strong class="text-pink" id="bomb-remaining">${remaining}s</strong><span>MICCIA DI QUESTO ROUND</span></div></div>${G.event?.type==='explosion'?`<div class="bomb-round-event"><div class="bomb-round-boom">💥</div><div><strong>${safe(G.event.text||'La bomba è esplosa!')}</strong><small>${safe(displayPlayerName(G.event.uid))} · ${G.event.passes||0} passaggi in quel round</small></div></div>`:''}${(G.eliminated||[]).length?`<section class="bomb-eliminated-lineup"><strong>FUORI DAL CERCHIO</strong><div>${G.eliminated.map(uid=>{const p=players.find(x=>x.uid===uid);return p?`<span>${playerHtml(p)}<small>${safe(p.characterName||p.name)}</small></span>`:''}).join('')}</div></section>`:''}<div class="bombpass-arena"><div class="bombpass-ring">${ring}</div><div class="bombpass-core"><div class="bomb-core-holder">${holder?playerHtml(holder):'💣'}</div><div class="bomb-big">💣</div><strong id="bomb-holder-name">${safe(holder?.characterName||holder?.name||'Bomba')}</strong><small id="bomb-fuse-label">MICCIA ACCESA</small><div class="fuse-bar"><i id="bomb-fuse-bar" style="width:${fusePct}%"></i></div></div></div><div class="bombpass-action"><h2>${meHolding?'È IL TUO MOMENTO: PASSALA!':`La bomba è da ${safe(holder?.characterName||holder?.name||'uno sfidante')}`}</h2><p>${meHolding?'Scegli subito qualcuno a cui passarla. Non aspettare che il timer arrivi a zero.':'Segui la miccia: quando la bomba arriva a te, passala prima dell’esplosione.'}</p><button class="btn btn-pink btn-bomb-pass" data-action="bomb-pass">💣 PASSA LA BOMBA</button><small>${meHolding?'Passa a uno degli altri sfidanti.':'Attenzione: premere senza avere la bomba ti stordisce per un istante.'}${L?.stunnedUntil>Date.now()?' · STORDITO':''}</small></div><section class="bomb-trail"><div class="shared-section-title"><h3>ULTIMI PASSAGGI</h3><span>La miccia continua a scorrere</span></div><div class="bomb-trail-list">${trail.length?trail.map(t=>{const from=players.find(p=>p.uid===t.from),to=players.find(p=>p.uid===t.to);return `<div class="bomb-trail-item">${from?playerHtml(from):'👤'}<strong>${safe(from?.characterName||from?.name||'Sfidante')}</strong><b>➜</b>${to?playerHtml(to):'👤'}<strong>${safe(to?.characterName||to?.name||'Sfidante')}</strong><span>${Math.max(0,Math.floor((Date.now()-t.at)/1000))}s fa</span></div>`;}).join(''):'<div class="uno-wait-message"><p>Ancora nessun passaggio. La bomba sta per entrare in gioco…</p></div>'}</div></section></div>`;
}
function renderCutwire(L){
 const G=S.sharedGame;
 if(!G||G.type!=='cutwire')return `<div class="shared-wait"><div class="loader"></div><h2>Allestimento del palco…</h2><p>Tutti i giocatori stanno entrando nella stessa sfida.</p></div>`;
 const names=['ROSSO','BLU','GIALLO','VERDE','VIOLA','ARANCIO','CIANO','ROSA','BIANCO','GRIGIO'];
 const colors=['#ff5b71','#4b92ff','#ffd24f','#55dfa2','#bb7aff','#ff9c51','#49d8e8','#ff70c4','#e3e7f0','#9eb3c4'];
 const actorUid=G.turnOrder?.[G.turnIndex],actor=S.players.find(p=>p.uid===actorUid),alive=new Set(G.alive||[]);
 const transition=!!G.pendingRoundAt;
 const isMyTurn=actorUid===S.uid&&G.status==='active'&&!transition&&alive.has(S.uid);
 const winner=S.players.find(p=>p.uid===G.winnerUid);
 const img=p=>avatarImage(p)?`<img src="${safe(avatarImage(p))}" alt="${safe(p.characterName||p.name)}">`:`<span>${p?.isCPU?'🤖':'👤'}</span>`;
 const event=G.event?.round===G.round?G.event:null;
 const roster=S.players.map(p=>{const inGame=alive.has(p.uid),current=actorUid===p.uid&&G.status==='active'&&!transition;return `<div class="cutwire-roster-player ${current?'current-turn':''} ${inGame?'':'player-out'}"><div class="cutwire-roster-portrait">${img(p)}${current?'<b>▶</b>':''}</div><strong>${safe(p.characterName||p.name)}</strong><small>${!inGame?'ELIMINATO':current?'TOCCA A LUI/LEI':`ROUND ${G.round}`}</small></div>`;}).join('');
 if(G.status==='finished')return `<div class="cutwire-shared-scene"><div class="cutwire-champion"><div>🏆</div><h2>${safe(winner?.characterName||winner?.name||'Nessun vincitore')} è l’ultimo rimasto!</h2><p>La sfida è finita: tutti hanno premuto un pistone a turno e l’ultimo personaggio ancora in gara si prende la vittoria.</p>${winner?`<div class="cutwire-turn-actor" style="margin:14px auto 0">${img(winner)}<div><small>VINCITORE DI TAGLIA IL FILO</small><strong>${safe(winner.characterName||winner.name)}</strong><em>${safe(winner.name)}</em></div></div>`:''}</div><section class="cutwire-roster"><div class="shared-section-title"><h3>CLASSIFICA DELLA SFIDA</h3><span>${(G.ranking||[]).length} piazzamenti</span></div><div class="cutwire-roster-grid">${(G.ranking||[]).map((uid,i)=>{const p=S.players.find(x=>x.uid===uid);return p?`<div class="cutwire-roster-player ${i===0?'winner-player':'player-out'}"><div class="cutwire-roster-portrait">${img(p)}<b>${i+1}</b></div><strong>${safe(p.characterName||p.name)}</strong><small>${i===0?'CAMPIONE':`POSTO ${i+1}`}</small></div>`:''}).join('')}</div></section></div>`;
 const available=new Set(G.available||[]);
 const pistons=Array.from({length:G.pistonCount||10},(_,wire)=>{
  const active=available.has(wire),wasFatal=event&&!event.safe&&event.wire===wire&&event.round===G.round;
  return `<button class="cutwire-piston ${active&&isMyTurn?'piston-clickable':''} ${!active?'piston-used':''} ${wasFatal?'piston-fatal':''}" style="--piston-color:${colors[wire]}" data-action="choose-wire" data-wire="${wire}" ${!active||!isMyTurn?'disabled':''} aria-label="Scegli pistone ${names[wire]}"><span class="piston-head"></span><span class="piston-stem"></span><strong>${names[wire]}</strong><small>${!active?'SPENTO':isMyTurn?'PREMI QUI':'IN ATTESA'}</small></button>`;
 }).join('');
 const eventBox=event?`<div class="cutwire-event ${event.safe?'safe-event':'fatal-event'}"><span>${event.safe?'✅':'💥'}</span><div><strong>${event.safe?'È SALVO!':'L’INCUDINE È CADUTA!'}</strong><p>${safe(event.text||'')}</p></div><b>${safe(event.colorName||'')}</b></div>`:(G.round>1?`<div class="cutwire-round-toast">🎬 ${safe(G.lastEvent||`Round ${G.round}: si riparte!`)}</div>`:'');
 const statusText=transition?`L’incudine ha colpito ${safe(actor?.characterName||actor?.name||'uno sfidante')}! Il prossimo round sta per iniziare…`:isMyTurn?'Sali sul palco e scegli un pistone ancora acceso.':`Ora tocca a ${safe(actor?.characterName||actor?.name||'uno sfidante')}. Guarda la scelta!`;
 return `<div class="cutwire-shared-scene"><div class="cutwire-headline"><div><span class="eyebrow">TUTTI NELLA STESSA SFIDA</span><h2>✂️ Taglia il filo</h2><p>Se il pistone è sicuro, si spegne e passa il turno. Se è quello sbagliato, il personaggio viene eliminato e il prossimo round avrà un pistone in meno.</p></div><div class="cutwire-round-badge"><strong>${G.round}</strong><span>ROUND</span></div></div><div class="cutwire-game-counts"><div><b>${(G.alive||[]).length}</b><span>ancora in gara</span></div><div><b>${(G.available||[]).length}</b><span>pistoni ancora accesi</span></div><div><b>${(G.eliminated||[]).length}</b><span>eliminati</span></div></div><div class="cutwire-stage ${transition?'anvil-falling':''}"><div class="cutwire-stage-lights"></div><div class="cutwire-chain"></div><div class="cutwire-anvil">⚒️</div><div class="cutwire-turn-actor">${actor?img(actor):'<span>?</span>'}<div><small>${transition?'COLPITO!':isMyTurn?'È IL TUO TURNO':actor?.isCPU?'LA CPU STA SCEGLIENDO':'ORA TOCCA A'}</small><strong>${safe(actor?.characterName||actor?.name||'In attesa')}</strong><em>${safe(actor?.name||'')}</em></div></div><div class="cutwire-stage-caption">${transition?'ROUND IN CHIUSURA':isMyTurn?'SCEGLI UNO DEI PISTONI ACCESI':'TUTTI OSSERVANO LA STESSA SCELTA'}</div></div>${eventBox}<div class="cutwire-instructions"><div class="cutwire-instructions-portrait">${actor?img(actor):'🎮'}</div><div><h2>${transition?'Si prepara il prossimo round':isMyTurn?'Tocca a te! Quale premi?':`Ora gioca ${safe(actor?.characterName||actor?.name||'lo sfidante')}`}</h2><p>${statusText}</p></div></div><div class="cutwire-pistons">${pistons}</div><section class="cutwire-roster"><div class="shared-section-title"><h3>CHI È ANCORA IN GARA?</h3><span>Ritratti verdi = vivi · grigi = eliminati</span></div><div class="cutwire-roster-grid">${roster}</div></section></div>`;
}
function renderSafe(L){
 if(L.safeRound>=4)return `<div class="game-center"><div style="font-size:56px">🔓</div><h2>Cassaforte aperta!</h2><p>Hai decifrato tutte e quattro le combinazioni.</p></div>`;
 const code=L.codes[L.safeRound], buffer=L.buffer;
 return `<div class="game-center"><div class="game-stats"><div class="mini-stat"><strong>${L.safeRound+1}/4</strong><span>Round</span></div><div class="mini-stat"><strong>${code.length}</strong><span>Cifre del codice</span></div><div class="mini-stat"><strong>${L.guesses.length}</strong><span>Tentativi</span></div></div><h2>Apri la cassaforte</h2><p>Ogni combinazione usa cifre diverse. Verde = cifra giusta nel posto giusto, giallo = cifra giusta nel posto sbagliato.</p><div class="code-slots">${Array.from({length:code.length},(_,i)=>`<div class="code-slot">${buffer[i]??'·'}</div>`).join('')}</div><div class="safe-keypad">${'1234567890'.split('').map(d=>`<button class="key-btn" data-action="safe-digit" data-digit="${d}">${d}</button>`).join('')}</div><div class="actions-row" style="justify-content:center"><button class="btn btn-primary" data-action="safe-try" ${buffer.length!==code.length?'disabled':''}>PROVA IL CODICE</button><button class="btn btn-secondary" data-action="safe-clear">CANCELLA</button></div><div style="margin-top:18px">${L.feedback.slice(-5).map(f=>`<div class="hint-row">${f.map(x=>`<span class="hint-dot ${x.kind}">${x.digit}</span>`).join('')}</div>`).join('')}</div>`;
}
function renderBattle(L){
 const hp=L.hp[S.uid]??0,phase=L.battlePhase||'choose',runningDoors=phase==='choose';
 const doorCount=(L.battlePending?.doorCountBefore||L.doorCount||6);
 const byUid=uid=>S.players.find(p=>p.uid===uid)||{uid,name:'Sfidante'};
 const getDoorPlayers=d=>Object.entries(L.battlePicks||{}).filter(([,door])=>Number(door)===d).map(([uid])=>byUid(uid));
 const doorTiles=Array.from({length:doorCount},(_,i)=>i+1).map(d=>{
  const group=getDoorPlayers(d),colliding=group.length>1;
  return `<div class="battle-door-card ${colliding?'has-clash':''} ${d===L.myDoor?'my-door':''} ${phase==='reveal'&&colliding?'door-shaking':''}">${runningDoors?`<button class="battle-door-button" data-action="battle-door" data-door="${d}" ${!L.alive.includes(S.uid)||L.hp[S.uid]<=0?'disabled':''}><span class="battle-door-symbol">🚪</span><strong>PORTA ${d}</strong><small>${L.doorCount} porte ancora aperte</small><span class="door-choose">SCEGLI ↗</span></button>`:`<div class="battle-door-top"><span class="battle-door-symbol">${colliding?'⚡':'🚪'}</span><strong>PORTA ${d}</strong><small>${group.length?`${group.length} sfidanti`:'vuota'}</small></div><div class="battle-door-roster">${group.map(p=>`<div class="door-fighter ${phase==='result'&&L.battleEvents.some(ev=>ev.targetUid===p.uid)?'targeted':''} ${L.alive.includes(p.uid)?'':'knocked-out'}"><div class="door-fighter-portrait">${avatarImage(p)?`<img src="${safe(avatarImage(p))}" alt="${safe(p.characterName||p.name)}">`:`<span>${p.isCPU?'🤖':'👤'}</span>`}</div><span>${safe(p.characterName||p.name)}</span>${phase==='result'&&L.battleEvents.some(ev=>ev.targetUid===p.uid)?'<b class="target-mark">🎯</b>':''}</div>`).join('')||'<span class="empty-door">nessuno</span>'}</div>${colliding?`<div class="door-collision-label">${phase==='reveal'?'SCONTRO!':'DADO LANCIATO'}</div>`:''}</div>`;
 }).join('');
 const fighters=S.players.slice().sort((a,b)=>(L.hp[b.uid]||0)-(L.hp[a.uid]||0));
 return `<div class="game-center battle-title"><div class="game-stats"><div class="mini-stat"><strong>${hp}<small>/20</small></strong><span>IL TUO HP</span></div><div class="mini-stat"><strong>${L.round}</strong><span>ROUND</span></div><div class="mini-stat"><strong>${L.doorCount}</strong><span>PORTE APERTE</span></div><div class="mini-stat"><strong>${L.alive.length}</strong><span>ANCORA VIVI</span></div></div>${phase==='choose'?`<h2>🚪 Scegli una porta!</h2><p>Gli sfidanti scelgono a loro volta. Se due o più personaggi entrano dalla stessa porta, si tira un dado: ogni risultato indica chi viene bersagliato.</p>`:phase==='reveal'?`<h2 class="battle-action-title">⚡ LE PORTE SI APRONO…</h2><p>Guarda dove sono finiti gli sfidanti. Ogni porta condivisa scatena uno scontro!</p>`:`<h2 class="battle-action-title">🎲 ESITO DEGLI SCONTRI</h2><p>Il dado ha deciso. Ecco chi è stato colpito in questo round.</p>`}</div><div class="battle-door-stage ${phase!=='choose'?'revealing':''}">${doorTiles}</div>${phase==='choose'?`<section class="battle-health-panel"><div class="battle-section-heading"><h3>GLI SFIDANTI</h3><span>Ritratti e punti vita in tempo reale sul tuo schermo</span></div><div class="battle-health-grid">${fighters.map(p=>{const playerHp=L.hp[p.uid]||0;return `<div class="battle-health-card ${L.alive.includes(p.uid)?'':'eliminated'} ${p.uid===S.uid?'is-me':''}"><div class="battle-health-portrait">${avatarImage(p)?`<img src="${safe(avatarImage(p))}" alt="${safe(p.characterName||p.name)}">`:`<span>${p.isCPU?'🤖':'👤'}</span>`}</div><div class="battle-health-info"><strong>${safe(p.characterName||p.name)}</strong><small>${safe(p.name)}${p.uid===S.uid?' · TU':''}</small><div class="hp-track"><i style="width:${playerHp/20*100}%;background:${playerHp<=6?'var(--red)':playerHp<=12?'var(--orange)':'var(--lime)'}"></i></div></div><b class="hp-number">${playerHp}<small> HP</small></b></div>`;}).join('')}</div></section>`:`<section class="battle-duels-panel"><div class="battle-section-heading"><h3>${phase==='reveal'?'🎲 SI STA TIRANDO IL DADO':'📣 IL VERDETTO'}</h3><span>${(L.battleEvents||[]).length} scontri</span></div>${L.battleEvents?.length?L.battleEvents.map((ev,i)=>`<article class="battle-duel-card"><div class="battle-duel-heading"><span>PORTA ${ev.door} · SCONTRO ${i+1}</span><span class="battle-vs">VS</span></div><div class="battle-duel-contenders">${ev.group.map(uid=>{const p=byUid(uid);return `<div class="battle-duel-player ${phase==='result'&&ev.targetUid===uid?'chosen-target':''}"><div class="battle-duel-portrait">${avatarImage(p)?`<img src="${safe(avatarImage(p))}" alt="${safe(p.characterName||p.name)}">`:`<span>${p.isCPU?'🤖':'👤'}</span>`}</div><strong>${safe(p.characterName||p.name)}</strong><small>${safe(p.name)}</small>${phase==='result'&&ev.targetUid===uid?'<b class="target-ribbon">BERSAGLIO</b>':''}</div>`;}).join('')}<div class="battle-dice-area"><div class="battle-dice ${phase==='reveal'?'rolling':''}" ${phase==='reveal'?`data-battle-die="${i}"`:''}>${phase==='reveal'?L.rollFace:ev.roll}</div><small>${phase==='reveal'?'DADO IN VOLO':`RISULTATO: ${ev.roll}`}</small></div></div>${phase==='result'?`<div class="battle-hit-result"><span>🎯</span><div><strong>${safe(byUid(ev.targetUid).characterName||byUid(ev.targetUid).name)} viene colpito!</strong><small>${safe(byUid(ev.targetUid).name)} perde ${ev.damage} HP · ${ev.hpAfter} HP rimanenti</small></div><b class="damage-number">−${ev.damage}</b></div>${ev.eliminated?'<div class="elimination-banner">💥 ELIMINATO! Il personaggio esce dalla Battle Royale.</div>':''}`:`<div class="battle-hint">Il dado sta scegliendo il bersaglio tra chi ha condiviso la porta…</div>`}</article>`).join(''):`<div class="no-clash-panel"><div>🕊️</div><strong>Nessuno scontro questa volta</strong><p>Tutti hanno trovato una porta diversa. Il round passa senza danni!</p></div>`}${phase==='result'?`<div class="battle-next-banner">${!L.alive.includes(S.uid)?'Sei stato eliminato…':L.alive.length===1?'Resta un solo sopravvissuto!':`Round ${L.round} risolto · si riparte tra un istante`}</div>`:''}</section>`}<div class="battle-action-footer">${phase==='choose'?`<p class="helper">💡 Scegli una porta insieme ai tuoi sfidanti. Dopo ogni 3 round la porta più alta crolla e il campo si restringe.</p>`:`<p class="helper">${phase==='reveal'?'Il dado è in aria: il bersaglio verrà evidenziato appena si ferma.':'I danni sono stati applicati. Preparati al prossimo round.'}</p>`}</div>`;
}
function renderConnect(L){
 const count=[6,10,18][L.level]||18;
 return `<div class="game-center"><div class="game-stats"><div class="mini-stat"><strong>${L.level+1}/3</strong><span>Livello</span></div><div class="mini-stat"><strong>${Math.min(L.done,count)}/${count}</strong><span>Associazioni</span></div><div class="mini-stat"><strong>${L.errors}</strong><span>Errori</span></div></div><h2>Abbina il simbolo al colore</h2><p>Memorizza la legenda, poi seleziona il colore del simbolo mostrato qui sotto.</p><div class="connect-ref">${L.mapping.map((m,i)=>`<div class="connect-ref-item"><span>${SYMBOLS[m.sym]}</span><span class="color-dot" style="background:${COLORS[m.color].hex}"></span><span>${COLORS[m.color].name}</span></div>`).join('')}</div><div class="connect-prompt">${SYMBOLS[L.mapping[L.targets[L.done]]?.sym ?? 0]}</div><div class="color-choice-row">${L.availableColors.map(ci=>`<button class="color-choice" data-action="connect-color" data-color="${ci}" style="--choice:${COLORS[ci].hex}" title="${COLORS[ci].name}"></button>`).join('')}</div><p class="helper">${L.lastFeedback||'Tocca il colore corrispondente al simbolo.'}</p></div>`;
}
function renderTabelluno(L){
 const G=S.sharedGame;
 if(!G||G.type!=='tabelluno')return `<div class="shared-wait"><div class="loader"></div><h2>Prepariamo il tabellone…</h2><p>I personaggi stanno prendendo posto alla partenza.</p></div>`;
 const players=S.players,positions=G.positions||{},turnOrder=G.turnOrder||[],finishOrder=G.finishOrder||[];
 const currentUid=unoCurrentUid(G),current=players.find(p=>p.uid===currentUid),isMyTurn=currentUid===S.uid&&G.status==='active';
 const finished=new Set(finishOrder);
 const playerImage=p=>avatarImage(p)?`<img src="${safe(avatarImage(p))}" alt="${safe(p.characterName||p.name)}" loading="lazy">`:`<span>${p?.isCPU?'🤖':'👤'}</span>`;
 const specialAt=i=>i===0?'🚦':i===43?'🏁':[7,22,37].includes(i)?'⏩':[10,28,35].includes(i)?'↩️':i===16?'🌪️':[5,12,19,26,33,40].includes(i)?'🎨':'';
 const classAt=i=>i===0?'uno-tile-start':i===43?'uno-tile-goal':[7,22,37].includes(i)?'uno-tile-plus':[10,28,35].includes(i)?'uno-tile-minus':i===16?'uno-tile-tornado':[5,12,19,26,33,40].includes(i)?'uno-tile-color':'';
 const cells=Array.from({length:44},(_,i)=>{
  const rowIndex=Math.floor(i/8),offset=i%8,col=(rowIndex%2===0?offset:7-offset)+1,row=6-rowIndex;
  const here=players.filter(p=>Number(positions[p.uid]||0)===i);
  const special=specialAt(i);
  return `<div class="uno-tile ${classAt(i)} ${here.some(p=>p.uid===S.uid)?'my-pawn-here':''} ${here.length?'occupied':''}" style="grid-column:${col};grid-row:${row}" title="${i===0?'Partenza':i===43?'Traguardo':`Casella ${i}`}"><div class="uno-tile-top"><span>${i===0?'START':i===43?'🏁':i}</span>${special&&i!==0&&i!==43?`<b class="uno-space-special">${special}</b>`:''}</div><div class="uno-pawns">${here.map(p=>`<div class="uno-pawn ${p.uid===S.uid?'my-pawn':''} ${p.uid===currentUid?'active-pawn':''}" title="${safe(p.characterName||p.name)}">${playerImage(p)}</div>`).join('')}</div></div>`;
 }).join('');
 // Mostra prima il giocatore che deve agire, poi gli altri nel verso corrente.
 const orderIds=[];
 if(turnOrder.length){const ix=Math.max(0,turnOrder.indexOf(currentUid)),dir=G.direction===-1?-1:1;for(let step=0;step<turnOrder.length;step++){const uid=turnOrder[(ix+step*dir+turnOrder.length*2)%turnOrder.length];if(!finished.has(uid)&&!orderIds.includes(uid))orderIds.push(uid);}for(const uid of turnOrder)if(!orderIds.includes(uid))orderIds.push(uid);}
 const order=orderIds.map((uid,index)=>{const p=players.find(x=>x.uid===uid);if(!p)return '';const active=uid===currentUid&&G.status==='active',done=finished.has(uid);return `<div class="uno-order-item ${active?'active':''} ${done?'done':''}">${playerImage(p)}<span>${safe(p.characterName||p.name)}</span>${active?'<b>ORA</b>':done?'<b>🏁</b>':''}</div>${index<orderIds.length-1?'<span class="uno-order-arrow">➜</span>':''}`;}).join('');
 const last=G.lastCard,cardColor=last?.color==='🔴'?'#d8465f':last?.color==='🔵'?'#3476dd':last?.color==='🟡'?'#c89718':last?.color==='🟢'?'#168a5a':'#5849bb';
 const card=last?`<div class="uno-card-face ${safe(last.kind||'number')}" style="--uno-card-color:${cardColor}"><span class="uno-card-corner">${safe(last.color||'🃏')}</span><strong>${safe(last.face||'UNO')}</strong><small>${safe(last.kind==='number'?'PESCA E AVANZA':last.kind==='plus2'?'FAI DUE PASSI IN PIÙ':last.kind==='reverse'?'CAMBIA IL VERSO':last.kind==='block'?'BLOCCA UNO SFIDANTE':'CAMBIACOLORE')}</small></div><p>${safe(last.desc||G.lastEvent||'')}</p>`:`<div class="uno-card-back"><span>UNO</span><b>🃏</b></div><p>La prima carta farà partire la corsa!</p>`;
 let actions='';
 if(G.status==='finished'){
  const winner=players.find(p=>p.uid===G.ranking?.[0]);
  actions=`<div class="uno-finish-celebration"><div class="uno-finish-icon">🏆</div><h2>${safe(winner?.characterName||winner?.name||'Il vincitore')} ha vinto!</h2><p>Guarda l’ordine d’arrivo dei personaggi qui sotto.</p></div>`;
 }else if(!isMyTurn){
  actions=`<div class="uno-wait-message">${current?`<div class="uno-turn-avatar">${playerImage(current)}</div>`:'<div class="uno-finish-icon">🃏</div>'}<h2>Ora gioca ${safe(current?.characterName||current?.name||'uno sfidante')}</h2><p>Osserva il suo PNG mentre avanza sul tabellone. Subito dopo toccherà a un altro personaggio.</p></div>`;
 }else if(G.pending?.type==='colorGuess'){
  actions=`<h2>🎨 Scegli il colore!</h2><p>Indovina il colore della prossima carta: se ci prendi avanzi del numero uscito, altrimenti torni indietro di 3.</p><div class="uno-color-choices">${[['🔴','Rosso','#ff4f70'],['🔵','Blu','#4d8dff'],['🟡','Giallo','#ffd447'],['🟢','Verde','#4fe0a0']].map(([e,n,c])=>`<button class="uno-color-choice" style="--uno-choice:${c}" data-action="uno-guess-color" data-color="${e}"><span>${e}</span><strong>${n}</strong></button>`).join('')}</div>`;
 }else if(G.pending?.type==='blockTarget'){
  actions=`<h2>⛔ Chi vuoi bloccare?</h2><p>Scegli un avversario: salterà il suo prossimo turno.</p><div class="uno-block-choices">${players.filter(p=>p.uid!==S.uid&&!finished.has(p.uid)).map(p=>`<button class="uno-block-choice" data-action="uno-block-target" data-uid="${safe(p.uid)}">${playerImage(p)}<span>${safe(p.characterName||p.name)}</span><b>BLOCCA</b></button>`).join('')}</div>`;
 }else{
  actions=`<h2>È il tuo turno, ${safe(playerMe()?.characterName||playerMe()?.name||'campione')}!</h2><p>Pesca una carta: la tua pedina avanzerà sul percorso.</p><button class="btn btn-primary btn-draw-uno" data-action="uno-draw">🃏 PESCA LA CARTA</button>`;
 }
 const playerCards=players.slice().sort((a,b)=>{const af=finishOrder.indexOf(a.uid),bf=finishOrder.indexOf(b.uid);if(af>=0&&bf>=0)return af-bf;if(af>=0)return -1;if(bf>=0)return 1;return (positions[b.uid]||0)-(positions[a.uid]||0);}).map(p=>{
  const pos=Number(positions[p.uid]||0),finishIndex=finishOrder.indexOf(p.uid),active=p.uid===currentUid;
  return `<div class="uno-player-card ${active?'current-player':''} ${finished.has(p.uid)?'finished-player':''} ${p.uid===S.uid?'me-player':''}"><div class="uno-player-avatar">${playerImage(p)}${finishIndex>=0?`<b>${finishIndex+1}°</b>`:''}</div><strong>${safe(p.characterName||p.name)}</strong><small>${finished.has(p.uid)?`🏁 ${finishIndex+1}°`:pos===43?'TRAGUARDO':`È alla casella ${pos}`}</small><div class="uno-mini-track"><i style="width:${Math.max(0,Math.min(100,pos/43*100))}%"></i></div></div>`;
 }).join('');
 return `<div class="tabelluno-scene"><div class="uno-turn-banner ${isMyTurn?'your-turn':''}"><div class="uno-turn-portrait">${current?playerImage(current):'🃏'}</div><div><small>${G.status==='finished'?'FINE DELLA CORSA':isMyTurn?'LA TUA CARTA!':'TOCCA A'}</small><strong>${safe(current?.characterName||current?.name||(G.status==='finished'?'Traguardo raggiunto':'In attesa'))}</strong><span>${G.status==='finished'?'La corsa è conclusa!':isMyTurn?'Pesca e guarda il tuo personaggio avanzare.':'Tutti vedono la stessa mossa.'}</span></div><div class="uno-turn-arrow">${G.status==='finished'?'🏁':'🎲'}</div></div><section class="uno-order-panel"><div class="shared-section-title"><h3>CHI GIOCA DOPO?</h3><span>Il turno scorre in questo ordine</span></div><div class="uno-turn-order">${order}</div></section><div class="uno-simple-rules"><b>REGOLE FACILI</b><span>Pesca una carta e muovi il tuo PNG. Le caselle speciali fanno avanzare, arretrare o chiedono una scelta. Vince chi arriva per primo al traguardo; si continua per stabilire i piazzamenti.</span></div><div class="uno-board-heading"><div><h2>🏁 La corsa dei personaggi</h2><p>Ogni ritratto è una pedina. Cerca il tuo PNG e guarda quanto manca al traguardo.</p></div><div class="uno-board-key"><i>⏩ vai avanti</i><i>↩️ torna indietro</i><i>🎨 scegli il colore</i><i>🌪️ pausa</i></div></div><div class="uno-board-viewport"><div class="uno-track">${cells}</div></div><div class="uno-below-board"><section class="uno-card-stage"><div class="uno-card-stage-heading"><span>LA CARTA PESCATA</span><small>La carta decide il movimento</small></div>${card}</section><section class="uno-action-panel">${actions}<div class="uno-last-event">${safe(G.lastEvent||'Pronti, partenza… pesca!')}</div></section></div><section class="uno-player-lineup"><div class="shared-section-title"><h3>TUTTI I CORRIDORI</h3><span>${finishOrder.length} al traguardo</span></div><div class="uno-player-cards">${playerCards}</div></section></div>`;
}
function renderCatch(L){
 const t=L.target; const secs=Math.max(0,Math.ceil((L.endsAt-Date.now())/1000));
 return `<div class="game-center"><div class="game-stats"><div class="mini-stat"><strong>${L.points}</strong><span>Punti</span></div><div class="mini-stat"><strong>${secs}s</strong><span>Tempo rimasto</span></div><div class="mini-stat"><strong>${L.hits}</strong><span>Colpi</span></div></div><p>Prendi i bersagli colorati. I rari valgono 3 punti, le trappole tolgono 2.</p></div><div class="target-arena" id="target-arena"><button class="target-btn ${t.type==='rare'?'rare':''} ${t.type==='trap'?'trap':''}" data-action="catch-target" style="left:${t.x}%;top:${t.y}%;--target:${t.type==='trap'?'#292b3c':t.type==='rare'?'#ffd447':'#53e0ff'}" aria-label="Bersaglio">${t.type==='trap'?'×':t.type==='rare'?'✦':'●'}</button></div><div class="game-center"><p class="helper">Non cliccare le trappole tratteggiate!</p></div>`;
}
function renderCups(L){
 return `<div class="game-center"><div class="game-stats"><div class="mini-stat"><strong>${L.lives}/3</strong><span>Vite</span></div><div class="mini-stat"><strong>${L.round}</strong><span>Round</span></div><div class="mini-stat"><strong>${L.bombs.length}</strong><span>Bombe nascoste</span></div></div><h2>Quale bicchiere è sicuro?</h2><p>Le bombe vengono mostrate e poi i bicchieri si mescolano. Scegline uno che non contenga una bomba.</p><div class="cup-grid">${Array.from({length:L.cupCount},(_,i)=>`<button class="cup-btn ${((L.reveal||L.showingBombs)&&L.bombs.includes(i))?'reveal':''}" data-action="cup-pick" data-cup="${i}" ${(L.selected!==null||L.showingBombs)?'disabled':''}>${(L.reveal||L.showingBombs)?(L.bombs.includes(i)?'💣':'🥤'):'🥤'}<span>BICCHIERE ${i+1}</span></button>`).join('')}</div><div class="game-center"><p class="helper">${L.lastText||'Segui la posizione dopo il mescolamento.'}</p>${L.selected!==null?`<button class="btn btn-secondary" data-action="cup-next">PROSSIMO ROUND ↗</button>`:''}</div>`;
}
function renderGameResults(){
 const g=currentGame(), rows=(S.room.lastStandings||[]).slice().sort((a,b)=>a.place-b.place);
 return `<div class="result-hero"><div class="trophy">${g.icon}</div><div class="eyebrow" style="justify-content:center">RISULTATI DEL MINIGIOCO ${S.room.gameIndex+1}</div><h1>La classifica è <span class="accent">servita.</span></h1><p>${g.name} è finito. I punti sono stati assegnati; la prossima sfida inizia tra pochi secondi.</p></div><section class="panel narrow"><div class="result-list">${rows.map(r=>`<div class="result-row"><div class="result-rank">${r.place}</div>${avatarImgHtml(r,38)}<div class="result-name"><strong>${safe(r.name)}</strong><small>${r.place===1?'VINCITORE DEL MINIGIOCO':r.isCPU?'NPC':'PIAZZAMENTO'} · ${safe(r.characterName||'')}</small></div><div class="result-points">+${r.points}</div></div>`).join('')}</div><div class="waiting-banner">Classifica generale aggiornata. I punti si accumulano fra tutti i minigiochi.</div></section>`;
}
function renderFinalReveal(){
 const standings=S.room.finalStandings||[];const count=S.room.revealedCount||0;const reveal=standings.slice(Math.max(0,standings.length-count)).reverse();
 const next=standings[Math.max(0,standings.length-count-1)];
 return `<div class="result-hero"><div class="trophy">🎬</div><div class="eyebrow" style="justify-content:center">GRAN FINALE · RIVELAZIONE</div><h1>Chi si prende <span class="accent">la corona?</span></h1><p>Dal fondo della classifica fino al vincitore. Nessuno spoiler, promesso.</p>${count<standings.length?`<div class="countdown-number countdown-pulse">${standings.length-count}</div><button class="btn btn-primary" data-action="reveal-next">RIVELA IL PROSSIMO ↗</button>`:'<p class="text-lime">Tutti i piazzamenti sono stati rivelati.</p><button class="btn btn-primary" data-action="show-final">VEDI CLASSIFICA COMPLETA</button>'}</div><section class="panel narrow"><div class="result-list">${reveal.map((r,i)=>`<div class="result-row"><div class="result-rank">${r.place}</div>${avatarImgHtml(r,38)}<div class="result-name"><strong>${safe(r.name)}</strong><small>${safe(r.characterName||'')} ${r.isCPU?'· CPU':''}</small></div><div class="result-points">${r.totalPoints} pt</div></div>`).join('')}${count===0?'<p class="muted" style="text-align:center;padding:24px">La classifica è coperta…</p>':''}</div></section>`;
}
function renderFinal(){
 const standings=(S.room.finalStandings||[]).slice().sort((a,b)=>a.place-b.place);
 return `<div class="result-hero"><div class="trophy">🏆</div><div class="eyebrow" style="justify-content:center">FINE PARTITA</div><h1>Campione del <span class="accent">caos.</span></h1><p>La partita è finita. La gloria, almeno fino alla rivincita, è tua.</p></div><section class="panel narrow"><div class="result-list">${standings.map(r=>`<div class="result-row"><div class="result-rank">${r.place}</div>${avatarImgHtml(r,42)}<div class="result-name"><strong>${safe(r.name)} ${r.place===1?'👑':''}</strong><small>${safe(r.characterName||'')} ${r.isCPU?'· CPU':''}</small></div><div class="result-points">${r.totalPoints} pt</div></div>`).join('')}</div><div class="actions-row"><button class="btn btn-primary" data-action="rematch">NUOVA PARTITA NELLA STESSA STANZA ↗</button><button class="btn btn-secondary" data-action="leave-room">TORNA AL MENU</button></div><p class="helper">Per fare una nuova partita gli altri giocatori devono essere ancora connessi alla stanza.</p></section>`;
}
function formatTime(sec){const m=Math.floor(sec/60),s=sec%60;return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;}

// ---------- Connessione e stanze Firestore ----------
function roomRef(){return doc(db,'rooms',S.roomCode);}
function playersRef(){return collection(db,'rooms',S.roomCode,'players');}
function resultCollection(index=S.room?.gameIndex){return collection(db,'rooms',S.roomCode,'results',String(index),'players');}
function playerRef(uid=S.uid){return doc(db,'rooms',S.roomCode,'players',uid);}
function claimRef(characterId){return doc(db,'rooms',S.roomCode,'characters',characterId);}
function watchRoom(code){
  cleanupRoomListeners(); S.roomCode=code; S.screen='room'; S.room=null;render();
  const rref=doc(db,'rooms',code);
  S.unsubRoom=onSnapshot(rref,snap=>{
    if(!snap.exists()){notify('La stanza non esiste più.');cleanupRoomListeners();S.screen='menu';render();return;}
    const previous=S.room;S.room={...snap.data(),code:snap.id};
    if(S.room.status==='closed'){render();return;}
    const liveGameId=S.room.selectedGames?.[S.room.gameIndex];
    if(S.room.phase==='active'&&['bombpass','cutwire','tabelluno'].includes(liveGameId))watchSharedGame(code);
    else if(S.unsubSharedGame){S.unsubSharedGame();S.unsubSharedGame=null;S.sharedGame=null;S.sharedGameKey='';S.sharedCpuTag='';}
    if(S.currentResultsKey!==String(S.room.gameIndex)){watchResults(S.room.gameIndex);}
    const phaseKey=`${S.room.phase}_${S.room.gameIndex}`;
    if(previous?.phase!==S.room.phase||previous?.gameIndex!==S.room.gameIndex||previous?.revealedCount!==S.room.revealedCount||!previous){S.phaseKey=phaseKey;S.localGame=null;render();}
    else if(S.screen==='room'&&S.room.phase!=='active')render();
    if(S.room.phase==='results')recordMiniStats();
    if(S.room.phase==='final')recordMatchStats();
    heartbeat();
  },err=>{console.error(err);notify('Connessione alla stanza persa: controlla le Firestore Rules.');setConnection('ERRORE LOBBY',false);});
  S.unsubPlayers=onSnapshot(query(playersRef()),snap=>{
    S.players=snap.docs.map(d=>({...d.data(),uid:d.id}));
    if(S.room?.phase==='active'&&S.localGame?.id==='space'){} else if(S.screen==='room'&&['lobby','countdown','intro'].includes(S.room?.phase))render();
    heartbeat();
  },err=>{console.error(err);notify('Non riesco a leggere i partecipanti. Controlla le regole Firestore.');});
  S.unsubClaims=onSnapshot(collection(db,'rooms',code,'characters'),snap=>{
    S.claims=snap.docs.map(d=>({id:d.id,...d.data()}));
    if(S.screen==='room'&&['lobby','countdown'].includes(S.room?.phase))render();
  },err=>console.warn('claims listener',err));
  watchProgress(code);
}
function watchResults(index){
  if(S.unsubResults){S.unsubResults();S.unsubResults=null;}
  S.currentResultsKey=String(index); S.results=[];
  if(!S.roomCode)return;
  S.unsubResults=onSnapshot(collection(db,'rooms',S.roomCode,'results',String(index),'players'),snap=>{
    S.results=snap.docs.map(d=>({...d.data(),uid:d.id}));
    if(S.room?.phase==='active'&&S.screen==='room'){
      if(S.results.some(r=>r.uid===S.uid))render();
      else {const list=$('#live-score-list');if(list)list.innerHTML=renderMiniLeaderboardRows();}
    }
    if(S.room?.phase==='results')recordMiniStats();
    heartbeat();
  },err=>console.warn('results listener',err));
}
function watchProgress(code){
  if(S.unsubProgress){S.unsubProgress();S.unsubProgress=null;}
  S.progress=[];
  S.unsubProgress=onSnapshot(collection(db,'rooms',code,'progress'),snap=>{
    S.progress=snap.docs.map(d=>({...d.data(),uid:d.id}));
    if(S.screen==='room'&&S.room?.phase==='active'){
      const list=$('#live-score-list');
      if(list)list.innerHTML=renderMiniLeaderboardRows();
      const note=$('#live-score-note');
      if(note)note.textContent=`${S.progress.filter(x=>x.gameIndex===S.room.gameIndex&&x.gameId===currentGame().id&&x.matchNumber===(S.room.matchNumber||0)).length}/${S.players.length} progressi ricevuti`;
    }
  },err=>console.warn('progress listener',err));
}
function watchSharedGame(code){
 const liveId=sharedGameDocumentId();
 const key=`${code}:${liveId}`;
 if(S.sharedGameKey===key&&S.unsubSharedGame)return;
 if(S.unsubSharedGame){S.unsubSharedGame();S.unsubSharedGame=null;}
 S.sharedGameKey=key;S.sharedGame=null;S.sharedCpuTag='';S.sharedCpuAt=0;
 S.unsubSharedGame=onSnapshot(doc(db,'rooms',code,'minigames',liveId),snap=>{
   S.sharedGame=snap.exists()?{...snap.data(),id:snap.id}:null;
   if(S.screen==='room'&&S.room?.phase==='active'&&isSharedMinigame(currentGame()?.id))render();
   if(S.sharedGame?.status==='finished')submitSharedGameResult();
 },err=>{console.error('shared minigame listener',err);notify('Non riesco a sincronizzare questa sfida. Controlla le Firestore Rules aggiornate.');});
}
function randomCode(){const chars='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';return Array.from({length:6},()=>chars[Math.floor(Math.random()*chars.length)]).join('');}
function blankPlayer(uid,name,isCPU=false){return {uid,name,isCPU,isHost:uid===S.uid,characterId:null,characterName:null,characterImage:null,ready:false,totalPoints:0,lastPlace:null,joinedAt:serverTimestamp(),cpuSkill:Math.random(),cpuTargetMs:randomBetween(14000,62000)};}
async function createRoom(){
 const maxPlayers=Number($('#max-players')?.value||6), minigameCount=Number($('#game-count')?.value||8), fillCPU=$('#fill-cpu')?.value==='yes';
 try{
   let code=randomCode();for(let attempt=0;attempt<6;attempt++){const existing=await getDoc(doc(db,'rooms',code));if(!existing.exists())break;code=randomCode();}
   const newRoom=doc(db,'rooms',code);
   await setDoc(newRoom,{hostUid:S.uid,hostName:S.name,status:'waiting',phase:'lobby',maxPlayers,minigameCount,fillCPU,selectedGames:[],gameIndex:-1,createdAt:serverTimestamp(),matchNumber:0,countdownEndsAt:null,gameStartedAt:null,gameDeadlineAt:null,finalStandings:[],revealedCount:0});
   await setDoc(doc(db,'rooms',code,'players',S.uid),{uid:S.uid,name:S.name,isCPU:false,isHost:true,characterId:null,characterName:null,characterImage:null,ready:false,totalPoints:0,lastPlace:null,joinedAt:serverTimestamp(),cpuSkill:0,cpuTargetMs:0});
   watchRoom(code);notify(`Stanza creata: ${code}`);
 }catch(err){console.error(err);notify(friendlyError(err,'Non sono riuscito a creare la stanza.'));}
}
async function joinRoom(code){
 code=String(code||'').toUpperCase().replace(/[^A-Z0-9]/g,'');if(code.length!==6){notify('Il codice deve avere sei caratteri.');return;}
 try{
   const rref=doc(db,'rooms',code), rs=await getDoc(rref);if(!rs.exists()){notify('Codice stanza non trovato.');return;}
   const room=rs.data();if(room.status!=='waiting'||room.phase!=='lobby'){notify('Questa stanza non è più in attesa.');return;}
   const ps=await getDocs(collection(db,'rooms',code,'players'));
   if(ps.docs.some(p=>p.id===S.uid)){watchRoom(code);return;}
   if(ps.size>=room.maxPlayers){notify('La lobby è piena.');return;}
   await setDoc(doc(db,'rooms',code,'players',S.uid),{uid:S.uid,name:S.name,isCPU:false,isHost:false,characterId:null,characterName:null,characterImage:null,ready:false,totalPoints:0,lastPlace:null,joinedAt:serverTimestamp(),cpuSkill:0,cpuTargetMs:0});
   watchRoom(code);notify(`Sei entrato nella stanza ${code}.`);
 }catch(err){console.error(err);notify(friendlyError(err,'Non sono riuscito a entrare nella stanza.'))}
}
function friendlyError(err,fallback){
 if(err?.code==='permission-denied')return 'Permesso negato da Firestore: controlla che Authentication e firestore.rules siano configurati.';
 if(err?.code==='unavailable')return 'Firebase non è raggiungibile. Riprova fra poco.';
 return fallback+(err?.message?` (${err.message})`:'');
}
async function refreshRooms(){
 try{const snaps=await getDocs(query(collection(db,'rooms'),where('status','==','waiting'),limit(30)));S.publicRooms=snaps.docs.map(d=>({code:d.id,...d.data()})).filter(r=>r.phase==='lobby').sort((a,b)=>String(a.hostName).localeCompare(String(b.hostName)));render();}
 catch(err){console.error(err);notify(friendlyError(err,'Non riesco a caricare le lobby.'))}
}
async function refreshStats(){
 try{const snap=await getDoc(doc(db,'users',S.uid));S.profile=snap.exists()?snap.data():{};render();}
 catch(err){console.error(err);notify(friendlyError(err,'Non riesco a leggere le statistiche.'))}
}
async function selectCharacter(characterId){
 const c=charById(characterId), me=playerMe();if(!c||!me||!S.roomCode)return;
 if(me.characterId===c.id)return;
 try{
   const rref=roomRef(), pref=playerRef(), oldClaim=me.characterId?claimRef(me.characterId):null, newClaim=claimRef(c.id);
   await runTransaction(db,async tx=>{
     const rs=await tx.get(rref);if(!rs.exists()||rs.data().phase!=='lobby')throw new Error('La selezione è bloccata: la partita è già partita.');
     const cs=await tx.get(newClaim);if(cs.exists()&&cs.data().playerUid!==S.uid)throw new Error('Quel personaggio è già stato scelto.');
     const ps=await tx.get(pref);if(!ps.exists())throw new Error('Non sei più nella lobby.');
     if(oldClaim&&me.characterId!==c.id){const old=await tx.get(oldClaim);if(old.exists()&&old.data().playerUid===S.uid)tx.delete(oldClaim);}
     tx.set(newClaim,{playerUid:S.uid,characterName:c.n,claimedAt:serverTimestamp()});
     tx.update(pref,{characterId:c.id,characterName:c.n,characterImage:c.i,ready:false});
   });notify(`${c.n} è il tuo personaggio.`);
 }catch(err){console.error(err);notify(err.message||'Non riesco a selezionare questo personaggio.');}
}
async function toggleReady(){
 const me=playerMe();if(!me?.characterId){notify('Prima scegli un personaggio.');return;}
 try{await updateDoc(playerRef(),{ready:!me.ready});}catch(err){console.error(err);notify(friendlyError(err,'Non riesco ad aggiornare il tuo stato.'));}
}
async function readyGame(){const me=playerMe();if(!me)return;try{await updateDoc(playerRef(),{ready:true});}catch(err){console.error(err);notify(friendlyError(err,'Non riesco a segnarti pronto.'));}}
function buildGameOrder(n){let order=shuffle(GAMES.map(g=>g.id));while(order.length<n)order.push(choice(GAMES).id);return order.slice(0,n);}
async function startMatch(){
 if(S.progressionLock||!S.room||S.room.hostUid!==S.uid||S.room.phase!=='lobby')return;
 const humansNow=humans();if(!humansNow.length||!humansNow.every(p=>p.ready&&p.characterId))return;
 if(!S.room.fillCPU&&humansNow.length<S.room.maxPlayers)return;
 S.progressionLock=true;
 try{
   const freshClaims=await getDocs(collection(db,'rooms',S.roomCode,'characters'));
   let used=new Set(freshClaims.docs.map(d=>d.id));
   // Riempie gli slot liberi con personaggi unici e NPC con tempi di reazione diversi.
   const needed=Math.max(0,S.room.maxPlayers-S.players.length);
   if(needed&&!S.room.fillCPU){S.progressionLock=false;return;}
   for(let i=0;i<needed;i++){
     const available=ROSTER.filter(c=>!used.has(c.id));if(!available.length)break;
     const c=choice(available);used.add(c.id);const uid=`cpu_${Math.random().toString(36).slice(2,10)}_${i}`;const name=`${c.n} CPU`;
     const skill=Math.random();const cpuTargetMs=clamp(Math.round(62000-skill*45000+randomBetween(-4000,4000)),12000,65000);
     await setDoc(doc(db,'rooms',S.roomCode,'players',uid),{uid,name,isCPU:true,isHost:false,characterId:c.id,characterName:c.n,characterImage:c.i,ready:true,totalPoints:0,lastPlace:null,joinedAt:serverTimestamp(),cpuSkill:skill,cpuTargetMs});
     await setDoc(claimRef(c.id),{playerUid:uid,characterName:c.n,claimedAt:serverTimestamp()});
   }
   const order=buildGameOrder(S.room.minigameCount);
   await updateDoc(roomRef(),{phase:'countdown',status:'playing',selectedGames:order,gameIndex:0,countdownEndsAt:Date.now()+8000,gameStartedAt:null,gameDeadlineAt:null,lastStandings:[],finalStandings:[],revealedCount:0});
 }catch(err){console.error(err);notify(friendlyError(err,'Errore durante l’avvio della partita.'));}
 finally{S.progressionLock=false;}
}
async function beginGameCountdown(){
 if(S.progressionLock||S.room?.hostUid!==S.uid||S.room?.phase!=='intro')return;
 const h=humans();if(!h.length||!h.every(p=>p.ready))return;
 S.progressionLock=true;
 try{await updateDoc(roomRef(),{phase:'gameCountdown',countdownEndsAt:Date.now()+3000});}
 catch(err){console.error(err)}finally{S.progressionLock=false;}
}
async function startActiveGame(){
 if(S.progressionLock||S.room?.hostUid!==S.uid||S.room?.phase!=='gameCountdown')return;
 S.progressionLock=true;
 try{
   await initializeSharedMinigame();
   const gameId=currentGame().id;const gameTime=gameId==='memory'?120000:gameId==='safe'?90000:gameId==='catch'?45000:gameId==='bombpass'?600000:gameId==='cutwire'?600000:gameId==='tabelluno'?600000:90000;
   await updateDoc(roomRef(),{phase:'active',gameStartedAt:Date.now(),gameDeadlineAt:Date.now()+gameTime,countdownEndsAt:null});
 }catch(err){console.error(err);notify(friendlyError(err,'Errore durante l’avvio del minigioco.'));}finally{S.progressionLock=false;}
}
async function nextAfterResults(){
 if(S.progressionLock||S.room?.hostUid!==S.uid||S.room?.phase!=='results')return;
 S.progressionLock=true;
 try{
   const current=S.room.gameIndex,last=S.room.selectedGames.length-1;
   if(current<last){
     await Promise.all(S.players.map(p=>updateDoc(doc(db,'rooms',S.roomCode,'players',p.uid),{ready:!!p.isCPU}).catch(()=>{})));
     await updateDoc(roomRef(),{phase:'intro',gameIndex:current+1,countdownEndsAt:null,gameStartedAt:null,gameDeadlineAt:null,resultsEndsAt:null,lastStandings:[]});
   }else{
     const standings=S.players.slice().sort((a,b)=>(Number(b.totalPoints)||0)-(Number(a.totalPoints)||0)).map((p,i)=>({uid:p.uid,name:p.name,characterId:p.characterId,characterName:p.characterName,characterImage:p.characterImage,isCPU:!!p.isCPU,totalPoints:Number(p.totalPoints)||0,place:i+1}));
     await updateDoc(roomRef(),{phase:'finalReveal',finalStandings:standings,revealedCount:0,finalRevealAt:Date.now()+900,resultsEndsAt:null});
   }
 }catch(err){console.error(err);notify('Errore nel passaggio alla prossima fase.');}finally{S.progressionLock=false;}
}
async function resolveGameResults(){
 if(S.progressionLock||S.room?.hostUid!==S.uid||S.room?.phase!=='active')return;
 const expected=S.players.length, got=S.results.length;
 if(isSharedMinigame(currentGame()?.id)&&S.sharedGame?.status==='active')return;
 if(got<expected&&Date.now()<(S.room.gameDeadlineAt||Infinity))return;
 S.progressionLock=true;
 try{
   const have=new Set(S.results.map(r=>r.uid));
   for(const p of S.players){if(!have.has(p.uid)){
     await setDoc(doc(db,'rooms',S.roomCode,'results',String(S.room.gameIndex),'players',p.uid),{uid:p.uid,name:p.name,characterId:p.characterId,gameIndex:S.room.gameIndex,gameId:currentGame().id,metric:0,score:0,durationMs:Date.now()-(S.room.gameStartedAt||Date.now()),submittedAt:Date.now(),isCPU:!!p.isCPU,timeout:true});
   }}
   // La prossima snapshot dei risultati contiene anche eventuali risultati di timeout.
   if(got<expected)return;
   const currentMap=new Map(S.results.map(r=>[r.uid,r]));
   const ranked=S.players.map(p=>({p,r:currentMap.get(p.uid)||{metric:0,score:0,timeout:true}})).sort((a,b)=>(Number(b.r.metric)||0)-(Number(a.r.metric)||0)||(Number(a.r.durationMs)||0)-(Number(b.r.durationMs)||0));
   const points=[12,10,8,7,6,5,4,3,2,1].slice(10-ranked.length);
   const lastStandings=[];
   for(let i=0;i<ranked.length;i++){
     const {p,r}=ranked[i], pts=points[i]||0, total=(Number(p.totalPoints)||0)+pts;
     await updateDoc(doc(db,'rooms',S.roomCode,'players',p.uid),{totalPoints:total,lastPlace:i+1,ready:!!p.isCPU});
     lastStandings.push({uid:p.uid,name:p.name,characterId:p.characterId,characterName:p.characterName,characterImage:p.characterImage,isCPU:!!p.isCPU,metric:Number(r.metric)||0,score:Number(r.score)||0,points:pts,place:i+1,totalPoints:total,timeout:!!r.timeout});
   }
   await updateDoc(roomRef(),{phase:'results',lastStandings,resultsEndsAt:Date.now()+6500});
 }catch(err){console.error(err);notify('Non riesco a calcolare la classifica.');}finally{S.progressionLock=false;}
}
async function heartbeat(){
 if(!S.room||!S.roomCode)return;
 const now=Date.now(), room=S.room;
 if(room.status==='closed')return;
 if(room.hostUid===S.uid){
   if(room.phase==='lobby'){
     const h=humans(), ready=h.length>0&&h.every(p=>p.ready&&p.characterId);
     const enough=room.fillCPU?true:h.length>=room.maxPlayers;
     if(ready&&enough)startMatch();
   }else if(room.phase==='countdown'&&now>=(room.countdownEndsAt||Infinity)){
     if(S.progressionLock)return;
     S.progressionLock=true;try{await Promise.all(S.players.map(p=>updateDoc(doc(db,'rooms',S.roomCode,'players',p.uid),{ready:!!p.isCPU}).catch(()=>{})));await updateDoc(roomRef(),{phase:'intro',countdownEndsAt:null,gameStartedAt:null,gameDeadlineAt:null});}catch(err){console.error(err)}finally{S.progressionLock=false;}
   }else if(room.phase==='intro')beginGameCountdown();
   else if(room.phase==='gameCountdown'&&now>=(room.countdownEndsAt||Infinity))startActiveGame();
   else if(room.phase==='active'){
     const elapsed=now-(room.gameStartedAt||now);
     if(!isSharedMinigame(currentGame()?.id))for(const p of S.players.filter(p=>p.isCPU)){
       if(elapsed>=Number(p.cpuTargetMs||35000)&&!S.results.some(r=>r.uid===p.uid)){
         const g=currentGame(), skill=Number(p.cpuSkill??.5);let metric;
         if(g.id==='catch')metric=Math.round(7+skill*24+Math.random()*7);
         else if(g.id==='space')metric=Math.round(280+skill*1750+Math.random()*180);
         else if(g.id==='memory')metric=Math.round(1300-(Number(p.cpuTargetMs||35000)/1000)*1.15+randomBetween(-12,12));
         else if(g.id==='safe')metric=Math.round(1200-(Number(p.cpuTargetMs||35000)/1000)*1.2+randomBetween(-12,12));
         else if(g.id==='connect')metric=Math.round(1800-(Number(p.cpuTargetMs||35000)/1000)*2+randomBetween(-20,20));
         else if(g.id==='tabelluno')metric=Math.round(15+skill*28+Math.random()*6);
         else if(g.id==='bombpass')metric=Math.round(180+skill*1100+Math.random()*100);
         else if(g.id==='battle')metric=Math.round(200+skill*1350+Math.random()*100);
         else if(g.id==='cups')metric=Math.round(100+skill*700+Math.random()*100);
         else metric=Math.round(100+skill*900+Math.random()*100);
         await setDoc(doc(db,'rooms',S.roomCode,'results',String(room.gameIndex),'players',p.uid),{uid:p.uid,name:p.name,characterId:p.characterId,gameIndex:room.gameIndex,gameId:g.id,metric,score:metric,durationMs:p.cpuTargetMs,submittedAt:Date.now(),isCPU:true});
       }
     }
     if(S.results.length>=S.players.length || now>=(room.gameDeadlineAt||Infinity))resolveGameResults();
   }else if(room.phase==='results'&&now>=(room.resultsEndsAt||Infinity))nextAfterResults();
   else if(room.phase==='finalReveal'&&now>=(room.finalRevealAt||Infinity)){
     const n=(room.finalStandings||[]).length, revealed=Number(room.revealedCount)||0;
     if(revealed>=n){await updateDoc(roomRef(),{phase:'final'});}
     else {await updateDoc(roomRef(),{revealedCount:revealed+1,finalRevealAt:now+1450});}
   }
 }
}
async function submitResult(metric,score=metric,extra={}){
 const L=S.localGame;if(!L||L.submitted||!S.roomCode)return;
 L.submitted=true;L.running=false;stopSpaceLoop();
 const payload={uid:S.uid,name:S.name,characterId:playerMe()?.characterId||null,gameIndex:S.room.gameIndex,gameId:currentGame().id,metric:Number(metric)||0,score:Number(score)||0,durationMs:Date.now()-L.startedAt,submittedAt:Date.now(),isCPU:false,...extra};
 try{await setDoc(doc(db,'rooms',S.roomCode,'results',String(S.room.gameIndex),'players',S.uid),payload);S.lastResultKey=`${S.roomCode}_${S.room.gameIndex}`;await publishCurrentProgress(true);render();}
 catch(err){L.submitted=false;console.error(err);notify(friendlyError(err,'Il risultato non è stato inviato.'))}
}
function recordMiniStats(){
 const key=`mini_${S.roomCode}_${S.room.matchNumber||0}_${S.room.gameIndex}`;if(S.gameStatsMarked.has(key)||localStorage.getItem(`caos_${key}`)||!S.uid)return;
 const own=S.results.find(r=>r.uid===S.uid);const standing=(S.room.lastStandings||[]).find(r=>r.uid===S.uid);if(!own||!standing)return;
 S.gameStatsMarked.add(key);localStorage.setItem(`caos_${key}`,'1');
 const patches={gamesPlayed:increment(1),totalPoints:increment(Number(standing.points)||0)};
 if(standing.place===1)patches[`miniGameWins.${currentGame().id}`]=increment(1);
 const cId=playerMe()?.characterId;if(cId)patches[`characterCounts.${cId}`]=increment(1);
 const profileRef=doc(db,'users',S.uid);setDoc(profileRef,{}, {merge:true}).then(()=>updateDoc(profileRef,patches)).catch(err=>console.warn('stats',err));
}
function recordMatchStats(){
 const key=`match_${S.roomCode}_${S.room.matchNumber||0}`;if(S.profileMarked.has(key)||localStorage.getItem(`caos_${key}`)||!S.uid)return;S.profileMarked.add(key);localStorage.setItem(`caos_${key}`,'1');
 const standings=S.room.finalStandings||[];const won=standings[0]?.uid===S.uid;const cId=playerMe()?.characterId;
 const patch={matchesPlayed:increment(1)};if(won)patch.matchesWon=increment(1);
 const profileRef=doc(db,'users',S.uid);setDoc(profileRef,{}, {merge:true}).then(()=>updateDoc(profileRef,patch)).catch(err=>console.warn('profile stats',err));
}
async function leaveRoom(){
 if(!S.roomCode){S.screen='menu';render();return;}
 const code=S.roomCode, me=playerMe();
 try{
   if(S.room?.hostUid===S.uid){await updateDoc(doc(db,'rooms',code),{status:'closed',phase:'closed'}).catch(()=>{});}
   if(me?.characterId)await deleteDoc(doc(db,'rooms',code,'characters',me.characterId)).catch(()=>{});
   await deleteDoc(doc(db,'rooms',code,'players',S.uid)).catch(()=>{});
 }catch(err){console.warn(err)}
 cleanupRoomListeners();S.screen='menu';render();
}
async function rematch(){
 if(S.room?.hostUid!==S.uid){notify('Solo l’host può preparare la rivincita.');return;}
 try{
   // Mantiene i giocatori nella stanza, azzera punti e personaggi solo per la nuova selezione.
   for(const p of S.players){if(!p.isCPU&&p.characterId)await deleteDoc(doc(db,'rooms',S.roomCode,'characters',p.characterId)).catch(()=>{});await updateDoc(doc(db,'rooms',S.roomCode,'players',p.uid),{totalPoints:0,lastPlace:null,ready:!!p.isCPU,characterId:p.isCPU?p.characterId:null,characterName:p.isCPU?p.characterName:null,characterImage:p.isCPU?p.characterImage:null});}
   await updateDoc(roomRef(),{matchNumber:(S.room.matchNumber||0)+1,status:'waiting',phase:'lobby',selectedGames:[],gameIndex:-1,gameStartedAt:null,gameDeadlineAt:null,countdownEndsAt:null,lastStandings:[],finalStandings:[],revealedCount:0});
   notify('Rivincita preparata. Scegli il personaggio e rimettiti pronto.');
 }catch(err){console.error(err);notify('Non riesco a preparare la rivincita.');}
}

// ---------- Regole minigiochi ----------
function finishMemoryIfDone(){const L=S.localGame;if(L?.matched?.size===36){const time=(Date.now()-L.startedAt)/1000;submitResult(Math.max(1,1300-time),18,{detail:{pairs:18,moves:L.moves}});}}
function memoryFlip(index){
 const L=S.localGame;if(!L||L.id!=='memory'||L.submitted||Date.now()<L.lockUntil||L.open.includes(index)||L.matched.has(index))return;
 L.open.push(index);if(L.open.length===2){L.moves++;const [a,b]=L.open;if(L.deck[a].emoji===L.deck[b].emoji){L.matched.add(a);L.matched.add(b);L.open=[];finishMemoryIfDone();}else{L.lockUntil=Date.now()+2000;setTimeout(()=>{if(S.localGame===L){L.open=[];L.lockUntil=0;render();}},2000);}}
 render();
}
async function passBombShared(actorUid=S.uid){
 if(!sharedActorMayAct(actorUid))return;
 try{
  await mutateSharedGame(state=>{
   if(state.type!=='bombpass'||state.holder!==actorUid||Date.now()>=(state.bombAt||0))return null;
   const now=Date.now();if(state.lastPassAt&&now-state.lastPassAt<650)return null;
   const targets=(state.alive||[]).filter(uid=>uid!==actorUid);if(!targets.length)return null;
   const next=choice(targets),targetPlayer=S.players.find(p=>p.uid===next);
   state.holder=next;state.passCount=(state.passCount||0)+1;state.roundPassCount=(state.roundPassCount||0)+1;
   state.passCounts={...(state.passCounts||{}),[actorUid]:(state.passCounts?.[actorUid]||0)+1};
   state.passTrail=[...(state.passTrail||[]),{from:actorUid,to:next,at:now}].slice(-16);state.lastPassAt=now;
   state.nextCpuPassAt=targetPlayer?.isCPU?now+randomBetween(850,1700):0;
   return state;
  });
 }catch(err){console.error(err);notify(friendlyError(err,'La bomba non è riuscita a passare.'));}
}
function bombTick(){
 const G=S.sharedGame;
 if(currentGame()?.id!=='bombpass'||!G||G.type!=='bombpass'||G.status!=='active'||Date.now()<(G.bombAt||Infinity)||S.sharedBombResolveBusy)return;
 S.sharedBombResolveBusy=true;
 mutateSharedGame(state=>{
   if(state.type!=='bombpass'||state.status!=='active'||Date.now()<(state.bombAt||Infinity))return null;
   const now=Date.now(),exploded=state.holder,aliveBefore=[...(state.alive||[])];
   if(!exploded||!aliveBefore.includes(exploded))return null;
   const survivors=aliveBefore.filter(uid=>uid!==exploded);
   state.eliminated=[...(state.eliminated||[]),exploded];
   state.explosions=[...(state.explosions||[]),{round:state.round||1,uid:exploded,at:now,passes:state.roundPassCount||0}];
   state.explodedUid=exploded;
   state.event={type:'explosion',uid:exploded,round:state.round||1,at:now,passes:state.roundPassCount||0,text:`${displayPlayerName(exploded)} è esploso nel round ${state.round||1}! Il cerchio si restringe: restano ${survivors.length} sfidanti.`};
   state.alive=survivors;
   if(survivors.length<=1){
     state.status='finished';
     state.winnerUid=survivors[0]||null;
     state.ranking=[...(state.winnerUid?[state.winnerUid]:[]),...state.eliminated.slice().reverse()];
     state.finishedAt=now;
     state.nextCpuPassAt=0;
     return state;
   }
   // L'esplosione elimina un giocatore. Solo ORA parte una nuova miccia;
   // passare la bomba non modifica mai bombAt durante il round.
   state.round=(state.round||1)+1;
   state.roundStartedAt=now;
   state.roundPassCount=0;
   state.holder=choice(survivors);
   state.bombAt=now+randomBetween(7000,20000);
   state.lastPassAt=0;
   const nextHolder=S.players.find(p=>p.uid===state.holder);
   state.nextCpuPassAt=nextHolder?.isCPU?now+randomBetween(850,1700):0;
   return state;
 }).catch(err=>console.error('bomb explosion resolution',err)).finally(()=>{S.sharedBombResolveBusy=false;});
}
function bombPass(){
 const L=S.localGame,G=S.sharedGame;if(currentGame()?.id==='bombpass'){
   if(!G||G.type!=='bombpass'||G.status!=='active')return;
   if(Date.now()<(L?.stunnedUntil||0)){notify('Sei ancora stordito!');return;}
   if(G.holder!==S.uid){if(L)L.stunnedUntil=Date.now()+1500;notify('Non hai la bomba: ti sei stordito per un attimo.');render();return;}
   passBombShared(S.uid);return;
 }
 if(!L||L.submitted)return;
}
function chooseWire(wire){
 if(currentGame()?.id==='cutwire'){if(S.sharedGame?.type==='cutwire')chooseSharedWire(Number(wire),S.uid);return;}
 const L=S.localGame;if(!L||L.submitted||L.used.has(wire))return;
 L.used.add(wire);
 if(wire===L.deadWire){notify('Pistone sbagliato! La sfida finisce.');submitResult(L.safeCount*100+Math.max(0,L.used.size-1),L.safeCount,{detail:{safe:L.safeCount}});return;}
 L.safeCount++;
 if(L.used.size===9){submitResult(1000+L.safeCount*100,L.safeCount);return;}
 // Dopo ogni turno i bot azionano un pistone sicuro o quello rimasto, in base alla loro fortuna.
 const available=L.wires.filter(w=>!L.used.has(w));
 if(available.length>1){const aiChoice=Math.random()<.78?choice(available.filter(w=>w!==L.deadWire)):choice(available);if(aiChoice===L.deadWire){L.used.add(aiChoice);L.safeCount+=0;}}
 render();
}
function safeDigit(d){const L=S.localGame;if(!L||L.submitted||L.safeRound>=4)return;const len=L.codes[L.safeRound].length;if(L.buffer.length<len)L.buffer+=d;render();}
function safeClear(){if(S.localGame)S.localGame.buffer='';render();}
function safeTry(){
 const L=S.localGame;if(!L||L.submitted||L.safeRound>=4)return;const code=L.codes[L.safeRound];if(L.buffer.length!==code.length)return;
 const guess=L.buffer;const feedback=guess.split('').map((digit,i)=>({digit,kind:digit===code[i]?'green':code.includes(digit)?'yellow':'gray'}));L.feedback.push(feedback);L.guesses.push(guess);
 if(guess===code){L.doneRounds.push(true);L.safeRound++;L.buffer='';if(L.safeRound===4){const time=(Date.now()-L.startedAt)/1000;submitResult(Math.max(100,1200-time),4,{detail:{rounds:4,guesses:L.guesses.length}});return;}notify('Codice corretto! La cassaforte si fa più difficile.');}
 else L.buffer='';render();
}
function battleDoor(door){
 const L=S.localGame;if(!L||L.submitted||L.dead||L.battlePhase!=='choose'||door>L.doorCount||!L.alive.includes(S.uid))return;
 L.myDoor=door;
 const picks={};picks[S.uid]=door;
 for(const uid of L.alive){if(uid!==S.uid)picks[uid]=randomBetween(1,L.doorCount);}
 const beforeAlive=[...L.alive],hpAfter={...L.hp},aliveAfter=[...L.alive],events=[];
 const groups=new Map();
 for(const uid of beforeAlive){const d=picks[uid];if(!groups.has(d))groups.set(d,[]);groups.get(d).push(uid);}
 for(const [d,group] of groups){
  if(group.length<2)continue;
  const roll=randomBetween(1,6),targetIndex=(roll-1)%group.length,victim=group[targetIndex];
  const damage=randomBetween(3,7),hpBefore=hpAfter[victim]||0;hpAfter[victim]=Math.max(0,hpBefore-damage);
  const targetPlayer=S.players.find(p=>p.uid===victim);
  const event={door:d,group:[...group],roll,targetUid:victim,damage,hpBefore,hpAfter:hpAfter[victim],eliminated:hpAfter[victim]<=0,text:`Porta ${d}: dado ${roll}, bersaglio ${targetPlayer?.characterName||targetPlayer?.name||'Sfidante'} (-${damage} HP).`};
  events.push(event);
  if(hpAfter[victim]<=0){const ix=aliveAfter.indexOf(victim);if(ix>=0)aliveAfter.splice(ix,1);}
 }
 const finishedRound=L.round;let doorCountAfter=L.doorCount,removedDoor=null;
 if(finishedRound%3===0&&doorCountAfter>2){removedDoor=doorCountAfter;doorCountAfter--;}
 L.battlePicks=picks;L.battleEvents=events;L.battlePhase='reveal';L.rollFace=randomBetween(1,6);L.battleRevealAt=Date.now()+1900;
 L.battlePending={hpAfter,aliveAfter,doorCountAfter,removedDoor,doorCountBefore:L.doorCount,finishedRound};
 if(!events.length)L.log.push(`Round ${finishedRound}: nessuno ha condiviso una porta.`);
 render();
}
function makeConnectRound(L){
 const count=[6,10,18][L.level];const colors=shuffle(Array.from({length:COLORS.length},(_,i)=>i)).slice(0,count);
 L.availableColors=colors;L.mapping=colors.map((color,i)=>({color,sym:i}));L.targets=shuffle(Array.from({length:count},(_,i)=>i));L.done=0;L.lastFeedback='';
}
function connectColor(color){
 const L=S.localGame;if(!L||L.submitted)return;const target=L.targets[L.done], correct=L.mapping[target]?.color;
 if(Number(color)===correct){L.done++;L.lastFeedback='Giusto!';const count=[6,10,18][L.level];if(L.done>=count){if(L.level===2){const time=(Date.now()-L.startedAt)/1000;submitResult(Math.max(100,1800-time*2-L.errors*10),54-L.errors,{detail:{errors:L.errors}});return;}L.level++;makeConnectRound(L);notify(`Livello ${L.level+1}: ${[6,10,18][L.level]} colori!`);}render();}
 else{L.errors++;L.lastFeedback='Nope, riprova. Un errore ti costa tempo.';render();}
}
function drawUno(){
 if(currentGame()?.id==='tabelluno'){if(S.sharedGame?.type==='tabelluno')drawUnoShared(S.uid);return;}
 const L=S.localGame;if(!L||L.submitted||L.pendingColorGuess)return;L.draws++;
 const colors=['🔴','🔵','🟡','🟢'], n=randomBetween(0,9), special=choice(['num','num','num','reverse','block','plus2','plus2','skip','tornado']);
 let move=n,face=`${choice(colors)} ${n}`,desc=`Avanzi di ${n} caselle.`;
 if(special==='reverse'){move=1;face='🔄 CAMBIO GIRO';desc='Cambio giro! Avanzi di 1 casella.';}
 if(special==='block'){move=1;face='⛔ BLOCCO';desc='Avanzi di 1: scegli un avversario da bloccare.';L.pendingBlockTarget=true;}
 if(special==='plus2'){move=n+2;face=`${choice(colors)} +2`;desc=`+2: la carta ${n} ti fa avanzare di ${move}.`;}
 if(special==='skip'){move=0;face='🚫 SALTA';desc='Salti il turno successivo.';L.stuck[S.uid]=(L.stuck[S.uid]||0)+1;}
 if(special==='tornado'){move=0;face='🌪️ TORNADO';desc='Tornado! Rimani fermo per due turni.';L.stuck[S.uid]=(L.stuck[S.uid]||0)+2;}
 let pos=L.positions[S.uid]||0;if(L.stuck[S.uid]>0&&special!=='tornado'&&special!=='skip'){L.stuck[S.uid]--;move=0;desc='Eri bloccato: salti questo turno.';}
 pos=clamp(pos+move,0,43);
 const specialPos=pos;if([7,22,37].includes(specialPos)){pos=clamp(pos+2,0,43);desc+=' Casella +2!';}else if([10,28,35].includes(specialPos)){pos=clamp(pos-2,0,43);desc+=' Casella -2!';}else if(specialPos===16){L.stuck[S.uid]=(L.stuck[S.uid]||0)+2;desc+=' Tornado: fermi per due turni.';}
 L.positions[S.uid]=pos;L.lastCard={face,desc};L.lastText=desc;
 if(pos>=43){submitResult(1500+L.draws*10,43,{detail:{pos:43,draws:L.draws}});return;}
 if(L.pendingBlockTarget){L.lastText='Scegli il giocatore da bloccare per un turno.';render();return;}
 if([5,12,19,26,33,40].includes(pos)){
   L.pendingColorGuess={actual:choice(colors),number:randomBetween(0,9)};
   L.lastCard={face:'🎨 CAMBIACOLORE',desc:'Hai fermato la pedina su una casella CAMBIACOLORE.'};
   L.lastText='Indovina il colore della prossima carta: puoi avanzare del numero che esce oppure arretrare di 3.';
   render();return;
 }
 for(const p of S.players.filter(p=>p.uid!==S.uid&&L.positions[p.uid]<43)){
   if(L.stuck[p.uid]>0){L.stuck[p.uid]--;continue;}
   const aiMove=randomBetween(0,9);L.positions[p.uid]=clamp(L.positions[p.uid]+aiMove,0,43);
 }
 if(L.draws>=25){submitResult(pos*20+L.draws,pos,{detail:{pos,draws:L.draws}});return;}
 render();
}
function unoBlockTarget(uid){
 if(currentGame()?.id==='tabelluno'){if(S.sharedGame?.type==='tabelluno')unoBlockTargetShared(S.uid,String(uid));return;}
 const L=S.localGame;if(!L||L.submitted||!L.pendingBlockTarget||uid===S.uid)return;
 L.stuck[uid]=(L.stuck[uid]||0)+1;L.pendingBlockTarget=false;L.lastText=`Hai bloccato ${S.players.find(p=>p.uid===uid)?.name||'un avversario'} per un turno.`;
 L.lastCard={face:'⛔ BLOCCO',desc:L.lastText};
 const pos=L.positions[S.uid]||0;
 if([5,12,19,26,33,40].includes(pos)){
   L.pendingColorGuess={actual:choice(['🔴','🔵','🟡','🟢']),number:randomBetween(0,9)};
   L.lastText='Sei anche su CAMBIACOLORE: indovina il colore della prossima carta.';render();return;
 }
 for(const p of S.players.filter(p=>p.uid!==S.uid&&L.positions[p.uid]<43)){
   if(L.stuck[p.uid]>0){L.stuck[p.uid]--;continue;}
   L.positions[p.uid]=clamp(L.positions[p.uid]+randomBetween(0,9),0,43);
 }
 if(L.draws>=25){submitResult(pos*20+L.draws,pos,{detail:{pos,draws:L.draws}});return;}
 render();
}
function unoGuessColor(color){
 if(currentGame()?.id==='tabelluno'){if(S.sharedGame?.type==='tabelluno')unoGuessColorShared(S.uid,String(color));return;}
 const L=S.localGame;if(!L||L.submitted||!L.pendingColorGuess)return;
 const pending=L.pendingColorGuess;let pos=L.positions[S.uid]||0;
 if(color===pending.actual){pos=clamp(pos+pending.number,0,43);L.lastText=`Indovinato! La carta era ${pending.actual} ${pending.number}: avanzi di ${pending.number}.`;L.lastCard={face:`${pending.actual} ${pending.number}`,desc:L.lastText};}
 else{pos=clamp(pos-3,0,43);L.lastText=`Colore sbagliato: arretri di 3 caselle.`;L.lastCard={face:'❌ -3',desc:L.lastText};}
 L.positions[S.uid]=pos;L.pendingColorGuess=null;
 if(pos>=43){submitResult(1500+L.draws*10,43,{detail:{pos:43,draws:L.draws}});return;}
 for(const p of S.players.filter(p=>p.uid!==S.uid&&L.positions[p.uid]<43)){
   if(L.stuck[p.uid]>0){L.stuck[p.uid]--;continue;}
   L.positions[p.uid]=clamp(L.positions[p.uid]+randomBetween(0,9),0,43);
 }
 if(L.draws>=25){submitResult(pos*20+L.draws,pos,{detail:{pos,draws:L.draws}});return;}
 render();
}
function makeCatchTarget(L){const r=Math.random();L.target={x:8+Math.random()*84,y:12+Math.random()*76,type:r<.09?'trap':r>.87?'rare':'normal'};L.targetChangedAt=Date.now();}
function catchTarget(){
 const L=S.localGame;if(!L||L.submitted)return;
 if(Date.now()>=L.endsAt){submitResult(L.points,L.points);return;}
 if(L.target.type==='trap')L.points=Math.max(0,L.points-2);else L.points+=L.target.type==='rare'?3:1;
 L.hits++;makeCatchTarget(L);render();
}
function makeCups(L){const n=L.cupCount;L.bombs=shuffle(Array.from({length:n},(_,i)=>i)).slice(0,Math.min(n-1,2+Math.floor((L.round-1)/3)));L.reveal=false;L.showingBombs=true;L.shuffleAt=Date.now()+1600;L.selected=null;L.lastText='Memorizza le bombe: tra poco i bicchieri si mescolano.';setTimeout(()=>{if(S.localGame===L&&!L.submitted&&L.showingBombs){L.showingBombs=false;L.bombs=shuffle(Array.from({length:n},(_,i)=>i)).slice(0,Math.min(n-1,2+Math.floor((L.round-1)/3)));L.lastText='I bicchieri si sono mescolati: scegli quello sicuro.';render();}},1650);}
function cupPick(cup){
 const L=S.localGame;if(!L||L.submitted||L.selected!==null||L.showingBombs)return;L.selected=Number(cup);
 const danger=L.bombs.includes(L.selected);if(danger)L.lives--;
 L.reveal=true;L.lastText=danger?'BOOM! Hai perso una vita.':'Scelta sicura! Hai superato questo round.';
 render();
 if(L.lives<=0){setTimeout(()=>{if(S.localGame===L)submitResult(L.round*100,L.round,{detail:{round:L.round,lives:0}});},700);return;}
}
function cupNext(){const L=S.localGame;if(!L||L.submitted||L.selected===null)return;L.round++;makeCups(L);render();}

// ---------- Navicella: movimento con mouse/touch, ostacoli progressivi e PNG del personaggio ----------
function startSpaceLoop(){
 const canvas=$('#space-canvas');const L=S.localGame;if(!canvas||!L||L.id!=='space'||L.submitted||L.running===false)return;
 const ctx=canvas.getContext('2d');let w=0,h=0;
 const img=new Image();img.src=avatarImage(playerMe())||'';img.onerror=()=>{};
 const resize=()=>{const rect=canvas.getBoundingClientRect();w=Math.max(300,rect.width);h=Math.max(260,rect.height);const dpr=window.devicePixelRatio||1;canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);L.width=w;L.height=h;};resize();
 const move=e=>{const r=canvas.getBoundingClientRect();L.x=clamp((e.clientX-r.left)/r.width,.06,.94);};
 canvas.onpointermove=move;canvas.onpointerdown=move;window.onresize=resize;
 function frame(now){
   if(S.localGame!==L||L.submitted||S.room?.phase!=='active'||!L.running){S.spaceRAF=0;return;}
   const dt=Math.min(.04,(now-L.lastFrame)/1000||.016);L.lastFrame=now;
   const difficulty=1+(now-L.startedAt)/18000;
   L.distance+=dt*(14+difficulty*5);
   L.stars.forEach(s=>{s.y+=s.v*dt*difficulty;if(s.y>1){s.y=0;s.x=Math.random();}});
   if(now-L.lastSpawn>Math.max(260,900-difficulty*100)){L.meteors.push({x:Math.random()*.9+.05,y:-.05,r:randomBetween(8,15),v:(.28+Math.random()*.24)*difficulty});L.lastSpawn=now;}
   L.meteors.forEach(m=>m.y+=m.v*dt);L.meteors=L.meteors.filter(m=>m.y<1.1);
   const shipX=L.x*w, shipY=h-65;
   for(const m of L.meteors){if(now>L.invulnerableUntil&&Math.hypot(m.x*w-shipX,m.y*h-shipY)<m.r+19){L.lives--;L.invulnerableUntil=now+3000;m.y=2;if(L.lives<=0){L.running=false;submitResult(Math.round(L.distance+L.lives*100),Math.round(L.distance),{detail:{distance:Math.round(L.distance),lives:L.lives}});return;}}}
   if(now-L.startedAt>70000){L.running=false;submitResult(Math.round(L.distance+L.lives*150),Math.round(L.distance),{detail:{distance:Math.round(L.distance),lives:L.lives}});return;}
   ctx.clearRect(0,0,w,h);ctx.fillStyle='#11162b';ctx.fillRect(0,0,w,h);
   for(const s of L.stars){ctx.fillStyle=`rgba(235,241,255,${.25+s.s*.2})`;ctx.beginPath();ctx.arc(s.x*w,s.y*h,s.s,0,Math.PI*2);ctx.fill();}
   for(const m of L.meteors){ctx.fillStyle='#ff9d63';ctx.beginPath();ctx.arc(m.x*w,m.y*h,m.r,0,Math.PI*2);ctx.fill();ctx.fillStyle='#ffe4ad';ctx.beginPath();ctx.arc(m.x*w-m.r*.25,m.y*h-m.r*.2,m.r*.45,0,Math.PI*2);ctx.fill();}
   if(now>L.invulnerableUntil||Math.floor(now/100)%2===0){ctx.save();ctx.translate(shipX,shipY);ctx.fillStyle='#c8ff55';ctx.beginPath();ctx.moveTo(0,-28);ctx.lineTo(22,23);ctx.lineTo(0,14);ctx.lineTo(-22,23);ctx.closePath();ctx.fill();ctx.fillStyle='#ff5ba7';ctx.beginPath();ctx.moveTo(-8,19);ctx.lineTo(0,34+Math.random()*7);ctx.lineTo(8,19);ctx.closePath();ctx.fill();ctx.beginPath();ctx.arc(0,-1,13,0,Math.PI*2);ctx.fillStyle='#24273b';ctx.fill();if(img.complete&&img.naturalWidth){ctx.save();ctx.beginPath();ctx.arc(0,-1,11,0,Math.PI*2);ctx.clip();ctx.drawImage(img,-11,-12,22,22);ctx.restore();}else{ctx.fillStyle='#fff';ctx.font='16px sans-serif';ctx.textAlign='center';ctx.fillText('🙂',0,5);}ctx.restore();}
   const dm=$('#space-distance'),lm=$('#space-lives');if(dm)dm.textContent=Math.floor(L.distance);if(lm)lm.textContent='❤️'.repeat(Math.max(0,L.lives))||'0';
   S.spaceRAF=requestAnimationFrame(frame);
 }
 S.spaceRAF=requestAnimationFrame(frame);
}

// ---------- Click e input delegation ----------
root.addEventListener('click',async e=>{
 const el=e.target.closest('[data-action]');if(!el)return;const action=el.dataset.action;
 try{
  switch(action){
   case 'home':home();break;
   case 'set-name':{const value=($('#player-name')?.value||'').trim().replace(/\s+/g,' ').slice(0,18);if(value.length<2){notify('Scegli un nome di almeno 2 caratteri.');return;}S.name=value;localStorage.setItem('caos_name',value);setScreen('menu');break;}
   case 'go-menu':setScreen('menu');break;
   case 'go-setup':setScreen('setup');break;
   case 'go-join':setScreen('join');break;
   case 'go-browse':S.publicRooms=[];setScreen('browse');refreshRooms();break;
   case 'go-stats':S.screen='stats';await refreshStats();break;
   case 'create-room':await createRoom();break;
   case 'join-code':await joinRoom($('#room-code-input')?.value||'');break;
   case 'join-room':await joinRoom(el.dataset.code);break;
   case 'refresh-rooms':await refreshRooms();break;
   case 'refresh-stats':await refreshStats();break;
   case 'filter-char':S.characterFilter=el.dataset.filter;render();break;
   case 'select-char':await selectCharacter(el.dataset.id);break;
   case 'toggle-ready':await toggleReady();break;
   case 'copy-code':await navigator.clipboard.writeText(S.roomCode);notify('Codice copiato negli appunti.');break;
   case 'leave-room':await leaveRoom();break;
   case 'exit-closed':await leaveRoom();break;
   case 'ready-game':await readyGame();break;
   case 'memory-flip':memoryFlip(Number(el.dataset.index));break;
   case 'bomb-pass':bombPass();break;
   case 'choose-wire':chooseWire(Number(el.dataset.wire));break;
   case 'safe-digit':safeDigit(el.dataset.digit);break;
   case 'safe-clear':safeClear();break;
   case 'safe-try':safeTry();break;
   case 'battle-door':battleDoor(Number(el.dataset.door));break;
   case 'connect-color':connectColor(Number(el.dataset.color));break;
   case 'uno-draw':drawUno();break;
   case 'uno-guess-color':unoGuessColor(el.dataset.color);break;
   case 'uno-block-target':unoBlockTarget(el.dataset.uid);break;
   case 'catch-target':catchTarget();break;
   case 'cup-pick':cupPick(Number(el.dataset.cup));break;
   case 'cup-next':cupNext();break;
   case 'reveal-next':if(S.room?.hostUid===S.uid){const n=(S.room.finalStandings||[]).length;if((S.room.revealedCount||0)<n)await updateDoc(roomRef(),{revealedCount:(S.room.revealedCount||0)+1,finalRevealAt:Date.now()+1400});else await updateDoc(roomRef(),{phase:'final'});}else notify('L’host sta gestendo la rivelazione.');break;
   case 'show-final':if(S.room?.hostUid===S.uid)await updateDoc(roomRef(),{phase:'final'});else notify('Aspetta che l’host mostri la classifica completa.');break;
   case 'rematch':await rematch();break;
  }
 }catch(err){console.error(err);notify(friendlyError(err,'Qualcosa è andato storto.'));}
});
root.addEventListener('keydown',e=>{
 if(e.target.id==='player-name'&&e.key==='Enter') $('[data-action="set-name"]')?.click();
 if(e.target.id==='room-code-input'&&e.key==='Enter') $('[data-action="join-code"]')?.click();
 if(e.target.classList.contains('join-input')&&e.key==='Enter') $('[data-action="join-code"]')?.click();
});
root.addEventListener('input',e=>{if(e.target.id==='room-code-input')e.target.value=e.target.value.toUpperCase().replace(/[^A-Z0-9]/g,'');});

setInterval(()=>{
 updateTimerUI();
 if(S.room?.phase==='active'&&S.localGame&&!S.localGame.submitted){
   const L=S.localGame;
   publishCurrentProgress();
   if(S.room?.hostUid===S.uid)publishCpuProgresses();
   if(L.id==='battle')tickBattle();
   if(L.id==='bombpass')bombTick();
   if(L.id==='catch'&&Date.now()>=L.endsAt)submitResult(L.points,L.points,{detail:{hits:L.hits}});
  else if(L.id==='catch'&&Date.now()-L.targetChangedAt>1150){makeCatchTarget(L);render();}
  if(L.id==='cups'&&L.showingBombs&&Date.now()>=L.shuffleAt){L.showingBombs=false;render();}
   if(L.id==='memory'&&Date.now()>(S.room.gameDeadlineAt||Infinity))submitResult(L.matched.size,Math.floor(L.matched.size/2),{timeout:true});
   if(L.id==='safe'&&Date.now()>(S.room.gameDeadlineAt||Infinity))submitResult(L.safeRound*250,L.safeRound,{timeout:true});
   if(L.id==='connect'&&Date.now()>(S.room.gameDeadlineAt||Infinity))submitResult(L.level*200+L.done*10,L.done,{timeout:true});
 }
 if(S.room?.phase==='active'&&isSharedMinigame(currentGame()?.id)){tickSharedMinigame();if(currentGame().id==='bombpass')bombTick();}
 if(S.roomCode)heartbeat();
},500);
function updateTimerUI(){
 const node=$('#game-clock');if(node&&S.localGame){node.textContent=formatTime(Math.floor((Date.now()-S.localGame.startedAt)/1000));}
 const bombClock=$('#bomb-remaining');const fuseAt=S.sharedGame?.type==='bombpass'?S.sharedGame.bombAt:S.localGame?.bombAt;
 if(bombClock&&fuseAt){const secs=Math.max(0,Math.ceil((fuseAt-Date.now())/1000));bombClock.textContent=`${secs}s`;const bar=$('#bomb-fuse-bar');if(bar){const total=Math.max(1,((S.sharedGame?.bombAt||fuseAt)-(S.sharedGame?.roundStartedAt||S.sharedGame?.startedAt||S.localGame?.startedAt||Date.now()))/1000);bar.style.width=`${clamp(secs/total*100,0,100)}%`;}const label=$('#bomb-fuse-label');if(label)label.textContent=secs<=3?'STA PER ESPLODERE!':'MICCIA ACCESA';}
 if(S.localGame?.id==='battle'&&S.localGame.battlePhase==='reveal')$$('[data-battle-die]').forEach(n=>{n.textContent=String(randomBetween(1,6));});
 if(S.room?.phase==='countdown'||S.room?.phase==='gameCountdown'){
   const n=$('.countdown-number');if(n)n.textContent=Math.max(0,Math.ceil(((S.room.countdownEndsAt||Date.now())-Date.now())/1000));
 }
 if(S.screen==='room'&&['lobby','countdown'].includes(S.room?.phase)){
   const code=$('.room-code');if(code&&S.room.countdownEndsAt){};
 }
}

// Firebase Auth anonima: nessuna registrazione obbligatoria per giocare con gli amici.
try{
 await signInAnonymously(auth);
 onAuthStateChanged(auth,async user=>{
   if(!user)return;S.uid=user.uid;setConnection('FIREBASE ONLINE',true);
   if(S.name)S.screen='menu';syncHeader();render();
 });
}catch(err){console.error(err);setConnection('FIREBASE NON CONFIGURATO',false);root.innerHTML=`<section class="panel narrow"><h1>Firebase <span class="accent">non pronto.</span></h1><p class="muted">Non riesco ad accedere con autenticazione anonima. In Firebase Console abilita Authentication → Sign-in method → Anonymous e pubblica firestore.rules.</p><p class="helper">${safe(err.message||'Controlla la connessione e la configurazione Firebase.')}</p></section>`;}
