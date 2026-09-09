import React from 'react';
import { Lock } from 'lucide-react';

export default function BadgeItem({ badge, currentStars = 0, onClick }) {
  const req = badge.requiredStars || 100;
  const isUnlocked = badge.isUnlocked !== undefined ? badge.isUnlocked : (currentStars >= req);
  const remaining = Math.max(0, req - currentStars);
  const pct = Math.min(100, Math.round((currentStars / req) * 100));

  return (
    <div 
      className={`badge-card ${isUnlocked ? 'badge-card-unlocked' : 'badge-card-locked'}`}
      onClick={onClick}
      style={{
        background: '#FFFFFF',
        borderRadius: '20px',
        padding: '20px 14px 16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        position: 'relative',
        boxShadow: isUnlocked 
          ? '0 6px 20px rgba(245, 163, 0, 0.12), 0 2px 6px rgba(0,0,0,0.04)' 
          : '0 4px 14px rgba(0, 0, 0, 0.04)',
        border: isUnlocked ? '1px solid #FFE9B3' : '1px solid #ECECEC',
        cursor: 'pointer',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
      }}
    >
      {/* Lock Icon for locked badges */}
      {!isUnlocked && (
        <div style={{
          position: 'absolute',
          top: 10,
          right: 10,
          width: 22,
          height: 22,
          borderRadius: '50%',
          background: '#F1F5F9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#64748B'
        }}>
          <Lock size={12} strokeWidth={2.5} />
        </div>
      )}

      {/* Medal Graphics */}
      <div style={{ width: 88, height: 88, marginBottom: 12, position: 'relative' }}>
        {isUnlocked ? (
          /* Gold Medal SVG */
          <svg viewBox="0 0 100 100" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="goldMedalGrad" cx="50%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#FFF4AA" />
                <stop offset="40%" stopColor="#F8BA1E" />
                <stop offset="85%" stopColor="#DA8908" />
                <stop offset="100%" stopColor="#AE6200" />
              </radialGradient>
              <linearGradient id="redRibbon" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#D92534" />
                <stop offset="100%" stopColor="#8A0D1B" />
              </linearGradient>
            </defs>

            {/* Red Hanging Ribbon Tails */}
            <path d="M 36 68 L 26 95 L 42 88 L 48 68 Z" fill="url(#redRibbon)" />
            <path d="M 64 68 L 74 95 L 58 88 L 52 68 Z" fill="url(#redRibbon)" />

            {/* Scalloped Gold Medallion Rim */}
            <circle cx="50" cy="46" r="38" fill="url(#goldMedalGrad)" stroke="#FFE885" strokeWidth="2" filter="drop-shadow(0 4px 10px rgba(218, 137, 8, 0.4))" />
            <circle cx="50" cy="46" r="32" fill="none" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.8" />
            <circle cx="50" cy="46" r="28" fill="#F8BA1E" fillOpacity="0.3" />

            {/* Inner Icon Based on Type */}
            {badge.iconType === 'gold_mosque' && (
              <g transform="translate(30, 26) scale(0.85)">
                <path d="M 23 7 C 16 12, 14 18, 14 26 L 32 26 C 32 18, 30 12, 23 7 Z" fill="#FFFFFF" />
                <rect x="11" y="26" width="24" height="15" rx="1" fill="#FFFFFF" opacity="0.9" />
                <path d="M 19 41 C 19 36, 27 36, 27 41 Z" fill="#B36E00" />
                <path d="M 22 2 A 4 4 0 0 0 25 7 A 3 3 0 0 1 22 2" fill="#FFFFFF" />
                <circle cx="9" cy="18" r="3" fill="#FFFFFF" />
                <circle cx="37" cy="18" r="3" fill="#FFFFFF" />
              </g>
            )}

            {badge.iconType === 'gold_quran' && (
              <g transform="translate(28, 25) scale(0.9)">
                <path d="M 10 38 L 36 22 M 36 38 L 10 22" stroke="#B36E00" strokeWidth="4" strokeLinecap="round" />
                <path d="M 8 20 C 14 17, 21 18, 23 23 C 25 18, 32 17, 38 20 L 37 32 C 31 29, 25 30, 23 34 C 21 30, 15 29, 9 32 Z" fill="#FFFFFF" />
                <path d="M 23 23 L 23 34" stroke="#B36E00" strokeWidth="1.5" />
              </g>
            )}

            {badge.iconType === 'gold_moon' && (
              <g transform="translate(32, 24) scale(0.9)">
                <path d="M 24 6 C 14 6, 8 16, 12 28 C 16 40, 32 40, 34 28 C 24 30, 18 20, 24 6 Z" fill="#FFFFFF" />
                <path d="M 6 32 Q 10 26 18 28 Q 24 24 30 28 Q 36 26 38 32 Z" fill="#FFFFFF" opacity="0.85" />
              </g>
            )}

            {badge.iconType === 'gold_sun' && (
              <g transform="translate(28, 24) scale(0.9)">
                <circle cx="24" cy="24" r="10" fill="#FFFFFF" />
                {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                  <line 
                    key={i}
                    x1="24" y1="9" x2="24" y2="4" 
                    stroke="#FFFFFF" 
                    strokeWidth="3.5" 
                    strokeLinecap="round" 
                    transform={`rotate(${angle} 24 24)`}
                  />
                ))}
              </g>
            )}

            {badge.iconType === 'gold_hands' && (
              <g transform="translate(30, 26) scale(0.85)">
                <path d="M 12 36 C 8 26, 14 14, 18 10 C 20 16, 21 24, 21 36 Z" fill="#FFFFFF" />
                <path d="M 32 36 C 36 26, 30 14, 26 10 C 24 16, 23 24, 23 36 Z" fill="#FFFFFF" />
                <circle cx="10" cy="8" r="2" fill="#FFFFFF" />
                <circle cx="34" cy="8" r="2" fill="#FFFFFF" />
              </g>
            )}

            {/* Fallback default gold star for other unlocked badges */}
            {!['gold_mosque', 'gold_quran', 'gold_moon', 'gold_sun', 'gold_hands'].includes(badge.iconType) && (
              <g transform="translate(30, 26) scale(0.85)">
                <path
                  d="M 24 4 L 29 17 L 43 18 L 32 27 L 35 41 L 24 33 L 13 41 L 16 27 L 5 18 L 19 17 Z"
                  fill="#FFFFFF"
                />
              </g>
            )}

            {/* Sparkle Glint */}
            <circle cx="34" cy="25" r="2.5" fill="#FFFFFF" />
          </svg>
        ) : (
          /* Silver Locked Medal SVG */
          <svg viewBox="0 0 100 100" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="silverMedalGrad" cx="50%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="40%" stopColor="#E2E8F0" />
                <stop offset="85%" stopColor="#CBD5E1" />
                <stop offset="100%" stopColor="#94A3B8" />
              </radialGradient>
            </defs>

            {/* Silver Medallion */}
            <circle cx="50" cy="50" r="38" fill="url(#silverMedalGrad)" stroke="#F1F5F9" strokeWidth="2" filter="drop-shadow(0 4px 8px rgba(0, 0, 0, 0.08))" />
            <circle cx="50" cy="50" r="32" fill="none" stroke="#94A3B8" strokeWidth="1.2" strokeDasharray="3 2" opacity="0.6" />
            
            {/* Inner Embossed Icon */}
            {badge.iconType === 'silver_sharing' ? (
              <g transform="translate(32, 32) scale(0.8)" opacity="0.6">
                <circle cx="16" cy="12" r="6" fill="#64748B" />
                <circle cx="32" cy="12" r="6" fill="#64748B" />
                <circle cx="48" cy="12" r="6" fill="#64748B" />
                <path d="M 8 36 C 8 28, 56 28, 56 36 Z" fill="#64748B" />
              </g>
            ) : badge.iconType === 'silver_trophy' ? (
              <g transform="translate(34, 30) scale(0.75)" opacity="0.6">
                <path d="M 8 8 L 36 8 L 34 26 C 34 34, 10 34, 10 26 Z" fill="#64748B" />
                <path d="M 18 34 L 18 42 L 10 44 L 34 44 L 26 42 L 26 34" stroke="#64748B" strokeWidth="3" />
                <path d="M 8 12 C 0 12, 0 22, 10 22" fill="none" stroke="#64748B" strokeWidth="2.5" />
                <path d="M 36 12 C 44 12, 44 22, 34 22" fill="none" stroke="#64748B" strokeWidth="2.5" />
              </g>
            ) : badge.iconType === 'silver_calendar' ? (
              <g transform="translate(34, 32) scale(0.75)" opacity="0.6">
                <rect x="6" y="8" width="32" height="30" rx="4" fill="#64748B" />
                <line x1="12" y1="4" x2="12" y2="10" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
                <line x1="32" y1="4" x2="32" y2="10" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
                <path d="M 14 24 L 20 30 L 30 18" fill="none" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
              </g>
            ) : (
              <g transform="translate(32, 32) scale(0.8)" opacity="0.6">
                <path
                  d="M 22 2 L 27 15 L 42 16 L 30 25 L 34 40 L 22 30 L 10 40 L 14 25 L 2 16 L 17 15 Z"
                  fill="#64748B"
                />
              </g>
            )}
          </svg>
        )}
      </div>

      {/* Badge Title */}
      <h3 style={{ 
        fontSize: '0.92rem', 
        fontWeight: 700, 
        color: '#1E293B',
        marginBottom: 6,
        lineHeight: 1.2
      }}>
        {badge.title}
      </h3>

      {/* Subtitle / Status */}
      {isUnlocked ? (
        <span style={{
          fontSize: '0.75rem',
          color: '#B45309',
          background: '#FFFBEB',
          padding: '3px 12px',
          borderRadius: '999px',
          fontWeight: 600,
          border: '1px solid #FDE68A',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#D97706' }} />
          {badge.statusText || 'Diperoleh'}
        </span>
      ) : (
        <div style={{ width: '100%', marginTop: 2 }}>
          <p style={{ fontSize: '0.72rem', color: '#64748B', lineHeight: 1.3, marginBottom: 8 }}>
            Kumpulkan {remaining} bintang lagi untuk membuka
          </p>
          {/* Locked Progress Bar */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 3, 
            width: '100%' 
          }}>
            <div style={{
              width: '100%',
              height: 6,
              background: '#E2E8F0',
              borderRadius: 999,
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${pct}%`,
                height: '100%',
                background: '#B21B2D',
                borderRadius: 999
              }} />
            </div>
            <span style={{ fontSize: '0.68rem', color: '#64748B', fontWeight: 700 }}>
              {currentStars}/{req}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
