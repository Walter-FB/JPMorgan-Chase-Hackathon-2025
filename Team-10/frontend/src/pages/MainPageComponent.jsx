import React from "react";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../assets/blob-scene-haikei1.png";
import completeLogo from "../assets/image1.png";
const MainPageComponent = () => {
  const navigate = useNavigate();
  return (
    <div
      className="w-screen h-screen bg-center bg-cover flex flex-col justify-center items-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <img src={completeLogo} alt="Logo" className="h-24 w-auto mb-4" />
      <h1 className="text-3xl md:text-5xl italic font-extrabold text-orange-500 drop-shadow-lg mb-8">
        ¡Bienvenido a El Campito Refugio!
      </h1>
      <button
        onClick={() => navigate("/busqueda")}
        className="mb-4 w-56 px-6 py-3 text-sm font-semibold uppercase text-orange-500 bg-white border border-orange-500 rounded-lg shadow hover:bg-orange-50 transition"
      >
        Cargar Nuevo Ingreso
      </button>
      <button
        onClick={() => navigate("/busqueda")}
        className="w-56 px-6 py-3 text-sm font-semibold uppercase bg-orange-500 text-white rounded-lg shadow-md hover:bg-orange-600 transition"
      >
        Ver Perros
      </button>
    </div>
  );
};

export default MainPageComponent;
