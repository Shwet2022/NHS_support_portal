export type UserRole = 'manager' | 'employee';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  staffId: string;
  trustName: string;
  avatarInitials: string;
}

export interface SupportTicket {
  id: string;
  referenceNumber: string;
  subject: string;
  category: 'Payroll & Salary' | 'Pensions' | 'IT Systems & Access' | 'Procurement' | 'Travel & Expenses' | 'HR & Policy';
  status: 'Open' | 'In Progress' | 'Pending User' | 'Resolved' | 'Closed';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  createdAt: string;
  updatedAt: string;
  submittedBy: string;
  submittedByEmail: string;
  description: string;
  assignedTeam: string;
  updates: {
    id: string;
    author: string;
    timestamp: string;
    message: string;
    isStaff: boolean;
  }[];
}

export interface KnowledgeArticle {
  id: string;
  slug: string;
  title: string;
  category: 'Payroll & Pensions' | 'IT & Systems Access' | 'Travel & Expenses' | 'Procurement' | 'HR Policies';
  summary: string;
  content: string[];
  readTime: string;
  lastUpdated: string;
  helpfulCount: number;
}

export interface FasterPaymentRecord {
  id: string;
  reference: string;
  beneficiaryName: string;
  sortCode: string;
  accountNumber: string;
  amount: number;
  reason: string;
  requestedBy: string;
  department: string;
  status: 'Pending Approval' | 'Authorized' | 'Processing' | 'Completed' | 'Rejected';
  urgencyLevel: 'Emergency (Same Day)' | 'Priority (24h)' | 'Standard Faster Payment';
  submittedAt: string;
}

export interface ParentalLeaveRecord {
  id: string;
  reference: string;
  employeeName: string;
  staffPayrollId: string;
  leaveType: 'Maternity Leave' | 'Paternity Leave' | 'Adoption Leave' | 'Shared Parental Leave';
  expectedDueDate: string;
  leaveStartDate: string;
  intendedReturnDate: string;
  status: 'Submitted' | 'HR Review' | 'Payroll Scheduled' | 'Approved';
  kitDaysRequested: number;
  occupationalPayEligible: boolean;
  submittedAt: string;
}

export interface ClientTrust {
  id: string;
  code: string;
  name: string;
  region: string;
  activeContracts: number;
  slaAdherence: number;
  primaryContact: string;
  contactEmail: string;
  status: 'Active' | 'Review Required' | 'Onboarding';
  monthlyVolume: string;
}
