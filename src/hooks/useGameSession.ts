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
		console.log("Initialize Game Called");

		if (isInitialized || gameState.questions.length > 0) {
			console.log("Initialize Game Skipped:", {
				reason: isInitialized
					? "already initialized"
					: "game already has questions",
			});
			return;
		}

		try {
			setSessionState((prev) => ({ ...prev, error: null, isLoading: true }));

			const questions = await generateQuizQuestions();
			setIsInitialized(true);

			console.log("Generated questions, calling startNewGame...", {
				questionsCount: questions.length,
			});
			startNewGame(questions);

			setSessionState((prev) => ({ ...prev, isLoading: false }));
			console.log("Game initialization completed");
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "Failed to load quiz";
			console.error("Game initialization failed:", errorMessage);
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

		console.log("Saving game result programmatically...", {
			gameState: {
				isComplete: gameState.isComplete,
				totalScore: gameState.totalScore,
				questionsLength: gameState.questions.length,
				answersCount: gameState.answers.length,
				startTime: gameState.startTime,
			},
			player: {
				id: player.id,
				name: player.name,
			},
		});

		const totalTime = Math.round((Date.now() - gameState.startTime) / 1000);
		const gameResult = {
			score: gameState.totalScore,
			totalQuestions: gameState.questions.length,
			completedAt: new Date().toISOString(),
			timeSpent: totalTime,
		};

		console.log("Saving game result:", gameResult);
		addGameResult(player.id, gameResult);
		console.log("Game result saved successfully");
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
		console.log("=== RESET SESSION START ===");
		console.log("Before Reset - Session State:", sessionState);
		console.log("Before Reset - Game State:", {
			isComplete: gameState.isComplete,
			totalScore: gameState.totalScore,
			questionsLength: gameState.questions.length,
			currentQuestionIndex: gameState.currentQuestionIndex,
			answersLength: gameState.answers.length,
		});

		setSessionState({
			isLoading: false,
			error: null,
			isSaved: false,
		});

		setIsInitialized(false);

		initializeGame();

		console.log("=== RESET SESSION END ===");
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
