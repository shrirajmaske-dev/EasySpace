# EasySpace 🎓✨
> **Distraction-Free Academic Learning Platform with AI Video Curation & Mastery Tracking**

EasySpace is a modern web application designed for students and researchers to master STEM concepts without algorithmic noise, clickbait, or endless social feeds. It features an automated curation pipeline connected to an **n8n AI Workflow (LearnLens)**, strict video length & academic rigor filters, active recall diagnostics, interactive notes, and an adaptable **Light / Dark theme**.

---

## 🌟 Key Features

- **🎯 Distraction-Free Academic Curation**:
  - Filters out YouTube shorts, reactions, and promotional noise.
  - Prioritizes high-signal university lectures, MIT OCW, Stanford, and verified educational channels (5–45 min duration).
- **⚡ n8n AI Workflow Integration (LearnLens)**:
  - Transmits search queries to a custom n8n webhook workflow (`/webhook/learnlens/search`).
  - Receives structured recommendations with concepts, difficulty ratings, relevance scores, and pedagogical reasoning.
- **🌗 Theme Toggle (Light & Dark Mode)**:
  - Custom-engineered, high-contrast accessible design tokens with subtle glassmorphism and modern typography.
  - Smooth instant switching with persistent user preference storage.
- **📝 Active Recall & Interactive Workspace**:
  - Embedded distraction-free video player with sequence navigation.
  - Video-linked markdown notes with automatic timestamp bookmarks.
  - Integrated diagnostic multiple-choice quizzes with instant grading and mastery scoring.
- **📊 Student Mastery Analytics**:
  - Real-time tracking of completed modules, quizzes taken, and average mastery grade.

---

## 🛠️ Architecture & Tech Stack

```
EASY-SPACE/
├── client/              # React 18 + Vite + Tailwind CSS frontend
│   ├── src/
│   │   ├── api/         # Axios API clients & n8n webhook connectors
│   │   ├── components/  # Atomic UI, ThemeToggle, Learning cards, Player
│   │   ├── context/     # ThemeContext (Dark/Light mode)
│   │   ├── pages/       # Dashboard, SearchCuration, LearningWorkspace
│   │   └── store/       # Zustand mastery & progress store
├── server/              # Node.js + Express REST API
│   ├── src/
│   │   ├── controllers/ # Curation, Learning Path, Quiz controllers
│   │   ├── middleware/  # Auth, validation, error handling
│   │   ├── services/    # n8nService, YouTube API service
│   │   └── config/      # Supabase & in-memory fallback stores
└── supabase/            # PostgreSQL schemas & migrations
```

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **pnpm**

### 2. Installation

Clone the repository and install dependencies:
```bash
git clone https://github.com/shrirajmaske-dev/Easy-Space.git
cd Easy-Space
npm install
```

### 3. Environment Setup

Configure client and server environment variables:

**Server** (`server/.env`):
```env
PORT=5000
NODE_ENV=development
N8N_SEARCH_WEBHOOK_URL=https://ladepranav7.app.n8n.cloud/webhook/learnlens/search
```

**Client** (`client/.env`):
```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_N8N_SEARCH_WEBHOOK_URL=https://ladepranav7.app.n8n.cloud/webhook/learnlens/search
```

### 4. Running Locally

Run both frontend and backend concurrently:
```bash
npm run dev
```

- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000`

---

## 🔗 n8n Workflow Integration

When a user searches for an educational subject, the payload is transmitted to the n8n Webhook:

```http
POST https://ladepranav7.app.n8n.cloud/webhook/learnlens/search
Content-Type: application/json

{
  "query": "Operating Systems Scheduling",
  "topic": "Operating Systems Scheduling",
  "discipline": "Computer Science",
  "difficulty": "Intermediate"
}
```

The parsed recommendations are matched with video IDs, key conceptual tags, and relevance metrics displayed directly in the EasySpace learning workspace.

---

## 📄 License

MIT © EasySpace Contributors
