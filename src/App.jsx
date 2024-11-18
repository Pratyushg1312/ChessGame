import React, { useState, useEffect } from "react";
import ChessBoard from "./components/ChessBoard";
import Timer from "./components/Timer";
import { createInitialBoard, getThreatenedSquares, isValidMove } from "./utils/chessUtils";
import "./App.css";

const App = () => {
  const [board, setBoard] = useState(createInitialBoard());
  const [currentPlayer, setCurrentPlayer] = useState(1); // Player 1 starts
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [timer, setTimer] = useState(60); // 60 seconds per turn
  const [winner, setWinner] = useState(null); // Track the winner
  const [validMoves, setValidMoves] = useState([]); // Track valid moves for the selected piece

  // Timer countdown
  useEffect(() => {
    if (timer > 0 && !winner) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    } else if (timer === 0 && !winner) {
      // Switch player when timer runs out
      switchPlayer();
    }
  }, [timer, winner]);

  // Switch to the next player
  const switchPlayer = () => {
    setCurrentPlayer((prev) => (prev === 1 ? 2 : 1)); // Switch player
    setTimer(60); // Reset timer
    setSelectedPiece(null); // Deselect the piece
    setValidMoves([]); // Clear valid moves
  };

  // Check if a king is captured
  const isKingCaptured = (board, player) => {
    const kingPosition = findKingPosition(board, player);
    return !kingPosition; // If no king found, it means it's captured
  };

  // Find the position of the king for the player
  const findKingPosition = (board, player) => {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (piece && piece.type === 'king' && piece.player === player) {
          return { row, col };
        }
      }
    }
    return null; // King not found
  };

  // Calculate valid moves for a piece
  const calculateValidMoves = (row, col) => {
    const piece = board[row][col];
    let validMoves = [];

    if (!piece) return validMoves;

    // Check each square on the board for valid moves
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (isValidMove(row, col, r, c, board, piece.player)) {
          const targetSquare = board[r][c];
          validMoves.push({ row: r, col: c, isEnemy: targetSquare && targetSquare.player !== piece.player, });
        }
      }
    }

    return validMoves;
  };

  // Handle square click (piece selection and movement)
  const handleSquareClick = (row, col) => {
    if (winner) return; // If there's a winner, no more moves

    if (selectedPiece) {
      const { row: selectedRow, col: selectedCol } = selectedPiece;

      // Deselect the piece if the same square is clicked
      if (selectedRow === row && selectedCol === col) {
        setSelectedPiece(null);
        setValidMoves([]); // Clear valid moves when deselecting
        return;
      }

      // Attempt to move the selected piece
      if (
        isValidMove(
          selectedRow,
          selectedCol,
          row,
          col,
          board,
          board[selectedRow][selectedCol].player
        )
      ) {
        const newBoard = board.map((r) => r.slice());
        newBoard[row][col] = newBoard[selectedRow][selectedCol];
        newBoard[selectedRow][selectedCol] = null;

        setBoard(newBoard);
        setSelectedPiece(null); // Deselect after move
        setValidMoves([]); // Clear valid moves

        // Check for a winner after the move
        if (isKingCaptured(newBoard, 1)) {
          setWinner(2); // Player 2 wins
          alert('Player 2 wins!');
        } else if (isKingCaptured(newBoard, 2)) {
          setWinner(1); // Player 1 wins
          alert('Player 1 wins!');
        } else {
          switchPlayer(); // Switch player after a valid move
        }
      } else {
        alert('Invalid move!');
      }
    } else if (board[row][col] && board[row][col].player === currentPlayer) {
      // Select a piece if it's the current player's turn
      setSelectedPiece({ row, col });
      const validMoves = calculateValidMoves(row, col); // Calculate valid moves for the selected piece
      setValidMoves(validMoves); // Set valid moves to highlight
    }
  };



  return (
    <div className="App">
      <h2>Player {currentPlayer}'s Turn</h2>
      <Timer timeLeft={timer} />
      <ChessBoard
        board={board}
        selectedPiece={selectedPiece}
        handleSquareClick={handleSquareClick}
        validMoves={validMoves} // Pass valid moves to ChessBoard
        winner={winner}  // Pass winner to disable board interaction

      />
    </div>
  );
};

export default App;
