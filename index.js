document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const presetRoomId = params.get('roomId');
  if (presetRoomId) {
    document.getElementById('roomId').value = presetRoomId;
  }
});

document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const color = document.getElementById('color').value;
  const roomId = document.getElementById('roomId').value.trim();

  if (!name) {
    alert('Please enter your name.');
    return;
  }

  try {
    const response = await fetch('https://sequence-javascript-game.onrender.com/join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, color, roomId })
    });

    const data = await response.json();

    if (data.success) {
      localStorage.setItem('playerName', name);
      localStorage.setItem('playerColor', color);
      localStorage.setItem('roomId', data.roomId);

      window.location.href = 'sequence.html';
    } else {
      alert(data.message || 'Failed to join game.');
    }
  } catch (err) {
    console.error('Login error:', err);
    alert('Could not connect to server.');
  }
});

