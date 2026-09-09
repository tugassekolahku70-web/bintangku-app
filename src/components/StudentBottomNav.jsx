import React from 'react';
import { Home, Calendar, Gift, User, Star } from 'lucide-react';
import { triggerStarConfetti } from './StarConfetti';

export default function StudentBottomNav({ activeTab, setActiveTab }) {
  const handleCenterClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    triggerStarConfetti({
      x: (rect.left + rect.width / 2) / window.innerWidth,
      y: (rect.top + rect.height / 2) / window.innerHeight
    });
  };

  return (
    <div className="student-bottom-nav-wrapper">
      <nav className="student-bottom-nav">
        {/* 1. Beranda */}
        <button 
          className={`bottom-nav-item ${activeTab === 'beranda' ? 'active' : ''}`}
          onClick={() => setActiveTab('beranda')}
        >
          <Home size={22} strokeWidth={activeTab === 'beranda' ? 2.5 : 2} />
          <span>Beranda</span>
        </button>

        {/* 2. Kebiasaan */}
        <button 
          className={`bottom-nav-item ${activeTab === 'kebiasaan' ? 'active' : ''}`}
          onClick={() => setActiveTab('kebiasaan')}
        >
          <Calendar size={22} strokeWidth={activeTab === 'kebiasaan' ? 2.5 : 2} />
          <span>Kebiasaan</span>
        </button>

        {/* 3. Center Special Floating Star Button */}
        <div className="bottom-nav-center-slot">
          <button 
            className="bottom-nav-star-btn"
            onClick={handleCenterClick}
            title="Kumpulkan Bintang Selebrasi!"
          >
            <Star size={26} fill="#FFD700" color="#FFE57F" />
          </button>
        </div>

        {/* 4. Hadiah / Progres (Toples Bintang) */}
        <button 
          className={`bottom-nav-item ${activeTab === 'hadiah' ? 'active' : ''}`}
          onClick={() => setActiveTab('hadiah')}
        >
          <Gift size={22} strokeWidth={activeTab === 'hadiah' ? 2.5 : 2} />
          <span>Hadiah</span>
        </button>

        {/* 5. Profil / Lencana */}
        <button 
          className={`bottom-nav-item ${activeTab === 'profil' ? 'active' : ''}`}
          onClick={() => setActiveTab('profil')}
        >
          <User size={22} strokeWidth={activeTab === 'profil' ? 2.5 : 2} />
          <span>Profil</span>
        </button>
      </nav>
    </div>
  );
}
