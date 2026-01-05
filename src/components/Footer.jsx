import React from "react";

export function Footer() {
  return (
    <footer className="bg-[#0a0a0c] border-t border-white/5 pt-10 pb-6">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm text-gray-400">
        
        {/* Coluna 1: Sobre */}
        <div>
          <h3 className="text-white font-bold mb-4 uppercase tracking-widest text-xs">Cometa Personalização</h3>
          <p className="leading-relaxed">
            Especialistas em uniformes esportivos de alta performance. 
            Transformando a identidade do seu time em realidade 3D.
          </p>
        </div>

        {/* Coluna 2: Links Úteis */}
        <div>
          <h3 className="text-white font-bold mb-4 uppercase tracking-widest text-xs">Institucional</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-white transition">Termos de Uso</a></li>
            <li><a href="#" className="hover:text-white transition">Política de Privacidade</a></li>
            <li><a href="#" className="hover:text-white transition">Prazos de Entrega</a></li>
          </ul>
        </div>

        {/* Coluna 3: Atendimento */}
        <div>
          <h3 className="text-white font-bold mb-4 uppercase tracking-widest text-xs">Suporte</h3>
          <p>Segunda a Sexta: 08h às 18h</p>
          <p className="mt-2">contato@cometapersonalizacao.com.br</p>
        </div>
      </div>

      <div className="mt-10 pt-6 border-t border-white/5 text-center text-[10px] text-gray-500 uppercase tracking-tighter">
        © {new Date().getFullYear()} Cometa — Todos os direitos reservados. 
        <span className="block mt-1"></span>
      </div>
    </footer>
  );
}
