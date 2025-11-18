import { AlertTriangle, Music } from "lucide-react";
import React from "react";

interface ErrorBoundaryState {
	hasError: boolean;
	error?: Error;
}

interface ErrorBoundaryProps {
	children: React.ReactNode;
	fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>;
}

export class ErrorBoundary extends React.Component<
	ErrorBoundaryProps,
	ErrorBoundaryState
> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		console.error("ErrorBoundary caught an error:", error, errorInfo);
	}

	resetError = () => {
		this.setState({ hasError: false, error: undefined });
	};

	render() {
		if (this.state.hasError) {
			const FallbackComponent = this.props.fallback || DefaultErrorFallback;
			return (
				<FallbackComponent
					error={this.state.error}
					resetError={this.resetError}
				/>
			);
		}

		return this.props.children;
	}
}

interface ErrorFallbackProps {
	error?: Error;
	resetError: () => void;
}

function DefaultErrorFallback({ error, resetError }: ErrorFallbackProps) {
	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
			<div className="bg-white rounded-3xl shadow-xl p-8 text-center max-w-md w-full">
				<div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
					<AlertTriangle className="w-8 h-8 text-red-600" />
				</div>
				<h1 className="text-2xl font-bold text-gray-800 mb-4">
					Something went wrong
				</h1>
				<p className="text-gray-600 mb-6">
					Looks like we hit a wrong note! Let's get back in tune.
				</p>
				{error && (
					<details className="mb-6 text-left">
						<summary className="cursor-pointer text-sm text-gray-500">
							Error details
						</summary>
						<pre className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded overflow-auto max-h-32">
							{error.message}
						</pre>
					</details>
				)}
				<button
					onClick={resetError}
					className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-full transition-colors duration-200 text-lg"
				>
					Try Again
				</button>
			</div>
		</div>
	);
}

export function QuizErrorFallback({ resetError }: ErrorFallbackProps) {
	return (
		<div className="flex flex-col items-center justify-center bg-white rounded-3xl shadow-xl p-8 text-center">
			<div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
				<Music className="w-6 h-6 text-orange-600" />
			</div>
			<h2 className="text-xl font-bold text-gray-800 mb-3">Quiz Error</h2>
			<p className="text-gray-600 mb-4">
				Failed to load the quiz. Let's get you back to the game!
			</p>
			<button
				onClick={resetError}
				className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-full transition-colors duration-200"
			>
				Restart Quiz
			</button>
		</div>
	);
}
