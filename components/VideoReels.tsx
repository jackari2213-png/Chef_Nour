'use client';

import React, { useState } from 'react';
import { Play, X, Clock } from 'lucide-react';

const REELS = [
    {
        id: 'r1',
        title: 'سر الكسكس المثالي',
        duration: '3:42',
        views: '842K',
        thumb: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&q=80',
        videoUrl: 'https://www.youtube.com/embed/s_P-_EgMJuI?autoplay=1',
    },
    {
        id: 'r2',
        title: 'طاجين الدجاج الأصيل خطوة بخطوة',
        duration: '5:18',
        views: '1.2M',
        thumb: 'https://images.unsplash.com/photo-1541518763669-27fef04b14da?w=400&q=80',
        videoUrl: 'https://www.youtube.com/embed/q8Q3mJ_vSCo?autoplay=1',
    },
    {
        id: 'r3',
        title: 'حلوى الشباكية السريعة',
        duration: '4:05',
        views: '560K',
        thumb: 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=400&q=80',
        videoUrl: 'https://www.youtube.com/embed/KFHyzmLsKEI?autoplay=1',
    },
    {
        id: 'r4',
        title: 'كيكة البرتقال الرطبة والمحببة',
        duration: '6:10',
        views: '980K',
        thumb: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400&q=80',
        videoUrl: 'https://www.youtube.com/embed/IWNVT3bGv4A?autoplay=1',
    },
];

export default function VideoReels() {
    const [activeVideo, setActiveVideo] = useState<typeof REELS[0] | null>(null);

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
                <div className="text-right">
                    <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                        🎬 ريلز الشيف نور الأكثر مشاهدةً
                    </h2>
                    <p className="text-xs text-gray-500 font-medium mt-1">
                        تعلمي مع الشيف نور بالفيديو خطوة بخطوة
                    </p>
                </div>
                <a
                    href="https://www.youtube.com/@chefnour"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-extrabold text-brand-600 hover:text-brand-700 flex items-center gap-1 bg-red-50 px-4 py-2 rounded-xl hover:bg-red-100 transition-colors"
                >
                    قناة يوتيوب ▶
                </a>
            </div>

            {/* Horizontal scroll card reel */}
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                {REELS.map(reel => (
                    <button
                        key={reel.id}
                        onClick={() => setActiveVideo(reel)}
                        className="shrink-0 w-48 sm:w-60 group cursor-pointer text-right"
                    >
                        <div className="relative rounded-2xl overflow-hidden aspect-[9/16] sm:aspect-video bg-gray-900 shadow-md">
                            <img
                                src={reel.thumb}
                                alt={reel.title}
                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                            />
                            {/* Play Overlay */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-12 h-12 rounded-full bg-white/90 text-brand-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                    <Play className="w-5 h-5 fill-current ml-0.5" />
                                </div>
                            </div>
                            {/* Duration badge */}
                            <div className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {reel.duration}
                            </div>
                        </div>
                        <div className="mt-2 px-1">
                            <h4 className="text-xs font-extrabold text-gray-900 line-clamp-2 leading-snug">{reel.title}</h4>
                            <p className="text-[10px] text-gray-400 font-medium">{reel.views} مشاهدة</p>
                        </div>
                    </button>
                ))}
            </div>

            {/* Video Modal */}
            {activeVideo && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-gray-900 rounded-3xl overflow-hidden w-full max-w-3xl shadow-2xl relative animate-in zoom-in duration-200">
                        <div className="flex items-center justify-between p-4 border-b border-gray-800">
                            <h3 className="font-extrabold text-sm text-white">{activeVideo.title}</h3>
                            <button
                                onClick={() => setActiveVideo(null)}
                                className="p-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="aspect-video bg-black">
                            <iframe
                                src={activeVideo.videoUrl}
                                className="w-full h-full"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
