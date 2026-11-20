// Strings returned by the auth API routes and the emails they send. Kept out of
// the page dictionaries so they never reach the browser bundle.
import type { Lang } from "./config";

const NB = " ";

const en = {
  api: {
    emailPasswordRequired: "Email and password required",
    tooManyLogin: "Too many attempts. Please wait 15 minutes and try again.",
    invalidCredentials: "Invalid email or password",
    confirmEmailFirst:
      "Please confirm your email address before signing in. Check your inbox for the verification link.",
    generic: "Something went wrong. Please try again.",
    passwordMax72: "Password must be 72 characters or fewer",
    tooManyRegister: "Too many attempts. Please try again in an hour.",
    passwordMin8: "Password must be at least 8 characters",
    accountExists: "An account with this email already exists",
    verificationSent: "Verification email sent. Please check your inbox.",
    createFailed: "Failed to create account",
    enterEmail: "Enter your email address.",
    tooManyForgot: "Too many requests. Please try again in an hour.",
    resetInvalid: "This reset link is invalid. Request a new one.",
    resetPasswordMin8: "Password must be at least 8 characters.",
    resetPasswordTooLong: "Password is too long (72 bytes max).",
    tooManyReset: "Too many attempts. Please wait 15 minutes.",
    resetExpired: "This reset link has expired or was already used. Request a new one.",
    emailRequired: "Email required",
    tooManyResend: "Too many emails requested. Please try again in an hour.",
    alreadyConfirmed: "Email already confirmed",
  },
  email: {
    verify: {
      subject: "Confirm your Fiscit account",
      title: "Confirm your email",
      text: "Click the button below to verify your email address and start using Fiscit.",
      button: "Confirm Email",
      footnote: "This link expires in 24 hours. If you did not create an account, you can ignore this email.",
    },
    reset: {
      subject: "Reset your Fiscit password",
      title: "Reset your password",
      text: "Someone (hopefully you) asked to reset the password for this Fiscit account. Click below to choose a new one.",
      button: "Choose a new password",
      footnote: (minutes: number) =>
        `This link works once and expires in ${minutes} minutes. If you did not ask for it, ignore this email: your password stays the same.`,
    },
  },
};

type ServerMessages = typeof en;

const fr: ServerMessages = {
  api: {
    emailPasswordRequired: "Le courriel et le mot de passe sont requis",
    tooManyLogin: "Trop de tentatives. Veuillez attendre 15 minutes, puis réessayer.",
    invalidCredentials: "Courriel ou mot de passe invalide",
    confirmEmailFirst:
      "Veuillez confirmer votre adresse courriel avant de vous connecter. Le lien de vérification se trouve dans votre boîte de réception.",
    generic: "Une erreur s'est produite. Veuillez réessayer.",
    passwordMax72: "Le mot de passe doit contenir 72 caractères ou moins",
    tooManyRegister: "Trop de tentatives. Veuillez réessayer dans une heure.",
    passwordMin8: "Le mot de passe doit contenir au moins 8 caractères",
    accountExists: "Un compte existe déjà avec cette adresse courriel",
    verificationSent: "Courriel de vérification envoyé. Consultez votre boîte de réception.",
    createFailed: "La création du compte a échoué",
    enterEmail: "Entrez votre adresse courriel.",
    tooManyForgot: "Trop de demandes. Veuillez réessayer dans une heure.",
    resetInvalid: "Ce lien de réinitialisation est invalide. Demandez-en un nouveau.",
    resetPasswordMin8: "Le mot de passe doit contenir au moins 8 caractères.",
    resetPasswordTooLong: "Le mot de passe est trop long (72 octets au maximum).",
    tooManyReset: "Trop de tentatives. Veuillez attendre 15 minutes.",
    resetExpired: "Ce lien de réinitialisation a expiré ou a déjà été utilisé. Demandez-en un nouveau.",
    emailRequired: "Courriel requis",
    tooManyResend: "Trop de courriels demandés. Veuillez réessayer dans une heure.",
    alreadyConfirmed: "Adresse courriel déjà confirmée",
  },
  email: {
    verify: {
      subject: "Confirmez votre compte Fiscit",
      title: "Confirmez votre adresse courriel",
      text: "Cliquez sur le bouton ci-dessous pour vérifier votre adresse courriel et commencer à utiliser Fiscit.",
      button: "Confirmer mon adresse",
      footnote: "Ce lien expire dans 24 heures. Si vous n'avez pas créé de compte, vous pouvez ignorer ce courriel.",
    },
    reset: {
      subject: "Réinitialisez votre mot de passe Fiscit",
      title: "Réinitialisez votre mot de passe",
      text: "Quelqu'un (vous, nous l'espérons) a demandé la réinitialisation du mot de passe de ce compte Fiscit. Cliquez ci-dessous pour en choisir un nouveau.",
      button: "Choisir un nouveau mot de passe",
      footnote: (minutes: number) =>
        `Ce lien ne fonctionne qu'une fois et expire dans ${minutes} minutes. Si vous n'avez rien demandé, ignorez ce courriel${NB}: votre mot de passe reste le même.`,
    },
  },
};

const MESSAGES: Record<Lang, ServerMessages> = { en, fr };

export function serverMessages(lang: Lang): ServerMessages {
  return MESSAGES[lang] ?? en;
}
