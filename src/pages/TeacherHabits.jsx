import React, { useState } from 'react';
import TeacherSidebar from '../components/TeacherSidebar';
import { useApp } from '../context/AppContext';
import { CalendarCheck, Plus, Trash2, Edit, Star, Menu, Sparkles, CheckCircle2 } from 'lucide-react';
import { RenderPremiumHabitIcon } from '../components/PremiumIcons';
import { triggerStarConfetti } from '../components/StarConfetti';

export default function TeacherHabits({ currentRoute, setCurrentRoute }) {
  const { habits, addHabit, removeHabit, editHabit } = useApp();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);

  // New habit form
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState('ibadah');
  const [newStars, setNewStars] = useState(10);
  const [newIcon, setNewIcon] = useState('mosque_subuh');

  // Edit habit form
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    category: 'ibadah',
    stars: 10,
    icon: 'mosque_subuh'
  });

  const handleAddHabit = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addHabit({
      id: `h-${Date.now()}`,
      title: newTitle,
      description: newDesc,
      category: newCategory,
      icon: newIcon,
      stars: Number(newStars),
      isActive: true,
      completed: false
    });

    setNewTitle('');
    setNewDesc('');
    setShowAddModal(false);
  };

  const handleOpenEditModal = (habit) => {
    setEditForm({
      title: habit.title,
      description: habit.description || '',
      category: habit.category || 'ibadah',
      stars: habit.stars || 10,
      icon: habit.icon || 'mosque_subuh'
    });
    setEditingHabit(habit);
  };

  const handleSaveEditHabit = (e) => {
    e.preventDefault();
    if (!editingHabit || !editForm.title.trim()) return;

    editHabit(editingHabit.id, {
      title: editForm.title,
      description: editForm.description,
      category: editForm.category,
      stars: Number(editForm.stars),
      icon: editForm.icon
    });

    setEditingHabit(null);
  };

  const handleToggleActive = (habit) => {
    editHabit(habit.id, { isActive: !habit.isActive });
  };

  return (
    <div className="teacher-container">
      <TeacherSidebar 
        currentRoute="teacher_habits" 
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
              <h1 className="teacher-welcome-title">Kelola Kebiasaan Ibadah</h1>
              <p className="teacher-welcome-subtitle">
                Atur dan edit item checklist pembiasaan santri beserta bobot hadiah bintang
              </p>
            </div>
          </div>

          <button 
            className="btn-primary" 
            onClick={() => setShowAddModal(true)}
            style={{ padding: '12px 22px' }}
          >
            <Plus size={18} />
            <span>Tambah Kebiasaan Baru</span>
          </button>
        </div>

        {/* Habits List Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 18 }}>
          {habits.map((habit) => (
            <div 
              key={habit.id}
              style={{
                background: '#FFFFFF',
                borderRadius: 20,
                padding: '20px 22px',
                border: '1px solid #F1ECE4',
                boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 44, height: 44 }}>
                      <RenderPremiumHabitIcon type={habit.icon} size={44} />
                    </div>
                    <div>
                      <strong style={{ fontSize: '1.05rem', color: '#1E293B', display: 'block' }}>
                        {habit.title}
                      </strong>
                      <span style={{ 
                        fontSize: '0.75rem', 
                        background: '#FAF5EF', 
                        color: 'var(--primary-700)', 
                        padding: '2px 8px', 
                        borderRadius: 6,
                        fontWeight: 700 
                      }}>
                        {(habit.category || 'ibadah').toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <span style={{
                    background: '#FFFBEB',
                    border: '1px solid #FDE68A',
                    color: '#B45309',
                    padding: '4px 10px',
                    borderRadius: 999,
                    fontWeight: 700,
                    fontSize: '0.82rem'
                  }}>
                    +{habit.stars} ⭐ Bintang
                  </span>
                </div>

                <p style={{ fontSize: '0.85rem', color: '#64748B', lineHeight: 1.4, marginBottom: 16 }}>
                  {habit.description}
                </p>
              </div>

              <div style={{ 
                borderTop: '1px solid #F8FAFC', 
                paddingTop: 12, 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center' 
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button
                    onClick={() => handleToggleActive(habit)}
                    style={{
                      border: 'none',
                      background: habit.isActive !== false ? '#ECFDF5' : '#F1F5F9',
                      color: habit.isActive !== false ? '#059669' : '#94A3B8',
                      padding: '5px 12px',
                      borderRadius: 999,
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {habit.isActive !== false ? '● Aktif' : '○ Non-Aktif'}
                  </button>

                  <button
                    onClick={() => handleOpenEditModal(habit)}
                    style={{
                      border: '1px solid #CBD5E1',
                      background: '#F8FAFC',
                      color: '#475569',
                      padding: '5px 10px',
                      borderRadius: 8,
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4
                    }}
                    title="Edit Kebiasaan Ini"
                  >
                    <Edit size={13} />
                    <span>Edit</span>
                  </button>
                </div>

                <button
                  onClick={() => {
                    if (confirm(`Yakin ingin menghapus kebiasaan ${habit.title}?`)) {
                      removeHabit(habit.id);
                    }
                  }}
                  style={{
                    color: '#DC2626',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 6
                  }}
                  title="Hapus Kebiasaan"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* EDIT HABIT MODAL */}
      {editingHabit && (
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
          onClick={() => setEditingHabit(null)}
        >
          <div 
            style={{
              background: '#FFFFFF',
              borderRadius: 24,
              padding: 28,
              width: '100%',
              maxWidth: 440
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary-700)', marginBottom: 4 }}>
              Edit Kebiasaan Ibadah
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: 18 }}>
              Perbarui judul, pengingat, hadiah bintang, dan ikon kebiasaan
            </p>

            <form onSubmit={handleSaveEditHabit}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: 4 }}>
                  Nama Kebiasaan
                </label>
                <input 
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  required
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 12, border: '1.5px solid #CBD5E1' }}
                />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: 4 }}>
                  Deskripsi / Pengingat
                </label>
                <input 
                  type="text"
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  required
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 12, border: '1.5px solid #CBD5E1' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: 4 }}>
                    Kategori
                  </label>
                  <select
                    value={editForm.category}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: 12, border: '1.5px solid #CBD5E1' }}
                  >
                    <option value="ibadah">Ibadah Fardhu</option>
                    <option value="sunnah">Sunnah Harian</option>
                    <option value="akhlak">Akhlak Mulia</option>
                    <option value="kemandirian">Kemandirian</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: 4 }}>
                    Hadiah Bintang
                  </label>
                  <select
                    value={editForm.stars}
                    onChange={(e) => setEditForm({ ...editForm, stars: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: 12, border: '1.5px solid #CBD5E1' }}
                  >
                    <option value={10}>+10 ⭐ Bintang</option>
                    <option value={15}>+15 ⭐ Bintang</option>
                    <option value={20}>+20 ⭐ Bintang</option>
                    <option value={25}>+25 ⭐ Bintang</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: 6 }}>
                  Pilih Ikon Premium
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8 }}>
                  {['mosque_subuh', 'mosque_dzuhur', 'mosque_maghrib', 'quran', 'moon_sleep', 'dhuha'].map((ic) => (
                    <div
                      key={ic}
                      onClick={() => setEditForm({ ...editForm, icon: ic })}
                      style={{
                        padding: 8,
                        borderRadius: 12,
                        border: editForm.icon === ic ? '2px solid var(--primary-700)' : '1px solid #E2E8F0',
                        background: editForm.icon === ic ? 'var(--primary-50)' : '#FAF8F5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }}
                    >
                      <RenderPremiumHabitIcon type={ic} size={30} />
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button type="button" className="btn-outline" style={{ flex: 1 }} onClick={() => setEditingHabit(null)}>
                  Batal
                </button>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Habit Modal */}
      {showAddModal && (
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
          onClick={() => setShowAddModal(false)}
        >
          <div 
            style={{
              background: '#FFFFFF',
              borderRadius: 24,
              padding: 28,
              width: '100%',
              maxWidth: 440
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary-700)', marginBottom: 16 }}>
              Tambah Kebiasaan Ibadah Baru
            </h3>

            <form onSubmit={handleAddHabit}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: 4 }}>
                  Nama Kebiasaan
                </label>
                <input 
                  type="text"
                  placeholder="Contoh: Sholat Dhuha / Sedekah Subuh"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 12, border: '1.5px solid #CBD5E1' }}
                />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: 4 }}>
                  Deskripsi / Pengingat
                </label>
                <input 
                  type="text"
                  placeholder="Contoh: Awali pagi dengan 2 rakaat dhuha"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 12, border: '1.5px solid #CBD5E1' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: 4 }}>
                    Kategori
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: 12, border: '1.5px solid #CBD5E1' }}
                  >
                    <option value="ibadah">Ibadah Fardhu</option>
                    <option value="sunnah">Sunnah Harian</option>
                    <option value="akhlak">Akhlak Mulia</option>
                    <option value="kemandirian">Kemandirian</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: 4 }}>
                    Hadiah Bintang
                  </label>
                  <select
                    value={newStars}
                    onChange={(e) => setNewStars(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: 12, border: '1.5px solid #CBD5E1' }}
                  >
                    <option value={10}>+10 ⭐ Bintang</option>
                    <option value={15}>+15 ⭐ Bintang</option>
                    <option value={20}>+20 ⭐ Bintang</option>
                    <option value={25}>+25 ⭐ Bintang</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: 6 }}>
                  Pilih Ikon Premium
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8 }}>
                  {['mosque_subuh', 'mosque_dzuhur', 'mosque_maghrib', 'quran', 'moon_sleep', 'dhuha'].map((ic) => (
                    <div
                      key={ic}
                      onClick={() => setNewIcon(ic)}
                      style={{
                        padding: 8,
                        borderRadius: 12,
                        border: newIcon === ic ? '2px solid var(--primary-700)' : '1px solid #E2E8F0',
                        background: newIcon === ic ? 'var(--primary-50)' : '#FAF8F5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }}
                    >
                      <RenderPremiumHabitIcon type={ic} size={30} />
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button type="button" className="btn-outline" style={{ flex: 1 }} onClick={() => setShowAddModal(false)}>
                  Batal
                </button>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                  Simpan Kebiasaan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
