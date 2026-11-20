
import { useState } from 'react'
import { runPlanner } from './utils/planner'

import type {
  Interest,
  Mood,
  PlannerInput,
  PlannerResult,
} from './types/planner'

const interests: Interest[] = [
  'Food',
  'Music',
  'Nature',
  'Walking',
  'Art',
  'Movies',
  'Shopping',
  'Adventure',
  'Relaxation',
  'Social',
  'Culture',
]

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  if (hours === 0) return `${remainingMinutes} min`
  if (remainingMinutes === 0) return `${hours}h`

  return `${hours}h ${remainingMinutes}m`
}

function App() {
  const [city, setCity] = useState('Bangalore')
  const [budget, setBudget] = useState(2000)
  const [hours, setHours] = useState('4')
  const [mood, setMood] = useState<Mood>('Tired but Fun')
  const [selectedInterests, setSelectedInterests] = useState<Interest[]>([
    'Food',
    'Music',
    'Walking',
  ])
  const [constraints, setConstraints] = useState(
    'Vegetarian, avoid crowds',
  )
  const [result, setResult] = useState<PlannerResult | null>(null)

  const toggleInterest = (interest: Interest) => {
    setSelectedInterests((current) =>
      current.includes(interest)
        ? current.filter((item) => item !== interest)
        : [...current, interest],
    )
  }

  const loadExample = () => {
    setCity('Bangalore')
    setBudget(2000)
    setHours('4')
    setMood('Tired but Fun')
    setSelectedInterests(['Food', 'Music', 'Walking'])
    setConstraints('Vegetarian, avoid crowds')
    setResult(null)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const input: PlannerInput = {
      city,
      budget,
      hours: Number(hours),
      mood,
      interests: selectedInterests,
      constraints,
    }

    setResult(runPlanner(input))
  }

  const validationChecks = result
    ? [
        { label: 'Budget', passed: result.validation.budgetValid },
        { label: 'Available time', passed: result.validation.timeValid },
        { label: 'Constraints', passed: result.validation.constraintsValid },
        { label: 'Travel', passed: result.validation.travelValid },
      ]
    : []

  const planSummary = result
    ? result.plan.length === 0
      ? "We couldn't find a suitable combination for these preferences. Try adjusting your budget, available time or interests."
      : `Your ${mood.toLowerCase()} Saturday in ${city} includes ${result.plan.length} planned stops. The estimated spending is ₹${result.minTotalCost.toLocaleString('en-IN')}–₹${result.maxTotalCost.toLocaleString('en-IN')}, with approximately ${formatDuration(result.totalDuration)} allocated to activities and travel. ${
          result.budgetTargetMet
            ? 'Your estimated spending is within your preferred 60–80% budget range.'
            : 'The plan prioritizes suitable activities and your constraints over spending unnecessarily.'
        }`
    : ''

  return (
    <main className="min-h-screen bg-[#f7f7f0] text-[#183b32]">
      <header className="border-b border-[#e5e8dc] bg-white/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Saturdayly<span className="text-[#d58a4b]">.</span>
            </h1>
            <p className="text-xs text-gray-500">
              YOUR SATURDAY, THOUGHTFULLY PLANNED
            </p>
          </div>
          <span className="rounded-full bg-[#e9f0e9] px-4 py-2 text-sm font-medium">
            ✦ Weekend planner
          </span>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-10">
        {/* HERO */}
        <div className="mb-10 max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#b87940]">
            Make the most of your weekend
          </p>
          <h2 className="text-4xl font-bold leading-tight md:text-5xl">
            Your perfect Saturday
            <span className="text-[#b87940]"> starts here.</span>
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Tell us what you're in the mood for. We'll put together a
            thoughtful day that fits your time, budget and interests.
          </p>
        </div>

        {/* MAIN TWO-COLUMN LAYOUT */}
        <div className="grid items-start gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          {/* LEFT COLUMN: INPUT AND GENERATED PLAN */}
          <div className="min-w-0 space-y-8">
            {/* INPUT FORM */}
            <form
              onSubmit={handleSubmit}
              className="rounded-3xl border border-[#e5e8dc] bg-white p-6 shadow-sm md:p-8"
            >
              <div className="mb-7 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">Plan your day</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    A few details help us personalize your itinerary.
                  </p>
                </div>
                <span className="text-2xl">☀️</span>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="text-sm font-semibold">
                  Your city
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-[#fafbf8] p-3 font-normal outline-none focus:border-[#47765e]"
                  >
                    {['Bangalore', 'Hyderabad', 'Chennai', 'New Delhi'].map(
                      (cityName) => (
                        <option key={cityName} value={cityName}>
                          {cityName}
                        </option>
                      ),
                    )}
                  </select>
                </label>

                <label className="text-sm font-semibold">
                  Your budget (₹)
                  <input
                    type="number"
                    min="1"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    required
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-[#fafbf8] p-3 font-normal outline-none focus:border-[#47765e]"
                  />
                </label>

                <label className="text-sm font-semibold">
                  Available time
                  <select
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-[#fafbf8] p-3 font-normal outline-none focus:border-[#47765e]"
                  >
                    {['2', '3', '4', '5', '6'].map((h) => (
                      <option key={h} value={h}>
                        {h} hours
                      </option>
                    ))}
                  </select>
                </label>

                <label className="text-sm font-semibold">
                  Your mood
                  <select
                    value={mood}
                    onChange={(e) => setMood(e.target.value as Mood)}
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-[#fafbf8] p-3 font-normal outline-none focus:border-[#47765e]"
                  >
                    {[
                      'Relaxed',
                      'Adventurous',
                      'Social',
                      'Tired but Fun',
                      'Productive',
                      'Curious',
                    ].map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="mt-7">
                <h4 className="mb-3 text-sm font-semibold">
                  What do you enjoy?
                </h4>
                <div className="flex flex-wrap gap-2">
                  {interests.map((interest) => (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`rounded-full border px-4 py-2 text-sm transition ${
                        selectedInterests.includes(interest)
                          ? 'border-[#315d48] bg-[#315d48] text-white'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-[#315d48]'
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>

              <label className="mt-7 block text-sm font-semibold">
                Any preferences or constraints?
                <textarea
                  value={constraints}
                  onChange={(e) => setConstraints(e.target.value)}
                  rows={3}
                  placeholder="E.g. vegetarian, avoid crowds, no long travel..."
                  className="mt-2 w-full resize-none rounded-xl border border-gray-200 bg-[#fafbf8] p-3 font-normal outline-none focus:border-[#47765e]"
                />
              </label>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  disabled={budget <= 0}
                  className="flex-1 rounded-xl bg-[#315d48] px-6 py-4 font-semibold text-white transition hover:bg-[#244a38] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Plan My Saturday →
                </button>
                <button
                  type="button"
                  onClick={loadExample}
                  className="rounded-xl border border-gray-200 px-6 py-4 font-semibold hover:bg-gray-50"
                >
                  Try Example
                </button>
              </div>
            </form>

            {/* GENERATED PLAN */}
            {result && (
              <section className="space-y-6">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-widest text-[#b87940]">
                    Your personalized plan
                  </p>
                  <h2 className="mt-2 text-3xl font-bold">
                    Your Saturday in {city}
                  </h2>
                </div>

                {/* SUMMARY METRICS */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-[#e5e8dc] bg-white p-5">
                    <p className="text-sm text-gray-500">
                      Estimated spending
                    </p>
                    <p className="mt-2 text-2xl font-bold">
                      ₹{result.minTotalCost.toLocaleString('en-IN')}–₹
                      {result.maxTotalCost.toLocaleString('en-IN')}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Approximate total range
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[#e5e8dc] bg-white p-5">
                    <p className="text-sm text-gray-500">
                      Budget remaining
                    </p>
                    <p className="mt-2 text-2xl font-bold">
                      ₹{Math.max(0, budget - result.maxTotalCost).toLocaleString('en-IN')}
                      –₹{Math.max(0, budget - result.minTotalCost).toLocaleString('en-IN')}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Approximate remaining range
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[#e5e8dc] bg-white p-5">
                    <p className="text-sm text-gray-500">
                      Total planned time
                    </p>
                    <p className="mt-2 text-2xl font-bold">
                      {formatDuration(result.totalDuration)}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Including estimated travel
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[#e5e8dc] bg-white p-5">
                    <p className="text-sm text-gray-500">
                      Estimated travel
                    </p>
                    <p className="mt-2 text-2xl font-bold">
                      {formatDuration(result.totalTravelMinutes)}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Approx. {result.totalTravelDistanceKm.toFixed(1)} km
                      between stops
                    </p>
                  </div>
                </div>

                {/* BUDGET UTILIZATION */}
                <div className="rounded-2xl border border-[#e5e8dc] bg-white p-6">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-bold">Budget utilization</h3>
                    <span className="text-sm font-semibold text-[#315d48]">
                      {result.budgetUtilizationPercent}% estimated
                    </span>
                  </div>

                  <div className="mt-4 h-3 overflow-hidden rounded-full bg-[#edf0e8]">
                    <div
                      className="h-full rounded-full bg-[#47765e] transition-all"
                      style={{
                        width: `${Math.min(100, result.budgetUtilizationPercent)}%`,
                      }}
                    />
                  </div>

                  <div className="mt-3 flex justify-between text-xs text-gray-500">
                    <span>0%</span>
                    <span>Preferred: 60–80%</span>
                    <span>100%</span>
                  </div>

                  <p className="mt-4 text-sm text-gray-600">
                    Preferred spending range: ₹
                    {result.preferredBudgetMin.toLocaleString('en-IN')}–₹
                    {result.preferredBudgetMax.toLocaleString('en-IN')}.
                    {result.budgetTargetMet
                      ? ' Your estimated spending falls within this range.'
                      : ' The planner prioritizes suitable experiences rather than adding unnecessary spending.'}
                  </p>
                </div>

                {/* PERSONALIZED OVERVIEW */}
                <div className="rounded-2xl border border-[#e5e8dc] bg-[#eef3eb] p-6">
                  <h3 className="font-bold">Your Saturday at a glance</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#456052]">
                    {planSummary}
                  </p>
                </div>

                {/* ITINERARY */}
                <div className="rounded-2xl border border-[#e5e8dc] bg-white p-6">
                  <h3 className="text-xl font-bold">Your itinerary</h3>

                  {result.plan.length === 0 ? (
                    <div className="mt-5 rounded-xl bg-[#fafbf8] p-5 text-gray-600">
                      We couldn't find a suitable itinerary for these
                      preferences. Try another supported city or adjust
                      your budget, interests or available time.
                    </div>
                  ) : (
                    <div className="mt-6 space-y-5">
                      {result.plan.map((item, index) => (
                        <div key={item.id}>
                          {/* TRAVEL BETWEEN PREVIOUS STOP AND THIS STOP */}
                          {index > 0 && (
                            <div className="mb-4 ml-5 flex items-center gap-3 border-l-2 border-dashed border-[#cbd9cc] py-2 pl-5">
                              <span className="text-sm">🚗</span>
                              <div>
                                <p className="text-xs font-semibold text-[#47765e]">
                                  Travel to next stop
                                </p>
                                <p className="text-xs text-gray-500">
                                  Approx. {item.travelDistanceFromPreviousKm.toFixed(1)} km
                                  {' · '}
                                  {formatDuration(item.travelMinutesFromPrevious)}
                                </p>
                              </div>
                            </div>
                          )}

                          <div className="flex gap-4">
                            <div className="flex flex-col items-center">
                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#e9f0e9] text-lg">
                                {item.type === 'food' ? '🍽️' : '🌿'}
                              </div>
                            </div>

                            <div className="min-w-0 flex-1 pb-2">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <h4 className="font-bold">{item.name}</h4>
                                <span className="text-sm font-semibold text-[#315d48]">
                                  {item.startTime}
                                </span>
                              </div>

                              <p className="mt-1 text-sm text-gray-500">
                                {item.description}
                              </p>

                              <p className="mt-2 text-sm text-[#315d48]">
                                {item.reason}
                              </p>

                              <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-500">
                                <span>
                                  ⏱ {formatDuration(item.durationMinutes)}
                                </span>
                                <span>
                                  ₹{item.minCost.toLocaleString('en-IN')}–₹
                                  {item.maxCost.toLocaleString('en-IN')}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* VALIDATION */}
                <div className="rounded-2xl border border-[#e5e8dc] bg-white p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="text-lg font-bold">Plan validation</h3>
                    <span
                      className={`rounded-full px-4 py-2 text-sm font-semibold ${
                        result.validation.valid
                          ? 'bg-[#e9f0e9] text-[#315d48]'
                          : 'bg-red-50 text-red-700'
                      }`}
                    >
                      {result.validation.valid
                        ? '✓ Plan validated'
                        : 'Needs attention'}
                    </span>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {validationChecks.map(({ label, passed }) => (
                      <div
                        key={label}
                        className="rounded-xl bg-[#fafbf8] p-3 text-sm"
                      >
                        <span
                          className={
                            passed ? 'text-[#315d48]' : 'text-red-600'
                          }
                        >
                          {passed ? '✓' : '✕'} {label}
                        </span>
                      </div>
                    ))}
                  </div>

                  <ul className="mt-4 space-y-2 text-sm text-gray-600">
                    {result.validation.messages.map((message, index) => (
                      <li key={index}>• {message}</li>
                    ))}
                  </ul>
                </div>
              </section>
            )}
          </div>

          {/* RIGHT COLUMN: EXPLANATION AND EXECUTION TRACE */}
          <aside className="flex min-w-0 flex-col gap-5 lg:sticky lg:top-6">
            <div className="rounded-3xl bg-[#315d48] p-8 text-white">
              <span className="text-3xl">🌿</span>
              <h3 className="mt-5 text-2xl font-bold">
                Less planning.
                <br />
                More living.
              </h3>
              <p className="mt-3 leading-relaxed text-green-100">
                A good Saturday doesn't need to be expensive or complicated.
                Let's make every hour count.
              </p>
              <div className="mt-8 border-t border-white/20 pt-5">
                <p className="text-sm text-green-100">
                  Designed around you
                </p>
                <p className="mt-1 font-semibold">
                  Your time · Your budget · Your mood
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-[#e5e8dc] bg-white p-6">
              <h3 className="font-bold">How Saturdayly works</h3>

              <div className="mt-5 space-y-5">
                {[
                  [
                    '01',
                    'Understand your preferences',
                    'We process your budget, interests, mood and constraints.',
                  ],
                  [
                    '02',
                    'Explore suitable options',
                    'Separate tools filter and rank matching activities and food options.',
                  ],
                  [
                    '03',
                    'Build your itinerary',
                    'We compare combinations, estimate travel and calculate cost ranges.',
                  ],
                  [
                    '04',
                    'Validate your plan',
                    'The final itinerary is checked against budget, time and constraints.',
                  ],
                ].map(([number, title, description]) => (
                  <div key={number} className="flex gap-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e9f0e9] text-sm font-bold text-[#315d48]">
                      {number}
                    </span>
                    <div>
                      <h4 className="text-sm font-semibold">{title}</h4>
                      <p className="mt-1 text-sm leading-relaxed text-gray-500">
                        {description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* EXECUTION TRACE */}
            <div className="rounded-3xl border border-[#e5e8dc] bg-white p-6">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-bold">
                  Planner execution trace
                </h3>
                <span className="rounded-full bg-[#e9f0e9] px-3 py-1 text-xs font-semibold text-[#315d48]">
                  {result ? 'Completed' : 'Ready'}
                </span>
              </div>

              <p className="mt-1 text-sm text-gray-500">
                {result
                  ? 'The steps executed to generate your itinerary.'
                  : 'The planner workflow will appear here after you generate a plan.'}
              </p>

              {result ? (
                <div className="mt-5 space-y-4">
                  {result.trace.map((step, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 text-sm"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#e9f0e9] text-xs font-bold text-[#315d48]">
                        {index + 1}
                      </span>
                      <p className="pt-1 leading-relaxed text-gray-600">
                        {step.replace(/^\d+\.\s*/, '')}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-5 rounded-xl bg-[#fafbf8] p-5 text-sm text-gray-500">
                  <span className="text-xl">⚙️</span>
                  <p className="mt-2">
                    Waiting for your preferences. Click{' '}
                    <span className="font-semibold text-[#315d48]">
                      Plan My Saturday
                    </span>{' '}
                    to start the planner.
                  </p>
                </div>
              )}
            </div>
          </aside>
        </div>

        <p className="mt-10 text-center text-xs text-gray-500">
          Activity options, prices and travel times use illustrative
          estimates, not live venue availability, verified current prices
          or real-time traffic data.
        </p>
      </section>
    </main>
  )
}

export default App
