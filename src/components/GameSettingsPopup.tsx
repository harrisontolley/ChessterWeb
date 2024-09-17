// GameSettingsPopup.tsx
import React from "react";
import "./styles.css";

interface GameSettingsPopupProps {
    onStartGame: (color: "white" | "black", depth: number) => void;
}

const GameSettingsPopup: React.FC<GameSettingsPopupProps> = ({ onStartGame }) => {
    const [selectedColor, setSelectedColor] = React.useState<"white" | "black">("white");
    const [selectedDifficulty, setSelectedDifficulty] = React.useState<"easy" | "medium" | "hard">("medium");

    const handleStartGame = () => {
        let depth = 3;
        if (selectedDifficulty === "easy") {
            depth = 1;
        } else if (selectedDifficulty === "medium") {
            depth = 3;
        } else if (selectedDifficulty === "hard") {
            depth = 5;
        }
        onStartGame(selectedColor, depth);
    };

    return (
        <div className="popup">
            <h2>Select Game Settings</h2>
            <div>
                <p>Select Color:</p>
                <button
                    onClick={() => setSelectedColor("white")}
                    className={selectedColor === "white" ? "selected" : "unselected"}
                >
                    White
                </button>
                <button
                    onClick={() => setSelectedColor("black")}
                    className={selectedColor === "black" ? "selected" : "unselected"}
                >
                    Black
                </button>
            </div>
            <div>
                <p>Select Difficulty:</p>
                <button
                    onClick={() => setSelectedDifficulty("easy")}
                    className={selectedDifficulty === "easy" ? "selected-easy" : "unselected"}
                >
                    Easy
                </button>
                <button
                    onClick={() => setSelectedDifficulty("medium")}
                    className={selectedDifficulty === "medium" ? "selected-medium" : "unselected"}
                >
                    Medium
                </button>
                <button
                    onClick={() => setSelectedDifficulty("hard")}
                    className={selectedDifficulty === "hard" ? "selected-hard" : "unselected"}
                >
                    Hard
                </button>
            </div>
            <button onClick={handleStartGame}>Start Game</button>
        </div>
    );
};

export default GameSettingsPopup;
