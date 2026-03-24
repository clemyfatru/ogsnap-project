import { useState, useEffect } from 'react'

const API_URL = 'https://ogsnap-backend.onrender.com'

function Dashboard({ onLogout }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUser()
  }, [])

  async function fetchUser() {
    const token = localStorage.getItem('token')
    const res = await fetch(`${API_URL}/api/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = await res.json()
    setUser(data.user)
    setLoading(false)
  }

  async function handleUpgrade() {
    const token = localStorage.getItem('token')
    const res = await fetch(`${API_URL}/api/create-checkout-session`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = await res.json()
    window.location.href = data.url
  }

  if (loading) return <p>Chargement...</p>

  return (
    <div style={{ padding: 30 }}>
      <h2>Mon compte</h2>
      <p><strong>Email :</strong> {user.email}</p>
      <p><strong>Plan :</strong> {user.plan === 'pro' ? '⭐ Pro' : 'Gratuit'}</p>
      <p><strong>Images :</strong> {user.images_used} / {user.images_limit}</p>

      {user.plan === 'free' && (
        <button
          onClick={handleUpgrade}
          style={{
            marginTop: 20,
            padding: '12px 24px',
            background: '#6366f1',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            fontSize: 16,
            cursor: 'pointer'
          }}
        >
          🚀 Passer au plan Pro
        </button>
      )}

      <br />
      <button
        onClick={onLogout}
        style={{
          marginTop: 20,
          padding: '10px 20px',
          background: '#ef4444',
          color: 'white',
          border: 'none',
          borderRadius: 8,
          cursor: 'pointer'
        }}
      >
        Se déconnecter
      </button>
    </div>
  )
}

export default Dashboard
