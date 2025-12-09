# 💰 Gestionale Spese React

**Gestionale Spese** è un'applicazione web moderna e reattiva per il tracciamento delle finanze personali. Sviluppata con **React** e **PocketBase**, offre un'esperienza utente fluida con design "premium", visualizzazione dati avanzata e gestione intuitiva delle transazioni.

![Dashboard Preview](<img width="1313" height="722" alt="image" src="https://github.com/user-attachments/assets/808ddfc1-5e50-4356-8700-f4040e082baa" />)
![Graphic Preview](<img width="1264" height="426" alt="image" src="https://github.com/user-attachments/assets/0dbab0f8-387d-4456-8be8-498b12bf7403" />)

## ✨ Funzionalità Principali

### 📊 Dashboard & Analisi
-   **Totale in Tempo Reale**: Calcolo istantaneo del saldo basato sui filtri attivi.
-   **Grafico Lineare Avanzato**:
    -   *Modalità Giornaliera*: Visualizza trend su 7 o 30 giorni.
    -   *Modalità Intraday*: Se filtrato per "Oggi", mostra l'andamento orario preciso.
    -   *Punti Permanenti*: I data point sono sempre visibili per una facile lettura.
-   **Grafico a Torta**: Distribuzione delle spese per categoria con colori dedicati.

### 📝 Gestione Transazioni
-   **Inserimento Rapido**: Form ottimizzato su due righe.
-   **Date Intelligenti**:
    -   Default su "Adesso" all'apertura.
    -   Supporto per inserimento data/ora specifica (`datetime-local`).
    -   *Sticky Date*: La data rimane memorizzata se modificata manualmente, ideale per inserimenti in serie.
-   **Categorizzazione**: Icone e colori automatici per categorie (Cibo, Trasporti, Casa, Svago, Altro).
-   **Eliminazione**: Rimozione transazioni con conferma.

### 🎨 UI/UX Premium
-   **Design Glassmorphism**: Effetti di trasparenza e blur.
-   **Responsive**: Layout a griglia che si adatta a desktop e mobile.
-   **Feedback Visivo**: Bordi colorati in base alla categoria della spesa.

## 🛠️ Stack Tecnologico

-   **Frontend**: [React](https://reactjs.org/) (Vite)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) + CSS Modules
-   **Grafici**: [Recharts](https://recharts.org/)
-   **Backend**: [PocketBase](https://pocketbase.io/) (BaaS leggero e performante)
-   **Icone**: [Lucide React](https://lucide.dev/)

## 🚀 Guida all'Installazione

### 1. Prerequisiti
-   Node.js (v16 o superiore)
-   PocketBase eseguibile

### 2. Configurazione Backend (PocketBase)
1.  Avvia PocketBase: `./pocketbase serve`
2.  Accedi al pannello admin: `http://127.0.0.1:8090/_/`
3.  Crea una Collection chiamata **`spese`**.
4.  Aggiungi i seguenti campi (Schema):
    -   `descrizione`: **Text**
    -   `importo`: **Number**
    -   `categoria`: **Text**
    -   `data`: **Date/Time**
5.  **API Rules**: Imposta le regole su "Public" (lascia vuoto il campo regole) per semplificare lo sviluppo locale.

### 3. Avvio Frontend
1.  Clona la repository:
    ```bash
    git clone https://github.com/TUO_USERNAME/gestionale-spese.git
    cd gestionale-spese
    ```
2.  Installa le dipendenze:
    ```bash
    npm install
    ```
3.  Avvia il server di sviluppo:
    ```bash
    npm run dev
    ```
4.  Apri il browser su `http://localhost:5173`.

## 🧠 Dettagli Tecnici

### Gestione Date ISO 8601
PocketBase utilizza UTC per le date. L'applicazione gestisce la conversione automaticamente:
-   **Salvataggio**: La data locale viene convertita in ISO string (`toISOString()`) prima del POST.
-   **Visualizzazione**: La data UTC ricevuta viene riconvertita nel formato locale (`toLocaleString('it-IT')`).

### Logica dei Grafici
Il componente graphico adatta l'asse X in base al filtro:
-   **Filtro "Oggi"**: Nessuna aggregazione. Mostra ogni transazione sull'asse temporale (HH:mm).
-   **Filtro "7/30 GG"**: Aggregazione per somma giornaliera (DD/MM).

## � Licenza
Progetto distribuito con licenza MIT. Sentiti libero di usarlo e modificarlo!

---
*Sviluppato con ❤️ e React.*
