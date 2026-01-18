'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { getConversations, getMessages, sendMessage } from '@/actions/directMessages';
import { Send, ArrowLeft, MessageCircle } from 'lucide-react';

interface Conversation {
    partnerId: string;
    partnerName: string;
    partnerEmail: string;
    partnerAvatar: string | null;
    partnerRole: string | null;
    lastMessage: string;
    lastMessageAt: Date | null;
    unreadCount: number;
}

interface Message {
    id: string;
    senderId: string;
    recipientId: string;
    subject: string | null;
    content: string;
    isRead: boolean | null;
    createdAt: Date | null;
}

export default function StaffInboxPage() {
    const { user } = useAuthStore();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);

    useEffect(() => {
        if (user) {
            fetchConversations();
        }
    }, [user]);

    const fetchConversations = async () => {
        if (!user) return;
        setLoading(true);
        const { data } = await getConversations(user.id);
        setConversations(data || []);
        setLoading(false);
    };

    const openConversation = async (conv: Conversation) => {
        if (!user) return;
        setSelectedConversation(conv);
        const { data } = await getMessages(user.id, conv.partnerId);
        setMessages(data || []);
        // Update unread count locally
        setConversations(prev => prev.map(c =>
            c.partnerId === conv.partnerId ? { ...c, unreadCount: 0 } : c
        ));
    };

    const handleSendMessage = async () => {
        if (!user || !selectedConversation || !newMessage.trim()) return;
        setSending(true);
        await sendMessage(user.id, selectedConversation.partnerId, newMessage);
        setNewMessage('');

        // Refresh messages
        const { data } = await getMessages(user.id, selectedConversation.partnerId);
        setMessages(data || []);
        setSending(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-20">
                <div className="w-8 h-8 border-4 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-black text-[#0A1128] uppercase tracking-tight">Inbox</h1>
                    <p className="text-slate-500 text-sm mt-1">Direct messages from your team.</p>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden min-h-[500px] flex">
                {/* Conversation List */}
                <div className={`w-full md:w-1/3 border-r border-slate-200 ${selectedConversation ? 'hidden md:block' : ''}`}>
                    <div className="p-4 bg-slate-50 border-b border-slate-200">
                        <h3 className="font-bold text-sm text-slate-600 uppercase tracking-widest">Conversations</h3>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {conversations.length === 0 ? (
                            <div className="p-8 text-center text-slate-400 text-sm">
                                <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                <p>No messages yet</p>
                            </div>
                        ) : (
                            conversations.map((conv) => (
                                <div
                                    key={conv.partnerId}
                                    onClick={() => openConversation(conv)}
                                    className={`p-4 cursor-pointer hover:bg-slate-50 transition-colors ${selectedConversation?.partnerId === conv.partnerId ? 'bg-brand-gold/5 border-l-4 border-l-brand-gold' : ''
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-brand-navy flex items-center justify-center text-white font-bold text-sm">
                                            {conv.partnerName?.[0]?.toUpperCase() || '?'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-center">
                                                <span className="font-bold text-slate-800 text-sm">{conv.partnerName}</span>
                                                {conv.unreadCount > 0 && (
                                                    <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                                                        {conv.unreadCount}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-slate-400 truncate">{conv.lastMessage}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Message Thread */}
                <div className={`flex-1 flex flex-col ${!selectedConversation ? 'hidden md:flex' : ''}`}>
                    {selectedConversation ? (
                        <>
                            {/* Header */}
                            <div className="p-4 bg-brand-navy flex items-center gap-4">
                                <button
                                    onClick={() => setSelectedConversation(null)}
                                    className="md:hidden text-white"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </button>
                                <div className="w-10 h-10 rounded-full bg-brand-gold/20 flex items-center justify-center text-brand-gold font-bold">
                                    {selectedConversation.partnerName?.[0]?.toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">{selectedConversation.partnerName}</h3>
                                    <p className="text-xs text-slate-400">{selectedConversation.partnerEmail}</p>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                                {messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`max-w-[70%] p-4 rounded-lg ${msg.senderId === user?.id
                                            ? 'bg-brand-navy text-white'
                                            : 'bg-white border border-slate-200'
                                            }`}>
                                            <p className="text-sm">{msg.content}</p>
                                            <p className={`text-[10px] mt-2 ${msg.senderId === user?.id ? 'text-slate-300' : 'text-slate-400'
                                                }`}>
                                                {msg.createdAt ? new Date(msg.createdAt).toLocaleString() : ''}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Input */}
                            <div className="p-4 border-t border-slate-200 bg-white">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                        placeholder="Type a message..."
                                        className="flex-1 p-3 border border-slate-200 rounded-lg text-sm focus:border-brand-navy focus:outline-none"
                                    />
                                    <button
                                        onClick={handleSendMessage}
                                        disabled={sending || !newMessage.trim()}
                                        className="px-6 py-3 bg-brand-navy text-white rounded-lg font-bold text-sm hover:bg-brand-gold hover:text-brand-navy transition-all disabled:opacity-50"
                                    >
                                        <Send className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-slate-400">
                            <div className="text-center">
                                <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-20" />
                                <p>Select a conversation to view messages</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
