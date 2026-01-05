import React, {
  Suspense,
  useRef,
  useLayoutEffect,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";

/* ===============================
   MODELOS DISPONÍVEIS
================================ */
const SHIRT_MODELS = {
  normal: "/models/modelo3.glb",
  polo: "/models/collar.glb",
  "manga-longa": "/models/shirt.glb",
};

/* ===============================
   CONFIG FIXA
================================ */
const MODEL_CONFIG = {
  normal: { scale: 3.7, y: 0 },
  polo: { scale: 3.45, y: -1.2 },
  "manga-longa": { scale: 3.35, y: -0.15 },
};

/* ===============================
   MODELO DA CAMISA
================================ */
function ShirtModel({ model, color, texture }) {
  const modelPath = SHIRT_MODELS[model] || SHIRT_MODELS.normal;
  const gltf = useLoader(GLTFLoader, modelPath);

  const printRef = useRef(null);
  const watermarkRef = useRef(null);

  /* POSIÇÃO / ESCALA */
  useLayoutEffect(() => {
    const cfg = MODEL_CONFIG[model] || MODEL_CONFIG.normal;

    if (model === "normal") {
      const box = new THREE.Box3().setFromObject(gltf.scene);
      const center = new THREE.Vector3();
      box.getCenter(center);
      gltf.scene.position.sub(center);
    }

    gltf.scene.position.y = cfg.y;
    gltf.scene.scale.setScalar(cfg.scale);
    gltf.scene.rotation.set(0, 0, 0);
  }, [gltf, model]);

  /* MATERIAL BASE + ESTAMPA + WATERMARK */
  useEffect(() => {
    let baseMesh = null;

    gltf.scene.traverse((obj) => {
      if (!obj.isMesh) return;

      obj.material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(color),
        roughness: 0.9,
        metalness: 0,
      });

      if (!baseMesh) baseMesh = obj;
    });

    if (!baseMesh) return;

    /* ===== ESTAMPA ===== */
    const print = baseMesh.clone();
    print.userData.isPrint = true;
    print.material = new THREE.MeshStandardMaterial({
      transparent: true,
      opacity: 0,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    });

    baseMesh.parent.add(print);
    printRef.current = print;

    /* ===== MARCA D'ÁGUA ===== */
    const watermark = baseMesh.clone();
    watermark.userData.isWatermark = true;
    watermark.material = new THREE.MeshStandardMaterial({
      transparent: true,
      opacity: 0.18,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -2,
      polygonOffsetUnits: -2,
    });

    new THREE.TextureLoader().load("/logo-cometa.png", (tex) => {
      tex.flipY = false;
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;

      // Criamos um objeto para guardar os ajustes de cada modelo
      const watermarkConfigs = {
        normal: {
          repeat: [7, 7],
          offset: [-2, -3.9] // Valor que você ajustou e funcionou
        },
        polo: {
          // Na polo a logo aparece invertida, por isso usamos repeat NEGATIVO no X
          repeat: [-7, 7], 
          offset: [1.68, -5.9] // Ajuste para o peito da Polo
        },
        "manga-longa": {
          repeat: [7, 7],
          offset: [-2, -3.9] // Ajuste para o peito da Manga Longa
        }
      };

      // Pega a config do modelo atual ou usa a 'normal' como padrão
      const config = watermarkConfigs[model] || watermarkConfigs.normal;

      tex.repeat.set(config.repeat[0], config.repeat[1]);
      tex.offset.set(config.offset[0], config.offset[1]);

      watermark.material.map = tex;
      watermark.material.needsUpdate = true;
    });


    baseMesh.parent.add(watermark);
    watermarkRef.current = watermark;

    return () => {
      baseMesh.parent.remove(print);
      baseMesh.parent.remove(watermark);
    };
  }, [gltf]);

  /* COR DA CAMISA (NÃO AFETA ESTAMPA / WATERMARK) */
  useEffect(() => {
    gltf.scene.traverse((obj) => {
      if (!obj.isMesh) return;
      if (obj.userData?.isPrint) return;
      if (obj.userData?.isWatermark) return;
      obj.material.color.set(color);
    });
  }, [color, gltf]);

  /* TEXTURA DA ESTAMPA */
  useEffect(() => {
    if (!texture || !printRef.current) return;

    new THREE.TextureLoader().load(texture, (tex) => {
      tex.flipY = false;
      tex.colorSpace = THREE.SRGBColorSpace;
      printRef.current.material.map = tex;
      printRef.current.material.opacity = 1;
      printRef.current.material.needsUpdate = true;
    });
  }, [texture]);

  return <primitive object={gltf.scene} />;
}

/* ===============================
   VIEWER 3D
================================ */
export const ThreeDViewer = forwardRef(function ThreeDViewer(
  { model, color, texture, side },
  ref
) {
  const glRef = useRef(null);

  useImperativeHandle(ref, () => ({
    exportImage: () => {
      if (!glRef.current) return null;
      return glRef.current.domElement.toDataURL("image/png");
    },
  }));

  return (
    <Canvas
      camera={{ position: [0, 0.6, 5], fov: 32 }}
      gl={{ preserveDrawingBuffer: true, antialias: true }}
      onCreated={({ gl }) => {
        gl.setClearColor("#161a20", 1);
        glRef.current = gl;
      }}
    >
      <ambientLight intensity={0.9} />
      <directionalLight position={[5, 6, 5]} intensity={1.1} />

      <Suspense fallback={null}>
        <group rotation={side === "back" ? [0, Math.PI, 0] : [0, 0, 0]}>
          <ShirtModel model={model} color={color} texture={texture} />
        </group>
        <Environment preset="city" />
      </Suspense>

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 2}
        maxPolarAngle={Math.PI / 2}
      />
    </Canvas>
  );
});































