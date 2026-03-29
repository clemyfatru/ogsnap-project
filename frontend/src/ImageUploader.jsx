import { useState, useRef, useCallback, useEffect } from 'react'
import { supabase } from './lib/supabase'


function ImageUploader({ selectedPhoto, user, isLoggedIn, setCurrentPage }) {



  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [title, setTitle] = useState('')
  const [brand, setBrand] = useState('')
  const [color, setColor] = useState('#4F46E5')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [trialUsed, setTrialUsed] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [showSignup, setShowSignup] = useState(false)
  const [template, setTemplate] = useState('fullscreen')
  const [font, setFont] = useState('Inter')
  const [loginEmail, setLoginEmail] = useState('')
const [loginPassword, setLoginPassword] = useState('')
const [signupName, setSignupName] = useState('')
const [signupEmail, setSignupEmail] = useState('')
const [signupPassword, setSignupPassword] = useState('')
const [authError, setAuthError] = useState('')
const [authLoading, setAuthLoading] = useState(false)
const [showForgotPassword, setShowForgotPassword] = useState(false)
const [authSuccess, setAuthSuccess] = useState('')
const [currentPlan, setCurrentPlan] = useState(null)

const handleSubscribe = async (plan) => {
  if (!user || !user.email) {
    alert('Vous devez être connecté')
    return
  }

  const { data: sessionData } = await supabase.auth.getSession()
  const token = sessionData?.session?.access_token

  if (!token) {
    alert('Vous devez être connecté')
    return
  }

  if (currentPlan === plan) {
    alert('Vous êtes déjà abonné à ce forfait.')
    return
  }

  const priceMap = {
    starter: process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER,
    pro: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO,
    agency: process.env.NEXT_PUBLIC_STRIPE_PRICE_AGENCY,
  }

  console.log('Plan:', plan)
  console.log('PriceId:', priceMap[plan])
  console.log('Email:', user.email)

  if (!priceMap[plan]) {
    alert('Erreur: priceId manquant pour le plan ' + plan)
    return
  }

  try {
    const res = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        priceId: priceMap[plan], 
        customerEmail: user.email 
      })
    })

    if (!res.ok) {
      const text = await res.text()
      alert('Erreur serveur: ' + text)
      return
    }

    const data = await res.json()

    if (data.url) {
      window.location.href = data.url
    } else {
      alert('Erreur: pas de URL Stripe reçue')
    }
  } catch (err) {
    alert('Erreur réseau: ' + err.message)
  }
}





;




const fonts = [
  // Free (5)
  { name: 'Inter', value: 'Inter', locked: false },
  { name: 'Georgia', value: 'Georgia', locked: false },
  { name: 'Arial', value: 'Arial, sans-serif', locked: false },
  { name: 'Times New Roman', value: 'Times New Roman, serif', locked: false },
  { name: 'Courier New', value: 'Courier New, monospace', locked: false },
  // Starter 9€ (10 de plus)
  { name: 'Playfair Display', value: 'Playfair Display', locked: true },
  { name: 'Montserrat', value: 'Montserrat', locked: true },
  { name: 'Raleway', value: 'Raleway', locked: true },
  { name: 'Oswald', value: 'Oswald', locked: true },
  { name: 'Merriweather', value: 'Merriweather', locked: true },
  { name: 'Lora', value: 'Lora', locked: true },
  { name: 'Roboto Slab', value: 'Roboto Slab', locked: true },
  { name: 'Source Sans Pro', value: 'Source Sans Pro', locked: true },
  { name: 'Nunito', value: 'Nunito', locked: true },
  { name: 'Poppins', value: 'Poppins', locked: true },
  // Pro 19€ (10 de plus)
  { name: 'Bebas Neue', value: 'Bebas Neue', locked: true },
  { name: 'DM Serif Display', value: 'DM Serif Display', locked: true },
  { name: 'Space Grotesk', value: 'Space Grotesk', locked: true },
  { name: 'Clash Display', value: 'Clash Display', locked: true },
  { name: 'Cabinet Grotesk', value: 'Cabinet Grotesk', locked: true },
  { name: 'Satoshi', value: 'Satoshi', locked: true },
  { name: 'General Sans', value: 'General Sans', locked: true },
  { name: 'Syne', value: 'Syne', locked: true },
  { name: 'Space Mono', value: 'Space Mono', locked: true },
  { name: 'JetBrains Mono', value: 'JetBrains Mono', locked: true },
  // Agency 39€ (10 de plus)
  { name: 'Canela', value: 'Canela', locked: true },
  { name: 'Recoleta', value: 'Recoleta', locked: true },
  { name: 'Gilroy', value: 'Gilroy', locked: true },
  { name: 'Circular', value: 'Circular', locked: true },
  { name: 'Neue Montreal', value: 'Neue Montreal', locked: true },
  { name: 'Switzer', value: 'Switzer', locked: true },
  { name: 'Outfit', value: 'Outfit', locked: true },
  { name: 'Plus Jakarta Sans', value: 'Plus Jakarta Sans', locked: true },
  { name: 'Manrope', value: 'Manrope', locked: true },
  { name: 'Bricolage Grotesque', value: 'Bricolage Grotesque', locked: true },
];


    /* ======= PRIX ======= */
  const prices = { starter: 9, pro: 19, agency: 39 }

  const dropRef = useRef(null)

useEffect(() => {
  const fetchPlan = async () => {
    const { data: sessionData } = await supabase.auth.getSession()
    const userId = sessionData?.session?.user?.id
    if (!userId) return

    const { data } = await supabase
      .from('subscribers')
      .select('plan')
      .eq('user_id', userId)
      .single()

    if (data?.plan) setCurrentPlan(data.plan)
  }
  fetchPlan()
}, [])


  useEffect(() => {
    if (selectedPhoto) {
      setPreview(selectedPhoto)
      setImage('pexels')
    }
  }, [selectedPhoto])

  const colors = [
    { name: 'Indigo', value: '#4F46E5' },
    { name: 'Bleu', value: '#2563EB' },
    { name: 'Vert', value: '#059669' },
    { name: 'Rouge', value: '#DC2626' },
    { name: 'Rose', value: '#DB2777' },
    { name: 'Orange', value: '#EA580C' },
    { name: 'Jaune', value: '#CA8A04' },
    { name: 'Noir', value: '#171717' },
    { name: 'Gris', value: '#374151' },
  ]

  const templates = [
  { id: 'pure', name: 'Photo Pure', icon: '📷' },
  { id: 'fullscreen', name: 'Plein écran', free: true },
  { id: 'split', name: 'Split', free: true },
  { id: 'magazine', name: 'Magazine', free: false },
  { id: 'centered', name: 'Centré', free: false },
  { id: 'minimal', name: 'Minimaliste', free: false },
  { id: 'frame', name: 'Cadre', free: false },
]




  /* ======= GESTION FICHIER ======= */
  const handleFile = (file) => {
    if (!file) return
    const validTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      alert('Format non supporté. Utilisez JPG, PNG ou WebP.')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('Fichier trop lourd. Maximum 10 Mo.')
      return
    }
    setImage(file)
    const reader = new FileReader()
    reader.onloadend = () => setPreview(reader.result)
    reader.readAsDataURL(file)
    setResult(null)
  }

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    const file = e.dataTransfer.files[0]
    handleFile(file)
  }, [])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  /* ======= UTILITAIRES CANVAS ======= */
  function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgba(${r},${g},${b},${alpha})`
  }

  function wrapText(ctx, text, maxWidth) {
    const words = text.split(' ')
    const lines = []
    let currentLine = ''
    words.forEach(word => {
      const testLine = currentLine ? currentLine + ' ' + word : word
      if (ctx.measureText(testLine).width > maxWidth && currentLine) {
        lines.push(currentLine)
        currentLine = word
      } else {
        currentLine = testLine
      }
    })
    lines.push(currentLine)
    return lines
  }

  function drawImageCover(ctx, img, x, y, w, h) {
    const imgRatio = img.width / img.height
    const boxRatio = w / h
    let sx, sy, sw, sh
    if (imgRatio > boxRatio) {
      sh = img.height
      sw = img.height * boxRatio
      sx = (img.width - sw) / 2
      sy = 0
    } else {
      sw = img.width
      sh = img.width / boxRatio
      sx = 0
      sy = (img.height - sh) / 2
    }
    ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h)
  }

  /* ======= MOTEUR DE GENERATION ======= */
  const generateImage = () => {
    if (!preview) {
      alert("Veuillez uploader une image d'abord.")
      return
    }

    setLoading(true)

    const canvas = document.createElement('canvas')
    canvas.width = 1200
    canvas.height = 630
    const ctx = canvas.getContext('2d')

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {

      if (template === 'fullscreen') {
        /* ===== TEMPLATE 1 : Photo plein écran ===== */
        drawImageCover(ctx, img, 0, 0, 1200, 630)

        // Dégradé en bas
        const grad = ctx.createLinearGradient(0, 350, 0, 630)
        grad.addColorStop(0, 'rgba(0,0,0,0)')
        grad.addColorStop(1, 'rgba(0,0,0,0.75)')
        ctx.fillStyle = grad
        ctx.fillRect(0, 0, 1200, 630)

        // Barre couleur en bas
        ctx.fillStyle = color
        ctx.fillRect(0, 610, 1200, 20)

        // Titre
        if (title) {
          ctx.fillStyle = '#FFFFFF'
          ctx.font = 'bold 52px Arial, sans-serif'
          ctx.shadowColor = 'rgba(0,0,0,0.5)'
          ctx.shadowBlur = 10
          ctx.shadowOffsetX = 2
          ctx.shadowOffsetY = 2

          const lines = wrapText(ctx, title, 1100)
          const lineHeight = 62
          const startY = 530 - (lines.length - 1) * lineHeight
          lines.forEach((line, i) => {
            ctx.fillText(line, 50, startY + i * lineHeight)
          })

          ctx.shadowColor = 'transparent'
          ctx.shadowBlur = 0
          ctx.shadowOffsetX = 0
          ctx.shadowOffsetY = 0
        }

        // Marque
        if (brand) {
          ctx.fillStyle = 'rgba(255,255,255,0.8)'
          ctx.font = '600 22px Arial, sans-serif'
          ctx.fillText(brand, 50, 50)
        } else {
          ctx.fillStyle = 'rgba(255,255,255,0.4)'
          ctx.font = '18px Arial, sans-serif'
          ctx.fillText('ogsnap.io', 50, 600)
        }

      } else if (template === 'split') {
        /* ===== TEMPLATE 2 : Split 35/65 ===== */
        ctx.fillStyle = color
        ctx.fillRect(0, 0, 420, 630)

        drawImageCover(ctx, img, 420, 0, 780, 630)

        // Titre à gauche
        if (title) {
          ctx.fillStyle = '#FFFFFF'
          ctx.font = 'bold 38px Arial, sans-serif'
          const lines = wrapText(ctx, title, 370)
          const lineHeight = 48
          const totalH = lines.length * lineHeight
          const startY = (630 - totalH) / 2 + 40
          lines.forEach((line, i) => {
            ctx.fillText(line, 30, startY + i * lineHeight)
          })
        }

        // Marque en bas à gauche
        if (brand) {
          ctx.fillStyle = 'rgba(255,255,255,0.8)'
          ctx.font = '600 20px Arial, sans-serif'
          ctx.fillText(brand, 30, 590)
        } else {
          ctx.fillStyle = 'rgba(255,255,255,0.3)'
          ctx.font = '16px Arial, sans-serif'
          ctx.fillText('ogsnap.io', 30, 590)
        }

      } else if (template === 'magazine') {
        /* ===== TEMPLATE 3 : Magazine ===== */
        drawImageCover(ctx, img, 0, 0, 1200, 630)

        // Overlay sombre léger
        ctx.fillStyle = 'rgba(0,0,0,0.3)'
        ctx.fillRect(0, 0, 1200, 630)

        // Cadre blanc centré
        const fw = 700, fh = 300
        const fx = (1200 - fw) / 2, fy = (630 - fh) / 2
        ctx.fillStyle = '#FFFFFF'
        ctx.fillRect(fx, fy, fw, fh)

        // Barre couleur en haut du cadre
        ctx.fillStyle = color
        ctx.fillRect(fx, fy, fw, 6)

        // Titre dans le cadre
        if (title) {
          ctx.fillStyle = '#111827'
          ctx.font = 'bold 36px Arial, sans-serif'
          const lines = wrapText(ctx, title, fw - 80)
          const lineHeight = 46
          const totalH = lines.length * lineHeight
          const startY = fy + (fh - totalH) / 2 + 30
          lines.forEach((line, i) => {
            const tw = ctx.measureText(line).width
            ctx.fillText(line, (1200 - tw) / 2, startY + i * lineHeight)
          })
        }

        // Marque sous le cadre
        if (brand) {
          ctx.fillStyle = 'rgba(255,255,255,0.9)'
          ctx.font = '600 20px Arial, sans-serif'
          const bw = ctx.measureText(brand).width
          ctx.fillText(brand, (1200 - bw) / 2, fy + fh + 40)
        } else {
          ctx.fillStyle = 'rgba(255,255,255,0.4)'
          ctx.font = '16px Arial, sans-serif'
          const bw = ctx.measureText('ogsnap.io').width
          ctx.fillText('ogsnap.io', (1200 - bw) / 2, fy + fh + 40)
        }

      } else if (template === 'centered') {
        /* ===== TEMPLATE 4 : Centré ===== */
        drawImageCover(ctx, img, 0, 0, 1200, 630)

        // Bande couleur en haut
        ctx.fillStyle = hexToRgba(color, 0.9)
        ctx.fillRect(0, 0, 1200, 8)

        // Bande centrale semi-transparente
        ctx.fillStyle = hexToRgba(color, 0.85)
        ctx.fillRect(0, 220, 1200, 190)

        // Titre centré dans la bande
        if (title) {
          ctx.fillStyle = '#FFFFFF'
          ctx.font = 'bold 44px Arial, sans-serif'
          const lines = wrapText(ctx, title, 1050)
          const lineHeight = 54
          const totalH = lines.length * lineHeight
          const startY = 220 + (190 - totalH) / 2 + 40
          lines.forEach((line, i) => {
            const tw = ctx.measureText(line).width
            ctx.fillText(line, (1200 - tw) / 2, startY + i * lineHeight)
          })
        }

        // Bande couleur en bas
        ctx.fillStyle = hexToRgba(color, 0.9)
        ctx.fillRect(0, 622, 1200, 8)

        // Marque
        if (brand) {
          ctx.fillStyle = 'rgba(255,255,255,0.9)'
          ctx.font = '600 20px Arial, sans-serif'
          ctx.fillText(brand, 50, 590)
        } else {
          ctx.fillStyle = 'rgba(255,255,255,0.4)'
          ctx.font = '16px Arial, sans-serif'
          ctx.fillText('ogsnap.io', 50, 590)
        }

      } else if (template === 'minimal') {
        /* ===== TEMPLATE 5 : Minimaliste ===== */
        // Fond couleur
        ctx.fillStyle = color
        ctx.fillRect(0, 0, 1200, 630)

        // Photo centrée (petite, avec ombre)
        const photoW = 500, photoH = 320
        const photoX = (1200 - photoW) / 2, photoY = 60

        // Ombre
        ctx.shadowColor = 'rgba(0,0,0,0.3)'
        ctx.shadowBlur = 30
        ctx.shadowOffsetX = 0
        ctx.shadowOffsetY = 10

        // Fond blanc derrière la photo (padding)
        ctx.fillStyle = '#FFFFFF'
        ctx.fillRect(photoX - 8, photoY - 8, photoW + 16, photoH + 16)

        ctx.shadowColor = 'transparent'
        ctx.shadowBlur = 0
        ctx.shadowOffsetY = 0

        // Photo
        drawImageCover(ctx, img, photoX, photoY, photoW, photoH)

        // Titre sous la photo
        if (title) {
          ctx.fillStyle = '#FFFFFF'
          ctx.font = 'bold 40px Arial, sans-serif'
          const lines = wrapText(ctx, title, 1000)
          const lineHeight = 50
          const startY = photoY + photoH + 60
          lines.forEach((line, i) => {
            const tw = ctx.measureText(line).width
            ctx.fillText(line, (1200 - tw) / 2, startY + i * lineHeight)
          })
        }

        // Marque en bas
        if (brand) {
          ctx.fillStyle = 'rgba(255,255,255,0.7)'
          ctx.font = '600 20px Arial, sans-serif'
          const bw = ctx.measureText(brand).width
          ctx.fillText(brand, (1200 - bw) / 2, 595)
        } else {
          ctx.fillStyle = 'rgba(255,255,255,0.3)'
          ctx.font = '16px Arial, sans-serif'
          const bw = ctx.measureText('ogsnap.io').width
          ctx.fillText('ogsnap.io', (1200 - bw) / 2, 595)
        }

      } else if (template === 'frame') {
        /* ===== TEMPLATE 6 : Cadre ===== */
        // Bordure couleur
        const border = 25
        ctx.fillStyle = color
        ctx.fillRect(0, 0, 1200, 630)

        // Photo dans le cadre
        drawImageCover(ctx, img, border, border, 1200 - border * 2, 630 - border * 2)

        // Dégradé en bas dans le cadre
        const grad = ctx.createLinearGradient(0, 400, 0, 630 - border)
        grad.addColorStop(0, 'rgba(0,0,0,0)')
        grad.addColorStop(1, 'rgba(0,0,0,0.7)')
        ctx.fillStyle = grad
        ctx.fillRect(border, 400, 1200 - border * 2, 630 - border - 400)

        // Titre
        if (title) {
          ctx.fillStyle = '#FFFFFF'
          ctx.font = 'bold 46px Arial, sans-serif'
          ctx.shadowColor = 'rgba(0,0,0,0.5)'
          ctx.shadowBlur = 8
          ctx.shadowOffsetX = 2
          ctx.shadowOffsetY = 2

          const lines = wrapText(ctx, title, 1050)
          const lineHeight = 56
          const startY = 530 - (lines.length - 1) * lineHeight
          lines.forEach((line, i) => {
            ctx.fillText(line, border + 30, startY + i * lineHeight)
          })

          ctx.shadowColor = 'transparent'
          ctx.shadowBlur = 0
          ctx.shadowOffsetX = 0
          ctx.shadowOffsetY = 0
        }

        // Marque
        if (brand) {
          ctx.fillStyle = 'rgba(255,255,255,0.8)'
          ctx.font = '600 20px Arial, sans-serif'
          ctx.fillText(brand, border + 30, border + 35)
        } else {
          ctx.fillStyle = 'rgba(255,255,255,0.4)'
          ctx.font = '16px Arial, sans-serif'
          ctx.fillText('ogsnap.io', border + 30, 580)
        }
        } else if (template === 'pure') {
  /* ===== TEMPLATE 7 : Photo Pure ===== */
  // Photo plein écran sans filtre
  drawImageCover(ctx, img, 0, 0, 1200, 630)

  // Titre avec ombre portée (pas de fond coloré)
  if (title) {
    ctx.save()
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)'
    ctx.shadowBlur = 20
    ctx.shadowOffsetX = 2
    ctx.shadowOffsetY = 2
    ctx.fillStyle = '#FFFFFF'
    ctx.font = 'bold 52px Arial, sans-serif'
    ctx.textAlign = 'center'
    const lines = wrapText(ctx, title, 1000)
    const lineHeight = 64
    const startY = 630 - 60 - (lines.length - 1) * lineHeight
    lines.forEach((line, i) => {
      ctx.fillText(line, 600, startY + i * lineHeight)
    })
    ctx.restore()
  }

  // Marque en haut à gauche avec ombre
  if (brand) {
    ctx.save()
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)'
    ctx.shadowBlur = 15
    ctx.shadowOffsetX = 1
    ctx.shadowOffsetY = 1
    ctx.fillStyle = '#FFFFFF'
    ctx.font = '600 24px Arial, sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText(brand, 40, 50)
    ctx.restore()
  } else {
    ctx.save()
    ctx.shadowColor = 'rgba(0, 0, 0, 0.6)'
    ctx.shadowBlur = 10
    ctx.fillStyle = 'rgba(255,255,255,0.5)'
    ctx.font = '16px Arial, sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText('ogsnap.io', 40, 50)
    ctx.restore()
  }
}

        

      

      // Convertir en image
      const dataURL = canvas.toDataURL('image/png')
      setResult(dataURL)
      setLoading(false)
    }

    img.onerror = () => {
      alert("Erreur lors du chargement de l'image.")
      setLoading(false)
    }

    img.src = preview
  }

  /* ======= TELECHARGEMENT ======= */
const downloadImage = async () => {
  if (!result) return

  // Si pas connecté → pas de limitation (essai gratuit déjà géré par handleTrial)
  if (!isLoggedIn) {
    const link = document.createElement('a')
    link.download = `ogsnap-${Date.now()}.png`
    link.href = result
    link.click()
    return
  }

  // Vérifier la limite
  if (user && user.images_used >= user.images_limit) {
    alert(`Vous avez atteint votre limite de ${user.images_limit} images. Passez au plan supérieur pour continuer !`)
    return
  }

  // Incrémenter images_used dans Supabase
  const { error } = await supabase
    .from('users')
    .update({ images_used: (user.images_used || 0) + 1 })
    .eq('id', user.id)

  if (error) {
    console.error('Erreur mise à jour compteur:', error)
    alert('Erreur lors du téléchargement. Réessayez.')
    return
  }

  // Mettre à jour localement
  user.images_used = (user.images_used || 0) + 1

  // Télécharger
  const link = document.createElement('a')
  link.download = `ogsnap-${Date.now()}.png`
  link.href = result
  link.click()
}

  /* ======= ESSAI GRATUIT ======= */
  const handleTrial = () => {
    if (trialUsed) {
      alert('Vous avez déjà utilisé votre essai gratuit. Inscrivez-vous pour continuer !')
      setShowSignup(true)
      return
    }
    if (!preview) {
      alert("Uploadez une image d'abord !")
      return
    }
    setTrialUsed(true)
    generateImage()
  }

  /* ======= RENDU ======= */
  return (
    

       
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">

      {/* ========== HEADER ========== */}
      <header className="bg-white/80 backdrop-blur border-b border-gray-100 sticky top-0 z-50">
  <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm" style={{background: 'linear-gradient(135deg, #4F46E5, #7C3AED)'}}>
        OG
      </div>
      <span className="font-bold text-gray-800">OGsnap.io</span>
    </div>
    <div className="flex items-center gap-3">
  <button
    onClick={() => setCurrentPage('photos')}
    className="text-sm text-gray-600 hover:text-indigo-600 transition"
  >
    📸 Photos
  </button>

  {isLoggedIn ? (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-700 font-medium">
        👋 {user?.name || user?.email} — {user?.images_used || 0}/{user?.images_limit || 0} images
      </span>
      <button
        onClick={() => setCurrentPage('dashboard')}
        className="text-sm text-indigo-600 hover:text-indigo-800 transition font-medium"
      >
        Mon compte
      </button>
      <button
        onClick={async () => { await supabase.auth.signOut() }}
        className="text-sm text-red-500 hover:text-red-700 transition"
      >
        Déconnexion
      </button>
    </div>
  ) : (
    <button
      onClick={() => setCurrentPage('login')}
      className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
    >
      Connexion
    </button>
  )}
</div>

  </div>
</header>


{/* BANDEAU SITE EN CONSTRUCTION */}
<div style={{
  width: '100%',
  background: 'linear-gradient(90deg, #DC2626, #EA580C)',
  color: 'white',
  textAlign: 'center',
  padding: '14px 20px',
  fontSize: '16px',
  fontWeight: 'bold',
  boxShadow: '0 4px 20px rgba(220, 38, 38, 0.4)',
  position: 'sticky',
  top: '52px',
  zIndex: 49,
}}>
  🚧 SITE EN CONSTRUCTION — Les abonnements ne sont pas encore disponibles. Revenez bientôt ! 🚧
</div>


     {/* ========== MODAL LOGIN ========== */}
{showLogin && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]" onClick={() => setShowLogin(false)}>
    <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Se connecter</h2>
        <button onClick={() => { setShowLogin(false); setAuthError(''); setShowForgotPassword(false) }} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
      </div>
      {authError && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{authError}</div>}
      {authSuccess && <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-4 text-sm">{authSuccess}</div>}

      {/* ---- Formulaire mot de passe oublié ---- */}
      {showForgotPassword ? (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Entrez votre email, vous recevrez un lien pour réinitialiser votre mot de passe.</p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={loginEmail}
              onChange={e => setLoginEmail(e.target.value)}
              placeholder="vous@exemple.com"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              required
            />
          </div>
          <button
            onClick={async () => {
              setAuthError('')
              setAuthSuccess('')
              if (!loginEmail) { setAuthError('Veuillez entrer votre email'); return }
              setAuthLoading(true)
              const { error } = await supabase.auth.resetPasswordForEmail(loginEmail, {
                redirectTo: `${window.location.origin}/reset-password`
              })
              setAuthLoading(false)
              if (error) { setAuthError(error.message); return }
              setAuthSuccess('📧 Email envoyé ! Vérifiez votre boîte de réception (et vos spams).')
            }}
            disabled={authLoading}
            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {authLoading ? '⏳...' : 'Envoyer le lien de réinitialisation'}
          </button>
          <p className="text-center text-sm text-gray-500">
            <button onClick={() => { setShowForgotPassword(false); setAuthError(''); setAuthSuccess('') }} className="text-indigo-600 font-medium hover:underline">
              ← Retour à la connexion
            </button>
          </p>
        </div>
      ) : (
        /* ---- Formulaire connexion normal ---- */
        <>
          <form onSubmit={async (e) => {
            e.preventDefault()
            setAuthError('')
            setAuthLoading(true)
            const { error } = await supabase.auth.signInWithPassword({ email: loginEmail, password: loginPassword })
            setAuthLoading(false)
            if (error) { setAuthError(error.message); return }
            setShowLogin(false)
            setLoginEmail('')
            setLoginPassword('')
          }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} placeholder="vous@exemple.com" className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
              <input type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} placeholder="••••••••" className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" required />
            </div>
            <button type="submit" disabled={authLoading} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-50">
              {authLoading ? '⏳...' : 'Se connecter'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-3">
            <button onClick={() => { setShowForgotPassword(true); setAuthError('') }} className="text-indigo-600 font-medium hover:underline">
              Mot de passe oublié ?
            </button>
          </p>
          <p className="text-center text-sm text-gray-500 mt-2">
            Pas de compte ?{' '}
            <button onClick={() => { setShowLogin(false); setShowSignup(true); setAuthError('') }} className="text-indigo-600 font-medium hover:underline">S'inscrire</button>
          </p>
        </>
      )}
    </div>
  </div>
)}



      {/* ========== MODAL SIGNUP ========== */}
      {showSignup && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]" onClick={() => setShowSignup(false)}>
    <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Créer un compte</h2>
        <button onClick={() => { setShowSignup(false); setAuthError('') }} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
      </div>
      {authError && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{authError}</div>}
      <form onSubmit={async (e) => {
        e.preventDefault()
        setAuthError('')
        setAuthLoading(true)
        const { error } = await supabase.auth.signUp({
          email: signupEmail,
          password: signupPassword,
          options: { data: { name: signupName } }
        })
        setAuthLoading(false)
        if (error) { setAuthError(error.message); return }
        setShowSignup(false)
        setSignupName('')
        setSignupEmail('')
        setSignupPassword('')
        alert('✅ Compte créé ! Vérifiez votre email si nécessaire.')
      }} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
          <input type="text" value={signupName} onChange={e => setSignupName(e.target.value)} placeholder="Votre nom" className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input type="email" value={signupEmail} onChange={e => setSignupEmail(e.target.value)} placeholder="vous@exemple.com" className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
          <input type="password" value={signupPassword} onChange={e => setSignupPassword(e.target.value)} placeholder="••••••••" className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" required />
        </div>
        <button type="submit" disabled={authLoading} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-50">
          {authLoading ? '⏳...' : 'Créer mon compte'}
        </button>
      </form>
      <p className="text-center text-sm text-gray-500 mt-4">
        Déjà un compte ?{' '}
        <button onClick={() => { setShowSignup(false); setShowLogin(true); setAuthError('') }} className="text-indigo-600 font-medium hover:underline">Se connecter</button>
      </p>
    </div>
  </div>
)}


      {/* ========== CONTENU PRINCIPAL ========== */}
      <main className="max-w-6xl mx-auto px-4 py-12">

        {/* Titre */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3">
            Créez vos images Open Graph en 3 clics
          </h1>
          <p className="text-gray-500 text-lg">
            Uploadez votre image, ajoutez votre titre, téléchargez votre carte OG.
          </p>
        </div>

        {/* Zone d'upload */}
        <div
          ref={dropRef}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => document.getElementById('fileInput').click()}
          className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition mb-8 max-w-2xl mx-auto"
        >
          <input
            id="fileInput"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => handleFile(e.target.files[0])}
          />
          {preview ? (
            <div>
              <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded-xl shadow mb-3" />
              <p className="text-sm text-gray-500">Cliquez pour changer l'image</p>
            </div>
          ) : (
            <div>
              <div className="text-4xl mb-3">☁️</div>
              <p className="text-gray-600 font-medium">Glissez votre image ici</p>
              <p className="text-gray-400 text-sm mt-1">ou cliquez pour sélectionner</p>
              <p className="text-gray-300 text-xs mt-3">JPG, PNG ou WebP • Max 10 Mo</p>
            </div>
          )}
        </div>

        {/* Formulaire de personnalisation */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8 max-w-2xl mx-auto">
          <h2 className="text-lg font-bold text-gray-800 mb-5">🎯 Personnalisez votre image</h2>

          {/* SÉLECTEUR DE TEMPLATE */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Template</label>
            <div className="grid grid-cols-3 gap-3">

              {/* Photo Pure */}
<button
  onClick={() => setTemplate('pure')}
  className={`p-3 rounded-xl border-2 transition text-xs font-medium relative ${
    template === 'pure'
      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
      : 'border-gray-200 hover:border-gray-300 text-gray-600'
  }`}
>
  <div className="w-full h-10 rounded relative overflow-hidden mb-2">
    <div className="w-full h-full bg-gradient-to-br from-blue-300 to-green-200"></div>
    <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 text-[5px] text-white font-bold drop-shadow">Aa</div>
  </div>
  📷 Photo Pure
  

</button>

              {/* Plein écran */}
              <button
                onClick={() => setTemplate('fullscreen')}
                className={`p-3 rounded-xl border-2 transition text-xs font-medium ${
                  template === 'fullscreen'
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                <div className="w-full h-10 rounded bg-gradient-to-t from-gray-800 to-blue-400 relative overflow-hidden mb-2">
                  <div className="absolute bottom-0 left-0 right-0 h-3 bg-white/30 text-[5px] text-center leading-[12px]">Aa</div>
                </div>
                Plein écran
              </button>

              {/* Split */}
              <button
                onClick={() => setTemplate('split')}
                className={`p-3 rounded-xl border-2 transition text-xs font-medium ${
                  template === 'split'
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                <div className="w-full h-10 rounded overflow-hidden flex mb-2">
                  <div className="w-[35%] bg-indigo-500 flex items-center justify-center text-[5px] text-white">Aa</div>
                  <div className="w-[65%] bg-blue-200"></div>
                </div>
                Split
              </button>

              {/* Magazine */}
              <button
                onClick={() => setTemplate('magazine')}
                className={`p-3 rounded-xl border-2 transition text-xs font-medium relative ${
                  template === 'magazine'
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                <div className="w-full h-10 rounded bg-blue-300 relative overflow-hidden mb-2 flex items-center justify-center">
                  <div className="bg-white w-[60%] h-[60%] rounded-sm flex items-center justify-center text-[5px] text-gray-600">Aa</div>
                </div>
                Magazine
                <span className="absolute -top-1 -right-1 bg-amber-400 text-[8px] text-white px-1 rounded-full font-bold">PRO</span>
              </button>

              {/* Centré */}
              <button
                onClick={() => setTemplate('centered')}
                className={`p-3 rounded-xl border-2 transition text-xs font-medium relative ${
                  template === 'centered'
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                <div className="w-full h-10 rounded bg-blue-300 relative overflow-hidden mb-2">
                  <div className="absolute top-[30%] left-0 right-0 h-[40%] bg-indigo-500/80 flex items-center justify-center text-[5px] text-white">Aa</div>
                </div>
                Centré
                <span className="absolute -top-1 -right-1 bg-amber-400 text-[8px] text-white px-1 rounded-full font-bold">PRO</span>
              </button>

              {/* Minimaliste */}
              <button
                onClick={() => setTemplate('minimal')}
                className={`p-3 rounded-xl border-2 transition text-xs font-medium relative ${
                  template === 'minimal'
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                <div className="w-full h-10 rounded bg-indigo-500 relative overflow-hidden mb-2 flex flex-col items-center justify-center gap-0.5">
                  <div className="bg-white w-[50%] h-[40%] rounded-sm"></div>
                  <div className="text-[5px] text-white">Aa</div>
                </div>
                Minimaliste
                <span className="absolute -top-1 -right-1 bg-amber-400 text-[8px] text-white px-1 rounded-full font-bold">PRO</span>
              </button>

              {/* Cadre */}
              <button
                onClick={() => setTemplate('frame')}
                className={`p-3 rounded-xl border-2 transition text-xs font-medium relative ${
                  template === 'frame'
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                <div className="w-full h-10 rounded border-[3px] border-indigo-500 overflow-hidden mb-2 bg-blue-300 relative">
                  <div className="absolute bottom-0 left-0 right-0 h-3 bg-black/40 text-[5px] text-white text-center leading-[12px]">Aa</div>
                </div>
                Cadre
                <span className="absolute -top-1 -right-1 bg-amber-400 text-[8px] text-white px-1 rounded-full font-bold">PRO</span>
              </button>
              
                

            </div>
          </div>

          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">Titre de l'article</label>
            <input
              type="text"
              placeholder="Mon article incroyable..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-gray-800"
              maxLength={100}
            />
          </div>

          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">Nom de votre marque</label>
            <input
              type="text"
              placeholder="MaMarque"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-gray-800"
              maxLength={30}
            />
                      </div>  {/* ← fermeture du div "Nom de votre marque" */}

          {/* Sélecteur de typographie */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">🔤 Typographie</label>
            <select
              value={font}
              onChange={(e) => setFont(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-gray-800"
              style={{ fontFamily: font }}
            >
              {fonts.map((f) => (
                <option key={f.value} value={f.value} style={{ fontFamily: f.value }} disabled={f.locked}>
                  {f.name} {f.locked ? '🔒' : ''}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-400 mt-1">Aperçu en temps réel sur votre image</p>
          </div>

          <div className="mb-2">  {/* ← début du div "Couleur principale" */}

          </div>


          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-3">Couleur principale</label>
            <div className="flex flex-wrap gap-3">
              {colors.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setColor(c.value)}
                  title={c.name}
                  className={`w-10 h-10 rounded-full border-4 transition-transform hover:scale-110 ${
                    color === c.value ? 'border-indigo-400 scale-110 shadow-lg' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: c.value }}
                />
              ))}
            </div>
            
 

          </div>
        </div>

        {/* Boutons */}
        <div className="max-w-2xl mx-auto mb-8 space-y-3">
          {!trialUsed && (
            <button
              onClick={handleTrial}
              className="w-full py-4 rounded-2xl font-bold text-white text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02]"
              style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}
            >
              🎁 Essayer gratuitement — 1 image offerte
            </button>
          )}

          <button
            onClick={generateImage}
            disabled={loading}
            className="w-full py-4 rounded-2xl font-bold text-white text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}
          >
            {loading ? '⏳ Génération...' : '🚀 Générer mon image OG'}
          </button>
        </div>

        {/* ========== RESULTAT ========== */}
        {result && (
          <div className="max-w-4xl mx-auto mb-16">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">✅ Votre image Open Graph</h2>
                <span className="text-sm text-gray-400">1200 × 630 px</span>
              </div>

              <div className="rounded-xl overflow-hidden shadow-lg mb-6 border border-gray-200">
                <img src={result} alt="Image OG générée" className="w-full" />
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={downloadImage}
                  className="flex-1 py-4 rounded-xl font-bold text-white text-lg transition-all hover:shadow-lg transform hover:scale-[1.02]"
                  style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}
                >
                  📥 Télécharger mon image PNG
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText('<!-- Collez dans votre <head> -->\n<meta property="og:image" content="URL_DE_VOTRE_IMAGE" />')
                    alert('Balise meta copiée ! Collez-la dans votre <head>.')
                  }}
                  className="flex-1 py-4 rounded-xl font-bold text-indigo-600 text-lg border-2 border-indigo-200 hover:bg-indigo-50 transition"
                >
                  📋 Copier la balise meta
                </button>
              </div>

              <div className="mt-4 p-4 bg-indigo-50 rounded-xl">
                <p className="text-sm text-indigo-700">
                  <strong>💡 Comment utiliser :</strong> Téléchargez l'image, uploadez-la sur votre site, puis ajoutez la balise meta dans votre {'<head>'} pour que votre image apparaisse sur les réseaux sociaux.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ========== AVANTAGES ========== */}
        <div className="grid md:grid-cols-3 gap-6 mb-16 max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="font-bold text-gray-800 mb-1">Moins de 30sec</h3>
            <p className="text-sm text-gray-500">Générez en un éclair</p>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100">
            <div className="text-3xl mb-3">🎨</div>
            <h3 className="font-bold text-gray-800 mb-1">Votre branding</h3>
            <p className="text-sm text-gray-500">Couleurs et marque personnalisées</p>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100">
            <div className="text-3xl mb-3">🔒</div>
            <h3 className="font-bold text-gray-800 mb-1">RGPD Friendly</h3>
            <p className="text-sm text-gray-500">Aucune donnée conservée</p>
          </div>
        </div>

        {/* ========== TARIFS ========== */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Choisissez votre plan</h2>
          <p className="text-gray-500 mb-6">Renouvellement automatique • Annulable à tout moment</p>

          
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">

          {/* STARTER */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition">
            <h3 className="text-lg font-bold text-gray-800 mb-1 text-center">STARTER</h3>
            <div className="text-center mb-6">
              <span className="text-4xl font-extrabold text-gray-900">{prices.starter}€</span>
              <span className="text-gray-400">/mois</span>

            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2 text-sm">
                <span className="text-green-500 mt-0.5">✔</span>
                <span className="text-gray-700"><strong>500 images</strong> par mois</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <span className="text-green-500 mt-0.5">✔</span>
                <span className="text-gray-700">2 templates (Plein écran, Split)</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <span className="text-green-500 mt-0.5">✔</span>
                <span className="text-gray-700">Format PNG 1200×630 px</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <span className="text-green-500 mt-0.5">✔</span>
                <span className="text-gray-700">Titre + couleur personnalisés</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <span className="text-green-500 mt-0.5">✔</span>
                <span className="text-gray-700">Renouvellement automatique</span>
              </li>
            </ul>
            <p className="text-xs text-gray-400 mb-4 text-center">Idéal pour freelances, blogs</p>
            {/* Bouton STARTER */}
{currentPlan === 'starter' ? (
  <button
    disabled
    className="w-full py-3 border-2 border-gray-300 text-gray-400 rounded-xl font-semibold cursor-not-allowed"
  >
    ✓ Forfait actuel
  </button>
) : (
  <button
    onClick={() => handleSubscribe('starter')}
    className="w-full py-3 border-2 border-indigo-600 text-indigo-600 rounded-xl font-semibold hover:bg-indigo-50 transition"
  >
    Choisir Starter
  </button>
)}

          </div>

          {/* PRO — populaire */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-indigo-500 hover:shadow-xl transition relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-bold px-4 py-1 rounded-full">
              ⭐ POPULAIRE
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-1 text-center">PRO</h3>
            <div className="text-center mb-6">
              <span className="text-4xl font-extrabold text-gray-900">{prices.pro}€</span>
              <span className="text-gray-400">/mois</span>

            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2 text-sm">
                <span className="text-green-500 mt-0.5">✔</span>
                <span className="text-gray-700"><strong>2 000 images</strong> par mois</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <span className="text-green-500 mt-0.5">✔</span>
                <span className="text-gray-700"><strong>6 templates</strong> disponibles</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <span className="text-green-500 mt-0.5">✔</span>
                <span className="text-gray-700">Watermark personnalisé (votre marque)</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <span className="text-green-500 mt-0.5">✔</span>
                <span className="text-gray-700">Export PNG haute qualité</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <span className="text-green-500 mt-0.5">✔</span>
                <span className="text-gray-700">Banque de photos Pexels intégrée</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <span className="text-green-500 mt-0.5">✔</span>
                <span className="text-gray-700">Renouvellement automatique</span>
              </li>
            </ul>
            <p className="text-xs text-gray-400 mb-4 text-center">Parfait pour startups, PME</p>
            {/* Bouton PRO */}
{currentPlan === 'pro' ? (
  <button
    disabled
    className="w-full py-3 border-2 border-gray-300 text-gray-400 rounded-xl font-semibold cursor-not-allowed"
  >
    ✓ Forfait actuel
  </button>
) : (
  <button
    onClick={() => handleSubscribe('pro')}
    className="w-full py-3 border-2 border-indigo-600 text-indigo-600 rounded-xl font-semibold hover:bg-indigo-50 transition"
  >
    Choisir Pro
  </button>
)}

          </div>

          {/* AGENCY */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition">
            <h3 className="text-lg font-bold text-gray-800 mb-1 text-center">AGENCY</h3>
            <div className="text-center mb-6">
              <span className="text-4xl font-extrabold text-gray-900">{prices.agency}€</span>
              <span className="text-gray-400">/mois</span>

            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2 text-sm">
                <span className="text-green-500 mt-0.5">✔</span>
                <span className="text-gray-700"><strong>10 000 images</strong> par mois</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <span className="text-green-500 mt-0.5">✔</span>
                <span className="text-gray-700"><strong>6 templates</strong> + accès prioritaire nouveautés</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <span className="text-green-500 mt-0.5">✔</span>
                <span className="text-gray-700">Accès API REST</span>
              </li>
              
              
              <li className="flex items-start gap-2 text-sm">
                <span className="text-green-500 mt-0.5">✔</span>
                <span className="text-gray-700">Renouvellement automatique</span>
              </li>
            </ul>
            <p className="text-xs text-gray-400 mb-4 text-center">Pour agences et grandes équipes</p>
           {/* Bouton AGENCY */}
{currentPlan === 'agency' ? (
  <button
    disabled
    className="w-full py-3 border-2 border-gray-300 text-gray-400 rounded-xl font-semibold cursor-not-allowed"
  >
    ✓ Forfait actuel
  </button>
) : (
  <button
    onClick={() => handleSubscribe('agency')}
    className="w-full py-3 border-2 border-indigo-600 text-indigo-600 rounded-xl font-semibold hover:bg-indigo-50 transition"
  >
    Choisir Agency
  </button>
)}

          </div>

        </div>

      </main>

      {/* ========== FOOTER ========== */}
      <footer className="bg-white border-t border-gray-100 py-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-400">
          © 2025 OGsnap.io — Générateur d'images Open Graph
        </div>
      </footer>

    </div>
     
    
  )
  
}

export default ImageUploader
