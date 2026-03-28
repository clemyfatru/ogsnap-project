import { useState, useEffect } from 'react'
import { supabase } from "./lib/supabase"
import ImageUploader from './ImageUploader'
import Photos from './pages/Photos'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Success from './pages/Success'
import ResetPassword from './pages/ResetPassword'
import Pricing from './pages/Pricing'

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

    if (window.location.pathname === '/reset-password') {
      setCurrentPage('reset-password')
      window.history.replaceState({}, '', '/reset-password')
    }

    async function loadUser(session) {
      try {
        const { data: dbUser, error: selectError } = await supabase
          .from('users')
          .select('plan, images_used, images_limit')
          .eq('id', session.user.id)
          .maybeSingle()

        if (selectError) {
          console.error('Erreur select user:', selectError)
        }

        let finalUser = dbUser

        if (!dbUser) {
          const { data: newUser, error: insertError } = await supabase
            .from('users')
            .upsert({
              id: session.user.id,
              email: session.user.email,
              plan: 'free',
              images_used: 0,
              images_limit: 1
            })
            .select('plan, images_used, images_limit')
            .single()

          if (insertError) {
            console.error('Erreur insert user:', insertError)
          }
          finalUser = newUser
        }

        setIsLoggedIn(true)
        setUser({
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.name || session.user.email,
          plan: finalUser?.plan || 'free',
          images_used: finalUser?.images_used || 0,
          images_limit: finalUser?.images_limit || 1
        })
      } catch (err) {
        console.error('loadUser crash:', err)
        setIsLoggedIn(true)
        setUser({
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.name || session.user.email,
          plan: 'free',
          images_used: 0,
          images_limit: 1
        })
      }
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

  function handleLoginSuccess() {
    setCurrentPage('home')
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    setIsLoggedIn(false)
    setUser(null)
    setCurrentPage('home')
  }

  return (
    <div>
      {currentPage !== 'home' && currentPage !== 'reset-password' && (
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
        <Dashboard user={user} onLogout={handleLogout} setCurrentPage={setCurrentPage} />
      )}
      {currentPage === 'pricing' && (
        <Pricing user={user} />
      )}
      {currentPage === 'success' && <Success />}
      {currentPage === 'reset-password' && <ResetPassword />}
    </div>
  )
}

export default App
