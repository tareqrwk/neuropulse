import React from 'react';
import { ActivityMap } from '../utils/activitySimulator';
import { rois } from '../utils/roiPositions';

interface ActiveRegionsProps {
    activity: ActivityMap;
}

const getActivityLevel = (val: number) => {
    if (val > 0.7) return { label: 'High', color: 'text-red-400 bg-red-400/10' };
    if (val > 0.3) return { label: 'Moderate', color: 'text-yellow-400 bg-yellow-400/10' };
    return { label: 'Low', color: 'text-blue-400 bg-blue-400/10' };
};

export const ActiveRegions: React.FC<ActiveRegionsProps> = ({ activity }) => {
    const regions = Object.entries(activity).sort(([, a], [, b]) => b - a);

    return (
        <div className="bg-zinc-900/80 backdrop-blur-md border border-zinc-800 p-4 rounded-xl flex flex-col gap-3 shadow-xl flex-1 min-h-[200px]">
            <h2 className="text-zinc-100 font-semibold text-lg">Active Regions</h2>
            <div className="flex flex-col gap-2 overflow-y-auto pr-2">
                {regions.map(([key, val]) => {
                    const level = getActivityLevel(val);
                    const name = rois[key as keyof typeof rois].label;
                    return (
                        <div key={key} className="flex items-center justify-between p-2 rounded-lg bg-zinc-950/50 border border-zinc-800/50">
                            <span className="text-zinc-300 font-medium text-sm">{name}</span>
                            <div className="flex items-center gap-3">
                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${level.color}`}>
                                    {level.label}
                                </span>
                                <span className="text-zinc-500 font-mono text-xs w-8 text-right">
                                    {val.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
