// Privacy and cookie notice (art. 13 GDPR), Italian. Inline tokens are turned
// into links by PrivacyContent: {{email}}, {{phone}}, {{holidu}}, {{garante}}.

export interface PrivacySection {
  id: string;
  heading: string;
  paragraphs: string[];
  items?: string[];
  after?: string[];
}

export interface CookieRow {
  name: string;
  provider: string;
  purpose: string;
  duration: string;
  type: string;
}

export interface PrivacyContent {
  metaTitle: string;
  metaDescription: string;
  title: string;
  updated: string;
  intro: string[];
  sections: PrivacySection[];
  cookieTable: { caption: string; headers: CookieRow; rows: CookieRow[] };
  holiduPolicyUrl: string;
  garanteUrl: string;
}

export const privacyIt: PrivacyContent = {
  metaTitle: "Informativa privacy e cookie",
  metaDescription:
    "Come Il Casino Casalino tratta i dati personali di chi visita il sito, scrive attraverso il modulo di contatto, prenota o soggiorna, e quali cookie vengono usati.",
  title: "Informativa privacy e cookie",
  updated: "Ultimo aggiornamento: 3 ottobre 2026",
  intro: [
    "Questa informativa spiega, ai sensi degli artt. 13 e 14 del Regolamento (UE) 2016/679 (GDPR) e del Codice in materia di protezione dei dati personali (D.lgs. 196/2003), come vengono trattati i dati personali di chi visita questo sito, di chi ci scrive, di chi prenota e di chi soggiorna presso Il Casino Casalino.",
  ],
  sections: [
    {
      id: "titolare",
      heading: "Titolare del trattamento",
      paragraphs: [
        "Il titolare del trattamento è Simona di Punzio, che gestisce la struttura ricettiva Il Casino Casalino, Contrada Casalino 18, 72021 Francavilla Fontana (BR), Italia. P.IVA 08684360723, CIN IT074008B400126364.",
        "Per qualsiasi domanda o richiesta sui tuoi dati puoi scrivere a {{email}} o chiamare il {{phone}}. Non è stato nominato un responsabile della protezione dei dati (DPO), perché non obbligatorio per questa attività.",
      ],
    },
    {
      id: "dati",
      heading: "Quali dati trattiamo",
      paragraphs: [],
      items: [
        "Dati di navigazione: indirizzo IP, tipo di browser e dispositivo, pagine visitate, data e ora della richiesta. Sono registrati dal fornitore dell’hosting, come da ogni server web, per far funzionare il sito e proteggerlo.",
        "Dati del modulo di contatto: nome, indirizzo email, testo del messaggio e lingua del sito.",
        "Dati di sicurezza: l’indirizzo IP, conservato solo in forma cifrata (hash) per limitare il numero di invii del modulo, e informazioni tecniche sul browser e sul dispositivo analizzate dalla verifica anti-spam.",
        "Dati di prenotazione: i dati inseriti nel modulo di prenotazione di Holidu (ad esempio nome, contatti, date del soggiorno, numero di ospiti, richieste particolari e dati di pagamento). Sono raccolti da Holidu, che ci comunica quelli necessari a gestire il soggiorno; i dati di pagamento non arrivano mai a noi.",
        "Dati degli ospiti: al momento dell’arrivo, i dati anagrafici e del documento d’identità di ciascun ospite, richiesti dalla legge.",
        "Dati che ci invii direttamente, ad esempio per email, telefono, WhatsApp o Instagram.",
      ],
      after: [
        "Non raccogliamo intenzionalmente categorie particolari di dati (ad esempio sulla salute). Se ce ne comunichi, ad esempio per esigenze alimentari o di accessibilità, li useremo solo per organizzare il tuo soggiorno.",
      ],
    },
    {
      id: "finalita",
      heading: "Perché li trattiamo e su quale base giuridica",
      paragraphs: [],
      items: [
        "Rispondere alle tue richieste di informazioni: misure precontrattuali su tua richiesta e nostro legittimo interesse a rispondere (art. 6, par. 1, lett. b e f GDPR).",
        "Gestire la prenotazione e il soggiorno: esecuzione del contratto (art. 6, par. 1, lett. b).",
        "Adempiere agli obblighi di legge: comunicazione delle generalità degli ospiti alla Questura tramite il portale Alloggiati Web (art. 109 del T.U.L.P.S.), imposta di soggiorno ove applicabile, rilevazioni statistiche sul movimento turistico, obblighi fiscali e contabili (art. 6, par. 1, lett. c).",
        "Proteggere il sito e il modulo di contatto da abusi e spam: legittimo interesse (art. 6, par. 1, lett. f).",
        "Offrirti la prenotazione online attraverso il modulo di Holidu integrato nella pagina: misure precontrattuali su tua richiesta (art. 6, par. 1, lett. b).",
        "Difendere i nostri diritti in caso di contestazioni: legittimo interesse (art. 6, par. 1, lett. f).",
      ],
      after: [
        "Non usiamo i tuoi dati per newsletter, pubblicità o profilazione, non li vendiamo e non prendiamo decisioni automatizzate che producano effetti giuridici nei tuoi confronti.",
        "Fornire i dati del modulo di contatto è facoltativo, ma senza nome ed email non possiamo risponderti. I dati richiesti al check-in sono obbligatori per legge: senza di essi non possiamo ospitarti.",
      ],
    },
    {
      id: "holidu",
      heading: "Il modulo di prenotazione di Holidu",
      paragraphs: [
        "Il modulo di prenotazione è fornito da Holidu Hosts GmbH, Riesstraße 24, 80992 Monaco di Baviera (Germania), support@holidu.com, che ha nominato un responsabile della protezione dei dati (Proliance GmbH). Quando viene caricato, il tuo browser si collega direttamente ai server di Holidu, che possono impostare cookie e usare strumenti di analisi e monitoraggio di terze parti, tra cui Google Tag Manager e Google Analytics (Google), Microsoft Clarity (che può registrare le interazioni con la pagina, come clic e scorrimento), customer.io e Sentry. Alcuni di questi fornitori hanno sede negli Stati Uniti.",
        "Il modulo è caricato quando raggiungi la sezione Prenota. I cookie e gli strumenti al suo interno sono gestiti da Holidu: secondo la sua informativa, i cookie tecnicamente necessari si basano sul suo legittimo interesse, gli strumenti di analisi e marketing sul consenso, e Sentry, usato per rilevare gli errori, conserva i dati al massimo 90 giorni. Noi non abbiamo accesso ai dati raccolti da questi strumenti.",
        "I dati che inserisci nel modulo sono trattati da Holidu come titolare autonomo, secondo la sua informativa privacy: {{holidu}}. Holidu ci comunica i dati della prenotazione necessari a gestire il tuo soggiorno. I pagamenti sono elaborati per conto di Holidu da Adyen N.V. (Amsterdam, Paesi Bassi). Secondo la sua informativa, Holidu può inoltre usare l’indirizzo email della prenotazione per proprie comunicazioni promozionali, alle quali puoi opporti in qualsiasi momento scrivendo a Holidu.",
        "Puoi prenotare anche senza il modulo: scrivendoci a {{email}}, chiamando il {{phone}}, oppure aprendo la pagina di prenotazione di Holidu in una nuova scheda. In quest’ultimo caso visiti direttamente il sito di Holidu, soggetto alla sua informativa e alla sua cookie policy.",
      ],
    },
    {
      id: "destinatari",
      heading: "A chi comunichiamo i dati",
      paragraphs: [
        "I dati sono trattati da noi e, per nostro conto, da fornitori che agiscono come responsabili del trattamento e solo per le finalità indicate:",
      ],
      items: [
        "Vercel Inc. (Stati Uniti): hosting del sito e registri tecnici di accesso.",
        "Resend (Plus Five Five, Inc., Stati Uniti): invio via email dei messaggi del modulo di contatto.",
        "Cloudflare, Inc. (Stati Uniti): verifica anti-spam Turnstile del modulo di contatto.",
        "Upstash, Inc. (Stati Uniti; dati conservati nell’Unione europea): contatori per il limite di invii, basati sull’indirizzo IP cifrato.",
        "Google LLC (Stati Uniti): servizio di posta elettronica (Gmail) in cui riceviamo e conserviamo i messaggi.",
        "Il nostro consulente fiscale, per gli adempimenti contabili e fiscali.",
      ],
      after: [
        "Sono invece titolari autonomi del trattamento: Holidu Hosts GmbH, per i dati inseriti nel suo modulo e per i relativi cookie; i fornitori dei servizi di pagamento usati da Holidu, come Adyen N.V.; le autorità pubbliche a cui la legge ci impone di comunicare i dati (Questura, Comune, enti di statistica, amministrazione finanziaria).",
        "I collegamenti a Instagram (Meta Platforms) e Google Maps portano a servizi esterni: quando li apri, il trattamento dei tuoi dati è regolato dalle informative di quei servizi.",
      ],
    },
    {
      id: "trasferimenti",
      heading: "Trasferimenti fuori dall’Unione europea",
      paragraphs: [
        "Alcuni fornitori hanno sede negli Stati Uniti. Il trasferimento dei dati fuori dallo Spazio economico europeo avviene sulla base delle garanzie previste dagli artt. 45 e 46 GDPR: la decisione di adeguatezza della Commissione europea relativa all’EU-U.S. Data Privacy Framework, per i fornitori che vi aderiscono, oppure le clausole contrattuali standard approvate dalla Commissione.",
      ],
    },
    {
      id: "conservazione",
      heading: "Per quanto tempo conserviamo i dati",
      paragraphs: [],
      items: [
        "Messaggi e richieste di informazioni: per il tempo necessario a rispondere e a gestire il rapporto che ne segue, e comunque non oltre 24 mesi dall’ultimo contatto.",
        "Dati di prenotazione e documenti contabili e fiscali: 10 anni, come previsto dalla normativa civilistica e fiscale (art. 2220 del Codice civile).",
        "Dati degli ospiti comunicati alla Questura: sono trasmessi tramite Alloggiati Web e non vengono conservati da noi oltre quanto richiesto dalla legge per le ricevute di trasmissione.",
        "Indirizzo IP cifrato per il limite di invii: al massimo 24 ore.",
        "Registri tecnici dei fornitori: per il breve periodo previsto dalle rispettive politiche, per sicurezza e funzionamento.",
      ],
    },
    {
      id: "cookie",
      heading: "Cookie",
      paragraphs: [
        "Il sito usa di per sé solo cookie tecnici, che non richiedono consenso, e non contiene strumenti di analisi o pubblicità propri.",
        "Il modulo di prenotazione di Holidu, integrato nella sezione Prenota, può impostare cookie di terze parti e usare strumenti di analisi, come descritto nella sezione dedicata e nella tabella qui sotto. Sono gestiti da Holidu secondo la sua informativa: {{holidu}}.",
        "Puoi in ogni momento bloccare o cancellare i cookie dalle impostazioni del tuo browser, anche solo quelli di terze parti. Bloccando i cookie di terze parti il modulo di prenotazione potrebbe non funzionare: in quel caso puoi prenotare per email o telefono.",
      ],
    },
    {
      id: "diritti",
      heading: "I tuoi diritti",
      paragraphs: [
        "In qualsiasi momento puoi chiederci l’accesso ai tuoi dati, la rettifica, la cancellazione, la limitazione del trattamento e la portabilità dei dati che ci hai fornito, e opporti ai trattamenti basati sul legittimo interesse (artt. 15–22 GDPR). Se un trattamento si basa sul tuo consenso, puoi revocarlo in qualsiasi momento, senza conseguenze sui trattamenti già avvenuti (art. 7, par. 3). Per esercitare i tuoi diritti scrivi a {{email}}: ti risponderemo entro un mese.",
        "Se ritieni che il trattamento violi la normativa, puoi proporre reclamo al Garante per la protezione dei dati personali: {{garante}}.",
      ],
    },
    {
      id: "minori",
      heading: "Minori",
      paragraphs: [
        "Il sito non è rivolto a minori di 14 anni. Le prenotazioni devono essere effettuate da un adulto; i dati dei minori che soggiornano vengono trattati solo per gli obblighi di legge legati al soggiorno.",
      ],
    },
    {
      id: "modifiche",
      heading: "Modifiche a questa informativa",
      paragraphs: [
        "Potremmo aggiornare questa informativa, ad esempio se cambiano i fornitori o la normativa. La versione aggiornata è sempre pubblicata su questa pagina, con la data dell’ultima modifica.",
      ],
    },
  ],
  cookieTable: {
    caption: "Cookie e strumenti usati sul sito",
    headers: { name: "Nome", provider: "Fornitore", purpose: "Finalità", duration: "Durata", type: "Tipo" },
    rows: [
      {
        name: "preferred-locale",
        provider: "Il Casino Casalino (prima parte)",
        purpose: "Ricorda la lingua che hai scelto",
        duration: "12 mesi",
        type: "Tecnico",
      },
      {
        name: "Cloudflare Turnstile",
        provider: "Cloudflare, Inc.",
        purpose: "Distingue le persone dai programmi automatici nel modulo di contatto",
        duration: "Sessione",
        type: "Tecnico",
      },
      {
        name: "uuid e altri cookie di Holidu",
        provider: "Holidu Hosts GmbH (terza parte)",
        purpose: "Funzionamento del modulo di prenotazione, misurazione e analisi",
        duration: "Fino a 12 mesi",
        type: "Terza parte, gestito da Holidu",
      },
      {
        name: "Google Tag Manager / Analytics, Microsoft Clarity, customer.io, Sentry",
        provider: "Google, Microsoft, customer.io, Sentry, tramite Holidu",
        purpose: "Statistiche, analisi del comportamento e monitoraggio degli errori nel modulo di prenotazione",
        duration: "Secondo le politiche dei fornitori (Sentry: max 90 giorni)",
        type: "Terza parte, gestito da Holidu; analisi solo con consenso secondo la sua informativa",
      },
    ],
  },
  holiduPolicyUrl: "https://www.holidu.it/host/privacy",
  garanteUrl: "https://www.garanteprivacy.it",
};
