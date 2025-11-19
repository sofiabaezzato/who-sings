import { memo } from "react";
import { useGame } from "../hooks/useGame";
import type { Question } from "../stores/gameStore";

function QuestionIndicatorsComponent() {
	const { gameState } = useGame();

	return (
		<div className="px-4 mt-3 bg-white">
			<div className="flex justify-between gap-1">
				{gameState.questions.map((question: Question, index: number) => {
					const answer = gameState.answers.find(
						(a) => a.questionId === question.id,
					);
					const isAnswered = !!answer;
					const isCorrect = answer?.isCorrect || false;
					const isCurrent = index === gameState.currentQuestionIndex;

					let pillStyle =
						"flex-1 h-1.5 rounded-full transition-colors duration-200";

					if (isCurrent) {
						pillStyle += " bg-orange-300 text-white";
					} else if (isAnswered) {
						pillStyle += isCorrect
							? " bg-green-400 text-white"
							: " bg-red-400 text-white";
					} else {
						pillStyle += " bg-gray-200 text-gray-400";
					}

					return <div key={index} className={pillStyle} />;
				})}
			</div>
		</div>
	);
}

export const QuestionIndicators = memo(QuestionIndicatorsComponent);
