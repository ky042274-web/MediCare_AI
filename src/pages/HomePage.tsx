import React from 'react';
import {
  HeartPulse,
  Stethoscope,
  Calendar,
  Droplet,
  FlaskConical,
  FileText,
  BotMessageSquare,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  UserPlus,
  Activity,
  AlertTriangle,
  Award,
  Video,
  Building2,
  MapPin,
  Sparkles,
} from 'lucide-react';
import type { Specialty } from '../types/index.ts';

interface HomePageProps {
  onNavigate: (tab: string, extra?: any) => void;
  lang: 'en' | 'hi';
  onOpenSOS: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, lang, onOpenSOS }) => {
  const quickActions = [
    {
      id: 'disease-predict',
      title: lang === 'en' ? 'Check Disease Risk' : 'रोग जोखिम जांचें',
      desc: lang === 'en' ? 'AI symptom triage with emergency red-flag analysis' : 'एआई द्वारा लक्षणों की त्वरित जांच व आपातकालीन अलर्ट',
      icon: HeartPulse,
      color: 'from-rose-500 to-red-600',
      badge: 'AI Powered',
    },
    {
      id: 'doctors',
      title: lang === 'en' ? 'Find a Doctor' : 'डॉक्टर खोजें',
      desc: lang === 'en' ? '17 certified medical specialties & verified credentials' : '17 प्रमाणित विशेषज्ञ और सत्यापित रजिस्ट्रेशन',
      icon: Stethoscope,
      color: 'from-teal-600 to-cyan-700',
      badge: '17 Specialties',
    },
    {
      id: 'appointments',
      title: lang === 'en' ? 'Book Appointment' : 'अपॉइंटमेंट बुक करें',
      desc: lang === 'en' ? 'Collision-free time slots for video or in-person care' : 'बिना टकराव के लाइव स्लॉट चयन - ऑनलाइन व क्लिनिक',
      icon: Calendar,
      color: 'from-blue-600 to-indigo-700',
    },
    {
      id: 'health-tests',
      title: lang === 'en' ? 'Book a Health Test' : 'हेल्थ टेस्ट बुक करें',
      desc: lang === 'en' ? 'Home sample collection for CBC, HbA1c, Lipids, KFT' : 'घर बैठे ब्लड सैंपल संग्रह व प्रमाणित लैब रिपोर्ट',
      icon: FlaskConical,
      color: 'from-emerald-600 to-teal-700',
    },
    {
      id: 'reports',
      title: lang === 'en' ? 'Upload Medical Report' : 'मेडिकल रिपोर्ट अपलोड करें',
      desc: lang === 'en' ? 'AI plain-language interpretation in Hindi & English' : 'हिंदी और अंग्रेजी में एआई द्वारा सरल रिपोर्ट विश्लेषण',
      icon: FileText,
      color: 'from-purple-600 to-indigo-800',
      badge: 'Bilingual AI',
    },
    {
      id: 'blood-connect',
      title: lang === 'en' ? 'Find Blood Donors' : 'रक्तदाता खोजें',
      desc: lang === 'en' ? 'Search 8 ABO/Rh blood groups with consent protection' : 'सभी 8 रक्त समूहों के सुरक्षित व प्रमाणित दाता',
      icon: Droplet,
      color: 'from-red-600 to-rose-700',
      badge: 'Life Saver',
    },
    {
      id: 'blood-connect',
      title: lang === 'en' ? 'Register as Blood Donor' : 'रक्तदाता बनें',
      desc: lang === 'en' ? 'Voluntary non-commercial donation network' : 'स्वैच्छिक रक्तदान से किसी जरूरतमंद का जीवन बचाएं',
      icon: UserPlus,
      color: 'from-amber-600 to-orange-700',
    },
    {
      id: 'ai-assistant',
      title: lang === 'en' ? 'AI Health Assistant' : 'एआई स्वास्थ्य सहायक',
      desc: lang === 'en' ? 'Bilingual medical terms guide, test prep & triage' : 'हिंदी और अंग्रेजी में टेस्ट तैयारी व मार्गदर्शन',
      icon: BotMessageSquare,
      color: 'from-cyan-600 to-blue-700',
      badge: '24/7 Available',
    },
  ];

  const specialtiesList: { name: Specialty; iconName: string; sub: string }[] = [
    { name: 'General Physician', iconName: '🩺', sub: 'Fever, Infections, Lifestyle Disorders' },
    { name: 'Cardiologist — Heart Specialist', iconName: '❤️', sub: 'ECG, Blood Pressure, Heart Health' },
    { name: 'Neurologist — Brain and Nerve Specialist', iconName: '🧠', sub: 'Migraine, Epilepsy, Nerve Pain' },
    { name: 'Neurosurgeon — Brain and Spine Surgery Specialist', iconName: '🔬', sub: 'Spine Decompression, Disc, Cranial' },
    { name: 'Pediatrician — Children\'s Doctor', iconName: '👶', sub: 'Child Care, Milestones, Immunization' },
    { name: 'Gynecologist — Women\'s Health Specialist', iconName: '🌸', sub: 'Pregnancy, PCOD, Hormonal Health' },
    { name: 'Orthopedic — Bone and Joint Specialist', iconName: '🦴', sub: 'Joint Replacements, Arthritis, Fractures' },
    { name: 'Dermatologist — Skin Specialist', iconName: '✨', sub: 'Acne, Eczema, Psoriasis, Allergies' },
    { name: 'ENT Specialist — Ear, Nose and Throat', iconName: '👂', sub: 'Sinus, Tonsils, Vertigo, Hearing' },
    { name: 'Ophthalmologist — Eye Specialist', iconName: '👁️', sub: 'Cataract, Vision Screening, Glaucoma' },
    { name: 'Psychiatrist — Mental Health Specialist', iconName: '🌱', sub: 'Depression, Anxiety, Sleep Care' },
    { name: 'Endocrinologist — Diabetes and Hormone Specialist', iconName: '🩸', sub: 'Diabetes, Thyroid, Pituitary' },
    { name: 'Nephrologist — Kidney Specialist', iconName: '🌊', sub: 'Creatinine, Dialysis, Renal Stones' },
    { name: 'Gastroenterologist — Digestive System Specialist', iconName: '🍏', sub: 'GERD, IBS, Fatty Liver, Gastritis' },
    { name: 'Pulmonologist — Lung and Respiratory Specialist', iconName: '🫁', sub: 'Asthma, Chronic Cough, COPD' },
    { name: 'Oncologist — Cancer Specialist', iconName: '🎗️', sub: 'Targeted Therapies, Oncology Care' },
    { name: 'Dentist — Dental Specialist', iconName: '🦷', sub: 'Root Canal, Cleanings, Dental Pain' },
  ];

  return (
    <div className="space-y-10 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-850 to-teal-950 text-white rounded-3xl p-6 sm:p-10 lg:p-12 shadow-xl border border-slate-800">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 -mb-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-4xl relative z-10 space-y-6">
          <div className="inline-flex items-center space-x-2 bg-teal-500/15 border border-teal-500/30 px-3.5 py-1.5 rounded-full text-xs font-bold text-teal-300">
            <Sparkles className="w-4 h-4 text-teal-400" />
            <span>
              {lang === 'en'
                ? 'Comprehensive Healthcare Platform • 17 Specialties • AI Triage'
                : 'संपूर्ण अस्पताल प्लेटफॉर्म • 17 चिकित्सा विभाग • एआई जांच'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white">
            {lang === 'en' ? (
              <>
                Predict Diseases Early. <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-300 to-blue-400">
                  Connect with Doctors.
                </span>{' '}
                <br className="hidden sm:inline" />
                Save Lives Through Blood Donation.
              </>
            ) : (
              <>
                बीमारियों की शीघ्र पहचान। <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-300 to-blue-400">
                  विशेषज्ञ डॉक्टरों से परामर्श।
                </span>{' '}
                <br className="hidden sm:inline" />
                रक्तदान से जीवन की रक्षा।
              </>
            )}
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
            {lang === 'en'
              ? 'MediCare AI bridges intelligent symptom screening, guaranteed collision-free doctor appointment scheduling, accredited home laboratory diagnostics, and a privacy-conscious voluntary blood donor network across India.'
              : 'MediCare AI आपको प्रारंभिक स्वास्थ्य जोखिम मूल्यांकन, 17 विभागों के विशेषज्ञ डॉक्टरों के साथ अपॉइंटमेंट, घर से लैब टेस्ट और जरूरतमंदों के लिए स्वैच्छिक रक्तदाता नेटवर्क की सुविधा प्रदान करता है।'}
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => onNavigate('disease-predict')}
              className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-slate-950 font-black text-sm px-6 py-3 rounded-xl shadow-lg transition flex items-center space-x-2 cursor-pointer transform hover:scale-[1.02]"
            >
              <HeartPulse className="w-5 h-5 text-slate-950" />
              <span>{lang === 'en' ? 'Start AI Symptom Triage' : 'एआई रोग जांच शुरू करें'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('doctors')}
              className="bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-white font-bold text-sm px-6 py-3 rounded-xl transition flex items-center space-x-2 cursor-pointer"
            >
              <Stethoscope className="w-5 h-5 text-teal-400" />
              <span>{lang === 'en' ? 'Browse 17 Specialties' : 'डॉक्टर डायरेक्टरी देखें'}</span>
            </button>

            <button
              onClick={onOpenSOS}
              className="bg-rose-600/90 hover:bg-rose-600 text-white font-bold text-sm px-5 py-3 rounded-xl transition flex items-center space-x-2 border border-rose-500 cursor-pointer"
            >
              <AlertTriangle className="w-5 h-5" />
              <span>{lang === 'en' ? 'Emergency SOS (112)' : 'इमरजेंसी हेल्प'}</span>
            </button>
          </div>

          {/* Key Trust Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-800 text-xs">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
              <span className="text-slate-300">100% Collision-Free Slots</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
              <span className="text-slate-300">17 Verified Specialties</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
              <span className="text-slate-300">8 Blood Groups Supported</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
              <span className="text-slate-300">Bilingual English &amp; हिंदी</span>
            </div>
          </div>
        </div>
      </section>

      {/* 8 Quick Action Cards */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {lang === 'en' ? 'Quick Healthcare Services' : 'मुख्य स्वास्थ्य सेवाएं'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              {lang === 'en'
                ? 'Immediate access to AI assessments, specialist appointments, and emergency blood connectivity'
                : 'रोग जांच, डॉक्टर परामर्श, लैब टेस्ट और रक्तदाता खोज के त्वरित विकल्प'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <div
                key={idx}
                onClick={() => onNavigate(action.id)}
                className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition transform hover:-translate-y-1 cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${action.color} text-white flex items-center justify-center shadow-md group-hover:scale-105 transition`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    {action.badge && (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full border border-slate-200">
                        {action.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="font-black text-slate-900 text-base group-hover:text-teal-700 transition">
                    {action.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{action.desc}</p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-teal-600 group-hover:text-teal-700">
                  <span>{lang === 'en' ? 'Open Module' : 'खोलें'}</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 17 Specialties Directory Showcase */}
      <section className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center space-x-1.5 bg-teal-100 text-teal-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider mb-2">
              <Stethoscope className="w-3.5 h-3.5 text-teal-700" />
              <span>Full Medical Spectrum</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {lang === 'en' ? 'All 17 Certified Specialties' : 'सभी 17 प्रमाणित चिकित्सा विशेषज्ञ'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              {lang === 'en'
                ? 'From routine preventive medicine to complex neurosurgery and oncology care'
                : 'सामान्य स्वास्थ्य से लेकर न्यूरोसर्जरी व कैंसर केयर तक हर क्षेत्र के डॉक्टर'}
            </p>
          </div>

          <button
            onClick={() => onNavigate('doctors')}
            className="self-start sm:self-auto bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center space-x-1.5 cursor-pointer"
          >
            <span>{lang === 'en' ? 'View Doctor Directory' : 'सभी डॉक्टर देखें'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {specialtiesList.map((spec, i) => (
            <div
              key={i}
              onClick={() => onNavigate('doctors', { specialty: spec.name })}
              className="bg-white p-3.5 rounded-xl border border-slate-200 hover:border-teal-500 hover:shadow-sm transition cursor-pointer flex items-start space-x-3 group"
            >
              <span className="text-2xl shrink-0 p-1.5 bg-slate-50 rounded-lg group-hover:scale-110 transition">
                {spec.iconName}
              </span>
              <div>
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-teal-700 transition">
                  {spec.name.split(' — ')[0]}
                </h4>
                {spec.name.includes('—') && (
                  <p className="text-[10px] text-teal-600 font-medium">{spec.name.split(' — ')[1]}</p>
                )}
                <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">{spec.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Blood Connect Feature Banner */}
      <section className="bg-gradient-to-r from-red-950 via-rose-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-red-800/80 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 max-w-xl">
          <div className="inline-flex items-center space-x-2 bg-red-500/20 text-red-200 text-xs font-bold px-3 py-1 rounded-full border border-red-500/30">
            <Droplet className="w-3.5 h-3.5 text-red-400 fill-red-400" />
            <span>Voluntary &amp; Non-Commercial Blood Connect Network</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {lang === 'en'
              ? 'Urgent Blood Units Needed in Your Area'
              : 'आपके क्षेत्र में आपातकालीन रक्त की आवश्यकता'}
          </h3>
          <p className="text-xs sm:text-sm text-red-100/90 leading-relaxed">
            {lang === 'en'
              ? 'Connect directly with verified donors across all 8 ABO/Rh groups (A+, A-, B+, B-, AB+, AB-, O+, O-). All collection and crossmatching is securely routed through licensed blood banks only.'
              : 'सभी 8 रक्त समूहों के दाताओं से सुरक्षित संपर्क करें। रक्त का संग्रह व परीक्षण केवल अधिकृत ब्लड बैंकों के माध्यम से किया जाता है।'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full sm:w-auto">
          <button
            onClick={() => onNavigate('blood-connect', { action: 'request' })}
            className="bg-white hover:bg-slate-100 text-red-950 font-black text-xs px-5 py-3 rounded-xl shadow-md transition flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Activity className="w-4 h-4 text-red-700" />
            <span>{lang === 'en' ? 'Post Blood Request' : 'रक्त आवश्यकता दर्ज करें'}</span>
          </button>
          <button
            onClick={() => onNavigate('blood-connect', { action: 'register' })}
            className="bg-red-800/80 hover:bg-red-800 text-white border border-red-600 font-bold text-xs px-5 py-3 rounded-xl transition flex items-center justify-center space-x-2 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>{lang === 'en' ? 'Register as Voluntary Donor' : 'रक्तदाता के रूप में जुड़ें'}</span>
          </button>
        </div>
      </section>

      {/* Safety & Compliance Disclaimer Card */}
      <section className="bg-slate-100 border border-slate-200 rounded-2xl p-5 text-xs text-slate-600 flex items-start space-x-3.5">
        <ShieldCheck className="w-6 h-6 text-teal-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-bold text-slate-800">
            {lang === 'en' ? 'Medical Disclaimer & Regulatory Adherence' : 'चिकित्सा अस्वीकरण एवं विनियामक अनुपालन'}
          </h4>
          <p className="leading-relaxed">
            {lang === 'en'
              ? 'MediCare AI disease assessments and medical report explanations provide educational screening information only and do NOT constitute confirmed clinical diagnosis or medical prescription. Always consult a qualified registered medical practitioner for physical diagnosis, drug prescriptions, and surgical procedures. In accordance with National Blood Policy guidelines, blood donation is voluntary and non-remunerated.'
              : 'MediCare AI रोग मूल्यांकन केवल सूचना और प्राथमिक जांच के उद्देश्य से है, यह किसी डॉक्टर के प्रत्यक्ष निदान का विकल्प नहीं है। किसी भी दवा अथवा उपचार से पहले पंजीकृत चिकित्सक से सलाह लें।'}
          </p>
        </div>
      </section>
    </div>
  );
};
