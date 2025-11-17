import { Clock, Lightbulb, Play, Share, Trophy } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/hooks/useAuth.ts";
import { ErrorBoundary, QuizErrorFallback } from "../components/ErrorBoundary";
import { PlayerAuth } from "../components/PlayerAuth";
import { QuizCard } from "../components/QuizCard";
import { ShareCard } from "../components/ShareCard";
import { TimerProvider } from "../contexts/TimerContext";
import { useGameSession } from "../hooks/useGameSession";
import { useTimer } from "../hooks/useTimer";
import { useShareCard } from "../hooks/useShareCard";
import { useGameData } from "../hooks/useGameData";
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
	const { player } = useAuth();
	const { shareCard } = useShareCard();
	const { getLeaderboard } = useGameData();
	const shareCardRef = useRef<HTMLDivElement>(null);
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
		const handleShare = () => {
			if (shareCardRef.current) {
				shareCard(shareCardRef.current);
			}
		};

		// Calculate leaderboard position
		const leaderboard = getLeaderboard();
		const currentPlayerEntry = leaderboard.find(entry => entry.playerName === player?.name);
		const leaderboardPosition = currentPlayerEntry ? 
			leaderboard.findIndex(entry => entry.playerName === player?.name) + 1 : 
			undefined;

		return (
			<div className="min-h-screen flex justify-center p-4 bg-gray-50 py-8">
				<div className="w-full max-w-md">
					<ShareCard
						ref={shareCardRef}
						playerName={player?.name || "Player"}
						totalScore={gameState.totalScore}
						correctAnswers={gameState.answers.filter((a: any) => a.isCorrect).length}
						totalQuestions={gameState.questions.length}
						leaderboardPosition={leaderboardPosition}
					/>

					{/* Save error handling */}
					{sessionState.saveError && (
						<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
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
}

function QuizStartCard({ onStart }: { onStart: () => void }) {
	const { player } = useAuth();

	return (
		<div className="min-h-screen flex flex-col">
			<div className="w-full py-10 px-2 flex flex-col items-center justify-center text-center bg-gradient-to-r from-orange-500 to-orange-600">
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
		<ErrorBoundary fallback={QuizErrorFallback}>
			<TimerProvider>
				<QuizContent />
			</TimerProvider>
		</ErrorBoundary>
	);
}
