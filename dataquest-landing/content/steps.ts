export const PROBLEMS = [
  { title: "Des dashboards boudés", text: "Ils existent, ils sont à jour… et seule une poignée d’initiés les ouvre.", icon: "dashboard" },
  { title: "Des formations vite oubliées", text: "Une demi-journée de formation, puis plus rien : l’habitude ne se crée jamais.", icon: "training" },
  { title: "Une culture data qui ne prend pas", text: "Les décisions se prennent encore « au feeling », loin des chiffres qui existent déjà.", icon: "culture" },
] as const;

export const STEPS = [
  { title: "On prépare votre partie", text: "Vous indiquez votre modèle, vos sites et votre outil de mesure, puis vous invitez vos joueurs. Nous construisons les cartes à partir de vos propres chiffres." },
  { title: "Vos équipes jouent", text: "Chaque jour ouvré, 5 cartes à jouer depuis le navigateur. Bonus, séries, duels d’équipes : 4 à 5 semaines pour créer l’habitude." },
  { title: "Vous mesurez le progrès", text: "Participation, bonnes réponses, grandes découvertes et progression ressentie avant / après : un bilan concret à présenter à votre direction." },
] as const;

export const MECHANICS = [
  { title: "Des bonus à jouer chaque semaine", text: "La fusée double les points, les ciseaux retirent deux mauvaises réponses, l’aimant chipe des points à un collègue.", icon: "rocket" },
  { title: "Séries et combos", text: "Jouer plusieurs jours d’affilée rapporte des points ; enchaîner les bonnes réponses déclenche un combo.", icon: "flame" },
  { title: "Des équipes tirées au sort", text: "Un tir à la corde par manche hebdomadaire : les services se mélangent, les échanges aussi.", icon: "rope" },
  { title: "La révélation du jour", text: "Les réponses se dévoilent une fois les 5 cartes jouées, chacune avec son explication : on apprend en riant.", icon: "cards" },
] as const;

export const DATA_SOURCES = [
  { title: "Calculées", text: "Lues dans votre outil de mesure d’audience, puis figées au moment de la carte." },
  { title: "Personnalisées", text: "Vos chiffres internes : CRM, ventes, magasins ou agences, saisis une fois au lancement." },
  { title: "Culture data", text: "Les notions clés pour lire un chiffre sans se tromper, RGPD compris." },
] as const;

export const BENEFITS = [
  { title: "Le bilan de manche, chaque vendredi", text: "Participation, questions jouées, taux de bonne réponse, comparés à la semaine précédente. Thème le mieux réussi, thème à renforcer, grandes découvertes." },
  { title: "Le bilan final, avant / après", text: "L’auto-évaluation du début et celle de la fin, superposées en radar sur les 8 thèmes : la progression ressentie de toute l’entreprise." },
  { title: "Un tableau de bord à J-1", text: "Engagement et fidélité au jour le jour ; relances des absents automatiques, sans action de votre part." },
  { title: "Respectueux de chacun", text: "Résultats agrégés à partir de 5 réponses, scores individuels privés : ce n’est pas une évaluation." },
] as const;
