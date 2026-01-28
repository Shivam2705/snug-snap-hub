export type CaseStatus = 'Completed' | 'Review Required' | 'In Progress' | 'Not Started' | 'Pending' | 'Awaiting Customer';

export type QueueType = 'day-0' | 'day-7' | 'day-28';

export type RiskLevel = 'low' | 'medium' | 'high';

export type ActorType = 'ai' | 'human';

export type RecommendationAction = 'escalate' | 'await' | 'block';

export type FinalOutcome = 'blocked' | 'escalated' | 'awaiting-customer' | 'approved';

export interface AIRecommendation {
  action: RecommendationAction;
  label: string;
  reasoning: string;
  supportingEvidence: string[];
}

export interface EvidenceItem {
  id: string;
  timestamp: string;
  actor: ActorType;
  agentName?: string;
  action: string;
  system: string;
  result: string;
  details?: string;
  status: 'success' | 'warning' | 'error' | 'info';
}

export interface ActivityLogItem {
  id: string;
  timestamp: string;
  actor: ActorType;
  actorName: string;
  action: string;
  category: 'check' | 'decision' | 'escalation' | 'communication' | 'override';
  beforeState?: string;
  afterState?: string;
}

export interface CustomerCase {
  caseId: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  emailAddress: string;
  mobileNumber: string;
  address: string;
  cifas: boolean;
  noc: boolean;
  authenticateCode: 2 | 3 | 4;
  zown: boolean;
  receivedDateTime: string;
  completionDateTime: string | null;
  assignTo: string;
  status: CaseStatus;
  finalOutcome?: FinalOutcome;
  aiSummary?: string;
  queue: QueueType;
  riskScore: number;
  riskLevel: RiskLevel;
  aiRecommendation?: AIRecommendation;
  confidenceScore?: number;
  evidenceTimeline?: EvidenceItem[];
  activityLog?: ActivityLogItem[];
  daysSinceReceived: number;
}

// Generate evidence timeline for CAW-2024-001 specifically
const generateCAW001Timeline = (baseDate: Date): EvidenceItem[] => {
  return [
    {
      id: '1',
      timestamp: baseDate.toISOString(),
      actor: 'ai',
      agentName: 'Case Intake Agent',
      action: 'Case received and investigator notes reviewed',
      system: 'Case Management System',
      result: 'Checked if case was previously worked by another investigator',
      details: 'Reading notes from iGuide Mainframe to identify prior investigator activity.',
      status: 'info'
    },
    {
      id: '2',
      timestamp: new Date(baseDate.getTime() + 5 * 60000).toISOString(),
      actor: 'ai',
      agentName: 'Customer Verification Agent',
      action: 'Search for Customer Details using Address & Phone Number',
      system: 'iGuide Mainframe',
      result: 'Customer lookup initiated using address and phone number',
      details: 'Searching for multiple addresses associated with customer in iGuide Mainframe.',
      status: 'info'
    },
    {
      id: '3',
      timestamp: new Date(baseDate.getTime() + 8 * 60000).toISOString(),
      actor: 'ai',
      agentName: 'Customer Verification Agent',
      action: 'Found Only 1 Address',
      system: 'iGuide Mainframe',
      result: 'Single address found in Mainframe',
      details: 'No duplicate addresses detected for this customer.',
      status: 'success'
    },
    {
      id: '4',
      timestamp: new Date(baseDate.getTime() + 10 * 60000).toISOString(),
      actor: 'ai',
      agentName: 'Customer Verification Agent',
      action: 'Customer Verified',
      system: 'iGuide Mainframe',
      result: 'Outcome: No potential fraud identified',
      details: 'Customer verification successful. Calling Address Verification Agent.',
      status: 'success'
    },
    {
      id: '5',
      timestamp: new Date(baseDate.getTime() + 15 * 60000).toISOString(),
      actor: 'ai',
      agentName: 'Address Verification Agent',
      action: 'Search for Address History in Transunion & Experian Portals',
      system: 'TransUnion / Experian',
      result: 'Address history lookup initiated',
      details: 'Querying credit bureau portals for customer address history.',
      status: 'info'
    },
    {
      id: '6',
      timestamp: new Date(baseDate.getTime() + 20 * 60000).toISOString(),
      actor: 'ai',
      agentName: 'Address Verification Agent',
      action: 'Outcome: Found 4 previous addresses',
      system: 'TransUnion / Experian',
      result: 'Address history retrieved successfully',
      details: 'Sending the 4 addresses to Fraud Detection Agent for CIFAS check.',
      status: 'warning'
    },
    {
      id: '7',
      timestamp: new Date(baseDate.getTime() + 25 * 60000).toISOString(),
      actor: 'ai',
      agentName: 'Fraud Detection Agent',
      action: 'Search for the 4 addresses in CIFAS Portal (find.cifas.org.uk)',
      system: 'CIFAS (find.cifas.org.uk)',
      result: 'Searching addresses provided by Address Verification Agent',
      details: 'Querying National Fraud Database for matches on all 4 addresses.',
      status: 'info'
    },
    {
      id: '8',
      timestamp: new Date(baseDate.getTime() + 30 * 60000).toISOString(),
      actor: 'ai',
      agentName: 'Fraud Detection Agent',
      action: 'CIFAS search completed',
      system: 'CIFAS (find.cifas.org.uk)',
      result: 'Outcome: Record found in National Fraud Database for the address: 20 High Street, London, EC1A 1BB',
      details: 'Fraud record matched to previous address. Case escalated to AIT team.',
      status: 'error'
    }
  ];
};

// Generate evidence timeline for cases
const generateEvidenceTimeline = (caseData: Partial<CustomerCase>): EvidenceItem[] => {
  const baseDate = new Date(caseData.receivedDateTime || new Date());
  
  // Special handling for CAW-2024-001
  if (caseData.caseId === 'CAW-2024-001') {
    return generateCAW001Timeline(baseDate);
  }
  
  const timeline: EvidenceItem[] = [];
  
  timeline.push({
    id: '1',
    timestamp: baseDate.toISOString(),
    actor: 'ai',
    agentName: 'Case Intake Agent',
    action: 'Case received and investigator notes reviewed',
    system: 'Case Management System',
    result: 'Checked if case was previously worked by another investigator',
    details: 'Reading notes from iGuide Mainframe to identify prior investigator activity.',
    status: 'info'
  });

  if (caseData.cifas) {
    timeline.push({
      id: '2',
      timestamp: new Date(baseDate.getTime() + 5 * 60000).toISOString(),
      actor: 'ai',
      agentName: 'Address Verification Agent',
      action: 'Mainframe address lookup initiated',
      system: 'iGuide Mainframe',
      result: 'Searching for multiple addresses using customer phone number and address',
      details: 'Checking if customer has multiple addresses registered in Mainframe.',
      status: 'warning'
    });

    timeline.push({
      id: '3',
      timestamp: new Date(baseDate.getTime() + 10 * 60000).toISOString(),
      actor: 'ai',
      agentName: 'Address Verification Agent',
      action: 'Multiple address verification completed',
      system: 'iGuide Mainframe',
      result: 'Customer name comparison across addresses completed',
      details: 'Verified if Customer Name is the same across all registered addresses.',
      status: 'info'
    });
  }

  if (caseData.authenticateCode === 2) {
    timeline.push({
      id: '4',
      timestamp: new Date(baseDate.getTime() + 15 * 60000).toISOString(),
      actor: 'ai',
      agentName: 'DOB Verification Agent',
      action: 'Date of Birth matching initiated',
      system: 'Experian / TransUnion',
      result: 'DOB comparison with credit bureau records',
      details: 'Matching mainframe DOB against Experian/TransUnion records.',
      status: 'info'
    });
  }

  if (caseData.zown) {
    timeline.push({
      id: '5',
      timestamp: new Date(baseDate.getTime() + 20 * 60000).toISOString(),
      actor: 'ai',
      agentName: 'Account Ownership Agent',
      action: 'ZOWN check - Duplicate account search',
      system: 'Account Database',
      result: 'Checking for existing or closed accounts',
      details: 'Identifying potential ownership conflicts.',
      status: 'warning'
    });
  }

  timeline.push({
    id: '6',
    timestamp: new Date(baseDate.getTime() + 25 * 60000).toISOString(),
    actor: 'ai',
    agentName: 'Address Verification Agent',
    action: 'Address history lookup',
    system: 'TransUnion / Experian',
    result: 'Address verification in progress',
    details: 'Matching application address with credit bureau records.',
    status: 'info'
  });

  return timeline;
};

// Generate activity log
const generateActivityLog = (caseData: Partial<CustomerCase>): ActivityLogItem[] => {
  const log: ActivityLogItem[] = [];
  const baseDate = new Date(caseData.receivedDateTime || new Date());

  log.push({
    id: '1',
    timestamp: baseDate.toISOString(),
    actor: 'ai',
    actorName: 'Case Intake Agent',
    action: 'Case automatically assigned to investigation queue',
    category: 'decision'
  });

  if (caseData.cifas) {
    log.push({
      id: '2',
      timestamp: new Date(baseDate.getTime() + 5 * 60000).toISOString(),
      actor: 'ai',
      actorName: 'CIFAS Agent',
      action: 'CIFAS database check initiated',
      category: 'check'
    });
  }

  if (caseData.status === 'Completed') {
    log.push({
      id: '3',
      timestamp: new Date(baseDate.getTime() + 60 * 60000).toISOString(),
      actor: 'human',
      actorName: caseData.assignTo || 'Investigator',
      action: 'Case reviewed and decision confirmed',
      category: 'decision',
      beforeState: 'In Progress',
      afterState: 'Completed'
    });
  }

  return log;
};

const calculateDaysSince = (dateString: string): number => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const calculateRiskScore = (c: Partial<CustomerCase>): number => {
  let score = 20;
  if (c.cifas) score += 35;
  if (c.noc) score += 15;
  if (c.zown) score += 20;
  if (c.authenticateCode === 4) score += 10;
  if (c.authenticateCode === 3) score += 5;
  return Math.min(score, 100);
};

const getRiskLevel = (score: number): RiskLevel => {
  if (score >= 70) return 'high';
  if (score >= 40) return 'medium';
  return 'low';
};

// Base case data
const baseCases = [
  {
    caseId: "CAW-2024-001",
    firstName: "James",
    lastName: "Wilson",
    birthDate: "1985-03-15",
    emailAddress: "james.wilson@email.com",
    mobileNumber: "+44 7700 900123",
    address: "123 High Street, London, EC1A 1BB",
    cifas: true,
    noc: false,
    authenticateCode: 3 as const,
    zown: false,
    receivedDateTime: "2024-01-15T09:30:00",
    completionDateTime: "2024-01-15T14:45:00",
    assignTo: "AI Agent",
    status: "Completed" as CaseStatus,
    finalOutcome: 'escalated' as FinalOutcome,
    queue: "day-0" as QueueType,
    aiSummary: "Customer flagged on CIFAS database for previous identity fraud. Address verification failed - Transunion shows different address. Case escalated to AIT team.",
    aiRecommendation: {
      action: 'escalate' as RecommendationAction,
      label: 'Escalate to AIT Team',
      reasoning: 'CIFAS record indicates confirmed identity fraud case type. Address verification failed with significant discrepancy between application and credit bureau records.',
      supportingEvidence: [
        'CIFAS database match: Identity Fraud case type confirmed',
        'Address mismatch: Transunion shows 45 Other Street vs application address',
        'Phone number linked to 2 other flagged accounts'
      ]
    },
    confidenceScore: 94
  },
  {
    caseId: "CAW-2024-002",
    firstName: "Emily",
    lastName: "Brown",
    birthDate: "1990-07-22",
    emailAddress: "emily.brown@gmail.com",
    mobileNumber: "+44 7700 900456",
    address: "45 Oak Lane, Manchester, M1 2AB",
    cifas: false,
    noc: true,
    authenticateCode: 2 as const,
    zown: true,
    receivedDateTime: "2024-01-15T10:15:00",
    completionDateTime: null,
    assignTo: "Michael Chen",
    status: "In Progress" as CaseStatus,
    queue: "day-0" as QueueType,
    aiSummary: "Customer verification in progress. ZOWN flag triggered - potential duplicate account. NOC flag requires verification.",
    aiRecommendation: {
      action: 'block' as RecommendationAction,
      label: 'Block Account',
      reasoning: 'ZOWN flag triggered indicating potential duplicate account ownership. NOC flag present with name verification mismatch. High risk indicators suggest blocking.',
      supportingEvidence: [
        'ZOWN: Potential duplicate account detected - same DOB, similar address',
        'NOC flag: Name on Credit file does not match application',
        'iGuide: Account linkage to previously blocked customer'
      ]
    },
    confidenceScore: 72
  },
  {
    caseId: "CAW-2024-003",
    firstName: "Robert",
    lastName: "Taylor",
    birthDate: "1978-11-08",
    emailAddress: "r.taylor@outlook.com",
    mobileNumber: "+44 7700 900789",
    address: "78 River Road, Birmingham, B1 3CD",
    cifas: false,
    noc: false,
    authenticateCode: 4 as const,
    zown: false,
    receivedDateTime: "2024-01-15T11:00:00",
    completionDateTime: null,
    assignTo: "Emma Williams",
    status: "Review Required" as CaseStatus,
    queue: "day-0" as QueueType,
    aiSummary: "Multiple customers found with similar phone number in iGuide. Relationship status unclear. Manual review required.",
    aiRecommendation: {
      action: 'escalate' as RecommendationAction,
      label: 'Escalate to AIT Team',
      reasoning: 'Phone number matches 3 other customer records in mainframe. Unable to determine if legitimate family/business connection or potential fraud ring. Specialist review required.',
      supportingEvidence: [
        'Phone shared with: Account #4521, #4522, #4523',
        'Auth Code 4: Strong authentication completed',
        'Pattern matches known fraud ring indicators'
      ]
    },
    confidenceScore: 58
  },
  {
    caseId: "CAW-2024-004",
    firstName: "Sarah",
    lastName: "Davis",
    birthDate: "1995-02-28",
    emailAddress: "sarah.d@yahoo.com",
    mobileNumber: "+44 7700 900012",
    address: "12 Garden View, Leeds, LS1 4EF",
    cifas: false,
    noc: false,
    authenticateCode: 2 as const,
    zown: false,
    receivedDateTime: "2024-01-15T12:30:00",
    completionDateTime: null,
    assignTo: "Unassigned",
    status: "Not Started" as CaseStatus,
    queue: "day-0" as QueueType,
    aiRecommendation: {
      action: 'await' as RecommendationAction,
      label: 'Awaiting Customer Information',
      reasoning: 'Additional documentation required to verify identity. Customer contact initiated to request proof of address.',
      supportingEvidence: [
        'No CIFAS record found',
        'Address verification: Partial match - requires confirmation',
        'DOB match: Confirmed across all sources'
      ]
    },
    confidenceScore: 65
  },
  {
    caseId: "CAW-2024-005",
    firstName: "David",
    lastName: "Miller",
    birthDate: "1982-09-14",
    emailAddress: "d.miller@email.co.uk",
    mobileNumber: "+44 7700 900345",
    address: "56 Station Road, Bristol, BS1 5GH",
    cifas: true,
    noc: true,
    authenticateCode: 3 as const,
    zown: true,
    receivedDateTime: "2024-01-14T08:00:00",
    completionDateTime: "2024-01-14T16:30:00",
    assignTo: "AI Agent",
    status: "Completed" as CaseStatus,
    finalOutcome: 'approved' as FinalOutcome,
    queue: "day-0" as QueueType,
    aiSummary: "CIFAS check showed protective registration (genuine customer). All address verifications passed. Customer authenticated successfully.",
    aiRecommendation: {
      action: 'await' as RecommendationAction,
      label: 'Awaiting Customer Information',
      reasoning: 'CIFAS record is Protective Registration - customer is fraud victim. Verified as legitimate customer after documentation received.',
      supportingEvidence: [
        'CIFAS Type: Protective Registration (not fraud)',
        'Customer confirmed as previous identity theft victim',
        'All verification checks passed'
      ]
    },
    confidenceScore: 96
  },
  {
    caseId: "CAW-2024-006",
    firstName: "Lisa",
    lastName: "Anderson",
    birthDate: "1988-05-20",
    emailAddress: "lisa.anderson@gmail.com",
    mobileNumber: "+44 7700 900678",
    address: "34 Park Avenue, Glasgow, G1 2JK",
    cifas: false,
    noc: false,
    authenticateCode: 2 as const,
    zown: false,
    receivedDateTime: "2024-01-08T14:00:00",
    completionDateTime: null,
    assignTo: "Michael Chen",
    status: "Awaiting Customer" as CaseStatus,
    queue: "day-7" as QueueType,
    aiSummary: "Email sent to customer via Zendesk requesting additional documentation. Awaiting customer response for 7+ days.",
    aiRecommendation: {
      action: 'await' as RecommendationAction,
      label: 'Awaiting Customer Information',
      reasoning: 'Customer documentation required to complete verification. Initial contact made via Zendesk 7 days ago. Second contact attempt recommended.',
      supportingEvidence: [
        'Zendesk ticket #ZD-45678 opened 7 days ago',
        'No response received from customer',
        'Documentation needed: Proof of address'
      ]
    },
    confidenceScore: 55
  },
  {
    caseId: "CAW-2024-007",
    firstName: "Thomas",
    lastName: "White",
    birthDate: "1975-12-03",
    emailAddress: "t.white@company.com",
    mobileNumber: "+44 7700 900901",
    address: "89 Church Street, Edinburgh, EH1 3LM",
    cifas: true,
    noc: false,
    authenticateCode: 4 as const,
    zown: true,
    receivedDateTime: "2024-01-13T09:00:00",
    completionDateTime: "2024-01-14T11:00:00",
    assignTo: "AI Agent",
    status: "Completed" as CaseStatus,
    finalOutcome: 'blocked' as FinalOutcome,
    queue: "day-0" as QueueType,
    aiSummary: "Identity fraud case type found on CIFAS. ZOWN indicates attempt to open duplicate account. Account blocked.",
    aiRecommendation: {
      action: 'block' as RecommendationAction,
      label: 'Block Account',
      reasoning: 'High confidence fraud detection. CIFAS shows active identity fraud case. ZOWN indicates attempt to open duplicate account. Immediate blocking recommended.',
      supportingEvidence: [
        'CIFAS: Active Identity Fraud case',
        'ZOWN: Previous account blocked for fraud in 2023',
        'Address mismatch: 78% discrepancy with credit bureau'
      ]
    },
    confidenceScore: 91
  },
  {
    caseId: "CAW-2024-008",
    firstName: "Jennifer",
    lastName: "Harris",
    birthDate: "1992-08-17",
    emailAddress: "j.harris@email.com",
    mobileNumber: "+44 7700 900234",
    address: "23 Mill Lane, Cardiff, CF1 4NP",
    cifas: false,
    noc: true,
    authenticateCode: 3 as const,
    zown: false,
    receivedDateTime: "2024-01-07T15:30:00",
    completionDateTime: null,
    assignTo: "Sarah Johnson",
    status: "Awaiting Customer" as CaseStatus,
    queue: "day-7" as QueueType,
    aiSummary: "NOC flag present. Customer verification agent completed - single match in iGuide. Awaiting customer documentation.",
    aiRecommendation: {
      action: 'await' as RecommendationAction,
      label: 'Awaiting Customer Information',
      reasoning: 'NOC flag requires customer verification. Second contact attempt recommended before escalation decision.',
      supportingEvidence: [
        'NOC: Name on Credit discrepancy detected',
        'First contact: Email sent 8 days ago, no response',
        'iGuide: Single match confirms customer exists'
      ]
    },
    confidenceScore: 60
  },
  {
    caseId: "CAW-2024-009",
    firstName: "Christopher",
    lastName: "Martin",
    birthDate: "1980-04-25",
    emailAddress: "c.martin@outlook.com",
    mobileNumber: "+44 7700 900567",
    address: "67 Queens Road, Liverpool, L1 5QR",
    cifas: false,
    noc: false,
    authenticateCode: 2 as const,
    zown: false,
    receivedDateTime: "2024-01-15T16:00:00",
    completionDateTime: null,
    assignTo: "Unassigned",
    status: "Not Started" as CaseStatus,
    queue: "day-0" as QueueType,
    aiRecommendation: {
      action: 'block' as RecommendationAction,
      label: 'Block Account',
      reasoning: 'Address verification failed. Application address does not match any known addresses in credit bureau records.',
      supportingEvidence: [
        'Address not found in Experian/TransUnion',
        'Phone number: Previously linked to fraud case',
        'Email domain flagged as high-risk'
      ]
    },
    confidenceScore: 78
  },
  {
    caseId: "CAW-2024-010",
    firstName: "Amanda",
    lastName: "Thompson",
    birthDate: "1987-01-10",
    emailAddress: "a.thompson@gmail.com",
    mobileNumber: "+44 7700 900890",
    address: "101 King Street, Newcastle, NE1 6ST",
    cifas: true,
    noc: true,
    authenticateCode: 4 as const,
    zown: true,
    receivedDateTime: "2024-01-12T10:00:00",
    completionDateTime: "2024-01-13T09:00:00",
    assignTo: "Michael Chen",
    status: "Completed" as CaseStatus,
    finalOutcome: 'awaiting-customer' as FinalOutcome,
    queue: "day-0" as QueueType,
    aiSummary: "Multiple flags triggered but CIFAS shows Protective Registration. Case resolved after customer provided verification documents.",
    aiRecommendation: {
      action: 'await' as RecommendationAction,
      label: 'Awaiting Customer Information',
      reasoning: 'Despite multiple flags, CIFAS is protective registration. Customer verification documents received and validated.',
      supportingEvidence: [
        'CIFAS: Protective Registration - customer is fraud victim',
        'ZOWN: Previous account is in good standing',
        'Auth Code 4: Strongest authentication level passed'
      ]
    },
    confidenceScore: 85
  },
  {
    caseId: "CAW-2024-011",
    firstName: "Michael",
    lastName: "Roberts",
    birthDate: "1983-06-12",
    emailAddress: "m.roberts@email.com",
    mobileNumber: "+44 7700 900111",
    address: "55 Victoria Street, Sheffield, S1 2AA",
    cifas: false,
    noc: false,
    authenticateCode: 3 as const,
    zown: false,
    receivedDateTime: "2024-01-06T09:00:00",
    completionDateTime: null,
    assignTo: "Emma Williams",
    status: "Awaiting Customer" as CaseStatus,
    queue: "day-7" as QueueType,
    aiSummary: "Customer contacted via Zendesk. No response after 9 days. Second attempt pending.",
    aiRecommendation: {
      action: 'escalate' as RecommendationAction,
      label: 'Escalate to AIT Team',
      reasoning: 'Customer has not responded after 9 days and 2 contact attempts. Policy requires escalation for cases exceeding 7-day response window.',
      supportingEvidence: [
        'First contact: Email sent 9 days ago',
        'Second contact: SMS sent 5 days ago',
        'No response on any channel'
      ]
    },
    confidenceScore: 48
  },
  {
    caseId: "CAW-2024-012",
    firstName: "Rachel",
    lastName: "Green",
    birthDate: "1991-03-28",
    emailAddress: "r.green@gmail.com",
    mobileNumber: "+44 7700 900222",
    address: "42 Abbey Road, London, NW8 9AY",
    cifas: true,
    noc: false,
    authenticateCode: 2 as const,
    zown: false,
    receivedDateTime: "2024-01-15T08:00:00",
    completionDateTime: null,
    assignTo: "Sarah Johnson",
    status: "In Progress" as CaseStatus,
    queue: "day-0" as QueueType,
    aiSummary: "CIFAS record found - investigating case type. Experian/TransUnion checks in progress.",
    aiRecommendation: {
      action: 'escalate' as RecommendationAction,
      label: 'Escalate to AIT Team',
      reasoning: 'CIFAS match detected with Identity Fraud case type. Requires specialist AIT team review for final determination.',
      supportingEvidence: [
        'CIFAS: Identity Fraud case type detected',
        'Experian check: Address mismatch found',
        'TransUnion check: In progress'
      ]
    },
    confidenceScore: 72
  }
];

// Build full cases with computed fields
export const mockCases: CustomerCase[] = baseCases.map(c => {
  const riskScore = calculateRiskScore(c);
  const daysSinceReceived = calculateDaysSince(c.receivedDateTime);
  
  return {
    ...c,
    riskScore,
    riskLevel: getRiskLevel(riskScore),
    daysSinceReceived,
    evidenceTimeline: generateEvidenceTimeline(c),
    activityLog: generateActivityLog(c)
  };
});

export const getCaseStats = () => {
  const total = mockCases.length;
  const inProgress = mockCases.filter(c => c.status === 'In Progress').length;
  const completed = mockCases.filter(c => c.status === 'Completed').length;
  const reviewRequired = mockCases.filter(c => c.status === 'Review Required').length;
  const pending = mockCases.filter(c => c.status === 'Pending').length;
  const notStarted = mockCases.filter(c => c.status === 'Not Started').length;
  const awaitingCustomer = mockCases.filter(c => c.status === 'Awaiting Customer').length;
  
  const day0Count = mockCases.filter(c => c.queue === 'day-0').length;
  const day7Count = mockCases.filter(c => c.queue === 'day-7').length;
  const day28Count = mockCases.filter(c => c.queue === 'day-28').length;
  
  const highRisk = mockCases.filter(c => c.riskLevel === 'high').length;
  const mediumRisk = mockCases.filter(c => c.riskLevel === 'medium').length;
  const lowRisk = mockCases.filter(c => c.riskLevel === 'low').length;
  
  const aiAutoCompleted = mockCases.filter(c => 
    c.status === 'Completed' && c.confidenceScore && c.confidenceScore >= 85
  ).length;

  return {
    total,
    inProgress,
    completed,
    reviewRequired,
    pending,
    notStarted,
    awaitingCustomer,
    day0Count,
    day7Count,
    day28Count,
    highRisk,
    mediumRisk,
    lowRisk,
    aiAutoCompleted
  };
};

export const getFlagCounts = () => {
  const cifasCount = mockCases.filter(c => c.cifas).length;
  const zownCount = mockCases.filter(c => c.zown).length;
  const nocCount = mockCases.filter(c => c.noc).length;
  const authCode2 = mockCases.filter(c => c.authenticateCode === 2).length;
  const authCode3 = mockCases.filter(c => c.authenticateCode === 3).length;
  const authCode4 = mockCases.filter(c => c.authenticateCode === 4).length;

  return {
    cifasCount,
    zownCount,
    nocCount,
    authCode2,
    authCode3,
    authCode4
  };
};
