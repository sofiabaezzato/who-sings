import { useCallback, useState } from "react";
import { useGame } from "../hooks/useGame";
import { useGameSession } from "../hooks/useGameSession";
import { useTimer } from "../hooks/useTimer";
import { cn } from "../lib/utils";

interface AnswerOptionsProps {
	options: string[];
	correctAnswer: string;
	questionId: string;
	hintUsed: boolean;
}

export function AnswerOptions({
	options,
	correctAnswer,
	questionId,
	hintUsed,
}: AnswerOptionsProps) {
	const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
	const [showResult, setShowResult] = useState(false);
	const { answerQuestion, nextQuestion, isLastQuestion } = useGame();
	const { saveGameResult, sessionState } = useGameSession();
	const { timeRemaining, stopTimer } = useTimer();

	const handleAnswerSelect = useCallback(
		(answer: string) => {
			if (selectedAnswer || showResult) return;

			setSelectedAnswer(answer);
			setShowResult(true);
			stopTimer();

			answerQuestion(answer, timeRemaining, hintUsed);

			// Save game result if this is the last question
			if (isLastQuestion && !sessionState.isSaved) {
				console.log("Last question answered, saving game result...");
				setTimeout(() => {
					saveGameResult();
				}, 100); // Small delay to ensure game state updates
			}

			setTimeout(() => {
				nextQuestion();
				if (!isLastQuestion) {
					setSelectedAnswer(null);
					setShowResult(false);
				}
			}, 2000);
		},
		[
			selectedAnswer,
			showResult,
			answerQuestion,
			timeRemaining,
			stopTimer,
			nextQuestion,
			isLastQuestion,
			hintUsed,
			sessionState.isSaved,
			saveGameResult,
		],
	);

	const getButtonStyle = (option: string) => {
		if (!showResult) {
			return "bg-white border-gray-200 hover:border-orange-500 hover:bg-orange-50 text-gray-800";
		}

		if (option === correctAnswer) {
			return "bg-green-300 border-green-500";
		}

		if (option === selectedAnswer && option !== correctAnswer) {
			return "bg-red-300 border-red-500";
		}

		return "bg-gray-100 border-gray-200 text-gray-500";
	};

	return (
		<div className="space-y-3">
			{options.map((option, index) => (
				<button
					key={`${questionId}-${index}`}
					onClick={() => handleAnswerSelect(option)}
					disabled={showResult}
					className={cn(
						"w-full cursor-pointer p-4 rounded-xl font-medium border-2 transition-all duration-200 text-left disabled:cursor-default",
						getButtonStyle(option),
					)}
				>
					<span className="block">{option}</span>
				</button>
			))}

			{showResult && (
				<div className="text-center mt-4">
					<p
						className={cn(
							"font-medium",
							selectedAnswer === correctAnswer
								? "text-green-600"
								: "text-red-600",
						)}
					>
						{selectedAnswer === correctAnswer ? "Correct!" : "Wrong!"}
					</p>
					{selectedAnswer !== correctAnswer && (
						<p className="text-sm text-gray-600 mt-1">
							Correct answer: {correctAnswer}
						</p>
					)}
				</div>
			)}
		</div>
	);
}
