import React, { useState } from 'react';
import { Modal } from './Modal';
import { PriorityLevel, ReviewFeedback, User } from '../types';
import { MessageSquare, CheckCircle, AlertTriangle, Send } from 'lucide-react';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  targetModule?: string;
  targetItemTitle?: string;
  onSubmitReview: (review: Omit<ReviewFeedback, 'id' | 'createdAt'>) => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  targetModule = 'Kompetensi',
  targetItemTitle,
  onSubmitReview,
}) => {
  const [unit, setUnit] = useState(
    'Sub Bidang Pengelolaan Pembelajaran, Asesmen & Sertifikasi Digital (Bidang Perencanaan)'
  );
  const [period, setPeriod] = useState('2026');
  const [category, setCategory] = useState<ReviewFeedback['category']>(
    (targetModule as any) || 'Kompetensi'
  );
  const [comment, setComment] = useState('');
  const [priority, setPriority] = useState<PriorityLevel>('High');

  const handleAction = (decision: 'Kirim Masukan' | 'Setujui' | 'Minta Revisi') => {
    if (!comment.trim()) {
      alert('Silakan tuliskan catatan atau komentar masukan untuk Admin.');
      return;
    }

    let status: ReviewFeedback['status'] = 'Menunggu Review';
    if (decision === 'Setujui') status = 'Disetujui';
    if (decision === 'Minta Revisi') status = 'Perlu Revisi';

    onSubmitReview({
      unit,
      period,
      category,
      comment,
      priority,
      decision,
      status,
      reviewerName: currentUser.name,
      reviewerRole: currentUser.role,
      targetModule,
      targetItemTitle,
    });

    setComment('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Review LNA"
      subtitle={targetItemTitle ? `Masukan & Evaluasi untuk: ${targetItemTitle}` : 'Evaluasi dan Berikan Masukan Manajemen kepada Admin'}
      maxWidth="xl"
    >
      <div className="space-y-4 text-xs">
        {/* Unit & Periode */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Nama Bagian / Unit</label>
            <input
              type="text"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#00843D]"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Periode</label>
            <input
              type="text"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#00843D]"
            />
          </div>
        </div>

        {/* Kategori & Prioritas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Kategori Masukan</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#00843D]"
            >
              <option value="Kompetensi">Kompetensi (CCA/DNA)</option>
              <option value="Learning Path">Learning Path</option>
              <option value="TNA">TNA (Training Need Analysis)</option>
              <option value="Learning Solution">Learning Solution</option>
              <option value="Laporan">Laporan / LNA Report</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Prioritas Tindak Lanjut</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as PriorityLevel)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#00843D]"
            >
              <option value="High">Tinggi (High Priority)</option>
              <option value="Medium">Sedang (Medium)</option>
              <option value="Low">Rendah (Low)</option>
            </select>
          </div>
        </div>

        {/* Komentar / Masukan */}
        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            Komentar / Masukan Manajemen *
          </label>
          <textarea
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tuliskan arahan manajemen, poin revisi kurikulum, penyesuaian gap target level, atau persetujuan pelaksanaan..."
            className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#00843D] leading-relaxed"
          />
        </div>

        {/* Info Box */}
        <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg text-slate-700 text-[11px] leading-relaxed">
          <span className="font-semibold text-[#006B32]">Prinsip Tata Kelola:</span> Manajemen tidak mengubah data utama secara langsung, melainkan memberikan arahan revisi atau persetujuan kepada Admin LNA.
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Tutup
          </button>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={() => handleAction('Minta Revisi')}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Minta Revisi</span>
            </button>

            <button
              type="button"
              onClick={() => handleAction('Kirim Masukan')}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 text-slate-500" />
              <span>Kirim Masukan</span>
            </button>

            <button
              type="button"
              onClick={() => handleAction('Setujui')}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#00843D] hover:bg-[#006B32] rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Setujui</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
