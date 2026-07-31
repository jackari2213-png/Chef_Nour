import React from 'react';
import CookingLoader from '@/components/CookingLoader';

export default function Loading() {
    return (
        <div className="min-h-[65vh] flex items-center justify-center p-4">
            <CookingLoader size="lg" text="الشيف نور... يُحَضَّر لك كل ما هو شهي ✨" />
        </div>
    );
}
