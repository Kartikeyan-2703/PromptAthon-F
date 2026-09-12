const configuredApiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1').replace(/\/$/, '');
// In production, send API traffic through this Worker origin. This makes the
// HttpOnly session cookie first-party and reliable on Safari/iOS and browsers
// that block third-party cookies. Local development continues to use :4000.
const API_BASE_URL = typeof window !== 'undefined' && !/^localhost$|^127\.0\.0\.1$/.test(window.location.hostname)
  ? '/api/v1'
  : configuredApiUrl;

type ErrorEnvelope = { error?: { code?: string; message?: string; requestId?: string } };

export class ApiClientError extends Error {
  constructor(message: string, public readonly status: number, public readonly code = 'REQUEST_FAILED') {
    super(message);
  }
}

async function errorFromResponse(response: Response) {
  let payload: ErrorEnvelope | undefined;
  try { payload = await response.json() as ErrorEnvelope; } catch { payload = undefined; }
  const error = new ApiClientError(
    payload?.error?.message || `The server returned ${response.status}.`,
    response.status,
    payload?.error?.code,
  );
  if (response.status === 401 && error.code === 'SESSION_REPLACED' && typeof window !== 'undefined') {
    if (window.location.pathname !== '/login') window.location.replace('/login?reason=session-replaced');
  }
  if (response.status === 403 && error.code === 'TEAM_DETAILS_REQUIRED' && typeof window !== 'undefined') {
    if (window.location.pathname !== '/team-setup') window.location.replace('/team-setup');
  }
  return error;
}

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    credentials: 'include',
    headers: { 'content-type': 'application/json', ...init?.headers },
  });
  if (!response.ok) throw await errorFromResponse(response);
  return ((await response.json()) as { data: T }).data;
}

async function requestForm<T>(path: string, body: FormData): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, { method: 'POST', body, credentials: 'include' });
  if (!response.ok) throw await errorFromResponse(response);
  return ((await response.json()) as { data: T }).data;
}

export type SubmissionReviewStatus = 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
export type SubmissionState = 'DRAFT' | SubmissionReviewStatus;
export type AdminSubmissionListItem = {
  id: string; status: SubmissionReviewStatus; teamCodeSnapshot: string | null; aiTool: string | null;
  submittedAt: string | null; version: number; hasSubmission?: boolean;
  team: { id: string; code: string };
  round: { id: string; number: number; title: string };
  evaluation: { decision: 'APPROVED' | 'REJECTED'; score: string | number | null; feedback: string | null } | null;
  _count: { answers: number; artifacts: number };
};
export type AdminSubmissionPage = {
  round: { id: string; number: number; title: string; status: 'LOCKED' | 'LIVE' | 'ENDED' };
  counts: Record<SubmissionReviewStatus, number>;
  items: AdminSubmissionListItem[];
  page: number; pageSize: number; total: number; pageCount: number;
};
export type AdminSubmissionDetail = AdminSubmissionListItem & {
  team: { id: string; code: string; members: { participant: { id: string; name: string; email: string } }[] };
  round: { id: string; number: number; title: string; description: string; status: 'LOCKED' | 'LIVE' | 'ENDED' };
  responseConversationUrl: string | null;
  answers: { id: string; conversationUrl: string | null; promptText: string | null; responseText: string | null; notes: string | null; question: { id: string; position: number; code: string; title: string; body: string } }[];
  artifacts: { id: string; kind: string; originalName: string | null; storageBucket: string; storagePath: string; mimeType: string }[];
  evaluation: ({ decision: 'APPROVED' | 'REJECTED'; score: string | number | null; feedback: string | null; evaluatedAt: string; evaluator: { id: string; displayName: string } } | null);
};

export type RoundAccessStatus = 'LOCKED'|'ELIGIBLE'|'IN_PROGRESS'|'SUBMITTED'|'APPROVED'|'REJECTED';
export type RoundTwoEvaluationData = {round:{id:string;number:number;title:string;status:'LOCKED'|'LIVE'|'ENDED'};items:Array<{id:string;teamId:string;roundId:string;status:RoundAccessStatus;version:number;decidedAt:string|null;team:{id:string;code:string;members:Array<{participant:{id:string;name:string;email:string}}>} }>};
export type ParticipantRoundSummary = { id:string; number:number; kind:string; title:string; description:string; roundStatus:'LOCKED'|'LIVE'|'ENDED'; accessStatus:RoundAccessStatus; contentAvailable:boolean; submission:{id:string;status:SubmissionState;version:number;submittedAt:string|null;evaluation?:{decision:'APPROVED'|'REJECTED'}|null}|null };
export type ParticipantOverview = { participant:{id:string;name:string;email:string;status:string};team:{id:string;code:string;status:string;members:{id:string;name:string;email:string}[]};event:{id:string;name:string;status:string;startsAt:string;endsAt:string;venue:string|null};rounds:ParticipantRoundSummary[] };
export type ParticipantRoundDetail = ParticipantRoundSummary & { rules:{id:string;position:number;text:string}[];questions:{id:string;code:string;position:number;title:string;body:string;isPlaceholder:boolean}[];submission:({id:string;status:SubmissionState;version:number;aiTool:string|null;responseConversationUrl:string|null;submittedAt:string|null;answers?:{questionId:string;conversationUrl:string|null;promptText:string|null;responseText:string|null;notes:string|null}[]}|null) };
export type TeamOnboarding = { required:boolean;teamCode:string;completedAt:string|null;members:Array<{id:string;position:number;name:string}> };
export type CertificateCenter = { eligible:boolean;eliminatedRound:number|null;status:'NOT_ELIGIBLE'|'GENERATING'|'READY'|'FAILED';members:Array<{id:string;position:number;name:string}>;certificates:Array<{id:string;memberName:string;certificateCode:string;eliminatedRound:number;status:'ELIGIBLE'|'GENERATING'|'READY'|'FAILED';fileName:string;generatedAt:string|null}> };

export const adminApi = {
  login(email: string, password: string) {
    return requestJson<{ kind: 'admin'; adminId: string; email: string }>('/auth/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  getSession() {
    return requestJson<
      | { kind: 'admin'; adminId: string; email: string }
      | { kind: 'participant'; participantId: string; teamId: string; email: string }
      | null
    >('/auth/me');
  },

  listSubmissions(roundNumber: number, status: SubmissionReviewStatus, page = 1, pageSize = 12, search = '') {
    const query = new URLSearchParams({ roundNumber: String(roundNumber), status, page: String(page), pageSize: String(pageSize) });
    if (search.trim()) query.set('search', search.trim());
    return requestJson<AdminSubmissionPage>(`/admin/submissions?${query}`);
  },

  getSubmission(id: string) {
    return requestJson<AdminSubmissionDetail>(`/admin/submissions/${encodeURIComponent(id)}`);
  },

  markSubmissionUnderReview(id: string, expectedVersion: number) {
    return requestJson<{ id: string; status: SubmissionReviewStatus; version: number }>(`/admin/submissions/${encodeURIComponent(id)}/under-review`, {
      method: 'POST', body: JSON.stringify({ expectedVersion }),
    });
  },

  reviewSubmission(id: string, decision: 'APPROVED' | 'REJECTED', expectedVersion: number) {
    return requestJson<{ id: string; decision: 'APPROVED' | 'REJECTED' }>(`/admin/submissions/${encodeURIComponent(id)}/review`, {
      method: 'POST', body: JSON.stringify({ decision, expectedVersion }),
    });
  },

  getDashboard(){return requestJson<{event:{id:string;name:string;status:string}|null;metrics:{admitted:number;active:number;submitted:number;approved:number;pending:number}|null;rounds:Array<{id:string;number:number;title:string;description:string;status:'LOCKED'|'LIVE'|'ENDED';version:number;startsAt:string|null;endsAt:string|null;_count:{submissions:number;accesses:number}}>}>('/admin/dashboard')},
  getRounds(){return requestJson<Array<{id:string;number:number;title:string;description:string;status:'LOCKED'|'LIVE'|'ENDED';version:number;startsAt:string|null;endsAt:string|null;_count:{questions:number;accesses:number;submissions:number}}>>('/admin/rounds')},
  getRoundTwoEvaluations(){return requestJson<RoundTwoEvaluationData>('/admin/submissions/round-2/offline-evaluations')},
  reviewRoundTwoEvaluation(teamId:string,decision:'APPROVED'|'REJECTED',expectedVersion:number){return requestJson<{id:string;status:RoundAccessStatus;version:number;decidedAt:string|null}>(`/admin/submissions/round-2/offline-evaluations/${encodeURIComponent(teamId)}/review`,{method:'POST',body:JSON.stringify({decision,expectedVersion})})},
  getRoundQuestions(roundId:string){return requestJson<Array<{id:string;roundId:string;code:string;position:number;title:string;body:string;status:'DRAFT'|'PUBLISHED'|'ARCHIVED';isPlaceholder:boolean}>>(`/admin/rounds/${encodeURIComponent(roundId)}/questions`)},
  saveRoundQuestions(roundId:string,questions:Array<{id?:string;code:string;position:number;title:string;body:string;status:'DRAFT'|'PUBLISHED'|'ARCHIVED';isPlaceholder:boolean}>){return requestJson<Array<{id:string;roundId:string;code:string;position:number;title:string;body:string;status:'DRAFT'|'PUBLISHED'|'ARCHIVED';isPlaceholder:boolean}>>(`/admin/rounds/${encodeURIComponent(roundId)}/questions`,{method:'PUT',body:JSON.stringify({questions})})},
  controlRound(id:string,action:'start'|'end'|'lock',expectedVersion:number){return requestJson<{id:string;status:'LOCKED'|'LIVE'|'ENDED';version:number}>(`/admin/rounds/${id}/${action}`,{method:'POST',body:JSON.stringify({expectedVersion})})},
  listParticipants(page=1,pageSize=25,search=''){const q=new URLSearchParams({page:String(page),pageSize:String(pageSize)});if(search)q.set('search',search);return requestJson<{items:Array<{id:string;name:string;email:string;status:string;membership:{team:{id:string;code:string}}|null}>;page:number;pageCount:number;total:number}>(`/admin/participants?${q}`)},
  suggestManualTeamCode(eventId:string){return requestJson<{teamCode:string}>(`/admin/participants/manual/next-team-code?eventId=${encodeURIComponent(eventId)}`)},
  createManualParticipant(input:{eventId:string;name:string;email:string;teamCode?:string}){return requestJson<{id:string;name:string;email:string;status:string;team:{id:string;code:string}}>('/admin/participants/manual',{method:'POST',body:JSON.stringify(input)})},
  getParticipant(id:string){return requestJson<{id:string;name:string;email:string;status:string;membership:{team:{id:string;code:string;members:Array<{participant:{id:string;name:string;email:string;status:string}}>;accesses:Array<{status:RoundAccessStatus;round:{id:string;number:number;title:string;status:string}}> ;submissions:Array<AdminSubmissionDetail>}}|null}>(`/admin/participants/${encodeURIComponent(id)}`)},
  getParticipantCertificates(id:string){return requestJson<CertificateCenter>(`/admin/participants/${encodeURIComponent(id)}/certificates`)},
  retryParticipantCertificates(id:string){return requestJson<CertificateCenter>(`/admin/participants/${encodeURIComponent(id)}/certificates/retry`,{method:'POST',body:JSON.stringify({})})},
  participantCertificateZipUrl(id:string){return `${API_BASE_URL}/admin/participants/${encodeURIComponent(id)}/certificates/download-all`},
  listAuditLogs(action=''){const query=new URLSearchParams({limit:'50'});if(action)query.set('action',action);return requestJson<{items:Array<{id:string;createdAt:string;action:string;entityType:string;entityId:string|null;metadata:Record<string,unknown>|null;actorAdmin:{displayName:string;email:string}|null;actorParticipant:{name:string;email:string}|null}>;nextCursor:string|null}>(`/admin/audit-logs?${query}`)},
  previewImport(eventId:string,file:File){const body=new FormData();body.set('eventId',eventId);body.set('file',file);return requestForm<{id:string;version:number;totalRows:number;validRows:number;invalidRows:number;status:string;rows:Array<{id:string;rowNumber:number;name:string|null;email:string|null;teamCode:string|null;status:string;errorMessage:string|null}>}>('/admin/imports/preview',body)},
  commitImport(id:string,expectedVersion:number){return requestJson<{id:string;status:string;importedRows:number;duplicateRows:number;invalidRows:number}>(`/admin/imports/${id}/commit`,{method:'POST',body:JSON.stringify({expectedVersion})})},

  async downloadRoundParticipationReport() {
    const response = await fetch(`${API_BASE_URL}/admin/reports/round-participation.xlsx`, {
      credentials: 'include',
      headers: { accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
    });
    if (!response.ok) throw await errorFromResponse(response);

    const blob = await response.blob();
    const disposition = response.headers.get('content-disposition') || '';
    const filename = disposition.match(/filename="?([^";]+)"?/i)?.[1] || 'prompthon-round-participation-report.xlsx';
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    return filename;
  },
};

export const participantApi = {
  verifyEmail(email:string){return requestJson<{eligible:boolean;next:'TEAM_CODE'|null}>('/auth/participant/verify-email',{method:'POST',body:JSON.stringify({email})})},
  login(email:string,teamCode:string){return requestJson<{kind:'participant';participantId:string;teamId:string;email:string;teamDetailsRequired:boolean}>('/auth/participant/login',{method:'POST',body:JSON.stringify({email,teamCode})})},
  async logout(){const response=await fetch(`${API_BASE_URL}/auth/logout`,{method:'POST',credentials:'include',headers:{'content-type':'application/json'},body:JSON.stringify({})});if(!response.ok)throw await errorFromResponse(response)},
  getOnboarding(){return requestJson<TeamOnboarding>('/participant/onboarding')},
  completeOnboarding(members:string[]){return requestJson<TeamOnboarding>('/participant/onboarding',{method:'POST',body:JSON.stringify({members})})},
  getOverview(){return requestJson<ParticipantOverview>('/participant/overview')},
  getRounds(){return requestJson<ParticipantRoundSummary[]>('/participant/rounds')},
  getRound(number:number){return requestJson<ParticipantRoundDetail>(`/participant/rounds/${number}`)},
  saveDraft(number:number,input:{aiTool?:string;responseConversationUrl?:string;answers:Array<{questionId:string;conversationUrl?:string;promptText?:string;responseText?:string;notes?:string}>;version?:number}){return requestJson<{id:string;version:number;status:SubmissionReviewStatus}>(`/participant/rounds/${number}/submission`,{method:'PUT',body:JSON.stringify(input)})},
  submit(number:number){return requestJson<{id:string;version:number;status:SubmissionReviewStatus}>(`/participant/rounds/${number}/submission/submit`,{method:'POST',body:JSON.stringify({})})},
  artifactUrl(id:string){return `${API_BASE_URL}/participant/artifacts/${encodeURIComponent(id)}`},
  getLeaderboard(){return requestJson<Array<{teamId:string;teamCode:string;score:number;rounds:number}>>('/participant/leaderboard')},
  getCertificates(){return requestJson<CertificateCenter>('/participant/certificates')},
  certificateUrl(id:string){return `${API_BASE_URL}/participant/certificates/${encodeURIComponent(id)}/download`},
  certificateZipUrl(){return `${API_BASE_URL}/participant/certificates/download-all`},
};
