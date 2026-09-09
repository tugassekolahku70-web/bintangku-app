import React, { useState, useMemo } from 'react';
import TeacherSidebar from '../components/TeacherSidebar';
import { useApp } from '../context/AppContext';
import { 
  Users, 
  Calendar, 
  ChevronDown, 
  Star, 
  Flame, 
  CheckCircle2, 
  Printer, 
  Download, 
  ShieldCheck, 
  ArrowLeft,
  Menu,
  Sliders
} from 'lucide-react';
import MascotStar from '../components/MascotStar';

export default function TeacherExport({ currentRoute, setCurrentRoute }) {
  const { settings, classes, students } = useApp();

  const [selectedClass, setSelectedClass] = useState('all');
  const [periodPreset, setPeriodPreset] = useState('18 – 24 Mei 2025');
  const [isCustomPeriod, setIsCustomPeriod] = useState(false);
  const [customStartDate, setCustomStartDate] = useState('2025-05-01');
  const [customEndDate, setCustomEndDate] = useState('2025-05-24');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Selected period formatted text
  const formattedPeriod = useMemo(() => {
    if (isCustomPeriod) {
      return `${customStartDate} s/d ${customEndDate}`;
    }
    return periodPreset;
  }, [isCustomPeriod, customStartDate, customEndDate, periodPreset]);

  // Active roster for this report
  const reportStudents = useMemo(() => {
    if (selectedClass === 'all') return students;
    const filtered = students.filter(s => s.className === selectedClass || s.classId === selectedClass);
    return filtered.length > 0 ? filtered : students;
  }, [students, selectedClass]);

  // Dynamic calculations for report certificate
  const avgConsistency = useMemo(() => {
    if (reportStudents.length === 0) return 0;
    const sum = reportStudents.reduce((acc, s) => acc + (s.consistency || 0), 0);
    return Math.round(sum / reportStudents.length);
  }, [reportStudents]);

  const totalStarsCount = useMemo(() => {
    return reportStudents.reduce((acc, s) => acc + (s.totalStars || 0), 0);
  }, [reportStudents]);

  const topStreakDays = useMemo(() => {
    if (reportStudents.length === 0) return 0;
    return Math.max(...reportStudents.map(s => s.currentStreak || s.longestStreak || 0), 0);
  }, [reportStudents]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = (format) => {
    window.print();
  };

  return (
    <div className="teacher-container">
      <TeacherSidebar 
        currentRoute="teacher_reports_export" 
        setCurrentRoute={setCurrentRoute}
        isOpenMobile={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Workspace */}
      <main className="teacher-main-layout">
        {/* Breadcrumb & Header */}
        <div className="no-print" style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <button 
              className="btn-mobile-burger"
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            >
              <Menu size={20} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.88rem', color: '#64748B' }}>
              <span style={{ cursor: 'pointer' }} onClick={() => setCurrentRoute('teacher_dashboard')}>Dashboard</span>
              <span>&gt;</span>
              <span style={{ color: 'var(--primary-700)', fontWeight: 600 }}>Export Laporan</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h1 className="teacher-welcome-title">Export Laporan</h1>
              <p className="teacher-welcome-subtitle">
                Cetak atau unduh laporan perkembangan siswa resmi {settings?.schoolName || 'SDIT Bintang Cemerlang'}
              </p>
            </div>

            <div className="teacher-header-controls" style={{ flexWrap: 'wrap' }}>
              {/* Class Selector */}
              <div className="teacher-select-dropdown">
                <Users size={16} color="var(--primary-700)" />
                <select 
                  value={selectedClass} 
                  onChange={(e) => setSelectedClass(e.target.value)}
                  style={{ border: 'none', background: 'transparent', outline: 'none', fontWeight: 600, cursor: 'pointer' }}
                >
                  <option value="all">Semua Rombel ({students.length})</option>
                  {classes.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
                <ChevronDown size={14} color="#64748B" />
              </div>

              {/* Date Range Preset Selector */}
              <div className="teacher-select-dropdown">
                <Calendar size={16} color="var(--primary-700)" />
                <select 
                  value={isCustomPeriod ? 'custom' : periodPreset} 
                  onChange={(e) => {
                    if (e.target.value === 'custom') {
                      setIsCustomPeriod(true);
                    } else {
                      setIsCustomPeriod(false);
                      setPeriodPreset(e.target.value);
                    }
                  }}
                  style={{ border: 'none', background: 'transparent', outline: 'none', fontWeight: 600, cursor: 'pointer' }}
                >
                  <option value="18 – 24 Mei 2025">18 – 24 Mei 2025 (Pekan Ini)</option>
                  <option value="11 – 17 Mei 2025">11 – 17 Mei 2025 (Pekan Lalu)</option>
                  <option value="1 – 31 Mei 2025">1 – 31 Mei 2025 (Bulan Ini)</option>
                  <option value="custom">📅 Pilih Tanggal Kustom</option>
                </select>
                <ChevronDown size={14} color="#64748B" />
              </div>
            </div>
          </div>

          {/* Custom Date Range Picker bar if enabled */}
          {isCustomPeriod && (
            <div style={{
              background: '#FFFBEB',
              border: '1px solid #FDE68A',
              borderRadius: 14,
              padding: '12px 18px',
              marginTop: 14,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              flexWrap: 'wrap',
              fontSize: '0.85rem'
            }}>
              <span style={{ fontWeight: 700, color: '#92400E' }}>Rentang Waktu Kustom:</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <label style={{ color: '#64748B' }}>Mulai:</label>
                <input 
                  type="date" 
                  value={customStartDate} 
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <label style={{ color: '#64748B' }}>Sampai:</label>
                <input 
                  type="date" 
                  value={customEndDate} 
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                />
              </div>
            </div>
          )}
        </div>

        {/* 2-Column Export Layout: Left = Official Certificate, Right = Action Sidebar */}
        <div className="report-workspace-grid">
          {/* Left Column: Official A4 Certificate */}
          <div className="report-paper-container" id="printable-report">
            {/* Islamic Gold Corner Accents */}
            <div className="corner-accent top-left" />
            <div className="corner-accent top-right" />
            <div className="corner-accent bottom-left" />
            <div className="corner-accent bottom-right" />

            {/* Document Header with Bintang Mascot */}
            <div className="report-header-center">
              <div className="report-mascot animate-float">
                <MascotStar size={56} />
              </div>
              <h2 className="report-main-title">LAPORAN KONSISTENSI KEBIASAAN SISWA</h2>
              <p className="report-sub-title">
                {selectedClass === 'all' ? 'Semua Kelas' : selectedClass} • {settings?.schoolName || 'SDIT Bintang Cemerlang'}
              </p>
              <div className="report-period-pill">
                <span>🗓️ Periode: {formattedPeriod}</span>
              </div>
            </div>

            {/* Summary KPI Strip */}
            <div className="report-kpi-strip">
              <div className="kpi-strip-item">
                <Star size={24} fill="#F5A623" color="#F5A623" />
                <div>
                  <div className="kpi-strip-label">Rata-rata Kelas</div>
                  <div className="kpi-strip-val">{avgConsistency}%</div>
                </div>
              </div>

              <div className="kpi-strip-item">
                <Users size={24} color="#059669" />
                <div>
                  <div className="kpi-strip-label">Jumlah Siswa</div>
                  <div className="kpi-strip-val">{reportStudents.length}</div>
                </div>
              </div>

              <div className="kpi-strip-item">
                <Star size={24} fill="#E69B1B" color="#E69B1B" />
                <div>
                  <div className="kpi-strip-label">Total Bintang</div>
                  <div className="kpi-strip-val">{totalStarsCount.toLocaleString('id-ID')}</div>
                </div>
              </div>

              <div className="kpi-strip-item">
                <Flame size={24} color="#DC2626" />
                <div>
                  <div className="kpi-strip-label">Streak Terbaik</div>
                  <div className="kpi-strip-val">{topStreakDays} Hari</div>
                </div>
              </div>
            </div>

            {/* Bar Chart Section (Horizontally Scrollable so names NEVER overlap) */}
            <div className="report-chart-container">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <h4 style={{ fontSize: '1rem', color: '#1E293B' }}>
                  Grafik Konsistensi Harian ({reportStudents.length} Siswa)
                </h4>
                {reportStudents.length > 5 && (
                  <span style={{ fontSize: '0.75rem', color: '#B45309', background: '#FFFBEB', padding: '3px 8px', borderRadius: 6 }}>
                    👉 Geser ke samping jika siswa banyak
                  </span>
                )}
              </div>

              {/* Scrollable Container with adequate minimum column width */}
              <div style={{
                overflowX: 'auto',
                WebkitOverflowScrolling: 'touch',
                paddingBottom: 10,
                border: '1px solid #F1ECE4',
                borderRadius: 16,
                background: '#FAF8F5'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  gap: 16,
                  minWidth: 'max-content',
                  height: 230,
                  padding: '16px 20px 10px',
                  position: 'relative'
                }}>
                  {/* Dashed guideline marks */}
                  <div style={{ position: 'absolute', top: 35, left: 0, right: 0, borderTop: '1px dashed #E2E8F0', pointerEvents: 'none' }} />
                  <div style={{ position: 'absolute', top: 110, left: 0, right: 0, borderTop: '1px dashed #E2E8F0', pointerEvents: 'none' }} />

                  {reportStudents.map((s, idx) => {
                    const percent = s.consistency || 0;
                    const barHeight = Math.max(18, Math.round((percent / 100) * 140));

                    return (
                      <div 
                        key={idx} 
                        style={{
                          width: 80,
                          minWidth: 80,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                          height: '100%',
                          zIndex: 2
                        }}
                      >
                        <div 
                          style={{
                            width: 38,
                            height: `${barHeight}px`,
                            background: percent >= 80 ? 'var(--primary-700)' : percent >= 60 ? '#C22336' : '#DE2C41',
                            borderRadius: '8px 8px 4px 4px',
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'center',
                            paddingTop: 4,
                            color: '#FFFFFF',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                            transition: 'height 0.3s ease'
                          }}
                        >
                          <span>{percent}%</span>
                        </div>
                        
                        {/* Student Name clearly spaced, wrapping gracefully without overlap */}
                        <span style={{
                          fontSize: '0.74rem',
                          fontWeight: 600,
                          color: '#334155',
                          marginTop: 8,
                          textAlign: 'center',
                          lineHeight: 1.25,
                          wordBreak: 'break-word',
                          maxWidth: 80
                        }}>
                          {s.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Chart Legend */}
              <div className="chart-legend-row" style={{ marginTop: 12 }}>
                <div className="legend-item">
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#059669' }} />
                  <span>85 – 100% Sangat Konsisten</span>
                </div>
                <div className="legend-item">
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#D97706' }} />
                  <span>60 – 84% Cukup Konsisten</span>
                </div>
                <div className="legend-item">
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#DC2626' }} />
                  <span>0 – 59% Perlu Semangat</span>
                </div>
              </div>
            </div>

            {/* Official Document Stamp & Signature */}
            <div style={{
              marginTop: 28,
              paddingTop: 16,
              borderTop: '1px solid #F1E2BA',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 12
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.76rem', color: '#64748B', maxWidth: 420 }}>
                <ShieldCheck size={20} color="#D97706" style={{ flexShrink: 0 }} />
                <span>
                  <strong>Dokumen Resmi</strong> — Digenerate secara otomatis oleh sistem Bintangku sebagai portofolio perkembangan karakter anak.
                </span>
              </div>

              <div style={{ textAlign: 'right', fontSize: '0.8rem' }}>
                <span style={{ color: '#64748B' }}>Pendidik / Wali Kelas:</span>
                <strong style={{ display: 'block', color: 'var(--primary-700)', fontSize: '0.95rem' }}>
                  {settings?.teacherName || 'Ustadzah Desiana S.Pd.I'}
                </strong>
                <span style={{ fontSize: '0.74rem', color: '#64748B' }}>
                  {settings?.schoolName || 'SDIT Bintang Cemerlang'}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Export Actions Sidebar */}
          <div className="no-print report-actions-card">
            <h3 style={{ fontSize: '1.15rem', color: '#1E293B', marginBottom: 4 }}>
              Preview Laporan
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: 20 }}>
              Dokumen siap untuk dicetak atau diunduh sebagai arsip sekolah.
            </p>

            {/* Mini Paper Thumbnail Preview */}
            <div className="report-thumbnail-preview" onClick={handlePrint}>
              <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--primary-700)', marginBottom: 2 }}>
                LAPORAN KONSISTENSI SISWA
              </div>
              <span style={{ fontSize: '0.55rem', color: '#64748B' }}>
                {selectedClass === 'all' ? 'Semua Kelas' : selectedClass} • {formattedPeriod}
              </span>
              <div className="thumbnail-chart-mini">
                <div style={{ height: 28 }} />
                <div style={{ height: 16 }} />
                <div style={{ height: 22 }} />
                <div style={{ height: 12 }} />
                <div style={{ height: 26 }} />
              </div>
            </div>

            {/* Action Buttons */}
            <button 
              className="btn-gold"
              onClick={() => handleDownload('PDF')}
              style={{ width: '100%', padding: '12px', marginBottom: 10, fontSize: '0.95rem' }}
            >
              <Download size={18} />
              <span>Unduh Laporan (PDF)</span>
            </button>

            <button 
              className="btn-outline"
              onClick={handlePrint}
              style={{ width: '100%', padding: '12px', marginBottom: 18, fontSize: '0.95rem' }}
            >
              <Printer size={18} />
              <span>Cetak Langsung</span>
            </button>

            <button 
              onClick={() => setCurrentRoute('teacher_dashboard')}
              style={{
                width: '100%',
                background: 'none',
                border: 'none',
                color: '#64748B',
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6
              }}
            >
              <ArrowLeft size={16} />
              <span>Kembali ke Dashboard</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
