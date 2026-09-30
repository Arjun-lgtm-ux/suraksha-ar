import React from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../../contexts/LanguageContext'
import { Shield, Mail, Instagram, ArrowUpRight } from 'lucide-react'

export function Footer() {
  const { lang } = useLang()

  const footerTexts = {
    en: {
      tagline: 'Immersive, interactive, and practical Augmented Reality safety training for high-risk industrial environments.',
      sihBadge: 'Smart India Hackathon 2026 · SIH26041',
      platform: 'Platform',
      connect: 'Connect',
      language: 'Language',
      about: 'Know About SurakshaAR',
      contact: 'Contact Us',
      privacy: 'Privacy Policy',
      terms: 'Terms & Conditions',
      copyright: 'Copyright Policy',
      safetyTips: 'Safety Tips',
      instagram: 'Instagram: @surakshaaar',
      rights: '© 2026 SurakshaAR. All Rights Reserved.',
      privacyShort: 'Privacy',
      termsShort: 'Terms',
      copyrightShort: 'Copyright',
      contactShort: 'Contact',
    },
    hi: {
      tagline: 'उच्च जोखिम वाले औद्योगिक वातावरण के लिए गहन, संवादात्मक और व्यावहारिक ऑगमेंटेड रियलिटी सुरक्षा प्रशिक्षण।',
      sihBadge: 'स्मार्ट इंडिया हैकाथॉन 2026 · SIH26041',
      platform: 'प्लेटफ़ॉर्म',
      connect: 'संपर्क सूत्र',
      language: 'भाषा',
      about: 'SurakshaAR के बारे में जानें',
      contact: 'संपर्क करें',
      privacy: 'गोपनीयता नीति',
      terms: 'नियम एवं शर्तें',
      copyright: 'कॉपीराइट नीति',
      safetyTips: 'सुरक्षा टिप्स',
      instagram: 'इंस्टाग्राम: @surakshaaar',
      rights: '© 2026 SurakshaAR. सर्वाधिकार सुरक्षित।',
      privacyShort: 'गोपनीयता',
      termsShort: 'शर्तें',
      copyrightShort: 'कॉपीराइट',
      contactShort: 'संपर्क',
    },
    sat: {
      tagline: 'ᱟᱹᱰᱤ ᱵᱚᱛᱚᱨᱟᱱ ᱠᱟᱹᱨᱜᱟᱲ ᱴᱷᱟᱶ ᱞᱟᱹᱜᱤᱫ ᱜᱟᱹᱦᱤᱨ ᱟᱨ ᱠᱟᱹᱢᱤᱭᱟᱱ ᱚᱜᱽᱢᱮᱱᱴᱮᱰ ᱨᱤᱭᱟᱞᱤᱴᱤ (AR) ᱥᱩᱨᱠᱷᱟ ᱥᱤᱠᱷᱟᱣ᱾',
      sihBadge: 'ᱥᱢᱟᱨᱴ ᱤᱱᱰᱤᱭᱟ ᱦᱮᱠᱟᱛᱷᱚᱱ ᱒᱐᱒᱖ · SIH26041',
      platform: 'ᱯᱞᱮᱴᱯᱷᱳᱨᱢ',
      connect: 'ᱡᱚᱯᱲᱟᱣ',
      language: 'ᱯᱟᱹᱨᱥᱤ',
      about: 'SurakshaAR ᱵᱟᱵᱚᱛ ᱵᱟᱰᱟᱭ ᱢᱮ',
      contact: 'ᱡᱚᱯᱲᱟᱣ ᱢᱮ',
      privacy: 'ᱫᱟᱱᱟᱝ ᱱᱤᱭᱟᱹᱢ (Privacy)',
      terms: 'ᱱᱤᱭᱟᱹᱢ ᱟᱨ ᱥᱚᱨᱛ (Terms)',
      copyright: 'ᱠᱚᱯᱤᱨᱟᱭᱤᱴ ᱱᱤᱭᱟᱹᱢ',
      safetyTips: 'ᱥᱩᱨᱠᱷᱟ ᱴᱤᱯᱥ',
      instagram: 'ᱤᱱᱥᱴᱟᱜᱨᱟᱢ: @surakshaaar',
      rights: '© ᱒᱐᱒᱖ SurakshaAR. ᱡᱚᱛᱚ ᱟᱹᱭᱫᱟᱹᱨᱤ ᱫᱚᱦᱚ ᱮᱱᱟ᱾',
      privacyShort: 'ᱫᱟᱱᱟᱝ',
      termsShort: 'ᱥᱚᱨᱛ',
      copyrightShort: 'ᱠᱚᱯᱤᱨᱟᱭᱤᱴ',
      contactShort: 'ᱡᱚᱯᱲᱟᱣ',
    },
  }

  const t = footerTexts[lang] ?? footerTexts.en

  return (
    <footer
      style={{
        background: 'var(--color-surface)',
        borderTop: '1px solid var(--color-border)',
        color: 'var(--color-text-secondary)',
        marginTop: 'auto',
        fontSize: 'var(--text-sm)',
        transition: 'background var(--transition-fast), border-color var(--transition-fast)',
      }}
    >
      <div
        className="page-container"
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '40px clamp(16px, 4vw, 32px) 28px',
          boxSizing: 'border-box',
        }}
      >
        {/* Main Footer Row */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 32,
            marginBottom: 32,
          }}
        >
          {/* Brand & Brief Description */}
          <div style={{ maxWidth: 360, minWidth: 260, flex: '1 1 280px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <img
                src={`${import.meta.env.BASE_URL}images/surakshaar-logo.png`}
                alt="SurakshaAR Logo"
                style={{ height: 32, width: 'auto', objectFit: 'contain' }}
                onError={(e) => { e.currentTarget.style.display = 'none' }}
              />
            </div>
            <p
              style={{
                fontSize: '0.86rem',
                lineHeight: 1.6,
                color: 'var(--color-text-muted)',
                margin: 0,
              }}
            >
              {t.tagline}
            </p>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                marginTop: 14,
                padding: '4px 10px',
                borderRadius: 'var(--radius-pill)',
                background: 'var(--color-surface-alt)',
                border: '1px solid var(--color-border)',
                fontSize: '0.74rem',
                fontWeight: 600,
                color: 'var(--color-text-secondary)',
              }}
            >
              <Shield size={12} color="var(--color-brand)" />
              <span>{t.sihBadge}</span>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div style={{ minWidth: 180, flex: '1 1 180px' }}>
            <h4
              style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: 14,
              }}
            >
              {t.platform}
            </h4>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <li>
                <Link
                  to="/about"
                  style={{
                    color: 'var(--color-text-secondary)',
                    textDecoration: 'none',
                    fontSize: '0.88rem',
                    transition: 'color var(--transition-fast)',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-brand)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-secondary)' }}
                >
                  {t.about}
                </Link>
              </li>
              <li>
                <Link
                  to="/safety-tips"
                  style={{
                    color: 'var(--color-text-secondary)',
                    textDecoration: 'none',
                    fontSize: '0.88rem',
                    transition: 'color var(--transition-fast)',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-brand)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-secondary)' }}
                >
                  {t.safetyTips}
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  style={{
                    color: 'var(--color-text-secondary)',
                    textDecoration: 'none',
                    fontSize: '0.88rem',
                    transition: 'color var(--transition-fast)',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-brand)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-secondary)' }}
                >
                  {t.contact}
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  style={{
                    color: 'var(--color-text-secondary)',
                    textDecoration: 'none',
                    fontSize: '0.88rem',
                    transition: 'color var(--transition-fast)',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-brand)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-secondary)' }}
                >
                  {t.privacy}
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  style={{
                    color: 'var(--color-text-secondary)',
                    textDecoration: 'none',
                    fontSize: '0.88rem',
                    transition: 'color var(--transition-fast)',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-brand)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-secondary)' }}
                >
                  {t.terms}
                </Link>
              </li>
              <li>
                <Link
                  to="/copyright"
                  style={{
                    color: 'var(--color-text-secondary)',
                    textDecoration: 'none',
                    fontSize: '0.88rem',
                    transition: 'color var(--transition-fast)',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-brand)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-secondary)' }}
                >
                  {t.copyright}
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div style={{ minWidth: 200, flex: '1 1 200px' }}>
            <h4
              style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: 14,
              }}
            >
              {t.connect}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* Instagram link */}
              <a
                href="https://www.instagram.com/surakshaaar/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  color: 'var(--color-text-secondary)',
                  textDecoration: 'none',
                  fontSize: '0.88rem',
                  transition: 'color var(--transition-fast)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-brand)' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-secondary)' }}
              >
                <Instagram size={16} color="var(--color-brand)" />
                <span>{t.instagram}</span>
                <ArrowUpRight size={13} style={{ opacity: 0.6 }} />
              </a>

              {/* Official Email */}
              <a
                href="mailto:surakshaar.in@gmail.com"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  color: 'var(--color-text-secondary)',
                  textDecoration: 'none',
                  fontSize: '0.88rem',
                  transition: 'color var(--transition-fast)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-brand)' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-secondary)' }}
              >
                <Mail size={16} color="var(--color-brand)" />
                <span>surakshaar.in@gmail.com</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Strip */}
        <div
          style={{
            borderTop: '1px solid var(--color-border)',
            paddingTop: 20,
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            fontSize: '0.78rem',
            color: 'var(--color-text-muted)',
          }}
        >
          <div>
            <Link
              to="/copyright"
              style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-brand)' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-muted)' }}
            >
              {t.rights}
            </Link>
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <Link to="/privacy" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>
              {t.privacyShort}
            </Link>
            <span>·</span>
            <Link to="/terms" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>
              {t.termsShort}
            </Link>
            <span>·</span>
            <Link to="/copyright" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>
              {t.copyrightShort}
            </Link>
            <span>·</span>
            <Link to="/safety-tips" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>
              {t.safetyTips}
            </Link>
            <span>·</span>
            <Link to="/contact" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>
              {t.contactShort}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
