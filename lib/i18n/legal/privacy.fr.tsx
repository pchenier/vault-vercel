// Politique de confidentialité — version française. Mêmes sections (et mêmes id),
// mêmes faits et même date que privacy.en.tsx.
import type { LegalDoc, LegalSection } from "@/components/legal-page";

const sections: LegalSection[] = [
  {
    id: "who",
    title: "Qui nous sommes",
    body: (
      <>
        <p>
          Fiscit (&laquo;&nbsp;Fiscit&nbsp;&raquo;, &laquo;&nbsp;nous&nbsp;&raquo;) est un tableau de bord de finances personnelles exploité
          depuis Montréal (Québec), Canada, aux adresses fiscit.com et app.fiscit.com. La présente politique explique comment nous
          traitons les renseignements personnels en vertu de la <em>Loi sur la protection des renseignements personnels dans le secteur
          privé</em> du Québec (telle que modifiée par la Loi&nbsp;25) et de la <em>Loi sur la protection des renseignements personnels
          et les documents électroniques</em> (LPRPDE) du Canada.
        </p>
        <p>
          <strong>Personne responsable de la protection des renseignements personnels&nbsp;:</strong> Responsable de la protection de la
          vie privée, Fiscit —{" "}
          <a href="mailto:privacy@fiscit.com">privacy@fiscit.com</a>. Communiquez avec cette personne pour toute question, demande ou
          plainte concernant vos renseignements.
        </p>
      </>
    ),
  },
  {
    id: "collect",
    title: "Ce que nous recueillons",
    body: (
      <>
        <ul>
          <li><strong>Compte&nbsp;:</strong> adresse courriel, nom d&rsquo;affichage, mot de passe (conservé uniquement sous forme de hachage bcrypt — nous ne le voyons jamais) et l&rsquo;identifiant de votre compte Google si vous vous connectez avec Google.</li>
          <li><strong>Données bancaires, par l&rsquo;intermédiaire de Plaid&nbsp;:</strong> noms et types de comptes, soldes et transactions (date, montant, commerçant ou description, catégorie). Nous recevons un jeton d&rsquo;accès de Plaid; <strong>nous ne recevons ni ne conservons jamais votre nom d&rsquo;utilisateur ou votre mot de passe bancaire.</strong></li>
          <li><strong>Autres connexions que vous choisissez d&rsquo;ajouter&nbsp;:</strong> votre jeton d&rsquo;API Wise et votre identifiant de profil; les adresses publiques de portefeuilles crypto et les quantités de cryptomonnaies que vous saisissez; la plateforme, le type et le solde des comptes de placement que vous saisissez.</li>
          <li><strong>Connexions à un courtier (facultatives, en lecture seule)&nbsp;:</strong> si vous connectez un courtier, nous recevons vos comptes de placement, leurs soldes et leurs avoirs (symboles, quantités, prix). Selon la méthode, nous conservons un jeton ou une clé en lecture seule que vous générez (Questrade, Interactive Brokers Flex, Kraken &laquo;&nbsp;Query Funds&nbsp;&raquo;) ou un secret propre à chaque utilisateur fourni par SnapTrade. <strong>Nous ne recevons jamais le mot de passe de votre compte de courtage</strong>, et ces connexions ne peuvent ni passer d&rsquo;ordres ni déplacer d&rsquo;argent.</li>
          <li><strong>Google Agenda (facultatif)&nbsp;:</strong> si vous le connectez, un accès en lecture seule aux événements de votre agenda, afin qu&rsquo;ils puissent s&rsquo;afficher dans le calendrier de Fiscit.</li>
          <li><strong>Information que vous créez dans l&rsquo;application&nbsp;:</strong> catégories, règles, budgets et outils de suivi facultatifs (entraînement, repas, habitudes, événements d&rsquo;agenda). La plupart de ces éléments sont conservés uniquement dans votre navigateur.</li>
          <li><strong>Données techniques&nbsp;:</strong> témoins (cookies) de session et journaux de serveur standard conservés par nos hébergeurs (adresse IP, type de navigateur, heure de la requête) à des fins de sécurité et de débogage.</li>
        </ul>
        <p>Nous ne recueillons pas votre numéro d&rsquo;assurance sociale, et nous n&rsquo;utilisons aucun témoin d&rsquo;analyse, de publicité ou de pistage.</p>
      </>
    ),
  },
  {
    id: "use",
    title: "Pourquoi nous les utilisons",
    body: (
      <>
        <p>Nous utilisons vos renseignements uniquement pour&nbsp;:</p>
        <ul>
          <li>créer et sécuriser votre compte, et vérifier votre adresse courriel;</li>
          <li>afficher vos soldes, vos transactions, votre valeur nette, vos budgets, votre taux d&rsquo;épargne et les autres fonctions du tableau de bord;</li>
          <li>catégoriser vos transactions et calculer des sommaires pour vous;</li>
          <li>vous envoyer des courriels de service (vérification, avis de sécurité) et, seulement si vous y avez consenti à l&rsquo;inscription, des nouvelles sur le produit, dont vous pouvez vous désabonner en tout temps;</li>
          <li>assurer la sécurité du service, prévenir les abus et corriger les problèmes;</li>
          <li>respecter la loi.</li>
        </ul>
        <p>
          <strong>Nous ne vendons jamais vos renseignements personnels, ne les louons jamais et n&rsquo;utilisons jamais vos données financières à des fins publicitaires.</strong>{" "}
          Nous n&rsquo;utilisons pas vos données pour entraîner des modèles d&rsquo;intelligence artificielle de tiers.
        </p>
      </>
    ),
  },
  {
    id: "share",
    title: "Avec qui nous les partageons",
    body: (
      <>
        <p>Nous ne partageons des renseignements qu&rsquo;avec les fournisseurs de services qui nous aident à exploiter Fiscit, en vertu de contrats ou de conditions qui en limitent l&rsquo;utilisation&nbsp;:</p>
        <ul>
          <li><strong>Plaid</strong> — connecte vos comptes bancaires. La façon dont Plaid traite vos données est décrite dans sa <a href="https://plaid.com/legal/#end-user-privacy-policy" target="_blank" rel="noreferrer">politique de confidentialité pour les utilisateurs finaux</a> (Plaid End User Privacy Policy).</li>
          <li><strong>Vercel</strong> (fiscit.com) et <strong>Railway</strong> (app.fiscit.com et notre base de données) — hébergement et stockage.</li>
          <li><strong>Google</strong> — connexion et, si vous le connectez, Google Agenda.</li>
          <li><strong>Resend</strong> — envoie nos courriels (reçoit votre adresse courriel).</li>
          <li><strong>Wise</strong> — seulement si vous le connectez, pour lire vos soldes.</li>
          <li><strong>SnapTrade</strong> — seulement si vous connectez un compte de courtage par son intermédiaire (p.&nbsp;ex. Wealthsimple); vous vous connectez à votre courtier sur la page de SnapTrade, qui nous transmet des données de compte en lecture seule.</li>
          <li><strong>Questrade</strong>, <strong>Interactive Brokers</strong> et <strong>Kraken</strong> — seulement si vous les connectez directement, pour lire les soldes et les avoirs.</li>
          <li><strong>Services de chaînes de blocs publiques</strong> (Solana RPC, blockchain.info, Etherscan) — reçoivent les adresses publiques de portefeuilles que vous ajoutez, pour lire les soldes. <strong>CoinGecko</strong> fournit le cours des cryptomonnaies et ne reçoit aucun renseignement personnel.</li>
        </ul>
        <p>Nous pouvons aussi communiquer des renseignements si la loi l&rsquo;exige, ou pour protéger les droits et la sécurité de nos utilisateurs, dans la mesure permise par la loi.</p>
      </>
    ),
  },
  {
    id: "outside",
    title: "Stockage à l’extérieur du Québec",
    body: (
      <p>
        Nos hébergeurs stockent et traitent les données sur des serveurs situés principalement aux États-Unis; vos renseignements
        peuvent donc être communiqués à l&rsquo;extérieur du Québec et du Canada. Nous faisons appel à des fournisseurs qui appliquent
        des mesures de protection conformes aux normes du secteur, notamment le chiffrement en transit et le contrôle des accès.
        Les renseignements conservés à l&rsquo;extérieur du Canada peuvent être accessibles aux autorités du pays concerné en vertu de
        ses lois.
      </p>
    ),
  },
  {
    id: "security",
    title: "Comment nous les protégeons",
    body: (
      <>
        <ul>
          <li>Tout le trafic est chiffré au moyen de HTTPS/TLS.</li>
          <li>Les mots de passe sont hachés avec bcrypt; les sessions utilisent des témoins signés de type HTTP-only.</li>
          <li>Les jetons d&rsquo;accès et les clés d&rsquo;API de vos banques et de vos courtiers sont chiffrés dans notre base de données.</li>
          <li>Les connexions bancaires sont <strong>en lecture seule</strong>&nbsp;: Fiscit ne peut pas déplacer d&rsquo;argent, effectuer de paiements ni rien modifier à votre banque.</li>
          <li>L&rsquo;accès aux systèmes de production est réservé aux personnes qui exploitent Fiscit.</li>
        </ul>
        <p>
          Aucun système n&rsquo;est parfaitement sûr. Si un incident de confidentialité présente un risque de préjudice sérieux, nous vous en
          aviserons, ainsi que la Commission d&rsquo;accès à l&rsquo;information du Québec, comme l&rsquo;exige la loi, et nous tiendrons un
          registre des incidents.
        </p>
      </>
    ),
  },
  {
    id: "retention",
    title: "Combien de temps nous les conservons",
    body: (
      <>
        <p>
          Nous conservons vos renseignements tant que votre compte est ouvert. Lorsque vous supprimez votre compte (Paramètres →
          Supprimer le compte), nous révoquons immédiatement l&rsquo;accès de Fiscit chez Plaid et SnapTrade et supprimons définitivement
          de notre base de données votre compte, vos connexions, vos jetons, vos soldes et vos entrées de placements. Vous pouvez aussi
          déconnecter un seul compte de courtage en tout temps à partir de la page Placements. Les renseignements conservés uniquement
          dans votre navigateur sont effacés de ce navigateur au même moment.
        </p>
        <p>Les journaux de serveur conservés par nos hébergeurs sont supprimés selon leurs propres calendriers, généralement dans un délai de 30&nbsp;jours.</p>
      </>
    ),
  },
  {
    id: "rights",
    title: "Vos droits",
    body: (
      <>
        <p>Vous pouvez, en tout temps&nbsp;:</p>
        <ul>
          <li><strong>accéder</strong> aux renseignements personnels que nous détenons à votre sujet et demander comment ils sont utilisés;</li>
          <li><strong>faire rectifier</strong> les renseignements inexacts ou incomplets;</li>
          <li><strong>retirer votre consentement</strong> — déconnecter un service, ou supprimer entièrement votre compte à partir des Paramètres;</li>
          <li>demander vos renseignements dans un format technologique structuré et couramment utilisé (<strong>portabilité</strong>);</li>
          <li>nous demander de cesser de diffuser vos renseignements ou de les désindexer, lorsque la loi le permet.</li>
        </ul>
        <p>
          Écrivez à <a href="mailto:privacy@fiscit.com">privacy@fiscit.com</a>. Nous répondons dans un délai de 30&nbsp;jours. Si notre
          réponse ne vous satisfait pas, vous pouvez porter plainte auprès de la{" "}
          <a href="https://www.cai.gouv.qc.ca" target="_blank" rel="noreferrer">Commission d&rsquo;accès à l&rsquo;information du Québec</a> ou
          du <a href="https://www.priv.gc.ca" target="_blank" rel="noreferrer">Commissariat à la protection de la vie privée du Canada</a>.
        </p>
      </>
    ),
  },
  {
    id: "google",
    title: "Données des utilisateurs de Google",
    body: (
      <p>
        L&rsquo;utilisation et le transfert, par Fiscit, des renseignements reçus des API de Google respectent les{" "}
        <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noreferrer">règles relatives aux données utilisateur des services d&rsquo;API Google</a>{" "}
        (Google API Services User Data Policy), y compris les exigences d&rsquo;utilisation limitée (Limited Use). Les données d&rsquo;agenda
        servent uniquement à afficher vos événements dans Fiscit; elles ne sont jamais vendues ni utilisées à des fins publicitaires,
        et elles ne sont pas consultées par des personnes, sauf avec votre consentement, à des fins de sécurité ou pour respecter la loi.
      </p>
    ),
  },
  {
    id: "cookies",
    title: "Témoins et stockage dans le navigateur",
    body: (
      <p>
        Nous utilisons seulement deux types de témoins (cookies)&nbsp;: ceux nécessaires pour garder votre session ouverte (un témoin
        de session HTTP-only sur fiscit.com et sur app.fiscit.com) et un témoin qui retient la langue choisie (fiscit_lang, partagé
        par fiscit.com et app.fiscit.com). Le tableau de bord utilise aussi le stockage local de votre navigateur pour des
        préférences comme votre thème de couleurs, vos catégories personnalisées, vos budgets et vos outils de suivi facultatifs.
        Il n&rsquo;y a aucun témoin de publicité ou d&rsquo;analyse.
      </p>
    ),
  },
  {
    id: "children",
    title: "Âge",
    body: <p>Fiscit s&rsquo;adresse aux personnes de 18&nbsp;ans et plus. Nous ne recueillons pas sciemment de renseignements auprès de personnes mineures.</p>,
  },
  {
    id: "changes",
    title: "Modifications de la présente politique",
    body: (
      <p>
        Si nous apportons des modifications importantes, nous mettrons à jour la date ci-dessus et vous en informerons par courriel ou
        dans l&rsquo;application avant leur entrée en vigueur.
      </p>
    ),
  },
];

export const privacyFr: LegalDoc = {
  metaTitle: "Politique de confidentialité — Fiscit",
  metaDescription:
    "Ce que Fiscit recueille, pourquoi, avec qui ces renseignements sont partagés et les droits dont vous disposez sur vos données.",
  title: "Politique de",
  accent: "confidentialité.",
  updated: "20 novembre 2026",
  intro: (
    <p>
      Vos finances sont personnelles. En bref&nbsp;: nous recueillons ce qu&rsquo;il faut pour vous montrer votre argent, nous ne vendons
      jamais ces renseignements, l&rsquo;accès bancaire est en lecture seule, et vous pouvez tout supprimer vous-même en un clic.
    </p>
  ),
  sections,
};
