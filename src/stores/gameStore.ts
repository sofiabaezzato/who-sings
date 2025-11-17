import { create } from 'zustand'
import { GAME_CONFIG } from '../utils/constants'

export interface Track {
	trackId: number
	trackName: string
	artistId: number
	artistName: string
}

export interface Question {
	id: string
	lyrics: string
	correctArtist: string
	options: string[]
	track: Track
}

export interface QuizAnswer {
	questionId: string
	selectedAnswer: string
	isCorrect: boolean
	timeRemaining: number
	points: number
}

export interface GameState {
	questions: Question[]
	currentQuestionIndex: number
	answers: QuizAnswer[]
	totalScore: number
	isComplete: boolean
	startTime: number
}

interface GameStore {
	// Game state (for compatibility)
	gameState: GameState
	
	// Computed properties
	currentQuestion: Question | null
	isLastQuestion: boolean
	progress: number
	
	// Actions
	answerQuestion: (answer: string, timeRemaining: number, hintUsed?: boolean) => void
	nextQuestion: () => void
	resetGame: () => void
	startNewGame: (questions: Question[]) => void
}

const initialGameState: GameState = {
	questions: [],
	currentQuestionIndex: 0,
	answers: [],
	totalScore: 0,
	isComplete: false,
	startTime: 0,
}

const calculatePoints = (
	isCorrect: boolean,
	timeRemaining: number,
	hintUsed = false,
): number => {
	if (!isCorrect) return 0

	const basePoints = GAME_CONFIG.BASE_POINTS
	const timeBonus = Math.floor(
		(timeRemaining / GAME_CONFIG.TIME_PER_QUESTION_S) *
			(GAME_CONFIG.BASE_POINTS * GAME_CONFIG.TIME_BONUS_MULTIPLIER),
	)
	const totalPoints = basePoints + timeBonus

	return hintUsed ? Math.floor(totalPoints / 2) : totalPoints
}

export const useGameStore = create<GameStore>((set, get) => ({
	// Game state
	gameState: initialGameState,

	// Computed properties
	get currentQuestion() {
		const { gameState } = get()
		if (gameState.currentQuestionIndex >= gameState.questions.length) {
			return null
		}
		return gameState.questions[gameState.currentQuestionIndex]
	},

	get isLastQuestion() {
		const { gameState } = get()
		return gameState.currentQuestionIndex === gameState.questions.length - 1
	},

	get progress() {
		const { gameState } = get()
		if (gameState.questions.length === 0) return 0
		return (gameState.currentQuestionIndex / gameState.questions.length) * 100
	},

	// Actions
	answerQuestion: (answer: string, timeRemaining: number, hintUsed = false) => {
		const state = get()
		const currentQuestion = state.currentQuestion
		
		if (!currentQuestion || state.gameState.isComplete) return

		const isCorrect = answer === currentQuestion.correctArtist
		const points = calculatePoints(isCorrect, timeRemaining, hintUsed)

		const newAnswer: QuizAnswer = {
			questionId: currentQuestion.id,
			selectedAnswer: answer,
			isCorrect,
			timeRemaining,
			points,
		}

		set((state) => ({
			gameState: {
				...state.gameState,
				answers: [...state.gameState.answers, newAnswer],
				totalScore: state.gameState.totalScore + points,
			}
		}))
	},

	nextQuestion: () => {
		set((state) => {
			const nextIndex = state.gameState.currentQuestionIndex + 1
			const isComplete = nextIndex >= state.gameState.questions.length

			return {
				gameState: {
					...state.gameState,
					currentQuestionIndex: nextIndex,
					isComplete,
				}
			}
		})
	},

	startNewGame: (questions: Question[]) => {
		set({
			gameState: {
				questions,
				currentQuestionIndex: 0,
				answers: [],
				totalScore: 0,
				isComplete: false,
				startTime: Date.now(),
			}
		})
	},

	resetGame: () => {
		set({ gameState: initialGameState })
	},
}))