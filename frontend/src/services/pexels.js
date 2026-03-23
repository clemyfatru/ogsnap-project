const API_KEY = import.meta.env.VITE_PEXELS_API_KEY

export async function searchPhotos(query, page = 1, perPage = 30) {
  const response = await fetch(
    `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`,
    {
      headers: {
        Authorization: API_KEY
      }
    }
  )

  if (!response.ok) {
    throw new Error('Erreur lors de la recherche Pexels')
  }

  return response.json()
}

export async function getCuratedPhotos(page = 1, perPage = 30) {
  const response = await fetch(
    `https://api.pexels.com/v1/curated?page=${page}&per_page=${perPage}`,
    {
      headers: {
        Authorization: API_KEY
      }
    }
  )

  if (!response.ok) {
    throw new Error('Erreur lors du chargement Pexels')
  }

  return response.json()
}
