import React, { useState } from 'react';
import TeacherSidebar from '../components/TeacherSidebar';
import { useApp } from '../context/AppContext';
import { Mail, Send, Trash2, Menu, Sparkles, User, Calendar, MessageSquare } from 'lucide-react';
import { triggerStarConfetti } from '../components/StarConfetti';

export default function TeacherMessages({ currentRoute, setCurrentRoute }) {
  const { messages, sendMessage, removeMessage, students, settings } = useApp();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Form states
  const [targetStudentId, setTargetStudentId] = useState(students[0]?.id || 's-arman');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Apresiasi');
  const [sentNotice, setSentNotice] = useState(false);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    const student = students.find(s => s.id === targetStudentId) || students[0];

    sendMessage({
      id: `m-${Date.now()}`,
      studentId: student.id,
      studentName: student.name,
      date: 'Hari ini',
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      content: content,
      category: category
    });

    setContent('');
    setSentNotice(true);
    triggerStarConfetti();
    setTimeout(() => setSentNotice(false), 3000);
  };

  return (
    <div className="teacher-container">
      <TeacherSidebar 
        currentRoute="teacher_messages" 
        setCurrentRoute={setCurrentRoute}
        isOpenMobile={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      <main className="teacher-main-layout">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button className="btn-mobile-burger" onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}>
              <Menu size={22} />
            </button>
            <div>
              <h1 className="teacher-welcome-title">Catatan & Pesan Motivasi</h1>
              <p className="teacher-welcome-subtitle">
                Kirimkan pesan penyemangat dan evaluasi ibadah harian langsung ke santri
              </p>
            </div>
          </div>
        </div>

        <div className="teacher-messages-grid">
          {/* Send Message Form Card */}
          <div className="teacher-table-card animate-pop">
            <h3 style={{ marginBottom: 4 }}>Tulis Catatan Guru</h3>
            <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: 20 }}>
              Pesan ini akan langsung diterima santri pada beranda aplikasi
            </p>

            <form onSubmit={handleSendMessage}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: 4 }}>
                  Pilih Santri Penerima
                </label>
                <select
                  value={targetStudentId}
                  onChange={(e) => setTargetStudentId(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 12, border: '1.5px solid #CBD5E1' }}
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.avatar} {s.name} ({s.className || 'Kelas 2A'})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: 4 }}>
                  Kategori Pesan
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 12, border: '1.5px solid #CBD5E1' }}
                >
                  <option value="Apresiasi">⭐ Apresiasi & Pujian</option>
                  <option value="Motivasi">🔥 Motivasi & Semangat</option>
                  <option value="Tahfidz">📖 Catatan Tahfidz & Quran</option>
                  <option value="Bimbingan">🤝 Bimbingan & Nasihat</option>
                </select>
              </div>

              <div style={{ marginBottom: 18 }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: 4 }}>
                  Isi Pesan / Nasihat Hangat
                </label>
                <textarea
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Tuliskan kata-kata apresiasi untuk ananda..."
                  required
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1.5px solid #CBD5E1', outline: 'none' }}
                />
              </div>

              {sentNotice && (
                <div style={{ color: '#059669', fontSize: '0.85rem', fontWeight: 600, marginBottom: 14 }}>
                  ✓ Pesan berhasil terkirim ke santri!
                </div>
              )}

              <button type="submit" className="btn-primary" style={{ width: '100%', padding: 12 }}>
                <Send size={16} />
                <span>Kirimkan Catatan</span>
              </button>
            </form>
          </div>

          {/* Sent Messages History Card */}
          <div className="teacher-table-card animate-pop">
            <h3 style={{ marginBottom: 4 }}>Riwayat Pesan Terkirim ({messages.length})</h3>
            <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: 18 }}>
              Daftar catatan motivasi yang telah disampaikan Ustadzah
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {messages.map((m) => (
                <div 
                  key={m.id}
                  style={{
                    background: '#FAF8F5',
                    borderRadius: 16,
                    padding: '16px 18px',
                    border: '1px solid #F1ECE4'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <strong style={{ fontSize: '0.95rem', color: 'var(--primary-700)' }}>
                        Untuk: {m.studentName}
                      </strong>
                      <span style={{ 
                        fontSize: '0.7rem', 
                        background: '#FFFBEB', 
                        color: '#B45309', 
                        padding: '2px 8px', 
                        borderRadius: 6,
                        fontWeight: 700 
                      }}>
                        {m.category}
                      </span>
                    </div>

                    <button 
                      onClick={() => removeMessage(m.id)}
                      style={{ color: '#94A3B8', border: 'none', background: 'none', cursor: 'pointer' }}
                      title="Hapus Pesan"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <p style={{ fontSize: '0.88rem', color: '#334155', lineHeight: 1.5, margin: '6px 0' }}>
                    “{m.content}”
                  </p>

                  <div style={{ fontSize: '0.74rem', color: '#94A3B8', textAlign: 'right' }}>
                    {m.date} • {m.time}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
