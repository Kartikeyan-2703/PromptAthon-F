export type RoundStatus = 'completed' | 'live' | 'locked' | 'closed';
export type TeamStatus = 'Approved' | 'Pending' | 'Rejected' | 'Submitted' | 'Active' | 'Under Review';

export const eventDetails = {
  name: 'PROMPTHON 2026',
  subtitle: 'AI Prompt Engineering Hackathon',
  date: '12 September 2026',
  shortDate: '12 SEP 2026',
  time: '9:00 AM — 4:00 PM',
  teamSize: '1—3 members',
  fee: '₹100',
  duration: '5 hours',
  audience: 'Grades 9—12',
  venue: 'Easwari Engineering College',
};

export const rounds = [
  { id: 1, code: '01', title: 'VAGUE → PRECISE', prompt: 'What information does AI need?', description: 'Given an intentionally vague case, discover what information is missing and construct a prompt that guides AI toward a complete and useful solution.', skills: ['Information Discovery', 'Prompt Formulation', 'Completeness', 'Efficiency'], evaluation: 'Fewer attempts + completeness + usefulness', status: 'closed' as RoundStatus, start: '09:30 AM', end: '11:00 AM', participants: 124, submissions: 118, approved: 92, pending: 0 },
  { id: 2, code: '02', title: 'OUTPUT → PROMPT', prompt: 'Can you reconstruct the hidden instruction?', description: 'Study an AI-generated response and reconstruct the hidden instructions that could have produced it.', skills: ['Prompt Analysis', 'Reasoning', 'Structure Detection', 'Constraint Identification'], evaluation: 'Prompt accuracy + output similarity', status: 'live' as RoundStatus, start: '11:30 AM', end: '01:30 PM', participants: 92, submissions: 74, approved: 51, pending: 23 },
  { id: 3, code: '03', title: 'IMAGE → PROMPT', prompt: 'Can language rebuild a visual system?', description: 'Study a reference image and translate its objects, relationships, composition and visual details into a precise image-generation prompt.', skills: ['Visual Analysis', 'Spatial Reasoning', 'Image Prompting', 'Composition'], evaluation: 'Visual similarity + prompt quality', status: 'locked' as RoundStatus, start: '02:00 PM', end: '04:00 PM', participants: 0, submissions: 0, approved: 0, pending: 0 },
];

export const currentTeam = {
  id: 'PRM-1042',
  slug: 'team-alpha',
  name: 'Team Alpha',
  status: 'Active' as TeamStatus,
  currentRound: 2,
  members: [
    { name: 'Aarav Raman', email: 'aarav.raman@example.com', role: 'Team Lead', college: 'Greenfield Higher Secondary School', department: 'Computer Science', year: 'Grade 12' },
    { name: 'Diya Krishnan', email: 'diya.krishnan@example.com', role: 'Prompt Strategist', college: 'Greenfield Higher Secondary School', department: 'Computer Science', year: 'Grade 11' },
    { name: 'Rohan Iyer', email: 'rohan.iyer@example.com', role: 'Visual Analyst', college: 'Greenfield Higher Secondary School', department: 'Science', year: 'Grade 12' },
  ],
};

const teamNames = ['Team Alpha', 'Team Neural', 'PromptX', 'Syntax Society', 'Context Crew', 'Vector Forge', 'Team Parse', 'Token Theory', 'Latent Logic', 'Prompt Pilots', 'Signal Stack', 'Ground Truth', 'Zero Shot'];
const statuses: TeamStatus[] = ['Under Review', 'Approved', 'Rejected', 'Submitted', 'Active', 'Pending', 'Approved', 'Under Review', 'Approved', 'Submitted', 'Rejected', 'Pending', 'Active'];

export const teams = teamNames.map((name, index) => ({
  id: `PRM-${1042 + index}`,
  slug: name.toLowerCase().replaceAll(' ', '-'),
  name,
  members: (index % 3) + 1,
  round: index % 5 === 2 ? 1 : index % 4 === 0 ? 3 : 2,
  status: statuses[index],
  submitted: `${11 + Math.floor(index / 4)}:${String(8 + index * 3).padStart(2, '0')} ${index > 3 ? 'PM' : 'AM'}`,
  tool: ['ChatGPT', 'Gemini', 'Claude', 'Microsoft Copilot'][index % 4],
}));

export const submissions = teams.slice(0, 10).map((team, index) => ({
  id: `SUB-${2201 + index}`,
  team: team.name,
  teamId: team.id,
  round: `Round 0${team.round}`,
  time: `12 Sep · ${team.submitted}`,
  status: index % 4 === 0 ? 'Pending' : index % 4 === 1 ? 'Under Review' : index % 4 === 2 ? 'Approved' : 'Rejected',
  tool: team.tool,
}));

export const auditLog = [
  ['12:33:18', 'Meera S.', 'Updated event configuration', 'EVENT'],
  ['12:33:04', 'System', 'Round 02 → UNLOCKED for Team Alpha', 'ACCESS'],
  ['12:33:01', 'Meera S.', 'Round 01 → APPROVED · Team Alpha', 'REVIEW'],
  ['12:32:14', 'Meera S.', 'Opened submission · Team Alpha', 'REVIEW'],
  ['12:29:48', 'System', 'Evidence checksum verified · SUB-2205', 'SYSTEM'],
  ['12:24:09', 'Arun K.', 'Round 02 → LIVE', 'ROUND'],
  ['12:23:51', 'Arun K.', 'Round 01 → CLOSED', 'ROUND'],
  ['11:58:32', 'System', 'Import completed · 146 participants', 'IMPORT'],
];

export const importRows = [
  { name: 'Nivetha Raj', email: 'nivetha.raj@example.com', status: 'Valid' },
  { name: 'Aditya Kumar', email: 'aditya.kumar@example.com', status: 'Valid' },
  { name: 'Nivetha Raj', email: 'nivetha.raj@example.com', status: 'Duplicate' },
  { name: 'S. Kavin', email: 'kavin-at-example.com', status: 'Invalid email' },
  { name: 'Harini Prasad', email: 'harini.prasad@example.com', status: 'Valid' },
];

export const roundOneChallenge = 'A local public library wants to use AI to help students find useful learning resources. The organizer’s brief is incomplete. Identify the missing context, ask only the necessary questions, and create a final prompt that produces a safe, structured and age-appropriate recommendation system.';

export const generatedOutput = `Launch plan: “Neighbourhood Knowledge Week”\n\nObjective: Increase meaningful library engagement among students aged 14–18 over a seven-day period.\n\nDeliverables:\n1. A daily thematic learning track\n2. Three offline discovery activities\n3. A privacy-safe recommendation flow\n4. Success measures for visits, borrowing and feedback`;

export const rules = [
  ['01', 'Eligibility & teams', 'Open to students in Grades 9—12. Teams may include one to three members.'],
  ['02', 'Tools & access', 'Participants may use free-tier AI tools available during the event. Paid features are not required.'],
  ['03', 'Evidence', 'Every submission must include clear evidence of the AI interaction and the final generated result.'],
  ['04', 'Timing', 'Each round must be completed within its allotted event period. Late editing is disabled automatically.'],
  ['05', 'Progression', 'Round access is controlled by organizers. Only approved teams proceed to the next challenge.'],
  ['06', 'Review', 'Submitted work may be inspected by organizers. The final decision of the judges is binding.'],
];
