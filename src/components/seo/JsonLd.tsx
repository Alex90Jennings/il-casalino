import { SITE_URL as BASE_URL } from "@/lib/site";

const lodgingBusiness = {
  "@context": "https://schema.org",
  "@type": "BedAndBreakfast",
  name: "Il Casino Casalino",
  description:
    "Bed & breakfast tradizionale nel cuore della Puglia. A Francavilla Fontana (Brindisi): camere con colazione, piscina e giardino per un soggiorno autentico tra storia, natura e turismo in Salento e Valle d'Itria.",
  url: BASE_URL,
  knowsLanguage: ["it", "en"],
  keywords:
    "bed and breakfast Francavilla Fontana, B&B Puglia, soggiorno tradizionale Puglia, turismo Puglia, vacanze in Puglia, Salento, Valle d'Itria",
  hasMap: "https://maps.google.com/?q=Il+Casino+Casalino+Francavilla+Fontana+Brindisi",
  telephone: process.env.NEXT_PUBLIC_BUSINESS_PHONE ?? "",
  email: process.env.NEXT_PUBLIC_BUSINESS_EMAIL ?? "ilcasinocasalino@gmail.com",
  image: `${BASE_URL}/media/images/pool-1600.webp`,
  logo: `${BASE_URL}/logo.png`,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Francavilla Fontana",
    addressRegion: "Puglia",
    addressCountry: "IT",
    postalCode: "72021",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: "40.5299",
    longitude: "17.5840",
  },
  priceRange: "€€",
  checkinTime: "15:00",
  checkoutTime: "11:00",
  numberOfRooms: 4,
  amenityFeature: [
    { "@type": "LocationFeatureSpecification", name: "Colazione inclusa", value: true },
    { "@type": "LocationFeatureSpecification", name: "Piscina", value: true },
    { "@type": "LocationFeatureSpecification", name: "Giardino", value: true },
    { "@type": "LocationFeatureSpecification", name: "Terrazza", value: true },
    { "@type": "LocationFeatureSpecification", name: "Wi-Fi", value: true },
    { "@type": "LocationFeatureSpecification", name: "Aria condizionata", value: true },
    { "@type": "LocationFeatureSpecification", name: "Parcheggio gratuito", value: true },
  ],
  containsPlace: [
    {
      "@type": "HotelRoom",
      name: "Camera Sole",
      description: "Camera doppia tradizionale con bagno privato.",
      occupancy: { "@type": "QuantitativeValue", maxValue: 2 },
    },
    {
      "@type": "HotelRoom",
      name: "Camera Stella",
      description: "Camera doppia tradizionale con bagno privato.",
      occupancy: { "@type": "QuantitativeValue", maxValue: 2 },
    },
    {
      "@type": "HotelRoom",
      name: "Camera Luna",
      description: "Camera doppia tradizionale con bagno privato.",
      occupancy: { "@type": "QuantitativeValue", maxValue: 2 },
    },
    {
      "@type": "HotelRoom",
      name: "Camera Venere",
      description: "Camera doppia tradizionale con bagno privato.",
      occupancy: { "@type": "QuantitativeValue", maxValue: 2 },
    },
  ],
  sameAs: ["https://www.instagram.com/ilcasinocasalino/"],
};

const website = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Il Casino Casalino",
  url: BASE_URL,
};

export function JsonLd() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(lodgingBusiness) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
    </>
  );
}
