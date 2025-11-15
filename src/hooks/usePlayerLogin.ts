import { useAuth } from "./useAuth";
import { useGameData } from "./useGameData";

export function usePlayerLogin() {
	const { login: authLogin } = useAuth();
	const { allPlayers, createPlayer } = useGameData();

	const handleLogin = (name: string) => {
		const trimmedName = name.trim();

		// Check if player already exists (case-insensitive)
		const existingPlayer = allPlayers.find(
			(player) => player.name.toLowerCase() === trimmedName.toLowerCase(),
		);

		if (existingPlayer) {
			// Login with existing player
			authLogin(existingPlayer.name, existingPlayer.id);
		} else {
			// Create new player and login
			const newPlayer = createPlayer(
				trimmedName,
				`player-${crypto.randomUUID()}`,
			);
			authLogin(newPlayer.name, newPlayer.id);
		}
	};

	return {
		handleLogin,
	};
}
