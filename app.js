import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, doc, getDoc, getDocs, setDoc, updateDoc, onSnapshot, runTransaction, serverTimestamp, query, where, limit } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* CONFIGURAZIONE DEL PROGETTO FIREBASE FORNITA DALL'UTENTE */
const firebaseConfig = {
  apiKey: "AIzaSyBrXTAOKGL0X76GBQ8Sdj4sBcYiEoKdhB0",
  authDomain: "mario-party-style-game.firebaseapp.com",
  projectId: "mario-party-style-game",
  storageBucket: "mario-party-style-game.firebasestorage.app",
  messagingSenderId: "443206292657",
  appId: "1:443206292657:web:ab633567201a700da4be90",
  measurementId: "G-93MF2N98C1"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const CHARACTERS = [
['g1','Gumball','Gumball','https://i.pinimg.com/736x/af/61/0f/af610f55e819f4bd3f37e5001a2b19ee.jpg'],
['g2','Gumball','Darwin','https://i.pinimg.com/1200x/5a/cf/9c/5acf9c886678411963046b04051e610e.jpg'],
['g3','Gumball','Anais','https://i.pinimg.com/736x/68/6f/3c/686f3c8f998bf2d90e5e4c294e007788.jpg'],
['g4','Gumball','Nicole','https://i.pinimg.com/736x/81/24/e4/8124e43da43e1d06dcdbca15f22a0cd9.jpg'],
['g5','Gumball','Sig.ra Robinson','https://i.pinimg.com/736x/ac/31/60/ac3160d1a5a50d7e95147b228e76f75c.jpg'],
['g6','Gumball','Barbara','https://i.pinimg.com/736x/08/38/28/0838283d8d82e79706028350d500bd7a.jpg'],
['dc1','Disventure Camp','Tom','https://i.pinimg.com/736x/db/d4/2a/dbd4a105be5cd57fa6a0ed9a8ab7df8.jpg'],
['dc2','Disventure Camp','Jake','https://i.pinimg.com/736x/09/cb/93/09cb935d20ccac3df1d95df305e3ff75.jpg'],
['dc3','Disventure Camp','Aiden','https://i.pinimg.com/736x/5a/d2/c3/5ad2c35deb3dccf1b841c7ef0b90d20d.jpg'],
['dc6','Disventure Camp','Spencer','https://i.pinimg.com/736x/1a/a6/94/1aa6d94e9b5e6f7a1b2d7d2d4b2f8d2e.jpg'],
['dc9','Disventure Camp','Fiore','https://i.pinimg.com/736x/97/ed/43/97ed439990f0819b9447b2288d17bf9.jpg'],
['dc10','Disventure Camp','Ashley','https://i.pinimg.com/736x/f4/12/54/f41254f60d4c222cf59e1abbb4b0ae99.jpg'],
['dc11','Disventure Camp','Tess','https://i.pinimg.com/736x/b4/0c/3a/b40c3ac96de25749753dee44ecb90196.jpg'],
['dc12','Disventure Camp','Rosa Maria','https://i.pinimg.com/736x/43/26/f6/4326f60c5e78b7f88d54fdb7baa60881.jpg'],
['s2','I Simpson','Lisa','https://i.pinimg.com/736x/81/68/de/8168de5a140ed669abfe5e2e4771b1b6.jpg'],
['s3','I Simpson','Bart','https://i.pinimg.com/1200x/03/11/09/031109591c66397c76e7489d42f3127d.jpg'],
['s4','I Simpson','Marge','https://i.pinimg.com/736x/77/6d/41/776d41748c4c9ae5940d8a9b10db881a.jpg'],
['s5','I Simpson','Maggie','https://i.pinimg.com/736x/12/f7/17/12f7172ecf515a362b967146399c883b.jpg'],
['sb1','Spongebob','Spongebob','https://i.pinimg.com/736x/08/9d/56/089d562f45d59b2f7e37e643a5ebf927.jpg'],
['sb2','Spongebob','Patrick','https://i.pinimg.com/736x/64/a3/f7/64a3f72a484c92329ba86e33263f2478.jpg'],
['sb5','Spongebob','Squiddi','https://i.pinimg.com/736x/f1/98/f3/f198f31f5a1d4f4e42c52a3026ca4137.jpg'],
['sb6','Spongebob','Plankton','https://i.pinimg.com/736x/af/f1/8b/aff18ba41f798ebe95ae1809410cbec9.jpg'],
['fop1','Duefantagenitori','Timmy','https://i.pinimg.com/1200x/d4/63/5d/d4635d14bb9b3759f41138ecd2eb1957.jpg'],
['fop2','Duefantagenitori','Cosmo','https://i.pinimg.com/736x/47/22/99/472299b4c669c052c662df1730403d83.jpg'],
['fop3','Duefantagenitori','Wanda','https://i.pinimg.com/736x/99/87/b79d555daf6e60f2c662df1730403d83.jpg'],
['fop4','Duefantagenitori','Vicky','https://i.pinimg.com/736x/60/c4/17/60c4178a696ba9ce13dd9cc6c93e67.jpg'],
['prin1','Principesse','Rosalinda','https://i.pinimg.com/736x/da/87/05/da87056e17f0b24989898b059a1b0560.jpg'],
['prin2','Principesse','Peach','https://i.pinimg.com/736x/98/65/39/986539a9ccd1408d51eb061df724377f.jpg'],
['prin3','Principesse','Elsa','https://i.pinimg.com/1200x/2f/bb/8b/2fbb8ba8053726318534824cf1a455d8.jpg'],
['prin4','Principesse','Biancaneve','https://i.pinimg.com/1200x/c0/c9/37/c0c9372a8b9bc91b3b8bcb1e1f1b1b1b.jpg'],
['prin5','Principesse','Vanellope','https://i.pinimg.com/1200x/99/e6/d4/99e6d42b2285d52ce58b348517c21059.jpg'],
['prin6','Principesse','Daisy','https://i.pinimg.com/736x/b5/b4/4f/b5b44fc92e50bcd1805d1e7ea2d1e579.jpg'],
['prin7','Principesse','Zelda','https://i.pinimg.com/736x/ee/5c/20/ee5c2037b8606f710537ff9742e1b1e6.jpg'],
['ad2','American Dad','Francine','https://i.pinimg.com/736x/95/f1/5d/95f15df1ead09d7f486f597670339b99.jpg'],
['ad3','American Dad','Hayley','https://i.pinimg.com/736x/ff/0a/68/ff0a68de85d1bd98e29be7c05860b437.jpg'],
['ad4','American Dad','Roger','https://i.pinimg.com/1200x/26/68/1a/26681ade5ccae3524acf2a203e19b6ac.jpg'],
['sm1','Super Mario','Mario','https://i.pinimg.com/736x/be/2d/98/be2d98feb1899ffa3d713423b50cbb98.jpg'],
['sm2','Super Mario','Luigi','https://i.pinimg.com/736x/ed/f2/f6/edf2f6063d11ab84570572a42beba223.jpg'],
['sm3','Super Mario','Wario','https://i.pinimg.com/736x/d1/dc/2f/d1dc2f211895104743fce7407d5d90df.jpg'],
['sm4','Super Mario','Waluigi','https://i.pinimg.com/736x/68/2b/61/682b611cb8b1b9eca045cc801e5ed25f.jpg'],
['sm5','Super Mario','Yoshi','https://i.pinimg.com/736x/f3/05/7f/f3057f14de68b0afe682ffe93dcc479b.jpg'],
['sm9','Super Mario','Goomba','https://i.pinimg.com/736x/de/d4/cc/ded4ccf551346be050aa182dfc1f890.jpg'],
['ig3','I Griffin','Stewie','https://i.pinimg.com/736x/f3/05/30/f30530fb1e9e118e7f66568d82c05bc5.jpg'],
['ig4','I Griffin','Meg','https://i.pinimg.com/1200x/fc/08/05/fc080502466c0c9a0d48433022fe507d.jpg'],
['ig5','I Griffin','Quagmire','https://i.pinimg.com/736x/9c/ab/ba/9cabba30d1f8cfbc11c8c9e7d1c0566f.jpg'],
['su1','Steven Universe','Steven','https://i.pinimg.com/736x/13/7e/1f/137f1e1f1b9b7c3e5f4e5d6c7b8a9a0b.jpg'],
['su2','Steven Universe','Perla','https://i.pinimg.com/736x/72/72/8d/72728d693439a74022d978b5fdedc12e.jpg'],
['su3','Steven Universe','Ametista','https://i.pinimg.com/736x/b7/7c/24/b77c240460645834ca641472d91d24f6.jpg'],
['su4','Steven Universe','Garnet','https://i.pinimg.com/736x/c7/d6/04/c7d6048b7101041d4a8a94b4e1f1b1b1b.jpg'],
['su5','Steven Universe','Lapis','https://i.pinimg.com/1200x/09/fb/12/09fb12467957da96913fc8f75e6f6356.jpg'],
['su6','Steven Universe','Peridot','https://i.pinimg.com/736x/2b/5d/13/2b5d132d544a18b864861d9026bf135d.jpg'],
['su7','Steven Universe','Jasper','https://i.pinimg.com/1200x/4c/6b/20/4c6b20ef533c1343eed1702288d17cf4.jpg']
].map(([id,cat,name,img])=>({id,cat,name,img}));

const GAMES = [
{id:'memory',name:'Memory',emoji:'🧠',desc:'Trova tutte le coppie prima degli altri. Se sbagli, aspetta due secondi prima di riprovare.',mode:'race'},
{id:'bomb',name:'Passa la bomba',emoji:'💣',desc:'Passa la bomba quando ce l’hai in testa. Se provi a passarla senza averla, rimani stordito. Sopravvivi all’esplosione!',mode:'survival'},
{id:'pistons',name:'Taglia il filo',emoji:'🔨',desc:'Una sola sfida per tutti: a turno scegli un pistone. Se sei salvo, passa il turno al prossimo. L’incudine può cadere in qualsiasi momento.',mode:'survival'},
{id:'safe',name:'Cassaforte infernale',emoji:'🔐',desc:'Indovina la combinazione usando gli indizi: verde significa numero e posizione corretti, giallo significa numero presente ma posizione sbagliata.',mode:'race'},
{id:'battle',name:'Battle Royale',emoji:'🚪',desc:'Scegli una porta. Solo una sarà quella di combattimento: chi la condivide dovrà lanciare il dado a turno e scegliere un bersaglio nella stessa porta.',mode:'survival'},
{id:'dots',name:'Collega i puntini',emoji:'🎨',desc:'Associa ogni simbolo al suo colore. Tre round sempre più difficili: 6, 10 e 18 colori.',mode:'race'},
{id:'uno',name:'tabellUNO',emoji:'🃏',desc:'Corri sul tabellone con le carte UNO: numeri, cambi giro, blocchi e caselle speciali possono ribaltare la partita.',mode:'race'},
{id:'space',name:'Viaggio nello spazio',emoji:'🚀',desc:'Guida la tua navicella evitando gli asteroidi. Hai tre vite: sopravvivi più a lungo degli altri.',mode:'survival'},
{id:'catch',name:'Acchiappa tutto!',emoji:'🧲',desc:'Raccogli gli oggetti che cadono e schiva quelli pericolosi. Più ne prendi, più punti ottieni.',mode:'score'},
{id:'reflex',name:'Riflessi',emoji:'⚡',desc:'Colpisci i bersagli appena appaiono. Quelli rari valgono tre punti, le trappole ne tolgono due.',mode:'score'},
{id:'cups',name:'Bomba sotto il bicchiere',emoji:'🥤',desc:'Segui i bicchieri dopo il mescolamento e scegli quello senza bomba. Hai tre vite: ogni round diventa più difficile.',mode:'survival'},
{id:'hide',name:'1, 2, 3… nascondino!',emoji:'🙈',desc:'A ogni round cambia il cacciatore. Nasconditi in una delle otto figure e spera che non ti trovi!',mode:'score'}
];
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const state={name:'',pid:localStorage.getItem('cp_pid')||crypto.randomUUID(),roomId:null,room:null,isHost:false,selected:null,unsubscribe:null,roomUnsub:null,players:[],gameIndex:0,gameOrder:[],game:null,ready:false,gameReady:new Set(),scores:{},miniScores:{},stats:JSON.parse(localStorage.getItem('cp_stats')||'{"wins":0,"podiums":0,"games":0,"characters":{},"miniWins":{}}'),activeTimer:null,gameData:{},locked:false};
localStorage.setItem('cp_pid',state.pid);
const imgFallback='data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100%" height="100%" fill="#393052"/><text x="50%" y="55%" font-size="38" text-anchor="middle" fill="white">★</text></svg>');
function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2300)}
function showScreen(id){$$('.screen').forEach(s=>s.classList.toggle('active',s.id===id));window.scrollTo({top:0,behavior:'smooth'})}
function char(id){return CHARACTERS.find(c=>c.id===id)||CHARACTERS[0]}
function img(src,alt=''){return `<img src="${src}" alt="${alt}" onerror="this.onerror=null;this.src='${imgFallback}'">`}
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function code(){return Math.random().toString(36).slice(2,8).toUpperCase()}
function me(){return state.players.find(p=>p.pid===state.pid)}
function sortScores(){return [...state.players].sort((a,b)=>(state.scores[b.pid]||0)-(state.scores[a.pid]||0))}
function pointsForPlace(place,n){const arr=[12,10,8,7,6,5,4,3,2,1];const table=arr.slice(Math.max(0,10-n));return table[Math.max(0,Math.min(place,table.length-1))]??1}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function updateConnection(ok,msg){$('#connection').innerHTML=`<i style="background:${ok?'#80ed99':'#ffd166'}"></i> ${msg}`}
function persistStats(){localStorage.setItem('cp_stats',JSON.stringify(state.stats))}
function buildCharacterGrid(){
 const taken=new Set(state.players.filter(p=>p.pid!==state.pid).map(p=>p.characterId));
 $('#characterGrid').innerHTML=CHARACTERS.map(c=>{const isTaken=taken.has(c.id),sel=state.selected===c.id;return `<button class="character-card ${isTaken?'taken':''} ${sel?'selected':''}" data-char="${c.id}" ${isTaken?'disabled':''}>${img(c.img,c.name)}<span>${escapeHtml(c.name)}</span>${sel?'<i class="check">✓</i>':''}</button>`}).join('');
 $('#characterCount').textContent=`${CHARACTERS.length-taken.size} disponibili`;
 $$('.character-card').forEach(b=>b.onclick=()=>selectCharacter(b.dataset.char));
}
async function selectCharacter(id){
 if(state.players.some(p=>p.characterId===id&&p.pid!==state.pid))return toast('Questo personaggio è già stato scelto!');
 state.selected=id;
 const player={pid:state.pid,name:state.name,characterId:id,bot:false,ready:false,score:state.scores[state.pid]||0};
 const existing=state.players.find(p=>p.pid===state.pid);
 if(existing)Object.assign(existing,player);else state.players.push(player);
 buildCharacterGrid();renderRoster();
 $('#readyBtn').disabled=false;$('#readyBtn').textContent='Sono pronto ✓';
 if(state.roomId) await writeRoomPlayers();
}
function renderRoster(){
 $('#rosterCount').textContent=`${state.players.length}/${state.room?.maxPlayers||6}`;
 $('#rosterList').innerHTML=state.players.map(p=>{const c=char(p.characterId);return `<div class="roster-item">${img(c.img,c.name)}<div><b>${escapeHtml(p.name)}</b><small>${p.bot?'CPU':p.pid===state.pid?'Tu':'Giocatore'} · ${c.name}</small></div><span class="status">${p.ready?'PRONTO':'IN ATTESA'}</span></div>`}).join('');
 const humans=state.players.filter(p=>!p.bot);$('#lobbyStatus').textContent=`${humans.filter(p=>p.ready).length}/${humans.length} giocatori pronti`;
 $('#startBtn').classList.toggle('hidden',!state.isHost);
}
async function writeRoomPlayers(){
 if(!state.roomId)return;
 try{await updateDoc(doc(db,'rooms',state.roomId),{players:state.players,updatedAt:serverTimestamp()})}catch(e){console.warn(e);toast('Non riesco a sincronizzare la stanza. Controlla le regole Firestore.')}
}
async function createRoom(){
 const maxPlayers=Number($('#playersCount').value),numGames=Number($('#gamesCount').value),fillBots=$('#fillBots').checked,isPublic=$('#publicRoom').checked;
 state.roomId=code();state.isHost=true;state.selected=null;state.scores={};state.gameIndex=0;
 state.room={maxPlayers,numGames,fillBots,isPublic,status:'waiting',hostPid:state.pid,players:[],gameOrder:shuffle(GAMES.map(g=>g.id)).slice(0,numGames),createdAt:Date.now()};
 state.players=[];state.scores={};
 try{await setDoc(doc(db,'rooms',state.roomId),{...state.room,players:[],createdAt:serverTimestamp(),updatedAt:serverTimestamp()});updateConnection(true,'Firebase connesso')}
 catch(e){console.error(e);toast('Firebase non è pronto: verificare Firestore e le regole. Modalità locale attiva.');updateConnection(false,'Modalità locale');}
 $('#roomCode').textContent=state.roomId;buildCharacterGrid();renderRoster();showScreen('lobby');listenRoom();
}
async function joinRoomByCode(id){
 id=(id||'').trim().toUpperCase();if(!id)return toast('Inserisci un codice stanza');
 try{
  const snap=await getDoc(doc(db,'rooms',id));if(!snap.exists())return toast('Stanza non trovata');
  const room=snap.data();if(room.status!=='waiting')return toast('Questa partita è già iniziata');
  if((room.players||[]).length>=room.maxPlayers)return toast('La stanza è piena');
  state.roomId=id;state.room=room;state.isHost=room.hostPid===state.pid;state.players=room.players||[];state.selected=null;
  if(!state.players.some(p=>p.pid===state.pid))state.players.push({pid:state.pid,name:state.name,characterId:null,bot:false,ready:false,score:0});
  $('#roomCode').textContent=id;buildCharacterGrid();renderRoster();showScreen('lobby');listenRoom();await writeRoomPlayers();
 }catch(e){toast('Impossibile entrare. Controlla la configurazione Firestore.');console.error(e)}
}
function listenRoom(){
 if(state.roomUnsub)state.roomUnsub();
 if(!state.roomId)return;
 state.roomUnsub=onSnapshot(doc(db,'rooms',state.roomId),snap=>{
  if(!snap.exists())return;
  const d=snap.data();state.room={...state.room,...d};state.players=d.players||state.players;
  if(d.scores)state.scores=d.scores;
  if(d.status==='playing'&&state.isHost===false&&$('#lobby').classList.contains('active')){state.gameIndex=d.gameIndex||0;showIntro()}
  if($('#lobby').classList.contains('active')){buildCharacterGrid();renderRoster()}
  updateConnection(true,'Multiplayer connesso');
 },e=>{console.warn(e);updateConnection(false,'Connessione da verificare')});
}
async function readyToggle(){
 if(!state.selected)return toast('Scegli prima il tuo personaggio');
 const p=me();if(!p)return;
 p.ready=!p.ready;await writeRoomPlayers();renderRoster();
 if(p.ready&&state.isHost)toast('Sei pronto! Avvia quando tutti ci sono.');
 if(p.ready&&!state.isHost)toast('Pronto! Aspettiamo l’host.');
}
async function startMatch(){
 if(!state.isHost)return;
 const humans=state.players.filter(p=>!p.bot);
 if(humans.length<1)return toast('Serve almeno un giocatore.');
 if(humans.some(p=>!p.characterId))return toast('Tutti devono scegliere un personaggio.');
 if(humans.some(p=>!p.ready))return toast('Aspetta che tutti i giocatori umani siano pronti.');
 if(state.room.fillBots){
  const used=new Set(state.players.map(p=>p.characterId));const available=shuffle(CHARACTERS.filter(c=>!used.has(c.id)));
  while(state.players.length<state.room.maxPlayers&&available.length){const c=available.pop();state.players.push({pid:'bot_'+crypto.randomUUID(),name:botName(c.name),characterId:c.id,bot:true,ready:true,score:0,personality:Math.random()})}
 }
 state.gameOrder=state.room.gameOrder||shuffle(GAMES.map(g=>g.id)).slice(0,state.room.numGames);state.scores={};state.players.forEach(p=>state.scores[p.pid]=0);
 state.gameIndex=0;state.room.status='playing';
 try{await updateDoc(doc(db,'rooms',state.roomId),{players:state.players,status:'playing',scores:state.scores,gameIndex:0,gameOrder:state.gameOrder})}catch(e){console.warn(e)}
 showIntro();
}
function botName(c){return c+' CPU'}
function currentGame(){return GAMES.find(g=>g.id===state.gameOrder[state.gameIndex])||GAMES[0]}
function showIntro(){
 state.game=currentGame();state.gameReady=new Set();state.ready=false;
 $('#gameRound').textContent=`MINIGIOCO ${state.gameIndex+1}/${state.gameOrder.length}`;
 $('#gamePlayers').textContent=`${state.players.length} SFIDANTI`;
 $('#introEmoji').textContent=state.game.emoji;$('#introTitle').textContent=state.game.name;$('#introDesc').textContent=state.game.desc;
 $('#introRoster').innerHTML=state.players.map(p=>`<div class="intro-player">${img(char(p.characterId).img,p.name)}${escapeHtml(p.name)}</div>`).join('');
 $('#introReady').disabled=false;$('#introReady').textContent='Sono pronto ✓';$('#readyStatus').textContent='In attesa degli altri giocatori…';showScreen('gameIntro');
 if(state.isHost){state.players.filter(p=>p.bot).forEach(p=>state.gameReady.add(p.pid));}
}
async function introReady(){
 state.gameReady.add(state.pid);$('#introReady').disabled=true;$('#introReady').textContent='Sei pronto ✓';
 $('#readyStatus').textContent=`${state.gameReady.size}/${state.players.length} pronti`;
 // Shared ready state supports online clients; host starts once all current participants are ready.
 try{await updateDoc(doc(db,'rooms',state.roomId),{gameReady:[...state.gameReady]})}catch(e){}
 if(state.isHost)maybeStartGame();
}
function maybeStartGame(){
 const humans=state.players.filter(p=>!p.bot);
 if(humans.every(p=>state.gameReady.has(p.pid))){setTimeout(()=>startMinigame(),1500)}
}
let gameInterval=null,gameTimeouts=[];
function clearGameTimers(){if(gameInterval)clearInterval(gameInterval);gameTimeouts.forEach(clearTimeout);gameTimeouts=[];gameInterval=null}
function later(fn,ms){const t=setTimeout(fn,ms);gameTimeouts.push(t);return t}
function startMinigame(){
 clearGameTimers();state.locked=false;state.miniScores={};state.players.forEach(p=>state.miniScores[p.pid]=0);state.gameData={};
 $('#gameTitle').textContent=state.game.name;$('#gameEyebrow').textContent=`MINIGIOCO ${state.gameIndex+1} · ${state.game.emoji}`;$('#gameClock').textContent='00:30';showScreen('game');
 renderLeaderboards();const id=state.game.id;
 if(id==='memory')initMemory();else if(id==='safe')initSafe();else if(id==='dots')initDots();else if(id==='pistons')initPistons();else if(id==='battle')initBattle();else if(id==='bomb')initBomb();else if(id==='reflex'||id==='catch')initTargets(id);else if(id==='cups')initCups();else if(id==='space')initSpace();else if(id==='uno')initUno();else if(id==='hide')initHideSeek();
 if(state.isHost)try{updateDoc(doc(db,'rooms',state.roomId),{gameIndex:state.gameIndex,gameId:id,gameStatus:'active',gameStartedAt:Date.now()})}catch(e){}
}
function renderLeaderboards(){
 const rows=(arr,vals)=>[...arr].sort((a,b)=>(vals[b.pid]||0)-(vals[a.pid]||0)).map((p,i)=>`<div class="score-row">${img(char(p.characterId).img,p.name)}<div><b>${escapeHtml(p.name)}</b><small>${i===0?'In testa':p.bot?'CPU':'In gara'}</small></div><span class="score-num">${Number(vals[p.pid]||0).toLocaleString('it-IT')}</span></div>`).join('');
 $('#miniLeaderboard').innerHTML=rows(state.players,state.miniScores);$('#totalLeaderboard').innerHTML=rows(state.players,state.scores);
}
function setMiniScore(pid,val){if(!pid)return;const n=Number(val);state.miniScores[pid]=Number.isFinite(n)?Math.round(n*10)/10:0;renderLeaderboards()}
function finishGame(reason='Sfida completata!'){
 if(state.locked)return;state.locked=true;clearGameTimers();
 // Le gare a completamento e Battle Royale hanno un ordine di piazzamento esplicito.
 if(state.game?.id==='battle'&&!Array.isArray(state.gameData?.completionOrder)){
   state.gameData.completionOrder=[...(state.gameData.alive||[]),...(state.gameData.eliminationOrder||[]).slice().reverse()];
 }
 const completionOrder=state.gameData?.completionOrder;
 const hasCompletionRanking=['memory','safe','dots','battle'].includes(state.game?.id)&&Array.isArray(completionOrder)&&completionOrder.length>0;
 const ordered=[...state.players].sort((a,b)=>{
   if(hasCompletionRanking){
     const ai=completionOrder.indexOf(a.pid),bi=completionOrder.indexOf(b.pid);
     if(ai>=0&&bi>=0)return ai-bi;
     if(ai>=0)return -1;
     if(bi>=0)return 1;
   }
   return (state.miniScores[b.pid]||0)-(state.miniScores[a.pid]||0)||a.name.localeCompare(b.name);
 });
 const awards={};let i=0;
 while(i<ordered.length){
   let j=i+1;const value=Number(state.miniScores[ordered[i].pid]||0);
   if(hasCompletionRanking){
     // Finishers have distinct places by finish order. Only unfinished players can tie on progress.
     const currentFinished=completionOrder.includes(ordered[i].pid);
     if(!currentFinished)while(j<ordered.length&&!completionOrder.includes(ordered[j].pid)&&Number(state.miniScores[ordered[j].pid]||0)===value)j++;
   }else{
     while(j<ordered.length&&Number(state.miniScores[ordered[j].pid]||0)===value)j++;
   }
   const pts=pointsForPlace(i,state.players.length);for(let k=i;k<j;k++){awards[ordered[k].pid]=pts;state.scores[ordered[k].pid]=(state.scores[ordered[k].pid]||0)+pts}i=j;
 }
 $('#resultTitle').textContent=state.game.name+' — risultati';
 const podium=ordered.slice(0,3);$('#resultPodium').innerHTML=podium.map((p,i)=>`<div class="podium-card ${i===0?'first':''}"><div>${['🥇','🥈','🥉'][i]}</div>${img(char(p.characterId).img,p.name)}<b>${escapeHtml(p.name)}</b><strong>${Number(state.miniScores[p.pid]||0).toLocaleString('it-IT')} pt</strong></div>`).join('');
 $('#resultTable').innerHTML=ordered.map((p,i)=>`<div class="result-line">${img(char(p.characterId).img,p.name)}<div><b>${i+1}. ${escapeHtml(p.name)}</b><small>+${awards[p.pid]} punti in classifica${i>0&&Number(state.miniScores[p.pid]||0)===Number(state.miniScores[ordered[i-1].pid]||0)?' · pari merito':''}</small></div><strong>${state.scores[p.pid]} pt</strong></div>`).join('');
 $('#nextGame').textContent=state.gameIndex+1>=state.gameOrder.length?'Scopri la classifica finale →':'Prossima sfida →';
 // Le statistiche personali sono locali: aggiorniamo solo per l'utente corrente e una volta per minigioco.
 state.stats.games++;if(Number(state.miniScores[state.pid]||0)===Number(state.miniScores[ordered[0]?.pid]||0)){state.stats.miniWins[state.game.name]=(state.stats.miniWins[state.game.name]||0)+1}
 if(ordered.findIndex(p=>p.pid===state.pid)<3)state.stats.podiums++;
 if(me())state.stats.characters[char(me().characterId).name]=(state.stats.characters[char(me().characterId).name]||0)+1;persistStats();
 if(state.isHost)updateDoc(doc(db,'rooms',state.roomId),{scores:state.scores,lastResults:ordered.map(p=>({pid:p.pid,score:state.miniScores[p.pid]||0,points:awards[p.pid],total:state.scores[p.pid]})),gameStatus:'results'}).catch(e=>console.warn('Salvataggio risultati:',e));
 showScreen('results');
}
function countdown(seconds,done){let n=seconds;$('#gameClock').textContent='00:'+String(n).padStart(2,'0');gameInterval=setInterval(()=>{n--;$('#gameClock').textContent='00:'+String(Math.max(0,n)).padStart(2,'0');if(n<=0){clearInterval(gameInterval);done()}},1000)}
function botThink(p,base=1400){const skill=Math.max(0,Math.min(1,Number(p?.personality??0.5)));return Math.round(base+(1-skill)*1800+Math.random()*850)}
function botSkill(p){return Math.max(0.08,Math.min(0.96,Number(p?.personality??0.5)))}
function botScoreLoop(maxScore,base=1800){state.players.filter(p=>p.bot).forEach(p=>{let n=0;const tick=()=>{if(state.locked||n>=maxScore)return;n++;setMiniScore(p.pid,n);later(tick,botThink(p,base))};later(tick,botThink(p,base))})}
// Le gare a completamento restano aperte finché tutti tranne uno hanno concluso.
// L'ordine di completamento viene usato per assegnare la classifica, non il solo punteggio parziale.
function recordRaceFinish(pid, reason='Sfida completata!'){
 const d=state.gameData;if(state.locked||!pid||!d)return;
 if(!Array.isArray(d.completionOrder))d.completionOrder=[];
 if(!d.completionOrder.includes(pid))d.completionOrder.push(pid);
 const done=d.completionOrder.length,total=state.players.length;
 $('#gameMessage').textContent=`${state.players.find(p=>p.pid===pid)?.name||'Un giocatore'} ha completato la sfida (${done}/${total}). Si continua finché tutti tranne uno hanno terminato.`;
 if(done>=Math.max(1,total-1))finishGame(reason);
}
function initMemory(){
 const symbols=['🍓','🍋','🍇','🍉','🍒','🥝','🍍','🥥','🍑','🍊','🍎','🍐','🥑','🍪','🍩','🍰','🧁','🍿'];let cards=shuffle([...symbols,...symbols]).map((v,i)=>({v,i,open:false,matched:false}));
 state.gameData={cards,found:0,tries:0,blocked:false,completionOrder:[]};$('#gameStage').innerHTML=`<div class="stage-title">Trova le 18 coppie · <span id="memoryFound">0</span>/18 coppie</div><div id="memoryGrid" class="memory-grid">${cards.map(c=>`<button class="memory-card" data-index="${c.i}">?</button>`).join('')}</div>`;
 $('#memoryGrid').querySelectorAll('button').forEach(b=>b.onclick=()=>memoryFlip(Number(b.dataset.index)));
 $('#gameMessage').textContent='Gira due carte alla volta. Se sbagli, aspetta 2 secondi.';
 // Ogni CPU ha un proprio tabellone e una memoria parziale delle carte viste.
 state.players.filter(p=>p.bot).forEach(p=>runMemoryBot(p));
 countdown(120,()=>finishGame('Tempo scaduto'));
}
function runMemoryBot(p){
 const symbols=['🍓','🍋','🍇','🍉','🍒','🥝','🍍','🥥','🍑','🍊','🍎','🍐','🥑','🍪','🍩','🍰','🧁','🍿'];
 const board=shuffle([...symbols,...symbols]),memory=new Map();let found=new Set(),turns=0;const skill=botSkill(p);
 const step=()=>{if(state.locked||found.size>=36)return;turns++;
   // Dimentica parte delle carte note: abilità più alta = memoria più stabile.
   for(const [idx,val] of memory)if(Math.random()>(.45+skill*.5))memory.delete(idx);
   const remaining=board.map((v,i)=>i).filter(i=>!found.has(i));let first=-1,second=-1;
   const knownByValue=new Map();for(const [idx,val] of memory){if(found.has(idx))continue;if(!knownByValue.has(val))knownByValue.set(val,[]);knownByValue.get(val).push(idx)}
   const pair=[...knownByValue.values()].find(a=>a.length>=2);
   if(pair){[first,second]=pair.slice(0,2)}else{
     const unknown=remaining.filter(i=>!memory.has(i));first=(unknown.length?unknown:remaining)[Math.floor(Math.random()*(unknown.length?unknown:remaining).length)];
     memory.set(first,board[first]);const match=remaining.find(i=>i!==first&&board[i]===board[first]&&memory.has(i));
     if(match!==undefined)second=match;else{const pool=remaining.filter(i=>i!==first);second=pool[Math.floor(Math.random()*pool.length)];memory.set(second,board[second]);}
   }
   if(board[first]===board[second]){found.add(first);found.add(second);memory.delete(first);memory.delete(second)}
   setMiniScore(p.pid,found.size/2);
   if(found.size===36){setMiniScore(p.pid,Math.max(1,30-turns/10));recordRaceFinish(p.pid, 'Memory completato!');return}
   later(step,botThink(p,900)+(Math.random()<.2?700:0));
 };later(step,botThink(p,2200));
}
function memoryFlip(i){
 const d=state.gameData,c=d.cards[i];if(state.locked||d.blocked||c.open||c.matched)return;
 c.open=true;const btn=$(`#memoryGrid [data-index="${i}"]`);btn.textContent=c.v;btn.classList.add('open');d.tries++;
 const opened=d.cards.filter(x=>x.open&&!x.matched);
 if(opened.length===2){if(opened[0].v===opened[1].v){opened.forEach(x=>{x.matched=true;const b=$(`#memoryGrid [data-index="${x.i}"]`);b.classList.add('matched');b.disabled=true});d.found++;setMiniScore(state.pid,d.found);$('#memoryFound').textContent=d.found;if(d.found===18){setMiniScore(state.pid,Math.max(1,30-d.tries/10));recordRaceFinish(state.pid,'Memory completato!')} }
 else{d.blocked=true;later(()=>{opened.forEach(x=>{x.open=false;const b=$(`#memoryGrid [data-index="${x.i}"]`);b.textContent='?';b.classList.remove('open')});d.blocked=false},2000)}}
}
function initSafe(){
 state.gameData={round:1,length:3,secret:[],attempts:0,solved:false,roundsSolved:0,totalAttempts:0,startedAt:Date.now(),completionOrder:[]};newSafeRound();
 // CPU solve their own generated combinations; skill affects success probability and time, not a free score counter.
 state.players.filter(p=>p.bot).forEach(p=>runSafeBot(p));
 countdown(120,()=>finishGame('Tempo scaduto alla cassaforte!'));
}
function newSafeRound(){
 const d=state.gameData;if(state.locked)return;d.length=Math.min(3+d.round-1,6);d.secret=Array.from({length:d.length},()=>Math.floor(Math.random()*10));d.attempts=0;d.solved=false;d.input=[];
 $('#gameStage').innerHTML=`<div class="stage-title">ROUND ${d.round}/4 · Codice di ${d.length} cifre · massimo 12 tentativi</div><div id="safeSlots" class="code-slots">${Array.from({length:d.length},()=>'<div class="code-slot">·</div>').join('')}</div><div id="safeHistory"></div><div class="keypad">${Array.from({length:10},(_,i)=>`<button data-num="${i}">${i}</button>`).join('')}</div><div class="action-grid"><button id="safeClear" class="btn ghost">Cancella</button><button id="safeEnter" class="btn primary">Conferma codice</button></div><div class="stage-title" id="safeStatus">Round risolti: ${d.roundsSolved}/4 · Tentativi: 0/12</div>`;
 $$('#gameStage [data-num]').forEach(b=>b.onclick=()=>{if(d.input.length<d.length&&!d.solved)d.input.push(Number(b.dataset.num));renderSafeInput()});$('#safeClear').onclick=()=>{d.input=[];renderSafeInput()};$('#safeEnter').onclick=submitSafe;
 $('#gameMessage').textContent='Verde = cifra e posizione giuste · Giallo = cifra presente ma posizione sbagliata. Ogni round ha massimo 12 tentativi.';
}
function safeFeedback(secret,guess){
 const s=String(secret),g=String(guess),used=Array(s.length).fill(false),out=Array(g.length).fill('');
 for(let i=0;i<g.length;i++)if(g[i]===s[i]){out[i]='G';used[i]=true}
 for(let i=0;i<g.length;i++){if(out[i])continue;const j=s.split('').findIndex((digit,k)=>digit===g[i]&&!used[k]);if(j>=0){out[i]='Y';used[j]=true}else out[i]='-'}
 return out.join('');
}
function runSafeBot(p){
 let round=0,score=0;const lengths=[3,4,5,6],skill=botSkill(p);
 const solveRound=()=>{
  if(state.locked||round>=4)return;const len=lengths[round],secret=Array.from({length:len},()=>Math.floor(Math.random()*10)).join('');
  // Candidate-based Mastermind: CPU filters possible codes using green/yellow feedback.
  const cap=Math.min(Math.round(1450-skill*1100),10**len),candidates=new Set([secret]);while(candidates.size<cap)candidates.add(Array.from({length:len},()=>Math.floor(Math.random()*10)).join(''));
  let attempts=0,solved=false;
  const guessStep=()=>{if(state.locked)return;attempts++;const list=[...candidates];const guess=list[Math.floor(Math.random()*list.length)]||Array.from({length:len},()=>Math.floor(Math.random()*10)).join('');
    if(guess===secret)solved=true;else{const clue=safeFeedback(secret,guess);for(const candidate of list)if(safeFeedback(candidate,guess)!==clue)candidates.delete(candidate);if(!candidates.size)candidates.add(secret)}
    if(solved||attempts>=12){if(solved)score+=10;score=Math.max(0,score-attempts*.2);setMiniScore(p.pid,Math.round(score*10)/10);round++;if(round>=4){recordRaceFinish(p.pid,'Cassaforte completata!');return}later(solveRound,botThink(p,500));return}
    later(guessStep,botThink(p,450));
  };later(guessStep,botThink(p,900));
 };later(solveRound,botThink(p,1700));
}
function renderSafeInput(){$$('#safeSlots .code-slot').forEach((el,i)=>el.textContent=state.gameData.input[i]??'·')}
function submitSafe(){
 const d=state.gameData;if(d.solved||d.input.length!==d.length)return toast('Inserisci tutte le cifre');
 const guess=d.input,used=d.secret.map(()=>false),colors=guess.map((n,i)=>n===d.secret[i]?'green':'');
 guess.forEach((n,i)=>{if(colors[i]){used[i]=true;return}const j=d.secret.findIndex((v,k)=>v===n&&!used[k]);if(j>=0){colors[i]='yellow';used[j]=true}});
 $('#safeHistory').innerHTML+=`<div class="code-slots">${guess.map((n,i)=>`<div class="code-slot ${colors[i]}">${n}</div>`).join('')}</div>`;d.attempts++;d.totalAttempts++;const status=$('#safeStatus');if(status)status.textContent=`Round risolti: ${d.roundsSolved}/4 · Tentativi: ${d.attempts}/12`;
 const solved=guess.every((n,i)=>n===d.secret[i]);if(solved){d.solved=true;d.roundsSolved++;setMiniScore(state.pid,Math.max(0,d.roundsSolved*10-d.totalAttempts*.2));advanceSafeRound();return}
 d.input=[];renderSafeInput();if(d.attempts>=12){d.solved=true;$('#gameMessage').textContent='Tentativi esauriti: la cassaforte resta chiusa. Passiamo al codice successivo.';advanceSafeRound()}
}
function advanceSafeRound(){const d=state.gameData;if(d.round>=4){setMiniScore(state.pid,Math.max(0,d.roundsSolved*10-d.totalAttempts*.2));recordRaceFinish(state.pid,'Cassaforte completata!');return}d.round++;later(()=>{if(!state.locked)newSafeRound()},1200)}
function initDots(){
 const d=state.gameData={round:1,total:0,colors:[],pairs:[],matched:[],selectedSymbol:null,usedColors:[],mappingVisible:true,completionOrder:[]};newDotsRound();
 state.players.filter(p=>p.bot).forEach(p=>{const skill=botSkill(p),max=34;let progress=0;const tick=()=>{if(state.locked||progress>=max)return;progress+=Math.random()<.62+skill*.32?1:0;setMiniScore(p.pid,progress);if(progress>=max){recordRaceFinish(p.pid,'Collega i puntini completato!');return}later(tick,botThink(p,850)+Math.random()*600)};later(tick,botThink(p,4000))});
 countdown(90,()=>finishGame('Tempo scaduto per gli abbinamenti!'));
}
function newDotsRound(){
 const d=state.gameData,n=[6,10,18][d.round-1],symbols=['●','◆','▲','★','♥','■','✚','⬟','☀','✿','⬢','✦','◉','✧','✪','❖','✺','✥'];
 d.colors=shuffle(['#ff6b6b','#ffd166','#06d6a0','#4cc9f0','#b388ff','#f72585','#f77f00','#90be6d','#577590','#f2a2e8','#43aa8b','#f94144','#f9c74f','#4895ef','#9b5de5','#00bbf9','#fb8500','#caffbf'].slice(0,n));
 d.pairs=d.colors.map((color,i)=>({color,symbol:symbols[i]}));d.targets=shuffle(d.pairs.map(p=>p.symbol));d.matched=[];d.usedColors=[];d.selectedSymbol=null;d.mappingVisible=true;const roundAtStart=d.round;renderDotsRound();
 $('#gameMessage').textContent='Memorizza gli abbinamenti per 4 secondi. Poi seleziona un simbolo e il colore che gli corrisponde.';
 later(()=>{if(state.locked||state.gameData!==d||d.round!==roundAtStart)return;d.mappingVisible=false;renderDotsRound();$('#gameMessage').textContent='Scegli un simbolo e poi il colore corrispondente. Errore: -1 punto.'},4000);
}
function renderDotsRound(){
 const d=state.gameData,n=d.pairs.length;
 $('#gameStage').innerHTML=`<div class="stage-title">ROUND ${d.round}/3 · ${n} abbinamenti · Punti ${d.total}</div>${d.mappingVisible?`<div class="stage-title">MEMORIZZA I COLORI</div><div class="dots-reference">${d.pairs.map(p=>`<span class="dots-pair"><b>${p.symbol}</b><i style="background:${p.color}"></i></span>`).join('')}</div>`:''}<div class="stage-title">${d.selectedSymbol?`Simbolo scelto: ${d.selectedSymbol} · ora scegli il colore`:'1. Scegli un simbolo'}</div><div id="dotsTargets" class="dots-board">${d.targets.map(symbol=>`<button class="dot-target ${d.matched.includes(symbol)?'done':''} ${d.selectedSymbol===symbol?'selected':''}" data-symbol="${symbol}" ${d.mappingVisible||d.matched.includes(symbol)?'disabled':''}>${symbol}</button>`).join('')}</div><div class="stage-title">2. Scegli il colore corrispondente</div><div id="dotsPalette" class="action-grid">${d.colors.map((color,i)=>`<button class="action-card dots-color ${d.usedColors.includes(color)?'used':''}" data-color="${color}" style="border-bottom:6px solid ${color}" ${d.mappingVisible||d.usedColors.includes(color)||!d.selectedSymbol?'disabled':''}>${d.usedColors.includes(color)?'✓':'COLOR '+(i+1)}</button>`).join('')}</div>`;
 $$('#dotsTargets [data-symbol]').forEach(b=>b.onclick=()=>{d.selectedSymbol=b.dataset.symbol;renderDotsRound()});
 $$('#dotsPalette [data-color]').forEach(b=>b.onclick=()=>{if(!d.selectedSymbol)return;const pair=d.pairs.find(x=>x.symbol===d.selectedSymbol);if(pair?.color===b.dataset.color){d.matched.push(d.selectedSymbol);d.usedColors.push(b.dataset.color);d.total++;setMiniScore(state.pid,d.total);d.selectedSymbol=null;if(d.matched.length===n){if(d.round>=3){recordRaceFinish(state.pid,'Collega i puntini completato!');return}d.round++;newDotsRound();return}renderDotsRound();$('#gameMessage').textContent='Abbinamento corretto! +1 punto.'}else{d.total=Math.max(0,d.total-1);setMiniScore(state.pid,d.total);d.selectedSymbol=null;renderDotsRound();toast('Colore sbagliato! -1 punto.')}});
}
function initPistons(){
 const order=shuffle(state.players.map(p=>p.pid));
 state.gameData={alive:order.slice(),turn:0,disabled:[],round:1,order,danger:Math.floor(Math.random()*10),resolving:false,roundLog:[]};
 renderPistons();
}
function renderPistons(){
 const d=state.gameData; if(!d||state.locked)return;
 d.order=d.order.filter(id=>d.alive.includes(id));
 if(d.alive.length<=1){if(d.alive[0])setMiniScore(d.alive[0],100);finishGame('Ultimo sopravvissuto sotto l’incudine!');return}
 if(d.disabled.length>=10){d.disabled=[];d.round++;d.danger=Math.floor(Math.random()*10);d.order=shuffle(d.alive);d.turn=0}
 d.turn=Math.max(0,d.turn%d.order.length);
 const pid=d.order[d.turn],p=state.players.find(x=>x.pid===pid);
 $('#gameStage').innerHTML=`<div class="stage-title">ROUND ${d.round} · Turno ${d.turn+1}/${d.order.length}</div><div class="players-arena">${d.order.map(id=>{const x=state.players.find(y=>y.pid===id);return `<div class="arena-player ${id===pid?'active':''}">${img(char(x.characterId).img,x.name)}<b>${escapeHtml(x.name)}</b><small>${id===pid?'🎯 TOCCA A TE':'In attesa del turno'}</small></div>`}).join('')}</div><div class="anvil-scene" id="anvilScene"><div class="anvil-rope"></div><div class="anvil-icon" aria-label="Incudine"><span class="anvil-horn"></span><span class="anvil-body"></span><span class="anvil-base"></span></div><div class="anvil-victim">${img(char(p.characterId).img,p.name)}<b>${escapeHtml(p.name)}</b><small>${p.bot?'CPU — puoi scegliere tu al suo posto':'Giocatore di turno'}</small></div><div class="stage-title">Scegli un pistone: se trovi quello collegato all’incudine, il round termina subito.</div></div><div class="piston-grid">${Array.from({length:10},(_,i)=>`<button class="piston ${['red','blue','green','yellow','purple'][i%5]} ${d.disabled.includes(i)?'used':''}" data-piston="${i}" ${d.disabled.includes(i)||d.resolving?'disabled':''}><span>${d.disabled.includes(i)?'×':['●','◆','▲','★','✚'][i%5]}</span><small>PISTONE ${i+1}</small></button>`).join('')}</div><div class="stage-title" id="anvilStatus">${escapeHtml(d.roundLog.slice(-1)[0]||'L’incudine oscilla sopra il personaggio…')}</div>`;
 $$('#gameStage [data-piston]').forEach(btn=>btn.onclick=()=>pistonClick(Number(btn.dataset.piston),pid));
 $('#gameMessage').textContent=pid===state.pid?'È il tuo turno: scegli con attenzione.':`Tocca a ${p?.name||'un giocatore'}. Puoi scegliere tu il suo pistone!`;
 if(p?.bot&&!d.resolving)later(()=>{if(!state.locked&&state.gameData===d&&d.order[d.turn]===pid&&!d.resolving){const remaining=Array.from({length:10},(_,i)=>i).filter(i=>!d.disabled.includes(i));if(remaining.length)pistonClick(remaining[Math.floor(Math.random()*remaining.length)],pid)}},botThink(p,2800)+1000);
}

function pistonClick(i,pid){
 const d=state.gameData;if(state.locked||d.resolving||d.order[d.turn]!==pid||d.disabled.includes(i))return;
 const p=state.players.find(x=>x.pid===pid);if(!p)return;
 d.resolving=true;d.disabled.push(i);const danger=d.danger===i;
 const scene=$('#anvilScene');if(danger&&scene)scene.classList.add('anvil-drop');
 const status=$('#anvilStatus');if(status)status.innerHTML=`<div class="piston-reveal ${danger?'danger-reveal':'safe-reveal'}">${danger?'TRAPPOLA ATTIVATA — INCUDINE IN CADUTA':'PISTONE SICURO — CLACK!'}</div>`;
 $('#gameMessage').textContent=danger?`${p.name} ha trovato l’incudine! Il round finisce qui.`:`${p.name} è salvo. Il turno passa al prossimo giocatore.`;
 if(danger){d.alive=d.alive.filter(id=>id!==pid);d.order=d.order.filter(id=>id!==pid);setMiniScore(pid,Math.max(state.miniScores[pid]||0,(d.round-1)*10+d.disabled.length));d.roundLog.push(`${p.name} è stato eliminato al round ${d.round}.`)}
 else{setMiniScore(pid,(d.round-1)*10+d.disabled.length);d.roundLog.push(`${p.name} ha superato il turno.`)}
 later(()=>{
  if(state.locked)return;
  if(d.alive.length<=1){if(d.alive[0])setMiniScore(d.alive[0],1000);finishGame('Ultimo sopravvissuto sotto l’incudine!');return}
  if(danger||d.disabled.length>=10){d.disabled=[];d.round++;d.danger=Math.floor(Math.random()*10);d.order=shuffle(d.alive);d.turn=0}
  else if(d.order.length)d.turn=(d.turn+1)%d.order.length;
  d.resolving=false;renderPistons();
 },danger?1900:1600);
}

function initBattle(){
 const d=state.gameData={round:1,alive:state.players.map(p=>p.pid),hp:Object.fromEntries(state.players.map(p=>[p.pid,20])),doors:6,phase:'choose',choices:{},door:null,attackers:[],attackTurn:0,dice:{},targets:{},eliminationOrder:[],completionOrder:null};
 renderBattleChoose();
}
function renderBattleChoose(){
 const d=state.gameData;d.phase='choose';d.choices={};d.door=null;
 $('#gameStage').innerHTML=`<div class="stage-title">ROUND ${d.round} · Scegli la tua porta in segreto</div><div class="battle-door-grid">${Array.from({length:d.doors},(_,i)=>`<button class="battle-door-card" data-door="${i}"><span class="door-number">${i+1}</span><span class="door-art">▥</span><b>PORTA ${i+1}</b><small>Entra senza sapere cosa ti aspetta</small></button>`).join('')}</div><div class="players-arena">${d.alive.map(pid=>{const p=state.players.find(x=>x.pid===pid);return `<div class="arena-player">${img(char(p.characterId).img,p.name)}<b>${escapeHtml(p.name)}</b><small class="hp">❤️ ${d.hp[pid]} HP</small></div>`}).join('')}</div>`;
 $$('#gameStage [data-door]').forEach(b=>b.onclick=()=>chooseDoor(Number(b.dataset.door)));
 $('#gameMessage').textContent='Scegli una porta. Quando tutti hanno deciso, le luci si spegneranno e verrà rivelata quella di combattimento.';
 const roundToken=d.round;const bots=d.alive.filter(pid=>state.players.find(p=>p.pid===pid)?.bot);bots.forEach((pid,i)=>later(()=>{if(state.locked||d.round!==roundToken||d.phase!=='choose'||d.choices[pid]!==undefined)return;const p=state.players.find(x=>x.pid===pid),skill=botSkill(p),counts=Array.from({length:d.doors},(_,door)=>Object.values(d.choices).filter(v=>v===door).length);let choices=Array.from({length:d.doors},(_,j)=>j);if(Math.random()<skill*.75){const least=Math.min(...counts);choices=choices.filter(j=>counts[j]===least)}d.choices[pid]=choices[Math.floor(Math.random()*choices.length)];if(Object.keys(d.choices).length===d.alive.length)revealBattleDoor()},botThink(state.players.find(p=>p.pid===pid),1600)+i*350));
}

function chooseDoor(door){const d=state.gameData;if(state.locked||d.phase!=='choose'||!d.alive.includes(state.pid)||d.choices[state.pid]!==undefined||door<0||door>=d.doors)return;d.choices[state.pid]=door;const btn=$(`#gameStage [data-door="${door}"]`);if(btn){btn.classList.add('door-selected');btn.innerHTML='<span class="door-number">✓</span><span class="door-art">▥</span><b>SCELTA FATTA</b><small>Porta selezionata</small>'}$('#gameMessage').textContent='Porta scelta! Aspettiamo gli altri…';if(Object.keys(d.choices).length===d.alive.length)revealBattleDoor()}

function revealBattleDoor(){
 const d=state.gameData;if(state.locked||d.phase!=='choose')return;d.phase='reveal';d.door=Math.floor(Math.random()*d.doors);d.attackers=d.alive.filter(pid=>d.choices[pid]===d.door);d.attackTurn=0;
 $('#gameStage').innerHTML=`<div class="battle-suspense"><div class="battle-suspense-kicker">IL DESTINO È DECISO</div><h3>Le porte si stanno aprendo…</h3><div class="battle-door-grid reveal-doors">${Array.from({length:d.doors},(_,i)=>`<div class="battle-door-card reveal-door ${i===d.door?'combat-door':'safe-door'} ${i===d.door?'door-pulse':''}"><span class="door-number">${i+1}</span><span class="door-art">▥</span><b>${i===d.door?'PORTA DI COMBATTIMENTO':'PORTA SICURA'}</b><small>${i===d.door?'ARENA ATTIVA':'Nessuno scontro'}</small></div>`).join('')}</div><div class="battle-reveal-label">⚠ PORTA ${d.door+1} — COMBATTIMENTO</div></div><div class="players-arena">${d.alive.map(pid=>{const p=state.players.find(x=>x.pid===pid),here=d.choices[pid]===d.door;return `<div class="arena-player ${here?'active battle-in-arena':''}">${img(char(p.characterId).img,p.name)}<b>${escapeHtml(p.name)}</b><small>${here?'IN ARENA · PORTA '+(d.door+1):'Porta '+(d.choices[pid]+1)}</small><div class="hp">❤️ ${d.hp[pid]} HP</div></div>`}).join('')}</div><p class="stage-title">${d.attackers.length<2?'Non ci sono abbastanza giocatori nella porta: nessuno scontro in questo round.':`${d.attackers.length} giocatori sono entrati nell’arena! Ognuno lancerà il proprio dado.`}</p>`;
 $('#gameMessage').textContent='PORTA DI COMBATTIMENTO RIVELATA!';later(()=>{if(state.locked||d.phase!=='reveal')return;if(d.attackers.length<2){endBattleRound();return}d.phase='fight';renderBattleAttack()},3000);
}

function renderBattleAttack(){
 const d=state.gameData;if(state.locked)return;
 if(d.alive.length<=1){if(d.alive[0])setMiniScore(d.alive[0],1000+d.round);finishGame('Battle Royale conclusa!');return}
 if(d.attackTurn>=d.attackers.length){endBattleRound();return}
 const pid=d.attackers[d.attackTurn];if(!d.alive.includes(pid)){d.attackTurn++;renderBattleAttack();return}
 const p=state.players.find(x=>x.pid===pid);if(!p){d.attackTurn++;renderBattleAttack();return}
 const others=d.attackers.filter(id=>id!==pid&&d.alive.includes(id));
 $('#gameStage').innerHTML=`<div class="battle-combat-header"><div class="battle-reveal-label">PORTA ${d.door+1} · ROUND ${d.round}</div><div class="battle-turn-banner">🎲 Tocca a <b>${escapeHtml(p.name)}</b> · turno ${d.attackTurn+1}/${d.attackers.length}</div></div><div class="players-arena battle-arena">${d.attackers.filter(id=>d.alive.includes(id)).map(id=>{const x=state.players.find(q=>q.pid===id);return `<div class="arena-player ${id===pid?'active':''}">${img(char(x.characterId).img,x.name)}<b>${escapeHtml(x.name)}</b><small class="hp">❤️ ${d.hp[id]} HP</small><small>${id===pid?'STA LANCIANDO':'IN ARENA'}</small></div>`}).join('')}</div><div class="dice-stage"><div class="dice-cube" id="diceVisual">🎲</div><div id="diceText" class="stage-title">${escapeHtml(p.name)} sta lanciando il dado…</div></div><div id="targetChoices" class="action-grid"></div>`;
 $('#gameMessage').textContent=`${p.name} sta lanciando. Il danno sarà esattamente pari al numero uscito sul dado.`;
 later(()=>{if(state.locked||state.gameData!==d||d.phase!=='fight'||d.attackers[d.attackTurn]!==pid)return;const roll=1+Math.floor(Math.random()*6),dice=['⚀','⚁','⚂','⚃','⚄','⚅'][roll-1];const visual=$('#diceVisual');if(visual){visual.textContent=dice;visual.classList.add('dice-roll-done')}
 const text=$('#diceText');if(!others.length){if(text)text.textContent=`${p.name} ha fatto ${roll}, ma non ci sono bersagli validi.`;d.attackTurn++;later(renderBattleAttack,1000);return}
 if(text)text.textContent=`${p.name} ha fatto ${roll}! Scegli un bersaglio: infliggerai ${roll} danni esatti.`;
 const targetArea=$('#targetChoices');if(!targetArea)return;
 targetArea.innerHTML=others.map(id=>{const x=state.players.find(q=>q.pid===id);return `<button class="battle-target" data-battle-target="${id}">${img(char(x.characterId).img,x.name)}<b>${escapeHtml(x.name)}</b><small>❤️ ${d.hp[id]} HP</small><strong>SUBIRÀ ${roll} DANNI</strong></button>`}).join('');
 const choose=(target)=>applyBattleAttack(pid,target,roll);
 if(p.bot){const skill=botSkill(p),sorted=[...others].sort((a,b)=>d.hp[a]-d.hp[b]);const target=Math.random()<skill?sorted[0]:others[Math.floor(Math.random()*others.length)];later(()=>choose(target),botThink(p,1000))}
 else if(pid===state.pid){$$('[data-battle-target]').forEach(b=>b.onclick=()=>choose(b.dataset.battleTarget))}
 else if(text)text.textContent+=' Il turno è di un altro giocatore: puoi scegliere tu il bersaglio cliccando una carta.';
 },1700);
}

function applyBattleAttack(pid,target,roll){
 const d=state.gameData;if(state.locked||d.phase!=='fight'||d.attackers[d.attackTurn]!==pid||!d.attackers.includes(target)||!d.alive.includes(pid)||!d.alive.includes(target)||!Number.isInteger(roll)||roll<1||roll>6)return;
 const p=state.players.find(x=>x.pid===pid),t=state.players.find(x=>x.pid===target);const damage=roll,before=d.hp[target];d.hp[target]=Math.max(0,before-damage);
 const stage=$('#diceText');if(stage)stage.textContent=`💥 ${p.name} ha tirato ${roll} e ha colpito ${t.name}: −${damage} HP (${before} → ${d.hp[target]}).`;
 if(d.hp[target]<=0){d.alive=d.alive.filter(id=>id!==target);if(!d.eliminationOrder.includes(target))d.eliminationOrder.push(target);setMiniScore(target,Math.max(0,d.round*100-d.eliminationOrder.length));if(stage)stage.textContent+=` ${t.name} è eliminato!`;}
 d.attackTurn++;later(()=>{if(d.alive.length<=1){if(d.alive[0])setMiniScore(d.alive[0],1000+d.round);finishGame('Battle Royale conclusa!')}else renderBattleAttack()},1800);
}

function endBattleRound(){
 const d=state.gameData;d.alive.forEach(pid=>setMiniScore(pid,Math.max(state.miniScores[pid]||0,d.round*100+d.hp[pid])));
 if(d.alive.length<=1){if(d.alive[0])setMiniScore(d.alive[0],1000+d.round);finishGame('Battle Royale conclusa!');return}
 if(d.round%3===0&&d.doors>1)d.doors--;
 if(d.round>=6&&d.doors===2)d.doors=1;
 d.round++;d.choices={};d.attackers=[];d.phase='choose';later(renderBattleChoose,1300);
}

function initBomb(){
 const d=state.gameData={alive:state.players.map(p=>p.pid),holder:state.players[Math.floor(Math.random()*state.players.length)].pid,stunned:{},round:1,turns:0,token:0};startBombRound();
}
function startBombRound(){
 const d=state.gameData;if(state.locked)return;d.token++;const token=d.token;d.explodeIn=(7+Math.floor(Math.random()*14))*1000;renderBomb();
 countdown(d.explodeIn/1000,()=>{if(state.locked||d.token!==token)return;const h=d.holder;d.alive=d.alive.filter(pid=>pid!==h);setMiniScore(h,Math.max(state.miniScores[h]||0,d.round-1));d.alive.forEach(pid=>setMiniScore(pid,(state.miniScores[pid]||0)+1));
 if(d.alive.length<=1){if(d.alive[0])setMiniScore(d.alive[0],30);finishGame('Ultimo rimasto!');return}
 d.round++;d.holder=d.alive[Math.floor(Math.random()*d.alive.length)];startBombRound();
 });
}
function renderBomb(){
 const d=state.gameData;$('#gameStage').innerHTML=`<div class="stage-title">ROUND ${d.round} · La bomba esploderà tra 7 e 20 secondi</div><div class="players-arena">${d.alive.map(pid=>{const p=state.players.find(x=>x.pid===pid);return `<div class="arena-player ${pid===d.holder?'active':''}">${pid===d.holder?'<span class="bomb">💣</span>':''}${img(char(p.characterId).img,p.name)}<b>${escapeHtml(p.name)}</b><small>${pid===d.holder?'HA LA BOMBA':'Pronto'}</small></div>`}).join('')}</div><div style="text-align:center;font-size:55px;margin:10px">💣</div><div class="action-grid"><button id="passBomb" class="btn primary">PASSA LA BOMBA →</button></div>`;
 $('#passBomb').onclick=passBomb;
 const holder=state.players.find(p=>p.pid===d.holder);if(holder?.bot){const token=d.token;later(()=>{if(!state.locked&&state.gameData===d&&d.token===token&&d.holder===holder.pid)passBombBot(holder.pid)},botThink(holder,1000));}
}
function passBomb(){const d=state.gameData;if(d.holder!==state.pid){d.stunned[state.pid]=Date.now()+1800;$('#gameMessage').textContent='Non hai la bomba! Ti sei stordito per 1,8 secondi.';return}if(Date.now()<(d.stunned[state.pid]||0))return toast('Sei ancora stordito!');passBombBot(state.pid)}
function passBombBot(pid){
 const d=state.gameData;if(state.locked||d.holder!==pid)return;const eligible=d.alive.filter(x=>x!==pid);if(!eligible.length)return;
 const p=state.players.find(x=>x.pid===pid),skill=botSkill(p);let target;
 // Le CPU più furbe tendono a passarla a chi ha già ricevuto la bomba meno spesso nel round.
 if(p?.bot&&Math.random()<skill*.65){target=eligible.sort((a,b)=>(d.passCount?.[a]||0)-(d.passCount?.[b]||0))[0]}else target=eligible[Math.floor(Math.random()*eligible.length)];
 d.passCount=d.passCount||{};d.passCount[target]=(d.passCount[target]||0)+1;d.holder=target;d.turns++;$('#gameMessage').textContent=`${state.players.find(p=>p.pid===pid).name} passa la bomba a ${state.players.find(p=>p.pid===target).name}!`;renderBomb();
}
function initTargets(mode){
 const d=state.gameData={mode,score:0,seconds:mode==='reflex'?35:40,target:null,trap:null};
 if(mode==='reflex'){
  d.activeHole=-1;d.spawnTimer=null;
  $('#gameStage').innerHTML=`<div class="stage-title">SCHIACCIA LA TALPA · 35 secondi</div><div class="whack-board" id="whackBoard">${Array.from({length:9},(_,i)=>`<button class="whack-hole" data-hole="${i}" aria-label="Buco ${i+1}"><span class="hole-shadow"></span><span class="whack-mole"></span></button>`).join('')}</div><div class="stage-title">Colpisci le talpe appena spuntano. Le dorate valgono +3; le trappole ti fanno perdere 2 punti.</div>`;
  function spawn(){if(state.locked)return;const holes=$$('#whackBoard [data-hole]');if(!holes.length)return;holes.forEach(b=>{b.classList.remove('mole-up','mole-trap','mole-gold');b.querySelector('.whack-mole').textContent=''});const idx=Math.floor(Math.random()*holes.length),good=Math.random()>.18,gold=good&&Math.random()>.83;d.activeHole=idx;const b=holes[idx];b.classList.add('mole-up');if(!good)b.classList.add('mole-trap');else if(gold)b.classList.add('mole-gold');b.querySelector('.whack-mole').textContent=!good?'!':gold?'★':'●';b.dataset.value=!good?'-2':gold?'3':'1';b.onclick=()=>{if(state.locked||d.activeHole!==idx||!b.classList.contains('mole-up'))return;const value=Number(b.dataset.value);d.score+=value;setMiniScore(state.pid,d.score);b.classList.remove('mole-up');b.querySelector('.whack-mole').textContent='';d.activeHole=-1;if(d.spawnTimer)clearTimeout(d.spawnTimer);d.spawnTimer=later(spawn,180+Math.random()*280)};d.spawnTimer=later(spawn,good?650+Math.random()*400:500+Math.random()*350)}
  spawn();
 }else{
  $('#gameStage').innerHTML=`<div class="stage-title">Acchiappa gli oggetti buoni, evita quelli pericolosi!</div><div id="targets" class="targets"></div><div class="stage-title">Gli oggetti cadono sempre più velocemente: raccogli quelli giusti.</div>`;
  function spawn(){if(state.locked)return;const good=Math.random()>.22;const value=good?(Math.random()>.84?3:1):-2;const symbol=good?(value===3?'💎':'⭐'):'💣';$('#targets').innerHTML=`<button class="target ${good?'':'trap'}" style="border-color:${good?'#6ee7f9':'#ff5b76'}" id="targetNow">${symbol}<small style="font-size:10px;display:block">${value>0?'+'+value:value}</small></button>`;$('#targetNow').onclick=()=>{if(d.spawnTimer)clearTimeout(d.spawnTimer);d.score+=value;setMiniScore(state.pid,d.score);spawn()};d.spawnTimer=later(spawn,600+Math.random()*500)}spawn();
 }
 state.players.filter(p=>p.bot).forEach(p=>{let n=0;const tick=()=>{if(state.locked||n>=d.seconds)return;n++;const skill=botSkill(p),gain=Math.random()<(mode==='reflex'?.48+skill*.32:.52+skill*.27)?(Math.random()<.12+skill*.12?3:1):(Math.random()<.14?-2:0);setMiniScore(p.pid,(state.miniScores[p.pid]||0)+gain);later(tick,Math.max(500,botThink(p,1300)-skill*250))};later(tick,botThink(p,1000))});
 countdown(d.seconds,()=>finishGame(mode==='reflex'?'Riflessi terminato!':'Tempo scaduto!'));$('#gameMessage').textContent=mode==='reflex'?'Le talpe spuntano in buchi diversi: colpiscile prima che scompaiano.':'Le CPU hanno velocità e precisione diverse.';
}

function initCups(){
 const ids=state.players.map(p=>p.pid);state.gameData={round:1,lives:Object.fromEntries(ids.map(pid=>[pid,3])),alive:ids.slice(),bombs:[],phase:'reveal',pending:new Set(),chosen:{},taken:[],roundPlayers:[],cupCount:ids.length};newCupRound();
}

function newCupRound(){
 const d=state.gameData;if(state.locked)return;const roundToken=d.round;d.cupCount=d.alive.length;d.bombs=shuffle(Array.from({length:d.cupCount},(_,i)=>i)).slice(0,Math.min(Math.max(1,1+Math.floor((d.round-1)/2)),Math.max(1,d.cupCount-1)));d.phase='reveal';d.pending=new Set();d.chosen={};d.taken=[];d.roundPlayers=d.alive.slice();
 $('#gameStage').innerHTML=`<div class="cups-status-bar"><div><small>ROUND</small><b>${d.round}</b></div><div><small>GIOCATORI IN GARA</small><b>${d.alive.length}</b></div><div><small>BOMBE</small><b>${d.bombs.length}</b></div></div><div class="stage-title">MEMORIZZA LE BOMBE: tra poco i bicchieri verranno mescolati.</div><div class="cups cup-board" id="cupBoard">${Array.from({length:d.cupCount},(_,i)=>`<button class="cup ${d.bombs.includes(i)?'cup-bomb-reveal':''}" data-cup="${i}" disabled><span class="cup-body"></span><small>${i+1}</small>${d.bombs.includes(i)?'<span class="cup-bomb-mark">BOMBA</span>':''}</button>`).join('')}</div><div class="stage-title" id="cupStatus">Osserva bene: le bombe sono evidenziate in rosso.</div><div class="cup-racer-list">${state.players.map(p=>`<div class="cup-racer ${d.alive.includes(p.pid)?'':'eliminated'}" data-cup-racer="${p.pid}">${img(char(p.characterId).img,p.name)}<span><b>${escapeHtml(p.name)}</b><small>${d.alive.includes(p.pid)?`${d.lives[p.pid]} vite`:'ELIMINATO'}</small></span></div>`).join('')}</div>`;
 const revealMs=Math.max(1600,2700-d.round*90);
 later(()=>{if(state.locked||d.round!==roundToken||d.phase!=='reveal')return;d.phase='mixing';$('#cupStatus').textContent='Mescolamento in corso… segui i bicchieri!';const board=$('#cupBoard');if(board)board.classList.add('cups-mixing');if(board){const cups=Array.from(board.querySelectorAll('[data-cup]'));const shuffledCups=shuffle(cups);board.replaceChildren(...shuffledCups);d.bombs=[];shuffledCups.forEach((cup,index)=>{cup.dataset.cup=String(index);if(cup.classList.contains('cup-bomb-reveal'))d.bombs.push(index)})}later(()=>{if(state.locked||d.round!==roundToken||d.phase!=='mixing')return;d.phase='choose';if(board)board.classList.remove('cups-mixing');$('#cupStatus').textContent='Scegli un bicchiere. Ogni bicchiere può essere scelto una sola volta.';$$('#gameStage [data-cup]').forEach(b=>{b.disabled=false;b.classList.remove('cup-bomb-reveal');b.querySelector('.cup-bomb-mark')?.remove();b.onclick=()=>chooseCup(Number(b.dataset.cup))});scheduleCupBots()},Math.max(1000,2300-d.round*120))},revealMs);
 later(()=>{if(state.locked||d.round!==roundToken||d.phase!=='choose')return;for(const pid of d.roundPlayers.filter(id=>!d.pending.has(id))){const free=Array.from({length:d.cupCount},(_,j)=>j).filter(j=>!d.taken.includes(j));if(free.length)cupChoice(pid,free[Math.floor(Math.random()*free.length)])}},18000);
}

function scheduleCupBots(){const d=state.gameData;const roundToken=d.round;const bots=d.roundPlayers.filter(pid=>state.players.find(p=>p.pid===pid)?.bot);bots.forEach((pid,i)=>{const p=state.players.find(x=>x.pid===pid);later(()=>{if(state.locked||d.round!==roundToken||d.phase!=='choose'||d.pending.has(pid))return;const available=Array.from({length:d.cupCount},(_,j)=>j).filter(j=>!d.taken.includes(j));if(!available.length)return;const choice=available[Math.floor(Math.random()*available.length)];cupChoice(pid,choice)},botThink(p,1000)+i*500)});}

function chooseCup(i){cupChoice(state.pid,i)}
function cupChoice(pid,i){
 const d=state.gameData;if(state.locked||d.phase!=='choose'||!d.roundPlayers.includes(pid)||d.pending.has(pid)||d.taken.includes(i)||i<0||i>=d.cupCount)return;
 d.pending.add(pid);d.taken.push(i);d.chosen[pid]=i;const exploded=d.bombs.includes(i);if(exploded)d.lives[pid]--;else setMiniScore(pid,(state.miniScores[pid]||0)+1);
 if(d.lives[pid]<=0)d.alive=d.alive.filter(x=>x!==pid);
 const p=state.players.find(x=>x.pid===pid),button=$(`#gameStage [data-cup="${i}"]`);if(button){button.disabled=true;button.classList.add(exploded?'cup-exploded':'cup-safe');button.innerHTML=`<span class="cup-body"></span><small>${i+1}</small><span class="cup-result">${exploded?'BOMBA':'SALVO'}</span>`}
 $('#cupStatus').textContent=exploded?`${p.name} ha trovato una bomba! ${Math.max(0,d.lives[pid])} vite rimaste.`:`${p.name} è salvo! ${d.lives[pid]} vite rimaste.`;
 const racer=$(`[data-cup-racer="${pid}"]`);if(racer){racer.classList.toggle('eliminated',d.lives[pid]<=0);const small=racer.querySelector('small');if(small)small.textContent=d.lives[pid]<=0?'ELIMINATO':`${d.lives[pid]} vite`}
 if(d.pending.size>=d.roundPlayers.length){d.phase='reveal';later(()=>{if(state.locked)return;if(d.alive.length<=1){if(d.alive[0])setMiniScore(d.alive[0],1000+d.round);finishGame('Bicchieri conclusi!');return}d.round++;newCupRound()},1900)}
}

function initSpace(){
 const d=state.gameData={seconds:0,lives:Object.fromEntries(state.players.map(p=>[p.pid,3])),x:50,y:50,alive:state.players.map(p=>p.pid),meters:0,invulnerableUntil:0};$('#gameStage').innerHTML=`<div class="stage-title">${escapeHtml(me()?.name||'Tu')} · 3 vite · Muovi la navicella con mouse o dito</div><div class="space-canvas" id="spaceCanvas"><div class="space-ship" id="spaceShip">${img(char(me()?.characterId).img,me()?.name||'Personaggio')}</div><div id="asteroids"></div></div><div class="space-hint">Sopravvivi più a lungo per salire in classifica.</div><div class="space-bot-race">${state.players.filter(p=>p.bot).map(p=>`<span>${img(char(p.characterId).img,p.name)} ${escapeHtml(p.name)} <b id="space-score-${p.pid}">0 m</b></span>`).join('')}</div>`;
 const canvas=$('#spaceCanvas'),ship=$('#spaceShip');function move(e){const r=canvas.getBoundingClientRect();d.x=Math.max(5,Math.min(95,(e.clientX-r.left)/r.width*100));d.y=Math.max(10,Math.min(90,(e.clientY-r.top)/r.height*100));ship.style.left=d.x+'%';ship.style.top=d.y+'%'}canvas.addEventListener('pointermove',move);
 let ticks=0;const spawn=()=>{if(state.locked)return;const a=document.createElement('span');a.className='asteroid';a.textContent='☄️';a.style.left=Math.random()*94+3+'%';a.style.top='-20px';$('#asteroids').appendChild(a);let y=-5;const speed=2.1+ticks/34+Math.random()*2.0;const fall=setInterval(()=>{if(state.locked){clearInterval(fall);a.remove();return}y+=speed;a.style.top=y+'%';if(y>105){clearInterval(fall);a.remove()}if(y>=(d.y-4)&&y<=(d.y+4)&&Math.abs(parseFloat(a.style.left)-d.x)<5.5&&Date.now()>=d.invulnerableUntil&&d.lives[state.pid]>0){clearInterval(fall);a.remove();d.lives[state.pid]--;d.invulnerableUntil=Date.now()+3000;ship.classList.add('ship-hit');later(()=>ship.classList.remove('ship-hit'),3000);$('#gameMessage').textContent=`Impatto! Invulnerabilità per 3 secondi · Vite rimaste: ${d.lives[state.pid]}`;if(d.lives[state.pid]<=0){d.alive=d.alive.filter(id=>id!==state.pid);setMiniScore(state.pid,ticks);$('#gameMessage').textContent='La tua navicella è fuori gioco. Guarda la classifica!';canvas.style.pointerEvents='none'}}},45);later(()=>{if(!state.locked)spawn()},Math.max(260,850-ticks*7))};spawn();
 const botTick=()=>{if(state.locked)return;state.players.filter(p=>p.bot&&d.alive.includes(p.pid)).forEach(p=>{const skill=botSkill(p),lost=Math.random()<(0.045+(1-skill)*0.07+ticks/3200);if(lost){d.lives[p.pid]--;if(d.lives[p.pid]<=0){d.alive=d.alive.filter(id=>id!==p.pid);setMiniScore(p.pid,ticks)}}else setMiniScore(p.pid,ticks);const label=$(`#space-score-${p.pid}`);if(label)label.textContent=`${ticks} m`});ticks++;d.seconds++;if(d.lives[state.pid]>0)setMiniScore(state.pid,ticks);$('#gameClock').textContent='00:'+String(ticks).padStart(2,'0');later(botTick,1000);if(d.lives[state.pid]<=0&&d.alive.filter(id=>id!==state.pid).length===0)finishGame('Spazio conquistato!')};botTick();
 later(()=>{if(!state.locked)finishGame('Fine della spedizione!')},90000);$('#gameMessage').textContent='Le navicelle CPU schivano, ma possono commettere errori.';
}
function shipEmoji(){const p=me();return p?`🚀`:'🚀'}
const HIDE_SPOTS=[
 {id:'tree',name:'Albero',emoji:'🌳',hint:'Tra i rami'}, {id:'slide',name:'Scivolo',emoji:'🛝',hint:'Dietro la scaletta'},
 {id:'bed',name:'Letto',emoji:'🛏️',hint:'Sotto le coperte'}, {id:'bush',name:'Cespuglio',emoji:'🌳',hint:'Nel fogliame'},
 {id:'box',name:'Scatolone',emoji:'📦',hint:'Dentro la scatola'}, {id:'swing',name:'Altalena',emoji:'🎠',hint:'Dietro il gioco'},
 {id:'rock',name:'Roccia',emoji:'🪨',hint:'Dietro la roccia'}, {id:'tent',name:'Tenda',emoji:'⛺',hint:'Dentro la tenda'}
];
function initHideSeek(){
 const order=shuffle(state.players.map(p=>p.pid));
 state.gameData={round:0,order,hiderChoices:{},found:{},guesses:[],history:{},roundLog:[],phase:'hide',picked:false,turnScores:{}};
 HIDE_SPOTS.forEach(x=>state.gameData.history[x.id]=0);
 startHideRound();
}
function startHideRound(){
 const d=state.gameData;if(state.locked)return;
 if(d.round>=d.order.length){finishGame('Tutti i round di nascondino sono finiti!');return}
 d.round++;d.hunter=d.order[d.round-1];d.hiderChoices={};d.found={};d.guesses=[];d.roundLog=[];d.roundHistory={...d.history};d.picked=false;d.phase='hide';
 const hunter=state.players.find(p=>p.pid===d.hunter);const isMeHunter=d.hunter===state.pid;const roundToken=d.round;
 // Le altre CPU scelgono un nascondiglio in modo graduale, con preferenze diverse e memoria delle scelte precedenti.
 state.players.filter(p=>p.pid!==d.hunter&&p.pid!==state.pid).forEach(p=>later(()=>{
  if(state.locked||state.gameData!==d||d.round!==roundToken||d.phase!=='hide')return;
  const skill=botSkill(p),ranked=HIDE_SPOTS.map((spot)=>({spot,load:d.history[spot.id]||0,noise:Math.random()})).sort((a,b)=>a.load-b.load||a.noise-b.noise);
  const pool=ranked.slice(0,Math.max(3,Math.round(8-(skill*3))));const pick=(Math.random()<skill*.65?pool[0]:pool[Math.floor(Math.random()*pool.length)]).spot;
  d.hiderChoices[p.pid]=pick.id;d.history[pick.id]=(d.history[pick.id]||0)+1;
 },botThink(p,900)+Math.random()*1800));
 $('#gameClock').textContent='00:15';
 renderHideSeek();
 $('#gameMessage').textContent=isMeHunter?'Sei il cacciatore! Aspetta che tutti si nascondano, poi scegli tre figure diverse.':'Scegli un nascondiglio prima che scada il tempo. Il cacciatore avrà tre tentativi!';
 let remaining=15;gameInterval=setInterval(()=>{if(state.locked||state.gameData!==d){clearInterval(gameInterval);return}remaining--;$('#gameClock').textContent='00:'+String(Math.max(0,remaining)).padStart(2,'0');if(remaining<=0){clearInterval(gameInterval);if(d.phase==='hide')finishHidePhase()}},1000);
}
function renderHideSeek(){
 const d=state.gameData;if(!d||state.locked)return;const hunter=state.players.find(p=>p.pid===d.hunter);const isHunter=d.hunter===state.pid;
 const meHidden=d.hiderChoices[state.pid];
 $('#gameStage').innerHTML=`<div class="hide-topline"><span>ROUND ${d.round}/${d.order.length}</span><span>${isHunter?'🕵️ IL TUO TURNO DA CACCIATORE':'🙈 NASCONDITI!'}</span></div><div class="hide-hunter">${img(char(hunter.characterId).img,hunter.name)}<div><small>IL CACCIATORE DI QUESTO ROUND</small><b>${escapeHtml(hunter.name)}</b><span>${isHunter?'Ti toccherà cercare gli altri!':'Non farti trovare da questo personaggio…'}</span></div></div><div class="hide-instructions">${d.phase==='hide'?(isHunter?'Gli altri si stanno nascondendo. Tra poco potrai cercare in 3 figure.':'Hai 15 secondi: scegli una figura in cui nasconderti.'):(isHunter?'Scegli tre figure diverse. Ogni giocatore trovato vale 1 punto!':'Il cacciatore sta cercando… incrocia le dita!')}</div><div class="hide-spots">${HIDE_SPOTS.map(spot=>{const occupants=d.phase==='reveal'?state.players.filter(p=>p.pid!==d.hunter&&d.hiderChoices[p.pid]===spot.id):[];return `<button class="hide-spot ${meHidden===spot.id?'chosen':''} ${d.guesses.includes(spot.id)?'guessed':''} ${d.phase==='reveal'&&occupants.some(p=>d.found[p.pid])?'spot-found':''}" data-hide-spot="${spot.id}" ${d.phase!=='hide'||isHunter||d.picked?'disabled':''}><span class="hide-emoji">${spot.emoji}</span><b>${spot.name}</b><small>${spot.hint}</small>${meHidden===spot.id&&d.phase!=='reveal'?'<em>SEI QUI</em>':''}${d.guesses.includes(spot.id)?`<em>${occupants.some(p=>d.found[p.pid])?'TROVATO!':'NESSUNO TROVATO'}</em>`:''}${occupants.length?`<span class="hide-spot-avatars">${occupants.map(p=>`<span class="hide-avatar ${d.found[p.pid]?'avatar-found':'avatar-hidden'}">${img(char(p.characterId).img,p.name)}<small>${escapeHtml(p.name)}</small></span>`).join('')}</span>`:''}</button>`}).join('')}</div><div id="hideActionArea" class="hide-action-area"></div><div id="hideRoundLog" class="hide-round-log">${d.roundLog.map(line=>`<div>${line}</div>`).join('')}</div>`;
 $$('#gameStage [data-hide-spot]').forEach(b=>b.onclick=()=>chooseHideSpot(b.dataset.hideSpot));
 if(d.phase==='hunt'&&isHunter)renderHideGuessControls();
 if(d.phase==='reveal')renderHideReveal();
}
function chooseHideSpot(id){
 const d=state.gameData;if(state.locked||d.phase!=='hide'||d.hunter===state.pid||d.picked)return;
 d.hiderChoices[state.pid]=id;d.picked=true;d.history[id]=(d.history[id]||0)+1;
 renderHideSeek();$('#gameMessage').textContent='Sei nascosto! Attendi che il cacciatore faccia le sue tre scelte.';
}
function finishHidePhase(){
 const d=state.gameData;if(state.locked||d.phase!=='hide')return;
 if(d.hunter!==state.pid&&!d.hiderChoices[state.pid]){const p=me(),skill=botSkill(p);const ranked=HIDE_SPOTS.map(x=>({x,load:d.history[x.id]||0,noise:Math.random()})).sort((a,b)=>a.load-b.load||a.noise-b.noise);d.hiderChoices[state.pid]=(Math.random()<skill?ranked[0]:ranked[Math.floor(Math.random()*ranked.length)]).x.id;d.history[d.hiderChoices[state.pid]]++}
 // Any slow CPU still receives a hiding spot before the hunt starts.
 state.players.filter(p=>p.pid!==d.hunter&&!d.hiderChoices[p.pid]).forEach(p=>{const ranked=HIDE_SPOTS.map(x=>({x,load:d.history[x.id]||0,noise:Math.random()})).sort((a,b)=>a.load-b.load||a.noise-b.noise);const pick=Math.random()<botSkill(p)?ranked[0].x:ranked[Math.floor(Math.random()*ranked.length)].x;d.hiderChoices[p.pid]=pick.id;d.history[pick.id]++});
 d.phase='hunt';d.picked=false;$('#gameClock').textContent='00:12';renderHideSeek();
 if(d.hunter===state.pid){$('#gameMessage').textContent='Scegli 3 figure diverse entro 12 secondi: ogni giocatore trovato vale 1 punto!';let left=12;gameInterval=setInterval(()=>{if(state.locked||state.gameData!==d||d.phase!=='hunt'){clearInterval(gameInterval);return}left--;$('#gameClock').textContent='00:'+String(Math.max(0,left)).padStart(2,'0');if(left<=0){clearInterval(gameInterval);while(d.guesses.length<3){const rest=HIDE_SPOTS.find(x=>!d.guesses.includes(x.id));if(!rest)break;d.guesses.push(rest.id);resolveHideGuess(rest.id)}finishHideRound()}},1000)}
 else{
  const p=state.players.find(x=>x.pid===d.hunter),skill=botSkill(p),roundToken=d.round;
  const ranked=HIDE_SPOTS.map(x=>({x,history:d.roundHistory[x.id]||0,noise:Math.random()})).sort((a,b)=>(b.history*(.15+skill*.25)+b.noise*(1-skill*.2))-(a.history*(.15+skill*.25)+a.noise*(1-skill*.2)));
  const picks=ranked.slice(0,Math.max(3,Math.ceil(skill*3))).map(x=>x.x.id);while(picks.length<3){const rest=HIDE_SPOTS.find(x=>!picks.includes(x.id));if(!rest)break;picks.push(rest.id)}
  picks.slice(0,3).forEach((spot,i)=>later(()=>{if(state.locked||state.gameData!==d||d.round!==roundToken||d.phase!=='hunt')return;d.guesses.push(spot);resolveHideGuess(spot);if(d.guesses.length>=3)finishHideRound();else renderHideSeek()},botThink(p,1800)+i*1900));
 }
}

function renderHideGuessControls() {
  const d = state.gameData;
  const area = $('#hideActionArea');
  if (!area) return;

  const remaining = 3 - d.guesses.length;

  area.innerHTML =
    '<div class="hide-pick-label">TENTATIVI RIMASTI: ' +
    remaining +
    '</div><div class="hide-pick-buttons">' +
    HIDE_SPOTS.filter(x => !d.guesses.includes(x.id))
      .map(x =>
        '<button class="btn ' +
        (d.guesses.length ? 'ghost' : 'primary') +
        '" data-guess-spot="' + x.id + '">' +
        x.emoji + ' ' + x.name +
        '</button>'
      ).join('') +
    '</div>';

  $$('[data-guess-spot]').forEach(b => {
    b.onclick = () => {
      if (d.phase !== 'hunt' || d.guesses.length >= 3) return;

      const spotId = b.dataset.guessSpot;
      const spot = HIDE_SPOTS.find(x => x.id === spotId);
      if (!spot) return;

      d.guesses.push(spotId);
      resolveHideGuess(spotId);

      if (d.guesses.length >= 3) {
        finishHideRound();
      } else {
        renderHideSeek();
        $('#gameMessage').textContent =
          'Hai scelto ' + spot.name +
          '. Ancora ' + (3 - d.guesses.length) + ' tentativi!';
      }
    };
  });
}

function resolveHideGuess(spotId){
 const d=state.gameData;let foundPlayers=[];
 Object.entries(d.hiderChoices).forEach(([pid,id])=>{if(id===spotId&&!d.found[pid]){d.found[pid]=true;foundPlayers.push(state.players.find(p=>p.pid===pid)?.name||'Un giocatore')}});
 if(foundPlayers.length)setMiniScore(d.hunter,(state.miniScores[d.hunter]||0)+foundPlayers.length);
 const spot=HIDE_SPOTS.find(x=>x.id===spotId);const result=foundPlayers.length?`TROVATI: ${foundPlayers.join(', ')}`:'nessuno trovato';d.roundLog.push(`${spot.emoji} ${spot.name}: ${result}`);const log=$('#hideRoundLog');if(log)log.innerHTML=d.roundLog.map(line=>`<div>${escapeHtml(line)}</div>`).join('');
 $('#gameMessage').textContent=foundPlayers.length?`Il cacciatore ha trovato ${foundPlayers.join(', ')} nel nascondiglio ${spot.name}!`:`Il nascondiglio ${spot.name} è vuoto.`;
}

function finishHideRound(){
 const d=state.gameData;if(state.locked||d.phase!=='hunt')return;d.phase='reveal';
 Object.entries(d.hiderChoices).forEach(([pid,spot])=>{if(!d.found[pid])setMiniScore(pid,(state.miniScores[pid]||0)+0.5)});
 renderHideSeek();$('#gameMessage').textContent='Fine della caccia! Chi è rimasto nascosto guadagna 0,5 punti.';
 later(()=>{if(d.round>=d.order.length)finishGame('Nascondino completato!');else startHideRound()},2600);
}
function renderHideReveal(){
 const d=state.gameData,area=$('#hideActionArea');if(!area)return;
 const survivors=state.players.filter(p=>p.pid!==d.hunter&&!d.found[p.pid]);
 area.innerHTML=`<div class="hide-reveal-title">RISULTATI DEL ROUND</div><div class="hide-reveal-summary"><strong>${survivors.length}</strong> giocatori non sono stati trovati. I loro PNG sono mostrati nei cerchi dei rispettivi nascondigli.</div><div class="hide-found-list">${state.players.filter(p=>p.pid!==d.hunter).map(p=>{const spot=HIDE_SPOTS.find(x=>x.id===d.hiderChoices[p.pid]);return `<div class="hide-found-player ${d.found[p.pid]?'was-found':'survived'}">${img(char(p.characterId).img,p.name)}<span><b>${escapeHtml(p.name)}</b><small>${spot?.name||'—'}</small></span><strong>${d.found[p.pid]?'TROVATO':'NON TROVATO · +0,5 pt'}</strong></div>`}).join('')}</div>`;
}

function initUno(){
 const ids=shuffle(state.players.map(p=>p.pid));state.gameData={positions:Object.fromEntries(state.players.map(p=>[p.pid,0])),turn:0,order:ids,skips:{},finished:[],lastCard:null,direction:1};renderUno();
}
function unoCurrent(){const d=state.gameData;return d.order[d.turn%d.order.length]}
function renderUno(){
 const d=state.gameData;let guard=0;while((d.finished.includes(unoCurrent())||(d.skips[unoCurrent()]||0)>0)&&guard++<d.order.length*3){const id=unoCurrent();if(d.skips[id]>0)d.skips[id]--;d.turn=(d.turn+d.direction+d.order.length)%d.order.length}
 const current=unoCurrent(),player=state.players.find(p=>p.pid===current),isMe=current===state.pid;
 const specials={3:'CC',5:'−2',8:'+2',9:'CC',12:'TOR',14:'−2',16:'CC',18:'↻',20:'+2',23:'CC',24:'−2',29:'+2',30:'CC',34:'↻',35:'TOR',38:'CC',42:'FIN'};
 const cells=Array.from({length:43},(_,i)=>{const angle=(-Math.PI/2)+(i/43)*Math.PI*2,left=50+43*Math.cos(angle),top=50+43*Math.sin(angle);const pawns=state.players.filter(p=>d.positions[p.pid]===i);return `<div class="board-cell ${specials[i]?'special':''} ${i===42?'uno-finish':''}" style="left:${left.toFixed(2)}%;top:${top.toFixed(2)}%">${i+1}<small>${specials[i]||''}</small>${pawns.length?`<span class="pawn-stack">${pawns.map(p=>`<span class="pawn" title="${escapeHtml(p.name)}">${img(char(p.characterId).img,p.name)}</span>`).join('')}</span>`:''}</div>`}).join('');
 $('#gameStage').innerHTML=`<div class="stage-title">TABELLUNO · Turno di <b style="color:var(--yellow)">${escapeHtml(player?.name||'—')}</b></div><div class="board-track uno-circular">${cells}<div class="uno-center"><b>TABELLUNO</b><small>${d.finished.length}/${state.players.length} al traguardo</small><div class="uno-legend">CC Cambiacolore · −2 Arretra · +2 Avanza · TOR Perdi turni · ↻ Cambia giro</div></div></div><div class="stage-title">${d.awaitColorGuess===current?'CAMBIACOLORE: indovina il colore della prossima carta!':'Pesca una carta del colore scelto per avanzare'}</div><div class="action-grid">${[['rosso','#e94f64'],['blu','#4988f5'],['giallo','#e7b842'],['verde','#36b878']].map(([c,col])=>`<button class="action-card" data-unocolor="${c}" style="background:${col};color:${c==='giallo'?'#302346':'white'}" ${!isMe?'disabled':''}>${c.toUpperCase()} · ${d.awaitColorGuess===current?'INDOVINA':'PESCA'}</button>`).join('')}</div><div id="unoCard" class="stage-title">${isMe?'È il tuo turno!':'La CPU sta scegliendo una carta…'}</div>`;
 $$('[data-unocolor]').forEach(b=>b.onclick=()=>playUno(current,b.dataset.unocolor));
 $('#gameMessage').textContent='Le pedine sono posizionate dentro le caselle. Il primo a tagliare il traguardo è il primo in classifica.';
 if(player?.bot)later(()=>{if(!state.locked&&unoCurrent()===current){const colors=['rosso','blu','giallo','verde'];playUno(current,colors[Math.floor(Math.random()*colors.length)])}},botThink(player,1000));
}

function playUno(pid,color){
 const d=state.gameData;if(state.locked||d.finished.includes(pid)||pid!==unoCurrent())return;if(pid!==state.pid&&!state.players.find(p=>p.pid===pid)?.bot)return toast('Non è il tuo turno!');
 const player=state.players.find(p=>p.pid===pid);
 if(d.awaitColorGuess===pid){const actual=['rosso','blu','giallo','verde'][Math.floor(Math.random()*4)],numberDrawn=Math.floor(Math.random()*10);d.awaitColorGuess=null;if(color===actual)d.positions[pid]=Math.min(42,d.positions[pid]+numberDrawn);else d.positions[pid]=Math.max(0,d.positions[pid]-3);$('#unoCard').textContent=`CAMBIACOLORE: hai scelto ${color}; la carta era ${actual} ${numberDrawn}. ${color===actual?'Indovinato! Avanzi di '+numberDrawn:'Sbagliato: arretri di 3'}.`;if(d.positions[pid]>=42){d.positions[pid]=42;if(!d.finished.includes(pid))d.finished.push(pid);setMiniScore(pid,50-d.finished.length*2)}else setMiniScore(pid,d.positions[pid]);if(d.finished.length>=Math.max(1,state.players.length-1)){finishGame('TabellUNO concluso!');return}d.turn=(d.turn+d.direction+d.order.length)%d.order.length;later(renderUno,1500);return}
 const number=Math.floor(Math.random()*10);const specialRoll=Math.random();let special=null;if(specialRoll<.07)special='CAMBIO GIRO';else if(specialRoll<.15)special='BLOCCO';else if(specialRoll<.24)special='+2';
 let move=number;if(special==='+2')move+=2;d.positions[pid]=Math.min(42,d.positions[pid]+move);
 if(special==='BLOCCO'){const targets=d.order.filter(x=>x!==pid&&!d.finished.includes(x));if(targets.length){let target;if(player?.bot){target=targets.sort((a,b)=>d.positions[b]-d.positions[a])[0]}else target=targets[Math.floor(Math.random()*targets.length)];d.skips[target]=(d.skips[target]||0)+1;d.positions[target]=Math.min(42,d.positions[target]+1);if(d.positions[target]>=42&&!d.finished.includes(target)){d.finished.push(target);setMiniScore(target,50-d.finished.length*2)}special+=` (${state.players.find(p=>p.pid===target)?.name||'Un avversario'} +1 casella e salta un turno)`}}
 const cell=d.positions[pid];if([5,14,24].includes(cell))d.positions[pid]=Math.max(0,cell-2);if([8,20,29].includes(cell))d.positions[pid]=Math.min(42,cell+2);if([12,35].includes(cell))d.skips[pid]=(d.skips[pid]||0)+2;if(cell===18||cell===34)d.direction*=-1;if([3,9,16,23,30,38].includes(cell))d.awaitColorGuess=pid;
 $('#unoCard').textContent=`${player.name}: ${color} ${number}${special?' · '+special:''} → casella ${d.positions[pid]+1}`;setMiniScore(pid,d.positions[pid]);
 if(d.positions[pid]>=42){d.positions[pid]=42;if(!d.finished.includes(pid))d.finished.push(pid);setMiniScore(pid,50-d.finished.length*2)}
 if(d.finished.length>=Math.max(1,state.players.length-1)){finishGame('TabellUNO concluso!');return}
 // CAMBIACOLORE si risolve subito, senza consumare il turno del giocatore.
 if(d.awaitColorGuess===pid){later(renderUno,900);return}
 // +2 grants an extra turn; otherwise advance and let renderUno process skips/finished players.
 if(special==='+2'){later(renderUno,1300);return}d.turn=(d.turn+d.direction+d.order.length)%d.order.length;later(renderUno,1300);
}
$('#continueBtn').onclick=()=>{const n=$('#playerName').value.trim();if(n.length<2)return toast('Scrivi un nome di almeno 2 caratteri');state.name=n;$('#welcomeName').textContent=n.toUpperCase();showScreen('menu')};
$('#backHome').onclick=()=>showScreen('home');$('#createRoom').onclick=()=>showScreen('setup');$('#joinRoom').onclick=()=>showScreen('join');$('#browseRooms').onclick=loadRooms;$('#showStats').onclick=renderStats;
$('#playersCount').oninput=e=>$('#playersValue').textContent=e.target.value+' giocatori';$('#gamesCount').oninput=e=>$('#gamesValue').textContent=e.target.value+' minigiochi';
$('#confirmCreate').onclick=createRoom;$('#confirmJoin').onclick=()=>joinRoomByCode($('#roomCodeInput').value);$('#readyBtn').onclick=readyToggle;$('#startBtn').onclick=startMatch;$('#introReady').onclick=introReady;$('#copyCode').onclick=()=>navigator.clipboard?.writeText(state.roomId).then(()=>toast('Codice copiato!')).catch(()=>toast('Codice: '+state.roomId));$('#leaveRoom').onclick=()=>{if(state.roomUnsub)state.roomUnsub();state.roomId=null;state.room=null;state.players=[];state.selected=null;showScreen('menu')};
$$('[data-screen]').forEach(b=>b.onclick=()=>showScreen(b.dataset.screen));
$('#nextGame').onclick=()=>{if(state.gameIndex+1>=state.gameOrder.length){showFinal();return}state.gameIndex++;if(state.isHost)updateDoc(doc(db,'rooms',state.roomId),{gameIndex:state.gameIndex,gameStatus:'intro'}).catch(()=>{});showIntro()};
$('#playAgain').onclick=()=>{if(state.roomUnsub)state.roomUnsub();state.roomId=null;state.room=null;state.players=[];state.selected=null;showScreen('menu')};
function showFinal(){
 const sorted=sortScores();const my=sorted.findIndex(p=>p.pid===state.pid);if(my===0)state.stats.wins++;persistStats();
 $('#finalLeaderboard').innerHTML=sorted.map((p,i)=>{const rank=i+1;return `<div class="final-row ${rank===1?'champion':''}" style="animation-delay:${i*.15}s"><span class="final-rank">${rank}</span>${img(char(p.characterId).img,p.name)}<div><b>${escapeHtml(p.name)} ${rank===1?'👑':''}</b><small>${rank===1?'CAMPIONE DI CARTOON PARTY':p.bot?'CPU':'Classificato'} · ${rank===1?'Vittoria!':'Ottima partita'}</small></div><strong>${state.scores[p.pid]||0} pt</strong></div>`}).join('');
 showScreen('final');if(state.isHost)updateDoc(doc(db,'rooms',state.roomId),{status:'finished',scores:state.scores}).catch(()=>{});
}
function renderStats(){
 const favorite=Object.entries(state.stats.characters).sort((a,b)=>b[1]-a[1])[0];const mini=Object.entries(state.stats.miniWins).sort((a,b)=>b[1]-a[1])[0];
 $('#statsContent').innerHTML=`<div class="stat-card"><small>Vittorie generali</small><b>${state.stats.wins}</b></div><div class="stat-card"><small>Podi</small><b>${state.stats.podiums}</b></div><div class="stat-card"><small>Minigiochi giocati</small><b>${state.stats.games}</b></div><div class="stat-card"><small>Personaggio più usato</small><b>${favorite?escapeHtml(favorite[0]):'—'}</b></div><div class="stat-card"><small>Minigioco più vinto</small><b>${mini?escapeHtml(mini[0]):'—'}</b></div><div class="stat-card"><small>Vittorie in quel minigioco</small><b>${mini?mini[1]:0}</b></div>`;
 showScreen('stats');
}
async function loadRooms(){
 showScreen('rooms');$('#roomsList').innerHTML='<div class="empty">Cerco le lobby aperte…</div>';
 try{const snaps=await getDocs(query(collection(db,'rooms'),where('status','==','waiting'),limit(20)));const rooms=snaps.docs.map(d=>({id:d.id,...d.data()})).filter(r=>r.isPublic!==false);$('#roomsList').innerHTML=rooms.length?rooms.map(r=>`<div class="room-card"><div><b>Stanza ${r.id}</b><small>${(r.players||[]).length}/${r.maxPlayers} giocatori · ${r.numGames} minigiochi</small></div><button class="btn primary" data-join="${r.id}">Entra →</button></div>`).join(''):'<div class="empty">Nessuna lobby pubblica al momento. Creane una e invita gli amici!</div>';$$('[data-join]').forEach(b=>b.onclick=()=>joinRoomByCode(b.dataset.join))}
 catch(e){$('#roomsList').innerHTML='<div class="empty">Firestore non risponde. Controlla che il database sia stato creato e che le regole consentano la lettura delle lobby.</div>'}
}
updateConnection(false,'Connessione in attesa');
window.addEventListener('beforeunload',()=>{if(state.roomUnsub)state.roomUnsub()});
