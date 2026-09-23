/**
 * Sehat_Sathi - Voice Search Service
 * 
 * Provides browser-compatible Speech-to-Text abstraction using the Web Speech API.
 * 
 * CORE PRINCIPLE:
 * This service ONLY converts speech to text.
 * It does NOT extract intent, filter hospitals, or alter search parameters.
 * The recognized natural-language text is fed directly into the existing AI Search pipeline.
 */

const LANGUAGE_CONFIGS = [
  { code: 'auto', langCode: 'hi-IN', label: 'Auto (मल्टीलिंगुअल)' },
  { code: 'hi-IN', langCode: 'hi-IN', label: 'हिन्दी (Hindi)' },
  { code: 'pa-IN', langCode: 'pa-Guru-IN', label: 'ਪੰਜਾਬੀ (Punjabi)' },
  { code: 'en-IN', langCode: 'en-IN', label: 'English (India)' }
];

export const voiceSearchService = {
  activeRecognition: null,

  /**
   * Check if speech recognition is available in the current browser environment.
   */
  isSupported() {
    if (typeof window === 'undefined') return false;
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  },

  /**
   * Get available language options for voice recognition.
   */
  getLanguageOptions() {
    return LANGUAGE_CONFIGS;
  },

  /**
   * Start microphone listening.
   * 
   * @param {Object} options
   * @param {string} [options.lang='auto'] - Language selection ('auto', 'hi-IN', 'pa-IN', 'en-IN')
   * @param {Function} options.onStart - Callback when microphone starts listening
   * @param {Function} options.onResult - Callback with (recognizedText, isFinal)
   * @param {Function} options.onError - Callback with (friendlyMessage, errorCode)
   * @param {Function} options.onEnd - Callback when recognition session terminates
   */
  startListening({
    lang = 'auto',
    onStart = () => {},
    onResult = () => {},
    onError = () => {},
    onEnd = () => {}
  } = {}) {
    if (!this.isSupported()) {
      onError("Voice search isn't supported in this browser. Please type your search.", "UNSUPPORTED");
      return null;
    }

    // Stop any existing active session
    this.stopListening();

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      // Resolve BCP-47 language tag
      const matched = LANGUAGE_CONFIGS.find(l => l.code === lang) || LANGUAGE_CONFIGS[0];
      recognition.lang = matched.langCode;

      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      let recognizedFinalText = '';
      let hasReceivedResult = false;

      recognition.onstart = () => {
        onStart();
      };

      recognition.onresult = (event) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            recognizedFinalText += transcript;
            hasReceivedResult = true;
          } else {
            interimTranscript += transcript;
          }
        }

        const currentText = recognizedFinalText || interimTranscript;
        if (currentText.trim()) {
          onResult(currentText.trim(), hasReceivedResult);
        }
      };

      recognition.onerror = (event) => {
        const errCode = event.error;
        let friendlyMessage = "Sorry, we couldn't understand that. Please try again or type your search.";

        switch (errCode) {
          case 'not-allowed':
          case 'service-not-allowed':
            friendlyMessage = "Microphone permission is required for voice search. You can type your search instead.";
            break;
          case 'no-speech':
            friendlyMessage = "No speech detected. Please try again or tap the microphone to speak.";
            break;
          case 'audio-capture':
            friendlyMessage = "No microphone was found. Please ensure a microphone is connected.";
            break;
          case 'network':
            friendlyMessage = "Network connection required for voice recognition. Please try again or type your search.";
            break;
          case 'aborted':
            // Aborted intentionally by user; don't report as an error
            return;
          default:
            friendlyMessage = "Sorry, we couldn't understand that. Please try again or type your search.";
            break;
        }

        onError(friendlyMessage, errCode);
      };

      recognition.onend = () => {
        this.activeRecognition = null;
        onEnd(recognizedFinalText.trim());
      };

      this.activeRecognition = recognition;
      recognition.start();
      return recognition;
    } catch (err) {
      onError("Microphone error. Please try again or type your search.", "EXCEPTION");
      return null;
    }
  },

  /**
   * Stop active speech recognition.
   */
  stopListening() {
    if (this.activeRecognition) {
      try {
        this.activeRecognition.stop();
      } catch {
        // Ignore errors during stop
      }
      this.activeRecognition = null;
    }
  },

  /**
   * Quick voice simulation samples for elderly-friendly accessibility and desktop demo environments.
   */
  getSamplePhrases() {
    return [
      { lang: 'English', text: "Find a heart hospital under one lakh" },
      { lang: 'Hindi', text: "मुझे एक लाख के अंदर दिल का अस्पताल चाहिए" },
      { lang: 'Punjabi', text: "ਮੈਨੂੰ ਇੱਕ ਲੱਖ ਦੇ ਅੰਦਰ ਦਿਲ ਦਾ ਹਸਪਤਾਲ ਚਾਹੀਦਾ ਹੈ" },
      { lang: 'Hinglish', text: "Mujhe ek lakh ke andar heart ka hospital chahiye" },
      { lang: 'Dialysis (Punjabi)', text: "ਮੈਨੂੰ ਡਾਇਲਿਸਿਸ ਵਾਲਾ ਕਿਡਨੀ ਹਸਪਤਾਲ ਚਾਹੀਦਾ ਹੈ" },
      { lang: 'Chandigarh (Hindi)', text: "चंडीगढ़ में 2 लाख के अंदर दिल का अस्पताल" }
    ];
  }
};
