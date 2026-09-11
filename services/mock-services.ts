import { auditLog, currentTeam, rounds, submissions, teams } from '@/lib/mock-data';
import { adminApi } from '@/services/api-client';

const delay = (ms = 450) => new Promise((resolve) => setTimeout(resolve, ms));

const admittedParticipants = new Set([
  'team.alpha@example.com',
  'aarav.raman@example.com',
  'diya.krishnan@example.com',
  'rohan.iyer@example.com',
  'nivetha.raj@example.com',
  'aditya.kumar@example.com',
  'harini.prasad@example.com',
]);

const participantTeamCodes = new Map([
  ['team.alpha@example.com', 'PRM-1042'],
  ['aarav.raman@example.com', 'PRM-1042'],
  ['diya.krishnan@example.com', 'PRM-1042'],
  ['rohan.iyer@example.com', 'PRM-1042'],
  ['nivetha.raj@example.com', 'PRM-1043'],
  ['aditya.kumar@example.com', 'PRM-1043'],
  ['harini.prasad@example.com', 'PRM-1044'],
]);

const normalizeTeamCode = (teamCode: string) => teamCode.trim().toUpperCase().replaceAll(' ', '');

export const authService = {
  async verifyParticipantEmail(email: string) {
    await delay();
    const normalizedEmail = email.trim().toLowerCase();
    return { ok: admittedParticipants.has(normalizedEmail), email: normalizedEmail };
  },
  async participantLogin(email: string, teamCode: string) {
    await delay();
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedTeamCode = normalizeTeamCode(teamCode);
    return {
      ok: admittedParticipants.has(normalizedEmail) && participantTeamCodes.get(normalizedEmail) === normalizedTeamCode,
      team: { ...currentTeam, id: normalizedTeamCode, name: normalizedTeamCode },
      participant: { email: normalizedEmail, teamCode: normalizedTeamCode },
    };
  },
  async adminLogin(email: string, password: string) {
    try {
      await adminApi.login(email, password);
      return { ok: true, role: 'admin' as const };
    } catch {
      return { ok: false, role: 'admin' as const };
    }
  },
};

export const teamService = { async getCurrent() { await delay(250); return currentTeam; }, async list() { await delay(250); return teams; } };
export const roundService = { async list() { await delay(250); return rounds; }, async setStatus(id: number, status: string) { await delay(); return { id, status }; } };
export const submissionService = { async list() { await delay(250); return submissions; }, async submit(round: number) { await delay(700); return { ok: true, round, submittedAt: new Date().toISOString() }; } };
export const adminService = { async audit() { await delay(250); return auditLog; }, async importParticipants() { await delay(800); return { total: 150, valid: 146, duplicate: 2, invalid: 2 }; } };
