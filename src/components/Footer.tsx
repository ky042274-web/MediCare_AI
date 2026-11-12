import React, { useState } from 'react';
import { HeartPulse, Droplet, ShieldCheck, PhoneCall, Stethoscope, FileText, Lock } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
  lang: 'en' | 'hi';
  onOpenSOS: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, lang, onOpenSOS }) => {
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [showDisclaimerModal, setShowDisclaimerModal] = useState(false);

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-500 text-slate-950 flex items-center justify-center font-black">
                <HeartPulse className="w-5 h-5 text-slate-950" />
              </div>
              <span className="font-extrabold text-lg text-white font-heading">
                MediCare <span className="text-teal-400">AI</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Predict Diseases Early. Connect with Doctors. Save Lives Through Blood Donation.
            </p>
            <div className="pt-1 flex items-center space-x-2 text-[11px] text-teal-400">
              <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
              <span>Verified Hospital Specialties &amp; Voluntary Donors</span>
            </div>
          </div>

          {/* Clinical Modules */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              Clinical Modules
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <button onClick={() => onNavigate('disease-predict')} className="hover:text-teal-300 transition">
                  AI Disease Risk Triage
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('doctors')} className="hover:text-teal-300 transition">
                  17 Specialties Doctor Directory
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('appointments')} className="hover:text-teal-300 transition">
                  Collision-Free Appointment Booking
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('health-tests')} className="hover:text-teal-300 transition">
                  Diagnostic Health Tests &amp; Home Sample
                </button>
              </li>
            </ul>
          </div>

          {/* Blood Connect & AI */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              Blood &amp; Records
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <button onClick={() => onNavigate('blood-connect')} className="hover:text-teal-300 transition">
                  Blood Connect (8 ABO/Rh Groups)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('reports')} className="hover:text-teal-300 transition">
                  Electronic Health Records &amp; AI Analysis
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('ai-assistant')} className="hover:text-teal-300 transition">
                  Bilingual AI Health Assistant
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-teal-300 transition">
                  Role Workspaces (Patient/Doc/Admin)
                </button>
              </li>
            </ul>
          </div>

          {/* Emergency & Legal */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              24/7 Emergency &amp; Support
            </h4>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              For life-threatening symptoms, dial national emergency ambulance services immediately:
            </p>
            <button
              onClick={onOpenSOS}
              className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center space-x-1.5 transition"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>National Response (108 / 112)</span>
            </button>
            <div className="pt-2 flex flex-col space-y-1 text-[11px] text-slate-500">
              <button
                onClick={() => setShowDisclaimerModal(true)}
                className="text-left hover:text-teal-400 transition underline"
              >
                Medical Safety Disclaimer
              </button>
              <button
                onClick={() => setShowPolicyModal(true)}
                className="text-left hover:text-teal-400 transition underline"
              >
                Voluntary Blood Policy &amp; Privacy
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="border-t border-slate-900 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-3">
          <p>© 2026 MediCare AI. Designed for Intelligent Healthcare Management &amp; Early Disease Prevention.</p>
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <Lock className="w-3 h-3 text-teal-400" />
              <span>Protected Health Data Standards</span>
            </span>
            <span>•</span>
            <span>Non-Commercial Blood Transfusion</span>
          </div>
        </div>
      </div>

      {/* Medical Disclaimer Modal */}
      {showDisclaimerModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 text-slate-200 rounded-2xl max-w-lg w-full p-6 border border-slate-800 shadow-2xl space-y-4 text-xs">
            <h3 className="text-base font-black text-white">Official Medical &amp; AI Disclaimer</h3>
            <p className="leading-relaxed">
              MediCare AI provides preliminary health screening, educational guidance, and doctor scheduling. The AI models (Gemini) do NOT provide an official clinical diagnosis, nor do they prescribe medications or dosages independently.
            </p>
            <p className="leading-relaxed">
              Always consult a qualified, registered medical practitioner for any health concerns or physical diagnosis. In an acute medical emergency, do not rely on digital assessments—contact 112 / 108 or visit the nearest emergency department immediately.
            </p>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowDisclaimerModal(false)}
                className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-4 py-2 rounded-xl"
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Voluntary Blood Policy Modal */}
      {showPolicyModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 text-slate-200 rounded-2xl max-w-lg w-full p-6 border border-slate-800 shadow-2xl space-y-4 text-xs">
            <h3 className="text-base font-black text-white">Voluntary Blood Policy &amp; Privacy</h3>
            <p className="leading-relaxed">
              1. Voluntary &amp; Non-Remunerated: In compliance with the National Blood Policy and Drugs &amp; Cosmetics Act, all blood donations facilitated through MediCare AI are strictly voluntary. Buying or selling of blood is illegal and prohibited.
            </p>
            <p className="leading-relaxed">
              2. Licensed Facilities Only: MediCare AI facilitates communication between donors and verified hospital coordinators. All biological crossmatching, infectious disease screening, and blood collection must be performed at licensed blood banks.
            </p>
            <p className="leading-relaxed">
              3. Privacy Protection: Donor telephone numbers and home addresses are never published in public search results. Contact is established through protected consent mechanisms.
            </p>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowPolicyModal(false)}
                className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-4 py-2 rounded-xl"
              >
                Close Policy
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
