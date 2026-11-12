import React, { useState, useRef, useEffect } from 'react';
import {
  BotMessageSquare,
  Send,
  Sparkles,
  ShieldAlert,
  AlertTriangle,
  HeartPulse,
  Stethoscope,
  RefreshCw,
  Languages,
  CheckCircle2,
  HelpCircle,
  PhoneCall,
} from 'lucide-react';
import { api } from '../services/api.ts';

interface AIHealthAssistantPageProps {
  lang: 'en' | 'hi';
  onNavigate: (tab: string, extra?: any) => void;
  onOpenSOS: () => void;
}

export const AIHealthAssistantPage: React.FC<AIHealthAssistantPageProps> = ({
  lang,
  onNavigate,
  onOpenSOS,
}) => {
  const [messages, setMessages] = useState<{ sender: 'ai' | 'user'; text: string; time: string }[]>([
    {
      sender: 'ai',
      text:
        lang === 'en'
          ? "Hello! I am your MediCare AI Health Assistant. How can I help you today? I can explain medical terms, guide you on fasting test preparations, recommend doctor specialties across our 17 departments, or discuss blood donation criteria."
          : "नमस्ते! मैं आपका MediCare AI स्वास्थ्य सहायक हूँ। आज मैं आपकी क्या सहायता कर सकता हूँ? मैं चिकित्सा शब्दों की व्याख्या, टेस्ट से पहले की सावधानियां, 17 विभागों में से उपयुक्त डॉक्टर का चुनाव या रक्तदान से जुड़े नियमों की जानकारी दे सकता हूँ।",
      time: 'Just now',
    },
  ]);

  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = [
    {
      en: 'What are the rules and intervals for donating blood?',
      hi: 'रक्तदान करने के क्या नियम और समय अंतराल हैं?',
    },
    {
      en: 'How should I prepare for a fasting blood sugar & lipid test?',
      hi: 'फास्टिंग ब्लड शुगर और लिपिड टेस्ट से पहले क्या सावधानियां रखें?',
    },
    {
      en: 'Which specialist should I consult for severe chronic migraines?',
      hi: 'लगातार सिरदर्द और माइग्रेन के लिए किस डॉक्टर से मिलना चाहिए?',
    },
    {
      en: 'What are the red-flag emergency symptoms that require calling 108/112?',
      hi: 'कौन से ऐसे आपातकालीन लक्षण हैं जिनमें तुरंत 108 या 112 पर कॉल करना चाहिए?',
    },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isSending) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = { sender: 'user' as const, text: query, time: timeStr };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsSending(true);

    try {
      const historyContext = messages.map((m) => ({
        sender: m.sender === 'ai' ? 'assistant' : 'user',
        text: m.text,
      }));

      const res = await api.sendChatMessage(query, historyContext);
      if (res.success && res.reply) {
        setMessages((prev) => [
          ...prev,
          { sender: 'ai', text: res.reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text:
            lang === 'en'
              ? 'I encountered an issue connecting to the medical AI service. Please verify your connection or try again.'
              : 'सर्वर से संपर्क करने में असमर्थ। कृपया पुनः प्रयास करें।',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex items-center justify-between">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 bg-teal-500/20 text-teal-300 px-3 py-1 rounded-full text-xs font-bold border border-teal-500/30">
            <BotMessageSquare className="w-3.5 h-3.5" />
            <span>Bilingual Health Companion (English &amp; हिंदी)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            {lang === 'en' ? 'MediCare AI Health Assistant' : 'एआई स्वास्थ्य सहायक'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            {lang === 'en'
              ? 'Ask health questions, clarify laboratory terminology, and discover recommended hospital specialties.'
              : 'स्वास्थ्य संबंधी प्रश्न पूछें, मेडिकल शब्दों का अर्थ समझें और उपयुक्त डॉक्टर का सुझाव पाएं।'}
          </p>
        </div>

        <button
          onClick={onOpenSOS}
          className="hidden sm:flex bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition items-center space-x-1.5 cursor-pointer shadow-md"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>Emergency (112)</span>
        </button>
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
          {lang === 'en' ? 'Suggested Health Questions:' : 'सुझाए गए प्रश्न:'}
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {suggestedPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(lang === 'en' ? p.en : p.hi)}
              className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-teal-50 hover:border-teal-300 text-left text-xs font-medium text-slate-700 transition flex items-start space-x-2 cursor-pointer shadow-sm"
            >
              <HelpCircle className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
              <span>{lang === 'en' ? p.en : p.hi}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[520px] overflow-hidden">
        {/* Messages Stream */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/50">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex items-start space-x-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'ai' && (
                <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <BotMessageSquare className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[80%] rounded-2xl p-4 text-xs shadow-sm leading-relaxed whitespace-pre-line ${
                  m.sender === 'user'
                    ? 'bg-teal-600 text-white rounded-tr-none'
                    : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                }`}
              >
                <p>{m.text}</p>
                <span
                  className={`text-[9px] block mt-1.5 ${
                    m.sender === 'user' ? 'text-teal-200 text-right' : 'text-slate-400'
                  }`}
                >
                  {m.time}
                </span>
              </div>
            </div>
          ))}

          {isSending && (
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <RefreshCw className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-3.5 text-xs text-slate-500 rounded-tl-none flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping"></span>
                <span>MediCare AI is formulating a clinically grounded explanation...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Guardrail Disclaimer Bar */}
        <div className="px-4 py-1.5 bg-amber-50/70 border-t border-amber-200/60 text-[10px] text-amber-900 flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>AI provides health education only. Never prescribes medicines or replaces physician diagnosis.</span>
          </div>
          <button
            onClick={() => onNavigate('disease-predict')}
            className="font-bold text-amber-800 hover:underline shrink-0"
          >
            Structured Triage →
          </button>
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 bg-white border-t border-slate-200 flex items-center space-x-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              lang === 'en'
                ? 'Type your health question (e.g. How does fasting affect cholesterol?)...'
                : 'अपना स्वास्थ्य प्रश्न यहाँ लिखें...'
            }
            className="flex-1 text-xs px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-teal-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || isSending}
            className="bg-teal-600 hover:bg-teal-700 text-white font-bold p-3 rounded-xl transition shadow disabled:opacity-40 cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
