import React, { useState } from "react";
import "./styles.css";

import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { FloatingButtons } from "./components/FloatingButtons";

import Home from "./pages/Home";
import { Customizer } from "./pages/Customizer";
import { Products } from "./pages/Products";
import { Contact } from "./pages/Contact";

export default function App() {
  const [page, setPage] = useState("home");

  return (
    <div className="app-root">
      <Header onNavigate={setPage} currentPage={page} />

{/* HERO FORA DO CONTAINER */}
{page === "home" && (
  <Home onGoToCustomizer={() => setPage("customizer")}
  onGoToProducts={() => setPage("products")} />
)}

{/* CONTEÚDO LIMITADO */}
<main className="main-content">
  {page === "customizer" && <Customizer />}
  {page === "products" && <Products />}
  {page === "contact" && <Contact />}
</main>


      <Footer />
      <FloatingButtons />
    </div>
  );
}

