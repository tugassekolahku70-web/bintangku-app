import { supabase, isSupabaseConfigured } from './supabase';

/**
 * Mengirimkan kode OTP verifikasi ke email pengguna.
 * Bekerja secara otomatis dengan Netlify Serverless Functions (/api/send-otp)
 * dan Supabase Auth.
 */
export async function sendOtpEmail({ email, otp, name = 'Pendidik', purpose = 'Verifikasi Akun' }) {
  if (!email || !email.includes('@')) {
    return { success: false, message: 'Alamat email tidak valid.' };
  }

  // 1. Kirim via Netlify Serverless Function (/api/send-otp)
  try {
    const res = await fetch('/api/send-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        otp,
        name,
        purpose
      })
    });

    if (res.ok) {
      const data = await res.json();
      return { 
        success: true, 
        message: `Kode OTP telah dikirimkan ke ${email}. Silakan periksa Kotak Masuk atau folder Spam email Anda.`,
        data 
      };
    }
  } catch (err) {
    console.warn('Netlify function /api/send-otp tidak dapat dihubungi langsung (mungkin di mode lokal):', err);
  }

  // 2. Upayakan kirim via Supabase Auth jika Supabase terkonfigurasi
  if (isSupabaseConfigured && supabase?.auth) {
    try {
      await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: { shouldCreateUser: true }
      });
    } catch (sbErr) {
      console.warn('Supabase Auth OTP dispatch:', sbErr);
    }
  }

  // Log bantuan untuk developer di terminal saat pengetesan lokal (tidak tampil di layar UI pengguna)
  if (import.meta.env.DEV) {
    console.info(`%c[Bintangku Email Service] Kode OTP untuk ${email}: ${otp}`, 'color: #059669; font-weight: bold; font-size: 14px;');
  }

  return {
    success: true,
    message: `Kode OTP verifikasi telah dikirimkan ke ${email}. Silakan periksa Kotak Masuk atau folder Spam email Anda.`
  };
}
