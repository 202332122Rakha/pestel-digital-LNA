import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { User as UserIcon, Mail, Building, Briefcase, Shield, Save, CheckCircle2, Lock } from 'lucide-react';
import { ViewOnlyBadge } from '../components/StatusBadge';

interface ProfilePageProps {
  currentUser: User;
  onUpdateUser: (updatedUser: User) => void;
  onShowToast: (type: 'success' | 'error' | 'info' | 'warning', message: string, title?: string) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  currentUser,
  onUpdateUser,
  onShowToast,
}) => {
  const [formData, setFormData] = useState({
    name: currentUser.name,
    email: currentUser.email,
    unit: currentUser.unit,
    jabatan: currentUser.jabatan,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      onShowToast('error', 'Nama dan Email tidak boleh kosong.', 'Validasi Gagal');
      return;
    }

    const updatedUser: User = {
      ...currentUser,
      ...formData,
    };

    onUpdateUser(updatedUser);
    onShowToast('success', 'Profil pegawai berhasil diperbarui dan disimpan.', 'Profil Disimpan');
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'MANAGEMENT':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-amber-100 text-amber-800 border-amber-200';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Profile Pegawai</h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Informasi identitas akun dan penugasan pada sistem PLN Digital LNA.
          </p>
        </div>
        {currentUser.role === 'USER DASAR' && <ViewOnlyBadge label="VIEW ONLY DATA" />}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* User Card Overview */}
        <div className="md:col-span-4 bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col items-center text-center justify-between">
          <div className="flex flex-col items-center w-full">
            <div className="w-24 h-24 rounded-full bg-[#00843D] text-white flex items-center justify-center text-2xl font-extrabold shadow-md mb-4 ring-4 ring-emerald-50">
              {formData.name
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')}
            </div>
            <h2 className="text-base font-bold text-slate-900">{formData.name}</h2>
            <p className="text-xs text-slate-500 mt-0.5">{formData.email}</p>

            <div className="mt-3">
              <span className={`px-2.5 py-1 rounded-md border text-xs font-bold ${getRoleBadge(currentUser.role)}`}>
                Role: {currentUser.role}
              </span>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 w-full text-left space-y-2 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] font-semibold uppercase">JABATAN</span>
                <span className="font-medium text-slate-800">{formData.jabatan}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-semibold uppercase">UNIT KERJA</span>
                <span className="font-medium text-slate-800">{formData.unit}</span>
              </div>
            </div>
          </div>

          <div className="w-full mt-6 pt-4 border-t border-slate-100 text-[11px] text-emerald-700 bg-emerald-50/60 p-2.5 rounded-lg border border-emerald-100 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#00843D] shrink-0" />
            <span>Kredensial tersertifikasi SSO PLN</span>
          </div>
        </div>

        {/* Edit Form */}
        <div className="md:col-span-8 bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
            Data Pegawai & Akun
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Nama Lengkap Pegawai
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    disabled={currentUser.role !== 'ADMIN'}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-slate-900 ${
                      currentUser.role !== 'ADMIN'
                        ? 'bg-slate-50 border-slate-200 cursor-not-allowed text-slate-600'
                        : 'bg-white border-slate-300 focus:outline-none focus:border-[#00843D]'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  NIP / ID Karyawan (Read-Only)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    disabled
                    value={currentUser.nip || currentUser.employeeId || '2023091048'}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 font-mono cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Alamat Email Korporat
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    disabled={currentUser.role !== 'ADMIN'}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-slate-900 ${
                      currentUser.role !== 'ADMIN'
                        ? 'bg-slate-50 border-slate-200 cursor-not-allowed text-slate-600'
                        : 'bg-white border-slate-300 focus:outline-none focus:border-[#00843D]'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Status Akun Pegawai
                </label>
                <div className="relative">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    disabled
                    value={currentUser.status || 'Aktif'}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-emerald-800 font-semibold cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Unit Organisasi
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    disabled={currentUser.role !== 'ADMIN'}
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-slate-900 ${
                      currentUser.role !== 'ADMIN'
                        ? 'bg-slate-50 border-slate-200 cursor-not-allowed text-slate-600'
                        : 'bg-white border-slate-300 focus:outline-none focus:border-[#00843D]'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Jabatan / Posisi
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    disabled={currentUser.role !== 'ADMIN'}
                    value={formData.jabatan}
                    onChange={(e) => setFormData({ ...formData, jabatan: e.target.value })}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-slate-900 ${
                      currentUser.role !== 'ADMIN'
                        ? 'bg-slate-50 border-slate-200 cursor-not-allowed text-slate-600'
                        : 'bg-white border-slate-300 focus:outline-none focus:border-[#00843D]'
                    }`}
                  />
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#00843D]" />
                <span className="font-semibold text-slate-800">Hak Akses & Otoritas:</span>
              </div>
              <p className="text-[11.5px] text-slate-500 mt-1 leading-relaxed">
                Akun ini memiliki hak akses level <span className="font-bold text-slate-800">{currentUser.role}</span>.
                {currentUser.role === 'ADMIN' && ' Memiliki izin penuh (Full CRUD) mengelola data utama LNA dan user.'}
                {currentUser.role === 'USER DASAR' && ' Data identitas Anda bersifat Read-Only dan dikelola langsung oleh Administrator.'}
                {currentUser.role === 'MANAGEMENT' && ' Memiliki izin evaluasi, review feedback, dan persetujuan tingkat pimpinan unit.'}
              </p>
            </div>

            {currentUser.role === 'ADMIN' && (
              <div className="pt-4 border-t border-slate-200 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#00843D] hover:bg-[#006B32] text-white font-semibold text-xs md:text-sm rounded-lg transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan Profil</span>
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
