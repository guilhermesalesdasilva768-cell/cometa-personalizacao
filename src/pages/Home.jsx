import {
  Star,
  Shirt,
  ShoppingBag,
  Sparkles,
  Download,
  MessageCircle,
} from "lucide-react";

export default function Home({ onGoToCustomizer, onGoToProducts }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-black to-purple-900">

      {/* HERO */}
      <section className="relative overflow-hidden pt-24 pb-32 px-4 comet-bg hero-premium">
        <div className="relative z-10 max-w-4xl mx-auto text-center">

          {/* BADGE */}
          <div className="inline-flex items-center gap-2 
            bg-purple-500/20 px-6 py-2 rounded-full mb-6 
            backdrop-blur-sm border border-purple-500/30">
            <Star className="w-5 h-5 text-yellow-400" />
            <span className="text-purple-200 font-semibold">
              Personalização Profissional
            </span>
          </div>

          {/* TÍTULO */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Cometa{" "}
            <span className="text-transparent bg-clip-text 
              bg-gradient-to-r from-purple-400 to-pink-400">
              Personalização
            </span>
          </h1>

          {/* DESCRIÇÃO */}
          <p className="text-xl md:text-2xl text-purple-200 mb-10 max-w-2xl mx-auto">
            Você pensa a gente estampa, faça seu modelo inserindo a imagem na blusa, depois é só mandar em nosso WhatsApp ou Instagram.
          </p>

          {/* BOTÕES */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onGoToCustomizer}
              className="
                bg-gradient-to-r from-purple-600 to-pink-600
                text-white px-8 py-4 rounded-full font-bold text-lg
                hover:scale-105 transition-transform
                flex items-center gap-2 justify-center
                shadow-lg shadow-purple-500/50
              "
            >
              <Shirt className="w-5 h-5" />
              Criar Minha Camisa
            </button>

            <button
              onClick={onGoToProducts}
              className="
                bg-white/10 backdrop-blur-sm text-white
                px-8 py-4 rounded-full font-bold text-lg
                hover:bg-white/20 transition-all
                border border-white/20
                flex items-center gap-2 justify-center
              "
            >
              <ShoppingBag className="w-5 h-5" />
              Ver Produtos
            </button>
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="py-24 px-4 bg-black/40 backdrop-blur-sm comet-bg">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-white mb-4">
            Como Funciona
          </h2>

          <p className="text-purple-200 text-center mb-16 max-w-2xl mx-auto">
            Em 3 passos simples você cria sua camisa personalizada com qualidade profissional
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Sparkles className="w-12 h-12" />,
                title: "1. Crie seu Design",
                desc: "Use nosso editor 3D para adicionar textos, imagens e escolher cores",
              },
              {
                icon: <Download className="w-12 h-12" />,
                title: "2. Baixe a Imagem",
                desc: "Salve seu design personalizado em alta qualidade",
              },
              {
                icon: <MessageCircle className="w-12 h-12" />,
                title: "3. Faça seu Pedido",
                desc: "Envie para nós pelo WhatsApp ou Instagram e receba em casa",
              },
            ].map((step, i) => (
              <div
                key={i}
                className="
                  bg-gradient-to-br from-purple-900/50 to-black/50
                  p-8 rounded-2xl
                  border border-purple-500/30
                  backdrop-blur-sm
                  hover:scale-105 transition-transform
                "
              >
                <div className="text-purple-400 mb-4">{step.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-purple-200">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}









