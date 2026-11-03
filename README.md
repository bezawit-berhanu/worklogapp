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

## 🗄️ Database & TiDB Cloud ORM Integration

The application includes enterprise-grade ORM support powered by **Drizzle ORM** configured for **TiDB Cloud** (MySQL-compatible distributed HTAP database).

### Environment Configuration (`.env`)
Database credentials are protected via `.gitignore`. To connect your TiDB Cloud cluster, copy `.env.example` to `.env` and fill in your connection details:

```env
TIDB_HOST=gateway01.us-east-1.prod.aws.tidbcloud.com
TIDB_PORT=4000
TIDB_USER=your_tidb_username
TIDB_PASSWORD=your_tidb_password
TIDB_DATABASE=worklog
DATABASE_URL=mysql://your_tidb_username:your_tidb_password@gateway01.us-east-1.prod.aws.tidbcloud.com:4000/worklog?ssl={"rejectUnauthorized":true}
```

### TiDB CLI Scripts
- `npm run db:check` — Validates environment credentials and tests active TLSv1.2 connection to TiDB Cloud.
- `npm run db:init` — Runs automated DDL to create `daily_logs`, `weekly_reflections`, and `monthly_reflections` tables on TiDB.
- `npm run db:seed` — Populates sample demonstration records into TiDB.
- `npm run db:push` — Pushes Drizzle schema migrations to TiDB.

---

## 🏆 Score of the Week & Week-over-Week Trend Delta

Displayed prominently on the **top right corner** (in the navigation bar and on the dashboard header):

- **Weekly Score Percentage (0–100%):** Evaluates consistent logging (35 pts), output task volume (25 pts), positive achievement ratio (25 pts), and lesson resilience (15 pts).
- **Trend Comparison:** Compares current week performance against the previous week:
  - **`+X% improved`** with green arrow indicator when performance outpaces last week.
  - **`-X% decreased`** with amber/red downward indicator when volume or consistency drops.
  - **`Baseline week`** for inaugural logging periods.


---

## 📊 Weekly Performance Report (Mon–Sun Colored Bar Graph)

The weekly performance visualizer tracks daily output volume and outcome health across all 7 days (Monday through Sunday):

### Bar Length (Height Hierarchy)
- **Long Bar:** High output volume (4+ tasks and reflections logged).
- **Medium Bar:** Steady output volume (2–3 items logged).
- **Short Bar:** Focused single-item day (1 item logged).
- **Empty Slot:** Rest day or no activity recorded.

### Bar Color (Performance Rating)
- **Green (`#22c55e`):** Performed exceptionally well — logged high tasks with achievements outpacing challenges.
- **Yellow (`#facc15`):** Performed averagely — steady output with balanced progress and routine activities.
- **Red (`#ef4444`):** Logged tasks but encountered dominant blockers/failures.
- **Gray:** No log recorded for that date.

Clicking any bar opens the **Interactive Day Inspector** displaying the exact breakdown of activities, achievements, challenges, and lessons learned.


---

## 💡 Growth Focus Advisor & Achievement Evaluator

Designed to answer what to prioritize and celebrate:

### 1. Priority Focus: What to Work on Highly
Detects recurrent friction points and learning gaps:
- **Coursework Discipline:** E.g., *"You need to work more on taking your courses properly: review syllabus lectures methodically, avoid skipping tutorial sessions, and schedule designated study focus hours."*
- **Testing & Debugging Methodology:** Recommends writing automated unit tests and reproducible debug traces when bug bottlenecks spike.
- **Deep Work Protection:** Advises blocking uninterrupted 90-minute morning focus zones when distraction patterns are logged.
- **System Documentation:** Suggests architectural diagrams when complexity issues arise.

### 2. Achievement Evaluation: What You Did Well On
Extracts high points and delivers personalized, objective recognition:
- E.g., *"You did well on shipping the TiDB ORM integration and maintaining structured data integrity."*
- Highlights problem-solving perseverance, learning conversions, and multi-day momentum.
