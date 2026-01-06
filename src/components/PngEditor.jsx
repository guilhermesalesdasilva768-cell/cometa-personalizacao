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

  // cache real de imagens (não recria Image())
  const imgCacheRef = useRef(new Map()); // id -> HTMLImageElement

  // flag de drag
  const isDraggingRef = useRef(false);

  /* ===============================
     EXPORT FINAL (HD)
  =============================== */
  const exportFinalTexture = useCallback(() => {
  if (!stageRef.current) return;

  // 1. Esconde as alças temporariamente
  const nodes = trRef.current?.nodes() || [];
  trRef.current?.nodes([]);
  
  // 2. Renderiza a camada sem as alças
  layerRef.current?.batchDraw();

  // 3. Gera a imagem
  const uri = stageRef.current.toDataURL({
    mimeType: "image/png",
    pixelRatio: 2,
  });

  onTextureReady(uri);

  // 4. Devolve as alças para a tela (se houver algo selecionado)
  trRef.current?.nodes(nodes);
  layerRef.current?.batchDraw();
}, [onTextureReady]);

  /* ===============================
     CACHE DE IMAGENS
  =============================== */
  useEffect(() => {
  images.forEach((img) => {
    const cached = imgCacheRef.current.get(img.id);
    
    // 🔥 Se não tem no cache OU se o SRC mudou (fundo removido), atualiza!
    if (!cached || cached.src !== img.src) {
      const imageObj = new window.Image();
      imageObj.src = img.src;
      imageObj.onload = () => {
        imgCacheRef.current.set(img.id, imageObj);
        exportFinalTexture(); // Atualiza o 3D assim que carregar
      };
    }
  });

  // Limpeza de IDs removidos
  const ids = new Set(images.map((i) => i.id));
  for (const key of imgCacheRef.current.keys()) {
    if (!ids.has(key)) imgCacheRef.current.delete(key);
  }
}, [images, exportFinalTexture]);

  // Adicione isso dentro do componente PngEditor
  useEffect(() => {
    // Sempre que a lista de textos ou imagens mudar (inclusive remoção),
    // gera uma nova textura para o 3D
    const timeout = setTimeout(() => {
      exportFinalTexture();
    }, 100); // Pequeno delay para garantir que o Konva removeu o elemento

    return () => clearTimeout(timeout);
  }, [texts, images, exportFinalTexture]);

  /* ===============================
     TRANSFORMER (somente fora do drag)
  =============================== */
  useEffect(() => {
    if (!trRef.current || !stageRef.current) return;
    if (isDraggingRef.current) return;

    const node = stageRef.current.findOne(`#${selectedId}`);
    trRef.current.nodes(node ? [node] : []);
    trRef.current.getLayer()?.batchDraw();
  }, [selectedId]);

  /* ===============================
     MODO PERFORMANCE (DRAG)
  =============================== */
  const enterDragMode = useCallback(() => {
    isDraggingRef.current = true;

    // remove transformer durante drag
    if (trRef.current) {
      trRef.current.nodes([]);
      trRef.current.getLayer()?.batchDraw();
    }

    // 🔥 API CORRETA (remove aviso + mais rápida)
    if (layerRef.current) {
      layerRef.current.listening(false);
    }
  }, []);

  const exitDragMode = useCallback(() => {
    isDraggingRef.current = false;

    // reativa eventos
    if (layerRef.current) {
      layerRef.current.listening(true);
      layerRef.current.batchDraw();
    }

    // restaura transformer
    if (trRef.current && stageRef.current) {
      const node = stageRef.current.findOne(`#${selectedId}`);
      trRef.current.nodes(node ? [node] : []);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [selectedId]);

  return (
    // No arquivo PngEditor.jsx
<Stage
  width={size}
  height={size}
  ref={stageRef}
  onMouseDown={(e) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) onSelect(null);
  }}
  /* ADICIONE ESTAS DUAS LINHAS ABAIXO */
  onTouchStart={(e) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      // Permite que o evento de toque passe para o navegador se não clicar na estampa
      e.evt.preventDefault = () => {};
    }
  }}
  style={{ borderRadius: 12, backgroundColor: '#000000' }}
>
  <Layer ref={layerRef} imageSmoothingEnabled={false}>
    {/* Mude o fill de transparent para algo com opacidade 0 ou uma cor sólida */}
    <Rect 
      width={size} 
      height={size} 
      fill="rgba(0,0,0,0)" 
      onClick={() => onSelect(null)} 
    />

        {/* IMAGENS */}
        {images.map((img) => (
          <KonvaImage
            key={img.id}
            id={img.id}
            image={imgCacheRef.current.get(img.id)}
            x={img.x}
            y={img.y}
            width={img.width}
            height={img.height}
            draggable
            onClick={() => onSelect(img.id)}
            onTap={() => onSelect(img.id)}
            onDragStart={enterDragMode}
            onDragMove={() => {}}
            onDragEnd={(e) => {
              const x = e.target.x();
              const y = e.target.y();

              setImages((prev) =>
                prev.map((i) =>
                  i.id === img.id ? { ...i, x, y } : i
                )
              );

              exitDragMode();
              exportFinalTexture();
            }}
          />
        ))}

        {/* TEXTOS */}
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
            onDragMove={() => {}}
            onDragEnd={(e) => {
              const x = e.target.x();
              const y = e.target.y();

              setTexts((prev) =>
                prev.map((txt) =>
                  txt.id === t.id ? { ...txt, x, y } : txt
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
  // Adicione todos os pontos de ancoragem (meios e cantos)
  enabledAnchors={[
    "top-left",
    "top-center",
    "top-right",
    "middle-right",
    "bottom-right",
    "bottom-center",
    "bottom-left",
    "middle-left",
  ]}
  // Isso permite redimensionar largura/altura de forma independente
  keepRatio={false} 
  // Garante que o redimensionamento atualize a escala e não bugue a renderização
  boundBoxFunc={(oldBox, newBox) => {
    // Impede que o elemento fique com tamanho negativo (invertido)
    if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) {
      return oldBox;
    }
    return newBox;
  }}
/>
      </Layer>
    </Stage>
  );
}
























