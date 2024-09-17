// api.ts
import axios from "axios";

export const getBestMove = async (fen: string, depth: number): Promise<string> => {
    try {
        const response = await axios.post<{ best_move: string }>(
            "http://localhost:5000/best-move",
            { fen, depth }
        );
        return response.data.best_move;
    } catch (error) {
        console.error("Error fetching the AI move:", error);
        throw error;
    }
};
