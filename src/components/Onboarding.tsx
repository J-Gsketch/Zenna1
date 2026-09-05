import React, { useState } from 'react';
import { getIdToken } from '../lib/googleAuth';

export const Onboarding: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [businessName, setBusinessName] = useState('');
  const [location, setLocation] = useState('');
  const [serviceTypes, setServiceTypes] = useState('');
  const [operatingHours, setOperatingHours] = useState('Monday to Friday, 8am to 5pm');
  const [saved, setSaved] = useState(false);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    const token = await getIdToken();
    if (!token) throw new Error('Please sign in before configuring Zenna.');
    const response = await fetch('/api/business-config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
      body: JSON.stringify({ businessName, location, serviceTypes, operatingHours })
    });
    if (!response.ok) throw new Error('Could not save your business configuration.');
    setSaved(true);
    onComplete?.();
  }

  return <form onSubmit={save} aria-label="Business onboarding">
    <h1>Set up your Zenna receptionist</h1>
    <label>Business name<input required value={businessName} onChange={e => setBusinessName(e.target.value)} /></label>
    <label>Location<input required value={location} onChange={e => setLocation(e.target.value)} /></label>
    <label>Services<input required value={serviceTypes} onChange={e => setServiceTypes(e.target.value)} /></label>
    <label>Operating hours<input required value={operatingHours} onChange={e => setOperatingHours(e.target.value)} /></label>
    <button type="submit">Save configuration</button>
    {saved && <p role="status">Configuration saved. Your test call is ready.</p>}
  </form>;
};
