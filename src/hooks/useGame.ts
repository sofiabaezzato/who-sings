import { useGameStore } from "../stores/gameStore";

export function useGame() {
	return useGameStore();
}
