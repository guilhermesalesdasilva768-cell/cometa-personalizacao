import React, { useState } from "react";
import Lottie from "lottie-react";

// animação Lottie (cometa / globo)
import globeAnimation from "../assets/comet.json";

export function Header({ onNavigate, currentPage }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavigate = (page) => {
    onNavigate(page);
    setMenuOpen(false);
  };

  return (
    <>
      {/* HEADER */}
      <header className="header">
        <div className="header-inner">
          {/* LOGO */}
          <div className="header-logo">
            <div className="lottie-comet">
              <Lottie
                animationData={globeAnimation}
                loop
                autoplay
                speed={0.7}
              />
            </div>

            <div className="header-title">
              <span className="title-main">Cometa</span>
              <span className="title-sub">Personalização</span>
            </div>
          </div>

          {/* MENU DESKTOP */}
          <nav className="nav-links desktop-only">
            <button
              className={`nav-link ${currentPage === "home" ? "active" : ""}`}
              onClick={() => handleNavigate("home")}
            >
              Início
            </button>

            <button
              className={`nav-link ${
                currentPage === "customizer" ? "active" : ""
              }`}
              onClick={() => handleNavigate("customizer")}
            >
              Designer 3D
            </button>

            <button
              className={`nav-link ${
                currentPage === "products" ? "active" : ""
              }`}
              onClick={() => handleNavigate("products")}
            >
              Produtos
            </button>
          </nav>

          {/* BOTÃO MOBILE */}
          <button
            className="hamburger mobile-only"
            onClick={() => setMenuOpen(true)}
          >
            ☰
          </button>
        </div>
      </header>

      {/* MENU MOBILE (TAILWIND) */}
      {menuOpen && (
        <>
          {/* BACKDROP */}
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />

          {/* PAINEL */}
          <aside
            className="
              fixed top-0 right-0 z-50 h-screen w-[280px]
              bg-gradient-to-b from-[#05050f]/95 to-[#020617]/95
              backdrop-blur-xl
              border-l border-purple-500/15
              px-6 pt-6
              flex flex-col
              animate-slide-in
            "
          >
            {/* FECHAR */}
            <button
              onClick={() => setMenuOpen(false)}
              className="self-end text-white/70 text-2xl hover:text-white transition"
            >
              ×
            </button>

            {/* LINKS */}
            <nav className="mt-10 space-y-1">
              {[
                { label: "Início", page: "home" },
                { label: "Personalizar", page: "customizer" },
                { label: "Produtos", page: "products" },
              ].map(({ label, page }) => (
                <button
                  key={page}
                  onClick={() => handleNavigate(page)}
                  className={`
                    group relative w-full text-left
                    px-3 py-3
                    text-base font-medium
                    transition-all
                    ${
                      currentPage === page
                        ? "text-purple-400"
                        : "text-white/80 hover:text-white"
                    }
                  `}
                >
                  {/* indicador lateral */}
                  <span
                    className={`
                      absolute left-0 top-1/2 -translate-y-1/2
                      h-6 w-1 rounded-full
                      bg-purple-500 transition
                      ${
                        currentPage === page
                          ? "opacity-100"
                          : "opacity-0 group-hover:opacity-100"
                      }
                    `}
                  />
                  {label}
                </button>
              ))}
            </nav>
          </aside>
        </>
      )}
    </>
  );
}




