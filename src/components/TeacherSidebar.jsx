import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  School, 
  Users, 
  CalendarCheck, 
  Trophy, 
  FileText, 
  Mail, 
  Settings,
  ArrowLeft,
  X,
  LogOut,
  UserCheck,
  ChevronDown,
  PlusCircle,
  Shield
} from 'lucide-react';
import MascotStar from './MascotStar';
import { useApp } from '../context/AppContext';

export default function TeacherSidebar({ 
  currentRoute, 
  setCurrentRoute,
  isOpenMobile = false,
  onCloseMobile = () => {}
}) {
  const { settings, teacherLogout } = useApp();

  const menuItems = [
    { id: 'teacher_dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'teacher_classes', label: 'Kelas Saya', icon: School },
    { id: 'teacher_students', label: 'Siswa', icon: Users },
    { id: 'teacher_habits', label: 'Kebiasaan', icon: CalendarCheck },
    { id: 'teacher_achievements', label: 'Pencapaian', icon: Trophy },
    { id: 'teacher_reports_export', label: 'Laporan', icon: FileText },
    { id: 'teacher_messages', label: 'Pesan', icon: Mail },
    { id: 'teacher_settings', label: 'Pengaturan', icon: Settings }
  ];

  const handleNavClick = (id) => {
    setCurrentRoute(id);
    onCloseMobile();
  };

  const handleLogout = () => {
    teacherLogout();
    setCurrentRoute('teacher_login');
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpenMobile && (
        <div 
          className="mobile-drawer-overlay"
          onClick={onCloseMobile}
        />
      )}

      <aside className={`teacher-sidebar ${isOpenMobile ? 'mobile-open' : ''}`}>
        {/* Sidebar Header */}
        <div className="teacher-sidebar-brand">
          <div 
            onClick={() => { setCurrentRoute('landing'); onCloseMobile(); }}
            style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', flex: 1 }}
          >
            <div className="teacher-brand-logo">
              <MascotStar size={42} />
            </div>
            <div className="teacher-brand-text">
              <h2>Bintangku</h2>
              <span>Panel Guru</span>
            </div>
          </div>

          {/* Close button for mobile drawer */}
          <button 
            className="mobile-sidebar-close" 
            onClick={onCloseMobile}
          >
            <X size={20} />
          </button>
        </div>

        {/* ACTIVE TEACHER PROFILE CARD */}
        <div style={{
          margin: '12px 14px 16px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: 16,
          padding: '10px 14px',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          display: 'flex',
          alignItems: 'center',
          gap: 10
        }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.4rem',
            overflow: 'hidden',
            flexShrink: 0,
            border: '1.5px solid #F5A623'
          }}>
            {settings?.teacherPhotoUrl ? (
              <img 
                src={settings.teacherPhotoUrl} 
                alt="Avatar Guru" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            ) : (
              <span>{settings?.teacherAvatar || '🧕🏻'}</span>
            )}
          </div>

          <div style={{ minWidth: 0, flex: 1 }}>
            <strong style={{
              color: '#FFFFFF',
              fontSize: '0.84rem',
              display: 'block',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {settings?.teacherName || 'Pendidik'}
            </strong>
            <span style={{
              color: '#CBD5E1',
              fontSize: '0.72rem',
              display: 'block',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {settings?.schoolName || 'Sekolah'}
            </span>
          </div>
        </div>

        {/* Navigation List (All 8 Functional Items) */}
        <nav className="teacher-sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentRoute === item.id;

            return (
              <button
                key={item.id}
                className={`teacher-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
              >
                <Icon size={20} className="nav-icon" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom Card / Footer Badge */}
        <div className="teacher-sidebar-footer">
          <div className="teacher-badge-card">
            <div className="badge-shield-icon">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="#E69B1B">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4.5l1.6 3.8 4.1.4-3.1 2.7.9 4-3.5-2.1-3.5 2.1.9-4-3.1-2.7 4.1-.4L12 5.5z"/>
              </svg>
            </div>
            <div className="badge-text">
              <strong>{settings?.schoolName || 'Bersama Bintangku'}</strong>
              <p>Membentuk kebiasaan baik setiap hari ✨</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            {/* Quick Switcher back to Landing */}
            <button 
              className="btn-switch-portal"
              onClick={() => { setCurrentRoute('landing'); onCloseMobile(); }}
              title="Kembali ke Beranda Depan"
              style={{ flex: 1 }}
            >
              <ArrowLeft size={16} />
              <span>Beranda</span>
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                border: 'none',
                borderRadius: 12,
                color: '#FFFFFF',
                padding: '8px 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              title="Keluar / Ganti Akun Guru"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
