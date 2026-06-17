import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Phone, 
  MessageSquare, 
  CheckCircle2, 
  ArrowRight, 
  Settings, 
  LayoutDashboard, 
  LogOut,
  Calendar,
  Clock,
  TrendingUp,
  CreditCard,
  ChevronRight,
  ShieldCheck,
  User,
  Building2,
  Sparkles,
  Zap,
  Search,
  Plus,
  X,
  Volume2,
  Mic,
  PhoneCall,
  PhoneIncoming,
  UserCheck,
  AlertCircle,
  FileText,
  Navigation,
  CheckSquare,
  Copy,
  Send,
  Wrench
} from 'lucide-react';
import { cn } from './lib/utils';
import { initAuth, googleSignIn, logout as googleLogout, getAccessToken } from './lib/googleAuth';
import HammerCodeHub from './components/HammerCodeHub';
import { 
  Cloud, 
  Folder, 
  Trash2, 
  RefreshCw, 
  Upload, 
  FileCheck, 
  ExternalLink 
} from 'lucide-react';

// --- Types ---
type Page = 'landing' | 'setup' | 'dashboard';

// --- Sub-components ---

const Logo = () => (
  <div className="font-serif text-2xl tracking-wider text-paper">
    Zen<span className="text-gold">na</span>
  </div>
);

// ─────────────────────────────────────────
// LANDING PAGE
// ─────────────────────────────────────────
const Landing = ({ onGetStarted }: { onGetStarted: () => void }) => {
  return (
    <div className="min-h-screen relative overflow-hidden bg-ink">
      {/* Grainy Noise Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 flex items-center justify-between px-8 py-6 bg-gradient-to-b from-ink to-transparent">
        <Logo />
        <button 
          onClick={onGetStarted}
          className="bg-gold hover:bg-gold-lt text-ink px-6 py-2 rounded font-medium text-sm tracking-wider uppercase transition-colors"
        >
          Get Started
        </button>
      </nav>

      <section className="relative pt-40 pb-20 px-8 max-w-7xl mx-auto flex flex-col items-start gap-10">
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-gold font-medium tracking-[0.2em] uppercase text-xs"
        >
          AI Receptionist & Business Intelligence
        </motion.p>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="font-serif text-6xl md:text-8xl leading-[0.95] max-w-3xl"
        >
          She answers.<br />So you <em className="italic text-gold">don't</em> have to.
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-muted text-lg max-w-md leading-relaxed"
        >
          Zenna catches every missed call, recovers every lead, and briefs you on your business — while you focus on the work.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-wrap items-center gap-6"
        >
          <button 
            onClick={onGetStarted}
            className="bg-gold hover:bg-gold-lt text-ink px-8 py-4 rounded font-medium text-sm tracking-widest uppercase transition-all flex items-center gap-2 group"
          >
            Meet Zenna <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <a href="#how" className="text-muted hover:text-paper transition-colors text-sm tracking-widest uppercase">
            See how it works →
          </a>
        </motion.div>

        {/* SMS Preview Mockup */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gold/10 blur-[100px] rounded-full" />
            <div className="relative space-y-4">
              <div className="bg-[#1c1c1e] border border-white/5 rounded-2xl p-6 max-w-xs shadow-2xl">
                <p className="text-[10px] text-gold uppercase tracking-widest mb-2">Zenna</p>
                <p className="text-sm leading-relaxed text-paper">
                  G'day! Thanks for getting in touch with Hartley Plumbing — our team is currently on the tools responding to an urgent job, but we've got your query! We'll call back soon, or text us here.
                </p>
                <p className="text-[10px] text-muted text-right mt-2">Today 2:14 PM · Delivered</p>
              </div>
              <div className="bg-gold/10 border border-gold/20 rounded-2xl p-6 max-w-xs ml-10 shadow-2xl backdrop-blur-sm">
                <p className="text-[10px] text-gold uppercase tracking-widest mb-2">Zenna → You</p>
                <p className="text-sm leading-relaxed text-paper italic">
                  End of day wrap: $4,200 confirmed. 3 new leads — 2 booked, 1 needs a quote. Call Mike T. before 9am. 🤙
                </p>
                <p className="text-[10px] text-muted text-right mt-2">Today 6:00 PM</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Steps Section */}
      <section id="how" className="py-32 px-8 max-w-7xl mx-auto border-t border-white/5">
        <p className="text-gold text-xs tracking-widest uppercase mb-6">How it works</p>
        <h2 className="font-serif text-4xl md:text-5xl mb-20 max-w-xl">Set up once. Zenna runs forever.</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
          {[
            { num: '01', title: 'A call comes in', desc: "You're on a job. Under a car. With a patient. The phone rings and you can't answer." },
            { num: '02', title: 'Zenna catches it', desc: "Within seconds, Zenna sends a warm, personalised SMS. She knows your business and your hours." },
            { num: '03', title: 'The lead is alive', desc: "The caller gets a response. Zenna handles the talk, captures details, and logs them to your dashboard." },
          ].map((step, i) => (
            <div key={i} className="bg-surface/30 p-10 border border-white/5 hover:border-gold/30 transition-colors group">
              <p className="font-serif text-5xl text-gold/20 mb-6 group-hover:text-gold/40 transition-colors">{step.num}</p>
              <h3 className="font-serif text-xl mb-4">{step.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

// ─────────────────────────────────────────
// SETUP PAGE
// ─────────────────────────────────────────
const Setup = ({ onComplete, setBusinessName }: { onComplete: () => void, setBusinessName: (name: string) => void }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    businessName: '',
    industry: '',
    openTime: '08:00',
    closeTime: '17:00',
    bookingLink: '',
    twilioNumber: '',
    ownerPhone: '',
    ownerName: ''
  });

  const nextStep = () => setStep(s => Math.min(s + 1, 4));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  return (
    <div className="min-h-screen bg-ink flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <div className="w-full md:w-[380px] bg-[#111] border-r border-white/5 p-12 flex flex-col">
        <Logo />
        <div className="mt-16 flex-1 space-y-0">
          {[
            { id: 1, title: 'Your Business', desc: 'Name, hours, and representation' },
            { id: 2, title: 'Your Numbers', desc: 'Connectivity and briefings' },
            { id: 3, title: 'Behaviour', desc: 'Response style and timing' },
            { id: 4, title: 'Go Live', desc: 'Final activation' },
          ].map((s) => (
            <div 
              key={s.id} 
              className={cn(
                "flex items-start gap-4 py-6 border-b border-white/5 transition-opacity",
                step === s.id ? "opacity-100" : "opacity-40"
              )}
            >
              <div className={cn(
                "w-7 h-7 rounded-full border border-white/10 flex items-center justify-center text-[10px] font-medium transition-colors",
                step === s.id && "border-gold text-gold bg-gold/10",
                step > s.id && "border-green-500/50 text-green-500 bg-green-500/10"
              )}>
                {step > s.id ? <CheckCircle2 className="w-3 h-3" /> : s.id}
              </div>
              <div>
                <h4 className="text-sm font-medium">{s.title}</h4>
                <p className="text-[10px] text-muted leading-tight mt-1">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 md:p-20 overflow-y-auto">
        <div className="max-w-xl mx-auto">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <p className="text-gold text-[10px] tracking-[0.2em] uppercase font-medium mb-4">Step 1 of 4</p>
                <h2 className="font-serif text-4xl mb-4">Tell Zenna about your business.</h2>
                <p className="text-muted text-sm mb-12">She'll use this to represent you perfectly — every message will sound like it came from your team.</p>

                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-muted mb-2">Business Name</label>
                    <input 
                      type="text" 
                      className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 outline-none focus:border-gold/50 transition-colors"
                      placeholder="e.g. Zenna App Studio"
                      value={formData.businessName}
                      onChange={e => setFormData({...formData, businessName: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-muted mb-2">Industry</label>
                    <select 
                      className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 outline-none focus:border-gold/50 transition-colors appearance-none"
                      value={formData.industry}
                      onChange={e => setFormData({...formData, industry: e.target.value})}
                    >
                      <option value="">Select your industry</option>
                      <option>SaaS & Web Apps</option>
                      <option>Mobile App Studio</option>
                      <option>Digital Agency</option>
                      <option>AI Consulting</option>
                      <option>E-Commerce</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-muted mb-2">Open Time</label>
                      <input 
                        type="time" 
                        className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 outline-none focus:border-gold/50 transition-colors" 
                        value={formData.openTime} 
                        onChange={e => setFormData({...formData, openTime: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-muted mb-2">Close Time</label>
                      <input 
                        type="time" 
                        className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 outline-none focus:border-gold/50 transition-colors" 
                        value={formData.closeTime} 
                        onChange={e => setFormData({...formData, closeTime: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-muted mb-2">Booking Link (optional)</label>
                    <input 
                      type="text" 
                      className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 outline-none focus:border-gold/50 transition-colors"
                      placeholder="e.g. calendly.com/yourbusiness"
                      value={formData.bookingLink}
                      onChange={e => setFormData({...formData, bookingLink: e.target.value})}
                    />
                    <p className="text-[9px] text-muted mt-2 uppercase tracking-tight">Zenna uses this for automated scheduling in SMS replies.</p>
                  </div>
                </div>
              </motion.div>
            )}
            
            {step === 4 && (
              <motion.div 
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mb-8">
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                </div>
                <h2 className="font-serif text-4xl mb-4">Zenna's ready.</h2>
                <p className="text-muted text-sm mb-12">One last step: forward your missed calls to your Zenna number. She starts working the moment the first call comes in.</p>
                
                <div className="space-y-4">
                  <div className="bg-white/5 border border-white/10 border-l-gold border-l-2 p-6 rounded-r">
                    <h4 className="text-xs font-semibold mb-2 uppercase tracking-wider text-paper">iPhone Setup</h4>
                    <p className="text-[11px] text-muted">Settings → Phone → Call Forwarding → Enable → Enter Zenna Number</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 border-l-gold border-l-2 p-6 rounded-r">
                    <h4 className="text-xs font-semibold mb-2 uppercase tracking-wider text-paper">Android Setup</h4>
                    <p className="text-[11px] text-muted">Phone app → Settings → Calls → Call Forwarding → When Unanswered</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-16 flex items-center gap-6">
            <button 
              onClick={step === 4 ? () => { if (formData.businessName) setBusinessName(formData.businessName); onComplete(); } : nextStep}
              className="bg-gold hover:bg-gold-lt text-ink px-10 py-4 rounded font-medium text-sm tracking-widest uppercase transition-all"
            >
              {step === 4 ? 'Go to Dashboard' : 'Continue'}
            </button>
            {step > 1 && (
              <button 
                onClick={prevStep}
                className="text-muted hover:text-paper transition-colors text-sm uppercase tracking-widest"
              >
                Back
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────
// DASHBOARD
// ─────────────────────────────────────────
const Dashboard = ({ businessName }: { businessName: string }) => {
  const [currentModule, setCurrentModule] = useState<'hammerCode' | 'receptionist'>('hammerCode');
  const [stats, setStats] = useState({
    confirmedValue: 12700,
    newLeads: 3,
    callsCaught: 2,
    actionRequired: 'Call Mike T. before 9am'
  });

  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { role: 'zenna', text: "G'day boss — good day. $12,700 confirmed across your leads. Your key action: call Mike Torrence before 9am tomorrow regarding the bathroom reno. Slide through the caller simulator to see me answer incoming calls in real-time with automatic CRM lookup. 🤙", time: '6:00 PM' }
  ]);

  // --- ZenVoice States ---
  const [phoneToSimulate, setPhoneToSimulate] = useState('+61 412 891 044');
  const [activeVoiceCall, setActiveVoiceCall] = useState<any | null>(null);
  const [isSimulatingCall, setIsSimulatingCall] = useState(false);
  const [isCallConnecting, setIsCallConnecting] = useState(false);
  const [callerMessage, setCallerMessage] = useState('');
  const [isZennaSynthesizing, setIsZennaSynthesizing] = useState(false);
  
  // Custom lead creation modal states
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  const [leadFormData, setLeadFormData] = useState({
    name: '',
    phone: '',
    value: '$1,500',
    status: 'New',
    notes: ''
  });

  // --- Zenna Auto-Trade Workshop (Quotes & Dispatches) States ---
  const [selectedTradeLeadIndex, setSelectedTradeLeadIndex] = useState<number>(0);
  const [draftedQuote, setDraftedQuote] = useState<any | null>(null);
  const [isDraftingQuote, setIsDraftingQuote] = useState(false);
  const [calculatedDispatch, setCalculatedDispatch] = useState<any | null>(null);
  const [isCalculatingDispatch, setIsCalculatingDispatch] = useState(false);

  // --- Google Drive States ---
  const [googleUser, setGoogleUser] = useState<any>(null);
  const [driveToken, setDriveToken] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(true);
  const [driveFiles, setDriveFiles] = useState<any[]>([]);
  const [isFetchingDrive, setIsFetchingDrive] = useState(false);
  const [driveSearch, setDriveSearch] = useState('');
  const [isUploadingToDrive, setIsUploadingToDrive] = useState(false);
  
  // Custom states for Save to Drive links & status
  const [savingQuoteToDrive, setSavingQuoteToDrive] = useState(false);
  const [savedQuoteLink, setSavedQuoteLink] = useState<string | null>(null);
  const [savingDispatchToDrive, setSavingDispatchToDrive] = useState(false);
  const [savedDispatchLink, setSavedDispatchLink] = useState<string | null>(null);

  // --- Unified Connectors & Plugins States ---
  const [selectedConnectorTab, setSelectedConnectorTab] = useState<'vault' | 'calendar' | 'twilio' | 'stripe'>('vault');
  
  // Google Calendar States
  const [calendarEvents, setCalendarEvents] = useState<any[]>([]);
  const [isFetchingCalendar, setIsFetchingCalendar] = useState(false);
  const [syncingToCalendar, setSyncingToCalendar] = useState<{[key: number]: boolean}>({});
  const [syncedCalendarLink, setSyncedCalendarLink] = useState<{[key: number]: string | null}>({});

  // Twilio SMS Relay Settings
  const [twilioEnabled, setTwilioEnabled] = useState(true);
  const [autoDraftCRM, setAutoDraftCRM] = useState(true);
  const [missedCallTemplate, setMissedCallTemplate] = useState("G'day, sorry we missed your ring. Zenna here from Hartley Plumbing. Our team is on the tools responding to an urgent job right now, but we've got your number. Reply with your job details or book a booking directly: https://calendly.com/hartley-plumbing");
  const [isSavingTwilioConfig, setIsSavingTwilioConfig] = useState(false);

  // Stripe Trade Billing States
  const [stripeEnabled, setStripeEnabled] = useState(true);
  const [hourlyRate, setHourlyRate] = useState(180);
  const [depositPercent, setDepositPercent] = useState(10);
  const [generatedInvoiceLeadIndex, setGeneratedInvoiceLeadIndex] = useState<number | null>(null);
  const [invoiceItems, setInvoiceItems] = useState<{description: string, price: string}[]>([]);
  const [stripeInvoicePaid, setStripeInvoicePaid] = useState<{[key: number]: boolean}>({});
  const [isGeneratingStripeUrl, setIsGeneratingStripeUrl] = useState(false);

  const fetchDriveFiles = async (tokenStr?: string, searchQuery?: string) => {
    const currentToken = tokenStr || driveToken;
    if (!currentToken) return;
    setIsFetchingDrive(true);
    try {
      let url = 'https://www.googleapis.com/drive/v3/files?pageSize=15&fields=files(id,name,mimeType,webViewLink,createdTime)&orderBy=createdTime%20desc';
      if (searchQuery && searchQuery.trim() !== '') {
        const escaped = searchQuery.replace(/'/g, "\\'");
        url += `&q=name%20contains%20'${encodeURIComponent(escaped)}'%20and%20trashed%20%3D%20false`;
      } else {
        url += '&q=trashed%20%3D%20false';
      }
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${currentToken}` }
      });
      const data = await res.json();
      if (data.files) {
        setDriveFiles(data.files);
      }
    } catch (err) {
      console.error('Error fetching files:', err);
    } finally {
      setIsFetchingDrive(false);
    }
  };

  const fetchCalendarEvents = async (tokenStr?: string) => {
    const currentToken = tokenStr || driveToken;
    if (!currentToken) return;
    setIsFetchingCalendar(true);
    try {
      const now = new Date().toISOString();
      const res = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events?maxResults=8&timeMin=${encodeURIComponent(now)}&orderBy=startTime&singleEvents=true`, {
        headers: { Authorization: `Bearer ${currentToken}` }
      });
      const data = await res.json();
      if (data.items) {
        setCalendarEvents(data.items);
      }
    } catch (err) {
      console.error('Error fetching calendar events:', err);
    } finally {
      setIsFetchingCalendar(false);
    }
  };

  const syncLeadToGoogleCalendar = async (index: number) => {
    const lead = leads[index];
    if (!driveToken || !lead) return;

    const confirmed = window.confirm(`Schedule and Sync "${lead.name}" developer scoping session automatically onto your Google Calendar?`);
    if (!confirmed) return;

    setSyncingToCalendar(prev => ({ ...prev, [index]: true }));

    // Let's establish start/end times based on the scheduling note, e.g. Sandra Wu 10:30 AM
    // Or default to tomorrow 9:00 AM.
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    let hours = 9;
    let minutes = 0;
    
    if (lead.notes && lead.notes.toLowerCase().includes('10:30')) {
      hours = 10;
      minutes = 30;
    } else if (lead.notes && lead.notes.toLowerCase().includes('8:00')) {
      hours = 8;
      minutes = 0;
    } else if (lead.notes && lead.notes.toLowerCase().includes('1:00')) {
      hours = 13;
      minutes = 0;
    }
    
    tomorrow.setHours(hours, minutes, 0, 0);
    const tomorrowEnd = new Date(tomorrow);
    tomorrowEnd.setHours(tomorrowEnd.getHours() + 1); // default 1 hour for scoping call

    try {
      const eventData = {
        summary: `💻 Zenna App Studio — Developer Scoping Call for ${lead.name}`,
        location: `Zenna Google Meet (Virtual)`,
        description: `Zenna-dispatched client discovery meeting.\n\nClient Name: ${lead.name}\nClient Phone: ${lead.phone}\nEstimated Project Budget: ${lead.value}\n\nApp / SaaS Scope Notes:\n"${lead.notes || 'Custom Software / SaaS MVP discovery.'}"\n\nAutomatically synchronized via Zenna Cloud Connections Hub.`,
        start: {
          dateTime: tomorrow.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Australia/Melbourne'
        },
        end: {
          dateTime: tomorrowEnd.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Australia/Melbourne'
        },
        reminders: {
          useDefault: true
        }
      };

      const res = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${driveToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventData)
      });

      const data = await res.json();
      if (data.htmlLink) {
        setSyncedCalendarLink(prev => ({ ...prev, [index]: data.htmlLink }));
        setChatMessages(prev => [...prev, {
          role: 'zenna',
          text: `Too easy! I've scheduled your project scoping session for ${lead.name} tomorrow on your Google Calendar. Live scheduling active. 📅`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        fetchCalendarEvents(driveToken);
      } else {
        alert(data.error?.message || 'Failed to sync with Google Calendar API.');
      }
    } catch (err) {
      console.error('Error syncing with Google Calendar:', err);
      alert('Network error trying to connect to Google Calendar.');
    } finally {
      setSyncingToCalendar(prev => ({ ...prev, [index]: false }));
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      const result = await googleSignIn();
      if (result) {
        setGoogleUser(result.user);
        setDriveToken(result.accessToken);
        fetchDriveFiles(result.accessToken);
        fetchCalendarEvents(result.accessToken);
        
        setChatMessages(prev => [...prev, {
          role: 'zenna',
          text: `G'day! Google Account connected successfully. Both your Google Drive Cloud Storage and Google Calendar Dispatching are now synced live. 🤙`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }
    } catch (err) {
      console.error('Google authorization failed:', err);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleGoogleLogout = async () => {
    setIsGoogleLoading(true);
    try {
      await googleLogout();
      setGoogleUser(null);
      setDriveToken(null);
      setDriveFiles([]);
      setCalendarEvents([]);
      setSyncedCalendarLink({});
      setSavedQuoteLink(null);
      setSavedDispatchLink(null);
      setChatMessages(prev => [...prev, {
        role: 'zenna',
        text: `Logged out from Google. Cloud Drive & Calendar features are now in secure stand-by mode.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch (err) {
      console.error('Sign out error:', err);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const uploadFileToDrive = async (file: File) => {
    if (!driveToken) return;
    
    const confirmed = window.confirm(`Upload file "${file.name}" directly to your Google Drive Zenna Vault?`);
    if (!confirmed) return;

    setIsUploadingToDrive(true);
    try {
      const metadata = {
        name: file.name
      };
      const form = new FormData();
      form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
      form.append('file', file);

      const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink', {
        method: 'POST',
        headers: { Authorization: `Bearer ${driveToken}` },
        body: form
      });
      const data = await res.json();
      if (data.id) {
        setChatMessages(prev => [...prev, {
          role: 'zenna',
          text: `Sweet! I've successfully synced your file "${data.name}" directly to Google Drive. It is now registered in your Zenna Vault. 📂`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        fetchDriveFiles(driveToken);
      }
    } catch (err) {
      console.error('Error uploading file:', err);
    } finally {
      setIsUploadingToDrive(false);
    }
  };

  const saveQuoteToDrive = async () => {
    const targetLead = leads[selectedTradeLeadIndex];
    if (!driveToken || !draftedQuote || !targetLead) return;
    const clientName = targetLead.name;
    const filename = `Zenna App Studio - Estimate for ${clientName}.html`;

    const confirmed = window.confirm(`Zenna will create a formal HTML estimate document named "${filename}" in your Google Drive. Continue?`);
    if (!confirmed) return;

    setSavingQuoteToDrive(true);
    setSavedQuoteLink(null);

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Zenna App Studio - Estimate for ${clientName}</title>
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #020c08; margin: 0; padding: 40px; background-color: #fcfcfc; }
    .invoice-box { max-width: 800px; margin: auto; padding: 30px; border: 1px solid #e1e8e5; background: #fff; box-shadow: 0 0 10px rgba(0, 0, 0, 0.05); }
    .header { border-bottom: 2px solid #d4af37; padding-bottom: 20px; margin-bottom: 20px; }
    h1 { font-family: Georgia, serif; color: #0b1a15; margin: 0; font-size: 28px; }
    .logo { font-size: 20px; font-weight: bold; color: #d4af37; }
    .intro-text { font-style: italic; color: #555; background: #f8faf9; padding: 15px; border-left: 4px solid #d4af37; margin: 20px 0; font-size: 14px; line-height: 1.6; }
    table { width: 100%; border-collapse: collapse; margin: 25px 0; }
    th { background-color: #0b1a15; color: #fafcfb; text-align: left; padding: 12px; font-size: 13px; text-transform: uppercase; letter-spacing: 0.1em; }
    td { padding: 12px; border-bottom: 1px solid #eee; font-size: 14px; }
    .total-row td { border-top: 2px solid #0b1a15; font-weight: bold; font-size: 16px; color: #0b1a15; }
    .warranty { background-color: #fcfbfa; border: 1px solid #ebd490; padding: 15px; border-radius: 4px; font-size: 12px; line-height: 1.5; margin-top: 30px; color: #6b6560; }
  </style>
</head>
<body>
  <div class="invoice-box">
    <div class="header">
      <table style="margin: 0; border: none;">
         <tr style="border: none;">
          <td style="border: none; padding: 0;">
            <div class="logo">Zenna App Studio</div>
            <span style="font-size: 11px; color: #666;">ABN: 44 912 044 112</span>
          </td>
          <td style="border: none; padding: 0; text-align: right; vertical-align: top;">
            <h1>PROJECT ESTIMATE</h1>
            <span style="font-size: 12px; color: #888;">Date: ${new Date().toLocaleDateString('en-AU')}</span>
          </td>
        </tr>
      </table>
    </div>

    <div class="intro-text">
      "${draftedQuote.intro}"
    </div>

    <table>
      <thead>
        <tr>
          <th>Scoping Milestone & Deliverable Description</th>
          <th style="text-align: right; width: 150px;">Estimate (AUD)</th>
        </tr>
      </thead>
      <tbody>
        ${draftedQuote.items?.map((item: any) => `
          <tr>
            <td>${item.description}</td>
            <td style="text-align: right; font-weight: bold;">${item.price}</td>
          </tr>
        `).join('')}
        <tr style="border: none;">
          <td style="text-align: right; padding-top: 20px;">GST Component (10.0% inclusive):</td>
          <td style="text-align: right; padding-top: 20px; font-weight: bold;">${draftedQuote.gst}</td>
        </tr>
        <tr class="total-row">
          <td style="text-align: right;">TOTAL ESTIMATED VALUE:</td>
          <td style="text-align: right; color: #0a4d33;">${draftedQuote.total}</td>
        </tr>
      </tbody>
    </table>

    <div class="warranty">
      <strong>Zenna Professional Software Guarantee:</strong><br/>
      ${draftedQuote.warranty}
    </div>
  </div>
</body>
</html>
    `;

    try {
      const metadata = {
        name: filename,
        mimeType: 'text/html'
      };
      const form = new FormData();
      form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
      form.append('file', new Blob([htmlContent], { type: 'text/html' }));

      const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink', {
        method: 'POST',
        headers: { Authorization: `Bearer ${driveToken}` },
        body: form
      });
      const data = await res.json();
      if (data.id) {
        setSavedQuoteLink(data.webViewLink);
        setChatMessages(prev => [...prev, {
          role: 'zenna',
          text: `Spot on! The Scoping Estimate for ${clientName} is now live on Google Drive. 📂`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        fetchDriveFiles(driveToken);
      }
    } catch (err) {
      console.error('Error saving quote to drive:', err);
    } finally {
      setSavingQuoteToDrive(false);
    }
  };

  const saveDispatchToDrive = async () => {
    const targetLead = leads[selectedTradeLeadIndex];
    if (!driveToken || !calculatedDispatch || !targetLead) return;
    const clientName = targetLead.name;
    const filename = `Zenna App Studio - Workspace Setup - ${clientName}.txt`;

    const confirmed = window.confirm(`Save development brief for "${clientName}" into Google Drive?`);
    if (!confirmed) return;

    setSavingDispatchToDrive(true);
    setSavedDispatchLink(null);

    const textContent = `
ZENNA PLATFORM - PROJECT BRIEF & ESTIMATE
===========================================
Prepared By: Zenna
Date: ${new Date().toLocaleDateString('en-AU')}
Client Name: ${clientName}

TRADE WORKSPACE METRICS
-----------------------
Scaffold Project Duration: ${calculatedDispatch.travelMinutes}
Resource Payload Estimate: ${calculatedDispatch.distanceKm}
Operational Service Location: ${calculatedDispatch.dispatchZone}

REQUIRED WORK blocks & TOOLS
-----------------------------
${calculatedDispatch.toolsRequired?.map((t: string) => `[ ] ${t}`).join('\n')}

CLIENT ALERT NOTIFICATION LOG
------------------------------
"${calculatedDispatch.clientAlertDraft}"

===========================================
Compiled by Zenna Business Intelligence Relay.
    `;

    try {
      const metadata = {
        name: filename,
        mimeType: 'text/plain'
      };
      const form = new FormData();
      form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
      form.append('file', new Blob([textContent], { type: 'text/plain' }));

      const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink', {
        method: 'POST',
        headers: { Authorization: `Bearer ${driveToken}` },
        body: form
      });
      const data = await res.json();
      if (data.id) {
        setSavedDispatchLink(data.webViewLink);
        setChatMessages(prev => [...prev, {
          role: 'zenna',
          text: `Project briefing sheet for ${clientName} synced to Google Drive. All set! 🤙`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        fetchDriveFiles(driveToken);
      }
    } catch (err) {
      console.error('Error saving dispatch to drive:', err);
    } finally {
      setSavingDispatchToDrive(false);
    }
  };

  const deleteDriveFile = async (fileId: string, fileName: string) => {
    if (!driveToken) return;

    const confirmed = window.confirm(`Permanently trash "${fileName}" from your Google Drive Zenna Vault?`);
    if (!confirmed) return;

    try {
      await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${driveToken}` }
      });
      setChatMessages(prev => [...prev, {
        role: 'zenna',
        text: `I've removed "${fileName}" from your cloud folder. Keep things clean. 🤙`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      fetchDriveFiles(driveToken);
    } catch (err) {
      console.error('Error deleting file:', err);
    }
  };
  const [activeTradeTab, setActiveTradeTab] = useState<'quote' | 'dispatch'>('quote');
  const [quoteCopied, setQuoteCopied] = useState(false);
  const [dispatchCopied, setDispatchCopied] = useState(false);
  const [quoteSentStatus, setQuoteSentStatus] = useState(false);

  const generateZennaQuote = async (leadIndex: number) => {
    const targetLead = leads[leadIndex];
    if (!targetLead) return;
    setIsDraftingQuote(true);
    setDraftedQuote(null);
    setQuoteSentStatus(false);
    try {
      const res = await fetch('/api/draft-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: targetLead.name,
          clientNotes: targetLead.notes || "Emergency call-out service request"
        })
      });
      const data = await res.json();
      if (data.success) {
        setDraftedQuote(data.quote);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsDraftingQuote(false);
    }
  };

  const calculateZennaDispatch = async (leadIndex: number) => {
    const targetLead = leads[leadIndex];
    if (!targetLead) return;
    setIsCalculatingDispatch(true);
    setCalculatedDispatch(null);
    try {
      const res = await fetch('/api/route-dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: targetLead.name,
          clientNotes: targetLead.notes || "Custom SaaS scope design & MVP boilerplate configuration"
        })
      });
      const data = await res.json();
      if (data.success) {
        setCalculatedDispatch(data.dispatch);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsCalculatingDispatch(false);
    }
  };

  const fetchData = async () => {
    try {
      const [statsRes, leadsRes] = await Promise.all([
        fetch('/api/stats'),
        fetch('/api/leads')
      ]);
      const statsData = await statsRes.json();
      const leadsData = await leadsRes.json();
      setStats(statsData.today);
      setLeads(leadsData);
    } catch (err) {
      console.error("Fetch error in Dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const unsubscribe = initAuth(
      (user, token) => {
        setGoogleUser(user);
        setDriveToken(token);
        setIsGoogleLoading(false);
        fetchDriveFiles(token);
        fetchCalendarEvents(token);
      },
      () => {
        setGoogleUser(null);
        setDriveToken(null);
        setIsGoogleLoading(false);
        setDriveFiles([]);
        setCalendarEvents([]);
      }
    );
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handleAsk = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'owner', text: userMsg, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    
    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userMsg })
      });
      const data = await res.json();
      setChatMessages(prev => [...prev, { role: 'zenna', text: data.answer, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    } catch (err) {
      setChatMessages(prev => [...prev, { role: 'zenna', text: "I'm having trouble connecting to my brain. Check your internet?", time: 'Error' }]);
    }
  };

  // Trigger simulated voice lookup call
  const startCallSimulation = async (phoneNumber: string) => {
    setIsSimulatingCall(true);
    setIsCallConnecting(true);
    setActiveVoiceCall(null);
    setCallerMessage('');
    
    try {
      const res = await fetch('/api/simulate-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phoneNumber })
      });
      const data = await res.json();
      
      setActiveVoiceCall({
        client: data.client,
        script: data.script,
        dialog: [
          { sender: 'system', text: `⚡ INCOMING CALL DETECTED: routing to Zenna Voice Node...` },
          { sender: 'system', text: `🔍 DATABASE CRM LOOKUP: ${data.found ? `SUCCESS matched client [${data.client.name}]` : 'NO RECORD FOUND (New Potential Client)'}` },
          { sender: 'zenna', text: data.script }
        ]
      });
      
      fetchData(); // update stats of calls caught
    } catch (err) {
      console.error("Simulation error:", err);
    } finally {
      setIsCallConnecting(false);
    }
  };

  const handleCallerReply = async () => {
    if (!callerMessage.trim() || !activeVoiceCall) return;
    const msg = callerMessage;
    setCallerMessage('');
    
    const updatedDialog = [...activeVoiceCall.dialog, { sender: 'caller', text: msg }];
    setActiveVoiceCall(prev => prev ? {
      ...prev,
      dialog: updatedDialog
    } : null);
    
    setIsZennaSynthesizing(true);
    
    try {
      const systemPrompt = `You are Zenna, taking a live voice call for ${businessName || 'Zenna App Studio'}.
      Client CRM record info: Name = ${activeVoiceCall.client.name}, notes = ${activeVoiceCall.client.notes}, status = ${activeVoiceCall.client.status}.
      
      Previous transcript of this voice call:
      ${updatedDialog.map(d => `${d.sender === 'zenna' ? 'Zenna' : 'Caller'}: ${d.text}`).join('\n')}
      
      Respond directly to what they just said. Keep it warm, highly realistic, professional, and within 1-2 friendly sentences. Speak directly to them using their lookup info if appropriate. Keep it conversational.`;
      
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: `The caller said: "${msg}". Generatively answer them.` })
      });
      const data = await res.json();
      
      setActiveVoiceCall(prev => prev ? {
        ...prev,
        dialog: [...prev.dialog, { sender: 'zenna', text: data.answer }]
      } : null);
    } catch (err) {
      console.error("Reply error:", err);
    } finally {
      setIsZennaSynthesizing(false);
    }
  };

  const handleAddLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadFormData.name || !leadFormData.phone) return;
    
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadFormData)
      });
      if (res.ok) {
        setShowAddLeadModal(false);
        setLeadFormData({ name: '', phone: '', value: '$1,500', status: 'New', notes: '' });
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-ink flex relative">
      {/* Sidebar */}
      <aside className="w-20 lg:w-64 bg-[#111] border-r border-white/5 flex flex-col py-8 group transition-all">
        <div className="px-6 mb-12">
          <Logo />
        </div>
        
        <nav className="flex-1 px-3 space-y-2">
          <button 
            type="button"
            onClick={() => setCurrentModule('hammerCode')}
            className={cn(
              "w-full flex items-center gap-4 px-4 py-3 rounded group-hover:px-6 transition-all cursor-pointer text-left outline-none",
              currentModule === 'hammerCode' ? "bg-orange-500/10 text-orange-400 border border-orange-500/20" : "text-muted hover:bg-white/5 hover:text-paper"
            )}
          >
            <Wrench className="w-5 h-5 flex-shrink-0" />
            <span className="hidden lg:inline text-sm font-medium">Hammer & Code</span>
          </button>

          <button 
            type="button"
            onClick={() => setCurrentModule('receptionist')}
            className={cn(
              "w-full flex items-center gap-4 px-4 py-3 rounded group-hover:px-6 transition-all cursor-pointer text-left outline-none",
              currentModule === 'receptionist' ? "bg-gold/10 text-gold border border-gold/20" : "text-muted hover:bg-white/5 hover:text-paper"
            )}
          >
            <Phone className="w-5 h-5 flex-shrink-0" />
            <span className="hidden lg:inline text-sm font-medium">Zenna Reception CRM</span>
          </button>

          {currentModule === 'receptionist' && (
            <>
              <button 
                type="button"
                onClick={() => setShowAddLeadModal(true)} 
                className="w-full flex items-center gap-4 px-4 py-3 rounded text-muted hover:bg-white/5 hover:text-paper group-hover:px-6 transition-all cursor-pointer text-left outline-none"
              >
                <Plus className="w-5 h-5 flex-shrink-0" />
                <span className="hidden lg:inline text-sm font-medium">Add Client File</span>
              </button>
            </>
          )}
        </nav>

        <div className="px-6 pt-8 border-t border-white/5">
          <div className="hidden lg:block mb-4">
            <p className="text-[10px] uppercase tracking-widest text-muted">Active Business</p>
            <p className="text-sm font-medium mt-1">{businessName || "Zenna App Studio"}</p>
          </div>
          <button className="flex items-center gap-4 px-4 py-3 rounded text-red-500 hover:bg-red-500/5 lg:w-full">
            <LogOut className="w-5 h-5" />
            <span className="hidden lg:inline text-sm font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="px-10 py-6 border-b border-white/5 flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold">
            {currentModule === 'hammerCode' ? "Hammer & Code — Tradie Growth" : "Zenna AI Receptionist CRM"}
          </h2>
          <div className="flex items-center gap-6">
            <div className={cn(
              "flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest",
              currentModule === 'hammerCode' ? "text-orange-400" : "text-green-500"
            )}>
              <span className={cn("w-2 h-2 rounded-full animate-pulse", currentModule === 'hammerCode' ? "bg-orange-500" : "bg-green-500")} />
              {currentModule === 'hammerCode' ? "Melb Metro Campaign Node Active" : "Zenna Voice Engine Live"}
            </div>
            <p className="text-muted text-[10px] uppercase tracking-widest font-mono">Tuesday · 16 June 2026</p>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-10 overflow-y-auto">
          {currentModule === 'hammerCode' ? (
            <HammerCodeHub businessName={businessName} />
          ) : (
            <div className="space-y-10 animate-fade-in">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-1">
            {[
              { label: 'Confirmed Pipeline', value: `$${stats.confirmedValue.toLocaleString()}`, color: 'text-gold', icon: Zap },
              { label: 'Total CRM Clients', value: stats.newLeads, color: 'text-paper', icon: User },
              { label: 'Calls Handled', value: stats.callsCaught, color: 'text-green-500', icon: ShieldCheck },
              { label: 'System Action', value: 'Mike T. Reply', color: 'text-paper', icon: Sparkles },
            ].map((s, i) => (
              <div key={i} className="bg-surface/30 p-8 border border-white/5 flex flex-col gap-4 group hover:border-gold/30 transition-all">
                <s.icon className={cn("w-5 h-5", s.color)} />
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-muted mb-2">{s.label}</p>
                  <p className={cn("font-serif text-4xl mb-2", s.color)}>{s.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
            {/* Left pipeline & simulator */}
            <div className="xl:col-span-2 space-y-10">
              
              {/* BRAND NEW: ZenVoice Live Call Simulator & Real-Time Lookups */}
              <div className="bg-[#131315] border border-white/5 p-10 rounded-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 flex items-center gap-2">
                  <span className="flex h-3 w-3 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold/50 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-gold"></span>
                  </span>
                  <p className="text-[9px] uppercase tracking-widest font-mono text-gold">Lookup Node On Duty</p>
                </div>

                <div className="max-w-xl">
                  <span className="text-[10px] text-light uppercase font-bold tracking-widest text-gold block mb-2">Simulate Real-Time Caller lookup</span>
                  <h3 className="font-serif text-2xl mb-4 text-paper">Test ZenVoice Live Reception</h3>
                  <p className="text-xs text-muted leading-relaxed mb-6">
                    Enter any phone number to trigger an incoming call simulation. Zenna runs an instant CRM reverse lookup based on the phone number, retrieves the client's custom record, and delivers a highly personalized spoken live response.
                  </p>
                </div>

                {/* Quick Select Buttons */}
                <div className="mb-6">
                  <p className="text-[9px] uppercase tracking-widest text-muted mb-3 font-semibold">Test Presets (CRM Database Files):</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <button 
                      onClick={() => { setPhoneToSimulate('+61 412 891 044'); startCallSimulation('+61 412 891 044'); }}
                      className="text-left bg-white/5 hover:bg-white/10 p-3 rounded border border-white/10 transition-colors group"
                    >
                      <p className="text-[10px] font-bold text-paper group-hover:text-gold transition-colors">Mike Torrence</p>
                      <p className="text-[9px] text-muted font-mono mt-0.5">+61 412 891 044</p>
                      <p className="text-[8px] text-gold uppercase mt-1">Existing Client (Bathroom)</p>
                    </button>
                    <button 
                      onClick={() => { setPhoneToSimulate('+61 423 044 112'); startCallSimulation('+61 423 044 112'); }}
                      className="text-left bg-white/5 hover:bg-white/10 p-3 rounded border border-white/10 transition-colors group"
                    >
                      <p className="text-[10px] font-bold text-paper group-hover:text-gold transition-colors">Sandra Wu</p>
                      <p className="text-[9px] text-muted font-mono mt-0.5">+61 423 044 112</p>
                      <p className="text-[8px] text-gold uppercase mt-1">Existing Client (Water Valve)</p>
                    </button>
                    <button 
                      onClick={() => { setPhoneToSimulate('+61 499 555 999'); startCallSimulation('+61 499 555 999'); }}
                      className="text-left bg-white/5 hover:bg-white/10 p-3 rounded border border-white/10 transition-colors group"
                    >
                      <p className="text-[10px] font-bold text-paper group-hover:text-gold transition-colors">Test New Caller</p>
                      <p className="text-[9px] text-muted font-mono mt-0.5">+61 499 555 999</p>
                      <p className="text-[8px] text-muted uppercase mt-1">Unrecognised Number</p>
                    </button>
                  </div>
                </div>

                {/* Input form */}
                <div className="flex flex-col sm:flex-row gap-2 max-w-lg mb-4">
                  <div className="relative flex-1">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                    <input 
                      type="text" 
                      placeholder="Enter raw phone number for lookup..."
                      className="w-full bg-white/5 border border-white/10 focus:border-gold/50 rounded pl-12 pr-4 py-3 text-xs outline-none text-paper font-mono"
                      value={phoneToSimulate}
                      onChange={e => setPhoneToSimulate(e.target.value)}
                    />
                  </div>
                  <button 
                    onClick={() => startCallSimulation(phoneToSimulate)}
                    className="bg-gold hover:bg-gold-lt text-ink px-6 py-3 rounded text-xs tracking-widest uppercase font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <PhoneIncoming className="w-3.5 h-3.5" /> Speak with Zenna Voice
                  </button>
                </div>

                {/* ACTIVE SIMULATION INTERACTIVE SCREEN */}
                <AnimatePresence>
                  {isSimulatingCall && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border border-white/10 bg-[#0c0c0e] rounded p-6 mt-6 space-y-6"
                    >
                      <div className="flex items-center justify-between border-b border-white/5 pb-4">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center",
                            isCallConnecting ? "bg-amber-500/10 text-amber-500 animate-pulse" : "bg-green-500/10 text-green-500"
                          )}>
                            <Mic className={cn("w-4 h-4", !isCallConnecting && "animate-bounce")} />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-paper">Active Voice Call Feed Session</p>
                            <p className="text-[9px] uppercase text-muted font-mono">Caller: {phoneToSimulate}</p>
                          </div>
                        </div>

                        <button 
                          onClick={() => setIsSimulatingCall(false)}
                          className="text-muted hover:text-red-500 p-2 rounded hover:bg-white/5"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {isCallConnecting ? (
                        <div className="py-12 flex flex-col items-center justify-center gap-4">
                          <div className="relative">
                            <div className="w-16 h-16 rounded-full border border-gold/30 animate-ping absolute inset-0" />
                            <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/50 flex items-center justify-center relative">
                              <Volume2 className="w-6 h-6 text-gold animate-pulse" />
                            </div>
                          </div>
                          <p className="text-xs font-serif text-paper">Zenna is running CRM phone record lookup & script synthesis...</p>
                        </div>
                      ) : activeVoiceCall && (
                        <div className="space-y-4">
                          {/* Lookup Metadata Card */}
                          <div className="bg-white/[0.02] border border-white/10 p-4 rounded-md flex flex-wrap gap-4 items-start justify-between">
                            <div className="space-y-1">
                              <span className="text-[8px] uppercase tracking-widest font-mono text-gold block">CRM Match Data File</span>
                              <p className="text-sm font-serif font-bold text-paper flex items-center gap-2">
                                <UserCheck className="w-4 h-4 text-gold flex-shrink-0" />
                                {activeVoiceCall.client.name}
                              </p>
                              <p className="text-[10px] text-muted max-w-sm italic">"{activeVoiceCall.client.notes}"</p>
                            </div>
                            <div className="text-right sm:border-l sm:border-white/10 sm:pl-4 space-y-1">
                              <span className="text-[8px] uppercase tracking-widest font-mono text-muted block">Deal Status / Value</span>
                              <p className="text-xs font-bold text-green-500 font-mono">{activeVoiceCall.client.value}</p>
                              <span className={cn(
                                "inline-block px-1.5 py-0.5 rounded-[2px] text-[8px] uppercase font-bold tracking-wider",
                                activeVoiceCall.client.status === 'New' ? "bg-amber-500/10 text-amber-500" :
                                activeVoiceCall.client.status === 'Won' ? "bg-green-500/10 text-green-500" :
                                "bg-white/5 text-muted"
                              )}>
                                {activeVoiceCall.client.status}
                              </span>
                            </div>
                          </div>

                          {/* Dialogue Script Stream */}
                          <div className="space-y-4 max-h-[220px] overflow-y-auto pr-2 scrollbar-none border border-white/5 bg-black/40 p-4 rounded">
                            {activeVoiceCall.dialog.map((d: any, idx: number) => {
                              if (d.sender === 'system') {
                                return (
                                  <div key={idx} className="text-center py-1">
                                    <span className="text-[8px] uppercase tracking-widest font-mono text-muted bg-white/5 px-3 py-1 rounded">
                                      {d.text}
                                    </span>
                                  </div>
                                );
                              }
                              const isZenna = d.sender === 'zenna';
                              return (
                                <div key={idx} className={cn("flex flex-col gap-1.5", isZenna ? "items-start" : "items-end")}>
                                  <span className="text-[9px] uppercase tracking-widest text-muted">
                                    {isZenna ? '🎙️ Zenna (Voice)' : '🗣️ Caller'}
                                  </span>
                                  <p className={cn(
                                    "text-xs leading-relaxed p-3.5 max-w-[85%] rounded-lg",
                                    isZenna 
                                      ? "bg-gold/10 text-paper border border-gold/10 italic rounded-tl-none font-serif" 
                                      : "bg-white/10 text-paper border border-white/10 rounded-tr-none font-mono"
                                  )}>
                                    "{d.text}"
                                  </p>
                                </div>
                              );
                            })}
                            
                            {isZennaSynthesizing && (
                              <div className="flex flex-col gap-1.5 items-start">
                                <span className="text-[9px] uppercase tracking-widest text-muted bg-gold/5 px-2 py-0.5 animate-pulse">Zenna is listening & replying...</span>
                                <div className="flex items-center gap-1.5 p-3.5 bg-gold/5 rounded-lg border border-gold/10 rounded-tl-none italic text-xs text-muted">
                                  <span className="w-1.5 h-1.5 rounded-full bg-gold animate-bounce" style={{ animationDelay: '0ms' }} />
                                  <span className="w-1.5 h-1.5 rounded-full bg-gold animate-bounce" style={{ animationDelay: '150ms' }} />
                                  <span className="w-1.5 h-1.5 rounded-full bg-gold animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Talk-Back Simulator Console */}
                          <div className="pt-2 border-t border-white/5 flex gap-2">
                            <input 
                              type="text" 
                              placeholder="Simulate caller's reply in voice dialogue..."
                              className="flex-1 bg-white/5 border border-white/10 focus:border-gold/30 rounded pl-4 pr-4 py-3 text-xs outline-none text-paper font-mono"
                              value={callerMessage}
                              onChange={e => setCallerMessage(e.target.value)}
                              onKeyDown={e => e.key === 'Enter' && handleCallerReply()}
                              disabled={isZennaSynthesizing}
                            />
                            <button 
                              onClick={handleCallerReply}
                              disabled={isZennaSynthesizing || !callerMessage.trim()}
                              className="bg-gold disabled:bg-muted text-ink px-5 rounded hover:bg-gold-lt transition-colors text-xs font-bold uppercase tracking-widest flex items-center justify-center"
                            >
                              Speak Reply
                            </button>
                          </div>
                          
                          <div className="flex items-center justify-between text-[9px] text-muted pt-2 uppercase tracking-widest">
                            <p>💡 Type a question/objection to test Zenna's live voice logic</p>
                            <button 
                              onClick={() => setIsSimulatingCall(false)}
                              className="text-red-500 font-bold hover:underline"
                            >
                              Hang Up Call
                            </button>
                          </div>

                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* CRM Lead Directory / Pipeline Panel */}
              <div className="bg-[#111] border border-white/5 p-10 rounded-sm">
                <div className="flex items-center justify-between mb-10">
                  <div className="space-y-1">
                    <h3 className="font-serif text-xl text-paper">Client CRM Directory</h3>
                    <p className="text-[10px] text-muted uppercase tracking-wider">Dynamic source files for caller lookup node</p>
                  </div>
                  <button 
                    onClick={() => setShowAddLeadModal(true)}
                    className="bg-gold/10 border border-gold/20 hover:border-gold text-gold text-[10px] uppercase tracking-widest px-4 py-2 rounded transition-colors flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Client Profile
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/5 text-left">
                        <th className="pb-6 text-[10px] uppercase tracking-widest text-muted font-medium">Caller</th>
                        <th className="pb-6 text-[10px] uppercase tracking-widest text-muted font-medium">Target Project</th>
                        <th className="pb-6 text-[10px] uppercase tracking-widest text-muted font-medium">Status</th>
                        <th className="pb-6 text-[10px] uppercase tracking-widest text-muted font-medium">Value</th>
                        <th className="pb-6 text-[10px] uppercase tracking-widest text-muted font-medium text-right">Added</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {leads.map((lead, i) => (
                        <tr key={i} className="group hover:bg-white/[0.02] transition-colors">
                          <td className="py-6">
                            <p className="text-sm font-medium text-paper">{lead.name}</p>
                            <p className="text-[10px] font-mono text-muted mt-1">{lead.phone}</p>
                          </td>
                          <td className="py-6 max-w-xs pr-6">
                            <p className="text-xs text-paper/80 truncate leading-relaxed">{lead.notes || 'No project description added'}</p>
                          </td>
                          <td className="py-6">
                            <span className={cn(
                              "px-3 py-1 rounded-[2px] text-[10px] uppercase font-semibold tracking-wider",
                              lead.status === 'New' ? "bg-amber-500/10 text-amber-500" : 
                              lead.status === 'Won' ? "bg-green-500/10 text-green-500" :
                              "bg-white/5 text-muted"
                            )}>
                              {lead.status}
                            </span>
                          </td>
                          <td className="py-6 text-sm font-mono text-green-500/80">{lead.value}</td>
                          <td className="py-6 text-[10px] font-mono text-muted text-right">{lead.time || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ──────────────────────────────────────────────────────── */}
              {/* ZENNA UNIFIED CONNECTIONS, ADD-ONS & PLUGINS CONTROL CENTER */}
              {/* ──────────────────────────────────────────────────────── */}
              <div className="bg-[#111] border border-white/5 p-10 rounded-sm space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/5 pb-6 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-[4px] bg-gold/10 border border-gold/30 text-gold text-[9px] uppercase font-bold tracking-widest animate-pulse">
                        Zenna Unified Add-ons
                      </span>
                      {driveToken ? (
                        <span className="flex items-center gap-1.5 text-green-500 text-[9px] uppercase font-bold tracking-wider">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                          Vault & Calendar Active
                        </span>
                      ) : (
                        <span className="text-muted text-[9px] uppercase font-bold tracking-wider">
                          Hub Offline
                        </span>
                      )}
                    </div>
                    <h3 className="font-serif text-xl text-paper">Unified Connections & Plugins Hub</h3>
                    <p className="text-[10px] text-muted uppercase tracking-wider">
                      Coordinate your Google Drive, Google Calendar, Twilio Responder, and Stripe checkout engines from one central station
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    {driveToken && googleUser && (
                      <div className="flex items-center gap-2 bg-white/[0.02] border border-white/10 px-3 py-1.5 rounded">
                        <img 
                          src={googleUser.photoURL || 'https://www.gravatar.com/avatar/?d=mp'} 
                          alt="avatar" 
                          className="w-4 h-4 rounded-full"
                          referrerPolicy="no-referrer"
                        />
                        <span className="text-xs text-paper/80 font-mono font-bold truncate max-w-[120px]">
                          {googleUser.displayName || 'Dave'}
                        </span>
                      </div>
                    )}
                    
                    {driveToken ? (
                      <button
                        onClick={handleGoogleLogout}
                        className="bg-white/5 border border-white/10 hover:bg-white/10 text-muted hover:text-paper text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded transition-all"
                      >
                        Disconnect Account
                      </button>
                    ) : (
                      <button
                        onClick={handleGoogleLogin}
                        disabled={isGoogleLoading}
                        className="bg-gold hover:bg-gold-lt text-ink text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded transition-all"
                      >
                        {isGoogleLoading ? 'Connecting...' : 'Connect Google'}
                      </button>
                    )}
                  </div>
                </div>

                {/* Tab selector bar */}
                <div className="flex overflow-x-auto border-b border-white/5 gap-1 pb-px scrollbar-none">
                  <button
                    onClick={() => setSelectedConnectorTab('vault')}
                    className={cn(
                      "px-5 py-3 text-xs uppercase tracking-wider font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap focus:outline-none",
                      selectedConnectorTab === 'vault' 
                        ? "border-blue-500 text-blue-400 bg-blue-500/5" 
                        : "border-transparent text-muted hover:text-paper"
                    )}
                  >
                    <Cloud className="w-3.5 h-3.5" />
                    Google Drive Vault
                  </button>
                  <button
                    onClick={() => setSelectedConnectorTab('calendar')}
                    className={cn(
                      "px-5 py-3 text-xs uppercase tracking-wider font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap focus:outline-none",
                      selectedConnectorTab === 'calendar' 
                        ? "border-amber-500 text-amber-400 bg-amber-500/5" 
                        : "border-transparent text-muted hover:text-paper"
                    )}
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    Google Calendar Sync
                  </button>
                  <button
                    onClick={() => setSelectedConnectorTab('twilio')}
                    className={cn(
                      "px-5 py-3 text-xs uppercase tracking-wider font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap focus:outline-none",
                      selectedConnectorTab === 'twilio' 
                        ? "border-purple-500 text-purple-400 bg-purple-500/5" 
                        : "border-transparent text-muted hover:text-paper"
                    )}
                  >
                    <Phone className="w-3.5 h-3.5" />
                    Twilio Responder Node
                  </button>
                  <button
                    onClick={() => setSelectedConnectorTab('stripe')}
                    className={cn(
                      "px-5 py-3 text-xs uppercase tracking-wider font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap focus:outline-none",
                      selectedConnectorTab === 'stripe' 
                        ? "border-emerald-500 text-emerald-400 bg-emerald-500/5" 
                        : "border-transparent text-muted hover:text-paper"
                    )}
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    Stripe Trade Invoicing
                  </button>
                </div>

                {/* Tab content screens */}
                <div className="pt-2">
                  {selectedConnectorTab === 'vault' && (
                    !driveToken ? (
                      <div className="border border-white/5 bg-white/[0.01] p-10 text-center rounded-sm space-y-6">
                        <div className="w-14 h-14 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto text-blue-400">
                          <Cloud className="w-7 h-7" />
                        </div>
                        <div className="max-w-md mx-auto space-y-2">
                          <h4 className="text-base font-semibold text-paper">Google Drive Not Connected</h4>
                          <p className="text-xs text-muted leading-relaxed">
                            Connect your Google account above to sync invoices, quotes, and caller logs in real-time.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
                        {/* Drag and Drop Uploader Column */}
                        <div className="lg:col-span-4 h-full">
                          <div 
                            onDragOver={(e) => {
                              e.preventDefault();
                              e.currentTarget.classList.add('border-blue-400', 'bg-blue-500/[0.01]');
                            }}
                            onDragLeave={(e) => {
                              e.preventDefault();
                              e.currentTarget.classList.remove('border-blue-400', 'bg-blue-500/[0.01]');
                            }}
                            onDrop={(e) => {
                              e.preventDefault();
                              e.currentTarget.classList.remove('border-blue-400', 'bg-blue-500/[0.01]');
                              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                                uploadFileToDrive(e.dataTransfer.files[0]);
                              }
                            }}
                            onClick={() => document.getElementById('drive-manual-file')?.click()}
                            className="border-2 border-dashed border-white/10 hover:border-blue-500/50 bg-white/[0.01] hover:bg-blue-500/[0.02] p-8 h-full rounded-sm text-center flex flex-col justify-center items-center gap-4 cursor-pointer transition-all duration-300 group min-h-[200px]"
                          >
                            <input 
                              type="file" 
                              id="drive-manual-file" 
                              className="hidden" 
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  uploadFileToDrive(e.target.files[0]);
                                }
                              }}
                            />
                            <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                              {isUploadingToDrive ? (
                                <RefreshCw className="w-5 h-5 animate-spin text-blue-400" />
                              ) : (
                                <Upload className="w-5 h-5" />
                              )}
                            </div>
                            <div className="space-y-1">
                              <h4 className="text-xs font-semibold text-paper tracking-wider uppercase">
                                {isUploadingToDrive ? 'Uploading Asset...' : 'Drag & Drop Asset'}
                              </h4>
                              <p className="text-[10px] text-muted max-w-[200px] leading-relaxed mx-auto">
                                Drag software scope briefs, system architecture diagrams, or audio requirements logs here or click to browse.
                              </p>
                            </div>
                            <span className="text-[9px] bg-white/5 border border-white/10 px-2.5 py-1 rounded font-mono text-muted uppercase text-center">
                              Zenna Vault Storage
                            </span>
                          </div>
                        </div>

                        {/* Files List Column */}
                        <div className="lg:col-span-8 flex flex-col gap-4">
                          {/* Search Bar & Refresh Trigger */}
                          <div className="flex gap-3">
                            <div className="flex-1 bg-white/[0.02] border border-white/10 rounded flex items-center px-3 gap-2.5 focus-within:border-blue-500/50 transition-colors">
                              <Search className="w-4 h-4 text-muted" />
                              <input 
                                type="text" 
                                placeholder="Search Zenna Vault files..." 
                                value={driveSearch}
                                onChange={(e) => {
                                  setDriveSearch(e.target.value);
                                  fetchDriveFiles(driveToken, e.target.value);
                                }}
                                className="flex-1 bg-transparent border-none outline-none py-2 text-xs text-paper placeholder-muted"
                              />
                            </div>
                            <button 
                              onClick={() => fetchDriveFiles(driveToken, driveSearch)}
                              disabled={isFetchingDrive}
                              className="bg-white/5 hover:bg-white/10 border border-white/10 p-2.5 rounded text-muted hover:text-paper transition-all flex items-center justify-center disabled:opacity-50"
                            >
                              <RefreshCw className={cn("w-4 h-4", isFetchingDrive && "animate-spin")} />
                            </button>
                          </div>

                          {/* Scrollable File List */}
                          <div className="border border-white/5 bg-black/40 rounded overflow-hidden max-h-[300px] overflow-y-auto scrollbar-none">
                            {isFetchingDrive && driveFiles.length === 0 ? (
                              <div className="p-12 text-center text-xs text-muted font-sans flex flex-col items-center gap-3">
                                <RefreshCw className="w-5 h-5 animate-spin text-blue-400" />
                                Retrieving Cloud Directory Node...
                              </div>
                            ) : driveFiles.length === 0 ? (
                              <div className="p-12 text-center text-xs text-muted font-mono">
                                No files registered. Create instant quotes or drop manual reports file to register under cloud folder.
                              </div>
                            ) : (
                              <div className="divide-y divide-white/5">
                                {driveFiles.map((f) => (
                                  <div key={f.id} className="flex items-center justify-between p-4 bg-white/[0.01] hover:bg-white/[0.02] transition-colors gap-4">
                                    <div className="flex items-center gap-3 truncate">
                                      <div className="w-8 h-8 rounded bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0">
                                        <Folder className="w-4 h-4" />
                                      </div>
                                      <div className="truncate space-y-0.5">
                                        <p className="text-xs text-paper font-sans font-medium truncate block max-w-[280px] sm:max-w-[340px]">
                                          {f.name}
                                        </p>
                                        <p className="text-[9px] text-muted font-mono uppercase">
                                          {f.mimeType === 'text/html' ? 'Formal Trade HTML Quote' : f.mimeType === 'text/plain' ? 'Dispatch task list text' : 'External site Asset'} · {new Date(f.createdTime).toLocaleDateString()}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-1.5 flex-shrink-0">
                                      {f.webViewLink && (
                                        <a 
                                          href={f.webViewLink} 
                                          target="_blank" 
                                          rel="noopener noreferrer"
                                          className="p-1.5 bg-white/5 border border-white/5 rounded text-muted hover:text-paper hover:bg-white/10 transition-colors flex items-center"
                                          title="Open original file in Google Drive"
                                        >
                                          <ExternalLink className="w-3.5 h-3.5" />
                                        </a>
                                      )}
                                      <button
                                        onClick={() => deleteDriveFile(f.id, f.name)}
                                        className="p-1.5 bg-red-500/10 border border-red-500/20 rounded text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-colors flex items-center"
                                        title="Trash file"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  )}

                  {selectedConnectorTab === 'calendar' && (
                    !driveToken ? (
                      <div className="border border-white/5 bg-white/[0.01] p-10 text-center rounded-sm space-y-6">
                        <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto text-amber-400">
                          <Calendar className="w-7 h-7" />
                        </div>
                        <div className="max-w-md mx-auto space-y-2">
                          <h4 className="text-base font-semibold text-paper">Google Calendar Not Syncing</h4>
                          <p className="text-xs text-muted leading-relaxed">
                            Connect your Google account above to auto-schedule and sync Zenna trade bookings directly to your device calendar.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 animate-fade-in">
                        {/* Google Calendar status configuration */}
                        <div className="md:col-span-4 bg-white/[0.02] border border-white/5 p-6 rounded space-y-4">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="p-1.5 rounded bg-amber-500/10 text-amber-400">
                              <ShieldCheck className="w-4 h-4" />
                            </span>
                            <h4 className="text-xs uppercase font-bold text-paper tracking-wider">Sync Control Center</h4>
                          </div>

                          <div className="space-y-3.5 text-xs text-paper/80">
                            <div>
                              <span className="text-[10px] text-muted block uppercase tracking-wider font-mono">Linked Calendar</span>
                              <span className="font-mono text-xs font-bold text-amber-400">primary (Dave's Calendar)</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-muted block uppercase tracking-wider font-mono">Authentication Status</span>
                              <span className="text-emerald-400 font-bold">Authorized (Calendar/Drive Scopes)</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-muted block uppercase tracking-wider font-mono">Sync Interval</span>
                              <span className="text-paper">Instant / Zero Latency Trigger</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-muted block uppercase tracking-wider font-mono">Appoint Hours Duration</span>
                              <span className="text-paper">2 Hours (Auto Plumb Buffer)</span>
                            </div>
                          </div>

                          <div className="pt-4 border-t border-white/5 space-y-3">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-muted">Auto Remind Dispatch</span>
                              <span className="text-green-500 uppercase font-mono font-bold text-[10px]">Active</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-muted">Map Routing Grounding</span>
                              <span className="text-green-500 uppercase font-mono font-bold text-[10px]">Active</span>
                            </div>
                          </div>
                        </div>

                        {/* Upcoming Events Column */}
                        <div className="md:col-span-8 flex flex-col gap-4">
                          <div className="flex justify-between items-center">
                            <h4 className="text-xs uppercase tracking-widest text-muted font-bold">Dave's Upcoming Google Calendar Appointments</h4>
                            <button 
                              onClick={() => fetchCalendarEvents(driveToken)}
                              disabled={isFetchingCalendar}
                              className="p-1.5 text-paper hover:bg-white/5 bg-transparent border border-white/10 rounded transition-all focus:outline-none"
                            >
                              <RefreshCw className={cn("w-3.5 h-3.5", isFetchingCalendar ? "animate-spin" : "")} />
                            </button>
                          </div>

                          <div className="border border-white/5 bg-black/20 p-4 rounded min-h-[180px] max-h-[220px] overflow-y-auto scrollbar-thin space-y-2">
                            {isFetchingCalendar ? (
                              <div className="flex flex-col items-center justify-center h-28 space-y-2 text-muted">
                                <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                                <span className="text-[9px] tracking-widest uppercase">Fetching Google Calendar events...</span>
                              </div>
                            ) : calendarEvents.length > 0 ? (
                              calendarEvents.map((ev: any) => (
                                <div key={ev.id} className="bg-[#18181b] border border-white/5 p-3 rounded flex items-start gap-3.5 hover:border-amber-500/20 transition-all">
                                  <div className="px-2 py-2 rounded bg-amber-500/10 text-amber-400 flex flex-col items-center justify-center font-mono text-[9px] font-bold uppercase min-w-[50px]">
                                    <span>{ev.start?.dateTime ? new Date(ev.start.dateTime).toLocaleDateString([], { month: 'short' }) : 'MON'}</span>
                                    <span className="text-sm font-bold text-paper">{ev.start?.dateTime ? new Date(ev.start.dateTime).getDate() : '21'}</span>
                                  </div>
                                  <div className="space-y-1 flex-1 min-w-0">
                                    <p className="text-xs font-semibold text-paper/95 truncate">{ev.summary}</p>
                                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-muted">
                                      <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3 text-amber-500" />
                                        {ev.start?.dateTime ? new Date(ev.start.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '9:00 AM'}
                                      </span>
                                      {ev.location && (
                                        <span className="truncate max-w-[180px]">📍 {ev.location}</span>
                                      )}
                                    </div>
                                  </div>
                                  <span className="px-1.5 py-0.5 rounded text-[8px] bg-green-500/10 text-green-400 uppercase tracking-widest font-bold font-mono">
                                    Synced
                                  </span>
                                </div>
                              ))
                            ) : (
                              // Live Fallbacks/Preloaded list for demonstration
                              <div className="space-y-2.5">
                                <div className="bg-[#18181b] border border-white/5 p-3 rounded flex items-start gap-3.5">
                                  <div className="px-2 py-2 rounded bg-amber-500/10 text-amber-400 flex flex-col items-center justify-center font-mono text-[9px] font-bold uppercase min-w-[50px]">
                                    <span>TOMORROW</span>
                                    <span className="text-sm font-bold text-paper">9:00</span>
                                  </div>
                                  <div className="space-y-0.5 flex-1">
                                    <p className="text-xs font-semibold text-paper/90 font-sans">💻 Zenna App Studio — Scoping Session (Dave's Demo)</p>
                                    <p className="text-[10px] text-muted leading-relaxed">Awaiting scheduling dispatch tags from dispatch panels. Ready for sync.</p>
                                  </div>
                                  <span className="px-1.5 py-0.5 rounded text-[8px] bg-amber-500/10 text-amber-400 font-mono uppercase font-bold">
                                    Demo Mode
                                  </span>
                                </div>
                                <div className="p-3 text-center text-[10px] text-muted italic">
                                  Select a lead in the App Scoping Workshop below and click 'Schedule Calendar' to post authentic bookings.
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  )}

                  {selectedConnectorTab === 'twilio' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
                      {/* Connection Map & Config */}
                      <div className="bg-white/[0.02] border border-white/5 p-6 rounded space-y-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse" />
                            <h4 className="text-xs uppercase font-bold text-paper tracking-wider">Missed-Call Webhook Relay</h4>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer select-none">
                            <input 
                              type="checkbox" 
                              checked={twilioEnabled} 
                              onChange={() => setTwilioEnabled(!twilioEnabled)} 
                              className="sr-only peer" 
                            />
                            <div className="w-8 h-4 bg-white/10 rounded-full peer peer-checked:after:translate-x-[16px] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-paper after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-purple-500"></div>
                            <span className="ml-2 text-[10px] text-muted font-bold uppercase">{twilioEnabled ? 'Active' : 'Standby'}</span>
                          </label>
                        </div>

                        <div className="space-y-3">
                          <div className="space-y-1">
                            <span className="text-[9px] text-muted uppercase tracking-wider font-mono">Live Webhook Forwarding EndPoint URL</span>
                            <div className="flex gap-2">
                              <input 
                                type="text"
                                readOnly
                                value={`https://${window.location.host}/webhook/missed-call`}
                                className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-[10px] text-purple-300 font-mono focus:outline-none"
                              />
                              <button 
                                onClick={() => {
                                  navigator.clipboard.writeText(`https://${window.location.host}/webhook/missed-call`);
                                  alert('Webhook URL copied!');
                                }}
                                className="bg-white/5 border border-white/10 px-3 py-2 rounded text-paper hover:bg-white/10 transition-all text-xs focus:outline-none font-bold"
                              >
                                Copy
                              </button>
                            </div>
                          </div>

                          <div className="pt-3 border-t border-white/5 space-y-3 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="text-muted">Auto-Ingest into CRM Lead List</span>
                              <input 
                                type="checkbox" 
                                checked={autoDraftCRM} 
                                onChange={() => setAutoDraftCRM(!autoDraftCRM)} 
                                className="accent-purple-500"
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-muted">Extract Emergency Plumbing Issues</span>
                              <span className="text-green-500 font-mono font-bold text-[9px] uppercase">Always Active</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-muted">Twilio Sender Shortcode</span>
                              <span className="text-paper font-mono font-bold">+61 488 884 102</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* SMS Template editor */}
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <span className="text-[10px] text-muted uppercase tracking-widest font-bold">Custom SMS Missed-Call Answer Template</span>
                          <p className="text-[9px] text-muted text-left">Zenna will dispatch this response instantly when Dave misses a ring.</p>
                        </div>

                        <textarea 
                          rows={4}
                          value={missedCallTemplate}
                          onChange={(e) => setMissedCallTemplate(e.target.value)}
                          className="w-full bg-black/40 border border-white/10 rounded p-4 text-xs text-paper/90 outline-none focus:border-purple-500/50 leading-relaxed font-mono resize-none focus:outline-none"
                        />

                        <div className="flex justify-between items-center">
                          <span className="text-[9px] text-muted font-mono uppercase">{missedCallTemplate.length} characters</span>
                          <button
                            onClick={async () => {
                              setIsSavingTwilioConfig(true);
                              await new Promise(r => setTimeout(r, 600));
                              setChatMessages(prev => [...prev, {
                                role: 'zenna',
                                text: `Success, Dave! Your Twilio SMS auto-responder template has been updated and loaded live. 🤙`,
                                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                              }]);
                              setIsSavingTwilioConfig(false);
                            }}
                            disabled={isSavingTwilioConfig}
                            className="bg-purple-500 hover:bg-purple-400 text-paper text-[10px] uppercase font-bold tracking-widest px-4 py-2 rounded transition-all focus:outline-none"
                          >
                            {isSavingTwilioConfig ? 'Saving...' : 'Save Template'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedConnectorTab === 'stripe' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 animate-fade-in">
                        {/* Settings & Params */}
                        <div className="md:col-span-5 bg-white/[0.02] border border-white/5 p-6 rounded space-y-4">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="p-1.5 rounded bg-emerald-500/10 text-emerald-400">
                              <ShieldCheck className="w-4 h-4" />
                            </span>
                            <h4 className="text-xs uppercase font-bold text-paper tracking-wider">Payments Engine Parameters</h4>
                          </div>

                          <div className="space-y-4 text-xs">
                            <div className="space-y-1.5">
                              <div className="flex justify-between">
                                <span className="text-muted">Standard Client Hourly Callout Rate</span>
                                <span className="text-emerald-400 font-mono font-bold">${hourlyRate}/Hr</span>
                              </div>
                              <input 
                                type="range" 
                                min={120} 
                                max={300} 
                                step={10}
                                value={hourlyRate}
                                onChange={(e) => setHourlyRate(parseInt(e.target.value))}
                                className="w-full accent-emerald-500 bg-white/5 h-1 rounded"
                              />
                            </div>

                            <div className="space-y-1.5">
                              <div className="flex justify-between">
                                <span className="text-muted">Emergency Booking Deposit Fee</span>
                                <span className="text-emerald-400 font-mono font-bold">{depositPercent}%</span>
                              </div>
                              <input 
                                type="range" 
                                min={5} 
                                max={30} 
                                step={5}
                                value={depositPercent}
                                onChange={(e) => setDepositPercent(parseInt(e.target.value))}
                                className="w-full accent-emerald-500 bg-white/5 h-1 rounded pointer-events-auto cursor-pointer"
                              />
                            </div>

                            <div className="pt-2 border-t border-white/5 space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-muted">Auto Apply Australian GST (10%)</span>
                                <span className="text-emerald-400 font-mono font-bold uppercase text-[9px] bg-emerald-400/10 px-2 py-0.5 rounded">Enabled</span>
                              </div>
                              <div className="flex items-center justify-between font-bold">
                                <span className="text-muted">Stripe Webhooks Config</span>
                                <span className="text-green-500 uppercase font-mono font-bold text-[9px]">Live Connected</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Invoice Generator */}
                        <div className="md:col-span-7 space-y-4">
                          <div className="space-y-1">
                            <h4 className="text-xs uppercase tracking-widest text-muted font-bold text-left">Interactive Stripe Invoice Creator</h4>
                            <p className="text-[10px] text-muted text-left">Generate instant itemized SMS-pay invoices or deposit checkout portals for any client file.</p>
                          </div>

                          <div className="bg-black/30 border border-white/10 p-5 rounded space-y-4">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                              <div className="text-left">
                                <span className="text-[9px] text-muted block uppercase tracking-wider font-mono">Select Business Lead</span>
                                <span className="text-xs text-paper font-semibold">{leads[selectedTradeLeadIndex]?.name || 'No Client'} (plumbing file)</span>
                              </div>
                              <button
                                onClick={async () => {
                                  setIsGeneratingStripeUrl(true);
                                  await new Promise(r => setTimeout(r, 800));
                                  setGeneratedInvoiceLeadIndex(selectedTradeLeadIndex);
                                  
                                  const baseCleanPrice = leads[selectedTradeLeadIndex].value.replace(/[^0-9]/g, '');
                                  const numericPrice = parseFloat(baseCleanPrice) || 1200;
                                  
                                  const depositVal = (numericPrice * (depositPercent / 100)).toFixed(2);
                                  
                                  setInvoiceItems([
                                    { description: `Zenna App Studio Developer Scoping Rate (${hourlyRate}/Hr)`, price: hourlyRate.toFixed(2) },
                                    { description: `Initial custom App MVP/SaaS development deposit (${depositPercent}%)`, price: depositVal },
                                    { description: `Workspace staging deployment and Cloud sandbox setup fee`, price: "45.00" }
                                  ]);
                                  setIsGeneratingStripeUrl(false);
                                  
                                  setChatMessages(prev => [...prev, {
                                    role: 'zenna',
                                    text: `Stripe Developer Invoice prepared for ${leads[selectedTradeLeadIndex].name}! Click 'Launch Checkout Simulation' below to process the test payment. 🤙`,
                                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                  }]);
                                }}
                                disabled={isGeneratingStripeUrl}
                                className="bg-emerald-500 hover:bg-emerald-400 text-paper text-[10px] uppercase font-bold tracking-widest px-4 py-2.5 rounded transition-all flex items-center gap-1.5 focus:outline-none disabled:opacity-50"
                              >
                                <Zap className="w-3 h-3 text-white fill-white" />
                                {isGeneratingStripeUrl ? 'Preparing Checkout...' : 'Generate Invoice Link'}
                              </button>
                            </div>

                            {generatedInvoiceLeadIndex !== null && (
                              <div className="pt-4 border-t border-white/15 space-y-3 animate-fade-in text-left">
                                <span className="text-[9.5px] uppercase tracking-widest text-emerald-400 font-bold block">Drafted Itemized Invoice Overview</span>
                                
                                <div className="space-y-2 font-mono text-[10.5px]">
                                  {invoiceItems.map((item, idx) => (
                                    <div key={idx} className="flex justify-between text-muted border-b border-white/[0.02] pb-1.5">
                                      <span>{item.description}</span>
                                      <span className="text-paper font-bold">${item.price}</span>
                                    </div>
                                  ))}
                                  
                                  {/* Total calculation with GST */}
                                  {(() => {
                                    const subtotal = invoiceItems.reduce((acc, v) => acc + parseFloat(v.price), 0);
                                    const gst = subtotal * 0.1;
                                    const finalTotal = subtotal + gst;
                                    return (
                                      <div className="pt-2 text-xs space-y-1">
                                        <div className="flex justify-between text-muted">
                                          <span>Tax Subtotal</span>
                                          <span>${subtotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-muted">
                                          <span>GST 10.0%</span>
                                          <span>${gst.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-emerald-400 font-bold text-sm pt-1 border-t border-white/10">
                                          <span>INVOICE TOTAL DUE ({stripeInvoicePaid[generatedInvoiceLeadIndex] ? 'PAID' : 'PENDING'})</span>
                                          <span>${finalTotal.toFixed(2)}</span>
                                        </div>
                                      </div>
                                    );
                                  })()}
                                </div>

                                <div className="flex justify-end pt-3">
                                  {stripeInvoicePaid[generatedInvoiceLeadIndex] ? (
                                    <span className="bg-green-500/10 border border-green-500/20 text-green-400 text-[10.5px] uppercase font-bold tracking-widest px-4 py-2 rounded flex items-center gap-1.5">
                                      <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                                      Paid & Synced on Drive Receipt
                                    </span>
                                  ) : (
                                    <button
                                      onClick={() => {
                                        const confirmed = window.confirm(`Dave, this initiates a secure simulated invoice checkout for ${leads[generatedInvoiceLeadIndex].name}. Zenna will register this payment as active once confirmed.`);
                                        if (confirmed) {
                                          setStripeInvoicePaid(prev => ({ ...prev, [generatedInvoiceLeadIndex]: true }));
                                          setChatMessages(prev => [...prev, {
                                            role: 'zenna',
                                            text: `Success, Dave! Stripe payment of ${(invoiceItems.reduce((acc, v) => acc + parseFloat(v.price), 0) * 1.1).toFixed(2)} has been securely verified. 🤙 I have auto-saved an HTML tax invoice copy onto your Google Drive Zenna Vault as proof of payment.`,
                                            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                          }]);
                                          
                                          if (driveToken) {
                                            const metadata = {
                                              name: `Zenna App Studio - Receipt - Invoice #${202400 + generatedInvoiceLeadIndex} - Paid.txt`,
                                              mimeType: 'text/plain'
                                            };
                                            const textContent = `
ZENNA APP STUDIO — PAID STRIPE RECEIPT
==========================================
Receipt ID: ST_${Math.floor(Math.random() * 88888 + 11111)}
Date: ${new Date().toLocaleDateString('en-AU')}
Client Name: ${leads[generatedInvoiceLeadIndex].name}
Status: PAID via Stripe Checkout

ITEMIZED TRANSACTION LOG
------------------------
${invoiceItems.map(item => `* ${item.description}: ${item.price}`).join('\n')}

Subtotal: ${invoiceItems.reduce((acc, v) => acc + parseFloat(v.price), 0).toFixed(2)}
GST 10%: ${(invoiceItems.reduce((acc, v) => acc + parseFloat(v.price), 0) * 0.1).toFixed(2)}
TOTAL AMOUNT PAID: ${(invoiceItems.reduce((acc, v) => acc + parseFloat(v.price), 0) * 1.1).toFixed(2)}

==========================================
Paid instantly via Zenna Integrated billing plugin.
                                            `;
                                            const form = new FormData();
                                            form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
                                            form.append('file', new Blob([textContent], { type: 'text/plain' }));
                                            fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
                                              method: 'POST',
                                              headers: { Authorization: `Bearer ${driveToken}` },
                                              body: form
                                            }).then(() => fetchDriveFiles(driveToken));
                                          }
                                        }
                                      }}
                                      className="bg-emerald-500 hover:bg-emerald-400 text-[#0c0c0d] font-bold text-[10.5px] uppercase tracking-widest px-4 py-2 rounded transition-all animate-pulse focus:outline-none"
                                    >
                                      Launch Checkout Simulation
                                    </button>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* ──────────────────────────────────────────────────────── */}
              {/* BRAND NEW: ZENNA ELITE AUTO-TRADE WORKSHOP */}
              {/* ──────────────────────────────────────────────────────── */}
              <div id="trade-workshop" className="bg-[#111] border border-white/5 p-10 rounded-sm space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/5 pb-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-[4px] bg-gold text-ink text-[9px] uppercase font-bold tracking-widest">Aussie Gold Pipeline</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
                    </div>
                    <h3 className="font-serif text-xl text-paper">Zenna Auto-Trade Workshop</h3>
                    <p className="text-[10px] text-muted uppercase tracking-wider">Instant Smart Quotes & Dispatch Optimization Routing</p>
                  </div>
                  
                  {/* Quick Dropdown Selector */}
                  <div className="mt-4 md:mt-0 flex items-center gap-3 bg-white/[0.03] p-1.5 rounded border border-white/5">
                    <span className="text-[10px] uppercase text-muted font-bold pl-2">Owner Focus:</span>
                    <select
                      value={selectedTradeLeadIndex}
                      onChange={(e) => {
                        const index = parseInt(e.target.value);
                        setSelectedTradeLeadIndex(index);
                        setDraftedQuote(null);
                        setCalculatedDispatch(null);
                        setQuoteSentStatus(false);
                      }}
                      className="bg-ink text-paper text-xs rounded border border-white/10 px-3 py-1.5 outline-none focus:border-gold/50 cursor-pointer text-ellipsis max-w-[200px]"
                    >
                      {leads.map((lead, i) => (
                        <option key={i} value={i} className="bg-ink text-paper">
                          {lead.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {leads[selectedTradeLeadIndex] ? (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                    
                    {/* Focal Client Metadata Summary */}
                    <div className="md:col-span-4 bg-white/[0.01] border border-white/5 p-6 rounded-md space-y-6">
                      <div className="space-y-1">
                        <span className="text-[9px] uppercase tracking-widest text-gold font-bold">Focal Lead Directory Record</span>
                        <p className="text-base font-serif font-bold text-paper">{leads[selectedTradeLeadIndex].name}</p>
                        <p className="text-[10px] text-muted font-mono">{leads[selectedTradeLeadIndex].phone}</p>
                      </div>

                      <div className="space-y-2 border-t border-b border-white/5 py-4">
                        <span className="text-[9px] uppercase tracking-widest text-muted font-bold block">Voice Log Intake Transcript</span>
                        <p className="text-xs text-paper/80 leading-relaxed italic bg-black/30 p-3 rounded rounded-tl-none border-l-2 border-gold/40">
                          "{leads[selectedTradeLeadIndex].notes || 'No project description captured.'}"
                        </p>
                      </div>

                      <div className="space-y-2">
                        <span className="text-[9px] uppercase tracking-widest text-muted font-bold block">Assigned Deal Parameters</span>
                        <div className="flex justify-between items-center bg-white/[0.02] p-2 rounded">
                          <span className="text-[10px] text-muted">Est. Project Value</span>
                          <span className="text-xs font-mono font-bold text-green-400">{leads[selectedTradeLeadIndex].value}</span>
                        </div>
                        <div className="flex justify-between items-center bg-white/[0.02] p-2 rounded">
                          <span className="text-[10px] text-muted">Intake Status Code</span>
                          <span className={cn(
                            "px-2 py-0.5 text-[8px] font-bold uppercase rounded",
                            leads[selectedTradeLeadIndex].status === 'New' ? "bg-amber-500/10 text-amber-500" :
                            leads[selectedTradeLeadIndex].status === 'Won' ? "bg-green-500/10 text-green-500" :
                            "bg-white/5 text-muted"
                          )}>
                            {leads[selectedTradeLeadIndex].status}
                          </span>
                        </div>
                      </div>

                      {/* MAGIC 1-CLICK TRADIE DISRUPTOR HOOK */}
                      <div className="pt-4 border-t border-white/5 space-y-3 font-sans">
                        <span className="text-[9px] uppercase text-gold font-bold tracking-widest flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5 text-gold fill-gold animate-pulse" />
                          Zenna Magic 1-Click Hook
                        </span>
                        <p className="text-[10px] text-muted leading-relaxed">
                          With one click, Zenna auto-schedules the job onto your Google Calendar, drafts the full itemized Stripe deposit invoice request, uploads a trade brief to Google Drive, and notifies your client.
                        </p>
                        
                        <button
                          onClick={async () => {
                            const lead = leads[selectedTradeLeadIndex];
                            if (!lead) return;
                            
                            const confirmed = window.confirm(`Ready to completely onboarding "${lead.name}"? This schedules Dave's calendar slot, drafts the Stripe deposit invoice, publishes a folder brief to Drive, and confirms with the client.`);
                            if (!confirmed) return;
                            
                            setChatMessages(prev => [...prev, {
                              role: 'zenna',
                              text: `⚡️ ACTIVATING DAVE'S 1-CLICK DISRUPTOR HOOK FOR ${lead.name.toUpperCase()}...`,
                              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            }]);
                            
                            // Simulate booking times
                            const tomorrow = new Date();
                            tomorrow.setDate(tomorrow.getDate() + 1);
                            tomorrow.setHours(9, 0, 0, 0);
                            const tomorrowEnd = new Date(tomorrow);
                            tomorrowEnd.setHours(tomorrowEnd.getHours() + 2);
                            
                            let calendarStatus = "Not Connected";
                            if (driveToken) {
                              try {
                                const eventData = {
                                  summary: `💻 [Zenna Magic Hook] SaaS Kickoff Session for ${lead.name}`,
                                  location: `Zenna Google Meet (Virtual Link)`,
                                  description: `Zenna Instant App Hook Scoping.\n\nClient Name: ${lead.name}\nClient Phone: ${lead.phone}\nEst Budget: ${lead.value}\nNotes: ${lead.notes}`,
                                  start: { dateTime: tomorrow.toISOString(), timeZone: 'Australia/Melbourne' },
                                  end: { dateTime: tomorrowEnd.toISOString(), timeZone: 'Australia/Melbourne' }
                                };
                                const calRes = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
                                  method: 'POST',
                                  headers: { Authorization: `Bearer ${driveToken}`, 'Content-Type': 'application/json' },
                                  body: JSON.stringify(eventData)
                                });
                                const calData = await calRes.json();
                                if (calData.htmlLink) {
                                  setSyncedCalendarLink(prev => ({ ...prev, [selectedTradeLeadIndex]: calData.htmlLink }));
                                  calendarStatus = "Scheduled & Synced Live";
                                }
                              } catch (e) {
                                console.error('Magic hook calendar error:', e);
                              }
                            }
                            
                            // Auto-set Stripe Invoice variables
                            const baseCleanPrice = lead.value.replace(/[^0-9]/g, '');
                            const numericPrice = parseFloat(baseCleanPrice) || 1200;
                            const depositVal = (numericPrice * (depositPercent / 100)).toFixed(2);
                            setInvoiceItems([
                              { description: `Zenna App Studio Standard Hourly Rate (${hourlyRate}/Hr)`, price: hourlyRate.toFixed(2) },
                              { description: `Initial app MVP/SaaS scoping deposit (${depositPercent}%)`, price: depositVal },
                              { description: `Docker sandbox and staging environment setup fee`, price: "45.00" }
                            ]);
                            setGeneratedInvoiceLeadIndex(selectedTradeLeadIndex);
                            
                            let driveStatus = "Not Connected";
                            if (driveToken) {
                              try {
                                const metadata = {
                                  name: `Zenna App Studio - Magic Onboard - ${lead.name}.txt`,
                                  mimeType: 'text/plain'
                                };
                                const textContent = `
==================================================
ZENNA APP STUDIO — 1-CLICK MAGIC PROJECT BRIEF
==================================================
Date: ${new Date().toLocaleDateString('en-AU')}
Client Name: ${lead.name}
Client Phone: ${lead.phone}
Hosting Region: AWS / GCP Sydney Region Staging
Estimated Project Budget: ${lead.value}

CLIENT REQUIREMENTS BRIEF:
"${lead.notes || 'No notes available.'}"

DEFAULT TECH-STACK INITIALIZER COMPONENTS:
1. Vite + React boilerplate repository
2. Firebase Database Schema & firestore.rules
3. Stripe Checkout Hooks and secure webhooks

Created automatically via Zenna Unified Addons Cloud System. No manual paper-pushing.
                                `;
                                const form = new FormData();
                                form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
                                form.append('file', new Blob([textContent], { type: 'text/plain' }));
                                await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
                                  method: 'POST',
                                  headers: { Authorization: `Bearer ${driveToken}` },
                                  body: form
                                });
                                fetchDriveFiles(driveToken);
                                driveStatus = "Document Saved to Cloud Vault";
                              } catch (e) {
                                console.error('Magic hook drive error:', e);
                              }
                            }
                            
                            setChatMessages(prev => [...prev, {
                              role: 'zenna',
                              text: `💥 ONE-CLICK DISRUPTOR SUCCESS! I've fully onboarded ${lead.name}:\n\n📅 Google Calendar: ${calendarStatus ? 'Scheduled (Tomorrow 9:00 AM)' : 'Simulated success'}\n📁 Google Drive: Project Brief saved in secure Zenna Vault\n💳 Stripe Invoicing: Generated draft with ${depositPercent}% deposit due\n📞 Twilio Responder: Sent dev kickoff alert SMS directly to the client.`,
                              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            }]);
                            
                            if (driveToken) {
                              fetchCalendarEvents(driveToken);
                            }
                          }}
                          className="w-full bg-[#faaf18] hover:bg-gold-lt text-black text-[10.5px] uppercase tracking-widest font-bold py-3 px-4 rounded transition-all flex items-center justify-center gap-1.5 shadow-sm focus:outline-none"
                        >
                          <Zap className="w-3.5 h-3.5 text-black fill-black" />
                          Execute 1-Click Hook
                        </button>
                      </div>
                    </div>

                    {/* Operational Actions Area with Tabs */}
                    <div className="md:col-span-8 space-y-6">
                      {/* Tabs Switcher */}
                      <div className="flex border-b border-white/5 pb-0.5 gap-2">
                        <button
                          onClick={() => setActiveTradeTab('quote')}
                          className={cn(
                            "px-5 py-3 text-xs uppercase tracking-widest font-bold transition-all border-b-2 flex items-center gap-2",
                            activeTradeTab === 'quote' 
                              ? "border-gold text-gold bg-gold/[0.02]" 
                              : "border-transparent text-muted hover:text-paper"
                          )}
                        >
                          <FileText className="w-4 h-4" />
                          Zenna Instant Quote File
                        </button>
                        <button
                          onClick={() => setActiveTradeTab('dispatch')}
                          className={cn(
                            "px-5 py-3 text-xs uppercase tracking-widest font-bold transition-all border-b-2 flex items-center gap-2",
                            activeTradeTab === 'dispatch' 
                              ? "border-gold text-gold bg-gold/[0.02]" 
                              : "border-transparent text-muted hover:text-paper"
                          )}
                        >
                          <Navigation className="w-4 h-4" />
                          Zenna Route & Dispatch Plan
                        </button>
                      </div>

                      {/* TAB CONTENT: QUOTE */}
                      {activeTradeTab === 'quote' && (
                        <div className="space-y-6">
                          {!draftedQuote && !isDraftingQuote ? (
                            <div className="border border-white/10 p-12 text-center rounded-sm space-y-4">
                              <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto text-gold">
                                <FileText className="w-6 h-6" />
                              </div>
                              <div className="max-w-md mx-auto space-y-2">
                                <h4 className="text-sm font-semibold text-paper">Synthesize Elite Trade Quote</h4>
                                <p className="text-xs text-muted">Zenna reads the lead's intake transcript logs and contextually drafts an itemized professional Australian quote including Australian GST components and structural warranties.</p>
                              </div>
                              <button
                                onClick={() => generateZennaQuote(selectedTradeLeadIndex)}
                                className="bg-gold hover:bg-gold-lt text-ink text-xs uppercase tracking-widest font-bold px-6 py-3 rounded transition-all"
                              >
                                Draft Instant Invoice & Quote
                              </button>
                            </div>
                          ) : isDraftingQuote ? (
                            <div className="border border-white/10 p-16 text-center rounded-sm bg-black/40 relative overflow-hidden">
                              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-gold/10 via-gold to-gold/10 animate-pulse" />
                              <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto text-gold animate-spin mb-4">
                                <Sparkles className="w-5 h-5 animate-pulse" />
                              </div>
                              <p className="text-xs font-serif text-paper animate-pulse">Zenna is analyzing client records to compile GST & trade metrics...</p>
                            </div>
                          ) : draftedQuote && (
                            <motion.div 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="border border-gold/20 rounded bg-white/[0.01] p-6 space-y-6 relative overflow-hidden"
                            >
                              <div className="absolute top-0 right-0 p-4">
                                <span className="px-2 py-0.5 rounded-[2px] border border-green-500/30 text-green-500 text-[8px] tracking-widest uppercase font-bold font-mono">DRAFT READY</span>
                              </div>

                              {/* Australiana Quote Invoice */}
                              <div className="border border-white/5 bg-[#050f0c] p-6 font-mono text-paper rounded">
                                <div className="flex justify-between items-start border-b border-white/10 pb-4 mb-4">
                                  <div>
                                    <p className="text-xs font-bold text-gold uppercase tracking-widest">{businessName.toUpperCase() || "ZENNA APP STUDIO"}</p>
                                    <p className="text-[8px] text-muted">ABN: 44 912 044 112</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-[9px] font-bold text-muted uppercase">JOB QUOTE DRAFT</p>
                                    <p className="text-[9px] text-gold">{new Date().toISOString().split('T')[0]}</p>
                                  </div>
                                </div>

                                <p className="text-[10px] leading-relaxed text-muted mb-4 border-b border-white/5 pb-4">
                                  {draftedQuote.intro}
                                </p>

                                {/* Itemized List */}
                                <div className="space-y-2 mb-4 border-b border-white/5 pb-4">
                                  <p className="text-[9px] font-bold text-gold uppercase mb-2">Estimated Deliverables Breakdown</p>
                                  {draftedQuote.items?.map((item: any, idx: number) => (
                                    <div key={idx} className="flex justify-between text-[10px] py-1 border-b border-white/[0.02]">
                                      <span className="text-muted">· {item.description}</span>
                                      <span className="text-paper pl-4 font-bold">{item.price}</span>
                                    </div>
                                  ))}
                                </div>

                                <div className="space-y-1 text-right mb-4">
                                  <p className="text-[10px] text-muted">GST Component (10.0%): <span className="font-bold text-paper">{draftedQuote.gst}</span></p>
                                  <p className="text-xs text-gold uppercase font-bold text-right">TOTAL CONTRACT ESTIMATE: <span className="text-sm text-green-400 font-bold ml-1">{draftedQuote.total}</span></p>
                                </div>

                                <div className="bg-white/[0.02] p-3 rounded border border-white/5 text-[9px] text-muted leading-relaxed italic">
                                  ⚠️ {draftedQuote.warranty}
                                </div>
                              </div>

                              {/* Dave (Owner) Actions */}
                              <div className="bg-[#0b1a15] border border-gold/10 p-4 rounded-md flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="space-y-1 text-center sm:text-left flex-1">
                                  <span className="text-[8px] uppercase tracking-widest text-gold font-bold">Zenna Owner Recommendation</span>
                                  <p className="text-xs text-paper/80 italic font-serif">"{draftedQuote.actionRequired}"</p>
                                </div>

                                <div className="flex flex-wrap gap-2 flex-shrink-0 w-full sm:w-auto">
                                  {driveToken && (
                                    savedQuoteLink ? (
                                      <a
                                        href={savedQuoteLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 sm:flex-initial bg-green-500/10 border border-green-500/30 text-green-400 text-[10px] uppercase tracking-widest font-bold px-4 py-3 rounded transition-all flex items-center justify-center gap-1.5 hover:bg-green-500/20"
                                      >
                                        <ExternalLink className="w-3.5 h-3.5 text-green-400" />
                                        Open in Drive
                                      </a>
                                    ) : (
                                      <button
                                        onClick={saveQuoteToDrive}
                                        disabled={savingQuoteToDrive}
                                        className="flex-1 sm:flex-initial bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[10px] uppercase tracking-widest font-bold px-4 py-3 rounded transition-all flex items-center justify-center gap-1.5 hover:bg-blue-500/20 disabled:opacity-50"
                                      >
                                        <Cloud className="w-3.5 h-3.5 text-blue-400" />
                                        {savingQuoteToDrive ? 'Uploading...' : 'Save to Drive'}
                                      </button>
                                    )
                                  )}
                                  <button
                                    onClick={() => {
                                      navigator.clipboard.writeText(JSON.stringify(draftedQuote, null, 2));
                                      setQuoteCopied(true);
                                      setTimeout(() => setQuoteCopied(false), 2000);
                                    }}
                                    className="flex-1 sm:flex-initial bg-white/5 border border-white/15 hover:border-gold text-paper text-[10px] uppercase tracking-widest font-bold px-4 py-3 rounded transition-all flex items-center justify-center gap-1.5"
                                  >
                                    <Copy className="w-3.5 h-3.5" />
                                    {quoteCopied ? 'Copied' : 'Copy Quote'}
                                  </button>
                                  <button
                                    onClick={() => {
                                      setQuoteSentStatus(true);
                                      setChatMessages(prev => [...prev, {
                                        role: 'zenna',
                                        text: `G'day Dave! I've automatically compiled that tailored software proposal totaling ${draftedQuote.total} and forwarded the link directly to ${leads[selectedTradeLeadIndex].name}'s SMS log. Clean, fast pipelines. 🤙`,
                                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                      }]);
                                    }}
                                    disabled={quoteSentStatus}
                                    className={cn(
                                      "flex-1 sm:flex-initial text-xs uppercase tracking-widest font-bold px-5 py-3 rounded transition-all flex items-center justify-center gap-1.5",
                                      quoteSentStatus 
                                        ? "bg-green-500/20 text-green-400 border border-green-500/30 cursor-not-allowed"
                                        : "bg-gold hover:bg-gold-lt text-ink"
                                    )}
                                  >
                                    <Send className="w-3.5 h-3.5" />
                                    {quoteSentStatus ? 'Quote Sent' : 'SMS Quote'}
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      )}

                      {/* TAB CONTENT: DISPATCH */}
                      {activeTradeTab === 'dispatch' && (
                        <div className="space-y-6">
                          {!calculatedDispatch && !isCalculatingDispatch ? (
                            <div className="border border-white/10 p-12 text-center rounded-sm space-y-4">
                              <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto text-gold">
                                <Navigation className="w-6 h-6" />
                              </div>
                              <div className="max-w-md mx-auto space-y-2">
                                <h4 className="text-sm font-semibold text-paper">Optimize GPS Dispatch & Packing Gear</h4>
                                <p className="text-xs text-muted">Zenna cross-references the job summary to generate a custom technical packing checklist, suburb traffic zone assessments, exact ETA calculations, and automatic owner alerts.</p>
                              </div>
                              <button
                                onClick={() => calculateZennaDispatch(selectedTradeLeadIndex)}
                                className="bg-gold hover:bg-gold-lt text-ink text-xs uppercase tracking-widest font-bold px-6 py-3 rounded transition-all"
                              >
                                Optimize Dispatch Route
                              </button>
                            </div>
                          ) : isCalculatingDispatch ? (
                            <div className="border border-white/10 p-16 text-center rounded-sm bg-black/40 relative overflow-hidden">
                              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-gold/10 via-gold to-gold/10 animate-pulse" />
                              <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto text-gold animate-spin mb-4">
                                <Wrench className="w-5 h-5 animate-pulse" />
                              </div>
                              <p className="text-xs font-serif text-paper animate-pulse">Zenna is mapping dispatch telemetry and compiling tool presets...</p>
                            </div>
                          ) : calculatedDispatch && (
                            <motion.div 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="border border-gold/20 rounded bg-white/[0.01] p-6 space-y-6"
                            >
                              {/* Route telemetry HUD */}
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                <div className="bg-[#050f0c] border border-white/10 p-4 rounded text-center">
                                  <span className="text-[8px] uppercase tracking-widest text-muted block mb-1 font-mono">PROPOSED ETD TRAVEL</span>
                                  <span className="font-serif text-sm font-bold text-gold flex items-center justify-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5 text-gold-lt" /> {calculatedDispatch.travelMinutes}
                                  </span>
                                </div>
                                <div className="bg-[#050f0c] border border-white/10 p-4 rounded text-center">
                                  <span className="text-[8px] uppercase tracking-widest text-muted block mb-1 font-mono">DEPT TRANSIT METRICS</span>
                                  <span className="font-serif text-sm font-bold text-gold flex items-center justify-center gap-1.5">
                                    <Navigation className="w-3.5 h-3.5 text-gold-lt" /> {calculatedDispatch.distanceKm}
                                  </span>
                                </div>
                                <div className="bg-[#050f0c] border border-white/10 p-4 rounded text-center col-span-1">
                                  <span className="text-[8px] uppercase tracking-widest text-muted block mb-1 font-mono">LOCAL DISPATCH STATUS</span>
                                  <span className="font-mono text-[10px] font-bold text-green-500 uppercase tracking-tight block truncate mt-1">
                                    {calculatedDispatch.dispatchZone}
                                  </span>
                                </div>
                              </div>

                              {/* Zenna Specialist Tech Gear Checklist */}
                              <div className="border border-white/5 bg-black/30 p-5 rounded">
                                <div className="flex items-center gap-2 mb-3">
                                  <Wrench className="w-3.5 h-3.5 text-gold" />
                                  <span className="text-[9px] uppercase tracking-widest font-bold text-gold">Zenna Dynamic Tool & Machinery Checklist</span>
                                </div>
                                <p className="text-[10px] text-muted mb-4">The technician must pack the following tools based on: "{leads[selectedTradeLeadIndex].notes}"</p>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  {calculatedDispatch.toolsRequired?.map((tool: string, idx: number) => {
                                    const id = `tool-${idx}-${selectedTradeLeadIndex}`;
                                    return (
                                      <div key={idx} className="flex items-center gap-2.5 bg-white/[0.01] hover:bg-white/[0.03] p-2.5 rounded border border-white/5">
                                        <input 
                                          type="checkbox" 
                                          id={id}
                                          className="accent-gold w-3.5 h-3.5 cursor-pointer rounded border-white/20 bg-transparent"
                                        />
                                        <label htmlFor={id} className="text-xs text-paper/80 font-mono cursor-pointer select-none">
                                          {tool}
                                        </label>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Auto notification SMS to client */}
                              <div className="space-y-2 border-t border-white/5 pt-4">
                                <span className="text-[9px] uppercase tracking-widest text-muted font-bold block">Caller Dispatch Alert Notification SMS Draft</span>
                                <div className="bg-black/40 border border-white/10 p-4 rounded font-mono text-[11px] text-paper/90 relative">
                                  <p>"{calculatedDispatch.clientAlertDraft}"</p>
                                  <div className="mt-4 flex items-center justify-between text-[8px] text-muted uppercase">
                                    <span>📩 Zenna Mobile Relay Integration Enabled</span>
                                    <span>~{calculatedDispatch.clientAlertDraft?.length || 0} characters</span>
                                  </div>
                                </div>

                                <div className="flex flex-wrap justify-end gap-2 pt-2">
                                  {driveToken && (
                                    savedDispatchLink ? (
                                      <a
                                        href={savedDispatchLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-green-500/10 border border-green-500/30 text-green-400 text-[10px] uppercase tracking-widest font-bold px-4 py-2.5 rounded transition-all flex items-center gap-1.5 hover:bg-green-500/20"
                                      >
                                        <ExternalLink className="w-3.5 h-3.5 text-green-400" />
                                        Open in Drive
                                      </a>
                                    ) : (
                                      <button
                                        onClick={saveDispatchToDrive}
                                        disabled={savingDispatchToDrive}
                                        className="bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[10px] uppercase tracking-widest font-bold px-4 py-2.5 rounded transition-all flex items-center gap-1.5 hover:bg-blue-500/20 disabled:opacity-50"
                                      >
                                        <Cloud className="w-3.5 h-3.5 text-blue-400" />
                                        {savingDispatchToDrive ? 'Saving...' : 'Save to Drive'}
                                      </button>
                                    )
                                  )}
                                  <button
                                    onClick={() => {
                                      navigator.clipboard.writeText(calculatedDispatch.clientAlertDraft);
                                      setDispatchCopied(true);
                                      setTimeout(() => setDispatchCopied(false), 2000);
                                    }}
                                    className="bg-white/5 border border-white/15 hover:border-gold text-paper text-[10px] uppercase tracking-widest font-bold px-4 py-2.5 rounded transition-all flex items-center gap-1.5"
                                  >
                                    <Copy className="w-3.5 h-3.5" />
                                    {dispatchCopied ? 'Copied' : 'Copy SMS Alert'}
                                  </button>
                                  <button
                                    onClick={() => {
                                      setChatMessages(prev => [...prev, {
                                        role: 'zenna',
                                        text: `SMS dispatched to ${leads[selectedTradeLeadIndex].name}: "${calculatedDispatch.clientAlertDraft}". Dave, travel safety active. Route loaded in Apple CarPlay.`,
                                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                      }]);
                                    }}
                                    className="bg-gold hover:bg-gold-lt text-ink text-[10px] uppercase tracking-widest font-bold px-4 py-2.5 rounded transition-all flex items-center gap-1.5"
                                  >
                                    <Send className="w-3.5 h-3.5" />
                                    Send SMS & Go
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-muted text-center py-6">Add secondary clients into the CRM to test the dispatch hub flow.</p>
                )}
              </div>
            </div>

            {/* Right section - AI Brief Panel */}
            <div className="bg-gold/[0.03] border border-gold/10 p-10 rounded-sm flex flex-col h-[755px] overflow-hidden">
              <div className="mb-8 flex-1 flex flex-col overflow-hidden">
                <div className="flex items-center gap-2 text-gold text-[10px] uppercase tracking-widest font-bold mb-6">
                  <Sparkles className="w-3" />
                  Your Intelligence
                </div>
                
                <div className="space-y-4 overflow-y-auto pr-2 flex-1 scrollbar-none">
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={cn("flex flex-col gap-2", msg.role === 'owner' ? "items-end" : "items-start")}>
                      <span className="text-[9px] uppercase tracking-widest text-muted">{msg.role === 'zenna' ? 'Zenna' : 'You'} · {msg.time}</span>
                      <p className={cn(
                        "text-xs leading-relaxed p-4 rounded-lg",
                        msg.role === 'zenna' ? "bg-gold/10 text-paper border border-gold/10 italic rounded-tl-none font-serif" : "bg-white/5 text-muted border border-white/10 rounded-tr-none"
                      )}>
                        "{msg.text}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4 py-8 border-t border-gold/10">
                <div className="flex items-center justify-between">
                  <span className="text-muted text-[10px] uppercase tracking-widest">Efficiency</span>
                  <span className="text-paper text-sm font-mono">100%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted text-[10px] uppercase tracking-widest">Value Recovery</span>
                  <span className="text-green-500 text-sm font-mono">$12,700</span>
                </div>
              </div>

              <div className="mt-auto pt-6 border-t border-white/5 flex gap-2">
                <input 
                  type="text"
                  placeholder="Ask Zenna..."
                  className="flex-1 bg-white/5 border border-white/10 rounded px-4 py-3 text-xs outline-none focus:border-gold/30"
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAsk()}
                />
                <button 
                  onClick={handleAsk}
                  className="bg-gold text-ink p-3 rounded hover:bg-gold-lt transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          </div>
          )}
        </div>
      </main>

      {/* MODAL OVERLAY: CREATE NEW CRM Lead Client file */}
      <AnimatePresence>
        {showAddLeadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddLeadModal(false)}
              className="absolute inset-0 bg-black"
            />
            
            {/* Modal Box */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#121214] border border-white/10 p-8 rounded shadow-2xl relative w-full max-w-lg z-10"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="space-y-1">
                  <span className="text-[9px] uppercase tracking-widest text-gold font-bold">Zenna Directory Node</span>
                  <h3 className="font-serif text-xl text-paper">Create CRM Client Profile</h3>
                </div>
                <button 
                  onClick={() => setShowAddLeadModal(false)}
                  className="text-muted hover:text-paper p-1 rounded hover:bg-white/5"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddLeadSubmit} className="space-y-4">
                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-muted font-bold mb-2">FullName</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Sandra Wu"
                    className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-xs outline-none text-paper focus:border-gold/50"
                    value={leadFormData.name}
                    onChange={e => setLeadFormData({...leadFormData, name: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] uppercase tracking-widest text-muted font-bold mb-2">Phone Number</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. +61 423 044 112"
                      className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-xs outline-none text-paper font-mono focus:border-gold/50"
                      value={leadFormData.phone}
                      onChange={e => setLeadFormData({...leadFormData, phone: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase tracking-widest text-muted font-bold mb-2">Project Quote / Deal Value</label>
                    <input 
                      type="text" 
                      placeholder="e.g. $1,200"
                      className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-xs outline-none text-paper focus:border-gold/50"
                      value={leadFormData.value}
                      onChange={e => setLeadFormData({...leadFormData, value: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-muted font-bold mb-2">Pipeline Status</label>
                  <select 
                    className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-xs outline-none text-paper focus:border-gold/50"
                    value={leadFormData.status}
                    onChange={e => setLeadFormData({...leadFormData, status: e.target.value})}
                  >
                    <option value="New" className="bg-[#121214] text-paper">New Lead / Inquiry</option>
                    <option value="Scheduled" className="bg-[#121214] text-paper">Job Scheduled</option>
                    <option value="Won" className="bg-[#121214] text-paper">Project Won / Decided</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-muted font-bold mb-2">Project Notes / Specific Context</label>
                  <textarea 
                    rows={3}
                    placeholder="e.g. Emergency main water valve split replacement. Needs immediate callback from Dave."
                    className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-xs outline-none text-paper focus:border-gold/50 leading-relaxed resize-none"
                    value={leadFormData.notes}
                    onChange={e => setLeadFormData({...leadFormData, notes: e.target.value})}
                  />
                  <p className="text-[8px] text-muted uppercase mt-2 tracking-wider">
                    💡 Zenna reads these project notes dynamically during live call lookup to personalize greetings!
                  </p>
                </div>

                <div className="pt-4 flex gap-4">
                  <button 
                    type="submit"
                    className="flex-1 bg-gold hover:bg-gold-lt text-ink py-3 rounded text-xs tracking-widest uppercase font-bold transition-all"
                  >
                    Save & Sync to CRM
                  </button>
                  <button 
                    type="button"
                    onClick={() => setShowAddLeadModal(false)}
                    className="bg-white/5 border border-white/10 hover:bg-white/10 text-paper px-6 py-3 rounded text-xs tracking-widest uppercase font-bold transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─────────────────────────────────────────
// APP MAIN
// ─────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState<Page>('landing');
  const [businessName, setBusinessName] = useState("Zenna App Studio");

  return (
    <div className="font-sans">
      <AnimatePresence mode="wait">
        {page === 'landing' && (
          <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Landing onGetStarted={() => setPage('setup')} />
          </motion.div>
        )}
        {page === 'setup' && (
          <motion.div key="setup" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Setup onComplete={() => setPage('dashboard')} setBusinessName={setBusinessName} />
          </motion.div>
        )}
        {page === 'dashboard' && (
          <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Dashboard businessName={businessName} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
