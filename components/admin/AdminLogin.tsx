'use client';

import Link from '@/components/ui/DocumentLink';
import { ChevronLeft } from 'lucide-react';
import { type FormEvent, useState } from 'react';
import { adminApi } from '@/services/api-client';

export function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      await adminApi.login(email, password);
      // Vinext's deployed RSC transition currently fails on Worker navigation.
      // A document navigation avoids that runtime path while preserving auth.
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.assign('/admin');
    } catch (reason) {
      setLoading(false);
      setError(reason instanceof Error ? reason.message : 'Organizer credentials were not recognized.');
    }
  }

  return <main className="auth-page admin-auth">
    <Link className="wordmark auth-wordmark" href="/"><span className="brand-mark">P</span><span>PROMPTHON</span></Link>
    <div className="auth-grid">
      <section className="auth-copy">
        <p className="eyebrow"><span>&gt;</span> ORGANIZER SYSTEM / SECURE</p>
        <h1>Competition<br/><span>control.</span></h1>
        <p>Review submissions, govern round access and manage live event operations.</p>
        <div className="control-readout"><span>EVENT</span><strong>LIVE</strong><span>ACCESS</span><strong>ADMIN</strong></div>
      </section>
      <section className="auth-panel">
        <p className="eyebrow">CONTROL CENTER / ADMIN ACCESS</p>
        <h2>Authorized access.</h2>
        <p>Use organizer credentials to continue.</p>
        <form onSubmit={submit}>
          <label>Email<input type="email" value={email} onChange={(event)=>setEmail(event.target.value)} required autoComplete="username"/></label>
          <label>Password<input type="password" value={password} onChange={(event)=>setPassword(event.target.value)} required minLength={12} autoComplete="current-password"/></label>
          {error && <p className="form-error">{error}</p>}
          <button className="button primary wide" disabled={loading}>{loading ? 'AUTHORIZING...' : 'ACCESS CONTROL CENTER →'}</button>
        </form>
        <small>All administrative actions are logged.</small>
        <Link className="admin-entry" href="/login"><ChevronLeft size={14}/>Participant access</Link>
      </section>
    </div>
  </main>;
}
