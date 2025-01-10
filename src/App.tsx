import { Environment, Line, OrbitControls, Plane, PointMaterial, Points, Reflector, } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber'
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { useRef, useState } from 'react'
import { toneMapping } from 'three/tsl';



interface IPlane {
  particlePositions: Float32Array
  points: number[][]
}

interface ILine {
  points: number[][]
}



const LineBetweenPoints: React.FC<ILine> = ({ points }) => {

  return (
    <Line
      points={points}       // Array of points
      color="white"          // Line color
      lineWidth={1}         // Line width
      dashed={true}
      transparent={true}
      opacity={0.1}    // Solid line
    />
  );
}


const ReflectiveFloor = () => {
  return (
    <Plane position={[0, -50, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <Reflector
        resolution={1440}
        args={[1000, 1000]} // Plane size
        mirror={10} // Reflection intensity
        mixBlur={0.5} // Blur amount
        mixStrength={1} // Reflection strength
        depthScale={2} // Depth effect
      >
        {(Material, props) => (
          <Material
            color="white"
            metalness={0.1}
            roughness={0.9}
            {...props}
          />
        )}
      </Reflector>
    </Plane>
  );
};


const FlatPlane: React.FC<IPlane> = ({ particlePositions, points }) => {
  const [newPoints, setNewPoints] = useState(points);
  const particlesCount = particlePositions.length / 3;
  const colors = new Float32Array(particlesCount * 3)
  const particlesRef = useRef();




  function float32ArrayToNumberArray(floatArray: Float32Array, chunkSize: number): number[][] {
    const result: number[][] = [];
    for (let i = 0; i < floatArray.length; i += chunkSize) {
      result.push(Array.from(floatArray.slice(i, i + chunkSize)));
    }
    return result;
  }

  useFrame(() => {
    if (!particlesRef.current) return;

    const positions = particlesRef.current.geometry.attributes.position.array;

    for (let i = 0; i < particlesCount; i++) {
      const index = i * 3;
      positions[index] += Math.sin(Date.now() * 0.0001 + i) * 0.045; // X
      positions[index + 1] += Math.sin(Date.now() * 0.0001 + i) * 0.003; // Y
      positions[index + 2] += Math.sin(Date.now() * 0.00001 + i * 0.5) * 0.015; // Z

      // Random colors (normalized RGB)
      const r = Math.random();
      const g = Math.random();
      const b = Math.random();

      colors.set([r, g, b], i * 3);
    }



    particlesRef.current.geometry.attributes.position.needsUpdate = true;
    const updatedCoordinates = float32ArrayToNumberArray(particlesRef.current.geometry.attributes.position.array, 3)
    // console.log(updatedCoordinates)
    setNewPoints(updatedCoordinates)
    // console.log(particlesRef.current.geometry.attributes.position.array)
  });


  // const randomColor = () => {
  //   return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
  // }

  // console.log(randomColor())
  return (
    <>

      <Points ref={particlesRef} positions={particlePositions} stride={3}>
        <bufferGeometry attach={"geometry"}>
          <bufferAttribute attach={"attributes-position"} array={particlePositions} count={particlesCount} itemSize={3} />
          <bufferAttribute attach={"attributes-color"} array={colors} count={particlesCount} itemSize={3} />
        </bufferGeometry>
        <PointMaterial opacity={1} size={0.1} sizeAttenuation vertexColors />
        {/* <shaderMaterial
          attach="material"
          vertexShader={`
          varying vec3 vColor;
          void main() {
            vColor = position;
            gl_PointSize = 10.0;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
          fragmentShader={`
          varying vec3 vColor;
          void main() {
            float dist = length(gl_PointCoord - vec2(0.5));
            if (dist > 0.5) discard;
            gl_FragColor = vec4(1.0, 0.6, 0.1, 1.0) * (1.0 - dist * 2.0);
          }
        `}
          transparent
        /> */}
      </Points>
      {/* <LineBetweenPoints points={newPoints} /> */}
    </>

  )
}



function App() {

  const particlesOnPlane = Array.from({ length: 5000 }, () => [
    (Math.random() - 0.5) * 1000, // X-coordinate
    (Math.random() * 50) - 50  , // y-coordinate

    // -45, //Y-coordinate 
    (Math.random() - 0.5) * 1000, // Z-coordinate
  ]);

  const particlePositions = new Float32Array(particlesOnPlane.flat())


  return (
    <div className='w-full h-screen m-0 p-12 bg-black'>
      <Canvas
        className='' camera={{ position: [0, 0, 100], fov: 100, far: 20000, near: 0.1 }} >
        <ambientLight />
        <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} castShadow />
        {/* <Box /> */}
        {/* <Particles /> */}
        {/* <Environment preset="dawn" background/> */}
        <FlatPlane particlePositions={particlePositions} points={particlesOnPlane} />
        <EffectComposer>
          <Bloom intensity={3} luminanceThreshold={0.1} luminanceSmoothing={0.9} />
        </EffectComposer>
        {/* <LineBetweenPoints points={particlesOnPlane} /> */}
        <OrbitControls />
        <ReflectiveFloor />

      </Canvas>
    </div>
  )
}

export default App
