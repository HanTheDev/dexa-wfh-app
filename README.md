# Dexa WFH - Employee Attendance System

Repositori ini berisi solusi **Fullstack Web Application** untuk **Technical Test Dexa Group**.

## 📋 Ikhtisar Proyek

Aplikasi ini memenuhi seluruh objektif dan *use case* yang diminta:
1.  **Backend:** Menggunakan **NestJS** dengan konsep Microservices.
2.  **Frontend:** Menggunakan **React.js** (Vite).
3.  **Database:** Menggunakan **MySQL** dengan struktur relasional yang tepat.
4.  **Fitur Utama:** Absensi WFH (Login, Capture Foto, Lokasi/Waktu) dan Monitoring Karyawan (CRUD Data Karyawan).

---

## 🏗️ Arsitektur Sistem

Sistem dibangun dengan pendekatan Microservices yang terdiri dari 4 layanan utama:

| Service | Port | Deskripsi |
| :--- | :--- | :--- |
| **API Gateway** | `4000` | Pintu masuk tunggal (Proxy) untuk semua request dari frontend ke service terkait. |
| **Auth Service** | `4001` | Menangani registrasi, login, dan validasi token JWT. |
| **Employee Service** | `4002` | Menangani CRUD data master karyawan (Data Master). |
| **Attendance Service** | `4003` | Menangani proses Clock-in (dengan upload foto), Clock-out, dan pelaporan. |

## 🛠️ Tech Stack

### Backend
*   **Framework:** NestJS (Node.js)
*   **Language:** TypeScript
*   **Database:** MySQL
*   **ORM:** TypeORM
*   **Communication:** HTTP Request (Axios) antar microservices.

### Frontend
*   **Framework:** React.js (Vite)
*   **UI Library:** Material UI (MUI)
*   **State Management:** React Context API
*   **Form Handling:** React Hook Form + Yup Validation

---

## ✨ Fitur Utama (Sesuai Use Case)

### 1. Aplikasi Absensi WFH Karyawan (User Employee)
*   **Login:** Akses aman menggunakan akun karyawan.
*   **Clock In WFH:** Mencatat waktu mulai kerja dan **mengunggah foto bukti WFH** (Wajib sesuai requirement).
*   **Clock Out:** Mencatat waktu selesai kerja dan menghitung durasi kerja otomatis.
*   **Daily Status:** Dashboard menampilkan status kehadiran hari ini (Working/Completed).
*   **History:** Melihat riwayat absensi pribadi.

### 2. Aplikasi Monitoring Karyawan (User Admin/HRD)
*   **Dashboard Admin:** Ringkasan statistik kehadiran.
*   **Master Data Management:** Admin HRD dapat melakukan penambahan (Add) dan pembaruan (Update) data karyawan.
*   **Monitoring Absensi:** Admin dapat melakukan kontrol (view only) terhadap absensi yang telah disubmit karyawan, termasuk melihat foto bukti.
*   **Reporting:** Filter data absensi berdasarkan tanggal atau status.

---

## 🚀 Cara Menjalankan (Installation Guide)

### Prasyarat
*   Node.js (v18+)
*   MySQL Database

### 1. Setup Database
Buat database baru bernama `dexa_wfh_db` dan jalankan script SQL yang terdapat pada file `schema.sql` untuk membuat tabel dan *seeding* data dummy awal.

```sql
CREATE DATABASE dexa_wfh_db;
USE dexa_wfh_db;
-- Jalankan isi file schema.sql di sini****
```

### 2. Konfigurasi Environment (.env)
Setiap service memerlukan file .env. Silakan buat file .env di dalam folder masing-masing service (`backend/api-gateway`, `backend/auth-service`, dst) dengan konfigurasi berikut:

**Template Dasar (Sesuaikan Port Service):**
```env
# Database Config
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=password_anda
DB_DATABASE=dexa_wfh_db

# JWT Config (Harus sama di semua service)
JWT_SECRET=rahasia_super_aman
JWT_EXPIRATION=1d

# Service Port (Ganti sesuai service)
# Gateway: 4000, Auth: 4001, Employee: 4002, Attendance: 4003
PORT=4000
```

### 3. Install Dependencies
Jalankan script helper yang tersedia di root `backend` atau install manual di setiap folder:

```bash
# Menggunakan script helper
cd backend
chmod +x install-deps.sh
./install-deps.sh

# Atau install manual di setiap folder
cd backend/api-gateway && npm install
cd ../auth-service && npm install
cd ../employee-service && npm install
cd ../attendance-service && npm install
```

### 4. Menjalankan Backend (Microservices)
Karena ini adalah arsitektur microservices, Anda perlu menjalankan 4 terminal terpisah:

```bash
# Terminal 1 - Auth Service
cd backend/auth-service && npm run start:dev

# Terminal 2 - Employee Service  
cd backend/employee-service && npm run start:dev

# Terminal 3 - Attendance Service
cd backend/attendance-service && npm run start:dev

# Terminal 4 - API Gateway
cd backend/api-gateway && npm run start:dev
```

### 5. Menjalankan Frontend
```bash
cd frontend
npm install
npm run dev
```

## 👤 Akun Demo (Default)
Gunakan kredensial berikut untuk pengujian (berdasarkan `schema.sql`):

| Role | Email | Password | Fitur Akses |
| :--- | :--- | :--- | :--- |
| Admin (HRD) | admin@dexa.com | admin123 | Master Data Karyawan, Monitoring Absensi |
| Employee | john.doe@dexa.com | employee123 | Clock In/Out, Upload Foto, History Absensi |
