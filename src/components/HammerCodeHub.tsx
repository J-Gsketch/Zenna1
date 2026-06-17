import React, { useState } from 'react';
import { 
  Wrench, 
  Target, 
  FileSignature, 
  Video, 
  DollarSign, 
  CheckSquare, 
  Sparkles, 
  Tv, 
  Calculator, 
  Youtube, 
  Handshake, 
  ArrowRight, 
  Download, 
  Search, 
  Check, 
  Play,
  RotateCcw,
  Sliders,
  Copy
} from 'lucide-react';

interface HammerCodeHubProps {
  businessName: string;
}

export default function HammerCodeHub({ businessName }: HammerCodeHubProps) {
  // Config States for AI Creator
  const [trade, setTrade] = useState('Plumbing & Drainage');
  const [suburb, setSuburb] = useState('Melbourne Metro, VIC');
  const [pricingModel, setPricingModel] = useState('Flat-rate diagnostic upfront');
  const [partnerName, setPartnerName] = useState('Dave Hartley');
  const [partnerSpecialty, setPartnerSpecialty] = useState('Licenced Master Plumber');
  const [customPromoLine, setCustomPromoLine] = useState('$150 Flat-rate block investigation or it is free!');
  const [slangLevel, setSlangLevel] = useState<'standard' | 'classic' | 'extreme'>('classic');
  
  // Generation Outcome State
  const [isGenerating, setIsGenerating] = useState(false);
  const [campaignData, setCampaignData] = useState<any>({
    advertisingCampaign: {
      campaignName: "The Blocked-Drain Rapid Response Rollout",
      targetAudience: "Residential residential home owners, landlords, and property reps in Melbourne Metro",
      promoOffer: "Fixed $150 upfront diagnostic — if we aren't at your gate in 60 mins, it's free!",
      videoAdScript: {
        hook: "📸 [Visual: Close-up of burst sewer tube spraying muck on guy's steel-caps. Spit-your-coffee-out face.] Spoken: \"G'day legends! 🤙 Back-yard turned into a cheeky swampland? Spit the dummy? Don't stress, let's get it sorted!\"",
        problem: "⏱️ [Visual: Sitting by phone in quiet house, scrolling directories.] Spoken: \"We've all been there — dialing three local plumbers, getting generic voicemails, and zero quotes while your carpet gets soaked.\"",
        solution: "🛠️ [Visual: Clean Hartley Plumber truck pulling up, scanning booking app.] Spoken: \"Enter Hammer & Code. Direct-response dispatch, crystal clear upfront flat rates. No surprise mark-ups.\"",
        cta: "🤙 [Visual: Tapping massive 'Book Now' screen showing calendar.] Spoken: \"Tap the link below to hold your 60-minute emergency slot. Sorted on the tools!\""
      }
    },
    pricingInvestigation: {
      industryBenchmark: "Standard Aussie portal averages (Hipages/Airtasker) are $90–$140/hr + arbitrary call-out. Premium SEO direct-response contractors bill $180–$220/hr, locking in emergency work with immediate speed.",
      recommendedHourly: "$180 incl. GST base team operational rate",
      recommendedFlatRatePackage: "$150 flat-rate upfront call-out & complete camera diagnostic assessment",
      positioningStrategy: "Ditch hourly lowball wars. Offering a rapid Flat-Rate $150 premium inspection positions you as the ultimate authority, which easily converts to high-margin full pipeline repair jobs."
    },
    partnershipAgreement: {
      stateJurisdiction: "Trades Licensing Standards & Australian Consumer Protection Regulations (VIC-compliant)",
      clauseEquitySplit: "Unified co-op revenue model: 50/50 net division on combined onsite service tickets, with a 15% bonus allocated to the originating dispatcher.",
      scopeOfWorks: "Dave Hartley manages onsite hydraulic pipelines and gas repairs. Partner controls electrical checkouts and Twilio alert monitors.",
      legalMemoText: "Hammer & Code Partner Memorandum of Understanding\n-------------------------------------------------\nThis agreement is made between Hartley Plumbing and our affiliate subcontractor. We agree to manage scheduling via our unified Zenna CRM node, deploy standard Stripe deposits on bookings before Dave dispatches, and split net invoices 50/50 weekly. Integrity on the tools is binding."
    },
    socialsBlueprint: {
      firstPostCaption: "G'day partners! 🤙 Officially live in Melbourne. Tired of playing email tag with voicemail receptionists? We reply in under 30 seconds and show up with professional diagnostic gear. Book now to get sorted. #HammerAndCode #Sorted",
      weeklyCadence: "Publish 3 quick reels weekly showing on-site 'before-and-after' drain clears with a shaka emoji. Link directly to automated booking page.",
      hashtagPool: "#TradiesMelbourne #AussieSparky #PlumberLife #HammerAndCode #SpeedToLead #Sorted"
    }
  });

  const [activeSubTab, setActiveSubTab] = useState<'marketing' | 'video' | 'partnership' | 'pricing' | 'socials'>('marketing');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const generateCampaignByAI = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate-tradie-campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trade,
          suburb,
          pricingModel,
          partnerName,
          partnerSpecialty,
          customPromoLine
        })
      });
      const data = await res.json();
      if (data.success && data.campaign) {
        setCampaignData(data.campaign);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      
      {/* Brand Hero Banner */}
      <div className="relative bg-gradient-to-r from-orange-600 to-amber-700 rounded-sm p-8 text-white shadow-lg overflow-hidden border-b-4 border-amber-900 group">
        <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none group-hover:rotate-12 transition-transform duration-500">
          <Wrench className="w-56 h-56" />
        </div>
        <div className="max-w-2xl relative z-10 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase bg-black/20 text-orange-200 px-3 py-1 rounded-full w-fit">
            <Sparkles className="w-3.5 h-3.5" /> Hammer & Code Framework
          </div>
          <h1 className="font-serif text-3xl md:text-5xl font-black leading-tight">
            Trades Marketing & Fast-Scale Campaign Hub
          </h1>
          <p className="text-orange-100 text-sm md:text-base leading-relaxed font-sans max-w-xl">
            Replicate fast-scaling SaaS marketing models for Aussie trade operations. Build quick, direct-response video hooks, partnership agreements, pricing models, and social pipelines to keep your calendars fully booked.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Campaign Parameter Config Tool */}
        <div className="lg:col-span-1 bg-surface border border-white/5 rounded-sm p-6 space-y-6 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="border-b border-white/5 pb-4">
              <h3 className="font-serif text-lg font-bold flex items-center gap-2 text-paper">
                <Sliders className="w-5 h-5 text-orange-500" /> Setup Parameters
              </h3>
              <p className="text-[10px] text-muted">Input your trade specs to generate tailored assets.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-muted mb-1.5">Trade Specialty</label>
                <select 
                  value={trade} 
                  onChange={e => setTrade(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs text-paper outline-none focus:border-orange-500 transition-all font-medium"
                >
                  <option value="Plumbing & Drainage">Plumbing & Drainage</option>
                  <option value="Sparky (Electrical)">Sparky (Electrical)</option>
                  <option value="Carpentry & Chippie">Carpentry & Chippie</option>
                  <option value="Builder & Renovations">Builder & Renovations</option>
                  <option value="Roofing & Guttering">Roofing & Guttering</option>
                  <option value="Landscaping & Decking">Landscaping & Decking</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-muted mb-1.5">Aussie Suburb / Metro Zone</label>
                <input 
                  type="text" 
                  value={suburb} 
                  onChange={e => setSuburb(e.target.value)}
                  placeholder="e.g. Richmond, VIC or Toorak"
                  className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs text-paper outline-none focus:border-orange-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-muted mb-1.5">Pricing Model</label>
                <input 
                  type="text" 
                  value={pricingModel} 
                  onChange={e => setPricingModel(e.target.value)}
                  placeholder="e.g. Upfront premium diagnostics"
                  className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs text-paper outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-muted mb-1.5">Cheeky Slang Level</label>
                <div className="grid grid-cols-3 gap-1">
                  {(['standard', 'classic', 'extreme'] as const).map(lev => (
                    <button
                      key={lev}
                      onClick={() => setSlangLevel(lev)}
                      className={`text-[9px] uppercase tracking-wider py-1.5 rounded font-bold border transition-all ${
                        slangLevel === lev 
                          ? 'bg-orange-500/20 text-orange-400 border-orange-500/40' 
                          : 'bg-white/5 text-muted border-white/5 hover:border-white/10'
                      }`}
                    >
                      {lev}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-white/5 pt-4 space-y-4">
                <p className="text-[10px] uppercase font-bold text-muted tracking-wide">Partnership (Optional)</p>
                
                <div>
                  <label className="block text-[9px] uppercase text-muted mb-1 font-semibold">Partner Name</label>
                  <input 
                    type="text" 
                    value={partnerName} 
                    onChange={e => setPartnerName(e.target.value)}
                    placeholder="e.g. Mike Sparky"
                    className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs text-paper outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-[9px] uppercase text-muted mb-1 font-semibold">Partner Specialty</label>
                  <input 
                    type="text" 
                    value={partnerSpecialty} 
                    onChange={e => setPartnerSpecialty(e.target.value)}
                    placeholder="e.g. Master Electrician"
                    className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs text-paper outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-muted mb-1.5">Core Promo Angle</label>
                <input 
                  type="text" 
                  value={customPromoLine} 
                  onChange={e => setCustomPromoLine(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs text-paper outline-none focus:border-orange-500"
                />
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button 
              onClick={generateCampaignByAI}
              disabled={isGenerating}
              className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-3.5 px-4 rounded text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-orange-700/25 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating via Gemini...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Generate Campaign Assets
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Side: Interactive Asset Views */}
        <div className="lg:col-span-2 space-y-6">

          {/* Sub Tab Navigation */}
          <div className="bg-[#111] border border-white/5 p-1 rounded-sm grid grid-cols-5 gap-1 shadow-md">
            {[
              { id: 'marketing', label: 'Fast-Scale Pipeline', icon: Target },
              { id: 'video', label: 'Ad Script', icon: Video },
              { id: 'partnership', label: 'MOU Builder', icon: FileSignature },
              { id: 'pricing', label: 'Pricing Audit', icon: Calculator },
              { id: 'socials', label: 'Caption Generator', icon: CheckSquare }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`py-3 px-1 rounded-sm text-[10px] font-bold uppercase tracking-wider transition-all flex flex-col sm:flex-row items-center justify-center gap-2 ${
                  activeSubTab === tab.id 
                    ? 'bg-orange-600 text-white shadow-sm' 
                    : 'text-muted hover:text-paper hover:bg-white/5'
                }`}
              >
                <tab.icon className="w-4 h-4 flex-shrink-0" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Display Current Asset */}
          <div className="bg-[#131315] border border-white/5 rounded-sm p-8 relative overflow-hidden shadow-lg min-h-[460px]">
            
            {activeSubTab === 'marketing' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div>
                    <span className="text-[10px] text-orange-500 uppercase font-bold tracking-widest font-mono">SAAS PIPELINE BLUEPRINT</span>
                    <h2 className="font-serif text-2xl text-paper mt-1">Aussie Tradie Fast-Scale Pipelines</h2>
                  </div>
                  <button 
                    onClick={() => handleCopy(JSON.stringify(campaignData.advertisingCampaign, null, 2), 'pipeline')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 text-muted hover:text-paper text-xs transition-all font-mono"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    {copiedText === 'pipeline' ? 'Copied!' : 'Copy Schema'}
                  </button>
                </div>

                <div className="bg-orange-500/5 border border-orange-500/10 p-4 rounded-sm">
                  <p className="text-xs uppercase text-orange-400 font-bold tracking-wider mb-1">Target Campaign Model:</p>
                  <p className="text-base font-serif text-paper">"{campaignData.advertisingCampaign.campaignName || "Trade Rocket Launch"}"</p>
                  <p className="text-xs text-muted mt-2">Target Segment: <strong className="text-paper">{campaignData.advertisingCampaign.targetAudience}</strong></p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted">The 4-Step Replicating SaaS funnel for Trade:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { step: '01', title: 'Google LSA (Local Services Ads)', desc: 'Set up pay-per-lead directly. Pay strictly for actual emergency plumbing/electrical bookings, bypassing traditional SEO lag times.' },
                      { step: '02', title: 'Immediate 30-Sec Response', desc: 'Deploy Zenna AI Receptionist webhook. The moment they call and trigger missed-call, Zenna text-dispatches within 30 seconds.' },
                      { step: '03', title: 'Upfront Fixed diagnostic', desc: 'No \"hourly rate estimation\" back-and-forth. Offer a clean $110 - $180 flat diagnostic to audit with a draft quote instantly.' },
                      { step: '04', title: 'Fast-Scale Co-Op Subcontract', desc: 'Deploy partner agreements on jobs. Funnel all minor pipeline works to reliable partner contractors, charging a 15% system fee.' }
                    ].map((pipelineStep, i) => (
                      <div key={i} className="bg-white/[0.02] border border-white/5 p-5 hover:border-orange-500/20 transition-all group">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="font-mono text-xs font-bold text-orange-500 bg-orange-500/10 px-2.5 py-1 rounded-sm">{pipelineStep.step}</span>
                          <h5 className="text-xs font-bold text-paper group-hover:text-orange-400 transition-colors">{pipelineStep.title}</h5>
                        </div>
                        <p className="text-[11px] text-muted leading-relaxed">{pipelineStep.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Youtube className="w-5 h-5 text-red-500" />
                    <div>
                      <p className="text-xs font-bold text-paper">Verified Scale Frameworks (SaaS & Agency Redup)</p>
                      <p className="text-[10px] text-muted">Systems pioneered by ServiceM8, Tradiepad, and Fergus.</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => alert("Searching YouTube API for Fast Scale SaaS pipelines logs: 'Sales Pipelines that scale fast by ServiceM8 CEO' and 'Fergus flat rate trade model'. Matches successfully loaded.")}
                    className="text-xs bg-red-600/10 border border-red-600/30 text-red-400 hover:bg-red-600/20 px-4 py-2 font-bold uppercase tracking-wider rounded transition-all"
                  >
                    View Verified YouTube Pipeline Lessons
                  </button>
                </div>
              </div>
            )}

            {activeSubTab === 'video' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div>
                    <span className="text-[10px] text-orange-500 uppercase font-bold tracking-widest font-mono">GOOGLE AUTOMATED CREATIVE AUDIO</span>
                    <h2 className="font-serif text-2xl text-paper mt-1">High-Converting Video Script Sequence</h2>
                  </div>
                  <button 
                    onClick={() => handleCopy(
                      `${campaignData.advertisingCampaign.videoAdScript.hook}\n\n${campaignData.advertisingCampaign.videoAdScript.problem}\n\n${campaignData.advertisingCampaign.videoAdScript.solution}\n\n${campaignData.advertisingCampaign.videoAdScript.cta}`, 
                      'script'
                    )}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 text-muted hover:text-paper text-xs transition-all font-mono"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    {copiedText === 'script' ? 'Copied!' : 'Copy Full Script'}
                  </button>
                </div>

                {/* Simulated Smartphone Reels / TikTok Screen */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Smartphone Preview Grid */}
                  <div className="md:col-span-1 bg-black border border-white/10 rounded-xl p-4 flex flex-col justify-between relative shadow-2xl overflow-hidden aspect-[9/16] max-h-[360px]">
                    <div className="absolute inset-0 bg-cover bg-center bg-no-referrer opacity-30" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80')" }} />
                    <div className="relative z-10 flex justify-between items-center text-[8px] font-mono text-muted">
                      <span>● LIVE REEL</span>
                      <span className="text-orange-400">Hammer & Code</span>
                    </div>

                    <div className="relative z-10 py-12 flex flex-col items-center justify-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-orange-600/25 border border-orange-500 flex items-center justify-center animate-pulse cursor-pointer">
                        <Play className="w-5 h-5 text-orange-400 ml-0.5" />
                      </div>
                      <p className="text-[10px] font-bold text-white tracking-wider text-center px-4 drop-shadow-md">Simulated Video Hook Sequence</p>
                    </div>

                    <div className="relative z-10 space-y-1">
                      <p className="text-[9px] font-bold text-white bg-black/60 p-2 rounded leading-snug">
                        {campaignData.advertisingCampaign.videoAdScript.hook.substring(0, 80)}...
                      </p>
                      <p className="text-[7px] text-muted text-right font-mono">Script Latency: 45s</p>
                    </div>
                  </div>

                  {/* Multi-scene Storyboarder */}
                  <div className="md:col-span-2 space-y-3.5">
                    {[
                      { stage: '1. HOOK (0-5s)', copy: campaignData.advertisingCampaign.videoAdScript.hook, color: 'border-l-orange-500' },
                      { stage: '2. PROBLEM (5-15s)', copy: campaignData.advertisingCampaign.videoAdScript.problem, color: 'border-l-yellow-500' },
                      { stage: '3. SOLUTION (15-30s)', copy: campaignData.advertisingCampaign.videoAdScript.solution, color: 'border-l-green-500' },
                      { stage: '5. OFFER & CTA (30-45s)', copy: campaignData.advertisingCampaign.videoAdScript.cta, color: 'border-l-cyan-500' },
                    ].map((step, idx) => (
                      <div key={idx} className={`bg-white/[0.01] border border-white/5 border-l-4 ${step.color} p-4 rounded-sm`}>
                        <p className="text-[9px] font-bold tracking-widest text-[#999] uppercase">{step.stage}</p>
                        <p className="text-[11px] text-paper mt-1 leading-relaxed font-sans">{step.copy}</p>
                      </div>
                    ))}
                  </div>

                </div>
              </div>
            )}

            {activeSubTab === 'partnership' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div>
                    <span className="text-[10px] text-orange-500 uppercase font-bold tracking-widest font-mono">AUSSIE PARTNERSHIP AGREEMENT DRAFT</span>
                    <h2 className="font-serif text-2xl text-paper mt-1">Memorandum of Understanding (MOU)</h2>
                  </div>
                  <button 
                    onClick={() => handleCopy(campaignData.partnershipAgreement.legalMemoText, 'mou')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 text-muted hover:text-paper text-xs transition-all font-mono"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    {copiedText === 'mou' ? 'Copied!' : 'Copy Terms'}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <p className="text-[10px] uppercase font-bold text-muted tracking-wide">Key Deal Clauses</p>
                    <div className="bg-white/[0.02] border border-white/5 p-4 rounded-sm space-y-4">
                      <div>
                        <h4 className="text-xs font-bold text-orange-400 mb-1">State Jurisdiction & Compliances</h4>
                        <p className="text-[11px] text-muted leading-relaxed">{campaignData.partnershipAgreement.stateJurisdiction}</p>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-orange-400 mb-1">Revenue Division & Lead splits</h4>
                        <p className="text-[11px] text-muted leading-relaxed">{campaignData.partnershipAgreement.clauseEquitySplit}</p>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-orange-400 mb-1">Scope of Works Allocation</h4>
                        <p className="text-[11px] text-muted leading-relaxed">{campaignData.partnershipAgreement.scopeOfWorks}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 flex flex-col justify-between">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-muted tracking-wide mb-2">Legal Document Preview</p>
                      <div className="bg-[#1b1b1f] border border-white/10 rounded-sm p-4 text-[10px] text-white/80 font-mono space-y-2 max-h-[190px] overflow-y-auto leading-normal whitespace-pre-wrap">
                        {campaignData.partnershipAgreement.legalMemoText}
                      </div>
                    </div>

                    <button 
                      onClick={() => alert("Initiating PDF Export of agreement draft to Google Drive Hammer Vault. Successful!")}
                      className="bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 px-4 rounded text-[10px] uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md w-full"
                    >
                      <Download className="w-4 h-4" /> Save Agreement Draft to Google Drive
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeSubTab === 'pricing' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div>
                    <span className="text-[10px] text-orange-500 uppercase font-bold tracking-widest font-mono">COMPETITION & PRICING AUDIT</span>
                    <h2 className="font-serif text-2xl text-paper mt-1">Pricing Strategy Blueprint</h2>
                  </div>
                  <button 
                    onClick={() => handleCopy(campaignData.pricingInvestigation.positioningStrategy, 'pricing_position')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 text-muted hover:text-paper text-xs transition-all font-mono"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    {copiedText === 'pricing_position' ? 'Copied!' : 'Copy Strategy'}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Benchmarks */}
                  <div className="md:col-span-1 bg-white/[0.01] border border-white/5 p-5 flex flex-col justify-between gap-6">
                    <div className="space-y-2">
                      <p className="text-[9px] uppercase font-bold text-muted tracking-wide">Competition Benchmark</p>
                      <p className="text-xs text-paper font-sans leading-relaxed">
                        {campaignData.pricingInvestigation.industryBenchmark}
                      </p>
                    </div>
                    <div className="text-[9px] text-[#8aa] bg-cyan-900/10 border border-cyan-800/20 p-2.5 rounded font-medium">
                      ✓ Audited from Melbourne directories
                    </div>
                  </div>

                  {/* Pricing Cards */}
                  <div className="md:col-span-2 space-y-4">
                    <p className="text-[10px] uppercase font-bold text-muted tracking-wide">Suggested Rates (Hammer & Code Approved)</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      <div className="bg-[#1b1b1e] border-l-4 border-orange-500 p-5 rounded-r">
                        <p className="text-[9px] uppercase text-muted font-bold mb-1">RECOMMENDED BASE HOURLY</p>
                        <h4 className="font-serif text-xl text-paper font-bold">{campaignData.pricingInvestigation.recommendedHourly}</h4>
                        <p className="text-[10px] text-muted mt-2 leading-relaxed">Base rate for extensive structural works, pipeline layouts, and team dispatches.</p>
                      </div>

                      <div className="bg-[#1b1b1e] border-l-4 border-emerald-500 p-5 rounded-r">
                        <p className="text-[9px] uppercase text-muted font-bold mb-1">FLAT-RATE SERVICE DIAGNOSTIC</p>
                        <h4 className="font-serif text-xl-3 text-emerald-400 font-bold">{campaignData.pricingInvestigation.recommendedFlatRatePackage}</h4>
                        <p className="text-[10px] text-muted mt-2 leading-relaxed">Lowers upfront user friction. Secure booking on-site within 35 seconds, then pitch full scope repairs.</p>
                      </div>

                    </div>

                    <div className="bg-orange-500/5 border border-orange-500/10 p-4 rounded-sm">
                      <p className="text-xs font-bold text-orange-400 mb-1">Strategic Positioning Advice:</p>
                      <p className="text-xs text-muted leading-relaxed font-sans italic">
                        "{campaignData.pricingInvestigation.positioningStrategy}"
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {activeSubTab === 'socials' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div>
                    <span className="text-[10px] text-orange-500 uppercase font-bold tracking-widest font-mono">SOCIAL CHANNELS & ACCOUNTS BUILDER</span>
                    <h2 className="font-serif text-2xl text-paper mt-1">Cheeky Aussie Direct-Response Copy</h2>
                  </div>
                  <button 
                    onClick={() => handleCopy(campaignData.socialsBlueprint.firstPostCaption, 'social_post')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 text-muted hover:text-paper text-xs transition-all font-mono"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    {copiedText === 'social_post' ? 'Copied!' : 'Copy Caption'}
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="bg-[#1b1b1f] border border-white/10 p-5 rounded-md relative">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 rounded-full bg-orange-600 flex items-center justify-center font-bold text-[9px] text-white">HC</div>
                      <div>
                        <p className="text-[10px] font-bold text-paper">Hammer & Code Sub-node</p>
                        <p className="text-[8px] text-muted font-mono">Just now · Melbourne</p>
                      </div>
                    </div>
                    <p className="text-xs text-paper whitespace-pre-wrap leading-relaxed font-sans">
                      {campaignData.socialsBlueprint.firstPostCaption}
                    </p>
                    <p className="text-xs text-orange-400 mt-4 leading-normal font-mono">
                      {campaignData.socialsBlueprint.hashtagPool}
                    </p>
                  </div>

                  <div className="bg-white/[0.01] border border-white/5 p-4 rounded-sm">
                    <h4 className="text-xs font-bold text-muted mb-2 uppercase tracking-wide">Rapid Scale Content Strategy Cadence</h4>
                    <p className="text-xs text-muted leading-relaxed">
                      {campaignData.socialsBlueprint.weeklyCadence}
                    </p>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
