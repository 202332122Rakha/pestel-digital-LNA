import React, { useState, useMemo } from 'react';
import {
  Route,
  Clock,
  Users,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Layers,
  GraduationCap,
  Sparkles,
  ExternalLink,
  Target,
  PlayCircle,
  MessageSquare,
  Lock,
  Plus,
  AlertCircle,
  Trash2,
} from 'lucide-react';
import { LearningPathItem, User, PriorityLevel, LNAStatus, ReviewFeedback } from '../types';
import { Modal } from '../components/Modal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { StatusBadge, PriorityBadge, ViewOnlyBadge } from '../components/StatusBadge';
import { ReviewModal } from '../components/ReviewModal';

interface LearningPathPageProps {
  currentUser: User;
  paths: LearningPathItem[];
  onAddPath?: (path: Omit<LearningPathItem, 'id'>) => void;
  onDeletePath?: (id: string) => void;
  onNavigateToTNAWithSubject?: (subject: string) => void;
  onSubmitReview: (review: Omit<ReviewFeedback, 'id' | 'createdAt'>) => void;
  onShowToast: (type: 'success' | 'error' | 'info' | 'warning', message: string, title?: string) => void;
}

export const LearningPathPage: React.FC<LearningPathPageProps> = ({
  currentUser,
  paths,
  onAddPath,
  onDeletePath,
  onNavigateToTNAWithSubject,
  onSubmitReview,
  onShowToast,
}) => {
  const [selectedPath, setSelectedPath] = useState<LearningPathItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState('ALL');

  // Form State for Add Learning Path (Admin Only)
  const [formData, setFormData] = useState({
    name: '',
    category: 'Data & Analytics',
    priority: 'High' as PriorityLevel,
    totalModules: 4,
    duration: '32 Jam (4 Minggu)',
    participantsCount: 15,
    progress: 0,
    targetRole: 'Digital Specialist PLN',
    objectives: '',
    competenciesText: 'Data Analysis, System Architecture',
    assignedEmployeesText: 'Andi Pratama, Budi Santoso',
    status: 'SUBMITTED' as LNAStatus,
  });

  const categories = ['ALL', 'Data & Analytics', 'Execution & Governance', 'Strategy & Management', 'Analysis & Requirement'];

  // Strict role filtering: User Dasar only sees paths assigned to them
  const accessiblePaths = useMemo(() => {
    if (currentUser.role === 'USER DASAR') {
      return paths.filter((p) =>
        p.assignedEmployees.some((emp) => emp.toLowerCase().includes(currentUser.name.toLowerCase()))
      );
    }
    return paths;
  }, [paths, currentUser]);

  const filteredPaths = accessiblePaths.filter((p) => {
    return filterCategory === 'ALL' || p.category === filterCategory;
  });

  const handleOpenDetail = (path: LearningPathItem) => {
    setSelectedPath(path);
    setIsDetailOpen(true);
  };

  const handleOpenReview = (path?: LearningPathItem) => {
    setSelectedPath(path || null);
    setIsReviewModalOpen(true);
  };

  const getMethodBadge = (method: string) => {
    switch (method) {
      case 'In Class':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Digital Learning':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Blended':
        return 'bg-emerald-50 text-[#006B32] border-emerald-200';
      case 'Assessment':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-[#00843D] uppercase tracking-wider">
              Tahap 03 · Desain Kurikulum & Silabus
            </span>
            {currentUser.role === 'USER DASAR' && <ViewOnlyBadge label="VIEW ONLY - JALUR SAYA" />}
            {currentUser.role === 'MANAGEMENT' && <ViewOnlyBadge label="MANAGEMENT MONITORING" />}
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
            {currentUser.role === 'USER DASAR' ? 'My Learning Path' : 'Learning Path'}
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            {currentUser.role === 'USER DASAR'
              ? 'Jalur pembelajaran terstruktur yang ditugaskan khusus untuk pengembangan kompetensi Anda.'
              : 'Jalur pembelajaran yang tersusun terstandarisasi berdasarkan kebutuhan kompetensi unit.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {currentUser.role === 'ADMIN' && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#00843D] hover:bg-[#006B32] rounded-lg transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Tambah Learning Path</span>
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

          {/* Filter Category */}
          <div className="flex items-center gap-1 p-1 bg-slate-100/80 rounded-lg overflow-x-auto max-w-full">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap cursor-pointer ${
                  filterCategory === cat
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat === 'ALL' ? 'Semua Kategori' : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Learning Path Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPaths.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl border border-slate-200 shadow-xs hover:border-[#00843D]/50 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
          >
            <div className="p-5">
              {/* Top Meta */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[11px] font-semibold text-slate-500 tracking-wider uppercase">
                  {item.category}
                </span>
                <div className="flex items-center gap-1.5">
                  <PriorityBadge priority={item.priority} size="sm" />
                  <StatusBadge status={item.status} size="sm" />
                </div>
              </div>

              {/* Title */}
              <h3 className="text-base font-bold text-slate-900 leading-snug hover:text-[#00843D] transition-colors">
                {item.name}
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                {item.objectives}
              </p>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-2 py-3.5 my-3.5 border-y border-slate-100 text-center">
                <div>
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Modul</div>
                  <div className="text-sm font-bold font-mono text-slate-800 mt-0.5">
                    {item.totalModules} Modul
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Durasi</div>
                  <div className="text-sm font-bold font-mono text-slate-800 mt-0.5 truncate">
                    {item.duration.split(' ')[0]} Jam
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Peserta</div>
                  <div className="text-sm font-bold font-mono text-slate-800 mt-0.5">
                    {item.participantsCount} Orang
                  </div>
                </div>
              </div>

              {/* Mini Roadmap Sequential Flow Nodes */}
              <div className="space-y-1 mb-4">
                <div className="text-[10.5px] font-bold text-slate-700 uppercase tracking-wide flex items-center justify-between">
                  <span>Alur Roadmap ({item.nodes.length} Tahapan)</span>
                  <span className="text-[10px] text-emerald-700 font-normal">Terstruktur</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex flex-wrap items-center gap-1.5 text-[11px]">
                  {item.nodes.slice(0, 4).map((node, nIdx) => (
                    <React.Fragment key={node.id}>
                      <span className="font-medium text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200 truncate max-w-[130px]">
                        {node.order}. {node.title}
                      </span>
                      {nIdx < 3 && nIdx < item.nodes.length - 1 && (
                        <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                      )}
                    </React.Fragment>
                  ))}
                  {item.nodes.length > 4 && (
                    <span className="text-[10px] text-slate-400 font-medium">+{item.nodes.length - 4} modul</span>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-medium text-slate-600">Progress Pembelajaran</span>
                  <span className="font-bold font-mono text-slate-900">{item.progress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-[#00843D] rounded-full transition-all duration-500"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>

              {/* Assigned Employees (for Management view) */}
              {currentUser.role === 'MANAGEMENT' && (
                <div className="mt-3 pt-2 text-[10.5px] text-slate-500 flex items-center justify-between">
                  <span>Peserta Unit:</span>
                  <span className="font-semibold text-slate-800 truncate max-w-[170px]">
                    {item.assignedEmployees.join(', ')}
                  </span>
                </div>
              )}
            </div>

            {/* Bottom Card Action */}
            <div className="px-5 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 truncate max-w-[160px]">
                {item.targetRole}
              </span>
              <div className="flex items-center gap-1.5">
                {currentUser.role === 'ADMIN' && onDeletePath && (
                  <button
                    onClick={() => setDeleteTargetId(item.id)}
                    className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Hapus Learning Path"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
                {currentUser.role === 'MANAGEMENT' && (
                  <button
                    onClick={() => handleOpenReview(item)}
                    className="p-1.5 rounded-lg text-[#00843D] hover:bg-emerald-100/60 transition-colors cursor-pointer"
                    title="Review Kurikulum"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => handleOpenDetail(item)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-[#006B32] bg-white hover:bg-emerald-50 border border-emerald-200 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <span>Lihat Detail</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Detail Roadmap */}
      <Modal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title={selectedPath ? selectedPath.name : 'Detail Learning Path'}
        subtitle={selectedPath?.category}
        maxWidth="3xl"
      >
        {selectedPath && (
          <div className="space-y-6 text-xs">
            {/* Overview Box */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    TUJUAN PEMBELAJARAN (OBJECTIVE)
                  </span>
                  <p className="text-slate-800 text-xs font-medium leading-relaxed mt-1">
                    {selectedPath.objectives}
                  </p>
                </div>
                <StatusBadge status={selectedPath.status} />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-200/80">
                <div>
                  <span className="text-slate-400 text-[10.5px] block">Target Role</span>
                  <span className="font-semibold text-slate-800 text-xs">{selectedPath.targetRole}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10.5px] block">Total Durasi</span>
                  <span className="font-semibold text-slate-800 text-xs font-mono">{selectedPath.duration}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10.5px] block">Jumlah Peserta</span>
                  <span className="font-semibold text-slate-800 text-xs font-mono">
                    {selectedPath.participantsCount} Pegawai
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10.5px] block">Prioritas</span>
                  <div className="mt-0.5">
                    <PriorityBadge priority={selectedPath.priority} size="sm" />
                  </div>
                </div>
              </div>

              <div>
                <span className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Kompetensi Target:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedPath.competencies.map((comp, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-md bg-emerald-50 text-[#006B32] border border-emerald-200 font-semibold text-[11px]"
                    >
                      {comp}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Interactive Roadmap Step-by-Step Chain */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Roadmap Tahapan & Materi Kurikulum ({selectedPath.nodes.length} Tahap)
                </h4>
                <span className="text-[11px] text-slate-400">Alur sekuensial terstandarisasi</span>
              </div>

              <div className="relative pl-6 space-y-4 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-emerald-300">
                {selectedPath.nodes.map((node) => (
                  <div key={node.id} className="relative group">
                    <div className="absolute -left-6 top-1 w-6 h-6 rounded-full bg-[#00843D] text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                      {node.order}
                    </div>

                    <div className="p-3.5 rounded-lg border border-slate-200 bg-white hover:border-[#00843D] transition-colors shadow-xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                        <div className="font-bold text-sm text-slate-900">{node.title}</div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded border text-[10px] font-semibold ${getMethodBadge(
                              node.method
                            )}`}
                          >
                            {node.method}
                          </span>
                          <span className="text-slate-400 font-mono text-[11px]">{node.duration}</span>
                        </div>
                      </div>
                      <p className="text-slate-600 text-xs mt-1.5 leading-relaxed">
                        {node.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-slate-500">
                {currentUser.role === 'ADMIN'
                  ? 'Sebagai Admin, Anda dapat mengajukan kurikulum ini ke usulan TNA.'
                  : currentUser.role === 'MANAGEMENT'
                  ? 'Sebagai Management, Anda dapat memberikan masukan atau menyetujui kurikulum ini.'
                  : 'Kurikulum ini sedang berjalan untuk penugasan diklat Anda.'}
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setIsDetailOpen(false)}
                  className="flex-1 sm:flex-none px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Tutup
                </button>

                {currentUser.role === 'MANAGEMENT' && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsDetailOpen(false);
                      handleOpenReview(selectedPath);
                    }}
                    className="flex-1 sm:flex-none px-4 py-2 text-xs font-semibold text-white bg-[#00843D] hover:bg-[#006B32] rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Review & Masukan</span>
                  </button>
                )}

                {currentUser.role === 'ADMIN' && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsDetailOpen(false);
                      if (onNavigateToTNAWithSubject) {
                        onNavigateToTNAWithSubject(selectedPath.name);
                      }
                      onShowToast(
                        'success',
                        `Jalur ${selectedPath.name} siap diajukan ke formulir TNA.`,
                        'Lanjut ke TNA'
                      );
                    }}
                    className="flex-1 sm:flex-none px-4 py-2 text-xs font-semibold text-white bg-[#00843D] hover:bg-[#006B32] rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span>Ajukan ke TNA</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Review Modal for Management */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        currentUser={currentUser}
        targetModule="Learning Path"
        targetItemTitle={selectedPath ? selectedPath.name : 'Jalur Pembelajaran Unit'}
        onSubmitReview={onSubmitReview}
      />

      {/* Modal Add Learning Path (Admin Only) */}
      {currentUser.role === 'ADMIN' && (
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Tambah Jalur Pembelajaran (Learning Path)"
          subtitle="Rancang kurikulum terstruktur untuk pengembangan kompetensi Sub Bidang Pengelolaan Pembelajaran, Asesmen dan Sertifikasi Berbasis Digital."
          maxWidth="xl"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!formData.name.trim()) {
                onShowToast('error', 'Nama Jalur Pembelajaran harus diisi!', 'Validasi Gagal');
                return;
              }
              if (onAddPath) {
                const compArray = formData.competenciesText
                  .split(',')
                  .map((c) => c.trim())
                  .filter(Boolean);
                const empArray = formData.assignedEmployeesText
                  .split(',')
                  .map((e) => e.trim())
                  .filter(Boolean);

                onAddPath({
                  name: formData.name,
                  category: formData.category,
                  priority: formData.priority,
                  totalModules: formData.totalModules,
                  duration: formData.duration,
                  participantsCount: formData.participantsCount,
                  progress: 0,
                  targetRole: formData.targetRole,
                  objectives: formData.objectives,
                  competencies: compArray,
                  assignedEmployees: empArray,
                  status: formData.status,
                  nodes: [
                    {
                      id: `node-${Date.now()}-1`,
                      order: 1,
                      title: `Fondasi & Teori: ${formData.name}`,
                      duration: '8 Jam',
                      method: 'Digital Learning',
                      description: 'Konsep pengantar dan teori dasar pembelajaran modul.',
                    },
                    {
                      id: `node-${Date.now()}-2`,
                      order: 2,
                      title: `Praktik Implementasi Kasus PLN`,
                      duration: '16 Jam',
                      method: 'In Class',
                      description: 'Simulasi kasus dan bedah sistem riil lingkungan kerja PLN.',
                    },
                    {
                      id: `node-${Date.now()}-3`,
                      order: 3,
                      title: 'Evaluasi & Capstone Assessment',
                      duration: '8 Jam',
                      method: 'Assessment',
                      description: 'Pengujian penguasaan kompetensi akhir.',
                    },
                  ],
                });
                onShowToast('success', `Learning Path "${formData.name}" berhasil ditambahkan.`, 'Jalur Dibuat');
                setIsAddModalOpen(false);
              }
            }}
            className="space-y-4 text-xs"
          >
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nama Learning Path *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Contoh: AI & Machine Learning Engineering Path"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#00843D]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Kategori</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:border-[#00843D]"
                >
                  <option value="Data & Analytics">Data & Analytics</option>
                  <option value="Execution & Governance">Execution & Governance</option>
                  <option value="Strategy & Management">Strategy & Management</option>
                  <option value="Analysis & Requirement">Analysis & Requirement</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Prioritas</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:border-[#00843D]"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Total Modul</label>
                <input
                  type="number"
                  min={1}
                  max={12}
                  value={formData.totalModules}
                  onChange={(e) => setFormData({ ...formData, totalModules: parseInt(e.target.value) || 4 })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#00843D]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Durasi</label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="32 Jam (4 Minggu)"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#00843D]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Peran / Role</label>
                <input
                  type="text"
                  value={formData.targetRole}
                  onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                  placeholder="Data Specialist PLN"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#00843D]"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tujuan Pembelajaran (Objectives)</label>
              <textarea
                rows={2}
                value={formData.objectives}
                onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
                placeholder="Membekali pegawai dengan kecakapan analitik dan pemodelan..."
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#00843D]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Kompetensi (pisahkan koma)</label>
                <input
                  type="text"
                  value={formData.competenciesText}
                  onChange={(e) => setFormData({ ...formData, competenciesText: e.target.value })}
                  placeholder="Data Analysis, SQL, Machine Learning"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#00843D]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Peserta Ditugaskan (pisahkan koma)</label>
                <input
                  type="text"
                  value={formData.assignedEmployeesText}
                  onChange={(e) => setFormData({ ...formData, assignedEmployeesText: e.target.value })}
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
                Buat Learning Path
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
          if (deleteTargetId && onDeletePath) {
            onDeletePath(deleteTargetId);
            onShowToast('success', 'Learning Path berhasil dihapus.', 'Jalur Dihapus');
            setDeleteTargetId(null);
          }
        }}
        title="Hapus Learning Path?"
        message="Jalur pembelajaran ini akan dihapus dari kurikulum unit. Modul dan penugasan peserta akan dibatalkan."
        confirmText="Hapus Kurikulum"
        cancelText="Batal"
        isDestructive={true}
      />
    </div>
  );
};
