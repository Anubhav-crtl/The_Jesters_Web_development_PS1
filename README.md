# BookMySeva
**BookMyShow for Verified NGOs**

Discover verified causes. See real impact. Take action in one click.  
No login. No friction. No middleman.

---

## The Problem

People want to help, but three things stop them:

- **Trust** — “Is this NGO even real?”
- **Discovery** — “How do I find causes I actually care about?”
- **Transparency** — “What did they actually do with the money?”

Most NGO websites are cluttered. There is no clean, reliable place to discover verified organisations and act immediately.

---

## Our Solution

BookMySeva is built on three clear layers:

### 1. Trust
Every NGO is manually verified using their official Government **Darpan ID**. Only verified organisations appear on the platform, clearly marked with a verification badge.

### 2. Discovery
A clean feed of NGO activities that you can filter by category, city, or urgency.  
We also feature a **Top 100** ranking based on trust score, activity, and impact.

### 3. Action
Every post has two simple buttons:
- **Book My Seva** → Redirects to the NGO’s official payment page
- **Register for Seva** → Opens their volunteer Google Form

We never handle money.  
We never store user data.  
We take zero commission.  
Every rupee goes directly to the organisation.

---

## How People Use It

- **Viewers** — No login required. Browse, filter, save posts locally, and act in one click.
- **NGOs** — Get verified once, then post updates and share real impact.
- **Admins** — Manually verify every organisation against the official NITI Aayog Darpan portal.

---

## Why BookMySeva is Different

- Zero login friction
- Zero payment processing (true zero middleman)
- Only government-verified NGOs
- Clean experience instead of cluttered directories
- Language built around “Seva” — an act of service

---

## Tech Stack

| Layer       | Technology                      |
|-------------|---------------------------------|
| Frontend    | React (Vite) + Plain CSS        |
| Backend     | Spring Boot + Java 21           |
| Database    | MySQL (Aiven)                   |
| Deployment  | Vercel (Frontend) + Render (Backend) |
| Monitoring  | Uptime Robot                    |
| Version Control | GitHub                       |

We intentionally kept the architecture simple and reliable so the focus stays on trust and action.  
All impact numbers are human-entered and human-verified.

---

## Database (Simple by Design)

Only three tables:

1. **admin** – Platform administrators  
2. **ngos** – Verified organisations (Darpan ID, trust score, links)  
3. **posts** – Activities, impact numbers, funding goals, and volunteer needs

---

## Core Features

- Verified NGO feed with filters (Category, City, Most Needed)
- Top 100 NGO ranking
- One-click redirect to donation page or volunteer form
- Clean NGO profile pages
- Local “Save for Seva” (no login needed)

---

## The Team

- **Atharva** — Backend architecture & deployment  
- **Ketan** — Frontend development  
- **Anubhav** — Frontend development & testing  

---

**BookMySeva**  
Discover. Verify. Act.  

**Book your act of service.**