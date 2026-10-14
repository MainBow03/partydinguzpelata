# Caos Club — starter party game

Starter senza build: HTML/CSS/JavaScript a moduli, Firebase Firestore e GitHub Pages.

## Dentro questa base

- Menu iniziale e scelta nome.
- Creazione stanza Torneo: 3–10 giocatori, 1–32 minigiochi, lobby pubblica/privata.
- Ingresso con codice e ricerca delle lobby pubbliche.
- Lobby live Firestore, codice condivisibile e riempimento slot vuoti con NPC.
- Selezione personaggio da roster, con blocco dei personaggi già scelti.
- Ciclo round, punti, classifica finale.
- Prototipi giocabili dei minigiochi Memory, Nascondino, Fortunflipper, Gioco dell'oca, Clicca il bottone, Scommessa dei maiali e Pioggia di stelle.

## Pubblicazione su GitHub Pages

1. Crea un repository GitHub e carica `index.html`, `styles.css`, `app.js` e `firestore.rules`.
2. In **Settings → Pages**, scegli il branch principale e la cartella `/ (root)`.
3. Apri l'URL Pages dopo la pubblicazione.

Non serve npm o una fase di compilazione. Firebase è importato da CDN.

## Firebase

1. Apri Firebase Console → progetto `mario-party-style-game`.
2. Crea/attiva **Cloud Firestore**.
3. Per test locali puoi applicare le regole in `firestore.rules`, sapendo che sono volutamente aperte e NON sicure.
4. Verifica in **Authentication** e configura regole adeguate prima di condividere pubblicamente il gioco.

La configurazione Firebase web è inclusa in `app.js`. Le chiavi web Firebase non sono password; le regole Firestore sono la barriera di sicurezza.

## Importante: stato del prototipo

Questa è una base iniziale da testare, non ancora una release affidabile per un torneo competitivo. I minigiochi sono prototipi: alcune meccaniche (soprattutto Nascondino e sincronizzazione Memory multi-utente) richiedono una seconda passata. Per sicurezza, non usare regole Firestore aperte in produzione. I punteggi e le azioni non sono ancora protetti da un server autoritativo. Le immagini del roster sono URL esterni e potrebbero non caricarsi per hotlink/CORS o essere rimosse.

## Debug

- Apri la pagina e premi `F12` → Console.
- Se appare `Missing or insufficient permissions`, controlla Firestore Rules.
- Se non connette, controlla che Firestore sia stato creato e che l'ID progetto sia `mario-party-style-game`.
- Se Pages dà 404, assicurati che `index.html` sia nella root pubblicata.

## Aggiornamenti connessione/lobby

- Controllo iniziale della raggiungibilità di Firestore e stato visibile nell'intestazione.
- Creazione stanza con controllo transazionale del codice per evitare collisioni.
- Join con codice normalizzato e controllo atomico di stato/capienza.
- Elenco lobby pubbliche aggiornato in tempo reale.
- Heartbeat ogni 20 secondi e pulizia dei giocatori inattivi dopo circa 75 secondi mentre la lobby è aperta.
- ID giocatore conservato per scheda del browser (`sessionStorage`) per evitare che due schede sullo stesso browser vengano scambiate per la stessa persona.

## Test effettuati in questa revisione

- Controllo sintattico JavaScript (`node --check app.js`).
- Verifica integrità dell'archivio ZIP.

Non posso certificare da qui una connessione live al tuo progetto Firebase: va confermata aprendo la pagina pubblicata o servita via HTTP e controllando che l'intestazione mostri **Firebase connesso**. Se compare **Firestore: permessi negati**, pubblica le regole Firestore di test incluse solo in un ambiente di prova; sono aperte e non sicure per un gioco pubblico.

## Fase PRONTO prima di ogni minigioco

Il flusso include una pausa di 4 secondi, descrizione e regole, conferma PRONTO per ogni giocatore umano, NPC pronti automaticamente e countdown sincronizzato di 3 secondi. Il documento `TEST_E_NPC.md` descrive il controllo tecnico e le limitazioni attuali dell'IA.
