import React from "react";
import { FaWhatsapp, FaInstagram } from "react-icons/fa";

export function FloatingButtons() {
  const handleWhatsapp = () => {
    const phone = "5585981501747";
    const text = encodeURIComponent("Olá! Gostaria de enviar meu mockup 3D.");
    window.open(`https://wa.me/${phone}?text=${text}`, "_blank");
  };

  const handleInstagram = () => {
    window.open("https://www.instagram.com/cometa_personalizacoes?igsh=YmhpeTA5eGsyYzNr", "_blank");
  };

  return (
    <div className="floating-buttons">
      <button
        className="float-btn float-btn-whatsapp"
        onClick={handleWhatsapp}
        aria-label="WhatsApp"
      >
        <FaWhatsapp size={26} />
      </button>

      <button
        className="float-btn float-btn-instagram"
        onClick={handleInstagram}
        aria-label="Instagram"
      >
        <FaInstagram size={26} />
      </button>
    </div>
  );
}


