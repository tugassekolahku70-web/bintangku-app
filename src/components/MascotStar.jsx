import React from 'react';

export default function MascotStar({ size = 180, className = '', waving = false }) {
  return (
    <div 
      className={`mascot-star-container ${className}`} 
      style={{ width: size, height: size, position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <svg 
        viewBox="0 0 200 200" 
        width={size} 
        height={size} 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: 'drop-shadow(0 12px 24px rgba(234, 161, 31, 0.35))' }}
      >
        <defs>
          {/* Star Body Gradient */}
          <radialGradient id="starBodyGrad" cx="50%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#FFF280" />
            <stop offset="45%" stopColor="#FFC820" />
            <stop offset="85%" stopColor="#F5A008" />
            <stop offset="100%" stopColor="#DE8700" />
          </radialGradient>

          {/* Songkok Red Velvet Gradient */}
          <linearGradient id="peciGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#D92534" />
            <stop offset="50%" stopColor="#A81525" />
            <stop offset="100%" stopColor="#7E0C19" />
          </linearGradient>

          {/* Golden Trims */}
          <linearGradient id="goldTrim" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFEAA7" />
            <stop offset="50%" stopColor="#FDCB6E" />
            <stop offset="100%" stopColor="#E17055" />
          </linearGradient>

          {/* Baju Koko Gradient */}
          <linearGradient id="kokoGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#EAEFF5" />
          </linearGradient>

          {/* Cheek Blush */}
          <radialGradient id="blushGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FF7675" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#FF7675" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient Golden Glow */}
        <circle cx="100" cy="100" r="85" fill="rgba(255, 215, 0, 0.15)" filter="blur(15px)" />

        {/* --- 3D Star Body --- */}
        <g className={waving ? 'animate-float' : ''}>
          {/* Star Base Path (Puffy 5-point Star) */}
          <path
            d="M 100 22
               C 107 48, 126 65, 148 68
               C 174 72, 192 90, 185 116
               C 179 140, 154 150, 142 170
               C 128 192, 105 192, 92 180
               C 78 192, 55 192, 41 170
               C 29 150, 4 140, -2 116
               C -9 90, 9 72, 35 68
               C 57 65, 76 48, 83 22
               C 87 9, 96 9, 100 22 Z"
            fill="url(#starBodyGrad)"
            stroke="#D68000"
            strokeWidth="3"
            transform="scale(0.95) translate(5, 5)"
          />

          {/* Star Top Highlight Arc */}
          <path
            d="M 85 30 C 95 24, 105 24, 115 30"
            stroke="#FFFFFF"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.6"
          />

          {/* --- Baju Koko (White Islamic Shirt with Gold Trims) --- */}
          <g transform="translate(0, 10)">
            {/* White Body Fabric */}
            <path
              d="M 68 140 Q 100 135 132 140 L 140 185 Q 100 192 60 185 Z"
              fill="url(#kokoGrad)"
              stroke="#CBD5E1"
              strokeWidth="2"
            />
            {/* Center Golden Placket & Buttons */}
            <line x1="100" y1="138" x2="100" y2="187" stroke="url(#goldTrim)" strokeWidth="3" />
            <circle cx="100" cy="148" r="3" fill="#F39C12" />
            <circle cx="100" cy="162" r="3" fill="#F39C12" />
            <circle cx="100" cy="176" r="3" fill="#F39C12" />

            {/* Collar Trim */}
            <path
              d="M 85 138 Q 100 148 115 138"
              fill="none"
              stroke="url(#goldTrim)"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Sleeves & Hands */}
            {/* Left Hand (resting) */}
            <ellipse cx="50" cy="155" rx="9" ry="7" fill="#FFC820" stroke="#D68000" strokeWidth="2" />
            {/* Right Hand (Waving hello) */}
            <g transform={waving ? "translate(150, 125) rotate(-20)" : "translate(150, 145)"}>
              <ellipse cx="0" cy="0" rx="9" ry="8" fill="#FFC820" stroke="#D68000" strokeWidth="2" />
              {/* Thumbs */}
              <circle cx="-5" cy="-3" r="3.5" fill="#FFC820" />
            </g>
          </g>

          {/* --- Cheeks (Rosy Blush) --- */}
          <circle cx="68" cy="120" r="14" fill="url(#blushGrad)" />
          <circle cx="132" cy="120" r="14" fill="url(#blushGrad)" />

          {/* --- Eyes (Big, Anime Sparkly & Kind) --- */}
          {/* Left Eye */}
          <ellipse cx="78" cy="106" rx="9" ry="12" fill="#2C1810" />
          <circle cx="81" cy="102" r="4.5" fill="#FFFFFF" />
          <circle cx="76" cy="112" r="2" fill="#FFFFFF" />

          {/* Right Eye */}
          <ellipse cx="122" cy="106" rx="9" ry="12" fill="#2C1810" />
          <circle cx="125" cy="102" r="4.5" fill="#FFFFFF" />
          <circle cx="120" cy="112" r="2" fill="#FFFFFF" />

          {/* Eyebrows */}
          <path d="M 72 92 Q 78 87 85 91" fill="none" stroke="#683A14" strokeWidth="3" strokeLinecap="round" />
          <path d="M 115 91 Q 122 87 128 92" fill="none" stroke="#683A14" strokeWidth="3" strokeLinecap="round" />

          {/* --- Sweet Open Smile --- */}
          <path
            d="M 88 118 Q 100 134 112 118"
            fill="#C0392B"
            stroke="#8E1E14"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Tongue inside mouth */}
          <path
            d="M 94 125 Q 100 121 106 125 Q 100 132 94 125 Z"
            fill="#FF7675"
          />

          {/* --- Songkok / Peci (Red Islamic Cap with Motif) --- */}
          <g transform="translate(0, -6)">
            {/* Songkok Base */}
            <path
              d="M 76 56 C 76 34, 124 34, 124 56 C 124 64, 76 64, 76 56 Z"
              fill="url(#peciGrad)"
              stroke="#5C0B16"
              strokeWidth="2"
            />
            {/* Songkok Rim / Top Arc */}
            <ellipse cx="100" cy="38" rx="24" ry="7" fill="#BD1C2F" />
            <ellipse cx="100" cy="38" rx="20" ry="5" fill="#A81525" />

            {/* Songkok Islamic Golden Embroidery Pattern */}
            <path
              d="M 80 54 Q 90 48 100 54 Q 110 48 120 54"
              fill="none"
              stroke="url(#goldTrim)"
              strokeWidth="2"
              opacity="0.85"
            />
            <path
              d="M 82 46 Q 91 42 100 46 Q 109 42 118 46"
              fill="none"
              stroke="url(#goldTrim)"
              strokeWidth="1.5"
              opacity="0.6"
            />
          </g>
        </g>

        {/* Floating Golden Stars (Magical Sparkles) */}
        <g className="animate-glow">
          {/* Top Left Sparkle */}
          <path d="M 28 45 L 31 52 L 38 55 L 31 58 L 28 65 L 25 58 L 18 55 L 25 52 Z" fill="#F1C40F" />
          {/* Top Right Sparkle */}
          <path d="M 172 38 L 175 44 L 181 47 L 175 50 L 172 56 L 169 50 L 163 47 L 169 44 Z" fill="#F1C40F" />
          {/* Bottom Star Sparkle */}
          <circle cx="178" cy="115" r="3" fill="#F39C12" />
          <circle cx="22" cy="110" r="2.5" fill="#F39C12" />
        </g>
      </svg>
    </div>
  );
}
