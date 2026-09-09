import React, { useState } from 'react';
import LandingPage from './pages/LandingPage';
import StudentLogin from './pages/StudentLogin';
import StudentDashboard from './pages/StudentDashboard';
import StudentHome from './pages/StudentHome';
import StudentProgress from './pages/StudentProgress';
import StudentBadges from './pages/StudentBadges';
import TeacherLogin from './pages/TeacherLogin';
import TeacherDashboard from './pages/TeacherDashboard';
import TeacherClasses from './pages/TeacherClasses';
import TeacherStudents from './pages/TeacherStudents';
import TeacherHabits from './pages/TeacherHabits';
import TeacherAchievements from './pages/TeacherAchievements';
import TeacherExport from './pages/TeacherExport';
import TeacherMessages from './pages/TeacherMessages';
import TeacherSettings from './pages/TeacherSettings';

import { AppProvider, useApp } from './context/AppContext';

import './styles/variables.css';
import './styles/global.css';
import './styles/landing.css';
import './styles/student.css';
import './styles/teacher.css';

function AppContent() {
  // Master Routes
  const [currentRoute, setCurrentRoute] = useState('landing');
  
  // Student Portal Tabs: 'beranda' | 'kebiasaan' | 'hadiah' | 'profil'
  const [studentTab, setStudentTab] = useState('beranda');

  const { 
    habits, 
    toggleHabit, 
    studentData, 
    loading 
  } = useApp();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#FAF8F5',
        flexDirection: 'column',
        gap: 12
      }}>
        <div style={{ fontSize: '3rem' }} className="animate-spin">⭐</div>
        <strong style={{ fontFamily: 'var(--font-heading)', color: '#8F1424' }}>Memuat Bintangku...</strong>
      </div>
    );
  }

  return (
    <div className="app-root-container">
      {/* Floating Quick Switcher for Pair Programming Review */}
      <div 
        className="no-print"
        style={{
          position: 'fixed',
          top: 12,
          right: 14,
          zIndex: 9999,
          background: 'rgba(26, 32, 44, 0.92)',
          backdropFilter: 'blur(8px)',
          borderRadius: 30,
          padding: '4px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
          color: '#FFFFFF',
          fontSize: '0.74rem'
        }}
      >
        <span style={{ color: '#FBBF24', fontWeight: 700 }}>🔍 Demo:</span>
        <button 
          onClick={() => setCurrentRoute('landing')}
          style={{ 
            color: currentRoute === 'landing' ? '#FBBF24' : '#E2E8F0', 
            fontWeight: currentRoute === 'landing' ? 700 : 500,
            padding: '4px 6px'
          }}
        >
          Landing
        </button>
        <span style={{ opacity: 0.3 }}>|</span>
        <button 
          onClick={() => setCurrentRoute('student_login')}
          style={{ 
            color: currentRoute === 'student_login' ? '#FBBF24' : '#E2E8F0', 
            fontWeight: currentRoute === 'student_login' ? 700 : 500,
            padding: '4px 6px'
          }}
        >
          Login Siswa
        </button>
        <span style={{ opacity: 0.3 }}>|</span>
        <button 
          onClick={() => setCurrentRoute('teacher_login')}
          style={{ 
            color: currentRoute === 'teacher_login' ? '#FBBF24' : '#E2E8F0', 
            fontWeight: currentRoute === 'teacher_login' ? 700 : 500,
            padding: '4px 6px'
          }}
        >
          Login Guru (OTP)
        </button>
        <span style={{ opacity: 0.3 }}>|</span>
        <button 
          onClick={() => { setCurrentRoute('student_beranda'); setStudentTab('beranda'); }}
          style={{ 
            color: (currentRoute === 'student_beranda' && studentTab === 'beranda') ? '#FBBF24' : '#E2E8F0', 
            fontWeight: (currentRoute === 'student_beranda' && studentTab === 'beranda') ? 700 : 500,
            padding: '4px 6px'
          }}
        >
          Beranda Siswa
        </button>
        <span style={{ opacity: 0.3 }}>|</span>
        <button 
          onClick={() => { setCurrentRoute('student_beranda'); setStudentTab('kebiasaan'); }}
          style={{ 
            color: (currentRoute === 'student_beranda' && studentTab === 'kebiasaan') ? '#FBBF24' : '#E2E8F0', 
            fontWeight: (currentRoute === 'student_beranda' && studentTab === 'kebiasaan') ? 700 : 500,
            padding: '4px 6px'
          }}
        >
          Kebiasaan Siswa
        </button>
        <span style={{ opacity: 0.3 }}>|</span>
        <button 
          onClick={() => setCurrentRoute('teacher_dashboard')}
          style={{ 
            color: currentRoute.startsWith('teacher_') ? '#FBBF24' : '#E2E8F0', 
            fontWeight: currentRoute.startsWith('teacher_') ? 700 : 500,
            padding: '4px 6px'
          }}
        >
          Panel Guru
        </button>
      </div>

      {/* Main View Router */}
      {currentRoute === 'landing' && (
        <LandingPage setCurrentRoute={setCurrentRoute} />
      )}

      {currentRoute === 'student_login' && (
        <StudentLogin setCurrentRoute={setCurrentRoute} />
      )}

      {currentRoute === 'teacher_login' && (
        <TeacherLogin setCurrentRoute={setCurrentRoute} />
      )}

      {currentRoute === 'student_beranda' && (
        <>
          {studentTab === 'beranda' ? (
            <StudentDashboard 
              studentData={studentData}
              habits={habits}
              activeTab={studentTab}
              setActiveTab={setStudentTab}
              setCurrentRoute={setCurrentRoute}
            />
          ) : studentTab === 'kebiasaan' ? (
            <StudentHome 
              studentData={studentData}
              habits={habits}
              onToggleHabit={toggleHabit}
              activeTab={studentTab}
              setActiveTab={setStudentTab}
              setCurrentRoute={setCurrentRoute}
            />
          ) : studentTab === 'hadiah' ? (
            <StudentProgress 
              studentData={studentData}
              activeTab={studentTab}
              setActiveTab={setStudentTab}
              setCurrentRoute={setCurrentRoute}
            />
          ) : (
            <StudentBadges 
              studentData={studentData}
              activeTab={studentTab}
              setActiveTab={setStudentTab}
              setCurrentRoute={setCurrentRoute}
            />
          )}
        </>
      )}

      {/* 8 DEDICATED TEACHER SIDEBAR VIEWS */}
      {currentRoute === 'teacher_dashboard' && (
        <TeacherDashboard 
          currentRoute={currentRoute}
          setCurrentRoute={setCurrentRoute}
        />
      )}

      {currentRoute === 'teacher_classes' && (
        <TeacherClasses 
          currentRoute={currentRoute}
          setCurrentRoute={setCurrentRoute}
        />
      )}

      {currentRoute === 'teacher_students' && (
        <TeacherStudents 
          currentRoute={currentRoute}
          setCurrentRoute={setCurrentRoute}
        />
      )}

      {currentRoute === 'teacher_habits' && (
        <TeacherHabits 
          currentRoute={currentRoute}
          setCurrentRoute={setCurrentRoute}
        />
      )}

      {currentRoute === 'teacher_achievements' && (
        <TeacherAchievements 
          currentRoute={currentRoute}
          setCurrentRoute={setCurrentRoute}
        />
      )}

      {currentRoute === 'teacher_reports_export' && (
        <TeacherExport 
          currentRoute={currentRoute}
          setCurrentRoute={setCurrentRoute}
        />
      )}

      {currentRoute === 'teacher_messages' && (
        <TeacherMessages 
          currentRoute={currentRoute}
          setCurrentRoute={setCurrentRoute}
        />
      )}

      {currentRoute === 'teacher_settings' && (
        <TeacherSettings 
          currentRoute={currentRoute}
          setCurrentRoute={setCurrentRoute}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
