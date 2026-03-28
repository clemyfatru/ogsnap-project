import { useState } from 'react'

function Pricing({ user }) {
  const [loading, setLoading] = useState(null)
  const [error, setError] = useState('')

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://ogsnap-backend.onrender.com'

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      price: '9',
      icon: '⚡',
      color: 'from-blue-500 to-blue-600',
      features: ['50 images/mois', '5 templates', 'Support email'],
      priceEnv: 'starter',
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '29',
      icon: '⭐',
      color: 'from-purple-500 to-purple-600',
      popular: true,
      features: ['200 images/mois', 'Tous les templates', 'Support prioritaire', 'API access'],
      priceEnv: 'pro',
    },
    {
      id: 'agency',
      name: 'Agency',
      price: '79',
      icon: '🏢',
      color: 'from-amber-500 to-amber-600',
      features: ['Images illimitées', 'Tous les templates', 'Support dédié', 'API access', 'White label'],
      priceEnv: 'agency',
    },
  ]

  async function handleCheckout(planId) {
    setLoading(planId)
    setError('')

    try {
      const res = await fetch(`${BACKEND_URL}/api/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
  plan: planId,
  email: user.email,   // ← "email" pas "customerEmail"
}),

      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de la création du paiement')
      }

      window.location.href = data.url
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(null)
    }
  }

  const currentPlan = user?.plan || 'free'

  return (
    <div className="min-h-screen py-16 px-4" style={{ background: 'linear-gradient(135deg, #fdf6ee 0%, #f5efe6 40%, #eee8df 100%)' }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-800 mb-3">Choisissez votre forfait</h1>
          <p className="text-gray-500">Votre forfait actuel : <span className="font-semibold capitalize">{currentPlan}</span></p>
        </div>

        {error && (
          <div className="max-w-md mx-auto mb-8 bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl text-center">
            ❌ {error}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const isCurrentPlan = currentPlan === plan.id
            return (
              <div
                key={plan.id}
                className={`relative bg-white/80 backdrop-blur rounded-2xl shadow-sm border p-6 flex flex-col ${
                  plan.popular ? 'border-purple-300 ring-2 ring-purple-200' : 'border-white/60'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    POPULAIRE
                  </div>
                )}

                <div className="text-center mb-6">
                  <div className={`w-14 h-14 bg-gradient-to-br ${plan.color} rounded-2xl flex items-center justify-center mx-auto mb-3`}>
                    <span className="text-2xl">{plan.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">{plan.name}</h3>
                  <div className="mt-2">
                    <span className="text-3xl font-bold text-gray-800">{plan.price}€</span>
                    <span className="text-gray-500 text-sm">/mois</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-6 flex-1">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="text-green-500">✓</span> {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleCheckout(plan.id)}
                  disabled={isCurrentPlan || loading === plan.id}
                  className={`w-full py-3 rounded-xl font-semibold text-sm transition ${
                    isCurrentPlan
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : `bg-gradient-to-r ${plan.color} text-white hover:opacity-90 shadow-md`
                  } disabled:opacity-50`}
                >
                  {loading === plan.id
                    ? '⏳ Chargement...'
                    : isCurrentPlan
                    ? '✓ Forfait actuel'
                    : 'Choisir'}
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Pricing
