# Kalkulator Target Tabungan (Cloudflare Workers FaaS)

Aplikasi web berbasis arsitektur **Serverless** menggunakan **Cloudflare Workers** (*Function-as-a-Service* / FaaS) yang berfungsi untuk menghitung estimasi waktu pencapaian target tabungan secara cepat di jaringan *edge*.

- **Live Demo:** [https://penerapan-cloudflare-website-target-tabungan.raharjian-sustanadia24.workers.dev](https://penerapan-cloudflare-website-target-tabungan.raharjian-sustanadia24.workers.dev)
- **Repositori GitHub:** [nyndaa/Penerapan_CloudFlare-Website_Target_Tabungan](https://github.com/nyndaa/Penerapan_CloudFlare-Website_Target_Tabungan)

---

## Fitur Utama

- **Perhitungan Berbasis FaaS (`/api/hitung`):** Seluruh logika kalkulasi dan validasi data dijalankan di sisi *edge* menggunakan Cloudflare Workers tanpa memerlukan pengelolaan server tradisional.
- **Hitung Otomatis (*Live Update*):** Menggunakan teknik *debounce* (jeda 500 ms setelah pengguna berhenti mengetik) sehingga hasil estimasi langsung diperbarui secara otomatis tanpa perlu memuat ulang halaman.
- **Sinkronisasi Parameter URL Otomatis:** Setiap perubahan nominal pada formulir otomatis memperbarui *query string* di *address bar* browser (`?target=...&awal=...&setoran=...`) menggunakan `window.history.replaceState`, sehingga tautan hasil perhitungan dapat langsung dibagikan atau dibuka kembali di tab baru.
- **Informasi Lokasi Eksekusi Edge:** Menampilkan kode pusat data Cloudflare (*Edge Node*, misalnya `SIN` untuk Singapura) yang mengeksekusi permintaan pengguna.

---

## Arsitektur Serverless

Aplikasi ini memanfaatkan **Cloudflare Workers** sebagai gerbang utama lalu lintas HTTP:

1. **Penyajian Aset Statis:** Ketika pengguna mengakses halaman utama (`/`), Worker meneruskan permintaan ke `env.ASSETS` untuk menampilkan antarmuka web (`public/index.html`) yang dibangun dengan Tailwind CSS.
2. **Eksekusi API FaaS:** Ketika antarmuka memanggil *endpoint* `/api/hitung`, fungsi `worker.js` aktif secara *event-driven*, memvalidasi parameter input, menghitung sisa dana serta estimasi durasi (bulan dan tahun), lalu mengembalikan respons berformat **JSON**.

---

## Struktur Proyek

```text
WEBSITE TARGET TABUNGAN/
├── public/
│   └── index.html       # Antarmuka pengguna (Frontend) & logika live update
├── worker.js            # Fungsi serverless FaaS & routing endpoint API
├── wrangler.jsonc       # Konfigurasi deployment Cloudflare Workers & static assets
└── README.md            # Dokumentasi proyek
```

---

## Dokumentasi API

### `GET /api/hitung`

Menghitung sisa kekurangan dana dan estimasi waktu pencapaian target tabungan.

#### Parameter Query

| Parameter | Tipe | Wajib | Keterangan |
| :--- | :--- | :---: | :--- |
| `target` | `number` | Ya | Nominal target tabungan yang ingin dicapai (harus $> 0$) |
| `setoran` | `number` | Ya | Nominal setoran rutin per bulan (harus $> 0$) |
| `awal` | `number` | Tidak | Saldo awal yang sudah dimiliki saat ini (default: `0`) |

#### Contoh Permintaan (*Request*)

```http
GET /api/hitung?target=3000000&awal=2000000&setoran=100000
```

#### Contoh Respons Sukses (`200 OK`)

```json
{
  "status": "sukses",
  "lokasi_eksekusi_edge": "SIN",
  "hasil_perhitungan": {
    "sisa_dana_dibutuhkan": 1000000,
    "estimasi_waktu_bulan": 10,
    "keterangan": "Target tercapai dalam 10 bulan (±0.8 tahun)."
  }
}
```

#### Contoh Respons Error (`400 Bad Request`)

```json
{
  "status": "error",
  "pesan": "Parameter target dan setoran harus lebih dari 0."
}
```

---

## Deployment

Proyek ini terintegrasi langsung dengan **GitHub** dan **Cloudflare Workers & Pages** untuk *automatic deployment*:

1. Simpan perubahan kode pada direktori proyek lokal.
2. Lakukan *commit* dan *push* ke branch `main`:
   ```bash
   git add .
   git commit -m "Update proyek"
   git push origin main
   ```
3. Cloudflare akan otomatis menjalankan perintah `npx wrangler deploy` dan memperbarui aplikasi dalam beberapa detik.

---

## Penyusun

- **Nama:** Raharjian Sustanadia Wijayanti
- **NIM:** 245410040
- **Program Studi:** Informatika — Universitas Teknologi Digital Indonesia (2026)