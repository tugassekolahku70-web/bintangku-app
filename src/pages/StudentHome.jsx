import React, { useState, useRef } from 'react';
import MascotStar from '../components/MascotStar';
import StudentBottomNav from '../components/StudentBottomNav';
import { Calendar, Check, Star, ArrowLeft, Camera, Upload, X, User } from 'lucide-react';
import { triggerStarConfetti } from '../components/StarConfetti';
import { RenderPremiumHabitIcon } from '../components/PremiumIcons';
import { useApp } from '../context/AppContext';
import { compressImageFile } from '../lib/imageUtils';

export default function StudentHome({ 
  studentData, 
  habits, 
  onToggleHabit, 
  activeTab, 
  setActiveTab, 
  setCurrentRoute 
}) {
  const { updateStudentAvatar, updateStudentPhoto } = useApp();
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  const completedCount = habits.filter(h => h.completed).length;
  const totalHabits = habits.length;
  const progressPercent = Math.round((completedCount / totalHabits) * 100);

  const AVATAR_CHOICES = [
    { emoji: '👦🏻', label: 'Santri Laki-laki 1' },
    { emoji: '👦🏽', label: 'Santri Laki-laki 2' },
    { emoji: '🧕🏻', label: 'Santriwati Pink' },
    { emoji: '🧕🏼', label: 'Santriwati Cokelat' },
    { emoji: '👨🏻‍🎓', label: 'Santri Hafidz' },
    { emoji: '⭐', label: 'Bintang Kebaikan' }
  ];

  const handleHabitClick = (habit) => {
    onToggleHabit(habit.id);
    if (!habit.completed) {
      triggerStarConfetti();
    }
  };

  const handleSelectAvatar = (emoji) => {
    updateStudentAvatar(studentData.id, emoji, studentData.photoUrl || '');
    setShowAvatarModal(false);
  };

  const handleDeviceFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadLoading(true);
    setUploadError('');
    try {
      const compressedDataUrl = await compressImageFile(file, 256, 256, 0.85);
      await updateStudentPhoto(studentData.id, compressedDataUrl);
      setShowAvatarModal(false);
      triggerStarConfetti();
    } catch (err) {
      setUploadError(err.message || 'Gagal mengunggah foto.');
    } finally {
      setUploadLoading(false);
    }
  };

  const handleRemovePhoto = async () => {
    await updateStudentPhoto(studentData.id, '');
    setShowAvatarModal(false);
  };

  return (
    <div className="student-portal-wrapper islamic-pattern-bg">
      <div className="student-screen-frame">
        {/* Curved Header (Mockup 3) */}
        <div className="student-header-arch islamic-header-pattern">
          <div className="student-header-top">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <button 
                  onClick={() => setActiveTab('beranda')}
                  style={{ 
                    color: '#FFFFFF', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 4, 
                    fontSize: '0.8rem', 
                    background: 'rgba(255,255,255,0.2)',
                    border: 'none',
                    padding: '4px 10px',
                    borderRadius: 999,
                    cursor: 'pointer' 
                  }}
                >
                  <ArrowLeft size={14} />
                  <span>Ke Beranda Progres</span>
                </button>
              </div>

              {/* Student Greeting with Avatar Photo Changer Button */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
                <div 
                  onClick={() => setShowAvatarModal(true)}
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: '50%',
                    background: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.6rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                    position: 'relative',
                    overflow: 'hidden',
                    border: '2px solid #FFE57F'
                  }}
                  title="Klik untuk ganti foto profil santri"
                >
                  {studentData.photoUrl ? (
                    <img 
                      src={studentData.photoUrl} 
                      alt={studentData.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <span>{studentData.avatar || '👦🏻'}</span>
                  )}
                  
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'rgba(0,0,0,0.5)',
                    padding: '1px 0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Camera size={9} color="#FFFFFF" />
                  </div>
                </div>

                <div>
                  <span className="student-greeting-text">Assalamu'alaikum,</span>
                  <h2 className="student-name-text">{studentData.name} 👋</h2>
                </div>
              </div>

              <p className="student-subtitle-text" style={{ marginTop: 4 }}>
                Checklist Kebiasaan Baikmu Hari Ini:
              </p>
            </div>

            {/* Star Counter Pill */}
            <div className="student-header-counter">
              <span className="star-icon">⭐</span>
              <div>
                <div className="counter-val">{studentData.totalStars}</div>
                <span className="counter-label">Bintang</span>
              </div>
            </div>
          </div>

          {/* 3D Mascot Peeking */}
          <div className="student-header-mascot">
            <MascotStar size={110} />
          </div>
        </div>

        {/* Content Body */}
        <div className="student-content-body">
          {/* Date Row & Calendar Button */}
          <div className="student-date-bar">
            <div className="date-today-label">
              <Calendar size={18} color="var(--primary-700)" />
              <span>{studentData.dateFormatted}</span>
            </div>

            <button 
              className="btn-calendar-pill"
              onClick={() => setShowCalendarModal(true)}
            >
              <Calendar size={14} />
              <span>Kalender</span>
            </button>
          </div>

          {/* Daily Progress Card */}
          <div className="student-progress-card">
            <div className="progress-header">
              <span>Progress Hari Ini</span>
              <span className="progress-counter-text">{completedCount}/{totalHabits} Kebiasaan</span>
            </div>

            <div className="progress-track">
              <div 
                className="progress-bar-fill"
                style={{ width: `${progressPercent}%` }}
              >
                <div className="progress-star-indicator">⭐</div>
              </div>
            </div>
          </div>

          {/* Habits Checklist Cards with Handcrafted Premium SVGs */}
          <div className="habits-list">
            {habits.map((habit) => {
              const isDone = habit.completed;

              return (
                <div 
                  key={habit.id}
                  className="habit-item-card"
                  onClick={() => handleHabitClick(habit)}
                >
                  <div className="habit-left-group">
                    <div style={{ width: 44, height: 44, flexShrink: 0 }}>
                      <RenderPremiumHabitIcon type={habit.icon} size={44} />
                    </div>

                    <div className="habit-info">
                      <h4>{habit.title}</h4>
                      <p>{habit.description}</p>
                    </div>
                  </div>

                  {/* Right Checkbox / Completion Circle */}
                  <div className={`habit-check-circle ${isDone ? 'completed' : ''}`}>
                    {isDone && <Check size={20} strokeWidth={3} />}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Motivational Footer Card */}
          <div className="encouragement-card animate-glow">
            <div style={{ width: 50, height: 50, flexShrink: 0 }}>
              <MascotStar size={50} />
            </div>
            <div className="encouragement-text">
              <strong>MasyaAllah! ✨</strong>
              <p>Teruslah jaga kebiasaan baikmu setiap hari!</p>
            </div>
          </div>
        </div>

        {/* Floating Bottom Nav */}
        <StudentBottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* AVATAR & DEVICE PHOTO CHANGER MODAL */}
        {showAvatarModal && (
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
              zIndex: 3500,
              padding: 20
            }}
            onClick={() => setShowAvatarModal(false)}
          >
            <div 
              style={{
                background: '#FFFFFF',
                borderRadius: 28,
                padding: '28px 24px',
                width: '100%',
                maxWidth: 380,
                textAlign: 'center',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                position: 'relative'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setShowAvatarModal(false)}
                style={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  background: '#F1F5F9',
                  border: 'none',
                  borderRadius: '50%',
                  width: 32,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={16} color="#64748B" />
              </button>

              <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary-700)', fontSize: '1.35rem', marginBottom: 4 }}>
                Ganti Foto Profil Santri
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#64748B', marginBottom: 18 }}>
                Unggah foto dari perangkatmu atau pilih karakter santri:
              </p>

              {/* Current Preview */}
              <div style={{
                width: 74,
                height: 74,
                borderRadius: '50%',
                margin: '0 auto 16px',
                border: '3px solid #F5A623',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#FFFBEB',
                boxShadow: '0 4px 14px rgba(245, 166, 35, 0.2)'
              }}>
                {studentData.photoUrl ? (
                  <img 
                    src={studentData.photoUrl} 
                    alt="Preview" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <span style={{ fontSize: '2.8rem' }}>{studentData.avatar || '👦🏻'}</span>
                )}
              </div>

              {/* Hidden file input */}
              <input 
                type="file" 
                ref={fileInputRef}
                accept="image/*"
                onChange={handleDeviceFileUpload}
                style={{ display: 'none' }}
              />

              {/* Device Photo Upload Button */}
              <button
                type="button"
                className="btn-primary"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadLoading}
                style={{
                  width: '100%',
                  padding: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  fontSize: '0.88rem',
                  marginBottom: 10
                }}
              >
                <Upload size={16} />
                <span>{uploadLoading ? 'Memproses Foto...' : 'Unggah Foto dari HP / Komputer'}</span>
              </button>

              {studentData.photoUrl && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#DC2626',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    marginBottom: 14,
                    display: 'block',
                    width: '100%'
                  }}
                >
                  Hapus Foto Pribadi (Kembali ke Karakter)
                </button>
              )}

              {uploadError && (
                <p style={{ fontSize: '0.78rem', color: '#DC2626', marginBottom: 12 }}>
                  {uploadError}
                </p>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '14px 0 12px' }}>
                <div style={{ flex: 1, height: 1, background: '#E2E8F0' }} />
                <span style={{ fontSize: '0.74rem', color: '#94A3B8', fontWeight: 600 }}>ATAU PILIH KARAKTER</span>
                <div style={{ flex: 1, height: 1, background: '#E2E8F0' }} />
              </div>

              {/* Character Avatar Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 18 }}>
                {AVATAR_CHOICES.map((c, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSelectAvatar(c.emoji)}
                    style={{
                      background: (!studentData.photoUrl && studentData.avatar === c.emoji) ? '#FEF3C7' : '#FAF8F5',
                      border: (!studentData.photoUrl && studentData.avatar === c.emoji) ? '2px solid #F5A623' : '1px solid #E2E8F0',
                      borderRadius: 16,
                      padding: 8,
                      cursor: 'pointer',
                      transition: 'transform 0.15s ease'
                    }}
                  >
                    <div style={{ fontSize: '2rem' }}>{c.emoji}</div>
                    <span style={{ fontSize: '0.66rem', color: '#64748B', display: 'block', marginTop: 2 }}>{c.label}</span>
                  </div>
                ))}
              </div>

              <button 
                className="btn-outline" 
                style={{ width: '100%', padding: '10px' }}
                onClick={() => setShowAvatarModal(false)}
              >
                Selesai
              </button>
            </div>
          </div>
        )}

        {/* Calendar Modal */}
        {showCalendarModal && (
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2000,
              padding: 20
            }}
            onClick={() => setShowCalendarModal(false)}
          >
            <div 
              style={{
                background: '#FFFFFF',
                borderRadius: 24,
                padding: 24,
                width: '100%',
                maxWidth: 340,
                textAlign: 'center'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 style={{ fontFamily: 'var(--font-heading)', color: '#8B1120', marginBottom: 12 }}>
                📅 Kalender Kebiasaan
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: 16 }}>
                Mei 2025 - Pekan ke-4
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8, fontSize: '0.8rem', fontWeight: 600 }}>
                <span>Sen</span><span>Sel</span><span>Rab</span><span>Kam</span><span>Jum</span><span style={{ color: '#8B1120' }}>Sab</span><span>Ahd</span>
                <div style={{ padding: 6, background: '#ECFDF5', borderRadius: 8 }}>19 ✓</div>
                <div style={{ padding: 6, background: '#ECFDF5', borderRadius: 8 }}>20 ✓</div>
                <div style={{ padding: 6, background: '#ECFDF5', borderRadius: 8 }}>21 ✓</div>
                <div style={{ padding: 6, background: '#ECFDF5', borderRadius: 8 }}>22 ✓</div>
                <div style={{ padding: 6, background: '#ECFDF5', borderRadius: 8 }}>23 ✓</div>
                <div style={{ padding: 6, background: '#F5A623', color: '#FFFFFF', borderRadius: 8, fontWeight: 700 }}>24 ⭐</div>
                <div style={{ padding: 6, background: '#F1F5F9', borderRadius: 8 }}>25</div>
              </div>
              <button 
                className="btn-primary" 
                style={{ marginTop: 20, width: '100%', padding: '10px' }}
                onClick={() => setShowCalendarModal(false)}
              >
                Tutup
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
