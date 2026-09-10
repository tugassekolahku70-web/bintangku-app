import React, { useState, useRef, useEffect } from 'react';
import MascotStar from '../components/MascotStar';
import { useApp } from '../context/AppContext';
import { ArrowLeft, ShieldCheck, Mail, Lock, School, User, KeyRound, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { triggerStarConfetti } from '../components/StarConfetti';

export default function TeacherLogin({ setCurrentRoute }) {
  const { 
    settings, 
    teacherLogin, 
    requestTeacherOtp, 
    registerTeacherWithOtp,
    updateTeacherPinWithOtp 
  } = useApp();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  
  // Login State
  const [loginEmail, setLoginEmail] = useState(settings?.teacherEmail || 'desiana@bintangku.id');
  const [loginPin, setLoginPin] = useState(['1', '2', '3', '4']);
  const [loginError, setLoginError] = useState('');
  
  // Register State
  const [regName, setRegName] = useState('');
  const [regSchool, setRegSchool] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPin, setRegPin] = useState(['1', '2', '3', '4']);

  // OTP Modal State
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpPurpose, setOtpPurpose] = useState('register'); // 'register' | 'forgot_pin'
  const [otpInput, setOtpInput] = useState('');
  const [otpError, setOtpError] = useState('');
  const [newResetPin, setNewResetPin] = useState('');
  const [sendingOtp, setSendingOtp] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const pinRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(c => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handlePinChange = (index, value) => {
    if (value.length > 1) value = value.slice(-1);
    const newPin = [...loginPin];
    newPin[index] = value;
    setLoginPin(newPin);
    if (value && index < 3) {
      pinRefs[index + 1].current?.focus();
    }
  };

  const handlePinKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !loginPin[index] && index > 0) {
      pinRefs[index - 1].current?.focus();
    }
  };

  const handleDoLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    const entered = loginPin.join('');
    const res = await teacherLogin(loginEmail, entered);
    if (res.success) {
      setCurrentRoute('teacher_dashboard');
    } else {
      setLoginError(res.message);
    }
  };

  const handleStartRegister = async (e) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim()) return;

    setSendingOtp(true);
    await requestTeacherOtp(regEmail, regName, 'Pendaftaran Akun Guru Baru');
    setSendingOtp(false);
    setResendCooldown(60);
    setOtpPurpose('register');
    setOtpInput('');
    setOtpError('');
    setShowOtpModal(true);
  };

  const handleStartForgotPin = async () => {
    setSendingOtp(true);
    await requestTeacherOtp(loginEmail, 'Pendidik', 'Pengaturan Ulang Kode PIN');
    setSendingOtp(false);
    setResendCooldown(60);
    setOtpPurpose('forgot_pin');
    setOtpInput('');
    setOtpError('');
    setShowOtpModal(true);
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    const targetEmail = otpPurpose === 'register' ? regEmail : loginEmail;
    setSendingOtp(true);
    await requestTeacherOtp(targetEmail, regName || 'Pendidik', otpPurpose === 'register' ? 'Pendaftaran Akun Guru' : 'Reset Kode PIN');
    setSendingOtp(false);
    setResendCooldown(60);
  };

  const handleVerifyOtpSubmit = async (e) => {
    e.preventDefault();
    setOtpError('');

    if (otpPurpose === 'register') {
      const res = await registerTeacherWithOtp({
        name: regName,
        schoolName: regSchool || 'SDIT Bintang Cemerlang',
        email: regEmail,
        pin: regPin.join(''),
        otp: otpInput
      });

      if (res.success) {
        setShowOtpModal(false);
        setCurrentRoute('teacher_dashboard');
      } else {
        setOtpError(res.message);
      }
    } else if (otpPurpose === 'forgot_pin') {
      if (!newResetPin || newResetPin.length < 4) {
        setOtpError('Masukkan PIN baru 4 digit!');
        return;
      }
      const res = await updateTeacherPinWithOtp(otpInput, newResetPin);
      if (res.success) {
        setShowOtpModal(false);
        alert('PIN Guru berhasil diperbarui! Silakan masuk dengan PIN baru.');
        setLoginPin(newResetPin.split(''));
      } else {
        setOtpError(res.message);
      }
    }
  };

  return (
    <div className="student-login-container islamic-pattern-bg">
      {/* Top Header Dome */}
      <div className="student-login-hero-dome islamic-header-pattern" style={{ height: 210 }}>
        <button 
          onClick={() => setCurrentRoute('landing')}
          style={{
            position: 'absolute',
            top: 20,
            left: 20,
            background: 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            color: '#FFFFFF',
            borderRadius: '50%',
            width: 40,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 20
          }}
        >
          <ArrowLeft size={20} />
        </button>

        <div className="login-mascot-avatar animate-float">
          <MascotStar size={130} waving={true} />
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: 45, marginBottom: 16 }}>
        <h1 style={{ 
          fontFamily: 'var(--font-heading)', 
          fontSize: '2rem', 
          color: 'var(--primary-700)', 
          fontWeight: 700 
        }}>
          Panel Ustadzah & Guru
        </h1>
        <p style={{ color: '#64748B', fontSize: '0.88rem' }}>
          Portal pembimbing karakter & pantauan ibadah harian santri
        </p>

        {/* Tab Selector: Masuk / Daftar */}
        <div style={{ 
          display: 'inline-flex', 
          background: '#F1ECE4', 
          borderRadius: 999, 
          padding: 4, 
          marginTop: 14 
        }}>
          <button
            type="button"
            onClick={() => { setMode('login'); setLoginError(''); }}
            style={{
              padding: '8px 22px',
              borderRadius: 999,
              border: 'none',
              background: mode === 'login' ? 'var(--primary-700)' : 'transparent',
              color: mode === 'login' ? '#FFFFFF' : '#64748B',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Masuk Guru
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setLoginError(''); }}
            style={{
              padding: '8px 22px',
              borderRadius: 999,
              border: 'none',
              background: mode === 'register' ? 'var(--primary-700)' : 'transparent',
              color: mode === 'register' ? '#FFFFFF' : '#64748B',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Daftar Akun Baru (OTP)
          </button>
        </div>
      </div>

      {/* Main Login / Register Card */}
      <div className="login-card-box animate-pop">
        {mode === 'login' ? (
          <form onSubmit={handleDoLogin}>
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#1E293B', marginBottom: 6 }}>
                Email Pendidik / Ustadzah
              </label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="nama@bintangku.id"
                  required
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 38px',
                    borderRadius: 14,
                    border: '1.5px solid #CBD5E1',
                    fontSize: '0.92rem'
                  }}
                />
                <Mail size={18} color="#94A3B8" style={{ position: 'absolute', left: 12, top: 14 }} />
              </div>
            </div>

            {/* 4-Digit PIN Input */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1E293B' }}>
                  Kode PIN Akses (4 Digit)
                </label>
                <button 
                  type="button" 
                  onClick={handleStartForgotPin}
                  style={{ fontSize: '0.78rem', color: 'var(--primary-700)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  Lupa PIN? (via OTP)
                </button>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: 12, margin: '14px 0' }}>
                {loginPin.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={pinRefs[idx]}
                    type="password"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handlePinChange(idx, e.target.value)}
                    onKeyDown={(e) => handlePinKeyDown(idx, e)}
                    style={{
                      width: 52,
                      height: 56,
                      fontSize: '1.6rem',
                      fontWeight: 700,
                      textAlign: 'center',
                      borderRadius: 14,
                      border: '2px solid #CBD5E1',
                      background: '#FAF8F5',
                      outline: 'none',
                      color: 'var(--primary-700)'
                    }}
                  />
                ))}
              </div>
            </div>

            {loginError && (
              <div style={{
                background: '#FEF2F2',
                border: '1px solid #FECACA',
                borderRadius: 12,
                padding: '10px 14px',
                color: '#DC2626',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 16
              }}>
                <AlertCircle size={16} />
                <span>{loginError}</span>
              </div>
            )}

            <button 
              type="submit"
              className="btn-gold"
              style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
            >
              Masuk ke Panel Guru
            </button>
          </form>
        ) : (
          /* Register Form */
          <form onSubmit={handleStartRegister}>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#1E293B', marginBottom: 4 }}>
                Nama Ustadzah / Pendidik
              </label>
              <input 
                type="text"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="Contoh: Ustadzah Desiana S.Pd.I"
                required
                style={{ width: '100%', padding: '10px 14px', borderRadius: 12, border: '1.5px solid #CBD5E1' }}
              />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#1E293B', marginBottom: 4 }}>
                Nama Sekolah / Lembaga
              </label>
              <input 
                type="text"
                value={regSchool}
                onChange={(e) => setRegSchool(e.target.value)}
                placeholder="Contoh: SDIT Bintang Cemerlang"
                style={{ width: '100%', padding: '10px 14px', borderRadius: 12, border: '1.5px solid #CBD5E1' }}
              />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#1E293B', marginBottom: 4 }}>
                Email Resmi (Untuk Pengiriman OTP)
              </label>
              <input 
                type="email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="ustadzah@sekolah.sch.id"
                required
                style={{ width: '100%', padding: '10px 14px', borderRadius: 12, border: '1.5px solid #CBD5E1' }}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#1E293B', marginBottom: 4 }}>
                Buat Kode PIN 4-Digit Baru
              </label>
              <input 
                type="password"
                maxLength={4}
                value={regPin.join('')}
                onChange={(e) => setRegPin(e.target.value.split(''))}
                placeholder="4 Digit Angka"
                required
                style={{ width: '100%', padding: '10px 14px', borderRadius: 12, border: '1.5px solid #CBD5E1', letterSpacing: 6, fontWeight: 700, textAlign: 'center' }}
              />
            </div>

            <button 
              type="submit"
              className="btn-primary"
              style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
            >
              Kirim Kode OTP ke Email &rarr;
            </button>
          </form>
        )}
      </div>

      {/* OTP Verification Modal */}
      {showOtpModal && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 5000,
            padding: 20
          }}
          onClick={() => setShowOtpModal(false)}
        >
          <div 
            style={{
              background: '#FFFFFF',
              borderRadius: 24,
              padding: '32px 28px',
              width: '100%',
              maxWidth: 400,
              textAlign: 'center',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              background: '#FEF3C7',
              color: '#D97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <KeyRound size={32} />
            </div>

            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: '#1E293B', marginBottom: 6 }}>
              Verifikasi Kode OTP
            </h3>
            
            <p style={{ fontSize: '0.86rem', color: '#64748B', lineHeight: 1.5, marginBottom: 14 }}>
              Kode OTP rahasia telah dikirimkan ke email <strong>{otpPurpose === 'register' ? regEmail : loginEmail}</strong>
            </p>

            {/* Privacy Email Confirmation Notice */}
            <div style={{
              background: '#F0FDF4',
              border: '1px solid #BBF7D0',
              borderRadius: 14,
              padding: '12px 14px',
              marginBottom: 20,
              fontSize: '0.82rem',
              color: '#166534',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              textAlign: 'left'
            }}>
              <Mail size={22} color="#16A34A" style={{ flexShrink: 0 }} />
              <div>
                <strong style={{ display: 'block', fontSize: '0.85rem' }}>Email Terkirim Langsung</strong>
                <span style={{ fontSize: '0.78rem', color: '#15803D' }}>
                  Silakan periksa <strong>Kotak Masuk</strong> atau folder <strong>Spam</strong> pada email Anda untuk melihat 4 digit kode OTP.
                </span>
              </div>
            </div>

            <form onSubmit={handleVerifyOtpSubmit}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: 6 }}>
                  Masukkan Kode OTP (4 Digit)
                </label>
                <input 
                  type="text"
                  maxLength={4}
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  placeholder="----"
                  required
                  style={{
                    width: 160,
                    padding: '10px',
                    fontSize: '1.5rem',
                    textAlign: 'center',
                    letterSpacing: 8,
                    fontWeight: 700,
                    borderRadius: 14,
                    border: '2px solid #CBD5E1',
                    outline: 'none',
                    margin: '0 auto'
                  }}
                />
              </div>

              {otpPurpose === 'forgot_pin' && (
                <div style={{ marginBottom: 18, textAlign: 'left' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: 4 }}>
                    Buat Kode PIN Baru (4 Digit)
                  </label>
                  <input 
                    type="password"
                    maxLength={4}
                    value={newResetPin}
                    onChange={(e) => setNewResetPin(e.target.value)}
                    placeholder="Contoh: 5678"
                    required
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 12, border: '1.5px solid #CBD5E1', textAlign: 'center', letterSpacing: 4, fontWeight: 700 }}
                  />
                </div>
              )}

              {otpError && (
                <div style={{ color: '#DC2626', fontSize: '0.82rem', marginBottom: 14, fontWeight: 600 }}>
                  {otpError}
                </div>
              )}

              <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                <button 
                  type="button" 
                  className="btn-outline" 
                  style={{ flex: 1, padding: 12 }}
                  onClick={() => setShowOtpModal(false)}
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="btn-primary" 
                  style={{ flex: 1, padding: 12 }}
                >
                  Verifikasi OTP
                </button>
              </div>

              {/* Resend OTP Cooldown */}
              <div style={{ textAlign: 'center', marginTop: 8 }}>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendCooldown > 0 || sendingOtp}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: resendCooldown > 0 ? '#94A3B8' : '#2563EB',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: resendCooldown > 0 ? 'not-allowed' : 'pointer',
                    textDecoration: resendCooldown > 0 ? 'none' : 'underline'
                  }}
                >
                  {sendingOtp ? 'Mengirim ulang...' : resendCooldown > 0 ? `Kirim ulang kode dalam ${resendCooldown}s` : 'Belum terima email? Kirim Ulang OTP'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
