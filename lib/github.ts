/**
 * Tout est relié à ton GitHub : le site lit tes dépôts publics via l'API GitHub
 * (mise à jour automatique toutes les heures) et retrouve le dépôt de chaque projet.
 */
import { SITE } from "./site";

export const GITHUB_USER = SITE.githubUser;
export const GITHUB_URL = SITE.github;

export type Repo = {
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  pushed_at: string;
  homepage: string | null;
  has_pages: boolean;
  fork: boolean;
  archived: boolean;
};

export async function getRepos(): Promise<Repo[]> {
  try {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
      "User-Agent": "portfolio-loic",
    };
    if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=pushed`,
      { headers, next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const data = (await res.json()) as Repo[];
    return Array.isArray(data) ? data.filter((r) => !r.archived) : [];
  } catch {
    return [];
  }
}

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

export type ProjectLinkConfig = {
  /** Mots qui permettent de retrouver le dépôt par son nom (ex: "gaspi") */
  keywords: string[];
  /** Si tu connais le nom exact du dépôt, mets-le ici (ex: "zero-gaspi-africa") */
  repo?: string;
  /** Lien de démo en ligne (sinon : champ "Website" du dépôt, puis GitHub Pages) */
  demo?: string;
};

export function resolveLinks(repos: Repo[], cfg: ProjectLinkConfig) {
  const match = cfg.repo
    ? repos.find((r) => r.name.toLowerCase() === cfg.repo!.toLowerCase()) ?? null
    : repos.find((r) => !r.fork && cfg.keywords.some((k) => norm(r.name).includes(norm(k)))) ?? null;

  const repoUrl = cfg.repo ? `${GITHUB_URL}/${cfg.repo}` : match?.html_url ?? GITHUB_URL;

  const homepage = match?.homepage?.trim() ?? "";
  const pagesUrl = match?.has_pages
    ? `https://${GITHUB_USER.toLowerCase()}.github.io/${match.name}/`
    : "";
  const demo = cfg.demo || (/^https?:\/\//.test(homepage) ? homepage : "") || pagesUrl || null;

  return { repoUrl, demo, linked: Boolean(cfg.repo || match) };
}
