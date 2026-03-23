function Success() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Paiement réussi !</h1>
        <p className="text-gray-500 mb-6">Votre abonnement est maintenant actif.</p>
        <button
          onClick={() => window.location.href = '/'}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition"
        >
          Accéder à mon compte →
        </button>
      </div>
    </div>
  )
}

export default Success
