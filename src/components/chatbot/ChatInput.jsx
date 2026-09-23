import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Mic, MicOff, AlertCircle, X, Globe } from 'lucide-react';

const LANGUAGE_RECOGNITION_MAP = {
  en: { code: 'en-IN', label: 'English (IN)', short: 'EN' },
  hi: { code: 'hi-IN', label: 'हिन्दी', short: 'HI' },
  pa: { code: 'pa-IN', label: 'ਪੰਜਾਬੀ', short: 'PA' },
  hinglish: { code: 'hi-IN', label: 'Hinglish', short: 'HI' }
};

export const ChatInput = ({ 
  onSendMessage, 
  isLoading = false, 
  disabled = false, 
  activeLanguage = 'en' 
}) => {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState(null);
  const [selectedLang, setSelectedLang] = useState(() => {
    return activeLanguage && LANGUAGE_RECOGNITION_MAP[activeLanguage] ? activeLanguage : 'en';
  });

  const inputRef = useRef(null);
  const recognitionRef = useRef(null);

  // Sync selected voice language when activeLanguage changes
  useEffect(() => {
    if (activeLanguage && LANGUAGE_RECOGNITION_MAP[activeLanguage]) {
      setSelectedLang(activeLanguage);
    }
  }, [activeLanguage]);

  useEffect(() => {
    if (!isLoading && inputRef.current && !isListening) {
      inputRef.current.focus();
    }
  }, [isLoading, isListening]);

  // Clean up recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (_) {}
      }
    };
  }, []);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (isListening) {
      stopListening();
    }
    const trimmed = input.trim();
    if (!trimmed || isLoading || disabled) return;

    onSendMessage(trimmed);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const startListening = () => {
    const SpeechRecognition = typeof window !== 'undefined' && 
      (window.SpeechRecognition || window.webkitSpeechRecognition);

    if (!SpeechRecognition) {
      setSpeechError("Voice input is not supported in this browser. Please type your message.");
      return;
    }

    setSpeechError(null);

    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (_) {}
      }

      const recognition = new SpeechRecognition();
      const langConfig = LANGUAGE_RECOGNITION_MAP[selectedLang] || LANGUAGE_RECOGNITION_MAP.en;
      recognition.lang = langConfig.code;
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript) {
          setInput(transcript);
        }
      };

      recognition.onerror = (event) => {
        console.warn('[Speech Recognition Error]', event.error);
        if (event.error === 'not-allowed' || event.error === 'permission-denied') {
          setSpeechError("Microphone access was denied. Please allow microphone permissions in your browser settings.");
        } else if (event.error === 'no-speech') {
          setSpeechError("No speech was detected. Please try again.");
        } else if (event.error === 'network') {
          setSpeechError("Speech recognition network error. Please check your internet connection.");
        } else if (event.error !== 'aborted') {
          setSpeechError(`Voice input error: ${event.error}`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('[Speech Recognition Start Error]', err);
      setSpeechError("Could not start microphone. Please check your permissions.");
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (_) {}
    }
    setIsListening(false);
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className="p-3 bg-white border-t border-slate-200">
      {/* Speech Error Banner */}
      {speechError && (
        <div className="mb-2 p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between gap-2 animate-fade-in">
          <div className="flex items-center gap-1.5 min-w-0">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="truncate">{speechError}</span>
          </div>
          <button
            type="button"
            onClick={() => setSpeechError(null)}
            className="p-1 hover:bg-amber-100 rounded text-amber-700 cursor-pointer"
            aria-label="Dismiss error"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Listening Active Banner */}
      {isListening && (
        <div className="mb-2 px-3 py-1.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs flex items-center justify-between gap-2 animate-pulse">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            <span className="font-semibold text-slate-800">
              Listening in {LANGUAGE_RECOGNITION_MAP[selectedLang]?.label || 'English'}...
            </span>
            <span className="text-[11px] text-slate-500 hidden sm:inline">Speak clearly into microphone</span>
          </div>
          <button
            type="button"
            onClick={stopListening}
            className="text-[11px] font-bold text-teal-700 bg-white px-2 py-0.5 rounded-md border border-teal-300 hover:bg-teal-100 cursor-pointer"
          >
            Done Speaking
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-center gap-1.5 sm:gap-2">
        {/* Language selector toggle pill */}
        <div className="relative flex items-center shrink-0">
          <button
            type="button"
            title="Speech Recognition Language: Click to cycle English / हिन्दी / ਪੰਜਾਬੀ"
            onClick={() => {
              const langs = ['en', 'hi', 'pa'];
              const currentIdx = langs.indexOf(selectedLang === 'hinglish' ? 'hi' : selectedLang);
              const next = langs[(currentIdx + 1) % langs.length];
              setSelectedLang(next);
            }}
            className="h-10 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-[11px] font-bold text-slate-700 transition-colors flex items-center gap-1 cursor-pointer select-none"
            aria-label="Toggle voice input language"
          >
            <Globe className="w-3 h-3 text-teal-600" />
            <span>{LANGUAGE_RECOGNITION_MAP[selectedLang]?.short || 'EN'}</span>
          </button>
        </div>

        {/* Input box */}
        <div className="relative flex-1 flex items-center">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading || disabled}
            placeholder={
              selectedLang === 'hi' 
                ? 'अस्पताल, डायलिसिस, या ब्रेन सर्जरी के बारे में पूछें...'
                : selectedLang === 'pa'
                ? 'ਹਸਪਤਾਲ, ਡਾਇਲਿਸਿਸ, ਜਾਂ ਦਿਮਾਗ ਦੇ ਆਪਰੇਸ਼ਨ ਬਾਰੇ ਪੁੱਛੋ...'
                : 'Ask about hospitals, brain surgery, dialysis...'
            }
            className={`w-full text-xs sm:text-sm bg-slate-50 border ${
              isListening ? 'border-teal-500 ring-2 ring-teal-200/50 bg-white' : 'border-slate-300'
            } focus:border-teal-500 focus:bg-white focus:outline-none rounded-xl px-3.5 py-2.5 text-slate-800 placeholder-slate-400 transition-all disabled:opacity-60`}
          />
        </div>

        {/* Voice Input Microphone Button */}
        <button
          type="button"
          onClick={toggleListening}
          disabled={isLoading || disabled}
          title={isListening ? 'Stop listening' : 'Start voice input (Speak in English, Hindi, or Punjabi)'}
          aria-label={isListening ? 'Stop listening' : 'Start voice input'}
          className={`p-2.5 rounded-xl transition-all shrink-0 cursor-pointer shadow-2xs ${
            isListening
              ? 'bg-red-500 hover:bg-red-600 text-white animate-bounce'
              : 'bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-700 border border-slate-300 hover:border-teal-300'
          }`}
        >
          {isListening ? (
            <MicOff className="w-4 h-4 text-white" />
          ) : (
            <Mic className="w-4 h-4 text-teal-700" />
          )}
        </button>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!input.trim() || isLoading || disabled}
          aria-label="Send message"
          className="p-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:bg-slate-200 text-white disabled:text-slate-400 transition-colors shrink-0 shadow-2xs cursor-pointer disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </form>

      <div className="text-[10px] text-slate-400 text-center mt-1.5 leading-tight">
        Sehat_Sathi Assistant · Voice & Multilingual Ready (EN / HI / PA) · Non-diagnostic
      </div>
    </div>
  );
};
