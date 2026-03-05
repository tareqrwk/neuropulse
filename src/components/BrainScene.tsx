import React, { useMemo, Suspense } from 'react';
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

const BrainModel = ({ activity }: { activity: ActivityMap }) => {
    const { scene } = useGLTF('/models/brain/scene.gltf');

    const customMaterial = useMemo(() => {
        const mat = new THREE.MeshStandardMaterial({
            color: '#1a1a24',
            transparent: true,
            opacity: 0.9,
            roughness: 0.6,
            metalness: 0.3,
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
                varying vec3 vWorldPosition;
                ${shader.fragmentShader}
            `.replace(
                `#include <emissivemap_fragment>`,
                `
                #include <emissivemap_fragment>
                vec3 heatmapGlow = vec3(0.0);
                for(int i = 0; i < 6; i++) {
                    float dist = distance(vWorldPosition, uRoiPositions[i]);
                    float radius = 3.5;
                    float intensity = smoothstep(radius, 0.0, dist) * uRoiIntensities[i];
                    heatmapGlow += uRoiColors[i] * intensity;
                }
                totalEmissiveRadiance += heatmapGlow;
                `
            );

            mat.userData.shader = shader;
        };

        return mat;
    }, []);

    useFrame(() => {
        if (customMaterial.userData.shader) {
            const uniforms = customMaterial.userData.shader.uniforms;
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
                uniforms.uRoiIntensities.value[i] = value * 3.0;
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

                    <BrainModel activity={activity} />

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
