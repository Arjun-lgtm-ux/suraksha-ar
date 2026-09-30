import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { useLang } from '../contexts/LanguageContext'
import { Shield, Eye, Flame, Award, Globe, ArrowRight } from 'lucide-react'

export default function About() {
  const navigate = useNavigate()
  const { lang } = useLang()

  const content = {
    en: {
      badge: 'Smart India Hackathon 2026 · Problem Statement SIH26041',
      titlePrefix: 'Know About Suraksha',
      titleSuffix: 'AR',
      coreDefinition: 'SurakshaAR is an AR-based industrial safety training platform designed to provide immersive, interactive, and practical safety learning experiences.',
      missionTitle: 'The Mission',
      missionP1: 'Traditional industrial safety training often relies on passive classroom lectures and static manuals, leaving workers underprepared for fast-moving hazards. SurakshaAR bridges this gap by transforming ordinary mobile devices into high-fidelity augmented reality drill simulators.',
      missionP2: 'Workers practice hazard detection, emergency equipment operation, and evacuation decision-making safely in digital space before facing real-world risks on factory floors, mining sites, and chemical plants.',
      pillars: [
        {
          icon: <Eye size={22} color="var(--color-brand)" />,
          title: 'Immersive AR Hazard Simulation',
          desc: 'Overlay true-scale 3D fire hazards, gas dispersion zones, and rotating machinery onto real surroundings using WebXR and camera-tracking technology.',
        },
        {
          icon: <Flame size={22} color="#DC2626" />,
          title: 'Practical Emergency Drills',
          desc: 'Hands-on practice with firefighting equipment (PASS method), breathing apparatus (SCBA), and Lockout/Tagout (LOTO) protocols with realistic time constraints.',
        },
        {
          icon: <Globe size={22} color="#059669" />,
          title: 'Vernacular Workforce Inclusion',
          desc: 'Fully accessible multilingual interface supporting English, Hindi, and Santali (Ol Chiki ᱥᱟᱱᱛᱟᱲᱤ) with voice audio guidance for frontline shop-floor workers.',
        },
        {
          icon: <Award size={22} color="#D97706" />,
          title: 'Verified Digital Credentials',
          desc: 'Automated post-drill assessments generate tamper-proof digital completion certificates with verifiable scores and QR authentication.',
        },
      ],
      ctaTitle: 'Experience Next-Generation Safety Training',
      ctaSubtitle: 'Explore interactive modules, test your emergency response speed, and build life-saving reflexes in Augmented Reality.',
      btnDashboard: 'Go to Training Dashboard',
      btnContact: 'Contact Us',
    },
    hi: {
      badge: 'स्मार्ट इंडिया हैकाथॉन 2026 · समस्या विवरण SIH26041',
      titlePrefix: 'SurakshaAR के बारे में जानें',
      titleSuffix: '',
      coreDefinition: 'SurakshaAR एक AR-आधारित औद्योगिक सुरक्षा प्रशिक्षण प्लेटफॉर्म है जिसे गहन, इंटरैक्टिव और व्यावहारिक सुरक्षा सीखने का अनुभव प्रदान करने के लिए डिज़ाइन किया गया है।',
      missionTitle: 'हमारा उद्देश्य',
      missionP1: 'पारंपरिक औद्योगिक सुरक्षा प्रशिक्षण अक्सर केवल कक्षा व्याख्यानों और किताबों तक सीमित रहता है, जिससे वास्तविक संकट के समय श्रमिक पूरी तरह तैयार नहीं हो पाते। SurakshaAR साधारण मोबाइल कैमरों को उच्च-स्तरीय ऑगमेंटेड रियलिटी ड्रिल सिमुलेटर में बदलकर इस कमी को पूरा करता है।',
      missionP2: 'श्रमिक फैक्ट्री, खनन और रासायनिक संयंत्रों में वास्तविक जोखिमों का सामना करने से पहले डिजिटल माध्यम में खतरे की पहचान, आपातकालीन उपकरणों का संचालन और सुरक्षित निकास का अभ्यास करते हैं।',
      pillars: [
        {
          icon: <Eye size={22} color="var(--color-brand)" />,
          title: 'वास्तविक AR खतरा सिमुलेशन',
          desc: 'WebXR और कैमरा ट्रैकिंग तकनीक का उपयोग करके अपने वास्तविक परिवेश में 3D आग, जहरीली गैस और मशीनरी के खतरों का सटीक अनुभव लें।',
        },
        {
          icon: <Flame size={22} color="#DC2626" />,
          title: 'व्यावहारिक आपातकालीन अभ्यास',
          desc: 'अग्निशामक यंत्र (PASS विधि), श्वास उपकरण (SCBA) और मशीन्री सुरक्षा (LOTO) का वास्तविक समय सीमा में हाथों-हाथ अभ्यास करें।',
        },
        {
          icon: <Globe size={22} color="#059669" />,
          title: 'मातृभाषा में समावेशी इंटरफ़ेस',
          desc: 'जमीनी स्तर के औद्योगिक श्रमिकों के लिए अंग्रेजी, हिंदी और संताली (Ol Chiki ᱥᱟᱱᱛᱟᱲᱤ) में पूर्ण भाषाई समर्थन और ऑडियो मार्गदर्शन।',
        },
        {
          icon: <Award size={22} color="#D97706" />,
          title: 'सत्यापित डिजिटल प्रमाणपत्र',
          desc: 'अभ्यास पूर्ण होने पर स्वचालित सुरक्षा मूल्यांकन और QR कोड से सत्यापित डिजिटल प्रशिक्षण प्रमाणपत्र जारी किए जाते हैं।',
        },
      ],
      ctaTitle: 'आधुनिक सुरक्षा प्रशिक्षण का अनुभव करें',
      ctaSubtitle: 'इंटरैक्टिव मॉड्यूल देखें, आपातकालीन प्रतिक्रिया गति का परीक्षण करें और AR में जीवन रक्षक कौशल सीखें।',
      btnDashboard: 'प्रशिक्षण डैशबोर्ड पर जाएं',
      btnContact: 'संपर्क करें',
    },
    sat: {
      badge: 'ᱥᱢᱟᱨᱴ ᱤᱱᱰᱤᱭᱟ ᱦᱮᱠᱟᱛᱷᱚᱱ ᱒᱐᱒᱖ · ᱠᱟᱹᱢᱤ ᱞᱟᱹᱠᱛᱤ SIH26041',
      titlePrefix: 'SurakshaAR ᱵᱟᱵᱚᱛ ᱵᱟᱰᱟᱭ ᱢᱮ',
      titleSuffix: '',
      coreDefinition: 'SurakshaAR ᱫᱚ ᱢᱤᱫ AR-ᱵᱩᱱᱤᱭᱟᱹᱫᱽ ᱠᱟᱹᱨᱜᱟᱲ ᱥᱩᱨᱠᱷᱟ ᱥᱤᱠᱷᱟᱣ ᱯᱞᱮᱴᱯᱷᱳᱨᱢ ᱠᱟᱱᱟ, ᱡᱟᱦᱟᱸ ᱫᱚ ᱜᱟᱹᱦᱤᱨ ᱟᱨ ᱠᱟᱹᱢᱤᱭᱟᱱ ᱥᱮᱪᱮᱫ ᱮᱢᱚᱜ ᱞᱟᱹᱜᱤᱫ ᱵᱮᱱᱟᱣ ᱟᱠᱟᱱᱟ᱾',
      missionTitle: 'ᱟᱞᱮᱭᱟᱜ ᱡᱚᱥ',
      missionP1: 'ᱥᱮᱫᱟᱭ ᱠᱷᱚᱱ ᱠᱟᱹᱨᱜᱟᱲ ᱥᱩᱨᱠᱷᱟ ᱥᱤᱠᱷᱟᱣ ᱠᱷᱟᱹᱞᱤ ᱠᱞᱟᱥᱨᱩᱢ ᱯᱚᱛᱚᱵ ᱨᱮᱜᱮ ᱛᱟᱦᱮᱸᱱ ᱠᱟᱱ ᱛᱟᱦᱮᱸᱫ, ᱡᱟᱦᱟᱸ ᱛᱮ ᱠᱟᱹᱢᱤᱭᱟᱹ ᱠᱚ ᱥᱟᱹᱨᱤ ᱵᱚᱛᱚᱨ ᱚᱠᱛᱚ ᱨᱮ ᱴᱷᱤᱠ ᱵᱟᱝ ᱠᱚ ᱠᱟᱹᱢᱤ ᱫᱟᱲᱮᱭᱟᱜ ᱠᱟᱱ ᱛᱟᱦᱮᱸᱫ᱾ SurakshaAR ᱫᱚ ᱢᱳᱵᱟᱭᱤᱞ ᱠᱮᱢᱮᱨᱟ ᱛᱮ AR ᱥᱤᱠᱷᱟᱣ ᱮᱢ ᱠᱟᱛᱮ ᱱᱚᱶᱟ ᱮᱴᱠᱮᱴᱚᱬᱮ ᱥᱟᱦᱟᱭᱟ᱾',
      missionP2: 'ᱠᱟᱹᱢᱤᱭᱟᱹ ᱠᱚ ᱠᱟᱹᱨᱜᱟᱲ, ᱠᱷᱟᱫᱟᱱ ᱟᱨ ᱠᱮᱢᱤᱠᱟᱞ ᱯᱞᱟᱱᱴ ᱨᱮ ᱥᱟᱹᱨᱤ ᱵᱚᱛᱚᱨ ᱥᱟᱢᱟᱝ ᱞᱟᱦᱟ ᱰᱤᱡᱤᱴᱟᱞ ᱛᱮ ᱥᱩᱨᱠᱷᱟ ᱠᱟᱹᱢᱤ, ᱥᱟᱢᱟᱱ ᱵᱮᱵᱷᱟᱨ ᱟᱨ ᱵᱟᱦᱨᱮ ᱚᱰᱚᱠᱚᱜ ᱪᱮᱫᱚᱜ ᱠᱟᱱᱟ ᱠᱚ᱾',
      pillars: [
        {
          icon: <Eye size={22} color="var(--color-brand)" />,
          title: 'ᱥᱟᱹᱨᱤ AR ᱵᱚᱛᱚᱨ ᱥᱤᱢᱩᱞᱮᱥᱚᱱ',
          desc: 'WebXR ᱟᱨ ᱠᱮᱢᱮᱨᱟ ᱛᱮ ᱟᱰᱮᱯᱟᱥᱮ ᱨᱮ ᱥᱟᱹᱨᱤ 3D ᱥᱮᱸᱜᱮᱞ, ᱜᱮᱥ ᱞᱤᱠ ᱟᱨ ᱢᱮᱥᱤᱱ ᱵᱚᱛᱚᱨ ᱴᱷᱟᱶ ᱧᱮᱞ ᱢᱮ᱾',
        },
        {
          icon: <Flame size={22} color="#DC2626" />,
          title: 'ᱠᱟᱹᱢᱤᱭᱟᱱ ᱟᱯᱟᱛᱠᱟᱞᱤᱱ ᱥᱤᱠᱷᱟᱣ',
          desc: 'ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡᱤᱡ (PASS method), ᱥᱟᱦᱮᱫ ᱥᱟᱢᱟᱱ (SCBA) ᱟᱨ ᱢᱮᱥᱤᱱ ᱞᱚᱠ (LOTO) ᱴᱷᱤᱠ ᱚᱠᱛᱚ ᱨᱮ ᱠᱟᱹᱢᱤ ᱪᱮᱫᱚᱜ ᱢᱮ᱾',
        },
        {
          icon: <Globe size={22} color="#059669" />,
          title: 'ᱟᱯᱱᱟᱨ ᱯᱟᱹᱨᱥᱤ ᱛᱮ ᱥᱤᱠᱷᱟᱣ',
          desc: 'ᱠᱟᱹᱢᱤᱭᱟᱹ ᱠᱚ ᱞᱟᱹᱜᱤᱫ ᱤᱝᱨᱮᱡᱤ, ᱦᱤᱱᱫᱤ ᱟᱨ ᱥᱟᱱᱛᱟᱲᱤ (Ol Chiki ᱥᱟᱱᱛᱟᱲᱤ) ᱯᱟᱹᱨᱥᱤ ᱟᱨ ᱟᱲᱟᱝ ᱜᱚᱲᱚ ᱥᱟᱶ᱾',
        },
        {
          icon: <Award size={22} color="#D97706" />,
          title: 'ᱯᱟᱨᱠᱷᱟᱣ ᱟᱠᱟᱱ ᱰᱤᱡᱤᱴᱟᱞ ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ',
          desc: 'ᱥᱤᱠᱷᱟᱣ ᱯᱩᱨᱟᱹᱣ ᱠᱟᱛᱮ QR ᱠᱳᱰ ᱟᱨ ᱥᱠᱳᱨ ᱥᱟᱶ ᱥᱟᱹᱨᱤ ᱰᱤᱡᱤᱴᱟᱞ ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ ᱦᱟᱢᱮᱴ ᱢᱮ᱾',
        },
      ],
      ctaTitle: 'ᱱᱟᱦᱟᱜ ᱥᱩᱨᱠᱷᱟ ᱥᱤᱠᱷᱟᱣ ᱟᱹᱭᱠᱟᱹᱣ ᱢᱮ',
      ctaSubtitle: 'ᱥᱤᱠᱷᱟᱣ ᱢᱳᱰᱩᱞ ᱠᱚ ᱧᱮᱞ ᱢᱮ, ᱟᱯᱟᱛᱠᱟᱞᱤᱱ ᱠᱟᱹᱢᱤ ᱯᱟᱨᱠᱷᱟᱣ ᱢᱮ ᱟᱨ AR ᱛᱮ ᱡᱤᱣᱤ ᱵᱟᱧᱪᱟᱣ ᱦᱩᱱᱟᱹᱨ ᱪᱮᱫᱚᱜ ᱢᱮ᱾',
      btnDashboard: 'ᱥᱤᱠᱷᱟᱣ ᱰᱮᱥᱵᱳᱨᱰ ᱛᱮ ᱪᱟᱞᱟᱜ ᱢᱮ',
      btnContact: 'ᱡᱚᱯᱲᱟᱣ ᱢᱮ',
    },
  }

  const t = content[lang] ?? content.en

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, paddingTop: 'calc(var(--navbar-height) + 32px)', paddingBottom: 64 }}>
        <div className="page-container" style={{ maxWidth: 840, margin: '0 auto', padding: '0 20px' }}>
          
          {/* Header Badge & Title */}
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
              <Shield size={14} />
              <span>{t.badge}</span>
            </div>

            <h1
              style={{
                fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
                fontWeight: 800,
                color: 'var(--color-text-primary)',
                lineHeight: 1.25,
                margin: '0 0 16px',
              }}
            >
              {t.titlePrefix}
              {t.titleSuffix && <span style={{ color: 'var(--color-brand)' }}>{t.titleSuffix}</span>}
            </h1>

            {/* Core Definition */}
            <p
              style={{
                fontSize: 'clamp(1.05rem, 2vw, 1.2rem)',
                fontWeight: 500,
                color: 'var(--color-text-secondary)',
                lineHeight: 1.6,
                maxWidth: 720,
                margin: '0 auto',
              }}
            >
              {t.coreDefinition}
            </p>
          </div>

          {/* Overview Card */}
          <div
            className="card"
            style={{
              padding: 'clamp(20px, 3vw, 32px)',
              marginBottom: 32,
              border: '1px solid var(--color-border)',
              background: 'var(--color-surface)',
              borderRadius: 'var(--radius-lg, 16px)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <h2
              style={{
                fontSize: 'var(--text-lg)',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                marginBottom: 12,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <Eye size={20} color="var(--color-brand)" />
              {t.missionTitle}
            </h2>
            <p style={{ fontSize: '0.94rem', color: 'var(--color-text-secondary)', lineHeight: 1.7, margin: '0 0 16px' }}>
              {t.missionP1}
            </p>
            <p style={{ fontSize: '0.94rem', color: 'var(--color-text-secondary)', lineHeight: 1.7, margin: 0 }}>
              {t.missionP2}
            </p>
          </div>

          {/* Core Pillars Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 20,
              marginBottom: 36,
            }}
          >
            {t.pillars.map((p, idx) => (
              <div
                key={idx}
                className="card"
                style={{
                  padding: 24,
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-surface)',
                  borderRadius: 'var(--radius-lg, 14px)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--color-surface-alt)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 4,
                  }}
                >
                  {p.icon}
                </div>
                <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, margin: 0, color: 'var(--color-text-primary)' }}>
                  {p.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.6, margin: 0 }}>
                  {p.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Quick Call to Action */}
          <div
            style={{
              background: 'linear-gradient(135deg, var(--color-brand-50, #FFF3EB), var(--color-surface, #FFFFFF))',
              border: '1.5px solid var(--color-brand-100, #FFE6D5)',
              borderRadius: 'var(--radius-xl, 20px)',
              padding: 'clamp(24px, 4vw, 36px)',
              textAlign: 'center',
            }}
          >
            <h3 style={{ fontSize: 'clamp(1.2rem, 3vw, 1.45rem)', fontWeight: 800, color: 'var(--color-text-primary)', margin: '0 0 10px' }}>
              {t.ctaTitle}
            </h3>
            <p style={{ fontSize: '0.92rem', color: 'var(--color-text-secondary)', maxWidth: 540, margin: '0 auto 24px', lineHeight: 1.6 }}>
              {t.ctaSubtitle}
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                className="btn btn-primary"
                onClick={() => navigate('/dashboard')}
                style={{ padding: '12px 28px', fontSize: '0.95rem' }}
              >
                <span>{t.btnDashboard}</span>
                <ArrowRight size={16} />
              </button>
              <button
                className="btn btn-ghost"
                onClick={() => navigate('/contact')}
                style={{ padding: '12px 24px', fontSize: '0.95rem' }}
              >
                {t.btnContact}
              </button>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}
