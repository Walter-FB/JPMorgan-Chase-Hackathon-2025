import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { pets } from '../db/pets'

export default function SearchScreen() {
  const [query, setQuery] = useState('')
  const [filterState, setFilterState] = useState('all')    // new filter state
  // show all by default, sorted by estado
  const [results, setResults] = useState(
    [...pets].sort((a,b) => {
      const rank = s =>
        s.includes('tratamiento')||s.includes('enfermo')||s.includes('herido')?0:
        s.includes('refugio')?1:
        s.includes('adopción')?2:3
      return rank(a.currentState) - rank(b.currentState) || a.name.localeCompare(b.name)
    })
  )
  const navigate = useNavigate()

  const stateRank = s =>
    s.includes('tratamiento')||s.includes('enfermo')||s.includes('herido')?0:
    s.includes('refugio')?1:
    s.includes('adopción')?2:3

  const handleSearch = () => {
    let filtered = pets.filter(p =>
      p.name.toLowerCase().includes(query.toLowerCase())
    )
    if (filterState !== 'all') {
      filtered = filtered.filter(p => {
        if (filterState === 'critical')
          return p.currentState.match(/tratamiento|enfermo|herido/)
        if (filterState === 'refugio')
          return p.currentState.includes('refugio')
        if (filterState === 'adopcion')
          return p.currentState.includes('adopción')
        return true
      })
    }
    filtered.sort((a,b) =>
      stateRank(a.currentState) - stateRank(b.currentState) ||
      a.name.localeCompare(b.name)
    )
    setResults(filtered)
  }

  // cuando cambia filterState, re-filtrar automáticamente
  useEffect(() => {
    handleSearch()
  }, [filterState])

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white p-4 md:p-8">
      {/* Header */}
      <header className="flex justify-center mb-8">
        <img
          src="../../public/logo.png"
          alt="El Campito Refugio"
          className="h-12 md:h-20 lg:h-24 xl:h-32"
        />
      </header>

      {/* Search box */}
      <div className="max-w-md mx-auto mb-6">
        <label className="block text-lg font-semibold text-gray-700 mb-2">
          Nombre del perro
        </label>
        <div className="flex">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Escribir..."
            className="flex-1 px-4 py-2 rounded-l-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-orange-400 text-white rounded-r-xl hover:bg-orange-500 transition"
          >
            Buscar
          </button>
        </div>
        {/* Estado filter */}
        <div className="mt-4 flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Filtrar por estado:</label>
          <select
            value={filterState}
            onChange={e => setFilterState(e.target.value)}
            className="px-2 py-1 border border-gray-300 rounded focus:outline-none"
          >
            <option value="all">Todos</option>
            <option value="critical">Crítico</option>
            <option value="refugio">Refugio</option>
            <option value="adopcion">Adopción</option>
          </select>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-full mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ">
        {results.map(p => (
          <div
            key={p.id}
            className="flex flex-col items-center justo bg-yellow-100 rounded-lg shadow-md overflow-hidden"
          >
            <img
              src={p.image}
              alt={p.name}
              className="
                w-20 h-20
                md:w-24 md:h-24
                lg:w-32 lg:h-32
                object-cover
              "
            />
            <div className="flex-1 px-4 py-3 text-center sm:text-left flex flex-col items-center">
              <h3 className="text-orange-600 font-bold text-lg">
                {p.name} <span className="text-sm text-gray-500">({p.age || '–'} años)</span>
              </h3>
              <p className="text-sm text-gray-700 flex justify-center sm:justify-start items-center space-x-2">
                <span>Estado:</span>
                <span className="font-semibold capitalize">{p.currentState}</span>
                <span
                  className={`inline-block w-3 h-3 rounded-full
                    ${p.currentState.includes('adopción')
                      ? 'bg-green-500'
                      : p.currentState.includes('refugio')
                      ? 'bg-yellow-500'
                      : p.currentState.includes('tratamiento')
                      || p.currentState.includes('enfermo')
                      || p.currentState.includes('herido')
                      ? 'bg-red-500'
                      : 'bg-gray-500'}`}
                ></span>
              </p>
            </div>
            <button
              onClick={() => navigate(`/dog/${p.id}`)}
              className={`mb-2 px-4 py-2 text-white text-sm rounded-full transition bg-orange-500 hover:bg-orange-600`
              }
            >
              ver info
            </button>
          </div>
        ))}
        {results.length === 0 && query && (
          <p className="text-center text-gray-500">No se encontraron perros.</p>
        )}
      </div>
    </div>
  )
}
