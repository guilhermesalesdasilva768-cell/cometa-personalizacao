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
  "#B7A57A", // Cáqui
  "#2FA4B9", // Azul Turquesa
  "#FFFFFF", // Branco
  "#B65A3C", // Terracota
  "#2FA84F", // Verde Vera
  "#F2E6C9", // Marfim
  "#9FC5E8", // Azul BB
  "#3A4F3B", // Verde Militar
  "#E91E63", // Pink
  "#000000", // Preto
  "#5A3A29", // Marrom
  "#F57C00", // Laranja
  "#C2185B", // Fúcsia
  "#6B1E2E", // Vinho
  "#FBC02D", // Amarelo
  "#9FE0B2", // Verde BB
  "#BDBDBD", // Cinza Mescla
  "#6A1B9A", // Roxo
  "#0B7A3E", // Verde Bandeira
  "#C62828", // Vermelho
  "#4F4F4F", // Cinza Chumbo
  "#FA8072", // Salmão
  "#0D47A1", // Azul Royal
  "#00A896", // Verde Vick
  "#F8BBD0", // Rosa BB
  "#D4A017", // Mostarda
  "#FF5FA2", // Rosa Chiclete
  "#C8A2C8", // Lilás
  "#0A1F44", // Azul Marinho
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

useEffect(() => {
  // Detecta se o usuário está no navegador interno do Instagram ou Facebook
  const isInstagram = /Instagram|FBAN|FBAV/i.test(navigator.userAgent);
  
  if (isInstagram) {
    alert("⚠️ Você está no navegador do Instagram. Se o upload de fotos falhar, clique nos '...' no canto superior e selecione 'Abrir no navegador' (Safari/Chrome).");
  }
}, []);
  /* ================= FUNÇÕES ================= */

  const handleUpload = (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  // Verificação básica de tamanho (opcional, para evitar que o navegador do Instagram trave)
  if (file.size > 10 * 1024 * 1024) {
    alert("Imagem muito grande! Escolha uma foto com menos de 10MB.");
    return;
  }

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
    // Importante: limpa o valor do input para permitir enviar a mesma imagem de novo se apagar
    e.target.value = ""; 
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
  const downloadMockup = async () => {
  // 1. Captura a imagem do ThreeDViewer
  const imageData = viewerRef.current?.exportImage();
  if (!imageData) {
    alert("Erro ao gerar imagem. Tente novamente.");
    return;
  }

  try {
    // 2. Converte a imagem Base64 para um arquivo real (Blob) que o celular entenda
    const response = await fetch(imageData);
    const blob = await response.blob();
    const file = new File([blob], `camisa-cometa-${Date.now()}.png`, { type: "image/png" });

    // 3. Verifica se o navegador (como o do Instagram) suporta compartilhamento de arquivos
    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: 'Minha Camisa Personalizada',
        text: 'Confira o mockup da minha nova camisa!',
      });
    } else {
      // 4. Caso o navegador seja antigo e não suporte Share API (Fallback para PC)
      const link = document.createElement("a");
      link.download = `camisa-cometa-${Date.now()}.png`;
      link.href = imageData;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  } catch (error) {
    console.error("Erro ao processar imagem:", error);
    // Se der erro no compartilhamento, tenta o download padrão
    const link = document.createElement("a");
    link.href = imageData;
    link.download = "camisa-personalizada.png";
    link.click();
  }
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
            {/* Localize este trecho no seu código */}
{mobileTab === "imagem" && (
  <div className="space-y-4">
    {/* Substitua o <input /> antigo por este: */}
    <div className="flex flex-col gap-2">
      <label className="text-white text-sm mb-1">Selecione uma imagem da sua galeria:</label>
      <input 
        type="file" 
        accept="image/png, image/jpeg, image/jpg" 
        onChange={handleUpload}
        capture={false} 
        className="w-full bg-neutral-800 border border-white/10 rounded-lg px-3 py-4 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white"
      />
    </div>
    
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







