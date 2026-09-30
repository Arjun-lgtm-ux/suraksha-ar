import React from 'react'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { useLang } from '../contexts/LanguageContext'
import { AlertTriangle, FileText, Mail } from 'lucide-react'

export default function Terms() {
  const { lang } = useLang()

  const content = {
    en: {
      badge: 'Legal',
      title: 'Terms & Conditions',
      updated: 'Last updated: September 2026 · Effective for all SurakshaAR users',
      disclaimerTitle: 'Important Educational & Safety Disclaimer',
      disclaimerP1: 'SurakshaAR is an educational and industrial safety training platform. All simulations, Augmented Reality (AR) experiences, interactive scenarios, videos, checklists, and safety information provided on this platform are designed solely for educational, simulation, and training purposes.',
      disclaimerP2: 'These simulations are NOT a substitute for official workplace safety procedures, professional safety officer instructions, factory operating guidelines, or applicable statutory and government safety regulations (such as DGMS, Factory Act, OSHA, or Bureau of Indian Standards). In actual emergency situations, always adhere strictly to your plant’s official emergency action plan, emergency sirens, and professional command instructions.',
      sections: [
        {
          num: '1',
          title: 'Use of Platform',
          body: 'By accessing or using SurakshaAR (including our web platform, mobile PWA, 3D simulations, and AR modules), you agree to be bound by these Terms & Conditions. The platform is intended for workers, trainees, supervisors, and safety personnel to learn and practice emergency safety protocols in a simulated environment.',
        },
        {
          num: '2',
          title: 'User Account',
          body: 'Users register using their genuine email address and verify access via a one-time password (OTP). You are responsible for maintaining the confidentiality of your session credentials and ensuring that information provided (such as your full name, employee identification, and site location) is accurate for certificate generation and training records.',
        },
        {
          num: '3',
          title: 'Training Content',
          body: 'The training scenarios (such as Fire & Explosion Response, Gas Leak & Confined Space, Machinery Guarding, and PPE Inspection) present simulated hazards to teach emergency sequences. While scenario procedures align with recognized standards (e.g., IS 2925, IS 15683, PASS method), plant-specific engineering controls and local Standard Operating Procedures (SOPs) must always take legal precedence at your job site.',
        },
        {
          num: '4',
          title: 'User Conduct',
          body: 'You agree to use SurakshaAR lawfully, ethically, and without attempting to disrupt service operations. You may not reverse-engineer, exploit vulnerabilities, automate fraudulent drill submissions, or forge completion certificates.',
        },
        {
          num: '5',
          title: 'Intellectual Property',
          body: 'All original 3D models, textures, user interface designs, audio synthesizers, brand marks, and software code comprising SurakshaAR are the intellectual property of the SurakshaAR team. Individual trainees are granted a personal, non-exclusive license to access and complete training scenarios.',
        },
        {
          num: '6',
          title: 'Third-Party Services',
          body: 'SurakshaAR utilizes select third-party services to deliver its capabilities, including Google WebXR APIs for camera surface tracking, EmailJS and Google Apps Script for automated OTP dispatch, and Supabase for secure cloud synchronization. Your interaction with these third parties is subject to their respective terms and service policies.',
        },
        {
          num: '7',
          title: 'Platform Availability',
          body: 'SurakshaAR is designed with offline progressive web app (PWA) capabilities to support remote and underground mine drills. However, cloud synchronization, certificate verification, and real-time AI assistance require active internet connectivity. We strive for high uptime but do not guarantee uninterrupted availability during system maintenance.',
        },
        {
          num: '8',
          title: 'Updates to Terms',
          body: 'We may periodically update these Terms to reflect technical improvements, regulatory guidelines, or additional safety modules. Continued use of SurakshaAR after modifications constitutes acceptance of the revised Terms.',
        },
        {
          num: '9',
          title: 'Contact',
          body: 'For questions regarding these Terms & Conditions or organizational deployment inquiries, please contact our team:',
        },
      ],
    },
    hi: {
      badge: 'कानूनी जानकारी',
      title: 'नियम एवं शर्तें',
      updated: 'अंतिम अद्यतन: सितंबर 2026 · सभी SurakshaAR उपयोगकर्ताओं के लिए प्रभावी',
      disclaimerTitle: 'महत्वपूर्ण शैक्षणिक व सुरक्षा अस्वीकरण (Disclaimer)',
      disclaimerP1: 'SurakshaAR एक शैक्षणिक और औद्योगिक सुरक्षा प्रशिक्षण प्लेटफॉर्म है। इस प्लेटफॉर्म पर उपलब्ध सभी सिमुलेशन, ऑगमेंटेड रियलिटी (AR) अभ्यास, परिदृश्य, चेकलिस्ट और सुरक्षा संबंधी जानकारी केवल सीखने और प्रशिक्षण के उद्देश्य से तैयार की गई है।',
      disclaimerP2: 'यह सिमुलेशन आधिकारिक कार्यस्थल सुरक्षा प्रक्रियाओं, सुरक्षा अधिकारी के निर्देशों, फैक्ट्री संचालन नियमों या लागू सरकारी नियमों (जैसे DGMS, फैक्ट्री अधिनियम, OSHA, या भारतीय मानक ब्यूरो) का विकल्प नहीं है। वास्तविक आपातकालीन स्थिति में हमेशा अपने कारखाने की मानक आपातकालीन योजना, सायरन और सुरक्षा अधिकारियों के निर्देशों का कड़ाई से पालन करें।',
      sections: [
        {
          num: '1',
          title: 'प्लेटफ़ॉर्म का उपयोग',
          body: 'SurakshaAR (वेब प्लेटफॉर्म, मोबाइल PWA, 3D सिमुलेशन और AR मॉड्यूल) का उपयोग करके आप इन नियमों और शर्तों से बंधे होने के लिए सहमत हैं। यह प्लेटफॉर्म श्रमिकों, प्रशिक्षुओं और पर्यवेक्षकों के लिए आपातकालीन सुरक्षा प्रोटोकॉल सीखने और अभ्यास करने के लिए है।',
        },
        {
          num: '2',
          title: 'उपयोगकर्ता खाता',
          body: 'उपयोगकर्ता अपने वास्तविक ईमेल से पंजीकरण करते हैं और OTP के माध्यम से प्रवेश करते हैं। आप अपने खाते की गोपनीयता बनाए रखने और प्रमाणपत्र के लिए सही विवरण (जैसे नाम, कर्मचारी आईडी और संयंत्र स्थल) प्रदान करने के लिए जिम्मेदार हैं।',
        },
        {
          num: '3',
          title: 'प्रशिक्षण सामग्री',
          body: 'प्रशिक्षण परिदृश्य (जैसे आग प्रतिक्रिया, गैस रिसाव, मशीनरी सुरक्षा और PPE) आपातकालीन क्रम सिखाने के लिए हैं। हालांकि ये मान्यता प्राप्त मानकों (IS 2925, IS 15683, PASS) पर आधारित हैं, लेकिन कार्यस्थल पर आपके कारखाने की SOP ही सर्वोपरि होगी।',
        },
        {
          num: '4',
          title: 'उपयोगकर्ता आचरण',
          body: 'आप SurakshaAR का उपयोग कानूनी और नैतिक रूप से करने के लिए सहमत हैं। सिस्टम में हेरफेर करना, नकली प्रमाणपत्र बनाना या फर्जी स्कोर सबमिट करना सख्त वर्जित है।',
        },
        {
          num: '5',
          title: 'बौद्धिक संपदा अधिकार',
          body: 'SurakshaAR के सभी मूल 3D मॉडल, सॉफ्टवेयर कोड, ग्राफिक्स, ध्वनि प्रभाव और ब्रांड चिह्न SurakshaAR टीम की बौद्धिक संपदा हैं। उपयोगकर्ताओं को केवल प्रशिक्षण पूरा करने का व्यक्तिगत अधिकार दिया जाता है।',
        },
        {
          num: '6',
          title: 'तृतीय-पक्ष सेवाएं',
          body: 'SurakshaAR कुछ सुरक्षित तृतीय-पक्ष सेवाओं का उपयोग करता है (जैसे AR ट्रैकिंग के लिए WebXR, ईमेल OTP के लिए EmailJS और सुरक्षित डेटाबेस के लिए Supabase)। उनका उपयोग उनकी सेवा शर्तों के अधीन है।',
        },
        {
          num: '7',
          title: 'प्लेटफ़ॉर्म उपलब्धता',
          body: 'SurakshaAR दूरस्थ खदानों के लिए ऑफ़लाइन PWA क्षमता के साथ बनाया गया है। हालांकि, क्लाउड सिंक और सत्यापन के लिए इंटरनेट की आवश्यकता होती है। हम उच्च उपलब्धता का प्रयास करते हैं लेकिन रखरखाव के दौरान निर्बाध सेवा की गारंटी नहीं देते।',
        },
        {
          num: '8',
          title: 'शर्तों में संशोधन',
          body: 'हम तकनीकी सुधारों या नियामक दिशानिर्देशों के अनुसार समय-समय पर इन शर्तों को संशोधित कर सकते हैं। परिवर्तनों के बाद सेवा का उपयोग जारी रखना नई शर्तों की स्वीकृति माना जाएगा।',
        },
        {
          num: '9',
          title: 'संपर्क सूत्र',
          body: 'नियम व शर्तों या संस्थागत उपयोग से संबंधित किसी भी प्रश्न के लिए सीधे हमारी टीम से संपर्क करें:',
        },
      ],
    },
    sat: {
      badge: 'ᱠᱟᱹᱱᱩᱱᱤ ᱵᱟᱰᱟᱭ',
      title: 'ᱱᱤᱭᱟᱹᱢ ᱟᱨ ᱥᱚᱨᱛ (Terms & Conditions)',
      updated: 'ᱢᱩᱪᱟᱹᱫ ᱥᱟᱯᱲᱟᱣ: ᱥᱮᱯᱴᱮᱢᱵᱚᱨ ᱒᱐᱒᱖ · ᱡᱚᱛᱚ SurakshaAR ᱵᱮᱵᱷᱟᱨᱤᱭᱟᱹ ᱠᱚ ᱞᱟᱹᱜᱤᱫ',
      disclaimerTitle: 'ᱞᱟᱹᱠᱛᱤᱭᱟᱱ ᱥᱮᱪᱮᱫ ᱟᱨ ᱥᱩᱨᱠᱷᱟ ᱦᱳᱸᱥᱤᱭᱟᱨᱤ (Disclaimer)',
      disclaimerP1: 'SurakshaAR ᱫᱚ ᱢᱤᱫ ᱥᱮᱪᱮᱫ ᱟᱨ ᱠᱟᱹᱨᱜᱟᱲ ᱥᱩᱨᱠᱷᱟ ᱥᱤᱠᱷᱟᱣ ᱯᱞᱮᱴᱯᱷᱳᱨᱢ ᱠᱟᱱᱟ᱾ ᱱᱚᱶᱟ ᱨᱮ ᱮᱢ ᱟᱠᱟᱱ ᱡᱚᱛᱚ ᱥᱤᱢᱩᱞᱮᱥᱚᱱ, AR ᱚᱵᱷᱤᱜᱽᱭᱟᱸ, ᱵᱷᱤᱰᱤᱭᱳ ᱟᱨ ᱥᱩᱨᱠᱷᱟ ᱠᱟᱛᱷᱟ ᱠᱷᱟᱹᱞᱤ ᱥᱮᱪᱮᱫ ᱟᱨ ᱥᱤᱠᱷᱟᱣ ᱞᱟᱹᱜᱤᱫ ᱜᱮ ᱵᱮᱱᱟᱣ ᱟᱠᱟᱱᱟ᱾',
      disclaimerP2: 'ᱱᱚᱶᱟ ᱥᱤᱢᱩᱞᱮᱥᱚᱱ ᱫᱚ ᱠᱟᱹᱨᱜᱟᱲ ᱨᱮᱱᱟᱜ ᱚᱯᱷᱤᱥᱤᱭᱟᱞ ᱥᱩᱨᱠᱷᱟ ᱱᱤᱭᱟᱹᱢ, ᱥᱮᱯᱷᱴᱤ ᱚᱯᱷᱤᱥᱟᱨ ᱟᱜ ᱦᱩᱠᱩᱢ, ᱥᱮ ᱥᱚᱨᱠᱟᱨᱤ ᱟᱹᱭᱤᱱ (DGMS, Factory Act, OSHA, BIS) ᱨᱮᱱᱟᱜ ᱵᱚᱫᱚᱞ ᱫᱚ ᱵᱟᱝ ᱠᱟᱱᱟ᱾ ᱥᱟᱹᱨᱤ ᱟᱯᱟᱛᱠᱟᱞᱤᱱ ᱚᱠᱛᱚ ᱨᱮ ᱟᱢᱟᱜ ᱯᱞᱟᱱᱴ ᱨᱮᱱᱟᱜ ᱚᱯᱷᱤᱥᱤᱭᱟᱞ ᱮᱠᱥᱚᱱ ᱯᱞᱟᱱ, ᱥᱟᱭᱨᱮᱱ ᱟᱨ ᱚᱯᱷᱤᱥᱟᱨ ᱠᱚᱣᱟᱜ ᱠᱟᱛᱷᱟ ᱜᱮ ᱢᱟᱱᱟᱣ ᱢᱮ᱾',
      sections: [
        {
          num: '1',
          title: 'ᱯᱞᱮᱴᱯᱷᱳᱨᱢ ᱵᱮᱵᱷᱟᱨ',
          body: 'SurakshaAR ᱵᱮᱵᱷᱟᱨ ᱠᱟᱛᱮ ᱟᱢ ᱱᱚᱶᱟ ᱱᱤᱭᱟᱹᱢ ᱟᱨ ᱥᱚᱨᱛ ᱢᱟᱱᱟᱣ ᱨᱮ ᱨᱮᱵᱮᱱ ᱮᱱᱟᱢ᱾ ᱱᱚᱶᱟ ᱫᱚ ᱠᱟᱹᱢᱤᱭᱟᱹ ᱟᱨ ᱥᱮᱪᱮᱫᱤᱭᱟᱹ ᱠᱚ ᱞᱟᱹᱜᱤᱫ ᱥᱩᱨᱠᱷᱟ ᱱᱤᱭᱟᱹᱢ ᱪᱮᱫᱚᱜ ᱞᱟᱹᱜᱤᱫ ᱠᱟᱱᱟ᱾',
        },
        {
          num: '2',
          title: 'ᱵᱮᱵᱷᱟᱨᱤᱭᱟᱹ ᱮᱠᱟᱣᱩᱱᱴ',
          body: 'ᱵᱮᱵᱷᱟᱨᱤᱭᱟᱹ ᱠᱚ ᱟᱠᱚᱣᱟᱜ ᱥᱟᱹᱨᱤ ᱤᱢᱮᱞ ᱟᱨ OTP ᱛᱮ ᱞᱚᱜᱽ ᱤᱱ ᱦᱩᱭᱩᱜᱼᱟ᱾ ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ ᱞᱟᱹᱜᱤᱫ ᱟᱢᱟᱜ ᱥᱟᱹᱨᱤ ᱧᱩᱛᱩᱢ ᱟᱨ ᱴᱷᱟᱶ ᱮᱢ ᱟᱢᱟᱜ ᱫᱟᱹᱭᱵᱷᱟᱨ ᱠᱟᱱᱟ᱾',
        },
        {
          num: '3',
          title: 'ᱥᱤᱠᱷᱟᱣ ᱥᱟᱛᱟᱢ',
          body: 'ᱥᱤᱠᱷᱟᱣ ᱢᱳᱰᱩᱞ ᱠᱚ (ᱥᱮᱸᱜᱮᱞ, ᱜᱮᱥ ᱞᱤᱠ, ᱢᱮᱥᱤᱱ ᱜᱟᱨᱰ) ᱟᱯᱟᱛᱠᱟᱞᱤᱱ ᱠᱟᱹᱢᱤ ᱪᱮᱫᱚᱜ ᱞᱟᱹᱜᱤᱫ ᱠᱟᱱᱟ᱾ ᱠᱟᱹᱢᱤ ᱴᱷᱟᱶ ᱨᱮ ᱟᱢᱟᱜ ᱯᱞᱟᱱᱴ ᱨᱮᱱᱟᱜ SOP ᱜᱮ ᱢᱟᱱᱟᱣ ᱦᱩᱭᱩᱜᱼᱟ᱾',
        },
        {
          num: '4',
          title: 'ᱵᱮᱵᱷᱟᱨᱤᱭᱟᱹ ᱟᱹᱪᱟᱹᱨ',
          body: 'ᱟᱢ SurakshaAR ᱥᱟᱹᱨᱤ ᱟᱨ ᱱᱤᱭᱟᱹᱢ ᱞᱮᱠᱟᱛᱮ ᱵᱮᱵᱷᱟᱨ ᱨᱮ ᱨᱮᱵᱮᱱ ᱮᱱᱟᱢ᱾ ᱮᱲᱮ ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ ᱵᱮᱱᱟᱣ ᱥᱮ ᱥᱤᱥᱴᱚᱢ ᱨᱟᱹᱯᱩᱫ ᱨᱮᱱᱟᱜ ᱪᱮᱥᱴᱟ ᱢᱟᱱᱟ ᱜᱮᱭᱟ᱾',
        },
        {
          num: '5',
          title: 'ᱵᱟᱹᱣᱫᱷᱤᱠ ᱥᱚᱢᱯᱚᱛᱤ (Intellectual Property)',
          body: 'SurakshaAR ᱨᱮᱱᱟᱜ 3D ᱢᱳᱰᱮᱞ, ᱠᱳᱰ, ᱪᱤᱛᱟᱹᱨ ᱟᱨ ᱟᱲᱟᱝ ᱫᱚ SurakshaAR ᱴᱤᱢ ᱨᱮᱱᱟᱜ ᱟᱹᱭᱫᱟᱹᱨᱤ ᱠᱟᱱᱟ᱾ ᱱᱚᱶᱟ ᱫᱚ ᱥᱤᱠᱷᱟᱣ ᱞᱟᱹᱜᱤᱫ ᱜᱮ ᱵᱮᱵᱷᱟᱨ ᱜᱟᱱᱚᱜᱼᱟ᱾',
        },
        {
          num: '6',
          title: 'ᱛᱮᱥᱟᱨ ᱯᱟᱦᱴᱟ ᱥᱮᱵᱟ (Third-Party Services)',
          body: 'SurakshaAR ᱫᱚ WebXR, EmailJS ᱟᱨ Supabase ᱞᱮᱠᱟᱱ ᱵᱷᱚᱨᱥᱟᱣᱟᱱ ᱥᱮᱵᱟ ᱵᱮᱵᱷᱟᱨᱟ, ᱡᱟᱦᱟᱸ ᱫᱚ ᱱᱟᱯᱟᱭ ᱥᱤᱠᱷᱟᱣ ᱞᱟᱹᱜᱤᱫ ᱞᱟᱹᱠᱛᱤ ᱠᱟᱱᱟ᱾',
        },
        {
          num: '7',
          title: 'ᱯᱞᱮᱴᱯᱷᱳᱨᱢ ᱧᱟᱢᱚᱜ (Availability)',
          body: 'SurakshaAR ᱫᱚ ᱠᱷᱟᱫᱟᱱ ᱞᱟᱹᱜᱤᱫ ᱚᱯᱷᱞᱟᱭᱤᱱ ᱵᱮᱵᱷᱟᱨ ᱦᱚᱸ ᱜᱟᱱᱚᱜᱼᱟ᱾ ᱢᱮᱱᱠᱷᱟᱱ ᱠᱞᱟᱣᱩᱰ ᱥᱤᱸᱠ ᱟᱨ ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ ᱞᱟᱹᱜᱤᱫ ᱤᱱᱴᱟᱨᱱᱮᱴ ᱞᱟᱹᱠᱛᱤ ᱠᱟᱱᱟ᱾',
        },
        {
          num: '8',
          title: 'ᱱᱤᱭᱟᱹᱢ ᱨᱮ ᱵᱚᱫᱚᱞ',
          body: 'ᱚᱠᱛᱚ ᱞᱮᱠᱟᱛᱮ ᱱᱚᱶᱟ ᱱᱤᱭᱟᱹᱢ ᱵᱚᱫᱚᱞ ᱫᱟᱲᱮᱭᱟᱜᱼᱟ᱾ ᱱᱚᱶᱟ ᱛᱟᱭᱚᱢ ᱦᱚᱸ ᱯᱞᱮᱴᱯᱷᱳᱨᱢ ᱵᱮᱵᱷᱟᱨ ᱠᱷᱟᱱ ᱱᱟᱶᱟ ᱱᱤᱭᱟᱹᱢ ᱢᱟᱱᱟᱣ ᱦᱩᱭᱩᱜᱼᱟ᱾',
        },
        {
          num: '9',
          title: 'ᱡᱚᱯᱲᱟᱣ',
          body: 'ᱱᱤᱭᱟᱹᱢ ᱟᱨ ᱥᱚᱨᱛ ᱵᱟᱵᱚᱛ ᱡᱟᱦᱟᱸᱱ ᱠᱩᱠᱞᱤ ᱛᱟᱦᱮᱸᱱ ᱠᱷᱟᱱ ᱟᱞᱮ ᱴᱷᱮᱱ ᱥᱮᱴᱮᱨᱚᱜ ᱢᱮ:',
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
              <FileText size={20} />
              <span style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{t.badge}</span>
            </div>
            <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', fontWeight: 800, color: 'var(--color-text-primary)', margin: '0 0 8px' }}>
              {t.title}
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem', margin: 0 }}>
              {t.updated}
            </p>
          </div>

          {/* Critical Safety & Educational Disclaimer Alert */}
          <div
            style={{
              background: 'var(--color-warning-bg, #FFFBEB)',
              border: '1.5px solid var(--color-warning-border, #FDE68A)',
              borderRadius: 'var(--radius-lg, 14px)',
              padding: '20px 24px',
              marginBottom: 32,
              display: 'flex',
              gap: 16,
              alignItems: 'flex-start',
            }}
          >
            <AlertTriangle size={24} color="var(--color-warning, #D97706)" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 800, color: '#92400E', margin: '0 0 6px' }}>
                {t.disclaimerTitle}
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#78350F', lineHeight: 1.6, margin: '0 0 10px' }}>
                {t.disclaimerP1}
              </p>
              <p style={{ fontSize: '0.88rem', color: '#78350F', lineHeight: 1.6, margin: 0 }}>
                {t.disclaimerP2}
              </p>
            </div>
          </div>

          {/* Terms Content Sections */}
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
                  <p style={{ fontSize: '0.92rem', color: 'var(--color-text-secondary)', lineHeight: 1.7, margin: 0 }}>
                    {sec.body}
                  </p>
                  {sec.num === '9' && (
                    <div
                      style={{
                        marginTop: 14,
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
