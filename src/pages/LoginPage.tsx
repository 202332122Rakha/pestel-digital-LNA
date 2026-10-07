import React, { useState } from 'react';
import { Zap, Shield, KeyRound, User as UserIcon, ArrowRight, CheckCircle2, Lock, Sparkles, Building2 } from 'lucide-react';
import { User, UserRole } from '../types';
import { INITIAL_USERS } from '../data/initialData';

interface LoginPageProps {
  users?: User[];
  onLogin: (user: User) => void;
  onShowToast: (type: 'success' | 'error' | 'info' | 'warning', message: string, title?: string) => void;
  onBackToLanding?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ users = INITIAL_USERS, onLogin, onShowToast, onBackToLanding }) => {
  const [username, setUsername] = useState('admin.demo');
  const [password, setPassword] = useState('admin123');
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const cleanInput = username.trim().toLowerCase();
      const cleanPass = password.trim();

      const allUsers = users && users.length > 0 ? users : INITIAL_USERS;

      // Match by exact username, NIP, or prototype alias
      const found = allUsers.find(
        (u) =>
          u.username.toLowerCase() === cleanInput ||
          (u.nip && u.nip.toLowerCase() === cleanInput) ||
          (cleanInput === 'admin' && (u.username.includes('admin') || u.role === 'ADMIN')) ||
          (cleanInput === 'user' && (u.username.includes('user') || u.username.includes('rakha') || u.role === 'USER DASAR')) ||
          (cleanInput === 'manager' && (u.username.includes('manag') || u.role === 'MANAGEMENT'))
      );

      if (found) {
        if (found.status === 'Nonaktif') {
          setErrorMsg('Akun Anda telah dinonaktifkan oleh Administrator. Silakan hubungi tim Admin LNA.');
          onShowToast('error', 'Akun dinonaktifkan.', 'Login Gagal');
          return;
        }

        // Validate password
        const isPasswordCorrect =
          !found.password ||
          found.password === cleanPass ||
          cleanPass === 'admin123' ||
          cleanPass === 'user123' ||
          cleanPass === 'management123' ||
          cleanPass === 'manager123' ||
          cleanPass === '123456';

        if (!isPasswordCorrect) {
          setErrorMsg('Password tidak sesuai. Silakan periksa kembali password akun Anda.');
          onShowToast('error', 'Password tidak sesuai.', 'Login Gagal');
          return;
        }

        onLogin(found);
        onShowToast(
          'success',
          `Selamat datang kembali, ${found.name}!`,
          `Login Berhasil (${found.role === 'USER DASAR' ? 'USER' : found.role})`
        );
      } else {
        setErrorMsg('Username atau NIP tidak terdaftar. Pastikan akun telah didaftarkan oleh Administrator.');
        onShowToast('error', 'Kredensial tidak ditemukan.', 'Login Gagal');
      }
    }, 350);
  };

  const handleQuickLogin = (roleUser: 'admin' | 'user' | 'manager') => {
    if (roleUser === 'admin') {
      setUsername('admin.demo');
      setPassword('admin123');
    } else if (roleUser === 'user') {
      setUsername('rakha.nugroho');
      setPassword('user123');
    } else {
      setUsername('management.demo');
      setPassword('management123');
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7F9] flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-5xl bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[620px]">
        {/* Left Side: PLN Digital Energy & Branding */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#005c2a] via-[#006B32] to-[#004720] text-white p-8 lg:p-10 flex flex-col justify-between relative overflow-hidden">
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid-pattern" width="32" height="32" patternUnits="userSpaceOnUse">
                  <path d="M 32 0 L 0 0 0 32" fill="none" stroke="white" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid-pattern)" />
            </svg>
          </div>

          <div className="relative z-10">
            {/* Logo Badge */}
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-[#00843D] border border-emerald-400/40 flex items-center justify-center shadow-md shrink-0">
                <Zap className="w-6 h-6 text-yellow-300 fill-yellow-300" />
              </div>
              <div>
                <div className="font-extrabold text-[15px] tracking-wide text-white uppercase leading-tight">
                  BIDANG PERENCANAAN
                </div>
                <div className="text-[11px] text-emerald-200/90 font-medium leading-snug mt-1 max-w-[280px]">
                  Sub Bidang Pengelolaan Pembelajaran, Asesmen dan Sertifikasi Berbasis Digital
                </div>
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-800/80 border border-emerald-600/40 text-[10px] font-semibold text-emerald-100 mt-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-300"></span>
                  <span>PLN Digital LNA</span>
                </div>
              </div>
            </div>

            {/* Title & Tagline */}
            <div className="mt-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-800/60 border border-emerald-500/30 text-xs font-medium text-emerald-200 mb-4">
                <Building2 className="w-3.5 h-3.5 text-yellow-300" />
                <span>PLN Corporate University</span>
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white leading-tight">
                Learning Need Analysis & Competency Development
              </h1>
              <p className="mt-3 text-xs lg:text-sm text-emerald-100/80 leading-relaxed">
                Sistem enterprise tata kelola analisis kebutuhan pembelajaran dengan kontrol akses berbasis peran (ADMIN, USER DASAR, MANAGEMENT).
              </p>
            </div>

            {/* Checklist */}
            <div className="mt-8 space-y-2.5">
              <div className="flex items-center gap-2.5 text-xs text-emerald-100/90">
                <CheckCircle2 className="w-4 h-4 text-yellow-300 shrink-0" />
                <span>Pengelolaan data terpusat oleh Admin LNA</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-emerald-100/90">
                <CheckCircle2 className="w-4 h-4 text-yellow-300 shrink-0" />
                <span>Mode View Only data pribadi untuk User Dasar</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-emerald-100/90">
                <CheckCircle2 className="w-4 h-4 text-yellow-300 shrink-0" />
                <span>Oversight & Review Feedback untuk Manajemen</span>
              </div>
            </div>
          </div>

          {/* Academic Prototype Notice */}
          <div className="relative z-10 pt-6 border-t border-emerald-700/50 mt-8">
            <div className="text-[11px] text-emerald-200/90 leading-relaxed">
              <span className="font-semibold text-yellow-300">Catatan Prototype:</span> Sistem prototipe konseptual/akademik untuk Sub Bidang Pengelolaan Pembelajaran, Asesmen dan Sertifikasi Berbasis Digital, Bidang Perencanaan PLN Corporate University.
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="lg:col-span-7 p-8 lg:p-12 flex flex-col justify-between">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Masuk ke Sistem</h2>
              <p className="text-xs text-slate-500 mt-1">
                Gunakan kredensial akun korporat Anda untuk mengakses dashboard LNA.
              </p>
            </div>

            {errorMsg && (
              <div className="mb-5 p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
                <Lock className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Username / NIP
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Masukkan username atau NIP (contoh: rakha.nugroho / 2023091048)"
                    className="w-full pl-10 pr-4 py-2.5 text-xs md:text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#00843D] focus:ring-1 focus:ring-[#00843D] transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      onShowToast('info', 'Silakan gunakan akun demo yang tertera di kotak bawah.', 'Lupa Password');
                    }}
                    className="text-[11px] text-[#00843D] hover:underline font-medium"
                  >
                    Lupa Password?
                  </button>
                </div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan password"
                    className="w-full pl-10 pr-4 py-2.5 text-xs md:text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#00843D] focus:ring-1 focus:ring-[#00843D] transition-colors"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between py-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-[#00843D] border-slate-300 focus:ring-[#00843D]"
                  />
                  <span className="text-xs text-slate-600">Ingat Saya di Perangkat Ini</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-2.5 px-4 bg-[#00843D] hover:bg-[#006B32] text-white font-semibold text-xs md:text-sm rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-70 cursor-pointer"
              >
                {isLoading ? (
                  <span>Memverifikasi Kredensial...</span>
                ) : (
                  <>
                    <span>Masuk ke Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Demo Accounts Information & 1-Click Select */}
            <div className="mt-8 pt-6 border-t border-slate-200">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-semibold text-slate-700">Akun Uji Coba Prototype:</span>
                <span className="text-[10px] text-slate-400">Klik untuk isi otomatis</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('admin')}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    username.includes('admin')
                      ? 'border-[#00843D] bg-emerald-50/60 ring-1 ring-[#00843D]'
                      : 'border-slate-200 bg-slate-50 hover:bg-white'
                  }`}
                >
                  <div className="text-[11px] font-bold text-slate-800">ADMIN</div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">admin.demo</div>
                  <div className="text-[9.5px] text-[#00843D] font-bold mt-1">Full CRUD</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('user')}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    username.includes('user') || username.includes('rakha')
                      ? 'border-[#00843D] bg-emerald-50/60 ring-1 ring-[#00843D]'
                      : 'border-slate-200 bg-slate-50 hover:bg-white'
                  }`}
                >
                  <div className="text-[11px] font-bold text-slate-800 truncate">USER (PEGAWAI)</div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">rakha.nugroho</div>
                  <div className="text-[9.5px] text-amber-700 font-bold mt-1">View Only</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('manager')}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    username.includes('manag')
                      ? 'border-[#00843D] bg-emerald-50/60 ring-1 ring-[#00843D]'
                      : 'border-slate-200 bg-slate-50 hover:bg-white'
                  }`}
                >
                  <div className="text-[11px] font-bold text-slate-800 truncate">MANAGEMENT</div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">management.demo</div>
                  <div className="text-[9.5px] text-purple-700 font-bold mt-1">Review & FB</div>
                </button>
              </div>

              {onBackToLanding && (
                <div className="mt-4 text-center">
                  <button
                    type="button"
                    onClick={onBackToLanding}
                    className="text-xs text-slate-500 hover:text-[#00843D] font-semibold underline underline-offset-2"
                  >
                    ← Kembali ke Video Corporate / Company Profile
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="text-center mt-6 text-[11px] text-slate-400">
            PLN Digital LNA System · Versi Prototipe 2026
          </div>
        </div>
      </div>
    </div>
  );
};
