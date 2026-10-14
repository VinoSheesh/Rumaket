export const FEATURES = [
  {
    title: "Room Lansia Terisolasi",
    desc: "Satu dasbor khusus per lansia — jadwal, absensi, dan catatan tidak tercampur antar keluarga lain.",
  },
  {
    title: "Jadwal Berkategori",
    desc: "Obat, nutrisi, higiene, tanda vital, dan terapi — dikelompokkan per slot waktu, bukan daftar panjang membingungkan.",
  },
  {
    title: "Catatan Serah-Terima",
    desc: "Kondisi kesehatan, perubahan perilaku, dan hasil pengukuran tercatat rapi antar shift, lengkap foto pendukung.",
  },
];

export const STEPS = [
  {
    n: "01",
    title: "Buat Room Lansia",
    desc: "Keluarga/admin membuat room khusus untuk satu lansia.",
  },
  {
    n: "02",
    title: "Undang CareTaker",
    desc: "Bagikan kode undangan — caretaker tinggal masukkan kode untuk bergabung.",
  },
  {
    n: "03",
    title: "Susun Jadwal",
    desc: "Atur tugas harian per kategori dan slot waktu.",
  },
  {
    n: "04",
    title: "Pantau Real-time",
    desc: "Lihat siapa sedang bertugas, progres jadwal, dan catatan terbaru.",
  },
];

export const ROLES = [
  {
    label: "Room Owner / Keluarga",
    items: [
      "Membuat dan mengelola room lansia",
      "Mengundang satu atau beberapa caretaker",
      "Mengatur jadwal harian lansia",
      "Memantau log absensi & catatan harian",
    ],
  },
  {
    label: "CareTaker / Perawat",
    items: [
      "Mengakses room lansia tempat ditugaskan",
      "Check-in / check-out satu ketuk",
      "Menandai tugas selesai atau dilewati",
      "Menulis catatan perawatan harian",
    ],
  },
];
