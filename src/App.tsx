import { useState, type FormEvent } from 'react'
import { runPlanner } from './utils/planner'
import { activities } from './data/mockData'

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

const supportedCities = [
  'Bangalore',
  'Hyderabad',
  'Chennai',
  'New Delhi',
]

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  if (hours === 0) return `${remainingMinutes} min`
  if (remainingMinutes === 0) return `${hours}h`

  return `${hours}h ${remainingMinutes}m`
}

function formatNaturalList(items: string[]): string {
  if (items.length === 0) return ''
  if (items.length === 1) return items[0]
  if (items.length === 2) return `${items[0]} and ${items[1]}`

  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`
}

function buildPlanSummary(
  result: PlannerResult,
  input: PlannerInput,
): string {
  if (result.plan.length === 0) {
    if (!supportedCities.includes(input.city)) {
      return `Saturdayly currently supports ${formatNaturalList(supportedCities)}. Choose one of these cities to generate your itinerary.`
    }

    return "We couldn't find a suitable combination for your preferences, time and budget. Try adjusting your available time, budget or an optional constraint."
  }

  const stopNames = result.plan.map((item) => item.name)

  const routeSummary =
    stopNames.length === 1
      ? `Your Saturday starts at ${stopNames[0]}.`
      : `Start at ${stopNames[0]}, then continue to ${formatNaturalList(stopNames.slice(1))}.`

  // Find the interests actually covered by the selected stops.
  const covered = new Set<Interest>()

  result.plan.forEach((item) => {
    if (item.type === 'activity') {
      const activity = activities.find((option) => option.id === item.id)

      activity?.interests.forEach((interest) => {
        if (input.interests.includes(interest)) {
          covered.add(interest)
        }
      })
    }

    if (item.type === 'food' && input.interests.includes('Food')) {
      covered.add('Food')
    }
  })

  const matchingInterests = input.interests.filter((interest) =>
    covered.has(interest),
  )

  const interestSummary =
    input.interests.length === 0
      ? 'The plan is based on your mood and other preferences.'
      : matchingInterests.length > 0
        ? `The selected stops match ${matchingInterests.length} of your ${input.interests.length} interests: ${formatNaturalList(matchingInterests)}.`
        : 'The selected stops do not directly match your chosen interests.'

  // Check whether selected activities actually match the selected mood.
  const activityItems = result.plan.filter((item) => item.type === 'activity')

  const moodMatches = activityItems.filter((item) => {
    const activity = activities.find((option) => option.id === item.id)
    return activity?.moods.includes(input.mood) ?? false
  }).length

  const moodSummary =
    activityItems.length === 0
      ? ''
      : moodMatches === activityItems.length
        ? `The activities also fit your ${input.mood.toLowerCase()} mood.`
        : moodMatches > 0
          ? `${moodMatches} of ${activityItems.length} activities fit your ${input.mood.toLowerCase()} mood.`
          : `The activities prioritize your interest matches rather than a direct match for your ${input.mood.toLowerCase()} mood.`

  const spendingSummary =
    `Estimated spending is ₹${result.minTotalCost.toLocaleString('en-IN')}–₹${result.maxTotalCost.toLocaleString('en-IN')}.`

  return [routeSummary, interestSummary, moodSummary, spendingSummary]
    .filter(Boolean)
    .join(' ')
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
  const [submittedInput, setSubmittedInput] =
    useState<PlannerInput | null>(null)

  // Gemini writes an optional summary after the rule-based planner
  // has generated and validated the itinerary.
  const [aiSummary, setAiSummary] = useState<string | null>(null)
  const [summaryLoading, setSummaryLoading] = useState(false)
  const [summaryFallback, setSummaryFallback] = useState(false)

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
    setSubmittedInput(null)
    setAiSummary(null)
    setSummaryLoading(false)
    setSummaryFallback(false)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const input: PlannerInput = {
      city,
      budget,
      hours: Number(hours),
      mood,
      interests: [...selectedInterests],
      constraints,
    }

    // The planner always runs first. Gemini only summarizes its result;
    // it never chooses activities or changes validation.
    const generatedResult = runPlanner(input)

    setResult(generatedResult)
    setSubmittedInput(input)
    setAiSummary(null)
    setSummaryFallback(false)

    // There is nothing to summarize when no itinerary was generated.
    if (generatedResult.plan.length === 0) {
      setSummaryLoading(false)
      return
    }

    setSummaryLoading(true)

    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          city: input.city,
          mood: input.mood,
          interests: input.interests,
          constraints: input.constraints,
          budget: input.budget,
          minTotalCost: generatedResult.minTotalCost,
          maxTotalCost: generatedResult.maxTotalCost,
          totalDuration: generatedResult.totalDuration,
          plan: generatedResult.plan,
        }),
      })

      const data = (await response.json()) as {
        summary?: string
        error?: string
      }

      if (!response.ok || typeof data.summary !== 'string' || !data.summary.trim()) {
        throw new Error(data.error || 'Gemini summary could not be generated.')
      }

      setAiSummary(data.summary.trim())
    } catch (error) {
      console.error('AI summary unavailable:', error)
      setSummaryFallback(true)
    } finally {
      setSummaryLoading(false)
    }
  }

  // Keep the preferences used to generate the displayed plan.
  const activeInput = submittedInput
  const isSupportedCity =
    activeInput !== null && supportedCities.includes(activeInput.city)

  // --------------------------------------------------
  // RECOMMENDATION BREAKDOWN
  // --------------------------------------------------

  const selectedActivities =
    result?.plan.filter((item) => item.type === 'activity') ?? []

  const coveredInterests = new Set<Interest>()

  if (result && activeInput) {
    result.plan.forEach((item) => {
      if (item.type === 'activity') {
        const activity = activities.find((option) => option.id === item.id)

        activity?.interests.forEach((interest) => {
          if (activeInput.interests.includes(interest)) {
            coveredInterests.add(interest)
          }
        })
      }

      if (item.type === 'food' && activeInput.interests.includes('Food')) {
        coveredInterests.add('Food')
      }
    })
  }

  const interestCoverageText =
    activeInput && activeInput.interests.length > 0
      ? `${coveredInterests.size} of ${activeInput.interests.length}`
      : 'No interests selected'

  const moodMatchedActivities = selectedActivities.filter((item) => {
    const activity = activities.find((option) => option.id === item.id)
    return activity?.moods.includes(activeInput?.mood ?? mood) ?? false
  })

  const moodMatchText =
    selectedActivities.length > 0
      ? `${moodMatchedActivities.length} of ${selectedActivities.length}`
      : 'Not available'

  // --------------------------------------------------
  // SUMMARY AND BUDGET TRADE-OFF
  // --------------------------------------------------

  const planSummary =
    result && activeInput ? buildPlanSummary(result, activeInput) : ''

  const remainingBudgetMin =
    activeInput && result
      ? Math.max(0, activeInput.budget - result.maxTotalCost)
      : 0

  const remainingBudgetMax =
    activeInput && result
      ? Math.max(0, activeInput.budget - result.minTotalCost)
      : 0

  const budgetTradeoff =
    activeInput && result
      ? result.plan.length === 0
        ? 'No spending recommendation is available because a suitable itinerary could not be generated.'
        : result.budgetUtilizationPercent < 60
          ? 'The estimated spending is well below your budget. The planner chose suitable, lower-cost experiences instead of adding unnecessary activities just to spend more.'
          : 'The selected experiences fit your preferences while keeping the upper estimated cost within your budget.'
      : ''

  // --------------------------------------------------
  // VALIDATION
  // --------------------------------------------------

  const validationChecks =
    result && result.plan.length > 0
      ? [
          { label: 'Budget', passed: result.validation.budgetValid },
          { label: 'Available time', passed: result.validation.timeValid },
          { label: 'Constraints', passed: result.validation.constraintsValid },
          { label: 'Travel', passed: result.validation.travelValid },
        ]
      : []

  return (
    <main className="min-h-screen bg-[#f7f7f0] text-[#183b32]">
      <header className="border-b border-[#e5e8dc] bg-white/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Saturdayly<span className="text-[#d58a4b">.</span>
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
          {/* LEFT COLUMN */}
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
                    {supportedCities.map((cityName) => (
                      <option key={cityName} value={cityName}>
                        {cityName}
                      </option>
                    ))}
                    <option value="Other city">
                      Other city (not supported yet)
                    </option>
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
                  disabled={!Number.isFinite(budget) || budget <= 0}
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
            {result && activeInput && (
              <section className="space-y-6">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-widest text-[#b87940]">
                    Your personalized plan
                  </p>
                  <h2 className="mt-2 text-3xl font-bold">
                    Your Saturday in {activeInput.city}
                  </h2>
                </div>

                {/* 1. ITINERARY FIRST */}
                <div className="rounded-2xl border border-[#e5e8dc] bg-white p-6">
                  <h3 className="text-xl font-bold">Your itinerary</h3>

                  {result.plan.length === 0 ? (
                    <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-5">
                      <p className="font-semibold text-amber-900">
                        {isSupportedCity
                          ? 'No suitable itinerary found'
                          : `${activeInput.city} isn't supported yet`}
                      </p>

                      {isSupportedCity ? (
                        <>
                          <p className="mt-2 text-sm leading-relaxed text-amber-800">
                            We couldn't find a combination that fits your
                            current preferences, available time and budget.
                          </p>
                          <p className="mt-2 text-sm text-amber-800">
                            Try increasing your available time or budget, or
                            relaxing an optional preference.
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="mt-2 text-sm leading-relaxed text-amber-800">
                            Saturdayly currently creates itineraries for
                            Bangalore, Hyderabad, Chennai and New Delhi.
                          </p>
                          <p className="mt-2 text-sm text-amber-800">
                            Choose one of these cities to generate a plan.
                          </p>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="mt-6 space-y-5">
                      {result.plan.map((item, index) => (
                        <div key={item.id}>
                          {/* TRAVEL BETWEEN STOPS */}
                          {index > 0 && (
                            <div className="mb-4 ml-5 flex items-center gap-3 border-l-2 border-dashed border-[#cbd9cc] py-2 pl-5">
                              <span className="text-sm">🚗</span>
                              <div>
                                <p className="text-xs font-semibold text-[#47765e]">
                                  Travel to next stop
                                </p>
                                <p className="text-xs text-gray-500">
                                  Approx.{' '}
                                  {item.travelDistanceFromPreviousKm.toFixed(1)} km
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

                {/* 2. SUMMARY */}
                <div className="rounded-2xl border border-[#e5e8dc] bg-[#eef3eb] p-6">
                  <h3 className="font-bold">Your Saturday at a glance</h3>

                  {result.plan.length > 0 && (
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-xl border border-[#e5e8dc] bg-white p-4">
                        <p className="text-xs text-gray-500">
                          Estimated spending
                        </p>
                        <p className="mt-2 text-xl font-bold">
                          ₹{result.minTotalCost.toLocaleString('en-IN')}–₹
                          {result.maxTotalCost.toLocaleString('en-IN')}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          Approximate total range
                        </p>
                      </div>

                      <div className="rounded-xl border border-[#e5e8dc] bg-white p-4">
                        <p className="text-xs text-gray-500">
                          Budget remaining
                        </p>
                        <p className="mt-2 text-xl font-bold">
                          ₹{remainingBudgetMin.toLocaleString('en-IN')}–₹
                          {remainingBudgetMax.toLocaleString('en-IN')}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          Approximate remaining range
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="mt-4">
                    {summaryLoading ? (
                      <p
                        role="status"
                        className="text-sm leading-relaxed text-[#456052]"
                      >
                        ✦ Putting together a short summary of your Saturday...
                      </p>
                    ) : (
                      <p className="text-sm leading-relaxed text-[#456052]">
                        {aiSummary ?? planSummary}
                      </p>
                    )}

                    <p className="mt-3 text-xs text-gray-500">
                      {summaryLoading
                        ? 'Generating with Gemini'
                        : aiSummary
                          ? '✦ AI-generated summary with Gemini'
                          : summaryFallback
                            ? 'AI summary is temporarily unavailable. Showing the planner summary instead.'
                            : 'Planner-generated summary'}
                    </p>
                  </div>
                </div>

                {/* 3. WHY THIS PLAN? */}
                {result.plan.length > 0 && (
                  <div className="rounded-2xl border border-[#e5e8dc] bg-white p-6">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-[#b87940]">
                        Recommendation breakdown
                      </p>
                      <h3 className="mt-2 text-xl font-bold">
                        Why this plan?
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Here's how your itinerary matches your preferences.
                      </p>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-[#fafbf8] p-4">
                        <p className="text-xs text-gray-500">
                          Interests covered
                        </p>
                        <p className="mt-2 text-xl font-bold text-[#315d48]">
                          {interestCoverageText}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          Selected interests matched
                        </p>
                      </div>

                      <div className="rounded-xl bg-[#fafbf8] p-4">
                        <p className="text-xs text-gray-500">
                          Mood compatibility
                        </p>
                        <p className="mt-2 text-xl font-bold text-[#315d48]">
                          {moodMatchText}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          Activities fit your mood
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 rounded-xl border border-[#e5e8dc] p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold">
                          Constraint check
                        </p>
                        <span
                          className={`text-sm font-semibold ${
                            result.validation.constraintsValid &&
                            result.validation.travelValid
                              ? 'text-[#315d48]'
                              : 'text-red-600'
                          }`}
                        >
                          {result.validation.constraintsValid &&
                          result.validation.travelValid
                            ? '✓ Passed'
                            : 'Needs review'}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-gray-600">
                        Dietary, crowd and travel preferences are checked
                        before the itinerary is presented.
                      </p>
                    </div>

                    <div className="mt-4 rounded-xl bg-[#fafbf8] p-4">
                      <p className="text-sm font-semibold">
                        The trade-off considered
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-gray-600">
                        {budgetTradeoff}
                      </p>
                    </div>
                  </div>
                )}

                {/* 4. PLAN VALIDATION */}
                <div className="rounded-2xl border border-[#e5e8dc] bg-white p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="text-lg font-bold">Plan validation</h3>
                    <span
                      className={`rounded-full px-4 py-2 text-sm font-semibold ${
                        result.validation.valid && result.plan.length > 0
                          ? 'bg-[#e9f0e9] text-[#315d48]'
                          : 'bg-red-50 text-red-700'
                      }`}
                    >
                      {result.validation.valid && result.plan.length > 0
                        ? '✓ Plan validated'
                        : 'Needs attention'}
                    </span>
                  </div>

                  {result.plan.length === 0 ? (
                    <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
                      <p className="text-sm font-semibold text-amber-900">
                        {isSupportedCity
                          ? 'Validation could not be completed because no suitable itinerary was generated.'
                          : 'Validation was not run because this city is not currently supported.'}
                      </p>

                      {isSupportedCity ? (
                        <ul className="mt-3 space-y-2 text-sm text-amber-800">
                          {result.validation.messages.map((message, index) => (
                            <li key={index}>• {message}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="mt-3 text-sm text-amber-800">
                          Please choose one of these supported cities:{' '}
                          {supportedCities.join(', ')}.
                        </p>
                      )}
                    </div>
                  ) : (
                    <>
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
                    </>
                  )}
                </div>
              </section>
            )}
          </div>

          {/* RIGHT COLUMN */}
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
