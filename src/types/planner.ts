
export type Mood =
  | 'Relaxed'
  | 'Adventurous'
  | 'Social'
  | 'Tired but Fun'
  | 'Productive'
  | 'Curious'

export type Interest =
  | 'Food'
  | 'Music'
  | 'Nature'
  | 'Walking'
  | 'Art'
  | 'Movies'
  | 'Shopping'
  | 'Adventure'
  | 'Relaxation'
  | 'Social'
  | 'Culture'

// Approximate geographical location of an activity or restaurant.
export interface Coordinates {
  latitude: number
  longitude: number
}

export interface PlannerInput {
  city: string
  budget: number
  hours: number
  mood: Mood
  interests: Interest[]
  constraints: string
}

export interface UserPreferences extends PlannerInput {
  vegetarian: boolean
  nonVegetarian: boolean
  avoidCrowds: boolean
  noLongTravel: boolean
}

export interface ActivityOption {
  id: string
  name: string
  city: string
  category: Interest
  cost: number
  durationMinutes: number
  interests: Interest[]
  moods: Mood[]
  crowdLevel: 'low' | 'medium' | 'high'
  description: string
  coordinates: Coordinates
}

export interface FoodOption {
  id: string
  name: string
  city: string
  cost: number
  durationMinutes: number
  vegetarian: boolean
  crowdLevel: 'low' | 'medium' | 'high'
  description: string
  coordinates: Coordinates
}

export interface PlanItem {
  id: string
  name: string
  type: 'activity' | 'food'
  startTime: string
  durationMinutes: number

  // Midpoint and estimated cost range.
  cost: number
  minCost: number
  maxCost: number

  description: string
  reason: string

  // Estimated travel from the previous stop.
  travelDistanceFromPreviousKm: number
  travelMinutesFromPrevious: number
}
export interface ValidationResult {
  valid: boolean
  budgetValid: boolean
  timeValid: boolean
  constraintsValid: boolean
  travelValid: boolean
  messages: string[]
}

export interface PlannerResult {
  plan: PlanItem[]

  totalCost: number
  remainingBudget: number
  minTotalCost: number
  maxTotalCost: number

  // Total time includes activities, food and travel.
  totalDuration: number
  totalActivityDuration: number
  totalTravelMinutes: number
  totalTravelDistanceKm: number

  // Preferred budget utilization information.
  preferredBudgetMin: number
  preferredBudgetMax: number
  budgetUtilizationPercent: number
  budgetTargetMet: boolean

  validation: ValidationResult
  trace: string[]
}
