'use client';

import { useCallback, useEffect, useState } from 'react';

export type ParticipantRoundStatus = 'active' | 'under-review' | 'approved' | 'rejected' | 'locked';
export type RoundNumber = 1 | 2 | 3;

export type RoundOneSubmission = {
  teamCode: string;
  aiTool: string;
  conversationLinks: string[];
  submittedAt: string;
};

export type ParticipantProgress = {
  currentRound: RoundNumber;
  rounds: Record<RoundNumber, ParticipantRoundStatus>;
  roundOneSubmission?: RoundOneSubmission;
};

const STORAGE_KEY = 'prompthon-participant-progress-v1';
const CHANGE_EVENT = 'prompthon-participant-progress-change';

export const initialParticipantProgress: ParticipantProgress = {
  currentRound: 1,
  rounds: { 1: 'active', 2: 'locked', 3: 'locked' },
};

function readProgress(): ParticipantProgress {
  if (typeof window === 'undefined') return initialParticipantProgress;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return initialParticipantProgress;
    const parsed = JSON.parse(stored) as ParticipantProgress & { roundOneSubmission?: RoundOneSubmission & { conversationLink?: string } };
    if (parsed.roundOneSubmission && !parsed.roundOneSubmission.conversationLinks) {
      parsed.roundOneSubmission.conversationLinks = parsed.roundOneSubmission.conversationLink ? [parsed.roundOneSubmission.conversationLink] : [];
    }
    if (parsed.roundOneSubmission && !parsed.roundOneSubmission.teamCode) {
      parsed.roundOneSubmission.teamCode = 'PRM-1042';
    }
    return { ...initialParticipantProgress, ...parsed };
  } catch {
    return initialParticipantProgress;
  }
}

function saveProgress(progress: ParticipantProgress) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
}

export function useParticipantProgress() {
  const [progress, setProgress] = useState<ParticipantProgress>(initialParticipantProgress);

  useEffect(() => {
    const sync = () => setProgress(readProgress());
    sync();
    window.addEventListener('storage', sync);
    window.addEventListener(CHANGE_EVENT, sync);
    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener(CHANGE_EVENT, sync);
    };
  }, []);

  const submitRoundOne = useCallback((submission: Omit<RoundOneSubmission, 'submittedAt'>) => {
    const next: ParticipantProgress = {
      ...readProgress(),
      currentRound: 1,
      rounds: { ...readProgress().rounds, 1: 'under-review', 2: 'locked', 3: 'locked' },
      roundOneSubmission: { ...submission, submittedAt: new Date().toISOString() },
    };
    saveProgress(next);
  }, []);

  const reviewRound = useCallback((round: RoundNumber, decision: 'approved' | 'rejected') => {
    const current = readProgress();
    const nextRound = Math.min(3, round + 1) as RoundNumber;
    const rounds = { ...current.rounds, [round]: decision };
    if (decision === 'approved' && round < 3) rounds[nextRound] = 'active';
    if (decision === 'rejected') {
      if (round < 2) rounds[2] = 'locked';
      rounds[3] = 'locked';
    }
    saveProgress({ ...current, currentRound: decision === 'approved' ? nextRound : round, rounds });
  }, []);

  return { progress, submitRoundOne, reviewRound };
}
