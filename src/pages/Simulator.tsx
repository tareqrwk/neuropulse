import { useNeuralActivity } from '../hooks/useNeuralActivity';
import { ControlPanel } from '../components/ControlPanel';
import { ActivityChart } from '../components/ActivityChart';
import { ActiveRegions } from '../components/ActiveRegions';
import { BrainScene } from '../components/BrainScene';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function Simulator() {
    const {
        activity,
        scenario,
        setScenario,
        isPlaying,
        togglePlay,
        speed,
        setSpeed,
        history,
        activityFilter,
        setActivityFilter
    } = useNeuralActivity();

    return (
        <div className="min-h-screen bg-zinc-950 text-slate-100 flex flex-col font-sans selection:bg-blue-500/30 p-6">

            {/* Header */}
            <header className="mb-6 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                    <Link
                        to="/"
                        className="p-2 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all shadow-lg"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                            NeuroPulse Simulator
                        </h1>
                        <p className="text-zinc-400 text-sm mt-1">Interactive Neural Propagation Analysis</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 bg-zinc-900/50 px-3 py-1.5 rounded-full border border-zinc-800">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-xs font-medium text-zinc-300 tracking-wide uppercase">System Online</span>
                </div>
            </header>

            {/* Main Layout */}
            <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">

                {/* Left Panel: Controls and Data */}
                <section className="lg:col-span-4 flex flex-col gap-6 h-full">
                    <ControlPanel
                        scenario={scenario}
                        setScenario={setScenario}
                        isPlaying={isPlaying}
                        togglePlay={togglePlay}
                        speed={speed}
                        setSpeed={setSpeed}
                        activityFilter={activityFilter}
                        setActivityFilter={setActivityFilter}
                    />
                    <ActivityChart history={history} />
                    <ActiveRegions activity={activity} filter={activityFilter} />
                </section>

                {/* Right Panel: 3D Visualization */}
                <section className="lg:col-span-8 h-[500px] lg:h-full min-h-[500px] relative rounded-xl ring-1 ring-zinc-800/50">
                    <BrainScene activity={activity} filter={activityFilter} />
                </section>

            </main>

        </div>
    );
}
