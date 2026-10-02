# 🕊️ BookMySeva

> **BookMyShow for verified NGOs.** Discover causes, see their impact with source-linked numbers, and book your act of service — volunteer via Google Form or contribute via their own payment page. Zero login. Zero friction. Zero middleman.

---

## 🎯 The Problem

People want to help NGOs but face three major blockers:
- **Trust:** "Is this NGO real? Where will my money go?"
- **Discovery:** "How do I find causes I care about?"
- **Transparency:** "What did they actually do?"

Existing NGO sites are messy. There is no single place to discover verified NGOs and their real-time needs.

---

## 💡 The Solution

BookMySeva is a centralized directory and redirect platform built on a 3-layer discovery model:

1. **Layer 1 — Trust:** Every NGO is manually verified against their official Government Darpan ID. Only verified NGOs receive the ✅ badge.
2. **Layer 2 — Discovery:** A clean, light-mode feed of NGO activities. Filter by category, city, or urgency, alongside a dynamic ranking of the Top 100 NGOs.
3. **Layer 3 — Action:** Every post features clear, direct calls to action:
   - **[❤️ Book My Seva]:** Redirects the user to the NGO's official payment page.
   - **[📝 Register for Seva]:** Redirects the user to the NGO's Google Form to sign up for volunteering.

---

## 👥 User Roles & Workflow

- **👤 Viewer (No Login Required):** Browses the home feed, filters activities, and clicks to contribute or volunteer directly with the NGO. Can save posts locally to their browser via `localStorage`.
- **🏢 NGO (Login Required):** Self-registers on the platform providing their Darpan ID. Once approved, they access their dashboard to post activities with impact numbers, event dates, and image slideshows. 
- **🧑‍💼 Administrator (Login Required):** Reviews pending NGO applications, manually verifies Darpan IDs on `ngodarpan.gov.in`, and manages platform health.

---

## 🏆 Top 100 NGOs Feature

A leaderboard ranking NGOs based on verifiable impact and platform activity. 
- **Ranking Formula:** `score = (trust_score * 0.5) + (funds_raised / 1000 * 0.3) + (posts_count * 2 * 0.2)`

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React (Vite) + Plain CSS (Light Mode) |
| **Backend** | Spring Boot 4.1.1 + Java 21 |
| **Database** | Aiven MySQL |
| **Deployment** | Vercel (Frontend) & Render (Backend) |
| **Monitoring** | Uptime Robot |
| **Version Control** | GitHub |

> *Note: BookMySeva explicitly does NOT use AI extraction or LLMs. Every number is human-entered and human-verified. This is a directory + redirect platform.*

---

## 🗄️ Database Architecture (3 Tables)

- `admin`: Manages platform administrators.
- `ngos`: Stores verified organization details, Darpan IDs, trust scores, approval statuses, and external platform links.
- `posts`: Tracks individual NGO activities, impact counts, funding goals, volunteer requirements, and media URLs.

---

## 🚀 Repository Setup & Security

### Version Control Constraints
A `.gitignore` file must be strictly configured at the project root. Ensure the following files are **never** pushed to the repository:

- **Secrets:** `application-local.properties` (contains Aiven passwords), `.env`, `.env.local`, `credentials.txt`, `ca.pem`, `*.pem`, `*.key`
- **Frontend Builds:** `node_modules/`, `dist/`, `build/`, `.vite/`, `*.log`
- **Backend Builds:** `target/`, `*.class`, `*.jar`
- **IDE/OS Junk:** `.vscode/`, `.idea/`, `.DS_Store`

---

## 👥 The Team

- **Atharva:** Backend + Deploy
- **Ketan:** Frontend Lead
- **Anubhav:** Frontend + Testing