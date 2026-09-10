"use client";

import { useState, useEffect } from "react";

interface LeaveRequest {
  id: string;
  employeeName: string;
  division: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
}

export default function HRPortal() {
  const [role, setRole] = useState<"employee" | "hr">("employee");
  const [leaveQuota, setLeaveQuota] = useState<number>(12);
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    employeeName: "",
    division: "Pengelolaan SDM",
    leaveType: "Cuti Tahunan",
    startDate: "",
    endDate: "",
    reason: "",
  });

  // FETCH GET: Mengambil data dari REST API
  const fetchLeaves = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/leaves");
      const result = await res.json();
      if (result.success) {
        setRequests(result.data);
      }
    } catch (error) {
      console.error("Gagal mengambil data API", error);
    }
    setIsLoading(false);
  };

  // Jalankan fetch saat aplikasi pertama kali dimuat
  useEffect(() => {
    fetchLeaves();
  }, []);

  // FETCH POST: Mengirim data ke REST API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (leaveQuota <= 0 && formData.leaveType === "Cuti Tahunan") {
      alert("Sisa kuota cuti tahunan Anda telah habis!");
      return;
    }

    try {
      const res = await fetch("/api/leaves", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      const result = await res.json();
      if (result.success) {
        if (formData.leaveType === "Cuti Tahunan") setLeaveQuota((prev) => prev - 1);
        setFormData({ employeeName: "", division: "Pengelolaan SDM", leaveType: "Cuti Tahunan", startDate: "", endDate: "", reason: "" });
        fetchLeaves(); // Refresh data dari server
        alert("Pengajuan cuti berhasil dikirim via API!");
      }
    } catch (error) {
      alert("Terjadi kesalahan sistem.");
    }
  };

  // FETCH PATCH: Mengupdate status via REST API
  const handleStatusUpdate = async (id: string, newStatus: "Approved" | "Rejected") => {
    try {
      const res = await fetch("/api/leaves", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      
      const result = await res.json();
      if (result.success) {
        fetchLeaves(); // Refresh data dari server
      }
    } catch (error) {
      console.error("Gagal update status", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <header className="bg-blue-900 text-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold tracking-wide">PELINDO HR PORTAL</h1>
            <p className="text-xs text-blue-200">Integrasi REST API Mode</p>
          </div>
          <div className="flex items-center gap-2 bg-blue-950 p-1.5 rounded-lg border border-blue-800">
            <span className="text-xs text-slate-300 font-medium px-2">Mode:</span>
            <button onClick={() => setRole("employee")} className={`text-xs px-3 py-1 rounded font-semibold transition ${role === "employee" ? "bg-blue-600 text-white" : "text-slate-300 hover:text-white"}`}>Pegawai</button>
            <button onClick={() => setRole("hr")} className={`text-xs px-3 py-1 rounded font-semibold transition ${role === "hr" ? "bg-blue-600 text-white" : "text-slate-300 hover:text-white"}`}>Admin HR</button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {role === "employee" ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-fit">
              <h2 className="text-base font-bold text-slate-900 mb-4 border-b pb-2">Informasi Pegawai</h2>
              <div className="space-y-3 text-sm">
                <div><span className="text-slate-500 block text-xs">Divisi Kerja</span><span className="font-medium text-slate-800">Departemen Pengelolaan SDM</span></div>
                <div><span className="text-slate-500 block text-xs">Sisa Kuota Cuti Tahunan</span><span className="text-2xl font-bold text-blue-900">{leaveQuota} Hari</span></div>
              </div>
            </div>

            <div className="md:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h2 className="text-base font-bold text-slate-900 mb-4 border-b pb-2">Formulir Pengajuan (POST API)</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Nama Pegawai</label>
                    <input type="text" required value={formData.employeeName} onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })} className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Jenis Pengajuan</label>
                    <select value={formData.leaveType} onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })} className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none">
                      <option>Cuti Tahunan</option>
                      <option>Izin Sakit</option>
                      <option>Izin Khusus</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Tanggal Mulai</label>
                    <input type="date" required value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Tanggal Selesai</label>
                    <input type="date" required value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Alasan</label>
                  <textarea required rows={3} value={formData.reason} onChange={(e) => setFormData({ ...formData, reason: e.target.value })} className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none" />
                </div>
                <button type="submit" className="w-full bg-blue-900 hover:bg-blue-800 text-white font-semibold py-2.5 rounded-lg text-sm transition shadow-sm">
                  Kirim Pengajuan
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-4 border-b pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">Dashboard Persetujuan HR</h2>
                <p className="text-xs text-slate-500">Merespons REST API (PATCH)</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-600 border-b">
                    <th className="p-3">Nama Pegawai</th>
                    <th className="p-3">Periode</th>
                    <th className="p-3">Alasan</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isLoading ? <tr><td colSpan={5} className="p-4 text-center">Loading data API...</td></tr> : 
                    requests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50">
                      <td className="p-3 font-semibold text-slate-700">{req.employeeName}</td>
                      <td className="p-3 text-slate-600">{req.startDate} s/d {req.endDate}</td>
                      <td className="p-3 text-slate-600">{req.reason}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold ${req.status === "Approved" ? "bg-green-100 text-green-700" : req.status === "Rejected" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        {req.status === "Pending" ? (
                          <div className="flex justify-center gap-2">
                            <button onClick={() => handleStatusUpdate(req.id, "Approved")} className="bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-1 rounded text-[11px]">Setujui</button>
                            <button onClick={() => handleStatusUpdate(req.id, "Rejected")} className="bg-rose-600 hover:bg-rose-700 text-white px-2 py-1 rounded text-[11px]">Tolak</button>
                          </div>
                        ) : <span className="text-slate-400 italic text-[11px]">Selesai</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}