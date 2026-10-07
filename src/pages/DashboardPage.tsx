import React, { useState, useMemo } from 'react';
import {
  Layers,
  TrendingUp,
  AlertTriangle,
  GraduationCap,
  Lightbulb,
  ArrowRight,
  CheckCircle2,
  Clock,
  RotateCw,
  FileCheck2,
  Target,
  GitBranch,
  Route,
  ChevronRight,
  User as UserIcon,
  Users,
  CheckCircle,
  ShieldCheck,
  Eye,
  Lock,
  MessageSquare,
  AlertCircle,
  Calendar,
  Filter,
  Inbox,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  User,
  CCAItem,
  DNAItem,
  LearningPathItem,
  TNAItem,
  LearningSolutionItem,
  ActivityItem,
  ReviewFeedback,
} from '../types';
import { StatusBadge, PriorityBadge, ViewOnlyBadge } from '../components/StatusBadge';
import { PeriodFilter } from '../components/PeriodFilter';
import {
  isMatchPeriod,
  formatPeriodLabel,
  PERIOD_CONFIG,
  getQuarterFromMonth,
} from '../utils/period';
import { formatDateTime } from '../utils/helpers';

interface DashboardPageProps {
  currentUser: User;
  ccaList: CCAItem[];
  dnaList: DNAItem[];
  pathsList: LearningPathItem[];
  tnaList: TNAItem[];
  solutionList: LearningSolutionItem[];
  reviewList: ReviewFeedback[];
  activities: ActivityItem[];
  onNavigate: (page: string) => void;
  onOpenReviewModal?: (module?: string, title?: string) => void;
  selectedYear?: number;
  selectedPeriod?: string;
  onYearChange?: (year: number) => void;
  onPeriodChange?: (period: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  currentUser,
  ccaList,
  dnaList,
  pathsList,
  tnaList,
  solutionList,
  reviewList,
  activities,
  onNavigate,
  onOpenReviewModal,
  selectedYear: propSelectedYear,
  selectedPeriod: propSelectedPeriod,
  onYearChange: propOnYearChange,
  onPeriodChange: propOnPeriodChange,
}) => {
  // Local fallback if props not supplied
  const [localYear, setLocalYear] = useState<number>(2026);
  const [localPeriod, setLocalPeriod] = useState<string>('Semua Periode');

  const activeYear = propSelectedYear ?? localYear;
  const activePeriod = propSelectedPeriod ?? localPeriod;
  const handleYearChange = propOnYearChange ?? setLocalYear;
  const handlePeriodChange = propOnPeriodChange ?? setLocalPeriod;

  const activePeriodLabel = useMemo(
    () => formatPeriodLabel(activeYear, activePeriod),
    [activeYear, activePeriod]
  );

  // ----------------------------------------------------
  // FILTER DATA BERDASARKAN TAHUN & PERIODE
  // ----------------------------------------------------
  const periodFilteredCCA = useMemo(
    () => ccaList.filter((item) => isMatchPeriod(item, activeYear, activePeriod)),
    [ccaList, activeYear, activePeriod]
  );

  const periodFilteredDNA = useMemo(
    () => dnaList.filter((item) => isMatchPeriod(item, activeYear, activePeriod)),
    [dnaList, activeYear, activePeriod]
  );

  const periodFilteredPaths = useMemo(
    () => pathsList.filter((item) => isMatchPeriod(item, activeYear, activePeriod)),
    [pathsList, activeYear, activePeriod]
  );

  const periodFilteredTNA = useMemo(
    () => tnaList.filter((item) => isMatchPeriod(item, activeYear, activePeriod)),
    [tnaList, activeYear, activePeriod]
  );

  const periodFilteredSolutions = useMemo(
    () => solutionList.filter((item) => isMatchPeriod(item, activeYear, activePeriod)),
    [solutionList, activeYear, activePeriod]
  );

  const periodFilteredReviews = useMemo(
    () => reviewList.filter((item) => isMatchPeriod(item, activeYear, activePeriod)),
    [reviewList, activeYear, activePeriod]
  );

  // ----------------------------------------------------
  // 1. USER DASAR PERSONAL DASHBOARD
  // ----------------------------------------------------
  if (currentUser.role === 'USER DASAR') {
    // Filter strictly own data
    const myCCA = periodFilteredCCA.filter((c) =>
      c.employeeName.toLowerCase().includes(currentUser.name.toLowerCase())
    );
    const myDNA = periodFilteredDNA.filter((d) =>
      d.employeeName.toLowerCase().includes(currentUser.name.toLowerCase())
    );
    const myPaths = periodFilteredPaths.filter((p) =>
      p.assignedEmployees.some((e) => e.toLowerCase().includes(currentUser.name.toLowerCase()))
    );
    const myTNA = periodFilteredTNA.filter(
      (t) =>
        t.targetEmployees?.some((e) => e.toLowerCase().includes(currentUser.name.toLowerCase())) ||
        t.submittedBy.toLowerCase().includes(currentUser.name.toLowerCase())
    );
    const mySolutions = periodFilteredSolutions.filter((s) =>
      s.recommendedEmployees?.some((e) => e.toLowerCase().includes(currentUser.name.toLowerCase()))
    );

    const myCompetencyCount = myCCA.length;
    const myGapCount = myCCA.reduce((sum, item) => sum + (item.gap > 0 ? item.gap : 0), 0);
    const myAvgProgress = myPaths.length
      ? Math.round(myPaths.reduce((sum, p) => sum + p.progress, 0) / myPaths.length)
      : 0;
    const primaryPath = myPaths[0];
    const primaryTNA = myTNA[0];

    const hasUserData = myCCA.length > 0 || myPaths.length > 0 || myTNA.length > 0;

    return (
      <div className="space-y-6">
        {/* User Dasar Header Banner */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-[#00843D] uppercase tracking-wider">
                Portal Pegawai · {currentUser.unit}
              </span>
              <ViewOnlyBadge label="VIEW ONLY - DATA PRIBADI" />
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#006B32] border border-emerald-200">
                Data Periode: {activePeriodLabel}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1.5">
              My Learning Dashboard
            </h1>
            <p className="text-xs md:text-sm text-slate-500 mt-1">
              Selamat datang, {currentUser.name}. Menampilkan hasil analisis kebutuhan kompetensi Anda untuk periode <strong className="text-slate-700">{activePeriodLabel}</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('cca')}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#00843D] hover:bg-[#006B32] rounded-lg transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <span>Lihat Detail Kompetensi Saya</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Global Period Filter Component */}
        <PeriodFilter
          selectedYear={activeYear}
          selectedPeriod={activePeriod}
          onYearChange={handleYearChange}
          onPeriodChange={handlePeriodChange}
        />

        {/* Empty State jika periode belum ada data */}
        {!hasUserData && (
          <div className="bg-white rounded-xl border border-dashed border-slate-300 p-8 text-center shadow-2xs">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Inbox className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">
              Belum Ada Data Kompetensi untuk Periode {activePeriodLabel}
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Tidak ditemukan data penilaian kompetensi personal Anda pada periode ini. Silakan ubah filter Tahun atau Bulan/Kuartal untuk melihat riwayat data periode lain.
            </p>
          </div>
        )}

        {/* 6 Personal Metric Cards */}
        {hasUserData && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Card 1: My Competencies */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase">My Competencies</span>
                  <div className="p-2 rounded-lg bg-emerald-50 text-[#00843D] border border-emerald-200">
                    <Target className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-2xl font-extrabold font-mono text-slate-900">{myCompetencyCount}</div>
                  <div className="text-[11px] text-slate-500 mt-1">Kompetensi dinilai pada {activePeriodLabel}</div>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap gap-1">
                  {myCCA.map((c) => (
                    <span key={c.id} className="text-[10.5px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                      {c.competency} (Lvl {c.currentLevel}/{c.requiredLevel})
                    </span>
                  ))}
                </div>
              </div>

              {/* Card 2: My Competency Gap */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase">My Competency Gap</span>
                  <div className="p-2 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-2xl font-extrabold font-mono text-amber-700">{myGapCount} Level</div>
                  <div className="text-[11px] text-slate-500 mt-1">Kesenjangan yang perlu ditutup</div>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Status Tindak Lanjut:</span>
                  <StatusBadge status="UNDER REVIEW" size="sm" />
                </div>
              </div>

              {/* Card 3: My Learning Progress */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase">My Learning Progress</span>
                  <div className="p-2 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
                    <Route className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-2xl font-extrabold font-mono text-blue-700">{myAvgProgress}%</div>
                  <div className="text-[11px] text-slate-500 mt-1">{myPaths.length} Jalur Belajar terdaftar</div>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${myAvgProgress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Card 4: My TNA Recommendation */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase">Rekomendasi Pelatihan (TNA)</span>
                  <div className="p-2 rounded-lg bg-purple-50 text-purple-700 border border-purple-200">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-base font-bold text-slate-900 leading-snug truncate">
                    {primaryTNA ? primaryTNA.trainingName : 'Belum Ada Usulan'}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Metode: {primaryTNA ? primaryTNA.method : '-'} · {primaryTNA ? primaryTNA.duration : '-'}
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Status Program:</span>
                  <StatusBadge status={primaryTNA ? primaryTNA.status : 'DRAFT'} size="sm" />
                </div>
              </div>

              {/* Card 5: Recommended Solution */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase">Solusi Pembelajaran</span>
                  <div className="p-2 rounded-lg bg-teal-50 text-teal-700 border border-teal-200">
                    <Lightbulb className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-2xl font-extrabold font-mono text-slate-900">
                    {mySolutions.length ? mySolutions[0].type : 'Blended Learning'}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">Modalitas pembelajaran direkomendasikan</div>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Kesesuaian:</span>
                  <span className="font-bold text-emerald-700">94% Cocok</span>
                </div>
              </div>

              {/* Card 6: My LNA Status */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase">Status Siklus LNA</span>
                  <div className="p-2 rounded-lg bg-emerald-50 text-[#00843D] border border-emerald-200">
                    <FileCheck2 className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-2xl font-extrabold font-mono text-[#00843D]">FINAL</div>
                  <div className="text-[11px] text-slate-500 mt-1">Laporan resmi LNA {activeYear}</div>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Periode:</span>
                  <span className="font-bold text-slate-700">{activePeriodLabel}</span>
                </div>
              </div>
            </div>

            {/* List Detail Hasil Analisis Kompetensi Pegawai dengan Kolom Periode */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Daftar Penilaian Kompetensi Personal</h3>
                  <p className="text-xs text-slate-500">
                    Data kompetensi terdaftar untuk {currentUser.name} pada periode {activePeriodLabel}.
                  </p>
                </div>
                <span className="text-xs text-slate-500 font-mono">{myCCA.length} Kompetensi</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8FAFC] border-b border-slate-200 text-slate-600 uppercase text-[10px] font-bold">
                    <tr>
                      <th className="px-3.5 py-2.5">Kompetensi</th>
                      <th className="px-3.5 py-2.5 text-center">Current</th>
                      <th className="px-3.5 py-2.5 text-center">Required</th>
                      <th className="px-3.5 py-2.5 text-center">Gap</th>
                      <th className="px-3.5 py-2.5">Prioritas</th>
                      <th className="px-3.5 py-2.5">Periode Data</th>
                      <th className="px-3.5 py-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {myCCA.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/60">
                        <td className="px-3.5 py-3 font-semibold text-slate-900">{item.competency}</td>
                        <td className="px-3.5 py-3 text-center font-mono">{item.currentLevel}</td>
                        <td className="px-3.5 py-3 text-center font-mono">{item.requiredLevel}</td>
                        <td className="px-3.5 py-3 text-center font-bold text-amber-700 font-mono">
                          {item.gap > 0 ? `-${item.gap}` : '0'}
                        </td>
                        <td className="px-3.5 py-3">
                          <PriorityBadge priority={item.priority} size="sm" />
                        </td>
                        <td className="px-3.5 py-3 font-medium text-slate-600">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10.5px]">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            {item.month || 'Januari'} {item.year || activeYear}
                          </span>
                        </td>
                        <td className="px-3.5 py-3">
                          <StatusBadge status={item.status} size="sm" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  // ----------------------------------------------------
  // 2. MANAGEMENT DASHBOARD
  // ----------------------------------------------------
  if (currentUser.role === 'MANAGEMENT') {
    const totalEmployees = 18; // Master data karyawan
    const totalGap = periodFilteredCCA.reduce((acc, curr) => acc + (curr.gap > 0 ? curr.gap : 0), 0);
    const highPriorityGap = periodFilteredCCA.filter((c) => c.priority === 'High' || c.gap >= 2).length;
    const learningProgress = periodFilteredPaths.length
      ? `${Math.round(periodFilteredPaths.reduce((sum, p) => sum + p.progress, 0) / periodFilteredPaths.length)}%`
      : '0%';
    const tnaProgress = periodFilteredTNA.length ? `${periodFilteredTNA.length * 10}%` : '0%';
    const totalSolutions = periodFilteredSolutions.length;
    const pendingReviewCount = periodFilteredReviews.filter(
      (r) => r.status === 'Menunggu Review' || r.status === 'Perlu Revisi'
    ).length;

    // Charts data for Management filtered dynamically
    const gapByCategoryData = [
      {
        category: 'Data & Analytics',
        gap: periodFilteredCCA
          .filter((c) => c.competency.includes('Data'))
          .reduce((sum, c) => sum + c.gap, 0) || (periodFilteredCCA.length ? 14 : 0),
      },
      {
        category: 'Execution & Agile',
        gap: periodFilteredCCA
          .filter((c) => c.competency.includes('Project') || c.competency.includes('Process'))
          .reduce((sum, c) => sum + c.gap, 0) || (periodFilteredCCA.length ? 10 : 0),
      },
      {
        category: 'Strategy & Architecture',
        gap: periodFilteredCCA
          .filter((c) => c.competency.includes('Architecture') || c.competency.includes('Solving'))
          .reduce((sum, c) => sum + c.gap, 0) || (periodFilteredCCA.length ? 8 : 0),
      },
      {
        category: 'Cyber & Security',
        gap: periodFilteredCCA
          .filter((c) => c.competency.includes('Security') || c.competency.includes('Cloud'))
          .reduce((sum, c) => sum + c.gap, 0) || (periodFilteredCCA.length ? 6 : 0),
      },
    ];

    const tnaApprovedCount = periodFilteredTNA.filter((t) => t.status === 'APPROVED' || t.status === 'FINAL').length;
    const tnaUnderReviewCount = periodFilteredTNA.filter((t) => t.status === 'UNDER REVIEW').length;
    const tnaRevisionCount = periodFilteredTNA.filter((t) => t.status === 'REVISION REQUIRED').length;
    const tnaDraftCount = periodFilteredTNA.filter((t) => t.status === 'DRAFT' || t.status === 'SUBMITTED').length;

    const tnaStatusData = [
      { name: 'Approved', value: tnaApprovedCount || 0, color: '#00843D' },
      { name: 'Under Review', value: tnaUnderReviewCount || 0, color: '#EAB308' },
      { name: 'Revision Req', value: tnaRevisionCount || 0, color: '#F97316' },
      { name: 'Draft', value: tnaDraftCount || 0, color: '#94A3B8' },
    ];

    const hasData = periodFilteredCCA.length > 0 || periodFilteredTNA.length > 0;

    return (
      <div className="space-y-6">
        {/* Management Header Banner */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-[#00843D] uppercase tracking-wider">
                Executive Console · {currentUser.unit}
              </span>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#006B32] border border-emerald-200">
                Data Periode: {activePeriodLabel}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1.5">
              Management Dashboard
            </h1>
            <p className="text-xs md:text-sm text-slate-500 mt-1">
              Monitoring performa dan evaluasi kebutuhan pembelajaran unit untuk periode <strong className="text-slate-700">{activePeriodLabel}</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => onNavigate('review-feedback')}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#00843D]" />
              <span>Buka Masukan Review ({pendingReviewCount})</span>
            </button>
            <button
              onClick={() => onNavigate('lna-report')}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#00843D] hover:bg-[#006B32] rounded-lg transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <span>Executive LNA Report</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Global Period Filter Component */}
        <PeriodFilter
          selectedYear={activeYear}
          selectedPeriod={activePeriod}
          onYearChange={handleYearChange}
          onPeriodChange={handlePeriodChange}
        />

        {/* Empty State Banner jika tidak ada data */}
        {!hasData && (
          <div className="bg-white rounded-xl border border-dashed border-slate-300 p-8 text-center shadow-2xs">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Inbox className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">
              Belum Ada Data Monitoring LNA untuk Periode {activePeriodLabel}
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Tidak ditemukan data penilaian kompetensi unit pada periode ini. Silakan ubah filter periode untuk melihat data 2025 atau siklus kuartal lainnya.
            </p>
          </div>
        )}

        {/* 7 Management Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3.5">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase block">Total Pegawai</span>
            <div className="text-xl font-bold font-mono text-slate-900 mt-1">{totalEmployees}</div>
            <span className="text-[10px] text-slate-400">Master Data Unit</span>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase block">Competency Gap</span>
            <div className="text-xl font-bold font-mono text-amber-700 mt-1">{totalGap}</div>
            <span className="text-[10px] text-slate-400">Periode {activePeriod}</span>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase block">High Priority Gap</span>
            <div className="text-xl font-bold font-mono text-rose-600 mt-1">{highPriorityGap}</div>
            <span className="text-[10px] text-rose-600 font-semibold">Gap $\ge$ 2 Level</span>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase block">Learning Progress</span>
            <div className="text-xl font-bold font-mono text-blue-700 mt-1">{learningProgress}</div>
            <span className="text-[10px] text-emerald-700 font-semibold">{periodFilteredPaths.length} Kurikulum</span>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase block">TNA Usulan</span>
            <div className="text-xl font-bold font-mono text-teal-700 mt-1">{periodFilteredTNA.length}</div>
            <span className="text-[10px] text-slate-400">Usulan Diklat Aktif</span>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase block">Learning Solution</span>
            <div className="text-xl font-bold font-mono text-purple-700 mt-1">{totalSolutions}</div>
            <span className="text-[10px] text-slate-400">Modalitas Terpetakan</span>
          </div>

          <div className="bg-white rounded-xl border border-amber-300 bg-amber-50/40 p-4 shadow-xs">
            <span className="text-[11px] font-bold text-amber-800 uppercase block">Review Pending</span>
            <div className="text-xl font-bold font-mono text-amber-900 mt-1">{pendingReviewCount}</div>
            <span className="text-[10px] text-amber-700 font-semibold">Menunggu Tindakan</span>
          </div>
        </div>

        {/* Section: Pending Review for Management */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Pending Review & Action Items</h3>
              <p className="text-xs text-slate-500">
                Daftar paket LNA yang menunggu evaluasi pimpinan untuk periode {activePeriodLabel}.
              </p>
            </div>
            <span className="text-xs text-slate-400 font-mono">{activePeriodLabel}</span>
          </div>

          {periodFilteredReviews.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-400">
              Tidak ada antrean review pending untuk periode ini.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {periodFilteredReviews.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-slate-900 truncate">
                        {item.targetItemTitle || item.category}
                      </span>
                      <StatusBadge status={item.status as any} size="sm" />
                    </div>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed line-clamp-2">
                      {item.comment}
                    </p>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 font-medium">
                      {item.month || 'Januari'} {item.year || activeYear}
                    </span>
                    <button
                      onClick={() => onOpenReviewModal?.(item.category, item.targetItemTitle)}
                      className="px-3 py-1 text-xs font-semibold text-white bg-[#00843D] hover:bg-[#006B32] rounded-md transition-colors cursor-pointer"
                    >
                      Buka Review
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Charts: Competency Gap by Category & TNA Status */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Competency Gap by Category</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Akumulasi kesenjangan kompetensi unit pada periode {activePeriodLabel}.
                </p>
              </div>
              <span className="text-xs font-bold text-[#00843D]">{activePeriodLabel}</span>
            </div>
            <div className="h-64 mt-4 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gapByCategoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="category" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1E293B', color: '#fff', borderRadius: '8px', fontSize: '12px', border: 'none' }}
                  />
                  <Bar dataKey="gap" name="Akumulasi Gap" fill="#00843D" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">TNA Review Status Composition</h3>
              <p className="text-xs text-slate-500 mt-0.5">Komposisi status usulan diklat unit ({activePeriodLabel}).</p>
            </div>
            <div className="h-52 my-2 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={tnaStatusData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                    {tnaStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1E293B', color: '#fff', borderRadius: '8px', fontSize: '12px', border: 'none' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
              {tnaStatusData.map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-600 truncate">{item.name}:</span>
                  <span className="font-bold text-slate-900 font-mono ml-auto">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // 3. ADMIN DASHBOARD
  // ----------------------------------------------------
  const totalEmployees = 18; // Data master karyawan
  const totalCompetencies = 128; // Kamus standar kompetensi
  const totalCompetencyGaps = periodFilteredCCA.reduce(
    (acc, curr) => acc + (curr.gap > 0 ? curr.gap : 0),
    0
  );
  const totalTNA = periodFilteredTNA.length;
  const pendingReview = periodFilteredCCA.filter((c) => c.status === 'UNDER REVIEW').length;
  const revisionRequired = periodFilteredCCA.filter((c) => c.status === 'REVISION REQUIRED').length;
  const approvedCount = periodFilteredCCA.filter((c) => c.status === 'APPROVED').length;
  const finalLNA = periodFilteredCCA.filter((c) => c.status === 'FINAL').length;

  // Chart data trend yang dinamis mengikuti filter periode
  const trendChartData = useMemo(() => {
    if (activePeriod === 'Semua Periode') {
      const q1Items = periodFilteredCCA.filter(
        (c) => c.quarter === 'Q1' || PERIOD_CONFIG.Q1.includes(c.month as any)
      );
      const q2Items = periodFilteredCCA.filter(
        (c) => c.quarter === 'Q2' || PERIOD_CONFIG.Q2.includes(c.month as any)
      );

      return [
        {
          name: `Kuartal 1 (Jan–Jun) ${activeYear}`,
          High: q1Items.filter((c) => c.priority === 'High' || c.gap >= 2).length,
          Medium: q1Items.filter((c) => c.priority === 'Medium' || c.gap === 1).length,
          Low: q1Items.filter((c) => c.priority === 'Low' || c.gap === 0).length,
        },
        {
          name: `Kuartal 2 (Jul–Des) ${activeYear}`,
          High: q2Items.filter((c) => c.priority === 'High' || c.gap >= 2).length,
          Medium: q2Items.filter((c) => c.priority === 'Medium' || c.gap === 1).length,
          Low: q2Items.filter((c) => c.priority === 'Low' || c.gap === 0).length,
        },
      ];
    }

    if (activePeriod === 'Kuartal 1') {
      return PERIOD_CONFIG.Q1.map((m) => {
        const mItems = periodFilteredCCA.filter((c) => c.month === m);
        return {
          name: m,
          High: mItems.filter((c) => c.priority === 'High').length,
          Medium: mItems.filter((c) => c.priority === 'Medium').length,
          Low: mItems.filter((c) => c.priority === 'Low').length,
        };
      });
    }

    if (activePeriod === 'Kuartal 2') {
      return PERIOD_CONFIG.Q2.map((m) => {
        const mItems = periodFilteredCCA.filter((c) => c.month === m);
        return {
          name: m,
          High: mItems.filter((c) => c.priority === 'High').length,
          Medium: mItems.filter((c) => c.priority === 'Medium').length,
          Low: mItems.filter((c) => c.priority === 'Low').length,
        };
      });
    }

    // Specific Month
    return [
      {
        name: `${activePeriod} ${activeYear}`,
        High: periodFilteredCCA.filter((c) => c.priority === 'High').length,
        Medium: periodFilteredCCA.filter((c) => c.priority === 'Medium').length,
        Low: periodFilteredCCA.filter((c) => c.priority === 'Low').length,
      },
    ];
  }, [periodFilteredCCA, activeYear, activePeriod]);

  const hasData = periodFilteredCCA.length > 0 || periodFilteredTNA.length > 0;

  return (
    <div className="space-y-6">
      {/* Admin Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-[#00843D] uppercase tracking-wider">
              Pusat Kendali Pengelolaan LNA · Role: ADMIN
            </span>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#006B32] border border-emerald-200">
              Data Periode: {activePeriodLabel}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1.5">
            Admin Dashboard
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Pengelolaan data master kompetensi, analisis CCA/DNA, kurikulum Learning Path, dan tindak lanjut periode <strong className="text-slate-700">{activePeriodLabel}</strong>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onNavigate('master-data')}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Users className="w-3.5 h-3.5 text-[#00843D]" />
            <span>Master Pegawai & Kamus</span>
          </button>
          <button
            onClick={() => onNavigate('review-feedback')}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
            <span>Antrean Masukan ({periodFilteredReviews.length})</span>
          </button>
          <button
            onClick={() => onNavigate('cca')}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#00843D] hover:bg-[#006B32] rounded-lg transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <span>+ Kelola Data CCA</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Global Period Filter Component */}
      <PeriodFilter
        selectedYear={activeYear}
        selectedPeriod={activePeriod}
        onYearChange={handleYearChange}
        onPeriodChange={handlePeriodChange}
      />

      {/* Empty State Banner jika tidak ada data */}
      {!hasData && (
        <div className="bg-white rounded-xl border border-dashed border-slate-300 p-8 text-center shadow-2xs">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Inbox className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">
            Belum Ada Data LNA untuk Periode {activePeriodLabel}
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Tidak ditemukan data evaluasi kompetensi pada periode yang dipilih. Anda dapat mengganti filter tahun atau bulan/kuartal, atau menambahkan data CCA baru dengan periode {activePeriodLabel}.
          </p>
        </div>
      )}

      {/* 8 Admin Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs">
          <span className="text-[10px] font-semibold text-slate-500 uppercase block truncate">Total Pegawai</span>
          <div className="text-lg font-bold font-mono text-slate-900 mt-1">{totalEmployees}</div>
          <span className="text-[9.5px] text-slate-400">Master Data</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs">
          <span className="text-[10px] font-semibold text-slate-500 uppercase block truncate">Total Kompetensi</span>
          <div className="text-lg font-bold font-mono text-slate-900 mt-1">{totalCompetencies}</div>
          <span className="text-[9.5px] text-slate-400">Kamus Corpu</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs">
          <span className="text-[10px] font-semibold text-slate-500 uppercase block truncate">Competency Gap</span>
          <div className="text-lg font-bold font-mono text-amber-700 mt-1">{totalCompetencyGaps}</div>
          <span className="text-[9.5px] text-slate-400">{periodFilteredCCA.length} Record CCA</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs">
          <span className="text-[10px] font-semibold text-slate-500 uppercase block truncate">Total TNA</span>
          <div className="text-lg font-bold font-mono text-blue-700 mt-1">{totalTNA}</div>
          <span className="text-[9.5px] text-slate-400">Usulan Diklat</span>
        </div>

        <div className="bg-white rounded-xl border border-amber-200 bg-amber-50/30 p-3.5 shadow-xs">
          <span className="text-[10px] font-bold text-amber-800 uppercase block truncate">Pending Review</span>
          <div className="text-lg font-bold font-mono text-amber-900 mt-1">{pendingReview}</div>
          <span className="text-[9.5px] text-amber-700 font-semibold">Under Review</span>
        </div>

        <div className="bg-white rounded-xl border border-orange-200 bg-orange-50/30 p-3.5 shadow-xs">
          <span className="text-[10px] font-bold text-orange-800 uppercase block truncate">Revision Req.</span>
          <div className="text-lg font-bold font-mono text-orange-900 mt-1">{revisionRequired}</div>
          <span className="text-[9.5px] text-orange-700 font-semibold">Perlu Revisi</span>
        </div>

        <div className="bg-white rounded-xl border border-emerald-200 bg-emerald-50/30 p-3.5 shadow-xs">
          <span className="text-[10px] font-bold text-[#006B32] uppercase block truncate">Approved</span>
          <div className="text-lg font-bold font-mono text-[#006B32] mt-1">{approvedCount}</div>
          <span className="text-[9.5px] text-emerald-700 font-semibold">Disetujui</span>
        </div>

        <div className="bg-white rounded-xl border border-[#00843D] bg-[#00843D]/5 p-3.5 shadow-xs">
          <span className="text-[10px] font-bold text-[#00843D] uppercase block truncate">Final LNA</span>
          <div className="text-lg font-bold font-mono text-[#00843D] mt-1">{finalLNA}</div>
          <span className="text-[9.5px] text-emerald-800 font-semibold">Difinalisasi</span>
        </div>
      </div>

      {/* Tabel Ringkasan Data LNA Periode Terpilih */}
      {hasData && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Arsip Data Analisis Kebutuhan Pembelajaran (CCA)
              </h3>
              <p className="text-xs text-slate-500">
                Data resmi yang terdaftar pada periode <strong className="text-slate-700">{activePeriodLabel}</strong>.
              </p>
            </div>
            <button
              onClick={() => onNavigate('cca')}
              className="text-xs font-semibold text-[#00843D] hover:underline"
            >
              Buka Modul CCA Lengkap →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] border-b border-slate-200 text-slate-600 uppercase text-[10px] font-bold">
                <tr>
                  <th className="px-3.5 py-2.5">Karyawan</th>
                  <th className="px-3.5 py-2.5">Kompetensi</th>
                  <th className="px-3.5 py-2.5 text-center">Gap</th>
                  <th className="px-3.5 py-2.5">Prioritas</th>
                  <th className="px-3.5 py-2.5">Periode Data</th>
                  <th className="px-3.5 py-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {periodFilteredCCA.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60">
                    <td className="px-3.5 py-3 font-semibold text-slate-900">{item.employeeName}</td>
                    <td className="px-3.5 py-3 text-slate-700">{item.competency}</td>
                    <td className="px-3.5 py-3 text-center font-bold text-amber-700 font-mono">
                      {item.gap > 0 ? `-${item.gap}` : '0'}
                    </td>
                    <td className="px-3.5 py-3">
                      <PriorityBadge priority={item.priority} size="sm" />
                    </td>
                    <td className="px-3.5 py-3 font-medium text-slate-600">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10.5px]">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {item.month || 'Januari'} {item.year || activeYear} ({item.quarter || 'Q1'})
                      </span>
                    </td>
                    <td className="px-3.5 py-3">
                      <StatusBadge status={item.status} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Management Review Queue Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Management Review Queue</h3>
            <p className="text-xs text-slate-500">
              Umpan balik dan revisi dari Manajemen untuk periode {activePeriodLabel}.
            </p>
          </div>
          <button
            onClick={() => onNavigate('review-feedback')}
            className="text-xs font-semibold text-[#00843D] hover:underline"
          >
            Lihat Semua Antrean ({periodFilteredReviews.length}) →
          </button>
        </div>

        {periodFilteredReviews.length === 0 ? (
          <div className="p-4 text-center text-xs text-slate-400">
            Tidak ada ulasan manajemen pada periode {activePeriodLabel}.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Column 1: Menunggu Review */}
            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/30 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-900">Menunggu Review</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold font-mono">
                  {periodFilteredReviews.filter((r) => r.status === 'Menunggu Review').length}
                </span>
              </div>
              <div className="space-y-2 text-xs">
                {periodFilteredReviews
                  .filter((r) => r.status === 'Menunggu Review')
                  .slice(0, 2)
                  .map((item) => (
                    <div key={item.id} className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
                      <div className="font-semibold text-slate-900 leading-snug">{item.targetItemTitle}</div>
                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">{item.comment}</p>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[10px] text-slate-400">
                        <span>{item.category}</span>
                        <PriorityBadge priority={item.priority} size="sm" />
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Column 2: Perlu Revisi */}
            <div className="p-4 rounded-xl border border-orange-200 bg-orange-50/30 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-orange-900">Perlu Revisi (Action Required)</span>
                <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 text-[10px] font-bold font-mono">
                  {periodFilteredReviews.filter((r) => r.status === 'Perlu Revisi').length}
                </span>
              </div>
              <div className="space-y-2 text-xs">
                {periodFilteredReviews
                  .filter((r) => r.status === 'Perlu Revisi')
                  .slice(0, 2)
                  .map((item) => (
                    <div key={item.id} className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
                      <div className="font-semibold text-slate-900 leading-snug">{item.targetItemTitle}</div>
                      <p className="text-[11px] text-orange-800 bg-orange-50 p-1.5 rounded mt-1 leading-relaxed">
                        {item.comment}
                      </p>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[10px]">
                        <span className="text-slate-400 font-medium">Modul: {item.category}</span>
                        <button
                          onClick={() => onNavigate('cca')}
                          className="font-bold text-[#00843D] hover:underline"
                        >
                          Buka & Perbaiki →
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Column 3: Sudah Disetujui */}
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/30 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#006B32]">Sudah Disetujui (Approved)</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-[#006B32] text-[10px] font-bold font-mono">
                  {periodFilteredReviews.filter((r) => r.status === 'Disetujui').length}
                </span>
              </div>
              <div className="space-y-2 text-xs">
                {periodFilteredReviews
                  .filter((r) => r.status === 'Disetujui')
                  .slice(0, 2)
                  .map((item) => (
                    <div key={item.id} className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
                      <div className="font-semibold text-slate-900 leading-snug">{item.targetItemTitle}</div>
                      <p className="text-[11px] text-slate-600 line-clamp-2 mt-1">{item.comment}</p>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[10px]">
                        <span className="text-[#00843D] font-bold">Siap Finalisasi</span>
                        <StatusBadge status="APPROVED" size="sm" />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Chart: Competency Gap Trend (Mengikuti Periode) */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Competency Gap Trend ({activePeriodLabel})
            </h3>
            <p className="text-xs text-slate-500">
              Sebaran kesenjangan kompetensi High, Medium, dan Low berdasarkan filter periode aktif.
            </p>
          </div>
          <button
            onClick={() => onNavigate('cca')}
            className="text-xs font-semibold text-[#00843D] hover:underline"
          >
            Buka Tabel CCA Lengkap →
          </button>
        </div>
        <div className="h-64 mt-3 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trendChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1E293B', color: '#fff', borderRadius: '8px', fontSize: '12px', border: 'none' }}
              />
              <Bar dataKey="High" name="High Priority Gap" fill="#EF4444" radius={[3, 3, 0, 0]} />
              <Bar dataKey="Medium" name="Medium Priority Gap" fill="#F59E0B" radius={[3, 3, 0, 0]} />
              <Bar dataKey="Low" name="Low Priority Gap" fill="#00843D" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
