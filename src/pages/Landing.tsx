import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Brain,
    ChevronRight,
    Github,
    Zap,
    Activity,
    Monitor,
    Cpu,
    Layers,
    Globe,
    Code2,
    Database
} from 'lucide-react';
import { BrainScene } from '../components/BrainScene';
import { useNeuralActivity } from '../hooks/useNeuralActivity';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.3,
        },
    },
};

const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    },
};

const howItWorks = [
    {
        title: "Simulated Neural Activity",
        description: "Neural signals propagate between brain regions using a simplified connectivity model.",
        icon: <Zap className="text-yellow-500" size={24} />
    },
    {
        title: "Interactive 3D Brain",
        description: "Activity is mapped to a GLTF brain model using color intensity and glow.",
        icon: <Brain className="text-blue-500" size={24} />
    },
    {
        title: "Real-Time Signal Visualization",
        description: "Charts display neural amplitude changes across regions.",
        icon: <Activity className="text-emerald-500" size={24} />
    },
    {
        title: "Scenario Simulation",
        description: "Switch between Focus, Relax, and Motor modes to see different activity patterns.",
        icon: <Monitor className="text-purple-500" size={24} />
    }
];

const features = [
    {
        title: "Interactive Brain Visualization",
        description: "Real-time neural activity mapped to a 3D brain model."
    },
    {
        title: "Signal Propagation Simulation",
        description: "Activity spreads across connected brain regions."
    },
    {
        title: "Scenario Modes",
        description: "Focus, Relax, and Motor cognitive states."
    },
    {
        title: "Live Neural Graphs",
        description: "Real-time amplitude tracking across regions."
    }
];

const techStack = [
    { name: "React", category: "Framework", icon: <Code2 size={18} className="text-blue-400" /> },
    { name: "Vite", category: "Build Tool", icon: <Zap size={18} className="text-yellow-400" /> },
    { name: "TypeScript", category: "Language", icon: <Database size={18} className="text-blue-500" /> },
    { name: "Three.js / R3F", category: "3D Graphics", icon: <Globe size={18} className="text-purple-400" /> },
    { name: "Framer Motion", category: "Animations", icon: <Monitor size={18} className="text-pink-400" /> },
    { name: "TailwindCSS", category: "Styling", icon: <Layers size={18} className="text-teal-400" /> },
    { name: "Recharts", category: "Data Viz", icon: <Activity size={18} className="text-emerald-400" /> }
];

export default function Landing() {
    const { activity, activityFilter } = useNeuralActivity();

    return (
        <div className="relative min-h-screen bg-black text-white font-sans selection:bg-blue-500/30">

            {/* Immersive 3D Background */}
            <div className="fixed inset-0 z-0 opacity-60 scale-110 md:scale-100">
                <BrainScene
                    activity={activity}
                    filter={activityFilter}
                    showUI={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black pointer-events-none"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black pointer-events-none"></div>
            </div>

            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-6 md:py-8 pointer-events-none">
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
            <main className="relative z-10">
                <section className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
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
                </section>

                {/* How It Works Section */}
                <section className="py-32 px-6 bg-gradient-to-b from-transparent to-zinc-950/80 backdrop-blur-sm">
                    <div className="max-w-7xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-24"
                        >
                            <h2 className="text-sm font-black uppercase tracking-[0.5em] text-blue-500 mb-4">Functional Overview</h2>
                            <h3 className="text-4xl md:text-6xl font-black tracking-tighter uppercase">How NeuroPulse Works</h3>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {howItWorks.map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="p-8 rounded-2xl bg-zinc-900/40 border border-white/5 backdrop-blur-md hover:bg-zinc-800/60 transition-all group"
                                >
                                    <div className="mb-6 p-4 rounded-xl bg-white/5 w-fit group-hover:scale-110 transition-transform">
                                        {item.icon}
                                    </div>
                                    <h4 className="text-lg font-bold mb-4 tracking-tight">{item.title}</h4>
                                    <p className="text-sm text-white/40 leading-relaxed font-medium">
                                        {item.description}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features & Tech Stack */}
                <section className="py-32 px-6 bg-zinc-950/80">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24">
                        {/* Features */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-sm font-black uppercase tracking-[0.5em] text-blue-500 mb-6">Core Capabilities</h2>
                            <h3 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-12">Engine Features</h3>
                            <div className="space-y-8">
                                {features.map((f, i) => (
                                    <div key={i} className="flex gap-6 items-start">
                                        <div className="mt-1 p-1 bg-blue-500 rounded-full shrink-0 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                                        <div>
                                            <h4 className="font-bold text-white mb-2">{f.title}</h4>
                                            <p className="text-sm text-white/40 font-medium">{f.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Tech Stack */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-sm font-black uppercase tracking-[0.5em] text-blue-500 mb-6">Environment</h2>
                            <h3 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-12">Built With</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {techStack.map((tech, i) => (
                                    <motion.div
                                        key={i}
                                        whileHover={{ y: -5, backgroundColor: "rgba(255,255,255,0.08)" }}
                                        className="p-5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-5 transition-all group cursor-default"
                                    >
                                        <div className="p-3 rounded-xl bg-black/40 border border-white/5 group-hover:border-blue-500/30 transition-colors shadow-inner">
                                            {tech.icon}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 group-hover:text-blue-500/80 transition-colors">
                                                {tech.category}
                                            </span>
                                            <span className="text-base font-bold tracking-tight text-white/90">
                                                {tech.name}
                                            </span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* About the Project */}
                <section className="py-32 px-6 border-t border-white/5 bg-black">
                    <div className="max-w-3xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-sm font-black uppercase tracking-[0.5em] text-blue-500 mb-8">About the Project</h2>
                            <p className="text-xl md:text-2xl font-medium tracking-tight text-white/80 leading-relaxed mb-8">
                                NeuroPulse is an experimental web-based simulation designed to visualize neural activity propagation across brain regions.
                            </p>
                            <p className="text-lg text-white/40 font-medium leading-relaxed italic">
                                The goal of the project is to explore how interactive visualization and 3D graphics can help make complex neural signals more intuitive.
                            </p>
                        </motion.div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="relative z-10 py-12 px-10 border-t border-white/5 bg-black flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-2">
                    <Brain size={16} className="text-blue-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/50">NeuroPulse System v1.0.0</span>
                </div>
                <div className="text-[10px] font-black uppercase tracking-widest text-white/20">
                    © 2026 Experimental Research Infrastructure
                </div>
            </footer>

            {/* Background Grain Effect */}
            <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] mix-blend-overlay">
                <svg width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'>
                    <filter id='noiseFilter'>
                        <feTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch' />
                    </filter>
                    <rect width='100%' height='100%' filter='url(#noiseFilter)' />
                </svg>
            </div>

        </div>
    );
}
