import React, { useEffect, useState } from 'react';
import { getIdToken } from '../lib/googleAuth';

type Stats = { today?: { confirmedValue: number; newLeads: number; callsCaught: number } };

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats>({});
  const [error, setError] = useState('');

  useEffect(() => {
    getIdToken().then(async token => {
      if (!token) return;
      const response = await fetch('/api/stats', { headers: { Authorization: 'Bearer ' + token } });
      if (!response.ok) throw new Error('Unable to load dashboard metrics.');
      setStats(await response.json());
    }).catch(err => setError(err.message));
  }, []);

  if (error) return <p role="alert">{error}</p>;
  return (
    <section aria-label="Zenna dashboard">
      <h1>Zenna by Hammer &amp; Code</h1>
      <dl>
        <div><dt>Calls received</dt><dd>{stats.today?.callsCaught ?? 0}</dd></div>
        <div><dt>New leads</dt><dd>{stats.today?.newLeads ?? 0}</dd></div>
        <div><dt>Pipeline value</dt><dd>${stats.today?.confirmedValue ?? 0}</dd></div>
      </dl>
    </section>
  );
};
