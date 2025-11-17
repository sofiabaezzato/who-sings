import "./App.css";
import { Route, Routes } from "react-router";
import { Navigation } from "@/components/Navigation.tsx";
import Home from "@/pages/Home.tsx";
import Leaderboard from "@/pages/Leaderboard.tsx";
import Profile from "@/pages/Profile.tsx";
import Quiz from "@/pages/Quiz.tsx";

function App() {
	return (
		<div className="min-h-screen bg-gray-50">
			<Navigation />
			<Routes>
				<Route index element={<Home />} />
				<Route path="/quiz" element={<Quiz />} />
				<Route path="/profile" element={<Profile />} />
				<Route path="/leaderboard" element={<Leaderboard />} />
			</Routes>
		</div>
	);
}

export default App;
