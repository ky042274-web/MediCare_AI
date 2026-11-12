import React, { useState } from 'react';
import {
  HeartPulse,
  Stethoscope,
  Calendar,
  Droplet,
  FlaskConical,
  FileText,
  BotMessageSquare,
  LayoutDashboard,
  ShieldAlert,
  PhoneCall,
  Menu,
  X,
  ChevronDown,
  UserCheck,
  Languages,
} from 'lucide-react';
import type { UserRole, User } from '../types/index.ts';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  currentUser: User | null;
  onRoleChange: (role: UserRole) => void;
  lang: 'en' | 'hi';
  setLang: (lang: 'en' | 'hi') => void;
  onOpenSOS: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  currentUser,
  onRoleChange,
  lang,
  setLang,
  onOpenSOS,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const roles: { role: UserRole; label: string; desc: string; icon: string }[] = [
    { role: 'patient', label: 'Patient', desc: 'Rahul Sharma (Vitals & Bookings)', icon: '👤' },
    { role: 'doctor', label: 'Doctor', desc: 'Dr. Ananya Sharma (Cardiologist)', icon: '🩺' },
    { role: 'donor', label: 'Blood Donor', desc: 'Vikram Singh (O+ Blood Group)', icon: '🩸' },
    { role: 'hospital_staff', label: 'Lab & Hospital Staff', desc: 'Pooja Verma (Diagnostic Centre)', icon: '🏥' },
    { role: 'admin', label: 'System Admin', desc: 'Chief Medical Oversight', icon: '🛡️' },
  ];

  const navItems = [
    { id: 'home', label: lang === 'en' ? 'Home' : 'मुख्य पृष्ठ', icon: HeartPulse },
    { id: 'disease-predict', label: lang === 'en' ? 'AI Disease Risk' : 'एआई रोग जांच', icon: HeartPulse, highlight: true },
    { id: 'doctors', label: lang === 'en' ? 'Find Doctors' : 'डॉक्टर खोजें', icon: Stethoscope },
    { id: 'appointments', label: lang === 'en' ? 'Appointments' : 'अपॉइंटमेंट', icon: Calendar },
    { id: 'blood-connect', label: lang === 'en' ? 'Blood Connect' : 'ब्लड कनेक्ट', icon: Droplet, badge: 'Active' },
    { id: 'health-tests', label: lang === 'en' ? 'Health Tests' : 'लैब टेस्ट', icon: FlaskConical },
    { id: 'reports', label: lang === 'en' ? 'Medical Reports' : 'मेडिकल रिपोर्ट', icon: FileText },
    { id: 'ai-assistant', label: lang === 'en' ? 'AI Assistant' : 'एआई सहायक', icon: BotMessageSquare },
    { id: 'dashboard', label: lang === 'en' ? 'Dashboard' : 'डैशबोर्ड', icon: LayoutDashboard },
  ];

  return (
    <header className="sticky top-0 z-50 shadow-md">
      {/* Top SOS Emergency Alert Strip */}
      <div className="bg-rose-900 text-rose-50 px-4 py-1.5 text-xs sm:text-sm font-medium flex flex-wrap items-center justify-between border-b border-rose-800">
        <div className="flex items-center space-x-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
          </span>
          <span className="font-semibold text-rose-200 uppercase tracking-wide">
            {lang === 'en' ? 'Emergency 24x7 Protocol:' : '24x7 आपातकालीन हेल्पलाइन:'}
          </span>
          <span className="hidden sm:inline text-rose-100">
            {lang === 'en'
              ? 'Chest pain, stroke signs (FAST), severe trauma? Dial national response immediately:'
              : 'छाती में तेज दर्द या स्ट्रोक के लक्षण? तुरंत राष्ट्रीय आपातकालीन सेवा को कॉल करें:'}
          </span>
        </div>
        <div className="flex items-center space-x-3 mt-1 sm:mt-0">
          <button
            onClick={onOpenSOS}
            className="inline-flex items-center space-x-1.5 bg-rose-600 hover:bg-rose-700 text-white px-2.5 py-0.5 rounded text-xs font-bold transition shadow-sm cursor-pointer"
          >
            <PhoneCall className="w-3 h-3 animate-pulse" />
            <span>{lang === 'en' ? 'SOS Emergency Hub (112 / 108)' : 'आपातकालीन सहायता (112 / 108)'}</span>
          </button>
          <div className="hidden md:flex items-center space-x-2 border-l border-rose-700 pl-3">
            <span className="text-rose-200">Ambulance:</span>
            <span className="font-mono font-bold text-white bg-rose-950 px-1.5 py-0.5 rounded text-xs">108</span>
            <span className="text-rose-200">Police/Disaster:</span>
            <span className="font-mono font-bold text-white bg-rose-950 px-1.5 py-0.5 rounded text-xs">112</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <div
              className="flex items-center space-x-3 cursor-pointer group"
              onClick={() => {
                setCurrentTab('home');
                setMobileMenuOpen(false);
              }}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 via-cyan-500 to-blue-600 p-0.5 shadow-lg group-hover:scale-105 transition transform">
                <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                  <HeartPulse className="w-6 h-6 text-teal-400 group-hover:text-teal-300 transition" />
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white font-heading">
                    MediCare <span className="text-teal-400">AI</span>
                  </span>
                  <span className="bg-teal-500/20 text-teal-300 text-[10px] font-semibold px-2 py-0.5 rounded border border-teal-500/30">
                    Bilingual v2.4
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 hidden sm:block tracking-wide">
                  Intelligent Hospital &amp; Blood Connect
                </p>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden xl:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentTab(item.id)}
                    className={`relative px-3 py-2 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
                      isActive
                        ? 'bg-teal-600 text-white shadow-sm'
                        : item.highlight
                        ? 'bg-teal-950/60 text-teal-300 border border-teal-500/30 hover:bg-teal-900/50'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="bg-rose-500 text-white text-[9px] px-1.5 py-0.2 rounded-full font-bold ml-1 animate-pulse">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Right Controls: Role Switcher & Language Switcher */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Language Toggle */}
              <button
                onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
                title="Toggle Language (English / हिन्दी)"
              >
                <Languages className="w-3.5 h-3.5 text-teal-400" />
                <span className="font-bold">{lang === 'en' ? 'हिन्दी' : 'English'}</span>
              </button>

              {/* Role Switcher Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                  className="flex items-center space-x-2 bg-gradient-to-r from-slate-800 to-slate-850 hover:bg-slate-750 text-slate-100 px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-medium shadow-sm transition"
                >
                  <div className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-xs">
                    {roles.find((r) => r.role === currentUser?.role)?.icon || '👤'}
                  </div>
                  <div className="text-left hidden md:block">
                    <p className="text-[10px] text-slate-400 uppercase leading-none font-semibold">Role View</p>
                    <p className="font-bold text-teal-300 capitalize text-xs">
                      {currentUser?.role ? currentUser.role.replace('_', ' ') : 'Patient'}
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {roleDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-slate-850 border border-slate-700 rounded-xl shadow-2xl py-2 z-50 bg-slate-900 text-slate-100">
                    <div className="px-3 py-2 border-b border-slate-800">
                      <p className="text-xs font-bold text-teal-400">Switch Application Role</p>
                      <p className="text-[11px] text-slate-400">
                        Test hospital workflows under different security permissions:
                      </p>
                    </div>
                    {roles.map((r) => (
                      <button
                        key={r.role}
                        onClick={() => {
                          onRoleChange(r.role);
                          setRoleDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 flex items-start space-x-3 hover:bg-slate-800 transition ${
                          currentUser?.role === r.role ? 'bg-teal-950/40 border-l-2 border-teal-400' : ''
                        }`}
                      >
                        <span className="text-lg">{r.icon}</span>
                        <div>
                          <p className="text-xs font-bold text-white flex items-center">
                            {r.label}
                            {currentUser?.role === r.role && (
                              <UserCheck className="w-3.5 h-3.5 ml-1.5 text-teal-400" />
                            )}
                          </p>
                          <p className="text-[11px] text-slate-400">{r.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile Menu Toggle Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="xl:hidden p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="xl:hidden border-t border-slate-800 bg-slate-900 px-4 pt-3 pb-6 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-between transition ${
                    isActive
                      ? 'bg-teal-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className="w-4 h-4 text-teal-400" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </nav>
    </header>
  );
};
