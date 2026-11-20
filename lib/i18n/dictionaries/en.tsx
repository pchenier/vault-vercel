import type { ReactNode } from "react";

// English: the source of truth for the dictionary's shape (fr.tsx must match it).
// Values are strings, or small functions when a sentence wraps a value or markup.
export const en = {
  meta: {
    title: "Fiscit — Your finances. Finally clear.",
    description:
      "Every bank, card, Wise balance, wallet and investment in one calm dashboard. Net worth, spending and savings rate, updated automatically.",
    ogTitle: "Fiscit — Your finances. Finally clear.",
    ogDescription: "Every account. One dashboard.",
    ogLocale: "en_CA",
  },

  common: {
    homeAria: "Fiscit home",
    loading: "Loading",
    langSwitch: "Language",
    privacy: "Privacy",
    terms: "Terms",
    signIn: "Sign in",
  },

  nav: {
    how: "How it works",
    features: "Features",
    pricing: "Pricing",
    signIn: "Sign in",
    startFree: "Start free",
  },

  hero: {
    badgeNew: "New",
    badge: "Crypto + Questrade now in your net worth",
    line1: "Your money,",
    line2: "finally clear.",
    sub: "Every bank, card, Wise balance, crypto wallet and investment account in one calm dashboard. Net worth, spending and savings rate — updated on their own.",
    startFree: "Start free",
    signIn: "Sign in",
    reassure: "Read-only connections · 14-day free trial · No card required",
    savingsRate: "Savings rate",
    savingsValue: "31%",
    subsTitle: "3 forgotten subscriptions",
    subsAmount: "$47.97 / month",
  },

  dashboard: {
    synced: "Synced just now",
    netWorth: "Net worth · CAD",
    monthDelta: "▲ 4.2% this month",
    ranges: { "1M": "1M", "6M": "6M", "1Y": "1Y" } as Record<string, string>,
    accounts: [
      { name: "Chequing", meta: "Bank · Plaid", amount: "$8,412.30", delta: "+$1,240" },
      { name: "High-interest savings", meta: "Bank · Plaid", amount: "$42,150.00", delta: "+$600" },
      { name: "TFSA", meta: "Investments · Questrade", amount: "$61,880.12", delta: "+2.8%" },
      { name: "Wise · USD", meta: "Multi-currency", amount: "$3,250.00", delta: "≈ C$4,485" },
      { name: "Crypto wallets", meta: "Solana · Bitcoin", amount: "$4,210.44", delta: "−1.9%" },
    ],
  },

  integrations: {
    aria: "Supported connections",
    title: "Connects to everything you already use",
    sources: [
      "12,000+ banks via Plaid",
      "Wise",
      "Questrade",
      "Solana",
      "Bitcoin",
      "Google sign-in",
      "CAD · USD · EUR",
      "Credit cards",
      "TFSA · RRSP",
    ],
  },

  story: {
    eyebrow: "How it works",
    steps: [
      {
        title: "Connect in a minute.",
        body: "Link your banks through Plaid, add Wise with a read-only token, paste a public wallet address. Fiscit never gets the keys to move money.",
      },
      {
        title: "Messy statements, cleaned up.",
        body: "Cryptic descriptors become real merchants and sensible categories — in English or French — so your spending finally reads like a sentence.",
      },
      {
        title: "See the whole picture.",
        body: "Net worth across every currency, monthly spend by category, and the savings rate that tells you if you're actually getting ahead.",
      },
    ],
    nodes: {
      chequing: "Chequing",
      creditCard: "Credit card",
      wise: "Wise",
      tfsa: "TFSA",
      solWallet: "SOL wallet",
      savings: "Savings",
    },
    recent: "Recent transactions",
    autoCategorized: "auto-categorized",
    txns: [
      { name: "Tim Hortons", cat: "Food", amt: "−$6.45" },
      { name: "Hydro-Québec", cat: "Utilities", amt: "−$118.20" },
      { name: "Café Olimpico", cat: "Food", amt: "−$4.75" },
      { name: "Netflix", cat: "Subscriptions", amt: "−$20.99" },
      { name: "Salary", cat: "Income", amt: "+$3,240.00" },
    ],
    bars: ["Housing", "Food", "Transport", "Subs", "Fun"],
    rate: "31%",
    saved: "saved",
    month: "October",
    kept: (amount: ReactNode): ReactNode => (
      <>
        You kept {amount} more than September. Food is down 12%.
      </>
    ),
    keptAmount: "$1,240",
  },

  stats: [
    "banks and credit unions",
    "kinds of accounts in one net worth",
    "access to move your money",
    "dashboard instead of five apps",
  ],

  features: {
    eyebrow: "Features",
    title: (accent: (s: string) => ReactNode): ReactNode => (
      <>
        Calm software for {accent("loud")} finances.
      </>
    ),
    items: [
      {
        title: "Every account, one balance sheet",
        body: "Chequing, savings, credit cards, TFSA, crypto and Wise — rolled into a single live net worth, converted to the currency you think in.",
      },
      { title: "Savings rate", body: "The one number that says if you're getting ahead. Tracked monthly, with trends." },
      { title: "Subscription radar", body: "Recurring charges surface on their own. Cancel what you forgot about." },
      { title: "Multi-currency", body: "CAD, USD, EUR and more via Wise. No more mental conversions." },
      { title: "Crypto, read-only", body: "Add a public Solana or Bitcoin address. We read balances — nothing else." },
      { title: "Bilingual categories", body: "French and English bank descriptors normalized into the same clean categories." },
      {
        title: "Private by design",
        body: "Read-only bank connections, encrypted storage, and your data is never sold. Delete your account and everything goes with it.",
      },
      { title: "Plain-language recaps", body: "A short summary of your month: what changed, and why." },
    ],
  },

  pricing: {
    eyebrow: "Pricing",
    title: "One plan. Everything in it.",
    monthly: "Monthly",
    yearly: "Yearly · save 20%",
    perMonth: "/ month",
    currencyFirst: true,
    billedYearly: "Billed $96 yearly",
    billedMonthly: "Billed monthly, cancel anytime",
    included: [
      "Unlimited bank accounts",
      "Wise, crypto and investment accounts",
      "Automatic categorization (EN / FR)",
      "Net worth and savings-rate tracking",
      "Subscription detection",
      "Monthly plain-language recaps",
    ],
    cta: "Start 14-day free trial",
    noCard: "No credit card required.",
  },

  cta: {
    line1: "Stop guessing.",
    line2: "Start knowing.",
    sub: "Connect your first account in under a minute. Free for 14 days.",
    button: "Create your dashboard",
  },

  footer: {
    features: "Features",
    pricing: "Pricing",
    privacy: "Privacy",
    terms: "Terms",
    signIn: "Sign in",
  },

  auth: {
    brand1: "Your money,",
    brand2: "finally clear.",
    points: [
      "Every bank, card, Wise balance and wallet in one place",
      "Read-only connections — we can never move your money",
      "Spending sorted automatically, in English or French",
    ],
    email: "Email",
    emailPlaceholder: "you@example.com",
    password: "Password",
    confirmPassword: "Confirm password",
    or: "or",
    networkError: "Network error. Please try again.",
  },

  login: {
    title: "Fiscit — Sign in",
    sub: "Sign in to see where your money stands.",
    heading: (em: (s: string) => ReactNode): ReactNode => <>Welcome {em("back.")}</>,
    google: "Continue with Google",
    urlErrors: {
      google_auth_failed: "Google sign in failed. Please try again.",
      google_no_email: "No email found in your Google account.",
      account_creation_failed: "Failed to create account. Please try again.",
    } as Record<string, string>,
    unknownError: "An error occurred. Please try again.",
    failed: "Login failed",
    resend: "Resend verification email",
    resendSent: "Verification email sent! Check your inbox.",
    forgot: "Forgot password?",
    submitting: "Signing in…",
    submit: "Sign in",
    noAccount: "No account?",
    createOne: "Create one",
  },

  register: {
    title: "Fiscit — Create your account",
    sentTitle: "Fiscit — Check your email",
    sentSub: (email: ReactNode): ReactNode => (
      <>
        We sent a confirmation link to {email}. Click it to verify your account and get started.
      </>
    ),
    sentHeading: (em: (s: string) => ReactNode): ReactNode => <>Check your {em("inbox.")}</>,
    didntGet: "Didn't get it?",
    tryAgain: "Try again",
    sub: "Free for 14 days. No credit card required.",
    heading: (em: (s: string) => ReactNode): ReactNode => <>Start {em("knowing.")}</>,
    google: "Sign up with Google",
    mismatch: "Passwords do not match",
    tooShort: "Password must be at least 8 characters",
    failed: "Registration failed",
    passwordPlaceholder: "Min 8 characters",
    newsletter: "Get product updates and tips",
    submitting: "Creating account…",
    submit: "Create account",
    legal: (terms: (s: string) => ReactNode, privacy: (s: string) => ReactNode): ReactNode => (
      <>
        By creating an account you agree to the {terms("Terms of Service")} and{" "}
        {privacy("Privacy Policy")}.
      </>
    ),
    haveAccount: "Already have an account?",
    signIn: "Sign in",
  },

  verify: {
    title: "Fiscit — Verify email",
    verifying: "Verifying your email...",
    invalidLink: "Invalid verification link.",
    verified: "Email verified! Redirecting...",
    failed: "Verification failed. The link may have expired.",
    loadingHeading: "Verifying…",
    successHeading: (em: (s: string) => ReactNode): ReactNode => <>You&apos;re {em("in.")}</>,
    errorHeading: "That link didn't work",
    back: "Back to sign in",
  },

  forgot: {
    title: "Fiscit — Reset your password",
    sentSub: (email: ReactNode): ReactNode => (
      <>
        If an account exists for {email}, a reset link is on its way. It expires in 30 minutes.
      </>
    ),
    sentHeading: (em: (s: string) => ReactNode): ReactNode => <>Check your {em("inbox.")}</>,
    spam: "Nothing after a few minutes? Check your spam folder, or try again.",
    another: "Use another email",
    sub: "Enter the email you signed up with and we'll send you a link to choose a new password.",
    heading: (em: (s: string) => ReactNode): ReactNode => <>Forgot your {em("password?")}</>,
    generic: "Something went wrong. Please try again.",
    submitting: "Sending…",
    submit: "Send reset link",
    remembered: "Remembered it?",
    signIn: "Sign in",
  },

  reset: {
    doneTitle: "Fiscit — Password updated",
    doneSub: "Your new password is set, and every other device has been signed out.",
    doneHeading: (em: (s: string) => ReactNode): ReactNode => <>All {em("set.")}</>,
    continue: "Continue to Fiscit",
    title: "Fiscit — Choose a new password",
    sub: "At least 8 characters. Signing in with the new password will work everywhere; old sessions are signed out.",
    heading: (em: (s: string) => ReactNode): ReactNode => <>Choose a new {em("password.")}</>,
    mismatch: "The two passwords don't match.",
    generic: "Something went wrong. Please try again.",
    missingToken: (link: (s: string) => ReactNode): ReactNode => (
      <>
        This link is missing its code. Open the link from your email again, or {link("request a new one")}.
      </>
    ),
    newPassword: "New password",
    confirmPassword: "Confirm password",
    submitting: "Saving…",
    submit: "Save new password",
    expired: "Link expired?",
    sendNew: "Send a new one",
  },

  onboarding: {
    title: "Fiscit — Setup",
    steps: { name: "Name", bank: "Bank", crypto: "Crypto", invest: "Investments" },
    stepOf: (n: number, total: number) => `Step ${n} of ${total}`,
    saving: "Saving…",
    continue: "Continue",
    nameSub: "Pick a name for your account.",
    nameHeading: (em: (s: string) => ReactNode): ReactNode => <>What should we {em("call you?")}</>,
    namePlaceholder: "Your name",
    nameError: "Failed to save name. Please try again.",
    skipForNow: "Skip for now",
    bankSub: "Link your accounts to see balances and transactions in one place. Read-only — Fiscit can never move money.",
    bankHeading: (em: (s: string) => ReactNode): ReactNode => <>Connect your {em("bank.")}</>,
    connecting: "Connecting…",
    connectPlaid: "Connect with Plaid",
    skipAddLater: "Skip, add later",
    bankTokenError: "Could not connect to bank. You can skip and add later.",
    bankSaveFailed: "Bank connected but token save failed. You can continue.",
    bankSaveError: "Bank connected but could not save. You can continue.",
    plaidLoadError: "Could not load bank connection. Skip and add later.",
    cryptoSub: "Select the coins you hold and enter amounts. You can always add more later.",
    cryptoHeading: (em: (s: string) => ReactNode): ReactNode => <>Track your {em("crypto.")}</>,
    cryptoError: "Could not save crypto. Skip and add later.",
    skipCrypto: "Skip crypto",
    investSub: "TFSA, RRSP, brokerage… Pick the platform and enter today's balance — you can update it anytime from your dashboard.",
    investHeading: (em: (s: string) => ReactNode): ReactNode => <>Add investment {em("accounts.")}</>,
    platform: "Platform",
    choosePlatform: "Choose a platform…",
    platforms: {} as Record<string, string>,
    accountType: "Account type",
    accountTypes: {} as Record<string, string>,
    removeAccount: "Remove account",
    currentBalance: "Current balance",
    addAccount: "Add another account",
    investError: "Could not save your investment accounts. Try again, or skip and add them later.",
    generic: "Something went wrong. Please try again.",
    settingUp: "Setting up…",
    goDashboard: "Go to my dashboard",
    plaid: {
      yourBank: "your bank",
      INVALID_CREDENTIALS: (b: string) => `The username or password for ${b} was not accepted. Check them on ${b}'s own site, then try again.`,
      INVALID_MFA: (b: string) => `The security code for ${b} was not accepted. Try again with a new code.`,
      INSTITUTION_DOWN: (b: string) => `${b} isn't responding right now. Try again in a little while, or skip and add it later.`,
      INSTITUTION_NOT_RESPONDING: (b: string) => `${b} isn't responding right now. Try again in a little while, or skip and add it later.`,
      INSTITUTION_NOT_AVAILABLE: (b: string) => `${b} isn't available right now. Try again later, or skip and add it later.`,
      INSTITUTION_NOT_SUPPORTED: (b: string) => `${b} can't be connected yet. We've been notified.`,
      UNAUTHORIZED_INSTITUTION: (b: string) => `${b} isn't enabled on Fiscit yet. We've been notified.`,
      INSTITUTION_REGISTRATION_REQUIRED: (b: string) => `${b} isn't enabled on Fiscit yet. We've been notified.`,
      ITEM_LOCKED: (b: string) => `${b} locked the account after too many attempts. Unlock it on ${b}'s site, then try again.`,
      USER_SETUP_REQUIRED: (b: string) => `${b} needs you to finish a step on its own site or app first.`,
      display: (b: string, msg: string) => `${b}: ${msg}`,
      fallback: (b: string, code: string) =>
        `Could not connect ${b}${code ? ` (${code})` : ""}. You can try again or skip and add it later.`,
    },
  },

  errors: {
    notFoundMeta: "Page not found — Fiscit",
    notFoundTitle: "This page doesn't exist.",
    notFoundMessage: "The link may be broken, or the page has moved. Your money is still right where you left it.",
    errorTitle: "Something went wrong.",
    errorMessage: "We hit an unexpected error and it has been logged. Try again; if it keeps happening, contact support.",
    globalTitle: "Fiscit hit a snag.",
    globalMessage: "Something broke while loading the page. It has been logged; try again in a moment.",
    tryAgain: "Try again",
    home: "Back to home",
    support: "Contact support",
    reference: "Reference:",
  },

  billing: {
    title: "Fiscit — Your plan",
    heading: (em: (s: string) => ReactNode): ReactNode => <>Your {em("plan.")}</>,
    trialSub: (days: number, date: string) =>
      `Your free trial has ${days} day${days === 1 ? "" : "s"} left (until ${date}). Pick a plan whenever you're ready.`,
    trialOpenSub: "You're on the free trial. Pick a plan whenever you're ready.",
    expiredSub: "Your free trial has ended. Pick a plan to keep your dashboard, budgets and history. Your data is kept.",
    subscribedSub: (plan: string, date: string) => `You're on the ${plan} plan. It renews on ${date}.`,
    cancelingSub: (plan: string, date: string) => `Your ${plan} plan is cancelled and stays active until ${date}.`,
    pastDueSub: "Your last payment didn't go through. Update your card to keep access.",
    compedSub: "Your account has free access. Nothing to pay.",
    monthlyName: "monthly",
    yearlyName: "yearly",
    monthly: "Monthly",
    yearly: "Yearly",
    perMonth: "/ month",
    perYear: "/ year",
    monthlyNote: "Billed monthly",
    yearlyNote: (perMonth: string) => `${perMonth} per month, billed yearly`,
    save: "Save 20%",
    choose: "Choose",
    redirecting: "Opening secure checkout…",
    manage: "Manage subscription",
    manageNote: "Change plan or card, cancel, or download invoices on Stripe's secure page.",
    fineprint: "Prices in Canadian dollars. Payments are processed by Stripe; Fiscit never sees your card. Cancel anytime: you keep access until the end of the period you paid for.",
    successHeading: (em: (s: string) => ReactNode): ReactNode => <>You&rsquo;re {em("in.")}</>,
    successSub: "Thank you! Your subscription is active. It can take a few seconds to show here.",
    toDashboard: "Go to my dashboard",
    notConfigured: "Paid plans aren't open yet. Enjoy Fiscit for free in the meantime.",
    alreadySubscribed: "You already have a subscription. Use Manage subscription to change it.",
    error: "Something went wrong. Please try again.",
    price: (amount: number) => `$${amount}`,
  },

  legal: {
    eyebrow: "Legal",
    updated: (date: string) => `Last updated ${date}`,
    toc: "On this page",
    privacy: "Privacy",
    terms: "Terms",
    signIn: "Sign in",
  },
};

export type Dictionary = typeof en;
