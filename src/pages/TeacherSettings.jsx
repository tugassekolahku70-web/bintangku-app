import React, { useState, useRef } from 'react';
import TeacherSidebar from '../components/TeacherSidebar';
import { useApp } from '../context/AppContext';
import { 
  User, 
  School, 
  Phone, 
  Mail, 
  MapPin, 
  MessageSquare, 
  Plus, 
  Trash2, 
  Edit, 
  Save, 
  Database, 
  Award, 
  CheckCircle2, 
  CalendarCheck,
  RefreshCw,
  Download,
  KeyRound,
  MessageCircle,
  Camera,
  Upload,
  Star,
  Menu
} from 'lucide-react';
import { triggerStarConfetti } from '../components/StarConfetti';
import { compressImageFile } from '../lib/imageUtils';

export default function TeacherSettings({ currentRoute, setCurrentRoute }) {
  const { 
    settings, 
    updateSettings, 
    classes, 
    addClass, 
    removeClass, 
    habits, 
    addHabit, 
    removeHabit, 
    testimonials,
    addTestimonial,
    editTestimonial,
    removeTestimonial,
    requestTeacherOtp,
    updateTeacherPinWithOtp,
    isSupabaseActive,
    handleResetData,
    exportDataBackup
  } = useApp();

  const [activeTab, setActiveTab] = useState('profile');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({ ...settings });
  const [savedNotice, setSavedNotice] = useState(false);
  const teacherPhotoInputRef = useRef(null);

  const handleTeacherPhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImageFile(file, 256, 256, 0.85);
      setFormData(prev => ({ ...prev, teacherPhotoUrl: compressed }));
      triggerStarConfetti();
    } catch (err) {
      alert(err.message || 'Gagal memproses foto.');
    }
  };

  // Security & PIN Change State
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [generatedOtpDisplay, setGeneratedOtpDisplay] = useState('');
  const [newTeacherPinInput, setNewTeacherPinInput] = useState('');
  const [pinChangeError, setPinChangeError] = useState('');
  const [pinChangeSuccess, setPinChangeSuccess] = useState(false);

  // Testimonial Modal State
  const [showTestimonialModal, setShowTestimonialModal] = useState(false);
  const [editingTestiId, setEditingTestiId] = useState(null);
  const [testiName, setTestiName] = useState('');
  const [testiCity, setTestiCity] = useState('');
  const [testiQuote, setTestiQuote] = useState('');
  const [testiAvatar, setTestiAvatar] = useState('🧕🏻');
  const [testiPhotoUrl, setTestiPhotoUrl] = useState('');
  const [testiRating, setTestiRating] = useState(5);
  const testiPhotoInputRef = useRef(null);

  const handleTestiPhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImageFile(file, 256, 256, 0.85);
      setTestiPhotoUrl(compressed);
      triggerStarConfetti();
    } catch (err) {
      alert(err.message || 'Gagal memproses foto.');
    }
  };

  const handleOpenAddTestimonial = () => {
    setEditingTestiId(null);
    setTestiName('');
    setTestiCity('');
    setTestiQuote('');
    setTestiAvatar('🧕🏻');
    setTestiPhotoUrl('');
    setTestiRating(5);
    setShowTestimonialModal(true);
  };

  const handleOpenEditTestimonial = (t) => {
    setEditingTestiId(t.id);
    setTestiName(t.name);
    setTestiCity(t.city || '');
    setTestiQuote(t.quote);
    setTestiAvatar(t.avatar || '🧕🏻');
    setTestiPhotoUrl(t.photoUrl || '');
    setTestiRating(t.rating || 5);
    setShowTestimonialModal(true);
  };

  React.useEffect(() => {
    if (settings) {
      setFormData({ ...settings });
    }
  }, [settings]);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateSettings(formData);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const handleRequestPinChangeOtp = () => {
    const res = requestTeacherOtp(formData.teacherEmail || 'desiana@bintangku.id');
    setGeneratedOtpDisplay(res.otp);
    setOtpCode('');
    setNewTeacherPinInput('');
    setPinChangeError('');
    setShowOtpModal(true);
  };

  const handleConfirmPinChangeOtp = async (e) => {
    e.preventDefault();
    if (!newTeacherPinInput || newTeacherPinInput.length < 4) {
      setPinChangeError('PIN baru harus 4 digit angka!');
      return;
    }

    const res = await updateTeacherPinWithOtp(otpCode, newTeacherPinInput);
    if (res.success) {
      setShowOtpModal(false);
      setPinChangeSuccess(true);
      setTimeout(() => setPinChangeSuccess(false), 4000);
    } else {
      setPinChangeError(res.message);
    }
  };

  const handleAddTestimonialSubmit = (e) => {
    e.preventDefault();
    if (!testiName.trim() || !testiQuote.trim()) return;

    if (editingTestiId) {
      editTestimonial(editingTestiId, {
        name: testiName,
        city: testiCity || 'Indonesia',
        avatar: testiAvatar,
        photoUrl: testiPhotoUrl || '',
        quote: testiQuote,
        rating: Number(testiRating)
      });
    } else {
      addTestimonial({
        id: `t-${Date.now()}`,
        name: testiName,
        city: testiCity || 'Indonesia',
        avatar: testiAvatar,
        photoUrl: testiPhotoUrl || '',
        quote: testiQuote,
        rating: Number(testiRating)
      });
    }

    setTestiName('');
    setTestiCity('');
    setTestiQuote('');
    setTestiPhotoUrl('');
    setEditingTestiId(null);
    setShowTestimonialModal(false);
  };

  return (
    <div className="teacher-container">
      <TeacherSidebar 
        currentRoute="teacher_settings" 
        setCurrentRoute={setCurrentRoute} 
        isOpenMobile={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      <main className="teacher-main-layout">
        {/* Top Header */}
        <div className="teacher-top-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button 
              className="btn-mobile-burger"
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            >
              <Menu size={22} />
            </button>
            <div>
              <h1 className="teacher-welcome-title">Pengaturan Sistem & Sekolah</h1>
              <p className="teacher-welcome-subtitle">
                Kelola profil guru, keamanan PIN, data sekolah, testimoni, dan sinkronisasi database
              </p>
            </div>
          </div>

          {savedNotice && (
            <div className="pill-badge animate-pop" style={{ background: '#ECFDF5', color: '#059669', borderColor: '#A7F3D0' }}>
              <CheckCircle2 size={16} />
              <span>Pengaturan berhasil disimpan!</span>
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="settings-tabs-container">
          <button 
            className={`settings-tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={18} />
            <span>Profil Guru & Sekolah</span>
          </button>

          <button 
            className={`settings-tab-btn ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            <KeyRound size={18} />
            <span>Keamanan & PIN Guru (OTP)</span>
          </button>

          <button 
            className={`settings-tab-btn ${activeTab === 'landing_info' ? 'active' : ''}`}
            onClick={() => setActiveTab('landing_info')}
          >
            <Phone size={18} />
            <span>Tentang & Kontak</span>
          </button>

          <button 
            className={`settings-tab-btn ${activeTab === 'testimonials' ? 'active' : ''}`}
            onClick={() => setActiveTab('testimonials')}
          >
            <MessageSquare size={18} />
            <span>Kelola Testimoni ({testimonials.length})</span>
          </button>

          <button 
            className={`settings-tab-btn ${activeTab === 'database' ? 'active' : ''}`}
            onClick={() => setActiveTab('database')}
          >
            <Database size={18} />
            <span>Database & Sync</span>
          </button>
        </div>

        {/* TAB 1: PROFIL GURU & SEKOLAH */}
        {activeTab === 'profile' && (
          <div className="teacher-table-card animate-pop">
            <h3 style={{ marginBottom: 6 }}>Identitas Pendidik & Sekolah</h3>
            <p style={{ fontSize: '0.88rem', color: '#64748B', marginBottom: 24 }}>
              Informasi ini akan muncul pada kop laporan resmi, sertifikat santri, dan header dashboard.
            </p>

            <form onSubmit={handleSaveProfile} className="settings-form-grid">
              <div className="form-group">
                <label>Nama Ustadzah / Guru Pengampu</label>
                <input 
                  type="text" 
                  value={formData.teacherName || ''} 
                  onChange={(e) => setFormData({ ...formData, teacherName: e.target.value })}
                  placeholder="Contoh: Ustadzah Desiana S.Pd.I"
                  required
                />
              </div>

              <div className="form-group">
                <label>Jabatan / Wali Kelas</label>
                <input 
                  type="text" 
                  value={formData.teacherTitle || ''} 
                  onChange={(e) => setFormData({ ...formData, teacherTitle: e.target.value })}
                  placeholder="Contoh: Wali Kelas 1A & 2A"
                  required
                />
              </div>

              <div className="form-group">
                <label>Nama Sekolah / Lembaga TPQ</label>
                <input 
                  type="text" 
                  value={formData.schoolName || ''} 
                  onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                  placeholder="Contoh: SDIT Bintang Cemerlang"
                  required
                />
              </div>

              <div className="form-group">
                <label>Pilihan Avatar / Karakter</label>
                <select
                  value={formData.teacherAvatar || '🧕🏻'}
                  onChange={(e) => setFormData({ ...formData, teacherAvatar: e.target.value })}
                >
                  <option value="🧕🏻">🧕🏻 Ustadzah (Muslimah)</option>
                  <option value="🧕🏼">🧕🏼 Ustadzah (Cokelat)</option>
                  <option value="🧔🏻">🧔🏻 Ustadz (Muslim)</option>
                  <option value="👨🏻‍🏫">👨🏻‍🏫 Guru</option>
                  <option value="⭐">⭐ Bintangku</option>
                </select>
              </div>

              {/* Foto Profil dari Perangkat */}
              <div className="form-group full-width" style={{
                background: '#FAF8F5',
                borderRadius: 18,
                padding: '16px 20px',
                border: '1.5px dashed #CBD5E1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 16
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    background: '#FFFFFF',
                    border: '2px solid var(--primary-700)',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2.4rem',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.08)'
                  }}>
                    {formData.teacherPhotoUrl ? (
                      <img src={formData.teacherPhotoUrl} alt="Foto Pendidik" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span>{formData.teacherAvatar || '🧕🏻'}</span>
                    )}
                  </div>

                  <div>
                    <strong style={{ fontSize: '0.92rem', color: '#1E293B', display: 'block' }}>
                      Foto Profil Pendidik
                    </strong>
                    <span style={{ fontSize: '0.78rem', color: '#64748B' }}>
                      {formData.teacherPhotoUrl ? 'Foto kustom dari perangkat aktif' : 'Menggunakan avatar emoji'}
                    </span>
                    {formData.teacherPhotoUrl && (
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, teacherPhotoUrl: '' }))}
                        style={{ display: 'block', marginTop: 4, background: 'none', border: 'none', color: '#DC2626', fontSize: '0.74rem', cursor: 'pointer', fontWeight: 600, padding: 0 }}
                      >
                        Hapus Foto (Kembali ke Karakter)
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <input 
                    type="file" 
                    ref={teacherPhotoInputRef}
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleTeacherPhotoUpload}
                  />
                  <button
                    type="button"
                    className="btn-outline"
                    onClick={() => teacherPhotoInputRef.current?.click()}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 16px', fontSize: '0.84rem' }}
                  >
                    <Upload size={16} />
                    <span>Unggah Foto dari Device</span>
                  </button>
                </div>
              </div>

              <div className="form-group full-width">
                <label>Alamat Sekolah</label>
                <textarea 
                  rows={3}
                  value={formData.schoolAddress || ''} 
                  onChange={(e) => setFormData({ ...formData, schoolAddress: e.target.value })}
                  placeholder="Alamat lengkap instansi sekolah..."
                />
              </div>

              <div className="form-action-row full-width">
                <button type="submit" className="btn-primary" style={{ padding: '12px 28px' }}>
                  <Save size={18} />
                  <span>Simpan Perubahan Profil</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 2: KEAMANAN & PIN GURU (OTP) */}
        {activeTab === 'security' && (
          <div className="teacher-table-card animate-pop">
            <h3 style={{ marginBottom: 6 }}>Keamanan & Kode PIN Guru</h3>
            <p style={{ fontSize: '0.88rem', color: '#64748B', marginBottom: 24 }}>
              Untuk menjaga privasi dan keamanan akun, penggantian PIN Guru wajib diverifikasi dengan kode OTP yang dikirim ke email terdaftar.
            </p>

            <div style={{
              background: '#FAF8F5',
              borderRadius: 20,
              padding: 24,
              border: '1px solid #F1ECE4',
              maxWidth: 550,
              marginBottom: 20
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <div>
                  <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Email Terdaftar:</span>
                  <strong style={{ display: 'block', fontSize: '1rem', color: '#1E293B' }}>
                    {formData.teacherEmail || 'desiana@bintangku.id'}
                  </strong>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Kode PIN Saat Ini:</span>
                  <div style={{
                    fontSize: '1.2rem',
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    letterSpacing: 4,
                    color: 'var(--primary-700)'
                  }}>
                    {formData.teacherPin || '1234'}
                  </div>
                </div>
              </div>

              {pinChangeSuccess && (
                <div style={{
                  background: '#ECFDF5',
                  border: '1px solid #A7F3D0',
                  color: '#059669',
                  borderRadius: 12,
                  padding: '10px 14px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  marginBottom: 16
                }}>
                  ✓ Kode PIN Guru berhasil diperbarui dengan aman!
                </div>
              )}

              <button
                type="button"
                className="btn-gold"
                onClick={handleRequestPinChangeOtp}
                style={{ width: '100%', padding: '12px' }}
              >
                <KeyRound size={18} />
                <span>Minta Kode OTP & Ganti PIN Guru</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: TENTANG & KONTAK (HALAMAN DEPAN) */}
        {activeTab === 'landing_info' && (
          <div className="teacher-table-card animate-pop">
            <h3 style={{ marginBottom: 6 }}>Informasi Kontak & Tentang (Landing Page)</h3>
            <p style={{ fontSize: '0.88rem', color: '#64748B', marginBottom: 24 }}>
              Data di bawah ini langsung terhubung secara dinamis ke bagian "Tentang" dan "Kontak" pada halaman depan website.
            </p>

            <form onSubmit={handleSaveProfile} className="settings-form-grid">
              <div className="form-group full-width">
                <label>Deskripsi Tentang Bintangku / Sekolah</label>
                <textarea 
                  rows={4}
                  value={formData.aboutText || ''} 
                  onChange={(e) => setFormData({ ...formData, aboutText: e.target.value })}
                  placeholder="Tuliskan tentang filosofi pendidikan islami di sekolah..."
                  required
                />
              </div>

              <div className="form-group full-width">
                <label>Visi & Komitmen Pendidikan</label>
                <textarea 
                  rows={2}
                  value={formData.aboutVision || ''} 
                  onChange={(e) => setFormData({ ...formData, aboutVision: e.target.value })}
                  placeholder="Visi pembiasaan ibadah..."
                />
              </div>

              <div className="form-group">
                <label>Nomor WhatsApp Resmi (Bisa diklik santri/ortu)</label>
                <input 
                  type="text" 
                  value={formData.contactWhatsApp || ''} 
                  onChange={(e) => setFormData({ ...formData, contactWhatsApp: e.target.value })}
                  placeholder="+62 812-3456-7890"
                  required
                />
              </div>

              <div className="form-group">
                <label>Nomor Telepon Kantor</label>
                <input 
                  type="text" 
                  value={formData.contactPhone || ''} 
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  placeholder="(021) 7890-1234"
                />
              </div>

              <div className="form-group">
                <label>Email Layanan / Bantuan</label>
                <input 
                  type="email" 
                  value={formData.contactEmail || ''} 
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  placeholder="salam@bintangku.id"
                  required
                />
              </div>

              <div className="form-group">
                <label>Alamat Kantor / Gedung</label>
                <input 
                  type="text" 
                  value={formData.contactAddress || ''} 
                  onChange={(e) => setFormData({ ...formData, contactAddress: e.target.value })}
                  placeholder="Gedung Graha Bintang Cemerlang, Lt. 2..."
                />
              </div>

              <div className="form-action-row full-width">
                <button type="submit" className="btn-primary" style={{ padding: '12px 28px' }}>
                  <Save size={18} />
                  <span>Perbarui Info Halaman Depan</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 4: MANAJEMEN TESTIMONI (NEW) */}
        {activeTab === 'testimonials' && (
          <div className="teacher-table-card animate-pop">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h3>Kelola Testimoni Orang Tua</h3>
                <p style={{ fontSize: '0.88rem', color: '#64748B' }}>
                  Atur testimoni yang ditampilkan pada bagian gelombang merah halaman depan
                </p>
              </div>

              <button 
                className="btn-primary"
                onClick={handleOpenAddTestimonial}
              >
                <Plus size={16} />
                <span>Tambah Testimoni</span>
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
              {testimonials.map((t) => (
                <div 
                  key={t.id}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: 18,
                    padding: 20,
                    border: '1px solid #F1ECE4',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 44,
                          height: 44,
                          borderRadius: '50%',
                          background: '#FEF3C7',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.6rem',
                          overflow: 'hidden',
                          flexShrink: 0,
                          border: '1.5px solid #FDE68A'
                        }}>
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
                          <strong style={{ fontSize: '0.98rem', color: '#1E293B', display: 'block' }}>{t.name}</strong>
                          <span style={{ fontSize: '0.78rem', color: '#64748B' }}>{t.city}</span>
                        </div>
                      </div>

                      <div style={{ color: '#F59E0B', fontSize: '0.9rem' }}>
                        {'★'.repeat(t.rating || 5)}
                      </div>
                    </div>

                    <p style={{ fontSize: '0.85rem', color: '#475569', fontStyle: 'italic', lineHeight: 1.5, marginBottom: 14 }}>
                      “{t.quote}”
                    </p>
                  </div>

                  <div style={{ borderTop: '1px solid #F8FAFC', paddingTop: 10, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                    <button
                      onClick={() => handleOpenEditTestimonial(t)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        color: 'var(--primary-700)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        padding: '4px 8px',
                        borderRadius: 8
                      }}
                      title="Edit Foto Profil & Testimoni"
                    >
                      <Edit size={15} />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Yakin ingin menghapus testimoni dari ${t.name}?`)) {
                          removeTestimonial(t.id);
                        }
                      }}
                      style={{ color: '#DC2626', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px' }}
                      title="Hapus Testimoni"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: DATABASE & SYNC */}
        {activeTab === 'database' && (
          <div className="teacher-table-card animate-pop">
            <h3 style={{ marginBottom: 6 }}>Koneksi Backend & Sinkronisasi Database</h3>
            <p style={{ fontSize: '0.88rem', color: '#64748B', marginBottom: 24 }}>
              Status integrasi cloud Supabase PostgreSQL dan alat pencadangan data
            </p>

            <div style={{
              background: isSupabaseActive ? '#ECFDF5' : '#FFFBEB',
              border: `1.5px solid ${isSupabaseActive ? '#A7F3D0' : '#FDE68A'}`,
              borderRadius: 20,
              padding: '20px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 28
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  background: isSupabaseActive ? '#059669' : '#D97706',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Database size={24} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.05rem', color: isSupabaseActive ? '#065F46' : '#92400E' }}>
                    {isSupabaseActive ? '🟢 Terhubung ke Supabase Cloud (Online Sync)' : '🟡 Mode Penyimpanan Lokal (Offline Ready)'}
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: isSupabaseActive ? '#047857' : '#B45309', marginTop: 2 }}>
                    {isSupabaseActive 
                      ? 'Seluruh data otomatis disinkronkan langsung ke database PostgreSQL Supabase Anda.' 
                      : 'Data Anda saat ini tersimpan aman di browser (localStorage). Untuk menghubungkan ke Supabase, isi kredensial di file .env.local'}
                  </p>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div style={{ background: '#FAF7F2', borderRadius: 16, padding: 20, border: '1px solid #E2E8F0' }}>
                <h4 style={{ fontSize: '0.98rem', marginBottom: 6 }}>💾 Ekspor Cadangan Data (JSON)</h4>
                <p style={{ fontSize: '0.82rem', color: '#64748B', marginBottom: 16 }}>
                  Unduh seluruh data pengaturan, siswa, kebiasaan, kelas, dan testimoni dalam format JSON.
                </p>
                <button 
                  onClick={exportDataBackup} 
                  className="btn-outline" 
                  style={{ width: '100%', padding: '10px' }}
                >
                  <Download size={16} />
                  <span>Download Backup JSON</span>
                </button>
              </div>

              <div style={{ background: '#FAF7F2', borderRadius: 16, padding: 20, border: '1px solid #E2E8F0' }}>
                <h4 style={{ fontSize: '0.98rem', marginBottom: 6, color: '#DC2626' }}>🔄 Reset Data ke Bawaan Mockup</h4>
                <p style={{ fontSize: '0.82rem', color: '#64748B', marginBottom: 16 }}>
                  Kembalikan seluruh data profil, siswa, dan kebiasaan ke setting awal sesuai 7 mockup desain.
                </p>
                <button 
                  onClick={() => {
                    if (confirm('Apakah Anda yakin ingin mereset seluruh data kembali ke bawaan awal?')) {
                      handleResetData();
                    }
                  }} 
                  className="btn-outline" 
                  style={{ width: '100%', padding: '10px', color: '#DC2626', borderColor: '#FCA5A5' }}
                >
                  <RefreshCw size={16} />
                  <span>Reset Data Bawaan</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL: OTP VERIFIKASI GANTI PIN GURU */}
      {showOtpModal && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 5000,
            padding: 20
          }}
          onClick={() => setShowOtpModal(false)}
        >
          <div 
            style={{
              background: '#FFFFFF',
              borderRadius: 24,
              padding: '32px 28px',
              width: '100%',
              maxWidth: 400,
              textAlign: 'center'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: '#FEF3C7',
              color: '#D97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 14px'
            }}>
              <KeyRound size={28} />
            </div>

            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', color: '#1E293B', marginBottom: 6 }}>
              Verifikasi OTP Ganti PIN
            </h3>
            
            <p style={{ fontSize: '0.85rem', color: '#64748B', lineHeight: 1.5, marginBottom: 14 }}>
              Kode OTP telah dikirimkan ke <strong>{formData.teacherEmail || 'desiana@bintangku.id'}</strong>
            </p>

            <div style={{
              background: '#EFF6FF',
              border: '1px solid #BFDBFE',
              borderRadius: 12,
              padding: '10px 14px',
              marginBottom: 18,
              fontSize: '0.82rem',
              color: '#1D4ED8',
              fontWeight: 600
            }}>
              📩 Simulasi Kode OTP: <span style={{ fontSize: '1.1rem', letterSpacing: 3, color: 'var(--primary-700)' }}>{generatedOtpDisplay || '7890'}</span>
            </div>

            <form onSubmit={handleConfirmPinChangeOtp}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: 4 }}>
                  Masukkan Kode OTP (4 Digit)
                </label>
                <input 
                  type="text"
                  maxLength={4}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="----"
                  required
                  style={{
                    width: 140,
                    padding: '8px',
                    fontSize: '1.4rem',
                    textAlign: 'center',
                    letterSpacing: 6,
                    fontWeight: 700,
                    borderRadius: 12,
                    border: '2px solid #CBD5E1',
                    outline: 'none',
                    margin: '0 auto'
                  }}
                />
              </div>

              <div style={{ marginBottom: 18 }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: 4 }}>
                  PIN Guru 4-Digit Baru
                </label>
                <input 
                  type="password"
                  maxLength={4}
                  value={newTeacherPinInput}
                  onChange={(e) => setNewTeacherPinInput(e.target.value)}
                  placeholder="Contoh: 5678"
                  required
                  style={{
                    width: 140,
                    padding: '8px',
                    fontSize: '1.4rem',
                    textAlign: 'center',
                    letterSpacing: 6,
                    fontWeight: 700,
                    borderRadius: 12,
                    border: '2px solid var(--primary-700)',
                    outline: 'none',
                    margin: '0 auto'
                  }}
                />
              </div>

              {pinChangeError && (
                <div style={{ color: '#DC2626', fontSize: '0.82rem', marginBottom: 12, fontWeight: 600 }}>
                  {pinChangeError}
                </div>
              )}

              <div style={{ display: 'flex', gap: 10 }}>
                <button 
                  type="button" 
                  className="btn-outline" 
                  style={{ flex: 1, padding: 10 }}
                  onClick={() => setShowOtpModal(false)}
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="btn-primary" 
                  style={{ flex: 1, padding: 10 }}
                >
                  Simpan PIN Baru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: TAMBAH TESTIMONI BARU */}
      {showTestimonialModal && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 5000,
            padding: 20
          }}
          onClick={() => setShowTestimonialModal(false)}
        >
          <div 
            style={{
              background: '#FFFFFF',
              borderRadius: 24,
              padding: 28,
              width: '100%',
              maxWidth: 420
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary-700)', marginBottom: 16 }}>
              {editingTestiId ? 'Edit Testimoni Orang Tua' : 'Tambah Testimoni Orang Tua'}
            </h3>

            <form onSubmit={handleAddTestimonialSubmit}>
              {/* Foto Profil Wali Santri */}
              <div style={{
                background: '#FAF8F5',
                borderRadius: 16,
                padding: '12px 16px',
                border: '1.5px dashed #CBD5E1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 14,
                gap: 12
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 52,
                    height: 52,
                    borderRadius: '50%',
                    background: '#FFFFFF',
                    border: '2px solid var(--primary-700)',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    flexShrink: 0
                  }}>
                    {testiPhotoUrl ? (
                      <img src={testiPhotoUrl} alt="Foto Testimoni" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span>{testiAvatar || '🧕🏻'}</span>
                    )}
                  </div>
                  <div>
                    <strong style={{ fontSize: '0.86rem', color: '#1E293B', display: 'block' }}>
                      Foto Profil
                    </strong>
                    <span style={{ fontSize: '0.74rem', color: '#64748B' }}>
                      {testiPhotoUrl ? 'Foto kustom aktif' : 'Gunakan foto asli orang tua'}
                    </span>
                    {testiPhotoUrl && (
                      <button
                        type="button"
                        onClick={() => setTestiPhotoUrl('')}
                        style={{ display: 'block', marginTop: 2, background: 'none', border: 'none', color: '#DC2626', fontSize: '0.72rem', cursor: 'pointer', fontWeight: 600, padding: 0 }}
                      >
                        Hapus Foto (Gunakan Avatar)
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <input 
                    type="file" 
                    ref={testiPhotoInputRef}
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleTestiPhotoUpload}
                  />
                  <button
                    type="button"
                    className="btn-outline"
                    onClick={() => testiPhotoInputRef.current?.click()}
                    style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '8px 12px', fontSize: '0.78rem' }}
                  >
                    <Upload size={14} />
                    <span>{testiPhotoUrl ? 'Ganti' : 'Unggah'}</span>
                  </button>
                </div>
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: 4 }}>
                  Nama Wali Santri / Penutur
                </label>
                <input 
                  type="text"
                  placeholder="Contoh: Bunda Fatimah"
                  value={testiName}
                  onChange={(e) => setTestiName(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 12, border: '1.5px solid #CBD5E1' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: 4 }}>
                    Kota / Asal
                  </label>
                  <input 
                    type="text"
                    placeholder="Contoh: Jakarta"
                    value={testiCity}
                    onChange={(e) => setTestiCity(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: 12, border: '1.5px solid #CBD5E1' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: 4 }}>
                    Pilihan Avatar Emoji (Cadangan)
                  </label>
                  <select
                    value={testiAvatar}
                    onChange={(e) => setTestiAvatar(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: 12, border: '1.5px solid #CBD5E1' }}
                  >
                    <option value="🧕🏻">🧕🏻 Bunda Pink</option>
                    <option value="🧕🏼">🧕🏼 Bunda Cokelat</option>
                    <option value="🧔🏻">🧔🏻 Ayah Muslim</option>
                    <option value="👨🏽">👨🏽 Ayah</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: 4 }}>
                  Rating Bintang
                </label>
                <select
                  value={testiRating}
                  onChange={(e) => setTestiRating(Number(e.target.value))}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 12, border: '1.5px solid #CBD5E1' }}
                >
                  <option value={5}>★★★★★ (5 Bintang - Sangat Puas)</option>
                  <option value={4}>★★★★☆ (4 Bintang - Puas)</option>
                </select>
              </div>

              <div style={{ marginBottom: 18 }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: 4 }}>
                  Pesan Kesan / Testimoni
                </label>
                <textarea
                  rows={3}
                  placeholder="Tuliskan pengalaman positif ananda belajar bersama Bintangku..."
                  value={testiQuote}
                  onChange={(e) => setTestiQuote(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 12, border: '1.5px solid #CBD5E1' }}
                />
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button type="button" className="btn-outline" style={{ flex: 1, padding: 10 }} onClick={() => setShowTestimonialModal(false)}>
                  Batal
                </button>
                <button type="submit" className="btn-primary" style={{ flex: 1, padding: 10 }}>
                  Simpan Testimoni
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
