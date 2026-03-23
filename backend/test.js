async function test() {
  try {
    const register = await fetch('http://localhost:3001/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test', email: 'test2@test.com', password: 'test123' })
    });
    const regData = await register.json();
    console.log('Register:', regData);
  } catch (err) {
    console.log('❌ Erreur:', err.message);
  }
}

test();
