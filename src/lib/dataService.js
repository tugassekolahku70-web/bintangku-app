import { supabase, isSupabaseConfigured } from './supabase';
import { 
  INITIAL_SETTINGS, 
  INITIAL_CLASSES, 
  INITIAL_STUDENTS, 
  AHMAD_SETTINGS,
  AHMAD_CLASSES,
  AHMAD_STUDENTS,
  INITIAL_HABITS, 
  BADGES_LIST, 
  CURRENT_STUDENT,
  INITIAL_TESTIMONIALS,
  INITIAL_MESSAGES
} from './mockData';

const DEFAULT_TEACHER_EMAIL = 'desiana@bintangku.id';

function getTeacherKey(email, entity) {
  const safeEmail = (email || DEFAULT_TEACHER_EMAIL).toLowerCase().replace(/[^a-z0-9]/g, '_');
  return `bintangku_${safeEmail}_${entity}`;
}

export function getActiveTeacherEmail() {
  return localStorage.getItem('bintangku_active_teacher_email') || DEFAULT_TEACHER_EMAIL;
}

export function setActiveTeacherEmail(email) {
  localStorage.setItem('bintangku_active_teacher_email', (email || DEFAULT_TEACHER_EMAIL).toLowerCase());
}

export function getRegisteredTeachers() {
  const local = localStorage.getItem('bintangku_registered_teachers');
  if (local) {
    try { 
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Make sure both Desiana and Ahmad exist
        const hasAhmad = parsed.some(t => t.email.toLowerCase() === 'ahmad@bintangku.id');
        if (!hasAhmad) {
          parsed.push({
            email: 'ahmad@bintangku.id',
            name: AHMAD_SETTINGS.teacherName,
            schoolName: AHMAD_SETTINGS.schoolName,
            pin: AHMAD_SETTINGS.teacherPin
          });
          localStorage.setItem('bintangku_registered_teachers', JSON.stringify(parsed));
        }
        return parsed;
      }
    } catch { /* ignore */ }
  }
  const defaultList = [
    {
      email: DEFAULT_TEACHER_EMAIL,
      name: INITIAL_SETTINGS.teacherName,
      schoolName: INITIAL_SETTINGS.schoolName,
      pin: INITIAL_SETTINGS.teacherPin
    },
    {
      email: 'ahmad@bintangku.id',
      name: AHMAD_SETTINGS.teacherName,
      schoolName: AHMAD_SETTINGS.schoolName,
      pin: AHMAD_SETTINGS.teacherPin
    }
  ];
  localStorage.setItem('bintangku_registered_teachers', JSON.stringify(defaultList));
  return defaultList;
}

export function saveRegisteredTeachers(teachers) {
  localStorage.setItem('bintangku_registered_teachers', JSON.stringify(teachers));
  return teachers;
}

// ==========================================
// 1. APP SETTINGS (Per-Teacher)
// ==========================================
export async function getAppSettings(email = getActiveTeacherEmail()) {
  const key = getTeacherKey(email, 'settings');
  const local = localStorage.getItem(key);
  if (local) {
    try { return JSON.parse(local); } catch { /* ignore */ }
  }

  // If default teacher (Desiana)
  if (email.toLowerCase() === DEFAULT_TEACHER_EMAIL) {
    localStorage.setItem(key, JSON.stringify(INITIAL_SETTINGS));
    return INITIAL_SETTINGS;
  }

  // If second pre-seeded teacher (Ahmad)
  if (email.toLowerCase() === 'ahmad@bintangku.id') {
    localStorage.setItem(key, JSON.stringify(AHMAD_SETTINGS));
    return AHMAD_SETTINGS;
  }

  // For a newly registered teacher, create their own profile from registered record
  const teachers = getRegisteredTeachers();
  const found = teachers.find(t => t.email.toLowerCase() === email.toLowerCase());
  const newTeacherSettings = {
    ...INITIAL_SETTINGS,
    teacherEmail: email,
    teacherName: found ? found.name : 'Pendidik Baru',
    schoolName: found ? found.schoolName : 'Sekolah Baru',
    teacherTitle: 'Wali Kelas',
    teacherPin: found ? found.pin : '1234',
    teacherPhotoUrl: ''
  };
  localStorage.setItem(key, JSON.stringify(newTeacherSettings));
  return newTeacherSettings;
}

export async function saveAppSettings(settings, email = getActiveTeacherEmail()) {
  const key = getTeacherKey(email, 'settings');
  localStorage.setItem(key, JSON.stringify(settings));

  if (isSupabaseConfigured) {
    try {
      await supabase
        .from('app_settings')
        .upsert({
          id: `settings_${email.replace(/[^a-z0-9]/g, '_')}`,
          school_name: settings.schoolName,
          school_address: settings.schoolAddress,
          teacher_name: settings.teacherName,
          teacher_title: settings.teacherTitle,
          teacher_email: settings.teacherEmail,
          teacher_pin: settings.teacherPin,
          teacher_avatar: settings.teacherAvatar || '🧕🏻',
          about_text: settings.aboutText,
          about_vision: settings.aboutVision,
          contact_whatsapp: settings.contactWhatsApp,
          contact_phone: settings.contactPhone,
          contact_email: settings.contactEmail,
          contact_address: settings.contactAddress,
          updated_at: new Date().toISOString()
        });
    } catch (err) {
      console.warn('Supabase saveAppSettings error:', err);
    }
  }
  return settings;
}

// ==========================================
// 2. CLASSES MANAGEMENT (Per-Teacher)
// ==========================================
export async function getClasses(email = getActiveTeacherEmail()) {
  const key = getTeacherKey(email, 'classes');
  const local = localStorage.getItem(key);
  if (local) {
    try { return JSON.parse(local); } catch { /* ignore */ }
  }

  if (email.toLowerCase() === DEFAULT_TEACHER_EMAIL) {
    localStorage.setItem(key, JSON.stringify(INITIAL_CLASSES));
    return INITIAL_CLASSES;
  }

  if (email.toLowerCase() === 'ahmad@bintangku.id') {
    localStorage.setItem(key, JSON.stringify(AHMAD_CLASSES));
    return AHMAD_CLASSES;
  }

  // New teacher default classes matching their registered school
  const teachers = getRegisteredTeachers();
  const found = teachers.find(t => t.email.toLowerCase() === email.toLowerCase());
  const school = found?.schoolName || 'Sekolah Baru';
  const teacher = found?.name || 'Pendidik';

  const newClasses = [
    { id: `c-${Date.now()}-1`, name: 'Kelas 1A', schoolName: school, teacherName: teacher, academicYear: '2024/2025' },
    { id: `c-${Date.now()}-2`, name: 'Kelas 1B', schoolName: school, teacherName: teacher, academicYear: '2024/2025' }
  ];
  localStorage.setItem(key, JSON.stringify(newClasses));
  return newClasses;
}

export async function saveClasses(classesList, email = getActiveTeacherEmail()) {
  const key = getTeacherKey(email, 'classes');
  localStorage.setItem(key, JSON.stringify(classesList));
  return classesList;
}

// ==========================================
// 3. STUDENTS MANAGEMENT (Per-Teacher with Protected Stars)
// ==========================================
export async function getStudents(email = getActiveTeacherEmail()) {
  const key = getTeacherKey(email, 'students');
  const local = localStorage.getItem(key);
  if (local) {
    try { 
      const parsed = JSON.parse(local);
      // Ensure all students have habitStars and teacherBonusStars tracked
      return parsed.map(s => {
        const bonus = s.teacherBonusStars || 0;
        const habit = s.habitStars !== undefined ? s.habitStars : Math.max(0, s.totalStars - bonus);
        return {
          ...s,
          habitStars: habit,
          teacherBonusStars: bonus,
          totalStars: habit + bonus
        };
      });
    } catch { /* ignore */ }
  }

  if (email.toLowerCase() === DEFAULT_TEACHER_EMAIL) {
    const initialized = INITIAL_STUDENTS.map(s => ({
      ...s,
      habitStars: s.totalStars,
      teacherBonusStars: 0
    }));
    localStorage.setItem(key, JSON.stringify(initialized));
    return initialized;
  }

  if (email.toLowerCase() === 'ahmad@bintangku.id') {
    const initializedAhmad = AHMAD_STUDENTS.map(s => ({
      ...s,
      habitStars: s.totalStars,
      teacherBonusStars: 0
    }));
    localStorage.setItem(key, JSON.stringify(initializedAhmad));
    return initializedAhmad;
  }

  // Newly registered teacher starts with their own fresh empty roster
  localStorage.setItem(key, JSON.stringify([]));
  return [];
}

export async function saveStudents(studentsList, email = getActiveTeacherEmail()) {
  const key = getTeacherKey(email, 'students');
  localStorage.setItem(key, JSON.stringify(studentsList));
  return studentsList;
}

// ==========================================
// 4. HABITS MANAGEMENT (Per-Teacher)
// ==========================================
export async function getHabits(email = getActiveTeacherEmail()) {
  const key = getTeacherKey(email, 'habits');
  const local = localStorage.getItem(key);
  if (local) {
    try { return JSON.parse(local); } catch { /* ignore */ }
  }
  localStorage.setItem(key, JSON.stringify(INITIAL_HABITS));
  return INITIAL_HABITS;
}

export async function saveHabits(habitsList, email = getActiveTeacherEmail()) {
  const key = getTeacherKey(email, 'habits');
  localStorage.setItem(key, JSON.stringify(habitsList));
  return habitsList;
}

// ==========================================
// 5. BADGES MANAGEMENT
// ==========================================
export async function getBadges(email = getActiveTeacherEmail()) {
  const key = getTeacherKey(email, 'badges');
  const local = localStorage.getItem(key);
  if (local) {
    try { return JSON.parse(local); } catch { /* ignore */ }
  }
  localStorage.setItem(key, JSON.stringify(BADGES_LIST));
  return BADGES_LIST;
}

export async function saveBadges(badgesList, email = getActiveTeacherEmail()) {
  const key = getTeacherKey(email, 'badges');
  localStorage.setItem(key, JSON.stringify(badgesList));
  return badgesList;
}

// ==========================================
// 6. TESTIMONIALS MANAGEMENT
// ==========================================
export async function getTestimonials() {
  const local = localStorage.getItem('bintangku_testimonials');
  if (local) {
    try { return JSON.parse(local); } catch { /* ignore */ }
  }
  localStorage.setItem('bintangku_testimonials', JSON.stringify(INITIAL_TESTIMONIALS));
  return INITIAL_TESTIMONIALS;
}

export async function saveTestimonials(list) {
  localStorage.setItem('bintangku_testimonials', JSON.stringify(list));
  return list;
}

// ==========================================
// 7. MESSAGES (Per-Teacher)
// ==========================================
export async function getMessages(email = getActiveTeacherEmail()) {
  const key = getTeacherKey(email, 'messages');
  const local = localStorage.getItem(key);
  if (local) {
    try { return JSON.parse(local); } catch { /* ignore */ }
  }
  if (email.toLowerCase() === DEFAULT_TEACHER_EMAIL) {
    localStorage.setItem(key, JSON.stringify(INITIAL_MESSAGES));
    return INITIAL_MESSAGES;
  }
  localStorage.setItem(key, JSON.stringify([]));
  return [];
}

export async function saveMessages(list, email = getActiveTeacherEmail()) {
  const key = getTeacherKey(email, 'messages');
  localStorage.setItem(key, JSON.stringify(list));
  return list;
}

// ==========================================
// 8. BACKUP & RESET HELPERS
// ==========================================
export function exportDataBackup(email = getActiveTeacherEmail()) {
  const backup = {
    teacherEmail: email,
    appSettings: JSON.parse(localStorage.getItem(getTeacherKey(email, 'settings')) || '{}'),
    classes: JSON.parse(localStorage.getItem(getTeacherKey(email, 'classes')) || '[]'),
    habits: JSON.parse(localStorage.getItem(getTeacherKey(email, 'habits')) || '[]'),
    students: JSON.parse(localStorage.getItem(getTeacherKey(email, 'students')) || '[]'),
    badges: JSON.parse(localStorage.getItem(getTeacherKey(email, 'badges')) || '[]'),
    testimonials: JSON.parse(localStorage.getItem('bintangku_testimonials') || '[]'),
    messages: JSON.parse(localStorage.getItem(getTeacherKey(email, 'messages')) || '[]'),
    exportedAt: new Date().toISOString()
  };

  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Backup_Bintangku_${email}_${new Date().toISOString().slice(0,10)}.json`;
  a.click();
}

export function resetAllDataToDefault(email = getActiveTeacherEmail()) {
  const isAhmad = email.toLowerCase() === 'ahmad@bintangku.id';
  const targetSettings = isAhmad ? AHMAD_SETTINGS : INITIAL_SETTINGS;
  const targetClasses = isAhmad ? AHMAD_CLASSES : INITIAL_CLASSES;
  const baseStudents = isAhmad ? AHMAD_STUDENTS : INITIAL_STUDENTS;

  const initializedStudents = baseStudents.map(s => ({
    ...s,
    habitStars: s.totalStars,
    teacherBonusStars: 0
  }));

  const activeStudentDefault = isAhmad ? {
    ...CURRENT_STUDENT,
    id: AHMAD_STUDENTS[0].id,
    name: AHMAD_STUDENTS[0].name,
    avatar: AHMAD_STUDENTS[0].avatar,
    totalStars: AHMAD_STUDENTS[0].totalStars
  } : CURRENT_STUDENT;

  localStorage.setItem(getTeacherKey(email, 'settings'), JSON.stringify(targetSettings));
  localStorage.setItem(getTeacherKey(email, 'classes'), JSON.stringify(targetClasses));
  localStorage.setItem(getTeacherKey(email, 'students'), JSON.stringify(initializedStudents));
  localStorage.setItem(getTeacherKey(email, 'habits'), JSON.stringify(INITIAL_HABITS));
  localStorage.setItem(getTeacherKey(email, 'badges'), JSON.stringify(BADGES_LIST));
  localStorage.setItem('bintangku_active_student', JSON.stringify(activeStudentDefault));
  localStorage.setItem('bintangku_testimonials', JSON.stringify(INITIAL_TESTIMONIALS));
  localStorage.setItem(getTeacherKey(email, 'messages'), JSON.stringify(INITIAL_MESSAGES));

  return {
    appSettings: targetSettings,
    classes: targetClasses,
    students: initializedStudents,
    habits: INITIAL_HABITS,
    badges: BADGES_LIST,
    studentData: activeStudentDefault,
    testimonials: INITIAL_TESTIMONIALS,
    messages: INITIAL_MESSAGES
  };
}
