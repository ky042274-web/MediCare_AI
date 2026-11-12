import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  User,
  HeartPulse,
  Calendar,
  Clock,
  Droplet,
  FileText,
  ShieldCheck,
  Stethoscope,
  Activity,
  AlertTriangle,
  Building2,
  CheckCircle2,
  Edit,
  Video,
  Plus,
  ArrowRight,
  RefreshCw,
  PhoneCall,
  Save,
  Lock,
} from 'lucide-react';
import type { UserRole, User as UserType, Appointment, MedicalReport, Doctor, AuditLog } from '../types/index.ts';
import { api } from '../services/api.ts';

interface DashboardPageProps {
  currentUser: UserType | null;
  userRole: UserRole;
  lang: 'en' | 'hi';
  onNavigate: (tab: string, extra?: any) => void;
  onOpenSOS: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  currentUser,
  userRole,
  lang,
  onNavigate,
  onOpenSOS,
}) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [reports, setReports] = useState<MedicalReport[]>([]);
  const [adminStats, setAdminStats] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [doctorsList, setDoctorsList] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  // Doctor Availability form
  const [docDays, setDocDays] = useState(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
  const [docFee, setDocFee] = useState(1200);
  const [docStart, setDocStart] = useState('10:00');
  const [docEnd, setDocEnd] = useState('18:00');
  const [isSavingDoc, setIsSavingDoc] = useState(false);
  const [docSaveSuccess, setDocSaveSuccess] = useState(false);

  // Donor availability state
  const [isDonorAvail, setIsDonorAvail] = useState(true);

  const loadData = () => {
    setLoading(true);
    if (userRole === 'admin') {
      api.getAdminOverview().then((res) => {
        if (res.success) {
          setAdminStats(res.stats);
          setAuditLogs(res.recentLogs || []);
        }
        setLoading(false);
      });
      api.getDoctors().then((res) => {
        if (res.success && res.doctors) setDoctorsList(res.doctors);
      });
    } else if (userRole === 'doctor') {
      Promise.all([
        api.getAppointments({ doctorId: currentUser?.doctorProfileId || 'doc_2' }),
        api.getDoctors(),
      ]).then(([aptRes, docRes]) => {
        if (aptRes.success && aptRes.appointments) setAppointments(aptRes.appointments);
        if (docRes.success && docRes.doctors) {
          const doc = docRes.doctors.find((d) => d.id === (currentUser?.doctorProfileId || 'doc_2'));
          if (doc) {
            setDocDays(doc.availableDays);
            setDocFee(doc.consultationFee);
            setDocStart(doc.workingHours.start);
            setDocEnd(doc.workingHours.end);
          }
        }
        setLoading(false);
      });
    } else {
      // Patient / Donor / Staff
      Promise.all([
        api.getAppointments({ patientId: currentUser?.id || 'user_patient_1' }),
        api.getReports(currentUser?.id || 'user_patient_1'),
      ]).then(([aptRes, repRes]) => {
        if (aptRes.success && aptRes.appointments) setAppointments(aptRes.appointments);
        if (repRes.success && repRes.reports) setReports(repRes.reports);
        setLoading(false);
      });
    }
  };

  useEffect(() => {
    loadData();
  }, [userRole, currentUser?.id]);

  const handleSaveDoctorSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingDoc(true);
    try {
      await api.updateDoctorAvailability(currentUser?.doctorProfileId || 'doc_2', {
        availableDays: docDays,
        consultationFee: docFee,
        workingHours: { start: docStart, end: docEnd },
      });
      setDocSaveSuccess(true);
      setTimeout(() => setDocSaveSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingDoc(false);
    }
  };

  const handleVerifyDoctorByAdmin = async (docId: string) => {
    await api.verifyDoctor(docId);
    api.getDoctors().then((res) => {
      if (res.success && res.doctors) setDoctorsList(res.doctors);
    });
    api.getAuditLogs().then((res) => {
      if (res.success && res.logs) setAuditLogs(res.logs);
    });
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header with Role Indicator */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 bg-teal-100 text-teal-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider mb-1.5">
            <LayoutDashboard className="w-3.5 h-3.5 text-teal-700" />
            <span className="capitalize">{userRole.replace('_', ' ')} Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {userRole === 'patient' && 'Patient Health Dashboard'}
            {userRole === 'doctor' && 'Doctor Clinical Portal & OPD Queue'}
            {userRole === 'hospital_staff' && 'Hospital & Laboratory Diagnostic Dashboard'}
            {userRole === 'donor' && 'Voluntary Blood Donor Portal'}
            {userRole === 'admin' && 'Hospital Oversight & System Administration'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Welcome back, <strong className="text-slate-800">{currentUser?.name || 'Healthcare User'}</strong> • MediCare AI Integrated Platform
          </p>
        </div>

        <div className="flex space-x-2">
          {userRole === 'patient' && (
            <button
              onClick={() => onNavigate('disease-predict')}
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow flex items-center space-x-1.5 cursor-pointer"
            >
              <HeartPulse className="w-4 h-4" />
              <span>Check Disease Risk</span>
            </button>
          )}

          <button
            onClick={onOpenSOS}
            className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow flex items-center space-x-1.5 cursor-pointer"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Emergency SOS</span>
          </button>
        </div>
      </div>

      {/* PATIENT VIEW */}
      {userRole === 'patient' && (
        <div className="space-y-6">
          {/* Patient Vitals & Health Summary Card */}
          <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-md">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center space-x-4">
                <img
                  src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                  alt="Patient"
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-500"
                />
                <div>
                  <h3 className="text-lg font-black">{currentUser?.name}</h3>
                  <p className="text-xs text-teal-300">City: {currentUser?.city || 'New Delhi'}</p>
                  <p className="text-[11px] text-slate-400">Phone: {currentUser?.phone}</p>
                </div>
              </div>

              {/* Vitals pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs w-full md:w-auto">
                <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Blood Group</span>
                  <span className="text-base font-black text-rose-400">{currentUser?.bloodGroup || 'B+'}</span>
                </div>
                <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Known Allergies</span>
                  <span className="font-semibold text-amber-300 text-xs">Penicillin, Dust</span>
                </div>
                <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Chronic Condition</span>
                  <span className="font-semibold text-teal-300 text-xs">Mild HTN</span>
                </div>
                <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Emergency SOS</span>
                  <span className="font-semibold text-white text-xs">Sunita (Spouse)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div
              onClick={() => onNavigate('appointments')}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer flex items-center justify-between"
            >
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Scheduled Consultations</span>
                <p className="text-2xl font-black text-slate-900 mt-1">{appointments.length}</p>
              </div>
              <Calendar className="w-8 h-8 text-teal-600" />
            </div>

            <div
              onClick={() => onNavigate('reports')}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer flex items-center justify-between"
            >
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Stored Lab Reports</span>
                <p className="text-2xl font-black text-slate-900 mt-1">{reports.length}</p>
              </div>
              <FileText className="w-8 h-8 text-purple-600" />
            </div>

            <div
              onClick={() => onNavigate('blood-connect')}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer flex items-center justify-between"
            >
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Blood Connect Network</span>
                <p className="text-2xl font-black text-rose-600 mt-1">8 Groups</p>
              </div>
              <Droplet className="w-8 h-8 text-rose-600" />
            </div>
          </div>

          {/* Upcoming Consultations Timeline */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-slate-900 text-base">Upcoming Doctor Appointments</h3>
              <button
                onClick={() => onNavigate('appointments')}
                className="text-xs font-bold text-teal-600 hover:underline"
              >
                View All &amp; Reschedule →
              </button>
            </div>

            {appointments.length === 0 ? (
              <p className="text-xs text-slate-500 py-4">No upcoming appointments booked.</p>
            ) : (
              <div className="space-y-3">
                {appointments.slice(0, 2).map((apt) => (
                  <div key={apt.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-bold text-slate-900 text-sm">{apt.doctorName}</h4>
                        <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-2 py-0.2 rounded">
                          {apt.doctorSpecialty.split(' — ')[0]}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {apt.date} at {apt.timeSlot} • Mode: <strong className="capitalize">{apt.mode}</strong>
                      </p>
                    </div>

                    <button
                      onClick={() => onNavigate('appointments')}
                      className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition"
                    >
                      {apt.mode === 'online' ? 'Join Video Room' : 'View Clinic Pass'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* DOCTOR VIEW */}
      {userRole === 'doctor' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-slate-900 to-teal-950 text-white rounded-2xl p-6 border border-slate-800 shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center space-x-4">
              <img
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80"
                alt="Doctor"
                className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-500"
              />
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-black">Dr. Ananya Sharma</h3>
                  <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded border border-emerald-500/30">
                    MCI-38910-C (Verified)
                  </span>
                </div>
                <p className="text-xs text-teal-300 font-bold">Cardiologist — Heart Specialist</p>
                <p className="text-[11px] text-slate-400">Fortis Escorts Heart Institute, Okhla</p>
              </div>
            </div>

            <div className="text-xs space-y-1">
              <p className="text-slate-400">Consultation Fee: <strong className="text-white">₹{docFee}</strong></p>
              <p className="text-slate-400">OPD Hours: <strong className="text-white">{docStart} to {docEnd}</strong></p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left OPD Queue */}
            <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-base">Today's Patient Queue</h3>
              {appointments.length === 0 ? (
                <p className="text-xs text-slate-500">No appointments scheduled for today.</p>
              ) : (
                <div className="space-y-3">
                  {appointments.map((apt) => (
                    <div key={apt.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">{apt.patientName}</h4>
                          <p className="text-xs text-slate-500">Slot: {apt.timeSlot} • Mode: {apt.mode}</p>
                          <p className="text-[11px] text-teal-700 italic mt-1">"{apt.symptoms}"</p>
                        </div>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                          {apt.status}
                        </span>
                      </div>

                      <div className="pt-2 flex space-x-2">
                        <button
                          onClick={() => onNavigate('appointments')}
                          className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs py-1.5 px-3 rounded-lg transition"
                        >
                          Open Video Call &amp; Rx Form
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Doctor Availability Management Form */}
            <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-base">Schedule &amp; Availability Settings</h3>
              
              {docSaveSuccess && (
                <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-2.5 rounded-lg text-xs flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Doctor working hours successfully updated!</span>
                </div>
              )}

              <form onSubmit={handleSaveDoctorSchedule} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Consultation Fee (₹ INR)</label>
                  <input
                    type="number"
                    value={docFee}
                    onChange={(e) => setDocFee(Number(e.target.value))}
                    className="w-full p-2 rounded-xl border border-slate-300 bg-slate-50 font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Start Time</label>
                    <input
                      type="time"
                      value={docStart}
                      onChange={(e) => setDocStart(e.target.value)}
                      className="w-full p-2 rounded-xl border border-slate-300 bg-slate-50"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">End Time</label>
                    <input
                      type="time"
                      value={docEnd}
                      onChange={(e) => setDocEnd(e.target.value)}
                      className="w-full p-2 rounded-xl border border-slate-300 bg-slate-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Available Working Days</label>
                  <div className="flex flex-wrap gap-1.5">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => {
                      const isSel = docDays.includes(day);
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => {
                            if (isSel) setDocDays(docDays.filter((d) => d !== day));
                            else setDocDays([...docDays, day]);
                          }}
                          className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition ${
                            isSel ? 'bg-teal-600 text-white border-teal-600' : 'bg-slate-50 text-slate-600 border-slate-300'
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSavingDoc}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl transition shadow flex items-center justify-center space-x-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Availability</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* BLOOD DONOR VIEW */}
      {userRole === 'donor' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-red-950 via-rose-900 to-slate-900 text-white rounded-2xl p-6 border border-red-800 shadow-md flex justify-between items-center">
            <div>
              <div className="flex items-center space-x-2">
                <span className="w-10 h-10 rounded-xl bg-red-600 text-white font-black text-lg flex items-center justify-center">
                  O+
                </span>
                <div>
                  <h3 className="text-lg font-black">{currentUser?.name || 'Vikram Singh'}</h3>
                  <p className="text-xs text-red-200">Registered Voluntary Blood Donor • South Delhi</p>
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs text-red-200 block">Current Status</span>
              <button
                onClick={() => setIsDonorAvail(!isDonorAvail)}
                className={`mt-1 px-4 py-1.5 rounded-xl text-xs font-bold transition ${
                  isDonorAvail ? 'bg-emerald-500 text-slate-950' : 'bg-slate-700 text-slate-300'
                }`}
              >
                {isDonorAvail ? 'Available for Donation' : 'Temporarily Inactive'}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-900 text-base">Voluntary Donor Safety Standard</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              As a voluntary donor, your contact details remain strictly masked and protected. When regional hospitals or families submit a blood requirement request, you receive a protected consent notice. All blood compatibility, crossmatching, and drawing must be performed at certified blood banks.
            </p>
            <button
              onClick={() => onNavigate('blood-connect')}
              className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition"
            >
              Browse Regional Blood Requests →
            </button>
          </div>
        </div>
      )}

      {/* HOSPITAL & LAB STAFF VIEW */}
      {userRole === 'hospital_staff' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-slate-900 text-base">Laboratory Phlebotomy &amp; Testing Queue</h3>
              <button
                onClick={() => onNavigate('health-tests')}
                className="text-xs font-bold text-teal-600 hover:underline"
              >
                Open Health Tests Catalog →
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Manage incoming home sample collections, status updates, and authorized digital report dispatches.
            </p>
          </div>
        </div>
      )}

      {/* ADMIN VIEW */}
      {userRole === 'admin' && (
        <div className="space-y-6">
          {/* Admin Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Registered Patients</span>
              <p className="text-2xl font-black text-slate-900 mt-1">{adminStats?.totalPatients || '1,421'}</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Specialist Doctors</span>
              <p className="text-2xl font-black text-teal-700 mt-1">{adminStats?.totalDoctors || '17'}</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Voluntary Donors</span>
              <p className="text-2xl font-black text-rose-600 mt-1">{adminStats?.totalDonors || '92'}</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase">System Status</span>
              <p className="text-base font-black text-emerald-600 mt-2 flex items-center space-x-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Operational</span>
              </p>
            </div>
          </div>

          {/* Doctor Verification Management */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Doctor Credential Verification Registry</h3>
            <p className="text-xs text-slate-500">
              Audit registration numbers against the National Medical Commission (NMC) database to maintain verified doctor badges:
            </p>

            <div className="space-y-2 text-xs">
              {doctorsList.slice(0, 5).map((doc) => (
                <div key={doc.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                  <div>
                    <strong className="text-slate-900">{doc.name}</strong> • <span>{doc.specialty}</span>
                    <p className="text-[11px] text-slate-500 font-mono">Reg: {doc.registrationNumber}</p>
                  </div>
                  <div>
                    {doc.isVerified ? (
                      <span className="text-emerald-700 font-bold flex items-center space-x-1 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>NMC Verified</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => handleVerifyDoctorByAdmin(doc.id)}
                        className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-3 py-1 rounded-lg"
                      >
                        Verify Credentials
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Audit Logs */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-900 text-base">Security Audit Logs (Access &amp; Triage Events)</h3>
            <div className="space-y-1.5 text-xs">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-2.5 rounded-lg border border-slate-100 bg-slate-50 flex justify-between items-center">
                  <div>
                    <span className="font-mono font-bold text-teal-700">{log.action}</span>
                    <p className="text-[11px] text-slate-600">{log.target} • By {log.performedBy}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">{log.timestamp.split('T')[0]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
