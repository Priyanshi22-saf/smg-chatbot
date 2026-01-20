/**
 * Voice Chat Module
 * Handles speech-to-text and text-to-speech functionality
 */

class VoiceChat {
    constructor() {
        this.recognition = null;
        this.synthesis = window.speechSynthesis;
        this.isListening = false;
        this.isSpeaking = false;
        this.speakerEnabled = this.loadSpeakerPreference();
        this.currentUtterance = null;
        
        this.initSpeechRecognition();
    }

    initSpeechRecognition() {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        
        this.recognition.lang = 'en-IN';
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.maxAlternatives = 1;

        this.recognition.onstart = () => {
            this.isListening = true;
            this.onListeningStateChange(true);
        };

        this.recognition.onend = () => {
            this.isListening = false;
            this.onListeningStateChange(false);
        };

        this.recognition.onerror = (event) => {
            this.isListening = false;
            this.onListeningStateChange(false);
            this.handleRecognitionError(event.error);
        };

        this.recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript.trim();
            if (transcript) {
                this.onTranscript(transcript);
            }
        };
    }


    startVoiceInput() {
        if (!this.recognition) {
            this.showError('Speech recognition not supported in this browser.');
            return false;
        }

        if (this.isListening) {
            this.stopVoiceInput();
            return false;
        }

        if (this.isSpeaking) {
            this.showError('Please wait for the bot to finish speaking.');
            return false;
        }

        try {
            this.recognition.start();
            return true;
        } catch (error) {
            if (error.name === 'InvalidStateError') {
                this.recognition.stop();
                setTimeout(() => this.recognition.start(), 100);
            } else {
                this.handleRecognitionError(error.message);
                return false;
            }
        }
    }

    stopVoiceInput() {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
        }
    }

    speakBotResponse(text) {
        if (!this.synthesis) {
            return;
        }

        if (!this.speakerEnabled) {
            return;
        }

        this.stopSpeaking();

        const cleanText = this.cleanTextForSpeech(text);
        if (!cleanText) return;

        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = 'en-IN';
        utterance.rate = 0.95;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        utterance.onstart = () => {
            this.isSpeaking = true;
            this.onSpeakingStateChange(true);
        };

        utterance.onend = () => {
            this.isSpeaking = false;
            this.onSpeakingStateChange(false);
            this.currentUtterance = null;
        };

        utterance.onerror = (event) => {
            console.error('Speech synthesis error:', event.error);
            this.isSpeaking = false;
            this.onSpeakingStateChange(false);
            this.currentUtterance = null;
        };

        this.currentUtterance = utterance;
        this.synthesis.speak(utterance);
    }

    stopSpeaking() {
        if (this.synthesis && this.synthesis.speaking) {
            this.synthesis.cancel();
        }
        this.isSpeaking = false;
        this.currentUtterance = null;
    }

    toggleSpeaker() {
        this.speakerEnabled = !this.speakerEnabled;
        this.saveSpeakerPreference();
        
        if (!this.speakerEnabled && this.isSpeaking) {
            this.stopSpeaking();
        }
        
        return this.speakerEnabled;
    }

    cleanTextForSpeech(text) {
        if (!text) return '';
        return text
            .replace(/<[^>]*>/g, '')
            .replace(/&nbsp;/g, ' ')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/[📧📱👉⚡🚲🎤🧹]/g, '')
            .replace(/\n/g, '. ')
            .replace(/\.{2,}/g, '.')
            .replace(/\s+/g, ' ')
            .trim()
            .substring(0, 500);
    }

    handleRecognitionError(error) {
        let message = 'Speech recognition error.';
        
        switch (error) {
            case 'no-speech':
                message = 'No speech detected. Please try again.';
                break;
            case 'audio-capture':
                message = 'Microphone not found. Please check your microphone.';
                break;
            case 'not-allowed':
                message = 'Microphone permission denied. Please enable microphone access.';
                break;
            case 'network':
                message = 'Network error. Please check your connection.';
                break;
            case 'aborted':
                return;
            default:
                message = `Speech recognition error: ${error}`;
        }
        
        this.showError(message);
    }

    showError(message) {
        if (typeof window.showVoiceError === 'function') {
            window.showVoiceError(message);
        } else {
            console.error('Voice Chat Error:', message);
        }
    }

    onListeningStateChange(isListening) {
        if (typeof window.onVoiceListeningChange === 'function') {
            window.onVoiceListeningChange(isListening);
        }
    }

    onSpeakingStateChange(isSpeaking) {
        if (typeof window.onVoiceSpeakingChange === 'function') {
            window.onVoiceSpeakingChange(isSpeaking);
        }
    }

    onTranscript(transcript) {
        if (typeof window.onVoiceTranscript === 'function') {
            window.onVoiceTranscript(transcript);
        }
    }

    loadSpeakerPreference() {
        try {
            const saved = localStorage.getItem('voiceChat_speakerEnabled');
            return saved !== null ? saved === 'true' : true;
        } catch {
            return true;
        }
    }

    saveSpeakerPreference() {
        try {
            localStorage.setItem('voiceChat_speakerEnabled', this.speakerEnabled.toString());
        } catch {
            // Ignore storage errors
        }
    }

    isSupported() {
        return {
            recognition: !!(window.SpeechRecognition || window.webkitSpeechRecognition),
            synthesis: !!window.speechSynthesis
        };
    }
}

// Initialize voice chat when DOM is ready
let voiceChat = null;

function initVoiceChat() {
    if (voiceChat) return;
    try {
        voiceChat = new VoiceChat();
        
        // Expose functions
        window.startVoiceInput = () => voiceChat.startVoiceInput();
        window.stopVoiceInput = () => voiceChat.stopVoiceInput();
        window.speakBotResponse = (text) => voiceChat.speakBotResponse(text);
        window.toggleSpeaker = () => voiceChat.toggleSpeaker();
        window.isVoiceSupported = () => voiceChat.isSupported();
        
        console.log('Voice chat initialized');
    } catch (error) {
        console.error('Failed to initialize voice chat:', error);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initVoiceChat);
} else {
    initVoiceChat();
}

