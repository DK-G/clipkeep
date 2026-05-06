import type { PlatformPageDict } from '../../types';

export const fr: PlatformPageDict = {
    title: "Téléchargeur Telegram",
    subtitle: "Téléchargez des vidéos et fichiers Telegram rapidement et en toute sécurité.",
    statusLabel: "État",
    helpPage: "Aide",
    howToTitle: "Comment télécharger ?",
    howToSteps: [
      "Copiez le lien : Sur Telegram, copiez le lien du post.",
      "Collez le lien : Collez l'URL dans le champ ci-dessus.",
      "Extraire : Cliquez sur 'Démarrer l'extraction'.",
      "Enregistrer : Cliquez sur le bouton de téléchargement."
    ],
    whyTitle: "Pourquoi ClipKeep ?",
    whyBody: "ClipKeep permet une extraction stable là où le téléchargement direct peut être lent.",
    whyPoints: [
      "Confidentialité : Aucun historique n'est conservé.",
      "Sans inscription : Téléchargez instantanément.",
      "Compatible : Windows, Mac, iOS, Android."
    ],
    faqTitle: "FAQ",
    faqItems: [
      { q: "Canaux privés ?", a: "Seuls les liens publics sont accessibles." },
      { q: "Limite de taille ?", a: "Les fichiers de plus de 2 Go peuvent échouer." }
    ],
    galleryTitle: "Vidéos Telegram récentes",
    trendingTitle: "Tendances Telegram de la semaine"
  };
