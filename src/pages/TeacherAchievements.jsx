import React, { useState } from 'react';
import TeacherSidebar from '../components/TeacherSidebar';
import { useApp } from '../context/AppContext';
import { Trophy, Award, Star, Users, Menu, CheckCircle2, Plus, Edit } from 'lucide-react';
import { triggerStarConfetti } from '../components/StarConfetti';

export default function TeacherAchievements({ currentRoute, setCurrentRoute }) {
  const { badges, students, awardStudentStars, editBadge } = useApp();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [grantModalStudentId, setGrantModalStudentId] = useState(students[0]?.id || 's-arman');
  
  // Edit badge modal state
  const [editingBadge, setEditingBadge] = useState(null);
  const [badgeForm, setBadgeForm] = useState({
    title: '',
    description: '',
    requiredStars: 100
  });

  const handleGrantBonus = (badge) => {
    awardStudentStars(grantModalStudentId, 25);
    triggerStarConfetti();
    alert(`Apresiasi 25 ⭐ berhasil diberikan bersama lencana ${badge.title}!`);
    setSelectedBadge(null);
  };

  const handleOpenEditBadge = (badge) => {
    setBadgeForm({
      title: badge.title,
      description: badge.description || '',
      requiredStars: badge.requiredStars || 100
    });
    setEditingBadge(badge);
  };

  const handleSaveEditBadge = (e) => {
    e.preventDefault();
    if (!editingBadge || !badgeForm.title.trim()) return;

    editBadge(editingBadge.id, {
      title: badgeForm.title,
      description: badgeForm.description,
      requiredStars: Number(badgeForm.requiredStars)
    });

    setEditingBadge(null);
  };

  return (
    <div className="teacher-container">
      <TeacherSidebar 
        currentRoute="teacher_achievements" 
        setCurrentRoute={setCurrentRoute}
        isOpenMobile={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      <main className="teacher-main-layout">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button className="btn-mobile-burger" onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}>
              <Menu size={22} />
            </button>
            <div>
              <h1 className="teacher-welcome-title">Pencapaian & Lencana Santri</h1>
              <p className="teacher-welcome-subtitle">
                Pantau, berikan apresiasi, dan sesuaikan kriteria lencana kebaikan santri
              </p>
            </div>
          </div>
        </div>

        {/* 9 Badges Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: 20 }}>
          {badges.map((badge) => (
            <div 
              key={badge.id}
              style={{
                background: '#FFFFFF',
                borderRadius: 22,
                padding: '24px 22px',
                border: '1px solid #F1ECE4',
                boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
                  <div style={{
                    width: 52,
                    height: 52,
                    borderRadius: 16,
                    background: badge.isUnlocked ? 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)' : '#F1F5F9',
                    border: `1.5px solid ${badge.isUnlocked ? '#FDE68A' : '#E2E8F0'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.8rem'
                  }}>
                    {badge.isUnlocked ? '🥇' : '🔒'}
                  </div>

                  <div style={{ flex: 1 }}>
                    <strong style={{ fontSize: '1.05rem', color: '#1E293B', display: 'block' }}>
                      {badge.title}
                    </strong>
                    <span style={{ fontSize: '0.8rem', color: badge.isUnlocked ? '#059669' : '#94A3B8', fontWeight: 600 }}>
                      {badge.isUnlocked ? '✓ Lencana Aktif' : '🔒 Lencana Target'}
                    </span>
                  </div>

                  <button
                    onClick={() => handleOpenEditBadge(badge)}
                    style={{
                      background: '#F8FAFC',
                      border: '1px solid #CBD5E1',
                      borderRadius: 8,
                      padding: 6,
                      color: '#64748B',
                      cursor: 'pointer'
                    }}
                    title="Edit Lencana Ini"
                  >
                    <Edit size={14} />
                  </button>
                </div>

                <p style={{ fontSize: '0.85rem', color: '#64748B', lineHeight: 1.4, marginBottom: 16 }}>
                  {badge.description}
                </p>
              </div>

              <div style={{ borderTop: '1px solid #F8FAFC', paddingTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.82rem', color: '#92400E', fontWeight: 700 }}>
                  Target: {badge.requiredStars} ⭐
                </span>

                <button
                  onClick={() => setSelectedBadge(badge)}
                  className="btn-outline"
                  style={{ padding: '6px 14px', fontSize: '0.78rem' }}
                >
                  Beri ke Santri
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* EDIT BADGE MODAL */}
      {editingBadge && (
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
          onClick={() => setEditingBadge(null)}
        >
          <div 
            style={{
              background: '#FFFFFF',
              borderRadius: 24,
              padding: 28,
              width: '100%',
              maxWidth: 400
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary-700)', marginBottom: 4 }}>
              Edit Lencana Pencapaian
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: 18 }}>
              Sesuaikan nama, deskripsi, dan target bintang perolehan
            </p>

            <form onSubmit={handleSaveEditBadge}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: 4 }}>
                  Nama Lencana
                </label>
                <input 
                  type="text"
                  value={badgeForm.title}
                  onChange={(e) => setBadgeForm({ ...badgeForm, title: e.target.value })}
                  required
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 12, border: '1.5px solid #CBD5E1' }}
                />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: 4 }}>
                  Deskripsi Kriteria Perolehan
                </label>
                <textarea 
                  rows={3}
                  value={badgeForm.description}
                  onChange={(e) => setBadgeForm({ ...badgeForm, description: e.target.value })}
                  required
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 12, border: '1.5px solid #CBD5E1' }}
                />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: 4 }}>
                  Target Bintang (Threshold)
                </label>
                <input 
                  type="number"
                  min={10}
                  step={10}
                  value={badgeForm.requiredStars}
                  onChange={(e) => setBadgeForm({ ...badgeForm, requiredStars: e.target.value })}
                  required
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 12, border: '1.5px solid #CBD5E1' }}
                />
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button type="button" className="btn-outline" style={{ flex: 1 }} onClick={() => setEditingBadge(null)}>
                  Batal
                </button>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                  Simpan Lencana
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grant Badge Modal */}
      {selectedBadge && (
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
          onClick={() => setSelectedBadge(null)}
        >
          <div 
            style={{
              background: '#FFFFFF',
              borderRadius: 24,
              padding: 28,
              width: '100%',
              maxWidth: 400,
              textAlign: 'center'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🥇</div>
            <h3 style={{ fontFamily: 'var(--font-heading)', color: '#1E293B', marginBottom: 4 }}>
              Apresiasi {selectedBadge.title}
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: 18 }}>
              Pilih santri yang berhak menerima apresiasi istimewa ini:
            </p>

            <div style={{ marginBottom: 20 }}>
              <select
                value={grantModalStudentId}
                onChange={(e) => setGrantModalStudentId(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 12, border: '1.5px solid #CBD5E1' }}
              >
                {students.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.className || 'Kelas 2A'})</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button type="button" className="btn-outline" style={{ flex: 1, padding: 10 }} onClick={() => setSelectedBadge(null)}>
                Batal
              </button>
              <button 
                type="button" 
                className="btn-primary" 
                style={{ flex: 1, padding: 10 }}
                onClick={() => handleGrantBonus(selectedBadge)}
              >
                Kirim Apresiasi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
