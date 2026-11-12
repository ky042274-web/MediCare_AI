import React from 'react';
import { ShieldAlert, PhoneCall, AlertTriangle, X, MapPin, Activity, CheckCircle2 } from 'lucide-react';

interface EmergencySOSModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'en' | 'hi';
}

export const EmergencySOSModal: React.FC<EmergencySOSModalProps> = ({ isOpen, onClose, lang }) => {
  if (!isOpen) return null;

  const emergencyContacts = [
    { number: '108', label: lang === 'en' ? 'National Ambulance Service' : 'राष्ट्रीय एम्बुलेंस सेवा', desc: 'Free 24x7 Emergency Medical Response', color: 'bg-rose-600' },
    { number: '112', label: lang === 'en' ? 'Unified Emergency Helpline' : 'एकीकृत राष्ट्रीय आपातकालीन हेल्पलाइन', desc: 'Police, Fire, Ambulance, Disaster Services', color: 'bg-red-700' },
    { number: '1075', label: lang === 'en' ? 'National Health Helpline' : 'राष्ट्रीय स्वास्थ्य हेल्पलाइन', desc: 'MoHFW Clinical Guidance & Triage', color: 'bg-amber-600' },
    { number: '104', label: lang === 'en' ? 'Blood Bank & Medical Advice' : 'ब्लड बैंक और स्वास्थ्य मार्गदर्शन', desc: 'State Blood Availability Triage', color: 'bg-emerald-600' },
  ];

  const redFlags = [
    {
      en: 'Crushing chest pain radiating to left arm, neck, or jaw',
      hi: 'छाती में तेज दबाव या दर्द जो बाएं हाथ, गर्दन या जबड़े तक फैल रहा हो',
      action: 'Sit still, loosen tight clothing, call 108 immediately. Do NOT drive yourself.',
    },
    {
      en: 'FAST Stroke signs: Facial drooping, Arm weakness, Slurred speech',
      hi: 'स्ट्रोक के लक्षण: चेहरे का टेढ़ापन, हाथ में कमजोरी, बोलने में लड़खड़ाहट',
      action: 'Every minute matters for brain tissue. Request immediate stroke-ready ICU transport.',
    },
    {
      en: 'Severe breathlessness, inability to speak full sentences, blue lips',
      hi: 'सांस लेने में अत्यधिक कठिनाई, पूरे वाक्य न बोल पाना, होंठ नीले पड़ना',
      action: 'Sit upright in comfortable position, check oxygen saturation if pulse oximeter is available.',
    },
    {
      en: 'Uncontrolled heavy bleeding, deep arterial laceration, or major head trauma',
      hi: 'अनियंत्रित अत्यधिक रक्तस्राव, गहरी चोट या सिर में गंभीर आघात',
      action: 'Apply firm, continuous pressure with a clean sterile cloth; keep patient elevated.',
    },
  ];

  const traumaCentres = [
    { name: 'AIIMS Apex Trauma Centre', city: 'South Delhi, New Delhi', phone: '+91 11 2673 1000', open: '24 Hours Emergency' },
    { name: 'Fortis Escorts Emergency & Cardiac Cath Lab', city: 'Okhla, New Delhi', phone: '+91 11 4713 5000', open: '24/7 Cardiac Emergency' },
    { name: 'KEM Hospital & KEM Emergency Wing', city: 'Parel, Mumbai', phone: '+91 22 2410 7000', open: '24/7 Level 1 Trauma' },
    { name: 'Manipal Hospital Critical Care Centre', city: 'HAL Airport Rd, Bengaluru', phone: '+91 80 2502 4444', open: '24/7 Stroke & Trauma' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border-4 border-rose-500 overflow-hidden transform transition-all animate-in fade-in zoom-in duration-150">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-700 via-rose-600 to-red-800 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white">
              <ShieldAlert className="w-7 h-7 animate-bounce" />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight">
                {lang === 'en' ? 'Emergency 24x7 Care Protocol' : '24x7 आपातकालीन चिकित्सा प्रोटोकॉल'}
              </h2>
              <p className="text-rose-100 text-xs sm:text-sm">
                {lang === 'en'
                  ? 'If a life is at immediate risk, dial national emergency hotlines below without waiting'
                  : 'यदि जीवन पर तात्कालिक खतरा है, तो बिना प्रतीक्षा किए नीचे दिए गए नंबरों पर संपर्क करें'}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Quick Call Numbers */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              {lang === 'en' ? 'Direct Toll-Free Emergency Lines' : 'निःशुल्क आपातकालीन संपर्क नंबर'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {emergencyContacts.map((c) => (
                <a
                  key={c.number}
                  href={`tel:${c.number}`}
                  className="flex items-center justify-between p-3.5 rounded-xl border-2 border-slate-200 hover:border-rose-400 bg-slate-50 hover:bg-rose-50/50 transition group cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <span className={`${c.color} text-white font-mono text-xl font-black px-3 py-1.5 rounded-lg shadow-sm`}>
                      {c.number}
                    </span>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm group-hover:text-rose-700 transition">
                        {c.label}
                      </h4>
                      <p className="text-[11px] text-slate-500">{c.desc}</p>
                    </div>
                  </div>
                  <PhoneCall className="w-5 h-5 text-rose-600 group-hover:scale-110 transition" />
                </a>
              ))}
            </div>
          </div>

          {/* Red Flag Symptoms */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-center space-x-2 text-amber-800 font-bold text-sm mb-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <span>{lang === 'en' ? 'Critical Red-Flag Symptoms (Seek Immediate ER Care)' : 'अति-गंभीर लक्षण (तुरंत इमरजेंसी कक्ष जाएं)'}</span>
            </div>
            <div className="space-y-3 mt-3">
              {redFlags.map((flag, idx) => (
                <div key={idx} className="bg-white p-3 rounded-lg border border-amber-100 text-xs">
                  <p className="font-bold text-slate-900">
                    {lang === 'en' ? flag.en : flag.hi}
                  </p>
                  <p className="text-slate-600 mt-1 flex items-start space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                    <span><strong className="text-slate-800">Action:</strong> {flag.action}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Partner Trauma Hospitals */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <MapPin className="w-3.5 h-3.5 text-teal-600" />
              <span>{lang === 'en' ? 'Verified 24/7 Level-1 Trauma & Emergency Hubs' : 'प्रमाणित 24/7 ट्रॉमा एवं इमरजेंसी केंद्र'}</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {traumaCentres.map((h, i) => (
                <div key={i} className="p-3 border border-slate-200 rounded-lg bg-slate-50">
                  <p className="font-bold text-slate-900">{h.name}</p>
                  <p className="text-slate-500 text-[11px]">{h.city}</p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200">
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded">
                      {h.open}
                    </span>
                    <a href={`tel:${h.phone}`} className="font-bold text-teal-700 hover:text-teal-900 flex items-center space-x-1">
                      <PhoneCall className="w-3 h-3" />
                      <span>{h.phone}</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-[11px] text-slate-500 bg-slate-100 p-3 rounded-lg border border-slate-200">
            <strong>Medical Safety Disclaimer:</strong> MediCare AI does not deliver independent emergency intervention. For true life-threatening crises, immediately contact local emergency medical services (108/112) or reach your nearest licensed hospital emergency room.
          </div>
        </div>

        <div className="bg-slate-100 px-6 py-4 flex justify-end border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-sm rounded-xl transition"
          >
            {lang === 'en' ? 'Close Emergency Hub' : 'बंद करें'}
          </button>
        </div>
      </div>
    </div>
  );
};
