import { useState, useEffect } from 'react'
import { supabase } from "./lib/supabase"
import ImageUploader from './ImageUploader'
import Photos from './pages/Photos'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Success from './pages/Success'


function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
  if (window.location.pathname === '/success') {
    setCurrentPage('success')
    window.history.replaceState({}, '', '/')
  }

  async function loadUser(session) {
    // Récupérer le plan depuis la table users
    const { data: dbUser } = await supabase
      .from('users')
      .select('plan, images_used, images_limit')
      .eq('email', session.user.email)
      .single()

    setIsLoggedIn(true)
    setUser({
      id: session.user.id,
      email: session.user.email,
      name: session.user.user_metadata?.name || session.user.email,
      plan: dbUser?.plan || 'free',
      images_used: dbUser?.images_used || 0,
      images_limit: dbUser?.images_limit || 1
    })
  }

  supabase.auth.getSession().then(({ data: { session } }) => {
    if (session) loadUser(session)
  })

  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    if (session) {
      loadUser(session)
    } else {
      setIsLoggedIn(false)
      setUser(null)
    }
  })

  return () => subscription.unsubscribe()
}, [])


  function handleSelectPhoto(photoUrl) {
    setSelectedPhoto(photoUrl)
    setCurrentPage('home')
  }

  function handleLoginSuccess(userData) {
    setIsLoggedIn(true)
    setUser(userData)
    setCurrentPage('dashboard')
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    setIsLoggedIn(false)
    setUser(null)
    setCurrentPage('home')
  }

  return (
    <div>
      {currentPage !== 'home' && (
        <div className="fixed top-3 right-10 z-[999] flex gap-2">
          <button
            onClick={() => setCurrentPage('home')}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
          >
            ← Accueil
          </button>
        </div>
      )}

      {currentPage === 'home' && (
        <ImageUploader selectedPhoto={selectedPhoto} user={user} isLoggedIn={isLoggedIn} setCurrentPage={setCurrentPage} />
      )}

      {currentPage === 'photos' && (
        <Photos onSelectPhoto={handleSelectPhoto} />
      )}
      {currentPage === 'login' && (
        <Login onLoginSuccess={handleLoginSuccess} />
      )}
      {currentPage === 'dashboard' && (
        <Dashboard user={user} onLogout={handleLogout} />
      )}
      {currentPage === 'success' && <Success />}
    </div>
  )

}

export default App
