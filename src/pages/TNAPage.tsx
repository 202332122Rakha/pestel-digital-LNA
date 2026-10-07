import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Filter,
  GraduationCap,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Eye,
  Check,
  X,
  FileCheck,
  MessageSquare,
  Lock,
} from 'lucide-react';
import { TNAItem, User, PriorityLevel, LNAStatus, ReviewFeedback } from '../types';
import { Modal } from '../components/Modal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { StatusBadge, PriorityBadge, ViewOnlyBadge } from '../components/StatusBadge';
import { ReviewModal } from '../components/ReviewModal';

interface TNAPageProps {
  currentUser: User;
  tnaList: TNAItem[];
  prefilledTrainingName?: string;
  onAddTNA: (item: Omit<TNAItem, 'id' | 'submissionDate'>) => void;
  onUpdateTNA: (item: TNAItem) => void;
  onDeleteTNA: (id: string) => void;
  onSubmitReview: (review: Omit<ReviewFeedback, 'id' | 'createdAt'>) => void;
  onShowToast: (type: 'success' | 'error' | 'info' | 'warning', message: string, title?: string) => void;
}

export const TNAPage: React.FC<TNAPageProps> = ({
  currentUser,
  tnaList,
  prefilledTrainingName,
  onAddTNA,
  onUpdateTNA,
  onDeleteTNA,
  onSubmitReview,
  onShowToast,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterUnit, setFilterUnit] = useState('ALL');
  const [filterPriority, setFilterPriority] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedTNA, setSelectedTNA] = useState<TNAItem | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Form Fields
  const [formData, setFormData] = useState({
    trainingName: prefilledTrainingName || '',
    targetUnit: 'Unit Digital',
    competency: 'Data Analysis',
    priority: 'High' as PriorityLevel,
    method: 'In Class' as TNAItem['method'],
    duration: '3 Hari',
    status: 'SUBMITTED' as LNAStatus,
    participantsCount: 15,
    submittedBy: currentUser.name,
    approvalNotes: '',
  });

  // Strict role filtering: User Dasar only sees own TNA
  const accessibleTNA = useMemo(() => {
    if (currentUser.role === 'USER DASAR') {
      return tnaList.filter((item) =>
        item.targetEmployees?.some((e) => e.toLowerCase().includes(currentUser.name.toLowerCase())) ||
        item.submittedBy.toLowerCase().includes(currentUser.name.toLowerCase())
      );
    }
    return tnaList;
  }, [tnaList, currentUser]);

  const uniqueUnits = useMemo(() => Array.from(new Set(accessibleTNA.map((t) => t.targetUnit))), [accessibleTNA]);

  const filteredList = useMemo(() => {
    return accessibleTNA.filter((item) => {
      const matchSearch =
        searchTerm === '' ||
        item.trainingName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.competency.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.targetUnit.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.submittedBy.toLowerCase().includes(searchTerm.toLowerCase());

      const matchUnit = filterUnit === 'ALL' || item.targetUnit === filterUnit;
      const matchPriority = filterPriority === 'ALL' || item.priority === filterPriority;
      const matchStatus = filterStatus === 'ALL' || item.status === filterStatus;

      return matchSearch && matchUnit && matchPriority && matchStatus;
    });
  }, [accessibleTNA, searchTerm, filterUnit, filterPriority, filterStatus]);

  const handleOpenAddModal = () => {
    if (currentUser.role !== 'ADMIN') {
      onShowToast('error', 'Akses ditolak: Hanya ADMIN yang dapat mengajukan usulan TNA utama!', 'Izin Terbatas');
      return;
    }
    setEditingId(null);
    setFormData({
      trainingName: prefilledTrainingName || '',
      targetUnit: 'Unit Digital',
      competency: 'Data Analysis',
      priority: 'High',
      method: 'In Class',
      duration: '3 Hari',
      status: 'SUBMITTED',
      participantsCount: 15,
      submittedBy: currentUser.name,
      approvalNotes: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: TNAItem) => {
    if (currentUser.role !== 'ADMIN') {
      onShowToast('error', 'Akses ditolak: Hanya ADMIN yang dapat mengedit data TNA!', 'Izin Terbatas');
      return;
    }
    setEditingId(item.id);
    setFormData({
      trainingName: item.trainingName,
      targetUnit: item.targetUnit,
      competency: item.competency,
      priority: item.priority,
      method: item.method,
      duration: item.duration,
      status: item.status,
      participantsCount: item.participantsCount,
      submittedBy: item.submittedBy,
      approvalNotes: item.approvalNotes || '',
    });
    setIsModalOpen(true);
  };

  const handleOpenReviewModal = (item: TNAItem) => {
    setSelectedTNA(item);
    setIsReviewModalOpen(true);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();

    if (currentUser.role !== 'ADMIN') {
      onShowToast('error', 'Akses ditolak: Hanya ADMIN yang dapat menyimpan data TNA!', 'Izin Terbatas');
      return;
    }

    if (!formData.trainingName.trim() || !formData.competency.trim()) {
      onShowToast('error', 'Nama Training dan Kompetensi harus diisi!', 'Validasi Gagal');
      return;
    }

    if (editingId) {
      const original = tnaList.find((t) => t.id === editingId)!;
      onUpdateTNA({
        ...original,
        ...formData,
      });
      onShowToast('success', `Usulan TNA ${formData.trainingName} berhasil diperbarui.`, 'TNA Diperbarui');
    } else {
      onAddTNA(formData);
      onShowToast('success', `Usulan TNA ${formData.trainingName} berhasil diajukan.`, 'TNA Diajukan');
    }

    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (currentUser.role !== 'ADMIN') {
      onShowToast('error', 'Akses ditolak: Hanya ADMIN yang dapat menghapus data TNA!', 'Izin Terbatas');
      setDeleteTargetId(null);
      return;
    }
    if (deleteTargetId) {
      onDeleteTNA(deleteTargetId);
      onShowToast('success', 'Usulan TNA berhasil dihapus.', 'Data Terhapus');
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
              Tahap 04 · Perencanaan Kebutuhan Pelatihan
            </span>
            {currentUser.role === 'USER DASAR' && <ViewOnlyBadge label="VIEW ONLY - USULAN SAYA" />}
            {currentUser.role === 'MANAGEMENT' && <ViewOnlyBadge label="MANAGEMENT REVIEW" />}
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
            {currentUser.role === 'USER DASAR' ? 'My TNA' : 'TNA – Training Need Analysis'}
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            {currentUser.role === 'USER DASAR'
              ? 'Daftar usulan program pelatihan yang terkait dengan penugasan dan peran Anda.'
              : 'Menentukan kebutuhan pelatihan berdasarkan hasil DNA dan CCA untuk verifikasi manajemen.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {currentUser.role === 'MANAGEMENT' && (
            <button
              onClick={() => handleOpenReviewModal(tnaList[0])}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#00843D] hover:bg-[#006B32] rounded-lg transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Review & Evaluasi TNA</span>
            </button>
          )}

          {currentUser.role === 'ADMIN' && (
            <button
              onClick={handleOpenAddModal}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#00843D] hover:bg-[#006B32] rounded-lg transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Ajukan TNA</span>
            </button>
          )}
        </div>
      </div>

      {/* Toolbar: Search & Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari program training / kompetensi..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-[#F5F7F9] border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-[#00843D] focus:bg-white transition-colors"
            />
          </div>

          <div>
            <select
              value={filterUnit}
              onChange={(e) => setFilterUnit(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#F5F7F9] border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-[#00843D]"
            >
              <option value="ALL">Semua Peserta / Unit</option>
              {uniqueUnits.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
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

      {/* TNA Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold tracking-wide">
                <th className="py-3 px-3.5 text-center w-12">No</th>
                <th className="py-3 px-4">Nama Training</th>
                <th className="py-3 px-3">Peserta/Unit</th>
                <th className="py-3 px-3">Kompetensi</th>
                <th className="py-3 px-3 text-center">Prioritas</th>
                <th className="py-3 px-3">Metode</th>
                <th className="py-3 px-2.5 text-center">Durasi</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3.5 text-right w-24">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    Tidak ada usulan pelatihan TNA yang sesuai kriteria.
                  </td>
                </tr>
              ) : (
                filteredList.map((item, index) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3.5 text-center font-mono text-slate-400 tabular-nums">
                      {index + 1}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900 whitespace-nowrap">
                      {item.trainingName}
                      <span className="block text-[10.5px] font-normal text-slate-400">
                        {item.participantsCount} Peserta terdaftar
                      </span>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap text-slate-600">{item.targetUnit}</td>
                    <td className="py-3 px-3 font-medium text-slate-800 whitespace-nowrap">
                      {item.competency}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <PriorityBadge priority={item.priority} size="sm" />
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 text-[11px]">
                        {item.method}
                      </span>
                    </td>
                    <td className="py-3 px-2.5 text-center font-mono font-medium text-slate-800 whitespace-nowrap">
                      {item.duration}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <StatusBadge status={item.status} size="sm" />
                    </td>
                    <td className="py-3 px-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        {/* Management Review Button */}
                        {currentUser.role === 'MANAGEMENT' && (
                          <button
                            onClick={() => handleOpenReviewModal(item)}
                            className="p-1 rounded text-[#00843D] hover:bg-emerald-50 transition-colors"
                            title="Tinjau & Berikan Masukan"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* Admin Only Actions */}
                        {currentUser.role === 'ADMIN' ? (
                          <>
                            <button
                              onClick={() => handleOpenEditModal(item)}
                              className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                              title="Edit Usulan"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeleteTargetId(item.id)}
                              className="p-1 rounded text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                              title="Hapus Usulan"
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

      {/* Modal Add / Edit TNA (ADMIN ONLY) */}
      {currentUser.role === 'ADMIN' && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingId ? 'Edit Usulan Pelatihan (TNA)' : 'Formulir Pengajuan TNA Baru'}
          subtitle="Rancang usulan program diklat berbasis kompetensi untuk diverifikasi manajemen PLN Corporate University."
          maxWidth="xl"
        >
          <form onSubmit={handleSubmitForm} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nama Training *</label>
              <input
                type="text"
                required
                value={formData.trainingName}
                onChange={(e) => setFormData({ ...formData, trainingName: e.target.value })}
                placeholder="Contoh: Advanced Data Analysis & Machine Learning"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#00843D]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Peserta / Unit Kerja</label>
                <input
                  type="text"
                  value={formData.targetUnit}
                  onChange={(e) => setFormData({ ...formData, targetUnit: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#00843D]"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Kompetensi Target *</label>
                <input
                  type="text"
                  required
                  value={formData.competency}
                  onChange={(e) => setFormData({ ...formData, competency: e.target.value })}
                  placeholder="Contoh: Data Analysis"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#00843D]"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Metode Pelatihan</label>
                <select
                  value={formData.method}
                  onChange={(e) => setFormData({ ...formData, method: e.target.value as any })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#00843D]"
                >
                  <option value="In Class">In Class</option>
                  <option value="Blended">Blended</option>
                  <option value="Digital Learning">Digital Learning</option>
                  <option value="Workshop / Lab">Workshop / Lab</option>
                  <option value="Mentoring">Mentoring</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Durasi</label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="Contoh: 3 Hari"
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
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Estimasi Jumlah Peserta</label>
                <input
                  type="number"
                  min="1"
                  value={formData.participantsCount}
                  onChange={(e) => setFormData({ ...formData, participantsCount: parseInt(e.target.value) || 1 })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#00843D]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Status Pengajuan</label>
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

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Catatan Verifikasi / Persetujuan</label>
              <textarea
                rows={2}
                value={formData.approvalNotes}
                onChange={(e) => setFormData({ ...formData, approvalNotes: e.target.value })}
                placeholder="Catatan dari koordinator LNA atau manajemen..."
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#00843D]"
              />
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
                {editingId ? 'Simpan Perubahan' : 'Ajukan TNA'}
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
        targetModule="TNA"
        targetItemTitle={selectedTNA ? selectedTNA.trainingName : 'Usulan TNA Unit Digital'}
        onSubmitReview={onSubmitReview}
      />

      {/* Delete Confirmation (Admin Only) */}
      <ConfirmDialog
        isOpen={Boolean(deleteTargetId)}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleConfirmDelete}
        title="Hapus Usulan Pelatihan (TNA)?"
        message="Hanya ADMIN yang memiliki wewenang untuk menghapus usulan program pelatihan."
        confirmText="Hapus Permanen"
        cancelText="Batal"
        isDestructive={true}
      />
    </div>
  );
};
