import nodemailer from 'nodemailer';

export default async (req) => {
  const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Tangani preflight request (CORS)
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders
    });
  }

  // Hanya menerima HTTP POST
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: corsHeaders
    });
  }

  try {
    const { email, otp, name, purpose } = await req.json();

    if (!email || !otp) {
      return new Response(JSON.stringify({ error: 'Email dan kode OTP wajib diisi' }), {
        status: 400,
        headers: corsHeaders
      });
    }

    // Bersihkan kredensial Gmail (hilangkan spasi yang sering ikut saat copy-paste dari Google)
    const rawGmailUser = process.env.GMAIL_USER || '';
    const rawGmailPassword = process.env.GMAIL_APP_PASSWORD || '';
    const gmailUser = rawGmailUser.trim();
    const gmailAppPassword = rawGmailPassword.replace(/\s+/g, ''); // Hapus semua spasi dari 16 karakter

    // Template HTML Email Resmi & Elegan
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Kode OTP Bintangku</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #F8FAFC; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F8FAFC; padding: 40px 10px;">
          <tr>
            <td align="center">
              <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 520px; background-color: #FFFFFF; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.06); border: 1px solid #E2E8F0;">
                <!-- Header Banner -->
                <tr>
                  <td align="center" style="background: linear-gradient(135deg, #8F1424 0%, #6D0D19 100%); padding: 32px 20px; color: #FFFFFF;">
                    <div style="font-size: 40px; line-height: 1; margin-bottom: 8px;">⭐</div>
                    <h1 style="margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; color: #FFFFFF;">Bintangku</h1>
                    <p style="margin: 6px 0 0; font-size: 13px; color: #FDE68A;">Kebiasaan Baikku Setiap Hari</p>
                  </td>
                </tr>

                <!-- Content Body -->
                <tr>
                  <td style="padding: 32px 28px; color: #1E293B;">
                    <h2 style="margin: 0 0 12px; font-size: 18px; color: #0F172A;">Assalamu'alaikum Warahmatullahi Wabarakatuh</h2>
                    <p style="margin: 0 0 16px; font-size: 14px; line-height: 1.6; color: #475569;">
                      Halo <strong>${name || 'Pendidik'}</strong>,<br>
                      Berikut adalah kode verifikasi OTP rahasia Anda untuk <strong>${purpose || 'Verifikasi Akun'}</strong> di portal Bintangku:
                    </p>

                    <!-- Big OTP Box -->
                    <div style="background-color: #FFFBEB; border: 2px dashed #F59E0B; border-radius: 14px; padding: 22px; text-align: center; margin: 24px 0;">
                      <span style="display: block; font-size: 11px; font-weight: 700; color: #B45309; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px;">Kode Verifikasi OTP Anda</span>
                      <span style="font-family: 'Courier New', Courier, monospace; font-size: 42px; font-weight: 800; color: #8F1424; letter-spacing: 10px; display: inline-block;">
                        ${otp}
                      </span>
                    </div>

                    <div style="background-color: #FEF2F2; border-left: 4px solid #EF4444; border-radius: 6px; padding: 12px 14px; margin-bottom: 24px;">
                      <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #991B1B;">
                        🔒 <strong>Keamanan &amp; Privasi:</strong> Kode ini bersifat rahasia dan berlaku selama <strong>10 menit</strong>. Jangan berikan kode ini kepada siapapun demi menjaga kerahasiaan akun Anda.
                      </p>
                    </div>

                    <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #64748B;">
                      Jika Anda tidak merasa meminta kode ini, silakan abaikan pesan ini dengan aman.
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td align="center" style="background-color: #F1F5F9; padding: 18px 20px; border-top: 1px solid #E2E8F0; font-size: 12px; color: #94A3B8;">
                    © 2026 Bintangku. Seluruh Hak Cipta Dilindungi.<br>
                    Platform Pembiasaan Ibadah &amp; Karakter Islami Anak
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    // ============================================================
    // METODE 1: Gmail SMTP via Nodemailer (100% GRATIS)
    // ============================================================
    if (gmailUser && gmailAppPassword) {
      try {
        const transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 465,
          secure: true, // Menggunakan SSL port 465 paling stabil di serverless
          auth: {
            user: gmailUser,
            pass: gmailAppPassword,
          },
          connectionTimeout: 10000,
          greetingTimeout: 10000,
        });

        await transporter.sendMail({
          from: `"Bintangku ⭐" <${gmailUser}>`,
          to: email,
          subject: `[Bintangku] Kode Verifikasi OTP Anda: ${otp}`,
          html: htmlContent,
        });

        return new Response(JSON.stringify({
          success: true,
          delivered: true,
          message: `Email OTP berhasil dikirim ke ${email} via Gmail`
        }), {
          status: 200,
          headers: corsHeaders
        });
      } catch (gmailErr) {
        console.error('Gagal kirim via Gmail SMTP:', gmailErr);
        return new Response(JSON.stringify({
          success: false,
          error: `Gagal mengirim email via Gmail (${gmailErr.message}). Pastikan App Password 16 karakter sudah benar.`
        }), {
          status: 500,
          headers: corsHeaders
        });
      }
    }

    // ============================================================
    // METODE 2: Resend API (Opsional, jika ada RESEND_API_KEY)
    // ============================================================
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      try {
        const resendResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: process.env.SENDER_EMAIL || 'Bintangku <onboarding@resend.dev>',
            to: [email],
            subject: `[Bintangku] Kode Verifikasi OTP Anda: ${otp}`,
            html: htmlContent
          })
        });

        const resendData = await resendResponse.json();
        if (resendResponse.ok) {
          return new Response(JSON.stringify({
            success: true,
            delivered: true,
            message: `Email OTP berhasil dikirim ke ${email} via Resend`,
            id: resendData.id
          }), {
            status: 200,
            headers: corsHeaders
          });
        }
      } catch (resendErr) {
        console.error('Gagal kirim via Resend:', resendErr);
      }
    }

    // ============================================================
    // FALLBACK: Belum ada konfigurasi email di Environment Variables
    // ============================================================
    console.warn(`[send-otp] Belum ada konfigurasi email di Netlify. OTP untuk ${email}: ${otp}`);
    return new Response(JSON.stringify({
      success: true,
      delivered: false,
      note: 'Fungsi aktif tetapi belum ada GMAIL_USER dan GMAIL_APP_PASSWORD di Netlify Environment Variables.'
    }), {
      status: 200,
      headers: corsHeaders
    });

  } catch (err) {
    console.error('Unexpected error in send-otp function:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: corsHeaders
    });
  }
};
