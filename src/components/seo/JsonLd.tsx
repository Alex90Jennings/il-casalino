const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://ilcasinocasalino.com";

const lodgingBusiness = {
  "@context": "https://schema.org",
  "@type": "BedAndBreakfast",
  name: "Il Casino Casalino",
  description:
    "Un rifugio autentico nel cuore della Puglia. Bed & Breakfast a Francavilla Fontana, Brindisi — camere con colazione, giardino e terrazza.",
  url: BASE_URL,
  telephone: process.env.NEXT_PUBLIC_BUSINESS_PHONE ?? "",
  email: process.env.NEXT_PUBLIC_BUSINESS_EMAIL ?? "ilcasinocasalino@gmail.com",
  image: `${BASE_URL}/images/drawing-room3.webp`,
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
    { "@type": "LocationFeatureSpecification", name: "Giardino", value: true },
    { "@type": "LocationFeatureSpecification", name: "Terrazza", value: true },
    { "@type": "LocationFeatureSpecification", name: "Wi-Fi", value: true },
    { "@type": "LocationFeatureSpecification", name: "Aria condizionata", value: true },
  ],
  containsPlace: [
    {
      "@type": "HotelRoom",
      name: "Camera Mirtillo",
      description: "Camera doppia con bagno privato.",
      occupancy: { "@type": "QuantitativeValue", maxValue: 2 },
    },
    {
      "@type": "HotelRoom",
      name: "Camera Limone",
      description: "Camera doppia con bagno privato.",
      occupancy: { "@type": "QuantitativeValue", maxValue: 2 },
    },
    {
      "@type": "HotelRoom",
      name: "Camera Oria",
      description: "Camera doppia con bagno privato.",
      occupancy: { "@type": "QuantitativeValue", maxValue: 2 },
    },
    {
      "@type": "HotelRoom",
      name: "Camera Francavilla",
      description: "Camera doppia con bagno privato.",
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
