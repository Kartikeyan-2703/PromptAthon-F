'use client';

import { useCallback, useEffect, useState } from 'react';
import type { RoundNumber } from '@/lib/use-participant-progress';

export type EventRoundState = 'Live' | 'Closed' | 'Locked';

export type EventRoundControl = {
  eventLive: boolean;
  activeRound: RoundNumber | null;
  states: Record<RoundNumber, EventRoundState>;
};

export type RoundControlResult = { ok: true; message: string } | { ok: false; message: string };

const STORAGE_KEY = 'prompthon-event-round-control-v1';
const CHANGE_EVENT = 'prompthon-event-round-control-change';

export const initialEventRoundControl: EventRoundControl = {
  eventLive: true,
  activeRound: 1,
  states: { 1: 'Live', 2: 'Locked', 3: 'Locked' },
};

function readControl(): EventRoundControl {
  if (typeof window === 'undefined') return initialEventRoundControl;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return initialEventRoundControl;
    const parsed = JSON.parse(stored) as Partial<EventRoundControl>;
    return {
      ...initialEventRoundControl,
      ...parsed,
      states: { ...initialEventRoundControl.states, ...parsed.states },
    };
  } catch {
    return initialEventRoundControl;
  }
}

function saveControl(control: EventRoundControl) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(control));
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
}

export function useEventRoundControl() {
  const [control, setControl] = useState<EventRoundControl>(initialEventRoundControl);

  useEffect(() => {
    const sync = () => setControl(readControl());
    sync();
    window.addEventListener('storage', sync);
    window.addEventListener(CHANGE_EVENT, sync);
    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener(CHANGE_EVENT, sync);
    };
  }, []);

  const startRound = useCallback((round: RoundNumber): RoundControlResult => {
    const current = readControl();
    if (current.states[round] === 'Live') return { ok: false, message: `Round 0${round} is already live.` };
    if (current.states[round] === 'Closed') return { ok: false, message: `Round 0${round} has ended and cannot be restarted.` };
    if (current.activeRound && current.activeRound !== round) {
      return { ok: false, message: `End Round 0${current.activeRound} before starting Round 0${round}.` };
    }
    if (round > 1 && current.states[(round - 1) as RoundNumber] !== 'Closed') {
      return { ok: false, message: `End Round 0${round - 1} before starting Round 0${round}.` };
    }
    const states = { ...current.states };
    states[round] = 'Live';
    saveControl({ eventLive: true, activeRound: round, states });
    return { ok: true, message: `Round 0${round} is now live.` };
  }, []);

  const endRound = useCallback((round: RoundNumber): RoundControlResult => {
    const current = readControl();
    if (current.states[round] !== 'Live' || current.activeRound !== round) {
      return { ok: false, message: `Only the active live round can be ended.` };
    }
    saveControl({
      ...current,
      activeRound: current.activeRound === round ? null : current.activeRound,
      states: { ...current.states, [round]: 'Closed' },
    });
    return { ok: true, message: `Round 0${round} has ended. Submissions are ready for review.` };
  }, []);

  const lockRound = useCallback((round: RoundNumber): RoundControlResult => {
    const current = readControl();
    if (current.states[round] === 'Closed') return { ok: false, message: `An ended round cannot be locked.` };
    saveControl({
      ...current,
      activeRound: current.activeRound === round ? null : current.activeRound,
      states: { ...current.states, [round]: 'Locked' },
    });
    return { ok: true, message: `Round 0${round} is locked.` };
  }, []);

  const setEventLive = useCallback((eventLive: boolean) => {
    const current = readControl();
    const states = { ...current.states };
    if (!eventLive && current.activeRound) states[current.activeRound] = 'Closed';
    saveControl({ ...current, eventLive, activeRound: eventLive ? current.activeRound : null, states });
  }, []);

  return { control, startRound, endRound, lockRound, setEventLive };
}
