import React from 'react';

// Carga dinámica de JSON en Vite/ESM
const reportModules = import.meta.glob('../db/*.json', { eager: true });
// Cada módulo es { default: {...} } para JSON, así que extraemos el valor
const denuncias = Object.values(reportModules).map((m) => m.default);

const DenuciaScreen = () => {
  // Contar categorías de estado_categorizado
  const categoryCounts = denuncias.reduce((acc, reporte) => {
    const cat = reporte.estado_categorizado || 'Desconocido';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="p-4">
      {/* Contador de categorías */}
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Contador de Categorías</h2>
        <ul className="list-disc list-inside">
          {Object.entries(categoryCounts).map(([cat, count]) => (
            <li key={cat} className="text-lg">
              {cat}: {count}
            </li>
          ))}
        </ul>
      </section>

      {/* Listado de todas las denuncias */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Listado de Denuncias</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {denuncias.map((d, index) => (
            <div key={index} className="border rounded-lg shadow-sm p-4">
              <h3 className="text-xl font-bold mb-2">{d.nombre || 'Sin nombre'}</h3>
              {/* Mostrar imagen si existe */}
              {d.foto && (
                <img
                  // resuelve la ruta del JSON a URL estática
                  src={new URL(`../db/${d.foto}`, import.meta.url).href}
                  alt={d.nombre}
                  className="w-full h-48 object-cover rounded mb-3"
                />
              )}
              <p><strong>Especie/Raza:</strong> {d.especie_raza}</p>
              <p><strong>Sexo:</strong> {d.sexo}</p>
              <p><strong>Edad:</strong> {d.edad}</p>
              <p><strong>Ubicación:</strong> {d.ubicacion}</p>
              <p><strong>Contacto:</strong> {d.contacto}</p>
              <p><strong>Prioridad:</strong> {d.prioridad}</p>
              <p><strong>Daños visibles:</strong> {d.danos_visibles}</p>
              <p><strong>Estado categorizado:</strong> {d.estado_categorizado}</p>
              <p><strong>Nivel de peligro:</strong> {d.nivel_peligro}</p>
              <p className="mt-2"><strong>Recomendaciones:</strong></p>
              <ul className="list-disc list-inside ml-4">
                {(d.recomendaciones || []).map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default DenuciaScreen;
