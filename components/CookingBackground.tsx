'use client';

import React from 'react';

// ─── All cooking SVG paths ────────────────────────────────────────────────────

const ICONS: Record<string, React.FC<{ className?: string }>> = {
    chefHat: ({ className }) => (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z" />
            <line x1="6" x2="18" y1="17" y2="17" />
            <line x1="6" x2="18" y1="13" y2="13" />
        </svg>
    ),
    pot: ({ className }) => (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 12h20v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-6Z" />
            <path d="M20 12a8 8 0 0 0-16 0" />
            <path d="M7 12V9" /><path d="M12 12V9" /><path d="M17 12V9" />
            <path d="M0 12h2" /><path d="M22 12h2" />
        </svg>
    ),
    whisk: ({ className }) => (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m5 3 14 14" />
            <path d="M5 3c0 0 0 8 7 11" />
            <path d="M5 3c0 0 4 0 8 7" />
            <path d="m12 17 5 5" />
            <path d="M12 17c0 0 4-1 7-7" />
            <path d="M12 17c0 0-1-4 5-7" />
        </svg>
    ),
    fork: ({ className }) => (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v20" />
            <path d="M8 2v5a4 4 0 0 0 8 0V2" />
        </svg>
    ),
    spatula: ({ className }) => (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18.37 2.63 14 7l-1.59-1.59a2 2 0 0 0-2.82 0L8 7l9 9 1.59-1.59a2 2 0 0 0 0-2.82L17 10l4.37-4.37a2.12 2.12 0 1 0-3-3Z" />
            <path d="M9 8c-2 3-4 3.5-7 4l8 10c2-1 6-5 6-7" />
            <path d="M14.5 17.5 4.5 15" />
        </svg>
    ),
    flame: ({ className }) => (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
        </svg>
    ),
    bowl: ({ className }) => (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a10 10 0 0 1 10 10H2A10 10 0 0 1 12 2Z" />
            <path d="M5 22h14" />
            <path d="M8.93 12c.5 2.5 2.38 4 3.07 4s2.57-1.5 3.07-4" />
        </svg>
    ),
    star: ({ className }) => (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5z" />
        </svg>
    ),
};

// ─── Icon configs: position, size, color, animation ──────────────────────────

const FLOATING_ICONS = [
    // Top-right area
    { icon: 'chefHat', top: '4%', right: '3%', size: 72, opacity: 0.06, animClass: 'cook-float-1', rotate: 15 },
    { icon: 'star', top: '8%', right: '14%', size: 18, opacity: 0.18, animClass: 'cook-spin', rotate: 0 },
    { icon: 'whisk', top: '16%', right: '7%', size: 44, opacity: 0.07, animClass: 'cook-float-2', rotate: 30 },

    // Top-left area
    { icon: 'pot', top: '6%', left: '4%', size: 64, opacity: 0.05, animClass: 'cook-float-3', rotate: -10 },
    { icon: 'star', top: '14%', left: '12%', size: 14, opacity: 0.15, animClass: 'cook-spin', rotate: 45 },
    { icon: 'flame', top: '22%', left: '6%', size: 36, opacity: 0.07, animClass: 'cook-float-1', rotate: -5 },

    // Mid-right
    { icon: 'fork', top: '38%', right: '1%', size: 56, opacity: 0.05, animClass: 'cook-float-2', rotate: 20 },
    { icon: 'star', top: '44%', right: '8%', size: 12, opacity: 0.20, animClass: 'cook-spin', rotate: 0 },

    // Mid-left
    { icon: 'spatula', top: '42%', left: '1%', size: 50, opacity: 0.05, animClass: 'cook-float-3', rotate: -20 },
    { icon: 'star', top: '50%', left: '7%', size: 10, opacity: 0.18, animClass: 'cook-spin', rotate: 0 },

    // Lower-right
    { icon: 'bowl', top: '65%', right: '3%', size: 58, opacity: 0.06, animClass: 'cook-float-1', rotate: 10 },
    { icon: 'star', top: '72%', right: '11%', size: 16, opacity: 0.16, animClass: 'cook-spin', rotate: 20 },
    { icon: 'chefHat', top: '80%', right: '5%', size: 40, opacity: 0.05, animClass: 'cook-float-2', rotate: -8 },

    // Lower-left
    { icon: 'whisk', top: '68%', left: '2%', size: 52, opacity: 0.05, animClass: 'cook-float-3', rotate: 25 },
    { icon: 'flame', top: '78%', left: '5%', size: 32, opacity: 0.07, animClass: 'cook-float-1', rotate: 5 },
    { icon: 'star', top: '85%', left: '10%', size: 12, opacity: 0.14, animClass: 'cook-spin', rotate: 0 },

    // Center scattered
    { icon: 'star', top: '30%', left: '48%', size: 10, opacity: 0.12, animClass: 'cook-spin', rotate: 0 },
    { icon: 'star', top: '60%', left: '52%', size: 8, opacity: 0.10, animClass: 'cook-spin', rotate: 0 },
];

export default function CookingBackground() {
    return (
        <div
            className="fixed inset-0 pointer-events-none select-none overflow-hidden z-0"
            aria-hidden="true"
        >
            {FLOATING_ICONS.map((item, i) => {
                const Icon = ICONS[item.icon];
                const style: React.CSSProperties = {
                    position: 'absolute',
                    top: item.top,
                    ...(item.right !== undefined ? { right: item.right } : {}),
                    ...(item.left !== undefined ? { left: item.left } : {}),
                    width: item.size,
                    height: item.size,
                    opacity: item.opacity,
                    transform: `rotate(${item.rotate}deg)`,
                    color: '#F57C00',
                };
                return (
                    <div key={i} className={item.animClass} style={style}>
                        <Icon className="w-full h-full" />
                    </div>
                );
            })}
        </div>
    );
}
