import React from "react";
import logo from "../assets/image5.png";
import { useNavigate } from "react-router-dom";

const HeaderComponent = () => {
  const navigate = useNavigate();

  // comprobar sesión
  const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";

  const irAPerfil = () => {
    navigate("/profile");
  };
  const irLogin = () => {
    navigate("/login");
  };
  const irMain = () => {
    navigate("/");
  };

  return (
    <div className="flex justify-between items-center w-full px-4">
      <div className="flex items-center">
        <img src={logo} alt="Logo" className="h-10 w-auto" />
        <h1 className="ml-2 text-xl font-bold text-gray-800">
          El Campito Refugio
        </h1>
      </div>
      {!isLoggedIn ? (
        <button
          onClick={irLogin}
          className="text-black px-4 py-2 rounded hover:bg-orange-600 transition"
        >
          Iniciar sesión
        </button>
      ) : (
        <div className="space-x-2">
          <button
            onClick={irAPerfil}
            className="text-black px-4 py-2 rounded hover:bg-orange-600 transition"
          >
            Ver Perfil
          </button>
          <button
            onClick={() => {
              sessionStorage.removeItem("isLoggedIn");
              sessionStorage.removeItem("userEmail");
              irMain();
            }}
            className="text-black px-4 py-2 rounded hover:bg-orange-600 transition"
          >
            Cerrar Sesión
          </button>
        </div>
      )}
    </div>
  );
};

export default HeaderComponent;
