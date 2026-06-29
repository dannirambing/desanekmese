import type { OrderChannel } from "@prisma/client";

export function getOrderLabel(type: OrderChannel): string {
  switch (type) {
    case "WHATSAPP":
      return "Pesan via WhatsApp";
    case "SHOPEE":
      return "Beli di Shopee";
    case "TOKOPEDIA":
      return "Beli di Tokopedia";
    default:
      return "Pesan Sekarang";
  }
}

export const ORDER_CHANNEL_OPTIONS: { value: OrderChannel; label: string }[] = [
  { value: "WHATSAPP", label: "WhatsApp" },
  { value: "SHOPEE", label: "Shopee" },
  { value: "TOKOPEDIA", label: "Tokopedia" },
  { value: "CUSTOM", label: "Link Lainnya" },
];

export const DEFAULT_PRODUCT_IMAGE =
  "https://azhuh458gn.ufs.sh/f/IDwrE8y2GhNi3ndrMxvSoMcmOPwdnAtusaZWEh3SKL1F4rvg";
