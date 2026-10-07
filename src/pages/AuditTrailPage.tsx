import React, { useState } from 'react';
import { History, Shield, Search, Filter, Lock } from 'lucide-react';
import { AuditTrailItem, User } from '../types';
import { StatusBadge } from '../components/StatusBadge';

interface AuditTrailPageProps {
  currentUser: User;
  auditTrail: AuditTrailItem[];
}

export const AuditTrailPage: React.FC<AuditTrailPageProps> = ({ currentUser, auditTrail }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterModule, setFilterModule] = useState('ALL');

  // Security guard: User Dasar cannot view Audit Trail
  if (currentUser.role === 'USER DASAR') {
    return (
      <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
        <Lock className="w-8 h-8 text-rose-500 mx-auto mb-3" />
        <h2 className="text-base font-bold text-slate-900">Akses Ditolak (403 Forbidden)</h2>
        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
          Audit Trail sistem hanya diperuntukkan bagi jajaran ADMIN dan MANAGEMENT PLN Corporate University.
        </p>
      </div>
    );
  }

  const filteredItems = auditTrail.filter((item) => {
    const matchSearch =
      searchTerm === '' ||
      item.activity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.module.toLowerCase().includes(searchTerm.toLowerCase());

    const matchModule = filterModule === 'ALL' || item.module === filterModule;

    return matchSearch && matchModule;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-[#00843D] uppercase tracking-wider">
              System Audit & Compliance Log
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
            Activity / Audit Trail
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Rekam jejak setiap aksi pengelolaan data, revisi, dan persetujuan LNA secara kronologis.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
          <Shield className="w-3.5 h-3.5 text-[#00843D]" />
          <span>Akses Terbatas: ADMIN & MANAGEMENT</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari user, aktivitas, atau modul..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-[#F5F7F9] border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-[#00843D]"
          />
        </div>

        <div>
          <select
            value={filterModule}
            onChange={(e) => setFilterModule(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-[#F5F7F9] border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-[#00843D]"
          >
            <option value="ALL">Semua Modul</option>
            <option value="CCA">CCA</option>
            <option value="DNA">DNA</option>
            <option value="Learning Path">Learning Path</option>
            <option value="TNA">TNA</option>
            <option value="Learning Solution">Learning Solution</option>
            <option value="LNA Report">LNA Report</option>
          </select>
        </div>
      </div>

      {/* Audit Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold tracking-wide">
                <th className="py-3 px-4 w-40">Tanggal & Waktu</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-3">Role</th>
                <th className="py-3 px-4">Aktivitas</th>
                <th className="py-3 px-3">Modul</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-400">
                    Tidak ada catatan audit yang cocok.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-500 whitespace-nowrap">
                      {item.date}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900 whitespace-nowrap">
                      {item.user}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-[10.5px]">
                        {item.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800">
                      {item.activity}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap font-medium text-[#006B32]">
                      {item.module}
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <StatusBadge status={item.status} size="sm" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
