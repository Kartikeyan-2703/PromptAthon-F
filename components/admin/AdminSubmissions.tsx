/* eslint-disable react-hooks/set-state-in-effect -- route data is synchronized with the backend */
'use client';

import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, LoaderCircle, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { PortalLayout } from '@/components/layout/PortalLayout';
import { EmptyState, PageIntro, StatusBadge } from '@/components/ui';
import { adminApi, AdminSubmissionPage, ApiClientError, SubmissionReviewStatus } from '@/services/api-client';
import { RoundTwoEvaluationQueue } from '@/components/admin/RoundTwoEvaluationQueue';

const statuses: { value: SubmissionReviewStatus; label: string }[] = [
  { value: 'SUBMITTED', label: 'Pending' },
  { value: 'UNDER_REVIEW', label: 'Under Review' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'REJECTED', label: 'Rejected' },
];
const displayStatus = (status: SubmissionReviewStatus) => statuses.find((item) => item.value === status)?.label || status;
const time = (value: string | null) => value ? new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Kolkata' }).format(new Date(value)) : 'Not recorded';

export function AdminSubmissions() {
  const [round, setRound] = useState(1);
  const [status, setStatus] = useState<SubmissionReviewStatus>('SUBMITTED');
  const [page, setPage] = useState(1);
  const [data, setData] = useState<AdminSubmissionPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (round === 2) { setLoading(false); return; }
    let active = true;
    setLoading(true);
    adminApi.listSubmissions(round, status, page).then((result) => { if (active) setData(result); }).catch((reason) => {
      setError(reason instanceof ApiClientError && reason.status === 401 ? 'Administrator login is required.' : reason instanceof Error ? reason.message : 'Submissions unavailable.');
    }).finally(() => setLoading(false));
    return () => { active = false; };
  }, [round, status, page]);

  function changeRound(value: number) { setError(''); setRound(value); setPage(1); }
  function changeStatus(value: SubmissionReviewStatus) { setError(''); setStatus(value); setPage(1); }

  return <PortalLayout admin><div className="portal-content">
    <PageIntro eyebrow="SUBMISSION REVIEW" title="Evaluation queue." copy={round === 2 ? 'Round 2 teams are evaluated offline; no participant response is required.' : 'Review complete participant evidence packages and record qualification decisions.'} />
    <div className="review-round-tabs">{[1, 2, 3].map((number) => <button className={round === number ? 'active' : ''} onClick={() => changeRound(number)} key={number}><span>0{number}</span>Round {number}</button>)}</div>
    {round === 2 ? <RoundTwoEvaluationQueue /> : <>
      <div className="review-scope"><span>ACTIVE DATASET</span><strong>ROUND 0{round}{data ? ` / ${data.round.title.toUpperCase()}` : ''}</strong><small>{data?.round.status || 'LOADING'}</small></div>
      <div className="tabs">{statuses.map((item) => <button className={status === item.value ? 'active' : ''} onClick={() => changeStatus(item.value)} key={item.value}>{item.label}<span>{data?.counts[item.value] ?? '—'}</span></button>)}</div>
      {error ? <div className="portal-error"><X size={15} />{error}</div> : loading ? <div className="portal-loading"><LoaderCircle className="spin" />Loading database records…</div> : <>
        <section className="submission-admin-list">{data?.items.map((item) => <article key={item.id}><div><StatusBadge status={displayStatus(item.status)} /><span>{item.id.slice(0, 8)}</span></div><h2>{item.team.code}</h2><dl><div><dt>ROUND</dt><dd>Round 0{item.round.number}</dd></div><div><dt>SUBMITTED</dt><dd>{time(item.submittedAt)}</dd></div><div><dt>EVIDENCE</dt><dd>{item._count.answers} answers</dd></div></dl><Link className="button secondary" href={`/admin/submissions/${item.id}`}>Review <ArrowRight /></Link></article>)}{!data?.items.length && <EmptyState title="NO SUBMISSIONS" message="No submitted evidence matches this round and status." />}</section>
        {(data?.pageCount || 0) > 1 && <div className="pagination"><span>PAGE {page} OF {data?.pageCount}</span><div><button disabled={page === 1} onClick={() => setPage((value) => value - 1)}><ChevronLeft /></button><button disabled={page === data?.pageCount} onClick={() => setPage((value) => value + 1)}><ChevronRight /></button></div></div>}
      </>}
    </>}
  </div></PortalLayout>;
}
