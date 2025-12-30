
import React, { useRef, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { useScroll, Stars, Html } from '@react-three/drei';
import * as THREE from 'three';
import { BANGALORE_COORDS } from '../types';

const EARTH_RADIUS = 2;

export const Earth: React.FC = () => {
  const earthRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const scroll = useScroll();

  const [colorMap, bumpMap, specularMap, cloudsMap] = useLoader(THREE.TextureLoader, [
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png',
  ]);

  const convertLatLngToVector3 = (lat: number, lng: number, radius: number) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    return new THREE.Vector3(x, y, z);
  };

  const bangalorePos = useMemo(() => 
    convertLatLngToVector3(BANGALORE_COORDS.lat, BANGALORE_COORDS.lng, EARTH_RADIUS), 
  []);

  useFrame((state, delta) => {
    if (!earthRef.current) return;

    const offset = scroll.offset; // 0 to 1
    const isMobile = state.viewport.width < 5;

    // Dramatic zoom: Starts far away, ends very close to the surface
    const startZoom = isMobile ? 12 : 9;
    const endZoom = 2.1; 
    const zoomDist = THREE.MathUtils.lerp(startZoom, endZoom, offset);
    
    state.camera.position.set(0, 0, zoomDist);
    state.camera.lookAt(0, 0, 0);

    // Precise rotation to bring Bangalore to the absolute center of the view
    const targetRotY = -(BANGALORE_COORDS.lng + 90) * (Math.PI / 180);
    const targetRotX = (BANGALORE_COORDS.lat) * (Math.PI / 180);

    const idleSpeed = 0.02;
    const idleRotation = state.clock.getElapsedTime() * idleSpeed;

    // Complete rotation by 65% scroll
    const rotationT = Math.min(offset / 0.65, 1); 
    
    earthRef.current.rotation.y = THREE.MathUtils.lerp(idleRotation % (Math.PI * 2), targetRotY, rotationT);
    earthRef.current.rotation.x = THREE.MathUtils.lerp(0, targetRotX, rotationT);

    if (atmosphereRef.current) {
      const mat = atmosphereRef.current.material as THREE.MeshPhongMaterial;
      mat.opacity = THREE.MathUtils.lerp(0.15, 0, offset);
    }
  });

  return (
    <>
      <Stars radius={300} depth={50} count={2000} factor={4} saturation={0} fade speed={0.1} />
      
      <ambientLight intensity={0.8} />
      <pointLight position={[10, 10, 10]} intensity={3} />
      <directionalLight position={[5, 3, 5]} intensity={2} />

      <mesh ref={earthRef}>
        <sphereGeometry args={[EARTH_RADIUS, 64, 64]} />
        <meshPhongMaterial
          map={colorMap}
          bumpMap={bumpMap}
          bumpScale={0.15}
          specularMap={specularMap}
          specular={new THREE.Color('#333')}
          shininess={10}
        />
        
        {/* TEXT LABEL FOR BENGALURU - POSITIONED ON TOP */}
        <group position={bangalorePos}>
          {scroll.offset > 0.45 && (
            <Html 
              position={[0, 0, 0]} 
              center 
              // zIndexRange ensures it stays on top of the Earth sphere
              zIndexRange={[1000, 0]}
              style={{ pointerEvents: 'none' }}
            >
              <div 
                className="flex flex-col items-center select-none transition-opacity duration-500"
                style={{ opacity: scroll.offset > 0.5 ? 1 : 0 }}
              >
                <div className="flex flex-col items-center">
                  <span 
                    className="text-red-600 font-orbitron font-bold uppercase tracking-[0.1em]"
                    style={{ fontSize: '20px' }}
                  >
                    BENGALURU
                  </span>
                  {/* Vertical connector line - simplified */}
                  <div className="w-[1px] h-16 bg-red-600 mt-2 shadow-[0_0_8px_red]"></div>
                </div>
              </div>
            </Html>
          )}
        </group>
      </mesh>

      {/* Cloud Layer */}
      <mesh scale={[1.005, 1.005, 1.005]}>
        <sphereGeometry args={[EARTH_RADIUS, 64, 64]} />
        <meshPhongMaterial
          map={cloudsMap}
          transparent
          opacity={0.3}
          depthWrite={false}
          color="#ffffff"
        />
      </mesh>

      {/* Atmospheric Glow */}
      <mesh ref={atmosphereRef} scale={[1.03, 1.03, 1.03]}>
        <sphereGeometry args={[EARTH_RADIUS, 64, 64]} />
        <meshPhongMaterial
          color="#ffffff"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </>
  );
};

function isMobileDevice() {
  return typeof window !== 'undefined' && window.innerWidth < 768;
}
