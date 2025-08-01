localStorage.removeItem('roomId'); // clean up old room ID

document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const color = document.getElementById('color').value;

  if (!name) {
    alert('Por favor, ingresa tu nombre.');
    return;
  }

  try {
    const response = await fetch('https://sequence-javascript-game.onrender.com/join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, color })
    });

    const data = await response.json();

    if (data.success) {
      localStorage.setItem('playerName', name);
      localStorage.setItem('playerColor', color);
      localStorage.setItem('isWaiting', data.message.includes('Waiting'));
      if (data.roomId) {
        localStorage.setItem('roomId', data.roomId); // ✅ Save this
      }

      window.location.href = 'game.html';
    } else {
      alert(data.message || 'Error al unirse al juego.');
    }
  } catch (err) {
    console.error('Login error:', err);
    alert('No se pudo conectar al servidor.');
  }
});

