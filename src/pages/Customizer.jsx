import { ThreeDViewer } from "../components/ThreeDViewer";
import { PngEditor } from "../components/PngEditor";
import React, { useEffect, useState, useRef } from "react";
import { removeBackground } from "@imgly/background-removal";
import { supabase } from "../services/api"; // Importando a conexão

export function Customizer() {
  const viewerRef = useRef(null);
  const previewRef = useRef(null);


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

  // Novo estado para as cores que vêm do banco
  const [shirtColors, setShirtColors] = useState([]);

  // Função para buscar as cores no Supabase
  useEffect(() => {
    async function fetchColors() {
      const { data, error } = await supabase
        .from("cores")
        .select("*")
        .eq("active", true)
        .order("nome", { ascending: true });


      if (data) {
        const hexList = data.map(c => c.hex);
        setShirtColors(hexList);
        if (hexList.length > 0) setColor(hexList[0]); // Define a primeira cor como padrão
      }
    }
    fetchColors();
  }, []);


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
      <div className="h-full flex flex-col isolate">




        {/* ===== PREVIEW ===== */}
<div
  ref={previewRef}
  /* Definimos h-[45vh] para a camisa ocupar quase metade da tela e o resto para o editor */
  className="h-[45vh] lg:h-[50vh] shrink-0 relative z-0 bg-[radial-gradient(circle_at_center,_#3a4048_0%,_#262b33_45%,_#161a20_100%)] overflow-hidden"
>
  <div className="absolute inset-0 flex items-center justify-center">
    <ThreeDViewer
      ref={viewerRef}
      eventSource={previewRef}
      model={model}
      gender={gender}
      color={color}
      texture={textureURL}
      side={side}
    />
  </div>
</div>

        {/* ===== PAINEL ===== */}
<div
  className="
    flex-1           /* Faz o painel ocupar todo o espaço restante abaixo */
    w-full           /* Ocupa a largura total */
    min-h-0
    bg-neutral-900
    overflow-hidden
    border-t border-white/10
    relative
    z-[50]
    pointer-events-auto
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
          <div className="h-full overflow-y-auto overscroll-contain bg-neutral-900">
            {/* max-w-2xl centraliza e impede que os botões estiquem no desktop */}
            <div className="max-w-2xl mx-auto px-4 py-6 space-y-8 pb-32">

              {/* ===== ROUPA ===== */}
              {mobileTab === "roupa" && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                  <div className="flex gap-4 justify-center">
                    <button 
                      onClick={() => setSide("front")}
                      className={`flex-1 max-w-[140px] py-3 rounded-xl font-bold transition-all border ${
                        side === 'front' 
                        ? 'bg-purple-600 text-white border-purple-400 shadow-lg shadow-purple-500/20' 
                        : 'bg-neutral-800 text-white/60 border-white/5 hover:bg-neutral-700'
                      }`}
                    >
                      Frente
                    </button>
                    <button 
                      onClick={() => setSide("back")}
                      className={`flex-1 max-w-[140px] py-3 rounded-xl font-bold transition-all border ${
                        side === 'back' 
                        ? 'bg-purple-600 text-white border-purple-400 shadow-lg shadow-purple-500/20' 
                        : 'bg-neutral-800 text-white/60 border-white/5 hover:bg-neutral-700'
                      }`}
                    >
                      Costas
                    </button>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/40 uppercase tracking-wider">Modelo da Peça</label>
                    <select
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      className="w-full bg-neutral-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 outline-none"
                    >
                      <option value="normal">Camisa normal</option>
                      <option value="polo">Gola polo</option>
                      <option value="manga-longa">Manga longa</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/40 uppercase tracking-wider">Cores</label>
                    <div className="grid grid-cols-6 sm:grid-cols-8 gap-3 bg-neutral-800/40 p-4 rounded-2xl border border-white/5">
                      {shirtColors.map((c) => (
                        <button
                          key={c}
                          onClick={() => setColor(c)}
                          className={`aspect-square rounded-full transition-all hover:scale-110 ${
                            color === c ? "ring-2 ring-purple-500 ring-offset-2 ring-offset-neutral-900 scale-110" : "opacity-80"
                          }`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ===== TEXTO ===== */}
              {mobileTab === "texto" && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/40 uppercase tracking-wider">Escreva seu texto</label>
                    <input
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      placeholder="Ex: Minha Marca"
                      className="w-full bg-neutral-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
                    {shirtColors.map((c) => (
                      <button
                        key={`text-${c}`}
                        onClick={() => {
                          setTextColor(c);
                          setTexts((prev) =>
                            prev.map((t) => t.id === selectedId ? { ...t, color: c } : t)
                          );
                        }}
                        className={`aspect-square rounded-lg transition-all ${
                          textColor === c ? "ring-2 ring-white scale-110" : "border border-white/10"
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>

                  <button
                    onClick={addText}
                    className="w-full bg-purple-600 hover:bg-purple-500 py-3 rounded-xl text-white font-bold"
                  >
                    ➕ Adicionar texto
                  </button>

                  <button
                    onClick={removeSelectedItem}
                    disabled={!selectedId}
                    className="w-full bg-red-500/10 py-3 rounded-xl text-red-300 border border-red-500/20 disabled:opacity-40"
                  >
                    🗑️ Remover selecionado
                  </button>
                </div>
              )}

              {/* ===== IMAGEM ===== */}
              {mobileTab === "imagem" && (
                <div className="space-y-6 animate-in fade-in">
                  <div className="flex flex-col gap-3">
                    <label className="text-xs font-bold text-white/40 uppercase tracking-wider">Upload de Estampa</label>
                    <input 
                      type="file" 
                      accept="image/png, image/jpeg, image/jpg" 
                      onChange={handleUpload}
                      className="w-full bg-neutral-800 border border-dashed border-white/20 rounded-xl px-4 py-8 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-purple-600 file:text-white"
                    />
                  </div>
                  <button
                    onClick={removeSelectedItem}
                    disabled={!selectedId}
                    className="w-full bg-red-500/10 py-3 rounded-xl text-red-300 border border-red-500/20 disabled:opacity-40"
                  >
                    🗑️ Remover selecionado
                  </button>
                </div>
              )}

              {/* ===== PNG EDITOR ===== */}
              {mobileTab === "png" && (
                <div className="flex flex-col gap-6 animate-in fade-in">
                  <div className="flex-shrink-0 h-[400px] bg-black/20 overflow-x-auto border border-white/10 rounded-2xl relative">
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
                  <div className="space-y-3">
                    <button
                      onClick={handleRemoveBackground}
                      disabled={!selectedId || isProcessing || !selectedId.startsWith('img-')}
                      className="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-xl text-white font-bold disabled:opacity-40 flex items-center justify-center gap-2"
                    >
                      {isProcessing ? <span className="animate-spin">🌀</span> : "✨ Remover Fundo"}
                    </button>
                    <button
                      onClick={removeSelectedItem}
                      disabled={!selectedId}
                      className="w-full bg-red-500/10 py-4 rounded-xl text-red-300 border border-red-500/20 disabled:opacity-40 font-bold"
                    >
                      🗑️ Remover item
                    </button>
                  </div>
                </div>
              )}

              {/* ===== AÇÕES ===== */}
              {mobileTab === "acoes" && (
                <div className="space-y-4 max-w-md mx-auto animate-in fade-in">
                  <button
                    onClick={downloadMockup}
                    className="w-full bg-purple-600 hover:bg-purple-500 py-4 rounded-2xl text-white font-bold text-lg shadow-xl shadow-purple-900/20 transition-all active:scale-95"
                  >
                    ⬇️ Baixar mockup
                  </button>
                  <button
                    onClick={resetAll}
                    className="w-full bg-red-500/10 hover:bg-red-500/20 py-4 rounded-2xl text-red-400 border border-red-500/20 transition-all"
                  >
                    ♻️ Resetar tudo
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}







