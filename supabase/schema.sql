-- ==============================================================================
-- BINTANGKU - SUPABASE COMPLETE DATABASE SCHEMA & BACKEND
-- Aplikasi Kebiasaan Islami Anak, Dashboard Guru & Pengaturan Terpadu
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. App Settings Table (Pengaturan Global: Nama Guru, Sekolah, Tentang, Kontak)
CREATE TABLE IF NOT EXISTS public.app_settings (
    id VARCHAR(50) PRIMARY KEY DEFAULT 'default_settings',
    school_name VARCHAR(200) NOT NULL DEFAULT 'SDIT Bintang Cemerlang',
    school_address TEXT DEFAULT 'Jl. Melati No. 12, Kebayoran Baru, Jakarta Selatan',
    teacher_name VARCHAR(150) NOT NULL DEFAULT 'Ustadzah Aisyah',
    teacher_title VARCHAR(100) DEFAULT 'Wali Kelas 2A',
    teacher_avatar TEXT DEFAULT '🧕🏻',
    about_text TEXT DEFAULT 'Platform pembiasaan karakter & ibadah islami terpadu untuk membentuk generasi anak yang shalih, mandiri, dan berakhlakul karimah melalui pendekatan apresiasi positif dan penuh cinta.',
    about_vision TEXT DEFAULT 'Menjadi mitra terbaik keluarga dan sekolah dalam mendampingi tumbuh kembang ibadah harian ananda sejak usia dini.',
    contact_whatsapp VARCHAR(50) DEFAULT '+62 812-3456-7890',
    contact_phone VARCHAR(50) DEFAULT '(021) 7890-1234',
    contact_email VARCHAR(100) DEFAULT 'salam@bintangku.id',
    contact_address TEXT DEFAULT 'Gedung Graha Bintang Cemerlang, Lt. 2, Jl. Pendidikan No. 45, Jakarta Selatan',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Classes Table (Data Kelas & Rombel)
CREATE TABLE IF NOT EXISTS public.classes (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL, -- e.g. "Kelas 2A", "Kelas 2B", "Kelas 3A"
    school_name VARCHAR(150) DEFAULT 'SDIT Bintang Cemerlang',
    teacher_name VARCHAR(100) DEFAULT 'Ustadzah Aisyah',
    academic_year VARCHAR(50) DEFAULT '2024/2025',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Students Table (Data Siswa & Profil)
CREATE TABLE IF NOT EXISTS public.students (
    id VARCHAR(50) PRIMARY KEY,
    class_id VARCHAR(50) REFERENCES public.classes(id) ON DELETE SET NULL,
    name VARCHAR(150) NOT NULL,
    gender VARCHAR(20) DEFAULT 'male',
    pin VARCHAR(4) NOT NULL DEFAULT '1234',
    avatar VARCHAR(50) DEFAULT '👦🏻',
    total_stars INTEGER DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'Sangat Konsisten',
    status_type VARCHAR(20) DEFAULT 'success',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Habits Master Table (Daftar Kebiasaan Ibadah & Akhlak)
CREATE TABLE IF NOT EXISTS public.habits (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    category VARCHAR(50) DEFAULT 'ibadah', -- 'ibadah', 'akhlak', 'kemandirian', 'sunnah'
    icon_type VARCHAR(50) DEFAULT 'star', -- 'mosque_subuh', 'mosque_dzuhur', 'mosque_maghrib', 'quran', 'moon_sleep', 'dhuha', 'sedekah'
    stars_reward INTEGER DEFAULT 10,
    is_daily BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Student Daily Habit Logs (Catatan Ceklis Kebiasaan Harian)
CREATE TABLE IF NOT EXISTS public.habit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id VARCHAR(50) REFERENCES public.students(id) ON DELETE CASCADE,
    habit_id VARCHAR(50) REFERENCES public.habits(id) ON DELETE CASCADE,
    log_date DATE NOT NULL DEFAULT CURRENT_DATE,
    is_completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(student_id, habit_id, log_date)
);

-- 7. Badges Master Table (Lencana Pencapaian)
CREATE TABLE IF NOT EXISTS public.badges (
    id VARCHAR(50) PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    required_stars INTEGER DEFAULT 100,
    category VARCHAR(50) DEFAULT 'ibadah',
    icon_type VARCHAR(50) DEFAULT 'gold_mosque',
    is_unlocked_by_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Student Badges Earned (Lencana yang Diraih Siswa)
CREATE TABLE IF NOT EXISTS public.student_badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id VARCHAR(50) REFERENCES public.students(id) ON DELETE CASCADE,
    badge_id VARCHAR(50) REFERENCES public.badges(id) ON DELETE CASCADE,
    earned_date VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(student_id, badge_id)
);

-- ==============================================================================
-- ENABLE ROW LEVEL SECURITY (RLS) & POLICIES (Full Read/Write for anon & auth)
-- ==============================================================================
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_badges ENABLE ROW LEVEL SECURITY;

-- Permissive policies for web deployment (Vercel Client with Anon Key)
CREATE POLICY "Public Read/Write Settings" ON public.app_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Read/Write Classes" ON public.classes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Read/Write Students" ON public.students FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Read/Write Habits" ON public.habits FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Read/Write Habit Logs" ON public.habit_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Read/Write Badges" ON public.badges FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Read/Write Student Badges" ON public.student_badges FOR ALL USING (true) WITH CHECK (true);

-- ==============================================================================
-- INITIAL SEED DATA
-- ==============================================================================

-- 1. Initial App Settings
INSERT INTO public.app_settings (
    id, 
    school_name, 
    school_address, 
    teacher_name, 
    teacher_title, 
    about_text, 
    about_vision,
    contact_whatsapp, 
    contact_phone, 
    contact_email, 
    contact_address
) VALUES (
    'default_settings',
    'SDIT Bintang Cemerlang',
    'Jl. Melati No. 12, Kebayoran Baru, Jakarta Selatan',
    'Ustadzah Aisyah',
    'Wali Kelas 2A',
    'Platform pembiasaan karakter & ibadah islami terpadu untuk membentuk generasi anak yang shalih, mandiri, dan berakhlakul karimah melalui pendekatan apresiasi positif dan penuh cinta.',
    'Membantu orang tua dan pendidik memantau serta menyemangati pembiasaan ibadah harian ananda dengan riang gembira.',
    '+62 812-3456-7890',
    '(021) 7890-1234',
    'salam@bintangku.id',
    'Gedung Graha Bintang Cemerlang, Lt. 2, Jl. Pendidikan No. 45, Jakarta Selatan'
) ON CONFLICT (id) DO UPDATE SET updated_at = now();

-- 2. Initial Classes
INSERT INTO public.classes (id, name, school_name, teacher_name, academic_year) VALUES 
    ('c-2a', 'Kelas 2A', 'SDIT Bintang Cemerlang', 'Ustadzah Aisyah', '2024/2025'),
    ('c-2b', 'Kelas 2B', 'SDIT Bintang Cemerlang', 'Ustadzah Fatimah', '2024/2025'),
    ('c-3a', 'Kelas 3A', 'SDIT Bintang Cemerlang', 'Ustadz Abdullah', '2024/2025')
ON CONFLICT (id) DO NOTHING;

-- 3. Initial Students
INSERT INTO public.students (id, class_id, name, gender, pin, avatar, total_stars, current_streak, longest_streak, status, status_type, notes) VALUES
    ('s-arman', 'c-2a', 'Adek Arman', 'male', '1234', '👦🏻', 320, 7, 7, 'Sangat Konsisten', 'success', 'Sangat rajin dan antusias sholat berjamaah.'),
    ('s1', 'c-2a', 'Ahmad Zaki', 'male', '1234', '👦🏻', 240, 12, 12, 'Sangat Konsisten', 'success', 'Sangat tertib sholat 5 waktu berjamaah di masjid.'),
    ('s2', 'c-2a', 'Aisyah Humaira', 'female', '1234', '🧕🏻', 210, 8, 8, 'Sangat Konsisten', 'success', 'Rajin mengaji surah pendek setiap ba''da maghrib.'),
    ('s3', 'c-2a', 'Muhammad Fathan', 'male', '1234', '👦🏽', 160, 5, 5, 'Cukup Konsisten', 'warning', 'Perlu pengingat untuk sholat subuh tepat waktu.'),
    ('s4', 'c-2a', 'Khalisa Putri', 'female', '1234', '🧕🏼', 110, 3, 3, 'Perlu Semangat', 'danger', 'Sudah mulai terbiasa berdoa sebelum tidur.'),
    ('s5', 'c-2a', 'Raihan Aditya', 'male', '1234', '👦🏻', 80, 2, 2, 'Perlu Semangat', 'danger', 'Perlu bimbingan bersama orang tua di rumah.')
ON CONFLICT (id) DO NOTHING;

-- 4. Initial Habits
INSERT INTO public.habits (id, title, description, category, icon_type, stars_reward, order_index) VALUES
    ('h1', 'Sholat Subuh', 'Jangan lupa sholat Subuh ya!', 'ibadah', 'mosque_subuh', 10, 1),
    ('h2', 'Sholat Dzuhur', 'Sholat tepat waktu, hati tenang', 'ibadah', 'mosque_dzuhur', 10, 2),
    ('h3', 'Sholat Maghrib', 'Jangan lupa sholat Maghrib ya!', 'ibadah', 'mosque_maghrib', 10, 3),
    ('h4', 'Mengaji', 'Baca Al-Qur''an setiap hari', 'ibadah', 'quran', 10, 4),
    ('h5', 'Doa Sebelum Tidur', 'Berdoa sebelum tidur, yuk!', 'akhlak', 'moon_sleep', 10, 5)
ON CONFLICT (id) DO NOTHING;

-- 5. Initial Badges
INSERT INTO public.badges (id, code, title, description, required_stars, category, icon_type, is_unlocked_by_default) VALUES
    ('b1', 'rajin_sholat', 'Bintang Rajin Sholat', 'Mengerjakan sholat 5 waktu tepat waktu selama 7 hari berturut-turut.', 50, 'ibadah', 'gold_mosque', true),
    ('b2', 'mengaji', 'Bintang Mengaji', 'Rutin membaca Al-Qur''an atau Iqro setiap hari tanpa terlewat.', 100, 'ibadah', 'gold_quran', true),
    ('b3', 'doa_malam', 'Bintang Doa Malam', 'Selalu membaca doa sebelum tidur dan ayat kursi di malam hari.', 150, 'akhlak', 'gold_moon', true),
    ('b4', 'sholat_5_waktu', 'Bintang Sholat 5 Waktu', 'Menyelesaikan seluruh shalat fardhu dengan penuh kesadaran.', 200, 'ibadah', 'gold_sun', true),
    ('b5', 'berdoa', 'Bintang Berdoa', 'Terbiasa membaca doa makan, keluar rumah, dan aktivitas harian.', 250, 'akhlak', 'gold_hands', true),
    ('b6', 'berbagi', 'Bintang Berbagi', 'Kumpulkan 500 bintang lagi untuk membuka lencana kedermawanan ini.', 500, 'sosial', 'silver_sharing', false),
    ('b7', 'disiplin', 'Bintang Disiplin', 'Kumpulkan 800 bintang lagi untuk membuka lencana kedisiplinan tinggi.', 800, 'karakter', 'silver_trophy', false),
    ('b8', 'konsisten', 'Bintang Konsisten', 'Kumpulkan 1000 bintang lagi untuk membuktikan ketekunan tanpa henti.', 1000, 'karakter', 'silver_calendar', false),
    ('b9', 'istimewa', 'Bintang Istimewa', 'Kumpulkan 1500 bintang lagi untuk meraih bintang keagungan sejati.', 1500, 'prestasi', 'silver_star', false)
ON CONFLICT (id) DO NOTHING;
