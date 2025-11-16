import {
	createContext,
	type ReactNode,
	useCallback,
	useMemo,
	useRef,
	useState,
} from "react";

interface TimerContextType {
	timeRemaining: number;
	isRunning: boolean;
	isPaused: boolean;
	startTimer: (duration: number, onTimeout?: () => void) => void;
	pauseTimer: () => void;
	resumeTimer: () => void;
	stopTimer: () => void;
	resetTimer: () => void;
	progress: number;
}

const TimerContext = createContext<TimerContextType | null>(null);

interface TimerProviderProps {
	children: ReactNode;
}

export function TimerProvider({ children }: TimerProviderProps) {
	const [timeRemaining, setTimeRemaining] = useState(0);
	const [isRunning, setIsRunning] = useState(false);
	const [isPaused, setIsPaused] = useState(false);
	const [totalDuration, setTotalDuration] = useState(0);

	const intervalRef = useRef<NodeJS.Timeout | null>(null);
	const onTimeoutRef = useRef<(() => void) | null>(null);

	const clearExistingTimer = useCallback(() => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}
	}, []);

	const startTimer = useCallback(
		(duration: number, onTimeout?: () => void) => {
			clearExistingTimer();

			setTimeRemaining(duration);
			setTotalDuration(duration);
			setIsRunning(true);
			setIsPaused(false);
			onTimeoutRef.current = onTimeout || null;

			intervalRef.current = setInterval(() => {
				setTimeRemaining((prev) => {
					if (prev <= 1) {
						clearExistingTimer();
						setIsRunning(false);

						if (onTimeoutRef.current) {
							onTimeoutRef.current();
						}
						return 0;
					}
					return prev - 1;
				});
			}, 1000);
		},
		[clearExistingTimer],
	);

	const pauseTimer = useCallback(() => {
		if (isRunning && !isPaused) {
			clearExistingTimer();
			setIsPaused(true);
		}
	}, [isRunning, isPaused, clearExistingTimer]);

	const resumeTimer = useCallback(() => {
		if (isRunning && isPaused && timeRemaining > 0) {
			setIsPaused(false);

			intervalRef.current = setInterval(() => {
				setTimeRemaining((prev) => {
					if (prev <= 1) {
						clearExistingTimer();
						setIsRunning(false);
						setIsPaused(false);

						if (onTimeoutRef.current) {
							onTimeoutRef.current();
						}
						return 0;
					}
					return prev - 1;
				});
			}, 1000);
		}
	}, [isRunning, isPaused, timeRemaining, clearExistingTimer]);

	const stopTimer = useCallback(() => {
		clearExistingTimer();
		setTimeRemaining(0);
		setIsRunning(false);
		setIsPaused(false);
		setTotalDuration(0);
		onTimeoutRef.current = null;
	}, [clearExistingTimer]);

	const resetTimer = useCallback(() => {
		clearExistingTimer();
		setTimeRemaining(totalDuration);
		setIsRunning(false);
		setIsPaused(false);
	}, [clearExistingTimer, totalDuration]);

	const progress = useMemo(() => {
		if (totalDuration === 0) return 0;
		return ((totalDuration - timeRemaining) / totalDuration) * 100;
	}, [timeRemaining, totalDuration]);

	const value: TimerContextType = {
		timeRemaining,
		isRunning,
		isPaused,
		startTimer,
		pauseTimer,
		resumeTimer,
		stopTimer,
		resetTimer,
		progress,
	};

	return (
		<TimerContext.Provider value={value}>{children}</TimerContext.Provider>
	);
}

export { TimerContext };
