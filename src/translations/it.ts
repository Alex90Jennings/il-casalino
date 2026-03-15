export const it = {
  nav: {
    home: "Home",
    about: "Chi Siamo",
    services: "Servizi",
    gallery: "Galleria",
    booking: "Prenota",
    contact: "Contatti",
  },
  hero: {
    tagline: "Bed & Breakfast",
    subtitle: "Un rifugio autentico nel cuore della Puglia",
    cta: "Scopri di più",
    bookCta: "Prenota ora",
  },
  about: {
    heading: "Chi Siamo",
    body: "Benvenuti al Casino Casalino, un'oasi di pace e autenticità immersa nella campagna pugliese. La nostra dimora storica offre un'esperienza unica a pochi passi da Francavilla Fontana, dove la tradizione locale incontra il comfort moderno.",
  },
  rooms: {
    heading: "Le Stanze",
    subtitle: "Quattro camere uniche, ognuna con il suo carattere",
    maxGuests: "Max {{n}} ospiti",
    from: "Da",
    perNight: "a notte",
    discover: "Scopri",
    Mirtillo: {
      description: "Avvolta nei toni del mirtillo selvatico, questa camera accoglie con calore e intimità.",
    },
    Limone: {
      description: "Luminosa e fresca come il sole pugliese, ispirata al profumo dei limoni del giardino.",
    },
    Oria: {
      description: "Elegante e tranquilla, prende il nome dalla storica città messapica nelle vicinanze.",
    },
    Francavilla: {
      description: "La più spaziosa, dedicata alla città che ci ospita con tutto il suo fascino barocco.",
    },
  },
  services: {
    heading: "I Nostri Servizi",
    breakfast: {
      title: "Colazione",
      description: "Colazione artigianale con prodotti locali, servita ogni mattina.",
    },
    garden: {
      title: "Giardino",
      description: "Spazio verde privato per rilassarsi all'aperto in totale tranquillità.",
    },
    wifi: {
      title: "Wi-Fi Gratuito",
      description: "Connessione veloce in tutte le aree della struttura.",
    },
    parking: {
      title: "Parcheggio",
      description: "Parcheggio privato gratuito all'interno della proprietà.",
    },
    checkin: {
      title: "Check-in Flessibile",
      description: "Orari di arrivo e partenza concordabili in base alle vostre esigenze.",
    },
    local: {
      title: "Consigli Locali",
      description: "Vi guidiamo alla scoperta dei sapori, luoghi e tradizioni della Puglia.",
    },
  },
  gallery: {
    heading: "Galleria",
  },
  booking: {
    heading: "Prenota il Tuo Soggiorno",
    subtitle: "Soggiorno minimo 3 notti",
    selectRooms: "Seleziona camera/e",
    checkIn: "Arrivo",
    checkOut: "Partenza",
    guests: "Ospiti",
    breakfast: "Colazione (€{{price}}/persona/notte)",
    name: "Nome e cognome",
    email: "Email",
    notes: "Note (opzionale)",
    summary: "Riepilogo",
    nights: "{{n}} notti",
    rooms: "{{n}} camera/e",
    breakfastLabel: "Colazione",
    total: "Totale",
    payWith: "Paga con PayPal",
    minNightsError: "Il soggiorno minimo è di {{n}} notti.",
    selectRoomError: "Seleziona almeno una camera.",
    included: "inclusa",
    notIncluded: "non inclusa",
  },
  contact: {
    heading: "Contattaci",
    address: "Indirizzo",
    phone: "Telefono",
    email: "Email",
    form: {
      name: "Nome",
      email: "Email",
      message: "Messaggio",
      send: "Invia",
    },
  },
  footer: {
    rights: "© {{year}} Il Casino Casalino. Tutti i diritti riservati.",
    privacy: "Privacy",
    cookie: "Cookie",
  },
};

export type Translations = typeof it;
