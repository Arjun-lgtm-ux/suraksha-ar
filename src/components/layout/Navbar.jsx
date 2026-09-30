import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useLang } from '../../contexts/LanguageContext'
import { useAccessibility } from '../../contexts/AccessibilityContext'
import { useOffline } from '../../contexts/OfflineContext'
import { SUPPORTED_LANGUAGES } from '../../lib/i18n'
import { APP_NAME, APP_VERSION } from '../../lib/constants'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'
import {
  Menu, X, Home, LayoutDashboard, Target, Award, Bell,
  PlayCircle, Settings, Globe, Moon, Sun, LogOut,
  ChevronRight, WifiOff, ShieldCheck, AlertTriangle, Info,
  User, Phone, HelpCircle, Mail, LifeBuoy, ChevronDown,
} from 'lucide-react'
import VideoTutorialModal from '../ui/VideoTutorialModal'
import { UserAvatar } from '../ui/UserAvatar'

const DRAWER_STRINGS = {
  en: {
    traineeOfficer: 'Trainee Officer',
    home: 'Home',
    dashboard: 'Dashboard',
    adminDashboard: 'Admin Dashboard',
    myCertificates: 'My Certificates',
    tutorial: 'Tutorial / How It Works',
    about: 'About SurakshaAR',
    faq: 'FAQ',
    contactUs: 'Contact Us',
    emergencyNumbers: 'Emergency Numbers',
    helpSupport: 'Help & Support',
    settings: 'Settings',
    language: 'Language',
    darkMode: 'Dark Mode',
    signOut: 'Sign Out',
    notifications: 'Notifications',
    newBadge: 'new',
    markAllRead: 'Mark all read',
    noNewNotifications: 'No new notifications',
    viewProfile: 'View Profile',
    adminPanel: 'Admin Panel',
    close: 'Close',
    signIn: 'Sign In',
  },
  hi: {
    traineeOfficer: 'प्रशिक्षु अधिकारी',
    home: 'होम',
    dashboard: 'डैशबोर्ड',
    adminDashboard: 'एडमिन डैशबोर्ड',
    myCertificates: 'मेरे प्रमाणपत्र',
    tutorial: 'ट्यूटोरियल / कैसे काम करता है',
    about: 'SurakshaAR के बारे में',
    faq: 'अक्सर पूछे जाने वाले प्रश्न (FAQ)',
    contactUs: 'संपर्क करें',
    emergencyNumbers: 'आपातकालीन नंबर',
    helpSupport: 'सहायता और समर्थन',
    settings: 'सेटिंग्स',
    language: 'भाषा',
    darkMode: 'डार्क मोड',
    signOut: 'साइन आउट',
    notifications: 'सूचनाएं',
    newBadge: 'नई',
    markAllRead: 'सभी पढ़ा हुआ चिह्नित करें',
    noNewNotifications: 'कोई नई सूचना नहीं',
    viewProfile: 'प्रोफाइल देखें',
    adminPanel: 'एडमिन पैनल',
    close: 'बंद करें',
    signIn: 'साइन इन करें',
  },
  sat: {
    traineeOfficer: 'ᱥᱤᱠᱷᱱᱟᱹᱛᱤᱭᱟᱹ ᱟᱹᱢᱟᱹᱞᱤᱭᱟᱹ',
    home: 'ᱚᱲᱟᱜ',
    dashboard: 'ᱰᱮᱥᱵᱳᱨᱰ',
    adminDashboard: 'ᱮᱰᱢᱤᱱ ᱰᱮᱥᱵᱳᱨᱰ',
    myCertificates: 'ᱤᱧᱟᱜ ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ',
    tutorial: 'ᱴᱤᱭᱩᱴᱳᱨᱤᱭᱟᱞ / ᱪᱮᱫ ᱞᱮᱠᱟ ᱠᱟᱹᱢᱤᱭᱟ',
    about: 'SurakshaAR ᱵᱟᱵᱚᱛ',
    faq: 'ᱡᱟᱣ ᱠᱩᱠᱞᱤ (FAQ)',
    contactUs: 'ᱡᱚᱯᱲᱟᱣ ᱢᱮ',
    emergencyNumbers: 'ᱟᱯᱟᱛᱠᱟᱞᱤᱱ ᱮᱞ ᱠᱚ',
    helpSupport: 'ᱜᱚᱲᱚ ᱟᱨ ᱥᱚᱦᱚᱫ',
    settings: 'ᱥᱮᱴᱤᱝᱥ',
    language: 'ᱯᱟᱹᱨᱥᱤ',
    darkMode: 'ᱰᱟᱨᱠ ᱢᱳᱰ',
    signOut: 'ᱥᱟᱭᱤᱱ ᱟᱣᱩᱴ',
    notifications: 'ᱵᱟᱰᱟᱭᱪᱚ ᱠᱚ',
    newBadge: 'ᱱᱟᱶᱟ',
    markAllRead: 'ᱡᱚᱛᱚ ᱯᱟᱲᱦᱟᱣ ᱢᱮ',
    noNewNotifications: 'ᱪᱮᱫ ᱱᱟᱶᱟ ᱵᱟᱰᱟᱭᱪᱚ ᱵᱟᱹᱱᱩᱜᱼᱟ',
    viewProfile: 'ᱯᱨᱳᱯᱷᱟᱭᱤᱞ ᱧᱮᱞ ᱢᱮ',
    adminPanel: 'ᱮᱰᱢᱤᱱ ᱯᱮᱱᱮᱞ',
    close: 'ᱵᱚᱸᱫᱽ ᱢᱮ',
    signIn: 'ᱥᱟᱭᱤᱱ ᱤᱱ ᱢᱮ',
  },
}

const FAQ_DATA = {
  en: [
    { q: 'How do I start a training module?', a: 'Go to Dashboard → select a scenario card → tap "Start Training". The AR simulation will launch automatically.' },
    { q: 'Can I use it offline?', a: 'Yes! Fire Safety, Gas Leak, and Confined Space modules are cached for offline field drills. You will see an OFFLINE badge when not connected.' },
    { q: 'How do I get my certificate?', a: 'Complete all steps in a training scenario with a passing score. Your certificate is auto-generated and available under My Certificates.' },
    { q: 'Which devices support native AR?', a: 'Chrome on Android with ARCore installed supports native AR plane detection. Other devices use the sensor/gyro fallback mode.' },
    { q: 'How do I change the app language?', a: 'Open the navigation drawer (☰) → scroll to the bottom → select your language (English / हिंदी / ᱥᱟᱱᱛᱟᱲᱤ).' },
  ],
  hi: [
    { q: 'प्रशिक्षण मॉड्यूल कैसे शुरू करें?', a: 'डैशबोर्ड पर जाएं → परिदृश्य कार्ड चुनें → "प्रशिक्षण शुरू करें" पर टैप करें। AR सिमुलेशन स्वतः शुरू होगा।' },
    { q: 'क्या मैं इसे ऑफलाइन उपयोग कर सकता हूँ?', a: 'हाँ! अग्नि सुरक्षा, गैस रिसाव और सीमित स्थान मॉड्यूल ऑफलाइन अभ्यास के लिए कैश्ड हैं। कनेक्ट न होने पर OFFLINE बैज दिखेगा।' },
    { q: 'मुझे अपना प्रमाणपत्र कैसे मिलेगा?', a: 'उत्तीर्ण अंकों के साथ प्रशिक्षण के सभी चरण पूरे करें। आपका प्रमाणपत्र स्वतः तैयार होकर "मेरे प्रमाणपत्र" में उपलब्ध होगा।' },
    { q: 'कौन से डिवाइस मूल AR का समर्थन करते हैं?', a: 'ARCore स्थापित Android Chrome मूल AR का समर्थन करता है। अन्य डिवाइस जाइरो फॉलबैक मोड का उपयोग करते हैं।' },
    { q: 'ऐप की भाषा कैसे बदलें?', a: 'नेविगेशन मेन्यू (☰) खोलें → नीचे स्क्रॉल करें → अपनी भाषा चुनें (English / हिंदी / ᱥᱟᱱᱛᱟᱲᱤ)।' },
  ],
  sat: [
    { q: 'ᱥᱤᱠᱷᱱᱟᱹᱛ ᱢᱳᱰᱩᱞ ᱪᱮᱫ ᱞᱮᱠᱟᱛᱮ ᱮᱦᱚᱵᱟ?', a: 'ᱰᱮᱥᱵᱳᱨᱰ ᱛᱮ ᱥᱮᱱᱚᱜ ᱢᱮ → ᱠᱟᱨᱰ ᱵᱟᱪᱷᱟᱣ ᱢᱮ → "ᱥᱤᱠᱷᱱᱟᱹᱛ ᱮᱦᱚᱵ" ᱨᱮ ᱞᱤᱱ ᱢᱮ᱾ AR ᱥᱤᱢᱩᱞᱮᱥᱚᱱ ᱟᱡ ᱛᱮᱜᱮ ᱪᱟᱹᱞᱩᱜᱼᱟ᱾' },
    { q: 'ᱪᱮᱫ ᱤᱧ ᱱᱚᱶᱟ ᱚᱯᱷᱞᱟᱭᱤᱱ ᱨᱮ ᱵᱮᱵᱷᱟᱨ ᱫᱟᱲᱮᱭᱟᱜᱼᱟ?', a: 'ᱦᱮᱸ! ᱥᱮᱸᱜᱮᱞ ᱨᱩᱠᱷᱤᱭᱟᱹ, ᱜᱮᱥ ᱞᱤᱠ ᱟᱨ ᱥᱟᱸᱜᱷᱟᱨ ᱴᱷᱟᱶ ᱢᱳᱰᱩᱞ ᱫᱚ ᱚᱯᱷᱞᱟᱭᱤᱱ ᱞᱟᱹᱜᱤᱫ ᱠᱮᱥ ᱢᱮᱱᱟᱜᱼᱟ᱾ ᱚᱯᱷᱞᱟᱭᱤᱱ ᱨᱮ OFFLINE ᱪᱤᱱᱦᱟᱹ ᱧᱮᱞᱚᱜᱼᱟ᱾' },
    { q: 'ᱤᱧᱟᱜ ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ ᱪᱮᱫ ᱞᱮᱠᱟᱛᱮ ᱧᱟᱢᱚᱜᱼᱟ?', a: 'ᱯᱟᱥ ᱱᱚᱢᱵᱚᱨ ᱥᱟᱶ ᱡᱚᱛᱚ ᱫᱷᱟᱯ ᱯᱩᱨᱟᱹᱣ ᱢᱮ᱾ ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ ᱟᱡ ᱛᱮᱜᱮ ᱛᱮᱭᱟᱨᱚᱜᱼᱟ ᱟᱨ "ᱤᱧᱟᱜ ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ" ᱨᱮ ᱧᱟᱢᱚᱜᱼᱟ᱾' },
    { q: 'ᱚᱠᱟ ᱰᱤᱵᱷᱟᱭᱤᱥ ᱨᱮ ᱱᱮᱴᱤᱵᱷ AR ᱪᱟᱹᱞᱩᱜᱼᱟ?', a: 'ARCore ᱢᱮᱱᱟᱜ Android Chrome ᱨᱮ AR ᱪᱟᱹᱞᱩᱜᱼᱟ᱾ ᱮᱴᱟᱜ ᱰᱤᱵᱷᱟᱭᱤᱥ ᱨᱮ ᱡᱟᱭᱨᱳ ᱢᱳᱰ ᱪᱟᱹᱞᱩᱜᱼᱟ᱾' },
    { q: 'ᱮᱯ ᱨᱮᱱᱟᱜ ᱯᱟᱹᱨᱥᱤ ᱪᱮᱫ ᱞᱮᱠᱟᱛᱮ ᱵᱚᱫᱚᱞᱟ?', a: 'ᱢᱮᱱᱩ (☰) ᱡᱷᱤᱡᱽ ᱢᱮ → ᱞᱟᱛᱟᱨ ᱥᱮᱱᱚᱜ ᱢᱮ → ᱯᱟᱹᱨᱥᱤ ᱵᱟᱪᱷᱟᱣ ᱢᱮ (English / हिंदी / ᱥᱟᱱᱛᱟᱲᱤ)᱾' },
  ],
}

const HELP_DATA = {
  en: {
    items: [
      { icon: '📱', title: 'AR Not Working?', desc: 'Make sure you have a stable internet connection and camera permission is granted. On Android Chrome, tap "📡 Native ARCore" for best results.' },
      { icon: '🔑', title: 'Login / OTP Issues', desc: 'Check your spam folder. OTP expires in 10 minutes. If not received, tap "Resend OTP". Contact surakshaar.in@gmail.com if issue persists.' },
      { icon: '📜', title: 'Certificate Not Generated', desc: 'Certificates are generated only after completing all training steps with a minimum passing score. Ensure you are online during completion.' },
      { icon: '🔊', title: 'No Audio / Voice Guide', desc: 'Check your device volume and make sure your browser is not muted. Some browsers block autoplay — tap the screen to unlock audio.' },
      { icon: '🌐', title: 'Offline Mode', desc: 'SurakshaAR works offline for cached modules. If a module shows "Unavailable Offline", connect to the internet and reload once to cache it.' },
    ],
    stillNeedHelp: 'Still need help? Email us at',
  },
  hi: {
    items: [
      { icon: '📱', title: 'AR काम नहीं कर रहा?', desc: 'सुनिश्चित करें कि इंटरनेट कनेक्शन स्थिर है और कैमरा अनुमति दी गई है। Android Chrome पर बेहतर परिणाम के लिए "📡 Native ARCore" चुनें।' },
      { icon: '🔑', title: 'लॉगिन / OTP समस्या', desc: 'स्पैम फ़ोल्डर जांचें। OTP 10 मिनट में समाप्त होता है। न मिलने पर "OTP पुनः भेजें" पर टैप करें। समस्या जारी रहने पर ईमेल करें।' },
      { icon: '📜', title: 'प्रमाणपत्र तैयार नहीं हुआ', desc: 'उत्तीर्ण अंक के साथ सभी चरण पूरे करने पर ही प्रमाणपत्र बनता है। पूरा करते समय इंटरनेट से जुड़े रहना सुनिश्चित करें।' },
      { icon: '🔊', title: 'आवाज या गाइड नहीं आ रही', desc: 'डिवाइस का वॉल्यूम जांचें। यदि ब्राउज़र ऑटोप्ले रोकता है, तो आवाज अनलॉक करने के लिए स्क्रीन पर एक बार टैप करें।' },
      { icon: '🌐', title: 'ऑफलाइन मोड', desc: 'SurakshaAR कैश्ड मॉड्यूल के लिए ऑफलाइन काम करता है। यदि "Unavailable Offline" दिखे, तो इंटरनेट जोड़कर रीलोड करें।' },
    ],
    stillNeedHelp: 'अभी भी सहायता चाहिए? हमें ईमेल करें:',
  },
  sat: {
    items: [
      { icon: '📱', title: 'AR ᱵᱟᱝ ᱠᱟᱹᱢᱤ ᱠᱟᱱᱟ?', desc: 'ᱠᱮᱢᱨᱟ ᱪᱷᱟᱹᱲ ᱮᱢ ᱟᱠᱟᱱᱟ ᱢᱮᱱᱛᱮ ᱯᱟᱨᱠᱷᱟᱣ ᱢᱮ᱾ Android Chrome ᱨᱮ ᱵᱷᱟᱹᱜᱤ ᱚᱨᱡᱚ ᱞᱟᱹᱜᱤᱫ "📡 Native ARCore" ᱵᱟᱪᱷᱟᱣ ᱢᱮ᱾' },
      { icon: '🔑', title: 'ᱞᱚᱜᱤᱱ / OTP ᱮᱴᱠᱮᱴᱚᱬᱮ', desc: 'ᱥᱯᱟᱢ ᱯᱷᱳᱞᱰᱟᱨ ᱧᱮᱞ ᱢᱮ᱾ OTP ᱑᱐ ᱴᱤᱲᱤᱡ ᱨᱮ ᱪᱟᱵᱟᱜᱼᱟ᱾ ᱵᱟᱝ ᱧᱟᱢ ᱞᱮᱠᱷᱟᱱ "ᱫᱚᱦᱲᱟ OTP ᱠᱩᱞ" ᱞᱤᱱ ᱢᱮ᱾' },
      { icon: '📜', title: 'ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ ᱵᱟᱝ ᱵᱮᱱᱟᱣ ᱞᱮᱱᱟ', desc: 'ᱯᱟᱥ ᱱᱚᱢᱵᱚᱨ ᱥᱟᱶ ᱡᱚᱛᱚ ᱫᱷᱟᱯ ᱯᱩᱨᱟᱹᱣ ᱞᱮᱠᱷᱟᱱ ᱜᱮ ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ ᱵᱮᱱᱟᱣᱜᱼᱟ᱾ ᱚᱱᱞᱟᱭᱤᱱ ᱛᱟᱦᱮᱸᱱ ᱞᱟᱹᱠᱛᱤ᱾' },
      { icon: '🔊', title: 'ᱥᱟᱰᱮ / ᱟᱲᱟᱝ ᱵᱟᱝ ᱟᱸᱡᱚᱢᱚᱜ ᱠᱟᱱᱟ', desc: 'ᱰᱤᱵᱷᱟᱭᱤᱥ ᱵᱷᱚᱞᱤᱭᱩᱢ ᱪᱮᱠ ᱢᱮ᱾ ᱡᱩᱫᱤ ᱵᱨᱟᱣᱡᱟᱨ ᱚᱴᱳᱯᱞᱮ ᱮᱴᱠᱮᱴᱚᱬᱮᱭᱟ, ᱛᱚᱵᱮ ᱥᱠᱨᱤᱱ ᱨᱮ ᱢᱤᱫ ᱫᱷᱟᱣ ᱞᱤᱱ ᱢᱮ᱾' },
      { icon: '🌐', title: 'ᱚᱯᱷᱞᱟᱭᱤᱱ ᱢᱳᱰ', desc: 'SurakshaAR ᱫᱚ ᱠᱮᱥ ᱟᱠᱟᱱ ᱢᱳᱰᱩᱞ ᱞᱟᱹᱜᱤᱫ ᱚᱯᱷᱞᱟᱭᱤᱱ ᱠᱟᱹᱢᱤᱭᱟ᱾ ᱤᱱᱴᱟᱨᱱᱮᱴ ᱡᱚᱲᱟᱣ ᱠᱟᱛᱮ ᱫᱚᱦᱲᱟ ᱨᱤᱞᱳᱰ ᱢᱮ᱾' },
    ],
    stillNeedHelp: 'ᱟᱨᱦᱚᱸ ᱜᱚᱲᱚ ᱞᱟᱹᱠᱛᱤ ᱠᱟᱱᱟ? ᱤᱢᱮᱞ ᱢᱮ:',
  },
}

const EMERGENCY_ITEMS = [
  { emoji: '🚒', dept_en: 'Fire Department', dept_hi: 'अग्निशमन विभाग', dept_sat: 'ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡ ᱵᱤᱵᱷᱟᱜᱽ', number: '101', color: '#DC2626' },
  { emoji: '🚑', dept_en: 'Ambulance / Medical', dept_hi: 'एम्बुलेंस / चिकित्सा', dept_sat: 'ᱮᱢᱵᱩᱞᱮᱱᱥ / ᱨᱟᱱ ᱢᱩᱨᱜᱟᱹᱱ', number: '108', color: '#DC2626' },
  { emoji: '🚓', dept_en: 'Police', dept_hi: 'पुलिस', dept_sat: 'ᱯᱩᱞᱤᱥ', number: '100', color: '#1D4ED8' },
  { emoji: '📞', dept_en: 'National Emergency (All)', dept_hi: 'राष्ट्रीय आपातकालीन (समग्र)', dept_sat: 'ᱡᱟᱹᱛᱤᱭᱟᱹᱨᱤ ᱟᱯᱟᱛᱠᱟᱞ (ᱡᱚᱛᱚ)', number: '112', color: '#DC2626' },
  { emoji: '🌊', dept_en: 'Disaster Management (NDMA)', dept_hi: 'आपदा प्रबंधन (NDMA)', dept_sat: 'ᱟᱯᱚᱫᱽ ᱯᱚᱨᱤᱪᱟᱞᱚᱱ (NDMA)', number: '1078', color: '#D97706' },
  { emoji: '☣️', dept_en: 'Chemical Emergency (Toll-Free)', dept_hi: 'रासायनिक आपातकाल (टोल-फ्री)', dept_sat: 'ᱠᱮᱢᱤᱠᱟᱞ ᱟᱯᱟᱛᱠᱟᱞ (ᱴᱳᱞ-ᱯᱷᱨᱤ)', number: '1800-180-4104', color: '#7C3AED' },
  { emoji: '⚡', dept_en: 'Electricity / Power Emergency', dept_hi: 'बिजली आपातकाल', dept_sat: 'ᱵᱤᱡᱽᱞᱤ ᱟᱯᱟᱛᱠᱟᱞ', number: '1912', color: '#D97706' },
  { emoji: '🔥', dept_en: 'Gas / LPG Emergency', dept_hi: 'गैस / एलपीजी आपातकाल', dept_sat: 'ᱜᱮᱥ / LPG ᱟᱯᱟᱛᱠᱟᱞ', number: '1906', color: '#DC2626' },
  { emoji: '🏭', dept_en: 'Industrial Safety Helpline', dept_hi: 'औद्योगिक सुरक्षा हेल्पलाइन', dept_sat: 'ᱠᱟᱹᱨᱜᱟᱲ ᱥᱩᱨᱠᱷᱟ ᱦᱮᱞᱯᱞᱟᱭᱤᱱ', number: '1800-3000-3600', color: '#059669' },
  { emoji: '🏥', dept_en: 'Women Helpline', dept_hi: 'महिला हेल्पलाइन', dept_sat: 'ᱛᱤᱨᱞᱟᱹ ᱦᱮᱞᱯᱞᱟᱭᱤᱱ', number: '1091', color: '#DB2777' },
]

const CONTACT_MODAL_STRINGS = {
  en: {
    emailSupport: 'Email Support',
    respTime: 'Response within 24 hours on working days',
    queriesAbout: 'For Queries About',
    bullets: [
      'Training module issues or bugs',
      'Certificate download problems',
      'Account or login help',
      'Institutional / bulk enrollment',
      'Partnership & collaboration',
    ],
    supportHours: 'Support hours: Mon–Sat, 9 AM – 6 PM IST',
    viewFullPage: 'View Full Contact Page →',
  },
  hi: {
    emailSupport: 'ईमेल सहायता',
    respTime: 'कार्य दिवसों पर 24 घंटे के भीतर उत्तर',
    queriesAbout: 'निम्नलिखित प्रश्नों के लिए',
    bullets: [
      'प्रशिक्षण मॉड्यूल की समस्याएं या त्रुटियां',
      'प्रमाणपत्र डाउनलोड करने में समस्या',
      'खाता या लॉगिन सहायता',
      'संस्थागत / बल्क नामांकन',
      'साझेदारी और सहयोग',
    ],
    supportHours: 'सहायता समय: सोम-शनि, सुबह 9 से शाम 6 बजे IST',
    viewFullPage: 'पूरा संपर्क पृष्ठ देखें →',
  },
  sat: {
    emailSupport: 'ᱤᱢᱮᱞ ᱜᱚᱲᱚ',
    respTime: 'ᱠᱟᱹᱢᱤ ᱢᱟᱦᱟᱸ ᱨᱮ ᱒᱔ ᱴᱟᱲᱟᱝ ᱵᱷᱤᱛᱨᱤ ᱛᱮᱞᱟ',
    queriesAbout: 'ᱱᱚᱶᱟ ᱠᱩᱠᱞᱤ ᱠᱚ ᱞᱟᱹᱜᱤᱫ',
    bullets: [
      'ᱥᱤᱠᱷᱱᱟᱹᱛ ᱢᱳᱰᱩᱞ ᱮᱴᱠᱮᱴᱚᱬᱮ ᱥᱮ ᱵᱟᱜᱽ',
      'ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ ᱰᱟᱣᱩᱱᱞᱳᱰ ᱮᱴᱠᱮᱴᱚᱬᱮ',
      'ᱮᱠᱟᱣᱩᱱᱴ ᱥᱮ ᱞᱚᱜᱤᱱ ᱜᱚᱲᱚ',
      'ᱤᱱᱥᱴᱤᱴᱤᱭᱩᱴ / ᱢᱤᱫ ᱥᱟᱶᱛᱮ ᱮᱱᱨᱳᱞ',
      'ᱥᱟᱶᱛᱮᱱ ᱟᱨ ᱥᱚᱦᱚᱫ',
    ],
    supportHours: 'ᱜᱚᱲᱚ ᱚᱠᱛᱚ: ᱥᱤᱸᱜᱮ-ᱧᱩᱦᱩᱢ, ᱥᱮᱛᱟᱜ ᱙ ᱠᱷᱚᱱ ᱟᱹᱭᱩᱵ ᱖ IST',
    viewFullPage: 'ᱯᱩᱨᱟᱹ ᱡᱚᱯᱲᱟᱣ ᱥᱟᱦᱴᱟ ᱧᱮᱞ ᱢᱮ →',
  },
}

export function Navbar() {
  const { user, profile, signOut } = useAuth()
  const { lang, setLang, T } = useLang()
  const { darkMode, toggleDarkMode, highContrast } = useAccessibility()
  const { isOnline } = useOffline()
  const navigate = useNavigate()
  const location = useLocation()

  const drawerT = DRAWER_STRINGS[lang] ?? DRAWER_STRINGS.en
  const faqList = FAQ_DATA[lang] ?? FAQ_DATA.en
  const helpData = HELP_DATA[lang] ?? HELP_DATA.en
  const contactModal = CONTACT_MODAL_STRINGS[lang] ?? CONTACT_MODAL_STRINGS.en

  // State
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [profileDropOpen, setProfileDropOpen] = useState(false)
  const [showVideoTutorial, setShowVideoTutorial] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [showAboutModal, setShowAboutModal] = useState(false)
  const [showFAQModal, setShowFAQModal] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)
  const [showEmergencyModal, setShowEmergencyModal] = useState(false)
  const [showHelpModal, setShowHelpModal] = useState(false)
  const [readNotifs, setReadNotifs] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('sar_read_notifs') ?? '[]')
    } catch {
      return []
    }
  })
  const [userCerts, setUserCerts] = useState([])

  const notifRef = useRef(null)
  const profileDropRef = useRef(null)

  const isAdmin = profile?.role === 'admin'
  const firstName = profile?.full_name?.split(' ')[0] ?? 'Trainee'

  // Fetch user certs for notification panel
  useEffect(() => {
    if (!user) {
      setUserCerts([])
      return
    }
    async function loadCerts() {
      try {
        if (!isSupabaseConfigured) {
          const all = JSON.parse(localStorage.getItem('mock_certificates') ?? '[]')
          setUserCerts(all.filter(c => c.user_id === user.id))
        } else {
          const { data } = await supabase
            .from('certificates')
            .select('*')
            .eq('user_id', user.id)
            .order('issued_at', { ascending: false })
            .limit(5)
          setUserCerts(data ?? [])
        }
      } catch (err) {
        console.warn('[Navbar] Failed loading certs for notifications:', err)
      }
    }
    loadCerts()
  }, [user, location.pathname])

  // Build notifications list
  const userSecurityNotifs = (() => {
    try {
      return JSON.parse(localStorage.getItem('suraksha_user_notifications') || '[]')
    } catch {
      return []
    }
  })()

  const notifications = [
    ...userSecurityNotifs,
    ...(userCerts.map(c => ({
      id: `cert-${c.id}`,
      type: 'cert',
      title: 'Safety Certificate Issued',
      message: `You earned certification in "${c.course_name}" with a score of ${c.score}%.`,
      date: c.issued_at,
      link: `/certificate/${c.id}`,
    }))),
    {
      id: 'sys-offline-ready',
      type: 'system',
      title: 'Offline Training Active',
      message: 'Fire Safety, Gas Leak, and Confined Space AR modules are cached for offline field drills.',
      date: new Date(Date.now() - 3600000 * 24).toISOString(),
    },
    {
      id: 'sys-compliance-advisory',
      type: 'advisory',
      title: 'Factory Safety Standard IS 2925',
      message: 'Industrial safety compliance protocols updated for high-risk manufacturing and chemical processing.',
      date: new Date(Date.now() - 3600000 * 48).toISOString(),
    },
  ]

  const unreadCount = notifications.filter(n => !readNotifs.includes(n.id)).length

  function markAllNotificationsRead() {
    const allIds = notifications.map(n => n.id)
    setReadNotifs(allIds)
    try {
      localStorage.setItem('sar_read_notifs', JSON.stringify(allIds))
    } catch {}
  }

  // Close drawer and popovers on path change
  useEffect(() => {
    setDrawerOpen(false)
    setNotifOpen(false)
    setProfileDropOpen(false)
  }, [location.pathname])

  // Close on Escape
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setDrawerOpen(false)
        setNotifOpen(false)
        setProfileDropOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Close notification popover on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false)
      }
    }
    if (notifOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [notifOpen])

  // Close profile dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (profileDropRef.current && !profileDropRef.current.contains(e.target)) {
        setProfileDropOpen(false)
      }
    }
    if (profileDropOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [profileDropOpen])

  // Lock body scroll when drawer is open on mobile
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [drawerOpen])

  async function handleSignOut() {
    setDrawerOpen(false)
    await signOut()
    navigate('/login')
  }

  function handleNavigate(path) {
    setDrawerOpen(false)
    navigate(path)
  }

  function handleTrainingModulesClick() {
    setDrawerOpen(false)
    if (location.pathname === '/dashboard') {
      const el = document.getElementById('modules') || document.querySelector('[data-section="modules"]')
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
        return
      }
    }
    navigate('/dashboard#modules')
  }

  return (
    <>
      {/* ── Main Navigation Bar ── */}
      <header
        role="banner"
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0,
          height: 'var(--navbar-height)',
          background: 'var(--color-surface)',
          borderBottom: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-sm)',
          zIndex: 'var(--z-dropdown)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 clamp(12px, 3vw, 20px)',
          boxSizing: 'border-box',
          transition: 'background var(--transition-fast), border-color var(--transition-fast)',
        }}
      >
        <div style={{
          maxWidth: 1100,
          margin: '0 auto',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          {/* Left: Hamburger Button + Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(8px, 2vw, 12px)' }}>
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={drawerOpen}
              style={{
                width: 38,
                height: 38,
                boxSizing: 'border-box',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--color-surface-alt)',
                border: '1.5px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                color: 'var(--color-text-primary)',
                padding: 0,
                flexShrink: 0,
                transition: 'all var(--transition-fast)',
              }}
            >
              <Menu size={20} />
            </button>

            <Link
              to={user ? (isAdmin ? '/admin' : '/dashboard') : '/landing'}
              style={{
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <img
                src={`${import.meta.env.BASE_URL}images/surakshaar-logo.png`}
                alt="SurakshaAR"
                style={{ height: 38, maxWidth: '100%', width: 'auto', objectFit: 'contain', display: 'block' }}
              />
              {isAdmin && (
                <span className="badge badge-brand" style={{ fontSize: '0.65rem', marginLeft: 4 }}>ADMIN</span>
              )}
            </Link>
          </div>

          {/* Right: Offline status + Notifications Bell + Profile / Login */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(6px, 1.8vw, 10px)' }}>
            {/* Offline badge */}
            {!isOnline && (
              <div
                title="Working in offline mode"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '4px 8px',
                  background: 'var(--color-warning-bg)',
                  border: '1px solid var(--color-warning-border)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: 'var(--color-warning)',
                }}
              >
                <WifiOff size={12} />
                <span className="mobile-hide">OFFLINE</span>
              </div>
            )}

            {/* 🛡️ Safety Tips Icon (Navigates directly to dedicated /safety-tips page in same tab) */}
            <button
              type="button"
              className="hide-on-compact"
              onClick={() => {
                setNotifOpen(false)
                setProfileDropOpen(false)
                navigate('/safety-tips')
              }}
              title="Safety Tips"
              aria-label="Safety Tips"
              style={{
                width: 38,
                height: 38,
                boxSizing: 'border-box',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: location.pathname === '/safety-tips' ? 'var(--color-brand-50)' : 'var(--color-surface-alt)',
                border: location.pathname === '/safety-tips' ? '1.5px solid var(--color-brand)' : '1.5px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                color: location.pathname === '/safety-tips' ? 'var(--color-brand)' : 'var(--color-text-secondary)',
                padding: 0,
                flexShrink: 0,
                position: 'relative',
                transition: 'all var(--transition-fast)',
              }}
            >
              <ShieldCheck size={19} color="var(--color-brand)" />
            </button>

            {/* Notification Bell */}
            <div style={{ position: 'relative' }} ref={notifRef}>
              <button
                type="button"
                onClick={() => {
                  setNotifOpen(o => !o)
                  setProfileDropOpen(false)
                }}
                aria-label="View notifications"
                aria-expanded={notifOpen}
                style={{
                  width: 38,
                  height: 38,
                  boxSizing: 'border-box',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: notifOpen ? 'var(--color-brand-50)' : 'var(--color-surface-alt)',
                  border: notifOpen ? '1.5px solid var(--color-brand)' : '1.5px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  color: notifOpen ? 'var(--color-brand)' : 'var(--color-text-secondary)',
                  padding: 0,
                  flexShrink: 0,
                  position: 'relative',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      width: 16,
                      height: 16,
                      background: 'var(--color-brand)',
                      color: '#FFFFFF',
                      borderRadius: '50%',
                      fontSize: '0.62rem',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px solid var(--color-surface)',
                    }}
                  >
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown Panel */}
              {notifOpen && (
                <div className="notif-dropdown">
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    background: 'var(--color-surface-alt)',
                    borderBottom: '1px solid var(--color-border)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Bell size={15} color="var(--color-brand)" />
                      <span style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                        {drawerT.notifications}
                      </span>
                      {unreadCount > 0 && (
                        <span className="badge badge-brand" style={{ fontSize: '0.65rem', padding: '2px 6px' }}>
                          {unreadCount} {drawerT.newBadge}
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={markAllNotificationsRead}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--color-brand)',
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          padding: 0,
                        }}
                      >
                        {drawerT.markAllRead}
                      </button>
                    )}
                  </div>

                  <div style={{
                    maxHeight: 340,
                    overflowY: 'auto',
                    padding: '8px 0',
                    display: 'flex',
                    flexDirection: 'column',
                  }}>
                    {notifications.length === 0 ? (
                      <div style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)' }}>
                        {drawerT.noNewNotifications}
                      </div>
                    ) : (
                      notifications.map(n => {
                        const isUnread = !readNotifs.includes(n.id)
                        return (
                          <div
                            key={n.id}
                            onClick={() => {
                              if (n.link) {
                                setNotifOpen(false)
                                navigate(n.link)
                              }
                            }}
                            style={{
                              padding: '10px 16px',
                              borderBottom: '1px solid var(--color-border)',
                              background: isUnread ? 'var(--color-brand-50)' : 'transparent',
                              cursor: n.link ? 'pointer' : 'default',
                              display: 'flex',
                              gap: 10,
                              alignItems: 'flex-start',
                              transition: 'background var(--transition-fast)',
                            }}
                          >
                            <div style={{ marginTop: 2, flexShrink: 0 }}>
                              {n.type === 'cert' && <Award size={16} color="var(--color-success)" />}
                              {n.type === 'system' && <ShieldCheck size={16} color="var(--color-brand)" />}
                              {n.type === 'security' && <ShieldCheck size={16} color="#4285F4" />}
                              {n.type === 'advisory' && <AlertTriangle size={16} color="var(--color-warning)" />}
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{
                                fontSize: 'var(--text-xs)',
                                fontWeight: isUnread ? 700 : 600,
                                color: 'var(--color-text-primary)',
                                marginBottom: 2,
                              }}>
                                {n.title}
                              </div>
                              <div style={{
                                fontSize: '0.75rem',
                                color: 'var(--color-text-secondary)',
                                lineHeight: 1.4,
                              }}>
                                {n.message}
                              </div>
                              {n.link && (
                                <span style={{
                                  display: 'inline-block',
                                  marginTop: 4,
                                  fontSize: '0.7rem',
                                  fontWeight: 600,
                                  color: 'var(--color-brand)',
                                }}>
                                  View credential →
                                </span>
                              )}
                            </div>
                            {isUnread && (
                              <div style={{
                                width: 7,
                                height: 7,
                                borderRadius: '50%',
                                background: 'var(--color-brand)',
                                marginTop: 6,
                                flexShrink: 0,
                              }} />
                            )}
                          </div>
                        )
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Trainee profile or login button */}
            {user ? (
              <div style={{ position: 'relative' }} ref={profileDropRef}>
                <button
                  type="button"
                  className="profile-btn-pill"
                  onClick={() => {
                    setProfileDropOpen(o => !o)
                    setNotifOpen(false)
                  }}
                  title="Profile & Account"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    background: profileDropOpen ? 'var(--color-brand-50)' : 'var(--color-surface-alt)',
                    border: `1.5px solid ${profileDropOpen ? 'var(--color-brand)' : 'var(--color-border)'}`,
                    borderRadius: 'var(--radius-md)',
                    height: 38,
                    padding: '0 10px',
                    boxSizing: 'border-box',
                    cursor: 'pointer',
                    flexShrink: 0,
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  <UserAvatar user={user} profile={profile} size={26} />
                  <span
                    className="profile-name-text"
                    style={{
                      fontSize: 'var(--text-sm)', fontWeight: 600,
                      color: 'var(--color-text-primary)',
                      maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}
                  >
                    {firstName}
                  </span>
                  <ChevronDown
                    size={13}
                    color="var(--color-text-muted)"
                    className="profile-chevron"
                    style={{ transform: profileDropOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
                  />
                </button>

                {/* Profile Dropdown */}
                {profileDropOpen && (
                  <div style={{
                    position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                    width: 220,
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-lg, 14px)',
                    boxShadow: 'var(--shadow-xl)',
                    zIndex: 400,
                    overflow: 'hidden',
                    animation: 'slideDownFade 0.15s ease-out',
                  }}>
                    {/* User info */}
                    <div style={{
                      padding: '12px 14px',
                      borderBottom: '1px solid var(--color-border)',
                      background: 'var(--color-surface-alt)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                    }}>
                      <UserAvatar user={user} profile={profile} size={36} />
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {profile?.full_name || drawerT.traineeOfficer}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {user?.email}
                        </div>
                      </div>
                    </div>

                    {/* View Profile */}
                    <button
                      type="button"
                      onClick={() => { setProfileDropOpen(false); navigate('/profile') }}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                        padding: '11px 14px', background: 'transparent', border: 'none',
                        cursor: 'pointer', fontSize: 'var(--text-sm)', fontWeight: 600,
                        color: 'var(--color-text-primary)', textAlign: 'left',
                        transition: 'background var(--transition-fast)',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--color-surface-alt)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <User size={15} color="var(--color-brand)" />
                      {drawerT.viewProfile}
                    </button>

                    {/* Sign Out */}
                    <button
                      type="button"
                      onClick={() => { setProfileDropOpen(false); handleSignOut() }}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                        padding: '11px 14px',
                        background: 'transparent',
                        border: 'none',
                        borderTop: '1px solid var(--color-border)',
                        cursor: 'pointer', fontSize: 'var(--text-sm)', fontWeight: 600,
                        color: 'var(--color-error)', textAlign: 'left',
                        transition: 'background var(--transition-fast)',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--color-error-bg)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <LogOut size={15} />
                      {drawerT.signOut}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn btn-primary btn-sm" style={{ height: 38 }}>
                {T('login')}
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* ── Slide-Out Responsive Navigation Drawer ── */}
      {drawerOpen && (
        <div
          role="presentation"
          onClick={() => setDrawerOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.55)',
            backdropFilter: 'blur(3px)',
            zIndex: 9998,
            transition: 'opacity 0.25s ease',
          }}
        />
      )}

      <aside
        aria-label="Main Navigation Drawer"
        aria-hidden={!drawerOpen}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: 320,
          maxWidth: '85vw',
          height: '100vh',
          background: 'var(--color-surface)',
          borderRight: '1px solid var(--color-border)',
          boxShadow: drawerOpen ? 'var(--shadow-xl)' : 'none',
          zIndex: 9999,
          transform: drawerOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
          overflow: 'hidden',
        }}
      >
        {/* Drawer Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--color-surface-alt)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img
              src={`${import.meta.env.BASE_URL}images/surakshaar-logo.png`}
              alt="SurakshaAR"
              style={{ height: 36, width: 'auto', objectFit: 'contain' }}
            />
          </div>
          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close navigation menu"
            style={{
              width: 34,
              height: 34,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'transparent',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-text-secondary)',
              cursor: 'pointer',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* User Card if Authenticated */}
        {user && (
          <div style={{
            padding: '14px 20px',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            background: 'var(--color-surface)',
          }}>
            <UserAvatar user={user} profile={profile} size={40} />
            <div style={{ overflow: 'hidden' }}>
              <div style={{
                fontSize: 'var(--text-sm)',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                {profile?.full_name || drawerT.traineeOfficer}
              </div>
              <div style={{
                fontSize: '0.72rem',
                color: 'var(--color-text-muted)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                {user.email}
              </div>
            </div>
          </div>
        )}

        {/* Navigation Items (Scrollable Body) */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '12px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}>
          {/* 🏠 Home */}
          <button
            type="button"
            onClick={() => handleNavigate('/landing')}
            style={navItemStyle(location.pathname === '/landing')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Home size={18} color="var(--color-brand)" />
              <span>{drawerT.home}</span>
            </div>
            <ChevronRight size={14} color="var(--color-text-muted)" />
          </button>

          {/* 📊 Dashboard */}
          <button
            type="button"
            onClick={() => handleNavigate(user ? (isAdmin ? '/admin' : '/dashboard') : '/login')}
            style={navItemStyle(location.pathname === '/dashboard' || location.pathname === '/admin')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <LayoutDashboard size={18} color="#0284C7" />
              <span>{isAdmin ? drawerT.adminDashboard : drawerT.dashboard}</span>
            </div>
            <ChevronRight size={14} color="var(--color-text-muted)" />
          </button>

          {/* 🏆 My Certificates */}
          <button
            type="button"
            onClick={() => handleNavigate(user ? '/my-certificates' : '/login')}
            style={navItemStyle(location.pathname === '/my-certificates')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Award size={18} color="#D97706" />
              <span>{drawerT.myCertificates}</span>
            </div>
            {userCerts.length > 0 && (
              <span className="badge badge-success" style={{ fontSize: '0.68rem', padding: '2px 6px' }}>
                {userCerts.length}
              </span>
            )}
            <ChevronRight size={14} color="var(--color-text-muted)" />
          </button>

          {/* ▶ Tutorial / How It Works */}
          <button
            type="button"
            onClick={() => {
              setDrawerOpen(false)
              setShowVideoTutorial(true)
            }}
            style={navItemStyle(false)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <PlayCircle size={18} color="#8B5CF6" />
              <span>{drawerT.tutorial}</span>
            </div>
            <ChevronRight size={14} color="var(--color-text-muted)" />
          </button>

          {/* ℹ About SurakshaAR */}
          <button type="button" onClick={() => { setDrawerOpen(false); setShowAboutModal(true) }} style={navItemStyle(false)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><Info size={18} color="#0284C7" /><span>{drawerT.about}</span></div>
            <ChevronRight size={14} color="var(--color-text-muted)" />
          </button>

          {/* ❓ FAQ */}
          <button type="button" onClick={() => { setDrawerOpen(false); setShowFAQModal(true) }} style={navItemStyle(false)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><HelpCircle size={18} color="#8B5CF6" /><span>{drawerT.faq}</span></div>
            <ChevronRight size={14} color="var(--color-text-muted)" />
          </button>

          {/* 📧 Contact Us */}
          <button type="button" onClick={() => { setDrawerOpen(false); setShowContactModal(true) }} style={navItemStyle(false)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><Mail size={18} color="#059669" /><span>{drawerT.contactUs}</span></div>
            <ChevronRight size={14} color="var(--color-text-muted)" />
          </button>

          {/* 🚨 Emergency Numbers */}
          <button type="button" onClick={() => { setDrawerOpen(false); setShowEmergencyModal(true) }} style={navItemStyle(false)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><Phone size={18} color="#DC2626" /><span>{drawerT.emergencyNumbers}</span></div>
            <ChevronRight size={14} color="var(--color-text-muted)" />
          </button>

          {/* 🆘 Help & Support */}
          <button type="button" onClick={() => { setDrawerOpen(false); setShowHelpModal(true) }} style={navItemStyle(false)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><LifeBuoy size={18} color="#F59E0B" /><span>{drawerT.helpSupport}</span></div>
            <ChevronRight size={14} color="var(--color-text-muted)" />
          </button>

          {/* ⚙ Settings */}
          <button
            type="button"
            onClick={() => {
              setDrawerOpen(false)
              if (user) {
                navigate('/profile')
              } else {
                setShowSettingsModal(true)
              }
            }}
            style={navItemStyle(location.pathname === '/profile')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Settings size={18} color="#64748B" />
              <span>{drawerT.settings}</span>
            </div>
            <ChevronRight size={14} color="var(--color-text-muted)" />
          </button>
        </div>

        {/* ── Drawer Bottom Controls ── */}
        <div style={{
          borderTop: '1px solid var(--color-border)',
          padding: '14px 18px',
          background: 'var(--color-surface-alt)',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}>
          {/* 🌐 Language Switcher */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: '0.72rem',
              fontWeight: 700,
              color: 'var(--color-text-muted)',
              marginBottom: 6,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}>
              <Globe size={13} />
              <span>{drawerT.language}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
              {SUPPORTED_LANGUAGES.map(l => {
                const isActive = lang === l.code
                return (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => setLang(l.code)}
                    style={{
                      padding: '6px 4px',
                      background: isActive ? 'var(--color-brand)' : 'var(--color-surface)',
                      color: isActive ? '#FFFFFF' : 'var(--color-text-primary)',
                      border: '1px solid',
                      borderColor: isActive ? 'var(--color-brand)' : 'var(--color-border)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.75rem',
                      fontWeight: isActive ? 700 : 500,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 4,
                      transition: 'all var(--transition-fast)',
                    }}
                  >
                    <span>{l.flag}</span>
                    <span>{l.nativeLabel}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* ◐ Dark Mode Toggle */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '4px 0',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {darkMode ? (
                <Moon size={16} color="var(--color-brand)" />
              ) : (
                <Sun size={16} color="var(--color-brand)" />
              )}
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                {drawerT.darkMode}
              </span>
            </div>

            {/* Modern Toggle Switch */}
            <button
              type="button"
              role="switch"
              aria-checked={darkMode}
              onClick={toggleDarkMode}
              style={{
                width: 44,
                height: 24,
                borderRadius: 12,
                background: darkMode ? 'var(--color-brand)' : 'var(--color-border-strong, #ccc)',
                border: 'none',
                position: 'relative',
                cursor: 'pointer',
                padding: 2,
                transition: 'background 0.2s ease',
              }}
            >
              <div style={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: '#FFFFFF',
                boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                transform: darkMode ? 'translateX(20px)' : 'translateX(0)',
                transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              }} />
            </button>
          </div>

          {/* 🚪 Logout (if logged in) */}
          {user ? (
            <button
              type="button"
              onClick={handleSignOut}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '9px 12px',
                background: 'var(--color-error-bg)',
                border: '1px solid var(--color-error-border)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-error)',
                fontSize: 'var(--text-xs)',
                fontWeight: 700,
                cursor: 'pointer',
                marginTop: 2,
              }}
            >
              <LogOut size={15} />
              <span>{drawerT.signOut}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleNavigate('/login')}
              className="btn btn-primary btn-sm btn-full"
            >
              <span>{drawerT.signIn}</span>
            </button>
          )}

          {/* App Version — Central at very bottom */}
          <div style={{
            textAlign: 'center',
            fontSize: '0.7rem',
            color: 'var(--color-text-muted)',
            paddingTop: 4,
            fontWeight: 500,
            letterSpacing: '0.02em',
          }}>
            {APP_NAME} {APP_VERSION}
          </div>
        </div>
      </aside>

      {/* Video Tutorial Modal */}
      <VideoTutorialModal
        isOpen={showVideoTutorial}
        onClose={() => setShowVideoTutorial(false)}
      />

      {/* Settings Modal (Unauthenticated fallback) */}
      {showSettingsModal && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0, 0, 0, 0.65)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 16, boxSizing: 'border-box',
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowSettingsModal(false) }}
        >
          <div style={{
            background: 'var(--color-surface)',
            borderRadius: 'var(--radius-lg, 16px)',
            width: '100%', maxWidth: 440,
            overflow: 'hidden',
            boxShadow: 'var(--shadow-xl)',
            border: '1px solid var(--color-border)',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '14px 18px', borderBottom: '1px solid var(--color-border)',
              background: 'var(--color-surface-alt)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700 }}>
                <Settings size={18} color="#64748B" />
                <span>{drawerT.settings}</span>
              </div>
              <button
                type="button"
                onClick={() => setShowSettingsModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
              >
                <X size={18} />
              </button>
            </div>
            <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                {lang === 'hi'
                  ? 'भाषा और डार्क मोड जैसी प्राथमिकताएं नेविगेशन मेन्यू के नीचे से सीधे बदली जा सकती हैं।'
                  : lang === 'sat'
                  ? 'ᱯᱟᱹᱨᱥᱤ ᱟᱨ ᱰᱟᱨᱠ ᱢᱳᱰ ᱞᱮᱠᱟᱱ ᱥᱮᱴᱤᱝᱥ ᱫᱚ ᱢᱮᱱᱩ ᱨᱮᱱᱟᱜ ᱞᱟᱛᱟᱨ ᱠᱷᱚᱱ ᱥᱚᱡᱷᱮ ᱵᱚᱫᱚᱞ ᱫᱟᱲᱮᱭᱟᱜᱼᱟ᱾'
                  : 'Preferences like Language and Dark Mode can be toggled directly at the bottom of the navigation drawer.'}
              </p>
              <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                {lang === 'hi'
                  ? 'अपनी व्यक्तिगत प्रोफ़ाइल, विभाग और कार्यस्थल की प्राथमिकताओं को कॉन्फ़िगर करने के लिए अपने खाते में साइन इन करें।'
                  : lang === 'sat'
                  ? 'ᱟᱢᱟᱜ ᱱᱤᱡᱮᱨᱟᱜ ᱯᱨᱳᱯᱷᱟᱭᱤᱞ, ᱵᱤᱵᱷᱟᱜᱽ ᱟᱨ ᱠᱟᱹᱢᱤ ᱴᱷᱟᱶ ᱥᱮᱴᱤᱝ ᱞᱟᱹᱜᱤᱫ ᱥᱟᱭᱤᱱ ᱤᱱ ᱢᱮ᱾'
                  : 'Sign in to your trainee account to configure your personal profile, department, and site location preferences.'}
              </p>
              <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                <button
                  type="button"
                  className="btn btn-primary btn-sm btn-full"
                  onClick={() => { setShowSettingsModal(false); navigate('/login') }}
                >
                  {drawerT.signIn}
                </button>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm btn-full"
                  onClick={() => setShowSettingsModal(false)}
                >
                  {drawerT.close}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Helper: reusable modal wrapper ── */}
      {[
        {
          key: 'about', show: showAboutModal, onClose: () => setShowAboutModal(false),
          icon: <Info size={18} color="#0284C7" />, title: drawerT.about,
          body: (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <img src={`${import.meta.env.BASE_URL}images/surakshaar-logo.png`} alt="SurakshaAR" style={{ height: 52, objectFit: 'contain' }} />
              </div>
              <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
                {lang === 'hi'
                  ? <><strong>SurakshaAR</strong> एक AI-संचालित <strong>ऑगमेंटेड रियलिटी औद्योगिक सुरक्षा प्रशिक्षण मंच</strong> है जो SIH 2026 (समस्या विवरण SIH26041) के लिए विकसित किया गया है।</>
                  : lang === 'sat'
                  ? <><strong>SurakshaAR</strong> ᱫᱚ SIH 2026 (Problem Statement SIH26041) ᱞᱟᱹᱜᱤᱫ ᱵᱮᱱᱟᱣ ᱟᱠᱟᱱ AI-ᱪᱟᱹᱞᱩ <strong>Augmented Reality ᱠᱟᱹᱨᱜᱟᱲ ᱥᱩᱨᱠᱷᱟ ᱥᱤᱠᱷᱱᱟᱹᱛ ᱯᱞᱮᱴᱯᱷᱚᱨᱢ</strong> ᱠᱟᱱᱟ᱾</>
                  : <><strong>SurakshaAR</strong> is an AI-powered <strong>Augmented Reality Industrial Safety Training Platform</strong> built for SIH 2026 (Problem Statement SIH26041).</>}
              </p>
              <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
                {lang === 'hi'
                  ? 'यह आग के खतरे, गैस रिसाव, विद्युत सुरक्षा आदि के लिए इमर्सिव AR-आधारित परिदृश्य प्रशिक्षण प्रदान करता है - जिससे औद्योगिक श्रमिकों को सुरक्षित वातावरण में वास्तविक कौशल विकसित करने में मदद मिलती है।'
                  : lang === 'sat'
                  ? 'ᱱᱚᱶᱟ ᱫᱚ ᱥᱮᱸᱜᱮᱞ ᱵᱚᱛᱚᱨ, ᱜᱮᱥ ᱞᱤᱠ, ᱵᱤᱡᱽᱞᱤ ᱥᱩᱨᱠᱷᱟ ᱮᱢᱟᱱ ᱞᱟᱹᱜᱤᱫ AR ᱥᱤᱠᱷᱱᱟᱹᱛ ᱮᱢᱚᱜᱼᱟ — ᱡᱟᱦᱟᱸ ᱛᱮ ᱠᱟᱹᱢᱤᱭᱟᱹ ᱠᱚ ᱥᱩᱨᱠᱷᱤᱛ ᱛᱮ ᱥᱟᱹᱨᱤ ᱦᱩᱱᱟᱹᱨ ᱠᱚ ᱥᱮᱬᱟᱭᱟ᱾'
                  : 'It provides immersive AR-based scenario training for fire hazards, gas leaks, electrical safety, and more — helping industrial workers build real reflexes in a safe, gamified environment.'}
              </p>
              <div style={{ background: 'var(--color-surface-alt)', borderRadius: 10, padding: '12px 14px', fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                🏆 Smart India Hackathon 2026 &nbsp;|&nbsp; SIH26041<br />
                🛡️ {lang === 'hi' ? 'WebXR + AR Foundation द्वारा औद्योगिक सुरक्षा प्रशिक्षण' : lang === 'sat' ? 'WebXR + AR Foundation ᱦᱚᱛᱮᱛᱮ ᱠᱟᱹᱨᱜᱟᱲ ᱥᱩᱨᱠᱷᱟ ᱥᱤᱠᱷᱱᱟᱹᱛ' : 'Industrial Safety Training via WebXR + AR Foundation'}<br />
                🌐 {lang === 'hi' ? 'त्रिभाषी: अंग्रेजी, हिंदी, संथाली (ᱥᱟᱱᱛᱟᱲᱤ)' : lang === 'sat' ? 'ᱯᱮᱭᱟ ᱯᱟᱹᱨᱥᱤ: English, Hindi, ᱥᱟᱱᱛᱟᱲᱤ' : 'Multilingual: English, Hindi, Santali (ᱥᱟᱱᱛᱟᱲᱤ)'}
              </div>
              <button
                type="button"
                className="btn btn-ghost btn-sm btn-full"
                onClick={() => { setShowAboutModal(false); navigate('/about') }}
                style={{ marginTop: 4, fontSize: '0.8rem' }}
              >
                {lang === 'hi' ? 'पूरा परिचय पृष्ठ देखें →' : lang === 'sat' ? 'ᱯᱩᱨᱟᱹ ᱵᱟᱵᱚᱛ ᱥᱟᱦᱴᱟ ᱧᱮᱞ ᱢᱮ →' : 'View Full About Page →'}
              </button>
            </div>
          ),
        },
        {
          key: 'faq', show: showFAQModal, onClose: () => setShowFAQModal(false),
          icon: <HelpCircle size={18} color="#8B5CF6" />, title: drawerT.faq,
          body: (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {faqList.map(({ q, a }, i) => (
                <div key={i} style={{ borderBottom: i < faqList.length - 1 ? '1px solid var(--color-border)' : 'none', paddingBottom: i < faqList.length - 1 ? 12 : 0 }}>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 4 }}>Q: {q}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>A: {a}</div>
                </div>
              ))}
            </div>
          ),
        },
        {
          key: 'contact', show: showContactModal, onClose: () => setShowContactModal(false),
          icon: <Mail size={18} color="#059669" />, title: drawerT.contactUs,
          body: (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ background: 'var(--color-surface-alt)', borderRadius: 12, padding: '14px 16px' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>📧 {contactModal.emailSupport}</div>
                <a href="mailto:surakshaar.in@gmail.com" style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-brand)', textDecoration: 'none' }}>
                  surakshaar.in@gmail.com
                </a>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 4 }}>{contactModal.respTime}</div>
              </div>
              <div style={{ background: 'var(--color-surface-alt)', borderRadius: 12, padding: '14px 16px' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>📋 {contactModal.queriesAbout}</div>
                <ul style={{ margin: 0, padding: '0 0 0 16px', fontSize: '0.8rem', color: 'var(--color-text-secondary)', lineHeight: 2 }}>
                  {contactModal.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>
              <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                🕐 {contactModal.supportHours}
              </div>
              <button
                type="button"
                className="btn btn-ghost btn-sm btn-full"
                onClick={() => { setShowContactModal(false); navigate('/contact') }}
                style={{ marginTop: 4, fontSize: '0.8rem' }}
              >
                {contactModal.viewFullPage}
              </button>
            </div>
          ),
        },
        {
          key: 'emergency', show: showEmergencyModal, onClose: () => setShowEmergencyModal(false),
          icon: <Phone size={18} color="#DC2626" />, title: drawerT.emergencyNumbers,
          body: (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: 4 }}>
                {lang === 'hi'
                  ? 'इन नंबरों को सहेजें। वास्तविक आपात स्थिति में तुरंत कॉल करें - देरी न करें।'
                  : lang === 'sat'
                  ? 'ᱱᱚᱶᱟ ᱮᱞ ᱠᱚ ᱥᱟᱧᱪᱟᱣ ᱢᱮ᱾ ᱥᱟᱹᱨᱤ ᱟᱯᱟᱛ ᱚᱠᱛᱚ ᱨᱮ ᱞᱚᱜᱚᱱ ᱠᱚᱞ ᱢᱮ - ᱟᱞᱚᱢ ᱵᱤᱞᱚᱢᱟ᱾'
                  : 'Save these numbers. In a real emergency, call immediately — do not delay.'}
              </div>
              {EMERGENCY_ITEMS.map(({ emoji, dept_en, dept_hi, dept_sat, number, color }) => {
                const dept = lang === 'hi' ? dept_hi : lang === 'sat' ? dept_sat : dept_en
                return (
                  <div key={number} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    background: 'var(--color-surface-alt)', borderRadius: 10, padding: '10px 14px',
                    border: '1px solid var(--color-border)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 18 }}>{emoji}</span>
                      <div>
                        <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>{dept}</div>
                      </div>
                    </div>
                    <a href={`tel:${number.replace(/-/g, '')}`} style={{ fontSize: '1rem', fontWeight: 800, color, textDecoration: 'none', letterSpacing: '0.03em' }}>
                      {number}
                    </a>
                  </div>
                )
              })}
            </div>
          ),
        },
        {
          key: 'help', show: showHelpModal, onClose: () => setShowHelpModal(false),
          icon: <LifeBuoy size={18} color="#F59E0B" />, title: drawerT.helpSupport,
          body: (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {helpData.items.map(({ icon, title, desc }) => (
                <div key={title} style={{ display: 'flex', gap: 12, paddingBottom: 12, borderBottom: '1px solid var(--color-border)' }}>
                  <span style={{ fontSize: 22, flexShrink: 0 }}>{icon}</span>
                  <div>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 4 }}>{title}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{desc}</div>
                  </div>
                </div>
              ))}
              <div style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                {helpData.stillNeedHelp}{' '}
                <a href="mailto:surakshaar.in@gmail.com" style={{ color: 'var(--color-brand)', fontWeight: 700 }}>surakshaar.in@gmail.com</a>
              </div>
            </div>
          ),
        },
      ].map(({ key, show, onClose, icon, title, body }) => show && (
        <div key={key} role="dialog" aria-modal="true" style={{
          position: 'fixed', inset: 0, zIndex: 10000,
          background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 16, boxSizing: 'border-box',
        }} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
          <div style={{
            background: 'var(--color-surface)', borderRadius: 'var(--radius-lg, 16px)',
            width: '100%', maxWidth: 460, maxHeight: '85vh',
            overflow: 'hidden', display: 'flex', flexDirection: 'column',
            boxShadow: 'var(--shadow-xl)', border: '1px solid var(--color-border)',
          }}>
            {/* Modal Header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '14px 18px', borderBottom: '1px solid var(--color-border)',
              background: 'var(--color-surface-alt)', flexShrink: 0,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)' }}>
                {icon} {title}
              </div>
              <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center' }}>
                <X size={18} />
              </button>
            </div>
            {/* Modal Body */}
            <div style={{ padding: '18px 18px', overflowY: 'auto', flex: 1 }}>
              {body}
            </div>
          </div>
        </div>
      ))}

    </>
  )
}

function navItemStyle(active) {
  return {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: '12px 14px',
    background: active ? 'var(--color-brand-50)' : 'transparent',
    border: 'none',
    borderRadius: 'var(--radius-md)',
    cursor: 'pointer',
    fontSize: 'var(--text-sm)',
    fontWeight: active ? 700 : 500,
    color: active ? 'var(--color-brand)' : 'var(--color-text-primary)',
    textAlign: 'left',
    transition: 'background var(--transition-fast)',
  }
}
