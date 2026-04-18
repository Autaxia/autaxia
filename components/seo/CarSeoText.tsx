type Props = {
  brand: string
  model: string
  year: number
  engine?: any
}

export function CarSeoText({ brand, model, year, engine }: Props) {

  return (
    <div className="mt-12 space-y-6 text-muted-foreground leading-relaxed">

      {/* INTRO */}
      <section>
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          {brand} {model} {year} Overview
        </h2>

        <p>
          The {brand} {model} {year} is a well-balanced vehicle offering a strong combination of performance,
          efficiency and reliability. Designed for both everyday driving and long-distance comfort,
          it remains one of the most popular choices in its segment.
        </p>
      </section>

      {/* PERFORMANCE */}
      <section>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Engine & Performance
        </h3>

        <p>
          This model comes equipped with a {engine?.horsepower || 'well-tuned'} horsepower engine,
          delivering smooth acceleration and responsive handling.
          With a torque output of {engine?.torque || 'competitive levels'} Nm,
          the {model} ensures confident performance in both city and highway conditions.
        </p>
      </section>

      {/* RELIABILITY */}
      <section>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Reliability & Maintenance
        </h3>

        <p>
          The {brand} {model} {year} is known for its solid reliability ratings and manageable maintenance costs.
          Regular servicing and proper care can significantly extend its lifespan,
          making it a dependable option for long-term ownership.
        </p>
      </section>

      {/* COST */}
      <section>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Ownership Costs
        </h3>

        <p>
          In terms of ownership costs, the {model} offers a balanced profile.
          Fuel efficiency, insurance rates and servicing expenses are all within expected ranges
          for vehicles in this category, making it a practical choice for most drivers.
        </p>
      </section>

      {/* CONCLUSION */}
      <section>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Is the {brand} {model} {year} Worth It?
        </h3>

        <p>
          Overall, the {brand} {model} {year} stands out as a reliable and versatile vehicle.
          Whether you prioritize comfort, efficiency or performance,
          it remains a strong contender in today’s automotive market.
        </p>
      </section>

    </div>
  )
}