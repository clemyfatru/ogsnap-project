import { useState, useEffect } from 'react'
import { searchPhotos, getCuratedPhotos } from '../services/pexels'

function Photos({ onSelectPhoto }) {
  const [photos, setPhotos] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)

  useEffect(() => {
    loadCurated()
  }, [])

  async function loadCurated() {
    setLoading(true)
    try {
      const data = await getCuratedPhotos(1, 30)
      setPhotos(data.photos)
    } catch (error) {
      console.error(error)
    }
    setLoading(false)
  }

  async function handleSearch(e) {
    e.preventDefault()
    if (!search.trim()) return
    setLoading(true)
    setPage(1)
    try {
      const data = await searchPhotos(search, 1)
      setPhotos(data.photos)
    } catch (error) {
      console.error(error)
    }
    setLoading(false)
  }

  function handleSelectPhoto(photo) {
    localStorage.setItem('selectedPhoto', JSON.stringify({
      url: photo.src.large,
      photographer: photo.photographer
    }))
    if (onSelectPhoto) {
      onSelectPhoto(photo.src.large)
    }
    
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-900 py-12 px-4">
        <h1 className="text-4xl font-bold text-center mb-6">📸 Banque de Photos</h1>
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher des photos..."
            className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-xl font-semibold transition"
          >
            Rechercher
          </button>
        </form>
      </div>

      {/* Grille de photos */}
      <div className="max-w-7xl mx-auto p-6">
        {loading ? (
          <p className="text-center text-gray-400 text-xl py-20">Chargement...</p>
        ) : (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="break-inside-avoid group relative cursor-pointer"
                onClick={() => handleSelectPhoto(photo)}
              >
                <img
                  src={photo.src.medium}
                  alt={photo.alt}
                  className="w-full rounded-xl hover:opacity-90 transition"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 rounded-b-xl opacity-0 group-hover:opacity-100 transition">
                  <p className="text-sm text-white">📷 {photo.photographer}</p>
                  <p className="text-xs text-purple-300 mt-1">Cliquez pour utiliser cette photo</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Photos
