import React, { useState, useRef, useEffect } from 'react';
import { Menu, Search, Bell, CheckCircle2, FileText, ChevronDown, LogOut, Lock } from 'lucide-react';
import { User, UserRole, ActivityItem, NotificationItem } from '../types';

interface HeaderProps {
  currentUser: User;
  onToggleSidebar: () => void;
  onSearch: (query: string) => void;
  searchQuery: string;
  activities: ActivityItem[];
  notifications: NotificationItem[];
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onToggleSidebar,
  onSearch,
  searchQuery,
  activities,
  notifications,
  onNavigate,
  onLogout,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'MANAGEMENT':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  // Filter role-specific notifications
  const userNotifications = notifications.filter(
    (n) => n.targetRole === currentUser.role || n.targetRole === 'ALL'
  );

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-4 md:px-6 shadow-xs">
      {/* Left: Hamburger & Search */}
      <div className="flex items-center gap-3 md:gap-4 flex-1 max-w-xl">
        <button
          onClick={onToggleSidebar}
          aria-label="Toggle Sidebar"
          className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Cari menu, kompetensi, atau data..."
            className="w-full pl-9 pr-4 py-2 text-xs md:text-sm bg-[#F5F7F9] border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#00843D] focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Right: Academic Prototype Badge, View Only status, Notifications, User info */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* User Dasar View Only Indicator */}
        {currentUser.role === 'USER DASAR' && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-md text-[11px] font-bold text-amber-800">
            <Lock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="hidden sm:inline">MODE:</span>
            <span>VIEW ONLY</span>
          </div>
        )}

        {/* Organization Tag */}
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded-md text-[11px] font-medium text-[#006B32]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00843D] animate-pulse"></span>
          <span>PLN Corpu · Bidang Perencanaan</span>
        </div>

        {/* Notifications Dropdown (Role-Specific) */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Notifikasi"
          >
            <Bell className="w-5 h-5" />
            {userNotifications.some((n) => !n.read) && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#00843D]"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-100">
                <span className="text-xs font-semibold text-slate-900">Notifikasi ({currentUser.role})</span>
                <span className="text-[11px] text-slate-500">{userNotifications.length} pesan</span>
              </div>
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {userNotifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400">
                    Tidak ada notifikasi baru untuk role Anda.
                  </div>
                ) : (
                  userNotifications.map((item) => (
                    <div
                      key={item.id}
                      className={`p-3.5 transition-colors ${
                        item.read ? 'hover:bg-slate-50/80' : 'bg-emerald-50/30 hover:bg-emerald-50/60'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <div className="p-1 rounded bg-emerald-100 text-[#00843D] mt-0.5 shrink-0">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-bold text-slate-900 leading-tight">
                              {item.title}
                            </span>
                            <span className="text-[9.5px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-mono">
                              {item.category}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 leading-snug mt-1">{item.message}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile & Role Switcher */}
        <div className="relative" ref={userRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-left"
          >
            <div className="w-8 h-8 rounded-full bg-[#00843D] text-white flex items-center justify-center font-semibold text-xs shadow-xs">
              {currentUser.name
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')}
            </div>
            <div className="hidden md:block">
              <div className="text-xs font-semibold text-slate-900 leading-tight flex items-center gap-1.5">
                <span>{currentUser.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded border font-bold ${getRoleBadge(currentUser.role)}`}>
                  {currentUser.role}
                </span>
              </div>
              <div className="text-[11px] text-slate-500 leading-tight truncate max-w-[210px]">
                {currentUser.unit}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:block" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden z-50">
              <div className="p-3.5 bg-slate-50 border-b border-slate-100">
                <div className="text-xs font-bold text-slate-900">{currentUser.name}</div>
                <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                  {currentUser.nip ? `NIP: ${currentUser.nip}` : currentUser.email}
                  {currentUser.employeeId && currentUser.nip ? ` · ${currentUser.employeeId}` : ''}
                </div>
                <div className="text-[11px] text-emerald-800 font-semibold mt-1">
                  {currentUser.jabatan}
                </div>
                <div className="text-[10.5px] text-slate-600 mt-0.5 truncate">
                  Unit: {currentUser.unit}
                </div>
                <div className="mt-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${getRoleBadge(currentUser.role)}`}>
                    {currentUser.role === 'USER DASAR' ? 'USER (PEGAWAI)' : currentUser.role}
                  </span>
                </div>
              </div>

              {/* Navigation links - Profile & Logout only */}
              <div className="p-1">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onNavigate('profile');
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-md transition-colors flex items-center gap-2 cursor-pointer font-medium"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span>Pengaturan Profil</span>
                </button>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onLogout();
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-md transition-colors flex items-center gap-2 cursor-pointer font-medium"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-500" />
                  <span>Keluar (Logout)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
