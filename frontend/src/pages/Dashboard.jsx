import { useState } from 'react'
import { supabase } from '../lib/supabase'

function Dashboard({ user, onLogout }) {
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [pwError, setPwError] = useState('')
  const [pwSuccess, setPwSuccess] = useState('')
  const [pwLoading, setPwLoading] = useState(false)

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

  if (!user) return <p className="text-center mt-20 text-gray-500">Chargement...</p>

  const planLabels = {
    free: { name: 'Gratuit', color: 'bg-gray-100 text-gray-600', icon: '🆓' },
    starter: { name: 'Starter', color: 'bg-blue-100 text-blue-700', icon: '⚡' },
    pro: { name: 'Pro', color: 'bg-purple-100 text-purple-700', icon: '⭐' },
    agency: { name: 'Agency', color: 'bg-amber-100 text-amber-700', icon: '🏢' }
  }
  const currentPlan = planLabels[user.plan] || planLabels.free
  const usagePercent = Math.min((user.images_used / user.images_limit) * 100, 100)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-3xl text-white font-bold">
              {user.email.charAt(0).toUpperCase()}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Mon compte</h1>
          <p className="text-gray-500 mt-1">{user.email}</p>
        </div>

        {/* Plan Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Mon forfait</h2>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${currentPlan.color}`}>
              {currentPlan.icon} {currentPlan.name}
            </span>
          </div>
          
          {/* Usage bar */}
          <div className="mb-2">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Images générées</span>
              <span className="font-semibold">{user.images_used} / {user.images_limit}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3">
              <div
                className="h-3 rounded-full transition-all duration-500"
                style={{
                  width: `${usagePercent}%`,
                  background: usagePercent > 80
                    ? 'linear-gradient(90deg, #f59e0b, #ef4444)'
                    : 'linear-gradient(90deg, #6366f1, #8b5cf6)'
                }}
              />
            </div>
          </div>
          {usagePercent > 80 && (
            <p className="text-xs text-amber-600 mt-1">⚠️ Vous approchez de votre limite</p>
          )}
        </div>

        {/* Upgrade Card */}
        {(user.plan === 'free' || user.plan === 'starter') && (
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 mb-4 text-white shadow-md">
            <h3 className="font-bold text-lg mb-1">🚀 Envie de plus ?</h3>
            <p className="text-indigo-100 text-sm mb-4">
              Passez à un forfait supérieur pour débloquer plus de templates et d'images.
            </p>
            <button
              onClick={() => {/* TODO: upgrade flow */}}
              className="bg-white text-indigo-600 font-semibold px-6 py-2.5 rounded-xl hover:bg-indigo-50 transition shadow-sm"
            >
              Voir les forfaits
            </button>
          </div>
        )}

        {/* Actions Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-4">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Paramètres</h2>
          
          {!showChangePassword ? (
            <button
              onClick={() => setShowChangePassword(true)}
              className="w-full text-left px-4 py-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition flex items-center justify-between group"
            >
              <span className="flex items-center gap-3 text-gray-700">
                <span className="text-xl">🔑</span>
                <span className="font-medium">Modifier mon mot de passe</span>
              </span>
              <span className="text-gray-400 group-hover:text-gray-600">→</span>
            </button>
          ) : (
            <form onSubmit={handleChangePassword} className="bg-gray-50 rounded-xl p-5">
              <h3 className="font-semibold text-gray-700 mb-3">Nouveau mot de passe</h3>
              
              {pwError && (
                <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-lg mb-3">
                  ❌ {pwError}
                </div>
              )}
              {pwSuccess && (
                <div className="bg-green-50 text-green-600 text-sm px-4 py-2 rounded-lg mb-3">
                  {pwSuccess}
                </div>
              )}

              <input
                type="password"
                placeholder="Nouveau mot de passe"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                required
              />
              <input
                type="password"
                placeholder="Confirmer le mot de passe"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                required
              />
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={pwLoading}
                  className="bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-600 transition disabled:opacity-50"
                >
                  {pwLoading ? '⏳...' : '✓ Confirmer'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowChangePassword(false); setPwError(''); setPwSuccess('') }}
                  className="bg-gray-200 text-gray-600 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-300 transition"
                >
                  Annuler
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Logout */}
        <div className="text-center mt-6">
          <button
            onClick={onLogout}
            className="text-red-400 hover:text-red-600 text-sm font-medium transition"
          >
            Se déconnecter
          </button>
        </div>

      </div>
    </div>
  )
}

export default Dashboard
