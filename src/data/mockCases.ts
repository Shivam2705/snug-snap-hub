export type CaseStatus = 'Completed' | 'Review Required' | 'In Progress' | 'Not Started' | 'Pending' | 'Awaiting Customer';

export type QueueType = 'day-0' | 'day-7';

export type RiskLevel = 'low' | 'medium' | 'high';

export type ActorType = 'ai' | 'human';

export type RecommendationAction = 'escalate' | 'await' | 'block' | 'disable-flag' | 'approve' | 'investigate';

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
  fraud: boolean | null;
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

// Generate evidence timeline for cases
const generateEvidenceTimeline = (caseData: Partial<CustomerCase>): EvidenceItem[] => {
  const timeline: EvidenceItem[] = [];
  const baseDate = new Date(caseData.receivedDateTime || new Date());
  
  // Initial case received
  timeline.push({
    id: '1',
    timestamp: baseDate.toISOString(),
    actor: 'ai',
    agentName: 'Case Intake Agent',
    action: 'Case received and queued for investigation',
    system: 'Case Management System',
    result: 'Case initialized with triggered flags',
    status: 'info'
  });

  if (caseData.cifas) {
    timeline.push({
      id: '2',
      timestamp: new Date(baseDate.getTime() + 5 * 60000).toISOString(),
      actor: 'ai',
      agentName: 'CIFAS Verification Agent',
      action: 'CIFAS portal lookup initiated',
      system: 'find.cifas.org.uk',
      result: 'Record found in National Fraud Database',
      details: 'Case type identified. Checking for Identity Fraud or Protective Registration.',
      status: 'warning'
    });

    timeline.push({
      id: '3',
      timestamp: new Date(baseDate.getTime() + 10 * 60000).toISOString(),
      actor: 'ai',
      agentName: 'CIFAS Verification Agent',
      action: 'Cross-referencing mainframe data',
      system: 'iGuide Mainframe',
      result: 'Phone number and address linkage check completed',
      details: 'Checking for reuse across multiple customers.',
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

  // Add address verification
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
  let score = 20; // Base score
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

// Base case data without computed fields
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
    assignTo: "Sarah Johnson",
    status: "Completed" as CaseStatus,
    fraud: true,
    queue: "day-0" as QueueType,
    aiSummary: "Customer flagged on CIFAS database for previous identity fraud. Address verification failed - Transunion shows different address. Email sent to ACT team for escalation. Case marked as confirmed fraud.",
    aiRecommendation: {
      action: 'escalate' as RecommendationAction,
      label: 'Escalate to AIT Team',
      reasoning: 'CIFAS record indicates confirmed identity fraud case type. Address verification failed with significant discrepancy between application and credit bureau records. Pattern matches known fraud indicators.',
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
    fraud: null,
    queue: "day-0" as QueueType,
    aiSummary: "Customer verification in progress. iGuide search returned single match. Address verification pending Transunion/Experian check.",
    aiRecommendation: {
      action: 'investigate' as RecommendationAction,
      label: 'Continue Investigation',
      reasoning: 'ZOWN flag triggered indicating potential duplicate account ownership. NOC flag present but initial verification shows single match. Additional checks required before final determination.',
      supportingEvidence: [
        'ZOWN: Potential duplicate account detected - same DOB, similar address',
        'NOC flag: Name on Credit file requires verification',
        'iGuide: Single customer match found - no duplicates'
      ]
    },
    confidenceScore: 62
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
    fraud: null,
    queue: "day-0" as QueueType,
    aiSummary: "Multiple customers found with similar phone number in iGuide. Relationship status unclear. Manual review required to determine if accounts are related.",
    aiRecommendation: {
      action: 'investigate' as RecommendationAction,
      label: 'Manual Review Required',
      reasoning: 'Phone number matches 3 other customer records in mainframe. Unable to determine if legitimate family/business connection or potential fraud ring. Human judgment required.',
      supportingEvidence: [
        'Phone shared with: Account #4521, #4522, #4523',
        'Auth Code 4: Strong authentication completed',
        'No CIFAS or ZOWN flags present'
      ]
    },
    confidenceScore: 45
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
    fraud: null,
    queue: "day-0" as QueueType,
    aiRecommendation: {
      action: 'approve' as RecommendationAction,
      label: 'Auto-Complete (Low Risk)',
      reasoning: 'No fraud indicators detected. All verification checks passed. Customer profile matches credit bureau records. Eligible for automatic approval.',
      supportingEvidence: [
        'No CIFAS record found',
        'Address verified: 100% match with Experian',
        'DOB match: Confirmed across all sources',
        'No duplicate accounts detected'
      ]
    },
    confidenceScore: 88
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
    assignTo: "Sarah Johnson",
    status: "Completed" as CaseStatus,
    fraud: false,
    queue: "day-0" as QueueType,
    aiSummary: "CIFAS check showed protective registration (genuine customer). All address verifications passed. Customer authenticated successfully. No fraud detected.",
    aiRecommendation: {
      action: 'disable-flag' as RecommendationAction,
      label: 'Disable Fraud Flag - Legitimate Customer',
      reasoning: 'CIFAS record is a Protective Registration filed by customer after being victim of previous fraud attempt. This is not a fraud indicator but customer protection. All other checks verify legitimacy.',
      supportingEvidence: [
        'CIFAS Type: Protective Registration (not fraud)',
        'Customer is victim of previous identity theft',
        'All verification checks passed successfully',
        'Address and DOB fully verified'
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
    fraud: null,
    queue: "day-7" as QueueType,
    aiSummary: "Email sent to customer via Zendesk requesting additional documentation. Awaiting customer response for 7+ days.",
    aiRecommendation: {
      action: 'await' as RecommendationAction,
      label: 'Await Customer Response',
      reasoning: 'Customer documentation required to complete verification. Initial contact made via Zendesk 7 days ago. Recommend second contact attempt before escalation.',
      supportingEvidence: [
        'Zendesk ticket #ZD-45678 opened 7 days ago',
        'No response received from customer',
        'Documentation needed: Proof of address',
        'Auto-escalation scheduled in 3 days if no response'
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
    assignTo: "Emma Williams",
    status: "Completed" as CaseStatus,
    fraud: true,
    queue: "day-0" as QueueType,
    aiSummary: "Identity fraud case type found on CIFAS. Details do not match victim of impersonation record. Address discrepancy confirmed via Transunion. Email sent to customer via Zendesk - no response. Escalated to ACT.",
    aiRecommendation: {
      action: 'block' as RecommendationAction,
      label: 'Block Account Immediately',
      reasoning: 'High confidence fraud detection. CIFAS shows active identity fraud case. ZOWN indicates attempt to open duplicate account. Customer details do not match legitimate identity holder. Immediate blocking recommended.',
      supportingEvidence: [
        'CIFAS: Active Identity Fraud case - not protective registration',
        'ZOWN: Previous account blocked for fraud in 2023',
        'Address mismatch: 78% discrepancy with credit bureau',
        'No response to verification request after 48 hours'
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
    fraud: null,
    queue: "day-7" as QueueType,
    aiSummary: "NOC flag present. Customer verification agent completed - single match in iGuide. Awaiting customer documentation.",
    aiRecommendation: {
      action: 'await' as RecommendationAction,
      label: 'Second Contact Attempt Required',
      reasoning: 'First customer contact attempt unsuccessful. NOC flag requires customer verification. Case on Day-7 queue - second attempt recommended before escalation decision.',
      supportingEvidence: [
        'NOC: Name on Credit discrepancy detected',
        'First contact: Email sent 8 days ago, no response',
        'iGuide: Single match confirms customer exists',
        'SMS reminder scheduled for today'
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
    fraud: null,
    queue: "day-0" as QueueType,
    aiRecommendation: {
      action: 'approve' as RecommendationAction,
      label: 'Auto-Complete (Low Risk)',
      reasoning: 'Clean application with no fraud indicators. All automated checks passed. Customer verified through standard authentication. Eligible for automatic approval without human review.',
      supportingEvidence: [
        'No CIFAS, NOC, or ZOWN flags',
        'Address verified: Exact match with Experian/TransUnion',
        'DOB confirmed: Matches credit bureau records',
        'Phone number: No suspicious linkages found'
      ]
    },
    confidenceScore: 92
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
    fraud: false,
    queue: "day-0" as QueueType,
    aiSummary: "Protective registration on CIFAS - genuine customer protecting against previous fraud attempt. All verification checks passed. Customer authenticated with code 4. Case closed - no fraud.",
    aiRecommendation: {
      action: 'disable-flag' as RecommendationAction,
      label: 'Disable Fraud Flag - Verified Customer',
      reasoning: 'Despite multiple flags, investigation confirms legitimate customer. CIFAS is protective registration. ZOWN shows previous legitimate account. Strong authentication passed. All flags are false positives.',
      supportingEvidence: [
        'CIFAS: Protective Registration - customer is fraud victim',
        'ZOWN: Previous account is in good standing',
        'Auth Code 4: Strongest authentication level passed',
        'All address and identity checks verified'
      ]
    },
    confidenceScore: 98
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
    fraud: null,
    queue: "day-7" as QueueType,
    aiSummary: "Customer contacted via Zendesk. No response after 9 days. Second attempt pending.",
    aiRecommendation: {
      action: 'escalate' as RecommendationAction,
      label: 'Escalate - No Customer Response',
      reasoning: 'Customer has not responded after 9 days and 2 contact attempts. Policy requires escalation to AIT for cases exceeding 7-day response window with no customer engagement.',
      supportingEvidence: [
        'First contact: Email sent 9 days ago',
        'Second contact: SMS sent 5 days ago',
        'No response on any channel',
        'Policy threshold exceeded: 7-day limit'
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
    fraud: null,
    queue: "day-0" as QueueType,
    aiSummary: "CIFAS record found - investigating case type. Experian/TransUnion checks in progress.",
    aiRecommendation: {
      action: 'investigate' as RecommendationAction,
      label: 'Pending CIFAS Classification',
      reasoning: 'CIFAS match detected but case type not yet determined. Awaiting full CIFAS record retrieval to determine if fraud case or protective registration.',
      supportingEvidence: [
        'CIFAS: Record found - type pending',
        'Experian check: In progress',
        'TransUnion check: In progress',
        'Expected completion: Within 2 hours'
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
  
  const cifasYes = mockCases.filter(c => c.cifas).length;
  const nocYes = mockCases.filter(c => c.noc).length;
  const zownYes = mockCases.filter(c => c.zown).length;
  const authCode2 = mockCases.filter(c => c.authenticateCode === 2).length;
  const authCode3 = mockCases.filter(c => c.authenticateCode === 3).length;
  const authCode4 = mockCases.filter(c => c.authenticateCode === 4).length;

  const day0Count = mockCases.filter(c => c.queue === 'day-0').length;
  const day7Count = mockCases.filter(c => c.queue === 'day-7').length;

  const highRisk = mockCases.filter(c => c.riskLevel === 'high').length;
  const mediumRisk = mockCases.filter(c => c.riskLevel === 'medium').length;
  const lowRisk = mockCases.filter(c => c.riskLevel === 'low').length;

  const aiAutoCompleted = mockCases.filter(c => c.status === 'Completed' && c.confidenceScore && c.confidenceScore >= 90).length;
  
  return {
    total,
    inProgress,
    completed,
    reviewRequired,
    pending,
    notStarted,
    awaitingCustomer,
    cifasYes,
    nocYes,
    zownYes,
    authCode2,
    authCode3,
    authCode4,
    day0Count,
    day7Count,
    highRisk,
    mediumRisk,
    lowRisk,
    aiAutoCompleted
  };
};
