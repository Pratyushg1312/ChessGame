import React from "react";
import Square from "./Square";
import "./ChessBoard.css";

const ChessBoard = ({ board, selectedPiece, handleSquareClick, validMoves, winner }) => {

    return (
        <div className="board">
            {board.map((row, rowIndex) => (
                <div key={rowIndex} className="row">
                    {row.map((square, colIndex) => {
                        const validMove = validMoves.find(
                            (move) => move.row === rowIndex && move.col === colIndex
                        );



                        return (
                            <Square
                                key={`${rowIndex}-${colIndex}`}
                                square={square}
                                isSelected={selectedPiece && selectedPiece.row === rowIndex && selectedPiece.col === colIndex}
                                isValidMove={!!validMove} // Pass valid move status to Square
                                isEnemy={validMove?.isEnemy || false}
                                onClick={() => handleSquareClick(rowIndex, colIndex)}
                                winner={winner}
                            />
                        );
                    })}
                </div>
            ))}
        </div>
    );
};

export default ChessBoard;
