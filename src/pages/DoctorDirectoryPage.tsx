import React, { useState, useEffect } from 'react';
import {
  Stethoscope,
  Search,
  Filter,
  Video,
  Building2,
  Calendar,
  Star,
  ShieldCheck,
  MapPin,
  Clock,
  Languages,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import type { Doctor, Specialty, User } from '../types/index.ts';
import { api } from '../services/api.ts';
import { AppointmentBookingModal } from '../components/AppointmentBookingModal.tsx';

interface DoctorDirectoryPageProps {
  initialSpecialty?: string;
  currentUser: User | null;
  lang: 'en' | 'hi';
  onNavigate: (tab: string, extra?: any) => void;
}

export const DoctorDirectoryPage: React.FC<DoctorDirectoryPageProps> = ({
  initialSpecialty,
  currentUser,
  lang,
  onNavigate,
}) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>(initialSpecialty || 'all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedMode, setSelectedMode] = useState<string>('all');

  // Booking Modal State
  const [bookingDoctor, setBookingDoctor] = useState<Doctor | null>(null);

  const specialtiesList: Specialty[] = [
    'General Physician',
    'Cardiologist — Heart Specialist',
    'Neurologist — Brain and Nerve Specialist',
    'Neurosurgeon — Brain and Spine Surgery Specialist',
    'Pediatrician — Children\'s Doctor',
    'Gynecologist — Women\'s Health Specialist',
    'Orthopedic — Bone and Joint Specialist',
    'Dermatologist — Skin Specialist',
    'ENT Specialist — Ear, Nose and Throat',
    'Ophthalmologist — Eye Specialist',
    'Psychiatrist — Mental Health Specialist',
    'Endocrinologist — Diabetes and Hormone Specialist',
    'Nephrologist — Kidney Specialist',
    'Gastroenterologist — Digestive System Specialist',
    'Pulmonologist — Lung and Respiratory Specialist',
    'Oncologist — Cancer Specialist',
    'Dentist — Dental Specialist',
  ];

  const cities = ['New Delhi', 'Mumbai', 'Bengaluru', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune'];

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    api
      .getDoctors({
        specialty: selectedSpecialty !== 'all' ? selectedSpecialty : undefined,
        city: selectedCity !== 'all' ? selectedCity : undefined,
        mode: selectedMode !== 'all' ? selectedMode : undefined,
        search: searchQuery || undefined,
      })
      .then((res) => {
        if (isMounted) {
          if (res.success && res.doctors) {
            setDoctors(res.doctors);
          }
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [selectedSpecialty, selectedCity, selectedMode, searchQuery]);

  return (
    <div className="space-y-6 pb-16">
      {/* Directory Hero */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center space-x-2 bg-teal-500/20 text-teal-300 px-3 py-1 rounded-full text-xs font-bold border border-teal-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'Verified Medical Registry' : 'सत्यापित मेडिकल काउंसिल पंजीकरण'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            {lang === 'en' ? 'Doctor Directory & Online Consultation' : 'डॉक्टर डायरेक्टरी एवं ऑनलाइन परामर्श'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {lang === 'en'
              ? 'Find verified physicians and surgeons across all 17 clinical disciplines. Schedule video consultations or in-person hospital visits with guaranteed slot collision prevention.'
              : 'सभी 17 विभागों के वरिष्ठ चिकित्सकों से ऑनलाइन वीडियो या क्लिनिक में परामर्श लें। बिना किसी स्लॉट टकराव के तुरंत अपॉइंटमेंट बुक करें।'}
          </p>
        </div>

        {/* Development Data Notice */}
        <div className="mt-4 inline-flex items-center space-x-1.5 bg-slate-800/80 text-amber-300 text-[11px] px-3 py-1 rounded-lg border border-slate-700">
          <span className="w-2 h-2 rounded-full bg-amber-400"></span>
          <span>
            {lang === 'en'
              ? 'Sample Medical Data for Development Demonstration: Doctors and registration IDs are simulated for testing.'
              : 'डेवलपमेंट डेमो डेटा: डॉक्टर प्रोफाइल एवं रजिस्ट्रेशन नंबर परीक्षण हेतु सांकेतिक हैं।'}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder={
                lang === 'en'
                  ? 'Search by doctor name, specialty, hospital, or city...'
                  : 'डॉक्टर, विशेषता अथवा अस्पताल के नाम से खोजें...'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 bg-slate-50"
            />
          </div>

          {/* Specialty Filter */}
          <div className="w-full md:w-64">
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="w-full text-xs py-3 px-3 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-800 focus:outline-none focus:border-teal-500"
            >
              <option value="all">{lang === 'en' ? 'All 17 Specialties' : 'सभी 17 विभाग'}</option>
              {specialtiesList.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
          </div>

          {/* City Filter */}
          <div className="w-full md:w-44">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full text-xs py-3 px-3 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-800 focus:outline-none focus:border-teal-500"
            >
              <option value="all">{lang === 'en' ? 'All Cities' : 'सभी शहर'}</option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Consultation Mode Filter */}
          <div className="w-full md:w-40">
            <select
              value={selectedMode}
              onChange={(e) => setSelectedMode(e.target.value)}
              className="w-full text-xs py-3 px-3 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-800 focus:outline-none focus:border-teal-500"
            >
              <option value="all">{lang === 'en' ? 'All Modes' : 'सभी माध्यम'}</option>
              <option value="online">Online Video</option>
              <option value="in-person">In-Clinic Visit</option>
            </select>
          </div>
        </div>

        {/* Specialty Quick Chips */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pt-1 pb-1 text-xs">
          <span className="text-[11px] text-slate-400 font-bold uppercase shrink-0 mr-1">
            {lang === 'en' ? 'Quick Filter:' : 'त्वरित चयन:'}
          </span>
          <button
            onClick={() => setSelectedSpecialty('all')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold shrink-0 transition ${
              selectedSpecialty === 'all'
                ? 'bg-teal-700 text-white font-bold'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            All Specialties
          </button>
          {specialtiesList.slice(0, 6).map((spec) => (
            <button
              key={spec}
              onClick={() => setSelectedSpecialty(spec)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold shrink-0 transition ${
                selectedSpecialty === spec
                  ? 'bg-teal-700 text-white font-bold'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {spec.split(' — ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Doctor Cards Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 text-sm">
          <span className="inline-block animate-spin mr-2">⟳</span>
          Loading doctor network...
        </div>
      ) : doctors.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <Stethoscope className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Doctors Match Current Filters</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search criteria or resetting filters to view all available practitioners.
          </p>
          <button
            onClick={() => {
              setSelectedSpecialty('all');
              setSelectedCity('all');
              setSelectedMode('all');
              setSearchQuery('');
            }}
            className="text-xs font-bold text-teal-600 hover:underline pt-2 inline-block"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {doctors.map((doctor) => (
            <div
              key={doctor.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between overflow-hidden"
            >
              {/* Top Doctor Info */}
              <div className="p-5 space-y-3">
                <div className="flex items-start space-x-3.5">
                  <img
                    src={doctor.avatarUrl}
                    alt={doctor.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-500/40 shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center space-x-1.5 flex-wrap">
                      <h3 className="font-black text-slate-900 text-base">{doctor.name}</h3>
                      {doctor.isVerified && (
                        <span className="inline-flex items-center space-x-0.5 text-emerald-600 text-[10px] font-bold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Verified</span>
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-teal-700 font-bold leading-tight">
                      {doctor.specialty}
                    </p>
                    <p className="text-[10px] text-slate-500">{doctor.verifiedQualifications}</p>
                  </div>
                </div>

                <div className="text-xs text-slate-600 space-y-1 pt-1 border-t border-slate-100">
                  <div className="flex items-center space-x-1.5 text-slate-700 font-medium">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="line-clamp-1">{doctor.hospitalOrClinic}</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-slate-500 text-[11px]">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{doctor.city}</span>
                    <span>•</span>
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{doctor.experienceYears} Years Exp.</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-slate-500 text-[11px]">
                    <Languages className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Speaks: {doctor.languagesSpoken.join(', ')}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {doctor.consultationModes.includes('online') && (
                    <span className="inline-flex items-center space-x-1 text-[10px] font-semibold bg-teal-50 text-teal-800 border border-teal-200 px-2 py-0.5 rounded-md">
                      <Video className="w-3 h-3 text-teal-600" />
                      <span>Online Video</span>
                    </span>
                  )}
                  {doctor.consultationModes.includes('in-person') && (
                    <span className="inline-flex items-center space-x-1 text-[10px] font-semibold bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded-md">
                      <Building2 className="w-3 h-3 text-blue-600" />
                      <span>In-Clinic Visit</span>
                    </span>
                  )}
                  <span className="inline-flex items-center space-x-1 text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-md">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span>{doctor.rating} ({doctor.reviewCount})</span>
                  </span>
                </div>
              </div>

              {/* Bottom Action Footer */}
              <div className="bg-slate-50 px-5 py-3.5 border-t border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Consultation Fee</span>
                  <span className="text-base font-black text-slate-900">₹{doctor.consultationFee}</span>
                </div>

                <button
                  onClick={() => setBookingDoctor(doctor)}
                  className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition flex items-center space-x-1.5 shadow-sm cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{lang === 'en' ? 'Book Appointment' : 'अपॉइंटमेंट लें'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking Modal */}
      {bookingDoctor && (
        <AppointmentBookingModal
          doctor={bookingDoctor}
          currentUser={currentUser}
          isOpen={!!bookingDoctor}
          onClose={() => setBookingDoctor(null)}
          onBookingSuccess={(apt) => {
            // Can redirect to appointments
            setTimeout(() => {
              onNavigate('appointments');
            }, 1200);
          }}
          lang={lang}
        />
      )}
    </div>
  );
};
