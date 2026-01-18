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
        <div className="bg-[#0A1128] p-4 rounded-lg border border-[#D4AF37]/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${isActive ? 'bg-red-500/20 text-red-500 animate-pulse' : 'bg-brand-gold/20 text-brand-gold'}`}>
                    <Clock className="w-5 h-5" />
                </div>
                <div>
                    <p className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest">Active Ops Timer</p>
                    <p className="text-xl font-mono font-black text-white">{formatTime(seconds)}</p>
                </div>
            </div>

            <div className="flex gap-2">
                {!isActive ? (
                    <button
                        onClick={handleStart}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-[#0A1128] rounded font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-transform"
                    >
                        <Play className="w-4 h-4 fill-current" />
                        Initiate
                    </button>
                ) : (
                    <button
                        onClick={handleStop}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-transform"
                    >
                        {isSaving ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <>
                                <Square className="w-4 h-4 fill-current" />
                                Extract Log
                            </>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}
