import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  X, 
  Minus, 
  RotateCcw, 
  AlertCircle, 
  Loader2,
  Maximize2
} from 'lucide-react';
import { ChatbotButton } from './ChatbotButton';
import { ChatMessage, stripMarkdownForSpeech, getBestVoiceForLanguage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { SuggestedQuestions } from './SuggestedQuestions';
import { chatbotService } from '../../services/chatbotService';

export const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [context, setContext] = useState({});
  const [activeSpeakingId, setActiveSpeakingId] = useState(null);

  // Initial welcome message
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      text: "👋 **Hello! I'm your Sehat_Sathi Assistant.**\n\nI can help you find specialized hospitals (like kidney, cardiac, cancer, or neurosurgery centres), explore facilities near you, compare healthcare options, and answer general educational health questions in **English**, **हिन्दी**, or **ਪੰਜਾਬੀ**.\n\n*How can I assist you today?*",
      hospitals: [],
      language: 'en',
      timestamp: formatTime(new Date())
    }
  ]);

  const messagesEndRef = useRef(null);

  // Stop any active text-to-speech audio
  const stopSpeech = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (_) {}
    }
    setActiveSpeakingId(null);
  };

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen, isMinimized]);

  // Toggle voice output for a specific assistant message
  const handleToggleSpeak = (msg) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    if (activeSpeakingId === msg.id) {
      stopSpeech();
      return;
    }

    stopSpeech();
    setActiveSpeakingId(msg.id);

    const cleanText = stripMarkdownForSpeech(msg.text);
    if (!cleanText) {
      setActiveSpeakingId(null);
      return;
    }

    try {
      const utterance = new SpeechSynthesisUtterance(cleanText);
      const { voice, langCode } = getBestVoiceForLanguage(msg.language || 'en');
      if (voice) {
        utterance.voice = voice;
      }
      utterance.lang = langCode;
      utterance.rate = 0.95;

      utterance.onend = () => {
        setActiveSpeakingId(null);
      };

      utterance.onerror = (e) => {
        console.warn('[SpeechSynthesis Error]', e);
        setActiveSpeakingId(null);
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('[SpeechSynthesis Speak Error]', err);
      setActiveSpeakingId(null);
    }
  };

  // Handle sending a new user message
  const handleSendMessage = async (text) => {
    if (!text || isLoading) return;

    // Stop previous voice output when a new message is sent
    stopSpeech();
    setError(null);

    const userMsgId = 'user_' + Date.now();
    const userMessage = {
      id: userMsgId,
      role: 'user',
      text: text,
      timestamp: formatTime(new Date())
    };

    // Append user message immediately
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Process through chatbotService maintaining conversation context
      const response = await chatbotService.processMessage(text, context);

      // Update conversational context
      if (response.context) {
        setContext(response.context);
      }

      const assistantMsgId = 'assistant_' + Date.now();
      const assistantMessage = {
        id: assistantMsgId,
        role: 'assistant',
        text: response.message,
        hospitals: response.hospitals || [],
        isEmergency: !!response.isEmergency,
        disclaimer: response.disclaimer,
        language: response.language || 'en',
        timestamp: formatTime(new Date())
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('[CHATBOT ERROR]', err);
      setError("Sorry, I couldn't process that request. Please try again.");
      setMessages(prev => [
        ...prev,
        {
          id: 'error_' + Date.now(),
          role: 'assistant',
          text: "Sorry, I couldn't process that request. Please try again.",
          hospitals: [],
          language: 'en',
          timestamp: formatTime(new Date())
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset conversation to fresh state
  const handleResetChat = () => {
    stopSpeech();
    setContext({});
    setError(null);
    setMessages([
      {
        id: 'welcome_' + Date.now(),
        role: 'assistant',
        text: "Conversation cleared. How can I help you with hospital discovery or health information?",
        hospitals: [],
        language: 'en',
        timestamp: formatTime(new Date())
      }
    ]);
  };

  const handleClose = () => {
    stopSpeech();
    setIsOpen(false);
  };

  const handleMinimizeToggle = () => {
    stopSpeech();
    setIsMinimized(prev => !prev);
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <ChatbotButton
        onClick={() => {
          setIsOpen(true);
          setIsMinimized(false);
        }}
        isOpen={isOpen && !isMinimized}
      />

      {/* Chatbot Window Container */}
      {isOpen && (
        <div
          className={`fixed bottom-6 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] transition-all duration-300 ease-in-out flex flex-col bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden ${
            isMinimized ? 'h-14' : 'h-[580px] max-h-[85vh]'
          }`}
          role="dialog"
          aria-label="Sehat_Sathi Assistant"
        >
          {/* Header Bar */}
          <div className="bg-navy-900 text-white px-4 py-3 flex items-center justify-between shrink-0 select-none border-b border-slate-700">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5 leading-none">
                  <span>Sehat_Sathi Assistant</span>
                  <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                </h3>
                <p className="text-[10px] text-slate-300 mt-1 leading-none">
                  Healthcare & Discovery Guide · Multilingual & Voice
                </p>
              </div>
            </div>

            {/* Header Controls */}
            <div className="flex items-center gap-1 text-slate-300">
              {!isMinimized && (
                <button
                  onClick={handleResetChat}
                  title="Clear Conversation"
                  aria-label="Clear chat"
                  className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                onClick={handleMinimizeToggle}
                title={isMinimized ? "Expand" : "Minimize"}
                aria-label={isMinimized ? "Expand chat" : "Minimize chat"}
                className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
              >
                {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={handleClose}
                title="Close Assistant"
                aria-label="Close assistant"
                className="p-1.5 rounded-lg hover:bg-red-500 hover:text-white transition-colors cursor-pointer ml-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Window Body (Hidden when Minimized) */}
          {!isMinimized && (
            <>
              {/* Message History Scroll Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/70">
                {messages.map(msg => (
                  <ChatMessage 
                    key={msg.id} 
                    message={msg} 
                    isSpeaking={activeSpeakingId === msg.id}
                    onToggleSpeak={handleToggleSpeak}
                  />
                ))}

                {/* Loading Typing Indicator */}
                {isLoading && (
                  <div className="flex items-center gap-2 text-slate-500 text-xs pl-2 py-1 animate-pulse">
                    <div className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center shrink-0">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                    <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 flex items-center gap-1.5 shadow-2xs">
                      <span className="w-1.5 h-1.5 bg-teal-600 rounded-full animate-bounce" />
                      <span className="w-1.5 h-1.5 bg-teal-600 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 bg-teal-600 rounded-full animate-bounce [animation-delay:0.4s]" />
                      <span className="text-[11px] text-slate-500 ml-1">Searching Sehat_Sathi...</span>
                    </div>
                  </div>
                )}

                {/* Error Banner */}
                {error && (
                  <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                    <span>{error}</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Suggested Questions (only when message count is low) */}
              {messages.length <= 2 && (
                <SuggestedQuestions
                  onSelectQuestion={handleSendMessage}
                  disabled={isLoading}
                />
              )}

              {/* Chat Input */}
              <ChatInput
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
                activeLanguage={context.language || 'en'}
              />
            </>
          )}
        </div>
      )}
    </>
  );
};

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
