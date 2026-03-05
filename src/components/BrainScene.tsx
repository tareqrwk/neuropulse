import React, { useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { ActivityMap } from '../utils/activitySimulator';
import { rois, ROIName } from '../utils/roiPositions';

interface BrainSceneProps {
    activity: ActivityMap;
    filter: 'all' | 'moderate' | 'high';
}

// Preload the model
useGLTF.preload('/models/brain/scene.gltf');

const BrainModel = ({ activity, filter }: { activity: ActivityMap, filter: string }) => {
    const { scene } = useGLTF('/models/brain/scene.gltf');

    const customMaterial = useMemo(() => {
        const mat = new THREE.MeshStandardMaterial({
            color: '#1a1a24',
            transparent: true,
            opacity: 0.9,
            roughness: 0.4,
            metalness: 0.6,
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
                    float radius = 4.0;
                    
                    // Base soft glow
                    float baseIntensity = smoothstep(radius, 0.0, dist);
                    
                    // Outward moving wave ripple: sin(distance * freq - time * speed)
                    float wave = sin(dist * 8.0 - uTime * 5.0) * 0.5 + 0.5;
                    
                    // Multiply base glow by the wave and the actual ROI activity level
                    float intensity = baseIntensity * wave * uRoiIntensities[i];
                    
                    heatmapGlow += uRoiColors[i] * intensity;
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

                // Scale positions to align with the 4.5 scaled brain
                uniforms.uRoiPositions.value[i].set(pos[0] * 5.0, pos[1] * 5.0, pos[2] * 5.0);

                const low = new THREE.Color('#3b82f6');
                const mid = new THREE.Color('#eab308');
                const high = new THREE.Color('#ef4444');

                let targetColor = new THREE.Color();
                if (value < 0.5) targetColor.lerpColors(low, mid, value * 2.0);
                else targetColor.lerpColors(mid, high, (value - 0.5) * 2.0);

                uniforms.uRoiColors.value[i].copy(targetColor);

                // Apply filter threshold
                let intensity = value * 3.0;
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
        <primitive
            object={clonedScene}
            position={[0, 0, 0]}
            scale={4.5}
        />
    );
};

export const BrainScene: React.FC<BrainSceneProps> = ({ activity, filter }) => {
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

                    <BrainModel activity={activity} filter={filter} />

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

            {/* Overlay label */}
            <div className="absolute top-4 left-4 bg-zinc-900/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-zinc-800 pointer-events-none">
                <span className="text-zinc-300 font-medium text-sm">3D Brain Model</span>
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 right-4 bg-zinc-900/60 backdrop-blur-md px-4 py-3 rounded-xl border border-zinc-800 pointer-events-none shadow-xl">
                <div className="text-zinc-400 font-medium text-[10px] mb-3 uppercase tracking-wider">Activity Level</div>
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
                        <span className="text-zinc-300 text-xs font-medium">High</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.8)]"></div>
                        <span className="text-zinc-300 text-xs font-medium">Moderate</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
                        <span className="text-zinc-300 text-xs font-medium">Low</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
