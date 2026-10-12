# Cartoon Party — Firebase + GitHub Pages (V4)

Party game web statico con JavaScript ES modules e Firebase Firestore. Include lobby, roster di personaggi, 12 minigiochi, classifiche di sfida e classifica generale.

## Pubblicazione
1. Estrai il contenuto dello ZIP.
2. Carica i file contenuti in `cartoon-party-firestore/` nella root di un repository GitHub.
3. In **Settings → Pages**, scegli `Deploy from a branch`, branch `main`, cartella `/ (root)`.
4. Crea Firestore nella console Firebase e configura regole restrittive prima di invitare amici.

## Novità V4
- **Punteggi generali:** applicata la tabella di punti in base al numero di partecipanti (per 10 giocatori: `12, 10, 8, 7, 6, 5, 4, 3, 2, 1`; per gruppi più piccoli si eliminano le posizioni iniziali della tabella, come da regola). I pareggi condividono i punti della posizione; la posizione successiva tiene conto del numero di giocatori a pari merito.
- **Memory:** le CPU usano un tabellone separato, memoria parziale e scelta delle coppie note; il primo che completa il gioco può terminare la sfida.
- **Cassaforte infernale:** quattro codici da 3 a 6 cifre, massimo 12 tentativi per codice, timer complessivo di 120 secondi e CPU che filtrano combinazioni possibili con gli indizi verdi/gialli.
- **Collega i puntini:** ora è un vero abbinamento simbolo-colore. La mappa viene mostrata per 4 secondi, poi bisogna selezionare simbolo e colore. Tre round da 6, 10 e 18 coppie; gli errori tolgono un punto.
- **Taglia il filo:** eliminare un giocatore non fa saltare il turno successivo; il punteggio tiene conto di quanto a lungo si è sopravvissuti.
- **Battle Royale:** il dado viene mostrato e il partecipante sceglie il bersaglio tra quelli nella porta di combattimento; le CPU più attente tendono a scegliere porte meno affollate. Le porte diminuiscono dopo ogni tre round completati.
- **Passa la bomba:** timer casuale in secondi interi tra 7 e 20, un solo timer per round, passaggi CPU ritardati e penalità temporanea se si tenta di passare la bomba senza averla.
- **Bomba sotto il bicchiere:** ogni bicchiere può essere scelto una sola volta per round; le CPU non conoscono la posizione delle bombe e i round non restano bloccati se un giocatore non sceglie in tempo.
- **Viaggio nello spazio:** collisione verificata rispetto alla posizione della navicella, tre secondi di invulnerabilità dopo un impatto e arresto dei controlli quando si esauriscono le vite.
- **Riflessi / Acchiappa tutto!:** corretto il ciclo di generazione dei bersagli per evitare che si moltiplichino dopo molti clic; le penalità possono portare il punteggio sotto zero.
- **1, 2, 3… nascondino!:** memoria dei nascondigli delle CPU basata sui round precedenti; il cacciatore CPU non legge più le scelte nascoste del round corrente. Il cacciatore umano ha 12 secondi per effettuare i tre tentativi.
- **tabellUNO:** turni che saltano i giocatori già arrivati, cambio di direzione, +2 con turno extra, blocco, tornado, tre caselle −2, tre caselle +2 e sei caselle CAMBIACOLORE.
- L'host può avviare la partita solo quando tutti i giocatori umani hanno scelto un personaggio e sono pronti.

## Verifiche eseguite
- `node --check app.js`: superato.
- Controllo di 79 funzioni JavaScript: nessun nome di funzione duplicato.
- Test della tabella punteggi per 4–10 partecipanti: superato.
- Test di pari merito: superato; i giocatori a pari punteggio ricevono gli stessi punti di classifica.

## Limiti ancora importanti
Questa build resta un **prototipo**. Le azioni dei minigiochi e molte decisioni CPU vengono eseguite nel browser locale. Non c'è ancora un'unica autorità condivisa che convalidi in tempo reale tutte le scelte, i timer, le eliminazioni e i punteggi fra browser diversi. Per questo la partita multiplayer online non può essere considerata sincronizzata o resistente a manipolazioni. Prima di una pubblicazione competitiva servono stato di partita condiviso, transazioni/Cloud Functions o altra autorità server, autenticazione e regole Firestore restrittive.

I test effettuati sono controlli statici e test mirati delle formule di punteggio: non equivalgono a una partita end-to-end su Firebase con più browser. Occorre ancora eseguire test manuali reali per verificare interazioni, timer e layout su dispositivi differenti.

Gli URL dei PNG sono esterni e potrebbero non essere stabili; per un progetto pubblico usa immagini che hai diritto di distribuire e ospitale nel repository.


## Gare a completamento (V5)
Memory, Cassaforte infernale e Collega i puntini continuano finché tutti tranne un partecipante hanno completato la sfida. L'ordine di completamento determina le posizioni; se scade il timer prima, i completati sono ordinati per arrivo e gli altri per progresso. tabellUNO già terminava quando arrivava al traguardo il penultimo partecipante.
