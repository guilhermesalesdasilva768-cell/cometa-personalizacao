import React from "react";

export function Contact() {
  return (
    <section className="relative min-h-screen pt-28 pb-20 px-4 bg-gradient-to-b from-purple-900/40 via-black to-black overflow-hidden comet-bg">
      
      {/* Fundo de estrelas (mantém seu CSS atual) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="stars"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        
        {/* Título */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Fale Conosco
          </h2>
          <p className="text-purple-200 text-lg max-w-2xl mx-auto">
            Entre em contato e faça seu orçamento sem compromisso
          </p>
        </div>

        {/* Card principal */}
        <div className="bg-gradient-to-br from-[#0b132b]/90 to-[#0b132b]/60 border border-purple-500/30 rounded-3xl p-10 backdrop-blur-xl shadow-2xl">
          
          <div className="grid md:grid-cols-2 gap-10">

            {/* WhatsApp */}
            <div className="flex items-start gap-5">
              <div className="text-3xl">📱</div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-1">
                  WhatsApp
                </h3>
                <p className="text-purple-200 mb-4">
                  Atendimento rápido para orçamentos e pedidos personalizados.
                </p>
                <a
                  href="#"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-green-500/90 hover:bg-green-500 text-white font-semibold transition-all hover:scale-105"
                >
                  Chamar no WhatsApp
                </a>
              </div>
            </div>

            {/* Instagram */}
            <div className="flex items-start gap-5">
              <div className="text-3xl">📸</div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-1">
                  Instagram
                </h3>
                <p className="text-purple-200 mb-4">
                  Veja nossos trabalhos e fale com a gente pelo direct.
                </p>
                <a
                  href="#"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold transition-all hover:scale-105"
                >
                  Abrir Instagram
                </a>
              </div>
            </div>

            {/* Horário */}
            <div className="flex items-start gap-5 md:col-span-2">
              <div className="text-3xl">⏱️</div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-1">
                  Horário de Atendimento
                </h3>
                <p className="text-purple-200">
                  Segunda a sexta <br />
                  <strong className="text-white">08:00 às 18:00</strong>
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}


