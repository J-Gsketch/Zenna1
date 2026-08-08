import React from 'react';
import { Composition, Sequence, useCurrentFrame, interpolate, spring, AbsoluteFill } from 'remotion';

const Scene1 = ({ themeColor }: { themeColor: string }) => {
  const frame = useCurrentFrame();
  const scale = spring({ frame, fps: 30, config: { damping: 100 } });
  const opacity = interpolate(frame, [0, 15], [0, 1]);

  return (
    <AbsoluteFill style={{ backgroundColor: '#0a0a0a', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ opacity, transform: `scale(${scale})`, textAlign: 'center' }}>
        <div style={{ backgroundColor: '#ef4444', color: '#fff', padding: '20px 60px', borderRadius: 40, fontSize: 45, marginBottom: 50, fontWeight: 'bold' }}>
          Missed Call
        </div>
        <h1 style={{ color: '#fff', fontSize: 70, margin: 0 }}>On the tools?</h1>
        <h2 style={{ color: themeColor, fontSize: 90, marginTop: 20 }}>You just lost $500.</h2>
      </div>
    </AbsoluteFill>
  );
};

const Scene2 = ({ themeColor }: { themeColor: string }) => {
  const frame = useCurrentFrame();
  const translateY = interpolate(frame, [0, 20], [200, 0], { extrapolateRight: 'clamp' });
  const opacity = interpolate(frame, [0, 20], [0, 1]);

  return (
    <AbsoluteFill style={{ backgroundColor: '#0a0a0a', justifyContent: 'center', alignItems: 'center', padding: 40 }}>
      <h1 style={{ color: '#fff', fontSize: 70, opacity, textAlign: 'center', marginBottom: 80, lineHeight: 1.2 }}>
        <span style={{ color: themeColor }}>Zenna</span> answers instantly.
      </h1>
      
      <div style={{ 
        opacity, 
        transform: `translateY(${translateY}px)`,
        backgroundColor: '#1c1c1e',
        border: `4px solid ${themeColor}`,
        borderRadius: 40,
        padding: 50,
        width: '90%',
      }}>
        <p style={{ color: '#a1a1aa', fontSize: 35, margin: 0, textTransform: 'uppercase', letterSpacing: 3, fontWeight: 'bold' }}>Zenna AI SMS</p>
        <p style={{ color: '#fff', fontSize: 50, marginTop: 30, lineHeight: 1.4, fontStyle: 'italic' }}>
          "Hi! We're on a job right now, but we've got your query. How can we help?"
        </p>
      </div>
    </AbsoluteFill>
  );
};

const Scene3 = ({ headline, themeColor }: { headline: string, themeColor: string }) => {
  const frame = useCurrentFrame();
  const scale = spring({ frame, fps: 30, config: { damping: 12 } });
  
  return (
    <AbsoluteFill style={{ backgroundColor: '#0a0a0a', justifyContent: 'center', alignItems: 'center' }}>
      <h1 style={{ color: themeColor, fontSize: 80, transform: `scale(${scale})`, textAlign: 'center', fontWeight: 'bold', padding: '0 40px', lineHeight: 1.1 }}>
        {headline}
      </h1>
      
      <div style={{ 
          marginTop: 100, 
          padding: 50, 
          backgroundColor: '#1c1c1e', 
          borderRadius: 30, 
          border: `3px solid ${themeColor}`,
          opacity: interpolate(frame, [15, 30], [0, 1], { extrapolateRight: 'clamp' }),
          transform: `translateY(${interpolate(frame, [15, 30], [50, 0], { extrapolateRight: 'clamp' })}px)`,
          width: '80%',
          textAlign: 'center'
      }}>
        <h2 style={{ color: '#4ade80', fontSize: 60, margin: 0 }}>Daily Wrap: $4,200</h2>
        <p style={{ color: '#a1a1aa', fontSize: 35, marginTop: 20 }}>Zenna automatically booked 2 jobs today.</p>
      </div>
    </AbsoluteFill>
  );
};

export const ZennaAd = ({ headline = "Never Miss a Lead Again.", themeColor = "#D4AF37" }: { headline?: string, themeColor?: string }) => {
  return (
    <AbsoluteFill style={{ fontFamily: 'sans-serif' }}>
      <Sequence from={0} durationInFrames={90}>
        <Scene1 themeColor={themeColor} />
      </Sequence>
      
      <Sequence from={90} durationInFrames={100}>
        <Scene2 themeColor={themeColor} />
      </Sequence>
      
      <Sequence from={190} durationInFrames={110}>
        <Scene3 headline={headline} themeColor={themeColor} />
      </Sequence>
    </AbsoluteFill>
  );
};

export const RemotionVideo = () => {
  return (
    <>
      <Composition
        id="ZennaAd"
        component={ZennaAd}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          headline: "Never Miss a Lead Again.",
          themeColor: "#D4AF37"
        }}
      />
    </>
  );
};
