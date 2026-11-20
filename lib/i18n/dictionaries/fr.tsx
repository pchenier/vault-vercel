import type { ReactNode } from "react";
import type { Dictionary } from "./en";

// Français (Québec). Vouvoiement partout. Montants au format « 1 234,56 $ ».
// Espaces insécables ( ) devant « $ », « % » et « : », et dans « 12 000 ».
const NB = " ";

export const fr: Dictionary = {
  meta: {
    title: "Fiscit — Vos finances, enfin claires.",
    description:
      "Toutes vos banques, cartes, soldes Wise, portefeuilles et placements dans un seul tableau de bord apaisant. Valeur nette, dépenses et taux d'épargne, mis à jour automatiquement.",
    ogTitle: "Fiscit — Vos finances, enfin claires.",
    ogDescription: "Tous vos comptes. Un seul tableau de bord.",
    ogLocale: "fr_CA",
  },

  common: {
    homeAria: "Accueil Fiscit",
    loading: "Chargement",
    langSwitch: "Langue",
    privacy: "Confidentialité",
    terms: "Conditions",
    signIn: "Se connecter",
  },

  nav: {
    how: "Fonctionnement",
    features: "Fonctions",
    pricing: "Tarifs",
    signIn: "Se connecter",
    startFree: "Essai gratuit",
  },

  hero: {
    badgeNew: "Nouveau",
    badge: "La crypto et Questrade s'ajoutent à votre valeur nette",
    line1: "Votre argent,",
    line2: "enfin clair.",
    sub: "Toutes vos banques, cartes, soldes Wise, portefeuilles crypto et comptes de placement dans un seul tableau de bord apaisant. Valeur nette, dépenses et taux d'épargne — à jour sans que vous ayez à lever le petit doigt.",
    startFree: "Commencer gratuitement",
    signIn: "Se connecter",
    reassure: "Connexions en lecture seule · Essai gratuit de 14 jours · Aucune carte requise",
    savingsRate: "Taux d'épargne",
    savingsValue: `31${NB}%`,
    subsTitle: "3 abonnements oubliés",
    subsAmount: `47,97${NB}$ / mois`,
  },

  dashboard: {
    synced: "Synchronisé à l'instant",
    netWorth: "Valeur nette · CAD",
    monthDelta: `▲ 4,2${NB}% ce mois-ci`,
    ranges: { "1M": `1${NB}M`, "6M": `6${NB}M`, "1Y": `1${NB}A` },
    accounts: [
      { name: "Compte chèques", meta: "Banque · Plaid", amount: `8${NB}412,30${NB}$`, delta: `+1${NB}240${NB}$` },
      { name: "Épargne à intérêt élevé", meta: "Banque · Plaid", amount: `42${NB}150,00${NB}$`, delta: `+600${NB}$` },
      { name: "CELI", meta: "Placements · Questrade", amount: `61${NB}880,12${NB}$`, delta: `+2,8${NB}%` },
      { name: "Wise · USD", meta: "Multidevise", amount: `3${NB}250,00${NB}$`, delta: `≈ 4${NB}485${NB}$${NB}CA` },
      { name: "Portefeuilles crypto", meta: "Solana · Bitcoin", amount: `4${NB}210,44${NB}$`, delta: `−1,9${NB}%` },
    ],
  },

  integrations: {
    aria: "Connexions prises en charge",
    title: "Compatible avec tout ce que vous utilisez déjà",
    sources: [
      `Plus de 12${NB}000 banques via Plaid`,
      "Wise",
      "Questrade",
      "Solana",
      "Bitcoin",
      "Connexion avec Google",
      "CAD · USD · EUR",
      "Cartes de crédit",
      "CELI · REER",
    ],
  },

  story: {
    eyebrow: "Fonctionnement",
    steps: [
      {
        title: "Connectez-vous en une minute.",
        body: "Reliez vos banques par Plaid, ajoutez Wise avec un jeton en lecture seule, collez l'adresse publique d'un portefeuille. Fiscit n'a jamais les clés pour déplacer votre argent.",
      },
      {
        title: "Des relevés illisibles, enfin clairs.",
        body: "Les libellés cryptiques deviennent de vrais commerçants classés dans des catégories sensées — en français comme en anglais —, et vos dépenses se lisent enfin comme une phrase.",
      },
      {
        title: "Une vue d'ensemble, enfin.",
        body: "Votre valeur nette dans toutes vos devises, vos dépenses mensuelles par catégorie et le taux d'épargne qui vous dit si vous avancez vraiment.",
      },
    ],
    nodes: {
      chequing: "Chèques",
      creditCard: "Carte de crédit",
      wise: "Wise",
      tfsa: "CELI",
      solWallet: "Portefeuille SOL",
      savings: "Épargne",
    },
    recent: "Transactions récentes",
    autoCategorized: "classées automatiquement",
    txns: [
      { name: "Tim Hortons", cat: "Alimentation", amt: `−6,45${NB}$` },
      { name: "Hydro-Québec", cat: "Services publics", amt: `−118,20${NB}$` },
      { name: "Café Olimpico", cat: "Alimentation", amt: `−4,75${NB}$` },
      { name: "Netflix", cat: "Abonnements", amt: `−20,99${NB}$` },
      { name: "Salaire", cat: "Revenus", amt: `+3${NB}240,00${NB}$` },
    ],
    bars: ["Logement", "Alimentation", "Transport", "Abonn.", "Loisirs"],
    rate: `31${NB}%`,
    saved: "épargné",
    month: "Octobre",
    kept: (amount: ReactNode): ReactNode => (
      <>
        Vous avez gardé {amount} de plus qu&apos;en septembre. L&apos;alimentation a baissé de 12&nbsp;%.
      </>
    ),
    keptAmount: `1${NB}240${NB}$`,
  },

  stats: [
    "banques et coopératives de crédit",
    "types de comptes dans une seule valeur nette",
    "accès pour déplacer votre argent",
    "tableau de bord au lieu de cinq applis",
  ],

  features: {
    eyebrow: "Fonctions",
    title: (accent: (s: string) => ReactNode): ReactNode => (
      <>
        Un logiciel serein pour des finances {accent("mouvementées")}.
      </>
    ),
    items: [
      {
        title: "Tous vos comptes, un seul bilan",
        body: "Chèques, épargne, cartes de crédit, CELI, crypto et Wise — réunis dans une seule valeur nette en temps réel, convertie dans la devise qui vous parle.",
      },
      { title: "Taux d'épargne", body: "Le chiffre qui vous dit si vous prenez de l'avance. Suivi chaque mois, avec les tendances." },
      { title: "Radar à abonnements", body: "Les frais récurrents ressortent d'eux-mêmes. Annulez ceux que vous aviez oubliés." },
      { title: "Multidevise", body: "CAD, USD, EUR et plus encore avec Wise. Fini les conversions de tête." },
      { title: "Crypto, en lecture seule", body: "Ajoutez une adresse Solana ou Bitcoin publique. Nous lisons les soldes — rien d'autre." },
      { title: "Catégories bilingues", body: "Les libellés bancaires en français et en anglais sont ramenés aux mêmes catégories claires." },
      {
        title: "Confidentiel dès la conception",
        body: "Connexions bancaires en lecture seule, stockage chiffré, et vos données ne sont jamais vendues. Supprimez votre compte, et tout part avec lui.",
      },
      { title: "Bilans en langage clair", body: "Un court résumé de votre mois : ce qui a changé, et pourquoi." },
    ],
  },

  pricing: {
    eyebrow: "Tarifs",
    title: "Un seul forfait. Tout compris.",
    monthly: "Mensuel",
    yearly: `Annuel · économisez 20${NB}%`,
    perMonth: "/ mois",
    currencyFirst: false,
    billedYearly: `Facturé 96${NB}$ par année`,
    billedMonthly: "Facturé chaque mois, annulable en tout temps",
    included: [
      "Comptes bancaires illimités",
      "Comptes Wise, crypto et de placement",
      "Catégorisation automatique (FR / EN)",
      "Suivi de la valeur nette et du taux d'épargne",
      "Détection des abonnements",
      "Bilans mensuels en langage clair",
    ],
    cta: "Commencer l'essai gratuit de 14 jours",
    noCard: "Aucune carte de crédit requise.",
  },

  cta: {
    line1: "Fini les suppositions.",
    line2: "Place à la clarté.",
    sub: "Connectez votre premier compte en moins d'une minute. Gratuit pendant 14 jours.",
    button: "Créer mon tableau de bord",
  },

  footer: {
    features: "Fonctions",
    pricing: "Tarifs",
    privacy: "Confidentialité",
    terms: "Conditions",
    signIn: "Se connecter",
  },

  auth: {
    brand1: "Votre argent,",
    brand2: "enfin clair.",
    points: [
      "Toutes vos banques, cartes, soldes Wise et portefeuilles au même endroit",
      "Connexions en lecture seule — nous ne pouvons jamais déplacer votre argent",
      "Dépenses classées automatiquement, en français ou en anglais",
    ],
    email: "Courriel",
    emailPlaceholder: "vous@exemple.com",
    password: "Mot de passe",
    confirmPassword: "Confirmer le mot de passe",
    or: "ou",
    networkError: "Erreur réseau. Veuillez réessayer.",
  },

  login: {
    title: "Fiscit — Se connecter",
    sub: "Connectez-vous pour voir où en sont vos finances.",
    heading: (em: (s: string) => ReactNode): ReactNode => <>Bon {em("retour.")}</>,
    google: "Continuer avec Google",
    urlErrors: {
      google_auth_failed: "La connexion avec Google a échoué. Veuillez réessayer.",
      google_no_email: "Aucune adresse courriel n'a été trouvée dans votre compte Google.",
      account_creation_failed: "La création du compte a échoué. Veuillez réessayer.",
    },
    unknownError: "Une erreur s'est produite. Veuillez réessayer.",
    failed: "La connexion a échoué",
    resend: "Renvoyer le courriel de vérification",
    resendSent: "Courriel de vérification envoyé! Consultez votre boîte de réception.",
    forgot: "Mot de passe oublié?",
    submitting: "Connexion…",
    submit: "Se connecter",
    noAccount: "Pas de compte?",
    createOne: "Créer un compte",
  },

  register: {
    title: "Fiscit — Créer votre compte",
    sentTitle: "Fiscit — Consultez vos courriels",
    sentSub: (email: ReactNode): ReactNode => (
      <>
        Nous avons envoyé un lien de confirmation à {email}. Cliquez dessus pour vérifier votre compte et commencer.
      </>
    ),
    sentHeading: (em: (s: string) => ReactNode): ReactNode => <>Consultez votre {em("boîte de réception.")}</>,
    didntGet: "Vous ne l'avez pas reçu?",
    tryAgain: "Réessayer",
    sub: "Gratuit pendant 14 jours. Aucune carte de crédit requise.",
    heading: (em: (s: string) => ReactNode): ReactNode => <>Place à la {em("clarté.")}</>,
    google: "S'inscrire avec Google",
    mismatch: "Les mots de passe ne correspondent pas",
    tooShort: "Le mot de passe doit contenir au moins 8 caractères",
    failed: "L'inscription a échoué",
    passwordPlaceholder: "8 caractères minimum",
    newsletter: "Recevoir les nouveautés et des conseils",
    submitting: "Création du compte…",
    submit: "Créer un compte",
    legal: (terms: (s: string) => ReactNode, privacy: (s: string) => ReactNode): ReactNode => (
      <>
        En créant un compte, vous acceptez les {terms("Conditions d'utilisation")} et la{" "}
        {privacy("Politique de confidentialité")}.
      </>
    ),
    haveAccount: "Vous avez déjà un compte?",
    signIn: "Se connecter",
  },

  verify: {
    title: "Fiscit — Vérification du courriel",
    verifying: "Vérification de votre adresse courriel…",
    invalidLink: "Lien de vérification invalide.",
    verified: "Adresse courriel vérifiée! Redirection…",
    failed: "La vérification a échoué. Le lien est peut-être expiré.",
    loadingHeading: "Vérification…",
    successHeading: (em: (s: string) => ReactNode): ReactNode => <>C&apos;est {em("fait.")}</>,
    errorHeading: "Ce lien n'a pas fonctionné",
    back: "Retour à la connexion",
  },

  forgot: {
    title: "Fiscit — Réinitialiser votre mot de passe",
    sentSub: (email: ReactNode): ReactNode => (
      <>
        Si un compte existe pour {email}, un lien de réinitialisation est en route. Il expire dans 30 minutes.
      </>
    ),
    sentHeading: (em: (s: string) => ReactNode): ReactNode => <>Consultez votre {em("boîte de réception.")}</>,
    spam: "Rien après quelques minutes? Vérifiez vos courriels indésirables, ou réessayez.",
    another: "Utiliser une autre adresse",
    sub: "Entrez l'adresse courriel utilisée à l'inscription et nous vous enverrons un lien pour choisir un nouveau mot de passe.",
    heading: (em: (s: string) => ReactNode): ReactNode => <>Mot de passe {em("oublié?")}</>,
    generic: "Une erreur s'est produite. Veuillez réessayer.",
    submitting: "Envoi…",
    submit: "Envoyer le lien",
    remembered: "Ça vous revient?",
    signIn: "Se connecter",
  },

  reset: {
    doneTitle: "Fiscit — Mot de passe modifié",
    doneSub: "Votre nouveau mot de passe est enregistré, et tous vos autres appareils ont été déconnectés.",
    doneHeading: (em: (s: string) => ReactNode): ReactNode => <>C&apos;est {em("réglé.")}</>,
    continue: "Continuer vers Fiscit",
    title: "Fiscit — Choisir un nouveau mot de passe",
    sub: "Au moins 8 caractères. Le nouveau mot de passe fonctionnera partout; les anciennes sessions sont fermées.",
    heading: (em: (s: string) => ReactNode): ReactNode => <>Choisissez un nouveau {em("mot de passe.")}</>,
    mismatch: "Les deux mots de passe ne correspondent pas.",
    generic: "Une erreur s'est produite. Veuillez réessayer.",
    missingToken: (link: (s: string) => ReactNode): ReactNode => (
      <>
        Il manque le code dans ce lien. Ouvrez de nouveau le lien reçu par courriel, ou {link("demandez-en un nouveau")}.
      </>
    ),
    newPassword: "Nouveau mot de passe",
    confirmPassword: "Confirmer le mot de passe",
    submitting: "Enregistrement…",
    submit: "Enregistrer le mot de passe",
    expired: "Lien expiré?",
    sendNew: "En recevoir un nouveau",
  },

  onboarding: {
    title: "Fiscit — Configuration",
    steps: { name: "Nom", bank: "Banque", crypto: "Crypto", invest: "Placements" },
    stepOf: (n: number, total: number) => `Étape ${n} sur ${total}`,
    saving: "Enregistrement…",
    continue: "Continuer",
    nameSub: "Choisissez un nom pour votre compte.",
    nameHeading: (em: (s: string) => ReactNode): ReactNode => <>Comment devons-nous {em("vous appeler?")}</>,
    namePlaceholder: "Votre nom",
    nameError: "Impossible d'enregistrer le nom. Veuillez réessayer.",
    skipForNow: "Passer pour l'instant",
    bankSub: "Reliez vos comptes pour voir vos soldes et vos transactions au même endroit. En lecture seule — Fiscit ne peut jamais déplacer d'argent.",
    bankHeading: (em: (s: string) => ReactNode): ReactNode => <>Connectez votre {em("banque.")}</>,
    connecting: "Connexion…",
    connectPlaid: "Connecter avec Plaid",
    skipAddLater: "Passer, ajouter plus tard",
    bankTokenError: "Impossible de se connecter à la banque. Vous pouvez passer cette étape et l'ajouter plus tard.",
    bankSaveFailed: "Banque connectée, mais l'enregistrement du jeton a échoué. Vous pouvez continuer.",
    bankSaveError: "Banque connectée, mais l'enregistrement a échoué. Vous pouvez continuer.",
    plaidLoadError: "Impossible de charger la connexion bancaire. Passez cette étape et ajoutez-la plus tard.",
    cryptoSub: "Sélectionnez les cryptomonnaies que vous détenez et entrez les quantités. Vous pourrez toujours en ajouter plus tard.",
    cryptoHeading: (em: (s: string) => ReactNode): ReactNode => <>Suivez votre {em("crypto.")}</>,
    cryptoError: "Impossible d'enregistrer la crypto. Passez cette étape et ajoutez-la plus tard.",
    skipCrypto: "Passer la crypto",
    investSub: "CELI, REER, compte de courtage… Choisissez la plateforme et entrez le solde d'aujourd'hui — vous pourrez le mettre à jour en tout temps à partir de votre tableau de bord.",
    investHeading: (em: (s: string) => ReactNode): ReactNode => <>Ajoutez vos comptes de {em("placement.")}</>,
    platform: "Plateforme",
    choosePlatform: "Choisissez une plateforme…",
    platforms: {
      "National Bank Direct Brokerage": "Banque Nationale Courtage direct",
      "TD Direct Investing": "Placements directs TD",
      "RBC Direct Investing": "RBC Placements en Direct",
      "BMO InvestorLine": "BMO Ligne d'action",
      Other: "Autre",
    },
    accountType: "Type de compte",
    accountTypes: {
      TFSA: "CELI",
      RRSP: "REER",
      FHSA: "CELIAPP",
      RESP: "REEE",
      "Non-registered": "Non enregistré",
    },
    removeAccount: "Retirer le compte",
    currentBalance: "Solde actuel",
    addAccount: "Ajouter un autre compte",
    investError: "Impossible d'enregistrer vos comptes de placement. Réessayez, ou passez cette étape et ajoutez-les plus tard.",
    generic: "Une erreur s'est produite. Veuillez réessayer.",
    settingUp: "Configuration…",
    goDashboard: "Accéder à mon tableau de bord",
    plaid: {
      yourBank: "votre banque",
      INVALID_CREDENTIALS: (b: string) =>
        `Le nom d'utilisateur ou le mot de passe de ${b} n'a pas été accepté. Vérifiez-les sur le site de ${b}, puis réessayez.`,
      INVALID_MFA: (b: string) => `Le code de sécurité de ${b} n'a pas été accepté. Réessayez avec un nouveau code.`,
      INSTITUTION_DOWN: (b: string) =>
        `${cap(b)} ne répond pas pour le moment. Réessayez dans un moment, ou passez cette étape et ajoutez-la plus tard.`,
      INSTITUTION_NOT_RESPONDING: (b: string) =>
        `${cap(b)} ne répond pas pour le moment. Réessayez dans un moment, ou passez cette étape et ajoutez-la plus tard.`,
      INSTITUTION_NOT_AVAILABLE: (b: string) =>
        `${cap(b)} n'est pas disponible pour le moment. Réessayez plus tard, ou passez cette étape et ajoutez-la plus tard.`,
      INSTITUTION_NOT_SUPPORTED: (b: string) => `${cap(b)} ne peut pas encore être connectée. Nous en avons été avisés.`,
      UNAUTHORIZED_INSTITUTION: (b: string) => `${cap(b)} n'est pas encore offerte dans Fiscit. Nous en avons été avisés.`,
      INSTITUTION_REGISTRATION_REQUIRED: (b: string) => `${cap(b)} n'est pas encore offerte dans Fiscit. Nous en avons été avisés.`,
      ITEM_LOCKED: (b: string) =>
        `${cap(b)} a verrouillé le compte après trop de tentatives. Déverrouillez-le sur le site de ${b}, puis réessayez.`,
      USER_SETUP_REQUIRED: (b: string) => `${cap(b)} vous demande d'abord de terminer une étape sur son site ou dans son application.`,
      display: (b: string, msg: string) => `${cap(b)}${NB}: ${msg}`,
      fallback: (b: string, code: string) =>
        `Impossible de connecter ${b}${code ? ` (${code})` : ""}. Vous pouvez réessayer, ou passer cette étape et l'ajouter plus tard.`,
    },
  },

  errors: {
    notFoundMeta: "Page introuvable — Fiscit",
    notFoundTitle: "Cette page n'existe pas.",
    notFoundMessage: "Le lien est peut-être brisé, ou la page a été déplacée. Votre argent, lui, est toujours là où vous l'avez laissé.",
    errorTitle: "Une erreur s'est produite.",
    errorMessage:
      "Nous avons rencontré une erreur inattendue, et elle a été consignée. Réessayez; si le problème persiste, communiquez avec le soutien.",
    globalTitle: "Fiscit a frappé un os.",
    globalMessage: "Un problème est survenu pendant le chargement de la page. Il a été consigné; réessayez dans un instant.",
    tryAgain: "Réessayer",
    home: "Retour à l'accueil",
    support: "Joindre le soutien",
    reference: `Référence${NB}:`,
  },

  legal: {
    eyebrow: "Juridique",
    updated: (date: string) => `Dernière mise à jour${NB}: ${date}`,
    toc: "Sur cette page",
    privacy: "Confidentialité",
    terms: "Conditions",
    signIn: "Se connecter",
  },
};

// "votre banque" → "Votre banque" at the start of a sentence; bank names are left as is
function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
