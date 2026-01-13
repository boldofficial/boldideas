
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { markAsRead, markAsUnread, deleteMessage, sendResponse } from "@/actions/contact"; // Make sure this path is correct
import { Mail, CheckCircle, RefreshCcw, Send, X, Trash2, BookOpen } from "lucide-react";

interface Message {
  id: string;
  name: string;
  email: string;
  content: string;
  status: string | null; // 'new' | 'read' | 'replied'
  createdAt: Date | null;
}

const MessageInbox = ({ initialMessages }: { initialMessages: any[] }) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [isSending, setIsSending] = useState(false);
  const router = useRouter();

  const handleOpenMessage = async (msg: Message) => {
      setSelectedMessage(msg);
      // Prefill with template
      setReplyContent(`Thank you for reaching out to us. We have received your transmission regarding "${msg.content.substring(0, 30)}...".\n\nWe would love to schedule a discovery call to discuss how we can help execute this vision.\n\nAre you available later this week?`);

      // Mark as read if new
      if (msg.status === 'new') {
          await markAsRead(msg.id);
          setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, status: 'read' } : m));
          router.refresh();
      }
  };

  const handleSendReply = async () => {
      if (!selectedMessage) return;
      setIsSending(true);
      
      const res = await sendResponse(selectedMessage.id, selectedMessage.email, selectedMessage.name, replyContent);
      
      if (res.success) {
          setMessages(prev => prev.map(m => m.id === selectedMessage.id ? { ...m, status: 'replied' } : m));
          setReplyContent("");
          setSelectedMessage(null);
          router.refresh();
          alert("Email Response Sent.");
      } else {
          alert("Failed to send response.");
      }
      setIsSending(false);
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      if (!confirm("Are you sure you want to delete this transmission?")) return;
      
      const res = await deleteMessage(id);
      if (res.success) {
          setMessages(prev => prev.filter(m => m.id !== id));
          if (selectedMessage?.id === id) setSelectedMessage(null);
          router.refresh();
      }
  };

  const handleMarkUnread = async (e: React.MouseEvent, msg: Message) => {
      e.stopPropagation();
      await markAsUnread(msg.id);
      setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, status: 'new' } : m));
      router.refresh();
  };

  return (
    <>
    <div className="bg-white rounded-sm shadow-sm border border-slate-200 p-6 relative overflow-hidden">
      {/* Decorative Corner */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-brand-gold/5 skew-x-12 transform translate-x-8 -translate-y-8"></div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 relative z-10">
        <div>
            <h2 className="text-xl font-black text-brand-navy uppercase tracking-tight flex items-center">
                <span className="w-2 h-2 bg-brand-gold mr-3"></span>
                Secure Inbox
            </h2>
            <p className="text-[10px] font-mono text-slate-400 mt-1 uppercase tracking-widest">
                Encrypted Uplink // Table: Messages
            </p>
        </div>
        <button 
           onClick={() => router.refresh()}
           className="bg-slate-50 text-slate-400 px-4 py-2 rounded-sm text-[10px] font-bold uppercase tracking-widest hover:bg-slate-100 hover:text-brand-navy transition-all flex items-center border border-slate-200"
        >
           <RefreshCcw className="w-3 h-3 mr-2" /> Refresh Stream
        </button>
      </div>

      <div className="space-y-0 divide-y divide-slate-100 border border-slate-100 bg-slate-50/50">
        {messages.length === 0 && (
            <div className="p-8 text-center text-slate-400 text-xs font-mono uppercase tracking-widest">
                No signal detected...
            </div>
        )}
        {messages.map(msg => (
            <div 
                key={msg.id} 
                onClick={() => handleOpenMessage(msg)}
                className={`flex flex-col md:flex-row items-start md:items-center justify-between p-4 hover:bg-white transition-all cursor-pointer group ${msg.status === 'new' ? 'bg-white border-l-4 border-l-brand-gold shadow-sm' : 'border-l-4 border-l-transparent opacity-70 hover:opacity-100'}`}
            >
                <div className="flex items-center gap-4 w-full md:w-1/3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${msg.status === 'new' ? 'bg-brand-gold text-brand-navy' : 'bg-slate-200 text-slate-500'}`}>
                        {msg.name.charAt(0)}
                    </div>
                    <div>
                        <h4 className={`text-sm ${msg.status === 'new' ? 'font-black text-brand-navy' : 'font-medium text-slate-600'}`}>{msg.name}</h4>
                        <p className="text-[10px] font-mono text-slate-400">{msg.email}</p>
                    </div>
                </div>
                
                <div className="flex-1 w-full md:w-auto mt-2 md:mt-0 px-4">
                     <p className="text-xs text-slate-500 truncate max-w-md font-mono">{msg.content}</p>
                </div>

                <div className="flex items-center space-x-4 w-full md:w-auto justify-end mt-2 md:mt-0">
                    <span className="text-[9px] font-mono text-slate-400 uppercase">
                        {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString() : 'Unknown'}
                    </span>
                    <div className="w-20 flex justify-end items-center space-x-2">
                    {msg.status === 'replied' && (
                        <span className="text-[9px] bg-green-100 text-green-600 px-2 py-1 rounded-full font-bold uppercase tracking-tighter flex items-center">
                            <CheckCircle className="w-3 h-3 mr-1" /> Replied
                        </span>
                    )}
                    {msg.status === 'new' && (
                        <span className="text-[9px] bg-brand-gold/10 text-brand-gold px-2 py-1 rounded-full font-bold uppercase tracking-tighter flex items-center">
                            <Mail className="w-3 h-3 mr-1" /> New
                        </span>
                    )}
                    
                        <div className="flex items-center space-x-1 border-l border-slate-200 pl-2">
                            {msg.status !== 'new' && (
                                <button 
                                    onClick={(e) => handleMarkUnread(e, msg)}
                                    className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-brand-navy transition-colors"
                                    title="Mark as Unread"
                                >
                                    <Mail className="w-3 h-3" />
                                </button>
                            )}
                            <button 
                                onClick={(e) => handleDelete(e, msg.id)}
                                className="p-1 hover:bg-red-50 rounded text-slate-400 hover:text-red-500 transition-colors"
                                title="Delete"
                            >
                                <Trash2 className="w-3 h-3" />
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        ))}
      </div>
    </div>
    
    {/* Response Modal */}
    {selectedMessage && (
        <div className="fixed inset-0 bg-brand-navy/90 backdrop-blur-md flex items-center justify-center z-[9999] p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-sm w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="bg-brand-navy p-6 flex justify-between items-start shrink-0">
                    <div>
                        <div className="flex items-center space-x-2 mb-1">
                             <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                             <span className="text-[10px] font-mono text-brand-gold uppercase tracking-widest">Email Connection</span>
                        </div>
                        <h3 className="text-xl font-black text-white uppercase tracking-tight">{selectedMessage.name}</h3>
                        <p className="text-xs font-mono text-slate-400">{selectedMessage.email}</p>
                    </div>
                    <button onClick={() => setSelectedMessage(null)} className="text-white/50 hover:text-white transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 bg-slate-50">
                    <div className="bg-white p-6 border border-slate-200 shadow-sm mb-8 relative">
                        <div className="absolute -left-1 top-6 bottom-6 w-1 bg-brand-gold"></div>
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-brand-navy/50 mb-4">Incoming Transmission</h4>
                        <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap font-mono">{selectedMessage.content}</p>
                        <p className="text-[10px] text-slate-300 mt-4 text-right">
                             Timestamp: {selectedMessage.createdAt ? new Date(selectedMessage.createdAt).toLocaleString() : ''}
                        </p>
                    </div>

                    <div className="space-y-4">
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-navy/50">
                            Reply Protocol
                        </label>
                        <textarea
                            className="w-full p-4 bg-white border border-slate-200 focus:border-brand-navy focus:ring-1 focus:ring-brand-navy/50 outline-none text-sm text-brand-navy h-48 resize-none font-mono"
                            placeholder="Type your response here..."
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                        ></textarea>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 bg-white border-t border-slate-100 flex justify-end space-x-4 shrink-0">
                    <button 
                        onClick={() => setSelectedMessage(null)}
                        className="px-6 py-3 text-xs font-bold uppercase tracking-widest text-slate-500 hover:bg-slate-100 transition-colors"
                    >
                        Close
                    </button>
                    <button 
                        onClick={handleSendReply}
                        disabled={isSending || !replyContent}
                        className="bg-brand-navy text-white px-8 py-3 font-black uppercase tracking-widest text-xs hover:bg-brand-gold hover:text-brand-navy transition-all shadow-lg flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                         {isSending ? 'Transmitting...' : (
                             <>
                                Reply <Send className="w-3 h-3 ml-2" />
                             </>
                         )}
                    </button>
                </div>

            </div>
        </div>
    )}
    </>
  );
};

export default MessageInbox;
