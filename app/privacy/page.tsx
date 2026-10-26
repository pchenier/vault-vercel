import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy — Fiscit",
  description: "What Fiscit collects, why, who it is shared with, and the rights you have over your data.",
};

const UPDATED = "October 25, 2026";

const sections: LegalSection[] = [
  {
    id: "who",
    title: "Who we are",
    body: (
      <>
        <p>
          Fiscit (&ldquo;Fiscit&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) is a personal finance dashboard operated from Montréal, Québec,
          Canada, at fiscit.com and app.fiscit.com. This policy explains how we handle personal information under
          Québec&rsquo;s <em>Act respecting the protection of personal information in the private sector</em> (as amended by Law 25)
          and Canada&rsquo;s <em>Personal Information Protection and Electronic Documents Act</em> (PIPEDA).
        </p>
        <p>
          <strong>Person in charge of the protection of personal information:</strong> Privacy Officer, Fiscit —{" "}
          <a href="mailto:privacy@fiscit.com">privacy@fiscit.com</a>. Contact this person for any question, request or complaint
          about your information.
        </p>
      </>
    ),
  },
  {
    id: "collect",
    title: "What we collect",
    body: (
      <>
        <ul>
          <li><strong>Account:</strong> email address, display name, password (stored only as a bcrypt hash — we never see it), and your Google account ID if you sign in with Google.</li>
          <li><strong>Bank data, through Plaid:</strong> account names and types, balances, and transactions (date, amount, merchant/description, category). We receive an access token from Plaid; <strong>we never receive or store your bank username or password.</strong></li>
          <li><strong>Other connections you choose to add:</strong> your Wise API token and profile ID; public crypto wallet addresses and the coin amounts you enter; investment account platform, type and balance you enter.</li>
          <li><strong>Brokerage connections (optional, read-only):</strong> if you connect a broker, we receive your investment accounts, balances and holdings (symbols, quantities, prices). Depending on the method, we store a read-only token or key you generate (Questrade, Interactive Brokers Flex, Kraken &ldquo;Query Funds&rdquo;) or a per-user secret from SnapTrade. <strong>We never receive your brokerage password</strong> and these connections cannot place trades or move money.</li>
          <li><strong>Google Calendar (optional):</strong> if you connect it, read-only access to your calendar events so they can appear in Fiscit&rsquo;s calendar.</li>
          <li><strong>Information you create in the app:</strong> categories, rules, budgets, and optional trackers (gym, meals, habits, calendar events). Most of these are stored only in your browser.</li>
          <li><strong>Technical data:</strong> session cookies, and standard server logs kept by our hosting providers (IP address, browser type, request time) for security and debugging.</li>
        </ul>
        <p>We do not collect your social insurance number, and we do not use analytics, advertising or tracking cookies.</p>
      </>
    ),
  },
  {
    id: "use",
    title: "Why we use it",
    body: (
      <>
        <p>We use your information only to:</p>
        <ul>
          <li>create and secure your account, and verify your email address;</li>
          <li>show your balances, transactions, net worth, budgets, savings rate and other features of the dashboard;</li>
          <li>categorize transactions and compute summaries for you;</li>
          <li>send you service emails (verification, security notices) and, only if you opted in at sign-up, product updates you can unsubscribe from at any time;</li>
          <li>keep the service secure, prevent abuse, and fix problems;</li>
          <li>comply with the law.</li>
        </ul>
        <p>
          <strong>We never sell your personal information, never rent it, and never use your financial data for advertising.</strong> We do not
          use your data to train third-party AI models.
        </p>
      </>
    ),
  },
  {
    id: "share",
    title: "Who we share it with",
    body: (
      <>
        <p>We share information only with service providers that help us run Fiscit, under contracts or terms that limit their use of it:</p>
        <ul>
          <li><strong>Plaid</strong> — connects your bank accounts. Plaid&rsquo;s handling of your data is described in the <a href="https://plaid.com/legal/#end-user-privacy-policy" target="_blank" rel="noreferrer">Plaid End User Privacy Policy</a>.</li>
          <li><strong>Vercel</strong> (fiscit.com) and <strong>Railway</strong> (app.fiscit.com and our database) — hosting and storage.</li>
          <li><strong>Google</strong> — sign-in and, if you connect it, Google Calendar.</li>
          <li><strong>Resend</strong> — sends our emails (receives your email address).</li>
          <li><strong>Wise</strong> — only if you connect it, to read your balances.</li>
          <li><strong>SnapTrade</strong> — only if you connect a brokerage through it (e.g. Wealthsimple); you sign in to your broker on SnapTrade&rsquo;s page and it shares read-only account data with us.</li>
          <li><strong>Questrade</strong>, <strong>Interactive Brokers</strong> and <strong>Kraken</strong> — only if you connect them directly, to read balances and holdings.</li>
          <li><strong>Public blockchain services</strong> (Solana RPC, blockchain.info, Etherscan) — receive the public wallet addresses you add, to read balances. <strong>CoinGecko</strong> provides coin prices and receives no personal information.</li>
        </ul>
        <p>We may also disclose information if required by law, or to protect the rights and safety of our users, as permitted by law.</p>
      </>
    ),
  },
  {
    id: "outside",
    title: "Storage outside Québec",
    body: (
      <p>
        Our hosting providers store and process data on servers located mainly in the United States, so your information may be
        communicated outside Québec and Canada. We use providers that apply industry-standard safeguards, including encryption in
        transit and access controls. Information stored outside Canada
        may be accessible to authorities of that country under its laws.
      </p>
    ),
  },
  {
    id: "security",
    title: "How we protect it",
    body: (
      <>
        <ul>
          <li>All traffic is encrypted with HTTPS/TLS.</li>
          <li>Passwords are hashed with bcrypt; sessions use signed, HTTP-only cookies.</li>
          <li>Access tokens and API keys for your banks and brokers are encrypted in our database.</li>
          <li>Bank connections are <strong>read-only</strong>: Fiscit cannot move money, make payments or change anything at your bank.</li>
          <li>Access to production systems is restricted to the people who operate Fiscit.</li>
        </ul>
        <p>
          No system is perfectly secure. If a confidentiality incident presents a risk of serious injury, we will notify you and the
          Commission d&rsquo;accès à l&rsquo;information du Québec as required by law, and keep a register of incidents.
        </p>
      </>
    ),
  },
  {
    id: "retention",
    title: "How long we keep it",
    body: (
      <>
        <p>
          We keep your information while your account is open. When you delete your account (Settings → Delete account), we
          immediately revoke Fiscit&rsquo;s access at Plaid and SnapTrade and permanently delete your account, connections, tokens,
          balances and investment entries from our database. You can also disconnect a single brokerage at any time from the
          Investments page. Information stored only in your browser is cleared from that browser at the same time.
        </p>
        <p>Server logs kept by our hosting providers are deleted on their own schedules, typically within 30 days.</p>
      </>
    ),
  },
  {
    id: "rights",
    title: "Your rights",
    body: (
      <>
        <p>You can, at any time:</p>
        <ul>
          <li><strong>access</strong> the personal information we hold about you and ask how it is used;</li>
          <li><strong>correct</strong> information that is inaccurate or incomplete;</li>
          <li><strong>withdraw your consent</strong> — disconnect a service, or delete your account entirely from Settings;</li>
          <li>ask for your information in a structured, commonly used technological format (<strong>portability</strong>);</li>
          <li>ask us to stop disseminating your information or to de-index it, where the law allows.</li>
        </ul>
        <p>
          Email <a href="mailto:privacy@fiscit.com">privacy@fiscit.com</a>. We answer within 30 days. If you are not satisfied, you can
          complain to the <a href="https://www.cai.gouv.qc.ca" target="_blank" rel="noreferrer">Commission d&rsquo;accès à l&rsquo;information du Québec</a> or
          the <a href="https://www.priv.gc.ca" target="_blank" rel="noreferrer">Office of the Privacy Commissioner of Canada</a>.
        </p>
      </>
    ),
  },
  {
    id: "google",
    title: "Google user data",
    body: (
      <p>
        Fiscit&rsquo;s use and transfer of information received from Google APIs adheres to the{" "}
        <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noreferrer">Google API Services User Data Policy</a>,
        including the Limited Use requirements. Calendar data is used only to show your events inside Fiscit, is never sold, never
        used for advertising, and is not read by people except with your consent, for security purposes, or to comply with the law.
      </p>
    ),
  },
  {
    id: "cookies",
    title: "Cookies and browser storage",
    body: (
      <p>
        We use only the cookies needed to keep you signed in (an HTTP-only session cookie on fiscit.com and on app.fiscit.com).
        The dashboard also uses your browser&rsquo;s local storage for preferences such as your color theme, custom categories, budgets
        and optional trackers. There are no advertising or analytics cookies.
      </p>
    ),
  },
  {
    id: "children",
    title: "Age",
    body: <p>Fiscit is intended for people 18 and older. We do not knowingly collect information from minors.</p>,
  },
  {
    id: "changes",
    title: "Changes to this policy",
    body: (
      <p>
        If we make material changes, we will update the date above and let you know by email or in the app before they take effect.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy"
      accent="policy."
      updated={UPDATED}
      intro={
        <p>
          Your finances are personal. In short: we collect what is needed to show you your money, we never sell it, bank access is
          read-only, and you can delete everything yourself in one click.
        </p>
      }
      sections={sections}
    />
  );
}
