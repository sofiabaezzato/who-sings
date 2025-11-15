import "./App.css";
import { Route, Routes } from "react-router";
import { AuthProvider } from "@/contexts/AuthContext.tsx";
import {GameDataProvider} from "@/contexts/GameDataContext.tsx";
import Home from "@/pages/Home.tsx";

function App() {
	return (
		<AuthProvider>
			<GameDataProvider>
				<Routes>
					<Route index element={<Home />} />
				</Routes>
			</GameDataProvider>
		</AuthProvider>
	);
}

export default App;
