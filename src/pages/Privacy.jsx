import React from 'react'
import { Link } from 'react-router-dom'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { useLang } from '../contexts/LanguageContext'
import { ShieldCheck, Lock, Mail } from 'lucide-react'

export default function Privacy() {
  const { lang } = useLang()

  const content = {
    en: {
      badge: 'Transparency',
      title: 'Privacy Policy',
      updated: 'Last updated: September 2026 · Simple, transparent, and privacy-first',
      bannerTitle: 'We respect your data privacy',
      bannerSubtitle: 'SurakshaAR collects only the minimum necessary information required to authenticate your training sessions, verify emergency drills, and issue safety credentials.',
      sections: [
        {
          num: '1',
          title: 'Information Collected During Registration',
          intro: 'When you create an account on SurakshaAR, we collect the basic details needed to identify you as an industrial trainee:',
          list: [
            'Full Name: Displayed on your training dashboard and printed on digital certificates.',
            'Email Address: Used for account sign-in and security verification via OTP.',
            'Plant / Site Location: (Optional) Used to associate training drills with industrial work zones.',
            'Language Preference: Selected interface language (English, Hindi, or Santali).',
          ],
        },
        {
          num: '2',
          title: 'Email Address Used for OTP / Authentication',
          intro: 'SurakshaAR uses a secure 6-digit One-Time Password (OTP) verification system. When you request a code or create an account, an automated email is sent to your provided email address from surakshaar.in@gmail.com. Your email is used strictly for authentication and safety certificate notifications — we never send spam, marketing solicitations, or share your email with third-party advertisers.',
        },
        {
          num: '3',
          title: 'Basic Account Information & Training History',
          intro: 'As you complete interactive drills in the AR and 3D simulation modules, we record your drill performance metrics, including completion timestamps, hazard identification reaction times, assessment test scores, and issued certificates. This data allows you and your safety supervisor to track compliance and safety readiness over time.',
        },
        {
          num: '4',
          title: 'How Collected Information is Used',
          intro: 'Your data is utilized solely for legitimate safety training purposes:',
          list: [
            'To authenticate your identity and safeguard your training account.',
            'To record scenario completion and evaluate competency gaps.',
            'To generate digitally signed and verifiable safety training certificates.',
            'To provide offline synchronization when drilling in remote or underground sites.',
          ],
        },
        {
          num: '5',
          title: 'Data Security',
          intro: 'We employ standard modern security practices to protect your data. All communication between your device and SurakshaAR is encrypted using HTTPS and Transport Layer Security (TLS). Passwords, OTP hashes, and auth tokens are protected against unauthorized access.',
        },
        {
          num: '6',
          title: 'Third-Party Services',
          intro: 'SurakshaAR uses a small set of trusted infrastructure providers:',
          list: [
            'EmailJS / Google Mail Service: Dispatches real-time verification OTP emails.',
            'Supabase: Provides secure cloud database storage and role-based authentication.',
            'WebXR Device API: Executes on-device camera plane detection for AR without transmitting video streams to any external server.',
          ],
        },
        {
          num: '7',
          title: 'User Rights',
          intro: 'You have the right to view, update, or correct your personal profile information at any time from the Profile page. You can also request complete deletion of your account records or download your earned safety certificates by contacting our support team.',
        },
        {
          num: '8',
          title: 'Contact Information',
          intro: 'If you have questions, feedback, or data privacy requests, feel free to reach out directly:',
        },
      ],
    },
    hi: {
      badge: 'पारदर्शिता',
      title: 'गोपनीयता नीति (Privacy Policy)',
      updated: 'अंतिम अद्यतन: सितंबर 2026 · सरल, पारदर्शी और गोपनीयता-केंद्रित',
      bannerTitle: 'हम आपकी डेटा गोपनीयता का सम्मान करते हैं',
      bannerSubtitle: 'SurakshaAR केवल वही न्यूनतम जानकारी एकत्र करता है जो आपके प्रशिक्षण सत्रों को प्रमाणित करने, सुरक्षा अभ्यासों को सत्यापित करने और प्रमाणपत्र जारी करने के लिए आवश्यक है।',
      sections: [
        {
          num: '1',
          title: 'पंजीकरण के दौरान एकत्र की गई जानकारी',
          intro: 'जब आप SurakshaAR पर एक खाता बनाते हैं, तो हम एक औद्योगिक प्रशिक्षु के रूप में आपकी पहचान के लिए बुनियादी विवरण एकत्र करते हैं:',
          list: [
            'पूरा नाम: आपके प्रशिक्षण डैशबोर्ड और डिजिटल प्रमाणपत्रों पर प्रदर्शित करने के लिए।',
            'ईमेल पता: सुरक्षित OTP द्वारा लॉगिन और सत्यापन के लिए।',
            'संयंत्र / कार्यस्थल स्थान: (वैकल्पिक) औद्योगिक क्षेत्रों के साथ प्रशिक्षण सत्रों को जोड़ने के लिए।',
            'भाषा प्राथमिकता: चुनी गई इंटरफ़ेस भाषा (अंग्रेजी, हिंदी या संताली)।',
          ],
        },
        {
          num: '2',
          title: 'OTP और प्रमाणीकरण के लिए ईमेल का उपयोग',
          intro: 'SurakshaAR एक सुरक्षित 6-अंकीय वन-टाइम पासवर्ड (OTP) सत्यापन प्रणाली का उपयोग करता है। सुरक्षा कोड surakshaar.in@gmail.com से सीधे आपके ईमेल पर भेजे जाते हैं। आपकी ईमेल का उपयोग केवल प्रमाणीकरण और प्रमाणपत्र सूचनाओं के लिए किया जाता है — हम कभी स्पैम या विज्ञापन नहीं भेजते।',
        },
        {
          num: '3',
          title: 'बुनियादी खाता जानकारी और प्रशिक्षण इतिहास',
          intro: 'जैसे-जैसे आप AR और 3D मॉड्यूल में अभ्यास पूरा करते हैं, हम आपके प्रदर्शन मेट्रिक्स (पूरा होने का समय, प्रतिक्रिया गति, मूल्यांकन स्कोर और जारी किए गए प्रमाणपत्र) को रिकॉर्ड करते हैं, ताकि आपकी सुरक्षा तत्परता ट्रैक की जा सके।',
        },
        {
          num: '4',
          title: 'एकत्र की गई जानकारी का उपयोग',
          intro: 'आपकी जानकारी का उपयोग केवल वैध सुरक्षा प्रशिक्षण कार्यों के लिए किया जाता है:',
          list: [
            'आपकी पहचान सत्यापित करने और खाते को सुरक्षित रखने के लिए।',
            'परिदृश्य पूर्णता रिकॉर्ड करने और सीखने की प्रगति का मूल्यांकन करने के लिए।',
            'डिजिटल रूप से हस्ताक्षरित और QR-सत्यापित प्रमाणपत्र उत्पन्न करने के लिए।',
            'दूरदराज की खदानों में ड्रिलिंग के दौरान ऑफ़लाइन सिंक्रनाइज़ेशन प्रदान करने के लिए।',
          ],
        },
        {
          num: '5',
          title: 'डेटा सुरक्षा',
          intro: 'हम आपके डेटा की सुरक्षा के लिए आधुनिक सुरक्षा मानकों का पालन करते हैं। आपके डिवाइस और SurakshaAR के बीच संचार HTTPS और TLS के माध्यम से एन्क्रिप्ट किया गया है।',
        },
        {
          num: '6',
          title: 'तृतीय-पक्ष सेवाएं',
          intro: 'SurakshaAR केवल विश्वसनीय बुनियादी ढांचा प्रदाताओं का उपयोग करता है:',
          list: [
            'EmailJS / Google मेल सेवा: वास्तविक समय में सत्यापन ईमेल भेजने के लिए।',
            'Supabase: सुरक्षित क्लाउड डेटाबेस और प्रमाणीकरण के लिए।',
            'WebXR डिवाइस API: कैमरे के वीडियो को किसी बाहरी सर्वर पर भेजे बिना डिवाइस पर ही AR सरफेस डिटेक्शन निष्पादित करता है।',
          ],
        },
        {
          num: '7',
          title: 'उपयोगकर्ता अधिकार',
          intro: 'आपको प्रोफ़ाइल पृष्ठ से किसी भी समय अपनी व्यक्तिगत जानकारी देखने या अपडेट करने का पूरा अधिकार है। आप किसी भी समय अपना खाता हटाने का अनुरोध भी कर सकते हैं।',
        },
        {
          num: '8',
          title: 'संपर्क सूत्र',
          intro: 'यदि आपके पास डेटा गोपनीयता से संबंधित कोई प्रश्न या प्रतिक्रिया है, तो बेझिझक हमसे संपर्क करें:',
        },
      ],
    },
    sat: {
      badge: 'ᱯᱩᱥᱴᱟᱹᱣ ᱵᱟᱰᱟᱭ',
      title: 'ᱫᱟᱱᱟᱝ ᱱᱤᱭᱟᱹᱢ (Privacy Policy)',
      updated: 'ᱢᱩᱪᱟᱹᱫ ᱥᱟᱯᱲᱟᱣ: ᱥᱮᱯᱴᱮᱢᱵᱚᱨ ᱒᱐᱒᱖ · ᱥᱚᱦᱚᱡᱽ ᱟᱨ ᱥᱩᱨᱠᱷᱤᱛ',
      bannerTitle: 'ᱟᱞᱮ ᱟᱢᱟᱜ ᱰᱮᱴᱟ ᱫᱟᱱᱟᱝ ᱫᱚᱦᱚ ᱨᱮ ᱢᱟᱹᱱ ᱮᱢᱟᱞᱮ',
      bannerSubtitle: 'SurakshaAR ᱫᱚ ᱠᱷᱟᱹᱞᱤ ᱥᱤᱠᱷᱟᱣ, ᱚᱛ ᱵᱚᱛᱚᱨ ᱯᱟᱨᱠᱷᱟᱣ ᱟᱨ ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ ᱮᱢ ᱞᱟᱹᱜᱤᱫ ᱡᱚᱛᱚ ᱠᱷᱚᱱ ᱞᱟᱹᱠᱛᱤᱭᱟᱱ ᱠᱟᱛᱷᱟ ᱜᱮ ᱦᱟᱛᱟᱣᱟ᱾',
      sections: [
        {
          num: '1',
          title: 'ᱨᱮᱡᱤᱥᱴᱨᱮᱥᱚᱱ ᱚᱠᱛᱚ ᱦᱟᱛᱟᱣ ᱠᱟᱱ ᱠᱟᱛᱷᱟ',
          intro: 'SurakshaAR ᱨᱮ ᱮᱠᱟᱣᱩᱱᱴ ᱵᱮᱱᱟᱣ ᱡᱚᱠᱷᱚᱱ ᱟᱞᱮ ᱱᱚᱶᱟ ᱠᱚ ᱞᱟᱹᱠᱛᱤᱭᱟᱱ ᱠᱟᱛᱷᱟ ᱦᱟᱛᱟᱣᱟᱞᱮ:',
          list: [
            'ᱯᱩᱨᱟᱹ ᱧᱩᱛᱩᱢ: ᱟᱢᱟᱜ ᱰᱮᱥᱵᱳᱨᱰ ᱟᱨ ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ ᱨᱮ ᱪᱷᱟᱯᱟ ᱞᱟᱹᱜᱤᱫ᱾',
            'ᱤᱢᱮᱞ ᱴᱷᱤᱠᱬᱟ: ᱥᱩᱨᱠᱷᱤᱛ OTP ᱛᱮ ᱞᱚᱜᱽ ᱤᱱ ᱞᱟᱹᱜᱤᱫ᱾',
            'ᱯᱞᱟᱱᱴ / ᱥᱟᱭᱤᱴ ᱴᱷᱟᱶ: (ᱠᱩᱥᱤᱭᱟᱜ) ᱠᱟᱹᱨᱜᱟᱲ ᱠᱟᱹᱢᱤ ᱴᱷᱟᱶ ᱥᱟᱶ ᱡᱚᱯᱲᱟᱣ ᱞᱟᱹᱜᱤᱫ᱾',
            'ᱠᱩᱥᱤᱭᱟᱜ ᱯᱟᱹᱨᱥᱤ: ᱵᱟᱪᱷᱟᱣ ᱟᱠᱟᱱ ᱯᱟᱹᱨᱥᱤ (ᱤᱝᱨᱮᱡᱤ, ᱦᱤᱱᱫᱤ ᱥᱮ ᱥᱟᱱᱛᱟᱲᱤ)᱾',
          ],
        },
        {
          num: '2',
          title: 'OTP ᱞᱟᱹᱜᱤᱫ ᱤᱢᱮᱞ ᱵᱮᱵᱷᱟᱨ',
          intro: 'SurakshaAR ᱫᱚ ᱖-ᱮᱞ ᱨᱮᱱᱟᱜ ᱥᱩᱨᱠᱷᱤᱛ OTP ᱵᱮᱵᱷᱟᱨᱟ᱾ surakshaar.in@gmail.com ᱠᱷᱚᱱ ᱟᱢᱟᱜ ᱤᱢᱮᱞ ᱛᱮ ᱠᱳᱰ ᱪᱟᱞᱟᱜᱼᱟ᱾ ᱟᱞᱮ ᱛᱤᱥ ᱦᱚᱸ ᱮᱲᱮ ᱤᱢᱮᱞ ᱥᱮ ᱵᱤᱜᱽᱭᱟᱯᱚᱱ ᱵᱟᱞᱮ ᱠᱩᱞᱟ᱾',
        },
        {
          num: '3',
          title: 'ᱮᱠᱟᱣᱩᱱᱴ ᱟᱨ ᱥᱤᱠᱷᱟᱣ ᱱᱟᱜᱟᱢ',
          intro: 'AR ᱟᱨ 3D ᱢᱳᱰᱩᱞ ᱨᱮ ᱠᱟᱹᱢᱤ ᱯᱩᱨᱟᱹᱣ ᱥᱟᱶᱛᱮ ᱟᱢᱟᱜ ᱥᱠᱳᱨ, ᱚᱠᱛᱚ ᱟᱨ ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ ᱥᱟᱧᱪᱟᱣ ᱛᱟᱦᱮᱸᱱᱟ, ᱡᱟᱦᱟᱸ ᱛᱮ ᱥᱩᱯᱚᱨᱵᱷᱟᱭᱤᱡᱚᱨ ᱥᱩᱨᱠᱷᱟ ᱯᱟᱨᱠᱷᱟᱣ ᱫᱟᱲᱮᱭᱟᱜᱼᱟᱭ᱾',
        },
        {
          num: '4',
          title: 'ᱰᱮᱴᱟ ᱪᱮᱫ ᱞᱮᱠᱟ ᱵᱮᱵᱷᱟᱨᱚᱜ ᱠᱟᱱᱟ',
          intro: 'ᱟᱢᱟᱜ ᱰᱮᱴᱟ ᱠᱷᱟᱹᱞᱤ ᱥᱩᱨᱠᱷᱟ ᱥᱤᱠᱷᱟᱣ ᱞᱟᱹᱜᱤᱫ ᱜᱮ ᱵᱮᱵᱷᱟᱨᱚᱜᱼᱟ:',
          list: [
            'ᱟᱢᱟᱜ ᱮᱠᱟᱣᱩᱱᱴ ᱥᱩᱨᱠᱷᱤᱛ ᱫᱚᱦᱚ ᱞᱟᱹᱜᱤᱫ᱾',
            'ᱥᱤᱠᱷᱟᱣ ᱯᱩᱨᱟᱹᱣ ᱨᱮᱠᱚᱨᱰ ᱫᱚᱦᱚ ᱞᱟᱹᱜᱤᱫ᱾',
            'QR ᱠᱳᱰ ᱥᱟᱶ ᱰᱤᱡᱤᱴᱟᱞ ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ ᱵᱮᱱᱟᱣ ᱞᱟᱹᱜᱤᱫ᱾',
            'ᱠᱷᱟᱫᱟᱱ ᱨᱮ ᱚᱯᱷᱞᱟᱭᱤᱱ ᱠᱟᱹᱢᱤ ᱨᱮᱱᱟᱜ ᱥᱩᱵᱤᱫᱷᱟ ᱮᱢ ᱞᱟᱹᱜᱤᱫ᱾',
          ],
        },
        {
          num: '5',
          title: 'ᱰᱮᱴᱟ ᱥᱩᱨᱠᱷᱟ',
          intro: 'ᱟᱞᱮ HTTPS ᱟᱨ TLS ᱞᱮᱠᱟᱱ ᱱᱟᱦᱟᱜ ᱥᱩᱨᱠᱷᱟ ᱵᱮᱵᱚᱥᱛᱟ ᱵᱮᱵᱷᱟᱨᱟᱞᱮ, ᱡᱟᱦᱟᱸ ᱛᱮ ᱟᱢᱟᱜ ᱯᱟᱥᱣᱟᱨᱰ ᱟᱨ ᱰᱮᱴᱟ ᱥᱩᱨᱠᱷᱤᱛ ᱛᱟᱦᱮᱸᱱᱟ᱾',
        },
        {
          num: '6',
          title: 'ᱛᱮᱥᱟᱨ ᱯᱟᱦᱴᱟ ᱥᱮᱵᱟ',
          intro: 'SurakshaAR ᱫᱚ ᱵᱷᱚᱨᱥᱟᱣᱟᱱ ᱥᱮᱵᱟ ᱵᱮᱵᱷᱟᱨᱟ:',
          list: [
            'EmailJS: ᱚᱠᱛᱚ ᱨᱮ OTP ᱤᱢᱮᱞ ᱠᱩᱞ ᱞᱟᱹᱜᱤᱫ᱾',
            'Supabase: ᱥᱩᱨᱠᱷᱤᱛ ᱠᱞᱟᱣᱩᱰ ᱰᱮᱴᱟᱵᱮᱥ ᱫᱚᱦᱚ ᱞᱟᱹᱜᱤᱫ᱾',
            'WebXR API: ᱠᱮᱢᱮᱨᱟ ᱵᱷᱤᱰᱤᱭᱳ ᱵᱟᱦᱨᱮ ᱵᱟᱝ ᱠᱩᱞ ᱠᱟᱛᱮ ᱰᱤᱵᱷᱟᱭᱤᱥ ᱨᱮᱜᱮ AR ᱪᱟᱹᱞᱩ ᱞᱟᱹᱜᱤᱫ᱾',
          ],
        },
        {
          num: '7',
          title: 'ᱵᱮᱵᱷᱟᱨᱤᱭᱟᱹ ᱟᱹᱭᱫᱟᱹᱨᱤ',
          intro: 'ᱟᱢ Profile ᱥᱟᱦᱴᱟ ᱠᱷᱚᱱ ᱡᱟᱦᱟᱸ ᱚᱠᱛᱚ ᱨᱮᱜᱮ ᱟᱢᱟᱜ ᱠᱟᱛᱷᱟ ᱧᱮᱞ ᱟᱨ ᱥᱟᱯᱲᱟᱣ ᱫᱟᱲᱮᱭᱟᱜᱼᱟᱢ, ᱥᱮ ᱮᱠᱟᱣᱩᱱᱴ ᱢᱮᱴᱟᱣ ᱞᱟᱹᱜᱤᱫ ᱱᱮᱦᱚᱨ ᱫᱟᱲᱮᱭᱟᱜᱼᱟᱢ᱾',
        },
        {
          num: '8',
          title: 'ᱡᱚᱯᱲᱟᱣ ᱴᱷᱤᱠᱬᱟ',
          intro: 'ᱫᱟᱱᱟᱝ ᱱᱤᱭᱟᱹᱢ ᱵᱟᱵᱚᱛ ᱡᱟᱦᱟᱸᱱ ᱠᱩᱠᱞᱤ ᱛᱟᱦᱮᱸᱱ ᱠᱷᱟᱱ ᱟᱞᱮ ᱴᱷᱮᱱ ᱥᱮᱴᱮᱨᱚᱜ ᱢᱮ:',
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
              <ShieldCheck size={20} />
              <span style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{t.badge}</span>
            </div>
            <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', fontWeight: 800, color: 'var(--color-text-primary)', margin: '0 0 8px' }}>
              {t.title}
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem', margin: 0 }}>
              {t.updated}
            </p>
          </div>

          {/* Privacy Overview Banner */}
          <div
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg, 14px)',
              padding: '20px 24px',
              marginBottom: 32,
              display: 'flex',
              gap: 16,
              alignItems: 'center',
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: 'var(--color-success-bg, #E6F4EC)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Lock size={20} color="var(--color-success, #2E8B57)" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.96rem', color: 'var(--color-text-primary)', marginBottom: 3 }}>
                {t.bannerTitle}
              </div>
              <div style={{ fontSize: '0.86rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                {t.bannerSubtitle}
              </div>
            </div>
          </div>

          {/* Policy Content Sections */}
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
                  {sec.num === '8' && (
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
