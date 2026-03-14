const BASE_URL =
  process.env.PAYPAL_ENV === "production"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

async function getAccessToken(): Promise<string> {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!;
  const secret = process.env.PAYPAL_CLIENT_SECRET!;
  const credentials = Buffer.from(`${clientId}:${secret}`).toString("base64");

  const res = await fetch(`${BASE_URL}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const data = await res.json();
  return data.access_token as string;
}

export async function createPayPalOrder(amount: number): Promise<string> {
  const token = await getAccessToken();
  const currency = process.env.NEXT_PUBLIC_PAYPAL_CURRENCY ?? "EUR";

  const res = await fetch(`${BASE_URL}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: currency,
            value: amount.toFixed(2),
          },
          description: "Il Casino Casalino — Prenotazione B&B",
        },
      ],
    }),
  });

  const data = await res.json();
  return data.id as string;
}

export async function capturePayPalOrder(
  orderId: string
): Promise<{ status: string; captureId: string }> {
  const token = await getAccessToken();

  const res = await fetch(
    `${BASE_URL}/v2/checkout/orders/${orderId}/capture`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  const data = await res.json();
  const captureId =
    data.purchase_units?.[0]?.payments?.captures?.[0]?.id ?? "";
  return { status: data.status as string, captureId };
}
