# Pocket Arcade

A responsive, buildless arcade with twelve games: Snake, Memory Match, Tic-Tac-Toe against a computer, Reaction Time, 2048, Word Scramble, Minesweeper, Connect Four against a computer, Sliding Puzzle, Pong, Whack-a-Mole, and Simon Says. Personal bests are saved in browser localStorage.

## Run locally

Run `python3 -m http.server 4173 --directory dist`, then open http://localhost:4173.

The deployable website is in `dist/`. No installation or build step is required. Google Fonts is optional; system font fallbacks work offline.

Keyboard controls and on-screen directional buttons are available for Snake and 2048. All games have restart controls. Close a game using Escape or the close button.

Snake moves one square every 240 ms for a relaxed pace. Minesweeper guarantees a safe first reveal and offers a flag mode for touch screens. Sliding Puzzle is shuffled using legal moves so every board is solvable.

Pong supports keyboard, pointer, and touch controls and a pause button. Whack-a-Mole lasts 30 seconds. Simon Says uses numbered, colored pads with keyboard shortcuts 1–4.
