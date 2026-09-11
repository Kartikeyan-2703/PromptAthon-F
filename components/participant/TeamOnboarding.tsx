'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from '@/components/ui/DocumentLink';
import { motion } from 'framer-motion';
import { LoaderCircle } from 'lucide-react';
import { ApiClientError, participantApi } from '@/services/api-client';

export function TeamSetup() {
  const [members, setMembers] = useState(['', '', '']);
  const [teamCode, setTeamCode] = useState('');
  const [checking, setChecking] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    participantApi.getOnboarding().then((result) => {
      if (!result.required) {
        window.location.replace('/dashboard');
        return;
      }
      setTeamCode(result.teamCode);
    }).catch((reason) => {
      if (reason instanceof ApiClientError && reason.status === 401) window.location.replace('/login');
      else setError(reason instanceof Error ? reason.message : 'Could not load team setup.');
    }).finally(() => setChecking(false));
  }, []);

  function updateMember(index: number, value: string) {
    setMembers((current) => current.map((member, position) => position === index ? value : member));
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    const normalized = members.map((name) => name.trim());
    if (!normalized[0]) {
      setError('Member 1 is required.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await participantApi.completeOnboarding(normalized.filter(Boolean));
      window.location.replace('/dashboard');
    } catch (reason) {
      if (reason instanceof ApiClientError && reason.code === 'TEAM_DETAILS_ALREADY_COMPLETED') window.location.replace('/dashboard');
      else setError(reason instanceof Error ? reason.message : 'Could not save team details.');
    } finally {
      setSaving(false);
    }
  }

  return <main className="auth-page team-setup-page">
    <Link className="wordmark auth-wordmark" href="/"><span className="brand-mark">P</span><span>PROMPTHON</span></Link>
    <div className="team-setup-wrap">
      <section className="auth-copy">
        <p className="eyebrow"><span>&gt;</span> TEAM ONBOARDING</p>
        <h1>Complete your<br /><span>team details.</span></h1>
        <p>Please provide the names of all members participating in your team.</p>
        {teamCode && <div className="auth-system"><span>TEAM IDENTITY</span><strong>{teamCode}</strong></div>}
      </section>
      <motion.section className="auth-panel team-setup-panel" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <p className="eyebrow">TEAM DETAILS / ONCE ONLY</p>
        {checking ? <div className="portal-loading"><LoaderCircle className="spin" />Checking database…</div> : <form onSubmit={submit}>
          {[0, 1, 2].map((index) => <label key={index}>Member {index + 1}{index > 0 ? ' (Optional)' : ''}<input value={members[index]} onChange={(event) => updateMember(index, event.target.value)} maxLength={120} autoComplete="off" required={index === 0} disabled={saving} /></label>)}
          {error && <p className="form-error">{error}</p>}
          <button className="button primary wide" disabled={saving}>{saving ? 'SAVING TEAM DETAILS…' : 'CONTINUE TO PORTAL →'}</button>
        </form>}
        <small>These details are saved permanently to your team record.</small>
      </motion.section>
    </div>
  </main>;
}
