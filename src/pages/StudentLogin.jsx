import React, { useState, useRef } from 'react';
import MascotStar from '../components/MascotStar';
import { useApp } from '../context/AppContext';
import { User, Shield, Star, ArrowLeft, AlertCircle, ChevronDown, Sparkles, Heart } from 'lucide-react';
import { triggerStarConfetti } from '../components/StarConfetti';

export default function StudentLogin({ setCurrentRoute }) {
  const { students, loginStudentWithPin } = useApp();

  const [studentName, setStudentName] = useState('');
  const [pin, setPin] = useState(['', '', '', '']);
  const [errorMessage, setErrorMessage] = useState('');
  const pinRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  const handlePinChange = (index, value) => {
    if (value.length > 1) {
      value = value.slice(-1);
    }
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    // Auto focus next box
    if (value && index < 3) {
      pinRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      pinRefs[index - 1].current?.focus();
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setErrorMessage('');

    const trimmedName = studentName.trim();
    if (!trimmedName) {
      setErrorMessage('Silakan masukkan nama lengkap atau nama panggilanmu.');
      return;
    }

    const enteredPin = pin.join('');
    if (enteredPin.length < 4) {
      setErrorMessage('Silakan lengkapi 4 angka kode PIN-mu.');
      return;
    }

    // Match student by name in AppContext
    const matched = students.find(s => 
      s.name.toLowerCase() === trimmedName.toLowerCase() ||
      s.name.toLowerCase().includes(trimmedName.toLowerCase()) ||
      (s.nisn && s.nisn === trimmedName)
    );

    if (!matched) {
      setErrorMessage('Nama santri tidak ditemukan. Pastikan nama sesuai dengan yang didaftarkan guru.');
      return;
    }

    const res = loginStudentWithPin(matched.id, enteredPin);

    if (res.success) {
      triggerStarConfetti();
      setTimeout(() => {
        setCurrentRoute('student_beranda');
      }, 400);
    } else {
      setErrorMessage(res.message);
    }
  };

  return (
    <div className="student-login-container islamic-pattern-bg" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px 14px' }}>
      {/* Floating Back to Landing Button */}
      <button 
        onClick={() => setCurrentRoute('landing')}
        style={{
          position: 'fixed',
          top: 18,
          left: 18,
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          color: 'var(--primary-700)',
          borderRadius: 999,
          padding: '8px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontWeight: 700,
          fontSize: '0.82rem',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
          zIndex: 50
        }}
      >
        <ArrowLeft size={16} />
        <span>Ke Beranda</span>
      </button>

      {/* Main Elevated Login Box */}
      <div 
        className="animate-pop"
        style={{
          width: '100%',
          maxWidth: 460,
          background: '#FFFFFF',
          borderRadius: 32,
          boxShadow: '0 20px 60px rgba(143, 20, 36, 0.12), 0 4px 20px rgba(0,0,0,0.04)',
          border: '1.5px solid #F1ECE4',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        {/* Compact & Charming Islamic Header Arch */}
        <div style={{
          background: 'linear-gradient(145deg, #8F1424 0%, #6D0D19 100%)',
          padding: '24px 20px 20px',
          textAlign: 'center',
          color: '#FFFFFF',
          position: 'relative',
          borderBottomLeftRadius: 28,
          borderBottomRightRadius: 28,
          boxShadow: '0 8px 24px rgba(109, 13, 25, 0.25)'
        }}>
          {/* Animated Mascot */}
          <div className="animate-float" style={{ display: 'inline-block', marginBottom: 6 }}>
            <MascotStar size={110} waving={true} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 2 }}>
            <Sparkles size={16} color="#FBBF24" />
            <h1 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.85rem',
              fontWeight: 700,
              letterSpacing: '-0.5px',
              color: '#FFFFFF',
              margin: 0
            }}>
              Bintangku
            </h1>
            <Sparkles size={16} color="#FBBF24" />
          </div>
          <p style={{ fontSize: '0.85rem', color: '#FDE68A', margin: 0, fontWeight: 500 }}>
            Kebiasaan Baikku Setiap Hari ✨
          </p>
        </div>

        {/* Form Body */}
        <div style={{ padding: '24px 26px 28px' }}>
          <form onSubmit={handleLogin}>
            {/* Student Name Input */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: '0.86rem', fontWeight: 700, color: '#1E293B', display: 'block', marginBottom: 8 }}>
                Nama Lengkap / Panggilan Santri:
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Contoh: Adek Arman"
                  required
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '13px 16px 13px 44px',
                    borderRadius: 16,
                    border: '1.5px solid #CBD5E1',
                    fontSize: '0.95rem',
                    background: '#FAF8F5',
                    color: '#1E293B',
                    fontWeight: 600,
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--primary-700)';
                    e.target.style.background = '#FFFFFF';
                    e.target.style.boxShadow = '0 0 0 3px rgba(143, 20, 36, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#CBD5E1';
                    e.target.style.background = '#FAF8F5';
                    e.target.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.02)';
                  }}
                />
                <User 
                  size={19} 
                  color="#94A3B8" 
                  style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} 
                />
              </div>
            </div>

            {/* 4-Digit PIN Boxes */}
            <div style={{ marginBottom: 22, textAlign: 'center' }}>
              <label style={{ fontSize: '0.86rem', fontWeight: 700, color: '#1E293B', display: 'block', marginBottom: 10 }}>
                Masukkan 4 Angka Kode PIN:
              </label>

              <div style={{ display: 'flex', justifyContent: 'center', gap: 12, margin: '8px 0 10px' }}>
                {pin.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={pinRefs[idx]}
                    type="password"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handlePinChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    style={{
                      width: 54,
                      height: 58,
                      fontSize: '1.7rem',
                      fontWeight: 700,
                      textAlign: 'center',
                      borderRadius: 16,
                      border: '2px solid #CBD5E1',
                      background: '#FAF8F5',
                      outline: 'none',
                      color: 'var(--primary-700)',
                      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.04)',
                      transition: 'all 0.2s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#F5A623';
                      e.target.style.background = '#FFFFFF';
                      e.target.style.boxShadow = '0 0 0 3px rgba(245, 166, 35, 0.2)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#CBD5E1';
                      e.target.style.background = '#FAF8F5';
                      e.target.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.04)';
                    }}
                  />
                ))}
              </div>

              <div style={{ textAlign: 'center', fontSize: '0.74rem', color: '#94A3B8', marginTop: 6 }}>
                Belum tahu PIN? Tanyakan kepada guru atau ustadzah kelas 🧕🏻
              </div>
            </div>

            {errorMessage && (
              <div style={{
                background: '#FEF2F2',
                border: '1px solid #FECACA',
                borderRadius: 14,
                padding: '10px 14px',
                color: '#DC2626',
                fontSize: '0.82rem',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 16
              }}>
                <AlertCircle size={16} />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Submit Button */}
            <button 
              type="submit" 
              className="btn-gold"
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '1rem',
                borderRadius: 18,
                boxShadow: '0 8px 24px rgba(245, 166, 35, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8
              }}
            >
              <span>Mulai Belajar & Kumpulkan Bintang</span>
              <Star size={18} fill="#92400E" color="#92400E" />
            </button>
          </form>

          {/* Cheerful Kid Guarantee */}
          <div style={{
            marginTop: 20,
            paddingTop: 14,
            borderTop: '1px solid #F1ECE4',
            textAlign: 'center',
            fontSize: '0.78rem',
            color: '#64748B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6
          }}>
            <Heart size={15} color="#DC2626" fill="#DC2626" />
            <span>Membantu ananda menjadi anak shalih setiap hari</span>
          </div>
        </div>
      </div>
    </div>
  );
}
