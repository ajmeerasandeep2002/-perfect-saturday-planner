
import assert from 'node:assert/strict'

import {
  runPlanner,
  parseUserPreferences,
  getFoodOptions,
} from '../src/utils/planner'

import type { PlannerInput } from '../src/types/planner'

// Test 1: Normal Bangalore Saturday
const normalInput: PlannerInput = {
  city: 'Bangalore',
  budget: 2000,
  hours: 4,
  mood: 'Tired but Fun',
  interests: ['Food', 'Music', 'Walking'],
  constraints: 'Vegetarian, avoid crowds',
}

const normalResult = runPlanner(normalInput)

assert.ok(normalResult.plan.length > 0)
assert.ok(normalResult.plan.some((item) => item.type === 'activity'))
assert.ok(normalResult.totalCost <= normalInput.budget)
assert.ok(normalResult.totalDuration <= normalInput.hours * 60)
assert.equal(normalResult.validation.valid, true)
assert.ok(normalResult.plan.filter((item) => item.type === 'food').length <= 1)

console.log('PASS: Normal Bangalore itinerary generation')

// Test 2: Unsupported city
const unknownCityInput: PlannerInput = {
  ...normalInput,
  city: 'Mumbai',
}

const unknownCityResult = runPlanner(unknownCityInput)

assert.equal(unknownCityResult.plan.length, 0)
assert.equal(unknownCityResult.validation.valid, false)

console.log('PASS: Unsupported city handling')

// Test 3: Very small budget
const lowBudgetInput: PlannerInput = {
  ...normalInput,
  budget: 100,
  interests: ['Nature', 'Walking'],
  constraints: '',
}

const lowBudgetResult = runPlanner(lowBudgetInput)

assert.ok(lowBudgetResult.plan.length > 0)
assert.ok(lowBudgetResult.totalCost <= lowBudgetInput.budget)
assert.equal(lowBudgetResult.validation.valid, true)

console.log('PASS: Low budget handling')

// Test 4: Vegetarian preference
const vegetarianInput: PlannerInput = {
  ...normalInput,
  constraints: 'Vegetarian',
}

const vegetarianPreferences = parseUserPreferences(vegetarianInput)

const vegetarianFood = getFoodOptions(
  vegetarianPreferences,
  vegetarianInput.budget,
)

assert.equal(vegetarianPreferences.vegetarian, true)
assert.equal(vegetarianPreferences.nonVegetarian, false)
assert.ok(vegetarianFood.length > 0)
assert.ok(vegetarianFood.every((food) => food.vegetarian))

console.log('PASS: Vegetarian food filtering')

// Test 5: Non-vegetarian preference
const nonVegetarianInput: PlannerInput = {
  ...normalInput,
  city: 'Hyderabad',
  mood: 'Relaxed',
  interests: ['Food', 'Music', 'Nature'],
  constraints: 'Non Vegetarian, avoid crowds',
}

const nonVegetarianPreferences =
  parseUserPreferences(nonVegetarianInput)

const nonVegetarianFood = getFoodOptions(
  nonVegetarianPreferences,
  nonVegetarianInput.budget,
)

assert.equal(nonVegetarianPreferences.vegetarian, false)
assert.equal(nonVegetarianPreferences.nonVegetarian, true)
assert.ok(nonVegetarianFood.length > 0)
assert.ok(nonVegetarianFood.every((food) => !food.vegetarian))

console.log('PASS: Non-vegetarian food filtering')

// Test 6: All four supported cities
const supportedCities = [
  'Bangalore',
  'Hyderabad',
  'Chennai',
  'New Delhi',
]

for (const city of supportedCities) {
  const input: PlannerInput = {
    city,
    budget: 2000,
    hours: 4,
    mood: 'Relaxed',
    interests: ['Nature', 'Walking'],
    constraints: '',
  }

  const result = runPlanner(input)

  assert.ok(result.plan.length > 0, `${city} should generate a plan`)
  assert.ok(result.plan.some((item) => item.type === 'activity'))
  assert.ok(result.totalCost <= input.budget)
  assert.ok(result.totalDuration <= input.hours * 60)
  assert.equal(result.validation.valid, true)
}

console.log('PASS: Itinerary generation for all four cities')

// Test 7: Shopping interest
const shoppingInput: PlannerInput = {
  city: 'Bangalore',
  budget: 5000,
  hours: 4,
  mood: 'Adventurous',
  interests: ['Shopping'],
  constraints: '',
}

const shoppingResult = runPlanner(shoppingInput)

assert.ok(
  shoppingResult.plan.some(
    (item) => item.id === 'blr5' || item.id === 'blr9',
  ),
  'The plan should include a Bangalore shopping activity',
)

assert.ok(shoppingResult.totalCost <= shoppingInput.budget)

console.log('PASS: Shopping interest recommendation')

// Test 8: Limited available time
const limitedTimeInput: PlannerInput = {
  city: 'New Delhi',
  budget: 500,
  hours: 1,
  mood: 'Relaxed',
  interests: ['Nature'],
  constraints: '',
}

const limitedTimeResult = runPlanner(limitedTimeInput)

assert.ok(limitedTimeResult.plan.length > 0)
assert.ok(limitedTimeResult.totalDuration <= 60)
assert.equal(limitedTimeResult.validation.timeValid, true)

console.log('PASS: Limited available time handling')

// Test 9: Avoid crowded places
const crowdInput: PlannerInput = {
  city: 'Hyderabad',
  budget: 2000,
  hours: 4,
  mood: 'Relaxed',
  interests: ['Nature', 'Walking'],
  constraints: 'Avoid crowds',
}

const crowdResult = runPlanner(crowdInput)

assert.ok(crowdResult.plan.length > 0)
assert.equal(crowdResult.validation.constraintsValid, true)
assert.equal(crowdResult.validation.valid, true)

console.log('PASS: Avoid crowds constraint')

// Test 10: Execution trace
assert.ok(normalResult.trace.length >= 7)
assert.ok(
  normalResult.trace.some((step) => step.includes('Parsing')),
)
assert.ok(
  normalResult.trace.some((step) => step.includes('Validating')),
)

console.log('PASS: Planner execution trace')

console.log('\nAll 10 planner tests passed!')
