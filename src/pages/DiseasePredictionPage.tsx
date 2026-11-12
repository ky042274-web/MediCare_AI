import React, { useState } from 'react';
import {
  HeartPulse,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Stethoscope,
  Clock,
  Sparkles,
  ArrowRight,
  Info,
  Calendar,
  Languages,
  Activity,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';
import type { DiseaseAssessmentResult, Specialty } from '../types/index.ts';
import { api } from '../services/api.ts';

interface DiseasePredictionPageProps {
  onNavigate: (tab: string, extra?: any) => void;
  lang: 'en' | 'hi';
  onOpenSOS: () => void;
}

export const DiseasePredictionPage: React.FC<DiseasePredictionPageProps> = ({
  onNavigate,
  lang,
  onOpenSOS,
}) => {
  const commonSymptoms = [
    { en: 'Fever & Chills', hi: 'बुखार एवं कंपकंपी' },
    { en: 'Chest Pain or Tightness', hi: 'छाती में दर्द या जकड़न' },
    { en: 'Shortness of Breath', hi: 'सांस फूलना' },
    { en: 'Headache & Migraine', hi: 'सिरदर्द व माइग्रेन' },
    { en: 'Persistent Cough', hi: 'लगातार खांसी' },
    { en: 'Abdominal Pain', hi: 'पेट में दर्द' },
    { en: 'Extreme Fatigue', hi: 'अत्यधिक थकान' },
    { en: 'Joint Pain & Swelling', hi: 'जोड़ों में दर्द व सूजन' },
    { en: 'Skin Rash or Itching', hi: 'त्वचा पर चकत्ते या खुजली' },
    { en: 'Dizziness or Vertigo', hi: 'चक्कर आना' },
    { en: 'Acid Reflux / Heartburn', hi: 'एसिडिटी या जलन' },
    { en: 'Loss of Appetite', hi: 'भूख न लगना' },
  ];

  const durations = [
    { value: 'Less than 24 Hours', label: lang === 'en' ? '< 24 Hours' : '< 24 घंटे' },
    { value: '1 to 3 Days', label: lang === 'en' ? '1-3 Days' : '1-3 दिन' },
    { value: '4 to 7 Days', label: lang === 'en' ? '4-7 Days' : '4-7 दिन' },
    { value: 'More than 2 Weeks', label: lang === 'en' ? '2+ Weeks' : '2+ सप्ताह' },
  ];

  const severities = [
    { value: 'Mild', label: lang === 'en' ? 'Mild (Noticeable but bearable)' : 'हल्का' },
    { value: 'Moderate', label: lang === 'en' ? 'Moderate (Interferes with daily work)' : 'मध्यम' },
    { value: 'Severe', label: lang === 'en' ? 'Severe (Disabling pain/discomfort)' : 'गंभीर' },
    { value: 'Critical', label: lang === 'en' ? 'Critical (Requires immediate care)' : 'अति-गंभीर' },
  ];

  const ageGroups = [
    'Infant / Child (0-12)',
    'Adolescent (13-17)',
    'Young Adult (18-35)',
    'Middle-Aged (36-60)',
    'Senior (60+)',
  ];

  const medicalHistoryOptions = [
    'Hypertension / High BP',
    'Type 2 Diabetes',
    'Asthma / Bronchitis',
    'Heart Disease',
    'Thyroid Disorder',
    'None / Healthy Baseline',
  ];

  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [customSymptom, setCustomSymptom] = useState('');
  const [duration, setDuration] = useState('1 to 3 Days');
  const [severity, setSeverity] = useState('Moderate');
  const [ageGroup, setAgeGroup] = useState('Young Adult (18-35)');
  const [selectedHistory, setSelectedHistory] = useState<string[]>([]);
  const [vitalsInput, setVitalsInput] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [assessment, setAssessment] = useState<DiseaseAssessmentResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showHindiDirectly, setShowHindiDirectly] = useState(lang === 'hi');

  const toggleSymptom = (sym: string) => {
    if (selectedSymptoms.includes(sym)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== sym));
    } else {
      setSelectedSymptoms([...selectedSymptoms, sym]);
    }
  };

  const toggleHistory = (h: string) => {
    if (selectedHistory.includes(h)) {
      setSelectedHistory(selectedHistory.filter((item) => item !== h));
    } else {
      setSelectedHistory([...selectedHistory, h]);
    }
  };

  const handleRunAssessment = async (e: React.FormEvent) => {
    e.preventDefault();
    const allSymptomsList = [...selectedSymptoms];
    if (customSymptom.trim()) {
      allSymptomsList.push(customSymptom.trim());
    }

    if (allSymptomsList.length === 0) {
      setErrorMsg(
        lang === 'en'
          ? 'Please select or type at least one symptom.'
          : 'कृपया कम से कम एक लक्षण चुनें अथवा दर्ज करें।'
      );
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setAssessment(null);

    try {
      const res = await api.checkSymptoms({
        symptoms: allSymptomsList.join(', '),
        duration,
        severity,
        ageGroup,
        medicalHistory: selectedHistory.length > 0 ? selectedHistory.join(', ') : 'None',
        vitals: vitalsInput || 'Normal range reported',
      });

      if (res.success && res.assessment) {
        setAssessment(res.assessment);
        if (res.assessment.isEmergency) {
          // Trigger emergency awareness
        }
      } else {
        setErrorMsg(res.error || 'Unable to complete AI assessment.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error communicating with medical AI server.');
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'Emergency':
        return 'bg-rose-600 text-white border-rose-700 animate-pulse';
      case 'High':
        return 'bg-amber-600 text-white border-amber-700';
      case 'Moderate':
        return 'bg-yellow-100 text-yellow-900 border-yellow-300';
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="max-w-2xl space-y-2 relative z-10">
          <div className="inline-flex items-center space-x-2 bg-teal-500/20 text-teal-300 px-3 py-1 rounded-full text-xs font-bold border border-teal-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'Clinical Triage & Risk Assessment' : 'क्लिनिकल ट्राइएज एवं जोखिम विश्लेषण'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            {lang === 'en' ? 'AI Disease Risk Assessment' : 'एआई प्रारंभिक रोग जांच'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {lang === 'en'
              ? 'Enter your symptoms and medical background to receive early risk indicators, red-flag emergency screening, and specialist recommendations in simple English and Hindi.'
              : 'अपने लक्षण और स्वास्थ्य विवरण दर्ज करें। एआई तुरंत संभावित स्वास्थ्य स्थिति, जोखिम स्तर और उपयुक्त विशेषज्ञ डॉक्टर का सुझाव हिंदी व अंग्रेजी में देगा।'}
          </p>
        </div>
      </div>

      {/* Main Form or Results View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Form Panel */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <form onSubmit={handleRunAssessment} className="space-y-6">
            
            {/* Step 1: Symptoms Selection */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
                  <HeartPulse className="w-4 h-4 text-rose-500" />
                  <span>{lang === 'en' ? '1. Select Common Symptoms' : '1. लक्षण चुनें'}</span>
                </label>
                <span className="text-[11px] text-slate-400">Multiple allowed</span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {commonSymptoms.map((sym, idx) => {
                  const isSelected = selectedSymptoms.includes(sym.en);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => toggleSymptom(sym.en)}
                      className={`text-xs px-3 py-1.5 rounded-xl border transition cursor-pointer font-medium ${
                        isSelected
                          ? 'bg-teal-600 text-white border-teal-600 shadow-sm font-bold'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {lang === 'en' ? sym.en : sym.hi}
                    </button>
                  );
                })}
              </div>

              {/* Custom Symptom Box */}
              <div className="mt-3">
                <input
                  type="text"
                  placeholder={
                    lang === 'en'
                      ? 'Or type additional symptoms (e.g. sharp radiating shoulder pain, nausea)...'
                      : 'या अन्य लक्षण यहाँ लिखें...'
                  }
                  value={customSymptom}
                  onChange={(e) => setCustomSymptom(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 bg-slate-50"
                />
              </div>
            </div>

            {/* Step 2: Duration & Severity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2 flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-teal-600" />
                  <span>{lang === 'en' ? '2. Duration of Symptoms' : '2. लक्षणों की अवधि'}</span>
                </label>
                <div className="space-y-1.5">
                  {durations.map((d) => (
                    <button
                      key={d.value}
                      type="button"
                      onClick={() => setDuration(d.value)}
                      className={`w-full text-left text-xs px-3 py-2 rounded-lg border transition ${
                        duration === d.value
                          ? 'border-teal-600 bg-teal-50 text-teal-950 font-bold'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2 flex items-center space-x-1">
                  <Activity className="w-3.5 h-3.5 text-teal-600" />
                  <span>{lang === 'en' ? '3. Severity Level' : '3. तीव्रता का स्तर'}</span>
                </label>
                <div className="space-y-1.5">
                  {severities.map((s) => (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => setSeverity(s.value)}
                      className={`w-full text-left text-xs px-3 py-2 rounded-lg border transition ${
                        severity === s.value
                          ? 'border-teal-600 bg-teal-50 text-teal-950 font-bold'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 3: Age & Pre-existing conditions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-1.5">
                  {lang === 'en' ? '4. Patient Age Group' : '4. आयु वर्ग'}
                </label>
                <select
                  value={ageGroup}
                  onChange={(e) => setAgeGroup(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
                >
                  {ageGroups.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-1.5">
                  {lang === 'en' ? '5. Known Medical Conditions' : '5. पूर्व स्वास्थ्य स्थिति'}
                </label>
                <div className="flex flex-wrap gap-1">
                  {medicalHistoryOptions.map((h, i) => {
                    const sel = selectedHistory.includes(h);
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => toggleHistory(h)}
                        className={`text-[11px] px-2.5 py-1 rounded-lg border transition ${
                          sel
                            ? 'bg-slate-800 text-white border-slate-800 font-semibold'
                            : 'bg-slate-50 text-slate-600 border-slate-200'
                        }`}
                      >
                        {h}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Optional vitals */}
            <div>
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-1">
                {lang === 'en' ? '6. Available Vitals (Optional)' : '6. महत्वपूर्ण आंकड़े (वैकल्पिक)'}
              </label>
              <input
                type="text"
                placeholder="E.g., Temp 101.4°F, BP 130/88 mmHg, SpO2 97%..."
                value={vitalsInput}
                onChange={(e) => setVitalsInput(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50"
              />
            </div>

            {errorMsg && (
              <div className="bg-rose-50 border border-rose-300 text-rose-800 p-3 rounded-xl text-xs flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Submit button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-teal-600 to-cyan-700 hover:from-teal-700 hover:to-cyan-800 text-white font-black text-sm py-3.5 rounded-xl shadow-lg transition flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Analyzing Clinical Symptoms with Gemini AI...</span>
                  </>
                ) : (
                  <>
                    <HeartPulse className="w-5 h-5" />
                    <span>{lang === 'en' ? 'Generate AI Risk Assessment' : 'रोग जोखिम विश्लेषण प्राप्त करें'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Results Panel */}
        <div className="lg:col-span-5 space-y-4">
          {assessment ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-md space-y-5 animate-in fade-in zoom-in duration-200">
              
              {/* Emergency Banner if Triggered */}
              {assessment.isEmergency && (
                <div className="bg-rose-600 text-white rounded-xl p-4 shadow-lg border-2 border-rose-700 space-y-2 animate-soft-pulse">
                  <div className="flex items-center space-x-2">
                    <ShieldAlert className="w-6 h-6 animate-bounce" />
                    <h3 className="font-black text-base uppercase tracking-tight">
                      {lang === 'en' ? 'Emergency Care Recommended' : 'आपातकालीन चिकित्सा आवश्यक'}
                    </h3>
                  </div>
                  <p className="text-xs text-rose-100 font-medium leading-relaxed">
                    {showHindiDirectly && assessment.emergencyWarningHindi
                      ? assessment.emergencyWarningHindi
                      : assessment.emergencyWarning}
                  </p>
                  <button
                    onClick={onOpenSOS}
                    className="w-full mt-2 bg-white text-rose-900 hover:bg-rose-50 font-black text-xs py-2 rounded-lg transition shadow flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <span>{lang === 'en' ? 'Open Emergency Hotline (112 / 108)' : 'आपातकालीन हेल्पलाइन (112 / 108)'}</span>
                  </button>
                </div>
              )}

              {/* Risk Level Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider block">
                    Calculated Risk Level
                  </span>
                  <div className="flex items-center space-x-2 mt-0.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-black border ${getRiskBadge(assessment.riskLevel)}`}>
                      {assessment.riskLevel} Risk
                    </span>
                  </div>
                </div>

                {/* Bilingual View Toggle */}
                <button
                  type="button"
                  onClick={() => setShowHindiDirectly(!showHindiDirectly)}
                  className="flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                >
                  <Languages className="w-3.5 h-3.5 text-teal-600" />
                  <span>{showHindiDirectly ? 'Read in English' : 'हिंदी में देखें'}</span>
                </button>
              </div>

              {/* Probable Conditions */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  {lang === 'en' ? 'Possible Conditions & Clinical Rationale' : 'संभावित स्वास्थ्य स्थितियां'}
                </h4>
                <div className="space-y-2.5">
                  {assessment.possibleConditions.map((cond, i) => (
                    <div key={i} className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <strong className="text-slate-900 font-black text-sm">
                          {showHindiDirectly ? cond.conditionHindi : cond.condition}
                        </strong>
                        <span className="bg-teal-100 text-teal-800 font-bold text-[10px] px-2 py-0.5 rounded">
                          {cond.probability}
                        </span>
                      </div>
                      <p className="text-slate-600 leading-relaxed text-[11px]">{cond.reasoning}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Specialty with Action Button */}
              <div className="bg-teal-50 border border-teal-200 rounded-xl p-4">
                <span className="text-[10px] text-teal-700 font-bold uppercase tracking-wider block">
                  Recommended Specialty
                </span>
                <p className="text-base font-black text-teal-950 mt-0.5">
                  {assessment.recommendedSpecialty}
                </p>
                <button
                  onClick={() => onNavigate('doctors', { specialty: assessment.recommendedSpecialty })}
                  className="mt-3 w-full bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs py-2 rounded-lg transition flex items-center justify-center space-x-1.5 shadow-sm cursor-pointer"
                >
                  <Stethoscope className="w-3.5 h-3.5" />
                  <span>Book Consultation with {assessment.recommendedSpecialty.split(' — ')[0]}</span>
                </button>
              </div>

              {/* Next Steps in English or Hindi */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  {showHindiDirectly ? 'सुझाए गए अगले कदम' : 'Recommended Next Steps'}
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {(showHindiDirectly ? assessment.nextStepsHindi : assessment.nextStepsEnglish).map((step, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Mandatory Medical Disclaimer */}
              <div className="text-[11px] text-slate-500 bg-slate-100 p-3 rounded-lg border border-slate-200 leading-relaxed">
                <div className="flex items-center space-x-1 text-slate-700 font-bold mb-1">
                  <Info className="w-3.5 h-3.5 text-teal-600" />
                  <span>Official Health Notice:</span>
                </div>
                {assessment.clinicalDisclaimer}
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto">
                <HeartPulse className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Awaiting Symptom Details</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto leading-relaxed">
                  Select your symptoms on the left to review potential health risks, urgency level, and specialty doctor recommendations.
                </p>
              </div>
              <div className="text-[11px] text-slate-400 bg-white p-3 rounded-xl border border-slate-200 max-w-xs mx-auto text-left space-y-1">
                <p className="font-bold text-slate-700">Why MediCare AI Triage?</p>
                <p>• Emergency red-flag detection</p>
                <p>• Plain-language Hindi and English summaries</p>
                <p>• Instant link to 17 verified hospital specialties</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
