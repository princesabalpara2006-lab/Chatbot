import { useState, useEffect, useRef } from 'react';

export const useVoice = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isMuted, setIsMuted] = useState(true);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Check Speech Recognition capability
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsRecording(true);
        setTranscript('');
      };

      recognition.onerror = (event) => {
        console.error('[Speech Recognition Error]', event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.onresult = (event) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const startRecording = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.warn('[Microphone already capturing]');
      }
    } else {
      alert('Speech-to-text is not supported on this browser. Try Chrome or Safari.');
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const speakText = (text) => {
    if (isMuted) return; // Speech synthesized is toggled off
    
    // Stop any active talk
    window.speechSynthesis.cancel();
    
    // Strip markdown tags from content before reading
    const cleanText = text.replace(/[*#`_\-]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    
    window.speechSynthesis.speak(utterance);
  };

  const cancelSpeaking = () => {
    window.speechSynthesis.cancel();
  };

  const toggleMute = () => {
    const nextMuteState = !isMuted;
    setIsMuted(nextMuteState);
    if (nextMuteState) {
      cancelSpeaking();
    }
  };

  return {
    isRecording,
    transcript,
    isMuted,
    startRecording,
    stopRecording,
    speakText,
    cancelSpeaking,
    toggleMute
  };
};
