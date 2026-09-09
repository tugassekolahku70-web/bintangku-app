import React, { useState, useRef } from 'react';
import TeacherSidebar from '../components/TeacherSidebar';
import { useApp } from '../context/AppContext';
import { 
  Users, 
  Search, 
  Plus, 
  Trash2, 
  Key, 
  Camera, 
  Star, 
  Menu, 
  CheckCircle2, 
  Edit,
  UserPlus,
  Lock,
  MinusCircle,
  PlusCircle,
  ShieldCheck,
  AlertCircle,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { triggerStarConfetti } from '../components/StarConfetti';
import { compressImageFile } from '../lib/imageUtils';

export default function TeacherStudents({ currentRoute, setCurrentRoute }) {
  const { 
    students, 
    classes, 
    addStudent, 
    editStudent,
    removeStudent, 
    awardStudentStars, 
    updateStudentPin, 
    updateStudentAvatar,
    updateStudentPhoto,
    settings 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const studentFileInputRef = useRef(null);
  const [uploadingStudentPhoto, setUploadingStudentPhoto] = useState(false);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [editStudentModal, setEditStudentModal] = useState(null);
  const [pinModalStudent, setPinModalStudent] = useState(null);
  const [avatarModalStudent, setAvatarModalStudent] = useState(null);
  const [starModalStudent, setStarModalStudent] = useState(null);

  // Form states for Add Student
  const [newName, setNewName] = useState('');
  const [newGender, setNewGender] = useState('male');
  const [newClassId, setNewClassId] = useState(classes[0]?.id || 'c-2a');
  const [newPin, setNewPin] = useState('1234');
  
  // Form states for Edit Student
  const [editForm, setEditForm] = useState({
    name: '',
    nisn: '',
    classId: '',
    className: '',
    gender: 'male',
    notes: ''
  });

  // Pin Edit state
  const [editPinValue, setEditPinValue] = useState('');
  const [editPinNotice, setEditPinNotice] = useState(false);

  // Star Management state
  const [starError, setStarError] = useState('');
  const [starSuccess, setStarSuccess] = useState('');

  // Avatar presets
  const AVATAR_PRESETS = [
    { emoji: '👦🏻', label: 'Santri Laki-laki 1' },
    { emoji: '👦🏽', label: 'Santri Laki-laki 2' },
    { emoji: '🧕🏻', label: 'Santriwati Pink' },
    { emoji: '🧕🏼', label: 'Santriwati Cokelat' },
    { emoji: '👨🏻‍🎓', label: 'Santri Hafidz' },
    { emoji: '⭐', label: 'Bintang Teladan' }
  ];

  const filteredStudents = students.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (s.nisn && s.nisn.includes(searchQuery));
    const matchClass = classFilter === 'all' || s.classId === classFilter || s.className === classFilter;
    return matchSearch && matchClass;
  });

  const handleCreateStudent = (e) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const matchedClass = classes.find(c => c.id === newClassId);

    addStudent({
      id: `s-${Date.now()}`,
      no: students.length + 1,
      name: newName,
      nisn: `0089${Math.floor(10 + Math.random() * 90)}`,
      pin: newPin || '1234',
      avatar: newGender === 'male' ? '👦🏻' : '🧕🏻',
      gender: newGender,
      classId: newClassId,
      className: matchedClass?.name || 'Kelas 2A',
      consistency: 100,
      longestStreak: 1,
      currentStreak: 1,
      habitStars: 50,
      teacherBonusStars: 0,
      totalStars: 50,
      status: 'Sangat Konsisten',
      statusType: 'success',
      notes: 'Santri baru terdaftar.'
    });

    setNewName('');
    setShowAddModal(false);
  };

  const handleOpenEditModal = (student) => {
    setEditForm({
      name: student.name,
      nisn: student.nisn || '',
      classId: student.classId || classes[0]?.id,
      className: student.className || classes[0]?.name,
      gender: student.gender || 'male',
      notes: student.notes || ''
    });
    setEditStudentModal(student);
  };

  const handleSaveEditStudent = (e) => {
    e.preventDefault();
    if (!editStudentModal) return;

    const matchedClass = classes.find(c => c.id === editForm.classId);

    editStudent(editStudentModal.id, {
      name: editForm.name,
      nisn: editForm.nisn,
      classId: editForm.classId,
      className: matchedClass ? matchedClass.name : editForm.className,
      gender: editForm.gender,
      notes: editForm.notes
    });

    setEditStudentModal(null);
  };

  const handleSavePin = (e) => {
    e.preventDefault();
    if (!editPinValue || editPinValue.length < 4) {
      alert('PIN harus terdiri dari 4 digit angka!');
      return;
    }
    updateStudentPin(pinModalStudent.id, editPinValue);
    setEditPinNotice(true);
    setTimeout(() => {
      setEditPinNotice(false);
      setPinModalStudent(null);
    }, 1200);
  };

  const handleSelectAvatar = (emoji) => {
    if (!avatarModalStudent) return;
    updateStudentAvatar(avatarModalStudent.id, emoji);
    // clear photoUrl if selecting emoji
    updateStudentPhoto(avatarModalStudent.id, null);
    setAvatarModalStudent(prev => ({ ...prev, avatar: emoji, photoUrl: null }));
    setTimeout(() => setAvatarModalStudent(null), 300);
  };

  const handleUploadStudentPhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !avatarModalStudent) return;
    setUploadingStudentPhoto(true);
    try {
      const compressed = await compressImageFile(file, 256, 256, 0.85);
      updateStudentPhoto(avatarModalStudent.id, compressed);
      setAvatarModalStudent(prev => ({ ...prev, photoUrl: compressed }));
    } catch (err) {
      alert('Gagal memproses foto: ' + err.message);
    } finally {
      setUploadingStudentPhoto(false);
      if (studentFileInputRef.current) studentFileInputRef.current.value = '';
    }
  };

  const handleRemoveStudentPhoto = () => {
    if (!avatarModalStudent) return;
    updateStudentPhoto(avatarModalStudent.id, null);
    setAvatarModalStudent(prev => ({ ...prev, photoUrl: null }));
  };

  const handleAdjustStars = async (points) => {
    if (!starModalStudent) return;
    setStarError('');
    setStarSuccess('');

    const res = await awardStudentStars(starModalStudent.id, points);
    if (res && res.success === false) {
      setStarError(res.message);
    } else {
      setStarSuccess(points > 0 ? `Berhasil menambah +${points} bintang bonus!` : `Berhasil mengurangi ${points} bintang bonus!`);
      // refresh student in modal
      const updated = students.find(s => s.id === starModalStudent.id);
      if (updated) {
        setStarModalStudent({ ...updated });
      }
    }
  };

  return (
    <div className="teacher-container">
      <TeacherSidebar 
        currentRoute="teacher_students" 
        setCurrentRoute={setCurrentRoute}
        isOpenMobile={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      <main className="teacher-main-layout">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button className="btn-mobile-burger" onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}>
              <Menu size={22} />
            </button>
            <div>
              <h1 className="teacher-welcome-title">Data Siswa & Santri</h1>
              <p className="teacher-welcome-subtitle">
                Atur informasi santri, kode akses PIN, foto profil, dan perolehan bintang
              </p>
            </div>
          </div>

          <button 
            className="btn-primary" 
            onClick={() => setShowAddModal(true)}
            style={{ padding: '12px 22px' }}
          >
            <UserPlus size={18} />
            <span>Tambah Siswa Baru</span>
          </button>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="teacher-table-card" style={{ marginBottom: 20, padding: '16px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div className="table-search-input" style={{ width: 300 }}>
              <Search size={16} color="#64748B" />
              <input 
                type="text" 
                placeholder="Cari nama atau NISN..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748B' }}>Filter Kelas:</span>
              <select
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                className="btn-table-filter"
                style={{ cursor: 'pointer', outline: 'none' }}
              >
                <option value="all">Semua Kelas ({students.length})</option>
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Student Data Table */}
        <div className="teacher-table-card">
          <div className="data-table-wrapper">
            <table className="student-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Foto & Nama Santri</th>
                  <th>Kelas</th>
                  <th>Kode PIN</th>
                  <th>Konsistensi</th>
                  <th>Total Bintang</th>
                  <th style={{ textAlign: 'center', width: 280 }}>Kelola Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '36px', color: '#94A3B8' }}>
                      Belum ada siswa terdaftar. Klik tombol <strong>"Tambah Siswa Baru"</strong> di atas.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((s, idx) => (
                    <tr key={s.id}>
                      <td style={{ color: '#64748B', fontWeight: 600 }}>{idx + 1}</td>
                      <td>
                        <div className="student-name-cell">
                          <div 
                            className="student-avatar" 
                            onClick={() => setAvatarModalStudent(s)}
                            style={{ 
                              cursor: 'pointer', 
                              position: 'relative',
                              overflow: 'hidden',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: '#F1F5F9'
                            }}
                            title="Klik untuk ganti foto profil santri"
                          >
                            {s.photoUrl ? (
                              <img 
                                src={s.photoUrl} 
                                alt={s.name} 
                                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} 
                              />
                            ) : (
                              <span>{s.avatar}</span>
                            )}
                            <div style={{
                              position: 'absolute',
                              bottom: 0,
                              right: 0,
                              background: '#FFFFFF',
                              borderRadius: '50%',
                              padding: 3,
                              boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              <Camera size={10} color="#64748B" />
                            </div>
                          </div>
                          <div>
                            <strong style={{ color: '#1E293B', display: 'block' }}>{s.name}</strong>
                            <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>NISN: {s.nisn || `0089${idx}`}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontWeight: 600, color: 'var(--primary-700)' }}>
                          {s.className || 'Kelas 2A'}
                        </span>
                      </td>
                      <td>
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          background: '#FAF8F5',
                          border: '1px solid #E2E8F0',
                          borderRadius: 8,
                          padding: '3px 8px',
                          fontFamily: 'monospace',
                          fontWeight: 700,
                          letterSpacing: 2
                        }}>
                          <Key size={12} color="#94A3B8" />
                          <span>{s.pin || '1234'}</span>
                        </div>
                      </td>
                      <td>
                        <span style={{
                          fontWeight: 700,
                          color: s.consistency >= 80 ? '#059669' : s.consistency >= 60 ? '#D97706' : '#DC2626'
                        }}>
                          {s.consistency}%
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 700, color: '#92400E' }}>
                          <span>{s.totalStars}</span>
                          <Star size={14} fill="#F5A623" color="#F5A623" />
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                          {/* EDIT DATA SISWA */}
                          <button
                            onClick={() => handleOpenEditModal(s)}
                            style={{
                              padding: '6px 10px',
                              background: '#F8FAFC',
                              border: '1px solid #CBD5E1',
                              borderRadius: 8,
                              color: '#334155',
                              fontSize: '0.78rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 4
                            }}
                            title="Edit Data Siswa"
                          >
                            <Edit size={13} />
                            <span>Edit</span>
                          </button>

                          {/* UBAH PIN */}
                          <button
                            onClick={() => {
                              setPinModalStudent(s);
                              setEditPinValue(s.pin || '1234');
                            }}
                            style={{
                              padding: '6px 10px',
                              background: '#EFF6FF',
                              border: '1px solid #BFDBFE',
                              borderRadius: 8,
                              color: '#1D4ED8',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 4
                            }}
                            title="Ubah Kode PIN"
                          >
                            <Key size={13} />
                            <span>PIN</span>
                          </button>

                          {/* KELOLA BINTANG (+/-) */}
                          <button
                            onClick={() => {
                              setStarModalStudent(s);
                              setStarError('');
                              setStarSuccess('');
                            }}
                            style={{
                              padding: '6px 10px',
                              background: '#FFFBEB',
                              border: '1px solid #FDE68A',
                              borderRadius: 8,
                              color: '#B45309',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                            title="Kelola Bintang (+/-)"
                          >
                            ⭐ Bintang
                          </button>

                          {/* HAPUS SANTRI */}
                          <button
                            onClick={() => {
                              if (confirm(`Yakin ingin menghapus data santri ${s.name}?`)) {
                                removeStudent(s.id);
                              }
                            }}
                            style={{
                              padding: '6px 8px',
                              background: '#FEF2F2',
                              border: '1px solid #FECACA',
                              borderRadius: 8,
                              color: '#DC2626',
                              cursor: 'pointer'
                            }}
                            title="Hapus Santri"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* MODAL: EDIT DATA SISWA LENGKAP */}
      {editStudentModal && (
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
          onClick={() => setEditStudentModal(null)}
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
              Edit Data Siswa
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: 18 }}>
              Perbarui rincian identitas dan rombel kelas santri
            </p>

            <form onSubmit={handleSaveEditStudent}>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: 4 }}>
                  Nama Lengkap Siswa
                </label>
                <input 
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  required
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 12, border: '1.5px solid #CBD5E1' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: 4 }}>
                    NISN
                  </label>
                  <input 
                    type="text"
                    value={editForm.nisn}
                    onChange={(e) => setEditForm({ ...editForm, nisn: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 12, border: '1.5px solid #CBD5E1' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: 4 }}>
                    Jenis Kelamin
                  </label>
                  <select
                    value={editForm.gender}
                    onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 12, border: '1.5px solid #CBD5E1' }}
                  >
                    <option value="male">Laki-laki 👦🏻</option>
                    <option value="female">Perempuan 🧕🏻</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: 4 }}>
                  Rombel Kelas
                </label>
                <select
                  value={editForm.classId}
                  onChange={(e) => setEditForm({ ...editForm, classId: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 12, border: '1.5px solid #CBD5E1' }}
                >
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: 4 }}>
                  Catatan Guru / Wali Kelas
                </label>
                <textarea 
                  rows={2}
                  value={editForm.notes}
                  onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  placeholder="Catatan kebiasaan atau perkembangan santri..."
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 12, border: '1.5px solid #CBD5E1' }}
                />
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button type="button" className="btn-outline" style={{ flex: 1 }} onClick={() => setEditStudentModal(null)}>
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

      {/* MODAL: KELOLA BINTANG (+/- DENGAN PROTEKSI BINTANG LAPORAN SISWA) */}
      {starModalStudent && (
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
          onClick={() => setStarModalStudent(null)}
        >
          <div 
            style={{
              background: '#FFFFFF',
              borderRadius: 24,
              padding: 28,
              width: '100%',
              maxWidth: 420,
              textAlign: 'center'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: 6 }}>⭐</div>
            <h3 style={{ fontFamily: 'var(--font-heading)', color: '#1E293B', marginBottom: 4 }}>
              Kelola Bintang: {starModalStudent.name}
            </h3>
            
            {/* Star Breakdown Card */}
            <div style={{
              background: '#FAF8F5',
              borderRadius: 16,
              padding: '14px 18px',
              margin: '14px 0',
              border: '1px solid #F1ECE4',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 10,
              textAlign: 'left'
            }}>
              <div>
                <span style={{ fontSize: '0.74rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Lock size={12} color="#059669" /> Bintang Pembiasaan
                </span>
                <strong style={{ fontSize: '1.1rem', color: '#059669' }}>
                  {starModalStudent.habitStars !== undefined ? starModalStudent.habitStars : starModalStudent.totalStars} ⭐
                </strong>
                <span style={{ fontSize: '0.68rem', color: '#059669', display: 'block' }}>(Terlindungi 🔒)</span>
              </div>

              <div>
                <span style={{ fontSize: '0.74rem', color: '#64748B' }}>Bonus Guru Saat Ini</span>
                <strong style={{ fontSize: '1.1rem', color: '#D97706' }}>
                  {starModalStudent.teacherBonusStars || 0} ⭐
                </strong>
                <span style={{ fontSize: '0.68rem', color: '#64748B', display: 'block' }}>(Dapat ditambah/kurang)</span>
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1E293B', display: 'block', marginBottom: 8 }}>
                ➕ Tambah Bonus Guru:
              </span>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
                {[5, 10, 20, 50].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handleAdjustStars(val)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: 10,
                      border: '1px solid #FDE68A',
                      background: '#FFFBEB',
                      color: '#B45309',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      cursor: 'pointer'
                    }}
                  >
                    +{val} ⭐
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 18 }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1E293B', display: 'block', marginBottom: 8 }}>
                ➖ Kurangi Bonus Guru:
              </span>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
                {[5, 10, 20].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handleAdjustStars(-val)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: 10,
                      border: '1px solid #FECACA',
                      background: '#FEF2F2',
                      color: '#DC2626',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      cursor: 'pointer'
                    }}
                  >
                    -{val} ⭐
                  </button>
                ))}
              </div>
            </div>

            {starError && (
              <div style={{
                background: '#FEF2F2',
                border: '1px solid #FECACA',
                borderRadius: 12,
                padding: '10px 12px',
                color: '#DC2626',
                fontSize: '0.78rem',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                marginBottom: 14,
                textAlign: 'left'
              }}>
                <AlertCircle size={18} style={{ flexShrink: 0 }} />
                <span>{starError}</span>
              </div>
            )}

            {starSuccess && (
              <div style={{
                background: '#ECFDF5',
                border: '1px solid #A7F3D0',
                borderRadius: 12,
                padding: '10px 12px',
                color: '#059669',
                fontSize: '0.82rem',
                fontWeight: 600,
                marginBottom: 14
              }}>
                ✓ {starSuccess}
              </div>
            )}

            <button 
              type="button" 
              className="btn-outline" 
              style={{ width: '100%', padding: 10 }}
              onClick={() => setStarModalStudent(null)}
            >
              Selesai & Tutup
            </button>
          </div>
        </div>
      )}

      {/* MODAL: UBAH KODE PIN SANTRI */}
      {pinModalStudent && (
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
          onClick={() => setPinModalStudent(null)}
        >
          <div 
            style={{
              background: '#FFFFFF',
              borderRadius: 24,
              padding: 28,
              width: '100%',
              maxWidth: 380,
              textAlign: 'center'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              width: 50,
              height: 50,
              borderRadius: '50%',
              background: '#EFF6FF',
              color: '#1D4ED8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px'
            }}>
              <Key size={26} />
            </div>

            <h3 style={{ fontFamily: 'var(--font-heading)', color: '#1E293B', marginBottom: 4 }}>
              Ubah Kode PIN Santri
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: 20 }}>
              Atur ulang kode PIN masuk untuk <strong>{pinModalStudent.name}</strong>
            </p>

            <form onSubmit={handleSavePin}>
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: 6 }}>
                  Kode PIN 4-Digit Baru
                </label>
                <input 
                  type="password"
                  maxLength={4}
                  value={editPinValue}
                  onChange={(e) => setEditPinValue(e.target.value)}
                  placeholder="Contoh: 5678"
                  required
                  style={{
                    width: 140,
                    padding: '10px',
                    fontSize: '1.6rem',
                    textAlign: 'center',
                    letterSpacing: 8,
                    fontWeight: 700,
                    borderRadius: 14,
                    border: '2px solid var(--primary-700)',
                    outline: 'none',
                    margin: '0 auto'
                  }}
                />
              </div>

              {editPinNotice && (
                <div style={{ color: '#059669', fontSize: '0.82rem', fontWeight: 600, marginBottom: 12 }}>
                  ✓ PIN berhasil diperbarui!
                </div>
              )}

              <div style={{ display: 'flex', gap: 10 }}>
                <button 
                  type="button" 
                  className="btn-outline" 
                  style={{ flex: 1, padding: 10 }}
                  onClick={() => setPinModalStudent(null)}
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="btn-primary" 
                  style={{ flex: 1, padding: 10 }}
                >
                  Simpan PIN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: GANTI FOTO PROFIL SANTRI */}
      {avatarModalStudent && (
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
          onClick={() => setAvatarModalStudent(null)}
        >
          <div 
            style={{
              background: '#FFFFFF',
              borderRadius: 24,
              padding: 28,
              width: '100%',
              maxWidth: 440,
              textAlign: 'center'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontFamily: 'var(--font-heading)', color: '#1E293B', marginBottom: 4 }}>
              Foto Profil: {avatarModalStudent.name}
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: 18 }}>
              Unggah foto asli santri dari perangkat atau pilih avatar karakter islami
            </p>

            {/* Current Active Preview */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginBottom: 20,
              background: '#FAF8F5',
              borderRadius: 18,
              padding: '16px 20px',
              border: '1.5px dashed #E2E8F0'
            }}>
              <div style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: '#FFFFFF',
                border: '3px solid var(--primary-700)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.5rem',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(11, 77, 60, 0.15)',
                marginBottom: 10
              }}>
                {avatarModalStudent.photoUrl ? (
                  <img 
                    src={avatarModalStudent.photoUrl} 
                    alt={avatarModalStudent.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                ) : (
                  avatarModalStudent.avatar
                )}
              </div>

              <input 
                ref={studentFileInputRef}
                type="file"
                accept="image/*"
                onChange={handleUploadStudentPhoto}
                style={{ display: 'none' }}
              />

              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => studentFileInputRef.current?.click()}
                  disabled={uploadingStudentPhoto}
                  style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                >
                  <Upload size={15} />
                  <span>{uploadingStudentPhoto ? 'Memproses...' : 'Unggah dari Perangkat'}</span>
                </button>

                {avatarModalStudent.photoUrl && (
                  <button
                    type="button"
                    className="btn-outline"
                    onClick={handleRemoveStudentPhoto}
                    style={{ padding: '8px 14px', fontSize: '0.82rem', color: '#DC2626', borderColor: '#FECACA' }}
                  >
                    Gunakan Emoji
                  </button>
                )}
              </div>
              <span style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: 6 }}>
                Format JPG/PNG, dikompres otomatis ~20KB hemat memori
              </span>
            </div>

            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B', marginBottom: 10, textAlign: 'left' }}>
              Atau Pilih Karakter Avatar Islami:
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 20 }}>
              {AVATAR_PRESETS.map((p, i) => (
                <div 
                  key={i}
                  onClick={() => handleSelectAvatar(p.emoji)}
                  style={{
                    background: (!avatarModalStudent.photoUrl && avatarModalStudent.avatar === p.emoji) ? '#FEF3C7' : '#FAF8F5',
                    border: (!avatarModalStudent.photoUrl && avatarModalStudent.avatar === p.emoji) ? '2px solid #F5A623' : '1px solid #E2E8F0',
                    borderRadius: 14,
                    padding: '10px 6px',
                    cursor: 'pointer',
                    transition: 'transform 0.15s ease'
                  }}
                >
                  <div style={{ fontSize: '2rem', marginBottom: 2 }}>{p.emoji}</div>
                  <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 600 }}>{p.label}</span>
                </div>
              ))}
            </div>

            <button 
              type="button" 
              className="btn-outline" 
              style={{ width: '100%', padding: 10 }}
              onClick={() => setAvatarModalStudent(null)}
            >
              Selesai & Tutup
            </button>
          </div>
        </div>
      )}

      {/* MODAL: TAMBAH SISWA BARU */}
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
              maxWidth: 420
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary-700)', marginBottom: 16 }}>
              Daftarkan Santri Baru
            </h3>

            <form onSubmit={handleCreateStudent}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: 4 }}>
                  Nama Lengkap Santri
                </label>
                <input 
                  type="text"
                  placeholder="Contoh: Bilal Ibnu Rabah"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 12, border: '1.5px solid #CBD5E1' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: 4 }}>
                    Kelas
                  </label>
                  <select
                    value={newClassId}
                    onChange={(e) => setNewClassId(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 12, border: '1.5px solid #CBD5E1' }}
                  >
                    {classes.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: 4 }}>
                    Gender
                  </label>
                  <select
                    value={newGender}
                    onChange={(e) => setNewGender(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 12, border: '1.5px solid #CBD5E1' }}
                  >
                    <option value="male">Laki-laki 👦🏻</option>
                    <option value="female">Perempuan 🧕🏻</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: 4 }}>
                  Set Kode PIN Awal (4 Digit)
                </label>
                <input 
                  type="password"
                  maxLength={4}
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  placeholder="1234"
                  required
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 12, border: '1.5px solid #CBD5E1', textAlign: 'center', letterSpacing: 4, fontWeight: 700 }}
                />
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button type="button" className="btn-outline" style={{ flex: 1 }} onClick={() => setShowAddModal(false)}>
                  Batal
                </button>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                  Simpan Santri
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
