import React, { useState } from 'react';
import {
  MessageSquareText,
  Plus,
  CheckCircle,
  AlertTriangle,
  Clock,
  Send,
  Building2,
  Calendar,
  Filter,
  Search,
  User as UserIcon,
  CheckCircle2,
  CornerDownRight,
  ShieldAlert,
} from 'lucide-react';
import { ReviewFeedback, User, PriorityLevel } from '../types';
import { PriorityBadge } from '../components/StatusBadge';
import { ReviewModal } from '../components/ReviewModal';
import { formatDate } from '../utils/helpers';

interface ReviewFeedbackPageProps {
  currentUser: User;
  reviewList: ReviewFeedback[];
  onSubmitReview: (review: Omit<ReviewFeedback, 'id' | 'createdAt'>) => void;
  onUpdateReviewStatus: (id: string, status: ReviewFeedback['status'], adminResponse?: string) => void;
  onShowToast: (type: 'success' | 'error' | 'info' | 'warning', message: string, title?: string) => void;
}

export const ReviewFeedbackPage: React.FC<ReviewFeedbackPageProps> = ({
  currentUser,
  reviewList,
  onSubmitReview,
  onUpdateReviewStatus,
  onShowToast,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [respondingId, setRespondingId] = useState<string | null>(null);
  const [adminResponseText, setAdminResponseText] = useState('');

  const filteredReviews = reviewList.filter((item) => {
    const matchSearch =
      searchTerm === '' ||
      item.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.targetItemTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.reviewerName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchCategory = filterCategory === 'ALL' || item.category === filterCategory;
    const matchStatus = filterStatus === 'ALL' || item.status === filterStatus;

    return matchSearch && matchCategory && matchStatus;
  });

  const getReviewStatusBadge = (status: ReviewFeedback['status']) => {
    switch (status) {
      case 'Disetujui':
        return 'bg-emerald-50 text-[#006B32] border-emerald-200';
      case 'Perlu Revisi':
        return 'bg-orange-50 text-orange-800 border-orange-200';
      case 'Selesai':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-amber-50 text-amber-800 border-amber-200';
    }
  };

  const handleAdminResolve = (id: string) => {
    if (currentUser.role !== 'ADMIN') return;
    onUpdateReviewStatus(id, 'Selesai', adminResponseText);
    setRespondingId(null);
    setAdminResponseText('');
    onShowToast('success', 'Catatan Management telah ditindaklanjuti & status diubah menjadi Selesai.', 'Tindak Lanjut Berhasil');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-[#00843D] uppercase tracking-wider">
              Governance & Oversight Console
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
            Review & Feedback Management
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Kanal resmi komunikasi, umpan balik, dan permintaan revisi antara jajaran Management dan Admin LNA PLN Corpu.
          </p>
        </div>

        {currentUser.role === 'MANAGEMENT' && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#00843D] hover:bg-[#006B32] rounded-lg transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Berikan Masukan Baru</span>
          </button>
        )}
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase">Menunggu Review</span>
          <div className="text-2xl font-bold font-mono text-amber-700 mt-2">
            {reviewList.filter((r) => r.status === 'Menunggu Review').length}
          </div>
          <span className="text-[11px] text-slate-400">Belum diputuskan</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase">Perlu Revisi</span>
          <div className="text-2xl font-bold font-mono text-orange-700 mt-2">
            {reviewList.filter((r) => r.status === 'Perlu Revisi').length}
          </div>
          <span className="text-[11px] text-orange-600 font-semibold">Tindakan Admin</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase">Disetujui</span>
          <div className="text-2xl font-bold font-mono text-[#006B32] mt-2">
            {reviewList.filter((r) => r.status === 'Disetujui').length}
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold">Approved by VP</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase">Tindak Lanjut Selesai</span>
          <div className="text-2xl font-bold font-mono text-blue-700 mt-2">
            {reviewList.filter((r) => r.status === 'Selesai').length}
          </div>
          <span className="text-[11px] text-slate-400">Revisi terakomodir</span>
        </div>
      </div>

      {/* Toolbar Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari komentar atau item sasaran..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-[#F5F7F9] border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-[#00843D] focus:bg-white"
          />
        </div>

        <div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-[#F5F7F9] border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-[#00843D]"
          >
            <option value="ALL">Semua Kategori</option>
            <option value="Kompetensi">Kompetensi (CCA/DNA)</option>
            <option value="Learning Path">Learning Path</option>
            <option value="TNA">TNA</option>
            <option value="Learning Solution">Learning Solution</option>
            <option value="Laporan">Laporan</option>
          </select>
        </div>

        <div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-[#F5F7F9] border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-[#00843D]"
          >
            <option value="ALL">Semua Status Review</option>
            <option value="Menunggu Review">Menunggu Review</option>
            <option value="Perlu Revisi">Perlu Revisi</option>
            <option value="Disetujui">Disetujui</option>
            <option value="Selesai">Selesai</option>
          </select>
        </div>
      </div>

      {/* Review Items List */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-xl border border-slate-200 text-xs text-slate-400">
            Tidak ada catatan masukan atau permintaan revisi yang sesuai filter.
          </div>
        ) : (
          filteredReviews.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-sm text-slate-900">
                    {item.targetItemTitle || `Masukan Modul ${item.category}`}
                  </span>
                  <span className="text-[10.5px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                    Kategori: {item.category}
                  </span>
                  <PriorityBadge priority={item.priority} size="sm" />
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded border text-[11px] font-bold ${getReviewStatusBadge(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>
                  <span className="text-[10.5px] text-slate-400 font-mono">
                    {formatDate(item.createdAt)}
                  </span>
                </div>
              </div>

              {/* Review Comment Body */}
              <div className="text-xs text-slate-700 bg-slate-50/70 p-3.5 rounded-lg border border-slate-200/80 leading-relaxed">
                <div className="flex items-center gap-1.5 text-slate-500 font-semibold mb-1 text-[11px]">
                  <MessageSquareText className="w-3.5 h-3.5 text-[#00843D]" />
                  <span>Arahan & Catatan Manajemen ({item.reviewerName}):</span>
                </div>
                <p className="mt-1">{item.comment}</p>
              </div>

              {/* Admin Response Section (if exists) */}
              {item.adminResponse && (
                <div className="text-xs text-slate-700 bg-emerald-50/50 p-3 rounded-lg border border-emerald-200/60 leading-relaxed ml-4">
                  <div className="flex items-center gap-1.5 text-[#006B32] font-semibold text-[11px] mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Tindak Lanjut Admin LNA:</span>
                  </div>
                  <p>{item.adminResponse}</p>
                </div>
              )}

              {/* Admin Action Buttons (To respond or mark resolved) */}
              {currentUser.role === 'ADMIN' && item.status === 'Perlu Revisi' && (
                <div className="pt-2">
                  {respondingId === item.id ? (
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2 text-xs">
                      <label className="block font-semibold text-slate-700">
                        Tuliskan Catatan Perbaikan Data Admin:
                      </label>
                      <textarea
                        rows={2}
                        value={adminResponseText}
                        onChange={(e) => setAdminResponseText(e.target.value)}
                        placeholder="Contoh: Modul kepemimpinan agile multi-vendor telah ditambahkan pada silabus..."
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#00843D]"
                      />
                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setRespondingId(null)}
                          className="px-3 py-1.5 text-xs text-slate-600 bg-white border border-slate-200 rounded-md"
                        >
                          Batal
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAdminResolve(item.id)}
                          className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#00843D] hover:bg-[#006B32] rounded-md transition-colors"
                        >
                          Tandai Selesai Direvisi
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setRespondingId(item.id);
                        setAdminResponseText('');
                      }}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-md transition-colors flex items-center gap-1.5"
                    >
                      <CornerDownRight className="w-3.5 h-3.5 text-[#00843D]" />
                      <span>Tanggapi & Selesaikan Revisi</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Review Modal for Management */}
      <ReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentUser={currentUser}
        onSubmitReview={onSubmitReview}
      />
    </div>
  );
};
