'use client';

import { ArrowRight, Check, LoaderCircle, RefreshCw, ShieldCheck, UserPlus, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { PortalLayout } from '@/components/layout/PortalLayout';
import { PageIntro } from '@/components/ui';
import { adminApi } from '@/services/api-client';

export function AdminManualEntry() {
  const [eventId, setEventId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [teamCode, setTeamCode] = useState('');
  const [suggested, setSuggested] = useState('');
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [created, setCreated] = useState<{ name: string; email: string; teamCode: string } | null>(null);

  const loadSuggestion = useCallback(async (id: string) => {
    const result = await adminApi.suggestManualTeamCode(id);
    setSuggested(result.teamCode);
    setTeamCode(result.teamCode);
  }, []);

  useEffect(() => {
    adminApi.getDashboard()
      .then(async (dashboard) => {
        const id = dashboard.event?.id;
        if (!id) throw new Error('No active event is configured.');
        setEventId(id);
        await loadSuggestion(id);
      })
      .catch((reason) => setError(reason instanceof Error ? reason.message : 'Manual entry unavailable.'))
      .finally(() => setLoading(false));
  }, [loadSuggestion]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!eventId) return;
    setBusy(true); setError(''); setCreated(null);
    try {
      const customCode = teamCode.trim().toUpperCase();
      const result = await adminApi.createManualParticipant({
        eventId, name: name.trim(), email: email.trim(),
        ...(customCode !== suggested ? { teamCode: customCode } : {}),
      });
      setCreated({ name: result.name, email: result.email, teamCode: result.team.code });
      setName(''); setEmail('');
      await loadSuggestion(eventId);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Participant could not be added.');
    } finally { setBusy(false); }
  }

  return <PortalLayout admin><div className="portal-content">
    <PageIntro eyebrow="DATA INTAKE / MANUAL" title="Add one participant." copy="Create an admitted participant without changing the Excel import workflow."/>
    {loading ? <div className="portal-loading"><LoaderCircle className="spin" size={20}/>Preparing the next team code…</div> :
      <section className="manual-entry-layout">
        <form className="manual-entry-form" onSubmit={submit}>
          <header><div><p className="eyebrow">PARTICIPANT RECORD</p><h2>Identity details</h2></div><UserPlus size={22}/></header>
          {error && <div className="portal-error" role="alert"><X size={15}/>{error}</div>}
          <div className="manual-fields">
            <label><span>NAME</span><input required maxLength={120} autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Participant name"/></label>
            <label><span>EMAIL</span><input required type="email" maxLength={320} autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="participant@example.com"/></label>
            <label className="manual-team-code"><span>TEAM CODE</span><div><input required pattern="PROM-2026[0-9]{3}" value={teamCode} onChange={(e) => setTeamCode(e.target.value.toUpperCase())} placeholder="PROM-2026001"/><button type="button" title="Restore suggested code" aria-label="Restore suggested team code" onClick={() => setTeamCode(suggested)}><RefreshCw size={15}/></button></div><small>{teamCode === suggested ? 'Next available code from the live sequence.' : 'Custom code selected by administrator.'}</small></label>
          </div>
          <footer><p><ShieldCheck size={15}/>Saved directly to the admitted participant directory.</p><button className="button primary" disabled={busy || !name.trim() || !email.trim() || !teamCode.trim()}>{busy ? 'ADDING…' : 'ADD PARTICIPANT'} <ArrowRight size={15}/></button></footer>
        </form>
        <aside className="manual-sequence"><p className="eyebrow">TEAM IDENTITY</p><span>NEXT AVAILABLE</span><strong>{suggested || '—'}</strong><p>Codes continue from the highest existing <b>PROM-2026</b> sequence. You may replace the suggested value before saving.</p>{created && <div className="manual-success" role="status"><Check size={18}/><div><span>PARTICIPANT ADDED</span><strong>{created.name}</strong><small>{created.email}<br/>{created.teamCode}</small></div></div>}</aside>
      </section>}
  </div></PortalLayout>;
}
