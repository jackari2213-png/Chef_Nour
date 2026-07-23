'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">

            <div className="text-right border-b border-gray-200 pb-4">
                <h1 className="text-3xl sm:text-4xl font-black text-gray-900">تواصل مع الشيف نور</h1>
                <p className="text-sm text-gray-500 font-medium mt-1">
                    يسعدنا استقبال تساؤلاتكم، اقتراحاتكم، والشراكات الإعلانية
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">

                {/* Contact info cards */}
                <div className="md:col-span-5 space-y-4 text-right">
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-2">
                        <Mail className="w-6 h-6 text-brand-500" />
                        <h3 className="font-extrabold text-sm text-gray-900">البريد الإلكتروني:</h3>
                        <p className="text-xs text-gray-600">contact@chefnour.ma</p>
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-2">
                        <Phone className="w-6 h-6 text-brand-500" />
                        <h3 className="font-extrabold text-sm text-gray-900">الهاتف / واتساب:</h3>
                        <p className="text-xs text-gray-600">+212 6 00 00 00 00</p>
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-2">
                        <MapPin className="w-6 h-6 text-brand-500" />
                        <h3 className="font-extrabold text-sm text-gray-900">المقر الرئيسي:</h3>
                        <p className="text-xs text-gray-600">الدار البيضاء، المملكة المغربية</p>
                    </div>
                </div>

                {/* Form */}
                <div className="md:col-span-7 bg-white p-8 rounded-3xl border border-gray-100 shadow-card text-right">
                    {submitted ? (
                        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-6 rounded-2xl text-center space-y-2">
                            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                            <h3 className="font-bold text-base">تم إرسال رسالتك بنجاح!</h3>
                            <p className="text-xs text-emerald-700">سوف يقوم فريق الشيف نور بالرد عليك في أقرب وقت.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-700 block mb-1">الاسم الكامل:</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="اسمك"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-brand-500"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-700 block mb-1">البريد الإلكتروني:</label>
                                <input
                                    type="email"
                                    required
                                    placeholder="بريدك"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-brand-500"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-700 block mb-1">موضوع الرسالة:</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="استفسار، اقتراح..."
                                    value={formData.subject}
                                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-brand-500"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-700 block mb-1">نص الرسالة:</label>
                                <textarea
                                    rows={4}
                                    required
                                    placeholder="اكتبي رسالتك هنا..."
                                    value={formData.message}
                                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-brand-500"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs py-3.5 rounded-2xl shadow-orange-glow transition-all flex items-center justify-center gap-2"
                            >
                                <span>إرسال الرسالة</span>
                                <Send className="w-4 h-4" />
                            </button>
                        </form>
                    )}
                </div>

            </div>

        </div>
    );
}
