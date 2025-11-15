import { createContext, type ReactNode, useEffect, useState } from "react";

interface AuthPlayer {
	name: string;
	id: string;
}

interface AuthContextType {
	player: AuthPlayer | null;
	isLoggedIn: boolean;
	login: (name: string, id: string) => void;
	logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
	children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
	const [player, setPlayer] = useState<AuthPlayer | null>(null);

	useEffect(() => {
		const savedCurrentPlayer = localStorage.getItem("who-sings-current-player");

		if (savedCurrentPlayer) {
			try {
				setPlayer(JSON.parse(savedCurrentPlayer));
			} catch (error) {
				localStorage.removeItem("who-sings-current-player");
			}
		}
	}, []);

	const login = (name: string, id: string) => {
		const authPlayer: AuthPlayer = {
			name: name.trim(),
			id,
		};

		setPlayer(authPlayer);
		localStorage.setItem(
			"who-sings-current-player",
			JSON.stringify(authPlayer),
		);
	};

	const logout = () => {
		setPlayer(null);
		localStorage.removeItem("who-sings-current-player");
	};

	const value: AuthContextType = {
		player,
		isLoggedIn: player !== null,
		login,
		logout,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthContext };
