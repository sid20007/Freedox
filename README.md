# Event Management Portal — St Aloysius (Deemed to be University)

The **Event Management Portal** is a specialized institutional platform designed for **St Aloysius (Deemed to be University) — School of Engineering, Mangaluru**. It streamlines the entire event lifecycle for academic departments, student societies, and faculty advisors—from initial proposal and multi-tier approval to automated student feedback collection, geo-verified post-event reporting, and accreditation-ready dossier generation.

---

## 🛠 Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Database & ORM:** [SQLite](https://www.sqlite.org/) with [Prisma ORM](https://www.prisma.io/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)

---

## ✨ Key Features

- **Proposal Submission:** Faculty advisors and student societies submit detailed event proposals including proposed dates, venue requests, budget estimates, and event types.
- **Multi-Stage Approval Workflow:** Dean of SOE and Faculty Advisors review, approve, or request revisions on proposals with full audit trails and timestamped comments.
- **Smart Venue Conflict Prevention:** Server-side date and venue overlap validation prevents scheduling conflicts across campus facilities before proposal creation.
- **Automated Student Feedback System:** Public feedback links allow students to submit ratings and feedback without needing login credentials.
- **Post-Event Reporting & Verification:** Organizers submit actual outcomes, attendee numbers, press clippings, and geo-tagged photos (verified against Mangaluru coordinates).
- **Accreditation-Ready Event Dossier:** Automatically consolidates proposals, formal approvals, final reports, photo evidence, press clips, and student feedback ratings into a single comprehensive view.

---

## 🔍 How Everything Works (Architecture & System Lifecycle)

This section provides a simple, beginner-friendly walkthrough of how the platform operates behind the scenes.

```
[ Propose Event ] ──► [ Venue Check ] ──► [ Pending Approval ] ──► [ Dean/Faculty Review ]
                                                                               │
                                                                       ┌───────┴───────┐
                                                                       ▼               ▼
                                                                  [ Rejected ]    [ Approved ]
                                                                                       │
                                                                                       ▼
[ Dossier Synthesis ] ◄── [ Post-Event Report & Geo-Photos ] ◄── [ Student Feedback Link ]
```

### 1. Persona & Identity System (`RoleContext` & `IdentityGuard`)
- **How it works:** To test multi-user workflows without login barriers, the app uses a persistent client-side identity store powered by React Context (`RoleContext.tsx`) and stored in `localStorage`.
- **Identity Switcher (`IdentityGuard.tsx`):** Users set their name (e.g., *Dr. Rio D'Souza*) and active role (*Faculty Advisor* or *Dean, SOE*). The top navigation bar includes an instant role switcher to seamlessly test both approval and submission perspectives.

### 2. Event Lifecycle State Machine
Every event progresses through strict status transitions stored in SQLite via Prisma:
1. **`draft`**: Proposal saved by organizer, editable, not yet submitted for review.
2. **`pending_approval`**: Submitted for official review. Displayed on the Dean/Advisor dashboard for action.
3. **`approved`**: Formally sanctioned by the Dean or Faculty Advisor with timestamped approval comments.
4. **`rejected`**: Declined with feedback from the approver.
5. **`completed`**: Post-event summary, attendee count, press clips, geo-photos, and student feedback have been submitted.

### 3. Smart Venue Conflict Prevention
- When creating a new proposal, Next.js calls `/api/events/check-conflict`.
- The server checks SQLite for any existing event sharing the **same venue** on the **same date** (excluding rejected events).
- If a conflict is detected, the user receives an instant warning alert to select an alternative date or venue.

### 4. Zero-Login Public Student Feedback Engine
- Requiring students to log in creates friction that drastically lowers feedback participation rates.
- The portal generates a dedicated public route: `/events/[id]/feedback`.
- `IdentityGuard` automatically bypasses identity checks for `/feedback` routes.
- Students select star ratings and submit text responses to dynamic questions (`FeedbackQuestion` model), which instantly calculate average satisfaction scores on the main event page.

### 5. Post-Event Reporting & Geo-Location Verification
- After an approved event concludes, organizers access the post-event submission panel to submit:
  - **Executive Summary & Outcomes:** Detailed text describing event goals achieved.
  - **Participant Count:** Total registered and actual attendee counts.
  - **Geo-Tagged Photos:** Image URLs submitted with `latitude` and `longitude` metadata. The system checks coordinates against Mangaluru's geographical boundary (~`12.87° N, 74.88° E`) to ensure photos were taken on or near campus.
  - **Press Clippings:** Media links, newspaper articles, or web coverage.

### 6. Accreditation-Ready Dossier Aggregation
- National accreditation bodies (like NAAC, NBA, and NIRF) require complete documentation for institutional audits.
- The platform dynamically queries Prisma for all relational records linked to an event (`approvals`, `reports`, `photos`, `pressClippings`, `feedbackResponses`).
- It renders a unified **Accreditation Dossier View** featuring all proposal details, approval history, feedback analytics, and photo evidence.

### 7. Database Relational Model & Security
- **Prisma + SQLite (`prisma/schema.prisma`):** Ensures cascading deletions (`onDelete: Cascade`) so deleting an event automatically cleans up associated approvals, reports, and feedback.
- **Security & XSS Protection (`lib/security.ts`):** Input strings pass through HTML entity sanitization (`sanitizeString`) to prevent Cross-Site Scripting (XSS) attacks in text fields.

---

## 🚀 Long-Term Goals & Future Roadmap

As St Aloysius (Deemed to be University) expands its digital infrastructure, the Event Management Portal is planned to evolve into a full-scale enterprise institutional platform:

### 1. Enterprise Institutional Single Sign-On (SSO)
- Replace the client-side identity switcher with **Microsoft 365 / Google Workspace OAuth 2.0** integrated directly with `@staloysius.edu.in` faculty and student domain accounts.
- Automated role assignment based on institutional LDAP directory groups (e.g., Head of Department, Dean of Engineering, Student Council President).

### 2. One-Click NAAC / NBA / NIRF PDF Dossier Exporter
- Add server-side PDF generation (using `Puppeteer` or `@react-pdf/renderer`) to convert event dossiers into standardized, printable PDF reports with official university headers, QR-code verification seals, and audit checklists.

### 3. Visual Campus Venue Matrix & Map Integration
- Replace simple text venue inputs with an interactive campus map and time-slot calendar grid (Leaflet / Google Maps API).
- Visual availability indicators for Engineering auditoriums, computer labs, seminar halls, and open grounds.

### 4. Automated Photo EXIF Meta-Data & AI Fraud Detection
- Replace manual lat/long entry with automatic **EXIF GPS extraction** from uploaded JPEG/PNG image files.
- Implement client-side image compression and AI duplicate image detection to ensure uploaded event photos are authentic and unique.

### 5. Financial Ledger & ERP Budget Sync
- Integration with the University Accounts Department ERP.
- Organizers can upload itemized expense receipts and invoices for automated budget-vs-actual variance tracking and reimbursement requests.

### 6. AI-Powered Student Sentiment & Executive Summaries
- Integrate Large Language Models (LLMs) to analyze student text feedback for sentiment classification (Positive, Neutral, Needs Improvement).
- Auto-generate one-paragraph executive summaries from raw organizer notes for fast accreditation reporting.

### 7. Automated Notification Pipeline
- Automated email and WhatsApp alerts sent via Twilio / SendGrid when:
  - A new proposal requires Dean approval.
  - A proposal status changes.
  - An approved event concludes and post-event reporting is due.

---

## 🏃 Getting Started Locally

### Prerequisites
- Node.js 18+ installed
- npm / yarn / pnpm

### Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/sid20007/Freedox.git
   cd Freedox
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Initialize Database:**
   ```bash
   npx prisma migrate dev --name init
   npx prisma db seed
   ```

4. **Run Development Server:***
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.
