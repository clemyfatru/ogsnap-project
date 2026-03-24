import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const API_URL = 'https://ogsnap-backend.onrender.com'

function Dashboard({ onLogout }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [pwError, setPwError] = useState('')
  const [pwSuccess, setPwSuccess] = useState('')
  const [pwLoading, setPwLoading] = useState(false)

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

  async function handleChangePassword(e) {
    e.preventDefault()
    setPwError('')
    setPwSuccess('')

    if (newPassword.length < 6) {
      setPwError('Le mot de passe doit contenir au moins 6 caractères')
      return
    }
    if (newPassword !== confirmPassword) {
      setPwError('Les mots de passe ne correspondent pas')
      return
    }

    setPwLoading(true)
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    setPwLoading(false)

    if (error) {
      setPwError(error.message)
    } else {
      setPwSuccess('✅ Mot de passe modifié avec succès !')
      setNewPassword('')
      setConfirmPassword('')
      setTimeout(() => {
        setShowChangePassword(false)
        setPwSuccess('')
      }, 2000)
    }
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

      {/* ---- Modifier mot de passe ---- */}
      <div style={{ marginTop: 30 }}>
        {!showChangePassword ? (
          <button
            onClick={() => setShowChangePassword(true)}
            style={{
              padding: '10px 20px',
              background: '#f59e0b',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              fontSize: 14
            }}
          >
            🔐 Modifier mon mot de passe
          </button>
        ) : (
          <div style={{
            background: '#f9fafb',
            padding: 20,
            borderRadius: 12,
            maxWidth: 400
          }}>
            <h3 style={{ marginBottom: 10 }}>🔐 Nouveau mot de passe</h3>
            {pwError && <p style={{ color: '#ef4444', fontSize: 14 }}>{pwError}</p>}
            {pwSuccess && <p style={{ color: '#22c55e', fontSize: 14 }}>{pwSuccess}</p>}
            <form onSubmit={handleChangePassword}>
              <input
                type="password"
                placeholder="Nouveau mot de passe"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '10px 14px',
                  border: '1px solid #e5e7eb',
                  borderRadius: 8,
                  marginBottom: 10,
                  fontSize: 14
                }}
                required
              />
              <input
                type="password"
                placeholder="Confirmer le mot de passe"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '10px 14px',
                  border: '1px solid #e5e7eb',
                  borderRadius: 8,
                  marginBottom: 15,
                  fontSize: 14
                }}
                required
              />
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  type="submit"
                  disabled={pwLoading}
                  style={{
                    padding: '10px 20px',
                    background: '#6366f1',
                    color: 'white',
                    border: 'none',
                    borderRadius: 8,
                    cursor: 'pointer',
                    fontSize: 14
                  }}
                >
                  {pwLoading ? '⏳...' : 'Confirmer'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowChangePassword(false); setPwError(''); setPwSuccess('') }}
                  style={{
                    padding: '10px 20px',
                    background: '#e5e7eb',
                    color: '#374151',
                    border: 'none',
                    borderRadius: 8,
                    cursor: 'pointer',
                    fontSize: 14
                  }}
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

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
