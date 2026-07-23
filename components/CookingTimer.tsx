'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Timer, Pause, Play, RotateCcw, Bell } from 'lucide-react';

interface CookingTimerProps {
    defaultMinutes?: number;
}

export default function CookingTimer({ defaultMinutes = 0 }: CookingTimerProps) {
    const [inputMin, setInputMin] = useState(defaultMinutes);
    const [inputSec, setInputSec] = useState(0);
    const [totalSeconds, setTotalSeconds] = useState(0);
    const [remaining, setRemaining] = useState(0);
    const [running, setRunning] = useState(false);
    const [done, setDone] = useState(false);

    const start = useCallback(() => {
        const total = inputMin * 60 + inputSec;
        if (total <= 0) return;
        setTotalSeconds(total);
        setRemaining(total);
        setDone(false);
        setRunning(true);
    }, [inputMin, inputSec]);

    const reset = useCallback(() => {
        setRunning(false);
        setDone(false);
        setRemaining(0);
        setTotalSeconds(0);
    }, []);

    useEffect(() => {
        if (!running) return;
        if (remaining <= 0) {
            setRunning(false);
            setDone(true);
            // Try browser notification
            if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
                new Notification('ساعة الشيف نور', { body: 'انتهى وقت الطبخ! افحصي طبقك.' });
            }
            return;
        }
        const timer = setInterval(() => setRemaining(r => r - 1), 1000);
        return () => clearInterval(timer);
    }, [running, remaining]);

    const mins = Math.floor(remaining / 60).toString().padStart(2, '0');
    const secs = (remaining % 60).toString().padStart(2, '0');
    const progress = totalSeconds > 0 ? ((totalSeconds - remaining) / totalSeconds) * 100 : 0;

    return (
        <div className="bg-gray-900 rounded-3xl p-5 border border-gray-700 space-y-4 text-white">
            <div className="flex items-center gap-2 text-xs font-extrabold text-brand-400">
                <Timer className="w-4 h-4" />
                <span>ساعة الطبخ (بدون تشتيت)</span>
            </div>

            {/* Timer Display */}
            <div className="relative flex items-center justify-center">
                {/* Circular Progress Ring */}
                <svg className="w-32 h-32 -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" className="fill-none stroke-gray-800" strokeWidth="6" />
                    <circle
                        cx="50" cy="50" r="42"
                        className="fill-none stroke-brand-500 transition-all duration-1000"
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 42}`}
                        strokeDashoffset={`${2 * Math.PI * 42 * (1 - progress / 100)}`}
                    />
                </svg>
                <div className="absolute text-center">
                    {done ? (
                        <Bell className="w-8 h-8 text-brand-400 animate-bounce mx-auto" />
                    ) : (
                        <span className={`text-3xl font-black tabular-nums ${running ? 'text-white' : 'text-gray-400'}`}>
                            {mins}:{secs}
                        </span>
                    )}
                </div>
            </div>

            {done && (
                <div className="bg-brand-500/20 border border-brand-500 text-brand-300 text-xs font-bold text-center py-2 rounded-xl animate-pulse flex items-center justify-center gap-1.5">
                    <Bell className="w-4 h-4 text-brand-400 shrink-0" />
                    <span>انتهى الوقت! افحصي طبقك اللذيذ</span>
                </div>
            )}

            {/* Input fields */}
            {!running && !done && (
                <div className="flex items-center gap-2 justify-center">
                    <div className="text-center">
                        <input
                            type="number" min="0" max="120"
                            value={inputMin}
                            onChange={e => setInputMin(Number(e.target.value))}
                            className="w-16 bg-gray-800 border border-gray-700 text-white text-center text-sm font-bold rounded-xl py-2 focus:outline-none focus:border-brand-500"
                        />
                        <div className="text-[10px] text-gray-500 mt-1">دقيقة</div>
                    </div>
                    <span className="text-xl font-black text-gray-400 mb-4">:</span>
                    <div className="text-center">
                        <input
                            type="number" min="0" max="59"
                            value={inputSec}
                            onChange={e => setInputSec(Number(e.target.value))}
                            className="w-16 bg-gray-800 border border-gray-700 text-white text-center text-sm font-bold rounded-xl py-2 focus:outline-none focus:border-brand-500"
                        />
                        <div className="text-[10px] text-gray-500 mt-1">ثانية</div>
                    </div>
                </div>
            )}

            {/* Control Buttons */}
            <div className="flex gap-2">
                {!running && !done && (
                    <button
                        onClick={start}
                        className="flex-1 bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                    >
                        <Play className="w-4 h-4 fill-current" />
                        <span>ابدئي الساعة</span>
                    </button>
                )}
                {running && (
                    <button
                        onClick={() => setRunning(false)}
                        className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                    >
                        <Pause className="w-4 h-4 fill-current" />
                        <span>إيقاف مؤقت</span>
                    </button>
                )}
                {!running && remaining > 0 && !done && (
                    <button
                        onClick={() => setRunning(true)}
                        className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                    >
                        <Play className="w-4 h-4 fill-current" />
                        <span>استكمال</span>
                    </button>
                )}
                {(running || done || remaining > 0) && (
                    <button
                        onClick={reset}
                        className="bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors"
                    >
                        <RotateCcw className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>
    );
}
