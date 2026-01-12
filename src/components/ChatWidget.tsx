"use client";

import React, { useState, useRef, useEffect } from 'react';
import { chatAction } from '@/actions/chat';
import { ChatMessage } from '../types';

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Hello! I'm Seth, the AI operative for Bold Ideas. How can I augment your strategy today?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    // Prepare history for the server
    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    try {
        const { text } = await chatAction(userMsg, history);
        setMessages(prev => [...prev, { role: 'model', text: text }]);
    } catch (error) {
        setMessages(prev => [...prev, { role: 'model', text: "Connection interrupted." }]);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[1000]">
      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-3xl flex items-center justify-center transition-all duration-300 shadow-2xl ${isOpen ? 'bg-brand-navy rotate-90' : 'bg-brand-gold hover:scale-110'}`}
      >
        {isOpen ? (
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <div className="relative">
             <div className="absolute inset-0 bg-white/20 blur-lg rounded-full animate-pulse"></div>
             <svg className="w-8 h-8 text-brand-navy relative" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 1.821.487 3.53 1.338 5L2.5 21.5l4.5-.838A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.476 0-2.886-.313-4.156-.878l-3.156.586.586-3.156A7.962 7.962 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
             </svg>
          </div>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[320px] sm:w-[380px] h-[550px] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-brand-navy/5 flex flex-col animate-scale-up origin-bottom-right">
          {/* Header */}
          <div className="bg-brand-navy p-6 flex items-center space-x-4">
             <div className="w-3 h-3 rounded-full bg-brand-gold animate-pulse"></div>
             <div>
                <h4 className="text-white text-xs font-black uppercase tracking-widest">Seth v2.0</h4>
                <p className="text-[9px] text-white/50 font-bold uppercase tracking-widest">AI Operative Active</p>
             </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[85%] px-5 py-3 rounded-[1.5rem] text-sm leading-relaxed shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-brand-navy text-white font-bold rounded-tr-none' 
                      : 'bg-white text-brand-navy rounded-tl-none border border-brand-navy/5'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                 <div className="bg-white px-5 py-3 rounded-2xl border border-brand-navy/5 flex gap-1">
                    <div className="w-1.5 h-1.5 bg-brand-gold rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-brand-gold rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1.5 h-1.5 bg-brand-gold rounded-full animate-bounce [animation-delay:0.4s]"></div>
                 </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-6 bg-white border-t border-brand-navy/5">
            <div className="flex items-center space-x-2 bg-slate-100 border border-slate-200 rounded-2xl px-4 py-1">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask Seth..."
                className="flex-1 bg-transparent border-none py-3 text-sm text-brand-navy focus:ring-0 outline-none placeholder:text-slate-400"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading}
                className="text-brand-navy hover:text-brand-gold transition-colors p-1"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
