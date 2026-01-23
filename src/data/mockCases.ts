export type CaseStatus = 'Completed' | 'Review Required' | 'In Progress' | 'Not Started' | 'Pending';

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
}

export const mockCases: CustomerCase[] = [
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
    authenticateCode: 3,
    zown: false,
    receivedDateTime: "2024-01-15T09:30:00",
    completionDateTime: "2024-01-15T14:45:00",
    assignTo: "Sarah Johnson",
    status: "Completed",
    fraud: true,
    aiSummary: "Customer flagged on CIFAS database for previous identity fraud. Address verification failed - Transunion shows different address. Email sent to ACT team for escalation. Case marked as confirmed fraud."
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
    authenticateCode: 2,
    zown: true,
    receivedDateTime: "2024-01-15T10:15:00",
    completionDateTime: null,
    assignTo: "Michael Chen",
    status: "In Progress",
    fraud: null,
    aiSummary: "Customer verification in progress. iGuide search returned single match. Address verification pending Transunion/Experian check."
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
    authenticateCode: 4,
    zown: false,
    receivedDateTime: "2024-01-15T11:00:00",
    completionDateTime: null,
    assignTo: "Emma Williams",
    status: "Review Required",
    fraud: null,
    aiSummary: "Multiple customers found with similar phone number in iGuide. Relationship status unclear. Manual review required to determine if accounts are related."
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
    authenticateCode: 2,
    zown: false,
    receivedDateTime: "2024-01-15T12:30:00",
    completionDateTime: null,
    assignTo: "Unassigned",
    status: "Not Started",
    fraud: null
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
    authenticateCode: 3,
    zown: true,
    receivedDateTime: "2024-01-14T08:00:00",
    completionDateTime: "2024-01-14T16:30:00",
    assignTo: "Sarah Johnson",
    status: "Completed",
    fraud: false,
    aiSummary: "CIFAS check showed protective registration (genuine customer). All address verifications passed. Customer authenticated successfully. No fraud detected."
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
    authenticateCode: 2,
    zown: false,
    receivedDateTime: "2024-01-15T14:00:00",
    completionDateTime: null,
    assignTo: "Michael Chen",
    status: "Pending",
    fraud: null
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
    authenticateCode: 4,
    zown: true,
    receivedDateTime: "2024-01-13T09:00:00",
    completionDateTime: "2024-01-14T11:00:00",
    assignTo: "Emma Williams",
    status: "Completed",
    fraud: true,
    aiSummary: "Identity fraud case type found on CIFAS. Details do not match victim of impersonation record. Address discrepancy confirmed via Transunion. Email sent to customer via Zendesk - no response. Escalated to ACT."
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
    authenticateCode: 3,
    zown: false,
    receivedDateTime: "2024-01-15T15:30:00",
    completionDateTime: null,
    assignTo: "Sarah Johnson",
    status: "In Progress",
    fraud: null,
    aiSummary: "NOC flag present. Customer verification agent completed - single match in iGuide. Address verification in progress."
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
    authenticateCode: 2,
    zown: false,
    receivedDateTime: "2024-01-15T16:00:00",
    completionDateTime: null,
    assignTo: "Unassigned",
    status: "Not Started",
    fraud: null
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
    authenticateCode: 4,
    zown: true,
    receivedDateTime: "2024-01-12T10:00:00",
    completionDateTime: "2024-01-13T09:00:00",
    assignTo: "Michael Chen",
    status: "Completed",
    fraud: false,
    aiSummary: "Protective registration on CIFAS - genuine customer protecting against previous fraud attempt. All verification checks passed. Customer authenticated with code 4. Case closed - no fraud."
  }
];

export const getCaseStats = () => {
  const total = mockCases.length;
  const inProgress = mockCases.filter(c => c.status === 'In Progress').length;
  const completed = mockCases.filter(c => c.status === 'Completed').length;
  const reviewRequired = mockCases.filter(c => c.status === 'Review Required').length;
  const pending = mockCases.filter(c => c.status === 'Pending').length;
  const notStarted = mockCases.filter(c => c.status === 'Not Started').length;
  
  const cifasYes = mockCases.filter(c => c.cifas).length;
  const nocYes = mockCases.filter(c => c.noc).length;
  const zownYes = mockCases.filter(c => c.zown).length;
  const authCode2 = mockCases.filter(c => c.authenticateCode === 2).length;
  const authCode3 = mockCases.filter(c => c.authenticateCode === 3).length;
  const authCode4 = mockCases.filter(c => c.authenticateCode === 4).length;
  
  return {
    total,
    inProgress,
    completed,
    reviewRequired,
    pending,
    notStarted,
    cifasYes,
    nocYes,
    zownYes,
    authCode2,
    authCode3,
    authCode4
  };
};