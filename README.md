# Portfolio — Zougouri Domin Loic Emmanuel

Next.js 14 (App Router) · Tailwind CSS · TypeScript. One-page, mode sombre par défaut.

## Lancer en local

```bash
npm install
npm run dev        # http://localhost:3000
```

## Déployer sur Vercel (1 clic)

1. Crée un dépôt vide sur GitHub (ex : `portfolio`) : https://github.com/new
2. Envoie le projet :
   ```bash
   git init
   git add .
   git commit -m "Portfolio"
   git branch -M main
   git remote add origin https://github.com/Loic1812/portfolio.git
   git push -u origin main
   ```
3. Va sur https://vercel.com/new, clique **Import** sur ton dépôt `portfolio`, puis **Deploy**.
   Vercel détecte Next.js tout seul : aucun réglage à faire.
4. Chaque `git push` redéploie le site automatiquement.

## Variables d'environnement (facultatives)

Vercel > ton projet > Settings > Environment Variables (voir `.env.example`) :

| Variable | Rôle |
|---|---|
| `NEXT_PUBLIC_LINKEDIN_URL` | Lien exact de ton profil LinkedIn (sinon le bouton ouvre une recherche) |
| `NEXT_PUBLIC_FORMSPREE_ID` | Reçoit les messages du formulaire par email (gratuit sur formspree.io). Sans elle, le formulaire ouvre WhatsApp avec le message pré-rempli |
| `NEXT_PUBLIC_SITE_URL` | Ton nom de domaine final (aperçus de partage) |
| `GITHUB_TOKEN` | Facultatif : évite la limite de 60 requêtes/heure de l'API GitHub |

Après avoir ajouté une variable, redéploie (Deployments > ⋯ > Redeploy).

## Tout est relié à ton GitHub

- Le bouton GitHub du haut, le bouton LinkedIn, le pied de page et la section **GitHub** pointent vers `github.com/Loic1812`.
- La section **GitHub** lit tes dépôts publics via l'API (mise à jour toutes les heures) : nombre de dépôts, étoiles, langages, derniers projets.
- Chaque carte projet retrouve **toute seule** son dépôt par le nom (`afrivision`, `gaspi`, `immobilier`…) et son bouton **GitHub** ouvre ce dépôt. Le bouton **Live Demo** utilise le champ *Website* du dépôt, ou GitHub Pages s'il est activé.
- Pour forcer un dépôt ou une démo, modifie `PROJECT_LINKS` en haut de `app/page.tsx` :
  ```ts
  zerogaspi: { keywords: [...], repo: "nom-exact-du-depot", demo: "https://ma-demo.vercel.app" },
  ```

## Personnaliser

- Infos perso, numéros WhatsApp, message pré-rempli : `lib/site.ts`
- Compétences, projets, textes : `app/page.tsx`
- Couleurs : variables en haut de `app/globals.css` (clair et sombre)
- Photo : remplace `public/loic.jpg` ; captures : `public/projects/`
