# Windows Companion — tahap awal

Aplikasi Electron lokal untuk menjalankan Sign in with ChatGPT melalui SDK resmi. OAuth dan token tetap di proses utama Electron; renderer hanya menerima status koneksi. Windows safeStorage menggunakan penyimpanan kredensial OS (DPAPI pada Windows).

## Prasyarat
- Windows 10/11
- Node.js 22+
- Salinan lokal resmi OpenAI Sign in with ChatGPT DevKit di folder sejajar dengan repository ini, bernama sign-in-with-chatgpt-devkit
- Akun dan izin penggunaan ChatGPT plan yang memenuhi ketentuan OpenAI

## Jalankan
Dari folder windows-companion:
1. npm install
2. npm run build
3. npm start

Dependensi @siwc/local menunjuk ke ../../sign-in-with-chatgpt-devkit/packages/local. Clone dan build DevKit resmi mengikuti instruksi upstream.

## Batasan
- Belum ada transfer kredensial ke server Judge.Me.
- Belum ada pemanggilan AI atau unggah dokumen perkara.
- Belum ada endpoint koneksi pada server Judge.Me.
- Belum diuji pada Windows aktual.
- Repository saat ini private. Pastikan kelayakan open-source SIWC sebelum aktivasi; jangan mengubah visibilitas tanpa persetujuan pemilik.
