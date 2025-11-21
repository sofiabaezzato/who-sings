import { create } from "zustand";
import { GAME_CONFIG } from "../utils/constants";

export interface Track {
	trackId: number;
	trackName: string;
	artistId: number;
	artistName: string;
}

export interface Question {
	id: string;
	lyrics: string;
	correctArtist: string;
	options: string[];
	track: Track;
}

export interface QuizAnswer {
	questionId: string;
	selectedAnswer: string;
	isCorrect: boolean;
	timeRemaining: number;
	points: number;
}

export interface GameState {
	questions: Question[];
	currentQuestionIndex: number;
	answers: QuizAnswer[];
	totalScore: number;
	isComplete: boolean;
	startTime: number;
}

interface GameStore {
	// Game state
	gameState: GameState;

	// Computed properties (stored in state for reactivity)
	currentQuestion: Question | null;
	isLastQuestion: boolean;
	progress: number;

	// Actions
	answerQuestion: (
		answer: string,
		timeRemaining: number,
		hintUsed?: boolean,
	) => void;
	nextQuestion: () => void;
	resetGame: () => void;
	startNewGame: (questions: Question[]) => void;
}

const initialGameState: GameState = {
	questions: [],
	currentQuestionIndex: 0,
	answers: [],
	totalScore: 0,
	isComplete: false,
	startTime: 0,
};

const calculatePoints = (
	isCorrect: boolean,
	timeRemaining: number,
	hintUsed = false,
): number => {
	if (!isCorrect) return 0;

	const basePoints = GAME_CONFIG.BASE_POINTS;
	const timeBonus = Math.floor(
		(timeRemaining / GAME_CONFIG.TIME_PER_QUESTION_S) *
			(GAME_CONFIG.BASE_POINTS * GAME_CONFIG.TIME_BONUS_MULTIPLIER),
	);
	const totalPoints = basePoints + timeBonus;

	return hintUsed ? Math.floor(totalPoints / 2) : totalPoints;
};

const computeCurrentQuestion = (gameState: GameState): Question | null => {
	if (gameState.currentQuestionIndex >= gameState.questions.length) {
		return null;
	}
	return gameState.questions[gameState.currentQuestionIndex];
};

const computeIsLastQuestion = (gameState: GameState): boolean => {
	return gameState.currentQuestionIndex === gameState.questions.length - 1;
};

const computeProgress = (gameState: GameState): number => {
	if (gameState.questions.length === 0) return 0;
	return (gameState.currentQuestionIndex / gameState.questions.length) * 100;
};

const updateComputedValues = (gameState: GameState) => ({
	currentQuestion: computeCurrentQuestion(gameState),
	isLastQuestion: computeIsLastQuestion(gameState),
	progress: computeProgress(gameState),
});

export const useGameStore = create<GameStore>((set, get) => ({
	// Game state
	gameState: initialGameState,

	// Computed properties (initialized)
	currentQuestion: null,
	isLastQuestion: false,
	progress: 0,

	// Actions
	answerQuestion: (answer: string, timeRemaining: number, hintUsed = false) => {
		const state = get();
		const currentQuestion = state.currentQuestion;

		if (!currentQuestion || state.gameState.isComplete) return;

		const isCorrect = answer === currentQuestion.correctArtist;
		const points = calculatePoints(isCorrect, timeRemaining, hintUsed);

		const newAnswer: QuizAnswer = {
			questionId: currentQuestion.id,
			selectedAnswer: answer,
			isCorrect,
			timeRemaining,
			points,
		};

		set((state) => {
			const newGameState = {
				...state.gameState,
				answers: [...state.gameState.answers, newAnswer],
				totalScore: state.gameState.totalScore + points,
			};

			return {
				gameState: newGameState,
				...updateComputedValues(newGameState),
			};
		});
	},

	nextQuestion: () => {
		set((state) => {
			const nextIndex = state.gameState.currentQuestionIndex + 1;
			const isComplete = nextIndex >= state.gameState.questions.length;

			console.log("Next Question:", {
				currentIndex: state.gameState.currentQuestionIndex,
				nextIndex,
				totalQuestions: state.gameState.questions.length,
				willBeComplete: isComplete,
				currentAnswers: state.gameState.answers.length,
			});

			const newGameState = {
				...state.gameState,
				currentQuestionIndex: nextIndex,
				isComplete,
			};

			if (isComplete) {
				console.log("Game Completed!", {
					finalScore: newGameState.totalScore,
					totalAnswers: newGameState.answers.length,
					correctAnswers: newGameState.answers.filter((a) => a.isCorrect)
						.length,
					questionsLength: newGameState.questions.length,
				});
			}

			return {
				gameState: newGameState,
				...updateComputedValues(newGameState),
			};
		});
	},

	startNewGame: (questions: Question[]) => {
		set(() => {
			const newGameState = {
				questions,
				currentQuestionIndex: 0,
				answers: [],
				totalScore: 0,
				isComplete: false,
				startTime: Date.now(),
			};

			console.log("Starting New Game:", {
				questionsCount: questions.length,
				startTime: newGameState.startTime,
				isComplete: newGameState.isComplete,
			});

			return {
				gameState: newGameState,
				...updateComputedValues(newGameState),
			};
		});
	},

	resetGame: () => {
		set(() => {
			console.log("Zustand resetGame called, setting questions to []");
			return {
				gameState: initialGameState,
				...updateComputedValues(initialGameState),
			};
		});
	},
}));
