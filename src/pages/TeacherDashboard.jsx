import React, { useState, useMemo } from 'react';
import TeacherSidebar from '../components/TeacherSidebar';
import { useApp } from '../context/AppContext';
import { 
  Users, 
  Star, 
  Flame, 
  CheckCircle2, 
  Search, 
  Filter, 
  Calendar, 
  ChevronDown, 
  Menu
} from 'lucide-react';
import { triggerStarConfetti } from '../components/StarConfetti';

export default function TeacherDashboard({ 
  currentRoute, 
  setCurrentRoute 
}) {
  const { settings, classes, students, habits, awardStudentStars } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedClass, setSelectedClass] = useState('all');
  const [activePage, setActivePage] = useState(1);
  const [rewardModalStudent, setRewardModalStudent] = useState(null);
  const [bonusStars, setBonusStars] = useState(10);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [rewardError, setRewardError] = useState('');

  // 7 Students per page
  const PAGE_SIZE = 7;

  // Filter students by search, status, and class
  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (student.nisn && student.nisn.includes(searchQuery));
      const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
      const matchesClass = selectedClass === 'all' || student.classId === selectedClass || student.className === selectedClass;
      return matchesSearch && matchesStatus && matchesClass;
    });
  }, [students, searchQuery, statusFilter, selectedClass]);

  // Real-time KPI calculations
  const targetRoster = selectedClass === 'all' 
    ? students 
    : students.filter(s => s.classId === selectedClass || s.className === selectedClass);

  const kpis = useMemo(() => {
    const count = targetRoster.length;
    if (count === 0) {
      return { avgConsistency: 0, totalStars: 0, topStreak: 0, completedHabitsPercent: 0, topStudentName: '-' };
    }

    const totalCons = targetRoster.reduce((sum, s) => sum + (s.consistency || 0), 0);
    const avgConsistency = Math.round(totalCons / count);
    const totalStars = targetRoster.reduce((sum, s) => sum + (s.totalStars || 0), 0);
    
    let maxStreak = 0;
    let topStudentName = targetRoster[0]?.name || '-';
    targetRoster.forEach(s => {
      if ((s.currentStreak || 0) >= maxStreak) {
        maxStreak = s.currentStreak || 0;
        topStudentName = s.name;
      }
    });

    const activeHabitsCount = habits.length;
    const completedCount = habits.filter(h => h.completed).length;
    const completedHabitsPercent = activeHabitsCount > 0 
      ? Math.round((completedCount / activeHabitsCount) * 100) 
      : 0;

    return {
      avgConsistency,
      totalStars,
      topStreak: maxStreak,
      topStudentName,
      completedHabitsPercent
    };
  }, [targetRoster, habits]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / PAGE_SIZE));
  const currentPage = Math.min(activePage, totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedStudents = filteredStudents.slice(startIndex, startIndex + PAGE_SIZE);

  const handleGiveBonusStars = async (student) => {
    setRewardError('');
    const res = await awardStudentStars(student.id, bonusStars);
    if (res && res.success === false) {
      setRewardError(res.message);
    } else {
      setRewardModalStudent(null);
    }
  };

  return (
    <div className="teacher-container">
      {/* Left Sidebar */}
      <TeacherSidebar 
        currentRoute={currentRoute} 
        setCurrentRoute={setCurrentRoute}
        isOpenMobile={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Workspace */}
      <main className="teacher-main-layout">
        {/* Top Header Bar */}
        <div className="teacher-top-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button 
              className="btn-mobile-burger"
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            >
              <Menu size={22} />
            </button>

            {/* Teacher Avatar / Photo */}
            <div style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: '#FFFFFF',
              border: '2px solid var(--primary-700)',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.6rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              flexShrink: 0
            }}>
              {settings?.teacherPhotoUrl ? (
                <img src={settings.teacherPhotoUrl} alt="Foto Guru" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span>{settings?.teacherAvatar || '🧕🏻'}</span>
              )}
            </div>

            <div>
              <h1 className="teacher-welcome-title">
                Assalamu'alaikum, {settings?.teacherName || 'Ustadzah Desiana S.Pd.I'} ✨
              </h1>
              <p className="teacher-welcome-subtitle">
                Ringkasan {selectedClass === 'all' ? 'Semua Rombel' : selectedClass} • {settings?.schoolName || 'SDIT Bintang Cemerlang'}
              </p>
            </div>
          </div>

          <div className="teacher-header-controls">
            {/* Dynamic Class Selector Dropdown */}
            <div className="teacher-select-dropdown">
              <Users size={16} color="var(--primary-700)" />
              <select 
                value={selectedClass} 
                onChange={(e) => {
                  setSelectedClass(e.target.value);
                  setActivePage(1);
                }}
                style={{ border: 'none', background: 'transparent', outline: 'none', fontWeight: 600, cursor: 'pointer' }}
              >
                <option value="all">Semua Kelas ({students.length})</option>
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <ChevronDown size={14} color="#64748B" />
            </div>

            {/* Date Button */}
            <div className="teacher-date-button">
              <Calendar size={16} color="var(--primary-700)" />
              <span>Hari Ini</span>
            </div>
          </div>
        </div>

        {/* 4 KPI Metric Cards (100% Realtime Synchronized) */}
        <div className="teacher-metric-grid">
          {/* Card 1: Rata-rata Kelas */}
          <div className="teacher-stat-card">
            <div className="stat-icon-wrapper stat-icon-green">
              <Users size={28} />
            </div>
            <div>
              <span className="stat-info-title">Rata-rata Kelas</span>
              <div className="stat-info-val">{kpis.avgConsistency}%</div>
              <p style={{ fontSize: '0.74rem', color: '#64748B', margin: '2px 0' }}>
                Konsistensi {targetRoster.length} Siswa
              </p>
              <span className="stat-trend-tag trend-up-green">
                ● Real-time Sinkron
              </span>
            </div>
          </div>

          {/* Card 2: Total Bintang Kelas */}
          <div className="teacher-stat-card">
            <div className="stat-icon-wrapper stat-icon-gold">
              <Star size={28} fill="#F59E0B" />
            </div>
            <div>
              <span className="stat-info-title">Total Bintang Kelas</span>
              <div className="stat-info-val">{kpis.totalStars.toLocaleString('id-ID')}</div>
              <p style={{ fontSize: '0.74rem', color: '#64748B', margin: '2px 0' }}>
                Bintang Terkumpul
              </p>
              <span className="stat-trend-tag trend-up-green">
                ★ Terverifikasi Aktif
              </span>
            </div>
          </div>

          {/* Card 3: Streak Terbaik */}
          <div className="teacher-stat-card">
            <div className="stat-icon-wrapper stat-icon-fire">
              <Flame size={28} />
            </div>
            <div>
              <span className="stat-info-title">Streak Terbaik</span>
              <div className="stat-info-val">{kpis.topStreak} Hari</div>
              <p style={{ fontSize: '0.74rem', color: '#64748B', margin: '2px 0' }}>
                Oleh {kpis.topStudentName}
              </p>
              <span className="stat-trend-tag trend-sub-author">
                Pertahankan prestasimu!
              </span>
            </div>
          </div>

          {/* Card 4: Kebiasaan Tuntas */}
          <div className="teacher-stat-card">
            <div className="stat-icon-wrapper stat-icon-checklist">
              <CheckCircle2 size={28} />
            </div>
            <div>
              <span className="stat-info-title">Kebiasaan Tuntas</span>
              <div className="stat-info-val">{kpis.completedHabitsPercent}%</div>
              <p style={{ fontSize: '0.74rem', color: '#64748B', margin: '2px 0' }}>
                Ceklis Hari Ini
              </p>
              <span className="stat-trend-tag trend-up-green">
                ▲ Selesai Dilaporkan
              </span>
            </div>
          </div>
        </div>

        {/* Student Table with 7 per page pagination */}
        <div className="teacher-table-card">
          <div className="table-header-row">
            <div>
              <h3>Konsistensi Siswa</h3>
              <p>Pantau kebiasaan ibadah harian santri secara realtime</p>
            </div>

            <div className="table-filter-actions">
              {/* Search Box */}
              <div className="table-search-input">
                <Search size={16} color="#64748B" />
                <input 
                  type="text" 
                  placeholder="Cari siswa..." 
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setActivePage(1);
                  }}
                />
              </div>

              {/* Status Filter */}
              <select 
                className="btn-table-filter"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setActivePage(1);
                }}
              >
                <option value="all">Semua Status</option>
                <option value="Sangat Konsisten">Sangat Konsisten</option>
                <option value="Cukup Konsisten">Cukup Konsisten</option>
                <option value="Perlu Semangat">Perlu Semangat</option>
              </select>

              {/* Export Button */}
              <button 
                className="btn-export"
                onClick={() => setCurrentRoute('teacher_reports_export')}
              >
                Export Laporan
              </button>
            </div>
          </div>

          {/* Data Table */}
          <div className="data-table-wrapper">
            <table className="student-table">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Nama Siswa</th>
                  <th>Konsistensi Hari Ini</th>
                  <th>Streak Terpanjang</th>
                  <th>Total Bintang</th>
                  <th>Keterangan</th>
                  <th style={{ textAlign: 'center' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {paginatedStudents.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '36px', color: '#94A3B8' }}>
                      Belum ada data siswa yang sesuai. Tambahkan siswa baru di menu Siswa.
                    </td>
                  </tr>
                ) : (
                  paginatedStudents.map((student, idx) => (
                    <tr key={student.id}>
                      <td style={{ color: '#64748B', fontWeight: 600 }}>{startIndex + idx + 1}</td>
                      <td>
                        <div className="student-name-cell">
                          <div className="student-avatar" style={{ overflow: 'hidden', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid #E2E8F0' }}>
                            {student.photoUrl ? (
                              <img src={student.photoUrl} alt={student.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              <span>{student.avatar || '👦🏻'}</span>
                            )}
                          </div>
                          <div>
                            <strong>{student.name}</strong>
                            <span>NISN: {student.nisn || `00892${idx}`}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`consistency-percent ${student.consistency >= 80 ? 'percent-high' : student.consistency >= 60 ? 'percent-medium' : 'percent-low'}`}>
                          {student.consistency}%
                        </span>
                      </td>
                      <td>
                        <span style={{ fontWeight: 600, color: '#1E293B' }}>
                          {student.currentStreak || student.longestStreak || 0} Hari
                        </span>
                      </td>
                      <td>
                        <div className="star-point-badge">
                          <span>{student.totalStars}</span>
                          <Star size={14} fill="#F5A623" color="#F5A623" />
                        </div>
                      </td>
                      <td>
                        <span className={`pill-badge badge-${student.statusType || (student.consistency >= 80 ? 'success' : student.consistency >= 60 ? 'warning' : 'danger')}`}>
                          ● {student.status || (student.consistency >= 80 ? 'Sangat Konsisten' : student.consistency >= 60 ? 'Cukup Konsisten' : 'Perlu Semangat')}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button 
                          onClick={() => {
                            setRewardModalStudent(student);
                            setRewardError('');
                          }}
                          style={{
                            padding: '6px 12px',
                            background: '#FFFBEB',
                            border: '1px solid #FDE68A',
                            borderRadius: 8,
                            color: '#B45309',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                          title="Beri Tambahan Bintang"
                        >
                          +⭐ Beri Bintang
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Dynamic Pagination (Exactly 7 per page) */}
          <div className="table-pagination">
            <span>
              Menampilkan {filteredStudents.length === 0 ? 0 : startIndex + 1}–{Math.min(startIndex + PAGE_SIZE, filteredStudents.length)} dari {filteredStudents.length} siswa
            </span>

            <div className="page-numbers">
              <button 
                className="btn-page" 
                disabled={currentPage <= 1}
                onClick={() => setActivePage(prev => Math.max(1, prev - 1))}
              >
                &lt;
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button 
                  key={pageNum}
                  className={`btn-page ${currentPage === pageNum ? 'active' : ''}`}
                  onClick={() => setActivePage(pageNum)}
                >
                  {pageNum}
                </button>
              ))}

              <button 
                className="btn-page" 
                disabled={currentPage >= totalPages}
                onClick={() => setActivePage(prev => Math.min(totalPages, prev + 1))}
              >
                &gt;
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontWeight: 600, color: 'var(--primary-700)' }}>7 / halaman</span>
            </div>
          </div>
        </div>
      </main>

      {/* Give Reward Modal */}
      {rewardModalStudent && (
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
            zIndex: 4000,
            padding: 20
          }}
          onClick={() => setRewardModalStudent(null)}
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
            <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>⭐</div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: '#1E293B', marginBottom: 4 }}>
              Apresiasi untuk {rewardModalStudent.name}
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#64748B', marginBottom: 20 }}>
              Berikan bintang tambahan sebagai motivasi kebaikan hari ini!
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 24 }}>
              {[10, 20, 50].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setBonusStars(val)}
                  style={{
                    padding: '10px 18px',
                    borderRadius: 12,
                    border: bonusStars === val ? '2px solid #F5A623' : '1px solid #E2E8F0',
                    background: bonusStars === val ? '#FFFBEB' : '#FFFFFF',
                    fontWeight: 700,
                    color: '#92400E',
                    cursor: 'pointer'
                  }}
                >
                  +{val} ⭐
                </button>
              ))}
            </div>

            {rewardError && (
              <div style={{ color: '#DC2626', fontSize: '0.82rem', marginBottom: 16, fontWeight: 600 }}>
                {rewardError}
              </div>
            )}

            <div style={{ display: 'flex', gap: 10 }}>
              <button 
                className="btn-outline" 
                style={{ flex: 1, padding: 12 }}
                onClick={() => setRewardModalStudent(null)}
              >
                Batal
              </button>
              <button 
                className="btn-primary" 
                style={{ flex: 1, padding: 12 }}
                onClick={() => handleGiveBonusStars(rewardModalStudent)}
              >
                Beri Apresiasi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
