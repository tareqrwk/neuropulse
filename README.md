# 🧠 NeuroPulse

### **Interactive Neural Propagation & Cognitive Signal Analysis**

NeuroPulse is a high-end, immersive web application designed for the visualization and analysis of complex neural activity. Combining cutting-edge 3D graphics with real-time data telemetry, it provides a "Research Workstation" environment for exploring cognitive propagation patterns.

---

## ✨ Key Features

### 🔭 **Immersive 3D Visualization**
- **Full-Screen Neural Mesh**: A high-fidelity 3D brain model powered by Three.js and GLSL shaders.
- **Real-Time Heatmaps**: Dynamic vertex-based activity projection using custom fragment shaders.
- **Interactive Depth**: Full camera control (Rotate/Zoom/Pan) with the ability to interact with the simulation layer.

### 📊 **Integrated Research Workstation**
- **3-Column Docked Layout**: A professional, structured interface for mission-critical analysis.
- **Persistent Sidebars**: Quick access to simulation parameters and regional activity insights.
- **Telemetry Console**: A dedicated bottom console for high-precision signal amplitude monitoring.

### 🧪 **Advanced Simulation Engine**
- **Scenario Tuning**: Toggle between different cognitive states: *Neural Focus*, *Alpha Waves*, and *Motor Output*.
- **Amplitude Gating**: Real-time filtering of neural signals based on activity intensity (All/Moderate/High).
- **Variable Clock Speed**: Adjust the simulation temporal scale from 0.1x to 3.0x.

---

## 🛠 Tech Stack

- **Framework**: [React 18](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **3D Engine**: [@react-three/fiber](https://github.com/pmndrs/react-three-fiber) + [Three.js](https://threejs.org/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/neuropulse.git
   cd neuropulse
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

---

## 🏗 Project Architecture

```text
src/
├── components/         # Reusable UI & 3D components
│   ├── BrainScene.tsx  # Core 3D Brain & R3F Logic
│   ├── ControlPanel.tsx# Simulation HUD Controls
│   └── ...
├── hooks/              # Custom React Hooks
│   └── useNeuralActivity.ts # State machine for simulation
├── utils/              # Math & Simulation Helpers
│   ├── activitySimulator.ts # Neural logic engine
│   └── roiPositions.ts # Anatomical ROI coordinates
└── pages/              # Main application views
    ├── Landing.tsx     # Cinematic entry point
    └── Simulator.tsx   # Professional workstation
```

---

## 📜 License
MIT License - Copyright (c) 2026 NeuroPulse Project.

---

---

## Credit
3D Brain Model: This work is based on "Brain Areas" (https://sketchfab.com/3d-models/brain-areas-d64608a3978b47d8a39c5a15795ca8c4) by Versal (https://sketchfab.com/versal) licensed under CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)

---

*Designed for the future of neuro-analysis and educational purposes.*
