import { Clock, Lightbulb, Play, Trophy } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/hooks/useAuth.ts";
import { PlayerAuth } from "../components/PlayerAuth";
import { QuizCard } from "../components/QuizCard";
import { GameProvider } from "../contexts/GameContext";
import { TimerProvider } from "../contexts/TimerContext";
import { useGameSession } from "../hooks/useGameSession";
import { useTimer } from "../hooks/useTimer";
import { GAME_CONFIG } from "../utils/constants";

function QuizContent() {
	const {
		gameState,
		sessionState,
		resetSession,
		retrySave,
		nextQuestion,
		currentQuestion,
	} = useGameSession();
	const { startTimer } = useTimer();
	const nextQuestionRef = useRef(nextQuestion);

	// Update ref when nextQuestion changes
	useEffect(() => {
		nextQuestionRef.current = nextQuestion;
	}, [nextQuestion]);

	// Start timer for each question
	useEffect(() => {
		if (currentQuestion && !gameState.isComplete) {
			startTimer(GAME_CONFIG.TIME_PER_QUESTION_S, () => {
				// Auto advance on timeout - use setTimeout to defer the state update
				setTimeout(() => {
					nextQuestionRef.current();
				}, 0);
			});
		}
	}, [currentQuestion, gameState.isComplete, startTimer]);

	// Error state
	if (sessionState.error) {
		return (
			<div className="min-h-screen flex justify-center p-4 pt-8">
				<div className="text-center bg-white rounded-3xl shadow-xl p-8 max-w-md mb-auto">
					<div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<span className="text-2xl text-red-600">!</span>
					</div>
					<h2 className="text-2xl font-bold text-gray-900 mb-4">
						Quiz Unavailable
					</h2>
					<p className="text-gray-600 mb-6">{sessionState.error}</p>
					<button
						onClick={resetSession}
						className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-full transition-colors duration-200 text-lg cursor-pointer"
					>
						Try Again
					</button>
				</div>
			</div>
		);
	}

	// Loading state
	if (sessionState.isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center pt-8">
				<div className="text-center bg-white rounded-3xl shadow-xl p-8">
					<div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
					<p className="text-gray-600">Loading quiz...</p>
				</div>
			</div>
		);
	}

	// Completion state
	if (gameState.isComplete) {
		return (
			<div className="min-h-screen flex justify-center p-8">
				<div className="w-full max-w-2xl text-center bg-white rounded-3xl shadow-xl p-8 mb-auto">
					<h2 className="text-3xl font-bold text-gray-900 mb-4">
						Quiz Complete!
					</h2>
					<p className="text-xl text-gray-700 mb-2">
						Final Score: {gameState.totalScore}
					</p>
					<p className="text-gray-600 mb-6">
						{gameState.answers.filter((a) => a.isCorrect).length} /{" "}
						{gameState.questions.length} correct
					</p>

					{/* Save error handling */}
					{sessionState.saveError && (
						<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
							<p className="text-yellow-800 text-sm mb-2">
								{sessionState.saveError}
							</p>
							<button
								onClick={retrySave}
								className="text-yellow-600 hover:text-yellow-700 text-sm font-medium underline"
							>
								Retry Save
							</button>
						</div>
					)}

					<button
						onClick={resetSession}
						className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-full transition-colors duration-200 text-lg cursor-pointer"
					>
						Play Again
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen flex justify-center pt-8 p-4">
			<QuizCard />
		</div>
	);
}

function QuizStartCard({ onStart }: { onStart: () => void }) {
	const { player } = useAuth();

	return (
		<div className="min-h-screen flex flex-col">
			<div className="w-full py-10 px-2 flex flex-col items-center justify-center text-center bg-orange-500">
				<h1 className="text-4xl font-bold text-white mb-2">WHO SINGS?</h1>
				<p className="text-gray-800 text-white font-semibold">Test your music knowledge</p>
			</div>
			<div className="flex-1 flex justify-center p-4">
				<div className="w-full max-w-md">
					<div className="bg-white rounded-3xl shadow-xl p-8 text-center">
						<div className="space-y-6">
							<div>
								<h2 className="text-xl font-semibold text-gray-700 mb-4">
									Ready to start, {player?.name}?
								</h2>

								<div className="space-y-4 text-left bg-gray-50 rounded-xl p-4 mb-6">
									<div className="flex items-center gap-3">
										<Play className="w-5 h-5 text-orange-500" />
										<span className="text-gray-700">
											Identify the artist from lyrics
										</span>
									</div>
									<div className="flex items-center gap-3">
										<Trophy className="w-5 h-5 text-orange-500" />
										<span className="text-gray-700">
											10 questions to complete
										</span>
									</div>
									<div className="flex items-center gap-3">
										<Clock className="w-5 h-5 text-orange-500" />
										<span className="text-gray-700">
											{GAME_CONFIG.TIME_PER_QUESTION_S} seconds per question
										</span>
									</div>
									<div className="flex items-center gap-3">
										<Lightbulb className="w-5 h-5 text-orange-500" />
										<span className="text-gray-700">
											Use hints for half points
										</span>
									</div>
								</div>
							</div>

							<div className="w-full flex items-center justify-center">
								<button
									onClick={onStart}
									className="flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-full transition-colors duration-200 text-lg cursor-pointer"
								>
									<Play className="w-5 h-5 mr-2" />
									Let's Start
								</button>
							</div>
						</div>

						<p className="text-sm text-gray-500 mt-6">
							Your score will be saved to your profile
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

export default function Quiz() {
	const { isLoggedIn } = useAuth();
	const [hasStarted, setHasStarted] = useState(false);

	if (!isLoggedIn) {
		return <PlayerAuth />;
	}

	if (!hasStarted) {
		return <QuizStartCard onStart={() => setHasStarted(true)} />;
	}

	return (
		<GameProvider>
			<TimerProvider>
				<QuizContent />
			</TimerProvider>
		</GameProvider>
	);
}
