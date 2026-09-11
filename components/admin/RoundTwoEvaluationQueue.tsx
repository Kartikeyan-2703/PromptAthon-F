/* eslint-disable react-hooks/set-state-in-effect -- route data is synchronized with the backend */
'use client';

import { Check, LoaderCircle, Search, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { EmptyState, Modal, StatusBadge } from '@/components/ui';
import { adminApi, RoundTwoEvaluationData, RoundAccessStatus } from '@/services/api-client';

type Candidate = RoundTwoEvaluationData['items'][number];
type Filter = 'PENDING' | 'APPROVED' | 'REJECTED';

const isFinal = (status: RoundAccessStatus) => status === 'APPROVED' || status === 'REJECTED';
const matchesFilter = (status: RoundAccessStatus, filter: Filter) => filter === 'PENDING' ? !isFinal(status) : status === filter;

export function RoundTwoEvaluationQueue() {
  const [data, setData] = useState<RoundTwoEvaluationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('PENDING');
  const [decision, setDecision] = useState<{ candidate: Candidate; value: 'APPROVED' | 'REJECTED' } | null>(null);

  const load = useCallback(async () => {
    try {
      setData(await adminApi.getRoundTwoEvaluations());
      setError('');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Round 2 evaluations could not be loaded.');
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => { void load(); }, [load]);

  const counts = useMemo(() => ({
    PENDING: data?.items.filter((item) => !isFinal(item.status)).length ?? 0,
    APPROVED: data?.items.filter((item) => item.status === 'APPROVED').length ?? 0,
    REJECTED: data?.items.filter((item) => item.status === 'REJECTED').length ?? 0,
  }), [data]);
  const visible = useMemo(() => {
    const query = search.trim().toLowerCase();
    return (data?.items ?? []).filter((item) => matchesFilter(item.status, filter) && (!query || item.team.code.toLowerCase().includes(query) || item.team.members.some(({ participant }) => participant.name.toLowerCase().includes(query) || participant.email.toLowerCase().includes(query))));
  }, [data, filter, search]);

  async function confirm() {
    if (!decision) return;
    try {
      await adminApi.reviewRoundTwoEvaluation(decision.candidate.team.id, decision.value, decision.candidate.version);
      setDecision(null);
      setLoading(true);
      await load();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'The offline decision could not be saved.');
      setDecision(null);
    }
  }

  if (loading) return <div className="portal-loading"><LoaderCircle className="spin" />Loading eligible Round 2 teams…</div>;
  return <>
    {error && <div className="portal-error" role="alert"><X size={15} />{error}</div>}
    {data && <>
      <div className="review-scope"><span>OFFLINE EVALUATION</span><strong>ROUND 02 / {data.round.title.toUpperCase()}</strong><small>{data.round.status}</small></div>
      <div className="tabs round-two-evaluation-tabs">{(['PENDING', 'APPROVED', 'REJECTED'] as Filter[]).map((value) => <button className={filter === value ? 'active' : ''} onClick={() => setFilter(value)} key={value}>{value[0] + value.slice(1).toLowerCase()}<span>{counts[value]}</span></button>)}</div>
      <div className="paper-admin-toolbar"><label><Search /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search team, participant or email" /></label><p>{data.round.status === 'ENDED' ? 'Offline decisions are open.' : 'End Round 2 to enable final decisions.'}</p></div>
      <section className="paper-candidate-list round-two-submission-list">
        {visible.map((candidate) => <article key={candidate.id}>
          <header><div><span>TEAM CODE</span><h2>{candidate.team.code}</h2></div><StatusBadge status={candidate.status.replaceAll('_', ' ')} /></header>
          <div className="paper-team-members">{candidate.team.members.map(({ participant }) => <div key={participant.id}><strong>{participant.name}</strong><span>{participant.email}</span></div>)}</div>
          <footer>{isFinal(candidate.status) ? <p><Check />Final decision recorded</p> : <><button className="button primary" disabled={data.round.status !== 'ENDED'} onClick={() => setDecision({ candidate, value: 'APPROVED' })}><Check />Approve</button><button className="button danger" disabled={data.round.status !== 'ENDED'} onClick={() => setDecision({ candidate, value: 'REJECTED' })}><X />Reject</button></>}</footer>
        </article>)}
        {!visible.length && <EmptyState title={filter === 'PENDING' ? 'NO TEAMS AWAITING REVIEW' : `NO ${filter} TEAMS`} message="Teams appear here automatically after their Round 1 submission is approved." />}
      </section>
    </>}
    <Modal open={decision !== null} title={`${decision?.value === 'APPROVED' ? 'APPROVE' : 'REJECT'} ${decision?.candidate.team.code || 'TEAM'}?`} confirmLabel={decision?.value || 'CONFIRM'} tone={decision?.value === 'REJECTED' ? 'danger' : 'default'} onClose={() => setDecision(null)} onConfirm={confirm}><p>{decision?.value === 'APPROVED' ? 'This offline result qualifies the team for Round 3.' : 'This offline result ends the team’s progression.'}</p></Modal>
  </>;
}
