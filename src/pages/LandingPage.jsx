import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import MascotStar from '../components/MascotStar';
import { 
  Clock, 
  BookOpen, 
  Moon, 
  CheckCircle2, 
  Star, 
  ArrowRight, 
  Heart, 
  Sparkles,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  School,
  ExternalLink,
  LogIn
} from 'lucide-react';
import { triggerStarConfetti } from '../components/StarConfetti';
import { useApp } from '../context/AppContext';
import { MosqueSubuhIcon, QuranStandIcon, MoonNightIcon } from '../components/PremiumIcons';

export default function LandingPage({ setCurrentRoute }) {
  const { settings, testimonials } = useApp();
  const [mobileHabitDone, setMobileHabitDone] = useState(false);

  const toggleDemoHabit = () => {
    setMobileHabitDone(!mobileHabitDone);
    if (!mobileHabitDone) {
      triggerStarConfetti();
    }
  };

  const cleanWaNumber = settings?.contactWhatsApp?.replace(/[^0-9]/g, '') || '6281234567890';

  return (
    <div className="landing-page-wrapper islamic-pattern-bg">
      {/* Navigation */}
      <Navbar currentRoute="landing" setCurrentRoute={setCurrentRoute} />

      {/* Hero Section */}
      <section className="landing-hero-section" id="beranda">
        <div className="hero-container">
          {/* Left Text & CTAs */}
          <div className="hero-content">
            <div className="pill-badge hero-pill animate-pop">
              <Sparkles size={16} color="#D97706" />
              <span>Aplikasi Kebiasaan Islami untuk Anak</span>
              <Sparkles size={16} color="#D97706" />
            </div>

            <h1 className="hero-title">
              Bintangku –<br />
              Kebiasaan Baikku<br />
              <span>Setiap Hari</span>
            </h1>

            <p className="hero-subtitle">
              Bantu anak membangun kebiasaan islami dengan cara yang menyenangkan dan penuh cinta bersama {settings?.schoolName || 'SDIT Bintang Cemerlang'}.
            </p>

            {/* Direct Login Portal CTAs (No 'Unduh Sekarang' or 'Pelajari Lebih Lanjut') */}
            <div className="hero-buttons">
              <button 
                className="btn-primary"
                onClick={() => setCurrentRoute('student_login')}
                style={{ fontSize: '1rem', padding: '14px 28px' }}
              >
                <span>Masuk Portal Siswa (PIN)</span>
                <ArrowRight size={18} />
              </button>

              <button 
                className="btn-outline"
                onClick={() => setCurrentRoute('teacher_login')}
                style={{ fontSize: '1rem', padding: '14px 26px', borderColor: 'var(--primary-700)', color: 'var(--primary-700)' }}
              >
                <LogIn size={18} />
                <span>Panel Guru (PIN)</span>
              </button>
            </div>
          </div>

          {/* Right Hero Visual with 3D Mascot & Live Interactive App Preview */}
          <div className="hero-visual">
            <div className="hero-mascot-wrapper animate-float">
              <MascotStar size={200} waving={true} />
            </div>

            {/* Live Interactive Phone Frame */}
            <div className="hero-phone-mockup">
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 20px 4px',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#1E293B'
              }}>
                <span>9:41</span>
                <span>📶 5G 🔋</span>
              </div>

              {/* Mini App Header */}
              <div style={{ padding: '12px 18px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Star size={18} fill="#F5A623" color="#F5A623" />
                    <strong style={{ fontFamily: 'var(--font-heading)', color: '#8B1120', fontSize: '1.1rem' }}>
                      Bintangku
                    </strong>
                  </div>
                  <div style={{
                    background: '#FFFBEB',
                    border: '1px solid #FDE68A',
                    borderRadius: 999,
                    padding: '4px 10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#B45309'
                  }}>
                    <span>⭐</span>
                    <span>320</span>
                  </div>
                </div>

                <div style={{ marginTop: 12 }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Assalamu'alaikum,</span>
                  <h4 style={{ fontSize: '0.98rem', color: '#1E293B' }}>Anak-Anakku 👋</h4>
                </div>
              </div>

              {/* Red Curved Mini Card with Mascot */}
              <div style={{
                background: 'var(--grad-primary-v)',
                color: '#FFFFFF',
                borderRadius: 20,
                margin: '12px 14px',
                padding: '16px 14px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{ maxWidth: '65%', position: 'relative', zIndex: 2 }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#FDE68A' }}>
                    MasyaAllah! ✨
                  </span>
                  <p style={{ fontSize: '0.72rem', margin: '4px 0 10px', lineHeight: 1.3, opacity: 0.9 }}>
                    Teruslah jaga kebiasaan baikmu hari ini!
                  </p>
                  <div style={{ fontSize: '0.68rem', opacity: 0.85, marginBottom: 4 }}>
                    Progress Hari Ini: {mobileHabitDone ? '4/5' : '3/5'}
                  </div>
                  <div style={{ width: '100%', height: 6, background: 'rgba(255,255,255,0.3)', borderRadius: 999 }}>
                    <div style={{ 
                      width: mobileHabitDone ? '80%' : '60%', 
                      height: '100%', 
                      background: '#F5A623', 
                      borderRadius: 999,
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                </div>

                <div style={{ position: 'absolute', right: -10, bottom: -10, zIndex: 1 }}>
                  <MascotStar size={105} />
                </div>
              </div>

              {/* Interactive Checklist Preview */}
              <div style={{ padding: '0 14px 16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <strong style={{ fontSize: '0.8rem', color: '#1E293B' }}>Kebiasaan Hari Ini</strong>
                  <span style={{ fontSize: '0.7rem', color: '#8B1120', fontWeight: 600 }}>Lihat Semua</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{
                    background: '#FFFFFF',
                    borderRadius: 14,
                    padding: '8px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                  }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#1E293B' }}>🕌 Shalat 5 Waktu</span>
                    <span style={{ fontSize: '0.72rem', color: '#64748B' }}>3/5</span>
                  </div>

                  <div style={{
                    background: '#FFFFFF',
                    borderRadius: 14,
                    padding: '8px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                  }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#1E293B' }}>📖 Baca Al-Qur'an</span>
                    <span style={{ fontSize: '0.72rem', color: '#10B981', fontWeight: 700 }}>✓ Selesai</span>
                  </div>

                  <div 
                    onClick={toggleDemoHabit}
                    style={{
                      background: mobileHabitDone ? '#ECFDF5' : '#FFFFFF',
                      borderRadius: 14,
                      padding: '8px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                      cursor: 'pointer',
                      border: mobileHabitDone ? '1px solid #A7F3D0' : '1px solid transparent',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#1E293B' }}>🌙 Doa Sebelum Tidur</span>
                    <span style={{
                      width: 18,
                      height: 18,
                      borderRadius: '50%',
                      background: mobileHabitDone ? '#10B981' : '#F1F5F9',
                      border: '1.5px solid #CBD5E1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF',
                      fontSize: '0.65rem'
                    }}>
                      {mobileHabitDone && '✓'}
                    </span>
                  </div>
                </div>

                <button 
                  onClick={() => setCurrentRoute('student_login')}
                  style={{
                    width: '100%',
                    marginTop: 14,
                    padding: '10px',
                    borderRadius: 12,
                    background: 'var(--primary-700)',
                    color: '#FFFFFF',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6
                  }}
                >
                  <span>Masuk dengan PIN Santri</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section with Premium Handcrafted SVGs */}
      <section className="landing-features-section" id="fitur">
        <div className="section-header">
          <div className="pill-badge">
            <Sparkles size={16} color="#D97706" />
            <span>Fitur Unggulan</span>
            <Sparkles size={16} color="#D97706" />
          </div>
          <h2>
            Membentuk Kebiasaan Baik<br />
            Jadi <span>Menyenangkan</span>
          </h2>
          <div className="mobile-swipe-badge">
            <span>👉 Geser ke samping untuk fitur lainnya</span>
          </div>
        </div>

        <div className="features-grid">
          {/* Feature 1 */}
          <div className="feature-card">
            <div className="feature-icon-wrapper" style={{ display: 'flex', justifyContent: 'center' }}>
              <MosqueSubuhIcon size={64} />
            </div>
            <h3>Shalat Tepat Waktu</h3>
            <p>
              Belajar shalat tepat waktu dengan pengingat ramah dan hadiah bintang kebaikan setiap selesai menunaikan fardhu.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="feature-card">
            <div className="feature-icon-wrapper" style={{ display: 'flex', justifyContent: 'center' }}>
              <QuranStandIcon size={64} />
            </div>
            <h3>Baca Al-Qur'an</h3>
            <p>
              Catat progres membaca Al-Qur'an dan Iqro setiap hari dengan riang gembira dan kumpulkan pahala bintang bersinar.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="feature-card">
            <div className="feature-icon-wrapper" style={{ display: 'flex', justifyContent: 'center' }}>
              <MoonNightIcon size={64} />
            </div>
            <h3>Doa Sebelum Tidur</h3>
            <p>
              Biasakan doa sebelum tidur dan amalan sunnah untuk tidur yang nyenyak, mimpi indah, dan hati yang senantiasa tenang.
            </p>
          </div>
        </div>
      </section>

      {/* TENTANG SECTION (Dinamis dari Pengaturan Guru) */}
      <section className="landing-features-section" id="tentang" style={{ background: '#FFFDF9', borderTop: '1px solid #F1EAE0' }}>
        <div className="section-header">
          <div className="pill-badge">
            <School size={16} color="#D97706" />
            <span>Tentang {settings?.schoolName || 'Bintangku'}</span>
            <School size={16} color="#D97706" />
          </div>
          <h2>
            Mendidik Karakter & Ibadah<br />
            <span>Dengan Penuh Cinta</span>
          </h2>
          <div className="mobile-swipe-badge">
            <span>👉 Geser untuk info pendidik</span>
          </div>
        </div>

        <div style={{ maxWidth: 980, margin: '0 auto', padding: '0 24px' }}>
          <div className="tentang-cards-row">
            <div className="tentang-panel-item" style={{
              background: '#FFFFFF',
              borderRadius: 24,
              padding: '36px 30px',
              boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
              border: '1px solid #F1ECE4'
            }}>
              <h3 style={{ fontSize: '1.4rem', color: '#1E293B', marginBottom: 14 }}>
                {settings?.schoolName || 'SDIT Bintang Cemerlang'}
              </h3>
              <p style={{ fontSize: '1rem', color: '#475569', lineHeight: 1.7, marginBottom: 18 }}>
                {settings?.aboutText || 'Platform pembiasaan karakter & ibadah islami terpadu untuk membentuk generasi anak yang shalih, mandiri, dan berakhlakul karimah.'}
              </p>
              {settings?.aboutVision && (
                <div style={{
                  background: '#FFFBEB',
                  borderLeft: '4px solid #F5A623',
                  padding: '12px 18px',
                  borderRadius: '0 12px 12px 0',
                  fontSize: '0.9rem',
                  color: '#92400E',
                  fontWeight: 500
                }}>
                  <strong>Visi Kami: </strong>{settings.aboutVision}
                </div>
              )}
            </div>

            <div className="tentang-panel-item" style={{
              background: 'var(--primary-50)',
              border: '1px solid rgba(181, 26, 44, 0.15)',
              borderRadius: 24,
              padding: '36px 24px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '3.2rem', marginBottom: 6 }}>
                {settings?.teacherAvatar || '🧕🏻'}
              </div>
              <strong style={{ fontSize: '1.15rem', color: '#1E293B', display: 'block' }}>
                {settings?.teacherName || 'Ustadzah Desiana S.Pd.I'}
              </strong>
              <span style={{ fontSize: '0.85rem', color: 'var(--primary-700)', fontWeight: 600 }}>
                {settings?.teacherTitle || 'Wali Kelas 1A & 2A'}
              </span>
              <p style={{ fontSize: '0.78rem', color: '#64748B', marginTop: 8 }}>
                {settings?.schoolAddress || 'Kebayoran Baru, Jakarta Selatan'}
              </p>
              <button 
                onClick={() => setCurrentRoute('teacher_login')}
                className="btn-outline" 
                style={{ marginTop: 14, fontSize: '0.82rem', padding: '8px 16px', width: '100%' }}
              >
                Kunjungi Panel Guru
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Wave Section (Dynamically Loaded from AppContext) */}
      <section className="landing-testimonials-section" id="testimoni">
        <div className="testimonials-container">
          <div className="testimonials-header">
            <div className="pill-badge" style={{ background: 'rgba(255, 255, 255, 0.2)', color: '#FFFFFF', borderColor: 'rgba(255, 255, 255, 0.4)' }}>
              <Sparkles size={16} />
              <span>Testimoni Orang Tua</span>
              <Sparkles size={16} />
            </div>
            <h2>Dipercaya Ribuan Orang Tua</h2>
            <p>Berikut cerita nyata dari para orang tua hebat yang mendampingi buah hatinya</p>
            <div className="mobile-swipe-badge" style={{ background: 'rgba(255,255,255,0.2)', color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.3)' }}>
              <span>👉 Geser ke samping untuk testimoni lainnya</span>
            </div>
          </div>

          <div className="testimonials-grid">
            {(testimonials || []).map((t) => (
              <div key={t.id} className="testimonial-card">
                <p className="testimonial-quote">
                  “{t.quote}”
                </p>
                <div className="testimonial-author">
                  <div className="author-info">
                    <div className="author-avatar" style={{ overflow: 'hidden' }}>
                      {t.photoUrl ? (
                        <img 
                          src={t.photoUrl} 
                          alt={t.name} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                      ) : (
                        <span>{t.avatar || '🧕🏻'}</span>
                      )}
                    </div>
                    <div>
                      <div className="author-name">{t.name}</div>
                      <div className="author-city">{t.city}</div>
                    </div>
                  </div>
                  <div className="author-stars">
                    {'★'.repeat(t.rating || 5)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* KONTAK SECTION (Dinamis dari Pengaturan Guru) */}
      <section className="landing-features-section" id="kontak" style={{ background: '#FAF7F2' }}>
        <div className="section-header">
          <div className="pill-badge">
            <MessageCircle size={16} color="#D97706" />
            <span>Hubungi Kami</span>
            <MessageCircle size={16} color="#D97706" />
          </div>
          <h2>
            Pusat Informasi & <span>Layanan</span>
          </h2>
          <p style={{ color: '#64748B', marginTop: 6, fontSize: '0.95rem' }}>
            Ada pertanyaan atau ingin bermitra dengan {settings?.schoolName || 'Bintangku'}? Tim kami siap melayani ananda dan orang tua.
          </p>
          <div className="mobile-swipe-badge">
            <span>👉 Geser untuk kontak lainnya</span>
          </div>
        </div>

        <div style={{ maxWidth: 1040, margin: '0 auto', padding: '0 24px' }}>
          <div className="contact-cards-grid">
            {/* WhatsApp Card with direct wa.me link */}
            <a 
              href={`https://wa.me/${cleanWaNumber}?text=Assalamu%27alaikum%20Ustadzah%2C%20saya%20ingin%20bertanya%20tentang%20aplikasi%20Bintangku`}
              target="_blank" 
              rel="noreferrer"
              className="contact-card-item"
              style={{
                background: '#FFFFFF',
                borderRadius: 20,
                padding: '24px 20px',
                border: '1px solid #A7F3D0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.08)',
                transition: 'transform 0.2s ease',
                textDecoration: 'none'
              }}
            >
              <div style={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                background: '#ECFDF5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 12
              }}>
                <MessageCircle size={26} />
              </div>
              <strong style={{ fontSize: '1rem', color: '#1E293B', marginBottom: 4 }}>WhatsApp Resmi</strong>
              <span style={{ fontSize: '0.9rem', color: '#059669', fontWeight: 700 }}>
                {settings?.contactWhatsApp || '+62 812-3456-7890'}
              </span>
              <span style={{ fontSize: '0.75rem', color: '#64748B', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                Klik untuk chat langsung <ExternalLink size={12} />
              </span>
            </a>

            {/* Telepon Card */}
            <div 
              className="contact-card-item"
              style={{
                background: '#FFFFFF',
                borderRadius: 20,
                padding: '24px 20px',
                border: '1px solid #E2E8F0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                boxShadow: '0 4px 14px rgba(0,0,0,0.03)'
              }}
            >
              <div style={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                background: '#FEF3C7',
                color: '#D97706',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 12
              }}>
                <Phone size={26} />
              </div>
              <strong style={{ fontSize: '1rem', color: '#1E293B', marginBottom: 4 }}>Telepon Sekolah</strong>
              <span style={{ fontSize: '0.9rem', color: '#1E293B', fontWeight: 600 }}>
                {settings?.contactPhone || '(021) 7890-1234'}
              </span>
              <span style={{ fontSize: '0.75rem', color: '#64748B', marginTop: 4 }}>
                Senin – Jumat (07.30 – 16.00 WIB)
              </span>
            </div>

            {/* Email Card */}
            <a 
              href={`mailto:${settings?.contactEmail || 'salam@bintangku.id'}`}
              className="contact-card-item"
              style={{
                background: '#FFFFFF',
                borderRadius: 20,
                padding: '24px 20px',
                border: '1px solid #E2E8F0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
                textDecoration: 'none'
              }}
            >
              <div style={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                background: '#EFF6FF',
                color: '#2563EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 12
              }}>
                <Mail size={26} />
              </div>
              <strong style={{ fontSize: '1rem', color: '#1E293B', marginBottom: 4 }}>Email Resmi</strong>
              <span style={{ fontSize: '0.9rem', color: '#2563EB', fontWeight: 600 }}>
                {settings?.contactEmail || 'salam@bintangku.id'}
              </span>
              <span style={{ fontSize: '0.75rem', color: '#64748B', marginTop: 4 }}>
                Kirim pesan tertulis
              </span>
            </a>

            {/* Alamat Card */}
            <div 
              className="contact-card-item"
              style={{
                background: '#FFFFFF',
                borderRadius: 20,
                padding: '24px 20px',
                border: '1px solid #E2E8F0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                boxShadow: '0 4px 14px rgba(0,0,0,0.03)'
              }}
            >
              <div style={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                background: '#FEE2E2',
                color: '#DC2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 12
              }}>
                <MapPin size={26} />
              </div>
              <strong style={{ fontSize: '1rem', color: '#1E293B', marginBottom: 4 }}>Lokasi Kantor</strong>
              <p style={{ fontSize: '0.78rem', color: '#64748B', lineHeight: 1.4 }}>
                {settings?.contactAddress || 'Gedung Graha Bintang Cemerlang, Lt. 2, Jakarta Selatan'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - No Blog, Copyright Desiana */}
      <footer className="landing-footer">
        <div className="footer-container">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <MascotStar size={36} />
            <strong style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: '#FFFFFF' }}>
              Bintangku
            </strong>
          </div>
          <p style={{ maxWidth: 500, fontSize: '0.9rem', lineHeight: 1.6 }}>
            Platform pembiasaan ibadah dan akhlak mulia anak islami terpadu untuk keluarga dan sekolah.
          </p>
          <div className="footer-nav-links">
            <a href="#beranda">Beranda</a>
            <a href="#fitur">Fitur</a>
            <a href="#tentang">Tentang</a>
            <a href="#testimoni">Testimoni</a>
            <a href="#kontak">Kontak</a>
            <button onClick={() => setCurrentRoute('teacher_login')} className="footer-portal-btn">
              Portal Guru & Sekolah
            </button>
          </div>
          <div className="footer-copyright">
            © 2026 Desiana. Seluruh Hak Cipta Dilindungi.
          </div>
        </div>
      </footer>
    </div>
  );
}
