export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#020203] text-white px-6 py-12">
      <div className="max-w-4xl mx-auto">

        {/* HEADER */}
        <h1 className="text-3xl md:text-5xl font-bold mb-6">
          Terms of Service
        </h1>

        <p className="text-gray-400 mb-10 text-sm">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        {/* CONTENT */}
        <div className="space-y-10 text-gray-300 text-sm leading-relaxed">

          <section>
            <p>
              Welcome to our platform. By accessing or using this website,
              you agree to be bound by these Terms of Service. If you do not
              agree with any part of these terms, you must not use the service.
            </p>
          </section>

          {/* 1 */}
          <section>
            <h2 className="text-white font-semibold mb-3 text-lg">
              1. Use of the Platform
            </h2>
            <p>
              You agree to use the platform only for lawful purposes and in
              accordance with these Terms. You must not use the service:
            </p>
            <ul className="list-disc pl-5 mt-3 space-y-1">
              <li>In any way that violates applicable laws or regulations</li>
              <li>To exploit, harm or attempt to harm other users</li>
              <li>To interfere with the normal operation of the platform</li>
            </ul>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-white font-semibold mb-3 text-lg">
              2. Information & Disclaimer
            </h2>
            <p>
              The information provided on this platform, including specifications,
              maintenance data, costs and reliability insights, is for informational
              purposes only.
            </p>
            <p className="mt-2">
              We do not guarantee accuracy, completeness or reliability of any data.
              Users should verify information independently before making decisions.
            </p>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-white font-semibold mb-3 text-lg">
              3. No Professional Advice
            </h2>
            <p>
              The content on this website does not constitute professional,
              mechanical, financial or legal advice. You are solely responsible
              for any decisions made based on the information provided.
            </p>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-white font-semibold mb-3 text-lg">
              4. Limitation of Liability
            </h2>
            <p>
              To the fullest extent permitted by law, we shall not be liable
              for any direct, indirect, incidental or consequential damages
              resulting from:
            </p>
            <ul className="list-disc pl-5 mt-3 space-y-1">
              <li>Use or inability to use the platform</li>
              <li>Reliance on any information provided</li>
              <li>Errors, omissions or inaccuracies in data</li>
            </ul>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-white font-semibold mb-3 text-lg">
              5. Intellectual Property
            </h2>
            <p>
              All content, design, branding, and data on this platform are
              protected by intellectual property laws. You may not copy,
              distribute, or reproduce any part without prior permission.
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-white font-semibold mb-3 text-lg">
              6. User Data & Privacy
            </h2>
            <p>
              Your use of the platform is also governed by our Privacy Policy.
              We may collect limited usage data to improve the service.
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="text-white font-semibold mb-3 text-lg">
              7. Third-Party Services
            </h2>
            <p>
              The platform may contain links or integrations with third-party
              services. We are not responsible for their content or policies.
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="text-white font-semibold mb-3 text-lg">
              8. Modifications to the Service
            </h2>
            <p>
              We reserve the right to modify, suspend or discontinue any part
              of the platform at any time without prior notice.
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="text-white font-semibold mb-3 text-lg">
              9. Changes to These Terms
            </h2>
            <p>
              We may update these Terms periodically. Continued use of the
              platform after changes implies acceptance of the updated terms.
            </p>
          </section>

          {/* 10 */}
          <section>
            <h2 className="text-white font-semibold mb-3 text-lg">
              10. Governing Law
            </h2>
            <p>
              These Terms shall be governed by and interpreted in accordance
              with applicable laws, without regard to conflict of law principles.
            </p>
          </section>

          {/* 11 */}
          <section>
            <h2 className="text-white font-semibold mb-3 text-lg">
              11. Contact
            </h2>
            <p>
              If you have any questions regarding these Terms, please contact us
              through the platform.
            </p>
          </section>

        </div>

      </div>
    </div>
  )
}