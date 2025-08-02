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
  let roomId = document.getElementById('roomId').value.trim();

  if (!name) {
    alert('Please enter your name.');
    return;
  }

  // If no Room ID provided, assign a random one
  if (!roomId) {
    roomId = Math.random().toString(36).substring(2, 8); // generates 6-character roomId
  }

  try {
    const response = await fetch('https://sequence-javascript-game.onrender.com/join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, color, roomId })
    });

    const data = await response.json();

    if (data.success) {
      // ✅ Save correct values to localStorage
      localStorage.setItem('playerName', name);
      localStorage.setItem('playerColor', color);
      localStorage.setItem('roomId', roomId); // fixed this line!

      // ✅ Redirect with roomId in URL (optional but helpful for debugging)
      window.location.href = `sequence.html?roomId=${roomId}`;
    } else {
      alert(data.message || 'Failed to join game.');
    }
  } catch (err) {
    console.error('Login error:', err);
    alert('Could not connect to server.');
  }
});

