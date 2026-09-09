import React, { useState } from 'react';
import MascotStar from './MascotStar';
import { Menu, X, LogIn } from 'lucide-react';

export default function Navbar({ currentRoute, setCurrentRoute }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (routeOrHash) => {
    if (routeOrHash.startsWith('#')) {
      const el = document.querySelector(routeOrHash);
      el?.scrollIntoView({ behavior: 'smooth' });
    } else {
      setCurrentRoute(routeOrHash);
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="landing-navbar">
      <div className="navbar-container">
        {/* Brand Logo */}
        <div 
          className="navbar-brand" 
          onClick={() => handleNavClick('landing')}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
        >
          <MascotStar size={38} />
          <span style={{ 
            fontFamily: 'var(--font-heading)', 
            fontSize: '1.65rem', 
            fontWeight: 700, 
            color: 'var(--primary-700)',
            letterSpacing: '-0.5px'
          }}>
            Bintangku
          </span>
        </div>

        {/* Center Navigation Links (Desktop) - No Blog */}
        <nav className="nav-links-desktop">
          <a 
            href="#beranda" 
            className={`nav-link ${currentRoute === 'landing' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); handleNavClick('#beranda'); }}
          >
            Beranda
          </a>
          <a href="#fitur" className="nav-link" onClick={(e) => { e.preventDefault(); handleNavClick('#fitur'); }}>Fitur</a>
          <a href="#tentang" className="nav-link" onClick={(e) => { e.preventDefault(); handleNavClick('#tentang'); }}>Tentang</a>
          <a href="#testimoni" className="nav-link" onClick={(e) => { e.preventDefault(); handleNavClick('#testimoni'); }}>Testimoni</a>
          <a href="#kontak" className="nav-link" onClick={(e) => { e.preventDefault(); handleNavClick('#kontak'); }}>Kontak</a>
        </nav>

        {/* Right CTA Actions (Desktop) */}
        <div className="navbar-actions">
          <button 
            className="btn-outline" 
            style={{ padding: '8px 18px', fontSize: '0.88rem' }}
            onClick={() => setCurrentRoute('student_login')}
          >
            Masuk Siswa
          </button>
          
          <button 
            className="btn-primary"
            style={{ padding: '8px 18px', fontSize: '0.88rem' }}
            onClick={() => setCurrentRoute('teacher_login')}
          >
            <LogIn size={15} />
            <span>Panel Guru</span>
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button 
          className="navbar-mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="navbar-mobile-drawer animate-pop">
          <a href="#beranda" className="mobile-nav-link" onClick={(e) => { e.preventDefault(); handleNavClick('#beranda'); }}>
            Beranda
          </a>
          <a href="#fitur" className="mobile-nav-link" onClick={(e) => { e.preventDefault(); handleNavClick('#fitur'); }}>
            Fitur
          </a>
          <a href="#tentang" className="mobile-nav-link" onClick={(e) => { e.preventDefault(); handleNavClick('#tentang'); }}>
            Tentang
          </a>
          <a href="#testimoni" className="mobile-nav-link" onClick={(e) => { e.preventDefault(); handleNavClick('#testimoni'); }}>
            Testimoni
          </a>
          <a href="#kontak" className="mobile-nav-link" onClick={(e) => { e.preventDefault(); handleNavClick('#kontak'); }}>
            Kontak
          </a>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12, borderTop: '1px solid #F1F5F9', paddingTop: 14 }}>
            <button 
              className="btn-outline" 
              onClick={() => handleNavClick('student_login')}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Masuk Siswa (PIN)
            </button>
            <button 
              className="btn-primary" 
              onClick={() => handleNavClick('teacher_login')}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Panel Guru (PIN)
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
