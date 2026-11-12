import React, { useState, useEffect } from 'react';
import {
  Droplet,
  Search,
  Plus,
  ShieldCheck,
  PhoneCall,
  MapPin,
  Clock,
  HeartHandshake,
  AlertTriangle,
  CheckCircle2,
  X,
  Share2,
  Lock,
  UserCheck,
  Building2,
  Calendar,
} from 'lucide-react';
import type { BloodDonor, BloodRequest, BloodGroup, UrgencyLevel, User } from '../types/index.ts';
import { api } from '../services/api.ts';

interface BloodConnectPageProps {
  initialAction?: 'register' | 'request';
  currentUser: User | null;
  lang: 'en' | 'hi';
  onOpenSOS: () => void;
}

export const BloodConnectPage: React.FC<BloodConnectPageProps> = ({
  initialAction,
  currentUser,
  lang,
  onOpenSOS,
}) => {
  const bloodGroups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const cities = ['New Delhi', 'Mumbai', 'Bengaluru', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune'];

  const [activeTab, setActiveTab] = useState<'donors' | 'requests'>('donors');
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [availableOnly, setAvailableOnly] = useState(false);

  const [donors, setDonors] = useState<BloodDonor[]>([]);
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showRegisterDonorModal, setShowRegisterDonorModal] = useState(initialAction === 'register');
  const [showRequestBloodModal, setShowRequestBloodModal] = useState(initialAction === 'request');
  const [contactDonorTarget, setContactDonorTarget] = useState<BloodDonor | null>(null);

  // Register Donor Form
  const [donorName, setDonorName] = useState(currentUser?.name || '');
  const [donorBloodGroup, setDonorBloodGroup] = useState<BloodGroup>('O+');
  const [donorCity, setDonorCity] = useState('New Delhi');
  const [donorArea, setDonorArea] = useState('');
  const [donorPhone, setDonorPhone] = useState(currentUser?.phone || '+91 98000 00000');
  const [donorContactPref, setDonorContactPref] = useState<'in-app' | 'call' | 'whatsapp'>('in-app');
  const [donorAvailNote, setDonorAvailNote] = useState('Ready for emergency donation');
  const [donorSubmitting, setDonorSubmitting] = useState(false);
  const [donorSuccessMsg, setDonorSuccessMsg] = useState('');

  // Submit Blood Request Form
  const [reqPatientName, setReqPatientName] = useState('');
  const [reqBloodGroup, setReqBloodGroup] = useState<BloodGroup>('O+');
  const [reqUnits, setReqUnits] = useState(2);
  const [reqHospital, setReqHospital] = useState('');
  const [reqCity, setReqCity] = useState('New Delhi');
  const [reqUrgency, setReqUrgency] = useState<UrgencyLevel>('urgent');
  const [reqDate, setReqDate] = useState(new Date().toISOString().split('T')[0]);
  const [reqContactName, setReqContactName] = useState(currentUser?.name || '');
  const [reqContactPhone, setReqContactPhone] = useState(currentUser?.phone || '+91 98110 00000');
  const [reqNotes, setReqNotes] = useState('');
  const [reqSubmitting, setReqSubmitting] = useState(false);
  const [reqSuccessMsg, setReqSuccessMsg] = useState('');

  // Protected Contact Relay Form
  const [contactMessage, setContactMessage] = useState('Urgent blood requirement at hospital. Please confirm availability.');
  const [contactSentNotice, setContactSentNotice] = useState<string | null>(null);

  const loadData = () => {
    setLoading(true);
    Promise.all([
      api.getDonors({
        bloodGroup: selectedBloodGroup !== 'all' ? selectedBloodGroup : undefined,
        city: selectedCity !== 'all' ? selectedCity : undefined,
        availableOnly,
      }),
      api.getBloodRequests({
        bloodGroup: selectedBloodGroup !== 'all' ? selectedBloodGroup : undefined,
        city: selectedCity !== 'all' ? selectedCity : undefined,
      }),
    ]).then(([donorRes, reqRes]) => {
      if (donorRes.success && donorRes.donors) setDonors(donorRes.donors);
      if (reqRes.success && reqRes.requests) setRequests(reqRes.requests);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, [selectedBloodGroup, selectedCity, availableOnly]);

  const handleRegisterDonor = async (e: React.FormEvent) => {
    e.preventDefault();
    setDonorSubmitting(true);
    try {
      const res = await api.registerDonor({
        name: donorName,
        bloodGroup: donorBloodGroup,
        city: donorCity,
        area: donorArea,
        phone: donorPhone,
        preferredContact: donorContactPref,
        availabilityNote: donorAvailNote,
      });

      if (res.success) {
        setDonorSuccessMsg('Thank you! You are now enrolled as an active voluntary blood donor.');
        loadData();
        setTimeout(() => {
          setShowRegisterDonorModal(false);
          setDonorSuccessMsg('');
        }, 2000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDonorSubmitting(false);
    }
  };

  const handleCreateBloodRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setReqSubmitting(true);
    try {
      const res = await api.submitBloodRequest({
        patientName: reqPatientName,
        bloodGroup: reqBloodGroup,
        unitsNeeded: reqUnits,
        hospitalName: reqHospital,
        city: reqCity,
        urgency: reqUrgency,
        requiredDate: reqDate,
        requesterName: reqContactName,
        contactPhone: reqContactPhone,
        notes: reqNotes,
      });

      if (res.success) {
        setReqSuccessMsg('Blood request published! Regional donors and blood banks notified.');
        loadData();
        setTimeout(() => {
          setShowRequestBloodModal(false);
          setReqSuccessMsg('');
        }, 2000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setReqSubmitting(false);
    }
  };

  const handleSendProtectedContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactDonorTarget) return;

    try {
      const res = await api.contactDonor({
        donorId: contactDonorTarget.id,
        patientName: reqPatientName || 'Hospitalized Patient',
        hospitalName: reqHospital || 'Authorized Healthcare Facility',
        bloodGroup: contactDonorTarget.bloodGroup,
        message: contactMessage,
      });

      if (res.success) {
        setContactSentNotice(res.message);
        setTimeout(() => {
          setContactSentNotice(null);
          setContactDonorTarget(null);
        }, 3500);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-red-950 via-rose-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-red-800 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center space-x-2 bg-red-500/25 text-red-200 px-3 py-1 rounded-full text-xs font-bold border border-red-500/30">
            <Droplet className="w-3.5 h-3.5 text-red-400 fill-red-400" />
            <span>{lang === 'en' ? 'Voluntary Non-Commercial Network' : 'स्वैच्छिक एवं निःशुल्क रक्तदान'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            {lang === 'en' ? 'MediCare Blood Connect' : 'ब्लड कनेक्ट - जीवन रक्षक नेटवर्क'}
          </h1>
          <p className="text-xs sm:text-sm text-red-100/90 leading-relaxed">
            {lang === 'en'
              ? 'Connecting voluntary donors with patients across all 8 ABO/Rh blood groups. With privacy-preserving contact routing, strict non-commercial safeguards, and hospital blood bank verification.'
              : 'सभी 8 रक्त समूहों के जरूरतमंदों को स्वैच्छिक रक्तदाताओं से जोड़ने वाला सुरक्षित मंच। सभी रक्तदान व क्रॉस-मैचिंग अधिकृत ब्लड बैंकों में ही संपन्न होते हैं।'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={() => setShowRequestBloodModal(true)}
            className="bg-white hover:bg-slate-100 text-red-900 font-black text-xs px-5 py-2.5 rounded-xl transition shadow flex items-center space-x-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-red-600" />
            <span>{lang === 'en' ? 'Request Blood for Patient' : 'रक्त की आवश्यकता दर्ज करें'}</span>
          </button>

          <button
            onClick={() => setShowRegisterDonorModal(true)}
            className="bg-red-800/80 hover:bg-red-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl border border-red-600 transition flex items-center space-x-1.5 cursor-pointer"
          >
            <HeartHandshake className="w-4 h-4" />
            <span>{lang === 'en' ? 'Register as Voluntary Donor' : 'रक्तदाता के रूप में पंजीकरण करें'}</span>
          </button>
        </div>
      </div>

      {/* Blood Groups Selector Chips */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
            <Droplet className="w-4 h-4 text-red-600" />
            <span>Filter by ABO/Rh Blood Group:</span>
          </span>
          <div className="flex items-center space-x-2">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="text-xs py-1.5 px-3 rounded-lg border border-slate-200 bg-slate-50 font-medium"
            >
              <option value="all">All Cities</option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-5 sm:grid-cols-9 gap-1.5">
          <button
            onClick={() => setSelectedBloodGroup('all')}
            className={`py-2 px-1 text-center rounded-xl border text-xs font-black transition cursor-pointer ${
              selectedBloodGroup === 'all'
                ? 'bg-red-600 text-white border-red-600 shadow-sm'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            All
          </button>
          {bloodGroups.map((bg) => (
            <button
              key={bg}
              onClick={() => setSelectedBloodGroup(bg)}
              className={`py-2 px-1 text-center rounded-xl border text-xs font-black transition cursor-pointer ${
                selectedBloodGroup === bg
                  ? 'bg-red-600 text-white border-red-600 shadow-sm'
                  : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-red-50 hover:border-red-200'
              }`}
            >
              {bg}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs: Available Donors vs Active Hospital Requests */}
      <div className="flex border-b border-slate-200 space-x-6 text-xs font-bold">
        <button
          onClick={() => setActiveTab('donors')}
          className={`pb-3 transition flex items-center space-x-2 border-b-2 ${
            activeTab === 'donors'
              ? 'border-red-600 text-red-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>{lang === 'en' ? 'Voluntary Blood Donors' : 'उपलब्ध रक्तदाता'}</span>
          <span className="bg-red-100 text-red-800 text-[10px] px-2 py-0.2 rounded-full">
            {donors.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('requests')}
          className={`pb-3 transition flex items-center space-x-2 border-b-2 ${
            activeTab === 'requests'
              ? 'border-red-600 text-red-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>{lang === 'en' ? 'Active Hospital Blood Requests' : 'सक्रिय अस्पताल आवश्यकताएं'}</span>
          <span className="bg-rose-100 text-rose-800 text-[10px] px-2 py-0.2 rounded-full">
            {requests.length}
          </span>
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 text-xs">
          <span className="inline-block animate-spin mr-2">⟳</span>
          Loading Blood Connect network...
        </div>
      ) : activeTab === 'donors' ? (
        donors.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
            <Droplet className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-800 text-sm">No Donors Found for Selected Group</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No registered donors match this blood group and city currently. You can submit a hospital requirement request.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {donors.map((donor) => (
              <div
                key={donor.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-700 text-white flex items-center justify-center font-black text-lg shadow-md">
                        {donor.bloodGroup}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{donor.name}</h4>
                        <p className="text-[11px] text-slate-500 flex items-center space-x-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{donor.city} ({donor.area})</span>
                        </p>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        donor.isAvailable
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {donor.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 italic">
                    "{donor.availabilityNote}"
                  </p>

                  <div className="text-[11px] text-slate-500 space-y-1 pt-1 border-t border-slate-100">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Total Donations:</span>
                      <strong className="text-slate-800">{donor.donationCount} Times</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Contact Security:</span>
                      <span className="font-mono text-slate-700 flex items-center space-x-1">
                        <Lock className="w-3 h-3 text-teal-600" />
                        <span>{donor.phoneMasked}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100">
                  <button
                    onClick={() => setContactDonorTarget(donor)}
                    disabled={!donor.isAvailable}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-2.5 rounded-xl transition shadow flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <HeartHandshake className="w-3.5 h-3.5" />
                    <span>Send Protected Hospital Request</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* Requests Board */
        requests.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-xs text-slate-500">
            No active blood requests currently.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {requests.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-xl bg-red-50 text-red-700 border-2 border-red-200 flex flex-col items-center justify-center font-black">
                      <span className="text-sm">{req.bloodGroup}</span>
                      <span className="text-[9px] text-slate-500">{req.unitsNeeded}U</span>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-bold text-slate-900 text-sm">{req.patientName}</h4>
                        <span
                          className={`text-[9px] font-black uppercase px-2 py-0.2 rounded-full ${
                            req.urgency === 'emergency'
                              ? 'bg-rose-600 text-white animate-pulse'
                              : req.urgency === 'urgent'
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {req.urgency}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-teal-700 flex items-center space-x-1 mt-0.5">
                        <Building2 className="w-3 h-3" />
                        <span>{req.hospitalName} ({req.city})</span>
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                      req.status === 'fulfilled'
                        ? 'bg-emerald-100 text-emerald-800'
                        : req.status === 'contacted'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {req.status}
                  </span>
                </div>

                <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  {req.notes}
                </p>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                  <span>Required Date: <strong className="text-slate-800">{req.requiredDate}</strong></span>
                  <span>Contact: <strong className="text-slate-800">{req.requesterName} ({req.contactPhoneMasked})</strong></span>
                </div>

                {req.status === 'pending' && (
                  <button
                    onClick={() => {
                      alert('Hospital blood bank coordinator contacted. Crossmatch record updated.');
                      api.updateBloodRequestStatus(req.id, 'contacted');
                      loadData();
                    }}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-teal-300 font-bold text-xs py-2 rounded-xl transition flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                    <span>Volunteer to Donate for this Request</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        )
      )}

      {/* Register Donor Modal */}
      {showRegisterDonorModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-start border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  Register as Voluntary Blood Donor
                </h3>
                <p className="text-xs text-slate-500">
                  Your information is protected. Phone numbers are masked for safety.
                </p>
              </div>
              <button
                onClick={() => setShowRegisterDonorModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {donorSuccessMsg ? (
              <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-xl text-center text-xs text-emerald-800 space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="font-bold text-sm">{donorSuccessMsg}</p>
              </div>
            ) : (
              <form onSubmit={handleRegisterDonor} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Blood Group</label>
                    <select
                      value={donorBloodGroup}
                      onChange={(e) => setDonorBloodGroup(e.target.value as BloodGroup)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-bold"
                    >
                      {bloodGroups.map((bg) => (
                        <option key={bg} value={bg}>
                          {bg}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">City</label>
                    <select
                      value={donorCity}
                      onChange={(e) => setDonorCity(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-medium"
                    >
                      {cities.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Locality / Area</label>
                    <input
                      type="text"
                      placeholder="E.g. Saket, South Delhi"
                      value={donorArea}
                      onChange={(e) => setDonorArea(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Mobile (Masked publicly)</label>
                    <input
                      type="text"
                      value={donorPhone}
                      onChange={(e) => setDonorPhone(e.target.value)}
                      required
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Availability Note</label>
                  <input
                    type="text"
                    value={donorAvailNote}
                    onChange={(e) => setDonorAvailNote(e.target.value)}
                    placeholder="E.g. Ready for emergency calls, available weekends..."
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50"
                  />
                </div>

                {/* Eligibility checklist banner */}
                <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-[11px] text-amber-900 space-y-1">
                  <p className="font-bold">Donor Eligibility Standard:</p>
                  <p>• Age 18–65 years • Weight &gt; 45kg • Hemoglobin &gt; 12.5 g/dL</p>
                  <p>• At least 90 days since previous whole blood donation</p>
                  <p>• Commercial buying/selling of blood is strictly prohibited by law.</p>
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowRegisterDonorModal(false)}
                    className="px-4 py-2 font-bold text-slate-600 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={donorSubmitting}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2 rounded-xl transition shadow"
                  >
                    {donorSubmitting ? 'Registering...' : 'Register as Donor'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Submit Blood Request Modal */}
      {showRequestBloodModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-start border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  Submit Blood Requirement Request
                </h3>
                <p className="text-xs text-slate-500">
                  Notify nearby voluntary donors and verified hospital blood banks.
                </p>
              </div>
              <button
                onClick={() => setShowRequestBloodModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {reqSuccessMsg ? (
              <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-xl text-center text-xs text-emerald-800 space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="font-bold text-sm">{reqSuccessMsg}</p>
              </div>
            ) : (
              <form onSubmit={handleCreateBloodRequest} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Patient Name</label>
                  <input
                    type="text"
                    value={reqPatientName}
                    onChange={(e) => setReqPatientName(e.target.value)}
                    placeholder="Enter patient full name"
                    required
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Required Blood Group</label>
                    <select
                      value={reqBloodGroup}
                      onChange={(e) => setReqBloodGroup(e.target.value as BloodGroup)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-bold"
                    >
                      {bloodGroups.map((bg) => (
                        <option key={bg} value={bg}>
                          {bg}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Units Needed</label>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={reqUnits}
                      onChange={(e) => setReqUnits(parseInt(e.target.value) || 1)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Hospital / Blood Bank</label>
                    <input
                      type="text"
                      placeholder="E.g. AIIMS Trauma Centre Blood Bank"
                      value={reqHospital}
                      onChange={(e) => setReqHospital(e.target.value)}
                      required
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">City</label>
                    <select
                      value={reqCity}
                      onChange={(e) => setReqCity(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-medium"
                    >
                      {cities.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Urgency Level</label>
                    <select
                      value={reqUrgency}
                      onChange={(e) => setReqUrgency(e.target.value as UrgencyLevel)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-bold"
                    >
                      <option value="emergency">Emergency (Within 2-4 Hours)</option>
                      <option value="urgent">Urgent (Within 12-24 Hours)</option>
                      <option value="routine">Routine / Scheduled Elective</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Required Date</label>
                    <input
                      type="date"
                      value={reqDate}
                      onChange={(e) => setReqDate(e.target.value)}
                      required
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Attendant / Contact Person</label>
                    <input
                      type="text"
                      value={reqContactName}
                      onChange={(e) => setReqContactName(e.target.value)}
                      required
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Attendant Phone Number</label>
                    <input
                      type="text"
                      value={reqContactPhone}
                      onChange={(e) => setReqContactPhone(e.target.value)}
                      required
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Clinical Notes</label>
                  <textarea
                    rows={2}
                    value={reqNotes}
                    onChange={(e) => setReqNotes(e.target.value)}
                    placeholder="Diagnosis or procedure details (e.g. cardiac bypass, thalassemia transfusion)..."
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowRequestBloodModal(false)}
                    className="px-4 py-2 font-bold text-slate-600 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={reqSubmitting}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2 rounded-xl transition shadow"
                  >
                    {reqSubmitting ? 'Posting...' : 'Publish Blood Request'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Protected Donor Contact Modal */}
      {contactDonorTarget && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-start border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] text-teal-600 font-bold uppercase tracking-wider block">
                  Consent-Protected Connect
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  Notify Donor {contactDonorTarget.name} ({contactDonorTarget.bloodGroup})
                </h3>
              </div>
              <button
                onClick={() => setContactDonorTarget(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            {contactSentNotice ? (
              <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-xl text-center text-xs text-emerald-800 space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="font-bold">{contactSentNotice}</p>
              </div>
            ) : (
              <form onSubmit={handleSendProtectedContact} className="space-y-4 text-xs">
                <p className="text-slate-600">
                  A secure hospital alert will be sent to the donor. Personal mobile numbers are not exposed publicly to prevent spam and fraud.
                </p>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Message to Donor</label>
                  <textarea
                    rows={3}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50"
                  />
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
                  <p className="font-bold text-slate-800">Hospital Safety Protocol:</p>
                  <p>All blood draws, crossmatching, screening for infectious markers, and transfusions MUST occur inside authorized licensed blood banks.</p>
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setContactDonorTarget(null)}
                    className="px-4 py-2 font-bold text-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2 rounded-xl transition shadow"
                  >
                    Send Protected Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
