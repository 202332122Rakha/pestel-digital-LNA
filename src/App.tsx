import React, { useState, useEffect } from 'react';
import { Lock } from 'lucide-react';
import {
  User,
  UserRole,
  CCAItem,
  DNAItem,
  LearningPathItem,
  TNAItem,
  LearningSolutionItem,
  ActivityItem,
  ToastNotification,
  ReviewFeedback,
  AuditTrailItem,
  NotificationItem,
  Employee,
  CompetencyStandard,
  EmployeeMutation,
  TrainingItem,
} from './types';
import {
  INITIAL_USERS,
  INITIAL_CCA,
  INITIAL_DNA,
  INITIAL_LEARNING_PATHS,
  INITIAL_TNA,
  INITIAL_LEARNING_SOLUTIONS,
  INITIAL_ACTIVITIES,
  INITIAL_REVIEWS,
  INITIAL_AUDIT_TRAIL,
  INITIAL_NOTIFICATIONS,
  INITIAL_EMPLOYEES,
  INITIAL_COMPETENCIES,
  INITIAL_MUTATIONS,
  INITIAL_TRAININGS,
} from './data/initialData';
import { ToastContainer } from './components/Toast';
import { DashboardLayout } from './layouts/DashboardLayout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { MasterDataPage } from './pages/MasterDataPage';
import { UserManagementPage } from './pages/UserManagementPage';
import { CCAPage } from './pages/CCAPage';
import { DNAPage } from './pages/DNAPage';
import { LearningPathPage } from './pages/LearningPathPage';
import { TNAPage } from './pages/TNAPage';
import { LearningSolutionPage } from './pages/LearningSolutionPage';
import { LNAReportPage } from './pages/LNAReportPage';
import { ReviewFeedbackPage } from './pages/ReviewFeedbackPage';
import { AuditTrailPage } from './pages/AuditTrailPage';
import { ProfilePage } from './pages/ProfilePage';
import { CorporateLandingPage } from './pages/CorporateLandingPage';
import { ReviewModal } from './components/ReviewModal';

export default function App() {
  // 1. Landing Page state
  const [showLandingPage, setShowLandingPage] = useState<boolean>(() => {
    try {
      // If user has not logged in, default to corporate video landing page
      const savedUser = localStorage.getItem('pln_lna_user_v2');
      return !savedUser;
    } catch {
      return false;
    }
  });

  // 2. User & Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('pln_lna_user_v2');
      if (saved) return JSON.parse(saved);
      return null;
    } catch {
      return null;
    }
  });

  // 2. Navigation State
  const [currentPage, setCurrentPage] = useState<string>(() => {
    try {
      return localStorage.getItem('pln_lna_page_v2') || 'dashboard';
    } catch {
      return 'dashboard';
    }
  });

  // 3. Domain Data State with localStorage
  const [userList, setUserList] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem('pln_lna_users_v2');
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  const [employees, setEmployees] = useState<Employee[]>(() => {
    try {
      const saved = localStorage.getItem('pln_lna_employees_v2');
      return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
    } catch {
      return INITIAL_EMPLOYEES;
    }
  });

  const [mutationsList, setMutationsList] = useState<EmployeeMutation[]>(() => {
    try {
      const saved = localStorage.getItem('pln_lna_mutations_v2');
      return saved ? JSON.parse(saved) : INITIAL_MUTATIONS;
    } catch {
      return INITIAL_MUTATIONS;
    }
  });

  const [trainingsList, setTrainingsList] = useState<TrainingItem[]>(() => {
    try {
      const saved = localStorage.getItem('pln_lna_trainings_v2');
      return saved ? JSON.parse(saved) : INITIAL_TRAININGS;
    } catch {
      return INITIAL_TRAININGS;
    }
  });

  const [competencies, setCompetencies] = useState<CompetencyStandard[]>(() => {
    try {
      const saved = localStorage.getItem('pln_lna_competencies_v2');
      return saved ? JSON.parse(saved) : INITIAL_COMPETENCIES;
    } catch {
      return INITIAL_COMPETENCIES;
    }
  });

  const [ccaList, setCcaList] = useState<CCAItem[]>(() => {
    try {
      const saved = localStorage.getItem('pln_lna_cca_v2');
      return saved ? JSON.parse(saved) : INITIAL_CCA;
    } catch {
      return INITIAL_CCA;
    }
  });

  const [dnaList, setDnaList] = useState<DNAItem[]>(() => {
    try {
      const saved = localStorage.getItem('pln_lna_dna_v2');
      return saved ? JSON.parse(saved) : INITIAL_DNA;
    } catch {
      return INITIAL_DNA;
    }
  });

  const [pathsList, setPathsList] = useState<LearningPathItem[]>(() => {
    try {
      const saved = localStorage.getItem('pln_lna_paths_v2');
      return saved ? JSON.parse(saved) : INITIAL_LEARNING_PATHS;
    } catch {
      return INITIAL_LEARNING_PATHS;
    }
  });

  const [tnaList, setTnaList] = useState<TNAItem[]>(() => {
    try {
      const saved = localStorage.getItem('pln_lna_tna_v2');
      return saved ? JSON.parse(saved) : INITIAL_TNA;
    } catch {
      return INITIAL_TNA;
    }
  });

  const [solutionsList, setSolutionsList] = useState<LearningSolutionItem[]>(() => {
    try {
      const saved = localStorage.getItem('pln_lna_solutions_v2');
      return saved ? JSON.parse(saved) : INITIAL_LEARNING_SOLUTIONS;
    } catch {
      return INITIAL_LEARNING_SOLUTIONS;
    }
  });

  const [reviewList, setReviewList] = useState<ReviewFeedback[]>(() => {
    try {
      const saved = localStorage.getItem('pln_lna_reviews_v2');
      return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  });

  const [auditTrail, setAuditTrail] = useState<AuditTrailItem[]>(() => {
    try {
      const saved = localStorage.getItem('pln_lna_audit_v2');
      return saved ? JSON.parse(saved) : INITIAL_AUDIT_TRAIL;
    } catch {
      return INITIAL_AUDIT_TRAIL;
    }
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem('pln_lna_notif_v2');
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [activities, setActivities] = useState<ActivityItem[]>(() => {
    try {
      const saved = localStorage.getItem('pln_lna_activities_v2');
      return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
    } catch {
      return INITIAL_ACTIVITIES;
    }
  });

  const [isLNAFinalized, setIsLNAFinalized] = useState<boolean>(() => {
    try {
      return localStorage.getItem('pln_lna_finalized_v2') === 'true';
    } catch {
      return false;
    }
  });

  // UI state
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [globalSearch, setGlobalSearch] = useState('');
  const [prefilledTrainingName, setPrefilledTrainingName] = useState('');
  const [quickReviewModal, setQuickReviewModal] = useState<{ isOpen: boolean; module?: string; title?: string }>({
    isOpen: false,
  });

  // Corporate Filter Periode (Default: Tahun 2026, Semua Periode)
  const [selectedYear, setSelectedYear] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('pln_lna_year_v2');
      return saved ? Number(saved) : 2026;
    } catch {
      return 2026;
    }
  });
  const [selectedPeriod, setSelectedPeriod] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('pln_lna_period_v2');
      return saved || 'Semua Periode';
    } catch {
      return 'Semua Periode';
    }
  });

  // Persist state updates to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('pln_lna_user_v2', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('pln_lna_user_v2');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('pln_lna_page_v2', currentPage);
  }, [currentPage]);

  useEffect(() => {
    localStorage.setItem('pln_lna_users_v2', JSON.stringify(userList));
  }, [userList]);

  useEffect(() => {
    localStorage.setItem('pln_lna_employees_v2', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('pln_lna_mutations_v2', JSON.stringify(mutationsList));
  }, [mutationsList]);

  useEffect(() => {
    localStorage.setItem('pln_lna_trainings_v2', JSON.stringify(trainingsList));
  }, [trainingsList]);

  useEffect(() => {
    localStorage.setItem('pln_lna_competencies_v2', JSON.stringify(competencies));
  }, [competencies]);

  useEffect(() => {
    localStorage.setItem('pln_lna_cca_v2', JSON.stringify(ccaList));
  }, [ccaList]);

  useEffect(() => {
    localStorage.setItem('pln_lna_dna_v2', JSON.stringify(dnaList));
  }, [dnaList]);

  useEffect(() => {
    localStorage.setItem('pln_lna_paths_v2', JSON.stringify(pathsList));
  }, [pathsList]);

  useEffect(() => {
    localStorage.setItem('pln_lna_tna_v2', JSON.stringify(tnaList));
  }, [tnaList]);

  useEffect(() => {
    localStorage.setItem('pln_lna_solutions_v2', JSON.stringify(solutionsList));
  }, [solutionsList]);

  useEffect(() => {
    localStorage.setItem('pln_lna_reviews_v2', JSON.stringify(reviewList));
  }, [reviewList]);

  useEffect(() => {
    localStorage.setItem('pln_lna_audit_v2', JSON.stringify(auditTrail));
  }, [auditTrail]);

  useEffect(() => {
    localStorage.setItem('pln_lna_notif_v2', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('pln_lna_activities_v2', JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem('pln_lna_finalized_v2', isLNAFinalized ? 'true' : 'false');
  }, [isLNAFinalized]);

  useEffect(() => {
    localStorage.setItem('pln_lna_year_v2', String(selectedYear));
  }, [selectedYear]);

  useEffect(() => {
    localStorage.setItem('pln_lna_period_v2', selectedPeriod);
  }, [selectedPeriod]);

  const showToast = (type: 'success' | 'error' | 'info' | 'warning', message: string, title?: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, message, title }]);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addAudit = (activity: string, module: string, status: string) => {
    const now = new Date();
    const dateFormatted = `${now.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })} ${now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`;
    const newAudit: AuditTrailItem = {
      id: `AUD-${Date.now()}`,
      date: dateFormatted,
      user: currentUser?.name || 'System',
      role: currentUser?.role || 'ADMIN',
      activity,
      module,
      status,
    };
    setAuditTrail((prev) => [newAudit, ...prev]);
  };

  const addActivity = (type: ActivityItem['type'], message: string) => {
    const newAct: ActivityItem = {
      id: `act-${Date.now()}`,
      type,
      message,
      timestamp: new Date().toISOString(),
      actor: currentUser?.name || 'System',
    };
    setActivities((prev) => [newAct, ...prev]);
  };

  // Auth actions
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setCurrentPage('dashboard');
    addActivity('cca', `${user.name} (${user.role}) berhasil masuk ke sistem.`);
    addAudit(`User login to system as ${user.role}`, 'Auth', 'LOGIN');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setShowLandingPage(true);
    localStorage.removeItem('pln_lna_user_v2');
    showToast('info', 'Anda telah keluar dari sistem PLN Digital LNA.', 'Logout Berhasil');
  };

  // Safe Role-Based Navigation Guard
  const handleNavigate = (page: string) => {
    if (currentUser?.role === 'USER DASAR') {
      const restrictedForUser = ['master-data', 'user-management', 'review-feedback', 'audit-trail'];
      if (restrictedForUser.includes(page)) {
        showToast('error', 'ACCESS DENIED - Anda tidak memiliki izin untuk mengakses halaman ini.', 'Akses Ditolak');
        setCurrentPage('access-denied');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    } else if (currentUser?.role === 'MANAGEMENT') {
      const restrictedForManagement = ['master-data', 'user-management'];
      if (restrictedForManagement.includes(page)) {
        showToast('error', 'ACCESS DENIED - Modul pengelolaan utama ini hanya dapat diakses oleh Administrator.', 'Akses Ditolak');
        setCurrentPage('access-denied');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset Demo Data (ADMIN ONLY)
  const handleResetData = () => {
    if (currentUser?.role !== 'ADMIN') {
      showToast('error', 'Hanya ADMIN yang berhak mereset data demo sistem!', 'Izin Terbatas');
      return;
    }
    localStorage.clear();
    const defaultUser = INITIAL_USERS[0];
    setCurrentUser(defaultUser);
    setUserList(INITIAL_USERS);
    setEmployees(INITIAL_EMPLOYEES);
    setMutationsList(INITIAL_MUTATIONS);
    setTrainingsList(INITIAL_TRAININGS);
    setCompetencies(INITIAL_COMPETENCIES);
    setCcaList(INITIAL_CCA);
    setDnaList(INITIAL_DNA);
    setPathsList(INITIAL_LEARNING_PATHS);
    setTnaList(INITIAL_TNA);
    setSolutionsList(INITIAL_LEARNING_SOLUTIONS);
    setReviewList(INITIAL_REVIEWS);
    setAuditTrail(INITIAL_AUDIT_TRAIL);
    setNotifications(INITIAL_NOTIFICATIONS);
    setActivities(INITIAL_ACTIVITIES);
    setIsLNAFinalized(false);
    setCurrentPage('dashboard');
    showToast('success', 'Semua data prototype berhasil direset ke kondisi awal standar PLN Corpu.', 'Reset Berhasil');
  };

  // ----------------------------------------------------
  // User Management Handlers (ADMIN ONLY)
  // ----------------------------------------------------
  const handleAddUser = (newUser: User) => {
    if (currentUser?.role !== 'ADMIN') return;
    setUserList([newUser, ...userList]);
    addActivity('audit', `Akun baru dibuat: ${newUser.name} (${newUser.username}) - Role: ${newUser.role}`);
    addAudit(`Created user account: ${newUser.username} (${newUser.name})`, 'Manajemen User', 'SUCCESS');
  };

  const handleUpdateUserAccount = (updatedUser: User) => {
    if (currentUser?.role !== 'ADMIN') return;
    setUserList(userList.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    addActivity('audit', `Akun diperbarui: ${updatedUser.name} (${updatedUser.username})`);
    addAudit(`Updated user account: ${updatedUser.username}`, 'Manajemen User', 'SUCCESS');
  };

  const handleDeleteUser = (userId: string) => {
    if (currentUser?.role !== 'ADMIN') return;
    const target = userList.find((u) => u.id === userId);
    setUserList(userList.filter((u) => u.id !== userId));
    if (target) {
      addActivity('audit', `Akun dihapus: ${target.name} (${target.username})`);
      addAudit(`Deleted user account: ${target.username}`, 'Manajemen User', 'DELETED');
    }
  };

  const handleToggleUserStatus = (userId: string) => {
    if (currentUser?.role !== 'ADMIN') return;
    setUserList(
      userList.map((u) => {
        if (u.id === userId) {
          const nextStatus = (u.status || 'Aktif') === 'Aktif' ? 'Nonaktif' : 'Aktif';
          addAudit(`Changed account status to ${nextStatus} for ${u.username}`, 'Manajemen User', 'STATUS_CHANGE');
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
  };

  const handleResetUserPassword = (userId: string, newPass: string) => {
    if (currentUser?.role !== 'ADMIN') return;
    setUserList(
      userList.map((u) => {
        if (u.id === userId) {
          addAudit(`Reset password for ${u.username}`, 'Manajemen User', 'PASSWORD_RESET');
          return { ...u, password: newPass };
        }
        return u;
      })
    );
  };

  // ----------------------------------------------------
  // Mutation & Training Handlers (ADMIN ONLY)
  // ----------------------------------------------------
  const handleAddMutation = (newMut: EmployeeMutation) => {
    setMutationsList([newMut, ...mutationsList]);
    addActivity('cca', `Pengubahan data pegawai: ${newMut.employeeName} (${newMut.changeType})`);
    addAudit(`Employee mutation: ${newMut.employeeName} - ${newMut.changeType}`, 'Admin Manajemen', 'MUTATION');
  };

  const handleAddTraining = (newTrn: TrainingItem) => {
    setTrainingsList([newTrn, ...trainingsList]);
    addActivity('tna', `Pelatihan baru ditambahkan: ${newTrn.name}`);
    addAudit(`Added training program: ${newTrn.name}`, 'Data Pelatihan', 'SUCCESS');
  };

  const handleUpdateTraining = (updated: TrainingItem) => {
    setTrainingsList(trainingsList.map((t) => (t.id === updated.id ? updated : t)));
    addAudit(`Updated training program: ${updated.name}`, 'Data Pelatihan', 'SUCCESS');
  };

  const handleDeleteTraining = (id: string) => {
    const target = trainingsList.find((t) => t.id === id);
    setTrainingsList(trainingsList.filter((t) => t.id !== id));
    if (target) {
      addAudit(`Deleted training program: ${target.name}`, 'Data Pelatihan', 'DELETED');
    }
  };

  // ----------------------------------------------------
  // Master Data Handlers (ADMIN ONLY)
  // ----------------------------------------------------
  const handleAddEmployee = (emp: Omit<Employee, 'id'>) => {
    if (currentUser?.role !== 'ADMIN') return;
    const newEmp: Employee = {
      ...emp,
      id: `emp-${Date.now()}`,
    };
    setEmployees([newEmp, ...employees]);
    addActivity('cca', `Pegawai baru ditambahkan: ${emp.name} (${emp.position}).`);
    addAudit(`Added new employee: ${emp.name} (${emp.nip})`, 'Master Data', 'SUCCESS');
  };

  const handleUpdateEmployee = (updated: Employee) => {
    if (currentUser?.role !== 'ADMIN') return;
    setEmployees(employees.map((e) => (e.id === updated.id ? updated : e)));
    addActivity('cca', `Data pegawai ${updated.name} diperbarui.`);
    addAudit(`Updated employee record: ${updated.name}`, 'Master Data', 'SUCCESS');
  };

  const handleDeleteEmployee = (id: string) => {
    if (currentUser?.role !== 'ADMIN') return;
    const target = employees.find((e) => e.id === id);
    setEmployees(employees.filter((e) => e.id !== id));
    if (target) {
      addActivity('cca', `Pegawai ${target.name} dihapus dari direktori.`);
      addAudit(`Deleted employee record: ${target.name}`, 'Master Data', 'DELETED');
    }
  };

  const handleAddCompetency = (comp: Omit<CompetencyStandard, 'id'>) => {
    if (currentUser?.role !== 'ADMIN') return;
    const newComp: CompetencyStandard = {
      ...comp,
      id: `comp-${Date.now()}`,
    };
    setCompetencies([...competencies, newComp]);
    addActivity('cca', `Standar kompetensi baru: ${comp.name} (${comp.code}).`);
    addAudit(`Added competency standard: ${comp.name}`, 'Master Data', 'SUCCESS');
  };

  const handleUpdateCompetency = (updated: CompetencyStandard) => {
    if (currentUser?.role !== 'ADMIN') return;
    setCompetencies(competencies.map((c) => (c.id === updated.id ? updated : c)));
    addActivity('cca', `Standar kompetensi ${updated.name} diperbarui.`);
    addAudit(`Updated competency standard: ${updated.name}`, 'Master Data', 'SUCCESS');
  };

  const handleDeleteCompetency = (id: string) => {
    if (currentUser?.role !== 'ADMIN') return;
    const target = competencies.find((c) => c.id === id);
    setCompetencies(competencies.filter((c) => c.id !== id));
    if (target) {
      addActivity('cca', `Standar kompetensi ${target.name} dihapus.`);
      addAudit(`Deleted competency standard: ${target.name}`, 'Master Data', 'DELETED');
    }
  };

  // ----------------------------------------------------
  // CCA Handlers (Protected by Role Check)
  // ----------------------------------------------------
  const handleAddCCA = (item: Omit<CCAItem, 'id' | 'createdAt'>) => {
    if (currentUser?.role !== 'ADMIN') {
      showToast('error', 'Akses ditolak: Hanya ADMIN yang memiliki wewenang menambahkan CCA!', 'Izin Terbatas');
      return;
    }
    const newItem: CCAItem = {
      ...item,
      id: `CCA-2026-${String(ccaList.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setCcaList([newItem, ...ccaList]);
    addActivity('cca', `CCA baru ditambahkan untuk ${item.employeeName} (${item.competency}).`);
    addAudit(`Created new CCA record for ${item.employeeName}`, 'CCA', newItem.status);
  };

  const handleUpdateCCA = (updated: CCAItem) => {
    if (currentUser?.role !== 'ADMIN') {
      showToast('error', 'Akses ditolak: Hanya ADMIN yang memiliki wewenang mengubah data CCA!', 'Izin Terbatas');
      return;
    }
    setCcaList(ccaList.map((c) => (c.id === updated.id ? updated : c)));
    addActivity('cca', `CCA ${updated.employeeName} (${updated.competency}) diperbarui.`);
    addAudit(`Updated CCA record for ${updated.employeeName}`, 'CCA', updated.status);
  };

  const handleDeleteCCA = (id: string) => {
    if (currentUser?.role !== 'ADMIN') {
      showToast('error', 'Akses ditolak: Hanya ADMIN yang dapat menghapus data CCA!', 'Izin Terbatas');
      return;
    }
    const target = ccaList.find((c) => c.id === id);
    setCcaList(ccaList.filter((c) => c.id !== id));
    if (target) {
      addActivity('cca', `CCA ${target.employeeName} (${target.competency}) dihapus.`);
      addAudit(`Deleted CCA record for ${target.employeeName}`, 'CCA', 'DELETED');
    }
  };

  // Sync CCA to DNA (ADMIN ONLY)
  const handleSyncToDNA = () => {
    if (currentUser?.role !== 'ADMIN') {
      showToast('error', 'Akses ditolak: Hanya ADMIN yang dapat melakukan sinkronisasi CCA ke DNA!', 'Izin Terbatas');
      return;
    }

    const gapsToSync = ccaList.filter((c) => c.gap >= 1);
    let addedCount = 0;
    const newDNAItems: DNAItem[] = [];

    gapsToSync.forEach((c) => {
      const exists = dnaList.some(
        (d) => d.employeeName === c.employeeName && d.competency === c.competency
      );
      if (!exists) {
        addedCount++;
        newDNAItems.push({
          id: `DNA-2026-${String(dnaList.length + addedCount).padStart(3, '0')}`,
          ccaId: c.id,
          employeeName: c.employeeName,
          competency: c.competency,
          gapLevel: c.gap,
          gapCause: `Kesenjangan level ${c.gap} teridentifikasi dari evaluasi CCA.`,
          developmentNeed: `Pengembangan Lanjutan: ${c.competency}`,
          targetLevel: c.requiredLevel,
          priority: c.priority,
          status: 'SUBMITTED',
          createdAt: new Date().toISOString().split('T')[0],
        });
      }
    });

    if (newDNAItems.length > 0) {
      setDnaList([...newDNAItems, ...dnaList]);
      showToast('success', `${newDNAItems.length} gap kompetensi dari CCA berhasil disinkronkan ke DNA.`, 'Sinkronisasi Sukses');
      addActivity('dna', `${newDNAItems.length} data kesenjangan CCA disinkronkan ke DNA.`);
      addAudit(`Synchronized ${newDNAItems.length} items from CCA to DNA`, 'DNA', 'SUBMITTED');
      setCurrentPage('dna');
    } else {
      showToast('info', 'Semua gap kompetensi dari CCA sudah terdata dalam modul DNA.', 'Data Sudah Sinkron');
    }
  };

  // ----------------------------------------------------
  // DNA Handlers (Protected by Role Check)
  // ----------------------------------------------------
  const handleAddDNA = (item: Omit<DNAItem, 'id' | 'createdAt'>) => {
    if (currentUser?.role !== 'ADMIN') {
      showToast('error', 'Akses ditolak: Hanya ADMIN yang dapat menambahkan data DNA!', 'Izin Terbatas');
      return;
    }
    const newItem: DNAItem = {
      ...item,
      id: `DNA-2026-${String(dnaList.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setDnaList([newItem, ...dnaList]);
    addActivity('dna', `DNA baru ditambahkan: ${item.developmentNeed} (${item.employeeName}).`);
    addAudit(`Created new DNA record for ${item.employeeName}`, 'DNA', newItem.status);
  };

  const handleUpdateDNA = (updated: DNAItem) => {
    if (currentUser?.role !== 'ADMIN') {
      showToast('error', 'Akses ditolak: Hanya ADMIN yang dapat mengedit DNA!', 'Izin Terbatas');
      return;
    }
    setDnaList(dnaList.map((d) => (d.id === updated.id ? updated : d)));
    addActivity('dna', `DNA ${updated.employeeName} (${updated.developmentNeed}) diperbarui.`);
    addAudit(`Updated DNA record for ${updated.employeeName}`, 'DNA', updated.status);
  };

  const handleDeleteDNA = (id: string) => {
    if (currentUser?.role !== 'ADMIN') {
      showToast('error', 'Akses ditolak: Hanya ADMIN yang dapat menghapus DNA!', 'Izin Terbatas');
      return;
    }
    const target = dnaList.find((d) => d.id === id);
    setDnaList(dnaList.filter((d) => d.id !== id));
    if (target) {
      addActivity('dna', `DNA ${target.employeeName} dihapus.`);
      addAudit(`Deleted DNA record for ${target.employeeName}`, 'DNA', 'DELETED');
    }
  };

  // ----------------------------------------------------
  // Learning Path Handlers (ADMIN ONLY)
  // ----------------------------------------------------
  const handleAddPath = (path: Omit<LearningPathItem, 'id'>) => {
    if (currentUser?.role !== 'ADMIN') return;
    const newPath: LearningPathItem = {
      ...path,
      id: `LP-${String(pathsList.length + 1).padStart(2, '0')}`,
    };
    setPathsList([newPath, ...pathsList]);
    addActivity('path', `Learning Path "${path.name}" berhasil dibuat.`);
    addAudit(`Created learning path: ${path.name}`, 'Learning Path', newPath.status);
  };

  const handleDeletePath = (id: string) => {
    if (currentUser?.role !== 'ADMIN') return;
    const target = pathsList.find((p) => p.id === id);
    setPathsList(pathsList.filter((p) => p.id !== id));
    if (target) {
      addActivity('path', `Learning Path "${target.name}" dihapus.`);
      addAudit(`Deleted learning path: ${target.name}`, 'Learning Path', 'DELETED');
    }
  };

  // ----------------------------------------------------
  // TNA Handlers (Protected by Role Check)
  // ----------------------------------------------------
  const handleAddTNA = (item: Omit<TNAItem, 'id' | 'submissionDate'>) => {
    if (currentUser?.role !== 'ADMIN') {
      showToast('error', 'Akses ditolak: Hanya ADMIN yang dapat mengajukan usulan TNA utama!', 'Izin Terbatas');
      return;
    }
    const newItem: TNAItem = {
      ...item,
      id: `TNA-2026-${String(tnaList.length + 1).padStart(3, '0')}`,
      submissionDate: new Date().toISOString().split('T')[0],
    };
    setTnaList([newItem, ...tnaList]);
    addActivity('tna', `Usulan TNA "${item.trainingName}" berhasil diajukan.`);
    addAudit(`Submitted new TNA proposal: ${item.trainingName}`, 'TNA', newItem.status);
  };

  const handleUpdateTNA = (updated: TNAItem) => {
    if (currentUser?.role !== 'ADMIN') {
      showToast('error', 'Akses ditolak: Hanya ADMIN yang dapat mengedit data TNA!', 'Izin Terbatas');
      return;
    }
    setTnaList(tnaList.map((t) => (t.id === updated.id ? updated : t)));
    addActivity('tna', `Usulan TNA "${updated.trainingName}" status: ${updated.status}.`);
    addAudit(`Updated TNA proposal: ${updated.trainingName}`, 'TNA', updated.status);
  };

  const handleDeleteTNA = (id: string) => {
    if (currentUser?.role !== 'ADMIN') {
      showToast('error', 'Akses ditolak: Hanya ADMIN yang dapat menghapus TNA!', 'Izin Terbatas');
      return;
    }
    const target = tnaList.find((t) => t.id === id);
    setTnaList(tnaList.filter((t) => t.id !== id));
    if (target) {
      addActivity('tna', `Usulan TNA "${target.trainingName}" dihapus.`);
      addAudit(`Deleted TNA proposal: ${target.trainingName}`, 'TNA', 'DELETED');
    }
  };

  // ----------------------------------------------------
  // Learning Solution Handlers (ADMIN ONLY)
  // ----------------------------------------------------
  const handleAddSolution = (sol: Omit<LearningSolutionItem, 'id'>) => {
    if (currentUser?.role !== 'ADMIN') return;
    const newSol: LearningSolutionItem = {
      ...sol,
      id: `SOL-${String(solutionsList.length + 1).padStart(2, '0')}`,
    };
    setSolutionsList([newSol, ...solutionsList]);
    addActivity('solution', `Solusi Pembelajaran "${sol.title}" berhasil ditambahkan.`);
    addAudit(`Added learning solution: ${sol.title}`, 'Learning Solution', newSol.status);
  };

  const handleDeleteSolution = (id: string) => {
    if (currentUser?.role !== 'ADMIN') return;
    const target = solutionsList.find((s) => s.id === id);
    setSolutionsList(solutionsList.filter((s) => s.id !== id));
    if (target) {
      addActivity('solution', `Solusi Pembelajaran "${target.title}" dihapus.`);
      addAudit(`Deleted learning solution: ${target.title}`, 'Learning Solution', 'DELETED');
    }
  };

  // ----------------------------------------------------
  // Finalize LNA Handler (ADMIN ONLY)
  // ----------------------------------------------------
  const handleFinalizeLNA = () => {
    if (currentUser?.role !== 'ADMIN') {
      showToast('error', 'Hanya ADMIN yang memiliki wewenang finalisasi LNA!', 'Izin Terbatas');
      return;
    }
    setIsLNAFinalized(true);
    setCcaList((prev) => prev.map((c) => ({ ...c, status: 'FINAL' })));
    setTnaList((prev) => prev.map((t) => ({ ...t, status: 'FINAL' })));
    setPathsList((prev) => prev.map((p) => ({ ...p, status: 'FINAL' })));

    addAudit('Admin finalized and published official LNA 2026 report', 'Finalisasi', 'FINAL');
    addActivity('review', 'LNA Periode 2026 resmi difinalisasi dan dipublikasikan.');

    const notifMgr: NotificationItem = {
      id: `notif-${Date.now()}-1`,
      title: 'LNA 2026 Finalized',
      message: 'Admin telah menyelesaikan finalisasi dan mempublikasikan Laporan Resmi LNA 2026.',
      timestamp: new Date().toISOString(),
      targetRole: 'MANAGEMENT',
      read: false,
      category: 'Finalisasi',
    };
    const notifUser: NotificationItem = {
      id: `notif-${Date.now()}-2`,
      title: 'Hasil LNA 2026 Ditetapkan',
      message: 'Analisis kebutuhan kompetensi dan usulan program diklat Anda telah ditetapkan secara final.',
      timestamp: new Date().toISOString(),
      targetRole: 'USER DASAR',
      read: false,
      category: 'Finalisasi',
    };
    setNotifications((prev) => [notifMgr, notifUser, ...prev]);
    showToast('success', 'Laporan LNA Periode 2026 berhasil difinalisasi dan dipublikasikan secara resmi!', 'LNA Finalized');
  };

  // ----------------------------------------------------
  // Management Review & Feedback Handler
  // ----------------------------------------------------
  const handleSubmitReview = (reviewData: Omit<ReviewFeedback, 'id' | 'createdAt'>) => {
    const newReview: ReviewFeedback = {
      ...reviewData,
      id: `REV-2026-${String(reviewList.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString(),
    };

    setReviewList([newReview, ...reviewList]);

    let newStatus: any = 'UNDER REVIEW';
    if (reviewData.decision === 'Setujui') newStatus = 'APPROVED';
    if (reviewData.decision === 'Minta Revisi') newStatus = 'REVISION REQUIRED';

    if (reviewData.category === 'Kompetensi') {
      setCcaList((prev) =>
        prev.map((item) =>
          reviewData.targetItemTitle?.includes(item.employeeName) ? { ...item, status: newStatus } : item
        )
      );
    } else if (reviewData.category === 'TNA') {
      setTnaList((prev) =>
        prev.map((item) =>
          reviewData.targetItemTitle?.includes(item.trainingName) ? { ...item, status: newStatus } : item
        )
      );
    } else if (reviewData.category === 'Learning Path') {
      setPathsList((prev) =>
        prev.map((item) =>
          reviewData.targetItemTitle?.includes(item.name) ? { ...item, status: newStatus } : item
        )
      );
    }

    addAudit(
      `Management ${reviewData.decision}: ${reviewData.targetItemTitle || reviewData.category}`,
      reviewData.category,
      newStatus
    );
    addActivity('review', `Management ${reviewData.decision} untuk ${reviewData.targetItemTitle || reviewData.category}`);

    const adminNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: reviewData.decision === 'Minta Revisi' ? 'Revision Required' : 'New Management Feedback',
      message: `${currentUser?.name}: "${reviewData.comment.slice(0, 80)}..."`,
      timestamp: new Date().toISOString(),
      targetRole: 'ADMIN',
      read: false,
      category: 'Review',
    };
    setNotifications((prev) => [adminNotif, ...prev]);

    showToast('success', `Masukan review (${reviewData.decision}) berhasil dicatat & dikirim ke Admin.`, 'Review Tersimpan');
  };

  // Admin resolves review
  const handleUpdateReviewStatus = (id: string, newStatus: ReviewFeedback['status'], adminResponse?: string) => {
    if (currentUser?.role !== 'ADMIN') {
      showToast('error', 'Hanya ADMIN yang dapat menindaklanjuti dan menyelesaikan revisi!', 'Izin Terbatas');
      return;
    }

    setReviewList((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: newStatus,
              adminResponse: adminResponse || item.adminResponse,
              resolvedAt: new Date().toISOString(),
            }
          : item
      )
    );

    addAudit(`Admin resolved review #${id} with response`, 'Governance', newStatus);
    addActivity('review', `Admin menyelesaikan tindak lanjut review #${id}.`);

    const mgrNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Revision Completed',
      message: `Admin telah menyelesaikan perbaikan: "${adminResponse || 'Perbaikan data selesai.'}"`,
      timestamp: new Date().toISOString(),
      targetRole: 'MANAGEMENT',
      read: false,
      category: 'Revisi',
    };
    setNotifications((prev) => [mgrNotif, ...prev]);
  };

  // Profile update
  const handleUpdateUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    addActivity('cca', `Data profil ${updatedUser.name} telah disimpan.`);
  };

  // If unauthenticated: Corporate Video Landing Page -> Login Page
  if (!currentUser) {
    if (showLandingPage) {
      return (
        <>
          <CorporateLandingPage onEnterSystem={() => setShowLandingPage(false)} />
          <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
        </>
      );
    }
    return (
      <>
        <LoginPage
          users={userList}
          onLogin={handleLogin}
          onShowToast={showToast}
          onBackToLanding={() => setShowLandingPage(true)}
        />
        <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
      </>
    );
  }

  return (
    <DashboardLayout
      currentPage={currentPage}
      onNavigate={handleNavigate}
      currentUser={currentUser}
      onLogout={handleLogout}
      onResetData={handleResetData}
      activities={activities}
      notifications={notifications}
      searchQuery={globalSearch}
      onSearch={setGlobalSearch}
    >
      {/* 1. Dashboard View */}
      {currentPage === 'dashboard' && (
        <DashboardPage
          currentUser={currentUser}
          ccaList={ccaList}
          dnaList={dnaList}
          pathsList={pathsList}
          tnaList={tnaList}
          solutionList={solutionsList}
          reviewList={reviewList}
          activities={activities}
          onNavigate={handleNavigate}
          onOpenReviewModal={(module, title) =>
            setQuickReviewModal({ isOpen: true, module, title })
          }
          selectedYear={selectedYear}
          selectedPeriod={selectedPeriod}
          onYearChange={setSelectedYear}
          onPeriodChange={setSelectedPeriod}
        />
      )}

      {/* 2. Admin Manajemen (ADMIN ONLY) */}
      {currentPage === 'master-data' && (
        <MasterDataPage
          currentUser={currentUser}
          employees={employees}
          competencies={competencies}
          mutations={mutationsList}
          trainings={trainingsList}
          onAddEmployee={handleAddEmployee}
          onUpdateEmployee={handleUpdateEmployee}
          onDeleteEmployee={handleDeleteEmployee}
          onAddMutation={handleAddMutation}
          onAddTraining={handleAddTraining}
          onUpdateTraining={handleUpdateTraining}
          onDeleteTraining={handleDeleteTraining}
          onAddCompetency={handleAddCompetency}
          onUpdateCompetency={handleUpdateCompetency}
          onDeleteCompetency={handleDeleteCompetency}
          onNavigateToUserManagement={() => handleNavigate('user-management')}
          onShowToast={showToast}
        />
      )}

      {/* 2b. Manajemen User (ADMIN ONLY) */}
      {currentPage === 'user-management' && (
        <UserManagementPage
          currentUser={currentUser}
          users={userList}
          employees={employees}
          onAddUser={handleAddUser}
          onUpdateUser={handleUpdateUserAccount}
          onDeleteUser={handleDeleteUser}
          onToggleStatus={handleToggleUserStatus}
          onResetPassword={handleResetUserPassword}
          onShowToast={showToast}
        />
      )}

      {/* Access Denied Protected Route Banner */}
      {currentPage === 'access-denied' && (
        <div className="bg-white rounded-2xl border border-rose-200 shadow-sm p-8 text-center max-w-lg mx-auto my-12">
          <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8" />
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-100 text-rose-800 uppercase tracking-wider">
            ACCESS DENIED
          </span>
          <h2 className="text-xl font-bold text-slate-800 mt-3">Akses Ditolak</h2>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            Anda tidak memiliki izin untuk mengakses halaman ini. Halaman ini diproteksi oleh sistem Role-Based Access Control (RBAC) PLN Digital LNA.
          </p>
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => handleNavigate('dashboard')}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              Kembali ke Dashboard Saya
            </button>
          </div>
        </div>
      )}

      {/* 3. CCA View */}
      {currentPage === 'cca' && (
        <CCAPage
          currentUser={currentUser}
          ccaList={ccaList}
          onAddCCA={handleAddCCA}
          onUpdateCCA={handleUpdateCCA}
          onDeleteCCA={handleDeleteCCA}
          onSyncToDNA={handleSyncToDNA}
          onSubmitReview={handleSubmitReview}
          onShowToast={showToast}
        />
      )}

      {/* 4. DNA View */}
      {currentPage === 'dna' && (
        <DNAPage
          currentUser={currentUser}
          dnaList={dnaList}
          ccaList={ccaList}
          onAddDNA={handleAddDNA}
          onUpdateDNA={handleUpdateDNA}
          onDeleteDNA={handleDeleteDNA}
          onSyncFromCCA={handleSyncToDNA}
          onSubmitReview={handleSubmitReview}
          onShowToast={showToast}
        />
      )}

      {/* 5. Learning Path View */}
      {currentPage === 'learning-path' && (
        <LearningPathPage
          currentUser={currentUser}
          paths={pathsList}
          onAddPath={handleAddPath}
          onDeletePath={handleDeletePath}
          onNavigateToTNAWithSubject={(subject) => {
            setPrefilledTrainingName(subject);
            handleNavigate('tna');
          }}
          onSubmitReview={handleSubmitReview}
          onShowToast={showToast}
        />
      )}

      {/* 6. TNA View */}
      {currentPage === 'tna' && (
        <TNAPage
          currentUser={currentUser}
          tnaList={tnaList}
          prefilledTrainingName={prefilledTrainingName}
          onAddTNA={(data) => {
            handleAddTNA(data);
            setPrefilledTrainingName('');
          }}
          onUpdateTNA={handleUpdateTNA}
          onDeleteTNA={handleDeleteTNA}
          onSubmitReview={handleSubmitReview}
          onShowToast={showToast}
        />
      )}

      {/* 7. Learning Solution View */}
      {currentPage === 'learning-solution' && (
        <LearningSolutionPage
          currentUser={currentUser}
          solutions={solutionsList}
          ccaList={ccaList}
          dnaList={dnaList}
          onAddSolution={handleAddSolution}
          onDeleteSolution={handleDeleteSolution}
          onNavigateToTNAWithMethod={() => handleNavigate('tna')}
          onSubmitReview={handleSubmitReview}
          onShowToast={showToast}
        />
      )}

      {/* 8. LNA Report View */}
      {currentPage === 'lna-report' && (
        <LNAReportPage
          currentUser={currentUser}
          ccaList={ccaList}
          dnaList={dnaList}
          tnaList={tnaList}
          solutions={solutionsList}
          isFinalized={isLNAFinalized}
          onFinalizeLNA={handleFinalizeLNA}
          onSubmitReview={handleSubmitReview}
          onShowToast={showToast}
        />
      )}

      {/* 9. Review & Feedback View */}
      {currentPage === 'review-feedback' && (
        <ReviewFeedbackPage
          currentUser={currentUser}
          reviewList={reviewList}
          onSubmitReview={handleSubmitReview}
          onUpdateReviewStatus={handleUpdateReviewStatus}
          onShowToast={showToast}
        />
      )}

      {/* 10. Audit Trail View */}
      {currentPage === 'audit-trail' && (
        <AuditTrailPage currentUser={currentUser} auditTrail={auditTrail} />
      )}

      {/* 11. Profile View */}
      {currentPage === 'profile' && (
        <ProfilePage
          currentUser={currentUser}
          onUpdateUser={handleUpdateUser}
          onShowToast={showToast}
        />
      )}

      {/* Global Quick Review Modal */}
      {quickReviewModal.isOpen && (
        <ReviewModal
          isOpen={quickReviewModal.isOpen}
          onClose={() => setQuickReviewModal({ isOpen: false })}
          currentUser={currentUser}
          targetModule={quickReviewModal.module}
          targetItemTitle={quickReviewModal.title}
          onSubmitReview={handleSubmitReview}
        />
      )}

      {/* Floating Toast Notification Stack */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
    </DashboardLayout>
  );
}
