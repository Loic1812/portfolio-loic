/** Toutes tes infos au même endroit : modifie ici, tout le site se met à jour. */
export const SITE = {
  name: "Zougouri Domin Loic Emmanuel",
  shortName: "Loic Zougouri",
  title: "Étudiant en Informatique & Full-Stack Developer",
  slogan: "Je construis des plateformes qui donnent du pouvoir aux créateurs africains.",
  sloganEnd: "De l'idée au paiement.",
  locations: "Bengaluru, India / Abidjan, Côte d'Ivoire",
  school: "PIGIER Côte d'Ivoire",
  githubUser: "Loic1812",
  github: "https://github.com/Loic1812",
  // Mets NEXT_PUBLIC_LINKEDIN_URL dans Vercel avec le lien exact de ton profil.
  linkedin:
    process.env.NEXT_PUBLIC_LINKEDIN_URL ||
    "https://www.linkedin.com/search/results/people/?keywords=Loic%20Zougouri",
  whatsapp: {
    india: { label: "Inde", code: "+91", display: "+91 73531 50689", number: "917353150689" },
    ci: { label: "Côte d'Ivoire", code: "+225", display: "+225 01 01 18 81 35", number: "2250101188135" },
  },
  waMessage: "Salut Loic, j'ai vu ton portfolio et j'aimerais échanger avec toi.",
};

export const waLink = (number: string, text: string = SITE.waMessage) =>
  `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
