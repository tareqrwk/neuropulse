import React from 'react';
import { Play, Pause } from 'lucide-react';
import { Scenario } from '../utils/activitySimulator';

interface ControlPanelProps {
    scenario: Scenario;
    setScenario: (s: Scenario) => void;
    isPlaying: boolean;
    togglePlay: () => void;
    speed: number;
    setSpeed: (s: number) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
    scenario, setScenario, isPlaying, togglePlay, speed, setSpeed
}) => {
    return (
        <div className="bg-zinc-900/80 backdrop-blur-md border border-zinc-800 p-4 rounded-xl flex flex-col gap-4 shadow-xl">
            <h2 className="text-zinc-100 font-semibold text-lg">Simulation Controls</h2>

            <div className="flex flex-col gap-2">
                <label className="text-zinc-400 text-sm font-medium">Scenario</label>
                <select
                    value={scenario}
                    onChange={(e) => setScenario(e.target.value as Scenario)}
                    className="bg-zinc-950 border border-zinc-800 text-zinc-200 text-sm rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-blue-500"
                >
                    <option value="focus">Focus Mode</option>
                    <option value="relax">Relax Mode</option>
                    <option value="motor">Motor Mode</option>
                </select>
            </div>

            <div className="flex items-center justify-between gap-4 mt-2">
                <button
                    onClick={togglePlay}
                    className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 transition-colors text-white font-medium py-2 px-4 rounded-lg flex-1 cursor-pointer"
                >
                    {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                    {isPlaying ? 'Pause' : 'Play'}
                </button>

                <div className="flex flex-col flex-1 gap-1">
                    <div className="flex justify-between">
                        <label className="text-zinc-400 text-xs font-medium">Speed</label>
                        <span className="text-zinc-300 text-xs">{speed.toFixed(1)}x</span>
                    </div>
                    <input
                        type="range"
                        min="0.1"
                        max="3"
                        step="0.1"
                        value={speed}
                        onChange={(e) => setSpeed(parseFloat(e.target.value))}
                        className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                </div>
            </div>
        </div>
    );
};
