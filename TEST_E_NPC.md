# Caos Club — verifica tecnica e comportamento NPC

## Esito della verifica disponibile

Questa verifica è stata eseguita sul pacchetto `party-game-starter` presente nel workspace, non su una sessione multiplayer collegata in tempo reale al progetto Firebase. Il test reale con più browser e Firestore non può essere dichiarato superato senza eseguire la pagina pubblicata e osservare i documenti live.

### Controlli eseguiti

- `node --check app.js`: superato (nessun errore di sintassi JavaScript).
- Integrità dell'archivio ZIP: verificata dopo la ricostruzione.
- Riferimenti HTML statici: quelli mancanti corrispondono ai controlli creati dinamicamente dentro i minigiochi.
- Fase di preparazione: pausa di 4 secondi, descrizione, conferma PRONTO per ogni umano, NPC pronti automaticamente e countdown di 3 secondi senza millisecondi né schermata VIA persistente.
- Timer personaggi: quando tutti gli umani hanno scelto, il timer viene portato a 3 secondi se ne restano più di 3.
- Transizione finale: l’host passa lo stato da countdown a playing con una transazione che preserva lo stato del minigioco; gli errori di avvio vengono mostrati anche come avviso visibile.
- Pulizia timer: gli intervalli della selezione personaggi vengono azzerati quando si esce dalla stanza.
- Avvio del primo minigioco: corretto il passaggio del valore restituito da `makeGame`, che prima salvava il contenitore invece dell'oggetto minigioco.
- Pioggia di stelle: bersagli condivisi via Firestore, scadenza dei bersagli e azioni automatiche degli NPC aggiunte.
- Scommessa dei maiali: corretto il mazzo che poteva ignorare alcune corsie quando il numero di maiali non coincideva con quello dei giocatori.

## Comportamento NPC nel codice attuale

I profili CPU si ripetono ogni cinque NPC:

1. **CPU 1 — Prudente:** reazione 0,76; accuratezza 0,72; velocità click 0,66.
2. **CPU 2 — Equilibrato:** reazione 0,60; accuratezza 0,58; velocità click 0,78.
3. **CPU 3 — Aggressivo:** reazione 0,42; accuratezza 0,45; velocità click 0,92.
4. **CPU 4 — Fortunato:** reazione 0,55; accuratezza 0,52; velocità click 0,73.
5. **CPU 5 — Stratega:** reazione 0,82; accuratezza 0,80; velocità click 0,70.

Questi sono profili tecnici, non personalità narrative dei personaggi dei cartoni: il codice attuale non fa ancora recitare agli NPC la personalità del personaggio scelto.

### Per minigioco

- **Memory:** non c'è ancora un'IA CPU completa che giochi una griglia personale. La griglia e le coppie sono condivise, quindi il comportamento competitivo non è corretto. Da completare prima di considerarlo pronto.
- **Nascondino:** quando l'host conferma la fase del nascondiglio, i bot ricevono una postazione con scelta pseudo-casuale influenzata dal profilo. La fase del cacciatore e la raccolta delle scelte umane non sono ancora sufficientemente complete per considerare il minigioco superato.
- **Fortunflipper:** dopo l'avvio, ogni CPU avanza automaticamente ogni secondo; la velocità varia in base al profilo. L'interazione di liberazione e la competizione richiedono ancora un test multiplayer reale.
- **Gioco dell'oca:** la CPU tira un valore casuale tra 2 e 12 e avanza. Nel codice attuale il turno CPU non applica ancora tutte le caselle speciali e le penalità di turno; non è quindi conforme alle regole complete.
- **Clicca il bottone:** ogni CPU guadagna un click con probabilità determinata dal suo profilo a ogni intervallo di circa 1,8 secondi. L'IA non è ancora perfetta rispetto al semaforo rosso: la penalità e la decisione di fermarsi vanno completate.
- **La scommessa dei maiali:** ogni CPU sceglie una corsia automaticamente con una preferenza pseudo-casuale influenzata dal profilo. La corsa è basata sulle carte, ma la logica completa di classifica e fine partita richiede altri test.
- **Pioggia di stelle:** ogni CPU controlla i bersagli disponibili a intervalli regolari; tende a raccogliere stelle e stelle dorate, con una probabilità di errore sulle meteore dipendente dal profilo. Le stelle valgono +1, le dorate +3 e le meteore −2.

## Problemi da non nascondere

Il pacchetto attuale contiene sette minigiochi prototipali. La verifica statica **non dimostra** che tutti i minigiochi funzionino correttamente online. In particolare Memory, Nascondino, Gioco dell'oca, Clicca il bottone e la classifica dei risultati necessitano di ulteriore lavoro e di una prova reale con almeno due browser collegati alla stessa stanza.
