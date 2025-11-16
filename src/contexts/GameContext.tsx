import {
	createContext,
	type ReactNode,
	useCallback,
	useMemo,
	useState,
} from "react";

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

interface GameContextType {
	gameState: GameState;
	currentQuestion: Question | null;
	answerQuestion: (answer: string, timeRemaining: number, hintUsed?: boolean) => void;
	nextQuestion: () => void;
	resetGame: () => void;
	startNewGame: (questions: Question[]) => void;
	isLastQuestion: boolean;
	progress: number;
}

const GameContext = createContext<GameContextType | null>(null);

interface GameProviderProps {
	children: ReactNode;
}

const initialGameState: GameState = {
	questions: [],
	currentQuestionIndex: 0,
	answers: [],
	totalScore: 0,
	isComplete: false,
	startTime: 0,
};

export function GameProvider({ children }: GameProviderProps) {
	const [gameState, setGameState] = useState<GameState>(initialGameState);

	const currentQuestion = useMemo(() => {
		if (gameState.currentQuestionIndex >= gameState.questions.length) {
			return null;
		}
		return gameState.questions[gameState.currentQuestionIndex];
	}, [gameState.currentQuestionIndex, gameState.questions]);

	const isLastQuestion = useMemo(() => {
		return gameState.currentQuestionIndex === gameState.questions.length - 1;
	}, [gameState.currentQuestionIndex, gameState.questions.length]);

	const progress = useMemo(() => {
		if (gameState.questions.length === 0) return 0;
		return (gameState.currentQuestionIndex / gameState.questions.length) * 100;
	}, [gameState.currentQuestionIndex, gameState.questions.length]);

	const calculatePoints = (
		isCorrect: boolean,
		timeRemaining: number,
		hintUsed: boolean = false,
	): number => {
		if (!isCorrect) return 0;

		const basePoints = 100;
		const timeBonus = Math.floor((timeRemaining / 30) * 50);
		const totalPoints = basePoints + timeBonus;
		
		return hintUsed ? Math.floor(totalPoints / 2) : totalPoints;
	};

	const answerQuestion = useCallback(
		(answer: string, timeRemaining: number, hintUsed: boolean = false) => {
			if (!currentQuestion || gameState.isComplete) return;

			const isCorrect = answer === currentQuestion.correctArtist;
			const points = calculatePoints(isCorrect, timeRemaining, hintUsed);

			const newAnswer: QuizAnswer = {
				questionId: currentQuestion.id,
				selectedAnswer: answer,
				isCorrect,
				timeRemaining,
				points,
			};

			setGameState((prev) => ({
				...prev,
				answers: [...prev.answers, newAnswer],
				totalScore: prev.totalScore + points,
			}));
		},
		[currentQuestion, gameState.isComplete],
	);

	const nextQuestion = useCallback(() => {
		setGameState((prev) => {
			const nextIndex = prev.currentQuestionIndex + 1;
			const isComplete = nextIndex >= prev.questions.length;

			return {
				...prev,
				currentQuestionIndex: nextIndex,
				isComplete,
			};
		});
	}, []);

	const startNewGame = useCallback((questions: Question[]) => {
		setGameState({
			questions,
			currentQuestionIndex: 0,
			answers: [],
			totalScore: 0,
			isComplete: false,
			startTime: Date.now(),
		});
	}, []);

	const resetGame = useCallback(() => {
		setGameState(initialGameState);
	}, []);

	const value: GameContextType = useMemo(
		() => ({
			gameState,
			currentQuestion,
			answerQuestion,
			nextQuestion,
			resetGame,
			startNewGame,
			isLastQuestion,
			progress,
		}),
		[
			gameState,
			currentQuestion,
			answerQuestion,
			nextQuestion,
			resetGame,
			startNewGame,
			isLastQuestion,
			progress,
		],
	);

	return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export { GameContext };
