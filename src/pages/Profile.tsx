import {
	Clock,
	Hash,
	LogOut,
	type LucideIcon,
	TrendingUp,
	Trophy,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { useGameData } from "../hooks/useGameData";
import { cn } from "../lib/utils";

export default function Profile() {
	const navigate = useNavigate();
	const { player, logout } = useAuth();
	const { getPlayerHistory, getLeaderboard } = useGameData();

	if (!player) {
		navigate("/");
		return null;
	}

	const gameHistory = getPlayerHistory(player.id);
	const leaderboard = getLeaderboard();
	const playerRank =
		leaderboard.findIndex((entry) => entry.playerName === player.name) + 1;

	// Calculate stats
	const totalGames = gameHistory.length;
	const totalScore = gameHistory.reduce((sum, game) => sum + game.score, 0);
	const bestScore = Math.max(...gameHistory.map((game) => game.score), 0);
	const averageScore = totalGames > 0 ? Math.round(totalScore / totalGames) : 0;
	const totalTime = gameHistory.reduce((sum, game) => sum + game.timeSpent, 0);
	const averageTime = totalGames > 0 ? Math.round(totalTime / totalGames) : 0;

	const handleLogout = () => {
		logout();
		navigate("/");
	};

	const StatCard = ({
		icon: Icon,
		label,
		value,
		color = "orange",
	}: {
		icon: LucideIcon;
		label: string;
		value: string | number;
		color?: string;
	}) => {
		const colorClasses = {
			bg:
				color === "orange"
					? "bg-orange-100"
					: color === "blue"
						? "bg-blue-100"
						: "bg-gray-100",
			text:
				color === "orange"
					? "text-orange-600"
					: color === "blue"
						? "text-blue-600"
						: "text-gray-600",
		};

		return (
			<div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
				<div className="flex items-center gap-3">
					<div className={cn("p-3 rounded-full", colorClasses.bg)}>
						<Icon className={cn("w-6 h-6", colorClasses.text)} />
					</div>
					<div>
						<p className="text-sm font-medium text-gray-600">{label}</p>
						<p className="text-2xl font-bold text-gray-900">{value}</p>
					</div>
				</div>
			</div>
		);
	};

	return (
		<div className="min-h-screen p-4">
			<div className="max-w-4xl mx-auto space-y-6">
				{/* Header */}
				<div className="bg-white rounded-3xl shadow-xl overflow-hidden">
					<div className="bg-gradient-to-r from-orange-600 to-orange-500 px-6 py-8 md:px-8 md:py-12">
						<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
							<div className="flex items-center gap-4">
								<div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center">
									<span className="text-2xl md:text-3xl font-bold text-orange-600">
										{player.name.charAt(0).toUpperCase()}
									</span>
								</div>
								<div>
									<h1 className="text-2xl md:text-3xl font-bold text-white">
										{player.name}
									</h1>
									{playerRank > 0 && (
										<p className="text-orange-100 font-medium">
											#{playerRank} on leaderboard
										</p>
									)}
								</div>
							</div>
							<button
								onClick={handleLogout}
								className="flex items-center justify-center rounded-full px-6 py-2 bg-white backdrop-blur text-neutral-800 hover:bg-orange-50 cursor-pointer transition-colors"
							>
								<LogOut className="w-4 h-4 mr-2" />
								Logout
							</button>
						</div>
					</div>
				</div>

				{/* Stats Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
					<StatCard
						icon={Trophy}
						label="Best Score"
						value={bestScore}
						color="yellow"
					/>
					<StatCard
						icon={Hash}
						label="Games Played"
						value={totalGames}
						color="neutral"
					/>
					<StatCard
						icon={TrendingUp}
						label="Average Score"
						value={averageScore}
						color="neutral"
					/>
					<StatCard
						icon={Clock}
						label="Avg Time"
						value={`${averageTime}s`}
						color="neutral"
					/>
				</div>

				{/* Game History */}
				<div className="bg-white rounded-3xl shadow-xl overflow-hidden">
					<div className="px-6 py-4 border-b border-gray-100">
						<h2 className="text-xl font-bold text-gray-900">Recent Games</h2>
					</div>
					<div className="px-6">
						{gameHistory.length === 0 ? (
							<div className="text-center py-12">
								<p className="text-gray-500">No games played yet</p>
								<p className="text-sm text-gray-400 mt-2">
									Start playing to see your history here!
								</p>
							</div>
						) : (
							<div>
								{gameHistory
									.slice(-10)
									.reverse()
									.map((game, index) => (
										<div
											key={index}
											className={cn(
												"flex items-center justify-between py-4",
												index !== gameHistory.slice(-10).length - 1 &&
													"border-b border-gray-100",
											)}
										>
											<div className="flex items-center gap-4">
												<div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
													<Trophy className="w-4 h-4 text-orange-600" />
												</div>
												<div>
													<p className="text-base font-semibold text-gray-900">
														{game.score} points
													</p>
													<p className="text-xs text-gray-600">
														{game.totalQuestions} questions • {game.timeSpent}s
														total
													</p>
												</div>
											</div>
											<div className="text-right">
												<p className="text-sm font-medium text-gray-900">
													{new Date(game.completedAt).toLocaleDateString("it")}
												</p>
												<p className="text-xs text-gray-500">
													{new Date(game.completedAt).toLocaleTimeString("it")}
												</p>
											</div>
										</div>
									))}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
