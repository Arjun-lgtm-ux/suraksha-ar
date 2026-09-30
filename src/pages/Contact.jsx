import React, { useState } from 'react'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { useLang } from '../contexts/LanguageContext'
import { Mail, Instagram, Clock, Send, CheckCircle2, Shield, ArrowUpRight } from 'lucide-react'

export default function Contact() {
  const { lang } = useLang()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    const mailtoSubject = encodeURIComponent(subject || `[SurakshaAR Support] Inquiry from ${name || 'Trainee'}`)
    const mailtoBody = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)
    window.location.href = `mailto:surakshaar.in@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`
    setSubmitted(true)
  }

  const content = {
    en: {
      badge: "We're Here to Help",
      title: 'Contact SurakshaAR',
      subtitle: 'Have a question about industrial safety training, technical support, or institutional deployment? Reach out to our team.',
      emailCardTitle: 'Official Email',
      emailCardDesc: 'For general questions, OTP verification inquiries, certificate verification, and feedback.',
      socialCardTitle: 'Official Social',
      socialCardDesc: 'Follow our official Instagram profile for project updates, AR drill highlights, and safety advisories.',
      hoursCardTitle: 'Working Hours',
      hoursCardDays: 'Monday – Saturday, 9:00 AM – 6:00 PM IST',
      hoursCardReply: 'Standard inquiries receive replies within 24 business hours.',
      formTitle: 'Send us a Message',
      formDesc: 'Fill out the details below to dispatch your message directly to our official support inbox.',
      formSuccess: 'Email client opened! You can now send your inquiry to surakshaar.in@gmail.com',
      fieldName: 'Your Name',
      fieldEmail: 'Your Email Address',
      fieldSubject: 'Subject',
      fieldMessage: 'Message',
      placeholderName: 'Enter your name',
      placeholderEmail: 'you@gmail.com',
      placeholderSubject: 'e.g. Certificate issue / Training question',
      placeholderMessage: 'How can we assist you?',
      btnSend: 'Send Message via Email',
      emergencyTitle: 'National Emergency Helplines (India)',
      emergencySubtitle: 'In real-life workplace accidents, immediate emergency response is critical. Save these official national helpline numbers:',
      helplines: [
        { label: 'Fire Service', number: '101', icon: '🚒', color: '#DC2626' },
        { label: 'Ambulance / Medical', number: '108', icon: '🚑', color: '#DC2626' },
        { label: 'Police Emergency', number: '100', icon: '🚓', color: '#1D4ED8' },
        { label: 'All Emergency (National)', number: '112', icon: '📞', color: '#DC2626' },
        { label: 'Disaster Management', number: '1078', icon: '🌊', color: '#D97706' },
        { label: 'Chemical Emergency', number: '1800-180-4104', icon: '☣️', color: '#7C3AED' },
      ],
    },
    hi: {
      badge: 'हम आपकी सहायता के लिए तैयार हैं',
      title: 'SurakshaAR से संपर्क करें',
      subtitle: 'औद्योगिक सुरक्षा प्रशिक्षण, तकनीकी सहायता या संस्थागत उपयोग के संबंध में किसी भी प्रश्न के लिए हमारी टीम से संपर्क करें।',
      emailCardTitle: 'आधिकारिक ईमेल',
      emailCardDesc: 'सामान्य पूछताछ, OTP सत्यापन, प्रमाणपत्र सत्यापन और प्रतिक्रिया के लिए।',
      socialCardTitle: 'आधिकारिक सोशल मीडिया',
      socialCardDesc: 'परियोजना अपडेट, AR ड्रिल और सुरक्षा सलाह के लिए हमारे आधिकारिक इंस्टाग्राम को फॉलो करें।',
      hoursCardTitle: 'कार्य समय',
      hoursCardDays: 'सोमवार – शनिवार, सुबह 9:00 बजे से शाम 6:00 बजे IST',
      hoursCardReply: 'सभी प्रश्नों का उत्तर 24 व्यावसायिक घंटों के भीतर दिया जाता है।',
      formTitle: 'हमें संदेश भेजें',
      formDesc: 'अपना विवरण नीचे भरें और सीधे हमारे आधिकारिक सपोर्ट इनबॉक्स में संदेश भेजें।',
      formSuccess: 'ईमेल क्लाइंट खुल गया है! अब आप surakshaar.in@gmail.com पर अपना संदेश भेज सकते हैं।',
      fieldName: 'आपका नाम',
      fieldEmail: 'आपका ईमेल पता',
      fieldSubject: 'विषय',
      fieldMessage: 'संदेश',
      placeholderName: 'अपना पूरा नाम दर्ज करें',
      placeholderEmail: 'you@gmail.com',
      placeholderSubject: 'उदा. प्रमाणपत्र समस्या / प्रशिक्षण प्रश्न',
      placeholderMessage: 'हम आपकी क्या सहायता कर सकते हैं?',
      btnSend: 'ईमेल द्वारा संदेश भेजें',
      emergencyTitle: 'राष्ट्रीय आपातकालीन हेल्पलाइन (भारत)',
      emergencySubtitle: 'वास्तविक कार्यस्थल दुर्घटनाओं में तत्काल आपातकालीन प्रतिक्रिया महत्वपूर्ण है। इन आधिकारिक राष्ट्रीय नंबरों को सहेजें:',
      helplines: [
        { label: 'अग्निशमन सेवा (फायर)', number: '101', icon: '🚒', color: '#DC2626' },
        { label: 'एम्बुलेंस / चिकित्सा', number: '108', icon: '🚑', color: '#DC2626' },
        { label: 'पुलिस आपातकाल', number: '100', icon: '🚓', color: '#1D4ED8' },
        { label: 'राष्ट्रीय आपातकाल', number: '112', icon: '📞', color: '#DC2626' },
        { label: 'आपदा प्रबंधन', number: '1078', icon: '🌊', color: '#D97706' },
        { label: 'रासायनिक आपातकाल', number: '1800-180-4104', icon: '☣️', color: '#7C3AED' },
      ],
    },
    sat: {
      badge: 'ᱟᱞᱮ ᱟᱢᱟᱜ ᱜᱚᱲᱚ ᱞᱟᱹᱜᱤᱫ ᱢᱮᱱᱟᱜ ᱞᱮᱭᱟ',
      title: 'SurakshaAR ᱥᱟᱶ ᱡᱚᱯᱲᱟᱣ ᱢᱮ',
      subtitle: 'ᱠᱟᱹᱨᱜᱟᱲ ᱥᱩᱨᱠᱷᱟ ᱥᱤᱠᱷᱟᱣ, ᱴᱮᱠᱱᱤᱠᱟᱞ ᱜᱚᱲᱚ ᱥᱮ ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ ᱵᱟᱵᱚᱛ ᱟᱞᱮ ᱴᱷᱮᱱ ᱥᱮᱴᱮᱨᱚᱜ ᱢᱮ᱾',
      emailCardTitle: 'ᱚᱯᱷᱤᱥᱤᱭᱟᱞ ᱤᱢᱮᱞ',
      emailCardDesc: 'ᱥᱤᱠᱷᱟᱣ ᱠᱩᱠᱞᱤ, OTP ᱯᱟᱨᱠᱷᱟᱣ, ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ ᱯᱟᱨᱠᱷᱟᱣ ᱟᱨ ᱯᱷᱤᱰᱵᱮᱠ ᱞᱟᱹᱜᱤᱫ᱾',
      socialCardTitle: 'ᱚᱯᱷᱤᱥᱤᱭᱟᱞ ᱥᱳᱥᱟᱞ',
      socialCardDesc: 'ᱯᱨᱚᱡᱮᱠᱴ ᱠᱷᱚᱵᱚᱨ, AR ᱥᱤᱠᱷᱟᱣ ᱟᱨ ᱥᱩᱨᱠᱷᱟ ᱵᱟᱰᱟᱭ ᱞᱟᱹᱜᱤᱫ ᱤᱱᱥᱴᱟᱜᱨᱟᱢ ᱯᱷᱚᱞᱳ ᱢᱮ᱾',
      hoursCardTitle: 'ᱠᱟᱹᱢᱤ ᱚᱠᱛᱚ',
      hoursCardDays: 'ᱥᱚᱢᱵᱟᱨ – ᱥᱩᱱᱤᱵᱟᱨ, ᱥᱮᱛᱟᱜ ᱙:᱐᱐ ᱠᱷᱚᱱ ᱟᱹᱭᱩᱵ ᱖:᱐᱐ IST',
      hoursCardReply: '᱒᱔ ᱴᱟᱲᱟᱝ ᱵᱷᱤᱛᱨᱤ ᱛᱮᱞᱟ ᱮᱢ ᱦᱩᱭᱩᱜᱼᱟ᱾',
      formTitle: 'ᱢᱮᱥᱮᱡᱽ ᱠᱩᱞ ᱢᱮ',
      formDesc: 'ᱞᱟᱛᱟᱨ ᱨᱮ ᱟᱢᱟᱜ ᱵᱤᱵᱚᱨᱚᱬ ᱚᱞ ᱠᱟᱛᱮ ᱟᱞᱮᱭᱟᱜ ᱤᱢᱮᱞ ᱛᱮ ᱠᱩᱞ ᱢᱮ᱾',
      formSuccess: 'ᱤᱢᱮᱞ ᱮᱯ ᱡᱷᱤᱡ ᱮᱱᱟ! ᱟᱢ surakshaar.in@gmail.com ᱨᱮ ᱠᱩᱞ ᱫᱟᱲᱮᱭᱟᱜᱼᱟᱢ᱾',
      fieldName: 'ᱟᱢᱟᱜ ᱧᱩᱛᱩᱢ',
      fieldEmail: 'ᱟᱢᱟᱜ ᱤᱢᱮᱞ ᱴᱷᱤᱠᱬᱟ',
      fieldSubject: 'ᱥᱟᱛᱟᱢ (Subject)',
      fieldMessage: 'ᱢᱮᱥᱮᱡᱽ (Message)',
      placeholderName: 'ᱟᱢᱟᱜ ᱧᱩᱛᱩᱢ ᱚᱞ ᱢᱮ',
      placeholderEmail: 'you@gmail.com',
      placeholderSubject: 'ᱞᱮᱠᱟᱛᱮ: ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ ᱠᱩᱠᱞᱤ',
      placeholderMessage: 'ᱟᱞᱮ ᱪᱮᱫ ᱜᱚᱲᱚᱞᱮ ᱮᱢ ᱫᱟᱲᱮᱭᱟᱢᱟ?',
      btnSend: 'ᱤᱢᱮᱞ ᱛᱮ ᱢᱮᱥᱮᱡᱽ ᱠᱩᱞ ᱢᱮ',
      emergencyTitle: 'ᱡᱟᱹᱛᱤᱭᱟᱹᱨᱤ ᱟᱯᱟᱛᱠᱟᱞᱤᱱ ᱦᱮᱞᱯᱞᱟᱭᱤᱱ (ᱥᱤᱧᱚᱛ)',
      emergencySubtitle: 'ᱥᱟᱹᱨᱤ ᱠᱟᱹᱨᱜᱟᱲ ᱵᱚᱛᱚᱨ ᱚᱠᱛᱚ ᱨᱮ ᱞᱚᱜᱚᱱ ᱜᱚᱲᱚ ᱞᱟᱹᱠᱛᱤᱭᱟ᱾ ᱱᱚᱶᱟ ᱱᱚᱢᱵᱚᱨ ᱠᱚ ᱥᱟᱧᱪᱟᱣ ᱫᱚᱦᱚᱭ ᱢᱮ:',
      helplines: [
        { label: 'ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡ (Fire)', number: '101', icon: '🚒', color: '#DC2626' },
        { label: 'ᱮᱢᱵᱩᱞᱮᱱᱥ / ᱨᱟᱱ', number: '108', icon: '🚑', color: '#DC2626' },
        { label: 'ᱯᱩᱞᱤᱥ ᱟᱯᱟᱛᱠᱟᱞ', number: '100', icon: '🚓', color: '#1D4ED8' },
        { label: 'ᱡᱚᱛᱚ ᱟᱯᱟᱛᱠᱟᱞ (All)', number: '112', icon: '📞', color: '#DC2626' },
        { label: 'ᱟᱯᱚᱛ ᱥᱟᱢᱵᱽᱲᱟᱣ', number: '1078', icon: '🌊', color: '#D97706' },
        { label: 'ᱠᱮᱢᱤᱠᱟᱞ ᱟᱯᱟᱛᱠᱟᱞ', number: '1800-180-4104', icon: '☣️', color: '#7C3AED' },
      ],
    },
  }

  const t = content[lang] ?? content.en

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, paddingTop: 'calc(var(--navbar-height) + 32px)', paddingBottom: 64 }}>
        <div className="page-container" style={{ maxWidth: 940, margin: '0 auto', padding: '0 20px' }}>
          
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 14px',
                borderRadius: 'var(--radius-pill)',
                background: 'var(--color-brand-50)',
                border: '1px solid var(--color-brand-100)',
                color: 'var(--color-brand)',
                fontSize: '0.78rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                marginBottom: 16,
              }}
            >
              <Mail size={14} />
              <span>{t.badge}</span>
            </div>

            <h1
              style={{
                fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
                fontWeight: 800,
                color: 'var(--color-text-primary)',
                margin: '0 0 12px',
              }}
            >
              {t.title}
            </h1>
            <p
              style={{
                fontSize: 'clamp(0.95rem, 2vw, 1.05rem)',
                color: 'var(--color-text-secondary)',
                maxWidth: 600,
                margin: '0 auto',
                lineHeight: 1.6,
              }}
            >
              {t.subtitle}
            </p>
          </div>

          {/* 2-Column Responsive Layout */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 28,
              marginBottom: 40,
            }}
          >
            {/* Left Column: Official Contact Channels */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              
              {/* Email Card */}
              <div
                className="card"
                style={{
                  padding: 24,
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-surface)',
                  borderRadius: 'var(--radius-lg, 16px)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--color-brand-50)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--color-brand)',
                    }}
                  >
                    <Mail size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {t.emailCardTitle}
                    </div>
                    <a
                      href="mailto:surakshaar.in@gmail.com"
                      style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-brand)', textDecoration: 'none' }}
                    >
                      surakshaar.in@gmail.com
                    </a>
                  </div>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, margin: 0 }}>
                  {t.emailCardDesc}
                </p>
              </div>

              {/* Instagram Card */}
              <div
                className="card"
                style={{
                  padding: 24,
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-surface)',
                  borderRadius: 'var(--radius-lg, 16px)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 'var(--radius-md)',
                      background: '#FDF2F8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#DB2777',
                    }}
                  >
                    <Instagram size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {t.socialCardTitle}
                    </div>
                    <a
                      href="https://www.instagram.com/surakshaaar/"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: '1rem', fontWeight: 700, color: '#DB2777', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                    >
                      <span>@surakshaaar</span>
                      <ArrowUpRight size={14} />
                    </a>
                  </div>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, margin: 0 }}>
                  {t.socialCardDesc}
                </p>
              </div>

              {/* Support Hours Card */}
              <div
                className="card"
                style={{
                  padding: 24,
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-surface)',
                  borderRadius: 'var(--radius-lg, 16px)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--color-surface-alt)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    <Clock size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {t.hoursCardTitle}
                    </div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                      {t.hoursCardDays}
                    </div>
                  </div>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', margin: 0 }}>
                  {t.hoursCardReply}
                </p>
              </div>

            </div>

            {/* Right Column: Direct Inquiry Form */}
            <div
              className="card"
              style={{
                padding: 'clamp(20px, 3vw, 32px)',
                border: '1px solid var(--color-border)',
                background: 'var(--color-surface)',
                borderRadius: 'var(--radius-lg, 16px)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-text-primary)', margin: '0 0 8px' }}>
                {t.formTitle}
              </h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--color-text-muted)', margin: '0 0 20px', lineHeight: 1.5 }}>
                {t.formDesc}
              </p>

              {submitted && (
                <div
                  style={{
                    background: 'var(--color-success-bg, #E6F4EC)',
                    border: '1px solid var(--color-success-border, #A3D4B8)',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px 16px',
                    color: 'var(--color-success, #2E8B57)',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginBottom: 18,
                  }}
                >
                  <CheckCircle2 size={16} />
                  <span>{t.formSuccess}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label className="form-label" style={{ marginBottom: 6 }}>{t.fieldName}</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder={t.placeholderName}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="form-label" style={{ marginBottom: 6 }}>{t.fieldEmail}</label>
                  <input
                    type="email"
                    required
                    className="form-input"
                    placeholder={t.placeholderEmail}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div>
                  <label className="form-label" style={{ marginBottom: 6 }}>{t.fieldSubject}</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder={t.placeholderSubject}
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>

                <div>
                  <label className="form-label" style={{ marginBottom: 6 }}>{t.fieldMessage}</label>
                  <textarea
                    required
                    rows={4}
                    className="form-input"
                    placeholder={t.placeholderMessage}
                    style={{ resize: 'vertical' }}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-full"
                  style={{ padding: '12px 20px', marginTop: 4 }}
                >
                  <Send size={16} />
                  <span>{t.btnSend}</span>
                </button>
              </form>
            </div>

          </div>

          {/* National Industrial Emergency Helplines Reference */}
          <div
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg, 16px)',
              padding: 'clamp(20px, 3vw, 28px)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <Shield size={20} color="#DC2626" />
              <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, margin: 0, color: 'var(--color-text-primary)' }}>
                {t.emergencyTitle}
              </h3>
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', margin: '0 0 16px', lineHeight: 1.5 }}>
              {t.emergencySubtitle}
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
                gap: 12,
              }}
            >
              {t.helplines.map(({ label, number, icon, color }) => (
                <div
                  key={number}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md, 8px)',
                    background: 'var(--color-surface-alt)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>{icon}</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>{label}</span>
                  </div>
                  <a
                    href={`tel:${number.replace(/-/g, '')}`}
                    style={{ fontSize: '0.94rem', fontWeight: 800, color, textDecoration: 'none' }}
                  >
                    {number}
                  </a>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}
