import { Lightbulb } from "lucide-react";
import { useEffect, useState } from "react";
import { useGame } from "../hooks/useGame";
import { useTimer } from "../hooks/useTimer";
import { cn } from "../lib/utils";
import { AnswerOptions } from "./AnswerOptions";
import { ProgressBar } from "./ProgressBar";
import { QuestionIndicators } from "./QuestionIndicators";

interface QuizCardProps {
	className?: string;
}

export function QuizCard({ className = "" }: QuizCardProps) {
	const { currentQuestion, gameState } = useGame();
	const { timeRemaining } = useTimer();
	const [hintUsed, setHintUsed] = useState(false);

	// Reset hint when question changes
	useEffect(() => {
		setHintUsed(false);
	}, []);

	if (!currentQuestion) {
		return (
			<div className={cn("flex items-center justify-center h-full", className)}>
				<p className="text-gray-500 text-lg">Loading question...</p>
			</div>
		);
	}

	return (
		<div
			className={cn(
				"flex flex-col h-full max-w-lg mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden",
				className,
			)}
		>
			{/* Header with progress and timer */}
			<div className="p-4 bg-gradient-to-r from-orange-300 to-orange-600">
				<div className="flex items-center justify-end mb-2">
					<span className="text-white text-sm font-medium">
						{timeRemaining}s
					</span>
				</div>
				<ProgressBar className="mb-1" />
			</div>

			{/* Question indicators */}
			<QuestionIndicators />

			{/* Lyrics section */}
			<div className="flex-1 p-6 flex flex-col justify-center">
				<div className="text-center mb-4">
					<h2 className="text-lg font-semibold text-gray-800 mb-4">
						Who sings this?
					</h2>

					<div className="bg-gray-50 rounded-2xl p-6 mb-4">
						<p className="text-gray-900 text-base leading-relaxed italic">
							"{currentQuestion.lyrics}"
						</p>
					</div>

					{currentQuestion.track && (
						<div className="h-12">
							{!hintUsed ? (
								<button
									onClick={() => setHintUsed(true)}
									className="flex items-center gap-2 py-2 px-4 rounded-full mx-auto text-orange-500 hover:text-orange-600 text-sm font-medium transition-colors duration-200 border border-orange-500 cursor-pointer"
								>
									<Lightbulb />
									Show hint
								</button>
							) : (
								<p className="text-orange-600 text-sm font-medium text-center">
									From "{currentQuestion.track.trackName}"
								</p>
							)}
						</div>
					)}
				</div>

				<AnswerOptions
					options={currentQuestion.options}
					correctAnswer={currentQuestion.correctArtist}
					questionId={currentQuestion.id}
					hintUsed={hintUsed}
				/>
			</div>

			{/* Score display */}
			<div className="px-6 pb-4">
				<div className="text-center text-sm text-gray-600">
					Score: {gameState.totalScore} points
				</div>
			</div>
		</div>
	);
}
