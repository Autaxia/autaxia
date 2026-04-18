import type { Metadata } from 'next'

// ======================
// SEO
// ======================
export const metadata: Metadata = {
  title: 'Contact Autaxia',
  description:
    'Contact Autaxia for questions, partnerships or to report car data issues.',
}

// ======================
// PAGE
// ======================
export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#020203] text-white px-4 py-20">

      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-16">

          <h1 className="text-4xl md:text-5xl font-bold">
            Contact <span className="text-orange-400">Autaxia</span>
          </h1>

          <p className="text-gray-400 mt-4 max-w-xl mx-auto">
            Have questions, found incorrect data or want to collaborate? We’d love to hear from you.
          </p>

        </div>

        {/* GRID */}
        <div className="grid md:grid-cols-3 gap-6">

          {/* GENERAL */}
          <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur">
            <h2 className="text-lg font-semibold mb-3">
              General inquiries
            </h2>

            <p className="text-sm text-gray-400 mb-4">
              Questions about the platform, features or how to use Autaxia.
            </p>

            <a
              href="mailto:contact@autaxia.com"
              className="text-orange-400 text-sm font-semibold hover:underline"
            >
              contact@autaxia.com
            </a>
          </div>

          {/* DATA */}
          <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur">
            <h2 className="text-lg font-semibold mb-3">
              Report data issue
            </h2>

            <p className="text-sm text-gray-400 mb-4">
              Found incorrect specs, problems or maintenance data? Let us know.
            </p>

            <a
              href="mailto:data@autaxia.com"
              className="text-orange-400 text-sm font-semibold hover:underline"
            >
              data@autaxia.com
            </a>
          </div>

          {/* BUSINESS */}
          <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur">
            <h2 className="text-lg font-semibold mb-3">
              Partnerships
            </h2>

            <p className="text-sm text-gray-400 mb-4">
              Business collaborations, integrations or advertising opportunities.
            </p>

            <a
              href="mailto:business@autaxia.com"
              className="text-orange-400 text-sm font-semibold hover:underline"
            >
              business@autaxia.com
            </a>
          </div>

        </div>

        {/* EXTRA BLOCK */}
        <div className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-white/[0.04] to-transparent border border-white/10 text-center">

          <h3 className="text-xl font-semibold mb-3">
            We usually reply within 24–48 hours
          </h3>

          <p className="text-gray-400 text-sm max-w-xl mx-auto">
            Autaxia is constantly improving. Your feedback helps us make better car data,
            better insights and a better experience for everyone.
          </p>

        </div>

      </div>

    </main>
  )
}