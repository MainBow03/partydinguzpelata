# Cartoon Party V4 — rapporto di verifica

## Controlli passati
- Sintassi JavaScript valida con `node --check app.js`.
- 12 minigiochi registrati nel catalogo.
- Nessun nome di funzione duplicato rilevato nello static scan.
- Tabella punti verificata per 4–10 partecipanti:
  - 4: 4, 3, 2, 1
  - 5: 5, 4, 3, 2, 1
  - 6: 6, 5, 4, 3, 2, 1
  - 7: 7, 6, 5, 4, 3, 2, 1
  - 8: 8, 7, 6, 5, 4, 3, 2, 1
  - 9: 10, 8, 7, 6, 5, 4, 3, 2, 1
  - 10: 12, 10, 8, 7, 6, 5, 4, 3, 2, 1
- Pari merito: i partecipanti con lo stesso punteggio del minigioco ricevono gli stessi punti di classifica; le posizioni successive vengono saltate coerentemente.

## Correzioni principali incluse
- Sistemata la progressione dei turni di Taglia il filo dopo un'eliminazione.
- Rifatta la risoluzione dei bersagli di Battle Royale dopo il tiro del dado.
- Allineati i punteggi di sopravvivenza in Battle Royale e Taglia il filo.
- Sistemati timer/passaggi di Passa la bomba e impediti timer obsoleti delle CPU.
- Sistemati i bicchieri scelti più volte e i round che potevano rimanere in attesa.
- Aggiunta invulnerabilità e verifica verticale delle collisioni nello spazio.
- Corretti il ciclo dei bersagli e i punteggi negativi di Riflessi/Acchiappa tutto!.
- Reso Collega i puntini un vero abbinamento simbolo-colore con anteprima da memorizzare.
- Aggiunti limite tentativi e timer alla cassaforte; CPU con filtro di candidati basato sugli indizi.
- Migliorata la logica CPU di Memory e Nascondino; tolte alcune decisioni che leggevano informazioni nascoste.
- Rivisti gli effetti e i turni di tabellUNO.

## Non verificato end-to-end
- Una partita reale con più browser collegati allo stesso documento Firestore.
- Concorrenza Firestore, disconnessioni, riconnessioni e host che abbandona.
- Tutte le animazioni e i layout su ogni dimensione dello schermo.
- Sincronizzazione server-side: le decisioni dei minigiochi sono ancora principalmente locali, quindi non è corretto dichiarare il multiplayer affidabile.


## V5 — classifiche per minigiochi a completamento
- Memory, Cassaforte infernale e Collega i puntini non terminano più quando finisce il primo partecipante.
- Queste gare restano attive fino a quando hanno completato tutti tranne uno (con minimo un completamento se c'è un solo partecipante), oppure fino alla scadenza del timer.
- Viene memorizzato l'ordine di completamento; questo determina la classifica dei partecipanti che hanno concluso.
- Se il timer scade prima che abbastanza partecipanti completino, i completati vengono classificati secondo l'ordine di arrivo e gli altri secondo il progresso; pari progresso fra non completati mantiene il pari merito.
- tabellUNO aveva già una condizione `finished.length >= players.length - 1`, quindi non è stato modificato per questo requisito.
- Controllo sintattico `node --check app.js` superato. Non è stato effettuato un test end-to-end multi-browser con Firestore.
