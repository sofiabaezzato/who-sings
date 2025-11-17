import { useGame } from "../hooks/useGame";

export function QuestionIndicators() {
	const { gameState } = useGame();

	return (
		<div className="px-4 mt-3 bg-white">
			<div className="flex justify-between gap-1">
				{gameState.questions.map((_: any, index: number) => {
					const isAnswered = index < gameState.answers.length;
					const isCorrect = isAnswered
						? gameState.answers[index]?.isCorrect
						: false;
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
						pillStyle += " bg-gray-300 text-gray-400";
					}

					return <div key={index} className={pillStyle} />;
				})}
			</div>
		</div>
	);
}
