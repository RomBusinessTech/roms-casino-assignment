# Rom's Assignment - Slot Machine Game

## Getting Started

### Requirements
- Node.js 22+ (used `crypto.randomUUID()`)
- npm or yarn

### Installation (MAKE SURE TO USE NODE.JS 22+)
```bash
npm install
```

### Testing
```bash
npm run test
```
or
```bash
npm test
```

### Development
```bash
npm run dev
```

### Building for Production
```bash
npm run build
npm start
```

## Development Process

### 1. Project Setup & Planning

- Went through the assignment a couple of times and identified the core components: backend API routs, session management, game logic and the super simple and minimalistic UI
- Decided to go with Next.js (latest) for quick development
- Used in memory session for simplicity (a real app would use DB / Redis)

### 2. Building the Backend

**Challenge:** Making sure I have type safety across the app
**Solution:** Created interfaces that are used by both the client and server

- `lib/gameLogic.ts`: Functions of the game engine and session management
- `lib/types.ts`: Type safety throughout the whole app (also the custom Symbol enum & SymbolRewards)

**House Rules (cheating):**
- **< 40 credits**: regular game
- **40-60 credits**: 30% chance to re-roll (only if winning combination)
- **> 60 credits**: 60% chance to re-roll (only if winning combination)

**Challenge:** Implementing server-side house rules (cheating) without compromising fairness
**Solution:** Seperated cheating logic into execution functions with clear probability thresholds

### 3. Session Management
- Used `Map<string, GameSession>` for memory storage
- Implemented lifecycle: create, retrieve, update, delete
- Added activity tracking with `lastActivityAt` timestamp

**Challenge:** Ensuring requests don't corrupt session state
**Solution:** Used synchronous Map operations

### 4. API Endpoints
- POST `/api/session` - Create new session
- POST `/api/roll` - Execute slot machine roll
- POST `/api/cashout` - End session and collect winnings

### 5. Building the Frontend
- `app/page.tsx` - Main page
- `components/SlotMachine.tsx` - Slot machine component which seperates spinning state from result display

**User Flow:**
1. Session created automatically on page load
2. Player sees current credit count
3. After each roll, credits update dynamically
4. Cashout button ends session

### 6. Testing (using Jest)
- Created Tests dir & mocks dir in order to prevent Jest import errors
- Created jest.config.js with the needed configuration

**Test Coverage:**
- Session lifecycle
- Symbol generation and validity
- Win/loss detection
- Reward calculations
- Cheating logic
- Session credit updates