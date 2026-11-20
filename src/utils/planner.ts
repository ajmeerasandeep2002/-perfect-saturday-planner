
import type {
  ActivityOption,
  FoodOption,
  PlanItem,
  PlannerInput,
  PlannerResult,
  UserPreferences,
  ValidationResult,
} from '../types/planner'

import { activities, foodOptions } from '../data/mockData'

// --------------------------------------------------
// COST ESTIMATION HELPERS
// --------------------------------------------------

interface CostRange {
  minCost: number
  maxCost: number
  cost: number
}

function roundToTen(value: number): number {
  return Math.round(value / 10) * 10
}

// Most activity and food prices are estimates, not fixed quotes.
// We use an 80%-120% range around the base estimate.

function getCostRange(baseCost: number): CostRange {
  if (baseCost <= 0) {
    return { minCost: 0, maxCost: 0, cost: 0 }
  }

  const minCost = Math.max(0, roundToTen(baseCost * 0.8))
  const maxCost = Math.max(minCost, roundToTen(baseCost * 1.2))

  return {
    minCost,
    maxCost,
    cost: baseCost,
  }
}

// Shopping estimates depend on the user's budget because
// shopping spend can vary much more than an entry ticket.

function getEstimatedActivityCost(
  activity: ActivityOption,
  budget: number,
): number {
  if (activity.category !== 'Shopping') {
    return activity.cost
  }

  return Math.min(
    activity.cost,
    budget,
    Math.max(500, Math.round(budget * 0.3)),
  )
}

// --------------------------------------------------
// TRAVEL ESTIMATION HELPERS
// --------------------------------------------------

interface TravelEstimate {
  distanceKm: number
  minutes: number
}

// Haversine formula: approximate straight-line distance between coordinates.

function getStraightLineDistanceKm(
  from: ActivityOption['coordinates'],
  to: ActivityOption['coordinates'],
): number {
  const earthRadiusKm = 6371

  const toRadians = (degrees: number) => (degrees * Math.PI) / 180

  const latitudeDifference = toRadians(
    to.latitude - from.latitude,
  )

  const longitudeDifference = toRadians(
    to.longitude - from.longitude,
  )

  const fromLatitude = toRadians(from.latitude)
  const toLatitude = toRadians(to.latitude)

  const a =
    Math.sin(latitudeDifference / 2) ** 2 +
    Math.cos(fromLatitude) *
      Math.cos(toLatitude) *
      Math.sin(longitudeDifference / 2) ** 2

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return earthRadiusKm * c
}

// Road distance is estimated using a multiplier because road routes
// are usually longer than straight-line distances.
// Travel time includes a small allowance for local city movement.

function estimateTravel(
  from: ActivityOption['coordinates'],
  to: ActivityOption['coordinates'],
): TravelEstimate {
  const straightLineKm = getStraightLineDistanceKm(from, to)

  const roadDistanceKm = straightLineKm * 1.25

  if (roadDistanceKm < 0.3) {
    return {
      distanceKm: Math.round(roadDistanceKm * 10) / 10,
      minutes: 5,
    }
  }

  const estimatedMinutes = Math.round(
    (roadDistanceKm / 22) * 60 + 5,
  )

  return {
    distanceKm: Math.round(roadDistanceKm * 10) / 10,
    minutes: Math.max(5, estimatedMinutes),
  }
}

// --------------------------------------------------
// TOOL 1: Parse and normalize user preferences
// --------------------------------------------------

export function parseUserPreferences(
  input: PlannerInput,
): UserPreferences {
  const constraints = input.constraints.toLowerCase()

  const nonVegetarian =
    /\b(non[-\s]?vegetarian|non[-\s]?veg|nonveg)\b/.test(
      constraints,
    )

  const vegetarian =
    !nonVegetarian &&
    /\b(vegetarian|veg only|veg food|pure veg)\b/.test(
      constraints,
    )

  return {
    ...input,
    city: input.city.trim(),
    vegetarian,
    nonVegetarian,
    avoidCrowds:
      /\b(avoid crowds|no crowds|less crowded|quiet places)\b/.test(
        constraints,
      ),
    noLongTravel:
      /\b(no long travel|avoid long travel|nearby places)\b/.test(
        constraints,
      ),
  }
}

// --------------------------------------------------
// TOOL 2: Find activities matching the user's preferences
// --------------------------------------------------

export function getActivityOptions(
  preferences: UserPreferences,
): ActivityOption[] {
  const cityActivities = activities.filter(
    (activity) =>
      activity.city.toLowerCase() === preferences.city.toLowerCase(),
  )

  const availableActivities = cityActivities.filter(
    (activity) =>
      !preferences.avoidCrowds || activity.crowdLevel !== 'high',
  )

  const rankedActivities = availableActivities
    .map((activity) => {
      const matchesMood = activity.moods.includes(preferences.mood)

      const matchingInterests = activity.interests.filter((interest) =>
        preferences.interests.includes(interest),
      )

      return {
        activity,
        score:
          (matchesMood ? 2 : 0) +
          matchingInterests.length * 3,
        matchesMood,
        matchesInterest: matchingInterests.length > 0,
      }
    })
    .filter(
      (item) =>
        item.matchesMood ||
        item.matchesInterest ||
        preferences.interests.length === 0,
    )
    .sort((a, b) => b.score - a.score)

  if (rankedActivities.length === 0) {
    return availableActivities
  }

  return rankedActivities.map((item) => item.activity)
}

// --------------------------------------------------
// TOOL 3: Find suitable food options
// --------------------------------------------------

export function getFoodOptions(
  preferences: UserPreferences,
  remainingBudget: number,
): FoodOption[] {
  return foodOptions.filter((food) => {
    const matchesCity =
      food.city.toLowerCase() === preferences.city.toLowerCase()

    const foodCostRange = getCostRange(food.cost)

    // Check the upper estimate, not just the base price.
    const matchesBudget = foodCostRange.maxCost <= remainingBudget

    const matchesDiet = preferences.vegetarian
      ? food.vegetarian
      : preferences.nonVegetarian
        ? !food.vegetarian
        : true

    const matchesCrowd =
      !preferences.avoidCrowds || food.crowdLevel !== 'high'

    return (
      matchesCity &&
      matchesBudget &&
      matchesDiet &&
      matchesCrowd
    )
  })
}

// --------------------------------------------------
// TOOL 4: Calculate estimated spending
// --------------------------------------------------

export function estimateCost(
  plan: PlanItem[],
  budget: number,
): { totalCost: number; remainingBudget: number } {
  const totalCost = plan.reduce(
    (total, item) => total + item.cost,
    0,
  )

  return {
    totalCost,
    remainingBudget: budget - totalCost,
  }
}

function estimateCostRange(plan: PlanItem[]): {
  minTotalCost: number
  maxTotalCost: number
} {
  return {
    minTotalCost: plan.reduce(
      (total, item) => total + item.minCost,
      0,
    ),
    maxTotalCost: plan.reduce(
      (total, item) => total + item.maxCost,
      0,
    ),
  }
}

// --------------------------------------------------
// TOOL 5: Validate the itinerary
// --------------------------------------------------

export function validatePlan(
  plan: PlanItem[],
  preferences: UserPreferences,
): ValidationResult {
  const { maxTotalCost } = estimateCostRange(plan)

  const totalDuration = plan.reduce(
    (total, item) =>
      total +
      item.durationMinutes +
      item.travelMinutesFromPrevious,
    0,
  )

  const budgetValid = maxTotalCost <= preferences.budget

  const timeValid = totalDuration <= preferences.hours * 60

  const constraintsValid = plan.every((item) => {
    if (item.type === 'food') {
      const food = foodOptions.find((option) => option.id === item.id)

      if (!food) return false

      if (preferences.vegetarian && !food.vegetarian) {
        return false
      }

      if (preferences.nonVegetarian && food.vegetarian) {
        return false
      }

      if (preferences.avoidCrowds && food.crowdLevel === 'high') {
        return false
      }
    }

    if (item.type === 'activity') {
      const activity = activities.find(
        (option) => option.id === item.id,
      )

      if (!activity) return false

      if (preferences.avoidCrowds && activity.crowdLevel === 'high') {
        return false
      }
    }

    return true
  })

  // If the user specifically asks to avoid long travel,
  // flag any individual journey estimated to exceed 30 minutes.

  const travelValid =
    !preferences.noLongTravel ||
    plan.every((item) => item.travelMinutesFromPrevious <= 30)

  const messages: string[] = []

  if (!budgetValid) {
    messages.push(
      'The upper end of the estimated spending range exceeds your budget.',
    )
  }

  if (!timeValid) {
    messages.push(
      'The plan, including estimated travel time, exceeds your available time.',
    )
  }

  if (!constraintsValid) {
    messages.push('The plan violates one or more of your constraints.')
  }

  if (!travelValid) {
    messages.push(
      'One or more journeys may take over 30 minutes. Consider choosing closer places.',
    )
  }

  if (messages.length === 0) {
    messages.push('Your Saturday plan passed all checks!')
  }

  return {
    valid:
      budgetValid &&
      timeValid &&
      constraintsValid &&
      travelValid,
    budgetValid,
    timeValid,
    constraintsValid,
    travelValid,
    messages,
  }
}

// --------------------------------------------------
// GENERAL HELPERS
// --------------------------------------------------

function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  const period = hours >= 12 ? 'PM' : 'AM'
  const displayHours = hours % 12 || 12

  return `${displayHours}:${String(mins).padStart(2, '0')} ${period}`
}

function getPermutations<T>(items: T[]): T[][] {
  if (items.length <= 1) {
    return [[...items]]
  }

  const result: T[][] = []

  items.forEach((item, index) => {
    const remaining = [
      ...items.slice(0, index),
      ...items.slice(index + 1),
    ]

    for (const permutation of getPermutations(remaining)) {
      result.push([item, ...permutation])
    }
  })

  return result
}

// --------------------------------------------------
// IMPROVED RECOMMENDATION EXPLANATIONS
// --------------------------------------------------

// Explain activity recommendations using the actual interest tags
// and mood compatibility of the selected activity.

function formatNaturalList(items: string[]): string {
  if (items.length <= 1) return items[0] ?? ''

  if (items.length === 2) {
    return `${items[0]} and ${items[1]}`
  }

  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`
}

function getActivityRecommendationReason(
  activity: ActivityOption,
  preferences: UserPreferences,
): string {
  const matchingInterests = preferences.interests.filter(
    (interest) => activity.interests.includes(interest),
  )

  const matchesMood = activity.moods.includes(preferences.mood)

  const explanations: string[] = []

  if (matchingInterests.length === 1) {
    explanations.push(
      `matches your interest in ${matchingInterests[0]}`,
    )
  } else if (matchingInterests.length > 1) {
    explanations.push(
      `matches your interests in ${formatNaturalList(matchingInterests)}`,
    )
  }

  if (matchesMood) {
    explanations.push(
      `fits your ${preferences.mood.toLowerCase()} mood`,
    )
  }

  if (explanations.length > 0) {
    return `Recommended because it ${formatNaturalList(explanations)}.`
  }

  return 'Recommended as an available experience that fits your city, time and budget.'
}

// Explain food recommendations using the user's actual food,
// dietary and crowd preferences.

function getFoodRecommendationReason(
  food: FoodOption,
  preferences: UserPreferences,
): string {
  const explanations: string[] = []

  if (preferences.interests.includes('Food')) {
    explanations.push('matches your interest in Food')
  }

  if (preferences.vegetarian) {
    explanations.push('fits your vegetarian preference')
  } else if (preferences.nonVegetarian) {
    explanations.push('fits your non-vegetarian preference')
  }

  if (preferences.avoidCrowds && food.crowdLevel !== 'high') {
    explanations.push('suits your preference for less-crowded places')
  }

  if (explanations.length > 0) {
    return `Recommended because it ${formatNaturalList(explanations)}.`
  }

  return 'Recommended as a food stop that fits your available budget and schedule.'
}

// --------------------------------------------------
// TOOL 6: Build the final Saturday itinerary
// --------------------------------------------------

export function generateFinalPlan(
  preferences: UserPreferences,
  activityOptions: ActivityOption[],
  availableFoodOptions: FoodOption[],
): PlanItem[] {
  const maxMinutes = preferences.hours * 60
  const maxBudget = preferences.budget

  type Candidate = {
    activities: ActivityOption[]
    activityCosts: CostRange[]
    food?: FoodOption
    foodCost?: CostRange
    travelLegs: TravelEstimate[]
    duration: number
    midpointCost: number
    minCost: number
    maxCost: number
    interestCoverage: number
    variety: number
    score: number
  }

  const combinations: ActivityOption[][] = []

  function buildCombinations(
    startIndex: number,
    selected: ActivityOption[],
  ) {
    if (selected.length > 0) {
      combinations.push([...selected])
    }

    if (selected.length === 3) return

    for (let i = startIndex; i < activityOptions.length; i++) {
      selected.push(activityOptions[i])
      buildCombinations(i + 1, selected)
      selected.pop()
    }
  }

  buildCombinations(0, [])

  function createCandidate(
    selectedActivities: ActivityOption[],
    food?: FoodOption,
  ): Candidate {
    const coveredInterests = new Set<string>()
    const categories = new Set<string>()

    const activityCosts = selectedActivities.map((activity) => {
      const baseCost = getEstimatedActivityCost(
        activity,
        maxBudget,
      )

      return getCostRange(baseCost)
    })

    for (const activity of selectedActivities) {
      categories.add(activity.category)

      for (const interest of activity.interests) {
        if (preferences.interests.includes(interest)) {
          coveredInterests.add(interest)
        }
      }
    }

    // A selected food option also covers the Food interest.
    if (food && preferences.interests.includes('Food')) {
      coveredInterests.add('Food')
    }

    const foodCost = food ? getCostRange(food.cost) : undefined

    // Calculate travel between consecutive activities,
    // followed by the food stop if one was selected.

    const stops = [
      ...selectedActivities,
      ...(food ? [food] : []),
    ]

    const travelLegs: TravelEstimate[] = []

    for (let i = 0; i < stops.length; i++) {
      if (i === 0) {
        // The user's starting location is not known.
        travelLegs.push({ distanceKm: 0, minutes: 0 })
      } else {
        travelLegs.push(
          estimateTravel(
            stops[i - 1].coordinates,
            stops[i].coordinates,
          ),
        )
      }
    }

    const totalTravelMinutes = travelLegs.reduce(
      (total, leg) => total + leg.minutes,
      0,
    )

    const stopDuration =
      selectedActivities.reduce(
        (total, activity) => total + activity.durationMinutes,
        0,
      ) + (food?.durationMinutes ?? 0)

    const duration = stopDuration + totalTravelMinutes

    const minCost =
      activityCosts.reduce(
        (total, range) => total + range.minCost,
        0,
      ) + (foodCost?.minCost ?? 0)

    const maxCost =
      activityCosts.reduce(
        (total, range) => total + range.maxCost,
        0,
      ) + (foodCost?.maxCost ?? 0)

    const midpointCost =
      activityCosts.reduce(
        (total, range) => total + range.cost,
        0,
      ) + (foodCost?.cost ?? 0)

    // --------------------------------------------------
    // CANDIDATE SCORING
    // --------------------------------------------------

    const interestCoverage = coveredInterests.size
    const variety = categories.size

    // Reward plans that cover a higher proportion of
    // the user's selected interests.

    const interestScore =
      preferences.interests.length > 0
        ? (interestCoverage / preferences.interests.length) * 100
        : 0

    // Reward activities that genuinely match the selected mood.

    const moodMatches = selectedActivities.filter((activity) =>
      activity.moods.includes(preferences.mood),
    ).length

    const moodScore =
      selectedActivities.length > 0
        ? (moodMatches / selectedActivities.length) * 20
        : 0

    // Give a small reward for variety without encouraging
    // unnecessary additional activities.

    const varietyScore = variety * 5

    // Reward a real food stop when Food is one of the
    // user's selected interests.

    const foodScore =
      preferences.interests.includes('Food') && food ? 12 : 0

    // Treat 60%-80% as the preferred budget utilization range.
    // It improves the score but is not a compulsory spending target.

    const utilization =
      maxBudget > 0 ? (midpointCost / maxBudget) * 100 : 0

        
    const budgetFit =
      utilization < 60
        ? (utilization / 60) * 30
        : utilization <= 80
          ? 30
          : Math.max(0, 30 - (utilization - 80) * 1.5)


    // Prefer shorter journeys, especially when the user
    // specifically requests nearby places.

    const travelPenalty =
      totalTravelMinutes * (preferences.noLongTravel ? 1.2 : 0.6)

    const score =
      interestScore +
      moodScore +
      varietyScore +
      foodScore +
      budgetFit -
      travelPenalty

    return {
      activities: selectedActivities,
      activityCosts,
      food,
      foodCost,
      travelLegs,
      duration,
      midpointCost,
      minCost,
      maxCost,
      interestCoverage,
      variety,
      score,
    }
  }

  function isBetter(
    candidate: Candidate,
    currentBest: Candidate | null,
  ): boolean {
    if (!currentBest) return true

    return candidate.score > currentBest.score
  }

  let bestCandidate: Candidate | null = null

  // Try different activity orders so nearby stops are preferred.
  // The first stop has no travel estimate because the user's
  // starting location is not known.

  for (const combination of combinations) {
    const activityOrders = getPermutations(combination)

    for (const orderedActivities of activityOrders) {
      const candidates = [
        createCandidate(orderedActivities),
        ...availableFoodOptions.map((food) =>
          createCandidate(orderedActivities, food),
        ),
      ]

      for (const candidate of candidates) {
        // Reject plans that exceed the available time or budget.
        // The upper end of the estimated cost range must fit.

        if (
          candidate.duration > maxMinutes ||
          candidate.maxCost > maxBudget
        ) {
          continue
        }

        // Enforce the no-long-travel preference during selection.
        // Do not select a plan containing any journey over 30 minutes.

        const violatesTravelPreference =
          preferences.noLongTravel &&
          candidate.travelLegs.some(
            (leg, index) => index > 0 && leg.minutes > 30,
          )

        if (violatesTravelPreference) {
          continue
        }

        if (isBetter(candidate, bestCandidate)) {
          bestCandidate = candidate
        }
      }
    }
  }

  if (!bestCandidate) return []

  // --------------------------------------------------
  // BUILD THE FINAL ITINERARY
  // --------------------------------------------------

  const plan: PlanItem[] = []
  let currentTime = 10 * 60

  bestCandidate.activities.forEach((activity, index) => {
    const travel = bestCandidate!.travelLegs[index]
    currentTime += travel.minutes

    const reason = getActivityRecommendationReason(
      activity,
      preferences,
    )

    const costRange = bestCandidate!.activityCosts[index]

    plan.push({
      id: activity.id,
      name: activity.name,
      type: 'activity',
      startTime: formatTime(currentTime),
      durationMinutes: activity.durationMinutes,
      cost: costRange.cost,
      minCost: costRange.minCost,
      maxCost: costRange.maxCost,
      description: activity.description,
      reason,
      travelDistanceFromPreviousKm: travel.distanceKm,
      travelMinutesFromPrevious: travel.minutes,
    })

    currentTime += activity.durationMinutes
  })

  // Add the selected food stop after the activities.

  if (bestCandidate.food && bestCandidate.foodCost) {
    const food = bestCandidate.food
    const foodIndex = bestCandidate.activities.length
    const travel = bestCandidate.travelLegs[foodIndex]

    currentTime += travel.minutes

    plan.push({
      id: food.id,
      name: food.name,
      type: 'food',
      startTime: formatTime(currentTime),
      durationMinutes: food.durationMinutes,
      cost: bestCandidate.foodCost.cost,
      minCost: bestCandidate.foodCost.minCost,
      maxCost: bestCandidate.foodCost.maxCost,
      description: food.description,
      reason: getFoodRecommendationReason(food, preferences),
      travelDistanceFromPreviousKm: travel.distanceKm,
      travelMinutesFromPrevious: travel.minutes,
    })
  }

  return plan
}

// --------------------------------------------------
// TOOL 7: Run the planner and record its execution trace
// --------------------------------------------------

export function runPlanner(input: PlannerInput): PlannerResult {
  const trace: string[] = []

  trace.push('1. Parsing and normalizing user preferences')
  const preferences = parseUserPreferences(input)

  trace.push(`2. Finding matching activities in ${preferences.city}`)
  const activityOptions = getActivityOptions(preferences)
  trace.push(`   Found ${activityOptions.length} suitable activities`)

  trace.push('3. Filtering food options by budget and dietary preferences')
  const availableFoodOptions = getFoodOptions(
    preferences,
    preferences.budget,
  )
  trace.push(`   Found ${availableFoodOptions.length} suitable food options`)

  trace.push(
    '4. Comparing activity combinations, travel estimates and cost ranges',
  )

  const plan = generateFinalPlan(
    preferences,
    activityOptions,
    availableFoodOptions,
  )

  trace.push('5. Calculating estimated spending and remaining budget')

  const { totalCost, remainingBudget } = estimateCost(
    plan,
    preferences.budget,
  )

  const { minTotalCost, maxTotalCost } = estimateCostRange(plan)

  trace.push('6. Validating budget, available time, travel and constraints')

  const validation = validatePlan(plan, preferences)

  if (plan.length === 0) {
    validation.valid = false

    validation.messages = [
      'No suitable itinerary could be generated with the current inputs.',
      'Try increasing your available time or budget, or relaxing one optional preference.',
    ]
  }
  const totalActivityDuration = plan.reduce(
    (total, item) => total + item.durationMinutes,
    0,
  )

  const totalTravelMinutes = plan.reduce(
    (total, item) => total + item.travelMinutesFromPrevious,
    0,
  )

  const totalTravelDistanceKm = plan.reduce(
    (total, item) => total + item.travelDistanceFromPreviousKm,
    0,
  )

  const totalDuration =
    totalActivityDuration + totalTravelMinutes

  const preferredBudgetMin = Math.round(preferences.budget * 0.6)
  const preferredBudgetMax = Math.round(preferences.budget * 0.8)

  const budgetUtilizationPercent =
    preferences.budget > 0
      ? Math.round((totalCost / preferences.budget) * 100)
      : 0

  const budgetTargetMet =
    budgetUtilizationPercent >= 60 &&
    budgetUtilizationPercent <= 80

  trace.push(
    validation.valid
      ? '7. Planner completed successfully'
      : '7. Planner completed with warnings',
  )

  return {
    plan,
    totalCost,
    remainingBudget,
    minTotalCost,
    maxTotalCost,
    totalDuration,
    totalActivityDuration,
    totalTravelMinutes,
    totalTravelDistanceKm,
    preferredBudgetMin,
    preferredBudgetMax,
    budgetUtilizationPercent,
    budgetTargetMet,
    validation,
    trace,
  }
}
