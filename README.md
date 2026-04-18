<p align="center">
  <img src="src/assets/icon.svg" width="150" alt="DOMENICO Icon" />
</p>

# D.O.M.E.N.I.C.O WEATHER SYS // EVA UNIT-01

**Dynamic Operational Meteorological Evangelist Network of Indonesian Climate Oracle**

DOMENICO adalah aplikasi pemantau cuaca interaktif dengan antarmuka yang terinspirasi dari **Neon Genesis Evangelion (NERV / MAGI System)**. Dibangun menggunakan React dan OpenWeatherMap API, Menggunakan skema warna ikonik **Evangelion Unit-01** (Ungu & Hijau Neon).

### 🌐 Live Preview

Saksikan sistem MAGI beroperasi secara langsung pada tautan berikut:
**&rarr; [DOMENICO Live Preview](https://domenico-sys.netlify.app/)**

---

## 🎯 Fitur Utama (Core Systems)

- **Evangelion Unit-01 Aesthetic:** Antarmuka bergaya taktis (Tactical GUI) khas MAGI System dengan palet warna ungu tua solid dan elemen data hijau neon.
- **GPS Telemetry Link:** Tombol sinkronisasi `[ ⊙ LOCATE ]` untuk menarik lokasi akurat secara presisi dengan _loading indicator_ rotasional.
- **Data Scrambling:** Hook kustom `useScramble` yang mensimulasikan proses dekripsi alfanumerik tiap kali metrik cuaca (Suhu, Kelembaban, Angin) diperbarui.
- **Live Clock Sync:** Indikator Real-Time WIB Clock disinkronisasikan di _master header_ antarmuka.
- **EVA Alert Status:** Sistem peringatan dinamis berbasis skala (Nominal / Caution / Warning / EVANGELION) dengan penyesuaian visual saat terjadi peringatan radikal, seperti efek scanline dan border-pulse.
- **Mobile-Optimized Grid:** Layout kustom responsif 100dvh dan bebas-_scroll_ yang memberikan impresi Native App.

---

## 🛠 Tech Stack

- **Framework:** [React 18](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Styling:** Vanilla CSS (`nerv.css` custom vars, flexbox, CSS Grid)
- **Weather Engine:** [OpenWeatherMap API](https://openweathermap.org/api) (Current Weather Data & 5-Day/3-Hour Forecast)
- **Indonesian Location:** [Emsifa API](https://emsifa.github.io/api-wilayah-indonesia/docs/) (Provinsi, Kota, Kecamatan in Indonesia)
- **Geocoding:** Reverse Geocoding via OpenWeatherMap & Pencarian Kota via Emsifa API / Open-Meteo
- **PWA:** [vite-plugin-pwa](https://vite-plugin-pwa.netlify.app/) (Progressive Web App)

---

## 🚀 Cara Menjalankan Secara Lokal (Local Deployment)

Untuk melakukan inisiasi proyek DOMENICO di mesin lokal Anda / _On-Premise Terminal_, ikuti prosedur standar di bawah ini:

### 1. Kloning Repositori

```bash
git clone https://github.com/AllMuchalif2/domenico.git
cd domenico
```

### 2. Instalasi Dependensi

Pastikan [Node.js](https://nodejs.org/) sudah terinstal di sistem Anda.

```bash
npm install
```

### 3. Konfigurasi Variabel Lingkungan (Environment Variables)

Buat file bernama `.env` di root folder proyek Anda. Anda membutuhkan API Key dari OpenWeatherMap:

```env
VITE_OPENWEATHER_API_KEY=masukkan_api_key_openweathermap_anda_di_sini
```

### 4. Eksekusi Server Development

```bash
npm run dev
```

### 5. Akses Terminal

Setelah kompilasi selesai, buka _browser_ dengan alamat berikut untuk melihat GUI sistem:

```
http://localhost:5173
```

---

> _"God's in his heaven. All's right with the world."_
