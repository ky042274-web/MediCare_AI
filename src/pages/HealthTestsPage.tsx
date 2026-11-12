import React, { useState, useEffect } from 'react';
import {
  FlaskConical,
  Clock,
  Home,
  Building2,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Search,
  Check,
  FileText,
  ShieldCheck,
  ArrowRight,
  X,
  CreditCard,
} from 'lucide-react';
import type { HealthTest, HealthTestBooking, User } from '../types/index.ts';
import { api } from '../services/api.ts';

interface HealthTestsPageProps {
  currentUser: User | null;
  lang: 'en' | 'hi';
  onNavigate: (tab: string, extra?: any) => void;
}

export const HealthTestsPage: React.FC<HealthTestsPageProps> = ({
  currentUser,
  lang,
  onNavigate,
}) => {
  const [tests, setTests] = useState<HealthTest[]>([]);
  const [bookings, setBookings] = useState<HealthTestBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'catalog' | 'my-bookings'>('catalog');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Booking Modal
  const [selectedTestForBooking, setSelectedTestForBooking] = useState<HealthTest | null>(null);
  const [collectionType, setCollectionType] = useState<'home' | 'lab'>('home');
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);
  const [bookingSlot, setBookingSlot] = useState('08:00 AM');
  const [homeAddress, setHomeAddress] = useState(
    'B-42, Gulmohar Enclave, South Delhi, New Delhi 110049'
  );
  const [isBookingSubmitting, setIsBookingSubmitting] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState<HealthTestBooking | null>(null);

  const categories = [
    'all',
    'Hematology',
    'Diabetes & Metabolism',
    'Cardiac & Lipids',
    'Endocrinology',
    'Renal Care',
    'Hepatic Care',
    'Blood Banking',
    'Full Body Wellness',
  ];

  const morningSlots = [
    '06:30 AM', '07:00 AM', '07:30 AM', '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM'
  ];

  const loadData = () => {
    setLoading(true);
    Promise.all([
      api.getTests(),
      api.getTestBookings(currentUser?.id || 'user_patient_1'),
    ]).then(([testsRes, bookingsRes]) => {
      if (testsRes.success && testsRes.tests) setTests(testsRes.tests);
      if (bookingsRes.success && bookingsRes.bookings) setBookings(bookingsRes.bookings);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, [currentUser?.id]);

  const handleBookTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTestForBooking) return;

    setIsBookingSubmitting(true);
    try {
      const res = await api.bookTest({
        testId: selectedTestForBooking.id,
        patientId: currentUser?.id || 'user_patient_1',
        patientName: currentUser?.name || 'Rahul Sharma',
        date: bookingDate,
        timeSlot: bookingSlot,
        collectionType,
        address: collectionType === 'home' ? homeAddress : undefined,
      });

      if (res.success && res.booking) {
        setBookingConfirmed(res.booking);
        loadData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsBookingSubmitting(false);
    }
  };

  const filteredTests = tests.filter((t) => {
    const matchesCat = selectedCategory === 'all' || t.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.shortCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Hero */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-teal-800 shadow-xl">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/30">
            <FlaskConical className="w-3.5 h-3.5" />
            <span>NABL &amp; ICMR Certified Diagnostic Quality</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            {lang === 'en' ? 'Diagnostic Health Tests & Profiles' : 'डायग्नोस्टिक हेल्थ टेस्ट एवं जांच पैकेज'}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            {lang === 'en'
              ? 'Book routine blood panels, vital screening, or complete body checkups with certified phlebotomists collecting samples at your doorstep or visit partner labs.'
              : 'घर बैठे ब्लड सैंपल संग्रह कराएं अथवा पार्टनर लैब विजिट करें। सीबीसी, डायबिटीज, लिपिड व फुल बॉडी चेकअप की प्रमाणित रिपोर्ट 12 घंटे के भीतर।'}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 space-x-6 text-xs font-bold">
        <button
          onClick={() => setActiveTab('catalog')}
          className={`pb-3 transition flex items-center space-x-2 border-b-2 ${
            activeTab === 'catalog'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>{lang === 'en' ? 'Available Tests & Packages' : 'उपलब्ध टेस्ट सूची'}</span>
          <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.2 rounded-full">
            {tests.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('my-bookings')}
          className={`pb-3 transition flex items-center space-x-2 border-b-2 ${
            activeTab === 'my-bookings'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>{lang === 'en' ? 'My Booked Tests' : 'मेरी टेस्ट बुकिंग'}</span>
          <span className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.2 rounded-full">
            {bookings.length}
          </span>
        </button>
      </div>

      {/* Catalog View */}
      {activeTab === 'catalog' ? (
        <div className="space-y-4">
          {/* Filters & Search */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder={
                  lang === 'en'
                    ? 'Search tests by name (e.g. CBC, Lipid, HbA1c, Thyroid)...'
                    : 'टेस्ट खोजें...'
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50"
              />
            </div>

            <div className="flex items-center space-x-1.5 overflow-x-auto text-xs">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition ${
                    selectedCategory === cat
                      ? 'bg-emerald-700 text-white font-bold'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {cat === 'all' ? 'All Categories' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Tests Grid */}
          {loading ? (
            <div className="p-12 text-center text-slate-500 text-xs">
              <span className="inline-block animate-spin mr-2">⟳</span>
              Loading diagnostics catalog...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredTests.map((test) => (
                <div
                  key={test.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded">
                        {test.category}
                      </span>
                      {test.badge && (
                        <span className="text-[10px] font-black uppercase tracking-wider bg-amber-500 text-white px-2 py-0.2 rounded-full">
                          {test.badge}
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-900 text-base">{test.name}</h3>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">{test.description}</p>
                    </div>

                    {/* Meta tags */}
                    <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-slate-600">
                      <div>
                        <span className="text-slate-400 block">Turnaround:</span>
                        <strong className="text-slate-800 flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-slate-500" />
                          <span>{test.turnaroundHours} Hours</span>
                        </strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Parameters:</span>
                        <strong className="text-slate-800">{test.parametersCount} Tests</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Fasting:</span>
                        <strong className="text-slate-800">
                          {test.fastingRequired ? `Yes (${test.fastingHours}h fast)` : 'Not required'}
                        </strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Sample:</span>
                        <strong className="text-slate-800">{test.sampleType}</strong>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 text-[11px]">
                      {test.homeCollectionAvailable ? (
                        <span className="text-emerald-700 flex items-center space-x-1 font-semibold">
                          <Home className="w-3.5 h-3.5" />
                          <span>Home Collection Available</span>
                        </span>
                      ) : (
                        <span className="text-slate-500 flex items-center space-x-1">
                          <Building2 className="w-3.5 h-3.5" />
                          <span>In-Clinic Lab Only</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Footer & Book */}
                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Total Price</span>
                      <span className="text-lg font-black text-slate-900">₹{test.price}</span>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedTestForBooking(test);
                        setBookingConfirmed(null);
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition shadow flex items-center space-x-1.5 cursor-pointer"
                    >
                      <span>Book Health Test</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Bookings View */
        <div className="space-y-4">
          {bookings.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-xs text-slate-500">
              No health test bookings yet. Explore our diagnostic catalog to schedule a test.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bookings.map((b) => (
                <div key={b.id} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        #{b.id}
                      </span>
                      <h3 className="font-bold text-slate-900 text-base mt-1">{b.testName}</h3>
                      <p className="text-xs text-slate-500">{b.provider}</p>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full capitalize ${
                        b.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {b.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Scheduled For:</span>
                      <strong className="text-slate-800">{b.date} at {b.timeSlot}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Mode:</span>
                      <strong className="text-slate-800 capitalize">
                        {b.collectionType === 'home' ? 'Home Sample Collection' : 'Lab Walk-In'}
                      </strong>
                    </div>
                    {b.address && (
                      <div className="pt-1 text-[11px] text-slate-500 border-t border-slate-200">
                        Address: <span className="text-slate-700">{b.address}</span>
                      </div>
                    )}
                  </div>

                  {b.status === 'completed' && b.resultReportId && (
                    <button
                      onClick={() => onNavigate('reports')}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-teal-300 font-bold text-xs py-2 rounded-xl transition flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-teal-400" />
                      <span>View Authorized Medical Report</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Booking Modal */}
      {selectedTestForBooking && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-start border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider block">
                  Diagnostic Booking Request
                </span>
                <h3 className="text-base font-black text-slate-900">
                  {selectedTestForBooking.name}
                </h3>
                <p className="text-xs text-slate-500">{selectedTestForBooking.provider}</p>
              </div>
              <button
                onClick={() => setSelectedTestForBooking(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {bookingConfirmed ? (
              <div className="p-6 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-black text-slate-900">Test Scheduled Successfully!</h4>
                <p className="text-xs text-slate-600">
                  A certified phlebotomist has been reserved for {bookingConfirmed.date} at {bookingConfirmed.timeSlot}.
                </p>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-left max-w-sm mx-auto space-y-1">
                  <p><strong>Booking ID:</strong> #{bookingConfirmed.id}</p>
                  <p><strong>Type:</strong> {bookingConfirmed.collectionType === 'home' ? 'Home Sample Pickup' : 'Lab Visit'}</p>
                  <p><strong>Fee:</strong> ₹{bookingConfirmed.price}</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedTestForBooking(null);
                    setActiveTab('my-bookings');
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition shadow"
                >
                  View in My Bookings
                </button>
              </div>
            ) : (
              <form onSubmit={handleBookTest} className="space-y-4 text-xs">
                {/* Collection Mode */}
                <div>
                  <label className="font-bold text-slate-700 block mb-2">Collection Mode</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setCollectionType('home')}
                      className={`p-3 rounded-xl border-2 text-left flex items-center space-x-2.5 transition cursor-pointer ${
                        collectionType === 'home'
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold'
                          : 'border-slate-200 text-slate-700'
                      }`}
                    >
                      <Home className="w-4 h-4 text-emerald-600" />
                      <div>
                        <p className="font-bold text-xs">Home Collection</p>
                        <p className="text-[10px] text-slate-500">Safe sample collection</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCollectionType('lab')}
                      className={`p-3 rounded-xl border-2 text-left flex items-center space-x-2.5 transition cursor-pointer ${
                        collectionType === 'lab'
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold'
                          : 'border-slate-200 text-slate-700'
                      }`}
                    >
                      <Building2 className="w-4 h-4 text-blue-600" />
                      <div>
                        <p className="font-bold text-xs">Lab Walk-In</p>
                        <p className="text-[10px] text-slate-500">Visit diagnostic centre</p>
                      </div>
                    </button>
                  </div>
                </div>

                {collectionType === 'home' && (
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Home Address for Sample Pickup</label>
                    <textarea
                      rows={2}
                      value={homeAddress}
                      onChange={(e) => setHomeAddress(e.target.value)}
                      required
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Date</label>
                    <input
                      type="date"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      required
                      className="w-full p-2 rounded-xl border border-slate-300 bg-slate-50 font-bold"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Morning Time Slot</label>
                    <select
                      value={bookingSlot}
                      onChange={(e) => setBookingSlot(e.target.value)}
                      className="w-full p-2 rounded-xl border border-slate-300 bg-slate-50 font-bold"
                    >
                      {morningSlots.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {selectedTestForBooking.fastingRequired && (
                  <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200 text-[11px] text-amber-900 flex items-start space-x-2">
                    <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Fasting Reminder:</strong> This test requires {selectedTestForBooking.fastingHours} hours of overnight fasting (water is permitted).
                    </span>
                  </div>
                )}

                <div className="border-t border-slate-200 pt-3 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Total Price</span>
                    <span className="text-xl font-black text-slate-900">₹{selectedTestForBooking.price}</span>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => setSelectedTestForBooking(null)}
                      className="px-4 py-2 font-bold text-slate-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isBookingSubmitting}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2 rounded-xl transition shadow cursor-pointer disabled:opacity-50"
                    >
                      {isBookingSubmitting ? 'Confirming...' : 'Confirm Test Booking'}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
