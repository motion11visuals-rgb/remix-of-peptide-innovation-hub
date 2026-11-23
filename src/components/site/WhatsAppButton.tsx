import { MessageCircle } from "lucide-react";

export const WHATSAPP_URL = "https://wa.me/17865268228";

export function WhatsAppButton() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-whatsapp px-4 py-3 font-display text-sm font-semibold text-whatsapp-foreground shadow-lg transition-transform hover:scale-105"
    >
      <MessageCircle className="size-5" />
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
}
