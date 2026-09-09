import React, { useState, useRef } from 'react';
import BadgeItem from '../components/BadgeItem';
import MascotStar from '../components/MascotStar';
import StudentBottomNav from '../components/StudentBottomNav';
import { ArrowLeft, Sparkles, X, CheckCircle, Lock, Camera, Upload, User, Award } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { compressImageFile } from '../lib/imageUtils';
import { triggerStarConfetti } from '../components/StarConfetti';

export default function StudentBadges({ 
  studentData, 
  activeTab, 
  setActiveTab, 
  setCurrentRoute 
}) {
  const { badges, updateStudentAvatar, updateStudentPhoto } = useApp();
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

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
      setUploadError(err.message || 'Gagal mengunggah foto. Silakan coba file lain.');
    } finally {
      setUploadLoading(false);
    }
  };

  const handleRemovePhoto = async () => {
    await updateStudentPhoto(studentData.id, '');
    setShowAvatarModal(false);
  };

  const unlockedCount = badges.filter(b => (studentData.totalStars >= (b.requiredStars || 100))).length;

  return (
    <div className="student-portal-wrapper islamic-pattern-bg">
      <div className="student-screen-frame">
        {/* Top Red Header Arch */}
        <div className="student-header-arch islamic-header-pattern" style={{ paddingBottom: 24 }}>
          <div className="student-header-top">
            <button 
              onClick={() => setActiveTab('beranda')}
              style={{
                background: 'rgba(255, 255, 255, 0.25)',
                border: 'none',
                color: '#FFFFFF',
                borderRadius: '50%',
                width: 38,
                height: 38,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              title="Kembali ke Beranda"
            >
              <ArrowLeft size={20} />
            </button>

            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: '#FFFFFF', lineHeight: 1.1 }}>
                {activeTab === 'profil' ? 'Profil & Pencapaian' : 'Pencapaian'}
              </h2>
              <span style={{ fontSize: '0.8rem', opacity: 0.9 }}>
                {unlockedCount} dari {badges.length} Lencana Terbuka
              </span>
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
        </div>

        {/* Content Body */}
        <div className="student-content-body">
          {/* Student Profile Card with Photo Upload & Camera Button */}
          <div style={{
            background: 'linear-gradient(135deg, #FFFFFF 0%, #FFFBEB 100%)',
            borderRadius: 24,
            padding: '18px 20px',
            marginBottom: 20,
            border: '1.5px solid #FDE68A',
            boxShadow: '0 6px 20px rgba(245, 166, 35, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 14
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div 
                onClick={() => setShowAvatarModal(true)}
                style={{
                  position: 'relative',
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  background: '#FFFFFF',
                  border: '2px solid #F5A623',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
                title="Klik untuk ganti foto profil dari HP / Komputer"
              >
                {studentData.photoUrl ? (
                  <img 
                    src={studentData.photoUrl} 
                    alt={studentData.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <span style={{ fontSize: '2.2rem' }}>{studentData.avatar || '👦🏻'}</span>
                )}
                
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'rgba(0,0,0,0.55)',
                  padding: '2px 0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Camera size={11} color="#FFFFFF" />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1E293B', lineHeight: 1.2 }}>
                    {studentData.name}
                  </h3>
                </div>
                <span style={{ fontSize: '0.78rem', color: '#64748B', display: 'block', marginTop: 2 }}>
                  PIN Akses: <strong>{studentData.pin || '1234'}</strong> • {studentData.className || 'Kelas 2A'}
                </span>
                <span style={{ 
                  display: 'inline-block',
                  fontSize: '0.72rem', 
                  color: '#B45309', 
                  fontWeight: 600,
                  background: '#FEF3C7',
                  padding: '2px 8px',
                  borderRadius: 999,
                  marginTop: 4
                }}>
                  🔥 {studentData.streak || 7} Hari Berturut-turut
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowAvatarModal(true)}
              style={{
                background: '#FFFFFF',
                border: '1px solid #F5A623',
                borderRadius: 14,
                color: '#B45309',
                padding: '8px 12px',
                fontSize: '0.75rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
              }}
            >
              <Camera size={14} />
              <span>Ganti Foto</span>
            </button>
          </div>

          {/* Section Heading */}
          <div style={{ textAlign: 'center', margin: '10px 0 16px' }}>
            <h3 style={{ 
              fontFamily: 'var(--font-heading)', 
              fontSize: '1.45rem', 
              color: '#1E293B',
              marginBottom: 4 
            }}>
              Koleksi Lencana Hebatmu
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748B' }}>
              Raih bintang setiap hari untuk membuka semua lencana kemuliaan ✨
            </p>
          </div>

          {/* 3x3 Grid of Badges */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 12,
            marginBottom: 24
          }}>
            {badges.map((badge) => (
              <BadgeItem 
                key={badge.id} 
                badge={badge} 
                currentStars={studentData.totalStars}
                onClick={() => setSelectedBadge(badge)} 
              />
            ))}
          </div>

          {/* Bottom Motivation Banner with Mascot */}
          <div className="encouragement-card" style={{ marginTop: 10 }}>
            <div style={{ width: 50, height: 50, flexShrink: 0 }}>
              <MascotStar size={50} />
            </div>
            <div className="encouragement-text">
              <strong>Teruslah Bersemangat!</strong>
              <p>Setiap kebaikan kecil hari ini, membuatmu jadi bintang yang bersinar di surga kelak ✨</p>
            </div>
          </div>
        </div>

        {/* Floating Bottom Nav */}
        <StudentBottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Badge Detail Modal */}
        {selectedBadge && (() => {
          const req = selectedBadge.requiredStars || 100;
          const isUnlocked = selectedBadge.isUnlocked !== undefined 
            ? selectedBadge.isUnlocked 
            : (studentData.totalStars >= req);
          const remaining = Math.max(0, req - studentData.totalStars);

          return (
            <div 
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.6)',
                backdropFilter: 'blur(5px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 3000,
                padding: 20
              }}
              onClick={() => setSelectedBadge(null)}
            >
              <div 
                style={{
                  background: '#FFFFFF',
                  borderRadius: 28,
                  padding: '32px 24px',
                  width: '100%',
                  maxWidth: 360,
                  textAlign: 'center',
                  position: 'relative',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.25)'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <button 
                  onClick={() => setSelectedBadge(null)}
                  style={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    background: '#F1F5F9',
                    border: 'none',
                    borderRadius: '50%',
                    width: 34,
                    height: 34,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <X size={18} color="#64748B" />
                </button>

                {/* Big Badge Icon Highlight */}
                <div style={{ fontSize: '3.8rem', margin: '10px 0 14px' }}>
                  {isUnlocked ? '🥇' : '🔒'}
                </div>

                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.45rem', color: '#1E293B', marginBottom: 8 }}>
                  {selectedBadge.title}
                </h3>

                <p style={{ fontSize: '0.92rem', color: '#64748B', lineHeight: 1.5, marginBottom: 20 }}>
                  {selectedBadge.description}
                </p>

                {isUnlocked ? (
                  <div style={{
                    background: '#ECFDF5',
                    border: '1px solid #A7F3D0',
                    borderRadius: 16,
                    padding: '14px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 6,
                    color: '#059669',
                    fontWeight: 700,
                    fontSize: '0.92rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <CheckCircle size={20} />
                      <span>Lencana Berhasil Diraih!</span>
                    </div>
                    <span style={{ fontSize: '0.78rem', color: '#047857', fontWeight: 500 }}>
                      MasyaAllah, total bintangmu ({studentData.totalStars}) telah melampaui syarat ({req} ⭐)
                    </span>
                  </div>
                ) : (
                  <div style={{
                    background: '#FFFBEB',
                    border: '1px solid #FDE68A',
                    borderRadius: 16,
                    padding: '14px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 6,
                    color: '#B45309',
                    fontSize: '0.88rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700 }}>
                      <Lock size={18} />
                      <span>Lencana Masih Terkunci</span>
                    </div>
                    <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                      Perlu <strong>{remaining}</strong> bintang lagi untuk membuka (Total saat ini: {studentData.totalStars}/{req})
                    </span>
                  </div>
                )}

                <button 
                  className="btn-primary" 
                  style={{ width: '100%', marginTop: 22, padding: '13px' }}
                  onClick={() => setSelectedBadge(null)}
                >
                  Tutup
                </button>
              </div>
            </div>
          );
        })()}

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
