# Saturdayly – Your Perfect Saturday Planner

Saturdayly helps people plan their Saturdays based on their city, budget, available time, mood and interests.

Instead of spending time deciding where to go and what to do, users can enter their preferences and get a suggested itinerary with activities, food options and estimated travel time.

## Features

- Personalized activity recommendations based on interests and mood.
- Budget-aware planning with estimated costs.
- Itinerary generation based on available time.
- Vegetarian and non-vegetarian food preferences.
- Options to avoid crowded places and long travel.
- Estimated distance and travel time between activities.
- Explanations for why each activity was recommended.
- Plan validation to check budget, time and user preferences.
- Gemini-powered itinerary summary, with a fallback summary if the API is unavailable.

The application currently supports Bangalore, Hyderabad, Chennai and New Delhi.

## Technology Used

- React and TypeScript
- Vite
- Tailwind CSS
- Google Gemini API
- Vercel for deployment

## How It Works

The planner uses separate functions for different tasks:

1. Reads and processes the user's preferences.
2. Finds suitable activities and food options.
3. Estimates costs.
4. Builds an itinerary based on the user's budget, interests and available time.
5. Checks whether the plan satisfies the user's constraints.
6. Generates a short summary using Gemini.

The main planning logic works independently of Gemini. Gemini is used to generate the final natural-language summary.

## Project Structure

```text
src/
  data/          - Activity and food data
  types/         - TypeScript interfaces
  utils/         - Planner logic
  App.tsx        - Main application
  index.css      - Styling

api/
  summarize.ts   - Gemini summary API

scripts/
  test-planner.ts - Planner tests
```

## Running Locally

Make sure Node.js and npm are installed.

Clone the repository:

```bash
git clone https://github.com/ajmeerasandeep2002/-perfect-saturday-planner.git
cd -perfect-saturday-planner
```

Install the dependencies:

```bash
npm install
```

Start the frontend:

```bash
npm run dev
```

Open the local URL shown in the terminal.

The Gemini summary feature also requires the API key to be configured in the deployment environment.

## Testing

Run the planner tests:

```bash
npx tsx scripts/test-planner.ts
```

Build the application:

```bash
npm run build
```

The planner has been tested for different cities, budget limits, food preferences, available time and crowd preferences.

## Notes

- Activity and food information currently comes from a local dataset.
- Prices are estimates and may differ from actual prices.
- Travel distances and times are approximate, not based on live traffic.
- If Gemini is unavailable, the application displays a planner-generated summary instead.

## AI Tools Used

Google Gemini API is used to generate a short summary of the recommended itinerary.

AI coding assistance was used during development for debugging, improving the recommendation logic and testing the application.