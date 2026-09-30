import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { useLang } from '../contexts/LanguageContext'
import { MODULE_SAFETY_TIPS } from '../data/moduleSafetyTips'
import {
  ShieldCheck, Check, ChevronDown, ChevronUp, ArrowRight,
  Lightbulb, AlertTriangle, Play, Sparkles, Filter, ChevronRight, Clock,
} from 'lucide-react'

export default function SafetyTips() {
  const { lang } = useLang()
  const navigate = useNavigate()

  // Track expanded state for each module (default: all expanded for full overview)
  const [expanded, setExpanded] = useState(() => {
    const initial = {}
    MODULE_SAFETY_TIPS.forEach(m => { initial[m.id] = true })
    return initial
  })

  // Selected filter (all or specific hazard_type)
  const [selectedCategory, setSelectedCategory] = useState('all')

  function toggleModule(id) {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const allExpanded = MODULE_SAFETY_TIPS.every(m => expanded[m.id])

  function toggleAll() {
    if (allExpanded) {
      setExpanded({})
    } else {
      const all = {}
      MODULE_SAFETY_TIPS.forEach(m => { all[m.id] = true })
      setExpanded(all)
    }
  }

  // Filtered modules
  const filteredModules = selectedCategory === 'all'
    ? MODULE_SAFETY_TIPS
    : MODULE_SAFETY_TIPS.filter(m => m.hazard_type === selectedCategory)

  // Localized UI strings
  const strings = {
    en: {
      badge: 'Official Safety Knowledge Base',
      title: 'Module Safety Tips & Precautions',
      subtitle: 'Field-tested industrial safety guidelines and emergency responses for every training module on the SurakshaAR platform.',
      allModules: 'All Modules',
      collapseAll: 'Collapse All',
      expandAll: 'Expand All',
      tipsCount: '{0} Critical Tips',
      startAR: 'Start AR Simulation',
      comingSoon: 'Coming Soon',
      ppeNotice: 'Always verify PPE and situational hazards before training',
      emergencyNoticeTitle: 'Workplace Safety Reminder',
      emergencyNoticeBody: 'These safety tips provide critical operational baselines. In live emergencies, always follow your plant’s official SOP, supervisor command, and emergency evacuation signals.',
      viewDashboard: 'Back to Dashboard',
    },
    hi: {
      badge: 'आधिकारिक सुरक्षा ज्ञान केंद्र',
      title: 'मॉड्यूल अनुसार सुरक्षा टिप्स और सावधानियां',
      subtitle: 'SurakshaAR प्लेटफॉर्म के प्रत्येक प्रशिक्षण मॉड्यूल के लिए कार्यस्थल सुरक्षा दिशानिर्देश और आपातकालीन सावधानियां।',
      allModules: 'सभी मॉड्यूल',
      collapseAll: 'सभी समेटें',
      expandAll: 'सभी खोलें',
      tipsCount: '{0} महत्वपूर्ण टिप्स',
      startAR: 'AR सिमुलेशन शुरू करें',
      comingSoon: 'जल्द आ रहा है',
      ppeNotice: 'प्रशिक्षण से पहले हमेशा पीपीई और कार्यस्थल के खतरों की जांच करें',
      emergencyNoticeTitle: 'कार्यस्थल सुरक्षा अनुस्मारक',
      emergencyNoticeBody: 'ये सुरक्षा टिप्स बुनियादी जानकारी प्रदान करते हैं। वास्तविक आपात स्थिति में हमेशा अपने कारखाने की मानक संचालन प्रक्रिया (SOP) और सायरन का पालन करें।',
      viewDashboard: 'डैशबोर्ड पर वापस जाएं',
    },
    sat: {
      badge: 'ᱚᱯᱷᱤᱥᱤᱭᱟᱞ ᱥᱩᱨᱠᱷᱟ ᱜᱮᱭᱟᱱ ᱛᱟᱞᱢᱟ',
      title: 'ᱢᱳᱰᱩᱞ ᱞᱮᱠᱟᱛᱮ ᱥᱩᱨᱠᱷᱟ ᱴᱤᱯᱥ ᱟᱨ ᱦᱳᱸᱥᱤᱭᱟᱨᱤ',
      subtitle: 'SurakshaAR ᱨᱮᱱᱟᱜ ᱡᱚᱛᱚ ᱥᱤᱠᱷᱟᱣ ᱢᱳᱰᱩᱞ ᱞᱟᱹᱜᱤᱫ ᱠᱟᱹᱢᱤ ᱴᱷᱟᱶ ᱥᱩᱨᱠᱷᱟ ᱱᱤᱭᱟᱹᱢ ᱟᱨ ᱟᱯᱟᱛᱠᱟᱞᱤᱱ ᱥᱟᱵᱽᱫᱷᱟᱱᱤ᱾',
      allModules: 'ᱡᱚᱛᱚ ᱢᱳᱰᱩᱞ',
      collapseAll: 'ᱡᱚᱛᱚ ᱜᱩᱴᱟᱹᱭ ᱢᱮ',
      expandAll: 'ᱡᱚᱛᱚ ᱡᱷᱤᱡᱽ ᱢᱮ',
      tipsCount: '{0} ᱜᱚᱴᱟᱝ ᱞᱟᱹᱠᱛᱤᱭᱟᱱ ᱴᱤᱯᱥ',
      startAR: 'AR ᱥᱤᱠᱷᱟᱣ ᱮᱦᱚᱵ ᱢᱮ',
      comingSoon: 'ᱞᱚᱜᱚᱱ ᱦᱤᱡᱩᱜ ᱠᱟᱱᱟ',
      ppeNotice: 'ᱥᱤᱠᱷᱱᱟᱹᱛ ᱞᱟᱦᱟ ᱡᱟᱣᱜᱮ PPE ᱟᱨ ᱵᱚᱛᱚᱨ ᱯᱟᱨᱠᱷᱟᱣ ᱢᱮ',
      emergencyNoticeTitle: 'ᱠᱟᱹᱢᱤ ᱴᱷᱟᱶ ᱥᱩᱨᱠᱷᱟ ᱩᱭᱦᱟᱹᱨ',
      emergencyNoticeBody: 'ᱱᱚᱶᱟ ᱥᱩᱨᱠᱷᱟ ᱴᱤᱯᱥ ᱫᱚ ᱵᱩᱱᱤᱭᱟᱹᱫᱽ ᱜᱮᱭᱟᱱ ᱞᱟᱹᱜᱤᱫ ᱠᱟᱱᱟ᱾ ᱥᱟᱹᱨᱤ ᱟᱯᱟᱛᱠᱟᱞᱤᱱ ᱚᱠᱛᱚ ᱨᱮ ᱠᱟᱹᱨᱜᱟᱲ ᱨᱮᱱᱟᱜ ᱚᱯᱷᱤᱥᱤᱭᱟᱞ SOP ᱟᱨ ᱥᱟᱭᱨᱮᱱ ᱯᱟᱸᱡᱟᱭ ᱢᱮ᱾',
      viewDashboard: 'ᱰᱮᱥᱵᱳᱨᱰ ᱛᱮ ᱨᱩᱣᱟᱹᱲ',
    },
  }

  const t = strings[lang] ?? strings.en

  function getModTitle(mod) {
    if (lang === 'hi') return mod.title_hi || mod.title
    if (lang === 'sat') return mod.title_sat || mod.title
    return mod.title
  }

  function getModBadge(mod) {
    if (lang === 'hi') return mod.badge_hi || mod.badge
    if (lang === 'sat') return mod.badge_sat || mod.badge
    return mod.badge
  }

  function getModTips(mod) {
    if (lang === 'hi' && mod.tips_hi) return mod.tips_hi
    if (lang === 'sat' && mod.tips_sat) return mod.tips_sat
    return mod.tips
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, paddingTop: 'calc(var(--navbar-height) + 28px)', paddingBottom: 64 }}>
        <div className="page-container" style={{ maxWidth: 940, margin: '0 auto', padding: '0 20px' }}>
          
          {/* Breadcrumb Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: 20 }}>
            <span
              onClick={() => navigate('/dashboard')}
              style={{ cursor: 'pointer', color: 'var(--color-brand)', fontWeight: 600 }}
            >
              {t.viewDashboard}
            </span>
            <ChevronRight size={14} />
            <span style={{ color: 'var(--color-text-secondary)', fontWeight: 600 }}>
              {t.title}
            </span>
          </div>

          {/* Hero Header */}
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 16px',
                borderRadius: 'var(--radius-pill)',
                background: 'var(--color-brand-50, #FFF3EB)',
                border: '1.5px solid var(--color-brand-100, #FFE6D5)',
                color: 'var(--color-brand)',
                fontSize: '0.78rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                marginBottom: 16,
              }}
            >
              <ShieldCheck size={16} />
              <span>{t.badge}</span>
            </div>

            <h1
              style={{
                fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
                fontWeight: 800,
                color: 'var(--color-text-primary)',
                lineHeight: 1.25,
                margin: '0 0 12px',
              }}
            >
              {t.title}
            </h1>

            <p
              style={{
                fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.6,
                maxWidth: 700,
                margin: '0 auto',
              }}
            >
              {t.subtitle}
            </p>
          </div>

          {/* Controls Bar: Category Filters & Expand/Collapse Toggle */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              marginBottom: 24,
              padding: '12px 16px',
              background: 'var(--color-surface)',
              borderRadius: 'var(--radius-lg, 14px)',
              border: '1px solid var(--color-border)',
            }}
          >
            {/* Filter Pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginRight: 4, color: 'var(--color-text-muted)', fontSize: '0.76rem', fontWeight: 700, textTransform: 'uppercase' }}>
                <Filter size={13} />
                <span>Filter:</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                style={{
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-pill)',
                  border: '1px solid',
                  borderColor: selectedCategory === 'all' ? 'var(--color-brand)' : 'var(--color-border)',
                  background: selectedCategory === 'all' ? 'var(--color-brand)' : 'var(--color-surface-alt)',
                  color: selectedCategory === 'all' ? '#FFFFFF' : 'var(--color-text-secondary)',
                  fontSize: '0.78rem',
                  fontWeight: selectedCategory === 'all' ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {t.allModules} ({MODULE_SAFETY_TIPS.length})
              </button>

              {MODULE_SAFETY_TIPS.map(m => {
                const isSelected = selectedCategory === m.hazard_type
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedCategory(isSelected ? 'all' : m.hazard_type)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 'var(--radius-pill)',
                      border: '1px solid',
                      borderColor: isSelected ? m.color : 'var(--color-border)',
                      background: isSelected ? m.bgColor : 'var(--color-surface-alt)',
                      color: isSelected ? m.color : 'var(--color-text-secondary)',
                      fontSize: '0.78rem',
                      fontWeight: isSelected ? 700 : 500,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span>{m.icon}</span>
                    <span>{getModBadge(m)}</span>
                  </button>
                )
              })}
            </div>

            {/* Expand / Collapse All */}
            <button
              type="button"
              onClick={toggleAll}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--color-brand)',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 10px',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              <span>{allExpanded ? t.collapseAll : t.expandAll}</span>
              {allExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>

          {/* Module Tip Cards Stack */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 40 }}>
            {filteredModules.map((mod, index) => {
              const isOpen = !!expanded[mod.id]
              const tips = getModTips(mod)
              const modTitle = getModTitle(mod)
              const modBadge = getModBadge(mod)

              return (
                <div
                  key={mod.id}
                  className="card"
                  style={{
                    background: 'var(--color-surface)',
                    border: '1.5px solid var(--color-border)',
                    borderRadius: 'var(--radius-lg, 16px)',
                    overflow: 'hidden',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                  }}
                >
                  {/* Card Header & Accordion Trigger */}
                  <div
                    onClick={() => toggleModule(mod.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleModule(mod.id) }}
                    style={{
                      padding: '18px 22px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 16,
                      cursor: 'pointer',
                      background: isOpen ? 'var(--color-surface-alt)' : 'transparent',
                      borderBottom: isOpen ? '1px solid var(--color-border)' : 'none',
                      userSelect: 'none',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 'var(--radius-md, 10px)',
                          background: mod.bgColor,
                          color: mod.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.35rem',
                          flexShrink: 0,
                          border: `1px solid ${mod.color}30`,
                        }}
                      >
                        {mod.icon}
                      </div>

                      <div style={{ minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                          <span
                            style={{
                              fontSize: '0.68rem',
                              fontWeight: 800,
                              textTransform: 'uppercase',
                              padding: '2px 8px',
                              borderRadius: 4,
                              background: mod.bgColor,
                              color: mod.color,
                              border: `1px solid ${mod.color}40`,
                              letterSpacing: '0.04em',
                            }}
                          >
                            {modBadge}
                          </span>
                          <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                            {t.tipsCount.replace('{0}', tips.length)}
                          </span>
                        </div>
                        <h2
                          style={{
                            fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
                            fontWeight: 700,
                            color: 'var(--color-text-primary)',
                            margin: 0,
                          }}
                        >
                          {modTitle}
                        </h2>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          background: 'var(--color-surface)',
                          border: '1px solid var(--color-border)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--color-text-muted)',
                        }}
                      >
                        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </div>
                    </div>
                  </div>

                  {/* Expandable Tips Body */}
                  {isOpen && (
                    <div style={{ padding: '22px 24px', background: 'var(--color-surface)' }}>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                          gap: 14,
                          marginBottom: 20,
                        }}
                      >
                        {tips.map((tip, tIdx) => (
                          <div
                            key={tIdx}
                            style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: 12,
                              padding: '12px 14px',
                              borderRadius: 'var(--radius-md, 10px)',
                              background: 'var(--color-surface-alt)',
                              border: '1px solid var(--color-border)',
                            }}
                          >
                            <div
                              style={{
                                width: 22,
                                height: 22,
                                borderRadius: '50%',
                                background: 'var(--color-success-bg, #E6F4EC)',
                                color: 'var(--color-success, #2E8B57)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                                marginTop: 1,
                              }}
                            >
                              <Check size={13} strokeWidth={3} />
                            </div>
                            <span
                              style={{
                                fontSize: '0.86rem',
                                color: 'var(--color-text-secondary)',
                                lineHeight: 1.55,
                              }}
                            >
                              {tip}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Card Footer: Direct Link to Drill in AR */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          paddingTop: 16,
                          borderTop: '1px solid var(--color-border)',
                          flexWrap: 'wrap',
                          gap: 12,
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                          <Lightbulb size={14} color="var(--color-brand)" />
                          <span>{t.ppeNotice}</span>
                        </div>

                        {mod.coming_soon ? (
                          <div
                            style={{
                              padding: '8px 16px',
                              fontSize: '0.84rem',
                              fontWeight: 700,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 6,
                              borderRadius: 'var(--radius-md, 8px)',
                              background: 'var(--color-surface-alt)',
                              color: 'var(--color-text-muted)',
                              border: '1px solid var(--color-border)',
                              cursor: 'not-allowed',
                            }}
                          >
                            <Clock size={14} />
                            <span>{t.comingSoon}</span>
                          </div>
                        ) : (
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => navigate(`/scenario/${mod.id}`)}
                            style={{
                              padding: '8px 16px',
                              fontSize: '0.84rem',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 8,
                            }}
                          >
                            <Play size={14} />
                            <span>{t.startAR}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Important Workplace Safety Reminder Box */}
          <div
            style={{
              background: 'linear-gradient(135deg, var(--color-brand-50, #FFF3EB), var(--color-surface, #FFFFFF))',
              border: '1.5px solid var(--color-brand-100, #FFE6D5)',
              borderRadius: 'var(--radius-xl, 18px)',
              padding: 'clamp(20px, 3vw, 28px)',
              display: 'flex',
              gap: 18,
              alignItems: 'flex-start',
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 'var(--radius-md)',
                background: 'var(--color-brand)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                flexShrink: 0,
                marginTop: 2,
              }}
            >
              <AlertTriangle size={22} />
            </div>

            <div style={{ flex: 1 }}>
              <h3
                style={{
                  fontSize: 'var(--text-md)',
                  fontWeight: 800,
                  color: 'var(--color-brand-dark, #B84800)',
                  margin: '0 0 6px',
                }}
              >
                {t.emergencyNoticeTitle}
              </h3>
              <p
                style={{
                  fontSize: '0.88rem',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.6,
                  margin: '0 0 16px',
                }}
              >
                {t.emergencyNoticeBody}
              </p>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => navigate('/dashboard')}
                style={{ padding: '8px 16px', fontSize: '0.84rem' }}
              >
                {t.viewDashboard}
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}
