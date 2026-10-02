# BookMySeva

BookMySeva is like BookMyShow, but for verified NGOs. Our goal is to help you discover great causes, see the real impact they are making, and easily take action. You can either volunteer your time or donate directly to the organization. We have made sure there are no logins required for users, no friction, and no middlemen taking a cut. 

---

## The Problem We Are Solving

People often want to help NGOs but usually run into three main roadblocks:

First, it is hard to know who to trust. People wonder if an NGO is legitimate and where their money is actually going. 
Second, discovery is tough. It is not always easy to find causes that align with what you personally care about. 
Finally, there is a lack of transparency. People want to know what the NGO has actually achieved. 

Right now, existing NGO websites can be cluttered, and there isn't a single, reliable place to find verified NGOs and see what they need right this minute.

---

## How We Fix It

We built BookMySeva as a central place to find and help NGOs. We focus on three core areas:

* **Trust:** We manually verify every single NGO using their official Government Darpan ID. If they are on our platform, they are verified.
* **Discovery:** We offer a clean, simple feed of NGO activities. You can filter this feed by category, city, or how urgently help is needed. We also feature a Top 100 ranking of the best-performing NGOs.
* **Action:** When you see a post you want to support, you have two clear choices. You can click "Book My Seva" to go straight to the NGO's secure donation page, or click "Register for Seva" to sign up to volunteer via their Google Form.

---

## How Different People Use the Platform

* **Viewers:** If you just want to browse and help, you don't even need to log in. You can filter activities, click to donate or volunteer, and even save posts to your browser to look at later.
* **NGOs:** Organizations can register with their Darpan ID. Once our admin team approves them, they can log in to post their activities, share their impact numbers, and upload photos.
* **Administrators:** Our internal admin team reviews NGO applications, verifies their government IDs on the official portal, and keeps the platform running smoothly.

---

## The Top 100 NGOs

We feature a leaderboard that ranks NGOs based on their actual impact and how active they are on the platform. The score is calculated using their base trust score, the funds they have successfully raised, and the number of activities they have hosted.

---

## What We Used to Build It

For the frontend, we are using React with Vite and plain CSS to give the site a clean, trustworthy look. 
The backend runs on Spring Boot and Java 21, connected to a MySQL database hosted on Aiven. 

We deploy the frontend on Vercel and the backend on Render. We also use Uptime Robot to monitor the site and ensure it stays online. Everything is tracked and managed in GitHub.

Please note: We intentionally do not use AI to generate or extract data. Every single number and detail you see on the platform is entered and verified by humans so we do not risk sharing incorrect information.

---

## Database Structure

We keep our data structure clean and simple with just three main tables:
1. One for platform administrators.
2. One for verified NGOs, which holds their details, external links, and trust scores.
3. One for the posts, tracking individual NGO activities, funding goals, and volunteer needs.

---

## Keeping Our Code Secure

Security is important to our team, so we have a strict ignore file set up in our repository. We make sure never to upload sensitive files like local environment variables, passwords, or security certificates. We also keep out bulky build folders like node modules and Java target directories to keep the code base clean and fast.

---

## The Team

* **Atharva:** Handles the backend architecture and deployment.
* **Ketan:** Leads the frontend development.
* **Anubhav:** Works on frontend development and handles testing.