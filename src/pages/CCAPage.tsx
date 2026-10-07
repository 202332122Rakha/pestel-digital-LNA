import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Filter,
  Edit2,
  Trash2,
  Eye,
  RefreshCw,
  MessageSquare,
  Lock,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { CCAItem, User, PriorityLevel, LNAStatus, ReviewFeedback } from '../types';
import { calculateGap } from '../utils/helpers';
import { Modal } from '../components/Modal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { StatusBadge, PriorityBadge, ViewOnlyBadge } from '../components/StatusBadge';
import { ReviewModal } from '../components/ReviewModal';

interface CCAPageProps {
  currentUser: User;
  ccaList: CCAItem[];
  onAddCCA: (item: Omit<CCAItem, 'id' | 'createdAt'>) => void;
  onUpdateCCA: (item: CCAItem) => void;
  onDeleteCCA: (id: string) => void;
  onSyncToDNA: () => void;
  onSubmitReview: (review: Omit<ReviewFeedback, 'id' | 'createdAt'>) => void;
  onShowToast: (type: 'success' | 'error' | 'info' | 'warning', message: string, title?: string) => void;
}

export const CCAPage: React.FC<CCAPageProps> = ({
  currentUser,
  ccaList,
  onAddCCA,
  onUpdateCCA,
  onDeleteCCA,
  onSyncToDNA,
  onSubmitReview,
  onShowToast,
}) => {
  // Toolbar Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterUnit, setFilterUnit] = useState('ALL');
  const [filterJabatan, setFilterJabatan] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterPriority, setFilterPriority] = useState('ALL');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedCCA, setSelectedCCA] = useState<CCAItem | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Delete Confirm
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Form Fields
  const [formData, setFormData] = useState({
    employeeName: '',
    unit: 'Unit Digital',
    position: 'Data Analyst',
    competency: 'Data Analysis',
    currentLevel: 2,
    requiredLevel: 4,
    businessIssue: '',
    managementExpectation: '',
    status: 'SUBMITTED' as LNAStatus,
  });

  // Calculate live gap & priority in form
  const { gap: calculatedGap, priority: calculatedPriority } = useMemo(() => {
    return calculateGap(formData.requiredLevel, formData.currentLevel);
  }, [formData.requiredLevel, formData.currentLevel]);

  // Strict role-based dataset access
  const accessibleCCA = useMemo(() => {
    if (currentUser.role === 'USER DASAR') {
      // User Dasar can ONLY see their own data
      return ccaList.filter((item) =>
        item.employeeName.toLowerCase().includes(currentUser.name.toLowerCase())
      );
    }
    // Admin & Management see unit data
    return ccaList;
  }, [ccaList, currentUser]);

  // Unique lists for dropdowns
  const uniqueUnits = useMemo(() => Array.from(new Set(accessibleCCA.map((c) => c.unit))), [accessibleCCA]);
  const uniquePositions = useMemo(() => Array.from(new Set(accessibleCCA.map((c) => c.position))), [accessibleCCA]);

  // Filtered CCA List
  const filteredList = useMemo(() => {
    return accessibleCCA.filter((item) => {
      const matchSearch =
        searchTerm === '' ||
        item.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.competency.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.businessIssue.toLowerCase().includes(searchTerm.toLowerCase());

      const matchUnit = filterUnit === 'ALL' || item.unit === filterUnit;
      const matchJabatan = filterJabatan === 'ALL' || item.position === filterJabatan;
      const matchStatus = filterStatus === 'ALL' || item.status === filterStatus;
      const matchPriority = filterPriority === 'ALL' || item.priority === filterPriority;

      return matchSearch && matchUnit && matchJabatan && matchStatus && matchPriority;
    });
  }, [accessibleCCA, searchTerm, filterUnit, filterJabatan, filterStatus, filterPriority]);

  // Paginated Slices
  const totalPages = Math.ceil(filteredList.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredList.slice(start, start + pageSize);
  }, [filteredList, currentPage]);

  const handleOpenAddModal = () => {
    if (currentUser.role !== 'ADMIN') {
      onShowToast('error', 'Akses ditolak: Hanya ADMIN yang dapat menambah data CCA!', 'Izin Terbatas');
      return;
    }
    setEditingId(null);
    setFormData({
      employeeName: '',
      unit: 'Unit Digital',
      position: 'Data Analyst',
      competency: 'Data Analysis',
      currentLevel: 2,
      requiredLevel: 4,
      businessIssue: '',
      managementExpectation: '',
      status: 'SUBMITTED',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: CCAItem) => {
    if (currentUser.role !== 'ADMIN') {
      onShowToast('error', 'Akses ditolak: Hanya ADMIN yang dapat mengedit data CCA!', 'Izin Terbatas');
      return;
    }
    setEditingId(item.id);
    setFormData({
      employeeName: item.employeeName,
      unit: item.unit,
      position: item.position,
      competency: item.competency,
      currentLevel: item.currentLevel,
      requiredLevel: item.requiredLevel,
      businessIssue: item.businessIssue,
      managementExpectation: item.managementExpectation,
      status: item.status,
    });
    setIsModalOpen(true);
  };

  const handleOpenDetailModal = (item: CCAItem) => {
    setSelectedCCA(item);
    setIsDetailModalOpen(true);
  };

  const handleOpenReview = (item?: CCAItem) => {
    setSelectedCCA(item || null);
    setIsReviewModalOpen(true);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();

    if (currentUser.role !== 'ADMIN') {
      onShowToast('error', 'Akses ditolak: Hanya ADMIN yang dapat menyimpan perubahan data CCA!', 'Izin Terbatas');
      return;
    }

    if (!formData.employeeName.trim() || !formData.competency.trim()) {
      onShowToast('error', 'Nama Pegawai dan Kompetensi wajib diisi!', 'Validasi Gagal');
      return;
    }

    if (editingId) {
      const original = ccaList.find((c) => c.id === editingId)!;
      const updated: CCAItem = {
        ...original,
        ...formData,
        gap: calculatedGap,
        priority: calculatedPriority,
      };
      onUpdateCCA(updated);
      onShowToast('success', `Data CCA untuk ${formData.employeeName} berhasil diperbarui.`, 'CCA Diperbarui');
    } else {
      onAddCCA({
        ...formData,
        gap: calculatedGap,
        priority: calculatedPriority,
      });
      onShowToast('success', `Data CCA baru berhasil ditambahkan untuk ${formData.employeeName}.`, 'CCA Ditambahkan');
    }

    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (currentUser.role !== 'ADMIN') {
      onShowToast('error', 'Akses ditolak: Hanya ADMIN yang dapat menghapus data CCA!', 'Izin Terbatas');
      setDeleteTargetId(null);
      return;
    }
    if (deleteTargetId) {
      onDeleteCCA(deleteTargetId);
      onShowToast('success', 'Data CCA berhasil dihapus.', 'Data Terhapus');
      setDeleteTargetId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Description Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-[#00843D] uppercase tracking-wider">
              Tahap 01 · Evaluasi Kesenjangan Kompetensi
            </span>
            {currentUser.role === 'USER DASAR' && <ViewOnlyBadge label="VIEW ONLY - DATA PRIBADI" />}
            {currentUser.role === 'MANAGEMENT' && <ViewOnlyBadge label="MANAGEMENT MONITORING" />}
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
            {currentUser.role === 'USER DASAR' ? 'My Competency Gap (CCA)' : 'CCA – Competency Gap Analysis'}
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            {currentUser.role === 'USER DASAR'
              ? 'Hasil penilaian level kompetensi mandiri dan kesenjangan kompetensi Anda.'
              : 'Analisis kesenjangan kompetensi berdasarkan kebutuhan bisnis dan target organisasi.'}
          </p>
        </div>

        {/* Action Buttons based on Role */}
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
                onClick={onSyncToDNA}
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
                title="Kirim gap kompetensi High & Medium ke modul DNA"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#00843D]" />
                <span>Sinkronisasi ke DNA</span>
              </button>

              <button
                onClick={handleOpenAddModal}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#00843D] hover:bg-[#006B32] rounded-lg transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Tambah CCA</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* User Dasar Disclaimer Card */}
      {currentUser.role === 'USER DASAR' && (
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
          <Lock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Akses Pribadi Terproteksi:</span> Anda hanya melihat catatan kompetensi Anda sendiri (<strong>{currentUser.name}</strong>). Seluruh penyesuaian level dilakukan oleh Admin LNA setelah diverifikasi manajemen.
          </div>
        </div>
      )}

      {/* Toolbar: Search & Multi-Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Cari pegawai / kompetensi..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-[#F5F7F9] border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-[#00843D] focus:bg-white transition-colors"
            />
          </div>

          {/* Filter Unit */}
          <div>
            <select
              value={filterUnit}
              onChange={(e) => {
                setFilterUnit(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-xs bg-[#F5F7F9] border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-[#00843D]"
            >
              <option value="ALL">Semua Unit</option>
              {uniqueUnits.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Jabatan */}
          <div>
            <select
              value={filterJabatan}
              onChange={(e) => {
                setFilterJabatan(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-xs bg-[#F5F7F9] border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-[#00843D]"
            >
              <option value="ALL">Semua Jabatan</option>
              {uniquePositions.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Prioritas */}
          <div>
            <select
              value={filterPriority}
              onChange={(e) => {
                setFilterPriority(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-xs bg-[#F5F7F9] border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-[#00843D]"
            >
              <option value="ALL">Semua Prioritas</option>
              <option value="High">High (Gap $\ge$ 2)</option>
              <option value="Medium">Medium (Gap = 1)</option>
              <option value="Low">Low (Gap $\le$ 0)</option>
            </select>
          </div>

          {/* Filter Status */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPage(1);
              }}
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

        {/* Active Filter Clear & Total Stats */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
          <div>
            Menampilkan <span className="font-semibold text-slate-900">{filteredList.length}</span> data CCA
          </div>
          {(searchTerm || filterUnit !== 'ALL' || filterJabatan !== 'ALL' || filterStatus !== 'ALL' || filterPriority !== 'ALL') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterUnit('ALL');
                setFilterJabatan('ALL');
                setFilterStatus('ALL');
                setFilterPriority('ALL');
                setCurrentPage(1);
              }}
              className="text-[#00843D] hover:underline font-semibold"
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* Professional Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold tracking-wide">
                <th className="py-3 px-3.5 text-center w-12">No</th>
                <th className="py-3 px-3.5">Nama Pegawai</th>
                <th className="py-3 px-3">Unit</th>
                <th className="py-3 px-3">Jabatan</th>
                <th className="py-3 px-3">Kompetensi</th>
                <th className="py-3 px-2.5 text-center">Current</th>
                <th className="py-3 px-2.5 text-center">Required</th>
                <th className="py-3 px-2.5 text-center">Gap</th>
                <th className="py-3 px-3 text-center">Prioritas</th>
                <th className="py-3 px-3.5">Isu Bisnis</th>
                <th className="py-3 px-3.5">Harapan Manajemen</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3.5 text-right w-24">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={13} className="py-12 text-center text-slate-400">
                    Tidak ada data analisis CCA yang sesuai kriteria.
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, index) => {
                  const itemIndex = (currentPage - 1) * pageSize + index + 1;
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3.5 text-center font-mono text-slate-400 tabular-nums">
                        {itemIndex}
                      </td>
                      <td className="py-3 px-3.5 font-semibold text-slate-900 whitespace-nowrap">
                        {item.employeeName}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap text-slate-600">{item.unit}</td>
                      <td className="py-3 px-3 whitespace-nowrap text-slate-600">{item.position}</td>
                      <td className="py-3 px-3 font-medium text-slate-800 whitespace-nowrap">
                        {item.competency}
                      </td>
                      <td className="py-3 px-2.5 text-center font-mono font-medium">{item.currentLevel}</td>
                      <td className="py-3 px-2.5 text-center font-mono font-medium">{item.requiredLevel}</td>
                      <td className="py-3 px-2.5 text-center">
                        <span className="font-mono font-bold text-rose-600">{item.gap}</span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <PriorityBadge priority={item.priority} size="sm" />
                      </td>
                      <td className="py-3 px-3.5 max-w-xs truncate text-slate-600" title={item.businessIssue}>
                        {item.businessIssue}
                      </td>
                      <td className="py-3 px-3.5 max-w-xs truncate text-slate-600" title={item.managementExpectation}>
                        {item.managementExpectation}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <StatusBadge status={item.status} size="sm" />
                      </td>
                      <td className="py-3 px-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenDetailModal(item)}
                            className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                            title="Detail CCA"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Management review action */}
                          {currentUser.role === 'MANAGEMENT' && (
                            <button
                              onClick={() => handleOpenReview(item)}
                              className="p-1 rounded text-[#00843D] hover:bg-emerald-50 transition-colors"
                              title="Berikan Masukan / Review"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Admin only CRUD actions */}
                          {currentUser.role === 'ADMIN' && (
                            <>
                              <button
                                onClick={() => handleOpenEditModal(item)}
                                className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                                title="Edit CCA"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setDeleteTargetId(item.id)}
                                className="p-1 rounded text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                                title="Hapus CCA"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Toolbar */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 bg-slate-50/50 text-xs text-slate-600">
          <div>
            Halaman <span className="font-semibold text-slate-900">{currentPage}</span> dari{' '}
            <span className="font-semibold text-slate-900">{totalPages}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors ${
                  currentPage === i + 1
                    ? 'bg-[#00843D] text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal: Tambah / Edit CCA (ADMIN ONLY) */}
      {currentUser.role === 'ADMIN' && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingId ? 'Edit Analisis Kesenjangan (CCA)' : 'Tambah Data CCA Baru'}
          subtitle="Masukkan profil pegawai dan penilaian level kompetensi untuk perhitungan kesenjangan otomatis."
          maxWidth="2xl"
        >
          <form onSubmit={handleSubmitForm} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Unit Kerja</label>
                <input
                  type="text"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#00843D]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Jabatan</label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#00843D]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Kompetensi *</label>
                <input
                  type="text"
                  required
                  value={formData.competency}
                  onChange={(e) => setFormData({ ...formData, competency: e.target.value })}
                  placeholder="Contoh: Data Analysis, Leadership"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#00843D]"
                />
              </div>
            </div>

            {/* Level Assessment & Live Calculation */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-3">
                Penilaian Level Kompetensi & Auto-Calculation
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 items-center">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Current Level (1–5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={formData.currentLevel}
                    onChange={(e) => setFormData({ ...formData, currentLevel: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-center font-mono font-bold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">Required Level (1–5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={formData.requiredLevel}
                    onChange={(e) => setFormData({ ...formData, requiredLevel: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-center font-mono font-bold text-slate-800"
                  />
                </div>

                {/* Calculated Gap */}
                <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-400 block font-semibold">HASIL GAP</span>
                  <span className="text-xl font-extrabold font-mono text-rose-600">{calculatedGap}</span>
                  <span className="text-[10px] text-slate-500 block">Req - Curr</span>
                </div>

                {/* Calculated Priority */}
                <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-400 block font-semibold">PRIORITAS</span>
                  <div className="mt-1">
                    <PriorityBadge priority={calculatedPriority} size="sm" />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Isu Bisnis (Business Issue)</label>
              <textarea
                rows={2}
                value={formData.businessIssue}
                onChange={(e) => setFormData({ ...formData, businessIssue: e.target.value })}
                placeholder="Kendala bisnis atau proyek digital..."
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#00843D]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Harapan Manajemen</label>
              <textarea
                rows={2}
                value={formData.managementExpectation}
                onChange={(e) => setFormData({ ...formData, managementExpectation: e.target.value })}
                placeholder="Target kemampuan yang diharapkan..."
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#00843D]"
              />
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
                {editingId ? 'Simpan Perubahan' : 'Tambah CCA'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal Detail CCA */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Detail Analisis Kesenjangan (CCA)"
        subtitle={selectedCCA?.employeeName}
        maxWidth="lg"
      >
        {selectedCCA && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <span className="text-slate-400 block font-semibold text-[10px]">PEGAWAI</span>
                <span className="text-slate-900 font-bold text-sm">{selectedCCA.employeeName}</span>
                <span className="text-slate-500 block">{selectedCCA.position}</span>
                <span className="text-slate-500 block">{selectedCCA.unit}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold text-[10px]">KOMPETENSI</span>
                <span className="text-[#00843D] font-bold text-sm">{selectedCCA.competency}</span>
                <div className="mt-1.5 flex items-center gap-2">
                  <PriorityBadge priority={selectedCCA.priority} size="sm" />
                  <StatusBadge status={selectedCCA.status} size="sm" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-3 rounded-lg border border-slate-200 bg-white">
                <span className="text-slate-400 text-[10px] block">CURRENT LEVEL</span>
                <span className="text-xl font-bold font-mono text-slate-800">{selectedCCA.currentLevel}</span>
              </div>
              <div className="p-3 rounded-lg border border-slate-200 bg-white">
                <span className="text-slate-400 text-[10px] block">REQUIRED LEVEL</span>
                <span className="text-xl font-bold font-mono text-slate-800">{selectedCCA.requiredLevel}</span>
              </div>
              <div className="p-3 rounded-lg border border-rose-200 bg-rose-50 text-rose-700">
                <span className="text-rose-500 text-[10px] block font-semibold">GAP LEVEL</span>
                <span className="text-xl font-bold font-mono">{selectedCCA.gap}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <span className="font-semibold text-slate-800 block">Isu Bisnis Korporat:</span>
                <p className="text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200 leading-relaxed mt-1">
                  {selectedCCA.businessIssue || '-'}
                </p>
              </div>
              <div>
                <span className="font-semibold text-slate-800 block">Harapan Manajemen:</span>
                <p className="text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200 leading-relaxed mt-1">
                  {selectedCCA.managementExpectation || '-'}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
              {currentUser.role === 'MANAGEMENT' ? (
                <button
                  type="button"
                  onClick={() => {
                    setIsDetailModalOpen(false);
                    handleOpenReview(selectedCCA);
                  }}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#00843D] hover:bg-[#006B32] rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Berikan Masukan / Review</span>
                </button>
              ) : <div />}

              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal Review for Management */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        currentUser={currentUser}
        targetModule="Kompetensi"
        targetItemTitle={selectedCCA ? `${selectedCCA.employeeName} (${selectedCCA.competency})` : 'Data CCA Unit Digital'}
        onSubmitReview={onSubmitReview}
      />

      {/* Delete Confirmation (Admin Only) */}
      <ConfirmDialog
        isOpen={Boolean(deleteTargetId)}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleConfirmDelete}
        title="Hapus Data Analisis CCA?"
        message="Hanya ADMIN yang memiliki otoritas menghapus data master CCA."
        confirmText="Hapus Permanen"
        cancelText="Batal"
        isDestructive={true}
      />
    </div>
  );
};
