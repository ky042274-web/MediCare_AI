import React, { useState, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  MessageSquare,
  FileSpreadsheet,
  Share2,
  Settings,
  ShieldCheck,
  Clock,
  User,
  Plus,
  Trash2,
  Check,
  AlertCircle,
} from 'lucide-react';
import type { Appointment, UserRole } from '../types/index.ts';
import { api } from '../services/api.ts';

interface VideoConsultationRoomProps {
  appointment: Appointment;
  onClose: () => void;
  userRole: UserRole;
  lang: 'en' | 'hi';
}

export const VideoConsultationRoom: React.FC<VideoConsultationRoomProps> = ({
  appointment,
  onClose,
  userRole,
  lang,
}) => {
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [activeTab, setActiveTab] = useState<'notes' | 'chat' | 'rx'>('rx');
  const [callDuration, setCallDuration] = useState(128); // seconds

  // Chat state
  const [chatMessages, setChatMessages] = useState<{ sender: string; text: string; time: string }[]>([
    {
      sender: appointment.doctorName,
      text: 'Good day! I have reviewed your previous vitals and symptoms. How are you feeling today?',
      time: '11:02 AM',
    },
    {
      sender: appointment.patientName,
      text: 'Doctor, I experienced mild chest tightness after climbing stairs yesterday, though it subsided after resting.',
      time: '11:03 AM',
    },
  ]);
  const [chatInput, setChatInput] = useState('');

  // Doctor prescription form
  const [diagnosis, setDiagnosis] = useState(
    appointment.prescription?.diagnosis || 'Mild exertion-induced angina / Essential Hypertension Review'
  );
  const [medicines, setMedicines] = useState(
    appointment.prescription?.medicines || [
      { name: 'Telmisartan 40mg', dosage: '1 tab', frequency: 'Morning after food', durationDays: 30 },
      { name: 'Sorbicad 5mg Sublingual (SOS)', dosage: '1 tab', frequency: 'Only if acute chest tightness occurs', durationDays: 10 },
    ]
  );
  const [advice, setAdvice] = useState(
    appointment.prescription?.advice || 'Low-sodium diet (<4g/day). Schedule 2D Echocardiogram and Lipid Profile.'
  );
  const [clinicalNotes, setClinicalNotes] = useState(
    appointment.clinicalNotes || 'Patient alert, oriented. Regular heart sounds. No pedal edema noted.'
  );
  const [isSavingRx, setIsSavingRx] = useState(false);
  const [rxSuccessMsg, setRxSuccessMsg] = useState('');

  // Call timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatMessages((prev) => [
      ...prev,
      {
        sender: userRole === 'doctor' ? appointment.doctorName : appointment.patientName,
        text: chatInput,
        time: timeStr,
      },
    ]);
    setChatInput('');
  };

  const handleAddMedicine = () => {
    setMedicines((prev) => [
      ...prev,
      { name: '', dosage: '1 tab', frequency: 'Twice daily after food', durationDays: 14 },
    ]);
  };

  const handleRemoveMedicine = (index: number) => {
    setMedicines((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateMedicine = (index: number, field: string, val: any) => {
    setMedicines((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: val };
      return copy;
    });
  };

  const handleSavePrescription = async () => {
    setIsSavingRx(true);
    try {
      await api.savePrescription(appointment.id, {
        diagnosis,
        medicines,
        advice,
        followUpDays: 14,
        clinicalNotes,
      });
      setRxSuccessMsg('E-Prescription securely signed and updated on patient dashboard!');
      setTimeout(() => setRxSuccessMsg(''), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingRx(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col overflow-hidden animate-in fade-in duration-200">
      {/* Top Telehealth Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
          <div>
            <h2 className="text-sm font-bold flex items-center space-x-2">
              <span>{appointment.doctorSpecialty} Video Room</span>
              <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded border border-emerald-500/30 flex items-center space-x-1">
                <ShieldCheck className="w-3 h-3" />
                <span>End-to-End Encrypted Telehealth</span>
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Patient: <strong className="text-slate-200">{appointment.patientName}</strong> • Doctor:{' '}
              <strong className="text-slate-200">{appointment.doctorName}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="bg-slate-800 border border-slate-700 px-3 py-1 rounded-lg flex items-center space-x-1.5 font-mono text-xs text-emerald-400">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatTimer(callDuration)}</span>
          </div>

          <button
            onClick={onClose}
            className="bg-rose-600 hover:bg-rose-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition cursor-pointer"
          >
            <PhoneOff className="w-3.5 h-3.5" />
            <span>End Call</span>
          </button>
        </div>
      </div>

      {/* Main Video & Panel Body */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left: Video Streams */}
        <div className="flex-1 bg-slate-950 p-4 flex flex-col justify-between relative overflow-hidden">
          
          {/* Main Remote Feed (e.g. Doctor for patient, or Patient for doctor) */}
          <div className="flex-1 bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-center relative overflow-hidden shadow-2xl">
            {videoOn ? (
              <div className="w-full h-full relative flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900">
                {/* Simulated high-tech medical video avatar/stream */}
                <div className="relative text-center">
                  <div className="w-36 h-36 rounded-full border-4 border-teal-500/40 p-1 mx-auto shadow-2xl relative">
                    <img
                      src={
                        userRole === 'doctor'
                          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
                          : 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80'
                      }
                      alt="Remote Attendee"
                      className="w-full h-full object-cover rounded-full"
                    />
                    <div className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center text-[10px]">
                      HD
                    </div>
                  </div>
                  <h3 className="mt-4 text-base font-bold text-white">
                    {userRole === 'doctor' ? appointment.patientName : appointment.doctorName}
                  </h3>
                  <p className="text-xs text-teal-400">
                    {userRole === 'doctor' ? 'Patient (Connected)' : appointment.doctorSpecialty}
                  </p>
                  <div className="mt-2 inline-flex items-center space-x-1 bg-slate-800/80 px-2.5 py-1 rounded-full text-[11px] text-slate-300 border border-slate-700">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    <span>1080p Telehealth Link • Audio: Crystal Clear</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center p-8">
                <VideoOff className="w-12 h-12 text-slate-600 mx-auto mb-2" />
                <p className="text-sm text-slate-400">Video feed is temporarily paused</p>
              </div>
            )}

            {/* Self PIP View in top-right corner */}
            <div className="absolute top-4 right-4 w-40 sm:w-48 aspect-video bg-slate-800 rounded-xl border-2 border-teal-500/60 shadow-xl overflow-hidden flex items-center justify-center">
              <div className="text-center">
                <User className="w-8 h-8 text-teal-400 mx-auto" />
                <p className="text-[10px] text-slate-300 font-semibold mt-1">
                  You ({userRole === 'doctor' ? 'Doctor View' : 'Patient View'})
                </p>
                <div className="flex items-center justify-center space-x-1 mt-1 text-[9px] text-emerald-400 font-mono">
                  <span>Mic: {micOn ? 'ON' : 'MUTED'}</span>
                </div>
              </div>
            </div>

            {/* In-Call Symptoms Ribbon at bottom */}
            <div className="absolute bottom-4 left-4 max-w-md bg-slate-900/90 backdrop-blur-md border border-slate-700 p-2.5 rounded-xl text-xs text-slate-300 shadow-lg">
              <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider block">
                Reported Complaint:
              </span>
              <p className="line-clamp-2 text-slate-200">{appointment.symptoms || 'General medical follow-up'}</p>
            </div>
          </div>

          {/* Bottom Floating Control Bar */}
          <div className="mt-4 flex items-center justify-center space-x-3">
            <button
              onClick={() => setMicOn(!micOn)}
              className={`p-3.5 rounded-full transition shadow-lg cursor-pointer ${
                micOn ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-rose-600 text-white'
              }`}
              title={micOn ? 'Mute Microphone' : 'Unmute Microphone'}
            >
              {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setVideoOn(!videoOn)}
              className={`p-3.5 rounded-full transition shadow-lg cursor-pointer ${
                videoOn ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-rose-600 text-white'
              }`}
              title={videoOn ? 'Turn Video Off' : 'Turn Video On'}
            >
              {videoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setScreenSharing(!screenSharing)}
              className={`p-3.5 rounded-full transition shadow-lg cursor-pointer ${
                screenSharing ? 'bg-teal-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-white'
              }`}
              title="Share Medical Records / Screen"
            >
              <Share2 className="w-5 h-5" />
            </button>

            <button
              onClick={onClose}
              className="px-6 py-3 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold flex items-center space-x-2 shadow-lg transition cursor-pointer"
            >
              <PhoneOff className="w-5 h-5" />
              <span>Leave Room</span>
            </button>
          </div>
        </div>

        {/* Right Sidebar: E-Prescription, Consultation Notes & Chat */}
        <div className="w-full lg:w-96 bg-slate-900 border-l border-slate-800 flex flex-col h-[400px] lg:h-auto">
          {/* Tab buttons */}
          <div className="flex border-b border-slate-800 text-xs font-bold">
            <button
              onClick={() => setActiveTab('rx')}
              className={`flex-1 py-3 text-center transition border-b-2 ${
                activeTab === 'rx'
                  ? 'border-teal-400 text-teal-300 bg-slate-850'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              E-Prescription
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`flex-1 py-3 text-center transition border-b-2 ${
                activeTab === 'notes'
                  ? 'border-teal-400 text-teal-300 bg-slate-850'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              Clinical Notes
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-3 text-center transition border-b-2 ${
                activeTab === 'chat'
                  ? 'border-teal-400 text-teal-300 bg-slate-850'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              Live Chat
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 p-4 overflow-y-auto">
            {activeTab === 'rx' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                    <FileSpreadsheet className="w-3.5 h-3.5 text-teal-400" />
                    <span>Digital E-Prescription</span>
                  </h3>
                  <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">
                    Rx ID: {appointment.prescription?.id || 'Draft'}
                  </span>
                </div>

                {rxSuccessMsg && (
                  <div className="bg-emerald-950 border border-emerald-500 text-emerald-300 p-2.5 rounded-lg text-xs flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{rxSuccessMsg}</span>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Clinical Diagnosis</label>
                  {userRole === 'doctor' ? (
                    <input
                      type="text"
                      value={diagnosis}
                      onChange={(e) => setDiagnosis(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-teal-400"
                    />
                  ) : (
                    <div className="bg-slate-800/80 p-2 rounded-lg text-xs font-medium text-teal-300">
                      {diagnosis}
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-bold text-slate-400">Prescribed Medications</label>
                    {userRole === 'doctor' && (
                      <button
                        onClick={handleAddMedicine}
                        className="text-[10px] text-teal-400 hover:text-teal-300 flex items-center space-x-1 font-semibold"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Medicine</span>
                      </button>
                    )}
                  </div>

                  <div className="space-y-2">
                    {medicines.map((med, idx) => (
                      <div key={idx} className="bg-slate-800/80 border border-slate-700 rounded-lg p-2.5 text-xs">
                        {userRole === 'doctor' ? (
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <input
                                type="text"
                                placeholder="Medicine name (e.g. Paracetamol 650mg)"
                                value={med.name}
                                onChange={(e) => handleUpdateMedicine(idx, 'name', e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-teal-400"
                              />
                              <button
                                onClick={() => handleRemoveMedicine(idx)}
                                className="ml-2 text-rose-400 hover:text-rose-300"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <div className="grid grid-cols-2 gap-1.5">
                              <input
                                type="text"
                                placeholder="Dosage (e.g. 1 tab)"
                                value={med.dosage}
                                onChange={(e) => handleUpdateMedicine(idx, 'dosage', e.target.value)}
                                className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-[11px] text-white"
                              />
                              <input
                                type="text"
                                placeholder="Frequency (e.g. Twice daily)"
                                value={med.frequency}
                                onChange={(e) => handleUpdateMedicine(idx, 'frequency', e.target.value)}
                                className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-[11px] text-white"
                              />
                            </div>
                          </div>
                        ) : (
                          <div>
                            <p className="font-bold text-white">{med.name || 'Prescribed Med'}</p>
                            <p className="text-[11px] text-teal-300">
                              {med.dosage} • {med.frequency} • {med.durationDays} Days
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Doctor Advice &amp; Lifestyle</label>
                  {userRole === 'doctor' ? (
                    <textarea
                      rows={2}
                      value={advice}
                      onChange={(e) => setAdvice(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-teal-400"
                    />
                  ) : (
                    <div className="bg-slate-800/80 p-2 rounded-lg text-xs text-slate-300">{advice}</div>
                  )}
                </div>

                {userRole === 'doctor' && (
                  <button
                    onClick={handleSavePrescription}
                    disabled={isSavingRx}
                    className="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold py-2 rounded-lg text-xs transition cursor-pointer shadow-md disabled:opacity-50"
                  >
                    {isSavingRx ? 'Saving & Signing Rx...' : 'Sign & Issue E-Prescription'}
                  </button>
                )}
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Clinical Case Notes
                </h3>
                {userRole === 'doctor' ? (
                  <textarea
                    rows={8}
                    value={clinicalNotes}
                    onChange={(e) => setClinicalNotes(e.target.value)}
                    placeholder="Document vitals, physical findings, differential diagnosis..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-teal-400"
                  />
                ) : (
                  <div className="bg-slate-800 p-3 rounded-lg text-xs text-slate-300 whitespace-pre-line">
                    {clinicalNotes || 'Doctor has not added public notes yet.'}
                  </div>
                )}
                {userRole === 'doctor' && (
                  <button
                    onClick={handleSavePrescription}
                    className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-1.5 rounded-lg text-xs"
                  >
                    Update Case Notes
                  </button>
                )}
              </div>
            )}

            {activeTab === 'chat' && (
              <div className="flex flex-col h-full justify-between">
                <div className="space-y-3 overflow-y-auto max-h-[300px]">
                  {chatMessages.map((msg, i) => (
                    <div
                      key={i}
                      className={`p-2.5 rounded-xl text-xs ${
                        msg.sender === appointment.doctorName ? 'bg-slate-800 text-white' : 'bg-teal-900/60 text-teal-100'
                      }`}
                    >
                      <div className="flex justify-between items-center text-[10px] text-slate-400 mb-1 font-semibold">
                        <span>{msg.sender}</span>
                        <span>{msg.time}</span>
                      </div>
                      <p>{msg.text}</p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendMessage} className="mt-3 flex space-x-1.5">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Type message..."
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-teal-400"
                  />
                  <button
                    type="submit"
                    className="bg-teal-600 hover:bg-teal-500 px-3 py-1.5 rounded-lg text-xs font-bold"
                  >
                    Send
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
