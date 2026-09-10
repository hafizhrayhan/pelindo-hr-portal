import { NextResponse } from "next/server";

// Simulasi Database di memori server (sebagai pengganti MySQL sementara agar cepat deploy)
let leavesDatabase = [
  {
    id: "REQ-001",
    employeeName: "Budi Santoso",
    division: "Operasional Pelabuhan",
    leaveType: "Cuti Tahunan",
    startDate: "2026-09-15",
    endDate: "2026-09-17",
    reason: "Acara keluarga di luar kota",
    status: "Approved",
  },
  {
    id: "REQ-002",
    employeeName: "Siti Rahma",
    division: "Pengelolaan SDM",
    leaveType: "Izin Sakit",
    startDate: "2026-09-12",
    endDate: "2026-09-12",
    reason: "Pemeriksaan medis rutin",
    status: "Pending",
  }
];

// Endpoint GET: Mengambil semua data
export async function GET() {
  return NextResponse.json({ success: true, data: leavesDatabase }, { status: 200 });
}

// Endpoint POST: Menambah data pengajuan baru
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newRequest = {
      id: `REQ-00${leavesDatabase.length + 1}`,
      ...body,
      status: "Pending",
    };
    
    // Simpan ke "database"
    leavesDatabase.unshift(newRequest); // Taruh di urutan paling atas
    
    return NextResponse.json({ success: true, message: "Pengajuan berhasil", data: newRequest }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Kesalahan server" }, { status: 500 });
  }
}

// Endpoint PATCH: Mengubah status (Approve/Reject)
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    // Update data di "database"
    leavesDatabase = leavesDatabase.map((req) => 
      req.id === id ? { ...req, status: status } : req
    );

    return NextResponse.json({ success: true, message: `Status diubah menjadi ${status}` }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Kesalahan server" }, { status: 500 });
  }
}