'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, Clock, Save } from 'lucide-react';
import { logTime } from '@/actions/time';

interface TimerProps {
    taskId: string;
    userId: string;
}

export default function Timer({ taskId, userId }: TimerProps) {
    const [isActive, setIsActive] = useState(false);
    const [seconds, setSeconds] = useState(0);
    const [startTime, setStartTime] = useState<Date | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (isActive) {
            timerRef.current = setInterval(() => {
                setSeconds(prev => prev + 1);
            }, 1000);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isActive]);

    const handleStart = () => {
        setIsActive(true);
        setStartTime(new Date());
    };

    const handleStop = async () => {
        setIsActive(false);
        setIsSaving(true);

        if (startTime) {
            const endTime = new Date();
            const result = await logTime({
                taskId,
                userId,
                startTime,
                endTime,
                duration: seconds.toString(),
                description: 'Mission session recorded'
            });

            if (result.success) {
                setSeconds(0);
                setStartTime(null);
            }
        }

        setIsSaving(false);
    };

    const formatTime = (secs: number) => {
        const h = Math.floor(secs / 3600);
        const m = Math.floor((secs % 3600) / 60);
        const s = secs % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="bg-brand-navy p-6 rounded-2xl border border-white/5 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-inner transition-all duration-500 ${isActive ? 'bg-red-500/20 text-red-500 animate-pulse' : 'bg-brand-gold/10 text-brand-gold'}`}>
                    <Clock className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-[10px] font-black text-brand-gold/60 uppercase tracking-[0.2em] mb-1">Session Timer</p>
                    <p className="text-2xl font-mono font-black text-white tracking-widest leading-none">{formatTime(seconds)}</p>
                </div>
            </div>

            <div className="flex gap-2">
                {!isActive ? (
                    <button
                        onClick={handleStart}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-6 py-3 bg-brand-gold text-brand-navy rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-lg shadow-brand-gold/10"
                    >
                        <Play className="w-4 h-4 fill-current" />
                        Start Session
                    </button>
                ) : (
                    <button
                        onClick={handleStop}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-lg shadow-red-500/20"
                    >
                        {isSaving ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <>
                                <Square className="w-4 h-4 fill-current" />
                                Save & Sync
                            </>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}
