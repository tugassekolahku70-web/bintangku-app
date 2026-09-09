import React from 'react';
import StarJar from '../components/StarJar';
import MascotStar from '../components/MascotStar';
import StudentBottomNav from '../components/StudentBottomNav';
import { ArrowLeft, Flame, Shield, Star, Calendar } from 'lucide-react';
import { triggerStarConfetti } from '../components/StarConfetti';

export default function StudentProgress({ 
  studentData, 
  activeTab, 
  setActiveTab, 
  setCurrentRoute 
}) {
  const handleJarClick = () => {
    triggerStarConfetti();
  };

  return (
    <div className="student-portal-wrapper islamic-pattern-bg">
      <div className="student-screen-frame">
        {/* Top Header with Back Button and Red Wave */}
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
            >
              <ArrowLeft size={20} />
            </button>

            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: '#FFFFFF', lineHeight: 1.1 }}>
                Progresku
              </h2>
              <span style={{ fontSize: '0.8rem', opacity: 0.9 }}>Perjalanan Kebiasaanku</span>
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
        <div className="student-content-body" style={{ textAlign: 'center' }}>
          {/* MasyaAllah Title */}
          <div style={{ margin: '10px 0 16px' }}>
            <h3 style={{ 
              fontFamily: 'var(--font-heading)', 
              fontSize: '1.7rem', 
              color: '#1E293B',
              marginBottom: 4 
            }}>
              MasyaAllah!
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#64748B', fontWeight: 500 }}>
              Kebiasaan baikmu semakin bersinar ✨
            </p>
          </div>

          {/* 3D Glass Star Jar Centerpiece (Clickable for Confetti!) */}
          <div onClick={handleJarClick} style={{ cursor: 'pointer' }} title="Ketuk toples untuk selebrasi bintang!">
            <StarJar 
              count={studentData.weeklyCompleted || 28} 
              maxCount={studentData.weeklyTarget || 35} 
              totalStars={studentData.totalStars || 0} 
            />
          </div>

          {/* Dynamic Next Reward Milestone Pill */}
          {(() => {
            const current = studentData.totalStars || 0;
            const nextMilestone = current < 200 ? 200 : current < 350 ? 350 : 500;
            const toNext = Math.max(0, nextMilestone - current);
            const rewardTierName = nextMilestone === 200 ? 'Paket Stiker Bintang' : nextMilestone === 350 ? 'Sertifikat Santri Teladan' : 'Mahkota Bintang Emas';
            
            return (
              <div style={{
                margin: '14px auto 0',
                maxWidth: 320,
                background: '#FFFBEB',
                border: '1.5px dashed #F59E0B',
                borderRadius: 18,
                padding: '10px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                textAlign: 'left'
              }}>
                <span style={{ fontSize: '1.6rem' }}>🎁</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#92400E' }}>
                    Menuju Hadiah: {rewardTierName}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#B45309', marginTop: 1 }}>
                    {toNext > 0 ? (
                      <>Tersisa <strong>{toNext}</strong> bintang lagi menuju target <strong>{nextMilestone} ⭐</strong></>
                    ) : (
                      <>Alhamdulillah! Kamu berhak menukarkan hadiah ini ke Ustadzah! 🎉</>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Weekly Progress Card */}
          <div className="student-progress-card" style={{ marginTop: 16, textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
              <div>
                <strong style={{ fontSize: '0.95rem', color: '#1E293B', display: 'block' }}>
                  Progres Mingguan
                </strong>
                <span style={{ fontSize: '0.78rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                  <Calendar size={13} /> Pekan Berjalan
                </span>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary-700)' }}>
                  {studentData.weeklyCompleted || 28}
                </span>
                <span style={{ fontSize: '0.85rem', color: '#64748B' }}>
                  /{studentData.weeklyTarget || 35}
                </span>
                <div style={{ fontSize: '0.68rem', color: '#64748B' }}>Kebiasaan Tercapai</div>
              </div>
            </div>

            {/* Red Progress Track */}
            <div className="progress-track" style={{ margin: '10px 0 8px' }}>
              <div 
                className="progress-bar-fill"
                style={{ 
                  width: `${Math.min(100, ((studentData.weeklyCompleted || 28) / (studentData.weeklyTarget || 35)) * 100)}%` 
                }}
              >
                <div className="progress-star-indicator">⭐</div>
              </div>
            </div>

            <span style={{ fontSize: '0.78rem', color: '#B45309', fontWeight: 600 }}>
              Teruskan! Kamu hebat! Setiap amalan bernilai pahala berlipat 💪
            </span>
          </div>

          {/* 3 Metric Stat Cards in Grid */}
          <div className="progress-stat-grid">
            {/* Card 1: Streak */}
            <div className="progress-stat-card">
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Flame size={18} color="#EF4444" />
              </div>
              <div className="stat-val">{studentData.streak || 7} <span style={{ fontSize: '0.85rem' }}>Hari</span></div>
              <span className="stat-label">Berturut-turut</span>
              <span className="stat-sub">Streak Aktif!</span>
            </div>

            {/* Card 2: Kebiasaan */}
            <div className="progress-stat-card">
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#FFFBEB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Shield size={18} color="#F59E0B" />
              </div>
              <div className="stat-val">{studentData.weeklyTotalHabits || 32}</div>
              <span className="stat-label">Kebiasaan</span>
              <span className="stat-sub" style={{ color: '#B45309' }}>Tuntas Pekan Ini</span>
            </div>

            {/* Card 3: Total Bintang */}
            <div className="progress-stat-card">
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#FFFBEB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Star size={18} color="#F59E0B" fill="#F59E0B" />
              </div>
              <div className="stat-val">{studentData.totalStars}</div>
              <span className="stat-label">Total Bintang</span>
              <span className="stat-sub" style={{ color: '#D97706' }}>Koleksi Utama</span>
            </div>
          </div>

          {/* Mascot Motivational Card */}
          <div className="encouragement-card" style={{ textAlign: 'left', marginTop: 14 }}>
            <div style={{ width: 48, height: 48, flexShrink: 0 }}>
              <MascotStar size={48} />
            </div>
            <div className="encouragement-text">
              <strong>MasyaAllah Tabarakallah! ✨</strong>
              <p>Toples bintangmu terus terisi seiring konsistensi ibadahmu setiap hari 🌟</p>
            </div>
          </div>
        </div>

        {/* Floating Bottom Nav */}
        <StudentBottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  );
}
