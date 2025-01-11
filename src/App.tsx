// import { Environment, Line, OrbitControls, Plane, PointMaterial, Points, Reflector, } from '@react-three/drei';
// import { Canvas, useFrame, useThree } from '@react-three/fiber'
// import { Bloom, EffectComposer } from '@react-three/postprocessing';
// import { useEffect, useRef, useState } from 'react'
// import { toneMapping } from 'three/tsl';



// interface IPlane {
//   particlePositions: Float32Array
//   points: number[][]
// }


// const CameraController = () => {
//   const { camera } = useThree();
//   const [position, setPosition] = useState([0, 0, 25]); // Initial camera position
//   const activeKeys = useRef(new Set<string>()); // Track active keys

//   useEffect(() => {
//     const handleKeyDown = (event: KeyboardEvent) => {
//       activeKeys.current.add(event.key); // Add key to active keys
//     };

//     const handleKeyUp = (event: KeyboardEvent) => {
//       activeKeys.current.delete(event.key); // Remove key from active keys
//     };

//     window.addEventListener('keydown', handleKeyDown);
//     window.addEventListener('keyup', handleKeyUp);

//     return () => {
//       window.removeEventListener('keydown', handleKeyDown);
//       window.removeEventListener('keyup', handleKeyUp);
//     };
//   }, []);

//   useFrame(() => {
//     // Movement increment
//     const movementSpeed = 0.2;
//     let [x, y, z] = position;

//     // Process active keys
//     if (activeKeys.current.has('ArrowUp') || activeKeys.current.has('w')) {
//       z -= movementSpeed; // Move forward
//     }
//     if (activeKeys.current.has('ArrowDown') || activeKeys.current.has('s')) {
//       z += movementSpeed; // Move backward
//     }
//     if (activeKeys.current.has('ArrowLeft') || activeKeys.current.has('a')) {
//       x -= movementSpeed; // Move left
//     }
//     if (activeKeys.current.has('ArrowRight') || activeKeys.current.has('d')) {
//       x += movementSpeed; // Move right
//     }
//     if (activeKeys.current.has('Shift')) {
//       y -= movementSpeed; // Move down
//     }
//     if (activeKeys.current.has(' ')) {
//       y += movementSpeed; // Move up
//     }

//     // Update camera position and state
//     camera.position.set(x, y, z);
//     setPosition([x, y, z]);
//   });

//   return null;
// };




// const FlatPlane: React.FC<IPlane> = ({ particlePositions, points }) => {
//   const [newPoints, setNewPoints] = useState(points);
//   const particlesCount = particlePositions.length / 3;
//   const colors = new Float32Array(particlesCount * 3)
//   const particlesRef = useRef();




//   function float32ArrayToNumberArray(floatArray: Float32Array, chunkSize: number): number[][] {
//     const result: number[][] = [];
//     for (let i = 0; i < floatArray.length; i += chunkSize) {
//       result.push(Array.from(floatArray.slice(i, i + chunkSize)));
//     }
//     return result;
//   }

//   useFrame(() => {
//     if (!particlesRef.current) return;

//     const positions = particlesRef.current.geometry.attributes.position.array;

//     for (let i = 0; i < particlesCount; i++) {
//       const index = i * 3;
//       // positions[index] += Math.sin(Date.now() * 0.1 + i) * 0.045; // X
//       // positions[index + 1] += Math.sin(Date.now() * 0.1 + i) * 0.003; // Y
//       // positions[index + 2] += Math.sin(Date.now() * 0.1 + i * 0.5) * 0.015; // Z

//       // Random colors (normalized RGB)
//       const r = Math.random();
//       const g = Math.random();
//       const b = Math.random();

//       colors.set([r, g, b], i * 3);
//     }



//     particlesRef.current.geometry.attributes.position.needsUpdate = true;
//     const updatedCoordinates = float32ArrayToNumberArray(particlesRef.current.geometry.attributes.position.array, 3)
//     // console.log(updatedCoordinates)
//     setNewPoints(updatedCoordinates)
//     // console.log(particlesRef.current.geometry.attributes.position.array)
//   });


//   // const randomColor = () => {
//   //   return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
//   // }

//   // console.log(randomColor())
//   return (
//     <>

//       <Points ref={particlesRef} positions={particlePositions} stride={3}>
//         <bufferGeometry attach={"geometry"}>
//           <bufferAttribute attach={"attributes-position"} array={particlePositions} count={particlesCount} itemSize={3} />
//           <bufferAttribute attach={"attributes-color"} array={colors} count={particlesCount} itemSize={3} />
//         </bufferGeometry>
//         <PointMaterial opacity={1} size={0.1} sizeAttenuation vertexColors />
//         {/* <shaderMaterial
//           attach="material"
//           vertexShader={`
//           varying vec3 vColor;
//           void main() {
//             vColor = position;
//             gl_PointSize = 10.0;
//             gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
//           }
//         `}
//           fragmentShader={`
//           varying vec3 vColor;
//           void main() {
//             float dist = length(gl_PointCoord - vec2(0.5));
//             if (dist > 0.5) discard;
//             gl_FragColor = vec4(1.0, 0.6, 0.1, 1.0) * (1.0 - dist * 2.0);
//           }
//         `}
//           transparent
//         /> */}
//       </Points>
//       <LineBetweenPoints points={newPoints} />
//     </>

//   )
// }



// function App() {

//   const numHorizontalSegments = 50; // Number of segments along the vertical
//   const numVerticalSegments = 100; // Number of segments along the horizontal

//   // Generate points on a sphere
//   const particlesOnSphere = [];
//   for (let h = 0; h < numHorizontalSegments; h++) {
//     const angle1 = (h + 1) * Math.PI / (numHorizontalSegments + 1);

//     for (let v = 0; v <= numVerticalSegments; v++) {
//       const angle2 = v * (2 * Math.PI) / numVerticalSegments;

//       const x = Math.sin(angle1) * Math.cos(angle2) * 20; // X-coordinate
//       const y = Math.cos(angle1) * 20;                   // Y-coordinate
//       const z = Math.sin(angle1) * Math.sin(angle2) * 20; // Z-coordinate

//       particlesOnSphere.push([x, y, z]);
//     }
//   }

//   // Convert to Float32Array
//   const particlePositions = new Float32Array(particlesOnSphere.flat());


//   return (
//     <div className='w-full h-screen m-0  bg-black'>
//       <Canvas
//         className='' camera={{ position: [0, 0, 100], fov: 100, far: 20000, near: 0.1 }} >
//         <ambientLight intensity={0.1} />
//         <CameraController />
//         <spotLight position={[10, 100, 10]} angle={0.3} penumbra={1} castShadow />
//         {/* <Box /> */}
//         {/* <Particles /> */}
//         {/* <Environment preset="dawn" background/> */}
//         <FlatPlane particlePositions={particlePositions} points={particlesOnSphere} />
//         <EffectComposer>
//           <Bloom intensity={3} luminanceThreshold={0.1} luminanceSmoothing={0.9} />
//         </EffectComposer>
//         {/* <LineBetweenPoints points={particlesOnPlane} /> */}
//         <OrbitControls />
//         <ReflectiveFloor />

//       </Canvas>
//     </div>
//   )
// }

// export default App


// src/App.js
import React, { useRef } from 'react';
import { useFrame, Vector3 } from '@react-three/fiber';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { MeshStandardMaterial } from 'three';
import { Line, OrbitControls, Plane, Reflector, Text, Text3D } from '@react-three/drei';

interface ILine {
  points: Vector3[]
}


const LineBetweenPoints: React.FC<ILine> = ({ points }) => {

  return (
    <Line
      points={points}       // Array of points
      color="white"          // Line color
      lineWidth={1}         // Line width
      dashed={false}
      transparent={true}
      opacity={0.01}    // Solid line
    />
  );
}

const ReflectiveFloor = () => {
  return (
    <Reflector
      args={[500, 500]} // Width and height of the water surface
      mirror={0.9} // Reflection intensity
      mixBlur={0.1} // Blur amount
      mixStrength={0.9} // Reflection strength
      depthScale={5} // Depth effect
      position={[0, -5, 0]} // Position of the water
      rotation={[-Math.PI / 2, 0, 0]} // Rotate to make it horizontal
    >
      {(Material, props) => (
        <Material
          color="gray" // Water color
          opacity={0.2}
          metalness={0.1} // Metalness for a water-like effect
          roughness={0.1} // Roughness for a smoother surface
          {...props}
        />
      )}
    </Reflector>
  );
};


const AnimatedSphere = () => {
  const meshRef = useRef();
  const clock = new THREE.Clock();
  const displacementScale = 0.4;
  const [points, setPoints] = React.useState<Vector3[]>([]);

  useFrame(() => {
    const elapsedTime = clock.getElapsedTime();
    const geometry = meshRef.current.geometry;

    // Warp the sphere's vertices
    geometry.attributes.position.array.forEach((value, index) => {
      if (index % 3 === 0) { // x
        const distance = Math.sqrt(
          Math.pow(value, 2) +
          Math.pow(geometry.attributes.position.array[index + 1], 2) +
          Math.pow(geometry.attributes.position.array[index + 2], 2)
        );
        const wave = Math.sin(distance * 2 + elapsedTime * 3) * displacementScale;
        geometry.attributes.position.array[index] *= (5 + wave) / distance; // x
        // setPoints(...geometry.attributes.position.array)
        console.log(geometry.attributes.position.array)
      }

    });

    geometry.attributes.position.needsUpdate = true; // Update the vertices
    meshRef.current.rotation.y += 0.001; // Rotate the sphere
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[5, 32, 32]}  >
        <Text font='/fonts/SourGummy-VariableFont_wdth,wght.ttf' > Hello world  </Text>
      </sphereGeometry>
      <meshStandardMaterial color={"yellow"} metalness={0.4} roughness={0.3} />
      {/* <LineBetweenPoints points={points} /> */}
    </mesh>
  );
};



const App = () => {
  return (
    <Canvas camera={{ position: [0, 0, 15] }} style={{ height: '100vh', backgroundColor: 'black' }}>
      <ambientLight />
      <directionalLight position={[100, 100, 10]} />
      <AnimatedSphere />

      <Text color={"hotpink"} position={[0, 0, 10]} font='/fonts/SourGummy-VariableFont_wdth,wght.ttf' > Hello world  </Text>
      <ReflectiveFloor />
      <OrbitControls />
    </Canvas>
  );
};

export default App;
