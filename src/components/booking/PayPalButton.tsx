"use client";

import { PayPalButtons } from "@paypal/react-paypal-js";
import { useLanguage } from "@/context/LanguageContext";
import type { BookingFormData, PriceSummary } from "@/types/booking";

interface PayPalButtonProps {
  pricing: PriceSummary;
  bookingData: BookingFormData;
  onValidate: () => boolean;
}

export function PayPalButton({ pricing, bookingData, onValidate }: PayPalButtonProps) {
  const { t } = useLanguage();

  const createOrder = async () => {
    if (!onValidate()) throw new Error("Validation failed");
    const res = await fetch("/api/paypal/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: pricing.total, bookingData }),
    });
    const data = await res.json();
    return data.orderId as string;
  };

  const onApprove = async (data: { orderID: string }) => {
    const res = await fetch("/api/paypal/capture-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: data.orderID, bookingData }),
    });
    if (res.ok) {
      window.location.hash = "#booking-success";
    }
  };

  return (
    <div>
      <p className="text-xs tracking-[0.12em] uppercase text-stone mb-3 text-center">
        {t.booking.payWith}
      </p>
      <PayPalButtons
        style={{ layout: "vertical", color: "black", label: "pay", height: 42 }}
        createOrder={createOrder}
        onApprove={onApprove}
      />
    </div>
  );
}
