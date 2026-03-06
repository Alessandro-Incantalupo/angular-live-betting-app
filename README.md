## Betting Hiring Project

Il presente progetto include un progetto Angular di base dal quale il candidato dovrà procedere con lo sviluppo.

### Avvio del progetto:
- **Node**: è consigliata la versione v20.10.0
- **Mock data**: il progetto include un webserver locale KOA che sarà avviato sulla porta 3000
- **Dev Env**: utilizzare il comando ```npm run dev``` per avviare in parallelo:  
  - webserver Angular (porta 4200): ambiente di sviluppo angular
  - webserver Koa (porta 3000): mock server per la fruizione dei dati di esempio

### Mock Webserver endpoints
- **http://localhost:3000/events**: restituirà tutti gli eventi a disposizione in formato JSON
- **http://localhost:3000/event/1**: restituirà il singolo evento con id (1 nell'esempio) in formato JSON

### Obiettivi:
Lo scopo di questo test è valutare la conoscenza e la competenza del candidato nell'utilizzo di Angular e delle sue funzionalità. A partire dallo skeleton fornito, il candidato dovrà creare una piccola applicazione che includa i seguenti elementi:

- **Routing**: Configurare il routing per navigare tra la home page e le pagine di dettaglio sport/categoria/evento.
- **NgRx**: Implementare lo stato dell'applicazione per gestire gli eventi sportivi e i filtri applicati.
- **RxJS**: Utilizzare gli operatori RxJS per gestire flussi di dati asincroni.
- **Components**: Creare componenti Angular per visualizzare gli eventi sportivi e i dettagli.
- **Services**: Sviluppare servizi ove ritenuti necessari o utili.
- **LESS**: Utilizzare LESS per stilizzare l'applicazione mantenendo un design coerente e reattivo.

### Obiettivi Extra:
Il webserver fornito con l'applicativo, genera randomicamente le quote per gli eventi, pertanto ad ogni richiesta le quote possono variare.
- **Polling**: Implementare un sistema di aggiornamento dei dati ad intervalli di 15 secondi

### Specifiche:
1. **Home Page**:
   - Deve elencare tutti gli eventi sportivi disponibili.
   - Deve includere un menu laterale per filtrare gli eventi per sport e categorie.

2. **Pagina di dettaglio dello sport**:
   - Al click su uno sport nel menu laterale, l'utente deve essere reindirizzato alla pagina con i soli eventi dello sport selezionato.

3. **Pagina di dettaglio della categoria**:
   - Al click su una categoria nel menu laterale, l'utente deve essere reindirizzato alla pagina con i soli eventi dello categoria selezionata.  

4. **Pagina di dettaglio dell'evento**:
   - Al click su un evento nella Home Page, l'utente deve essere reindirizzato alla pagina di dettaglio dell'evento.
   - La pagina di dettaglio dovrebbe mostrare informazioni più specifiche sull'evento selezionato.

5. **Stile**:
   - Applicare stili LESS per un'interfaccia utente pulita.

### Task:
- Implementare le funzionalità sopra descritte utilizzando Angular.
- Assicurarsi che l'applicazione sia funzionante e che rispetti le specifiche.

### Criteri di Valutazione:
- Correttezza del codice.
- Pulizia e organizzazione del codice.
- Adesione alle best practices di Angular.
- Funzionalità e usabilità dell'applicazione.
- Qualità e reattività del design.
