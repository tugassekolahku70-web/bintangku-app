import React from 'react';

// 1. Sholat Subuh Icon (Fajar & Kubah Emas)
export function MosqueSubuhIcon({ size = 36 }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} fill="none">
      <defs>
        <linearGradient id="subuhSky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1E1B4B" />
          <stop offset="60%" stopColor="#4338CA" />
          <stop offset="100%" stopColor="#FB923C" />
        </linearGradient>
        <radialGradient id="subuhGold" cx="40%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FFF9DB" />
          <stop offset="40%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#B45309" />
        </radialGradient>
      </defs>
      <rect width="64" height="64" rx="18" fill="url(#subuhSky)" />
      {/* Morning Crescent */}
      <path d="M 44 14 C 40 14, 38 18, 40 22 C 41 25, 45 27, 48 25 C 44 28, 38 24, 39 19 C 40 16, 42 14, 44 14 Z" fill="#FEF08A" />
      {/* Central Dome */}
      <path d="M 32 18 C 22 24, 21 34, 21 42 L 43 42 C 43 34, 42 24, 32 18 Z" fill="url(#subuhGold)" />
      <rect x="18" y="42" width="28" height="14" rx="3" fill="#FDE68A" />
      {/* Arch Door */}
      <path d="M 28 56 C 28 48, 36 48, 36 56 Z" fill="#7C2D12" />
      {/* Left & Right Minarets */}
      <rect x="12" y="30" width="5" height="26" rx="2" fill="url(#subuhGold)" />
      <polygon points="14.5,24 12,30 17,30" fill="#FEF08A" />
      <rect x="47" y="30" width="5" height="26" rx="2" fill="url(#subuhGold)" />
      <polygon points="49.5,24 47,30 52,30" fill="#FEF08A" />
    </svg>
  );
}

// 2. Sholat Dzuhur Icon (Matahari Siang & Kubah Bersinar)
export function MosqueDzuhurIcon({ size = 36 }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} fill="none">
      <defs>
        <linearGradient id="dzuhurSky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0284C7" />
          <stop offset="100%" stopColor="#BAE6FD" />
        </linearGradient>
        <radialGradient id="sunGold" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="50%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#D97706" />
        </radialGradient>
      </defs>
      <rect width="64" height="64" rx="18" fill="url(#dzuhurSky)" />
      {/* Sun rays */}
      <circle cx="32" cy="18" r="8" fill="url(#sunGold)" filter="drop-shadow(0 0 8px #F59E0B)" />
      {/* Dome */}
      <path d="M 32 24 C 23 29, 22 38, 22 46 L 42 46 C 42 38, 41 29, 32 24 Z" fill="#FFFFFF" />
      <rect x="19" y="46" width="26" height="12" rx="2" fill="#F8FAFC" />
      <path d="M 29 58 C 29 51, 35 51, 35 58 Z" fill="#0284C7" />
    </svg>
  );
}

// 3. Sholat Maghrib Icon (Senja Jingga & Kubah)
export function MosqueMaghribIcon({ size = 36 }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} fill="none">
      <defs>
        <linearGradient id="maghribSky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#881337" />
          <stop offset="50%" stopColor="#BE123C" />
          <stop offset="100%" stopColor="#F97316" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="18" fill="url(#maghribSky)" />
      <circle cx="32" cy="34" r="16" fill="#FEF08A" opacity="0.85" />
      <path d="M 32 20 C 23 27, 22 36, 22 45 L 42 45 C 42 36, 41 27, 32 20 Z" fill="#FFFFFF" />
      <rect x="18" y="45" width="28" height="13" rx="2" fill="#FFE4E6" />
      <path d="M 28 58 C 28 50, 36 50, 36 58 Z" fill="#9F1239" />
    </svg>
  );
}

// 4. Mengaji / Al-Qur'an Icon (Rehal Kayu & Kitab Suci)
export function QuranStandIcon({ size = 36 }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} fill="none">
      <defs>
        <linearGradient id="quranBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#047857" />
          <stop offset="100%" stopColor="#064E3B" />
        </linearGradient>
        <linearGradient id="goldCover" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="18" fill="url(#quranBg)" />
      {/* Wooden Stand (Rehal) */}
      <path d="M 16 52 L 48 34 M 48 52 L 16 34" stroke="#D97706" strokeWidth="5" strokeLinecap="round" />
      {/* Quran Open Book */}
      <path d="M 14 22 C 23 18, 30 20, 32 26 C 34 20, 41 18, 50 22 L 48 40 C 40 36, 34 37, 32 42 C 30 37, 24 36, 16 40 Z" fill="#FFFFFF" stroke="url(#goldCover)" strokeWidth="2.5" />
      <line x1="32" y1="26" x2="32" y2="42" stroke="#D97706" strokeWidth="2" />
      {/* Calligraphy mark */}
      <circle cx="24" cy="30" r="2.5" fill="#10B981" />
      <circle cx="40" cy="30" r="2.5" fill="#10B981" />
    </svg>
  );
}

// 5. Doa Sebelum Tidur Icon (Bulan Sabit & Awan Malam)
export function MoonNightIcon({ size = 36 }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} fill="none">
      <defs>
        <linearGradient id="nightSky" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#311042" />
          <stop offset="100%" stopColor="#671435" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="18" fill="url(#nightSky)" />
      {/* Golden Moon */}
      <path d="M 40 16 C 28 16, 20 26, 24 38 C 27 48, 39 51, 46 41 C 36 43, 29 32, 36 21 C 38 18, 41 17, 40 16 Z" fill="#FBBF24" filter="drop-shadow(0 0 6px rgba(251, 191, 36, 0.6))" />
      {/* Stars in Sky */}
      <circle cx="48" cy="18" r="2" fill="#FFFFFF" />
      <circle cx="18" cy="24" r="1.5" fill="#FFFFFF" />
      {/* Sleeping Cloud */}
      <path d="M 18 46 Q 24 40 32 44 Q 40 38 46 44 Q 50 42 52 46 Q 52 52 18 52 Z" fill="#FFFFFF" opacity="0.9" />
    </svg>
  );
}

// 6. Sholat Dhuha Icon
export function DhuhaSunIcon({ size = 36 }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} fill="none">
      <defs>
        <linearGradient id="dhuhaBg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#EA580C" />
          <stop offset="100%" stopColor="#FBBF24" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="18" fill="url(#dhuhaBg)" />
      <circle cx="32" cy="32" r="14" fill="#FFFFFF" />
      <circle cx="32" cy="32" r="10" fill="#F59E0B" />
      <line x1="32" y1="8" x2="32" y2="14" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="32" y1="50" x2="32" y2="56" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="8" y1="32" x2="14" y2="32" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="50" y1="32" x2="56" y2="32" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}

// Helper: Dynamic Habit Icon Selector
export function RenderPremiumHabitIcon({ type, size = 42 }) {
  switch (type) {
    case 'mosque_subuh':
      return <MosqueSubuhIcon size={size} />;
    case 'mosque_dzuhur':
      return <MosqueDzuhurIcon size={size} />;
    case 'mosque_maghrib':
      return <MosqueMaghribIcon size={size} />;
    case 'quran':
      return <QuranStandIcon size={size} />;
    case 'moon_sleep':
      return <MoonNightIcon size={size} />;
    case 'dhuha':
      return <DhuhaSunIcon size={size} />;
    default:
      return <MosqueSubuhIcon size={size} />;
  }
}
