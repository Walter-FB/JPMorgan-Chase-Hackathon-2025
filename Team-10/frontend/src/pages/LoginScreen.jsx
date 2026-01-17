import React, { useState } from "react";
import centerImage from "../assets/image1.png";
import { useNavigate } from "react-router-dom";

const LoginScreen = () => {
  const [useEmail, setUseEmail] = useState("");
  const navigate = useNavigate();

  // Al autenticar, guardar sesión en sessionStorage
  const autenticarUsuario = (e) => {
    e.preventDefault();
    if (useEmail === "Romina@gmail.com") {
      sessionStorage.setItem("isLoggedIn", "true");
      sessionStorage.setItem("userEmail", useEmail);
      navigate("/profile");
    }
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* Imagen centrada */}
      <img src={centerImage} alt="Logo" className="w-32 h-32 mb-6" />

      {/* Formulario */}
      <form
        onSubmit={autenticarUsuario}
        className="bg-white p-6 rounded shadow-md w-80"
      >
        <h2 className="text-2xl font-bold text-center mb-4 text-orange-500">
          Iniciar sesión
        </h2>

        <div className="mb-4">
          <label
            className="block text-gray-700 font-medium mb-1"
            htmlFor="email"
            placeholder="Email"
          >
            {/* {useEmail} */}
            {/* {console.log(`El valor del useEmail es: ${useEmail}`)} */}
          </label>
          <input
            type="email"
            onChange={(e) => {
              e.preventDefault();
              setUseEmail(e.target.value);
              console.log(useEmail);
            }}
            id="email"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="tuemail@example.com"
            value={useEmail}
          />
        </div>

        <div className="mb-6">
          <label
            className="block text-gray-700 font-medium mb-1"
            htmlFor="password"
          >
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="********"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 transition"
        >
          Iniciar sesión
        </button>
      </form>
    </div>
  );
};

export default LoginScreen;
