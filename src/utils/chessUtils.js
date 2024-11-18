// Utility to check if a position is within the board bounds
const isInBounds = (row, col) => row >= 0 && row < 8 && col >= 0 && col < 8;

// Utility to check if a move captures an opponent's piece
const isCapture = (endRow, endCol, board, player) =>
  board[endRow][endCol] && board[endRow][endCol].player !== player;

// Pawn movement: Forward one square or two on initial move; diagonal captures
const isValidPawnMove = (startRow, startCol, endRow, endCol, player, board) => {
  const direction = player === 1 ? 1 : -1;
  const startRowPlayer = player === 1 ? 1 : 6;

  // Regular move (one square forward)
  if (
    endCol === startCol &&
    !board[endRow][endCol] &&
    endRow === startRow + direction
  ) {
    return true;
  }

  // Initial move (two squares forward)
  if (
    endCol === startCol &&
    !board[endRow][endCol] &&
    startRow === startRowPlayer &&
    endRow === startRow + 2 * direction &&
    !board[startRow + direction][startCol]
  ) {
    return true;
  }

  // Capture move (diagonal)
  if (
    Math.abs(endCol - startCol) === 1 &&
    endRow === startRow + direction &&
    isCapture(endRow, endCol, board, player)
  ) {
    return true;
  }

  return false;
};

// Knight movement: L-shaped moves (2+1 or 1+2)
const isValidKnightMove = (startRow, startCol, endRow, endCol) => {
  const rowDiff = Math.abs(startRow - endRow);
  const colDiff = Math.abs(startCol - endCol);
  return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
};

// Rook movement: Horizontal or vertical, no jumping over pieces
const isValidRookMove = (startRow, startCol, endRow, endCol, board) => {
  if (startRow !== endRow && startCol !== endCol) return false;

  const rowStep = startRow === endRow ? 0 : startRow < endRow ? 1 : -1;
  const colStep = startCol === endCol ? 0 : startCol < endCol ? 1 : -1;

  let currentRow = startRow + rowStep;
  let currentCol = startCol + colStep;

  while (currentRow !== endRow || currentCol !== endCol) {
    if (board[currentRow][currentCol]) return false; // Blocked path
    currentRow += rowStep;
    currentCol += colStep;
  }

  return true;
};

// Bishop movement: Diagonal, no jumping over pieces
const isValidBishopMove = (startRow, startCol, endRow, endCol, board) => {
  const rowDiff = Math.abs(startRow - endRow);
  const colDiff = Math.abs(startCol - endCol);

  if (rowDiff !== colDiff) return false; // Must move diagonally

  const rowStep = startRow < endRow ? 1 : -1;
  const colStep = startCol < endCol ? 1 : -1;

  let currentRow = startRow + rowStep;
  let currentCol = startCol + colStep;

  while (currentRow !== endRow || currentCol !== endCol) {
    if (board[currentRow][currentCol]) return false; // Blocked path
    currentRow += rowStep;
    currentCol += colStep;
  }

  return true;
};

// Queen movement: Combination of rook and bishop
const isValidQueenMove = (startRow, startCol, endRow, endCol, board) => {
  return (
    isValidRookMove(startRow, startCol, endRow, endCol, board) ||
    isValidBishopMove(startRow, startCol, endRow, endCol, board)
  );
};

// King movement: One square in any direction
const isValidKingMove = (
  startRow,
  startCol,
  endRow,
  endCol,
  board,
  player,
  threatenedSquares
) => {
  const rowDiff = Math.abs(startRow - endRow);
  const colDiff = Math.abs(startCol - endCol);

  if (rowDiff > 1 || colDiff > 1) return false; // Only one square in any direction

  // Check if the end position is threatened
  const isThreatened = threatenedSquares.some(
    (square) => square.row === endRow && square.col === endCol
  );

  return !isThreatened; // Valid if not threatened
};

// Validate a move for any piece
export const isValidMove = (
  startRow,
  startCol,
  endRow,
  endCol,
  board,
  player
) => {
  const piece = board[startRow][startCol];
  if (!piece || piece.player !== player) return false; // No piece or opponent's piece

  // Destination must be empty or an opponent's piece
  if (board[endRow][endCol] && board[endRow][endCol].player === player) {
    return false;
  }

  switch (piece.type) {
    case "pawn":
      return isValidPawnMove(startRow, startCol, endRow, endCol, player, board);
    case "knight":
      return isValidKnightMove(startRow, startCol, endRow, endCol);
    case "rook":
      return isValidRookMove(startRow, startCol, endRow, endCol, board);
    case "bishop":
      return isValidBishopMove(startRow, startCol, endRow, endCol, board);
    case "queen":
      return isValidQueenMove(startRow, startCol, endRow, endCol, board);
    case "king":
      const opponentPlayer = player === 1 ? 2 : 1;
      const threatenedSquares = getThreatenedSquares(board, opponentPlayer);
      return isValidKingMove(
        startRow,
        startCol,
        endRow,
        endCol,
        board,
        player,
        threatenedSquares
      );

    default:
      return false;
  }
};

export const getThreatenedSquares = (board, opponentPlayer) => {
  let threatenedSquares = [];

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.player === opponentPlayer && piece.type !== "king") {
        for (let r = 0; r < 8; r++) {
          for (let c = 0; c < 8; c++) {
            if (isValidMove(row, col, r, c, board, opponentPlayer)) {
              threatenedSquares.push({ row: r, col: c });
            }
          }
        }
      }
    }
  }

  return threatenedSquares;
};

// Create initial board with all pieces in their starting positions
export const createInitialBoard = () => {
  const board = Array(8)
    .fill(null)
    .map(() => Array(8).fill(null));

  // Place pawns
  for (let i = 0; i < 8; i++) {
    board[1][i] = { type: "pawn", player: 1 };
    board[6][i] = { type: "pawn", player: 2 };
  }

  // Place rooks
  board[0][0] = board[0][7] = { type: "rook", player: 1 };
  board[7][0] = board[7][7] = { type: "rook", player: 2 };

  // Place knights
  board[0][1] = board[0][6] = { type: "knight", player: 1 };
  board[7][1] = board[7][6] = { type: "knight", player: 2 };

  // Place bishops
  board[0][2] = board[0][5] = { type: "bishop", player: 1 };
  board[7][2] = board[7][5] = { type: "bishop", player: 2 };

  // Place queens
  board[0][3] = { type: "queen", player: 1 };
  board[7][3] = { type: "queen", player: 2 };

  // Place kings
  board[0][4] = { type: "king", player: 1 };
  board[7][4] = { type: "king", player: 2 };

  return board;
};

export {
  isValidPawnMove,
  isValidKnightMove,
  isValidRookMove,
  isValidBishopMove,
  isValidQueenMove,
  isValidKingMove,
};
