import { auditLog, currentTeam, rounds, submissions, teams } from '@/lib/mock-data';

const delay = (ms = 450) => new Promise((resolve) => setTimeout(resolve, ms));

export const authService = {
  async participantLogin(email: string) { await delay(); return { ok: email.includes('@'), team: currentTeam }; },
  async adminLogin(email: string, password: string) { await delay(); return { ok: Boolean(email && password), role: 'admin' }; },
};

export const teamService = { async getCurrent() { await delay(250); return currentTeam; }, async list() { await delay(250); return teams; } };
export const roundService = { async list() { await delay(250); return rounds; }, async setStatus(id: number, status: string) { await delay(); return { id, status }; } };
export const submissionService = { async list() { await delay(250); return submissions; }, async submit(round: number) { await delay(700); return { ok: true, round, submittedAt: new Date().toISOString() }; } };
export const adminService = { async audit() { await delay(250); return auditLog; }, async importParticipants() { await delay(800); return { total: 150, valid: 146, duplicate: 2, invalid: 2 }; } };
