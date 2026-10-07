import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  RefreshCw,
  GitBranch,
  Edit2,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Target,
  ArrowRight,
  TrendingUp,
  MessageSquare,
  Lock,
} from 'lucide-react';
import { DNAItem, User, PriorityLevel, CCAItem, LNAStatus, ReviewFeedback } from '../types';
import { Modal } from '../components/Modal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { StatusBadge, PriorityBadge, ViewOnlyBadge } from '../components/StatusBadge';
import { ReviewModal } from '../components/ReviewModal';

interface DNAPageProps {
  currentUser: User;
  dnaList: DNAItem[];
  ccaList: CCAItem[];
  onAddDNA: (item: Omit<DNAItem, 'id' | 'createdAt'>) => void;
  onUpdateDNA: (item: DNAItem) => void;
  onDeleteDNA: (id: string) => void;
  onSyncFromCCA: () => void;
  onSubmitReview: (review: Omit<ReviewFeedback, 'id' | 'createdAt'>) => void;
  onShowToast: (type: 'success' | 'error' | 'info' | 'warning', message: string, title?: string) => void;
}

export const DNAPage: React.FC<DNAPageProps> = ({
  currentUser,
  dnaList,
  ccaList,
  onAddDNA,
  onUpdateDNA,
  onDeleteDNA,
  onSyncFromCCA,
  onSubmitReview,
  onShowToast,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedDNA, setSelectedDNA] = useState<DNAItem | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    employeeName: '',
    competency: 'Data Analysis',
    gapLevel: 2,
    gapCause: '',
    developmentNeed: '',
    targetLevel: 4,
    priority: 'High' as PriorityLevel,
    status: 'SUBMITTED' as LNAStatus,
  });

  // Strict role filtering: User Dasar only sees own DNA
  const accessibleDNA = useMemo(() => {
    if (currentUser.role === 'USER DASAR') {
      return dnaList.filter((item) =>
        item.employeeName.toLowerCase().includes(currentUser.name.toLowerCase())
      );
    }
    return dnaList;
  }, [dnaList, currentUser]);

  // Calculate statistics
  const totalGap = accessibleDNA.reduce((acc, curr) => acc + curr.gapLevel, 0);
  const highPriorityCount = accessibleDNA.filter((d) => d.priority === 'High').length;
  const totalDevelopmentNeeds = accessibleDNA.length;

  const filteredList = useMemo(() => {
    return accessibleDNA.filter((item) => {
      const matchSearch =
        searchTerm === '' ||
        item.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.competency.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.developmentNeed.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.gapCause.toLowerCase().includes(searchTerm.toLowerCase());

      const matchPriority = filterPriority === 'ALL' || item.priority === filterPriority;
      const matchStatus = filterStatus === 'ALL' || item.status === filterStatus;

      return matchSearch && matchPriority && matchStatus;
    });
  }, [accessibleDNA, searchTerm, filterPriority, filterStatus]);

  const handleOpenAddModal = () => {
    if (currentUser.role !== 'ADMIN') {
      onShowToast('error', 'Akses ditolak: Hanya ADMIN yang dapat menambah data DNA!', 'Izin Terbatas');
      return;
    }
    setEditingId(null);
    setFormData({
      employeeName: '',
      competency: 'Data Analysis',
      gapLevel: 2,
      gapCause: '',
      developmentNeed: '',
      targetLevel: 4,
      priority: 'High',
      status: 'SUBMITTED',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: DNAItem) => {
    if (currentUser.role !== 'ADMIN') {
      onShowToast('error', 'Akses ditolak: Hanya ADMIN yang dapat mengedit data DNA!', 'Izin Terbatas');
      return;
    }
    setEditingId(item.id);
    setFormData({
      employeeName: item.employeeName,
      competency: item.competency,
      gapLevel: item.gapLevel,
      gapCause: item.gapCause,
      developmentNeed: item.developmentNeed,
      targetLevel: item.targetLevel,
      priority: item.priority,
      status: item.status,
    });
    setIsModalOpen(true);
  };

  const handleOpenReview = (item?: DNAItem) => {
    setSelectedDNA(item || null);
    setIsReviewModalOpen(true);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();

    if (currentUser.role !== 'ADMIN') {
      onShowToast('error', 'Akses ditolak: Hanya ADMIN yang dapat menyimpan data DNA!', 'Izin Terbatas');
      return;
    }

    if (!formData.employeeName.trim() || !formData.developmentNeed.trim()) {
      onShowToast('error', 'Nama Pegawai dan Kebutuhan Pengembangan wajib diisi!', 'Validasi Gagal');
      return;
    }

    if (editingId) {
      const original = dnaList.find((d) => d.id === editingId)!;
      onUpdateDNA({
        ...original,
        ...formData,
      });
      onShowToast('success', `Kebutuhan pengembangan untuk ${formData.employeeName} berhasil diperbarui.`, 'DNA Diperbarui');
    } else {
      onAddDNA(formData);
      onShowToast('success', `DNA baru berhasil ditambahkan untuk ${formData.employeeName}.`, 'DNA Ditambahkan');
    }

    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (currentUser.role !== 'ADMIN') {
      onShowToast('error', 'Akses ditolak: Hanya ADMIN yang dapat menghapus data DNA!', 'Izin Terbatas');
      setDeleteTargetId(null);
      return;
    }
    if (deleteTargetId) {
      onDeleteDNA(deleteTargetId);
      onShowToast('success', 'Data analisis DNA berhasil dihapus.', 'Data Terhapus');
      setDeleteTargetId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-[#00843D] uppercase tracking-wider">
              Tahap 02 · Identifikasi Kebutuhan Pengembangan
            </span>
            {currentUser.role === 'USER DASAR' && <ViewOnlyBadge label="VIEW ONLY - DATA PRIBADI" />}
            {currentUser.role === 'MANAGEMENT' && <ViewOnlyBadge label="MANAGEMENT MONITORING" />}
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
            {currentUser.role === 'USER DASAR' ? 'My Development Need (DNA)' : 'DNA – Development Need Analysis'}
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            {currentUser.role === 'USER DASAR'
              ? 'Program dan intervensi pengembangan kompetensi yang dipetakan untuk Anda.'
              : 'Mengidentifikasi kebutuhan pengembangan kompetensi berdasarkan hasil CCA.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {currentUser.role === 'MANAGEMENT' && (
            <button
              onClick={() => handleOpenReview()}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#00843D] hover:bg-[#006B32] rounded-lg transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Berikan Masukan / Review</span>
            </button>
          )}

          {currentUser.role === 'ADMIN' && (
            <>
              <button
                onClick={onSyncFromCCA}
                className="px-3.5 py-2 text-xs font-semibold text-[#006B32] bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 rounded-lg transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
                title="Import gap kompetensi terbaru dari modul CCA"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#00843D]" />
                <span>Sinkronisasi dari CCA</span>
              </button>

              <button
                onClick={handleOpenAddModal}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#00843D] hover:bg-[#006B32] rounded-lg transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Tambah DNA</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* 3 Statistic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Gap Kompetensi</span>
            <div className="p-2 rounded-lg bg-rose-50 text-rose-600 border border-rose-200">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold font-mono tabular-nums text-slate-900">{totalGap}</div>
            <div className="text-[11px] text-slate-400 mt-1">Akumulasi level gap yang harus ditutup</div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Prioritas Tinggi (High)</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600 border border-amber-200">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold font-mono tabular-nums text-amber-700">{highPriorityCount}</div>
            <div className="text-[11px] text-slate-400 mt-1">Membutuhkan intervensi langsung</div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Kebutuhan Pengembangan</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-[#00843D] border border-emerald-200">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold font-mono tabular-nums text-[#006B32]">{totalDevelopmentNeeds}</div>
            <div className="text-[11px] text-slate-400 mt-1">Program intervensi teridentifikasi</div>
          </div>
        </div>
      </div>

      {/* Toolbar: Search & Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari pegawai, kompetensi, atau kebutuhan..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-[#F5F7F9] border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-[#00843D] focus:bg-white transition-colors"
            />
          </div>

          <div>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#F5F7F9] border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-[#00843D]"
            >
              <option value="ALL">Semua Prioritas</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#F5F7F9] border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-[#00843D]"
            >
              <option value="ALL">Semua Status</option>
              <option value="DRAFT">DRAFT</option>
              <option value="SUBMITTED">SUBMITTED</option>
              <option value="UNDER REVIEW">UNDER REVIEW</option>
              <option value="REVISION REQUIRED">REVISION REQUIRED</option>
              <option value="APPROVED">APPROVED</option>
              <option value="FINAL">FINAL</option>
            </select>
          </div>
        </div>
      </div>

      {/* DNA Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold tracking-wide">
                <th className="py-3 px-3.5 text-center w-12">No</th>
                <th className="py-3 px-3.5">Nama Pegawai</th>
                <th className="py-3 px-3">Kompetensi</th>
                <th className="py-3 px-2.5 text-center">Gap Level</th>
                <th className="py-3 px-4">Penyebab Gap</th>
                <th className="py-3 px-4">Kebutuhan Pengembangan</th>
                <th className="py-3 px-2.5 text-center">Target Level</th>
                <th className="py-3 px-3 text-center">Prioritas</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3.5 text-right w-20">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    Tidak ada data DNA yang cocok dengan kriteria filter.
                  </td>
                </tr>
              ) : (
                filteredList.map((item, index) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3.5 text-center font-mono text-slate-400 tabular-nums">
                      {index + 1}
                    </td>
                    <td className="py-3 px-3.5 font-semibold text-slate-900 whitespace-nowrap">
                      {item.employeeName}
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-800 whitespace-nowrap">
                      {item.competency}
                    </td>
                    <td className="py-3 px-2.5 text-center">
                      <span className="font-mono font-bold text-rose-600">{item.gapLevel}</span>
                    </td>
                    <td className="py-3 px-4 max-w-xs text-slate-600" title={item.gapCause}>
                      {item.gapCause}
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#00843D] max-w-xs" title={item.developmentNeed}>
                      {item.developmentNeed}
                    </td>
                    <td className="py-3 px-2.5 text-center font-mono font-semibold text-slate-800">
                      {item.targetLevel}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <PriorityBadge priority={item.priority} size="sm" />
                    </td>
                    <td className="py-3 px-3 text-center">
                      <StatusBadge status={item.status} size="sm" />
                    </td>
                    <td className="py-3 px-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        {currentUser.role === 'MANAGEMENT' && (
                          <button
                            onClick={() => handleOpenReview(item)}
                            className="p-1 rounded text-[#00843D] hover:bg-emerald-50 transition-colors"
                            title="Review & Berikan Masukan"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {currentUser.role === 'ADMIN' ? (
                          <>
                            <button
                              onClick={() => handleOpenEditModal(item)}
                              className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                              title="Edit DNA"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeleteTargetId(item.id)}
                              className="p-1 rounded text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                              title="Hapus DNA"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        ) : (
                          currentUser.role !== 'MANAGEMENT' && (
                            <span className="text-[10px] text-slate-400 font-medium">View Only</span>
                          )
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit DNA (ADMIN ONLY) */}
      {currentUser.role === 'ADMIN' && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingId ? 'Edit Kebutuhan Pengembangan (DNA)' : 'Tambah DNA Baru'}
          subtitle="Petakan akar penyebab gap dan rumuskan kebutuhan intervensi pembelajaran yang spesifik."
          maxWidth="lg"
        >
          <form onSubmit={handleSubmitForm} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nama Pegawai *</label>
              <input
                type="text"
                required
                value={formData.employeeName}
                onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })}
                placeholder="Contoh: Andi Pratama"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#00843D]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Kompetensi</label>
                <input
                  type="text"
                  value={formData.competency}
                  onChange={(e) => setFormData({ ...formData, competency: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#00843D]"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Gap Level</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={formData.gapLevel}
                  onChange={(e) => setFormData({ ...formData, gapLevel: parseInt(e.target.value) || 1 })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#00843D]"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Penyebab Kesenjangan (Gap Cause)</label>
              <textarea
                rows={2}
                value={formData.gapCause}
                onChange={(e) => setFormData({ ...formData, gapCause: e.target.value })}
                placeholder="Contoh: Kurangnya pengalaman praktis dalam pemodelan data tingkat lanjut..."
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#00843D]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Kebutuhan Pengembangan (Development Need) *</label>
              <input
                type="text"
                required
                value={formData.developmentNeed}
                onChange={(e) => setFormData({ ...formData, developmentNeed: e.target.value })}
                placeholder="Contoh: Advanced Data Analysis & Machine Learning"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#00843D]"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Level</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={formData.targetLevel}
                  onChange={(e) => setFormData({ ...formData, targetLevel: parseInt(e.target.value) || 4 })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#00843D]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Prioritas</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as PriorityLevel })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#00843D]"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Status LNA</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as LNAStatus })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#00843D]"
                >
                  <option value="DRAFT">DRAFT</option>
                  <option value="SUBMITTED">SUBMITTED</option>
                  <option value="UNDER REVIEW">UNDER REVIEW</option>
                  <option value="REVISION REQUIRED">REVISION REQUIRED</option>
                  <option value="APPROVED">APPROVED</option>
                  <option value="FINAL">FINAL</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-[#00843D] hover:bg-[#006B32] rounded-lg transition-colors shadow-xs"
              >
                {editingId ? 'Simpan Perubahan' : 'Tambah DNA'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Review Modal for Management */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        currentUser={currentUser}
        targetModule="Kompetensi"
        targetItemTitle={selectedDNA ? `${selectedDNA.employeeName} (${selectedDNA.developmentNeed})` : 'Data DNA Unit Digital'}
        onSubmitReview={onSubmitReview}
      />

      {/* Delete Confirmation (Admin Only) */}
      <ConfirmDialog
        isOpen={Boolean(deleteTargetId)}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleConfirmDelete}
        title="Hapus Data Analisis DNA?"
        message="Item kebutuhan pengembangan ini akan dihapus dari sistem."
        confirmText="Hapus Permanen"
        cancelText="Batal"
        isDestructive={true}
      />
    </div>
  );
};
