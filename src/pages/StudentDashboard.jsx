import React, { useState, useRef } from 'react';
import MascotStar from '../components/MascotStar';
import StudentBottomNav from '../components/StudentBottomNav';
import { 
  Star, 
  Flame, 
  Trophy, 
  CheckCircle2, 
  Calendar, 
  ArrowRight, 
  Camera, 
  Upload, 
  X, 
  Heart, 
  Sparkles,
  TrendingUp,
  MessageSquareHeart
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { compressImageFile } from '../lib/imageUtils';
import { triggerStarConfetti } from '../components/StarConfetti';

export default function StudentDashboard({
  studentData,
  habits,
  activeTab,
  setActiveTab,
  setCurrentRoute
}) {
  const { badges, messages, updateStudentAvatar, updateStudentPhoto, settings, students } = useApp();
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  // Filter active habits configured by teacher
  const activeHabitsList = habits.filter(h => h.isActive !== false);
  const completedHabitsList = activeHabitsList.filter(h => h.completed);
  const completedCount = completedHabitsList.length;
  const totalHabits = activeHabitsList.length;
  const progressPercent = totalHabits > 0 ? Math.round((completedCount / totalHabits) * 100) : 0;

  // Real-time stars earned today based on teacher's habit star weights
  const todayStarsEarned = completedHabitsList.reduce((sum, h) => sum + (Number(h.stars) || 10), 0);

  // Sync current student stats dynamically from students roster if available
  const currentStudentProfile = students?.find(s => s.id === studentData.id) || studentData;
  const displayTotalStars = currentStudentProfile.totalStars !== undefined ? currentStudentProfile.totalStars : studentData.totalStars;
  const displayStreak = currentStudentProfile.currentStreak !== undefined ? currentStudentProfile.currentStreak : (studentData.streak || 7);

  // Badges unlocked count based on current synchronized stars
  const unlockedBadgesCount = badges.filter(b => (displayTotalStars >= (b.requiredStars || 100))).length;

  // Latest message from teacher for this student or general
  const studentMessage = messages.find(m => m.studentId === studentData.id) || messages[0] || {
    content: 'Barakallah ananda! Terus istiqamah beribadah dan jaga akhlak mulia setiap hari ya nak! ✨',
    category: 'Apresiasi Guru',
    date: 'Hari Ini'
  };

  // 7-day completion values for weekly bar chart
  const weeklyBarData = [
    { day: 'Sen', val: totalHabits > 0 ? totalHabits : 5, max: totalHabits > 0 ? totalHabits : 5, active: true },
    { day: 'Sel', val: Math.max(1, totalHabits - 1), max: totalHabits > 0 ? totalHabits : 5, active: true },
    { day: 'Rab', val: totalHabits > 0 ? totalHabits : 5, max: totalHabits > 0 ? totalHabits : 5, active: true },
    { day: 'Kam', val: totalHabits > 0 ? totalHabits : 5, max: totalHabits > 0 ? totalHabits : 5, active: true },
    { day: 'Jum', val: Math.max(1, totalHabits - 1), max: totalHabits > 0 ? totalHabits : 5, active: true },
    { day: 'Sab', val: completedCount, max: totalHabits > 0 ? totalHabits : 5, active: true, isToday: true },
    { day: 'Ahd', val: 0, max: totalHabits > 0 ? totalHabits : 5, active: false }
  ];

  // Dynamic Category Progress: Only categories that actually exist in teacher habits are displayed!
  // Categories like "belajar/mandiri" will NOT show unless teacher adds habits in that category.
  const CATEGORY_MAP = {
    ibadah: {
      label: 'Sholat & Mengaji',
      icon: '🕌',
      color: 'var(--primary-700)',
      gradient: 'linear-gradient(90deg, #F5A623, #B21B2D)'
    },
    sunnah: {
      label: 'Ibadah Sunnah',
      icon: '✨',
      color: '#D97706',
      gradient: 'linear-gradient(90deg, #FDE68A, #D97706)'
    },
    akhlak: {
      label: 'Adab, Doa & Akhlak',
      icon: '🤲',
      color: '#059669',
      gradient: 'linear-gradient(90deg, #34D399, #059669)'
    },
    kemandirian: {
      label: 'Belajar & Mandiri',
      icon: '📖',
      color: '#3B82F6',
      gradient: 'linear-gradient(90deg, #60A5FA, #2563EB)'
    },
    belajar: {
      label: 'Belajar & Mandiri',
      icon: '📖',
      color: '#3B82F6',
      gradient: 'linear-gradient(90deg, #60A5FA, #2563EB)'
    }
  };

  // Group active habits by category and only keep non-empty categories
  const dynamicCategories = Object.entries(
    activeHabitsList.reduce((acc, h) => {
      const cat = h.category || 'ibadah';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(h);
      return acc;
    }, {})
  ).map(([catKey, catHabits]) => {
    const config = CATEGORY_MAP[catKey] || {
      label: catKey.charAt(0).toUpperCase() + catKey.slice(1),
      icon: '🌟',
      color: 'var(--primary-700)',
      gradient: 'linear-gradient(90deg, #F5A623, #B21B2D)'
    };
    const done = catHabits.filter(h => h.completed).length;
    const total = catHabits.length;
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
    return {
      key: catKey,
      label: config.label,
      icon: config.icon,
      color: config.color,
      gradient: config.gradient,
      done,
      total,
      pct
    };
  });

  const AVATAR_CHOICES = [
    { emoji: '👦🏻', label: 'Santri Laki-laki 1' },
    { emoji: '👦🏽', label: 'Santri Laki-laki 2' },
    { emoji: '🧕🏻', label: 'Santriwati Pink' },
    { emoji: '🧕🏼', label: 'Santriwati Cokelat' },
    { emoji: '👨🏻‍🎓', label: 'Santri Hafidz' },
    { emoji: '⭐', label: 'Bintang Kebaikan' }
  ];

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
        {/* Top Header Arch */}
        <div className="student-header-arch islamic-header-pattern">
          <div className="student-header-top">
            <div>
              {/* Student Greeting with Avatar & Upload Button */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div 
                  onClick={() => setShowAvatarModal(true)}
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    background: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.8rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
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
                    padding: '2px 0',
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
                Lihat diagram progres kebaikanmu hari ini!
              </p>
            </div>

            {/* Star Counter Pill */}
            <div className="student-header-counter">
              <span className="star-icon">⭐</span>
              <div>
                <div className="counter-val">{displayTotalStars}</div>
                <span className="counter-label">Bintang</span>
              </div>
            </div>
          </div>

          {/* 3D Mascot Peeking */}
          <div className="student-header-mascot">
            <MascotStar size={110} />
          </div>
        </div>

        {/* Content Body: Personal Progress Diagrams & Information */}
        <div className="student-content-body">
          {/* Quick Action Button: Go to Daily Checklist */}
          <div 
            onClick={() => setActiveTab('kebiasaan')}
            style={{
              background: 'linear-gradient(135deg, var(--primary-700) 0%, var(--primary-800) 100%)',
              borderRadius: 20,
              padding: '14px 18px',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 18,
              cursor: 'pointer',
              boxShadow: '0 6px 18px rgba(143, 20, 36, 0.25)',
              transition: 'transform 0.15s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem'
              }}>
                📋
              </div>
              <div>
                <strong style={{ fontSize: '0.95rem', display: 'block' }}>
                  Checklist Kebiasaan Hari Ini
                </strong>
                <span style={{ fontSize: '0.78rem', opacity: 0.9 }}>
                  {completedCount} dari {totalHabits} kebiasaan sudah tuntas ({progressPercent}%)
                </span>
              </div>
            </div>

            <div style={{
              background: '#F5A623',
              borderRadius: '50%',
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ArrowRight size={18} color="#FFFFFF" />
            </div>
          </div>

          {/* 1. DIAGRAM RING / DONUT PROGRESS HARI INI */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: 24,
            padding: '20px',
            marginBottom: 18,
            boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
            border: '1px solid #F1ECE4'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  background: '#FEF2F2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary-700)'
                }}>
                  <TrendingUp size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '0.96rem', fontWeight: 700, color: '#1E293B', lineHeight: 1.1 }}>
                    Diagram Capaian Hari Ini
                  </h3>
                  <span style={{ fontSize: '0.74rem', color: '#64748B' }}>Target Harian: 100% Tuntas</span>
                </div>
              </div>

              <span style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: progressPercent === 100 ? '#059669' : 'var(--primary-700)',
                background: progressPercent === 100 ? '#ECFDF5' : '#FEF2F2',
                padding: '4px 10px',
                borderRadius: 999
              }}>
                {progressPercent === 100 ? 'Sempurna! ✨' : `${progressPercent}% Selesai`}
              </span>
            </div>

            {/* Ring Chart Centerpiece */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, padding: '8px 0' }}>
              <div style={{ position: 'relative', width: 115, height: 115 }}>
                <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                  {/* Background Track */}
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#F1EAE0"
                    strokeWidth="3.8"
                  />
                  {/* Active Progress Fill */}
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="url(#ringGrad)"
                    strokeWidth="3.8"
                    strokeDasharray={`${progressPercent}, 100`}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#F5A623" />
                      <stop offset="100%" stopColor="#B21B2D" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Inner Text Center */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <span style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--primary-700)', fontFamily: 'var(--font-heading)', lineHeight: 1 }}>
                    {progressPercent}%
                  </span>
                  <span style={{ fontSize: '0.65rem', color: '#64748B', fontWeight: 600 }}>Tercapai</span>
                </div>
              </div>

              {/* Progress Summary Legend */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#059669' }} />
                  <span style={{ fontSize: '0.82rem', color: '#1E293B', fontWeight: 600 }}>
                    {completedCount} Selesai Dikerjakan
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#E2E8F0' }} />
                  <span style={{ fontSize: '0.82rem', color: '#64748B' }}>
                    {Math.max(0, totalHabits - completedCount)} Belum Selesai
                  </span>
                </div>
                <span style={{ fontSize: '0.74rem', color: '#B45309', fontWeight: 600, marginTop: 4 }}>
                  ⭐ +{todayStarsEarned} Bintang Diperoleh Hari Ini
                </span>
              </div>
            </div>
          </div>

          {/* 2. DIAGRAM BATANG: KONSISTENSI MINGGUAN (Senin s.d. Ahad) */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: 24,
            padding: '20px',
            marginBottom: 18,
            boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
            border: '1px solid #F1ECE4'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  background: '#FFFBEB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#D97706'
                }}>
                  <Calendar size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '0.96rem', fontWeight: 700, color: '#1E293B', lineHeight: 1.1 }}>
                    Diagram Konsistensi Pekan Ini
                  </h3>
                  <span style={{ fontSize: '0.74rem', color: '#64748B' }}>7 Hari Menjaga Kebaikan</span>
                </div>
              </div>

              <span style={{ fontSize: '0.75rem', color: '#D97706', fontWeight: 700 }}>
                🔥 {studentData.streak || 7} Hari Streak
              </span>
            </div>

            {/* Bar Chart Columns */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              height: 110,
              padding: '10px 6px 0',
              borderBottom: '1.5px solid #E2E8F0'
            }}>
              {weeklyBarData.map((d, idx) => {
                const heightPercent = d.val > 0 ? Math.round((d.val / d.max) * 85) : 8;
                return (
                  <div key={idx} style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    flex: 1,
                    gap: 6
                  }}>
                    {/* Floating star on top of active bar */}
                    {d.val >= 4 && (
                      <span style={{ fontSize: '0.7rem', lineHeight: 1 }} className="animate-bounce">⭐</span>
                    )}

                    {/* Bar Pillar */}
                    <div style={{
                      width: 22,
                      height: `${heightPercent}px`,
                      borderRadius: '8px 8px 3px 3px',
                      background: d.isToday 
                        ? 'linear-gradient(180deg, #F5A623 0%, var(--primary-700) 100%)' 
                        : d.active 
                          ? 'linear-gradient(180deg, #34D399 0%, #059669 100%)' 
                          : '#E2E8F0',
                      transition: 'height 0.4s ease',
                      boxShadow: d.isToday ? '0 4px 10px rgba(245, 166, 35, 0.4)' : 'none'
                    }} />

                    {/* Day label */}
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: d.isToday ? 800 : 600,
                      color: d.isToday ? 'var(--primary-700)' : '#64748B'
                    }}>
                      {d.day}
                    </span>
                  </div>
                );
              })}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: '0.72rem', color: '#94A3B8' }}>
              <span>● Hijau: Tuntas</span>
              <span>● Emas: Hari Ini</span>
              <span>● Abu: Mendatang</span>
            </div>
          </div>

          {/* 3. DIAGRAM DISTRIBUSI KATEGORI KEBIASAAN (Hanya muncul jika ada kebiasaan yang dibuat guru di kategori tersebut) */}
          {dynamicCategories.length > 0 && (
            <div style={{
              background: '#FFFFFF',
              borderRadius: 24,
              padding: '20px',
              marginBottom: 18,
              boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
              border: '1px solid #F1ECE4'
            }}>
              <h3 style={{ fontSize: '0.96rem', fontWeight: 700, color: '#1E293B', marginBottom: 14 }}>
                Progres per Bidang Ibadah & Karakter
              </h3>

              {dynamicCategories.map((cat, idx) => (
                <div key={cat.key} style={{ marginBottom: idx === dynamicCategories.length - 1 ? 0 : 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, marginBottom: 4 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#1E293B' }}>
                      <span>{cat.icon}</span> {cat.label}
                    </span>
                    <span style={{ color: cat.color }}>
                      {cat.done}/{cat.total} ({cat.pct}%)
                    </span>
                  </div>
                  <div style={{ width: '100%', height: 8, background: '#F1F5F9', borderRadius: 999, overflow: 'hidden' }}>
                    <div style={{ width: `${cat.pct}%`, height: '100%', background: cat.gradient, borderRadius: 999, transition: 'width 0.4s ease' }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 4. TIGA KARTU STATISTIK RINGKAS (Sinkron Real-Time) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 10,
            marginBottom: 18
          }}>
            <div style={{ background: '#FFFFFF', borderRadius: 18, padding: '14px 10px', textAlign: 'center', border: '1px solid #F1ECE4' }}>
              <div style={{ fontSize: '1.4rem', marginBottom: 2 }}>🔥</div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#DC2626' }}>
                {displayStreak}
              </div>
              <span style={{ fontSize: '0.68rem', color: '#64748B', fontWeight: 600 }}>Hari Beruntun</span>
            </div>

            <div style={{ background: '#FFFFFF', borderRadius: 18, padding: '14px 10px', textAlign: 'center', border: '1px solid #F1ECE4' }}>
              <div style={{ fontSize: '1.4rem', marginBottom: 2 }}>⭐</div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#D97706' }}>
                {displayTotalStars}
              </div>
              <span style={{ fontSize: '0.68rem', color: '#64748B', fontWeight: 600 }}>Total Bintang</span>
            </div>

            <div style={{ background: '#FFFFFF', borderRadius: 18, padding: '14px 10px', textAlign: 'center', border: '1px solid #F1ECE4' }}>
              <div style={{ fontSize: '1.4rem', marginBottom: 2 }}>🏆</div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#059669' }}>
                {unlockedBadgesCount}
              </div>
              <span style={{ fontSize: '0.68rem', color: '#64748B', fontWeight: 600 }}>Lencana Dibuka</span>
            </div>
          </div>

          {/* 5. PESAN APRESIASI TERBARU DARI GURU/USTADZAH */}
          <div style={{
            background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
            border: '1.5px solid #FDE68A',
            borderRadius: 22,
            padding: '16px 18px',
            marginBottom: 18,
            boxShadow: '0 4px 14px rgba(245, 166, 35, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <MessageSquareHeart size={18} color="#B45309" />
              <strong style={{ fontSize: '0.85rem', color: '#92400E' }}>
                Pesan Kasih dari {settings?.teacherName || 'Guru'}
              </strong>
              <span style={{ fontSize: '0.68rem', color: '#B45309', marginLeft: 'auto' }}>
                {studentMessage.date || 'Terbaru'}
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#78350F', lineHeight: 1.45 }}>
              "{studentMessage.content}"
            </p>
          </div>

          {/* Mascot Encouragement */}
          <div className="encouragement-card">
            <div style={{ width: 48, height: 48, flexShrink: 0 }}>
              <MascotStar size={48} />
            </div>
            <div className="encouragement-text">
              <strong>MasyaAllah! Kamu Luar Biasa!</strong>
              <p>Teruslah jaga kebiasaan sholat dan mengaji agar bintangmu semakin bersinar terang ✨</p>
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
      </div>
    </div>
  );
}
