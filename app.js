import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics, isSupported } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import {
  getFirestore, collection, doc, getDoc, getDocs, setDoc, updateDoc, onSnapshot,
  query, where, runTransaction, deleteDoc, limit
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* Configurazione fornita dall'utente. La config web Firebase è pubblica per design;
   la protezione vera si fa con le Firestore Security Rules. */
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
isSupported().then(ok => ok && getAnalytics(app)).catch(()=>{});

const characters = [
["Felix","https://i.pinimg.com/736x/7b/1b/67/7b1b674b9591d6ef5c271d40d4b4a8eb.jpg"],["Marinette","https://i.pinimg.com/736x/a9/f2/26/a9f22656f3d386215b3689a43dc35fe3.jpg"],["Cerise","https://i.pinimg.com/736x/f4/f4/3f/f4f43fc683aa514130d907d5e4f66cf9.jpg"],["Nathaniel","https://i.pinimg.com/736x/ca/bb/e5/cabbe5388f56dd707467d6c4f26a2dbe.jpg"],["Jake","https://i.pinimg.com/736x/a7/b2/b8/a7b2b82b160fbf07fc758b14697047ae.jpg"],["Anastasia","https://i.pinimg.com/736x/bc/29/fe/bc29fe78e9dbd6278696ecbf90ef3e36.jpg"],["Fiore","https://i.pinimg.com/736x/0a/1c/86/0a1c863f3fd688c8cade6b87d2d9907b.jpg"],["Ted","https://i.pinimg.com/736x/4f/f5/c3/4ff5c3d946bb0e7f2b4b8e1cf7f46507.jpg"],["Nick Wilde","https://i.pinimg.com/736x/64/53/c5/6453c57f9d9ca10e626926078492b631.jpg"],["Judy","https://i.pinimg.com/736x/78/c9/d2/78c9d20b45d80309421e196d25965f4f.jpg"],["Max","https://i.pinimg.com/736x/bf/f8/82/bff88258d9df8ad6e6ffc277213077ce.jpg"],["Chloe","https://i.pinimg.com/736x/7b/1d/20/7b1d20ee78e95a85d28589ad4d966131.jpg"],["Warren","https://i.pinimg.com/736x/e0/92/4e/e0924ea176fed53f2ed580f3d7b06668.jpg"],["Mark","https://i.pinimg.com/736x/2e/2b/6b/2e2b6b45474d417ee2d2c35c476ce1da.jpg"],["Gwen","https://i.pinimg.com/736x/e0/54/7a/e0547ad6b71dedf0cbacbcfccfdefcc3.jpg"],["Heather","https://i.pinimg.com/736x/d8/0d/77/d80d7744fabe48399c317c444b6456e4.jpg"],["Tyler","https://i.pinimg.com/736x/d2/db/de/d2dbdec62cb66e5de70dd5ef0bf09b46.jpg"],["Duncan","https://i.pinimg.com/736x/d5/79/e0/d579e0e3c51ec7d58cad7ef4f27e8722.jpg"],["Finn","https://i.pinimg.com/1200x/8c/26/de/8c26de758b55ec626323f5332b481a28.jpg"],["Marceline","https://i.pinimg.com/736x/9b/72/f5/9b72f518c67f3ed9baa8d09031f96031.jpg"],["Re Ghiaccio","https://i.pinimg.com/736x/eb/e0/5d/ebe05d99d3bc4405a060466e549307be.jpg"],["Fiona","https://i.pinimg.com/1200x/e5/cc/b6/e5ccb6ee8d9bf83492de9087f18e914a.jpg"],["Lapis","https://i.pinimg.com/736x/4e/a1/ed/4ea1ed5f3187b518bb84a92bbbcce258.jpg"],["Perla Gialla","https://i.pinimg.com/736x/4a/98/18/4a98187cb864ce0097f5809989f605d6.jpg"],["Steven","https://i.pinimg.com/736x/af/87/40/af87404a1c6470b497b9127dea8f2eb4.jpg"],["Cipollo","https://i.pinimg.com/736x/18/f0/e5/18f0e5e8316190a12e76bd7e47a91a17.jpg"],["Ash","https://i.pinimg.com/736x/81/63/94/816394a06b8c3a129155a4dd182fe79b.jpg"],["Serena","https://i.pinimg.com/736x/43/b7/da/43b7da217836207637b84a8f4c3ff90c.jpg"],["Lucinda","https://i.pinimg.com/736x/1e/88/a9/1e88a9ca4bcba979935fc9fffbd8e5f6.jpg"],["James","https://i.pinimg.com/736x/0e/97/5c/0e975c2f1e55e35fdaf04bcad2c88b1f.jpg"],["Fred","https://i.pinimg.com/736x/a7/fc/5f/a7fc5f4b526c4789267408129d6c8162.jpg"],["Daphne","https://i.pinimg.com/736x/af/50/06/af500672188eb9ef9141137045c565f5.jpg"],["Velma","https://i.pinimg.com/736x/2e/1e/95/2e1e953bb0b8a89d1574c0b221cd39b1.jpg"],["Shaggy","https://i.pinimg.com/1200x/0e/46/70/0e46703bcf03ff84420b0b71474c9ed7.jpg"],["Nightwing","https://i.pinimg.com/736x/af/0e/f8/af0ef8fbf1db3dc993412fd3541441a5.jpg"],["Superboy","https://i.pinimg.com/736x/5d/00/58/5d005844eef285d812e9be68159918c3.jpg"],["Artemis","https://i.pinimg.com/736x/ff/d7/52/ffd752846fd6f3b8af644adcab297ceb.jpg"],["Wonder Girl","https://i.pinimg.com/736x/fc/24/37/fc2437d881df91527f6c0258fa789fd3.jpg"],["Yoshi","https://i.pinimg.com/736x/44/39/d9/4439d934fef155334249c6f1c1465925.jpg"],["Goomba","https://i.pinimg.com/736x/de/d4/cc/ded4ccf551346be050aa1822dfc1f890.jpg"],["Rosalinda","https://i.pinimg.com/736x/da/87/05/da87056e17f0b24989898b059a1b0560.jpg"],["Peach","https://i.pinimg.com/736x/72/fb/81/72fb818ba60e9b39b28d38fe7984a184.jpg"],["Silver","https://i.pinimg.com/736x/12/22/a2/1222a2b28d00a653008e64bca1dfd479.jpg"],["Shadow","https://i.pinimg.com/736x/3f/3b/ce/3f3bced5dbff16529889d89f2610ae86.jpg"],["Blaze","https://i.pinimg.com/736x/b8/89/61/b889619ef87861b12d6171172cf851a1.jpg"],["Rouge","https://i.pinimg.com/736x/7e/5b/16/7e5b16d8d096e994a0a636a93e9e6e5f.jpg"],["Legoshi","https://i.pinimg.com/736x/47/c0/e1/47c0e1e6ad0a46be011c5aac756f8cb4.jpg"],["Juno","https://i.pinimg.com/736x/ff/ba/d2/ffbad241f652ae96e57b718f79dfd09d.jpg"],["Michiru","https://i.pinimg.com/736x/c6/e4/b0/c6e4b0c41216b7fbee97bdf5d0753678.jpg"],["Louis","https://i.pinimg.com/736x/d0/1e/0d/d01e0d901fa283dad28223f5d2ce6cb7.jpg"]
].map(([name,url],i)=>({id:`c${i}`,name,url}));

const minigames = [
  {id:"memory",name:"Memory",description:"Trova tutte le coppie. Ogni errore ti blocca per 2 secondi. Il primo a completare la griglia vince; il round continua finché resta un solo giocatore non classificato."},
  {id:"hide",name:"Nascondino",description:"A turno un cacciatore cerca gli altri. Chi si nasconde sceglie una delle 8 postazioni; il cacciatore può controllarne 4. +1 per ogni giocatore trovato, +0,5 per chi resta nascosto."},
  {id:"fortunflipper",name:"Fortunflipper",description:"Scegli una biglia e guarda dove ti porta la discesa. Pioli e ostacoli rallentano; se resti incastrato, clicca 10 volte per liberarti. Le biglie possono urtarsi."},
  {id:"goose",name:"Gioco dell'oca",description:"Lancia due dadi e avanza sul percorso da 62 caselle. Attenzione alle caselle speciali: possono aiutarti o farti perdere turni."},
  {id:"click",name:"Clicca il bottone",description:"Riempi la barra con almeno 100 click, ma fermati quando il semaforo è rosso: cliccare durante il rosso fa perdere 10 click."},
  {id:"pigs",name:"La scommessa dei maiali",description:"Scegli un maiale tra 12 colori. A ogni carta, avanza il maiale del colore estratto. È una corsa basata sulla fortuna."},
  {id:"meteor",name:"Pioggia di stelle",description:"Minigioco bonus: raccogli le stelle che piovono cliccandole prima che spariscano, evitando le meteore. Stelle normali +1, stelle dorate +3, meteore −2."}
];

const $ = id => document.getElementById(id);
let playerName="", playerId=sessionStorage.getItem("cc_player_id")||crypto.randomUUID(), roomId=null, roomData=null, isHost=false;
let unsubscribeRoom=null, unsubscribeLobbies=null, unsubscribePresence=null, localCharacter=null, gameLocal={}, localTimer=null, readyTimer=null, lobbyTimer=null, heartbeatTimer=null, cleanupTimer=null, lastGameId=null, toastTimer=null, isBusy=false;
sessionStorage.setItem("cc_player_id",playerId);
const escapeHtml = s => String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const randCode=()=>Array.from({length:6},()=> "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[Math.floor(Math.random()*32)]).join("");
const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
function toast(msg){$("toast").textContent=msg;$("toast").classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>$("toast").classList.remove("show"),3000)}
function showScreen(name){document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));$(`screen-${name}`).classList.add("active");window.scrollTo({top:0,behavior:"smooth"})}
function myPlayer(){return roomData?.players?.find(p=>p.id===playerId)}
function sortedPlayers(){return [...(roomData?.players||[])].sort((a,b)=>(b.points||0)-(a.points||0))}
function characterById(id){return characters.find(c=>c.id===id)}
function avatarHtml(p,cls="player-avatar"){let c=characterById(p.characterId);return `<div class="${cls}">${c?`<img src="${c.url}" alt="">`:"🎭"}</div>`}
function playerLabel(p){return escapeHtml(p.name)+(p.isBot?" <small>(NPC)</small>":"")}
function updateConnection(state,message){
  const label=$("connectionLabel"),dot=label.previousElementSibling;
  const states={checking:"Verifica connessione Firebase…",live:"Firebase connesso",offline:"Firebase non raggiungibile",denied:"Firestore non accessibile"};
  label.textContent=message||states[state]||states.checking;
  dot.classList.toggle("live",state==="live");dot.classList.toggle("offline",state==="offline"||state==="denied");
}
async function checkFirebaseConnection(){
  updateConnection("checking");
  try{await getDocs(query(collection(db,"rooms"),limit(1)));updateConnection("live");}
  catch(e){console.error("Controllo Firebase fallito",e);updateConnection(e?.code==="permission-denied"?"denied":"offline",e?.code==="permission-denied"?"Firestore: permessi negati":"Firebase non raggiungibile");}
}
function setBusy(button,busy,label){if(!button)return;button.disabled=busy;button.dataset.originalLabel??=button.innerHTML;button.innerHTML=busy?`${label||"ATTENDI…"}`:button.dataset.originalLabel;}
function showError(context,e){console.error(context,e);toast(`${context}: ${e?.message||"errore imprevisto"}`)}
function stopListeners(){
  [unsubscribeRoom,unsubscribeLobbies,unsubscribePresence].forEach(fn=>{if(fn)fn()});unsubscribeRoom=unsubscribeLobbies=unsubscribePresence=null;
  clearInterval(localTimer);clearInterval(readyTimer);readyTimer=null;clearInterval(lobbyTimer);clearInterval(heartbeatTimer);clearInterval(cleanupTimer);
  heartbeatTimer=cleanupTimer=null;
}

$("enterBtn").onclick=()=>{const v=$("playerName").value.trim();if(!v){toast("Scrivi prima il tuo nome!");return}playerName=v.slice(0,16);$("welcomeName").textContent=playerName.toUpperCase();showScreen("menu")};
$("playerName").addEventListener("keydown",e=>{if(e.key==="Enter")$("enterBtn").click()});
$("backHome").onclick=()=>showScreen("home");
$("openCreate").onclick=()=>showScreen("create");
$("openJoin").onclick=()=>showScreen("join");
$("openLobbies").onclick=()=>{showScreen("lobbies");loadLobbies()};
document.querySelectorAll(".back-menu").forEach(b=>b.onclick=()=>{if(unsubscribeLobbies){unsubscribeLobbies();unsubscribeLobbies=null;}showScreen("menu")});
let wantedPlayers=4,wantedGames=7;
function refreshSettings(){$("playersValue").textContent=wantedPlayers;$("gamesValue").textContent=wantedGames}
$("playersMinus").onclick=()=>{wantedPlayers=Math.max(3,wantedPlayers-1);refreshSettings()};
$("playersPlus").onclick=()=>{wantedPlayers=Math.min(10,wantedPlayers+1);refreshSettings()};
$("gamesMinus").onclick=()=>{wantedGames=Math.max(1,wantedGames-1);refreshSettings()};
$("gamesPlus").onclick=()=>{wantedGames=Math.min(32,wantedGames+1);refreshSettings()};
$("publicLobby").onchange=()=>{$("lobbyTypeLabel").textContent=$("publicLobby").checked?"Pubblica":"Privata"};

async function createRoom(){
  if(isBusy)return;
  if(!playerName){toast("Torna al menu iniziale e scegli un nome.");showScreen("home");return;}
  isBusy=true;setBusy($("createRoomBtn"),true,"CREAZIONE…");
  const me={id:playerId,name:playerName,isBot:false,isHost:true,characterId:null,ready:false,points:0,joinedAt:Date.now(),lastSeen:Date.now()};
  try{
    let createdCode=null;
    for(let attempt=0;attempt<6&&!createdCode;attempt++){
      const candidate=randCode(),ref=doc(db,"rooms",candidate);
      try{
        await runTransaction(db,async tx=>{
          const existing=await tx.get(ref);if(existing.exists())throw Object.assign(new Error("CODE_COLLISION"),{code:"code-collision"});
          tx.set(ref,{code:candidate,hostId:playerId,maxPlayers:wantedPlayers,totalGames:wantedGames,isPublic:$("publicLobby").checked,status:"lobby",players:[me],createdAt:Date.now(),round:0,game:null,usedGames:[],results:[],schemaVersion:1});
        });
        createdCode=candidate;
      }catch(e){if(e?.code!=="code-collision")throw e;}
    }
    if(!createdCode)throw new Error("Non riesco a generare un codice libero. Riprova.");
    roomId=createdCode;isHost=true;roomData={code:createdCode,hostId:playerId,maxPlayers:wantedPlayers,totalGames:wantedGames,isPublic:$("publicLobby").checked,status:"lobby",players:[me],createdAt:Date.now(),round:0,game:null,usedGames:[],results:[],schemaVersion:1};
    attachRoom();renderRoom();showScreen("room");updateConnection("live");
  }catch(e){roomId=null;showError("Impossibile creare la stanza",e);}
  finally{isBusy=false;setBusy($("createRoomBtn"),false);}
}
$("createRoomBtn").onclick=createRoom;
async function joinRoom(code){
  if(isBusy)return;
  code=String(code||"").replace(/[^a-z0-9]/gi,"").toUpperCase();
  if(!code){toast("Inserisci il codice stanza.");return;}
  if(code.length!==6){toast("Il codice deve contenere 6 caratteri.");return;}
  isBusy=true;setBusy($("joinCodeBtn"),true,"INGRESSO…");
  try{
    const ref=doc(db,"rooms",code);let joinedData=null;
    await runTransaction(db,async tx=>{
      const snap=await tx.get(ref);if(!snap.exists())throw new Error("Non trovo questa stanza. Controlla il codice.");
      const d=snap.data();
      if(d.status!=="lobby")throw new Error("La partita è già iniziata.");
      if(!Array.isArray(d.players))throw new Error("La stanza ha dati non validi.");
      if(d.players.some(p=>p.id===playerId)){joinedData=d;return;}
      if(d.players.length>=d.maxPlayers)throw new Error("La stanza è piena.");
      const me={id:playerId,name:playerName,isBot:false,isHost:false,characterId:null,ready:false,points:0,joinedAt:Date.now(),lastSeen:Date.now()};
      tx.update(ref,{players:[...d.players,me]});joinedData={...d,players:[...d.players,me]};
    });
    roomId=code;roomData=joinedData;isHost=joinedData.hostId===playerId;attachRoom();showScreen("room");updateConnection("live");
  }catch(e){showError("Impossibile unirsi",e);}
  finally{isBusy=false;setBusy($("joinCodeBtn"),false);}
}
$("joinCodeBtn").onclick=()=>joinRoom($("roomCode").value);
$("roomCode").addEventListener("input",()=>{$("roomCode").value=$("roomCode").value.replace(/[^a-z0-9]/gi,"").toUpperCase().slice(0,6)});
$("roomCode").addEventListener("keydown",e=>{if(e.key==="Enter")$("joinCodeBtn").click()});
$("refreshLobbies").onclick=loadLobbies;
function renderLobbies(list){
  const host=$("lobbyList");
  if(!list.length){host.innerHTML='<div class="empty-state">Nessuna lobby pubblica disponibile. Puoi crearne una tu!</div>';return;}
  host.innerHTML=list.map(r=>`<div class="lobby-row"><div><b>Stanza ${escapeHtml(r.code||r.id)}</b><small>${r.players.length}/${r.maxPlayers} giocatori · ${r.totalGames} minigiochi · Host: ${escapeHtml(r.players.find(p=>p.id===r.hostId)?.name||"Host")}</small></div><button class="btn btn-secondary" data-join="${escapeHtml(r.code||r.id)}" ${r.players.length>=r.maxPlayers?"disabled":""}>ENTRA →</button></div>`).join("");
  host.querySelectorAll("[data-join]").forEach(b=>b.onclick=()=>joinRoom(b.dataset.join));
}
function loadLobbies(){
  if(unsubscribeLobbies){unsubscribeLobbies();unsubscribeLobbies=null;}
  $("lobbyList").innerHTML='<div class="empty-state">Cerco le lobby disponibili…</div>';
  try{
    unsubscribeLobbies=onSnapshot(query(collection(db,"rooms"),where("status","==","lobby")),snap=>{
      const list=snap.docs.map(d=>({id:d.id,...d.data()})).filter(r=>r.isPublic===true&&Array.isArray(r.players)&&r.players.length<r.maxPlayers).sort((a,b)=>(b.createdAt||0)-(a.createdAt||0));
      renderLobbies(list);updateConnection("live");
    },e=>{$("lobbyList").innerHTML='<div class="empty-state">Non riesco a leggere le lobby. Controlla Firestore Rules e la connessione.</div>';updateConnection(e?.code==="permission-denied"?"denied":"offline");showError("Errore nel caricamento lobby",e);});
  }catch(e){showError("Errore nel caricamento lobby",e);}
}
function startRoomPresence(){
  clearInterval(heartbeatTimer);clearInterval(cleanupTimer);
  heartbeatTimer=setInterval(async()=>{
    if(!roomId)return;
    const ref=doc(db,"rooms",roomId);
    try{await runTransaction(db,async tx=>{const snap=await tx.get(ref);if(!snap.exists())return;const d=snap.data();if(!d.players?.some(p=>p.id===playerId))return;tx.update(ref,{players:d.players.map(p=>p.id===playerId?{...p,lastSeen:Date.now()}:p)});});}
    catch(e){console.warn("Heartbeat Firestore non riuscito",e);}
  },20000);
  cleanupTimer=setInterval(async()=>{
    if(!roomId||roomData?.status!=="lobby")return;
    const ref=doc(db,"rooms",roomId),cutoff=Date.now()-75000;
    try{await runTransaction(db,async tx=>{
      const snap=await tx.get(ref);if(!snap.exists())return;const d=snap.data();if(d.status!=="lobby")return;
      const oldPlayers=d.players||[],players=oldPlayers.filter(p=>p.isBot||!p.lastSeen||p.lastSeen>cutoff);
      const hostStillHere=players.some(p=>p.id===d.hostId),newHostId=hostStillHere?d.hostId:(players.find(p=>!p.isBot)?.id||players[0]?.id);
      if(!players.length){tx.delete(ref);return;}
      if(players.length!==oldPlayers.length||newHostId!==d.hostId)tx.update(ref,{players,hostId:newHostId});
    });}
    catch(e){console.warn("Pulizia giocatori inattivi non riuscita",e);}
  },25000);
}
function attachRoom(){
  if(unsubscribeRoom)unsubscribeRoom();
  startRoomPresence();
  unsubscribeRoom=onSnapshot(doc(db,"rooms",roomId),snap=>{
    if(!snap.exists()){toast("La stanza non esiste più.");stopListeners();roomId=null;roomData=null;showScreen("menu");return;}
    const prevStatus=roomData?.status,prevGameId=roomData?.game?.id;roomData=snap.data();isHost=roomData.hostId===playerId;updateConnection("live");
    if(roomData.status==="lobby"){renderRoom();if(!$("screen-room").classList.contains("active"))showScreen("room");}
    if(roomData.status==="character"){renderCharacterScreen();if(!$("screen-character").classList.contains("active"))showScreen("character");}
    if(roomData.status==="ready"||roomData.status==="countdown"){renderReadyPhase();if(!$("screen-game").classList.contains("active"))showScreen("game");}
    if(roomData.status==="playing"){clearInterval(readyTimer);readyTimer=null;if(prevStatus!=="playing"||prevGameId!==roomData.game?.id){lastGameId=roomData.game?.id;startGameView();}else renderLiveStandings();}
    if(roomData.status==="finished"){clearInterval(readyTimer);readyTimer=null;renderFinal();showScreen("results");}
  },e=>{updateConnection(e?.code==="permission-denied"?"denied":"offline");showError("Connessione stanza interrotta",e);});
}
function renderRoom(){
  if(!roomData)return;
  $("roomCodeDisplay").textContent=roomData.code;$("roomGames").textContent=roomData.totalGames;$("roomMaxPlayers").textContent=roomData.maxPlayers;
  $("playerCount").textContent=`${roomData.players.length} / ${roomData.maxPlayers}`;
  $("roomNpcCount").textContent=Math.max(0,roomData.maxPlayers-roomData.players.length);
  $("roomSub").textContent=roomData.players.length>=roomData.maxPlayers?"La lobby è piena. Si può partire!":"Condividi il codice e aspetta gli altri giocatori.";
  $("roomPlayers").innerHTML=roomData.players.map(p=>`<div class="room-player">${avatarHtml(p)}<div style="min-width:0"><b>${escapeHtml(p.name)}</b><small>${p.id===roomData.hostId?'<span class="host-tag">HOST</span>':p.ready?"Pronto":"In attesa"}</small></div></div>`).join("");
  $("startGameBtn").style.display=isHost?"flex":"none";$("roomHostNote").textContent=isHost?"Puoi iniziare anche da solo; gli slot vuoti saranno riempiti dagli NPC.":"L'host inizierà la partita quando sarà pronto.";
  $("startHint").textContent=isHost?`${roomData.players.length} giocatore/i connesso/i.`:"Aspetta l'host.";
}
$("copyCode").onclick=async()=>{try{await navigator.clipboard.writeText(roomData.code);toast("Codice copiato!")}catch{toast(`Codice stanza: ${roomData.code}`)}};
$("leaveRoom").onclick=async()=>{
  if(!roomId)return;const old=roomId;const leavingHost=isHost;
  try{await runTransaction(db,async tx=>{const ref=doc(db,"rooms",old),snap=await tx.get(ref);if(!snap.exists())return;const d=snap.data();if(d.status!=="lobby")return;const players=(d.players||[]).filter(p=>p.id!==playerId);if(!players.length){tx.delete(ref);return;}tx.update(ref,{players,hostId:d.hostId===playerId?players[0].id:d.hostId});});}
  catch(e){showError("Problema uscendo dalla stanza",e);return;}
  stopListeners();roomId=null;roomData=null;isHost=false;showScreen("menu");
};
async function deleteRoom(code){await deleteDoc(doc(db,"rooms",code))}
$("startGameBtn").onclick=async()=>{
  if(!isHost||!roomData)return;
  try{
    const players=[...roomData.players];
    const botsNeeded=Math.max(0,roomData.maxPlayers-players.length);
    for(let i=0;i<botsNeeded;i++)players.push({id:`bot_${i}_${Math.random().toString(36).slice(2,7)}`,name:`CPU ${i+1}`,isBot:true,isHost:false,characterId:null,ready:false,points:0,joinedAt:Date.now()+i});
    await updateDoc(doc(db,"rooms",roomId),{players,status:"character",characterDeadline:Date.now()+90000,round:0,usedGames:[],results:[]});
  }catch(e){showError("Non riesco ad avviare la partita",e)}
};

function renderCharacterScreen(){
  const taken=new Set((roomData?.players||[]).filter(p=>p.id!==playerId&&p.characterId).map(p=>p.characterId));
  if(!localCharacter&&!myPlayer()?.characterId){$("characterSelectionLabel").textContent="Nessun personaggio selezionato";$("confirmCharacter").disabled=true}
  else{$("characterSelectionLabel").textContent=`Selezionato: ${characterById(localCharacter||myPlayer()?.characterId)?.name||"Personaggio"}`;$("confirmCharacter").disabled=false}
  renderCharacterGrid();
  if(!lobbyTimer){lobbyTimer=setInterval(async()=>{
    if(roomData?.status!=="character"){clearInterval(lobbyTimer);lobbyTimer=null;return}
    const left=Math.max(0,Math.ceil(((roomData.characterDeadline||Date.now()+90000)-Date.now())/1000));$("characterTimer").textContent=left;
    if(left===0&&isHost)await beginGames();
  },500)}
}
function renderCharacterGrid(){
  const taken=new Set((roomData?.players||[]).filter(p=>p.id!==playerId&&p.characterId).map(p=>p.characterId));
  const search=$("characterSearch").value.trim().toLowerCase();
  const filtered=characters.filter(c=>c.name.toLowerCase().includes(search));
  $("characterCount").textContent=`${filtered.length} personaggi`;
  $("characterGrid").innerHTML=filtered.map(c=>{const selected=(localCharacter||myPlayer()?.characterId)===c.id;const used=taken.has(c.id);return `<button class="character-card ${selected?"selected":""} ${used?"taken":""}" data-char="${c.id}" ${used?"disabled":""}><img loading="lazy" src="${c.url}" alt="${escapeHtml(c.name)}" onerror="this.style.opacity='.15';this.alt='Immagine non disponibile'">${selected?'<span class="check">✓</span>':""}<b>${escapeHtml(c.name)}${used?" · Scelto":""}</b></button>`}).join("");
  $("characterGrid").querySelectorAll("[data-char]").forEach(b=>b.onclick=()=>{localCharacter=b.dataset.char;renderCharacterGrid();$("characterSelectionLabel").textContent=`Selezionato: ${characterById(localCharacter).name}`;$("confirmCharacter").disabled=false});
}
$("characterSearch").oninput=renderCharacterGrid;
$("confirmCharacter").onclick=async()=>{
  if(!localCharacter)return;
  try{
    await runTransaction(db,async tx=>{const ref=doc(db,"rooms",roomId),snap=await tx.get(ref);if(!snap.exists())throw Error("Stanza chiusa");const d=snap.data();if(d.players.some(p=>p.id!==playerId&&p.characterId===localCharacter))throw Error("Personaggio già scelto");const players=d.players.map(p=>p.id===playerId?{...p,characterId:localCharacter,ready:true}:p);tx.update(ref,{players})});
    toast("Personaggio confermato!");
  }catch(e){showError("Non riesco a confermare",e)}
};
function scorePoints(place,n){const arr=Array.from({length:n},(_,i)=>n+2-i);return Math.max(1,arr[Math.min(place,n-1)]||1)}
async function beginGames(){
  if(!isHost||!roomData||roomData.status!=="character")return;
  try{
    let players=roomData.players.map(p=>({...p}));
    const taken=new Set(players.filter(p=>p.characterId).map(p=>p.characterId));
    for(const p of players){if(!p.characterId){const available=characters.filter(c=>!taken.has(c.id));const c=available[Math.floor(Math.random()*available.length)];p.characterId=c.id;taken.add(c.id)}}
    const next=makeGame(0,players),now=Date.now();
    await updateDoc(doc(db,"rooms",roomId),{players,status:"ready",round:1,game:next.game,usedGames:next.usedGames,readyPlayers:players.filter(p=>p.isBot).map(p=>p.id),readyStartedAt:now,countdownStartedAt:null,gameStartedAt:null,results:[]});
  }catch(e){showError("Avvio minigiochi non riuscito",e)}
}

const READY_COOLDOWN_MS=4000, READY_COUNTDOWN_MS=3000;
function npcProfile(player){
  const bots=(roomData?.players||[]).filter(p=>p.isBot),index=Math.max(0,bots.findIndex(p=>p.id===player.id));
  const profiles=[
    {style:"prudente",reaction:0.76,accuracy:0.72,clickRate:0.66},
    {style:"equilibrato",reaction:0.60,accuracy:0.58,clickRate:0.78},
    {style:"aggressivo",reaction:0.42,accuracy:0.45,clickRate:0.92},
    {style:"fortunato",reaction:0.55,accuracy:0.52,clickRate:0.73},
    {style:"stratega",reaction:0.82,accuracy:0.80,clickRate:0.70}
  ];
  return profiles[index%profiles.length];
}

async function confirmMinigameReady(){
  if(!roomId||!roomData||roomData.status!=="ready")return;
  try{
    await runTransaction(db,async tx=>{
      const ref=doc(db,"rooms",roomId),snap=await tx.get(ref);if(!snap.exists())throw Error("Stanza non disponibile");
      const d=snap.data();if(d.status!=="ready")return;
      const humans=(d.players||[]).filter(p=>!p.isBot).map(p=>p.id);
      const ready=[...new Set([...(d.readyPlayers||[]),playerId])];
      if(!humans.includes(playerId))return;
      tx.update(ref,{readyPlayers:ready});
    });
  }catch(e){showError("Non riesco a registrare il tuo PRONTO",e)}
}
function renderReadyPhase(){
  if(!roomData?.game)return;
  const d=roomData,humans=(d.players||[]).filter(p=>!p.isBot),ready=new Set(d.readyPlayers||[]);
  const allReady=humans.every(p=>ready.has(p.id));
  const elapsed=Math.max(0,Date.now()-(d.readyStartedAt||Date.now()));
  const cooldownLeft=Math.max(0,Math.ceil((READY_COOLDOWN_MS-elapsed)/1000));
  const countdownLeft=d.status==="countdown"?Math.max(0,Math.ceil(READY_COUNTDOWN_MS-(Date.now()-(d.countdownStartedAt||Date.now())))/1000):0;
  $("gameRoundLabel").textContent=`ROUND ${d.round} / ${d.totalGames}`;
  $("gameTitle").textContent=d.game.name;
  $("gameDescription").textContent=d.game.description;
  renderLiveStandings();
  const roster=humans.map(p=>`<div class="ready-player"><span class="ready-dot ${ready.has(p.id)?"is-ready":""}">${ready.has(p.id)?"✓":"…"}</span><span>${escapeHtml(p.name)}${p.id===playerId?" (tu)":""}</span><b>${ready.has(p.id)?"PRONTO":"IN ATTESA"}</b></div>`).join("");
  let body="";
  if(d.status==="countdown"){
    body=`<div class="ready-stage"><div class="ready-eyebrow">TUTTI PRONTI!</div><div class="ready-countdown">${countdownLeft||"VIA!"}</div><h3>Si parte tra pochissimo…</h3><p>Preparati: il minigioco sta per iniziare.</p></div>`;
  }else{
    body=`<div class="ready-stage"><div class="ready-icon">🎮</div><div class="ready-eyebrow">PROSSIMO MINIGIOCO</div><h3>${escapeHtml(d.game.name)}</h3><p>${escapeHtml(d.game.description)}</p><div class="ready-cooldown">${cooldownLeft>0?`Pausa iniziale: ${cooldownLeft} secondi`:`Prendi posto e conferma quando sei pronto.`}</div></div><div class="ready-roster"><h4>CONFERME DEI GIOCATORI</h4>${roster}</div><button id="readyConfirmBtn" class="btn btn-primary btn-wide ready-confirm" ${ready.has(playerId)?"disabled":""}>${ready.has(playerId)?"✓ SEI PRONTO":"SONO PRONTO!"}</button><p class="ready-footnote">Il countdown di 3 secondi parte solo dopo la pausa e quando tutti gli umani hanno premuto PRONTO. Gli NPC confermano automaticamente.</p>`;
  }
  $("gameMain").innerHTML=body;
  $("gameFooter").innerHTML=d.status==="countdown"?`<span>Countdown sincronizzato per tutta la stanza.</span>`:`<span>${ready.size}/${humans.length} giocatori pronti.</span>`;
  const btn=$("readyConfirmBtn");if(btn)btn.onclick=confirmMinigameReady;
  if(!readyTimer)readyTimer=setInterval(async()=>{
    if(!roomData||!roomId||!["ready","countdown"].includes(roomData.status)){clearInterval(readyTimer);readyTimer=null;return;}
    if(!isHost)return;
    try{
      const ref=doc(db,"rooms",roomId);
      if(roomData.status==="ready"){
        const current=roomData,people=(current.players||[]).filter(p=>!p.isBot),ok=people.every(p=>(current.readyPlayers||[]).includes(p.id));
        if(ok&&Date.now()-(current.readyStartedAt||0)>=READY_COOLDOWN_MS){await runTransaction(db,async tx=>{const snap=await tx.get(ref);if(!snap.exists())return;const x=snap.data();if(x.status!=="ready")return;const hs=(x.players||[]).filter(p=>!p.isBot);if(hs.every(p=>(x.readyPlayers||[]).includes(p.id))&&Date.now()-(x.readyStartedAt||0)>=READY_COOLDOWN_MS)tx.update(ref,{status:"countdown",countdownStartedAt:Date.now()});});}
      }else if(roomData.status==="countdown"&&Date.now()-(roomData.countdownStartedAt||Date.now())>=READY_COUNTDOWN_MS){
        await runTransaction(db,async tx=>{const snap=await tx.get(ref);if(!snap.exists())return;const x=snap.data();if(x.status!=="countdown"||Date.now()-(x.countdownStartedAt||Date.now())<READY_COUNTDOWN_MS)return;tx.update(ref,{status:"playing",gameStartedAt:Date.now(),"game.startedAt":Date.now()});});
      }
    }catch(e){console.warn("Gestione ready/countdown non riuscita",e)}
    const now=Date.now();
    const countNode=$("gameMain").querySelector(".ready-countdown");
    if(countNode&&roomData?.status==="countdown"){const left=Math.max(0,Math.ceil(READY_COUNTDOWN_MS-(now-(roomData.countdownStartedAt||now)))/1000);countNode.textContent=left||"VIA!";}
    const coolNode=$("gameMain").querySelector(".ready-cooldown");
    if(coolNode&&roomData?.status==="ready"){const left=Math.max(0,Math.ceil((READY_COOLDOWN_MS-(now-(roomData.readyStartedAt||now)))/1000));coolNode.textContent=left>0?`Pausa iniziale: ${left} secondi`:"Prendi posto e conferma quando sei pronto.";}
  },250);
}

function makeGame(round,players){
  const used=[...(roomData?.usedGames||[])];let pool=minigames.filter(g=>!used.includes(g.id));if(!pool.length){used.length=0;pool=[...minigames]}
  const game=pool[Math.floor(Math.random()*pool.length)];
  used.push(game.id);
  let state={id:`${round}_${Date.now()}`,type:game.id,name:game.name,description:game.description,startedAt:Date.now(),finishedPlayers:[],scores:{},state:{}};
  if(game.id==="memory"){const icons=shuffle(["🍓","🍓","🍋","🍋","🍇","🍇","🍉","🍉","🍒","🍒","🥝","🥝","🍍","🍍","🥥","🥥","🍑","🍑","🍊","🍊","🫐","🫐","🍐","🍐","🥕","🥕","🌽","🌽","🍄","🍄","🌶️","🌶️","🥑","🥑","🍪","🍪"]);state.state={tiles:shuffle(icons).map((v,i)=>({id:i,value:v})),matched:[],moves:0};}
  if(game.id==="hide"){state.state={phase:"hide",round:0,turnOrder:shuffle(players.map(p=>p.id)),hides:{},found:[],hunterIndex:0,spots:["🌳","🛝","🪨","🌷","🛖","🌲","🧸","⛲"],scores:{}}}
  if(game.id==="fortunflipper"){state.state={positions:Object.fromEntries(players.map(p=>[p.id,0])),stuck:{},released:{},finished:[],selected:{},started:false};}
  if(game.id==="goose"){state.state={positions:Object.fromEntries(players.map(p=>[p.id,0])),turn:0,skip:{},extra:false,finished:[],board:makeGooseBoard()};}
  if(game.id==="click"){state.state={progress:Object.fromEntries(players.map(p=>[p.id,0])),red:false,phaseUntil:Date.now()+3000,startedAt:Date.now(),finished:[]};}
  if(game.id==="pigs"){const colors=["rosa","azzurro","verde","giallo","viola","arancio","rosso","turchese","blu","lime","fucsia","marrone"];state.state={pigs:shuffle(colors).slice(0,Math.min(12,players.length+1)).map((color,i)=>({color,pos:0,id:i})),bets:{},deck:shuffle(Array.from({length:Math.max(50,players.length*10)},()=>Math.floor(Math.random()*Math.min(12,players.length+1)))),drawn:0,phase:"bet",finished:[]};}
  if(game.id==="meteor"){state.state={scores:Object.fromEntries(players.map(p=>[p.id,0])),deadline:Date.now()+30000,targets:[],nextTargetId:1,finished:[]};}
  return {game,usedGames:used};
}
function makeGooseBoard(){
  const b=Array.from({length:62},(_,i)=>({n:i+1,type:"normal"}));
  [[5,"back2"],[11,"forward2"],[17,"back3"],[21,"forward3"],[27,"back2"],[31,"again"],[35,"stop2"],[39,"forward2"],[43,"back3"],[47,"back2"],[48,"start32"],[51,"again"],[54,"stop3"],[57,"forward3"]].forEach(([n,type])=>b[n-1].type=type);
  return b;
}
function startGameView(){
  if(!roomData?.game)return;gameLocal={};clearInterval(localTimer);localTimer=null;
  const g=roomData.game;
  $("gameRoundLabel").textContent=`ROUND ${roomData.round} / ${roomData.totalGames}`;$("gameTitle").textContent=g.name;$("gameDescription").textContent=g.description;
  $("myPoints").textContent=myPlayer()?.points||0;renderLiveStandings();showScreen("game");renderGame();
}
function renderLiveStandings(){
  if(!roomData)return;
  $("liveStandings").innerHTML=sortedPlayers().map((p,i)=>`<div class="standings-item"><span class="rank-number">${i+1}</span>${characterById(p.characterId)?`<img class="standings-avatar" src="${characterById(p.characterId).url}" alt="">`:'<span class="standings-avatar"></span>'}<span class="standings-name">${escapeHtml(p.name)}</span><span class="standings-points">${p.points||0}</span></div>`).join("");
  $("myPoints").textContent=myPlayer()?.points||0;
}
function renderGame(){
  if(!roomData?.game)return;
  const g=roomData.game;
  if(g.type==="memory")return renderMemory();
  if(g.type==="hide")return renderHide();
  if(g.type==="fortunflipper")return renderFortunflipper();
  if(g.type==="goose")return renderGoose();
  if(g.type==="click")return renderClick();
  if(g.type==="pigs")return renderPigs();
  if(g.type==="meteor")return renderMeteor();
}
function updateGameState(next){return updateDoc(doc(db,"rooms",roomId),{"game.state":next})}
function renderMemory(){
  const s=roomData.game.state;const me=playerId;const matched=new Set(s.matched||[]);const open=gameLocal.open||[];const busy=(gameLocal.busyUntil||0)>Date.now();
  $("gameMain").innerHTML=`<div class="memory-status">Coppie trovate: <b>${matched.size/2} / 18</b> · Mosse: ${gameLocal.moves||0} ${busy?"· Attendi…":""}</div><div class="memory-layout">${s.tiles.map(t=>`<button class="memory-tile ${matched.has(t.id)?"matched":open.includes(t.id)?"open":""}" data-tile="${t.id}" ${matched.has(t.id)||open.includes(t.id)||busy||s.finishedPlayers.includes(me)?"disabled":""}>${matched.has(t.id)||open.includes(t.id)?t.value:"?"}</button>`).join("")}</div><p class="game-instructions">La tua griglia è personale; la barra laterale mostra i progressi del torneo.</p>`;
  $("gameMain").querySelectorAll("[data-tile]").forEach(b=>b.onclick=()=>memoryFlip(Number(b.dataset.tile)));
  $("gameFooter").innerHTML=`<span>${s.finishedPlayers.includes(me)?"Hai completato il Memory!": "Trova le 18 coppie."}</span><button class="btn btn-secondary" id="finishMemory" ${s.finishedPlayers.includes(me)?"disabled":""}>Termina test</button>`;
  $("finishMemory").onclick=()=>finishMinigame(me,1);
}
async function memoryFlip(id){
  const g=roomData.game,s=g.state;const matched=new Set(s.matched||[]);if(matched.has(id)||gameLocal.open?.includes(id)||(gameLocal.busyUntil||0)>Date.now())return;
  const open=[...(gameLocal.open||[]),id];gameLocal.open=open;renderMemory();
  if(open.length===2){
    const [a,b]=open.map(i=>s.tiles.find(t=>t.id===i));
    if(a.value===b.value){
      const next=[...matched,a.id,b.id];gameLocal.open=[];
      if(isHost){await updateGameState({...s,matched:next,moves:(s.moves||0)+1})}
      else { // Le coppie e i turni sono inviati in Firestore; una griglia condivisa è solo una base multiplayer.
        await updateGameState({...s,matched:next,moves:(s.moves||0)+1});
      }
      if(next.length===36)await finishMinigame(playerId,roomData.players.length);
    }else{
      gameLocal.busyUntil=Date.now()+2000;setTimeout(()=>{gameLocal.open=[];gameLocal.busyUntil=0;if(roomData?.game?.type==="memory")renderMemory()},2000);
    }
  }
}
async function renderHide(){
  const s=roomData.game.state;const me=myPlayer();const order=s.turnOrder||[];const hunter=order[s.hunterIndex||0];const phase=s.phase||"hide";const isHunter=hunter===playerId;
  if(!gameLocal.hideChoice)gameLocal.hideChoice={};
  $("gameMain").innerHTML=`<div class="result-banner"><b>${phase==="hide"?"🌿 FASE NASCONDINO":"🔎 FASE DEL CACCIATORE"}</b><p>${phase==="hide"?(isHunter?"Sei il cacciatore: attendi che gli altri si nascondano.":"Scegli una postazione in cui nasconderti."):(isHunter?"Scegli fino a 4 postazioni da controllare.":"Il cacciatore sta cercando…")}</p><strong>${phase==="hide"?"15 secondi per nascondersi":"Il cacciatore sceglie 4 postazioni"}</strong></div><div class="hide-stage">${s.spots.map((spot,i)=>`<button class="hide-spot ${gameLocal.hideChoice[me?.id]===i?"chosen":""}" data-spot="${i}">${spot}<small>POSTO ${i+1}</small></button>`).join("")}</div><p class="game-instructions">${s.found?.length?`Trovati in questo round: ${s.found.length}`:"I PNG saranno rivelati quando il cacciatore controlla una postazione."}</p><button id="hideAction" class="big-center-button">${phase==="hide"?"CONFERMA NASCONDIGLIO":"CONTROLLA POSTAZIONI"}</button>`;
  $("gameMain").querySelectorAll("[data-spot]").forEach(b=>b.onclick=()=>{gameLocal.hideChoice[me.id]=Number(b.dataset.spot);renderHide()});
  $("hideAction").onclick=async()=>{
    if(!isHost){toast("In questa prima versione l'host coordina il round.");return}
    const next={...s};
    if(phase==="hide"){next.hides={...s.hides,[me.id]:gameLocal.hideChoice[me.id]??Math.floor(Math.random()*8)};for(const bot of roomData.players.filter(p=>p.isBot&&!next.hides[p.id])){const profile=npcProfile(bot);next.hides[bot.id]=Math.floor(Math.pow(Math.random(),profile.accuracy)*s.spots.length)%s.spots.length;}next.phase="seek";next.seekDeadline=Date.now()+20000}
    else{const picks=Object.values(gameLocal.seekChoice||{}).slice(0,4);next.found=Object.entries(s.hides).filter(([id,spot])=>picks.includes(spot)).map(([id])=>id);next.phase="results"}
    await updateGameState(next);renderHide();
  };
}
async function renderFortunflipper(){
  const s=roomData.game.state;const ps=roomData.players;
  if(!gameLocal.flipperSelected)gameLocal.flipperSelected={};
  const lanes=ps.map((p,i)=>{const pos=s.positions[p.id]||0;return `<div class="race-lane"><span class="race-label">${escapeHtml(p.name)}</span><div class="race-rail"><div class="race-pig" style="left:${Math.min(90,pos)}%;background:${["#ff83bd","#75d8e8","#8fe2a9","#ffd36b","#b7a1ff"][i%5]}">${characterById(p.characterId)?`<img src="${characterById(p.characterId).url}" style="width:100%;height:100%;object-fit:cover;border-radius:50%">`:"⚪"}</div><div class="race-finish"></div></div><span class="race-pos">${Math.floor(pos)}%</span></div>`}).join("");
  $("gameMain").innerHTML=`<div class="result-banner"><b>🎱 SCEGLI LA TUA BIGLIA</b><p>Una biglia in più rispetto ai giocatori. La corsa si svolge in modo automatico.</p></div><div class="race-track">${lanes}</div><button id="flipperBtn" class="big-center-button">${s.started?"LIBERATI / AVANZA":"ENTRA NELLA BIGLIA E PARTI"}</button><p class="game-instructions">${s.stuck?.[playerId]?"Sei incastrato! Clicca 10 volte per liberarti.":s.started?"Le biglie rotolano… fai clic per accelerare leggermente.":"Gli NPC scelgono la loro biglia con calma."}</p>`;
  $("flipperBtn").onclick=async()=>{
    if(!isHost){toast("La corsa è condivisa; l'host avvia il movimento.");return}
    let next={...s,positions:{...s.positions},started:true,stuck:{...s.stuck}};
    if(!s.started){ps.forEach(p=>next.positions[p.id]=Math.random()*5);await updateGameState(next);return}
    if(next.stuck[playerId]){next.released={...next.released,[playerId]:(next.released[playerId]||0)+1};if(next.released[playerId]>=10){delete next.stuck[playerId];next.released[playerId]=0}await updateGameState(next);return}
    next.positions[playerId]=Math.min(100,(next.positions[playerId]||0)+4);
    for(const p of ps.filter(p=>p.isBot))next.positions[p.id]=Math.min(100,(next.positions[p.id]||0)+Math.random()*8);
    for(const p of ps){if(next.positions[p.id]>=100&&!next.finished.includes(p.id))next.finished.push(p.id)}
    await updateGameState(next);
    if(next.finished.length>=ps.length-1)await finishMinigame(playerId,ps.length);
  };
  if(isHost&&!localTimer&&s.started){localTimer=setInterval(async()=>{if(roomData?.game?.type!=="fortunflipper"){clearInterval(localTimer);localTimer=null;return}const st=roomData.game.state;const next={...st,positions:{...st.positions},finished:[...(st.finished||[])]};for(const p of roomData.players){if(!next.finished.includes(p.id)){let profile=p.isBot?npcProfile(p):null;let delta=p.isBot?1+Math.random()*(profile?.reaction?profile.reaction*6:4):Math.random()*2.5;next.positions[p.id]=Math.min(100,(next.positions[p.id]||0)+delta);if(next.positions[p.id]>=100)next.finished.push(p.id)}}await updateGameState(next);if(next.finished.length>=roomData.players.length-1){clearInterval(localTimer);localTimer=null;finishMinigame(null,roomData.players.length)}},1000)}
}
async function renderGoose(){
  const s=roomData.game.state;const ps=roomData.players;const active=ps[(s.turn||0)%ps.length];const positions=s.positions||{};
  const cells=s.board.map(cell=>{const here=ps.filter(p=>positions[p.id]===cell.n-1);const label=({back2:"−2",forward2:"+2",back3:"−3",forward3:"+3",again:"↻",stop2:"⏸2",stop3:"⏸3",start32:"32"})[cell.type]||cell.n;return `<div class="goose-cell ${cell.type!=="normal"?"special":""}">${label}${here.map(p=>`<span class="pawn" title="${escapeHtml(p.name)}">${characterById(p.characterId)?`<img src="${characterById(p.characterId).url}" style="width:20px;height:20px;object-fit:cover;border-radius:50%">`:"●"}</span>`).join("")}</div>`}).join("");
  $("gameMain").innerHTML=`<div class="result-banner"><b>🎲 ${escapeHtml(active?.name||"Giocatore")} ${active?.id===playerId?"(tocca a te)": "sta giocando"}</b><p>Due dadi, 62 caselle, fortuna a ogni lancio.</p><strong>Casella ${Math.min(62,(positions[active?.id]||0)+1)} / 62</strong></div><div class="board-wrap"><div class="goose-board">${cells}</div></div><button id="rollDice" class="big-center-button" ${active?.id!==playerId?"disabled":""}>🎲 LANCIA I DADI</button><p id="diceResult" class="game-instructions">Il turno passa al giocatore successivo.</p>`;
  $("rollDice").onclick=async()=>{
    const d1=1+Math.floor(Math.random()*6),d2=1+Math.floor(Math.random()*6);let next={...s,positions:{...positions},skip:{...s.skip},finished:[...(s.finished||[])]};let pos=(next.positions[playerId]||0)+d1+d2;pos=Math.min(61,pos);let type=next.board[pos]?.type;
    if(type==="back2")pos=Math.max(0,pos-2);if(type==="forward2")pos=Math.min(61,pos+2);if(type==="back3")pos=Math.max(0,pos-3);if(type==="forward3")pos=Math.min(61,pos+3);if(type==="start32")pos=31;if(type==="stop2")next.skip[playerId]=2;if(type==="stop3")next.skip[playerId]=3;
    next.positions[playerId]=pos;if(pos>=61&&!next.finished.includes(playerId))next.finished.push(playerId);
    next.turn=(next.turn+1)%ps.length;if(type==="again")next.turn=(next.turn-1+ps.length)%ps.length;
    await updateGameState(next);$("diceResult").textContent=`Hai fatto ${d1} + ${d2} = ${d1+d2}. ${type==="normal"?"":`Casella speciale: ${type}.`}`;
    if(next.finished.length>=ps.length-1)await finishMinigame(playerId,ps.length);
  };
  if(isHost&&!localTimer){localTimer=setInterval(async()=>{if(roomData?.game?.type!=="goose"){clearInterval(localTimer);localTimer=null;return}const st=roomData.game.state;const current=roomData.players[(st.turn||0)%roomData.players.length];if(current?.isBot){const dice=2+Math.floor(Math.random()*11);const next={...st,positions:{...st.positions},turn:(st.turn+1)%roomData.players.length,finished:[...(st.finished||[])]};next.positions[current.id]=Math.min(61,(next.positions[current.id]||0)+dice);if(next.positions[current.id]>=61&&!next.finished.includes(current.id))next.finished.push(current.id);await updateGameState(next);if(next.finished.length>=roomData.players.length-1)finishMinigame(null,roomData.players.length)}},1200)}
}
async function renderClick(){
  const s=roomData.game.state;const progress=s.progress||{};const me=progress[playerId]||0;const red=s.red;
  $("gameMain").innerHTML=`<div class="click-race"><div class="result-banner"><b>🚦 ${red?"LUCE ROSSA!":"LUCE VERDE!"}</b><p>${red?"FERMATI! Cliccare costa 10 punti.":"Clicca più velocemente che puoi."}</p></div><h3>${me} / 100 click</h3><div class="click-bar"><div class="click-bar-fill" style="width:${Math.min(100,me)}%"></div></div><button id="clickButton" class="click-button ${red?"redlight":"greenlight"}">${red?"STOP!":"CLICCA!"}</button><p class="game-instructions">I bot avanzano a velocità diverse. Il rosso cambia ogni pochi secondi.</p></div>`;
  $("clickButton").onclick=async()=>{const next={...s,progress:{...progress}};next.progress[playerId]=Math.max(0,me+(red?-10:1));await updateGameState(next);if(next.progress[playerId]>=100)await finishMinigame(playerId,roomData.players.length)};
  if(isHost&&!localTimer){localTimer=setInterval(async()=>{if(roomData?.game?.type!=="click"){clearInterval(localTimer);localTimer=null;return}const st=roomData.game.state;const next={...st,red:Math.random()<.35,progress:{...st.progress}};for(const p of roomData.players.filter(p=>p.isBot)){const profile=npcProfile(p);next.progress[p.id]=Math.min(100,(next.progress[p.id]||0)+(Math.random()<profile.clickRate?1:0));}await updateGameState(next);if(Object.values(next.progress).filter(v=>v>=100).length>=roomData.players.length-1){clearInterval(localTimer);localTimer=null;finishMinigame(null,roomData.players.length)}},1800)}
}
const pigEmoji={rosa:"🐷",azzurro:"🐽",verde:"🐖",giallo:"🐷",viola:"🐽",arancio:"🐖",rosso:"🐷",turchese:"🐽",blu:"🐖",lime:"🐷",fucsia:"🐽",marrone:"🐖"};
async function renderPigs(){
  const s=roomData.game.state;const me=myPlayer();const pigs=s.pigs||[];
  $("gameMain").innerHTML=s.phase==="bet"?`<div class="result-banner"><b>🐷 SCEGLI IL TUO MAIALE</b><p>Una scommessa per giocatore. Gli NPC scelgono casualmente.</p></div><div class="pig-choice-grid">${pigs.map(p=>`<button class="pig-choice ${s.bets[playerId]===p.id?"chosen":""}" data-pig="${p.id}"><span>${pigEmoji[p.color]||"🐷"}</span><small>${p.color.toUpperCase()}</small></button>`).join("")}</div><button id="pigConfirm" class="big-center-button">CONFERMA SCOMMESSA</button>`:`<div class="result-banner"><b>🏁 LA CORSA È INIZIATA</b><p>Carta pescata ${s.drawn} · vince il primo maiale al traguardo.</p></div><div class="race-track">${pigs.map(p=>`<div class="race-lane"><span class="race-label">${pigEmoji[p.color]} ${p.color}</span><div class="race-rail"><div class="race-pig" style="left:${Math.min(90,p.pos*9)}%;background:${p.color}">${pigEmoji[p.color]}</div><div class="race-finish"></div></div><span class="race-pos">${p.pos}/10</span></div>`).join("")}</div><button id="drawPigCard" class="big-center-button" ${!isHost?"disabled":""}>🃏 PESCA UNA CARTA</button>`;
  if(s.phase==="bet"){
    $("gameMain").querySelectorAll("[data-pig]").forEach(b=>b.onclick=()=>{gameLocal.pig=Number(b.dataset.pig);$("gameMain").querySelectorAll("[data-pig]").forEach(x=>x.classList.toggle("chosen",Number(x.dataset.pig)===gameLocal.pig))});
    $("pigConfirm").onclick=async()=>{if(gameLocal.pig==null){toast("Scegli un maiale prima di confermare.");return}const next={...s,bets:{...s.bets,[playerId]:gameLocal.pig}};if(isHost)for(const p of roomData.players.filter(p=>p.isBot)){const profile=npcProfile(p);next.bets[p.id]=Math.floor(Math.pow(Math.random(),profile.style==="aggressivo"?.75:profile.style==="prudente"?1.25:1)*pigs.length)%pigs.length;}if(Object.keys(next.bets).length>=roomData.players.length){next.phase="race"}await updateGameState(next)};
  }else $("drawPigCard").onclick=async()=>{const next={...s,pigs:s.pigs.map(p=>({...p})),drawn:s.drawn+1};const idx=s.deck[s.drawn%s.deck.length]%next.pigs.length;next.pigs[idx].pos++;await updateGameState(next);if(next.pigs[idx].pos>=10||next.drawn>=s.deck.length)await finishMinigame(null,roomData.players.length)};
  if(isHost&&s.phase==="bet"&&!localTimer){localTimer=setInterval(async()=>{if(roomData?.game?.type!=="pigs"||roomData.game.state.phase!=="bet"){clearInterval(localTimer);localTimer=null;return}const st=roomData.game.state;const next={...st,bets:{...st.bets}};for(const p of roomData.players.filter(p=>p.isBot))if(next.bets[p.id]==null){const profile=npcProfile(p);next.bets[p.id]=Math.floor(Math.pow(Math.random(),profile.style==="aggressivo"?.75:profile.style==="prudente"?1.25:1)*st.pigs.length)%st.pigs.length;}if(Object.keys(next.bets).length>=roomData.players.length){next.phase="race";clearInterval(localTimer);localTimer=null}await updateGameState(next)},1500)}
}
async function renderMeteor(){
  const s=roomData.game.state,targets=s.targets||[];
  const remaining=Math.max(0,Math.ceil(((s.deadline||Date.now())-Date.now())/1000));
  $("gameMain").innerHTML=`<div class="result-banner"><b>🌠 PIOGGIA DI STELLE</b><p>Clicca le stelle, evita le meteore. Le stelle dorate valgono 3 punti, le meteore tolgono 2.</p><strong>Il tuo punteggio: ${s.scores?.[playerId]||0} · ${remaining}s</strong></div><div class="hide-stage meteor-field" style="background:linear-gradient(#24244d,#101024);min-height:260px">${Array.from({length:12},(_,i)=>{const t=targets.find(t=>t.slot===i);return `<button class="hide-spot" data-target="${i}" style="background:${t?(t.kind==="meteor"?"#d94c72":t.kind==="gold"?"#d7a638":"#5b72d9"):"#272544"}" ${!t?"disabled":""}>${t?(t.kind==="meteor"?"☄️":t.kind==="gold"?"🌟":"⭐"):"·"}</button>`}).join("")}</div><p class="game-instructions">Le stelle appaiono in posizioni diverse e spariscono dopo poco. Anche gli NPC raccolgono bersagli.</p>`;
  $("gameMain").querySelectorAll("[data-target]").forEach(b=>b.onclick=async()=>{
    const slot=Number(b.dataset.target);
    try{await runTransaction(db,async tx=>{const ref=doc(db,"rooms",roomId),snap=await tx.get(ref);if(!snap.exists())return;const d=snap.data();if(d.status!=="playing"||d.game?.id!==roomData.game.id)return;const st=d.game.state,hit=(st.targets||[]).find(t=>t.slot===slot);if(!hit)return;const next={...st,scores:{...st.scores},targets:st.targets.filter(t=>t.id!==hit.id)};next.scores[playerId]=(next.scores[playerId]||0)+(hit.kind==="meteor"?-2:hit.kind==="gold"?3:1);tx.update(ref,{"game.state":next});});}catch(e){console.warn("Raccolta bersaglio non riuscita",e)}
  });
  if(isHost&&!localTimer){localTimer=setInterval(async()=>{
    if(roomData?.game?.type!=="meteor"||roomData.status!=="playing"){clearInterval(localTimer);localTimer=null;return;}
    try{
      const ref=doc(db,"rooms",roomId);
      await runTransaction(db,async tx=>{
        const snap=await tx.get(ref);if(!snap.exists())return;const d=snap.data();if(d.status!=="playing"||d.game?.type!=="meteor")return;
        const st=d.game.state,now=Date.now();if(now>st.deadline){tx.update(ref,{"game.state.deadline":now-1});return;}
        let targets=(st.targets||[]).filter(t=>t.expiresAt>now);const used=new Set(targets.map(t=>t.slot));
        if(targets.length<6){const free=Array.from({length:12},(_,i)=>i).filter(i=>!used.has(i));shuffle(free).slice(0,Math.min(2,free.length)).forEach(slot=>{const r=Math.random();targets.push({id:st.nextTargetId++,slot,kind:r<.14?"meteor":r<.27?"gold":"star",expiresAt:now+1700});});}
        const scores={...(st.scores||{})};
        for(const bot of (d.players||[]).filter(p=>p.isBot)){
          const profile=npcProfile(bot),available=targets.filter(t=>t.kind!=="meteor"||Math.random()>(profile.accuracy*.45));
          if(available.length&&Math.random()<profile.reaction){const target=available[Math.floor(Math.random()*available.length)];targets=targets.filter(t=>t.id!==target.id);scores[bot.id]=(scores[bot.id]||0)+(target.kind==="gold"?3:1);}
        }
        tx.update(ref,{"game.state.targets":targets,"game.state.scores":scores,"game.state.nextTargetId":st.nextTargetId});
      });
      if(roomData?.game?.state?.deadline&&Date.now()>=roomData.game.state.deadline){clearInterval(localTimer);localTimer=null;await finishMinigame(null,roomData.players.length);}
    }catch(e){console.warn("Aggiornamento Pioggia di stelle non riuscito",e)}
  },650)}
}

async function finishMinigame(finishedId,placeGuess){
  if(!isHost)return;
  const g=roomData?.game;if(!g)return;
  try{
    const ref=doc(db,"rooms",roomId);
    await runTransaction(db,async tx=>{
      const snap=await tx.get(ref);if(!snap.exists())return;const d=snap.data();if(d.status!=="playing"||d.game?.id!==g.id)return;
      const players=[...d.players];const order=[...players].sort((a,b)=>{
        const state=d.game.state||{};
        if(g.type==="memory")return (state.matched?.length||0)-(state.matched?.length||0);
        if(g.type==="click")return (state.progress?.[b.id]||0)-(state.progress?.[a.id]||0);
        if(g.type==="meteor")return (state.scores?.[b.id]||0)-(state.scores?.[a.id]||0);
        if(g.type==="goose")return (state.positions?.[b.id]||0)-(state.positions?.[a.id]||0);
        if(g.type==="fortunflipper")return (state.positions?.[b.id]||0)-(state.positions?.[a.id]||0);
        return (b.points||0)-(a.points||0)
      });
      const already=d.game.finishedPlayers||[];
      if(finishedId&&!already.includes(finishedId))already.push(finishedId);
      const ranked=order.filter(p=>already.includes(p.id));for(const p of order)if(!ranked.includes(p))ranked.push(p);
      players.forEach(p=>{const place=ranked.findIndex(x=>x.id===p.id);p.points=(p.points||0)+scorePoints(place,players.length)});
      const result={round:d.round,name:d.game.name,ranking:ranked.map((p,i)=>({id:p.id,name:p.name,characterId:p.characterId,place:i+1,points:scorePoints(i,players.length)}))};
      const nextRound=d.round+1;
      if(nextRound>d.totalGames){tx.update(ref,{players,status:"finished",results:[...(d.results||[]),result],game:null});return}
      const nextGame=makeGame(nextRound-1,players),now=Date.now();
      tx.update(ref,{players,status:"ready",round:nextRound,game:nextGame.game,usedGames:nextGame.usedGames,readyPlayers:players.filter(p=>p.isBot).map(p=>p.id),readyStartedAt:now,countdownStartedAt:null,gameStartedAt:null,results:[...(d.results||[]),result]});
    });
  }catch(e){showError("Fine minigioco non riuscita",e)}
}
function renderFinal(){
  const ps=sortedPlayers();$("winnerTitle").textContent=ps[0]?`${ps[0].name} vince il torneo!`:"Torneo completato";
  $("finalStandings").innerHTML=ps.map((p,i)=>`<div class="final-row"><span class="final-rank">${i+1}</span>${characterById(p.characterId)?`<img src="${characterById(p.characterId).url}" alt="">`:'<span>🎭</span>'}<div class="final-name"><b>${escapeHtml(p.name)}</b><small>${p.isBot?"NPC · ":""}${p.points||0} punti</small></div><strong class="final-score">${p.points||0}</strong></div>`).join("");
}
$("returnMenu").onclick=()=>{stopListeners();roomId=null;roomData=null;showScreen("menu")};
window.addEventListener("beforeunload",()=>stopListeners());

// Verifica subito il collegamento a Firestore, senza aspettare la creazione di una stanza.
checkFirebaseConnection();
