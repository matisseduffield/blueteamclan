# Clash of Clans Data Sync Scripts

## Overview
These scripts automatically sync real-time Clash of Clans data to your website's Firebase database.

## Scripts

### 1. `syncClanData.ts` - Sync Clan Members & Events
Syncs real clan data from the official Clash of Clans API.

```bash
npx ts-node scripts/syncClanData.ts
```

**What it does:**
- Fetches real clan members and their stats
- Updates trophy counts, donations, and roles
- Auto-generates upcoming events (Wars, CWL, Clan Games, Meetings)
- Creates 3-4 months of events in advance
- Detects if clan is currently in CWL

**Output:**
- Updates `members` collection in Firestore
- Creates entries in `events` collection
- Updates `clan/info` document

---

### 2. `syncClashCalendar.ts` - Sync Live Clash Events  
Fetches current CWL, war, and raid data + generates universal event calendar.

```bash
npx ts-node scripts/syncClashCalendar.ts
```

**What it does:**
- **CWL Status**: Current rank, wins, destruction %, opponents list
- **War Status**: Live war details (vs opponent, stars, destruction, team size)
- **Raid Status**: Clan Capital raid progress (loot, attacks, defenses)
- **Universal Events**: Exact dates/times for Clan Games (15-22), Season End

**Output:**
- `clashStatus/cwl` - Current CWL info
- `clashStatus/currentWar` - Active war details
- `clashStatus/raid` - Raid progress
- `universalEvents/*` - Calendar events with start/end times

---

## Automation

### Run on Schedule (Recommended)
To keep data fresh, run these scripts periodically:

**Option 1: GitHub Actions (Recommended)**
Create `.github/workflows/sync-clash-data.yml`:

```yaml
name: Sync Clash Data
on:
  schedule:
    - cron: '0 */4 * * *'  # Every 4 hours
  workflow_dispatch:

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npx ts-node scripts/syncClanData.ts
        env:
          COC_API_KEY: ${{ secrets.COC_API_KEY }}
      - run: npx ts-node scripts/syncClashCalendar.ts
        env:
          COC_API_KEY: ${{ secrets.COC_API_KEY }}
```

**Option 2: Firebase Cloud Functions**
Deploy a scheduled Cloud Function to run sync scripts.

**Option 3: Manual**
Run manually whenever needed:
```bash
npm run sync
```

---

## Setup Requirements

### 1. Get Clash of Clans API Key
1. Go to https://developer.clashofclans.com/#/login
2. Login with your Supercell ID
3. Create a new key:
   - **Name**: blueteamclan
   - **Description**: Website data sync
4. Add IP address of your server/computer
5. Copy the key

### 2. Configure Environment
Add to `.env.local`:
```
COC_API_KEY=your_api_key_here
```

### 3. Firebase Setup
- Firestore database configured ✓
- Security rules updated ✓ (see firestore.rules)
- Collections auto-created on first sync

---

## Data Collections

### Live Data (Updated by syncClashCalendar.ts)
- `clashStatus/cwl` - CWL info (refreshed every sync)
- `clashStatus/currentWar` - War details
- `clashStatus/raid` - Raid progress

### Events (Updated by both scripts)
- `universalEvents/{id}` - Auto-generated calendar (Clan Games, Season End)
- `events/{id}` - Custom clan events

### Members (Updated by syncClanData.ts)
- `members/{id}` - Clan member data

---

## Troubleshooting

### "API key not found"
- Make sure `.env.local` has `COC_API_KEY=...`
- Restart your terminal after adding env variable

### "Permission denied" error
- Firestore rules weren't deployed
- Run: `firebase deploy --only firestore:rules`
- Wait 30 seconds for changes to apply

### "No events generated"
- Run: `npx ts-node scripts/syncClashCalendar.ts`
- Check Firebase console to see if `universalEvents` collection was created

### "Old data showing"
- Run: `npx ts-node scripts/syncClanData.ts` to refresh
- Wait a few seconds for browser to reload

---

## Display on Website

### Events Page
- **Section 1**: Current Clan Activities (CWL, War, Raid cards)
- **Section 2**: Universal Clash Events (Clan Games, Season End with countdowns)
- **Section 3**: Scheduled Clan Events (Filterable by type)

### API Endpoints
All data is read from Firebase. No additional API calls needed in the app.

---

## Customization

### Add Custom Events
Manually add to `events` collection in Firebase:
```json
{
  "title": "Leadership Meeting",
  "description": "Discuss strategy",
  "date": "2025-12-15T19:00:00Z",
  "type": "meeting",
  "status": "scheduled"
}
```

### Modify Calendar Dates
Edit `scripts/syncClashCalendar.ts`:
- **Clan Games**: Change `startDay: 15` and `endDay: 22`
- **Season End**: Modify `getFirstSunday()` function

---

## Notes
- CWL data only available during CWL season
- War data only available when clan is actively in war
- Raid data only available during raid weekend
- Universal events are always generated (future dates)
