import React, { useState, useEffect } from 'react';
import { Search, Mic, Sparkles, ArrowRight, CornerDownLeft, Volume2, Globe, AlertCircle, X } from 'lucide-react';
import { voiceSearchService } from '../../services/voiceSearchService';
import { useToast } from '../../context/ToastContext';

export const AiSearchBar = ({ 
  onSearch, 
  initialValue = '', 
  placeholder = "Describe your healthcare need in English, हिन्दी, or ਪੰਜਾਬੀ...",
  isCompact = false 
}) => {
  const [query, setQuery] = useState(initialValue);
  const [isListening, setIsListening] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState('idle'); // 'idle' | 'listening' | 'processing' | 'error'
  const [voiceMessage, setVoiceMessage] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('auto');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      voiceSearchService.stopListening();
      setIsListening(false);
      setVoiceStatus('idle');
      onSearch(query.trim());
    }
  };

  const handleToggleVoice = () => {
    if (isListening) {
      voiceSearchService.stopListening();
      setIsListening(false);
      setVoiceStatus('idle');
      setVoiceMessage('');
      return;
    }

    // Check browser speech support
    if (!voiceSearchService.isSupported()) {
      const msg = "Voice search isn't supported in this browser. Please type your search.";
      addToast(msg, 'warning');
      setVoiceStatus('error');
      setVoiceMessage(msg);
      return;
    }

    setVoiceStatus('listening');
    setVoiceMessage("Listening... Speak your healthcare requirement in English, हिन्दी, or ਪੰਜਾਬੀ");
    setIsListening(true);

    voiceSearchService.startListening({
      lang: selectedLanguage,
      onStart: () => {
        setIsListening(true);
        setVoiceStatus('listening');
        setVoiceMessage("Listening... Speak your healthcare requirement");
      },
      onResult: (transcript, isFinal) => {
        // Keep original spoken speech text visible in search bar
        setQuery(transcript);
        if (isFinal) {
          setVoiceStatus('processing');
          setVoiceMessage("Processing...");
        }
      },
      onError: (friendlyError, errCode) => {
        setIsListening(false);
        setVoiceStatus('error');
        setVoiceMessage(friendlyError);
        addToast(friendlyError, 'error');
      },
      onEnd: (finalTranscript) => {
        setIsListening(false);
        setVoiceStatus('idle');
        setVoiceMessage('');

        if (finalTranscript && finalTranscript.trim()) {
          setQuery(finalTranscript.trim());
          addToast(`Recognized: "${finalTranscript.trim()}"`, 'success');
          // Automatically execute search through existing AI pipeline
          onSearch(finalTranscript.trim());
        }
      }
    });
  };


  return (
    <div className="w-full max-w-4xl mx-auto space-y-3">
      {/* Search Input Box */}
      <form onSubmit={handleSubmit} className="relative">
        <div className={`relative flex items-center bg-white rounded-2xl border-2 transition-all shadow-card ${
          isListening 
            ? 'border-rose-500 ring-4 ring-rose-100 shadow-rose-100' 
            : 'border-teal-500/80 hover:border-teal-600 focus-within:border-teal-600 focus-within:ring-4 focus-within:ring-teal-100'
        }`}>
          
          {/* Sparkles / Search Icon */}
          <div className="pl-4 sm:pl-5 text-teal-600 flex items-center gap-1.5 shrink-0">
            {isListening ? (
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-600"></span>
              </span>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-teal-600 hidden sm:block" />
                <Search className="w-5 h-5 text-slate-400 sm:hidden" />
              </>
            )}
          </div>

          {/* Text Input */}
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={isListening ? "Listening... Speak naturally now" : placeholder}
            className="w-full py-4 sm:py-5 pl-3 pr-36 sm:pr-48 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 bg-transparent focus:outline-none"
            aria-label="Natural language hospital search"
          />

          {/* Right Action Icons: Language Selector + Voice Mic + Search Button */}
          <div className="absolute right-2 sm:right-3 flex items-center gap-1 sm:gap-2">
            
            {/* Optional Language Pill */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="hidden sm:inline-flex items-center gap-1 px-2 py-1.5 rounded-lg border border-slate-200 hover:border-teal-300 text-[11px] font-semibold text-slate-600 hover:text-teal-800 bg-slate-50 hover:bg-teal-50/50 transition-colors"
                title="Select Voice Language"
              >
                <Globe className="w-3 h-3 text-teal-600" />
                <span>
                  {selectedLanguage === 'auto' ? 'Auto' : selectedLanguage === 'hi-IN' ? 'हिन्दी' : selectedLanguage === 'pa-IN' ? 'ਪੰਜਾਬੀ' : 'EN'}
                </span>
              </button>

              {/* Language Dropdown Menu */}
              {showLangMenu && (
                <div className="absolute right-0 top-full mt-1.5 w-40 bg-white rounded-xl shadow-elevated border border-slate-200 p-1.5 z-50 animate-fade-in text-xs space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold px-2 py-1 block uppercase">
                    Voice Language
                  </span>
                  {voiceSearchService.getLanguageOptions().map(opt => (
                    <button
                      key={opt.code}
                      type="button"
                      onClick={() => {
                        setSelectedLanguage(opt.code);
                        setShowLangMenu(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors flex items-center justify-between ${
                        selectedLanguage === opt.code
                          ? 'bg-teal-50 text-teal-800 font-bold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {selectedLanguage === opt.code && <span className="text-teal-600 text-[10px]">&bull;</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Voice Mic Button (Elderly-friendly, high contrast) */}
            <button
              type="button"
              onClick={handleToggleVoice}
              title={isListening ? "Listening... Click to stop" : "Voice Search (Click to speak)"}
              className={`p-2.5 sm:p-3 rounded-xl transition-all cursor-pointer flex items-center justify-center ${
                isListening
                  ? 'bg-rose-600 text-white shadow-md animate-pulse scale-105'
                  : 'text-teal-700 bg-teal-50 hover:bg-teal-100 hover:text-teal-800 border border-teal-200/80'
              }`}
              aria-label={isListening ? "Stop listening" : "Voice search"}
            >
              <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* AI Search CTA Button */}
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs sm:text-sm font-semibold transition-all shadow-sm hover:shadow cursor-pointer"
            >
              <span className="hidden sm:inline">AI Search</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>

      {/* Live Voice Status Notice (Elderly-friendly feedback) */}
      {isListening && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs sm:text-sm flex items-center justify-between gap-3 animate-fade-in shadow-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping"></span>
            <span className="font-semibold">{voiceMessage || "Listening... Speak naturally"}</span>
          </div>
          <button
            type="button"
            onClick={handleToggleVoice}
            className="text-xs font-bold text-rose-700 hover:text-rose-900 underline cursor-pointer"
          >
            Done speaking
          </button>
        </div>
      )}

      {/* Error / Notice Display */}
      {voiceStatus === 'error' && voiceMessage && (
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between gap-2 animate-fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{voiceMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => { setVoiceStatus('idle'); setVoiceMessage(''); }}
            className="text-amber-700 hover:text-amber-900"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Multilingual Voice Helper Prompt */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500 pt-0.5">
        <span className="flex items-center gap-1.5 text-slate-600">
          <Volume2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
          <span>Tap the microphone to speak in <strong>English</strong>, <strong>हिन्दी</strong>, or <strong>ਪੰਜਾਬੀ</strong>.</span>
        </span>
        <span className="text-[11px] text-slate-400">
          Your voice is used solely to understand your healthcare search.
        </span>
      </div>

    </div>
  );
};
