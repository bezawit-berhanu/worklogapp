# WorkLog — Personal Work Log & Professional Growth Tracker

A clean, modern, fully functional **Personal Work Log Website** designed to help developers, data analysts, and researchers document daily work, reflect on weekly progress, and review monthly professional growth.

Inspired by the **ALX Data Analytics** concept of a *work log* (or *brag list*), this application helps answer one central question:

> **"What did I work on, what progress did I make, what went wrong, what did I learn, and how am I growing over time?"**

---

## 🌟 Core Reflection Framework

Every entry in the system revolves around four essential pillars:

1. **What I Worked On** — Activities, concepts studied, code written, projects advanced, and problems tackled.
2. **Achievements** — Tangible accomplishments, milestones reached, skills improved, and measurable progress.
3. **Failures and Learnings** — Mistakes, blockers, failed attempts, and the explicit technical/operational lessons extracted from them.
4. **Highlights** — Memorable moments, breakthroughs, personal wins, and exciting discoveries.

---

## 🚀 Key Features

### 1. Daily Work Log (5-Minute Quick Flow)
- Log work for any date with bullet-point granularity.
- Fast, keyboard-friendly bullet item entry (press `Enter` for the next bullet, `Backspace` to remove empty lines).
- Save drafts or complete entries partially and return later.
- Prevent duplicate logs for the same date with an instant option to edit the existing record.
- Non-judgmental status badges indicating saved and draft changes.

### 2. Dedicated Weekly Reflections
- Summarize work across a selected Monday–Sunday week.
- **Smart Auto-Generation:** Aggregates all daily logs for that week into an editable summary (days logged, activities, achievements, challenges, lessons, highlights).
- Stored independently from daily entries so thoughtful reflections are written without losing original records.

### 3. Comprehensive Monthly Reviews
- Monthly growth retrospective reviewing progress, recurring themes, and output compared to previous months.
- **Smart Monthly Overview:** Synthesizes that month's daily logs and weekly reflections.
- Reflective priorities and intentions for the upcoming month (structured as reflective growth notes rather than a task manager).

### 4. Growth & Analytics Dashboard (100% Real Data)
- **High-Level Statistics:** Total logs, reflections, achievements, challenges, lessons, highlights, days logged this month, and current streak.
- **Logging Consistency Heatmap:** GitHub-style 16-week consistency calendar with interactive cell tooltips and click-to-open day navigation.
- **Growth Trajectory Line Chart:** Pure responsive SVG line chart tracking achievements, challenges, and lessons over time (filterable by 30d, 90d, this year, all time).
- **Monthly Output Bar Chart:** Visual volume comparison of achievements and highlights across recent months.
- **Failure & Learning Analytics:**
  - Problem space documentation vs. lessons derived conversion rate.
  - Recurring friction themes identified via frequency analysis.
  - Interactive challenge explorer connecting blockers directly to their corresponding lessons, with direct links back to original logs.

### 5. Multi-Parameter History & Search
- Full-text search across all logs and reflections.
- Filter by date range (start & end date).
- Filter by entry type (Daily, Weekly, Monthly).
- Filter by category presence (Has Achievements, Has Failures, Has Lessons, Has Highlights).
- Direct one-click navigation to original entries.

### 6. Resilient Local-First Persistence & Backups
- Persistent storage surviving browser reloads and tab closures.
- JSON data export tool to download full backups.
- JSON data import tool to restore growth records anytime.
- Optional demo data loader for instant exploratory walkthroughs.

---

## 🎨 Design Aesthetics & UI Philosophy

- **Warm Neutral Palette:** Cream (`#FAF8F5`), off-white, and deep charcoal (`#1C1917`) with subtle warm brown and amber accents.
- **Typography:** Modern typography using Google Fonts (`Plus Jakarta Sans` paired with `Newsreader`).
- **Encouraging & Constructive Tone:** Failures are celebrated as essential empirical data points for deliberate mastery rather than personal inadequacy.

---

## 🛠️ Technology Stack

- **Framework:** React 19 + TypeScript + Vite
- **Styling:** Custom Vanilla CSS Design System (clean, accessible tokens and transitions)
- **Icons:** Lucide React
- **Persistence:** Local-first storage with full JSON Backup / Restore
- **Linter & Type Checker:** TypeScript strict mode + Oxlint (0 warnings, 0 errors)

---

## 🏃 Getting Started

### Prerequisites
- Node.js (v18+ or v20+ recommended)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/bezawit-berhanu/worklogapp.git
cd worklogapp

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173/` in your browser.

### Scripts

- `npm run dev` — Starts local Vite development server
- `npm run build` — Compiles TypeScript and builds production assets
- `npm run lint` — Runs Oxlint verification
- `npm test` — Executes automated unit test suite

---

## 📄 License

MIT License. Built for personal and professional growth tracking.
