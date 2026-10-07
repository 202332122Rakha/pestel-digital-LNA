import React, { useState, useMemo } from 'react';
import {
  Users,
  Award,
  Plus,
  Search,
  Edit,
  Trash2,
  Building,
  Briefcase,
  X,
  History,
  GraduationCap,
  UserPlus,
  UserCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Filter,
  ShieldAlert,
  Calendar,
  AlertTriangle,
  FileText
} from 'lucide-react';
import { User, Employee, CompetencyStandard, EmployeeMutation, TrainingItem, PriorityLevel } from '../types';

interface MasterDataPageProps {
  currentUser: User;
  employees: Employee[];
  competencies: CompetencyStandard[];
  mutations: EmployeeMutation[];
  trainings: TrainingItem[];
  initialSubTab?: 'karyawan' | 'pengubahan' | 'karyawan-masuk' | 'pelatihan' | 'kompetensi';
  onAddEmployee: (emp: Employee) => void;
  onUpdateEmployee: (emp: Employee) => void;
  onDeleteEmployee: (id: string) => void;
  onAddMutation: (mut: EmployeeMutation) => void;
  onAddTraining: (trn: TrainingItem) => void;
  onUpdateTraining: (trn: TrainingItem) => void;
  onDeleteTraining: (id: string) => void;
  onAddCompetency: (comp: CompetencyStandard) => void;
  onUpdateCompetency: (comp: CompetencyStandard) => void;
  onDeleteCompetency: (id: string) => void;
  onNavigateToUserManagement?: () => void;
  onShowToast?: (type: 'success' | 'error' | 'info' | 'warning', message: string, title?: string) => void;
}

export const MasterDataPage: React.FC<MasterDataPageProps> = ({
  currentUser,
  employees,
  competencies,
  mutations,
  trainings,
  initialSubTab = 'karyawan',
  onAddEmployee,
  onUpdateEmployee,
  onDeleteEmployee,
  onAddMutation,
  onAddTraining,
  onUpdateTraining,
  onDeleteTraining,
  onAddCompetency,
  onUpdateCompetency,
  onDeleteCompetency,
  onNavigateToUserManagement,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'karyawan' | 'pengubahan' | 'karyawan-masuk' | 'pelatihan' | 'kompetensi'>(initialSubTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('ALL');

  // Employee modal state
  const [showEmpModal, setShowEmpModal] = useState(false);
  const [editingEmp, setEditingEmp] = useState<Employee | null>(null);
  const [empForm, setEmpForm] = useState<Partial<Employee>>({
    nip: '',
    name: '',
    email: '',
    unit: 'Sub Bidang Pengelolaan Pembelajaran, Asesmen & Sertifikasi Digital',
    position: '',
    supervisor: 'Manajer Pengelolaan Digital',
    status: 'Aktif',
    competencies: ['Data Analysis'],
    currentLevel: 2,
    requiredLevel: 4,
    gap: 2,
    priority: 'High',
    trainingStatus: 'Rekomendasi',
    joinDate: new Date().toISOString().split('T')[0],
  });

  // Karyawan Masuk Form State
  const [newIncomingEmp, setNewIncomingEmp] = useState({
    id: `EMP-${Date.now().toString().slice(-4)}`,
    nip: `2024${Math.floor(100000 + Math.random() * 900000)}`,
    name: '',
    unit: 'Sub Bidang Pengelolaan Pembelajaran, Asesmen & Sertifikasi Digital',
    position: '',
    supervisor: 'Manajer Pengelolaan Digital',
    joinDate: new Date().toISOString().split('T')[0],
    initialCompetency: 'Data Analysis',
    currentLevel: 2,
    requiredLevel: 4,
    status: 'Aktif' as const,
  });

  // Mutation Modal State
  const [showMutationModal, setShowMutationModal] = useState(false);
  const [mutationForm, setMutationForm] = useState({
    employeeId: '',
    changeType: 'Perubahan Unit' as EmployeeMutation['changeType'],
    oldValue: '',
    newValue: '',
    notes: '',
  });

  // Training Modal State
  const [showTrainingModal, setShowTrainingModal] = useState(false);
  const [editingTraining, setEditingTraining] = useState<TrainingItem | null>(null);
  const [trainingForm, setTrainingForm] = useState<Partial<TrainingItem>>({
    name: '',
    targetCompetency: 'Data Analysis',
    targetLevel: 4,
    method: 'Blended',
    duration: '32 Jam (4 Hari)',
    priority: 'High',
    targetAudience: 'Digital Specialist, Analyst',
    status: 'Tersedia',
  });

  // Delete Confirm State
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: 'emp' | 'trn' | 'comp';
    id: string;
    name: string;
  } | null>(null);

  const units = useMemo(() => {
    return Array.from(new Set(employees.map((e) => e.unit)));
  }, [employees]);

  // Filtered Employees
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchSearch =
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.nip.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchUnit = selectedUnit === 'ALL' || emp.unit === selectedUnit;
      return matchSearch && matchUnit;
    });
  }, [employees, searchQuery, selectedUnit]);

  // Filtered Mutations
  const filteredMutations = useMemo(() => {
    return mutations.filter((m) => {
      return (
        m.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.nip.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.changeType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.newValue.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [mutations, searchQuery]);

  // Filtered Trainings
  const filteredTrainings = useMemo(() => {
    return trainings.filter((t) => {
      return (
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.targetCompetency.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.method.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [trainings, searchQuery]);

  const handleOpenAddEmp = () => {
    setEditingEmp(null);
    setEmpForm({
      nip: `2024${Math.floor(100000 + Math.random() * 900000)}`,
      name: '',
      email: '',
      unit: 'Sub Bidang Pengelolaan Pembelajaran, Asesmen & Sertifikasi Digital',
      position: '',
      supervisor: 'Manajer Pengelolaan Digital',
      status: 'Aktif',
      competencies: ['Data Analysis'],
      currentLevel: 2,
      requiredLevel: 4,
      gap: 2,
      priority: 'High',
      trainingStatus: 'Rekomendasi',
      joinDate: new Date().toISOString().split('T')[0],
    });
    setShowEmpModal(true);
  };

  const handleOpenEditEmp = (emp: Employee) => {
    setEditingEmp(emp);
    setEmpForm({ ...emp });
    setShowEmpModal(true);
  };

  const handleSaveEmp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!empForm.name || !empForm.nip || !empForm.position) return;

    const cur = empForm.currentLevel ?? 2;
    const req = empForm.requiredLevel ?? 4;
    const gap = Math.max(0, req - cur);
    const prio: PriorityLevel = gap >= 2 ? 'High' : gap === 1 ? 'Medium' : 'Low';

    if (editingEmp) {
      onUpdateEmployee({
        ...editingEmp,
        ...empForm,
        gap,
        priority: prio,
      } as Employee);
      onShowToast?.('success', `Data pegawai ${empForm.name} berhasil diperbarui.`, 'Update Pegawai');
    } else {
      const newEmp: Employee = {
        id: `EMP-${Date.now().toString().slice(-4)}`,
        nip: empForm.nip || '',
        name: empForm.name || '',
        email: empForm.email || `${empForm.name?.toLowerCase().replace(/\s+/g, '.')}@pln.co.id`,
        unit: empForm.unit || 'Sub Bidang Pengelolaan Pembelajaran, Asesmen & Sertifikasi Digital',
        position: empForm.position || '',
        supervisor: empForm.supervisor || 'Manajer Pengelolaan Digital',
        status: empForm.status || 'Aktif',
        competencies: empForm.competencies || ['Data Analysis'],
        currentLevel: cur,
        requiredLevel: req,
        gap,
        priority: prio,
        trainingStatus: empForm.trainingStatus || 'Rekomendasi',
        joinDate: empForm.joinDate || new Date().toISOString().split('T')[0],
      };
      onAddEmployee(newEmp);
      onShowToast?.('success', `Pegawai ${newEmp.name} berhasil ditambahkan ke direktori.`, 'Pegawai Baru Ditambahkan');
    }
    setShowEmpModal(false);
  };

  const handleSaveIncomingEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIncomingEmp.name || !newIncomingEmp.position) {
      onShowToast?.('error', 'Nama dan Jabatan pegawai baru harus diisi!', 'Validasi Gagal');
      return;
    }

    const cur = newIncomingEmp.currentLevel;
    const req = newIncomingEmp.requiredLevel;
    const gap = Math.max(0, req - cur);
    const prio: PriorityLevel = gap >= 2 ? 'High' : gap === 1 ? 'Medium' : 'Low';

    const createdEmp: Employee = {
      id: newIncomingEmp.id,
      nip: newIncomingEmp.nip,
      name: newIncomingEmp.name,
      email: `${newIncomingEmp.name.toLowerCase().replace(/\s+/g, '.')}@pln.co.id`,
      unit: newIncomingEmp.unit,
      position: newIncomingEmp.position,
      supervisor: newIncomingEmp.supervisor,
      status: 'Aktif',
      competencies: [newIncomingEmp.initialCompetency],
      currentLevel: cur,
      requiredLevel: req,
      gap,
      priority: prio,
      trainingStatus: 'Rekomendasi',
      joinDate: newIncomingEmp.joinDate,
    };

    onAddEmployee(createdEmp);
    onShowToast?.('success', `Karyawan baru ${createdEmp.name} berhasil didaftarkan. Anda dapat langsung membuatkan akun akses di Manajemen User.`, 'Karyawan Masuk Berhasil');

    // Reset form
    setNewIncomingEmp({
      id: `EMP-${Date.now().toString().slice(-4)}`,
      nip: `2024${Math.floor(100000 + Math.random() * 900000)}`,
      name: '',
      unit: 'Sub Bidang Pengelolaan Pembelajaran, Asesmen & Sertifikasi Digital',
      position: '',
      supervisor: 'Manajer Pengelolaan Digital',
      joinDate: new Date().toISOString().split('T')[0],
      initialCompetency: 'Data Analysis',
      currentLevel: 2,
      requiredLevel: 4,
      status: 'Aktif',
    });
  };

  const handleSaveMutation = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find((e) => e.id === mutationForm.employeeId);
    if (!emp || !mutationForm.newValue) {
      onShowToast?.('error', 'Pilih pegawai dan tentukan nilai pengubahan!', 'Validasi Gagal');
      return;
    }

    const newMut: EmployeeMutation = {
      id: `MUT-${Date.now().toString().slice(-5)}`,
      employeeId: emp.id,
      employeeName: emp.name,
      nip: emp.nip,
      changeType: mutationForm.changeType,
      oldValue: mutationForm.oldValue || emp.unit,
      newValue: mutationForm.newValue,
      date: new Date().toLocaleDateString('id-ID'),
      changedBy: `${currentUser.name} (Admin)`,
      notes: mutationForm.notes,
    };

    onAddMutation(newMut);

    // Apply update to employee record as well
    if (mutationForm.changeType === 'Perubahan Unit' || mutationForm.changeType === 'Mutasi' || mutationForm.changeType === 'Penempatan') {
      onUpdateEmployee({ ...emp, unit: mutationForm.newValue });
    } else if (mutationForm.changeType === 'Perubahan Jabatan') {
      onUpdateEmployee({ ...emp, position: mutationForm.newValue });
    } else if (mutationForm.changeType === 'Perubahan Atasan') {
      onUpdateEmployee({ ...emp, supervisor: mutationForm.newValue });
    }

    onShowToast?.('success', `Riwayat pengubahan untuk ${emp.name} berhasil disimpan dan diperbarui.`, 'Pengubahan Karyawan Dicatat');
    setShowMutationModal(false);
    setMutationForm({
      employeeId: '',
      changeType: 'Perubahan Unit',
      oldValue: '',
      newValue: '',
      notes: '',
    });
  };

  const handleSaveTraining = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trainingForm.name) return;

    if (editingTraining) {
      onUpdateTraining({
        ...editingTraining,
        ...trainingForm,
      } as TrainingItem);
      onShowToast?.('success', `Data pelatihan ${trainingForm.name} diperbarui.`, 'Pelatihan Diperbarui');
    } else {
      const newTrn: TrainingItem = {
        id: `TRN-DGT-00${trainings.length + 1}`,
        name: trainingForm.name || '',
        targetCompetency: trainingForm.targetCompetency || 'Data Analysis',
        targetLevel: trainingForm.targetLevel || 4,
        method: trainingForm.method || 'Blended',
        duration: trainingForm.duration || '32 Jam',
        priority: trainingForm.priority || 'High',
        targetAudience: trainingForm.targetAudience || 'Digital Staff',
        status: trainingForm.status || 'Tersedia',
      };
      onAddTraining(newTrn);
      onShowToast?.('success', `Pelatihan baru ${newTrn.name} ditambahkan.`, 'Katalog Pelatihan Bertambah');
    }
    setShowTrainingModal(false);
  };

  const confirmDeleteAction = () => {
    if (!deleteConfirm) return;
    if (deleteConfirm.type === 'emp') {
      onDeleteEmployee(deleteConfirm.id);
      onShowToast?.('info', `Pegawai ${deleteConfirm.name} dihapus dari sistem.`, 'Hapus Pegawai');
    } else if (deleteConfirm.type === 'trn') {
      onDeleteTraining(deleteConfirm.id);
      onShowToast?.('info', `Pelatihan ${deleteConfirm.name} dihapus dari katalog.`, 'Hapus Pelatihan');
    }
    setDeleteConfirm(null);
  };

  const isAdmin = currentUser.role === 'ADMIN';

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                Admin Manajemen: Tata Kelola Karyawan & Pelatihan
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  ADMIN ONLY
                </span>
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Pengelolaan direktori karyawan, mutasi & mutasi jabatan, proses karyawan masuk, serta katalog pelatihan kompetensi
              </p>
            </div>
          </div>
        </div>

        {/* Shortcut to User Management */}
        {onNavigateToUserManagement && (
          <button
            onClick={onNavigateToUserManagement}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer border border-slate-300"
          >
            <UserCheck className="w-4 h-4 text-emerald-600" />
            <span>Ke Manajemen User Akun</span>
          </button>
        )}
      </div>

      {/* 4 Core Submenu Tabs */}
      <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm flex flex-wrap gap-1.5">
        <button
          onClick={() => setActiveTab('karyawan')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'karyawan'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Data Karyawan ({employees.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('pengubahan')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'pengubahan'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Pengubahan Karyawan ({mutations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('karyawan-masuk')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'karyawan-masuk'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <UserPlus className="w-4 h-4" />
          <span>Karyawan Masuk</span>
        </button>

        <button
          onClick={() => setActiveTab('pelatihan')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'pelatihan'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Data Pelatihan Karyawan ({trainings.length})</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      {activeTab !== 'karyawan-masuk' && (
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={
                activeTab === 'karyawan'
                  ? 'Cari nama, NIP, atau jabatan...'
                  : activeTab === 'pengubahan'
                  ? 'Cari riwayat pengubahan / mutasi...'
                  : 'Cari judul pelatihan atau kompetensi...'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
            />
          </div>

          <div className="flex items-center gap-2">
            {activeTab === 'karyawan' && (
              <>
                <select
                  value={selectedUnit}
                  onChange={(e) => setSelectedUnit(e.target.value)}
                  className="text-xs px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 font-medium"
                >
                  <option value="ALL">Semua Unit</option>
                  {units.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleOpenAddEmp}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Tambah Karyawan</span>
                </button>
              </>
            )}

            {activeTab === 'pengubahan' && (
              <button
                onClick={() => setShowMutationModal(true)}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Catat Pengubahan Pegawai</span>
              </button>
            )}

            {activeTab === 'pelatihan' && (
              <button
                onClick={() => {
                  setEditingTraining(null);
                  setTrainingForm({
                    name: '',
                    targetCompetency: 'Data Analysis',
                    targetLevel: 4,
                    method: 'Blended',
                    duration: '32 Jam',
                    priority: 'High',
                    targetAudience: 'Digital Specialist',
                    status: 'Tersedia',
                  });
                  setShowTrainingModal(true);
                }}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Tambah Pelatihan</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 1: DATA KARYAWAN */}
      {/* ============================================================== */}
      {activeTab === 'karyawan' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-semibold text-[10px] tracking-wider">
                <tr>
                  <th className="px-3 py-3">No</th>
                  <th className="px-3 py-3">Employee ID</th>
                  <th className="px-3 py-3">Nama Pegawai</th>
                  <th className="px-3 py-3">NIP</th>
                  <th className="px-3 py-3">Unit</th>
                  <th className="px-3 py-3">Jabatan</th>
                  <th className="px-3 py-3">Atasan</th>
                  <th className="px-3 py-3 text-center">Status</th>
                  <th className="px-3 py-3">Kompetensi</th>
                  <th className="px-3 py-3 text-center">Current</th>
                  <th className="px-3 py-3 text-center">Required</th>
                  <th className="px-3 py-3 text-center">Gap</th>
                  <th className="px-3 py-3 text-center">Prioritas</th>
                  <th className="px-3 py-3 text-center">Status Pelatihan</th>
                  {isAdmin && <th className="px-3 py-3 text-right">Aksi</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan={15} className="py-8 text-center text-slate-400">
                      Tidak ada data karyawan yang sesuai.
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map((emp, idx) => {
                    const currentLvl = emp.currentLevel ?? emp.level ?? 2;
                    const requiredLvl = emp.requiredLevel ?? 4;
                    const gap = emp.gap ?? Math.max(0, requiredLvl - currentLvl);
                    const prio = emp.priority || (gap >= 2 ? 'High' : gap === 1 ? 'Medium' : 'Low');

                    return (
                      <tr key={emp.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-3 py-3 font-mono text-slate-400">{idx + 1}</td>
                        <td className="px-3 py-3 font-mono font-medium text-emerald-800">{emp.id}</td>
                        <td className="px-3 py-3 font-semibold text-slate-800">{emp.name}</td>
                        <td className="px-3 py-3 font-mono text-slate-600">{emp.nip}</td>
                        <td className="px-3 py-3 text-slate-600">{emp.unit}</td>
                        <td className="px-3 py-3 font-medium text-slate-700">{emp.position}</td>
                        <td className="px-3 py-3 text-slate-500">{emp.supervisor || 'Manajer'}</td>
                        <td className="px-3 py-3 text-center">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              emp.status === 'Aktif' || emp.status === 'ACTIVE'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {emp.status}
                          </span>
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex flex-wrap gap-1 max-w-[150px]">
                            {(emp.competencies || ['Data Analysis']).slice(0, 1).map((c, i) => (
                              <span
                                key={i}
                                className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 text-slate-700 rounded text-[10px]"
                              >
                                {c}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-3 py-3 text-center font-mono font-bold text-slate-700">{currentLvl}</td>
                        <td className="px-3 py-3 text-center font-mono font-bold text-slate-700">{requiredLvl}</td>
                        <td className="px-3 py-3 text-center">
                          <span
                            className={`inline-block px-2 py-0.5 rounded font-mono font-bold text-xs ${
                              gap >= 2 ? 'bg-rose-100 text-rose-700' : gap === 1 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                            }`}
                          >
                            {gap}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-center">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                              prio === 'High'
                                ? 'bg-red-100 text-red-800 border border-red-200'
                                : prio === 'Medium'
                                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                : 'bg-blue-100 text-blue-800 border border-blue-200'
                            }`}
                          >
                            {prio}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-center">
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700">
                            {emp.trainingStatus || 'Rekomendasi'}
                          </span>
                        </td>
                        {isAdmin && (
                          <td className="px-3 py-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => handleOpenEditEmp(emp)}
                                className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg cursor-pointer"
                                title="Edit Pegawai"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setDeleteConfirm({ type: 'emp', id: emp.id, name: emp.name })}
                                className="p-1.5 text-slate-500 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer"
                                title="Hapus Pegawai"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: PENGUBAHAN KARYAWAN */}
      {/* ============================================================== */}
      {activeTab === 'pengubahan' && (
        <div className="space-y-4">
          <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>
                <strong>Modul Pengubahan Karyawan:</strong> Mencatat riwayat mutasi unit, pergantian jabatan, atasan,
                dan status pegawai secara terstruktur dan transparan.
              </span>
            </div>
            <button
              onClick={() => setShowMutationModal(true)}
              className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 cursor-pointer shadow-xs whitespace-nowrap"
            >
              + Catat Pengubahan Baru
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-semibold text-[10px] tracking-wider">
                <tr>
                  <th className="px-4 py-3">Tanggal</th>
                  <th className="px-4 py-3">Nama Pegawai / NIP</th>
                  <th className="px-4 py-3">Jenis Pengubahan</th>
                  <th className="px-4 py-3">Kondisi Lama</th>
                  <th className="px-4 py-3">Kondisi Baru</th>
                  <th className="px-4 py-3">Diubah Oleh</th>
                  <th className="px-4 py-3">Catatan / Justifikasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMutations.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      Belum ada riwayat pengubahan karyawan yang tercatat.
                    </td>
                  </tr>
                ) : (
                  filteredMutations.map((mut) => (
                    <tr key={mut.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-4 py-3 font-mono text-slate-500">{mut.date}</td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-800">{mut.employeeName}</div>
                        <div className="text-[11px] font-mono text-slate-400">{mut.nip}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
                          {mut.changeType}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500 line-through">{mut.oldValue}</td>
                      <td className="px-4 py-3 font-semibold text-emerald-800">{mut.newValue}</td>
                      <td className="px-4 py-3 text-slate-600">{mut.changedBy}</td>
                      <td className="px-4 py-3 text-slate-500 italic max-w-xs">{mut.notes || '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: KARYAWAN MASUK */}
      {/* ============================================================== */}
      {activeTab === 'karyawan-masuk' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 pb-4 border-b border-slate-100 mb-5">
              <UserPlus className="w-5 h-5 text-emerald-600" />
              <div>
                <h3 className="font-bold text-slate-800 text-base">Formulir Karyawan Masuk Baru</h3>
                <p className="text-xs text-slate-500">
                  Input data talenta baru untuk dipetakan ke dalam siklus LNA dan disiapkan akun loginnya.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveIncomingEmployee} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Employee ID (Otomatis)</label>
                  <input
                    type="text"
                    required
                    value={newIncomingEmp.id}
                    onChange={(e) => setNewIncomingEmp({ ...newIncomingEmp, id: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">NIP Pegawai</label>
                  <input
                    type="text"
                    required
                    value={newIncomingEmp.nip}
                    onChange={(e) => setNewIncomingEmp({ ...newIncomingEmp, nip: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Rakha Nugroho"
                  value={newIncomingEmp.name}
                  onChange={(e) => setNewIncomingEmp({ ...newIncomingEmp, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Unit Organisasi</label>
                  <input
                    type="text"
                    required
                    value={newIncomingEmp.unit}
                    onChange={(e) => setNewIncomingEmp({ ...newIncomingEmp, unit: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Jabatan / Posisi</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Staff Digital Specialist"
                    value={newIncomingEmp.position}
                    onChange={(e) => setNewIncomingEmp({ ...newIncomingEmp, position: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Atasan Langsung</label>
                  <input
                    type="text"
                    value={newIncomingEmp.supervisor}
                    onChange={(e) => setNewIncomingEmp({ ...newIncomingEmp, supervisor: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Tanggal Masuk</label>
                  <input
                    type="date"
                    value={newIncomingEmp.joinDate}
                    onChange={(e) => setNewIncomingEmp({ ...newIncomingEmp, joinDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Kompetensi Awal</label>
                  <select
                    value={newIncomingEmp.initialCompetency}
                    onChange={(e) => setNewIncomingEmp({ ...newIncomingEmp, initialCompetency: e.target.value })}
                    className="w-full px-2 py-1.5 border border-slate-200 rounded-lg bg-white"
                  >
                    {competencies.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Current Level (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={newIncomingEmp.currentLevel}
                    onChange={(e) => setNewIncomingEmp({ ...newIncomingEmp, currentLevel: Number(e.target.value) })}
                    className="w-full px-2 py-1.5 border border-slate-200 rounded-lg bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Required Level (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={newIncomingEmp.requiredLevel}
                    onChange={(e) => setNewIncomingEmp({ ...newIncomingEmp, requiredLevel: Number(e.target.value) })}
                    className="w-full px-2 py-1.5 border border-slate-200 rounded-lg bg-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Simpan Karyawan Masuk & Siapkan ke Direktori</span>
              </button>
            </form>
          </div>

          {/* Workflow Guide Side Panel */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-gradient-to-br from-slate-900 to-[#004e24] text-white p-6 rounded-2xl border border-emerald-900 shadow-md">
              <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-400">
                Alur Integrasi Talenta Baru
              </span>
              <h4 className="text-base font-bold mt-1">Siklus Pendaftaran & Akses Pegawai</h4>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Setelah pegawai didaftarkan di menu ini, datanya otomatis masuk ke Master Data Karyawan.
                Admin kemudian dapat membuatkan Akun User Login di menu <strong>Manajemen User</strong>.
              </p>

              <div className="mt-5 space-y-3 text-xs">
                <div className="flex items-center gap-2.5 bg-white/10 p-2.5 rounded-lg border border-white/10">
                  <span className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 font-bold flex items-center justify-center shrink-0 text-xs">
                    1
                  </span>
                  <span>Input Data di "Karyawan Masuk"</span>
                </div>
                <div className="flex items-center gap-2.5 bg-white/10 p-2.5 rounded-lg border border-white/10">
                  <span className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 font-bold flex items-center justify-center shrink-0 text-xs">
                    2
                  </span>
                  <span>Buka "Manajemen User" $\rightarrow$ Pilih Karyawan</span>
                </div>
                <div className="flex items-center gap-2.5 bg-white/10 p-2.5 rounded-lg border border-white/10">
                  <span className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 font-bold flex items-center justify-center shrink-0 text-xs">
                    3
                  </span>
                  <span>Tentukan Username & Password Login Pegawai</span>
                </div>
                <div className="flex items-center gap-2.5 bg-white/10 p-2.5 rounded-lg border border-white/10">
                  <span className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 font-bold flex items-center justify-center shrink-0 text-xs">
                    4
                  </span>
                  <span>Pegawai langsung dapat login & akses My Dashboard</span>
                </div>
              </div>

              {onNavigateToUserManagement && (
                <button
                  onClick={onNavigateToUserManagement}
                  className="mt-6 w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md text-xs"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Buka Menu Manajemen User Sekarang</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 4: DATA PELATIHAN KARYAWAN */}
      {/* ============================================================== */}
      {activeTab === 'pelatihan' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-semibold text-[10px] tracking-wider">
                <tr>
                  <th className="px-4 py-3">ID Pelatihan</th>
                  <th className="px-4 py-3">Nama Program Pelatihan</th>
                  <th className="px-4 py-3">Kompetensi Target</th>
                  <th className="px-4 py-3 text-center">Level Target</th>
                  <th className="px-4 py-3">Metode Pembelajaran</th>
                  <th className="px-4 py-3">Durasi</th>
                  <th className="px-4 py-3 text-center">Prioritas</th>
                  <th className="px-4 py-3">Target Peserta</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  {isAdmin && <th className="px-4 py-3 text-right">Aksi</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTrainings.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-8 text-center text-slate-400">
                      Tidak ada data pelatihan yang sesuai.
                    </td>
                  </tr>
                ) : (
                  filteredTrainings.map((trn) => (
                    <tr key={trn.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-4 py-3 font-mono font-medium text-emerald-800">{trn.id}</td>
                      <td className="px-4 py-3 font-semibold text-slate-800 max-w-xs">{trn.name}</td>
                      <td className="px-4 py-3 text-slate-700 font-medium">{trn.targetCompetency}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center justify-center px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                          Level {trn.targetLevel}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                          {trn.method}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600 font-mono text-[11px]">{trn.duration}</td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            trn.priority === 'High'
                              ? 'bg-rose-100 text-rose-800'
                              : trn.priority === 'Medium'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-800'
                          }`}
                        >
                          {trn.priority}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600 text-[11px]">{trn.targetAudience}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {trn.status}
                        </span>
                      </td>
                      {isAdmin && (
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => {
                                setEditingTraining(trn);
                                setTrainingForm({ ...trn });
                                setShowTrainingModal(true);
                              }}
                              className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg cursor-pointer"
                              title="Edit Pelatihan"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm({ type: 'trn', id: trn.id, name: trn.name })}
                              className="p-1.5 text-slate-500 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer"
                              title="Hapus Pelatihan"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: Tambah / Edit Pegawai */}
      {/* ============================================================== */}
      {showEmpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-600" />
                {editingEmp ? 'Edit Data Pegawai' : 'Tambah Pegawai Baru'}
              </h3>
              <button onClick={() => setShowEmpModal(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEmp} className="mt-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">NIP Pegawai</label>
                  <input
                    type="text"
                    required
                    value={empForm.nip}
                    onChange={(e) => setEmpForm({ ...empForm, nip: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Nama Lengkap</label>
                  <input
                    type="text"
                    required
                    value={empForm.name}
                    onChange={(e) => setEmpForm({ ...empForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Unit Organisasi</label>
                  <input
                    type="text"
                    required
                    value={empForm.unit}
                    onChange={(e) => setEmpForm({ ...empForm, unit: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Jabatan</label>
                  <input
                    type="text"
                    required
                    value={empForm.position}
                    onChange={(e) => setEmpForm({ ...empForm, position: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Atasan Langsung</label>
                  <input
                    type="text"
                    value={empForm.supervisor}
                    onChange={(e) => setEmpForm({ ...empForm, supervisor: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Status Karyawan</label>
                  <select
                    value={empForm.status}
                    onChange={(e) => setEmpForm({ ...empForm, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Cuti">Cuti</option>
                    <option value="Tugas Belajar">Tugas Belajar</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Current Level (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={empForm.currentLevel}
                    onChange={(e) => setEmpForm({ ...empForm, currentLevel: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Required Level (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={empForm.requiredLevel}
                    onChange={(e) => setEmpForm({ ...empForm, requiredLevel: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEmpModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-sm cursor-pointer"
                >
                  Simpan Pegawai
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: Catat Pengubahan Karyawan */}
      {/* ============================================================== */}
      {showMutationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <History className="w-4 h-4 text-emerald-600" />
                Catat Pengubahan / Mutasi Pegawai
              </h3>
              <button onClick={() => setShowMutationModal(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveMutation} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Pilih Pegawai</label>
                <select
                  required
                  value={mutationForm.employeeId}
                  onChange={(e) => {
                    const emp = employees.find((emp) => emp.id === e.target.value);
                    setMutationForm({
                      ...mutationForm,
                      employeeId: e.target.value,
                      oldValue: emp ? emp.unit : '',
                    });
                  }}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">-- Pilih Pegawai --</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} ({emp.nip}) - {emp.unit}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Jenis Pengubahan</label>
                <select
                  value={mutationForm.changeType}
                  onChange={(e) => setMutationForm({ ...mutationForm, changeType: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Perubahan Unit">Perubahan Unit Organisasi</option>
                  <option value="Perubahan Jabatan">Perubahan Jabatan / Posisi</option>
                  <option value="Perubahan Atasan">Perubahan Atasan Langsung</option>
                  <option value="Mutasi">Mutasi Antar Sub-Holding / Divisi</option>
                  <option value="Penempatan">Penempatan Khusus</option>
                  <option value="Perubahan Status">Perubahan Status Karyawan</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Kondisi / Unit Lama</label>
                  <input
                    type="text"
                    required
                    value={mutationForm.oldValue}
                    onChange={(e) => setMutationForm({ ...mutationForm, oldValue: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Kondisi / Unit Baru</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Unit Digital"
                    value={mutationForm.newValue}
                    onChange={(e) => setMutationForm({ ...mutationForm, newValue: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 font-semibold text-emerald-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Catatan / Keterangan SK</label>
                <textarea
                  rows={2}
                  placeholder="Contoh: SK Direksi No. 042/PLN/2026 tanggal 01 Maret 2026"
                  value={mutationForm.notes}
                  onChange={(e) => setMutationForm({ ...mutationForm, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowMutationModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-sm cursor-pointer"
                >
                  Simpan Pengubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: Tambah / Edit Pelatihan */}
      {/* ============================================================== */}
      {showTrainingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-emerald-600" />
                {editingTraining ? 'Edit Program Pelatihan' : 'Tambah Program Pelatihan Baru'}
              </h3>
              <button onClick={() => setShowTrainingModal(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTraining} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Nama Program Pelatihan</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Advanced Data Analysis & Big Data"
                  value={trainingForm.name}
                  onChange={(e) => setTrainingForm({ ...trainingForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Kompetensi Target</label>
                  <select
                    value={trainingForm.targetCompetency}
                    onChange={(e) => setTrainingForm({ ...trainingForm, targetCompetency: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  >
                    {competencies.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Target Level (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={trainingForm.targetLevel}
                    onChange={(e) => setTrainingForm({ ...trainingForm, targetLevel: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Metode Pembelajaran</label>
                  <select
                    value={trainingForm.method}
                    onChange={(e) => setTrainingForm({ ...trainingForm, method: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  >
                    <option value="Blended">Blended Learning</option>
                    <option value="In Class">In Class Training</option>
                    <option value="Digital Learning">Digital Learning</option>
                    <option value="Workshop / Lab">Workshop / Hands-on Lab</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Durasi</label>
                  <input
                    type="text"
                    placeholder="Contoh: 32 Jam (4 Hari)"
                    value={trainingForm.duration}
                    onChange={(e) => setTrainingForm({ ...trainingForm, duration: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Prioritas</label>
                  <select
                    value={trainingForm.priority}
                    onChange={(e) => setTrainingForm({ ...trainingForm, priority: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Status Ketersediaan</label>
                  <select
                    value={trainingForm.status}
                    onChange={(e) => setTrainingForm({ ...trainingForm, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  >
                    <option value="Tersedia">Tersedia</option>
                    <option value="Berjalan">Berjalan</option>
                    <option value="Direncanakan">Direncanakan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Target Peserta</label>
                <input
                  type="text"
                  placeholder="Contoh: Data Analyst, System Specialist"
                  value={trainingForm.targetAudience}
                  onChange={(e) => setTrainingForm({ ...trainingForm, targetAudience: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowTrainingModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-sm cursor-pointer"
                >
                  Simpan Pelatihan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-base">Konfirmasi Hapus Data</h3>
            <p className="text-xs text-slate-500 mt-2">
              Apakah Anda yakin ingin menghapus <strong>{deleteConfirm.name}</strong>? Tindakan ini hanya dapat dilakukan
              oleh Administrator.
            </p>
            <div className="flex justify-center gap-2 mt-5">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                onClick={confirmDeleteAction}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-sm"
              >
                Hapus Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
