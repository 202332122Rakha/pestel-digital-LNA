export type UserRole = 'ADMIN' | 'USER DASAR' | 'MANAGEMENT';

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  role: UserRole;
  unit: string;
  jabatan: string;
  supervisor?: string;
  nip?: string;
  employeeId?: string;
  password?: string;
  status?: 'Aktif' | 'Nonaktif';
  avatar?: string;
}

// Role permission helpers
export const canCreate = (role: UserRole): boolean => role === 'ADMIN';
export const canEdit = (role: UserRole): boolean => role === 'ADMIN';
export const canDelete = (role: UserRole): boolean => role === 'ADMIN';
export const canFinalize = (role: UserRole): boolean => role === 'ADMIN';
export const canManageUsers = (role: UserRole): boolean => role === 'ADMIN';
export const canReview = (role: UserRole): boolean => role === 'ADMIN' || role === 'MANAGEMENT';
export const canComment = (role: UserRole): boolean => role === 'ADMIN' || role === 'MANAGEMENT';
export const canFeedback = (role: UserRole): boolean => role === 'ADMIN' || role === 'MANAGEMENT';
export const canRequestRevision = (role: UserRole): boolean => role === 'MANAGEMENT';
export const canApprove = (role: UserRole): boolean => role === 'ADMIN' || role === 'MANAGEMENT';
export const canViewAudit = (role: UserRole): boolean => role === 'ADMIN' || role === 'MANAGEMENT';
export const canViewAllEmployees = (role: UserRole): boolean => role === 'ADMIN';
export const canViewUnitData = (role: UserRole): boolean => role === 'ADMIN' || role === 'MANAGEMENT';

export type PriorityLevel = 'High' | 'Medium' | 'Low';

export type LNAStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER REVIEW'
  | 'REVISION REQUIRED'
  | 'APPROVED'
  | 'FINAL';

export type PeriodQuarter = 'Q1' | 'Q2';

export interface CCAItem {
  id: string;
  employeeName: string;
  unit: string;
  position: string;
  competency: string;
  currentLevel: number;
  requiredLevel: number;
  gap: number;
  priority: PriorityLevel;
  businessIssue: string;
  managementExpectation: string;
  status: LNAStatus;
  createdAt: string;
  year?: number;
  month?: string;
  period?: string;
  quarter?: PeriodQuarter;
}

export interface DNAItem {
  id: string;
  ccaId?: string;
  employeeName: string;
  competency: string;
  gapLevel: number;
  gapCause: string;
  developmentNeed: string;
  targetLevel: number;
  priority: PriorityLevel;
  status: LNAStatus;
  createdAt: string;
  year?: number;
  month?: string;
  period?: string;
  quarter?: PeriodQuarter;
}

export interface LearningPathNode {
  id: string;
  order: number;
  title: string;
  duration: string;
  method: 'In Class' | 'Digital Learning' | 'Blended' | 'Hands-on / Lab' | 'Assessment';
  description: string;
}

export interface LearningPathItem {
  id: string;
  name: string;
  category: string;
  priority: PriorityLevel;
  totalModules: number;
  duration: string;
  participantsCount: number;
  progress: number;
  targetRole: string;
  objectives: string;
  competencies: string[];
  assignedEmployees: string[];
  nodes: LearningPathNode[];
  status: LNAStatus;
  year?: number;
  month?: string;
  period?: string;
  quarter?: PeriodQuarter;
}

export interface TNAItem {
  id: string;
  trainingName: string;
  targetUnit: string;
  competency: string;
  priority: PriorityLevel;
  method: 'In Class' | 'Blended' | 'Digital Learning' | 'Workshop / Lab' | 'Mentoring';
  duration: string;
  status: LNAStatus;
  participantsCount: number;
  estimatedBudget?: string;
  submittedBy: string;
  submissionDate: string;
  targetEmployees?: string[];
  approvalNotes?: string;
  year?: number;
  month?: string;
  period?: string;
  quarter?: PeriodQuarter;
}

export interface LearningSolutionItem {
  id: string;
  title: string;
  type: 'In Class Training' | 'Digital Learning' | 'Blended Learning' | 'Coaching' | 'Mentoring' | 'On-the-Job Learning';
  description: string;
  tags: string[];
  targetAudience: string;
  durationRange: string;
  effectivenessRate: number;
  suitabilityScore: number;
  recommendedFor: string[];
  recommendedEmployees?: string[];
  implementationGuide: string;
  status: LNAStatus;
  year?: number;
  month?: string;
  period?: string;
  quarter?: PeriodQuarter;
}

export interface ReviewFeedback {
  id: string;
  unit: string;
  period: string;
  category: 'Kompetensi' | 'Learning Path' | 'TNA' | 'Learning Solution' | 'Laporan' | 'Lainnya';
  comment: string;
  priority: PriorityLevel;
  decision: 'Kirim Masukan' | 'Setujui' | 'Minta Revisi';
  status: 'Menunggu Review' | 'Disetujui' | 'Perlu Revisi' | 'Selesai';
  reviewerName: string;
  reviewerRole: string;
  createdAt: string;
  resolvedAt?: string;
  adminResponse?: string;
  targetModule?: string;
  targetItemTitle?: string;
  year?: number;
  month?: string;
  quarter?: PeriodQuarter;
}

export interface AuditTrailItem {
  id: string;
  date: string;
  user: string;
  role: UserRole;
  activity: string;
  module: string;
  status: LNAStatus | string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  targetRole: UserRole | 'ALL';
  read: boolean;
  category: string;
}

export interface ActivityItem {
  id: string;
  type: 'cca' | 'dna' | 'tna' | 'solution' | 'path' | 'review' | 'audit';
  message: string;
  timestamp: string;
  actor: string;
}

export interface ToastNotification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title?: string;
  message: string;
}

export interface Employee {
  id: string;
  nip: string;
  name: string;
  email: string;
  unit: string;
  position: string;
  supervisor?: string;
  status: 'Aktif' | 'Tugas Belajar' | 'Cuti' | 'ACTIVE' | 'ON_LEAVE' | 'INACTIVE';
  joinedYear?: number;
  competencies?: string[];
  level?: number;
  currentLevel?: number;
  requiredLevel?: number;
  gap?: number;
  priority?: PriorityLevel;
  trainingStatus?: 'Belum Pelatihan' | 'Dalam Pelatihan' | 'Selesai' | 'Rekomendasi';
  joinDate?: string;
}

export interface EmployeeMutation {
  id: string;
  employeeId: string;
  employeeName: string;
  nip: string;
  changeType: 'Perubahan Unit' | 'Perubahan Jabatan' | 'Perubahan Atasan' | 'Mutasi' | 'Penempatan' | 'Perubahan Status';
  oldValue: string;
  newValue: string;
  date: string;
  changedBy: string;
  notes?: string;
}

export interface TrainingItem {
  id: string;
  name: string;
  targetCompetency: string;
  targetLevel: number;
  method: 'In Class' | 'Digital Learning' | 'Blended' | 'Workshop / Lab';
  duration: string;
  priority: PriorityLevel;
  targetAudience: string;
  status: 'Tersedia' | 'Berjalan' | 'Direncanakan';
}

export interface CompetencyStandard {
  id: string;
  code: string;
  name: string;
  category: 'Hard Skill' | 'Soft Skill' | 'Digital Leadership' | 'Architecture' | 'TECHNICAL' | 'LEADERSHIP' | 'CORE';
  targetLevel: number;
  description: string;
}
