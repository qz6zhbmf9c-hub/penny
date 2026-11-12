# Penny (mypenny.net)

A minimalist personal finance app. Log expenses by receipt photo,
voice, or typing, with no bank login needed.

Live: https://mypenny.net

## What is this?
I built Penny because I hated typing in numbers manually every time
I buy something.

Instead of a manual entry form, I connected the Gemini API. You
upload a picture of your receipt, and the AI reads the total amount,
the date, and the store name automatically. You review the result
before it is saved.

## Features
- Track income and expenses with category, note, and date
- Receipt scanning with the Gemini API
- Voice logging
- Overview dashboard with charts
- Monthly budgets and savings goals
- Multi-currency display
- Free plan and a one-time Pro upgrade

## Tech stack
- Next.js
- JavaScript
- Tailwind CSS
- Gemini API (receipt reading and voice parsing)
- Neon (PostgreSQL database)
- Login with email or Google account
- Lemon Squeezy (payments)
- Vercel (hosting)

## How I built it
I used AI coding tools a lot for this project, especially for the
frontend and the project structure. I decided how the app should
work, broke the logic down into steps, and tested and fixed the
results. I know I still have a lot to learn about the fundamentals,
and that is one reason I want to do an Ausbildung.

The hardest part was not the UI. It was getting the AI to read
blurry receipts correctly and always return the exact data format
I needed. I tested and rewrote my prompts many times, and I added
fallbacks so the app does not crash when the AI gives a strange
answer.

## What I learned
- How to use Vercel to host my websites ,how to link neon ,and how to since google to my website so people can use their google account to login/signup.
- AI output must always be validated before saving it!
- Choosing the right colors to match the design and make it more proficient.

## Run it yourself
1. Clone the repo:
   ```bash
   git clone https://github.com/qz6zhbmf9c-hub/penny
   cd mypenny
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file and add your own keys:
   ```
   GEMINI_API_KEY=your_key_here
   DATABASE_URL=your_database_url_here
   [other variables you use]
   ```
4. Start the app:
   ```bash
   npm run dev
   ```
5. Open http://localhost:3000

## Next steps
- write tests
- learn more on how to build the same feature without AI help

---
Built by Yessine Ghariani while preparing for an Ausbildung as
Fachinformatiker für Anwendungsentwicklung.

