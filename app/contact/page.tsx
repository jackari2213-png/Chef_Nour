'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, ChefHat, Instagram, Youtube, MessageCircle } from 'lucide-react';
import { useTranslation } from '@/lib/useTranslation';

export default function ContactPage() {
    const { t } = useTranslation();
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    const contactCards = [
        { icon: Mail, label: t('contact.emailInfo'), value: 'contact@chefnour.ma', href: 'mailto:contact@chefnour.ma', borderColor: 'hover:border-brand-300' },
        { icon: Phone, label: t('contact.emailInfo'), value: '+212 6 00 00 00 00', href: 'tel:+212600000000', borderColor: 'hover:border-emerald-300' },
        { icon: MapPin, label: t('contact.emailInfo'), value: 'الدار البيضاء، المملكة المغربية', href: null, borderColor: 'hover:border-blue-300' },
    ];

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">

            <div className="text-right border-b border-gray-200 pb-4">
                <h1 className="text-3xl sm:text-4xl font-black text-gray-900">{t('contact.title')}</h1>
                <p className="text-sm text-gray-500 font-medium mt-1">
                    {t('contact.subtitle')}
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Contact info cards + Social */}
                <div className="lg:col-span-5 space-y-4 text-right">
                    {contactCards.map(({ icon: Icon, label, value, href, borderColor }) => {
                        const Card = (
                            <div className={`bg-white p-5 sm:p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 card-hover-effect ${borderColor} cursor-default`}>
                                <div className="flex items-start gap-4">
                                    <div className="w-11 h-11 rounded-2xl bg-brand-50 flex items-center justify-center shrink-0">
                                        <Icon className="w-5 h-5 text-brand-500" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <h3 className="font-extrabold text-sm text-gray-900">{label}</h3>
                                        <p className="text-xs text-gray-600 font-medium">{value}</p>
                                    </div>
                                </div>
                            </div>
                        );
                        return href ? <a key={label} href={href}>{Card}</a> : <div key={label}>{Card}</div>;
                    })}

                    {/* Social Links */}
                    <div className="bg-white p-5 sm:p-6 rounded-3xl border border-gray-100 shadow-sm">
                        <h3 className="font-extrabold text-sm text-gray-900 mb-4 text-right">{t('contact.socialTitle')}</h3>
                        <div className="flex items-center gap-3 justify-start">
                            {[
                                { icon: Instagram, label: 'Instagram', href: '#', color: 'hover:bg-pink-500 hover:text-white hover:border-pink-500' },
                                { icon: Youtube, label: 'YouTube', href: '#', color: 'hover:bg-red-500 hover:text-white hover:border-red-500' },
                                { icon: MessageCircle, label: 'WhatsApp', href: '#', color: 'hover:bg-emerald-500 hover:text-white hover:border-emerald-500' },
                            ].map(({ icon: Icon, label, href, color }) => (
                                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                                    className={`w-11 h-11 rounded-2xl border border-gray-200 flex items-center justify-center text-gray-500 transition-all duration-300 hover:scale-110 ${color}`}
                                    aria-label={label}
                                >
                                    <Icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-card text-right">
                    {submitted ? (
                        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-8 rounded-2xl text-center space-y-3 animate-in fade-in zoom-in-95 duration-200">
                            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                            <h3 className="font-bold text-lg">{t('contact.successTitle')}</h3>
                            <p className="text-xs text-emerald-700">{t('contact.successDesc')}</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-700 block mb-1">{t('contact.nameLabel')}</label>
                                    <input type="text" required placeholder={t('contact.namePlaceholder')}
                                        value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-700 block mb-1">{t('contact.emailLabel')}</label>
                                    <input type="email" required placeholder={t('contact.emailPlaceholder')}
                                        value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all" />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-700 block mb-1">{t('contact.subjectLabel')}</label>
                                <input type="text" required placeholder={t('contact.subjectPlaceholder')}
                                    value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-700 block mb-1">{t('contact.messageLabel')}</label>
                                <textarea rows={4} required placeholder={t('contact.messagePlaceholder')}
                                    value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all resize-none" />
                            </div>
                            <button type="submit"
                                className="w-full bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs py-3.5 rounded-2xl shadow-orange-glow hover:shadow-lg transition-all btn-tap flex items-center justify-center gap-2">
                                <span>{t('contact.sendBtn')}</span>
                                <Send className="w-4 h-4" />
                            </button>
                        </form>
                    )}
                </div>

            </div>

        </div>
    );
}
