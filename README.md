# IT Spedimar — Knowledge Base con assistente AI

Web app installabile (PWA) che raccoglie una knowledge base IT e risponde in linguaggio naturale con Google Gemini.

## Cosa fa

- **Chat**: risposte in streaming, formattate, con Copia e Riprova. La conversazione resta salvata per modulo.
- **KB**: ricerca istantanea (ignora gli accenti, cerca anche dentro i PDF), filtri per categoria, copia dei singoli valori.
- **Report**: avvisi aperti e report pronti generati dall'AI.
- **Moduli**: knowledge base separate, ognuna con le sue voci e i suoi PDF.
- **Documenti PDF**: ogni PDF caricato diventa una voce; il testo viene letto dall'AI.
- **Affidabilità AI**: fino a 3 chiavi Gemini, scelta automatica dei modelli disponibili.

## Sicurezza (v7.1)

- **La KB di base è pubblicata solo cifrata** in `kb.enc.json` (AES-256-GCM, chiave da PBKDF2-SHA256 con 600.000 iterazioni). Nel codice non ci sono voci, indirizzi, nomi o importi.
- All'apertura l'app chiede la **frase segreta**. Con "Ricorda" il dispositivo conserva solo la chiave come CryptoKey non estraibile; da Impostazioni → Protezione si può bloccare di nuovo.
- **Content Security Policy**: la pagina può collegarsi solo a se stessa e a `generativelanguage.googleapis.com`.
- **pdf.js 4.10** ospitato in `vendor/pdfjs/` (niente CDN, funziona offline, senza CVE-2024-4367; eval bloccato dalla CSP).
- Chiavi Gemini, Vault, voci aggiunte e PDF restano sul dispositivo e non sono mai nel repository.

## Struttura file

```
index.html          App (HTML + CSS + JS, senza dati)
kb.enc.json         KB di base cifrata (si crea con cifra-kb.html)
cifra-kb.html       Strumento per creare e aggiornare kb.enc.json (lavora solo nel browser)
sw.js               Service worker (offline, aggiornamento automatico)
vendor/pdfjs/       Lettore PDF
fonts/              Caratteri Archivo e JetBrains Mono
icon.svg, robots.txt, .nojekyll, .gitignore
```

## Aggiornare la KB di base

1. Apri `cifra-kb.html` (dal sito o dalla cartella sul PC).
2. **Apri kb.enc.json** e decifralo con la frase.
3. Modifica il JSON, poi **Cifra e scarica kb.enc.json** lasciando "Usa la stessa frase".
4. Carica il nuovo `kb.enc.json` nel repository al posto del vecchio.

I dispositivi già sbloccati restano sbloccati finché non cambi la frase.

**Mai caricare nel repository `kb-sorgente.json` o qualsiasi copia in chiaro.**

## Dove stanno i dati

| Dato | Dove |
|---|---|
| Voci di base, avvisi, report | `kb.enc.json`, cifrato |
| Chiave di decifratura (se "Ricorda") | IndexedDB del dispositivo, non estraibile |
| Chiavi API, Vault, voci aggiunte, conversazioni | localStorage del dispositivo |
| Testo dei PDF | IndexedDB del dispositivo |

A Gemini vengono inviati solo la domanda e gli estratti della KB pertinenti; il Vault solo quando la domanda riguarda accessi o credenziali.

## Pubblicazione

GitHub Pages sul branch `main`. Dopo ogni push l'app si aggiorna da sola.

## Versioni

- v7.1 — ottobre 2026: KB cifrata, schermata di sblocco, CSP, pdf.js 4.10 locale, modelli Gemini aggiornati.
- v7 — ottobre 2026: nuova interfaccia, streaming, scelta automatica dei modelli, Markdown completo.
