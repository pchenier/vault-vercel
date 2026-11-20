// Conditions d'utilisation — version française. Mêmes sections (et mêmes id),
// mêmes faits et même date que terms.en.tsx.
import Link from "next/link";
import type { LegalDoc, LegalSection } from "@/components/legal-page";

const sections: LegalSection[] = [
  {
    id: "agreement",
    title: "Acceptation",
    body: (
      <p>
        Les présentes conditions régissent votre utilisation de Fiscit sur fiscit.com et app.fiscit.com (le
        &laquo;&nbsp;Service&nbsp;&raquo;). En créant un compte ou en utilisant le Service, vous acceptez ces conditions ainsi que notre{" "}
        <Link href="/privacy">Politique de confidentialité</Link>. Si vous ne les acceptez pas, n&rsquo;utilisez pas le Service.
      </p>
    ),
  },
  {
    id: "service",
    title: "Ce que fait Fiscit",
    body: (
      <p>
        Fiscit affiche l&rsquo;information provenant des comptes que vous connectez — banques par l&rsquo;intermédiaire de Plaid, Wise,
        Questrade, portefeuilles crypto publics et soldes de placements que vous saisissez — et calcule des sommaires comme la valeur
        nette, les budgets et le taux d&rsquo;épargne. Les connexions sont en lecture seule&nbsp;: Fiscit ne peut pas déplacer d&rsquo;argent
        ni effectuer de transactions en votre nom.
      </p>
    ),
  },
  {
    id: "advice",
    title: "Aucun conseil financier",
    body: (
      <p>
        <strong>
          Fiscit est un outil d&rsquo;information. Rien dans le Service ne constitue un conseil financier, en placement, fiscal, juridique
          ou comptable.
        </strong>{" "}
        Les catégories, les analyses et les projections sont des estimations automatisées qui peuvent être erronées ou ne plus être à
        jour. Vérifiez toujours les chiffres importants auprès de votre institution financière, et consultez un professionnel qualifié
        avant de prendre des décisions financières.
      </p>
    ),
  },
  {
    id: "account",
    title: "Votre compte",
    body: (
      <ul>
        <li>Vous devez avoir au moins 18&nbsp;ans et être en mesure de conclure un contrat.</li>
        <li>Fournissez des renseignements exacts et gardez votre mot de passe confidentiel; vous êtes responsable de l&rsquo;activité de votre compte.</li>
        <li>Ne connectez que des comptes dont vous êtes titulaire ou auxquels vous avez l&rsquo;autorisation d&rsquo;accéder.</li>
        <li>Avisez-nous sans délai à <a href="mailto:privacy@fiscit.com">privacy@fiscit.com</a> si vous soupçonnez un accès non autorisé.</li>
      </ul>
    ),
  },
  {
    id: "third-party",
    title: "Services de tiers",
    body: (
      <p>
        Les connexions bancaires sont fournies par Plaid, et les autres connexions par Wise, Questrade, Google et des services de
        chaînes de blocs publiques. Votre utilisation de ces services est aussi soumise à leurs propres conditions. Nous ne sommes pas
        responsables de leur disponibilité, de leur exactitude ni de leurs pannes; lorsqu&rsquo;un fournisseur fait défaut, Fiscit peut
        afficher les dernières données reçues.
      </p>
    ),
  },
  {
    id: "use",
    title: "Utilisation acceptable",
    body: (
      <>
        <p>Vous vous engagez à ne pas&nbsp;:</p>
        <ul>
          <li>accéder à des comptes ou à des données qui ne vous appartiennent pas, ni tenter de briser, de sonder ou de surcharger le Service;</li>
          <li>extraire automatiquement les données du Service (moissonnage), en faire l&rsquo;ingénierie inverse ou le revendre, sauf dans la mesure où la loi le permet;</li>
          <li>utiliser le Service à des fins illégales, notamment la fraude ou le blanchiment d&rsquo;argent.</li>
        </ul>
        <p>
          Vous avez découvert un problème de sécurité? Signalez-le en privé à <a href="mailto:privacy@fiscit.com">privacy@fiscit.com</a> —
          nous apprécions la divulgation responsable.
        </p>
      </>
    ),
  },
  {
    id: "pricing",
    title: "Tarifs",
    body: (
      <p>
        Fiscit est actuellement gratuit. Si nous introduisons des forfaits payants, nous afficherons clairement le prix, tout essai
        gratuit et les modalités de facturation avant que des frais vous soient facturés; aucuns frais ne vous seront jamais facturés
        sans votre consentement explicite, et vous pourrez annuler en tout temps, avec effet à la fin de la période de facturation en
        cours.
      </p>
    ),
  },
  {
    id: "data",
    title: "Vos données",
    body: (
      <p>
        Vos données vous appartiennent. Vous nous autorisez à les traiter uniquement pour fournir le Service, comme le décrit la{" "}
        <Link href="/privacy">Politique de confidentialité</Link>. Vous pouvez déconnecter des services ou supprimer votre compte en
        tout temps à partir des Paramètres; la suppression est définitive.
      </p>
    ),
  },
  {
    id: "termination",
    title: "Suspension et résiliation",
    body: (
      <p>
        Vous pouvez cesser d&rsquo;utiliser Fiscit et supprimer votre compte en tout temps. Nous pouvons suspendre ou fermer un compte
        qui enfreint les présentes conditions ou qui met en danger d&rsquo;autres utilisateurs ou le Service; lorsque c&rsquo;est
        raisonnable, nous vous en indiquerons la raison et vous donnerons d&rsquo;abord la possibilité d&rsquo;exporter vos renseignements.
      </p>
    ),
  },
  {
    id: "warranty",
    title: "Exclusions et responsabilité",
    body: (
      <>
        <p>
          Le Service est fourni &laquo;&nbsp;tel quel&nbsp;&raquo; et &laquo;&nbsp;selon sa disponibilité&nbsp;&raquo;. Dans la mesure permise
          par la loi, nous ne garantissons pas qu&rsquo;il sera ininterrompu ou exempt d&rsquo;erreurs, ni que les données provenant de tiers
          sont complètes ou exactes, et nous ne sommes pas responsables des pertes indirectes ou consécutives, ni des décisions que vous
          prenez sur la foi du Service.
        </p>
        <p>
          Rien dans les présentes conditions ne limite les droits dont vous bénéficiez à titre de consommateur et qui ne peuvent être
          limités par contrat, notamment en vertu de la <em>Loi sur la protection du consommateur</em> du Québec, ni notre responsabilité
          pour notre propre faute intentionnelle ou lourde.
        </p>
      </>
    ),
  },
  {
    id: "law",
    title: "Droit applicable",
    body: (
      <p>
        Les présentes conditions sont régies par les lois du Québec et les lois fédérales du Canada qui s&rsquo;y appliquent. Si vous
        êtes un consommateur, vous pouvez intenter un recours devant les tribunaux de votre lieu de résidence.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Modifications",
    body: (
      <p>
        Nous pouvons mettre à jour les présentes conditions. En cas de modifications importantes, nous vous en aviserons par courriel ou
        dans l&rsquo;application au moins 30&nbsp;jours avant leur entrée en vigueur; si vous n&rsquo;êtes pas d&rsquo;accord, vous pourrez
        fermer votre compte sans frais d&rsquo;ici là.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Nous joindre",
    body: (
      <p>
        Questions sur les présentes conditions&nbsp;: <a href="mailto:privacy@fiscit.com">privacy@fiscit.com</a>.
      </p>
    ),
  },
];

export const termsFr: LegalDoc = {
  metaTitle: "Conditions d’utilisation — Fiscit",
  metaDescription: "Les règles d’utilisation de Fiscit.",
  title: "Conditions",
  accent: "d’utilisation.",
  updated: "25 octobre 2026",
  intro: (
    <p>
      En bref&nbsp;: Fiscit vous montre votre argent, mais ne le déplace jamais; ce n&rsquo;est pas un conseil financier; vos données vous
      appartiennent; et vous pouvez partir et tout supprimer quand vous le voulez.
    </p>
  ),
  sections,
};
