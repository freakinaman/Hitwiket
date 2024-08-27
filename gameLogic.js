class Game {
    constructor() {
        this.grid = this.initializeGrid();
        this.players = {
            A: ['A-P1', 'A-H1', 'A-H2', 'A-P2', 'A-P3'],
            B: ['B-P1', 'B-H1', 'B-H2', 'B-P2', 'B-P3']
        };
        this.currentTurn = 'A';
        this.deployCharacters();
    }

    initializeGrid() {
        const grid = Array.from({ length: 5 }, () => Array(5).fill(null));
        return grid;
    }

    deployCharacters() {
        this.grid[0] = this.players.B; // B's characters on top row
        this.grid[4] = this.players.A; // A's characters on bottom row
    }

    isWithinBounds(x, y) {
        return x >= 0 && x < 5 && y >= 0 && y < 5;
    }

    makeMove(player, move) {
        if (player !== this.currentTurn) {
            return { valid: false, message: "It's not your turn!" };
        }

        const [charName, direction] = move.split(':');
        const charPos = this.findCharacter(player, charName);

        if (!charPos) {
            return { valid: false, message: "Character not found." };
        }

        const [x, y] = charPos;
        const [newX, newY] = this.calculateNewPosition(x, y, charName, direction);

        if (!this.isWithinBounds(newX, newY)) {
            return { valid: false, message: "Move out of bounds." };
        }

        if (this.grid[newY][newX] && this.grid[newY][newX][0] === player) {
            return { valid: false, message: "Cannot move onto your own character." };
        }

        this.grid[y][x] = null; // Clear old position
        this.grid[newY][newX] = `${player}-${charName}`; // Set new position

        // Check for combat
        this.checkCombat(newX, newY);

        // Switch turn
        this.currentTurn = this.currentTurn === 'A' ? 'B' : 'A';

        // Check win condition
        if (this.checkWinCondition()) {
            return { valid: true, gameOver: true, winner: player };
        }

        return { valid: true };
    }

    findCharacter(player, charName) {
        for (let y = 0; y < 5; y++) {
            for (let x = 0; x < 5; x++) {
                if (this.grid[y][x] === `${player}-${charName}`) {
                    return [x, y];
                }
            }
        }
        return null;
    }

    calculateNewPosition(x, y, charName, direction) {
        const moves = {
            'P1': { L: [-1, 0], R: [1, 0], F: [0, -1], B: [0, 1] },
            'H1': { L: [-2, 0], R: [2, 0], F: [0, -2], B: [0, 2] },
            'H2': { FL: [-2, -2], FR: [2, -2], BL: [-2, 2], BR: [2, 2] },
            // Add more characters if necessary
        };
        const move = moves[charName][direction];
        return [x + move[0], y + move[1]];
    }

    checkCombat(newX, newY) {
        const char = this.grid[newY][newX];
        if (char && char[0] !== this.currentTurn) {
            // Opponent's character at the new position
            this.grid[newY][newX] = null;
        }
    }

    checkWinCondition() {
        const aCharacters = this.grid.flat().filter(c => c && c[0] === 'A').length;
        const bCharacters = this.grid.flat().filter(c => c && c[0] === 'B').length;
        return aCharacters === 0 || bCharacters === 0;
    }

    getGameState() {
        return {
            grid: this.grid,
            currentTurn: this.currentTurn
        };
    }
}

module.exports = Game;
