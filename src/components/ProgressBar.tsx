import { useTimer } from "../hooks/useTimer";
import { cn } from "../lib/utils";

interface ProgressBarProps {
	className?: string;
}

export function ProgressBar({ className = "" }: ProgressBarProps) {
	const { progress, timeRemaining } = useTimer();

	return (
		<div
			className={cn(
				"w-full bg-gray-200 rounded-full h-2 overflow-hidden",
				className,
			)}
		>
			<div
				className="h-full bg-orange-500 transition-all duration-1000 ease-linear rounded-full"
				style={{
					width: `${progress}%`,
					backgroundColor: timeRemaining <= 5 ? "#ef4444" : "#fdfcfc",
				}}
			/>
		</div>
	);
}
