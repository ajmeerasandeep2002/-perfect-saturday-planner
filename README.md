# Saturdayly – Your Perfect Saturday Planner

Saturdayly helps you put together a simple plan for your Saturday. Enter your city, budget, available time, mood and interests, and it suggests activities and a food stop that fit your preferences.

The app currently supports Bangalore, Hyderabad, Chennai and New Delhi.

## What it does

- Suggests activities based on your interests and mood.
- Filters food options based on vegetarian or non-vegetarian preferences.
- Takes your budget and available time into account.
- Shows estimated price ranges instead of treating prices as fixed.
- Estimates travel time and distance between stops.
- Explains why each activity or food stop was recommended.
- Checks the final plan against your budget, time and selected constraints.

## How the planner works

The planner uses a local sample dataset of activities and food options for the four supported cities. It reads the preferences entered in the form, filters and ranks suitable activities and food options, compares possible combinations, estimates costs and travel, and checks the selected plan before showing it.

The recommendation logic is rule-based. It uses the selected interests, mood, budget, time, category variety and estimated travel when comparing plans. The preferred budget range is 60–80% of the entered budget, but the planner does not add activities just to spend more.

## Tech used

- React
- TypeScript
- Vite
- Tailwind CSS

## Run it locally

You need Node.js and npm installed.

1. Clone the repository or download the project.
2. Open a terminal in the project folder.
3. Install the dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open the local URL printed in the terminal.

To create a production build, run:

```bash
npm run build
```

To run the planner tests, run:

```bash
npx tsx scripts/test-planner.ts
```

If PowerShell blocks the `npm` command on Windows, use `npm.cmd` instead. For example, `npm.cmd run dev` or `npm.cmd run build`.

## Notes about estimates

The activity, food and price information is sample data included with the project. The price range shown for each stop is an estimate based on its sample price; actual prices may be different.

Travel distances and times are also estimates based on approximate coordinates. They are not live directions and do not include real-time traffic. The app does not currently connect to a maps, restaurant, booking or live traffic API.

## AI tools used

I used ChatGPT as a coding assistant while building the app. It helped me work through the planner logic, improve the recommendation scoring, debug issues and prepare test cases. The current app itself uses local sample data and rule-based recommendations; it does not call an LLM API.
