import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Bot,
  User,
  ExternalLink,
  HelpCircle,
  RotateCcw
} from 'lucide-react';
import { processSapthaQuery, ChatMessage } from '../services/aiService';

interface SapthaAIModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSrn?: string;
}

export const SapthaAIModal: React.FC<SapthaAIModalProps> = ({
  isOpen,
  onClose,
  currentSrn = '24SUUBECS0001'
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: "Namaskara! I am Saptha AI ✦, your intelligent campus voice & text assistant at Sapthagiri NPS University. Ask me about your subject-wise attendance, 5CSE01 timetable, period timings, tea break, IA exams, or campus landmarks!",
      timestamp: 'Just now',
      suggestions: [
        'What is my current attendance?',
        'When is the tea break and lunch break?',
        'Who teaches Machine Learning?',
        'When is the IA-1 examination?',
        'Where is the Central Library located?',
        'What is the 75% attendance rule?'
      ]
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeakingEnabled, setIsSpeakingEnabled] = useState(true);
  const [speechError, setSpeechError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize Speech Recognition if supported
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-IN';

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInputQuery(transcript);
          handleSend(transcript);
          setIsListening(false);
        };

        recognition.onerror = (err: any) => {
          console.warn('Speech recognition error:', err);
          setIsListening(false);
          setSpeechError('Microphone permission or speech input not detected. You can type freely!');
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const speakText = (text: string) => {
    if (!isSpeakingEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    // Clean bullet points and markdown emojis for cleaner speech
    const clean = text.replace(/[*#•—✦⚠️🌟]/g, ' ').replace(/\s+/g, ' ');
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.lang = 'en-IN';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const toggleMic = () => {
    setSpeechError(null);
    if (!recognitionRef.current) {
      setSpeechError('Speech recognition is not supported in this browser version. Please type below.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        setIsListening(false);
      }
    }
  };

  const handleSend = (textToSend?: string) => {
    const q = (textToSend || inputQuery).trim();
    if (!q) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');

    // Generate intelligent AI response
    setTimeout(() => {
      const answer = processSapthaQuery(q, currentSrn);
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: answer,
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        suggestions: [
          'What is the last working day?',
          'Tell me about Basement Seminar Hall',
          'Visit official snpsu.edu.in'
        ]
      };
      setMessages(prev => [...prev, aiMsg]);
      speakText(answer);
    }, 400);
  };

  const handleResetChat = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'assistant',
        text: "Chat refreshed. How can I assist you with your academic schedule, timetable, or attendance today?",
        timestamp: 'Just now',
        suggestions: [
          'What is my current attendance?',
          'When is the tea break and lunch break?',
          'When is the IA-1 examination?'
        ]
      }
    ]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-xs animate-fade-in">
      <div
        className="bg-white rounded-2xl max-w-2xl w-full h-[620px] max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Assistant Header */}
        <div className="p-4 sm:px-6 bg-[#0c1b4f] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 shadow-md">
              <Sparkles className="w-5 h-5 fill-white text-amber-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Saptha AI ✦</h3>
                <span className="px-2 py-0.2 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold rounded">
                  Active
                </span>
              </div>
              <p className="text-[11px] text-amber-200/80">
                Official Campus Intelligence & Voice Assistant · SNPSU
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio Voice Toggle */}
            <button
              onClick={() => {
                if (isSpeakingEnabled && typeof window !== 'undefined' && window.speechSynthesis) {
                  window.speechSynthesis.cancel();
                }
                setIsSpeakingEnabled(!isSpeakingEnabled);
              }}
              className={`p-2 rounded-lg transition-colors ${
                isSpeakingEnabled
                  ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30'
                  : 'bg-white/10 text-slate-400 hover:bg-white/20'
              }`}
              title={isSpeakingEnabled ? 'Voice Response Enabled (Click to Mute)' : 'Voice Response Muted'}
            >
              {isSpeakingEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Clear Chat */}
            <button
              onClick={handleResetChat}
              className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              title="Reset Conversation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Close */}
            <button
              onClick={() => {
                if (typeof window !== 'undefined' && window.speechSynthesis) {
                  window.speechSynthesis.cancel();
                }
                onClose();
              }}
              className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/70">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.sender === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                msg.sender === 'user'
                  ? 'bg-[#0c1b4f] text-white'
                  : 'bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 shadow-xs'
              }`}>
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`max-w-[85%] space-y-2 ${
                msg.sender === 'user' ? 'text-right' : 'text-left'
              }`}>
                <div className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-[#0c1b4f] text-white rounded-tr-xs'
                    : 'bg-white text-slate-800 border border-slate-200 shadow-xs rounded-tl-xs whitespace-pre-line'
                }`}>
                  {msg.text}
                </div>

                <div className="text-[10px] text-slate-400 px-1 font-mono">
                  {msg.timestamp}
                </div>

                {/* Quick Suggestion Pills */}
                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {msg.suggestions.map((sug, sIdx) => (
                      <button
                        key={sIdx}
                        onClick={() => handleSend(sug)}
                        className="text-[11px] font-semibold text-indigo-900 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 px-2.5 py-1 rounded-lg transition-colors shadow-2xs"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {speechError && (
            <div className="p-2.5 bg-rose-50 text-rose-700 text-xs rounded-lg border border-rose-200">
              {speechError}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            {/* Voice Input Mic Button */}
            <button
              type="button"
              onClick={toggleMic}
              className={`p-2.5 rounded-xl border transition-all ${
                isListening
                  ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
              }`}
              title={isListening ? 'Listening... Click to Stop' : 'Speak via Microphone'}
            >
              {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4 text-slate-500" />}
            </button>

            <input
              type="text"
              placeholder={isListening ? "Listening to your voice..." : "Ask Saptha AI anything about timetable, attendance, campus..."}
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-600 focus:bg-white transition-colors"
            />

            <button
              type="submit"
              disabled={!inputQuery.trim()}
              className="px-4 py-2.5 bg-[#0c1b4f] hover:bg-blue-900 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-xs"
            >
              <span>Ask</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 px-1">
            <span>Powered by Campus RAG Intelligence & Speech API</span>
            <a
              href="https://snpsu.edu.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0c1b4f] hover:underline flex items-center gap-1 font-medium"
            >
              snpsu.edu.in
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
