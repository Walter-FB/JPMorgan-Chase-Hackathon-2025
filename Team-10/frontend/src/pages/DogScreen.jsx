import React from 'react'
import { useParams } from 'react-router-dom'
import DogComponent from '../components/DogComponent'
import { pets } from '../db/pets'

const DogScreen = () => {
  const { id } = useParams()
  const pet = pets.find(p => p.id === parseInt(id, 10))

  if (!pet) {
    return (
      <div className="min-h-screen bg-gray-100 py-8 flex items-center justify-center">
        <p className="text-gray-600">Perro no encontrado</p>
      </div>
    )
  }

  const handleUpdateState = () => {
    console.log('ACTUALIZAR estado actual')
  }

  const handleUpdateLast = idx => {
    console.log(`ACTUALIZAR última actualización #${idx}`)
  }

  const handleViewHistory = idx => {
    console.log(`VER historial clínico #${idx}`)
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <DogComponent
        pet={pet}
        onUpdateState={handleUpdateState}
        onUpdateLast={handleUpdateLast}
        onViewHistory={handleViewHistory}
      />
    </div>
  )
}

export default DogScreen