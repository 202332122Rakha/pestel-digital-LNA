import React, { useState, useMemo } from 'react';
import {
  UserCheck,
  Plus,
  Search,
  Edit,
  Trash2,
  Lock,
  KeyRound,
  CheckCircle2,
  XCircle,
  Building,
  Shield,
  Briefcase,
  X,
  RefreshCw,
  Users,
  Eye,
  EyeOff
} from 'lucide-react';
import { User, UserRole, Employee } from '../types';

interface UserManagementPageProps {
  currentUser: User;
  users: User[];
  employees: Employee[];
  onAddUser: (user: User) => void;
  onUpdateUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
  onToggleStatus: (userId: string) => void;
  onResetPassword: (userId: string, newPass: string) => void;
  onShowToast: (type: 'success' | 'error' | 'info' | 'warning', message: string, title?: string) => void;
}

export const UserManagementPage: React.FC<UserManagementPageProps> = ({
  currentUser,
  users,
  employees,
  onAddUser,
  onUpdateUser,
  onDeleteUser,
  onToggleStatus,
  onResetPassword,
  onShowToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<'ALL' | UserRole>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<'ALL' | 'Aktif' | 'Nonaktif'>('ALL');

  // Modal Add / Edit
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    nip: '',
    username: '',
    role: 'USER DASAR' as UserRole,
    unit: 'Sub Bidang Pengelolaan Pembelajaran, Asesmen & Sertifikasi Digital',
    jabatan: '',
    employeeId: '',
    password: 'user123',
    status: 'Aktif' as 'Aktif' | 'Nonaktif',
  });

  // Reset Password Modal
  const [resetModalUser, setResetModalUser] = useState<User | null>(null);
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [showPassText, setShowPassText] = useState(false);

  // Delete Confirm
  const [deleteConfirmUser, setDeleteConfirmUser] = useState<User | null>(null);

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.nip && u.nip.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (u.jabatan && u.jabatan.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (u.employeeId && u.employeeId.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchRole = selectedRole === 'ALL' || u.role === selectedRole;
      const matchStatus = selectedStatus === 'ALL' || (u.status || 'Aktif') === selectedStatus;

      return matchSearch && matchRole && matchStatus;
    });
  }, [users, searchQuery, selectedRole, selectedStatus]);

  const handleOpenAdd = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      nip: '',
      username: '',
      role: 'USER DASAR',
      unit: 'Sub Bidang Pengelolaan Pembelajaran, Asesmen & Sertifikasi Digital',
      jabatan: '',
      employeeId: '',
      password: 'user123',
      status: 'Aktif',
    });
    setShowModal(true);
  };

  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      nip: user.nip || '',
      username: user.username,
      role: user.role,
      unit: user.unit,
      jabatan: user.jabatan,
      employeeId: user.employeeId || '',
      password: user.password || '••••••••',
      status: user.status || 'Aktif',
    });
    setShowModal(true);
  };

  const handleSelectEmployeeLink = (empId: string) => {
    const selectedEmp = employees.find((e) => e.id === empId);
    if (selectedEmp) {
      setFormData((prev) => ({
        ...prev,
        employeeId: selectedEmp.id,
        name: selectedEmp.name,
        nip: selectedEmp.nip,
        unit: selectedEmp.unit,
        jabatan: selectedEmp.position,
        username: selectedEmp.name.toLowerCase().replace(/[^a-z0-9]/g, '.'),
      }));
    }
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.username) {
      onShowToast('error', 'Nama dan Username wajib diisi!', 'Validasi Gagal');
      return;
    }

    if (editingUser) {
      const updated: User = {
        ...editingUser,
        name: formData.name,
        nip: formData.nip,
        username: formData.username.toLowerCase().trim(),
        role: formData.role,
        unit: formData.unit,
        jabatan: formData.jabatan,
        employeeId: formData.employeeId,
        status: formData.status,
        ...(formData.password && !formData.password.includes('•') ? { password: formData.password } : {}),
      };
      onUpdateUser(updated);
      onShowToast('success', `Akun pegawai ${updated.name} berhasil diperbarui.`, 'Simpan Berhasil');
    } else {
      // Check username collision
      if (users.some((u) => u.username.toLowerCase() === formData.username.toLowerCase())) {
        onShowToast('error', 'Username sudah digunakan oleh akun lain! Gunakan username unik.', 'Duplikasi Akun');
        return;
      }

      const newUser: User = {
        id: `u-${Date.now().toString().slice(-6)}`,
        name: formData.name,
        nip: formData.nip,
        username: formData.username.toLowerCase().trim(),
        email: `${formData.username.toLowerCase().trim()}@pln.co.id`,
        role: formData.role,
        unit: formData.unit,
        jabatan: formData.jabatan,
        employeeId: formData.employeeId || `EMP-${Date.now().toString().slice(-4)}`,
        password: formData.password || 'user123',
        status: formData.status,
      };
      onAddUser(newUser);
      onShowToast('success', `Akun ${newUser.name} (${newUser.username}) berhasil dibuat dan siap login.`, 'Akun Baru Dibuat');
    }
    setShowModal(false);
  };

  const handleConfirmResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetModalUser || !newPasswordInput.trim()) return;

    onResetPassword(resetModalUser.id, newPasswordInput.trim());
    onShowToast('success', `Password akun ${resetModalUser.name} berhasil direset.`, 'Reset Password Berhasil');
    setResetModalUser(null);
    setNewPasswordInput('');
  };

  const handleConfirmDelete = () => {
    if (!deleteConfirmUser) return;
    if (deleteConfirmUser.id === currentUser.id) {
      onShowToast('error', 'Anda tidak dapat menghapus akun Anda sendiri yang sedang aktif!', 'Operasi Ditolak');
      setDeleteConfirmUser(null);
      return;
    }

    onDeleteUser(deleteConfirmUser.id);
    onShowToast('info', `Akun ${deleteConfirmUser.name} telah dihapus dari sistem.`, 'Akun Dihapus');
    setDeleteConfirmUser(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                Manajemen User & Akun Pegawai
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  ADMIN ONLY
                </span>
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Pengelolaan akun akses sistem PLN Digital LNA, penentuan role, aktivasi, dan penghubungan dengan data karyawan
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Tambah User</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama, NIP, username, employee ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500 font-medium">Filter Role:</span>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as any)}
              className="text-xs px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            >
              <option value="ALL">Semua Role</option>
              <option value="ADMIN">ADMIN</option>
              <option value="USER DASAR">USER (Pegawai)</option>
              <option value="MANAGEMENT">MANAGEMENT</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500 font-medium">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="text-xs px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            >
              <option value="ALL">Semua Status</option>
              <option value="Aktif">Aktif</option>
              <option value="Nonaktif">Nonaktif</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table of User Accounts */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-semibold text-[10px] tracking-wider">
              <tr>
                <th className="px-4 py-3">No</th>
                <th className="px-4 py-3">Nama Pegawai / Email</th>
                <th className="px-4 py-3">Username</th>
                <th className="px-4 py-3">NIP / Employee ID</th>
                <th className="px-4 py-3">Role Akses</th>
                <th className="px-4 py-3">Unit & Jabatan</th>
                <th className="px-4 py-3 text-center">Status Akun</th>
                <th className="px-4 py-3 text-center">Credential</th>
                <th className="px-4 py-3 text-right">Aksi Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    Tidak ada akun pegawai yang sesuai kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u, idx) => (
                  <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3 font-mono text-slate-400">{idx + 1}</td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-800">{u.name}</div>
                      <div className="text-[11px] text-slate-400">{u.email}</div>
                    </td>
                    <td className="px-4 py-3 font-mono font-medium text-emerald-800 bg-emerald-50/30">
                      {u.username}
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-700">
                      <div>{u.nip || '-'}</div>
                      <div className="text-[10px] text-slate-400">{u.employeeId || '-'}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          u.role === 'ADMIN'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : u.role === 'MANAGEMENT'
                            ? 'bg-purple-100 text-purple-800 border border-purple-300'
                            : 'bg-blue-100 text-blue-800 border border-blue-300'
                        }`}
                      >
                        {u.role === 'USER DASAR' ? 'USER' : u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-700">{u.jabatan || 'Staff'}</div>
                      <div className="text-[11px] text-slate-400">{u.unit}</div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => onToggleStatus(u.id)}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-colors cursor-pointer ${
                          (u.status || 'Aktif') === 'Aktif'
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                        }`}
                        title="Klik untuk mengubah status aktif/nonaktif"
                      >
                        {(u.status || 'Aktif') === 'Aktif' ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Aktif</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 text-rose-600" />
                            <span>Nonaktif</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center font-mono text-slate-400 text-[11px]">
                      ••••••••
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => {
                            setResetModalUser(u);
                            setNewPasswordInput('');
                          }}
                          className="p-1.5 text-slate-500 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                          title="Reset Password"
                        >
                          <KeyRound className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(u)}
                          className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                          title="Edit User"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmUser(u)}
                          className="p-1.5 text-slate-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Hapus User"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit User */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-emerald-600" />
                {editingUser ? 'Edit Akun Pegawai' : 'Tambah User Pegawai Baru'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="mt-4 space-y-3.5 text-xs">
              {/* Dropdown Hubungkan Data Karyawan */}
              {!editingUser && (
                <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200">
                  <label className="block text-emerald-900 font-bold mb-1">
                    Hubungkan Data Karyawan (Opsional)
                  </label>
                  <select
                    onChange={(e) => handleSelectEmployeeLink(e.target.value)}
                    className="w-full px-3 py-2 border border-emerald-300 rounded-lg bg-white text-xs focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">-- Pilih dari Direktori Karyawan PLN --</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.name} ({emp.nip}) - {emp.position}
                      </option>
                    ))}
                  </select>
                  <p className="text-[10px] text-emerald-700 mt-1">
                    Memilih karyawan akan otomatis mengisi Nama, NIP, Unit, Jabatan, dan Employee ID.
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Nama Lengkap</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Contoh: Rakha Nugroho"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">NIP Pegawai</label>
                  <input
                    type="text"
                    value={formData.nip}
                    onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                    placeholder="Contoh: 2023091048"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Username Login</label>
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="Contoh: rakha.nugroho"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Role Akun</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 font-semibold"
                  >
                    <option value="USER DASAR">USER (Pegawai / View Only)</option>
                    <option value="MANAGEMENT">MANAGEMENT (Review & Monitoring)</option>
                    <option value="ADMIN">ADMIN (Full Governance)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Unit Organisasi</label>
                  <input
                    type="text"
                    required
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Jabatan</label>
                  <input
                    type="text"
                    required
                    value={formData.jabatan}
                    onChange={(e) => setFormData({ ...formData, jabatan: e.target.value })}
                    placeholder="Contoh: Staff Digital Specialist"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Employee ID</label>
                  <input
                    type="text"
                    value={formData.employeeId}
                    onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                    placeholder="Contoh: EMP-RAKHA"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Status Akun</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Nonaktif">Nonaktif</option>
                  </select>
                </div>
              </div>

              {!editingUser && (
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Password Awal</label>
                  <input
                    type="text"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Contoh: user123"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Password ini akan digunakan pegawai saat login pertama kali.
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-sm cursor-pointer"
                >
                  SIMPAN USER
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Reset Password */}
      {resetModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-amber-600" />
                Reset Password Akun
              </h3>
              <button
                onClick={() => setResetModalUser(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmResetPassword} className="mt-4 space-y-3.5 text-xs">
              <div>
                <span className="text-slate-500">Nama Pegawai:</span>
                <div className="font-bold text-slate-800 mt-0.5">{resetModalUser.name}</div>
                <div className="text-slate-400 font-mono text-[11px]">{resetModalUser.username}</div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Password Baru</label>
                <div className="relative">
                  <input
                    type={showPassText ? 'text' : 'password'}
                    required
                    value={newPasswordInput}
                    onChange={(e) => setNewPasswordInput(e.target.value)}
                    placeholder="Masukkan password baru..."
                    className="w-full px-3 py-2 pr-9 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassText(!showPassText)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassText ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setResetModalUser(null)}
                  className="px-3 py-1.5 border border-slate-200 rounded-xl hover:bg-slate-50 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold shadow-sm"
                >
                  Set Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-base">Hapus Akun Pegawai</h3>
            <p className="text-xs text-slate-500 mt-2">
              Apakah Anda yakin ingin menghapus akun <strong>{deleteConfirmUser.name}</strong> ({deleteConfirmUser.username})?
              Pegawai ini tidak akan dapat login lagi ke sistem.
            </p>
            <div className="flex justify-center gap-2 mt-5">
              <button
                onClick={() => setDeleteConfirmUser(null)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-sm"
              >
                Hapus Akun
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
