import Link from 'next/link'

export default function Page() {
  return (
    <div className="max-w-4xl mx-auto py-20 px-6 text-white">

      <h1 className="text-5xl font-bold mb-6">
        Most Common Car Problems
      </h1>

      <p className="text-gray-400 mb-6">
        Knowing the most common car problems can save you thousands in repairs.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Frequent issues</h2>

      <ul className="space-y-3 text-gray-300">
        <li>Oil consumption</li>
        <li>Electrical failures</li>
        <li>Transmission issues</li>
        <li>Brake wear</li>
      </ul>

      <p className="text-gray-400 mt-8">
        You can check detailed issues per model below:
      </p>

      <ul className="space-y-3 text-orange-400 mt-4">
        <li><Link href="/cars/audi/a4/2018">Audi A4 problems</Link></li>
        <li><Link href="/cars/bmw/3-series/2018">BMW 3 Series problems</Link></li>
      </ul>

    </div>
  )
}