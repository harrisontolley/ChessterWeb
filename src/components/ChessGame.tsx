import React, { useState, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import { Chess, Square } from "chess.js";
import GameSettingsPopup from "./GameSettingsPopup";
import GameOverPopup from "./GameOverPopup";
import { getBestMove } from "../services/api";
import "./styles.css";

// Import images for difficulty levels
import easyProfilePic from "../images/easy.jpg";
import mediumProfilePic from "../images/medium.jpg";
import hardProfilePic from "../images/hard.jpg";
import loadingGif from "../images/loading.gif";

const quotes = [
    "Patience is the key to victory.",
    "Every move counts!",
    "Checkmate is closer than you think.",
    "A wise player knows when to attack.",
    "Sometimes, it's better to defend.",
    "Think twice, move once.",
    "Strategy is your best weapon.",
    "Every piece has a role to play.",
    "The game of chess is a battle of minds.",
    "Are you ready for the next challenge?"
];

const ChessGame: React.FC = () => {
    const [game, setGame] = useState<Chess>(new Chess());
    const [orientation, setOrientation] = useState<"white" | "black">("white");
    const [playerColor, setPlayerColor] = useState<"white" | "black">("white");
    const [gameOver, setGameOver] = useState<boolean>(false);
    const [winner, setWinner] = useState<string | null>(null);
    const [showSettingsPopup, setShowSettingsPopup] = useState<boolean>(true);
    const [searchDepth, setSearchDepth] = useState<number>(3);
    const [profilePicture, setProfilePicture] = useState<string>(mediumProfilePic); // Default to medium
    const [isThinking, setIsThinking] = useState<boolean>(false); // New state for AI thinking
    const [moveCount, setMoveCount] = useState<number>(0); // Track move count
    const [quote, setQuote] = useState<string>("Welcome to the game!"); // Chatbox message

    useEffect(() => {
        if (!showSettingsPopup) {
            setOrientation(playerColor);
            const newGame = new Chess();
            setGame(newGame);
            setGameOver(false);
            setWinner(null);
            setMoveCount(0); // Reset move count

            if (playerColor === "black") {
                const makeFirstAIMove = async () => {
                    if (gameOver) return;
                    const fen = newGame.fen();

                    setIsThinking(true); // Start thinking
                    try {
                        const aiMoveUCI = await getBestMove(fen, searchDepth);
                        const aiMove = newGame.move(aiMoveUCI);
                        if (aiMove !== null) {
                            setGame(new Chess(newGame.fen()));
                        }
                    } catch (error) {
                        console.error("Error fetching the AI move:", error);
                    } finally {
                        setIsThinking(false); // Stop thinking
                    }
                };
                makeFirstAIMove();
            }
        }
    }, [playerColor, showSettingsPopup]);

    useEffect(() => {
        if (game.isGameOver()) {
            setGameOver(true);
            let resultMessage = "";
            if (game.isCheckmate()) {
                const loserColor = game.turn() === "w" ? "white" : "black";
                const winnerColor = loserColor === "white" ? "black" : "white";
                resultMessage = winnerColor === playerColor ? "You win by checkmate!" : "AI wins by checkmate!";
            } else if (game.isStalemate()) {
                resultMessage = "Draw by stalemate.";
            } else if (game.isInsufficientMaterial()) {
                resultMessage = "Draw by insufficient material.";
            } else if (game.isThreefoldRepetition()) {
                resultMessage = "Draw by threefold repetition.";
            } else if (game.isDraw()) {
                resultMessage = "Draw.";
            }
            setWinner(resultMessage);
        }
    }, [game]);

    // Pick a random quote and display it
    const displayRandomQuote = () => {
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        setQuote(randomQuote);
    };

    const handleMove = async (from: Square, to: Square): Promise<boolean> => {
        if (gameOver) return false;

        const updatedGame = new Chess(game.fen());
        const move = updatedGame.move({ from, to, promotion: "q" });

        if (move === null) return false;

        setGame(updatedGame);
        setMoveCount((prevCount) => prevCount + 1); // Increment move count

        if (moveCount % 3 === 0) { // Every 3 moves, display a random quote
            displayRandomQuote();
        }

        if (updatedGame.isGameOver()) return true;

        setIsThinking(true); // Start thinking
        try {
            const aiMoveUCI = await getBestMove(updatedGame.fen(), searchDepth);
            setGame((g) => {
                const newGame = new Chess(g.fen());
                const aiMove = newGame.move(aiMoveUCI);
                return aiMove ? newGame : g;
            });
        } catch (error) {
            console.error("Error fetching the AI move:", error);
        } finally {
            setIsThinking(false); // Stop thinking
        }

        return true;
    };

    const handleStartGame = (color: "white" | "black", depth: number) => {
        setPlayerColor(color);
        setSearchDepth(depth);

        // Set profile picture based on difficulty level
        if (depth === 1) {
            setProfilePicture(easyProfilePic);
        } else if (depth === 3) {
            setProfilePicture(mediumProfilePic);
        } else if (depth === 5) {
            setProfilePicture(hardProfilePic);
        }

        setShowSettingsPopup(false);
    };

    const handleNewGame = () => {
        setGame(new Chess());
        setGameOver(false);
        setWinner(null);
        setShowSettingsPopup(true);
    };

    return (
        <div className="chess-game">
            <div className="profile-chat-container">
                <img src={profilePicture} alt="Profile" className="profile-picture"/>
                <div className="name-chatbox-container">
                    <h2>Chesster</h2>
                    <div className="chatbox">
                        <p>{quote}</p>
                    </div>
                </div>
                {isThinking && (
                    <img src={loadingGif} alt="Thinking..." className="loading-spinner" />
                )}

            </div>

            {!showSettingsPopup && (
                <>
                    <div className="chessboard-container">
                        <Chessboard
                            onPieceDrop={gameOver ? undefined : handleMove}
                            position={game.fen()}
                            boardOrientation={orientation}
                            arePiecesDraggable={!gameOver}
                        />
                    </div>

                    {gameOver && <GameOverPopup winner={winner} onNewGame={handleNewGame}/>}
                </>
            )}

            {showSettingsPopup && <GameSettingsPopup onStartGame={handleStartGame}/>}
        </div>
    );
};

export default ChessGame;
