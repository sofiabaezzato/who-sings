import { useContext } from "react";
import { GameDataContext } from "../contexts/GameDataContext";

export function useGameData() {
	const context = useContext(GameDataContext);

	if (!context) {
		throw new Error("useGameData must be used within a GameDataProvider");
	}

	return context;
}
