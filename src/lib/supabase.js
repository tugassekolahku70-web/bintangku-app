import { createClient } from '@supabase/supabase-js';
import { INITIAL_HABITS, CURRENT_STUDENT, INITIAL_STUDENTS } from './mockData';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-project-id')
);

// Supabase client instance
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Helper: Persistent Local Storage state for instant offline & demo use
const STORAGE_KEYS = {
  HABITS: 'bintangku_habits',
  STUDENT: 'bintangku_current_student',
  STUDENTS_LIST: 'bintangku_students_list'
};

export function getStoredHabits() {
  const data = localStorage.getItem(STORAGE_KEYS.HABITS);
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_HABITS;
    }
  }
  localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(INITIAL_HABITS));
  return INITIAL_HABITS;
}

export function saveStoredHabits(habits) {
  localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
}

export function getStoredStudent() {
  const data = localStorage.getItem(STORAGE_KEYS.STUDENT);
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      return CURRENT_STUDENT;
    }
  }
  localStorage.setItem(STORAGE_KEYS.STUDENT, JSON.stringify(CURRENT_STUDENT));
  return CURRENT_STUDENT;
}

export function saveStoredStudent(student) {
  localStorage.setItem(STORAGE_KEYS.STUDENT, JSON.stringify(student));
}

export function getStoredStudentsList() {
  const data = localStorage.getItem(STORAGE_KEYS.STUDENTS_LIST);
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_STUDENTS;
    }
  }
  localStorage.setItem(STORAGE_KEYS.STUDENTS_LIST, JSON.stringify(INITIAL_STUDENTS));
  return INITIAL_STUDENTS;
}

export function saveStoredStudentsList(students) {
  localStorage.setItem(STORAGE_KEYS.STUDENTS_LIST, JSON.stringify(students));
}
