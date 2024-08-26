const socket = new WebSocket('ws://localhost:8080');

socket.onmessage = (event) => {
    const gameState = JSON.parse(event.data);
    if (gameState.type === 'invalid') {
        alert(gameState.message);
    } else {
        renderGameBoard(gameState.grid);
    }
};

function renderGameBoard(grid) {
    const board = document.getElementById('game-board');
    board.innerHTML = ''; // Clear the board
    grid.forEach((row, y) => {
        row.forEach((cell, x) => {
            const cellDiv = document.createElement('div');
            cellDiv.className = 'cell';
            if (cell) {
                cellDiv.classList.add(`player-${cell[0].toLowerCase()}`);
                cellDiv.innerText = cell.split('-')[1];
            }
            board.appendChild(cellDiv);
        });
    });
}

// Handle player moves
document.getElementById('controls').addEventListener('submit', (event) => {
    event.preventDefault();
    const player = event.target.player.value;
    const move = event.target.move.value;
    socket.send(JSON.stringify({ player, move }));
});
