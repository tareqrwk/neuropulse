import React, { useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, Html } from '@react-three/drei';
import * as THREE from 'three';
import { ActivityMap } from '../utils/activitySimulator';
import { rois, ROIName } from '../utils/roiPositions';

interface BrainSceneProps {
    activity: ActivityMap;
    filter: 'all' | 'moderate' | 'high';
    showUI?: boolean;
}

const NeuralHUD = ({ activity }: { activity: ActivityMap }) => {
    const roiKeys = Object.keys(rois) as ROIName[];

    return (
        <Html fullscreen pointerEvents="none">
            <div className="absolute inset-0 hidden md:flex flex-col md:flex-row p-4 md:p-8 pointer-events-none select-none overflow-hidden">
                {/* Left Side / Top HUD */}
                <div className="flex flex-row md:flex-col gap-3 md:gap-6 w-full md:w-64 pointer-events-auto overflow-x-auto md:overflow-visible pb-4 md:pb-0 scrollbar-hide">
                    {roiKeys.slice(0, 3).map((key) => {
                        const val = activity[key] || 0;
                        return (
                            <div key={key} className="flex-shrink-0 w-[140px] md:w-full group relative">
                                <div className={`
                                    p-2 md:p-3 rounded-lg border backdrop-blur-md transition-all duration-500
                                    ${val > 0.7 ? 'bg-red-500/10 border-red-500/30' : val > 0.3 ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-zinc-900/40 border-zinc-800'}
                                `}>
                                    <div className="flex justify-between items-end mb-1 md:mb-1.5">
                                        <span className="text-[8px] md:text-[10px] uppercase tracking-[0.1em] md:tracking-[0.2em] font-bold text-zinc-500 group-hover:text-zinc-300">
                                            {rois[key].label}
                                        </span>
                                        <span className={`text-[10px] md:text-xs font-mono ${val > 0.7 ? 'text-red-400' : val > 0.3 ? 'text-yellow-400' : 'text-blue-400'}`}>
                                            {(val * 100).toFixed(0)}%
                                        </span>
                                    </div>
                                    <div className="h-0.5 md:h-1 bg-zinc-800/50 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full transition-all duration-700 ease-out ${val > 0.7 ? 'bg-red-500' : val > 0.3 ? 'bg-yellow-500' : 'bg-blue-500'}`}
                                            style={{ width: `${val * 100}%` }}
                                        />
                                    </div>
                                    {val > 0.85 && (
                                        <div className="absolute -left-1 top-0 bottom-0 w-0.5 bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,1)]" />
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="flex-1 min-h-[100px]" />

                {/* Right Side / Bottom HUD */}
                <div className="flex flex-row md:flex-col gap-3 md:gap-6 w-full md:w-64 items-end pointer-events-auto overflow-x-auto md:overflow-visible pt-4 md:pt-0 scrollbar-hide">
                    {roiKeys.slice(3).map((key) => {
                        const val = activity[key] || 0;
                        return (
                            <div key={key} className="flex-shrink-0 w-[140px] md:w-full group relative">
                                <div className={`
                                    p-2 md:p-3 rounded-lg border backdrop-blur-md transition-all duration-500
                                    ${val > 0.7 ? 'bg-red-500/10 border-red-500/30' : val > 0.3 ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-zinc-900/40 border-zinc-800'}
                                `}>
                                    <div className="flex justify-between items-end mb-1 md:mb-1.5">
                                        <span className={`text-[10px] md:text-xs font-mono ${val > 0.7 ? 'text-red-400' : val > 0.3 ? 'text-yellow-400' : 'text-blue-400'}`}>
                                            {(val * 100).toFixed(0)}%
                                        </span>
                                        <span className="text-[8px] md:text-[10px] uppercase tracking-[0.1em] md:tracking-[0.2em] font-bold text-zinc-500 group-hover:text-zinc-300">
                                            {rois[key].label}
                                        </span>
                                    </div>
                                    <div className="h-0.5 md:h-1 bg-zinc-800/50 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full transition-all duration-700 ease-out ml-auto ${val > 0.7 ? 'bg-red-500' : val > 0.3 ? 'bg-yellow-500' : 'bg-blue-500'}`}
                                            style={{ width: `${val * 100}%` }}
                                        />
                                    </div>
                                    {val > 0.85 && (
                                        <div className="absolute -right-1 top-0 bottom-0 w-0.5 bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,1)]" />
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </Html>
    );
};

const BrainModel = ({ activity, filter, showHUD = true }: { activity: ActivityMap, filter: string, showHUD?: boolean }) => {
    const { scene } = useGLTF('/models/brain/scene.gltf');

    const customMaterial = useMemo(() => {
        const mat = new THREE.MeshStandardMaterial({
            color: '#0a0a0f',
            transparent: true,
            opacity: 0.95,
            roughness: 0.2,
            metalness: 0.9,
        });

        mat.onBeforeCompile = (shader) => {
            shader.uniforms.uRoiPositions = {
                value: [
                    new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(),
                    new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()
                ]
            };
            shader.uniforms.uRoiColors = {
                value: [
                    new THREE.Color(), new THREE.Color(), new THREE.Color(),
                    new THREE.Color(), new THREE.Color(), new THREE.Color()
                ]
            };
            shader.uniforms.uRoiIntensities = { value: [0, 0, 0, 0, 0, 0] };
            shader.uniforms.uTime = { value: 0 };

            shader.vertexShader = `
                varying vec3 vWorldPosition;
                ${shader.vertexShader}
            `.replace(
                `#include <worldpos_vertex>`,
                `
                #include <worldpos_vertex>
                vWorldPosition = (modelMatrix * vec4(transformed, 1.0)).xyz;
                `
            );

            shader.fragmentShader = `
                uniform vec3 uRoiPositions[6];
                uniform vec3 uRoiColors[6];
                uniform float uRoiIntensities[6];
                uniform float uTime;
                varying vec3 vWorldPosition;
                ${shader.fragmentShader}
            `.replace(
                `#include <emissivemap_fragment>`,
                `
                #include <emissivemap_fragment>
                vec3 heatmapGlow = vec3(0.0);
                for(int i = 0; i < 6; i++) {
                    float dist = distance(vWorldPosition, uRoiPositions[i]);
                    float radius = 4.5;
                    
                    // Smoother, biometric exponential decay
                    float baseIntensity = exp(-pow(dist / radius, 2.0) * 2.0);
                    
                    // Subtle organic pulse
                    float pulse = 0.9 + 0.1 * sin(uTime * 1.5 + float(i));
                    
                    // Soft wave ripple
                    float wave = 0.8 + 0.2 * sin(dist * 2.0 - uTime * 2.5);
                    
                    float intensity = baseIntensity * pulse * wave * uRoiIntensities[i];
                    
                    heatmapGlow += uRoiColors[i] * intensity * 1.2;
                }
                totalEmissiveRadiance += heatmapGlow;
                `
            );

            mat.userData.shader = shader;
        };

        return mat;
    }, []);

    useFrame(({ clock }) => {
        if (customMaterial.userData.shader) {
            const uniforms = customMaterial.userData.shader.uniforms;
            uniforms.uTime.value = clock.getElapsedTime();

            const roiKeys = Object.keys(rois) as ROIName[];

            for (let i = 0; i < roiKeys.length; i++) {
                const key = roiKeys[i];
                const value = Math.max(0, activity[key]);
                const pos = rois[key].position;

                // Standard scaling for heatmap coordinates
                uniforms.uRoiPositions.value[i].set(pos[0] * 5.0, pos[1] * 5.0, pos[2] * 5.0);

                const low = new THREE.Color('#3b82f6');
                const mid = new THREE.Color('#eab308');
                const high = new THREE.Color('#ef4444');

                let targetColor = new THREE.Color();
                if (value < 0.5) targetColor.lerpColors(low, mid, value * 2.0);
                else targetColor.lerpColors(mid, high, (value - 0.5) * 2.0);

                uniforms.uRoiColors.value[i].copy(targetColor);

                let intensity = value * 2.5;
                if (filter === 'moderate' && value < 0.3) intensity = 0;
                if (filter === 'high' && value < 0.7) intensity = 0;

                uniforms.uRoiIntensities.value[i] = intensity;
            }
        }
    });

    const clonedScene = useMemo(() => {
        const s = scene.clone();
        s.traverse((node) => {
            if ((node as THREE.Mesh).isMesh) {
                (node as THREE.Mesh).material = customMaterial;
            }
        });
        return s;
    }, [scene, customMaterial]);

    return (
        <>
            <primitive object={clonedScene} position={[0, 0, 0]} scale={4.5} />
            {showHUD && <NeuralHUD activity={activity} />}
        </>
    );
};

export const BrainScene: React.FC<BrainSceneProps> = ({ activity, filter, showUI = true }) => {
    return (
        <div className="w-full h-full bg-zinc-950 rounded-xl overflow-hidden shadow-2xl relative border border-zinc-800">
            <Suspense fallback={
                <div className="absolute inset-0 flex items-center justify-center text-zinc-500 text-sm">
                    Initializing 3D Environment...
                </div>
            }>
                <Canvas camera={{ position: [10, 5, 15], fov: 45 }}>
                    <color attach="background" args={['#09090b']} />

                    <ambientLight intensity={0.4} />

                    {/* Key light (front-ish depth) */}
                    <directionalLight position={[5, 5, 5]} intensity={2.5} />

                    {/* Fill light (soft side) */}
                    <directionalLight position={[-5, -2, 2]} intensity={1.5} color="#3b82f6" />

                    {/* Rim light (strong from behind) */}
                    <spotLight position={[0, 5, -10]} intensity={8.0} color="#60a5fa" penumbra={0.5} distance={100} />

                    <BrainModel activity={activity} filter={filter} showHUD={showUI} />

                    <OrbitControls
                        enableZoom={true}
                        enablePan={false}
                        autoRotate={true}
                        autoRotateSpeed={0.5}
                        maxPolarAngle={Math.PI / 1.5}
                        minPolarAngle={Math.PI / 4}
                    />

                    <Environment preset="city" />
                </Canvas>
            </Suspense>

            {showUI && (
                <>
                    {/* Legend - Responsive scaling */}
                    <div className="absolute bottom-4 right-4 bg-zinc-900/60 backdrop-blur-md px-3 py-2 md:px-4 md:py-3 rounded-xl border border-zinc-800 pointer-events-none shadow-xl scale-90 md:scale-100 origin-bottom-right hidden md:block">
                        <div className="text-zinc-400 font-medium text-[8px] md:text-[10px] mb-2 md:mb-3 uppercase tracking-wider">Activity Level</div>
                        <div className="flex flex-col gap-1.5 md:gap-2">
                            <div className="flex items-center gap-2 md:gap-2.5">
                                <div className="w-2 md:w-2.5 h-2 md:h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
                                <span className="text-zinc-300 text-[10px] md:text-xs font-medium">High</span>
                            </div>
                            <div className="flex items-center gap-2 md:gap-2.5">
                                <div className="w-2 md:w-2.5 h-2 md:h-2.5 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.8)]"></div>
                                <span className="text-zinc-300 text-[10px] md:text-xs font-medium">Moderate</span>
                            </div>
                            <div className="flex items-center gap-2 md:gap-2.5">
                                <div className="w-2 md:w-2.5 h-2 md:h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
                                <span className="text-zinc-300 text-[10px] md:text-xs font-medium">Low</span>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
