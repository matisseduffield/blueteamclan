"use client";

import { useState, useEffect } from "react";
import { 
  Shield, Swords, Star, Clock, XCircle, Search, 
  RefreshCw, Calendar, Globe, Gift, Award, Layout
} from "lucide-react";

const useCurrentTime = () => {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  return now;
};

const formatDuration = (start: Date, end: Date) => {
  const totalSeconds = Math.floor((end.getTime() - start.getTime()) / 1000);
  if (totalSeconds < 0) return "Processing...";
  
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  // Omit seconds for a cleaner display
  return `${days}d ${hours}h ${minutes}m`;
};

const getEventStatus = (eventName: string, now: Date) => {
  const utcNow = now;
  const currentYear = utcNow.getUTCFullYear();
  const currentMonth = utcNow.getUTCMonth();
  const currentDay = utcNow.getUTCDate();
  const currentWeekday = utcNow.getUTCDay();

  let state = 'upcoming';
  let targetDate = new Date();
  let description = "";

  switch (eventName) {
    case 'Raid Weekend':
      const isWeekend = (currentWeekday === 5 && utcNow.getUTCHours() >= 7) || 
                        (currentWeekday === 6) || 
                        (currentWeekday === 0) || 
                        (currentWeekday === 1 && utcNow.getUTCHours() < 7);
      
      if (isWeekend) {
        state = 'active';
        const daysUntilMonday = (1 + 7 - currentWeekday) % 7;
        targetDate = new Date(Date.UTC(currentYear, currentMonth, currentDay + daysUntilMonday, 7, 0, 0));
        if (targetDate <= utcNow) targetDate.setDate(targetDate.getDate() + 7); 
      } else {
        state = 'upcoming';
        const daysUntilFriday = (5 + 7 - currentWeekday) % 7;
        targetDate = new Date(Date.UTC(currentYear, currentMonth, currentDay + daysUntilFriday, 7, 0, 0));
      }
      description = "Raids open every weekend";
      break;

    case 'Trader Refresh':
      state = 'upcoming';
      let daysUntilTuesday = (2 + 7 - currentWeekday) % 7;
      targetDate = new Date(Date.UTC(currentYear, currentMonth, currentDay + daysUntilTuesday, 8, 0, 0));
      
      if (targetDate <= utcNow) {
        targetDate.setDate(targetDate.getDate() + 7);
      }
      description = "Weekly deals reset";
      break;

    case 'CWL':
      const cwlStart = new Date(Date.UTC(currentYear, currentMonth, 1, 8, 0, 0));
      const cwlEnd = new Date(Date.UTC(currentYear, currentMonth, 11, 8, 0, 0));

      if (utcNow >= cwlStart && utcNow < cwlEnd) {
        state = 'active';
        targetDate = cwlEnd;
      } else {
        state = 'upcoming';
        targetDate = new Date(Date.UTC(currentYear, currentMonth + 1, 1, 8, 0, 0));
      }
      description = "Monthly War League";
      break;

    case 'Clan Games':
      const cgStart = new Date(Date.UTC(currentYear, currentMonth, 22, 8, 0, 0));
      const cgEnd = new Date(Date.UTC(currentYear, currentMonth, 28, 8, 0, 0));

      if (utcNow >= cgStart && utcNow < cgEnd) {
        state = 'active';
        targetDate = cgEnd;
      } else if (utcNow < cgStart) {
        state = 'upcoming';
        targetDate = cgStart;
      } else {
        state = 'upcoming';
        targetDate = new Date(Date.UTC(currentYear, currentMonth + 1, 22, 8, 0, 0));
      }
      description = "Complete challenges for rewards";
      break;

    case 'League Reset':
      let d = new Date(Date.UTC(currentYear, currentMonth + 1, 0));
      while (d.getUTCDay() !== 1) {
        d.setDate(d.getDate() - 1);
      }
      d.setUTCHours(5, 0, 0, 0);

      if (utcNow < d) {
        state = 'upcoming';
        targetDate = d;
      } else {
        d = new Date(Date.UTC(currentYear, currentMonth + 2, 0));
        while (d.getUTCDay() !== 1) {
          d.setDate(d.getDate() - 1);
        }
        d.setUTCHours(5, 0, 0, 0);
        state = 'upcoming';
        targetDate = d;
      }
      description = "Legend League trophy reset";
      break;

    case 'Season End':
      state = 'upcoming';
      targetDate = new Date(Date.UTC(currentYear, currentMonth + 1, 1, 8, 0, 0));
      description = "Gold Pass & Monthly Season";
      break;

    default:
      break;
  }

  return { state, targetDate, description };
};

type EventCardProps = {
  title: string;
  icon: any;
  colorClass: string;
  now: Date;
};

const EventCard = ({ title, icon: Icon, colorClass, now }: EventCardProps) => {
  const { state, targetDate, description } = getEventStatus(title, now);
  const timeLeft = formatDuration(now, targetDate);
  const isActive = state === 'active';

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 relative overflow-hidden group hover:border-slate-600 transition-colors">
      {isActive && (
        <div className="absolute top-0 right-0 p-2">
          <span className="flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
        </div>
      )}
      
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className={`p-3 rounded-lg ${colorClass} bg-opacity-20 text-white`}>
          <Icon size={24} />
        </div>
        <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${isActive ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-slate-400'}`}>
          {isActive ? 'Active Now' : 'Upcoming'}
        </div>
      </div>

      <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
      <p className="text-slate-400 text-xs mb-4 h-8">{description}</p>

      <div className="bg-slate-900/50 rounded-lg p-2 border border-slate-700/50">
        <div className="text-[10px] text-slate-500 uppercase mb-1">
          {isActive ? 'Ends In' : title === 'Trader Refresh' ? 'Refreshes In' : 'Starts In'}
        </div>
        <div className="font-mono text-xl font-bold text-slate-200 tabular-nums tracking-tight">
          {timeLeft}
        </div>
      </div>
    </div>
  );
};

const WarTracker = () => {
  const [status, setStatus] = useState('loading');
  const [logs, setLogs] = useState<{ time: string; msg: string }[]>([]);
  const [warData, setWarData] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isCWL, setIsCWL] = useState(false);
  const [cwlStandings, setCWLStandings] = useState<any[]>([]);
  const [groupData, setGroupData] = useState<any>(null);

  const clanTag = "#2Q98GJ0J2";
  const apiBase = process.env.NEXT_PUBLIC_COC_PROXY_URL || 'https://blueteamclan-production.up.railway.app/api/coc';

  const addLog = (message: string) => {
    setLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), msg: message }]);
  };

  const formatTag = (tag: string) => encodeURIComponent(tag);

  const fetchWarData = async () => {
    setStatus('loading');
    setLogs([]);
    setWarData(null);
    setCWLStandings([]);
    setErrorMessage("");

    addLog(`[DEBUG-V2] Starting fetch for Clan Tag: ${clanTag}`);
    addLog(`[DEBUG-V2] Using API base: ${apiBase}`);

    try {
      addLog("Step 1: Fetching League Group...");
      const groupUrl = `${apiBase}?endpoint=/clans/${formatTag(clanTag)}/currentwar/leaguegroup`;
      addLog(`League Group Request URL: ${groupUrl}`);
      const groupRes = await fetch(groupUrl);
      const groupRaw = await groupRes.text();
      addLog(`League Group Raw Response: ${groupRaw}`);
      if (!groupRes.ok) {
        addLog(`League group fetch failed: ${groupRes.status} ${groupRes.statusText}`);
        addLog(`League group error response body: ${groupRaw}`);
        // Always log diagnostics before returning
        addLog(`apiBase: ${apiBase}`);
        addLog(`Request URL: ${groupUrl}`);
        addLog(`Response Status: ${groupRes.status}`);
        addLog(`Response Body: ${groupRaw}`);
        if (groupRes.status === 404) {
          addLog("Clan is not currently in a Clan War League.");
          setStatus('nowar');
          return;
        }
        if (groupRes.status === 403) throw new Error("Access Denied (403). IP Restricted or Invalid API Key.");
        throw new Error(`API Error: ${groupRes.status} ${groupRes.statusText}`);
      }
      let groupData;
      try {
        groupData = JSON.parse(groupRaw);
      } catch (e) {
        addLog('Error parsing league group response as JSON.');
        setStatus('error');
        return;
      }
      const season = groupData.season;
      setGroupData(groupData);
      
      // Step 2: Calculate cumulative standings from all rounds
      addLog("Step 2: Calculating cumulative CWL standings...");
      addLog("Using war stars +10 win bonus on completed wars; active wars count live stars without bonus. Destruction (sum of attack % where available) is the tie-breaker.");
      
      // Initialize standings map for all clans
      const standingsMap = new Map<string, any>();
      (groupData.clans || []).forEach((clan: any) => {
        standingsMap.set(clan.tag, {
          tag: clan.tag,
          name: clan.name,
          totalStars: 0,
          totalDestruction: 0,
          warCount: 0,
          wins: 0,
          badge: clan.badgeUrls,
        });
      });
      
      // Iterate through all rounds and sum up stats
      const rounds = groupData.rounds || [];
      addLog(`Processing ${rounds.length} rounds...`);
      
      // First, process ALL wars in ALL rounds before calculating final standings
      const allWars: any[] = [];
      
      for (let roundIdx = 0; roundIdx < rounds.length; roundIdx++) {
        const round = rounds[roundIdx];
        const warTags = round.warTags || [];
        const activeWarTags = warTags.filter((t: string) => t !== "#0");
        addLog(`Round ${roundIdx + 1}: ${warTags.length} total tags, ${activeWarTags.length} active wars: ${activeWarTags.join(", ")}`);
        
        // Fetch each war in this round
        for (const warTag of warTags) {
          if (warTag === "#0") continue;
          
          try {
            const warUrl = `${apiBase}?endpoint=/clanwarleagues/wars/${formatTag(warTag)}`;
            addLog(`War Request URL for ${warTag}: ${warUrl}`);
            const warRes = await fetch(warUrl);
            const warRaw = await warRes.text();
            addLog(`War Raw Response for ${warTag}: ${warRaw}`);
            if (!warRes.ok) {
              addLog(`War fetch failed ${warTag}: ${warRes.status}`);
              addLog(`War error response body for ${warTag}: ${warRaw}`);
              continue;
            }
            let warData;
            try {
              warData = JSON.parse(warRaw);
            } catch (e) {
              addLog(`Error parsing war response for ${warTag} as JSON.`);
              continue;
            }
            allWars.push(warData);
            addLog(`War: ${warData.clan.name} (${warData.clan.stars}⭐) vs ${warData.opponent.name} (${warData.opponent.stars}⭐)`);
          } catch (e) {
            addLog(`Error fetching war ${warTag}: ${e}`);
          }
        }
      }
      
      // Now process all wars and accumulate stats
      addLog(`Processing ${allWars.length} total wars...`);
      const completedWars = allWars.filter((w) => w.state === 'warEnded');
      const activeWars = allWars.filter((w) => w.state === 'inWar');
      addLog(`Completed wars: ${completedWars.length}; Active wars: ${activeWars.length}`);

      // Determine winner for win bonus (+10 war stars) and tie-breaker
      const resolveOutcome = (a: any, b: any) => {
        if ((a.stars || 0) > (b.stars || 0)) return 'a';
        if ((a.stars || 0) < (b.stars || 0)) return 'b';
        if ((a.destructionPercentage || 0) > (b.destructionPercentage || 0)) return 'a';
        if ((a.destructionPercentage || 0) < (b.destructionPercentage || 0)) return 'b';
        return 'tie';
      };

      // Compute total destruction as sum of each member attack's destruction (preferred) or null if unavailable
      const sumAttackDestruction = (war: any, clanSide: 'clan' | 'opponent') => {
        const members = war?.[clanSide]?.members || [];
        if (!Array.isArray(members) || members.length === 0) return null;

        let total = 0;
        let countedAttacks = 0;
        for (const m of members) {
          if (!m?.attacks) continue;
          for (const atk of m.attacks) {
            total += atk?.destructionPercentage || 0;
            countedAttacks += 1;
          }
        }
        if (countedAttacks === 0) return null;
        return total;
      };

      for (const warData of completedWars) {
        const winner = resolveOutcome(warData.clan, warData.opponent);

        const applyWarStats = (entryTag: string, side: any, result: 'win' | 'lose' | 'tie', attackDestruction: number | null) => {
          if (!standingsMap.has(entryTag)) return;
          const entry = standingsMap.get(entryTag);
          const winBonus = result === 'win' ? 10 : 0;
          entry.totalStars += (side.stars || 0) + winBonus;
          // Prefer sum of attack destruction; fallback to war-wide destructionPercentage if attacks unavailable
          if (attackDestruction !== null) {
            entry.totalDestruction += attackDestruction;
          } else {
            entry.totalDestruction += side.destructionPercentage || 0;
          }
          entry.warCount += 1;
          if (result === 'win') entry.wins += 1;
        };

        const clanResult = winner === 'a' ? 'win' : winner === 'b' ? 'lose' : 'tie';
        const oppResult = winner === 'b' ? 'win' : winner === 'a' ? 'lose' : 'tie';

        const clanAttackDestruction = sumAttackDestruction(warData, 'clan');
        const oppAttackDestruction = sumAttackDestruction(warData, 'opponent');

        applyWarStats(warData.clan.tag, warData.clan, clanResult, clanAttackDestruction);
        applyWarStats(warData.opponent.tag, warData.opponent, oppResult, oppAttackDestruction);
      }

      // Add live (inWar) wars without win bonus for real-time ladder view
      const applyLiveWarStats = (entryTag: string, side: any, attackDestruction: number | null) => {
        if (!standingsMap.has(entryTag)) return;
        const entry = standingsMap.get(entryTag);
        entry.totalStars += side.stars || 0;
        if (attackDestruction !== null) {
          entry.totalDestruction += attackDestruction;
        } else {
          entry.totalDestruction += side.destructionPercentage || 0;
        }
        entry.warCount += 1;
      };

      for (const warData of activeWars) {
        const clanAttackDestruction = sumAttackDestruction(warData, 'clan');
        const oppAttackDestruction = sumAttackDestruction(warData, 'opponent');
        applyLiveWarStats(warData.clan.tag, warData.clan, clanAttackDestruction);
        applyLiveWarStats(warData.opponent.tag, warData.opponent, oppAttackDestruction);
        addLog(`Live war included: ${warData.clan.name} (${warData.clan.stars}⭐) vs ${warData.opponent.name} (${warData.opponent.stars}⭐)`);
      }
      
      // Convert map to array
      const standings = Array.from(standingsMap.values()).map((clan: any) => ({
        tag: clan.tag,
        name: clan.name,
        stars: clan.totalStars,
        destruction: clan.totalDestruction,
        warCount: clan.warCount,
        wins: clan.wins,
        badge: clan.badge,
      }));
      
      // Sort by stars, then destruction (tie-breaker)
      standings.sort((a: any, b: any) => {
        if (b.stars !== a.stars) return b.stars - a.stars;
        return b.destruction - a.destruction;
      });
      
      setCWLStandings(standings);
      addLog(`Calculated standings for ${standings.length} clans`);
      
      // Log standings for debugging
      standings.forEach((clan: any, idx: number) => {
        const clanData = standingsMap.get(clan.tag);
        addLog(`#${idx + 1}: ${clan.name} - ${clan.stars} stars, ${clan.destruction.toFixed(1)}% destruction (${clanData?.warCount || 0} wars, ${clanData?.wins || 0} wins)`);
      });
      
      // Summary
      addLog(`=== FINAL STANDINGS ===`);
      addLog(`Total clans: ${standings.length}`);
      addLog(`Total wars processed (all): ${allWars.length}`);
      addLog(`Total wars counted (ended only): ${completedWars.length}`);
      addLog(`Expected wars in CWL: 28 (8 clans × 7 rounds / 2)`);
      const myCllan = standings.find((c: any) => c.tag === clanTag);
      if (myCllan) {
        const myData = standingsMap.get(clanTag);
        addLog(`Blue Team Clan: ${myCllan.stars} stars, ${myCllan.destruction.toFixed(1)}% destruction (${myData?.warCount || 0} wars, ${myData?.wins || 0} wins, Position: ${standings.indexOf(myCllan) + 1})`);
      }
      
      // Step 3: Find the current war (if any) for war display
      addLog("Step 3: Looking for current war matchup across all rounds...");

      const stateScore: Record<string, number> = { inWar: 3, preparation: 2, warEnded: 1 };

      // Reuse allWars fetched earlier; pick the best match for this clan
      const candidateWars = allWars.filter((w: any) => w && (w.clan.tag === clanTag || w.opponent.tag === clanTag));
      addLog(`Found ${candidateWars.length} wars involving clan; prioritizing in-war over prep.`);

      const foundWar = candidateWars
        .sort((a: any, b: any) => {
          const sa = stateScore[a.state] ?? 0;
          const sb = stateScore[b.state] ?? 0;
          if (sb !== sa) return sb - sa;
          // If same state, prefer the one ending later (newer war)
          const endA = a.endTime ? Date.parse(a.endTime) : 0;
          const endB = b.endTime ? Date.parse(b.endTime) : 0;
          return endB - endA;
        })[0];

      if (foundWar) {
        addLog(`Match found! Using war in state: ${foundWar.state}`);
        addLog(`Current War -> ${foundWar.clan.name}: ${foundWar.clan.stars}⭐, ${foundWar.clan.destructionPercentage}% destruction, attacks used: ${foundWar.clan.attacks || 0}`);
        addLog(`Current War -> ${foundWar.opponent.name}: ${foundWar.opponent.stars}⭐, ${foundWar.opponent.destructionPercentage}% destruction, attacks used: ${foundWar.opponent.attacks || 0}`);
        setWarData(foundWar);
        setIsCWL(true); // This is from CWL endpoint
        setStatus('success');
      } else {
        addLog("No war found for this clan.");
        setStatus('nowar');
      }

    } catch (error: any) {
      setErrorMessage(error.message);
      setStatus('error');
      addLog(`Error: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchWarData();
  }, []);

  const renderStatusBadge = (state: string) => {
    switch(state) {
      case 'inWar': return <span className="px-3 py-1 bg-red-500 text-white rounded-full text-sm font-bold animate-pulse">In War</span>;
      case 'preparation': return <span className="px-3 py-1 bg-yellow-500 text-white rounded-full text-sm font-bold">Preparation</span>;
      default: return <span className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm font-bold">{state}</span>;
    }
  };

  const getMyClan = (war: any) => war.clan.tag === clanTag ? war.clan : war.opponent;
  const getEnemyClan = (war: any) => war.clan.tag === clanTag ? war.opponent : war.clan;

  return (
    <div className="animate-in fade-in duration-500">
      {status === 'loading' && (
        <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 shadow-xl text-center">
          <RefreshCw className="animate-spin mx-auto mb-4 text-yellow-500" size={32}/>
          <h2 className="text-xl font-semibold text-white mb-2">Scanning for Active Wars...</h2>
          <p className="text-slate-400 text-sm">Checking CWL status for {clanTag}</p>
        </div>
      )}

      {status === 'nowar' && (
        <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 shadow-xl text-center">
          <div className="text-6xl mb-4">😴</div>
          <h2 className="text-2xl font-bold text-white mb-2">No Active War [V2-DEPLOYED]</h2>
          <p className="text-slate-400">The clan is not currently in a CWL war.</p>
        </div>
      )}

      {status === 'error' && (
        <div className="bg-red-900/20 border border-red-800 text-red-200 p-6 rounded-xl flex items-start gap-3">
          <XCircle className="shrink-0 mt-0.5" size={24} />
          <div>
            <h3 className="font-bold text-lg mb-1">Failed to Fetch War Data</h3>
            <p className="text-sm opacity-90">{errorMessage}</p>
          </div>
        </div>
      )}

      {status === 'success' && warData && (() => {
        const myClan = getMyClan(warData);
        const enemyClan = getEnemyClan(warData);
        const teamSize = warData.teamSize || 15;
        const maxStars = teamSize * 3;
        const attacksPerPlayer = isCWL ? 1 : 2;
        const maxAttacks = teamSize * attacksPerPlayer;
        
        return (
          <div className="space-y-6">
            {/* War Type & Status Banner */}
            <div className="flex flex-col items-center gap-3">
              <div className="text-2xl font-bold text-white">
                {isCWL ? 'Clan War League' : 'Clan War'}
              </div>
              {renderStatusBadge(warData.state)}
            </div>

            {/* Main War Display */}
            <div className="bg-gradient-to-b from-slate-900 to-black rounded-2xl border border-slate-800/50 p-8 md:p-12 relative overflow-hidden">
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/10 via-transparent to-blue-900/10"></div>
              
              <div className="flex flex-col md:flex-row justify-between items-center gap-12 relative z-10">
                {/* Blue Team (Our Clan) */}
                <div className="flex flex-col items-center text-center flex-1">
                  <div className="relative group mb-6">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
                    <div className="relative w-28 h-28 rounded-2xl overflow-hidden ring-4 ring-cyan-500/30 group-hover:ring-cyan-400/50 transition-all duration-500">
                      <img
                        src={myClan.badgeUrls?.medium || myClan.badgeUrls?.small}
                        alt={myClan.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-white mb-2">{myClan.name}</h2>
                  <p className="text-sm text-slate-500 mb-6">Team Size: {teamSize}</p>
                  
                  {/* Stats Grid */}
                  <div className="space-y-3 w-full max-w-[280px]">
                    {/* Stars */}
                    <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 backdrop-blur-sm border border-yellow-500/20 rounded-xl p-4 hover:border-yellow-500/40 transition-all duration-300">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Star size={18} className="text-yellow-400" fill="currentColor" />
                          <span className="text-sm font-semibold text-yellow-400">Stars</span>
                        </div>
                        <span className="text-xs text-slate-500">of {maxStars}</span>
                      </div>
                      <div className="text-3xl font-black text-white">
                        {myClan.stars}<span className="text-xl text-slate-600">/{maxStars}</span>
                      </div>
                      <div className="mt-2 h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400 transition-all duration-500"
                          style={{ width: `${(myClan.stars / maxStars) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Destruction */}
                    <div className="bg-gradient-to-br from-red-500/10 to-red-600/5 backdrop-blur-sm border border-red-500/20 rounded-xl p-4 hover:border-red-500/40 transition-all duration-300">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Swords size={18} className="text-red-400" />
                          <span className="text-sm font-semibold text-red-400">Destruction</span>
                        </div>
                      </div>
                      <div className="text-3xl font-black text-white">
                        {myClan.destructionPercentage.toFixed(1)}<span className="text-xl text-slate-600">%</span>
                      </div>
                      <div className="mt-2 h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-red-500 to-red-400 transition-all duration-500"
                          style={{ width: `${myClan.destructionPercentage}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Attacks Used */}
                    <div className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-4 hover:border-cyan-500/40 transition-all duration-300">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Shield size={18} className="text-cyan-400" />
                          <span className="text-sm font-semibold text-cyan-400">Attacks</span>
                        </div>
                      </div>
                      <div className="text-3xl font-black text-white">
                        {myClan.attacks || 0}<span className="text-xl text-slate-600">/{maxAttacks}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* VS Divider */}
                <div className="flex flex-col items-center justify-center">
                  <div className="text-5xl md:text-6xl font-black bg-gradient-to-br from-slate-700 to-slate-800 bg-clip-text text-transparent">
                    VS
                  </div>
                </div>

                {/* Enemy Clan */}
                <div className="flex flex-col items-center text-center flex-1">
                  <div className="relative group mb-6">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
                    <div className="relative w-28 h-28 rounded-2xl overflow-hidden ring-4 ring-red-500/30 group-hover:ring-red-400/50 transition-all duration-500">
                      <img
                        src={enemyClan.badgeUrls?.medium || enemyClan.badgeUrls?.small}
                        alt={enemyClan.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-white mb-2">{enemyClan.name}</h2>
                  <p className="text-sm text-slate-500 mb-6">Team Size: {teamSize}</p>
                  
                  {/* Stats Grid */}
                  <div className="space-y-3 w-full max-w-[280px]">
                    {/* Stars */}
                    <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 backdrop-blur-sm border border-yellow-500/20 rounded-xl p-4 hover:border-yellow-500/40 transition-all duration-300">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Star size={18} className="text-yellow-400" fill="currentColor" />
                          <span className="text-sm font-semibold text-yellow-400">Stars</span>
                        </div>
                        <span className="text-xs text-slate-500">of {maxStars}</span>
                      </div>
                      <div className="text-3xl font-black text-white">
                        {enemyClan.stars}<span className="text-xl text-slate-600">/{maxStars}</span>
                      </div>
                      <div className="mt-2 h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400 transition-all duration-500"
                          style={{ width: `${(enemyClan.stars / maxStars) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Destruction */}
                    <div className="bg-gradient-to-br from-red-500/10 to-red-600/5 backdrop-blur-sm border border-red-500/20 rounded-xl p-4 hover:border-red-500/40 transition-all duration-300">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Swords size={18} className="text-red-400" />
                          <span className="text-sm font-semibold text-red-400">Destruction</span>
                        </div>
                      </div>
                      <div className="text-3xl font-black text-white">
                        {enemyClan.destructionPercentage.toFixed(1)}<span className="text-xl text-slate-600">%</span>
                      </div>
                      <div className="mt-2 h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-red-500 to-red-400 transition-all duration-500"
                          style={{ width: `${enemyClan.destructionPercentage}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Attacks Used */}
                    <div className="bg-gradient-to-br from-red-500/10 to-orange-600/5 backdrop-blur-sm border border-red-500/20 rounded-xl p-4 hover:border-red-500/40 transition-all duration-300">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Shield size={18} className="text-red-400" />
                          <span className="text-sm font-semibold text-red-400">Attacks</span>
                        </div>
                      </div>
                      <div className="text-3xl font-black text-white">
                        {enemyClan.attacks || 0}<span className="text-xl text-slate-600">/{maxAttacks}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CWL Standings */}
            {isCWL && cwlStandings.length > 0 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">CWL Standings</h3>
                  <p className="text-sm text-slate-400">Season {groupData?.season || 'Current'} - {groupData?.tier || 'League'}</p>
                </div>
                <div className="grid gap-3">
                  {cwlStandings.map((clan, idx) => {
                    const isMyClan = clan.tag === clanTag;
                    return (
                      <div 
                        key={clan.tag}
                        className={`relative overflow-hidden rounded-xl border transition-all duration-300 ${
                          isMyClan 
                            ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-cyan-500/50 ring-2 ring-cyan-500/30' 
                            : 'bg-slate-900/50 border-slate-800/50 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-4 p-4">
                          {/* Rank */}
                          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-800/50 text-center">
                            <span className="font-black text-lg text-white">#{idx + 1}</span>
                          </div>

                          {/* Badge */}
                          <div className="w-12 h-12 rounded-xl overflow-hidden ring-2 ring-slate-700 flex-shrink-0">
                            <img
                              src={clan.badge?.medium || clan.badge?.small}
                              alt={clan.name}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Clan Name */}
                          <div className="flex-grow min-w-0">
                            <h4 className="text-white font-bold truncate">{clan.name}</h4>
                            {isMyClan && (
                              <span className="text-xs text-cyan-400 font-semibold">YOUR CLAN</span>
                            )}
                          </div>

                          {/* Stars & destruction tie-breaker */}
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 bg-yellow-500/20 px-4 py-2 rounded-lg border border-yellow-500/30 min-w-fit">
                              <Star size={18} className="text-yellow-400" fill="currentColor" />
                              <div className="flex flex-col leading-tight">
                                <span className="text-[11px] uppercase tracking-wide text-yellow-200/80">War Stars</span>
                                <span className="font-bold text-yellow-400 text-lg">{clan.stars}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 bg-slate-800/70 px-4 py-2 rounded-lg border border-slate-700 min-w-fit">
                              <Swords size={18} className="text-cyan-300" />
                              <div className="flex flex-col leading-tight text-left">
                                <span className="text-[11px] uppercase tracking-wide text-slate-300/70">Destruction</span>
                                <span className="font-bold text-white text-lg">{clan.destruction?.toFixed(1) || '0.0'}%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })()}

      <div className="bg-black/40 rounded-lg p-4 font-mono text-xs border border-white/5 h-48 overflow-y-auto mt-6">
        <div className="text-slate-500 mb-2 border-b border-white/10 pb-1">System Logs</div>
        {logs.length === 0 ? (
          <span className="text-slate-600 italic">Initializing...</span>
        ) : (
          logs.map((log, i) => (
            <div key={i} className="mb-1">
              <span className="text-slate-500">[{log.time}]</span> <span className="text-green-400">{log.msg}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState('tracker');
  
  const now = useCurrentTime();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-yellow-500/30">
      <div className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50 backdrop-blur-md bg-opacity-90">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-yellow-500 p-2 rounded-lg">
                <Swords size={20} className="text-slate-900" />
              </div>
              <span className="font-bold text-lg hidden sm:block">Clash Manager</span>
            </div>
            
            <div className="flex space-x-1 bg-slate-900/50 p-1 rounded-lg">
              <button 
                onClick={() => setActiveTab('tracker')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'tracker' 
                    ? 'bg-slate-700 text-white shadow-sm' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                War Tracker
              </button>
              <button 
                onClick={() => setActiveTab('events')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'events' 
                    ? 'bg-slate-700 text-white shadow-sm' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Global Events
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-4 md:p-8">
        {activeTab === 'tracker' && (
          <WarTracker />
        )}

        {activeTab === 'events' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-8">
            {(() => {
              const events = [
                { title: 'Raid Weekend', icon: Swords, colorClass: 'bg-red-500' },
                { title: 'Trader Refresh', icon: Gift, colorClass: 'bg-blue-500' },
                { title: 'CWL', icon: Award, colorClass: 'bg-yellow-500' },
                { title: 'Clan Games', icon: Layout, colorClass: 'bg-emerald-500' },
                { title: 'League Reset', icon: Calendar, colorClass: 'bg-indigo-500' },
                { title: 'Season End', icon: Calendar, colorClass: 'bg-green-500' },
              ];

              const withStatus = events.map(ev => {
                const status = getEventStatus(ev.title, now);
                return { ...ev, ...status };
              });

              const activeEvents = withStatus.filter(e => e.state === 'active');
              const upcomingEvents = withStatus
                .filter(e => e.state === 'upcoming')
                .sort((a, b) => a.targetDate.getTime() - b.targetDate.getTime());
              const nextEvent = upcomingEvents[0];

              const formatUTC = (d: Date) => d.toUTCString().replace('GMT', 'UTC');

              return (
                <>
                  {/* Hero / Control Center */}
                  <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900/70 to-black shadow-2xl p-6 md:p-8">
                    <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.25),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(99,102,241,0.25),transparent_35%),radial-gradient(circle_at_50%_80%,rgba(16,185,129,0.25),transparent_40%)]" />
                    <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                      <div className="space-y-3 max-w-xl">
                        <div className="inline-flex items-center gap-2 bg-slate-800/70 border border-slate-700 rounded-full px-3 py-1 text-xs uppercase tracking-widest text-slate-300">
                          <Clock size={14} className="text-yellow-400" />
                          Live Global Events (UTC)
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black text-white leading-tight">Events Command Center</h1>
                        <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                          Track every live and upcoming Clash of Clans beat—CWL windows, Raid Weekends, Games, and resets—updated in real time.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {activeEvents.length > 0 ? (
                            activeEvents.map(ev => (
                              <span key={ev.title} className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/40 text-green-200 text-xs font-semibold">
                                <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                                {ev.title} Active — ends in {formatDuration(now, ev.targetDate)}
                              </span>
                            ))
                          ) : (
                            <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold">
                              No events active right now
                            </span>
                          )}
                        </div>
                        {nextEvent && (
                          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-200">
                            <div className="flex items-center gap-2 bg-slate-800/60 border border-slate-700 rounded-xl px-3 py-2">
                              <Calendar size={16} className="text-cyan-300" />
                              <span className="font-semibold">Next Up: {nextEvent.title}</span>
                            </div>
                            <div className="flex items-center gap-2 bg-slate-800/60 border border-slate-700 rounded-xl px-3 py-2">
                              <Clock size={16} className="text-yellow-300" />
                              <span className="font-mono text-yellow-200">{formatDuration(now, nextEvent.targetDate)}</span>
                            </div>
                            <div className="text-slate-400">{formatUTC(nextEvent.targetDate)}</div>
                          </div>
                        )}
                      </div>

                      <div className="w-full lg:w-auto">
                        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3 shadow-lg min-w-[260px]">
                          <div className="flex items-center justify-between text-slate-400 text-xs uppercase tracking-widest">
                            <span>Current UTC</span>
                            <Clock size={14} className="text-yellow-400" />
                          </div>
                          <div className="font-mono text-3xl text-yellow-400 tracking-tight">
                            {now.toUTCString().slice(17, 25)}
                          </div>
                          <div className="text-xs text-slate-500">{now.toUTCString().replace('GMT', 'UTC')}</div>
                          <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                            <div className="bg-slate-800/70 rounded-lg p-2 border border-slate-700/70">
                              <div className="text-slate-400">Active</div>
                              <div className="text-lg font-bold text-green-300">{activeEvents.length}</div>
                            </div>
                            <div className="bg-slate-800/70 rounded-lg p-2 border border-slate-700/70">
                              <div className="text-slate-400">Upcoming</div>
                              <div className="text-lg font-bold text-cyan-300">{upcomingEvents.length}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Timeline / Notes */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="lg:col-span-2 bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-4">
                      <div className="flex items-center gap-2 text-slate-300 font-semibold">
                        <Clock size={16} className="text-cyan-300" />
                        Upcoming Timeline (UTC)
                      </div>
                      <div className="space-y-3">
                        {upcomingEvents.length === 0 && (
                          <div className="text-slate-500 text-sm">No upcoming events detected.</div>
                        )}
                        {upcomingEvents.map(ev => (
                          <div key={ev.title} className="flex items-center justify-between bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className={`h-10 w-10 rounded-lg flex items-center justify-center text-white ${ev.colorClass} bg-opacity-70`}> 
                                <ev.icon size={18} />
                              </div>
                              <div>
                                <div className="text-white font-semibold">{ev.title}</div>
                                <div className="text-xs text-slate-400">{formatUTC(ev.targetDate)}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-yellow-300 font-mono text-sm">{formatDuration(now, ev.targetDate)}</div>
                              <div className="text-xs text-slate-500">Starts in</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-blue-900/10 border border-blue-800/40 rounded-2xl p-5 text-sm text-blue-100 space-y-3">
                      <div className="flex items-center gap-2 font-semibold text-white">
                        <Globe size={16} className="text-blue-300" />
                        UTC Synced & Tie-breaks
                      </div>
                      <p className="text-blue-100/80 leading-relaxed">
                        All timers are aligned to Supercell server time (UTC). Use the countdowns to plan war hits, Clan Games points, and capital raids with precision.
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-blue-100/70">
                        <li>Active events update live; no refresh needed.</li>
                        <li>Upcoming events sorted by soonest start.</li>
                        <li>Current time panel mirrors server UTC.</li>
                      </ul>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}
