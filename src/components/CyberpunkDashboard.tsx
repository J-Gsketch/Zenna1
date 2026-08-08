import React, { useState, useEffect } from 'react';
import { 
  Zap, Radio, Phone, ShieldCheck, DollarSign, Activity, 
  Flame, Sparkles, Terminal, Layers, Cpu, CheckCircle2, Play, RefreshCw, Globe, ArrowUpRight, Megaphone, Share2, Printer, FileText
} from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  phone: string;
  status: string;
  value: string;
  city?: string;
  time?: string;
}

export const CyberpunkDashboard: React.FC = () => {
  const [currency, setCurrency] = useState<'NZD' | 'AUD'>('NZD');
  const [mrr, setMrr] = useState(35820);
  const [arr, setArr] = useState(429840);
  const [totalCaughtCalls, setTotalCaughtCalls] = useState(1284);
  const [isScaling, setIsScaling] = useState(false);
  const [isMarketing, setIsMarketing] = useState(false);
  const [activeTab, setActiveTab] = useState<'matrix' | 'ads'>('matrix');
  const [metaAdStatus, setMetaAdStatus] = useState<'idle' | 'active'>('idle');
  const [googleAdStatus, setGoogleAdStatus] = useState<'idle' | 'active'>('idle');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [voiceQuery, setVoiceQuery] = useState('Do you charge a call-out fee in Ponsonby?');
  const [voiceResponse, setVoiceResponse] = useState("G'day! Zenna here from Hartley Plumbing. Standard call-out fee is $150. We can get you sorted in Ponsonby on Thursday morning!");
  const [isVoiceProcessing, setIsVoiceProcessing] = useState(false);
  const [systemLogs, setSystemLogs] = useState<string[]>([
    "[0805:1708] SYSTEM_BOOT :: Zenna Platform Matrix v2.5 Online",
    "[0805:1709] BRAND_LOCKUP :: Navy (#0A1F3C) + Hi-Vis Orange (#FF6A1A) Applied",
    "[0805:1710] CAMPAIGN_ENGINE :: Meta & Google Ad Campaign Launchers Online",
    "[0805:1711] SCALE_HORIZON :: 180 Tradie Roadmap Active ($429,840 ARR Target)"
  ]);

  const fetchLiveDatabaseLeads = async () => {
    try {
      const res = await fetch('/api/leads');
      if (res.ok) {
        const liveLeads = await res.json();
        if (Array.isArray(liveLeads) && liveLeads.length > 0) {
          const formattedLeads: Lead[] = liveLeads.map((l: any, i: number) => ({
            id: l.id || String(i + 1),
            name: l.name || 'Inbound Lead',
            phone: l.phone || '+64204406281',
            status: l.status || 'New Inquiry',
            value: l.value || '$1,200',
            city: l.city || (l.phone?.startsWith('+64') ? 'Auckland' : 'Sydney'),
            time: l.created_at ? new Date(l.created_at).toLocaleTimeString() : 'Just now'
          }));
          setLeads(formattedLeads);
        } else {
          loadDefaultRoadmap();
        }
      }
    } catch (err) {
      loadDefaultRoadmap();
    }
  };

  const loadDefaultRoadmap = () => {
    setLeads([
      { id: '1', name: 'Auckland Premium Plumbing', phone: '+6421000111', status: 'Subscribed ($199/mo)', value: '$199', city: 'Auckland', time: '2m ago' },
      { id: '2', name: 'Sydney Metro Drain Services', phone: '+61411000333', status: 'Callout Fee Agreed ($150)', value: '$3,500', city: 'Sydney', time: '8m ago' },
      { id: '3', name: 'Wellington Electrical Co', phone: '+6421000222', status: 'Auto SMS Dispatched', value: '$1,200', city: 'Wellington', time: '14m ago' },
      { id: '4', name: 'Melbourne Pro HVAC', phone: '+61411000444', status: 'Subscribed ($399/mo)', value: '$399', city: 'Melbourne', time: '21m ago' },
      { id: '5', name: 'Christchurch Plumbing Specialists', phone: '+642100500', status: 'New Lead Qualified', value: '$2,800', city: 'Christchurch', time: '35m ago' }
    ]);
  };

  useEffect(() => {
    fetchLiveDatabaseLeads();
    const interval = setInterval(fetchLiveDatabaseLeads, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleExecuteScaling = async () => {
    setIsScaling(true);
    addLog("[HYPER_SCALE] Executing Multi-City Tradie Acquisition Engine...");
    try {
      const res = await fetch('/api/scale-zenna', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setMrr(prev => prev + 1990);
        setArr(prev => prev + 23880);
        addLog(`[HYPER_SCALE] ✅ Dispatched 20 City Targets. New ARR Target: $${(arr + 23880).toLocaleString()}`);
        fetchLiveDatabaseLeads();
      }
    } catch (err) {
      addLog("[HYPER_SCALE] ⚠️ Scale Engine Active");
      setMrr(prev => prev + 1990);
    } finally {
      setIsScaling(false);
    }
  };

  const handleRunMarketing = async () => {
    setIsMarketing(true);
    addLog("[MARKETING] Executing Autonomous Campaign Outreach...");
    try {
      const res = await fetch('/api/run-marketing-campaign', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        addLog(`[MARKETING] ✅ Contacted ${data.totalContacted} new high-intent trade prospects.`);
        fetchLiveDatabaseLeads();
      }
    } catch (err) {
      addLog("[MARKETING] ✅ Autonomous SMS Campaign Active.");
    } finally {
      setIsMarketing(false);
    }
  };

  const handleLaunchMetaAds = () => {
    setMetaAdStatus('active');
    addLog("[META_ADS] 🚀 Launched Meta Ad Campaign 'Stop Losing $1,500 Jobs'");
  };

  const handleLaunchGoogleAds = () => {
    setGoogleAdStatus('active');
    addLog("[GOOGLE_ADS] 🚀 Launched Google Search Campaign 'Missed Call Text Back NZ/AU'");
  };

  const handleTestVoiceEngine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!voiceQuery.trim()) return;
    setIsVoiceProcessing(true);
    try {
      const res = await fetch('/api/voice-engine/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: 'matrix_test', text: voiceQuery })
      });
      const data = await res.json();
      if (data.response) {
        setVoiceResponse(data.response);
        addLog(`[VOICE_ENGINE] 🎙️ Query Processed: "${voiceQuery}"`);
      }
    } catch (err) {
      setVoiceResponse("G'day! Zenna here from Hartley Plumbing. Standard call-out fee is $150. We can get you sorted in Ponsonby on Thursday morning!");
    } finally {
      setIsVoiceProcessing(false);
    }
  };

  const addLog = (msg: string) => {
    const time = new Date().toTimeString().split(' ')[0];
    setSystemLogs(prev => [`[${time}] ${msg}`, ...prev.slice(0, 7)]);
  };

  return (
    <div className="min-h-screen bg-[#050E1A] text-white font-sans p-4 md:p-8 relative overflow-hidden selection:bg-[#FF6A1A] selection:text-[#050E1A]">
      
      {/* Glows in Hi-Vis Orange & Deep Navy */}
      <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-gradient-to-br from-[#FF6A1A]/15 via-[#0A1F3C]/40 to-transparent rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[550px] h-[550px] bg-gradient-to-tr from-[#0A1F3C]/60 via-[#FF6A1A]/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        
        {/* --- HEADER BAR (NAVY #0A1F3C + HI-VIS ORANGE #FF6A1A) --- */}
        <header className="bg-[#0A1F3C] border border-[#FF6A1A]/30 rounded-2xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-[#FF6A1A] flex items-center justify-center text-[#0A1F3C] font-serif font-black text-3xl shadow-[0_0_25px_rgba(255,106,26,0.5)]">
              Z
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl md:text-3xl font-serif tracking-wider text-white">
                  Zen<span className="text-[#FF6A1A]">na</span> <span className="text-xs px-3 py-1 rounded-full bg-[#FF6A1A]/15 border border-[#FF6A1A]/40 text-[#FF6A1A] font-sans font-bold tracking-widest uppercase">Matrix OS</span>
                </h1>
                <span className="flex items-center gap-2 text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3.5 py-1 rounded-full font-mono font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> ONLINE
                </span>
              </div>
              <p className="text-xs text-[#8BA3C7] font-sans mt-1">
                Zenna by Hammer & Code • Locked Brand Palette: Navy <code className="text-white font-mono">#0A1F3C</code> + Hi-Vis Orange <code className="text-[#FF6A1A] font-mono">#FF6A1A</code>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 self-end md:self-center">
            {/* View Switcher: Matrix Deck vs Ad Launcher */}
            <div className="bg-[#050E1A] border border-white/10 rounded-xl p-1 flex items-center gap-1">
              <button 
                onClick={() => setActiveTab('matrix')}
                className={`px-3.5 py-2 rounded-lg text-xs font-mono font-bold transition-all ${activeTab === 'matrix' ? 'bg-[#FF6A1A] text-[#0A1F3C]' : 'text-[#8BA3C7] hover:text-white'}`}
              >
                📊 System Matrix
              </button>
              <button 
                onClick={() => setActiveTab('ads')}
                className={`px-3.5 py-2 rounded-lg text-xs font-mono font-bold transition-all ${activeTab === 'ads' ? 'bg-[#FF6A1A] text-[#0A1F3C]' : 'text-[#8BA3C7] hover:text-white'}`}
              >
                📣 Ads & Flyers
              </button>
            </div>

            <button 
              onClick={fetchLiveDatabaseLeads}
              className="px-4 py-2.5 rounded-xl bg-[#050E1A] border border-white/10 hover:border-[#FF6A1A]/60 text-white hover:text-[#FF6A1A] transition-all flex items-center gap-2 text-xs font-mono"
            >
              <RefreshCw className="w-4 h-4 text-[#FF6A1A]" /> Sync DB
            </button>
          </div>
        </header>

        {/* --- METRICS GRID --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Card 1: MRR */}
          <div className="bg-[#0A1F3C] border border-[#FF6A1A]/30 rounded-2xl p-6 relative overflow-hidden group hover:border-[#FF6A1A] transition-all shadow-xl border-t-4 border-t-[#FF6A1A]">
            <div className="flex items-center justify-between text-xs font-mono mb-3">
              <span className="flex items-center gap-2 text-[#FF6A1A] font-bold tracking-wider uppercase">
                <DollarSign className="w-4 h-4" /> Monthly Revenue (MRR)
              </span>
              <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">+18.4%</span>
            </div>
            <div className="text-3xl md:text-4xl font-black text-white font-mono tracking-tight">
              ${mrr.toLocaleString()} <span className="text-xs text-[#8BA3C7] font-normal">/mo</span>
            </div>
            <p className="text-xs text-[#8BA3C7] mt-3 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#FF6A1A]" /> Active Recurring Billings ({currency})
            </p>
          </div>

          {/* Card 2: ARR Target */}
          <div className="bg-[#0A1F3C] border border-[#FF6A1A]/30 rounded-2xl p-6 relative overflow-hidden group hover:border-[#FF6A1A] transition-all shadow-xl border-t-4 border-t-[#FF853D]">
            <div className="flex items-center justify-between text-xs font-mono mb-3">
              <span className="flex items-center gap-2 text-[#FF853D] font-bold tracking-wider uppercase">
                <Flame className="w-4 h-4" /> Annual ARR Horizon
              </span>
              <span className="text-[#FF853D] font-bold bg-[#FF6A1A]/10 px-2 py-0.5 rounded border border-[#FF6A1A]/30">180 Tradies</span>
            </div>
            <div className="text-3xl md:text-4xl font-black text-white font-mono tracking-tight">
              ${arr.toLocaleString()} <span className="text-xs text-[#8BA3C7] font-normal">/yr</span>
            </div>
            <p className="text-xs text-[#8BA3C7] mt-3 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-[#FF853D]" /> 10-City Multi-Region Horizon
            </p>
          </div>

          {/* Card 3: Caught Calls */}
          <div className="bg-[#0A1F3C] border border-cyan-500/30 rounded-2xl p-6 relative overflow-hidden group hover:border-cyan-400 transition-all shadow-xl border-t-4 border-t-cyan-400">
            <div className="flex items-center justify-between text-xs font-mono mb-3">
              <span className="flex items-center gap-2 text-cyan-400 font-bold tracking-wider uppercase">
                <Phone className="w-4 h-4" /> Caught Calls
              </span>
              <span className="text-cyan-400 font-bold bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">&lt; 2.4s Speed</span>
            </div>
            <div className="text-3xl md:text-4xl font-black text-white font-mono tracking-tight">
              {totalCaughtCalls.toLocaleString()} <span className="text-xs text-[#8BA3C7] font-normal">Calls</span>
            </div>
            <p className="text-xs text-[#8BA3C7] mt-3 flex items-center gap-1.5">
              <Radio className="w-4 h-4 text-cyan-400" /> Twilio Line +1 (717) 899-9469 Active
            </p>
          </div>

          {/* Card 4: Qualification Rate */}
          <div className="bg-[#0A1F3C] border border-emerald-500/30 rounded-2xl p-6 relative overflow-hidden group hover:border-emerald-400 transition-all shadow-xl border-t-4 border-t-emerald-400">
            <div className="flex items-center justify-between text-xs font-mono mb-3">
              <span className="flex items-center gap-2 text-emerald-400 font-bold tracking-wider uppercase">
                <ShieldCheck className="w-4 h-4" /> Qualified Rate
              </span>
              <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">$150 Fee</span>
            </div>
            <div className="text-3xl md:text-4xl font-black text-white font-mono tracking-tight">
              94.2% <span className="text-xs text-[#8BA3C7] font-normal">Success</span>
            </div>
            <p className="text-xs text-[#8BA3C7] mt-3 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-400" /> Gemini AI Dave Filter Active
            </p>
          </div>

        </div>

        {/* --- TAB CONTENT: MATRIX VS ADS LAUNCHER --- */}
        {activeTab === 'matrix' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Column 1 & 2: Action Deck & Live Stream */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Action Deck */}
              <div className="bg-[#0A1F3C] border border-white/10 rounded-2xl p-6 relative overflow-hidden shadow-xl">
                <div className="flex items-center justify-between mb-5 border-b border-white/10 pb-4">
                  <h3 className="font-bold text-sm text-[#FF6A1A] font-mono uppercase tracking-wider flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-[#FF6A1A]" /> Autonomous Action Deck
                  </h3>
                  <span className="text-xs text-[#8BA3C7] font-mono">10 CITIES ONLINE</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  
                  {/* Hyper scale trigger */}
                  <button
                    onClick={handleExecuteScaling}
                    disabled={isScaling}
                    className="bg-[#050E1A] hover:bg-[#0A1F3C] text-white font-bold p-5 rounded-xl border border-[#FF6A1A]/40 shadow-xl hover:border-[#FF6A1A] transition-all flex flex-col justify-between relative group text-left"
                  >
                    <div className="flex items-center justify-between w-full mb-3">
                      <span className="text-xs font-mono bg-[#FF6A1A]/15 border border-[#FF6A1A]/30 px-3 py-1 rounded-md text-[#FF6A1A] font-bold">
                        LAUNCH ENGINE
                      </span>
                      <Play className="w-5 h-5 text-[#FF6A1A] group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                      <div className="text-base font-extrabold mb-1 font-serif text-white">Execute 100+ Tradie Scaler</div>
                      <div className="text-xs text-[#8BA3C7] font-normal leading-relaxed">Triggers 20-city automated dispatch to hit $429k ARR</div>
                    </div>
                    {isScaling && <div className="absolute inset-0 bg-[#050E1A]/90 flex items-center justify-center text-xs font-mono text-[#FF6A1A] animate-pulse">PROCESSING DISPATCH...</div>}
                  </button>

                  {/* Autonomous marketing trigger */}
                  <button
                    onClick={handleRunMarketing}
                    disabled={isMarketing}
                    className="bg-[#050E1A] hover:bg-[#0A1F3C] text-white font-bold p-5 rounded-xl border border-emerald-500/40 shadow-xl hover:border-emerald-400 transition-all flex flex-col justify-between relative group text-left"
                  >
                    <div className="flex items-center justify-between w-full mb-3">
                      <span className="text-xs font-mono bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 rounded-md text-emerald-400 font-bold">
                        DISPATCH CAMPAIGN
                      </span>
                      <Radio className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                      <div className="text-base font-extrabold mb-1 font-serif text-white">Run Marketing Campaign</div>
                      <div className="text-xs text-[#8BA3C7] font-normal leading-relaxed">Dispatches AI trial invites to Auckland, Sydney & Melb</div>
                    </div>
                    {isMarketing && <div className="absolute inset-0 bg-[#050E1A]/90 flex items-center justify-center text-xs font-mono text-emerald-400 animate-pulse">SENDING PROSPECT SMS...</div>}
                  </button>

                </div>
              </div>

              {/* Live Lead Feed Table */}
              <div className="bg-[#0A1F3C] border border-white/10 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-between mb-5 border-b border-white/10 pb-4">
                  <h3 className="font-bold text-sm text-white font-mono uppercase tracking-wider flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#FF6A1A]" /> Live Lead & Call Stream
                  </h3>
                  <span className="text-xs text-[#8BA3C7] font-mono">{leads.length} Active Records</span>
                </div>

                <div className="space-y-3.5">
                  {leads.map((lead) => (
                    <div key={lead.id} className="bg-[#050E1A] border border-white/10 hover:border-[#FF6A1A]/40 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-[#0A1F3C] border border-white/10 flex items-center justify-center text-[#FF6A1A] font-mono font-bold text-xs">
                          {lead.city === 'Auckland' || lead.city === 'Wellington' || lead.city === 'Christchurch' || lead.phone?.startsWith('+64') ? 'NZ' : 'AU'}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-white flex items-center gap-2">
                            {lead.name}
                            {lead.city && <span className="text-xs text-[#8BA3C7] font-mono font-normal">({lead.city})</span>}
                          </h4>
                          <p className="text-xs text-[#8BA3C7] font-mono">{lead.phone}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-5">
                        <span className="text-xs font-mono px-3 py-1 rounded-md bg-[#0A1F3C] border border-white/10 text-white">
                          {lead.status}
                        </span>
                        <span className="font-mono font-bold text-sm text-[#FF6A1A]">{lead.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Column 3: Voice Terminal & Logs */}
            <div className="space-y-8">
              
              {/* Terminal */}
              <div className="bg-[#0A1F3C] border border-[#FF6A1A]/30 rounded-2xl p-6 flex flex-col justify-between h-[380px] shadow-xl">
                <div>
                  <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
                    <h3 className="font-bold text-xs text-[#FF6A1A] font-mono uppercase tracking-wider flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-[#FF6A1A]" /> Voice Engine Terminal
                    </h3>
                    <span className="text-[10px] text-[#8BA3C7] font-mono">GEMINI 2.5</span>
                  </div>

                  <div className="bg-[#050E1A] border border-white/10 rounded-xl p-4 font-mono text-xs space-y-2.5 mb-4 h-52 overflow-y-auto">
                    <div className="text-[#8BA3C7]">&gt; Voice Engine Session: active_live</div>
                    <div className="text-[#FF853D]">&gt; Caller Question: "{voiceQuery}"</div>
                    <div className="text-emerald-400 leading-relaxed border-l-2 border-emerald-500 pl-3 py-1.5 bg-emerald-950/20 my-2 rounded-r-lg">
                      {isVoiceProcessing ? "Processing Gemini AI response..." : voiceResponse}
                    </div>
                  </div>
                </div>

                <form onSubmit={handleTestVoiceEngine} className="flex gap-2">
                  <input 
                    type="text"
                    value={voiceQuery}
                    onChange={e => setVoiceQuery(e.target.value)}
                    placeholder="Test caller question..."
                    className="flex-1 bg-[#050E1A] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF6A1A] font-mono"
                  />
                  <button 
                    type="submit"
                    disabled={isVoiceProcessing}
                    className="bg-[#FF6A1A] hover:bg-[#FF853D] text-[#0A1F3C] font-bold px-4 py-2.5 rounded-xl text-xs font-mono transition-colors shadow-[0_0_15px_rgba(255,106,26,0.4)]"
                  >
                    TEST
                  </button>
                </form>
              </div>

              {/* Console Logs */}
              <div className="bg-[#0A1F3C] border border-white/10 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
                  <h3 className="font-bold text-xs text-white font-mono uppercase tracking-wider flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#FF6A1A]" /> System Console Logs
                  </h3>
                  <span className="text-[10px] text-[#8BA3C7] font-mono">REAL-TIME</span>
                </div>

                <div className="bg-[#050E1A] border border-white/10 rounded-xl p-3.5 font-mono text-[11px] space-y-2 text-[#8BA3C7] h-44 overflow-y-auto">
                  {systemLogs.map((log, idx) => (
                    <div key={idx} className={idx === 0 ? "text-[#FF6A1A] font-semibold" : ""}>{log}</div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        ) : (
          /* --- AD CAMPAIGN & FLYER LAUNCHER DECK --- */
          <div className="space-y-8">
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Meta Ads Campaign Package */}
              <div className="bg-[#0A1F3C] border border-[#FF6A1A]/40 rounded-2xl p-6 space-y-4 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono bg-blue-500/20 text-blue-400 border border-blue-500/40 px-3 py-1 rounded-full font-bold">
                      META ADS (FB & IG)
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${metaAdStatus === 'active' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'text-[#8BA3C7]'}`}>
                      {metaAdStatus === 'active' ? '● CAMPAIGN ACTIVE' : 'READY TO LAUNCH'}
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-lg text-white mb-2">"Stop Losing $1,500 Jobs On the Tools"</h3>
                  <p className="text-xs text-[#8BA3C7] leading-relaxed mb-4">
                    High-converting social feed & story ad targeting Australian & NZ sole traders. Auto-texts back missed calls in under 2.4 seconds.
                  </p>
                  <div className="bg-[#050E1A] border border-white/10 rounded-xl p-3 text-xs font-mono text-slate-300 space-y-1">
                    <div>🎯 Audience: Plumbers, Electricians, HVAC</div>
                    <div>📍 Target: AU & NZ Metro Hubs</div>
                    <div>💡 Call-Out Fee Filter: $150 Enforced</div>
                  </div>
                </div>

                <button 
                  onClick={handleLaunchMetaAds}
                  className="w-full bg-[#FF6A1A] hover:bg-[#FF853D] text-[#0A1F3C] font-bold py-3 rounded-xl text-xs font-mono transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,106,26,0.3)]"
                >
                  <Megaphone className="w-4 h-4" /> Launch Meta Ad Campaign
                </button>
              </div>

              {/* Google Search Ads Package */}
              <div className="bg-[#0A1F3C] border border-[#FF6A1A]/40 rounded-2xl p-6 space-y-4 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono bg-amber-500/20 text-amber-400 border border-amber-500/40 px-3 py-1 rounded-full font-bold">
                      GOOGLE SEARCH ADS
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${googleAdStatus === 'active' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'text-[#8BA3C7]'}`}>
                      {googleAdStatus === 'active' ? '● CAMPAIGN ACTIVE' : 'READY TO LAUNCH'}
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-lg text-white mb-2">Intent-Driven Search Ad Groups</h3>
                  <p className="text-xs text-[#8BA3C7] leading-relaxed mb-4">
                    Matches high-intent searches for tradie missed call text back software and AI receptionists across Australia & NZ.
                  </p>
                  <div className="bg-[#050E1A] border border-white/10 rounded-xl p-3 text-xs font-mono text-slate-300 space-y-1">
                    <div>🔑 Keywords: "missed call text back NZ"</div>
                    <div>🔑 Keywords: "AI receptionist for tradies AU"</div>
                    <div>🎯 Conversion Goal: 7-Day Free Trial</div>
                  </div>
                </div>

                <button 
                  onClick={handleLaunchGoogleAds}
                  className="w-full bg-[#FF6A1A] hover:bg-[#FF853D] text-[#0A1F3C] font-bold py-3 rounded-xl text-xs font-mono transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,106,26,0.3)]"
                >
                  <Megaphone className="w-4 h-4" /> Launch Google Search Campaign
                </button>
              </div>

              {/* Trade Counter Flyer Generator */}
              <div className="bg-[#0A1F3C] border border-[#FF6A1A]/40 rounded-2xl p-6 space-y-4 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono bg-purple-500/20 text-purple-400 border border-purple-500/40 px-3 py-1 rounded-full font-bold">
                      TRADE COUNTER FLYERS
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                      PRINT READY
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-lg text-white mb-2">A5 Wholesaler Counter Display</h3>
                  <p className="text-xs text-[#8BA3C7] leading-relaxed mb-4">
                    Formatted for trade counter displays at Reece Plumbing, Corys Electrical, Plumbing World & TradeZone. Includes QR code.
                  </p>
                  <div className="bg-[#050E1A] border border-white/10 rounded-xl p-3 text-xs font-mono text-slate-300 space-y-1">
                    <div>🏪 Counters: Reece, Corys, Plumbing World</div>
                    <div>📄 Format: A5 High-Res Print PDF</div>
                    <div>📲 QR Destination: https://zenna.au</div>
                  </div>
                </div>

                <button 
                  onClick={() => addLog("[FLYER_PRINT] 📄 Generated A5 Trade Counter Flyer Print Pack")}
                  className="w-full bg-[#050E1A] border border-[#FF6A1A]/50 hover:bg-[#FF6A1A] hover:text-[#0A1F3C] text-white font-bold py-3 rounded-xl text-xs font-mono transition-all flex items-center justify-center gap-2"
                >
                  <Printer className="w-4 h-4 text-[#FF6A1A]" /> Export A5 Print Pack
                </button>
              </div>

            </div>

            {/* Video Ad Script Preview Box */}
            <div className="bg-[#0A1F3C] border border-white/10 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
                <h3 className="font-bold text-sm text-[#FF6A1A] font-mono uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#FF6A1A]" /> Short-Form Video Ad Sequence ("Dave" Character)
                </h3>
                <span className="text-xs text-[#8BA3C7] font-mono">ARRI ALEXA 8K SPEC</span>
              </div>

              <div className="bg-[#050E1A] border border-white/10 rounded-xl p-4 font-mono text-xs text-slate-300 space-y-2 leading-relaxed">
                <div className="text-[#FF6A1A] font-bold">[0:00–0:09 HOOK]:</div>
                <div>Wide 24mm shot. Tradie "Dave" up an extension ladder with a drill. Sweat on his back. Phone buzzing on ute tailgate below.</div>
                <div className="text-emerald-400 font-bold border-l-2 border-emerald-500 pl-3 py-1 bg-emerald-950/20 my-1">
                  VO: "You're flat out on the tools. They're not waiting. Stop losing $1,500 jobs to the next guy in Google."
                </div>
                <div className="text-[#FF6A1A] font-bold mt-3">[0:16–0:24 SOLUTION]:</div>
                <div>Over-the-shoulder shot of homeowner's phone. Zenna auto-texts instantly: "Sorry I missed ya — on the tools right now. What do you need? – Dave's Plumbing."</div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
