const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3001;
const HOST = '0.0.0.0';

const MinesArenaGame = require('./gameLogic');

const game = new MinesArenaGame();

io.on('connection', (socket) => {
  console.log('a user connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('user disconnected:', socket.id);
  });

  socket.on('login', (data) => {
    console.log('login event received:', data);
  });

  socket.on('makeMove', (data) => {
    console.log('makeMove event received:', data);
    const { playerId, row, col } = data;
    const result = game.makeMove(playerId, row, col);
    io.emit('moveResult', { playerId, row, col, result });
  });

  socket.on('nextRound', () => {
    const roundResult = game.nextRound();
    io.emit('roundUpdate', roundResult);
  });
});

server.listen(PORT, HOST, () => {
  console.log(`Server listening on ${HOST}:${PORT}`);
});