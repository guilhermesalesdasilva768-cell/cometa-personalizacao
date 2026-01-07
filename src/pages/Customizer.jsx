import { ThreeDViewer } from "../components/ThreeDViewer";
import { PngEditor } from "../components/PngEditor";
import React, { useEffect, useState, useRef } from "react";
import { removeBackground } from "@imgly/background-removal";
export function Customizer() {
  const viewerRef = useRef(null);

  const [model, setModel] = useState("normal");
  const [gender] = useState("masculino");
  const [color, setColor] = useState("#ffffff");

  const [texts, setTexts] = useState([]);
  const [images, setImages] = useState([]);
  const [textureURL, setTextureURL] = useState(null);

  const [textInput, setTextInput] = useState("");
  const [textColor, setTextColor] = useState("#ffffff");
  const [selectedId, setSelectedId] = useState(null);
  const [side, setSide] = useState("front");
  const [canvasJSON, setCanvasJSON] = useState(null);

  const [mobileTab, setMobileTab] = useState("roupa");

  const SHIRT_COLORS = [
    "#8B0000", "#FF0000", "#FF9800", "#FFC0CB", "#FFFF00", "#7CFC00",
    "#2196F3", "#4A6CF7", "#228B22", "#4B0082", "#CFCFCF", "#000000",
  ];

  const [isProcessing, setIsProcessing] = useState(false);

const handleRemoveBackground = async () => {
  if (!selectedId) return;
  
  // Encontra a imagem selecionada
  const selectedImg = images.find(img => img.id === selectedId);
  if (!selectedImg) return;

  try {
    setIsProcessing(true);
    
    // Processa a remoção do fundo
    const blob = await removeBackground(selectedImg.src);
    
    // Converte o blob resultante em Base64
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      const base64data = reader.result;
      
      // Atualiza a imagem na lista
      setImages((prev) =>
        prev.map((img) =>
          img.id === selectedId ? { ...img, src: base64data } : img
        )
      );
      setIsProcessing(false);
    };
  } catch (error) {
    console.error("Erro ao remover fundo:", error);
    setIsProcessing(false);
    alert("Não foi possível remover o fundo desta imagem.");
  }
};

  useEffect(() => {
    if (!selectedId) return;
    const selectedText = texts.find((t) => t.id === selectedId);
    if (selectedText) setTextColor(selectedText.color);
  }, [selectedId, texts]);

  useEffect(() => {
    document.body.classList.add("customizer-active");
    return () => {
      document.body.classList.remove("customizer-active");
    };
  }, []);

  // Adicione isso dentro do componente Customizer, logo abaixo dos outros useEffects
useEffect(() => {
  if (mobileTab !== "png") {
    setSelectedId(null);
  }
}, [mobileTab]);
  /* ================= FUNÇÕES ================= */

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImages((prev) => [
        ...prev,
        {
          id: `img-${Date.now()}`,
          src: reader.result,
          x: 80,
          y: 80,
          width: 200,
          height: 200,
        },
      ]);
    };
    reader.readAsDataURL(file);
  };

  const addText = () => {
    if (!textInput.trim()) return;
    setTexts((prev) => [
      ...prev,
      {
        id: `text-${Date.now()}`,
        text: textInput,
        x: 100,
        y: 80,
        fontSize: 30,
        color: textColor,
      },
    ]);
    setTextInput("");
  };

  const removeSelectedItem = () => {
    if (!selectedId) return;

    // Remove das imagens
    setImages((prev) => prev.filter((img) => img.id !== selectedId));
    // Remove dos textos
    setTexts((prev) => prev.filter((txt) => txt.id !== selectedId));

    setSelectedId(null);

    // O SEGREDO: Precisamos limpar a textura ou forçar o PngEditor a renderizar.
    // Como o estado de images/texts mudou, o PngEditor vai se reconstruir,
    // mas precisamos garantir que o textureURL seja atualizado.
    // Se a lista ficar vazia, limpamos a camisa:
    if (images.length === 1 && texts.length === 0 || images.length === 0 && texts.length === 1) {
      setTextureURL(null);
    }
  };

  /* 🔥 CORREÇÃO DO MOCKUP (AGORA BAIXA A CAMISA 3D) */
  /* 🔥 CORREÇÃO DO MOCKUP (AGORA BAIXA A CAMISA 3D) */
  const downloadMockup = () => {
    // 1. Captura a imagem do ThreeDViewer via ref
    const image = viewerRef.current?.exportImage();
    if (!image) {
      alert("Erro ao gerar imagem. Tente novamente.");
      return;
    }

    // 2. Cria o elemento de link para o download
    const link = document.createElement("a");
    
    // 3. Define o nome do arquivo (ajuda a organizar na pasta Downloads)
    link.download = `camisa-cometa-${Date.now()}.png`;
    
    // 4. Atribui a imagem ao link
    link.href = image;
    
    // 5. Truque para garantir funcionamento no Mobile/iOS/Android
    // O link precisa estar fisicamente no documento para alguns navegadores processarem o clique
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetAll = () => {
    setTexts([]);
    setImages([]);
    setTextureURL(null);
    setSelectedId(null);
    setTextInput("");
    setTextColor("#ffffff");
    setColor("#ffffff");
    setModel("normal");
  };

  return (
    <div className="fixed inset-0 z-10 bg-black overflow-hidden">

      {/* ================= MOBILE ================= */}
      <div className="h-full flex flex-col lg:flex-row">



        {/* ===== PREVIEW ===== */}
<div className="flex-[5] relative z-10 bg-[radial-gradient(circle_at_center,_#3a4048_0%,_#262b33_45%,_#161a20_100%)] overflow-hidden">
  
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
    <ThreeDViewer
      ref={viewerRef}
      model={model}
      gender={gender}
      color={color}
      texture={textureURL}
      side={side}
    />

    {/* LOGO COMO MARCA D'ÁGUA AJUSTADA */}

  </div>
</div>

        {/* ===== PAINEL ===== */}
        <div
  className="
    flex-[4]
    lg:w-[420px]
    min-h-0
    bg-neutral-900
    overflow-hidden
    border-t lg:border-t-0 lg:border-l border-white/10
    relative
    z-30
  "
>




          {/* ABAS */}
          <div className="px-3 pt-3 pb-2 border-b border-white/10">
            <div className="flex gap-2 overflow-x-auto">
              {[
                { id: "roupa", label: "Roupa" },
                { id: "texto", label: "Texto" },
                { id: "imagem", label: "Imagem" },
                { id: "png", label: "PNG" },
                { id: "acoes", label: "Ações" },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setMobileTab(t.id)}
                  className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold border ${
                    mobileTab === t.id
                      ? "bg-purple-600 text-white border-purple-400/40"
                      : "bg-neutral-800 text-white/80 border-white/10"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* CONTEÚDO */}
          <div className="h-full overflow-y-auto px-4 py-4 overscroll-contain">

            {/* ===== ROUPA ===== */}
            {mobileTab === "roupa" && (
              <div className="space-y-4 pb-20">
                <div className="side-buttons">
                  <button onClick={() => setSide("front")}>Frente</button>
                  <button onClick={() => setSide("back")}>Costas</button>
                </div>

                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full bg-neutral-800 border border-white/10 rounded-lg px-3 py-2 text-white"
                >
                  <option value="normal">Camisa normal</option>
                  <option value="polo">Gola polo</option>
                  <option value="manga-longa">Manga longa</option>
                </select>

                <div className="grid grid-cols-6 gap-4">
                  {SHIRT_COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className={`w-10 h-10 rounded-md ${
                        color === c ? "ring-2 ring-white scale-110" : ""
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* ===== TEXTO ===== */}
            {mobileTab === "texto" && (
              <div className="space-y-4">
                <input
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Digite o texto"
                  className="w-full bg-neutral-800 border border-white/10 rounded-lg px-3 py-2 text-white"
                />

                <div className="grid grid-cols-6 gap-3">
                  {SHIRT_COLORS.map((c) => (
                    <button
                      key={`text-${c}`}
                      onClick={() => {
                        setTextColor(c);
                        setTexts((prev) =>
                          prev.map((t) =>
                            t.id === selectedId ? { ...t, color: c } : t
                          )
                        );
                      }}
                      className={`w-9 h-9 rounded-md ${
                        textColor === c ? "ring-2 ring-white scale-110" : ""
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>

                <button
                  onClick={addText}
                  className="w-full bg-purple-600 py-2 rounded-lg text-white"
                >
                  ➕ Adicionar texto
                </button>

                <button
                  onClick={removeSelectedItem}
                  disabled={!selectedId}
                  className="w-full bg-red-500/10 py-2 rounded-lg text-red-300 disabled:opacity-40"
                >
                  🗑️ Remover item selecionado
                </button>
              </div>
            )}

            {/* ===== IMAGEM ===== */}
            {mobileTab === "imagem" && (
              <div className="space-y-4">
                <input type="file" accept="image/*" onChange={handleUpload} />
                <button
                  onClick={removeSelectedItem}
                  disabled={!selectedId}
                  className="w-full bg-red-500/10 py-2 rounded-lg text-red-300 disabled:opacity-40"
                >
                  🗑️ Remover item selecionado
                </button>
              </div>
            )}

            {/* ===== PNG (Modificado para permitir rolagem) ===== */}
<div 
  className="flex flex-col gap-4 overflow-y-auto max-h-[500px] pb-10" 
  style={{ display: mobileTab === "png" ? "flex" : "none" }}
>
  {/* Área do Editor */}
  <div className="flex-shrink-0 h-[380px] overflow-x-scroll overflow-y-hidden border border-white/10 rounded-lg">
    <div className="relative h-full w-[140%]">
      <PngEditor
        texts={texts}
        images={images}
        setImages={setImages}
        setTexts={setTexts}
        onTextureReady={setTextureURL}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />
    </div>
  </div>

  {/* Dentro do bloco mobileTab === "png" */}
<div className="px-2 space-y-2">
  
  <button
    onClick={handleRemoveBackground}
    disabled={!selectedId || isProcessing || !selectedId.startsWith('img-')}
    className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg text-white font-medium disabled:opacity-40 flex items-center justify-center gap-2"
  >
    {isProcessing ? (
      <span className="animate-spin">🌀</span>
    ) : (
      "✨ Remover Fundo da Imagem"
    )}
  </button>

  <button
    onClick={removeSelectedItem}
    disabled={!selectedId}
    className="w-full bg-red-500/20 py-3 rounded-lg text-red-300 border border-red-500/30 disabled:opacity-40 font-medium mb-4"
  >
    🗑️ Remover item selecionado
  </button>
</div>
</div>
            

            {/* ===== AÇÕES ===== */}
            {mobileTab === "acoes" && (
              <div className="space-y-4">
                <button
                  onClick={downloadMockup}
                  className="w-full bg-purple-600 py-2 rounded-lg text-white"
                >
                  ⬇️ Baixar mockup
                </button>

                <button
                  onClick={resetAll}
                  className="w-full bg-red-500/10 py-2 rounded-lg text-red-300"
                >
                  ♻️ Resetar tudo
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}







