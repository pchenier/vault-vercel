// Terms — English (the original text).
import Link from "next/link";
import type { LegalDoc, LegalSection } from "@/components/legal-page";

const sections: LegalSection[] = [
  {
    id: "agreement",
    title: "Agreement",
    body: (
      <p>
        These terms govern your use of Fiscit at fiscit.com and app.fiscit.com (the &ldquo;Service&rdquo;). By creating an account or
        using the Service you agree to them and to our <Link href="/privacy">Privacy Policy</Link>. If you do not agree, do not use
        the Service.
      </p>
    ),
  },
  {
    id: "service",
    title: "What Fiscit does",
    body: (
      <p>
        Fiscit shows information from the accounts you connect — banks through Plaid, Wise, Questrade, public crypto wallets and
        the investment balances you enter — and computes summaries such as net worth, budgets and savings rate. Connections are
        read-only: Fiscit cannot move money or make transactions on your behalf.
      </p>
    ),
  },
  {
    id: "advice",
    title: "Not financial advice",
    body: (
      <p>
        <strong>
          Fiscit is an information tool. Nothing in the Service is financial, investment, tax, legal or accounting advice.
        </strong>{" "}
        Categories, insights and projections are automated estimates that can be wrong or out of date. Always check important
        figures with your financial institution, and consult a qualified professional before making financial decisions.
      </p>
    ),
  },
  {
    id: "account",
    title: "Your account",
    body: (
      <ul>
        <li>You must be at least 18 years old and able to enter into a contract.</li>
        <li>Give accurate information and keep your password confidential; you are responsible for activity on your account.</li>
        <li>Only connect accounts that you own or are authorized to access.</li>
        <li>Tell us right away at <a href="mailto:privacy@fiscit.com">privacy@fiscit.com</a> if you suspect unauthorized access.</li>
      </ul>
    ),
  },
  {
    id: "third-party",
    title: "Third-party services",
    body: (
      <p>
        Bank connections are provided by Plaid, and other connections by Wise, Questrade, Google and public blockchain services.
        Your use of them is also subject to their terms. We are not responsible for their availability, accuracy or outages; when
        a provider fails, Fiscit may show the last data it received.
      </p>
    ),
  },
  {
    id: "use",
    title: "Acceptable use",
    body: (
      <>
        <p>You agree not to:</p>
        <ul>
          <li>access accounts or data that are not yours, or try to break, probe or overload the Service;</li>
          <li>scrape, reverse-engineer or resell the Service, except where the law allows it;</li>
          <li>use the Service for anything illegal, including fraud or money laundering.</li>
        </ul>
        <p>
          Found a security issue? Please report it privately to <a href="mailto:privacy@fiscit.com">privacy@fiscit.com</a> — we
          appreciate responsible disclosure.
        </p>
      </>
    ),
  },
  {
    id: "pricing",
    title: "Pricing",
    body: (
      <>
        <p>
          <strong>Free trial.</strong> Every new account gets 14 days free, with no payment card required. You are never charged
          automatically when the trial ends: to keep using Fiscit, you choose a plan yourself.
        </p>
        <p>
          <strong>Plans.</strong> Fiscit costs $10 per month, or $96 per year, in Canadian dollars, plus applicable taxes. The price,
          the billing period and the total are shown before you confirm. Payments are processed by Stripe; Fiscit never receives
          your full card number.
        </p>
        <p>
          <strong>Renewal and cancellation.</strong> A plan renews automatically at the end of each period until you cancel. You can
          cancel at any time from the Billing page (fiscit.com/billing); you keep access until the end of the period already paid,
          and you are not charged again. Except where the law requires otherwise, payments already made are not refunded for the
          unused part of a period.
        </p>
        <p>
          <strong>Price changes.</strong> We will tell you by email at least 30 days before a price change applies to your plan, and
          you can cancel before it takes effect.
        </p>
        <p>
          <strong>Failed payments.</strong> If a payment fails, Stripe retries it for a short time and we ask you to update your
          card; access may be suspended if payment still fails. Your data is kept, and access comes back once a plan is paid.
        </p>
      </>
    ),
  },
  {
    id: "data",
    title: "Your data",
    body: (
      <p>
        You own your data. You give us permission to process it only to provide the Service, as described in the{" "}
        <Link href="/privacy">Privacy Policy</Link>. You can disconnect services or delete your account at any time from Settings;
        deletion is permanent.
      </p>
    ),
  },
  {
    id: "termination",
    title: "Suspension and termination",
    body: (
      <p>
        You can stop using Fiscit and delete your account at any time. We may suspend or close an account that breaches these
        terms or puts other users or the Service at risk; when reasonable, we will tell you why and give you a chance to export
        your information first.
      </p>
    ),
  },
  {
    id: "warranty",
    title: "Disclaimers and liability",
    body: (
      <>
        <p>
          The Service is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo;. To the extent permitted by law, we do not guarantee that it
          will be uninterrupted, error-free, or that data from third parties is complete or accurate, and we are not liable for
          indirect or consequential losses, or for decisions you make based on the Service.
        </p>
        <p>
          Nothing in these terms limits rights you have as a consumer that cannot be limited by contract, including under
          Québec&rsquo;s <em>Consumer Protection Act</em>, or our liability for our own intentional or gross fault.
        </p>
      </>
    ),
  },
  {
    id: "law",
    title: "Governing law",
    body: (
      <p>
        These terms are governed by the laws of Québec and the federal laws of Canada that apply there. If you are a consumer, you
        may bring a claim before the courts of your place of residence.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes",
    body: (
      <p>
        We may update these terms. For material changes we will notify you by email or in the app at least 30 days before they
        take effect; you can close your account at no cost before then if you disagree.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact",
    body: (
      <p>
        Questions about these terms: <a href="mailto:privacy@fiscit.com">privacy@fiscit.com</a>.
      </p>
    ),
  },
];

export const termsEn: LegalDoc = {
  metaTitle: "Terms of Service — Fiscit",
  metaDescription: "The rules for using Fiscit.",
  title: "Terms of",
  accent: "service.",
  updated: "November 20, 2026",
  intro: (
    <p>
      The short version: Fiscit shows you your money but never moves it, it is not financial advice, you own your data, and you
      can leave and delete everything whenever you want.
    </p>
  ),
  sections,
};
