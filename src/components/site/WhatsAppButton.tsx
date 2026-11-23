import { Instagram, MessageCircle } from "lucide-react";

export const WHATSAPP_URL = "https://wa.me/17865268228";
export const INSTAGRAM_URL = "https://www.instagram.com/synthesialabs";
export const INSTAGRAM_HANDLE = "@synthesialabs";

export function WhatsAppButton() {
  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2">
      <a
        href={INSTAGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Follow us on Instagram"
        className="flex items-center gap-2 rounded-full bg-primary px-4 py-3 font-display text-sm font-semibold text-primary-foreground shadow-lg transition-transform hover:scale-105"
      >
        <Instagram className="size-5" />
        <span className="hidden sm:inline">Instagram</span>
      </a>
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="flex items-center gap-2 rounded-full bg-whatsapp px-4 py-3 font-display text-sm font-semibold text-whatsapp-foreground shadow-lg transition-transform hover:scale-105"
      >
        <MessageCircle className="size-5" />
        <span className="hidden sm:inline">WhatsApp</span>
      </a>
    </div>
  );
}
