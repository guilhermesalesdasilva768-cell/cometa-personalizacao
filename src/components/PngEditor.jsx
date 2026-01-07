import React, { useRef, useEffect, useCallback } from "react";
import {
  Stage,
  Layer,
  Image as KonvaImage,
  Rect,
  Text,
  Transformer,
} from "react-konva";

export function PngEditor({
  size = 400,
  texts,
  images,
  setImages,
  setTexts,
  onTextureReady,
  selectedId,
  onSelect,
}) {
  const stageRef = useRef(null);
  const layerRef = useRef(null);
  const trRef = useRef(null);
  const imgCacheRef = useRef(new Map());
  const isDraggingRef = useRef(false);

  /* ===============================
     EXPORT FINAL (MANTÉM TRANSPARÊNCIA)
  =============================== */
  const exportFinalTexture = useCallback(() => {
    if (!stageRef.current) return;

    const nodes = trRef.current?.nodes() || [];
    trRef.current?.nodes([]);
    layerRef.current?.batchDraw();

    const uri = stageRef.current.toDataURL({
      mimeType: "image/png",
      pixelRatio: 2,
    });

    onTextureReady(uri);
    trRef.current?.nodes(nodes);
  }, [onTextureReady]);

  useEffect(() => {
    exportFinalTexture();
  }, [images, texts, exportFinalTexture]);

  /* ===============================
     TRANSFORMER (ALÇAS)
  =============================== */
  useEffect(() => {
    if (trRef.current) {
      if (selectedId) {
        const stage = stageRef.current;
        const selectedNode = stage.findOne("#" + selectedId);
        if (selectedNode) {
          trRef.current.nodes([selectedNode]);
        } else {
          trRef.current.nodes([]);
        }
      } else {
        trRef.current.nodes([]);
      }
      trRef.current.getLayer().batchDraw();
    }
  }, [selectedId, images, texts]);

  const handleMouseDown = (e) => {
    if (e.target === e.target.getStage()) {
      onSelect(null);
      return;
    }
  };

  const enterDragMode = () => { isDraggingRef.current = true; };
  const exitDragMode = () => { isDraggingRef.current = false; };

  return (
    <div className="flex flex-col items-center w-full">
      <div 
        className="relative border-2 border-dashed border-gray-300 rounded-xl shadow-inner overflow-hidden"
        style={{ 
          touchAction: selectedId ? "none" : "auto", 
          width: size,
          height: size,
          // USA A TUA IMAGEM DA PASTA PUBLIC
          backgroundImage: "url('/xadrez.png')", // Ajusta o nome se o ficheiro for diferente
          backgroundSize: '30px', // Define o tamanho de cada quadradinho
          backgroundRepeat: 'repeat', 
          backgroundPosition: 'center',
          backgroundColor: '#fff' // Cor de fundo caso a imagem demore a carregar
        }}
      >
        <Stage
          width={size}
          height={size}
          ref={stageRef}
          onMouseDown={handleMouseDown}
          onTouchStart={(e) => {
            if (!selectedId) return; 
            handleMouseDown(e);
          }}
          className="cursor-crosshair"
        >
          <Layer ref={layerRef}>
            {/* O interior do Stage permanece vazio (transparente) para não tapar a cor da camisa */}
            
            {images.map((img) => {
              let nativeImg = imgCacheRef.current.get(img.id);
              if (!nativeImg || nativeImg.src !== img.src) {
                nativeImg = new window.Image();
                nativeImg.src = img.src;
                imgCacheRef.current.set(img.id, nativeImg);
                nativeImg.onload = () => layerRef.current?.batchDraw();
              }

              return (
                <KonvaImage
                  key={img.id}
                  id={img.id}
                  image={nativeImg}
                  x={img.x}
                  y={img.y}
                  width={img.width}
                  height={img.height}
                  scaleX={img.scaleX || 1}
                  scaleY={img.scaleY || 1}
                  rotation={img.rotation || 0}
                  draggable
                  onClick={() => onSelect(img.id)}
                  onTap={() => onSelect(img.id)}
                  onDragStart={enterDragMode}
                  onDragEnd={(e) => {
                    const node = e.target;
                    setImages((prev) =>
                      prev.map((i) =>
                        i.id === img.id ? { ...i, x: node.x(), y: node.y() } : i
                      )
                    );
                    exitDragMode();
                    exportFinalTexture();
                  }}
                  onTransformEnd={(e) => {
                    const node = e.target;
                    setImages((prev) =>
                      prev.map((i) =>
                        i.id === img.id
                          ? {
                              ...i,
                              x: node.x(),
                              y: node.y(),
                              scaleX: node.scaleX(),
                              scaleY: node.scaleY(),
                              rotation: node.rotation(),
                            }
                          : i
                      )
                    );
                    exportFinalTexture();
                  }}
                />
              );
            })}

            {texts.map((t) => (
              <Text
                key={t.id}
                id={t.id}
                text={t.text}
                x={t.x}
                y={t.y}
                fontSize={t.fontSize}
                fill={t.color}
                draggable
                onClick={() => onSelect(t.id)}
                onTap={() => onSelect(t.id)}
                onDragStart={enterDragMode}
                onDragEnd={(e) => {
                  setTexts((prev) =>
                    prev.map((txt) =>
                      txt.id === t.id ? { ...txt, x: e.target.x(), y: e.target.y() } : txt
                    )
                  );
                  exitDragMode();
                  exportFinalTexture();
                }}
              />
            ))}

            <Transformer
              ref={trRef}
              rotateEnabled
              enabledAnchors={["top-left", "top-center", "top-right", "middle-right", "bottom-right", "bottom-center", "bottom-left", "middle-left"]}
              keepRatio={false}
              boundBoxFunc={(oldBox, newBox) => {
                if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) return oldBox;
                return newBox;
              }}
            />
          </Layer>
        </Stage>
      </div>
      
      {!selectedId && (
        <p className="text-gray-400 text-[10px] mt-2 italic text-center px-4">
          Arraste o dedo aqui para mover a página. Toque na arte para editar.
        </p>
      )}
    </div>
  );
}
























