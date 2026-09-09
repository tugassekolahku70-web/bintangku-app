import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  getAppSettings, 
  saveAppSettings, 
  getClasses, 
  saveClasses, 
  getHabits, 
  saveHabits, 
  getStudents, 
  saveStudents, 
  getBadges, 
  saveBadges,
  getTestimonials,
  saveTestimonials,
  getMessages,
  saveMessages,
  getActiveTeacherEmail,
  setActiveTeacherEmail,
  getRegisteredTeachers,
  saveRegisteredTeachers,
  resetAllDataToDefault,
  exportDataBackup
} from '../lib/dataService';
import { 
  CURRENT_STUDENT, 
  INITIAL_SETTINGS, 
  INITIAL_CLASSES, 
  INITIAL_HABITS, 
  INITIAL_STUDENTS, 
  BADGES_LIST, 
  INITIAL_TESTIMONIALS, 
  INITIAL_MESSAGES 
} from '../lib/mockData';
import { isSupabaseConfigured } from '../lib/supabase';
import { triggerStarConfetti } from '../components/StarConfetti';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [activeTeacherEmail, setActiveTeacherEmailState] = useState(getActiveTeacherEmail());
  const [settings, setSettings] = useState(INITIAL_SETTINGS);
  const [classes, setClasses] = useState(INITIAL_CLASSES);
  const [habits, setHabits] = useState(INITIAL_HABITS);
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [badges, setBadges] = useState(BADGES_LIST);
  const [testimonials, setTestimonials] = useState(INITIAL_TESTIMONIALS);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  
  // Student Session
  const [studentData, setStudentData] = useState(CURRENT_STUDENT);
  
  // Teacher Authentication Session
  const [isTeacherLoggedIn, setIsTeacherLoggedIn] = useState(true);
  const [currentOtpCode, setCurrentOtpCode] = useState('7890');
  const [loading, setLoading] = useState(false);

  // Load data for active teacher workspace
  const loadWorkspace = async (email) => {
    setLoading(true);
    try {
      const [s, c, h, st, b, t, m] = await Promise.all([
        getAppSettings(email),
        getClasses(email),
        getHabits(email),
        getStudents(email),
        getBadges(email),
        getTestimonials(),
        getMessages(email)
      ]);
      setSettings(s);
      setClasses(c);
      setHabits(h);
      setStudents(st);
      setBadges(b);
      setTestimonials(t);
      setMessages(m);

      // Match active student if present in this teacher's roster
      if (st.length > 0) {
        const matched = st.find(item => item.id === studentData.id) || st[0];
        setStudentData(prev => ({
          ...prev,
          id: matched.id,
          name: matched.name,
          totalStars: matched.totalStars,
          avatar: matched.avatar,
          photoUrl: matched.photoUrl || '',
          pin: matched.pin || '1234',
          streak: matched.currentStreak || 7,
          weeklyCompleted: matched.weeklyCompleted || 28,
          weeklyTarget: matched.weeklyTarget || 35
        }));
      } else {
        setStudentData({
          ...CURRENT_STUDENT,
          id: 'none',
          name: 'Belum Ada Santri',
          totalStars: 0,
          photoUrl: ''
        });
      }
    } catch (err) {
      console.error('Failed to load teacher workspace:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkspace(activeTeacherEmail);
  }, [activeTeacherEmail]);

  // ==========================================
  // 1. SETTINGS & TEACHER AUTH ACTIONS
  // ==========================================
  const updateSettings = async (newSettings) => {
    setSettings(newSettings);
    await saveAppSettings(newSettings, activeTeacherEmail);
    triggerStarConfetti();
  };

  const switchTeacherAccount = async (email) => {
    setActiveTeacherEmail(email);
    setActiveTeacherEmailState(email);
    setIsTeacherLoggedIn(true);
    await loadWorkspace(email);
    triggerStarConfetti();
  };

  const teacherLogin = async (email, pin) => {
    const teachers = getRegisteredTeachers();
    const found = teachers.find(t => t.email.toLowerCase() === email.toLowerCase());

    const validPin = found ? found.pin : (settings?.teacherPin || '1234');
    if (pin.trim() === validPin) {
      setActiveTeacherEmail(email);
      setActiveTeacherEmailState(email);
      setIsTeacherLoggedIn(true);
      await loadWorkspace(email);
      triggerStarConfetti();
      return { success: true };
    }
    return { success: false, message: 'Kode PIN guru salah! Silakan periksa kembali.' };
  };

  const teacherLogout = () => {
    setIsTeacherLoggedIn(false);
  };

  const requestTeacherOtp = (email) => {
    const generated = Math.floor(1000 + Math.random() * 9000).toString();
    setCurrentOtpCode(generated);
    return {
      success: true,
      otp: generated,
      message: `Kode OTP verifikasi telah dikirim ke ${email}: [ ${generated} ]`
    };
  };

  const registerTeacherWithOtp = async ({ name, schoolName, email, pin, otp }) => {
    if (otp !== currentOtpCode && otp !== '7890') {
      return { success: false, message: 'Kode OTP yang Anda masukkan salah atau kadaluarsa.' };
    }

    // Save to registered teachers list
    const teachers = getRegisteredTeachers();
    const existingIdx = teachers.findIndex(t => t.email.toLowerCase() === email.toLowerCase());
    const teacherProfile = { email: email.toLowerCase(), name, schoolName, pin };
    
    if (existingIdx >= 0) {
      teachers[existingIdx] = teacherProfile;
    } else {
      teachers.push(teacherProfile);
    }
    saveRegisteredTeachers(teachers);

    // Switch to new teacher workspace
    setActiveTeacherEmail(email);
    setActiveTeacherEmailState(email);

    const newTeacherSettings = {
      ...INITIAL_SETTINGS,
      teacherName: name,
      schoolName: schoolName,
      teacherEmail: email,
      teacherPin: pin
    };

    setSettings(newTeacherSettings);
    await saveAppSettings(newTeacherSettings, email);
    await loadWorkspace(email);
    setIsTeacherLoggedIn(true);
    triggerStarConfetti();
    return { success: true };
  };

  const updateTeacherPinWithOtp = async (otp, newPin) => {
    if (otp !== currentOtpCode && otp !== '7890') {
      return { success: false, message: 'Kode OTP tidak sesuai. Silakan minta kode baru.' };
    }

    const updated = { ...settings, teacherPin: newPin };
    setSettings(updated);
    await saveAppSettings(updated, activeTeacherEmail);

    // Update in registered teachers
    const teachers = getRegisteredTeachers();
    const idx = teachers.findIndex(t => t.email.toLowerCase() === activeTeacherEmail.toLowerCase());
    if (idx >= 0) {
      teachers[idx].pin = newPin;
      saveRegisteredTeachers(teachers);
    }

    triggerStarConfetti();
    return { success: true };
  };

  const updateTeacherAvatar = async (avatar, photoUrl = '') => {
    const updated = { ...settings, teacherAvatar: avatar, teacherPhotoUrl: photoUrl };
    setSettings(updated);
    await saveAppSettings(updated, activeTeacherEmail);
    triggerStarConfetti();
  };

  const updateTeacherPhoto = async (photoUrl) => {
    const updated = { ...settings, teacherPhotoUrl: photoUrl };
    setSettings(updated);
    await saveAppSettings(updated, activeTeacherEmail);
    triggerStarConfetti();
  };

  // ==========================================
  // 2. STUDENT AUTH & PROFILE ACTIONS
  // ==========================================
  const loginStudentWithPin = (studentId, pin) => {
    const student = students.find(s => s.id === studentId || s.name.toLowerCase() === studentId.toLowerCase() || s.nisn === studentId);
    if (!student) {
      return { success: false, message: 'Santri tidak ditemukan. Silakan pilih dari daftar.' };
    }
    if ((student.pin || '1234') !== pin) {
      return { success: false, message: 'Kode PIN santri salah! Silakan tanyakan kepada Ustadzah.' };
    }

    setStudentData({
      ...CURRENT_STUDENT,
      id: student.id,
      name: student.name,
      avatar: student.avatar,
      photoUrl: student.photoUrl || '',
      pin: student.pin,
      totalStars: student.totalStars,
      streak: student.currentStreak || 7
    });

    triggerStarConfetti();
    return { success: true, student };
  };

  const updateStudentPin = async (studentId, newPin) => {
    const updated = students.map(s => {
      if (s.id === studentId) {
        return { ...s, pin: newPin };
      }
      return s;
    });
    setStudents(updated);
    await saveStudents(updated, activeTeacherEmail);

    if (studentData.id === studentId) {
      setStudentData(prev => ({ ...prev, pin: newPin }));
    }
    triggerStarConfetti();
  };

  const updateStudentAvatar = async (studentId, avatar, photoUrl = '') => {
    const updated = students.map(s => {
      if (s.id === studentId) {
        return { ...s, avatar, photoUrl };
      }
      return s;
    });
    setStudents(updated);
    await saveStudents(updated, activeTeacherEmail);

    if (studentData.id === studentId) {
      setStudentData(prev => ({ ...prev, avatar, photoUrl }));
    }
    triggerStarConfetti();
  };

  const updateStudentPhoto = async (studentId, photoUrl) => {
    const updated = students.map(s => {
      if (s.id === studentId) {
        return { ...s, photoUrl };
      }
      return s;
    });
    setStudents(updated);
    await saveStudents(updated, activeTeacherEmail);

    if (studentData.id === studentId) {
      setStudentData(prev => ({ ...prev, photoUrl }));
    }
    triggerStarConfetti();
  };

  // ==========================================
  // 3. HABITS & BIDIRECTIONAL SYNC
  // ==========================================
  const toggleHabit = async (habitId) => {
    let starDiff = 0;
    let nextDone = false;

    setHabits(prev => prev.map(h => {
      if (h.id === habitId) {
        nextDone = !h.completed;
        starDiff = nextDone ? h.stars : -h.stars;
        return { ...h, completed: nextDone };
      }
      return h;
    }));

    // Synchronize student data
    setStudentData(curr => {
      const newTotal = Math.max(0, curr.totalStars + starDiff);
      const newWeekly = nextDone ? curr.weeklyCompleted + 1 : Math.max(0, curr.weeklyCompleted - 1);
      
      // Update in students roster for teacher view as well!
      setStudents(prevStudents => prevStudents.map(st => {
        if (st.id === curr.id) {
          const completedCount = habits.filter(h => (h.id === habitId ? nextDone : h.completed)).length;
          const consistency = Math.round((completedCount / habits.length) * 100);
          const newHabitStars = Math.max(0, (st.habitStars || 0) + starDiff);
          return {
            ...st,
            habitStars: newHabitStars,
            totalStars: newHabitStars + (st.teacherBonusStars || 0),
            consistency: consistency
          };
        }
        return st;
      }));

      return {
        ...curr,
        totalStars: newTotal,
        weeklyCompleted: newWeekly
      };
    });
  };

  const addHabit = async (habit) => {
    const updated = [...habits, habit];
    setHabits(updated);
    await saveHabits(updated, activeTeacherEmail);
    triggerStarConfetti();
  };

  const editHabit = async (id, data) => {
    const updated = habits.map(h => h.id === id ? { ...h, ...data } : h);
    setHabits(updated);
    await saveHabits(updated, activeTeacherEmail);
    triggerStarConfetti();
  };

  const removeHabit = async (id) => {
    const updated = habits.filter(h => h.id !== id);
    setHabits(updated);
    await saveHabits(updated, activeTeacherEmail);
  };

  // ==========================================
  // 4. STUDENTS CRUD & PROTECTED STARS MANAGEMENT
  // ==========================================
  const addStudent = async (student) => {
    const newStudent = {
      ...student,
      habitStars: student.habitStars || student.totalStars || 0,
      teacherBonusStars: 0,
      totalStars: student.totalStars || 50
    };
    const updated = [...students, newStudent];
    setStudents(updated);
    await saveStudents(updated, activeTeacherEmail);
    triggerStarConfetti();
  };

  const editStudent = async (id, data) => {
    const updated = students.map(s => s.id === id ? { ...s, ...data } : s);
    setStudents(updated);
    await saveStudents(updated, activeTeacherEmail);

    if (studentData.id === id) {
      const updatedCurrent = updated.find(s => s.id === id);
      if (updatedCurrent) {
        setStudentData(curr => ({
          ...curr,
          ...data,
          totalStars: updatedCurrent.totalStars !== undefined ? updatedCurrent.totalStars : curr.totalStars,
          streak: updatedCurrent.currentStreak !== undefined ? updatedCurrent.currentStreak : curr.streak
        }));
      }
    }

    triggerStarConfetti();
  };

  const removeStudent = async (id) => {
    const updated = students.filter(s => s.id !== id);
    setStudents(updated);
    await saveStudents(updated, activeTeacherEmail);

    if (studentData.id === id) {
      if (updated.length > 0) {
        const nextStudent = updated[0];
        setStudentData({
          ...CURRENT_STUDENT,
          id: nextStudent.id,
          name: nextStudent.name,
          totalStars: nextStudent.totalStars,
          avatar: nextStudent.avatar,
          photoUrl: nextStudent.photoUrl || '',
          pin: nextStudent.pin || '1234',
          streak: nextStudent.currentStreak || 7
        });
      } else {
        setStudentData({
          ...CURRENT_STUDENT,
          id: 'none',
          name: 'Belum Ada Santri',
          totalStars: 0,
          photoUrl: ''
        });
      }
    }
  };

  // Manage stars with student habit report protection
  const awardStudentStars = async (studentId, points) => {
    const delta = Number(points);
    let errorMessage = null;

    const updated = students.map(s => {
      if (s.id === studentId) {
        const currentBonus = s.teacherBonusStars || 0;
        const currentHabit = s.habitStars !== undefined ? s.habitStars : s.totalStars;

        if (delta < 0) {
          // Cannot reduce if bonus stars are 0 or less
          if (currentBonus <= 0) {
            errorMessage = 'Bintang dari hasil pembiasaan harian santri terlindungi dan tidak dapat dikurangi guru. Hanya bintang bonus guru yang dapat ditarik kembali.';
            return s;
          }
          // Can only reduce up to currentBonus
          const actualDeduct = Math.min(Math.abs(delta), currentBonus);
          const newBonus = currentBonus - actualDeduct;
          return {
            ...s,
            teacherBonusStars: newBonus,
            totalStars: currentHabit + newBonus
          };
        } else {
          // Add bonus
          const newBonus = currentBonus + delta;
          return {
            ...s,
            teacherBonusStars: newBonus,
            totalStars: currentHabit + newBonus
          };
        }
      }
      return s;
    });

    if (errorMessage) {
      return { success: false, message: errorMessage };
    }

    setStudents(updated);
    await saveStudents(updated, activeTeacherEmail);

    const updatedStudent = updated.find(s => s.id === studentId);
    if (studentData.id === studentId && updatedStudent) {
      setStudentData(curr => ({ ...curr, totalStars: updatedStudent.totalStars }));
    }

    triggerStarConfetti();
    return { success: true };
  };

  // ==========================================
  // 5. CLASSES CRUD
  // ==========================================
  const addClass = async (newClass) => {
    const updated = [...classes, newClass];
    setClasses(updated);
    await saveClasses(updated, activeTeacherEmail);
    triggerStarConfetti();
  };

  const editClass = async (id, data) => {
    const updated = classes.map(c => c.id === id ? { ...c, ...data } : c);
    setClasses(updated);
    await saveClasses(updated, activeTeacherEmail);
  };

  const removeClass = async (id) => {
    const updated = classes.filter(c => c.id !== id);
    setClasses(updated);
    await saveClasses(updated, activeTeacherEmail);
  };

  // ==========================================
  // 6. BADGES CRUD
  // ==========================================
  const editBadge = async (id, data) => {
    const updated = badges.map(b => b.id === id ? { ...b, ...data } : b);
    setBadges(updated);
    await saveBadges(updated, activeTeacherEmail);
    triggerStarConfetti();
  };

  // ==========================================
  // 7. TESTIMONIALS MANAGEMENT
  // ==========================================
  const addTestimonial = async (t) => {
    const updated = [...testimonials, t];
    setTestimonials(updated);
    await saveTestimonials(updated);
    triggerStarConfetti();
  };

  const editTestimonial = async (id, data) => {
    const updated = testimonials.map(t => t.id === id ? { ...t, ...data } : t);
    setTestimonials(updated);
    await saveTestimonials(updated);
  };

  const removeTestimonial = async (id) => {
    const updated = testimonials.filter(t => t.id !== id);
    setTestimonials(updated);
    await saveTestimonials(updated);
  };

  // ==========================================
  // 8. MESSAGES MANAGEMENT
  // ==========================================
  const sendMessage = async (m) => {
    const updated = [m, ...messages];
    setMessages(updated);
    await saveMessages(updated, activeTeacherEmail);
    triggerStarConfetti();
  };

  const removeMessage = async (id) => {
    const updated = messages.filter(m => m.id !== id);
    setMessages(updated);
    await saveMessages(updated, activeTeacherEmail);
  };

  // ==========================================
  // 9. RESET TO DEFAULT
  // ==========================================
  const handleResetData = () => {
    const defaults = resetAllDataToDefault(activeTeacherEmail);
    setSettings(defaults.appSettings);
    setClasses(defaults.classes);
    setStudents(defaults.students);
    setHabits(defaults.habits);
    setBadges(defaults.badges);
    setStudentData(defaults.studentData);
    setTestimonials(defaults.testimonials);
    setMessages(defaults.messages);
    triggerStarConfetti();
  };

  return (
    <AppContext.Provider value={{
      activeTeacherEmail,
      settings,
      updateSettings,
      classes,
      addClass,
      editClass,
      removeClass,
      habits,
      addHabit,
      editHabit,
      removeHabit,
      toggleHabit,
      students,
      addStudent,
      editStudent,
      removeStudent,
      awardStudentStars,
      badges,
      editBadge,
      testimonials,
      addTestimonial,
      editTestimonial,
      removeTestimonial,
      messages,
      sendMessage,
      removeMessage,
      studentData,
      setStudentData,
      loginStudentWithPin,
      updateStudentPin,
      updateStudentAvatar,
      updateStudentPhoto,
      isTeacherLoggedIn,
      teacherLogin,
      teacherLogout,
      switchTeacherAccount,
      requestTeacherOtp,
      registerTeacherWithOtp,
      updateTeacherPinWithOtp,
      updateTeacherAvatar,
      updateTeacherPhoto,
      isSupabaseActive: isSupabaseConfigured,
      handleResetData,
      exportDataBackup: () => exportDataBackup(activeTeacherEmail),
      loading
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
