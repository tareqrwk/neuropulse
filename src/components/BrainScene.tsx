import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { ActivityMap } from '../utils/activitySimulator';
import { rois, ROIName } from '../utils/roiPositions';

interface BrainSceneProps {
    activity: ActivityMap;
}

// Preload the model
useGLTF.preload('/models/brain/scene.gltf');

const BrainModel = () => {
    const { scene } = useGLTF('/models/brain/scene.gltf');

    // Clone the scene and adjust materials if necessary to make it look like a hologram or dark wireframe
    const clonedScene = useMemo(() => {
        const s = scene.clone();
        s.traverse((node) => {
            if ((node as THREE.Mesh).isMesh) {
                const mesh = node as THREE.Mesh;
                // Make the brain model look like a dark, semi-transparent material
                mesh.material = new THREE.MeshStandardMaterial({
                    color: '#1a1a24',
                    transparent: true,
                    opacity: 0.8,
                    roughness: 0.7,
                    metalness: 0.2,
                });
            }
        });
        return s;
    }, [scene]);

    return (
        <primitive
            object={clonedScene}
            position={[0, 0, 0]}
            scale={2}
        />
    );
};

// Component for a single glowing region
const ROIMarker = ({ value, position }: { value: number; position: [number, number, number] }) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const materialRef = useRef<THREE.MeshStandardMaterial>(null);

    useFrame(() => {
        if (materialRef.current) {
            // Interpolate color from blue (low) -> yellow (moderate) -> red (high)
            const lowColor = new THREE.Color('#3b82f6'); // blue
            const midColor = new THREE.Color('#eab308'); // yellow
            const highColor = new THREE.Color('#ef4444'); // red

            let targetColor = new THREE.Color();
            if (value < 0.5) {
                targetColor.lerpColors(lowColor, midColor, value * 2);
            } else {
                targetColor.lerpColors(midColor, highColor, (value - 0.5) * 2);
            }

            // Smoothly animate to the target color
            materialRef.current.color.lerp(targetColor, 0.1);
            materialRef.current.emissive.lerp(targetColor, 0.1);
            materialRef.current.emissiveIntensity = 0.5 + value * 2;
        }

        if (meshRef.current) {
            // Small pulsing animation based on activity
            const scaleBase = 0.4 + value * 0.4;
            meshRef.current.scale.lerp(new THREE.Vector3(scaleBase, scaleBase, scaleBase), 0.1);
        }
    });

    return (
        <mesh ref={meshRef} position={position}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial
                ref={materialRef}
                color="#3b82f6"
                emissive="#3b82f6"
                emissiveIntensity={0.5}
                transparent
                opacity={0.9}
            />
        </mesh>
    );
};

export const BrainScene: React.FC<BrainSceneProps> = ({ activity }) => {
    return (
        <div className="w-full h-full bg-zinc-950 rounded-xl overflow-hidden shadow-2xl relative border border-zinc-800">
            <Suspense fallback={
                <div className="absolute inset-0 flex items-center justify-center text-zinc-500 text-sm">
                    Initializing 3D Environment...
                </div>
            }>
                <Canvas camera={{ position: [10, 5, 15], fov: 45 }}>
                    <color attach="background" args={['#09090b']} />

                    <ambientLight intensity={0.5} />
                    <directionalLight position={[10, 10, 10]} intensity={1} />
                    <spotLight position={[-10, 10, -10]} intensity={0.8} color="#3b82f6" />

                    <BrainModel />

                    <group scale={2}>
                        {Object.entries(rois).map(([key, roi]) => (
                            <ROIMarker
                                key={key}
                                value={activity[key as ROIName]}
                                position={roi.position}
                            />
                        ))}
                    </group>

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
        </div>
    );
};
