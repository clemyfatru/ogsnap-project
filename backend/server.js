const express = require('express')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const app = express()
app.use(cors())
app.use((req, res, next) => {
  console.log(`>>> ${req.method} ${req.url}`)
  next()
})


const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
)

const JWT_SECRET = process.env.JWT_SECRET

// Webhook Stripe AVANT express.json()
app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {

  const sig = req.headers['stripe-signature']

  let event
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('❌ Webhook signature error:', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const userId = session.metadata.userId
    const planName = session.metadata.plan

    const limitsMap = {
      starter: 500,
      pro: 2000,
      agency: 10000,
    }

    const newLimit = limitsMap[planName]
    if (!newLimit) {
      console.error('❌ Plan inconnu:', planName)
      return res.status(400).send('Plan inconnu')
    }

    const { error } = await supabase
      .from('users')
      .update({ plan: planName, images_limit: newLimit, images_used: 0 })
      .eq('id', userId)

    if (error) {
      console.error('❌ Supabase update error:', error.message)
    } else {
      console.log(`✅ User ${userId} upgraded to ${planName} (${newLimit} images)`)
    }
  }

  res.json({ received: true })
})


// express.json() APRÈS le webhook
app.use(express.json())




app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body

  const { data: existing } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single()

  if (existing) {
    return res.status(400).json({ error: 'Email déjà utilisé' })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const { data, error } = await supabase
    .from('users')
    .insert([{
      name: name || '',
      email,
      password: hashedPassword,
      plan: 'free',
      images_used: 0,
      images_limit: 3
    }])
    .select()
    .single()

   if (error) {
    return res.status(500).json({ error: 'Erreur création compte', details: error.message })
  }


  const token = jwt.sign({ id: data.id, email: data.email }, JWT_SECRET, { expiresIn: '7d' })

  res.json({ token, user: { name: data.name, email: data.email, plan: data.plan, images_used: data.images_used, images_limit: data.images_limit } })
})


app.post('/api/login', async (req, res) => {
  const { email, password } = req.body

  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single()

  if (!user) {
    return res.status(400).json({ error: 'Email non trouvé' })
  }

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) {
    return res.status(400).json({ error: 'Mot de passe incorrect' })
  }

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' })

  res.json({ token, user: { email: user.email, plan: user.plan, images_used: user.images_used, images_limit: user.images_limit } })
})

app.post('/api/generate', async (req, res) => {
  const authHeader = req.headers.authorization
  if (!authHeader) return res.status(401).json({ error: 'Non autorisé' })

  try {
    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, JWT_SECRET)

    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('id', decoded.id)
      .single()

    if (user.images_used >= user.images_limit) {
      return res.status(403).json({ error: 'Limite atteinte. Passez au plan Pro !' })
    }

    await supabase
      .from('users')
      .update({ images_used: user.images_used + 1 })
      .eq('id', user.id)

    res.json({
      message: 'Image générée',
      images_used: user.images_used + 1,
      images_limit: user.images_limit
    })

  } catch (err) {
    res.status(401).json({ error: 'Token invalide' })
  }
})

const PORT = process.env.PORT || 3001
app.get('/api/me', async (req, res) => {
  const authHeader = req.headers.authorization
  if (!authHeader) return res.status(401).json({ error: 'Non autorisé' })

  try {
    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, JWT_SECRET)

    const { data: user } = await supabase
      .from('users')
      .select('email, plan, images_used, images_limit')
      .eq('id', decoded.id)
      .single()

    res.json({ user })

  } catch (err) {
    res.status(401).json({ error: 'Token invalide' })
  }
})

// Créer une session de paiement Stripe
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { plan, email } = req.body;

    const priceMap = {
      starter: process.env.STRIPE_PRICE_STARTER,
      pro: process.env.STRIPE_PRICE_PRO,
      agency: process.env.STRIPE_PRICE_AGENCY,
    };

    const priceId = priceMap[plan];
    if (!priceId) {
      return res.status(400).json({ error: 'Plan invalide' });
    }

    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: email,
      metadata: { userId: user.id, plan: plan },
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/pricing`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('Erreur checkout:', err.message);
    res.status(500).json({ error: err.message });
  }
});






app.listen(PORT, () => {
  console.log(`✅ Serveur OGsnap démarré sur http://localhost:${PORT}`)
})
