export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#020203] text-white px-6 py-12">

      <div className="max-w-4xl mx-auto">

        <h1 className="text-3xl md:text-5xl font-bold mb-6">
          Privacy Policy
        </h1>

        <p className="text-gray-400 mb-10 text-sm">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <div className="space-y-10 text-gray-300 text-sm leading-relaxed">

          {/* INTRO */}
          <section>
            <p>
              At Autaxia, we value your privacy and are committed to protecting your personal information. 
              This Privacy Policy explains how we collect, use, and safeguard your data when you use our platform.
            </p>
          </section>

          {/* DATA WE COLLECT */}
          <section>
            <h2 className="text-white font-semibold mb-3 text-lg">
              1. Information We Collect
            </h2>

            <p className="mb-3">
              We may collect the following types of information:
            </p>

            <ul className="list-disc pl-5 space-y-2">
              <li>Basic usage data (pages visited, interactions)</li>
              <li>Device and browser information</li>
              <li>Anonymous analytics data</li>
              <li>Data related to comparisons or saved vehicles</li>
            </ul>
          </section>

          {/* HOW WE USE */}
          <section>
            <h2 className="text-white font-semibold mb-3 text-lg">
              2. How We Use Your Data
            </h2>

            <ul className="list-disc pl-5 space-y-2">
              <li>To improve the accuracy and usefulness of car insights</li>
              <li>To enhance user experience and platform performance</li>
              <li>To analyze trends and optimize content</li>
              <li>To provide relevant comparisons and recommendations</li>
            </ul>
          </section>

          {/* COOKIES */}
          <section>
            <h2 className="text-white font-semibold mb-3 text-lg">
              3. Cookies & Tracking
            </h2>

            <p>
              We may use cookies and similar technologies to understand how users interact with our platform. 
              This helps us improve performance and deliver a better experience.
            </p>
          </section>

          {/* SHARING */}
          <section>
            <h2 className="text-white font-semibold mb-3 text-lg">
              4. Data Sharing
            </h2>

            <p>
              We do not sell your personal data. We may share limited data with trusted third-party services 
              (such as analytics providers) strictly for improving our platform.
            </p>
          </section>

          {/* SECURITY */}
          <section>
            <h2 className="text-white font-semibold mb-3 text-lg">
              5. Data Security
            </h2>

            <p>
              We implement appropriate security measures to protect your data from unauthorized access, 
              alteration, or disclosure.
            </p>
          </section>

          {/* USER RIGHTS */}
          <section>
            <h2 className="text-white font-semibold mb-3 text-lg">
              6. Your Rights
            </h2>

            <p>
              You have the right to request access, correction, or deletion of your data where applicable.
            </p>
          </section>

          {/* CHANGES */}
          <section>
            <h2 className="text-white font-semibold mb-3 text-lg">
              7. Changes to This Policy
            </h2>

            <p>
              We may update this Privacy Policy from time to time. Updates will be reflected on this page.
            </p>
          </section>

          {/* CONTACT */}
          <section>
            <h2 className="text-white font-semibold mb-3 text-lg">
              8. Contact
            </h2>

            <p>
              If you have any questions regarding this policy, you can contact us at:
            </p>

            <p className="text-orange-400 mt-2">
              autaxia@proton.me
            </p>
          </section>

        </div>

      </div>

    </div>
  )
}