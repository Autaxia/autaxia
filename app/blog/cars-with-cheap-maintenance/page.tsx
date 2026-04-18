import Link from 'next/link'

export default function Page() {
  return (
    <div className="max-w-4xl mx-auto py-20 px-6 text-white">

      <h1 className="text-5xl font-bold mb-6">
        Cars With Cheap Maintenance
      </h1>

      <p className="text-gray-400 mb-6">
        Some cars are much cheaper to maintain than others. Here are the best options if you want to save money long-term.
      </p>

      <ul className="space-y-3 text-orange-400">
        <li><Link href="/cars/toyota/corolla/2018">Toyota Corolla 2018</Link></li>
        <li><Link href="/cars/volkswagen/golf/2018">Volkswagen Golf 2018</Link></li>
        <li><Link href="/cars/seat/leon/2018">Seat Leon 2018</Link></li>
      </ul>

    </div>
  )
}