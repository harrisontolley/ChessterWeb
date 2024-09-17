// GameControls.tsx
import React from "react";
import "./styles.css"

interface GameControlsProps {
    onPlayerColorChange: (color: "white" | "black") => void;
}

const GameControls: React.FC<GameControlsProps> = ({ onPlayerColorChange }) => {
    return (
        <div>
            <button className="select_colour" id="play_white" onClick={() => onPlayerColorChange("white")}>Play as White</button>
            <button className="select_colour" id="play_black" onClick={() => onPlayerColorChange("black")}>Play as Black</button>
        </div>
    );
};

export default GameControls;
