import React from 'react';

const MediaCardSkeleton = () => {
    return (
        <li className="movie-card pointer-events-none animate-pulse">
            <div className="relative w-full aspect-[2/3] bg-slate-800/80 rounded-lg overflow-hidden mb-3">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-700/30 to-transparent animate-shimmer" />
            </div>

            <div className="space-y-2 mt-2">
                <div className="h-4 bg-slate-800 rounded-md w-3/4"></div>

                <div className="flex items-center gap-2 pt-1">
                    <div className="h-3 bg-slate-800 rounded-md w-1/4"></div>
                    <div className="h-3 bg-slate-800 rounded-md w-1/5"></div>
                    <div className="h-3 bg-slate-800 rounded-md w-1/5"></div>
                </div>
            </div>
        </li>
    );
};

export default MediaCardSkeleton;