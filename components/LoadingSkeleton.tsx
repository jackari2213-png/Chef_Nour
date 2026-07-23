import React from 'react';

export function RecipeCardSkeleton() {
    return (
        <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 p-4 space-y-4 animate-pulse">
            <div className="bg-gray-200 aspect-[4/3] rounded-2xl w-full" />
            <div className="h-4 bg-gray-200 rounded w-1/3" />
            <div className="h-6 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-10 bg-gray-200 rounded-2xl w-full" />
        </div>
    );
}

export function RecipeDetailSkeleton() {
    return (
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4" />
            <div className="h-12 bg-gray-200 rounded w-2/3" />
            <div className="aspect-video bg-gray-200 rounded-3xl w-full" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="h-64 bg-gray-200 rounded-3xl" />
                <div className="md:col-span-2 h-96 bg-gray-200 rounded-3xl" />
            </div>
        </div>
    );
}
