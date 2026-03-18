import Link from "next/link";

export const metadata = {
  title: "Terms & Agreement | Any-Part and Gear",
  description:
    "Read the Terms and Agreement for Any-Part and Gear, including disclaimers on parts condition, fraud, and platform liability.",
};

export default function TermsPage() {
  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-blue-900 mb-2">Terms &amp; Agreement</h1>
      <p className="text-gray-500 mb-8">Last updated: March 18, 2025</p>

      <p className="text-gray-700 mb-8">
        Welcome to <strong>Any-Part and Gear</strong> ("Platform", "we", "us", or "our"). By
        accessing or using our website and services you agree to be bound by these Terms &amp;
        Agreement ("Terms"). Please read them carefully. If you do not agree, do not use the
        Platform.
      </p>

      {/* 1 */}
      <Section title="1. Acceptance of Terms">
        <p>
          By creating an account, browsing listings, posting a part, or completing a purchase
          or trade on Any-Part and Gear, you confirm that you have read, understood, and agree
          to these Terms and our{" "}
          <Link href="/privacy" className="text-blue-600 hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
      </Section>

      {/* 2 */}
      <Section title="2. Parts &amp; Listings Disclaimer">
        <p>
          Any-Part and Gear is a <strong>peer-to-peer marketplace</strong>. We do not
          manufacture, inspect, warehouse, or take physical possession of any parts or goods
          listed on the Platform.
        </p>
        <ul className="list-disc pl-6 mt-3 space-y-2">
          <li>
            <strong>Condition accuracy:</strong> Sellers are solely responsible for accurately
            describing the condition (new, like-new, used, for-parts) of every item they list.
            Any-Part and Gear makes no representation or warranty regarding the condition,
            quality, safety, legality, or fitness for a particular purpose of any listed part.
          </li>
          <li>
            <strong>Compatibility:</strong> Part compatibility information provided in
            listings—including vehicle year, make, and model—is supplied by the seller and is
            not verified by Any-Part and Gear. Buyers are responsible for confirming
            compatibility before purchase.
          </li>
          <li>
            <strong>Safety:</strong> Automotive, marine, and mechanical parts can be
            dangerous if installed incorrectly or if they are defective. Any-Part and Gear
            strongly recommends that all parts be inspected by a qualified professional
            before installation. We are not liable for any injury, property damage, or
            consequential loss arising from the use of parts purchased through the Platform.
          </li>
          <li>
            <strong>"As-Is" sales:</strong> Unless a seller explicitly offers a return policy
            in their listing, all sales are final and parts are sold "as-is". Buyers should
            ask sellers all questions before purchasing.
          </li>
        </ul>
      </Section>

      {/* 3 */}
      <Section title="3. Fraud, Scams &amp; Prohibited Conduct">
        <p>
          Any-Part and Gear takes fraud and scams seriously, but we cannot guarantee that
          every user acts in good faith.{" "}
          <strong>
            We are not liable for losses arising from fraudulent listings, misrepresentation,
            or scam activity by other users.
          </strong>{" "}
          You agree to the following:
        </p>
        <ul className="list-disc pl-6 mt-3 space-y-2">
          <li>You will not post false, misleading, or deceptive listings.</li>
          <li>You will not impersonate another person or entity.</li>
          <li>
            You will not attempt to conduct transactions outside the Platform to circumvent
            buyer/seller protections.
          </li>
          <li>
            You will not send unsolicited communications, phishing links, or any content
            designed to defraud other users.
          </li>
          <li>You will not list stolen, counterfeit, or illegally obtained parts or goods.</li>
        </ul>
        <p className="mt-4">
          If you believe you have been the victim of a scam on the Platform, please{" "}
          <strong>contact us immediately</strong> and, where appropriate, file a report with
          your local law-enforcement agency. Any-Part and Gear will cooperate with
          law-enforcement investigations to the extent permitted by law, but we cannot
          guarantee recovery of funds or goods.
        </p>
        <p className="mt-3 font-semibold text-red-700">
          ⚠ Warning: Never send payment via wire transfer, gift cards, cryptocurrency, or
          other non-reversible methods to a seller you do not personally know and trust.
          Any-Part and Gear will never ask you to pay outside our platform.
        </p>
      </Section>

      {/* 4 */}
      <Section title="4. Limitation of Liability">
        <p>
          To the fullest extent permitted by applicable law, Any-Part and Gear, its officers,
          directors, employees, and affiliates shall <strong>not</strong> be liable for:
        </p>
        <ul className="list-disc pl-6 mt-3 space-y-2">
          <li>
            Any indirect, incidental, special, consequential, or punitive damages arising
            out of or related to your use of the Platform;
          </li>
          <li>Loss of profits, data, goodwill, or other intangible losses;</li>
          <li>
            Damages resulting from unauthorized access to or alteration of your transmissions
            or data;
          </li>
          <li>Any fraudulent activity or misrepresentation by another user;</li>
          <li>
            Personal injury or property damage resulting from use of any part purchased
            through the Platform.
          </li>
        </ul>
        <p className="mt-4">
          Our total liability to you for any claim arising under these Terms shall not exceed
          the greater of (a) the fees paid by you to Any-Part and Gear in the twelve (12)
          months preceding the claim, or (b) one hundred US dollars ($100).
        </p>
      </Section>

      {/* 5 */}
      <Section title="5. User Responsibilities">
        <p>You agree that you are solely responsible for:</p>
        <ul className="list-disc pl-6 mt-3 space-y-2">
          <li>
            The accuracy of all information you provide when registering or posting listings.
          </li>
          <li>Honouring any transaction you enter into with another user.</li>
          <li>
            Complying with all applicable local, state, and federal laws when buying or
            selling parts.
          </li>
          <li>Maintaining the confidentiality of your account credentials.</li>
          <li>
            Promptly reporting any suspicious activity, fraudulent listings, or policy
            violations to Any-Part and Gear.
          </li>
        </ul>
      </Section>

      {/* 6 */}
      <Section title="6. Intellectual Property">
        <p>
          All content on the Platform created by Any-Part and Gear—including logos, design,
          text, graphics, and software—is the exclusive property of Any-Part and Gear and
          protected by applicable intellectual-property laws. Content submitted by users
          (e.g., listing photos) remains the property of the respective user; however, by
          posting content you grant Any-Part and Gear a non-exclusive, worldwide, royalty-free
          licence to display that content in connection with the Platform.
        </p>
      </Section>

      {/* 7 */}
      <Section title="7. Termination">
        <p>
          Any-Part and Gear reserves the right to suspend or terminate your account at any
          time, with or without notice, if we reasonably believe you have violated these Terms
          or engaged in fraudulent, abusive, or illegal activity.
        </p>
      </Section>

      {/* 8 */}
      <Section title="8. Governing Law">
        <p>
          These Terms shall be governed by and construed in accordance with the laws of the
          State of Texas, United States, without regard to its conflict-of-law provisions.
          Any dispute arising under these Terms shall be resolved exclusively in the state or
          federal courts located in Texas.
        </p>
      </Section>

      {/* 9 */}
      <Section title="9. Changes to These Terms">
        <p>
          We may update these Terms from time to time. When we do, we will revise the "Last
          updated" date at the top of this page. Continued use of the Platform after changes
          are posted constitutes your acceptance of the revised Terms.
        </p>
      </Section>

      {/* 10 */}
      <Section title="10. Contact Us">
        <p>
          If you have any questions about these Terms or wish to report a violation, please
          contact us at:
        </p>
        <address className="not-italic mt-3 text-gray-700">
          <strong>Any-Part and Gear</strong>
          <br />
          Email:{" "}
          <a
            href="mailto:support@any-partandgear.com"
            className="text-blue-600 hover:underline"
          >
            support@any-partandgear.com
          </a>
        </address>
      </Section>

      <p className="mt-10 text-sm text-gray-400 border-t pt-6">
        &copy; {new Date().getFullYear()} Any-Part and Gear. All rights reserved.
      </p>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold text-blue-800 mb-3">{title}</h2>
      <div className="text-gray-700 leading-relaxed space-y-2">{children}</div>
    </section>
  );
}
