import Link from 'next/link'

export default function Page() {
  return (
    <div className="max-w-4xl mx-auto py-20 px-6 text-white">

      <h1 className="text-5xl font-bold mb-6">
        Best Reliable Cars in 2026
      </h1>

      <p className="text-gray-400 mb-6">
        Reliability is one of the most important factors when buying a car. Here are some of the most dependable models based on real-world data.
      </p>

      <h2 className="text-2xl font-semibold mt-10 mb-4">Top reliable cars</h2>

      <ul className="space-y-3 text-orange-400">
        <li><Link href="/cars/toyota/corolla/2018">Toyota Corolla 2018</Link></li>
        <li><Link href="/cars/audi/a4/2018">Audi A4 2018</Link></li>
        <li><Link href="/cars/honda/civic/2018">Honda Civic 2018</Link></li>
      </ul>

      <p className="text-gray-400 mt-8">
        These cars are known for strong engines, low failure rates and consistent long-term performance.
      </p>

    </div>
  )
}