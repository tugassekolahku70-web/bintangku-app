import React, { useState } from 'react';
import TeacherSidebar from '../components/TeacherSidebar';
import { useApp } from '../context/AppContext';
import { 
  School, 
  UserPlus, 
  Users, 
  Search, 
  Plus, 
  Trash2, 
  Edit, 
  Menu, 
  CheckCircle2, 
  BookOpen, 
  Layers,
  GraduationCap,
  Sparkles
} from 'lucide-react';
import { triggerStarConfetti } from '../components/StarConfetti';

export default function TeacherClasses({ currentRoute, setCurrentRoute }) {
  const { 
    classes, 
    addClass, 
    editClass, 
    removeClass, 
    students, 
    addStudent, 
    removeStudent, 
    settings 
  } = useApp();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [selectedClassFilter, setSelectedClassFilter] = useState('all');
  const [searchStudent, setSearchStudent] = useState('');

  // Modals
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);

  // Form: Add Class
  const [classNameInput, setClassNameInput] = useState('');
  const [classSubInput, setClassSubInput] = useState('');
  const [classLevelInput, setClassLevelInput] = useState('Tingkat Dasar / Menengah');

  // Form: Add Student
  const [newName, setNewName] = useState('');
  const [newGender, setNewGender] = useState('male');
  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || '');

  // Handle Add Class
  const handleSaveAddClass = (e) => {
    e.preventDefault();
    if (!classNameInput.trim()) return;

    const newCls = {
      id: `cls-${Date.now()}`,
      name: classNameInput.trim(),
      subtitle: classSubInput.trim() || 'Rombel Aktif',
      level: classLevelInput,
      academicYear: '2025/2026',
      color: '#0B4D3C'
    };

    addClass(newCls);
    setClassNameInput('');
    setClassSubInput('');
    setShowAddClassModal(false);
    triggerStarConfetti();
  };

  // Handle Edit Class
  const handleSaveEditClass = (e) => {
    e.preventDefault();
    if (!editingClass || !editingClass.name.trim()) return;

    editClass(editingClass.id, {
      name: editingClass.name.trim(),
      subtitle: editingClass.subtitle || 'Rombel Aktif',
      academicYear: editingClass.academicYear || '2025/2026'
    });

    setEditingClass(null);
    triggerStarConfetti();
  };

  // Handle Delete Class
  const handleDeleteClass = (cls) => {
    const studentCount = students.filter(s => s.classId === cls.id || s.className === cls.name).length;
    if (studentCount > 0) {
      if (!confirm(`Kelas "${cls.name}" masih memiliki ${studentCount} santri terdaftar. Yakin ingin menghapus kelas ini? Santri akan tetap tersimpan.`)) {
        return;
      }
    } else {
      if (!confirm(`Yakin ingin menghapus kelas "${cls.name}"?`)) {
        return;
      }
    }
    removeClass(cls.id);
  };

  // Handle Add Student
  const handleAddStudent = (e) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const targetClassId = selectedClassId || classes[0]?.id || 'cls-1';
    const matchedClass = classes.find(c => c.id === targetClassId);

    addStudent({
      id: `s-${Date.now()}`,
      no: students.length + 1,
      name: newName.trim(),
      avatar: newGender === 'male' ? '👦🏻' : '🧕🏻',
      gender: newGender,
      classId: targetClassId,
      className: matchedClass?.name || 'Kelas Belajar',
      consistency: 100,
      longestStreak: 1,
      currentStreak: 1,
      habitStars: 50,
      teacherBonusStars: 0,
      totalStars: 50,
      status: 'Sangat Konsisten',
      statusType: 'success',
      notes: 'Siswa baru terdaftar.'
    });

    setNewName('');
    setShowAddStudentModal(false);
    triggerStarConfetti();
  };

  const handleDeleteStudent = (id, name) => {
    if (confirm(`Yakin ingin menghapus data santri "${name}"?`)) {
      removeStudent(id);
    }
  };

  // Filtered Students
  const filteredStudents = students.filter(s => {
    const matchClass = selectedClassFilter === 'all' || s.classId === selectedClassFilter || s.className === selectedClassFilter;
    const matchSearch = s.name.toLowerCase().includes(searchStudent.toLowerCase());
    return matchClass && matchSearch;
  });

  return (
    <div className="teacher-container">
      <TeacherSidebar 
        currentRoute="teacher_classes" 
        setCurrentRoute={setCurrentRoute}
        isOpenMobile={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      <main className="teacher-main-layout">
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button 
              className="btn-mobile-burger"
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            >
              <Menu size={22} />
            </button>
            <div>
              <h1 className="teacher-welcome-title">Manajemen Kelas & Rombel</h1>
              <p className="teacher-welcome-subtitle">
                Atur rombel belajar, wali pengampu, dan daftar santri di {settings?.schoolName || 'SDIT Bintang Cemerlang'}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button 
              className="btn-outline" 
              onClick={() => setShowAddClassModal(true)}
              style={{ padding: '10px 18px', background: '#FFFFFF' }}
            >
              <Plus size={16} />
              <span>Tambah Kelas Baru</span>
            </button>

            <button 
              className="btn-primary" 
              onClick={() => {
                if (classes.length > 0) {
                  setSelectedClassId(classes[0].id);
                }
                setShowAddStudentModal(true);
              }}
              style={{ padding: '10px 20px' }}
            >
              <UserPlus size={16} />
              <span>Tambah Santri Baru</span>
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 18, marginBottom: 28 }}>
          <div style={{ background: '#FFFFFF', borderRadius: 20, padding: 20, border: '1px solid #F1EAE0' }}>
            <span style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 600 }}>Rombel Kelas Aktif</span>
            <div style={{ fontSize: '1.9rem', fontFamily: 'var(--font-heading)', color: '#1E293B', fontWeight: 700 }}>
              {classes.length} Kelas
            </div>
            <span style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 600 }}>Tahun Ajaran 2025/2026</span>
          </div>

          <div style={{ background: '#FFFFFF', borderRadius: 20, padding: 20, border: '1px solid #F1EAE0' }}>
            <span style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 600 }}>Total Santri Terdaftar</span>
            <div style={{ fontSize: '1.9rem', fontFamily: 'var(--font-heading)', color: '#1E293B', fontWeight: 700 }}>
              {students.length} Santri
            </div>
            <span style={{ fontSize: '0.78rem', color: '#64748B' }}>Aktif Membina Kebiasaan</span>
          </div>

          <div style={{ background: '#FFFFFF', borderRadius: 20, padding: 20, border: '1px solid #F1EAE0' }}>
            <span style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 600 }}>Ustadz / Ustadzah Pengampu</span>
            <div style={{ fontSize: '1.3rem', fontFamily: 'var(--font-heading)', color: '#1E293B', fontWeight: 700 }}>
              {settings?.teacherName || 'Ustadzah Desiana'}
            </div>
            <span style={{ fontSize: '0.78rem', color: 'var(--primary-700)', fontWeight: 600 }}>{settings?.schoolName || 'SDIT Bintang Cemerlang'}</span>
          </div>
        </div>

        {/* Section: Daftar Kartu Kelas */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', color: '#1E293B', fontSize: '1.15rem' }}>
              Daftar Rombel & Ruang Belajar
            </h3>
            <span style={{ fontSize: '0.82rem', color: '#64748B' }}>
              Klik kartu kelas untuk memfilter daftar santri
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {classes.map(c => {
              const enrolledCount = students.filter(s => s.classId === c.id || s.className === c.name).length;
              const isSelected = selectedClassFilter === c.id;

              return (
                <div 
                  key={c.id} 
                  style={{
                    background: isSelected ? '#F0FDF4' : '#FFFFFF',
                    border: isSelected ? '2px solid var(--primary-700)' : '1px solid #E2E8F0',
                    borderRadius: 18,
                    padding: '18px 20px',
                    boxShadow: isSelected ? '0 8px 20px rgba(11, 77, 60, 0.12)' : '0 2px 8px rgba(0,0,0,0.03)',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer'
                  }}
                  onClick={() => setSelectedClassFilter(isSelected ? 'all' : c.id)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: isSelected ? 'var(--primary-700)' : '#FAF8F5',
                      color: isSelected ? '#FFFFFF' : 'var(--primary-700)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <School size={22} />
                    </div>

                    <div style={{ display: 'flex', gap: 6 }} onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setEditingClass({ ...c })}
                        style={{
                          padding: 6,
                          background: '#F8FAFC',
                          border: '1px solid #CBD5E1',
                          borderRadius: 8,
                          cursor: 'pointer',
                          color: '#64748B'
                        }}
                        title="Edit Nama Kelas"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteClass(c)}
                        style={{
                          padding: 6,
                          background: '#FEF2F2',
                          border: '1px solid #FECACA',
                          borderRadius: 8,
                          cursor: 'pointer',
                          color: '#DC2626'
                        }}
                        title="Hapus Kelas"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <h4 style={{ fontFamily: 'var(--font-heading)', color: '#1E293B', fontSize: '1.05rem', marginBottom: 4 }}>
                    {c.name}
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: 14 }}>
                    {c.subtitle || 'Tahun Ajaran 2025/2026'}
                  </p>

                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    borderTop: '1px solid #F1ECE4', 
                    paddingTop: 12,
                    fontSize: '0.82rem'
                  }}>
                    <span style={{ color: '#64748B' }}>Jumlah Santri:</span>
                    <strong style={{ color: 'var(--primary-700)', fontWeight: 700 }}>
                      {enrolledCount} Santri
                    </strong>
                  </div>
                </div>
              );
            })}

            {/* Quick Add Class Card */}
            <div 
              onClick={() => setShowAddClassModal(true)}
              style={{
                border: '2px dashed #CBD5E1',
                borderRadius: 18,
                padding: '24px 20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                background: '#FAF8F5',
                color: '#64748B',
                minHeight: 150,
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{
                width: 42,
                height: 42,
                borderRadius: '50%',
                background: '#E2E8F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 8
              }}>
                <Plus size={20} color="#475569" />
              </div>
              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#334155' }}>Tambah Rombel Kelas Baru</span>
              <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Buka kelas paralel atau tingkat baru</span>
            </div>
          </div>
        </div>

        {/* Section: Students in Class Table */}
        <div className="teacher-table-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h3 style={{ margin: 0, fontFamily: 'var(--font-heading)', color: '#1E293B' }}>
                Santri Terdaftar {selectedClassFilter !== 'all' && `(${classes.find(c => c.id === selectedClassFilter)?.name || ''})`}
              </h3>
              <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748B' }}>
                Menampilkan {filteredStudents.length} santri
              </p>
            </div>

            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              <div className="table-search-input" style={{ width: 240 }}>
                <Search size={15} color="#64748B" />
                <input 
                  type="text" 
                  placeholder="Cari nama santri..." 
                  value={searchStudent}
                  onChange={(e) => setSearchStudent(e.target.value)}
                />
              </div>

              <select
                value={selectedClassFilter}
                onChange={(e) => setSelectedClassFilter(e.target.value)}
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
          
          <div className="data-table-wrapper">
            <table className="student-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Foto & Nama Santri</th>
                  <th>Kelas</th>
                  <th>Jenis Kelamin</th>
                  <th>Total Bintang</th>
                  <th>Status Konsistensi</th>
                  <th style={{ textAlign: 'right' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '36px', color: '#94A3B8' }}>
                      Tidak ada santri pada filter ini. Klik <strong>"Tambah Santri Baru"</strong> di atas.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student, idx) => (
                    <tr key={student.id}>
                      <td style={{ color: '#64748B', fontWeight: 600 }}>{idx + 1}</td>
                      <td>
                        <div className="student-name-cell">
                          <div 
                            className="student-avatar"
                            style={{ 
                              width: 36, 
                              height: 36, 
                              borderRadius: '50%', 
                              overflow: 'hidden',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: '#F1F5F9',
                              fontSize: '1.2rem',
                              flexShrink: 0
                            }}
                          >
                            {student.photoUrl ? (
                              <img 
                                src={student.photoUrl} 
                                alt={student.name} 
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                              />
                            ) : (
                              <span>{student.avatar}</span>
                            )}
                          </div>
                          <div>
                            <strong style={{ color: '#1E293B', display: 'block' }}>{student.name}</strong>
                            <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>PIN: {student.pin || '1234'}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontWeight: 600, color: 'var(--primary-700)' }}>
                          {student.className || classes.find(c => c.id === student.classId)?.name || 'Kelas Belajar'}
                        </span>
                      </td>
                      <td style={{ color: '#64748B', fontSize: '0.85rem' }}>
                        {student.gender === 'female' ? 'Perempuan 🧕🏻' : 'Laki-laki 👦🏻'}
                      </td>
                      <td style={{ fontWeight: 700, color: '#92400E' }}>
                        {student.totalStars} ⭐
                      </td>
                      <td>
                        <span className={`status-pill ${student.statusType || 'success'}`}>
                          {student.status || 'Sangat Konsisten'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button 
                          onClick={() => handleDeleteStudent(student.id, student.name)}
                          style={{ 
                            padding: '6px 8px', 
                            color: '#DC2626', 
                            cursor: 'pointer',
                            background: '#FEF2F2',
                            border: '1px solid #FECACA',
                            borderRadius: 8
                          }}
                          title="Hapus Siswa"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* MODAL: TAMBAH KELAS BARU */}
      {showAddClassModal && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.55)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 4000,
            padding: 20
          }}
          onClick={() => setShowAddClassModal(false)}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: 'var(--primary-100)',
                color: 'var(--primary-700)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <School size={22} />
              </div>
              <div>
                <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary-700)', margin: 0 }}>
                  Tambah Rombel Kelas Baru
                </h3>
                <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Daftarkan ruang kelas belajar santri</span>
              </div>
            </div>

            <form onSubmit={handleSaveAddClass}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: 6 }}>
                  Nama Kelas
                </label>
                <input 
                  type="text"
                  placeholder="Contoh: Kelas 2B - Umar bin Khattab"
                  value={classNameInput}
                  onChange={(e) => setClassNameInput(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 12, border: '1px solid #CBD5E1', outline: 'none' }}
                />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: 6 }}>
                  Subjudul / Angkatan
                </label>
                <input 
                  type="text"
                  placeholder="Contoh: Angkatan 2025/2026"
                  value={classSubInput}
                  onChange={(e) => setClassSubInput(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 12, border: '1px solid #CBD5E1', outline: 'none' }}
                />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: 6 }}>
                  Jenjang Pendidikan
                </label>
                <select
                  value={classLevelInput}
                  onChange={(e) => setClassLevelInput(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 12, border: '1px solid #CBD5E1', outline: 'none' }}
                >
                  <option value="Sekolah Dasar (SDIT)">Sekolah Dasar (SDIT)</option>
                  <option value="Sekolah Menengah Pertama (SMP IT)">Sekolah Menengah Pertama (SMP IT)</option>
                  <option value="Taman Kanak-kanak / PAUD">Taman Kanak-kanak / PAUD</option>
                  <option value="Madrasah Diniyah / TPA">Madrasah Diniyah / TPA</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button type="button" className="btn-outline" style={{ flex: 1 }} onClick={() => setShowAddClassModal(false)}>
                  Batal
                </button>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                  Simpan Kelas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT KELAS */}
      {editingClass && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.55)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 4000,
            padding: 20
          }}
          onClick={() => setEditingClass(null)}
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
            <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary-700)', marginBottom: 16 }}>
              Edit Informasi Kelas
            </h3>

            <form onSubmit={handleSaveEditClass}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: 6 }}>
                  Nama Kelas
                </label>
                <input 
                  type="text"
                  value={editingClass.name}
                  onChange={(e) => setEditingClass({ ...editingClass, name: e.target.value })}
                  required
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 12, border: '1px solid #CBD5E1', outline: 'none' }}
                />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: 6 }}>
                  Keterangan / Subjudul
                </label>
                <input 
                  type="text"
                  value={editingClass.subtitle || ''}
                  onChange={(e) => setEditingClass({ ...editingClass, subtitle: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 12, border: '1px solid #CBD5E1', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button type="button" className="btn-outline" style={{ flex: 1 }} onClick={() => setEditingClass(null)}>
                  Batal
                </button>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                  Perbarui Kelas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: TAMBAH SISWA BARU */}
      {showAddStudentModal && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.55)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 4000,
            padding: 20
          }}
          onClick={() => setShowAddStudentModal(false)}
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
            <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary-700)', marginBottom: 16 }}>
              Tambah Santri Baru
            </h3>
            
            <form onSubmit={handleAddStudent}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: 6 }}>
                  Nama Lengkap Santri
                </label>
                <input 
                  type="text"
                  placeholder="Contoh: Bilal Ibnu Rabah"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 12, border: '1px solid #CBD5E1', outline: 'none' }}
                />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: 6 }}>
                  Rombel Kelas
                </label>
                <select
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 12, border: '1px solid #CBD5E1', outline: 'none' }}
                >
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: 6 }}>
                  Kategori / Gender
                </label>
                <select
                  value={newGender}
                  onChange={(e) => setNewGender(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 12, border: '1px solid #CBD5E1', outline: 'none' }}
                >
                  <option value="male">Laki-laki (Muslim) 👦🏻</option>
                  <option value="female">Perempuan (Muslimah) 🧕🏻</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button type="button" className="btn-outline" style={{ flex: 1 }} onClick={() => setShowAddStudentModal(false)}>
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
