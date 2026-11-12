import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  Building2,
  CheckCircle2,
  AlertCircle,
  X,
  CreditCard,
  User as UserIcon,
  ShieldCheck,
  QrCode,
  FileText,
} from 'lucide-react';
import type { Doctor, Appointment, User } from '../types/index.ts';
import { api } from '../services/api.ts';

interface AppointmentBookingModalProps {
  doctor: Doctor;
  currentUser: User | null;
  isOpen: boolean;
  onClose: () => void;
  onBookingSuccess: (appointment: Appointment) => void;
  lang: 'en' | 'hi';
}

export const AppointmentBookingModal: React.FC<AppointmentBookingModalProps> = ({
  doctor,
  currentUser,
  isOpen,
  onClose,
  onBookingSuccess,
  lang,
}) => {
  if (!isOpen) return null;

  // Generate the next 7 days for booking
  const dates = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const formatted = `${yyyy}-${mm}-${dd}`;
    return {
      date: formatted,
      dayName,
      displayDate: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    };
  });

  const [selectedDate, setSelectedDate] = useState(dates[0].date);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [selectedMode, setSelectedMode] = useState<'online' | 'in-person'>('online');
  const [symptoms, setSymptoms] = useState('');
  const [patientName, setPatientName] = useState(currentUser?.name || 'Rahul Sharma');
  const [patientPhone, setPatientPhone] = useState(currentUser?.phone || '+91 98765 43210');

  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slots, setSlots] = useState<{ time: string; isAvailable: boolean }[]>([]);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);

  // Load slots when selectedDate or doctor changes
  useEffect(() => {
    let isMounted = true;
    setSlotsLoading(true);
    setBookingError(null);
    setSelectedSlot('');

    api.getDoctorById(doctor.id, selectedDate).then((res) => {
      if (isMounted) {
        if (res.success && res.slots) {
          setSlots(res.slots);
          // Pick first available slot by default
          const firstAvail = res.slots.find((s) => s.isAvailable);
          if (firstAvail) setSelectedSlot(firstAvail.time);
        }
        setSlotsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [doctor.id, selectedDate]);

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) {
      setBookingError(lang === 'en' ? 'Please select a valid time slot.' : 'कृपया समय स्लॉट चुनें।');
      return;
    }

    setBookingLoading(true);
    setBookingError(null);

    try {
      const res = await api.bookAppointment({
        patientId: currentUser?.id || 'user_patient_1',
        patientName,
        patientPhone,
        doctorId: doctor.id,
        date: selectedDate,
        timeSlot: selectedSlot,
        mode: selectedMode,
        symptoms,
      });

      if (res.success && res.appointment) {
        setConfirmedAppointment(res.appointment);
        onBookingSuccess(res.appointment);
      } else {
        setBookingError(res.error || 'Failed to complete appointment reservation.');
      }
    } catch (err: any) {
      setBookingError(err.message || 'Network error while booking appointment.');
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden transform transition-all animate-in fade-in zoom-in duration-150">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <img
              src={doctor.avatarUrl}
              alt={doctor.name}
              className="w-12 h-12 rounded-xl object-cover border-2 border-teal-500/50"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-base text-white">{doctor.name}</h3>
                <span className="bg-teal-500/20 text-teal-300 text-[10px] px-2 py-0.5 rounded border border-teal-500/30">
                  {doctor.registrationNumber}
                </span>
              </div>
              <p className="text-xs text-teal-300 font-medium">{doctor.specialty}</p>
              <p className="text-[11px] text-slate-400">{doctor.hospitalOrClinic}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {confirmedAppointment ? (
          /* Confirmation Receipt View */
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-black text-slate-900">
              {lang === 'en' ? 'Appointment Confirmed!' : 'अपॉइंटमेंट सफलतापूर्वक बुक हो गया!'}
            </h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              {lang === 'en'
                ? 'Your appointment has been reserved with zero slot overlap. An SMS reminder and email summary have been dispatched.'
                : 'आपका अपॉइंटमेंट सुरक्षित रूप से आरक्षित कर लिया गया है।'}
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 max-w-md mx-auto text-left text-xs space-y-2">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Booking Reference:</span>
                <span className="font-mono font-bold text-slate-900">#{confirmedAppointment.id}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Date &amp; Time:</span>
                <span className="font-bold text-teal-700">
                  {confirmedAppointment.date} at {confirmedAppointment.timeSlot}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Consultation Mode:</span>
                <span className="font-bold capitalize text-slate-900 flex items-center space-x-1">
                  {confirmedAppointment.mode === 'online' ? (
                    <>
                      <Video className="w-3.5 h-3.5 text-teal-600" />
                      <span>Online Video Room</span>
                    </>
                  ) : (
                    <>
                      <Building2 className="w-3.5 h-3.5 text-blue-600" />
                      <span>In-Clinic Hospital Visit</span>
                    </>
                  )}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Doctor Fee:</span>
                <span className="font-bold text-slate-900">₹{confirmedAppointment.fee}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-500">Patient:</span>
                <span className="font-bold text-slate-900">{confirmedAppointment.patientName}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-center space-x-3">
              <button
                onClick={onClose}
                className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition shadow-sm"
              >
                {lang === 'en' ? 'Done & View in Dashboard' : 'पूर्ण / डैशबोर्ड देखें'}
              </button>
            </div>
          </div>
        ) : (
          /* Booking Form */
          <form onSubmit={handleConfirmBooking} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
            
            {bookingError && (
              <div className="bg-rose-50 border border-rose-300 rounded-xl p-3 text-xs text-rose-800 flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">Booking Collision Alert</strong>
                  <span>{bookingError}</span>
                </div>
              </div>
            )}

            {/* Mode selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                {lang === 'en' ? 'Select Consultation Mode' : 'परामर्श माध्यम चुनें'}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedMode('online')}
                  className={`p-3 rounded-xl border-2 text-left flex items-center space-x-3 transition cursor-pointer ${
                    selectedMode === 'online'
                      ? 'border-teal-600 bg-teal-50 text-teal-950 font-bold'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <Video className={`w-5 h-5 ${selectedMode === 'online' ? 'text-teal-600' : 'text-slate-400'}`} />
                  <div>
                    <p className="text-xs font-bold">Online Video Call</p>
                    <p className="text-[10px] text-slate-500">Encrypted in-app video room</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMode('in-person')}
                  className={`p-3 rounded-xl border-2 text-left flex items-center space-x-3 transition cursor-pointer ${
                    selectedMode === 'in-person'
                      ? 'border-teal-600 bg-teal-50 text-teal-950 font-bold'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <Building2 className={`w-5 h-5 ${selectedMode === 'in-person' ? 'text-teal-600' : 'text-slate-400'}`} />
                  <div>
                    <p className="text-xs font-bold">In-Clinic Visit</p>
                    <p className="text-[10px] text-slate-500">{doctor.city} Hospital OPD</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Date Selection Bar */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center space-x-1">
                <CalendarIcon className="w-3.5 h-3.5 text-teal-600" />
                <span>{lang === 'en' ? 'Select Appointment Date' : 'तारीख चुनें'}</span>
              </label>
              <div className="grid grid-cols-7 gap-1.5">
                {dates.map((d) => (
                  <button
                    key={d.date}
                    type="button"
                    onClick={() => setSelectedDate(d.date)}
                    className={`py-2 px-1 text-center rounded-xl border transition cursor-pointer ${
                      selectedDate === d.date
                        ? 'border-teal-600 bg-teal-600 text-white shadow-sm font-bold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <p className="text-[10px] uppercase font-semibold">{d.dayName}</p>
                    <p className="text-xs font-bold">{d.displayDate.split(' ')[1]}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Time Slot Selection with Atomic Collision Check */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span className="flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-teal-600" />
                  <span>{lang === 'en' ? 'Available Time Slots' : 'उपलब्ध समय स्लॉट'}</span>
                </span>
                <span className="text-[11px] text-slate-400 font-normal">
                  30 mins slot duration
                </span>
              </label>

              {slotsLoading ? (
                <div className="p-6 text-center text-xs text-slate-500">
                  <span className="inline-block animate-spin mr-2">⟳</span>
                  Checking real-time doctor availability...
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {slots.map((slot) => {
                    const isSelected = selectedSlot === slot.time;
                    return (
                      <button
                        key={slot.time}
                        type="button"
                        disabled={!slot.isAvailable}
                        onClick={() => setSelectedSlot(slot.time)}
                        className={`py-2 px-2 rounded-lg text-xs font-semibold text-center transition cursor-pointer border ${
                          !slot.isAvailable
                            ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60 line-through'
                            : isSelected
                            ? 'bg-teal-600 text-white border-teal-600 shadow-sm font-bold'
                            : 'bg-white text-slate-800 border-slate-200 hover:border-teal-400'
                        }`}
                      >
                        {slot.time}
                        {!slot.isAvailable && (
                          <span className="block text-[9px] text-rose-500 not-italic no-underline">Booked</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Symptoms / Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                {lang === 'en' ? 'Reason for Visit / Symptoms' : 'लक्षण अथवा परामर्श का कारण'}
              </label>
              <textarea
                rows={2}
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder={
                  lang === 'en'
                    ? 'E.g., Mild chest palpitation, routine blood pressure checkup, fatigue...'
                    : 'उदा. हल्का सिरदर्द, रक्तचाप जांच, आदि...'
                }
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-teal-600"
              />
            </div>

            {/* Patient details confirmation */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-[11px] text-slate-500 block">Patient Name</label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="font-bold text-slate-900 bg-transparent border-b border-slate-300 w-full focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-500 block">Contact Mobile</label>
                <input
                  type="text"
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  className="font-bold text-slate-900 bg-transparent border-b border-slate-300 w-full focus:outline-none"
                />
              </div>
            </div>

            {/* Price summary & Submit */}
            <div className="border-t border-slate-200 pt-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-500 block">Total Consultation Fee</span>
                <span className="text-xl font-black text-slate-900">₹{doctor.consultationFee}</span>
                <span className="text-[10px] text-slate-400 ml-1.5">(Inclusive of GST)</span>
              </div>

              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={bookingLoading || !selectedSlot}
                  className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl transition shadow-md disabled:opacity-50 cursor-pointer flex items-center space-x-1.5"
                >
                  {bookingLoading ? (
                    <span>Securing Slot...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirm &amp; Book Slot</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
