import React from 'react'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { useLang } from '../contexts/LanguageContext'
import { Copyright as CopyrightIcon, ShieldCheck, Mail } from 'lucide-react'

export default function Copyright() {
  const { lang } = useLang()

  const content = {
    en: {
      badge: 'Legal Notice',
      title: 'Copyright & Intellectual Property Notice',
      rightsLine: '© 2026 SurakshaAR. All Rights Reserved.',
      highlightTitle: 'All Rights Reserved © 2026 SurakshaAR',
      highlightDesc: 'Developed for Smart India Hackathon 2026 (Problem Statement SIH26041). All software code, 3D simulations, AR experiences, audio synthesizers, and assessment materials are legally protected.',
      sections: [
        {
          num: '1',
          title: 'Proprietary Assets & Ownership',
          intro: 'All materials contained within the SurakshaAR application and website are the proprietary property of the SurakshaAR team and project contributors, including but not limited to:',
          list: [
            'Custom Three.js 3D models (fire extinguishers, machinery nip-point rollers, gas detection pipelines, emergency panels).',
            'Augmented reality WebXR hit-test tracking routines and surface placement systems.',
            'Procedural Web Audio sound effects (CO₂ discharge plumes, industrial alarms, combustion sounds).',
            'Scenario training step sequences, PASS firefighting animations, and decision-tree logic.',
            'Graphic design, brand typography, badges, color palettes, and the official SurakshaAR logo.',
            'Curated safety question banks and localized translations (English, Hindi, Santali ᱥᱟᱱᱛᱟᱲᱤ).',
          ],
        },
        {
          num: '2',
          title: 'Permitted Use',
          intro: 'Individual trainees, students, safety officers, and authorized industrial plant personnel are granted a non-exclusive, non-transferable, revocable license to access SurakshaAR solely for educational learning, emergency drill practice, and certification testing.',
        },
        {
          num: '3',
          title: 'Prohibited Activities',
          intro: 'Except as explicitly permitted by the project creators, you may not:',
          list: [
            'Copy, distribute, duplicate, republish, or sub-license any portion of the 3D models or AR training code.',
            'Extract, decompile, reverse-engineer, or disassemble the application binaries or assets.',
            'Commercialize, sell, or repackage SurakshaAR training modules as a third-party paid product without prior authorization.',
            'Remove or obscure any copyright notices, watermarks, or digital signatures from generated safety certificates.',
          ],
        },
        {
          num: '4',
          title: 'Certificate Integrity & Anti-Counterfeiting',
          intro: 'All digital certificates issued upon module completion contain unique certificate identification numbers, cryptographic verification hashes, and verifiable QR codes. Any reproduction, forgery, or tampering with SurakshaAR completion certificates is strictly prohibited and invalidates the credential.',
        },
        {
          num: '5',
          title: 'Third-Party & Open-Source Attributions',
          intro: 'SurakshaAR proudly utilizes open-source libraries and open web standards, including Three.js (MIT License), React (MIT License), Vite, Lucide Icons (ISC License), and the W3C WebXR Device API. All respective third-party trademarks and open-source copyrights belong to their respective owners.',
        },
        {
          num: '6',
          title: 'Licensing & Copyright Inquiries',
          intro: 'To request permissions, institutional licensing, academic collaborations, or to report copyright infringement concerns, please contact our team:',
        },
      ],
    },
    hi: {
      badge: 'कानूनी सूचना',
      title: 'कॉपीराइट और बौद्धिक संपदा सूचना',
      rightsLine: '© 2026 SurakshaAR. सर्वाधिकार सुरक्षित।',
      highlightTitle: 'सर्वाधिकार सुरक्षित © 2026 SurakshaAR',
      highlightDesc: 'स्मार्ट इंडिया हैकाथॉन 2026 (समस्या विवरण SIH26041) के लिए विकसित। सभी सॉफ्टवेयर कोड, 3D सिमुलेशन, AR अनुभव, ऑडियो और मूल्यांकन सामग्री कानूनी रूप से संरक्षित हैं।',
      sections: [
        {
          num: '1',
          title: 'स्वामित्व और बौद्धिक संपदा संपत्ति',
          intro: 'SurakshaAR एप्लिकेशन और वेबसाइट पर मौजूद सभी सामग्री SurakshaAR टीम और परियोजना निर्माताओं की संपत्ति है, जिसमें निम्नलिखित शामिल हैं:',
          list: [
            'कस्टम Three.js 3D मॉडल (अग्निशामक यंत्र, मशीनरी रोलर्स, गैस पाइपलाइन, आपातकालीन नियंत्रण पैनल)।',
            'ऑगमेंटेड रियलिटी WebXR कैमरा ट्रैकिंग और सरफेस डिटेक्शन सिस्टम।',
            'वेब ऑडियो द्वारा निर्मित ध्वनियां (CO₂ गैस डिस्चार्ज, औद्योगिक सायरन, दहन प्रभाव)।',
            'प्रशिक्षण परिदृश्य, PASS अग्निशमन एनिमेशन और निर्णय-प्रक्रिया तर्क।',
            'ग्राफिक डिज़ाइन, लोगो, टाइपोग्राफी, बैज और आधिकारिक रंग पैलेट।',
            'सुरक्षा प्रश्नोत्तरी और बहुभाषी अनुवाद (अंग्रेजी, हिंदी, संताली ᱥᱟᱱᱛᱟᱲᱤ)।',
          ],
        },
        {
          num: '2',
          title: 'अनुमत उपयोग (Permitted Use)',
          intro: 'श्रमिकों, प्रशिक्षुओं, छात्रों और सुरक्षा अधिकारियों को केवल व्यक्तिगत शैक्षणिक सीखने, आपातकालीन अभ्यास और सुरक्षा प्रमाणन के लिए SurakshaAR का उपयोग करने का गैर-अनन्य लाइसेंस दिया जाता है।',
        },
        {
          num: '3',
          title: 'प्रतिबंधित गतिविधियां',
          intro: 'परियोजना रचनाकारों की पूर्व लिखित अनुमति के बिना निम्नलिखित गतिविधियां सख्त वर्जित हैं:',
          list: [
            '3D मॉडल या AR प्रशिक्षण कोड के किसी भी हिस्से की प्रतिलिपि बनाना, वितरण या पुनर्प्रकाशन करना।',
            'एप्लिकेशन संपत्तियों का रिवर्स-इंजीनियरिंग, डिकंपाइलिंग या निष्कर्षण करना।',
            'SurakshaAR मॉड्यूल को तीसरे पक्ष के भुगतान वाले उत्पाद के रूप में बेचना या रीपैकेज करना।',
            'प्रशिक्षण प्रमाणपत्रों से कॉपीराइट नोटिस, वॉटरमार्क या डिजिटल हैश को हटाना या छिपाना।',
          ],
        },
        {
          num: '4',
          title: 'प्रमाणपत्र अखंडता और जालसाजी रोकथाम',
          intro: 'मॉड्यूल पूरा होने पर जारी किए गए सभी डिजिटल प्रमाणपत्रों में अद्वितीय प्रमाणपत्र आईडी, क्रिप्टोग्राफ़िक सत्यापन हैश और QR कोड होते हैं। SurakshaAR प्रमाणपत्रों के साथ किसी भी प्रकार की छेड़छाड़ सख्त वर्जित है और इसे अमान्य बनाती है।',
        },
        {
          num: '5',
          title: 'ओपन-सोर्स आभार और श्रेय',
          intro: 'SurakshaAR खुले वेब मानकों और ओपन-सोर्स तकनीकों का आभारी है, जिसमें Three.js (MIT), React (MIT), Vite, Lucide Icons (ISC) और W3C WebXR API शामिल हैं। सभी तृतीय-पक्ष ट्रेडमार्क उनके संबंधित स्वामियों के हैं।',
        },
        {
          num: '6',
          title: 'लाइसेंसिंग और कॉपीराइट पूछताछ',
          intro: 'अनुमति अनुरोध, संस्थागत लाइसेंसिंग, शैक्षणिक सहयोग या कॉपीराइट उल्लंघन की रिपोर्ट करने के लिए कृपया संपर्क करें:',
        },
      ],
    },
    sat: {
      badge: 'ᱠᱟᱹᱱᱩᱱᱤ ᱵᱟᱰᱟᱭ',
      title: 'ᱠᱚᱯᱤᱨᱟᱭᱤᱴ ᱟᱨ ᱥᱚᱢᱯᱚᱛᱤ ᱟᱹᱭᱫᱟᱹᱨᱤ (Copyright Notice)',
      rightsLine: '© ᱒᱐᱒᱖ SurakshaAR. ᱡᱚᱛᱚ ᱟᱹᱭᱫᱟᱹᱨᱤ ᱫᱚᱦᱚ ᱮᱱᱟ᱾',
      highlightTitle: 'ᱡᱚᱛᱚ ᱟᱹᱭᱫᱟᱹᱨᱤ ᱫᱚᱦᱚ ᱮᱱᱟ © ᱒᱐᱒᱖ SurakshaAR',
      highlightDesc: 'ᱥᱢᱟᱨᱴ ᱤᱱᱰᱤᱭᱟ ᱦᱮᱠᱟᱛᱷᱚᱱ ᱒᱐᱒᱖ (SIH26041) ᱞᱟᱹᱜᱤᱫ ᱵᱮᱱᱟᱣ ᱟᱠᱟᱱᱟ᱾ ᱡᱚᱛᱚ ᱥᱚᱯᱷᱴᱣᱮᱭᱟᱨ ᱠᱳᱰ, 3D ᱥᱤᱢᱩᱞᱮᱥᱚᱱ, AR ᱚᱵᱷᱤᱜᱽᱭᱟᱸ ᱟᱨ ᱠᱩᱠᱞᱤ ᱵᱮᱝᱠ ᱠᱟᱹᱱᱩᱱ ᱞᱮᱠᱟᱛᱮ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱢᱮᱱᱟᱜᱼᱟ᱾',
      sections: [
        {
          num: '1',
          title: 'ᱟᱯᱱᱟᱨ ᱥᱚᱢᱯᱚᱛᱤ ᱟᱨ ᱟᱹᱭᱫᱟᱹᱨᱤ',
          intro: 'SurakshaAR ᱮᱯ ᱟᱨ ᱣᱮᱵᱽᱥᱟᱭᱤᱴ ᱨᱮ ᱢᱮᱱᱟᱜ ᱡᱚᱛᱚ ᱥᱟᱢᱟᱱ SurakshaAR ᱴᱤᱢ ᱨᱮᱱᱟᱜ ᱠᱟᱱᱟ:',
          list: [
            'Three.js 3D ᱢᱳᱰᱮᱞ (ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡᱤᱡ, ᱢᱮᱥᱤᱱ ᱨᱳᱞᱟᱨ, ᱜᱮᱥ ᱯᱟᱭᱤᱯ, ᱠᱚᱱᱴᱨᱳᱞ ᱯᱮᱱᱮᱞ)᱾',
            'WebXR AR ᱠᱮᱢᱮᱨᱟ ᱴᱨᱮᱠᱤᱝ ᱟᱨ ᱚᱛ ᱯᱟᱨᱠᱷᱟᱣ ᱥᱤᱥᱴᱚᱢ᱾',
            'ᱣᱮᱵᱽ ᱚᱰᱤᱭᱳ ᱥᱟᱰᱮ (CO₂ ᱜᱮᱥ ᱥᱟᱰᱮ, ᱠᱟᱹᱨᱜᱟᱲ ᱟᱞᱟᱨᱢ, ᱥᱮᱸᱜᱮᱞ ᱥᱟᱰᱮ)᱾',
            'ᱥᱤᱠᱷᱟᱣ ᱫᱷᱟᱯ ᱠᱚ, PASS ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡ ᱮᱱᱤᱢᱮᱥᱚᱱ ᱟᱨ ᱞᱚᱡᱤᱠ᱾',
            'ᱜᱽᱨᱟᱯᱷᱤᱠ ᱰᱤᱡᱟᱭᱤᱱ, ᱪᱤᱛᱟᱹᱨ, ᱞᱳᱜᱳ ᱟᱨ ᱨᱚᱝ ᱠᱚ᱾',
            'ᱥᱩᱨᱠᱷᱟ ᱠᱩᱠᱞᱤ ᱵᱮᱝᱠ ᱟᱨ ᱯᱟᱹᱨᱥᱤ ᱛᱚᱨᱡᱚᱢᱟ (ᱤᱝᱨᱮᱡᱤ, ᱦᱤᱱᱫᱤ, ᱥᱟᱱᱛᱟᱲᱤ ᱥᱟᱱᱛᱟᱲᱤ)᱾',
          ],
        },
        {
          num: '2',
          title: 'ᱮᱢ ᱟᱠᱟᱱ ᱵᱮᱵᱷᱟᱨ ᱟᱹᱭᱫᱟᱹᱨᱤ',
          intro: 'ᱠᱟᱹᱢᱤᱭᱟᱹ, ᱪᱮᱪᱮᱫᱤᱭᱟᱹ ᱟᱨ ᱥᱮᱯᱷᱴᱤ ᱚᱯᱷᱤᱥᱟᱨ ᱠᱚ ᱠᱷᱟᱹᱞᱤ ᱥᱮᱪᱮᱫ ᱟᱨ ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ ᱞᱟᱹᱜᱤᱫ ᱱᱚᱶᱟ ᱯᱞᱮᱴᱯᱷᱳᱨᱢ ᱵᱮᱵᱷᱟᱨ ᱨᱮᱱᱟᱜ ᱟᱹᱭᱫᱟᱹᱨᱤ ᱮᱢ ᱟᱠᱟᱱᱟ᱾',
        },
        {
          num: '3',
          title: 'ᱢᱟᱱᱟ ᱟᱠᱟᱱ ᱠᱟᱹᱢᱤ ᱠᱚ',
          intro: 'ᱴᱤᱢ ᱟᱜ ᱦᱩᱠᱩᱢ ᱵᱮᱜᱚᱨ ᱞᱟᱛᱟᱨ ᱨᱮᱱᱟᱜ ᱠᱟᱹᱢᱤ ᱠᱚ ᱢᱟᱱᱟ ᱜᱮᱭᱟ:',
          list: [
            '3D ᱢᱳᱰᱮᱞ ᱥᱮ AR ᱠᱳᱰ ᱱᱚᱠᱚᱞ ᱠᱟᱛᱮ ᱮᱴᱟᱜ ᱴᱷᱟᱶ ᱨᱮ ᱯᱟᱥᱱᱟᱣ᱾',
            'ᱮᱯ ᱨᱮᱱᱟᱜ ᱠᱳᱰ ᱨᱟᱹᱯᱩᱫ ᱥᱮ ᱪᱩᱨᱤ ᱨᱮᱱᱟᱜ ᱪᱮᱥᱴᱟ᱾',
            'SurakshaAR ᱢᱳᱰᱩᱞ ᱯᱩᱭᱥᱟᱹ ᱛᱮ ᱟᱹᱠᱷᱨᱤᱧ ᱥᱮ ᱵᱮᱯᱟᱨ ᱞᱟᱹᱜᱤᱫ ᱵᱮᱵᱷᱟᱨ᱾',
            'ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ ᱠᱷᱚᱱ ᱠᱚᱯᱤᱨᱟᱭᱤᱴ ᱪᱤᱱᱦᱟᱹ ᱥᱮ QR ᱠᱳᱰ ᱚᱪᱚᱜ᱾',
          ],
        },
        {
          num: '4',
          title: 'ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ ᱥᱟᱹᱨᱤᱭᱟᱹᱛ ᱟᱨ ᱮᱲᱮ ᱴᱮᱠᱟᱣ',
          intro: 'ᱡᱚᱛᱚ ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ ᱨᱮ ᱵᱷᱮᱜᱟᱨ ID, ᱦᱮᱥ ᱠᱳᱰ ᱟᱨ QR ᱠᱳᱰ ᱛᱟᱦᱮᱸᱱᱟ᱾ ᱮᱲᱮ ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ ᱵᱮᱱᱟᱣ ᱥᱮ ᱵᱚᱫᱚᱞ ᱥᱟᱹᱠᱷᱤ ᱞᱮᱠᱟᱛᱮ ᱵᱟᱹᱛᱤᱞ ᱦᱩᱭᱩᱜᱼᱟ᱾',
        },
        {
          num: '5',
          title: 'ᱚᱯᱮᱱ-ᱥᱳᱨᱥ ᱥᱟᱨᱦᱟᱣ',
          intro: 'SurakshaAR ᱫᱚ Three.js (MIT), React (MIT), Vite, Lucide ᱟᱨ WebXR API ᱞᱮᱠᱟᱱ ᱚᱯᱮᱱ ᱴᱮᱠᱱᱚᱞᱚᱡᱤ ᱵᱮᱵᱷᱟᱨᱟᱭ᱾ ᱡᱚᱛᱚ ᱴᱨᱮᱰᱢᱟᱨᱠ ᱟᱠᱚᱣᱟᱜ ᱢᱟᱹᱞᱤᱠ ᱠᱚᱣᱟᱜ ᱠᱟᱱᱟ᱾',
        },
        {
          num: '6',
          title: 'ᱞᱟᱭᱥᱮᱱᱥ ᱟᱨ ᱡᱚᱯᱲᱟᱣ',
          intro: 'ᱥᱟᱹᱨᱤ ᱞᱟᱭᱥᱮᱱᱥ, ᱤᱱᱥᱴᱤᱴᱤᱭᱩᱴ ᱜᱚᱲᱚ ᱥᱮ ᱠᱚᱯᱤᱨᱟᱭᱤᱴ ᱠᱩᱠᱞᱤ ᱞᱟᱹᱜᱤᱫ ᱟᱞᱮ ᱴᱷᱮᱱ ᱥᱮᱴᱮᱨᱚᱜ ᱢᱮ:',
        },
      ],
    },
  }

  const t = content[lang] ?? content.en

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, paddingTop: 'calc(var(--navbar-height) + 32px)', paddingBottom: 64 }}>
        <div className="page-container" style={{ maxWidth: 840, margin: '0 auto', padding: '0 20px' }}>
          
          {/* Header */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-brand)', marginBottom: 8 }}>
              <CopyrightIcon size={20} />
              <span style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{t.badge}</span>
            </div>
            <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', fontWeight: 800, color: 'var(--color-text-primary)', margin: '0 0 8px' }}>
              {t.title}
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem', margin: 0 }}>
              {t.rightsLine}
            </p>
          </div>

          {/* Copyright Highlight Card */}
          <div
            style={{
              background: 'linear-gradient(135deg, var(--color-brand-50, #FFF3EB), var(--color-surface, #FFFFFF))',
              border: '1.5px solid var(--color-brand-100, #FFE6D5)',
              borderRadius: 'var(--radius-lg, 16px)',
              padding: '24px 28px',
              marginBottom: 32,
              display: 'flex',
              gap: 16,
              alignItems: 'center',
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: 'var(--color-brand)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                flexShrink: 0,
              }}
            >
              <ShieldCheck size={24} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--color-text-primary)', marginBottom: 4 }}>
                {t.highlightTitle}
              </div>
              <div style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                {t.highlightDesc}
              </div>
            </div>
          </div>

          {/* Detailed Copyright Sections */}
          <div
            className="card"
            style={{
              padding: 'clamp(24px, 4vw, 40px)',
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg, 16px)',
              display: 'flex',
              flexDirection: 'column',
              gap: 28,
            }}
          >
            {t.sections.map((sec, idx) => (
              <React.Fragment key={sec.num}>
                <section>
                  <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 10 }}>
                    {sec.num}. {sec.title}
                  </h2>
                  <p style={{ fontSize: '0.92rem', color: 'var(--color-text-secondary)', lineHeight: 1.7, margin: '0 0 10px' }}>
                    {sec.intro}
                  </p>
                  {sec.list && (
                    <ul style={{ margin: 0, paddingLeft: 20, fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
                      {sec.list.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  )}
                  {sec.num === '6' && (
                    <div
                      style={{
                        marginTop: 12,
                        background: 'var(--color-surface-alt)',
                        borderRadius: 'var(--radius-md, 10px)',
                        padding: '12px 16px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 10,
                      }}
                    >
                      <Mail size={16} color="var(--color-brand)" />
                      <a href="mailto:surakshaar.in@gmail.com" style={{ color: 'var(--color-brand)', fontWeight: 700, textDecoration: 'none', fontSize: '0.92rem' }}>
                        surakshaar.in@gmail.com
                      </a>
                    </div>
                  )}
                </section>
                {idx < t.sections.length - 1 && (
                  <div style={{ height: 1, background: 'var(--color-border)' }} />
                )}
              </React.Fragment>
            ))}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}
