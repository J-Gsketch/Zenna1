import React, { useState } from 'react';
import { Player } from '@remotion/player';
import { ZennaAd } from '../video/VideoAd';
import { Play, Download, Wand2, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';

export const AiAdStudio = ({ onBack }: { onBack: () => void }) => {
  const [industry, setIndustry] = useState('Plumber');
  const [themeColor, setThemeColor] = useState('#D4AF37');
  const [headline, setHeadline] = useState('Never Miss a Lead Again.');
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const res = await fetch('/api/generate-ad', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ headline, themeColor, industry })
      });
      if (!res.ok) throw new Error('Render failed');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Zenna-Ad-${industry.replace(/[^a-zA-Z0-9]/g, '_')}.mp4`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Failed to render video");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleGenerateAI = () => {
    // Mocking an AI generation delay
    setTimeout(() => {
      if (industry.toLowerCase().includes('plumb')) {
        setHeadline('Stop Letting Leaks Drain Your Profits.');
      } else if (industry.toLowerCase().includes('electric')) {
        setHeadline('Spark More Business While On Site.');
      } else {
        setHeadline(`Automate Your ${industry} Business.`);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-ink text-paper p-8 flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="text-muted hover:text-paper transition-colors">
          &larr; Back to Dashboard
        </button>
        <h1 className="font-serif text-3xl">AI Video Ad Studio</h1>
        <div className="w-24"></div> {/* Spacer for centering */}
      </div>

      <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto w-full flex-1">
        
        {/* Controls Panel */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:w-1/3 bg-surface/30 p-6 rounded-2xl border border-white/5 space-y-6 flex flex-col"
        >
          <div>
            <h2 className="text-xl font-medium mb-4 flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-gold" />
              Campaign Setup
            </h2>
            <p className="text-sm text-muted mb-6">
              Customize your Zenna video ad for TikTok, IG Reels, and Facebook.
            </p>
          </div>

          <div className="space-y-4 flex-1">
            <div>
              <label className="block text-xs uppercase tracking-widest text-muted mb-2">Target Industry</label>
              <input 
                type="text" 
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full bg-ink border border-white/10 rounded px-4 py-2 text-paper focus:outline-none focus:border-gold transition-colors"
                placeholder="e.g. Plumbers, Electricians..."
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-muted mb-2">Headline</label>
              <input 
                type="text" 
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full bg-ink border border-white/10 rounded px-4 py-2 text-paper focus:outline-none focus:border-gold transition-colors"
                placeholder="Never Miss a Lead Again."
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-muted mb-2">Brand Color</label>
              <div className="flex gap-2">
                {['#D4AF37', '#4ade80', '#3b82f6', '#ef4444', '#a855f7'].map(color => (
                  <button 
                    key={color}
                    onClick={() => setThemeColor(color)}
                    className={`w-8 h-8 rounded-full border-2 transition-transform ${themeColor === color ? 'border-white scale-110' : 'border-transparent hover:scale-105'}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-6 border-t border-white/10">
            <div className="bg-gold/10 border border-gold/20 rounded p-4 mb-4">
              <h3 className="text-gold text-sm font-semibold mb-1">Start Advertising for Free</h3>
              <p className="text-xs text-paper/80">
                Download the generated MP4 and post directly to TikTok, Instagram Reels, or Facebook. Gain organic reach without spending a dime on paid ads.
              </p>
            </div>
            <button 
              onClick={handleGenerateAI}
              className="w-full py-3 bg-surface hover:bg-white/10 text-paper rounded flex items-center justify-center gap-2 transition-colors border border-white/5"
            >
              <RefreshCw className="w-4 h-4" /> AI Auto-Generate
            </button>
            <button 
              onClick={handleDownload}
              disabled={isDownloading}
              className="w-full py-3 bg-gold hover:bg-gold-lt text-ink font-medium rounded flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              {isDownloading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />} 
              {isDownloading ? 'Rendering MP4 (Takes ~1 min)...' : 'Download MP4 for Organic Social'}
            </button>
          </div>
        </motion.div>

        {/* Preview Panel */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:w-2/3 bg-black rounded-2xl border border-white/5 overflow-hidden flex items-center justify-center relative min-h-[600px]"
        >
          {/* Remotion Player */}
          <div className="absolute inset-0 flex items-center justify-center p-8 bg-[#0a0a0a]">
            <div className="h-full aspect-[9/16] max-h-[800px] bg-black shadow-2xl rounded-xl overflow-hidden ring-1 ring-white/10 relative">
               <Player
                  component={ZennaAd}
                  inputProps={{ headline, themeColor }}
                  durationInFrames={300}
                  compositionWidth={1080}
                  compositionHeight={1920}
                  fps={30}
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                  controls
                  autoPlay
                  loop
                />
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};
