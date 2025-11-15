import { createContext, type ReactNode, useEffect, useState } from "react";

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

interface LeaderboardEntry {
	playerName: string;
	bestScore: number;
	gamesPlayed: number;
}

interface GameDataContextType {
	allPlayers: Player[];
	addGameResult: (playerId: string, result: GameResult) => void;
	getLeaderboard: () => LeaderboardEntry[];
	getPlayerHistory: (playerId: string) => GameResult[];
	createPlayer: (name: string, id: string) => Player;
	updatePlayer: (player: Player) => void;
}

const GameDataContext = createContext<GameDataContextType | null>(null);

interface GameDataProviderProps {
	children: ReactNode;
}

export function GameDataProvider({ children }: GameDataProviderProps) {
	const [allPlayers, setAllPlayers] = useState<Player[]>([]);

	useEffect(() => {
		const savedAllPlayers = localStorage.getItem("who-sings-all-players");

		if (savedAllPlayers) {
			try {
				setAllPlayers(JSON.parse(savedAllPlayers));
			} catch (error) {
				localStorage.removeItem("who-sings-all-players");
			}
		}
	}, []);

	const saveToStorage = (players: Player[]) => {
		localStorage.setItem("who-sings-all-players", JSON.stringify(players));
	};

	const createPlayer = (name: string, id: string): Player => {
		const newPlayer: Player = {
			name,
			id,
			gameHistory: [],
		};

		const updatedPlayers = [...allPlayers, newPlayer];
		setAllPlayers(updatedPlayers);
		saveToStorage(updatedPlayers);

		return newPlayer;
	};

	const updatePlayer = (updatedPlayer: Player) => {
		const updatedPlayers = allPlayers.map((p) =>
			p.id === updatedPlayer.id ? updatedPlayer : p,
		);

		setAllPlayers(updatedPlayers);
		saveToStorage(updatedPlayers);
	};

	const addGameResult = (playerId: string, result: GameResult) => {
		const playerIndex = allPlayers.findIndex((p) => p.id === playerId);
		if (playerIndex === -1) return;

		const updatedPlayer: Player = {
			...allPlayers[playerIndex],
			gameHistory: [...allPlayers[playerIndex].gameHistory, result],
		};

		const updatedPlayers = [...allPlayers];
		updatedPlayers[playerIndex] = updatedPlayer;

		setAllPlayers(updatedPlayers);
		saveToStorage(updatedPlayers);
	};

	const getLeaderboard = (): LeaderboardEntry[] => {
		return allPlayers
			.map((player) => ({
				playerName: player.name,
				bestScore: Math.max(...player.gameHistory.map((g) => g.score), 0),
				gamesPlayed: player.gameHistory.length,
			}))
			.filter((entry) => entry.gamesPlayed > 0)
			.sort((a, b) => b.bestScore - a.bestScore);
	};

	const getPlayerHistory = (playerId: string): GameResult[] => {
		const player = allPlayers.find((p) => p.id === playerId);
		return player?.gameHistory || [];
	};

	const value: GameDataContextType = {
		allPlayers,
		addGameResult,
		getLeaderboard,
		getPlayerHistory,
		createPlayer,
		updatePlayer,
	};

	return (
		<GameDataContext.Provider value={value}>
			{children}
		</GameDataContext.Provider>
	);
}

export { GameDataContext };
