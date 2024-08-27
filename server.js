const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const Game = require('./gameLogic');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static('client'));

const game = new Game();

wss.on('connection', (ws) => {
    console.log('New client connected');

    ws.on('message', (message) => {
        const { player, move } = JSON.parse(message);
        const response = game.makeMove(player, move);

        if (response.valid) {
            // Broadcast updated game state to all clients
            const gameState = game.getGameState();
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(gameState));
                }
            });
        } else {
            // Send invalid move notification to the current client
            ws.send(JSON.stringify({ type: 'invalid', message: response.message }));
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });

    // Send initial game state to the new client
    ws.send(JSON.stringify(game.getGameState()));
});

server.listen(8080, () => {
    console.log('Server is running on http://localhost:8080');
});
