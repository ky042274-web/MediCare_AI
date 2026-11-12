import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Video,
  Building2,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  XCircle,
  RefreshCw,
  PhoneCall,
  User as UserIcon,
  Plus,
  ShieldCheck,
} from 'lucide-react';
import type { Appointment, User, UserRole } from '../types/index.ts';
import { api } from '../services/api.ts';
import { VideoConsultationRoom } from '../components/VideoConsultationRoom.tsx';

interface AppointmentsPageProps {
  currentUser: User | null;
  userRole: UserRole;
  lang: 'en' | 'hi';
  onNavigate: (tab: string, extra?: any) => void;
}

export const AppointmentsPage: React.FC<AppointmentsPageProps> = ({
  currentUser,
  userRole,
  lang,
  onNavigate,
}) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  // Video call state
  const [activeCallAppointment, setActiveCallAppointment] = useState<Appointment | null>(null);

  // Reschedule state
  const [rescheduleApt, setRescheduleApt] = useState<Appointment | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleSlot, setRescheduleSlot] = useState('');
  const [rescheduleError, setRescheduleError] = useState<string | null>(null);
  const [isRescheduling, setIsRescheduling] = useState(false);

  // View Prescription Modal State
  const [viewRxApt, setViewRxApt] = useState<Appointment | null>(null);

  const candidateSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '11:30 AM', '02:30 PM', '03:30 PM', '04:30 PM'
  ];

  const loadAppointments = () => {
    setLoading(true);
    // If doctor role, filter by doctor ID, else for patient
    const filter =
      userRole === 'doctor'
        ? { doctorId: currentUser?.doctorProfileId || 'doc_2' }
        : { patientId: currentUser?.id || 'user_patient_1' };

    api.getAppointments(filter).then((res) => {
      if (res.success && res.appointments) {
        setAppointments(res.appointments);
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    loadAppointments();
  }, [userRole, currentUser?.id]);

  const handleCancel = async (id: string) => {
    if (confirm('Are you sure you wish to cancel this appointment slot?')) {
      await api.cancelAppointment(id);
      loadAppointments();
    }
  };

  const handleConfirmReschedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleApt || !rescheduleDate || !rescheduleSlot) return;

    setIsRescheduling(true);
    setRescheduleError(null);

    try {
      const res = await api.rescheduleAppointment(rescheduleApt.id, rescheduleDate, rescheduleSlot);
      if (res.success) {
        setRescheduleApt(null);
        loadAppointments();
      } else {
        setRescheduleError(res.error || 'Failed to reschedule.');
      }
    } catch (err: any) {
      setRescheduleError(err.message || 'Error communicating with server.');
    } finally {
      setIsRescheduling(false);
    }
  };

  const upcomingList = appointments.filter((a) => a.status === 'confirmed' || a.status === 'rescheduled');
  const pastList = appointments.filter((a) => a.status === 'completed' || a.status === 'cancelled');

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 bg-teal-100 text-teal-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider mb-1.5">
            <Calendar className="w-3.5 h-3.5 text-teal-700" />
            <span>Real-Time Scheduling Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {lang === 'en' ? 'My Medical Appointments' : 'मेरे चिकित्सा अपॉइंटमेंट'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {lang === 'en'
              ? 'Manage online video rooms, in-clinic schedules, and download signed e-prescriptions'
              : 'ऑनलाइन वीडियो परामर्श, क्लिनिक विज़िट और डिजिटल पर्चियां देखें व प्रबंधित करें'}
          </p>
        </div>

        <button
          onClick={() => onNavigate('doctors')}
          className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-sm flex items-center space-x-1.5 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{lang === 'en' ? 'Book New Doctor' : 'नया अपॉइंटमेंट बुक करें'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 space-x-6 text-xs font-bold">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`pb-3 transition flex items-center space-x-2 border-b-2 ${
            activeTab === 'upcoming'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>{lang === 'en' ? 'Upcoming & Active' : 'आगामी परामर्श'}</span>
          <span className="bg-teal-100 text-teal-800 text-[10px] px-2 py-0.2 rounded-full">
            {upcomingList.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('past')}
          className={`pb-3 transition flex items-center space-x-2 border-b-2 ${
            activeTab === 'past'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>{lang === 'en' ? 'History & Completed' : 'इतिहास एवं पूर्ण परामर्श'}</span>
          <span className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.2 rounded-full">
            {pastList.length}
          </span>
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 text-xs">
          <span className="inline-block animate-spin mr-2">⟳</span>
          Loading appointments...
        </div>
      ) : activeTab === 'upcoming' ? (
        upcomingList.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
            <Calendar className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="font-bold text-slate-800 text-sm">No Upcoming Consultations</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You currently do not have any scheduled appointments. Select a specialist to schedule a video or clinic visit.
            </p>
            <button
              onClick={() => onNavigate('doctors')}
              className="text-xs font-bold text-teal-600 hover:underline pt-2 inline-block cursor-pointer"
            >
              Browse Doctor Specialties
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingList.map((apt) => (
              <div
                key={apt.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      #{apt.id}
                    </span>
                    <h3 className="text-base font-black text-slate-900 mt-1">{apt.doctorName}</h3>
                    <p className="text-xs font-medium text-teal-600">{apt.doctorSpecialty}</p>
                    <p className="text-[11px] text-slate-500">{apt.doctorHospital}</p>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full capitalize ${
                      apt.status === 'confirmed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {apt.status}
                  </span>
                </div>

                {/* Details */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Date &amp; Slot:</span>
                    </span>
                    <span className="font-bold text-slate-900">
                      {apt.date} at {apt.timeSlot}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center space-x-1">
                      {apt.mode === 'online' ? (
                        <Video className="w-3.5 h-3.5 text-teal-600" />
                      ) : (
                        <Building2 className="w-3.5 h-3.5 text-blue-600" />
                      )}
                      <span>Mode:</span>
                    </span>
                    <span className="font-bold text-slate-900 capitalize">
                      {apt.mode === 'online' ? 'Online Video Room' : 'In-Person Hospital OPD'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-200 text-[11px]">
                    <span className="text-slate-500">Patient:</span>
                    <span className="font-bold text-slate-800">{apt.patientName}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {apt.mode === 'online' && (
                    <button
                      onClick={() => setActiveCallAppointment(apt)}
                      className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs py-2 px-3 rounded-xl transition flex items-center justify-center space-x-1.5 shadow-sm cursor-pointer"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Join Telehealth Call</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setRescheduleApt(apt);
                      setRescheduleDate(apt.date);
                      setRescheduleSlot(apt.timeSlot);
                    }}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2 px-3 rounded-xl transition cursor-pointer"
                  >
                    Reschedule
                  </button>

                  <button
                    onClick={() => handleCancel(apt.id)}
                    className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs py-2 px-3 rounded-xl transition cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>

                {/* View Prescription Button if Available */}
                {apt.prescription && (
                  <button
                    onClick={() => setViewRxApt(apt)}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-teal-300 font-bold text-xs py-2 rounded-xl transition flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-teal-400" />
                    <span>View Digital Prescription (Signed)</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        )
      ) : (
        /* Past Appointments */
        pastList.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-xs text-slate-500">
            No past consultations recorded.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pastList.map((apt) => (
              <div key={apt.id} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 opacity-90">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{apt.doctorName}</h3>
                    <p className="text-xs text-slate-500">{apt.doctorSpecialty}</p>
                    <p className="text-[11px] text-slate-400">{apt.date} • {apt.timeSlot}</p>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                      apt.status === 'completed'
                        ? 'bg-slate-100 text-slate-700'
                        : 'bg-rose-100 text-rose-700'
                    }`}
                  >
                    {apt.status}
                  </span>
                </div>

                {apt.prescription && (
                  <button
                    onClick={() => setViewRxApt(apt)}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-2 rounded-xl transition flex items-center justify-center space-x-1.5"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-teal-600" />
                    <span>View Archived Prescription</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        )
      )}

      {/* Video Call Room Modal */}
      {activeCallAppointment && (
        <VideoConsultationRoom
          appointment={activeCallAppointment}
          onClose={() => {
            setActiveCallAppointment(null);
            loadAppointments();
          }}
          userRole={userRole}
          lang={lang}
        />
      )}

      {/* Reschedule Modal with Collision Check */}
      {rescheduleApt && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Reschedule Appointment #{rescheduleApt.id}
            </h3>
            <p className="text-xs text-slate-500">
              Pick a new date and time slot for your consultation with {rescheduleApt.doctorName}.
            </p>

            {rescheduleError && (
              <div className="bg-rose-50 border border-rose-300 text-rose-800 p-2.5 rounded-lg text-xs">
                {rescheduleError}
              </div>
            )}

            <form onSubmit={handleConfirmReschedule} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Select New Date</label>
                <input
                  type="date"
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Select New Slot</label>
                <select
                  value={rescheduleSlot}
                  onChange={(e) => setRescheduleSlot(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50"
                  required
                >
                  <option value="">Choose slot</option>
                  {candidateSlots.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRescheduleApt(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isRescheduling}
                  className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-5 py-2 rounded-xl transition shadow"
                >
                  {isRescheduling ? 'Checking Slot...' : 'Update Appointment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Digital Prescription Modal */}
      {viewRxApt && viewRxApt.prescription && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-start border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] text-teal-600 font-bold uppercase tracking-wider block">
                  Official Medical Prescription
                </span>
                <h3 className="text-base font-black text-slate-900">{viewRxApt.doctorName}</h3>
                <p className="text-xs text-slate-500">{viewRxApt.doctorSpecialty}</p>
              </div>
              <button
                onClick={() => setViewRxApt(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="text-slate-500 font-bold block mb-0.5">Clinical Diagnosis:</span>
                <p className="text-slate-900 font-medium">{viewRxApt.prescription.diagnosis}</p>
              </div>

              <div>
                <span className="text-slate-700 font-bold block mb-1.5 uppercase text-[11px]">
                  Rx Medications:
                </span>
                <div className="space-y-1.5">
                  {viewRxApt.prescription.medicines.map((m, idx) => (
                    <div key={idx} className="bg-teal-50/60 border border-teal-100 p-2 rounded-lg">
                      <p className="font-bold text-teal-950">{m.name}</p>
                      <p className="text-[11px] text-teal-700">
                        {m.dosage} • {m.frequency} • {m.durationDays} Days
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="text-slate-500 font-bold block mb-0.5">Advice &amp; Instructions:</span>
                <p className="text-slate-800">{viewRxApt.prescription.advice}</p>
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-[11px] text-slate-500">
                <span>Digitally Signed by:</span>
                <strong className="text-slate-800 font-mono">{viewRxApt.prescription.doctorSignature}</strong>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setViewRxApt(null)}
                className="bg-slate-900 text-white font-bold text-xs px-5 py-2 rounded-xl"
              >
                Close Prescription
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
