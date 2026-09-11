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
  { id: 1, code: '01', title: 'VAGUE → PRECISE', prompt: 'What information does AI need?', description: 'Given an intentionally vague case, discover what information is missing and construct a prompt that guides AI toward a complete and useful solution.', skills: ['Information Discovery', 'Prompt Formulation', 'Completeness', 'Efficiency'], evaluation: 'Fewer attempts + completeness + usefulness', status: 'live' as RoundStatus, start: '09:30 AM', end: '11:00 AM', participants: 124, submissions: 0, approved: 0, pending: 0 },
  { id: 2, code: '02', title: 'OUTPUT → PROMPT', prompt: 'Can you reconstruct the hidden instruction?', description: 'Study an AI-generated response and reconstruct the hidden instructions that could have produced it.', skills: ['Prompt Analysis', 'Reasoning', 'Structure Detection', 'Constraint Identification'], evaluation: 'Prompt accuracy + output similarity', status: 'locked' as RoundStatus, start: '11:30 AM', end: '01:30 PM', participants: 0, submissions: 0, approved: 0, pending: 0 },
  { id: 3, code: '03', title: 'IMAGE → PROMPT', prompt: 'Can language rebuild a visual system?', description: 'Study a reference image and translate its objects, relationships, composition and visual details into a precise image-generation prompt.', skills: ['Visual Analysis', 'Spatial Reasoning', 'Image Prompting', 'Composition'], evaluation: 'Visual similarity + prompt quality', status: 'locked' as RoundStatus, start: '02:00 PM', end: '04:00 PM', participants: 0, submissions: 0, approved: 0, pending: 0 },
];

// Temporary Round 01 briefs. Replace the text here when the official problem
// statements arrive; participant and admin views both use these records.
export const roundOneProblems = [
  {
    id: '01',
    title: 'Student Support Assistant',
    statement: 'A college asks an AI assistant to “help students who are struggling.” Identify the missing context and create a precise prompt that produces safe, practical and appropriately scoped support recommendations.',
  },
  {
    id: '02',
    title: 'Community Event Planner',
    statement: 'A neighbourhood group wants AI to “plan a successful awareness event.” Determine the information the request is missing and construct a prompt that returns a realistic plan, responsibilities and measurable outcomes.',
  },
  {
    id: '03',
    title: 'Learning Resource Finder',
    statement: 'A public library wants AI to “recommend useful learning resources.” Clarify the audience, constraints and expected result, then create a prompt that generates relevant, age-appropriate and accessible recommendations.',
  },
  {
    id: '04',
    title: 'Sustainable Campus Challenge',
    statement: 'A campus team asks AI to “reduce waste effectively.” Discover the operational details and limitations needed, then write a prompt that produces an actionable, evidence-based improvement plan.',
  },
] as const;

export const currentTeam = {
  id: 'PRM-1042',
  slug: 'team-alpha',
  name: 'PRM-1042',
  status: 'Active' as TeamStatus,
  currentRound: 1,
  members: [
    { name: 'Aarav Raman', email: 'aarav.raman@example.com', role: 'Team Lead', college: 'Greenfield Higher Secondary School', department: 'Computer Science', year: 'Grade 12' },
    { name: 'Diya Krishnan', email: 'diya.krishnan@example.com', role: 'Prompt Strategist', college: 'Greenfield Higher Secondary School', department: 'Computer Science', year: 'Grade 11' },
    { name: 'Rohan Iyer', email: 'rohan.iyer@example.com', role: 'Visual Analyst', college: 'Greenfield Higher Secondary School', department: 'Science', year: 'Grade 12' },
  ],
};

const teamCodes = Array.from({ length: 13 }, (_, index) => `PRM-${1042 + index}`);
const statuses: TeamStatus[] = ['Under Review', 'Approved', 'Rejected', 'Submitted', 'Active', 'Pending', 'Approved', 'Under Review', 'Approved', 'Submitted', 'Rejected', 'Pending', 'Active'];

export const teams = teamCodes.map((name, index) => ({
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
  ['12:33:04', 'System', 'Round 02 → UNLOCKED for PRM-1042', 'ACCESS'],
  ['12:33:01', 'Meera S.', 'Round 01 → APPROVED · PRM-1042', 'REVIEW'],
  ['12:32:14', 'Meera S.', 'Opened submission · PRM-1042', 'REVIEW'],
  ['12:29:48', 'System', 'Evidence checksum verified · SUB-2205', 'SYSTEM'],
  ['12:24:09', 'Arun K.', 'Round 02 → LIVE', 'ROUND'],
  ['12:23:51', 'Arun K.', 'Round 01 → CLOSED', 'ROUND'],
  ['11:58:32', 'System', 'Import completed · 146 participants', 'IMPORT'],
];

export const importRows = [
  { name: 'Nivetha Raj', email: 'nivetha.raj@example.com', teamCode: 'PRM-1042', status: 'Valid' },
  { name: 'Aditya Kumar', email: 'aditya.kumar@example.com', teamCode: 'PRM-1042', status: 'Valid' },
  { name: 'Nivetha Raj', email: 'nivetha.raj@example.com', teamCode: 'PRM-1042', status: 'Duplicate' },
  { name: 'S. Kavin', email: 'kavin-at-example.com', teamCode: 'PRM-1043', status: 'Invalid email' },
  { name: 'Harini Prasad', email: 'harini.prasad@example.com', teamCode: 'PRM-1043', status: 'Valid' },
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

export const roundRules = [
  {
    round: 1,
    code: '01',
    title: 'Vague to Precise',
    subtitle: 'Digital prompt challenge',
    intro: 'Each team receives a separate problem statement and must turn it into a precise prompt using the organizer-approved AI tool.',
    rules: [
      'Use only the unique login credentials sent to your registered email.',
      'Each team may use exactly one device: either one laptop or one mobile phone.',
      'Only the AI tool designated by the organizers may be used.',
      'External AI assistance, additional devices, or parallel accounts are prohibited.',
      'Teams must work independently and may not share prompts, answers, or competition material.',
      'Submit one final prompt and its AI-generated response through the participant platform.',
      'Only work submitted through the respective team account will be evaluated.',
      'Rule violations may result in immediate disqualification; the jury decision is final.',
    ],
  },
  {
    round: 2,
    code: '02',
    title: 'Prompt Reverse Engineering',
    subtitle: 'Offline reasoning challenge',
    intro: 'Shortlisted teams analyse one AI-generated output and reconstruct the most likely instruction behind it.',
    rules: [
      'This round is conducted offline using only the pen and paper supplied at the venue.',
      'Laptops, mobile phones, smart watches, and all other electronic devices are prohibited.',
      'Each team receives one AI-generated output for analysis.',
      'The reconstructed prompt must be concise and limited to four or five lines.',
      'The prompt should capture the main intent, constraints, and requirements visible in the output.',
      'Only one final handwritten prompt may be submitted by each team.',
      'Copying, sharing answers, or assisting another team disqualifies every team involved.',
      'Only handwritten submissions are considered; the jury decision is final.',
    ],
  },
  {
    round: 3,
    code: '03',
    title: 'Image Recreation',
    subtitle: 'Final visual challenge',
    intro: 'Finalists observe a reference image and engineer a prompt that recreates its visual system as closely as possible.',
    rules: [
      'Use only the AI image-generation tool designated by the organizers.',
      'One laptop is permitted; mobile phones and additional devices are strictly prohibited.',
      'Each team receives one reference image to observe and reconstruct.',
      'Submit one final generated image together with the exact prompt used to create it.',
      'Only one final submission is accepted from each team.',
      'Prompts, images, observations, and assistance may not be shared between teams.',
      'Judging considers objects, positions, composition, colours, proportions, and overall resemblance.',
      'Rule violations may result in immediate disqualification; the jury decision is final.',
    ],
  },
] as const;
