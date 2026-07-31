'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/lib/store';
import { MOCK_CATEGORIES } from '@/lib/mock-data';
import { useTranslation } from '@/lib/useTranslation';
import ScrollToTop from '@/components/ScrollToTop';

// ─── Custom Cooking SVG Icons ───────────────────────────────────────────────

const IconChefHat = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z" />
        <line x1="6" x2="18" y1="17" y2="17" />
        <line x1="6" x2="18" y1="13" y2="13" />
    </svg>
);

const IconMortar = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 3.5c-1.7.5-3 2.2-3 4v1.5c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2V7.5c0-1.8-1.3-3.5-3-4" />
        <path d="M17 9H7l1 10h8Z" />
        <path d="M5 21h14" />
        <path d="M10 3.5V2" />
        <path d="M14 3.5V2" />
        <path d="M18 5l2-2" />
    </svg>
);

const IconPot = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12h20v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-6Z" />
        <path d="M20 12a8 8 0 0 0-16 0" />
        <path d="M7 12V8" />
        <path d="M12 12V8" />
        <path d="M17 12V8" />
        <path d="M0 12h2" />
        <path d="M22 12h2" />
    </svg>
);

const IconWhisk = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="m5 3 14 14" />
        <path d="M5 3c0 0 0 8 7 11" />
        <path d="M5 3c0 0 4 0 8 7" />
        <path d="m12 17 5 5" />
        <path d="M12 17c0 0 4-1 7-7" />
        <path d="M12 17c0 0-1-4 5-7" />
    </svg>
);

const IconSparkle = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5z" />
    </svg>
);

// TikTok SVG
const IconTikTok = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
);

// Instagram SVG
const IconInstagram = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
);

// YouTube SVG
const IconYouTube = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.57A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
    </svg>
);

// Facebook SVG
const IconFacebook = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
);

// ─── Footer Component ────────────────────────────────────────────────────────

export default function Footer() {
    const pathname = usePathname();
    const { t, getLocalizedField } = useTranslation();
    const { categories, recipes } = useApp();
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    if (pathname.startsWith('/admin')) return null;

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (email.trim()) {
            setSubscribed(true);
            setEmail('');
        }
    };

    const cookingFeatures = [
        { icon: IconChefHat, label: t('footer.featureTested') },
        { icon: IconPot, label: t('footer.featureAuthentic') },
        { icon: IconWhisk, label: t('footer.featurePastry') },
        { icon: IconMortar, label: t('footer.featureMoroccan') },
    ];

    return (
        <footer className="relative bg-[#1A0F00] text-gray-300 overflow-hidden border-t-4 border-brand-500">

            {/* ── Top orange glow line (like snack_LeNorm) */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-500/60 to-transparent" />

            {/* ── Decorative cooking icon silhouettes — background layer */}
            <div className="absolute inset-0 pointer-events-none select-none overflow-hidden opacity-[0.04]">
                <IconChefHat className="absolute -top-6 right-8 w-56 h-56 text-white rotate-12" />
                <IconPot className="absolute bottom-16 left-4 w-40 h-40 text-white -rotate-6" />
                <IconWhisk className="absolute top-24 left-1/2 w-32 h-32 text-white rotate-45" />
                <IconMortar className="absolute bottom-8 right-1/4 w-28 h-28 text-white rotate-12" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* ── Cooking Feature Icons Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-10 border-b border-white/5">
                    {cookingFeatures.map(({ icon: Icon, label }) => (
                        <div key={label} className="flex items-center gap-3 group">
                            <div className="w-11 h-11 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 group-hover:bg-brand-500 group-hover:text-white group-hover:scale-110 transition-all duration-300 shrink-0">
                                <Icon className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-bold text-white/70 group-hover:text-white transition-colors">{label}</span>
                        </div>
                    ))}
                </div>

                {/* ── Main 4-Column Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 py-14">

                    {/* Col 1 — Brand */}
                    <div className="space-y-6">
                        <div className="flex flex-col">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-11 h-11 rounded-2xl bg-brand-500 flex items-center justify-center shadow-lg shadow-brand-500/30">
                                    <IconChefHat className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <span className="block font-black text-2xl text-white leading-none">{t('common.chefNour')}</span>
                                    <span className="text-[10px] font-bold text-brand-400 tracking-widest">{t('common.chefNourBrand')}</span>
                                </div>
                            </div>
                            <p className="text-sm text-gray-400 leading-relaxed font-medium">
                                {t('footer.description')}
                            </p>
                        </div>

                        {/* Social Icons — styled like snack_LeNorm */}
                        <div className="flex gap-3">
                            {[
                                { Icon: IconInstagram, label: 'Instagram', href: '#' },
                                { Icon: IconYouTube, label: 'YouTube', href: '#' },
                                { Icon: IconTikTok, label: 'TikTok', href: '#' },
                                { Icon: IconFacebook, label: 'Facebook', href: '#' },
                            ].map(({ Icon, label, href }) => (
                                <a
                                    key={label}
                                    href={href}
                                    aria-label={label}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-brand-400 hover:bg-brand-500 hover:border-brand-500 hover:text-white hover:scale-110 transition-all duration-300 shadow-md"
                                >
                                    <Icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Col 2 — Categories */}
                    <div>
                        <h3 className="text-brand-400 font-black uppercase tracking-[0.2em] text-xs mb-7 flex items-center gap-2">
                            <span className="w-4 h-px bg-brand-500" />
                            {t('footer.recipeSections')}
                        </h3>
                        <ul className="space-y-3">
                            {(categories.length > 0 ? categories : MOCK_CATEGORIES).map((cat) => {
                                const realCount = recipes.filter(
                                    r => r.category_id === cat.id ||
                                        r.category_name_ar === cat.name_ar ||
                                        (cat.slug === 'ramadan' && (r.category_name_ar === 'رمضان' || r.category_id === 'cat-3'))
                                ).length;
                                const displayCount = realCount > 0 ? realCount : cat.recipe_count;
                                return (
                                    <li key={cat.id}>
                                        <Link
                                            href={`/category/${cat.slug}`}
                                            className="text-sm text-gray-400 hover:text-brand-400 font-bold transition-colors flex items-center gap-2.5 group"
                                        >
                                            <div className="w-1.5 h-1.5 rounded-full bg-brand-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            {getLocalizedField(cat, 'name')}
                                            <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded-full text-gray-400 group-hover:text-brand-400 group-hover:bg-brand-500/10 mr-auto font-mono">{displayCount}</span>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    {/* Col 3 — Quick Links */}
                    <div>
                        <h3 className="text-brand-400 font-black uppercase tracking-[0.2em] text-xs mb-7 flex items-center gap-2">
                            <span className="w-4 h-px bg-brand-500" />
                            {t('footer.quickLinks')}
                        </h3>
                        <ul className="space-y-3">
                            {[
                                { label: t('footer.homeLink'), href: '/' },
                                { label: t('footer.allRecipes'), href: '/recipes' },
                                { label: t('footer.favoritesLink'), href: '/favorites' },
                                { label: t('footer.storeLink'), href: '/store', badge: t('footer.storeBadge') },
                                { label: t('footer.contactLink'), href: '/contact' },
                                { label: t('footer.profileLink'), href: '/profile' },
                            ].map(({ label, href, badge }) => (
                                <li key={href}>
                                    <Link
                                        href={href}
                                        className="text-sm text-gray-400 hover:text-brand-400 font-bold transition-colors flex items-center gap-2.5 group"
                                    >
                                        <div className="w-1.5 h-1.5 rounded-full bg-brand-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        {label}
                                        {badge && (
                                            <span className="text-[9px] font-black bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded-full mr-auto border border-amber-500/20">
                                                {badge}
                                            </span>
                                        )}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Col 4 — Newsletter */}
                    <div>
                        <h3 className="text-brand-400 font-black uppercase tracking-[0.2em] text-xs mb-7 flex items-center gap-2">
                            <span className="w-4 h-px bg-brand-500" />
                            {t('footer.newsletter')}
                        </h3>

                        <div className="bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur-sm">
                            <p className="text-sm text-gray-300 font-bold mb-1">{t('footer.newsletterDesc')}</p>
                            <p className="text-xs text-gray-500 font-medium mb-4 leading-relaxed">
                                {t('footer.newsletterSub')}
                            </p>
                            {subscribed ? (
                                <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-2xl p-3 text-xs font-bold text-center flex items-center justify-center gap-2">
                                    <IconSparkle className="w-3.5 h-3.5" />
                                    {t('footer.newsletterSuccess')}
                                </div>
                            ) : (
                                <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
                                    <input
                                        type="email"
                                        placeholder={t('footer.newsletterPlaceholder')}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="bg-white/10 border border-white/10 text-white placeholder-gray-500 px-3 py-2.5 rounded-xl text-sm font-medium focus:outline-none focus:border-brand-500 focus:bg-white/15 transition-all w-full"
                                    />
                                    <button
                                        type="submit"
                                        className="w-full bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs py-2.5 rounded-xl transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        <span>{t('footer.newsletterBtn')}</span>
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12h12M13 7l5 5-5 5" />
                                        </svg>
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>

                </div>

                <ScrollToTop />

                {/* ── Bottom Bar */}
                <div className="pt-8 pb-10 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-5">
                    <p className="text-xs text-gray-600 tracking-wider text-center sm:text-right">
                        <a href="/admin" className="hover:text-gray-400 transition-colors">©</a>{' '}
                        {new Date().getFullYear()} <span className="text-gray-500 font-bold">CHEF NOUR</span> | {t('common.chefNour')} — {t('footer.allRights')}
                    </p>
                    <div className="flex items-center gap-2 group">
                        <span className="text-gray-600 text-[10px] uppercase tracking-[0.2em] font-bold">{t('footer.craftedBy')}</span>
                        <span className="text-brand-500 text-xs font-black tracking-wider flex items-center gap-1 group-hover:text-white transition-colors duration-300">
                            ILYASS SROUBI
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse inline-block" />
                        </span>
                    </div>
                </div>

            </div>
        </footer>
    );
}
