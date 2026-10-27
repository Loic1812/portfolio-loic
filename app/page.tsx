import Image from "next/image";
import type { IconType } from "react-icons";
import { FaGithub, FaGraduationCap, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import {
  FiArrowUpRight,
  FiCheck,
  FiDatabase,
  FiGitBranch,
  FiHeart,
  FiLayers,
  FiMapPin,
  FiMonitor,
  FiPlay,
  FiServer,
  FiStar,
  FiTool,
} from "react-icons/fi";
import {
  SiDjango,
  SiDocker,
  SiFfmpeg,
  SiGit,
  SiHtml5,
  SiJavascript,
  SiJsonwebtokens,
  SiMysql,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiPython,
  SiReact,
  SiStripe,
  SiTailwindcss,
} from "react-icons/si";

import ContactForm from "@/components/ContactForm";
import Navbar from "@/components/Navbar";
import PhoneFrame from "@/components/PhoneFrame";
import Reveal from "@/components/Reveal";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { GITHUB_URL, getRepos, resolveLinks, type ProjectLinkConfig } from "@/lib/github";
import { SITE, waLink } from "@/lib/site";

// La page se régénère toute seule toutes les heures (données GitHub à jour).
export const revalidate = 3600;

/* ======================================================================
   DONNÉES — modifie ici
   ====================================================================== */

const SKILL_GROUPS: {
  title: string;
  icon: IconType;
  items: { label: string; icon: IconType }[];
}[] = [
  {
    title: "Backend",
    icon: FiServer,
    items: [
      { label: "Python", icon: SiPython },
      { label: "Django", icon: SiDjango },
      { label: "Django REST Framework", icon: FiServer },
      { label: "Node.js", icon: SiNodedotjs },
    ],
  },
  {
    title: "Frontend",
    icon: FiMonitor,
    items: [
      { label: "React", icon: SiReact },
      { label: "Next.js", icon: SiNextdotjs },
      { label: "JavaScript", icon: SiJavascript },
      { label: "HTML", icon: SiHtml5 },
      { label: "Tailwind CSS", icon: SiTailwindcss },
    ],
  },
  {
    title: "Base de données",
    icon: FiDatabase,
    items: [
      { label: "PostgreSQL", icon: SiPostgresql },
      { label: "MySQL", icon: SiMysql },
    ],
  },
  {
    title: "Autres",
    icon: FiTool,
    items: [
      { label: "Stripe API", icon: SiStripe },
      { label: "Git", icon: SiGit },
      { label: "Docker", icon: SiDocker },
      { label: "FFmpeg", icon: SiFfmpeg },
      { label: "JWT Auth", icon: SiJsonwebtokens },
    ],
  },
];

/**
 * Liens GitHub des projets. Par défaut le site retrouve tout seul le dépôt de chaque
 * projet à partir de son nom (mots-clés). Si tu connais le nom exact du dépôt, mets-le
 * dans `repo` ; pour une démo en ligne, mets le lien dans `demo`.
 */
const PROJECT_LINKS: Record<"afrivision" | "zerogaspi" | "immo", ProjectLinkConfig> = {
  afrivision: { keywords: ["afrivision", "afrision", "afri-vision"], repo: "", demo: "" },
  zerogaspi: { keywords: ["zerogaspi", "zero-gaspi", "gaspi"], repo: "", demo: "" },
  immo: { keywords: ["immobilier", "immo", "realestate"], repo: "", demo: "" },
};

const BRAINS: { icon: IconType; title: string; points: string[] }[] = [
  {
    icon: FiLayers,
    title: "Producteur",
    points: ["Upload de films", "Tableau de bord", "70 % des revenus"],
  },
  {
    icon: FiPlay,
    title: "Abonné",
    points: [
      "Abonnement mensuel",
      "Location à la carte",
      "Offline mode",
      "Data Saver pour l'Afrique",
      "Up Next / Continuer à regarder",
      "Watch Party",
      "Partage famille (6 personnes)",
    ],
  },
  { icon: FiCheck, title: "Admin", points: ["Validation des contenus"] },
];

/* ======================================================================
   PETITS COMPOSANTS
   ====================================================================== */

function SectionHead({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <div className="mb-10 max-w-2xl">
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-subtle">{eyebrow}</p>
      <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
      {sub && <p className="mt-3 text-base leading-relaxed text-muted">{sub}</p>}
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-md border border-line bg-surface2 px-2.5 py-1 text-xs text-muted">
      {children}
    </span>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-line px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider text-muted">
      {children}
    </span>
  );
}

function ProjectActions({
  demo,
  repoUrl,
  linked,
}: {
  demo: string | null;
  repoUrl: string;
  linked: boolean;
}) {
  const base =
    "inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors";
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      {demo ? (
        <a
          href={demo}
          target="_blank"
          rel="noopener noreferrer"
          className={`${base} bg-accent text-accent-fg hover:opacity-90`}
        >
          Live Demo <FiArrowUpRight className="h-4 w-4" aria-hidden />
        </a>
      ) : (
        <span
          className={`${base} cursor-default border border-line text-subtle`}
          title="Le lien de démo sera ajouté très bientôt"
        >
          Live Demo · bientôt
        </span>
      )}
      <a
        href={repoUrl}
        target="_blank"
        rel="noopener noreferrer"
        title={linked ? "Voir le code source sur GitHub" : "Voir mes dépôts sur GitHub"}
        className={`${base} border border-line bg-surface text-fg hover:bg-surface2`}
      >
        <FaGithub className="h-4 w-4" aria-hidden /> GitHub
      </a>
    </div>
  );
}

/** Aperçu stylisé (100 % CSS) du lecteur AFRIVISION : audio, sous-titres, watermark. */
function AfriVisionMock() {
  const tiles = [
    { lang: "Wolof", from: "#3f3f46" },
    { lang: "Yoruba", from: "#52525b" },
    { lang: "Lingala", from: "#44403c" },
    { lang: "Swahili", from: "#404040" },
  ];
  return (
    <div
      className="overflow-hidden rounded-xl border border-line bg-[#0b0b0c] text-white shadow-2xl"
      aria-hidden
    >
      <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-white/20" />
        <span className="h-2 w-2 rounded-full bg-white/20" />
        <span className="h-2 w-2 rounded-full bg-white/20" />
        <span className="ml-3 font-mono text-[10px] text-white/40">afrivision.com</span>
      </div>

      <div
        className="relative aspect-video"
        style={{ background: "radial-gradient(circle at 30% 20%, #3a3a3f 0%, #121214 70%)" }}
      >
        <span className="absolute left-4 top-4 -rotate-6 select-none font-mono text-[10px] text-white/30">
          +225 •• •• •• ••
        </span>
        <span className="absolute bottom-16 right-5 -rotate-6 select-none font-mono text-[10px] text-white/20">
          +225 •• •• •• ••
        </span>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-white/10">
            <FiPlay className="h-5 w-5" />
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 p-3">
          <div className="mb-2.5 h-1 overflow-hidden rounded-full bg-white/15">
            <div className="h-full w-[38%] rounded-full bg-white/80" />
          </div>
          <div className="flex flex-wrap gap-2 text-[10px]">
            <span className="rounded border border-white/20 bg-black/40 px-2 py-1">
              Audio · Original (Fon) ▾
            </span>
            <span className="rounded border border-white/20 bg-black/40 px-2 py-1">
              Sous-titres · Français ▾
            </span>
          </div>
        </div>
      </div>

      <div className="p-3">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-white/40">
          Channels · une chaîne par producteur
        </p>
        <div className="grid grid-cols-4 gap-2">
          {tiles.map((t) => (
            <div
              key={t.lang}
              className="flex aspect-[2/3] items-end rounded-md border border-white/10 p-1.5"
              style={{ background: `linear-gradient(160deg, ${t.from}, #0b0b0c)` }}
            >
              <span className="rounded bg-black/50 px-1 py-0.5 text-[9px] text-white/80">
                {t.lang}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ======================================================================
   PAGE
   ====================================================================== */

export default async function Home() {
  const repos = await getRepos();
  const links = {
    afrivision: resolveLinks(repos, PROJECT_LINKS.afrivision),
    zerogaspi: resolveLinks(repos, PROJECT_LINKS.zerogaspi),
    immo: resolveLinks(repos, PROJECT_LINKS.immo),
  };

  const own = repos.filter((r) => !r.fork);
  const stars = own.reduce((sum, r) => sum + r.stargazers_count, 0);
  const langCount = own.reduce<Record<string, number>>((acc, r) => {
    if (r.language) acc[r.language] = (acc[r.language] ?? 0) + 1;
    return acc;
  }, {});
  const topLangs = Object.entries(langCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const latest = own.slice(0, 6);

  return (
    <>
      <Navbar shortName={SITE.shortName} />

      <main id="top">
        {/* ============================== HERO ============================== */}
        <section className="relative overflow-hidden pb-20 pt-28 sm:pb-28 sm:pt-36">
          <div className="bg-grid pointer-events-none absolute inset-0" aria-hidden />
          <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="animate-fade-up">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-xs text-muted">
                <FiMapPin className="h-3.5 w-3.5" aria-hidden />
                {SITE.locations}
              </div>

              <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
                {SITE.name}
              </h1>
              <p className="mt-4 font-mono text-sm text-muted sm:text-base">{SITE.title}</p>

              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
                {SITE.slogan} <span className="font-medium text-fg">{SITE.sloganEnd}</span>
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#projects"
                  className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-accent-fg transition-opacity hover:opacity-90"
                >
                  Voir mes projets
                </a>
                <a
                  href={SITE.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-line bg-surface px-5 py-3 text-sm font-medium transition-colors hover:bg-surface2"
                >
                  <FaGithub className="h-4 w-4" aria-hidden /> GitHub
                </a>
                <a
                  href={SITE.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-line bg-surface px-5 py-3 text-sm font-medium transition-colors hover:bg-surface2"
                >
                  <FaLinkedin className="h-4 w-4" aria-hidden /> LinkedIn
                </a>
              </div>

              <p className="mt-8 flex items-center gap-2 text-sm text-subtle">
                <FaGraduationCap className="h-4 w-4" aria-hidden />
                {SITE.school}
              </p>
            </div>

            <div className="order-first flex justify-center lg:order-last lg:justify-end">
              <div className="relative">
                <div className="absolute -inset-6 rounded-full bg-fg/10 blur-3xl" aria-hidden />
                <div className="relative rounded-full border border-line bg-surface p-2">
                  <Image
                    src="/loic.jpg"
                    alt={`Portrait de ${SITE.shortName}`}
                    width={640}
                    height={640}
                    priority
                    sizes="(max-width: 640px) 176px, (max-width: 1024px) 256px, 320px"
                    className="h-44 w-44 rounded-full object-cover sm:h-64 sm:w-64 lg:h-80 lg:w-80"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================= SKILLS ============================= */}
        <section id="skills" className="border-t border-line py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-5">
            <Reveal>
              <SectionHead
                eyebrow="01 — Compétences"
                title="Une stack complète, de l'idée au paiement."
                sub="Backend, frontend, bases de données et outils : tout ce qu'il faut pour livrer une plateforme de bout en bout."
              />
            </Reveal>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {SKILL_GROUPS.map((group, i) => (
                <Reveal key={group.title} delay={i * 70}>
                  <div className="h-full rounded-xl border border-line bg-surface p-5">
                    <div className="mb-4 flex items-center gap-2.5">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-surface2 text-muted">
                        <group.icon className="h-4 w-4" aria-hidden />
                      </span>
                      <h3 className="text-sm font-semibold">{group.title}</h3>
                    </div>
                    <ul className="space-y-2.5">
                      {group.items.map((item) => (
                        <li key={item.label} className="flex items-center gap-3 text-sm text-muted">
                          <item.icon className="h-4 w-4 shrink-0 text-fg" aria-hidden />
                          {item.label}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ============================ PROJECTS ============================ */}
        <section id="projects" className="border-t border-line py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-5">
            <Reveal>
              <SectionHead
                eyebrow="02 — Projets"
                title="Des plateformes pensées pour l'Afrique."
                sub="Trois projets, du cinéma en ligne à l'anti-gaspillage et à l'immobilier : chacun résout un vrai problème local."
              />
            </Reveal>

            {/* ---------- Projet 1 : AFRIVISION (featured) ---------- */}
            <Reveal>
              <article className="overflow-hidden rounded-2xl border border-line bg-surface">
                <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
                  <div className="p-6 sm:p-9">
                    <div className="mb-4 flex flex-wrap items-center gap-2">
                      <Badge>Projet phare</Badge>
                      <Badge>VOD · Netflix × Apple TV</Badge>
                    </div>
                    <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">AFRIVISION</h3>
                    <p className="mt-1 text-base text-muted sm:text-lg">Le Netflix du cinéma africain</p>

                    <p className="mt-5 text-sm leading-relaxed text-muted">
                      Plateforme VOD avec modèle hybride Netflix × Apple TV. Chaque producteur a sa
                      propre chaîne payante, comme les Apple TV Channels. J&apos;ai codé trois «&nbsp;cerveaux&nbsp;» :
                    </p>

                    <div className="mt-5 grid gap-3 sm:grid-cols-3">
                      {BRAINS.map((b) => (
                        <div key={b.title} className="rounded-lg border border-line bg-surface2 p-3.5">
                          <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
                            <b.icon className="h-4 w-4 text-muted" aria-hidden />
                            {b.title}
                          </div>
                          <ul className="space-y-1 text-xs leading-relaxed text-muted">
                            {b.points.map((p) => (
                              <li key={p}>· {p}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {[
                        "Player vidéo pro",
                        "Paiement Stripe (carte)",
                        "Watermark dynamique anti-piratage",
                        "Système de Channels",
                      ].map((f) => (
                        <span
                          key={f}
                          className="inline-flex items-center gap-1.5 rounded-md border border-line px-2.5 py-1 text-xs text-fg"
                        >
                          <FiCheck className="h-3 w-3 text-muted" aria-hidden /> {f}
                        </span>
                      ))}
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {["Python Django", "Next.js", "PostgreSQL", "Stripe", "FFmpeg"].map((s) => (
                        <Chip key={s}>{s}</Chip>
                      ))}
                    </div>

                    <div className="mt-7">
                      <ProjectActions {...links.afrivision} />
                    </div>
                  </div>

                  <div className="flex items-center border-t border-line bg-surface2 p-6 sm:p-9 lg:border-l lg:border-t-0">
                    <div className="w-full">
                      <AfriVisionMock />
                    </div>
                  </div>
                </div>
              </article>
            </Reveal>

            {/* ---------- Projets 2 et 3 ---------- */}
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              {/* Zero Gaspi Africa */}
              <Reveal className="h-full">
                <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface">
                  <div className="flex-1 p-6 sm:p-8">
                    <div className="mb-4 flex flex-wrap items-center gap-2">
                      <Badge>Impact social</Badge>
                      <Badge>Mobile first</Badge>
                    </div>
                    <h3 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
                      Zero Gaspi Africa
                      <FiHeart className="h-5 w-5 text-muted" aria-hidden />
                    </h3>
                    <p className="mt-1 text-base text-muted">Luttez contre le gaspillage alimentaire</p>

                    <blockquote className="mt-5 border-l-2 border-fg/40 pl-4 text-sm leading-relaxed text-muted">
                      Zero Gaspi Africa est une application mobile pensée pour réduire le gaspillage
                      alimentaire en Afrique, en connectant les commerçants aux consommateurs à
                      travers des sacs surprises à prix réduits.
                    </blockquote>

                    <ol className="mt-5 space-y-2 text-sm text-muted">
                      <li>
                        <span className="font-mono text-xs text-subtle">01</span>{" "}
                        Le commerçant (restaurant, boulangerie, supermarché) poste un « sac surprise » avec ses invendus, à prix réduit.
                      </li>
                      <li>
                        <span className="font-mono text-xs text-subtle">02</span>{" "}
                        Le consommateur réserve sur la carte, paye, puis vient le chercher.
                      </li>
                      <li>
                        <span className="font-mono text-xs text-subtle">03</span>{" "}
                        Résultat : un impact écologique et économique.
                      </li>
                    </ol>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {["Liste des sacs", "Carte & géolocalisation", "Réservation", "Dashboard commerçant"].map((f) => (
                        <span
                          key={f}
                          className="inline-flex items-center gap-1.5 rounded-md border border-line px-2.5 py-1 text-xs text-fg"
                        >
                          <FiCheck className="h-3 w-3 text-muted" aria-hidden /> {f}
                        </span>
                      ))}
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {["HTML", "Tailwind CSS", "JavaScript", "Mobile First"].map((s) => (
                        <Chip key={s}>{s}</Chip>
                      ))}
                    </div>

                    <div className="mt-7">
                      <ProjectActions {...links.zerogaspi} />
                    </div>
                  </div>

                  <div className="flex items-start justify-center gap-4 border-t border-line bg-surface2 px-6 pt-8 sm:px-8">
                    <PhoneFrame
                      src="/projects/zerogaspi-2.jpg"
                      alt="Zero Gaspi Africa : page d'accueil « Sauvez de la nourriture, économisez de l'argent »"
                      width={557}
                      height={844}
                      className="translate-y-0"
                    />
                    <PhoneFrame
                      src="/projects/zerogaspi-1.jpg"
                      alt="Zero Gaspi Africa : filtres par type de commerce et offres à proximité"
                      width={557}
                      height={880}
                      className="translate-y-6"
                    />
                  </div>
                </article>
              </Reveal>

              {/* Immobilier Côte d'Ivoire */}
              <Reveal className="h-full" delay={90}>
                <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface">
                  <div className="flex-1 p-6 sm:p-8">
                    <div className="mb-4 flex flex-wrap items-center gap-2">
                      <Badge>Immobilier</Badge>
                      <Badge>Mobile first</Badge>
                    </div>
                    <h3 className="text-2xl font-semibold tracking-tight">Immobilier Côte d&apos;Ivoire</h3>
                    <p className="mt-1 text-base text-muted">Location et vente de biens, en FCFA</p>

                    <p className="mt-5 text-sm leading-relaxed text-muted">
                      Application mobile de recherche immobilière pour la Côte d&apos;Ivoire : annonces
                      à louer et à vendre, catégories de biens, carte interactive, quartiers
                      populaires d&apos;Abidjan, favoris et visites virtuelles.
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {["À louer / À vendre", "Carte des biens", "Quartiers populaires", "Favoris", "Visite virtuelle"].map((f) => (
                        <span
                          key={f}
                          className="inline-flex items-center gap-1.5 rounded-md border border-line px-2.5 py-1 text-xs text-fg"
                        >
                          <FiCheck className="h-3 w-3 text-muted" aria-hidden /> {f}
                        </span>
                      ))}
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {["HTML", "Tailwind CSS", "JavaScript", "Mobile First"].map((s) => (
                        <Chip key={s}>{s}</Chip>
                      ))}
                    </div>

                    <div className="mt-7">
                      <ProjectActions {...links.immo} />
                    </div>
                  </div>

                  <div className="flex items-start justify-center gap-4 border-t border-line bg-surface2 px-6 pt-8 sm:px-8">
                    <PhoneFrame
                      src="/projects/immo-1.jpg"
                      alt="Immobilier Côte d'Ivoire : carte et quartiers populaires (Cocody, Plateau)"
                      width={557}
                      height={880}
                    />
                    <PhoneFrame
                      src="/projects/immo-2.jpg"
                      alt="Immobilier Côte d'Ivoire : biens recommandés avec prix en FCFA"
                      width={557}
                      height={880}
                      className="translate-y-6"
                    />
                  </div>
                </article>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ============================= GITHUB ============================= */}
        <section id="github" className="border-t border-line py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-5">
            <Reveal>
              <SectionHead
                eyebrow="03 — GitHub"
                title="Tout mon code est public."
                sub="Cette section se met à jour automatiquement depuis mon compte GitHub."
              />
            </Reveal>

            <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
              <Reveal>
                <div className="h-full rounded-xl border border-line bg-surface p-6">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface2">
                      <FaGithub className="h-5 w-5" aria-hidden />
                    </span>
                    <div>
                      <p className="text-sm font-semibold">@{SITE.githubUser}</p>
                      <p className="text-xs text-muted">github.com/{SITE.githubUser}</p>
                    </div>
                  </div>

                  {own.length > 0 && (
                    <>
                      <dl className="mt-6 grid grid-cols-2 gap-3">
                        <div className="rounded-lg border border-line bg-surface2 p-3">
                          <dt className="text-xs text-muted">Dépôts publics</dt>
                          <dd className="mt-1 text-2xl font-semibold">{own.length}</dd>
                        </div>
                        <div className="rounded-lg border border-line bg-surface2 p-3">
                          <dt className="text-xs text-muted">Étoiles reçues</dt>
                          <dd className="mt-1 text-2xl font-semibold">{stars}</dd>
                        </div>
                      </dl>

                      {topLangs.length > 0 && (
                        <div className="mt-6">
                          <p className="mb-2.5 font-mono text-[11px] uppercase tracking-wider text-subtle">
                            Langages principaux
                          </p>
                          <ul className="space-y-2">
                            {topLangs.map(([lang, n]) => (
                              <li key={lang} className="flex items-center gap-3 text-sm">
                                <span className="w-24 shrink-0 text-muted">{lang}</span>
                                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface2">
                                  <span
                                    className="block h-full rounded-full bg-fg/70"
                                    style={{ width: `${Math.round((n / topLangs[0][1]) * 100)}%` }}
                                  />
                                </span>
                                <span className="w-5 text-right text-xs text-subtle">{n}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </>
                  )}

                  <a
                    href={GITHUB_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-accent-fg transition-opacity hover:opacity-90"
                  >
                    Voir mon profil GitHub <FiArrowUpRight className="h-4 w-4" aria-hidden />
                  </a>
                </div>
              </Reveal>

              <Reveal delay={90}>
                {latest.length > 0 ? (
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {latest.map((r) => (
                      <li key={r.name}>
                        <a
                          href={r.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex h-full flex-col rounded-xl border border-line bg-surface p-4 transition-colors hover:bg-surface2"
                        >
                          <span className="flex items-center gap-2 text-sm font-semibold">
                            <FiGitBranch className="h-4 w-4 shrink-0 text-muted" aria-hidden />
                            <span className="truncate">{r.name}</span>
                            <FiArrowUpRight
                              className="ml-auto h-4 w-4 shrink-0 text-subtle transition-colors group-hover:text-fg"
                              aria-hidden
                            />
                          </span>
                          <span className="mt-2 line-clamp-2 flex-1 text-xs leading-relaxed text-muted">
                            {r.description || "Dépôt sur GitHub"}
                          </span>
                          <span className="mt-3 flex items-center gap-3 text-xs text-subtle">
                            {r.language && <span>{r.language}</span>}
                            <span className="inline-flex items-center gap-1">
                              <FiStar className="h-3 w-3" aria-hidden /> {r.stargazers_count}
                            </span>
                            <span className="ml-auto">
                              {new Date(r.pushed_at).toLocaleDateString("fr-FR", {
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex h-full flex-col items-start justify-center rounded-xl border border-dashed border-line bg-surface p-6">
                    <p className="text-sm font-semibold">Mes dépôts sont sur GitHub</p>
                    <p className="mt-1.5 text-sm text-muted">
                      Retrouve le code de mes projets, mes expériences et mes contributions.
                    </p>
                  </div>
                )}
              </Reveal>
            </div>
          </div>
        </section>

        {/* ============================ CONTACT ============================= */}
        <section id="contact" className="border-t border-line py-20 sm:py-24">
          <div className="mx-auto grid max-w-6xl gap-12 px-5 lg:grid-cols-2">
            <Reveal>
              <SectionHead
                eyebrow="04 — Contact"
                title="Parlons de ton projet."
                sub="Une idée de plateforme, un besoin de développeur Full-Stack ? Écris-moi ici ou directement sur WhatsApp."
              />

              <div className="space-y-3">
                {[SITE.whatsapp.india, SITE.whatsapp.ci].map((w) => (
                  <a
                    key={w.number}
                    href={waLink(w.number)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4 rounded-xl border border-line bg-surface p-4 transition-colors hover:bg-surface2"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-wa text-white">
                      <FaWhatsapp className="h-5 w-5" aria-hidden />
                    </span>
                    <span className="flex-1">
                      <span className="block text-sm font-semibold">WhatsApp · {w.label}</span>
                      <span className="block text-sm text-muted">{w.display}</span>
                    </span>
                    <FiArrowUpRight className="h-4 w-4 text-subtle transition-colors group-hover:text-fg" aria-hidden />
                  </a>
                ))}
              </div>

              <div className="mt-6 flex gap-3">
                <a
                  href={SITE.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-fg"
                >
                  <FaGithub className="h-4 w-4" aria-hidden /> GitHub
                </a>
                <a
                  href={SITE.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-fg"
                >
                  <FaLinkedin className="h-4 w-4" aria-hidden /> LinkedIn
                </a>
              </div>
            </Reveal>

            <Reveal delay={90}>
              <div className="rounded-2xl border border-line bg-surface p-6 sm:p-8">
                <ContactForm />
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      {/* ============================= FOOTER ============================= */}
      <footer className="border-t border-line pb-28 pt-8 sm:pb-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 text-xs text-subtle sm:flex-row">
          <p>
            © {new Date().getFullYear()} {SITE.name}. Tous droits réservés.
          </p>
          <p>Bengaluru · Abidjan</p>
        </div>
      </footer>

      <WhatsAppFloat />
    </>
  );
}
