# Git Streak

Turn your GitHub contribution graph into an addictive snake game! Collect commits, chase your coding streaks, and compete with yourself in this unique visualization of your developer journey.

![Git Streak Game](https://img.shields.io/badge/Next.js-16.1.6-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=for-the-badge&logo=tailwind-css)

## ✨ Features

### 🎮 Dual Game Modes
- **Mock Mode**: Practice with pre-generated contribution patterns (Light, Medium, Heavy)
- **GitHub Mode**: Play with your real GitHub contribution history via OAuth

### 🎯 Authentic GitHub Design
- Pixel-perfect recreation of GitHub's contribution graph
- Official color palette: `#ebedf0` → `#9be9a8` → `#40c463` → `#30a14e` → `#216e39`
- 10px cells, 2px gaps, 2px border radius - exactly like GitHub

### 🐍 Classic Snake Mechanics
- Smooth 60 FPS gameplay with 150ms tick speed
- Arrow keys + WASD controls
- Snake length increases every 5 tiles
- Collect tiles by passing through them (all body segments count)

### 📊 Real-time Stats
- Score tracking (sum of commit counts)
- Tiles collected vs remaining
- Snake length display
- Win/loss detection

### 🔒 Secure GitHub Integration
- OAuth 2.0 authentication flow
- CSRF protection with state validation
- Read-only access (`read:user` scope)
- GraphQL API for year-long contribution data

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- (Optional) GitHub OAuth App for real contribution data

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/git-streak.git
cd git-streak

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start playing in Mock Mode!

## 🔑 GitHub OAuth Setup (Optional)

To unlock GitHub Mode and play with your real contribution history:

### 1. Create GitHub OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **New OAuth App**
3. Fill in the details:
   - **Application name**: Git Streak
   - **Homepage URL**: `http://localhost:3000` (dev) or your production URL
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback`
4. Click **Register application**
5. Copy your **Client ID**
6. Generate and copy your **Client Secret**

### 2. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
# GitHub OAuth Credentials
GITHUB_CLIENT_ID=your_client_id_here
GITHUB_CLIENT_SECRET=your_client_secret_here

# Callback URL (change for production)
GITHUB_REDIRECT_URI=http://localhost:3000/api/auth/callback

# Session Secret (generate with: openssl rand -base64 32)
NEXTAUTH_SECRET=your_random_secret_here
```

### 3. Restart Development Server

```bash
npm run dev
```

The "Sign in with GitHub" button will now appear on the landing page!

## 📁 Project Structure

```
git-streak/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── auth/                 # OAuth endpoints
│   │   │   ├── github/route.ts   # Initiate OAuth flow
│   │   │   └── callback/route.ts # Handle OAuth callback
│   │   └── contributions/route.ts # Manage GitHub data
│   ├── layout.tsx                # Root layout with metadata
│   ├── page.tsx                  # Main app entry point
│   └── globals.css               # Global styles
├── components/                   # React components
│   ├── auth/                     # Authentication UI
│   │   ├── SignInButton.tsx
│   │   └── UserBadge.tsx
│   ├── game/                     # Game UI components
│   │   ├── ContributionGrid.tsx  # GitHub-style heatmap
│   │   ├── GameBoard.tsx         # Main game container
│   │   ├── GameOverModal.tsx     # End screen
│   │   ├── ScorePanel.tsx        # Stats display
│   │   └── DatasetSelector.tsx   # Mock data picker
│   └── ui/                       # Reusable UI components
│       └── Button.tsx
├── hooks/                        # React hooks
│   ├── useGameState.ts           # Game loop & state management
│   └── useKeyboardControls.ts    # Input handling
├── lib/                          # Core game logic (pure functions)
│   ├── auth/
│   │   └── github-oauth.ts       # OAuth utilities
│   ├── data/
│   │   ├── github-api.ts         # GitHub GraphQL client
│   │   └── mock-contributions.ts # Sample datasets
│   ├── game/
│   │   ├── types.ts              # TypeScript definitions
│   │   ├── grid.ts               # Grid generation & colors
│   │   ├── snake.ts              # Snake movement logic
│   │   └── game-engine.ts        # Core game loop
│   └── utils/
│       ├── date-utils.ts         # Date manipulation
│       └── grid-helpers.ts       # Position utilities
└── public/                       # Static assets

```

## 🎮 How to Play

1. **Choose Your Mode**
   - Start with Mock Mode to practice (Light/Medium/Heavy)
   - Sign in with GitHub for your personal contribution graph

2. **Control the Snake**
   - Arrow Keys: `↑` `↓` `←` `→`
   - WASD: `W` `A` `S` `D`

3. **Collect Commits**
   - Pass through green tiles to collect them
   - Each tile is worth its commit count
   - Collected tiles turn grey

4. **Win Conditions**
   - **Victory**: Collect all tiles without crashing
   - **Game Over**: Hit walls or snake body

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, React Server Components)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Authentication**: GitHub OAuth 2.0
- **API**: [GitHub GraphQL API](https://docs.github.com/en/graphql)
- **State Management**: React `useReducer` with custom hooks
- **Animation**: `requestAnimationFrame` (60 FPS target)

## 🏗️ Architecture Highlights

### Pure Functional Game Engine
All game logic in `lib/game/` is pure functions - no side effects, easy to test:
```typescript
tick(state: GameState): GameState  // Immutable state updates
```

### React Hooks for Side Effects
UI layer handles timing, input, and rendering via custom hooks:
```typescript
useGameState(grid)    // requestAnimationFrame loop
useKeyboardControls() // Keyboard event listeners
```

### GitHub-Exact Color System
Contribution levels mapped to official GitHub colors:
```typescript
0 commits  → #ebedf0 (empty)
1-2 commits → #9be9a8 (light green)
3-5 commits → #40c463 (medium green)
6-9 commits → #30a14e (dark green)
10+ commits → #216e39 (darkest green)
```

