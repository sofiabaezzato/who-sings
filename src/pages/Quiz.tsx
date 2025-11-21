import { Clock, Lightbulb, Play, Share, Trophy } from "lucide-react";
import { useCallback, useEffect, useRef, useState, memo } from "react";
import { useAuth } from "@/hooks/useAuth.ts";
import { ErrorBoundary, QuizErrorFallback } from "../components/ErrorBoundary";
import { PlayerAuth } from "../components/PlayerAuth";
import { QuizCard } from "../components/QuizCard";
import QuizHeader from "../components/QuizHeader";
import { ShareCard } from "../components/ShareCard";
import { TimerProvider } from "../contexts/TimerContext";
import { useGameData } from "../hooks/useGameData";
import { useGameSession } from "../hooks/useGameSession";
import { useShareCard } from "../hooks/useShareCard";
import { useTimer } from "../hooks/useTimer";
import { GAME_CONFIG } from "../utils/constants";
import {useGame} from "@/hooks/useGame.ts";

const QuizContent = memo(function QuizContent() {
	console.log("QuizContent component rendered");
	
	useEffect(() => {
		console.log("QuizContent component mounted");
		return () => console.log("QuizContent component unmounted");
	}, []);
	
	const {
		gameState,
		sessionState,
		resetSession,
		nextQuestion,
		currentQuestion,
		saveGameResult,
	} = useGameSession();
	const { startTimer } = useTimer();
	const { player } = useAuth();
	const { shareCard } = useShareCard();
	const { getLeaderboard } = useGameData();
	const { resetGame } = useGame()
	const shareCardRef = useRef<HTMLDivElement>(null);
	const nextQuestionRef = useRef(nextQuestion);

	const handleShare = useCallback(() => {
		if (shareCardRef.current) {
			shareCard(shareCardRef.current);
		}
	}, [shareCard]);

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
					// Save game if completed after timeout
					if (gameState.currentQuestionIndex >= gameState.questions.length - 1) {
						console.log("Timer finished, saving game and resetting...");
						saveGameResult();
						resetGame();
						console.log("Game reset completed, questions length:", gameState.questions.length);
					}
				}, 0);
			});
		}
	}, [currentQuestion, gameState.isComplete, startTimer]);

	// Loading state
	if (sessionState.isLoading) {
		return (
			<div className="flex flex-col items-center">
				<QuizHeader />
				<div className="flex-col items-center justify-center mx-auto text-center bg-white rounded-3xl shadow-xl p-8 mt-8">
					<div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
					<p className="text-gray-600">Loading quiz...</p>
				</div>
				<div className="min-h-screen flex justify-center pt-8"></div>
			</div>
		);
	}

	// Completion state
	if (gameState.isComplete) {
		// Calculate leaderboard position
		const leaderboard = getLeaderboard();
		const currentPlayerEntry = leaderboard.find(
			(entry) => entry.playerName === player?.name,
		);
		const leaderboardPosition = currentPlayerEntry
			? leaderboard.findIndex((entry) => entry.playerName === player?.name) + 1
			: undefined;

		return (
			<div className="min-h-screen flex justify-center p-4 bg-gray-50 py-8">
				<div className="w-full max-w-md">
					<ShareCard
						ref={shareCardRef}
						playerName={player?.name || "Player"}
						totalScore={gameState.totalScore}
						correctAnswers={gameState.answers.filter((a) => a.isCorrect).length}
						totalQuestions={gameState.questions.length}
						leaderboardPosition={leaderboardPosition}
					/>


					<div className="flex gap-4 mt-6">
						<button
							onClick={handleShare}
							className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-full transition-colors duration-200 text-lg cursor-pointer flex items-center justify-center gap-2"
						>
							<Share className="h-5 w-5" />
							Share
						</button>
						<button
							onClick={resetSession}
							className="flex-1 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-full transition-colors duration-200 text-lg cursor-pointer border border-gray-200"
						>
							Play Again
						</button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen flex justify-center pt-8 p-4">
			<QuizCard />
		</div>
	);
});

function QuizStartCard({ onStart }: { onStart: () => void }) {
	const { resetSession } = useGameSession();
	const { resetGame } = useGame()
	const { player } = useAuth();

	return (
		<div className="min-h-screen flex flex-col">
			<QuizHeader />

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
											{GAME_CONFIG.QUESTIONS_PER_GAME} questions to complete
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
									onClick={() => {
										resetSession();
										resetGame()
										onStart();
									}}
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
		<ErrorBoundary fallback={QuizErrorFallback}>
			<TimerProvider>
				<QuizContent />
			</TimerProvider>
		</ErrorBoundary>
	);
}
