import { useCallback, useEffect, useRef, useState } from "react";
import { generateQuizQuestions } from "../services/musixmatch";
import { useAuth } from "./useAuth";
import { useGame } from "./useGame";
import { useGameData } from "./useGameData";

interface GameSessionState {
	isLoading: boolean;
	error: string | null;
	isCompleted: boolean;
	saveError: string | null;
}

export function useGameSession() {
	const { gameState, currentQuestion, startNewGame, ...gameActions } =
		useGame();
	const { addGameResult } = useGameData();
	const { player } = useAuth();

	const [sessionState, setSessionState] = useState<GameSessionState>({
		isLoading: true,
		error: null,
		isCompleted: false,
		saveError: null,
	});

	const saveAttemptedRef = useRef(false);
	const initializationRef = useRef(false);

	// Initialize game session
	const initializeGame = useCallback(async () => {
		if (initializationRef.current) return;

		try {
			setSessionState((prev) => ({ ...prev, error: null, isLoading: true }));

			const questions = await generateQuizQuestions();
			startNewGame(questions);

			setSessionState((prev) => ({ ...prev, isLoading: false }));
			initializationRef.current = true;
			saveAttemptedRef.current = false; // Reset for new game
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "Failed to load quiz";
			setSessionState((prev) => ({
				...prev,
				error: errorMessage,
				isLoading: false,
			}));
		}
	}, [startNewGame]);

	// Handle game completion and result saving
	useEffect(() => {
		if (gameState.isComplete && !saveAttemptedRef.current && player) {
			saveAttemptedRef.current = true;

			const saveGameResult = async () => {
				try {
					const totalTime = Math.round(
						(Date.now() - gameState.startTime) / 1000,
					);
					const gameResult = {
						score: gameState.totalScore,
						totalQuestions: gameState.questions.length,
						completedAt: new Date().toISOString(),
						timeSpent: totalTime,
					};

					addGameResult(player.id, gameResult);

					setSessionState((prev) => ({
						...prev,
						isCompleted: true,
						saveError: null,
					}));
				} catch (error) {
					console.error("Failed to save game result:", error);
					setSessionState((prev) => ({
						...prev,
						saveError: "Failed to save game result. Please try again.",
						isCompleted: true, // Still mark as completed for UI
					}));
				}
			};

			// Use setTimeout to ensure this runs after render
			setTimeout(saveGameResult, 0);
		}
	}, [
		gameState.isComplete,
		gameState.totalScore,
		gameState.questions.length,
		gameState.startTime,
		player,
		addGameResult,
	]);

	// Initialize on mount
	useEffect(() => {
		initializeGame();
	}, [initializeGame]);

	// Reset session when starting new game
	const resetSession = useCallback(() => {
		setSessionState({
			isLoading: true,
			error: null,
			isCompleted: false,
			saveError: null,
		});
		initializationRef.current = false;
		saveAttemptedRef.current = false;
		initializeGame();
	}, [initializeGame]);

	// Retry saving if it failed
	const retrySave = useCallback(async () => {
		if (gameState.isComplete && player && sessionState.saveError) {
			try {
				const totalTime = Math.round((Date.now() - gameState.startTime) / 1000);
				const gameResult = {
					score: gameState.totalScore,
					totalQuestions: gameState.questions.length,
					completedAt: new Date().toISOString(),
					timeSpent: totalTime,
				};

				addGameResult(player.id, gameResult);

				setSessionState((prev) => ({
					...prev,
					saveError: null,
				}));
			} catch (error) {
				console.error("Retry save failed:", error);
				// Keep the saveError state for user feedback
			}
		}
	}, [gameState, player, sessionState.saveError, addGameResult]);

	return {
		gameState,
		sessionState,
		resetSession,
		retrySave,
		currentQuestion,
		...gameActions,
	};
}
