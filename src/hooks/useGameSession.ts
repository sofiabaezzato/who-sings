import { useCallback, useEffect, useState } from "react";
import { generateQuizQuestions } from "../services/musixmatch";
import { useAuth } from "./useAuth";
import { useGame } from "./useGame";
import { useGameData } from "./useGameData";

interface GameSessionState {
	isLoading: boolean;
	error: string | null;
	isSaved: boolean;
}

export function useGameSession() {
	const { gameState, currentQuestion, startNewGame, ...gameActions } =
		useGame();
	const { addGameResult } = useGameData();
	const { player } = useAuth();

	const [sessionState, setSessionState] = useState<GameSessionState>({
		isLoading: false,
		error: null,
		isSaved: false,
	});
	const [isInitialized, setIsInitialized] = useState(false);

	// Initialize game session
	const initializeGame = useCallback(async () => {
		if (isInitialized || gameState.questions.length > 0) {
			return;
		}

		try {
			setSessionState((prev) => ({ ...prev, error: null, isLoading: true }));

			const questions = await generateQuizQuestions();
			setIsInitialized(true);

			startNewGame(questions);

			setSessionState((prev) => ({ ...prev, isLoading: false }));
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "Failed to load quiz";
			setSessionState((prev) => ({
				...prev,
				error: errorMessage,
				isLoading: false,
			}));
		}
	}, []);

	// Save game result when game completes
	const saveGameResult = useCallback(() => {
		if (sessionState.isSaved || !player) return;

		const totalTime = Math.round((Date.now() - gameState.startTime) / 1000);
		const gameResult = {
			score: gameState.totalScore,
			totalQuestions: gameState.questions.length,
			completedAt: new Date().toISOString(),
			timeSpent: totalTime,
		};

		addGameResult(player.id, gameResult);
		setSessionState((prev) => ({ ...prev, isSaved: true }));
	}, [sessionState.isSaved, player, gameState, addGameResult]);

	// Initialize on mount
	useEffect(() => {
		if (!isInitialized) {
			initializeGame();
		}
	}, []);

	// Reset session when starting new game
	const resetSession = useCallback(() => {
		setSessionState({
			isLoading: false,
			error: null,
			isSaved: false,
		});

		setIsInitialized(false);

		initializeGame();
	}, []);

	return {
		gameState,
		sessionState,
		resetSession,
		currentQuestion,
		saveGameResult,
		...gameActions,
	};
}
