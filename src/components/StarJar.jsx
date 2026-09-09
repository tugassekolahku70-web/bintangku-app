import React from 'react';

export default function StarJar({ count = 28, maxCount = 35, totalStars = 270 }) {
  // All possible positions for glowing 3D star candies inside the jar (up to 24 slots)
  const allStarSlots = [
    // Bottom Layer (Floor)
    { x: 75, y: 228, r: 18, rot: 15 },
    { x: 105, y: 235, r: 20, rot: -10 },
    { x: 135, y: 234, r: 19, rot: 25 },
    { x: 165, y: 232, r: 21, rot: -15 },
    { x: 185, y: 224, r: 17, rot: 30 },

    // Second Layer
    { x: 65, y: 198, r: 19, rot: -20 },
    { x: 92, y: 202, r: 22, rot: 8 },
    { x: 122, y: 204, r: 24, rot: -5 },
    { x: 152, y: 202, r: 21, rot: 18 },
    { x: 180, y: 196, r: 20, rot: -12 },

    // Third Layer (Mid-Jar)
    { x: 72, y: 168, r: 20, rot: 25 },
    { x: 100, y: 172, r: 23, rot: -14 },
    { x: 130, y: 169, r: 25, rot: 10 },
    { x: 160, y: 172, r: 22, rot: -22 },
    { x: 185, y: 166, r: 18, rot: 16 },

    // Fourth Layer
    { x: 82, y: 138, r: 21, rot: -8 },
    { x: 112, y: 142, r: 24, rot: 15 },
    { x: 142, y: 139, r: 23, rot: -18 },
    { x: 172, y: 136, r: 20, rot: 5 },

    // Top Layer (Summit Overflow)
    { x: 98, y: 112, r: 22, rot: 12 },
    { x: 128, y: 108, r: 25, rot: -6 },
    { x: 155, y: 114, r: 21, rot: 20 },
    { x: 125, y: 86, r: 23, rot: 4 }
  ];

  // Dynamic star count scaling with student total stars
  // E.g., 50 stars -> 6 stars, 150 stars -> 12 stars, 300+ stars -> full 23 stars
  const dynamicCount = Math.max(
    3, 
    Math.min(allStarSlots.length, Math.round((Math.max(totalStars, 10) / 300) * allStarSlots.length))
  );
  const visibleStars = allStarSlots.slice(0, dynamicCount);

  // Dynamic glow brightness
  const glowIntensity = Math.min(0.85, Math.max(0.25, totalStars / 320));

  return (
    <div className="star-jar-wrapper" style={{ position: 'relative', width: 280, height: 330, margin: '0 auto' }}>
      {/* Golden Halo Glow behind jar */}
      <div 
        style={{
          position: 'absolute',
          top: '25%',
          left: '12%',
          width: '76%',
          height: '65%',
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(255, 200, 0, ${glowIntensity}) 0%, rgba(255, 150, 0, ${glowIntensity * 0.4}) 60%, transparent 80%)`,
          filter: 'blur(22px)',
          zIndex: 1,
          transition: 'all 0.5s ease'
        }}
      />

      <svg 
        viewBox="0 0 260 310" 
        width="100%" 
        height="100%" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: 'relative', zIndex: 2 }}
      >
        <defs>
          {/* Jar Gold Lid Gradient */}
          <linearGradient id="jarLidMetal" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8A5805" />
            <stop offset="25%" stopColor="#DF9F28" />
            <stop offset="50%" stopColor="#FFF4B8" />
            <stop offset="75%" stopColor="#DF9F28" />
            <stop offset="100%" stopColor="#784700" />
          </linearGradient>

          {/* 3D Gold Star Candy Gradient */}
          <radialGradient id="candyStar3D" cx="40%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FFFFFA" />
            <stop offset="30%" stopColor="#FFE566" />
            <stop offset="70%" stopColor="#F5A300" />
            <stop offset="100%" stopColor="#C96B00" />
          </radialGradient>

          {/* Glass Wall Gradient */}
          <linearGradient id="glassWall" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.45" />
            <stop offset="15%" stopColor="#FFFFFF" stopOpacity="0.08" />
            <stop offset="85%" stopColor="#FFFFFF" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.4" />
          </linearGradient>

          {/* Leather Tag */}
          <linearGradient id="tagGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#B31B2C" />
            <stop offset="100%" stopColor="#690A15" />
          </linearGradient>

          <filter id="starDrop" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2.5" stdDeviation="2.5" floodColor="#804000" floodOpacity="0.35" />
          </filter>
        </defs>

        {/* --- Back Glass Jar Shading --- */}
        <path
          d="M 68 70 
             C 45 88, 40 115, 40 155 
             C 40 225, 52 260, 75 268 
             C 95 275, 165 275, 185 268 
             C 208 260, 220 225, 220 155 
             C 220 115, 215 88, 192 70 
             Z"
          fill="rgba(255, 248, 220, 0.25)"
          stroke="#E2E8F0"
          strokeWidth="1.5"
        />

        {/* --- Packed Pile of Glowing Stars --- */}
        <g id="star-candies-pile">
          {visibleStars.map((star, i) => (
            <g 
              key={i} 
              transform={`translate(${star.x}, ${star.y}) rotate(${star.rot}) scale(${star.r / 18})`}
              filter="url(#starDrop)"
            >
              {/* Puffy 5-pointed star */}
              <path
                d="M 0 -16 
                   L 4.5 -5 
                   L 16.5 -4 
                   L 8 4.5 
                   L 10.5 16 
                   L 0 10.5 
                   L -10.5 16 
                   L -8 4.5 
                   L -16.5 -4 
                   L -4.5 -5 Z"
                fill="url(#candyStar3D)"
                stroke="#E58500"
                strokeWidth="1"
              />
              {/* Star Core Gloss */}
              <circle cx="-2" cy="-4" r="3" fill="#FFFFFF" opacity="0.75" />
            </g>
          ))}
        </g>

        {/* --- Front Glass Reflections & Gloss Overlays --- */}
        <path
          d="M 68 70 
             C 45 88, 40 115, 40 155 
             C 40 225, 52 260, 75 268 
             C 95 275, 165 275, 185 268 
             C 208 260, 220 225, 220 155 
             C 220 115, 215 88, 192 70 
             Z"
          fill="url(#glassWall)"
          stroke="#FFFFFF"
          strokeWidth="3"
          strokeOpacity="0.8"
        />

        {/* Left Curved Specular Reflection */}
        <path
          d="M 54 98 C 50 140, 52 205, 68 250"
          stroke="#FFFFFF"
          strokeWidth="7"
          strokeLinecap="round"
          opacity="0.6"
        />
        <path
          d="M 65 110 C 62 145, 64 190, 75 230"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.4"
        />

        {/* Right Rim Light */}
        <path
          d="M 206 98 C 210 140, 208 205, 194 250"
          stroke="#FFFFFF"
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.4"
        />

        {/* --- Jar Neck Rim --- */}
        <rect x="74" y="60" width="112" height="14" rx="4" fill="url(#jarLidMetal)" stroke="#925200" strokeWidth="1.5" />

        {/* --- Gold Screw Top Lid --- */}
        <rect x="66" y="44" width="128" height="20" rx="6" fill="url(#jarLidMetal)" stroke="#784000" strokeWidth="2" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.15))" />
        <line x1="72" y1="49" x2="188" y2="49" stroke="#FFF7C2" strokeWidth="2" opacity="0.9" />
        <line x1="72" y1="58" x2="188" y2="58" stroke="#572C00" strokeWidth="1.5" opacity="0.6" />
        <ellipse cx="130" cy="44" rx="60" ry="5" fill="#FFE57F" opacity="0.8" />

        {/* --- Hanging Tag "Bintangku" --- */}
        <g id="leather-tag" transform="translate(172, 70) rotate(14)">
          <path d="M -8 -8 Q 0 6 8 16" stroke="#D3B16B" strokeWidth="2.5" fill="none" />
          <rect 
            x="0" 
            y="14" 
            width="50" 
            height="46" 
            rx="10" 
            fill="url(#tagGrad)" 
            stroke="#F5A623" 
            strokeWidth="2" 
            filter="drop-shadow(0 6px 10px rgba(0, 0, 0, 0.3))"
          />
          <circle cx="25" cy="22" r="3.5" fill="#D3B16B" stroke="#683A00" strokeWidth="1" />
          <path
            d="M 25 28 L 27.2 33 L 32.5 33.7 L 28.5 37.5 L 29.5 42.8 L 25 39.8 L 20.5 42.8 L 21.5 37.5 L 17.5 33.7 L 22.8 33 Z"
            fill="#FFE066"
          />
          <text 
            x="25" 
            y="54" 
            fill="#FFFFFF" 
            fontSize="7.5" 
            fontWeight="bold" 
            textAnchor="middle" 
            fontFamily="sans-serif"
            letterSpacing="0.3"
          >
            Bintangku
          </text>
        </g>

        {/* Big Top Floating Star on Top of Lid */}
        <g transform="translate(110, 10)" className="animate-glow">
          <path
            d="M 20 0 L 26 13 L 40 15 L 30 25 L 32.5 39 L 20 32 L 7.5 39 L 10 25 L 0 15 L 14 13 Z"
            fill="url(#candyStar3D)"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            filter="drop-shadow(0 4px 12px rgba(245, 163, 0, 0.8))"
          />
        </g>
      </svg>
    </div>
  );
}
