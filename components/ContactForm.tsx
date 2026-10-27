"use client";

import { useState } from "react";
import { FiSend } from "react-icons/fi";
import { SITE, waLink } from "@/lib/site";

type Status = "idle" | "sending" | "sent" | "error" | "whatsapp";

const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID;

const field =
  "w-full rounded-lg border border-line bg-bg px-3.5 py-2.5 text-sm text-fg placeholder:text-subtle focus:border-fg/40 focus:outline-none";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    // Sans Formspree : le message est envoyé via WhatsApp (Côte d'Ivoire), zéro configuration.
    if (!FORMSPREE_ID) {
      const text = `Salut Loic, c'est ${name} (${email}).\n\n${message}`;
      window.open(waLink(SITE.whatsapp.ci.number, text), "_blank", "noopener,noreferrer");
      setStatus("whatsapp");
      form.reset();
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (!res.ok) throw new Error("bad status");
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate={false}>
      <div>
        <label htmlFor="name" className="mb-1.5 block text-xs font-medium text-muted">
          Nom
        </label>
        <input id="name" name="name" type="text" required autoComplete="name" placeholder="Ton nom" className={field} />
      </div>
      <div>
        <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-muted">
          Email
        </label>
        <input id="email" name="email" type="email" required autoComplete="email" placeholder="toi@exemple.com" className={field} />
      </div>
      <div>
        <label htmlFor="message" className="mb-1.5 block text-xs font-medium text-muted">
          Message
        </label>
        <textarea id="message" name="message" required rows={5} placeholder="Parle-moi de ton projet…" className={`${field} resize-y`} />
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-accent-fg transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        <FiSend className="h-4 w-4" aria-hidden />
        {status === "sending" ? "Envoi…" : "Envoyer le message"}
      </button>

      <p aria-live="polite" className="min-h-[1.25rem] text-center text-xs text-muted">
        {status === "sent" && "Merci ! Ton message est bien parti, je te réponds vite."}
        {status === "whatsapp" && "WhatsApp s'est ouvert avec ton message : appuie sur envoyer."}
        {status === "error" && "Oups, l'envoi a échoué. Écris-moi directement sur WhatsApp."}
      </p>
    </form>
  );
}
