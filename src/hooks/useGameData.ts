import { useGameDataStore } from "../stores/gameDataStore";

export function useGameData() {
	return useGameDataStore();
}
