import React from "react";
import profilePicture from "../assets/image3.png";
import { useNavigate } from "react-router-dom";

const ProfileScreen = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center mt-5">
      <h2 className="text-4xl font-extrabold text-orange-500 text-center">
        MI PERFIL
      </h2>

      <div className="w-40 h-1 bg-orange-500 mt-2"></div>

      <img
        src={profilePicture}
        alt="Descripción"
        className="w-32 h-auto mt-5"
      />

      <div className="w-40 h-1 bg-orange-500 mt-4"></div>

      <div className="mt-4 space-y-2">
        <p className="text-lg">
          <span className="text-orange-500 font-semibold">Nombre: </span>
          <span className="text-black">Romina</span>
        </p>
        <p className="text-lg">
          <span className="text-orange-500 font-semibold">Apellido: </span>
          <span className="text-black">Jurado</span>
        </p>
        <p className="text-lg">
          <span className="text-orange-500 font-semibold">Edad: </span>
          <span className="text-black">22</span>
        </p>
        <p className="text-lg">
          <span className="text-orange-500 font-semibold">
            Fecha de Nacimiento:{" "}
          </span>
          <span className="text-black">15/12/2002</span>
        </p>
        <p className="text-lg">
          <span className="text-orange-500 font-semibold">
            Tipo de colaborador:{" "}
          </span>
          <span className="text-black">Ayudante</span>
        </p>
        <p className="text-lg">
          <span className="text-orange-500 font-semibold">Organización: </span>
          <span className="text-black">IDEEA</span>
        </p>
      </div>

      <div className="w-40 h-1 bg-orange-500 mt-4"></div>

      <button
        onClick={() => navigate("/busqueda")}
        className="mt-6 bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600 transition"
      >
        Confirmar
      </button>
    </div>
  );
};

export default ProfileScreen;
