import { Award, Crown, Medal, Target, Trophy } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useGameData } from "../hooks/useGameData";

export default function Leaderboard() {
	const { getLeaderboard } = useGameData();
	const { player } = useAuth();
	const leaderboard = getLeaderboard();

	const getRankIcon = (rank: number) => {
		switch (rank) {
			case 1:
				return <Crown className="w-6 h-6 text-yellow-500" />;
			case 2:
				return <Medal className="w-6 h-6 text-gray-400" />;
			case 3:
				return <Award className="w-6 h-6 text-amber-600" />;
			default:
				return <Trophy className="w-5 h-5 text-orange-500" />;
		}
	};

	const getRankBadgeColor = (rank: number) => {
		switch (rank) {
			case 1:
				return "bg-gradient-to-r from-yellow-400 to-yellow-500 text-white";
			case 2:
				return "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800";
			case 3:
				return "bg-gradient-to-r from-amber-400 to-amber-600 text-white";
			default:
				return "bg-orange-100 text-orange-800";
		}
	};

	return (
		<div className="min-h-screen p-4">
			<div className="max-w-4xl mx-auto">
				{/* Header */}
				<div
					className={`bg-white rounded-t-3xl shadow-xl overflow-hidden ${leaderboard.length === 0 && "rounded-3xl mb-6"}`}
				>
					<div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-8 md:px-8 md:py-12">
						<div className="flex flex-col items-center text-center">
							<div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center mb-4">
								<Trophy className="w-8 h-8 md:w-10 md:h-10 text-orange-600" />
							</div>
							<h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
								Leaderboard
							</h1>
							<p className="text-orange-100">Top performers in Who Sings</p>
						</div>
					</div>
				</div>

				{leaderboard.length > 0 && (
					<div
						className={`bg-white rounded-b-2xl shadow-lg p-6 mb-6 ${leaderboard.length === 0 && "rounded-2xl"}`}
					>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
							<div>
								<div className="text-2xl font-bold text-orange-600">
									{leaderboard.length}
								</div>
								<div className="text-sm text-gray-600">Total Players</div>
							</div>
							<div>
								<div className="text-2xl font-bold text-orange-600">
									{leaderboard[0]?.bestScore || 0}
								</div>
								<div className="text-sm text-gray-600">Top Score</div>
							</div>
							<div>
								<div className="text-2xl font-bold text-orange-600">
									{leaderboard.reduce(
										(sum, entry) => sum + entry.gamesPlayed,
										0,
									)}
								</div>
								<div className="text-sm text-gray-600">Games Played</div>
							</div>
						</div>
					</div>
				)}

				{/* Leaderboard */}
				<div className="bg-white rounded-3xl shadow-xl overflow-hidden">
					{leaderboard.length === 0 ? (
						<div className="p-12 text-center">
							<div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
								<Target className="w-10 h-10 text-gray-400" />
							</div>
							<h3 className="text-xl font-semibold text-gray-900 mb-2">
								No scores yet!
							</h3>
							<p className="text-gray-600 mb-6">
								Be the first to play and claim the top spot.
							</p>
						</div>
					) : (
						<div className="p-6">
							{leaderboard.map((entry, index) => {
								const rank = index + 1;
								const isCurrentPlayer =
									player && entry.playerName === player.name;

								return (
									<div
										key={`${entry.playerName}-${rank}`}
										className={`flex items-center justify-between py-4 ${
											index !== leaderboard.length - 1
												? "border-b border-gray-100"
												: ""
										} ${isCurrentPlayer ? "bg-orange-50 -mx-6 px-6 rounded-lg" : ""}`}
									>
										<div className="flex items-center gap-4 flex-1">
											{/* Rank */}
											<div
												className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${getRankBadgeColor(rank)}`}
											>
												{rank <= 3 ? (
													<div className="scale-75">{getRankIcon(rank)}</div>
												) : (
													rank
												)}
											</div>

											{/* Player Info */}
											<div className="flex-1 min-w-0">
												<div className="flex items-center gap-2">
													<h3 className="text-base font-semibold text-gray-900 truncate">
														{entry.playerName}
													</h3>
													{isCurrentPlayer && (
														<span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
															You
														</span>
													)}
												</div>
												<p className="text-xs text-gray-600">
													{entry.gamesPlayed} game
													{entry.gamesPlayed !== 1 ? "s" : ""} played
												</p>
											</div>
										</div>

										{/* Score */}
										<div className="text-right">
											<div className="text-xl font-bold text-gray-900">
												{entry.bestScore}
											</div>
											<div className="text-xs text-gray-600">best score</div>
										</div>
									</div>
								);
							})}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
