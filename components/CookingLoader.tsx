'use client';

import React from 'react';

interface CookingLoaderProps {
    text?: string;
    size?: 'sm' | 'md' | 'lg';
    fullScreen?: boolean;
}

export default function CookingLoader({
    text = 'جارٍ تحضير أشهى الوصفات...',
    size = 'md',
    fullScreen = false
}: CookingLoaderProps) {

    const sizeClasses = {
        sm: { box: 'w-16 h-16', pan: 'w-8 h-8', flame: 'w-5 h-5', text: 'text-[11px]' },
        md: { box: 'w-24 h-24', pan: 'w-12 h-12', flame: 'w-7 h-7', text: 'text-xs' },
        lg: { box: 'w-32 h-32', pan: 'w-16 h-16', flame: 'w-9 h-9', text: 'text-sm' },
    }[size];

    const content = (
        <div className="flex flex-col items-center justify-center space-y-4 select-none dir-rtl font-arabic">

            {/* Glowing Pan & Flame Box */}
            <div className={`relative ${sizeClasses.box} rounded-3xl bg-gradient-to-br from-amber-500/10 via-orange-500/15 to-amber-600/10 border border-orange-500/20 flex items-center justify-center shadow-lg anim-heat-glow`}>

                {/* Steam Clouds Rising */}
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 flex gap-1.5 pointer-events-none z-10">
                    <div className="w-2 h-2 rounded-full bg-white/70 backdrop-blur-sm anim-steam-1" />
                    <div className="w-2.5 h-2.5 rounded-full bg-orange-100/80 backdrop-blur-sm anim-steam-2" />
                    <div className="w-2 h-2 rounded-full bg-amber-100/70 backdrop-blur-sm anim-steam-3" />
                </div>

                {/* Rising Flames (l3afya) behind/inside pan */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-end justify-center gap-0.5 z-0 pointer-events-none">
                    <div className="w-2.5 h-6 rounded-full bg-gradient-to-t from-red-600 via-orange-500 to-amber-300 anim-flame-1 origin-bottom opacity-90 blur-[0.5px]" />
                    <div className="w-3.5 h-8 rounded-full bg-gradient-to-t from-orange-600 via-amber-400 to-yellow-200 anim-flame-2 origin-bottom shadow-orange-glow blur-[0.5px]" />
                    <div className="w-2.5 h-6 rounded-full bg-gradient-to-t from-red-600 via-orange-500 to-amber-300 anim-flame-3 origin-bottom opacity-90 blur-[0.5px]" />
                </div>

                {/* Cooking Frying Pan / Skillet (m9la) */}
                <div className={`relative z-10 ${sizeClasses.pan} text-brand-500 anim-pan-tilt flex items-center justify-center drop-shadow-md`}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
                        {/* Pan Handle */}
                        <path d="M19 15l3.5 3.5a1.5 1.5 0 01-2.12 2.12L16.8 17.1" className="stroke-amber-800" strokeWidth="2.2" />
                        {/* Frying Pan Body */}
                        <path d="M3 11h14a1 1 0 011 1v2a4 4 0 01-4 4H7a4 4 0 01-4-4v-2a1 1 0 011-1z" fill="url(#panGradient)" stroke="#431407" strokeWidth="1.6" />
                        {/* Sizzling Ingredient Dots inside Pan */}
                        <circle cx="7" cy="13.5" r="0.9" fill="#FFF" className="animate-ping" />
                        <circle cx="10" cy="14" r="1.1" fill="#FDE047" className="animate-pulse" />
                        <circle cx="13" cy="13.5" r="0.8" fill="#F97316" className="animate-ping" style={{ animationDelay: '0.3s' }} />
                        <defs>
                            <linearGradient id="panGradient" x1="3" y1="11" x2="17" y2="18" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#F97316" />
                                <stop offset="1" stopColor="#C2410C" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>

                {/* Sparkling Stars */}
                <div className="absolute top-2 right-2 text-amber-400 animate-pulse text-[10px]">✨</div>
                <div className="absolute bottom-2 left-2 text-orange-400 animate-pulse text-[10px]" style={{ animationDelay: '0.5s' }}>🔥</div>
            </div>

            {/* Label */}
            {text && (
                <p className={`${sizeClasses.text} font-black text-gray-800 tracking-wide text-center animate-pulse`}>
                    {text}
                </p>
            )}

        </div>
    );

    if (fullScreen) {
        return (
            <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-4">
                {content}
            </div>
        );
    }

    return content;
}
