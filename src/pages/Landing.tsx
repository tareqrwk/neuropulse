import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Brain, ChevronRight, Github } from 'lucide-react';
import { BrainScene } from '../components/BrainScene';
import { useNeuralActivity } from '../hooks/useNeuralActivity';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.3,
            delayChildren: 0.5,
        },
    },
};

const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] }
    },
};

export default function Landing() {
    const { activity, activityFilter } = useNeuralActivity();

    return (
        <div className="relative min-h-screen bg-black text-white font-sans overflow-hidden selection:bg-blue-500/30">

            {/* Immersive 3D Background */}
            <div className="fixed inset-0 z-0 opacity-60 scale-110 md:scale-100">
                <BrainScene
                    activity={activity}
                    filter={activityFilter}
                    showUI={false}
                />
                {/* Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black pointer-events-none"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black pointer-events-none"></div>
            </div>

            {/* Navbar - Ultra Thin */}
            <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-10 py-8 pointer-events-none">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="flex items-center gap-3 pointer-events-auto"
                >
                    <Brain size={20} className="text-blue-500" />
                    <span className="text-sm font-black uppercase tracking-[0.4em] text-white/80">NeuroPulse</span>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="flex items-center gap-8 pointer-events-auto"
                >
                    <a href="https://github.com/tareqrwk/neuropulse" target="_blank" rel="noreferrer" className="text-white/40 hover:text-white transition-colors">
                        <Github size={18} />
                    </a>
                </motion.div>
            </nav>

            {/* Hero Content */}
            <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="max-w-4xl"
                >
                    <motion.h1
                        variants={itemVariants}
                        className="text-[12vw] md:text-[8rem] font-black tracking-tighter leading-[0.8] mb-12 mix-blend-difference"
                    >
                        DECODE <br />
                        <span className="text-blue-500">THE PULSE.</span>
                    </motion.h1>

                    <motion.p
                        variants={itemVariants}
                        className="text-white/40 text-lg md:text-xl font-medium tracking-wide max-w-xl mx-auto mb-16 leading-relaxed"
                    >
                        A high-fidelity immersive workspace for neural propagation mapping and cognitive signal analysis.
                    </motion.p>

                    <motion.div variants={itemVariants}>
                        <Link
                            to="/simulator"
                            className="group relative inline-flex items-center gap-4 px-12 py-5 bg-white text-black font-black uppercase tracking-[0.2em] text-[10px] rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.2)]"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                Enter Simulation <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </span>
                            <div className="absolute inset-0 bg-blue-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                        </Link>
                    </motion.div>
                </motion.div>
            </main>

            {/* Footer - Minimal */}
            <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between px-10 py-10 pointer-events-none opacity-20">
                <div className="text-[10px] font-black uppercase tracking-widest text-white/50">Clinical Grade Visualization</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-white/50">v1.2.0 Open Source</div>
            </div>

        </div>
    );
}
