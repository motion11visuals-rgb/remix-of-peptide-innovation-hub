const cashappQr = { url: "/images/qr-8674.jpg" };
const paypalQr = { url: "/images/qr-8675.jpg" };
const zelleQr = { url: "/images/qr-8676.jpg" };

export type PaymentMethodId = "zelle" | "paypal" | "cashapp";

export type PaymentMethod = {
  id: PaymentMethodId;
  label: string;
  handleLabel: string;
  handle: string;
  copyValue: string;
  steps: string[];
  qr: string;
};

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "zelle",
    qr: zelleQr.url,
    label: "Zelle",
    handleLabel: "Send to phone number",
    handle: "(786) 526-8228",
    copyValue: "7865268228",
    steps: [
      "Open your bank app and choose Zelle.",
      "Send the exact total to (786) 526-8228.",
      "Put your order reference in the memo.",
    ],
  },
  {
    id: "paypal",
    qr: paypalQr.url,
    label: "PayPal",
    handleLabel: "Send to",
    handle: "paypal@southfloridaout",
    copyValue: "paypal@southfloridaout",
    steps: [
      "Open PayPal and choose Send.",
      "Send the exact total to paypal@southfloridaout.",
      "Put your order reference in the note.",
    ],
  },
  {
    id: "cashapp",
    qr: cashappQr.url,
    label: "Cash App",
    handleLabel: "Send to $Cashtag",
    handle: "$alanbarreto50",
    copyValue: "$alanbarreto50",
    steps: [
      "Open Cash App and tap Pay.",
      "Send the exact total to $alanbarreto50.",
      "Put your order reference in the note.",
    ],
  },
];

export function getPaymentMethod(id: string): PaymentMethod | undefined {
  return PAYMENT_METHODS.find((m) => m.id === id);
}
