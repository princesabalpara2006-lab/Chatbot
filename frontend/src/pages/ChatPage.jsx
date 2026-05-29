import React, { useContext, useState, useEffect, useRef } from 'react';
import { ChatContext } from '../context/ChatContext';
import { AuthContext } from '../context/AuthContext';
import { useVoice } from '../hooks/useVoice';
import API from '../services/api';
import { 
  Send, Mic, Paperclip, Plus, Copy, Volume2, VolumeX, FileUp, X, Cpu
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ChatPage = () => {
  const { user } = useContext(AuthContext);
  const { 
    chats, currentChat, messages, chatLoading, typingState, suggestedReplies,
    setCurrentChat, createNewChat, emitSendMessage, emitTyping, reactToMessage
  } = useContext(ChatContext);

  const { 
    isRecording, transcript, isMuted, startRecording, stopRecording, speakText, toggleMute 
  } = useVoice();

  const [inputText, setInputText] = useState('');
  const [attachedFile, setAttachedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const scrollAnchorRef = useRef(null);
  const fileInputRef = useRef(null);

  // Silently auto-select or auto-create chat sandbox
  useEffect(() => {
    if (!currentChat && chats.length > 0) {
      setCurrentChat(chats[0]);
    } else if (!currentChat && !chatLoading && chats.length === 0) {
      createNewChat('Aether Sandbox', 'friendly');
    }
  }, [chats, currentChat, chatLoading]);

  // Handle SpeechSynthesis readout on new AI messages
  useEffect(() => {
    if (messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.sender === 'ai' && !isMuted) {
        speakText(lastMsg.content);
      }
    }
    scrollAnchorRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isMuted]);

  // Sync vocal transcript
  useEffect(() => {
    if (transcript) {
      setInputText((prev) => prev + ' ' + transcript);
    }
  }, [transcript]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim() && !attachedFile) return;

    emitSendMessage(inputText, attachedFile);
    setInputText('');
    setAttachedFile(null);
    emitTyping(false);
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
    emitTyping(e.target.value.length > 0);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) uploadFileToServer(file);
  };

  const uploadFileToServer = async (file) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await API.post('/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        setAttachedFile({
          name: res.data.file.fileName,
          url: res.data.file.filePath,
          fileType: res.data.file.fileType
        });
      }
    } catch (err) {
      alert('File upload failed. Max 10MB.');
    }
    setUploading(false);
  };

  const handleCopyText = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Modern structured markdown lists parser
  const renderMessageContent = (content) => {
    // Render standard lists cleanly
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      
      // Code blocks
      if (trimmed.startsWith('```')) {
        return null; // Simplified code-block rendering bypass
      }

      // Check for bullet list item: - Item or * Item
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        const itemText = trimmed.substring(2);
        return (
          <li key={idx} className="ml-6 list-disc text-sm text-gray-200 leading-relaxed my-1">
            {itemText}
          </li>
        );
      }

      // Check for numbered list: 1. Item
      if (/^\d+\.\s/.test(trimmed)) {
        const itemText = trimmed.replace(/^\d+\.\s/, '');
        return (
          <li key={idx} className="ml-6 list-decimal text-sm text-gray-200 leading-relaxed my-1">
            {itemText}
          </li>
        );
      }

      // Default paragraph
      return trimmed ? (
        <p key={idx} className="text-[15px] leading-relaxed text-gray-200 my-2">
          {trimmed}
        </p>
      ) : (
        <div key={idx} className="h-2"></div>
      );
    });
  };

  return (
    <div className="h-screen w-full flex flex-col justify-between bg-[#0d0d0d] text-white overflow-hidden relative">
      
      {/* 1. TOP HEADER (Extremely minimal) */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-white/5 bg-[#0d0d0d]/80 backdrop-blur-md z-10 shrink-0">
        <div className="flex items-center space-x-2.5">
          <span className="text-lg font-bold tracking-tight text-white flex items-center space-x-1.5">
            <span>AetherTalk AI</span>
          </span>
        </div>

        <button
          onClick={toggleMute}
          className={`p-2 rounded-lg hover:bg-white/5 transition-all text-gray-400 hover:text-white ${!isMuted ? 'text-emerald-400' : ''}`}
          title={isMuted ? "Unmute readouts" : "Mute readouts"}
        >
          {isMuted ? <VolumeX className="w-4.5 h-4.5" /> : <Volume2 className="w-4.5 h-4.5 animate-pulse" />}
        </button>
      </header>

      {/* 2. CHAT STREAM VIEWPORT */}
      <div className="flex-grow overflow-y-auto px-6 py-8 space-y-8 custom-scrollbar">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 max-w-md mx-auto">
            <span className="text-3xl">🌌</span>
            <h2 className="text-lg font-bold text-gray-200">How can I help you today?</h2>
            <p className="text-xs text-gray-500">Ask coding, structural, math, or creative writing questions.</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isAI = msg.sender === 'ai';
            return (
              <div
                key={msg._id}
                className={`flex flex-col space-y-1.5 max-w-2xl mx-auto group ${isAI ? 'items-start' : 'items-end'}`}
              >
                {/* Sender Title */}
                <span className="text-[10px] uppercase tracking-wider font-bold text-gray-500 px-1">
                  {isAI ? 'Aether AI' : 'You'}
                </span>

                {/* Message Body */}
                <div className={`w-full text-left rounded-2xl ${isAI ? '' : 'bg-white/5 px-4 py-3 border border-white/5'}`}>
                  {msg.fileAttachment && (
                    <div className="p-2 mb-2 rounded-xl bg-white/5 flex items-center justify-between text-[11px] text-gray-400 font-bold border border-white/5">
                      <span>📄 {msg.fileAttachment.name}</span>
                    </div>
                  )}
                  
                  <div className="space-y-1">
                    {isAI ? renderMessageContent(msg.content) : (
                      <p className="text-[15px] leading-relaxed text-white">{msg.content}</p>
                    )}
                  </div>

                  {/* Copy helper */}
                  {isAI && (
                    <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-3">
                      <button
                        onClick={() => handleCopyText(msg._id, msg.content)}
                        className="text-[10px] text-gray-500 hover:text-white flex items-center space-x-1"
                      >
                        <Copy className="w-3 h-3" />
                        <span>{copiedId === msg._id ? 'Copied!' : 'Copy'}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}

        {/* AI Typing loading state */}
        {typingState.isTyping && typingState.username === 'AetherAI' && (
          <div className="max-w-2xl mx-auto flex flex-col space-y-1.5 items-start">
            <span className="text-[10px] uppercase tracking-wider font-bold text-gray-500 px-1">Aether AI</span>
            <div className="flex space-x-1 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
          </div>
        )}

        <div ref={scrollAnchorRef} />
      </div>

      {/* 3. ULTRA-MINIMAL FLOATING INPUT PILL */}
      <footer className="p-6 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d]/95 to-transparent shrink-0">
        
        {/* Suggested Quick replies */}
        {suggestedReplies.length > 0 && messages.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 pb-4 max-w-xl mx-auto">
            {suggestedReplies.map((pill) => (
              <button
                key={pill}
                onClick={() => setInputText(pill)}
                className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-xs text-gray-300 border border-white/5 transition-all cursor-pointer"
              >
                {pill}
              </button>
            ))}
          </div>
        )}

        {/* File previews inside pill */}
        {attachedFile && (
          <div className="mb-3 p-2 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs max-w-xs mx-auto">
            <span className="truncate pr-4 text-gray-300">📄 {attachedFile.name}</span>
            <button onClick={() => setAttachedFile(null)} className="text-gray-500 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Floating pill structure */}
        <div className="max-w-2xl mx-auto relative flex flex-col items-center">
          
          <form onSubmit={handleSendMessage} className="w-full flex items-center bg-[#1a1a1a] rounded-full px-5 py-3 h-14 border border-white/5 shadow-2xl relative">
            
            {/* Attachment trigger */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 hover:bg-white/5 text-gray-400 hover:text-white rounded-full transition-colors shrink-0"
              title="Add attachment"
            >
              <Plus className="w-5 h-5" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.gif"
            />

            {/* Input field */}
            <input
              type="text"
              value={inputText}
              onChange={handleInputChange}
              placeholder={isRecording ? "Listening to your voice..." : "Ask anything"}
              className="bg-transparent text-sm w-full outline-none border-none text-white px-3 placeholder-gray-500 focus:ring-0 focus:outline-none"
              disabled={isRecording}
            />

            {/* Dictation triggers */}
            <button
              type="button"
              onClick={isRecording ? stopRecording : startRecording}
              className={`p-1.5 rounded-full transition-all shrink-0 mr-1.5 ${isRecording ? 'text-red-500 animate-pulse bg-red-500/10' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
              title="Dictate message"
            >
              <Mic className="w-4.5 h-4.5" />
            </button>

            {/* Submit Arrow */}
            <button
              type="submit"
              disabled={!inputText.trim() && !attachedFile}
              className="p-2 bg-white text-black hover:bg-gray-200 disabled:bg-[#2b2b2b] disabled:text-gray-600 rounded-full transition-all flex items-center justify-center shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>

          </form>

          {/* Simple caption */}
          <span className="text-[10px] text-gray-600 mt-2">
            AetherTalk AI can make mistakes. Verify important info.
          </span>

        </div>

      </footer>

    </div>
  );
};

export default ChatPage;
