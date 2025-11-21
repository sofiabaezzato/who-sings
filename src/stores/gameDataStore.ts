import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface GameResult {
	score: number;
	totalQuestions: number;
	completedAt: string;
	timeSpent: number;
}

export interface Player {
	name: string;
	id: string;
	gameHistory: GameResult[];
}

export interface LeaderboardEntry {
	playerName: string;
	bestScore: number;
	gamesPlayed: number;
}

interface GameDataStore {
	allPlayers: Player[];
	addGameResult: (playerId: string, result: GameResult) => void;
	getLeaderboard: () => LeaderboardEntry[];
	getPlayerHistory: (playerId: string) => GameResult[];
	createPlayer: (name: string, id: string) => Player;
	updatePlayer: (player: Player) => void;
}

export const useGameDataStore = create<GameDataStore>()(
	persist(
		(set, get) => ({
			allPlayers: [],

			createPlayer: (name: string, id: string): Player => {
				const newPlayer: Player = {
					name,
					id,
					gameHistory: [],
				};

				set((state) => ({
					allPlayers: [...state.allPlayers, newPlayer],
				}));

				return newPlayer;
			},

			updatePlayer: (updatedPlayer: Player) => {
				set((state) => ({
					allPlayers: state.allPlayers.map((p) =>
						p.id === updatedPlayer.id ? updatedPlayer : p,
					),
				}));
			},

			addGameResult: (playerId: string, result: GameResult) => {
				set((state) => {
					const playerIndex = state.allPlayers.findIndex(
						(p) => p.id === playerId,
					);

					const updatedPlayers = [...state.allPlayers];
					updatedPlayers[playerIndex] = {
						...updatedPlayers[playerIndex],
						gameHistory: [...updatedPlayers[playerIndex].gameHistory, result],
					};

					console.log("Game result added successfully for player:", playerId, result);
					return { allPlayers: updatedPlayers };
				});
			},

			getLeaderboard: (): LeaderboardEntry[] => {
				const { allPlayers } = get();
				return allPlayers
					.map((player) => ({
						playerName: player.name,
						bestScore: Math.max(...player.gameHistory.map((g) => g.score), 0),
						gamesPlayed: player.gameHistory.length,
					}))
					.filter((entry) => entry.gamesPlayed > 0)
					.sort((a, b) => b.bestScore - a.bestScore);
			},

			getPlayerHistory: (playerId: string): GameResult[] => {
				const { allPlayers } = get();
				const player = allPlayers.find((p) => p.id === playerId);
				return player?.gameHistory || [];
			},
		}),
		{
			name: "who-sings-game-data",
		},
	),
);
