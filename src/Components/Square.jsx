import React from "react";
import "./Square.css";

const Square = ({ square, isSelected, isValidMove, onClick, winner, isEnemy, threatenedSquares }) => {

    const pieceSymbols = {
        pawn: { 1: "♙", 2: "♟︎" },
        knight: { 1: "♘", 2: "♞" },
        rook: { 1: "♖", 2: "♜" },
        bishop: { 1: "♗", 2: "♝" },
        queen: { 1: "♕", 2: "♛" },
        king: { 1: "♔", 2: "♚" },
    };

    return (
        <div
            className={`square ${isSelected ? "selected" : ""} ${isValidMove ? "valid-move" : ""} ${winner ? "disabled" : ""}     ${isEnemy ? "enemy" : ""} `}
            onClick={onClick}
        >
            {square && pieceSymbols[square.type] && pieceSymbols[square.type][square.player]}
        </div>
    );
};

export default Square;
