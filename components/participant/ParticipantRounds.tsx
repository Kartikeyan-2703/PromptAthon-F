/* eslint-disable react-hooks/set-state-in-effect -- route state is synchronized with the backend */
'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import { Check, ExternalLink, LoaderCircle, Lock, ShieldCheck, X } from 'lucide-react';
import { PortalLayout } from '@/components/layout/PortalLayout';
import { PageIntro, StatusBadge } from '@/components/ui';
import { ApiClientError, participantApi, ParticipantRoundDetail, ParticipantRoundSummary, RoundAccessStatus } from '@/services/api-client';

type RoundNumber = 1 | 2 | 3;
const label = (status: RoundAccessStatus) => status.replaceAll('_', ' ').replace(/\b\w/g, (character) => character.toUpperCase());

export function ParticipantRoundsFlow({ initialRound = 1 }: { initialRound?: RoundNumber }) {
  const [selected, setSelected] = useState<RoundNumber>(initialRound);
  const [rounds, setRounds] = useState<ParticipantRoundSummary[]>([]);
  const [detail, setDetail] = useState<ParticipantRoundDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const load = useCallback(async () => {
    try {
      const list = await participantApi.getRounds();
      const current = await participantApi.getRound(selected);
      setRounds(list); setDetail(current); setError('');
    } catch (reason) {
      setError(reason instanceof ApiClientError && reason.status === 401 ? 'Participant login is required.' : reason instanceof Error ? reason.message : 'Rounds could not be loaded.');
    } finally { setLoading(false); }
  }, [selected]);
  useEffect(() => { void load(); }, [load]);

  return <PortalLayout><div className="portal-content participant-rounds-flow">
    <PageIntro eyebrow="PARTICIPANT PORTAL / ROUNDS" title="Competition rounds." copy="Questions, eligibility and submissions are loaded from the event database."/>
    <div className="participant-round-tabs" role="tablist">{rounds.map((round) => <button type="button" role="tab" aria-selected={selected === round.number} className={`${selected === round.number ? 'selected' : ''} ${round.contentAvailable ? '' : 'is-locked'}`} onClick={() => { setLoading(true); setSelected(round.number as RoundNumber); }} key={round.id}><span>0{round.number}</span><strong>ROUND 0{round.number}</strong><small>{!round.contentAvailable && <Lock size={11}/>} {round.roundStatus === 'LIVE' ? label(round.accessStatus) : round.roundStatus}</small></button>)}</div>
    {error ? <div className="portal-error"><X size={15}/>{error}</div> : loading || !detail ? <div className="portal-loading"><LoaderCircle className="spin"/>Loading round access…</div> : <RoundWorkspace key={`${detail.id}-${detail.submission?.version || 0}`} round={detail} reload={load}/>} 
  </div></PortalLayout>;
}

function RoundWorkspace({ round, reload }: { round: ParticipantRoundDetail; reload: () => Promise<void> }) {
  const existing = new Map(round.submission?.answers?.map((answer) => [answer.questionId, answer]) || []);
  const [aiTool, setAiTool] = useState(round.submission?.aiTool || 'Designated AI');
  const [answers, setAnswers] = useState(() => round.questions.map((question) => ({ questionId: question.id, conversationUrl: existing.get(question.id)?.conversationUrl || '', promptText: existing.get(question.id)?.promptText || '' })));
  const [roundThreeLink, setRoundThreeLink] = useState(round.submission?.responseConversationUrl || '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  if (round.number === 2 && round.roundStatus === 'LIVE') return <section className="paper-test-workspace"><header><div><p className="eyebrow">ROUND 02 / OFFLINE ASSESSMENT</p><h2>{round.title}</h2><p>This round is conducted as a supervised paper-and-pen test. No questions or online submission controls are available in the participant portal.</p></div><StatusBadge status={round.contentAvailable ? label(round.accessStatus) : 'Rules Available'}/></header><div className="paper-test-notice"><span>OFFLINE TEST PROTOCOL</span><strong>Read the rules. Complete the answer paper at the venue.</strong><p>The administrator will review your physical answer paper after Round 2 ends and record the qualification decision.</p></div><section className="paper-test-rulebook"><header><span>RULES &amp; REGULATIONS</span><strong>{String(round.rules.length).padStart(2,'0')}</strong></header><ol>{round.rules.map(rule=><li key={rule.id}><span>{String(rule.position).padStart(2,'0')}</span><p>{rule.text}</p></li>)}</ol></section></section>;
  if (!round.contentAvailable) return <section className="locked-round-rules"><header><div className="lock-emblem"><Lock/></div><div><p className="eyebrow">ROUND 0{round.number} / ACCESS GATE</p><h2>{round.title}</h2><p>{round.accessStatus === 'REJECTED' ? 'This team did not qualify for this round.' : 'Rules, questions and submission controls are protected until this round is live and your team is eligible.'}</p></div><StatusBadge status={label(round.accessStatus)}/></header></section>;
  if (round.submission && round.submission.status !== 'DRAFT') return <section className="round-one-result"><div className="result-icon"><Check/></div><p className="eyebrow">ROUND 0{round.number} / {round.submission.status.replaceAll('_', ' ')}</p><h2>Submission recorded.</h2><p>The persisted evidence package is read-only and available to the administrator review queue.</p>{round.submission.responseConversationUrl&&<a href={round.submission.responseConversationUrl} target="_blank" rel="noreferrer">Round 3 conversation <ExternalLink size={12}/></a>}{round.submission.answers?.map((answer, index) => answer.conversationUrl && <a href={answer.conversationUrl} target="_blank" rel="noreferrer" key={answer.questionId}>Problem {index + 1} conversation <ExternalLink size={12}/></a>)}</section>;

  async function submit(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError('');
    try {
      if (round.number === 1) {
        if (round.questions.length !== 4 || answers.length !== 4) {
          throw new Error('Round 1 requires all four assigned problems. Refresh the page and try again.');
        }
        const links = answers.map((answer) => answer.conversationUrl.trim());
        if (links.some((link) => !link)) throw new Error('Add one conversation link for each of the four problems.');
        if (new Set(links).size !== links.length) throw new Error('Each problem must use a different conversation link. Duplicate links are not allowed.');
        if (answers.some((answer) => !answer.promptText.trim())) throw new Error('Paste the final prompt for each of the four problems.');
      }
      if (round.number === 3 && !roundThreeLink.trim()) throw new Error('Add the chat conversation link for Round 3.');
      const payloadAnswers = round.number === 3 ? [] : answers.map((answer) => ({ ...answer, conversationUrl: answer.conversationUrl.trim() || undefined, promptText: answer.promptText.trim() }));
      const draftPayload = { aiTool: round.number === 3 ? undefined : aiTool, responseConversationUrl: round.number === 3 ? roundThreeLink.trim() : undefined, version: round.submission?.version, answers: payloadAnswers };
      try {
        await participantApi.saveDraft(round.number, draftPayload);
      } catch (reason) {
        if (!(reason instanceof ApiClientError) || (reason.status < 500 && reason.status !== 409)) throw reason;
        // A production request can finish in PostgreSQL even when its response is
        // interrupted. Retrying without the stale version safely upserts the same
        // team/round draft and never creates a duplicate submission.
        await participantApi.saveDraft(round.number, { ...draftPayload, version: undefined });
      }
      try {
        await participantApi.submit(round.number);
      } catch (reason) {
        if (!(reason instanceof ApiClientError) || (reason.status < 500 && reason.status !== 409)) throw reason;
        const current = await participantApi.getRound(round.number);
        if (!current.submission || current.submission.status === 'DRAFT') await participantApi.submit(round.number);
      }
      await reload();
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Submission failed.'); setBusy(false); }
  }

  return <section className="round-one-workspace"><header><div><p className="eyebrow">ROUND 0{round.number} / SUBMISSION FORM</p><h2>{round.title}</h2><p>{round.description}</p></div><StatusBadge status="Round Active"/></header><form className="round-one-form" onSubmit={submit}>
    {round.number !== 3 && <label className="portal-field"><span>AI TOOL USED</span><input value={aiTool} onChange={(event) => setAiTool(event.target.value)} required/></label>}
    <section className="problem-conversation-set"><header><div><span>{round.number === 3 ? 'ROUND 03 RESPONSE' : 'ASSIGNED QUESTION SET'}</span><strong>{round.number === 3 ? 'Offline board question · one conversation link' : `${round.questions.length} database-assigned problem${round.questions.length === 1 ? '' : 's'}`}</strong></div></header><div className="problem-conversation-grid">{round.number === 3 ? <article className="problem-conversation-card round-three-response"><span>RESPONSE ONLY</span><strong>Submit your completed chat conversation</strong><p>Read the question displayed on the offline board, complete the task, then paste the public conversation link below.</p><label>CHAT CONVERSATION LINK<input type="url" required value={roundThreeLink} onChange={(event) => setRoundThreeLink(event.target.value)} placeholder="https://..."/></label></article> : round.questions.map((question, index) => <article className="problem-conversation-card" key={question.id}><span>PROBLEM {String(question.position).padStart(2, '0')}</span><strong>{question.title}</strong><p>{question.body}</p><label>CONVERSATION LINK<input type="url" required value={answers[index]?.conversationUrl || ''} onChange={(event) => setAnswers((current) => current.map((answer, position) => position === index ? { ...answer, conversationUrl: event.target.value } : answer))} placeholder="https://..."/></label>{round.number === 1 && <label className="last-prompt-field">LAST PROMPT<textarea required rows={7} value={answers[index]?.promptText || ''} onChange={(event) => setAnswers((current) => current.map((answer, position) => position === index ? { ...answer, promptText: event.target.value } : answer))} placeholder="Paste the exact final prompt used for this problem"/><small>Formatting and line breaks will be preserved for admin review.</small></label>}</article>)}</div></section>
    {error && <p className="form-error">{error}</p>}<footer><p><ShieldCheck size={15}/>{round.number === 3 ? 'The conversation link is stored securely and becomes read-only after submission.' : 'Submission evidence is stored securely and becomes read-only.'}</p><button className="button primary" disabled={busy}>{busy ? 'SUBMITTING…' : `SUBMIT ROUND 0${round.number} →`}</button></footer>
  </form></section>;
}
