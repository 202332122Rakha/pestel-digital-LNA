import React, { useState, useMemo } from 'react';
import {
  Lightbulb,
  BookOpen,
  Monitor,
  Users2,
  UserCheck,
  Compass,
  Briefcase,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  BarChart,
  Target,
  Clock,
  Award,
  MessageSquare,
  Lock,
  Plus,
  Trash2,
} from 'lucide-react';
import { LearningSolutionItem, User, CCAItem, DNAItem, ReviewFeedback, LNAStatus } from '../types';
import { Modal } from '../components/Modal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { StatusBadge, ViewOnlyBadge } from '../components/StatusBadge';
import { ReviewModal } from '../components/ReviewModal';

interface LearningSolutionPageProps {
  currentUser: User;
  solutions: LearningSolutionItem[];
  ccaList: CCAItem[];
  dnaList: DNAItem[];
  onAddSolution?: (sol: Omit<LearningSolutionItem, 'id'>) => void;
  onDeleteSolution?: (id: string) => void;
  onNavigateToTNAWithMethod?: (method: string) => void;
  onSubmitReview: (review: Omit<ReviewFeedback, 'id' | 'createdAt'>) => void;
  onShowToast: (type: 'success' | 'error' | 'info' | 'warning', message: string, title?: string) => void;
}

export const LearningSolutionPage: React.FC<LearningSolutionPageProps> = ({
  currentUser,
  solutions,
  ccaList,
  dnaList,
  onAddSolution,
  onDeleteSolution,
  onNavigateToTNAWithMethod,
  onSubmitReview,
  onShowToast,
}) => {
  const [selectedSolution, setSelectedSolution] = useState<LearningSolutionItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Form State for Add Solution (Admin Only)
  const [formData, setFormData] = useState({
    title: '',
    type: 'In Class Training' as LearningSolutionItem['type'],
    description: '',
    tagsText: 'Interaktif, Lab, Sertifikasi',
    targetAudience: 'Pegawai Sub Bidang Digital (Bidang Perencanaan)',
    durationRange: '3 Hari',
    effectivenessRate: 90,
    suitabilityScore: 85,
    recommendedForText: 'Data Analysis, Leadership',
    recommendedEmployeesText: 'Andi Pratama, Budi Santoso',
    implementationGuide: 'Dilaksanakan di fasilitas PLN Corpu Pusdiklat dengan evaluasi pre/post test.',
    status: 'APPROVED' as LNAStatus,
  });

  // Strict role filtering: User Dasar only sees recommended solutions for them
  const accessibleSolutions = useMemo(() => {
    if (currentUser.role === 'USER DASAR') {
      return solutions.filter((s) =>
        s.recommendedEmployees?.some((e) => e.toLowerCase().includes(currentUser.name.toLowerCase()))
      );
    }
    return solutions;
  }, [solutions, currentUser]);

  const getMethodIcon = (type: LearningSolutionItem['type']) => {
    switch (type) {
      case 'In Class Training':
        return <BookOpen className="w-5 h-5 text-blue-600" />;
      case 'Digital Learning':
        return <Monitor className="w-5 h-5 text-purple-600" />;
      case 'Blended Learning':
        return <Users2 className="w-5 h-5 text-[#00843D]" />;
      case 'Coaching':
        return <UserCheck className="w-5 h-5 text-amber-600" />;
      case 'Mentoring':
        return <Compass className="w-5 h-5 text-indigo-600" />;
      case 'On-the-Job Learning':
        return <Briefcase className="w-5 h-5 text-teal-600" />;
      default:
        return <Lightbulb className="w-5 h-5 text-slate-600" />;
    }
  };

  const handleOpenDetail = (sol: LearningSolutionItem) => {
    setSelectedSolution(sol);
    setIsModalOpen(true);
  };

  const handleOpenReview = (sol?: LearningSolutionItem) => {
    setSelectedSolution(sol || null);
    setIsReviewModalOpen(true);
  };

  // Recommendations mapping
  const recommendations = [
    {
      competency: 'Data Analysis & Predictive Modeling',
      gapScore: 'Gap 2-3 Level (High)',
      primarySolution: 'In Class Training / Hands-on Lab',
      secondarySolution: 'On-the-Job Learning (Sprint Squad)',
      reason: 'Kompleksitas algoritma machine learning & manipulasi big data PLN memerlukan bimbingan instruktur langsung.',
      targetPegawai: 'Andi Pratama, Budi Santoso',
    },
    {
      competency: 'Agile Squad Leadership & Stakeholder Management',
      gapScore: 'Gap 3 Level (High)',
      primarySolution: 'Blended Learning + Executive Coaching',
      secondarySolution: 'Mentoring dari Senior VP',
      reason: 'Kebutuhan soft-skill kepemimpinan squad multi-vendor paling efektif melalui simulasi kasus dan 1-on-1 coaching.',
      targetPegawai: 'Budi Santoso',
    },
    {
      competency: 'Executive Data Storytelling & PowerBI',
      gapScore: 'Gap 2 Level (High)',
      primarySolution: 'Blended Learning',
      secondarySolution: 'Digital Micro-Learning LMS',
      reason: 'Kombinasi teori mandiri visual data diikuti bedah template dashboard BOD secara tatap muka interaktif.',
      targetPegawai: 'Dewi Lestari',
    },
    {
      competency: 'Problem Solving in Hybrid Architecture',
      gapScore: 'Gap 1 Level (Medium)',
      primarySolution: 'Digital Learning + Mentoring',
      secondarySolution: 'Peer Review Forum',
      reason: 'Gap bersifat inkremental, optimal diselesaikan lewat modul digital self-paced didukung asistensi mentor.',
      targetPegawai: 'Siti Rahma',
    },
  ];

  const visibleRecommendations = useMemo(() => {
    if (currentUser.role === 'USER DASAR') {
      return recommendations.filter((r) => r.targetPegawai.toLowerCase().includes(currentUser.name.toLowerCase()));
    }
    return recommendations;
  }, [currentUser]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-[#00843D] uppercase tracking-wider">
              Tahap 05 · Pemilihan Modalitas & Solusi
            </span>
            {currentUser.role === 'USER DASAR' && <ViewOnlyBadge label="VIEW ONLY - REKOMENDASI SAYA" />}
            {currentUser.role === 'MANAGEMENT' && <ViewOnlyBadge label="MANAGEMENT REVIEW" />}
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
            {currentUser.role === 'USER DASAR' ? 'My Learning Solution' : 'Learning Solution'}
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            {currentUser.role === 'USER DASAR'
              ? 'Rekomendasi metode intervensi pembelajaran yang disesuaikan dengan kebutuhan kompetensi Anda.'
              : 'Rekomendasi metode pembelajaran yang sesuai dengan kebutuhan kompetensi unit.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {currentUser.role === 'ADMIN' && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#00843D] hover:bg-[#006B32] rounded-lg transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Tambah Solusi</span>
            </button>
          )}

          {currentUser.role === 'MANAGEMENT' && (
            <button
              onClick={() => handleOpenReview()}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#00843D] hover:bg-[#006B32] rounded-lg transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Berikan Masukan / Review</span>
            </button>
          )}
          <span className="text-xs text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
            Standar Modalitas PLN Corpu 70:20:10
          </span>
        </div>
      </div>

      {/* Modalitas Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {accessibleSolutions.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-[#00843D]/50 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  {getMethodIcon(item.type)}
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={item.status} size="sm" />
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-semibold block">EFEKTIVITAS</span>
                    <span className="text-sm font-bold font-mono text-[#00843D]">{item.effectivenessRate}%</span>
                  </div>
                </div>
              </div>

              <h3 className="text-base font-bold text-slate-900 leading-snug">{item.title}</h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed line-clamp-2">
                {item.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mt-3.5">
                {item.tags.map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className="px-2 py-0.5 rounded text-[10.5px] font-medium bg-slate-100 text-slate-700 border border-slate-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-mono">{item.durationRange}</span>
              <div className="flex items-center gap-1.5">
                {currentUser.role === 'ADMIN' && onDeleteSolution && (
                  <button
                    onClick={() => setDeleteTargetId(item.id)}
                    className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Hapus Solusi"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
                {currentUser.role === 'MANAGEMENT' && (
                  <button
                    onClick={() => handleOpenReview(item)}
                    className="p-1.5 rounded-lg text-[#00843D] hover:bg-emerald-50 transition-colors cursor-pointer"
                    title="Review Modalitas"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => handleOpenDetail(item)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-[#006B32] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <span>Lihat Solution</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Section: Recommended Learning Solution */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              <h3 className="text-sm font-bold text-slate-900">Recommended Learning Solution</h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Pemetaan rekomendasi metode intervensi pembelajaran berdasarkan analisis gap dan prioritas CCA/DNA.
            </p>
          </div>
          <span className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md font-semibold">
            Berdasarkan Gap $\ge$ 2 (High) & Gap 1 (Medium)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {visibleRecommendations.map((rec, rIdx) => (
            <div
              key={rIdx}
              className="p-4 rounded-xl border border-slate-200 bg-[#F5F7F9]/50 hover:bg-white hover:border-[#00843D] transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    TARGET KOMPETENSI
                  </span>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">{rec.competency}</div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10.5px] font-bold bg-rose-50 text-rose-700 border border-rose-200 whitespace-nowrap">
                  {rec.gapScore}
                </span>
              </div>

              <div className="mt-3 space-y-1.5 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 min-w-[110px]">Solusi Utama:</span>
                  <span className="font-bold text-[#00843D]">{rec.primarySolution}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 min-w-[110px]">Solusi Pendukung:</span>
                  <span className="font-semibold text-slate-700">{rec.secondarySolution}</span>
                </div>
                {currentUser.role !== 'USER DASAR' && (
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 min-w-[110px]">Target Pegawai:</span>
                    <span className="text-slate-800 font-medium">{rec.targetPegawai}</span>
                  </div>
                )}
              </div>

              <p className="text-[11px] text-slate-500 bg-white p-2.5 rounded-lg border border-slate-200 mt-3 leading-relaxed">
                <span className="font-semibold text-slate-700">Justifikasi:</span> {rec.reason}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Detail Solusi */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedSolution ? selectedSolution.title : 'Detail Learning Solution'}
        subtitle="Spesifikasi Metodologi Pembelajaran PLN Corporate University"
        maxWidth="lg"
      >
        {selectedSolution && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10.5px] font-bold text-slate-400 uppercase">MODALITAS</span>
                <span className="font-mono text-xs font-bold text-[#00843D]">
                  Efektivitas: {selectedSolution.effectivenessRate}%
                </span>
              </div>
              <div className="text-base font-bold text-slate-900">{selectedSolution.title}</div>
              <p className="text-slate-600 text-xs leading-relaxed">{selectedSolution.description}</p>
            </div>

            <div className="space-y-2.5">
              <div>
                <span className="font-semibold text-slate-800 block">Sasaran Peserta:</span>
                <p className="text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200 mt-1">
                  {selectedSolution.targetAudience}
                </p>
              </div>

              <div>
                <span className="font-semibold text-slate-800 block">Panduan Implementasi:</span>
                <p className="text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200 mt-1 leading-relaxed">
                  {selectedSolution.implementationGuide}
                </p>
              </div>

              <div>
                <span className="font-semibold text-slate-800 block mb-1">
                  Sangat Direkomendasikan Untuk Kompetensi:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedSolution.recommendedFor.map((rec, rIdx) => (
                    <span
                      key={rIdx}
                      className="px-2.5 py-1 rounded-md bg-emerald-50 text-[#006B32] border border-emerald-200 font-semibold text-[11px]"
                    >
                      {rec}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Review Modal for Management */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        currentUser={currentUser}
        targetModule="Learning Solution"
        targetItemTitle={selectedSolution ? selectedSolution.title : 'Modalitas Pembelajaran Unit'}
        onSubmitReview={onSubmitReview}
      />

      {/* Modal Add Solution (Admin Only) */}
      {currentUser.role === 'ADMIN' && (
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Tambah Solusi & Modalitas Pembelajaran"
          subtitle="Formulasikan modalitas pembelajaran baru sesuai standar 70:20:10 PLN Corporate University."
          maxWidth="lg"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!formData.title.trim()) {
                onShowToast('error', 'Judul Solusi Pembelajaran wajib diisi!', 'Validasi Gagal');
                return;
              }
              if (onAddSolution) {
                const tags = formData.tagsText.split(',').map((t) => t.trim()).filter(Boolean);
                const recFor = formData.recommendedForText.split(',').map((r) => r.trim()).filter(Boolean);
                const recEmp = formData.recommendedEmployeesText.split(',').map((r) => r.trim()).filter(Boolean);

                onAddSolution({
                  title: formData.title,
                  type: formData.type,
                  description: formData.description,
                  tags,
                  targetAudience: formData.targetAudience,
                  durationRange: formData.durationRange,
                  effectivenessRate: formData.effectivenessRate,
                  suitabilityScore: formData.suitabilityScore,
                  recommendedFor: recFor,
                  recommendedEmployees: recEmp,
                  implementationGuide: formData.implementationGuide,
                  status: formData.status,
                });
                onShowToast('success', `Solusi "${formData.title}" berhasil ditambahkan.`, 'Solusi Dibuat');
                setIsAddModalOpen(false);
              }
            }}
            className="space-y-4 text-xs"
          >
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Judul Solusi / Program *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Contoh: Digital Sandbox & Lab Hands-on"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#00843D]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tipe Modalitas</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:border-[#00843D]"
                >
                  <option value="In Class Training">In Class Training</option>
                  <option value="Digital Learning">Digital Learning</option>
                  <option value="Blended Learning">Blended Learning</option>
                  <option value="Coaching">Coaching</option>
                  <option value="Mentoring">Mentoring</option>
                  <option value="On-the-Job Learning">On-the-Job Learning</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Rentang Durasi</label>
                <input
                  type="text"
                  value={formData.durationRange}
                  onChange={(e) => setFormData({ ...formData, durationRange: e.target.value })}
                  placeholder="2 – 5 Hari"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#00843D]"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Deskripsi Ringkas</label>
              <textarea
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Pelatihan intensif praktik langsung dengan instruktur industri..."
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#00843D]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tingkat Efektivitas (%)</label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={formData.effectivenessRate}
                  onChange={(e) => setFormData({ ...formData, effectivenessRate: parseInt(e.target.value) || 85 })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#00843D]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tags (pisahkan koma)</label>
                <input
                  type="text"
                  value={formData.tagsText}
                  onChange={(e) => setFormData({ ...formData, tagsText: e.target.value })}
                  placeholder="Praktik, Lab, Sertifikasi"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#00843D]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Direkomendasikan Untuk Kompetensi</label>
                <input
                  type="text"
                  value={formData.recommendedForText}
                  onChange={(e) => setFormData({ ...formData, recommendedForText: e.target.value })}
                  placeholder="Data Analysis, Leadership"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#00843D]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Pegawai yang Direkomendasikan</label>
                <input
                  type="text"
                  value={formData.recommendedEmployeesText}
                  onChange={(e) => setFormData({ ...formData, recommendedEmployeesText: e.target.value })}
                  placeholder="Andi Pratama, Budi Santoso"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#00843D]"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold text-white bg-[#00843D] hover:bg-[#006B32] rounded-lg shadow-xs cursor-pointer"
              >
                Simpan Solusi
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Confirm Dialog Delete */}
      <ConfirmDialog
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={() => {
          if (deleteTargetId && onDeleteSolution) {
            onDeleteSolution(deleteTargetId);
            onShowToast('success', 'Solusi pembelajaran berhasil dihapus.', 'Solusi Dihapus');
            setDeleteTargetId(null);
          }
        }}
        title="Hapus Solusi Pembelajaran?"
        message="Modalitas ini akan dihapus dari daftar rekomendasi unit PLN Corpu."
        confirmText="Hapus Solusi"
        cancelText="Batal"
        isDestructive={true}
      />
    </div>
  );
};
