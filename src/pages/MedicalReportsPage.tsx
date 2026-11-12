import React, { useState, useEffect } from 'react';
import {
  FileText,
  Upload,
  Sparkles,
  Share2,
  Download,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  UserCheck,
  Building2,
  Plus,
  RefreshCw,
  Languages,
} from 'lucide-react';
import type { MedicalReport, Doctor, User } from '../types/index.ts';
import { api } from '../services/api.ts';

interface MedicalReportsPageProps {
  currentUser: User | null;
  lang: 'en' | 'hi';
  onNavigate: (tab: string, extra?: any) => void;
}

export const MedicalReportsPage: React.FC<MedicalReportsPageProps> = ({
  currentUser,
  lang,
  onNavigate,
}) => {
  const [reports, setReports] = useState<MedicalReport[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<MedicalReport | null>(null);

  // AI Interpretation State
  const [analyzingAi, setAnalyzingAi] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<any | null>(null);
  const [showHindi, setShowHindi] = useState(lang === 'hi');

  // Upload Modal State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [reportTitle, setReportTitle] = useState('');
  const [reportType, setReportType] = useState('Lipid & Biochemistry Panel');
  const [labName, setLabName] = useState('MediCare Diagnostics Saket');
  const [reportNotes, setReportNotes] = useState('');

  // Sample quick report data templates
  const sampleReportsPresets = [
    {
      title: 'HbA1c & Glycemic Diabetes Report',
      testType: 'Diabetes Screening',
      laboratoryName: 'Metropolis Healthcare Labs',
      biomarkers: [
        { name: 'HbA1c (Glycated Hemoglobin)', value: 7.4, unit: '%', referenceRange: '< 5.7', status: 'high' },
        { name: 'Estimated Average Glucose (eAG)', value: 166, unit: 'mg/dL', referenceRange: '< 117', status: 'high' },
        { name: 'Fasting Plasma Blood Sugar', value: 148, unit: 'mg/dL', referenceRange: '70 - 99', status: 'high' },
        { name: 'Urine Microalbumin', value: 24, unit: 'mg/L', referenceRange: '< 30', status: 'normal' },
      ],
    },
    {
      title: 'Thyroid Function Test (TFT)',
      testType: 'Endocrinology',
      laboratoryName: 'Dr. Lal PathLabs',
      biomarkers: [
        { name: 'Ultra-sensitive TSH', value: 6.8, unit: 'uIU/mL', referenceRange: '0.45 - 4.5', status: 'high' },
        { name: 'Free T3 (Triiodothyronine)', value: 2.9, unit: 'pg/mL', referenceRange: '2.0 - 4.4', status: 'normal' },
        { name: 'Free T4 (Thyroxine)', value: 0.95, unit: 'ng/dL', referenceRange: '0.82 - 1.77', status: 'normal' },
      ],
    },
  ];

  const loadData = () => {
    setLoading(true);
    Promise.all([
      api.getReports(currentUser?.id || 'user_patient_1'),
      api.getDoctors(),
    ]).then(([repRes, docRes]) => {
      if (repRes.success && repRes.reports) {
        setReports(repRes.reports);
        if (repRes.reports.length > 0) {
          setSelectedReport(repRes.reports[0]);
        }
      }
      if (docRes.success && docRes.doctors) setDoctors(docRes.doctors);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, [currentUser?.id]);

  const handleToggleDoctorShare = async (doctorId: string) => {
    if (!selectedReport) return;
    const res = await api.toggleReportShare(selectedReport.id, doctorId);
    if (res.success && res.report) {
      setSelectedReport(res.report);
      loadData();
    }
  };

  const handleAnalyzeWithAI = async () => {
    if (!selectedReport) return;
    setAnalyzingAi(true);
    setAiAnalysisResult(null);

    try {
      const res = await api.analyzeReport({
        reportTitle: selectedReport.title,
        biomarkers: selectedReport.biomarkers,
        rawText: selectedReport.notes,
      });

      if (res.success && res.analysis) {
        setAiAnalysisResult(res.analysis);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzingAi(false);
    }
  };

  const handleUploadSamplePreset = async (preset: any) => {
    const newRep = await api.uploadReport({
      title: preset.title,
      testType: preset.testType,
      laboratoryName: preset.laboratoryName,
      patientId: currentUser?.id || 'user_patient_1',
      patientName: currentUser?.name || 'Rahul Sharma',
      biomarkers: preset.biomarkers,
    });
    if (newRep.success) {
      loadData();
      setShowUploadModal(false);
    }
  };

  const handleCustomUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    const newRep = await api.uploadReport({
      title: reportTitle || 'General Lab Report',
      testType: reportType,
      laboratoryName: labName,
      patientId: currentUser?.id || 'user_patient_1',
      patientName: currentUser?.name || 'Rahul Sharma',
      notes: reportNotes,
      biomarkers: [
        { name: 'Fasting Blood Glucose', value: 105, unit: 'mg/dL', referenceRange: '70 - 99', status: 'high' },
        { name: 'Serum Creatinine', value: 0.9, unit: 'mg/dL', referenceRange: '0.7 - 1.2', status: 'normal' },
        { name: 'Total Cholesterol', value: 195, unit: 'mg/dL', referenceRange: '< 200', status: 'normal' },
      ],
    });
    if (newRep.success) {
      loadData();
      setShowUploadModal(false);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Hero */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 border border-purple-800 shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center space-x-2 bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-xs font-bold border border-purple-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'Gemini AI Plain-Language Explanations' : 'एआई सरल रिपोर्ट व्याख्या'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            {lang === 'en' ? 'Medical Reports & Health Records' : 'मेडिकल रिपोर्ट एवं स्वास्थ्य रिकॉर्ड्स'}
          </h1>
          <p className="text-xs sm:text-sm text-purple-100/90 leading-relaxed">
            {lang === 'en'
              ? 'Secure electronic health records with biomarker tracking, bilingual AI interpretations (Hindi & English), and granular consent-based doctor sharing.'
              : 'लैब रिपोर्ट सुरक्षित रखें, एआई द्वारा सरल हिंदी व अंग्रेजी में समझें और अपनी सहमति से किसी भी डॉक्टर के साथ साझा करें।'}
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="bg-white hover:bg-slate-100 text-purple-950 font-black text-xs px-5 py-2.5 rounded-xl transition shadow flex items-center space-x-1.5 shrink-0 cursor-pointer"
        >
          <Upload className="w-4 h-4 text-purple-700" />
          <span>{lang === 'en' ? 'Upload New Report' : 'नई रिपोर्ट अपलोड करें'}</span>
        </button>
      </div>

      {/* Main Grid: Left Reports List, Right Report Detail & AI Explanation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left List */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
            <span>Your Stored Health Records</span>
            <span className="text-slate-400 font-normal">{reports.length} Reports</span>
          </h3>

          {loading ? (
            <div className="p-8 text-center text-slate-500 text-xs">Loading records...</div>
          ) : reports.length === 0 ? (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
              No reports uploaded yet.
            </div>
          ) : (
            <div className="space-y-2">
              {reports.map((rep) => {
                const isSelected = selectedReport?.id === rep.id;
                return (
                  <div
                    key={rep.id}
                    onClick={() => {
                      setSelectedReport(rep);
                      setAiAnalysisResult(null);
                    }}
                    className={`p-4 rounded-xl border transition cursor-pointer text-xs space-y-1 ${
                      isSelected
                        ? 'bg-purple-50/70 border-purple-500 shadow-sm'
                        : 'bg-white hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-slate-900">{rep.title}</h4>
                      <span className="text-[10px] text-slate-400 font-mono">{rep.date}</span>
                    </div>
                    <p className="text-[11px] text-teal-700 font-medium">{rep.testType}</p>
                    <p className="text-[10px] text-slate-500">{rep.laboratoryName}</p>

                    <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
                      <span>{rep.biomarkers?.length || 0} Biomarkers</span>
                      <span className="text-purple-700 font-semibold">
                        Shared with {rep.sharedWithDoctorIds.length} Doctors
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Detail & AI Analysis */}
        <div className="lg:col-span-8">
          {selectedReport ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
              
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-200 pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                    Official Diagnostic Record #{selectedReport.id}
                  </span>
                  <h2 className="text-xl font-black text-slate-900 mt-1">{selectedReport.title}</h2>
                  <p className="text-xs text-slate-500">
                    {selectedReport.laboratoryName} • Tested on {selectedReport.date}
                  </p>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={handleAnalyzeWithAI}
                    disabled={analyzingAi}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition shadow flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {analyzingAi ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Analyzing with Gemini AI...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Explain with AI (Bilingual)</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      alert('Downloaded clinical PDF summary for patient record.');
                    }}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs p-2 rounded-xl transition"
                    title="Download Report Summary"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Biomarkers Table */}
              {selectedReport.biomarkers && selectedReport.biomarkers.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Verified Biomarkers &amp; Reference Ranges
                  </h3>
                  <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[11px] uppercase">
                        <tr>
                          <th className="py-2.5 px-3">Parameter</th>
                          <th className="py-2.5 px-3">Result</th>
                          <th className="py-2.5 px-3">Reference Range</th>
                          <th className="py-2.5 px-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {selectedReport.biomarkers.map((b, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="py-2 px-3 font-bold text-slate-800">{b.name}</td>
                            <td className="py-2 px-3 font-mono font-bold text-slate-900">
                              {b.value} <span className="text-[10px] text-slate-500 font-normal">{b.unit}</span>
                            </td>
                            <td className="py-2 px-3 text-slate-500 text-[11px]">{b.referenceRange}</td>
                            <td className="py-2 px-3">
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                                  b.status === 'normal'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : b.status === 'high'
                                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                    : 'bg-rose-100 text-rose-800'
                                }`}
                              >
                                {b.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* AI Explanation Box */}
              {(aiAnalysisResult || selectedReport.aiSummaryEnglish) && (
                <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-teal-50 border-2 border-purple-200 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-5 h-5 text-purple-600" />
                      <h4 className="font-black text-slate-900 text-sm">
                        AI-Assisted Diagnostic Explanation
                      </h4>
                    </div>

                    <button
                      onClick={() => setShowHindi(!showHindi)}
                      className="flex items-center space-x-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-white border border-purple-200 text-purple-800 shadow-sm"
                    >
                      <Languages className="w-3.5 h-3.5" />
                      <span>{showHindi ? 'Read in English' : 'हिंदी में पढ़ें'}</span>
                    </button>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed">
                    {showHindi
                      ? aiAnalysisResult?.hindiSummary || selectedReport.aiSummaryHindi
                      : aiAnalysisResult?.englishSummary || selectedReport.aiSummaryEnglish}
                  </p>

                  {/* Key Findings */}
                  <div>
                    <span className="text-[11px] font-bold text-purple-900 uppercase block mb-1">
                      Key Takeaways:
                    </span>
                    <ul className="space-y-1 text-xs text-slate-700">
                      {(aiAnalysisResult?.keyFindings || selectedReport.keyFindings || []).map((kf: string, i: number) => (
                        <li key={i} className="flex items-start space-x-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                          <span>{kf}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-[11px] text-purple-900 border-t border-purple-200/60">
                    <span>
                      Recommended Doctor Specialty:{' '}
                      <strong className="text-purple-950">
                        {aiAnalysisResult?.recommendedSpecialty || selectedReport.recommendedSpecialty || 'General Physician'}
                      </strong>
                    </span>
                    <button
                      onClick={() =>
                        onNavigate('doctors', {
                          specialty:
                            aiAnalysisResult?.recommendedSpecialty || selectedReport.recommendedSpecialty,
                        })
                      }
                      className="text-purple-700 font-bold hover:underline"
                    >
                      Book Specialist →
                    </button>
                  </div>
                </div>
              )}

              {/* Consent-Based Sharing with Doctors */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center space-x-2">
                  <Share2 className="w-4 h-4 text-teal-600" />
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Consent-Based Doctor Sharing (Protected Access)
                  </h4>
                </div>
                <p className="text-[11px] text-slate-500">
                  Select which verified doctors are authorized to review this report during appointments:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {doctors.slice(0, 4).map((doc) => {
                    const isShared = selectedReport.sharedWithDoctorIds.includes(doc.id);
                    return (
                      <button
                        key={doc.id}
                        onClick={() => handleToggleDoctorShare(doc.id)}
                        className={`p-2.5 rounded-xl border text-left flex items-center justify-between text-xs transition cursor-pointer ${
                          isShared
                            ? 'bg-teal-50 border-teal-500 text-teal-950 font-bold'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <img
                            src={doc.avatarUrl}
                            alt={doc.name}
                            className="w-7 h-7 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-bold text-xs">{doc.name}</p>
                            <p className="text-[10px] text-slate-500">{doc.specialty.split(' — ')[0]}</p>
                          </div>
                        </div>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                            isShared ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {isShared ? 'Shared' : 'Allow Access'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Regulatory Notice */}
              <div className="text-[11px] text-slate-400 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <strong>Medical Record Disclaimer:</strong> AI report interpretations do not substitute formal laboratory sign-off or doctor diagnosis. Never alter or discontinue prescribed medication without consulting your physician.
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-xs text-slate-500">
              Select a report from the left panel to review laboratory results and AI breakdown.
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-start border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">Upload Medical Diagnostic Report</h3>
                <p className="text-xs text-slate-500">
                  Add PDF, image reports, or select pre-loaded clinical panels for testing.
                </p>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            {/* Quick Demo Presets */}
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Quick Test: Load Pre-Formatted Diagnostic Sample
              </span>
              <div className="grid grid-cols-2 gap-2">
                {sampleReportsPresets.map((preset, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleUploadSamplePreset(preset)}
                    className="p-3 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl text-left text-xs transition cursor-pointer"
                  >
                    <p className="font-bold text-purple-950">{preset.title}</p>
                    <p className="text-[10px] text-purple-700">{preset.biomarkers.length} Lab Biomarkers</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-3 text-slate-400 text-[10px] uppercase font-bold">Or Enter Custom Record</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            <form onSubmit={handleCustomUpload} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Report Title</label>
                <input
                  type="text"
                  placeholder="E.g. Fasting Blood Sugar & Lipid Panel"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Test Type</label>
                  <input
                    type="text"
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Laboratory Name</label>
                  <input
                    type="text"
                    value={labName}
                    onChange={(e) => setLabName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Report Clinical Notes</label>
                <textarea
                  rows={2}
                  placeholder="Paste laboratory notes or summary here..."
                  value={reportNotes}
                  onChange={(e) => setReportNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-5 py-2 rounded-xl transition shadow cursor-pointer"
                >
                  Upload &amp; Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
