import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

app.use(cors());
app.use(express.json());

const rooms = {}; // roomId => { players, turnIndex, teamMode, sequences }

app.post('/join', (req, res) => {
  const { name, color, roomId } = req.body;
  if (!rooms[roomId]) {
    rooms[roomId] = {
      players: [],
      turnIndex: 0,
      teamMode: false,
      sequences: {},
    };
  }

  const room = rooms[roomId];

  if (room.players.length >= 4) {
    return res.json({ success: false, message: 'Room full (4 players max).' });
  }

  const alreadyInRoom = room.players.some(p => p.name === name);
  if (alreadyInRoom) {
    return res.json({ success: true, message: 'Rejoining...' });
  }

  room.players.push({ name, color });
  room.sequences[name] = 0;
  room.teamMode = room.players.length === 4;

  res.json({ success: true, message: room.players.length < 2 ? 'Waiting for others...' : 'Joining game...' });
});

io.on('connection', (socket) => {
  socket.on('join-room', ({ roomId, player }) => {
    socket.join(roomId);
    const room = rooms[roomId];
    socket.player = player;
    socket.roomId = roomId;

    if (room.players.length >= 2) {
      io.to(roomId).emit('start-game', room.players);
      io.to(roomId).emit('opponent-turn');
    }
  });

  socket.on('place-chip', ({ roomId, position, color }) => {
    socket.to(roomId).emit('opponent-placed-chip', { position, color });
  });

  socket.on('remove-chip', ({ roomId, position }) => {
    socket.to(roomId).emit('opponent-removed-chip', position);
  });

  socket.on('add-sequence', ({ roomId, playerName }) => {
    const room = rooms[roomId];
    room.sequences[playerName]++;

    const teamMode = room.teamMode;
    let gameOver = false;
    let winner = '';

    if (teamMode) {
      const teamA = room.players.filter((_, i) => i % 2 === 0).map(p => p.name);
      const teamB = room.players.filter((_, i) => i % 2 === 1).map(p => p.name);

      const teamAScore = teamA.reduce((sum, name) => sum + room.sequences[name], 0);
      const teamBScore = teamB.reduce((sum, name) => sum + room.sequences[name], 0);

      if (teamAScore >= 2) {
        gameOver = true;
        winner = 'Team A';
      } else if (teamBScore >= 2) {
        gameOver = true;
        winner = 'Team B';
      }
    } else {
      if (room.sequences[playerName] >= 2) {
        gameOver = true;
        winner = playerName;
      }
    }

    if (gameOver) {
      io.to(roomId).emit('game-over', winner);
    }
  });

  socket.on('end-turn', ({ roomId }) => {
    const room = rooms[roomId];
    room.turnIndex = (room.turnIndex + 1) % room.players.length;
    io.to(roomId).emit('opponent-turn');
  });
});

server.listen(3000, () => {
  console.log('🚀 Server running on port 3000');
});
