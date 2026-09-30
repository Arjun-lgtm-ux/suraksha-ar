/**
 * SurakshaAR — Internationalization (i18n)
 * Supported languages: en (English), hi (Hindi), sat (Santali/Ol Chiki)
 * 
 * IMPORTANT: All safety-critical assessment content is stored in the
 * database with pre-verified translations — not auto-translated.
 * Only static UI strings live here.
 */

export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English', nativeLabel: 'English', flag: '🇬🇧' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिंदी', flag: '🇮🇳' },
  { code: 'sat', label: 'Santali', nativeLabel: 'ᱥᱟᱱᱛᱟᱲᱤ', flag: '🌿' },
]

export const LANG_FONT = {
  en: "'Inter', 'Segoe UI', sans-serif",
  hi: "'Noto Sans Devanagari', 'Mangal', sans-serif",
  sat: "'Noto Sans Ol Chiki', sans-serif",
}

export const LANG_TTS = {
  en: 'en-IN',
  hi: 'hi-IN',
  sat: 'hi-IN', // Phonetic speech enabled via regional Indian TTS
}

/** All static UI strings by language */
export const t = {
  en: {
    // Navigation
    appName: 'SurakshaAR',
    tagline: 'Immersive Training for a Safer Bharat.',
    home: 'Home',
    dashboard: 'Dashboard',
    profile: 'Profile',
    logout: 'Logout',
    login: 'Login',
    register: 'Register',
    highContrast: 'High Contrast',
    voice: 'Voice',

    // Landing
    heroHeading: 'Learn Safety. Practice Safely.',
    heroSubtitle: 'Experience real industrial safety situations through immersive AR training — without facing real-world danger.',
    startARTraining: 'Start AR Training',
    exploreTraining: 'Explore Training',
    howItWorks: 'How SurakshaAR Works',
    learnHowToUse: 'Learn How to Use SurakshaAR',
    learnHowToUseSubtitle: 'Watch our complete video walkthrough to learn how to navigate the dashboard, interact with the safety assistant, scan hazards in AR, and earn verified certification.',
    videoTutorial: 'Video Tutorial',
    howToUse: 'How to Use?',
    watchTutorial: 'Watch Video Walkthrough',
    step_learn: 'Learn',
    step_experience: 'Experience',
    step_act: 'Act',
    step_assess: 'Assess',
    step_improve: 'Improve',
    step_certify: 'Certify',
    step_learn_desc: 'Understand safety protocols before entering the AR environment.',
    step_experience_desc: 'See real hazards in your surroundings through your device camera.',
    step_act_desc: 'Perform correct safety actions in the right sequence.',
    step_assess_desc: 'Answer safety questions to test your knowledge.',
    step_improve_desc: 'Get detailed feedback and retry to improve your score.',
    step_certify_desc: 'Earn a digitally-verified certificate with QR code.',

    // Auth
    fullName: 'Full Name',
    email: 'Email Address',
    mobile: 'Mobile Number',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    preferredLanguage: 'Preferred Language',
    showPassword: 'Show password',
    hidePassword: 'Hide password',
    forgotPassword: 'Forgot password?',
    createAccount: 'Create Account',
    signIn: 'Sign In',
    alreadyHaveAccount: 'Already have an account?',
    orLoginWith: 'or sign in with',
    continueWithGoogle: 'Continue with Google / Gmail',
    signInWithGoogle: 'Sign in with Google / Gmail',
    orRegisterWith: 'or register with email & password',

    // Dashboard
    goodMorning: 'Good morning',
    goodAfternoon: 'Good afternoon',
    goodEvening: 'Good evening',
    continueTraining: 'Continue Your Training',
    trainingModules: 'Training Modules',
    recentSessions: 'Recent Sessions',
    safetyReadiness: 'Safety Readiness',
    sessionsCompleted: 'Sessions Completed',
    modulesAvailable: 'Modules Available',
    lastTrained: 'Last Trained',
    startTraining: 'Start Training',
    retryScenario: 'Retry Scenario',
    noSessionsYet: 'No completed sessions yet.',
    noScenariosYet: 'No training modules available. Contact your admin.',
    selectModuleSubtitle: 'Select a safety module to begin AR training',
    steps: 'steps',
    benchmark: 'Benchmark',
    bestScore: 'Best',

    // Tutorial
    howItWorksTitle: 'How It Works',
    tutorialBack: 'Back',
    tutorialNext: 'Next',
    skipTutorial: 'Skip Tutorial',
    listen: 'Listen',
    stepOf: 'Step {0} of {1}',
    startTrainingNow: 'Start AR Training',
    tutorial: [
      { title: 'Scan Your Surroundings', body: 'Use your camera to scan the training area around you.' },
      { title: 'Identify the Hazard', body: 'Locate the highlighted hazard shown in your surroundings.' },
      { title: 'Choose the Correct Action', body: 'Select the appropriate PPE or safety equipment.' },
      { title: 'Follow the Safe Sequence', body: 'Perform the emergency response in the correct order.' },
      { title: 'Complete the Assessment', body: 'Your actions and performance will be evaluated.' },
    ],

    // Scenario / AR
    arMode: 'Camera AR Mode',
    deskMode: '3D Simulation Mode',
    switchToAR: 'Switch to Camera AR',
    switchTo3D: 'Switch to 3D Mode',
    arUnavailable: 'Camera not available — using 3D mode',
    exitTraining: 'Exit',
    saving: 'Saving results…',
    step: 'Step',
    completed: 'Completed',
    offlineMode: 'OFFLINE MODE',
    syncing: 'Syncing…',
    syncComplete: 'Sync Complete ✓',

    // Assessment
    assessmentTitle: 'Safety Assessment',
    chooseLanguage: 'Choose Assessment Language',
    listenQuestion: 'Listen to Question',
    submitAnswer: 'Submit',
    nextQuestion: 'Next Question →',
    correct: 'You are Correct!',
    incorrect: 'Incorrect Answer',
    correctAnswer: 'Correct answer',
    explanation: 'Explanation',
    continueBtn: 'Continue →',
    assessmentResult: 'Safety Assessment Result',
    passed: 'Assessment Passed ✓',
    failed: 'Assessment Not Passed',
    retryAssessment: 'Retry Assessment',
    viewCertificate: 'View Certificate',
    yourScore: 'Your Score',
    passingScore: 'Passing score: 60%',
    questionOf: 'Question {0} of {1}',

    // Certificate
    certificateTitle: 'Certificate of Completion',
    certifiedBy: 'Jharkhand Industrial Safety Council',
    certId: 'Certificate ID',
    issuedOn: 'Issued On',
    verifyQR: 'Scan to Verify',
    downloadCert: 'Download Certificate',
    shareCert: 'Share',
    certVerified: 'Certificate Verified ✓',
    certInvalid: 'Certificate Invalid ✕',
    certTampered: 'Certificate may have been tampered. Hash mismatch.',
    integrity: 'Certificate Integrity',
    integrityOk: 'Hash verified — Certificate is authentic',
    integrityFail: 'Hash mismatch — Certificate may be tampered',

    // Chatbot
    safetyAssistant: 'Safety Assistant',
    typeMessage: 'Type your safety question…',
    voiceInput: 'Voice Input',
    listening: 'Listening…',
    suggestedQuestions: 'Suggested Questions',
    suggested: [
      'How do I use a fire extinguisher?',
      'What PPE should I wear?',
      'What should I do during a gas leak?',
      'How do I identify a fire hazard?',
    ],

    // Admin
    adminDashboard: 'Admin Dashboard',
    totalTrainees: 'Total Trainees',
    completionRate: 'Completion Rate',
    avgScore: 'Avg. Score',
    certsIssued: 'Certificates Issued',
    trainees: 'Trainees',
    compliance: 'Compliance',
    certificates: 'Certificates',
    assessments: 'Assessments',
    reports: 'Reports',
    settings: 'Settings',
    search: 'Search…',
    filterBy: 'Filter by',
    noTraineesYet: 'No trainees registered yet.',
    name: 'Name',
    module: 'Module',
    status: 'Status',
    score: 'Score',
    date: 'Date',
    actions: 'Actions',
    compliancePassed: 'Passed',
    complianceFailed: 'Failed',
    compliancePending: 'Pending',
    revoke: 'Revoke',
    revokeConfirm: 'Are you sure you want to revoke this certificate?',

    // Common
    loading: 'Loading…',
    error: 'Something went wrong.',
    retry: 'Retry',
    cancel: 'Cancel',
    save: 'Save',
    back: 'Back',
    close: 'Close',
    yes: 'Yes',
    no: 'No',
    or: 'or',
  },

  hi: {
    // Navigation
    appName: 'SurakshaAR',
    tagline: 'सुरक्षित भारत के लिए गहन प्रशिक्षण।',
    home: 'होम',
    dashboard: 'डैशबोर्ड',
    profile: 'प्रोफ़ाइल',
    logout: 'लॉग आउट',
    login: 'लॉग इन',
    register: 'पंजीकरण',
    highContrast: 'उच्च कंट्रास्ट',
    voice: 'आवाज़',

    // Landing
    heroHeading: 'सुरक्षा सीखें। सुरक्षित अभ्यास करें।',
    heroSubtitle: 'AR ट्रेनिंग के जरिए असली औद्योगिक सुरक्षा स्थितियों का अनुभव करें — बिना वास्तविक खतरे के।',
    startARTraining: 'AR ट्रेनिंग शुरू करें',
    exploreTraining: 'ट्रेनिंग देखें',
    howItWorks: 'SurakshaAR कैसे काम करता है',
    learnHowToUse: 'SurakshaAR का उपयोग करना सीखें',
    learnHowToUseSubtitle: 'डैशबोर्ड नेविगेशन, सुरक्षा सहायक, कैमरा AR में खतरे की पहचान और प्रमाणन सीखने के लिए पूरा वीडियो वॉकथ्रू देखें।',
    videoTutorial: 'वीडियो ट्यूटोरियल',
    howToUse: 'कैसे उपयोग करें?',
    watchTutorial: 'वीडियो वॉकथ्रू देखें',
    step_learn: 'सीखें',
    step_experience: 'अनुभव करें',
    step_act: 'कार्य करें',
    step_assess: 'मूल्यांकन',
    step_improve: 'सुधार करें',
    step_certify: 'प्रमाणित हों',
    step_learn_desc: 'AR वातावरण में प्रवेश से पहले सुरक्षा प्रोटोकॉल समझें।',
    step_experience_desc: 'अपने कैमरे से असली परिवेश में खतरे देखें।',
    step_act_desc: 'सही क्रम में सही सुरक्षा कार्य करें।',
    step_assess_desc: 'अपने ज्ञान का परीक्षण करने के लिए सुरक्षा प्रश्नों का उत्तर दें।',
    step_improve_desc: 'विस्तृत फीडबैक प्राप्त करें और अपना स्कोर सुधारें।',
    step_certify_desc: 'QR कोड के साथ डिजिटल प्रमाणपत्र अर्जित करें।',

    // Auth
    fullName: 'पूरा नाम',
    email: 'ईमेल पता',
    mobile: 'मोबाइल नंबर',
    password: 'पासवर्ड',
    confirmPassword: 'पासवर्ड पुष्टि करें',
    preferredLanguage: 'पसंदीदा भाषा',
    showPassword: 'पासवर्ड दिखाएं',
    hidePassword: 'पासवर्ड छुपाएं',
    forgotPassword: 'पासवर्ड भूल गए?',
    createAccount: 'खाता बनाएं',
    signIn: 'साइन इन',
    alreadyHaveAccount: 'पहले से खाता है?',
    orLoginWith: 'या लॉग इन करें',
    continueWithGoogle: 'Google / Gmail से जारी रखें',
    signInWithGoogle: 'Google / Gmail से साइन इन करें',
    orRegisterWith: 'या ईमेल और पासवर्ड से रजिस्टर करें',

    // Dashboard
    goodMorning: 'सुप्रभात',
    goodAfternoon: 'नमस्कार',
    goodEvening: 'शुभ संध्या',
    continueTraining: 'अपनी ट्रेनिंग जारी रखें',
    trainingModules: 'प्रशिक्षण मॉड्यूल',
    recentSessions: 'हाल के सत्र',
    safetyReadiness: 'सुरक्षा तत्परता',
    sessionsCompleted: 'सत्र पूर्ण',
    modulesAvailable: 'मॉड्यूल उपलब्ध',
    lastTrained: 'अंतिम ट्रेनिंग',
    startTraining: 'ट्रेनिंग शुरू करें',
    retryScenario: 'पुनः प्रयास करें',
    noSessionsYet: 'अभी तक कोई सत्र पूर्ण नहीं हुआ।',
    noScenariosYet: 'कोई ट्रेनिंग मॉड्यूल उपलब्ध नहीं। अपने एडमिन से संपर्क करें।',
    selectModuleSubtitle: 'AR ट्रेनिंग शुरू करने के लिए एक सुरक्षा मॉड्यूल चुनें',
    steps: 'चरण',
    benchmark: 'बेंचमार्क',
    bestScore: 'सर्वश्रेष्ठ',

    // Tutorial
    howItWorksTitle: 'यह कैसे काम करता है',
    tutorialBack: 'वापस',
    tutorialNext: 'अगला',
    skipTutorial: 'ट्यूटोरियल छोड़ें',
    listen: 'सुनें',
    stepOf: 'चरण {0} / {1}',
    startTrainingNow: 'AR ट्रेनिंग शुरू करें',
    tutorial: [
      { title: 'अपना परिवेश स्कैन करें', body: 'ट्रेनिंग क्षेत्र को स्कैन करने के लिए अपना कैमरा उपयोग करें।' },
      { title: 'खतरे की पहचान करें', body: 'अपने परिवेश में दिखाए गए हाइलाइटेड खतरे को खोजें।' },
      { title: 'सही कार्य चुनें', body: 'उचित PPE या सुरक्षा उपकरण चुनें।' },
      { title: 'सुरक्षित क्रम अपनाएं', body: 'आपातकालीन प्रतिक्रिया सही क्रम में करें।' },
      { title: 'मूल्यांकन पूरा करें', body: 'आपके कार्यों और प्रदर्शन का मूल्यांकन किया जाएगा।' },
    ],

    // Scenario / AR
    arMode: 'कैमरा AR मोड',
    deskMode: '3D सिमुलेशन मोड',
    switchToAR: 'कैमरा AR पर जाएं',
    switchTo3D: '3D मोड पर जाएं',
    arUnavailable: 'कैमरा उपलब्ध नहीं — 3D मोड उपयोग हो रहा है',
    exitTraining: 'बाहर',
    saving: 'परिणाम सहेजे जा रहे हैं…',
    step: 'चरण',
    completed: 'पूर्ण',
    offlineMode: 'ऑफलाइन मोड',
    syncing: 'सिंक हो रहा है…',
    syncComplete: 'सिंक पूर्ण ✓',

    // Assessment
    assessmentTitle: 'सुरक्षा मूल्यांकन',
    chooseLanguage: 'मूल्यांकन भाषा चुनें',
    listenQuestion: 'प्रश्न सुनें',
    submitAnswer: 'जमा करें',
    nextQuestion: 'अगला प्रश्न →',
    correct: 'आपका उत्तर सही है!',
    incorrect: 'गलत उत्तर',
    correctAnswer: 'सही उत्तर',
    explanation: 'व्याख्या',
    continueBtn: 'जारी रखें →',
    assessmentResult: 'सुरक्षा मूल्यांकन परिणाम',
    passed: 'मूल्यांकन में सफल ✓',
    failed: 'मूल्यांकन में असफल',
    retryAssessment: 'पुनः प्रयास करें',
    viewCertificate: 'प्रमाणपत्र देखें',
    yourScore: 'आपका स्कोर',
    passingScore: 'उत्तीर्ण स्कोर: 60%',
    questionOf: 'प्रश्न {0} / {1}',

    // Certificate
    certificateTitle: 'प्रशिक्षण प्रमाणपत्र',
    certifiedBy: 'झारखंड औद्योगिक सुरक्षा परिषद',
    certId: 'प्रमाणपत्र ID',
    issuedOn: 'जारी तिथि',
    verifyQR: 'सत्यापन के लिए स्कैन करें',
    downloadCert: 'प्रमाणपत्र डाउनलोड करें',
    shareCert: 'साझा करें',
    certVerified: 'प्रमाणपत्र सत्यापित ✓',
    certInvalid: 'प्रमाणपत्र अमान्य ✕',
    certTampered: 'प्रमाणपत्र के साथ छेड़छाड़ हो सकती है।',
    integrity: 'प्रमाणपत्र अखंडता',
    integrityOk: 'हैश सत्यापित — प्रमाणपत्र प्रामाणिक है',
    integrityFail: 'हैश मेल नहीं — प्रमाणपत्र संदिग्ध है',

    // Chatbot
    safetyAssistant: 'सुरक्षा सहायक',
    typeMessage: 'अपना सुरक्षा प्रश्न लिखें…',
    voiceInput: 'आवाज़ इनपुट',
    listening: 'सुन रहा है…',
    suggestedQuestions: 'सुझाए गए प्रश्न',
    suggested: [
      'अग्निशामक का उपयोग कैसे करें?',
      'मुझे कौन सा PPE पहनना चाहिए?',
      'गैस रिसाव में क्या करें?',
      'आग के खतरे की पहचान कैसे करें?',
    ],

    // Admin (admin UI stays mostly in English per industry standard)
    adminDashboard: 'Admin Dashboard',
    totalTrainees: 'कुल प्रशिक्षु',
    completionRate: 'पूर्णता दर',
    avgScore: 'औसत स्कोर',
    certsIssued: 'प्रमाणपत्र जारी',
    trainees: 'Trainees',
    compliance: 'Compliance',
    certificates: 'Certificates',
    assessments: 'Assessments',
    reports: 'Reports',
    settings: 'Settings',
    search: 'खोजें…',
    filterBy: 'फ़िल्टर',
    noTraineesYet: 'अभी तक कोई प्रशिक्षु पंजीकृत नहीं।',
    name: 'नाम',
    module: 'मॉड्यूल',
    status: 'स्थिति',
    score: 'स्कोर',
    date: 'तारीख',
    actions: 'कार्रवाई',
    compliancePassed: 'उत्तीर्ण',
    complianceFailed: 'अनुत्तीर्ण',
    compliancePending: 'लंबित',
    revoke: 'रद्द करें',
    revokeConfirm: 'क्या आप इस प्रमाणपत्र को रद्द करना चाहते हैं?',

    // Common
    loading: 'लोड हो रहा है…',
    error: 'कुछ गलत हो गया।',
    retry: 'पुनः प्रयास करें',
    cancel: 'रद्द करें',
    save: 'सहेजें',
    back: 'वापस',
    close: 'बंद करें',
    yes: 'हाँ',
    no: 'नहीं',
    or: 'या',
  },

  sat: {
    // Navigation
    appName: 'SurakshaAR',
    tagline: 'ᱥᱩᱨᱠᱷᱤᱛ ᱵᱷᱟᱨᱚᱛ ᱞᱟᱹᱜᱤᱫ ᱜᱟᱹᱦᱤᱨ ᱥᱤᱠᱷᱟᱣ᱾',
    home: 'ᱚᱲᱟᱜ',
    dashboard: 'ᱰᱮᱥᱵᱳᱨᱰ',
    profile: 'ᱯᱨᱳᱯᱷᱟᱭᱤᱞ',
    logout: 'ᱞᱚᱜᱽ ᱟᱣᱩᱴ',
    login: 'ᱞᱚᱜᱽ ᱤᱱ',
    register: 'ᱨᱮᱡᱤᱥᱴᱟᱨ',
    highContrast: 'ᱩᱥᱩᱞ ᱠᱚᱱᱴᱨᱟᱥᱴ',
    voice: 'ᱟᱲᱟᱝ',

    // Landing
    heroHeading: 'ᱥᱩᱨᱠᱷᱟ ᱪᱮᱫᱚᱜ ᱢᱮ᱾ ᱥᱩᱨᱠᱷᱤᱛ ᱠᱟᱹᱢᱤᱭ ᱢᱮ᱾',
    heroSubtitle: 'AR ᱥᱤᱠᱷᱟᱣ ᱛᱮ ᱥᱟᱹᱨᱤ ᱠᱟᱹᱨᱜᱟᱲ ᱨᱮᱱᱟᱜ ᱵᱚᱛᱚᱨ ᱴᱷᱟᱶ ᱟᱹᱭᱠᱟᱹᱣ ᱢᱮ — ᱵᱤᱱᱟᱹ ᱵᱚᱛᱚᱨ ᱛᱮ᱾',
    startARTraining: 'AR ᱥᱤᱠᱷᱟᱣ ᱮᱦᱚᱵ ᱢᱮ',
    exploreTraining: 'ᱥᱤᱠᱷᱟᱣ ᱧᱮᱞ ᱢᱮ',
    howItWorks: 'SurakshaAR ᱪᱮᱫ ᱞᱮᱠᱟ ᱠᱟᱹᱢᱤᱭᱟ',
    learnHowToUse: 'SurakshaAR ᱵᱮᱵᱷᱟᱨ ᱪᱮᱫᱚᱜ',
    learnHowToUseSubtitle: 'SurakshaAR ᱵᱮᱵᱷᱟᱨ ᱞᱟᱹᱜᱤᱫ ᱵᱷᱤᱰᱤᱭᱳ ᱜᱟᱭᱤᱰ ᱧᱮᱞ ᱢᱮ।',
    videoTutorial: 'ᱵᱷᱤᱰᱤᱭᱳ ᱴᱤᱭᱩᱴᱳᱨᱤᱭᱟᱞ',
    howToUse: 'ᱪᱮᱫ ᱞᱮᱠᱟ ᱵᱮᱵᱷᱟᱨᱟ?',
    watchTutorial: 'ᱵᱷᱤᱰᱤᱭᱳ ᱜᱟᱭᱤᱰ ᱧᱮᱞ',
    step_learn: 'ᱪᱮᱫᱚᱜ',
    step_experience: 'ᱟᱹᱭᱠᱟᱹᱣ',
    step_act: 'ᱠᱟᱹᱢᱤ',
    step_assess: 'ᱯᱟᱨᱠᱷᱟᱣ',
    step_improve: 'ᱥᱩᱫᱷᱟᱹᱨ',
    step_certify: 'ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ',
    step_learn_desc: 'AR ᱨᱮ ᱵᱚᱞᱚᱱ ᱞᱟᱦᱟ ᱥᱩᱨᱠᱷᱟ ᱱᱤᱭᱟᱹᱢ ᱵᱩᱡᱷᱟᱹᱣ ᱢᱮ᱾',
    step_experience_desc: 'ᱟᱢᱟᱜ ᱠᱮᱢᱮᱨᱟ ᱛᱮ ᱟᱰᱮᱯᱟᱥᱮ ᱨᱮ ᱵᱚᱛᱚᱨ ᱧᱮᱞ ᱢᱮ᱾',
    step_act_desc: 'ᱥᱟᱹᱨᱤ ᱞᱮᱠᱟᱛᱮ ᱥᱩᱨᱠᱷᱟ ᱠᱟᱹᱢᱤ ᱞᱟᱦᱟᱭ ᱢᱮ᱾',
    step_assess_desc: 'ᱟᱢᱟᱜ ᱜᱮᱭᱟᱱ ᱯᱟᱨᱠᱷᱟᱣ ᱞᱟᱹᱜᱤᱫ ᱠᱩᱠᱞᱤ ᱨᱮᱱᱟᱜ ᱛᱮᱞᱟ ᱮᱢ ᱢᱮ᱾',
    step_improve_desc: 'ᱯᱩᱥᱴᱟᱹᱣ ᱯᱷᱤᱰᱵᱮᱠ ᱧᱟᱢ ᱢᱮ ᱟᱨ ᱟᱢᱟᱜ ᱥᱠᱳᱨ ᱵᱟᱹᱲᱛᱤᱭ ᱢᱮ᱾',
    step_certify_desc: 'QR ᱠᱳᱰ ᱥᱟᱶ ᱰᱤᱡᱤᱴᱟᱞ ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ ᱦᱟᱢᱮᱴ ᱢᱮ᱾',

    // Auth
    fullName: 'ᱯᱩᱨᱟᱹ ᱧᱩᱛᱩᱢ',
    email: 'ᱤᱢᱮᱞ ᱴᱷᱤᱠᱬᱟ',
    mobile: 'ᱢᱳᱵᱟᱭᱤᱞ ᱱᱚᱢᱵᱚᱨ',
    password: 'ᱯᱟᱥᱣᱟᱨᱰ',
    confirmPassword: 'ᱯᱟᱥᱣᱟᱨᱰ ᱫᱚᱦᱲᱟ ᱚᱞ ᱢᱮ',
    preferredLanguage: 'ᱠᱩᱥᱤᱭᱟᱜ ᱯᱟᱹᱨᱥᱤ',
    showPassword: 'ᱯᱟᱥᱣᱟᱨᱰ ᱫᱮᱠᱷᱟᱣ ᱢᱮ',
    hidePassword: 'ᱯᱟᱥᱣᱟᱨᱰ ᱩᱠᱩᱭ ᱢᱮ',
    forgotPassword: 'ᱯᱟᱥᱣᱟᱨᱰ ᱦᱤᱲᱤᱧ ᱮᱱᱟ?',
    createAccount: 'ᱮᱠᱟᱣᱩᱱᱴ ᱵᱮᱱᱟᱣ ᱢᱮ',
    signIn: 'ᱥᱟᱭᱤᱱ ᱤᱱ',
    alreadyHaveAccount: 'ᱯᱟᱹᱦᱤᱞ ᱠᱷᱚᱱ ᱮᱠᱟᱣᱩᱱᱴ ᱢᱮᱱᱟᱜᱼᱟ?',
    orLoginWith: 'ᱥᱮ ᱱᱚᱶᱟ ᱛᱮ ᱞᱚᱜᱽ ᱤᱱ ᱢᱮ',
    continueWithGoogle: 'Google / Gmail ᱛᱮ ᱞᱟᱦᱟᱭ ᱢᱮ',
    signInWithGoogle: 'Google / Gmail ᱛᱮ ᱥᱟᱭᱤᱱ ᱤᱱ ᱢᱮ',
    orRegisterWith: 'ᱥᱮ ᱤᱢᱮᱞ ᱟᱨ ᱯᱟᱥᱣᱟᱨᱰ ᱛᱮ ᱨᱮᱡᱤᱥᱴᱟᱨ ᱢᱮ',

    // Dashboard
    goodMorning: 'ᱥᱟᱹᱜᱩᱱ ᱥᱮᱛᱟᱜ',
    goodAfternoon: 'ᱥᱟᱹᱜᱩᱱ ᱛᱤᱠᱤᱱ',
    goodEvening: 'ᱥᱟᱹᱜᱩᱱ ᱟᱹᱭᱩᱵ',
    continueTraining: 'ᱟᱢᱟᱜ ᱥᱤᱠᱷᱟᱣ ᱞᱟᱦᱟᱭ ᱢᱮ',
    trainingModules: 'ᱥᱤᱠᱷᱟᱣ ᱢᱳᱰᱩᱞ ᱠᱚ',
    recentSessions: 'ᱱᱟᱦᱟᱜ ᱥᱮᱥᱚᱱ ᱠᱚ',
    safetyReadiness: 'ᱥᱩᱨᱠᱷᱟ ᱥᱟᱯᱲᱟᱣ',
    sessionsCompleted: 'ᱯᱩᱨᱟᱹᱣ ᱟᱠᱟᱱ ᱥᱮᱥᱚᱱ',
    modulesAvailable: 'ᱢᱮᱱᱟᱜ ᱢᱳᱰᱩᱞ ᱠᱚ',
    lastTrained: 'ᱢᱩᱪᱟᱹᱫ ᱥᱤᱠᱷᱟᱣ',
    startTraining: 'ᱥᱤᱠᱷᱟᱣ ᱮᱦᱚᱵ ᱢᱮ',
    retryScenario: 'ᱫᱚᱦᱲᱟ ᱪᱮᱥᱴᱟᱭ ᱢᱮ',
    noSessionsYet: 'ᱱᱤᱛ ᱫᱷᱟᱹᱵᱤᱡ ᱡᱟᱦᱟᱸᱱ ᱥᱮᱥᱚᱱ ᱵᱟᱝ ᱯᱩᱨᱟᱹᱣ ᱟᱠᱟᱱᱟ᱾',
    noScenariosYet: 'ᱡᱟᱦᱟᱸᱱ ᱥᱤᱠᱷᱟᱣ ᱢᱳᱰᱩᱞ ᱵᱟᱹᱱᱩᱜᱼᱟ᱾ ᱮᱰᱢᱤᱱ ᱥᱟᱶ ᱡᱚᱯᱲᱟᱣ ᱢᱮ᱾',
    selectModuleSubtitle: 'AR ᱥᱤᱠᱷᱟᱣ ᱮᱦᱚᱵ ᱞᱟᱹᱜᱤᱫ ᱢᱤᱫ ᱥᱩᱨᱠᱷᱟ ᱢᱳᱰᱩᱞ ᱵᱟᱪᱷᱟᱣ ᱢᱮ',
    steps: 'ᱫᱷᱟᱯ',
    benchmark: 'ᱵᱮᱸᱪᱢᱟᱨᱠ',
    bestScore: 'ᱥᱚᱨᱮᱥ',

    // Tutorial
    howItWorksTitle: 'ᱱᱚᱶᱟ ᱪᱮᱫ ᱞᱮᱠᱟ ᱠᱟᱹᱢᱤᱭᱟ',
    tutorialBack: 'ᱛᱟᱭᱚᱢ',
    tutorialNext: 'ᱞᱟᱦᱟ',
    skipTutorial: 'ᱴᱤᱭᱩᱴᱳᱨᱤᱭᱟᱞ ᱵᱟᱹᱜᱤᱭ ᱢᱮ',
    listen: 'ᱟᱸᱡᱚᱢ ᱢᱮ',
    stepOf: 'ᱫᱷᱟᱯ {0} / {1}',
    startTrainingNow: 'AR ᱥᱤᱠᱷᱟᱣ ᱮᱦᱚᱵ ᱢᱮ',
    tutorial: [
      { title: 'ᱟᱰᱮᱯᱟᱥᱮ ᱥᱠᱮᱱ ᱢᱮ', body: 'ᱟᱢᱟᱜ ᱠᱮᱢᱮᱨᱟ ᱛᱮ ᱥᱤᱠᱷᱟᱣ ᱴᱷᱟᱶ ᱥᱠᱮᱱ ᱢᱮ᱾' },
      { title: 'ᱵᱚᱛᱚᱨ ᱪᱤᱱᱦᱟᱹᱣ ᱢᱮ', body: 'ᱟᱰᱮᱯᱟᱥᱮ ᱨᱮ ᱩᱫᱩᱜ ᱟᱠᱟᱱ ᱵᱚᱛᱚᱨ ᱴᱷᱟᱶ ᱯᱟᱱᱛᱮ ᱧᱟᱢ ᱢᱮ᱾' },
      { title: 'ᱥᱟᱹᱨᱤ ᱠᱟᱹᱢᱤ ᱵᱟᱪᱷᱟᱣ ᱢᱮ', body: 'ᱴᱷᱤᱠ PPE ᱟᱨ ᱥᱩᱨᱠᱷᱟ ᱥᱟᱢᱟᱱ ᱵᱟᱪᱷᱟᱣ ᱢᱮ᱾' },
      { title: 'ᱥᱩᱨᱠᱷᱤᱛ ᱫᱷᱟᱯ ᱯᱟᱸᱡᱟᱭ ᱢᱮ', body: 'ᱟᱯᱟᱛᱠᱟᱞᱤᱱ ᱠᱟᱹᱢᱤ ᱴᱷᱤᱠ ᱞᱮᱠᱟᱛᱮ ᱞᱟᱦᱟᱭ ᱢᱮ᱾' },
      { title: 'ᱯᱟᱨᱠᱷᱟᱣ ᱯᱩᱨᱟᱹᱣ ᱢᱮ', body: 'ᱟᱢᱟᱜ ᱠᱟᱹᱢᱤ ᱟᱨ ᱯᱟᱨᱯᱷᱚᱨᱢᱮᱱᱥ ᱯᱟᱨᱠᱷᱟᱣ ᱦᱩᱭᱩᱜᱼᱟ᱾' },
    ],

    // Scenario / AR
    arMode: 'ᱠᱮᱢᱮᱨᱟ AR ᱢᱳᱰ',
    deskMode: '3D ᱥᱤᱢᱩᱞᱮᱥᱚᱱ ᱢᱳᱰ',
    switchToAR: 'ᱠᱮᱢᱮᱨᱟ AR ᱛᱮ ᱪᱟᱞᱟᱜ ᱢᱮ',
    switchTo3D: '3D ᱢᱳᱰ ᱛᱮ ᱪᱟᱞᱟᱜ ᱢᱮ',
    arUnavailable: 'ᱠᱮᱢᱮᱨᱟ ᱵᱟᱹᱱᱩᱜᱼᱟ — 3D ᱢᱳᱰ ᱵᱮᱵᱷᱟᱨᱚᱜ ᱠᱟᱱᱟ',
    exitTraining: 'ᱵᱟᱦᱨᱮ',
    saving: 'ᱨᱤᱡᱟᱞᱴ ᱥᱟᱧᱪᱟᱣᱜ ᱠᱟᱱᱟ…',
    step: 'ᱫᱷᱟᱯ',
    completed: 'ᱯᱩᱨᱟᱹᱣ ᱮᱱᱟ',
    offlineMode: 'ᱚᱯᱷᱞᱟᱭᱤᱱ ᱢᱳᱰ',
    syncing: 'ᱥᱤᱸᱠ ᱦᱩᱭᱩᱜ ᱠᱟᱱᱟ…',
    syncComplete: 'ᱥᱤᱸᱠ ᱯᱩᱨᱟᱹᱣ ᱮᱱᱟ ✓',

    // Assessment
    assessmentTitle: 'ᱥᱩᱨᱠᱷᱟ ᱯᱟᱨᱠᱷᱟᱣ',
    chooseLanguage: 'ᱯᱟᱨᱠᱷᱟᱣ ᱯᱟᱹᱨᱥᱤ ᱵᱟᱪᱷᱟᱣ ᱢᱮ',
    listenQuestion: 'ᱠᱩᱠᱞᱤ ᱟᱸᱡᱚᱢ ᱢᱮ',
    submitAnswer: 'ᱛᱮᱞᱟ ᱮᱢ ᱢᱮ',
    nextQuestion: 'ᱫᱚᱥᱟᱨ ᱠᱩᱠᱞᱤ →',
    correct: 'ᱟᱢᱟᱜ ᱛᱮᱞᱟ ᱥᱟᱹᱨᱤ ᱜᱮᱭᱟ!',
    incorrect: 'ᱵᱷᱩᱞ ᱛᱮᱞᱟ',
    correctAnswer: 'ᱥᱟᱹᱨᱤ ᱛᱮᱞᱟ',
    explanation: 'ᱵᱤᱵᱚᱨᱚᱬ',
    continueBtn: 'ᱞᱟᱦᱟᱭ ᱢᱮ →',
    assessmentResult: 'ᱥᱩᱨᱠᱷᱟ ᱯᱟᱨᱠᱷᱟᱣ ᱚᱨᱡᱚ',
    passed: 'ᱯᱟᱨᱠᱷᱟᱣ ᱨᱮ ᱯᱟᱥ ᱮᱱᱟ ✓',
    failed: 'ᱯᱟᱨᱠᱷᱟᱣ ᱨᱮ ᱵᱟᱝ ᱯᱟᱥ ᱞᱮᱱᱟ',
    retryAssessment: 'ᱫᱚᱦᱲᱟ ᱯᱟᱨᱠᱷᱟᱣ ᱢᱮ',
    viewCertificate: 'ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ ᱧᱮᱞ ᱢᱮ',
    yourScore: 'ᱟᱢᱟᱜ ᱥᱠᱳᱨ',
    passingScore: 'ᱯᱟᱥ ᱥᱠᱳᱨ: 60%',
    questionOf: 'ᱠᱩᱠᱞᱤ {0} / {1}',

    // Certificate
    certificateTitle: 'ᱥᱤᱠᱷᱟᱣ ᱯᱩᱨᱟᱹᱣ ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ',
    certifiedBy: 'ᱡᱷᱟᱨᱠᱷᱚᱸᱰ ᱠᱟᱹᱨᱜᱟᱲ ᱥᱩᱨᱠᱷᱟ ᱯᱚᱨᱤᱥᱚᱫᱽ',
    certId: 'ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ ID',
    issuedOn: 'ᱮᱢ ᱢᱟᱹᱦᱤᱛ',
    verifyQR: 'ᱯᱟᱨᱠᱷᱟᱣ ᱞᱟᱹᱜᱤᱫ ᱥᱠᱮᱱ ᱢᱮ',
    downloadCert: 'ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ ᱰᱟᱣᱩᱱᱞᱳᱰ ᱢᱮ',
    shareCert: 'ᱦᱟᱹᱴᱤᱧ ᱢᱮ',
    certVerified: 'ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ ᱯᱟᱨᱠᱷᱟᱣ ᱮᱱᱟ ✓',
    certInvalid: 'ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ ᱵᱟᱹᱛᱤᱞ ✕',
    certTampered: 'ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ ᱨᱮ ᱵᱟᱹᱲᱤᱡ ᱦᱩᱭ ᱫᱟᱲᱮᱭᱟᱜᱼᱟ᱾',
    integrity: 'ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ ᱥᱟᱹᱨᱤᱭᱟᱹᱛ',
    integrityOk: 'ᱦᱮᱥ ᱯᱟᱨᱠᱷᱟᱣ ᱮᱱᱟ — ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ ᱥᱟᱹᱨᱤ ᱜᱮᱭᱟ',
    integrityFail: 'ᱦᱮᱥ ᱵᱟᱝ ᱢᱤᱞᱟᱹᱣ ᱞᱮᱱᱟ — ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ ᱵᱟᱹᱲᱤᱡ ᱜᱮᱭᱟ',

    // Chatbot
    safetyAssistant: 'ᱥᱩᱨᱠᱷᱟ ᱜᱚᱲᱚᱭᱤᱡ',
    typeMessage: 'ᱟᱢᱟᱜ ᱥᱩᱨᱠᱷᱟ ᱠᱩᱠᱞᱤ ᱚᱞ ᱢᱮ…',
    voiceInput: 'ᱟᱲᱟᱝ ᱤᱱᱯᱩᱴ',
    listening: 'ᱟᱸᱡᱚᱢᱮᱫᱟᱭ…',
    suggestedQuestions: 'ᱥᱩᱡᱷᱟᱹᱣ ᱠᱩᱠᱞᱤ ᱠᱚ',
    suggested: [
      'ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡᱤᱡ (fire extinguisher) ᱪᱮᱫ ᱞᱮᱠᱟ ᱵᱮᱵᱷᱟᱨᱟ?',
      'ᱤᱧ ᱪᱮᱫ PPE ᱦᱚᱨᱚᱜ ᱞᱟᱹᱠᱛᱤ ᱠᱟᱱᱟ?',
      'ᱜᱮᱥ ᱞᱤᱠ ᱡᱚᱠᱷᱚᱱ ᱪᱮᱫ ᱪᱤᱠᱟᱹ ᱞᱟᱹᱠᱛᱤ?',
      'ᱥᱮᱸᱜᱮᱞ ᱵᱚᱛᱚᱨ ᱪᱮᱫ ᱞᱮᱠᱟᱧ ᱪᱤᱱᱦᱟᱹᱣᱟ?',
    ],

    // Admin
    adminDashboard: 'Admin Dashboard',
    totalTrainees: 'ᱢᱩᱴ ᱥᱤᱠᱷᱟᱣᱤᱭᱟᱹ ᱠᱚ',
    completionRate: 'ᱯᱩᱨᱟᱹᱣ ᱫᱚᱨ',
    avgScore: 'ᱦᱟᱨᱟᱦᱟᱹᱨᱤ ᱥᱠᱳᱨ',
    certsIssued: 'ᱮᱢ ᱟᱠᱟᱱ ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ',
    trainees: 'Trainees',
    compliance: 'Compliance',
    certificates: 'Certificates',
    assessments: 'Assessments',
    reports: 'Reports',
    settings: 'Settings',
    search: 'ᱯᱟᱱᱛᱮᱭ ᱢᱮ…',
    filterBy: 'ᱪᱷᱟᱹᱱᱤ',
    noTraineesYet: 'ᱱᱤᱛ ᱫᱷᱟᱹᱵᱤᱡ ᱡᱟᱦᱟᱸᱭ ᱥᱤᱠᱷᱟᱣᱤᱭᱟᱹ ᱵᱟᱹᱱᱩᱜ ᱠᱚᱣᱟ᱾',
    name: 'ᱧᱩᱛᱩᱢ',
    module: 'ᱢᱳᱰᱩᱞ',
    status: 'ᱦᱟᱞᱚᱛ',
    score: 'ᱥᱠᱳᱨ',
    date: 'ᱢᱟᱹᱦᱤᱛ',
    actions: 'ᱠᱟᱹᱢᱤ',
    compliancePassed: 'ᱯᱟᱥ',
    complianceFailed: 'ᱯᱷᱮᱞ',
    compliancePending: 'ᱛᱟᱺᱜᱤ ᱨᱮ',
    revoke: 'ᱨᱚᱫᱽ ᱢᱮ',
    revokeConfirm: 'ᱪᱮᱫ ᱟᱢ ᱱᱚᱶᱟ ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ ᱨᱚᱫᱽ ᱥᱟᱱᱟᱭᱮᱫ ᱢᱮᱭᱟ?',

    // Common
    loading: 'ᱞᱳᱰ ᱦᱩᱭᱩᱜ ᱠᱟᱱᱟ…',
    error: 'ᱪᱮᱫ ᱪᱚ ᱵᱟᱹᱲᱤᱡ ᱮᱱᱟ᱾',
    retry: 'ᱫᱚᱦᱲᱟ ᱪᱮᱥᱴᱟᱭ ᱢᱮ',
    cancel: 'ᱵᱟᱹᱛᱤᱞ',
    save: 'ᱥᱟᱧᱪᱟᱣ ᱢᱮ',
    back: 'ᱛᱟᱭᱚᱢ',
    close: 'ᱵᱚᱸᱫᱽ ᱢᱮ',
    yes: 'ᱦᱚᱭ',
    no: 'ᱵᱟᱝ',
    or: 'ᱥᱮ',
  },
}

/**
 * Get a translated string, falling back to English if not found.
 * Supports simple {0}, {1} interpolation.
 */
export function getText(lang, key, ...args) {
  const str = t[lang]?.[key] ?? t['en']?.[key] ?? key
  if (!args.length) return str
  return str.replace(/\{(\d+)\}/g, (_, i) => args[i] ?? '')
}

/** Get tutorial steps for a language */
export function getTutorialSteps(lang) {
  return t[lang]?.tutorial ?? t['en'].tutorial
}

/**
 * Scenario content translations by scenario ID and language.
 * Used by ModuleCard so titles/descriptions switch with the language toggle
 * without depending on the React Query cache or data layer.
 */
export const SCENARIO_I18N = {
  'a1b2c3d4-0001-0001-0001-000000000001': {
    en: {
      title: 'Fire & Explosion Response',
      description: 'Simulate responding to an electrical fire on a manufacturing floor. Identify the hazard, activate emergency protocols, don PPE, use the correct extinguisher, and evacuate safely.',
    },
    hi: {
      title: 'आग और विस्फोट प्रतिक्रिया',
      description: 'एक मैन्युफैक्चरिंग फ्लोर पर बिजली की आग का जवाब देने का अभ्यास करें। खतरे की पहचान करें, आपातकालीन प्रोटोकॉल सक्रिय करें, PPE पहनें, सही अग्निशामक का उपयोग करें और सुरक्षित निकासी करें।',
    },
    sat: {
      title: 'ᱥᱮᱸᱜᱮᱞ ᱟᱨ ᱯᱷᱩᱴᱟᱹᱣ ᱨᱩᱠᱷᱤᱭᱟᱹ',
      description: 'ᱠᱟᱹᱨᱜᱟᱲ ᱨᱮ ᱵᱤᱡᱽᱞᱤ ᱥᱮᱸᱜᱮᱞ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱥᱤᱠᱷᱟᱣ ᱢᱮ᱾ ᱵᱚᱛᱚᱨ ᱪᱤᱱᱦᱟᱹᱣ ᱢᱮ, ᱟᱯᱟᱛᱠᱟᱞᱤᱱ ᱱᱤᱭᱟᱹᱢ ᱞᱟᱦᱟᱭ ᱢᱮ, PPE ᱦᱚᱨᱚᱜ ᱢᱮ, ᱴᱷᱤᱠ ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡᱤᱡ ᱵᱮᱵᱷᱟᱨ ᱢᱮ ᱟᱨ ᱥᱩᱨᱠᱷᱤᱛ ᱵᱟᱦᱨᱮ ᱚᱰᱚᱠ ᱢᱮ᱾',
    },
  },
  'a1b2c3d4-0004-0004-0004-000000000004': {
    en: {
      title: 'PPE & Industrial Hazard Baseline',
      description: 'Master mandatory Personal Protective Equipment protocols and baseline factory floor hazard identification. Don complete safety gear in correct order, inspect compliance, and verify safe worksite entry.',
    },
    hi: {
      title: 'पीपीई और औद्योगिक खतरा आधार रेखा',
      description: 'अनिवार्य व्यक्तिगत सुरक्षा उपकरण (PPE) प्रोटोकॉल और बुनियादी फैक्ट्री फ्लोर खतरे की पहचान में महारत हासिल करें। सही क्रम में पूर्ण सुरक्षा गियर पहनें, अनुपालन का निरीक्षण करें और सुरक्षित कार्यस्थल प्रवेश सत्यापित करें।',
    },
    sat: {
      title: 'PPE ᱟᱨ ᱠᱟᱹᱨᱜᱟᱲ ᱵᱚᱛᱚᱨ ᱵᱩᱱᱤᱭᱟᱹᱫᱽ',
      description: 'ᱞᱟᱹᱠᱛᱤᱭᱟᱱ PPE ᱱᱤᱭᱟᱹᱢ ᱟᱨ ᱠᱟᱹᱨᱜᱟᱲ ᱵᱚᱛᱚᱨ ᱪᱤᱱᱦᱟᱹᱣ ᱪᱮᱫᱚᱜ ᱢᱮ᱾ ᱴᱷᱤᱠ ᱛᱷᱟᱨ ᱛᱮ ᱯᱩᱨᱟᱹ ᱥᱮᱯᱷᱴᱤ ᱥᱟᱢᱟᱱ ᱦᱚᱨᱚᱜ ᱢᱮ, ᱯᱟᱨᱠᱷᱟᱣ ᱢᱮ ᱟᱨ ᱥᱩᱨᱠᱷᱤᱛ ᱠᱟᱹᱢᱤ ᱴᱷᱟᱶ ᱵᱚᱞᱚᱱ ᱯᱩᱨᱟᱹᱣ ᱢᱮ᱾',
    },
  },
  'a1b2c3d4-0002-0002-0002-000000000002': {
    en: {
      title: 'Gas Leak & Confined Space Protocol',
      description: 'Practice responding to a hazardous gas leak in a mining tunnel using the buddy system. Identify the leak, activate protocols, don breathing apparatus, and evacuate safely.',
    },
    hi: {
      title: 'गैस रिसाव और सीमित स्थान प्रोटोकॉल',
      description: 'बडी सिस्टम का उपयोग करते हुए माइनिंग सुरंग में खतरनाक गैस रिसाव का जवाब देने का अभ्यास करें। रिसाव की पहचान करें, प्रोटोकॉल सक्रिय करें, श्वास उपकरण पहनें और सुरक्षित निकासी करें।',
    },
    sat: {
      title: 'ᱜᱮᱥ ᱞᱤᱠ ᱟᱨ ᱥᱟᱸᱜᱷᱟᱨ ᱴᱷᱟᱶ ᱱᱤᱭᱟᱹᱢ',
      description: 'ᱠᱷᱟᱫᱟᱱ ᱨᱮ ᱵᱚᱛᱚᱨᱟᱱ ᱜᱮᱥ ᱞᱤᱠ ᱡᱚᱠᱷᱚᱱ ᱵᱟᱰᱤ ᱥᱤᱥᱴᱚᱢ ᱛᱮ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱥᱤᱠᱷᱟᱣ ᱢᱮ᱾ ᱞᱤᱠ ᱪᱤᱱᱦᱟᱹᱣ ᱢᱮ, ᱯᱨᱳᱴᱳᱠᱚᱞ ᱮᱦᱚᱵ ᱢᱮ, ᱥᱟᱦᱮᱫ ᱥᱟᱢᱟᱱ ᱦᱚᱨᱚᱜ ᱢᱮ ᱟᱨ ᱥᱩᱨᱠᱷᱤᱛ ᱵᱟᱦᱨᱮ ᱚᱰᱚᱠ ᱢᱮ᱾',
    },
  },
  'a1b2c3d4-0005-0005-0005-000000000005': {
    en: {
      title: 'High-Voltage Electrical Substation Safety',
      description: 'Master high-voltage arc-flash boundaries, dielectric insulating PPE, zero-energy state verification, and safe substation maintenance switching protocols.',
    },
    hi: {
      title: 'हाई-वोल्टेज इलेक्ट्रिकल सबस्टेशन सुरक्षा',
      description: 'हाई-वोल्टेज आर्क-फ्लैश सीमाओं, डाइइलेक्ट्रिक इंसुलेटिंग PPE, शून्य-ऊर्जा स्थिति सत्यापन और सुरक्षित सबस्टेशन रखरखाव स्विचिंग प्रोटोकॉल में महारत हासिल करें।',
    },
    sat: {
      title: 'ᱦᱟᱭ-ᱵᱷᱳᱞᱴᱮᱡᱽ ᱵᱤᱡᱽᱞᱤ ᱥᱟᱵᱽᱥᱴᱮᱥᱚᱱ ᱨᱩᱠᱷᱤᱭᱟᱹ',
      description: 'ᱟᱨᱠ-ᱯᱷᱞᱮᱥ ᱨᱩᱠᱷᱤᱭᱟᱹ, ᱵᱤᱡᱽᱞᱤ ᱵᱷᱮᱜᱟᱨ ᱱᱤᱭᱟᱹᱢ (isolation), ᱟᱨᱛᱷᱤᱝ ᱱᱤᱭᱟᱹᱢ ᱟᱨ ᱦᱟᱭ-ᱵᱷᱳᱞᱴᱮᱡᱽ ᱥᱟᱵᱽᱥᱴᱮᱥᱚᱱ ᱯᱨᱳᱴᱳᱠᱚᱞ ᱥᱤᱠᱷᱟᱣ᱾',
    },
  },
  'a1b2c3d4-0003-0003-0003-000000000003': {
    en: {
      title: 'Heavy Industrial Machinery & Nip-Point Guarding',
      description: 'Learn to safely isolate machinery before maintenance using LOTO procedures. Master rotating nip-point guarding and physical barrier interlocks.',
    },
    hi: {
      title: 'भारी औद्योगिक मशीनरी और निप-पॉइंट गार्डिंग',
      description: 'LOTO प्रक्रियाओं का उपयोग करके रखरखाव से पहले मशीनरी को सुरक्षित रूप से अलग करना सीखें। घूर्णन निप-पॉइंट गार्डिंग और भौतिक बैरियर इंटरलॉक्स में महारत हासिल करें।',
    },
    sat: {
      title: 'ᱦᱟᱢᱟᱞ ᱠᱟᱹᱨᱜᱟᱲ ᱢᱮᱥᱤᱱ ᱟᱨ ᱱᱤᱯ-ᱯᱚᱭᱮᱱᱴ ᱜᱟᱨᱰᱤᱝ',
      description: 'LOTO ᱱᱤᱭᱟᱹᱢ ᱛᱮ ᱢᱮᱥᱤᱱ ᱥᱟᱯᱲᱟᱣ ᱞᱟᱦᱟ ᱥᱩᱨᱠᱷᱤᱛ ᱞᱮᱠᱟᱛᱮ ᱵᱚᱸᱫᱽ ᱟᱨ ᱞᱚᱠ ᱪᱮᱫᱚᱜ ᱢᱮ᱾ ᱠᱟᱹᱢᱤ ᱚᱠᱛᱚ ᱨᱮ ᱦᱟᱴᱟᱛ ᱢᱮᱥᱤᱱ ᱮᱦᱚᱵ ᱠᱷᱚᱱ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱮᱢᱟᱭ᱾',
    },
  },
}

/**
 * Get scenario title or description in the given language.
 * Falls back to English if no translation is found.
 */
export function getScenarioText(scenarioId, lang, field) {
  return (
    SCENARIO_I18N[scenarioId]?.[lang]?.[field] ??
    SCENARIO_I18N[scenarioId]?.['en']?.[field] ??
    null
  )
}
