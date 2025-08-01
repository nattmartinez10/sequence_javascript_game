const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

app.use(cors());
app.use(express.json());

let waitingPlayer = null;
let gameRooms = {}; // roomID -> [player1, player2]

app.post('/join', (req, res) => {
  const { name, color } = req.body;

  if (!name || !color) {
    return res.status(400).json({ success: false, message: 'Name and color required.' });
  }

  if (!waitingPlayer) {
    waitingPlayer = { name, color };
    return res.json({ success: true, message: 'Waiting for second player...' });
  } else {
    const roomId = `room-${Date.now()}`;
    gameRooms[roomId] = [waitingPlayer, { name, color }];
    const players = gameRooms[roomId];
    waitingPlayer = null;

    return res.json({
      success: true,
      message: 'Game starting!',
      players,
      roomId
    });
  }
});

io.on('connection', (socket) => {
  console.log('🔌 A player connected');

  socket.on('join-room', ({ roomId, player }) => {
    socket.join(roomId);
    console.log(`🧍 ${player.name} joined ${roomId}`);

    // Notify both players once the room is full
    if (io.sockets.adapter.rooms.get(roomId)?.size === 2) {
      io.to(roomId).emit('start-game', gameRooms[roomId]);
    }
  });

  socket.on('place-chip', ({ roomId, position, card, color }) => {
    socket.to(roomId).emit('opponent-placed-chip', { position, card, color });
  });

  socket.on('remove-chip', ({ roomId, position }) => {
    socket.to(roomId).emit('opponent-removed-chip', position);
  });

  socket.on('end-turn', ({ roomId }) => {
    socket.to(roomId).emit('opponent-turn');
  });

  socket.on('disconnect', () => {
    console.log('❌ Player disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
