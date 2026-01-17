import { useNavigate } from 'react-router-dom'
import React from 'react'

const DogComponent = ({
  pet,
  onUpdateState = () => {},
  onUpdateLast = i => {},
  onViewHistory = i => {},
}) => {
  const navigate = useNavigate()
  return (
    <div className="max-w-md md:max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto p-6 bg-yellow-50 rounded-lg shadow-md font-sans text-gray-800 space-y-6">
      {/* Volver a búsqueda */}
      <button
        onClick={() => navigate(-1)}
        className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm px-3 py-1 rounded"
      >
        Volver
      </button>
      {/* Encabezado */}
      <header className="text-center">
        <h1 className="inline-block bg-orange-400 text-white text-lg font-bold px-4 py-2 rounded">
          FICHA DE INFORMACIÓN
        </h1>
      </header>

      {/* INFO + INGRESO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Información */}
        <section className="bg-white rounded-lg shadow p-4">
          <div className="flex items-start space-x-4">
            <img
              src={pet.image}
              alt={pet.name}
              className="w-24 h-24 md:w-32 md:h-32 rounded-lg object-cover bg-gray-200"
            />
            <div className="text-sm space-y-1">
              <p><strong>Nombre:</strong> {pet.name}</p>
              <p className="flex items-center space-x-2">
                <strong>Estado:</strong>
                <span className="font-semibold capitalize">{pet.currentState}</span>
                <span
                  className={`inline-block w-3 h-3 rounded-full
                    ${pet.currentState.includes('adopción')
                      ? 'bg-green-500'
                      : pet.currentState.includes('refugio')
                      ? 'bg-yellow-500'
                      : pet.currentState.includes('tratamiento')
                      || pet.currentState.includes('enfermo')
                      || pet.currentState.includes('herido')
                      ? 'bg-red-500'
                      : 'bg-gray-500'}`}
                ></span>
              </p>
              <p><strong>Sexo:</strong> {pet.sex}</p>
              <p><strong>Raza:</strong> {pet.breed}</p>
              <p><strong>Descripción:</strong> {pet.description}</p>
            </div>
          </div>
        </section>

        {/* Datos de ingreso */}
        <section className="bg-white rounded-lg shadow p-4">
          <h2 className="text-orange-500 font-semibold mb-2">DATOS DE INGRESO</h2>
          <div className="bg-gray-50 border border-gray-200 rounded p-3 text-sm space-y-1">
            <p><strong>Fecha:</strong> {pet.admissionDate}</p>
            <p><strong>Informe:</strong> Ingresó al refugio con una condición…</p>
            <p><strong>Firmado por:</strong> {pet.admissionBy}</p>
          </div>
        </section>
      </div>

      {/* PERSONALIDAD + ESTADO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personalidad */}
        <section className="bg-white rounded-lg shadow p-4">
          <h2 className="text-orange-500 font-semibold mb-2">PERSONALIDAD</h2>
          <ul className="list-disc list-inside text-sm space-y-1 bg-gray-50 p-3 rounded">
            <li><strong>Temperamento:</strong> {pet.temperament}</li>
            <li><strong>Sociabilidad:</strong> {pet.socialization}</li>
            <li><strong>Observaciones:</strong> {pet.observations}</li>
          </ul>
        </section>

        {/* Estado actual */}
        <section className="bg-white rounded-lg shadow p-4 flex flex-col justify-between">
          <div>
            <h2 className="text-orange-500 font-semibold mb-2">ESTADO ACTUAL</h2>
            <ul className="text-sm space-y-1 bg-gray-50 p-3 rounded">
              <li><strong>Ubicación:</strong> {pet.location}</li>
              <li><strong>Estado:</strong> {pet.currentState}</li>
              <li><strong>Cuidador:</strong> {pet.caregiver}</li>
            </ul>
          </div>
          <button
            onClick={onUpdateState}
            className="mt-4 self-end bg-orange-400 hover:bg-orange-500 text-white font-medium px-4 py-1 rounded shadow"
          >
            ACTUALIZAR
          </button>
        </section>
      </div>

      {/* ÚLTIMA ACTUALIZACIÓN */}
      <section className="bg-white rounded-lg shadow p-4">
        <h2 className="text-orange-500 font-semibold mb-2">ÚLTIMA ACTUALIZACIÓN</h2>
        {pet.lastUpdates.map((u, i) => (
          <div key={i} className="bg-gray-50 border border-gray-200 rounded p-3 mb-3 text-sm space-y-1">
            <p><strong>Fecha:</strong> {u.date}</p>
            <p><strong>Realizado por:</strong> {u.by}</p>
            <p><strong>Informe:</strong> {u.report}</p>
            <button
              onClick={() => onUpdateLast(i)}
              className="mt-1 bg-orange-400 hover:bg-orange-500 text-white text-xs px-3 py-1 rounded"
            >
              ACTUALIZAR
            </button>
          </div>
        ))}
      </section>

      {/* HISTORIA CLÍNICA */}
      <section className="bg-white rounded-lg shadow p-4">
        <h2 className="text-orange-500 font-semibold mb-2">HISTORIA CLÍNICA</h2>
        {pet.history.map((h, i) => (
          <div key={i} className="mb-4">
            <h3 className="font-medium text-sm mb-1">{h.label}</h3>
            <ul className="list-disc list-inside text-sm bg-gray-50 p-3 rounded space-y-1">
              {h.records.map((rec, j) => (
                <li key={j}>
                  {rec.date} – {rec.vaccine || rec.product || rec.type}
                  {rec.dose ? ` (${rec.dose})` : ''}
                  {rec.route ? ` via ${rec.route}` : ''}
                  {rec.result ? `: ${rec.result}` : ''}
                  {rec.next ? ` | Próx: ${rec.next}` : ''}
                </li>
              ))}
            </ul>
            <button
              onClick={() => onViewHistory(i)}
              className="mt-1 bg-yellow-400 hover:bg-yellow-500 text-white text-xs px-3 py-1 rounded"
            >
              ver historial
            </button>
          </div>
        ))}
      </section>
    </div>
  )
}

export default DogComponent