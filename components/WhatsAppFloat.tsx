import { FaWhatsapp } from "react-icons/fa";
import { SITE, waLink } from "@/lib/site";

/** Deux boutons WhatsApp flottants (Inde +91 / Côte d'Ivoire +225), messages pré-remplis. */
export default function WhatsAppFloat() {
  const items = [
    { ...SITE.whatsapp.india, key: "in" },
    { ...SITE.whatsapp.ci, key: "ci" },
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2.5 sm:bottom-6 sm:right-6">
      {items.map((it) => (
        <a
          key={it.key}
          href={waLink(it.number)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Écrire à Loic sur WhatsApp (${it.label}, ${it.code})`}
          className="group flex animate-wa-pulse items-center gap-2 rounded-full bg-wa py-2.5 pl-3 pr-4 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-105"
        >
          <FaWhatsapp className="h-5 w-5" aria-hidden />
          <span className="leading-none">
            <span className="hidden sm:inline">{it.label} </span>
            {it.code}
          </span>
        </a>
      ))}
    </div>
  );
}
