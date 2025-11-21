import { Play, Sparkles, Star, Zap } from "lucide-react";
import { forwardRef, memo } from "react";

interface ShareCardProps {
	playerName: string;
	totalScore: number;
	correctAnswers: number;
	totalQuestions: number;
	leaderboardPosition?: number;
}

const ShareCardComponent = forwardRef<HTMLDivElement, ShareCardProps>(
	(
		{
			playerName,
			totalScore,
			correctAnswers,
			totalQuestions,
			leaderboardPosition,
		},
		ref,
	) => {
		const accuracy = Math.round((correctAnswers / totalQuestions) * 100);

		// Note: Now using Tailwind classes with html2canvas-pro which handles modern CSS

		return (
			<div className="flex flex-col items-center">
				{/* Instagram Story Card - 9:16 aspect ratio */}
				<div
					ref={ref}
					data-share-card
					data-player-name={playerName}
					data-total-score={totalScore}
					data-correct-answers={correctAnswers}
					data-total-questions={totalQuestions}
					data-leaderboard-position={leaderboardPosition}
					className="w-96 h-[640px] rounded-3xl text-white bg-gradient-to-br from-orange-500 to-orange-600 relative box-border overflow-hidden"
				>
					{/* Background Pattern */}
					<div className="absolute inset-0 opacity-10">
						<svg width="100%" height="100%" className="fill-white">
							<pattern
								id="dots"
								x="0"
								y="0"
								width="40"
								height="40"
								patternUnits="userSpaceOnUse"
							>
								<circle cx="20" cy="20" r="2" />
							</pattern>
							<rect width="100%" height="100%" fill="url(#dots)" />
						</svg>
					</div>

					{/* Content */}
					<div className="relative z-10 h-full flex flex-col justify-between p-8">
						{/* Header */}
						<div className="text-center">
							<div className="flex items-center justify-center gap-2 mb-2">
								<Play className="w-8 h-8" />
								<h1 className="text-2xl font-bold">WHO SINGS?</h1>
							</div>
							<p className="text-orange-200 text-sm font-semibold">
								Music Quiz Challenge
							</p>
						</div>

						{/* Player & Score Section */}
						<div className="text-center">
							<div className="mb-6">
								<p className="text-orange-200 text-xs mb-1 tracking-wider">
									CHALLENGE COMPLETED BY
								</p>
								<h2 className="text-3xl font-bold">
									{playerName.toUpperCase()}
								</h2>
								{leaderboardPosition && (
									<p className="text-orange-200 text-sm mt-2 font-semibold">
										#{leaderboardPosition} ON LEADERBOARD
									</p>
								)}
							</div>

							{/* Main Score */}
							<div className="bg-white/20 backdrop-blur-sm rounded-3xl p-8 mb-6">
								<div className="text-center">
									<div className="text-6xl font-bold mb-2 leading-none">
										{totalScore}
									</div>
									<p className="text-orange-200 text-lg">POINTS</p>
								</div>
							</div>

							{/* Stats Grid */}
							<div className="grid grid-cols-2 gap-4">
								<div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center">
									<Star className="w-5 h-5 mx-auto mb-1.5" />
									<div className="text-xl font-bold mb-0.5">
										{correctAnswers}/{totalQuestions}
									</div>
									<p className="text-orange-200 text-xs">CORRECT</p>
								</div>
								<div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center">
									<Zap className="w-5 h-5 mx-auto mb-1.5" />
									<div className="text-xl font-bold mb-0.5">{accuracy}%</div>
									<p className="text-orange-200 text-xs">ACCURACY</p>
								</div>
							</div>
						</div>

						{/* Footer */}
						<div className="text-center">
							<div className="flex items-center justify-center gap-2 mb-2">
								<Sparkles className="w-6 h-6" />
								<span className="text-lg font-semibold">
									Powered by Musixmatch
								</span>
							</div>
							<p className="text-orange-200 text-xs">
								Test your music knowledge • musixmatch.com/quiz
							</p>
						</div>
					</div>
				</div>
			</div>
		);
	},
);

ShareCardComponent.displayName = "ShareCard";

export const ShareCard = memo(ShareCardComponent);
