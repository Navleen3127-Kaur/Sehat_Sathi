import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bot, User, Building2, ExternalLink, AlertTriangle, Volume2, Square } from 'lucide-react';

export const ChatMessage = ({ message, isSpeaking = false, onToggleSpeak }) => {
  const isUser = message.role === 'user';
  const [localSpeaking, setLocalSpeaking] = useState(false);
  const isCurrentlySpeaking = onToggleSpeak ? isSpeaking : localSpeaking;

  // Cleanup local TTS on unmount
  useEffect(() => {
    return () => {
      if (localSpeaking && typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [localSpeaking]);

  const handleSpeakClick = () => {
    if (onToggleSpeak) {
      onToggleSpeak(message);
    } else {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
      if (localSpeaking) {
        window.speechSynthesis.cancel();
        setLocalSpeaking(false);
      } else {
        window.speechSynthesis.cancel();
        const text = stripMarkdownForSpeech(message.text);
        const utterance = new SpeechSynthesisUtterance(text);
        const { voice, langCode } = getBestVoiceForLanguage(message.language || 'en');
        if (voice) utterance.voice = voice;
        utterance.lang = langCode;
        utterance.onend = () => setLocalSpeaking(false);
        utterance.onerror = () => setLocalSpeaking(false);
        setLocalSpeaking(true);
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  // Simple Markdown Line Formatter for text
  const renderFormattedText = (text = '') => {
    if (!text) return null;
    const lines = text.split('\n');

    return (
      <div className="space-y-1.5 text-xs sm:text-sm leading-relaxed">
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          if (!trimmed) {
            return <div key={idx} className="h-1" />;
          }

          // Header 3: ### Header
          if (trimmed.startsWith('### ')) {
            return (
              <h4 key={idx} className="font-bold text-sm sm:text-base text-navy-900 mt-2 mb-1">
                {trimmed.replace('### ', '')}
              </h4>
            );
          }

          // Bullet points: • or -
          if (trimmed.startsWith('• ') || trimmed.startsWith('- ')) {
            const content = trimmed.substring(2);
            return (
              <div key={idx} className="flex items-start gap-1.5 pl-1">
                <span className="text-teal-600 font-bold select-none">•</span>
                <span dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(content) }} />
              </div>
            );
          }

          // Numbered items: 1. 2.
          const numberedMatch = trimmed.match(/^([0-9]+)\.\s*(.*)$/);
          if (numberedMatch) {
            return (
              <div key={idx} className="flex items-start gap-1.5 pl-1 font-semibold text-slate-800 mt-1">
                <span className="text-teal-700 select-none">{numberedMatch[1]}.</span>
                <span dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(numberedMatch[2]) }} />
              </div>
            );
          }

          // Italic disclaimer/note lines
          if (trimmed.startsWith('*') && trimmed.endsWith('*')) {
            const raw = trimmed.slice(1, -1);
            return (
              <p key={idx} className="text-[11px] text-slate-500 italic mt-1 leading-normal">
                {raw}
              </p>
            );
          }

          // Standard paragraph
          return (
            <p key={idx} dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(trimmed) }} />
          );
        })}
      </div>
    );
  };

  return (
    <div className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}>
      {/* Bot Avatar */}
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
          <Bot className="w-4 h-4" />
        </div>
      )}

      {/* Message Bubble Container */}
      <div className="max-w-[85%] sm:max-w-[80%] space-y-2">
        {/* Main Content Bubble */}
        <div
          className={`rounded-2xl px-3.5 py-2.5 shadow-2xs ${
            isUser
              ? 'bg-teal-600 text-white rounded-tr-xs'
              : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-xs'
          }`}
        >
          {/* Emergency Alert Banner */}
          {message.isEmergency && (
            <div className="mb-2 p-2 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2 text-red-800">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span className="text-xs font-semibold">Immediate Emergency Protocol</span>
            </div>
          )}

          {/* Formatted Text Content */}
          {isUser ? (
            <p className="text-xs sm:text-sm whitespace-pre-wrap">{message.text}</p>
          ) : (
            renderFormattedText(message.text)
          )}
        </div>

        {/* Hospital Mini Cards (if any attached to recommendation) */}
        {!isUser && message.hospitals && message.hospitals.length > 0 && (
          <div className="space-y-1.5 pt-1">
            <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
              <Building2 className="w-3 h-3 text-teal-600" />
              <span>Recommended Hospitals in Sehat_Sathi</span>
            </div>

            <div className="grid grid-cols-1 gap-1.5">
              {message.hospitals.map((h, idx) => {
                const rank = h.referenceRank || idx + 1;
                const linkId = h.id;

                return (
                  <div
                    key={h.id || idx}
                    className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-teal-400 transition-colors shadow-2xs flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {h.isNationalReference && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                            ⭐ Rank #{rank}
                          </span>
                        )}
                        <h5 className="font-bold text-xs sm:text-sm text-navy-900 truncate">
                          {h.name}
                        </h5>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {h.city || h.location?.city} {h.state ? `• ${h.state}` : ''}
                        {h.distance != null ? ` • ~${h.distance} km` : ''}
                      </p>
                    </div>

                    <Link
                      to={`/hospitals/${linkId}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-semibold border border-teal-200 shrink-0 transition-colors"
                    >
                      <span>View</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer: Voice Output (TTS) & Timestamp */}
        <div className={`flex items-center gap-2 ${isUser ? 'justify-end' : 'justify-start'} px-1`}>
          {!isUser && (
            <button
              type="button"
              onClick={handleSpeakClick}
              title={isCurrentlySpeaking ? "Stop listening to message" : "Listen to response (Voice output)"}
              aria-label={isCurrentlySpeaking ? "Stop speech" : "Read message aloud"}
              className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                isCurrentlySpeaking 
                  ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 animate-pulse'
                  : 'text-slate-500 hover:text-teal-700 hover:bg-slate-100'
              }`}
            >
              {isCurrentlySpeaking ? (
                <>
                  <Square className="w-3 h-3 fill-current text-red-600" />
                  <span>Stop</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-teal-600" />
                  <span>Listen</span>
                </>
              )}
            </button>
          )}

          {message.timestamp && (
            <span className="text-[10px] text-slate-400">
              {message.timestamp}
            </span>
          )}
        </div>
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
          <User className="w-4 h-4" />
        </div>
      )}
    </div>
  );
};

// Clean up markdown text for natural, pleasant speech
export function stripMarkdownForSpeech(text = '') {
  if (!text) return '';

  return text
    // Remove headers: ### Title -> Title
    .replace(/^#{1,6}\s+/gm, '')
    // Remove bold and italic markers: **bold** or *italic*
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    // Remove inline code
    .replace(/`([^`]+)`/g, '$1')
    // Remove markdown links [text](url) -> text
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
    // Remove markdown table divider bars and dashes: | --- |
    .replace(/\|[\s-:]+\|/g, ' ')
    // Replace table cell pipes with commas
    .replace(/\|/g, ', ')
    // Remove bullet points / dashes at start of line
    .replace(/^[\s•\-\*]+\s*/gm, '')
    // Remove numbered lists markers like "1. "
    .replace(/^\d+\.\s*/gm, '')
    // Remove common emojis
    .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2B00}-\u{2BFF}]|\p{Extended_Pictographic}/gu, '')
    // Remove raw URLs
    .replace(/https?:\/\/\S+/g, '')
    // Collapse excess spaces and newlines
    .replace(/\n+/g, '. ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

// Select best matched voice from browser speech synthesis
export function getBestVoiceForLanguage(lang = 'en') {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return { voice: null, langCode: 'en-IN' };
  }

  const voices = window.speechSynthesis.getVoices() || [];
  let voice = null;
  let langCode = 'en-IN';

  if (lang === 'hi') {
    langCode = 'hi-IN';
    voice = voices.find(v => v.lang === 'hi-IN' || v.lang.startsWith('hi') || /hindi/i.test(v.name));
    if (!voice) voice = voices.find(v => v.lang === 'en-IN' || /india/i.test(v.name));
  } else if (lang === 'pa') {
    langCode = 'pa-IN';
    voice = voices.find(v => v.lang === 'pa-IN' || v.lang.startsWith('pa') || /punjabi/i.test(v.name));
    if (!voice) voice = voices.find(v => v.lang === 'hi-IN' || v.lang.startsWith('hi') || /hindi/i.test(v.name));
    if (!voice) voice = voices.find(v => v.lang === 'en-IN' || /india/i.test(v.name));
  } else if (lang === 'hinglish') {
    langCode = 'hi-IN';
    voice = voices.find(v => v.lang === 'hi-IN' || /hindi/i.test(v.name));
    if (!voice) voice = voices.find(v => v.lang === 'en-IN' || /india/i.test(v.name));
  } else {
    langCode = 'en-IN';
    voice = voices.find(v => v.lang === 'en-IN' || /india/i.test(v.name));
    if (!voice) voice = voices.find(v => v.lang.startsWith('en'));
  }

  return { voice, langCode };
}

// Helper to format bold, italic, code safely in html
function formatInlineMarkdown(str = '') {
  let res = str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Bold: **text**
  res = res.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  // Italic: *text*
  res = res.replace(/\*(.*?)\*/g, '<em>$1</em>');
  // Inline code: `text`
  res = res.replace(/`([^`]+)`/g, '<code class="bg-slate-100 px-1 rounded text-teal-800 text-xs">$1</code>');

  return res;
}
