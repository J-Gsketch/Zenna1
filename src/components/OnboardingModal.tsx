import React, { useState, useEffect } from 'react';
import { ShieldCheck, Zap, PhoneCall, CheckCircle2, CreditCard, Building2, User, Phone, DollarSign, Globe, Check } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose, onSaved }) => {
  const [step, setStep] = useState<number>(1);
  const [businessName, setBusinessName] = useState('Zenna by Hammer & Code');
  const [ownerName, setOwnerName] = useState('Dave');
  const [ownerPhone, setOwnerPhone] = useState('+64210000000');
  const [calloutFee, setCalloutFee] = useState('$150');
  const [region, setRegion] = useState<'NZ' | 'AU'>('NZ');
  const [currency, setCurrency] = useState<'NZD' | 'AUD'>('NZD');
  const [plan, setPlan] = useState<'Solo Tradie' | 'Pro Team'>('Solo Tradie');
  const [isLoading, setIsLoading] = useState(false);
  const [subscriptionMsg, setSubscriptionMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/business-config')
      .then(res => res.json())
      .then(data => {
        if (data.businessName) setBusinessName(data.businessName);
        if (data.ownerName) setOwnerName(data.ownerName);
        if (data.ownerPhone) setOwnerPhone(data.ownerPhone);
        if (data.calloutFee) setCalloutFee(data.calloutFee);
        if (data.region) setRegion(data.region);
        if (data.currency) setCurrency(data.currency);
      })
      .catch(err => console.error('Error fetching config:', err));
  }, []);

  if (!isOpen) return null;

  const handleRegionChange = (newRegion: 'NZ' | 'AU') => {
    setRegion(newRegion);
    setCurrency(newRegion === 'NZ' ? 'NZD' : 'AUD');
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await fetch('/api/business-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessName, ownerName, ownerPhone, calloutFee, plan, region, currency })
      });

      const subRes = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, businessName, currency })
      });
      const subData = await subRes.json();
      setSubscriptionMsg(subData.message);
      setStep(3);
      onSaved();
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 text-white shadow-2xl relative overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/20 text-blue-400 rounded-lg border border-blue-500/30">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Zenna Automated Setup</h3>
              <p className="text-xs text-slate-400">Self-Serve Onboarding & Dual-Currency Stripe Setup</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-sm px-2 py-1 rounded bg-slate-800/50">✕</button>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-8 px-2">
          <div className={`flex items-center gap-2 text-xs ${step >= 1 ? 'text-blue-400 font-semibold' : 'text-slate-500'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}>1</span>
            Business Details
          </div>
          <div className="h-px bg-slate-800 flex-1 mx-4"></div>
          <div className={`flex items-center gap-2 text-xs ${step >= 2 ? 'text-blue-400 font-semibold' : 'text-slate-500'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}>2</span>
            Subscription Plan
          </div>
          <div className="h-px bg-slate-800 flex-1 mx-4"></div>
          <div className={`flex items-center gap-2 text-xs ${step >= 3 ? 'text-emerald-400 font-semibold' : 'text-slate-500'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 3 ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'}`}>3</span>
            Call Forwarding
          </div>
        </div>

        {/* Step 1: Business Form */}
        {step === 1 && (
          <form onSubmit={() => setStep(2)} className="space-y-4">
            
            {/* Region Selector */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-300 flex items-center gap-1.5 font-medium">
                <Globe className="w-4 h-4 text-blue-400" /> Business Region & Billing Currency:
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleRegionChange('NZ')}
                  className={`px-3 py-1 text-xs rounded-lg font-medium transition-all ${region === 'NZ' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-900 text-slate-400 hover:text-white'}`}
                >
                  🇳🇿 New Zealand (NZD $)
                </button>
                <button
                  type="button"
                  onClick={() => handleRegionChange('AU')}
                  className={`px-3 py-1 text-xs rounded-lg font-medium transition-all ${region === 'AU' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-900 text-slate-400 hover:text-white'}`}
                >
                  🇦🇺 Australia (AUD $)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-blue-400" /> Business / Trading Name
              </label>
              <input 
                type="text" 
                value={businessName} 
                onChange={e => setBusinessName(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-blue-400" /> Owner Name
                </label>
                <input 
                  type="text" 
                  value={ownerName} 
                  onChange={e => setOwnerName(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" 
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-blue-400" /> Owner Mobile (6 PM Briefs)
                </label>
                <input 
                  type="text" 
                  value={ownerPhone} 
                  onChange={e => setOwnerPhone(e.target.value)}
                  required
                  placeholder={region === 'NZ' ? '+64210000000' : '+61400000000'}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" 
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> Standard Call-Out Diagnostic Fee ({currency})
              </label>
              <input 
                type="text" 
                value={calloutFee} 
                onChange={e => setCalloutFee(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" 
              />
              <p className="text-[11px] text-slate-500 mt-1">Zenna informs callers of this fee before qualifying them.</p>
            </div>

            <div className="pt-4 flex justify-end">
              <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm px-5 py-2 rounded-lg transition-colors flex items-center gap-2">
                Continue to Plan Selection →
              </button>
            </div>
          </form>
        )}

        {/* Step 2: Subscription Plan Selection */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div 
                onClick={() => setPlan('Solo Tradie')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${plan === 'Solo Tradie' ? 'bg-blue-950/40 border-blue-500 ring-1 ring-blue-500' : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-sm">Solo Tradie</h4>
                  <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded font-mono">${currency} 199/mo</span>
                </div>
                <p className="text-xs text-slate-400 mb-3">Perfect for sole operators & vans on the road.</p>
                <ul className="text-[11px] text-slate-300 space-y-1">
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-emerald-400" /> 1 Twilio Phone Line ({region})</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-emerald-400" /> Auto Missed-Call SMS</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-emerald-400" /> 6 PM Daily Briefing</li>
                </ul>
              </div>

              <div 
                onClick={() => setPlan('Pro Team')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${plan === 'Pro Team' ? 'bg-blue-950/40 border-blue-500 ring-1 ring-blue-500' : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-sm">Pro Team</h4>
                  <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-mono">${currency} 399/mo</span>
                </div>
                <p className="text-xs text-slate-400 mb-3">For multi-van teams & larger operations.</p>
                <ul className="text-[11px] text-slate-300 space-y-1">
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-emerald-400" /> Up to 3 Phone Lines</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-emerald-400" /> Instant Tech Scoping Quotes</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-emerald-400" /> Priority Support</li>
                </ul>
              </div>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-400 flex items-center justify-between">
              <span className="flex items-center gap-2"><CreditCard className="w-4 h-4 text-emerald-400" /> 7-Day Free Trial included. Direct payouts to your NZ bank account.</span>
              <span className="text-slate-500">Stripe Billing Active</span>
            </div>

            <div className="pt-4 flex justify-between items-center border-t border-slate-800">
              <button onClick={() => setStep(1)} className="text-xs text-slate-400 hover:text-white">← Back</button>
              <button 
                onClick={handleSaveConfig} 
                disabled={isLoading}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                {isLoading ? 'Activating Subscription...' : 'Activate Subscription & Complete Setup'}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Call Forwarding Instructions */}
        {step === 3 && (
          <div className="space-y-4 text-center py-2">
            <div className="w-12 h-12 bg-emerald-500/20 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-400 mb-3">
              <ShieldCheck className="w-6 h-6" />
            </div>

            <h4 className="font-semibold text-lg text-white">Subscription Active!</h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              {subscriptionMsg || 'Your business configuration and automated subscription have been activated.'}
            </p>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-left space-y-3 my-4">
              <h5 className="text-xs font-semibold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                <PhoneCall className="w-4 h-4" /> Final Step: Activate 1-Click Call Forwarding ({region})
              </h5>
              <p className="text-xs text-slate-300">
                Dial the command below on your mobile phone to automatically forward missed calls to Zenna:
              </p>

              <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 flex items-center justify-between font-mono text-sm text-emerald-400">
                <span>{region === 'NZ' ? '*21*+6421912345#' : '*61*+61291234567#'}</span>
                <span className="text-[10px] text-slate-500 font-sans">{region === 'NZ' ? '(One NZ / Spark / 2degrees)' : '(Telstra / Optus / Vodafone)'}</span>
              </div>
            </div>

            <button 
              onClick={onClose}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm py-2.5 rounded-lg transition-colors"
            >
              Open Live Zenna Dashboard
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
