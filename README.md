# Caos Club — Party Game

Progetto web statico in italiano per GitHub Pages, con Firebase Authentication anonima e Firestore per lobby e punteggi. Non richiede Node, npm, bundler o build: GitHub Pages può servire direttamente `index.html`, `style.css` e `app.js`.

## Funzioni incluse

- Profilo ospite con nome.
- Creazione stanza con codice, da 4 a 10 posti, da 1 a 16 minigiochi e opzione CPU.
- Ingresso tramite codice e browser delle lobby in attesa.
- Lobby aggiornata in tempo reale, scelta del roster fornito, PNG/ritratti, personaggi non duplicabili e stato pronto.
- Countdown di 8 secondi prima della partita e 3 secondi prima di ogni minigioco.
- Punti per piazzamento, classifica generale tra minigiochi, rivelazione finale dal fondo al primo posto.
- Statistiche personali: partite giocate/vinte, punti, personaggi usati e minigiochi vinti.
- Dieci modalità prototipali: Memory, Passa la bomba, Taglia il filo, Cassaforte infernale, Battle Royale, Collega i puntini, TabellUNO, Viaggio nello spazio, Acchiappa tutto! e Bomba sotto il bicchiere.
- I ritratti vengono usati in lobby, nella striscia dei partecipanti, nella classifica live di ogni minigioco, nella classifica generale, nelle scene di Battle Royale e nella navicella. Se un collegamento esterno alle immagini non funziona, l'interfaccia mostra un fallback.
- Durante ogni minigioco compare una classifica dedicata che legge i progressi condivisi da Firestore: Memory mostra le coppie, Cassaforte i codici, TabellUNO le caselle, Viaggio nello spazio i metri e così via. Rimane visibile anche la classifica generale della partita.
- Battle Royale ha un'arena visuale con le porte occupate dai ritratti, animazione del dado, bersaglio evidenziato, danni e barra HP per ogni sfidante.
- Passa la bomba, Taglia il filo e TabellUNO condividono lo stato tramite Firestore: la miccia di Passa la bomba non si resetta quando viene passata e il gioco continua dopo ogni esplosione fino all'ultimo sopravvissuto; Taglia il filo è una sfida unica a turni con eliminazioni; TabellUNO usa il PNG di ciascuno come pedina sul tabellone comune.

## Configurazione Firebase

1. Apri [Firebase Console](https://console.firebase.google.com/) e seleziona il progetto `mario-party-style-game`.
2. In **Authentication → Sign-in method**, abilita **Anonymous**.
3. In **Firestore Database**, crea il database se non esiste.
4. In **Firestore Database → Rules**, incolla e pubblica il contenuto di `firestore.rules`.
5. In **Project settings → Your apps**, verifica che la configurazione web in `app.js` corrisponda alla tua app Firebase. La configurazione include la web API key che Firebase usa nel client; non è una password. La sicurezza viene dalle regole e dalla configurazione Firebase.
6. Nel progetto Firebase, controlla che l'API Firestore sia abilitata e che il dominio di pubblicazione sia autorizzato se hai impostato restrizioni.

## Pubblicazione su GitHub Pages

1. Crea un repository GitHub, per esempio `caos-club`.
2. Carica nella radice del repository questi file: `index.html`, `style.css`, `app.js`, `firestore.rules` e `README.md`.
3. Vai su **Settings → Pages**.
4. In **Build and deployment**, seleziona **Deploy from a branch**, scegli `main` e la cartella `/ (root)`, quindi salva.
5. Attendi il deploy di GitHub Pages e apri l'URL mostrato nelle impostazioni.
6. Apri l'URL su almeno due browser/dispositivi, crea una stanza e prova ingresso, selezione e pronto.

## Struttura dati Firestore

- `rooms/{code}`: impostazioni, host, fase di gioco, minigioco attivo e classifiche.
- `rooms/{code}/players/{uid}`: partecipanti, personaggi, prontezza e punti.
- `rooms/{code}/characters/{characterId}`: prenotazione del personaggio, per bloccare i doppioni.
- `rooms/{code}/results/{gameIndex}/players/{uid}`: un risultato per partecipante e minigioco.
- `rooms/{code}/progress/{uid}`: progresso live usato nella classifica specifica del minigioco.
- `users/{uid}`: statistiche personali dell'utente ospite.

## Note importanti sul prototipo

- Le lobby, i personaggi, le fasi, i risultati e le logiche a turni di Passa la bomba, Taglia il filo e TabellUNO usano Firestore come stato condiviso. Battle Royale resta invece una logica front-end: le sue scelte e i dadi non sono ancora risolti da un server centrale identico per tutte le finestre.
- Il browser invia il risultato del minigioco: le Rules impediscono a un giocatore di scrivere direttamente i punti globali, ma un utente esperto può manipolare il JavaScript client-side per alterare il proprio risultato. Per classifiche anti-cheat vere, la risoluzione dei minigiochi deve spostarsi in Cloud Functions o in un backend fidato.
- L'autenticazione anonima identifica il browser/sessione Firebase, ma non fornisce un'identità permanente verificata. Le statistiche restano legate all'UID anonimo.
- I PNG/ritratti del roster sono collegamenti esterni forniti dall'utente. Pinterest può cambiare o bloccare i link; per un deployment stabile conviene avere i permessi per usare i file e salvarli in un repository o Firebase Storage.
- Le regole Firestore non possono garantire da sole la correttezza delle logiche di gioco. Usa il simulatore Rules di Firebase per provarle prima di condividere il sito con molte persone.

## Aggiornare un repository già pubblicato

1. Estrai lo ZIP e apri la cartella in cui trovi direttamente `index.html`, `app.js` e `style.css`.
2. Nel repository GitHub apri **Add file → Upload files** e trascina i file contenuti nella cartella, non la cartella esterna. Conferma la sostituzione dei file esistenti e premi **Commit changes**.
3. Se non hai ancora pubblicato le Rules della versione con la classifica live, in Firebase Console → **Firestore Database → Rules**, incolla `firestore.rules` e premi **Publish**. Le correzioni più recenti ai tre minigiochi non richiedono un nuovo schema Firestore.
4. Aspetta il deploy GitHub Pages e ricarica il sito con `Ctrl + F5`. Prova con almeno due browser/dispositivi.

## Debug rapido

- `auth/operation-not-allowed`: abilita il provider Anonymous in Firebase Authentication.
- `permission-denied`: assicurati di aver pubblicato `firestore.rules` e di aver abilitato Firestore.
- Le lobby pubbliche vengono cercate filtrando `status == "waiting"`; non togliere il filtro dalla query senza cambiare le Rules.
- Per modifiche alle regole, pubblicale anche nella Firebase Console: il file locale da solo non le applica.
