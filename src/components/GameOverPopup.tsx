// GameOverPopup.tsx
import React from "react";

interface GameOverPopupProps {
    winner: string | null;
    onNewGame: () => void;
}

const GameOverPopup: React.FC<GameOverPopupProps> = ({ winner, onNewGame }) => {
    return (
        <div
            className="overlay"
        >
            <div
                className="popup"
            >
                <h2>Game Over</h2>
                <p>{winner}</p>
                <button onClick={onNewGame}>Start New Game</button>
            </div>
        </div>
    );
};

export default GameOverPopup;
