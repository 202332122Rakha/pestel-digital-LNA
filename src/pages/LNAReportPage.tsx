import React, { useState, useMemo } from 'react';
import {
  Printer,
  Download,
  Calendar,
  Layers,
  TrendingUp,
  GraduationCap,
  Lightbulb,
  FileCheck2,
  CheckCircle2,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Building2,
  FileSpreadsheet,
  MessageSquare,
  Lock,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { User, CCAItem, DNAItem, TNAItem, LearningSolutionItem, ReviewFeedback } from '../types';
import { printReportPage, exportToCSV, formatDate } from '../utils/helpers';
import { StatusBadge, PriorityBadge, ViewOnlyBadge } from '../components/StatusBadge';
import { ReviewModal } from '../components/ReviewModal';
import { ConfirmDialog } from '../components/ConfirmDialog';

interface LNAReportPageProps {
  currentUser: User;
  ccaList: CCAItem[];
  dnaList: DNAItem[];
  tnaList: TNAItem[];
  solutions: LearningSolutionItem[];
  isFinalized?: boolean;
  onFinalizeLNA?: () => void;
  onSubmitReview: (review: Omit<ReviewFeedback, 'id' | 'createdAt'>) => void;
  onShowToast: (type: 'success' | 'error' | 'info' | 'warning', message: string, title?: string) => void;
}

export const LNAReportPage: React.FC<LNAReportPageProps> = ({
  currentUser,
  ccaList,
  dnaList,
  tnaList,
  solutions,
  isFinalized = false,
  onFinalizeLNA,
  onSubmitReview,
  onShowToast,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState('2026');
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isFinalizeConfirmOpen, setIsFinalizeConfirmOpen] = useState(false);

  // Strict role filtering: User Dasar only sees own LNA summary
  const myCCA = useMemo(() => {
    if (currentUser.role === 'USER DASAR') {
      return ccaList.filter((c) => c.employeeName.toLowerCase().includes(currentUser.name.toLowerCase()));
    }
    return ccaList;
  }, [ccaList, currentUser]);

  const totalCompetencyGaps = currentUser.role === 'USER DASAR'
    ? myCCA.reduce((sum, item) => sum + item.gap, 0)
    : ccaList.reduce((acc, curr) => acc + (curr.gap > 0 ? curr.gap : 0), 0) + 78;

  const totalTNA = currentUser.role === 'USER DASAR' ? 1 : tnaList.length + 41;
  const totalSolutions = currentUser.role === 'USER DASAR' ? 2 : solutions.length + 29;

  // Chart A: Top Competency Gap
  const topGapData = currentUser.role === 'USER DASAR'
    ? myCCA.map((c) => ({ competency: c.competency, gap: c.gap }))
    : [
        { competency: 'Data Analysis', gap: 26 },
        { competency: 'Leadership', gap: 22 },
        { competency: 'Digital Design', gap: 16 },
        { competency: 'Problem Solving', gap: 14 },
        { competency: 'Project Management', gap: 12 },
      ];

  // Chart B: Top Training Needs
  const topTrainingNeeds = [
    { rank: 1, name: 'Advanced Data Analysis & Machine Learning', participants: 18, priority: 'High', method: 'In Class' },
    { rank: 2, name: 'Agile Squad Leadership & Stakeholder Management', participants: 14, priority: 'High', method: 'Blended' },
    { rank: 3, name: 'Enterprise UI/UX Design System Mastery', participants: 10, priority: 'High', method: 'Digital Learning' },
    { rank: 4, name: 'Agile Project Management with Jira', participants: 16, priority: 'Medium', method: 'In Class' },
    { rank: 5, name: 'Executive Data Storytelling & PowerBI', participants: 20, priority: 'High', method: 'Blended' },
  ];

  // Chart C: Recommended Learning Solution
  const solutionDistData = [
    { name: 'In Class Training', value: 30, color: '#00843D' },
    { name: 'Blended Learning', value: 35, color: '#006B32' },
    { name: 'Digital Learning', value: 20, color: '#0284C7' },
    { name: 'Coaching', value: 10, color: '#F59E0B' },
    { name: 'Mentoring', value: 5, color: '#8B5CF6' },
  ];

  const handlePrint = () => {
    onShowToast('info', 'Membuka dialog cetak laporan eksekutif...', 'Cetak Laporan');
    setTimeout(() => {
      printReportPage();
    }, 200);
  };

  const handleExportCSV = () => {
    const reportData = myCCA.map((item, idx) => ({
      No: idx + 1,
      NamaPegawai: item.employeeName,
      Unit: item.unit,
      Jabatan: item.position,
      Kompetensi: item.competency,
      CurrentLevel: item.currentLevel,
      RequiredLevel: item.requiredLevel,
      Gap: item.gap,
      Prioritas: item.priority,
      Status: item.status,
      IsuBisnis: item.businessIssue,
    }));
    exportToCSV(reportData, `LNA_Report_PLN_Corpu_${selectedPeriod}_${currentUser.role.replace(' ', '_')}`);
    onShowToast('success', 'Data laporan LNA berhasil diexport ke CSV.', 'Export Berhasil');
  };

  return (
    <div className="space-y-6 print-page">
      {/* Executive Header & Print/Export Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-[#00843D] uppercase tracking-wider">
              {currentUser.role === 'USER DASAR' ? 'Laporan Personal' : 'Executive Summary · Dokumen Resmi'}
            </span>
            {currentUser.role === 'USER DASAR' && <ViewOnlyBadge label="VIEW ONLY - DATA PRIBADI" />}
            {currentUser.role === 'MANAGEMENT' && <ViewOnlyBadge label="MANAGEMENT EVALUATION" />}
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
            {currentUser.role === 'USER DASAR' ? 'My LNA Report' : 'LNA Report'}
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            {currentUser.role === 'USER DASAR'
              ? 'Laporan hasil evaluasi kesenjangan dan rekomendasi pengembangan kompetensi individual Anda.'
              : 'Laporan komprehensif hasil analisis kebutuhan pembelajaran Sub Bidang Pengelolaan Pembelajaran, Asesmen dan Sertifikasi Berbasis Digital (Bidang Perencanaan).'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 no-print">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F5F7F9] border border-slate-200 rounded-lg text-xs font-semibold text-slate-700">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Periode {selectedPeriod}</span>
          </div>

          {currentUser.role === 'ADMIN' && (
            <button
              onClick={() => setIsFinalizeConfirmOpen(true)}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 shadow-xs cursor-pointer ${
                isFinalized
                  ? 'bg-purple-100 text-purple-900 border border-purple-300'
                  : 'bg-[#00843D] hover:bg-[#006B32] text-white'
              }`}
              title="Finalisasi hasil LNA & terbitkan dokumen resmi"
            >
              <ShieldCheck className="w-4 h-4 text-yellow-300" />
              <span>{isFinalized ? 'LNA Difinalisasi (FINAL)' : 'Finalisasi LNA'}</span>
            </button>
          )}

          {currentUser.role === 'MANAGEMENT' && (
            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-[#00843D] hover:bg-[#006B32] rounded-lg transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Review / Approve LNA</span>
            </button>
          )}

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Data</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#00843D] hover:bg-[#006B32] rounded-lg transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Corporate Metadata Box */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
        <div>
          <span className="text-slate-400 block text-[10px] font-semibold uppercase">ORGANISASI</span>
          <span className="font-bold text-slate-900">PLN Corporate University</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[10px] font-semibold uppercase">BIDANG / SUB BIDANG</span>
          <span className="font-bold text-slate-900 block leading-tight">Bidang Perencanaan</span>
          <span className="text-[10px] text-slate-500 block leading-tight mt-0.5 truncate" title="Sub Bidang Pengelolaan Pembelajaran, Asesmen dan Sertifikasi Berbasis Digital">Sub Bidang Digital</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[10px] font-semibold uppercase">AKUN PENGAKSES</span>
          <span className="font-bold text-slate-900">{currentUser.name} ({currentUser.role})</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[10px] font-semibold uppercase">STATUS DOKUMEN</span>
          <div className="mt-0.5">
            <StatusBadge status={isFinalized ? 'FINAL' : 'APPROVED'} size="sm" />
          </div>
        </div>
      </div>

      {/* 4 Statistic Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <span className="text-xs font-medium text-slate-500">
            {currentUser.role === 'USER DASAR' ? 'Kompetensi Dinilai' : 'Total Kompetensi'}
          </span>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-2">
            {currentUser.role === 'USER DASAR' ? myCCA.length : 128}
          </div>
          <span className="text-[11px] text-emerald-700 font-medium">Standard Kamus Corpu</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <span className="text-xs font-medium text-slate-500">
            {currentUser.role === 'USER DASAR' ? 'Gap Kompetensi Saya' : 'Total Gap'}
          </span>
          <div className="text-2xl font-bold font-mono text-amber-700 mt-2">{totalCompetencyGaps}</div>
          <span className="text-[11px] text-slate-400 font-medium">Poin kesenjangan teridentifikasi</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Total Program TNA</span>
          <div className="text-2xl font-bold font-mono text-blue-700 mt-2">{totalTNA}</div>
          <span className="text-[11px] text-slate-400 font-medium">Usulan program terpetakan</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Learning Solution</span>
          <div className="text-2xl font-bold font-mono text-[#00843D] mt-2">{totalSolutions}</div>
          <span className="text-[11px] text-slate-400 font-medium">Modalitas terdefinisi</span>
        </div>
      </div>

      {/* Charts Section: A & B */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Section A: Top Competency Gap */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              {currentUser.role === 'USER DASAR' ? 'A. Peta Kesenjangan Kompetensi Anda' : 'A. Top Competency Gap'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Kompetensi dengan gap yang menjadi prioritas utama intervensi pembelajaran.
            </p>
          </div>

          <div className="h-64 mt-3 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topGapData}
                layout="vertical"
                margin={{ top: 10, right: 30, left: 40, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <YAxis
                  type="category"
                  dataKey="competency"
                  tick={{ fontSize: 11, fill: '#334155', fontWeight: 600 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1E293B', color: '#fff', borderRadius: '8px', fontSize: '12px', border: 'none' }}
                />
                <Bar dataKey="gap" name="Gap Level" fill="#00843D" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex items-center justify-between">
            <span>Target remedi gap terproyeksi melalui program Q1-Q2 2026</span>
            <span className="font-semibold text-[#00843D]">Prioritas Terverifikasi</span>
          </div>
        </div>

        {/* Section B: Top Training Needs */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">B. Top Training Needs</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Peringkat usulan program pelatihan berdasarkan bobot dampak strategis organisasi.
            </p>
          </div>

          <div className="space-y-2.5 my-3">
            {topTrainingNeeds.map((item) => (
              <div
                key={item.rank}
                className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/50 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-slate-200 font-bold text-[10px] text-slate-700 flex items-center justify-center shrink-0">
                    {item.rank}
                  </span>
                  <div>
                    <div className="font-semibold text-slate-900 leading-snug">{item.name}</div>
                    <div className="text-[10.5px] text-slate-400 mt-0.5">
                      {item.method} · {item.participants} Peserta
                    </div>
                  </div>
                </div>
                <PriorityBadge priority={item.priority as any} size="sm" />
              </div>
            ))}
          </div>

          <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            Total usulan di atas mencakup 78 target pegawai Sub Bidang Pengelolaan Pembelajaran, Asesmen dan Sertifikasi Berbasis Digital (Bidang Perencanaan).
          </div>
        </div>
      </div>

      {/* Section C: Recommended Learning Solution & Section D: Ringkasan Hasil LNA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">C. Recommended Learning Solution</h3>
            <p className="text-xs text-slate-500 mt-0.5">Proporsi modalitas pembelajaran optimal unit.</p>
          </div>

          <div className="h-56 my-2 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={solutionDistData} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={3} dataKey="value">
                  {solutionDistData.map((entry, index) => (
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
            {solutionDistData.map((s, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                <span className="text-slate-600 truncate">{s.name}:</span>
                <span className="font-bold text-slate-900 font-mono ml-auto">{s.value}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">D. Ringkasan Hasil LNA & Rekomendasi</h3>
            <p className="text-xs text-slate-500 mt-0.5">Kesimpulan dan arahan strategis Corporate University.</p>

            <div className="mt-4 p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 text-xs text-slate-700 leading-relaxed space-y-2">
              <p>
                Berdasarkan hasil analisis CCA, DNA, dan TNA, terdapat beberapa kebutuhan pengembangan kompetensi yang menjadi prioritas. Hasil analisis digunakan sebagai dasar penyusunan Learning Path dan rekomendasi Learning Solution.
              </p>
              <p>
                Seluruh program telah melewati tahap verifikasi kurikulum dan saat ini berada dalam status evaluasi manajemen untuk alokasi batch tahun {selectedPeriod}.
              </p>
            </div>

            <div className="mt-5 space-y-2.5">
              <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">Top Recommendation:</div>
              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2.5 p-2.5 rounded-lg border border-slate-200 bg-white">
                  <CheckCircle2 className="w-4 h-4 text-[#00843D] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900">Implementasi Learning Path untuk Data Analyst:</span>
                    <span className="text-slate-600 ml-1">
                      Akselerasi batch 1 Data Analyst Development Path untuk mendukung agenda predictive energy maintenance PLN.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 rounded-lg border border-slate-200 bg-white">
                  <CheckCircle2 className="w-4 h-4 text-[#00843D] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900">Penguatan program Leadership Development:</span>
                    <span className="text-slate-600 ml-1">
                      Penyelenggaraan Agile Squad Leadership didukung coaching personal bagi project analyst dan perencana digital.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 rounded-lg border border-slate-200 bg-white">
                  <CheckCircle2 className="w-4 h-4 text-[#00843D] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900">Peningkatan akses Digital Learning:</span>
                    <span className="text-slate-600 ml-1">
                      Peningkatan modul micro-learning arsitektur digital dan ISO 27001 yang dapat diakses mandiri 24/7.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Status Dokumen: Diverifikasi untuk Tinjauan Manajemen</span>
            <span className="font-mono">PLN-CORPU-LNA-2026-V1</span>
          </div>
        </div>
      </div>

      {/* Confirm Dialog Finalisasi LNA */}
      <ConfirmDialog
        isOpen={isFinalizeConfirmOpen}
        onClose={() => setIsFinalizeConfirmOpen(false)}
        onConfirm={() => {
          if (onFinalizeLNA) {
            onFinalizeLNA();
            setIsFinalizeConfirmOpen(false);
          }
        }}
        title="Finalisasi Hasil LNA Periode 2026?"
        message="Finalisasi akan mengunci status analisis kebutuhan pembelajaran menjadi FINAL, mempublikasikan dokumen resmi, dan mengirimkan notifikasi konfirmasi ke jajaran Manajemen dan Pegawai."
        confirmText="Finalisasi Sekarang"
        cancelText="Batal"
        isDestructive={false}
      />

      {/* Review Modal for Management */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        currentUser={currentUser}
        targetModule="Laporan"
        targetItemTitle="LNA Report Bidang Perencanaan 2026"
        onSubmitReview={onSubmitReview}
      />
    </div>
  );
};
