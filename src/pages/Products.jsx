import React, { useRef, useState } from "react";

export function Products() {
  const [previewIndex, setPreviewIndex] = useState(null);

  // ZOOM STATE
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const items = [
    {
      title: "Blusa Algodão Tradicional",
      desc: "Várias cores disponíveis",
      price: "R$ 37,99",
      image: "/assets/produtos/blusa.png",
    },
    {
      title: "Blusa Oversize",
      desc: "Várias cores disponíveis",
      price: "R$ 44,99",
      image: "/assets/produtos/blusa2.png",
    },
    {
      title: "Gola Polo Poliéster",
      desc: "Várias cores disponíveis",
      price: "R$ 39,99",
      image: "/assets/produtos/blusa3.png",
    },
    {
      title: "Cropped Oversized",
      desc: "Várias cores disponíveis",
      price: "R$ 39,99",
      image: "/assets/produtos/blusa4.png",
    },
    {
      title: "Caneca Branca Porcelana",
      desc: "",
      price: "R$ 26,99",
      image: "/assets/produtos/caneca1.png",
    },
    {
      title: "Caneca Mágica",
      desc: "",
      price: "R$ 29,99",
      image: "/assets/produtos/caneca2.png",
    },
    {
      title: "Caneca Fundo Colorido",
      desc: "",
      price: "R$ 29,99",
      image: "/assets/produtos/caneca3.png",
    },
    {
      title: "Caneca com Colher",
      desc: "",
      price: "R$ 29,99",
      image: "/assets/produtos/caneca4.png",
    },
    {
      title: "CERÂMICA 20X20",
      desc: "",
      price: "R$ 29,99",
      image: "/assets/produtos/ceramica.png",
    },
    {
      title: "GARRAFA SQUEZZE 500 ml",
      desc: "Ideal para empresas",
      price: "R$ 29,99",
      image: "/assets/produtos/garrafa.png",
    },
  ];

  const handleWheel = (e) => {
    const delta = e.deltaY > 0 ? -0.15 : 0.15;
    setScale((prev) => Math.min(Math.max(prev + delta, 1), 3));
  };

  const handlePointerDown = (e) => {
    setIsDragging(true);
    lastPos.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e) => {
    if (!isDragging || scale === 1) return;

    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;

    setPosition((prev) => ({
      x: prev.x + dx,
      y: prev.y + dy,
    }));

    lastPos.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const closePreview = () => {
    setPreviewIndex(null);
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <section className="relative min-h-screen pt-32 pb-24 px-6 comet-bg">
      <div className="max-w-7xl mx-auto mb-14">
        <h2 className="text-4xl font-bold text-white">
          Outros Produtos
        </h2>
        <p className="text-purple-300 mt-2">
          Conheça nossos produtos personalizados
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
        {items.map((item, index) => (
          <div
            key={index}
            onClick={() => setPreviewIndex(index)}
            className="
              product-card
              relative z-30 cursor-pointer
              rounded-2xl overflow-hidden
              transition-all duration-300
              hover:-translate-y-2
              active:scale-[0.98]
            "
          >
            <div className="absolute top-3 left-3 z-10">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                COMETA
              </span>
            </div>

            <div className="bg-white p-5 flex items-center justify-center h-56">
              <img
                src={item.image}
                alt={item.title}
                className="max-h-full object-contain"
              />
            </div>

            <div className="product-info p-5 space-y-2">
              <h3 className="product-title">
                {item.title}
              </h3>
              <p className="product-desc">{item.desc}</p>
              <p className="product-price pt-3">
                {item.price}
              </p>
            </div>

            {previewIndex === index && (
              <div
                className="
                  absolute inset-0 z-50
                  bg-black/80 backdrop-blur-sm
                  flex items-center justify-center
                  p-4
                "
                onClick={(e) => {
                  e.stopPropagation();
                  closePreview();
                }}
              >
                <img
                  src={item.image}
                  alt="Preview"
                  onWheel={handleWheel}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerLeave={handlePointerUp}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                    cursor: scale > 1 ? "grab" : "zoom-in",
                    touchAction: "none",
                  }}
                  className="
                    max-w-full max-h-full
                    object-contain
                    rounded-xl
                    bg-white
                    shadow-2xl
                    transition-transform
                  "
                  draggable={false}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}







