# Caos Club — aggiornamento assistito

Questa è la cartella completa del sito statico, pronta da pubblicare su GitHub Pages.

## Pubblicazione

1. Carica i file direttamente nella radice del repository GitHub, non la cartella contenitore.
2. Esegui Commit changes.
3. In Firebase Console → Firestore Database → Rules, incolla il contenuto di `firestore.rules` e premi Publish.
4. In Firebase Console → Authentication → Sign-in method, verifica che Anonymous sia abilitato.
5. In Authentication → Settings → Authorized domains, verifica che `mainbow03.github.io` sia presente.
6. Ricarica il sito con `Ctrl+Shift+R`.

La pagina mostra un messaggio più esplicito se l'accesso ospite a Firebase non funziona.

**Nota:** il prototipo usa Firebase client-side. Per un multiplayer competitivo e resistente a manomissioni, i risultati andrebbero validati anche da un backend fidato.
