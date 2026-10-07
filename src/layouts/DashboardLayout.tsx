import React, { useState } from 'react';
import {
  LayoutDashboard,
  Target,
  GitBranch,
  Route,
  GraduationCap,
  Lightbulb,
  FileBarChart,
  User as UserIcon,
  LogOut,
  RotateCcw,
  Zap,
  ChevronLeft,
  ChevronRight,
  MessageSquareText,
  History,
  Lock,
  Users,
} from 'lucide-react';
import { User, ActivityItem, NotificationItem } from '../types';
import { Header } from '../components/Header';
import { ConfirmDialog } from '../components/ConfirmDialog';

interface DashboardLayoutProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  currentUser: User;
  onLogout: () => void;
  onResetData: () => void;
  activities: ActivityItem[];
  notifications: NotificationItem[];
  searchQuery: string;
  onSearch: (q: string) => void;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  currentPage,
  onNavigate,
  currentUser,
  onLogout,
  onResetData,
  activities,
  notifications,
  searchQuery,
  onSearch,
  children,
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Dedicated role-based sidebar menus
  const getNavItems = () => {
    if (currentUser.role === 'ADMIN') {
      return [
        { id: 'dashboard', label: 'Dashboard', subtitle: 'Overview Eksekutif', icon: LayoutDashboard },
        { id: 'master-data', label: 'Admin Manajemen', subtitle: 'Data, Mutasi & Pelatihan', icon: Users },
        { id: 'user-management', label: 'Manajemen User', subtitle: 'Akun & Kredensial Pegawai', icon: UserIcon },
        { id: 'cca', label: 'CCA', subtitle: 'Competency Gap Analysis', icon: Target },
        { id: 'dna', label: 'DNA', subtitle: 'Development Need Analysis', icon: GitBranch },
        { id: 'learning-path', label: 'Learning Path', subtitle: 'Jalur Pembelajaran', icon: Route },
        { id: 'tna', label: 'TNA', subtitle: 'Training Need Analysis', icon: GraduationCap },
        { id: 'learning-solution', label: 'Learning Solution', subtitle: 'Rekomendasi Metode', icon: Lightbulb },
        { id: 'lna-report', label: 'LNA Report', subtitle: 'Laporan & Finalisasi', icon: FileBarChart },
        { id: 'review-feedback', label: 'Review & Feedback', subtitle: 'Tindak Lanjut Masukan', icon: MessageSquareText },
        { id: 'audit-trail', label: 'Audit Trail', subtitle: 'Log Aktivitas Sistem', icon: History },
      ];
    }

    if (currentUser.role === 'USER DASAR') {
      return [
        { id: 'dashboard', label: 'My Dashboard', subtitle: 'Ringkasan Individual', icon: LayoutDashboard },
        { id: 'cca', label: 'My Competency', subtitle: 'Hasil Analisis CCA Saya', icon: Target },
        { id: 'learning-path', label: 'My Learning Path', subtitle: 'Jalur Belajar Saya', icon: Route },
        { id: 'tna', label: 'My TNA', subtitle: 'Kebutuhan Pelatihan Saya', icon: GraduationCap },
        { id: 'learning-solution', label: 'My Learning Solution', subtitle: 'Solusi Mandiri Saya', icon: Lightbulb },
        { id: 'lna-report', label: 'My LNA Report', subtitle: 'Ringkasan LNA Pribadi', icon: FileBarChart },
        { id: 'profile', label: 'My Profile', subtitle: 'Data Profil Pegawai', icon: UserIcon },
      ];
    }

    // MANAGEMENT
    return [
      { id: 'dashboard', label: 'Management Dashboard', subtitle: 'Monitoring Unit', icon: LayoutDashboard },
      { id: 'cca', label: 'Competency Monitoring', subtitle: 'Monitoring Kompetensi Unit', icon: Target },
      { id: 'learning-path', label: 'Learning Progress', subtitle: 'Progres Kurikulum Unit', icon: Route },
      { id: 'tna', label: 'TNA Monitoring', subtitle: 'Monitoring Usulan Diklat', icon: GraduationCap },
      { id: 'learning-solution', label: 'Learning Solution', subtitle: 'Solusi Pembelajaran Unit', icon: Lightbulb },
      { id: 'lna-report', label: 'LNA Report', subtitle: 'Laporan Eksekutif Unit', icon: FileBarChart },
      { id: 'review-feedback', label: 'Review & Feedback', subtitle: 'Berikan Masukan & Revisi', icon: MessageSquareText },
      { id: 'profile', label: 'Profile', subtitle: 'Profil Pimpinan Unit', icon: UserIcon },
    ];
  };

  const navItems = getNavItems();

  const handleSelectPage = (pageId: string) => {
    onNavigate(pageId);
    setMobileDrawerOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F5F7F9] flex flex-col antialiased">
      <div className="flex flex-1">
        {/* Mobile Backdrop */}
        {mobileDrawerOpen && (
          <div
            className="fixed inset-0 z-40 bg-slate-900/60 lg:hidden backdrop-blur-xs"
            onClick={() => setMobileDrawerOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed lg:sticky top-0 left-0 z-50 h-screen transition-all duration-300 ease-in-out flex flex-col justify-between bg-[#005c2a] text-white shadow-xl ${
            sidebarCollapsed ? 'w-20' : 'w-72'
          } ${
            mobileDrawerOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          {/* Top Section */}
          <div className="flex flex-col flex-1 min-h-0">
            {/* Top Branding Section */}
            {sidebarCollapsed ? (
              <div className="h-16 flex items-center justify-center border-b border-emerald-900/60 bg-[#004e24] relative">
                <div className="w-9 h-9 rounded-lg bg-[#00843D] border border-emerald-400/40 flex items-center justify-center shrink-0 shadow-xs">
                  <Zap className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                </div>
                <button
                  onClick={() => setSidebarCollapsed(false)}
                  className="hidden lg:flex absolute right-1.5 p-1 rounded-md text-emerald-200 hover:text-white hover:bg-emerald-800/60 transition-colors"
                  title="Perluas Sidebar"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="p-4 border-b border-emerald-900/60 bg-[#004e24]">
                {/* Logo & App Tagline Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-[#00843D] border border-emerald-400/40 flex items-center justify-center shrink-0 shadow-md">
                      <Zap className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-900/90 border border-emerald-700/60 text-[10.5px] font-bold text-emerald-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-yellow-300"></span>
                      <span>PLN Digital LNA</span>
                    </div>
                  </div>

                  {/* Desktop Collapse Toggle */}
                  <button
                    onClick={() => setSidebarCollapsed(true)}
                    className="hidden lg:flex p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800/60 transition-colors"
                    title="Ciutkan Sidebar"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>

                {/* Organization Identity Hierarchy */}
                <div className="mt-3.5 pt-2 border-t border-emerald-800/40">
                  <div className="font-extrabold text-[13.5px] sm:text-[14px] text-white tracking-wide uppercase leading-tight drop-shadow-xs">
                    BIDANG PERENCANAAN
                  </div>
                  <div className="text-[11px] text-emerald-100/95 font-medium leading-snug mt-1.5 text-pretty">
                    Sub Bidang Pengelolaan Pembelajaran, Asesmen dan Sertifikasi Berbasis Digital
                  </div>
                </div>
              </div>
            )}

            {/* Role indicator pill */}
            {!sidebarCollapsed && (
              <div className="mx-3 my-2.5 px-3 py-1.5 rounded-lg bg-emerald-900/50 border border-emerald-800/60 flex items-center justify-between text-[11px]">
                <span className="text-emerald-300 font-medium">Role:</span>
                <span className="font-bold text-white tracking-wide flex items-center gap-1.5">
                  {currentUser.role === 'USER DASAR' && <Lock className="w-3 h-3 text-amber-300" />}
                  <span>{currentUser.role}</span>
                </span>
              </div>
            )}

            {/* Nav Menu */}
            <nav className="p-3 space-y-1 overflow-y-auto flex-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectPage(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-150 group relative ${
                      isActive
                        ? 'bg-[#00843D] text-white shadow-xs font-semibold'
                        : 'text-emerald-100/90 hover:bg-emerald-800/50 hover:text-white'
                    } ${sidebarCollapsed ? 'justify-center px-0' : ''}`}
                    title={sidebarCollapsed ? item.label : undefined}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-yellow-300 rounded-r-md"></span>
                    )}
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-emerald-300 group-hover:text-white'}`} />
                    {!sidebarCollapsed && (
                      <span className="truncate">{item.label}</span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Bottom Actions */}
          <div className="p-3 border-t border-emerald-900/40 bg-[#004e24]/70 space-y-1">
            {/* Reset Demo Data (ADMIN ONLY) */}
            {currentUser.role === 'ADMIN' && (
              <button
                onClick={() => setShowResetConfirm(true)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-emerald-200 hover:text-white hover:bg-emerald-800/40 transition-colors ${
                  sidebarCollapsed ? 'justify-center px-0' : ''
                }`}
                title="Reset Demo Data"
              >
                <RotateCcw className="w-4 h-4 text-emerald-300 shrink-0" />
                {!sidebarCollapsed && <span>Reset Demo Data</span>}
              </button>
            )}

            {/* Profile */}
            <button
              onClick={() => handleSelectPage('profile')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-colors ${
                currentPage === 'profile'
                  ? 'bg-[#00843D] text-white font-semibold'
                  : 'text-emerald-200 hover:text-white hover:bg-emerald-800/40'
              } ${sidebarCollapsed ? 'justify-center px-0' : ''}`}
              title="Profile Pegawai"
            >
              <UserIcon className="w-4 h-4 text-emerald-300 shrink-0" />
              {!sidebarCollapsed && <span>Profile</span>}
            </button>

            {/* Logout */}
            <button
              onClick={onLogout}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-rose-200 hover:text-white hover:bg-rose-900/40 transition-colors ${
                sidebarCollapsed ? 'justify-center px-0' : ''
              }`}
              title="Logout Sistem"
            >
              <LogOut className="w-4 h-4 text-rose-300 shrink-0" />
              {!sidebarCollapsed && <span>Logout</span>}
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
          {/* Header */}
          <Header
            currentUser={currentUser}
            onToggleSidebar={() => {
              if (window.innerWidth >= 1024) {
                setSidebarCollapsed(!sidebarCollapsed);
              } else {
                setMobileDrawerOpen(!mobileDrawerOpen);
              }
            }}
            onSearch={onSearch}
            searchQuery={searchQuery}
            activities={activities}
            notifications={notifications}
            onNavigate={onNavigate}
            onLogout={onLogout}
          />

          {/* Page Body Viewport */}
          <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-[1520px] w-full mx-auto">
            {children}
          </main>

          {/* Academic Prototype Footer */}
          <footer className="border-t border-slate-200 bg-white py-3.5 px-6 text-center text-[11px] text-slate-500 no-print">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-[1520px] mx-auto">
              <div>
                <span className="font-semibold text-slate-700">PLN Digital LNA</span> · Prototype Konseptual & Akademik
                (Bukan Aplikasi Resmi PT PLN Persero)
              </div>
              <div>
                Sub Bidang Pengelolaan Pembelajaran, Asesmen dan Sertifikasi Berbasis Digital · Bidang Perencanaan · PLN Corporate University
              </div>
            </div>
          </footer>
        </div>
      </div>

      {/* Confirmation Dialog for Reset Demo Data */}
      <ConfirmDialog
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        onConfirm={onResetData}
        title="Reset ke Data Awal Demo?"
        message="Semua data CCA, DNA, TNA, Learning Path, masukan review, dan audit trail akan dikembalikan ke data awal prototype standar PLN Corporate University."
        confirmText="Reset Sekarang"
        cancelText="Batal"
        isDestructive={false}
      />
    </div>
  );
};
