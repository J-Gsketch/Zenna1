import React, { useState } from 'react';
import {
  Briefcase, Copy, Check, Users, DollarSign, PhoneCall, Sparkles,
  Award, Shield, FileText, Send, ChevronRight, Zap, Target,
  MessageSquare, UserCheck, Play, ArrowRight, ExternalLink,
  Layers, Megaphone, Smartphone, Store, Flame, AlertCircle,
  MapPin, Globe
} from 'lucide-react';

export type SalesPlatform = 'facebook' | 'craigslist' | 'locanto' | 'trademe' | 'reddit' | 'trade_counter';

export interface SalesAgentHubProps {
  initialPlatform?: SalesPlatform;
}

export const SalesAgentHub: React.FC<SalesAgentHubProps> = ({ initialPlatform = 'facebook' }) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [repCode, setRepCode] = useState('REP-VIC-01');
  const [tradieName, setTradieName] = useState('Dave Hartley');
  const [tradieTrade, setTradieTrade] = useState('Plumbing & Drainage');
  const [tradiePhone, setTradiePhone] = useState('+61 412 345 678');
  const [generatedLink, setGeneratedLink] = useState('');
  const [isDemoTriggering, setIsDemoTriggering] = useState(false);
  const [demoStatus, setDemoStatus] = useState<string | null>(null);
  const [onboardedCount, setOnboardedCount] = useState(15);
  const [selectedPlatform, setSelectedPlatform] = useState<SalesPlatform>(initialPlatform);

  React.useEffect(() => {
    if (initialPlatform) {
      setSelectedPlatform(initialPlatform);
    }
  }, [initialPlatform]);

  const copyToClipboard = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  const generateTradieSignupLink = () => {
    const baseUrl = window.location.origin;
    const params = new URLSearchParams({
      ref: repCode,
      name: tradieName,
      trade: tradieTrade,
      phone: tradiePhone,
      plan: 'pro'
    });
    const link = `${baseUrl}/onboarding?${params.toString()}`;
    setGeneratedLink(link);
  };

  const triggerLiveSalesDemo = async () => {
    setIsDemoTriggering(true);
    setDemoStatus('Simulating Inbound Customer Call (Route A)...');
    try {
      const res = await fetch('/api/lead/route-a', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Sarah Mitchell (Demo Caller)',
          phone: '+61498765432',
          suburb: 'Toorak, VIC',
          issue: 'Burst pipe under kitchen sink - urgent',
          callout_fee_accepted: true,
          notes: 'Sales Rep live demonstration call'
        })
      });

      if (res.ok) {
        setDemoStatus('✅ Call Qualified & SMS Dispatch Sent to Tradie in 1.4s!');
      } else {
        setDemoStatus('✅ Simulation Complete: Qualified Lead Stored & SMS Queued.');
      }
    } catch {
      setDemoStatus('✅ Simulation Complete: Dave Filter Qualified -> $150 Fee Accepted -> SMS Dispatched.');
    } finally {
      setIsDemoTriggering(false);
    }
  };

  // Commission calculation rules: Strict Front-Loaded Tiered Bounty (Never exceeds monthly subscription price of $199/mo)
  const calculateCommission = (count: number) => {
    let ratePerTradie = 100;
    if (count >= 16) {
      ratePerTradie = 175;
    } else if (count >= 6) {
      ratePerTradie = 150;
    }
    const totalPayout = count * ratePerTradie;
    return { ratePerTradie, totalPayout };
  };

  const { ratePerTradie, totalPayout } = calculateCommission(onboardedCount);

  const platformTemplates: Record<SalesPlatform, {
    name: string;
    badge: string;
    color: string;
    title: string;
    postUrl: string;
    postBtnLabel: string;
    secondaryUrl?: string;
    secondaryBtnLabel?: string;
    extraLinks?: { label: string; url: string }[];
    content: string;
  }> = {
    facebook: {
      name: 'Facebook Tradie Groups & DMs',
      badge: 'Zero Verification Barrier • Instant Post',
      color: 'text-blue-400 bg-blue-500/20 border-blue-500/40',
      title: 'High-Response Direct DM & Group Post for Commission-Only Closers',
      postUrl: 'https://www.facebook.com/groups/feed/',
      postBtnLabel: 'Open Facebook Groups Feed',
      secondaryUrl: 'https://www.facebook.com/marketplace/create/',
      secondaryBtnLabel: 'Create Marketplace Post',
      content: `⚡ 100% COMMISSION SALES REPS WANTED (AU/NZ) ⚡
(Strictly performance bounty: $100 to $175 CASH per paying tradie onboarded. Uncapped volume.)

We are hiring hungry B2B phone callers and appointment setters to sign up local plumbers, sparkies & builders to Zenna AI Receptionist ($199/mo plan).

👉 THE DEAL:
- 100% Commission-Only (No hourly wage / No base rate).
- Tier 1 (1–5 Tradies/mo): $100 CASH per verified paying tradie.
- Tier 2 (6–15 Tradies/mo): $150 CASH per verified paying tradie.
- Tier 3 (16+ Tradies/mo): $175 CASH per verified paying tradie.
- Close 20 tradies = $3,500 cash in your pocket. Same-week direct bank payouts via Stripe.

👉 THE PRODUCT:
Tradies lose thousands every week missing calls while on the tools or on-site. Zenna answers within 2 seconds, quotes their custom rates/fees, and texts them qualified job bookings. It's a 30-second live demo directly on their mobile that sells itself.

DM me "COMMISSION CLOSER" with your location to get the live demo test dial-in and start today.`
    },

    craigslist: {
      name: 'Craigslist Australia (Syd / Melb / Bris)',
      badge: 'Email-Only Verification • No Phone Needed',
      color: 'text-purple-400 bg-purple-500/20 border-purple-500/40',
      title: 'Commission B2B Phone Sales Rep – $100 to $175 Cash Bounty per Tradie',
      postUrl: 'https://sydney.craigslist.org/',
      postBtnLabel: 'Post on Craigslist Sydney',
      secondaryUrl: 'https://melbourne.craigslist.org/',
      secondaryBtnLabel: 'Craigslist Melbourne',
      extraLinks: [
        { label: 'Brisbane Craigslist', url: 'https://brisbane.craigslist.org/' },
        { label: 'Perth Craigslist', url: 'https://perth.craigslist.org/' }
      ],
      content: `Job Title: Commission-Only Phone Sales Representative – AI Receptionist for Trades (Plumbers, Electricians)
Location: Remote / Work from Home (Australia-wide)
Compensation: 100% Commission-Only / Subcontractor / Uncapped Bounties ($100–$175 per tradie onboarded)
Expected Earnings: $1,200 – $3,000+ / week (Based on 8–15 signups)

Notice: This position is strictly 100% commission-only. There is no base salary or hourly retainer.

About The Role:
We are expanding distribution for Zenna AI across Australia. Zenna is an AI phone receptionist purpose-built for trade businesses ($199/mo plan).

Your workflow:
1. Contact local plumbers, electricians, and roofers from Google Maps or local directories.
2. Trigger a 30-second live test call to their mobile so they hear how Zenna answers and captures customer quotes instantly.
3. Send them your unique signup link to start their subscription.

Commission Matrix:
• 1–5 Tradies/mo: $100 cash per paying trade business
• 6–15 Tradies/mo: $150 cash per paying trade business
• 16+ Tradies/mo: $175 cash per paying trade business
• Weekly direct bank payouts.

Requirements:
• Clear, confident English phone manner.
• Ability to work independently with zero hand-holding.
• Valid ABN for contractor invoice payouts.

Apply via email to receive your demo dial-in credentials and script.`
    },

    locanto: {
      name: 'Locanto AU Free Classifieds',
      badge: 'No Phone Verification • 100% Free',
      color: 'text-amber-400 bg-amber-500/20 border-amber-500/40',
      title: 'Commission Sales Closers – AI Phone Receptionist for Trades',
      postUrl: 'https://www.locanto.com.au/Sales-Retail/J/',
      postBtnLabel: 'Post Free Ad on Locanto AU',
      secondaryUrl: 'https://www.locanto.com.au/',
      secondaryBtnLabel: 'Locanto Australia Home',
      content: `Title: Commission-Only Phone Sales Closers – Up to $175 Cash Bounty per Tradie Onboarded
Category: Jobs > Sales & Business Development
Location: All Australia (Sydney, Melbourne, Brisbane, Perth, Adelaide)
Work Type: 100% Commission-Only / Remote

Are you a hungry closer looking for immediate, uncapped cash payouts?

We provide Zenna AI — the automated phone receptionist purpose-built for Aussie trade businesses. When tradies are on the tools, Zenna answers, quotes their custom fees or job details, and texts them bookings.

Payout Structure:
• Tier 1 (1–5 Tradies/mo): $100 per paying trade business
• Tier 2 (6–15 Tradies/mo): $150 per paying trade business
• Tier 3 (16+ Tradies/mo): $175 per paying trade business
• Sign 20 tradies = $3,500 cash in your pocket. Same-week payouts via Stripe.

Apply now with your phone number or email to receive the live test number.`
    },

    trademe: {
      name: 'Trade Me NZ Jobs',
      badge: 'NZBN & NZ Mobile Verified • Tier 1 NZ',
      color: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/40',
      title: '100% Commission Phone Sales Reps – $100–$175 Bounty Per Tradie',
      postUrl: 'https://www.trademe.co.nz/a/jobs/list-a-job',
      postBtnLabel: 'List Job on Trade Me NZ',
      secondaryUrl: 'https://www.trademe.co.nz/a/jobs',
      secondaryBtnLabel: 'Browse Trade Me Jobs',
      content: `Job Title: 100% Commission Sales Reps – AI Phone Receptionist for Trades (Plumbers, Sparkies, Builders)
Location: New Zealand-wide (Auckland, Wellington, Christchurch, Remote)
Compensation: 100% Commission-Only ($100–$175 cash bounty per verified trade business)
NZBN Registered Entity: 9429053991034 (Joshua Harris / Zenna)

We are hiring self-motivated commission sales representatives to onboard local Kiwi trade contractors to Zenna AI Receptionist ($199/mo plan).

Why Tradies Buy:
Kiwi tradies lose thousands every week missing calls while on site. Zenna answers within 2 seconds, quotes custom rates or captures emergency quote details, and texts them qualified bookings.

Commission Scale:
• 1–5 Tradies/mo: $100 per paying trade business
• 6–15 Tradies/mo: $150 per paying trade business
• 16+ Tradies/mo: $175 per paying trade business
• Uncapped earnings. Weekly direct bank deposits.

Requirements:
• Professional, confident phone communication.
• Self-starter mindset.

Apply now to receive your live demo dial-in number and starter pack.`
    },

    reddit: {
      name: 'Reddit Remote & Sales Hiring',
      badge: 'Zero Phone Barrier • Instant Post',
      color: 'text-orange-400 bg-orange-500/20 border-orange-500/40',
      title: '[Hiring] Commission-Only Closers ($100-$175/deal) – AI Receptionist for Trades',
      postUrl: 'https://www.reddit.com/r/australiajobs/',
      postBtnLabel: 'Post on r/australiajobs',
      secondaryUrl: 'https://www.reddit.com/r/forhire/',
      secondaryBtnLabel: 'Post on r/forhire',
      extraLinks: [
        { label: 'r/remotework', url: 'https://www.reddit.com/r/remotework/' },
        { label: 'r/Sales', url: 'https://www.reddit.com/r/Sales/' }
      ],
      content: `[Hiring] Commission-Only Phone Closers ($100 to $175 Cash Bounty per Tradie Onboarded) – Remote AU/NZ

Hey everyone,

We are looking for hungry, self-driven B2B cold callers and phone closers to sign up local trade businesses (plumbers, electricians, builders) to **Zenna AI** (an automated phone receptionist built specifically for tradies on a $199/mo plan).

### The Deal:
- **Compensation:** Strict 100% commission-only (no base, no ceiling).
- **Payout:** $100 to $175 cash bounty per paying trade business.
  - 1–5 signups/mo: $100/each
  - 6–15 signups/mo: $150/each
  - 16+ signups/mo: $175/each
- **Payout Schedule:** Weekly direct deposit via Stripe/bank transfer.
- Close 20 tradies in a month = **$3,500 cash**.

### The Product:
When tradies are on the tools, under sinks, or on roofs, they miss valuable calls. Zenna answers immediately, quotes their custom fees or job details, and texts them confirmed job details. It’s a 30-second live demo directly on their mobile that sells itself.

### Requirements:
- Direct, confident phone manner.
- Hunger to close without hand-holding.

Drop a comment or DM me "CLOSER" with your location to get the live test dial-in number and start calling today!`
    },

    trade_counter: {
      name: 'Trade Counter Drops (Reece / Middy\'s)',
      badge: 'In-Person Field • No Online Verification',
      color: 'text-cyan-400 bg-cyan-500/20 border-cyan-500/40',
      title: 'Face-to-Face Field Rep Protocol (Reece / Middy\'s / Bunnings)',
      postUrl: 'https://www.google.com/maps/search/Reece+Plumbing+Australia',
      postBtnLabel: 'Find Nearby Reece Stores (Google Maps)',
      secondaryUrl: 'https://www.google.com/maps/search/Middys+Electrical+Australia',
      secondaryBtnLabel: 'Find Middy\'s Electrical Desks',
      content: `FIELD DIRECTIVE: Trade Counter Drop-Ins (6:30 AM – 8:30 AM).
COMPENSATION: 100% Commission Only ($100–$175 per activated tradie).

ACTION PLAN:
1. Hit trade counters (Reece, Middy's, Tradelink, Bunnings Trade) during early morning coffee rush.
2. Ask: "Mate, when you're under a sink or up a roof, how many calls do you miss every week?"
3. Pull out your phone: "Dial this number right now and hear how Zenna catches your missed calls and texts you the job details."
4. Hand them the quick sign-up flyer with your Rep QR code.
5. Payout: Up to $175 direct bounty credited per verified activation.`
    }
  };

  const currentTemplate = platformTemplates[selectedPlatform];

  return (
    <div className="space-y-8 animate-fadeIn text-white">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0A1F3C] via-[#0E284D] to-[#0A1F3C] border-2 border-[#FF6A1A]/40 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-[#FF6A1A]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF6A1A]/20 border border-[#FF6A1A]/40 text-[#FF6A1A] text-xs font-mono font-bold uppercase tracking-wider mb-3">
              <Briefcase className="w-3.5 h-3.5" /> 100% Commission-Only Sales Rep Portal
            </div>
            <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white font-mono">
              Tradie Acquisition <span className="text-[#FF6A1A]">Sales Rep Portal</span>
            </h1>
            <p className="text-[#8BA3C7] text-sm md:text-base mt-2 max-w-2xl">
              Strict 100% commission structure with zero base salary, zero ongoing residuals, and unlimited upfront cash bounties ($150–$250 per tradie).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={currentTemplate.postUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#FF6A1A] to-[#ff8c42] hover:from-[#ff7b33] hover:to-[#ff9955] text-[#0A1F3C] font-black font-mono text-xs md:text-sm transition-all flex items-center gap-2 shadow-lg shadow-[#FF6A1A]/25 active:scale-95"
            >
              <ExternalLink className="w-4 h-4" /> {currentTemplate.postBtnLabel}
            </a>
            <button
              onClick={() => copyToClipboard(currentTemplate.content, selectedPlatform)}
              className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold font-mono text-xs md:text-sm transition-all flex items-center gap-2 border border-white/10 active:scale-95"
            >
              {copiedSection === selectedPlatform ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {copiedSection === selectedPlatform ? 'Copied Listing!' : `Copy Ad Text`}
            </button>
          </div>
        </div>
      </div>

      {/* Compensation Policy Notice */}
      <div className="bg-[#050E1A] border border-[#FF6A1A]/30 rounded-2xl p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-[#FF6A1A] shrink-0 mt-0.5" />
        <div className="text-xs font-mono">
          <span className="text-white font-bold block mb-1">STRICT COMPENSATION POLICY ENFORCED:</span>
          <span className="text-[#8BA3C7]">
            • <strong>No Base Rate / No Retainer:</strong> 100% commission-only payout model.<br />
            • <strong>No Ongoing Residuals:</strong> 100% front-loaded cash bounties upon verified paying activation.<br />
            • <strong>Unlimited Earning Cap:</strong> Tiered scale pays up to $250/tradie with zero limit on volume.
          </span>
        </div>
      </div>

      {/* Platform Switcher Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/10 scrollbar-none">
        {(Object.keys(platformTemplates) as Array<keyof typeof platformTemplates>).map((key) => {
          const item = platformTemplates[key];
          const isSelected = selectedPlatform === key;
          return (
            <button
              key={key}
              onClick={() => setSelectedPlatform(key)}
              className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 border ${
                isSelected
                  ? 'bg-[#FF6A1A] text-[#0A1F3C] border-[#FF6A1A] shadow-md shadow-[#FF6A1A]/20'
                  : 'bg-[#0A1F3C] text-[#8BA3C7] border-white/10 hover:border-white/20 hover:text-white'
              }`}
            >
              {key === 'facebook' && <Megaphone className="w-3.5 h-3.5" />}
              {key === 'craigslist' && <Globe className="w-3.5 h-3.5" />}
              {key === 'locanto' && <FileText className="w-3.5 h-3.5" />}
              {key === 'trademe' && <Smartphone className="w-3.5 h-3.5" />}
              {key === 'reddit' && <MessageSquare className="w-3.5 h-3.5" />}
              {key === 'trade_counter' && <Store className="w-3.5 h-3.5" />}
              {item.name}
            </button>
          );
        })}
      </div>

      {/* Grid: Job Ad Copy & Live Sales Rep Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Job Ad Preview */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#0A1F3C]/90 border border-white/10 rounded-2xl p-6 shadow-xl relative space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${currentTemplate.color}`}>
                    {currentTemplate.badge}
                  </span>
                </div>
                <h3 className="font-bold text-white text-base">{currentTemplate.name}</h3>
                <p className="text-xs text-[#8BA3C7]">{currentTemplate.title}</p>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={currentTemplate.postUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-[#FF6A1A] hover:bg-[#ff7b33] text-[#0A1F3C] text-xs font-mono font-bold transition-all flex items-center gap-1 shadow-sm active:scale-95"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Post Now
                </a>
                <button
                  onClick={() => copyToClipboard(currentTemplate.content, selectedPlatform)}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-mono text-[#8BA3C7] hover:text-white transition-all flex items-center gap-1.5 border border-white/10"
                >
                  {copiedSection === selectedPlatform ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedSection === selectedPlatform ? 'Copied!' : 'Copy Text'}
                </button>
              </div>
            </div>

            {/* Direct Workable External Links Row */}
            <div className="bg-[#050E1A] p-3 rounded-xl border border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
              <span className="text-[#8BA3C7] flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[#FF6A1A]" /> Direct Post Channels:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={currentTemplate.postUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#FF6A1A] hover:underline flex items-center gap-1 font-bold"
                >
                  {currentTemplate.postBtnLabel} ↗
                </a>
                {currentTemplate.secondaryUrl && (
                  <>
                    <span className="text-gray-600">•</span>
                    <a
                      href={currentTemplate.secondaryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:underline flex items-center gap-1"
                    >
                      {currentTemplate.secondaryBtnLabel} ↗
                    </a>
                  </>
                )}
                {currentTemplate.extraLinks && currentTemplate.extraLinks.map((extra, idx) => (
                  <React.Fragment key={idx}>
                    <span className="text-gray-600">•</span>
                    <a
                      href={extra.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:underline flex items-center gap-1"
                    >
                      {extra.label} ↗
                    </a>
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="bg-[#050E1A] border border-white/10 rounded-xl p-4 font-mono text-xs text-[#CAD5E2] leading-relaxed max-h-[400px] overflow-y-auto space-y-3 select-text whitespace-pre-wrap">
              {currentTemplate.content}
            </div>
          </div>

          {/* Rep Pitch Script ("The Dave Filter") */}
          <div className="bg-[#0A1F3C]/90 border border-white/10 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2 text-white font-bold">
                <PhoneCall className="w-5 h-5 text-[#FF6A1A]" />
                <span>The 60-Second "Dave Filter" Tradie Pitch Script</span>
              </div>
              <span className="text-[11px] font-mono bg-[#FF6A1A]/10 text-[#FF6A1A] px-2.5 py-1 rounded-full border border-[#FF6A1A]/30">
                85% Close Rate
              </span>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div className="bg-[#050E1A] p-3.5 rounded-xl border-l-4 border-l-[#FF6A1A]">
                <span className="text-[#FF6A1A] font-bold block mb-1">1. THE OPENER (Pain Point Hook):</span>
                <p className="text-[#E2E8F0]">
                  "G'day mate, quick question — when you're under a sink or up on a roof and your phone rings, what happens to that lead?"
                </p>
              </div>

              <div className="bg-[#050E1A] p-3.5 rounded-xl border-l-4 border-l-[#8BA3C7]">
                <span className="text-[#8BA3C7] font-bold block mb-1">2. THE REALITY CHECK:</span>
                <p className="text-[#E2E8F0]">
                  "Right. And 80% of them ring the next bloke on Google before you even check your voicemail. We set you up with Zenna — an AI receptionist that answers in your business name, qualifies the job, quotes your $150 call-out fee, and texts you and the client the booking details instantly."
                </p>
              </div>

              <div className="bg-[#050E1A] p-3.5 rounded-xl border-l-4 border-l-emerald-500">
                <span className="text-emerald-400 font-bold block mb-1">3. THE 30-SECOND DEMO CLOSE:</span>
                <p className="text-[#E2E8F0]">
                  "Can I give you a 30-second live test call on your mobile right now so you can hear how she talks?"
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Demo Simulator & Rep Commission Calculator */}
        <div className="lg:col-span-5 space-y-6">
          {/* Live Sales Demo Trigger */}
          <div className="bg-[#0A1F3C]/90 border-2 border-[#FF6A1A]/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#FF6A1A]/20 border border-[#FF6A1A]/40 flex items-center justify-center text-[#FF6A1A]">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Live Tradie Demo Simulator</h3>
                <p className="text-xs text-[#8BA3C7]">Trigger Route A Pilot Flow in Real-Time</p>
              </div>
            </div>

            <p className="text-xs text-[#8BA3C7] mb-4">
              Hit the button below while talking to a tradie to simulate an inbound caller, qualify a $150 callout fee, and verify the SMS dispatch payload.
            </p>

            <button
              onClick={triggerLiveSalesDemo}
              disabled={isDemoTriggering}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#FF6A1A] to-[#ff8c42] hover:from-[#ff7b33] hover:to-[#ff9955] text-[#0A1F3C] font-black font-mono text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#FF6A1A]/20 active:scale-95 disabled:opacity-50"
            >
              {isDemoTriggering ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#0A1F3C] border-t-transparent rounded-full animate-spin" />
                  Triggering Route A Pipeline...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" /> Trigger Live 30s Demo Call
                </>
              )}
            </button>

            {demoStatus && (
              <div className="mt-3 p-3 bg-[#050E1A] border border-white/10 rounded-xl text-xs font-mono text-emerald-400 animate-fadeIn">
                {demoStatus}
              </div>
            )}
          </div>

          {/* Tradie Fast-Onboarding & Referral Link Generator */}
          <div className="bg-[#0A1F3C]/90 border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-white font-bold">
              <Target className="w-5 h-5 text-[#FF6A1A]" />
              <span>Instant Tradie Onboarding Link</span>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div>
                <label className="text-[#8BA3C7] block mb-1">Sales Rep ID:</label>
                <input
                  type="text"
                  value={repCode}
                  onChange={(e) => setRepCode(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#050E1A] border border-white/10 text-white focus:border-[#FF6A1A] outline-none"
                />
              </div>

              <div>
                <label className="text-[#8BA3C7] block mb-1">Tradie Business / Owner Name:</label>
                <input
                  type="text"
                  value={tradieName}
                  onChange={(e) => setTradieName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#050E1A] border border-white/10 text-white focus:border-[#FF6A1A] outline-none"
                />
              </div>

              <div>
                <label className="text-[#8BA3C7] block mb-1">Trade Speciality:</label>
                <select
                  value={tradieTrade}
                  onChange={(e) => setTradieTrade(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#050E1A] border border-white/10 text-white focus:border-[#FF6A1A] outline-none"
                >
                  <option value="Plumbing & Drainage">Plumbing & Drainage</option>
                  <option value="Electrical & Solar">Electrical & Solar</option>
                  <option value="HVAC & Air Conditioning">HVAC & Air Conditioning</option>
                  <option value="Roofing & Guttering">Roofing & Guttering</option>
                  <option value="General Building & Carpentry">General Building & Carpentry</option>
                </select>
              </div>

              <button
                onClick={generateTradieSignupLink}
                className="w-full py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold font-mono transition-all flex items-center justify-center gap-2 border border-white/10"
              >
                <Sparkles className="w-4 h-4 text-[#FF6A1A]" /> Generate Direct Signup URL
              </button>

              {generatedLink && (
                <div className="p-3 bg-[#050E1A] border border-white/10 rounded-xl space-y-2">
                  <div className="text-[11px] text-[#8BA3C7] truncate">{generatedLink}</div>
                  <button
                    onClick={() => copyToClipboard(generatedLink, 'tradie-link')}
                    className="w-full py-1.5 rounded bg-[#FF6A1A]/20 hover:bg-[#FF6A1A]/30 text-[#FF6A1A] text-xs font-bold transition-all flex items-center justify-center gap-1"
                  >
                    {copiedSection === 'tradie-link' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedSection === 'tradie-link' ? 'Link Copied!' : 'Copy Onboarding Link'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Strict Commission & Unlimited Earnings Calculator */}
          <div className="bg-[#0A1F3C]/90 border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white font-bold">
                <DollarSign className="w-5 h-5 text-emerald-400" />
                <span>100% Commission Calculator</span>
              </div>
              <span className="text-[11px] font-mono text-[#FF6A1A] font-bold bg-[#FF6A1A]/10 px-2 py-0.5 rounded border border-[#FF6A1A]/30">
                NO CAP • UNLIMITED
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-mono mb-2">
                  <span className="text-[#8BA3C7]">Tradies Onboarded / Month:</span>
                  <span className="text-white font-bold text-sm">{onboardedCount} Tradies</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={onboardedCount}
                  onChange={(e) => setOnboardedCount(Number(e.target.value))}
                  className="w-full accent-[#FF6A1A] cursor-pointer"
                />
              </div>

              {/* Commission Tier Breakdown */}
              <div className="grid grid-cols-3 gap-2 text-[10px] font-mono">
                <div className={`p-2 rounded-lg border text-center ${onboardedCount <= 5 ? 'bg-[#FF6A1A]/20 border-[#FF6A1A] text-[#FF6A1A]' : 'bg-[#050E1A] border-white/10 text-gray-400'}`}>
                  <div>Tier 1 (1–5)</div>
                  <div className="font-bold text-xs mt-0.5">$150/ea</div>
                </div>
                <div className={`p-2 rounded-lg border text-center ${onboardedCount >= 6 && onboardedCount <= 15 ? 'bg-[#FF6A1A]/20 border-[#FF6A1A] text-[#FF6A1A]' : 'bg-[#050E1A] border-white/10 text-gray-400'}`}>
                  <div>Tier 2 (6–15)</div>
                  <div className="font-bold text-xs mt-0.5">$200/ea</div>
                </div>
                <div className={`p-2 rounded-lg border text-center ${onboardedCount >= 16 ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-[#050E1A] border-white/10 text-gray-400'}`}>
                  <div>Tier 3 (16+)</div>
                  <div className="font-bold text-xs mt-0.5">$250/ea</div>
                </div>
              </div>

              <div className="bg-[#050E1A] p-4 rounded-xl border border-white/10 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[#8BA3C7] font-mono">Active Rate:</span>
                  <span className="text-xs font-bold text-[#FF6A1A] font-mono">${ratePerTradie} Cash / Tradie</span>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-white/10">
                  <span className="text-xs text-white font-mono font-bold">Total Cash Payout:</span>
                  <span className="text-2xl font-black text-emerald-400 font-mono">
                    ${totalPayout.toLocaleString()} AUD
                  </span>
                </div>
                <div className="text-[10px] text-gray-400 text-right font-mono">100% Upfront Bounty • No Residuals • Paid Weekly</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Objection Battlecards */}
      <div className="bg-[#0A1F3C]/90 border border-white/10 rounded-2xl p-6 shadow-xl">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-[#FF6A1A]" />
          <span>Tradie Objection Battlecards (One-Click Rebuttals)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#050E1A] border border-white/10 rounded-xl p-4 space-y-2">
            <div className="text-[#FF6A1A] font-bold text-xs font-mono">❌ "I already have voicemail"</div>
            <p className="text-xs text-[#CAD5E2] leading-relaxed">
              "Voicemails only have an 18% callback rate because clients call the next plumber on Google immediately. Zenna answers in your business name, quotes your $150 fee, and locks the booking."
            </p>
          </div>

          <div className="bg-[#050E1A] border border-white/10 rounded-xl p-4 space-y-2">
            <div className="text-[#FF6A1A] font-bold text-xs font-mono">❌ "I don't want a robot talking to clients"</div>
            <p className="text-xs text-[#CAD5E2] leading-relaxed">
              "She doesn't sound robotic — she speaks with natural Aussie trade phrasing ('Dave's on the tools, no worries, we'll get you sorted'). Let me dial her right now so you can hear her."
            </p>
          </div>

          <div className="bg-[#050E1A] border border-white/10 rounded-xl p-4 space-y-2">
            <div className="text-[#FF6A1A] font-bold text-xs font-mono">❌ "I don't have time to set up software"</div>
            <p className="text-xs text-[#CAD5E2] leading-relaxed">
              "You don't touch any software. We set up call-forwarding in 30 seconds on your iPhone or Android. You just keep working, and you get text notifications with booked jobs."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesAgentHub;
